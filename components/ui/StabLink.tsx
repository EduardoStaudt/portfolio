'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { REDUCED_MOTION_QUERY } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { SwordGlyph } from './SwordGlyph';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
};

const NAVIGATE_MS = 480; // tempo do golpe antes de seguir o link
const CLEAR_MS = 1700;

/**
 * Link da contracapa: ao clicar, a espada do cursor desce e finca no botão, e só então
 * o link abre. Com teclado o golpe cai no centro. Com `prefers-reduced-motion`, ou com
 * Ctrl/Shift/botão do meio, vale o comportamento normal do link.
 */
export function StabLink({ href, children, className, wrapperClassName }: Props) {
  const router = useRouter();
  const [hit, setHit] = useState<{ x: number; y: number; key: number } | null>(null);
  const timers = useRef<number[]>([]);
  const internal = href.startsWith('/');
  const newTab = !internal && !href.startsWith('mailto:');

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((t) => window.clearTimeout(t));
      delete document.documentElement.dataset.stab;
    };
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    e.preventDefault();
    if (hit) return;
    const box = e.currentTarget.getBoundingClientRect();
    // clique de teclado não tem coordenadas: o golpe cai no meio
    const keyboard = e.detail === 0;
    setHit({
      x: keyboard ? box.width / 2 : e.clientX - box.left,
      y: keyboard ? box.height / 2 : e.clientY - box.top,
      key: Date.now(),
    });
    document.documentElement.dataset.stab = '1';
    timers.current.push(
      window.setTimeout(() => {
        if (internal) router.push(href);
        else if (newTab) {
          const tab = window.open(href, '_blank');
          if (tab) tab.opener = null;
          else window.location.href = href;
        } else window.location.href = href;
      }, NAVIGATE_MS),
      window.setTimeout(() => {
        setHit(null);
        delete document.documentElement.dataset.stab;
      }, CLEAR_MS),
    );
  };

  return (
    <motion.span
      className={cn('relative block', wrapperClassName)}
      animate={hit ? { x: [0, -7, 6, -4, 2, 0], scale: [1, 0.95, 1.02, 1] } : { x: 0, scale: 1 }}
      transition={{ duration: 0.38, delay: hit ? 0.14 : 0 }}
    >
      <a
        href={href}
        onClick={onClick}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer me' } : {})}
        className={className}
      >
        {children}
        {newTab && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
      <AnimatePresence>
        {hit && (
          <motion.span
            key={hit.key}
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{ left: hit.x, top: hit.y }}
            exit={{ opacity: 0 }}
          >
            {/* rachaduras e clarão no ponto do golpe */}
            <motion.svg
              width="120"
              height="120"
              viewBox="-60 -60 120 120"
              className="absolute -top-[60px] -left-[60px] overflow-visible"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.14, duration: 0.16, ease: 'easeOut' }}
            >
              <path
                d="M0 -52L8 -14L44 -30L18 -2L56 10L16 12L26 48L2 20L-22 52L-14 14L-54 22L-20 -2L-46 -34L-10 -16Z"
                fill="#F5F1E8"
                stroke="#0A0A0A"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M0 0L-9 13L-4 22L-12 34M0 0L13 7L17 18L30 22M0 0L-15 -5L-22 -15"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            {/* a espada desce de cima e fica fincada, tremendo */}
            <motion.span
              className="absolute top-0 left-0 block origin-top-left"
              initial={{ x: 70, y: -190, rotate: -116, opacity: 0, scale: 1.25 }}
              animate={{
                x: [70, -4, -4, -4, -4],
                y: [-190, 8, 8, 8, 8],
                rotate: [-116, -116, -110, -120, -116],
                opacity: 1,
                scale: 1.25,
              }}
              transition={{ duration: 0.62, times: [0, 0.24, 0.45, 0.7, 1], ease: 'easeIn' }}
            >
              <SwordGlyph size={96} className="-translate-x-[3px] -translate-y-[3px]" />
            </motion.span>
            <motion.span
              className="font-display ink-outline absolute -top-16 left-8 text-3xl whitespace-nowrap text-[#D7263D]"
              initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 520, damping: 15 }}
            >
              ザクッ
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
