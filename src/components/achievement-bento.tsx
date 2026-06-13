"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/ui-components";
import { GraduationCap, Award, Compass, HeartHandshake, Sparkles, Flame, Cpu } from "lucide-react";

export function AchievementBento() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* 1. FSD & GenAI Expert - LARGE CARD (spans 2 columns on medium+) */}
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-teal-500/10 hover:border-teal-500/30">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-teal-500/5 blur-[40px] group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="space-y-3 p-8">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">MERN, Next.js & Vibe Coding Tools</span>
              <CardTitle className="text-2xl font-bold">FSD & GenAI Expert</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed max-w-xl text-muted-foreground pt-1">
              Deep expertise in full-stack architecture, building highly scalable systems with MERN and Next.js. Promotes cutting-edge engineering by teaching developers how to integrate Generative AI and Vibe Coding tools (Gemini, Cursor, Copilot) for accelerated, production-ready development.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0 flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              FSD Expert
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              GenAI Expert
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Vibe Coding Tools
            </span>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. batches - SMALL TALL CARD */}
      <motion.div variants={itemVariants}>
        <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-blue-500/10 hover:border-blue-500/30">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-blue-500/5 blur-[40px] group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="space-y-3 p-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Flame className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Teaching Scope</span>
              <CardTitle className="text-xl font-bold">30+ Cohort Batches</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground pt-1">
              Instructed over 30 full-stack development, database, and system design batches across 9+ leading tech education platforms. A highly practical, industry-aligned pedagogy.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0">
            <div className="text-xs font-semibold text-blue-500 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              9+ Platforms Taught
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. PW Skillshala Launch - SMALL TALL CARD */}
      <motion.div variants={itemVariants}>
        <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-purple-500/10 hover:border-purple-500/30">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-purple-500/5 blur-[40px] group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="space-y-3 p-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Featured Faculty</span>
              <CardTitle className="text-xl font-bold">PW Skillshala Launch</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground pt-1">
              Publicly designated as core launching faculty for Physics Wallah&apos;s Skillshala national offline upskilling network launch across India, carried by top publications.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              National Release
            </span>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Mentorship Impact - LARGE CARD (spans 2 columns on medium+) */}
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-pink-500/10 hover:border-pink-500/30">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-pink-500/5 blur-[40px] group-hover:scale-125 transition-transform duration-500" />
          <CardHeader className="space-y-3 p-8">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Student Support</span>
              <CardTitle className="text-2xl font-bold">20000+ Placements & Mentorships</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed max-w-xl text-muted-foreground pt-1">
              Personally mentored more than 20,000 students on programming, data structures, full stack architectures, portfolio builds, resume optimizations, and mock interview preparations, helping them secure roles in dynamic tech companies.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0 flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
              Career Mentoring
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              Resume Bootcamps
            </span>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
