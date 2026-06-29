import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/data/site";
import { getDb } from "@/lib/mongodb";
import { WhatsappBanner } from "@/components/whatsapp-banner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Portfolio & Masterclass Platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  keywords: [
    "Adfar Rasheed",
    "Physics Wallah",
    "PW Skills",
    "Full Stack Development",
    "MERN",
    "Next.js Educator",
    "College Wallah",
    "Learnyard",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://adfar-rasheed.dev",
    title: `${siteConfig.name} - Full-Stack Developer & Senior Tech Educator`,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let showWhatsappBanner = false;
  let whatsappLink = "";
  let settingsData: any = null;

  try {
    const db = await getDb();
    const settings = await db.collection("settings").findOne({ _id: "global" as any });
    if (settings) {
      settingsData = JSON.parse(JSON.stringify(settings));
      showWhatsappBanner = !!settings.showWhatsappBanner;
      whatsappLink = settings.whatsappLink || "";
    }
  } catch (err) {
    console.warn("MongoDB settings fetch failed in layout root. Defaulting to empty banner.", err);
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${geistSans.variable} h-full scroll-smooth`}
    >
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2318671833826169"
          crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col font-sans noise-bg antialiased bg-background text-foreground">
        <Providers>
          {showWhatsappBanner && <WhatsappBanner whatsappLink={whatsappLink} />}
          <Navbar />
          {/* Sits naturally under sticky header, minimal top padding */}
          <main className="flex-1 pt-6">{children}</main>
          <Footer settings={settingsData} />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
