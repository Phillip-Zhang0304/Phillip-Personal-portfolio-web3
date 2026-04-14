import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        panel: "#0A1020",
        line: "rgba(255,255,255,0.1)",
        cyan: "#69E2FF",
        mint: "#8DFFC4",
        steel: "#90A8C5"
      },
      fontFamily: {
        sans: ["var(--font-aeonik)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(105, 226, 255, 0.18), 0 24px 80px rgba(38, 96, 191, 0.22)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
