import { fromPairs, toPairs } from "rambdax";
import { type Config } from "tailwindcss";
import defaultConfig from "tailwindcss/defaultConfig";

type FontSizeRaw = NonNullable<NonNullable<Config["theme"]>["fontSize"]>;
type FontSize = Exclude<FontSizeRaw, (...args: never[]) => unknown>;

const fontSize = fromPairs(
  toPairs((defaultConfig.theme?.fontSize ?? {}) as unknown as FontSize).map(
    ([key, value]) => {
      if (typeof value === "string") {
        return [key, value];
      }

      const [size, _config] = value;

      return [key, size];
    },
  ),
) satisfies FontSize;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize,
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
      screens: {
        br: "1024px",
      },
    },
  },
  plugins: [],
} satisfies Config;
