export interface ClinicService {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalDurationMinutes: number;
  modality: "Presencial" | "Virtual" | "Ambas";
  startingPriceCop: number;
  priceDisclaimer: string;
  indications: string[];
  contraindications: string[];
  postCare: string[];
  faq: { question: string; answer: string }[];
}

export const clinicServices: ClinicService[] = [
  {
    id: "s_valoracion",
    name: "Valoración Inicial",
    category: "Consulta",
    description: "Consulta de diagnóstico y plan de tratamiento personalizado con la Dra. Carolina Aguirre.",
    typicalDurationMinutes: 30,
    modality: "Ambas",
    startingPriceCop: 150000,
    priceDisclaimer: "El valor de la valoración se abona al tratamiento si se realiza el mismo día.",
    indications: ["Primerizos en medicina estética", "Evaluación de arrugas, manchas o flacidez"],
    contraindications: [],
    postCare: [],
    faq: [
      {
        question: "¿Qué se hace en la valoración?",
        answer: "La Dra. Carolina evalúa la calidad de tu piel, estructura facial, y diseña un plan estético acorde a tus metas y necesidades físicas reales."
      }
    ]
  },
  {
    id: "s_hydrash",
    name: "Limpieza Facial Hydrash Profunda",
    category: "Cuidado de Piel",
    description: "Tratamiento de hidro-dermoabrasión que limpia, exfolia, extrae impurezas e hidrata la piel mediante sueros antioxidantes y nutritivos.",
    typicalDurationMinutes: 60,
    modality: "Presencial",
    startingPriceCop: 220000,
    priceDisclaimer: "Sujeto a valoración según adiciones de mascarillas o peelings suaves.",
    indications: ["Poros obstruidos", "Piel opaca o deshidratada", "Exceso de grasa o puntos negros"],
    contraindications: ["Acné inflamatorio severo", "Heridas abiertas", "Infecciones activas como herpes labial"],
    postCare: [
      "Evitar el maquillaje por las próximas 12 horas.",
      "Aplicar abundante protector solar SPF 50+ cada 3-4 horas.",
      "Evitar exposición directa al sol, saunas o turcos por 48 horas."
    ],
    faq: [
      {
        question: "¿Duele el tratamiento?",
        answer: "No, es un procedimiento indoloro y relajante. Se siente una leve succión y sensación de frescura en la piel."
      }
    ]
  },
  {
    id: "s_toxina",
    name: "Toxina Botulínica",
    category: "Inyectable",
    description: "Aplicación de toxina botulínica (Dysport o Botox) para relajar los músculos del tercio superior y suavizar líneas de expresión.",
    typicalDurationMinutes: 45,
    modality: "Presencial",
    startingPriceCop: 950000,
    priceDisclaimer: "El valor final depende del número de unidades requeridas por el paciente.",
    indications: ["Líneas en frente", "Entrecejo", "Patas de gallo", "Arrugas de expresión dinámicas"],
    contraindications: ["Embarazo y lactancia", "Enfermedades neuromusculares (Miastenia Gravis)", "Infección en el sitio de inyección"],
    postCare: [
      "No acostarse ni realizar ejercicio físico durante las 4 horas posteriores.",
      "Evitar masajear o presionar la zona tratada durante las primeras 24 horas.",
      "No exponerse a fuentes de calor extremo (baños calientes, saunas) por 3 días."
    ],
    faq: [
      {
        question: "¿Cuánto dura el efecto?",
        answer: "El efecto completo se aprecia entre el día 4 y el 14, y tiene una duración promedio de 4 a 6 meses según el metabolismo de cada paciente."
      }
    ]
  },
  {
    id: "s_hialuronico",
    name: "Ácido Hialurónico",
    category: "Inyectable",
    description: "Relleno dérmico biodegradable de ácido hialurónico para restaurar volúmenes, perfilar labios y redefinir contornos faciales.",
    typicalDurationMinutes: 60,
    modality: "Presencial",
    startingPriceCop: 1200000,
    priceDisclaimer: "Precio por jeringa de 1ml. Varía según la marca elegida (Juvederm o Restylane) y cantidad de jeringas.",
    indications: ["Pérdida de volumen en pómulos u ojeras", "Surco nasogeniano marcado", "Perfilado e hidratación labial"],
    contraindications: ["Embarazo y lactancia", "Enfermedades autoinmunes activas", "Antecedentes de alergia al ácido hialurónico"],
    postCare: [
      "Evitar realizar ejercicio físico intenso por 24 horas.",
      "No presionar, morder o masajear de forma vigorosa la zona inyectada.",
      "Evitar el consumo de alcohol y aspirinas por 48 horas para prevenir hematomas."
    ],
    faq: [
      {
        question: "¿Es inmediato el resultado?",
        answer: "Sí, los resultados se aprecian al instante. Sin embargo, el resultado final se observa a las 2 semanas una vez que ceda la inflamación normal del tejido."
      }
    ]
  },
  {
    id: "s_bioestimuladores",
    name: "Bioestimuladores de Colágeno",
    category: "Inyectable",
    description: "Tratamiento inyectable que estimula la producción natural de colágeno del cuerpo, combatiendo la flacidez y mejorando la tensión cutánea.",
    typicalDurationMinutes: 60,
    modality: "Presencial",
    startingPriceCop: 1800000,
    priceDisclaimer: "El valor depende del producto utilizado (Radiesse o Sculptra) y de las zonas a tratar.",
    indications: ["Flacidez facial o corporal", "Pérdida de elasticidad", "Envejecimiento cutáneo"],
    contraindications: ["Embarazo y lactancia", "Infección en el área a tratar", "Antecedentes de cicatrización queloide"],
    postCare: [
      "Realizar masajes suaves en la zona tratada 5 veces al día durante 5 días (regla 5-5-5 si se usa Sculptra).",
      "Aplicar protector solar SPF 50+.",
      "Evitar saunas y ejercicio vigoroso por 48 horas."
    ],
    faq: [
      {
        question: "¿Cuándo se notan los resultados?",
        answer: "Los bioestimuladores no son rellenos inmediatos; estimulan tu propio colágeno. Los resultados comienzan a ser visibles a partir del segundo mes y mejoran progresivamente hasta el sexto mes."
      }
    ]
  },
  {
    id: "s_laser",
    name: "Láser Nd YAG Q-Switched",
    category: "Tecnología",
    description: "Tratamiento láser avanzado para la eliminación progresiva de manchas, tatuajes y rejuvenecimiento cutáneo no ablativo.",
    typicalDurationMinutes: 45,
    modality: "Presencial",
    startingPriceCop: 450000,
    priceDisclaimer: "Por sesión. Se requiere valoración para determinar el número de sesiones necesarias.",
    indications: ["Melasma o manchas solares", "Tatuajes indeseados", "Lentigos solares o rojeces"],
    contraindications: ["Piel extremadamente bronceada recientemente", "Embarazo", "Uso de medicamentos fotosensibilizantes (Isotretinoína/Roaccutan) en los últimos 6 meses"],
    postCare: [
      "Uso obligatorio y estricto de protector solar SPF 50+ cada 3 horas.",
      "Evitar exposición solar directa por 15 días.",
      "Aplicar crema hidratante y regeneradora formulada."
    ],
    faq: [
      {
        question: "¿Genera incapacidad?",
        answer: "Es un tratamiento no ablativo, por lo que la piel solo presentará un enrojecimiento leve durante unas pocas horas. Puedes retomar tus actividades diarias inmediatamente."
      }
    ]
  },
  {
    id: "s_nanopore",
    name: "Micropunción Nanopore",
    category: "Tecnología",
    description: "Dispositivo de micropunción eléctrica que estimula la regeneración celular y facilita la penetración profunda de principios activos personalizados.",
    typicalDurationMinutes: 45,
    modality: "Presencial",
    startingPriceCop: 380000,
    priceDisclaimer: "Incluye la ampolleta de principios activos estériles según necesidad de la piel.",
    indications: ["Cicatrices de acné", "Líneas de expresión finas", "Poros dilatados y estrías"],
    contraindications: ["Acné activo pustuloso", "Trastornos de coagulación", "Embarazo y lactancia"],
    postCare: [
      "No lavar la cara durante las siguientes 8 horas para permitir la absorción de los principios activos.",
      "Evitar el maquillaje y el ejercicio físico por 24 horas.",
      "Uso de protector solar físico SPF 50+ a partir del día siguiente."
    ],
    faq: [
      {
        question: "¿Duele?",
        answer: "Se siente una vibración y un cosquilleo leve sobre la piel. Se tolera perfectamente sin necesidad de anestesia tópica."
      }
    ]
  },
  {
    id: "s_led",
    name: "Spectrum Mask (Terapia LED)",
    category: "Cuidado de Piel",
    description: "Terapia de luz LED de amplio espectro que estimula el colágeno, reduce bacterias del acné y desinflama la piel después de otros procedimientos.",
    typicalDurationMinutes: 20,
    modality: "Presencial",
    startingPriceCop: 80000,
    priceDisclaimer: "Suele programarse en combo junto a la Limpieza Hydrash o Nanopore.",
    indications: ["Inflamación post-procedimiento", "Acné leve", "Estimulación celular general"],
    contraindications: ["Claustrofobia severa", "Uso de medicamentos fotosensibles", "Historial de convulsiones inducidas por luz"],
    postCare: ["Aplicar protector solar."],
    faq: [
      {
        question: "¿Qué colores de luz se usan?",
        answer: "Luz roja para estimular colágeno y desinflamar; luz azul para combatir bacterias del acné; y luz infrarroja para cicatrización profunda."
      }
    ]
  },
  {
    id: "s_revitalizacion",
    name: "Revitalización Profunda",
    category: "Inyectable",
    description: "Microinyecciones de vitaminas, aminoácidos y ácido hialurónico no reticulado para hidratar y dar luminosidad instantánea a la piel.",
    typicalDurationMinutes: 45,
    modality: "Presencial",
    startingPriceCop: 600000,
    priceDisclaimer: "Por sesión. Recomendado protocolo de 3 sesiones.",
    indications: ["Piel deshidratada", "Líneas de expresión muy finas", "Pérdida de brillo facial"],
    contraindications: ["Embarazo y lactancia", "Infección activa en la piel"],
    postCare: [
      "Evitar el maquillaje por 24 horas.",
      "Evitar el ejercicio físico intenso por 24 horas.",
      "Protección solar constante."
    ],
    faq: [
      {
        question: "¿Quedan marcas?",
        answer: "Pueden quedar pequeños puntos de inflamación (pápulas) en los sitios de inyección que desaparecen espontáneamente en 24 a 48 horas."
      }
    ]
  }
];

export function getServiceById(id: string): ClinicService | undefined {
  return clinicServices.find((s) => s.id === id);
}

export function searchServiceByName(name: string): ClinicService | undefined {
  const norm = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return clinicServices.find((s) => {
    const sNorm = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return sNorm.includes(norm) || norm.includes(sNorm);
  });
}
