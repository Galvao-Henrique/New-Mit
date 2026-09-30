import type { ReactNode } from 'react';

type RotuloProps = {
  tom: 'claro' | 'escuro';
  children: ReactNode;
  className?: string;
};

export function Rotulo({ tom, children, className = '' }: RotuloProps) {
  const cor = tom === 'escuro' ? 'text-dourado' : 'text-dourado-escuro';
  return (
    <p className={`font-texto text-[13px] font-semibold lg:text-sm uppercase tracking-[0.3em] ${cor} ${className}`}>
      {children}
    </p>
  );
}
