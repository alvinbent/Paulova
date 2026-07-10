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
    eyebrow: "CRM clínico",
    href: "/doctor/pacientes",
    icon: "group",
    summary:
      "Búsqueda avanzada, ficha integral, seguimiento y acceso rápido al expediente estético.",
    status: "ready",
    primaryAction: "Abrir pacientes",
    checkpoints: [
      "Nombre, documento, teléfono, ciudad y tratamiento",
      "Pacientes nuevos, activos, sin control e internacionales",
      "Separación entre información clínica y datos comerciales",
    ],
  },
  {
    title: "Historias clínicas",
    eyebrow: "Borradores IA",
    href: "/doctor/historias-clinicas",
    icon: "clinical_notes",
    summary:
      "Flujo de dictado, transcripción, comparación y aprobación por la doctora.",
    status: "draft",
    primaryAction: "Ver flujo",
    checkpoints: [
      "La IA solo organiza información dictada o escrita",
      "Toda historia queda como borrador hasta revisión",
      "Historias firmadas requieren nota aclaratoria para cambios",
    ],
  },
  {
    title: "Productos",
    eyebrow: "Lotes y aplicación",
    href: "/doctor/productos",
    icon: "science",
    summary:
      "Registro de producto, marca, lote, vencimiento, unidad, zona y observaciones.",
    status: "draft",
    primaryAction: "Ver productos",
    checkpoints: [
      "Bloqueo de lotes vencidos o sin existencia",
      "Descuento automático al guardar tratamiento",
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
      "Entradas, salidas, ajustes y reportes de pérdida",
      "Consumo mensual y próxima compra sugerida",
      "Salida asociada a paciente, consulta y usuario",
    ],
  },
  {
    title: "Inventario",
    eyebrow: "Existencias y vencimientos",
    href: "/doctor/inventario",
    icon: "inventory_2",
    summary:
      "Disponibilidad actual, mínimo, críticos y actualización manual con respaldo local.",
    status: "ready",
    primaryAction: "Abrir inventario",
    checkpoints: [
      "Existencia mínima e ideal por producto",
      "Alertas por vencimiento a 90, 60, 30 y 15 días",
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
      "Recepción parcial y cancelación con motivo",
      "Texto generado sin envío automático en esta fase",
    ],
  },
  {
    title: "Seguimientos",
    eyebrow: "Controles",
    href: "/doctor/seguimientos",
    icon: "event_repeat",
    summary:
      "Controles por horas, días, semanas o meses, ajustados por paciente y tratamiento.",
    status: "review",
    primaryAction: "Ver controles",
    checkpoints: [
      "Control a 24 horas, 7, 15 y 30 días",
      "Repetición sugerida sin programación automática fija",
      "Encuesta, reseña y WhatsApp como acciones futuras",
    ],
  },
  {
    title: "Alertas",
    eyebrow: "Riesgo operativo",
    href: "/doctor/alertas",
    icon: "notifications_active",
    summary:
      "Priorización de existencias bajas, historias pendientes, vencimientos y controles vencidos.",
    status: "review",
    primaryAction: "Revisar alertas",
    checkpoints: [
      "Semáforo amarillo, naranja y rojo",
      "Transcripciones e historias pendientes",
      "Solicitud de compra pendiente",
    ],
  },
  {
    title: "Reportes",
    eyebrow: "Indicadores clínicos",
    href: "/doctor/reportes",
    icon: "chart",
    summary:
      "Vista consolidada de actividad clínica, pacientes, agenda, tratamientos y alertas.",
    status: "ready",
    primaryAction: "Ver reportes",
    checkpoints: [
      "Indicadores calculados desde la base clínica local",
      "Segmentos para agenda, pacientes, inventario y actividad",
      "Preparado para exportación futura sin exponer datos sensibles",
    ],
  },
  {
    title: "Finanzas",
    eyebrow: "Rentabilidad",
    href: "/doctor/finanzas",
    icon: "money",
    summary:
      "Seguimiento de ingresos, costos de insumos, utilidad bruta y márgenes por procedimiento.",
    status: "ready",
    primaryAction: "Ver finanzas",
    checkpoints: [
      "Ingresos tomados de tratamientos con valor cobrado",
      "Costos calculados desde lotes e insumos utilizados",
      "Margen por procedimiento para decisiones administrativas",
    ],
  },
  {
    title: "Configuración",
    eyebrow: "Sistema y seguridad",
    href: "/doctor/configuracion",
    icon: "settings",
    summary:
      "Centro de control para integraciones, seguridad, permisos, marca y operación privada.",
    status: "ready",
    primaryAction: "Abrir configuración",
    checkpoints: [
      "Credenciales y variables protegidas en entorno seguro",
      "Integraciones revisables sin exponer secretos",
      "Identidad visual y protocolos listos para auditoría",
    ],
  },
  {
    title: "Torre de Control",
    eyebrow: "Operación global",
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
    detail: "Borradores requieren revisión y firma",
    tone: "rose",
    icon: "clinical_notes",
  },
  {
    label: "Inventario crítico",
    value: "3",
    detail: "1 agotado y 2 en mínimo",
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
  "Comparar transcripción vs resumen",
  "Revisar, aprobar y firmar",
];

export const integrationStates = [
  {
    name: "Google Sheets",
    status: "Preparado",
    detail: "Base desacoplada con respaldo local y variables de entorno.",
  },
  {
    name: "Google Calendar + Meet",
    status: "Preparado",
    detail: "Usa conferenceData.createRequest con requestId único.",
  },
  {
    name: "OpenAI",
    status: "Borrador clínico",
    detail: "Organiza texto dictado, no diagnostica ni cierra historias.",
  },
  {
    name: "WhatsApp",
    status: "Siguiente fase",
    detail: "Mensajes sugeridos sin envío automático todavía.",
  },
  {
    name: "Vercel",
    status: "Producción",
    detail: "Despliegue conectado a GitHub y validación de compilación.",
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
        title: "Historia pendiente de revisión",
        subject: "Sofía Rodríguez",
        meta: "Comparar dictado con borrador IA antes de firmar",
        state: "Revisión",
      },
      {
        title: "Transcripción lista",
        subject: "Valeria Cárdenas",
        meta: "Requiere corrección manual de producto y zona",
        state: "Borrador",
      },
      {
        title: "Consulta sin cierre",
        subject: "Mateo Gómez",
        meta: "Falta recomendación y próximo control",
        state: "Pendiente",
      },
    ],
    actions: [
      { label: "Nueva consulta", href: "/doctor/pacientes", icon: "mic" },
      { label: "Ver pendientes", href: "/doctor/alertas", icon: "task_alt" },
      { label: "Torre de control", href: "/doctor/torre-control", icon: "monitoring" },
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
        meta: "Existencia sobre mínimo, validar cadena de frío",
        state: "Disponible",
      },
      {
        title: "Ácido hialurónico Ultra 4",
        subject: "Lote AH-1026",
        meta: "Requiere confirmación de vencimiento",
        state: "Revisión",
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
      { label: "Mínimo", value: "5", icon: "warning" },
      { label: "Salidas hoy", value: "9", icon: "outbox" },
    ],
    records: [
      {
        title: "Jeringas 1 ml",
        subject: "Procedimientos",
        meta: "Consumo alto esta semana",
        state: "Mínimo",
      },
      {
        title: "Agujas 30G",
        subject: "Insumo estéril",
        meta: "Registrar nueva entrada antes de agenda del viernes",
        state: "Solicitar",
      },
      {
        title: "Gasas estériles",
        subject: "Cabina clínica",
        meta: "Existencia ideal completa",
        state: "OK",
      },
    ],
    actions: [
      { label: "Registrar salida", href: "/doctor/inventario", icon: "remove_circle" },
      { label: "Ajustar existencia", href: "/doctor/inventario", icon: "tune" },
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
        title: "Reposición toxina",
        subject: "Proveedor farmacéutico",
        meta: "Esperando confirmación de disponibilidad",
        state: "Enviada",
      },
      {
        title: "Material post-procedimiento",
        subject: "Compras Paunova",
        meta: "Recepción parcial registrada",
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
        subject: "Sofía Rodríguez",
        meta: "Confirmar inflamación y signos de alarma",
        state: "Hoy",
      },
      {
        title: "Control 7 días",
        subject: "Mateo Gómez",
        meta: "Enviar seguimiento manual por WhatsApp",
        state: "Pendiente",
      },
      {
        title: "Repetición sugerida",
        subject: "Valeria Cárdenas",
        meta: "La doctora debe definir fecha, no automatizar",
        state: "Revisión",
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
        title: "Producto sin existencia",
        subject: "Inventario",
        meta: "Bloquear uso hasta entrada confirmada",
        state: "Roja",
      },
      {
        title: "Historia sin firma",
        subject: "Sofía Rodríguez",
        meta: "Documento no debe cerrarse automáticamente",
        state: "Naranja",
      },
      {
        title: "Seguimiento vencido",
        subject: "Mateo Gómez",
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
  "/doctor/reportes": {
    metrics: [
      { label: "Reportes", value: "6", icon: "file_chart" },
      { label: "Listos", value: "4", icon: "task_alt" },
      { label: "Revisar", value: "2", icon: "warning" },
    ],
    records: [
      {
        title: "Actividad clínica mensual",
        subject: "Dra Carolina",
        meta: "Pacientes, citas, tratamientos e insumos consolidados",
        state: "Listo",
      },
      {
        title: "Seguimientos pendientes",
        subject: "Asistente",
        meta: "Controles próximos y pacientes sin cierre",
        state: "Revisión",
      },
      {
        title: "Inventario sensible",
        subject: "Sistema",
        meta: "Existencias críticas y lotes por vencer",
        state: "Alerta",
      },
    ],
    actions: [
      { label: "Ver agenda", href: "/doctor/agenda", icon: "calendar_today" },
      { label: "Ver pacientes", href: "/doctor/pacientes", icon: "group" },
      { label: "Ver finanzas", href: "/doctor/finanzas", icon: "money" },
    ],
  },
  "/doctor/finanzas": {
    metrics: [
      { label: "Ingresos", value: "$18.4M", icon: "money" },
      { label: "Margen", value: "68%", icon: "chart" },
      { label: "Costos", value: "$5.9M", icon: "payments" },
    ],
    records: [
      {
        title: "Rentabilidad por procedimiento",
        subject: "Finanzas",
        meta: "Precio cobrado, costo de insumos y utilidad bruta",
        state: "Activo",
      },
      {
        title: "Costo de inventario aplicado",
        subject: "Inventario",
        meta: "Cruce de lotes usados por tratamiento",
        state: "Revisión",
      },
      {
        title: "Cierre mensual",
        subject: "Dirección",
        meta: "Resumen de ingresos y margen operativo",
        state: "Borrador",
      },
    ],
    actions: [
      { label: "Ver reportes", href: "/doctor/reportes", icon: "file_chart" },
      { label: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
      { label: "Torre de control", href: "/doctor/torre-control", icon: "monitoring" },
    ],
  },
  "/doctor/configuracion": {
    metrics: [
      { label: "Integraciones", value: "5", icon: "settings" },
      { label: "Seguridad", value: "Alta", icon: "shield" },
      { label: "Marca", value: "Activa", icon: "palette" },
    ],
    records: [
      {
        title: "Variables de entorno",
        subject: "Sistema",
        meta: "Google, OpenAI y contraseña administrativa fuera del repositorio",
        state: "Protegido",
      },
      {
        title: "Acceso privado",
        subject: "Middleware",
        meta: "Rutas /doctor protegidas por sesión segura",
        state: "Activo",
      },
      {
        title: "Identidad visual",
        subject: "Paunova",
        meta: "Logo, tono cálido y componentes alineados al manual",
        state: "Aplicado",
      },
    ],
    actions: [
      { label: "Ver integraciones", href: "/doctor/torre-control", icon: "monitoring" },
      { label: "Reportes", href: "/doctor/reportes", icon: "file_chart" },
      { label: "Cerrar sesión", href: "/api/auth/logout", icon: "logout" },
    ],
  },
};
