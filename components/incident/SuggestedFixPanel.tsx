'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileCode, 
  Sparkles,
  Target,
  BookOpen,
} from 'lucide-react';
import type { SuggestedFix, InvestigationStage } from '@/services/mockInvestigationEngine';

interface SuggestedFixPanelProps {
  fix: SuggestedFix | null;
  stage: InvestigationStage;
  isRunning: boolean;
}

export function SuggestedFixPanel({ fix, stage, isRunning }: SuggestedFixPanelProps) {
  const showContent = fix && (stage === 'completed' || stage === 'generating_fix' || stage === 'validating');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground">Suggested Resolution</h3>
        <p className="text-xs text-muted-foreground">AI-generated hypothesis and fix recommendation</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {!showContent ? (
          <WaitingState stage={stage} isRunning={isRunning} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Root Cause */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-chart-4/10 flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-chart-4" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Root Cause</span>
                </div>
                <span className={cn(
                  "px-1.5 py-0.5 text-[10px] rounded font-medium",
                  fix.confidence >= 80 
                    ? "bg-chart-1/10 text-chart-1" 
                    : fix.confidence >= 60 
                      ? "bg-chart-2/10 text-chart-2"
                      : "bg-chart-3/10 text-chart-3"
                )}>
                  {fix.confidence}% confident
                </span>
              </div>
              
              <p className="text-sm text-foreground font-medium mb-2">{fix.summary}</p>
              <p className="text-xs text-muted-foreground">{fix.rootCause}</p>
            </div>

            {/* Reasoning */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">Evidence & Reasoning</span>
              </div>
              
              <ul className="space-y-1.5">
                {fix.reasoning.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Validation Status */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-chart-1/10 flex items-center justify-center">
                  <Target className="w-3 h-3 text-chart-1" />
                </div>
                <span className="text-xs font-medium text-foreground">Validation Signals</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <ValidationItem 
                  label="Unit Tests" 
                  status={fix.validation.unitTests} 
                />
                <ValidationItem 
                  label="Reproduced" 
                  status={fix.validation.reproduced} 
                />
                <ValidationItem 
                  label="Schema Check" 
                  status={fix.validation.schemaCheck} 
                />
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
                  {fix.validation.rollbackAvailable ? (
                    <CheckCircle className="w-3 h-3 text-chart-1" />
                  ) : (
                    <XCircle className="w-3 h-3 text-destructive" />
                  )}
                  <span className="text-[10px] text-muted-foreground">Rollback Ready</span>
                </div>
              </div>
            </div>

            {/* Code Patch Preview */}
            {fix.patch && (
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <FileCode className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Suggested Fix</span>
                </div>
                
                <div className="rounded bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground mb-1 font-mono">
                    {fix.patch.filename}
                  </p>
                  <pre className="text-[10px] font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                    {fix.patch.diff}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function WaitingState({ stage, isRunning }: { stage: InvestigationStage; isRunning: boolean }) {
  if (!isRunning && stage === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Target className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">Ready to Investigate</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Run an investigation to see AI-generated root cause analysis and fix suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">Analyzing Incident</h3>
      <p className="text-xs text-muted-foreground">
        {getStageMessage(stage)}
      </p>
    </div>
  );
}

function getStageMessage(stage: InvestigationStage): string {
  const messages: Partial<Record<InvestigationStage, string>> = {
    receiving_incident: 'Receiving incident details...',
    classifying: 'Classifying incident type...',
    query_rewriting: 'Optimizing search queries...',
    retrieving_dense: 'Searching knowledge base...',
    retrieving_bm25: 'Running keyword search...',
    fusing_results: 'Combining search results...',
    reranking: 'Reranking for relevance...',
    analyzing: 'Analyzing evidence...',
    correlating_deploys: 'Correlating deployments...',
    matching_incidents: 'Finding similar incidents...',
    generating_hypothesis: 'Generating root cause hypothesis...',
    generating_fix: 'Generating fix suggestion...',
    validating: 'Validating fix...',
  };
  return messages[stage] || 'Processing...';
}

function ValidationItem({ label, status }: { label: string; status: 'pending' | 'passed' | 'failed' }) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
      {status === 'passed' ? (
        <CheckCircle className="w-3 h-3 text-chart-1" />
      ) : status === 'failed' ? (
        <XCircle className="w-3 h-3 text-destructive" />
      ) : (
        <Clock className="w-3 h-3 text-muted-foreground" />
      )}
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
