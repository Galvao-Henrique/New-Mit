'use client';

import { useEffect, useRef, useState } from 'react';

type ContadorProps = {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  className?: string;
};

const DURACAO_MS = 1200;

/**
 * O HTML do servidor já traz o valor final. No cliente, com movimento permitido e o número abaixo da tela
 * na montagem, ele vai a 0 e sobe até o valor ao entrar na tela.
 */
export function Contador({ valor, prefixo = '', sufixo = '', className = '' }: ContadorProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    let quadro = 0;
    const animar = () => {
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min((agora - inicio) / DURACAO_MS, 1);
        setAtual(Math.round(valor * (1 - (1 - t) ** 3)));
        if (t < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    };

    // Zera no próximo quadro (fora do corpo do efeito) e espera entrar na tela.
    const zerar = requestAnimationFrame(() => setAtual(0));
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        observador.disconnect();
        animar();
      },
      { threshold: 0.5 },
    );
    observador.observe(el);

    return () => {
      cancelAnimationFrame(zerar);
      cancelAnimationFrame(quadro);
      observador.disconnect();
    };
  }, [valor]);

  return (
    <span ref={ref} data-contador="" role="img" aria-label={`${prefixo}${valor}${sufixo}`} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {prefixo}
        {atual}
        {sufixo}
      </span>
    </span>
  );
}
