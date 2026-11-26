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
        brand: {
          bg: "#0F1115",
          card: "#1A1D24",
          "card-hover": "#222630",
          border: "#2C313C",
          amber: "#E58A2B",
          "amber-hover": "#F3A145",
          text: "#FFFFFF",
          muted: "#9EA5B4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
