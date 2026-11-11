import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { palette } from '@/styles/tokens';
import { site } from '@/lib/data/site';

export const alt = `${site.name} · Portfólio ${site.volume}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagem Open Graph gerada no build: capa do volume, com a logo lida de public/logo.svg. */
export default async function OpenGraphImage() {
  const svg = await readFile(join(process.cwd(), 'public', 'logo.svg'));
  const logo = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  const [first, ...rest] = site.name.toUpperCase().split(' ');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: palette.paper,
        color: palette.ink,
        padding: 28,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          border: `10px solid ${palette.ink}`,
          backgroundImage: `radial-gradient(circle at 12px 12px, ${palette.ink}22 4px, transparent 5px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div
          style={{
            width: 70,
            background: palette.ink,
            color: palette.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', transform: 'rotate(90deg)', whiteSpace: 'nowrap' }}>
            {site.volume.toUpperCase()}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '44px 52px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
            PORTFÓLIO · EDIÇÃO DE ESTREIA
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 112,
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: -4,
              }}
            >
              <div style={{ display: 'flex' }}>{first}</div>
              {rest.map((part, i) => (
                <div
                  key={part}
                  style={{
                    display: 'flex',
                    color: i === rest.length - 1 ? palette.red : palette.ink,
                  }}
                >
                  {part}
                </div>
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              width={230}
              height={230}
              alt=""
              style={{
                background: palette.paper,
                border: `8px solid ${palette.ink}`,
                boxShadow: `14px 14px 0 ${palette.ink}`,
                imageRendering: 'pixelated',
              }}
            />
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>
            <div
              style={{
                display: 'flex',
                border: `5px solid ${palette.ink}`,
                padding: '10px 18px',
                background: palette.paper,
              }}
            >
              {site.tagline}
            </div>
            <div
              style={{
                display: 'flex',
                border: `5px solid ${palette.ink}`,
                borderLeft: 'none',
                padding: '10px 18px',
                background: palette.red,
                color: palette.white,
              }}
            >
              {site.focus}
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
