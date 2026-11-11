'use client';

import { useCallback, useRef } from 'react';
import { emit } from '@/lib/bus';

const TAPS = 5;
const WINDOW_MS = 1800;

/** Alternativa touch a digitar o nome: cinco toques rápidos na logo ligam a serra. */
export function useLogoTaps() {
  const taps = useRef<number[]>([]);
  return useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < WINDOW_MS), now];
    if (taps.current.length >= TAPS) {
      taps.current = [];
      emit('saw');
    }
  }, []);
}
