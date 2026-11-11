'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { milestones, researchIntro } from '@/lib/data/research';
import type { Milestone } from '@/lib/data/research';
import { Onomatopoeia, Panel, ScreenTone, SpeedLines } from '@/components/manga';
import { cn } from '@/lib/cn';
import { ChapterHeading } from './ChapterHeading';

const INK = 'var(--ink)';
const s = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  fill: 'var(--paper)',
} as const;

const icons: Record<Milestone['icon'], ReactNode> = {
  medal: (
    <>
      <path d="M22 4L30 26L34 4ZM42 4L34 26L30 4Z" fill={INK} />
      <circle cx="32" cy="40" r="17" {...s} fill="var(--spot-2)" />
      <path
        d="M32 30l3 7l7 1l-5 5l1.500 7l-6.500 -3.500l-6.500 3.500l1.500 -7l-5 -5l7 -1Z"
        fill={INK}
      />
    </>
  ),
  flask: (
    <>
      <path d="M26 6H38M28 6V24L14 52C12 56 14 58 18 58H46C50 58 52 56 50 52L36 24V6" {...s} />
      <path
        d="M21 42H43L49 54C50 56 49 57 46 57H18C15 57 14 56 15 54Z"
        fill="var(--spot-3)"
        stroke={INK}
        strokeWidth="2"
      />
      <circle cx="30" cy="48" r="2.500" fill={INK} />
      <circle cx="38" cy="51" r="1.800" fill={INK} />
    </>
  ),
  podium: (
    <>
      <path d="M6 58V40H24V58M24 58V26H42V58M42 58V44H58V58Z" {...s} />
      <path d="M24 26H42V58H24Z" fill="var(--spot)" stroke={INK} strokeWidth="3" />
      <path
        d="M33 6l2.500 6l6 .500l-4.500 4l1.500 6l-5.500 -3.500l-5.500 3.500l1.500 -6l-4.500 -4l6 -.500Z"
        fill={INK}
      />
    </>
  ),
  scroll: (
    <>
      <path
        d="M14 10H46C52 10 52 20 46 20H44V50C44 56 38 56 38 56H14C20 56 20 50 20 50V20H14C8 20 8 10 14 10Z"
        {...s}
      />
      <path
        d="M26 28H38M26 36H38M26 44H34"
        stroke={INK}
        strokeWidth="2.500"
        strokeLinecap="round"
      />
      <circle cx="46" cy="48" r="8" fill="var(--spot)" stroke={INK} strokeWidth="2.500" />
    </>
  ),
};

function MilestonePanel({ item, index }: { item: Milestone; index: number }) {
  const right = index % 2 === 1;
  const row = useRef<HTMLLIElement>(null);
  const inView = useInView(row, { once: true, amount: 0.3 });
  const away = { x: right ? '70vw' : '-70vw', opacity: 0, rotate: right ? 6 : -6 };
  return (
    <li ref={row} className="relative grid items-center gap-4 md:grid-cols-2 md:gap-12">
      {/* nó da linha do tempo */}
      <span
        aria-hidden
        className="bg-paper font-display absolute top-0 left-0 z-(--z-bubble) grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border-4 border-(--ink) text-sm md:top-1/2 md:left-1/2 md:-translate-y-1/2"
      >
        {index + 1}
      </span>

      {/* o quadro entra deslizando do seu lado da página até encostar na linha */}
      <motion.div
        initial={away}
        animate={inView ? { x: 0, opacity: 1, rotate: 0 } : away}
        transition={{ type: 'spring', stiffness: 60, damping: 15, mass: 0.9 }}
        className={cn('ml-8 md:ml-0', right && 'md:col-start-2')}
      >
        <Panel as="article" seed={70 + index} weight={5} shadow innerClassName="p-5 sm:p-6">
          {index % 2 === 0 ? (
            <ScreenTone size={8} fade="left" opacity={0.22} />
          ) : (
            <SpeedLines count={50} inner={40} cx={90} cy={10} className="opacity-[0.12]" />
          )}
          <div className="relative flex items-start gap-4">
            <svg aria-hidden viewBox="0 0 64 64" className="h-16 w-16 shrink-0">
              {icons[item.icon]}
            </svg>
            <div className="min-w-0">
              <p className="font-bubble mb-1 text-[0.7rem] opacity-75">
                {item.when ? `${item.when} · ` : ''}
                {item.subtitle}
              </p>
              <h3 className="text-2xl sm:text-3xl">{item.title}</h3>
            </div>
          </div>
          <p className="relative mt-3 text-sm sm:text-base">{item.description}</p>
          <p className="font-bubble bg-ink text-paper relative mt-4 inline-block px-2.5 py-1 text-[0.72rem]">
            ▲ {item.badge}
          </p>
        </Panel>
      </motion.div>

      {/* onomatopeia de power up, do lado oposto ao quadro */}
      <div
        className={cn(
          'pointer-events-none absolute -top-5 right-2 md:static md:flex md:justify-center',
          right && 'md:col-start-1 md:row-start-1',
        )}
      >
        <Onomatopoeia
          text={item.sfx.text}
          sub={item.sfx.sub}
          tone={item.sfx.tone}
          size="clamp(1.7rem,5vw,4.5rem)"
          rotate={right ? 8 : -8}
          delay={0.35}
          shake={index === milestones.length - 1}
        />
      </div>
    </li>
  );
}

/**
 * Cap. 4: linha do tempo vertical. Cada quadro entra da lateral do seu lado
 * e para no meio, junto da linha; a onomatopeia de "power up" estoura em seguida.
 */
export function Research() {
  return (
    <section
      id="pesquisa"
      tabIndex={-1}
      aria-labelledby="pesquisa-titulo"
      className="relative overflow-x-clip px-(--space-page) py-24 outline-none"
    >
      <ChapterHeading
        id="pesquisa-titulo"
        kicker={researchIntro.kicker}
        title={researchIntro.title}
        lead={researchIntro.lead}
      />
      <ol className="relative mx-auto mt-14 flex max-w-6xl flex-col gap-12 md:gap-16">
        {/* a linha: traço de nanquim de cima a baixo */}
        <span
          aria-hidden
          className="bg-ink absolute inset-y-0 left-0 w-1.5 -translate-x-1/2 md:left-1/2"
        />
        {milestones.map((item, i) => (
          <MilestonePanel key={item.id} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
}
