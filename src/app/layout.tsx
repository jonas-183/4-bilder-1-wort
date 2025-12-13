import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '4 Bilder 1 Wort - Ratespiel',
  description: 'Spiele das beliebte Wortratespiel 4 Bilder 1 Wort',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}
