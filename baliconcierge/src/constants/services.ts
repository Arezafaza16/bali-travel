
export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  heroTitle: string;
  heroImage: string;
  description: string;
  longDescription: string;
  price: string;
  duration: string;
  included: string[];
  toBring: string[];
  itinerary: ItineraryItem[];
  itinerarySummary: string;
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  'white-water-rafting': {
    id: '2',
    slug: 'white-water-rafting',
    title: 'White Water Rafting',
    category: 'Ayung River Expedition',
    heroTitle: 'Premium White Water Rafting',
    heroImage: '/images/rafting_v2_1777956959490.png',
    description: "Navigate the exhilarating rapids of the Ayung River surrounded by lush tropical rainforests.",
    longDescription: "Embark on a two-hour journey through Bali's most scenic waterway. This is not your standard tourist run. Our curated rafting experience provides access to secluded river sections, offering breathtaking views of hidden waterfalls, untouched jungle, and intricate Hindu shrines carved into the river gorge walls.\n\nEvery detail is managed by your personal Concierge Guide, ensuring that from hotel pickup to the post-river gourmet lunch, your adventure is entirely seamless and uncompromisingly luxurious.",
    price: '1.950.000',
    duration: 'Approx. 6 Hours total',
    included: [
      'Private round-trip luxury transfer',
      'International standard safety gear',
      'Gourmet buffet lunch overlooking the valley',
      'Access to premium shower facilities & towels',
      'Comprehensive insurance coverage'
    ],
    toBring: [
      'Swimwear or light, quick-drying clothing',
      'River sandals or waterproof shoes',
      'Sunscreen & sunglasses with straps',
      'A change of dry clothes for afterward'
    ],
    itinerary: [
      { time: '08:00 AM', title: 'Villa Pick-up', description: 'Your private chauffeur arrives at your accommodation in a climate-controlled luxury SUV.' },
      { time: '09:30 AM', title: 'Arrival & Safety Briefing', description: 'Welcome drinks upon arrival. Our certified river guides provide a comprehensive safety orientation and fit your premium gear.' },
      { time: '10:00 AM', title: 'River Descent', description: 'Navigate 14 kilometers of stunning Class II & III rapids through deep gorges and past hidden jungle waterfalls.' },
      { time: '12:30 PM', title: 'Gourmet Lunch', description: 'Freshen up in luxury shower suites before enjoying a curated buffet lunch overlooking the lush river valley.' }
    ],
    itinerarySummary: 'Ayung River Expedition'
  },
  'watersport': {
    id: '1',
    slug: 'watersport',
    title: 'Watersport',
    category: 'Tanjung Benoa Adventure',
    heroTitle: 'Elite Watersport Experience',
    heroImage: '/images/watersport_v2_1777956978127.png',
    description: "Experience the thrill of Bali's pristine coastlines with guided jet skiing, parasailing, and snorkeling.",
    longDescription: "Bask in the tropical sun at Tanjung Benoa, Bali's premier destination for marine thrills. Our private watersport package avoids the crowds, providing you with exclusive access to premium equipment and one-on-one instruction from elite marine guides.\n\nFrom high-speed jet ski runs to serene snorkeling in protected reefs, every activity is curated for safety, comfort, and maximum adrenaline.",
    price: '750.000',
    duration: 'Approx. 4 Hours total',
    included: [
      'Private luxury transportation',
      'Parasailing, Jet Ski & Snorkeling equipment',
      'Certified marine instructors',
      'Premium beach club access',
      'Seafood lunch by the shore'
    ],
    toBring: [
      'Swimwear',
      'Sunscreen & Sunglasses',
      'Camera or GoPro',
      'Change of clothes'
    ],
    itinerary: [
      { time: '09:00 AM', title: 'Private Pickup', description: 'Limo transfer from your villa to Tanjung Benoa.' },
      { time: '10:00 AM', title: 'Marine Briefing', description: 'Meet your instructors and receive a safety orientation for all activities.' },
      { time: '10:30 AM', title: 'Action Phase', description: 'Enjoy your selection of premium watersports with professional guidance.' },
      { time: '01:30 PM', title: 'Seafood Lunch', description: 'Relax at an exclusive beachfront restaurant for a freshly prepared feast.' }
    ],
    itinerarySummary: 'Marine Adventures'
  },
  'atv-quad-bike': {
    id: '3',
    slug: 'atv-quad-bike',
    title: 'ATV Quad Bike',
    category: 'Ubud Jungle Trek',
    heroTitle: 'Off-Road Jungle Expedition',
    heroImage: '/images/atv_quad_v2_1777956994688.png',
    description: 'Conquer muddy trails and jungle paths on a guided off-road ATV adventure through rural Bali.',
    longDescription: "Escape the paved roads and venture deep into the heart of Bali's rugged interior. Our ATV expedition takes you through muddy riverbeds, dense bamboo forests, and traditional Balinese villages that remain untouched by modern tourism.\n\nOur high-performance quad bikes and expert lead riders ensure a thrilling yet safe journey through the island's most dramatic landscapes.",
    price: '950.000',
    duration: 'Approx. 5 Hours total',
    included: [
      'Luxury SUV transfers',
      'Premium 250cc Quad Bike',
      'Professional trek leader',
      'Full safety equipment',
      'Traditional Balinese lunch'
    ],
    toBring: [
      'Clothes you don\'t mind getting dirty',
      'Closed-toe shoes',
      'Sunscreen',
      'Change of clothes & towel'
    ],
    itinerary: [
      { time: '08:30 AM', title: 'Hotel Pickup', description: 'Your private SUV departs for the central highlands.' },
      { time: '10:00 AM', title: 'Gear Up', description: 'Safety briefing and test drive on our private practice track.' },
      { time: '10:30 AM', title: 'Into the Wild', description: 'A two-hour technical trek through jungle, mud, and rivers.' },
      { time: '01:00 PM', title: 'Riverside Lunch', description: 'Recharge with a healthy lunch overlooking the jungle canopy.' }
    ],
    itinerarySummary: 'Ubud Off-Road'
  },
  'one-day-tour': {
    id: '4',
    slug: 'one-day-tour',
    title: 'One Day Tour',
    category: 'Cultural Landmarks',
    heroTitle: 'Bespoke Island Heritage Tour',
    heroImage: '/images/island_tour_v2_1777957014124.png',
    description: "Discover the island's most iconic temples, rice terraces, and cultural landmarks in luxury comfort.",
    longDescription: "A completely customisable day of exploration led by our most senior Concierge Guide. Whether you seek the spiritual serenity of Besakih, the iconic vistas of Tegalalang, or the hidden beaches of the Bukit Peninsula, we curate the perfect itinerary based on your preferences.\n\nSkip the lines and avoid the tourist traps as we navigate the island's heritage sites with insider knowledge and uncompromising comfort.",
    price: '1.250.000',
    duration: '10 Hours (Full Day)',
    included: [
      'Private Chauffeur & Senior Guide',
      'Luxury climate-controlled vehicle',
      'All entrance fees & parking',
      'Bottled mineral water & snacks',
      'Customized itinerary planning'
    ],
    toBring: [
      'Camera',
      'Comfortable walking shoes',
      'Sarong (also provided if needed)',
      'Sun hat & Sunglasses'
    ],
    itinerary: [
      { time: '08:00 AM', title: 'Departure', description: 'Custom pickup from your villa or hotel.' },
      { time: '09:30 AM', title: 'Morning Highlight', description: 'Visit your first priority landmark with expert historical commentary.' },
      { time: '12:30 PM', title: 'Signature Dining', description: 'A curated lunch experience at one of the island\'s top hidden gems.' },
      { time: '02:30 PM', title: 'Afternoon Discovery', description: 'Continue to hidden temples or scenic viewpoints away from crowds.' }
    ],
    itinerarySummary: 'Grand Island Tour'
  }
};
