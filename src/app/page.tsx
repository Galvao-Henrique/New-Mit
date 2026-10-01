import { BarraCotacao } from '@/components/cotacao/BarraCotacao';
import { CotacaoHidratacao } from '@/components/cotacao/CotacaoHidratacao';
import { PainelCotacao } from '@/components/cotacao/PainelCotacao';
import { Rodape } from '@/components/layout/Rodape';
import { Topo } from '@/components/layout/Topo';
import { ComoComprar } from '@/components/secoes/ComoComprar';
import { Compromisso } from '@/components/secoes/Compromisso';
import { Diferenciais } from '@/components/secoes/Diferenciais';
import { Empresas } from '@/components/secoes/Empresas';
import { Essencia } from '@/components/secoes/Essencia';
import { Hero } from '@/components/secoes/Hero';
import { Catalogo } from '@/components/secoes/catalogo/Catalogo';
import { MapaBoi } from '@/components/secoes/mapa/MapaBoi';

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
        <Compromisso />
        <Empresas />
        <Essencia />
        <ComoComprar />
      </main>
      <Rodape />
      <BarraCotacao />
      <PainelCotacao />
      <CotacaoHidratacao />
    </>
  );
}
