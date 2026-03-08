'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/cn'

export function BrandWordmark({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <Link href="/" className={cn('inline-flex items-center gap-3', className)}>
      {!failed ? (
        <Image
          src="/brand/popcology.png"
          alt="popcology"
          width={240}
          height={72}
          priority
          onError={() => setFailed(true)}
          className="h-10 w-auto drop-shadow-[0_16px_30px_rgba(255,31,240,0.25)]"
        />
      ) : (
        <span className="font-display text-3xl font-black lowercase tracking-tight">
          <span className="bg-gradient-to-r from-fizz-500 via-pop-500 to-fizz-400 bg-clip-text text-transparent">
            popcology
          </span>
        </span>
      )}
    </Link>
  )
}
