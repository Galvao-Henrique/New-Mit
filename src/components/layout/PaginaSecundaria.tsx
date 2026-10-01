import type { ReactNode } from 'react';
import { Divisor } from '@/components/ui/Divisor';
import { Rodape } from './Rodape';
import { Topo } from './Topo';

type PaginaSecundariaProps = {
  titulo: string;
  /** Texto de apoio sob o título, na faixa marinho. */
  apoio?: string;
  /** Conteúdo sobre o creme, abaixo da faixa do título. */
  children?: ReactNode;
  /** Conteúdo dentro da faixa marinho (ex.: botão da página 404). */
  faixa?: ReactNode;
};

/** Moldura das páginas secundárias: topo sem botão de cotação, faixa marinho com o h1 e rodapé. */
export function PaginaSecundaria({ titulo, apoio, children, faixa }: PaginaSecundariaProps) {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Topo comCotacao={false} base="/" />
      <main id="conteudo">
        <section className="bg-marinho px-4 pb-14 pt-32 text-creme sm:px-6 md:pt-40 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="break-words font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-4xl lg:text-5xl">
              {titulo}
            </h1>
            <Divisor tom="escuro" className="mt-8 justify-start" />
            {apoio && <p className="mt-8 font-texto text-lg leading-relaxed text-creme/90">{apoio}</p>}
            {faixa && <div className="mt-10">{faixa}</div>}
          </div>
        </section>
        {children && (
          <section className="bg-creme px-4 py-14 text-tinta sm:px-6 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-3xl">{children}</div>
          </section>
        )}
      </main>
      <Rodape base="/" />
    </>
  );
}
