import type { CardDef, Side } from './types';

/**
 * Cartas do duelo. Os dois baralhos têm os mesmos efeitos, com nomes diferentes:
 * o Mangaká luta com material de desenho; o Ronin Rubro, com a espada.
 * Cada baralho leva 2 cópias de cada carta (20 no total).
 */

const playerCards: CardDef[] = [
  {
    id: 'traco-rapido',
    name: 'Traço Rápido',
    cost: 1,
    kind: 'attack',
    art: 'strike',
    text: '4 de dano',
    effects: [{ t: 'damage', n: 4 }],
  },
  {
    id: 'respingo',
    name: 'Respingo de Tinta',
    cost: 2,
    kind: 'attack',
    art: 'drain',
    text: '3 de dano. O rival perde 1 de energia no próximo turno',
    effects: [
      { t: 'damage', n: 3 },
      { t: 'drain', n: 1 },
    ],
  },
  {
    id: 'painel-duplo',
    name: 'Painel Duplo',
    cost: 2,
    kind: 'attack',
    art: 'double',
    text: '3 de dano, duas vezes',
    effects: [{ t: 'damage', n: 3, times: 2 }],
  },
  {
    id: 'splash-page',
    name: 'Splash Page',
    cost: 3,
    kind: 'attack',
    art: 'finisher',
    text: '10 de dano',
    effects: [{ t: 'damage', n: 10 }],
  },
  {
    id: 'borracha',
    name: 'Borracha',
    cost: 1,
    kind: 'shield',
    art: 'guard',
    text: '5 de escudo',
    effects: [{ t: 'shield', n: 5 }],
  },
  {
    id: 'reticula',
    name: 'Retícula Protetora',
    cost: 2,
    kind: 'shield',
    art: 'wall',
    text: '9 de escudo',
    effects: [{ t: 'shield', n: 9 }],
  },
  {
    id: 'cafe',
    name: 'Café da Madrugada',
    cost: 1,
    kind: 'heal',
    art: 'heal',
    text: 'Cura 4',
    effects: [{ t: 'heal', n: 4 }],
  },
  {
    id: 'prazo-final',
    name: 'Prazo Final',
    cost: 0,
    kind: 'utility',
    art: 'surge',
    text: '+2 de energia agora. Perde 3 de vida',
    effects: [
      { t: 'energy', n: 2 },
      { t: 'selfDamage', n: 3 },
    ],
  },
  {
    id: 'foco',
    name: 'Foco',
    cost: 1,
    kind: 'utility',
    art: 'focus',
    text: 'Se a carta do slot seguinte for de dano, ela causa o dobro',
    effects: [{ t: 'focus' }],
  },
  {
    id: 'rascunho',
    name: 'Rascunho',
    cost: 0,
    kind: 'utility',
    art: 'draw',
    text: 'Compra 2 cartas',
    effects: [{ t: 'draw', n: 2 }],
  },
];

const rivalNames: Record<string, string> = {
  'traco-rapido': 'Corte Diagonal',
  respingo: 'Golpe no Pulso',
  'painel-duplo': 'Investida Rubra',
  'splash-page': 'Golpe Final',
  borracha: 'Aparar',
  reticula: 'Guarda Firme',
  cafe: 'Respiração Calma',
  'prazo-final': 'Juramento de Sangue',
  foco: 'Postura Alta',
  rascunho: 'Olhar Atento',
};

const rivalCards: CardDef[] = playerCards.map((card) => ({
  ...card,
  id: `r-${card.id}`,
  name: rivalNames[card.id],
  text: card.text.replace('O rival', 'Você'),
}));

export const decks: Record<Side, CardDef[]> = { player: playerCards, rival: rivalCards };

const byId = new Map([...playerCards, ...rivalCards].map((c) => [c.id, c]));

export function cardDef(id: string): CardDef {
  const def = byId.get(id);
  if (!def) throw new Error(`Carta desconhecida: ${id}`);
  return def;
}

export const COPIES = 2;
