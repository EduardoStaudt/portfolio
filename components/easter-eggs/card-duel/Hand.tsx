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
  /** arrastar só com mouse: no toque a mão é um carrossel que rola de lado */
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
      className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-3 pt-5 pb-2 sm:justify-center sm:gap-3 sm:overflow-visible"
    >
      {cards.length === 0 && (
        <li className="font-bubble grid h-[9.2rem] place-items-center text-xs opacity-60 sm:h-[10.6rem]">
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
            className="shrink-0 snap-center"
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
                'relative block touch-pan-x disabled:opacity-60',
                draggable && !disabled && 'cursor-grab active:cursor-grabbing',
              )}
            >
              <CardFace
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
