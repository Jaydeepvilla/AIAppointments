import { Chatbot } from '@/components/chatbot'
import { Check, Star, Calendar, Users, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function HomePage() {
  const { userId } = await auth()

  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen">
      <Chatbot />

      {/* Navigation */}
      <nav className="glass sticky top-0 z-30 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">DentalAI</span>
          </div>
          <div className="flex items-center gap-3">
            {!userId ? (
              <>
                <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-glass">
                  Get Started
                </Link>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition mr-2">
                  Dashboard
                </Link>
                <UserButton />
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center">
            <div className="glass px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-650 dark:text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
              AI-Powered Dental Scheduling
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            <span className="gradient-text">Smart Appointment Booking</span>
            <br />
            for Modern Dental Clinics
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Experience the future of dental scheduling. Our intelligent AI assistant works 24/7 to help patients book
            appointments instantly, reducing no-shows and driving clinic efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            {!userId ? (
              <Link href="/sign-up" className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto">
                Start Free Trial
              </Link>
            ) : (
              <Link href="/dashboard" className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto">
                Go to Dashboard
              </Link>
            )}
            <button className="px-8 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary/80 bg-card/45 transition-all duration-200 w-full sm:w-auto">
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 pt-6 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-400" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass p-4 sm:p-6 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl h-80 sm:h-96 flex items-center justify-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="text-center relative z-20 transition-transform duration-500 group-hover:scale-105">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-inner">
                  <Calendar className="w-8 h-8 text-indigo-400" />
                </div>
                 <p className="text-sm font-semibold tracking-tight text-foreground">Interactive Scheduler Preview</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">SaaS Dashboard is ready to compile and launch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">Powerful Capabilities</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything you need to automate scheduling and operate a modern, high-efficiency dental practice.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: 'AI Chatbot',
              description: 'A smart conversational assistant that guides patients through custom booking 24/7.',
            },
            {
              icon: Users,
              title: 'Patient Management',
              description: 'Consolidated patient records with custom notes, appointment logs, and preferences.',
            },
            {
              icon: TrendingUp,
              title: 'Analytics Dashboard',
              description: 'Visual analytics indicating clinic growth, completed status distribution, and revenue trends.',
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Fully secure data storage and role validation layers built for clinical integrity.',
            },
            {
              icon: Check,
              title: 'Automated Reminders',
              description: 'Integrated notification flows designed to minimize customer drop-off and no-shows.',
            },
            {
              icon: Star,
              title: 'Treatment Optimization',
              description: 'Manage multiple services with varying price scales and precise timing segments.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl border border-border hover:border-indigo-500/20 hover:bg-secondary/40 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-3 text-center tracking-tight text-foreground">Request a Demo</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
            See how DentalAI can transform your clinic and supercharge your booking efficiency.
          </p>

          <form className="space-y-5 relative">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input-field w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Clinic Name"
              className="input-field w-full"
            />
            <textarea
              placeholder="Tell us about your clinic..."
              rows={4}
              className="input-field w-full resize-none"
            />
            <button
              type="submit"
              className="w-full btn-glass py-3 text-base font-semibold shadow-lg hover:shadow-indigo-500/20"
            >
              Request Demo
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">Loved by Dental Professionals</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">Trusted by 500+ modern clinics worldwide to run scheduling automation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Sarah Johnson',
              clinic: 'Smile Dental Care',
              text: 'DentalAI reduced our no-shows by 40% in the first month. The AI assistant is incredibly helpful and natural.',
            },
            {
              name: 'Dr. Michael Chen',
              clinic: 'Bright Teeth Clinic',
              text: 'The analytics dashboard gives us clinic insights we never had access to before. High conversion results!',
            },
            {
              name: 'Dr. Emma Wilson',
              clinic: 'Premier Dental Group',
              text: 'Integrating this was extremely simple, and our patients love the instant response. Exceptional utility.',
            },
          ].map((testimonial, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl border border-border relative flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                  ))}
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-6 italic">&quot;{testimonial.text}&quot;</p>
              </div>
              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-semibold text-sm">
                  {testimonial.name.split(' ').pop()?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="glass p-12 rounded-[2rem] text-center relative overflow-hidden shadow-2xl border border-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to Transform Your Clinic?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join hundreds of dental clinics already using DentalAI to streamline their booking
              process and improve patient satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {!userId ? (
                <>
                  <Link href="/sign-up" className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto">
                    Start Your Free Trial
                  </Link>
                  <Link href="/sign-in" className="px-8 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary bg-card/45 transition-all duration-200 w-full sm:w-auto">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-bold">DentalAI</span>
              </div>
              <p className="text-muted-foreground text-sm">Intelligent dental appointment booking.</p>
            </div>
            <div>
              <p className="font-semibold mb-4">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DentalAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
