import * as React from "react";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { siteConfig } from "@/data/site";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { ShieldAlert, Sparkles } from "lucide-react";

export const metadata = {
  title: "Admin Console",
  description: "Announce and manage masterclasses, view registrant lists, and export student metrics.",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Protect the admin page at the server component level
  // If not logged in, redirect to login
  if (!session) {
    redirect("/login?next=/admin");
  }

  // If email does not match ADMIN_EMAIL, redirect to homepage
  if (session.user.email !== siteConfig.email) {
    redirect("/");
  }

  let masterclasses: any[] = [];
  let registrations: any[] = [];
  let experiences: any[] = [];
  let projects: any[] = [];
  let press: any[] = [];
  let settings: any = null;
  let mentorshipBookings: any[] = [];
  let stats: any[] = [];
  let testimonials: any[] = [];
  let notes: any[] = [];
  let playlists: any[] = [];

  try {
    const db = await getDb();
    
    // Fetch all masterclasses (newest first)
    const rawMasterclasses = await db.collection("masterclasses").find(
      {}, 
      { sort: { date: -1 } }
    ).toArray();

    // Map Mongo object structures to serializable fields
    masterclasses = rawMasterclasses.map((mc) => ({
      ...mc,
      _id: mc._id.toString(),
      date: mc.date instanceof Date ? mc.date.toISOString() : String(mc.date),
      createdAt: mc.createdAt instanceof Date ? mc.createdAt.toISOString() : String(mc.createdAt)
    }));

    // Fetch all registrations
    const rawRegistrations = await db.collection("registrations").find(
      {},
      { sort: { createdAt: -1 } }
    ).toArray();

    registrations = rawRegistrations.map((reg) => ({
      ...reg,
      _id: reg._id.toString(),
      masterclassId: reg.masterclassId.toString(),
      createdAt: reg.createdAt instanceof Date ? reg.createdAt.toISOString() : String(reg.createdAt)
    }));

    // Fetch experiences (sorted by order)
    const rawExperiences = await db.collection("experiences").find(
      {},
      { sort: { order: 1 } }
    ).toArray();
    experiences = rawExperiences.map((exp) => ({
      ...exp,
      _id: exp._id.toString(),
      createdAt: exp.createdAt instanceof Date ? exp.createdAt.toISOString() : String(exp.createdAt)
    }));

    // Fetch projects (sorted by order)
    const rawProjects = await db.collection("projects").find(
      {},
      { sort: { order: 1 } }
    ).toArray();
    projects = rawProjects.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt)
    }));

    // Fetch press mentions
    const rawPress = await db.collection("press").find(
      {},
      { sort: { createdAt: -1 } }
    ).toArray();
    press = rawPress.map((pr) => ({
      ...pr,
      _id: pr._id.toString(),
      createdAt: pr.createdAt instanceof Date ? pr.createdAt.toISOString() : String(pr.createdAt)
    }));

    // Fetch settings
    const rawSettings = await db.collection("settings").findOne({ _id: "global" as any });
    if (rawSettings) {
      settings = {
        ...rawSettings,
        _id: rawSettings._id.toString(),
        updatedAt: rawSettings.updatedAt instanceof Date ? rawSettings.updatedAt.toISOString() : String(rawSettings.updatedAt)
      };
    } else {
      settings = {
        _id: "global",
        headline: siteConfig.headline,
        tagline: siteConfig.tagline,
        bio: siteConfig.bio,
        email: siteConfig.email,
        github: siteConfig.github,
        linkedin: siteConfig.linkedin,
        instagram: siteConfig.instagram,
        youtubeCollegeWallah: siteConfig.youtubeCollegeWallah,
        youtubeLearnyard: siteConfig.youtubeLearnyard,
        youtubePersonal: siteConfig.youtubePersonal,
        whatsappLink: "https://chat.whatsapp.com/invite/example",
        showWhatsappBanner: true,
        mentorshipLink: "",
      };
    }

    // Fetch mentorship bookings
    const rawBookings = await db.collection("mentorship_bookings").find(
      {},
      { sort: { createdAt: -1 } }
    ).toArray();
    mentorshipBookings = rawBookings.map((b) => ({
      ...b,
      _id: b._id.toString(),
      preferredDate: b.preferredDate instanceof Date ? b.preferredDate.toISOString() : String(b.preferredDate),
      createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt)
    }));

    // Fetch stats
    const rawStats = await db.collection("stats").find(
      {},
      { sort: { order: 1 } }
    ).toArray();
    stats = rawStats.map((s) => ({
      ...s,
      _id: s._id.toString()
    }));

    // Fetch testimonials
    const rawTestimonials = await db.collection("testimonials").find(
      {},
      { sort: { createdAt: -1 } }
    ).toArray();
    testimonials = rawTestimonials.map((t) => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt)
    }));

    // Fetch notes
    const rawNotes = await db.collection("notes").find(
      {},
      { sort: { subject: 1, order: 1 } }
    ).toArray();
    notes = rawNotes.map((n) => ({
      ...n,
      _id: n._id.toString(),
      createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : String(n.createdAt)
    }));

    // Fetch playlists
    const rawPlaylists = await db.collection("playlists").find({}).toArray();
    playlists = rawPlaylists.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt)
    }));

  } catch (err) {
    console.error("MongoDB fetch error in Admin Page", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header bar */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/60 glass flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-400" />
            System Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Adfar Rasheed Portfolio & Masterclass Administration Area
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25">
          <ShieldAlert className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-semibold">Admin Access Granted</span>
        </div>
      </div>

      {/* Render the interactive client panel */}
      <AdminDashboardClient
        initialMasterclasses={masterclasses}
        initialRegistrations={registrations}
        adminEmail={siteConfig.email}
        initialExperiences={experiences}
        initialProjects={projects}
        initialPress={press}
        initialSettings={settings}
        initialBookings={mentorshipBookings}
        initialStats={stats}
        initialTestimonials={testimonials}
        initialNotes={notes}
        initialPlaylists={playlists}
      />
    </div>
  );
}
