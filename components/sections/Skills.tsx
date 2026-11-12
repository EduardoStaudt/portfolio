'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { skillsIntro, swords } from '@/lib/data/skills';
import type { SkillSword } from '@/lib/data/skills';
import { useFinePointer, useIsMobile } from '@/lib/hooks/useIsMobile';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useTheme } from '@/lib/hooks/useTheme';
import { InkBorder, Onomatopoeia, Panel, ScreenTone } from '@/components/manga';
import { cn } from '@/lib/cn';
import { ChapterHeading } from './ChapterHeading';
import { Swords2D } from './skills/Swords2D';

// a cena 3D só é baixada no cliente e quando a seção chega perto da tela
const SwordsScene = dynamic(() => import('@/components/three/SwordsScene'), { ssr: false });

const noop = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webgl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

function isWeakDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}

const accentBg = { red: 'bg-(--spot)', orange: 'bg-(--spot-2)', blue: 'bg-(--spot-3)' } as const;
const slotPos = ['left-3 sm:left-[5%]', 'left-1/2 -translate-x-1/2', 'right-3 sm:right-[5%]'];

function SkillChips({ sword, detailed = false }: { sword: SkillSword; detailed?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {sword.skills.map((skill) => (
        <li
          key={skill.name}
          className="font-bubble bg-paper border-2 border-(--ink) px-2 py-1 text-[0.7rem]"
        >
          {skill.name}
          {detailed && skill.note && <span className="opacity-70"> · {skill.note}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Cap. 3: três espadas, três áreas. 3D (R3F) quando o aparelho aguenta, SVG 2D como base e fallback. */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [ready3D, setReady3D] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const near = useInView(stage, { margin: '500px 0px', once: true });
  const visible = useInView(stage, { margin: '100px 0px' });

  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const finePointer = useFinePointer();
  const theme = useTheme();

  const weakMobile = hydrated && mobile && isWeakDevice();
  const use3D = hydrated && !reduced && !weakMobile && hasWebGL();
  const show3D = use3D && ready3D;

  const toggle = useCallback((id: string) => setSelected((cur) => (cur === id ? null : id)), []);
  const onReady = useCallback(() => setReady3D(true), []);

  const hoveredSword = swords.find((s) => s.id === hovered && s.id !== selected);
  const selectedSword = swords.find((s) => s.id === selected);

  return (
    // desktop: a seção fica pinada (sticky) por um trecho do scroll, como o livro de projetos
    <section
      id="habilidades"
      tabIndex={-1}
      aria-labelledby="habilidades-titulo"
      className="relative outline-none lg:motion-safe:h-[175vh]"
    >
      {/* o capítulo inteiro (título, campo, plaquinhas e ficha) cabe em uma tela */}
      <div className="relative flex flex-col gap-5 px-(--space-page) py-24 lg:h-svh lg:min-h-[36rem] lg:gap-3 lg:pt-[calc(var(--space-header)+0.25rem)] lg:pb-10 lg:motion-safe:sticky lg:motion-safe:top-0">
        <div className="flex flex-col gap-2 lg:gap-1">
          <ChapterHeading
            id="habilidades-titulo"
            kicker={skillsIntro.kicker}
            title={skillsIntro.title}
            className="lg:flex-row lg:items-center lg:gap-4 lg:[&_h2]:text-(length:--fs-2xl)"
          />
          <p className="max-w-xl text-base opacity-80 lg:max-w-none lg:text-sm">
            {hydrated && !finePointer ? skillsIntro.leadTouch : skillsIntro.lead}
          </p>
        </div>

        <div className="relative lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-(--space-gutter)">
          <div className="flex min-w-0 flex-col gap-4 lg:min-h-0">
            <Panel
              seed={51}
              weight={6}
              shadow
              className="h-[62svh] max-h-[46rem] min-h-[24rem] lg:h-auto lg:max-h-none lg:min-h-0 lg:flex-1"
            >
              <div ref={stage} className="absolute inset-0">
                <ScreenTone size={9} dot={20} fade="down" opacity={0.28} />
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-150',
                    show3D && 'opacity-0',
                  )}
                  aria-hidden={show3D}
                >
                  {[true, false].map((compact) => (
                    <Swords2D
                      key={String(compact)}
                      compact={compact}
                      className={compact ? 'md:hidden' : 'hidden md:block'}
                      swords={swords}
                      hovered={hovered}
                      selected={selected}
                      onHover={setHovered}
                      onSelect={toggle}
                    />
                  ))}
                </div>
                {use3D && near && (
                  <div
                    className={cn(
                      'absolute inset-0 transition-opacity delay-150 duration-500',
                      show3D ? 'opacity-100' : 'opacity-0',
                      hovered && 'cursor-pointer',
                    )}
                  >
                    <SwordsScene
                      swords={swords}
                      hovered={hovered}
                      selected={selected}
                      onHover={setHovered}
                      onSelect={toggle}
                      theme={theme}
                      lite={mobile}
                      active={visible}
                      onReady={onReady}
                    />
                  </div>
                )}
              </div>

              {/* painel rápido do hover */}
              <AnimatePresence>
                {hoveredSword && (
                  <motion.div
                    key={hoveredSword.id}
                    initial={{ opacity: 0, y: -10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.16 }}
                    className={cn(
                      'bg-paper pointer-events-none absolute top-3 z-(--z-bubble) w-[min(17rem,calc(100%-1.5rem))] p-3 sm:top-5',
                      slotPos[swords.indexOf(hoveredSword)],
                    )}
                  >
                    <p className="font-display mb-2 text-base leading-tight">{hoveredSword.area}</p>
                    <SkillChips sword={hoveredSword} />
                    <InkBorder seed={52} weight={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {hoveredSword && (
                <div className="pointer-events-none absolute right-6 bottom-6 hidden sm:block">
                  <Onomatopoeia
                    key={hoveredSword.id}
                    text={hoveredSword.sfx}
                    sub={hoveredSword.sfxSub}
                    size="3.2rem"
                    tone="accent"
                  />
                </div>
              )}
            </Panel>

            {/* plaquinhas: controle por teclado/toque e legenda de cada espada */}
            <ul className="grid shrink-0 grid-cols-3 gap-2 sm:gap-(--space-gutter)">
              {swords.map((sword) => {
                const on = selected === sword.id;
                return (
                  <li key={sword.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-controls="espada-detalhe"
                      onClick={() => toggle(sword.id)}
                      onPointerEnter={() => setHovered(sword.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(sword.id)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        'relative flex h-full w-full flex-col items-start gap-1.5 border-[3px] border-(--ink) p-2.5 text-left transition-colors sm:px-4 sm:py-3',
                        on ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper-shade',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'h-2 w-8 border-2 border-(--ink)',
                          accentBg[sword.accent],
                          on && 'border-(--paper)',
                        )}
                      />
                      <span className="font-display text-sm leading-tight sm:text-lg">
                        {sword.area}
                      </span>
                      <span className="sr-only">{on ? '(empunhada)' : '(fincada no chão)'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ficha da espada empunhada: ao lado do campo no desktop, abaixo no celular */}
          <div
            id="espada-detalhe"
            aria-live="polite"
            className="lg:min-h-0 lg:overflow-y-auto lg:pr-2 lg:pb-2"
          >
            <AnimatePresence mode="wait">
              {selectedSword && (
                <motion.div
                  key={selectedSword.id}
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="bg-paper shadow-panel relative mt-5 p-5 sm:p-6 lg:mt-0"
                >
                  <h3 className="mb-2 text-2xl">{selectedSword.area}</h3>
                  <p className="font-bubble mb-3 text-[0.8rem]">“{selectedSword.motto}”</p>
                  <p className="mb-4 text-sm">{selectedSword.description}</p>
                  <SkillChips sword={selectedSword} detailed />
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="font-bubble bg-ink text-paper mt-5 px-3 py-2 text-xs"
                  >
                    Fincar de volta ↓
                  </button>
                  <InkBorder seed={53} weight={4} />
                </motion.div>
              )}
              {!selectedSword && (
                <motion.div
                  key="vazio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative hidden flex-col gap-4 border-[3px] border-dashed border-(--ink) p-6 lg:flex"
                >
                  <p className="font-display text-xl leading-tight">{skillsIntro.emptyTitle}</p>
                  <p className="text-sm opacity-80">{skillsIntro.emptyText}</p>
                  <ul className="flex flex-col gap-3">
                    {swords.map((sword) => (
                      <li key={sword.id}>
                        <p className="font-bubble mb-1.5 flex items-center gap-2 text-xs">
                          <span
                            aria-hidden
                            className={cn(
                              'h-2 w-6 border-2 border-(--ink)',
                              accentBg[sword.accent],
                            )}
                          />
                          {sword.area}
                        </p>
                        <SkillChips sword={sword} />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
