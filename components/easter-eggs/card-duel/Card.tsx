import type { ReactNode } from 'react';
import type { CardArt, CardDef, Side } from '@/lib/card-duel/types';
import { cn } from '@/lib/cn';

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const RED = 'var(--duel-red)';

/** Desenho de cada tipo de carta. `c` é a cor do golpe: nanquim para o Mangaká, vermelho para o Ronin. */
const arts: Record<CardArt, (c: string) => ReactNode> = {
  strike: (c) => (
    <>
      <path d="M6 35Q26 26 55 4Q36 24 6 35Z" fill={c} stroke={INK} strokeWidth="1.2" />
      <path d="M8 22L20 16M34 34L48 26" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  drain: (c) => (
    <>
      <path d="M5 30Q22 24 44 6Q30 24 5 30Z" fill={c} stroke={INK} strokeWidth="1.2" />
      <path d="M46 14L39 25H45L40 36L53 22H46L50 14Z" fill={PAPER} stroke={INK} strokeWidth="1.6" />
      <circle cx="14" cy="12" r="3" fill={c} />
      <circle cx="24" cy="7" r="2" fill={c} />
      <circle cx="22" cy="36" r="2.200" fill={c} />
    </>
  ),
  double: (c) => (
    <>
      <path d="M4 28Q22 22 44 3Q28 22 4 28Z" fill={c} stroke={INK} strokeWidth="1.2" />
      <path d="M16 38Q34 32 56 13Q40 32 16 38Z" fill={c} stroke={INK} strokeWidth="1.2" />
    </>
  ),
  finisher: (c) => (
    <>
      <path
        d="M30 1L35 13L48 5L43 17L58 20L45 25L53 37L39 31L30 39L23 30L8 36L16 24L2 19L17 16L12 4L25 12Z"
        fill={c}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M27 12L26 24M34 12L33 24" stroke={PAPER} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="26" cy="30" r="2" fill={PAPER} />
      <circle cx="33" cy="30" r="2" fill={PAPER} />
    </>
  ),
  guard: () => (
    <>
      <path
        d="M30 4L46 9V20C46 29 39 34 30 37C21 34 14 29 14 20V9Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M30 9V32" stroke={INK} strokeWidth="1.6" />
    </>
  ),
  wall: () => (
    <>
      <path
        d="M30 2L52 8V20C52 31 42 36 30 39C18 36 8 31 8 20V8Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M30 7L47 11.500V20C47 28 39 32 30 34.500Z" fill={PAPER} />
      <path d="M14 14H27M14 20H27M16 26H27" stroke={PAPER} strokeWidth="1.6" />
    </>
  ),
  heal: (c) => (
    <>
      <circle cx="30" cy="21" r="16" fill={PAPER} stroke={INK} strokeWidth="2.4" />
      <path d="M30 11V31M20 21H40" stroke={c} strokeWidth="6.500" strokeLinecap="round" />
      <path
        d="M6 9l2 4l4 2l-4 2l-2 4l-2 -4l-4 -2l4 -2ZM54 26l1.500 3l3 1.500l-3 1.500l-1.500 3l-1.500 -3l-3 -1.500l3 -1.500Z"
        fill={INK}
      />
    </>
  ),
  surge: (c) => (
    <>
      <path
        d="M17 3H43L32 20L43 37H17L28 20Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M21 6H39L30 18Z" fill={c} />
      <path d="M30 24L37 34H23Z" fill={c} />
      <path
        d="M48 8l5 -4M50 20h7M48 32l5 4M12 8l-5 -4M10 20H3M12 32l-5 4"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  focus: (c) => (
    <>
      <circle cx="30" cy="20" r="16" fill={PAPER} stroke={INK} strokeWidth="2.400" />
      <circle cx="30" cy="20" r="9" fill="none" stroke={INK} strokeWidth="1.800" />
      <circle cx="30" cy="20" r="3.500" fill={c} />
      <path
        d="M30 0V9M30 31V40M8 20H19M41 20H52"
        stroke={INK}
        strokeWidth="2.400"
        strokeLinecap="round"
      />
    </>
  ),
  draw: (c) => (
    <>
      <rect
        x="12"
        y="8"
        width="20"
        height="27"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
        transform="rotate(-12 22 21)"
      />
      <rect
        x="28"
        y="6"
        width="20"
        height="27"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
        transform="rotate(10 38 20)"
      />
      <path
        d="M33 13l9 1.600M32 19l9 1.600M31 25l6 1"
        stroke={c}
        strokeWidth="1.800"
        strokeLinecap="round"
      />
    </>
  ),
};

type Props = {
  def: CardDef;
  side: Side;
  className?: string;
  /** versão pequena (intenção do rival) */
  compact?: boolean;
  /**
   * no celular a carta ocupa a largura que tiver e mostra só desenho, custo e nome
   * (a mão inteira cabe na tela; o efeito aparece na faixa abaixo da mão)
   */
  fluid?: boolean;
};

/** Carta como mini página de mangá: borda grossa, retícula, custo num carimbo vermelho. */
export function CardFace({ def, side, className, compact = false, fluid = false }: Props) {
  return (
    <span
      className={cn(
        'bg-paper text-ink relative flex flex-col overflow-hidden border-[3px] border-(--ink) text-left select-none',
        compact
          ? 'h-[4.6rem] w-[3.3rem]'
          : fluid
            ? 'max-sm:aspect-[5/7] max-sm:w-full sm:h-[10.6rem] sm:w-[7.5rem]'
            : 'h-[7.6rem] w-[5.6rem] sm:h-[10.6rem] sm:w-[7.5rem]',
        className,
      )}
    >
      <span aria-hidden className="screentone absolute inset-0 opacity-[0.13]" />
      <span
        className={cn(
          'relative grid place-items-center border-b-[3px] border-(--ink)',
          compact ? 'h-full border-b-0' : fluid ? 'h-[42%] max-sm:h-[54%]' : 'h-[42%]',
          def.kind === 'attack' ? 'bg-paper' : 'bg-paper-shade',
        )}
      >
        <svg aria-hidden viewBox="0 0 60 40" className="h-[86%] w-[86%]">
          {arts[def.art](side === 'rival' ? RED : INK)}
        </svg>
      </span>
      <span
        className={cn(
          'font-display absolute -top-px -left-px grid -rotate-6 place-items-center rounded-full border-[2.5px] border-(--ink) bg-(--duel-red) text-white',
          compact
            ? 'h-5 w-5 text-[0.6rem]'
            : 'h-7 w-7 text-sm max-sm:h-6 max-sm:w-6 max-sm:text-xs',
        )}
      >
        <span className="sr-only">Custo </span>
        {def.cost}
      </span>
      {!compact && (
        <span className="relative flex flex-1 flex-col gap-0.5 px-1.5 py-1 max-sm:px-1">
          <span
            className={cn(
              'font-display leading-[1.05] uppercase sm:text-[0.66rem]',
              fluid ? 'text-[0.46rem] [overflow-wrap:anywhere]' : 'text-[0.56rem]',
            )}
          >
            {def.name}
          </span>
          <span
            className={cn(
              'text-[0.54rem] leading-[1.15] sm:text-[0.64rem]',
              fluid && 'max-sm:hidden',
            )}
          >
            {def.text}
          </span>
        </span>
      )}
    </span>
  );
}

/** Verso da carta (mão do rival, baralho). */
export function CardBack({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-ink relative block h-[4.6rem] w-[3.3rem] border-[3px] border-(--ink) outline-2 -outline-offset-[6px] outline-(--paper)',
        className,
      )}
    >
      <span className="screentone-cross absolute inset-0 !text-(--paper) opacity-25" />
    </span>
  );
}
