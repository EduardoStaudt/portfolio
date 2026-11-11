'use client';

import { useSyncExternalStore } from 'react';
import { chapters } from '@/lib/data/chapters';
import { emit } from '@/lib/bus';

/** Capítulo atual, calculado pela posição do scroll. Um único listener para o site todo. */

let current = chapters[0].id;
let frame = 0;
const listeners = new Set<() => void>();

function compute() {
  frame = 0;
  const mid = window.innerHeight * 0.5;
  let active = chapters[0].id;
  for (const c of chapters) {
    const el = document.getElementById(c.id);
    if (el && el.getBoundingClientRect().top <= mid) active = c.id;
  }
  if (active !== current) {
    current = active;
    listeners.forEach((l) => l());
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(compute);
};

function subscribe(cb: () => void) {
  if (listeners.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  };
}

export function useActiveChapter() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => chapters[0].id,
  );
}

/** Navega para um capítulo com a transição de corte de espada (ver ui/ChapterSlash). */
export function goToChapter(id: string) {
  emit('goto', { id });
}
