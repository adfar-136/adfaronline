"use client";

import * as React from "react";
import { siteConfig } from "@/data/site";
import { Button } from "./ui/ui-components";
import { Counter } from "./counter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Users, BookOpen, Award, Terminal } from "lucide-react";
import Link from "next/link";

export function HeroInteractive({
  headline,
  tagline,
  stats
}: {
  headline?: string;
  tagline?: string;
  stats?: Array<{ label: string; value: string; sub: string }>;
}) {
  const roles = [
    "Full-Stack Development Expert",
    "Generative AI Specialist",
    "Vibe Coding Tools Instructor",
    "Program Director @ PW Skills",
    "Content Creator @adfarsirofficial"
  ];
  
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Map statistical values and icons for the stats cards
  const statIcons = [
    <Users key="users" className="h-5 w-5 text-teal-400" />,
    <BookOpen key="book" className="h-5 w-5 text-blue-400" />,
    <Users key="mentored" className="h-5 w-5 text-indigo-400" />,
    <Award key="workshops" className="h-5 w-5 text-purple-400" />,
    <Terminal key="repos" className="h-5 w-5 text-pink-400" />
  ];

  const items = stats && stats.length > 0 ? stats : siteConfig.stats;

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Aurora Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/10 left-1/5 w-[500px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-[120px] animate-aurora-1" />
        <div className="absolute bottom-1/5 right-1/10 w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-[140px] animate-aurora-2" />
        <div className="absolute top-1/2 left-2/3 w-[450px] h-[450px] rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-[100px] animate-aurora-3" />
      </div>

      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm shadow-teal-500/5"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Welcome to my Tech Hub
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-4xl"
        >
          Hi, I am{" "}
          <span className="text-gradient">
            {siteConfig.name}
          </span>
        </motion.h1>

        {/* Word-cycling Role tagline */}
        <div className="h-10 sm:h-12 mb-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-xl sm:text-3xl font-bold text-muted-foreground tracking-tight flex items-center gap-2"
            >
              <span className="text-foreground">{roles[roleIndex]}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Description Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
        >
          &ldquo;{tagline || siteConfig.tagline}&rdquo;
        </motion.p>

        {/* Actions Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mb-20"
        >
          <Link href="/playlists" className="w-full sm:w-auto">
            <Button
              variant="gradient"
              size="lg"
              className="w-full gap-2 rounded-xl h-12 shadow-lg shadow-teal-500/10 font-semibold"
            >
              <Play className="h-4 w-4 fill-white" />
              Explore Playlists
            </Button>
          </Link>
          <Link href="/masterclass" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 rounded-xl h-12 glass border-border hover:border-primary/50 transition-colors font-semibold"
            >
              Join Sunday Masterclass
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Live Count-up Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full"
        >
          {items.map((stat, idx) => {
            // Extract numeric values and characters like M+, K+, etc.
            const numVal = parseInt(stat.value.replace(/[^0-9]/g, ""));
            const suffix = stat.value.replace(/[0-9]/g, "");

            return (
              <div
                key={idx}
                className="relative group p-5 rounded-2xl border border-border bg-card hover:bg-accent/40 shadow-sm glass transition-all duration-300 flex flex-col items-center justify-center overflow-hidden"
              >
                {/* Decorative border highlight */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-2.5 rounded-xl bg-background border border-border/60 mb-3 group-hover:scale-110 transition-transform">
                  {statIcons[idx]}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  <Counter value={numVal} />{suffix}
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-1 text-center leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
