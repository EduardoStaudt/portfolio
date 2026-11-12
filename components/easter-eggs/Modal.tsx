'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

/** Casca de modal dos easter eggs: fundo escuro, foco preso, Esc fecha e o foco volta para onde estava. */
export function Modal({ label, onClose, children, className }: Props) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement;
    const node = dialog.current;
    (node?.querySelector<HTMLElement>('[data-autofocus]') ?? node)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = [
        ...node.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
      ].filter((el) => !el.closest('[inert]'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-(--z-egg) grid place-items-center overflow-y-auto p-2 sm:p-4 print:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div aria-hidden onClick={onClose} className="fixed inset-0 bg-black/80" />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn('relative w-full outline-none', className)}
      >
        {children}
      </div>
    </motion.div>
  );
}
