'use client';

import { setInkMode, setPageMode, useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/cn';

const btn =
  'bg-paper text-ink hover:bg-ink hover:text-paper grid h-10 min-w-10 place-items-center border-[2.5px] border-(--ink) px-2 transition-colors';

/** Dois controles: modo colorido (P&B ↔ cor) e página invertida (claro ↔ escuro). */
export function ThemeToggle() {
  const { ink, page } = useTheme();
  const color = ink === 'color';
  const dark = page === 'dark';

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        aria-pressed={color}
        aria-label="Modo colorido"
        title={color ? 'Voltar ao preto e branco' : 'Ligar o modo colorido'}
        onClick={() => setInkMode(color ? 'bw' : 'color')}
        className={cn(btn, 'gap-1.5')}
        suppressHydrationWarning
      >
        <span aria-hidden className="flex gap-0.5">
          {['var(--accent)', 'var(--orange)', 'var(--blue)'].map((c, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full border-[1.5px] border-current"
              style={{ background: color ? c : 'transparent' }}
            />
          ))}
        </span>
        <span className="font-bubble hidden text-[0.7rem] sm:inline" suppressHydrationWarning>
          {color ? 'Cor' : 'P&B'}
        </span>
      </button>
      <button
        type="button"
        aria-pressed={dark}
        aria-label="Página invertida (modo escuro)"
        title={dark ? 'Voltar ao papel claro' : 'Inverter a página'}
        onClick={() => setPageMode(dark ? 'light' : 'dark')}
        className={btn}
        suppressHydrationWarning
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M9 2a7 7 0 0 1 0 14z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
