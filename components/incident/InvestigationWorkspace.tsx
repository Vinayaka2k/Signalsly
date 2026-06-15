'use client';

import { useState } from 'react';
import { useInvestigation } from '@/hooks/use-investigation';
import { Sidebar } from './Sidebar';
import { IncidentHeader } from './IncidentHeader';
import { InvestigationTimeline } from './InvestigationTimeline';
import { EvidencePanel } from './EvidencePanel';
import { SuggestedFixPanel } from './SuggestedFixPanel';
import { ScenarioSelector } from './ScenarioSelector';

export type RetrievalViewType = 'dense' | 'bm25' | 'rerank' | null;

export interface RetrievalResults {
  dense: Array<{ id: string; score: number; content: string; source: string }>;
  bm25: Array<{ id: string; score: number; content: string; source: string }>;
  rerank: Array<{ id: string; score: number; content: string; source: string }>;
}

// Mock retrieval results data
const RETRIEVAL_RESULTS: RetrievalResults = {
  dense: [
    { id: 'doc-1', score: 0.94, content: 'NullPointerException in promo validation when session is null', source: 'INC-1188 postmortem' },
    { id: 'doc-2', score: 0.89, content: 'Checkout flow crashes for guest users without active session', source: 'runbook-checkout-v2' },
    { id: 'doc-3', score: 0.85, content: 'Session validation bypass for promo codes in edge cases', source: 'INC-892 notes' },
    { id: 'doc-4', score: 0.82, content: 'Payment processing fails when user context is missing', source: 'runbook-payments' },
    { id: 'doc-5', score: 0.78, content: 'Error handling for null session in checkout-svc', source: 'code-review-2024' },
  ],
  bm25: [
    { id: 'doc-6', score: 0.91, content: 'checkout-svc 500 error on /api/v2/checkout endpoint', source: 'datadog-logs' },
    { id: 'doc-7', score: 0.88, content: 'Promo validation error: "Cannot read property of null"', source: 'sentry-issues' },
    { id: 'doc-8', score: 0.84, content: 'Null pointer in validator.go line 142 during promotion apply', source: 'stack-traces' },
    { id: 'doc-9', score: 0.79, content: 'Guest checkout failing after v2.14.0 deployment', source: 'slack-oncall' },
    { id: 'doc-10', score: 0.75, content: 'Error spike correlated with promo feature release', source: 'grafana-annotations' },
  ],
  rerank: [
    { id: 'doc-1', score: 0.94, content: 'NullPointerException in promo validation when session is null - This incident (INC-1188) had identical root cause and was resolved by adding null check.', source: 'INC-1188 postmortem' },
    { id: 'doc-8', score: 0.92, content: 'Null pointer in validator.go line 142 during promotion apply - Stack trace matches current error pattern exactly.', source: 'stack-traces' },
    { id: 'doc-6', score: 0.89, content: 'checkout-svc 500 error on /api/v2/checkout endpoint - Error rate of 42% matching current incident.', source: 'datadog-logs' },
    { id: 'doc-2', score: 0.86, content: 'Checkout flow crashes for guest users without active session - Runbook describes workaround.', source: 'runbook-checkout-v2' },
    { id: 'doc-7', score: 0.83, content: 'Promo validation error: "Cannot read property of null" - Recent Sentry issue with similar signature.', source: 'sentry-issues' },
  ],
};

export function InvestigationWorkspace() {
  const [retrievalView, setRetrievalView] = useState<RetrievalViewType>(null);
  
  const {
    stage,
    events,
    isRunning,
    scenario,
    currentEventId,
    startInvestigation,
    resetInvestigation,
    switchScenario,
    getCurrentScenario,
  } = useInvestigation();

  const scenarioData = getCurrentScenario();
  const hasCompleted = stage === 'completed';

  const handleRunSimulation = () => {
    if (isRunning) return;
    setRetrievalView(null);
    startInvestigation(scenario);
  };

  const handleReplay = () => {
    setRetrievalView(null);
    resetInvestigation();
    setTimeout(() => startInvestigation(scenario), 100);
  };

  const handleNewInvestigation = () => {
    setRetrievalView(null);
    resetInvestigation();
  };

  const handleShowMore = (type: RetrievalViewType) => {
    setRetrievalView(type);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        currentScenario={scenario}
        onScenarioChange={switchScenario}
        onNewInvestigation={handleNewInvestigation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scenario Selector */}
        <ScenarioSelector
          currentScenario={scenario}
          onScenarioChange={switchScenario}
          onRunSimulation={handleRunSimulation}
          onReplay={handleReplay}
          isRunning={isRunning}
          hasCompleted={hasCompleted}
        />

        {/* Incident Header */}
        <IncidentHeader incident={scenarioData.incident} stage={stage} />

        {/* Investigation Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Timeline - Main content */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
            <InvestigationTimeline
              events={events}
              stage={stage}
              isRunning={isRunning}
              currentEventId={currentEventId}
              onShowMore={handleShowMore}
            />
          </div>

          {/* Right Panel - Evidence & Fix */}
          <div className="w-80 xl:w-96 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <EvidencePanel
                blastRadius={scenarioData.blastRadius}
                relatedIncidents={[
                  { id: 'INC-1188', similarity: 94, summary: 'Same null pointer pattern', resolved: true },
                  { id: 'INC-892', similarity: 87, summary: 'Similar service, different cause', resolved: true },
                  { id: 'INC-3421', similarity: 72, summary: 'Related deployment issue', resolved: true },
                ]}
                correlatedDeploy={scenarioData.incident.correlatedDeploy}
                isRunning={isRunning}
                retrievalView={retrievalView}
                retrievalResults={RETRIEVAL_RESULTS}
                onClearRetrievalView={() => setRetrievalView(null)}
              />
            </div>
            <div className="h-[400px] overflow-hidden">
              <SuggestedFixPanel
                fix={hasCompleted || stage === 'generating_fix' || stage === 'validating' ? scenarioData.suggestedFix : null}
                stage={stage}
                isRunning={isRunning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
