// Baixa e otimiza as fotos registradas em src/data/fotos.json para public/fotos/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const pasta = path.join(raiz, 'public', 'fotos');
const fotos = JSON.parse(readFileSync(path.join(raiz, 'src', 'data', 'fotos.json'), 'utf8'));
const NAVEGADOR =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

mkdirSync(pasta, { recursive: true });

for (const foto of fotos) {
  const destino = path.join(pasta, foto.arquivo);
  if (existsSync(destino)) {
    console.log(`já existe: ${foto.id}`);
    continue;
  }
  const resposta = await fetch(foto.download, { headers: { 'User-Agent': NAVEGADOR } });
  if (resposta.status !== 200) {
    console.error(`Falha ao baixar a foto "${foto.id}": HTTP ${resposta.status}`);
    process.exit(1);
  }
  const original = Buffer.from(await resposta.arrayBuffer());
  // `espelhar` (opcional no JSON) inverte a foto na horizontal, para levar o assunto ao lado desejado.
  let imagem = sharp(original).rotate();
  if (foto.espelhar) imagem = imagem.flop();
  const otimizada = await imagem
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  writeFileSync(destino, otimizada);
  console.log(`baixada: ${foto.id} (${Math.round(otimizada.length / 1024)} KB)`);
}
