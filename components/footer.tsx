import Link from 'next/link'
import { Tooth } from '@/components/tooth-icon'
import { NAVIGATION_URLS } from '@/config/navigation'

export function Footer() {
  return (
    <footer className="glass border-t border-border mt-20 relative bg-background/40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Tooth className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">DentalAI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Intelligent dental scheduling. Automate appointments, patient management, and growth insights 24/7.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <p className="font-bold text-sm text-foreground tracking-wide uppercase mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={NAVIGATION_URLS.features} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Features
                </Link>
              </li>
              <li>
                <Link href={NAVIGATION_URLS.chatbot} className="text-muted-foreground hover:text-foreground transition duration-150">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link href={NAVIGATION_URLS.benefits} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="font-bold text-sm text-foreground tracking-wide uppercase mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  About
                </a>
              </li>
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Contact Us
                </a>
              </li>
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <p className="font-bold text-sm text-foreground tracking-wide uppercase mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href={NAVIGATION_URLS.getStarted} className="text-muted-foreground hover:text-foreground transition duration-150">
                  Cookie Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DentalAI by Nexx Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by 
            <a href="https://nexxtechnologies.com" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
              Nexx Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
