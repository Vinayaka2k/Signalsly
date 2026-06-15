'use client';

import { motion } from 'framer-motion';
import { Search, Lightbulb, BookOpen } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Investigate',
      description: 'When an incident triggers, Signalsly automatically analyzes logs, traces, metrics, and deployment history to understand what went wrong.',
      details: [
        'Correlates recent deployments with error patterns',
        'Searches indexed runbooks and past incidents',
        'Uses hybrid retrieval (dense + BM25) for optimal recall',
        'Reranks results for relevance to current incident',
      ],
    },
    {
      number: 2,
      icon: Lightbulb,
      title: 'Identify',
      description: 'Using multi-step reasoning and evidence grounding, Signalsly generates a root cause hypothesis with confidence scoring.',
      details: [
        'Chain-of-thought reasoning through evidence',
        'Cross-references similar past incidents',
        'Validates hypothesis against deployment timeline',
        'Provides confidence scores and reasoning chain',
      ],
    },
    {
      number: 3,
      icon: BookOpen,
      title: 'Suggest',
      description: 'Based on the identified root cause, Signalsly suggests relevant runbooks, remediation steps, and a potential fix based on your codebase patterns.',
      details: [
        'Retrieves relevant runbooks and documentation',
        'Suggests remediation steps based on past resolutions',
        'Generates fix suggestion following your coding standards',
        'Includes proper error handling and context',
      ],
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Signalsly automates investigation and provides actionable insights for your review.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="rounded-xl border bg-card p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-muted-foreground">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
