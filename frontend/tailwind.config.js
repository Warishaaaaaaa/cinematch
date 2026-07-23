/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: "#111827",
        primary: {
          DEFAULT: "#7C3AED",
          light: "#9F67FF",
          dark: "#5B21B6",
        },
        accent: {
          DEFAULT: "#06B6D4",
          light: "#38DFF5",
        },
        highlight: "#F59E0B",
        card: "rgba(255,255,255,0.08)",
        border: "rgba(255,255,255,0.12)",
      },
      fontFamily: {
        sans: ["'Inter'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        "gradient-glow": "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.35), transparent 60%)",
        "gradient-card": "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124,58,237,0.35)",
        "glow-cyan": "0 0 40px rgba(6,182,212,0.30)",
        soft: "0 8px 30px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
