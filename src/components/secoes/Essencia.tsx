import { Contador } from '@/components/ui/Contador';
import { Revelar } from '@/components/ui/Revelar';
import { home } from '@/content/home';

/** Três números sobre fundo marinho; o espaço de cima abriga o card azul da seção anterior. */
export function Essencia() {
  const { essencia } = home;
  return (
    <section id="essencia" aria-label={essencia.rotuloLista} className="bg-marinho pb-20 pt-32 lg:pb-28 lg:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ul className="grid gap-12 text-center lg:grid-cols-3 lg:gap-0">
          {essencia.numeros.map((numero, i) => (
            <li key={numero.legenda} className={i > 0 ? 'lg:border-l lg:border-dourado/20' : ''}>
              <Revelar atraso={i * 120}>
                <Contador
                  valor={numero.valor}
                  prefixo={numero.prefixo}
                  sufixo={numero.sufixo}
                  className="block font-destaque text-7xl italic leading-none text-dourado lg:text-8xl"
                />
                <p className="mt-5 font-titulo text-lg font-semibold uppercase tracking-[0.2em] text-creme">
                  {numero.legenda}
                </p>
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
