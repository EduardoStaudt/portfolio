'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { contact } from '@/lib/data/contact';
import { isTodo, links, site } from '@/lib/data/site';
import { emit } from '@/lib/bus';
import { InkBorder, Onomatopoeia, ScreenTone, SpeedLines } from '@/components/manga';
import { pop } from '@/components/manga/SpeechBubble';
import { Clover } from '@/components/easter-eggs/Grimoire';
import { Logo } from '@/components/ui/Logo';
import { StabLink } from '@/components/ui/StabLink';
import { cn } from '@/lib/cn';

type BubbleLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  index: number;
};

/** Balão de fala clicável. Enquanto o link ainda é `TODO_...`, aparece desativado como "em breve". */
function BubbleLink({ href, label, icon, index }: BubbleLinkProps) {
  const pending = isTodo(href);
  const shape =
    'font-bubble relative flex min-h-24 w-full items-center justify-center gap-3 rounded-[46%_54%_52%_48%/56%_48%_52%_44%] border-[3px] border-(--ink) px-8 py-5 text-center text-sm';
  const content = (
    <>
      <span aria-hidden className="shrink-0">
        {icon}
      </span>
      <span>
        {label}
        {pending && <span className="block text-[0.65rem] opacity-70">({contact.soon})</span>}
      </span>
    </>
  );
  return (
    <motion.li
      {...pop}
      transition={{ type: 'spring', stiffness: 380, damping: 17, delay: index * 0.08 }}
      className={cn('relative', index % 2 === 1 && 'sm:translate-y-6')}
    >
      {pending ? (
        <span aria-disabled className={cn(shape, 'bg-paper text-ink border-dashed opacity-70')}>
          {content}
        </span>
      ) : (
        <StabLink
          href={href}
          className={cn(
            shape,
            'bg-paper text-ink shadow-bubble hover:bg-ink hover:text-paper transition-colors',
          )}
        >
          {content}
        </StabLink>
      )}
    </motion.li>
  );
}

const icon = {
  linkedin: (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <rect
        x="1.5"
        y="1.5"
        width="23"
        height="23"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M7 11v8M7 6.500v1M11.500 19v-8M11.500 14c0 -4 7 -4 7 0v5"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  ),
  github: (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path
        d="M9 8L3 13l6 5M17 8l6 5l-6 5M14.500 5l-3 16"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cv: (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path
        d="M5 2h11l5 5v17H5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h8M9 16h8M9 20h5"
        stroke="currentColor"
        strokeWidth="2.500"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/** Contracapa: "Continua no próximo volume...", balões com links e o botão de e-mail. */
export function Contact() {
  const emailPending = isTodo(links.email);
  const mailto = `mailto:${links.email}?subject=${encodeURIComponent(contact.emailSubject)}`;

  return (
    <section
      id="contato"
      tabIndex={-1}
      aria-labelledby="contato-titulo"
      className="bg-ink text-paper relative overflow-hidden px-(--space-page) py-24 outline-none"
    >
      <SpeedLines count={90} inner={38} className="!text-(--paper) opacity-[0.14]" />
      <ScreenTone size={10} fade="up" opacity={0.16} className="!text-(--paper)" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <p className="font-bubble bg-paper text-ink px-2.5 py-1 text-xs">{contact.kicker}</p>
        <div className="relative">
          <h2 id="contato-titulo" className="text-(length:--fs-3xl) uppercase">
            {contact.title}
          </h2>
          <Onomatopoeia
            text="つづく"
            size="clamp(1.6rem,4vw,3rem)"
            tone="hollow"
            rotate={-10}
            className="absolute -top-10 -left-2 sm:-left-16"
          />
        </div>
        <p className="max-w-xl text-lg opacity-90">{contact.lead}</p>

        {/* os balões ficam sobre papel para manter o traço de nanquim */}
        <div className="bg-paper text-ink relative w-full p-6 sm:p-10">
          <ul className="grid gap-5 sm:grid-cols-3 sm:pb-6">
            <BubbleLink
              index={0}
              href={links.linkedin}
              label={contact.bubbles.linkedin}
              icon={icon.linkedin}
            />
            <BubbleLink
              index={1}
              href={links.github}
              label={contact.bubbles.github}
              icon={icon.github}
            />
            <BubbleLink index={2} href={links.cv} label={contact.bubbles.cv} icon={icon.cv} />
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            {emailPending ? (
              <span
                aria-disabled
                className="font-display border-[4px] border-dashed border-(--ink) px-8 py-4 text-lg opacity-70 sm:text-2xl"
              >
                {contact.bubbles.email}
                <span className="font-bubble block text-xs">({contact.soon})</span>
              </span>
            ) : (
              <StabLink
                href={mailto}
                wrapperClassName="inline-block"
                className="font-display bg-accent text-on-accent shadow-lift hover:bg-ink hover:text-paper block border-[4px] border-(--ink) px-8 py-4 text-lg transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:text-2xl"
              >
                {contact.bubbles.email} ✉
              </StabLink>
            )}
          </div>
          <InkBorder seed={91} weight={6} jitter={0.3} />

          {/* trevo discreto: atalho (sem teclado) para o grimório */}
          <button
            type="button"
            aria-label="Um trevo de cinco folhas"
            onClick={() => emit('grimoire')}
            className="absolute right-3 bottom-3 opacity-25 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <Clover size={26} className="text-(--paper)" />
          </button>
        </div>

        <footer className="flex flex-col items-center gap-3 pt-6">
          <Logo size={56} decorative />
          <p className="font-bubble text-xs">{contact.colophon}</p>
          <p className="text-xs opacity-70">
            {contact.madeWith} · {site.volume}
          </p>
        </footer>
      </div>
    </section>
  );
}
