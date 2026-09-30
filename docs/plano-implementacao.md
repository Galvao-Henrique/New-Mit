# Site Mitata: plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Objetivo:** construir o site novo da Mitata Alimentos, uma página única com mapa do boi, catálogo e cotação pelo WhatsApp, na paleta marinho, dourado e creme, inspirada na Kent Quality Foods e na Beauty & the Meat.

**Arquitetura:**
- Next.js com App Router e rotas estáticas.
- Dados e textos em módulos TS (`config/`, `data/`, `content/`), consumidos por componentes de seção.
- Três ilhas client: mapa, catálogo e cotação. A cotação usa Zustand persistido no `localStorage`.
- O SVG do boi é lido e validado no build e injetado já com os atributos de acessibilidade.

**Tecnologias:**
- Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, pnpm.
- Zustand 5, Radix Dialog, Phosphor Icons.
- Vitest 5, Playwright 1.63 (Edge), `@axe-core/playwright`, `sharp` (scripts).

**Especificação:** [`docs/especificacao.md`](especificacao.md), que deve ser lida junto com este plano.
**Fonte dos dados:** `C:\Henrique\vscode\mitata-alimentos`, só para leitura. Nunca alterar essa pasta.

## Restrições globais

- **Idioma:** todo texto visível, `alt`, `aria-label`, metadados e mensagens em **pt-BR**. Nenhuma palavra em inglês na interface.
- **Nenhum fato inventado:** só entram os dados da tabela da seção 2 da especificação e de `site.ts`. Os textos de cada seção estão fixados neste plano, e os que não estão são curtos, sem prometer nada que a tabela não diga.
- **Paleta** (tokens Tailwind `@theme`, com os nomes exatos):

| Token | Cor |
| --- | --- |
| `marinho` | `#0B1633` |
| `marinho-superficie` | `#14244D` |
| `azul-mitata` | `#1B3C91` |
| `dourado` | `#C9A45C` |
| `dourado-escuro` | `#7A5C24` (novo, veja abaixo) |
| `creme` | `#F4EDE1` |
| `tinta` | `#1A1D29` |

- **Contraste:**
  - o `dourado` dá **2,0:1 sobre o creme**, então nas seções creme o dourado é sempre `dourado-escuro` (5,3:1);
  - o `dourado` sobre o `azul-mitata` dá 4,3:1, então só é usado em texto grande (≥ 24px) ou ornamento; o texto normal nos blocos azuis é `creme`.
- **Fontes** (`next/font/google`, `display: 'swap'`):

| Fonte | Variável CSS | Token |
| --- | --- | --- |
| Zilla Slab 500/600/700 | `--font-zilla` | `font-titulo` |
| Playfair Display italic 400/600 | `--font-playfair` | `font-destaque` |
| Source Sans 3 400/600 | `--font-source` | `font-texto` |

- **Tamanhos:** o texto corrido tem no mínimo 16px no celular. Os alvos de toque têm no mínimo 44×44px.
- **Movimento:** todo movimento respeita `prefers-reduced-motion: reduce`, mostrando o estado final sem animação.
- **Âncoras:**

| Âncora | Seção |
| --- | --- |
| `#inicio` | hero |
| `#cortes` | mapa |
| `#catalogo` | catálogo |
| `#sobre` | compromisso |
| `#contato` | como comprar |

  O menu tem *Cortes → #cortes*, *Sobre → #sobre* e *Contato → #contato*.
- **Porta de testes:** `3217`. A 3000 é de outro app do usuário e não deve ser tocada.
  - Scripts que sobem servidor com `spawn` + shell encerram com `taskkill /T /F`.
- **Publicação proibida:**
  - não criar remoto, não dar push e não usar a Vercel;
  - commits locais apenas, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Paradas para aprovação:** ao fim das Tarefas 5, 7, 8 e 10, rodar a verificação completa, gerar os prints e **parar** até o usuário aprovar.
- **Verificação completa:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format:check && pnpm test:e2e`, sem erros.

## Foco de revisão

Casos que a especificação implica mas nenhum fluxo principal exercita. Cada um tem um teste na tarefa dona do código.

1. **O SVG do Claude Design vem com formatação diferente do provisório:**
   - aspas simples, o `id` depois de outros atributos, grupos aninhados dentro de um `<g transform>`;
   - `width`/`height` fixos, prólogo `<?xml?>` e comentários.

   `prepararSvgBoi` deve aceitar todos esses casos e rejeitar apenas quebras reais do contrato (Tarefa 6).
2. **`localStorage` antigo ou corrompido:** JSON inválido, versão antiga ou um corte que saiu do catálogo. A página carrega normalmente, e itens desconhecidos são descartados (Tarefas 2 e 7).
3. **Toque no celular:** o navegador dispara `pointerover` e `click` no mesmo toque. O toque deve fixar a peça, e ela não pode "piscar" e sumir (Tarefa 6).
4. **Busca sem resultado:** mostra "Nenhum corte encontrado" e o botão "Limpar busca", em vez de uma grade vazia (Tarefa 7).
5. **JavaScript desligado ou com falha:** as seções com animação de entrada continuam visíveis, e os contadores mostram o número final (Tarefas 5 e 8).

---

## Etapa 1: Base

### Tarefa 1: Projeto e ferramentas

**Arquivos:**
- Criar:
  - `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `next.config.ts`;
  - `eslint.config.mjs`, `postcss.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.gitignore`;
  - `vitest.config.mts`, `playwright.config.ts`, `CLAUDE.md`;
  - `src/app/layout.tsx`, `src/app/page.tsx` (provisório), `src/app/globals.css` (só `@import 'tailwindcss';`);
  - `src/config/site.ts`.
- Teste: `src/config/site.test.ts`

**Interfaces:**
- Produz:
  - `site` (objeto `as const`) e `pendente(valor: string): boolean` em `src/config/site.ts`;
  - alias `@/` → `src/`.

- [ ] **Passo 1: Copiar os arquivos de configuração de `mitata-alimentos`**
  - Copiar: `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `pnpm-workspace.yaml`, `next.config.ts`, `vitest.config.mts`.
  - Em `.gitignore`, acrescentar `test-results/` e `playwright-report/`.
- [ ] **Passo 2: Criar o `package.json`**
  - `"name": "mitata-site"` e o mesmo `packageManager`.
  - Os scripts de `mitata-alimentos`, **sem** `visual:*`, mais:
    - `"test:e2e": "playwright test --project=fluxos"`;
    - `"prints": "playwright test --project=prints"`;
    - `"fotos": "node scripts/baixar-fotos.mjs"`;
    - `"logo": "node scripts/logo-creme.mjs"`.
  - Dependências: `next@16.3.6`, `react@19.2.8`, `react-dom@19.2.8`, `zustand@^5.0.15`, `@radix-ui/react-dialog@^1.1.23`, `@phosphor-icons/react@^2.1.10`.
  - Dependências de desenvolvimento: as de `mitata-alimentos` mais `sharp` e `@axe-core/playwright`.
  - Rodar `pnpm install`.
- [ ] **Passo 3: Criar `playwright.config.ts`**
  - `baseURL: 'http://localhost:3217'`, `channel: 'msedge'` fora do CI, `locale: 'pt-BR'`.
  - `webServer: { command: 'pnpm start --port 3217', url: 'http://localhost:3217', reuseExistingServer: false }`.
  - Projetos: `fluxos` (`/fluxos.*\.spec\.ts/`) e `prints` (`/prints\.spec\.ts/`).
- [ ] **Passo 4: Escrever o teste de `site.ts` (falha)**

```ts
describe('site', () => {
  it('só faz entrega, diária, no Vale do Paraíba', () => {
    expect(site.entrega).toEqual({ diaria: true, retirada: false, area: 'Vale do Paraíba' });
  });
  it('mantém os contatos do site atual', () => {
    expect(site.whatsapp.numero).toBe('5512997052003');
    expect(site.endereco.exibicao).toBe('Rua Adolpho Goll, 132 - São José dos Campos - SP');
    expect(site.horario.exibicao).toBe('Seg. a Sáb. — 8h às 19h');
  });
  it('marca valores pendentes', () => {
    expect(pendente(site.dominio)).toBe(true);
    expect(pendente('mitata.com.br')).toBe(false);
  });
});
```

- [ ] **Passo 5: `pnpm test` falha** (o módulo ainda não existe).
- [ ] **Passo 6: Criar `src/config/site.ts`**
  - Copiar de `mitata-alimentos/src/config/site.ts`, **removendo `logo`**.
  - Trocar `entrega` por `{ diaria: true, retirada: false, area: 'Vale do Paraíba' }`.
  - `ancoras`: `{ inicio: 'inicio', cortes: 'cortes', catalogo: 'catalogo', sobre: 'sobre', contato: 'contato' }`.
- [ ] **Passo 7: Criar `layout.tsx` e o `page.tsx` provisório**
  - `layout.tsx` mínimo com `lang="pt-BR"`; `page.tsx` com um `<h1>` provisório.
  - `CLAUDE.md` com as Restrições globais acima, em 10 linhas no máximo.
- [ ] **Passo 8: Verificar**
  - Rodar `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
  - Esperado: tudo passa e o build lista `/` como estática (○).
- [ ] **Passo 9: Commit** `Projeto Next.js e configuração de dados da empresa`

### Tarefa 2: Catálogo, busca, WhatsApp e lista de cotação (lógica)

**Arquivos:**
- Criar:
  - `src/types/catalogo.ts`, `src/types/cotacao.ts`;
  - `src/data/cortes.ts`, `src/data/categorias.ts`;
  - `src/lib/busca.ts`, `src/lib/whatsapp.ts`;
  - `src/content/cotacao.ts`, `src/store/cotacao.ts`.
- Testes: `src/lib/busca.test.ts`, `src/lib/whatsapp.test.ts`, `src/store/cotacao.test.ts`, `src/data/cortes.test.ts`

**Interfaces:**
- Produz:
  - `type CategoriaSlug = 'bovinos' | 'suinos' | 'aves' | 'linguicas'`
  - `interface Corte { slug: string; nome: string; categoria: CategoriaSlug; subcategoria: string; foto?: string }` (`foto` é o id em `fotos.json`)
  - `interface Categoria { slug: CategoriaSlug; nome: string; descricao: string; foto: string }`
  - `cortes: Corte[]` e `categorias: Categoria[]`
  - `normalizar(t: string): string`, `type FiltroCategoria = CategoriaSlug | 'todos'`, `filtrarCortes(cortes: readonly Corte[], categoria: FiltroCategoria, termo: string): Corte[]`
  - `interface ItemCotacao { corteSlug: string; nome: string; subcategoria: string }`, `interface Cotacao { itens: ItemCotacao[]; observacao?: string }`
  - `whatsappUrl(mensagem?: string, numero?: string): string`, `mensagemCotacao(c: Cotacao): string`
  - `useCotacao`, com estado `{ itens: ItemCotacao[]; observacao: string; painelAberto: boolean }` e as ações `adicionar(corte: Corte)`, `remover(slug: string)`, `alternar(corte: Corte)`, `definirObservacao(texto: string)`, `limpar()`, `abrirPainel()` e `fecharPainel()`
  - `devolverFoco(): void`, `descartarDesconhecidos(itens: unknown, slugs: ReadonlySet<string>): ItemCotacao[]`

- [ ] **Passo 1: Escrever os testes (falham)**
  - `busca.test.ts`: copiar os casos de `normalizar` e `filtrarCortes` de `mitata-alimentos/src/lib/busca.test.ts`. Os testes de paginação ficam de fora.
  - `cortes.test.ts`:

```ts
it('tem os 24 cortes do site atual, na mesma ordem e com slugs únicos', () => {
  expect(cortes).toHaveLength(24);
  expect(cortes[0].slug).toBe('boi-casado');
  expect(new Set(cortes.map((c) => c.slug)).size).toBe(24);
});
it('toda categoria tem corte e foto', () => {
  for (const cat of categorias) {
    expect(cortes.some((c) => c.categoria === cat.slug)).toBe(true);
    expect(cat.foto).toBe(`categoria-${cat.slug}`);
  }
});
```

  - `whatsapp.test.ts`:

```ts
it('lista os cortes com o tipo e a observação', () => {
  expect(mensagemCotacao({
    observacao: 'Entrega às terças.',
    itens: [
      { corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino Com Osso' },
      { corteSlug: 'moela', nome: 'Moela', subcategoria: 'Aves' },
    ],
  })).toBe([
    'Olá! Vim pelo site e gostaria de uma cotação para a minha empresa.', '',
    '*Cortes:*', '• Boi Casado (Bovino Com Osso)', '• Moela (Aves)', '',
    '*Observação:* Entrega às terças.',
  ].join('\n'));
});
it('omite a observação vazia', () => { /* observacao: '  ' → sem "Observação" */ });
it('um link com os 24 cortes e observação em várias linhas volta idêntico ao decodificar', () => {
  const c = { itens: cortes.map(({ slug, nome, subcategoria }) => ({ corteSlug: slug, nome, subcategoria })),
              observacao: 'Linha 1\nLinha 2 & 50% 🥩' };
  expect(new URL(whatsappUrl(mensagemCotacao(c))).searchParams.get('text')).toBe(mensagemCotacao(c));
});
```

  Copiar também os dois testes de `whatsappUrl` do projeto atual.
  - `cotacao.test.ts`, com `useCotacao.setState` zerando o estado em `beforeEach`:

```ts
it('adicionar não duplica; alternar remove', () => { /* adicionar(x) 2× → 1 item; alternar(x) → 0 */ });
it('limpar zera itens e observação', () => { /* ... */ });
it('descarta itens de cortes que não existem mais e entradas inválidas', () => {
  const slugs = new Set(['boi-casado']);
  expect(descartarDesconhecidos(
    [{ corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino Com Osso' },
     { corteSlug: 'saiu', nome: 'X', subcategoria: 'Y' }, null, 'lixo'], slugs,
  )).toEqual([{ corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino Com Osso' }]);
  expect(descartarDesconhecidos('não é lista', slugs)).toEqual([]);
});
```

- [ ] **Passo 2: `pnpm test` falha.**
- [ ] **Passo 3: Implementar**
  - **Dados:** copiar `cortes` e `categorias` de `mitata-alimentos/src/data/`, removendo `anatomia`, `destaque`, `indice` e `animal`. Cada categoria ganha `foto: 'categoria-<slug>'`. Os cortes ficam sem `foto` por enquanto (a Tarefa 4 preenche).
  - **WhatsApp:** `whatsappUrl` igual ao atual. `content/cotacao.ts` guarda os rótulos da mensagem (`cortes: 'Cortes'`, `observacao: 'Observação'`).
  - **Store:**
    - `persist`, com `name: 'mitata-site-cotacao'`, `version: 1`, `skipHydration: true` e `partialize` de `itens` e `observacao`;
    - `merge: (salvo, atual) => ({ ...atual, observacao: typeof salvo?.observacao === 'string' ? salvo.observacao : '', itens: descartarDesconhecidos(salvo?.itens, slugsDoCatalogo) })`;
    - `migrate` que devolve `{}` para qualquer versão diferente de 1;
    - `abrirPainel` e `devolverFoco` como no projeto atual.
- [ ] **Passo 4: `pnpm test` passa.**
- [ ] **Passo 5: Commit** `Catálogo, busca, mensagem do WhatsApp e lista de cotação`

### Tarefa 3: Identidade visual

**Arquivos:**
- Criar:
  - `src/config/cores.ts`, `src/lib/contraste.ts`;
  - `src/app/globals.css` (completo);
  - `scripts/logo-creme.mjs`;
  - `src/assets/logos/` (4 PNGs) e `src/assets/logos.ts`;
  - `src/components/ui/Divisor.tsx`, `Rotulo.tsx`, `Botao.tsx`, `Logo.tsx`.
- Modificar: `src/app/layout.tsx` (fontes)
- Testes: `src/lib/contraste.test.ts`, `src/config/cores.test.ts`

**Interfaces:**
- Produz:
  - `cores` (`as const`, com as chaves dos tokens);
  - `razaoContraste(hexA: string, hexB: string): number` (fórmula WCAG 2.x);
  - classes Tailwind `bg-marinho`, `text-dourado-escuro`, `font-titulo` etc.;
  - `<Divisor tom="claro" | "escuro" />`: sobre fundo escuro usa `dourado`, sobre claro usa `dourado-escuro`. É uma linha, o círculo da logo em SVG e outra linha, com `aria-hidden`;
  - `<Rotulo tom="claro" | "escuro">`: caixa alta, `tracking-[0.3em]`, 13px, `font-texto` 600;
  - `<Botao variante="primario" | "contorno" href? onClick? externo?>`: renderiza `<a>` se houver `href` (com `externo` → `target="_blank" rel="noopener noreferrer"`), senão `<button>`. Tem altura mínima de 48px e foco visível;
  - `<Logo versao="azul" | "creme" formato="horizontal" | "circular" className? />`: usa `next/image` com `alt="Mitata Alimentos"`.

- [ ] **Passo 1: Escrever os testes (falham)**

```ts
// contraste.test.ts
it('preto e branco = 21', () => expect(razaoContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 1));
it.each([
  ['creme', 'marinho', 4.5], ['dourado', 'marinho', 4.5], ['marinho', 'dourado', 4.5],
  ['creme', 'marinho-superficie', 4.5], ['dourado', 'marinho-superficie', 4.5],
  ['tinta', 'creme', 4.5], ['azul-mitata', 'creme', 4.5], ['creme', 'azul-mitata', 4.5],
  ['dourado-escuro', 'creme', 4.5], ['dourado', 'azul-mitata', 3], // só texto grande
] as const)('%s sobre %s ≥ %s', (texto, fundo, minimo) => {
  expect(razaoContraste(cores[texto], cores[fundo])).toBeGreaterThanOrEqual(minimo);
});
// cores.test.ts
it('globals.css declara cada token com o mesmo valor', () => {
  const css = readFileSync('src/app/globals.css', 'utf8');
  for (const [nome, hex] of Object.entries(cores)) expect(css).toContain(`--color-${nome}: ${hex};`);
});
```

- [ ] **Passo 2: `pnpm test` falha.**
- [ ] **Passo 3: Implementar `cores.ts`, `contraste.ts` e `globals.css`**
  - `globals.css` tem o `@theme` com as cores e as fontes (`--font-titulo: var(--font-zilla)` etc.).
  - O `body` usa `bg-marinho text-creme font-texto`.
  - Classe `.skip-link`.
  - Regra de reveal: `[data-reveal]` começa com opacidade 0 e deslocamento de 16px **só dentro de `html.js`**. Sem essa classe, o conteúdo aparece. Com `prefers-reduced-motion`, não há deslocamento.
- [ ] **Passo 4: Logos**
  - Copiar `logo-header.png` (horizontal) e `logo-m.png` (circular) de `mitata-alimentos/src/assets/images/` para `src/assets/logos/` como `horizontal-azul.png` e `circular-azul.png`.
  - `scripts/logo-creme.mjs`: para cada PNG azul, `sharp(...).ensureAlpha()`, extrai o canal alfa e compõe esse alfa sobre uma imagem sólida `#F4EDE1` do mesmo tamanho. Grava `horizontal-creme.png` e `circular-creme.png`.
  - Se algum PNG não tiver transparência de verdade (alfa constante 255), o script aborta com a mensagem "Logo sem fundo transparente: <arquivo>".
  - Rodar `pnpm logo` e **abrir as imagens** para conferir.
- [ ] **Passo 5: Fontes e componentes**
  - Configurar as fontes no `layout.tsx`, com um script inline no `<head>` que adiciona `document.documentElement.classList.add('js')`.
  - Criar os componentes de `ui/`.
- [ ] **Passo 6: `pnpm test && pnpm typecheck && pnpm lint` passam.**
- [ ] **Passo 7: Commit** `Identidade visual: paleta, fontes, divisor e logo creme`

### Tarefa 4: Fotos

**Arquivos:**
- Criar:
  - `src/data/fotos.json`, `src/data/fotos.ts`;
  - `scripts/baixar-fotos.mjs`;
  - `public/fotos/*.jpg`;
  - `src/components/ui/Foto.tsx`.
- Modificar: `src/data/cortes.ts` (campo `foto` onde houver foto própria)
- Teste: `src/data/fotos.test.ts`

**Interfaces:**
- Produz:
  - `interface Foto { id: string; arquivo: string; alt: string; autor: string; origem: string; licenca: 'Unsplash' | 'Pexels'; download: string }`
  - `fotos: Foto[]`, `foto(id: string): Foto` (lança `Error('Foto não registrada: <id>')`) e `fotoDoCorte(corte: Corte): Foto` (usa `corte.foto` e, na falta, a foto da categoria)
  - `<Foto foto={Foto} sizes={string} prioridade?={boolean} className? />`: `next/image` com `fill`, `src="/fotos/<arquivo>"`, `alt={foto.alt}` e `object-cover`. O pai define a proporção.
- **Ids obrigatórios:**
  - `hero`;
  - `categoria-bovinos`, `categoria-suinos`, `categoria-aves`, `categoria-linguicas`;
  - `compromisso`, `empresas`.

- [ ] **Passo 1: Escrever o teste (falha)**

```ts
it.each(fotos)('$id tem arquivo, autor, origem, licença e alt em pt-BR', (f) => {
  expect(existsSync(`public/fotos/${f.arquivo}`)).toBe(true);
  expect(f.autor.trim()).not.toBe('');
  expect(new URL(f.origem).hostname).toMatch(/(^|\.)(unsplash|pexels)\.com$/);
  expect(f.alt.length).toBeGreaterThan(10);
});
it('ids obrigatórios existem e são únicos', () => { /* lista acima; Set de ids tem o mesmo tamanho */ });
it('toda foto de corte e de categoria aponta para um id registrado', () => {
  for (const c of cortes) expect(() => fotoDoCorte(c)).not.toThrow();
});
```

- [ ] **Passo 2: `pnpm test` falha.**
- [ ] **Passo 3: Fazer a curadoria**
  - Buscar no Unsplash e no Pexels (WebSearch/WebFetch) fotos de carne crua ou assada sobre **madeira escura, com luz lateral**, horizontais, com licença comercial livre.
  - Para `hero`: peça grande na tábua, com espaço à esquerda ou em cima.
  - Para `compromisso`: açougueiro cortando ou peça sendo preparada.
  - Para `empresas`: cozinha profissional ou balcão de açougue.
  - Para cada corte, tentar uma foto que **seja de fato aquele corte**. Na dúvida, não usar: o corte fica com a foto da categoria.
  - Registrar tudo em `fotos.json`, com `download` = URL direta do arquivo e `alt` descritivo em pt-BR.
  - Não usar fotos com marcas, rótulos ou pessoas identificáveis em primeiro plano.
- [ ] **Passo 4: Criar `scripts/baixar-fotos.mjs`**
  - Lê `src/data/fotos.json` e baixa cada `download` que ainda não existe em `public/fotos/`.
  - Com `sharp`: `.rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true })`.
  - Falha com o id da foto em caso de HTTP ≠ 200.
  - Rodar `pnpm fotos`.
- [ ] **Passo 5: Implementar `fotos.ts` e `Foto.tsx`**
  - Configurar `next.config.ts`: `images: { formats: ['image/avif', 'image/webp'] }`.
- [ ] **Passo 6: `pnpm test` passa; conferir visualmente 3 fotos quaisquer.**
- [ ] **Passo 7: Commit** `Fotos ilustrativas com registro de autoria`

### Tarefa 5: Topo, hero e esqueleto da página

**Arquivos:**
- Criar:
  - `src/content/home.ts`;
  - `src/components/layout/Topo.tsx`, `MenuCelular.tsx`;
  - `src/components/secoes/Hero.tsx`;
  - `src/components/ui/Revelar.tsx`;
  - `e2e/fluxos-base.spec.ts`, `e2e/prints.spec.ts`.
- Modificar: `src/app/page.tsx`, `src/app/layout.tsx`

**Interfaces:**
- Consome: `site`, `Logo`, `Botao`, `Divisor`, `Rotulo`, `Foto`, `foto('hero')`, `useCotacao` (contagem e `abrirPainel`).
- Produz:
  - `home` (textos da página, uma chave por seção);
  - `<Revelar>`: aplica `data-reveal` e adiciona `data-revelado` ao entrar na tela, via `IntersectionObserver`;
  - `<section id>` vazios, na ordem da especificação, para `cortes`, `catalogo`, `sobre` e `contato`, preenchidos nas próximas tarefas.
- **Textos fixos em `home.hero`:**
  - `rotulo`: "Atacado de carnes · São José dos Campos"
  - `titulo`: "Carnes selecionadas para o seu negócio"
  - `apoio`: "Atacado de bovinos, suínos, aves e linguiças com entrega diária no Vale do Paraíba."
  - Botões: "Ver cortes" (`#cortes`) e "Cotação pelo WhatsApp" (`whatsappUrl()`, externo).
- **Topo:**
  - `<header>` fixo, com `data-solido="true"` quando `scrollY > 24` (listener `passive`);
  - `<nav aria-label="Principal">`;
  - botão "Cotação (n)" (`aria-label="Abrir lista de cotação, n itens"`);
  - link do WhatsApp com `aria-label="Falar no WhatsApp"`.
- **Menu do celular** (< 768px): Radix Dialog, com botão `aria-label="Abrir menu"`. Fecha ao escolher um link.

- [ ] **Passo 1: Escrever os testes de fluxo (falham)**, em `fluxos-base.spec.ts`:
  - `menu leva às seções`: clicar em "Sobre" → `#sobre` na tela (`toBeInViewport`).
  - `menu do celular abre e fecha` (390×844): abre, clica em "Cortes", o diálogo some e `#cortes` fica na tela.
  - `topo fica sólido ao rolar`: `data-solido` passa de ausente a `"true"` depois de `window.scrollTo(0, 400)`.
  - `pular para o conteúdo`: o primeiro Tab foca "Pular para o conteúdo".
  - `nada passa da borda`: para as larguras [320, 390, 768, 1440], `document.documentElement.scrollWidth <= innerWidth`.
  - `sem JavaScript o conteúdo aparece`: `test.use({ javaScriptEnabled: false })` → o `h1` do hero está visível e com opacidade 1.
- [ ] **Passo 2: `pnpm build && pnpm test:e2e` falha.**
- [ ] **Passo 3: Implementar**
  - Topo, MenuCelular, Hero (grid de 2 colunas a partir de `lg`; a foto sangra até a borda direita com `prioridade`; no celular, a foto fica em cima com proporção 4/3), Revelar e o esqueleto de `page.tsx`.
  - `page.tsx` inclui o link "Pular para o conteúdo" e `<main id="conteudo">`.
- [ ] **Passo 4: Criar `e2e/prints.spec.ts`**
  - Para cada largura [390, 768, 1440], tira um print da página inteira em `docs/prints/etapa-${process.env.ETAPA}/${largura}.png`.
  - Usa `reducedMotion: 'reduce'`, para as seções aparecerem já reveladas.
- [ ] **Passo 5: Verificação completa passa; `ETAPA=1 pnpm prints`.**
- [ ] **Passo 6: Commit** `Topo, hero e esqueleto da página`
- [ ] **Passo 7: PARADA.** Mostrar os prints ao usuário e esperar aprovação.

---

## Etapa 2: Cortes

### Tarefa 6: Mapa do boi

**Arquivos:**
- Criar:
  - `src/data/mapa.ts`, `src/lib/mapa.ts`;
  - `src/assets/mapa/boi.svg` (provisório);
  - `src/components/secoes/mapa/MapaBoi.tsx` (servidor), `MapaBoiInterativo.tsx` (client);
  - `e2e/fluxos-mapa.spec.ts`.
- Testes: `src/lib/mapa.test.ts`, `src/data/mapa.test.ts`

**Interfaces:**
- Consome: `cortes`, `fotoDoCorte`, `Foto`, `useCotacao.alternar`, `Divisor`, `Rotulo`.
- Produz:
  - `PECAS = ['dianteiro', 'pa', 'traseiro', 'lingua', 'figado', 'rumen'] as const` e `type Peca`
  - `interface ItemMapa { corteSlug: string; peca: Peca | null; destaca: readonly Peca[] }`
  - `itensMapa: ItemMapa[]`, na ordem dos cortes bovinos:

| Corte | `peca` | `destaca` |
| --- | --- | --- |
| `boi-casado` | `null` | `dianteiro`, `pa`, `traseiro` |
| `dianteiro-de-boi` | `dianteiro` | `dianteiro`, `pa` |
| `pa-de-boi` | `pa` | `pa` |
| `traseiro-de-boi` | `traseiro` | `traseiro` |
| `figado-de-bovino` | `figado` | `figado` |
| `lingua-bovina` | `lingua` | `lingua` |
| `rumen-de-bovino` | `rumen` | `rumen` |

  - `itemDaPeca(p: Peca): ItemMapa`
  - `class ErroContratoSvg extends Error { problemas: string[] }`
  - `prepararSvgBoi(svg: string, rotulos: Record<Peca, string>): string`

- [ ] **Passo 1: Escrever os testes (falham)**

```ts
// mapa.test.ts (lib), com um fixture mínimo válido montado no próprio teste
it('adiciona papel de botão, foco e nome a cada peça', () => {
  const out = prepararSvgBoi(valido, rotulos);
  expect(out).toMatch(/<g[^>]*id="peca-pa"[^>]*role="button"[^>]*tabindex="0"[^>]*aria-label="Pá de Boi"[^>]*data-peca="pa"/);
});
it('aceita aspas simples, id depois de outros atributos, prólogo, comentários e grupo aninhado', () => {
  const variante = `<?xml version="1.0"?><!-- Claude Design --><svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><g transform='translate(10 0)'>${
    PECAS.map((p) => `<g class='x' id='peca-${p}'><path d='M0 0h1v1z'/></g>`).join('')}</g></svg>`;
  const out = prepararSvgBoi(variante, rotulos);
  expect(out.startsWith('<svg')).toBe(true);
  expect(out).not.toMatch(/<svg[^>]*\s(width|height)=/);
  expect(out.match(/data-peca=/g)).toHaveLength(6);
});
it.each([
  ['sem peca-rumen', semRumen, 'Falta a peça "peca-rumen"'],
  ['peca-pa duplicada', paDuplicada, 'A peça "peca-pa" aparece 2 vezes'],
  ['com <script>', comScript, 'O SVG não pode ter <script>'],
  ['com <text>', comTexto, 'O SVG não pode ter <text>'],
  ['com <image>', comImagem, 'O SVG não pode ter <image>'],
  ['com onclick', comEvento, 'O SVG não pode ter atributos de evento (on...)'],
  ['sem viewBox', semViewBox, 'O SVG precisa de viewBox'],
  ['maior que 150 KB', grande, 'O SVG passa de 150 KB'],
])('rejeita %s', (_, svg, problema) => {
  expect(() => prepararSvgBoi(svg, rotulos)).toThrow(ErroContratoSvg);
  try { prepararSvgBoi(svg, rotulos); } catch (e) { expect((e as ErroContratoSvg).problemas).toContain(problema); }
});
// mapa.test.ts (data)
it('todo corte bovino está no mapa e toda peça tem um corte', () => { /* slugs de itensMapa = bovinos; PECAS ⊂ peças usadas */ });
it('o boi.svg do projeto cumpre o contrato', () => {
  expect(() => prepararSvgBoi(readFileSync('src/assets/mapa/boi.svg', 'utf8'), rotulosDosCortes)).not.toThrow();
});
```

- [ ] **Passo 2: `pnpm test` falha.**
- [ ] **Passo 3: Implementar `data/mapa.ts` e `lib/mapa.ts`**
  - Tratamento por string/regex:
    - remove o prólogo `<?xml…?>`, o `<!DOCTYPE…>` e os comentários;
    - remove `width` e `height` **só** da tag `<svg>` raiz;
    - valida e junta **todos** os problemas antes de lançar;
    - injeta os atributos na tag de abertura de cada `<g … id=["']peca-X["'] …>`.
  - A regex de tag deve aceitar atributos em qualquer ordem, com aspas simples ou duplas.
- [ ] **Passo 4: Criar o `boi.svg` provisório**
  - Usa a geometria do boi de `mitata-alimentos/src/components/ilustracoes/silhuetas.ts` (viewBox `0 0 320 200`): contorno, `fundo`, `detalhes` e as 6 regiões.
  - As regiões do tipo `recorte` usam `clip-path` com o contorno, definido em `<defs>`.
  - O corpo tem degradê linear de `#1B3C91` a `#0B1633`, as divisões entre peças são em `#C9A45C` e os órgãos são elipses com opacidade 0,85.
  - Tudo fora dos grupos de peça fica fora dos `<g id="peca-…">`.
- [ ] **Passo 5: Implementar os componentes**
  - **`MapaBoi`** (servidor): `readFileSync(path.join(process.cwd(), 'src/assets/mapa/boi.svg'))` → `prepararSvgBoi` → passa `svgHtml` e os itens (corte + foto) para `MapaBoiInterativo`.
  - **Estado de `MapaBoiInterativo`:**
    - `sobre: string | null`, a peça em foco, definida por `pointerover` só se `pointerType === 'mouse'` e por `focusin`;
    - `fixo: string | null`, definido por `click` e por Enter/Espaço;
    - exibido = `sobre ?? fixo`;
    - `pointerleave` no contêiner e `focusout` para fora dele zeram `sobre`;
    - o clique na mesma peça **não** desmarca.
  - **Destaque:** um efeito aplica `data-estado="ativo" | "inativo"` aos `[data-peca]` (sem nada selecionado, remove o atributo).
  - **CSS em `globals.css`:**
    - `[data-peca]` com `cursor: pointer`, `transform-box: fill-box`, `transform-origin: center` e `transition` de `transform`, `filter` e `opacity` em 200ms;
    - `ativo`: `translateY(-4px)`, `drop-shadow` dourado e `brightness(1.12)`;
    - `inativo`: `opacity: .45`;
    - `:focus-visible`: `outline` dourado;
    - com movimento reduzido, sem `translate`.
  - **Painel:**
    - lista dos 7 itens (`<button aria-pressed>`); passar o mouse ou focar um item define `sobre`;
    - card do item exibido com `Foto`, nome (`aria-live="polite"`), subcategoria, "Imagem ilustrativa" e o botão "Adicionar à cotação" / "Remover da cotação";
    - estado vazio: "Passe o mouse ou toque numa parte do boi".
  - **Seção:** `id="cortes"`, fundo creme, título "Conheça o boi Mitata" e rótulo "Mapa de cortes".
  - **Layout:** a partir de `lg`, o boi ocupa 7 colunas e o painel 5; abaixo disso, o painel fica embaixo do boi.
- [ ] **Passo 6: Escrever os testes de fluxo**, em `fluxos-mapa.spec.ts`:
  - `passar o mouse na pá destaca só a pá`: `#peca-pa` ativo, `#peca-traseiro` inativo, o painel mostra "Pá de Boi".
  - `Boi Casado na lista destaca dianteiro, pá e traseiro`: os 3 ativos e `#peca-figado` inativo.
  - `teclado`: Tab até `#peca-traseiro`, Enter → o painel mostra "Traseiro de Boi"; depois de tirar o mouse de cima, continua.
  - `toque fixa a peça` (`hasTouch: true`, `isMobile: true`, 390×844): `tap` em `#peca-dianteiro` → "Dianteiro de Boi"; depois de 500ms, continua exibido e `#peca-dianteiro` segue ativo.
  - `adicionar pelo mapa`: clicar na pá e em "Adicionar à cotação" → o botão do topo mostra "Cotação (1)".
- [ ] **Passo 7: Verificação completa passa.**
- [ ] **Passo 8: Commit** `Mapa do boi interativo com contrato do SVG`

### Tarefa 7: Diferenciais, catálogo e cotação (interface)

**Arquivos:**
- Criar:
  - `src/components/secoes/Diferenciais.tsx`;
  - `src/components/secoes/catalogo/Catalogo.tsx`, `CatalogoInterativo.tsx`, `CardCorte.tsx`;
  - `src/components/cotacao/CotacaoHidratacao.tsx`, `BarraCotacao.tsx`, `PainelCotacao.tsx`;
  - `e2e/fluxos-catalogo.spec.ts`.
- Modificar: `src/app/page.tsx`, `src/content/home.ts`

**Interfaces:**
- Consome: `filtrarCortes`, `FiltroCategoria`, `categorias`, `cortes`, `fotoDoCorte`, `foto`, `useCotacao`, `devolverFoco`, `whatsappUrl`, `mensagemCotacao`.
- **Textos fixos:**
  - **Diferenciais** (Phosphor, peso `light`, `aria-hidden`):

| Ícone | Texto |
| --- | --- |
| `Truck` | "Entrega diária no Vale do Paraíba" |
| `Storefront` | "Exclusivo para atacado" |
| `Knife` | "Bovinos, suínos, aves e linguiças" |
| `WhatsappLogo` | "Pedido direto pelo WhatsApp" |

  - **Catálogo:**
    - rótulo "Catálogo", título "Nossos cortes" e o aviso "Imagens ilustrativas";
    - campo com rótulo visível "Buscar corte" e placeholder "Ex.: picanha, fígado…";
    - contagem "N cortes" / "1 corte" (`aria-live="polite"`);
    - sem resultado: "Nenhum corte encontrado para “{termo}”." e o botão "Limpar busca".
  - **Painel:**
    - título "Sua lista de cotação";
    - campo "Observação (opcional)", com placeholder "Ex.: quantidades, dia de entrega";
    - botão "Enviar pelo WhatsApp";
    - lista vazia: "Sua lista está vazia." e o link "Ver catálogo" (`#catalogo`, fecha o painel).
  - **Barra:** "{n} {n === 1 ? 'item' : 'itens'} na cotação" e "Ver cotação".
- **Comportamento:**
  - a faixa de categorias tem 5 botões ("Todos" + as 4, com foto), com `aria-pressed`;
  - o card tem `<h3>` com o nome e o botão com `aria-pressed` e o texto "Adicionar à cotação" / "Remover da cotação";
  - "Enviar pelo WhatsApp" é um `<a>` externo com `href={whatsappUrl(mensagemCotacao({ itens, observacao }))}`, e aparece só com a lista não vazia;
  - `CotacaoHidratacao` chama `useCotacao.persist.rehydrate()` no `useEffect`;
  - o painel devolve o foco com `onCloseAutoFocus` → `devolverFoco()`.

- [ ] **Passo 1: Escrever os testes de fluxo (falham)**, em `fluxos-catalogo.spec.ts`:
  - `filtro Aves mostra 8 cortes`, com o contador "8 cortes".
  - `busca sem acento`: "figado" → um card, "Fígado de Bovino".
  - `busca vazia`: "xyz" → a mensagem de nada encontrado; "Limpar busca" → 24 cortes e o campo vazio.
  - `adicionar e remover`: 2 cortes → "Cotação (2)" e a barra com "2 itens na cotação"; remover um no painel → "Cotação (1)".
  - `lista persiste ao recarregar`: 1 corte e a observação "teste"; depois de `reload`, "Cotação (1)" e a observação mantida.
  - `link do WhatsApp`: o `href` começa com `https://wa.me/5512997052003?text=`, e o texto decodificado contém "• Boi Casado (Bovino Com Osso)" e "*Observação:* teste".
  - `Esc fecha e devolve o foco` ao botão "Cotação" do topo.
  - `localStorage corrompido não quebra`: `addInitScript` grava `mitata-site-cotacao` = `'{lixo'` → a página carrega com "Cotação (0)". Com `{"state":{"itens":[{"corteSlug":"saiu","nome":"X","subcategoria":"Y"}]},"version":1}`, também "Cotação (0)".
- [ ] **Passo 2: `pnpm build && pnpm test:e2e` falha.**
- [ ] **Passo 3: Implementar os componentes e ligá-los em `page.tsx`**
  - Diferenciais é uma faixa creme com `-mt-16` sobre a base do hero.
  - O catálogo fica em `id="catalogo"`, fundo marinho, com a grade de 1, 2, 3 e 4 colunas em sm, md e lg.
  - A barra e o painel vão no fim de `page.tsx`.
- [ ] **Passo 4: Verificação completa passa; `ETAPA=2 pnpm prints`.**
- [ ] **Passo 5: Commit** `Diferenciais, catálogo e lista de cotação`
- [ ] **Passo 6: PARADA.** Mostrar os prints e esperar aprovação.

---

## Etapa 3: Institucional

### Tarefa 8: Compromisso, Para Empresas, Essência, Como comprar e rodapé

**Arquivos:**
- Criar:
  - `src/components/secoes/Compromisso.tsx`, `Empresas.tsx`, `Essencia.tsx`, `ComoComprar.tsx`;
  - `src/components/ui/Contador.tsx`;
  - `src/components/layout/Rodape.tsx`;
  - `e2e/fluxos-institucional.spec.ts`.
- Modificar: `src/content/home.ts`, `src/app/page.tsx`

**Interfaces:**
- Consome: `site`, `foto('compromisso')`, `foto('empresas')`, `whatsappUrl`, `Logo`, `Divisor`, `Rotulo`, `Botao`, `Revelar`.
- Produz: `<Contador valor={number} prefixo?={string} sufixo?={string} />`.
  - O HTML do servidor já traz o **valor final**.
  - No cliente, se o movimento não estiver reduzido e o elemento estiver abaixo da tela no momento da montagem, o contador vai a 0 e sobe até o valor em 1,2s (`requestAnimationFrame`, com desaceleração) ao entrar na tela.
  - Tem `aria-label` fixo com o valor final.
- **Textos fixos:**
  - **Compromisso** (`id="sobre"`, creme): rótulo "Sobre a Mitata" e título "Nosso compromisso". Os pilares, numerados de 01 a 04 em `font-destaque`:

| Pilar | Texto |
| --- | --- |
| "Entrega diária" | "Seu pedido chega todos os dias, em todo o Vale do Paraíba." |
| "Qualidade" | "Padrão constante em cada entrega, do primeiro ao último pedido." |
| "Seleção criteriosa" | "Cada peça é escolhida com o cuidado de quem está no ramo há 50 anos." |
| "Atendimento especializado" | "Atendimento direto, de quem entende de carne, pelo WhatsApp." |

    A foto `compromisso` fica com um bloco `azul-mitata` sobreposto, com o título em creme.
  - **Para Empresas** (foto `empresas` de fundo, com véu marinho de 70%):
    - card `azul-mitata` com o rótulo "Para empresas", o título "Atendimento exclusivo para atacado" e o texto "Fornecemos para restaurantes, açougues e mercados de todo o Vale do Paraíba, com entrega diária.";
    - a lista Restaurantes (`ForkKnife`), Açougues (`Knife`) e Mercados (`Storefront`).
  - **Essência** (marinho): 50 (sufixo " anos") "de experiência"; +20 "cortes disponíveis"; +100 "clientes atendidos". Os números em `font-destaque` e `text-dourado`.
  - **Como comprar** (`id="contato"`, creme):
    - rótulo "Contato", título "Como comprar" e o texto "Fale com a gente no WhatsApp: diga os cortes que precisa e receba a sua cotação.";
    - botão primário "Chamar no WhatsApp" (`whatsappUrl()`, externo);
    - a linha `site.whatsapp.exibicao` · `site.horario.exibicao`;
    - o link "ou monte sua lista de cotação" (`#catalogo`).
  - **Rodapé** (`bg-marinho`, borda superior `dourado` a 20%):
    - Logo creme, o menu, o endereço (link `site.endereco.mapsUrl`, externo), o WhatsApp e o horário;
    - a linha "Atacado · Entrega diária no Vale do Paraíba";
    - os links "Créditos das fotos" (`/creditos`) e "Privacidade" (`/privacidade`);
    - "© {ano} Mitata Alimentos", com o ano calculado no cliente (como `AnoAtual` do projeto atual).

- [ ] **Passo 1: Escrever os testes de fluxo (falham)**, em `fluxos-institucional.spec.ts`:
  - `Contato leva a Como comprar`, e o botão "Chamar no WhatsApp" tem `href` `https://wa.me/5512997052003?text=…`.
  - `contadores com movimento reduzido mostram o valor final` (`reducedMotion: 'reduce'`): "50", "+20" e "+100" visíveis logo ao rolar.
  - `contadores animam até o valor final`: rolar até a Essência → `expect(...).toHaveText(/50/)` em até 3s.
  - `sem JavaScript os contadores mostram o valor final`.
  - `rodapé`: os links `/creditos` e `/privacidade` existem; o endereço aponta para o Google Maps.
- [ ] **Passo 2: `pnpm build && pnpm test:e2e` falha.**
- [ ] **Passo 3: Implementar as seções e o rodapé, na ordem da especificação.**
- [ ] **Passo 4: Verificação completa passa; `ETAPA=3 pnpm prints`.**
- [ ] **Passo 5: Commit** `Seções institucionais e rodapé`
- [ ] **Passo 6: PARADA.** Mostrar os prints e esperar aprovação.

---

## Etapa 4: Fechamento

### Tarefa 9: Créditos, privacidade, 404 e SEO

**Arquivos:**
- Criar:
  - `src/app/creditos/page.tsx`, `src/app/privacidade/page.tsx`, `src/app/not-found.tsx`;
  - `src/app/sitemap.ts`, `src/app/robots.ts`;
  - `src/lib/seo.ts`, `src/components/seo/JsonLd.tsx`;
  - `scripts/og.mjs` → `src/app/opengraph-image.jpg`;
  - `src/content/institucional.ts`.
- Modificar: `src/app/layout.tsx` (metadata, JSON-LD)
- Testes: `src/lib/seo.test.ts`, `e2e/fluxos-paginas.spec.ts`

**Interfaces:**
- Produz:
  - `dadosEstruturados(): Record<string, unknown>`;
  - `urlDoSite(): string | null` (`null` enquanto `site.dominio` estiver pendente).
- **Metadata:**
  - título "Mitata Alimentos | Atacado de carnes no Vale do Paraíba";
  - descrição "Atacado de bovinos, suínos, aves e linguiças em São José dos Campos, com entrega diária em todo o Vale do Paraíba. Peça sua cotação pelo WhatsApp.";
  - `metadataBase` só se `urlDoSite()` não for nulo.
- **Privacidade:** texto curto, com três pontos:
  - a lista de cotação fica guardada só no seu navegador;
  - ao enviar, você é levado ao WhatsApp e a conversa segue as regras dele;
  - o site não usa formulário nem cookies de rastreamento.
- **404:** "Página não encontrada" e o botão "Voltar ao início".

- [ ] **Passo 1: Escrever os testes (falham)**

```ts
it('LocalBusiness com contato, horário e Vale do Paraíba', () => {
  const d = dadosEstruturados();
  expect(d['@type']).toBe('LocalBusiness');
  expect(d.telephone).toBe('+5512997052003');
  expect(d.areaServed).toEqual({ '@type': 'AdministrativeArea', name: 'Vale do Paraíba' });
  expect(JSON.stringify(d)).not.toMatch(/retirada|\[/); // nada de retirada nem de marcador pendente
});
it('sem domínio, não publica url nem sitemap', () => {
  expect(urlDoSite()).toBeNull();
  expect(dadosEstruturados()).not.toHaveProperty('url');
});
```

  Fluxos:
  - `/creditos` lista um item por foto de `fotos.json`, com o nome do autor e o link de origem;
  - `/privacidade` tem `h1` "Privacidade";
  - uma rota inexistente responde 404 com "Página não encontrada".
- [ ] **Passo 2: Os testes falham.**
- [ ] **Passo 3: Implementar**
  - **Dados estruturados:** `dadosEstruturados` omite o `geo` quando ele é nulo, o `postalCode` quando está pendente e a `url` quando não há domínio.
  - **Sitemap e robots:** `sitemap.ts` retorna `[]` sem domínio. `robots.ts` libera tudo e só aponta o sitemap quando há domínio.
  - **Imagem de compartilhamento:** `scripts/og.mjs` recorta `public/fotos/<hero>` para 1200×630 e aplica um véu marinho de 55% e a logo creme centralizada, com `sharp.composite`.
- [ ] **Passo 4: Verificação completa passa.**
- [ ] **Passo 5: Commit** `Créditos, privacidade, 404 e SEO`

### Tarefa 10: Revisão final de qualidade

**Arquivos:**
- Criar: `e2e/fluxos-acessibilidade.spec.ts`, `README.md`
- Modificar: o que as verificações apontarem.

- [ ] **Passo 1: Escrever os testes de acessibilidade**
  - Em `/`, `/creditos` e `/privacidade`, `new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()` → zero violações `serious` ou `critical`.
  - Os títulos de `/` seguem a ordem: exatamente um `h1`, e nenhum salto de nível.
  - Estender "nada passa da borda" a `/creditos` e `/privacidade`.
- [ ] **Passo 2: Rodar e corrigir até passar.**
- [ ] **Passo 3: Revisão manual pelos prints** em 390, 768 e 1440px:
  - alinhamento dos blocos sobrepostos;
  - fotos sem cortes estranhos;
  - nenhuma palavra em inglês (`rg -i "\b(the|since|learn more|select)\b" src`, sem resultado);
  - alvos de toque.
- [ ] **Passo 4: Escrever o `README.md`**, em pt-BR:
  - comandos;
  - como trocar o `boi.svg` (apontando para `docs/contrato-mapa-boi.md`);
  - como adicionar ou trocar uma foto (`fotos.json` + `pnpm fotos`);
  - onde preencher domínio, CEP e coordenadas (`site.ts`);
  - como publicar (GitHub → Vercel, **feito pelo usuário**).
- [ ] **Passo 5: Verificação completa passa; `ETAPA=4 pnpm prints`.**
- [ ] **Passo 6: Commit** `Revisão de acessibilidade e README`
- [ ] **Passo 7: PARADA FINAL.** Mostrar os prints e o resumo e esperar aprovação.
