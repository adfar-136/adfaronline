const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

// 1. Manually parse .env.local to load MONGODB_URI
try {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim();
        if (key && !key.startsWith("#")) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.log("Warning: Could not parse .env.local file. Falling back to system env.", e.message);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Error: MONGODB_URI is not defined. Please configure it in your .env.local file first.");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB at:", uri.replace(/:[^:@]+@/, ":****@"));
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    console.log("Cleaning dynamic CMS collections...");
    await db.collection("masterclasses").deleteMany({});
    await db.collection("registrations").deleteMany({});
    await db.collection("settings").deleteMany({});
    await db.collection("experiences").deleteMany({});
    await db.collection("projects").deleteMany({});
    await db.collection("press").deleteMany({});
    await db.collection("mentorship_bookings").deleteMany({});
    await db.collection("stats").deleteMany({});
    await db.collection("testimonials").deleteMany({});
    await db.collection("notes").deleteMany({});
    await db.collection("playlists").deleteMany({});

    // 1. Seed Global Settings
    const defaultSettings = {
      _id: "global",
      headline: "Professor & Program Director — PW Skills (Physics Wallah)",
      tagline: "Full-Stack Development & GenAI Expert. Teaching MERN, Next.js, and Vibe Coding tools (Gemini, Cursor, Copilot).",
      bio: "Adfar is a Full-Stack Development and Generative AI expert, senior tech educator, and MERN/Next.js architecture specialist who has spent ~5 years helping learners go from first line of code to production-ready engineers. He currently leads the Full Stack Development program at PW Skills — owning curriculum, live delivery, and learner outcomes across MERN, Next.js, and Database Management Systems — and is an on-screen face of PW across College Wallah (1M+ subscribers) and Learnyard (70K+ subscribers). Alongside deep systems development, he is a pioneer in teaching AI-assisted engineering and Vibe Coding tools, guiding developers to master modern AI tools (Gemini, Cursor, Copilot) to build better software, faster. He has taught 20000+ students across 30+ batches and hosts tutorials on his personal YouTube channel Adfar Rasheed, simplifying advanced engineering.",
      email: "adfarrasheed136@gmail.com",
      github: "https://github.com/adfar-136",
      linkedin: "https://www.linkedin.com/in/adfar-rasheed/",
      instagram: "https://www.instagram.com/adfarsirofficial",
      youtubeCollegeWallah: "https://www.youtube.com/@collegewallah",
      youtubeLearnyard: "https://www.youtube.com/@learnyard",
      youtubePersonal: "https://www.youtube.com/@AdfarRasheed",
      whatsappLink: "https://chat.whatsapp.com/invite/example",
      showWhatsappBanner: true,
      mentorshipLink: "", // Empty = use internal dynamic application booking form
      updatedAt: new Date()
    };
    await db.collection("settings").insertOne(defaultSettings);
    console.log("Seeded default settings.");

    // 2. Seed Experience Timeline
    const defaultExperiences = [
      {
        company: "PW Skills (Physics Wallah)",
        role: "Professor & Program Director",
        period: "Jan 2025–Present",
        description: "Leads the full FSD program (MERN, Next.js, DBMS); owns curriculum design & delivery; 30+ seminars/workshops; on-screen face across College Wallah (1M+ subscribers) & Learnyard (70K+ subscribers); publishes content on FSD, DBMS, Generative AI, and Vibe Coding.",
        order: 1
      },
      {
        company: "Newton School",
        role: "Curriculum Engineer & Full-time MERN Instructor",
        period: "May 2023–Oct 2023",
        description: "Delivered practical, job-ready MERN training; built industry-aligned assignment systems; mentored students on resumes, mock interviews, and placements.",
        order: 2
      },
      {
        company: "Geekster",
        role: "Web Curriculum Lead",
        period: "Mar 2022–May 2023",
        description: "Led the web-dev curriculum restructuring; utilized educational data analytics to improve student learning outcomes and graduation rates.",
        order: 3
      },
      {
        company: "Freelance Educator / Course Facilitator",
        role: "MERN Educator",
        period: "Oct 2021–Dec 2024",
        description: "Facilitated over 30 batches for organizations including Code Vidhya, Idtech Emeritus, UpGrad, Black Bucks, and Coding Spoon; trained 20000+ learners.",
        order: 4
      },
      {
        company: "98thPercentile",
        role: "Software Engineer & Coding Educator",
        period: "Feb 2021–Sep 2021",
        description: "Developed user interfaces for tracking student progress and assignments, boosting engagement by +25%; taught foundational HTML, CSS, JS, and React.",
        order: 5
      }
    ];
    await db.collection("experiences").insertMany(defaultExperiences);
    console.log("Seeded experiences timeline.");

    // 3. Seed Projects Grid
    const defaultProjects = [
      {
        title: "DevFlow - Developer Q&A Platform",
        description: "A Next.js 15 developer query forum featuring recommendation search, automatic AI question answering, user reputation gamification, and responsive layout.",
        tech: ["Next.js", "Tailwind CSS", "MongoDB", "OpenAI API"],
        githubUrl: "https://github.com/adfar-136",
        liveUrl: "https://devflow-demo.vercel.app",
        thumbnail: "from-teal-500 to-emerald-600",
        order: 1
      },
      {
        title: "Interactive Web SQL Sandbox",
        description: "A browser-based client that compiles relational queries using WebAssembly, enabling visual database schema builders and real-time ER diagrams.",
        tech: ["React", "WebAssembly", "SQL.js", "Tailwind CSS"],
        githubUrl: "https://github.com/adfar-136",
        liveUrl: "https://sql-sandbox.vercel.app",
        thumbnail: "from-blue-600 to-indigo-600",
        order: 2
      },
      {
        title: "VibeCoder Local Coding Agent",
        description: "An experimental node-based terminal agent using generative AI models to refactor directories, compose tests, and find bugs in Next.js applications.",
        tech: ["TypeScript", "Node.js", "Gemini API", "AST Parser"],
        githubUrl: "https://github.com/adfar-136",
        liveUrl: "https://github.com/adfar-136",
        thumbnail: "from-purple-600 to-pink-600",
        order: 3
      }
    ];
    await db.collection("projects").insertMany(defaultProjects);
    console.log("Seeded developer projects.");

    // 4. Seed Press Mentions
    const defaultPress = [
      {
        outlet: "Business Standard",
        text: "Named as faculty in PW Skillshala's national launch announcement (ANI, May 2026), carried by Business Standard and other outlets.",
        link: "https://www.business-standard.com/content/press-releases-ani/pw-skills-launches-pw-skillshala-a-network-of-offline-upskilling-centres-across-india-126052600005_1.html",
        createdAt: new Date("2026-05-26")
      }
    ];
    await db.collection("press").insertMany(defaultPress);
    console.log("Seeded press highlights.");

    // 5. Seed Sunday Masterclasses
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() + (day === 0 ? 0 : 7 - day); // next Sunday
    const nextSunday = new Date(today.setDate(diff));
    nextSunday.setHours(11, 0, 0, 0);

    const upcomingClass = {
      title: "Next.js App Router Mastery",
      topic: "Server Components, Server Actions & Better Auth Setup",
      description: "In this masterclass, we will construct a complete, secure Next.js web application from scratch. You will learn the internals of Server Components vs Client Components, handle forms natively using React 19 Server Actions, and configure Better Auth with a native MongoDB driver. Perfect for developers looking to move past simple static pages into production-grade systems.",
      date: nextSunday,
      time: "11:00 AM IST",
      durationMins: 90,
      price: 0,
      capacity: 35,
      status: "open",
      paymentNote: "Free masterclass. Workspace code links and meeting details will be emailed to you 24 hours prior.",
      createdAt: new Date()
    };

    const lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - (day === 0 ? 7 : day));
    lastSunday.setHours(11, 0, 0, 0);

    const pastClass = {
      title: "MERN Stack Crash Course",
      topic: "Scalable APIs & Database Modeling with MongoDB",
      description: "Dive deep into the fundamentals of MERN. We built a RESTful API from scratch using Express.js and structured advanced NoSQL data schemas in MongoDB. We covered query indexes, aggregation queries, and performance optimization for college learners.",
      date: lastSunday,
      time: "11:00 AM IST",
      durationMins: 120,
      price: 299,
      capacity: 50,
      status: "closed",
      paymentNote: "Pay via UPI QR code emailed to you after registration.",
      createdAt: new Date(lastSunday.getTime() - 1000 * 60 * 60 * 24 * 5)
    };

    const mcResult = await db.collection("masterclasses").insertMany([upcomingClass, pastClass]);
    console.log("Seeded masterclasses successfully:", mcResult.insertedIds);

    // 6. Seed Registrations
    const pastMcId = mcResult.insertedIds[1];
    const mockRegistrations = [
      {
        masterclassId: pastMcId,
        userId: "mock_user_1",
        userName: "Aman Gupta",
        userEmail: "aman@gmail.com",
        createdAt: new Date(lastSunday.getTime() - 1000 * 60 * 60 * 24 * 3)
      },
      {
        masterclassId: pastMcId,
        userId: "mock_user_2",
        userName: "Sneha Patel",
        userEmail: "sneha@yahoo.com",
        createdAt: new Date(lastSunday.getTime() - 1000 * 60 * 60 * 24 * 2)
      },
      {
        masterclassId: pastMcId,
        userId: "mock_user_3",
        userName: "Rohan Kumar",
        userEmail: "rohan@outlook.com",
        createdAt: new Date(lastSunday.getTime() - 1000 * 60 * 60 * 24 * 1)
      }
    ];
    await db.collection("registrations").insertMany(mockRegistrations);
    console.log("Seeded mock registrations for past class.");

    // Verification index
    await db.collection("registrations").createIndex(
      { masterclassId: 1, userId: 1 },
      { unique: true }
    );
    console.log("Verified registrations unique index.");

    // Seed default stats
    const defaultStats = [
      { label: "College Wallah Reached", value: "1M+", sub: "On-screen educator", order: 1 },
      { label: "Learnyard Subscribers", value: "70K+", sub: "Course audience", order: 2 },
      { label: "Students Mentored", value: "20000+", sub: "Across 30+ batches", order: 3 },
      { label: "Seminars & Workshops", value: "30+", sub: "College campus visits", order: 4 },
      { label: "Public GitHub Repos", value: "140", sub: "Open-source work", order: 5 }
    ];
    await db.collection("stats").insertMany(defaultStats);
    console.log("Seeded default key metrics stats (20000+).");

    // Seed default testimonials
    const defaultTestimonials = [
      {
        name: "Aman Gupta",
        role: "Student",
        company: "PW Skills Cohort 3",
        text: "Adfar's Full-Stack lectures are incredibly clear. He doesn't just show code; he explains the underlying event loop, asynchronous operations, and database indexing. Taught me modern AI tools workflow which doubled my speed.",
        rating: 5,
        status: "approved",
        createdAt: new Date()
      },
      {
        name: "Sneha Sharma",
        role: "Coworker",
        company: "Physics Wallah",
        text: "Adfar is an outstanding educator and program director. His ability to structure full-stack curriculum, design live projects, and teach advanced AI tooling integrations is a huge asset to our platform.",
        rating: 5,
        status: "approved",
        createdAt: new Date()
      }
    ];
    await db.collection("testimonials").insertMany(defaultTestimonials);
    console.log("Seeded default approved student & coworker testimonials.");

    // Seed default notes
    const defaultNotes = [
      { topic: "HTML & CSS Basics", subject: "JavaScript", link: "https://drive.google.com/drive/folders/example1", order: 1, createdAt: new Date() },
      { topic: "JavaScript Async/Await & Event Loop", subject: "JavaScript", link: "https://drive.google.com/drive/folders/example2", order: 2, createdAt: new Date() },
      { topic: "Node.js Event-Driven Architecture", subject: "Full Stack", link: "https://drive.google.com/drive/folders/example3", order: 1, createdAt: new Date() },
      { topic: "Express.js REST API Design", subject: "Full Stack", link: "https://drive.google.com/drive/folders/example4", order: 2, createdAt: new Date() },
      { topic: "Next.js 15 Server Components vs Client Components", subject: "Next.js", link: "https://drive.google.com/drive/folders/example5", order: 1, createdAt: new Date() },
      { topic: "React 19 Server Actions & Native Forms", subject: "Next.js", link: "https://drive.google.com/drive/folders/example6", order: 2, createdAt: new Date() },
      { topic: "Relational Modeling & SQL Join Queries", subject: "Databases", link: "https://drive.google.com/drive/folders/example7", order: 1, createdAt: new Date() },
      { topic: "NoSQL Schema Design & MongoDB Indexing", subject: "Databases", link: "https://drive.google.com/drive/folders/example8", order: 2, createdAt: new Date() },
      { topic: "Generative AI Prompt Engineering for Developers", subject: "Generative AI", link: "https://drive.google.com/drive/folders/example9", order: 1, createdAt: new Date() },
      { topic: "Vibe Coding: Agentic Refactoring with Cursor", subject: "Generative AI", link: "https://drive.google.com/drive/folders/example10", order: 2, createdAt: new Date() },
    ];
    await db.collection("notes").insertMany(defaultNotes);
    console.log("Seeded default lecture notes.");

    // Seed default playlists
    const defaultPlaylists = [
      { 
        title: "Full Stack Development (MERN)", 
        description: "End-to-end MERN — MongoDB, Express, React, Node — building real, job-ready apps.", 
        level: "Intermediate", 
        tags: ["MERN", "React", "Node"], 
        thumbnail: "from-cyan-500 to-blue-600",
        youtubeUrl: "#", 
        channel: "College Wallah",
        createdAt: new Date()
      },
      { 
        title: "Next.js Mastery", 
        description: "App Router, Server Components, Server Actions, SSR/SSG and production deployment.", 
        level: "Advanced", 
        tags: ["Next.js", "TypeScript"], 
        thumbnail: "from-sky-500 to-indigo-600", 
        youtubeUrl: "#", 
        channel: "College Wallah",
        createdAt: new Date()
      },
      { 
        title: "DBMS & SQL", 
        description: "Relational + NoSQL modeling, joins, aggregation, transactions, and MongoDB.", 
        level: "Beginner", 
        tags: ["SQL", "MongoDB"], 
        thumbnail: "from-blue-600 to-purple-600", 
        youtubeUrl: "#", 
        channel: "Learnyard",
        createdAt: new Date()
      },
      { 
        title: "Generative AI for Developers", 
        description: "Prompt engineering, AI coding tools, and Vibe Coding for real-world dev work.", 
        level: "Intermediate", 
        tags: ["GenAI", "Copilot"], 
        thumbnail: "from-purple-600 to-pink-600", 
        youtubeUrl: "#", 
        channel: "Learnyard",
        createdAt: new Date()
      },
      { 
        title: "JavaScript Deep Dive", 
        description: "From fundamentals to OOP, prototypes, async, and modern JS patterns.", 
        level: "Beginner", 
        tags: ["JavaScript"], 
        thumbnail: "from-teal-500 to-emerald-600", 
        youtubeUrl: "#", 
        channel: "College Wallah",
        createdAt: new Date()
      },
      { 
        title: "React JS Core & Advanced Concepts", 
        description: "Detailed step-by-step React tutorials, hooks internals, custom hooks, and rendering optimizations.", 
        level: "Intermediate", 
        tags: ["React", "JavaScript"], 
        thumbnail: "from-amber-500 to-orange-600", 
        youtubeUrl: "#", 
        channel: "Adfar Rasheed",
        createdAt: new Date()
      },
      { 
        title: "Vibe Coding with Cursor & Gemini", 
        description: "Master prompt engineering, AI refactoring, and constructing full SaaS architectures using Cursor and Gemini.", 
        level: "Advanced", 
        tags: ["GenAI", "Cursor", "VibeCoding"], 
        thumbnail: "from-rose-500 to-red-600", 
        youtubeUrl: "#", 
        channel: "Adfar Rasheed",
        createdAt: new Date()
      }
    ];
    await db.collection("playlists").insertMany(defaultPlaylists);
    console.log("Seeded default YouTube playlists.");

    console.log("\nDatabase seeding completed successfully! 🎉");
  } catch (err) {
    console.error("Seeding failed with error:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seed();
