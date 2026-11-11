'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { shakeScreen } from '@/lib/shake';

type Props = {
  /** o som, ex.: "ドン!" ou "VRUM!" */
  text: string;
  /** leitura/tradução pequena ao lado */
  sub?: string;
  rotate?: number;
  /** tamanho: qualquer valor CSS de font-size */
  size?: string;
  tone?: 'ink' | 'accent' | 'hollow' | 'orange' | 'blue';
  /** treme a tela de leve quando entra */
  shake?: boolean;
  /** escreve na vertical, como no original japonês */
  vertical?: boolean;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  ink: 'text-ink ink-outline',
  accent: 'text-accent ink-outline',
  orange: 'text-orange ink-outline',
  blue: 'text-blue ink-outline',
  hollow: 'ink-hollow',
};

/** Onomatopeia: entra com impacto. Decorativa (escondida de leitores de tela). */
export function Onomatopoeia({
  text,
  sub,
  rotate = -8,
  size = '4rem',
  tone = 'ink',
  shake = false,
  vertical = false,
  delay = 0,
  className,
  style,
}: Props) {
  return (
    <motion.span
      aria-hidden
      initial={{ scale: 2.4, opacity: 0, rotate: rotate - 10 }}
      whileInView={{ scale: 1, opacity: 1, rotate }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 520, damping: 16, delay }}
      onViewportEnter={() => {
        if (shake) window.setTimeout(() => shakeScreen(5), delay * 1000 + 80);
      }}
      style={{ fontSize: size, ...style }}
      className={cn(
        'font-display pointer-events-none inline-block leading-none whitespace-nowrap select-none',
        vertical && '[writing-mode:vertical-rl]',
        tones[tone],
        className,
      )}
    >
      {text}
      {sub && (
        <span className="font-bubble text-ink ml-1 align-top text-[0.22em] [-webkit-text-stroke:0]">
          {sub}
        </span>
      )}
    </motion.span>
  );
}
