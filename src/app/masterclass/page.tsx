import * as React from "react";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MasterclassSpotlight } from "@/components/masterclass-spotlight";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui/ui-components";
import { Calendar, Users, Sparkles, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Sunday Masterclasses",
  description: "Weekly interactive full stack masterclasses led by Adfar Rasheed.",
};

export default async function MasterclassPage() {
  let nextMasterclass = null;
  let isRegistered = false;
  let isLoggedIn = false;
  let activeRegCount = 0;
  let pastMasterclasses: any[] = [];

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
    isLoggedIn = !!session;
  } catch (err) {
    console.error("Better Auth session fetch error", err);
  }

  // Database Fetches
  try {
    const db = await getDb();
    const now = new Date();

    // 1. Next open masterclass
    const activeMc = await db.collection("masterclasses").findOne(
      { status: "open", date: { $gte: now } },
      { sort: { date: 1 } }
    );

    if (activeMc) {
      nextMasterclass = {
        ...activeMc,
        _id: activeMc._id.toString(),
        date: activeMc.date.toISOString(),
      } as any;

      activeRegCount = await db.collection("registrations").countDocuments({
        masterclassId: activeMc._id
      });

      if (session?.user?.id) {
        const reg = await db.collection("registrations").findOne({
          masterclassId: activeMc._id,
          userId: session.user.id
        });
        isRegistered = !!reg;
      }
    }

    // 2. Past masterclasses (status === "closed" OR date < now)
    const pastCursor = db.collection("masterclasses").find({
      $or: [
        { status: "closed" },
        { date: { $lt: now } }
      ]
    }, { sort: { date: -1 } });

    const rawPast = await pastCursor.toArray();

    // Attach registration counts
    pastMasterclasses = await Promise.all(
      rawPast.map(async (mc) => {
        const count = await db.collection("registrations").countDocuments({
          masterclassId: mc._id
        });
        return {
          ...mc,
          _id: mc._id.toString(),
          date: mc.date.toISOString(),
          registrationCount: count
        };
      })
    );
  } catch (dbErr) {
    console.error("MongoDB fetch error in masterclass page", dbErr);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-fill-transparent">
          Sunday Masterclasses
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Level up your practical software engineering skills. Every Sunday, we dive deep into one database layout, code framework, or architectural pattern.
        </p>
      </div>

      {/* Spotlight Card */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center lg:text-left">
          Upcoming Live Session
        </h2>
        <MasterclassSpotlight
          masterclass={nextMasterclass}
          isRegistered={isRegistered}
          isLoggedIn={isLoggedIn}
          registrationCount={activeRegCount}
        />
      </div>

      {/* Past Masterclasses List */}
      <div className="space-y-6 pt-8 border-t border-border">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Past Masterclasses
          </h2>
        </div>

        {pastMasterclasses.length === 0 ? (
          <div className="text-center p-8 rounded-xl border border-border/60 bg-card/40 text-muted-foreground text-sm">
            No past masterclasses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastMasterclasses.map((mc) => {
              const formattedDate = new Date(mc.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return (
                <Card
                  key={mc._id}
                  className="glass p-6 flex flex-col justify-between border-border/80 hover:border-purple-500/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
                        {formattedDate}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">
                        Completed
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {mc.title}
                    </CardTitle>
                    <p className="text-xs font-semibold text-primary">
                      Topic: {mc.topic}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {mc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5 text-foreground font-bold">
                      <Users className="h-4 w-4 text-primary" />
                      {mc.registrationCount} Students registered
                    </span>
                    <span>Duration: {mc.durationMins} Mins</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* FAQ Banner */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row gap-5 items-start">
        <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-foreground">Masterclass FAQs</h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            How do I join? Once registered, Adfar will email you the UPI details and meeting link (Google Meet / Zoom) 24 hours prior to the Sunday session. Make sure your account email is correct.
          </p>
        </div>
      </div>
    </div>
  );
}
