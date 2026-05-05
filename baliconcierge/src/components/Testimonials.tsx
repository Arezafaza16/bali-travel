import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'Australia',
    text: '"The white water rafting trip was incredible. Professional guides and breathtaking views. Highly recommended!"'
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Singapore',
    text: '"The island tour was so comfortable. Our driver was punctual and shared so much interesting history about Bali."'
  },
  {
    id: 3,
    name: 'Emma & Tom',
    location: 'United Kingdom',
    text: '"Everything was seamless from pickup to drop-off. The ATV adventure was the highlight of our honeymoon."'
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power1.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-section-padding bg-surface" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-label-caps text-on-tertiary-container uppercase tracking-widest block mb-4">
            Testimonials
          </span>
          <h2 className="text-h2 text-primary-container">What Our Guests Say</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card bg-surface-container-low p-6 md:p-8 rounded-xl ambient-shadow">
              <div className="flex gap-1 text-[#FF7A00] mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="font-body-md text-on-surface mb-6 italic">{t.text}</p>
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-primary-container">{t.name}</p>
                  <p className="text-sm text-on-surface-variant font-medium">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
