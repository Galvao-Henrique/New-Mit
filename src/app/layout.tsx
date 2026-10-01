import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3, Zilla_Slab } from 'next/font/google';
import { JsonLd } from '@/components/seo/JsonLd';
import { dadosEstruturados, urlDoSite } from '@/lib/seo';
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

const url = urlDoSite();

export const metadata: Metadata = {
  ...(url ? { metadataBase: new URL(url) } : {}),
  title: 'Mitata Alimentos | Atacado de carnes no Vale do Paraíba',
  description:
    'Atacado de bovinos, suínos, aves e linguiças em São José dos Campos, com entrega diária em todo o Vale do Paraíba. Peça sua cotação pelo WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Mitata Alimentos',
    title: 'Mitata Alimentos | Atacado de carnes no Vale do Paraíba',
    description: 'Atacado de bovinos, suínos, aves e linguiças com entrega diária em todo o Vale do Paraíba.',
  },
};

const marcarJs = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${zilla.variable} ${playfair.variable} ${source.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarJs }} />
      </head>
      <body>
        <JsonLd dados={dadosEstruturados()} />
        {children}
      </body>
    </html>
  );
}
