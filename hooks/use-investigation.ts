'use client';

import { useState, useCallback, useRef } from 'react';
import {
  InvestigationStage,
  ScenarioKey,
  TimelineEvent,
  SCENARIOS,
  STAGE_TIMINGS,
  STAGE_ORDER,
  STAGE_EVENT_MAP,
} from '@/services/mockInvestigationEngine';

export function useInvestigation() {
  const [scenario, setScenario] = useState<ScenarioKey>('checkout');
  const [stage, setStage] = useState<InvestigationStage>('idle');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stageIndexRef = useRef(0);

  const getCurrentScenario = useCallback(() => {
    return SCENARIOS[scenario];
  }, [scenario]);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetInvestigation = useCallback(() => {
    clearTimeouts();
    setStage('idle');
    setEvents([]);
    setIsRunning(false);
    setCurrentEventId(null);
    stageIndexRef.current = 0;
  }, [clearTimeouts]);

  const switchScenario = useCallback((newScenario: ScenarioKey) => {
    resetInvestigation();
    setScenario(newScenario);
  }, [resetInvestigation]);

  const runStage = useCallback((stageIndex: number) => {
    if (stageIndex >= STAGE_ORDER.length) {
      setIsRunning(false);
      return;
    }

    const currentStage = STAGE_ORDER[stageIndex];
    setStage(currentStage);

    // Add events for this stage
    const eventIndices = STAGE_EVENT_MAP[currentStage];
    const scenarioData = SCENARIOS[scenario];
    
    if (eventIndices && eventIndices.length > 0) {
      eventIndices.forEach((eventIndex) => {
        if (eventIndex < scenarioData.events.length) {
          const event = {
            ...scenarioData.events[eventIndex],
            timestamp: new Date(),
          };
          setEvents((prev) => {
            // Avoid duplicates
            if (prev.some((e) => e.id === event.id)) return prev;
            return [...prev, event];
          });
          setCurrentEventId(event.id);
        }
      });
    }

    // Schedule next stage
    const timing = STAGE_TIMINGS[currentStage];
    if (currentStage !== 'completed') {
      timeoutRef.current = setTimeout(() => {
        stageIndexRef.current = stageIndex + 1;
        runStage(stageIndex + 1);
      }, timing);
    } else {
      setIsRunning(false);
    }
  }, [scenario]);

  const startInvestigation = useCallback((scenarioKey?: ScenarioKey) => {
    if (scenarioKey && scenarioKey !== scenario) {
      setScenario(scenarioKey);
    }
    
    resetInvestigation();
    setIsRunning(true);
    stageIndexRef.current = 0;
    
    // Small delay to ensure state is reset before starting
    setTimeout(() => {
      runStage(0);
    }, 100);
  }, [scenario, resetInvestigation, runStage]);

  return {
    scenario,
    stage,
    events,
    isRunning,
    currentEventId,
    startInvestigation,
    resetInvestigation,
    switchScenario,
    getCurrentScenario,
  };
}
