import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        primary: {
          DEFAULT: '#0052cc',
          hover: '#0747a6',
          light: '#deebff',
        },
        coral: {
          DEFAULT: '#ff5a5f',
          hover: '#e0484d',
        }
      },
    },
  },
  plugins: [],
};
export default config;
