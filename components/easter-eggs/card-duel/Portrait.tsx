import type { Side } from '@/lib/card-duel/types';
import { cn } from '@/lib/cn';

export type Mood = 'normal' | 'hit' | 'win';

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const RED = 'var(--duel-red)';
const WINE = 'var(--duel-wine)';
const stroke = { stroke: INK, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** O Mangaká: chapéu de palha, avental sujo de tinta e uma pena de nanquim gigante. */
function Mangaka({ mood }: { mood: Mood }) {
  return (
    <>
      {/* pena gigante, atrás do ombro */}
      <g transform={mood === 'win' ? 'rotate(-8 96 120)' : undefined}>
        <path d="M92 138L100 44" {...stroke} strokeWidth="7" />
        <path d="M92 138L100 44" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M93 46L101 6L109 47L101 56Z" fill={INK} {...stroke} strokeWidth="2" />
        <path d="M101 12V40" stroke={PAPER} strokeWidth="1.6" />
        <circle cx="101" cy="42" r="2.200" fill={PAPER} />
        <path d="M94 58H108" {...stroke} strokeWidth="5" />
      </g>
      {/* corpo e avental */}
      <path
        d="M14 140C16 110 36 100 58 100S100 110 102 140Z"
        fill={PAPER}
        {...stroke}
        strokeWidth="3"
      />
      <path d="M40 106H76L82 140H34Z" fill="var(--paper-shade)" {...stroke} strokeWidth="2.5" />
      <path d="M46 106L50 96M70 106L66 96" {...stroke} strokeWidth="2.5" />
      <path d="M44 122c4 -4 9 2 6 6s-10 0 -6 -6ZM66 114c3 -2 6 1 4 4s-7 -1 -4 -4Z" fill={INK} />
      <circle cx="60" cy="130" r="2.500" fill={INK} />
      <circle cx="73" cy="127" r="1.600" fill={INK} />
      {/* pescoço e rosto */}
      <path d="M50 92H66V102H50Z" fill={PAPER} {...stroke} strokeWidth="2.5" />
      <path
        d="M34 64C34 86 46 96 58 96S82 86 82 64V56H34Z"
        fill={PAPER}
        {...stroke}
        strokeWidth="3"
      />
      {/* franja */}
      <path d="M34 62L40 50L46 64L52 50L58 66L64 50L70 64L76 50L82 62V52H34Z" fill={INK} />
      {/* chapéu */}
      <path
        d="M38 50C38 26 46 16 58 16S78 26 78 50Z"
        fill="var(--spot-2)"
        {...stroke}
        strokeWidth="3"
      />
      <path d="M38.500 42C50 46 66 46 77.500 42V50H38.500Z" fill={INK} />
      <ellipse
        cx="58"
        cy="51"
        rx="46"
        ry="8.500"
        fill="var(--spot-2)"
        {...stroke}
        strokeWidth="3"
      />
      <path
        d="M22 51l8 2M40 55l6 1M66 56l7 -1M86 53l7 -2M48 24l2 8M60 21v8M70 26l-2 7"
        {...stroke}
        strokeWidth="1.300"
      />
      {/* expressão */}
      {mood === 'normal' && (
        <>
          <ellipse cx="47" cy="72" rx="3" ry="4.500" fill={INK} />
          <ellipse cx="69" cy="72" rx="3" ry="4.500" fill={INK} />
          <path d="M51 85Q58 90 65 85" {...stroke} strokeWidth="2.500" fill="none" />
        </>
      )}
      {mood === 'hit' && (
        <>
          <path
            d="M42 68L51 72L42 76M74 68L65 72L74 76"
            {...stroke}
            strokeWidth="2.800"
            fill="none"
          />
          <path d="M50 86Q54 82 58 86T66 86" {...stroke} strokeWidth="2.500" fill="none" />
          <path d="M84 70l6 -3M85 78l7 1M30 72l-6 -3" {...stroke} strokeWidth="2" />
          <path
            d="M76 62c3 4 3 7 0 8c-3 -1 -3 -4 0 -8Z"
            fill={PAPER}
            {...stroke}
            strokeWidth="1.500"
          />
        </>
      )}
      {mood === 'win' && (
        <>
          <path
            d="M42 74Q47 66 52 74M64 74Q69 66 74 74"
            {...stroke}
            strokeWidth="2.800"
            fill="none"
          />
          <path d="M48 82H68Q66 93 58 93T48 82Z" fill={INK} {...stroke} strokeWidth="2" />
          <path d="M51 84H65" stroke={PAPER} strokeWidth="2.500" />
        </>
      )}
    </>
  );
}

/** O Ronin Rubro: manto vinho, máscara de papel com um único traço e uma lâmina vermelha. */
function Ronin({ mood }: { mood: Mood }) {
  return (
    <>
      {/* lâmina vermelha */}
      <g
        transform={
          mood === 'win' ? 'rotate(10 24 120)' : mood === 'hit' ? 'rotate(-14 24 120)' : undefined
        }
      >
        <path d="M20 138L10 30L15 10L22 30L28 137Z" fill={RED} {...stroke} strokeWidth="2.500" />
        <path d="M16 20L22 118" stroke={PAPER} strokeWidth="1.300" opacity="0.8" />
        <path d="M10 118H36" {...stroke} strokeWidth="6" />
      </g>
      {/* manto */}
      <path
        d="M18 140C18 104 40 96 62 96S108 104 106 140Z"
        fill={WINE}
        {...stroke}
        strokeWidth="3"
      />
      <path
        d="M62 98L50 140M62 98L78 140M34 112L28 140M92 112L98 140"
        stroke={INK}
        strokeWidth="1.600"
        opacity="0.7"
      />
      <path d="M40 100Q62 116 86 100L80 92H46Z" fill={INK} />
      {/* capuz e coque */}
      <path d="M32 70C32 40 44 28 62 28S92 40 92 70C92 84 84 96 62 96S32 84 32 70Z" fill={INK} />
      <path d="M56 28C52 14 58 8 62 8S72 14 68 28Z" fill={INK} />
      <path d="M52 20H72" stroke={RED} strokeWidth="3.500" strokeLinecap="round" />
      {/* máscara de papel */}
      <g transform={mood === 'hit' ? 'rotate(7 62 66)' : undefined}>
        <path
          d="M42 48H82V74C82 86 72 92 62 92S42 86 42 74Z"
          fill={PAPER}
          {...stroke}
          strokeWidth="2.800"
        />
        {mood === 'normal' && (
          <path
            d="M48 60Q62 70 77 58"
            stroke={INK}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === 'hit' && (
          <>
            <path
              d="M48 62L56 58L62 66L69 58L77 63"
              stroke={INK}
              strokeWidth="4.500"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M70 48L66 58L72 64L67 76" stroke={INK} strokeWidth="1.600" fill="none" />
          </>
        )}
        {mood === 'win' && (
          <path
            d="M47 58Q62 82 78 56"
            stroke={RED}
            strokeWidth="5.500"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
      {mood === 'hit' && <path d="M96 56l8 -4M98 66h9M24 58l-8 -4" {...stroke} strokeWidth="2" />}
    </>
  );
}

const names: Record<Side, string> = { player: 'O Mangaká', rival: 'Ronin Rubro' };
const moods: Record<Mood, string> = { normal: '', hit: ', levando dano', win: ', comemorando' };

type Props = { side: Side; mood?: Mood; className?: string };

/** Retrato do duelista em um quadro de mangá, com três expressões. */
export function Portrait({ side, mood = 'normal', className }: Props) {
  const Art = side === 'player' ? Mangaka : Ronin;
  return (
    <span
      className={cn(
        'bg-paper relative block shrink-0 overflow-hidden border-[3px] border-(--ink)',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0',
          mood === 'hit' ? 'screentone-hatch opacity-40' : 'screentone opacity-20',
        )}
      />
      <svg
        role="img"
        aria-label={`${names[side]}${moods[mood]}`}
        viewBox="0 0 120 140"
        className={cn(
          'relative block h-full w-full',
          mood === 'hit' && 'motion-safe:animate-[tremble_0.3s_linear_2]',
        )}
      >
        <Art mood={mood} />
      </svg>
    </span>
  );
}

export const duelistName = names;
