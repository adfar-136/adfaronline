"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Briefcase, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/ui-components";

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  order: number;
}

export function TimelineExperience({ experiences }: { experiences?: Experience[] }) {
  const items = experiences && experiences.length > 0 ? experiences : siteConfig.experience;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } },
  };

  return (
    <div className="relative">
      {/* Central spine line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal-400 via-blue-500 to-purple-600 -translate-x-[1.5px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        {items.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex flex-col md:flex-row items-stretch ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot node */}
              <div className="absolute left-4 md:left-1/2 -translate-x-[15px] flex items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full bg-background border-[3px] border-blue-500 flex items-center justify-center text-blue-500 shadow-md">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Side Content Panel */}
              <div className={`w-full pl-12 md:pl-0 md:w-1/2 flex ${
                isEven ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12"
              }`}>
                <Card className="glass w-full max-w-lg border-border hover:border-blue-500/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                        {exp.period}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border w-fit font-medium">
                        {exp.company}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {exp.role}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </CardContent>
                </Card>
              </div>

              {/* Empty Spacer side for larger screens */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          );
        })}

        {/* Education node at the bottom */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-stretch"
        >
          {/* Node dot */}
          <div className="absolute left-4 md:left-1/2 -translate-x-[15px] flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full bg-background border-[3px] border-purple-500 flex items-center justify-center text-purple-500 shadow-md">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>

          {/* Side Content Panel */}
          <div className="w-full pl-12 md:pl-0 md:w-1/2 flex md:justify-start md:pl-12">
            <Card className="glass w-full max-w-lg border-border hover:border-purple-500/30 hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">
                    Graduation · {siteConfig.education.year}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border w-fit font-medium">
                    {siteConfig.education.school}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-gradient">
                  {siteConfig.education.degree}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-sm leading-relaxed text-muted-foreground">
                Graduated with a Bachelor of Technology in Electronics & Communication. Built foundational knowledge in logic gates, digital networks, data structures, and computer science systems.
              </CardContent>
            </Card>
          </div>
          
          {/* Spacer */}
          <div className="hidden md:block w-1/2" />
        </motion.div>
      </motion.div>
    </div>
  );
}
