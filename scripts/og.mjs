// Gera a imagem de compartilhamento (1200x630): foto do hero recortada, véu marinho de 55% e logo creme centralizada.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = (caminho) => fileURLToPath(new URL(caminho, import.meta.url));
const LARGURA = 1200;
const ALTURA = 630;
const MARINHO = { r: 0x0b, g: 0x16, b: 0x33 };

const registro = JSON.parse(await readFile(raiz('../src/data/fotos.json'), 'utf8'));
const hero = registro.find((f) => f.id === 'hero');
if (!hero) {
  console.error('Foto "hero" não encontrada em fotos.json');
  process.exit(1);
}

let fundo = sharp(raiz(`../public/fotos/${hero.arquivo}`)).rotate();
if (hero.espelhar) fundo = fundo.flop();
const base = await fundo.resize(LARGURA, ALTURA, { fit: 'cover', position: 'centre' }).toBuffer();

const veu = await sharp({
  create: { width: LARGURA, height: ALTURA, channels: 4, background: { ...MARINHO, alpha: 0.55 } },
})
  .png()
  .toBuffer();

const logo = await sharp(raiz('../src/assets/logos/horizontal-creme.png'))
  .resize({ width: 640, withoutEnlargement: true })
  .toBuffer();

await sharp(base)
  .composite([
    { input: veu, left: 0, top: 0 },
    { input: logo, gravity: 'centre' },
  ])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(raiz('../src/app/opengraph-image.jpg'));

console.log(`Gerado opengraph-image.jpg (${LARGURA}x${ALTURA})`);
