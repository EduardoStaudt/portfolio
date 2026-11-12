'use client';

import { useEffect, useReducer } from 'react';
import type { CSSProperties } from 'react';
import { choosePlan } from '@/lib/card-duel/ai';
import {
  RULES,
  createDuel,
  energyAfter,
  isValidPlan,
  resolvePlan,
  startTurn,
} from '@/lib/card-duel/engine';
import type { CardInstance, Difficulty, DuelState, Plan, Step } from '@/lib/card-duel/types';
import { duel as copy } from '@/lib/data/eggs';
import { useFinePointer } from '@/lib/hooks/useIsMobile';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { palette } from '@/styles/tokens';
import { InkBorder } from '@/components/manga/InkBorder';
import { Modal } from '../Modal';
import { Board } from './Board';
import type { Fx, Table } from './Board';
import { Portrait } from './Portrait';
import { ResultScreen } from './ResultScreen';

type Queued = { step: Step; plan: Plan };

type State = {
  phase: 'menu' | 'plan' | 'resolving' | 'over';
  difficulty: Difficulty;
  duel: DuelState;
  /** plano do jogador: um slot por posição */
  slots: Array<CardInstance | null>;
  selected: number | null;
  /** passos já calculados, esperando a animação */
  queue: Queued[];
  /** acabou de executar: o primeiro passo sai sem espera */
  fresh: boolean;
  table: Table | null;
  fx: Fx | null;
  /** o que o rival pretende jogar no próximo turno (Fácil e Normal) */
  intent: Plan | null;
};

type Action =
  | { type: 'start'; difficulty: Difficulty; seed: number }
  | { type: 'menu' }
  | { type: 'select'; uid: number }
  | { type: 'place'; uid: number; slot: number }
  | { type: 'slot'; slot: number }
  | { type: 'execute' }
  | { type: 'advance' };

const emptySlots = () => Array.from({ length: RULES.slots }, () => null);
const compact = (slots: State['slots']) => slots.filter((c): c is CardInstance => c !== null);

/** intenção do rival para o próximo turno dele, com a energia que ele deve ter */
function planIntent(duel: DuelState, difficulty: Difficulty): Plan | null {
  if (difficulty === 'hard') return null;
  const energy = Math.max(0, RULES.energy - duel.fighters.rival.energyPenalty);
  return choosePlan(duel, 'rival', difficulty, energy);
}

function begin(difficulty: Difficulty, seed: number): State {
  const duel = startTurn(createDuel(seed), 'player').state;
  return {
    phase: 'plan',
    difficulty,
    duel,
    slots: emptySlots(),
    selected: null,
    queue: [],
    fresh: false,
    table: null,
    fx: null,
    intent: planIntent(duel, difficulty),
  };
}

const initial: State = { ...begin('normal', 1), phase: 'menu' };

function place(state: State, uid: number, slot: number): State {
  const card = state.duel.fighters.player.hand.find((c) => c.uid === uid);
  if (!card || slot < 0 || slot >= RULES.slots) return state;
  // a carta sai de onde estava; a que ocupava o slot volta para a mão
  const slots = state.slots.map((c) => (c?.uid === uid ? null : c));
  slots[slot] = card;
  return { ...state, slots, selected: null };
}

/** Calcula de uma vez tudo o que acontece até o próximo turno do jogador. */
function buildQueue(state: State, plan: Plan): Queued[] {
  const queue: Queued[] = resolvePlan(state.duel, 'player', plan).map((step) => ({ step, plan }));
  let last = queue.length ? queue[queue.length - 1].step.state : state.duel;
  if (last.winner) return queue;

  const rivalStart = startTurn(last, 'rival');
  queue.push({ step: rivalStart, plan: [] });
  last = rivalStart.state;
  if (last.winner) return queue;

  // o rival cumpre a intenção anunciada, se ainda tiver energia para ela
  const announced = state.intent;
  const rivalPlan =
    announced && isValidPlan(last.fighters.rival, announced)
      ? announced
      : choosePlan(last, 'rival', state.difficulty);
  for (const step of resolvePlan(last, 'rival', rivalPlan)) {
    queue.push({ step, plan: rivalPlan });
    last = step.state;
  }
  if (last.winner) return queue;

  queue.push({ step: startTurn(last, 'player'), plan: [] });
  return queue;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return begin(action.difficulty, action.seed);
    case 'menu':
      return { ...state, phase: 'menu' };
    case 'select': {
      if (state.phase !== 'plan') return state;
      if (state.selected !== action.uid) return { ...state, selected: action.uid };
      // segunda ativação na mesma carta: vai para o primeiro slot livre
      const free = state.slots.findIndex((c) => c === null);
      return free < 0 ? { ...state, selected: null } : place(state, action.uid, free);
    }
    case 'place':
      return state.phase === 'plan' ? place(state, action.uid, action.slot) : state;
    case 'slot': {
      if (state.phase !== 'plan') return state;
      if (state.selected !== null) return place(state, state.selected, action.slot);
      const slots = state.slots.map((c, i) => (i === action.slot ? null : c));
      return { ...state, slots };
    }
    case 'execute': {
      if (state.phase !== 'plan') return state;
      const plan = compact(state.slots);
      if (!isValidPlan(state.duel.fighters.player, plan)) return state;
      return {
        ...state,
        phase: 'resolving',
        selected: null,
        slots: emptySlots(),
        queue: buildQueue(state, plan),
        fresh: true,
        table: plan.length ? { side: 'player', cards: plan, active: -1 } : null,
      };
    }
    case 'advance': {
      if (state.phase !== 'resolving') return state;
      const [next, ...rest] = state.queue;
      if (!next) {
        // fila vazia: volta para o planejamento, ou encerra
        const over = state.duel.winner !== null;
        return {
          ...state,
          phase: over ? 'over' : 'plan',
          table: null,
          fx: over ? state.fx : null,
          intent: over ? null : planIntent(state.duel, state.difficulty),
        };
      }
      const { step, plan } = next;
      return {
        ...state,
        queue: rest,
        fresh: false,
        duel: step.state,
        fx: { key: (state.fx?.key ?? 0) + 1, step },
        table: step.card ? { side: step.side, cards: plan, active: step.slot ?? 0 } : null,
      };
    }
  }
}

/** semente do embaralhamento: muda a cada partida */
const newSeed = () => Date.now() % 2147483647;

type Props = { onClose: () => void; onWin: () => void };

/**
 * Duelo de cartas do easter egg do chapéu de palha: o Mangaká (jogador) contra o Ronin Rubro (IA).
 * As regras ficam em lib/card-duel/engine.ts; aqui só o fluxo e a animação passo a passo.
 */
export default function CardDuel({ onClose, onWin }: Props) {
  const [state, dispatch] = useReducer(reducer, initial);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { phase, duel, fx, fresh } = state;

  // toca a fila: um passo de cada vez, com tempo para ler
  const fxKey = fx?.key ?? 0;
  useEffect(() => {
    if (phase !== 'resolving') return;
    const delay = fresh ? 200 : reduced ? 500 : 950;
    const timer = window.setTimeout(() => dispatch({ type: 'advance' }), delay);
    return () => window.clearTimeout(timer);
  }, [phase, fxKey, fresh, reduced]);

  const won = duel.winner === 'player';
  useEffect(() => {
    if (phase === 'over' && won) onWin();
  }, [phase, won, onWin]);

  const start = (difficulty: Difficulty) =>
    dispatch({ type: 'start', difficulty, seed: newSeed() });

  const energyLeft = energyAfter(duel.fighters.player.energy, compact(state.slots));

  return (
    <Modal label={copy.title} onClose={onClose} className="max-w-5xl">
      <div
        style={{ '--duel-red': palette.red, '--duel-wine': palette.wine } as CSSProperties}
        className="bg-paper text-ink relative"
      >
        <div className="relative p-2.5 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3">
            <h2 className="text-lg uppercase sm:text-2xl">{copy.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="font-bubble hover:bg-ink hover:text-paper border-[2.5px] border-(--ink) px-3 py-1.5 text-xs transition-colors"
            >
              {copy.quit} ✕
            </button>
          </div>

          {phase === 'menu' && (
            <div className="flex flex-col gap-3 sm:gap-5">
              {/* celular: os dois retratos lado a lado e o texto embaixo */}
              <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-[auto_1fr_auto] sm:gap-4">
                <Portrait side="player" className="mx-auto h-28 w-24 sm:h-40 sm:w-36" />
                <div className="text-center max-sm:order-3 max-sm:col-span-2">
                  <p className="font-display ink-outline text-3xl text-(--duel-red) sm:text-5xl">
                    VS
                  </p>
                  <p className="mt-2 text-sm sm:text-base">{copy.intro}</p>
                </div>
                <Portrait side="rival" className="mx-auto h-28 w-24 sm:h-40 sm:w-36" />
              </div>
              <ul className="grid gap-1 text-xs sm:grid-cols-2 sm:gap-1.5 sm:text-sm">
                {copy.rules.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span aria-hidden>◆</span>
                    {rule}
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                {copy.levels.map((level, i) => (
                  <button
                    key={level.id}
                    type="button"
                    data-autofocus={i === 1 ? '' : undefined}
                    onClick={() => start(level.id)}
                    className="group shadow-bubble hover:bg-ink hover:text-paper flex flex-col gap-1 border-[3px] border-(--ink) p-2.5 text-left transition-colors sm:p-4"
                  >
                    <span className="font-display text-base uppercase sm:text-xl">
                      {level.name}
                    </span>
                    <span className="text-xs sm:text-sm">{level.note}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(phase === 'plan' || phase === 'resolving') && (
            <Board
              duel={duel}
              difficulty={state.difficulty}
              planning={phase === 'plan'}
              slots={state.slots}
              selected={state.selected}
              table={state.table}
              fx={fx}
              intent={state.intent}
              energyLeft={energyLeft}
              draggable={fine}
              reduced={reduced}
              onSelect={(uid) => dispatch({ type: 'select', uid })}
              onPlace={(uid, slot) => dispatch({ type: 'place', uid, slot })}
              onSlot={(slot) => dispatch({ type: 'slot', slot })}
              onExecute={() => dispatch({ type: 'execute' })}
            />
          )}

          {phase === 'over' && (
            <ResultScreen
              won={won}
              rounds={duel.round}
              onRematch={() => start(state.difficulty)}
              onLevel={() => dispatch({ type: 'menu' })}
              onQuit={onClose}
            />
          )}
        </div>
        <InkBorder seed={88} weight={6} />
      </div>
    </Modal>
  );
}
