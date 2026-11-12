'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { round, seeded } from '@/lib/random';
import { cn } from '@/lib/cn';

type Tail = 'bl' | 'br' | 'tl' | 'tr' | 'none';

type Props = {
  children: ReactNode;
  variant?: 'speech' | 'shout' | 'whisper';
  tail?: Tail;
  seed?: number;
  /** atraso do "pop" em segundos */
  delay?: number;
  /** cores do balão (valores CSS): fundo, texto e contorno; `weight` é a espessura do contorno */
  fill?: string;
  color?: string;
  stroke?: string;
  weight?: number;
  className?: string;
};

const tailPos: Record<Exclude<Tail, 'none'>, string> = {
  bl: '-bottom-[18px] left-[18%]',
  br: '-bottom-[18px] right-[18%] -scale-x-100',
  tl: '-top-[18px] left-[18%] -scale-y-100',
  tr: '-top-[18px] right-[18%] -scale-100',
};

export function burst(seed: number) {
  const rand = seeded(seed);
  const spikes = 22;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 50 : 39 + rand() * 4;
    pts.push(`${round(50 + Math.cos(a) * r)},${round(50 + Math.sin(a) * r)}`);
  }
  return pts.join(' ');
}

export const pop = {
  initial: { scale: 0.4, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true, amount: 0.5 },
} as const;

/** Balão de fala com rabicho. Surge com "pop" ao entrar na tela. */
export function SpeechBubble({
  children,
  variant = 'speech',
  tail = 'bl',
  seed = 3,
  delay = 0,
  fill = 'var(--paper)',
  color,
  stroke = 'var(--ink)',
  weight = 2.5,
  className,
}: Props) {
  const shout = variant === 'shout';
  return (
    <motion.div
      {...pop}
      transition={{ type: 'spring', stiffness: 420, damping: 17, delay }}
      className={cn(
        'font-bubble text-ink relative inline-block max-w-[19rem] text-center text-[0.95rem]',
        shout
          ? 'px-[2.6em] py-[2.2em]'
          : 'rounded-[46%_54%_52%_48%/56%_48%_52%_44%] border-solid px-[1.7em] py-[1.25em]',
        variant === 'whisper' && 'border-dashed',
        className,
      )}
      style={
        shout ? { color } : { color, background: fill, borderColor: stroke, borderWidth: weight }
      }
    >
      {shout && (
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <polygon
            points={burst(seed)}
            fill={fill}
            stroke={stroke}
            strokeWidth={weight}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      <div className="relative">{children}</div>
      {!shout && tail !== 'none' && (
        <svg
          aria-hidden
          width="26"
          height="22"
          viewBox="0 0 26 22"
          className={cn('absolute', tailPos[tail])}
        >
          <path d="M2 2 C6 9 4 15 1 21 C10 17 18 10 23 2 Z" fill={fill} />
          <path
            d="M2.5 1 C6 9 4 15 1 21 C10 17 18 10 22.5 1"
            fill="none"
            stroke={stroke}
            strokeWidth={weight}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={variant === 'whisper' ? '4 4' : undefined}
          />
        </svg>
      )}
    </motion.div>
  );
}
