import { describe, expect, it } from 'vitest';
import { baseDosMetadados, dadosEstruturados, urlDoSite } from './seo';

describe('urlDoSite com domínio definido', () => {
  it('acrescenta https e tira a barra final', () => {
    expect(urlDoSite('mitata.com.br')).toBe('https://mitata.com.br');
    expect(urlDoSite('mitata.com.br/')).toBe('https://mitata.com.br');
    expect(urlDoSite('https://mitata.com.br//')).toBe('https://mitata.com.br');
    expect(urlDoSite('http://mitata.com.br')).toBe('http://mitata.com.br');
  });
});

describe('baseDosMetadados', () => {
  it('usa o domínio quando definido', () => {
    expect(baseDosMetadados({ VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' }, 'mitata.com.br').href).toBe(
      'https://mitata.com.br/',
    );
  });
  it('sem domínio, usa o domínio de produção da Vercel', () => {
    expect(baseDosMetadados({ VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' }, '[DOMÍNIO]').href).toBe(
      'https://x.vercel.app/',
    );
  });
  it('sem domínio nem Vercel, usa o endereço local de testes', () => {
    expect(baseDosMetadados({}, '[DOMÍNIO]').href).toBe('http://localhost:3217/');
  });
});

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
