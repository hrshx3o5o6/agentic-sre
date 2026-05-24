// lib/mockData.ts
// Placeholder data matching the backend schemas

export const MOCK_SCENARIOS = [
  { id: "bad_deployment", label: "Bad Deployment / Retry Storm", severity: "critical" },
  { id: "db_bottleneck",  label: "DB Connection Bottleneck",    severity: "critical" },
  { id: "memory_leak",   label: "Memory Leak Cascade",         severity: "warning"  },
];

export const MOCK_INCIDENTS = [
  { id: "INC-204", scenario: "retry_storm",       status: "active",   severity: "critical", service: "auth-service",  age: "4m" },
  { id: "INC-203", scenario: "db_saturation",     status: "active",   severity: "critical", service: "postgres-db",   age: "7m" },
  { id: "INC-198", scenario: "redis_latency",     status: "active",   severity: "warning",  service: "redis-cache",   age: "23m" },
  { id: "INC-177", scenario: "dns_outage",         status: "resolved", severity: "critical", service: "api-gateway",   age: "2h" },
  { id: "INC-166", scenario: "memory_pressure",   status: "resolved", severity: "warning",  service: "frontend",      age: "5h" },
];

export const MOCK_GRAPH_NODES = [
  { id: "frontend",     label: "frontend",      state: "warning",  cpu: 42,  latency: 320,  rps: 1840, errors: 12  },
  { id: "api-gateway",  label: "api-gateway",   state: "warning",  cpu: 61,  latency: 480,  rps: 1820, errors: 34  },
  { id: "auth-service", label: "auth-service",  state: "critical", cpu: 94,  latency: 2400, rps: 940,  errors: 892 },
  { id: "user-service", label: "user-service",  state: "healthy",  cpu: 28,  latency: 45,   rps: 220,  errors: 0   },
  { id: "redis-cache",  label: "redis-cache",   state: "warning",  cpu: 55,  latency: 190,  rps: 4200, errors: 7   },
  { id: "postgres-db",  label: "postgres-db",   state: "critical", cpu: 99,  latency: 8900, rps: 120,  errors: 0   },
];

export const MOCK_GRAPH_EDGES = [
  { id: "e1", source: "frontend",    target: "api-gateway",  state: "warning"  },
  { id: "e2", source: "api-gateway", target: "auth-service", state: "critical" },
  { id: "e3", source: "api-gateway", target: "user-service", state: "healthy"  },
  { id: "e4", source: "auth-service",target: "redis-cache",  state: "warning"  },
  { id: "e5", source: "auth-service",target: "postgres-db",  state: "critical" },
  { id: "e6", source: "user-service",target: "postgres-db",  state: "healthy"  },
];

export const MOCK_TIMELINE_EVENTS = [
  {
    id: "evt-1",
    timestamp: "21:00:00",
    severity: "info",
    source: "github",
    type: "deployment",
    service: "auth-service",
    message: "Deployment v1.32.4 triggered to production",
    traceId: "t89410a8b",
    cluster: 1,
    deploymentId: "v1.32.4",
  },
  {
    id: "evt-2",
    timestamp: "21:00:48",
    severity: "warning",
    source: "prometheus",
    type: "metric_anomaly",
    service: "postgres-db",
    message: "db_connections_utilization_ratio crossed 45% threshold",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-3",
    timestamp: "21:01:12",
    severity: "error",
    source: "loki",
    type: "log",
    service: "auth-service",
    message: "DB connection failure: too many open connections. Retrying in 1s...",
    traceId: "t89410a8b",
    cluster: 4,
    deploymentId: null,
  },
  {
    id: "evt-4",
    timestamp: "21:01:31",
    severity: "error",
    source: "loki",
    type: "log",
    service: "auth-service",
    message: "Re-executing query. Attempt 3. Error: timed out",
    traceId: "t89410a8b",
    cluster: 3,
    deploymentId: null,
  },
  {
    id: "evt-5",
    timestamp: "21:01:50",
    severity: "critical",
    source: "prometheus",
    type: "metric_anomaly",
    service: "postgres-db",
    message: "db_connections_utilization_ratio spiked to 88.5% → 99.2%",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-6",
    timestamp: "21:02:00",
    severity: "critical",
    source: "alertmanager",
    type: "alert",
    service: "postgres-db",
    message: "FIRING: PostgresConnectionsExhausted — 100% connection pool saturated",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-7",
    timestamp: "21:02:10",
    severity: "error",
    source: "loki",
    type: "log",
    service: "auth-service",
    message: "HTTP Request POST /login returned status 500",
    traceId: "t89410a8b",
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-8",
    timestamp: "21:02:30",
    severity: "critical",
    source: "prometheus",
    type: "metric_anomaly",
    service: "auth-service",
    message: "http_requests_total 5xx rate: 0.2 → 92.1 req/s — HTTP error explosion",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-9",
    timestamp: "21:03:00",
    severity: "critical",
    source: "kubernetes",
    type: "infra_change",
    service: "auth-service",
    message: "Pod auth-service-7f49cbd-2x9wl in CrashLoopBackOff — OOMKilled",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
  {
    id: "evt-10",
    timestamp: "21:04:00",
    severity: "info",
    source: "loki",
    type: "log",
    service: "rca-engine",
    message: "AI RCA analysis complete — root cause identified with 91% confidence",
    traceId: null,
    cluster: 1,
    deploymentId: null,
  },
];

export const MOCK_METRICS_DB_CONNECTIONS = [
  { t: "20:58", value: 38 },
  { t: "20:59", value: 42 },
  { t: "21:00", value: 45 },
  { t: "21:01", value: 88.5 },
  { t: "21:02", value: 99.2 },
  { t: "21:03", value: 100 },
  { t: "21:04", value: 100 },
];

export const MOCK_METRICS_5XX = [
  { t: "20:58", value: 0 },
  { t: "20:59", value: 0 },
  { t: "21:00", value: 0.2 },
  { t: "21:01", value: 12.4 },
  { t: "21:02", value: 65.8 },
  { t: "21:03", value: 92.1 },
  { t: "21:04", value: 87.3 },
];

export const MOCK_METRICS_LATENCY = [
  { t: "20:58", p50: 44, p95: 120, p99: 210 },
  { t: "20:59", p50: 46, p95: 130, p99: 220 },
  { t: "21:00", p50: 52, p95: 180, p99: 420 },
  { t: "21:01", p50: 310, p95: 1200, p99: 2400 },
  { t: "21:02", p50: 890, p95: 4200, p99: 8900 },
  { t: "21:03", p50: 1200, p95: 5800, p99: 9800 },
  { t: "21:04", p50: 980, p95: 4900, p99: 8200 },
];

export const MOCK_METRICS_THROUGHPUT = [
  { t: "20:58", value: 1840 },
  { t: "20:59", value: 1820 },
  { t: "21:00", value: 1810 },
  { t: "21:01", value: 1340 },
  { t: "21:02", value: 820 },
  { t: "21:03", value: 410 },
  { t: "21:04", value: 390 },
];

export const MOCK_RCA = {
  incidentId: "INC-204",
  summary: "auth-service v1.32.4 introduced a retry amplification bug causing exponential DB connection exhaustion, resulting in a cascading HTTP 5xx storm across the production API tier.",
  probableRootCause: "Faulty retry logic in auth-service v1.32.4 caused unbounded connection retries against postgres-db, exhausting the connection pool (45% → 100%) within 60 seconds of deployment.",
  confidenceScore: 0.91,
  hypotheses: [
    {
      title: "Retry Storm from auth-service v1.32.4",
      probability: 0.91,
      causalExplanation: "New deployment introduced exponential retry without backoff cap. Each failed DB attempt spawned 3 retries × N concurrent requests, exhausting postgres-db pool.",
    },
    {
      title: "Underlying postgres-db degradation",
      probability: 0.06,
      causalExplanation: "Pre-existing connection pool pressure may have been near saturation before deployment, making the auth-service retry behavior the final trigger.",
    },
    {
      title: "Redis cache eviction causing DB fallthrough",
      probability: 0.03,
      causalExplanation: "Redis eviction policy may have caused cache misses, routing additional load to postgres-db, compounding the retry storm.",
    },
  ],
  remediationPlan: [
    "Immediately rollback auth-service to v1.32.3 using kubectl rollout undo",
    "Scale postgres-db connection pool temporarily (max_connections: 200 → 400)",
    "Add exponential backoff with jitter to auth-service retry logic",
    "Set retry budget limit (max 3 attempts, 500ms cap) on DB calls",
    "Enable circuit breaker on auth-service → postgres-db connection",
  ],
  unknowns: [
    "Exact postgres-db max_connections value not observed in telemetry",
    "DB retry policy configuration unavailable (not exported to Prometheus)",
    "Whether Redis eviction contributed to additional DB load is unconfirmed",
  ],
  similarIncidents: [
    { id: "INC-142", similarity: 0.89, fix: "Rollback deployment v1.28.1", daysAgo: 47 },
    { id: "INC-091", similarity: 0.74, fix: "Connection pool scaling", daysAgo: 103 },
  ],
};
