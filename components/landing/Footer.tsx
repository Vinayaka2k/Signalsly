'use client';

import { Activity, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Signalsly</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="https://github.com/Vinayaka2k/incident-copilot/tree/main" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Documentation</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Vinayaka2k/incident-copilot/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Github className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="https://x.com/VinayakaHe50360"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Twitter className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Your autonomous on-call engineer.
          </h3>
        </div>
      </div>
    </footer>
  );
}
