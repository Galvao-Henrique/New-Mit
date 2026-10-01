import { Divisor } from '@/components/ui/Divisor';
import { Foto } from '@/components/ui/Foto';
import { Revelar } from '@/components/ui/Revelar';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { foto } from '@/data/fotos';

/** Foto grande com um bloco azul que invade a foto e o creme; os pilares ficam logo abaixo. */
export function Compromisso() {
  const { compromisso } = home;
  return (
    <section
      id={site.ancoras.sobre}
      aria-labelledby="titulo-compromisso"
      className="bg-creme pb-20 text-tinta lg:pb-28"
    >
      <div className="relative h-[22rem] sm:h-[28rem] lg:h-[36rem]">
        <Foto foto={foto('compromisso')} sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-marinho/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Revelar className="-mt-24 max-w-xl bg-azul-mitata px-8 py-10 shadow-[0_24px_48px_-20px_rgb(11_22_51/0.7)] sm:-mt-32 sm:px-12 sm:py-12 lg:-mt-48 lg:px-14 lg:py-14">
          <p className="font-texto text-[13px] font-semibold uppercase tracking-[0.3em] text-creme lg:text-sm">
            {compromisso.rotulo}
          </p>
          <h2
            id="titulo-compromisso"
            className="mt-4 break-words font-titulo text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-creme sm:text-4xl lg:text-5xl"
          >
            {compromisso.titulo}
          </h2>
          <Divisor tom="escuro" className="mt-8 justify-start" />
        </Revelar>

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {compromisso.pilares.map((pilar, i) => (
            <li key={pilar.titulo}>
              <Revelar atraso={i * 100}>
                <span
                  aria-hidden="true"
                  className="block border-b border-dourado-escuro/40 pb-3 font-destaque text-5xl italic text-dourado-escuro"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-titulo text-xl font-bold uppercase tracking-[0.08em] text-tinta">
                  {pilar.titulo}
                </h3>
                <p className="mt-3 font-texto text-base leading-relaxed text-tinta/85">{pilar.texto}</p>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
