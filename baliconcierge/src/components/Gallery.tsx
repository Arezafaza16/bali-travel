import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const galleryItems = [
  {
    id: 1,
    alt: 'Luxury Bali Sunset',
    src: '/images/gallery_sunset_v2_1777957029967.png',
    className: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 2,
    alt: 'Traditional Balinese Architecture Detail',
    src: '/images/gallery_architecture_v2_1777957048055.png',
    className: 'md:col-span-2 md:row-span-1 aspect-[16/9]'
  },
  {
    id: 3,
    alt: 'Tropical Jungle Waterfall',
    src: '/images/gallery_waterfall_v2_1777957065055.png',
    className: 'md:col-span-1 md:row-span-1 aspect-square'
  },
  {
    id: 4,
    alt: 'Luxury Infinity Pool Overlooking Ocean',
    src: '/images/gallery_pool_1777955904720.png',
    className: 'md:col-span-1 md:row-span-1 aspect-square'
  }
];

export default function Gallery() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.gallery-img', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      },
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-section-padding bg-surface-container-low" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-label-caps text-on-tertiary-container uppercase tracking-widest block mb-4">
            Visual Journey
          </span>
          <h2 className="text-h2 text-primary-container">Capturing Bali's Soul</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className={`${item.className} gallery-img overflow-hidden rounded-xl shadow-lg group`}>
              <img 
                alt={item.alt} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 min-h-[150px]" 
                src={item.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
