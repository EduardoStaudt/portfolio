/** Capítulos do volume. A ordem aqui é a ordem do sumário (Nav) e precisa ser a mesma de app/page.tsx. */

export type Chapter = {
  /** id da seção no DOM (âncora) */
  id: string;
  /** rótulo curto do sumário: "Capa", "Cap. 1"... */
  number: string;
  title: string;
  /** direção de leitura do capítulo, mostrada no sumário */
  direction: 'vertical' | 'horizontal';
};

export const chapters: Chapter[] = [
  { id: 'capa', number: 'Capa', title: 'Vol. 1', direction: 'vertical' },
  { id: 'quem-sou', number: 'Cap. 1', title: 'Quem sou', direction: 'horizontal' },
  { id: 'projetos', number: 'Cap. 2', title: 'Projetos', direction: 'horizontal' },
  { id: 'habilidades', number: 'Cap. 3', title: 'Habilidades', direction: 'vertical' },
  { id: 'pesquisa', number: 'Cap. 4', title: 'Pesquisa e conquistas', direction: 'vertical' },
  { id: 'contato', number: 'Contracapa', title: 'Contato', direction: 'vertical' },
];
