# Mapa do boi: texto para o Claude Design

Cole o bloco abaixo no Claude Design. Depois exporte o resultado como **SVG** e salve em `src/assets/mapa/boi.svg`, substituindo o provisório. Rode `pnpm test`: se algo estiver fora do contrato, o teste diz o quê.

---

```
Desenhe a ilustração de um boi de corte, de perfil (virado para a esquerda), com aparência 3D:
volume sombreado em degradê, luz vindo da esquerda e leve sombra no chão.
Estilo elegante, para o site de um atacadista de carnes.

Paleta:
- fundo transparente (o site coloca o fundo creme #F4EDE1);
- corpo em tons de azul-marinho (#0B1633, #14244D, #1B3C91);
- detalhes e linhas de divisão entre as peças em dourado (#C9A45C).

O corpo deve estar dividido nas peças de corte, cada uma como um grupo SVG separado,
com exatamente estes ids:
- peca-dianteiro: quarto dianteiro (pescoço, acém, peito), SEM a pá
- peca-pa: a pá / paleta (ombro), na região do dianteiro
- peca-traseiro: quarto traseiro (lombo, alcatra, coxão)
- peca-lingua: a língua, visível na boca
- peca-figado: o fígado, desenhado em transparência na posição anatômica
- peca-rumen: o rúmen, desenhado em transparência na posição anatômica

Regras técnicas obrigatórias:
1. Um único arquivo SVG com viewBox, sem width/height fixos.
2. Cada grupo <g id="peca-..."> contém só as formas daquela peça (inclusive o sombreado dela).
   Os grupos de peça ficam lado a lado: nenhum fica dentro do outro (a pá não vai dentro do dianteiro).
3. Cabeça, patas, rabo, contorno e sombra no chão ficam FORA dos grupos de peças.
4. Nenhum texto dentro do SVG.
5. Sem imagens embutidas (PNG/JPG), sem <script>, sem <style> (cores e estilos como atributos
   de apresentação, ex.: fill="#1B3C91"), sem fontes externas.
6. Tamanho máximo de 150 KB.
```

---

## O que o site faz com o arquivo

- Ao passar o mouse, tocar ou focar pelo teclado numa peça, ela se ergue um pouco e ganha brilho dourado e sombra, e as outras escurecem.
- Os nomes dos cortes aparecem no painel ao lado, em HTML. Por isso o SVG não leva texto.
- O Dianteiro de Boi destaca `peca-dianteiro` junto com a `peca-pa`.
- O Boi Casado destaca o dianteiro, a pá e o traseiro.
