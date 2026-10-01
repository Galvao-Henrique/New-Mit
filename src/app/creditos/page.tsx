import type { Metadata } from 'next';
import { PaginaSecundaria } from '@/components/layout/PaginaSecundaria';
import { institucional } from '@/content/institucional';
import { fotos } from '@/data/fotos';
import { openGraphDaPagina } from '@/lib/og';

export const metadata: Metadata = {
  title: `${institucional.creditos.titulo} | Mitata Alimentos`,
  description: institucional.creditos.intro,
  openGraph: openGraphDaPagina(`${institucional.creditos.titulo} | Mitata Alimentos`, institucional.creditos.intro),
};

export default function Creditos() {
  const t = institucional.creditos;
  return (
    <PaginaSecundaria titulo={t.titulo} apoio={t.intro}>
      <ul aria-label={t.rotuloLista} className="divide-y divide-dourado-escuro/30 border-y border-dourado-escuro/30">
        {fotos.map((foto) => (
          <li key={foto.id} className="grid gap-1 py-5">
            <p className="font-texto text-base leading-relaxed text-tinta">{foto.alt}</p>
            <p className="font-texto text-base text-tinta/85">
              {t.autor} <span className="font-semibold text-tinta">{foto.autor}</span> · {t.licenca} {foto.licenca}
            </p>
            <a
              href={foto.origem}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-texto text-base font-semibold text-dourado-escuro underline underline-offset-4 hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dourado-escuro"
            >
              {t.verOrigem} {foto.licenca}
              <span className="sr-only"> {t.abreNovaAba}</span>
            </a>
          </li>
        ))}
      </ul>
    </PaginaSecundaria>
  );
}
