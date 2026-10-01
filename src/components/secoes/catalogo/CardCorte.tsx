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
          <Foto
            foto={foto}
            decorativa
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-3 flex items-center justify-center rounded-sm border border-dourado/25 bg-[radial-gradient(ellipse_at_center,rgb(201_164_92/0.1),transparent_70%)]">
            <SilhuetaCategoria categoria={corte.categoria} className="w-3/4" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-titulo text-xl font-bold leading-snug text-creme">{corte.nome}</h3>
        <p className="mb-5 mt-1 font-texto text-base text-creme/75">{corte.subcategoria}</p>
        <Botao
          variante={naCotacao ? 'contorno' : 'primario'}
          onClick={() => alternar(corte)}
          rotuloAcessivel={`${texto}: ${corte.nome}`}
          pressionado={naCotacao}
          className="mt-auto w-full"
        >
          {texto}
        </Botao>
      </div>
    </article>
  );
}
