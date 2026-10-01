import type { Metadata } from 'next';
import { PaginaSecundaria } from '@/components/layout/PaginaSecundaria';
import { institucional } from '@/content/institucional';

export const metadata: Metadata = {
  title: `${institucional.privacidade.titulo} | Mitata Alimentos`,
  description: institucional.privacidade.intro,
};

export default function Privacidade() {
  const t = institucional.privacidade;
  return (
    <PaginaSecundaria titulo={t.titulo} apoio={t.intro}>
      <ul className="grid gap-6">
        {t.pontos.map((ponto, i) => (
          <li key={ponto} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4">
            <span
              aria-hidden="true"
              className="border-b border-dourado-escuro/40 pb-2 font-destaque text-4xl italic text-dourado-escuro"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="font-texto text-lg leading-relaxed text-tinta">{ponto}</p>
          </li>
        ))}
      </ul>
    </PaginaSecundaria>
  );
}
