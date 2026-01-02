import type { Metadata, Viewport } from 'next';
import { Rajdhani, Orbitron } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-game',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Strategic Command: Total Control | CR AudioViz AI',
  description: 'A tactical RTS game with complete unit control. Deploy troops, select and command them in real-time, assign specific targets, and lead your army to victory!',
  keywords: ['RTS', 'strategy game', 'tactical', 'Clash of Clans', 'CR AudioViz AI', 'Javari AI'],
  authors: [{ name: 'CR AudioViz AI', url: 'https://craudiovizai.com' }],
  creator: 'CR AudioViz AI',
  publisher: 'CR AudioViz AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://games.craudiovizai.com/strategic-command',
    siteName: 'Strategic Command',
    title: 'Strategic Command: Total Control',
    description: 'A tactical RTS game with complete unit control built by CR AudioViz AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Strategic Command: Total Control',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strategic Command: Total Control',
    description: 'A tactical RTS game with complete unit control',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable}`}>
      <body className="font-game bg-game-darker text-white antialiased">
        {children}
      </body>
    </html>
  );
}
