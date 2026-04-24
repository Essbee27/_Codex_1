import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          black: "#0f0f10",
          slate: "#1f2937",
          gray: "#6b7280"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(249, 115, 22, 0.25), 0 8px 24px rgba(15, 15, 16, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
