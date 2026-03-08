import Image from 'next/image'
import Link from 'next/link'

import { BrandIcon } from '@/components/BrandIcon'

export const metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="glass-card overflow-hidden">
        <div className="relative p-8">
          <div className="absolute inset-0 opacity-60">
            <Image
              src="/brand/pclogobg.png"
              alt=""
              fill
              className="object-cover opacity-40"
            />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3">
              <BrandIcon className="h-12 w-12" />
              <div className="font-display text-sm font-black tracking-widest text-black/70 dark:text-white/70">
                popcology
              </div>
            </div>

            <h1 className="mt-5 font-display text-4xl font-black lowercase text-black/95 dark:text-white">
              Entertainment, studied like an ecosystem.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-black/75 dark:text-white/75">
              Popcology is a pop culture analysis magazine: retrospectives, media criticism, reviews, and
              cultural essays. We treat pop culture like it has an inner logic — psychology, history,
              aesthetics, business, and fandom all colliding at once.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/author/evan-lewis"
                className="rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 py-3 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
              >
                About the writer
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-white/30 bg-white/40 px-5 py-3 text-sm font-black tracking-wide text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                Editor login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="glass-card p-8">
        <div className="relative">
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Editorial mission
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm font-semibold leading-relaxed text-black/75 dark:text-white/75 lg:grid-cols-2">
            <div className="rounded-bubble border border-white/30 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                Voice
              </div>
              <div className="mt-2">
                Smart, analytical, curious, culturally aware — accessible without being shallow.
              </div>
            </div>
            <div className="rounded-bubble border border-white/30 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                Coverage
              </div>
              <div className="mt-2">
                Film studies energy meets internet culture writing and long-form magazine journalism.
              </div>
            </div>
            <div className="rounded-bubble border border-white/30 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                Promise
              </div>
              <div className="mt-2">
                Pop culture is treated as a cultural ecosystem — not content slurry.
              </div>
            </div>
            <div className="rounded-bubble border border-white/30 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                Aesthetic
              </div>
              <div className="mt-2">
                Glossy Y2K “fizzy pop” UI: bubble shapes, liquid gradients, playful futurism.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
