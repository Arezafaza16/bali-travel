import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
      .from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-btns', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-trust', { opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4');
  }, { scope: containerRef });

  return (
    <section id="home" ref={containerRef} className="relative min-h-[100svh] md:h-screen md:min-h-[600px] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/images/hero_bg_v2_1777956942405.png')" }}
      >
        {/* Soft Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80"></div>
      </div>

      <div className="relative z-10 text-center px-5 sm:px-6 max-w-5xl mx-auto flex flex-col items-center py-20 md:py-0">
        <span className="hero-badge text-label-caps text-on-tertiary tracking-widest uppercase mb-3 md:mb-4 opacity-90 block">
          BaliConcierge Signature Experiences
        </span>
        <h1 className="hero-title text-h1 text-on-tertiary mb-4 md:mb-6 drop-shadow-lg max-w-3xl leading-tight">
          Experience Bali Like Never Before
        </h1>
        <p className="hero-desc text-body-lg text-on-tertiary/90 mb-8 md:mb-10 max-w-2xl font-light">
          Premium adventures curated for unforgettable memories. Elevate your journey with our professional guides and exclusive itineraries.
        </p>
        
        <div className="hero-btns flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full max-w-sm sm:max-w-md mx-auto">
          <button className="w-full sm:w-auto border-2 border-on-tertiary text-on-tertiary px-8 py-4 rounded text-label-caps hover:bg-on-tertiary hover:text-primary transition-colors backdrop-blur-sm active:scale-95 duration-200">
            Explore Packages
          </button>
        </div>

        {/* Trust Badges */}
        <div className="hero-trust mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-on-tertiary/80 font-body-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>4.9/5 Average Rating</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-on-tertiary/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span>500+ Happy Customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
