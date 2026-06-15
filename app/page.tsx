'use client';

import { useState, useRef } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ArchitectureSection } from '@/components/landing/ArchitectureSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { Footer } from '@/components/landing/Footer';
import { InvestigationWorkspace } from '@/components/incident/InvestigationWorkspace';

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const handleRunDemo = () => {
    setShowDemo(true);
    // Scroll to demo after state update
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewArchitecture = () => {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onRunDemo={handleRunDemo} onViewArchitecture={handleViewArchitecture} />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Demo Section */}
      <section id="demo" ref={demoRef} className="relative">
        {showDemo ? (
          <div className="h-screen">
            <InvestigationWorkspace />
          </div>
        ) : (
          <DemoPlaceholder onRunDemo={handleRunDemo} />
        )}
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Architecture Section */}
      <ArchitectureSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function DemoPlaceholder({ onRunDemo }: { onRunDemo: () => void }) {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
          Interactive Investigation Demo
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Watch the AI investigate a production incident in real-time.
          See how it correlates logs, traces, and deployments to identify the root cause.
        </p>
        <button
          onClick={onRunDemo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Launch Interactive Demo
        </button>

        {/* Preview Image Placeholder */}
        <div className="mt-12 rounded-xl border bg-card overflow-hidden shadow-2xl">
          <div className="aspect-[16/9] bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Click to launch the interactive demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
