/**
 * Cap. 3 "Habilidades": três espadas, três áreas.
 * `design` escolhe o modelo (3D e 2D) da espada; o resto é texto livre.
 */

export type SwordDesign = 'pixel' | 'neural' | 'root';

export type SkillSword = {
  id: string;
  design: SwordDesign;
  /** área que a espada representa */
  area: string;
  /** cor de destaque no modo colorido */
  accent: 'blue' | 'red' | 'orange';
  /** frase curta da ficha */
  motto: string;
  /** texto da ficha */
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

// a ordem é a posição no campo: esquerda, meio, direita
export const swords: SkillSword[] = [
  {
    id: 'full-stack',
    design: 'pixel',
    area: 'Full-Stack',
    accent: 'blue',
    motto: 'Da tela ao banco de dados.',
    description:
      'A espada de quem constrói o produto inteiro: a interface que as pessoas usam, a API por trás dela e os dados que a sustentam.',
    skills: [
      { name: 'Flutter (Dart)', note: 'web e mobile' },
      { name: 'Next.js / React' },
      { name: 'TypeScript' },
      { name: 'Java' },
      { name: 'FastAPI', note: 'API REST' },
      { name: 'SQL / Supabase' },
      { name: 'Cloudflare' },
      { name: 'Git / GitHub' },
    ],
    sfx: 'シャキン',
  },
  {
    id: 'machine-learning',
    design: 'neural',
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
    id: 'outros',
    design: 'root',
    area: 'Outros',
    accent: 'orange',
    motto: 'O que não cabe nas outras duas bainhas.',
    description:
      'As ferramentas de apoio e o jeito de trabalhar: arte para os jogos, escrita científica e as habilidades de equipe.',
    skills: [
      { name: 'Aseprite', note: 'pixel art' },
      { name: 'LaTeX' },
      { name: 'Trabalho em equipe' },
      { name: 'Aprendizado rápido' },
      { name: 'Curiosidade' },
      { name: 'Metodologias ágeis' },
    ],
    sfx: 'ガキン',
  },
];
