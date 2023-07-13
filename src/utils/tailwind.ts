import { type Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "~/../tailwind.config";

export type TailwindConfig = Config;

export const fullConfig = resolveConfig(tailwindConfig) as TailwindConfig;

export const theme = fullConfig.theme!;

export default fullConfig;
