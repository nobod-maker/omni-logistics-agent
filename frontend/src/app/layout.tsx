import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0F172A] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
