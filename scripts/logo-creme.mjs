// Gera a logo creme a partir da azul (horizontal), preservando o canal alfa.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const pasta = fileURLToPath(new URL('../src/assets/logos/', import.meta.url));
const CREME = { r: 0xf4, g: 0xed, b: 0xe1 };

const origem = path.join(pasta, 'horizontal-azul.png');
const destino = path.join(pasta, 'horizontal-creme.png');

const comAlfa = sharp(origem).ensureAlpha();
const { width, height } = await comAlfa.metadata();
const alfa = await comAlfa.clone().extractChannel(3).raw().toBuffer();

if (alfa.every((valor) => valor === 255)) {
  console.error(`Logo sem fundo transparente: ${path.basename(origem)}`);
  process.exit(1);
}

await sharp({
  create: { width, height, channels: 3, background: CREME },
})
  .joinChannel(alfa, { raw: { width, height, channels: 1 } })
  .png()
  .toFile(destino);

console.log(`Gerado ${path.basename(destino)} (${width}x${height})`);
