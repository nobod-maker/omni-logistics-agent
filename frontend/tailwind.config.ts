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
        // --- Raycast Midnight Command Center Tokens ---
        "void-black": "#040506",
        ink: "#07080a",
        obsidian: "#111214",
        graphite: "#1b1c1e",
        smoke: "#6a6b6c",
        ash: "#9c9c9d",
        mist: "#e6e6e6",
        iron: "#454647",
        "slate-raycast": "#2f3031",
        "pure-white": "#ffffff",
        "coral-pulse": "#ff6363",
        "ember-hush": "#452324",
        hairline: "#363739",

        // --- Semantic Surface Mappings ---
        background: "#040506",
        surface: "#111214",
        "surface-dark": "#07080a",
        "surface-border": "#1b1c1e",

        // --- Backward Compatibility Color Tokens ---
        "neon-cyan": "#06B6D4",
        "warning-amber": "#F59E0B",
        "clear-emerald": "#10B981",
        "alert-red": "#EF4444",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "'Geist Mono'",
          "GeistMono",
          "var(--font-jetbrains)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "raycast-hero": [
          "56px",
          {
            lineHeight: "1.08",
            letterSpacing: "0.22px",
            fontWeight: "400",
          },
        ],
        "raycast-title": [
          "32px",
          {
            lineHeight: "1.15",
            letterSpacing: "0.22px",
            fontWeight: "400",
          },
        ],
        "raycast-h2": [
          "24px",
          {
            lineHeight: "1.2",
            letterSpacing: "0.15px",
            fontWeight: "500",
          },
        ],
      },
      letterSpacing: {
        raycast: "0.22px",
      },
      boxShadow: {
        key: "rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset",
        "key-hover": "rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.35) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px -1px 0px 0px inset",
        "key-card": "rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.12) 0px 0px 0px 1px, 0 10px 30px -10px rgba(0,0,0,0.8)",
        "coral-glow": "0 0 15px -3px rgba(255, 99, 99, 0.35)",
        "cyan-glow": "0 0 15px -3px rgba(6, 182, 212, 0.3)",
        "amber-glow": "0 0 15px -3px rgba(245, 158, 11, 0.3)",
        "emerald-glow": "0 0 15px -3px rgba(16, 185, 129, 0.3)",
      },
      backdropBlur: {
        "48": "48px",
      },
    },
  },
  plugins: [],
};
export default config;
