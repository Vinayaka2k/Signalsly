'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowDown, Play, Code2, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onRunDemo: () => void;
  onViewArchitecture: () => void;
}

export function HeroSection({ onRunDemo, onViewArchitecture }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Grid */}
      <GridBackground />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Signalsly</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="https://github.com/Vinayaka2k/incident-copilot/tree/main" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-medium text-primary">AI-Powered Incident Response</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            Your autonomous{' '}
            <span className="text-primary">on-call engineer</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
            When production breaks at 2 AM, Signalsly investigates logs and traces,
            identifies the root cause, validates a fix, and prepares a response before the team wakes up.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onRunDemo}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              Run Live Demo
            </button>
            <button
              onClick={onViewArchitecture}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border bg-card hover:bg-accent transition-colors text-sm font-medium"
            >
              <Code2 className="w-4 h-4" />
              View Architecture
            </button>
          </div>
        </motion.div>

        {/* Live Ticker */}
        <LiveIncidentTicker />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs">Scroll to explore</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.25_0.02_250)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.25_0.02_250)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
    </div>
  );
}

function LiveIncidentTicker() {
  const [events, setEvents] = useState<{ id: number; text: string; type: 'alert' | 'resolve' | 'log' }[]>([]);

  useEffect(() => {
    const baseEvents = [
      { text: 'PagerDuty: High latency detected on api-gateway', type: 'alert' as const },
      { text: 'Investigating: Analyzing deployment correlation...', type: 'log' as const },
      { text: 'INC-4519 resolved: User API latency normalized', type: 'resolve' as const },
      { text: 'Datadog: Error spike on payment-service', type: 'alert' as const },
      { text: 'Retrieval: Searching 12,847 similar incidents...', type: 'log' as const },
      { text: 'INC-4518 resolved: SSL certificate renewed', type: 'resolve' as const },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const event = baseEvents[index % baseEvents.length];
      setEvents(prev => [...prev.slice(-4), { id: Date.now(), ...event }]);
      index++;
    }, 3000);

    // Add initial event
    setEvents([{ id: Date.now(), ...baseEvents[0] }]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-lg border bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
          <Terminal className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-mono text-muted-foreground">live-feed</span>
        </div>
        <div className="p-3 h-[120px] overflow-hidden">
          <div className="space-y-1.5">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i === events.length - 1 ? 1 : 0.5, x: 0 }}
                className="flex items-center gap-2 text-[11px] font-mono"
              >
                <span className="text-muted-foreground">
                  {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                {event.type === 'alert' && <AlertTriangle className="w-3 h-3 text-warning" />}
                {event.type === 'resolve' && <CheckCircle className="w-3 h-3 text-success" />}
                {event.type === 'log' && <Activity className="w-3 h-3 text-info" />}
                <span className={
                  event.type === 'alert' ? 'text-warning' :
                  event.type === 'resolve' ? 'text-success' :
                  'text-muted-foreground'
                }>
                  {event.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
