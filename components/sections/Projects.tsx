import { projects, projectsIntro } from '@/lib/data/projects';
import type { Project } from '@/lib/data/projects';
import { Onomatopoeia, PageFlip, ScreenTone, SpeedLines } from '@/components/manga';
import type { Spread } from '@/components/manga';
import { ProjectIllustration } from '@/components/manga/illustrations/projects';
import { ChapterHeading } from './ChapterHeading';

const tone = { red: 'accent', blue: 'blue', orange: 'orange' } as const;
const spot = { red: 'bg-(--spot)', blue: 'bg-(--spot-3)', orange: 'bg-(--spot-2)' } as const;

/** Página esquerda: a "splash page" do projeto. */
function LeftPage({ project, index }: { project: Project; index: number }) {
  if (project.soon) return <SoonLeft project={project} index={index} />;
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col justify-between p-5 sm:p-7">
      {index % 2 === 0 ? (
        <SpeedLines count={70} inner={30} cy={45} className="opacity-[0.14]" />
      ) : (
        <ScreenTone size={9} fade="up" opacity={0.3} />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col items-start gap-1.5">
          <p className="font-bubble bg-ink text-paper px-2.5 py-1 text-[0.7rem]">
            Projeto {String(index + 1).padStart(2, '0')} · {project.kind}
          </p>
          {project.status && (
            <p className="font-bubble bob border-2 border-(--ink) bg-(--spot-2) px-2 py-0.5 text-[0.7rem]">
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
        <p className="font-bubble mt-2 max-w-md text-[0.8rem]">{project.hook}</p>
      </div>
      <span aria-hidden className="font-bubble absolute bottom-2 left-3 text-[0.6rem] opacity-60">
        {index * 2 + 1}
      </span>
    </div>
  );
}

/** Página dupla reservada: só o desenho e o aviso. */
function SoonLeft({ project, index }: { project: Project; index: number }) {
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
      <span aria-hidden className="font-bubble absolute bottom-2 left-3 text-[0.6rem] opacity-60">
        {index * 2 + 1}
      </span>
    </div>
  );
}

function SoonRight({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="relative grid h-full min-h-[14rem] grid-rows-[2fr_3fr] gap-3 p-5 sm:p-7"
    >
      <div className="border-[3px] border-dashed border-(--ink) opacity-45" />
      <div className="grid grid-cols-2 gap-3">
        <div className="border-[3px] border-dashed border-(--ink) opacity-45" />
        <div className="relative border-[3px] border-dashed border-(--ink) opacity-45">
          <ScreenTone variant="hatch" size={9} opacity={0.2} />
        </div>
      </div>
      <span className="font-bubble absolute right-3 bottom-2 text-[0.6rem] opacity-60">
        {index * 2 + 2}
      </span>
    </div>
  );
}

/** Página direita: os quadros de detalhe. */
function RightPage({ project, index }: { project: Project; index: number }) {
  if (project.soon) return <SoonRight index={index} />;
  return (
    <div className="relative flex h-full flex-col gap-3 p-5 sm:p-6">
      <div className="grid grid-cols-[auto_1fr] items-stretch border-[3px] border-(--ink)">
        <p className="font-bubble bg-ink text-paper px-3 py-2 text-[0.7rem]">Papel</p>
        <p className="px-3 py-2 text-sm font-semibold">{project.role}</p>
      </div>

      <div className="relative border-[3px] border-(--ink) p-3.5">
        <ScreenTone variant="hatch" size={8} fade="left" opacity={0.14} />
        <p className="relative text-sm sm:text-[0.95rem]">{project.description}</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {project.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm">
            <span
              aria-hidden
              className={`mt-1 h-3 w-3 shrink-0 rotate-45 border-2 border-(--ink) ${spot[project.accent]}`}
            />
            {h}
          </li>
        ))}
      </ul>

      <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologias">
        {project.stack.map((t) => (
          <li key={t} className="font-bubble border-2 border-(--ink) px-2 py-1 text-[0.68rem]">
            {t}
          </li>
        ))}
      </ul>

      {project.next && (
        <div className="relative border-[3px] border-dashed border-(--ink) p-3 pt-4">
          <p className="font-bubble absolute -top-3 left-3 flex items-center gap-2 text-[0.68rem]">
            <span className="bg-ink text-paper px-2 py-0.5">{project.next.label}</span>
            <span className="bob border-2 border-(--ink) bg-(--spot-2) px-2 py-0.5">
              ● {project.next.status}
            </span>
          </p>
          <p className="text-[0.82rem]">{project.next.text}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Temas da parte 2">
            {project.next.topics.map((t) => (
              <li
                key={t}
                className="font-bubble border-2 border-dashed border-(--ink) px-2 py-0.5 text-[0.66rem]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3">
        {project.link ? (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display bg-accent text-on-accent shadow-bubble hover:bg-ink hover:text-paper border-[3px] border-(--ink) px-4 py-2.5 text-sm transition-colors"
          >
            {project.link.label} ↗<span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : (
          <p className="font-bubble border-2 border-dashed border-(--ink) px-3 py-2 text-[0.7rem]">
            Projeto de pesquisa · sem link público
          </p>
        )}
        <span aria-hidden className="font-bubble text-[0.6rem] opacity-60">
          {index * 2 + 2}
        </span>
      </div>
    </div>
  );
}

/** Cap. 3: cada projeto é uma página dupla; trocar de projeto vira a página (ver manga/PageFlip). */
export function Projects() {
  const spreads: Spread[] = projects.map((project, i) => ({
    id: project.id,
    label: project.title,
    left: <LeftPage project={project} index={i} />,
    right: <RightPage project={project} index={i} />,
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
