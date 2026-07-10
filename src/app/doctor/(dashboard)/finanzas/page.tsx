import IconoDoctor from "@/components/doctor/IconoDoctor";
import { PaginaModulo } from "@/components/doctor/PaginaModulo";
import { db } from "@/lib/db";
import { doctorModules } from "@/lib/doctor-system";

export const revalidate = 0;

const pageModule = doctorModules.find((item) => item.href === "/doctor/finanzas")!;

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function FinanzasPage() {
  const [clinicalRecords, lots] = await Promise.all([db.getClinicalRecords(), db.getLots()]);

  const rows = clinicalRecords.flatMap((record) =>
    (record.treatmentsApplied ?? []).map((treatment) => {
      const lot = lots.find((item) => item.id === treatment.lotUsedId);
      const price = Number(treatment.priceChargedCop ?? 0);
      const quantity = Number(treatment.productQuantityUsed ?? 0);
      const cost = lot ? lot.costUnitCop * quantity : 0;
      const profit = price - cost;
      const margin = price > 0 ? Math.round((profit / price) * 100) : 0;

      return {
        id: treatment.id,
        name: treatment.treatmentName,
        date: treatment.date,
        price,
        cost,
        profit,
        margin,
      };
    }),
  );

  const billableRows = rows.filter((row) => row.price > 0);
  const revenue = billableRows.reduce((sum, row) => sum + row.price, 0);
  const costs = billableRows.reduce((sum, row) => sum + row.cost, 0);
  const profit = revenue - costs;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  const metrics = [
    { label: "Ingresos registrados", value: currency.format(revenue), icon: "money" },
    { label: "Costo clínico", value: currency.format(costs), icon: "inventory_2" },
    { label: "Utilidad bruta", value: currency.format(profit), icon: "chart" },
    { label: "Margen promedio", value: `${margin}%`, icon: "file_chart" },
  ];

  return (
    <PaginaModulo module={pageModule}>
      <section className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.6rem] bg-[#fffdf8]/80 p-5 ring-1 ring-[#b99862]/14"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                  {metric.label}
                </p>
                <p className="mt-3 font-mono text-2xl font-semibold text-[#5f4f42]">
                  {metric.value}
                </p>
              </div>
              <span className="rounded-2xl bg-[#b99862]/12 p-3 text-[#b99862]">
                <IconoDoctor name={metric.icon} className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-[2rem] bg-[#fffdf8]/80 ring-1 ring-[#b99862]/14">
        <div className="border-b border-[#b99862]/12 p-5">
          <p className="paunova-kicker">Procedimientos facturables</p>
          <h2 className="paunova-title mt-1 text-2xl">Rentabilidad clínica</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f4ecdf] text-[10px] uppercase tracking-[0.16em] text-[#9b8a76]">
              <tr>
                <th className="px-4 py-3 font-semibold">Procedimiento</th>
                <th className="px-4 py-3 font-semibold">Ingreso</th>
                <th className="px-4 py-3 font-semibold">Costo</th>
                <th className="px-4 py-3 font-semibold">Margen</th>
              </tr>
            </thead>
            <tbody>
              {billableRows.slice(0, 8).map((row) => (
                <tr key={row.id} className="border-t border-[#b99862]/10">
                  <td className="px-4 py-3 font-medium text-[#5f4f42]">{row.name}</td>
                  <td className="px-4 py-3 text-[#746b61]">{currency.format(row.price)}</td>
                  <td className="px-4 py-3 text-[#746b61]">{currency.format(row.cost)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100">
                      {row.margin}%
                    </span>
                  </td>
                </tr>
              ))}
              {billableRows.length === 0 && (
                <tr>
                  <td className="px-4 py-5 text-sm text-[#746b61]" colSpan={4}>
                    Aún no hay procedimientos con valor cobrado para calcular rentabilidad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PaginaModulo>
  );
}
