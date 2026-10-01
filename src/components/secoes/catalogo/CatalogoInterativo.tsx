'use client';

import { MagnifyingGlass, SquaresFour } from '@phosphor-icons/react/dist/ssr';
import { useMemo, useRef, useState } from 'react';
import { Foto } from '@/components/ui/Foto';
import { home, resumoDaPagina } from '@/content/home';
import type { Foto as FotoRegistrada } from '@/data/fotos';
import { filtrarCortes, paginar, POR_PAGINA, totalDePaginas, type FiltroCategoria } from '@/lib/busca';
import type { Categoria, Corte } from '@/types/catalogo';
import { CardCorte } from './CardCorte';

export interface ItemCatalogo {
  corte: Corte;
  /** Foto própria do corte; sem ela o card mostra a silhueta da categoria. */
  foto: FotoRegistrada | null;
}

type CatalogoInterativoProps = {
  itens: ItemCatalogo[];
  categorias: { categoria: Categoria; foto: FotoRegistrada }[];
};

const focoDourado = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado';

const botaoPagina =
  'inline-flex min-h-11 items-center justify-center rounded-sm border-2 font-texto text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const paginaComum =
  'border-creme/25 bg-marinho-superficie text-creme hover:border-dourado disabled:hover:border-creme/25';
const paginaAtual = 'border-dourado bg-dourado text-marinho';

export function CatalogoInterativo({ itens, categorias }: CatalogoInterativoProps) {
  const { catalogo } = home;
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');
  const [termo, setTermo] = useState('');
  const [pagina, setPagina] = useState(1);
  const campoBusca = useRef<HTMLInputElement>(null);
  const resultados = useRef<HTMLParagraphElement>(null);
  const grade = useRef<HTMLDivElement>(null);

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

  const totalPaginas = totalDePaginas(visiveis.length, POR_PAGINA);
  const daPagina = paginar(visiveis, pagina, POR_PAGINA);
  const termoLimpo = termo.trim();

  function escolherCategoria(nova: FiltroCategoria) {
    setCategoria(nova);
    setPagina(1);
  }

  function mudarTermo(novo: string) {
    setTermo(novo);
    setPagina(1);
  }

  function irParaPagina(nova: number) {
    setPagina(nova);
    // Quem usa teclado ou leitor de tela cai nos resultados novos, e a grade sobe para a vista.
    resultados.current?.focus({ preventScroll: true });
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    grade.current?.scrollIntoView({ block: 'start', behavior: reduzido ? 'instant' : 'smooth' });
  }

  return (
    <div className="mt-12 lg:mt-14">
      <div role="group" aria-label={catalogo.rotuloCategorias} className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <button
          type="button"
          aria-pressed={categoria === 'todos'}
          onClick={() => escolherCategoria('todos')}
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
              onClick={() => escolherCategoria(cat.slug)}
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
              onChange={(e) => mudarTermo(e.target.value)}
              placeholder={catalogo.buscaPlaceholder}
              autoComplete="off"
              className="min-h-12 w-full rounded-sm border border-creme/30 bg-marinho-superficie pl-12 pr-4 font-texto text-base text-creme placeholder:text-creme/60 focus-visible:border-dourado focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
            />
          </div>
        </div>
        <p
          ref={resultados}
          tabIndex={-1}
          aria-live="polite"
          className="font-texto text-base text-creme/80 focus:outline-none"
        >
          {resumoDaPagina(pagina, POR_PAGINA, visiveis.length)}
        </p>
      </div>

      {visiveis.length > 0 ? (
        <div ref={grade} className="mt-8 scroll-mt-[calc(var(--altura-topo)+5rem)]">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {daPagina.map(({ corte, foto }) => (
              // Sozinho na última linha de 2 colunas, o card fica no centro com a largura normal.
              <li
                key={corte.slug}
                className="flex max-md:[&:last-child:nth-child(odd)]:col-span-2 max-md:[&:last-child:nth-child(odd)]:w-[calc(50%-0.375rem)] max-md:[&:last-child:nth-child(odd)]:justify-self-center"
              >
                <CardCorte corte={corte} foto={foto} />
              </li>
            ))}
          </ul>
          {totalPaginas > 1 && (
            <nav aria-label={catalogo.paginacao} className="mt-10">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                <li>
                  <button
                    type="button"
                    disabled={pagina === 1}
                    onClick={() => irParaPagina(pagina - 1)}
                    className={`${botaoPagina} px-4 ${focoDourado} ${paginaComum}`}
                  >
                    {catalogo.anterior}
                  </button>
                </li>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <li key={numero}>
                    <button
                      type="button"
                      aria-label={`${catalogo.pagina} ${numero}`}
                      aria-current={numero === pagina ? 'page' : undefined}
                      onClick={() => irParaPagina(numero)}
                      className={`${botaoPagina} min-w-11 px-3 ${focoDourado} ${
                        numero === pagina ? paginaAtual : paginaComum
                      }`}
                    >
                      {numero}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    disabled={pagina === totalPaginas}
                    onClick={() => irParaPagina(pagina + 1)}
                    className={`${botaoPagina} px-4 ${focoDourado} ${paginaComum}`}
                  >
                    {catalogo.proxima}
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="font-texto text-lg text-creme">
            {catalogo.vazio} “{termoLimpo}”.
          </p>
          <button
            type="button"
            onClick={() => {
              mudarTermo('');
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
