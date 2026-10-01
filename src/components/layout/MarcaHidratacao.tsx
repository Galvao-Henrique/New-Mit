'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    /** Posto depois da hidratação; o script do <head> (layout.tsx) confere em 3 s. */
    __hidratado?: boolean;
  }
}

/** Avisa o script do <head> que o React hidratou a página; sem o aviso, ele mostra as revelações sem animação. */
export function MarcaHidratacao() {
  useEffect(() => {
    window.__hidratado = true;
  }, []);
  return null;
}
