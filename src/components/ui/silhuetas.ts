/**
 * Contornos em linha (visão lateral) do boi, do porco e do frango, e os gomos da linguiça.
 * Coordenadas no viewBox 0 0 320 200. Só a geometria do desenho; as regiões de corte ficam de fora.
 */
import type { CategoriaSlug } from '@/types/catalogo';

export const VIEWBOX_SILHUETA = '0 0 320 200';

export interface Traco {
  d: string;
  /** "olho" é preenchido; os demais são só linha. */
  tipo: 'linha' | 'olho';
}

export interface Contorno {
  /** Corpo e patas do lado de cá. */
  corpo: string;
  /** Patas do lado de lá (traço mais fraco). */
  fundo?: string;
  detalhes: Traco[];
}

const circulo = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
const elipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

const boi: Contorno = {
  corpo:
    'M 62 52 C 76 50 88 49 100 50 C 140 50 180 51 210 50 C 232 49 250 46 262 47 C 268 47 272 49 275 52 C 282 60 284 82 281 102 C 280 110 278 116 276 120 C 273 130 274 140 277 148 C 273 158 272 172 273 184 L 275 190 L 262 190 L 262 184 C 262 170 262 160 259 150 C 257 140 252 131 245 127 C 218 135 172 138 134 132 C 131 146 128 166 129 184 L 130 190 L 117 190 L 117 184 C 117 166 116 150 112 138 C 104 131 96 122 92 110 C 85 105 77 99 68 96 C 60 94 50 95 42 95 C 35 95 30 92 28 87 C 26 81 29 74 34 68 C 39 62 45 57 52 54 C 55 53 58 52 62 52 Z',
  fundo:
    'M 146 128 C 146 148 145 168 146 184 L 147 190 L 136 190 L 136 184 C 136 166 137 148 140 130 Z M 244 124 C 250 136 252 150 251 162 C 250 172 250 180 251 186 L 252 190 L 240 190 L 240 184 C 240 172 241 160 240 150 C 238 140 234 132 230 128 Z',
  detalhes: [
    { d: 'M 276 54 C 285 64 287 90 285 118 C 285 124 286 128 288 132', tipo: 'linha' },
    { d: 'M 288 130 C 292 134 291 141 286 142 C 282 142 282 136 284 132 Z', tipo: 'linha' },
    { d: 'M 58 52 C 56 46 56 41 59 37 C 61 42 63 47 66 51', tipo: 'linha' },
    { d: 'M 68 53 C 74 46 82 43 88 44 C 86 50 78 55 70 57 Z', tipo: 'linha' },
    { d: circulo(44, 70, 1.6), tipo: 'olho' },
  ],
};

const porco: Contorno = {
  corpo:
    'M 30 84 C 36 76 44 69 54 64 C 60 61 66 59 74 57 C 110 46 170 42 220 46 C 250 49 272 58 284 74 C 292 88 292 108 284 124 C 280 130 276 134 274 140 C 272 152 272 166 274 178 L 276 184 L 262 184 L 262 178 C 262 166 260 154 256 144 C 250 142 244 141 238 142 C 200 150 150 150 116 142 C 113 152 112 166 113 178 L 114 184 L 100 184 L 100 178 C 100 166 99 152 94 140 C 84 134 72 126 62 118 C 54 114 46 110 40 108 C 34 106 30 104 26 102 C 22 99 21 91 24 87 C 26 85 28 84 30 84 Z',
  fundo:
    'M 130 140 C 130 154 130 166 131 178 L 132 184 L 120 184 L 120 178 C 120 164 121 152 122 142 Z M 250 138 C 252 150 252 164 253 178 L 254 184 L 242 184 L 242 178 C 242 166 242 152 240 142 Z',
  detalhes: [
    { d: 'M 288 80 C 298 74 302 84 296 88 C 290 92 288 82 296 80', tipo: 'linha' },
    { d: 'M 60 62 C 54 52 44 48 36 50 C 38 58 44 66 54 72 Z', tipo: 'linha' },
    { d: elipse(25, 94, 3, 8), tipo: 'linha' },
    { d: circulo(50, 80, 1.6), tipo: 'olho' },
  ],
};

const frango: Contorno = {
  corpo:
    'M 70 40 C 78 40 84 46 83 54 C 88 62 96 70 106 76 C 140 88 196 94 236 94 C 248 86 260 66 272 50 C 278 44 286 46 284 56 C 282 76 270 104 254 122 C 238 144 206 158 164 158 C 120 158 84 138 70 108 C 64 94 62 80 62 66 C 58 64 54 60 52 56 L 45 53 L 53 49 C 55 43 62 40 70 40 Z',
  detalhes: [
    {
      d: 'M 140 154 L 137 184 M 137 184 L 126 190 M 137 184 L 136 192 M 137 184 L 147 190 M 172 154 L 175 184 M 175 184 L 164 190 M 175 184 L 174 192 M 175 184 L 185 190',
      tipo: 'linha',
    },
    {
      d: 'M 62 42 C 60 34 66 30 69 35 C 70 29 76 29 77 34 C 80 30 86 33 83 40 C 80 43 74 42 70 40 C 66 40 64 41 62 42 Z',
      tipo: 'linha',
    },
    { d: 'M 55 58 C 54 66 58 71 62 69 C 62 64 60 60 58 57 Z', tipo: 'linha' },
    { d: 'M 250 70 C 256 86 254 102 246 116 M 264 60 C 268 78 266 96 258 110', tipo: 'linha' },
    { d: circulo(68, 50, 1.7), tipo: 'olho' },
  ],
};

export const contornos: Record<Exclude<CategoriaSlug, 'linguicas'>, Contorno> = {
  bovinos: boi,
  suinos: porco,
  aves: frango,
};

/** Gomos de linguiça: retângulos de pontas redondas. */
export const linguica = {
  gomos: [
    { transform: 'translate(88 118) rotate(-18)' },
    { transform: 'translate(162 100)' },
    { transform: 'translate(236 118) rotate(18)' },
  ],
  brilhos: ['M 66 112 C 74 104 86 99 100 98', 'M 138 94 C 150 90 172 90 184 94', 'M 224 98 C 238 100 250 106 258 114'],
  amarras: [
    { cx: 124, cy: 103 },
    { cx: 200, cy: 103 },
  ],
};
