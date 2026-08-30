import React from "react";

export default function MarqueeBanner() {
  const marqueeItems = [
    "VIBE • IDENTITY • AUTHENTICITY",
    "LUXURY HEAVYWEIGHT STREETWEAR (240+ GSM)",
    "FREE SHIPPING ACROSS INDIA ON PREPAID ORDERS",
    "NEW DROP IS LIVE",
    "CRAFTED WITH PRECISION",
    "ORDER DIRECTLY VIA WHATSAPP CONCIERGE",
  ];

  return (
    <div className="bg-black text-white py-2.5 overflow-hidden border-b border-zinc-900 select-none shadow-xs">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-8 text-[11px] font-bold tracking-[0.25em] uppercase px-4 shrink-0">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-8 text-[11px] font-bold tracking-[0.25em] uppercase px-4 shrink-0" aria-hidden="true">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={`repeat-${idx}`}>
              <span>{item}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
