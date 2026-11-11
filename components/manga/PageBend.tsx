import type { ReactNode } from 'react';

/**
 * Folha flexível. A página é cortada em tiras verticais encadeadas (cada tira é filha
 * da anterior e gira em relação a ela), então a folha se curva como papel em vez de
 * girar dura como uma porta. Cada tira mostra a sua fatia do conteúdo por uma janela.
 *
 * O conteúdo é repetido uma vez por tira: monte este componente só enquanto a folha
 * está virando e mantenha a versão única (rígida) no resto do tempo.
 */

type Props = {
  front: ReactNode;
  /** verso da folha (opcional): aparece quando ela passa de 90° */
  back?: ReactNode;
  /** lado da lombada, em torno da qual a folha vira */
  spine?: 'left' | 'right';
  strips?: number;
};

const face = 'absolute inset-y-0 overflow-hidden backface-hidden';
const shade = 'bg-ink pointer-events-none absolute inset-0 opacity-(--shade,0)';

export function PageBend({ front, back, spine = 'left', strips = 12 }: Props) {
  const left = spine === 'left';
  // posição da fatia dentro da janela: a tira k (contada a partir da lombada) mostra a k-ésima fatia
  const slice = (k: number, mirrored: boolean) => {
    const fromLeft = left !== mirrored ? k : strips - 1 - k;
    return { width: `${strips * 100}%`, left: `${-fromLeft * 100}%` };
  };

  const strip = (k: number): ReactNode => (
    <div
      data-strip
      className="preserve-3d absolute top-0 h-full will-change-transform"
      style={{
        width: k === 0 ? `${100 / strips}%` : '100%',
        [left ? 'left' : 'right']: k === 0 ? 0 : '100%',
        transformOrigin: left ? 'left center' : 'right center',
      }}
    >
      {/* 1px a mais para as emendas não aparecerem */}
      <div className={`${face} ${left ? 'left-0' : 'right-0'} w-[calc(100%+1px)]`}>
        <div className="absolute top-0 h-full" style={slice(k, false)}>
          {front}
        </div>
        <div className={shade} />
      </div>
      {back && (
        <div
          className={`${face} ${left ? 'left-0' : 'right-0'} w-[calc(100%+1px)] [transform:rotateY(180deg)]`}
        >
          <div className="absolute top-0 h-full" style={slice(k, true)}>
            {back}
          </div>
          <div className={shade} />
        </div>
      )}
      {k < strips - 1 && strip(k + 1)}
    </div>
  );

  return (
    <div data-bend aria-hidden inert className="preserve-3d absolute inset-0">
      {strip(0)}
    </div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Posiciona as tiras para o progresso `t` (0 = folha deitada, 1 = virada).
 * A borda solta vai na frente e a parte presa à lombada vem atrás: é isso que curva a folha.
 * `angle`: giro total, em graus; o sinal dá o sentido.
 */
export function applyBend(root: Element, t: number, angle = -180, lead = 0.55) {
  const strips = root.querySelectorAll<HTMLElement>('[data-strip]');
  const last = Math.max(1, strips.length - 1);
  let previous = 0;
  strips.forEach((el, k) => {
    const local = smooth(clamp01(t * (1 + lead) - lead * (1 - k / last)));
    const absolute = angle * local;
    el.style.transform = `rotateY(${(absolute - previous).toFixed(3)}deg)`;
    el.style.setProperty('--shade', (Math.sin(Math.PI * local) * 0.32).toFixed(3));
    previous = absolute;
  });
}
