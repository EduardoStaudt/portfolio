'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { EasterEggProvider } from '@/components/easter-eggs/EasterEggProvider';

/** Providers globais do cliente. `reducedMotion="user"` faz o Framer Motion respeitar o sistema. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <EasterEggProvider>{children}</EasterEggProvider>
    </MotionConfig>
  );
}
