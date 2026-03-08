'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'group relative inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/40 px-3 py-2 text-sm font-semibold text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
        className,
      )}
      aria-label="Toggle theme"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-b from-fizz-200 to-pop-200 text-pop-800 shadow-[0_10px_20px_rgba(109,45,255,0.25)] dark:from-pop-500 dark:to-fizz-500 dark:text-white">
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Night' : 'Day'}</span>
    </button>
  )
}
