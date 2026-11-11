/**
 * Cap. 4 "Pesquisa e conquistas": linha do tempo, de cima para baixo.
 * `when` é texto livre (ex.: "2026"). Deixe vazio para esconder a data.
 */

export type Milestone = {
  id: string;
  title: string;
  /** nome completo / subtítulo */
  subtitle: string;
  when?: string;
  description: string;
  /** selo de "power up" em destaque */
  badge: string;
  sfx: { text: string; sub?: string; tone: 'ink' | 'accent' | 'orange' | 'blue' };
  icon: 'flask' | 'podium' | 'scroll' | 'medal';
};

export const researchIntro = {
  kicker: 'Capítulo 4',
  title: 'Pesquisa e conquistas',
  lead: 'Cada marco, um power up.',
};

export const milestones: Milestone[] = [
  {
    id: 'obmep',
    title: 'OBMEP',
    subtitle: 'Olimpíada Brasileira de Matemática das Escolas Públicas',
    when: '',
    description: 'Onde a matemática virou hábito, ainda na escola.',
    badge: 'Base matemática',
    sfx: { text: 'キラキラ', sub: 'BRILHO', tone: 'orange' },
    icon: 'medal',
  },
  {
    id: 'ic',
    title: 'Iniciação Científica',
    subtitle: 'Redes neurais aplicadas à modelagem',
    when: '',
    description:
      'Entrada na pesquisa: estudar, implementar e testar redes neurais para modelar processos de adsorção.',
    badge: 'Nova classe: pesquisador',
    sfx: { text: 'LEVEL UP!', tone: 'blue' },
    icon: 'flask',
  },
  {
    id: 'sicite',
    title: 'SICITE',
    subtitle: 'Seminário de Iniciação Científica e Tecnológica da UTFPR',
    when: '',
    description:
      'Apresentação dos resultados da iniciação científica no seminário da universidade.',
    badge: 'Primeira apresentação',
    sfx: { text: 'ドーン!', sub: 'DOON!', tone: 'ink' },
    icon: 'podium',
  },
  {
    id: 'cnmac',
    title: 'CNMAC 2026',
    subtitle: 'Congresso Nacional de Matemática Aplicada e Computacional',
    when: '2026',
    description:
      'O NNAdsorption, redes neurais para modelagem de adsorção, apresentado em congresso nacional. Próximo passo: PINNs.',
    badge: 'Congresso nacional',
    sfx: { text: 'POWER UP!', tone: 'accent' },
    icon: 'scroll',
  },
];
