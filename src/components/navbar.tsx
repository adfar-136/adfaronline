"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { siteConfig } from "@/data/site";
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/ui-components";
import { Sun, Moon, Menu, LogOut, User, LayoutDashboard, ShieldCheck, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = session?.user?.email === siteConfig.email;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        }
      }
    });
  };

  const navItems = [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Playlists", href: "/playlists" },
    { label: "Lecture Notes", href: "/notes" },
    { label: "Masterclass", href: "/masterclass" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-background/85 backdrop-blur-md border-b border-border py-3" 
          : "bg-background/50 backdrop-blur-sm border-b border-border/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-fill-transparent group-hover:opacity-90 transition">
            {siteConfig.name}
          </span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            FSD Educator
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition py-1"
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-accent"
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Auth Button/Dropdown */}
          {!isPending && (
            <>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-full border-primary/20 bg-background/50 hover:bg-accent"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span className="max-w-[100px] truncate text-xs">
                        {session.user.name.split(" ")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="right" className="w-52">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                      Logged in as <span className="font-semibold text-foreground">{session.user.email}</span>
                    </div>
                    <Link href="/dashboard" className="w-full">
                      <DropdownMenuItem className="gap-2 text-xs">
                        <LayoutDashboard className="h-3.5 w-3.5 text-teal-500" />
                        My Dashboard
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="w-full">
                        <DropdownMenuItem className="gap-2 text-xs text-primary font-medium">
                          <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                          Admin Console
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-between">
                <div>
                  <SheetHeader>
                    <SheetTitle className="text-gradient">Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {session && (
                      <>
                        <Link
                          href="/dashboard"
                          className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="text-base font-semibold text-blue-500 hover:text-blue-600 py-2 border-b border-border/50 flex items-center gap-2"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Admin Console
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  {session ? (
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button variant="gradient" className="w-full">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
