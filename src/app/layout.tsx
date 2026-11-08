import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/use-auth';
import { AppCheckProvider } from '@/components/auth/app-check-provider';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const displayFont = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const DESCRIPTION =
  'Black Heritage Gallery, founded by Robbie Lee, celebrates African American art and the voices of Black artists.';

export const metadata: Metadata = {
  metadataBase: new URL('https://bh-gallery.com'),
  title: {
    default: 'Black Heritage Gallery',
    template: '%s | Black Heritage Gallery',
  },
  description: DESCRIPTION,
  keywords: ['Black art', 'African American art', 'Black Heritage Gallery', 'Robbie Lee', 'art gallery'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Black Heritage Gallery',
    description: DESCRIPTION,
    url: '/',
    siteName: 'Black Heritage Gallery',
    type: 'website',
    images: [{ url: '/images/icons/og-image.png', width: 1200, height: 630, alt: 'Black Heritage Gallery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Heritage Gallery',
    description: DESCRIPTION,
    images: ['/images/icons/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AuthProvider>
          <AppCheckProvider />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body)',
                borderRadius: '8px',
              },
              success: {
                style: {
                  border: '1px solid #2D7A4F',
                },
              },
              error: {
                style: {
                  border: '1px solid #C13030',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
