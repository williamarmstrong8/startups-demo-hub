import { ImageResponse } from 'next/og'

export const alt = 'Startups Demo Hub'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#0a0a0a',
          // Matches the near-white accent the docs theme derives in dark mode.
          color: '#ffffff'
        }}
      >
        {/* The same mark as app/icon.svg, inverted so it reads on the dark canvas. */}
        <svg width="88" height="88" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill="#ffffff" />
          <path
            d="M9 23V9h2.6l8.8 10.4V9H23v14h-2.6L11.6 12.6V23H9z"
            fill="#0a0a0a"
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              letterSpacing: '-0.03em'
            }}
          >
            Startups Demo Hub
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              color: '#a1a1a1',
              maxWidth: 900
            }}
          >
            Recorded end-to-end build sessions, each paired with a step-by-step
            build guide.
          </div>
        </div>
      </div>
    ),
    size
  )
}
