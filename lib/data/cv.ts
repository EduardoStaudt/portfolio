/**
 * Currículo (página /curriculo). Na tela segue o estilo do site; ao imprimir vira um
 * documento formal (ver o bloco `@media print` em app/globals.css).
 */

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
      link: { label: 'site', href: 'https://nnadsorption-app.web.app/' },
    },
    {
      name: 'GymSolver',
      stack: 'Java, SQLite',
      text: 'sistema para academia feito em Programação Orientada a Objetos.',
    },
    {
      name: 'Hero Maze',
      stack: 'Godot 4, GDScript',
      text: 'jogo feito em equipe no projeto integrador. Fui vice-líder e o principal artista de pixel art, e ajudei em código, documentação e QA.',
      link: { label: 'itch.io', href: 'https://thefenexy.itch.io/hero-maze' },
    },
    {
      name: 'Batalha Naval em Assembly',
      stack: '',
      text: 'jogo contra o computador em tempo real, projeto final de Arquitetura e Organização de Computadores.',
    },
    {
      name: 'Análise de algoritmos de ordenação',
      stack: 'Java, Go, Python',
      text: 'benchmark de tempo, comparações e trocas de algoritmos como quick, merge, radix e heap, em entradas de até 2 milhões de elementos.',
    },
  ] as { name: string; stack: string; text: string; link?: { label: string; href: string } }[],
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
