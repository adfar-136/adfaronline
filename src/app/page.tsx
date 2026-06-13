import * as React from "react";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { siteConfig } from "@/data/site";
import { defaultProjects } from "@/data/projects";
import { HeroInteractive } from "@/components/hero-interactive";
import { AchievementBento } from "@/components/achievement-bento";
import { TimelineExperience } from "@/components/timeline-experience";
import { ProjectsGrid } from "@/components/projects-grid";
import { SkillsSection } from "@/components/skills-section";
import { PlaylistsFilter } from "@/components/playlists-filter";
import { YoutubeChannelsHighlight } from "@/components/youtube-channels-highlight";
import { MasterclassSpotlight } from "@/components/masterclass-spotlight";
import { TestimonialsSection } from "@/components/testimonials-section";
import { MentorshipBooking } from "@/components/mentorship-booking";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/ui-components";
import { Mail, ExternalLink, Sparkles, MessageSquare } from "lucide-react";
import { Github, Linkedin, Instagram } from "@/components/brand-icons";

export default async function HomePage() {
  let nextMasterclass = null;
  let isRegistered = false;
  let isLoggedIn = false;
  let regCount = 0;

  // Retrieve user session
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
    isLoggedIn = !!session;
  } catch (err) {
    console.error("Better Auth session fetch error", err);
  }

  // Fetch dynamic collections
  let settings: any = null;
  let experiences: any[] = [];
  let projects: any[] = [];
  let press = siteConfig.press;
  let stats: any[] = [];
  let testimonials: any[] = [];

  try {
    const db = await getDb();
    const now = new Date();
    
    // 1. Fetch settings
    const rawSettings = await db.collection("settings").findOne({ _id: "global" as any });
    if (rawSettings) {
      settings = {
        ...rawSettings,
        _id: rawSettings._id.toString(),
        updatedAt: rawSettings.updatedAt instanceof Date ? rawSettings.updatedAt.toISOString() : String(rawSettings.updatedAt)
      };
    }

    // 2. Fetch timeline experiences
    const rawExperiences = await db.collection("experiences").find({}, { sort: { order: 1 } }).toArray();
    if (rawExperiences.length > 0) {
      experiences = rawExperiences.map((e) => ({
        ...e,
        _id: e._id.toString()
      }));
    } else {
      experiences = siteConfig.experience;
    }

    // 3. Fetch portfolio projects
    const rawProjects = await db.collection("projects").find({}, { sort: { order: 1 } }).toArray();
    if (rawProjects.length > 0) {
      projects = rawProjects.map((p) => ({
        ...p,
        _id: p._id.toString()
      }));
    } else {
      projects = defaultProjects.map((p, idx) => ({
        ...p,
        _id: `default_${idx}`
      }));
    }

    // 4. Fetch press mentions
    const rawPress = await db.collection("press").find({}, { sort: { createdAt: -1 } }).toArray();
    if (rawPress.length > 0) {
      press = {
        outlet: rawPress[0].outlet,
        text: rawPress[0].text,
        link: rawPress[0].link
      };
    }

    // 5. Fetch upcoming masterclass
    const mc = await db.collection("masterclasses").findOne(
      { status: "open", date: { $gte: now } },
      { sort: { date: 1 } }
    );

    if (mc) {
      nextMasterclass = {
        ...mc,
        _id: mc._id.toString(),
        date: mc.date.toISOString(),
      } as any;

      regCount = await db.collection("registrations").countDocuments({ 
        masterclassId: mc._id 
      });

      if (session?.user?.id) {
        const reg = await db.collection("registrations").findOne({
          masterclassId: mc._id,
          userId: session.user.id
        });
        isRegistered = !!reg;
      }
    }

    // 6. Fetch dynamic stats (key metrics)
    const rawStats = await db.collection("stats").find({}, { sort: { order: 1 } }).toArray();
    if (rawStats.length > 0) {
      stats = rawStats.map((s) => ({
        ...s,
        _id: s._id.toString()
      }));
    } else {
      stats = siteConfig.stats;
    }

    // 7. Fetch approved testimonials
    const rawTestimonials = await db.collection("testimonials").find({ status: "approved" }, { sort: { createdAt: -1 } }).toArray();
    testimonials = rawTestimonials.map((t) => ({
      ...t,
      _id: t._id.toString()
    }));

  } catch (dbErr) {
    console.warn("MongoDB connection failed or collections unseeded. Falling back to default layout.", dbErr);
    experiences = siteConfig.experience;
    projects = defaultProjects.map((p, idx) => ({ ...p, _id: `default_${idx}` }));
    stats = siteConfig.stats;
  }

  const headline = settings?.headline || siteConfig.headline;
  const tagline = settings?.tagline || siteConfig.tagline;
  const bio = settings?.bio || siteConfig.bio;

  return (
    <div className="space-y-32 pb-32">
      {/* 1. HERO SECTION */}
      <HeroInteractive headline={headline} tagline={tagline} stats={stats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* 2. ABOUT SECTION */}
        <section id="about" className="scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Biography content (7/12 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  My Story
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  About Adfar Rasheed
                </h2>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {bio}
              </p>
              
              {/* Highlight pull quote */}
              <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
                <p className="text-sm font-semibold italic text-foreground leading-relaxed">
                  &ldquo;Education isn&apos;t about memorizing templates; it&apos;s about understanding how data flows, how stacks link, and how models serve real users.&rdquo;
                </p>
              </div>
            </div>

            {/* Avatar Visual placeholder / frame (5/12 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
              <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl p-[3.5px] bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-600 shadow-2xl shadow-blue-500/15 group overflow-hidden">
                <div className="w-full h-full rounded-[21px] overflow-hidden bg-card">
                  <img 
                    src="/adfar.jpg" 
                    alt={siteConfig.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
              </div>
              
              {/* Profile Card Info - separate, clean, no blur on face */}
              <div className="w-full max-w-[360px] p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md text-center shadow-md">
                <h3 className="text-base font-bold tracking-tight text-foreground">{siteConfig.name}</h3>
                <p className="text-xs font-semibold text-teal-500 dark:text-teal-400 mt-1">{headline}</p>
                <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Srinagar, Jammu & Kashmir, India
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ACHIEVEMENTS SECTION (Bento Grid) */}
        <section id="achievements" className="scroll-mt-28 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Milestones</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Key Achievements</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A quick review of my educational, institutional, and social work impact.
            </p>
          </div>
          <AchievementBento />
        </section>

        {/* 4. EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-28 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Career Path</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Professional Experience</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              My progression as a software engineer and full-time technical educator.
            </p>
          </div>
          <TimelineExperience experiences={experiences} />
        </section>

        {/* 5. SKILLS SECTION */}
        <section id="skills" className="scroll-mt-28 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Core Competencies</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Technologies, architectures, and programming systems I teach and deploy.
            </p>
          </div>
          <SkillsSection />
        </section>

        {/* 5.5 PORTFOLIO PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-28 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">My Work</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Featured Projects</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A collection of web apps, developer tools, and open-source packages I have built.
            </p>
          </div>
          <ProjectsGrid projects={projects} />
        </section>

        {/* 6. PRESS / FEATURED IN SECTION */}
        {press && (
          <section id="press" className="scroll-mt-28">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">In the News</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Featured In</h2>
            </div>
            <Card className="relative overflow-hidden glass p-8 sm:p-10 border-purple-500/20 max-w-3xl mx-auto shadow-xl">
              <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-purple-500/5 blur-[40px]" />
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
                <div className="space-y-4 max-w-lg text-center md:text-left">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider border border-purple-500/20">
                    {press.outlet}
                  </span>
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground italic">
                    &ldquo;{press.text}&rdquo;
                  </p>
                </div>
                <a
                  href={press.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-full md:w-auto"
                >
                  <Button variant="gradient" className="w-full gap-2 rounded-xl h-11">
                    Read Announcement
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </Card>
          </section>
        )}

        {/* 7. PLAYLISTS SECTION */}
        <section id="playlists" className="scroll-mt-28 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Featured Channels</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">YouTube Course Channels</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              I am the on-screen face of leading tech channels like College Wallah and Learnyard, alongside my personal tutorials.
            </p>
          </div>

          <YoutubeChannelsHighlight settings={settings} />
        </section>

        {/* 8. MASTERCLASS SPOTLIGHT SECTION */}
        <section id="masterclass" className="scroll-mt-28 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Workshops</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Weekly Masterclass Spotlight</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Register for this Sunday&apos;s session to construct production projects side-by-side.
            </p>
          </div>
          <Card className="glass relative overflow-hidden p-1 border-border/80 shadow-2xl">
            <MasterclassSpotlight
              masterclass={nextMasterclass}
              isRegistered={isRegistered}
              isLoggedIn={isLoggedIn}
              registrationCount={regCount}
            />
          </Card>
        </section>

        {/* 8.5 TESTIMONIALS SECTION */}
        <section id="testimonials" className="scroll-mt-28">
          <TestimonialsSection testimonials={testimonials} />
        </section>

        {/* 9. CONTACT / SOCIALS SECTION */}
        <section id="contact" className="scroll-mt-28 max-w-4xl mx-auto">
          <Card className="glass relative overflow-hidden p-8 sm:p-12 border-border/80 shadow-2xl">
            {/* Background blur decorative blobs */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[80px]" />
            <div className="absolute -top-1/4 -right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Message block */}
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-md">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Let&apos;s Build Together</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interested in bringing a MERN stack, Next.js, or Generative AI workshop to your college or campus group? Or need curriculum advice? Get in touch.
                </p>
              </div>

              {/* Direct Email Action & Mentorship booking & Social Buttons */}
              <div className="flex flex-col gap-6 items-center md:items-start w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-stretch">
                  <a
                    href={`mailto:${settings?.email || siteConfig.email}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 rounded-xl h-12 text-foreground font-semibold glass border-border hover:border-primary/50"
                    >
                      <Mail className="h-4.5 w-4.5 text-teal-400" />
                      Shoot an Email
                    </Button>
                  </a>

                  <div className="flex-1">
                    <MentorshipBooking isLoggedIn={isLoggedIn} externalLink={settings?.mentorshipLink} />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full justify-center md:justify-start">
                  <a
                    href={settings?.github || siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 max-w-[80px] p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-center flex justify-center text-muted-foreground hover:text-foreground transition"
                    title="GitHub"
                  >
                    <Github className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href={settings?.linkedin || siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 max-w-[80px] p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-center flex justify-center text-muted-foreground hover:text-foreground transition"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href={settings?.instagram || siteConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 max-w-[80px] p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-center flex justify-center text-muted-foreground hover:text-foreground transition"
                    title="Instagram"
                  >
                    <Instagram className="h-4.5 w-4.5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
