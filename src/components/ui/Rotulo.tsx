import type { ReactNode } from 'react';

type RotuloProps = {
  /**
   * "escuro" = sobre o marinho (dourado); "claro" = sobre o creme (dourado-escuro);
   * "azul" = nos blocos azul-mitata (creme: o dourado só tem contraste ali em texto grande).
   */
  tom: 'claro' | 'escuro' | 'azul';
  children: ReactNode;
  className?: string;
};

const cores = { escuro: 'text-dourado', claro: 'text-dourado-escuro', azul: 'text-creme' } as const;

export function Rotulo({ tom, children, className = '' }: RotuloProps) {
  return (
    <p
      className={`font-texto text-[13px] font-semibold lg:text-sm uppercase tracking-[0.3em] ${cores[tom]} ${className}`}
    >
      {children}
    </p>
  );
}
