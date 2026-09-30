// Hex em minúsculas: o Prettier normaliza o CSS assim, e o teste compara com o globals.css.
export const cores = {
  marinho: '#0b1633',
  'marinho-superficie': '#14244d',
  'azul-mitata': '#1b3c91',
  dourado: '#c9a45c',
  'dourado-escuro': '#7a5c24',
  creme: '#f4ede1',
  tinta: '#1a1d29',
} as const;

export type NomeCor = keyof typeof cores;
