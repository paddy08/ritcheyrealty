import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette derived from the Ritchey Realty mark (gold) and from North
        // Texas ground: limestone, bluebonnet, brass. Matte throughout — the
        // brass is a pigment, never a gradient.
        limestone: {
          DEFAULT: "#E8E4DA", // page background — Texas limestone, gray-warm
          deep: "#DCD7CB", // section contrast / rules
          pale: "#F2EFE8", // raised paper (cards, panels)
        },
        ink: {
          DEFAULT: "#1B2437", // primary text / dark field — bluebonnet-deep
          soft: "#3D4759", // secondary text
          muted: "#565F72", // tertiary / captions — held at 4.5:1 on limestone
        },
        // Sampled from public/logo.webp: the mark's gold runs #FFF983 (highlight)
        // → #FAE35E (mid) → #AA8A36 (metallic shadow), all at hue ~50°. The ramp
        // below holds that hue and varies only lightness, so every gold on the
        // page reads as the same gold as the logo.
        //
        // Which one to reach for: on the ink field use `pale` for type and
        // DEFAULT for marks; on limestone use `deep` for both — a gold bright
        // enough to match the mark cannot clear 4.5:1 on paper.
        brass: {
          DEFAULT: "#D4B43C", // marks and rules on the ink field
          deep: "#6E5A0E", // type and marks on limestone (AA on both papers)
          pale: "#F7E37A", // type on the ink field — the mark's own gold
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest: "0.18em",
        station: "0.22em",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
