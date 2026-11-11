'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { chapters } from '@/lib/data/chapters';
import { goToChapter, useActiveChapter } from '@/lib/chapter-store';
import { InkBorder } from '@/components/manga/InkBorder';
import { cn } from '@/lib/cn';

const arrow = { vertical: '↓', horizontal: '→' } as const;
const dirLabel = { vertical: 'leitura vertical', horizontal: 'leitura horizontal' } as const;

/** Link de capítulo: navega com a transição de corte em vez do salto seco da âncora. */
export function useChapterLink() {
  return (id: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    goToChapter(id);
  };
}

/** Índice de capítulos, estilo sumário de mangá: botão com o capítulo atual + trilho lateral. */
export function Nav() {
  const active = useActiveChapter();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const link = useChapterLink();
  const current = chapters.find((c) => c.id === active) ?? chapters[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <>
      <div ref={root} className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="bg-paper text-ink hover:bg-ink hover:text-paper flex h-10 items-center gap-2 border-[2.5px] border-(--ink) px-3 transition-colors"
        >
          <svg aria-hidden width="16" height="14" viewBox="0 0 16 14">
            <path d="M0 1.5h16M0 7h16M0 12.5h16" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <span className="font-bubble text-[0.72rem]">
            <span className="sr-only">Sumário. Capítulo atual: </span>
            {current.number}
            <span className="hidden sm:inline"> · {current.title}</span>
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.nav
              id={panelId}
              aria-label="Sumário"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="bg-paper shadow-panel absolute top-[calc(100%+0.6rem)] right-0 w-[min(20rem,calc(100vw-2rem))] origin-top-right p-4"
            >
              <p className="font-display mb-3 text-lg">Sumário</p>
              <ol className="flex flex-col">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/#${c.id}`}
                      aria-current={c.id === active ? 'location' : undefined}
                      onClick={(e) => {
                        link(c.id)(e);
                        setOpen(false);
                      }}
                      className={cn(
                        'group flex items-baseline gap-2 px-2 py-2 text-sm',
                        c.id === active ? 'bg-ink text-paper' : 'hover:bg-paper-shade',
                      )}
                    >
                      <span className="font-bubble w-[5.4rem] shrink-0 text-[0.7rem]">
                        {c.number}
                      </span>
                      <span className="font-semibold">{c.title}</span>
                      <span
                        aria-hidden
                        className="mb-1 flex-1 self-end border-b-2 border-dotted border-current opacity-50"
                      />
                      <span aria-hidden className="font-display text-xs">
                        {arrow[c.direction]}
                      </span>
                      <span className="sr-only">({dirLabel[c.direction]})</span>
                    </a>
                  </li>
                ))}
              </ol>
              <InkBorder seed={5} weight={3} />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* trilho lateral (telas grandes): marca o progresso no volume */}
      <nav
        aria-label="Progresso no volume"
        className="fixed top-1/2 right-3 z-(--z-nav) hidden -translate-y-1/2 xl:block"
      >
        <ol className="flex flex-col items-end gap-2.5">
          {chapters.map((c) => {
            const on = c.id === active;
            return (
              <li key={c.id}>
                <a
                  href={`/#${c.id}`}
                  onClick={link(c.id)}
                  aria-current={on ? 'location' : undefined}
                  className="group flex items-center gap-2"
                >
                  <span
                    className={cn(
                      'font-bubble bg-paper text-ink border-2 border-(--ink) px-2 py-0.5 text-[0.65rem] transition-opacity',
                      on
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                    )}
                  >
                    {c.number}
                    <span className="sr-only">: {c.title}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'block h-3 border-2 border-(--ink) transition-all',
                      on ? 'bg-ink w-7' : 'bg-paper w-3 group-hover:w-5',
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
