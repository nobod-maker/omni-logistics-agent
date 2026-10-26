import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        "surface-dark": "#0A0F1D",
        "surface-border": "#334155",
        "neon-cyan": "#06B6D4",
        "warning-amber": "#F59E0B",
        "clear-emerald": "#10B981",
        "alert-red": "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "cyan-glow": "0 0 15px -3px rgba(6, 182, 212, 0.3)",
        "amber-glow": "0 0 15px -3px rgba(245, 158, 11, 0.3)",
        "emerald-glow": "0 0 15px -3px rgba(16, 185, 129, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
