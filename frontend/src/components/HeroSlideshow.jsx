import React, { useState, useEffect } from "react";

export const DEFAULT_HERO_SLIDES = [
  {
    src: "/assets/hero-man-streetwear.jpg",
    alt: "VIA Streetwear Campaign - Heavyweight Drop",
  },
  {
    src: "/assets/hero-tshirt-1.jpg",
    alt: "VIA 240+ GSM Drop-Shoulder Heavyweight Silhouette",
  },
  {
    src: "/assets/hero-tshirt-2.jpg",
    alt: "VIA Acid Wash Streetwear Capsule Edition",
  },
  {
    src: "/assets/hero-tshirt-3.jpg",
    alt: "VIA Archival Monochrome Streetwear Collection",
  },
];

export default function HeroSlideshow({
  images = DEFAULT_HERO_SLIDES,
  children,
  className = "",
  interval = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Normalize image data if passed as plain strings or objects
  const rawList = images && images.length > 0 ? images : DEFAULT_HERO_SLIDES;
  const slideList = rawList.map((item, idx) =>
    typeof item === "string"
      ? { src: item, alt: `VIA Campaign Slide ${idx + 1}` }
      : item
  );

  // Autoplay timer with hover pause and timer reset on slide change
  useEffect(() => {
    if (isPaused || slideList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, slideList.length, interval]);

  const handleSelectSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className={`relative w-full min-h-[85vh] sm:min-h-[92vh] lg:min-h-[96vh] flex items-center justify-center overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slideList.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.src || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 z-0"
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.alt || `VIA Slide ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                className="w-full h-full object-cover object-center filter brightness-95 scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
          );
        })}
      </div>

      {/* Subtle Gradient Overlay — bright and clear up top, gentle darkening near bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent z-2 pointer-events-none" />

      {/* Hero Content Overlay (if provided as children) */}
      {children}

      {/* Clickable Dot Pagination Indicators */}
      {slideList.length > 1 && (
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
          role="tablist"
          aria-label="Hero Slideshow Pagination"
        >
          {slideList.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => handleSelectSlide(index)}
                className="group p-2 sm:p-2.5 flex items-center justify-center focus:outline-hidden cursor-pointer"
              >
                <span
                  className={`block h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 sm:w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                      : "w-2 sm:w-2.5 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
