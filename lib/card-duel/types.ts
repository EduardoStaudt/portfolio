/** Tipos do duelo de cartas (easter egg do chapéu de palha). */

export type Side = 'player' | 'rival';

export type CardKind = 'attack' | 'shield' | 'heal' | 'utility';

/** desenho da carta (components/easter-eggs/card-duel/Card.tsx) */
export type CardArt =
  | 'strike'
  | 'drain'
  | 'double'
  | 'finisher'
  | 'guard'
  | 'wall'
  | 'heal'
  | 'surge'
  | 'focus'
  | 'draw';

export type Effect =
  | { t: 'damage'; n: number; times?: number }
  /** o oponente começa o próximo turno com menos energia */
  | { t: 'drain'; n: number }
  | { t: 'shield'; n: number }
  | { t: 'heal'; n: number }
  | { t: 'energy'; n: number }
  | { t: 'selfDamage'; n: number }
  /** a carta do slot seguinte, se for de dano, causa o dobro */
  | { t: 'focus' }
  | { t: 'draw'; n: number };

export type CardDef = {
  id: string;
  name: string;
  cost: number;
  kind: CardKind;
  art: CardArt;
  /** texto de regra mostrado na carta */
  text: string;
  effects: Effect[];
};

/** uma cópia física de carta: `uid` é único no duelo, `id` aponta para o CardDef */
export type CardInstance = { uid: number; id: string };

export type Fighter = {
  hp: number;
  shield: number;
  energy: number;
  /** energia a menos no começo do próximo turno (efeito `drain` do oponente) */
  energyPenalty: number;
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
};

export type DuelState = {
  fighters: Record<Side, Fighter>;
  turn: Side;
  round: number;
  winner: Side | null;
  /** estado do gerador pseudoaleatório (determinístico) */
  seed: number;
};

/** o que aconteceu em um passo, para a interface animar */
export type DuelEvent =
  | { t: 'damage'; target: Side; amount: number; blocked: number; doubled: boolean }
  | { t: 'shield'; target: Side; amount: number }
  | { t: 'heal'; target: Side; amount: number }
  | { t: 'energy'; target: Side; amount: number }
  | { t: 'drain'; target: Side; amount: number }
  | { t: 'draw'; target: Side; amount: number }
  | { t: 'fatigue'; target: Side; amount: number }
  | { t: 'focus'; target: Side };

export type Step = {
  state: DuelState;
  events: DuelEvent[];
  /** quem agiu neste passo */
  side: Side;
  /** carta resolvida (ausente no passo de começo de turno) */
  card?: CardInstance;
  slot?: number;
};

export type Plan = CardInstance[];

export type Difficulty = 'easy' | 'normal' | 'hard';
