import type { Metadata } from 'next';
import { Inter, Source_Sans_3 } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

// Font optimization (UI/UX Pro Max - font-loading rule)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Fresh Veggies - Fresh Vegetables Delivered to Your Door',
  description: 'Order fresh, organic vegetables online. Fast delivery, best quality.',
  keywords: 'vegetables, organic, fresh produce, online grocery, vegetable delivery',
  authors: [{ name: 'Fresh Veggies' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Fresh Veggies - Fresh Vegetables Delivered',
    description: 'Order fresh, organic vegetables online',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans.variable}`}>
      <head>
        <meta name="theme-color" content="#22c55e" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-on-surface)',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
