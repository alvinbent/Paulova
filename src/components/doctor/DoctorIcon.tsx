const iconPaths: Record<string, string[]> = {
  add: ["M12 5v14", "M5 12h14"],
  add_box: ["M5 5h14v14H5z", "M12 8v8", "M8 12h8"],
  add_circle: ["M12 8v8", "M8 12h8", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  add_shopping_cart: ["M4 5h2l2 10h9l3-7H7", "M9 20h.01", "M17 20h.01", "M17 3v4", "M15 5h4"],
  arrow_back: ["M19 12H5", "M11 6l-6 6 6 6"],
  arrow_forward: ["M5 12h14", "M13 6l6 6-6 6"],
  block: ["M5 5l14 14", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  cake: ["M5 11h14v10H5z", "M8 11V8", "M12 11V8", "M16 11V8", "M8 5h.01", "M12 5h.01", "M16 5h.01"],
  calendar_today: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z"],
  check: ["M5 13l4 4L19 7"],
  check_circle: ["M8 12.5l2.5 2.5L16.5 9", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  clinical_notes: ["M6 3h9l3 3v15H6z", "M14 3v5h5", "M9 12h6", "M9 16h6"],
  dashboard: ["M4 4h7v7H4z", "M13 4h7v4h-7z", "M13 10h7v10h-7z", "M4 13h7v7H4z"],
  date_range: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z", "M8 13h3", "M13 13h3", "M8 17h3"],
  draft: ["M6 4h9l3 3v13H6z", "M14 4v4h4", "M9 14h6"],
  edit: ["M4 20h4l11-11-4-4L4 16z", "M13 7l4 4"],
  edit_calendar: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v9", "M13 20h3l4-4-3-3-4 4z"],
  edit_note: ["M4 6h12", "M4 11h10", "M4 16h7", "M14 19h3l4-4-3-3-4 4z"],
  error: ["M12 8v5", "M12 17h.01", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  event_busy: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z", "M9 14l6 6", "M15 14l-6 6"],
  event_repeat: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z", "M8 15h8", "M13 12l3 3-3 3"],
  expand_more: ["M6 9l6 6 6-6"],
  fact_check: ["M6 3h12v18H6z", "M9 8h6", "M9 13l2 2 4-5", "M9 18h6"],
  filter_list: ["M4 7h16", "M7 12h10", "M10 17h4"],
  flowsheet: ["M5 5h6v6H5z", "M13 13h6v6h-6z", "M8 11v3a2 2 0 0 0 2 2h3"],
  group: ["M16 20a4 4 0 0 0-8 0", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M19 20a3 3 0 0 0-2-2.8", "M17 4.5a3 3 0 0 1 0 5.5"],
  history: ["M4 12a8 8 0 1 0 3-6.25", "M4 5v5h5", "M12 8v5l3 2"],
  inventory: ["M4 7l8-4 8 4-8 4z", "M4 7v10l8 4 8-4V7", "M12 11v10"],
  inventory_2: ["M4 6h16v4H4z", "M6 10h12v10H6z", "M9 14h6"],
  login: ["M10 7V5h9v14h-9v-2", "M15 12H4", "M8 8l-4 4 4 4"],
  mail: ["M4 6h16v12H4z", "M4 7l8 6 8-6"],
  mic: ["M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z", "M5 11a7 7 0 0 0 14 0", "M12 18v3"],
  mic_off: ["M4 4l16 16", "M9 9v3a3 3 0 0 0 4.5 2.6", "M15 9V7a3 3 0 0 0-5.4-1.8", "M5 11a7 7 0 0 0 11 5.7", "M12 18v3"],
  monitoring: ["M4 19V5", "M4 19h16", "M8 16v-5", "M12 16V8", "M16 16v-8"],
  notifications_active: ["M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4", "M19 4l2-2", "M5 4 3 2"],
  outbox: ["M4 14v5h16v-5", "M12 15V4", "M8 8l4-4 4 4"],
  pause: ["M8 5v14", "M16 5v14"],
  patient_list: ["M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M3 20a5 5 0 0 1 10 0", "M15 7h6", "M15 12h6", "M15 17h6"],
  person_add: ["M15 20a5 5 0 0 0-10 0", "M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M18 8v6", "M15 11h6"],
  person_search: ["M11 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 20a7 7 0 0 1 9-6.7", "M17 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.5 19.5 21 21"],
  phone: ["M6 4l3 3-2 3a13 13 0 0 0 7 7l3-2 3 3-2 3c-8 0-15-7-15-15z"],
  photo_camera: ["M4 8h4l2-3h4l2 3h4v11H4z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  priority_high: ["M12 5v9", "M12 18h.01"],
  psychology: ["M9 18a5 5 0 0 1-3-9.1A4 4 0 0 1 12 5a4 4 0 0 1 6 4 5 5 0 0 1-3 9", "M9 18v3h6v-3", "M9 11h6"],
  record_voice_over: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 20a8 8 0 0 1 16 0", "M18 7c2 1 3 3 3 5"],
  remove_circle: ["M8 12h8", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  schedule: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v6l4 2"],
  science: ["M9 3h6", "M10 3v5l-5 9a3 3 0 0 0 2.6 4h8.8A3 3 0 0 0 19 17l-5-9V3", "M8 15h8"],
  search: ["M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z", "M16 16l5 5"],
  shopping_cart: ["M4 5h2l2 10h9l3-7H7", "M9 20h.01", "M17 20h.01"],
  signature: ["M4 18c4-8 6-8 8 0 2-5 4-5 8 0", "M4 21h16"],
  spa: ["M12 20c-5-3-7-7-7-12 5 1 7 5 7 12z", "M12 20c5-3 7-7 7-12-5 1-7 5-7 12z", "M12 20V8"],
  sync: ["M4 12a8 8 0 0 1 13-6", "M17 3v5h-5", "M20 12a8 8 0 0 1-13 6", "M7 21v-5h5"],
  task_alt: ["M8 12.5l2.5 2.5L17 8", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  today: ["M7 3v4", "M17 3v4", "M4 9h16", "M5 5h14v16H5z", "M9 14h6"],
  tune: ["M4 7h10", "M18 7h2", "M14 5v4", "M4 17h2", "M10 17h10", "M8 15v4"],
  vaccines: ["M15 3l6 6", "M10 8l6 6", "M5 13l6 6", "M7 11l6-6 6 6-6 6z", "M4 20l4-4"],
  warning: ["M12 4l9 16H3z", "M12 9v5", "M12 17h.01"],
};

export default function DoctorIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const paths = iconPaths[name] ?? iconPaths.clinical_notes;

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
      {paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
