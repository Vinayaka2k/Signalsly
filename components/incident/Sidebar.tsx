'use client';

import { cn } from '@/lib/utils';
import { Plus, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ACTIVE_INCIDENTS } from '@/services/mockInvestigationEngine';
import type { ScenarioKey } from '@/services/mockInvestigationEngine';

interface SidebarProps {
  currentScenario: ScenarioKey;
  onScenarioChange: (scenario: ScenarioKey) => void;
  onNewInvestigation: () => void;
}

export function Sidebar({ currentScenario, onScenarioChange, onNewInvestigation }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Signalsly</span>
        </div>
      </div>

      {/* New Investigation Button */}
      <div className="p-3">
        <button
          onClick={onNewInvestigation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Investigation
        </button>
      </div>

      {/* System Health */}
      <div className="px-3 py-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
          System Health
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent/50">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-sidebar-foreground">3 systems operational</span>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Active Incidents
        </div>
        <div className="space-y-1">
          {ACTIVE_INCIDENTS.map((incident) => {
            const isSelected = incident.id === 'INC-4521' && currentScenario === 'checkout';
            return (
              <button
                key={incident.id}
                onClick={() => {
                  if (incident.id === 'INC-4521') onScenarioChange('checkout');
                }}
                className={cn(
                  'w-full text-left p-2 rounded-md transition-colors group',
                  isSelected
                    ? 'bg-sidebar-accent'
                    : 'hover:bg-sidebar-accent/50'
                )}
              >
                <div className="flex items-start gap-2">
                  <SeverityBadge severity={incident.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-sidebar-foreground truncate">
                      {incident.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{incident.service}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{incident.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <StatusBadge status={incident.status} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 border-t border-sidebar-border">
        <nav className="space-y-1">
          <NavItem icon={Activity} label="Dashboard" active />
          <NavItem icon={Clock} label="History" />
          <NavItem icon={AlertTriangle} label="Alerts" />
        </nav>
      </div>
    </aside>
  );
}

function SeverityBadge({ severity }: { severity: 'P1' | 'P2' | 'P3' }) {
  const colors = {
    P1: 'bg-severity-p1/20 text-severity-p1 border-severity-p1/30',
    P2: 'bg-severity-p2/20 text-severity-p2 border-severity-p2/30',
    P3: 'bg-severity-p3/20 text-severity-p3 border-severity-p3/30',
  };

  return (
    <span className={cn('px-1.5 py-0.5 text-[10px] font-semibold rounded border', colors[severity])}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: 'investigating' | 'identified' | 'resolved' }) {
  const config = {
    investigating: { icon: Activity, label: 'Investigating', color: 'text-warning' },
    identified: { icon: AlertTriangle, label: 'Identified', color: 'text-info' },
    resolved: { icon: CheckCircle, label: 'Resolved', color: 'text-success' },
  };

  const { icon: Icon, label, color } = config[status];

  return (
    <span className={cn('flex items-center gap-1 text-[10px] font-medium', color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: typeof Activity; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
