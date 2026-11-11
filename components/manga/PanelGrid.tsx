import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  /** colunas no desktop; no mobile vira coluna única (leitura webtoon) */
  columns?: number;
  className?: string;
};

/** Grade de página de mangá: quadros separados pela calha (gutter). */
export function PanelGrid({ children, columns = 2, className }: Props) {
  return (
    <div
      style={{ '--cols': columns } as CSSProperties}
      className={cn(
        'grid grid-cols-1 gap-(--space-gutter) md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]',
        className,
      )}
    >
      {children}
    </div>
  );
}
