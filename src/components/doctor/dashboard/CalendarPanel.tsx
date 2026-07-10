export default function CalendarPanel({ activeDay }: { activeDay: number }) {
  const days = Array.from({ length: 35 }, (_, index) => index + 1);

  return (
    <section className="col-span-12 min-h-[27rem] rounded-[28px] bg-[#2b2520] p-6 text-[#fffaf4] lg:col-span-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7aca1]">
        Calendario
      </p>
      <h3 className="mt-2 font-serif text-3xl font-medium">Julio 2026</h3>

      <div className="mt-7 grid grid-cols-7 gap-2 text-center">
        {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
          <span key={day} className="text-[10px] font-semibold text-[#a19f9f]">
            {day}
          </span>
        ))}
        {days.map((day) => {
          const displayDay = day <= 31 ? day : day - 31;
          const muted = day > 31;
          const selected = displayDay === activeDay && !muted;
          return (
            <span
              key={day}
              className={`flex aspect-square items-center justify-center rounded-full text-xs ${
                selected
                  ? "bg-[#c7aca1] text-[#2b2520]"
                  : muted
                    ? "text-[#686868]"
                    : "bg-white/6 text-[#e7e7e8]"
              }`}
            >
              {displayDay}
            </span>
          );
        })}
      </div>

      <div className="mt-7 rounded-[24px] bg-white/8 p-4">
        <p className="text-sm font-semibold">Bloque de mayor demanda</p>
        <p className="mt-1 text-xs leading-5 text-[#c7aca1]">
          2:00 PM - 5:30 PM con controles y procedimientos.
        </p>
      </div>
    </section>
  );
}
