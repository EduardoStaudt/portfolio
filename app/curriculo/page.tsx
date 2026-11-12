import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { cv } from '@/lib/data/cv';
import { isTodo, links, site } from '@/lib/data/site';
import { ScreenTone, SpeedLines } from '@/components/manga';
import { Logo } from '@/components/ui/Logo';
import { PrintButton } from '@/components/ui/PrintButton';

export const metadata: Metadata = {
  title: 'Currículo',
  description: `Currículo de ${site.name}: ${cv.headline}.`,
  alternates: { canonical: '/curriculo' },
};

/**
 * Escala de texto do currículo, uma só para a folha toda:
 * título de item (curso, cargo, projeto) > corpo > detalhe (situação, tecnologias, links).
 */
const t = {
  item: 'text-[1rem] leading-snug font-bold',
  body: 'text-[0.9rem] leading-snug',
  meta: 'text-[0.78rem] leading-snug',
};

/** Título de seção: número em etiqueta preta, nome e um fio vermelho. */
function Heading({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-[1.05rem] uppercase print:mb-2">
      <span aria-hidden className="bg-ink text-paper px-1.5 py-0.5 text-[0.7em]">
        {n}
      </span>
      {children}
      <span aria-hidden className="bg-accent h-[3px] min-w-3 flex-1" />
      <span aria-hidden className="bg-ink h-2.5 w-2.5 rotate-45" />
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
 * Currículo: faixa preta com o nome e os contatos, coluna lateral e coluna principal.
 * A impressão usa o mesmo desenho, sem a logo e as retículas, em uma folha A4
 * (bloco `@media print` de app/globals.css, que também ajusta a escala do texto e zera a
 * margem da página para o navegador não imprimir data, título e endereço).
 * Todos os endereços são links de verdade: continuam clicáveis no PDF salvo.
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

      <article className="cv-sheet bg-paper text-ink shadow-lift relative border-[4px] border-(--ink) print:border-0">
        {/* ---------- faixa do nome ---------- */}
        <header className="bg-ink text-paper relative overflow-hidden">
          <SpeedLines
            count={80}
            inner={30}
            cx={92}
            cy={40}
            className="!text-(--paper) opacity-[0.16]"
          />
          {/* detalhe da impressão: listras finas no canto da faixa */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-40 print:block"
            style={{
              background:
                'repeating-linear-gradient(-58deg, transparent 0 9px, rgba(255,255,255,0.16) 9px 11px)',
            }}
          />
          <div className="relative flex items-center gap-5 p-5 sm:p-7 print:px-[12mm] print:pt-[9mm] print:pb-3">
            <Logo size={76} decorative className="shrink-0 print:hidden" />
            <div className="min-w-0 flex-1">
              <p className="font-bubble bg-paper text-ink mb-2 inline-block px-2 py-0.5 text-[0.7rem] print:hidden">
                Currículo · {site.volume}
              </p>
              <h1 className="text-(length:--fs-2xl) leading-none uppercase print:text-[2.2rem]">
                {site.name}
              </h1>
              <p className="mt-2 text-[1rem] font-semibold print:mt-1.5">{cv.headline}</p>
            </div>
          </div>
          <ul
            className={`border-paper/40 relative flex flex-wrap gap-x-5 gap-y-1 border-t px-5 py-2.5 sm:px-7 print:px-[12mm] print:py-2 ${t.body}`}
          >
            <li>{cv.location}</li>
            {contacts.map((c) => (
              <li key={c.label}>
                <a href={c.href} {...ext} className="underline-offset-2 hover:underline">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <div aria-hidden className="bg-accent h-2" />
        </header>

        <div className="grid md:grid-cols-[17.5rem_1fr] print:grid-cols-[17.2rem_1fr] print:px-[12mm]">
          {/* ---------- coluna lateral ---------- */}
          <aside className="relative flex flex-col gap-5 border-(--ink) p-5 max-md:border-b-[3px] md:border-r-[3px] print:gap-4 print:border-r-[1.5pt] print:border-b-0 print:py-4 print:pr-4 print:pl-0">
            <ScreenTone size={9} fade="down" opacity={0.16} />
            <section className="relative">
              <Heading n="01">Formação</Heading>
              <ul className="flex flex-col gap-2.5">
                {cv.education.map((e) => (
                  <li key={e.course}>
                    <p className={t.item}>{e.course}</p>
                    <p className={t.body}>{e.school}</p>
                    <p className={`${t.meta} mt-0.5 italic`}>{e.status}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="relative">
              <Heading n="02">Competências</Heading>
              <dl className="flex flex-col gap-2">
                {cv.skills.map((k) => (
                  <div key={k.label}>
                    <dt className={t.item}>{k.label}</dt>
                    <dd className={t.body}>{k.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="relative">
              <Heading n="03">Honrarias</Heading>
              <ul className={`flex flex-col gap-1.5 ${t.body}`}>
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
          <div className="flex flex-col gap-5 p-5 sm:p-6 print:gap-4 print:py-4 print:pr-0 print:pl-4">
            <section>
              <Heading n="04">Resumo</Heading>
              <p className={t.body}>{cv.summary}</p>
            </section>

            <section>
              <Heading n="05">Experiência</Heading>
              <div className="flex flex-col gap-3 print:gap-2.5">
                {cv.experience.map((x) => (
                  <div key={x.role} className="border-l-[3px] border-(--ink) pl-3">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className={t.item}>
                        {x.role} <span className="font-normal">· {x.place}</span>
                      </span>
                      <span className={`${t.meta} border border-(--ink) px-1.5 italic`}>
                        {x.status}
                      </span>
                    </p>
                    {x.subtitle && <p className={`${t.meta} italic`}>{x.subtitle}</p>}
                    <ul className={`mt-1 flex flex-col gap-1 ${t.body}`}>
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
              <ul className="flex flex-col gap-2">
                {cv.projects.map((p) => (
                  <li key={p.name}>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className={t.item}>{p.name}</span>
                      {p.stack && <span className={`${t.meta} italic`}>{p.stack}</span>}
                      {p.links.map((href) => (
                        <a
                          key={href}
                          href={href}
                          {...ext}
                          className={`${t.meta} text-accent-text break-all underline underline-offset-2 hover:no-underline`}
                        >
                          {strip(href)}
                        </a>
                      ))}
                    </p>
                    <p className={`${t.body} first-letter:uppercase`}>{p.text}</p>
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
