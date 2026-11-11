import { RULES } from '@/lib/card-duel/engine';

type Props = { hp: number; shield: number; label: string };

/** Barra de vida com dithering preto e vermelho, e o escudo ao lado quando existe. */
export function HpBar({ hp, shield, label }: Props) {
  const pct = (hp / RULES.maxHp) * 100;
  return (
    <div className="flex items-center gap-2">
      <div
        role="meter"
        aria-label={`Vida de ${label}`}
        aria-valuemin={0}
        aria-valuemax={RULES.maxHp}
        aria-valuenow={hp}
        className="bg-ink relative h-5 min-w-0 flex-1 border-[2.5px] border-(--ink)"
      >
        {/* fundo: vida perdida, em retícula */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 [background:repeating-conic-gradient(var(--duel-red)_0_25%,transparent_0_50%)_0_0/4px_4px]"
        />
        <div
          className="relative h-full bg-(--duel-red) transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        >
          {/* dithering: o preto invade o vermelho na ponta */}
          <div
            aria-hidden
            className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_35%,#000)] [background:repeating-conic-gradient(#0A0A0A_0_25%,transparent_0_50%)_0_0/4px_4px]"
          />
        </div>
        <span className="font-display absolute inset-0 grid place-items-center text-[0.68rem] leading-none text-white [text-shadow:0_0_3px_#000,0_1px_0_#000]">
          {hp}/{RULES.maxHp}
        </span>
      </div>
      <span
        className={`font-display bg-paper flex h-6 shrink-0 items-center gap-1 border-[2.5px] border-(--ink) px-1.5 text-[0.7rem] ${shield ? '' : 'opacity-30'}`}
      >
        <svg aria-hidden width="11" height="13" viewBox="0 0 11 13">
          <path
            d="M5.500 0.500L10.500 2.500V6.500C10.500 9.500 8.500 11.500 5.500 12.500C2.500 11.500 0.500 9.500 0.500 6.500V2.500Z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only">Escudo: </span>
        {shield}
      </span>
    </div>
  );
}
