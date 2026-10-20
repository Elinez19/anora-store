/**
 * Seeds the catalogue with Computer Gadgets, Laptops, Desktops, Wearables, and Accessories.
 * Each product has 4+ rich perspective images for the multi-image gallery with scroll control.
 *
 * Run with `npm run db:seed`.
 */
import "dotenv/config";

import { db } from "../src/db";
import { categories, productImages, products } from "../src/db/schema";

type ProductImage = { src: string; alt: string };

type StockState = "in_stock" | "low_stock" | "made_to_order" | "sold_out";

type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  badge?: string;
  sku: string;
  colour: string;
  stock: StockState;
  stockDetail?: string;
  description: string;
  details: string[];
  care: string;
};

export const seedCategories = [
  {
    slug: "laptops",
    name: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "High performance modern ultrabooks and laptops",
    position: 0,
  },
  {
    slug: "desktops",
    name: "Desktops",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Apple iMac 4K Retina all-in-one desktop workstation",
    position: 1,
  },
  {
    slug: "smart-gadgets",
    name: "Smart Gadgets",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern smartwatches, wearable health monitors and AI glasses",
    position: 2,
  },
  {
    slug: "accessories",
    name: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Waterproof laptop backpacks, cables, keyboards, and desk gear",
    position: 3,
  },
];

const categorySlugByName: Record<string, string> = {
  Laptops: "laptops",
  Desktops: "desktops",
  "Smart Gadgets": "smart-gadgets",
  Accessories: "accessories",
};

const stockLevels: Record<StockState, { stockQuantity: number; madeToOrder: boolean }> = {
  in_stock: { stockQuantity: 24, madeToOrder: false },
  low_stock: { stockQuantity: 3, madeToOrder: false },
  made_to_order: { stockQuantity: 0, madeToOrder: true },
  sold_out: { stockQuantity: 0, madeToOrder: false },
};

// Computer Gadgets catalogue with 4+ images per product
const catalog: Product[] = [
  // --- LAPTOPS ---
  {
    slug: "hp-elitebook-840-g7-core-i5",
    name: "HP EliteBook 840 G7 | 10th Gen Core i5 | 16GB RAM | 512GB SSD",
    category: "Laptops",
    price: 460000,
    compareAtPrice: 580000,
    sku: "HP-ELT-840-G7",
    colour: "Silver",
    stock: "in_stock",
    stockDetail: "In stock — Express dispatch in 24h",
    badge: "Save ₦120,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook 840 G7 laptop front display with Windows",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook top down angle on clean workspace desk",
      },
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook 840 keyboard and trackpad angle view",
      },
      {
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook side profile showing ports and slim chassis",
      },
      {
        src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook closed top lid metal finish",
      },
    ],
    description:
      "Enterprise ultrabook with aluminium unibody chassis, 14-inch Full HD anti-glare display, Bang & Olufsen tuned audio, and biometric fingerprint security.",
    details: [
      "14 inch FHD Anti-Glare IPS Display (1920 × 1080)",
      "Intel Core i5-10310U (10th Gen, up to 4.4GHz)",
      "16GB DDR4 RAM (Upgradable to 64GB)",
      "512GB PCIe NVMe High-Speed SSD",
      "Thunderbolt 3 USB-C, HDMI 2.0, USB 3.1",
      "Backlit Spill-Resistant Keyboard",
      "128 Days Certified Hardware Warranty",
    ],
    care: "Keep air vents clear of dust. Clean screen with microfiber cloth and specialized display cleaner.",
  },
  {
    slug: "dell-chromebook-3100-celeron",
    name: "Dell Chromebook 3100 | Intel Celeron N4020 | 4GB RAM | 32GB eMMC",
    category: "Laptops",
    price: 94000,
    sku: "DEL-CRM-3100",
    colour: "Matte Black",
    stock: "in_stock",
    stockDetail: "Ready to ship",
    badge: "Hot",
    images: [
      {
        src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
        alt: "Dell Chromebook 3100 front display",
      },
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "Dell Chromebook 3100 top open view",
      },
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "Dell Chromebook keyboard and palm rest",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "Dell Chromebook closed rugged rubber edges",
      },
    ],
    description:
      "Ultra-rugged 11.6-inch laptop engineered with rubberized protective edges, spill-resistant keyboard, and all-day battery life for students and light business.",
    details: [
      "11.6 inch HD Anti-Glare Screen (1366 × 768)",
      "Intel Celeron N4020 Dual-Core Processor",
      "4GB LPDDR4 Memory",
      "32GB High Endurance eMMC Flash Storage",
      "Up to 14 Hours Battery Runtime",
      "ChromeOS with full Play Store support",
      "128 Days Hardware Warranty",
    ],
    care: "Resistant to minor drops; avoid extreme liquid submersion.",
  },
  {
    slug: "hp-elitebook-x360-1030-g2",
    name: "HP EliteBook x360 1030 G2 | 7th Gen Core i5 | Touch 2-in-1 Convertible",
    category: "Laptops",
    price: 360000,
    compareAtPrice: 420000,
    sku: "HP-X360-1030",
    colour: "Natural Silver",
    stock: "in_stock",
    stockDetail: "Limited units left",
    badge: "Save ₦60,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook x360 2-in-1 convertible tent mode",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook x360 open laptop mode",
      },
      {
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook x360 tablet touch interaction",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook x360 360 geared hinge detail",
      },
    ],
    description:
      "Premium 360-degree rotating 2-in-1 convertible laptop. Works seamlessly as a laptop, presentation display, or digital notepad with responsive touchscreen.",
    details: [
      "13.3 inch FHD Touchscreen with Corning Gorilla Glass",
      "360-Degree Geared Hinge (Laptop, Tent, Tablet modes)",
      "Intel Core i5-7300U vPro Processor",
      "8GB RAM | 256GB NVMe SSD",
      "Bang & Olufsen Quad Audio Speakers",
      "IR Camera for Windows Hello Facial Recognition",
    ],
    care: "Use soft cloth on touchscreen. Avoid bending beyond rated 360 degree rotation.",
  },
  {
    slug: "hp-elitebook-folio-1040-g3",
    name: "HP EliteBook Folio 1040 G3 | 6th Gen Core i7 | 8GB RAM | 256GB SSD",
    category: "Laptops",
    price: 295000,
    compareAtPrice: 340000,
    sku: "HP-FOL-1040-G3",
    colour: "Silver",
    stock: "in_stock",
    stockDetail: "Four left in stock",
    badge: "Save ₦45,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook Folio 1040 slim profile ultrabook",
      },
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook Folio keyboard close-up",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook Folio ultra-slim side ports",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook Folio closed aluminium finish",
      },
    ],
    description:
      "Exquisite diamond-cut CNC machined aluminum body under 1.4kg. Delivering Core i7 computing power in an ultra-slim travel companion.",
    details: [
      "14.0 inch Full HD Anti-Glare Display",
      "Intel Core i7-6600U Dual Core Processor",
      "8GB High Speed Memory",
      "256GB M.2 Solid State Drive",
      "HP Clear Sound Amp & Noise Reduction Software",
      "128 Days Hardware Warranty",
    ],
    care: "Wipe with damp clean microfiber. Do not use alcohol-based solvents on aluminum body.",
  },
  {
    slug: "hp-zbook-firefly-14-g7-mobile-workstation",
    name: "HP ZBook Firefly 14 G7 Mobile Workstation | Core i7 | Dedicated Graphics",
    category: "Laptops",
    price: 520000,
    compareAtPrice: 640000,
    sku: "HP-ZBK-14-G7",
    colour: "Space Silver",
    stock: "in_stock",
    stockDetail: "Professional Workstation Grade",
    badge: "Save ₦120,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
        alt: "HP ZBook Firefly 14 professional laptop workstation",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "HP ZBook Firefly 14 open display in workspace",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        alt: "HP ZBook Firefly cooling vents and ports",
      },
      {
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
        alt: "HP ZBook Firefly backlit keyboard and NVIDIA Quadro badge",
      },
    ],
    description:
      "ZBook performance in an ultralight package designed for creators, designers, and software engineers who demand rendering power on the go.",
    details: [
      "14 inch 400 nits 100% sRGB Color Accurate Display",
      "Intel Core i7-10610U Hexa-Core Performance",
      "32GB RAM | 512GB NVMe PCIe 4.0 SSD",
      "NVIDIA Quadro Dedicated Graphics",
      "Dual Stereo Bang & Olufsen Speakers",
      "128 Days Certified Warranty",
    ],
    care: "Ensure heavy rendering is conducted on flat elevated surface for optimal cooling airflow.",
  },
  {
    slug: "hp-elitebook-735-g6-amd-ryzen-7",
    name: "HP EliteBook 735 G6 | AMD Ryzen 7 PRO | Vega Graphics | 16GB RAM",
    category: "Laptops",
    price: 385000,
    compareAtPrice: 450000,
    sku: "HP-ELT-735-G6",
    colour: "Platinum Silver",
    stock: "in_stock",
    badge: "Save ₦65,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook with AMD Ryzen 7 PRO on workspace desk",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook 735 display showing Radeon graphics",
      },
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook 735 compact chassis profile",
      },
      {
        src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
        alt: "HP EliteBook 735 metal rear and hinge",
      },
    ],
    description:
      "Powered by AMD Ryzen 7 PRO architecture with Radeon Vega 10 graphics. Exceptional multi-tasking and graphics performance in a 13.3-inch frame.",
    details: [
      "13.3 inch FHD IPS Display (1920 × 1080)",
      "AMD Ryzen 7 PRO 3700U with Radeon Vega 10 Graphics",
      "16GB DDR4 2400MHz RAM",
      "512GB PCIe NVMe SSD",
      "Ultra-fast WiFi 6 & Bluetooth 5.0",
      "128 Days Warranty",
    ],
    care: "Operate within safe temperature ranges; avoid blocking bottom fan exhausts.",
  },

  // --- DESKTOPS ---
  {
    slug: "apple-imac-21-5-inch-late-2012",
    name: "Apple iMac 21.5-inch (Late 2012) | Core i5 2.7GHz | 8GB RAM | 1TB HDD",
    category: "Desktops",
    price: 185000,
    compareAtPrice: 285000,
    sku: "APL-IMC-21-2012",
    colour: "Anodized Aluminum",
    stock: "in_stock",
    stockDetail: "Complete bundle with Magic Mouse & Keyboard",
    badge: "Save ₦100,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac 21.5 inch desktop computer with keyboard and mouse on desk",
      },
      {
        src: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac front screen view",
      },
      {
        src: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac side profile razor-thin edge",
      },
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac rear ports and aluminum stand",
      },
    ],
    description:
      "All-in-one desktop workstation featuring iconic razor-thin edge design, IPS LED-backlit widescreen display, and rich built-in stereo acoustics.",
    details: [
      "21.5-inch LED-backlit IPS Display (1920 × 1080)",
      "2.7GHz Quad-core Intel Core i5",
      "8GB 1600MHz DDR3 Memory",
      "1TB 5400-rpm Storage",
      "NVIDIA GeForce GT 640M Graphics",
      "FaceTime HD Camera, Dual Microphones, Stereo Speakers",
      "Includes Apple Magic Keyboard & Magic Mouse",
    ],
    care: "Clean glass display with lint-free microfiber cloth. Do not apply liquid directly to display.",
  },
  {
    slug: "apple-imac-retina-4k-21-5-inch-2017-core-i5",
    name: "Apple iMac Retina 4K 21.5-inch (2017) | 7th Gen Core i5 | 8GB RAM | 1TB Fusion",
    category: "Desktops",
    price: 415000,
    compareAtPrice: 515000,
    sku: "APL-IMC-4K-2017",
    colour: "Silver",
    stock: "in_stock",
    stockDetail: "Certified Grade-A Screen",
    badge: "Save ₦100,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac 4K Retina screen showing vivid colors",
      },
      {
        src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac 4K desktop setup on white desk",
      },
      {
        src: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac side razor edge",
      },
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple Magic Keyboard and Mouse included",
      },
    ],
    description:
      "Stunning 4K Retina display packing one billion colors and 500 nits of brightness. Perfect for photo editing, video grading, and luxury desktop setups.",
    details: [
      "21.5-inch Retina 4K Display (4096 × 2304 resolution)",
      "3.0GHz Quad-core 7th-generation Intel Core i5",
      "8GB 2400MHz DDR4 Memory",
      "1TB Fusion Drive for rapid boot times",
      "Radeon Pro 555 with 2GB VRAM",
      "Two Thunderbolt 3 (USB-C) Ports",
      "128 Days Full Hardware Warranty",
    ],
    care: "Ensure stable power connection with surge protector.",
  },
  {
    slug: "apple-imac-21-5-inch-2017-core-i5-2-3ghz",
    name: "Apple iMac 21.5-inch (2017) | 7th Gen Core i5 2.3GHz | 8GB RAM | 256GB SSD",
    category: "Desktops",
    price: 345000,
    compareAtPrice: 470000,
    sku: "APL-IMC-2017-SSD",
    colour: "Silver",
    stock: "in_stock",
    badge: "Save ₦125,000.00",
    images: [
      {
        src: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac desktop computer clean modern workstation",
      },
      {
        src: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac front display vivid colors",
      },
      {
        src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac workspace desk view",
      },
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "Apple iMac rear ports and power cable",
      },
    ],
    description:
      "Equipped with pure ultra-fast SSD storage for immediate app responsiveness, seamless macOS navigation, and silent thermal performance.",
    details: [
      "21.5-inch sRGB IPS Display (1920 × 1080)",
      "2.3GHz Dual-core Intel Core i5 (Turbo up to 3.6GHz)",
      "8GB 2133MHz DDR4 Memory",
      "256GB High-Speed SSD Storage",
      "Intel Iris Plus Graphics 640",
      "Includes Magic Keyboard & Magic Mouse 2",
    ],
    care: "Keep away from direct heat and moisture.",
  },

  // --- SMART GADGETS ---
  {
    slug: "z78-zt54-smart-watch-amoled",
    name: "Z78 / ZT54 Ultra Smart Watch | AMOLED Display | Bluetooth Calling | Sports Mode",
    category: "Smart Gadgets",
    price: 36000,
    compareAtPrice: 48000,
    sku: "SMW-Z78-AMOLED",
    colour: "Rose Gold / Black / Orange",
    stock: "in_stock",
    stockDetail: "Multiple strap colors included",
    badge: "Popular",
    images: [
      {
        src: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80",
        alt: "Z78 Ultra AMOLED smartwatch front display",
      },
      {
        src: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
        alt: "Smartwatch on wrist fitness tracking",
      },
      {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        alt: "Smartwatch side buttons and dial detail",
      },
      {
        src: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1200&q=80",
        alt: "Smartwatch straps and wireless charging cradle",
      },
    ],
    description:
      "Vibrant 1.52-inch AMOLED display with high refresh rate, wireless magnetic fast charging, real-time heart rate & blood oxygen tracking, and HD microphone for wrist calls.",
    details: [
      "1.52-inch HD AMOLED Display with Always-On Mode",
      "Bluetooth 5.3 Calling & Instant App Notifications",
      "Heart Rate, SpO2, Sleep & Step Fitness Tracking",
      "IP68 Water and Sweat Resistance",
      "Up to 7 Days Battery Life per Single Charge",
      "Compatible with Android 5.0+ and iOS 10.0+",
    ],
    care: "Wipe sensor base after workouts. Water-resistant for rain and hand-washing; do not submerge in hot water or steam.",
  },
  {
    slug: "b200-ai-smart-glasses-1080p-sony",
    name: "B200 AI Smart Glasses | 1080P Sony Camera Lens | Open-Ear Stereo Audio",
    category: "Smart Gadgets",
    price: 68000,
    compareAtPrice: 85000,
    sku: "SGL-B200-AI",
    colour: "Tortoise Shell / Onyx Black",
    stock: "in_stock",
    stockDetail: "Instant photo/video capture",
    badge: "New AI",
    images: [
      {
        src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
        alt: "B200 AI Smart Audio Video Glasses front frame",
      },
      {
        src: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
        alt: "AI smart glasses worn with camera lens visible",
      },
      {
        src: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80",
        alt: "AI smart glasses side audio temples and speaker vents",
      },
      {
        src: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
        alt: "AI smart glasses folded inside charging case",
      },
    ],
    description:
      "Capture hands-free 1080P POV video, take instant snapshots with built-in Sony sensor, and listen to podcasts or take phone calls with private directional bone-conduction audio.",
    details: [
      "Integrated 1080P Full HD Sony Sensor Camera",
      "Dual Open-Ear Directional Stereo Speakers",
      "Noise-Cancelling Microphone for Clear Calls",
      "Touch-Sensitive Temple Controls",
      "UV400 Anti-Blue Light Protective Lenses",
      "Magnetic Quick Charging (2 hours full charge)",
    ],
    care: "Charge with included magnetic cable. Clean lenses only with optical cloth provided.",
  },
  {
    slug: "aimb-51-ai-smart-glasses-hd-audio",
    name: "AIMB-51 AI Smart Glasses | HD Camera | AI Voice Assistant | Bluetooth 5.2",
    category: "Smart Gadgets",
    price: 62000,
    sku: "SGL-AIMB-51",
    colour: "Matte Black",
    stock: "in_stock",
    stockDetail: "Voice command integration",
    badge: "Smart Wearable",
    images: [
      {
        src: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
        alt: "AIMB-51 AI smart glasses with dark lenses and smart audio temples",
      },
      {
        src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
        alt: "AIMB-51 frames front profile",
      },
      {
        src: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80",
        alt: "AIMB-51 smart glasses touch controls",
      },
      {
        src: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
        alt: "AIMB-51 glasses accessories and charging cord",
      },
    ],
    description:
      "Sleek modern spectacle frames loaded with smart audio temples, AI voice assistant triggers, and crystal audio playback for hands-free driving and outdoor audio.",
    details: [
      "AI Voice Assistant Integration (Siri / Google Assistant)",
      "High Definition Directional Sound Chambers",
      "Ultra-Lightweight 38g Ergonomic Frame",
      "Polarized Anti-Glare Lens Coating",
      "Water-Resistant IPX4 Nano Coating",
    ],
    care: "Do not rinse under pressurized taps. Store in protective hardshell case when not in use.",
  },

  // --- ACCESSORIES ---
  {
    slug: "aeroguard-pro-16-laptop-backpack",
    name: "AeroGuard Pro 16 Premium Water-Resistant USB Charging Business Laptop Backpack",
    category: "Accessories",
    price: 34500,
    compareAtPrice: 48000,
    sku: "ACC-AER-16-BP",
    colour: "Obsidian Black",
    stock: "in_stock",
    stockDetail: "Ready to ship in 24 hours",
    badge: "Featured Product",
    images: [
      {
        src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
        alt: "AeroGuard Pro 16 Premium Laptop Backpack full frontal packshot",
      },
      {
        src: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
        alt: "AeroGuard Pro Tech Backpack compartments and organized laptop sleeve",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "AeroGuard Pro Tech Backpack side USB charging port in use",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        alt: "AeroGuard Pro Backpack breathable back padding and luggage strap",
      },
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
        alt: "AeroGuard Pro Backpack waterproof fabric water repellent demo",
      },
    ],
    description:
      "Engineered for tech commuters and executive travel. Crafted with dense water-repellent ballistic fabric, shock-absorbent 16-inch laptop chamber, anti-theft hidden pocket, and external USB-A/USB-C pass-through charging port.",
    details: [
      "Custom Padded Shockproof Compartment fits up to 16.2 inch Laptops",
      "Water-Resistant High-Density 900D Oxford Fabric",
      "External Quick-Access USB Charging Port with Internal Powerbank Cable",
      "Ergonomic Breathable Honeycomb Mesh Back Padding & S-Curve Shoulder Straps",
      "Luggage Strap for Seamless Airport Trolley Mounting",
      "Anti-Theft Hidden Back Pocket for Passports and Wallets",
      "128 Days Quality Guarantee",
    ],
    care: "Wipe with damp cloth and mild detergent. Air dry completely away from direct radiator heat.",
  },
  {
    slug: "anoralite-thunderbolt-12-in-1-docking-station",
    name: "Anoralite Pro 12-in-1 Dual 4K Thunderbolt USB-C Docking Station 100W PD",
    category: "Accessories",
    price: 45000,
    compareAtPrice: 58000,
    sku: "ACC-DCK-12IN1",
    colour: "Space Gray",
    stock: "in_stock",
    badge: "Essential Desk Gear",
    images: [
      {
        src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
        alt: "USB-C Aluminum Docking Station front ports",
      },
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "USB-C Dock connected to dual monitors",
      },
      {
        src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        alt: "USB-C Dock rear Gigabit ethernet and dual HDMI ports",
      },
      {
        src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
        alt: "USB-C Dock heat dissipation metal finish",
      },
    ],
    description:
      "Transform any laptop into a powerhouse desktop workstation with a single USB-C cable. Drives two 4K 60Hz displays, Gigabit Ethernet, SD card reader, and 100W Power Delivery charging.",
    details: [
      "Dual 4K HDMI Outputs (Support Extended Desktop)",
      "100W USB-C Power Delivery Pass-Through",
      "1000Mbps Gigabit RJ45 Ethernet Port",
      "3 × USB 3.0 (5Gbps) + 1 × USB-C Data Port",
      "SD & TF MicroSD Card Slots",
      "CNC Aluminum Alloy Housing with Passive Heat Dissipation",
    ],
    care: "Ensure connected charger supports 65W or higher for full peripheral bus-powering.",
  },
];

async function seed() {
  console.log("Clearing catalogue tables...");
  await db.batch([
    db.delete(productImages),
    db.delete(products),
    db.delete(categories),
  ]);

  console.log(`Inserting ${seedCategories.length} categories...`);
  const insertedCategories = await db
    .insert(categories)
    .values(seedCategories)
    .returning({ id: categories.id, slug: categories.slug });

  const categoryIdBySlug = new Map(
    insertedCategories.map((row) => [row.slug, row.id]),
  );

  console.log(`Inserting ${catalog.length} computer gadgets and accessories...`);
  const BASE_DATE = new Date("2026-10-01T12:00:00Z");
  const DAY = 24 * 60 * 60 * 1000;

  const productRows = catalog.map((product, i) => {
    const categorySlug = categorySlugByName[product.category];
    const categoryId = categorySlug && categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      throw new Error(`No category ID found for "${product.category}"`);
    }

    const stock = stockLevels[product.stock];

    return {
      categoryId,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      colour: product.colour,
      priceCents: Math.round(product.price * 100),
      compareAtCents:
        product.compareAtPrice === undefined
          ? null
          : Math.round(product.compareAtPrice * 100),
      badge: product.badge ?? null,
      description: product.description,
      details: product.details,
      care: product.care,
      stockQuantity: stock.stockQuantity,
      madeToOrder: stock.madeToOrder,
      stockDetail: product.stockDetail ?? null,
      createdAt: new Date(BASE_DATE.getTime() - i * DAY),
    };
  });

  const insertedProducts = await db
    .insert(products)
    .values(productRows)
    .returning({ id: products.id, slug: products.slug });

  const productIdBySlug = new Map(
    insertedProducts.map((row) => [row.slug, row.id]),
  );

  const imageRows = catalog.flatMap((product) =>
    product.images.map((image, position) => ({
      productId: productIdBySlug.get(product.slug)!,
      url: image.src,
      alt: image.alt,
      position,
    })),
  );

  console.log(`Inserting ${imageRows.length} product images across all products...`);
  await db.insert(productImages).values(imageRows);

  console.log("Database seeded successfully with rich multi-image gallery!");
}

seed().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
