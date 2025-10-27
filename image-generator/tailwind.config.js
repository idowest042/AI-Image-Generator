module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust based on your project
  ],
  theme: {
    extend: {
      fontFamily:{
        sans : ["Poppins", "sans-serif"],
        joseph:["Lavishly Yours", "serif"],
        cute:["Delius Swash Caps"],
        ex:["Ancizar","serif"]
      },
      colors: {
        primary: '#6366F1',
        accent: '#A855F7',
        background: '#0F172A',
        card: '#1E293B',
        success: '#10B981'
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 20px -10px #6366F1' },
          to: { boxShadow: '0 0 20px -5px #6366F1, 0 0 30px -10px #6366F1' }
        }
      }
    },
  },
  plugins: [],
}