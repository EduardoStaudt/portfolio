import type { ReactNode } from 'react';
import type { SkillSword, SwordDesign } from '@/lib/data/skills';
import { seeded } from '@/lib/random';
import { cn } from '@/lib/cn';

/**
 * Versão 2D (SVG) das três espadas: é o que o servidor renderiza e o fallback para
 * mobile fraco, sem WebGL ou com prefers-reduced-motion. Mesmos designs da cena 3D.
 */

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const GROUND = 372;
const SCALE = 0.72;

const accentVar = { red: 'var(--spot)', orange: 'var(--spot-2)', blue: 'var(--spot-3)' } as const;

type Design = { length: number; buried: number; top: number; draw: (accent: string) => ReactNode };

const s = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' } as const;

const designs: Record<SwordDesign, Design> = {
  pixel: {
    length: 193,
    buried: 54,
    top: 92,
    draw: (accent) => (
      <>
        <path d="M-9 0H9V157H4V175H-2V193H-9Z" fill={PAPER} {...s} />
        <path d="M-3 8V150" stroke={INK} strokeWidth="1.5" />
        <rect x="-23" y="-13" width="46" height="13" fill={accent} {...s} />
        <rect x="-35" y="-26" width="13" height="13" fill={INK} {...s} />
        <rect x="22" y="-26" width="13" height="13" fill={INK} {...s} />
        <rect x="-5" y="-67" width="10" height="54" fill={INK} {...s} />
        <path d="M0 -92L12 -79L0 -66L-12 -79Z" fill={accent} {...s} />
      </>
    ),
  },
  neural: {
    length: 270,
    buried: 76,
    top: 126,
    draw: (accent) => (
      <>
        <path d="M-27 0H27L32 108L27 216L0 270L-27 216L-32 108Z" fill={PAPER} {...s} />
        <rect x="-4" y="14" width="8" height="172" fill={INK} />
        <path
          d="M-18 30L-22 108L-18 200M18 30L22 108L18 200"
          stroke={INK}
          strokeWidth="1.5"
          fill="none"
        />
        <rect x="-54" y="-15" width="108" height="15" fill={PAPER} {...s} />
        <path d="M-58 -7H58" stroke={INK} strokeWidth="2" />
        <circle cx="-58" cy="-7" r="13" fill={accent} {...s} />
        <circle cx="58" cy="-7" r="13" fill={accent} {...s} />
        <circle cx="0" cy="-9" r="19" fill={accent} {...s} />
        <rect x="-7" y="-98" width="14" height="72" fill={INK} {...s} />
        <path d="M-7 -84L7 -76M-7 -68L7 -60M-7 -52L7 -44" stroke={PAPER} strokeWidth="2" />
        <circle cx="0" cy="-112" r="14" fill="none" stroke={INK} strokeWidth="7" />
      </>
    ),
  },
  root: {
    length: 175,
    buried: 45,
    top: 90,
    draw: (accent) => (
      <>
        <path d="M-15 0H15V144L-15 175Z" fill={PAPER} {...s} />
        <path d="M0 10V150" stroke={INK} strokeWidth="1.5" />
        <rect x="-34" y="-13" width="68" height="13" fill={PAPER} {...s} />
        <rect x="-34" y="0" width="11" height="27" fill={accent} {...s} />
        <rect x="23" y="0" width="11" height="27" fill={accent} {...s} />
        <rect x="-6" y="-63" width="12" height="50" fill={INK} {...s} />
        <path d="M0 -90L12 -83V-70L0 -63L-12 -70V-83Z" fill={accent} {...s} />
      </>
    ),
  },
};

const SLOTS_WIDE = [
  { x: 190, tilt: -7 },
  { x: 450, tilt: 2 },
  { x: 710, tilt: 8 },
];
// telas em pé: as espadas ficam mais juntas para caber no recorte
const SLOTS_COMPACT = [
  { x: 338, tilt: -6 },
  { x: 450, tilt: 2 },
  { x: 562, tilt: 7 },
];

type Props = {
  swords: SkillSword[];
  hovered: string | null;
  selected: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  /** composição estreita para telas em pé */
  compact?: boolean;
  className?: string;
};

export function Swords2D({
  swords,
  hovered,
  selected,
  onHover,
  onSelect,
  compact = false,
  className,
}: Props) {
  const SLOTS = compact ? SLOTS_COMPACT : SLOTS_WIDE;
  const rand = seeded(5);
  const grass = Array.from({ length: 46 }, () => {
    const x = rand() * 900;
    const y = GROUND + 8 + rand() * 120;
    const h = 8 + rand() * 12;
    return `M${x.toFixed(0)} ${y.toFixed(0)}l-4 -${h.toFixed(0)}M${x.toFixed(0)} ${y.toFixed(0)}l2 -${(h * 1.3).toFixed(0)}M${x.toFixed(0)} ${y.toFixed(0)}l7 -${(h * 0.8).toFixed(0)}`;
  }).join('');

  return (
    <svg
      role="img"
      aria-label="Três espadas fincadas em um campo: um sabre fino à esquerda, um montante largo no centro e um gládio curto à direita."
      viewBox="0 0 900 500"
      preserveAspectRatio="xMidYMax slice"
      className={cn('absolute inset-0 h-full w-full select-none', className)}
    >
      {/* céu chapado, sol e morros */}
      <circle
        cx={compact ? 520 : 640}
        cy="212"
        r={compact ? 60 : 84}
        fill="var(--spot)"
        stroke={INK}
        strokeWidth="4"
      />
      <path
        d="M-10 372L120 250L250 372Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M120 250L150 372H250Z" fill={INK} opacity="0.85" />
      <path
        d="M560 372L760 236L920 372Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M760 236L800 372H920Z" fill={INK} opacity="0.85" />

      {swords.map((sword, i) => {
        const d = designs[sword.design];
        const slot = SLOTS[i % SLOTS.length];
        const isSel = selected === sword.id;
        const isHover = hovered === sword.id && !isSel;
        const y = GROUND - (d.length - d.buried + (isSel ? d.buried + 46 : 0)) * SCALE;
        return (
          <g
            key={sword.id}
            style={{
              transform: `translate(${slot.x}px, ${y}px) rotate(${isSel ? 0 : slot.tilt}deg) scale(${SCALE})`,
              transition: 'transform 0.55s cubic-bezier(0.2, 1.4, 0.4, 1)',
            }}
          >
            <g
              className={isHover ? 'tremble' : undefined}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 80%' }}
            >
              {d.draw(accentVar[sword.accent])}
              {isHover && (
                <path
                  d="M0 -30L7 -7L30 0L7 7L0 30L-7 7L-30 0L-7 -7Z"
                  fill={PAPER}
                  stroke={INK}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    translate: '14px 60px',
                    animation: 'glint 0.7s ease-out both',
                  }}
                />
              )}
            </g>
          </g>
        );
      })}

      {/* chão por cima: esconde a parte enterrada das lâminas */}
      <path d={`M-10 ${GROUND}H910V510H-10Z`} fill="var(--paper-shade)" />
      <path d={`M-10 ${GROUND}H910`} stroke={INK} strokeWidth="5" />
      {SLOTS.map((slot, i) => (
        <ellipse key={i} cx={slot.x} cy={GROUND + 3} rx={i === 1 ? 34 : 22} ry="6" fill={INK} />
      ))}
      <path d={grass} stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* áreas de clique */}
      {swords.map((sword, i) => {
        const d = designs[sword.design];
        const slot = SLOTS[i % SLOTS.length];
        return (
          <rect
            key={sword.id}
            x={slot.x - (compact ? 52 : 70)}
            y={GROUND - (d.length - d.buried + d.top) * SCALE - 50}
            width={compact ? 104 : 140}
            height={(d.length - d.buried + d.top) * SCALE + 80}
            fill="transparent"
            className="cursor-pointer"
            onPointerEnter={() => onHover(sword.id)}
            onPointerLeave={() => onHover(null)}
            onClick={() => onSelect(sword.id)}
          />
        );
      })}
    </svg>
  );
}
