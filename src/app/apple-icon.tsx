import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2d5a27',
          borderRadius: 40,
        }}
      >
        <svg width="108" height="108" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z" fill="#7ec97a" />
          <path d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z" fill="white" />
          <path d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z" fill="#7ec97a" />
          <rect x="5" y="28.5" width="22" height="1.5" rx="0.75" fill="white" opacity="0.4" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
