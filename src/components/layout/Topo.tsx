'use client';

import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { home } from '@/content/home';
import { whatsappUrl } from '@/lib/whatsapp';
import { useCotacao } from '@/store/cotacao';
import { MenuCelular } from './MenuCelular';

const focoDourado = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado';

export function Topo() {
  const [solido, setSolido] = useState(false);
  const quantidade = useCotacao((estado) => estado.itens.length);
  const abrirPainel = useCotacao((estado) => estado.abrirPainel);

  useEffect(() => {
    const atualizar = () => setSolido(window.scrollY > 24);
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
    return () => window.removeEventListener('scroll', atualizar);
  }, []);

  return (
    <header
      data-solido={solido ? 'true' : undefined}
      className="fixed inset-x-0 top-0 z-40 h-16 border-b border-transparent bg-transparent transition-colors duration-300 data-[solido=true]:border-creme/10 data-[solido=true]:bg-marinho/95 data-[solido=true]:backdrop-blur md:h-20"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-10">
        <a href="#inicio" aria-label="Mitata Alimentos, início" className={`shrink-0 rounded-sm ${focoDourado}`}>
          <Logo versao="creme" formato="horizontal" className="h-8 w-auto sm:h-10" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {home.navegacao.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-11 items-center font-texto text-sm font-semibold uppercase tracking-[0.2em] text-creme transition-colors hover:text-dourado ${focoDourado}`}
            >
              {item.rotulo}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={abrirPainel}
            aria-label={`Abrir lista de cotação, ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`}
            className={`inline-flex min-h-11 items-center rounded-sm border border-dourado px-3 font-texto text-sm font-semibold text-creme transition-colors hover:bg-dourado hover:text-marinho sm:px-4 ${focoDourado}`}
          >
            Cotação ({quantidade})
          </button>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className={`inline-flex size-11 items-center justify-center rounded-sm text-creme transition-colors hover:text-dourado ${focoDourado}`}
          >
            <WhatsappLogo size={26} weight="fill" aria-hidden="true" />
          </a>
          <MenuCelular />
        </div>
      </div>
    </header>
  );
}
