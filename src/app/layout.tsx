import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3, Zilla_Slab } from 'next/font/google';
import { MarcaHidratacao } from '@/components/layout/MarcaHidratacao';
import { JsonLd } from '@/components/seo/JsonLd';
import { baseDosMetadados, dadosEstruturados } from '@/lib/seo';
import './globals.css';

// Só os pesos usados (font-semibold e font-bold); o 500 não aparece em nenhuma classe.
const zilla = Zilla_Slab({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-zilla',
});

// Números e detalhes abaixo da dobra: sem pré-carregamento, para não disputar com o hero.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: 'italic',
  display: 'swap',
  variable: '--font-playfair',
  preload: false,
});

const source = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-source',
});

export const metadata: Metadata = {
  metadataBase: baseDosMetadados(),
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
  twitter: { card: 'summary_large_image' },
};

/**
 * Roda no <head>, antes dos scripts do Next:
 * - põe `js` no <html>: o CSS só esconde as revelações quando há JavaScript;
 * - se a hidratação não avisar em 3 s (MarcaHidratacao), tira o `js`: um script que falhou (rede ruim,
 *   navegador antigo, extensão) não deixa as seções invisíveis;
 * - marca `data-rolado` no <html> com a página rolada, também num link direto (/#contato) ou ao recarregar
 *   no meio da página, para o topo ficar sólido e legível sem esperar o React.
 */
const scriptDoHead = `(function () {
  var html = document.documentElement;
  html.classList.add('js');
  setTimeout(function () {
    if (!window.__hidratado) html.classList.remove('js');
  }, 3000);
  var rolado;
  function marcarRolagem() {
    var agora = window.scrollY > 24;
    if (agora === rolado) return;
    rolado = agora;
    if (agora) html.setAttribute('data-rolado', '');
    else html.removeAttribute('data-rolado');
  }
  marcarRolagem();
  window.addEventListener('scroll', marcarRolagem, { passive: true });
  window.addEventListener('load', marcarRolagem);
  window.addEventListener('hashchange', marcarRolagem);
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${zilla.variable} ${playfair.variable} ${source.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptDoHead }} />
      </head>
      <body>
        <MarcaHidratacao />
        <JsonLd dados={dadosEstruturados()} />
        {children}
      </body>
    </html>
  );
}
