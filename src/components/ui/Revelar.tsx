'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type RevelarProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos, para escalonar elementos irmãos. */
  atraso?: number;
};

/** Revela o conteúdo ao entrar na tela (o CSS só esconde quando o JavaScript está ativo). */
export function Revelar({ children, className = '', atraso = 0 }: RevelarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-revelado', '');
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.setAttribute('data-revelado', '');
            observador.unobserve(entrada.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" className={className} style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}>
      {children}
    </div>
  );
}
