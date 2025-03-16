/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(1, 82, 168)",
        "primary-hover": "rgb(3, 48, 97)",
        secondary: "#ffffff",
        tertiary: "#0fe3af"
      },
      animation: {
        loading: "loading 2s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in",
        slideDown: "slideDown 0.3s ease-in-out",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      }
    }
  },
  plugins: []
};
