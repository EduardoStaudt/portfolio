import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = { children: ReactNode; className?: string; inverted?: boolean };

/** Recordatório: caixa retangular de narração. */
export function Caption({ children, className, inverted = false }: Props) {
  return (
    <p
      className={cn(
        'font-bubble inline-block border-[2.5px] border-(--ink) px-3 py-2 text-[0.8rem]',
        inverted ? 'bg-ink text-paper' : 'bg-paper text-ink',
        className,
      )}
    >
      {children}
    </p>
  );
}
