/**
 * Cap. 3 "Habilidades": três espadas, três áreas.
 * `design` escolhe o modelo (3D e 2D) da espada; o resto é texto livre.
 */

export type SwordDesign = 'pixel' | 'neural' | 'root';

export type SkillSword = {
  id: string;
  design: SwordDesign;
  /** nome da espada */
  name: string;
  /** área que ela representa */
  area: string;
  /** cor de destaque no modo colorido */
  accent: 'blue' | 'red' | 'orange';
  /** frase curta que aparece no hover */
  motto: string;
  /** texto do painel detalhado */
  description: string;
  skills: { name: string; note?: string }[];
  sfx: string;
};

export const skillsIntro = {
  kicker: 'Capítulo 3',
  title: 'Habilidades',
  lead: 'Três lâminas fincadas no campo. Passe o mouse para senti-las, clique para empunhar.',
  leadTouch: 'Três lâminas fincadas no campo. Toque em uma para empunhar.',
  /** ficha ao lado do campo, enquanto nenhuma espada está empunhada */
  emptyTitle: 'Nenhuma lâmina empunhada',
  emptyText: 'Clique em uma espada para abrir a ficha completa dela.',
};

export const swords: SkillSword[] = [
  {
    id: 'front-end',
    design: 'pixel',
    name: 'Lâmina Pixel',
    area: 'Front-end',
    accent: 'blue',
    motto: 'Corta interface com precisão de um pixel.',
    description:
      'A espada leve, de quem constrói o que as pessoas veem e tocam: aplicativos e sites, jogos e a arte que vai dentro deles.',
    skills: [
      { name: 'Flutter (Dart)', note: 'web e mobile' },
      { name: 'Next.js / React', note: 'este portfólio' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Godot / GDScript', note: 'jogos' },
      { name: 'Pixel art', note: 'sprites' },
    ],
    sfx: 'シャキン',
  },
  {
    id: 'machine-learning',
    design: 'neural',
    name: 'Montante Neural',
    area: 'Machine Learning',
    accent: 'red',
    motto: 'A lâmina principal. Pesada, larga e ainda em forja.',
    description:
      'Minha arma principal: modelar o mundo com dados. Da rede neural clássica às redes informadas por física, sempre com método científico.',
    skills: [
      { name: 'Python' },
      { name: 'TensorFlow / Keras' },
      { name: 'PyTorch' },
      { name: 'NumPy / Pandas' },
      { name: 'ONNX Runtime' },
      { name: 'PINNs', note: 'em estudo' },
      { name: 'Pesquisa científica' },
    ],
    sfx: 'ズバァン',
  },
  {
    id: 'back-end',
    design: 'root',
    name: 'Gládio Raiz',
    area: 'Back-end e base',
    accent: 'orange',
    motto: 'Curta, firme e confiável. A fundação de tudo.',
    description:
      'A espada da base: APIs, banco de dados, lógica de baixo nível e as ferramentas que mantêm um projeto de pé.',
    skills: [
      { name: 'Java', note: 'orientação a objetos' },
      { name: 'FastAPI', note: 'API REST' },
      { name: 'SQL / Supabase' },
      { name: 'C e Assembly' },
      { name: 'Estruturas de dados' },
      { name: 'Git / GitHub' },
    ],
    sfx: 'ガキン',
  },
];
