import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../constants/services';

gsap.registerPlugin(ScrollTrigger);

// Convert record to array for mapping
const services = Object.values(SERVICES_DATA);

export default function Services() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-section-padding bg-surface" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest block mb-4">
            Curated Experiences
          </span>
          <h2 className="font-h2 text-h2 text-primary-container">Our Signature Services</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {services.map((service) => (
            <div key={service.id} className="service-card group cursor-pointer bg-white rounded-xl overflow-hidden ambient-shadow border border-stone-100 flex flex-col">
              <div className="relative h-64 overflow-hidden shrink-0">
                <img 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={service.heroImage}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-primary-container font-bold text-[12px]">
                  From Rp {service.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-h3 text-primary-container mb-2 font-bold leading-tight">{service.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed flex-1">{service.description}</p>
                <Link className="inline-flex items-center text-on-tertiary-container text-label-caps group-hover:text-primary transition-colors mt-auto pt-4 border-t border-stone-50" to={`/service/${service.slug}`}>
                  View Details <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
