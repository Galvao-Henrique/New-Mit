'use client';

import { MagnifyingGlass, SquaresFour } from '@phosphor-icons/react/dist/ssr';
import { useMemo, useRef, useState } from 'react';
import { Foto } from '@/components/ui/Foto';
import { contagemCortes, home } from '@/content/home';
import type { Foto as FotoRegistrada } from '@/data/fotos';
import { filtrarCortes, type FiltroCategoria } from '@/lib/busca';
import type { Categoria, Corte } from '@/types/catalogo';
import { CardCorte } from './CardCorte';

export interface ItemCatalogo {
  corte: Corte;
  foto: FotoRegistrada;
}

type CatalogoInterativoProps = {
  itens: ItemCatalogo[];
  categorias: { categoria: Categoria; foto: FotoRegistrada }[];
};

const focoDourado = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado';

export function CatalogoInterativo({ itens, categorias }: CatalogoInterativoProps) {
  const { catalogo } = home;
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');
  const [termo, setTermo] = useState('');
  const campoBusca = useRef<HTMLInputElement>(null);

  const visiveis = useMemo(() => {
    const slugs = new Set(
      filtrarCortes(
        itens.map((i) => i.corte),
        categoria,
        termo,
      ).map((c) => c.slug),
    );
    return itens.filter((i) => slugs.has(i.corte.slug));
  }, [itens, categoria, termo]);

  const termoLimpo = termo.trim();

  return (
    <div className="mt-12 lg:mt-14">
      <div role="group" aria-label={catalogo.rotuloCategorias} className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <button
          type="button"
          aria-pressed={categoria === 'todos'}
          onClick={() => setCategoria('todos')}
          className={`col-span-2 flex min-h-20 items-center justify-center gap-3 rounded-sm border-2 px-4 font-titulo text-lg font-bold uppercase tracking-[0.1em] transition-colors lg:col-span-1 lg:min-h-28 lg:flex-col lg:gap-2 ${focoDourado} ${
            categoria === 'todos'
              ? 'border-dourado bg-dourado text-marinho'
              : 'border-creme/25 bg-marinho-superficie text-creme hover:border-dourado'
          }`}
        >
          <SquaresFour size={28} weight="light" aria-hidden="true" />
          {catalogo.todos}
        </button>
        {categorias.map(({ categoria: cat, foto }) => {
          const ativa = categoria === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              aria-pressed={ativa}
              onClick={() => setCategoria(cat.slug)}
              className={`group relative isolate flex min-h-24 items-end overflow-hidden rounded-sm border-2 text-left transition-colors lg:min-h-28 ${focoDourado} ${
                ativa ? 'border-dourado' : 'border-transparent hover:border-dourado/70'
              }`}
            >
              <Foto
                foto={foto}
                decorativa
                sizes="(min-width: 1280px) 220px, (min-width: 640px) 18vw, 50vw"
                className="-z-20 transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className={`absolute inset-0 -z-10 bg-gradient-to-t from-marinho/90 via-marinho/45 ${ativa ? 'to-marinho/10' : 'to-marinho/30'}`}
              />
              <span className="px-3 py-2.5 font-titulo text-base font-bold uppercase tracking-[0.08em] text-creme min-[400px]:text-lg lg:text-base xl:text-lg">
                {cat.nome}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-full sm:max-w-md">
          <label htmlFor="busca-corte" className="font-texto text-base font-semibold text-creme">
            {catalogo.buscaRotulo}
          </label>
          <div className="relative mt-2">
            <MagnifyingGlass
              size={22}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-creme/70"
            />
            <input
              id="busca-corte"
              type="search"
              value={termo}
              ref={campoBusca}
              onChange={(e) => setTermo(e.target.value)}
              placeholder={catalogo.buscaPlaceholder}
              autoComplete="off"
              className="min-h-12 w-full rounded-sm border border-creme/30 bg-marinho-superficie pl-12 pr-4 font-texto text-base text-creme placeholder:text-creme/60 focus-visible:border-dourado focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
            />
          </div>
        </div>
        <p aria-live="polite" className="font-texto text-base text-creme/80">
          {contagemCortes(visiveis.length)}
        </p>
      </div>

      {visiveis.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visiveis.map(({ corte, foto }) => (
            <li key={corte.slug} className="flex">
              <CardCorte corte={corte} foto={foto} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="font-texto text-lg text-creme">
            {catalogo.vazio} “{termoLimpo}”.
          </p>
          <button
            type="button"
            onClick={() => {
              setTermo('');
              // O botão sai da tela ao limpar: o foco vai para o campo, não para o corpo da página.
              campoBusca.current?.focus();
            }}
            className={`inline-flex min-h-12 items-center rounded-sm border-2 border-dourado px-6 font-texto text-base font-semibold text-creme transition-colors hover:bg-dourado hover:text-marinho ${focoDourado}`}
          >
            {catalogo.limparBusca}
          </button>
        </div>
      )}
    </div>
  );
}
