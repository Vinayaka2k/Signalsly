'use client';

import { cn } from '@/lib/utils';
import { Clock, GitBranch, Server, AlertCircle } from 'lucide-react';
import type { Incident, InvestigationStage } from '@/services/mockInvestigationEngine';

interface IncidentHeaderProps {
  incident: Incident;
  stage: InvestigationStage;
}

export function IncidentHeader({ incident, stage }: IncidentHeaderProps) {
  const isActive = stage !== 'idle' && stage !== 'completed';

  return (
    <header className="border-b border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{incident.id}</span>
            <SeverityPill severity={incident.severity} />
            {isActive && <InvestigatingBadge />}
            {stage === 'completed' && <CompletedBadge />}
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2 text-balance">
            {incident.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>{incident.service}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Started {formatTime(incident.startedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-mono">{incident.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {incident.correlatedDeploy && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-warning/10 border border-warning/20">
              <GitBranch className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-medium text-warning">
                {incident.correlatedDeploy.version}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {incident.impactedServices.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function SeverityPill({ severity }: { severity: 'P1' | 'P2' | 'P3' }) {
  const colors = {
    P1: 'bg-severity-p1 text-white',
    P2: 'bg-severity-p2 text-black',
    P3: 'bg-severity-p3 text-white',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-bold rounded', colors[severity])}>
      {severity}
    </span>
  );
}

function InvestigatingBadge() {
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="text-xs font-medium text-primary">Investigating...</span>
    </span>
  );
}

function CompletedBadge() {
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
      <AlertCircle className="w-3 h-3 text-success" />
      <span className="text-xs font-medium text-success">Investigation Complete</span>
    </span>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
