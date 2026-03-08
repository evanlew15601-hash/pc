'use client'

import Image from 'next/image'
import { useState } from 'react'

export function BrandIcon({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={
          className ??
          'grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-b from-fizz-400 to-pop-500 text-white shadow-fizz'
        }
      >
        pc
      </div>
    )
  }

  return (
    <Image
      src="/brand/pclogo2.png"
      alt="pc"
      width={64}
      height={64}
      onError={() => setFailed(true)}
      className={className ?? 'h-10 w-10'}
    />
  )
}
