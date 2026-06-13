"use client";

import * as React from "react";
import { Badge, Button, Card, CardContent, Input } from "@/components/ui/ui-components";
import { Search, FileText, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  _id: string;
  topic: string;
  subject: string;
  link: string;
  order: number;
}

interface ResourcesClientProps {
  initialNotes: Note[];
}

export function ResourcesClient({ initialNotes }: ResourcesClientProps) {
  const [search, setSearch] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("All");

  // Get unique subjects list
  const subjects = React.useMemo(() => {
    const list = new Set<string>();
    initialNotes.forEach((note) => {
      if (note.subject) list.add(note.subject);
    });
    return ["All", ...Array.from(list)];
  }, [initialNotes]);

  // Filter notes
  const filteredNotes = React.useMemo(() => {
    return initialNotes.filter((note) => {
      const matchesSearch = note.topic.toLowerCase().includes(search.toLowerCase()) ||
                            note.subject.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [initialNotes, search, selectedSubject]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/60 glass">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by topic name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs bg-background/50 rounded-lg"
          />
        </div>

        {/* Category subject buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {subjects.map((sub) => (
            <Button
              key={sub}
              variant={selectedSubject === sub ? "gradient" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(sub)}
              className="rounded-lg text-xs h-9"
            >
              {sub}
            </Button>
          ))}
        </div>
      </div>

      {/* Structured Notes Listing Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center p-12 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
          No lecture notes found matching your filters.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <motion.div
                key={note._id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <Card className="glass relative overflow-hidden p-5 border-border/85 hover:border-primary/25 hover:bg-accent/10 transition-all duration-300 flex items-center justify-between gap-4">
                  {/* Glowing dynamic highlight decoration */}
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {note.subject}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-teal-400" />
                        Topic Resources
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors leading-snug">
                      {note.topic}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={note.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="gradient"
                        size="sm"
                        className="rounded-xl h-9 px-4 text-xs font-bold gap-1 text-white hover:opacity-95"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Access Notes
                        <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                      </Button>
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
