'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { pop } from './SpeechBubble';

type Props = {
  children: ReactNode;
  /** lado das bolinhas que ligam o pensamento ao personagem */
  tail?: 'bl' | 'br';
  delay?: number;
  className?: string;
};

/** Balão de pensamento: nuvem com bolinhas. */
export function ThoughtBubble({ children, tail = 'bl', delay = 0, className }: Props) {
  return (
    <motion.div
      {...pop}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
      className={cn(
        'font-bubble bg-paper text-ink relative inline-block max-w-[18rem] rounded-[999px] border-[2.5px] border-(--ink) px-[2em] py-[1.3em] text-center text-[0.9rem]',
        className,
      )}
    >
      {/* gomos da nuvem */}
      <span
        aria-hidden
        className="bg-paper absolute -top-2 left-[22%] h-5 w-9 rounded-t-full border-[2.5px] border-b-0 border-(--ink)"
      />
      <span
        aria-hidden
        className="bg-paper absolute -top-3 left-[48%] h-6 w-11 rounded-t-full border-[2.5px] border-b-0 border-(--ink)"
      />
      <span
        aria-hidden
        className="bg-paper absolute right-[18%] -bottom-2 h-5 w-10 rounded-b-full border-[2.5px] border-t-0 border-(--ink)"
      />
      <div className="relative">{children}</div>
      <span
        aria-hidden
        className={cn(
          'bg-paper absolute -bottom-5 h-3.5 w-3.5 rounded-full border-[2.5px] border-(--ink)',
          tail === 'bl' ? 'left-[16%]' : 'right-[16%]',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'bg-paper absolute -bottom-9 h-2 w-2 rounded-full border-2 border-(--ink)',
          tail === 'bl' ? 'left-[10%]' : 'right-[10%]',
        )}
      />
    </motion.div>
  );
}
