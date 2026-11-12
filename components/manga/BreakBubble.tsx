'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { round, seeded } from '@/lib/random';
import { shakeScreen } from '@/lib/shake';
import { cn } from '@/lib/cn';
import { SpeechBubble, burst } from './SpeechBubble';

type Props = {
  /** o que o balão mostra antes do clique (a "máscara") */
  text: string;
  /** o que aparece depois que o balão quebra */
  reveal: string;
  tail?: 'bl' | 'br';
  delay?: number;
  className?: string;
};

type Shard = { points: string; dx: number; dy: number; spin: number };

// estilhaços: triângulos do centro até a borda de uma elipse, em um viewBox de 100x60
function shards(seed: number, n = 12): Shard[] {
  const rand = seeded(seed);
  const cx = 46 + rand() * 8;
  const cy = 27 + rand() * 6;
  const ring = Array.from({ length: n }, (_, i) => {
    const a = ((i + (rand() - 0.5) * 0.5) / n) * Math.PI * 2;
    return { x: 50 + Math.cos(a) * 50, y: 30 + Math.sin(a) * 30, a };
  });
  return ring.map((p, i) => {
    const q = ring[(i + 1) % n];
    const mid = (p.a + (i === n - 1 ? q.a + Math.PI * 2 : q.a)) / 2;
    const force = 60 + rand() * 70;
    return {
      points: `${round(cx)},${round(cy)} ${round(p.x)},${round(p.y)} ${round(q.x)},${round(q.y)}`,
      dx: Math.cos(mid) * force,
      dy: Math.sin(mid) * force * 0.7 + 50, // caem um pouco, como vidro
      spin: (rand() - 0.5) * 220,
    };
  });
}

const PIECES = shards(17);
const OUTLINE = burst(11);

/**
 * Balão-máscara: mostra uma pergunta; ao clicar, o balão estilhaça e revela a resposta.
 * Com movimento reduzido a troca é direta. A resposta entra em uma região `aria-live`.
 */
export function BreakBubble({ text, reveal, tail = 'bl', delay = 0, className }: Props) {
  const [state, setState] = useState<'closed' | 'breaking' | 'open'>('closed');
  const reduced = useReducedMotion();

  const crack = () => {
    if (state !== 'closed') return;
    if (reduced) return setState('open');
    setState('breaking');
    shakeScreen(4);
    window.setTimeout(() => setState('open'), 680);
  };

  return (
    <div className={cn('relative', className)} aria-live="polite">
      {state === 'open' ? (
        // resposta: explosão com contorno vermelho grosso, por cima de um contorno de nanquim
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full scale-[1.07] overflow-visible"
          >
            <polygon
              points={OUTLINE}
              fill="var(--ink)"
              stroke="var(--ink)"
              strokeWidth={4}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <SpeechBubble
            variant="shout"
            seed={11}
            stroke="var(--accent)"
            weight={7}
            className="font-display text-[1.25rem]"
          >
            {reveal}
          </SpeechBubble>
        </div>
      ) : (
        <button
          type="button"
          onClick={crack}
          aria-label={`${text} Clique para quebrar o balão e ver a resposta.`}
          className={cn(
            'group relative block cursor-pointer',
            state === 'closed' && 'call-blink hover:[animation-play-state:paused]',
          )}
        >
          <SpeechBubble
            tail={tail}
            delay={delay}
            fill="var(--accent)"
            color="var(--on-accent)"
            weight={3.5}
            className={cn('mb-4', state === 'breaking' && 'invisible')}
          >
            {text}
            <span className="bob mt-1 block text-[0.62em]">▼ clique</span>
          </SpeechBubble>

          {state === 'breaking' && (
            <>
              <svg
                aria-hidden
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-1rem)] w-full overflow-visible"
              >
                {PIECES.map((s, i) => (
                  <motion.polygon
                    key={i}
                    points={s.points}
                    fill="var(--accent)"
                    stroke="var(--ink)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: s.dx, y: s.dy, rotate: s.spin, opacity: [1, 1, 0] }}
                    transition={{ duration: 0.7, ease: [0.2, 0.7, 0.4, 1] }}
                  />
                ))}
              </svg>
              <motion.span
                aria-hidden
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1.15, opacity: [0, 1, 1, 0], rotate: -8 }}
                transition={{ duration: 0.65 }}
                className="font-display text-accent ink-outline pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl whitespace-nowrap"
              >
                パリン!
              </motion.span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
