import Link from "next/link";

export default function PatientSummaryCard({
  name,
  treatment,
  status,
  href,
}: {
  name: string;
  treatment: string;
  status: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[22px] bg-[#f8f1ea] p-4 transition hover:bg-[#f3e7d8]"
    >
      <span>
        <span className="block text-sm font-semibold text-[#2b2520]">{name}</span>
        <span className="mt-1 block text-xs text-[#71665d]">{treatment}</span>
      </span>
      <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#986b54] ring-1 ring-[#d8ccc0]">
        {status}
      </span>
    </Link>
  );
}
