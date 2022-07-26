module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cf-light-blue': '#BED7D8',
        'cf-blue': '#819D9E',
        'cf-cream': '#EFF5DD',
        'cf-cream-low-opa': 'rgba(239, 245, 221, 0.70)',
        'cf-red': '#EC6A5C',
        'cf-red-low-opa': 'rgba(236, 106, 92, 0.50)',
        'cf-black-low-opa': 'rgba(0, 0, 0, 0.50)', 
      },  
    },
  },
}
