import * as React from "react";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from "@/components/ui/ui-components";
import { Calendar, Clock, DollarSign, ArrowRight, UserCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Student Dashboard",
  description: "View your registered Sunday masterclasses and mentorship bookings.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login?next=/dashboard");
  }

  let registrations: any[] = [];
  let mentorshipBookings: any[] = [];

  try {
    const db = await getDb();

    // Aggregation pipeline to join registrations with masterclasses
    registrations = await db.collection("registrations").aggregate([
      { $match: { userId: session.user.id } },
      {
        $lookup: {
          from: "masterclasses",
          localField: "masterclassId",
          foreignField: "_id",
          as: "mc"
        }
      },
      { $unwind: "$mc" },
      { $sort: { "mc.date": 1 } }
    ]).toArray();

    // Fetch student mentorship bookings
    const rawBookings = await db.collection("mentorship_bookings").find(
      { userId: session.user.id },
      { sort: { createdAt: -1 } }
    ).toArray();

    mentorshipBookings = rawBookings.map((b) => ({
      ...b,
      _id: b._id.toString(),
      preferredDate: b.preferredDate instanceof Date ? b.preferredDate.toISOString() : String(b.preferredDate),
      createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt)
    }));

  } catch (err) {
    console.error("Failed to query student metrics in dashboard", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Dashboard Welcome Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/60 glass flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-400" />
            Welcome Back
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {session.user.name}&apos;s Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Account: {session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25">
          <UserCheck className="h-5 w-5" />
          <span className="text-sm font-semibold">Registered Student</span>
        </div>
      </div>

      {/* Registered Classes Grid */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Your Registered Masterclasses ({registrations.length})
        </h2>

        {registrations.length === 0 ? (
          <Card className="glass p-12 text-center border-dashed border-border/80 flex flex-col items-center justify-center max-w-xl mx-auto">
            <CardHeader className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                <Calendar className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold">No Registrations Found</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                You haven&apos;t registered for any Sunday masterclasses yet. Grab your seat for the next upcoming topic!
              </CardDescription>
            </CardHeader>
            <div className="pt-4">
              <Link href="/masterclass">
                <Button variant="gradient" className="gap-2 rounded-xl text-xs font-semibold">
                  Browse Masterclasses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => {
              const mc = reg.mc;
              const formattedDate = new Date(mc.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              });

              const isPast = new Date(mc.date) < new Date();

              return (
                <Card
                  key={reg._id.toString()}
                  className={`glass flex flex-col justify-between border-border hover:shadow-lg transition-all duration-300 relative overflow-hidden ${
                    isPast ? "opacity-75 bg-muted/10" : "border-teal-500/15"
                  }`}
                >
                  {!isPast && (
                    <div className="absolute top-0 right-0 h-[3px] w-24 bg-gradient-to-r from-teal-400 to-blue-500" />
                  )}

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {isPast ? "Completed" : "Upcoming Session"}
                      </span>
                      <Badge variant={isPast ? "outline" : "intermediate"} className="text-[10px] font-bold">
                        {isPast ? "Past" : "Active"}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <CardTitle className="text-base sm:text-lg font-bold">
                        {mc.title}
                      </CardTitle>
                      <p className="text-xs font-semibold text-teal-500">
                        Topic: {mc.topic}
                      </p>
                    </div>

                    {/* Class details */}
                    <div className="space-y-2 text-xs text-muted-foreground pt-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {formattedDate}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {mc.time} · {mc.durationMins} Mins
                      </p>
                      <p className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                        {mc.price === 0 ? "FREE" : `₹${mc.price}`}
                      </p>
                    </div>

                    {/* Payment Instruction box (if active and price > 0) */}
                    {!isPast && mc.price > 0 && mc.paymentNote && (
                      <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-1 leading-relaxed">
                        <span className="font-bold text-foreground">Payment Details:</span>
                        <p className="text-muted-foreground">{mc.paymentNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-0 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <span>Registered on {new Date(reg.createdAt).toLocaleDateString("en-IN")}</span>
                    {!isPast && (
                      <span className="text-teal-500 font-semibold flex items-center gap-1">
                        ● Link will be emailed
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 1:1 Mentorship Bookings Grid */}
      <div className="space-y-6 pt-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Your 1:1 Mentorship Sessions ({mentorshipBookings.length})
        </h2>

        {mentorshipBookings.length === 0 ? (
          <Card className="glass p-12 text-center border-dashed border-border/80 flex flex-col items-center justify-center max-w-xl mx-auto">
            <CardHeader className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold">No Mentorship Bookings</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                Apply for a personal 1:1 mentorship booking. Adfar will review your request and get in touch with slot times.
              </CardDescription>
            </CardHeader>
            <div className="pt-4">
              <Link href="/#contact">
                <Button variant="gradient" className="gap-2 rounded-xl text-xs font-semibold">
                  Request 1:1 Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorshipBookings.map((booking) => {
              const prefDate = new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              });
              return (
                <Card
                  key={booking._id}
                  className="glass flex flex-col justify-between border-border hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        1:1 Mentorship
                      </span>
                      <Badge
                        variant={
                          booking.status === "completed" 
                            ? "beginner" 
                            : booking.status === "approved" 
                            ? "intermediate" 
                            : "outline"
                        }
                        className="text-[10px] font-bold"
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <CardTitle className="text-base font-bold">
                        {booking.topic}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {booking.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground pt-3 border-t border-border/40">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Preferred Date: {prefDate}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Status:{" "}
                        {booking.status === "pending" && (
                          <span className="text-amber-500 font-semibold">Pending Admin Review</span>
                        )}
                        {booking.status === "approved" && (
                          <span className="text-emerald-500 font-semibold">Approved - check email for invite link</span>
                        )}
                        {booking.status === "completed" && (
                          <span className="text-purple-500 font-semibold">Completed Session</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border/40 bg-muted/20 text-[10px] text-muted-foreground mt-auto">
                    Applied on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
