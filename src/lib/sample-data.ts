/**
 * Static storefront chrome: hero, brand guarantees, tech services strip and
 * gadget navigation labels.
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const hero = {
  season: "Next-Gen Tech 2026",
  title: "Precision Gadgets & Ultra Workstations",
  copy: "Engineered for speed, durability, and modern workflows. From Intel Core laptops and 4K displays to AI smart glasses and aero backpacks.",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  alt: "High performance modern laptop and desk accessories on clean white desk",
};

export const atelier = {
  title: "AeroGuard Pro 16: Engineered for High Mobility",
  copy: [
    "Built with ballistic waterproof Oxford weave, dedicated impact-dampening sleeves for 16-inch laptops, and integrated external fast-charging USB ports.",
    "Certified for rugged daily commute and international travel. Ergonomic breathable back support with 128 days warranty protection.",
  ],
  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
  alt: "AeroGuard Pro Tech Laptop Backpack with multiple compartments and USB charging port",
};

export const services = [
  {
    title: "1-2 Day Express Delivery",
    copy: "Nationwide dispatch within 24 hours. Tracked directly to your doorstep.",
  },
  {
    title: "128 Days Full Warranty",
    copy: "Every laptop, monitor and smart gadget comes backed by verified warranty coverage.",
  },
  {
    title: "Complimentary Returns",
    copy: "7-day hassle-free returns on all accessories and gadgets.",
  },
];

/**
 * Chrome navigation for computer gadgets.
 */
export const footerNav = [
  {
    heading: "Support & Services",
    links: [
      { label: "Track Your Order", href: "/account" },
      { label: "Warranty & Repairs", href: "/contact" },
      { label: "Shipping Policies", href: "/contact" },
      { label: "Returns & Exchanges", href: "/contact" },
      { label: "Corporate Orders", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Anoralite", href: "#" },
      { label: "Certified Grade-A Guarantee", href: "#" },
      { label: "Store Locations", href: "#" },
      { label: "Customer Reviews", href: "#" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "Laptops & Notebooks", href: "/collections/laptops" },
      { label: "Desktop Deals", href: "/collections/desktops" },
      { label: "Smart Gadgets", href: "/collections/smart-gadgets" },
      { label: "Accessories & Bags", href: "/collections/accessories" },
      { label: "New Arrivals", href: "/new-arrivals" },
    ],
  },
];

export const primaryNav = [
  { label: "Laptops", href: "/collections/laptops" },
  { label: "Desktops", href: "/collections/desktops" },
  { label: "Smart Gadgets", href: "/collections/smart-gadgets" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "New Arrivals", href: "/new-arrivals" },
];
