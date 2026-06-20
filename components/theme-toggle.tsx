'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => {
        if (mounted) setTheme(isDark ? 'light' : 'dark')
      }}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-transparent hover:bg-muted/60 text-foreground transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      aria-label="Toggle dark mode"
      suppressHydrationWarning
    >
      {/* Show Moon icon during SSR / before mount so no layout shift */}
      {(!mounted || isDark) ? (
        <Sun
          className="w-[18px] h-[18px] text-amber-400"
          strokeWidth={2}
        />
      ) : (
        <Moon
          className="w-[18px] h-[18px] text-slate-600 dark:text-slate-300"
          strokeWidth={2}
        />
      )}
    </button>
  )
}
