import { BarraCotacao } from '@/components/cotacao/BarraCotacao';
import { CotacaoHidratacao } from '@/components/cotacao/CotacaoHidratacao';
import { PainelCotacao } from '@/components/cotacao/PainelCotacao';
import { Topo } from '@/components/layout/Topo';
import { Diferenciais } from '@/components/secoes/Diferenciais';
import { Hero } from '@/components/secoes/Hero';
import { Catalogo } from '@/components/secoes/catalogo/Catalogo';
import { MapaBoi } from '@/components/secoes/mapa/MapaBoi';
import { site } from '@/config/site';

/** Espaços reservados: as próximas tarefas preenchem cada seção. */
const reservadas = [site.ancoras.sobre, site.ancoras.contato];

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Hero />
        <Diferenciais />
        <MapaBoi />
        <Catalogo />
        {reservadas.map((id) => (
          <section key={id} id={id} className="min-h-[60vh]" />
        ))}
      </main>
      <BarraCotacao />
      <PainelCotacao />
      <CotacaoHidratacao />
    </>
  );
}
