import { ImageResponse } from 'next/og'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 18,
          background:
            'linear-gradient(180deg, rgba(255,31,240,1) 0%, rgba(109,45,255,1) 100%)',
          boxShadow: '0 16px 30px rgba(255,31,240,.25)',
          color: 'white',
          fontSize: 28,
          fontWeight: 900,
          fontFamily: 'system-ui',
          letterSpacing: -1,
        }}
      >
        pc
      </div>
    ),
    {
      ...size,
    },
  )
}
