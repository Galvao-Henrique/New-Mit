import { ForkKnife, Knife, Storefront } from '@phosphor-icons/react/dist/ssr';
import type { Icon } from '@phosphor-icons/react';
import { Divisor } from '@/components/ui/Divisor';
import { Foto } from '@/components/ui/Foto';
import { Revelar } from '@/components/ui/Revelar';
import { home } from '@/content/home';
import { foto } from '@/data/fotos';

const icones: Record<(typeof home.empresas.segmentos)[number]['icone'], Icon> = { ForkKnife, Knife, Storefront };

/** Foto de fundo com véu marinho; o card azul avança sobre a seção seguinte. */
export function Empresas() {
  const { empresas } = home;
  return (
    <section aria-labelledby="titulo-empresas" className="relative z-10 bg-marinho">
      <div aria-hidden="true" className="absolute inset-0">
        <Foto foto={foto('empresas')} sizes="100vw" decorativa />
        <div className="absolute inset-0 bg-marinho/70" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:px-10 lg:pt-28">
        <Revelar className="bg-azul-mitata px-8 py-10 shadow-[0_24px_48px_-20px_rgb(0_0_0/0.8)] sm:px-12 sm:py-12 lg:-mb-24 lg:px-14 lg:py-14">
          <p className="font-texto text-[13px] font-semibold uppercase tracking-[0.3em] text-creme lg:text-sm">
            {empresas.rotulo}
          </p>
          <h2
            id="titulo-empresas"
            className="mt-4 break-words font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-creme sm:text-4xl lg:text-5xl"
          >
            {empresas.titulo}
          </h2>
          <Divisor tom="escuro" className="mt-8 justify-start" />
          <p className="mt-8 max-w-lg font-texto text-lg leading-relaxed text-creme">{empresas.texto}</p>
        </Revelar>

        <Revelar atraso={150} className="pb-24 lg:pb-28">
          <ul aria-label={empresas.rotuloLista} className="grid gap-4">
            {empresas.segmentos.map((segmento) => {
              const Icone = icones[segmento.icone];
              return (
                <li
                  key={segmento.icone}
                  className="flex items-center gap-5 border-b border-creme/25 pb-4 font-titulo text-xl font-bold uppercase tracking-[0.12em] text-creme sm:text-2xl"
                >
                  <Icone size={40} weight="light" aria-hidden="true" className="shrink-0 text-dourado" />
                  {segmento.texto}
                </li>
              );
            })}
          </ul>
        </Revelar>
      </div>
    </section>
  );
}
