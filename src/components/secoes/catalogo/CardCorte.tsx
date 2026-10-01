'use client';

import { Botao } from '@/components/ui/Botao';
import { Foto } from '@/components/ui/Foto';
import { SilhuetaCategoria } from '@/components/ui/SilhuetaCategoria';
import { home } from '@/content/home';
import type { Foto as FotoRegistrada } from '@/data/fotos';
import { useCotacao } from '@/store/cotacao';
import type { Corte } from '@/types/catalogo';

type CardCorteProps = {
  corte: Corte;
  foto: FotoRegistrada | null;
};

export function CardCorte({ corte, foto }: CardCorteProps) {
  const { catalogo } = home;
  const naCotacao = useCotacao((estado) => estado.itens.some((i) => i.corteSlug === corte.slug));
  const alternar = useCotacao((estado) => estado.alternar);
  const texto = naCotacao ? catalogo.remover : catalogo.adicionar;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-sm border border-creme/10 bg-marinho-superficie">
      <div data-midia={foto ? 'foto' : 'silhueta'} className="relative aspect-[4/3] bg-marinho-superficie">
        {foto ? (
          <Foto foto={foto} decorativa sizes="(min-width: 1280px) 380px, (min-width: 768px) 30vw, 50vw" />
        ) : (
          <div className="absolute inset-2 flex md:inset-3 items-center justify-center rounded-sm border border-dourado/25 bg-[radial-gradient(ellipse_at_center,rgb(201_164_92/0.1),transparent_70%)]">
            <SilhuetaCategoria categoria={corte.categoria} className="w-3/4" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-5">
        <h3 className="break-words font-titulo text-base font-bold leading-snug text-creme md:text-xl">{corte.nome}</h3>
        <p className="mb-3 mt-1 font-texto text-sm text-creme/75 md:mb-5 md:text-base">{corte.subcategoria}</p>
        <Botao
          variante={naCotacao ? 'contorno' : 'primario'}
          onClick={() => alternar(corte)}
          rotuloAcessivel={`${texto}: ${corte.nome}`}
          pressionado={naCotacao}
          className="mt-auto w-full px-2! md:px-6!"
        >
          {/* O nome acessível (aria-label) é sempre o completo e contém a palavra visível. */}
          <span className="md:hidden">{naCotacao ? catalogo.removerCurto : catalogo.adicionarCurto}</span>
          <span className="hidden md:inline">{texto}</span>
        </Botao>
      </div>
    </article>
  );
}
