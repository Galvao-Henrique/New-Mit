'use client';

/** O ano vem do relógio do visitante; o HTML do servidor traz o do build e o cliente corrige sem aviso. */
export function AnoAtual() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
