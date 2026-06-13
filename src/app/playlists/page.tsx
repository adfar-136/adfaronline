import * as React from "react";
import { getDb } from "@/lib/mongodb";
import { PlaylistsFilter } from "@/components/playlists-filter";
import { GraduationCap, ArrowLeft, Radio, Mic, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { resolveYouTubeThumbnail } from "@/lib/youtube";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from "@/components/ui/ui-components";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Course Playlists",
  description: "Access curated programming playlists and podcast interviews for Full-Stack Development and Generative AI courses taught by Adfar Rasheed.",
};

export default async function PlaylistsPage() {
  let playlists: any[] = [];

  try {
    const db = await getDb();
    
    // Fetch dynamic playlists
    const rawPlaylists = await db.collection("playlists").find({}).toArray();
    playlists = await Promise.all(
      rawPlaylists.map(async (p) => {
        let resolved = p.resolvedThumbnail;
        if (!resolved && p.youtubeUrl && p.youtubeUrl !== "#") {
          resolved = await resolveYouTubeThumbnail(p.youtubeUrl);
          if (resolved) {
            // Background update to save the resolved thumbnail in the DB
            db.collection("playlists")
              .updateOne({ _id: p._id }, { $set: { resolvedThumbnail: resolved } })
              .catch((err) => {
                console.error(`Failed to update pre-resolved thumbnail for ${p._id}:`, err);
              });
          }
        }
        return {
          ...p,
          id: p._id.toString(),
          _id: p._id.toString(),
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
          resolvedThumbnail: resolved || undefined,
        };
      })
    );
  } catch (err) {
    console.error("Failed to fetch dynamic playlists in PlaylistsPage", err);
  }

  const coursePlaylists = playlists.filter((p) => p.type !== "podcast");
  const podcastPlaylists = playlists.filter((p) => p.type === "podcast");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
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
          <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full bg-teal-500/5 blur-[50px]" />
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-teal-400" />
              Student Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              YouTube Playlists & Podcasts
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Explore my structured, full-length course series on MERN, Next.js, and DBMS, alongside my podcast interviews and career talk sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Playlists grid filter section */}
      <section className="space-y-8 scroll-mt-28" id="playlists-section">
        <div className="space-y-1 text-left border-b border-border/60 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Course Playlists</h2>
          <p className="text-xs text-muted-foreground">
            Structured course series on programming languages, databases, and frameworks.
          </p>
        </div>
        <PlaylistsFilter initialPlaylists={coursePlaylists} />
      </section>

      {/* Podcasts Section */}
      {podcastPlaylists.length > 0 && (
        <section className="space-y-8 scroll-mt-28 pt-8 border-t border-border/60" id="podcasts-section">
          <div className="space-y-1 text-left border-b border-border/60 pb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Radio className="h-5 w-5 text-purple-500" />
              Podcast Sessions & Interviews
            </h2>
            <p className="text-xs text-muted-foreground">
              Conversations, upskilling seminars, and tech industry career breakdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastPlaylists.map((p) => {
              // Resolve cover image
              let imageUrl = p.resolvedThumbnail;
              if (!imageUrl && p.thumbnail && (p.thumbnail.startsWith("http") || p.thumbnail.startsWith("/") || p.thumbnail.includes("."))) {
                imageUrl = p.thumbnail;
              }
              const isComingSoon = p.youtubeUrl === "#";

              return (
                <Card key={p._id} className="flex flex-col justify-between h-full border border-border bg-card hover:bg-accent/20 hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden">
                  <div>
                    {/* Thumbnail Area */}
                    <div className={`relative h-44 w-full ${!imageUrl ? `bg-gradient-to-tr ${p.thumbnail || "from-purple-600 to-indigo-755"}` : "bg-muted"} flex items-center justify-center overflow-hidden`}>
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                      )}
                      
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                        <Badge variant={p.channel === "College Wallah" ? "cw" : p.channel === "Learnyard" ? "ly" : "ar"}>
                          {p.channel}
                        </Badge>
                        <Badge variant="advanced">
                          Podcast
                        </Badge>
                      </div>
                      
                      <div className="p-3.5 rounded-full bg-purple-600/90 border border-white/20 text-white group-hover:scale-125 transition-transform duration-300 z-10 shadow-lg shadow-purple-600/30">
                        <Mic className="h-6 w-6" />
                      </div>

                      {/* Glass bar info at bottom of thumbnail */}
                      <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-black/40 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-xs text-white z-10">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-purple-400" />
                          Featured Session
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
                        {p.tags.map((tag: string) => (
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
                          className="w-full block"
                        >
                          <Button
                            variant="gradient"
                            className="w-full text-xs gap-1.5 rounded-xl h-9 hover:opacity-95 from-purple-500 to-indigo-600 text-white"
                          >
                            Listen on YouTube
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
