'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ChevronDown } from 'lucide-react';
import type { ScenarioKey } from '@/services/mockInvestigationEngine';

interface ScenarioSelectorProps {
  currentScenario: ScenarioKey;
  onScenarioChange: (scenario: ScenarioKey) => void;
  onRunSimulation: () => void;
  onReplay: () => void;
  isRunning: boolean;
  hasCompleted: boolean;
}

const scenarios: { key: ScenarioKey; label: string; description: string }[] = [
  { key: 'checkout', label: 'Checkout Outage', description: 'High error rate on payment flow' },
  { key: 'redis', label: 'Redis Latency Spike', description: 'Cache cluster performance degradation' },
  { key: 'kafka', label: 'Kafka Consumer Lag', description: 'Order processing delays' },
  { key: 'crashloop', label: 'CrashLoopBackOff', description: 'API Gateway pod restarts' },
  { key: 'retry', label: 'Retry Storm', description: 'Payment provider cascade failure' },
];

export function ScenarioSelector({
  currentScenario,
  onScenarioChange,
  onRunSimulation,
  onReplay,
  isRunning,
  hasCompleted,
}: ScenarioSelectorProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card border-b border-border">
      <div className="relative">
        <select
          value={currentScenario}
          onChange={(e) => onScenarioChange(e.target.value as ScenarioKey)}
          disabled={isRunning}
          className={cn(
            'appearance-none pl-3 pr-8 py-2 rounded-md border bg-background text-sm font-medium',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {scenarios.map((scenario) => (
            <option key={scenario.key} value={scenario.key}>
              {scenario.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>

      <span className="text-xs text-muted-foreground hidden sm:block">
        {scenarios.find((s) => s.key === currentScenario)?.description}
      </span>

      <div className="flex items-center gap-2 ml-auto">
        {hasCompleted && !isRunning && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReplay}
            className="flex items-center gap-2 px-3 py-2 rounded-md border bg-card hover:bg-accent transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </motion.button>
        )}
        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            isRunning
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {isRunning ? (
            <>
              <LoadingSpinner />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
