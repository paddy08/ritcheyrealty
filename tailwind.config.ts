import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Quiet-luxury warm neutral palette
        cream: {
          DEFAULT: "#F7F3EC", // page background
          deep: "#EFE9DE", // subtle section contrast
        },
        charcoal: {
          DEFAULT: "#2B2A26", // primary text / dark sections
          soft: "#4A4741", // secondary text
          muted: "#7C776E", // tertiary / captions
        },
        sage: {
          DEFAULT: "#8A8A6B", // primary accent (soft olive)
          deep: "#6E6E52", // hover / emphasis
          pale: "#DDDCCB", // tinted backgrounds
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.18em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
