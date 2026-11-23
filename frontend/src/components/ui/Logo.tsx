import Icon from "./Icon";

/* Logo files in /public/logos (Devicon, MIT; Simple Icons, CC0; ATU from atu.edu.gh; CapCut from capcut.com). */
const FILES: Record<string, string> = {
  HTML5: "html5.svg",
  CSS3: "css3.svg",
  "Tailwind CSS": "tailwindcss.svg",
  Figma: "figma.svg",
  JavaScript: "javascript.svg",
  React: "react.svg",
  "Next.js": "nextjs.svg",
  PHP: "php.svg",
  Laravel: "laravel.svg",
  XAMPP: "xampp.svg",
  MySQL: "mysql.svg",
  SQL: "mysql.svg",
  phpMyAdmin: "phpmyadmin.svg",
  Python: "python.svg",
  FastAPI: "fastapi.svg",
  SQLite: "sqlite.svg",
  n8n: "n8n.svg",
  JSON: "json.svg",
  "OpenAI API": "openai.svg",
  cPanel: "cpanel.svg",
  Cloudflare: "cloudflare.svg",
  Docker: "docker.svg",
  Git: "git.svg",
  GitHub: "github.svg",
  "VS Code": "vscode.svg",
  Telegram: "telegram.svg",
  Gmail: "gmail.svg",
  "Google Sheets": "googlesheets.svg",
  ATU: "atu.png",
  CapCut: "capcut.png",
  Claude: "claude.svg",
  ChatGPT: "openai.svg",
  Gemini: "gemini.svg",
  "Instagram Edits": "instagram.svg",
  Instagram: "instagram.svg",
  Notion: "notion.svg",
};

/* Things without an official logo get a matching line icon instead. */
const FALLBACK: Record<string, string> = { Webhooks: "hook", Webhook: "hook", Groq: "spark", Prompting: "pen", Coolify: "cloud", SerpAPI: "globe", Filter: "filter" };

export function hasLogo(name: string) {
  return name in FILES;
}

/** Public path of a logo file, if there is one. */
export function logoSrc(name: string) {
  return FILES[name] ? `/logos/${FILES[name]}` : undefined;
}

/** A tool or brand logo, or a fitting icon when the tool has no logo. */
export default function Logo({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) {
  const file = FILES[name];
  if (file) {
    // eslint-disable-next-line @next/next/no-img-element -- tiny static SVGs; next/image adds nothing here
    return <img src={`/logos/${file}`} alt="" width={size} height={size} loading="lazy" className={`shrink-0 object-contain ${className}`} style={{ width: size, height: size }} />;
  }
  return <Icon name={FALLBACK[name] ?? "spark"} size={size} className={`shrink-0 text-wine ${className}`} />;
}

/** A social network mark in its brand colours (TikTok gets its cyan and pink echo). */
export function SocialMark({ name, size = 20 }: { name: string; size?: number }) {
  if (name === "tiktok") {
    return (
      <span className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
        <Icon name="tiktok" size={size} className="absolute left-[-1.5px] top-[-1px] text-[#25F4EE]" />
        <Icon name="tiktok" size={size} className="absolute left-[1.5px] top-[1px] text-[#FE2C55]" />
        <Icon name="tiktok" size={size} className="absolute left-0 top-0 text-white" />
      </span>
    );
  }
  return <Icon name={name} size={size} className="text-white" />;
}

export const SOCIAL_BG: Record<string, string> = { github: "bg-[#181717]", linkedin: "bg-[#0A66C2]", tiktok: "bg-black" };
