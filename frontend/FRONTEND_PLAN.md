# AI Incident Root Cause Analyzer — Frontend Architecture & UX Masterplan

## Frontend Vision

The frontend should not feel like:
- a chatbot
- a log viewer
- a generic admin panel

It should feel like:

> An AI-powered operational command center actively analyzing a live production outage.

The goal is to maximize:
- perceived intelligence
- operational realism
- visual causality
- demo immersion
- enterprise observability aesthetics

The frontend should visually resemble:
- Datadog
- Grafana
- Kibana
- New Relic
- Splunk

while maintaining a futuristic AI-assisted operations feel.

---

# 1. Core Frontend Stack

## Recommended Stack

### Framework
- Next.js (App Router)

### Styling
- TailwindCSS

### Component Library
- shadcn/ui

### Animation
- Framer Motion

### Charts
- Recharts

### Graph Visualization
Choose one:
- React Flow
- Cytoscape.js
- Visx

### Icons
- Lucide React

### State Management
- Zustand

### Real-Time Communication
- WebSockets
OR
- Server-Sent Events (simpler)

---

# 2. High-Level Frontend Architecture

```text
Frontend Layout
│
├── Left Panel
│   └── Service Dependency Graph
│
├── Center Panel
│   └── Live Incident Timeline
│
├── Right Panel
│   └── AI RCA Intelligence Panel
│
└── Bottom Metrics Panel
    └── Telemetry Charts
```

The layout should feel like:
- a mission control center
- a cyber defense console
- a distributed systems war room

NOT:
- a CRUD app
- a chat interface

---

# 3. Visual Design Language

## Theme

Dark mode ONLY.

### Recommended Palette
- Background: near-black / graphite
- Healthy services: green
- Warning services: amber
- Critical services: red
- AI insights: purple/cyan accents
- Timeline events: severity-colored

---

# Typography

Use:
- Inter
- Geist
- IBM Plex Sans

Large:
- confidence scores
- incident banners
- service status

Small:
- trace IDs
- timestamps
- metadata

---

# Motion Principles

The system should always feel alive.

Use subtle:
- pulses
- metric animations
- graph edge flow
- timeline streaming
- glow effects
- severity transitions

Avoid:
- flashy gaming aesthetics
- heavy neon cyberpunk overload

Goal:
enterprise observability realism.

---

# 4. Main Dashboard Layout

## A. Top Header Bar

### Purpose
Global incident overview.

### Include
- System name/logo
- Active incident count
- Environment badge (Production)
- Current system status
- Replay controls
- Current scenario name
- Incident severity banner

### Example

```text
🔥 CRITICAL INCIDENT ACTIVE
Scenario: bad_deployment_retry_storm
Environment: production
```

---

# 5. Left Panel — Service Dependency Graph

## Purpose
Visualize distributed system topology and failure propagation.

---

# Graph Structure

Example:

```text
frontend
   ↓
auth-service
   ↓
postgres-db
```

---

# Node States

### Healthy
- green glow
- soft pulse

### Warning
- amber outline
- subtle jitter

### Critical
- red glow
- animated pulse
- edge flickering

---

# Edge Animations

Edges should show:
- traffic flow
- request movement
- propagation direction

During failures:
- edge turns red
- pulse speed increases

---

# Hover Interactions

On hover show:
- CPU usage
- latency
- request rate
- 5xx count
- pod status
- last deployment

---

# Suggested Graph Features

## Blast Radius Visualization

If postgres-db fails:
- downstream nodes glow red
- dependency chains animate

This visually demonstrates:
causal propagation.

---

# 6. Center Panel — Live Incident Timeline

## MOST IMPORTANT COMPONENT

This is the emotional centerpiece of the product.

---

# Purpose

Visually reconstruct:

```text
what happened
in what order
and why.
```

---

# Timeline Structure

Each event card should include:
- timestamp
- severity
- source
- service
- summary
- trace ID
- cluster count

---

# Event Styling

## Deployment Events
Blue/purple deployment markers.

## Log Errors
Red cards.

## Alerts
Large critical banners.

## Metric Spikes
Animated graph inserts.

---

# Timeline Features

## Auto-Streaming
Events should appear progressively.

## Replay Mode
Allow:
- play
- pause
- rewind
- step-through

## Cluster Expansion
Expandable compressed events:

```text
[Cluster x4]
```

should expand into raw logs.

---

# Suggested Timeline Flow

```text
21:00 Deployment Triggered
21:01 Retry Storm Begins
21:02 DB Saturation Alert Fires
21:03 HTTP 5xx Explosion
21:04 AI RCA Generated
```

---

# 7. Right Panel — AI RCA Intelligence Panel

## Purpose

Display the AI-generated incident reasoning.

The panel should feel like:

> An AI SRE assistant briefing operators.

NOT:

> A generic LLM response.

---

# RCA Panel Sections

## Incident Summary
Short executive summary.

---

## Root Cause

Large highlighted card.

Example:

```text
Probable Root Cause
Faulty auth-service deployment introduced retry amplification.
```

---

## Confidence Score

Large percentage visualization.

Use:
- radial progress indicator
- animated confidence meter

---

## Evidence Section

List evidence-backed findings.

Example:

```text
- Retry storm detected
- DB saturation increased from 45% → 100%
- 5xx errors surged after deployment
```

---

## Suggested Mitigations

Keep concise.

Avoid:
- hallucinated infra assumptions
- massive runbooks
- fake YAML references

Preferred:

```text
- Roll back deployment
- Reduce retry amplification
- Increase DB connection pool temporarily
```

---

## Unknowns Section

Very important for realism.

Example:

```text
Unknowns:
- DB retry policy configuration unavailable
- Exact connection pool size not observed
```

This dramatically improves trust.

---

# 8. Bottom Panel — Telemetry Metrics

## Purpose
Reinforce operational realism.

---

# Suggested Charts

## DB Connections Utilization

### Style
- live animated line graph
- threshold indicators

---

## HTTP 5xx Rate

### Include
- spikes
- incident markers
- deployment overlays

---

## Latency

Track:
- p50
- p95
- p99

---

## Request Throughput

Optional but useful.

---

# 9. Incident Replay Engine UI

## Extremely Important

The incident should replay live.

This creates:

```text
AI operations center realism
```

---

# Replay Controls

Include:
- play
- pause
- speed control
- replay
- reset

---

# Replay Flow

## Healthy State
Everything green.

## Deployment Event
Deployment marker appears.

## Early Metrics Spike
Metrics rise gradually.

## Retry Storm
Timeline floods.

## Alert Explosion
Critical banners appear.

## AI RCA Trigger
Right panel populates.

---

# 10. Multi-Incident Feed

## Add Enterprise Realism

Sidebar containing:
- Active Incidents
- Resolved Incidents
- Historical Incidents

---

# Example

```text
#ACTIVE
INC-204 retry_storm
INC-198 redis_latency

#RESOLVED
INC-177 dns_outage
```

---

# 11. Historical Incident Memory UI

## Purpose
Show similar incidents.

---

# Suggested Card

```text
Similar Incident Found

Incident #12
Similarity: 91%

Previous Fix:
Rollback deployment
```

This strongly reinforces:
AI intelligence perception.

---

# 12. Trace Correlation View

## Optional High-Impact Feature

Allow users to inspect:

```text
frontend request
    ↓
auth-service retries
    ↓
postgres timeout
```

This creates:
- distributed tracing realism
- infrastructure depth
- causal explainability

---

# 13. Real-Time Data Flow

## Recommended Architecture

```text
Backend
   ↓
WebSocket/SSE
   ↓
Frontend Event Store
   ↓
Timeline + Graph Updates
```

---

# Suggested Frontend State Model

```typescript
interface IncidentState {
  activeIncident: Incident
  timelineEvents: TimelineEvent[]
  graphState: ServiceGraph
  metrics: MetricSeries[]
  aiReport?: RCAReport
}
```

---

# 14. Frontend Folder Structure

```text
frontend/
├── app/
├── components/
│   ├── dashboard/
│   ├── timeline/
│   ├── graph/
│   ├── metrics/
│   ├── rca/
│   └── replay/
├── hooks/
├── lib/
├── services/
├── store/
├── styles/
└── types/
```

---

# 15. Suggested Frontend Components

## Dashboard Shell
Main grid layout.

## ServiceGraph
Topology renderer.

## IncidentTimeline
Animated event feed.

## RCAInsightPanel
AI analysis renderer.

## MetricCard
Single metric graph.

## IncidentReplayControls
Replay engine controls.

## BlastRadiusOverlay
Dependency propagation visualizer.

## SimilarIncidentsCard
Historical memory widget.

---

# 16. Demo Optimization Features

## Add Controlled Cinematic Timing

Do NOT flood the UI instantly.

Instead:
- stagger events
- delay RCA generation slightly
- progressively escalate severity

This creates narrative tension.

---

# Suggested Demo Timing

```text
0s Healthy system
5s Deployment begins
10s Metrics rise
15s Retry storm
20s Alert fires
25s AI RCA generated
```

---

# 17. Noise Injection

## Important Realism Feature

Add harmless background telemetry:
- unrelated warnings
- low-severity logs
- minor metric noise

This makes:
AI correlation appear smarter.

---

# 18. Frontend Performance Goals

The UI should feel:
- smooth
- responsive
- real-time
- polished

Avoid:
- full-page rerenders
- laggy graph updates
- over-heavy animations

---

# 19. Frontend Philosophy

The frontend should communicate:

```text
The system understands infrastructure causality.
```

NOT:

```text
The system is summarizing logs.
```

That distinction is critical.

---

# 20. Final UX Goal

The final experience should make judges feel:

```text
This looks like a real enterprise AI operations platform.
```

The frontend is not merely presentation.

It is:
- the storytelling layer
- the operational immersion layer
- the perceived intelligence layer
- the emotional impact layer

Most of the project's perceived sophistication will come from:
- timeline reconstruction
- topology visualization
- replay choreography
- motion design
- AI RCA presentation
- blast-radius visualization

The frontend is the product.

