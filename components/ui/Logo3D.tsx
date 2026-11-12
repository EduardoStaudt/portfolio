'use client';

import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/lib/hooks/useIsMobile';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';

type Props = {
  /** lado: qualquer valor CSS */
  size: string;
  className?: string;
};

const LAYERS = 7; // camadas da logo empilhadas: dão a espessura do relevo
const STEP = 2.4; // distância entre camadas, em px
const SLAB = 5; // camadas da plaqueta
const FOLLOW = { x: 16, y: 26 }; // inclinação máxima seguindo o mouse, em graus
const spring = { stiffness: 110, damping: 11, mass: 0.9 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Logo em relevo 3D, feita só com CSS: a mesma imagem (/logo.svg) empilhada em camadas sobre
 * uma plaqueta com espessura. Não depende do desenho: trocar o arquivo continua bastando.
 * Ela se inclina na direção do mouse, pode ser girada arrastando e volta sozinha ao lugar.
 * Com movimento reduzido vira a logo plana.
 */
export function Logo3D({ size, className }: Props) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  // volta completa mais próxima: o repouso depois de girar várias vezes
  const base = useRef(0);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const rotateX = useSpring(targetX, spring);
  const rotateY = useSpring(targetY, spring);

  // inclina na direção do mouse, em qualquer ponto da tela
  useEffect(() => {
    if (reduced || !fine) return;
    const onMove = (e: globalThis.PointerEvent) => {
      const el = box.current;
      if (!el || drag.current) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      targetY.set(base.current + clamp(dx, -1, 1) * FOLLOW.y);
      targetX.set(clamp(-dy, -1, 1) * FOLLOW.x);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, fine, targetX, targetY]);

  if (reduced)
    return <Logo size={size} priority className={cn('shadow-lift border-4', className)} />;

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    targetY.set(targetY.get() + (e.clientX - drag.current.x) * 0.8);
    targetX.set(clamp(targetX.get() - (e.clientY - drag.current.y) * 0.8, -75, 75));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    // solta: volta para a frente pelo caminho mais curto
    base.current = Math.round(targetY.get() / 360) * 360;
    targetY.set(base.current);
    targetX.set(0);
  };

  const plate = 'absolute inset-0 border-4 border-(--ink)';

  return (
    <div
      ref={box}
      className={cn('relative shrink-0 touch-pan-y select-none', className)}
      style={{ width: size, height: size, perspective: '900px' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      title="Arraste para girar"
    >
      {/* sombra chapada, parada no papel */}
      <span aria-hidden className="bg-ink absolute inset-0 translate-x-2.5 translate-y-2.5" />
      <motion.div
        className="preserve-3d absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ rotateX, rotateY }}
      >
        {/* verso da plaqueta */}
        <span
          aria-hidden
          className={cn(plate, 'bg-(--logo-plate)')}
          style={{ transform: `translateZ(${-SLAB * STEP}px) rotateY(180deg)` }}
        >
          <span className="screentone-hatch absolute inset-0 !text-[#0a0a0a] opacity-25" />
        </span>
        {/* espessura da plaqueta */}
        {Array.from({ length: SLAB - 1 }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(plate, 'bg-(--ink)')}
            style={{ transform: `translateZ(${-(i + 1) * STEP}px)` }}
          />
        ))}
        <span className={cn(plate, 'bg-(--logo-plate)')} />
        {/* a logo, empilhada: as camadas de baixo escurecidas fazem a lateral do relevo */}
        {Array.from({ length: LAYERS }, (_, i) => {
          const top = i === LAYERS - 1;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src="/logo.svg"
              alt={top ? 'Logo de Eduardo Staudt' : ''}
              aria-hidden={top ? undefined : true}
              draggable={false}
              className="pixelated pointer-events-none absolute inset-0 h-full w-full p-1"
              style={{
                transform: `translateZ(${(i + 1) * STEP}px)`,
                filter: top ? undefined : 'brightness(0.4)',
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
