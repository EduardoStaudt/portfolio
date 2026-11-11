import { describe, expect, it } from 'vitest';
import { allPlans, choosePlan } from './ai';
import { RULES, createDuel, energyAfter, isValidPlan, resolvePlan, startTurn } from './engine';
import type { CardInstance, DuelState, Fighter, Side } from './types';

let uid = 1000;
const card = (id: string): CardInstance => ({ uid: uid++, id });

/** duelo com as mãos escolhidas à mão, para testar cada regra isolada */
function duel(
  playerHand: string[],
  patch: Partial<Record<Side, Partial<Fighter>>> = {},
  rivalHand: string[] = [],
): DuelState {
  const base = createDuel(1);
  return {
    ...base,
    fighters: {
      player: { ...base.fighters.player, hand: playerHand.map(card), ...patch.player },
      rival: { ...base.fighters.rival, hand: rivalHand.map(card), ...patch.rival },
    },
  };
}

const play = (state: DuelState, side: Side = 'player') => {
  const steps = resolvePlan(state, side, state.fighters[side].hand.slice(0, RULES.slots));
  return steps[steps.length - 1].state;
};

describe('preparação', () => {
  it('cada lado começa com 30 de vida, 5 cartas na mão e 15 no baralho', () => {
    const { fighters } = createDuel(42);
    for (const f of [fighters.player, fighters.rival]) {
      expect(f.hp).toBe(30);
      expect(f.hand).toHaveLength(5);
      expect(f.deck).toHaveLength(15);
    }
  });

  it('a mesma semente gera o mesmo duelo', () => {
    expect(createDuel(7)).toEqual(createDuel(7));
    expect(createDuel(7).fighters.player.hand).not.toEqual(createDuel(8).fighters.player.hand);
  });
});

describe('dano e escudo', () => {
  it('Traço Rápido causa 4 de dano', () => {
    expect(play(duel(['traco-rapido'])).fighters.rival.hp).toBe(26);
  });

  it('Painel Duplo acerta duas vezes', () => {
    const steps = resolvePlan(
      duel(['painel-duplo']),
      'player',
      duel(['painel-duplo']).fighters.player.hand,
    );
    expect(steps).toHaveLength(0); // cartas de outro duelo não estão na mão
    const state = duel(['painel-duplo']);
    const [step] = resolvePlan(state, 'player', state.fighters.player.hand);
    expect(step.state.fighters.rival.hp).toBe(24);
    expect(step.events.filter((e) => e.t === 'damage')).toHaveLength(2);
  });

  it('o escudo absorve o dano antes da vida', () => {
    const end = play(duel(['splash-page'], { rival: { shield: 6 } }));
    expect(end.fighters.rival.shield).toBe(0);
    expect(end.fighters.rival.hp).toBe(26);
  });

  it('o escudo dura o turno inimigo e acaba no começo do próprio turno seguinte', () => {
    const shielded = play(duel(['reticula']));
    expect(shielded.fighters.player.shield).toBe(9);
    const rivalTurn = startTurn(shielded, 'rival').state;
    expect(rivalTurn.fighters.player.shield).toBe(9);
    expect(startTurn(rivalTurn, 'player').state.fighters.player.shield).toBe(0);
  });
});

describe('cura', () => {
  it('Café da Madrugada cura 4 sem passar do máximo', () => {
    expect(play(duel(['cafe'], { player: { hp: 20 } })).fighters.player.hp).toBe(24);
    expect(play(duel(['cafe'], { player: { hp: 28 } })).fighters.player.hp).toBe(30);
  });
});

describe('Foco', () => {
  it('dobra o dano da carta do slot seguinte', () => {
    expect(play(duel(['foco', 'traco-rapido'])).fighters.rival.hp).toBe(22);
  });

  it('a ordem importa: golpe antes do Foco não dobra', () => {
    expect(play(duel(['traco-rapido', 'foco'])).fighters.rival.hp).toBe(26);
  });

  it('se perde quando a carta seguinte não é de dano', () => {
    expect(play(duel(['foco', 'borracha', 'traco-rapido'])).fighters.rival.hp).toBe(26);
  });
});

describe('energia', () => {
  it('cada carta gasta o seu custo', () => {
    expect(play(duel(['traco-rapido', 'borracha'])).fighters.player.energy).toBe(1);
  });

  it('plano mais caro que a energia é inválido e não resolve', () => {
    const state = duel(['splash-page', 'traco-rapido']);
    expect(isValidPlan(state.fighters.player, state.fighters.player.hand)).toBe(false);
    expect(resolvePlan(state, 'player', state.fighters.player.hand)).toHaveLength(0);
  });

  it('Prazo Final dá 2 de energia na hora e custa 3 de vida', () => {
    const state = duel(['prazo-final', 'splash-page', 'traco-rapido']);
    expect(energyAfter(3, state.fighters.player.hand)).toBe(1);
    const end = play(state);
    expect(end.fighters.player.hp).toBe(27);
    expect(end.fighters.rival.hp).toBe(16);
  });

  it('Prazo Final depois da carta cara não paga por ela', () => {
    const state = duel(['splash-page', 'traco-rapido', 'prazo-final']);
    expect(energyAfter(3, state.fighters.player.hand)).toBe(-1);
  });

  it('a energia não acumula de um turno para o outro', () => {
    const idle = duel([]);
    expect(startTurn(idle, 'player').state.fighters.player.energy).toBe(3);
  });

  it('Respingo de Tinta tira 1 de energia do próximo turno do rival, uma vez só', () => {
    const end = play(duel(['respingo']));
    expect(end.fighters.rival.hp).toBe(27);
    const rivalTurn = startTurn(end, 'rival').state;
    expect(rivalTurn.fighters.rival.energy).toBe(2);
    expect(startTurn(rivalTurn, 'rival').state.fighters.rival.energy).toBe(3);
  });
});

describe('compra', () => {
  it('o turno começa comprando 1 carta', () => {
    const state = createDuel(3);
    const next = startTurn(state, 'player').state;
    expect(next.fighters.player.hand).toHaveLength(6);
    expect(next.fighters.player.deck).toHaveLength(14);
  });

  it('Rascunho compra 2 cartas', () => {
    const state = duel(['rascunho']);
    const end = play(state);
    expect(end.fighters.player.hand).toHaveLength(2);
  });

  it('comprar sem baralho causa 2 de dano por carta', () => {
    const empty = duel(['rascunho'], { player: { deck: [] } });
    expect(play(empty).fighters.player.hp).toBe(26);
    expect(startTurn(duel([], { player: { deck: [] } }), 'player').state.fighters.player.hp).toBe(
      28,
    );
  });
});

describe('fim de jogo', () => {
  it('vence quem zera a vida do outro, e o resto do plano não resolve', () => {
    const state = duel(['traco-rapido', 'traco-rapido'], { rival: { hp: 3 } });
    const steps = resolvePlan(state, 'player', state.fighters.player.hand);
    expect(steps).toHaveLength(1);
    expect(steps[0].state.winner).toBe('player');
    expect(steps[0].state.fighters.rival.hp).toBe(0);
  });

  it('Prazo Final com 3 de vida entrega a vitória ao rival', () => {
    expect(play(duel(['prazo-final'], { player: { hp: 3 } })).winner).toBe('rival');
  });

  it('a fadiga também encerra o duelo', () => {
    const state = duel([], { player: { deck: [], hp: 2 } });
    expect(startTurn(state, 'player').state.winner).toBe('rival');
  });

  it('nada resolve depois que o duelo acabou', () => {
    const over = { ...duel(['traco-rapido']), winner: 'rival' as const };
    expect(resolvePlan(over, 'player', over.fighters.player.hand)).toHaveLength(0);
  });
});

describe('IA', () => {
  it('só gera planos que a energia paga', () => {
    const state = duel([], {}, ['r-splash-page', 'r-traco-rapido', 'r-prazo-final', 'r-foco']);
    for (const plan of allPlans(state.fighters.rival.hand, 3)) {
      expect(isValidPlan(state.fighters.rival, plan)).toBe(true);
    }
  });

  it('no difícil, usa Postura Alta antes do golpe mais forte', () => {
    const state = duel([], {}, ['r-traco-rapido', 'r-foco', 'r-painel-duplo']);
    const plan = choosePlan(state, 'rival', 'hard').map((c) => c.id);
    expect(plan.indexOf('r-foco')).toBe(plan.indexOf('r-painel-duplo') - 1);
  });

  it('no difícil, fecha o duelo quando tem dano letal', () => {
    const state = duel([], { player: { hp: 4 } }, ['r-reticula', 'r-traco-rapido', 'r-cafe']);
    const steps = resolvePlan(state, 'rival', choosePlan(state, 'rival', 'hard'));
    expect(steps[steps.length - 1].state.winner).toBe('rival');
  });

  it('no difícil, se defende com menos de 30% de vida', () => {
    const state = duel([], { rival: { hp: 6 } }, ['r-reticula', 'r-traco-rapido', 'r-borracha']);
    const plan = choosePlan(state, 'rival', 'hard').map((c) => c.id);
    expect(plan).toContain('r-reticula');
  });

  it('no difícil, prioriza cura quando não tem carta de dano', () => {
    const state = duel([], { rival: { hp: 15 } }, ['r-cafe', 'r-borracha', 'r-reticula']);
    expect(choosePlan(state, 'rival', 'hard').map((c) => c.id)).toContain('r-cafe');
  });

  it('em todos os níveis o plano escolhido é válido', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const state = startTurn(createDuel(seed), 'rival').state;
      for (const level of ['easy', 'normal', 'hard'] as const) {
        expect(isValidPlan(state.fighters.rival, choosePlan(state, 'rival', level))).toBe(true);
      }
    }
  });
});
