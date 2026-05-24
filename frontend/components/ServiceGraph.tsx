"use client";
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from "@/lib/mockData";
import { useState } from "react";

/* ── Types ────────────────────────────────────────────────────────────── */
type NodeState = "healthy" | "warning" | "critical";

/* ── Design tokens per state — all meet 4.5:1 contrast ─────────────── */
const NODE_THEME: Record<NodeState, {
  stroke: string; glow: string; text: string; bg: string; pattern: string;
}> = {
  healthy:  { stroke:"var(--sev-healthy)", glow:"var(--glow-healthy)", text:"var(--sev-healthy)", bg:"rgba(0,230,118,0.06)",   pattern:"●" },
  warning:  { stroke:"var(--sev-warning)", glow:"var(--glow-warning)", text:"var(--sev-warning)", bg:"rgba(245,166,35,0.07)", pattern:"◆" },
  critical: { stroke:"var(--sev-critical)",glow:"var(--glow-critical)",text:"var(--sev-critical)",bg:"rgba(255,61,74,0.08)",   pattern:"▲" },
};

/* ── Static layout (% of SVG viewport) ─────────────────────────────── */
const POSITIONS: Record<string, { x: number; y: number }> = {
  "frontend":     { x: 50,  y: 8   },
  "api-gateway":  { x: 50,  y: 28  },
  "auth-service": { x: 22,  y: 52  },
  "user-service": { x: 78,  y: 52  },
  "redis-cache":  { x: 22,  y: 74  },
  "postgres-db":  { x: 50,  y: 92  },
};

const W = 260, H = 480;
function pct(p: { x: number; y: number }) {
  return { x: (p.x / 100) * W, y: (p.y / 100) * H };
}

/* ── Tooltip data shape ──────────────────────────────────────────────── */
interface TooltipNode { node: typeof MOCK_GRAPH_NODES[0]; x: number; y: number }

/* ── Edge color ──────────────────────────────────────────────────────── */
function edgeColor(state: string) {
  if (state === "critical") return "var(--sev-critical)";
  if (state === "warning")  return "var(--sev-warning)";
  return "var(--sev-healthy)";
}

export function ServiceGraph() {
  const [tooltip, setTooltip] = useState<TooltipNode | null>(null);

  return (
    <div className="panel" aria-label="Service dependency graph">
      {/* Header */}
      <div className="panel__header">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="4" fill="none" stroke="var(--sev-info)" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.5" fill="var(--sev-info)" />
        </svg>
        <h2 style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit", flex: 1 }}>
          Service Dependency Graph
        </h2>
        <span style={{ fontSize: "9px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
          {MOCK_GRAPH_NODES.filter(n => n.state === "critical").length}↑ CRITICAL
        </span>
      </div>

      {/* Legend */}
      <div
        role="legend"
        aria-label="Node state legend"
        style={{
          display: "flex", gap: "12px", padding: "5px 12px",
          borderBottom: "1px solid var(--border-dim)", flexShrink: 0,
        }}
      >
        {(["healthy","warning","critical"] as NodeState[]).map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              aria-hidden="true"
              style={{
                width: "8px", height: "8px", borderRadius: "2px",
                background: NODE_THEME[s].bg,
                border: `1px solid ${NODE_THEME[s].stroke}`,
              }}
            />
            <span style={{ fontSize: "8.5px", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
              {s.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <div
        style={{ flex: 1, padding: "8px", position: "relative", overflow: "hidden", minHeight: 0 }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Screen-reader summary */}
        <p className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          Service dependency graph showing {MOCK_GRAPH_NODES.length} services.
          {MOCK_GRAPH_NODES.filter(n => n.state === "critical").length} critical,{" "}
          {MOCK_GRAPH_NODES.filter(n => n.state === "warning").length} warning,{" "}
          {MOCK_GRAPH_NODES.filter(n => n.state === "healthy").length} healthy.
        </p>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
          role="img"
          aria-label="Service topology diagram"
        >
          <defs>
            {/* Grid dot pattern */}
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="0.7" fill="rgba(26,40,64,0.6)" />
            </pattern>
            {/* Glow filters */}
            <filter id="f-red" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="f-amber" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width={W} height={H} fill="url(#dots)" />

          {/* ── Edges ── */}
          {MOCK_GRAPH_EDGES.map((edge) => {
            const src = pct(POSITIONS[edge.source]);
            const tgt = pct(POSITIONS[edge.target]);
            const color = edgeColor(edge.state);
            const isCrit = edge.state === "critical";
            const isWarn = edge.state === "warning";

            return (
              <g key={edge.id} aria-label={`${edge.source} to ${edge.target}: ${edge.state}`}>
                {/* Base edge line */}
                <line
                  x1={src.x} y1={src.y + 20}
                  x2={tgt.x} y2={tgt.y - 20}
                  stroke={color}
                  strokeWidth={isCrit ? 1.5 : 1}
                  strokeOpacity={edge.state === "healthy" ? 0.3 : 0.55}
                  strokeDasharray={edge.state !== "healthy" ? "5 4" : undefined}
                />

                {/* Animated flow packet — transform only */}
                {edge.state !== "healthy" && (
                  <circle r="2.5" fill={color} opacity="0.85">
                    <animateMotion
                      dur={isCrit ? "1s" : "1.8s"}
                      repeatCount="indefinite"
                      path={`M${src.x},${src.y + 20} L${tgt.x},${tgt.y - 20}`}
                    />
                  </circle>
                )}

                {/* Arrow */}
                <polygon
                  points={`${tgt.x},${tgt.y - 20} ${tgt.x - 4},${tgt.y - 28} ${tgt.x + 4},${tgt.y - 28}`}
                  fill={color} opacity="0.65"
                />
              </g>
            );
          })}

          {/* ── Nodes ── */}
          {MOCK_GRAPH_NODES.map((node) => {
            const pos  = pct(POSITIONS[node.id]);
            const theme = NODE_THEME[node.state as NodeState];
            const nW = 92, nH = 38;
            const isHot = node.state === "critical" || node.state === "warning";

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x - nW / 2}, ${pos.y - nH / 2})`}
                role="button"
                tabIndex={0}
                aria-label={`${node.label}: CPU ${node.cpu}%, latency ${node.latency}ms, ${node.errors} errors — ${node.state}`}
                style={{ cursor: "pointer", outline: "none" }}
                onMouseEnter={() => setTooltip({ node, x: pos.x, y: pos.y })}
                onFocus={() => setTooltip({ node, x: pos.x, y: pos.y })}
                onMouseLeave={() => setTooltip(null)}
                onBlur={() => setTooltip(null)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setTooltip({ node, x: pos.x, y: pos.y }); }}
              >
                {/* Glow aura — opacity animation only */}
                {isHot && (
                  <rect x="-5" y="-5" width={nW + 10} height={nH + 10} rx="7"
                    fill={theme.glow}
                    style={{ filter: node.state === "critical" ? "url(#f-red)" : "url(#f-amber)" }}
                  >
                    <animate
                      attributeName="opacity"
                      values={node.state === "critical" ? "0.35;1;0.35" : "0.2;0.65;0.2"}
                      dur={node.state === "critical" ? "1.3s" : "2.2s"}
                      repeatCount="indefinite"
                    />
                  </rect>
                )}

                {/* Node body */}
                <rect
                  width={nW} height={nH} rx="4"
                  fill={theme.bg}
                  stroke={theme.stroke}
                  strokeWidth={node.state === "critical" ? 1.5 : 1}
                />

                {/* Service label */}
                <text x={nW / 2} y="15" textAnchor="middle"
                  fill={theme.text} fontSize="9.5" fontWeight="700"
                  fontFamily="var(--font-display)" letterSpacing="0.04em"
                >
                  {node.label}
                </text>

                {/* Metrics sub-label */}
                <text x={nW / 2} y="28" textAnchor="middle"
                  fill="var(--text-muted)" fontSize="7.5"
                  fontFamily="var(--font-mono)"
                >
                  {`CPU ${node.cpu}% · ${node.latency}ms`}
                </text>

                {/* State dot */}
                <circle cx={nW - 9} cy="9" r="4" fill={theme.stroke}>
                  {isHot && (
                    <animate attributeName="opacity"
                      values="1;0.2;1"
                      dur={node.state === "critical" ? "0.9s" : "1.8s"}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            );
          })}
        </svg>

        {/* ── Hover Tooltip ── */}
        {tooltip && (
          <div
            role="tooltip"
            className="graph-tooltip"
            style={{
              left: tooltip.x > W / 2 ? undefined : "10px",
              right: tooltip.x > W / 2 ? "10px" : undefined,
              top: `${Math.max(8, (tooltip.y / H) * 100 - 10)}%`,
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "7px", fontFamily: "var(--font-display)", textWrap: "balance" }}>
              {tooltip.node.label}
            </div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ display: "none" }}>
                <tr><th>Metric</th><th>Value</th></tr>
              </thead>
              <tbody>
                {[
                  { label: "CPU",     val: `${tooltip.node.cpu}%`,           color: tooltip.node.cpu > 80      ? "var(--sev-critical)" : "var(--text-primary)" },
                  { label: "Latency", val: `${tooltip.node.latency}ms`,      color: tooltip.node.latency > 500 ? "var(--sev-warning)"  : "var(--text-primary)" },
                  { label: "RPS",     val: `${tooltip.node.rps}`,            color: "var(--text-primary)" },
                  { label: "5xx",     val: `${tooltip.node.errors}`,         color: tooltip.node.errors > 0    ? "var(--sev-warning)"  : "var(--sev-healthy)" },
                  { label: "State",   val: tooltip.node.state.toUpperCase(), color: NODE_THEME[tooltip.node.state as NodeState].text },
                ].map((row) => (
                  <tr key={row.label}>
                    <td style={{ fontSize: "9px", color: "var(--text-muted)", paddingBottom: "3px", paddingRight: "12px" }}>{row.label}</td>
                    <td style={{ fontSize: "9px", color: row.color, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", textAlign: "right" }}>
                      {row.val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
