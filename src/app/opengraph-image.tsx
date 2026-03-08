import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

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
          justifyContent: 'center',
          padding: 80,
          background:
            'radial-gradient(900px circle at 10% 20%, rgba(255,31,240,.35), transparent 60%), radial-gradient(900px circle at 80% 20%, rgba(109,45,255,.35), transparent 60%), linear-gradient(180deg, #fff7ff 0%, #f7f3ff 45%, #ffffff 100%)',
          color: '#0b0620',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 6, opacity: 0.7 }}>
          POP CULTURE ANALYSIS
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -2,
            textTransform: 'lowercase',
          }}
        >
          popcology
        </div>
        <div style={{ marginTop: 18, fontSize: 32, fontWeight: 700, opacity: 0.8 }}>
          Pop culture worth studying.
        </div>
        <div
          style={{
            marginTop: 34,
            display: 'flex',
            gap: 14,
          }}
        >
          {['retrospectives', 'analysis', 'reviews', 'essays', 'lists'].map((t) => (
            <div
              key={t}
              style={{
                padding: '10px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(0,0,0,0.08)',
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
