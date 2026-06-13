export type Playlist = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  thumbnail: string;   // /public image path or remote URL or gradient colors description
  resolvedThumbnail?: string;
  youtubeUrl: string;  // Adfar pastes the playlist link here
  channel: "College Wallah" | "Learnyard" | "Adfar Rasheed";
  type?: "playlist" | "podcast";
};

export const playlists: Playlist[] = [
  { 
    id: "mern", 
    title: "Full Stack Development (MERN)", 
    description: "End-to-end MERN — MongoDB, Express, React, Node — building real, job-ready apps.", 
    level: "Intermediate", 
    tags: ["MERN", "React", "Node"], 
    thumbnail: "from-cyan-500 to-blue-600", // Will use a beautiful fallback gradient since physical images aren't present yet
    youtubeUrl: "#", 
    channel: "College Wallah" 
  },
  { 
    id: "nextjs", 
    title: "Next.js Mastery", 
    description: "App Router, Server Components, Server Actions, SSR/SSG and production deployment.", 
    level: "Advanced", 
    tags: ["Next.js", "TypeScript"], 
    thumbnail: "from-sky-500 to-indigo-600", 
    youtubeUrl: "#", 
    channel: "College Wallah" 
  },
  { 
    id: "dbms", 
    title: "DBMS & SQL", 
    description: "Relational + NoSQL modeling, joins, aggregation, transactions, and MongoDB.", 
    level: "Beginner", 
    tags: ["SQL", "MongoDB"], 
    thumbnail: "from-blue-600 to-purple-600", 
    youtubeUrl: "#", 
    channel: "Learnyard" 
  },
  { 
    id: "genai", 
    title: "Generative AI for Developers", 
    description: "Prompt engineering, AI coding tools, and Vibe Coding for real-world dev work.", 
    level: "Intermediate", 
    tags: ["GenAI", "Copilot"], 
    thumbnail: "from-purple-600 to-pink-600", 
    youtubeUrl: "#", 
    channel: "Learnyard" 
  },
  { 
    id: "javascript", 
    title: "JavaScript Deep Dive", 
    description: "From fundamentals to OOP, prototypes, async, and modern JS patterns.", 
    level: "Beginner", 
    tags: ["JavaScript"], 
    thumbnail: "from-teal-500 to-emerald-600", 
    youtubeUrl: "#", 
    channel: "College Wallah" 
  },
  { 
    id: "personal-react", 
    title: "React JS Core & Advanced Concepts", 
    description: "Detailed step-by-step React tutorials, hooks internals, custom hooks, and rendering optimizations.", 
    level: "Intermediate", 
    tags: ["React", "JavaScript"], 
    thumbnail: "from-amber-500 to-orange-600", 
    youtubeUrl: "#", 
    channel: "Adfar Rasheed" 
  },
  { 
    id: "personal-vibecoding", 
    title: "Vibe Coding with Cursor & Gemini", 
    description: "Master prompt engineering, AI refactoring, and constructing full SaaS architectures using Cursor and Gemini.", 
    level: "Advanced", 
    tags: ["GenAI", "Cursor", "VibeCoding"], 
    thumbnail: "from-rose-500 to-red-600", 
    youtubeUrl: "#", 
    channel: "Adfar Rasheed" 
  },
];
export type ChannelFilter = "All" | "College Wallah" | "Learnyard" | "Adfar Rasheed";
