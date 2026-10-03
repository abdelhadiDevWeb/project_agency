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

export const MONTH_LABELS = LAST_12_MONTHS;

/** Current agency, same 12 months one year earlier, in DA. */
export const AGENCY_MONTHLY_PREVIOUS = series([4.3, 5.0, 6.1, 4.9, 5.6, 6.5, 7.1, 8.1, 9.2, 9.9, 6.9, 5.9]);
export const AGENCY_MONTHLY_BOOKINGS = [22, 27, 32, 25, 29, 34, 37, 42, 48, 51, 36, 29];
export const AGENCY_MONTHLY_BOOKINGS_PREVIOUS = [19, 24, 28, 22, 25, 30, 32, 37, 42, 44, 31, 25];
export const AGENCY_MONTHLY_CANCELLATIONS = [1, 2, 1, 1, 2, 1, 2, 2, 3, 2, 2, 1];
export const AGENCY_NEW_CUSTOMERS = [15, 18, 20, 16, 18, 21, 22, 25, 28, 29, 21, 17];
export const AGENCY_RETURNING_CUSTOMERS = [5, 7, 9, 7, 8, 10, 12, 14, 16, 18, 13, 11];

export type CustomerSegment = "VIP" | "Returning" | "New";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bookings: number;
  /** Total paid to the agency, in DA. */
  totalSpent: number;
  firstBooking: string;
  lastTrip: string;
  lastTripDate: string;
};

export const VIP_SPEND = 1_500_000;

export function customerSegment(customer: Customer): CustomerSegment {
  if (customer.totalSpent >= VIP_SPEND || customer.bookings >= 5) return "VIP";
  return customer.bookings >= 2 ? "Returning" : "New";
}

export const AGENCY_CUSTOMERS: Customer[] = [
  { id: "cus-01", name: "Lina Mansouri", email: "lina.mansouri@gmail.com", phone: "+213 555 21 34 87", city: "Alger", bookings: 6, totalSpent: 3_420_000, firstBooking: "2024-05-11", lastTrip: "Krabi Jungle Resort", lastTripDate: "2026-12-20" },
  { id: "cus-02", name: "Amine Belkacem", email: "amine.belkacem@outlook.com", phone: "+213 661 45 12 90", city: "Blida", bookings: 3, totalSpent: 1_356_000, firstBooking: "2025-02-03", lastTrip: "Santorini Sunset Escape", lastTripDate: "2026-10-18" },
  { id: "cus-03", name: "Yasmine Haddad", email: "yasmine.haddad@gmail.com", phone: "+213 770 88 21 03", city: "Oran", bookings: 2, totalSpent: 1_095_000, firstBooking: "2025-08-19", lastTrip: "Dubai Skyline & Desert", lastTripDate: "2026-10-24" },
  { id: "cus-04", name: "Karim Boudiaf", email: "karim.boudiaf@yahoo.fr", phone: "+213 550 67 43 21", city: "Alger", bookings: 4, totalSpent: 1_612_000, firstBooking: "2024-09-27", lastTrip: "Paris in Bloom", lastTripDate: "2026-11-05" },
  { id: "cus-05", name: "Sarah Benali", email: "sarah.benali@gmail.com", phone: "+213 662 10 98 54", city: "Tipaza", bookings: 1, totalSpent: 638_000, firstBooking: "2026-09-21", lastTrip: "Bali Temples & Lakes", lastTripDate: "2026-11-12" },
  { id: "cus-06", name: "Mohamed Cherif", email: "m.cherif@gmail.com", phone: "+213 771 32 65 09", city: "Constantine", bookings: 2, totalSpent: 868_000, firstBooking: "2025-11-14", lastTrip: "Tokyo Neon Nights", lastTripDate: "2026-10-09" },
  { id: "cus-07", name: "Rachid Kaci", email: "rachid.kaci@hotmail.com", phone: "+213 553 74 18 62", city: "Tizi Ouzou", bookings: 5, totalSpent: 1_284_000, firstBooking: "2024-04-02", lastTrip: "Kasbahs & Palm Oases", lastTripDate: "2026-09-20" },
  { id: "cus-08", name: "Imane Rahmani", email: "imane.rahmani@gmail.com", phone: "+213 664 29 57 13", city: "Alger", bookings: 1, totalSpent: 0, firstBooking: "2026-08-30", lastTrip: "Ha Long Bay Cruise", lastTripDate: "2026-09-14" },
  { id: "cus-09", name: "Walid Meziane", email: "walid.meziane@gmail.com", phone: "+213 772 46 80 35", city: "Béjaïa", bookings: 2, totalSpent: 1_046_000, firstBooking: "2025-06-08", lastTrip: "Santorini Sunset Escape", lastTripDate: "2026-09-02" },
  { id: "cus-10", name: "Nour El Houda Saadi", email: "nour.saadi@gmail.com", phone: "+213 556 91 23 47", city: "Sétif", bookings: 1, totalSpent: 438_000, firstBooking: "2026-09-25", lastTrip: "Dubai Skyline & Desert", lastTripDate: "2026-10-30" },
  { id: "cus-11", name: "Djamel Ouali", email: "djamel.ouali@gmail.com", phone: "+213 665 38 72 16", city: "Alger", bookings: 7, totalSpent: 2_874_000, firstBooking: "2024-03-20", lastTrip: "Bali Temples & Lakes", lastTripDate: "2026-07-14" },
  { id: "cus-12", name: "Selma Brahimi", email: "selma.brahimi@outlook.com", phone: "+213 773 52 09 84", city: "Annaba", bookings: 2, totalSpent: 756_000, firstBooking: "2025-12-01", lastTrip: "Paris in Bloom", lastTripDate: "2026-04-18" },
  { id: "cus-13", name: "Farid Khelifi", email: "farid.khelifi@gmail.com", phone: "+213 557 14 66 30", city: "Batna", bookings: 1, totalSpent: 459_000, firstBooking: "2026-09-10", lastTrip: "Tokyo Neon Nights", lastTripDate: "2026-10-26" },
  { id: "cus-14", name: "Houria Benmoussa", email: "houria.benmoussa@yahoo.fr", phone: "+213 666 83 40 27", city: "Oran", bookings: 3, totalSpent: 1_190_000, firstBooking: "2025-03-15", lastTrip: "Santorini Sunset Escape", lastTripDate: "2026-06-21" },
];
/** Same 12 months one year earlier, in DA. */
export const PLATFORM_MONTHLY_PREVIOUS = series([13.1, 15.4, 18.2, 15.6, 16.3, 18.9, 20.2, 23.1, 26.9, 28.4, 24.1, 22.2]);
export const MONTHLY_BOOKINGS = [78, 92, 104, 86, 95, 108, 117, 135, 153, 161, 138, 129];
export const MONTHLY_BOOKINGS_PREVIOUS = [71, 83, 90, 79, 84, 95, 104, 118, 134, 142, 124, 118];
export const MONTHLY_CANCELLATIONS = [4, 5, 4, 3, 5, 4, 6, 5, 7, 6, 5, 4];

export const TOP_DESTINATIONS: Array<{ name: string; country: string; bookings: number }> = [
  { name: "Istanbul", country: "Turkey", bookings: 214 },
  { name: "Dubai", country: "UAE", bookings: 186 },
  { name: "Santorini", country: "Greece", bookings: 142 },
  { name: "Djerba", country: "Tunisia", bookings: 131 },
  { name: "Sharm El Sheikh", country: "Egypt", bookings: 118 },
  { name: "Djanet", country: "Algeria", bookings: 97 },
];

export type BillingCycle = "Monthly" | "Yearly";
export type SubscriptionStatus = "Active" | "Trial" | "Expired" | "Cancelled";

export type Plan = {
  id: AgencyPlan;
  tagline: string;
  /** Price per month in DA. A yearly subscription costs YEARLY_BILLED_MONTHS of it. */
  monthlyPrice: number;
  /** Maximum published offers, null for unlimited. */
  offerLimit: number | null;
  features: string[];
};

export const YEARLY_BILLED_MONTHS = 10;
export const TRIAL_DAYS = 14;
export const EXPIRING_SOON_DAYS = 14;

export const PLANS: Plan[] = [
  {
    id: "Basic",
    tagline: "For agencies getting started",
    monthlyPrice: 9_900,
    offerLimit: 10,
    features: ["Up to 10 published offers", "Booking management", "Email support"],
  },
  {
    id: "Pro",
    tagline: "For growing agencies",
    monthlyPrice: 19_900,
    offerLimit: 30,
    features: ["Up to 30 published offers", "Featured on the home page", "Sales statistics", "Priority support"],
  },
  {
    id: "Premium",
    tagline: "For established agencies",
    monthlyPrice: 39_900,
    offerLimit: null,
    features: ["Unlimited offers", "Top placement in search", "Advanced statistics", "Dedicated account manager"],
  },
];

export type Subscription = {
  id: string;
  agencyId: string;
  plan: AgencyPlan;
  billing: BillingCycle;
  status: SubscriptionStatus;
  startedAt: string;
  /** Next renewal for active subscriptions, otherwise the day access ends or ended. */
  endsAt: string;
};

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-1", agencyId: "agc-1", plan: "Premium", billing: "Yearly", status: "Active", startedAt: "2026-03-12", endsAt: "2027-03-12" },
  { id: "sub-2", agencyId: "agc-2", plan: "Pro", billing: "Monthly", status: "Active", startedAt: "2026-09-20", endsAt: "2026-10-20" },
  { id: "sub-3", agencyId: "agc-3", plan: "Pro", billing: "Yearly", status: "Active", startedAt: "2025-10-14", endsAt: "2026-10-14" },
  { id: "sub-4", agencyId: "agc-4", plan: "Basic", billing: "Monthly", status: "Active", startedAt: "2026-09-07", endsAt: "2026-10-07" },
  { id: "sub-5", agencyId: "agc-5", plan: "Pro", billing: "Monthly", status: "Trial", startedAt: "2026-09-28", endsAt: "2026-10-12" },
  { id: "sub-6", agencyId: "agc-6", plan: "Basic", billing: "Monthly", status: "Active", startedAt: "2026-09-21", endsAt: "2026-10-21" },
  { id: "sub-7", agencyId: "agc-7", plan: "Basic", billing: "Monthly", status: "Expired", startedAt: "2026-07-14", endsAt: "2026-08-14" },
  { id: "sub-8", agencyId: "agc-8", plan: "Pro", billing: "Monthly", status: "Trial", startedAt: "2026-09-30", endsAt: "2026-10-14" },
  { id: "sub-9", agencyId: "agc-9", plan: "Basic", billing: "Yearly", status: "Active", startedAt: "2026-07-03", endsAt: "2027-07-03" },
];

export function billedPrice(plan: Plan, billing: BillingCycle): number {
  return billing === "Yearly" ? plan.monthlyPrice * YEARLY_BILLED_MONTHS : plan.monthlyPrice;
}

/** Monthly recurring revenue from active subscriptions; yearly plans count as 1/12 of their price. */
export function monthlyRecurringRevenue(subscriptions: Subscription[], plans: Plan[]): number {
  return subscriptions.reduce((sum, sub) => {
    if (sub.status !== "Active") return sum;
    const plan = plans.find((p) => p.id === sub.plan);
    if (!plan) return sum;
    return sum + (sub.billing === "Yearly" ? billedPrice(plan, "Yearly") / 12 : plan.monthlyPrice);
  }, 0);
}

/** MRR over the last 12 months as a share of today's value. */
const MRR_GROWTH = [0.42, 0.47, 0.53, 0.57, 0.62, 0.68, 0.73, 0.79, 0.85, 0.9, 0.95, 1];

export function mrrHistory(currentMrr: number): number[] {
  return MRR_GROWTH.map((share) => Math.round(currentMrr * share));
}

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
