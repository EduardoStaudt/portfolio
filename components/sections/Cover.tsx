'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '@/lib/data/site';
import { chapters } from '@/lib/data/chapters';
import {
  InkBorder,
  Onomatopoeia,
  Panel,
  ScreenTone,
  SpeechBubble,
  SpeedLines,
} from '@/components/manga';
import { PageBend, applyBend } from '@/components/manga/PageBend';
import { Logo } from '@/components/ui/Logo';
import { useChapterLink } from '@/components/ui/Nav';

const [first, ...rest] = site.name.split(' ');
/** giro da capa aberta, em graus: um pouco além de 90, de perfil para o leitor */
const OPEN_ANGLE = 96;

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
        <div className="flex items-start justify-between gap-4">
          <p className="font-bubble border-y-[3px] border-(--ink) py-1 text-xs sm:text-sm">
            Portfólio · edição de estreia
          </p>
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
            <Logo
              size="clamp(6.5rem,18vw,11rem)"
              priority={!clone}
              className="shadow-lift -rotate-3 border-4"
            />
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
          <p className="font-bubble bob flex items-center gap-2 text-xs" aria-hidden>
            <span className="motion-reduce:hidden">Role para abrir a capa</span>
            <span className="font-display text-lg">↓</span>
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
 * Capa do volume. O scroll "abre a capa": ela gira em 3D pela lombada
 * (direita, como nos mangás japoneses)
 * e revela a página de rosto com o sumário. Enquanto abre, a capa é trocada por uma versão
 * em tiras (PageBend) e se curva como papel. Sem movimento: capa e sumário em sequência.
 */
export function Cover() {
  const wrap = useRef<HTMLElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const link = useChapterLink();
  // capa no meio da abertura: só então a versão em tiras é montada
  const [bending, setBending] = useState(false);
  const reapply = useRef<(() => void) | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
        .to({}, { duration: 0.35 }); // respiro com o sumário aberto
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
      className="relative outline-none motion-safe:h-[240vh]"
    >
      <div
        className="motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-hidden"
        style={{ perspective: '2400px' }}
      >
        {/* ---------- capa ---------- */}
        <div
          ref={cover}
          className="preserve-3d relative z-10 h-svh min-h-[34rem] origin-right will-change-transform motion-safe:absolute motion-safe:inset-0"
        >
          <div data-rigid className="absolute inset-0">
            <CoverFace />
          </div>
          {bending && <PageBend spine="right" front={<CoverFace clone />} />}
        </div>

        {/* ---------- página de rosto: sumário ---------- */}
        <div className="bg-paper relative flex min-h-svh items-center px-(--space-page) py-24 motion-safe:absolute motion-safe:inset-0">
          <ScreenTone variant="hatch" size={9} fade="left" opacity={0.18} />
          <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col items-start gap-8">
              <SpeechBubble tail="br" className="text-base">
                Leia de cima para baixo. Quando a página virar de lado, é só continuar rolando!
              </SpeechBubble>
              <p className="max-w-sm text-sm opacity-80">
                {site.shortName} · {site.tagline} · {site.focus}. Um volume, quatro capítulos e
                alguns segredos escondidos entre os quadros.
              </p>
            </div>
            <Panel seed={14} shadow className="w-full" innerClassName="p-6 sm:p-8">
              <p className="font-display mb-5 text-(length:--fs-xl)">Sumário</p>
              <ol className="flex flex-col gap-1">
                {chapters.slice(1).map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      onClick={link(c.id)}
                      className="group hover:bg-ink hover:text-paper flex items-baseline gap-3 px-2 py-2.5 transition-colors"
                    >
                      <span className="font-bubble w-24 shrink-0 text-xs">{c.number}</span>
                      <span className="font-display text-base sm:text-lg">{c.title}</span>
                      <span
                        aria-hidden
                        className="mb-1 flex-1 self-end border-b-[3px] border-dotted border-current opacity-40"
                      />
                      <span aria-hidden className="font-display">
                        {c.direction === 'horizontal' ? '→' : '↓'}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
          <div
            ref={shade}
            aria-hidden
            className="bg-ink pointer-events-none absolute inset-0 opacity-0"
          />
        </div>
      </div>
    </section>
  );
}
