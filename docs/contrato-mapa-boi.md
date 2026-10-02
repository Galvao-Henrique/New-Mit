# Mapa do boi: como o desenho entra no site

O desenho vem do Claude Design como **um SVG** com:

- a ilustração do boi embutida como imagem PNG (`<image href="data:image/png;base64,...">`), com os nomes dos cortes escritos nela;
- um `<path>` transparente por corte, com o `id` do corte (ex.: `id="picanha"`), cobrindo a área dele na ilustração.

Para usar um desenho novo, rode `pnpm boi caminho/do/arquivo.svg`. O script `scripts/importar-boi.mjs`:

1. salva a ilustração em `src/assets/mapa/boi.png`, sem metadados e sem as bordas vazias;
2. gera `src/assets/mapa/boi.svg` com as áreas agrupadas nas peças que a Mitata vende (`peca-dianteiro`, `peca-pa`, `peca-traseiro`), no mesmo enquadramento da imagem.

## Cortes de cada peça

| Peça (tabela de preços) | Cortes do desenho                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dianteiro de Boi        | pescoço, cupim, acém, peito (com a Pá, ver abaixo)                                                                                                                                        |
| Pá de Boi               | paleta, músculo dianteiro                                                                                                                                                                 |
| Traseiro de Boi         | costela, ponta de agulha, bife do vazio, capa de filé, ponta de contrafilé, bisteca, contrafilé, filé mignon, picanha, fraldinha, alcatra, maminha, coxão mole, coxão duro, lagarto, patinho, músculo traseiro |

Os ids aceitos são os da tabela em `scripts/importar-boi.mjs` (ex.: `ponta-de-agulha`, `coxao-duro`). Um corte novo no desenho precisa entrar nessa tabela.

## O que o site faz com os arquivos

- `boi.png` fica por baixo; o `boi.svg`, por cima, com as áreas transparentes.
- Ao passar o mouse, tocar ou focar pelo teclado numa peça, ela ganha um véu dourado com brilho, e as outras ficam esmaecidas.
- O Dianteiro de Boi destaca `peca-dianteiro` junto com a `peca-pa`; o Boi Casado destaca as três.
- Língua, fígado e rúmen não aparecem no desenho: ficam só na lista ao lado do mapa.
- No build, `prepararSvgBoi` (`src/lib/mapa.ts`) confere o `boi.svg`: viewBox, as três peças (grupos `<g>`, nenhum dentro do outro), nada de `<script>`, `<style>`, `<text>`, `<image>`, atributos `on...` ou referências externas, e no máximo 150 KB. O id `mapa-destaque` é reservado para o brilho do site.
