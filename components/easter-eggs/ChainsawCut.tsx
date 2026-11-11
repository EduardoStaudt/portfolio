'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SAW_SHOUT } from '@/lib/data/eggs';

const TEETH = Array.from(
  { length: 60 },
  (_, i) => `${i * 20},40 ${i * 20 + 10},6 ${i * 20 + 20},40`,
).join(' ');

/**
 * Homenagem a Chainsaw Man: digitar "eduardo" faz um corte de serra atravessar a página.
 * Só dentes de serra e onomatopeia: nenhum personagem ou arte oficial.
 */
export function ChainsawCut({ runKey }: { runKey: number }) {
  const [done, setDone] = useState(0);
  if (runKey === 0 || runKey === done) return null;

  return (
    <div
      key={runKey}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-(--z-egg) overflow-hidden print:hidden"
    >
      {/* o rasgo */}
      <motion.div
        className="bg-accent absolute top-1/2 left-0 h-2 w-full origin-left -translate-y-1/2 -rotate-3 border-y-2 border-(--ink)"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.45, 1], ease: 'easeOut' }}
        onAnimationComplete={() => setDone(runKey)}
      />
      {/* a corrente */}
      <motion.svg
        width="1200"
        height="46"
        viewBox="0 0 1200 46"
        className="absolute top-1/2 left-0 -mt-6 -rotate-3"
        initial={{ x: '-1200px' }}
        animate={{ x: '110vw' }}
        transition={{ duration: 0.75, ease: 'easeIn' }}
      >
        <polygon points={TEETH} fill="var(--ink)" stroke="var(--paper)" strokeWidth="2" />
        <rect x="0" y="38" width="1200" height="8" fill="var(--ink)" />
      </motion.svg>
      <motion.p
        className="font-display text-accent ink-outline absolute top-[28%] left-1/2 text-[clamp(2.2rem,10vw,8rem)] whitespace-nowrap"
        initial={{ x: '-50%', scale: 2.6, opacity: 0, rotate: -12 }}
        animate={{ x: '-50%', scale: [2.6, 1, 1.05, 1], opacity: [0, 1, 1, 0], rotate: -8 }}
        transition={{ duration: 1.4, times: [0, 0.18, 0.7, 1] }}
      >
        {SAW_SHOUT}
      </motion.p>
      <motion.p
        className="font-display text-ink ink-outline absolute top-[62%] left-[58%] text-[clamp(2rem,7vw,5rem)] whitespace-nowrap"
        initial={{ scale: 2, opacity: 0, rotate: 10 }}
        animate={{ scale: [2, 1, 1], opacity: [0, 1, 0], rotate: 6 }}
        transition={{ duration: 1.2, delay: 0.15, times: [0, 0.2, 1] }}
      >
        VRRRUM! ヴヴヴ
      </motion.p>
    </div>
  );
}
