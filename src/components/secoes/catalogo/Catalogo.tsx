import { Divisor } from '@/components/ui/Divisor';
import { Revelar } from '@/components/ui/Revelar';
import { Rotulo } from '@/components/ui/Rotulo';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { categorias } from '@/data/categorias';
import { cortes } from '@/data/cortes';
import { foto } from '@/data/fotos';
import { CatalogoInterativo } from './CatalogoInterativo';

export function Catalogo() {
  const { catalogo } = home;
  // Só os cortes com foto própria mostram foto; os demais ganham a silhueta da categoria.
  const itens = cortes.map((corte) => ({ corte, foto: corte.foto ? foto(corte.foto) : null }));
  const faixa = categorias.map((categoria) => ({ categoria, foto: foto(categoria.foto) }));
  return (
    <section
      id={site.ancoras.catalogo}
      aria-labelledby="titulo-catalogo"
      className="bg-marinho py-20 text-creme lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo tom="escuro">{catalogo.rotulo}</Rotulo>
          <h2
            id="titulo-catalogo"
            className="mt-4 font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-creme sm:text-4xl lg:text-5xl"
          >
            {catalogo.titulo}
          </h2>
          <Divisor tom="escuro" className="mt-6" />
          <p className="mt-6 font-texto text-base text-creme/80">{catalogo.aviso}</p>
        </Revelar>
        <CatalogoInterativo itens={itens} categorias={faixa} />
      </div>
    </section>
  );
}
