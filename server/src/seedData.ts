/** Starting content, taken from Anchal's CV. Edit later from the admin panel. */

export const profile = {
  name: "Anchal Chaturvedi",
  role: "Full Stack Developer · MERN Stack",
  tagline:
    "I build role-based platforms end to end — from the data model and the REST API to the dashboards people actually work in.",
  location: "Indore, Madhya Pradesh",
  email: "anchalc640@gmail.com",
  available: true,
  availabilityText: "Open to full-stack developer roles",
  about: [
    "I am a Computer Science graduate (B.Tech, 2026) and a full-stack developer. I have shipped two role-based platforms: a MERN auction marketplace and a TypeScript service-management CRM, together spanning more than 120 REST endpoints, three-tier authorisation and over 500 automated tests.",
    "My interest sits in the parts of a product that decide whether it holds up — modelling a lifecycle as an explicit state machine rather than scattered conditionals, putting authorisation in middleware instead of in every route, and sharing validation schemas between client and server so the two cannot drift apart.",
    "I contribute to open source across four programmes, including a project-admin role where I triaged issues and reviewed pull requests from external contributors.",
  ],
  currentlyLearning: ["System design", "Testing at scale", "Cloud deployment"],
  resumeUrl: "",
  avatarUrl: "",
  stats: [
    { value: 2026, suffix: "", label: "B.Tech CSE graduate" },
    { value: 2, suffix: "", label: "Full-stack platforms shipped" },
    { value: 4, suffix: "", label: "Open-source programmes" },
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/anchalchaturvedi08" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/anchal-chaturvedi-9739a7220/" },
  ],
};

export const projects = [
  {
    title: "Storage Wars",
    description:
      "An online auction and bidding platform serving three distinct roles — admin, seller and customer — across 20 dashboard screens in a single React application. Behind it sit 43 REST endpoints over 12 route groups and 9 MongoDB collections, with relationships modelled as ObjectId references resolved through Mongoose population. Authorisation runs in three layers: JWT verification, a role-check middleware and per-resource ownership checks. Listings move from upcoming to live to completed on a timed lifecycle, with a five-stage bid validation pipeline and seller-controlled bid approval. The Google Gemini API powers an in-app assistant, and Nodemailer handles contact-form delivery.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Tailwind CSS"],
    image: "",
    liveLink: "",
    githubLink: "",
    featured: true,
    order: 1,
  },
  {
    title: "Cooler CRM",
    description:
      "An after-sales service management platform written in strict-mode TypeScript across an npm workspaces monorepo, exposing 80 REST endpoints over 11 domain modules and 36 React screens for admins, service-centre owners and technicians. The complaint lifecycle is a declarative state machine covering 12 statuses, encoding role permissions, preconditions and mandatory reason capture in one lookup table rather than scattering checks across routes. Authentication uses JWT access and refresh tokens backed by server-side session records, supporting revocation and reuse detection. Customer verification codes are encrypted with AES-256-GCM, and 532 test cases across 34 Vitest and Supertest suites cover the result.",
    tech: ["TypeScript", "React 19", "Express 5", "MongoDB", "Mongoose", "Zod", "Vitest", "Tailwind CSS"],
    image: "",
    liveLink: "",
    githubLink: "",
    featured: true,
    order: 2,
  },
];

const skillGroups: Record<string, string[]> = {
  Languages: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  Frontend: ["React.js", "React Router", "TanStack Query", "React Hook Form", "Tailwind CSS", "Bootstrap", "Three.js", "GSAP", "Vite"],
  Backend: ["Node.js", "Express.js", "REST API design", "JWT authentication", "bcrypt", "Zod validation", "Nodemailer"],
  Database: ["MongoDB", "Mongoose", "Schema design", "Aggregation"],
  "Testing & Tools": ["Vitest", "Supertest", "Postman", "Git", "GitHub", "MongoDB Compass", "Vercel", "Appwrite"],
  Concepts: ["Role-based access control", "Middleware architecture", "MVC separation", "State machine design", "Responsive design"],
};

export const skills = Object.entries(skillGroups).flatMap(([category, names], g) =>
  names.map((name, i) => ({ name, category, order: g * 100 + i }))
);

export const experience = [
  {
    title: "MERN Stack Trainee",
    company: "Universal Informatics, Indore",
    date: "Feb 2026 – Sep 2026",
    summary: "Building full-stack applications across the MERN stack under review.",
    points: [
      "Built full-stack applications covering authentication, CRUD operations and REST API design using MongoDB, Express.js, React.js and Node.js.",
      "Modelled data using Mongoose schemas and references, verifying stored documents directly in MongoDB Compass.",
      "Tested every endpoint in Postman across multiple roles to confirm authentication and authorisation behave correctly.",
      "Used Git and GitHub for version control and review.",
    ],
    order: 1,
  },
  {
    title: "Project Admin — Signature App",
    company: "Script Winter of Code '24",
    date: "Nov 2024 – Jan 2025",
    summary: "Led the project as admin for an open-source programme.",
    points: [
      "Defined and triaged issues, setting the scope contributors worked from.",
      "Reviewed pull requests and coordinated external contributors through to merge.",
    ],
    order: 2,
  },
  {
    title: "Open Source Contributor",
    company: "GSSoC '24 · Hacktoberfest '24 · SSoC '25",
    date: "2024 – 2025",
    summary: "Contributing across multiple repositories through the Git pull-request workflow.",
    points: [
      "Contributed features, bug fixes, frontend improvements and documentation.",
      "Worked across multiple repositories following each project's contribution guidelines.",
    ],
    order: 3,
  },
  {
    title: "B.Tech, Computer Science Engineering",
    company: "Jawaharlal Nehru College of Technology, Rewa (RGPV, Bhopal)",
    date: "2022 – 2026",
    summary: "CGPA 7.46 / 10.",
    points: [],
    order: 4,
  },
];
