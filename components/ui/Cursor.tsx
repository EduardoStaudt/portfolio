'use client';

import { useEffect, useRef } from 'react';
import { on } from '@/lib/bus';
import { useFinePointer } from '@/lib/hooks/useIsMobile';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { SwordGlyph } from './SwordGlyph';

type Point = { x: number; y: number; t: number };

const TRAIL_MS = 420;
const SLASH_COLOR = '#D7263D';

/**
 * Cursor de pena de nanquim com rastro de tinta (canvas).
 * Desligado em touch e com prefers-reduced-motion: aí vale o cursor nativo.
 * Sobre a contracapa (#contato) a pena vira uma espada e o rastro vira um corte vermelho.
 * Evento `rubber` (easter egg): por alguns segundos o cursor estica como borracha.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const nib = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = nib.current;
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!el || !cv || !ctx) return;

    document.documentElement.classList.add('has-ink-cursor');
    const points: Point[] = [];
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100, vx: 0, vy: 0 };
    let rubberUntil = 0;
    let frame = 0;
    let sword = false; // sobre a contracapa o cursor vira espada e o rastro, um corte vermelho
    let colors = { ink: '#0A0A0A', accent: '#D7263D' };

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      colors = {
        ink: css.getPropertyValue('--ink').trim() || colors.ink,
        accent: css.getPropertyValue('--spot-2').trim() || colors.accent,
      };
    };
    const resize = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    resize();
    readColors();

    const draw = () => {
      frame = 0;
      const now = performance.now();
      while (points.length && now - points[0].t > TRAIL_MS) points.shift();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineCap = 'round';
      ctx.strokeStyle = sword ? SLASH_COLOR : colors.ink;
      ctx.shadowColor = SLASH_COLOR;
      ctx.shadowBlur = sword ? 14 : 0;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const life = 1 - (now - b.t) / TRAIL_MS;
        ctx.globalAlpha = life * 0.8;
        ctx.lineWidth = sword ? 1 + life * 8 : 0.6 + life * 3.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      const rubber = now < rubberUntil;
      if (rubber) {
        // mola: a ponta "atrasada" persegue o cursor e o elástico estica entre as duas
        lag.vx = (lag.vx + (pos.x - lag.x) * 0.045) * 0.86;
        lag.vy = (lag.vy + (pos.y - lag.y) * 0.045) * 0.86;
        lag.x += lag.vx;
        lag.y += lag.vy;
        const stretch = Math.hypot(pos.x - lag.x, pos.y - lag.y);
        ctx.globalAlpha = 1;
        for (const [color, width] of [
          [colors.ink, 20],
          [colors.accent, 14],
        ] as const) {
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(5, width - stretch * 0.04);
          ctx.beginPath();
          ctx.moveTo(lag.x, lag.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
      } else {
        lag.x = pos.x;
        lag.y = pos.y;
      }
      ctx.globalAlpha = 1;
      if (points.length > 1 || rubber) frame = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      el.style.opacity = '1';
      const target = e.target as Element | null;
      sword = !!target?.closest('#contato');
      el.dataset.mode = sword ? 'sword' : '';
      el.dataset.active = target?.closest('a, button, [role="button"], canvas, summary') ? '1' : '';
      points.push({ x: pos.x, y: pos.y, t: performance.now() });
      kick();
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };
    const onDown = () => {
      el.dataset.down = '1';
    };
    const onUp = () => {
      el.dataset.down = '';
    };
    const offRubber = on('rubber', ({ ms }) => {
      rubberUntil = performance.now() + ms;
      readColors();
      kick();
    });
    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ink', 'data-page'],
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-ink-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      observer.disconnect();
      offRubber();
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-(--z-cursor) print:hidden">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div
        ref={nib}
        className="cursor-nib group absolute top-0 left-0 opacity-0 will-change-transform"
      >
        {/* a ponta da pena fica exatamente no ponto do cursor */}
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          className="origin-top-left transition-transform duration-150 group-data-[active=1]:scale-125 group-data-[active=1]:-rotate-12 group-data-[down=1]:scale-90 group-data-[mode=sword]:hidden"
        >
          <path
            d="M1 1L12 6L26 22L22 26L6 12Z"
            fill="var(--ink)"
            stroke="var(--paper)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M1 1L13 13" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="13.500" cy="13.500" r="2" fill="var(--paper)" />
          <path
            d="M22 26L26 22L32 28L28 32Z"
            fill="var(--spot)"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        {/* espada: a ponta fica no ponto do cursor; ao clicar, ela desce num golpe */}
        <SwordGlyph
          size={62}
          className="hidden origin-top-left drop-shadow-[2px_3px_0_rgba(0,0,0,0.45)] transition-transform duration-100 group-data-[active=1]:scale-115 group-data-[down=1]:rotate-[-30deg] group-data-[mode=sword]:block"
        />
      </div>
    </div>
  );
}
