import { site } from '@/config/site';
import { cotacao } from '@/content/cotacao';
import type { Cotacao } from '@/types/cotacao';

/** Monta o link wa.me com a mensagem já codificada. */
export function whatsappUrl(
  mensagem: string = site.mensagensWhatsapp.padrao,
  numero: string = site.whatsapp.numero,
): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem da lista de cotação: cortes com o tipo e observação. */
export function mensagemCotacao(dados: Cotacao): string {
  const t = cotacao.mensagem;
  const linhas = [
    site.mensagensWhatsapp.padrao,
    '',
    `*${t.cortes}:*`,
    ...dados.itens.map((item) => `• ${item.nome} (${item.subcategoria})`),
  ];
  const observacao = dados.observacao?.trim();
  if (observacao) linhas.push('', `*${t.observacao}:* ${observacao}`);
  return linhas.join('\n');
}
