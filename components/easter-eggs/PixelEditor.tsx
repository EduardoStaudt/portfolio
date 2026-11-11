'use client';

import { useState } from 'react';
import { secretPage } from '@/lib/data/eggs';
import {
  PIXEL_COLORS as COLORS,
  PIXEL_SIZE as SIZE,
  clearPixels,
  paintPixel,
  resetPixels,
  usePixels,
} from '@/lib/pixel-store';
import { cn } from '@/lib/cn';

/**
 * Mini editor de pixel art 12x12 da página secreta. O desenho fica em lib/pixel-store:
 * o que for pintado aqui aparece na tela do notebook do Cap. 1.
 */
export function PixelEditor() {
  const cells = usePixels();
  const [color, setColor] = useState(1);
  const { editor } = secretPage;

  const paint = (i: number) => paintPixel(i, color);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
      <div
        role="group"
        aria-label="Grade de pixels, 12 por 12"
        className="bg-paper grid aspect-square w-full max-w-[19rem] touch-none border-[3px] border-(--ink)"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Pixel coluna ${(i % SIZE) + 1}, linha ${Math.floor(i / SIZE) + 1}: ${COLORS[c].name}`}
            onPointerDown={(e) => {
              e.currentTarget.releasePointerCapture?.(e.pointerId);
              paint(i);
            }}
            onPointerEnter={(e) => e.buttons === 1 && paint(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && paint(i)}
            className="aspect-square border-[0.5px] border-(--ink)/20 focus-visible:z-10"
            style={{ background: COLORS[c].css }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl">{editor.title}</h3>
          <p className="mt-1 max-w-xs text-sm">{editor.lead}</p>
        </div>
        <div role="radiogroup" aria-label="Cor" className="flex gap-2">
          {COLORS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === i}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColor(i)}
              className={cn(
                'h-9 w-9 border-[3px] border-(--ink) transition-transform',
                color === i && '-translate-y-1 shadow-[0_4px_0_var(--ink)]',
                i === 0 && 'screentone-hatch',
              )}
              style={i === 0 ? undefined : { background: c.css }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearPixels}
            className="font-bubble border-[2.5px] border-(--ink) px-3 py-2 text-xs"
          >
            {editor.clear}
          </button>
          <button
            type="button"
            onClick={resetPixels}
            className="font-bubble border-[2.5px] border-(--ink) px-3 py-2 text-xs"
          >
            {editor.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
