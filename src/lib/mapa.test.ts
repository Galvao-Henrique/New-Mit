import { describe, expect, it } from 'vitest';
import { PECAS, type Peca } from '@/data/mapa';
import { ErroContratoSvg, prepararSvgBoi } from './mapa';

const rotulos: Record<Peca, string> = {
  dianteiro: 'Dianteiro de Boi',
  pa: 'Pá de Boi',
  traseiro: 'Traseiro de Boi',
  lingua: 'Língua Bovina',
  figado: 'Fígado de Bovino',
  rumen: 'Rúmen de Bovino',
};

const ABERTURA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">';

/** Fixture mínimo: um contorno fora das peças e um grupo por peça. */
function montar(pecas: readonly string[] = PECAS, extra = '', abertura = ABERTURA): string {
  const grupos = pecas.map((p) => `<g id="peca-${p}"><path d="M0 0h1v1z"/></g>`).join('');
  return `${abertura}<path d="M0 0h10v10z"/>${grupos}${extra}</svg>`;
}

const valido = montar();
const semRumen = montar(PECAS.filter((p) => p !== 'rumen'));
const paDuplicada = montar([...PECAS, 'pa']);
const comScript = montar(PECAS, '<script>alert(1)</script>');
const comTexto = montar(PECAS, '<text x="0" y="10">Boi</text>');
const comImagem = montar(PECAS, '<image href="boi.png" width="10" height="10"/>');
const comEvento = valido.replace('<g id="peca-pa"', '<g id="peca-pa" onclick="alert(1)"');
const semViewBox = montar(PECAS, '', '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">');
const grande = montar(PECAS, `<path d="M0 0${' l1 1'.repeat(40_000)}"/>`);

function problemasDe(svg: string): string[] {
  try {
    prepararSvgBoi(svg, rotulos);
  } catch (e) {
    if (e instanceof ErroContratoSvg) return e.problemas;
    throw e;
  }
  return [];
}

describe('prepararSvgBoi', () => {
  it('adiciona papel de botão, foco e nome a cada peça', () => {
    const out = prepararSvgBoi(valido, rotulos);
    expect(out).toMatch(
      /<g[^>]*id="peca-pa"[^>]*role="button"[^>]*tabindex="0"[^>]*aria-label="Pá de Boi"[^>]*data-peca="pa"/,
    );
    for (const p of PECAS) expect(out).toContain(`aria-label="${rotulos[p]}" data-peca="${p}"`);
  });

  it('aceita aspas simples, id depois de outros atributos, prólogo, comentários e grupo aninhado', () => {
    const variante = `<?xml version="1.0"?><!-- Claude Design --><svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><g transform='translate(10 0)'>${PECAS.map(
      (p) => `<g class='x' id='peca-${p}'><path d='M0 0h1v1z'/></g>`,
    ).join('')}</g></svg>`;
    const out = prepararSvgBoi(variante, rotulos);
    expect(out.startsWith('<svg')).toBe(true);
    expect(out).not.toMatch(/<svg[^>]*\s(width|height)=/);
    expect(out.match(/data-peca=/g)).toHaveLength(6);
  });

  it('aceita DOCTYPE e remove title, desc e metadata (texto fora do pt-BR e dica do navegador)', () => {
    const svg = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${montar(
      PECAS,
      '<title>Bull</title><desc>Drawn in Claude Design</desc><metadata/>',
    )}`;
    const out = prepararSvgBoi(svg, rotulos);
    expect(out.startsWith('<svg')).toBe(true);
    expect(out).not.toMatch(/<(title|desc|metadata)\b|Bull|Claude/);
  });

  it('tira width e height só da tag <svg> raiz', () => {
    const svg = montar(
      PECAS,
      '<rect width="10" height="5" stroke-width="2"/>',
      '<svg width="320" height="200" viewBox="0 0 320 200">',
    );
    const out = prepararSvgBoi(svg, rotulos);
    expect(out.startsWith('<svg viewBox="0 0 320 200">')).toBe(true);
    expect(out).toContain('<rect width="10" height="5" stroke-width="2"/>');
  });

  it('não duplica atributos que a peça já tenha e mantém grupos vazios', () => {
    const svg = valido
      .replace('<g id="peca-pa">', '<g role="img" id="peca-pa" tabindex="-1">')
      .replace('<g id="peca-rumen"><path d="M0 0h1v1z"/></g>', '<g id="peca-rumen"/>');
    const out = prepararSvgBoi(svg, rotulos);
    expect(out).toContain('<g id="peca-pa" role="button" tabindex="0" aria-label="Pá de Boi" data-peca="pa">');
    expect(out).toContain(
      '<g id="peca-rumen" role="button" tabindex="0" aria-label="Rúmen de Bovino" data-peca="rumen"/>',
    );
  });

  it('escapa o rótulo no atributo', () => {
    const out = prepararSvgBoi(valido, { ...rotulos, pa: 'Pá "A" & <B>' });
    expect(out).toContain('aria-label="Pá &quot;A&quot; &amp; &lt;B&gt;"');
  });

  it.each([
    ['sem peca-rumen', semRumen, 'Falta a peça "peca-rumen"'],
    ['peca-pa duplicada', paDuplicada, 'A peça "peca-pa" aparece 2 vezes'],
    ['com <script>', comScript, 'O SVG não pode ter <script>'],
    ['com <text>', comTexto, 'O SVG não pode ter <text>'],
    ['com <image>', comImagem, 'O SVG não pode ter <image>'],
    ['com onclick', comEvento, 'O SVG não pode ter atributos de evento (on...)'],
    ['sem viewBox', semViewBox, 'O SVG precisa de viewBox'],
    ['maior que 150 KB', grande, 'O SVG passa de 150 KB'],
  ])('rejeita %s', (_, svg, problema) => {
    expect(() => prepararSvgBoi(svg, rotulos)).toThrow(ErroContratoSvg);
    try {
      prepararSvgBoi(svg, rotulos);
    } catch (e) {
      expect((e as ErroContratoSvg).problemas).toContain(problema);
    }
  });

  it('rejeita peça que não é grupo e peça dentro de outra peça', () => {
    const naoGrupo = valido.replace(
      '<g id="peca-lingua"><path d="M0 0h1v1z"/></g>',
      '<path id="peca-lingua" d="M0 0z"/>',
    );
    expect(problemasDe(naoGrupo)).toContain('A peça "peca-lingua" precisa ser um grupo <g>');

    const aninhada = valido
      .replace('<g id="peca-pa"><path d="M0 0h1v1z"/></g>', '')
      .replace(
        '<g id="peca-dianteiro"><path d="M0 0h1v1z"/>',
        '<g id="peca-dianteiro"><g id="peca-pa"><path d="M0 0z"/></g>',
      );
    expect(problemasDe(aninhada)).toContain('A peça "peca-pa" não pode ficar dentro de outra peça');
  });

  it('rejeita referências externas e aceita referências internas', () => {
    const externo = montar(
      PECAS,
      '<use href="https://exemplo.com/boi.svg#a"/><path fill="url(fonte.woff)" d="M0 0z"/>',
    );
    expect(problemasDe(externo)).toEqual(['O SVG não pode ter referências externas (links, imagens ou fontes)']);

    const interno = montar(
      PECAS,
      `<defs><clipPath id="c"><path d="M0 0z"/></clipPath></defs><use xlink:href="#c"/><path clip-path="url('#c')" fill="url(#c)" d="M0 0z"/>`,
    );
    expect(problemasDe(interno)).toEqual([]);
  });

  it('rejeita arquivo que não começa com <svg>', () => {
    expect(problemasDe(`<html>${valido}</html>`)).toContain('O arquivo precisa começar com a tag <svg>');
  });

  it('junta todos os problemas antes de lançar', () => {
    const svg = montar(
      PECAS.filter((p) => p !== 'figado'),
      '<script>x</script><text>Boi</text>',
      '<svg xmlns="http://www.w3.org/2000/svg">',
    );
    expect(problemasDe(svg)).toEqual([
      'O SVG precisa de viewBox',
      'O SVG não pode ter <script>',
      'O SVG não pode ter <text>',
      'Falta a peça "peca-figado"',
    ]);
    expect(() => prepararSvgBoi(svg, rotulos)).toThrow(/O boi\.svg não cumpre o contrato/);
  });
});
