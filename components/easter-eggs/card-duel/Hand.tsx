'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cardDef } from '@/lib/card-duel/cards';
import type { CardInstance } from '@/lib/card-duel/types';
import { cn } from '@/lib/cn';
import { CardFace } from './Card';

type Props = {
  cards: CardInstance[];
  selected: number | null;
  disabled: boolean;
  /** arrastar só com mouse; no celular as cartas encolhem para a mão inteira caber na tela */
  draggable: boolean;
  onSelect: (uid: number) => void;
  onDrop: (uid: number, slot: number) => void;
};

/**
 * A mão do jogador. Três jeitos de jogar uma carta:
 * arrastar até um slot; clicar na carta e depois no slot; ou Enter duas vezes
 * (seleciona e manda para o primeiro slot livre).
 */
export function Hand({ cards, selected, disabled, draggable, onSelect, onDrop }: Props) {
  const dragging = useRef(false);

  return (
    <ul
      aria-label="Sua mão"
      className="flex justify-center gap-1 px-3 pt-4 pb-1.5 sm:gap-3 sm:pt-5 sm:pb-2"
    >
      {cards.length === 0 && (
        <li className="font-bubble grid h-24 place-items-center text-xs opacity-60 sm:h-[10.6rem]">
          Mão vazia
        </li>
      )}
      {cards.map((card) => {
        const def = cardDef(card.id);
        const on = selected === card.uid;
        return (
          <motion.li
            key={card.uid}
            layout="position"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: on ? -16 : 0, opacity: 1 }}
            className="max-sm:max-w-[4.6rem] max-sm:min-w-0 max-sm:flex-1 sm:shrink-0"
          >
            <motion.button
              type="button"
              data-nav
              disabled={disabled}
              aria-pressed={on}
              aria-label={`${def.name}, custo ${def.cost}. ${def.text}${on ? '. Selecionada: Enter joga no primeiro slot livre' : ''}`}
              drag={draggable && !disabled}
              dragSnapToOrigin
              dragElastic={1}
              whileDrag={{ scale: 1.08, rotate: 4, zIndex: 30 }}
              whileHover={disabled ? undefined : { y: -6 }}
              onDragStart={() => {
                dragging.current = true;
              }}
              onDragEnd={(_, info) => {
                window.setTimeout(() => (dragging.current = false), 0);
                const hit = document
                  .elementsFromPoint(info.point.x - window.scrollX, info.point.y - window.scrollY)
                  .find((el) => el instanceof HTMLElement && el.dataset.slot !== undefined);
                if (hit instanceof HTMLElement) onDrop(card.uid, Number(hit.dataset.slot));
              }}
              onClick={() => {
                if (!dragging.current) onSelect(card.uid);
              }}
              className={cn(
                'relative block w-full disabled:opacity-60',
                draggable && !disabled && 'cursor-grab active:cursor-grabbing',
              )}
            >
              <CardFace
                fluid
                def={def}
                side="player"
                className={cn(on && 'shadow-[0_0_0_4px_var(--duel-red)]')}
              />
            </motion.button>
          </motion.li>
        );
      })}
    </ul>
  );
}
