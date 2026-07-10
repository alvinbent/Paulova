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

export interface ModuleWorkspace {
  metrics: Array<{ label: string; value: string; icon: string }>;
  records: Array<{
    title: string;
    subject: string;
    meta: string;
    state: string;
  }>;
  actions: Array<{ label: string; href: string; icon: string }>;
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

export const moduleWorkspaces: Record<string, ModuleWorkspace> = {
  "/doctor/historias-clinicas": {
    metrics: [
      { label: "Borradores", value: "4", icon: "edit_note" },
      { label: "Por firmar", value: "2", icon: "signature" },
      { label: "Transcribir", value: "1", icon: "record_voice_over" },
    ],
    records: [
      {
        title: "Historia pendiente de revision",
        subject: "Sofia Rodriguez",
        meta: "Comparar dictado con borrador IA antes de firmar",
        state: "Revision",
      },
      {
        title: "Transcripcion lista",
        subject: "Valeria Cardenas",
        meta: "Requiere correccion manual de producto y zona",
        state: "Borrador",
      },
      {
        title: "Consulta sin cierre",
        subject: "Mateo Gomez",
        meta: "Falta recomendacion y proximo control",
        state: "Pendiente",
      },
    ],
    actions: [
      { label: "Nueva consulta", href: "/doctor/pacientes", icon: "mic" },
      { label: "Ver pendientes", href: "/doctor/alertas", icon: "task_alt" },
      { label: "Torre control", href: "/doctor/torre-control", icon: "monitoring" },
    ],
  },
  "/doctor/productos": {
    metrics: [
      { label: "Lotes activos", value: "18", icon: "science" },
      { label: "Por vencer", value: "3", icon: "event_busy" },
      { label: "Bloqueados", value: "1", icon: "block" },
    ],
    records: [
      {
        title: "Dysport 500U",
        subject: "Lote DY-0726",
        meta: "Stock sobre minimo, validar cadena de frio",
        state: "Disponible",
      },
      {
        title: "Acido Hialuronico Ultra 4",
        subject: "Lote AH-1026",
        meta: "Requiere confirmacion de vencimiento",
        state: "Revision",
      },
      {
        title: "Bioestimulador",
        subject: "Lote BC-0526",
        meta: "No permitir uso hasta actualizar inventario",
        state: "Bloqueado",
      },
    ],
    actions: [
      { label: "Registrar entrada", href: "/doctor/inventario", icon: "add_box" },
      { label: "Solicitar compra", href: "/doctor/solicitudes", icon: "shopping_cart" },
      { label: "Alertas", href: "/doctor/alertas", icon: "notifications_active" },
    ],
  },
  "/doctor/insumos": {
    metrics: [
      { label: "Disponibles", value: "42", icon: "inventory_2" },
      { label: "Minimo", value: "5", icon: "warning" },
      { label: "Salidas hoy", value: "9", icon: "outbox" },
    ],
    records: [
      {
        title: "Jeringas 1 ml",
        subject: "Procedimientos",
        meta: "Consumo alto esta semana",
        state: "Minimo",
      },
      {
        title: "Agujas 30G",
        subject: "Insumo esteril",
        meta: "Registrar nueva entrada antes de agenda del viernes",
        state: "Solicitar",
      },
      {
        title: "Gasas esteriles",
        subject: "Cabina clinica",
        meta: "Stock ideal completo",
        state: "OK",
      },
    ],
    actions: [
      { label: "Registrar salida", href: "/doctor/inventario", icon: "remove_circle" },
      { label: "Ajustar stock", href: "/doctor/inventario", icon: "tune" },
      { label: "Crear solicitud", href: "/doctor/solicitudes", icon: "shopping_cart" },
    ],
  },
  "/doctor/solicitudes": {
    metrics: [
      { label: "Borradores", value: "2", icon: "draft" },
      { label: "Pendientes", value: "3", icon: "schedule" },
      { label: "Recibidas", value: "1", icon: "inventory" },
    ],
    records: [
      {
        title: "Pedido insumos cabina",
        subject: "Proveedor principal",
        meta: "Faltan cantidades de agujas y guantes",
        state: "Borrador",
      },
      {
        title: "Reposicion toxina",
        subject: "Proveedor farmaceutico",
        meta: "Esperando confirmacion de disponibilidad",
        state: "Enviada",
      },
      {
        title: "Material post-procedimiento",
        subject: "Compras Paunova",
        meta: "Recepcion parcial registrada",
        state: "Parcial",
      },
    ],
    actions: [
      { label: "Nueva solicitud", href: "/doctor/solicitudes", icon: "add_shopping_cart" },
      { label: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
      { label: "Alertas compra", href: "/doctor/alertas", icon: "warning" },
    ],
  },
  "/doctor/seguimientos": {
    metrics: [
      { label: "Hoy", value: "5", icon: "today" },
      { label: "Vencidos", value: "3", icon: "event_busy" },
      { label: "Semana", value: "14", icon: "date_range" },
    ],
    records: [
      {
        title: "Control 24 horas",
        subject: "Sofia Rodriguez",
        meta: "Confirmar inflamacion y signos de alarma",
        state: "Hoy",
      },
      {
        title: "Control 7 dias",
        subject: "Mateo Gomez",
        meta: "Enviar seguimiento manual por WhatsApp",
        state: "Pendiente",
      },
      {
        title: "Repeticion sugerida",
        subject: "Valeria Cardenas",
        meta: "La doctora debe definir fecha, no automatizar",
        state: "Revision",
      },
    ],
    actions: [
      { label: "Ver pacientes", href: "/doctor/pacientes", icon: "group" },
      { label: "Agenda", href: "/doctor/agenda", icon: "calendar_today" },
      { label: "Alertas", href: "/doctor/alertas", icon: "notifications_active" },
    ],
  },
  "/doctor/alertas": {
    metrics: [
      { label: "Rojas", value: "2", icon: "priority_high" },
      { label: "Naranjas", value: "4", icon: "warning" },
      { label: "Amarillas", value: "7", icon: "error" },
    ],
    records: [
      {
        title: "Producto sin stock",
        subject: "Inventario",
        meta: "Bloquear uso hasta entrada confirmada",
        state: "Roja",
      },
      {
        title: "Historia sin firma",
        subject: "Sofia Rodriguez",
        meta: "Documento no debe cerrarse automaticamente",
        state: "Naranja",
      },
      {
        title: "Seguimiento vencido",
        subject: "Mateo Gomez",
        meta: "Control manual pendiente",
        state: "Amarilla",
      },
    ],
    actions: [
      { label: "Resolver alerta", href: "/doctor/alertas", icon: "task_alt" },
      { label: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
      { label: "Seguimientos", href: "/doctor/seguimientos", icon: "event_repeat" },
    ],
  },
};
