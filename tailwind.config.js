/** @type {import('tailwindcss').Config} */
module.exports = {
  content: 
    ["./public/**/*.{html, js}",
     "./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamilu: {
        custom: ["Silkscreen", 'sans-serif'], 
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

