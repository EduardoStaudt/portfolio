'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/data/site';
import { goToChapter } from '@/lib/chapter-store';
import { EggCounter } from '@/components/easter-eggs/EggCounter';
import { useLogoTaps } from '@/components/easter-eggs/useLogoTaps';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { ThemeToggle } from './ThemeToggle';

/** Barra fixa: logo + nome, sumário, tema e contador de segredos. */
export function Header() {
  const home = usePathname() === '/';
  const tap = useLogoTaps();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-(--z-header) flex h-(--space-header) items-center justify-between gap-3 px-(--space-page) print:hidden">
      <Link
        href="/"
        aria-label={`${site.name}: voltar para a capa`}
        onClick={(e) => {
          tap();
          if (home) {
            e.preventDefault();
            goToChapter('capa');
          }
        }}
        className="group pointer-events-auto flex items-center gap-2.5"
      >
        <Logo size={40} decorative className="transition-transform group-hover:-rotate-6" />
        <span className="font-display bg-paper hidden border-[2.5px] border-(--ink) px-2.5 py-1.5 text-sm leading-none md:inline">
          {site.shortName}
        </span>
      </Link>

      <div className="pointer-events-auto flex items-center gap-1.5">
        {home && <Nav />}
        <ThemeToggle />
        <EggCounter />
      </div>
    </header>
  );
}
