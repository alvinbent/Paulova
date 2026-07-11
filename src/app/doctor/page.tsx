import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import IconoDoctor from "@/components/doctor/IconoDoctor";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const [appointments, patients, inventory] = await Promise.all([
    db.getAppointments(),
    db.getPatients(),
    db.getInventory(),
  ]);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayAppointments = appointments.filter((item) => item.date === todayStr);
  const nextAppointment = appointments
    .filter((item) => item.date >= todayStr && item.status === "Programada")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const lowStock = inventory.filter((item) => item.units <= item.minUnits);

  return (
    <main className="paunova-app-shell min-h-dvh px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-3rem)] w-full max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-7">
          <Image
            src="/brand-assets/logo-paunova-skin-age.png"
            alt="Paunova Skin & Age Clinic"
            width={520}
            height={148}
            priority
            className="h-auto w-[260px] object-contain drop-shadow-[0_22px_34px_rgba(95,79,66,0.2)]"
          />

          <div>
            <p className="paunova-kicker mb-4">Aplicación privada</p>
            <h1 className="paunova-title text-5xl leading-tight md:text-6xl">
              Bienvenida, <span className="italic">Dra Carolina Aguirre</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#746b61]">
              Hoy tienes {todayAppointments.length} citas, {lowStock.length} alertas
              de inventario y {patients.length} expedientes activos en el sistema
              clínico de Paunova Skin & Age Clinic.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/doctor/dashboard"
              className="paunova-button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all active:scale-[0.98]"
            >
              <IconoDoctor name="dashboard" className="h-4 w-4" />
              Ingresar al panel
            </Link>
            <Link
              href="/doctor/torre-control"
              className="paunova-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all active:scale-[0.98]"
            >
              <IconoDoctor name="monitoring" className="h-4 w-4" />
              Torre de control
            </Link>
          </div>
        </div>

        <div className="paunova-card relative overflow-hidden rounded-[2rem] p-5 md:p-7">
          <div className="absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-[#b99862]/18 blur-3xl" />
          <div className="relative grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="overflow-hidden rounded-t-full bg-[#eadfce]">
              <Image
                src="/brand-assets/dra-retrato-profesional.jpeg"
                alt="Dra Carolina Aguirre"
                width={520}
                height={650}
                priority
                className="h-full min-h-[420px] w-full object-cover object-top"
              />
            </div>

            <div className="space-y-4">
              <div className="paunova-inner rounded-[1.5rem] p-5">
                <p className="paunova-kicker">Fecha</p>
                <p className="mt-3 text-2xl font-semibold text-[#5f4f42]">
                  {today.toLocaleDateString("es-CO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              <div className="paunova-inner rounded-[1.5rem] p-5">
                <p className="paunova-kicker">Próxima cita</p>
                {nextAppointment ? (
                  <div className="mt-3">
                    <p className="text-xl font-semibold text-[#5f4f42]">
                      {nextAppointment.time} - {nextAppointment.patientName}
                    </p>
                    <p className="mt-2 text-sm text-[#746b61]">
                      {nextAppointment.treatment}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#746b61]">
                    Sin citas programadas.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.4rem] bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-100">
                  <p className="font-mono text-3xl font-semibold">
                    {todayAppointments.length}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                    Citas hoy
                  </p>
                </div>
                <div className="rounded-[1.4rem] bg-[#fff1f1] p-4 text-[#9b3f36] ring-1 ring-[#e6b5ad]/70">
                  <p className="font-mono text-3xl font-semibold">{lowStock.length}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                    Alertas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
