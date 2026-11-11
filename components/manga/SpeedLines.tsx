import { round, seeded } from '@/lib/random';
import { cn } from '@/lib/cn';

type Props = {
  variant?: 'radial' | 'horizontal';
  count?: number;
  seed?: number;
  /** raio livre no centro (0-50), só no radial */
  inner?: number;
  /** centro do foco em % */
  cx?: number;
  cy?: number;
  animated?: boolean;
  className?: string;
};

/** Linhas de velocidade / foco. SVG gerado com seed, estica com o container. */
export function SpeedLines({
  variant = 'radial',
  count = 70,
  seed = 7,
  inner = 26,
  cx = 50,
  cy = 50,
  animated = false,
  className,
}: Props) {
  const rand = seeded(seed);
  const shapes: string[] = [];

  if (variant === 'radial') {
    for (let i = 0; i < count; i++) {
      const a = ((i + rand() * 0.8) / count) * Math.PI * 2;
      const w = 0.004 + rand() * 0.014; // meia-abertura em rad
      const r0 = inner + rand() * 16;
      const R = 120;
      const p = (ang: number, r: number) =>
        `${round(cx + Math.cos(ang) * r)} ${round(cy + Math.sin(ang) * r)}`;
      shapes.push(`M${p(a, r0)}L${p(a - w, R)}L${p(a + w, R)}Z`);
    }
  } else {
    for (let i = 0; i < count; i++) {
      const y = rand() * 100;
      const h = 0.15 + rand() * 0.7;
      const x0 = rand() * 55;
      const len = 30 + rand() * 70;
      shapes.push(
        `M${round(x0)} ${round(y)}L${round(x0 + len)} ${round(y - h)}L${round(x0 + len)} ${round(y + h)}Z`,
      );
    }
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn(
        'speed-lines text-ink pointer-events-none absolute inset-0 h-full w-full',
        animated && 'speed-animated',
        className,
      )}
    >
      <path d={shapes.join('')} fill="currentColor" />
    </svg>
  );
}
