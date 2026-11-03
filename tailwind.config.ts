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
        glass: {
          bg: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.18)",
          highlight: "rgba(255,255,255,0.45)",
        },
        accent: {
          cyan: "#00F0FF",
          cyanDim: "rgba(0,240,255,0.35)",
        },
        midnight: {
          950: "#020408",
          900: "#0A0F1D",
          800: "#111827",
        },
      },
      backdropBlur: {
        glass: "36px",
      },
      boxShadow: {
        glass: "0 16px 40px -4px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)",
        "glass-inset": "inset 0 1px 0 rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
