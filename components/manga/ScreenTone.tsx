import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  variant?: 'dots' | 'hatch' | 'cross';
  /** tamanho da célula em px */
  size?: number;
  /** raio do ponto em % da célula (só `dots`) */
  dot?: number;
  /** esvanece a retícula em uma direção, como degradê de screentone */
  fade?: 'none' | 'up' | 'down' | 'left' | 'right' | 'radial';
  animated?: boolean;
  opacity?: number;
  className?: string;
};

const masks: Record<NonNullable<Props['fade']>, string | undefined> = {
  none: undefined,
  up: 'linear-gradient(to top, #000, transparent)',
  down: 'linear-gradient(to bottom, #000, transparent)',
  left: 'linear-gradient(to left, #000, transparent)',
  right: 'linear-gradient(to right, #000, transparent)',
  radial: 'radial-gradient(ellipse at center, transparent 30%, #000 100%)',
};

/** Retícula de mangá (pontos, hachura ou hachura cruzada) como camada de fundo. */
export function ScreenTone({
  variant = 'dots',
  size = 8,
  dot = 26,
  fade = 'none',
  animated = false,
  opacity = 1,
  className,
}: Props) {
  const style = {
    '--tone-size': `${size}px`,
    '--tone-dot': `${dot}%`,
    opacity,
    maskImage: masks[fade],
    WebkitMaskImage: masks[fade],
  } as CSSProperties;
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        'pointer-events-none absolute inset-0',
        variant === 'dots' && 'screentone',
        variant === 'hatch' && 'screentone-hatch',
        variant === 'cross' && 'screentone-cross',
        animated && variant === 'dots' && 'tone-animated',
        className,
      )}
    />
  );
}
