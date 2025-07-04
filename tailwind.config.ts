import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/email/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/FormInline/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{ts,tsx}", // keep this for any other loose files
  ],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        shake: "shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
        fadeOut: "fadeOut 0.2s ease-out",
      },
      blur: {
        xxs: "0.33px",
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "card-sm": "0px 0.5px 12px -5px rgba(30,41,59,0.20)",
        "card-md": "0px 1px 25px -10px rgba(30,41,59,0.30)",
        "card-lg": "0px 2px 51px -19px rgba(30,41,59,0.40)",
      },
      colors: {
        brand: {
          DEFAULT: "#00E6CA",
          light: "#00E6CA",
          dark: "#00C4B8",
        },
        "form-bg": "var(--form-background-color)",
        focus: "var(--formbricks-focus, #1982fc)",
        error: "rgb(from var(--formbricks-error) r g b / <alpha-value>)",
        brandnew: "var(--formbricks-brand, #038178)",
        borderColor: {
          primary: "var(--formbricks-border-primary, #e0e0e0)",
          secondary: "var(--formbricks-border-secondary, #0f172a)",
          disabled: "var(--formbricks-border-disabled, #ececec)",
        },
        labelColor: {
          primary: "var(--formbricks-label-primary, #0f172a)",
          secondary: "var(--formbricks-label-secondary, #384258)",
          disabled: "var(--formbricks-label-disabled, #bdbdbd)",
        },
        fill: {
          primary: "var(--formbricks-fill-primary, #fefefe)",
          secondary: "var(--formbricks-fill-secondary, #0f172a)",
          disabled: "var(--formbricks-fill-disabled, #e0e0e0)",
        },
        placeholder: "var(--form-placeholder-color)",
        subheading: "var(--form-subheading-color)",
        "input-bg": "var(--form-input-background-color)",
        "form-border": "var(--form-border-color)",
        "border-highlight": "var(--form-border-color-highlight)",
		  },
      borderRadius: {
        custom: "var(--form-border-radius)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },

          "20%, 80%": {
            transform: "translate3d(2px, 0, 0),",
          },

          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },

          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      width: {
        "sidebar-expanded": "4rem",
        "sidebar-collapsed": "14rem",
      },
      transitionProperty: {
        width: "width",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      screens: {
        xs: "430px",
      },
      scale: {
        97: "0.97",
      },
      gridTemplateColumns: {
        20: "repeat(20, minmax(0, 1fr))",
      },
    },
  },
  safelist: [{ pattern: /max-w-./, variants: ["sm"] }],
  darkMode: "class", // Set dark mode to use the 'class' strategy
  plugins: [forms, typography, ],
} satisfies Config;
