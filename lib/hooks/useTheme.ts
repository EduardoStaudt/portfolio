'use client';

import { useSyncExternalStore } from 'react';

export type InkMode = 'bw' | 'color';
export type PageMode = 'light' | 'dark';
export type Theme = { ink: InkMode; page: PageMode };

export const THEME_KEYS = { ink: 'eas:ink', page: 'eas:page' } as const;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', cb);
  return () => {
    listeners.delete(cb);
    mql.removeEventListener('change', cb);
  };
}

// snapshots precisam ser estáveis: string em vez de objeto
function snapshot() {
  const root = document.documentElement;
  const ink: InkMode = root.dataset.ink === 'color' ? 'color' : 'bw';
  const stored = root.dataset.page;
  const page: PageMode =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  return `${ink}:${page}`;
}

export function useTheme(): Theme {
  const value = useSyncExternalStore(subscribe, snapshot, () => 'bw:light');
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

/** Script inline: aplica a escolha salva antes da primeira pintura (sem flash). */
export const themeInitScript = `(function(){try{var d=document.documentElement;var i=localStorage.getItem('${THEME_KEYS.ink}');if(i==='color')d.dataset.ink='color';var p=localStorage.getItem('${THEME_KEYS.page}');if(p==='light'||p==='dark')d.dataset.page=p;if(sessionStorage.getItem('eas:loaded'))d.dataset.skipLoader='1';else sessionStorage.setItem('eas:loaded','1');}catch(e){}})();`;
