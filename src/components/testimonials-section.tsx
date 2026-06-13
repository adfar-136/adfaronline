"use client";

import * as React from "react";
import { submitTestimonial } from "@/app/actions";
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
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
import { Star, MessageSquare, Quote, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("Student");
  const [company, setCompany] = React.useState("");
  const [text, setText] = React.useState("");
  const [rating, setRating] = React.useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !company || !text) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const res = await submitTestimonial({
        name,
        role,
        company,
        text,
        rating
      });

      if (res.success) {
        toast.success("Thank you! Your testimonial has been submitted for admin approval.");
        setOpen(false);
        setName("");
        setCompany("");
        setText("");
        setRating(5);
      } else {
        toast.error(res.error || "Failed to submit testimonial");
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="space-y-12">
      {/* Testimonial Header and Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-6">
        <div className="space-y-2 max-w-lg text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-400" />
            Social Proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Testimonials</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Here is what students and coworkers say about building real-world projects and learning modern development practices with me.
          </p>
        </div>

        {/* Testimonial Write Modal Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button variant="gradient" className="rounded-xl h-11 px-6 text-white font-bold gap-2">
              <MessageSquare className="h-4 w-4 fill-white" />
              Write a Testimonial
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4 text-teal-400" />
                Add Review
              </div>
              <DialogTitle className="text-xl font-bold">Write a Testimonial</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-0.5">
                Share your learning or working experience. Submissions will be displayed once approved by Adfar.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
                <Input
                  placeholder="Aman Gupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground">Your Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Student">Student</option>
                    <option value="Coworker">Coworker</option>
                    <option value="Client">Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Company / Institution *</label>
                  <Input
                    placeholder="PW Skills / Newton School"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground">Rating *</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                  <option value={2}>2 Stars (Fair)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Review Content *</label>
                <Textarea
                  placeholder="What was your experience learning Full-Stack Development or Generative AI with Adfar?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px]"
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
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Display Grid */}
      {testimonials.length === 0 ? (
        <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
          No approved testimonials available yet. Be the first to write one!
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((test) => (
            <motion.div key={test._id} variants={itemVariants}>
              <Card className="glass relative overflow-hidden h-full flex flex-col justify-between border-border hover:border-primary/20 transition-all duration-300 group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] text-foreground pointer-events-none transition-opacity">
                  <Quote className="h-20 w-20 transform rotate-180" />
                </div>

                <CardContent className="p-6 sm:p-8 space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${idx < test.rating ? "fill-amber-500" : "text-border"}`}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground italic">
                    &ldquo;{test.text}&rdquo;
                  </p>
                </CardContent>

                {/* Student/Coworker Details Card footer */}
                <div className="px-6 py-4 sm:px-8 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs mt-auto">
                  <div>
                    <span className="font-bold text-foreground block">{test.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {test.role} &middot; {test.company}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
