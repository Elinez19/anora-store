"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type Bag } from "@/lib/cart-types";
import { formatCents } from "@/lib/format";
import { createBachsCheckoutSession } from "@/lib/checkout";

interface CheckoutViewProps {
  bag: Bag;
  userEmail?: string;
  userName?: string;
}

export function ModernCheckoutView({
  bag,
  userEmail = "",
  userName = "",
}: CheckoutViewProps) {
  // Delivery mode: "ship" | "pickup"
  const [deliveryMode, setDeliveryMode] = useState<"ship" | "pickup">("ship");

  // Contact info
  const [contact, setContact] = useState(userEmail || "");
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Shipping details
  const [country, setCountry] = useState("Nigeria");
  const [firstName, setFirstName] = useState(userName.split(" ")[0] || "");
  const [lastName, setLastName] = useState(userName.split(" ").slice(1).join(" ") || "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  // Billing address selection
  const [billingSame, setBillingSame] = useState(true);

  // Discount code
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState("");

  // Submitting & payment error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;
    const code = discountCode.trim().toUpperCase();
    if (code === "SAVE10" || code === "ANORA10") {
      setAppliedDiscount(Math.round(bag.subtotalCents * 0.1));
      setDiscountError("");
    } else {
      setDiscountError("Enter a valid discount code");
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsSubmitting(true);

    try {
      const res = await createBachsCheckoutSession({
        email: contact,
        name: `${firstName} ${lastName}`.trim() || undefined,
        phone: phone || undefined,
        deliveryMode,
        country,
        address: apartment ? `${address}, ${apartment}` : address,
        city,
        state,
        postalCode: postalCode || undefined,
        discountCode: appliedDiscount ? discountCode : undefined,
      });

      if (res.error) {
        setPaymentError(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res.url) {
        window.location.href = res.url;
        return;
      }

      setPaymentError("Could not connect to payment gateway. Please try again.");
      setIsSubmitting(false);
    } catch (err: unknown) {
      console.error("Payment initiation error:", err);
      setPaymentError("An unexpected error occurred while initiating payment.");
      setIsSubmitting(false);
    }
  };

  const shippingCostCents = 0; // FREE
  const discountCents = appliedDiscount ?? 0;
  const totalCents = Math.max(0, bag.subtotalCents - discountCents + shippingCostCents);
  const totalSavingsCents = (discountCents > 0 ? discountCents : 800000); // ₦8,000 promo discount default demo

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Top Brand Logo */}
            <div className="pb-4">
              <Link href="/" className="inline-block">
                <span className="font-serif italic font-bold text-2xl tracking-tight text-neutral-900">
                  Shopinverse
                </span>
              </Link>
            </div>

            <form onSubmit={handlePayNow} className="space-y-8">
              {/* 1. Contact Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-900">Contact</h2>
                  {!userEmail && (
                    <Link href="/sign-in" className="text-xs text-neutral-600 hover:text-black underline">
                      Sign in
                    </Link>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Email or mobile phone number"
                    className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <div className="absolute right-3 top-3 text-neutral-400">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                    className="rounded text-neutral-900 focus:ring-neutral-900 size-4"
                  />
                  <span>Email me with order updates</span>
                </label>
              </div>

              {/* 2. Delivery Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-neutral-900">Delivery</h2>

                {/* Ship vs Pickup Pill Toggle */}
                <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg max-w-md">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("ship")}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      deliveryMode === "ship"
                        ? "bg-white text-neutral-950 shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Ship</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode("pickup")}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      deliveryMode === "pickup"
                        ? "bg-white text-neutral-950 shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Pickup</span>
                  </button>
                </div>

                {deliveryMode === "ship" ? (
                  /* Ship Address Form Fields */
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Country/Region</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />

                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Federal Capital T...</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Delta">Delta</option>
                      </select>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code (optional)"
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full text-xs sm:text-sm border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <div className="absolute right-3 top-3 text-neutral-400">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                        <input
                          type="checkbox"
                          checked={saveInfo}
                          onChange={(e) => setSaveInfo(e.target.checked)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 size-4"
                        />
                        <span>Save this information for next time</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                        <input
                          type="checkbox"
                          checked={whatsappUpdates}
                          onChange={(e) => setWhatsappUpdates(e.target.checked)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 size-4"
                        />
                        <span>Get order updates on WhatsApp</span>
                      </label>
                    </div>

                    {/* Shipping method badge */}
                    <div className="pt-4 space-y-2">
                      <h3 className="text-sm font-bold text-neutral-900">Shipping method</h3>
                      <div className="flex items-center justify-between p-3.5 border-2 border-indigo-100 bg-indigo-50/20 rounded-lg">
                        <span className="text-xs font-semibold text-neutral-900">Standard Shipping</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 line-through">₦8,000.00</span>
                          <span className="text-xs font-bold text-neutral-900">FREE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Pickup Location Card */
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>There is 1 location with your items</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                        <svg className="size-3.5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Nigeria
                      </span>
                    </div>

                    <div className="p-4 border-2 border-neutral-300 rounded-lg bg-neutral-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-neutral-900">Maryland Mall</h4>
                        <span className="text-xs font-bold text-neutral-900">FREE</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        No. 350-360 Ikorodu Road, Idi-iroko Bus Stop, Maryland LA
                      </p>
                      <p className="text-[11px] text-neutral-500 pt-1 flex items-center gap-1">
                        <svg className="size-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Usually ready in 2-4 days
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Payment Section */}
              <div className="space-y-3 pt-2">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Payment</h2>
                  <p className="text-xs text-neutral-500">All transactions are secure and encrypted.</p>
                </div>

                <div className="border border-neutral-300 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border-b border-neutral-200">
                    <span className="text-xs font-bold text-neutral-900">Paystack</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px]">MC</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px]">VISA</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-neutral-900 font-bold text-[9px]">VERVE</span>
                      <span className="text-[10px] text-neutral-500">+5</span>
                    </div>
                  </div>
                  <div className="p-6 text-center text-xs text-neutral-600 bg-neutral-50/30">
                    You&apos;ll be redirected to Paystack to complete your purchase
                  </div>
                </div>
              </div>

              {/* 4. Billing Address Section */}
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-bold text-neutral-900">Billing address</h2>
                
                <div className="border border-neutral-300 rounded-lg overflow-hidden divide-y divide-neutral-200">
                  <label className="flex items-center gap-3 p-3.5 cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="billingOption"
                      checked={billingSame}
                      onChange={() => setBillingSame(true)}
                      className="size-4 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-xs font-semibold text-neutral-900">Same as shipping address</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="billingOption"
                      checked={!billingSame}
                      onChange={() => setBillingSame(false)}
                      className="size-4 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-xs font-semibold text-neutral-900">Use a different billing address</span>
                  </label>
                </div>

                {!billingSame && (
                  <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 mt-2">
                    <input
                      type="text"
                      placeholder="Billing Name"
                      className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 text-neutral-900 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Billing Address"
                      className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 text-neutral-900 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Pay Now Button & Error Display */}
              <div className="pt-4 space-y-3">
                {paymentError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700 flex items-center gap-2">
                    <svg className="size-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{paymentError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || bag.lines.length === 0}
                  className="w-full py-4 px-6 rounded-lg bg-indigo-950 hover:bg-black text-white text-sm font-bold tracking-wide transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Taking you to secure payment…" : "Pay now"}
                </button>
              </div>

              {/* Bottom Policy Links */}
              <div className="pt-6 border-t border-neutral-200 flex flex-wrap gap-4 text-xs text-neutral-600">
                <Link href="#" className="hover:underline">Refund policy</Link>
                <Link href="#" className="hover:underline">Shipping</Link>
                <Link href="#" className="hover:underline">Privacy policy</Link>
                <Link href="#" className="hover:underline">Terms of service</Link>
                <Link href="#" className="hover:underline">Cancellations</Link>
                <Link href="#" className="hover:underline">Contact</Link>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-neutral-50/70 p-6 sm:p-8 rounded-xl border border-neutral-200 lg:sticky lg:top-8 h-fit space-y-6">
            {/* Bag Lines */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1 divide-y divide-neutral-200">
              {bag.lines.map((line) => (
                <div key={line.productId} className="flex items-center gap-4 pt-4 first:pt-0">
                  <div className="relative size-16 shrink-0 rounded-lg border border-neutral-200 bg-white overflow-hidden flex items-center justify-center">
                    {line.image ? (
                      <Image
                        src={line.image.src}
                        alt={line.image.alt || line.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-mono">IMG</span>
                    )}
                    {/* Quantity Badge */}
                    <span className="absolute -top-1 -right-1 size-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                      {line.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 line-clamp-2">
                      {line.name}
                    </p>
                    {line.colour && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">{line.colour}</p>
                    )}
                  </div>

                  <div className="text-right">
                    {line.lineTotalCents === 0 ? (
                      <span className="text-xs font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="text-xs font-bold text-neutral-900">
                        {formatCents(line.lineTotalCents)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <form onSubmit={handleApplyDiscount} className="flex gap-2 pt-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code or gift card"
                className="flex-1 text-xs border border-neutral-300 rounded-lg px-3 py-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {discountError && <p className="text-xs text-rose-600">{discountError}</p>}
            {appliedDiscount !== null && (
              <p className="text-xs text-emerald-700 font-medium">
                Discount applied: -{formatCents(appliedDiscount)}
              </p>
            )}

            {/* Summary Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal · {bag.itemCount} items</span>
                <span className="font-semibold text-neutral-900">{formatCents(bag.subtotalCents)}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  Shipping
                  <svg className="size-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="font-bold text-neutral-900">FREE</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCents(appliedDiscount)}</span>
                </div>
              )}

              {/* Total Savings Pill */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium pt-1">
                <svg className="size-3.5 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="uppercase text-[11px] font-bold tracking-wide">
                  Total Savings {formatCents(totalSavingsCents)}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between pt-4 border-t border-neutral-300">
                <div>
                  <span className="text-base font-bold text-neutral-900">Total</span>
                  <span className="text-[11px] text-neutral-500 ml-1.5">NGN</span>
                </div>
                <span className="text-2xl font-black text-neutral-950 tracking-tight">
                  {formatCents(totalCents)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
