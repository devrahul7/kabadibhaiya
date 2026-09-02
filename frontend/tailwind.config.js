module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#e67e22', dark: '#ca6f1e', light: '#fdebd0' },
        accent: { DEFAULT: '#27ae60', dark: '#1e8449', light: '#d4efdf' },
        dark: '#1a1a2e'
      },
      fontFamily: { sans: ['Poppins', 'sans-serif'] }
    }
  }
};
