'use client';

import { useSyncExternalStore } from 'react';

import { DEFAULT_THEME, THEME_KEYS } from '@/lib/theme';
import type { InkMode, PageMode, Theme } from '@/lib/theme';

export type { InkMode, PageMode, Theme };

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// snapshots precisam ser estáveis: string em vez de objeto
function snapshot() {
  const root = document.documentElement;
  const ink: InkMode = root.dataset.ink === 'bw' ? 'bw' : 'color';
  const page: PageMode = root.dataset.page === 'light' ? 'light' : 'dark';
  return `${ink}:${page}`;
}

export function useTheme(): Theme {
  const value = useSyncExternalStore(
    subscribe,
    snapshot,
    () => `${DEFAULT_THEME.ink}:${DEFAULT_THEME.page}`,
  );
  const [ink, page] = value.split(':') as [InkMode, PageMode];
  return { ink, page };
}

export function setInkMode(ink: InkMode) {
  document.documentElement.dataset.ink = ink;
  try {
    localStorage.setItem(THEME_KEYS.ink, ink);
  } catch {}
  notify();
}

export function setPageMode(page: PageMode) {
  document.documentElement.dataset.page = page;
  try {
    localStorage.setItem(THEME_KEYS.page, page);
  } catch {}
  notify();
}
