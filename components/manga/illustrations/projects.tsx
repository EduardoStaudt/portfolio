import type { ReactNode } from 'react';
import type { ProjectArt } from '@/lib/data/projects';

/** Ilustrações das páginas duplas de projeto. Mesmo esquema das do Cap. 1 (traço de nanquim + `--spot`). */

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

function Glass() {
  return (
    <>
      <rect x="70" y="40" width="260" height="220" fill={PAPER} stroke={INK} strokeWidth="6" />
      <path d="M200 40V260M70 150H330" stroke={INK} strokeWidth="5" />
      <path d="M70 150H200V260H70ZM200 40H330V150H200Z" fill="var(--spot-3)" opacity="0.85" />
      {/* reflexos */}
      <path
        d="M92 120L150 58M110 130L176 60M222 236L300 160M246 244L312 178"
        {...line}
        strokeWidth={4}
      />
      <path d="M224 122L262 82M90 232L120 200" {...line} strokeWidth={2.5} />
      {/* lasca brilhando */}
      <path
        d="M318 44l8 20l20 8l-20 8l-8 20l-8 -20l-20 -8l20 -8Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M50 272H350" {...line} strokeWidth={5} />
      <path d="M40 286H360" {...line} strokeWidth={2} strokeDasharray="14 8" />
    </>
  );
}

function Adsorption() {
  const pts = [
    [84, 214],
    [112, 168],
    [146, 132],
    [188, 108],
    [236, 94],
    [288, 88],
    [336, 86],
  ];
  return (
    <>
      {/* rede ao fundo */}
      <g opacity="0.45">
        <path
          d="M250 180L310 150L250 220L310 220L250 260L310 150M250 180L310 220M250 260L310 220M310 150L360 190L310 220"
          {...line}
          strokeWidth={1.6}
        />
        {[
          [250, 180],
          [250, 220],
          [250, 260],
          [310, 150],
          [310, 220],
          [360, 190],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="9"
            fill={PAPER}
            stroke={INK}
            strokeWidth="2.5"
          />
        ))}
      </g>
      {/* eixos */}
      <path d="M60 40V250H370" {...line} strokeWidth={5} />
      <path d="M60 40l-8 14M60 40l8 14M370 250l-14 -8M370 250l-14 8" {...line} strokeWidth={4} />
      {/* isoterma: sobe e satura */}
      <path
        d="M64 246C90 150 150 100 230 92S330 86 360 86"
        stroke="var(--accent)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y + (i % 2 ? 7 : -6)}
          r="7"
          fill={PAPER}
          stroke={INK}
          strokeWidth="3.5"
        />
      ))}
      <path d="M64 86H360" {...line} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
    </>
  );
}

// labirinto 9x7: paredes em '#'
const MAZE = [
  '#########',
  '#h..#...#',
  '#.#.#.#.#',
  '#.#...#.#',
  '#.###.#.#',
  '#.....#b#',
  '#########',
];

function Maze() {
  const s = 34;
  const ox = 47;
  const oy = 30;
  const cells: ReactNode[] = [];
  MAZE.forEach((row, y) =>
    [...row].forEach((c, x) => {
      const px = ox + x * s;
      const py = oy + y * s;
      if (c === '#')
        cells.push(<rect key={`${x}-${y}`} x={px} y={py} width={s} height={s} fill={INK} />);
      if (c === 'h')
        cells.push(
          <g key="h">
            <rect
              x={px + 9}
              y={py + 5}
              width="16"
              height="12"
              fill="var(--spot-3)"
              stroke={INK}
              strokeWidth="2.5"
            />
            <rect x={px + 7} y={py + 17} width="20" height="12" fill={INK} />
            <rect x={px + 25} y={py + 8} width="5" height="18" fill={INK} />
          </g>,
        );
      if (c === 'b')
        cells.push(
          <g key="b">
            <path d={`M${px + 4} ${py + 10}l5 -9l4 9M${px + 21} ${py + 10}l4 -9l5 9`} fill={INK} />
            <rect
              x={px + 4}
              y={py + 9}
              width="26"
              height="20"
              fill="var(--spot)"
              stroke={INK}
              strokeWidth="2.5"
            />
            <rect x={px + 9} y={py + 14} width="5" height="5" fill={INK} />
            <rect x={px + 20} y={py + 14} width="5" height="5" fill={INK} />
            <path d={`M${px + 9} ${py + 24}h16`} stroke={INK} strokeWidth="2.5" />
          </g>,
        );
    }),
  );
  return (
    <>
      {cells}
      {/* caminho do herói */}
      <path
        d={`M${ox + s * 1.5} ${oy + s * 2}V${oy + s * 5.5}H${ox + s * 5.5}V${oy + s * 3.5}H${ox + s * 3.5}V${oy + s * 1.5}`}
        {...line}
        strokeWidth={2.5}
        strokeDasharray="5 7"
        opacity={0.7}
      />
    </>
  );
}

function Soon() {
  return (
    <>
      {/* folha em branco presa com fita, só com o esboço dos quadros */}
      <g transform="rotate(-4 200 150)">
        <rect x="96" y="22" width="208" height="256" fill={PAPER} stroke={INK} strokeWidth="5" />
        <path
          d="M112 40H288V118H112ZM112 132H192V260H112ZM206 132H288V190H206ZM206 204H288V260H206Z"
          {...line}
          strokeWidth={2}
          strokeDasharray="7 7"
          opacity={0.55}
        />
        <path
          d="M176 100c0 -34 48 -34 48 -4c0 22 -24 20 -24 44"
          stroke={INK}
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="172" r="8" fill={INK} />
        <rect
          x="76"
          y="14"
          width="60"
          height="22"
          fill="var(--spot-2)"
          stroke={INK}
          strokeWidth="3"
          transform="rotate(-32 106 25)"
        />
        <rect
          x="264"
          y="14"
          width="60"
          height="22"
          fill="var(--spot-2)"
          stroke={INK}
          strokeWidth="3"
          transform="rotate(32 294 25)"
        />
      </g>
      {/* placa */}
      <g transform="rotate(5 200 232)">
        <rect x="74" y="204" width="252" height="58" fill={INK} />
        <rect x="80" y="210" width="240" height="46" fill="none" stroke={PAPER} strokeWidth="2" />
        <text
          x="200"
          y="246"
          textAnchor="middle"
          fontSize="34"
          fill={PAPER}
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          EM BREVE
        </text>
      </g>
      <path
        d="M40 60l8 14l14 8l-14 8l-8 14l-8 -14l-14 -8l14 -8ZM352 196l6 10l10 6l-10 6l-6 10l-6 -10l-10 -6l10 -6Z"
        fill={INK}
      />
    </>
  );
}

function Generic() {
  return (
    <>
      <rect x="90" y="50" width="220" height="200" fill={PAPER} stroke={INK} strokeWidth="5" />
      <path d="M90 50L310 250M310 50L90 250" {...line} strokeWidth={2} />
      <circle cx="200" cy="150" r="46" fill="var(--spot-2)" stroke={INK} strokeWidth="4" />
      <path d="M200 124v34M200 170v6" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    </>
  );
}

const arts: Record<ProjectArt, () => ReactNode> = {
  glass: Glass,
  adsorption: Adsorption,
  maze: Maze,
  soon: Soon,
  generic: Generic,
};

export function ProjectIllustration({
  art,
  alt,
  className,
}: {
  art: ProjectArt;
  alt: string;
  className?: string;
}) {
  const Art = arts[art];
  return (
    <svg role="img" aria-label={alt} viewBox="0 0 400 300" className={className}>
      <Art />
    </svg>
  );
}
