'use client';

import Link from 'next/link';
import { useEggs } from '@/lib/eggs-store';
import { cn } from '@/lib/cn';

/** Contador de segredos encontrados. Leva à página secreta (lacrada até achar todos). */
export function EggCounter() {
  const { count, total, allFound } = useEggs();
  return (
    <Link
      href="/segredo"
      aria-label={`Segredos encontrados: ${count} de ${total}${allFound ? '. Abrir o capítulo secreto' : ''}`}
      title={allFound ? 'Abrir o capítulo secreto' : 'Segredos encontrados'}
      className={cn(
        'font-bubble flex h-10 items-center gap-1.5 border-[2.5px] border-(--ink) px-2.5 text-[0.72rem] transition-colors',
        allFound
          ? 'bg-accent text-on-accent hover:bg-ink hover:text-paper'
          : 'bg-paper text-ink hover:bg-ink hover:text-paper',
      )}
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
        <path d="M7 0l1.8 5.2L14 7l-5.2 1.8L7 14l-1.8-5.2L0 7l5.2-1.8z" fill="currentColor" />
      </svg>
      <span suppressHydrationWarning>
        {count}/{total}
      </span>
    </Link>
  );
}
