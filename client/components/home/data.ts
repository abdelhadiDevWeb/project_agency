export const BRAND = "Voyago";

function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
}

export const HERO_IMAGE = unsplash("photo-1476514525535-07fb3b4ae5f1");
export const PROMO_IMAGE = unsplash("photo-1530521954074-e64f6810b32d");
export const FEATURE_IMAGES = {
  main: unsplash("photo-1507525428034-b723cf961d3e"),
  secondary: unsplash("photo-1469854523086-cc02fe5d8800"),
};

export const NAV_LINKS = [
  { label: "Offers", href: "#offers" },
  { label: "Destinations", href: "#destinations" },
  { label: "Why us", href: "#why-us" },
  { label: "Reviews", href: "#reviews" },
] as const;

export type OfferCategory = "Beach" | "City" | "Adventure";

export type Offer = {
  id: string;
  title: string;
  location: string;
  category: OfferCategory;
  image: string;
  imageAlt: string;
  nights: number;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  tag?: string;
};

export const OFFERS: Offer[] = [
  {
    id: "santorini",
    title: "Santorini Sunset Escape",
    location: "Santorini, Greece",
    category: "Beach",
    image: unsplash("photo-1570077188670-e3a8d69ac5ff"),
    imageAlt: "White-washed houses on the cliffs of Santorini at dusk",
    nights: 6,
    rating: 4.9,
    reviews: 312,
    price: 289000,
    oldPrice: 379000,
    tag: "Best seller",
  },
  {
    id: "tokyo",
    title: "Tokyo Neon Nights",
    location: "Tokyo, Japan",
    category: "City",
    image: unsplash("photo-1540959733332-eab4deabeeaf"),
    imageAlt: "Busy neon-lit street in Tokyo",
    nights: 7,
    rating: 4.9,
    reviews: 276,
    price: 459000,
    oldPrice: 559000,
  },
  {
    id: "morocco",
    title: "Kasbahs & Palm Oases",
    location: "Ouarzazate, Morocco",
    category: "Adventure",
    image: unsplash("photo-1489749798305-4fea3ae63d43"),
    imageAlt: "Clay kasbah overlooking a palm oasis in Morocco",
    nights: 5,
    rating: 4.8,
    reviews: 198,
    price: 159000,
    oldPrice: 205000,
    tag: "Limited spots",
  },
  {
    id: "bali",
    title: "Bali Temples & Lakes",
    location: "Bali, Indonesia",
    category: "Beach",
    image: unsplash("photo-1537996194471-e657df975ab4"),
    imageAlt: "Ulun Danu temple reflected on a calm lake in Bali",
    nights: 8,
    rating: 4.8,
    reviews: 428,
    price: 319000,
    oldPrice: 405000,
  },
  {
    id: "paris",
    title: "Paris in Bloom",
    location: "Paris, France",
    category: "City",
    image: unsplash("photo-1502602898657-3e91760cbb34"),
    imageAlt: "Eiffel Tower above the Seine at sunset",
    nights: 4,
    rating: 4.9,
    reviews: 509,
    price: 189000,
    oldPrice: 229000,
  },
  {
    id: "halong",
    title: "Ha Long Bay Cruise",
    location: "Ha Long Bay, Vietnam",
    category: "Adventure",
    image: unsplash("photo-1528127269322-539801943592"),
    imageAlt: "Limestone islands rising from Ha Long Bay",
    nights: 4,
    rating: 4.7,
    reviews: 154,
    price: 245000,
    oldPrice: 310000,
  },
  {
    id: "krabi",
    title: "Krabi Jungle Resort",
    location: "Krabi, Thailand",
    category: "Beach",
    image: unsplash("photo-1520250497591-112f2f40a3f4"),
    imageAlt: "Resort pool surrounded by palm trees and limestone cliffs",
    nights: 7,
    rating: 4.8,
    reviews: 341,
    price: 279000,
    oldPrice: 359000,
    tag: "All inclusive",
  },
  {
    id: "dubai",
    title: "Dubai Skyline & Desert",
    location: "Dubai, UAE",
    category: "City",
    image: unsplash("photo-1512453979798-5ea266f8880c"),
    imageAlt: "Dubai skyline with the Burj Khalifa at sunset",
    nights: 5,
    rating: 4.7,
    reviews: 233,
    price: 219000,
    oldPrice: 269000,
  },
];

export const DESTINATIONS = [
  {
    name: "Cinque Terre",
    country: "Italy",
    tours: 18,
    image: unsplash("photo-1516483638261-f4dbaf036963"),
    imageAlt: "Colorful cliffside houses of Manarola, Cinque Terre",
  },
  {
    name: "Maldives",
    country: "Indian Ocean",
    tours: 24,
    image: unsplash("photo-1506929562872-bb421503ef21"),
    imageAlt: "Aerial view of boats on a turquoise lagoon",
  },
  {
    name: "Venice",
    country: "Italy",
    tours: 12,
    image: unsplash("photo-1523906834658-6e24ef2386f9"),
    imageAlt: "Rialto Bridge over the Grand Canal in Venice",
  },
  {
    name: "Giza",
    country: "Egypt",
    tours: 9,
    image: unsplash("photo-1539650116574-8efeb43e2750"),
    imageAlt: "The Pyramids of Giza in the desert",
  },
  {
    name: "Paris",
    country: "France",
    tours: 15,
    image: unsplash("photo-1499856871958-5b9627545d1a"),
    imageAlt: "Pont Alexandre III in Paris at twilight",
  },
];

export const STATS = [
  { value: "12k+", label: "Happy travelers" },
  { value: "85", label: "Destinations" },
  { value: "4.9", label: "Average rating" },
  { value: "15", label: "Years of experience" },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    trip: "Santorini Sunset Escape",
    quote:
      "Every detail was taken care of â€” from the cliffside hotel to a private boat at sunset. I didn't have to think about anything except enjoying it.",
    image: unsplash("photo-1494790108377-be9c29b29330"),
  },
  {
    name: "Daniel Reyes",
    trip: "Tokyo Neon Nights",
    quote:
      "The local guides were incredible. We ate at places we'd never have found on our own. Best-organized trip I've ever taken.",
    image: unsplash("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    name: "Emma Lawson",
    trip: "Kasbahs & Palm Oases",
    quote:
      "When our flight was delayed, support rebooked everything within an hour, at 2am. That's the moment I knew I'd book with them again.",
    image: unsplash("photo-1438761681033-6461ffad8d80"),
  },
];
