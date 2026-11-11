/** Tema: tipos, padrão e o script de inicialização. Sem 'use client': o layout (servidor) lê daqui. */

export type InkMode = 'bw' | 'color';
export type PageMode = 'light' | 'dark';
export type Theme = { ink: InkMode; page: PageMode };

/** Tema de quem ainda não escolheu: página escura, modo colorido. */
export const DEFAULT_THEME: Theme = { ink: 'color', page: 'dark' };

export const THEME_KEYS = { ink: 'eas:ink', page: 'eas:page' } as const;

/** Script inline: aplica a escolha salva antes da primeira pintura (sem flash). */
export const themeInitScript = `(function(){try{var d=document.documentElement;var i=localStorage.getItem('${THEME_KEYS.ink}');if(i==='color'||i==='bw')d.dataset.ink=i;var p=localStorage.getItem('${THEME_KEYS.page}');if(p==='light'||p==='dark')d.dataset.page=p;if(sessionStorage.getItem('eas:loaded'))d.dataset.skipLoader='1';else sessionStorage.setItem('eas:loaded','1');}catch(e){}})();`;
