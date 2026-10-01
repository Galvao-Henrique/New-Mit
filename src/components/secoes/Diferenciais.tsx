import { Knife, Storefront, Truck, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import type { Icon } from '@phosphor-icons/react';
import { Revelar } from '@/components/ui/Revelar';
import { home } from '@/content/home';

const icones: Record<(typeof home.diferenciais.itens)[number]['icone'], Icon> = {
  Truck,
  Storefront,
  Knife,
  WhatsappLogo,
};

/** Faixa creme que sobe sobre a base do hero; a metade de baixo já é creme e se une ao mapa. */
export function Diferenciais() {
  const { diferenciais } = home;
  return (
    <section
      aria-label={diferenciais.rotuloLista}
      className="relative z-10 -mt-8 bg-gradient-to-b from-transparent from-50% to-creme to-50% px-4 sm:-mt-12 sm:px-6 lg:-mt-16 lg:px-10"
    >
      <Revelar className="mx-auto max-w-7xl">
        <ul className="grid gap-x-8 gap-y-6 rounded-sm bg-creme px-6 py-8 text-tinta shadow-[0_20px_44px_-20px_rgb(11_22_51/0.6)] sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-10">
          {diferenciais.itens.map((item) => {
            const Icone = icones[item.icone];
            return (
              <li key={item.icone} className="flex items-center gap-4">
                <Icone size={44} weight="light" aria-hidden="true" className="shrink-0 text-dourado-escuro" />
                <span className="font-texto text-base font-semibold leading-snug">{item.texto}</span>
              </li>
            );
          })}
        </ul>
      </Revelar>
    </section>
  );
}
