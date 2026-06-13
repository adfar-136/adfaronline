export type Project = {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: string; // Tailwind gradient class
};

export const defaultProjects: Project[] = [
  {
    title: "DevFlow - Developer Q&A Platform",
    description: "A Next.js 15 developer query forum featuring recommendation search, automatic AI question answering, user reputation gamification, and responsive layout.",
    tech: ["Next.js", "Tailwind CSS", "MongoDB", "OpenAI API"],
    githubUrl: "https://github.com/adfar-136",
    liveUrl: "#",
    thumbnail: "from-teal-500 to-emerald-600"
  },
  {
    title: "Interactive Web SQL Sandbox",
    description: "A browser-based client that compiles relational queries using WebAssembly, enabling visual database schema builders and real-time ER diagrams.",
    tech: ["React", "WebAssembly", "SQL.js", "Tailwind CSS"],
    githubUrl: "https://github.com/adfar-136",
    liveUrl: "#",
    thumbnail: "from-blue-600 to-indigo-600"
  },
  {
    title: "VibeCoder Local Coding Agent",
    description: "An experimental node-based terminal agent using generative AI models to refactor directories, compose tests, and find bugs in Next.js applications.",
    tech: ["TypeScript", "Node.js", "Gemini API", "AST Parser"],
    githubUrl: "https://github.com/adfar-136",
    liveUrl: "#",
    thumbnail: "from-purple-600 to-pink-600"
  }
];
