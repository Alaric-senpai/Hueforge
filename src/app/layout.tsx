import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Hue forge',
  description: 'Generate, customize, and manage color palettes with a premium design experience.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Hue forge',
    description: 'Generate, customize, and manage color palettes with a premium design experience.',
    images: [
      {
        url: '/images/logo.png'
      }
    ]
  },
  authors:[
    {
      name: 'Kahuho charles',
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
