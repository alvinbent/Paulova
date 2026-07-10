export default function RecentActivityPanel() {
  return (
    <section className="col-span-12 rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6] lg:col-span-7">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">
            Actividad reciente
          </p>
          <h3 className="mt-2 font-serif text-3xl font-medium text-[#2b2520]">
            Movimiento clínico
          </h3>
        </div>
        <span className="material-symbols-outlined rounded-full bg-[#f3e7d8] p-3 text-[#593c28]">
          timeline
        </span>
      </div>

      <div className="grid gap-3">
        <ActivityRow title="Historia actualizada" detail="Sofía Rodríguez - borrador IA revisado" time="09:42" />
        <ActivityRow title="Inventario descontado" detail="Dysport 500U - salida asociada a procedimiento" time="11:18" />
        <ActivityRow title="Cita confirmada" detail="Valeria Cárdenas - valoración inicial" time="13:05" />
      </div>
    </section>
  );
}

function ActivityRow({
  title,
  detail,
  time,
}: {
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <article className="grid grid-cols-[4rem_1fr] gap-4 rounded-[22px] bg-[#f8f1ea] p-4">
      <span className="font-mono text-sm font-semibold text-[#986b54]">{time}</span>
      <div>
        <p className="text-sm font-semibold text-[#2b2520]">{title}</p>
        <p className="mt-1 text-sm text-[#71665d]">{detail}</p>
      </div>
    </article>
  );
}
