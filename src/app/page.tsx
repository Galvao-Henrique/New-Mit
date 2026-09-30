import { Topo } from '@/components/layout/Topo';
import { Hero } from '@/components/secoes/Hero';
import { site } from '@/config/site';

/** Espaços reservados: as próximas tarefas preenchem cada seção. */
const reservadas = [site.ancoras.cortes, site.ancoras.catalogo, site.ancoras.sobre, site.ancoras.contato];

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Hero />
        {reservadas.map((id) => (
          <section key={id} id={id} className="min-h-[60vh]" />
        ))}
      </main>
    </>
  );
}
