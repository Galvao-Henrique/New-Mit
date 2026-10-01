/** Textos da página inicial, uma chave por seção. */
export const home = {
  navegacao: [
    { rotulo: 'Cortes', href: '#cortes' },
    { rotulo: 'Sobre', href: '#sobre' },
    { rotulo: 'Contato', href: '#contato' },
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
    buscaPlaceholder: 'Ex.: picanha, fígado…',
    vazio: 'Nenhum corte encontrado para',
    limparBusca: 'Limpar busca',
    adicionar: 'Adicionar à cotação',
    remover: 'Remover da cotação',
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
  },
} as const;

export function contagemCortes(n: number): string {
  return `${n} ${n === 1 ? 'corte' : 'cortes'}`;
}

export function contagemItens(n: number): string {
  return `${n} ${n === 1 ? 'item' : 'itens'}`;
}
