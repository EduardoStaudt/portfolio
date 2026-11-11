/**
 * Cap. 2 "Projetos": cada item vira uma página dupla do mangá.
 * Para adicionar um projeto, copie um bloco e ajuste. `art` escolhe a ilustração
 * (components/manga/illustrations/projects.tsx); use 'generic' se ainda não houver desenho próprio.
 * `soon: true` reserva a página dupla só com o aviso de "em breve".
 */

export type ProjectArt = 'glass' | 'adsorption' | 'maze' | 'soon' | 'generic';

export type Project = {
  id: string;
  title: string;
  /** frase de capa da página dupla */
  hook: string;
  /** tipo do projeto, em poucas palavras */
  kind: string;
  role: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: { label: string; href: string };
  /** selo opcional na página (ex.: 'Em andamento') */
  status?: string;
  /** próxima fase do projeto: vira um quadro "Parte 2" na página de detalhes */
  next?: { label: string; status: string; text: string; topics: string[] };
  /** página reservada: mostra só o desenho e o aviso de "em breve" */
  soon?: boolean;
  art: ProjectArt;
  /** descrição do desenho para leitores de tela */
  alt: string;
  sfx: { text: string; sub?: string };
  accent: 'red' | 'blue' | 'orange';
};

export const projectsIntro = {
  kicker: 'Capítulo 2',
  title: 'Projetos',
  lead: 'Cada projeto, uma página dupla.',
};

export const projects: Project[] = [
  {
    id: 'glazzy',
    title: 'Glazzy',
    hook: 'O ERP que deixa a vidraçaria transparente.',
    kind: 'ERP para vidraçarias',
    role: 'Desenvolvimento',
    description:
      'Sistema de gestão feito para a rotina de uma vidraçaria: do orçamento à entrega, tudo em um só lugar.',
    highlights: [
      'Pensado para o fluxo real de vidraçarias',
      'Produto no ar, acessível pelo navegador',
    ],
    stack: ['Web', 'ERP'],
    link: { label: 'Abrir glazzy.pages.dev', href: 'https://glazzy.pages.dev' },
    art: 'glass',
    alt: 'Uma grande vidraça dividida em painéis, com reflexos diagonais e uma lasca brilhando.',
    sfx: { text: 'キラーン', sub: 'BRILHO' },
    accent: 'blue',
  },
  {
    id: 'nnadsorption',
    title: 'NNAdsorption',
    hook: 'Uma rede neural no lugar do solver numérico.',
    kind: 'Pesquisa + plataforma web',
    role: 'Pesquisador (iniciação científica) e desenvolvedor',
    description:
      'Cascata de redes neurais que substitui o solver numérico de colunas de adsorção em leito fixo e prevê a curva de ruptura em uma fração do tempo. A biblioteca roda o modelo e uma plataforma web o expõe por API REST.',
    highlights: [
      'Apresentado no CNMAC 2026',
      'Cerca de 1,1 milhão de casos simulados, com 47 entradas e 200 saídas cada',
      'Pipeline de dados reproduzível por sementes',
    ],
    stack: ['Python', 'TensorFlow / Keras', 'ONNX Runtime', 'FastAPI', 'Flutter Web'],
    next: {
      label: 'Parte 2',
      status: 'Em desenvolvimento',
      text: 'A continuação da pesquisa, na mesma plataforma: as leis da física dentro da rede.',
      topics: ['PINNs', 'Misturas multicomponente', 'Leitos estratificados'],
    },
    link: { label: 'Abrir a plataforma', href: 'https://nnadsorption-app.web.app/' },
    art: 'adsorption',
    alt: 'Um gráfico com uma curva de adsorção subindo e saturando, com pontos de dados e neurônios conectados ao fundo.',
    sfx: { text: 'ゴオオオ', sub: 'GOOOO' },
    accent: 'red',
  },
  {
    id: 'hero-maze',
    title: 'Hero Maze',
    hook: 'Um labirinto, um herói e muitos chefes desenhados à mão.',
    kind: 'Jogo em Godot 4',
    role: 'Vice-líder e pixel artist principal',
    description:
      'Jogo feito em equipe no projeto integrador. Além de ser o principal artista de pixel art, ajudei em código, documentação, liderança e QA.',
    highlights: [
      'Arte: sprites de chefes e inimigos',
      'Código em GDScript e testes (QA)',
      'Documentação e vice-liderança da equipe',
    ],
    stack: ['Godot 4', 'GDScript', 'Pixel art'],
    link: { label: 'Jogar no itch.io', href: 'https://thefenexy.itch.io/hero-maze' },
    art: 'maze',
    alt: 'Um labirinto visto de cima com um pequeno herói em pixel art encarando um chefe com chifres.',
    sfx: { text: 'ドドド', sub: 'DO DO DO' },
    accent: 'orange',
  },
  {
    id: 'em-breve',
    title: 'Em breve',
    hook: '',
    kind: '',
    role: '',
    description: '',
    highlights: [],
    stack: [],
    soon: true,
    art: 'soon',
    alt: 'Uma página de mangá ainda em branco, presa com fita, com um ponto de interrogação e a placa "em breve".',
    sfx: { text: '？？？' },
    accent: 'orange',
  },
];
