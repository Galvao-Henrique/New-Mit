'use client';

import { Botao } from '@/components/ui/Botao';
import { contagemItens, home } from '@/content/home';
import { useCotacao } from '@/store/cotacao';

/**
 * Barra fixa no rodapé enquanto houver itens; o espaçador evita que ela cubra o fim da página, e
 * [data-barra-cotacao] dá ao <html> o scroll-padding-bottom que impede o foco do teclado de ficar atrás dela.
 */
export function BarraCotacao() {
  const quantidade = useCotacao((estado) => estado.itens.length);
  const abrirPainel = useCotacao((estado) => estado.abrirPainel);

  if (quantidade === 0) return null;

  return (
    <>
      <div aria-hidden="true" className="h-24" />
      <div
        data-barra-cotacao=""
        className="fixed inset-x-0 bottom-0 z-30 border-t border-dourado/40 bg-marinho-superficie pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_-12px_rgb(0_0_0/0.6)]"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <p aria-live="polite" className="font-texto text-base font-semibold text-creme">
            {contagemItens(quantidade)} na cotação
          </p>
          <Botao variante="primario" onClick={abrirPainel}>
            {home.cotacao.verCotacao}
          </Botao>
        </div>
      </div>
    </>
  );
}
