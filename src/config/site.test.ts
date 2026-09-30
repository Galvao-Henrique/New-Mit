import { describe, expect, it } from 'vitest';
import { pendente, site } from './site';

describe('site', () => {
  it('só faz entrega, diária, no Vale do Paraíba', () => {
    expect(site.entrega).toEqual({ diaria: true, retirada: false, area: 'Vale do Paraíba' });
  });
  it('mantém os contatos do site atual', () => {
    expect(site.whatsapp.numero).toBe('5512997052003');
    expect(site.endereco.exibicao).toBe('Rua Adolpho Goll, 132 - São José dos Campos - SP');
    expect(site.horario.exibicao).toBe('Seg. a Sáb. — 8h às 19h');
  });
  it('marca valores pendentes', () => {
    expect(pendente(site.dominio)).toBe(true);
    expect(pendente('mitata.com.br')).toBe(false);
  });
});
