# Site Mitata Alimentos: especificação

**Data:** 30/09/2026
**Situação:** aguardando revisão
**Pasta:** `C:\Henrique\vscode\mitata-site` (projeto novo; `mitata-alimentos` continua intacto e serve de fonte dos dados)

## 1. Objetivo

Site institucional e de cotação da **Mitata Alimentos**, atacadista de carnes de São José dos Campos, com entrega diária no Vale do Paraíba.

O site precisa:

- apresentar a empresa com a linguagem visual das duas referências (Kent Quality Foods e Beauty & the Meat): fotos grandes de carne, blocos sobrepostos, ornamentos e títulos em caixa alta;
- usar a identidade da Mitata, com a logo azul e a paleta marinho, dourado e creme;
- levar o cliente a montar uma lista de cotação e enviá-la pelo WhatsApp.

**Critério de sucesso:** um comprador de restaurante, açougue ou mercado entende em poucos segundos que é um atacado com entrega diária na região, encontra o corte que quer e manda a cotação pelo WhatsApp sem preencher formulário.

## 2. Regras de conteúdo

- **Todo o texto em português do Brasil,** inclusive rótulos, botões, ornamentos, textos alternativos e metadados. Nada em inglês.
- **Nenhum fato inventado.** Só entram os dados abaixo e os que já estão em `mitata-alimentos/src/config/site.ts` e `src/data/`.

| Dado | Valor | Fonte |
| --- | --- | --- |
| Público | exclusivo para atacado: restaurantes, açougues e mercados | usuário, 30/09 |
| Entrega | diária, no Vale do Paraíba; **sem retirada** | usuário, 30/09 |
| Pedido mínimo | não citar | usuário, 30/09 |
| Experiência | 50 anos | usuário, 30/09 |
| Cortes | +20 disponíveis (catálogo com 24) | usuário, 30/09 |
| Clientes | +100 atendidos | usuário, 30/09 |
| Compromisso | entrega diária, qualidade, seleção criteriosa, atendimento especializado | usuário, 30/09 |
| WhatsApp | (12) 99705-2003 | `site.ts` |
| Endereço | Rua Adolpho Goll, 132, São José dos Campos, SP | `site.ts` |
| Horário | Seg. a Sáb., 8h às 19h | `site.ts` |
| Domínio, CEP, coordenadas | pendentes (marcadores `[...]`, como hoje) | `site.ts` |

- Fotos de banco de imagens levam o aviso **"imagens ilustrativas"** no catálogo e no mapa.

## 3. Direção visual

### Paleta

| Token | Cor | Uso |
| --- | --- | --- |
| `marinho` | `#0B1633` | fundo das seções escuras |
| `marinho-superficie` | `#14244D` | cards e painéis sobre o marinho |
| `azul-mitata` | `#1B3C91` | logo e blocos de destaque sobrepostos |
| `dourado` | `#C9A45C` | ornamentos, linhas, números, botão principal |
| `creme` | `#F4EDE1` | fundo das seções claras |
| `tinta` | `#1A1D29` | texto sobre o creme |

- Todo par de texto e fundo atinge contraste AA: 4,5:1 para texto normal e 3:1 para texto grande e elementos gráficos.
- O texto sobre o dourado usa `marinho`.

### Tipografia

Todas as fontes vêm pelo `next/font`, servidas pelo próprio site.

| Papel | Fonte | Uso |
| --- | --- | --- |
| Títulos | Zilla Slab | caixa alta, espaçamento largo |
| Destaques | Playfair Display Italic | apenas números e detalhes |
| Texto | Source Sans 3 | texto corrido; mínimo de 16px no celular |

### Ornamentos e composição

- **Divisor próprio:** linha dourada com o círculo da logo no centro, no lugar dos arabescos da Kent. Acompanha os títulos de seção.
- **Rótulos pequenos:** caixa alta e espaçada, acima dos títulos.
- **Alternância de fundos:** marinho, creme, marinho, com blocos azuis e fotos que **atravessam a divisa entre as seções**.
- **Logo:** azul original sobre o creme e versão creme (mesmo desenho, gerada a partir do PNG) sobre o marinho.

### Movimento

- As seções surgem suavemente ao rolar, os números da Essência sobem com contador e as peças do mapa se destacam.
- Com `prefers-reduced-motion`, tudo aparece no estado final, sem animação.

### Fotos

- **Origem:** Unsplash e Pexels, com licença de uso comercial. As fotos são baixadas, reduzidas para no máximo 2400px e guardadas no repositório. Nada é puxado de servidor externo.
- **Registro:** cada foto fica em `src/data/fotos.ts` com arquivo, autor, link de origem, licença e texto alternativo em pt-BR. A página `/creditos` é gerada a partir desse registro.
- **Cortes sem foto livre adequada** (rúmen, moela, pé suíno etc.) usam a foto da categoria.

## 4. Estrutura da página inicial

Página única com âncoras. O menu leva a **Cortes** (`#cortes`), **Sobre** (`#sobre`) e **Contato** (`#contato`).

0. **Topo fixo.**
   - Logo creme à esquerda; *Cortes · Sobre · Contato* no centro; ícone do WhatsApp e botão dourado **"Cotação (n)"** à direita.
   - Começa transparente sobre o hero e fica marinho ao rolar.
   - No celular, o menu abre num painel, e o botão da cotação continua visível.
1. **Hero (marinho, dividido).**
   - À esquerda: rótulo, divisor, título, a linha de apoio "Atacado de bovinos, suínos, aves e linguiças com entrega diária no Vale do Paraíba" e os botões **Ver cortes** e **Cotação pelo WhatsApp**.
   - À direita: foto grande de carne na tábua, sangrando até a borda.
   - No celular, a foto vai para cima.
2. **Diferenciais.** Faixa creme sobreposta à base do hero, com quatro fatos e ícones: *Entrega diária no Vale do Paraíba · Exclusivo para atacado · Bovinos, suínos, aves e linguiças · Pedido direto pelo WhatsApp*.
3. **Mapa do boi** (creme, `#cortes`). Ver a seção 5.
4. **Catálogo** (marinho).
   - Faixa com 4 fotos de categoria, que também funciona como filtro ("Todos" + as 4 categorias).
   - Busca sem acento.
   - Grade dos 24 cortes: foto, nome, tipo (subcategoria) e botão **Adicionar à cotação** / **Remover**.
5. **Compromisso** (creme, `#sobre`). Foto com um bloco azul sobreposto e os 4 pilares numerados.
6. **Para Empresas.** Foto de fundo com um card azul por cima: "Atendimento exclusivo para atacado", com restaurantes, açougues e mercados.
7. **Essência** (marinho). Três números em Playfair Itálico, com contador: **50 anos** de experiência, **+20 cortes** disponíveis e **+100 clientes** atendidos.
8. **Como comprar** (creme, `#contato`). Um passo único, "Fale com a gente no WhatsApp", com botão grande, número, horário e o link "ou monte sua lista de cotação", que volta ao catálogo.
9. **Rodapé** (marinho escuro).
   - Logo, menu, endereço (link para o Google Maps), WhatsApp e horário.
   - A linha "Atacado · Entrega diária no Vale do Paraíba".
   - Links para Créditos das fotos e Privacidade, e o ano atual.

**Outras páginas:**

- `/creditos`: lista das fotos, com autor e link;
- `/privacidade`: texto curto; o site guarda a lista de cotação no navegador e o envio é pelo WhatsApp;
- página 404 no mesmo estilo.

## 5. Mapa do boi

### Comportamento

- **Ilustração:** o boi com aparência 3D; cada peça é uma região separada.
- **Com mouse:**
  - passar o mouse numa peça a destaca: ela se ergue alguns pixels e ganha brilho dourado e sombra, enquanto as outras escurecem;
  - o painel ao lado mostra a peça;
  - clicar fixa a seleção.
- **No celular:** o primeiro toque destaca e fixa a peça; o botão do painel adiciona à cotação.
- **No teclado:** Tab percorre as peças, e Enter ou espaço seleciona. O foco é visível.
- **Painel lateral** (embaixo do mapa, no celular):
  - lista os 7 itens bovinos;
  - mostra o item selecionado com foto ilustrativa, nome, tipo e **Adicionar à cotação**;
  - passar o mouse ou focar um item da lista destaca a região correspondente. O destaque funciona nos dois sentidos.
- **Estado inicial:** sem seleção; texto de ajuda "Passe o mouse ou toque numa parte do boi".

### Peças e cortes

| Peça no SVG | Corte(s) | Destaca |
| --- | --- | --- |
| `peca-dianteiro` | Dianteiro de Boi | `dianteiro` + `pa` (o dianteiro inclui a pá) |
| `peca-pa` | Pá de Boi | `pa` |
| `peca-traseiro` | Traseiro de Boi | `traseiro` |
| `peca-lingua` | Língua Bovina | `lingua` |
| `peca-figado` | Fígado de Bovino | `figado` |
| `peca-rumen` | Rúmen de Bovino | `rumen` |
| (item só no painel) | Boi Casado | `dianteiro` + `pa` + `traseiro` |

Passar o mouse sobre a região `dianteiro` mostra o Dianteiro; sobre `pa`, mostra a Pá.

### Contrato do arquivo `src/assets/mapa/boi.svg`

O desenho vem do Claude Design, feito pelo usuário. Até ele chegar, o site usa um boi provisório que segue o mesmo contrato. **Trocar o desenho é só substituir o arquivo.**

1. **Formato:** um único SVG vetorial, com `viewBox`, sem imagens embutidas, sem `<script>`, sem fontes externas e com no máximo 150 KB.
2. **Grupos:** um `<g>` por peça, com exatamente estes `id`: `peca-dianteiro`, `peca-pa`, `peca-traseiro`, `peca-lingua`, `peca-figado`, `peca-rumen`. Cada grupo contém só as formas daquela peça, incluindo o sombreado dela.
3. **Resto do desenho:** cabeça, patas, contorno e sombra no chão ficam fora desses grupos.
4. **Sem texto dentro do SVG.** Os nomes aparecem no HTML, por acessibilidade e para manter o pt-BR.
5. **Cores e sombreado livres.** O destaque é aplicado por opacidade, brilho, sombra e deslocamento, e funciona com qualquer cor.
6. **Miúdos:** a língua, o fígado e o rúmen são órgãos internos. Podem ser desenhados visíveis (em corte ou transparência) ou como pequenas formas na posição anatômica.

**Na integração:**

- o arquivo é lido no build e validado;
- cada grupo recebe `role="button"`, `tabindex="0"` e `aria-label` com o nome do corte;
- um teste quebra o build se faltar alguma peça ou houver `<script>`.

O texto para colar no Claude Design fica em `docs/contrato-mapa-boi.md`.

## 6. Cotação

- **Adicionar e remover:** o catálogo e o mapa adicionam ou removem cortes da lista.
- **Persistência:** a lista fica guardada no navegador (Zustand com `persist`) e continua lá ao recarregar a página.
- **Barra flutuante:** aparece quando há pelo menos um item e mostra o número de itens mais o botão **Ver cotação**.
- **Painel** (Radix Dialog):
  - lista os itens, cada um com botão de remover;
  - campo opcional de observação;
  - botão **Enviar pelo WhatsApp**, que monta a mensagem com a função de `lib/whatsapp.ts` e abre o `wa.me`;
  - fecha com Esc ou pelo botão Fechar, e o foco volta ao botão que abriu o painel.
- **Lista vazia:** o painel mostra "Sua lista está vazia" e um link para o catálogo.

## 7. Parte técnica

- **Base:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 e pnpm. Todas as rotas são estáticas, e o `next/image` otimiza as fotos.
- **Bibliotecas:** `zustand`, `@radix-ui/react-dialog` e `@phosphor-icons/react`. Sem biblioteca de formulário.
- **Copiado de `mitata-alimentos` e adaptado, com os testes:**
  - `data/cortes.ts` e `data/categorias.ts`;
  - `types/catalogo.ts`;
  - `config/site.ts`, com `entrega` = só entrega, área Vale do Paraíba e sem campo de logo;
  - `lib/whatsapp.ts`, `lib/busca.ts`;
  - `store/cotacao.ts` e `services/cotacao.ts`;
  - as logos em PNG.
- **Organização:**

```
src/
  app/            page.tsx, creditos/, privacidade/, not-found.tsx, sitemap.ts, robots.ts, layout.tsx
  assets/         logos/, fotos/, mapa/boi.svg
  config/site.ts  dados da empresa
  content/        textos das seções (pt-BR)
  data/           cortes, categorias, fotos
  lib/            whatsapp, busca, mapa (leitura e validação do SVG)
  store/          cotacao
  components/
    layout/       Topo, Rodape
    secoes/       Hero, Diferenciais, MapaBoi, Catalogo, Compromisso, Empresas, Essencia, ComoComprar
    cotacao/      BarraCotacao, PainelCotacao
    ui/           Divisor, Rotulo, Botao, Foto, Contador
```

- **SEO:**
  - título e descrição;
  - Open Graph com imagem própria;
  - JSON-LD `LocalBusiness` com endereço, horário, telefone e `areaServed` Vale do Paraíba;
  - `sitemap.xml`, `robots.txt` e `lang="pt-BR"`.
- **Publicação:** fora do escopo. O usuário publica no GitHub e na Vercel.
- **Servidor local:** só para testes e prints, numa porta livre diferente da 3000, que é de outro app do usuário. O servidor é encerrado com `taskkill /T /F`.

## 8. Verificação

A cada etapa:

- `lint`, `typecheck`, `build` e `prettier --check` sem erros.

**Vitest:**

- testes trazidos de whatsapp, busca e cotação;
- integridade do mapa: as 6 peças existem no SVG, sem `<script>`; toda peça tem corte; todo corte bovino tem peça ou está no painel;
- integridade das fotos: toda foto usada tem autor, link, licença e texto alternativo.

**Playwright (Edge):**

- **Menu:** as âncoras levam à seção certa; o menu do celular abre e fecha.
- **Mapa:** mouse, clique e teclado destacam a peça e mostram o painel; o botão adiciona à cotação.
- **Catálogo:** filtro, busca, adicionar e remover.
- **Cotação:** o painel abre; a lista persiste ao recarregar; o link `wa.me` contém os itens.
- **Bordas:** nada passa da borda em 320, 390, 768 e 1440px.
- **Movimento reduzido:** o conteúdo aparece sem animação.

**Acessibilidade:**

- contraste AA;
- foco visível;
- link "Pular para o conteúdo";
- ordem de tabulação igual à visual;
- alvos de toque com pelo menos 44px;
- títulos em ordem (h1 → h2 → h3).

## 9. Etapas

Cada etapa termina com a verificação acima, prints em 390, 768 e 1440px e uma **parada para aprovação**.

1. **Base:** projeto, identidade (tokens, fontes, divisor, logo creme), topo e hero.
2. **Cortes:** diferenciais, mapa do boi (provisório + contrato) e catálogo com a cotação.
3. **Institucional:** compromisso, Para Empresas, essência, como comprar e rodapé.
4. **Fechamento:** créditos, privacidade, 404, SEO e revisão final de qualidade.

## 10. Fora do escopo

- Formulário de cadastro e perguntas frequentes.
- Mapas de suíno, frango e linguiça.
- Newsletter e galeria em carrossel.
- 3D real (Three.js).
- Publicação no GitHub e na Vercel.
- Sistema de pedidos ou integração com o sistema da Mitata.
