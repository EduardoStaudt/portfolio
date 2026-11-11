import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { InkBorder } from './InkBorder';

type Props = {
  as?: ElementType;
  children?: ReactNode;
  seed?: number;
  /** espessura da borda em px */
  weight?: number;
  /** sombra chapada de nanquim */
  shadow?: boolean;
  /** recorta o conteúdo na borda (padrão). Desligue para deixar algo "vazar" do quadro. */
  clip?: boolean;
  /** painel preto (tinta) com conteúdo claro */
  inverted?: boolean;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/** Quadro de mangá: fundo de papel, borda grossa irregular, conteúdo recortado. */
export function Panel({
  as: Tag = 'div',
  children,
  seed = 1,
  weight = 4,
  shadow = false,
  clip = true,
  inverted = false,
  className,
  innerClassName,
  ...rest
}: Props) {
  return (
    <Tag
      className={cn(
        'relative isolate',
        inverted ? 'bg-ink text-paper' : 'bg-paper text-ink',
        shadow && 'shadow-panel',
        className,
      )}
      {...rest}
    >
      <div className={cn('relative h-full w-full', clip && 'overflow-hidden', innerClassName)}>
        {children}
      </div>
      <InkBorder seed={seed} weight={weight} />
    </Tag>
  );
}
