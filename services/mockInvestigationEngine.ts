// Mock investigation engine for demo purposes
// This simulates the incident-copilot RAG pipeline

export type InvestigationStage =
  | 'idle'
  | 'receiving_incident'
  | 'classifying'
  | 'query_rewriting'
  | 'retrieving_dense'
  | 'retrieving_bm25'
  | 'fusing_results'
  | 'reranking'
  | 'analyzing'
  | 'correlating_deploys'
  | 'matching_incidents'
  | 'generating_hypothesis'
  | 'generating_fix'
  | 'validating'
  | 'completed';

export type ScenarioKey = 'checkout' | 'redis' | 'kafka' | 'crashloop' | 'retry';

export interface Incident {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3';
  service: string;
  startedAt: Date;
  duration: string;
  impactedServices: string[];
  correlatedDeploy?: {
    version: string;
    service: string;
    deployedAt: Date;
    author: string;
    commitMessage: string;
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'incident' | 'analysis' | 'retrieval' | 'correlation' | 'hypothesis' | 'fix' | 'validation' | 'complete';
  icon: string;
  title: string;
  description: string;
  details?: string[];
  confidence?: number;
  expandable?: boolean;
}

export interface BlastRadius {
  affectedUsers: number;
  errorRate: number;
  impactedServices: string[];
}

export interface SuggestedFix {
  summary: string;
  rootCause: string;
  confidence: number;
  reasoning: string[];
  validation: {
    unitTests: 'pending' | 'passed' | 'failed';
    reproduced: 'pending' | 'passed' | 'failed';
    schemaCheck: 'pending' | 'passed' | 'failed';
    rollbackAvailable: boolean;
  };
  patch?: {
    filename: string;
    diff: string;
  };
}

export interface ScenarioData {
  incident: Incident;
  blastRadius: BlastRadius;
  events: TimelineEvent[];
  suggestedFix: SuggestedFix;
}

// Active incidents for sidebar
export const ACTIVE_INCIDENTS = [
  {
    id: 'INC-4521',
    title: 'Checkout failures spike',
    severity: 'P1' as const,
    service: 'checkout-svc',
    duration: '12m',
    status: 'investigating' as const,
  },
  {
    id: 'INC-4519',
    title: 'User API latency elevated',
    severity: 'P2' as const,
    service: 'user-svc',
    duration: '45m',
    status: 'identified' as const,
  },
  {
    id: 'INC-4518',
    title: 'SSL cert expired (staging)',
    severity: 'P3' as const,
    service: 'api-gateway',
    duration: '2h',
    status: 'resolved' as const,
  },
];

// Scenario: Checkout Outage
const checkoutScenario: ScenarioData = {
  incident: {
    id: 'INC-4521',
    title: 'Checkout failures spiking — 42% error rate on /api/v2/checkout',
    severity: 'P1',
    service: 'checkout-svc',
    startedAt: new Date(Date.now() - 12 * 60 * 1000),
    duration: '12m',
    impactedServices: ['checkout-svc', 'payment-processor', 'order-svc', 'inventory-svc'],
    correlatedDeploy: {
      version: 'v2.14.3',
      service: 'checkout-svc',
      deployedAt: new Date(Date.now() - 18 * 60 * 1000),
      author: 'jsmith',
      commitMessage: 'feat: Add promo code validation to checkout flow',
    },
  },
  blastRadius: {
    affectedUsers: 8247,
    errorRate: 42,
    impactedServices: ['checkout-svc', 'payment-processor', 'order-svc'],
  },
  events: [
    {
      id: 'evt-1',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: 'incident',
      icon: 'bell',
      title: 'Incident Received',
      description: 'PagerDuty alert triggered: High error rate on checkout-svc',
      details: [
        'Source: Datadog APM',
        'Threshold: >5% error rate for 2 minutes',
        'Current: 42% error rate',
      ],
    },
    {
      id: 'evt-2',
      timestamp: new Date(Date.now() - 11.5 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Incident Classification',
      description: 'Classified as Service Degradation — Payment Flow Critical Path',
      details: [
        'Category: Availability',
        'Business Impact: Revenue-impacting',
        'Initial scope: checkout-svc + downstream',
      ],
    },
    {
      id: 'evt-3',
      timestamp: new Date(Date.now() - 11 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Query Rewriting',
      description: 'Generating optimized search queries for RAG pipeline',
      details: [
        'Original: "checkout error spike"',
        'Dense: "checkout service payment processing failure null pointer exception"',
        'BM25: "checkout-svc 500 error promo validation"',
        'Hypothetical doc: "Checkout failures caused by null reference in promo code validation"',
      ],
    },
    {
      id: 'evt-4',
      timestamp: new Date(Date.now() - 10.5 * 60 * 1000),
      type: 'retrieval',
      icon: 'search',
      title: 'Hybrid Retrieval',
      description: 'Searching runbooks and historical incidents',
      details: [
        'Dense (Cohere Embed): 847 candidates, top-k=20',
        'BM25 (Elasticsearch): 1,293 candidates, top-k=20',
        'RRF fusion: 35 unique results',
      ],
      confidence: 78,
    },
    {
      id: 'evt-5',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'retrieval',
      icon: 'search',
      title: 'Reranking Results',
      description: 'Cross-encoder reranking for final relevance scoring',
      details: [
        'Model: Cohere Rerank v3',
        'Input: 35 candidates',
        'Output: top 5 with relevance > 0.7',
        'Top match: INC-1188 "Null pointer in promo validation" (94% similarity)',
      ],
      confidence: 94,
    },
    {
      id: 'evt-6',
      timestamp: new Date(Date.now() - 9 * 60 * 1000),
      type: 'correlation',
      icon: 'link',
      title: 'Deploy Correlation',
      description: 'Identified deployment v2.14.3 deployed 6 minutes before incident',
      details: [
        'Deploy time: 18 minutes ago',
        'Incident start: 12 minutes ago',
        'Author: jsmith',
        'Commit: "feat: Add promo code validation to checkout flow"',
        'Changed files: checkout-svc/promo/validator.go',
      ],
      expandable: true,
    },
    {
      id: 'evt-7',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'hypothesis',
      icon: 'lightbulb',
      title: 'Root Cause Hypothesis',
      description: 'Null pointer exception in promo code validation when user has no active session',
      confidence: 91,
      details: [
        'Evidence: Error logs show NullPointerException at validator.go:142',
        'Correlation: INC-1188 had identical stack trace, resolved by null check',
        'Trigger: New promo validation code assumes session exists',
        'Blast radius: All checkout requests without active session',
      ],
    },
    {
      id: 'evt-8',
      timestamp: new Date(Date.now() - 7 * 60 * 1000),
      type: 'fix',
      icon: 'wrench',
      title: 'Fix Generation',
      description: 'Generated patch based on INC-1188 resolution pattern',
      details: [
        'File: checkout-svc/promo/validator.go',
        'Pattern: Add null check before session access',
        'Validated against codebase style guide',
        'Unit test suggestion included',
      ],
    },
    {
      id: 'evt-9',
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
      type: 'validation',
      icon: 'check-circle',
      title: 'Validation Complete',
      description: 'All validation checks passed',
      details: [
        '✓ Unit tests pass with suggested fix',
        '✓ Error reproduced in staging',
        '✓ Schema check: No breaking changes',
        '✓ Rollback available: v2.14.2',
      ],
    },
    {
      id: 'evt-10',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'complete',
      icon: 'flag',
      title: 'Investigation Complete',
      description: 'Ready for human review. Suggested actions: Apply fix or rollback to v2.14.2',
      confidence: 91,
    },
  ],
  suggestedFix: {
    summary: 'Null pointer exception in promo code validation',
    rootCause: 'The new promo code validation (v2.14.3) accesses user.Session without checking if the session exists. Guest checkout users have no active session, causing a NullPointerException at validator.go:142.',
    confidence: 91,
    reasoning: [
      'Stack trace matches INC-1188 pattern (94% similarity)',
      'Deploy v2.14.3 introduced promo validation 6 min before incident',
      'Error rate correlates exactly with guest checkout traffic',
      'Rollback to v2.14.2 in staging eliminated errors',
    ],
    validation: {
      unitTests: 'passed',
      reproduced: 'passed',
      schemaCheck: 'passed',
      rollbackAvailable: true,
    },
    patch: {
      filename: 'checkout-svc/promo/validator.go',
      diff: `@@ -140,6 +140,10 @@ func (v *Validator) Apply(ctx context.Context, code string) error {
+    // Check for guest checkout (no session)
+    if user.Session == nil {
+        return v.applyGuestPromo(ctx, code)
+    }
     return v.applyWithSession(ctx, user.Session, code)
 }`,
    },
  },
};

// Scenario: Redis Latency
const redisScenario: ScenarioData = {
  incident: {
    id: 'INC-4520',
    title: 'Redis latency spike — P99 at 450ms (threshold 50ms)',
    severity: 'P1',
    service: 'redis-cluster',
    startedAt: new Date(Date.now() - 8 * 60 * 1000),
    duration: '8m',
    impactedServices: ['user-svc', 'session-svc', 'cart-svc', 'recommendation-svc'],
    correlatedDeploy: undefined,
  },
  blastRadius: {
    affectedUsers: 12500,
    errorRate: 15,
    impactedServices: ['user-svc', 'session-svc', 'cart-svc'],
  },
  events: [
    {
      id: 'evt-r1',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'incident',
      icon: 'bell',
      title: 'Incident Received',
      description: 'Datadog alert: Redis P99 latency exceeds threshold',
      details: ['Current P99: 450ms', 'Threshold: 50ms', 'Cluster: redis-prod-01'],
    },
    {
      id: 'evt-r2',
      timestamp: new Date(Date.now() - 7.5 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Query Analysis',
      description: 'Analyzing slow query patterns in Redis cluster',
      details: ['Found KEYS * command running every 30s', 'Source: recommendation-svc v3.2.1', 'Impact: Blocking all other operations'],
    },
    {
      id: 'evt-r3',
      timestamp: new Date(Date.now() - 7 * 60 * 1000),
      type: 'retrieval',
      icon: 'search',
      title: 'Runbook Retrieved',
      description: 'Found matching runbook: "Redis Performance Degradation"',
      details: ['Runbook ID: RB-089', 'Last used: 45 days ago', 'Resolution: Disable KEYS command, use SCAN'],
      confidence: 88,
    },
    {
      id: 'evt-r4',
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
      type: 'hypothesis',
      icon: 'lightbulb',
      title: 'Root Cause Identified',
      description: 'KEYS * command in recommendation-svc blocking Redis operations',
      confidence: 92,
      details: ['Pattern: O(N) command on large dataset', 'Dataset size: 2.4M keys', 'Fix: Replace with SCAN iterator'],
    },
    {
      id: 'evt-r5',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'complete',
      icon: 'flag',
      title: 'Investigation Complete',
      description: 'Ready for review. Immediate action: Restart recommendation-svc with KEYS disabled',
      confidence: 92,
    },
  ],
  suggestedFix: {
    summary: 'KEYS * command blocking Redis cluster',
    rootCause: 'The recommendation-svc is running a KEYS * command every 30 seconds for cache invalidation. With 2.4M keys, this O(N) operation blocks all other Redis operations.',
    confidence: 92,
    reasoning: [
      'SLOWLOG shows KEYS * taking 400-500ms per execution',
      'Latency spikes correlate with recommendation-svc cron job',
      'Similar incident INC-892 had same root cause',
      'Redis docs explicitly warn against KEYS in production',
    ],
    validation: {
      unitTests: 'passed',
      reproduced: 'passed',
      schemaCheck: 'passed',
      rollbackAvailable: true,
    },
    patch: {
      filename: 'recommendation-svc/cache/invalidator.go',
      diff: `@@ -45,7 +45,12 @@ func (i *Invalidator) ClearStale() error {
-    keys, err := i.redis.Keys(ctx, "*").Result()
+    var cursor uint64
+    var keys []string
+    for {
+        var batch []string
+        batch, cursor, err = i.redis.Scan(ctx, cursor, "*", 100).Result()
+        keys = append(keys, batch...)
+        if cursor == 0 { break }
+    }`,
    },
  },
};

// Scenario: Kafka Consumer Lag
const kafkaScenario: ScenarioData = {
  incident: {
    id: 'INC-4519',
    title: 'Kafka consumer lag — order-processor 45k messages behind',
    severity: 'P2',
    service: 'order-processor',
    startedAt: new Date(Date.now() - 25 * 60 * 1000),
    duration: '25m',
    impactedServices: ['order-processor', 'fulfillment-svc', 'notification-svc'],
  },
  blastRadius: {
    affectedUsers: 3200,
    errorRate: 0,
    impactedServices: ['order-processor', 'fulfillment-svc'],
  },
  events: [
    {
      id: 'evt-k1',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'incident',
      icon: 'bell',
      title: 'Consumer Lag Alert',
      description: 'Kafka consumer group order-processor lagging significantly',
      details: ['Current lag: 45,000 messages', 'Threshold: 1,000 messages', 'Topic: orders.created'],
    },
    {
      id: 'evt-k2',
      timestamp: new Date(Date.now() - 24 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Consumer Analysis',
      description: 'Analyzing consumer group health and partition assignment',
      details: ['Active consumers: 3 (expected: 5)', 'Rebalancing: detected', 'Pod restarts: 2 in last hour'],
    },
    {
      id: 'evt-k3',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      type: 'retrieval',
      icon: 'search',
      title: 'Similar Incidents Found',
      description: 'Retrieved 3 related incidents with consumer lag patterns',
      confidence: 85,
      details: ['INC-3421: OOM causing pod eviction', 'INC-2987: Slow downstream DB', 'INC-2654: Network partition'],
    },
    {
      id: 'evt-k4',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: 'hypothesis',
      icon: 'lightbulb',
      title: 'Root Cause Hypothesis',
      description: 'Memory limit too low causing OOMKilled and consumer rebalancing',
      confidence: 87,
      details: ['Pod memory: 512Mi limit', 'Peak usage: 510Mi before kill', 'Recommendation: Increase to 1Gi'],
    },
    {
      id: 'evt-k5',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      type: 'complete',
      icon: 'flag',
      title: 'Investigation Complete',
      description: 'Increase memory limit and add 2 more consumer replicas',
      confidence: 87,
    },
  ],
  suggestedFix: {
    summary: 'OOMKilled pods causing consumer group rebalancing',
    rootCause: 'The order-processor pods have a 512Mi memory limit but are hitting 510Mi during peak load, causing OOMKilled events. Each restart triggers a consumer group rebalance, leading to processing delays.',
    confidence: 87,
    reasoning: [
      'Kubernetes events show 2 OOMKilled in last hour',
      'Consumer group rebalancing correlates with OOM events',
      'Memory usage trending up over past week',
      'Similar to INC-3421 which was resolved by memory increase',
    ],
    validation: {
      unitTests: 'passed',
      reproduced: 'passed',
      schemaCheck: 'passed',
      rollbackAvailable: true,
    },
    patch: {
      filename: 'k8s/order-processor/deployment.yaml',
      diff: `@@ -25,8 +25,8 @@ spec:
         resources:
           limits:
-            memory: "512Mi"
+            memory: "1Gi"
           requests:
-            memory: "256Mi"
+            memory: "512Mi"`,
    },
  },
};

// Scenario: CrashLoopBackOff
const crashloopScenario: ScenarioData = {
  incident: {
    id: 'INC-4522',
    title: 'CrashLoopBackOff — api-gateway pods failing health checks',
    severity: 'P1',
    service: 'api-gateway',
    startedAt: new Date(Date.now() - 5 * 60 * 1000),
    duration: '5m',
    impactedServices: ['api-gateway', 'all-downstream'],
    correlatedDeploy: {
      version: 'v1.45.0',
      service: 'api-gateway',
      deployedAt: new Date(Date.now() - 7 * 60 * 1000),
      author: 'devops-bot',
      commitMessage: 'chore: Update base image to alpine 3.19',
    },
  },
  blastRadius: {
    affectedUsers: 25000,
    errorRate: 100,
    impactedServices: ['api-gateway', 'all-services'],
  },
  events: [
    {
      id: 'evt-c1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'incident',
      icon: 'bell',
      title: 'CrashLoopBackOff Detected',
      description: 'All api-gateway pods in CrashLoopBackOff state',
      details: ['Restart count: 5', 'Last exit code: 1', 'All 4 replicas affected'],
    },
    {
      id: 'evt-c2',
      timestamp: new Date(Date.now() - 4.5 * 60 * 1000),
      type: 'correlation',
      icon: 'link',
      title: 'Deploy Correlation',
      description: 'Deployment v1.45.0 rolled out 2 minutes before crash',
      details: ['Change: Base image update to alpine 3.19', 'Author: devops-bot', 'Impact: All pods affected'],
    },
    {
      id: 'evt-c3',
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Log Analysis',
      description: 'Container logs show missing shared library',
      details: ['Error: libssl.so.1.1 not found', 'Alpine 3.19 ships with libssl.so.3', 'Binary compiled against OpenSSL 1.1'],
    },
    {
      id: 'evt-c4',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'hypothesis',
      icon: 'lightbulb',
      title: 'Root Cause Confirmed',
      description: 'OpenSSL version mismatch after base image update',
      confidence: 98,
      details: ['Alpine 3.19 removed OpenSSL 1.1', 'Binary needs recompilation', 'Immediate fix: Rollback to v1.44.0'],
    },
    {
      id: 'evt-c5',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'complete',
      icon: 'flag',
      title: 'Investigation Complete',
      description: 'Rollback to v1.44.0 recommended. Long-term: Recompile against OpenSSL 3',
      confidence: 98,
    },
  ],
  suggestedFix: {
    summary: 'OpenSSL version mismatch after Alpine base image update',
    rootCause: 'The v1.45.0 deployment updated the base image to Alpine 3.19, which ships with OpenSSL 3. The api-gateway binary was compiled against OpenSSL 1.1 and cannot find libssl.so.1.1.',
    confidence: 98,
    reasoning: [
      'Container logs explicitly show "libssl.so.1.1 not found"',
      'Alpine 3.19 release notes confirm OpenSSL 3 migration',
      'Deployment v1.45.0 is the only change in last 24h',
      'v1.44.0 on Alpine 3.18 works correctly',
    ],
    validation: {
      unitTests: 'pending',
      reproduced: 'passed',
      schemaCheck: 'passed',
      rollbackAvailable: true,
    },
    patch: {
      filename: 'Dockerfile',
      diff: `@@ -1,4 +1,5 @@
-FROM alpine:3.19
+FROM alpine:3.18
+# TODO: Recompile binary against OpenSSL 3 before upgrading
 
 COPY api-gateway /usr/local/bin/`,
    },
  },
};

// Scenario: Retry Storm
const retryScenario: ScenarioData = {
  incident: {
    id: 'INC-4523',
    title: 'Payment API overloaded — 10x traffic spike from retries',
    severity: 'P1',
    service: 'payment-svc',
    startedAt: new Date(Date.now() - 15 * 60 * 1000),
    duration: '15m',
    impactedServices: ['payment-svc', 'checkout-svc', 'stripe-webhook-handler'],
  },
  blastRadius: {
    affectedUsers: 5800,
    errorRate: 75,
    impactedServices: ['payment-svc', 'checkout-svc'],
  },
  events: [
    {
      id: 'evt-rt1',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'incident',
      icon: 'bell',
      title: 'Traffic Spike Detected',
      description: 'Payment service receiving 10x normal request volume',
      details: ['Normal: ~500 RPS', 'Current: ~5,200 RPS', 'Error rate: 75%'],
    },
    {
      id: 'evt-rt2',
      timestamp: new Date(Date.now() - 14 * 60 * 1000),
      type: 'analysis',
      icon: 'brain',
      title: 'Request Pattern Analysis',
      description: 'Detected exponential backoff retry pattern from checkout-svc',
      details: ['Same payment IDs appearing 8-12 times', 'Retry intervals: 1s, 2s, 4s, 8s...', 'No jitter detected'],
    },
    {
      id: 'evt-rt3',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: 'correlation',
      icon: 'link',
      title: 'Upstream Issue Identified',
      description: 'Stripe API experiencing degraded performance',
      details: ['Stripe status page: Degraded', 'Response times: 8-12s (normal: 200ms)', 'Timeout threshold: 5s'],
    },
    {
      id: 'evt-rt4',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'hypothesis',
      icon: 'lightbulb',
      title: 'Root Cause Hypothesis',
      description: 'Retry storm caused by aggressive retry policy without circuit breaker',
      confidence: 94,
      details: ['Checkout-svc retries on any 5xx or timeout', 'No circuit breaker to stop cascade', 'No jitter causing thundering herd'],
    },
    {
      id: 'evt-rt5',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'complete',
      icon: 'flag',
      title: 'Investigation Complete',
      description: 'Enable circuit breaker and add jitter to retry policy',
      confidence: 94,
    },
  ],
  suggestedFix: {
    summary: 'Retry storm from aggressive retry policy without circuit breaker',
    rootCause: 'Stripe API degradation caused timeouts in payment-svc. checkout-svc has an aggressive retry policy (no jitter, no circuit breaker) that amplified the load 10x, creating a cascade failure.',
    confidence: 94,
    reasoning: [
      'Request IDs show 8-12 retries per payment',
      'Stripe status confirms API degradation at incident start',
      'No circuit breaker in checkout-svc payment client',
      'Similar pattern in INC-2145 resolved with circuit breaker',
    ],
    validation: {
      unitTests: 'passed',
      reproduced: 'passed',
      schemaCheck: 'passed',
      rollbackAvailable: false,
    },
    patch: {
      filename: 'checkout-svc/clients/payment.go',
      diff: `@@ -15,6 +15,15 @@ func NewPaymentClient() *PaymentClient {
+    // Add circuit breaker
+    cb := gobreaker.NewCircuitBreaker(gobreaker.Settings{
+        Timeout: 30 * time.Second,
+        ReadyToTrip: func(counts gobreaker.Counts) bool {
+            return counts.ConsecutiveFailures > 5
+        },
+    })
+
     return &PaymentClient{
+        circuitBreaker: cb,
         retryPolicy: retry.WithJitter(
             retry.ExponentialBackoff(time.Second, 30*time.Second),
+            0.3, // 30% jitter
         ),
     }`,
    },
  },
};

export const SCENARIOS: Record<ScenarioKey, ScenarioData> = {
  checkout: checkoutScenario,
  redis: redisScenario,
  kafka: kafkaScenario,
  crashloop: crashloopScenario,
  retry: retryScenario,
};

// Timing for each stage (in ms) - minimum 3s per API call, more for heavy operations
export const STAGE_TIMINGS: Record<InvestigationStage, number> = {
  idle: 0,
  receiving_incident: 3000,
  classifying: 3500,
  query_rewriting: 4000,
  retrieving_dense: 5000,    // Heavy: vector search across large dataset
  retrieving_bm25: 4500,     // Heavy: keyword search with BM25 scoring
  fusing_results: 3000,
  reranking: 5500,           // Heavy: cross-encoder reranking
  analyzing: 4000,
  correlating_deploys: 3500,
  matching_incidents: 3500,
  generating_hypothesis: 5000, // Heavy: LLM inference
  generating_fix: 5500,        // Heavy: LLM code generation
  validating: 4000,
  completed: 0,
};

export const STAGE_ORDER: InvestigationStage[] = [
  'receiving_incident',
  'classifying',
  'query_rewriting',
  'retrieving_dense',
  'retrieving_bm25',
  'fusing_results',
  'reranking',
  'analyzing',
  'correlating_deploys',
  'matching_incidents',
  'generating_hypothesis',
  'generating_fix',
  'validating',
  'completed',
];

// Map stages to event indices
export const STAGE_EVENT_MAP: Record<InvestigationStage, number[]> = {
  idle: [],
  receiving_incident: [0],
  classifying: [1],
  query_rewriting: [2],
  retrieving_dense: [3],
  retrieving_bm25: [3],
  fusing_results: [3],
  reranking: [4],
  analyzing: [5],
  correlating_deploys: [5],
  matching_incidents: [5],
  generating_hypothesis: [6],
  generating_fix: [7],
  validating: [8],
  completed: [9],
};
