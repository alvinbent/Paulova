import Link from "next/link";
import type { MetricTone } from "./types";
import Icon from "./Icon";

const tones: Record<MetricTone, string> = {
  gold: "bg-[#f3e7d8] text-[#593c28] ring-[#dcc6ad]",
  rose: "bg-[#f5e7e3] text-[#8b4d43] ring-[#e1c4bd]",
  taupe: "bg-[#e9e2db] text-[#3a332d] ring-[#d5c9bd]",
  sage: "bg-[#e7ece5] text-[#4f604f] ring-[#cdd8c9]",
};

export default function MetricCard({
  label,
  value,
  detail,
  icon,
  href,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: "patients" | "calendar" | "money";
  href: string;
  tone: MetricTone;
}) {
  return (
    <Link
      href={href}
      className={`col-span-12 min-h-40 rounded-[26px] p-5 ring-1 transition hover:-translate-y-0.5 sm:col-span-6 lg:col-span-4 ${tones[tone]}`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
            {label}
          </p>
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <div>
          <p className="font-mono text-5xl font-semibold leading-none">{value}</p>
          <p className="mt-3 text-sm leading-5 opacity-72">{detail}</p>
        </div>
      </div>
    </Link>
  );
}
