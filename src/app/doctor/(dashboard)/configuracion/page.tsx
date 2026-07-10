import IconoDoctor from "@/components/doctor/IconoDoctor";
import { PaginaModulo } from "@/components/doctor/PaginaModulo";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/configuracion")!;

export default function ConfiguracionPage() {
  const integrations = [
    {
      title: "Google Sheets",
      detail: "Sincronización futura de pacientes, citas e inventario.",
      ready: Boolean(process.env.GOOGLE_SPREADSHEET_ID),
      icon: "database",
    },
    {
      title: "Google Calendar",
      detail: "Creación de citas con Meet mediante conferenceData.createRequest.",
      ready: Boolean(process.env.GOOGLE_CALENDAR_ID),
      icon: "calendar_today",
    },
    {
      title: "OpenAI",
      detail: "Procesamiento asistido de dictado clínico con revisión humana.",
      ready: Boolean(process.env.OPENAI_API_KEY),
      icon: "psychology",
    },
    {
      title: "Seguridad privada",
      detail: "Acceso protegido por cookie segura y contraseña administrativa.",
      ready: Boolean(process.env.ADMIN_PASSWORD),
      icon: "shield",
    },
  ];

  const preferences = [
    { label: "Idioma de la aplicación", value: "Español" },
    { label: "Zona horaria", value: "America/Bogota" },
    { label: "Identidad visual", value: "Paunova Skin & Age Clinic" },
    { label: "Modo clínico", value: "Borrador con aprobación médica" },
  ];

  return (
    <PaginaModulo module={pageModule}>
      <section className="grid gap-4 md:grid-cols-2">
        {integrations.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.6rem] bg-[#fffdf8]/80 p-5 ring-1 ring-[#b99862]/14"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-2xl bg-[#b99862]/12 p-3 text-[#b99862]">
                <IconoDoctor name={item.icon} className="h-5 w-5" />
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ${
                  item.ready
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                    : "bg-[#fff7e8] text-[#9a6a22] ring-[#e8c78f]/60"
                }`}
              >
                {item.ready ? "Configurado" : "Pendiente"}
              </span>
            </div>
            <h2 className="mt-4 text-base font-semibold text-[#5f4f42]">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#746b61]">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[2rem] bg-[#5f4f42] p-5 text-[#fffdf8]">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-white/10 p-3 text-[#d9c4a5]">
            <IconoDoctor name="palette" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9c4a5]">
              Preferencias
            </p>
            <h2 className="paunova-title text-2xl text-[#fffdf8]">Clínica y marca</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {preferences.map((preference) => (
            <div
              key={preference.label}
              className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-white/8 p-4"
            >
              <span className="text-sm text-[#e8ded4]/80">{preference.label}</span>
              <span className="text-right text-sm font-semibold text-[#fffdf8]">
                {preference.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </PaginaModulo>
  );
}
