type IconName =
  | "add"
  | "arrow"
  | "bell"
  | "calendar"
  | "chart"
  | "close"
  | "dashboard"
  | "logout"
  | "menu"
  | "mic"
  | "money"
  | "notes"
  | "patients"
  | "search"
  | "settings"
  | "spa"
  | "warning";

const paths: Record<IconName, string[]> = {
  add: ["M12 5v14", "M5 12h14"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  bell: ["M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  calendar: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z"],
  chart: ["M4 19V5", "M4 19h16", "M8 16v-5", "M12 16V8", "M16 16v-8"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  dashboard: ["M4 4h7v7H4z", "M13 4h7v4h-7z", "M13 10h7v10h-7z", "M4 13h7v7H4z"],
  logout: ["M10 7V5h9v14h-9v-2", "M15 12H4", "M8 8l-4 4 4 4"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  mic: ["M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z", "M5 11a7 7 0 0 0 14 0", "M12 18v3"],
  money: ["M4 7h16v10H4z", "M8 12h.01", "M16 12h.01", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  notes: ["M6 3h9l3 3v15H6z", "M14 3v5h5", "M9 12h6", "M9 16h6"],
  patients: ["M16 20a4 4 0 0 0-8 0", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M19 20a3 3 0 0 0-2-2.8", "M17 4.5a3 3 0 0 1 0 5.5"],
  search: ["M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z", "M16 16l5 5"],
  settings: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M3 12h3", "M18 12h3", "M12 3v3", "M12 18v3"],
  spa: ["M12 20c-5-3-7-7-7-12 5 1 7 5 7 12z", "M12 20c5-3 7-7 7-12-5 1-7 5-7 12z", "M12 20V8"],
  warning: ["M12 4l9 16H3z", "M12 9v5", "M12 17h.01"],
};

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
