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
  // a página secreta abre com os segredos obrigatórios; os opcionais só somam no contador
  const allFound = eggs.every((e) => e.optional || found.includes(e.id));
  return { found, total: eggs.length, allFound };
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
