'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutIntro, aboutPanels } from '@/lib/data/about';
import type { AboutPanel, Bubble } from '@/lib/data/about';
import { DESKTOP_MOTION_QUERY } from '@/lib/hooks/useIsMobile';
import {
  Caption,
  Onomatopoeia,
  Panel,
  ScreenTone,
  SpeechBubble,
  SpeedLines,
  ThoughtBubble,
} from '@/components/manga';
import { BreakBubble } from '@/components/manga/BreakBubble';
import { AboutIllustration } from '@/components/manga/illustrations/about';
import { StrawHat } from '@/components/easter-eggs/StrawHat';
import { cn } from '@/lib/cn';

const widths: Record<AboutPanel['size'], string> = {
  sm: 'lg:motion-safe:w-[26rem]',
  md: 'lg:motion-safe:w-[34rem]',
  lg: 'lg:motion-safe:w-[46rem]',
};

// fundo de cada quadro: alterna retícula, hachura e linhas de foco
const backdrops = [
  <SpeedLines key="s" count={64} inner={30} className="opacity-[0.16]" />,
  <ScreenTone key="t" fade="down" size={9} opacity={0.3} />,
  <ScreenTone key="h" variant="hatch" fade="left" size={8} opacity={0.22} />,
  <ScreenTone key="d" fade="up" size={7} dot={22} opacity={0.32} />,
];

function BubbleItem({ bubble, index }: { bubble: Bubble; index: number }) {
  const side = index % 2 === 0 ? 'self-end' : 'self-start';
  const tail = index % 2 === 0 ? 'bl' : 'br';
  if (bubble.reveal)
    return (
      <BreakBubble
        text={bubble.text}
        reveal={bubble.reveal}
        tail={tail}
        delay={0.1 * index}
        className={side}
      />
    );
  if (bubble.kind === 'thought')
    return (
      <ThoughtBubble tail={tail} delay={0.1 * index} className={cn(side, 'mb-8')}>
        {bubble.text}
      </ThoughtBubble>
    );
  return (
    <SpeechBubble
      variant={bubble.kind}
      tail={tail}
      seed={index + 4}
      delay={0.1 * index}
      className={cn(side, bubble.kind !== 'shout' && 'mb-4')}
    >
      {bubble.text}
    </SpeechBubble>
  );
}

function StoryPanel({ panel, index }: { panel: AboutPanel; index: number }) {
  const [firstBubble, ...others] = panel.bubbles;
  return (
    <Panel
      as="article"
      seed={index + 30}
      weight={5}
      className={cn('w-full shrink-0', widths[panel.size])}
    >
      <div data-panel className="absolute inset-0">
        {backdrops[index % backdrops.length]}
        {/* camada do desenho: desliza mais devagar que o quadro (parallax) */}
        <div
          data-depth="1"
          className="absolute inset-x-0 top-1/2 aspect-[4/3] -translate-y-1/2 lg:motion-safe:inset-x-[-2.5rem] lg:motion-safe:inset-y-0 lg:motion-safe:aspect-auto lg:motion-safe:translate-y-0"
        >
          <AboutIllustration art={panel.art} alt={panel.alt} />
        </div>
        {panel.art === 'campus' && <StrawHat className="top-[18%] left-[47%]" />}
        {panel.sfx && (
          <div data-depth="-0.6" className="absolute right-4 bottom-[34%]">
            <Onomatopoeia
              text={panel.sfx.text}
              sub={panel.sfx.sub}
              tone={panel.sfx.tone}
              size="clamp(2.4rem,4.5vw,4.2rem)"
              rotate={index % 2 === 0 ? -10 : 8}
              shake={index === 0}
            />
          </div>
        )}
      </div>
      <div className="relative flex h-full min-h-[30rem] flex-col justify-between gap-4 p-4 sm:p-6 lg:motion-safe:min-h-0">
        <div className="flex flex-col gap-4">
          {panel.caption && <Caption className="max-w-[75%] self-start">{panel.caption}</Caption>}
          {firstBubble && <BubbleItem bubble={firstBubble} index={0} />}
        </div>
        <div className="flex flex-col gap-3">
          {others.map((b, i) => (
            <BubbleItem key={b.text} bubble={b} index={i + 1} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

/**
 * Cap. 1. Desktop: seção pinada (sticky) em que o scroll vertical empurra a tira para a esquerda.
 * Mobile / movimento reduzido: os mesmos quadros empilhados, leitura estilo webtoon.
 */
export function About() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION_QUERY, () => {
      const section = wrap.current;
      const strip = track.current;
      if (!section || !strip) return;
      const distance = () => Math.max(0, strip.scrollWidth - window.innerWidth);
      const setHeight = () => {
        section.style.height = `${distance() + window.innerHeight}px`;
      };
      setHeight();

      const tween = gsap.to(strip, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefreshInit: setHeight,
        },
      });

      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', strip).map((el) => {
        const depth = Number(el.dataset.depth);
        return gsap.fromTo(
          el,
          { x: 36 * depth },
          {
            x: -36 * depth,
            ease: 'none',
            scrollTrigger: {
              containerAnimation: tween,
              trigger: el.closest('[data-panel]'),
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        layers.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        tween.scrollTrigger?.kill();
        tween.kill();
        section.style.height = '';
        gsap.set([strip, ...gsap.utils.toArray<HTMLElement>('[data-depth]', strip)], {
          clearProps: 'transform',
        });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={wrap}
      id="quem-sou"
      tabIndex={-1}
      aria-labelledby="quem-sou-titulo"
      className="relative outline-none"
    >
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center lg:motion-safe:overflow-hidden lg:motion-safe:pt-(--space-header)">
        <div
          ref={track}
          className="flex flex-col gap-(--space-gutter) px-(--space-page) py-20 will-change-transform lg:motion-safe:h-[min(76vh,46rem)] lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:py-0 lg:motion-safe:pr-[12vw]"
        >
          {/* quadro de abertura do capítulo */}
          <Panel
            seed={29}
            weight={6}
            inverted
            className="w-full shrink-0 lg:motion-safe:w-[30rem]"
            innerClassName="flex min-h-[20rem] flex-col justify-end gap-3 p-6 sm:p-8"
          >
            <ScreenTone size={10} fade="down" opacity={0.25} className="!text-(--paper)" />
            <p className="font-bubble bg-paper text-ink relative self-start px-2.5 py-1 text-xs">
              {aboutIntro.kicker}
            </p>
            <h2 id="quem-sou-titulo" className="relative text-(length:--fs-3xl) uppercase">
              {aboutIntro.title}
            </h2>
            <p className="relative max-w-xs text-base opacity-85">{aboutIntro.lead}</p>
            <p
              className="font-display relative mt-4 hidden text-2xl lg:motion-safe:block"
              aria-hidden
            >
              role →
            </p>
          </Panel>

          {aboutPanels.map((panel, i) => (
            <StoryPanel key={panel.id} panel={panel} index={i} />
          ))}

          {/* gancho para o próximo capítulo */}
          <div className="flex shrink-0 items-center justify-center py-6 lg:motion-safe:w-[22rem]">
            <p className="font-display text-center text-2xl leading-tight">
              つづく
              <span className="font-bubble mt-2 block text-sm">Continua no Cap. 2 ↓</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
