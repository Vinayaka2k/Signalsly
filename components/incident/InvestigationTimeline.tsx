'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Brain, 
  Search, 
  Link, 
  Lightbulb, 
  Wrench, 
  CheckCircle, 
  Flag,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import type { TimelineEvent, InvestigationStage } from '@/services/mockInvestigationEngine';
import type { RetrievalViewType } from './InvestigationWorkspace';

interface InvestigationTimelineProps {
  events: TimelineEvent[];
  stage: InvestigationStage;
  isRunning: boolean;
  currentEventId: string | null;
  onShowMore?: (type: RetrievalViewType) => void;
}

const iconMap: Record<string, typeof Bell> = {
  bell: Bell,
  brain: Brain,
  search: Search,
  link: Link,
  lightbulb: Lightbulb,
  wrench: Wrench,
  'check-circle': CheckCircle,
  flag: Flag,
};

const stageLabels: Record<InvestigationStage, string> = {
  idle: 'Ready',
  receiving_incident: 'Receiving incident...',
  classifying: 'Classifying incident...',
  query_rewriting: 'Optimizing search queries...',
  retrieving_dense: 'Running dense vector search...',
  retrieving_bm25: 'Running keyword search...',
  fusing_results: 'Fusing search results...',
  reranking: 'Reranking results...',
  analyzing: 'Analyzing evidence...',
  correlating_deploys: 'Correlating deployments...',
  matching_incidents: 'Matching similar incidents...',
  generating_hypothesis: 'Generating root cause...',
  generating_fix: 'Generating suggested fix...',
  validating: 'Running validation checks...',
  completed: 'Investigation complete',
};

// Map event titles to retrieval types for "Show more" links
const RETRIEVAL_EVENTS: Record<string, RetrievalViewType> = {
  'Hybrid Retrieval': 'dense',
  'Reranking Results': 'rerank',
};

export function InvestigationTimeline({ events, stage, isRunning, currentEventId, onShowMore }: InvestigationTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && currentEventId) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentEventId]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Investigation Timeline</h2>
        {isRunning && (
          <ProcessingIndicator label={stageLabels[stage]} />
        )}
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        {events.length === 0 && !isRunning ? (
          <EmptyState />
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {events.map((event, index) => (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  isLast={index === events.length - 1}
                  isCurrent={event.id === currentEventId}
                  onShowMore={onShowMore}
                />
              ))}
            </AnimatePresence>
            {isRunning && <ProcessingStep stage={stage} />}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineEventCard({ 
  event, 
  isLast, 
  isCurrent,
  onShowMore,
}: { 
  event: TimelineEvent; 
  isLast: boolean; 
  isCurrent: boolean;
  onShowMore?: (type: RetrievalViewType) => void;
}) {
  const Icon = iconMap[event.icon] || Bell;
  const typeColors: Record<TimelineEvent['type'], string> = {
    incident: 'bg-severity-p1/20 text-severity-p1 border-severity-p1/30',
    analysis: 'bg-info/20 text-info border-info/30',
    retrieval: 'bg-primary/20 text-primary border-primary/30',
    correlation: 'bg-warning/20 text-warning border-warning/30',
    hypothesis: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
    fix: 'bg-success/20 text-success border-success/30',
    validation: 'bg-success/20 text-success border-success/30',
    complete: 'bg-primary/20 text-primary border-primary/30',
  };

  // Check if this event should have "Show more" links
  const retrievalType = RETRIEVAL_EVENTS[event.title];
  const hasShowMore = event.type === 'retrieval' && retrievalType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative pl-8', !isLast && 'pb-4')}
    >
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[13px] top-8 bottom-0 w-px bg-border" />
      )}

      {/* Icon */}
      <div className={cn(
        'absolute left-0 top-1 w-7 h-7 rounded-full border flex items-center justify-center',
        typeColors[event.type]
      )}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Content */}
      <div className={cn(
        'rounded-lg border bg-card p-3 transition-all',
        isCurrent && 'ring-1 ring-primary/50'
      )}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-medium text-foreground">{event.title}</h3>
          <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
            {formatTimestamp(event.timestamp)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
        
        {event.confidence && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${event.confidence}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <span className="text-[10px] font-medium text-primary">{event.confidence}%</span>
          </div>
        )}

        {event.details && event.details.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <ul className="space-y-1">
              {event.details.map((detail, i) => {
                // Check if this detail mentions dense/BM25 search for inline "show more"
                const isDenseDetail = detail.toLowerCase().includes('dense');
                const isBM25Detail = detail.toLowerCase().includes('bm25');
                
                return (
                  <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-1">•</span>
                    <span className="flex-1">{detail}</span>
                    {hasShowMore && isDenseDetail && onShowMore && (
                      <button
                        onClick={() => onShowMore('dense')}
                        className="text-primary hover:text-primary/80 hover:underline flex items-center gap-0.5 flex-shrink-0"
                      >
                        <span>show more</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {hasShowMore && isBM25Detail && onShowMore && (
                      <button
                        onClick={() => onShowMore('bm25')}
                        className="text-primary hover:text-primary/80 hover:underline flex items-center gap-0.5 flex-shrink-0"
                      >
                        <span>show more</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            
            {/* Show more button for reranking results */}
            {hasShowMore && retrievalType === 'rerank' && onShowMore && (
              <button
                onClick={() => onShowMore('rerank')}
                className="flex items-center gap-1 mt-2 text-[10px] text-primary hover:text-primary/80 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View reranked results
              </button>
            )}
          </div>
        )}

        {event.expandable && (
          <button className="flex items-center gap-1 mt-2 text-[10px] text-primary hover:underline">
            <ChevronDown className="w-3 h-3" />
            View details
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ProcessingStep({ stage }: { stage: InvestigationStage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative pl-8 py-2"
    >
      <div className="absolute left-0 top-3 w-7 h-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <LoadingDots />
          <span className="text-xs text-primary">{stageLabels[stage]}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10">
      <LoadingDots />
      <span className="text-xs text-primary">{label}</span>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">No Active Investigation</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Click &quot;Run Simulation&quot; to start an AI-powered incident investigation
      </p>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
