import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Omni-Logistics Master Agent | Autonomous Control Tower",
  description: "Unifying Terminal Workflows, Customs Pre-Clearance, Proactive Disruption Routing, and Real-Time Margin Optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-[#040506] text-[#e6e6e6] antialiased selection:bg-[#ff6363] selection:text-[#040506] font-sans">
        {children}
      </body>
    </html>
  );
}
