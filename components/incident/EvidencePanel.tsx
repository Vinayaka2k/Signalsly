'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  GitBranch, 
  FileText,
  Clock,
  CheckCircle,
  X,
  Database,
  Search,
  ListFilter,
} from 'lucide-react';
import type { BlastRadius, Incident } from '@/services/mockInvestigationEngine';
import type { RetrievalViewType, RetrievalResults } from './InvestigationWorkspace';

interface RelatedIncident {
  id: string;
  similarity: number;
  summary: string;
  resolved: boolean;
}

interface EvidencePanelProps {
  blastRadius: BlastRadius;
  relatedIncidents: RelatedIncident[];
  correlatedDeploy?: Incident['correlatedDeploy'];
  isRunning: boolean;
  retrievalView?: RetrievalViewType;
  retrievalResults?: RetrievalResults;
  onClearRetrievalView?: () => void;
}

const RETRIEVAL_TITLES: Record<NonNullable<RetrievalViewType>, { title: string; description: string; icon: typeof Database }> = {
  dense: { title: 'Dense Vector Search Results', description: 'Semantic search using Cohere embeddings', icon: Database },
  bm25: { title: 'BM25 Keyword Search Results', description: 'Elasticsearch keyword matching', icon: Search },
  rerank: { title: 'Reranked Results', description: 'Cross-encoder reranking with Cohere Rerank v3', icon: ListFilter },
};

export function EvidencePanel({ 
  blastRadius, 
  relatedIncidents, 
  correlatedDeploy,
  retrievalView,
  retrievalResults,
  onClearRetrievalView,
}: EvidencePanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden border-b border-border">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground">Evidence</h3>
        <p className="text-xs text-muted-foreground">Context gathered during investigation</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {retrievalView && retrievalResults ? (
            <RetrievalResultsView 
              key="retrieval"
              type={retrievalView} 
              results={retrievalResults[retrievalView] || []}
              onClose={onClearRetrievalView}
            />
          ) : (
            <motion.div
              key="evidence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Blast Radius */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Blast Radius</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Affected Users</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {blastRadius.affectedUsers.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Error Rate</span>
                    </div>
                    <span className="text-sm font-semibold text-destructive">
                      {blastRadius.errorRate}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <span className="text-[10px] text-muted-foreground">Impacted Services:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blastRadius.impactedServices.map((service) => (
                      <span 
                        key={service}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Correlated Deploy */}
              {correlatedDeploy && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-chart-2/10 flex items-center justify-center">
                      <GitBranch className="w-3 h-3 text-chart-2" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Correlated Deploy</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Service</span>
                      <span className="text-xs font-medium text-foreground">{correlatedDeploy.service}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Version</span>
                      <span className="text-xs font-mono text-foreground">{correlatedDeploy.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Deployed</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round((Date.now() - correlatedDeploy.deployedAt.getTime()) / 60000)}m ago
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Related Incidents */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-chart-3/10 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-chart-3" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Similar Incidents</span>
                </div>
                
                <div className="space-y-2">
                  {relatedIncidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className="p-2 rounded bg-muted/50 flex items-start gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-foreground">{incident.id}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded font-medium",
                            incident.similarity >= 90 
                              ? "bg-chart-1/10 text-chart-1" 
                              : incident.similarity >= 80 
                                ? "bg-chart-2/10 text-chart-2"
                                : "bg-muted text-muted-foreground"
                          )}>
                            {incident.similarity}% match
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {incident.summary}
                        </p>
                      </div>
                      {incident.resolved && (
                        <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RetrievalResultsView({ 
  type, 
  results, 
  onClose,
}: { 
  type: NonNullable<RetrievalViewType>; 
  results: Array<{ id: string; score: number; content: string; source: string }>;
  onClose?: () => void;
}) {
  const config = RETRIEVAL_TITLES[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <Icon className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-foreground">{config.title}</h4>
            <p className="text-[10px] text-muted-foreground">{config.description}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border bg-card p-2.5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-muted-foreground">{result.source}</span>
              <span className={cn(
                "px-1.5 py-0.5 text-[10px] rounded font-medium",
                result.score >= 0.9 
                  ? "bg-chart-1/10 text-chart-1" 
                  : result.score >= 0.8 
                    ? "bg-chart-2/10 text-chart-2"
                    : "bg-muted text-muted-foreground"
              )}>
                {(result.score * 100).toFixed(0)}% relevance
              </span>
            </div>
            <p className="text-[11px] text-foreground leading-relaxed">
              {result.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Back button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full text-center text-xs text-primary hover:text-primary/80 hover:underline py-2"
        >
          &larr; Back to evidence
        </button>
      )}
    </motion.div>
  );
}
