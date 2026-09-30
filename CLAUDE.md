# Mitata Alimentos — site novo (Next.js, pnpm, Tailwind 4)
- Todo texto visível, `alt`, `aria-label` e metadados em pt-BR; nada de inglês na interface.
- Nenhum fato inventado: só dados da seção 2 da especificação e de `src/config/site.ts`.
- Paleta `@theme`: marinho, marinho-superficie, azul-mitata, dourado, dourado-escuro, creme, tinta. Em seção creme, use `dourado-escuro`; dourado sobre azul só em texto ≥ 24px.
- Fontes (`next/font/google`): Zilla Slab `font-titulo`, Playfair Display italic `font-destaque`, Source Sans 3 `font-texto`.
- Texto corrido ≥ 16px no celular; alvos de toque ≥ 44×44px; respeitar `prefers-reduced-motion`.
- Âncoras: #inicio, #cortes, #catalogo, #sobre, #contato.
- Testes na porta 3217; a 3000 é de outro app e não se toca.
- Sem remoto, push ou Vercel; commits locais com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Verificação: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format:check && pnpm test:e2e`.
