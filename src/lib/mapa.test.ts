import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PECAS, type Peca } from '@/data/mapa';
import { ErroContratoSvg, prepararSvgBoi } from './mapa';

const rotulos: Record<Peca, string> = {
  dianteiro: 'Dianteiro de Boi',
  pa: 'Pá de Boi',
  traseiro: 'Traseiro de Boi',
};

const ABERTURA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">';

/** Fixture mínimo: um contorno fora das peças e um grupo por peça. */
function montar(pecas: readonly string[] = PECAS, extra = '', abertura = ABERTURA): string {
  const grupos = pecas.map((p) => `<g id="peca-${p}"><path d="M0 0h1v1z"/></g>`).join('');
  return `${abertura}<path d="M0 0h10v10z"/>${grupos}${extra}</svg>`;
}

const valido = montar();
const semTraseiro = montar(PECAS.filter((p) => p !== 'traseiro'));
const paDuplicada = montar([...PECAS, 'pa']);
const comScript = montar(PECAS, '<script>alert(1)</script>');
const comEstilo = montar(PECAS, '<style>path { fill: red }</style>');
const comTexto = montar(PECAS, '<text x="0" y="10">Boi</text>');
const comImagem = montar(PECAS, '<image href="boi.png" width="10" height="10"/>');
const comEvento = valido.replace('<g id="peca-pa"', '<g id="peca-pa" onclick="alert(1)"');
const semViewBox = montar(PECAS, '', '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">');
const grande = montar(PECAS, `<path d="M0 0${' l1 1'.repeat(40_000)}"/>`);

/** Cada `<g>` aberto (sem ser vazio `<g/>`) tem o seu `</g>`, e nenhum fecha antes de abrir. */
function gruposEquilibrados(svg: string): boolean {
  let abertos = 0;
  for (const m of svg.matchAll(/<g\b(?:[^>"']|"[^"]*"|'[^']*')*>|<\/g>/g)) {
    if (m[0] === '</g>') abertos--;
    else if (!m[0].endsWith('/>')) abertos++;
    if (abertos < 0) return false;
  }
  return abertos === 0;
}

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
    expect(out.match(/data-peca=/g)).toHaveLength(PECAS.length);
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
    expect(out.startsWith('<svg viewBox="0 0 320 200" style="--mapa-escala:1">')).toBe(true);
    expect(out).toContain('<rect width="10" height="5" stroke-width="2"/>');
  });

  it('não duplica atributos que a peça já tenha e mantém grupos vazios', () => {
    const svg = valido
      .replace('<g id="peca-pa">', '<g role="img" id="peca-pa" tabindex="-1">')
      .replace('<g id="peca-traseiro"><path d="M0 0h1v1z"/></g>', '<g id="peca-traseiro"/>');
    const out = prepararSvgBoi(svg, rotulos);
    expect(out).toContain('<g id="peca-pa" role="button" tabindex="0" aria-label="Pá de Boi" data-peca="pa">');
    expect(out).toContain(
      '<g id="peca-traseiro" role="button" tabindex="0" aria-label="Traseiro de Boi" data-peca="traseiro">' +
        '<g data-mapa-visual=""></g><g data-mapa-alvo="" opacity="0" aria-hidden="true"></g></g>',
    );
    expect(gruposEquilibrados(out)).toBe(true);
  });

  describe('escala do desenho', () => {
    it('põe --mapa-escala (largura do viewBox / 320) na raiz', () => {
      const out = prepararSvgBoi(montar(PECAS, '', '<svg viewBox="0 0 1600 1000">'), rotulos);
      expect(out.startsWith('<svg viewBox="0 0 1600 1000" style="--mapa-escala:5">')).toBe(true);
    });

    it('junta com o style que a raiz já tenha e aceita vírgulas no viewBox', () => {
      const out = prepararSvgBoi(montar(PECAS, '', `<svg style='color: red;' viewBox='0,0,480,300'>`), rotulos);
      expect(out.startsWith(`<svg style='color: red;--mapa-escala:1.5' viewBox='0,0,480,300'>`)).toBe(true);
    });

    it('rejeita viewBox que não tem quatro números com largura e altura positivas', () => {
      for (const vb of ['0 0 320', '0 0 abc 200', '0 0 0 200', '']) {
        expect(problemasDe(montar(PECAS, '', `<svg viewBox="${vb}">`))).toEqual([
          'O viewBox precisa de quatro números (x, y, largura e altura positivas)',
        ]);
      }
    });
  });

  describe('peças embrulhadas: o destaque não mexe no desenho nem na área de toque', () => {
    it('move a apresentação da peça para um grupo interno e cria a cópia parada para o mouse', () => {
      const svg = valido.replace(
        '<g id="peca-pa">',
        `<g class='x' transform="rotate(10 5 5)" id="peca-pa" filter="url(#f)" opacity=".8" style="mix-blend-mode:multiply">`,
      );
      const out = prepararSvgBoi(svg, rotulos);
      const interno = `<g class='x' transform="rotate(10 5 5)" filter="url(#f)" opacity=".8" style="mix-blend-mode:multiply"><path d="M0 0h1v1z"/></g>`;
      expect(out).toContain(
        '<g id="peca-pa" role="button" tabindex="0" aria-label="Pá de Boi" data-peca="pa">' +
          `<g data-mapa-visual="">${interno}</g>` +
          `<g data-mapa-alvo="" opacity="0" aria-hidden="true">${interno}</g></g>`,
      );
    });

    it('sem atributos de apresentação, os filhos vão direto para o visual e a cópia', () => {
      const out = prepararSvgBoi(valido, rotulos);
      expect(out).toContain(
        '<g id="peca-dianteiro" role="button" tabindex="0" aria-label="Dianteiro de Boi" data-peca="dianteiro">' +
          '<g data-mapa-visual=""><path d="M0 0h1v1z"/></g>' +
          '<g data-mapa-alvo="" opacity="0" aria-hidden="true"><path d="M0 0h1v1z"/></g></g>',
      );
    });

    it('acha o </g> certo com grupos aninhados dentro da peça', () => {
      const filhos = '<g><g transform="scale(2)"><path d="M1 1z"/></g><g/></g><path d="M2 2z"/>';
      const svg = valido.replace('<g id="peca-pa"><path d="M0 0h1v1z"/></g>', `<g id="peca-pa">${filhos}</g>`);
      const out = prepararSvgBoi(svg, rotulos);
      expect(out).toContain(
        `data-peca="pa"><g data-mapa-visual="">${filhos}</g>` +
          `<g data-mapa-alvo="" opacity="0" aria-hidden="true">${filhos}</g></g><g id="peca-traseiro"`,
      );
      expect(gruposEquilibrados(out)).toBe(true);
    });

    it('a cópia parada não repete ids', () => {
      const svg = valido.replace(
        '<g id="peca-traseiro"><path d="M0 0h1v1z"/></g>',
        `<g id="peca-traseiro"><clipPath id="corte"><path d="M0 0z"/></clipPath><path id='sombra' clip-path="url(#corte)" d="M0 0h1v1z"/></g>`,
      );
      const out = prepararSvgBoi(svg, rotulos);
      expect(out.match(/\sid="corte"/g)).toHaveLength(1);
      expect(out.match(/\sid='sombra'/g)).toHaveLength(1);
      expect(out.match(/clip-path="url\(#corte\)"/g)).toHaveLength(2);
    });

    it('o boi.svg do projeto sai bem formado', () => {
      const out = prepararSvgBoi(readFileSync('src/assets/mapa/boi.svg', 'utf8'), rotulos);
      expect(gruposEquilibrados(out)).toBe(true);
      expect(out.match(/data-mapa-visual=/g)).toHaveLength(3);
      expect(out.match(/data-mapa-alvo=/g)).toHaveLength(3);
    });

    it('rejeita peça sem </g>', () => {
      const svg = valido.replace(
        '<g id="peca-traseiro"><path d="M0 0h1v1z"/></g>',
        '<g id="peca-traseiro"><path d="M0 0z"/>',
      );
      expect(problemasDe(svg)).toContain('A peça "peca-traseiro" não tem </g> de fechamento');
    });
  });

  describe('filtro do destaque (o Safari ignora as funções de filtro do CSS em elementos do SVG)', () => {
    it('injeta um único <filter id="mapa-destaque"> logo depois da raiz, cobrindo o viewBox com margem', () => {
      const out = prepararSvgBoi(valido, rotulos);
      expect(out.match(/\sid="mapa-destaque"/g)).toHaveLength(1);
      expect(out).toMatch(
        /^<svg[^>]*><defs><filter id="mapa-destaque" filterUnits="userSpaceOnUse" x="-20" y="-20" width="360" height="240" color-interpolation-filters="sRGB">/,
      );
      // Brilho (brightness 1,12), brilho dourado e sombra marinho: os mesmos valores do destaque em CSS.
      expect(out).toContain(
        '<feComponentTransfer in="SourceGraphic" result="claro"><feFuncR type="linear" slope="1.12"/>' +
          '<feFuncG type="linear" slope="1.12"/><feFuncB type="linear" slope="1.12"/></feComponentTransfer>',
      );
      expect(out).toContain(
        '<feDropShadow in="claro" dx="0" dy="0" stdDeviation="2.5" flood-color="#C9A45C" flood-opacity="0.9" result="brilho"/>',
      );
      expect(out).toContain(
        '<feDropShadow in="brilho" dx="0" dy="6" stdDeviation="3" flood-color="#0B1633" flood-opacity="0.35"/></filter></defs>',
      );
    });

    it('a região, o brilho e a sombra acompanham a escala e a origem do viewBox', () => {
      const out = prepararSvgBoi(montar(PECAS, '', '<svg viewBox="10 20 1600 1000">'), rotulos);
      expect(out).toContain(
        '<filter id="mapa-destaque" filterUnits="userSpaceOnUse" x="-90" y="-80" width="1800" height="1200"',
      );
      expect(out).toContain('dx="0" dy="0" stdDeviation="12.5"');
      expect(out).toContain('dx="0" dy="30" stdDeviation="15"');
    });

    it('rejeita um id "mapa-destaque" no desenho (é do site)', () => {
      expect(problemasDe(montar(PECAS, '<path id="mapa-destaque" d="M0 0z"/>'))).toEqual([
        'O id "mapa-destaque" é reservado para o destaque do site: use outro id no SVG',
      ]);
    });

    it('peça dentro de grupo com transform usa o destaque do CSS (a região do filtro pode não cobri-la)', () => {
      const svg = valido
        .replace('<g id="peca-pa">', `<g transform="scale(0.5)"><g id="peca-pa">`)
        .replace('<g id="peca-traseiro">', `<g style="opacity:1; transform: translate(4px)"><g id="peca-traseiro">`)
        .replace(/(<g id="peca-(?:pa|traseiro)"><path d="M0 0h1v1z"\/><\/g>)/g, '$1</g>');
      const out = prepararSvgBoi(svg, rotulos);
      expect(out).toContain('aria-label="Pá de Boi" data-peca="pa" data-mapa-filtro="css">');
      expect(out).toContain('aria-label="Traseiro de Boi" data-peca="traseiro" data-mapa-filtro="css">');
      expect(out).toContain('aria-label="Dianteiro de Boi" data-peca="dianteiro">');
      expect(gruposEquilibrados(out)).toBe(true);
    });
  });

  it('escapa o rótulo no atributo', () => {
    const out = prepararSvgBoi(valido, { ...rotulos, pa: 'Pá "A" & <B>' });
    expect(out).toContain('aria-label="Pá &quot;A&quot; &amp; &lt;B&gt;"');
  });

  it.each([
    ['sem peca-traseiro', semTraseiro, 'Falta a peça "peca-traseiro"'],
    ['peca-pa duplicada', paDuplicada, 'A peça "peca-pa" aparece 2 vezes'],
    ['com <script>', comScript, 'O SVG não pode ter <script>'],
    ['com <style>', comEstilo, 'O SVG não pode ter <style> (use atributos de apresentação)'],
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
      '<g id="peca-traseiro"><path d="M0 0h1v1z"/></g>',
      '<path id="peca-traseiro" d="M0 0z"/>',
    );
    expect(problemasDe(naoGrupo)).toContain('A peça "peca-traseiro" precisa ser um grupo <g>');

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

  it.each([
    ['href = "#a"', '<use href = "#a"/>'],
    ['href= "#a"', '<use href= "#a"/>'],
    ["xlink:href=' #a'", "<use xlink:href=' #a'/>"],
    ['url( "#a")', '<path fill=\'url( "#a")\' d="M0 0z"/>'],
    ['url com &quot;', '<path style="fill: url(&quot;#a&quot;)" d="M0 0z"/>'],
    ['url com &#39;', '<path style="fill: url(&#39;#a&#39;)" d="M0 0z"/>'],
    ['url com &#34;', '<path style="fill: url(&#34;#a&#34;)" d="M0 0z"/>'],
    ['url com &apos;', '<path style="fill: url(&apos;#a&apos;)" d="M0 0z"/>'],
  ])('aceita referência interna com %s', (_, trecho) => {
    expect(problemasDe(montar(PECAS, trecho))).toEqual([]);
  });

  it.each([
    ['src=', '<path src="boi.png" d="M0 0z"/>'],
    ['url com &quot; externo', '<path style="fill: url(&quot;fonte.woff&quot;)" d="M0 0z"/>'],
    ['url com &#34; externo', '<path style="fill: url(&#34;fonte.woff&#34;)" d="M0 0z"/>'],
    ['url com &apos; externo', '<path style="fill: url(&apos;fonte.woff&apos;)" d="M0 0z"/>'],
    ['href vazio', '<use href=""/>'],
  ])('rejeita referência externa com %s', (_, trecho) => {
    expect(problemasDe(montar(PECAS, trecho))).toEqual([
      'O SVG não pode ter referências externas (links, imagens ou fontes)',
    ]);
  });

  it('rejeita arquivo que não começa com <svg>', () => {
    expect(problemasDe(`<html>${valido}</html>`)).toContain('O arquivo precisa começar com a tag <svg>');
  });

  it('junta todos os problemas antes de lançar', () => {
    const svg = montar(
      PECAS.filter((p) => p !== 'traseiro'),
      '<script>x</script><text>Boi</text>',
      '<svg xmlns="http://www.w3.org/2000/svg">',
    );
    expect(problemasDe(svg)).toEqual([
      'O SVG precisa de viewBox',
      'O SVG não pode ter <script>',
      'O SVG não pode ter <text>',
      'Falta a peça "peca-traseiro"',
    ]);
    expect(() => prepararSvgBoi(svg, rotulos)).toThrow(/O boi\.svg não cumpre o contrato/);
  });
});
