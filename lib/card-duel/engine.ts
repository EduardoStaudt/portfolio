import { COPIES, cardDef, decks } from './cards';
import type { CardInstance, DuelEvent, DuelState, Fighter, Plan, Side, Step } from './types';

/** Regras do duelo. Só funções puras: recebem um estado e devolvem outro, sem React. */

export const RULES = {
  maxHp: 30,
  handSize: 5,
  maxHand: 8,
  energy: 3,
  slots: 3,
  fatigue: 2,
} as const;

export const other = (side: Side): Side => (side === 'player' ? 'rival' : 'player');

/** mulberry32: devolve um número em [0, 1) e a próxima semente */
export function random(seed: number): [number, number] {
  const next = (seed + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

function shuffle<T>(items: T[], seed: number): [T[], number] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    let r: number;
    [r, s] = random(s);
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return [out, s];
}

const set = (state: DuelState, side: Side, patch: Partial<Fighter>): DuelState => ({
  ...state,
  fighters: { ...state.fighters, [side]: { ...state.fighters[side], ...patch } },
});

function withWinner(state: DuelState, actor: Side): DuelState {
  if (state.winner) return state;
  const foe = other(actor);
  // quem agiu vence se o oponente caiu; se os dois caíram (Prazo Final), o oponente leva
  if (state.fighters[foe].hp <= 0) return { ...state, winner: actor };
  if (state.fighters[actor].hp <= 0) return { ...state, winner: foe };
  return state;
}

/** Compra até `n` cartas. Cada compra impossível (baralho vazio) custa vida. Mão cheia não compra. */
function draw(state: DuelState, side: Side, n: number, events: DuelEvent[]): DuelState {
  let f = state.fighters[side];
  let drawn = 0;
  let fatigue = 0;
  for (let i = 0; i < n; i++) {
    if (f.deck.length === 0) {
      fatigue += RULES.fatigue;
      continue;
    }
    if (f.hand.length >= RULES.maxHand) continue;
    f = { ...f, hand: [...f.hand, f.deck[0]], deck: f.deck.slice(1) };
    drawn++;
  }
  if (drawn) events.push({ t: 'draw', target: side, amount: drawn });
  if (fatigue) {
    f = { ...f, hp: Math.max(0, f.hp - fatigue) };
    events.push({ t: 'fatigue', target: side, amount: fatigue });
  }
  return set(state, side, f);
}

export function createDuel(seed: number): DuelState {
  let s = seed | 0;
  let uid = 1;
  const build = (side: Side): Fighter => {
    const cards: CardInstance[] = decks[side].flatMap((def) =>
      Array.from({ length: COPIES }, () => ({ uid: uid++, id: def.id })),
    );
    let deck: CardInstance[];
    [deck, s] = shuffle(cards, s);
    return {
      hp: RULES.maxHp,
      shield: 0,
      energy: RULES.energy,
      energyPenalty: 0,
      hand: deck.slice(0, RULES.handSize),
      deck: deck.slice(RULES.handSize),
      discard: [],
    };
  };
  const player = build('player');
  const rival = build('rival');
  return { fighters: { player, rival }, turn: 'player', round: 0, winner: null, seed: s };
}

/**
 * Começo de turno: o escudo antigo de quem vai jogar acaba, a energia volta
 * (menos a penalidade) e compra-se 1 carta.
 */
export function startTurn(state: DuelState, side: Side): Step {
  const events: DuelEvent[] = [];
  const f = state.fighters[side];
  let next = set(state, side, {
    shield: 0,
    energy: Math.max(0, RULES.energy - f.energyPenalty),
    energyPenalty: 0,
  });
  next = { ...next, turn: side, round: side === 'player' ? state.round + 1 : state.round };
  next = draw(next, side, 1, events);
  // fadiga pode derrubar quem compra: o outro lado vence
  next = withWinner(next, other(side));
  return { state: next, events, side };
}

/**
 * Energia que sobra depois de jogar o plano na ordem dada.
 * Devolve -1 se em algum slot faltar energia (a ordem importa por causa do Prazo Final).
 */
export function energyAfter(energy: number, plan: Plan): number {
  let left = energy;
  for (const card of plan) {
    const def = cardDef(card.id);
    if (def.cost > left) return -1;
    left -= def.cost;
    for (const e of def.effects) if (e.t === 'energy') left += e.n;
  }
  return left;
}

export function isValidPlan(fighter: Fighter, plan: Plan): boolean {
  if (plan.length > RULES.slots) return false;
  const uids = new Set(plan.map((c) => c.uid));
  if (uids.size !== plan.length) return false;
  if (!plan.every((c) => fighter.hand.some((h) => h.uid === c.uid))) return false;
  return energyAfter(fighter.energy, plan) >= 0;
}

/** Resolve uma carta. `focused` dobra o dano se a carta for de dano. */
function playCard(
  state: DuelState,
  side: Side,
  card: CardInstance,
  focused: boolean,
): { state: DuelState; events: DuelEvent[]; focus: boolean } {
  const def = cardDef(card.id);
  const foe = other(side);
  const events: DuelEvent[] = [];
  let focus = false;
  const me = state.fighters[side];
  let next = set(state, side, {
    energy: me.energy - def.cost,
    hand: me.hand.filter((c) => c.uid !== card.uid),
    discard: [...me.discard, card],
  });

  for (const e of def.effects) {
    if (next.fighters[side].hp <= 0 || next.fighters[foe].hp <= 0) break;
    switch (e.t) {
      case 'damage': {
        for (let i = 0; i < (e.times ?? 1); i++) {
          const target = next.fighters[foe];
          if (target.hp <= 0) break;
          const amount = e.n * (focused ? 2 : 1);
          const blocked = Math.min(target.shield, amount);
          next = set(next, foe, {
            shield: target.shield - blocked,
            hp: Math.max(0, target.hp - (amount - blocked)),
          });
          events.push({
            t: 'damage',
            target: foe,
            amount: amount - blocked,
            blocked,
            doubled: focused,
          });
        }
        break;
      }
      case 'drain':
        next = set(next, foe, { energyPenalty: next.fighters[foe].energyPenalty + e.n });
        events.push({ t: 'drain', target: foe, amount: e.n });
        break;
      case 'shield':
        next = set(next, side, { shield: next.fighters[side].shield + e.n });
        events.push({ t: 'shield', target: side, amount: e.n });
        break;
      case 'heal': {
        const hp = next.fighters[side].hp;
        const amount = Math.min(e.n, RULES.maxHp - hp);
        next = set(next, side, { hp: hp + amount });
        events.push({ t: 'heal', target: side, amount });
        break;
      }
      case 'energy':
        next = set(next, side, { energy: next.fighters[side].energy + e.n });
        events.push({ t: 'energy', target: side, amount: e.n });
        break;
      case 'selfDamage':
        // custo em vida: não passa pelo escudo
        next = set(next, side, { hp: Math.max(0, next.fighters[side].hp - e.n) });
        events.push({ t: 'damage', target: side, amount: e.n, blocked: 0, doubled: false });
        break;
      case 'focus':
        focus = true;
        events.push({ t: 'focus', target: side });
        break;
      case 'draw':
        next = draw(next, side, e.n, events);
        break;
    }
  }
  return { state: withWinner(next, side), events, focus };
}

/**
 * Resolve os slots da esquerda para a direita. Devolve um passo por carta,
 * cada um com o estado logo depois dela. Para no primeiro passo que encerra o duelo.
 */
export function resolvePlan(state: DuelState, side: Side, plan: Plan): Step[] {
  if (state.winner || !isValidPlan(state.fighters[side], plan)) return [];
  const steps: Step[] = [];
  let current = state;
  let focus = false;
  plan.forEach((card, slot) => {
    if (current.winner) return;
    const result = playCard(current, side, card, focus);
    current = result.state;
    focus = result.focus;
    steps.push({ state: current, events: result.events, side, card, slot });
  });
  return steps;
}
