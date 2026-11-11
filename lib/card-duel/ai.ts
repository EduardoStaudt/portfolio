import { cardDef } from './cards';
import { RULES, energyAfter, other, random, resolvePlan } from './engine';
import type { CardDef, CardInstance, Difficulty, DuelState, Plan, Side } from './types';

/** IA do rival. Pura: a aleatoriedade vem de uma semente. */

function makeRand(seed: number) {
  let s = seed;
  return () => {
    let r: number;
    [r, s] = random(s);
    return r;
  };
}

const totalDamage = (def: CardDef) =>
  def.effects.reduce((sum, e) => sum + (e.t === 'damage' ? e.n * (e.times ?? 1) : 0), 0);

/** Todos os planos válidos: sequências ordenadas de até 3 cartas que a energia paga. */
export function allPlans(hand: CardInstance[], energy: number): Plan[] {
  const plans: Plan[] = [[]];
  const grow = (plan: Plan) => {
    if (plan.length >= RULES.slots) return;
    for (const card of hand) {
      if (plan.includes(card)) continue;
      const next = [...plan, card];
      if (energyAfter(energy, next) < 0) continue;
      plans.push(next);
      grow(next);
    }
  };
  grow([]);
  return plans;
}

/** Fácil: joga cartas ao acaso, na ordem em que saírem. */
function easyPlan(hand: CardInstance[], energy: number, rand: () => number): Plan {
  const pool = [...hand].sort(() => rand() - 0.5);
  const plan: Plan = [];
  for (const card of pool) {
    if (plan.length >= RULES.slots) break;
    if (energyAfter(energy, [...plan, card]) < 0) continue;
    plan.push(card);
    if (rand() < 0.25) break;
  }
  return plan;
}

/** Normal: pega as cartas de maior valor que couberem, sem pensar na ordem nem em combos. */
function normalPlan(state: DuelState, side: Side, energy: number): Plan {
  const me = state.fighters[side];
  const value = (card: CardInstance) => {
    const def = cardDef(card.id);
    const worth = def.effects.reduce((sum, e) => {
      if (e.t === 'damage') return sum + e.n * (e.times ?? 1);
      if (e.t === 'shield') return sum + e.n * 0.6;
      if (e.t === 'heal') return sum + Math.min(e.n, RULES.maxHp - me.hp) * 0.8;
      if (e.t === 'drain') return sum + 1.5;
      if (e.t === 'draw') return sum + 2;
      if (e.t === 'selfDamage') return sum - e.n;
      return sum + 1;
    }, 0);
    return worth / (def.cost + 0.5);
  };
  const plan: Plan = [];
  for (const card of [...me.hand].sort((a, b) => value(b) - value(a))) {
    if (plan.length >= RULES.slots) break;
    if (value(card) <= 0 || energyAfter(energy, [...plan, card]) < 0) continue;
    plan.push(card);
  }
  return plan;
}

/**
 * Difícil: simula todos os planos e fica com o melhor. Enxerga combos de ordem
 * (Postura Alta antes do golpe mais forte), se defende com pouca vida e prioriza
 * cura quando não tem carta de dano na mão.
 */
function hardPlan(state: DuelState, side: Side, energy: number): Plan {
  const foe = other(side);
  const start = {
    ...state,
    fighters: { ...state.fighters, [side]: { ...state.fighters[side], energy } },
  };
  const me = start.fighters[side];
  const lowHp = me.hp < RULES.maxHp * 0.3;
  const noAttack = !me.hand.some((c) => totalDamage(cardDef(c.id)) > 0);

  let best: Plan = [];
  let bestScore = -Infinity;
  for (const plan of allPlans(me.hand, energy)) {
    const steps = resolvePlan(start, side, plan);
    const end = steps.length ? steps[steps.length - 1].state : start;
    let score: number;
    if (end.winner === side) score = 1000 - plan.length;
    else if (end.winner === foe) score = -1000;
    else {
      const a = end.fighters[side];
      const b = end.fighters[foe];
      const damage = start.fighters[foe].hp - b.hp;
      const chipped = start.fighters[foe].shield - b.shield;
      const hpDelta = a.hp - me.hp;
      const drawn = a.hand.length - (me.hand.length - plan.length);
      score =
        damage * (b.hp <= 10 ? 1.3 : 1) +
        chipped * 0.3 +
        Math.min(a.shield, 10) * (lowHp ? 1.3 : 0.45) +
        hpDelta * (noAttack ? 1.5 : me.hp < RULES.maxHp * 0.5 ? 1.1 : 0.6) +
        b.energyPenalty * 2 +
        drawn * 1.2 -
        plan.length * 0.1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = plan;
    }
  }
  return best;
}

/**
 * Escolhe o plano do turno. `energy` permite planejar antes do turno começar
 * (as intenções mostradas ao jogador).
 */
export function choosePlan(
  state: DuelState,
  side: Side,
  difficulty: Difficulty,
  energy = state.fighters[side].energy,
): Plan {
  if (difficulty === 'hard') return hardPlan(state, side, energy);
  if (difficulty === 'normal') return normalPlan(state, side, energy);
  return easyPlan(state.fighters[side].hand, energy, makeRand(state.seed + state.round * 7919));
}
