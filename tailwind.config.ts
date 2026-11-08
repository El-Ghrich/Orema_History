import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0D0D0C",
          charcoal: "#0D0D0C",
          elevated: "#171715",
          border: "rgba(245, 242, 235, 0.08)",
        },
        carbon: {
          DEFAULT: "#171715",
          light: "#21211E",
        },
        alabaster: {
          DEFAULT: "#F5F2EB",
          muted: "#8C867B",
        },
        burntOrange: {
          DEFAULT: "#f09d1a",
          hover: "#d68713",
          glow: "rgba(240, 157, 26, 0.25)",
        },
        heritageGreen: {
          DEFAULT: "#1A4D2E",
          hover: "#143D24",
          subtle: "rgba(26, 77, 46, 0.25)",
        },
      },
      fontFamily: {
        sans: ["Cairo", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Cairo", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
