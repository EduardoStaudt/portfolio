'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '@/lib/data/site';
import { DESKTOP_MOTION_QUERY } from '@/lib/hooks/useIsMobile';
import { InkBorder, Onomatopoeia, ScreenTone, SpeedLines } from '@/components/manga';
import { PageBend, applyBend } from '@/components/manga/PageBend';
import { Logo } from '@/components/ui/Logo';
import { Logo3D } from '@/components/ui/Logo3D';

const [first, ...rest] = site.name.split(' ');
/** giro da capa aberta, em graus: um pouco além de 90, de perfil para o leitor */
const OPEN_ANGLE = 96;
const LOGO_SIZE = 'clamp(6.5rem,18vw,11rem)';

/** A arte da capa. `clone`: cópia usada nas tiras da folha flexível (sem animações próprias). */
function CoverFace({ clone = false }: { clone?: boolean }) {
  return (
    <div className="bg-paper absolute inset-0 overflow-hidden">
      <ScreenTone size={9} dot={22} fade="up" opacity={0.3} animated={!clone} />
      <SpeedLines
        count={90}
        inner={34}
        cx={62}
        cy={46}
        className="opacity-[0.13]"
        animated={!clone}
      />

      {/* lombada */}
      <div
        aria-hidden
        className="bg-ink text-paper absolute inset-y-0 right-0 hidden w-12 flex-col items-center justify-between py-24 sm:flex"
      >
        <span className="font-display text-sm [writing-mode:vertical-rl]">ポートフォリオ</span>
        <span className="font-bubble text-[0.7rem] [writing-mode:vertical-rl]">
          {site.shortName} · {site.volume}
        </span>
      </div>

      <div className="relative flex h-full flex-col justify-between gap-6 px-(--space-page) pt-[calc(var(--space-header)+0.5rem)] pb-8 sm:pr-[calc(var(--space-page)+3rem)]">
        <div className="flex items-start justify-end gap-4">
          <div className="relative grid h-20 w-20 shrink-0 rotate-12 place-items-center sm:h-28 sm:w-28">
            <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <polygon
                fill="var(--accent)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                points="50,2 59,16 74,8 77,25 94,24 89,40 98,50 89,60 94,76 77,75 74,92 59,84 50,98 41,84 26,92 23,75 6,76 11,60 2,50 11,40 6,24 23,25 26,8 41,16"
              />
            </svg>
            <span className="font-display text-on-accent relative text-center text-sm leading-none sm:text-xl">
              {site.volume.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="relative grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <span
              aria-hidden
              className="font-display ink-hollow absolute -top-[1.1em] left-0 text-[clamp(1.4rem,3.4vw,3rem)] tracking-widest opacity-80"
            >
              {site.kana}
            </span>
            <h1 className="text-(length:--fs-hero) leading-[0.86] uppercase">
              <span className="block">{first}</span>
              {rest.map((part, i) => (
                <span
                  key={part}
                  className={i === rest.length - 1 ? 'text-accent block' : 'ink-hollow block'}
                >
                  {part}
                </span>
              ))}
            </h1>
          </div>
          <div className="relative justify-self-start lg:justify-self-end">
            {clone ? (
              <Logo size={LOGO_SIZE} className="shadow-lift -rotate-3 border-4" />
            ) : (
              <Logo3D size={LOGO_SIZE} className="-rotate-3" />
            )}
            {clone ? (
              // cópia das tiras: a onomatopeia já entrou, fica parada
              <span className="font-display text-accent ink-outline absolute -top-2 left-[calc(100%+0.75rem)] inline-block -rotate-[14deg] text-[clamp(2rem,5vw,4rem)] leading-none whitespace-nowrap lg:-top-14 lg:-left-20">
                ドン!
              </span>
            ) : (
              <Onomatopoeia
                text="ドン!"
                size="clamp(2rem,5vw,4rem)"
                rotate={-14}
                tone="accent"
                className="absolute -top-2 left-[calc(100%+0.75rem)] lg:-top-14 lg:-left-20"
                delay={1.6}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-stretch gap-0">
            <p className="font-bubble bg-paper border-[3px] border-(--ink) px-3 py-2 text-xs sm:text-sm">
              {site.tagline}
            </p>
            <p className="font-bubble bg-accent text-on-accent -ml-[3px] border-[3px] border-(--ink) px-3 py-2 text-xs sm:text-sm">
              {site.focus}
            </p>
          </div>
          <p
            className="font-bubble bob flex items-center gap-3 text-[clamp(1.15rem,3.2vw,3rem)] leading-none"
            aria-hidden
          >
            <span className="ink-outline hidden lg:motion-safe:inline">Role para abrir a capa</span>
            <span className="ink-outline lg:motion-safe:hidden">Role para ler</span>
            <span className="font-display ink-outline text-accent text-[1.3em]">↓</span>
          </p>
        </div>
      </div>
      <InkBorder
        seed={9}
        weight={6}
        className="inset-2 !h-[calc(100%-1rem)] !w-[calc(100%-1rem)]"
      />
    </div>
  );
}

/**
 * Capa do volume. No desktop o scroll "abre a capa": ela gira em 3D pela lombada (direita,
 * como nos mangás japoneses), curvando-se como papel (PageBend), e revela o Cap. 1, que fica
 * por baixo dela (a seção seguinte sobe com margem negativa; ver COVER_SCROLL em About.tsx).
 * No celular ou com movimento reduzido a capa é uma página comum, seguida do Cap. 1.
 */
export function Cover() {
  const wrap = useRef<HTMLElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  // capa no meio da abertura: só então a versão em tiras é montada
  const [bending, setBending] = useState(false);
  const reapply = useRef<(() => void) | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION_QUERY, () => {
      // guarda os nós agora: na limpeza (desmontagem) os refs já estão nulos
      const section = wrap.current;
      const coverEl = cover.current;
      const shadeEl = shade.current;
      if (!section || !coverEl || !shadeEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      });
      const state = { t: 0 };
      let wasBending = false;
      const apply = () => {
        const midway = state.t > 0.0005 && state.t < 0.9995;
        const bend = midway ? coverEl.querySelector('[data-bend]') : null;
        if (bend) {
          coverEl.dataset.bending = '1';
          coverEl.style.transform = 'none';
          applyBend(bend, state.t, OPEN_ANGLE);
        } else {
          delete coverEl.dataset.bending;
          coverEl.style.transform = `rotateY(${OPEN_ANGLE * state.t}deg)`;
        }
        if (midway !== wasBending) {
          wasBending = midway;
          setBending(midway);
        }
      };
      reapply.current = apply;
      tl.to(state, { t: 1, ease: 'power1.in', duration: 1, onUpdate: apply }, 0)
        .fromTo(shadeEl, { opacity: 0.55 }, { opacity: 0, ease: 'none', duration: 1 }, 0)
        .set(coverEl, { visibility: 'hidden' })
        .to({}, { duration: 0.12 }); // respiro com o Cap. 1 à vista
      return () => {
        reapply.current = null;
        setBending(false);
        tl.scrollTrigger?.kill();
        tl.kill();
        delete coverEl.dataset.bending;
        gsap.set([coverEl, shadeEl], { clearProps: 'all' });
      };
    });
    return () => mm.revert();
  }, []);

  // as tiras acabaram de montar: posiciona sem esperar o próximo scroll
  useEffect(() => {
    reapply.current?.();
  }, [bending]);

  return (
    <section
      ref={wrap}
      id="capa"
      tabIndex={-1}
      aria-label="Capa"
      className="relative z-10 outline-none lg:motion-safe:pointer-events-none lg:motion-safe:h-[240vh]"
    >
      <div
        className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:overflow-hidden"
        style={{ perspective: '2400px' }}
      >
        {/* sombra que a capa projeta sobre o Cap. 1 enquanto abre */}
        <div
          ref={shade}
          aria-hidden
          className="bg-ink pointer-events-none absolute inset-0 hidden opacity-0 lg:motion-safe:block"
        />
        <div
          ref={cover}
          className="preserve-3d pointer-events-auto relative h-svh min-h-[34rem] origin-right will-change-transform lg:motion-safe:absolute lg:motion-safe:inset-0"
        >
          <div data-rigid className="absolute inset-0">
            <CoverFace />
          </div>
          {bending && <PageBend spine="right" front={<CoverFace clone />} />}
        </div>
      </div>
    </section>
  );
}
