import { describe, expect, it } from 'vitest';
import { cores } from '@/config/cores';
import { razaoContraste } from './contraste';

describe('razaoContraste', () => {
  it('preto e branco = 21', () => expect(razaoContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 1));

  it.each([
    ['creme', 'marinho', 4.5],
    ['dourado', 'marinho', 4.5],
    ['marinho', 'dourado', 4.5],
    ['creme', 'marinho-superficie', 4.5],
    ['dourado', 'marinho-superficie', 4.5],
    ['tinta', 'creme', 4.5],
    ['azul-mitata', 'creme', 4.5],
    ['creme', 'azul-mitata', 4.5],
    ['dourado-escuro', 'creme', 4.5],
    ['dourado', 'azul-mitata', 3], // só texto grande
  ] as const)('%s sobre %s ≥ %s', (texto, fundo, minimo) => {
    expect(razaoContraste(cores[texto], cores[fundo])).toBeGreaterThanOrEqual(minimo);
  });
});
