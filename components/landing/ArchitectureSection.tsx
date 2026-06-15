'use client';

import { motion } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Search, 
  Zap, 
  GitBranch,
  Server,
  Code2,
} from 'lucide-react';

export function ArchitectureSection() {
  const components = [
    {
      icon: Server,
      title: 'Incident Ingestion',
      description: 'Real-time integration with PagerDuty, Datadog, and custom webhooks',
      tech: ['Webhooks', 'Kafka', 'Redis'],
    },
    {
      icon: Brain,
      title: 'Query Understanding',
      description: 'LLM-powered query rewriting and semantic understanding',
      tech: ['Claude 3.5', 'GPT-4', 'Embeddings'],
    },
    {
      icon: Search,
      title: 'Hybrid Retrieval',
      description: 'Dense vectors + BM25 with RRF fusion for optimal recall',
      tech: ['Pinecone', 'Elasticsearch', 'Cohere Rerank'],
    },
    {
      icon: Database,
      title: 'Knowledge Base',
      description: 'Indexed runbooks, past incidents, deployment history, and metrics',
      tech: ['PostgreSQL', 'Vector DB', 'S3'],
    },
    {
      icon: Zap,
      title: 'Reasoning Engine',
      description: 'Multi-step reasoning with evidence grounding and confidence scoring',
      tech: ['LangGraph', 'Chain-of-Thought', 'Self-Critique'],
    },
    {
      icon: GitBranch,
      title: 'Deploy Correlation',
      description: 'Automatic correlation with recent deployments and config changes',
      tech: ['GitHub', 'ArgoCD', 'Kubernetes'],
    },
    {
      icon: Code2,
      title: 'Triage Generation',
      description: 'Structured incident response with hypotheses, next steps, and evidence',
      tech: ['Claude', 'LangGraph', 'Grounding'],
    },
  ];

  return (
    <section id="architecture" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Built for Production
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Enterprise-grade architecture designed for reliability, scalability, and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {components.map((component, index) => (
            <motion.div
              key={component.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-5 rounded-xl border bg-card hover:bg-accent/50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <component.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{component.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{component.description}</p>
              <div className="flex flex-wrap gap-1">
                {component.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-6 rounded-xl border bg-card"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Investigation Pipeline</h3>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            {[
              'Incident Received',
              'Query Rewrite',
              'Hybrid Retrieval',
              'Reranking',
              'Deploy Correlation',
              'Triage Generation',
            ].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-md bg-muted text-muted-foreground">
                  {stage}
                </span>
                {i < 5 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
