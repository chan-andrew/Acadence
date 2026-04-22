import { MessageSquare, BarChart3, Zap } from "lucide-react";
import { AnimatedPreview } from "@/components/landing/AnimatedPreview";
import { SignInCTA } from "@/components/landing/SignInCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary tracking-tight">
            Acadence
          </span>
          <SignInCTA variant="nav" label="Open app" />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
          Schedule smarter.
        </h1>
        <p className="mt-4 text-lg text-secondary max-w-xl mx-auto leading-relaxed">
          AI-powered course scheduling that understands what you need.
          Describe your ideal schedule in plain English.
        </p>
        <SignInCTA variant="hero" label="Get started" />
      </section>

      {/* Animated Preview */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <AnimatedPreview />
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-primary text-sm">Talk to it</h3>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
              Describe what you want in plain English. No more clicking through
              dozens of filters.
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-primary text-sm">
              See everything
            </h3>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
              Professor ratings, seat counts, and conflict detection — all at a
              glance.
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-primary text-sm">
              Build faster
            </h3>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
              Add courses to your calendar instantly. No more tab juggling between
              systems.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-tertiary">Acadence</span>
          <div className="flex items-center gap-4">
            <SignInCTA variant="footer" label="Dashboard" />
          </div>
        </div>
      </footer>
    </div>
  );
}
