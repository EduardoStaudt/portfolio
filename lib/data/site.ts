/**
 * Dados gerais do site. Edite aqui: nenhum componente precisa mudar.
 * Valores que começam com `TODO_` são placeholders: o site mostra o botão como "em breve"
 * até você trocar pelo valor real (veja briefing/PENDENCIAS.md).
 */

export const site = {
  name: 'Eduardo Andrei Staudt',
  shortName: 'Eduardo Staudt',
  /** nome em katakana, só decorativo na capa */
  kana: 'エドゥアルド',
  volume: 'Vol. 1',
  tagline: 'Full Stack',
  focus: 'Machine Learning',
  description:
    'Portfólio em formato de mangá de Eduardo Andrei Staudt: estudante de Ciência da Computação (UTFPR) e Ciências Econômicas (Uninter), pesquisador em redes neurais, desenvolvedor e pixel artist.',
  /** URL pública (sem barra no final). Pode vir de NEXT_PUBLIC_SITE_URL na Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://TODO_DOMINIO.vercel.app',
  locale: 'pt_BR',
  keywords: [
    'Eduardo Andrei Staudt',
    'portfólio',
    'machine learning',
    'redes neurais',
    'PINNs',
    'Next.js',
    'pixel art',
    'UTFPR',
  ],
} as const;

export const links = {
  linkedin: 'https://www.linkedin.com/in/eduardo-andrei-staudt/',
  github: 'https://github.com/EduardoStaudt/',
  email: 'programadorstaudt@gmail.com',
  /** página do currículo dentro do próprio site (imprimível) */
  cv: '/curriculo',
} as const;

/** `true` enquanto o valor ainda é um placeholder `TODO_...`. */
export const isTodo = (value: string) => value.startsWith('TODO_');
