/**
 * Leitura do `src/assets/mapa/boi.svg`: valida o contrato (docs/contrato-mapa-boi.md)
 * e prepara as peças para o mapa interativo. Tudo por string/regex, no build.
 */
import { PECAS, type Peca } from '@/data/mapa';

const LIMITE_BYTES = 150 * 1024;

/** Atributos de uma tag, em qualquer ordem e com aspas simples ou duplas (um `>` entre aspas não fecha a tag). */
const ATRIBUTOS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const TAG_SVG_RAIZ = new RegExp(`^<svg\\b(${ATRIBUTOS})>`);
const TAG_QUALQUER = new RegExp(`<([a-zA-Z][\\w:.-]*)\\b(${ATRIBUTOS})>`, 'g');
const TAG_G = new RegExp(`<g\\b(${ATRIBUTOS})>`, 'g');
const TAG_G_OU_FIM = new RegExp(`<g\\b(${ATRIBUTOS})>|<\\/g\\s*>`, 'g');

const PROIBIDAS = ['script', 'text', 'image', 'foreignObject'] as const;

export class ErroContratoSvg extends Error {
  readonly problemas: string[];

  constructor(problemas: string[]) {
    super(`O boi.svg não cumpre o contrato:\n- ${problemas.join('\n- ')}`);
    this.name = 'ErroContratoSvg';
    this.problemas = problemas;
  }
}

/** Tira prólogo, DOCTYPE, comentários e os elementos de texto que não aparecem no desenho. */
function limpar(svg: string): string {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[^>[]*(?:\[[\s\S]*?\])?\s*>/gi, '')
    .replace(new RegExp(`<(title|desc|metadata)\\b${ATRIBUTOS}\\/>`, 'gi'), '')
    .replace(new RegExp(`<(title|desc|metadata)\\b${ATRIBUTOS}>[\\s\\S]*?<\\/\\1\\s*>`, 'gi'), '')
    .trim();
}

function idDe(atributos: string): string | null {
  const m = atributos.match(/(?:^|\s)id\s*=\s*(?:"([^"]*)"|'([^']*)')/);
  return m ? (m[1] ?? m[2]) : null;
}

function pecaDoId(id: string | null): Peca | null {
  if (!id?.startsWith('peca-')) return null;
  const nome = id.slice('peca-'.length);
  return (PECAS as readonly string[]).includes(nome) ? (nome as Peca) : null;
}

function semValores(atributos: string): string {
  return atributos.replace(/"[^"]*"|'[^']*'/g, '""');
}

function escaparAtributo(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function validar(original: string, svg: string): string[] {
  const problemas: string[] = [];
  const raiz = svg.match(TAG_SVG_RAIZ);

  if (!raiz) problemas.push('O arquivo precisa começar com a tag <svg>');
  else if (!/(?:^|\s)viewBox\s*=\s*("[^"]+"|'[^']+')/.test(raiz[1])) problemas.push('O SVG precisa de viewBox');

  if (new TextEncoder().encode(original).length > LIMITE_BYTES) problemas.push('O SVG passa de 150 KB');

  for (const nome of PROIBIDAS) {
    if (new RegExp(`<${nome}\\b`, 'i').test(svg)) problemas.push(`O SVG não pode ter <${nome}>`);
  }

  const tags = [...svg.matchAll(TAG_QUALQUER)];
  if (tags.some((t) => /(?:^|\s)on[a-z]+\s*=/i.test(semValores(t[2])))) {
    problemas.push('O SVG não pode ter atributos de evento (on...)');
  }

  const externa =
    /(?:^|\s)(?:xlink:)?href\s*=\s*(?!["']\s*#)/i.test(tags.map((t) => t[2]).join(' ')) ||
    /url\(\s*(?!['"]?\s*#)/i.test(svg) ||
    /@import\b/i.test(svg);
  if (externa) problemas.push('O SVG não pode ter referências externas (links, imagens ou fontes)');

  for (const p of PECAS) {
    const comId = tags.filter((t) => idDe(t[2]) === `peca-${p}`);
    if (comId.length === 0) problemas.push(`Falta a peça "peca-${p}"`);
    else if (comId.length > 1) problemas.push(`A peça "peca-${p}" aparece ${comId.length} vezes`);
    else if (comId[0][1] !== 'g') problemas.push(`A peça "peca-${p}" precisa ser um grupo <g>`);
  }

  const abertas: (Peca | null)[] = [];
  for (const m of svg.matchAll(TAG_G_OU_FIM)) {
    if (m[1] === undefined) {
      abertas.pop();
      continue;
    }
    const peca = pecaDoId(idDe(m[1]));
    if (peca && abertas.some((a) => a !== null)) {
      problemas.push(`A peça "peca-${peca}" não pode ficar dentro de outra peça`);
    }
    if (!m[1].trimEnd().endsWith('/')) abertas.push(peca);
  }

  return problemas;
}

/**
 * Valida o SVG do boi e devolve o markup pronto para a página: sem prólogo,
 * sem width/height na raiz e com cada peça focável e nomeada.
 * Lança `ErroContratoSvg` com todos os problemas encontrados.
 */
export function prepararSvgBoi(svg: string, rotulos: Record<Peca, string>): string {
  const limpo = limpar(svg);
  const problemas = validar(svg, limpo);
  if (problemas.length > 0) throw new ErroContratoSvg(problemas);

  return limpo
    .replace(TAG_SVG_RAIZ, (_, atributos: string) => {
      const semTamanho = atributos.replace(/\s(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*')/g, '');
      return `<svg${semTamanho}>`;
    })
    .replace(TAG_G, (tag, atributos: string) => {
      const peca = pecaDoId(idDe(atributos));
      if (!peca) return tag;
      const vazio = atributos.trimEnd().endsWith('/');
      const proprios = (vazio ? atributos.trimEnd().slice(0, -1) : atributos)
        .replace(/\s(?:role|tabindex|aria-label|data-peca)\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
        .trimEnd();
      const novos = `role="button" tabindex="0" aria-label="${escaparAtributo(rotulos[peca])}" data-peca="${peca}"`;
      return `<g${proprios} ${novos}${vazio ? '/' : ''}>`;
    });
}
