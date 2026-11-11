import type { CSSProperties } from 'react';
import { seeded } from '@/lib/random';
import { Logo } from './Logo';

const COLUMNS = 9;

/**
 * Loader de tinta escorrendo. 100% CSS (aparece antes do JS carregar e some sozinho),
 * e só na primeira visita da sessão (o script do layout marca `data-skip-loader`).
 * A logo entra só com fade/scale: nada aqui depende do desenho dela.
 */
export function Loader() {
  const rand = seeded(42);
  return (
    <div
      aria-hidden
      className="loader bg-paper pointer-events-none fixed inset-0 z-(--z-loader) [animation:loader-out_0.45s_var(--ease-inOut)_1.35s_both] overflow-hidden print:hidden"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span
            key={i}
            className="bg-ink h-[112%] flex-1 origin-top [animation:ink-drip_var(--d)_cubic-bezier(0.5,0,0.3,1)_var(--delay)_both] rounded-b-[999px]"
            style={
              {
                '--d': `${(0.55 + rand() * 0.5).toFixed(2)}s`,
                '--delay': `${(rand() * 0.18).toFixed(2)}s`,
                marginInline: '-1px',
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="[animation:loader-logo_0.5s_ease-out_0.35s_both]">
          <Logo size={112} decorative priority />
        </div>
      </div>
    </div>
  );
}
