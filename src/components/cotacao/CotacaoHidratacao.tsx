'use client';

import { useEffect } from 'react';
import { useCotacao } from '@/store/cotacao';

/**
 * Lê a lista salva no navegador depois da hidratação do React. O store nasce com `skipHydration`,
 * então servidor e primeira renderização do cliente mostram a lista vazia e não há divergência.
 * Sem localStorage (modo privado, armazenamento bloqueado) a lista só vive na página.
 */
export function CotacaoHidratacao() {
  useEffect(() => {
    try {
      Promise.resolve(useCotacao.persist.rehydrate()).catch(() => undefined);
    } catch {
      // armazenamento indisponível: segue com a lista vazia
    }
  }, []);
  return null;
}
