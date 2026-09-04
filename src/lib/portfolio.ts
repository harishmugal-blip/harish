// ============================================================
//  PORTFOLIO DATA — yahan se pura content edit kar sakte ho!
//  Naam, skills, projects sab kuch isi file me he.
// ============================================================

export const profile = {
  name: "Aarav Dosanjh",
  handle: "aarav.dosanjh",
  role: "Full-Stack Developer & UI Wizard",
  tagline: "I build things for the internet. Sometimes they even work.",
  location: "New Delhi, India",
  email: "hello@dosanjh.dev",
  avatar: "/avatar.png",
  bio: `Namaste! I'm Aarav — a developer who fell in love with code the
first time he made a website say "Hello World" in 2016.

I specialize in building clean, fast and delightful web
experiences. My happy place is where good design meets solid
engineering — pixel-perfect UIs backed by APIs that don't fall
over when your relatives all visit your site at once.

When I'm not pushing code, I'm probably tweaking my setup,
breaking production (then fixing it), or arguing that CSS is
a real programming language. (It is. Fight me.)`,

  quickFacts: [
    { label: "Experience", value: "4+ years" },
    { label: "Projects shipped", value: "23" },
    { label: "Coffee consumed", value: "∞ cups" },
    { label: "Bugs fixed", value: "9999+" },
  ],
};

export const socials = [
  { name: "GitHub", url: "https://github.com/aaravdosanjh", icon: "github" },
  { name: "LinkedIn", url: "https://linkedin.com/in/aaravdosanjh", icon: "linkedin" },
  { name: "Instagram", url: "https://instagram.com/aarav.codes", icon: "instagram" },
  { name: "Twitter / X", url: "https://x.com/aaravdosanjh", icon: "twitter" },
];

export const projects = [
  {
    name: "ChaiPeCharcha",
    type: "folder",
    desc: "Real-time chat app with rooms, reactions & zero lag. Socket.io + Next.js.",
    tech: ["Next.js", "Socket.io", "Prisma"],
    status: "Live",
  },
  {
    name: "BazaarGo",
    type: "folder",
    desc: "Full e-commerce platform — cart, payments, admin panel, the whole shebang.",
    tech: ["React", "Node.js", "Razorpay"],
    status: "Live",
  },
  {
    name: "CodeBench",
    type: "folder",
    desc: "Online code editor & compiler in the browser. Supports 12 languages.",
    tech: ["Monaco", "Docker", "Go"],
    status: "Beta",
  },
  {
    name: "DesiWeather",
    type: "file",
    desc: "Weather app that tells you if you need a chaata (umbrella). 50k+ users.",
    tech: ["React Native", "OpenWeather"],
    status: "Live",
  },
  {
    name: "PixelPlay",
    type: "folder",
    desc: "Browser retro game arcade — 8 classics, one leaderboard, much nostalgia.",
    tech: ["Canvas", "TypeScript"],
    status: "Live",
  },
  {
    name: "Portfolio v7 (this!)",
    type: "file",
    desc: "A Windows 7 desktop, rebuilt from memories in React. You're inside it.",
    tech: ["Next.js", "Tailwind"],
    status: "Live",
  },
];

export const skillGroups = [
  {
    category: "Frontend",
    items: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js / Express", level: 88 },
      { name: "PostgreSQL / Prisma", level: 85 },
      { name: "Socket.io / WebRTC", level: 78 },
      { name: "Python", level: 75 },
    ],
  },
  {
    category: "Tools & Vibes",
    items: [
      { name: "Git & GitHub", level: 93 },
      { name: "Docker", level: 70 },
      { name: "UI/UX Design", level: 82 },
      { name: "Googling efficiently", level: 99 },
    ],
  },
];

export const resume = {
  summary:
    "Full-stack developer with 4+ years of experience building web applications used by thousands. Passionate about performance, clean code and interfaces that make people smile.",
  experience: [
    {
      role: "Senior Frontend Developer",
      company: "TechNova Labs",
      period: "2023 — Present",
      points: [
        "Led rebuild of flagship dashboard — cut load time by 58%.",
        "Mentor a team of 4 junior devs (they now fear linters too).",
        "Shipped design system used across 6 products.",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "PixelForge Studio",
      period: "2021 — 2023",
      points: [
        "Built 14 client sites & apps, from chai startups to fintech.",
        "Introduced TypeScript — runtime errors dropped dramatically.",
        "Automated deploys, saved ~6 hrs/week of manual FTP pain.",
      ],
    },
    {
      role: "Junior Developer (Intern turned full-time)",
      company: "WebWala Solutions",
      period: "2020 — 2021",
      points: [
        "Fixed more IE11 bugs than any human should.",
        "Learned that 'it works on my machine' is not a strategy.",
      ],
    },
  ],
  education: {
    degree: "B.Tech, Computer Science",
    school: "Delhi Technological University",
    period: "2016 — 2020",
    note: "8.4 CGPA • Coding club lead • Hackathon runner-up ×2",
  },
};

export const drives = [
  { label: "Skills (C:)", used: 78, free: "22.4 GB free of 102 GB", icon: "c" },
  { label: "Projects (D:)", used: 91, free: "9.3 GB free of 102 GB", icon: "d" },
  { label: "Memories (E:)", used: 40, free: "61.2 GB free of 102 GB", icon: "e" },
];

export const systemSpecs = [
  { label: "Processor", value: "Human Brain @ 3.6 GHz (overclocked by coffee)" },
  { label: "Installed RAM", value: "8.00 GB (expandable, requires sleep)" },
  { label: "System type", value: "64-bit Operating System, chill personality" },
  { label: "Graphics", value: "Imagination Engine™ with ray-traced daydreams" },
  { label: "Windows edition", value: "Portfolio 7 Ultimate — Nostalgia Pack" },
];

export const recycleItems = [
  { name: "procrastination.dll", size: "42 MB", type: "Application" },
  { name: "excuses_final_FINAL_v3.docx", size: "1.2 MB", type: "Document" },
  { name: "bug_free_code.pptx", size: "0 KB", type: "Fantasy deck" },
  { name: "old_crush.png", size: "2.1 MB", type: "PNG image" },
  { name: "sleep_schedule.reg", size: "—", type: "Corrupted file" },
];
