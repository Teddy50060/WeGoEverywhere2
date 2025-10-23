import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'karla': ['Karla', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'urbanist': ['Urbanist', 'sans-serif'],
        'sf-pro': ['SF Pro Display', 'sans-serif'],
      },
      colors: {
        'figma-orange': '#EB6223',
        'figma-cream': '#FFFBF0',
        'figma-peach': '#FEC494',
        'figma-yellow': '#FFF3D2',
        'figma-blue': '#D4DDFF',
        'figma-gray': '#D4CDCD',
        'figma-pink-light': '#FFDCD5',
        'figma-pink': '#E88F8F',
      },
    },
  },
  plugins: [],
};

export default config;
