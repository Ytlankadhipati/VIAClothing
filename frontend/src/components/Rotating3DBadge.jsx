import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Rotating3DBadge() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -(y / 8), y: x / 8 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="perspective-1000 inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `perspective(600px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="p-4 bg-white/90 backdrop-blur-md border border-zinc-300 shadow-xl flex items-center gap-3 cursor-pointer hover:border-black transition-colors select-none group"
      >
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-xs group-hover:rotate-180 transition-transform duration-700">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900 leading-none">
            240+ GSM HEAVYWEIGHT
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mt-1 font-semibold">
            BIO-WASHED • ANTI-SHRINK
          </span>
        </div>
      </div>
    </div>
  );
}
