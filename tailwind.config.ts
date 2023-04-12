import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#1a1a1a",
        primary: "#ff8c00",
        secondary: "#28282d",
        "off-black": "#1e1e22",
      },
      fontFamily: {
        sans: ["var(--font-family-ui)"],
        mono: ["var(--font-family-mono)"],
      },
      container: {
        center: true,
        padding: "3rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
