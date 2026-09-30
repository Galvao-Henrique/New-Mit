'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import { home } from '@/content/home';

export function MenuCelular() {
  const [aberto, setAberto] = useState(false);

  return (
    <Dialog.Root open={aberto} onOpenChange={setAberto}>
      <Dialog.Trigger
        aria-label="Abrir menu"
        className="inline-flex size-11 items-center justify-center rounded-sm text-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado md:hidden"
      >
        <List size={28} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-marinho/80" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col bg-marinho-superficie p-6 text-creme shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-texto text-[13px] font-semibold uppercase tracking-[0.3em] text-dourado">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fechar menu"
              className="inline-flex size-11 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
            >
              <X size={28} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Menu do celular" className="mt-8 flex flex-col">
            {home.navegacao.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="flex min-h-14 items-center border-b border-creme/15 font-titulo text-xl font-semibold uppercase tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
              >
                {item.rotulo}
              </a>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
