/** Barramento de eventos minúsculo e tipado para efeitos globais (transições, easter eggs). */
type Events = {
  goto: { id: string };
  rubber: { ms: number };
  saw: undefined;
  duel: undefined;
  grimoire: undefined;
};

const target = typeof window !== 'undefined' ? new EventTarget() : null;

export function emit<K extends keyof Events>(
  type: K,
  ...detail: Events[K] extends undefined ? [] : [Events[K]]
) {
  target?.dispatchEvent(new CustomEvent(type, { detail: detail[0] }));
}

export function on<K extends keyof Events>(type: K, handler: (detail: Events[K]) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  target?.addEventListener(type, listener);
  return () => target?.removeEventListener(type, listener);
}
