import { NAVIGATION_URLS } from './navigation'

export interface CtaButton {
  label: string
  href: string
  isExternal: boolean
}

export const CTA_CONFIG = {
  getStarted: {
    label: 'Get Started',
    href: NAVIGATION_URLS.getStarted,
    isExternal: true,
  },
  startFreeTrial: {
    label: 'Start Free Trial',
    href: NAVIGATION_URLS.startFreeTrial,
    isExternal: true,
  },
  startYourFreeTrial: {
    label: 'Start Your Free Trial',
    href: NAVIGATION_URLS.startYourFreeTrial,
    isExternal: true,
  },
  watchDemo: {
    label: 'Watch Demo',
    href: NAVIGATION_URLS.watchDemo,
    isExternal: true,
  },
  signIn: {
    label: 'Sign In',
    href: NAVIGATION_URLS.signIn,
    isExternal: true,
  },
  bookConsultation: {
    label: 'Book Free Consultation',
    href: NAVIGATION_URLS.getStarted,
    isExternal: true,
  },
} as const

export type CtaConfig = typeof CTA_CONFIG
