import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SERVICES_DATA } from '../constants/services';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  checkAvailability,
  createBooking,
  createPaymentTransaction,
  pollPaymentStatus,
} from '../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────
type AvailabilityState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'available'; slotsLeft: number; message: string }
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string };

type BookingStep = 'form' | 'customer-info' | 'processing' | 'otp';

// ─── OTP Modal ────────────────────────────────────────────────────────────────
function OtpModal({ otp, onClose }: { otp: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-green-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h2 className="text-h2 text-primary mb-2 text-2xl font-bold">Booking Confirmed!</h2>
        <p className="text-body-md text-on-surface-variant mb-6 text-sm">
          Your payment was successful. Please screenshot this OTP — it will be sent to the admin and used to verify your booking on the day.
        </p>
        <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-6 mb-6">
          <p className="text-label-caps text-secondary text-xs mb-2 uppercase tracking-widest">Your Booking OTP</p>
          <p className="text-6xl font-bold tracking-[0.3em] text-primary">{otp}</p>
        </div>
        <div className="flex items-center gap-2 justify-center text-amber-600 bg-amber-50 rounded-lg p-3 mb-6">
          <span className="material-symbols-outlined text-sm">photo_camera</span>
          <p className="text-xs font-medium">Please screenshot this OTP now</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          I've saved my OTP
        </button>
      </div>
    </div>
  );
}

// ─── Customer Info Modal ──────────────────────────────────────────────────────
function CustomerInfoModal({
  onSubmit,
  onClose,
  loading,
}: {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 text-primary text-xl font-bold">Your Details</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div>
            <label className="text-label-caps text-primary block mb-2 text-xs uppercase tracking-widest">Full Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-transparent border-0 border-b border-primary-fixed focus:border-primary focus:ring-0 text-body-md text-on-surface px-0 py-2 transition-colors outline-none"
            />
          </div>
          <div>
            <label className="text-label-caps text-primary block mb-2 text-xs uppercase tracking-widest">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-transparent border-0 border-b border-primary-fixed focus:border-primary focus:ring-0 text-body-md text-on-surface px-0 py-2 transition-colors outline-none"
            />
          </div>
          <div>
            <label className="text-label-caps text-primary block mb-2 text-xs uppercase tracking-widest">Phone Number (WhatsApp)</label>
            <input
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+62 812 3456 7890"
              className="w-full bg-transparent border-0 border-b border-primary-fixed focus:border-primary focus:ring-0 text-body-md text-on-surface px-0 py-2 transition-colors outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A00] text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><span className="animate-spin material-symbols-outlined text-sm">progress_activity</span> Processing…</>
            ) : (
              <><span className="material-symbols-outlined text-sm">payment</span> Proceed to Payment</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Utility: load Midtrans Snap script ───────────────────────────────────────
function loadScript(src: string, clientKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans Snap'));
    document.head.appendChild(script);
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef(null);
  const service = slug ? SERVICES_DATA[slug] : null;

  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);
  const today = new Date().toISOString().split('T')[0];

  // Refs so async callbacks always read the latest value — avoids stale closure bug
  const dateRef = useRef('');
  const guestsRef = useRef(2);
  useEffect(() => { dateRef.current = date; }, [date]);
  useEffect(() => { guestsRef.current = guests; }, [guests]);

  const [availability, setAvailability] = useState<AvailabilityState>({ status: 'idle' });
  const [step, setStep] = useState<BookingStep>('form');
  const [otp, setOtp] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useGSAP(() => {
    if (!service) return;
    const tl = gsap.timeline();
    tl.from('.hero-content > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
    const sections = gsap.utils.toArray('.detail-section');
    sections.forEach((section: any) => {
      gsap.from(section, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: section, start: 'top 85%' }, ease: 'power2.out' });
    });
  }, { scope: containerRef, dependencies: [service] });

  const handleCheckAvailability = useCallback(async () => {
    if (!slug || !date) return;
    setAvailability({ status: 'loading' });
    try {
      const result = await checkAvailability(slug, date, guests);
      setAvailability(
        result.available
          ? { status: 'available', slotsLeft: result.slotsLeft, message: result.message }
          : { status: 'unavailable', message: result.message },
      );
    } catch {
      setAvailability({ status: 'error', message: 'Could not check availability. Please try again.' });
    }
  }, [slug, date, guests]);

  const handleBookNow = () => {
    if (availability.status !== 'available') return;
    setStep('customer-info');
  };

  const handlePaymentSuccess = useCallback(async (oid: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const result = await pollPaymentStatus(oid);
        if (result.status === 'paid' && result.otp) {
          clearInterval(interval);
          setOtp(result.otp);
          setStep('otp');
        }
      } catch { /* keep trying */ }
      if (attempts > 20) { clearInterval(interval); setStep('form'); }
    }, 1500);
  }, []);

  const handleCustomerSubmit = useCallback(async (customer: { name: string; email: string; phone: string }) => {
    if (!slug || !service) return;
    setPaymentLoading(true);
    try {
      const pricePerPerson = parseInt(service.price.replace(/\./g, ''), 10);
      const currentDate = dateRef.current;
      const currentGuests = guestsRef.current;
      const booking = await createBooking({
        serviceSlug: slug,
        serviceName: service.heroTitle,
        date: currentDate,
        guests: currentGuests,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        pricePerPerson,
      });

      const payment = await createPaymentTransaction(booking.orderId);
      setStep('processing');

      const isProduction = (import.meta as any).env?.VITE_MIDTRANS_IS_PRODUCTION === 'true';
      const snapUrl = isProduction
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';

      await loadScript(snapUrl, payment.clientKey);

      (window as any).snap.pay(payment.token, {
        onSuccess: async () => { await handlePaymentSuccess(booking.orderId); },
        onPending: () => { setStep('form'); alert('Payment pending. Please complete it.'); },
        onError: () => { setStep('form'); alert('Payment failed. Please try again.'); },
        onClose: () => { setStep('form'); },
      });
    } catch (err: any) {
      alert(err.message || 'Failed to initiate payment.');
      setStep('form');
    } finally {
      setPaymentLoading(false);
    }
  }, [slug, service, handlePaymentSuccess]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-section-padding">
          <div className="text-center">
            <h1 className="text-h2 text-primary mb-4">Service Not Found</h1>
            <p className="text-body-md text-secondary mb-8">The service you're looking for doesn't exist.</p>
            <Link to="/" className="bg-primary text-on-primary px-8 py-3 rounded font-label-caps text-label-caps">Back to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAvailable = availability.status === 'available';
  const isChecked = availability.status === 'available' || availability.status === 'unavailable';

  return (
    <div ref={containerRef} className="min-h-screen selection:bg-tertiary-fixed-dim selection:text-tertiary">
      <Navbar />

      {step === 'customer-info' && (
        <CustomerInfoModal onSubmit={handleCustomerSubmit} onClose={() => setStep('form')} loading={paymentLoading} />
      )}
      {step === 'otp' && otp && (
        <OtpModal otp={otp} onClose={() => { setStep('form'); setAvailability({ status: 'idle' }); }} />
      )}

      <main className="pt-24 pb-section-padding">
        <section className="relative w-full h-[60vh] min-h-[400px] md:h-[716px] md:min-h-[600px] mb-8 md:mb-16">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${service.heroImage}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl hero-content space-y-6">
                <span className="text-label-caps text-on-tertiary-container bg-tertiary-fixed-dim/20 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-wider mb-2 md:mb-4 inline-block">{service.category}</span>
                <h1 className="text-h1 text-on-primary mb-4 md:mb-6 drop-shadow-lg leading-tight">{service.heroTitle}</h1>
                <p className="text-body-lg text-surface-container-high opacity-95 max-w-2xl leading-relaxed">{service.description}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter relative">
          <div className="lg:col-span-8 space-y-12 md:space-y-stack-md">
            <section className="detail-section bg-surface-container-lowest p-6 md:p-12 ghost-layer ambient-shadow rounded-xl">
              <h2 className="text-h2 text-primary mb-6">The Experience</h2>
              {service.longDescription.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-body-md text-on-surface-variant mb-6 last:mb-0">{para}</p>
              ))}
            </section>

            <section className="detail-section grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-6 md:p-8 rounded-xl ghost-layer">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="text-h3 text-primary">What's Included</h3>
                </div>
                <ul className="space-y-4">
                  {service.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-sm mt-1">
                        {['directions_car','verified_user','restaurant','dry_cleaning','health_and_safety'][idx] || 'check'}
                      </span>
                      <span className="text-body-md text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface p-6 md:p-8 rounded-xl ghost-layer">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>backpack</span>
                  <h3 className="text-h3 text-primary">What to Bring</h3>
                </div>
                <ul className="space-y-4">
                  {service.toBring.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-sm mt-1">{idx % 2 === 0 ? 'apparel' : 'styler'}</span>
                      <span className="text-body-md text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="detail-section bg-surface-container-lowest p-6 md:p-12 ghost-layer ambient-shadow rounded-xl">
              <h2 className="text-h2 text-primary mb-10">Detailed Itinerary</h2>
              <div className="relative border-l border-primary-fixed ml-4 space-y-10">
                {service.itinerary.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${idx === 2 ? 'bg-primary shadow-[0_0_10px_rgba(0,38,63,0.3)]' : 'bg-surface-container-lowest border-2 border-primary'}`}></div>
                    <h4 className="text-label-caps text-tertiary-container mb-1">{item.time}</h4>
                    <h3 className="text-h3 text-primary text-xl mb-2">{item.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-32 bg-surface-container-lowest p-6 md:p-8 rounded-xl ghost-layer ambient-shadow flex flex-col">
              <div className="mb-6 pb-6 border-b border-surface-variant">
                <span className="text-label-caps text-secondary uppercase tracking-widest block mb-2">Starting from</span>
                <div className="flex items-baseline gap-2 flex-nowrap">
                  <span className="text-h3 text-[32px] text-primary whitespace-nowrap">Rp {service.price}</span>
                  <span className="text-body-md text-on-surface-variant whitespace-nowrap">/ person</span>
                </div>
                <p className="text-body-md text-secondary text-sm mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> {service.duration}
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-label-caps text-primary block mb-2 text-xs uppercase tracking-widest">Date</label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-primary-fixed focus:border-primary focus:ring-0 text-body-md text-on-surface px-0 py-2 transition-colors outline-none"
                    type="date"
                    min={today}
                    value={date}
                    onChange={e => { setDate(e.target.value); setAvailability({ status: 'idle' }); }}
                  />
                </div>
                <div>
                  <label className="text-label-caps text-primary block mb-2 text-xs uppercase tracking-widest">Guests</label>
                  <select
                    className="w-full bg-transparent border-0 border-b border-primary-fixed focus:border-primary focus:ring-0 text-body-md text-on-surface px-0 py-2 transition-colors appearance-none outline-none"
                    value={guests}
                    onChange={e => { setGuests(Number(e.target.value)); setAvailability({ status: 'idle' }); }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {availability.status === 'available' && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg px-3 py-2 mb-4 text-sm">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>{availability.message}</span>
                </div>
              )}
              {availability.status === 'unavailable' && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg px-3 py-2 mb-4 text-sm">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  <span>{availability.message}</span>
                </div>
              )}
              {availability.status === 'error' && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 rounded-lg px-3 py-2 mb-4 text-sm">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>{availability.message}</span>
                </div>
              )}

              {isAvailable && (
                <div className="bg-primary/5 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                  <span className="text-sm text-secondary">Total ({guests} guest{guests > 1 ? 's' : ''})</span>
                  <span className="font-bold text-primary">
                    Rp {(parseInt(service.price.replace(/\./g, ''), 10) * guests).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {!isChecked ? (
                <button
                  onClick={handleCheckAvailability}
                  disabled={!date || availability.status === 'loading'}
                  className="w-full bg-[#FF7A00] text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                >
                  {availability.status === 'loading' ? (
                    <><span className="animate-spin material-symbols-outlined text-sm">progress_activity</span> Checking…</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">event_available</span> Check Availability</>
                  )}
                </button>
              ) : isAvailable ? (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#FF7A00] text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 mb-3"
                >
                  <span className="material-symbols-outlined text-sm">payment</span>
                  Book Now & Pay
                </button>
              ) : (
                <button
                  onClick={() => setAvailability({ status: 'idle' })}
                  className="w-full bg-surface-variant text-on-surface-variant py-4 rounded-lg font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Try Another Date
                </button>
              )}

              <p className="text-body-md text-secondary text-center text-sm">
                {!isChecked
                  ? 'Select a date and check availability first'
                  : isAvailable
                  ? 'Secure payment via Midtrans'
                  : 'Choose a different date or fewer guests'}
              </p>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-5 md:px-8 mt-stack-lg pt-stack-lg border-t border-surface-variant">
          <h2 className="text-h2 text-primary mb-12 text-center">Curated for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(SERVICES_DATA).filter(s => s.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3).map(related => (
              <Link key={related.id} to={`/service/${related.slug}`} className="group cursor-pointer">
                <div className="w-full h-64 bg-cover bg-center rounded-xl mb-4 overflow-hidden relative" style={{ backgroundImage: `url('${related.heroImage}')` }}>
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <span className="text-label-caps text-tertiary-container uppercase mb-2 block">{related.itinerarySummary}</span>
                <h3 className="text-h3 text-primary text-2xl mb-2 group-hover:text-tertiary-container transition-colors">{related.title}</h3>
                <p className="text-body-md text-secondary">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}