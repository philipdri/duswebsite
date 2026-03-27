import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dus-bg': '#f7f4f0',
        'dus-dark': '#171717',
        'dus-text': '#000000',
        'dus-muted': '#737373',
        'dus-border': '#666669',
      },
      fontFamily: {
        'classico': ['"classico-urw"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
