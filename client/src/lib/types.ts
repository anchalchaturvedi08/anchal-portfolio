export interface Stat { value: number; suffix: string; label: string }
export interface Social { name: string; url: string }

export interface Profile {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  available: boolean;
  availabilityText: string;
  about: string[];
  currentlyLearning: string[];
  resumeUrl: string;
  avatarUrl: string;
  stats: Stat[];
  socials: Social[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveLink: string;
  githubLink: string;
  featured: boolean;
  order: number;
}

export interface Skill { id: string; name: string; category: string; order: number }

export interface Experience {
  id: string;
  title: string;
  company: string;
  date: string;
  summary: string;
  points: string[];
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ResumeMeta { size: number; updatedAt: string }

export interface Portfolio {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  resume: ResumeMeta | null;
}