import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Comic_Neue, Dela_Gothic_One, Inter } from 'next/font/google';
import { palette, tokensToCss } from '@/styles/tokens';
import { themeInitScript } from '@/lib/hooks/useTheme';
import { site } from '@/lib/data/site';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/ui/Header';
import { Loader } from '@/components/ui/Loader';
import { ChapterSlash } from '@/components/ui/ChapterSlash';
import { Cursor } from '@/components/ui/Cursor';
import './globals.css';

const display = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela',
  display: 'swap',
});
const body = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const bubble = Comic_Neue({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-comic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Portfólio ${site.volume}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  icons: { icon: '/logo.svg', shortcut: '/logo.svg', apple: '/logo.svg' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: '/',
    siteName: `${site.name} · Portfólio`,
    title: `${site.name} · Portfólio ${site.volume}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · Portfólio ${site.volume}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: palette.paper },
    { media: '(prefers-color-scheme: dark)', color: palette.nightPaper },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${bubble.variable}`}
    >
      <head>
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#conteudo"
          className="bg-ink text-paper font-bubble sr-only z-(--z-cursor) px-4 py-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <Loader />
          <Header />
          <div id="manga-root" className="overflow-x-clip">
            {children}
          </div>
          <ChapterSlash />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
