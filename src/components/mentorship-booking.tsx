"use client";

import * as React from "react";
import { bookMentorship } from "@/app/actions";
import { 
  Button, 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  Input,
  Textarea
} from "@/components/ui/ui-components";
import { Calendar, Compass, UserCheck, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MentorshipBookingProps {
  isLoggedIn: boolean;
  externalLink?: string; // If admin configures an external booking site (like Calendly)
}

export function MentorshipBooking({ isLoggedIn, externalLink }: MentorshipBookingProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const [topic, setTopic] = React.useState("Career Mentorship");
  const [description, setDescription] = React.useState("");
  const [preferredDate, setPreferredDate] = React.useState("");

  const topics = [
    "Career Mentorship",
    "MERN Stack Doubt Clearing",
    "Next.js/React Architecture",
    "Resume Review & Mock Interview",
    "GenAI & Vibe Coding Support"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please sign in to request a mentorship session");
      router.push("/login?next=/");
      return;
    }

    if (!topic || !description || !preferredDate) {
      toast.error("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      const res = await bookMentorship({
        topic,
        description,
        preferredDate
      });

      if (res.success) {
        toast.success("Mentorship booking request submitted successfully!");
        setOpen(false);
        setDescription("");
        setPreferredDate("");
        router.refresh();
      } else {
        toast.error(res.error || "Submission failed");
      }
    });
  };

  // If admin has configured an external Calendly/Cal.com link, open it directly!
  if (externalLink) {
    return (
      <a href={externalLink} target="_blank" rel="noopener noreferrer" className="w-full">
        <Button variant="gradient" size="lg" className="w-full gap-2 rounded-xl h-12 text-white font-bold">
          <Calendar className="h-4.5 w-4.5" />
          Schedule 1:1 Mentorship Session
        </Button>
      </a>
    );
  }

  const handleOpenCheck = (newOpen: boolean) => {
    if (newOpen && !isLoggedIn) {
      toast.info("Please log in to apply for a 1:1 mentorship session");
      router.push("/login?next=/");
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenCheck}>
      <DialogTrigger>
        <Button variant="gradient" size="lg" className="w-full gap-2 rounded-xl h-12 text-white font-bold">
          <Calendar className="h-4.5 w-4.5" />
          Book 1:1 Mentorship Session
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4 text-teal-400" />
            1:1 Mentorship
          </div>
          <DialogTitle className="text-xl font-bold">Request a 1:1 Session</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-0.5">
            Submit a booking request. Adfar reviews requests weekly and will reach out via email to schedule your session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-sm">
          {/* Topic Select */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-teal-500" />
              Mentorship Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {topics.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Preferred Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              Preferred Date
            </label>
            <Input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
              What would you like to discuss?
            </label>
            <Textarea
              placeholder="Describe your background and the specific doubts or review requests you have..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[90px]"
              required
            />
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 text-xs bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-95 text-white"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Booking...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
