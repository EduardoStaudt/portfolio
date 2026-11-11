/** Screen shake leve no conteúdo (não afeta header/nav/cursor, que ficam fora de #manga-root). */
export function shakeScreen(intensity = 6) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.getElementById('manga-root');
  if (!root) return;
  root.style.setProperty('--shake', `${intensity}px`);
  root.classList.remove('is-shaking');
  void root.offsetWidth; // reinicia a animação
  root.classList.add('is-shaking');
  root.addEventListener('animationend', () => root.classList.remove('is-shaking'), { once: true });
}
