'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { grimoire } from '@/lib/data/eggs';
import { InkBorder } from '@/components/manga/InkBorder';
import { ScreenTone } from '@/components/manga/ScreenTone';
import { Modal } from './Modal';

const LEAF = 'M0 0C-15 -10 -20 -31 -9 -38C-4 -41 0 -36 0 -31C0 -36 4 -41 9 -38C20 -31 15 -10 0 0Z';

/** Trevo de cinco folhas, desenho próprio. */
export function Clover({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="-50 -50 100 100" className={className}>
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            d={LEAF}
            fill="currentColor"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M0 -4V-28" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      <circle r="4" fill="var(--ink)" />
    </svg>
  );
}

// trevinhos que flutuam em volta do livro: [esquerda %, topo %, tamanho, atraso]
const SPARKS = [
  [-12, 12, 26, 0],
  [104, 4, 20, 0.4],
  [-8, 78, 18, 0.8],
  [108, 66, 28, 0.2],
  [44, -10, 16, 0.6],
  [58, 104, 22, 1],
] as const;

const OPEN = 0.9; // duração da abertura da capa, em segundos

type Props = { open: boolean; onClose: () => void };

/**
 * Homenagem a Black Clover: o Konami code invoca um "grimório" com a ficha estilo RPG.
 * O livro desce girando dentro de um círculo mágico; ao clicar, a capa e as folhas viram
 * em 3D e os atributos se preenchem um a um. Trevo de cinco folhas próprio, sem artes oficiais.
 */
export function Grimoire({ open, onClose }: Props) {
  return <AnimatePresence>{open && <GrimoireDialog onClose={onClose} />}</AnimatePresence>;
}

function GrimoireDialog({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const openBook = () => {
    setOpened(true);
    // a capa fica desativada ao abrir: o foco segue para dentro do livro
    requestAnimationFrame(() => closeButton.current?.focus());
  };

  return (
    <Modal label={grimoire.title} onClose={onClose} className="max-w-md">
      {/* a sala escurece e fica só o clarão vermelho em volta do livro */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(215,38,61,0.42)_0%,rgba(59,23,37,0.72)_34%,#050203_74%)]"
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none fixed h-[46vh] w-[70vw] rounded-full bg-black/70 blur-3xl"
          style={{ left: `${-20 + i * 38}vw`, bottom: `${-22 + (i % 2) * 6}vh` }}
          animate={{ x: [0, i % 2 ? -50 : 50, 0], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        initial={{ y: -140, rotate: -16, scale: 0.5, opacity: 0 }}
        animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 15 }}
        className="relative h-[min(84svh,38rem)]"
        style={{ perspective: '1800px' }}
      >
        {/* aura: brilho vermelho pulsando nas bordas do livro */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1 shadow-[0_0_0_3px_#D7263D,0_0_26px_10px_rgba(215,38,61,0.95),0_0_110px_42px_rgba(215,38,61,0.5)]"
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.012, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* círculo mágico girando atrás do livro */}
        <motion.svg
          aria-hidden
          viewBox="-100 -100 200 200"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 overflow-visible text-[#D7263D] drop-shadow-[0_0_6px_#D7263D]"
          animate={{ rotate: 360 }}
          transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
        >
          <circle
            r="96"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 5"
          />
          <circle r="84" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <polygon
            points="0,-84 79.900,-26 49.400,68 -49.400,68 -79.900,-26"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <polygon
            points="0,84 79.900,26 49.400,-68 -49.400,-68 -79.900,26"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.7"
          />
        </motion.svg>
        {SPARKS.map(([left, top, size, delay], i) => (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute text-[#D7263D] drop-shadow-[0_0_8px_#D7263D]"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 40, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.2, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Clover size={size} />
          </motion.div>
        ))}

        {/* página interna: a ficha */}
        <div
          className="bg-paper text-ink absolute inset-0 overflow-y-auto p-6 sm:p-8"
          inert={!opened}
        >
          <div className="mb-4 flex items-center gap-3">
            <Clover size={48} className="shrink-0 text-(--spot)" />
            <div>
              <h2 className="text-xl">{grimoire.klass}</h2>
              <p className="font-bubble text-xs">{grimoire.level}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {grimoire.stats.map((s, i) => (
              <li key={s.name}>
                <div className="font-bubble flex justify-between text-xs">
                  <span>{s.name}</span>
                  <span aria-hidden>{s.value}</span>
                </div>
                <div
                  role="meter"
                  aria-label={s.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.value}
                  className="relative mt-1 h-4 border-[2.5px] border-(--ink)"
                >
                  <motion.div
                    className="bg-accent h-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: opened ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: OPEN + 0.25 + i * 0.1, ease: 'easeOut' }}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-col gap-1.5 text-sm">
            {grimoire.traits.map((t, i) => (
              <motion.li
                key={t}
                className="flex gap-2"
                initial={{ opacity: 0, x: -12 }}
                animate={opened ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ delay: OPEN + 1 + i * 0.12 }}
              >
                <span aria-hidden>✦</span>
                {t}
              </motion.li>
            ))}
          </ul>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="font-bubble bg-ink text-paper mt-6 px-4 py-2 text-xs"
          >
            Fechar o grimório
          </button>
          <InkBorder seed={78} weight={5} />
        </div>

        {/* folhas em branco que viram logo depois da capa */}
        {[2, 1].map((n) => (
          <motion.div
            key={n}
            aria-hidden
            className="bg-paper pointer-events-none absolute inset-0 origin-left border-2 border-(--ink)"
            initial={false}
            animate={opened ? { rotateY: -178, opacity: [1, 1, 0] } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: OPEN * 0.8, delay: 0.14 * n, ease: [0.5, 0, 0.3, 1] }}
          >
            <ScreenTone variant="hatch" size={9} opacity={0.12} />
          </motion.div>
        ))}

        {/* capa */}
        <motion.button
          type="button"
          data-autofocus
          onClick={openBook}
          disabled={opened}
          aria-label={`${grimoire.title}. Clique para abrir`}
          className="absolute inset-0 flex origin-left flex-col items-center justify-center gap-6 bg-[linear-gradient(155deg,#34161b_0%,#150709_55%,#27100f_100%)] p-8 text-[#F5F1E8] disabled:pointer-events-none"
          initial={false}
          animate={opened ? { rotateY: -178, opacity: [1, 1, 0] } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: OPEN, ease: [0.5, 0, 0.3, 1] }}
          whileHover={opened ? undefined : { rotateY: -14 }}
        >
          <ScreenTone variant="cross" size={10} opacity={0.14} className="!text-[#D7263D]" />
          <span
            className="absolute inset-4 border-2 border-[#D7263D] opacity-70 shadow-[inset_0_0_18px_rgba(215,38,61,0.5)]"
            aria-hidden
          />
          <motion.span
            className="relative"
            initial={{ rotate: -200, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.35 }}
          >
            <Clover
              size={150}
              className="text-[#050203] drop-shadow-[0_0_5px_#D7263D] [filter:drop-shadow(0_0_5px_#D7263D)_drop-shadow(0_0_16px_#D7263D)]"
            />
          </motion.span>
          <span className="font-display relative text-2xl">{grimoire.title}</span>
          <motion.span
            className="font-bubble relative text-xs"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Clique para abrir
          </motion.span>
          <InkBorder seed={77} weight={5} className="!text-[#0A0A0A]" />
        </motion.button>
      </motion.div>
    </Modal>
  );
}
