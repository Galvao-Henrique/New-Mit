import { site } from '@/config/site';

/** Textos da página inicial, uma chave por seção. */
export const home = {
  navegacao: [
    { rotulo: 'Cortes', href: `#${site.ancoras.cortes}` },
    { rotulo: 'Sobre', href: `#${site.ancoras.sobre}` },
    { rotulo: 'Contato', href: `#${site.ancoras.contato}` },
  ],
  hero: {
    rotulo: 'Atacado de carnes · São José dos Campos',
    titulo: 'Carnes selecionadas para o seu negócio',
    apoio: 'Atacado de bovinos, suínos, aves e linguiças com entrega diária no Vale do Paraíba.',
    verCortes: 'Ver cortes',
    cotacaoWhatsapp: 'Cotação pelo WhatsApp',
  },
  mapa: {
    rotulo: 'Mapa de cortes',
    titulo: 'Conheça o boi Mitata',
    apoio: 'Escolha uma parte do boi para ver o corte e incluí-lo na sua lista de cotação.',
    rotuloDesenho: 'Partes do boi',
    rotuloLista: 'Cortes bovinos',
    vazio: 'Passe o mouse ou toque numa parte do boi',
    escolherComMouse: 'Clique para escolher',
    escolherComTeclado: 'Enter para escolher',
    imagemIlustrativa: 'Imagem ilustrativa',
    adicionar: 'Adicionar à cotação',
    remover: 'Remover da cotação',
  },
  diferenciais: {
    rotuloLista: 'Diferenciais da Mitata',
    itens: [
      { icone: 'Truck', texto: 'Entrega diária no Vale do Paraíba' },
      { icone: 'Storefront', texto: 'Exclusivo para atacado' },
      { icone: 'Knife', texto: 'Bovinos, suínos, aves e linguiças' },
      { icone: 'WhatsappLogo', texto: 'Pedido direto pelo WhatsApp' },
    ],
  },
  catalogo: {
    rotulo: 'Catálogo',
    titulo: 'Nossos cortes',
    aviso: 'Imagens ilustrativas',
    rotuloCategorias: 'Categorias',
    todos: 'Todos',
    buscaRotulo: 'Buscar corte',
    buscaPlaceholder: 'Ex.: costelinha, fígado…',
    vazio: 'Nenhum corte encontrado para',
    limparBusca: 'Limpar busca',
    adicionar: 'Adicionar à cotação',
    remover: 'Remover da cotação',
    adicionarCurto: 'Adicionar',
    removerCurto: 'Remover',
    paginacao: 'Páginas do catálogo',
    anterior: 'Anterior',
    proxima: 'Próxima',
    pagina: 'Página',
  },
  compromisso: {
    rotulo: 'Sobre a Mitata',
    titulo: 'Nosso compromisso',
    pilares: [
      { titulo: 'Entrega diária', texto: 'Entregamos todos os dias, em todo o Vale do Paraíba.' },
      { titulo: 'Qualidade', texto: 'Padrão constante em cada entrega, do primeiro ao último pedido.' },
      {
        titulo: 'Seleção criteriosa',
        texto: 'Cada peça é escolhida com o cuidado de quem está no ramo há 50 anos.',
      },
      {
        titulo: 'Atendimento especializado',
        texto: 'Atendimento direto, de quem entende de carne, pelo WhatsApp.',
      },
    ],
  },
  empresas: {
    rotulo: 'Para empresas',
    titulo: 'Atendimento exclusivo para atacado',
    texto: 'Fornecemos para restaurantes, açougues e mercados de todo o Vale do Paraíba, com entrega diária.',
    rotuloLista: 'Quem atendemos',
    segmentos: [
      { icone: 'ForkKnife', texto: 'Restaurantes' },
      { icone: 'Knife', texto: 'Açougues' },
      { icone: 'Storefront', texto: 'Mercados' },
    ],
  },
  essencia: {
    rotuloLista: 'A Mitata em números',
    numeros: [
      { valor: 50, prefixo: '', sufixo: ' anos', legenda: 'de experiência' },
      { valor: 20, prefixo: '+', sufixo: '', legenda: 'cortes disponíveis' },
      { valor: 100, prefixo: '+', sufixo: '', legenda: 'clientes atendidos' },
    ],
  },
  comoComprar: {
    rotulo: 'Contato',
    titulo: 'Como comprar',
    texto: 'Fale com a gente no WhatsApp: diga de quais cortes precisa e receba a sua cotação.',
    botao: 'Chamar no WhatsApp',
    montarLista: 'ou monte sua lista de cotação',
  },
  rodape: {
    rotuloNav: 'Rodapé',
    tituloMenu: 'Menu',
    resumo: 'Atacado · Entrega diária no Vale do Paraíba',
    creditos: 'Créditos das fotos',
    privacidade: 'Privacidade',
  },
  cotacao: {
    painelTitulo: 'Sua lista de cotação',
    observacaoRotulo: 'Observação (opcional)',
    observacaoPlaceholder: 'Ex.: quantidades, dia de entrega',
    enviar: 'Enviar pelo WhatsApp',
    vazia: 'Sua lista está vazia.',
    verCatalogo: 'Ver catálogo',
    fechar: 'Fechar lista de cotação',
    verCotacao: 'Ver cotação',
    removerItem: 'Remover',
    limparLista: 'Limpar lista',
    confirmarLimpeza: 'Confirmar limpeza',
    cancelarLimpeza: 'Cancelar',
  },
} as const;

export function contagemCortes(n: number): string {
  return `${n} ${n === 1 ? 'corte' : 'cortes'}`;
}

/** "N cortes" quando tudo cabe numa página; senão "Mostrando 1–9 de 24 cortes". */
export function resumoDaPagina(pagina: number, porPagina: number, total: number): string {
  if (total <= porPagina) return contagemCortes(total);
  const inicio = (pagina - 1) * porPagina + 1;
  const fim = Math.min(pagina * porPagina, total);
  return `Mostrando ${inicio}–${fim} de ${contagemCortes(total)}`;
}

export function contagemItens(n: number): string {
  return `${n} ${n === 1 ? 'item' : 'itens'}`;
}
