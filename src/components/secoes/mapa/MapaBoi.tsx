import { readFileSync } from 'node:fs';
import path from 'node:path';
import desenhoDoBoi from '@/assets/mapa/boi.png';
import { Divisor } from '@/components/ui/Divisor';
import { Revelar } from '@/components/ui/Revelar';
import { Rotulo } from '@/components/ui/Rotulo';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { cortes } from '@/data/cortes';
import { fotoDoCorte } from '@/data/fotos';
import { itensMapa, rotulosDosCortes } from '@/data/mapa';
import { prepararSvgBoi } from '@/lib/mapa';
import { MapaBoiInterativo, type ItemPainel } from './MapaBoiInterativo';

/** Lido e validado no build: se o desenho sair do contrato, o build quebra com a lista de problemas. */
function svgDoBoi(): string {
  const arquivo = readFileSync(path.join(process.cwd(), 'src/assets/mapa/boi.svg'), 'utf8');
  return prepararSvgBoi(arquivo, rotulosDosCortes);
}

function itensDoPainel(): ItemPainel[] {
  return itensMapa.map((item) => {
    const corte = cortes.find((c) => c.slug === item.corteSlug);
    if (!corte) throw new Error(`Corte não encontrado: ${item.corteSlug}`);
    return { ...item, corte, foto: fotoDoCorte(corte) };
  });
}

export function MapaBoi() {
  const { mapa } = home;
  return (
    <section id={site.ancoras.cortes} aria-labelledby="titulo-mapa" className="bg-creme py-20 text-tinta lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo tom="claro">{mapa.rotulo}</Rotulo>
          <h2
            id="titulo-mapa"
            className="mt-4 font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-tinta sm:text-4xl lg:text-5xl"
          >
            {mapa.titulo}
          </h2>
          <Divisor tom="claro" className="mt-6" />
          <p className="mt-6 font-texto text-lg leading-relaxed text-tinta/80">{mapa.apoio}</p>
        </Revelar>
        <MapaBoiInterativo svgHtml={svgDoBoi()} desenhoDoBoi={desenhoDoBoi} itens={itensDoPainel()} />
      </div>
    </section>
  );
}
