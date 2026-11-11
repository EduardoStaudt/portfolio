'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { duel, eggs, secretPage } from '@/lib/data/eggs';
import type { AboutArt } from '@/lib/data/about';
import { resetEggs, useEggs } from '@/lib/eggs-store';
import { emit } from '@/lib/bus';
import {
  Caption,
  Onomatopoeia,
  Panel,
  ScreenTone,
  SpeechBubble,
  SpeedLines,
} from '@/components/manga';
import { AboutIllustration } from '@/components/manga/illustrations/about';
import { Clover } from './Grimoire';
import { PixelEditor } from './PixelEditor';
import { HatIcon } from './StrawHat';

const komaArt: AboutArt[] = ['laptop', 'hero', 'network', 'horizon'];

/** Página secreta: lacrada (com dicas) até todos os easter eggs serem encontrados. */
export function SecretPage() {
  const { found, total, allFound } = useEggs();

  return (
    <main
      id="conteudo"
      className="mx-auto flex min-h-svh max-w-5xl flex-col gap-8 px-(--space-page) pt-[calc(var(--space-header)+1.5rem)] pb-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bubble bg-ink text-paper inline-block px-2.5 py-1 text-xs">
            Segredos: <span suppressHydrationWarning>{found.length}</span>/{total}
          </p>
          <h1 className="mt-2 text-(length:--fs-3xl)">
            {allFound ? secretPage.title : 'Página lacrada'}
          </h1>
        </div>
        <Onomatopoeia
          text={allFound ? 'パァァ' : 'ガチャ'}
          sub={allFound ? 'TCHARAM' : 'TRANCADO'}
          tone={allFound ? 'accent' : 'hollow'}
          size="clamp(2rem,6vw,4rem)"
        />
      </div>

      {allFound ? (
        <>
          {/* abertura: os três troféus */}
          <Panel seed={301} weight={6} shadow innerClassName="p-6 sm:p-10">
            <SpeedLines count={80} inner={40} className="opacity-[0.12]" animated />
            <div className="relative flex flex-col items-center gap-6 text-center">
              <div className="flex items-end gap-6 sm:gap-10">
                {[
                  <HatIcon key="h" className="h-auto w-16" />,
                  <Clover key="c" size={84} className="text-(--spot)" />,
                  <svg key="s" aria-hidden viewBox="0 0 60 40" className="w-16">
                    <polygon
                      points="0,36 6,10 12,36 18,10 24,36 30,10 36,36 42,10 48,36 54,10 60,36"
                      fill="var(--spot)"
                      stroke="var(--ink)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </svg>,
                ].map((trophy, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -60, opacity: 0, rotate: -20 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 12,
                      delay: 0.2 + i * 0.18,
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity }}
                    >
                      {trophy}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <SpeechBubble variant="shout" className="text-base sm:text-lg">
                {secretPage.lead}
              </SpeechBubble>
              {/* selo de duelista: carimbado só para quem venceu o duelo de cartas */}
              {found.includes('duelo') ? (
                <motion.p
                  initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.9 }}
                  className="font-display text-accent border-accent rounded-md border-[5px] border-double px-4 py-1.5 text-2xl uppercase outline-2 outline-offset-2 outline-current"
                >
                  ⚔ {duel.seal} ⚔
                </motion.p>
              ) : (
                <p className="font-bubble rounded-md border-[3px] border-dashed border-(--ink) px-4 py-2 text-xs opacity-60">
                  {duel.sealHint}
                </p>
              )}
            </div>
          </Panel>

          {/* yonkoma: tirinha de 4 quadros */}
          <section aria-labelledby="yonkoma" className="flex flex-col gap-3">
            <h2 id="yonkoma" className="text-(length:--fs-xl)">
              {secretPage.yonkoma.title}
            </h2>
            <div className="grid gap-(--space-gutter) sm:grid-cols-2 lg:grid-cols-4">
              {secretPage.yonkoma.panels.map((koma, i) => (
                <motion.div
                  key={koma.caption}
                  initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.12 }}
                >
                  <Panel seed={320 + i} weight={5} className="h-72">
                    <ScreenTone variant={i % 2 ? 'hatch' : 'dots'} fade="up" opacity={0.2} />
                    <div className="absolute inset-0 opacity-40">
                      <AboutIllustration art={komaArt[i]} alt="" />
                    </div>
                    <div className="relative flex h-full flex-col justify-between gap-3 p-3">
                      <Caption className="self-start">{koma.caption}</Caption>
                      <SpeechBubble
                        tail={i % 2 ? 'tr' : 'tl'}
                        variant={i === 3 ? 'whisper' : 'speech'}
                        className="self-center text-[0.8rem]"
                      >
                        {koma.text}
                      </SpeechBubble>
                    </div>
                  </Panel>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ateliê de pixel art */}
          <Panel seed={330} weight={6} shadow innerClassName="p-5 sm:p-8">
            <ScreenTone size={9} fade="left" opacity={0.16} />
            <div className="relative">
              <PixelEditor />
            </div>
          </Panel>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => emit('duel')}
              className="font-display bg-accent text-on-accent shadow-bubble hover:bg-ink hover:text-paper border-[3px] border-(--ink) px-5 py-3 text-sm transition-colors"
            >
              {secretPage.replay}
            </button>
            <p className="text-sm opacity-80">{secretPage.thanks}</p>
          </div>
        </>
      ) : (
        <Panel seed={302} weight={6} shadow innerClassName="p-6 sm:p-10">
          <ScreenTone variant="cross" size={12} opacity={0.12} />
          <div className="relative flex flex-col gap-6">
            <Caption className="self-start">{secretPage.locked}</Caption>
            <ul className="flex flex-col gap-3">
              {eggs.map((egg) => {
                const ok = found.includes(egg.id);
                return (
                  <li
                    key={egg.id}
                    className="flex items-start gap-3 border-[3px] border-(--ink) p-3"
                  >
                    <span
                      aria-hidden
                      className={`font-display grid h-8 w-8 shrink-0 place-items-center border-2 border-(--ink) ${ok ? 'bg-ink text-paper' : ''}`}
                    >
                      {ok ? '✓' : '?'}
                    </span>
                    <div>
                      <p className="font-display text-base">
                        {ok ? egg.name : '???'}
                        {egg.optional && (
                          <span className="font-bubble ml-2 text-[0.65rem]">bônus</span>
                        )}
                        <span className="sr-only">
                          {ok ? ' (encontrado)' : ' (não encontrado)'}
                        </span>
                      </p>
                      <p className="text-sm opacity-80">{ok ? egg.found : egg.hint}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="font-display bg-ink text-paper hover:bg-accent hover:text-on-accent border-[3px] border-(--ink) px-5 py-3 text-base transition-colors"
        >
          ← Voltar para a capa
        </Link>
        {found.length > 0 && (
          <button type="button" onClick={resetEggs} className="font-bubble text-xs underline">
            Esquecer os segredos e recomeçar
          </button>
        )}
      </div>
    </main>
  );
}
