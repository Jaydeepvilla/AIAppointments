export const NAVIGATION_URLS = {
  // Funnel/Marketing redirects
  getStarted: 'https://nexxtechnologies.com/contact-us',
  startFreeTrial: 'https://nexxtechnologies.com/contact-us',
  startYourFreeTrial: 'https://nexxtechnologies.com/contact-us',
  watchDemo: 'https://apps.nexxtechnologies.com',
  signIn: 'https://apps.nexxtechnologies.com/sign-in',

  // Local/Internal application links
  home: '/',
  chatbot: '/chatbot',
  dashboard: '/dashboard',
  features: '/#features',
  benefits: '/#benefits',
  pricing: '/#pricing',
} as const

export type NavigationUrls = typeof NAVIGATION_URLS
