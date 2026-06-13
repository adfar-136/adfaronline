"use client";

import * as React from "react";
import { playlists as staticPlaylists, Playlist, ChannelFilter } from "@/data/playlists";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from "@/components/ui/ui-components";
import { ExternalLink, Library, Sparkles } from "lucide-react";
import { Youtube } from "@/components/brand-icons";
import { motion, AnimatePresence } from "framer-motion";
import { getYouTubeVideoId } from "@/lib/youtube";

export function PlaylistsFilter({ initialPlaylists }: { initialPlaylists?: Playlist[] }) {
  const rawPlaylists = initialPlaylists && initialPlaylists.length > 0 ? initialPlaylists : staticPlaylists;
  const [selectedChannel, setSelectedChannel] = React.useState<ChannelFilter>("All");
  const [selectedTag, setSelectedTag] = React.useState<string>("All");

  // Extract all unique tags across playlists
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    rawPlaylists.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags)];
  }, []);

  // Filter logic
  const filteredPlaylists = React.useMemo(() => {
    return rawPlaylists.filter((p) => {
      const matchesChannel = selectedChannel === "All" || p.channel === selectedChannel;
      const matchesTag = selectedTag === "All" || p.tags.includes(selectedTag);
      return matchesChannel && matchesTag;
    });
  }, [selectedChannel, selectedTag]);

  // Map levels to badges variant
  const getLevelVariant = (level: Playlist["level"]) => {
    if (level === "Beginner") return "beginner";
    if (level === "Intermediate") return "intermediate";
    return "advanced";
  };

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60 glass">
        {/* Channel filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Youtube className="h-4 w-4 text-red-500" />
            Channel:
          </span>
          {(["All", "College Wallah", "Learnyard", "Adfar Rasheed"] as ChannelFilter[]).map((channel) => (
            <Button
              key={channel}
              variant={selectedChannel === channel ? "gradient" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedChannel(channel);
                setSelectedTag("All"); // Reset tag filter when changing channel
              }}
              className="rounded-lg text-xs"
            >
              {channel}
            </Button>
          ))}
        </div>

        {/* Tag filter selector */}
        <div className="flex flex-wrap items-center gap-2 max-w-xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5">
            <Library className="h-4 w-4 text-blue-500" />
            Topic:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1">
            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border-primary font-medium"
                      : "bg-background/40 text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPlaylists.map((p) => {
            const isComingSoon = p.youtubeUrl === "#";
            let imageUrl = p.resolvedThumbnail;
            
            if (!imageUrl && p.thumbnail && (p.thumbnail.startsWith("http") || p.thumbnail.startsWith("/") || p.thumbnail.includes("."))) {
              imageUrl = p.thumbnail;
            }
            
            if (!imageUrl && p.youtubeUrl && p.youtubeUrl !== "#") {
              const videoId = getYouTubeVideoId(p.youtubeUrl);
              if (videoId) {
                imageUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="h-full"
              >
                <Card className="flex flex-col justify-between h-full border border-border bg-card hover:bg-accent/20 hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden">
                  <div>
                    {/* Glowing Thumbnail Area */}
                    <div className={`relative h-44 w-full ${!imageUrl ? `bg-gradient-to-tr ${p.thumbnail}` : "bg-muted"} flex items-center justify-center overflow-hidden`}>
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                        <Badge variant={p.channel === "College Wallah" ? "cw" : p.channel === "Learnyard" ? "ly" : "ar"}>
                          {p.channel}
                        </Badge>
                        <Badge variant={getLevelVariant(p.level)}>
                          {p.level}
                        </Badge>
                      </div>
                      
                      <div className="p-3.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white group-hover:scale-125 transition-transform duration-300 z-10 shadow-lg">
                        <Youtube className="h-7 w-7 text-red-500 fill-red-500" />
                      </div>

                      {/* Glass bar info at bottom of thumbnail */}
                      <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-black/40 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-xs text-white z-10">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-teal-400" />
                          Premium Course
                        </span>
                        <span>Free Access</span>
                      </div>
                    </div>

                    <CardHeader className="space-y-1.5 p-5 pb-2">
                      <CardTitle className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {p.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
                        {p.description}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <div>
                    <CardContent className="p-5 pt-0 pb-4">
                      {/* Tags list */}
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground border border-border"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 border-t border-border/40 mt-auto bg-muted/20">
                      {isComingSoon ? (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full text-xs gap-1.5 rounded-xl border-dashed h-9"
                        >
                          Coming soon
                        </Button>
                      ) : (
                        <a
                          href={p.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button
                            variant="gradient"
                            className="w-full text-xs gap-1.5 rounded-xl h-9 hover:opacity-95"
                          >
                            Go to Playlist
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
