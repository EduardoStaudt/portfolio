import { cardDef } from '@/lib/card-duel/cards';
import type { CardInstance, Side } from '@/lib/card-duel/types';
import { cn } from '@/lib/cn';
import { CardFace } from './Card';

type Props = {
  index: number;
  card: CardInstance | null;
  side: Side;
  /** slot sendo resolvido agora */
  active: boolean;
  /** já resolvido neste turno */
  spent: boolean;
  /** há uma carta selecionada esperando um slot */
  armed: boolean;
  disabled: boolean;
  onPress: () => void;
};

/** Um dos 3 slots. Clicar coloca a carta selecionada; clicar em um slot ocupado devolve a carta. */
export function Slot({ index, card, side, active, spent, armed, disabled, onPress }: Props) {
  const def = card ? cardDef(card.id) : null;
  return (
    <button
      type="button"
      data-slot={index}
      data-nav
      disabled={disabled}
      onClick={onPress}
      aria-label={
        def
          ? `Slot ${index + 1}: ${def.name}${disabled ? '' : '. Enter devolve para a mão'}`
          : `Slot ${index + 1}, vazio${armed ? '. Enter coloca a carta selecionada' : ''}`
      }
      className={cn(
        'relative grid h-[7.6rem] w-[5.6rem] shrink-0 place-items-center transition-transform sm:h-[10.6rem] sm:w-[7.5rem]',
        !def && 'border-[3px] border-dashed border-(--ink)',
        !def && armed && 'bg-(--duel-red)/15 motion-safe:animate-pulse',
        active && 'z-10 scale-110 motion-reduce:scale-100',
        spent && 'opacity-40',
      )}
    >
      {def ? (
        <CardFace
          def={def}
          side={side}
          className={cn(active && 'shadow-[0_0_0_4px_var(--duel-red)]')}
        />
      ) : (
        <span aria-hidden className="font-display text-3xl opacity-25">
          {index + 1}
        </span>
      )}
    </button>
  );
}
