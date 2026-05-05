import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Contact() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out'
    });
    
    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-section-padding bg-primary-container text-on-primary" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="contact-info">
            <span className="text-label-caps text-primary-fixed uppercase tracking-widest block mb-4">
              Get In Touch
            </span>
            <h2 className="text-h2 mb-4 md:mb-6 text-on-primary">Ready for your next Balinese adventure?</h2>
            <p className="text-body-lg mb-8 md:mb-10 text-on-primary/80 max-w-lg">
              Whether you have a specific itinerary in mind or need expert local recommendations, our private concierge team is here to craft your perfect escape.
            </p>
            
            <div className="space-y-6 md:space-y-8">
              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/6200000000" 
                className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all border border-white/10 group shadow-lg"
              >
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-h3 text-base md:text-lg font-bold text-on-primary group-hover:text-primary-fixed transition-colors">Premium Concierge Chat</p>
                  <p className="text-xs md:text-sm text-on-primary/70">Personalized support via WhatsApp • 24/7</p>
                </div>
                <span className="material-symbols-outlined ml-auto text-primary-fixed group-hover:translate-x-2 transition-transform shrink-0">arrow_forward</span>
              </a>

              <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                <div className="flex items-center gap-4 text-on-primary/90">
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-fixed">mail</span>
                  </div>
                  <span className="font-body-md text-sm md:text-base break-all">reservations@baliconcierge.com</span>
                </div>
                <div className="flex items-center gap-4 text-on-primary/90">
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-fixed">location_on</span>
                  </div>
                  <span className="font-body-md text-sm md:text-base">Jalan Kayu Aya, Seminyak, Bali 80361</span>
                </div>
                
                {/* Map Mockup */}
                <div className="relative rounded-xl overflow-hidden h-36 md:h-40 border border-white/10 shadow-lg">
                  <img 
                    alt="Bali Office Location" 
                    className="w-full h-full object-cover grayscale opacity-50 contrast-125" 
                    src="/images/gallery_architecture_v2_1777957048055.png"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="shrink-0 aspect-square w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                      <span className="material-symbols-outlined text-white text-sm">location_on</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white uppercase tracking-widest font-bold">
                    Seminyak HQ
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-surface-container-low rounded-full blur-3xl opacity-50"></div>
            <form className="relative z-10 space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-primary-container font-bold mb-2 text-xs md:text-sm uppercase tracking-wider">First Name</label>
                  <input className="w-full p-3 md:p-4 bg-surface-container-low border-stone-200 border rounded-lg text-primary-container focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm md:text-base" placeholder="James" type="text"/>
                </div>
                <div>
                  <label className="block text-primary-container font-bold mb-2 text-xs md:text-sm uppercase tracking-wider">Email Address</label>
                  <input className="w-full p-3 md:p-4 bg-surface-container-low border-stone-200 border rounded-lg text-primary-container focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm md:text-base" placeholder="james@example.com" type="email"/>
                </div>
              </div>
              <div>
                <label className="block text-primary-container font-bold mb-2 text-xs md:text-sm uppercase tracking-wider">Interested Experience</label>
                <select className="w-full p-3 md:p-4 bg-surface-container-low border-stone-200 border rounded-lg text-primary-container focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm md:text-base">
                  <option>Select an experience</option>
                  <option>Luxury Watersports</option>
                  <option>Cultural Island Tour</option>
                  <option>Private Villa Concierge</option>
                  <option>Adventure Expedition</option>
                </select>
              </div>
              <div>
                <label className="block text-primary-container font-bold mb-2 text-xs md:text-sm uppercase tracking-wider">Your Inquiry</label>
                <textarea className="w-full p-3 md:p-4 bg-surface-container-low border-stone-200 border rounded-lg text-primary-container focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none min-h-[100px] md:min-h-[120px] text-sm md:text-base" placeholder="Tell us about your dream trip..." rows={4}></textarea>
              </div>
              <button className="w-full bg-[#FF7A00] text-white py-4 md:py-5 rounded-lg font-label-caps text-label-caps hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
                Submit Inquiry <span className="material-symbols-outlined text-sm">send</span>
              </button>
              <p className="text-center text-xs text-on-surface-variant/60">We typically respond within 15 minutes during business hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
