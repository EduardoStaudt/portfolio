/**
 * Cap. 1 "Quem sou": cada item é um quadro da tira horizontal.
 * Para mudar a história, edite os textos. Para trocar o desenho, mude `art`
 * (as ilustrações disponíveis ficam em components/manga/illustrations).
 */

export type AboutArt = 'hero' | 'campus' | 'network' | 'laptop' | 'pixel' | 'medals' | 'horizon';

export type Bubble = {
  kind: 'speech' | 'shout' | 'whisper' | 'thought';
  text: string;
};

export type Sfx = {
  text: string;
  /** leitura/tradução */
  sub?: string;
  tone?: 'ink' | 'accent' | 'hollow' | 'orange' | 'blue';
};

export type AboutPanel = {
  id: string;
  art: AboutArt;
  /** descrição do desenho para leitores de tela */
  alt: string;
  /** recordatório (caixa de narração) */
  caption?: string;
  bubbles: Bubble[];
  sfx?: Sfx;
  /** largura relativa do quadro no desktop */
  size: 'sm' | 'md' | 'lg';
};

export const aboutIntro = {
  kicker: 'Capítulo 1',
  title: 'Quem sou',
  lead: 'A origem do protagonista, em seis quadros.',
};

export const aboutPanels: AboutPanel[] = [
  {
    id: 'apresentacao',
    art: 'hero',
    alt: 'Silhueta de um jovem de costas, com uma espada às costas, olhando o horizonte.',
    caption: 'Oeste do Paraná. Um estudante, dois cursos e código demais.',
    bubbles: [
      { kind: 'shout', text: 'Prazer! Eu sou o Eduardo.' },
      { kind: 'speech', text: 'Programo, pesquiso e desenho pixel por pixel.' },
    ],
    sfx: { text: 'ドン!', sub: 'DON!', tone: 'accent' },
    size: 'lg',
  },
  {
    id: 'cursos',
    art: 'campus',
    alt: 'Dois prédios de universidade lado a lado, ligados por uma ponte.',
    caption: 'Duas graduações ao mesmo tempo.',
    bubbles: [
      { kind: 'speech', text: 'Curso Ciência da Computação na UTFPR, campus Santa Helena...' },
      { kind: 'speech', text: '...e Ciências Econômicas na Uninter.' },
      { kind: 'thought', text: 'Algoritmos de dia, curvas de oferta e demanda de noite.' },
    ],
    sfx: { text: 'ゴゴゴ', sub: 'GO GO GO', tone: 'ink' },
    size: 'lg',
  },
  {
    id: 'ic',
    art: 'network',
    alt: 'Diagrama de uma rede neural com camadas de neurônios conectados.',
    caption: 'Iniciação científica.',
    bubbles: [
      { kind: 'speech', text: 'Na IC, treino redes neurais para modelar fenômenos reais.' },
      { kind: 'thought', text: 'E se a rede também obedecesse às leis da física? (PINNs...)' },
    ],
    sfx: { text: 'ピカッ', sub: 'FLASH', tone: 'blue' },
    size: 'md',
  },
  {
    id: 'faculdade',
    art: 'laptop',
    alt: 'Um notebook aberto mostrando um gráfico com uma curva descendo.',
    caption: 'Entre uma aula e outra...',
    bubbles: [
      {
        kind: 'speech',
        text: 'Já fiz Batalha Naval em Assembly e um sistema de academia em Java.',
      },
      {
        kind: 'speech',
        text: 'E medi quick, merge, radix e heap sort com até 2 milhões de elementos.',
      },
    ],
    sfx: { text: 'カタカタ', sub: 'TEC TEC', tone: 'ink' },
    size: 'md',
  },
  {
    id: 'pixel',
    art: 'pixel',
    alt: 'Uma grade de pixels formando um pequeno monstro de jogo, ao lado de uma paleta de cores.',
    caption: 'Enquanto isso, no editor de sprites...',
    bubbles: [
      {
        kind: 'speech',
        text: 'Também sou pixel artist. Chefes e inimigos são a minha especialidade.',
      },
      { kind: 'whisper', text: '(cada pixel no lugar certo.)' },
    ],
    sfx: { text: 'ポチッ', sub: 'CLIC', tone: 'orange' },
    size: 'md',
  },
  {
    id: 'objetivo',
    art: 'horizon',
    alt: 'Uma estrada que sobe uma montanha até uma bandeira fincada no topo, com o sol nascendo atrás.',
    caption: 'O objetivo final.',
    bubbles: [
      { kind: 'speech', text: 'Meu plano? Empreender.' },
      {
        kind: 'speech',
        text: 'Juntar código, dados e economia em algo que resolva problema de verdade.',
      },
    ],
    sfx: { text: 'ザッ', sub: 'ZA!', tone: 'accent' },
    size: 'lg',
  },
];
