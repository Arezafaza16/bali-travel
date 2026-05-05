import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const reasons = [
  {
    id: 1,
    icon: 'verified',
    title: 'Certified & Experienced Guides',
    desc: 'Our local experts hold international safety certifications, ensuring a secure and insightful journey.'
  },
  {
    id: 2,
    icon: 'airport_shuttle',
    title: 'Hotel Pickup Included',
    desc: 'Seamless door-to-door service in our fleet of modern, air-conditioned private vehicles.'
  },
  {
    id: 3,
    icon: 'sell',
    title: 'Best Price Guarantee',
    desc: 'Premium experiences without the hidden fees. Direct bookings ensure the best value.'
  },
  {
    id: 4,
    icon: 'public',
    title: 'Trusted Internationally',
    desc: 'Consistently 5-star rated by thousands of travelers worldwide for our exceptional service.'
  }
];

export default function WhyUs() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.why-us-card', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      x: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-section-padding bg-surface-container-low border-t border-b ghost-border" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest block mb-4">
              The BaliConcierge Difference
            </span>
            <h2 className="font-h2 text-h2 text-primary-container mb-4 md:mb-6">Why Choose Our Premium Concierge</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 md:mb-8 font-light">
              We redefine adventure by combining the raw beauty of Bali with uncompromising standards of safety, comfort, and professionalism. Your peace of mind is our priority.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
            {reasons.map((reason) => (
              <div key={reason.id} className="why-us-card bg-surface p-6 md:p-8 rounded-xl ambient-shadow ghost-border">
                <div className="shrink-0 w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {reason.icon}
                  </span>
                </div>
                <h4 className="text-h3 text-primary-container mb-2 md:mb-3">{reason.title}</h4>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
