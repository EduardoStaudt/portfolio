/**
 * Currículo (página /curriculo). A tela e a impressão têm o mesmo desenho; a impressão
 * cabe em uma folha A4 (ver o bloco `@media print` em app/globals.css).
 */

import { site } from './site';

export const cv = {
  headline: 'Ciência da Computação e Ciências Econômicas · foco em Machine Learning',
  location: 'Santa Helena, PR',
  summary:
    'Estudante de Ciência da Computação na UTFPR e de Ciências Econômicas na Uninter. Minha experiência vem das iniciações científicas, onde desenvolvo projetos de Machine Learning do dado ao modelo em uso. Gosto de unir programação, matemática e visão de negócio, trabalho bem em equipe e aprendo rápido. Busco oportunidades para aplicar e aprofundar inteligência artificial em problemas reais.',
  education: [
    {
      course: 'Bacharelado em Ciência da Computação',
      school: 'UTFPR, campus Santa Helena',
      status: '4º período · conclusão em dez/2028',
    },
    {
      course: 'Bacharelado em Ciências Econômicas',
      school: 'Uninter, polo Santa Helena',
      status: '4º período · conclusão em dez/2028',
    },
    {
      course: 'Técnico em Administração',
      school: 'Curso profissionalizante no ensino médio',
      status: 'concluído',
    },
  ],
  experience: [
    {
      role: 'Iniciação Científica',
      place: 'UTFPR',
      status: 'concluída',
      subtitle: 'Rede Neural para Predição de Desempenho em Colunas de Adsorção em Leito Fixo',
      bullets: [
        'Treinei uma cascata de redes neurais em Python (TensorFlow e Keras) que substitui o solver numérico da coluna de adsorção e prevê a curva de ruptura em uma fração do tempo.',
        'Montei o pipeline de dados, reproduzível por sementes, que gera e filtra cerca de 1,1 milhão de casos simulados, com 47 entradas e 200 saídas por caso.',
      ],
    },
    {
      role: 'Iniciação Científica II',
      place: 'UTFPR',
      status: 'em andamento',
      subtitle: '',
      bullets: [
        'Continuação da pesquisa anterior, agora com PINNs, misturas multicomponente e leitos estratificados, levando ainda mais matemática para o modelo.',
      ],
    },
  ],
  projects: [
    {
      name: 'NNAdsorption',
      stack: 'Python, ONNX Runtime, FastAPI, Flutter Web',
      text: 'biblioteca que roda o modelo da pesquisa no lugar do solver numérico e plataforma web em desenvolvimento que o expõe por API REST.',
      links: ['https://nnadsorption-app.web.app/'],
    },
    {
      name: 'Glazzy',
      stack: 'Flutter (Dart), Cloudflare',
      text: 'ERP para vidraçarias, do orçamento à entrega em um só lugar. Produto no ar, publicado na Cloudflare.',
      links: ['https://glazzy.pages.dev'],
    },
    {
      name: 'Portfólio',
      stack: 'Next.js, TypeScript, Tailwind CSS',
      text: 'site pessoal em formato de mangá, com animações de página, cena 3D e um jogo de cartas com IA.',
      // o endereço entra sozinho quando `site.url` deixar de ser placeholder (lib/data/site.ts)
      links: site.url.includes('TODO_') ? [] : [site.url],
    },
    {
      name: 'Hero Maze',
      stack: 'Godot 4, GDScript',
      text: 'jogo feito em equipe no projeto integrador. Fui vice-líder e o principal artista de pixel art, e ajudei em código, documentação e QA.',
      links: ['https://thefenexy.itch.io/hero-maze'],
    },
    {
      name: 'GymSolver',
      stack: 'Java, SQLite',
      text: 'sistema para academia feito em Programação Orientada a Objetos.',
      links: ['https://github.com/EduardoStaudt/gymsolver-poo'],
    },
    {
      name: 'Batalha Naval em Assembly',
      stack: 'Assembly',
      text: 'jogo contra o computador em tempo real, projeto final de Arquitetura e Organização de Computadores.',
      links: ['https://github.com/EduardoStaudt/BatalhaNavalAssembly'],
    },
    {
      name: 'Análise de algoritmos de ordenação',
      stack: 'Java, Go, Python',
      text: 'benchmark de tempo, comparações e trocas de quick, merge, radix e heap sort, em entradas de até 2 milhões de elementos.',
      links: ['https://github.com/EduardoStaudt/AnalyzingSortingAlgorithms-PO'],
    },
  ] as { name: string; stack: string; text: string; links: string[] }[],
  honors: [
    'Apresentação da pesquisa de iniciação científica no CNMAC 2026, o Congresso Nacional de Matemática Aplicada e Computacional.',
    'Certificados na OBMEP, a Olimpíada Brasileira de Matemática das Escolas Públicas.',
  ],
  skills: [
    { label: 'Linguagens', value: 'Python, Java e Flutter (Dart)' },
    { label: 'Banco de dados', value: 'SQL (estudado na graduação) e Supabase' },
    {
      label: 'IA aplicada',
      value: 'Machine Learning (meu foco principal), TensorFlow, Keras, NumPy, Pandas e PyTorch',
    },
    { label: 'Ferramentas', value: 'Git, GitHub, VS Code, Claude e metodologias ágeis' },
    { label: 'Comportamentais', value: 'Trabalho em equipe, curiosidade e aprendizado rápido' },
    { label: 'Idiomas', value: 'Português nativo e inglês básico' },
  ],
  printLabel: 'Imprimir / salvar em PDF',
  printHint: 'A impressão sai em uma folha A4.',
};
