'use client';

import { useEffect, useRef } from 'react';

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/**
 * Dispara `onMatch` quando a sequência de teclas é digitada em qualquer lugar da página.
 * `sequence` usa valores de `KeyboardEvent.key` (ex.: 'ArrowUp', 'v'). Letras ignoram caixa.
 */
export function useKeySequence(sequence: readonly string[], onMatch: () => void) {
  const callback = useRef(onMatch);
  useEffect(() => {
    callback.current = onMatch;
  }, [onMatch]);

  useEffect(() => {
    const wanted = sequence.map((k) => k.toLowerCase());
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      buffer = [...buffer, e.key.toLowerCase()].slice(-wanted.length);
      if (buffer.length === wanted.length && buffer.every((k, i) => k === wanted[i])) {
        buffer = [];
        callback.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sequence]);
}
