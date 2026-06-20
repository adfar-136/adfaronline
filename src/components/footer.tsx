"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site";
import { ArrowUpRight } from "lucide-react";
import { Github, Linkedin, Instagram, Youtube } from "@/components/brand-icons";

export function Footer({ settings }: { settings?: any }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: settings?.github || siteConfig.github, label: "GitHub", hoverColor: "hover:text-[#24292e] dark:hover:text-[#ffffff]" },
    { icon: Linkedin, href: settings?.linkedin || siteConfig.linkedin, label: "LinkedIn", hoverColor: "hover:text-[#0077b5]" },
    { icon: Instagram, href: settings?.instagram || siteConfig.instagram, label: "Instagram", hoverColor: "hover:text-[#e1306c]" },
    { icon: Youtube, href: settings?.youtubeCollegeWallah || siteConfig.youtubeCollegeWallah, label: "College Wallah (YT)", hoverColor: "hover:text-[#ff0000]" },
    { icon: Youtube, href: settings?.youtubeLearnyard || siteConfig.youtubeLearnyard, label: "Learnyard (YT)", hoverColor: "hover:text-[#ff0000]" },
    { icon: Youtube, href: settings?.youtubePersonal || siteConfig.youtubePersonal, label: "Adfar Rasheed (YT)", hoverColor: "hover:text-[#ff0000]" },
  ];

  const navItems = [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Playlists", href: "/playlists" },
    { label: "Lecture Notes", href: "/notes" },
    { label: "Sunday Masterclass", href: "/masterclass" },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-card/25 backdrop-blur-md mt-28 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-24 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* Top subtle line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          {/* Top Row: Identity & Socials */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Brand identity */}
            <div className="flex flex-col gap-2 max-w-sm">
              <Link href="/" className="group inline-flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-fill-transparent group-hover:opacity-90 transition">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full-stack developer and program director dedicated to education, building codebases, and shaping next-gen engineering talent.
              </p>
            </div>

            {/* Social connections */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Connect</span>
              <div className="flex flex-wrap items-center gap-4">
                {socialLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-muted-foreground ${link.hoverColor} transition-all duration-300 hover:-translate-y-0.5 hover:scale-110`}
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subtle separator */}
          <div className="h-px bg-border/40" />

          {/* Bottom Row: Navigation, copyright & Back to top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
            {/* Copyright info */}
            <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
              <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
              <p className="text-[10px] text-muted-foreground/60">Designed & built for the developer community</p>
            </div>

            {/* Horizontal Navigation Link List */}
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
