"use client";

import * as React from "react";
import { MessageSquare, X } from "lucide-react";

export function WhatsappBanner({ whatsappLink }: { whatsappLink: string }) {
  const [closed, setClosed] = React.useState(false);

  if (closed || !whatsappLink) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold z-50 shadow-md">
      <MessageSquare className="h-4 w-4 fill-white shrink-0 animate-bounce" />
      <span>Join Adfar&apos;s active student WhatsApp community for daily discussion &amp; resources!</span>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-90 ml-1 inline-flex items-center gap-0.5 font-bold"
      >
        Join Community ➔
      </a>
      <button
        onClick={() => setClosed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 p-1 rounded-lg"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
