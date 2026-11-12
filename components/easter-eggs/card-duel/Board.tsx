'use client';

import { useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { cardDef } from '@/lib/card-duel/cards';
import { RULES } from '@/lib/card-duel/engine';
import type {
  CardInstance,
  Difficulty,
  DuelEvent,
  DuelState,
  Plan,
  Side,
  Step,
} from '@/lib/card-duel/types';
import { duel as copy } from '@/lib/data/eggs';
import { cn } from '@/lib/cn';
import { CardBack, CardFace } from './Card';
import { Hand } from './Hand';
import { HpBar } from './HpBar';
import { Portrait, duelistName } from './Portrait';
import type { Mood } from './Portrait';
import { Slot } from './Slot';

export type Table = { side: Side; cards: Plan; active: number };
export type Fx = { key: number; step: Step };

type Props = {
  duel: DuelState;
  difficulty: Difficulty;
  planning: boolean;
  slots: Array<CardInstance | null>;
  selected: number | null;
  table: Table | null;
  fx: Fx | null;
  intent: Plan | null;
  /** energia que sobra com o plano atual; -1 se a ordem não fecha */
  energyLeft: number;
  draggable: boolean;
  reduced: boolean;
  onSelect: (uid: number) => void;
  onPlace: (uid: number, slot: number) => void;
  onSlot: (slot: number) => void;
  onExecute: () => void;
};

/** onomatopeia do passo */
function sfx(events: DuelEvent[]): string | null {
  const hits = events.filter((e) => e.t === 'damage');
  if (hits.some((e) => e.t === 'damage' && (e.amount >= 8 || e.doubled) && e.amount > 0))
    return 'KRAK!';
  if (hits.some((e) => e.t === 'damage' && e.amount > 0)) return 'ZAS!';
  if (hits.length) return 'PLOFT!';
  const first = events[0]?.t;
  if (first === 'shield') return 'TUM!';
  if (first === 'heal') return 'GLUP!';
  if (first === 'energy') return 'TIC-TAC!';
  if (first === 'focus') return 'ZUUM...';
  if (first === 'fatigue') return 'UFF...';
  if (first === 'draw') return 'FLAP!';
  return null;
}

/** números que sobem do retrato de quem recebeu o efeito */
function floats(events: DuelEvent[], side: Side): Array<{ text: string; tone: string }> {
  const out: Array<{ text: string; tone: string }> = [];
  for (const e of events) {
    if (e.target !== side) continue;
    if (e.t === 'damage') {
      if (e.blocked) out.push({ text: `bloqueou ${e.blocked}`, tone: 'bg-paper text-ink' });
      if (e.amount) out.push({ text: `-${e.amount}`, tone: 'bg-(--duel-red) text-white text-xl' });
    } else if (e.t === 'fatigue')
      out.push({ text: `-${e.amount} sem cartas`, tone: 'bg-(--duel-red) text-white' });
    else if (e.t === 'heal') out.push({ text: `+${e.amount} vida`, tone: 'bg-paper text-ink' });
    else if (e.t === 'shield') out.push({ text: `+${e.amount} escudo`, tone: 'bg-ink text-paper' });
    else if (e.t === 'energy')
      out.push({ text: `+${e.amount} energia`, tone: 'bg-paper text-ink' });
    else if (e.t === 'drain')
      out.push({ text: `-${e.amount} energia no próximo turno`, tone: 'bg-ink text-paper' });
    else if (e.t === 'focus') out.push({ text: 'próximo golpe x2', tone: 'bg-paper text-ink' });
  }
  return out;
}

/** descrição do passo para leitores de tela */
function narrate(step: Step): string {
  const who = step.side === 'player' ? 'Você' : duelistName.rival;
  const parts = step.events.map((e) => {
    const target = e.target === 'player' ? 'você' : duelistName.rival;
    switch (e.t) {
      case 'damage':
        return `${e.amount} de dano em ${target}${e.blocked ? ` (${e.blocked} bloqueado)` : ''}`;
      case 'shield':
        return `${e.amount} de escudo`;
      case 'heal':
        return `cura de ${e.amount}`;
      case 'energy':
        return `mais ${e.amount} de energia`;
      case 'drain':
        return `${target} perde ${e.amount} de energia no próximo turno`;
      case 'draw':
        return `compra de ${e.amount} carta${e.amount > 1 ? 's' : ''}`;
      case 'fatigue':
        return `${e.amount} de dano por falta de cartas`;
      case 'focus':
        return 'próximo golpe em dobro';
    }
  });
  const lead = step.card ? `${who} jogou ${cardDef(step.card.id).name}` : `Turno de ${who}`;
  return parts.length ? `${lead}: ${parts.join(', ')}.` : `${lead}.`;
}

function FighterRow({
  side,
  duel,
  mood,
  fx,
  energy,
}: {
  side: Side;
  duel: DuelState;
  mood: Mood;
  fx: Fx | null;
  energy: number;
}) {
  const f = duel.fighters[side];
  const pips = Math.max(RULES.energy, energy);
  return (
    <div className="flex min-w-0 items-center gap-3 lg:flex-col lg:items-stretch lg:gap-2">
      <div className="relative lg:mx-auto">
        <Portrait
          side={side}
          mood={mood}
          className="h-14 w-12 sm:h-[5.2rem] sm:w-[4.4rem] lg:h-36 lg:w-32"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <AnimatePresence>
            {fx &&
              floats(fx.step.events, side).map((item, i) => (
                <motion.span
                  key={`${fx.key}-${i}`}
                  initial={{ y: 10, opacity: 0, scale: 0.6 }}
                  animate={{ y: -18 - i * 26, opacity: [0, 1, 1, 0], scale: 1 }}
                  transition={{ duration: 1.2, times: [0, 0.15, 0.75, 1] }}
                  className={cn(
                    'font-display absolute left-1/2 -translate-x-1/2 border-2 border-(--ink) px-1.5 py-0.5 text-xs whitespace-nowrap',
                    item.tone,
                  )}
                >
                  {item.text}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-display truncate text-sm leading-none uppercase sm:text-base">
          {duelistName[side]}
          {side === 'player' && <span className="font-bubble ml-2 text-[0.65rem]">(você)</span>}
        </p>
        <HpBar hp={f.hp} shield={f.shield} label={duelistName[side]} />
        <p className="font-bubble flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem]">
          <span className="flex items-center gap-1">
            <span className="sr-only">Energia: {energy}</span>
            {Array.from({ length: pips }, (_, i) => (
              <span
                key={i}
                aria-hidden
                className={cn(
                  'h-3 w-3 rotate-45 border-2 border-(--ink)',
                  i < energy ? 'bg-(--duel-red)' : 'bg-transparent',
                )}
              />
            ))}
          </span>
          <span>Baralho {f.deck.length}</span>
          {side === 'rival' && <span>Mão {f.hand.length}</span>}
        </p>
      </div>
    </div>
  );
}

/** Tabuleiro: rival em cima, os 3 slots no meio, jogador e a mão embaixo. */
export function Board({
  duel,
  difficulty,
  planning,
  slots,
  selected,
  table,
  fx,
  intent,
  energyLeft,
  draggable,
  reduced,
  onSelect,
  onPlace,
  onSlot,
  onExecute,
}: Props) {
  const moodOf = (side: Side): Mood => {
    if (duel.winner) return duel.winner === side ? 'win' : 'hit';
    const hurt = fx?.step.events.some(
      (e) => e.target === side && (e.t === 'fatigue' || (e.t === 'damage' && e.amount > 0)),
    );
    return hurt ? 'hit' : 'normal';
  };
  const impact = fx?.step.events.some((e) => e.t === 'damage' && e.amount > 0) ?? false;
  const fxKey = fx?.key;
  const shake = useAnimationControls();
  useEffect(() => {
    // screen shake leve a cada golpe que tira vida
    if (impact && !reduced)
      void shake.start({ x: [0, -7, 6, -4, 2, 0], transition: { duration: 0.32 } });
  }, [fxKey, impact, reduced, shake]);
  const sound = fx ? sfx(fx.step.events) : null;
  const planCount = slots.filter(Boolean).length;
  const pickedCard = duel.fighters.player.hand.find((c) => c.uid === selected);
  const picked = pickedCard ? cardDef(pickedCard.id) : null;
  const shown: Array<CardInstance | null> = planning
    ? slots
    : Array.from({ length: RULES.slots }, (_, i) => table?.cards[i] ?? null);
  const shownSide: Side = planning ? 'player' : (table?.side ?? duel.turn);

  // setas andam entre as cartas; para cima e para baixo trocam entre a mão e os slots
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.matches('[data-nav]')) return;
    const group = target.closest('[data-navgroup]');
    if (!group) return;
    const items = (root: Element) => [
      ...root.querySelectorAll<HTMLElement>('[data-nav]:not(:disabled)'),
    ];
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const list = items(group);
      const next = list[list.indexOf(target) + (e.key === 'ArrowRight' ? 1 : -1)];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const groups = [...e.currentTarget.querySelectorAll('[data-navgroup]')];
      const other = groups[groups.indexOf(group) + (e.key === 'ArrowDown' ? 1 : -1)];
      const first = other && items(other)[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const acting = fx?.step.side ?? 'player';
  const status = planning
    ? `${copy.yourTurn} · rodada ${duel.round}`
    : fx && !fx.step.card
      ? acting === 'player'
        ? copy.drawing
        : copy.rivalTurn
      : (table?.side ?? acting) === 'player'
        ? copy.resolving
        : copy.rivalTurn;

  return (
    <motion.div
      onKeyDown={onKeyDown}
      animate={shake}
      className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[12.5rem_minmax(0,1fr)_12.5rem] lg:items-center lg:gap-x-5"
    >
      {/* ---------- rival ---------- */}
      <div className="flex flex-col gap-2 lg:order-3">
        <FighterRow
          side="rival"
          duel={duel}
          mood={moodOf('rival')}
          fx={fx}
          energy={duel.fighters.rival.energy}
        />
        <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-2">
          <div aria-hidden className="flex max-sm:hidden lg:justify-center">
            {duel.fighters.rival.hand.slice(0, 6).map((c, i) => (
              <CardBack key={c.uid} className={cn('h-11 w-8', i > 0 && '-ml-4')} />
            ))}
          </div>
          <div className="font-bubble bg-paper relative min-h-[4.6rem] rounded-[1.4rem] border-[2.5px] border-(--ink) px-3 py-1.5 text-[0.62rem] max-sm:flex max-sm:min-h-[2.9rem] max-sm:flex-1 max-sm:items-center max-sm:gap-3 max-sm:rounded-xl max-sm:py-1">
            <span
              aria-hidden
              className="bg-paper absolute -top-2 right-6 h-2.5 w-2.5 rounded-full border-2 border-(--ink)"
            />
            <p className="mb-1 max-sm:mb-0">{copy.intentLabel}</p>
            {difficulty === 'hard' ? (
              <p className="font-display text-lg leading-none">？？？</p>
            ) : intent && intent.length ? (
              <ul className="flex gap-1">
                {intent.map((c) => {
                  const def = cardDef(c.id);
                  return (
                    <li key={c.uid} title={`${def.name}: ${def.text}`}>
                      <CardFace
                        def={def}
                        side="rival"
                        compact
                        className="!h-9 !w-7 sm:!h-11 sm:!w-8"
                      />
                      <span className="sr-only">
                        {def.name}: {def.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="opacity-70">{copy.intentNone}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- mesa ---------- */}
      <div className="relative border-y-[3px] border-(--ink) py-2 sm:py-3 lg:order-2">
        <span aria-hidden className="screentone-hatch absolute inset-0 opacity-[0.08]" />
        <p className="font-bubble relative mb-1.5 text-center text-[0.68rem] sm:mb-2">{status}</p>
        <div data-navgroup className="relative flex items-center justify-center gap-2 sm:gap-4">
          {shown.map((card, i) => (
            <Slot
              key={i}
              index={i}
              card={card}
              side={shownSide}
              active={!planning && table?.active === i}
              spent={!planning && !!table && i < table.active}
              armed={planning && selected !== null}
              disabled={!planning || (!card && selected === null)}
              onPress={() => onSlot(i)}
            />
          ))}
        </div>
        <AnimatePresence>
          {sound && fx && (
            <motion.span
              key={fx.key}
              aria-hidden
              initial={{ scale: reduced ? 1 : 2.6, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: -9 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 520, damping: 17 }}
              className={cn(
                'font-display ink-outline pointer-events-none absolute top-[42%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-[clamp(2.2rem,8vw,4.4rem)] leading-none whitespace-nowrap',
                fx.step.side === 'rival' ? 'text-(--duel-red)' : 'text-ink',
              )}
            >
              {sound}
            </motion.span>
          )}
        </AnimatePresence>
        <div className="relative mt-2 flex min-h-11 flex-wrap items-center justify-center gap-3 sm:mt-3">
          {planning && (
            <p
              className={cn(
                'font-bubble text-[0.68rem]',
                energyLeft < 0 && 'bg-(--duel-red) px-2 py-1 text-white',
              )}
              role={energyLeft < 0 ? 'alert' : undefined}
            >
              {energyLeft < 0 ? copy.noEnergy : `${copy.energyLeft}: ${energyLeft}`}
            </p>
          )}
          <button
            type="button"
            onClick={onExecute}
            disabled={!planning || energyLeft < 0}
            className="font-display shadow-bubble hover:bg-ink hover:text-paper border-[3px] border-(--ink) bg-(--duel-red) px-6 py-2 text-base text-white transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            {planning && planCount === 0 ? copy.pass : copy.execute}
          </button>
        </div>
      </div>

      {/* ---------- jogador ---------- */}
      <div className="lg:order-1">
        <FighterRow
          side="player"
          duel={duel}
          mood={moodOf('player')}
          fx={fx}
          energy={planning && energyLeft >= 0 ? energyLeft : duel.fighters.player.energy}
        />
      </div>
      <div className="lg:order-4 lg:col-span-full">
        <div data-navgroup className="-mx-3 sm:mx-0">
          <Hand
            cards={duel.fighters.player.hand.filter((c) => !slots.some((s) => s?.uid === c.uid))}
            selected={selected}
            disabled={!planning}
            draggable={draggable}
            onSelect={onSelect}
            onDrop={onPlace}
          />
        </div>
        <p className="font-bubble text-center text-[0.62rem] opacity-70 max-sm:hidden">
          {copy.help}
        </p>
        {/* celular: as cartas da mão são pequenas, então o efeito da carta tocada aparece aqui */}
        <p
          className="font-bubble flex min-h-10 items-center justify-center border-[2.5px] border-(--ink) px-2 py-1 text-center text-[0.7rem] sm:hidden"
          aria-hidden
        >
          {picked ? (
            <span>
              <span className="font-display mr-1.5 uppercase">{picked.name}</span>
              {picked.text}
              <span className="block text-[0.6rem] opacity-70">{copy.helpTouchPlay}</span>
            </span>
          ) : (
            <span className="opacity-70">{copy.helpTouch}</span>
          )}
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {fx ? narrate(fx.step) : ''}
      </p>
    </motion.div>
  );
}
