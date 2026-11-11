'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { on } from '@/lib/bus';
import { shakeScreen } from '@/lib/shake';
import { useActiveChapter } from '@/lib/chapter-store';
import { REDUCED_MOTION_QUERY } from '@/lib/hooks/useReducedMotion';

/**
 * Transição entre capítulos: um corte de espada na diagonal.
 * - Ao navegar pelo sumário: as duas metades de tinta fecham a tela, a página salta e o corte abre.
 * - Ao trocar de capítulo rolando: só um tremor leve da página.
 */
export function ChapterSlash() {
  const root = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const busy = useRef(false);
  const first = useRef(true);
  const active = useActiveChapter();

  useEffect(
    () =>
      on('goto', ({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const jump = () => {
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY,
            behavior: 'instant',
          });
          history.replaceState(null, '', id === 'capa' ? '/' : `/#${id}`);
          el.focus({ preventScroll: true });
        };
        if (window.matchMedia(REDUCED_MOTION_QUERY).matches || busy.current) {
          jump();
          return;
        }
        busy.current = true;
        gsap
          .timeline({
            onComplete: () => {
              busy.current = false;
            },
          })
          .set(root.current, { visibility: 'visible' })
          .set(line.current, { strokeDashoffset: 1, opacity: 1 })
          .fromTo(
            top.current,
            { xPercent: -100, yPercent: -100 },
            { xPercent: 0, yPercent: 0, duration: 0.24, ease: 'power3.in' },
            0,
          )
          .fromTo(
            bottom.current,
            { xPercent: 100, yPercent: 100 },
            { xPercent: 0, yPercent: 0, duration: 0.24, ease: 'power3.in' },
            0,
          )
          .add(jump)
          .to(line.current, { strokeDashoffset: 0, duration: 0.14, ease: 'power2.out' })
          .to(
            top.current,
            { xPercent: -100, yPercent: -100, duration: 0.4, ease: 'power3.inOut' },
            '+=0.06',
          )
          .to(
            bottom.current,
            { xPercent: 100, yPercent: 100, duration: 0.4, ease: 'power3.inOut' },
            '<',
          )
          .to(line.current, { opacity: 0, duration: 0.25 }, '<0.1')
          .set(root.current, { visibility: 'hidden' });
      }),
    [],
  );

  // trocar de capítulo rolando: só um tremor leve (o corte fica para o sumário)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!busy.current) shakeScreen(4);
  }, [active]);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-(--z-transition) overflow-hidden print:hidden"
    >
      <div ref={top} className="bg-ink absolute inset-0 [clip-path:polygon(0_0,100%_0,0_100%)]" />
      <div
        ref={bottom}
        className="bg-ink absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]"
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={line}
          d="M-2 102 L102 -2"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          stroke="var(--paper)"
          strokeWidth={0.9}
          fill="none"
          style={{ filter: 'drop-shadow(0 0 3px var(--ink)) drop-shadow(0 0 1px var(--ink))' }}
        />
      </svg>
    </div>
  );
}
