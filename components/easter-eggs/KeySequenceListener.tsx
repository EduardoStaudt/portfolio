'use client';

import { KONAMI, SAW_WORD } from '@/lib/data/eggs';
import { useKeySequence } from '@/lib/hooks/useKeySequence';
import { emit } from '@/lib/bus';

const openGrimoire = () => emit('grimoire');
const startSaw = () => emit('saw');

/** Escuta as sequências secretas: Konami code (grimório) e o nome do autor (serra). */
export function KeySequenceListener() {
  useKeySequence(KONAMI, openGrimoire);
  useKeySequence(SAW_WORD, startSaw);
  return null;
}
