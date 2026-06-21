'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { Tooth } from '@/components/tooth-icon'
import { NAVIGATION_URLS } from '@/config/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavbarProps {
  userId?: string | null
}

export function Navbar({ userId }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = [
    { label: 'Home', href: NAVIGATION_URLS.home },
    { label: 'AI Chatbot', href: NAVIGATION_URLS.chatbot },
    { label: 'Features', href: NAVIGATION_URLS.features },
    { label: 'Benefits', href: NAVIGATION_URLS.benefits },
  ]

  return (
    <nav className="glass sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={NAVIGATION_URLS.home} className="flex items-center gap-2 group">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_2px_10px_rgba(99,102,241,0.2)] group-hover:scale-105 transition-all duration-300">
            <Tooth className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 text-transparent bg-clip-text">
            DentalAI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {!userId ? (
            <>
              <a
                href={NAVIGATION_URLS.signIn}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-250 px-3 py-1.5"
              >
                Sign In
              </a>
              <a
                href={NAVIGATION_URLS.getStarted}
                className="btn-glass text-xs font-semibold px-5 py-2.5 shadow-sm hover:shadow-[0_4px_15px_rgba(99,102,241,0.25)]"
              >
                Get Started
              </a>
            </>
          ) : (
            <>
              <Link
                href={NAVIGATION_URLS.dashboard}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-250 px-3 py-1.5"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors duration-200"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 py-1"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {!userId ? (
                <>
                  <a
                    href={NAVIGATION_URLS.signIn}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-secondary transition"
                  >
                    Sign In
                  </a>
                  <a
                    href={NAVIGATION_URLS.getStarted}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-lg btn-glass text-sm font-bold shadow-sm"
                  >
                    Get Started
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href={NAVIGATION_URLS.dashboard}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-secondary transition"
                  >
                    Go to Dashboard
                  </Link>
                  <div className="flex justify-center py-2 border-t border-border">
                    <UserButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
export default Navbar
