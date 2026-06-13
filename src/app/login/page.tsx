"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input } from "@/components/ui/ui-components";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: nextParam,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            toast.success("Signed in successfully!");
            router.push(nextParam);
            router.refresh();
          },
          onError: (ctx) => {
            setIsLoading(false);
            toast.error(ctx.error.message || "Invalid credentials. Try again.");
          },
        }
      );
    } catch (err) {
      setIsLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Background Aurora Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[80px] animate-aurora-2" />
        <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[80px] animate-aurora-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass shadow-2xl border-border/50">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
              <LogIn className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-fill-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in with your email and password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/40"
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-purple-400" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/40"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:opacity-95 rounded-xl shadow-lg shadow-blue-500/10 text-white font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/register?next=${encodeURIComponent(nextParam)}`}
                  className="text-primary hover:underline font-semibold"
                >
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}
