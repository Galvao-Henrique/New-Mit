/**
 * Leitura do `src/assets/mapa/boi.svg`: confere o contrato (docs/contrato-mapa-boi.md)
 * e prepara as peças para o mapa interativo. Tudo por string/regex, no build.
 *
 * Cada peça sai assim:
 *   <g id="peca-x" role="button" tabindex="0" aria-label="…" data-peca="x">
 *     <g data-mapa-visual="">…desenho da peça…</g>                              ← se ergue e brilha
 *     <g data-mapa-alvo="" opacity="0" aria-hidden="true">…a mesma forma…</g>   ← parada, recebe o mouse
 *   </g>
 * Os atributos de apresentação da peça (transform, filter, opacity, style, class…) descem para um
 * `<g>` interno, para o CSS do destaque não brigar com eles.
 */
import { PECAS, type Peca } from '@/data/mapa';

const LIMITE_BYTES = 150 * 1024;
/** Largura do viewBox em que o destaque (erguer, brilho, foco) foi medido: o do boi provisório. */
const LARGURA_DE_REFERENCIA = 320;

/** Atributos de uma tag, em qualquer ordem e com aspas simples ou duplas (um `>` entre aspas não fecha a tag). */
const ATRIBUTOS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const TAG_SVG_RAIZ = new RegExp(`^<svg\\b(${ATRIBUTOS})>`);
const TAG_QUALQUER = new RegExp(`<([a-zA-Z][\\w:.-]*)\\b(${ATRIBUTOS})>`, 'g');
const TAG_G_OU_FIM = new RegExp(`<g\\b(${ATRIBUTOS})>|<\\/g\\s*>`, 'g');
const VALOR = `(?:"[^"]*"|'[^']*')`;

const PROIBIDAS: [string, string][] = [
  ['script', 'O SVG não pode ter <script>'],
  ['style', 'O SVG não pode ter <style> (use atributos de apresentação)'],
  ['text', 'O SVG não pode ter <text>'],
  ['image', 'O SVG não pode ter <image>'],
  ['foreignObject', 'O SVG não pode ter <foreignObject>'],
];

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

function decodificarAspas(texto: string): string {
  return texto.replace(/&(?:quot|#34|#x22);/gi, '"').replace(/&(?:apos|#39|#x27);/gi, "'");
}

function escaparAtributo(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Largura do viewBox; `undefined` se não houver viewBox e `null` se ele não tiver quatro números válidos. */
function larguraDoViewBox(atributosDaRaiz: string): number | null | undefined {
  const m = atributosDaRaiz.match(/(?:^|\s)viewBox\s*=\s*(?:"([^"]*)"|'([^']*)')/);
  if (!m) return undefined;
  const numeros = (m[1] ?? m[2])
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const valido = numeros.length === 4 && numeros.every(Number.isFinite) && numeros[2] > 0 && numeros[3] > 0;
  return valido ? numeros[2] : null;
}

interface TrechoDaPeca {
  peca: Peca;
  atributos: string;
  /** Início da tag de abertura, fim da abertura, início do `</g>` e fim do `</g>` (iguais para `<g/>`). */
  inicio: number;
  fimDaAbertura: number;
  inicioDoFechamento: number;
  fim: number;
}

/** Percorre os `<g>` e `</g>` com uma pilha: onde cada peça abre e fecha, e os problemas de aninhamento. */
function mapearPecas(svg: string): { trechos: TrechoDaPeca[]; problemas: string[] } {
  const trechos: TrechoDaPeca[] = [];
  const problemas: string[] = [];
  const pilha: { peca: Peca | null; atributos: string; inicio: number; fimDaAbertura: number }[] = [];

  for (const m of svg.matchAll(TAG_G_OU_FIM)) {
    const inicio = m.index;
    const fim = inicio + m[0].length;
    if (m[1] === undefined) {
      const aberto = pilha.pop();
      if (aberto?.peca) trechos.push({ ...aberto, peca: aberto.peca, inicioDoFechamento: inicio, fim });
      continue;
    }
    const peca = pecaDoId(idDe(m[1]));
    if (peca && pilha.some((a) => a.peca !== null)) {
      problemas.push(`A peça "peca-${peca}" não pode ficar dentro de outra peça`);
    }
    if (m[1].trimEnd().endsWith('/')) {
      if (peca) trechos.push({ peca, atributos: m[1], inicio, fimDaAbertura: fim, inicioDoFechamento: fim, fim });
    } else {
      pilha.push({ peca, atributos: m[1], inicio, fimDaAbertura: fim });
    }
  }
  for (const aberto of pilha) {
    if (aberto.peca) problemas.push(`A peça "peca-${aberto.peca}" não tem </g> de fechamento`);
  }
  return { trechos: trechos.sort((a, b) => a.inicio - b.inicio), problemas };
}

function validar(original: string, svg: string): string[] {
  const problemas: string[] = [];
  const raiz = svg.match(TAG_SVG_RAIZ);

  if (!raiz) problemas.push('O arquivo precisa começar com a tag <svg>');
  else {
    const largura = larguraDoViewBox(raiz[1]);
    if (largura === undefined) problemas.push('O SVG precisa de viewBox');
    else if (largura === null) problemas.push('O viewBox precisa de quatro números (x, y, largura e altura positivas)');
  }

  if (new TextEncoder().encode(original).length > LIMITE_BYTES) problemas.push('O SVG passa de 150 KB');

  for (const [nome, mensagem] of PROIBIDAS) {
    if (new RegExp(`<${nome}\\b`, 'i').test(svg)) problemas.push(mensagem);
  }

  const tags = [...svg.matchAll(TAG_QUALQUER)];
  if (tags.some((t) => /(?:^|\s)on[a-z]+\s*=/i.test(semValores(t[2])))) {
    problemas.push('O SVG não pode ter atributos de evento (on...)');
  }

  // Aspas codificadas (&quot;) e espaços antes do # não tornam uma referência interna em externa.
  const atributos = decodificarAspas(tags.map((t) => t[2]).join(' '));
  const externa =
    /(?:^|\s)(?:xlink:)?href\s*=(?!\s*["']\s*#)/i.test(atributos) ||
    /(?:^|\s)src\s*=/i.test(atributos) ||
    /url\((?!\s*['"]?\s*#)/i.test(decodificarAspas(svg)) ||
    /@import\b/i.test(svg);
  if (externa) problemas.push('O SVG não pode ter referências externas (links, imagens ou fontes)');

  for (const p of PECAS) {
    const comId = tags.filter((t) => idDe(t[2]) === `peca-${p}`);
    if (comId.length === 0) problemas.push(`Falta a peça "peca-${p}"`);
    else if (comId.length > 1) problemas.push(`A peça "peca-${p}" aparece ${comId.length} vezes`);
    else if (comId[0][1] !== 'g') problemas.push(`A peça "peca-${p}" precisa ser um grupo <g>`);
  }

  problemas.push(...mapearPecas(svg).problemas);
  return problemas;
}

/** Raiz sem width/height e com `--mapa-escala`, que deixa o destaque igual em qualquer tamanho de viewBox. */
function prepararRaiz(atributos: string, largura: number): string {
  const semTamanho = atributos.replace(new RegExp(`\\s(?:width|height)\\s*=\\s*${VALOR}`, 'g'), '').trimEnd();
  const escala = `--mapa-escala:${Math.round((largura / LARGURA_DE_REFERENCIA) * 10000) / 10000}`;
  const estilo = semTamanho.match(/(\sstyle\s*=\s*)(?:"([^"]*)"|'([^']*)')/);
  if (!estilo) return `<svg${semTamanho} style="${escala}">`;
  const aspas = estilo[2] !== undefined ? '"' : "'";
  const atual = (estilo[2] ?? estilo[3]).trim();
  const novo = atual ? `${atual.replace(/;?\s*$/, ';')}${escala}` : escala;
  return `<svg${semTamanho.replace(estilo[0], () => `${estilo[1]}${aspas}${novo}${aspas}`)}>`;
}

/** Cópia sem `id`, para não repetir ids na página (as referências url(#…) continuam apontando para o original). */
function semIds(markup: string): string {
  return markup.replace(
    TAG_QUALQUER,
    (tag, nome: string, atributos: string) =>
      `<${nome}${atributos.replace(new RegExp(`\\sid\\s*=\\s*${VALOR}`, 'g'), '')}>`,
  );
}

function grupoDaPeca(trecho: TrechoDaPeca, filhos: string, rotulo: string): string {
  const semBarra = trecho.atributos.trimEnd().replace(/\/$/, '');
  const apresentacao = semBarra
    .replace(new RegExp(`\\s(?:id|role|tabindex|aria-label|data-peca)\\s*=\\s*${VALOR}`, 'gi'), '')
    .trim();
  const desenho = apresentacao ? `<g ${apresentacao}>${filhos}</g>` : filhos;
  const peca = trecho.peca;
  return (
    `<g id="peca-${peca}" role="button" tabindex="0" aria-label="${escaparAtributo(rotulo)}" data-peca="${peca}">` +
    `<g data-mapa-visual="">${desenho}</g>` +
    `<g data-mapa-alvo="" opacity="0" aria-hidden="true">${semIds(desenho)}</g></g>`
  );
}

/**
 * Valida o SVG do boi e devolve o markup pronto para a página: sem prólogo, sem width/height na raiz,
 * com `--mapa-escala` e com cada peça focável, nomeada e embrulhada (veja o topo do arquivo).
 * Lança `ErroContratoSvg` com todos os problemas encontrados.
 */
export function prepararSvgBoi(svg: string, rotulos: Record<Peca, string>): string {
  const limpo = limpar(svg);
  const problemas = validar(svg, limpo);
  if (problemas.length > 0) throw new ErroContratoSvg(problemas);

  let saida = '';
  let cursor = 0;
  for (const trecho of mapearPecas(limpo).trechos) {
    const filhos = limpo.slice(trecho.fimDaAbertura, trecho.inicioDoFechamento);
    saida += limpo.slice(cursor, trecho.inicio) + grupoDaPeca(trecho, filhos, rotulos[trecho.peca]);
    cursor = trecho.fim;
  }
  saida += limpo.slice(cursor);

  return saida.replace(TAG_SVG_RAIZ, (_, atributos: string) => prepararRaiz(atributos, larguraDoViewBox(atributos)!));
}
