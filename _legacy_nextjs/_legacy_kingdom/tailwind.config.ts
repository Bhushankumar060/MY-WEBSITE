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
        gold: {
          light: '#FFE55C',
          DEFAULT: '#D4AF37',
          dark: '#AA8C2C',
        },
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
        }
      }
    },
  },
  plugins: [],
};
export default config;
