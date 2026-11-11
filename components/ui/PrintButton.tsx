'use client';

/** Abre o diálogo de impressão do navegador (de onde também se salva em PDF). */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-display bg-accent text-on-accent shadow-bubble hover:bg-ink hover:text-paper flex items-center gap-2 border-[3px] border-(--ink) px-4 py-2.5 text-sm transition-colors"
    >
      <svg aria-hidden width="18" height="18" viewBox="0 0 18 18">
        <path
          d="M5 6V1.500h8V6M5 13H2V6h14v7h-3M5 10.500h8v6H5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
