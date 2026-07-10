export type OperationalStatus = "ready" | "draft" | "blocked" | "review";

export interface DoctorModule {
  title: string;
  eyebrow: string;
  href: string;
  icon: string;
  summary: string;
  status: OperationalStatus;
  primaryAction: string;
  checkpoints: string[];
}

export interface ControlMetric {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "green" | "rose" | "blue";
  icon: string;
}

export const doctorModules: DoctorModule[] = [
  {
    title: "Pacientes",
    eyebrow: "CRM clinico",
    href: "/doctor/pacientes",
    icon: "group",
    summary:
      "Busqueda avanzada, ficha integral, seguimiento y acceso rapido al expediente estetico.",
    status: "ready",
    primaryAction: "Abrir pacientes",
    checkpoints: [
      "Nombre, documento, telefono, ciudad y tratamiento",
      "Pacientes nuevos, activos, sin control e internacionales",
      "Separacion entre informacion clinica y datos comerciales",
    ],
  },
  {
    title: "Historias clinicas",
    eyebrow: "Borradores IA",
    href: "/doctor/historias-clinicas",
    icon: "clinical_notes",
    summary:
      "Flujo de dictado, transcripcion, comparacion y aprobacion por la doctora.",
    status: "draft",
    primaryAction: "Ver flujo",
    checkpoints: [
      "La IA solo organiza informacion dictada o escrita",
      "Toda historia queda como borrador hasta revision",
      "Historias firmadas requieren nota aclaratoria para cambios",
    ],
  },
  {
    title: "Productos",
    eyebrow: "Lotes y aplicacion",
    href: "/doctor/productos",
    icon: "science",
    summary:
      "Registro de producto, marca, lote, vencimiento, unidad, zona y observaciones.",
    status: "draft",
    primaryAction: "Ver productos",
    checkpoints: [
      "Bloqueo de lotes vencidos o sin stock",
      "Descuento automatico al guardar tratamiento",
      "Movimiento auditado por paciente y consulta",
    ],
  },
  {
    title: "Insumos",
    eyebrow: "Consumo operativo",
    href: "/doctor/insumos",
    icon: "vaccines",
    summary:
      "Control de jeringas, agujas, gasas, guantes y elementos generales de procedimiento.",
    status: "draft",
    primaryAction: "Ver insumos",
    checkpoints: [
      "Entradas, salidas, ajustes y reportes de perdida",
      "Consumo mensual y proxima compra sugerida",
      "Salida asociada a paciente, consulta y usuario",
    ],
  },
  {
    title: "Inventario",
    eyebrow: "Stock y vencimientos",
    href: "/doctor/inventario",
    icon: "inventory_2",
    summary:
      "Disponibilidad actual, minimo, criticos y actualizacion manual con fallback local.",
    status: "ready",
    primaryAction: "Abrir inventario",
    checkpoints: [
      "Stock minimo e ideal por producto",
      "Alertas por vencimiento a 90, 60, 30 y 15 dias",
      "Preparado para Google Sheets y Supabase",
    ],
  },
  {
    title: "Solicitudes",
    eyebrow: "Compras",
    href: "/doctor/solicitudes",
    icon: "shopping_cart",
    summary:
      "Carrito de solicitud para proveedores con estados y mensaje listo para WhatsApp o correo.",
    status: "draft",
    primaryAction: "Crear solicitud",
    checkpoints: [
      "Borrador, pendiente, aprobada, enviada y recibida",
      "Recepcion parcial y cancelacion con motivo",
      "Texto generado sin envio automatico en esta fase",
    ],
  },
  {
    title: "Seguimientos",
    eyebrow: "Controles",
    href: "/doctor/seguimientos",
    icon: "event_repeat",
    summary:
      "Controles por horas, dias, semanas o meses, ajustados por paciente y tratamiento.",
    status: "review",
    primaryAction: "Ver controles",
    checkpoints: [
      "Control a 24 horas, 7, 15 y 30 dias",
      "Repeticion sugerida sin programacion automatica fija",
      "Encuesta, resena y WhatsApp como acciones futuras",
    ],
  },
  {
    title: "Alertas",
    eyebrow: "Riesgo operativo",
    href: "/doctor/alertas",
    icon: "notifications_active",
    summary:
      "Priorizacion de stock bajo, historias pendientes, vencimientos y controles vencidos.",
    status: "review",
    primaryAction: "Revisar alertas",
    checkpoints: [
      "Semaforo amarillo, naranja y rojo",
      "Transcripciones e historias pendientes",
      "Solicitud de compra pendiente",
    ],
  },
  {
    title: "Torre de Control",
    eyebrow: "Operacion global",
    href: "/doctor/torre-control",
    icon: "monitoring",
    summary:
      "Vista ejecutiva de citas, pacientes, inventario, solicitudes e integraciones.",
    status: "ready",
    primaryAction: "Abrir torre",
    checkpoints: [
      "Citas de hoy y pacientes nuevos",
      "Historias y transcripciones pendientes",
      "Estado de Google Sheets, Calendar, OpenAI y Vercel",
    ],
  },
];

export const controlMetrics: ControlMetric[] = [
  {
    label: "Citas hoy",
    value: "6",
    detail: "2 valoraciones, 3 controles, 1 procedimiento",
    tone: "gold",
    icon: "calendar_today",
  },
  {
    label: "Historias pendientes",
    value: "4",
    detail: "Borradores requieren revision y firma",
    tone: "rose",
    icon: "clinical_notes",
  },
  {
    label: "Inventario critico",
    value: "3",
    detail: "1 agotado y 2 en minimo",
    tone: "blue",
    icon: "inventory",
  },
  {
    label: "Seguimientos",
    value: "8",
    detail: "3 vencidos, 5 programados",
    tone: "green",
    icon: "event_repeat",
  },
];

export const clinicalFlow = [
  "Crear consulta",
  "Iniciar dictado o escribir manualmente",
  "Transcribir y corregir",
  "Organizar con IA como borrador",
  "Comparar transcripcion vs resumen",
  "Revisar, aprobar y firmar",
];

export const integrationStates = [
  {
    name: "Google Sheets",
    status: "Preparado",
    detail: "Base desacoplada con fallback local y variables de entorno.",
  },
  {
    name: "Google Calendar + Meet",
    status: "Preparado",
    detail: "Usa conferenceData.createRequest con requestId unico.",
  },
  {
    name: "OpenAI",
    status: "Borrador clinico",
    detail: "Organiza texto dictado, no diagnostica ni cierra historias.",
  },
  {
    name: "WhatsApp",
    status: "Siguiente fase",
    detail: "Mensajes sugeridos sin envio automatico todavia.",
  },
  {
    name: "Vercel",
    status: "Produccion",
    detail: "Despliegue conectado a GitHub/main.",
  },
];
