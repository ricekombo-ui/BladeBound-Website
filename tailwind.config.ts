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
        ember: "#d56047",
        crimson: "#ae4641",
        void: "#070416",
        bone: "#fdf2e1",
        shadow: "#443859",
        plum: "#69354c",
        dust: "#ce7267",
        stone: "#79717b",
        accent: "#914049",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "void-gradient": "linear-gradient(135deg, #070416 0%, #0d0820 50%, #070416 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
