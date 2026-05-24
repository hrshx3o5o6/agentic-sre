"use client";
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import {
  MOCK_METRICS_DB_CONNECTIONS,
  MOCK_METRICS_5XX,
  MOCK_METRICS_LATENCY,
  MOCK_METRICS_THROUGHPUT,
} from "@/lib/mockData";

/* ── Accessible custom tooltip ───────────────────────────────────────── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      role="tooltip"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border-mid)",
        borderRadius: "3px",
        padding: "6px 10px",
        fontSize: "10px",
        fontFamily: "var(--font-mono)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: "5px", fontVariantNumeric: "tabular-nums" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "14px", marginBottom: "2px" }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <strong style={{ color: p.color, fontVariantNumeric: "tabular-nums" }}>
            {typeof p.value === "number" ? p.value.toFixed(p.value < 10 ? 1 : 0) : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

/* ── Metric card compound component ─────────────────────────────────── */
interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  unit: string;
  valueColor: string;
  incident?: boolean;
  children: React.ReactNode;
}

function MetricCard({ id, title, value, unit, valueColor, incident, children }: MetricCardProps) {
  return (
    <section
      aria-labelledby={id}
      style={{
        flex: 1,
        minWidth: 0,
        background: "var(--surface-panel)",
        border: `1px solid ${incident ? "rgba(255,61,74,0.25)" : "var(--border-dim)"}`,
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "5px 12px",
          borderBottom: "1px solid var(--border-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <h3
          id={id}
          style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
          <span
            className="metric-val"
            style={{ fontSize: "16px", color: valueColor }}
            aria-label={`Current value: ${value} ${unit}`}
          >
            {value}
          </span>
          <span style={{ fontSize: "8.5px", color: "var(--text-muted)" }}>{unit}</span>
        </div>
      </div>

      {/* Chart area — explicit height so Recharts ResponsiveContainer resolves > 0 */}
      <div style={{ flex: 1, padding: "4px 2px 4px 0", minHeight: 0, height: "100px" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Axis / grid shared styles ───────────────────────────────────────── */
const TICK_PROPS = { fill: "var(--text-muted)", fontSize: 8, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" } as const;
const GRID_PROPS = { strokeDasharray: "2 4" as const, stroke: "var(--border-dim)", vertical: false };

/* ── Main panel ──────────────────────────────────────────────────────── */
export function MetricsPanel() {
  return (
    <div
      style={{
        background: "var(--surface-panel)",
        borderTop: "1px solid var(--border-dim)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="panel__header">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <polyline points="1,8 3,4 5,6 7,2 9,5" fill="none" stroke="var(--sev-info)" strokeWidth="1.5" />
        </svg>
        <h2 style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
          Telemetry Metrics — Live
        </h2>
        <span style={{ marginLeft: "auto", fontSize: "9px", color: "var(--text-muted)" }}>
          postgres-db · auth-service · 21:00 → 21:04
        </span>
      </div>

      {/* Four charts row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px",
          height: "156px",
        }}
        role="region"
        aria-label="Telemetry charts"
      >
        {/* ── DB Connections ── */}
        <MetricCard id="metric-db" title="DB Connections Utilization" value="100" unit="%" valueColor="var(--sev-critical)" incident>
          {/* Screen reader data summary */}
          <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            DB connections peaked at 100% — saturation from 45% to 100% in 3 minutes.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_METRICS_DB_CONNECTIONS}>
              <defs>
                <linearGradient id="grad-db" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--sev-critical)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--sev-critical)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="t" tick={TICK_PROPS} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={TICK_PROPS} tickLine={false} axisLine={false} width={28} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              {/* Threshold lines — not color-only, also labeled */}
              <ReferenceLine y={80} stroke="var(--sev-warning)" strokeDasharray="3 3" strokeWidth={1} label={{ value: "80%", fill: "var(--sev-warning)", fontSize: 7 }} />
              <ReferenceLine y={95} stroke="var(--sev-critical)" strokeDasharray="2 2" strokeWidth={1} label={{ value: "95%", fill: "var(--sev-critical)", fontSize: 7 }} />
              <Area type="monotone" dataKey="value" name="DB Util %" stroke="var(--sev-critical)" fill="url(#grad-db)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* ── HTTP 5xx ── */}
        <MetricCard id="metric-5xx" title="HTTP 5xx Error Rate" value="92.1" unit="req/s" valueColor="var(--sev-critical)" incident>
          <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            HTTP 5xx error rate surged from 0 to 92 requests per second after deployment.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_METRICS_5XX}>
              <defs>
                <linearGradient id="grad-5xx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--sev-error)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--sev-error)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="t" tick={TICK_PROPS} tickLine={false} axisLine={false} />
              <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="5xx/s" stroke="var(--sev-error)" fill="url(#grad-5xx)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* ── Latency percentiles ── */}
        <MetricCard id="metric-lat" title="Latency Percentiles" value="8.9s" unit="p99" valueColor="var(--sev-warning)" incident>
          <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            p99 latency grew from 210ms to 9.8 seconds during the incident.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_METRICS_LATENCY}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="t" tick={TICK_PROPS} tickLine={false} axisLine={false} />
              <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} width={34} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}s` : `${v}ms`} />
              <Tooltip content={<ChartTooltip />} />
              {/* Legend with both icon and text — not color only */}
              <Legend
                iconSize={6}
                wrapperStyle={{ fontSize: "8px", paddingTop: "2px", color: "var(--text-muted)" }}
                formatter={(value) => <span style={{ color: "var(--text-muted)" }}>{value}</span>}
              />
              <Line type="monotone" dataKey="p50" name="p50" stroke="var(--sev-healthy)"  strokeWidth={1}   dot={false} activeDot={{ r: 2 }} />
              <Line type="monotone" dataKey="p95" name="p95" stroke="var(--sev-warning)"  strokeWidth={1}   dot={false} activeDot={{ r: 2 }} />
              <Line type="monotone" dataKey="p99" name="p99" stroke="var(--sev-critical)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* ── Throughput ── */}
        <MetricCard id="metric-rps" title="Request Throughput" value="390" unit="rps" valueColor="var(--sev-info)">
          <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            Request throughput dropped from 1840 to 390 requests per second during the incident.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_METRICS_THROUGHPUT}>
              <defs>
                <linearGradient id="grad-rps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--sev-info)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--sev-info)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="t" tick={TICK_PROPS} tickLine={false} axisLine={false} />
              <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} width={34} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="RPS" stroke="var(--sev-info)" fill="url(#grad-rps)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>
    </div>
  );
}
