import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Support & Customer Inquiries | Anoraa Tech Store",
  description:
    "Get in touch with Anoraa's hardware specialists. Fast support for orders, warranty claims, technical specifications, and corporate procurement.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-[80vh]">
        {/* Breadcrumb / Top Banner */}
        <div className="border-b border-neutral-200 bg-neutral-50/50">
          <div className="container-page py-3 text-2xs text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Customer Support</span>
          </div>
        </div>

        {/* Support Hero */}
        <section className="container-page pt-10 pb-8 sm:pt-14 sm:pb-12 text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-2xs uppercase tracking-widest font-mono font-bold bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200 mb-4">
            Anoraa Concierge & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Hardware Assistance & Care
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Have a question about your order, technical specifications, or warranty?
            Our hardware engineers and customer specialists respond within 12 hours.
          </p>
        </section>

        {/* Fast Action Cards */}
        <section className="container-page pb-12">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-gloss p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="size-8 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Track Your Order
                </h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  View fulfillment status, tracking IDs, and itemized receipts directly from your customer account.
                </p>
              </div>
              <Link
                href="/account"
                className="mt-4 text-xs font-semibold text-neutral-950 hover:underline inline-flex items-center gap-1"
              >
                <span>Go to Account</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="card-gloss p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="size-8 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h3 className="text-sm font-bold text-neutral-950">
                  128-Day Tech Warranty
                </h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Every laptop, desktop, and smart accessory is backed by certified hardware coverage and repair support.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                <span>Certified Grade-A Guarantee</span>
              </span>
            </div>

            <div className="card-gloss p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="size-8 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Corporate & Bulk Orders
                </h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Outfit your studio or tech team with bulk laptop workstations and customized accessory packages.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-neutral-950 inline-flex items-center gap-1">
                <span>Select &apos;Corporate&apos; in form</span>
              </span>
            </div>
          </div>
        </section>

        {/* Main Form & Inquiries Grid */}
        <section className="container-page pb-20">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Form Section */}
            <div className="lg:col-span-7 card-gloss p-6 sm:p-10 rounded-2xl">
              <h2 className="text-lg font-bold text-neutral-950 mb-1">
                Send a Message
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Fill in the details below and we&apos;ll route your request to the right department.
              </p>

              <ContactForm />
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-gloss p-6 sm:p-8 rounded-2xl">
                <h3 className="text-sm font-bold text-neutral-950">
                  Direct Inquiries
                </h3>
                <ul className="mt-4 space-y-4 text-xs text-neutral-600">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-neutral-900 w-24 shrink-0">
                      Support Email:
                    </span>
                    <a
                      href="mailto:support@anoraastore.com"
                      className="text-neutral-950 font-mono underline hover:text-neutral-700"
                    >
                      support@anoraastore.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-neutral-900 w-24 shrink-0">
                      Response Time:
                    </span>
                    <span>Typically under 12 hours (24/7 ticket routing)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-neutral-900 w-24 shrink-0">
                      Hours:
                    </span>
                    <span>Monday &ndash; Saturday, 8:00 AM &ndash; 8:00 PM WAT</span>
                  </li>
                </ul>
              </div>

              <div className="card-gloss p-6 sm:p-8 rounded-2xl border-l-4 border-l-neutral-950">
                <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                  Email Integration Note
                </h4>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  All messages sent through this form generate verified Resend notifications and provide real-time updates directly to your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
