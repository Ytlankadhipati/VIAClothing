import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#fafafa]">
      <div className="mb-6 flex justify-center">
        <img
          src="/assets/via-logo.png"
          alt="VIA"
          className="h-20 w-auto object-contain opacity-80"
        />
      </div>

      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">
        ERROR 404
      </span>

      <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-zinc-900 mb-4">
        OUT OF BOUNDS
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-widest max-w-md mx-auto mb-8 leading-relaxed font-medium">
        The page you are looking for has been archived, moved, or never existed in the VIA collection.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/"
          className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 font-bold uppercase tracking-widest text-xs transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
}
