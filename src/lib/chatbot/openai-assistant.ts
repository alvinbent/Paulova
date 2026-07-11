import { clinicServices, searchServiceByName } from "./servicios";
import { db } from "../db";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// 1. ADVANCED SAFETY AND CLINICAL EMERGENCY HEURISTICS (Local Pre-Classifier)
// Intercepts symptoms before calling OpenAI to guarantee immediate safety response.
export function classifyLocalEmergency(message: string): boolean {
  const emergencyRegex = /\b(emergencia|sangrado|hemorragia|dolor insoportable|asfixia|ahogo|alergia grave|anafilaxia|inconsciente|desmayo|fractura|infarto|autolesion|urgencia)\b/i;
  return emergencyRegex.test(message);
}

// 2. ADVANCED HUMAN HANDOFF HEURISTICS (Local Pre-Classifier)
export function classifyLocalHumanHandoff(message: string): boolean {
  const handoffRegex = /\b(humano|asesora|persona|recepcion|doctora|hablar con alguien|queja|reclamo|no entiendo|llamada|asesor|humana)\b/i;
  return handoffRegex.test(message);
}

// 3. SYSTEM PROMPT: EL CEREBRO PUBLICITARIO Y NORMAS LEGALES (LEY 1581)
const SYSTEM_PROMPT = `
Eres Pau, la asistente virtual oficial de Paunova Clinic y de la Dra. Carolina Aguirre (especialista en medicina estética).
Tu objetivo es orientar a los pacientes sobre tratamientos, precios, responder dudas generales, y guiarlos amablemente a programar una valoración médica.

REGLAS DE MARCA Y CEREBRO PUBLICITARIO (MARKETING ÉTICO):
1. Preséntate siempre como Pau, la asistente virtual de Paunova Clinic y de la Dra. Carolina Aguirre. Nunca finjas ser la doctora.
2. Utiliza un tono cálido, elegante, profesional, empático y persuasivo sin ser comercialmente agresivo.
3. Habla en español colombiano neutro. Usa máximo uno o dos emojis por mensaje (ej. 👋, ✨).
4. No improvises valores. Si te preguntan por precios, aclara siempre que son valores iniciales ("desde") y están sujetos a valoración presencial.
5. No prometas resultados definitivos ni promuevas descuentos no autorizados. Enfatiza los beneficios educativos y el cuidado ético del paciente.
6. Si te preguntan por tratamientos, da una respuesta de 2 a 4 frases, ofrece ampliar los beneficios o preparación, y finaliza con una invitación suave a agendar valoración.

NORMAS LEGALES (LEY 1581 - PROTECCIÓN DE DATOS):
1. Antes de capturar cualquier dato personal sensible (como tipo/número de documento, fecha de nacimiento o historial clínico), debes mostrar el AVISO DE PRIVACIDAD CORTO y obtener un consentimiento afirmativo ("Sí, autorizo").
2. Si el usuario no autoriza, detén el registro de inmediato y ofrece transferir a atención humana.
3. Nunca solicites el número de documento completo en el chat principal si la política de seguridad lo desaconseja; indícale al paciente que se le enviará un link seguro para completarlo.

CRITERIOS CLÍNICOS Y DE SEGURIDAD:
1. No diagnostiques ni prescribas tratamientos.
2. Si el paciente menciona una emergencia médica, detén el flujo comercial de inmediato.
`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const tools = [
  {
    type: "function" as const,
    function: {
      name: "obtener_catalogo_servicios",
      description: "Retorna la lista de todos los tratamientos estéticos disponibles en Paunova Clinic con sus categorías y precios iniciales.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "obtener_detalles_servicio",
      description: "Obtiene los detalles específicos de un tratamiento (indicaciones, contraindicaciones, cuidados posteriores y preguntas frecuentes).",
      parameters: {
        type: "object",
        properties: {
          nombreServicio: { type: "string", description: "Nombre o término de búsqueda del tratamiento." }
        },
        required: ["nombreServicio"]
      }
    },
  },
  {
    type: "function" as const,
    function: {
      name: "consultar_disponibilidad_fecha",
      description: "Consulta los horarios ya ocupados en una fecha específica (formato YYYY-MM-DD) para determinar los espacios libres.",
      parameters: {
        type: "object",
        properties: {
          fechaStr: { type: "string", description: "La fecha a consultar en formato YYYY-MM-DD." }
        },
        required: ["fechaStr"]
      }
    },
  },
  {
    type: "function" as const,
    function: {
      name: "reservar_cita_clinica",
      description: "Crea una cita médica para el paciente. Si es videoconsulta, generará automáticamente un enlace de Google Meet si es posible.",
      parameters: {
        type: "object",
        properties: {
          patientId: { type: "string", description: "El ID del paciente en la base de datos." },
          patientName: { type: "string", description: "El nombre completo del paciente." },
          date: { type: "string", description: "La fecha elegida (YYYY-MM-DD)." },
          time: { type: "string", description: "La hora elegida (HH:MM)." },
          treatment: { type: "string", description: "El nombre del tratamiento estético o valoración." },
          notes: { type: "string", description: "Notas u observaciones del agendamiento." }
        },
        required: ["patientId", "patientName", "date", "time", "treatment"]
      }
    },
  },
  {
    type: "function" as const,
    function: {
      name: "registrar_paciente_nuevo",
      description: "Registra un nuevo paciente en el CRM clínico con sus datos básicos.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre completo del paciente." },
          telefono: { type: "string", description: "Número de teléfono celular." },
          email: { type: "string", description: "Correo electrónico." },
          birthday: { type: "string", description: "Fecha de nacimiento (YYYY-MM-DD)." }
        },
        required: ["nombre", "telefono"]
      }
    },
  },
  {
    type: "function" as const,
    function: {
      name: "solicitar_agente_humano",
      description: "Transfiere la conversación a un asesor humano del equipo de Paunova Clinic para atención personalizada.",
      parameters: { type: "object", properties: {} }
    }
  }
];

export async function processChatbotMessage(
  whatsappUserId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  // 1. Retrieve session state from Google Sheets
  let session = await db.getConversation(whatsappUserId);
  if (!session) {
    session = await db.saveConversation({
      whatsappUserId,
      patientId: "",
      state: "greeting",
      preferredName: "",
      fullName: "",
      serviceInterest: "",
      appointmentMode: "",
      consentStatus: "Pendiente",
      lastMessageAt: new Date().toISOString(),
    });
  }

  // 2. CHECK LOCAL EMERGENCY HEURISTICS (Clinical Priority)
  if (classifyLocalEmergency(userMessage)) {
    session.state = "human_agent";
    await db.saveConversation(session);
    return "🚨 *Alerta de Seguridad*: Los síntomas que mencionas podrían requerir valoración médica inmediata. Ten en cuenta que este chat no es un canal para emergencias médicas. Te recomendamos acudir de inmediato a tu servicio de urgencias más cercano o llamar al 123 (Colombia). Hemos alertado al personal de la clínica para que se comunique contigo lo antes posible.";
  }

  // 3. CHECK LOCAL HUMAN HANDOFF HEURISTICS (Handoff Priority)
  if (classifyLocalHumanHandoff(userMessage)) {
    session.state = "human_agent";
    await db.saveConversation(session);
    return "👋 He transferido tu conversación a nuestro equipo de atención humana. En un momento, una de nuestras asesoras de Paunova Clinic se comunicará contigo directamente por este chat. ¡Gracias por escribirnos!";
  }

  // 4. VERIFY IA ACTIVATION
  if (!OPENAI_API_KEY) {
    return "Lo siento, mi conexión con el motor de inteligencia artificial no está configurada temporalmente. Por favor, comunícate al canal de atención humana.";
  }

  // Build the message history
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        tools,
        tool_choice: "auto",
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return "Lo siento, tuve un problema al procesar tu solicitud. Por favor intenta de nuevo en unos minutos o solicita un asesor humano.";
    }

    const assistantMessage = data.choices[0].message;

    // Handle tool/function calls if any
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      console.log(`Pau Chatbot: Function Calling -> ${functionName}`, args);

      let toolResult = "";

      if (functionName === "obtener_catalogo_servicios") {
        toolResult = JSON.stringify(
          clinicServices.map((s) => ({
            id: s.id,
            name: s.name,
            startingPrice: `${s.startingPriceCop.toLocaleString()} COP`,
            duration: `${s.typicalDurationMinutes} minutos`,
          }))
        );
      } else if (functionName === "obtener_detalles_servicio") {
        const found = searchServiceByName(args.nombreServicio);
        if (found) {
          toolResult = JSON.stringify(found);
          session.serviceInterest = found.name;
          await db.saveConversation(session);
        } else {
          toolResult = JSON.stringify({ error: "Servicio no encontrado en el catálogo." });
        }
      } else if (functionName === "consultar_disponibilidad_fecha") {
        try {
          const appts = await db.getAppointmentsByDate(args.fechaStr);
          const occupiedTimes = appts.map((a) => a.time);
          toolResult = JSON.stringify({
            fecha: args.fechaStr,
            occupiedSlots: occupiedTimes,
            message: "Estos horarios ya están ocupados. Ofrécele al paciente los horarios libres entre las 8:00 AM y las 5:00 PM."
          });
        } catch {
          toolResult = JSON.stringify({ error: "Error consultando disponibilidad." });
        }
      } else if (functionName === "reservar_cita_clinica") {
        try {
          const appt = await db.createAppointment({
            patientId: args.patientId,
            patientName: args.patientName,
            date: args.date,
            time: args.time,
            treatment: args.treatment,
            status: "Programada",
            notes: args.notes || "Agendada desde el asistente de WhatsApp",
          });
          toolResult = JSON.stringify({
            success: true,
            appointmentId: appt.id,
            meetUrl: appt.googleMeetUrl || null,
            message: "Cita programada con éxito en Google Calendar y el sistema de la clínica."
          });
          session.state = "completed_booking";
          await db.saveConversation(session);
        } catch {
          toolResult = JSON.stringify({ error: "No se pudo agendar la cita. Error interno." });
        }
      } else if (functionName === "registrar_paciente_nuevo") {
        try {
          const patients = await db.getPatients();
          let patient = patients.find((p) => p.phone.replace(/\s+/g, "") === args.telefono.replace(/\s+/g, ""));
          if (!patient) {
            patient = await db.createPatient({
              name: args.nombre,
              phone: args.telefono,
              email: args.email || "",
              birthday: args.birthday || "",
              notes: "Registrado vía WhatsApp Assistant Pau",
            });
          }
          toolResult = JSON.stringify({
            success: true,
            patientId: patient.id,
            patientName: patient.name,
          });
          session.patientId = patient.id;
          session.fullName = patient.name;
          session.state = "waiting_booking";
          await db.saveConversation(session);
        } catch {
          toolResult = JSON.stringify({ error: "Error registrando paciente." });
        }
      } else if (functionName === "solicitar_agente_humano") {
        session.state = "human_agent";
        await db.saveConversation(session);
        toolResult = JSON.stringify({
          success: true,
          message: "Transferencia a atención humana activada. Indica al paciente que un asesor le escribirá pronto."
        });
      }

      // Feed function response back to OpenAI
      const secondResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            ...messages,
            assistantMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: toolResult,
            },
          ],
        }),
      });

      const secondData = await secondResponse.json();
      return secondData.choices[0].message.content;
    }

    // Process normal conversational responses
    const reply = assistantMessage.content;

    // State machine updates based on simple heuristics in conversation
    const lowerMessage = userMessage.toLowerCase();
    if (session.state === "greeting") {
      const nameParts = userMessage.trim().split(" ");
      if (nameParts.length > 0 && nameParts.length <= 3 && !lowerMessage.includes("hola") && !lowerMessage.includes("precio")) {
        session.preferredName = nameParts[0];
        session.state = "waiting_consent";
        await db.saveConversation(session);
      }
    } else if (session.state === "waiting_consent") {
      if (lowerMessage.includes("si") || lowerMessage.includes("autorizo") || lowerMessage.includes("acepto")) {
        session.consentStatus = "Autorizado";
        session.state = "waiting_registration";
        await db.saveConversation(session);
      } else if (lowerMessage.includes("no")) {
        session.consentStatus = "No Autorizado";
        session.state = "human_agent";
        await db.saveConversation(session);
      }
    }

    session.lastMessageAt = new Date().toISOString();
    await db.saveConversation(session);

    return reply;
  } catch (err) {
    console.error("Error communicating with OpenAI:", err);
    return "Lo siento, en este momento tengo problemas de conexión. Por favor, comunícate con un asesor humano o intenta más tarde.";
  }
}
