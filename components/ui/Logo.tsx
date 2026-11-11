import Image from 'next/image';
import { cn } from '@/lib/cn';

type Props = {
  /** lado: px ou qualquer valor CSS (ex.: 'clamp(6rem,18vw,11rem)') */
  size?: number | string;
  className?: string;
  priority?: boolean;
  /** quando a logo é só enfeite ao lado do nome */
  decorative?: boolean;
};

/**
 * Logo do site. Lê sempre /logo.svg: para trocar a logo, basta substituir public/logo.svg.
 * Fica sobre uma "plaqueta" de papel claro para funcionar em qualquer tema, sem depender do desenho.
 */
export function Logo({ size = 40, className, priority = false, decorative = false }: Props) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 border-[2.5px] border-(--ink) bg-(--logo-plate) leading-none',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.svg"
        alt={decorative ? '' : 'Logo de Eduardo Staudt'}
        width={320}
        height={320}
        unoptimized
        priority={priority}
        className="pixelated h-full w-full"
      />
    </span>
  );
}
