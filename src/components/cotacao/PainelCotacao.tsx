'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { WhatsappLogo, X } from '@phosphor-icons/react/dist/ssr';
import { Botao } from '@/components/ui/Botao';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { mensagemCotacao, whatsappUrl } from '@/lib/whatsapp';
import { devolverFoco, useCotacao } from '@/store/cotacao';

const focoDourado = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado';

export function PainelCotacao() {
  const { cotacao } = home;
  const aberto = useCotacao((estado) => estado.painelAberto);
  const itens = useCotacao((estado) => estado.itens);
  const observacao = useCotacao((estado) => estado.observacao);
  const fecharPainel = useCotacao((estado) => estado.fecharPainel);
  const remover = useCotacao((estado) => estado.remover);
  const definirObservacao = useCotacao((estado) => estado.definirObservacao);

  return (
    <Dialog.Root open={aberto} onOpenChange={(abrir) => !abrir && fecharPainel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-marinho/80" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(evento) => {
            evento.preventDefault();
            devolverFoco();
            // A origem pode ter saído da página (ex.: a barra some com a lista vazia): o foco volta ao topo.
            if (!document.activeElement || document.activeElement === document.body) {
              document.querySelector<HTMLElement>('[data-cotacao-topo]')?.focus();
            }
          }}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90svh] flex-col rounded-t-md bg-marinho-superficie text-creme shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[28rem] md:rounded-none"
        >
          <div className="flex items-center justify-between gap-4 border-b border-creme/15 px-5 py-3 sm:px-6">
            <Dialog.Title className="font-titulo text-xl font-bold uppercase tracking-[0.06em] text-creme">
              {cotacao.painelTitulo}
            </Dialog.Title>
            <Dialog.Close
              aria-label={cotacao.fechar}
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-sm ${focoDourado}`}
            >
              <X size={28} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {itens.length === 0 ? (
            <div className="flex flex-col items-start gap-5 px-5 py-8 sm:px-6">
              <p className="font-texto text-lg text-creme">{cotacao.vazia}</p>
              <Botao variante="contorno" href={`#${site.ancoras.catalogo}`} onClick={fecharPainel}>
                {cotacao.verCatalogo}
              </Botao>
            </div>
          ) : (
            <>
              <ul className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
                {itens.map((item) => (
                  <li
                    key={item.corteSlug}
                    className="flex items-center justify-between gap-4 border-b border-creme/10 py-3"
                  >
                    <div>
                      <p className="font-texto text-base font-semibold text-creme">{item.nome}</p>
                      <p className="font-texto text-base text-creme/70">{item.subcategoria}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remover(item.corteSlug)}
                      aria-label={`Remover ${item.nome} da lista`}
                      className={`inline-flex min-h-11 shrink-0 items-center rounded-sm px-3 font-texto text-base font-semibold text-dourado underline underline-offset-4 hover:text-creme ${focoDourado}`}
                    >
                      {cotacao.removerItem}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-creme/15 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
                <label htmlFor="observacao-cotacao" className="font-texto text-base font-semibold text-creme">
                  {cotacao.observacaoRotulo}
                </label>
                <textarea
                  id="observacao-cotacao"
                  rows={2}
                  value={observacao}
                  onChange={(e) => definirObservacao(e.target.value)}
                  placeholder={cotacao.observacaoPlaceholder}
                  className="mt-2 w-full resize-none rounded-sm border border-creme/30 bg-marinho p-3 font-texto text-base text-creme placeholder:text-creme/60 focus-visible:border-dourado focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
                />
                <Botao
                  variante="primario"
                  href={whatsappUrl(mensagemCotacao({ itens, observacao }))}
                  externo
                  className="mt-4 w-full"
                >
                  <WhatsappLogo size={24} weight="fill" aria-hidden="true" />
                  {cotacao.enviar}
                </Botao>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
