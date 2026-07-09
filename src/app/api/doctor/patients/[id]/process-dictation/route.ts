import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { InventoryItem } from "@/lib/db";

type DictationResult = {
  clinicalReport: string;
  treatmentName: string;
  productUsedId: string | null;
  productQuantityUsed: number | null;
};

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Falta el texto de la transcripción" }, { status: 400 });
    }

    const inventory = await db.getInventory();
    const apiKey = process.env.OPENAI_API_KEY;

    let result: DictationResult;

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `Eres un transcriptor clínico médico especializado para la Dra Carolina Aguirre - Paunova Skin & Age Clinic.
                Tu tarea es procesar el texto transcrito de un dictado médico durante un tratamiento y generar un JSON estructurado.
                
                Inventario de insumos disponibles (asocia estrictamente a estos IDs y nombres si se mencionan):
                ${JSON.stringify(inventory.map((i) => ({ id: i.id, name: i.name, unitName: i.unitName })))}
                
                Debes retornar estrictamente un objeto JSON con el siguiente formato:
                {
                  "clinicalReport": "Un informe redactado profesionalmente para la historia clínica. Debe detallar la evolución, técnica de aplicación y estado del paciente en base a la transcripción cruda.",
                  "treatmentName": "Nombre del tratamiento realizado (debe ser uno de: 'Limpieza Facial Hydrash Profunda', 'Toxina Botulínica', 'Ácido Hialurónico', 'Bioestimuladores de Colágeno', 'Láser Nd YAG Q-Switched', 'Micropunción Nanopore', 'Spectrum Mask (Terapia LED)', 'Revitalización Profunda')",
                  "productUsedId": "ID del producto de inventario si se utilizó alguno, o null si ninguno",
                  "productQuantityUsed": número de unidades utilizadas (ej. 2 viales, 50 unidades, 1 tubo, etc.) o null si ninguno
                }`,
              },
              {
                role: "user",
                content: `Texto crudo de la sesión clínica: "${text}"`,
              },
            ],
          }),
        });

        const data = (await response.json()) as OpenAIChatResponse;
        if (response.ok) {
          const content = data.choices?.[0]?.message?.content;
          if (!content) {
            throw new Error("OpenAI response missing content");
          }
          result = JSON.parse(content) as DictationResult;
        } else {
          console.error("OpenAI API Error:", data);
          throw new Error("OpenAI call failed");
        }
      } catch (err) {
        console.error("Failing back to regex parser:", err);
        result = fallbackParser(text, inventory);
      }
    } else {
      result = fallbackParser(text, inventory);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al procesar el dictado" }, { status: 500 });
  }
}

function fallbackParser(text: string, inventory: InventoryItem[]): DictationResult {
  const lowerText = text.toLowerCase();
  let treatmentName = "Revitalización Profunda";
  let productUsedId: string | null = null;
  let productQuantityUsed: number | null = null;

  // Infer treatment
  if (lowerText.includes("hydrash") || lowerText.includes("limpieza") || lowerText.includes("facial")) {
    treatmentName = "Limpieza Facial Hydrash Profunda";
  } else if (lowerText.includes("toxina") || lowerText.includes("botulinica") || lowerText.includes("botox") || lowerText.includes("dysport")) {
    treatmentName = "Toxina Botulínica";
  } else if (lowerText.includes("acido") || lowerText.includes("hialuronico") || lowerText.includes("juvederm") || lowerText.includes("relleno")) {
    treatmentName = "Ácido Hialurónico";
  } else if (lowerText.includes("nanopore") || lowerText.includes("agujas") || lowerText.includes("micropuncion")) {
    treatmentName = "Micropunción Nanopore";
  } else if (lowerText.includes("spectrum") || lowerText.includes("led") || lowerText.includes("mascara")) {
    treatmentName = "Spectrum Mask (Terapia LED)";
  } else if (lowerText.includes("bioestimulador") || lowerText.includes("sculptra") || lowerText.includes("radiesse") || lowerText.includes("colageno")) {
    treatmentName = "Bioestimuladores de Colágeno";
  }

  // Infer product and quantity
  if (treatmentName === "Toxina Botulínica") {
    productUsedId = "i2";
    const numMatch = lowerText.match(/(\d+)\s*(unidades|u|units|u\.)/);
    productQuantityUsed = numMatch ? parseInt(numMatch[1], 10) : 50;
  } else if (treatmentName === "Ácido Hialurónico") {
    productUsedId = "i1";
    const numMatch = lowerText.match(/(\d+)\s*(vial|viales|jeringa|jeringas)/);
    productQuantityUsed = numMatch ? parseInt(numMatch[1], 10) : 1;
  } else if (treatmentName === "Limpieza Facial Hydrash Profunda") {
    productUsedId = "i3";
    productQuantityUsed = 1;
  } else if (treatmentName === "Micropunción Nanopore") {
    productUsedId = "i5";
    productQuantityUsed = 1;
  } else if (treatmentName === "Spectrum Mask (Terapia LED)") {
    productUsedId = "i6";
    productQuantityUsed = 1;
  }

  const productName = productUsedId ? inventory.find((i) => i.id === productUsedId)?.name : "";
  const unitName = productUsedId ? inventory.find((i) => i.id === productUsedId)?.unitName : "";

  const cleanReport = `REPORTE DE HISTORIA CLÍNICA (IA Fallback):
El paciente asistió para tratamiento de ${treatmentName}.
Notas clínicas: "${text}".
${productUsedId ? `Insumos consumidos y registrados: ${productName} (${productQuantityUsed} ${unitName}).` : ""}`;

  return {
    clinicalReport: cleanReport,
    treatmentName,
    productUsedId,
    productQuantityUsed,
  };
}
