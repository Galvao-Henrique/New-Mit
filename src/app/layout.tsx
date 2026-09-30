import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3, Zilla_Slab } from 'next/font/google';
import './globals.css';

const zilla = Zilla_Slab({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-zilla',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: 'italic',
  display: 'swap',
  variable: '--font-playfair',
});

const source = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-source',
});

export const metadata: Metadata = {
  title: 'Mitata Alimentos',
};

const marcarJs = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${zilla.variable} ${playfair.variable} ${source.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarJs }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
