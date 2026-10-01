import { describe, expect, it } from 'vitest';
import { dadosEstruturados, urlDoSite } from './seo';

describe('dadosEstruturados', () => {
  it('LocalBusiness com contato, horário e Vale do Paraíba', () => {
    const d = dadosEstruturados();
    expect(d['@type']).toBe('LocalBusiness');
    expect(d.telephone).toBe('+5512997052003');
    expect(d.areaServed).toEqual({ '@type': 'AdministrativeArea', name: 'Vale do Paraíba' });
    // nada de retirada nem de valor pendente (string como "[CEP]")
    expect(JSON.stringify(d)).not.toMatch(/retirada|"\[[^"\]]*\]"/);
  });

  it('omite geo e postalCode enquanto estiverem pendentes', () => {
    const d = dadosEstruturados();
    expect(d).not.toHaveProperty('geo');
    expect(d.address).not.toHaveProperty('postalCode');
  });

  it('sem domínio, não publica url nem sitemap', () => {
    expect(urlDoSite()).toBeNull();
    expect(dadosEstruturados()).not.toHaveProperty('url');
  });
});
