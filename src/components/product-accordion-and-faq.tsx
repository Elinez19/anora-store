"use client";

import { useState } from "react";

type ProductAccordionAndFaqProps = {
  productName: string;
};

export function ProductAccordionAndFaq({ productName }: ProductAccordionAndFaqProps) {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    condition: true, // open by default as in screenshot
  });

  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const accordionItems = [
    {
      id: "overview",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Overview",
      content:
        "The EliteBook series delivers enterprise-tier durability, ultra-responsive security, and exceptional performance for mobile executives and power users. Designed with an ultralight diamond-cut aluminum unibody.",
    },
    {
      id: "key-features",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Key Features",
      content:
        "Bang & Olufsen tuned audio, spill-resistant backlit keyboard, integrated privacy camera shutter, fast battery charging (up to 50% in 30 minutes), and military-grade MIL-STD 810H durability.",
    },
    {
      id: "performance",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Performance",
      content:
        "Powered by multi-core processors with hyper-threading and intelligent dynamic thermal management to maintain high clock speeds without thermal throttling.",
    },
    {
      id: "graphics-performance",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Graphics Performance",
      content:
        "Intel UHD / Iris Plus graphics capable of smooth 4K external display output over HDMI 2.0 or Thunderbolt 3 USB-C with full hardware decode acceleration.",
    },
    {
      id: "display",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
      title: "Display",
      content:
        "14.0-inch diagonal Full HD IPS anti-glare display with ultra-narrow micro-edge bezels, 400 nits high brightness, and wide viewing angles.",
    },
    {
      id: "audio-collaboration",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
      title: "Audio & Collaboration",
      content:
        "Audio by Bang & Olufsen with 3 multi-array microphones, dual top-firing stereo speakers, and AI-driven background noise cancellation for crisp Zoom/Teams meetings.",
    },
    {
      id: "build-quality",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Build Quality & Design",
      content:
        "Precision-machined all-aluminum unibody that resists flex, fingerprints, and daily scuffs. Under 1.35kg for effortless all-day portability.",
    },
    {
      id: "connectivity",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Connectivity",
      content:
        "Intel Wi-Fi 6 (Gig+) AX201, Bluetooth 5.0, 2 × USB 3.1 Gen 1, 2 × Thunderbolt 3 (USB-C), 1 × HDMI 2.0, and 1 × Headphone/Microphone combo jack.",
    },
    {
      id: "security",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Security & Management Features",
      content:
        "Hardware-enforced HP Sure Start self-healing BIOS, TPM 2.0 security chip, Windows Hello biometric fingerprint reader, and physical webcam shutter switch.",
    },
    {
      id: "perfect-for",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Perfect For",
      content:
        "Software engineers, corporate executives, finance professionals, university students, and remote workers who need reliable performance on the go.",
    },
    {
      id: "technical-specifications",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Technical Specifications",
      content:
        "Processor: Intel Core 10th Gen | RAM: Up to 64GB DDR4 Dual-Channel | Storage: NVMe PCIe SSD | Battery: 53Wh Long-Life 3-cell Li-ion | Weight: 1.33kg (2.95 lbs).",
    },
    {
      id: "condition",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Condition",
      isCondition: true,
      content: "",
    },
    {
      id: "warranty",
      icon: (
        <svg className="size-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Warranty & After-Sales",
      content:
        "Comes with 128 Days Certified Hardware Warranty with free replacement or repair service for verified internal hardware faults. Free lifetime driver diagnostics.",
    },
  ];

  const faqs = [
    {
      q: "Will my order be delivered to my doorstep?",
      a: "Yes! We offer fully tracked nationwide doorstep delivery across Nigeria within 1–3 business days.",
    },
    {
      q: "When will my order be shipped?",
      a: "All orders placed before 2:00 PM are dispatched the same day. Orders placed afterwards are shipped next business morning.",
    },
    {
      q: "What is the expected delivery timeframe for my order?",
      a: "Lagos deliveries: 24–48 hours. Other states: 2–3 business days with direct SMS & WhatsApp tracking updates.",
    },
    {
      q: "How do I track my order?",
      a: "Once dispatched, you receive a direct tracking code and courier link via email and SMS.",
    },
    {
      q: "How do I request an upgrade?",
      a: "You can select your preferred RAM and Storage directly from the 'Configure Your Device' dropdown above before adding to cart, or contact us immediately after ordering.",
    },
    {
      q: "Can I upgrade later?",
      a: "Yes! EliteBooks and workstations feature accessible SO-DIMM RAM slots and standard M.2 NVMe SSD bays for easy future upgrades.",
    },
    {
      q: "Do warranties apply to used products?",
      a: "Yes! Every certified pre-owned laptop and desktop undergoes thorough 32-point hardware benchmarking and carries a 128 Days Full Hardware Warranty.",
    },
    {
      q: "Do your Windows PCs come with a Windows license?",
      a: "Yes. All machines come with genuine digital Windows 11 Pro / Windows 10 Pro licenses activated directly in the motherboard BIOS.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day return policy for any technical faults, and 128 days hardware warranty service for complete peace of mind.",
    },
  ];

  return (
    <div className="container-page py-10 lg:py-16 border-t border-neutral-200">
      {/* 1. TOP SPLIT: Accordion On Left + What's in the Box On Right */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left: Comprehensive Specs Accordion (12 items) */}
        <div className="lg:col-span-8 space-y-2">
          {accordionItems.map((item) => {
            const isOpen = openSections[item.id];
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(item.id)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm">{item.title}</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-base">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="border-t border-neutral-100 bg-neutral-50/50 p-4 pt-3 text-xs text-neutral-600 leading-relaxed">
                    {item.isCondition ? (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-neutral-900">
                          Professionally Tested &amp; Ready to Use
                        </h4>
                        <ul className="space-y-1.5 text-neutral-600">
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>Premium Pre-Owned</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>Minimal cosmetic wear on key touch areas</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>Grade-A appearance</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>Screen in pristine condition</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>May show minor signs of previous handling</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-neutral-400">•</span>
                            <span>Ready for immediate use</span>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <p>{item.content}</p>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Right: What's in the Box Floating Card (Matching Screenshot) */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            {/* Top Hanging Hook Graphic */}
            <div className="mx-auto -mt-6 mb-4 flex h-7 w-20 items-center justify-center rounded-b-xl bg-neutral-950 text-white">
              <div className="h-2 w-9 rounded-full border border-neutral-700 bg-neutral-800"></div>
            </div>

            <h3 className="text-center text-sm font-bold tracking-tight text-neutral-900">
              What&apos;s in the Box
            </h3>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {/* Item 1: Laptop */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 text-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-white shadow-xs">
                  <svg className="size-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-neutral-900 leading-tight">
                  Certified Pre-Owned Laptop
                </span>
              </div>

              {/* Item 2: Fast Charger */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 text-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-white shadow-xs">
                  <svg className="size-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-neutral-900 leading-tight">
                  Fast Charger with Cord
                </span>
              </div>
            </div>

            {/* Item 3: Brown Box */}
            <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 text-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-white shadow-xs">
                <svg className="size-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 leading-tight">
                Secure Padded Shipping Carton
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT BANNER (Free Shipping) */}
      <div className="my-14 overflow-hidden rounded-2xl bg-neutral-900 py-10 px-8 text-white relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Limited Time Tech Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Free Nationwide Shipping on Orders Over ₦200,000
            </h3>
            <p className="text-xs text-neutral-400">
              Fast, insured dispatch with live tracking straight to your door across all states.
            </p>
          </div>
          <a
            href="#faqs-section"
            className="rounded-md bg-white px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-neutral-100 transition-colors shrink-0"
          >
            Learn More
          </a>
        </div>
        {/* Subtle background graphic */}
        <div className="absolute -right-10 -bottom-10 select-none text-neutral-800/40 text-8xl font-black pointer-events-none">
          FREE
        </div>
      </div>

      {/* 3. DARK FAQs + CONTACT SUPPORT FORM SPLIT (Matching Screenshot) */}
      <div id="faqs-section" className="overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl">
        <div className="grid lg:grid-cols-12">
          {/* Left: FAQs Accordion (col-span-7) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:border-r border-neutral-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                FAQs
              </h3>
              <span className="text-[11px] text-neutral-400">
                Please read our FAQs to find out more.
              </span>
            </div>

            <div className="space-y-1 border-t border-neutral-800 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqs[idx];
                return (
                  <div key={faq.q} className="border-b border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className="text-neutral-500 font-mono text-base shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen ? (
                      <p className="pb-3.5 text-xs text-neutral-400 leading-relaxed">
                        {faq.a}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: "Didn't find your answer?" Contact Box (col-span-5) */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-neutral-900/60">
            <div>
              <h4 className="text-lg font-bold text-white">
                Didn&apos;t find your answer?
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Don&apos;t hesitate to contact us.
              </p>

              {/* Customer Care Avatars */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  <div className="size-7 rounded-full bg-emerald-600 border border-neutral-900 flex items-center justify-center text-[10px] font-bold">
                    SA
                  </div>
                  <div className="size-7 rounded-full bg-rose-600 border border-neutral-900 flex items-center justify-center text-[10px] font-bold">
                    EO
                  </div>
                  <div className="size-7 rounded-full bg-blue-600 border border-neutral-900 flex items-center justify-center text-[10px] font-bold">
                    AN
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Support team online
                </span>
              </div>

              {/* Quick Contact Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! Our technical support specialist will reply shortly.");
                }}
                className="mt-6 space-y-3"
              >
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Message"
                    defaultValue={`Hello, I have an inquiry about ${productName}.`}
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
