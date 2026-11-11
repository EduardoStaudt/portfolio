import { round, seeded } from '@/lib/random';
import { cn } from '@/lib/cn';

type Props = {
  /** muda o "tremido" do traço; mesmo seed = mesmo desenho */
  seed?: number;
  /** espessura em px */
  weight?: number;
  /** irregularidade, em % do lado */
  jitter?: number;
  /** segundo traço fino por cima, como quem passou a pena duas vezes */
  double?: boolean;
  className?: string;
};

function stroke(rand: () => number, jitter: number) {
  const over = 0.4 + rand() * 0.9; // passa um pouco do canto, como régua + nanquim
  const steps = 4;
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    const horizontal = y1 === y2;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ext = i === 0 ? -over : i === steps ? over : 0;
      const j = (rand() - 0.5) * 2 * jitter;
      const x = x1 + (x2 - x1) * t + (horizontal ? Math.sign(x2 - x1) * ext : j);
      const y = y1 + (y2 - y1) * t + (horizontal ? j : Math.sign(y2 - y1) * ext);
      pts.push(`${round(x)} ${round(y)}`);
    }
    return `M${pts.join('L')}`;
  };
  return [
    line(0, 0, 100, 0),
    line(100, 0, 100, 100),
    line(100, 100, 0, 100),
    line(0, 100, 0, 0),
  ].join(' ');
}

/** Borda de painel desenhada à mão: SVG com jitter determinístico, escala com o container. */
export function InkBorder({
  seed = 1,
  weight = 4,
  jitter = 0.45,
  double = true,
  className,
}: Props) {
  const rand = seeded(seed);
  const main = stroke(rand, jitter);
  const second = double ? stroke(rand, jitter * 1.6) : null;
  return (
    <svg
      aria-hidden
      className={cn(
        'ink-border text-ink pointer-events-none absolute inset-0 h-full w-full overflow-visible',
        className,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={main} strokeWidth={weight} vectorEffect="non-scaling-stroke" />
      {second && (
        <path
          d={second}
          strokeWidth={Math.max(1, weight * 0.3)}
          vectorEffect="non-scaling-stroke"
          opacity={0.7}
        />
      )}
    </svg>
  );
}
