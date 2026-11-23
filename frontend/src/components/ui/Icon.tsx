const PATHS: Record<string, string[]> = {
  github: ["M12 3a9 9 0 0 0-2.8 17.5c.5.1.6-.2.6-.5v-1.7c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4-1-4-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .8-.2 2.5.9a8.5 8.5 0 0 1 4.6 0c1.7-1.1 2.5-.9 2.5-.9.5 1.3.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2 4.2-4 4.4.3.3.6.8.6 1.6v2.4c0 .3.2.6.6.5A9 9 0 0 0 12 3Z"],
  linkedin: ["M4 4h16v16H4z", "M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13c0-1.6 1-2.6 2.4-2.6S16.5 11.3 16.5 13V16"],
  tiktok: ["M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5", "M14 3c.4 2.6 2 4.2 5 4.4"],
  mail: ["M3 5h18v14H3z", "m4 7.5 8 5.5 8-5.5"],
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
  up: ["M7 17 17 7", "M8 7h9v9"],
  layout: ["M3 4h18v16H3z", "M3 9h18M9 9v11"],
  bolt: ["M13 2 4 14h7l-1 8 9-12h-7l1-8Z"],
  server: ["M4 4h16v6H4zM4 14h16v6H4z", "M8 7h.01M8 17h.01"],
  database: ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z", "M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"],
  code: ["M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16"],
  flow: ["M3 6h6v4H3zM15 14h6v4h-6zM15 4h6v4h-6z", "M9 8h3v8h3M12 6h3"],
  spark: ["M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"],
  cloud: ["M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 10a4 4 0 0 1-.5 8H7Z"],
  branch: ["M6 3v12", "M18 9a3 3 0 1 0 0 .01", "M6 18a3 3 0 1 0 0 .01", "M18 12c0 4-6 2-12 6"],
  hook: ["M10 9a3 3 0 1 1 3 3H8", "M7 12a4 4 0 1 0 8 5"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"],
  filter: ["M3 5h18l-7 8v6l-4 2v-8L3 5Z"],
  send: ["m21 3-9.5 18-2.5-8L2 10.5 21 3ZM9 13l12-10"],
  sheet: ["M5 3h14v18H5z", "M5 9h14M5 15h14M11 3v18"],
  alert: ["M12 3 2 20h20L12 3Z", "M12 10v4M12 17h.01"],
  archive: ["M3 4h18v5H3z", "M5 9v10h14V9M10 13h4"],
  pen: ["M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z", "m13.5 6.5 4 4"],
  users: ["M9 5a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 9 5Z", "M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5a3 3 0 0 1 0 6M18 14.8c1.8.7 3 2.5 3 5.2"],
  brief: ["M3 7h18v13H3z", "M9 7V5h6v2M3 13h18"],
  medal: ["M12 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z", "m8.5 13.5-2 7.5 5.5-3 5.5 3-2-7.5"],
  cap: ["m2 9 10-5 10 5-10 5L2 9Z", "M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5M22 9v6"],
  copy: ["M9 9h11v11H9z", "M5 15V4h11"],
  check: ["m5 12.5 4.5 4.5L19 7.5"],
  play: ["M8 5v14l11-7L8 5Z"],
  download: ["M12 3v12m-5-5 5 5 5-5", "M4 20h16"],
  menu: ["M4 8h16M4 16h16"],
  x: ["M6 6l12 12M18 6 6 18"],
  pin: ["M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z", "M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
};

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 20, className = "", strokeWidth = 1.7 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  const d = PATHS[name] ?? PATHS.spark;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}
