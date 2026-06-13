"use client";

import * as React from "react";
import { registerForMasterclass } from "@/app/actions";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from "@/components/ui/ui-components";
import { Calendar, Clock, DollarSign, Users, Award, ShieldAlert, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface MasterclassSpotlightProps {
  masterclass: {
    _id: string;
    title: string;
    topic: string;
    description: string;
    date: Date | string;
    time: string;
    durationMins: number;
    price: number;
    capacity: number | null;
    status: "open" | "closed";
    paymentNote: string;
  } | null;
  isRegistered: boolean;
  isLoggedIn: boolean;
  registrationCount?: number;
}

export function MasterclassSpotlight({
  masterclass,
  isRegistered: initialIsRegistered,
  isLoggedIn,
  registrationCount = 0
}: MasterclassSpotlightProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isRegistered, setIsRegistered] = React.useState(initialIsRegistered);

  // Sync initialIsRegistered when server updates
  React.useEffect(() => {
    setIsRegistered(initialIsRegistered);
  }, [initialIsRegistered]);

  if (!masterclass) {
    return (
      <Card className="glass relative overflow-hidden p-8 sm:p-12 text-center border-border/60 max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 opacity-50" />
        <CardHeader className="space-y-4 relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-muted-foreground border border-border">
            <Calendar className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">No Upcoming Classes Scheduled</CardTitle>
          <CardDescription className="text-sm max-w-md text-muted-foreground">
            Adfar is currently designing the curriculum for the next Sunday Masterclass. Subscribe to channels or check back later!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formattedDate = new Date(masterclass.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const seatsLeft = masterclass.capacity 
    ? Math.max(0, masterclass.capacity - registrationCount) 
    : null;

  const isClosed = masterclass.status === "closed" || (seatsLeft !== null && seatsLeft <= 0);

  const handleRegister = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to register for the masterclass");
      router.push(`/login?next=/masterclass`);
      return;
    }

    startTransition(async () => {
      const res = await registerForMasterclass(masterclass._id);
      if (res.success) {
        setIsRegistered(true);
        toast.success("Successfully registered!");
        // Confetti burst
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 }
        });
        router.refresh();
      } else {
        toast.error(res.error || "Registration failed");
      }
    });
  };

  return (
    <Card className="relative overflow-hidden border-teal-500/25 dark:border-teal-500/20 shadow-2xl glass max-w-4xl mx-auto">
      {/* Background radial highlight */}
      <div className="absolute -top-1/4 -right-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-teal-500/10 to-blue-500/10 blur-[80px]" />
      
      {/* Dynamic top visual indicator */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500" />

      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left Side: Metadata & Main Info (3/5 width) */}
        <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="beginner" className="uppercase tracking-wider text-[10px]">
                Upcoming Masterclass
              </Badge>
              {isClosed ? (
                <Badge variant="destructive" className="uppercase tracking-wider text-[10px]">
                  Closed
                </Badge>
              ) : (
                <Badge variant="intermediate" className="uppercase tracking-wider text-[10px] animate-pulse">
                  Open
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {masterclass.title}
              </CardTitle>
              <p className="text-sm font-semibold text-primary">
                Topic: {masterclass.topic}
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground pt-1">
              {masterclass.description}
            </p>
          </div>

          <div className="pt-6 border-t border-border/40 mt-6 space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              What to expect
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                ✓ Full interactive live code build
              </span>
              <span className="flex items-center gap-1.5">
                ✓ Detailed PDF reference material
              </span>
              <span className="flex items-center gap-1.5">
                ✓ Curated Github template access
              </span>
              <span className="flex items-center gap-1.5">
                ✓ Live Q&A and coding support
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action details, pricing, booking status (2/5 width) */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-muted/20 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            {/* Date Details */}
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-background border border-border text-primary mt-0.5">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date & Day</p>
                <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">{formattedDate}</p>
              </div>
            </div>

            {/* Time Details */}
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-background border border-border text-primary mt-0.5">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time & Duration</p>
                <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">
                  {masterclass.time} · {masterclass.durationMins} Mins
                </p>
              </div>
            </div>

            {/* Price Details */}
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-background border border-border text-primary mt-0.5">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Admission Fee</p>
                <p className="text-sm font-extrabold text-foreground leading-tight mt-0.5">
                  {masterclass.price === 0 ? "FREE" : `₹${masterclass.price}`}
                </p>
              </div>
            </div>

            {/* Capacity Left */}
            {seatsLeft !== null && (
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-background border border-border text-primary mt-0.5">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available Seats</p>
                  <p className={`text-sm font-semibold leading-tight mt-0.5 ${
                    seatsLeft <= 5 ? "text-destructive font-bold" : "text-foreground"
                  }`}>
                    {seatsLeft === 0 ? "Sold Out" : `${seatsLeft} seats left / ${masterclass.capacity}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 space-y-4">
            {/* Payment Note (if any) */}
            {masterclass.paymentNote && !isRegistered && !isClosed && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Note:</span> {masterclass.paymentNote}
                </div>
              </div>
            )}

            {/* Main CTA */}
            {isRegistered ? (
              <Button
                disabled
                className="w-full h-11 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold shadow-sm"
              >
                You&apos;re registered ✓
              </Button>
            ) : isClosed ? (
              <Button
                disabled
                className="w-full h-11 bg-muted text-muted-foreground border border-border rounded-xl text-sm font-bold"
              >
                Registrations closed
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={isPending}
                className="w-full h-11 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white rounded-xl hover:opacity-95 text-sm font-bold shadow-lg shadow-blue-500/10"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Register Now"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
