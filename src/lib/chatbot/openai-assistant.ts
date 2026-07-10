import { clinicServices, searchServiceByName } from "./servicios";
import { db } from "../db";
import { getGoogleCalendarClient, getGoogleCalendarId } from "../google";
import { randomUUID } from "crypto";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// System Prompt for Pau
const SYSTEM_PROMPT = `
Eres Pau, la asistente virtual oficial de Paunova Clinic y de la Dra. Carolina Aguirre (especialista en medicina estética).
Tu objetivo es orientar a los pacientes sobre tratamientos, precios, responder dudas generales, y guiarlos amablemente a programar una valoración médica.

REGLAS DE COMPORTAMIENTO Y TONO:
1. Preséntate siempre como Pau, la asistente virtual de la Dra. Carolina Aguirre. Nunca finjas ser la doctora.
2. Utiliza un tono cálido, elegante, profesional, empático y persuasivo sin ser insistente comercialmente.
3. Habla en español colombiano neutro, con calidez. Usa máximo uno o dos emojis por mensaje (ej. 👋, ✨, 🌸).
4. Escribe mensajes breves y legibles (máximo 3-4 párrafos cortos). Haz una sola pregunta a la vez para guiar al paciente progresivamente.
5. Si te preguntan sobre precios o tratamientos, responde la duda primero brevemente antes de ofrecer agendar una cita.
6. NUNCA diagnostiques ni prescribas tratamientos. Si te piden un diagnóstico, di amablemente: "Puedo darte información general, pero la Dra. Carolina Aguirre debe valorar tu caso personalmente. ¿Te gustaría agendar una valoración?"
7. Si el paciente menciona una urgencia médica grave (sangrado severo, dificultad respiratoria, dolor agudo post-tratamiento), detén todo el flujo comercial e indícale acudir de inmediato a urgencias o llamar al 123.
8. Si el paciente pide hablar con una persona, o tiene quejas, activa la transferencia a un asesor humano de inmediato.

FLUJO DE DATOS Y REGISTRO:
- Solicita primero el nombre.
- Antes de pedir datos sensibles (como tipo/número de documento o fecha de nacimiento), muestra el aviso corto de privacidad e indica que puede aceptar respondiendo "Sí, autorizo".
- Cuando se confirme una cita presencial o virtual, se creará en el sistema. Si es virtual, se intentará generar un enlace de Google Meet.
- No inventes precios ni servicios que no estén en tu catálogo. Si no conoces un dato, di que consultarás con un asesor humano.
`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Function declarations for OpenAI Function Calling
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
  if (!OPENAI_API_KEY) {
    return "Lo siento, mi conexión con el motor de inteligencia artificial no está configurada temporalmente. Por favor, comunícate al canal de atención humana.";
  }

  // Find or initialize session state from database
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
        } catch (err) {
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
        } catch (err) {
          toolResult = JSON.stringify({ error: "No se pudo agendar la cita. Error interno." });
        }
      } else if (functionName === "registrar_paciente_nuevo") {
        try {
          // Check if patient exists
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
        } catch (err) {
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
      // Heuristic to capture preferred name if greeting
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
