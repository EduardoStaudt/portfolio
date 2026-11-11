/**
 * Espada do cursor da contracapa (desenho próprio). A ponta fica no canto superior esquerdo
 * do viewBox (2,2), para coincidir com o ponto do cursor. Cores fixas: ela aparece sempre
 * sobre a contracapa, nos dois temas.
 */
export function SwordGlyph({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 64 64" className={className}>
      {/* lâmina: metade clara, metade sombreada, com o friso no meio */}
      <path
        d="M2 2L10 4.500L43 37.500L37.500 43L4.500 10Z"
        fill="#F5F1E8"
        stroke="#0A0A0A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M2 2L4.500 10L37.500 43L40.250 40.250Z" fill="#B9B3A6" />
      <path d="M5 5L39 39" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M2 2L10 4.500L43 37.500L37.500 43L4.500 10Z"
        fill="none"
        stroke="#0A0A0A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* brilho */}
      <path
        d="M13 9.500L22 18.500M25 21.500L28 24.500"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* guarda curva com ponteiras */}
      <path
        d="M29 50Q35.500 35.500 50 29"
        fill="none"
        stroke="#0A0A0A"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M29 50Q35.500 35.500 50 29"
        fill="none"
        stroke="#D7263D"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M33.500 41.500Q37 37 41.500 33.500" fill="none" stroke="#F28C28" strokeWidth="1.6" />
      <circle cx="29" cy="50" r="3.200" fill="#F28C28" stroke="#0A0A0A" strokeWidth="1.8" />
      <circle cx="50" cy="29" r="3.200" fill="#F28C28" stroke="#0A0A0A" strokeWidth="1.8" />
      {/* cabo enfaixado */}
      <path d="M42 42L54 54" stroke="#0A0A0A" strokeWidth="8.500" strokeLinecap="round" />
      <path d="M42 42L54 54" stroke="#73172D" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M43.500 47.500L47.500 43.500M47 51L51 47M50.500 54.500L54.500 50.500"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* pomo */}
      <path
        d="M57.500 52L63 57.500L57.500 63L52 57.500Z"
        fill="#D7263D"
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M57.500 55.500L59.500 57.500"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
