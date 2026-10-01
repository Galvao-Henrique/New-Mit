'use client';

import { HandTap } from '@phosphor-icons/react/dist/ssr';
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { Botao } from '@/components/ui/Botao';
import { Foto } from '@/components/ui/Foto';
import { home } from '@/content/home';
import type { Foto as FotoRegistrada } from '@/data/fotos';
import type { ItemMapa, Peca } from '@/data/mapa';
import { useCotacao } from '@/store/cotacao';
import type { Corte } from '@/types/catalogo';

export interface ItemPainel extends ItemMapa {
  corte: Corte;
  foto: FotoRegistrada;
}

type MapaBoiInterativoProps = {
  /** SVG já validado e preparado por `prepararSvgBoi` no build. */
  svgHtml: string;
  itens: ItemPainel[];
};

const focoDouradoEscuro = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado-escuro';

/** Prévia de um item: sob o mouse ou com o foco do teclado. */
type Previa = { slug: string; origem: 'mouse' | 'foco' };

export function MapaBoiInterativo({ svgHtml, itens }: MapaBoiInterativoProps) {
  const { mapa } = home;
  const [sobre, setSobre] = useState<Previa | null>(null);
  /** Item escolhido por clique, toque, Enter ou Espaço. */
  const [fixo, setFixo] = useState<string | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const desenho = useRef<HTMLDivElement>(null);

  const slugExibido = sobre?.slug ?? fixo;
  const exibido = itens.find((i) => i.corteSlug === slugExibido) ?? null;
  // Prévia do mouse: o botão da cotação não aparece, porque o mouse sai da peça a caminho dele.
  const soPreviaDoMouse = sobre?.origem === 'mouse' && sobre.slug !== fixo;
  const naCotacao = useCotacao((estado) => estado.itens.some((i) => i.corteSlug === slugExibido));
  const alternar = useCotacao((estado) => estado.alternar);

  // Destaque das peças: ativo/inativo enquanto algo é exibido; sem atributo quando nada é.
  useEffect(() => {
    const destaca = itens.find((i) => i.corteSlug === slugExibido)?.destaca;
    const pecaFixa = itens.find((i) => i.corteSlug === fixo)?.peca;
    for (const g of desenho.current?.querySelectorAll<SVGGElement>('[data-peca]') ?? []) {
      const peca = g.dataset.peca as Peca;
      if (destaca) g.setAttribute('data-estado', destaca.includes(peca) ? 'ativo' : 'inativo');
      else g.removeAttribute('data-estado');
      g.setAttribute('aria-pressed', String(peca === pecaFixa));
    }
  }, [itens, slugExibido, fixo]);

  /** Item da peça (no SVG) ou do botão da lista em que o evento aconteceu. */
  function itemDoAlvo(alvo: EventTarget | null): string | null {
    if (!(alvo instanceof Element)) return null;
    const peca = alvo.closest('[data-peca]')?.getAttribute('data-peca');
    if (peca) return itens.find((i) => i.peca === peca)?.corteSlug ?? null;
    return alvo.closest('[data-item]')?.getAttribute('data-item') ?? null;
  }

  // Fora das peças (cabeça, patas, fundo) a prévia continua: só sair do desenho a apaga.
  function aoPassarNoDesenho(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const slug = itemDoAlvo(e.target);
    if (slug) setSobre({ slug, origem: 'mouse' });
  }

  function aoSairComMouse(e: PointerEvent) {
    if (e.pointerType === 'mouse') setSobre((atual) => (atual?.origem === 'mouse' ? null : atual));
  }

  function aoClicarNoDesenho(e: MouseEvent) {
    const slug = itemDoAlvo(e.target);
    if (slug) setFixo(slug);
  }

  function aoTeclarNoDesenho(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const slug = itemDoAlvo(e.target);
    if (!slug) return;
    e.preventDefault();
    setFixo(slug);
  }

  function aoFocar(e: FocusEvent) {
    const slug = itemDoAlvo(e.target);
    if (slug) setSobre({ slug, origem: 'foco' });
    // No botão do painel, volta ao item escolhido; sem escolha, mantém a prévia (o botão continua na tela).
    else if (fixo) setSobre(null);
  }

  function aoDesfocar(e: FocusEvent) {
    if (!raiz.current?.contains(e.relatedTarget as Node | null)) setSobre(null);
  }

  function aoAlternarCotacao() {
    if (!exibido) return;
    alternar(exibido.corte);
    setFixo(exibido.corteSlug);
  }

  return (
    <div
      ref={raiz}
      onFocus={aoFocar}
      onBlur={aoDesfocar}
      className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      {/*
        O SVG é o nosso arquivo versionado (src/assets/mapa/boi.svg), conferido no build por prepararSvgBoi
        (contrato: sem <script>, <style>, atributos on... ou referências externas). É uma checagem de contrato
        para esse arquivo, não um sanitizador genérico: não use este caminho para SVG de fora.
      */}
      <div
        ref={desenho}
        role="group"
        aria-label={mapa.rotuloDesenho}
        className="mapa-boi lg:col-span-7"
        onPointerOver={aoPassarNoDesenho}
        onPointerLeave={aoSairComMouse}
        onClick={aoClicarNoDesenho}
        onKeyDown={aoTeclarNoDesenho}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />

      <div className="lg:col-span-5">
        <div className="overflow-hidden rounded-sm border border-dourado-escuro/25 bg-creme shadow-[0_18px_40px_-24px_rgb(11_22_51/0.45)]">
          <div
            className={`relative bg-marinho/[0.04] ${exibido ? 'aspect-[16/10]' : 'aspect-[16/7] lg:aspect-[16/10]'}`}
          >
            {exibido ? (
              <>
                <Foto foto={exibido.foto} sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 100vw" />
                <span className="absolute bottom-3 left-3 rounded-sm bg-marinho/85 px-2 py-1 text-[13px] text-creme">
                  {mapa.imagemIlustrativa}
                </span>
              </>
            ) : (
              <div className="absolute inset-4 flex items-center justify-center rounded-sm border border-dashed border-dourado-escuro/50 text-dourado-escuro">
                <HandTap size={56} weight="light" aria-hidden="true" />
              </div>
            )}
          </div>
          {/* No lg, altura igual nos dois estados: o painel não muda de tamanho e o boi, centralizado ao lado, não se mexe. */}
          <div className="p-5 sm:p-6 lg:min-h-48">
            <p
              aria-live="polite"
              className={
                exibido
                  ? 'font-titulo text-2xl font-bold uppercase tracking-[0.06em] text-tinta'
                  : 'font-texto text-lg text-tinta/80'
              }
            >
              {exibido ? exibido.corte.nome : mapa.vazio}
            </p>
            {exibido && (
              <>
                <p className="mt-1 font-texto text-base text-tinta/75">{exibido.corte.subcategoria}</p>
                {soPreviaDoMouse ? (
                  <p className="mt-5 flex min-h-12 items-center font-texto text-base font-semibold text-dourado-escuro lg:min-h-14">
                    {mapa.escolher}
                  </p>
                ) : (
                  <Botao
                    tom="claro"
                    variante={naCotacao ? 'contorno' : 'primario'}
                    onClick={aoAlternarCotacao}
                    className="mt-5 w-full sm:w-auto"
                  >
                    {naCotacao ? mapa.remover : mapa.adicionar}
                  </Botao>
                )}
              </>
            )}
          </div>
        </div>

        <h3
          id="titulo-lista-mapa"
          className="mt-8 font-texto text-[13px] font-semibold uppercase tracking-[0.3em] text-dourado-escuro lg:text-sm"
        >
          {mapa.rotuloLista}
        </h3>
        <ul aria-labelledby="titulo-lista-mapa" className="mt-3 flex flex-wrap gap-2" onPointerLeave={aoSairComMouse}>
          {itens.map((item) => {
            const escolhido = fixo === item.corteSlug;
            const estado = escolhido
              ? 'border-azul-mitata bg-azul-mitata text-creme'
              : exibido?.corteSlug === item.corteSlug
                ? 'border-dourado-escuro bg-dourado-escuro/10 text-tinta'
                : 'border-tinta/25 text-tinta hover:border-dourado-escuro';
            return (
              <li key={item.corteSlug}>
                <button
                  type="button"
                  data-item={item.corteSlug}
                  aria-pressed={escolhido}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setSobre({ slug: item.corteSlug, origem: 'mouse' });
                  }}
                  onClick={() => setFixo(item.corteSlug)}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 font-texto text-base font-semibold transition-colors ${estado} ${focoDouradoEscuro}`}
                >
                  {item.corte.nome}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
