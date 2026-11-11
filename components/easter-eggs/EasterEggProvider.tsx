'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { consoleArt, duel as duelCopy, eggs } from '@/lib/data/eggs';
import type { EggId } from '@/lib/data/eggs';
import { unlockEgg, useEggs } from '@/lib/eggs-store';
import { on } from '@/lib/bus';
import { shakeScreen } from '@/lib/shake';
import { KeySequenceListener } from './KeySequenceListener';
import { ChainsawCut } from './ChainsawCut';
import { Grimoire } from './Grimoire';

// o duelo só é baixado quando alguém aceita o desafio
const CardDuel = dynamic(() => import('./card-duel/CardDuel'), { ssr: false });

type Ctx = { unlock: (id: EggId, offerDuel?: boolean) => void };
const EggContext = createContext<Ctx>({ unlock: () => {} });
export const useEggContext = () => useContext(EggContext);

type Toast = { key: number; text: string; offerDuel: boolean };

/** Centraliza os easter eggs: desbloqueio (localStorage), aviso, serra, grimório, duelo de cartas e arte no console. */
export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [grimoire, setGrimoire] = useState(false);
  const [saw, setSaw] = useState(0);
  const [duel, setDuel] = useState(false);
  const closeGrimoire = useCallback(() => setGrimoire(false), []);
  const closeDuel = useCallback(() => setDuel(false), []);
  const { count, total, allFound } = useEggs();

  const unlock = useCallback((id: EggId, offerDuel = false) => {
    unlockEgg(id);
    const egg = eggs.find((e) => e.id === id);
    if (egg) setToast({ key: Date.now(), text: egg.found, offerDuel });
  }, []);
  const winDuel = useCallback(() => unlock('duelo'), [unlock]);

  useEffect(() => {
    if (!toast) return;
    // com o convite para o duelo, o aviso espera mais
    const t = window.setTimeout(() => setToast(null), toast.offerDuel ? 14000 : 5200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(
    () =>
      on('saw', () => {
        setSaw((k) => k + 1);
        shakeScreen(12);
        unlock('serra');
      }),
    [unlock],
  );

  useEffect(
    () =>
      on('grimoire', () => {
        setGrimoire(true);
        unlock('grimorio');
      }),
    [unlock],
  );

  useEffect(() => on('duel', () => setDuel(true)), []);

  useEffect(() => {
    console.log(`%c${consoleArt}`, 'font-family:monospace;font-weight:bold;color:#D7263D');
  }, []);

  const value = useMemo(() => ({ unlock }), [unlock]);

  return (
    <EggContext.Provider value={value}>
      {children}
      <KeySequenceListener />
      <ChainsawCut runKey={saw} />
      <Grimoire open={grimoire} onClose={closeGrimoire} />
      <AnimatePresence>{duel && <CardDuel onClose={closeDuel} onWin={winDuel} />}</AnimatePresence>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-(--z-egg) flex justify-center px-4 print:hidden"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ y: 40, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="bg-paper text-ink shadow-panel pointer-events-auto flex max-w-md flex-wrap items-center gap-x-4 gap-y-1 border-[3px] border-(--ink) px-5 py-3"
            >
              <p className="font-display text-base">{toast.text}</p>
              <p className="font-bubble text-xs">
                Segredos: {count}/{total}
              </p>
              {toast.offerDuel && (
                <button
                  type="button"
                  onClick={() => {
                    setToast(null);
                    setDuel(true);
                  }}
                  className="font-display hover:bg-ink hover:text-paper border-[3px] border-(--ink) bg-[#D7263D] px-3 py-1.5 text-sm text-white transition-colors"
                >
                  {duelCopy.offer} ⚔
                </button>
              )}
              {allFound && (
                <Link
                  href="/segredo"
                  className="font-bubble bg-accent text-on-accent px-2 py-1 text-xs underline"
                >
                  Abrir o capítulo secreto →
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EggContext.Provider>
  );
}
