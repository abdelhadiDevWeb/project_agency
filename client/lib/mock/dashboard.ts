import { OFFERS, type OfferCategory } from "@/components/home/data";

// Sample data until the dashboards are wired to the API.

export const TODAY = "2026-10-02";
export const PLATFORM_COMMISSION = 0.08;
export const CURRENT_AGENCY_ID = "agc-1";

export type AgencyStatus = "Active" | "Pending" | "Suspended";
export type AgencyPlan = "Basic" | "Pro" | "Premium";

export type Agency = {
  id: string;
  name: string;
  city: string;
  owner: string;
  email: string;
  plan: AgencyPlan;
  status: AgencyStatus;
  offers: number;
  bookings: number;
  /** Gross booking value over the last 12 months, in DA. */
  revenue: number;
  rating: number | null;
  joined: string;
};

export const AGENCIES: Agency[] = [
  { id: "agc-1", name: "Voyago Travel", city: "Alger", owner: "Yacine Benali", email: "contact@voyago.dz", plan: "Premium", status: "Active", offers: 8, bookings: 412, revenue: 96_450_000, rating: 4.9, joined: "2024-03-12" },
  { id: "agc-2", name: "Sahara Horizons", city: "Ghardaïa", owner: "Amel Bouzid", email: "hello@saharahorizons.dz", plan: "Pro", status: "Active", offers: 14, bookings: 286, revenue: 58_200_000, rating: 4.8, joined: "2024-06-02" },
  { id: "agc-3", name: "Oran Évasion", city: "Oran", owner: "Karim Hadj", email: "info@oranevasion.dz", plan: "Pro", status: "Active", offers: 11, bookings: 254, revenue: 51_730_000, rating: 4.7, joined: "2024-09-18" },
  { id: "agc-4", name: "Cirta Voyages", city: "Constantine", owner: "Nadia Kaci", email: "contact@cirtavoyages.dz", plan: "Basic", status: "Active", offers: 7, bookings: 168, revenue: 31_900_000, rating: 4.6, joined: "2025-01-07" },
  { id: "agc-5", name: "Bône Tours", city: "Annaba", owner: "Samir Meziane", email: "samir@bonetours.dz", plan: "Pro", status: "Pending", offers: 0, bookings: 0, revenue: 0, rating: null, joined: "2026-09-28" },
  { id: "agc-6", name: "Tlemcen Discovery", city: "Tlemcen", owner: "Leila Rahmani", email: "leila@tlemcendiscovery.dz", plan: "Basic", status: "Active", offers: 6, bookings: 121, revenue: 22_480_000, rating: 4.5, joined: "2025-04-21" },
  { id: "agc-7", name: "Djurdjura Trips", city: "Tizi Ouzou", owner: "Mourad Amrani", email: "contact@djurdjuratrips.dz", plan: "Basic", status: "Suspended", offers: 4, bookings: 57, revenue: 9_120_000, rating: 3.9, joined: "2025-02-14" },
  { id: "agc-8", name: "Hoggar Expeditions", city: "Tamanrasset", owner: "Fatima Saadi", email: "fatima@hoggarexp.dz", plan: "Pro", status: "Pending", offers: 0, bookings: 0, revenue: 0, rating: null, joined: "2026-09-30" },
  { id: "agc-9", name: "Saldae Voyages", city: "Béjaïa", owner: "Riad Cherif", email: "riad@saldaevoyages.dz", plan: "Basic", status: "Active", offers: 5, bookings: 98, revenue: 17_640_000, rating: 4.6, joined: "2025-07-03" },
];

export type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

export type Booking = {
  id: string;
  customer: string;
  agencyId: string;
  trip: string;
  travelers: number;
  departure: string;
  amount: number;
  status: BookingStatus;
};

export const BOOKINGS: Booking[] = [
  { id: "BK-24081", customer: "Amine Belkacem", agencyId: "agc-1", trip: "Santorini Sunset Escape", travelers: 2, departure: "2026-10-18", amount: 578_000, status: "Confirmed" },
  { id: "BK-24080", customer: "Sofiane Amrani", agencyId: "agc-2", trip: "Djanet Tassili Trek", travelers: 2, departure: "2026-11-02", amount: 196_000, status: "Confirmed" },
  { id: "BK-24079", customer: "Yasmine Haddad", agencyId: "agc-1", trip: "Dubai Skyline & Desert", travelers: 3, departure: "2026-10-24", amount: 657_000, status: "Pending" },
  { id: "BK-24077", customer: "Meriem Bouzid", agencyId: "agc-3", trip: "Istanbul City Break", travelers: 2, departure: "2026-10-15", amount: 270_000, status: "Confirmed" },
  { id: "BK-24076", customer: "Karim Boudiaf", agencyId: "agc-1", trip: "Paris in Bloom", travelers: 2, departure: "2026-11-05", amount: 378_000, status: "Confirmed" },
  { id: "BK-24074", customer: "Hichem Djebbar", agencyId: "agc-4", trip: "Sharm El Sheikh Diving", travelers: 3, departure: "2026-10-27", amount: 465_000, status: "Pending" },
  { id: "BK-24072", customer: "Sarah Benali", agencyId: "agc-1", trip: "Bali Temples & Lakes", travelers: 2, departure: "2026-11-12", amount: 638_000, status: "Pending" },
  { id: "BK-24070", customer: "Asma Larbi", agencyId: "agc-6", trip: "Djerba Beach Holiday", travelers: 4, departure: "2026-10-11", amount: 384_000, status: "Confirmed" },
  { id: "BK-24068", customer: "Mohamed Cherif", agencyId: "agc-1", trip: "Tokyo Neon Nights", travelers: 1, departure: "2026-10-09", amount: 459_000, status: "Confirmed" },
  { id: "BK-24066", customer: "Bilal Ferhat", agencyId: "agc-9", trip: "Hammamet Family Week", travelers: 5, departure: "2026-08-30", amount: 425_000, status: "Completed" },
  { id: "BK-24061", customer: "Lina Mansouri", agencyId: "agc-1", trip: "Krabi Jungle Resort", travelers: 4, departure: "2026-12-20", amount: 1_116_000, status: "Confirmed" },
  { id: "BK-24060", customer: "Khadidja Mebarki", agencyId: "agc-3", trip: "Kuala Lumpur & Langkawi", travelers: 2, departure: "2026-12-03", amount: 498_000, status: "Pending" },
  { id: "BK-24055", customer: "Rachid Kaci", agencyId: "agc-1", trip: "Kasbahs & Palm Oases", travelers: 2, departure: "2026-09-20", amount: 318_000, status: "Completed" },
  { id: "BK-24052", customer: "Anis Toumi", agencyId: "agc-2", trip: "Zanzibar Escape", travelers: 2, departure: "2026-09-25", amount: 612_000, status: "Cancelled" },
  { id: "BK-24049", customer: "Imane Rahmani", agencyId: "agc-1", trip: "Ha Long Bay Cruise", travelers: 2, departure: "2026-09-14", amount: 490_000, status: "Cancelled" },
  { id: "BK-24043", customer: "Walid Meziane", agencyId: "agc-1", trip: "Santorini Sunset Escape", travelers: 2, departure: "2026-09-02", amount: 578_000, status: "Completed" },
  { id: "BK-24038", customer: "Nour El Houda Saadi", agencyId: "agc-1", trip: "Dubai Skyline & Desert", travelers: 2, departure: "2026-10-30", amount: 438_000, status: "Pending" },
];

export type MonthlyPoint = { label: string; value: number };

const LAST_12_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function series(millions: number[]): MonthlyPoint[] {
  return LAST_12_MONTHS.map((label, i) => ({ label, value: Math.round(millions[i] * 1_000_000) }));
}

export const PLATFORM_MONTHLY = series([16.2, 18.9, 21.4, 17.8, 19.6, 22.3, 24.1, 27.8, 31.5, 33.2, 28.4, 26.3]);
export const AGENCY_MONTHLY = series([5.1, 6.2, 7.4, 5.9, 6.8, 7.9, 8.6, 9.8, 11.2, 11.9, 8.45, 7.2]);

export type OfferStatus = "Published" | "Draft";

export type AgencyOffer = {
  id: string;
  title: string;
  location: string;
  category: OfferCategory;
  nights: number;
  price: number;
  oldPrice?: number;
  status: OfferStatus;
  bookings: number;
  image?: string;
  imageAlt?: string;
};

const OFFER_BOOKINGS: Record<string, number> = {
  santorini: 96,
  tokyo: 54,
  morocco: 41,
  bali: 63,
  paris: 72,
  halong: 0,
  krabi: 38,
  dubai: 48,
};

export const AGENCY_OFFERS: AgencyOffer[] = OFFERS.map((offer) => ({
  id: offer.id,
  title: offer.title,
  location: offer.location,
  category: offer.category,
  nights: offer.nights,
  price: offer.price,
  oldPrice: offer.oldPrice,
  status: offer.id === "halong" ? "Draft" : "Published",
  bookings: OFFER_BOOKINGS[offer.id] ?? 0,
  image: offer.image,
  imageAlt: offer.imageAlt,
}));
