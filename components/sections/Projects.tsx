import { projects, projectsIntro } from '@/lib/data/projects';
import type { Project } from '@/lib/data/projects';
import { Onomatopoeia, PageFlip, ScreenTone, SpeedLines } from '@/components/manga';
import type { Spread } from '@/components/manga';
import { ProjectIllustration } from '@/components/manga/illustrations/projects';
import { ChapterHeading } from './ChapterHeading';

const tone = { red: 'accent', blue: 'blue', orange: 'orange' } as const;
const spot = { red: 'bg-(--spot)', blue: 'bg-(--spot-3)', orange: 'bg-(--spot-2)' } as const;

/** Página direita (lida primeiro, como no mangá): a "splash page" com o desenho do projeto. */
function SplashPage({ project, index }: { project: Project; index: number }) {
  if (project.soon) return <SoonSplash project={project} index={index} />;
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col justify-between gap-2 p-5 sm:p-7">
      {index % 2 === 0 ? (
        <SpeedLines count={70} inner={30} cy={45} className="opacity-[0.14]" />
      ) : (
        <ScreenTone size={9} fade="up" opacity={0.3} />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col items-start gap-1.5">
          <p className="font-bubble bg-ink text-paper px-3 py-1.5 text-sm">
            Projeto {String(index + 1).padStart(2, '0')} · {project.kind}
          </p>
          {project.status && (
            <p className="font-bubble bob border-2 border-(--ink) bg-(--spot-2) px-2 py-0.5 text-sm">
              ● {project.status}
            </p>
          )}
        </div>
        <Onomatopoeia
          text={project.sfx.text}
          sub={project.sfx.sub}
          tone={tone[project.accent]}
          size="clamp(1.6rem,3vw,2.8rem)"
          rotate={8}
        />
      </div>
      <ProjectIllustration
        art={project.art}
        alt={project.alt}
        className="relative mx-auto h-auto max-h-[42vh] min-h-0 w-full max-w-[26rem] flex-1"
      />
      <div className="relative">
        <h3 className="text-[clamp(1.7rem,3.1vw,3.4rem)] leading-[0.9] [overflow-wrap:anywhere] uppercase">
          {project.title}
        </h3>
        <p className="font-bubble mt-2 max-w-md text-base">{project.hook}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5 pr-6" aria-label="Tecnologias">
          {project.stack.map((t) => (
            <li
              key={t}
              className="font-bubble bg-paper border-2 border-(--ink) px-2 py-1 text-[0.82rem]"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
      <span aria-hidden className="font-bubble absolute right-3 bottom-2 text-xs opacity-60">
        {index * 2 + 1}
      </span>
    </div>
  );
}

/** Página dupla reservada: só o desenho e o aviso. */
function SoonSplash({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 p-5 sm:p-7">
      <ScreenTone size={9} fade="up" opacity={0.3} />
      <ProjectIllustration
        art={project.art}
        alt={project.alt}
        className="relative h-auto max-h-[46vh] min-h-0 w-full max-w-[26rem] flex-1"
      />
      <h3 className="relative text-[clamp(1.7rem,3.1vw,3.4rem)] leading-[0.9] uppercase">
        {project.title}
      </h3>
      <span aria-hidden className="font-bubble absolute right-3 bottom-2 text-xs opacity-60">
        {index * 2 + 1}
      </span>
    </div>
  );
}

function SoonDetail({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="relative grid h-full min-h-[14rem] grid-rows-[2fr_3fr] gap-3 p-5 sm:p-7"
    >
      <div className="border-[3px] border-dashed border-(--ink) opacity-45" />
      <div className="grid grid-cols-2 gap-3">
        <div className="relative border-[3px] border-dashed border-(--ink) opacity-45">
          <ScreenTone variant="hatch" size={9} opacity={0.2} />
        </div>
        <div className="border-[3px] border-dashed border-(--ink) opacity-45" />
      </div>
      <span className="font-bubble absolute bottom-2 left-3 text-xs opacity-60">
        {index * 2 + 2}
      </span>
    </div>
  );
}

/**
 * Página esquerda: os quadros de texto.
 * No livro (desktop) o texto cresce junto com a página: o tamanho base vem de cqh/cqw
 * (a página é um contêiner de tamanho, ver manga/PageFlip) e o resto usa `em`.
 */
function DetailPage({ project, index }: { project: Project; index: number }) {
  if (project.soon) return <SoonDetail index={index} />;
  return (
    <div className="relative flex h-full flex-col gap-[0.75em] p-5 text-[1.05rem] leading-[1.38] sm:p-6 lg:motion-safe:p-[1.4em] lg:motion-safe:text-[clamp(0.85rem,min(2.95cqh,2.9cqw),1.45rem)]">
      <div className="grid grid-cols-[auto_1fr] items-stretch border-[3px] border-(--ink)">
        <p className="font-bubble bg-ink text-paper flex items-center px-[0.9em] py-[0.5em] text-[0.8em]">
          Papel
        </p>
        <p className="px-[0.75em] py-[0.4em] font-semibold">{project.role}</p>
      </div>

      <div className="relative border-[3px] border-(--ink) px-[0.85em] py-[0.7em]">
        <ScreenTone variant="hatch" size={8} fade="left" opacity={0.14} />
        <p className="relative">{project.description}</p>
      </div>

      <ul className="flex flex-col gap-[0.35em]">
        {project.highlights.map((h) => (
          <li key={h} className="flex items-start gap-[0.6em]">
            <span
              aria-hidden
              className={`mt-[0.32em] h-[0.75em] w-[0.75em] shrink-0 rotate-45 border-2 border-(--ink) ${spot[project.accent]}`}
            />
            {h}
          </li>
        ))}
      </ul>

      {project.next && (
        <div className="relative mt-[0.5em] border-[3px] border-dashed border-(--ink) px-[0.8em] pt-[1em] pb-[0.7em]">
          <p className="font-bubble absolute -top-[1em] left-[0.8em] flex items-center gap-2 text-[0.78em]">
            <span className="bg-ink text-paper px-[0.6em] py-[0.15em]">{project.next.label}</span>
            <span className="bob border-2 border-(--ink) bg-(--spot-2) px-[0.6em] py-[0.15em]">
              ● {project.next.status}
            </span>
          </p>
          <p className="text-[0.94em]">{project.next.text}</p>
          <ul className="mt-[0.5em] flex flex-wrap gap-[0.4em]" aria-label="Temas da parte 2">
            {project.next.topics.map((t) => (
              <li
                key={t}
                className="font-bubble border-2 border-dashed border-(--ink) px-[0.6em] py-[0.15em] text-[0.76em]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pl-[1.2em]">
        {project.link ? (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display bg-accent text-on-accent shadow-bubble hover:bg-ink hover:text-paper border-[3px] border-(--ink) px-[1em] py-[0.6em] text-[0.9em] leading-tight transition-colors"
          >
            {project.link.label} ↗<span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : (
          <p className="font-bubble border-2 border-dashed border-(--ink) px-[0.8em] py-[0.5em] text-[0.8em]">
            Projeto de pesquisa · sem link público
          </p>
        )}
      </div>
      <span aria-hidden className="font-bubble absolute bottom-2 left-3 text-xs opacity-60">
        {index * 2 + 2}
      </span>
    </div>
  );
}

/**
 * Cap. 2: cada projeto é uma página dupla; trocar de projeto vira a página (ver manga/PageFlip).
 * Sentido de mangá: o desenho fica na página direita (lida primeiro) e o texto na esquerda.
 */
export function Projects() {
  const spreads: Spread[] = projects.map((project, i) => ({
    id: project.id,
    label: project.title,
    left: <DetailPage project={project} index={i} />,
    right: <SplashPage project={project} index={i} />,
  }));

  return (
    <section
      id="projetos"
      tabIndex={-1}
      aria-labelledby="projetos-titulo"
      className="relative outline-none"
    >
      <PageFlip
        spreads={spreads}
        ariaLabel="Projetos, um por página dupla"
        header={
          <ChapterHeading
            id="projetos-titulo"
            kicker={projectsIntro.kicker}
            title={projectsIntro.title}
            className="lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-4 lg:motion-safe:[&_h2]:text-(length:--fs-2xl)"
          />
        }
      />
    </section>
  );
}
