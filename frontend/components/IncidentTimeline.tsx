"use client";
import { useDashboard } from "@/lib/DashboardContext";
import { MOCK_TIMELINE_EVENTS } from "@/lib/mockData";
import { useEffect, useRef, useState } from "react";

/* ── Visual styling per severity ─────────────────────────────────────── */
type SevKey = "critical" | "error" | "warning" | "info" | "debug";

const SEV: Record<SevKey, { label: string; color: string; cls: string }> = {
  critical: { label: "CRIT",  color: "var(--sev-critical)", cls: "event-card--critical" },
  error:    { label: "ERROR", color: "var(--sev-error)",    cls: "event-card--error"    },
  warning:  { label: "WARN",  color: "var(--sev-warning)",  cls: "event-card--warning"  },
  info:     { label: "INFO",  color: "var(--sev-info)",     cls: "event-card--info"     },
  debug:    { label: "DEBUG", color: "var(--sev-debug)",    cls: "event-card--debug"    },
};

/* Source abbreviation chips */
const SOURCE_CHIP: Record<string, { short: string; color: string }> = {
  github:       { short: "GH",  color: "var(--sev-ai)"      },
  loki:         { short: "LK",  color: "var(--sev-info)"     },
  prometheus:   { short: "PM",  color: "var(--sev-warning)"  },
  alertmanager: { short: "AM",  color: "var(--sev-critical)" },
  kubernetes:   { short: "K8",  color: "var(--sev-info)"     },
  rca_engine:   { short: "AI",  color: "var(--sev-ai)"       },
};

const TYPE_COLOR: Record<string, string> = {
  deployment:    "var(--sev-ai)",
  alert:         "var(--sev-critical)",
  metric_anomaly:"var(--sev-warning)",
  log:           "var(--text-secondary)",
  infra_change:  "var(--sev-info)",
};

export function IncidentTimeline() {
  const { state } = useDashboard();
  const { visibleEvents } = state;
  const events = MOCK_TIMELINE_EVENTS.slice(0, visibleEvents);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const prevCount  = useRef(0);

  // Scroll to top when new event appears (new event is at top)
  useEffect(() => {
    if (visibleEvents > prevCount.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    prevCount.current = visibleEvents;
  }, [visibleEvents]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section
      className="panel"
      aria-label="Live incident timeline"
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions"
    >
      {/* ── Header ── */}
      <div className="panel__header">
        <div className="live-dot live-dot--cyan" aria-hidden="true" />
        <h2 style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit", flex: 1 }}>
          Live Incident Timeline
        </h2>
        <span
          aria-label={`${events.length} of ${MOCK_TIMELINE_EVENTS.length} events loaded`}
          style={{ fontSize: "10px", color: "var(--sev-info)", fontVariantNumeric: "tabular-nums" }}
        >
          {events.length} / {MOCK_TIMELINE_EVENTS.length}
        </span>
      </div>

      {/* ── Window meta ── */}
      <div
        style={{
          padding: "4px 14px", borderBottom: "1px solid var(--border-dim)",
          display: "flex", alignItems: "center", gap: "20px", flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          WINDOW <span style={{ color: "var(--sev-info)", fontVariantNumeric: "tabular-nums" }}>21:00:00 → 21:04:00</span>
        </span>
        <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          INC-204 · auth-service · postgres-db
        </span>
      </div>

      {/* ── Events list ── */}
      <div
        ref={scrollRef}
        className="panel__body"
        role="feed"
        aria-label="Incident events"
        aria-busy={visibleEvents < MOCK_TIMELINE_EVENTS.length}
      >
        {events.length === 0 && (
          <div
            role="status"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "180px",
              color: "var(--text-muted)", fontSize: "11px", gap: "10px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="none" stroke="var(--border-mid)" strokeWidth="2" />
              <line x1="16" y1="9" x2="16" y2="17" stroke="var(--border-mid)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="22" r="1.5" fill="var(--border-mid)" />
            </svg>
            <span>Waiting for incident events…</span>
          </div>
        )}

        {/* Events render newest-first (reversed for visual) */}
        {[...events].reverse().map((event, idx) => {
          const sev       = SEV[event.severity as SevKey] ?? SEV.info;
          const srcChip   = SOURCE_CHIP[event.source] ?? { short: event.source.slice(0,2).toUpperCase(), color: "var(--text-muted)" };
          const typeColor = TYPE_COLOR[event.type] ?? "var(--text-muted)";
          const isNewest  = idx === 0 && visibleEvents <= MOCK_TIMELINE_EVENTS.length;
          const isCluster = event.cluster > 1;
          const isExpanded = expanded.has(event.id);

          return (
            <article
              key={event.id}
              className={`event-card ${sev.cls} ${isNewest ? "event-enter" : ""}`}
              aria-label={`${sev.label} event at ${event.timestamp} from ${event.source}: ${event.message}`}
            >
              {/* Row 1: time + badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                <time
                  dateTime={`2026-05-23T${event.timestamp}Z`}
                  style={{ fontSize: "9.5px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", flexShrink: 0, letterSpacing: "0.06em" }}
                >
                  {event.timestamp}
                </time>

                {/* Severity */}
                <span
                  style={{
                    fontSize: "8.5px", fontWeight: 700, color: sev.color,
                    background: `${sev.color}14`, border: `1px solid ${sev.color}40`,
                    borderRadius: "2px", padding: "1px 5px", letterSpacing: "0.1em", flexShrink: 0,
                  }}
                  aria-label={`Severity: ${event.severity}`}
                >
                  {sev.label}
                </span>

                {/* Source chip */}
                <span
                  style={{
                    fontSize: "8px", fontWeight: 700, color: srcChip.color,
                    background: "var(--surface-card)", border: "1px solid var(--border-dim)",
                    borderRadius: "2px", padding: "1px 5px", letterSpacing: "0.08em", flexShrink: 0,
                  }}
                  aria-label={`Source: ${event.source}`}
                >
                  {srcChip.short}
                </span>

                {/* Event type */}
                <span style={{ fontSize: "8.5px", color: typeColor, letterSpacing: "0.06em", flexShrink: 0 }}>
                  {event.type.replace(/_/g, "·").toUpperCase()}
                </span>

                {/* Service — right-aligned */}
                <span style={{ fontSize: "9px", color: "var(--text-secondary)", marginLeft: "auto", flexShrink: 0 }}>
                  {event.service}
                </span>

                {/* Cluster toggle */}
                {isCluster && (
                  <button
                    type="button"
                    onClick={() => toggle(event.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} cluster of ${event.cluster} similar events`}
                    style={{
                      fontSize: "9px", color: "var(--sev-warning)",
                      background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.28)",
                      borderRadius: "10px", padding: "1px 7px", cursor: "pointer",
                      fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0,
                    }}
                  >
                    ×{event.cluster} {isExpanded ? "▴" : "▾"}
                  </button>
                )}
              </div>

              {/* Row 2: message — handle long content */}
              <p
                style={{
                  fontSize: "10.5px",
                  color: event.severity === "critical" || event.severity === "error" ? "var(--text-primary)" : "var(--text-secondary)",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-mono)",
                  overflowWrap: "break-word",
                  wordBreak: "break-all",
                  margin: 0,
                }}
              >
                {event.message}
              </p>

              {/* Row 3: trace ID */}
              {event.traceId && (
                <div style={{ marginTop: "4px", fontSize: "9px", color: "var(--text-muted)" }}>
                  <span>trace_id=</span>
                  <code style={{ color: "var(--text-code)", fontFamily: "var(--font-mono)" }}>{event.traceId}</code>
                </div>
              )}

              {/* Cluster expanded view */}
              {isCluster && isExpanded && (
                <div
                  style={{
                    marginTop: "8px",
                    background: "var(--surface-void)",
                    border: "1px solid var(--border-dim)",
                    borderRadius: "3px",
                    padding: "8px 10px",
                  }}
                  role="region"
                  aria-label={`${event.cluster} raw events in cluster`}
                >
                  {Array.from({ length: event.cluster }).map((_, i) => (
                    <div key={i} style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "3px" }}>
                      <time style={{ color: "var(--text-code)", marginRight: "8px", fontVariantNumeric: "tabular-nums" }}>
                        21:01:{String(10 + i * 3).padStart(2, "0")}
                      </time>
                      {event.message} <span style={{ opacity: 0.55 }}>(attempt {i + 1})</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}

        {/* AI RCA complete notice */}
        {visibleEvents >= MOCK_TIMELINE_EVENTS.length && (
          <div
            role="status"
            aria-live="polite"
            style={{
              margin: "10px 12px",
              padding: "10px 14px",
              background: "rgba(167,139,250,0.07)",
              border: "1px solid rgba(167,139,250,0.25)",
              borderRadius: "4px",
              display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <div className="live-dot live-dot--violet" aria-hidden="true" />
            <div>
              <div style={{ fontSize: "10px", color: "var(--sev-ai)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "2px" }}>
                AI RCA ANALYSIS COMPLETE
              </div>
              <div style={{ fontSize: "9px", color: "var(--text-secondary)" }}>
                Root cause identified · 91% confidence · see AI RCA panel →
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
