"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from "@/components/ui/ui-components";
import { ExternalLink, Code } from "lucide-react";
import { Github } from "@/components/brand-icons";

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: string;
  order: number;
}

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
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
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
        No projects published yet.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => {
        const hasLiveUrl = project.liveUrl && project.liveUrl !== "#";
        const hasGithubUrl = project.githubUrl && project.githubUrl !== "#";

        return (
          <motion.div key={project._id} variants={itemVariants}>
            <Card className="glass relative overflow-hidden group h-full flex flex-col justify-between border-border hover:border-primary/30 transition-all duration-300">
              {/* Gradient Banner Thumbnail */}
              <div className={`h-32 w-full bg-gradient-to-tr ${project.thumbnail || "from-teal-500 to-emerald-600"} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/15 mix-blend-overlay" />
                <Code className="h-10 w-10 text-white/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              </div>

              <div>
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-3 min-h-[48px] leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-4 pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tag, tIdx) => (
                      <Badge key={tIdx} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg border border-border/60">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="px-6 pb-6 pt-4 border-t border-border/40 bg-muted/10 flex items-center gap-2">
                {hasGithubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs rounded-xl h-9 glass"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </Button>
                  </a>
                )}
                {hasLiveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="gradient"
                      size="sm"
                      className="w-full gap-1.5 text-xs rounded-xl h-9 text-white font-semibold"
                    >
                      Demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                ) : (
                  <Button
                    disabled
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs rounded-xl border-dashed h-9"
                  >
                    Local Only
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
