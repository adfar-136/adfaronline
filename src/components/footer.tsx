"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site";
import { Mail, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, Instagram, Youtube } from "@/components/brand-icons";
import { Button } from "@/components/ui/ui-components";

export function Footer({ settings }: { settings?: any }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: settings?.github || siteConfig.github, label: "GitHub" },
    { icon: Linkedin, href: settings?.linkedin || siteConfig.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: settings?.instagram || siteConfig.instagram, label: "Instagram" },
    { icon: Youtube, href: settings?.youtubeCollegeWallah || siteConfig.youtubeCollegeWallah, label: "College Wallah (YT)" },
    { icon: Youtube, href: settings?.youtubeLearnyard || siteConfig.youtubeLearnyard, label: "Learnyard (YT)" },
    { icon: Youtube, href: settings?.youtubePersonal || siteConfig.youtubePersonal, label: "Adfar Rasheed (YT)" },
  ];

  return (
    <footer className="relative border-t border-border bg-card mt-20 overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-fill-transparent">
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Full-stack developer and program director dedicated to education, building codebases, and shaping next-gen engineering talent.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/#about" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5">
                About <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
              <Link href="/#experience" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5">
                Experience <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
              <Link href="/#skills" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5">
                Skills <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
              <Link href="/playlists" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5">
                Playlists <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
              <Link href="/notes" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5">
                Lecture Notes <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
              <Link href="/masterclass" className="text-muted-foreground hover:text-foreground transition flex items-center gap-0.5 col-span-2">
                Sunday Masterclasses <ArrowUpRight className="h-3 w-3 opacity-50" />
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h4>
            <p className="text-sm text-muted-foreground">
              Have questions or want to host a campus workshop? Drop an email.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-accent hover:text-primary transition-all duration-300 hover:-translate-y-1"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Designed with ❤️ for college developers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
