import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { cv } from '@/lib/data/cv';
import { isTodo, links, site } from '@/lib/data/site';
import { Onomatopoeia, ScreenTone, SpeedLines } from '@/components/manga';
import { Logo } from '@/components/ui/Logo';
import { PrintButton } from '@/components/ui/PrintButton';

export const metadata: Metadata = {
  title: 'Currículo',
  description: `Currículo de ${site.name}: ${cv.headline}.`,
  alternates: { canonical: '/curriculo' },
};

/** Título de bloco no estilo "capítulo": número em etiqueta preta, nome e um fio de nanquim. */
function Heading({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-base uppercase print:mb-1.5">
      <span aria-hidden className="bg-ink text-paper px-1.5 py-0.5 text-[0.7em]">
        {n}
      </span>
      {children}
      <span aria-hidden className="bg-ink h-[3px] flex-1" />
    </h2>
  );
}

const Diamond = () => (
  <span
    aria-hidden
    className="bg-accent mt-[0.42em] h-[0.5em] w-[0.5em] shrink-0 rotate-45 border border-(--ink)"
  />
);

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/**
 * Currículo como "ficha do protagonista": faixa preta com o nome, coluna lateral e coluna principal.
 * A impressão mantém o mesmo desenho, mais enxuto, em uma folha A4 (regras em `@media print`
 * de app/globals.css, que também reduz a escala do texto).
 */
export default function CurriculoPage() {
  const contacts = [
    { label: links.email, href: `mailto:${links.email}`, show: !isTodo(links.email) },
    { label: strip(links.linkedin), href: links.linkedin, show: true },
    { label: strip(links.github), href: links.github, show: !isTodo(links.github) },
  ].filter((c) => c.show);

  return (
    <main
      id="conteudo"
      className="mx-auto flex max-w-5xl flex-col gap-5 px-(--space-page) pt-[calc(var(--space-header)+1.5rem)] pb-16 print:max-w-none print:p-0"
    >
      {/* barra de ações: só na tela */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/" className="font-bubble text-xs underline">
          ← Voltar para a capa
        </Link>
        <div className="flex items-center gap-3">
          <p className="font-bubble hidden text-[0.7rem] opacity-70 sm:block">{cv.printHint}</p>
          <PrintButton label={cv.printLabel} />
        </div>
      </div>

      <article className="cv-sheet bg-paper text-ink shadow-lift relative border-[4px] border-(--ink) print:border-[1.5pt]">
        {/* ---------- faixa do nome ---------- */}
        <header className="bg-ink text-paper relative overflow-hidden">
          <SpeedLines
            count={80}
            inner={30}
            cx={92}
            cy={40}
            className="!text-(--paper) opacity-[0.16]"
          />
          <div className="relative flex items-center gap-5 p-5 sm:p-7 print:gap-4 print:p-4">
            <Logo size={76} decorative className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bubble bg-paper text-ink mb-2 inline-block px-2 py-0.5 text-[0.7rem] print:mb-1">
                Ficha do protagonista · {site.volume}
              </p>
              <h1 className="text-(length:--fs-2xl) leading-none uppercase print:text-[2.1rem]">
                {site.name}
              </h1>
              <p className="mt-2 text-base font-semibold print:mt-1">{cv.headline}</p>
            </div>
            <Onomatopoeia
              text="ドン!"
              size="3.4rem"
              tone="hollow"
              rotate={10}
              className="hidden !text-(--ink) [-webkit-text-stroke-color:var(--paper)] md:inline-block print:!hidden"
            />
          </div>
          <ul className="border-paper/40 relative flex flex-wrap gap-x-5 gap-y-1 border-t px-5 py-2.5 text-sm sm:px-7 print:px-4 print:py-1.5">
            <li>{cv.location}</li>
            {contacts.map((c) => (
              <li key={c.label}>
                <a href={c.href} {...ext} className="underline-offset-2 hover:underline">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <div aria-hidden className="bg-accent h-2 print:h-1.5" />
        </header>

        <div className="grid md:grid-cols-[17.5rem_1fr] print:grid-cols-[15.5rem_1fr]">
          {/* ---------- coluna lateral ---------- */}
          <aside className="relative flex flex-col gap-5 border-(--ink) p-5 max-md:border-b-[3px] md:border-r-[3px] print:gap-3.5 print:border-r-[1.5pt] print:border-b-0 print:p-4">
            <ScreenTone size={9} fade="down" opacity={0.16} />
            <section className="relative">
              <Heading n="01">Formação</Heading>
              <ul className="flex flex-col gap-2.5 print:gap-2">
                {cv.education.map((e) => (
                  <li key={e.course}>
                    <p className="leading-snug font-bold">{e.course}</p>
                    <p className="text-sm">{e.school}</p>
                    <p className="font-bubble mt-0.5 text-[0.7rem] opacity-80">{e.status}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="relative">
              <Heading n="02">Competências</Heading>
              <dl className="flex flex-col gap-2 print:gap-1.5">
                {cv.skills.map((k) => (
                  <div key={k.label}>
                    <dt className="font-bubble border-b-2 border-(--ink) text-[0.72rem]">
                      {k.label}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-snug">{k.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="relative">
              <Heading n="03">Honrarias</Heading>
              <ul className="flex flex-col gap-1.5 text-sm leading-snug">
                {cv.honors.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Diamond />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          {/* ---------- coluna principal ---------- */}
          <div className="flex flex-col gap-5 p-5 sm:p-6 print:gap-3.5 print:p-4">
            <section>
              <Heading n="04">Resumo</Heading>
              <p className="leading-snug">{cv.summary}</p>
            </section>

            <section>
              <Heading n="05">Experiência</Heading>
              <div className="flex flex-col gap-3 print:gap-2">
                {cv.experience.map((x) => (
                  <div key={x.role} className="border-l-[3px] border-(--ink) pl-3">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span>
                        <strong>{x.role}</strong> · {x.place}
                      </span>
                      <span className="font-bubble border-2 border-(--ink) px-1.5 text-[0.68rem] print:border">
                        {x.status}
                      </span>
                    </p>
                    {x.subtitle && <p className="text-sm italic opacity-80">{x.subtitle}</p>}
                    <ul className="mt-1 flex flex-col gap-1 leading-snug print:gap-0.5">
                      {x.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <Diamond />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Heading n="06">Projetos</Heading>
              <ul className="flex flex-col gap-2 print:gap-1.5">
                {cv.projects.map((p) => (
                  <li key={p.name} className="leading-snug">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <strong>{p.name}</strong>
                      {p.stack && (
                        <span className="font-bubble text-[0.68rem] opacity-75">{p.stack}</span>
                      )}
                      {p.link && (
                        <a
                          href={p.link.href}
                          {...ext}
                          className="text-sm underline underline-offset-2 hover:no-underline"
                        >
                          {strip(p.link.href)}
                        </a>
                      )}
                    </p>
                    <p className="first-letter:uppercase">{p.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
