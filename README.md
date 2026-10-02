# Mitata Alimentos — site

Site institucional e vitrine de cortes da Mitata Alimentos, atacado de carnes em São José dos Campos (SP). Todo o texto está em português do Brasil.

A página inicial reúne: apresentação, diferenciais, o **mapa do boi** (clique numa parte e veja o corte), o **catálogo** de cortes com busca, filtros e páginas, a lista de **cotação** enviada pelo WhatsApp, e as informações de contato. Há ainda as páginas `/creditos` (autores das fotos) e `/privacidade`, além de `sitemap.xml`, `robots.txt` e a imagem de compartilhamento (Open Graph).

**Tecnologias:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI (menu e painel), Zustand (lista de cotação). Testes com Vitest e Playwright (acessibilidade com axe). Gerenciador de pacotes: pnpm.

## Comandos

| Comando                             | O que faz                                                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                      | Instala as dependências (uma vez).                                                                                                                                                                |
| `pnpm dev`                          | Abre o site para desenvolvimento (o endereço aparece no terminal). Se a porta 3000 já estiver em uso por outro programa, use `pnpm dev --port 3217`.                                              |
| `pnpm build`                        | Gera a versão de produção.                                                                                                                                                                        |
| `pnpm start`                        | Serve a versão de produção (rode `pnpm build` antes).                                                                                                                                             |
| `pnpm lint`                         | Confere o estilo e erros comuns do código.                                                                                                                                                        |
| `pnpm typecheck`                    | Confere os tipos do TypeScript.                                                                                                                                                                   |
| `pnpm test`                         | Testes rápidos (dados, mapa do boi, fotos).                                                                                                                                                       |
| `pnpm test:e2e`                     | Testes no navegador, inclusive acessibilidade. Usa a porta 3217 e sobe o servidor sozinho. Precisa do `pnpm build` feito antes.                                                                   |
| `pnpm format` / `pnpm format:check` | Formata o código / só confere a formatação.                                                                                                                                                       |
| `pnpm fotos`                        | Baixa e otimiza as fotos listadas em `src/data/fotos.json`.                                                                                                                                       |
| `pnpm logo` / `pnpm og`             | Gera a logo clara e a imagem de compartilhamento.                                                                                                                                                 |
| `pnpm prints`                       | Tira as capturas de tela (390, 768 e 1440 px) em `docs/prints/etapa-N/`. Para escolher a pasta: `$env:ETAPA='5'; pnpm prints` no PowerShell, ou `ETAPA=5 pnpm prints` no Git Bash, macOS e Linux. |

**Atenção em computador fraco:** o `pnpm dev` é pesado e pode travar a máquina. Prefira `pnpm build` seguido de `pnpm start`, que usa bem menos memória. Rode um comando pesado de cada vez e feche o servidor ao terminar.

## Trocar o desenho do boi

O mapa usa dois arquivos em `src/assets/mapa/`: `boi.png` (o desenho, com os nomes dos cortes) e `boi.svg` (as áreas clicáveis de cada peça, por cima do desenho). Os dois são gerados a partir do SVG exportado do Claude Design:

1. Rode `pnpm boi caminho/do/arquivo.svg` (por exemplo, `pnpm boi C:\Users\User\Downloads\boi_cortes.svg`). O script separa o desenho, recorta as bordas vazias e agrupa os cortes nas peças vendidas: Dianteiro, Pá e Traseiro. Se o desenho tiver um corte que o script não conhece (ou faltar algum), ele para e diz qual. A tabela de cortes de cada peça fica no começo de `scripts/importar-boi.mjs`.
2. Rode `pnpm test`, `pnpm build` e `pnpm test:e2e`. Eles conferem o arquivo e, no navegador, que cada peça aparece, recebe o mouse e o toque e se destaca.

As regras que o SVG do Claude Design precisa cumprir estão em [`docs/contrato-mapa-boi.md`](docs/contrato-mapa-boi.md).

## Adicionar ou trocar uma foto

- **Cadastro:** toda foto fica em `src/data/fotos.json`, com `id`, `arquivo`, `alt` (descrição para leitores de tela), `autor`, `origem` (página da foto), `licenca` (`Unsplash` ou `Pexels`) e `download` (endereço da imagem). O campo `espelhar` é opcional.
- **Baixar:** rode `pnpm fotos`. O script salva em `public/fotos/` e pula as que já existem. Para **trocar** uma foto existente, apague o arquivo dela em `public/fotos/` e rode o comando de novo.
- **Dar uma foto própria a um corte:** em `src/data/cortes.ts`, coloque no corte o campo `foto: 'id-da-foto'`, com o `id` cadastrado no `fotos.json`. Cortes sem esse campo usam a foto da categoria.
- **Créditos:** a página `/creditos` lê o `fotos.json`, então se atualiza sozinha. Mantenha `autor` e `origem` corretos.
- **Foto do hero:** a imagem de compartilhamento (Open Graph) é feita a partir dela. Depois de trocar a foto `hero`, rode `pnpm og` para gerar a imagem de novo.

## Domínio, CEP e coordenadas

Tudo em `src/config/site.ts`:

- `dominio`: troque `'[DOMÍNIO]'` pelo endereço do site, por exemplo `'www.exemplo.com.br'`, sem barra no final.
- `endereco.cep`: troque `'[CEP]'` pelo CEP.
- `endereco.geo`: troque `null` por `{ latitude: ..., longitude: ... }`.

Quando o domínio é preenchido, ele passa a valer no `sitemap.xml`, no endereço canônico das páginas, nas imagens de compartilhamento e no `url` dos dados estruturados (JSON-LD). CEP e coordenadas entram nos dados estruturados, que ajudam o Google a entender o negócio. Enquanto o valor estiver entre colchetes, o site simplesmente não o usa.

## Publicar

A publicação é feita por você, não pelo código:

1. Crie um repositório no GitHub e envie este projeto.
2. Na Vercel, importe o repositório. O Next.js é reconhecido automaticamente e nenhuma configuração é necessária.
3. Não é preciso criar variáveis de ambiente: a Vercel define `VERCEL_PROJECT_PRODUCTION_URL` sozinha, e o site a usa como endereço enquanto o domínio próprio não estiver preenchido em `site.ts`.
4. Depois de comprar o domínio, preencha `dominio` (veja acima), conecte-o na Vercel e publique de novo.

## Onde está o resto

- `docs/especificacao.md`: o que o site deve ter e os dados da empresa.
- `docs/plano-implementacao.md`: o plano de construção, tarefa por tarefa.
- `docs/contrato-mapa-boi.md`: regras do desenho do boi.
- `docs/prints/etapa-N/`: capturas de tela de cada etapa (a final está em `etapa-4`).
- `src/content/home.ts`: os textos da página inicial. `src/data/cortes.ts`: os cortes do catálogo.
