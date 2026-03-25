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
        dark: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
        },
        sovereign: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        }
      }
    },
  },
  plugins: [],
};
export default config;
