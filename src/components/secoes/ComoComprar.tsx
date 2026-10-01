import { Botao } from '@/components/ui/Botao';
import { Divisor } from '@/components/ui/Divisor';
import { Revelar } from '@/components/ui/Revelar';
import { Rotulo } from '@/components/ui/Rotulo';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { whatsappUrl } from '@/lib/whatsapp';

export function ComoComprar() {
  const { comoComprar } = home;
  return (
    <section
      id={site.ancoras.contato}
      aria-labelledby="titulo-como-comprar"
      className="bg-creme py-20 text-tinta lg:py-28"
    >
      <Revelar className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Rotulo tom="claro">{comoComprar.rotulo}</Rotulo>
        <h2
          id="titulo-como-comprar"
          className="mt-4 font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-tinta sm:text-4xl lg:text-5xl"
        >
          {comoComprar.titulo}
        </h2>
        <Divisor tom="claro" className="mt-8" />
        <p className="mx-auto mt-8 max-w-xl font-texto text-lg leading-relaxed text-tinta/90">{comoComprar.texto}</p>
        <div className="mt-10 flex justify-center">
          <Botao variante="primario" tom="claro" href={whatsappUrl()} externo>
            {comoComprar.botao}
          </Botao>
        </div>
        <p className="mt-6 font-texto text-base font-semibold text-tinta">
          {site.whatsapp.exibicao} · {site.horario.exibicao}
        </p>
        <a
          href={`#${site.ancoras.catalogo}`}
          className="mt-4 inline-flex min-h-11 items-center font-texto text-base font-semibold text-dourado-escuro underline underline-offset-4 hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dourado-escuro"
        >
          {comoComprar.montarLista}
        </a>
      </Revelar>
    </section>
  );
}
