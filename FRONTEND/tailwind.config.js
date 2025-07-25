// export default{
//   purge: [],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }


// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default{
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",  // Adjust these paths to your project structure
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#ea2e0e',
        'text-color':'orange-red',
      }
    },  // Extend the default theme here (optional)
  },
  plugins: [],  // Add plugins here if needed (optional)
}
