import { Botao } from '@/components/ui/Botao';
import { Divisor } from '@/components/ui/Divisor';
import { Foto } from '@/components/ui/Foto';
import { Rotulo } from '@/components/ui/Rotulo';
import { home } from '@/content/home';
import { site } from '@/config/site';
import { foto } from '@/data/fotos';
import { whatsappUrl } from '@/lib/whatsapp';

export function Hero() {
  const { hero } = home;
  return (
    <section
      id={site.ancoras.inicio}
      className="grid grid-cols-[minmax(0,1fr)] bg-marinho lg:min-h-svh lg:grid-cols-2"
      aria-labelledby="titulo-hero"
    >
      <div className="relative aspect-[4/3] lg:order-2 lg:aspect-auto">
        <Foto foto={foto('hero')} sizes="(min-width: 1024px) 50vw, 100vw" prioridade />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-marinho/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-marinho/40 lg:via-transparent"
        />
        {/* Faixa azul-marinho sob o topo fixo: mantém legíveis os itens que ficam sobre a foto. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-marinho/90 via-marinho/50 to-transparent"
        />
      </div>

      <div className="flex items-center px-4 pb-20 pt-14 sm:px-6 sm:pb-24 lg:order-1 lg:py-24 lg:pt-36 lg:pl-10 lg:pr-16 xl:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        {/* Acima da dobra: visível desde o HTML, com entrada só em CSS (não depende da hidratação). */}
        <div className="max-w-xl motion-safe:animate-entrada">
          <Rotulo tom="escuro">{hero.rotulo}</Rotulo>
          <h1
            id="titulo-hero"
            className="mt-5 break-words font-titulo text-[1.75rem] font-bold uppercase leading-[1.15] tracking-[0.04em] text-creme min-[400px]:text-4xl sm:text-5xl sm:tracking-[0.06em] xl:text-6xl"
          >
            {hero.titulo}
          </h1>
          <Divisor tom="escuro" className="mt-8 justify-start" />
          <p className="mt-8 max-w-md font-texto text-lg leading-relaxed text-creme/90">{hero.apoio}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Botao variante="primario" href={`#${site.ancoras.cortes}`}>
              {hero.verCortes}
            </Botao>
            <Botao variante="contorno" href={whatsappUrl()} externo>
              {hero.cotacaoWhatsapp}
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
