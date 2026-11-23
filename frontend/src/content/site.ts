/* All editable site content lives here. Change text, links and projects without touching components. */

export const PROFILE = {
  name: "Harriet Ayim",
  fullName: "Harriet Ama-Adubea Ayim",
  role: "Software Developer & AI Automation Specialist",
  location: "Accra, Ghana",
  email: "amaharriet011@gmail.com",
  cv: "/Harriet_Ayim_CV.pdf",
  headshot: "/headshot.jpg",
  status: "Level 300 CS @ ATU",
  socials: [
    { label: "GitHub", handle: "Harriet2025", href: "https://github.com/Harriet2025", icon: "github" },
    { label: "LinkedIn", handle: "Harriet Ayim", href: "https://www.linkedin.com/in/harriet-ayim-700997295", icon: "linkedin" },
    { label: "TikTok", handle: "@ms.harriet4u", href: "https://www.tiktok.com/@ms.harriet4u", icon: "tiktok" },
  ],
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "automation", label: "Automation" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export const HERO_WORDS = ["web applications", "AI workflows", "databases", "automations"];

export const MARQUEE = ["Web applications", "AI workflows", "Thoughtful databases", "Calm automations", "Clean deployments", "Clear documentation"];

export const ABOUT_TEXT =
  "I'm a Computer Science student at Accra Technical University who builds full-stack web applications and AI-powered automations. Years in teaching, customer service and administration taught me how people actually work, so I build tools that remove the repetitive parts and leave the clear, human ones.";

export const STATS = [
  { value: 300, suffix: "", label: "Level, B.Tech Computer Science at ATU" },
  { value: 6, suffix: "+", label: "Projects and workflows shipped" },
  { value: 4, suffix: "", label: "Live sites in production" },
  { value: 2, suffix: "", label: "AI pipelines running on n8n" },
];

export const STRENGTHS = [
  { title: "Problem-solving", text: "Designed a hospital database with custom triggers and views, and multi-branch n8n flows that handle API edge cases." },
  { title: "Systems thinking", text: "Runs cPanel, Cloudflare and self-hosted Coolify/Docker setups, and plans work with clear roadmaps." },
  { title: "Clear communication", text: "Explains CS topics to beginners on TikTok and Instagram, drawing on years of customer-facing work." },
  { title: "Learning by shipping", text: "Picks up new tools by building real things: PHP/MySQL apps, a Java OOP record system and AI pipelines." },
];

export type SkillCategory = "frontend" | "backend" | "automation" | "devops";

export const SKILLS: { name: string; level: number; category: SkillCategory; icon: string; text: string; tools: string[] }[] = [
  { name: "Responsive UI", level: 95, category: "frontend", icon: "layout", text: "Semantic HTML, modern CSS and Tailwind layouts that hold up from phone to desktop.", tools: ["HTML5", "CSS3", "Tailwind CSS", "Figma"] },
  { name: "JavaScript", level: 85, category: "frontend", icon: "bolt", text: "Interactive front ends, DOM logic and API calls, now with React and Next.js.", tools: ["JavaScript", "React", "Next.js"] },
  { name: "PHP & Laravel", level: 90, category: "backend", icon: "server", text: "Server-side apps with authentication, role-based dashboards and form handling.", tools: ["PHP", "Laravel", "XAMPP"] },
  { name: "MySQL databases", level: 90, category: "backend", icon: "database", text: "Relational schemas, triggers, views and optimized queries.", tools: ["MySQL", "phpMyAdmin", "SQL"] },
  { name: "Python APIs", level: 70, category: "backend", icon: "code", text: "FastAPI services with validation, SQLite storage and background jobs.", tools: ["Python", "FastAPI", "SQLite"] },
  { name: "n8n automation", level: 90, category: "automation", icon: "flow", text: "Multi-branch workflows with webhooks, conditional logic and error lanes.", tools: ["n8n", "Webhooks", "JSON"] },
  { name: "AI integrations", level: 85, category: "automation", icon: "spark", text: "LLM steps that extract, summarise and personalise content inside workflows.", tools: ["Groq", "OpenAI API", "Prompting"] },
  { name: "Deployment & infra", level: 85, category: "devops", icon: "cloud", text: "cPanel hosting, Cloudflare DNS, subdomains, Coolify and Docker.", tools: ["cPanel", "Cloudflare", "Coolify", "Docker"] },
  { name: "Git & GitHub", level: 85, category: "devops", icon: "branch", text: "Branching, pull requests and clean commit history for every project.", tools: ["Git", "GitHub", "VS Code"] },
];

export const SKILL_TABS: { id: "all" | SkillCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "automation", label: "Automation" },
  { id: "devops", label: "DevOps" },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  image?: string;
  tech: string[];
  summary: string;
  problem: string;
  architecture: string;
  result: string;
  highlights: string[];
  live?: string;
  liveLabel?: string;
  repo?: string;
  workflow?: "job-search" | "email-outreach";
};

export const PROJECTS: Project[] = [
  {
    slug: "atu-connect",
    title: "ATU Connect",
    category: "Web application",
    year: "2025",
    image: "/shot-atu.jpg",
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    summary: "A secure campus workspace that brings announcements, assignments, messaging and notices together for students, lecturers and university leadership.",
    problem: "Announcements and learning resources reached students through scattered channels, so updates were easy to miss.",
    architecture: "A PHP backend over a relational MySQL schema with a JavaScript front end. Six role-based dashboards share one permissions model.",
    result: "One portal for announcements, resources and messages across departments, with live notifications and a unified inbox.",
    highlights: ["Six role-based dashboards", "Live notifications", "Unified inbox"],
    live: "https://atu-connect.sasulabs.me/",
    liveLabel: "atu-connect.sasulabs.me",
  },
  {
    slug: "digital-library",
    title: "Digital Library",
    category: "Web application",
    year: "2025",
    image: "/shot-dls.jpg",
    tech: ["HTML/CSS", "JavaScript", "Vercel"],
    summary: "A digital library where students search the catalogue and borrow or return e-books online, while admins manage uploads and track borrowing.",
    problem: "Students needed one place to find and borrow course materials, novels and e-books, and admins needed to manage uploads and borrowing.",
    architecture: "A web front end for browsing, searching and borrowing, with an admin side for uploads and borrowing records, deployed on Vercel.",
    result: "A live library with a searchable catalogue, online borrowing and returns, and admin tools for uploads and tracking.",
    highlights: ["Searchable catalogue", "Borrow and return flow", "Admin dashboard"],
    live: "https://dls-nine.vercel.app/",
    liveLabel: "dls-nine.vercel.app",
  },
  {
    slug: "gpgd-training",
    title: "GPGD Training Programs",
    category: "Web infrastructure",
    year: "2025",
    image: "/shot-gpgd.jpg",
    tech: ["HTML/CSS", "cPanel", "Cloudflare", "Subdomains"],
    summary: "The training programmes site for the Graduates and Professionals of Ga-Dangme Network, presenting its artisan and IT certification programmes.",
    problem: "The network needed a professional site for its training programmes, running on its own domain.",
    architecture: "A static HTML/CSS site on cPanel, with DNS and proxying through Cloudflare and applications on their own subdomains.",
    result: "A live training programmes site with managed DNS and subdomain hosting that I deployed and maintain.",
    highlights: ["Production deployment", "Cloudflare DNS", "Subdomain hosting"],
    live: "https://programs.gpgdnetwork.org/",
    liveLabel: "programs.gpgdnetwork.org",
  },
  {
    slug: "sweet-aura",
    title: "Sweet Aura",
    category: "E-commerce",
    year: "2025",
    image: "/shot-aura.jpg",
    tech: ["HTML/CSS", "JavaScript", "Netlify"],
    summary: "An online storefront for luxury perfumes, lip oils, body mists and beauty essentials, with product search and a shopping cart.",
    problem: "Perfume and beauty products needed an online shop where customers in Ghana could browse, search and order with delivery.",
    architecture: "A responsive storefront with product search, featured listings and a cart, built with HTML, CSS and JavaScript and hosted on Netlify.",
    result: "A live store for luxury perfumes and beauty essentials.",
    highlights: ["Product search", "Shopping cart", "Mobile-first layout"],
    live: "https://harryscents.netlify.app/",
    liveLabel: "harryscents.netlify.app",
  },
  {
    slug: "job-search-engine",
    title: "AI Job Search Engine",
    category: "AI automation",
    year: "2025",
    tech: ["n8n", "SerpAPI", "Groq LLM", "Webhooks", "Telegram"],
    summary: "An n8n workflow that collects job listings, extracts requirements, summarises benefits with an LLM and pushes formatted alerts to Telegram.",
    problem: "Searching listings and reading every posting for requirements and benefits was slow, repetitive work.",
    architecture: "A webhook starts the flow. SerpAPI collects listings, filters narrow them, Groq summarises each one, and Telegram delivers the alert.",
    result: "Job research, filtering and summarising now run as one automated system.",
    highlights: ["Webhook trigger", "LLM extraction", "Telegram alerts"],
    workflow: "job-search",
  },
  {
    slug: "email-outreach",
    title: "Email Outreach System",
    category: "Workflow automation",
    year: "2025",
    tech: ["n8n", "Google Sheets API", "Gmail API", "Groq LLM"],
    summary: "An outreach system that filters leads with conditional logic, personalises each email with an LLM, sends through Gmail and logs every failure.",
    problem: "Manual outreach meant copying leads, writing every email by hand and missing the ones that failed to send.",
    architecture: "Google Sheets holds the leads, conditional logic routes each row, Groq writes the email and the Gmail API sends it, with an error lane for failures.",
    result: "A streamlined outreach workflow with filtering, AI personalisation and error handling.",
    highlights: ["Conditional routing", "AI personalisation", "Error lane"],
    workflow: "email-outreach",
  },
];

/* ---------------------------------------------------------------- automation demos */
export type FlowNode = { id: string; label: string; kind: "trigger" | "data" | "logic" | "ai" | "output" | "error"; icon: string; x: number; y: number };
export type FlowField = { name: string; label: string; placeholder: string; type?: "text" | "toggle" };

export const WORKFLOWS: Record<
  "job-search" | "email-outreach",
  { title: string; blurb: string; nodes: FlowNode[]; edges: [string, string][]; fields: FlowField[] }
> = {
  "job-search": {
    title: "AI Job Search Engine",
    blurb: "Type a role and a city. The workflow searches, filters, summarises with an LLM and sends a Telegram alert.",
    nodes: [
      { id: "webhook", label: "Webhook", kind: "trigger", icon: "hook", x: 70, y: 70 },
      { id: "serpapi", label: "SerpAPI", kind: "data", icon: "globe", x: 250, y: 70 },
      { id: "filter", label: "Filter", kind: "logic", icon: "filter", x: 430, y: 70 },
      { id: "groq", label: "Groq LLM", kind: "ai", icon: "spark", x: 430, y: 210 },
      { id: "parse", label: "JSON parse", kind: "data", icon: "code", x: 250, y: 210 },
      { id: "telegram", label: "Telegram", kind: "output", icon: "send", x: 70, y: 210 },
    ],
    edges: [["webhook", "serpapi"], ["serpapi", "filter"], ["filter", "groq"], ["groq", "parse"], ["parse", "telegram"]],
    fields: [
      { name: "role", label: "Role", placeholder: "Junior Web Developer" },
      { name: "location", label: "Location", placeholder: "Accra" },
    ],
  },
  "email-outreach": {
    title: "Email Outreach System",
    blurb: "Add a lead. The workflow checks the row, writes a personal email with an LLM, sends it and updates the sheet.",
    nodes: [
      { id: "sheets", label: "Sheets row", kind: "trigger", icon: "sheet", x: 70, y: 70 },
      { id: "condition", label: "IF address", kind: "logic", icon: "branch", x: 250, y: 70 },
      { id: "groq", label: "Groq LLM", kind: "ai", icon: "spark", x: 430, y: 70 },
      { id: "gmail", label: "Gmail", kind: "output", icon: "mail", x: 430, y: 210 },
      { id: "update", label: "Update row", kind: "data", icon: "database", x: 250, y: 210 },
      { id: "error", label: "Error lane", kind: "error", icon: "alert", x: 250, y: 330 },
      { id: "log", label: "Log + flag", kind: "error", icon: "archive", x: 70, y: 330 },
    ],
    edges: [["sheets", "condition"], ["condition", "groq"], ["groq", "gmail"], ["gmail", "update"], ["condition", "error"], ["error", "log"]],
    fields: [
      { name: "name", label: "Lead name", placeholder: "Ama Mensah" },
      { name: "company", label: "Company", placeholder: "Sunrise Bakery" },
      { name: "goal", label: "What they need", placeholder: "automate their order follow-ups" },
      { name: "has_email", label: "Row has an email address", placeholder: "", type: "toggle" },
    ],
  },
};

/* ---------------------------------------------------------------- journey timeline */
export const TIMELINE = [
  { tag: "Chapter 01", title: "Teaching & education", place: "Classroom", text: "Taught Math, Science and Creative Arts and learned to explain hard ideas simply.", carry: "Shapes how I write documentation and teach tech online.", icon: "pen" },
  { tag: "Chapter 02", title: "School library support", place: "Library", text: "Managed categorisation, resource indexing and organisation.", carry: "Carries into database design, naming and clean data structure.", icon: "archive" },
  { tag: "Chapter 03", title: "Customer service & front desk", place: "Front desk", text: "Front-line client communication and task coordination.", carry: "Builds the empathy and clarity I bring to user-facing software.", icon: "users" },
  { tag: "Chapter 04", title: "Administrative coordination", place: "Office", text: "Executive office operations and team coordination.", carry: "Fuels my focus on repeatable processes worth automating.", icon: "brief" },
  { tag: "2023", title: "BYU-Pathway Worldwide Certificate", place: "Certificate", text: "Completed the BYU-Pathway Worldwide certificate programme.", carry: "Built the study habits behind everything that followed.", icon: "medal" },
  { tag: "Now", title: "B.Tech Computer Science", place: "Accra Technical University", text: "Level 300, building full-stack apps and AI automations alongside coursework.", carry: "Shipping real projects for real users while I learn.", icon: "cap", live: true },
];
