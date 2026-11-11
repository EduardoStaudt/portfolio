'use client';

import { useMemo, useSyncExternalStore } from 'react';

/**
 * Pixel art 12x12 compartilhada: o ateliê da página secreta pinta, e a tela do notebook
 * no Cap. 1 mostra o mesmo desenho. Fica no localStorage como uma sequência de 144 dígitos
 * (cada dígito é o índice da cor em PIXEL_COLORS).
 */

export const PIXEL_SIZE = 12;

export const PIXEL_COLORS = [
  { name: 'Borracha', css: 'transparent' },
  { name: 'Nanquim', css: 'var(--ink)' },
  { name: 'Vermelho', css: 'var(--spot)' },
  { name: 'Laranja', css: 'var(--spot-2)' },
  { name: 'Azul', css: 'var(--spot-3)' },
] as const;

// sprite original: um bichinho de chifres
const SPRITE = [
  '..#......#..',
  '.##......##.',
  '.#o######o#.',
  '.#oooooooo#.',
  '#oo#oooo#oo#',
  '#oo#oooo#oo#',
  '#oooooooooo#',
  '#oo######oo#',
  '#oo#.##.#oo#',
  '.#oooooooo#.',
  '.##oo##oo##.',
  '..##....##..',
];

const DEFAULT = SPRITE.join('').replace(/\./g, '0').replace(/#/g, '1').replace(/o/g, '2');
const EMPTY = '0'.repeat(PIXEL_SIZE * PIXEL_SIZE);
const VALID = new RegExp(`^[0-${PIXEL_COLORS.length - 1}]{${PIXEL_SIZE * PIXEL_SIZE}}$`);

const KEY = 'eas:pixel';
const listeners = new Set<() => void>();

function read(): string {
  try {
    const raw = localStorage.getItem(KEY);
    return raw && VALID.test(raw) ? raw : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function write(raw: string) {
  try {
    if (raw === DEFAULT) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, raw);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

/** As 144 células do desenho atual (índices de PIXEL_COLORS), linha a linha. */
export function usePixels(): number[] {
  const raw = useSyncExternalStore(subscribe, read, () => DEFAULT);
  return useMemo(() => [...raw].map(Number), [raw]);
}

export function paintPixel(index: number, color: number) {
  const raw = read();
  if (Number(raw[index]) === color) return;
  write(raw.slice(0, index) + color + raw.slice(index + 1));
}

export const clearPixels = () => write(EMPTY);
export const resetPixels = () => write(DEFAULT);
