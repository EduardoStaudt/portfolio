import type { ReactNode } from 'react';
import type { AboutArt } from '@/lib/data/about';
import { seeded } from '@/lib/random';

/**
 * Ilustrações do Cap. 1. Tudo SVG em traço de nanquim: `--ink` no traço, `--paper` no fundo.
 * `--spot*` são cores chapadas que ficam em branco no P&B e acendem no modo colorido.
 */

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

function Frame({ alt, children }: { alt: string; children: ReactNode }) {
  return (
    <svg
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {children}
    </svg>
  );
}

function Grass({ y, seed, n = 26 }: { y: number; seed: number; n?: number }) {
  const rand = seeded(seed);
  const d = Array.from({ length: n }, () => {
    const x = rand() * 400;
    const yy = y + rand() * (300 - y);
    const h = 6 + rand() * 9;
    return `M${x.toFixed(1)} ${yy.toFixed(1)}l-3 -${h.toFixed(1)}M${x.toFixed(1)} ${yy.toFixed(1)}l2 -${(h * 1.2).toFixed(1)}M${x.toFixed(1)} ${yy.toFixed(1)}l6 -${(h * 0.8).toFixed(1)}`;
  }).join('');
  return <path d={d} {...line} strokeWidth={2} />;
}

function Hero() {
  return (
    <>
      <circle cx="285" cy="118" r="74" fill="var(--spot)" stroke={INK} strokeWidth="3" />
      <path d="M40 70l10 -6l10 6M84 48l9 -5l9 5M150 84l8 -5l8 5" {...line} strokeWidth={2.5} />
      <path
        d="M0 214C80 196 150 222 230 206S350 196 400 212V300H0Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="3"
      />
      <Grass y={226} seed={3} />
      {/* figura de costas */}
      <g>
        <path d="M150 300C150 250 158 214 176 204H214C232 214 240 250 242 300Z" fill={INK} />
        <path d="M176 204C160 230 150 262 140 300H252C246 262 232 228 214 204Z" fill={INK} />
        <circle cx="195" cy="180" r="24" fill={INK} />
        <path d="M172 176l-9 -16l14 8l4 -16l10 13l10 -14l3 16l14 -6l-8 15Z" fill={INK} />
        {/* espada nas costas */}
        <path d="M236 140L160 276" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M236 140L160 276" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
        <path d="M216 150l34 18" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <path d="M239 134l10 -18" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
    </>
  );
}

function Campus() {
  const windows: ReactNode[] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++)
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={262 + c * 30}
          y={104 + r * 34}
          width="18"
          height="22"
          fill={(r + c) % 3 === 0 ? 'var(--spot-3)' : PAPER}
          stroke={INK}
          strokeWidth="2.5"
        />,
      );
  return (
    <>
      <path
        d="M36 62c8 -16 34 -16 40 0c14 -4 22 14 8 18H40c-14 -2 -14 -16 -4 -18Z"
        {...line}
        fill={PAPER}
      />
      <path
        d="M300 44c6 -12 26 -12 30 0c12 -2 16 12 6 14H304c-10 -2 -12 -12 -4 -14Z"
        {...line}
        fill={PAPER}
      />
      {/* prédio clássico */}
      <path
        d="M44 136L116 92L188 136Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="116" cy="120" r="8" fill="var(--spot)" stroke={INK} strokeWidth="2.5" />
      <rect x="50" y="136" width="132" height="12" fill={INK} />
      {[62, 92, 122, 152].map((x) => (
        <rect
          key={x}
          x={x}
          y="148"
          width="16"
          height="92"
          fill={PAPER}
          stroke={INK}
          strokeWidth="3"
        />
      ))}
      <rect x="44" y="240" width="144" height="12" fill={PAPER} stroke={INK} strokeWidth="3" />
      {/* prédio moderno */}
      <rect x="248" y="88" width="104" height="164" fill={PAPER} stroke={INK} strokeWidth="3" />
      <rect x="248" y="76" width="104" height="12" fill={INK} />
      {windows}
      {/* ponte entre os dois cursos */}
      <path d="M188 200C210 176 228 176 248 200" {...line} strokeWidth={4} />
      <path d="M198 192v14M218 182v24M238 192v14" {...line} strokeWidth={2} />
      <path d="M0 252H400" {...line} strokeWidth={4} />
      <Grass y={262} seed={8} n={16} />
    </>
  );
}

function Network() {
  const layers = [
    [70, [70, 150, 230]],
    [200, [50, 117, 183, 250]],
    [330, [105, 195]],
  ] as const;
  const edges: string[] = [];
  for (let l = 0; l < layers.length - 1; l++)
    for (const y1 of layers[l][1])
      for (const y2 of layers[l + 1][1])
        edges.push(`M${layers[l][0]} ${y1}L${layers[l + 1][0]} ${y2}`);
  return (
    <>
      <path d={edges.join('')} {...line} strokeWidth={1.8} opacity={0.75} />
      <path d="M70 150L200 117L330 195" {...line} strokeWidth={5} />
      {layers.map(([x, ys], l) =>
        ys.map((y, i) => (
          <circle
            key={`${l}-${i}`}
            cx={x}
            cy={y}
            r={l === 1 ? 17 : 20}
            fill={(l + i) % 2 === 0 ? 'var(--spot-3)' : PAPER}
            stroke={INK}
            strokeWidth="3.5"
          />
        )),
      )}
      <path d="M330 150v-18M330 240v18M368 150l14 -10M368 240l14 10" {...line} strokeWidth={2.5} />
    </>
  );
}

function Bootcamp() {
  return (
    <>
      {/* notebook */}
      <rect
        x="92"
        y="64"
        width="216"
        height="142"
        rx="6"
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
      />
      <rect x="106" y="78" width="188" height="114" fill={PAPER} stroke={INK} strokeWidth="2" />
      <path d="M120 92v88h160" {...line} strokeWidth={2.5} />
      <path
        d="M124 100C150 150 170 160 200 166S250 172 276 174"
        stroke="var(--accent)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M124 118C156 140 190 150 276 156" {...line} strokeWidth={2} strokeDasharray="5 6" />
      {[148, 176, 204, 232, 260].map((x, i) => (
        <circle key={x} cx={x} cy={[146, 160, 166, 170, 173][i]} r="4" fill={INK} />
      ))}
      <path
        d="M62 236L92 206H308L338 236Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M110 216H290M102 226H298" {...line} strokeWidth={2} strokeDasharray="10 5" />
      {/* café */}
      <path
        d="M340 150h36v34c0 10 -8 16 -18 16s-18 -6 -18 -16Z"
        fill="var(--spot-2)"
        stroke={INK}
        strokeWidth="3"
      />
      <path d="M376 158c12 0 12 20 0 20" {...line} />
      <path d="M350 138c-4 -8 4 -10 0 -18M364 138c-4 -8 4 -10 0 -18" {...line} strokeWidth={2} />
    </>
  );
}

// sprite original: um bichinho de chifres, 12x12
export const SPRITE = [
  '..#......#..',
  '.##......##.',
  '.#o######o#.',
  '.#oooooooo#.',
  '#oo#oooo#oo#',
  '#oo#oooo#oo#',
  '#oooooooooo#',
  '#oo######oo#',
  '#oo#.##.#oo#',
  '.#oooooooo#.',
  '.##oo##oo##.',
  '..##....##..',
];

function Pixel() {
  const px = 15;
  const ox = 46;
  const oy = 66;
  const cells: ReactNode[] = [];
  SPRITE.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === '.') return;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={ox + x * px}
          y={oy + y * px}
          width={px}
          height={px}
          fill={c === '#' ? INK : 'var(--spot)'}
        />,
      );
    }),
  );
  const grid: string[] = [];
  for (let i = 0; i <= 12; i++) {
    grid.push(`M${ox + i * px} ${oy}v${12 * px}`, `M${ox} ${oy + i * px}h${12 * px}`);
  }
  return (
    <>
      <rect
        x={ox - 8}
        y={oy - 8}
        width={12 * px + 16}
        height={12 * px + 16}
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
      />
      {cells}
      <path d={grid.join('')} stroke={INK} strokeWidth="0.6" opacity="0.35" />
      {/* paleta */}
      {['var(--ink)', 'var(--spot)', 'var(--spot-2)', 'var(--spot-3)', 'var(--paper)'].map(
        (c, i) => (
          <rect
            key={i}
            x="262"
            y={70 + i * 34}
            width="28"
            height="28"
            fill={c}
            stroke={INK}
            strokeWidth="3"
          />
        ),
      )}
      {/* lápis */}
      <g transform="rotate(32 340 170)">
        <rect x="328" y="96" width="24" height="110" fill={PAPER} stroke={INK} strokeWidth="3" />
        <path
          d="M328 206l12 26l12 -26Z"
          fill={INK}
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="328" y="96" width="24" height="16" fill={INK} />
      </g>
    </>
  );
}

function Medals() {
  return (
    <>
      <path d="M0 236H400" {...line} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 56 + i * 72;
        const y = i % 2 === 0 ? 150 : 128;
        return (
          <g key={i}>
            <path d={`M${x - 16} ${y - 74}L${x - 4} ${y - 20}L${x} ${y - 74}Z`} fill={INK} />
            <path
              d={`M${x + 16} ${y - 74}L${x + 4} ${y - 20}L${x} ${y - 74}Z`}
              fill={PAPER}
              stroke={INK}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx={x} cy={y} r="28" fill="var(--spot-2)" stroke={INK} strokeWidth="4" />
            <circle cx={x} cy={y} r="20" fill="none" stroke={INK} strokeWidth="1.8" />
            <path
              d={`M${x} ${y - 13}l4 9l10 1l-7.5 6.5l2.5 9.5l-9 -5l-9 5l2.5 -9.5l-7.5 -6.5l10 -1Z`}
              fill={INK}
            />
            <path d={`M${x} ${y + 32}V236`} {...line} strokeWidth={2} strokeDasharray="3 6" />
          </g>
        );
      })}
      <path
        d="M30 60l6 12l12 6l-12 6l-6 12l-6 -12l-12 -6l12 -6ZM366 44l4 8l8 4l-8 4l-4 8l-4 -8l-8 -4l8 -4Z"
        fill={INK}
      />
    </>
  );
}

function Horizon() {
  const rays = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI + (i / 12) * Math.PI;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return `M${(250 + c * 70).toFixed(1)} ${(150 + s * 70).toFixed(1)}L${(250 + c * 230).toFixed(1)} ${(150 + s * 230).toFixed(1)}`;
  }).join('');
  return (
    <>
      <path d={rays} {...line} strokeWidth={2} opacity={0.6} />
      <circle cx="250" cy="150" r="56" fill="var(--spot-2)" stroke={INK} strokeWidth="3" />
      <path
        d="M90 300L250 84L400 270V300Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M250 84l-34 46l22 -8l10 22l14 -24l26 14Z" fill={INK} />
      <path d="M0 300L96 190L190 300Z" fill={INK} />
      {/* estrada */}
      <path
        d="M150 300C210 262 300 262 262 222S212 180 244 150S262 112 250 96"
        {...line}
        strokeWidth={3}
        strokeDasharray="9 7"
      />
      {/* bandeira */}
      <path d="M250 84V34" {...line} strokeWidth={4} />
      <path
        d="M250 36L292 48L250 62Z"
        fill="var(--spot)"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M40 60c8 -14 30 -14 36 0c12 -2 18 12 6 16H42c-12 -2 -12 -14 -2 -16Z"
        {...line}
        fill={PAPER}
      />
    </>
  );
}

const arts: Record<AboutArt, () => ReactNode> = {
  hero: Hero,
  campus: Campus,
  network: Network,
  laptop: Bootcamp,
  pixel: Pixel,
  medals: Medals,
  horizon: Horizon,
};

export function AboutIllustration({ art, alt }: { art: AboutArt; alt: string }) {
  const Art = arts[art];
  return (
    <Frame alt={alt}>
      <Art />
    </Frame>
  );
}
