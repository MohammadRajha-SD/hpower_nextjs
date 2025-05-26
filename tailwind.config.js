/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.1rem",
        md: "0.5rem",
        xl: "1rem",
        xxl: "2rem",
      },
    },
    screens: {
      xs: "320px",
      sm: "540px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
      xxl: "1400px",
      xxxl: "1500px",
    },
    extend: {
      colors: {
        main_red: "#ED1B2F",
        section_bg: "#FFF9F9",
        footer_bg: "#530910",
        text_color: "#2E2E2E",
        softText_color: "#333333",
        text_white: "#FFFFFF",
        active_color: "#FF7C44",
        interactive_color: "#4D002e",
      },
      backgroundImage: {
        explosion: 'url("/bg-explosion.png")',
        circles: 'url("/bg-circles.png")',
        circleStar: 'url("/circle-star.svg")',
        site: 'url("/site-bg.svg")',
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
        "spin-slow-nolinear": "spin 6s reverse infinite",
        "anim-ping": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      fontFamily: {
        opensans: [`var(--font-opensans)`, "sans-serif"],
        secondary: [`var(--font-title)`, "sans-serif"],
      },
      fontSize: {
        header: ["2.3rem", { fontWeight: "500" }],
        mobile_header: ["1.3rem", { fontWeight: "400" }],
        description_lg: ["1rem", { fontWeight: "400" }],
        description_sm: ["0.8rem", { fontWeight: "300" }],
        btn_size: ["1rem", { fontWeight: "500" }],
        btn_size_sm: [".86rem", { fontWeight: "500" }],
        indicator_text: ["4.85rem", { fontWeight: "500" }],
        notfound_text: ["2.5rem", { fontWeight: "500" }],
        notfound_text_sm: ["2rem", { fontWeight: "500" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
};
