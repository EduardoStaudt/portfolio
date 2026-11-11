'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_MOTION_QUERY } from '@/lib/hooks/useIsMobile';
import { cn } from '@/lib/cn';
import { InkBorder } from './InkBorder';
import { PageBend, applyBend } from './PageBend';

export type Spread = {
  id: string;
  /** nome curto, usado nos controles */
  label: string;
  left: ReactNode;
  right: ReactNode;
};

type Props = {
  spreads: Spread[];
  /** descrição do "livro" para leitores de tela */
  ariaLabel: string;
  /** conteúdo fixo acima do livro (título do capítulo) */
  header?: ReactNode;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Page({ children, seed, side }: { children: ReactNode; seed: number; side: 'l' | 'r' }) {
  return (
    <div className="bg-paper text-ink relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden">{children}</div>
      {/* sombra da lombada */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-0 w-10 opacity-25',
          side === 'l'
            ? 'right-0 bg-linear-to-l from-(--ink) to-transparent'
            : 'left-0 bg-linear-to-r from-(--ink) to-transparent',
        )}
      />
      <InkBorder seed={seed} weight={4} />
    </div>
  );
}

/**
 * Livro com páginas duplas.
 * - Desktop: seção pinada (sticky); o scroll vertical vira as folhas em 3D (GSAP ScrollTrigger).
 *   A folha que está virando é trocada por uma versão em tiras (PageBend) e se curva como papel.
 * - Mobile / prefers-reduced-motion: carrossel de deslizar com scroll-snap.
 * Todas as páginas ficam no DOM (texto real); as que não estão à vista ficam `inert`.
 */
export function PageFlip({ spreads, ariaLabel, header }: Props) {
  const n = spreads.length;
  const wrap = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLDivElement>(null);
  const leaves = useRef<Array<HTMLDivElement | null>>([]);
  const [index, setIndex] = useState(0);
  // folha no meio da virada (só ela é montada em tiras flexíveis)
  const [turning, setTurning] = useState<number | null>(null);
  const reapply = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (n < 2) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION_QUERY, () => {
      const state = { p: 0 };
      let current = 0;
      let bending: number | null = null;
      const apply = () => {
        let moving: number | null = null;
        leaves.current.forEach((leaf, j) => {
          if (!leaf) return;
          // cada folha vira no miolo do seu trecho de scroll, com respiro antes e depois
          const t = easeInOut(clamp01((clamp01(state.p - j) - 0.2) / 0.6));
          const midway = t > 0.0005 && t < 0.9995;
          if (midway && moving === null) moving = j;
          const bend = midway ? leaf.querySelector('[data-bend]') : null;
          if (bend) {
            // folha flexível: quem gira são as tiras; a folha rígida fica escondida
            leaf.dataset.bending = '1';
            leaf.style.transform = 'none';
            applyBend(bend, t);
          } else {
            delete leaf.dataset.bending;
            leaf.style.transform = `rotateY(${-180 * t}deg)`;
            leaf.style.setProperty('--shade', String(Math.sin(Math.PI * t) * 0.3));
          }
          leaf.style.zIndex = String(midway ? n + 1 : t > 0.5 ? j + 1 : n - j);
        });
        if (moving !== bending) {
          bending = moving;
          setTurning(moving);
        }
        const next = Math.round(state.p);
        if (next !== current) {
          current = next;
          setIndex(next);
        }
      };
      reapply.current = apply;
      const tween = gsap.to(state, {
        p: n - 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
        },
      });
      const nodes = leaves.current;
      return () => {
        reapply.current = null;
        setTurning(null);
        tween.scrollTrigger?.kill();
        tween.kill();
        nodes.forEach((leaf, j) => {
          if (!leaf) return;
          delete leaf.dataset.bending;
          leaf.style.transform = '';
          leaf.style.zIndex = String(n - j);
          leaf.style.removeProperty('--shade');
        });
        setIndex(0);
      };
    });
    return () => mm.revert();
  }, [n]);

  // as tiras acabaram de montar (ou desmontar): reposiciona sem esperar o próximo scroll
  useEffect(() => {
    reapply.current?.();
  }, [turning]);

  const goTo = useCallback(
    (target: number) => {
      const i = Math.min(n - 1, Math.max(0, target));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (window.matchMedia(DESKTOP_MOTION_QUERY).matches && wrap.current) {
        const top = window.scrollY + wrap.current.getBoundingClientRect().top;
        const range = wrap.current.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + (range * i) / Math.max(1, n - 1), behavior: 'smooth' });
      } else if (carousel.current) {
        carousel.current.scrollTo({
          left: carousel.current.clientWidth * i,
          behavior: reduced ? 'auto' : 'smooth',
        });
      }
    },
    [n],
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const onCarouselScroll = () => {
    const el = carousel.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== index) setIndex(next);
  };

  const controls = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Página anterior"
        className="hand-box bg-paper font-display hover:bg-ink hover:text-paper min-h-12 min-w-14 px-5 py-2 text-2xl leading-none transition-colors disabled:pointer-events-none disabled:opacity-35"
      >
        ←
      </button>
      <ol className="flex flex-wrap items-center justify-center gap-2" aria-label="Projetos">
        {spreads.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? 'true' : undefined}
              className={cn(
                'font-bubble min-h-12 border-[3px] border-(--ink) px-4 py-2 text-sm transition-colors sm:px-5',
                i === index ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-shade',
              )}
            >
              <span className="sr-only">Ir para o projeto </span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        disabled={index === n - 1}
        aria-label="Próxima página"
        className="hand-box bg-paper font-display hover:bg-ink hover:text-paper min-h-12 min-w-14 px-5 py-2 text-2xl leading-none transition-colors disabled:pointer-events-none disabled:opacity-35"
      >
        →
      </button>
    </div>
  );

  return (
    <div
      ref={wrap}
      style={{ '--flip-h': `${(n - 1) * 110 + 100}vh` } as CSSProperties}
      className="relative lg:motion-safe:h-(--flip-h)"
    >
      <div
        role="group"
        aria-roledescription="livro"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-5 px-(--space-page) py-16 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-screen lg:motion-safe:justify-center lg:motion-safe:py-0 lg:motion-safe:pt-(--space-header)"
      >
        {header}

        {/* ---------- desktop: livro 3D ---------- */}
        <div
          className="relative mx-auto hidden h-[min(66vh,700px)] w-full max-w-[1320px] lg:motion-safe:block"
          style={{ perspective: '2600px' }}
        >
          {/* base esquerda: página esquerda da primeira dupla */}
          <div className="absolute top-0 left-0 h-full w-1/2" inert={index !== 0}>
            <Page seed={11} side="l">
              {spreads[0].left}
            </Page>
          </div>
          {/* base direita: página direita da última dupla */}
          <div className="absolute top-0 left-1/2 h-full w-1/2" inert={index !== n - 1}>
            <Page seed={12} side="r">
              {spreads[n - 1].right}
            </Page>
          </div>
          {/* folhas: frente = direita da dupla j, verso = esquerda da dupla j+1 */}
          {spreads.slice(0, -1).map((s, j) => (
            <div
              key={s.id}
              ref={(el) => {
                leaves.current[j] = el;
              }}
              className="preserve-3d absolute top-0 left-1/2 h-full w-1/2 origin-left will-change-transform"
              style={{ zIndex: n - j }}
            >
              {turning === j && (
                <PageBend
                  front={
                    <Page seed={20 + j} side="r">
                      {s.right}
                    </Page>
                  }
                  back={
                    <Page seed={40 + j} side="l">
                      {spreads[j + 1].left}
                    </Page>
                  }
                />
              )}
              <div data-rigid className="absolute inset-0 backface-hidden" inert={index !== j}>
                <Page seed={20 + j} side="r">
                  {s.right}
                </Page>
                <div
                  aria-hidden
                  className="bg-ink pointer-events-none absolute inset-0 opacity-(--shade,0)"
                />
              </div>
              <div
                data-rigid
                className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden"
                inert={index !== j + 1}
              >
                <Page seed={40 + j} side="l">
                  {spreads[j + 1].left}
                </Page>
                <div
                  aria-hidden
                  className="bg-ink pointer-events-none absolute inset-0 opacity-(--shade,0)"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ---------- mobile / movimento reduzido: deslizar ---------- */}
        <div
          ref={carousel}
          onScroll={onCarouselScroll}
          className="no-scrollbar -mx-(--space-page) flex snap-x snap-mandatory overflow-x-auto lg:motion-safe:hidden"
        >
          {spreads.map((s, i) => (
            <article
              key={s.id}
              aria-label={s.label}
              className="w-full shrink-0 snap-center px-(--space-page) py-2"
              inert={i !== index}
            >
              <div className="bg-paper relative">
                <div className="grid lg:grid-cols-2">
                  <div className="relative min-h-[22rem] overflow-hidden">{s.left}</div>
                  <div className="relative overflow-hidden border-t-4 border-(--ink) lg:border-t-0 lg:border-l-4">
                    {s.right}
                  </div>
                </div>
                <InkBorder seed={60 + i} />
              </div>
            </article>
          ))}
        </div>

        {controls}
        <p className="font-bubble text-center text-[0.7rem] opacity-70" aria-hidden>
          <span className="hidden lg:motion-safe:inline">Role ou use ← → para virar a página</span>
          <span className="lg:motion-safe:hidden">Deslize para o lado para trocar de projeto</span>
        </p>
        <p className="sr-only" aria-live="polite">
          Projeto {index + 1} de {n}: {spreads[index].label}
        </p>
      </div>
    </div>
  );
}
