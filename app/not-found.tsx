import type { Metadata } from 'next';
import Link from 'next/link';
import { Caption, Onomatopoeia, Panel, ScreenTone, SpeechBubble } from '@/components/manga';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false },
};

/** 404: um quadro vazio, ainda sem desenho. */
export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="mx-auto flex min-h-svh max-w-4xl flex-col justify-center gap-8 px-(--space-page) pt-(--space-header) pb-12"
    >
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-(length:--fs-hero) leading-none">404</h1>
        <Onomatopoeia
          text="シーン"
          sub="silêncio..."
          size="clamp(2rem,6vw,4rem)"
          tone="hollow"
          rotate={6}
        />
      </div>

      <Panel seed={404} weight={6} shadow className="aspect-[16/10] w-full sm:aspect-[16/8]">
        <ScreenTone size={10} dot={16} fade="radial" opacity={0.35} />
        {/* esboço a lápis: as linhas-guia de um quadro que ninguém desenhou */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-30"
        >
          <path
            d="M0 0L100 100M100 0L0 100M50 0V100M0 50H100"
            stroke="var(--ink)"
            strokeWidth="1"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          <Caption>Enquanto isso, em um quadro em branco...</Caption>
          <SpeechBubble className="text-base sm:text-lg">
            Esse capítulo ainda não foi desenhado.
          </SpeechBubble>
        </div>
      </Panel>

      <Link
        href="/"
        className="font-display bg-ink text-paper hover:bg-accent hover:text-on-accent self-start border-[3px] border-(--ink) px-5 py-3 text-base transition-colors"
      >
        ← Voltar para a capa
      </Link>
    </main>
  );
}
