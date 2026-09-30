import { Topo } from '@/components/layout/Topo';
import { Hero } from '@/components/secoes/Hero';
import { MapaBoi } from '@/components/secoes/mapa/MapaBoi';
import { site } from '@/config/site';

/** Espaços reservados: as próximas tarefas preenchem cada seção. */
const reservadas = [site.ancoras.catalogo, site.ancoras.sobre, site.ancoras.contato];

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Hero />
        <MapaBoi />
        {reservadas.map((id) => (
          <section key={id} id={id} className="min-h-[60vh]" />
        ))}
      </main>
    </>
  );
}
