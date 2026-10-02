// Importa o boi feito no Claude Design (SVG com a imagem do desenho embutida e um <path class="corte">
// transparente por corte de varejo) para o formato do mapa:
//   src/assets/mapa/boi.png  o desenho, sem metadados e recortado nas bordas;
//   src/assets/mapa/boi.svg  as áreas clicáveis, com os cortes agrupados nas peças que a Mitata vende.
// Uso: pnpm boi caminho/do/boi_cortes.svg
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

/** Cortes do desenho em cada peça vendida (tabela de preços: Dianteiro, Pá e Traseiro de Boi). */
const CORTES_DA_PECA = {
  dianteiro: ['pescoco', 'cupim', 'acem', 'peito'],
  traseiro: [
    'costela',
    'ponta-de-agulha',
    'bife-do-vazio',
    'capa-de-file',
    'ponta-de-contrafile',
    'bisteca',
    'contrafile',
    'file-mignon',
    'picanha',
    'fraldinha',
    'alcatra',
    'maminha',
    'coxao-mole',
    'coxao-duro',
    'lagarto',
    'patinho',
    'musculo-traseiro',
  ],
  // Por último no arquivo: fica por cima dos quartos.
  pa: ['paleta', 'musculo-dianteiro'],
};
const FOLGA = 6;

const origem = process.argv[2];
if (!origem) {
  console.error('Uso: pnpm boi caminho/do/boi_cortes.svg');
  process.exit(1);
}
const destino = fileURLToPath(new URL('../src/assets/mapa/', import.meta.url));
const svg = readFileSync(origem, 'utf8');

const imagem = svg.match(/href="data:image\/png;base64,([^"]+)"/);
if (!imagem) throw new Error('O SVG não tem a imagem PNG embutida do desenho');

const cortes = new Map();
for (const [tag] of svg.matchAll(/<path\b[^>]*>/g)) {
  const id = tag.match(/\sid="([^"]+)"/)?.[1];
  const d = tag.match(/\sd="([^"]+)"/)?.[1];
  if (id && d) cortes.set(id, d);
}
const esperados = Object.values(CORTES_DA_PECA).flat();
const faltando = esperados.filter((c) => !cortes.has(c));
const sobrando = [...cortes.keys()].filter((c) => !esperados.includes(c));
if (faltando.length || sobrando.length) {
  console.error(`Cortes faltando: ${faltando.join(', ') || '-'}; sem peça: ${sobrando.join(', ') || '-'}`);
  process.exit(1);
}

// Recorta as bordas transparentes; o viewBox do SVG acompanha o recorte, e as áreas continuam alinhadas.
const png = Buffer.from(imagem[1], 'base64');
const { info } = await sharp(png).trim().toBuffer({ resolveWithObject: true });
const { width: larguraTotal, height: alturaTotal } = await sharp(png).metadata();
const x = Math.max(0, -info.trimOffsetLeft - FOLGA);
const y = Math.max(0, -info.trimOffsetTop - FOLGA);
const largura = Math.min(larguraTotal - x, info.width + 2 * FOLGA);
const altura = Math.min(alturaTotal - y, info.height + 2 * FOLGA);

await sharp(png)
  .extract({ left: x, top: y, width: largura, height: altura })
  .png({ palette: true, compressionLevel: 9 })
  .toFile(path.join(destino, 'boi.png'));

const grupos = Object.entries(CORTES_DA_PECA)
  .map(
    ([peca, lista]) =>
      `  <g id="peca-${peca}" fill="#C9A45C" fill-rule="evenodd">\n` +
      lista.map((c) => `    <path data-corte="${c}" d="${cortes.get(c)}"/>`).join('\n') +
      '\n  </g>',
  )
  .join('\n');
writeFileSync(
  path.join(destino, 'boi.svg'),
  `<!-- Gerado por scripts/importar-boi.mjs (pnpm boi): áreas clicáveis sobre o boi.png. -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${largura} ${altura}">\n${grupos}\n</svg>\n`,
);
console.log(`boi.png ${largura}x${altura} e boi.svg (viewBox ${x} ${y} ${largura} ${altura}) gerados`);
