'use client';

import { useEggContext } from './EasterEggProvider';
import { emit } from '@/lib/bus';
import { cn } from '@/lib/cn';

/** Chapéu de palha genérico, desenho próprio. */
export function HatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="46" height="30" viewBox="0 0 46 30" className={className}>
      <ellipse
        cx="23"
        cy="22"
        rx="21"
        ry="6.5"
        fill="var(--spot-2)"
        stroke="var(--ink)"
        strokeWidth="2.2"
      />
      <path
        d="M10 21C10 8 15 3 23 3s13 5 13 18c-8 3 -18 3 -26 0Z"
        fill="var(--spot-2)"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M10.3 17c8 3 17.5 3 25.400 0l.3 4c-8 3 -18 3 -26 0Z" fill="var(--ink)" />
      <path
        d="M15 9l2 4M22 6v5M29 8l-1.500 4M6 22l4 2M36 24l4 -2"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Homenagem a One Piece: o personagem do primeiro quadro do Cap. 1 usa um chapéu de palha.
 * Clique: "Tesouro encontrado!", o cursor estica como borracha e o aviso oferece o duelo de cartas.
 */
export function StrawHat({ className }: { className?: string }) {
  const { unlock } = useEggContext();
  return (
    <button
      type="button"
      aria-label="O chapéu de palha do personagem"
      onClick={() => {
        unlock('tesouro', true);
        emit('rubber', { ms: 6000 });
      }}
      className={cn('group transition-transform hover:-translate-y-0.5 hover:rotate-6', className)}
    >
      <HatIcon className="h-full w-full" />
    </button>
  );
}
