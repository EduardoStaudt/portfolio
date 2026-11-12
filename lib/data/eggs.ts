/** Easter eggs e a ficha do grimório. Homenagens: nada de personagens, logos ou artes oficiais. */

export type EggId = 'tesouro' | 'serra' | 'grimorio' | 'duelo';

export type Egg = {
  id: EggId;
  name: string;
  /** mensagem do aviso quando o segredo é encontrado */
  found: string;
  /** dica mostrada na página secreta enquanto não foi achado */
  hint: string;
  /** bônus: não entra no contador nem é exigido para abrir a página secreta */
  optional?: boolean;
};

export const eggs: Egg[] = [
  {
    id: 'tesouro',
    name: 'O chapéu de palha',
    found: 'Tesouro encontrado!',
    hint: 'Alguém no Capítulo 1 está usando um chapéu de palha.',
  },
  {
    id: 'serra',
    name: 'O ronco do motor',
    found: 'VRRRUM! Você chamou o autor.',
    hint: 'Digite o primeiro nome do autor deste mangá. (Ou insista bastante na logo.)',
  },
  {
    id: 'grimorio',
    name: 'O grimório',
    found: 'Um grimório de cinco folhas escolheu você.',
    hint: 'Um código clássico dos videogames abre o livro. Ou procure um trevo na contracapa.',
  },
  {
    id: 'duelo',
    name: 'O duelista',
    found: 'Vitória! Você ganhou o selo de Duelista.',
    hint: 'Bônus: o dono do chapéu de palha aceita duelos. Vença um.',
    optional: true,
  },
];

export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

/** palavra que liga a serra, e o grito que aparece na tela */
export const SAW_WORD = ['e', 'd', 'u', 'a', 'r', 'd', 'o'] as const;
export const SAW_SHOUT = 'EDUARDO!!';

/** Ficha estilo RPG mostrada dentro do grimório. Valores de 0 a 100. */
export const grimoire = {
  title: 'Grimório do Eduardo',
  klass: 'Mago-Espadachim de Dados',
  level: 'Nv. 1 (Vol. 1)',
  stats: [
    { name: 'Machine Learning', value: 82 },
    { name: 'Front-end', value: 78 },
    { name: 'Lógica e base (C)', value: 74 },
    { name: 'Pixel art', value: 88 },
    { name: 'Matemática', value: 85 },
    { name: 'Economia', value: 64 },
  ],
  traits: [
    'Passiva: vice-líder de equipe no Hero Maze',
    'Magia em estudo: PINNs',
    'Missão principal: empreender',
  ],
};

/** Duelo de cartas do chapéu de palha. As cartas em si ficam em lib/card-duel/cards.ts. */
export const duel = {
  offer: 'Aceitar o duelo',
  title: 'Duelo de nanquim',
  intro:
    'O Ronin Rubro desafiou o Mangaká. Monte até 3 cartas por turno, na ordem certa, e zere a vida dele.',
  rules: [
    '30 de vida, 3 de energia por turno (não acumula) e 1 carta comprada por turno.',
    'Os slots resolvem da esquerda para a direita: Foco antes de um golpe dobra o dano.',
    'O escudo dura até o fim do próximo turno do rival.',
    'Baralho vazio: 2 de dano a cada compra impossível.',
  ],
  levels: [
    { id: 'easy', name: 'Fácil', note: 'Joga ao acaso e mostra o que pretende fazer.' },
    {
      id: 'normal',
      name: 'Normal',
      note: 'Escolhe as melhores cartas e mostra o que pretende fazer.',
    },
    {
      id: 'hard',
      name: 'Difícil',
      note: 'Monta combos, se defende na hora certa e esconde as intenções.',
    },
  ],
  yourTurn: 'Seu turno',
  resolving: 'Sua jogada!',
  drawing: 'Comprando carta...',
  rivalTurn: 'Vez do Ronin Rubro',
  intentLabel: 'Próximo turno:',
  intentNone: 'só observar',
  energyLeft: 'Energia que sobra',
  noEnergy: 'Falta energia nessa ordem',
  execute: 'Executar',
  pass: 'Passar a vez',
  help: 'Arraste a carta até um slot, ou clique na carta e depois no slot. No teclado: setas e Enter.',
  win: { big: 'FIM', text: 'O Ronin Rubro guardou a lâmina. Vitória do Mangaká!' },
  lose: {
    big: 'Continua...',
    text: 'O Mangaká caiu, mas o próximo capítulo ainda não foi desenhado.',
  },
  rematch: 'Revanche',
  changeLevel: 'Trocar o nível',
  quit: 'Sair',
  seal: 'Duelista',
  sealHint: 'Selo em branco: vença o duelo do chapéu de palha.',
} as const;

export const secretPage = {
  title: 'Omake: o capítulo secreto',
  lead: 'Você achou todos os segredos. Leitor assim merece página extra.',
  yonkoma: {
    title: 'Bastidores em 4 quadros',
    panels: [
      { caption: 'Dia 1', text: 'Vou fazer um portfólio simples. Uma página e pronto.' },
      { caption: 'Dia 2', text: 'E se a capa abrisse igual a um mangá de verdade?' },
      { caption: 'Dia 5', text: 'Só falta colocar três espadas em 3D. E um grimório.' },
      { caption: 'Hoje', text: '...ficou simples, né?' },
    ],
  },
  editor: {
    title: 'Ateliê de pixel art',
    lead: 'Pinte o seu próprio sprite: clique ou arraste na grade. O que você desenhar aqui aparece na tela do notebook do Capítulo 1.',
    clear: 'Limpar',
    reset: 'Voltar ao bichinho',
  },
  replay: 'Duelar de novo',
  thanks: 'Obrigado por ler até aqui. Se quiser conversar, a contracapa tem os links.',
  locked: 'Página lacrada. Encontre todos os segredos para romper o selo.',
};

export const consoleArt = `
   ______
  |  ____|   Eduardo Andrei Staudt · Vol. 1
  | |__      -------------------------------
  |  __|     Oi, dev! Curioso, hein?
  | |____    Tem segredos escondidos neste mangá.      
  |______|   Dica: tente digitar o nome do autor.
`;
