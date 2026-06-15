'use client';

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Coffee, Search, Lightbulb, BookOpen, FileText, MessageSquare, FolderSearch } from 'lucide-react';

export function ComparisonSection() {
  const withoutCopilot = [
    { time: '2:14 AM', icon: AlertTriangle, label: 'PagerDuty wakes you up', color: 'text-destructive' },
    { time: '2:30 AM', icon: Coffee, label: 'Coffee, login to 5 different dashboards', color: 'text-muted-foreground' },
    { time: '2:45 AM', icon: FolderSearch, label: 'Digging through internal runbooks...', color: 'text-muted-foreground' },
    { time: '3:15 AM', icon: MessageSquare, label: 'Searching Slack threads for similar issues', color: 'text-muted-foreground' },
    { time: '3:45 AM', icon: FileText, label: 'Reading past incident reports', color: 'text-muted-foreground' },
    { time: '4:30 AM', icon: Search, label: 'Still grepping through logs manually', color: 'text-muted-foreground' },
    { time: '5:30 AM', icon: Lightbulb, label: 'Root cause finally identified', color: 'text-chart-4' },
    { time: '7:00 AM', icon: Clock, label: 'Exhausted, drafting the postmortem', color: 'text-muted-foreground' },
  ];

  const withCopilot = [
    { time: '2:14 AM', icon: AlertTriangle, label: 'PagerDuty alert triggers incident-copilot', color: 'text-primary' },
    { time: '2:15 AM', icon: Search, label: 'RAG pipeline searches runbooks & past incidents', color: 'text-primary' },
    { time: '2:16 AM', icon: BookOpen, label: 'Relevant context retrieved and reranked', color: 'text-primary' },
    { time: '2:17 AM', icon: Lightbulb, label: 'Hypotheses generated with evidence', color: 'text-chart-1' },
    { time: '7:00 AM', icon: Coffee, label: 'Wake up refreshed, review the triage', color: 'text-chart-1' },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Before & After
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            See how incident-copilot transforms your on-call experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Copilot */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border bg-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <h3 className="text-lg font-semibold text-foreground">Without incident-copilot</h3>
            </div>
            <div className="space-y-4 flex-1">
              {withoutCopilot.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                    {step.time}
                  </span>
                  <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${step.color === 'text-destructive' ? 'bg-destructive/10' : step.color === 'text-chart-4' ? 'bg-chart-4/10' : 'bg-muted'}`}>
                    <step.icon className={`w-3 h-3 ${step.color}`} />
                  </div>
                  <span className="text-sm text-foreground">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time to RCA</span>
                <span className="font-semibold text-destructive">~5 hours</span>
              </div>
            </div>
          </motion.div>

          {/* With Copilot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-primary/30 bg-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold text-foreground">With incident-copilot</h3>
            </div>
            <div className="space-y-8 flex-1 py-4">
              {withCopilot.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                    {step.time}
                  </span>
                  <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${step.color === 'text-chart-1' ? 'bg-chart-1/10' : 'bg-primary/10'}`}>
                    <step.icon className={`w-3 h-3 ${step.color}`} />
                  </div>
                  <span className="text-sm text-foreground">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time to RCA</span>
                <span className="font-semibold text-chart-1">~4 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
