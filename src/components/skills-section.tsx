"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/ui-components";
import { Layers, Zap, Database, Sliders, Cpu } from "lucide-react";

export function SkillsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes("full stack")) {
      return <Layers className="h-5 w-5 text-teal-400" />;
    }
    if (category.toLowerCase().includes("next")) {
      return <Zap className="h-5 w-5 text-blue-400" />;
    }
    if (category.toLowerCase().includes("database")) {
      return <Database className="h-5 w-5 text-indigo-400" />;
    }
    if (category.toLowerCase().includes("system")) {
      return <Sliders className="h-5 w-5 text-purple-400" />;
    }
    return <Cpu className="h-5 w-5 text-pink-400" />;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {siteConfig.skills.map((skillGroup, idx) => {
        return (
          <motion.div key={idx} variants={cardVariants}>
            <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-border hover:border-primary/30 transition-all duration-300">
              {/* Highlight bar */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 opacity-30 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="space-y-2.5 p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-background border border-border/80 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(skillGroup.category)}
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {skillGroup.category}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl border border-border bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
