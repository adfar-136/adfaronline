"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@/components/ui/ui-components";
import { Youtube } from "@/components/brand-icons";
import { Sparkles, ExternalLink, Users, Tv, Code } from "lucide-react";
import { siteConfig } from "@/data/site";

interface YoutubeChannelsHighlightProps {
  settings?: any;
}

export function YoutubeChannelsHighlight({ settings }: YoutubeChannelsHighlightProps) {
  const channels = [
    {
      name: "College Wallah",
      subscribers: "1M+ Subscribers",
      role: "Work-Related Partner · On-Screen Face",
      description: "Leading the national offline & online upskilling initiatives. Instructs full-stack engineering, JavaScript deep-dives, and complex React architectures reaching millions of viewers.",
      icon: <Tv className="h-5 w-5 text-red-500" />,
      url: settings?.youtubeCollegeWallah || siteConfig.youtubeCollegeWallah,
      borderColor: "border-red-500/20 hover:border-red-500/40",
      glowColor: "bg-red-500/5",
      btnText: "Explore College Wallah",
      badgeText: "Featured Faculty"
    },
    {
      name: "Learnyard",
      subscribers: "70K+ Subscribers",
      role: "Work-Related Partner · Core CS Educator",
      description: "Shaping next-gen developers with high-caliber curriculum focusing on Database Management Systems (DBMS), SQL querying internals, and practical integrations of Generative AI tools.",
      icon: <Users className="h-5 w-5 text-amber-500" />,
      url: settings?.youtubeLearnyard || siteConfig.youtubeLearnyard,
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
      glowColor: "bg-amber-500/5",
      btnText: "Explore Learnyard",
      badgeText: "Lead CS Instructor"
    },
    {
      name: "Adfar Rasheed",
      subscribers: "Personal Creator Hub",
      role: "Personal Channel · Tech Educator",
      description: "My personal workspace for vibe coding live streams, system design breakdowns, developer productivity hacks, and detailed tutorials on working with cutting-edge AI agents.",
      icon: <Code className="h-5 w-5 text-teal-500" />,
      url: settings?.youtubePersonal || siteConfig.youtubePersonal,
      borderColor: "border-teal-500/20 hover:border-teal-500/40",
      glowColor: "bg-teal-500/5",
      btnText: "Visit Personal Channel",
      badgeText: "Creator & Founder"
    }
  ];

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
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
    >
      {channels.map((chan, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <Card className={`glass relative overflow-hidden group h-full flex flex-col justify-between border ${chan.borderColor} transition-all duration-300`}>
            {/* Glowing background blob */}
            <div className={`absolute top-0 right-0 w-[150px] h-[150px] rounded-full ${chan.glowColor} blur-[40px] group-hover:scale-125 transition-transform duration-500`} />
            
            <CardHeader className="space-y-3 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-background border border-border/60">
                  {chan.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {chan.badgeText}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{chan.subscribers}</span>
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                </div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  {chan.name}
                </CardTitle>
                <p className="text-[10px] font-semibold text-primary/80 mt-0.5">{chan.role}</p>
              </div>
              
              <CardDescription className="text-xs leading-relaxed text-muted-foreground pt-1.5">
                {chan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 mt-auto">
              <a
                href={chan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 rounded-xl h-10 glass border-border hover:border-primary/50 text-xs font-bold transition-all"
                >
                  <Youtube className="h-4 w-4 text-red-500 fill-red-500" />
                  {chan.btnText}
                  <ExternalLink className="h-3 w-3 opacity-60 ml-auto" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
