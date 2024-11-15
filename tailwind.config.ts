import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                default: 'var(--color-default)',
                inactive: 'var(--color-inactive)',
                background: 'var(--color-background)',
                'light-hover': 'var(--color-light-hover)',
                'very-light-hover': 'var(--color-very-light-hover)',
                'light-border': 'var(--color-light-border)',
            },
            width: {
                a4: '210mm',
            },
            maxWidth: {
                a4: '210mm',
            },
            height: {
                a4: '297mm',
            },
            maxHeight: {
                a4: '297mm',
            },
            fontSize: {
                '2xs': '0.5rem',
            },
            lineHeight: {
                2: '0.5rem',
                // line-height: .75rem /* 12px */;
            },
        },
    },
    plugins: [],
}
export default config
