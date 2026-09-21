import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { getGeneralWhatsAppUrl } from "../utils/whatsapp";

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
      {/* Tooltip badge */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 border border-zinc-200 px-3.5 py-2 shadow-lg backdrop-blur-md animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <p className="text-[11px] font-bold text-zinc-900 tracking-wider uppercase">
            Chat with VIA Concierge
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-black ml-1 p-0.5"
            aria-label="Dismiss chat tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={getGeneralWhatsAppUrl("Hi VIA, I have a question about your products.")}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group p-3.5 sm:p-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center whatsapp-pulse"
        aria-label="Order and chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-black stroke-black" />
        <span className="sr-only">Contact VIA on WhatsApp</span>
      </a>
    </div>
  );
}
