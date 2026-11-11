'use client';

import { tokens } from '@/styles/tokens';
import { useMediaQuery } from './useMediaQuery';

/** Layout mobile/webtoon: abaixo do breakpoint `lg`. */
export const DESKTOP_QUERY = `(min-width: ${tokens.breakpoint.lg}px)`;
/** Só anima scroll horizontal / page flip no desktop e com movimento liberado. */
export const DESKTOP_MOTION_QUERY = `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`;

export function useIsMobile() {
  return !useMediaQuery(DESKTOP_QUERY, true);
}

/** Ponteiro fino com hover (mouse). Falso em touch. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
