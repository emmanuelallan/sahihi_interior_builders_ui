/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html, js, ts, vue}",
    "./src/**/*"
  ],
  theme: {
    extend: {
      minHeight: {
        base: 'calc(100vh - 64px)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

