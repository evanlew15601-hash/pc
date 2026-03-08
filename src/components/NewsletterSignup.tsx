'use client'

import { useState } from 'react'

import { cn } from '@/lib/cn'

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  return (
    <form
      className={cn(
        'rounded-bubble border border-white/35 bg-white/45 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        className,
      )}
      onSubmit={async (e) => {
        e.preventDefault()
        const value = email.trim()
        if (!value) return

        setStatus('loading')
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: value }),
        })

        setStatus(res.ok ? 'ok' : 'error')
      }}
    >
      <div className="font-display text-sm font-extrabold tracking-wide text-pop-800 dark:text-fizz-200">
        The fizzy newsletter
      </div>
      <div className="mt-1 text-sm text-black/70 dark:text-white/70">
        One thoughtful pop culture dispatch when there’s something worth studying.
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@domain.com"
          className="h-11 flex-1 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
        />
        <button
          type="submit"
          className="h-11 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-4 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 disabled:opacity-60 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
          disabled={status === 'loading'}
        >
          Join
        </button>
      </div>
      {status === 'ok' ? (
        <div className="mt-3 text-sm font-semibold text-pop-800 dark:text-fizz-200">You’re in.</div>
      ) : null}
      {status === 'error' ? (
        <div className="mt-3 text-sm font-semibold text-red-600 dark:text-red-300">
          Something fizzled. Try again.
        </div>
      ) : null}
    </form>
  )
}
