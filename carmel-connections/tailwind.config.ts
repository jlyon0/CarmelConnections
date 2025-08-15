import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // optional if you have /pages
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // bright blue
        secondary: "#F97316", // bright orange
      },
    },
  },
  plugins: [],
};
export default config;
