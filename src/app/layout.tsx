import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* Display voice: modern, geometric, clean typography for tech brand */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/* Interface voice: high-clarity sans for specs, nav, prices, buttons */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Anoralite | Premium Computer Gadgets & Accessories",
    template: "%s | Anoralite",
  },
  description:
    "Explore high-performance laptops, desktop workstations, AI smart glasses, smartwatches, and premium tech accessories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-paper text-graphite flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
