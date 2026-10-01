/**
 * Dados da empresa e configurações globais do site.
 * Header, contato, rodapé, botões e JSON-LD leem daqui.
 *
 * Valores entre colchetes ainda não foram confirmados pela Mitata:
 * troque-os aqui e todo o site se ajusta.
 */
export const site = {
  nome: 'Mitata Alimentos',

  /** Domínio público, sem barra no final. */
  dominio: '[DOMÍNIO]',

  whatsapp: {
    /** DDI + DDD + número, só dígitos. */
    numero: '5512997052003',
    exibicao: '(12) 99705-2003',
    telefoneE164: '+5512997052003',
  },

  endereco: {
    logradouro: 'Rua Adolpho Goll, 132',
    cidade: 'São José dos Campos',
    uf: 'SP',
    cep: '[CEP]',
    pais: 'BR',
    /** Texto exibido na seção de contato. */
    exibicao: 'Rua Adolpho Goll, 132 - São José dos Campos - SP',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Adolpho+Goll+132+Sao+Jose+dos+Campos+SP',
    /** Latitude/longitude para o JSON-LD. Pendente de confirmação. */
    geo: null as { latitude: number; longitude: number } | null,
  },

  horario: {
    exibicao: 'Seg. a Sáb. — 8h às 19h',
    dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    abre: '08:00',
    fecha: '19:00',
  },

  /** Só entrega, diária, no Vale do Paraíba (sem retirada). */
  entrega: { diaria: true, retirada: false, area: 'Vale do Paraíba' },

  mensagensWhatsapp: {
    padrao: 'Olá! Vim pelo site e gostaria de uma cotação para a minha empresa.',
  },

  /** Âncoras das seções da página inicial. */
  ancoras: {
    inicio: 'inicio',
    cortes: 'cortes',
    catalogo: 'catalogo',
    sobre: 'sobre',
    contato: 'contato',
  },
} as const;

/** Indica se um valor de configuração ainda é um marcador `[...]`. */
export function pendente(valor: string): boolean {
  return /^\[.*\]$/.test(valor);
}
