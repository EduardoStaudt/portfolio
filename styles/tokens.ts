/**
 * Design tokens: fonte única de verdade do visual.
 * `tokensToCss()` transforma tudo em CSS variables, injetadas no <head> pelo layout
 * e consumidas por `app/globals.css` (e pelo Tailwind via `@theme inline`).
 */

export const palette = {
  paper: '#F5F1E8',
  ink: '#0A0A0A',
  red: '#D7263D',
  wine: '#73172D',
  darkRed: '#3B1725',
  white: '#FFFFFF',
  orange: '#F28C28',
  blue: '#2E6FD8',
  // derivados para a "página invertida" (dark mode)
  paperShade: '#E9E3D5',
  nightPaper: '#110D0F',
  nightPaperShade: '#1D1619',
  redOnNight: '#FF6B7A',
  orangeOnPaper: '#9A4F06',
  blueOnPaper: '#1F52A8',
  blueOnNight: '#7FAEFF',
} as const;

export const tokens = {
  font: {
    display: 'var(--font-dela), "Arial Black", Impact, sans-serif',
    body: 'var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif',
    bubble: 'var(--font-comic), "Comic Sans MS", "Trebuchet MS", sans-serif',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
    '2xl': '2.5rem',
    '3xl': 'clamp(2.5rem, 6vw, 4.5rem)',
    hero: 'clamp(3rem, 11vw, 10rem)',
  },
  space: {
    gutter: 'clamp(0.75rem, 1.6vw, 1.5rem)', // calha entre painéis
    page: 'clamp(1rem, 4vw, 4rem)', // margem da página
    header: '4.5rem',
  },
  border: {
    thin: '2px',
    panel: '4px',
    heavy: '6px',
  },
  shadow: {
    panel: '6px 6px 0 0 var(--ink)',
    lift: '10px 10px 0 0 var(--ink)',
    bubble: '3px 3px 0 0 var(--ink)',
  },
  z: {
    base: 0,
    panel: 1,
    bubble: 10,
    nav: 40,
    header: 50,
    overlay: 60,
    transition: 70,
    egg: 80,
    loader: 90,
    cursor: 100,
  },
  duration: {
    fast: 0.15,
    base: 0.3,
    slow: 0.6,
    flip: 0.9,
    loader: 1.7,
  },
  ease: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    impact: 'cubic-bezier(0.2, 1.6, 0.4, 1)',
  },
  breakpoint: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const;

type Vars = Record<string, string>;

/** Página clara, modo P&B (padrão). No P&B os acentos apontam para a própria tinta. */
const baseTheme: Vars = {
  paper: palette.paper,
  'paper-shade': palette.paperShade,
  ink: palette.ink,
  accent: 'var(--ink)',
  'accent-deep': 'var(--ink)',
  'accent-dark': 'var(--ink)',
  'accent-text': 'var(--ink)',
  'on-accent': 'var(--paper)',
  orange: 'var(--ink)',
  'orange-text': 'var(--ink)',
  blue: 'var(--ink)',
  'blue-text': 'var(--ink)',
  // cores chapadas de preenchimento: em branco no P&B, acendem no modo colorido
  spot: 'var(--paper)',
  'spot-2': 'var(--paper)',
  'spot-3': 'var(--paper)',
  'logo-plate': palette.paper,
};

/** Página invertida: papel escuro, tinta clara. */
const darkTheme: Vars = {
  paper: palette.nightPaper,
  'paper-shade': palette.nightPaperShade,
  ink: palette.paper,
};

/** Modo colorido: acende vermelho, laranja e azul. */
const colorTheme: Vars = {
  accent: palette.red,
  'accent-deep': palette.wine,
  'accent-dark': palette.darkRed,
  'accent-text': palette.wine,
  'on-accent': palette.white,
  orange: palette.orange,
  'orange-text': palette.orangeOnPaper,
  blue: palette.blue,
  'blue-text': palette.blueOnPaper,
  spot: palette.red,
  'spot-2': palette.orange,
  'spot-3': palette.blue,
};

const colorDarkTheme: Vars = {
  'accent-text': palette.redOnNight,
  'orange-text': palette.orange,
  'blue-text': palette.blueOnNight,
};

export const themes = { baseTheme, darkTheme, colorTheme, colorDarkTheme };

const block = (vars: Vars) =>
  Object.entries(vars)
    .map(([k, v]) => `--${k}:${v};`)
    .join('');

const flatten = (prefix: string, group: Record<string, string | number>, unit = ''): Vars =>
  Object.fromEntries(Object.entries(group).map(([k, v]) => [`${prefix}-${k}`, `${v}${unit}`]));

/** Gera o CSS com todas as variáveis. Chamado uma vez no layout (server). */
export function tokensToCss(): string {
  const staticVars: Vars = {
    ...flatten('ff', tokens.font),
    ...flatten('fs', tokens.fontSize),
    ...flatten('space', tokens.space),
    ...flatten('bw', tokens.border),
    ...flatten('shadow', tokens.shadow),
    ...flatten('z', tokens.z),
    ...flatten('dur', tokens.duration, 's'),
    ...flatten('ease', tokens.ease),
  };

  return [
    `:root{${block(staticVars)}${block(baseTheme)}color-scheme:light;}`,
    // respeita o sistema quando o visitante ainda não escolheu
    `@media (prefers-color-scheme:dark){:root:not([data-page="light"]){${block(darkTheme)}color-scheme:dark;}}`,
    `:root[data-page="dark"]{${block(darkTheme)}color-scheme:dark;}`,
    `:root[data-ink="color"]{${block(colorTheme)}}`,
    `@media (prefers-color-scheme:dark){:root[data-ink="color"]:not([data-page="light"]){${block(colorDarkTheme)}}}`,
    `:root[data-ink="color"][data-page="dark"]{${block(colorDarkTheme)}}`,
  ].join('\n');
}
