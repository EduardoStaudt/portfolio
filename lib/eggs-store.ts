'use client';

import { useSyncExternalStore } from 'react';
import { eggs } from '@/lib/data/eggs';
import type { EggId } from '@/lib/data/eggs';

/** Segredos encontrados, guardados no localStorage (lista de ids separada por vírgula). */

const KEY = 'eas:eggs';
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

const parse = (raw: string) =>
  raw.split(',').filter((id): id is EggId => eggs.some((e) => e.id === id));

export function useEggs() {
  const raw = useSyncExternalStore(subscribe, read, () => '');
  const found = parse(raw);
  // só os segredos obrigatórios entram na conta; os opcionais (bônus) ficam de fora
  const required = eggs.filter((e) => !e.optional);
  const count = required.filter((e) => found.includes(e.id)).length;
  return { found, count, total: required.length, allFound: count === required.length };
}

/** Marca um segredo como encontrado. Devolve `true` se era novo. */
export function unlockEgg(id: EggId): boolean {
  const found = parse(read());
  if (found.includes(id)) return false;
  try {
    localStorage.setItem(KEY, [...found, id].join(','));
  } catch {}
  listeners.forEach((l) => l());
  return true;
}

export function resetEggs() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}
