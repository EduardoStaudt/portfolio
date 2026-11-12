'use client';

import { useEggContext } from './EasterEggProvider';
import { emit } from '@/lib/bus';

/** O desenho do chapéu, em um viewBox de 46x30. */
function HatShape() {
  return (
    <>
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
      {/* faixa vermelha */}
      <path
        d="M10.3 17c8 3 17.5 3 25.400 0l.3 4c-8 3 -18 3 -26 0Z"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1"
      />
      <path
        d="M15 9l2 4M22 6v5M29 8l-1.500 4M6 22l4 2M36 24l4 -2"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </>
  );
}

/** Chapéu de palha genérico, desenho próprio. */
export function HatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="46" height="30" viewBox="0 0 46 30" className={className}>
      <HatShape />
    </svg>
  );
}

type Props = { x: number; y: number; width: number; height: number };

/**
 * Homenagem a One Piece: o personagem do primeiro quadro do Cap. 1 usa um chapéu de palha.
 * Clique: "Tesouro encontrado!", o cursor estica como borracha e o aviso oferece o duelo de cartas.
 *
 * É um elemento SVG nativo, para ser desenhado dentro de um <svg> com o mesmo viewBox da
 * ilustração: assim ele fica na cabeça do personagem em qualquer tela e navegador.
 */
export function StrawHat({ x, y, width, height }: Props) {
  const { unlock } = useEggContext();
  const find = () => {
    unlock('tesouro', true);
    emit('rubber', { ms: 6000 });
  };
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="O chapéu de palha do personagem"
      onClick={find}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        find();
      }}
      className="soft-blink pointer-events-auto cursor-pointer outline-none"
    >
      <svg x={x} y={y} width={width} height={height} viewBox="0 0 46 30" overflow="visible">
        <HatShape />
      </svg>
      {/* área de toque um pouco maior que o desenho */}
      <rect x={x - 4} y={y - 4} width={width + 8} height={height + 8} fill="transparent" />
    </g>
  );
}
