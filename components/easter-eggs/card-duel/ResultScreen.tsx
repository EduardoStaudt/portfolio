'use client';

import { motion } from 'framer-motion';
import { duel as copy } from '@/lib/data/eggs';
import { ScreenTone, SpeedLines } from '@/components/manga';
import { Portrait } from './Portrait';

type Props = {
  won: boolean;
  rounds: number;
  onRematch: () => void;
  onLevel: () => void;
  onQuit: () => void;
};

const button =
  'font-display border-[3px] border-(--ink) px-5 py-2.5 text-sm transition-colors hover:bg-ink hover:text-paper';

/** Fim do duelo, como a última página de um capítulo: "FIM" na vitória, "Continua..." na derrota. */
export function ResultScreen({ won, rounds, onRematch, onLevel, onQuit }: Props) {
  const text = won ? copy.win : copy.lose;
  return (
    <div className="relative flex min-h-[26rem] flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10 text-center">
      {won ? (
        <SpeedLines count={90} inner={34} className="opacity-[0.14]" />
      ) : (
        <ScreenTone size={10} fade="up" opacity={0.3} />
      )}
      <div className="relative flex items-end gap-4">
        <Portrait side="player" mood={won ? 'win' : 'hit'} className="h-36 w-32 sm:h-44 sm:w-40" />
        <Portrait
          side="rival"
          mood={won ? 'hit' : 'win'}
          className="h-28 w-24 opacity-90 sm:h-32 sm:w-28"
        />
      </div>
      <motion.p
        initial={{ scale: 2.2, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: won ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        className={`font-display relative leading-none ${won ? 'ink-outline text-[clamp(4rem,16vw,8rem)] text-(--duel-red)' : 'text-[clamp(2.4rem,10vw,5rem)]'}`}
      >
        {text.big}
      </motion.p>
      <p className="relative max-w-md text-base">{text.text}</p>
      <p className="font-bubble relative text-xs opacity-70">
        {rounds} rodada{rounds === 1 ? '' : 's'}
      </p>
      <div className="relative flex flex-wrap justify-center gap-3">
        <button
          type="button"
          data-autofocus
          onClick={onRematch}
          className={`${button} bg-(--duel-red) text-white`}
        >
          {copy.rematch}
        </button>
        <button type="button" onClick={onLevel} className={`${button} bg-paper`}>
          {copy.changeLevel}
        </button>
        <button type="button" onClick={onQuit} className={`${button} bg-paper`}>
          {copy.quit}
        </button>
      </div>
    </div>
  );
}
