'use client';

import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { focoDourado } from '@/components/ui/foco';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/config/site';
import { comum } from '@/content/comum';
import { home } from '@/content/home';
import { whatsappUrl } from '@/lib/whatsapp';
import { useCotacao } from '@/store/cotacao';
import { MenuCelular } from './MenuCelular';

type TopoProps = {
  /** Mostra o botão "Cotação (n)"; só onde o painel de cotação está montado. */
  comCotacao?: boolean;
  /** Prefixo dos links de âncora: "" na página inicial, "/" nas demais. */
  base?: string;
};

export function Topo({ comCotacao = true, base = '' }: TopoProps) {
  const quantidade = useCotacao((estado) => estado.itens.length);
  const abrirPainel = useCotacao((estado) => estado.abrirPainel);

  return (
    // Transparente no alto da página; o fundo sólido ao rolar vem do globals.css ([data-topo]), sem esperar o React.
    <header
      data-topo=""
      className="fixed inset-x-0 top-0 z-40 h-16 border-b border-transparent bg-transparent transition-colors duration-300 md:h-20"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-10">
        <a
          href={`${base}#${site.ancoras.inicio}`}
          aria-label="Mitata Alimentos, início"
          className={`shrink-0 rounded-sm ${focoDourado}`}
        >
          {/* Acima da dobra em toda página: sem carregamento preguiçoso. */}
          <Logo versao="creme" prioritario className="h-8 w-auto sm:h-10" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {home.navegacao.map((item) => (
            <a
              key={item.href}
              href={`${base}${item.href}`}
              className={`inline-flex min-h-11 items-center font-texto text-sm font-semibold uppercase tracking-[0.2em] text-creme transition-colors hover:text-dourado ${focoDourado}`}
            >
              {item.rotulo}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {comCotacao && (
            <button
              type="button"
              onClick={abrirPainel}
              data-cotacao-topo=""
              aria-label={`Cotação (${quantidade}): abrir lista de cotação`}
              className={`inline-flex min-h-11 items-center rounded-sm border border-dourado px-3 font-texto text-sm font-semibold text-creme transition-colors hover:bg-dourado hover:text-marinho sm:px-4 ${focoDourado}`}
            >
              Cotação ({quantidade})
            </button>
          )}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Falar no WhatsApp ${comum.abreNovaAba}`}
            className={`inline-flex size-11 items-center justify-center rounded-sm text-creme transition-colors hover:text-dourado ${focoDourado}`}
          >
            <WhatsappLogo size={26} weight="fill" aria-hidden="true" />
          </a>
          <MenuCelular base={base} />
        </div>
      </div>
    </header>
  );
}
