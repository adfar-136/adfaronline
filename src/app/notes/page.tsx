import * as React from "react";
import { getDb } from "@/lib/mongodb";
import { ResourcesClient } from "@/components/resources-client";
import { FileText, ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lecture Notes & Documents",
  description: "Download topic-wise programming lecture notes, PDFs, slides, and learning assets curated by Adfar Rasheed.",
};

export default async function NotesPage() {
  let notes: any[] = [];

  try {
    const db = await getDb();
    
    // Fetch dynamic notes
    const rawNotes = await db.collection("notes").find({}, { sort: { subject: 1, order: 1 } }).toArray();
    notes = rawNotes.map((n) => ({
      ...n,
      _id: n._id.toString(),
      createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : String(n.createdAt),
    }));
  } catch (err) {
    console.error("Failed to fetch dynamic notes in NotesPage", err);
    // Fallback notes
    notes = [
      { _id: "f1", topic: "HTML & CSS Basics", subject: "JavaScript", link: "#", order: 1 },
      { _id: "f2", topic: "JavaScript Async/Await & Event Loop", subject: "JavaScript", link: "#", order: 2 },
      { _id: "f3", topic: "Node.js Event-Driven Architecture", subject: "Full Stack", link: "#", order: 1 },
      { _id: "f4", topic: "Express.js REST API Design", subject: "Full Stack", link: "#", order: 2 },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Navigation Header */}
      <div className="space-y-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          id="back-to-home-link"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        <div className="p-8 rounded-2xl border border-border bg-card/60 glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[50px]" />
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-blue-400" />
              Student Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Lecture Notes & Documents
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Access my topic-wise learning repositories. Search and download PDFs, presentation slides, and notes for MERN stack and JavaScript courses.
            </p>
          </div>
        </div>
      </div>

      {/* Lecture Notes section */}
      <section className="space-y-8 scroll-mt-28" id="notes-section">
        <ResourcesClient initialNotes={notes} />
      </section>
    </div>
  );
}
