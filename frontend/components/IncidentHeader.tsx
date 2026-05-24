"use client";
import { useDashboard } from "@/lib/DashboardContext";
import { MOCK_SCENARIOS } from "@/lib/mockData";
import { AlertTriangle, Zap, RotateCcw, Play, Pause } from "lucide-react";

const SYSTEM_NODES = [
  { label: "INGEST",    state: "ok"     as const },
  { label: "CORRELATE", state: "ok"     as const },
  { label: "RCA ENGINE",state: "active" as const },
  { label: "LANGGRAPH", state: "ok"     as const },
];

export function IncidentHeader() {
  const { state, actions, meta } = useDashboard();

  return (
    <header
      role="banner"
      style={{
        background: "var(--surface-card)",
        borderBottom: "1px solid var(--border-dim)",
        height: "48px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "0 14px",
        flexShrink: 0,
        zIndex: "var(--z-raised)",
        position: "relative",
      }}
    >
      {/* ── Logo ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div
          style={{
            width: "26px", height: "26px",
            background: "linear-gradient(135deg, var(--sev-info) 0%, var(--sev-ai) 100%)",
            borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Zap size={13} color="#04080f" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "12px", color: "var(--text-primary)", letterSpacing: "0.06em", lineHeight: 1.1 }}>
            AGENTIC SRE
          </div>
          <div style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "0.14em" }}>
            AI INCIDENT ANALYZER
          </div>
        </div>
      </div>

      <div className="header-divider" aria-hidden="true" />

      {/* ── Critical incident banner ── */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Active incident: Critical"
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(255,61,74,0.1)",
          border: "1px solid rgba(255,61,74,0.28)",
          borderRadius: "3px",
          padding: "3px 10px",
          flexShrink: 0,
        }}
      >
        <div className="live-dot live-dot--red" aria-hidden="true" />
        <span style={{ color: "var(--sev-critical)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em" }}>
          CRITICAL INCIDENT ACTIVE
        </span>
      </div>

      {/* ── Production badge ── */}
      <span className="badge badge--critical" style={{ flexShrink: 0 }}>
        <AlertTriangle size={8} aria-hidden="true" />
        PRODUCTION
      </span>

      <div className="header-divider" aria-hidden="true" />

      {/* ── Scenario selector ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <label
          htmlFor="scenario-select"
          style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.1em", cursor: "pointer" }}
        >
          SCENARIO
        </label>
        <select
          id="scenario-select"
          className="select"
          value={state.scenario}
          onChange={(e) => actions.setScenario(e.target.value)}
          style={{ color: "var(--sev-info)" }}
        >
          {MOCK_SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id.replace(/_/g, " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="header-divider" aria-hidden="true" />

      {/* ── Replay controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>REPLAY</span>

        {/* Reset */}
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={actions.reset}
          aria-label="Reset replay to beginning"
          title="Reset"
        >
          <RotateCcw size={11} aria-hidden="true" />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          className={`btn ${state.isPlaying ? "btn--active" : "btn--ghost"}`}
          onClick={actions.playPause}
          aria-label={state.isPlaying ? "Pause replay" : "Play replay"}
          aria-pressed={state.isPlaying}
          style={{ gap: "5px", padding: "3px 10px", minWidth: "60px" }}
        >
          {state.isPlaying
            ? <><Pause size={10} aria-hidden="true" /> PAUSE</>
            : <><Play  size={10} aria-hidden="true" /> PLAY</>
          }
        </button>

        {/* Speed */}
        <label htmlFor="speed-select" style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          SPEED
        </label>
        <select
          id="speed-select"
          className="select"
          value={state.replaySpeed}
          onChange={(e) => actions.setReplaySpeed(Number(e.target.value))}
          aria-label="Replay speed"
        >
          {[0.5, 1, 2, 4].map((v) => (
            <option key={v} value={v}>{v}×</option>
          ))}
        </select>

        {/* Timestamp display */}
        <output
          htmlFor="speed-select scenario-select"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--sev-info)",
            background: "var(--surface-card)",
            border: "1px solid var(--border-dim)",
            borderRadius: "3px",
            padding: "3px 9px",
            letterSpacing: "0.08em",
            fontVariantNumeric: "tabular-nums",
            minWidth: "68px",
            textAlign: "center",
          }}
          aria-label={`Current replay time: ${meta.currentTime}`}
        >
          {meta.currentTime}
        </output>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1, minWidth: 0 }} />

      {/* ── Pipeline status indicators ── */}
      <nav aria-label="Pipeline status" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {SYSTEM_NODES.map((node) => (
          <div
            key={node.label}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
            title={`${node.label}: ${node.state}`}
          >
            <div
              aria-hidden="true"
              style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: node.state === "active" ? "var(--sev-info)"    : "var(--sev-healthy)",
                boxShadow: node.state === "active"
                  ? "0 0 6px var(--sev-info)"
                  : "0 0 4px var(--sev-healthy)",
              }}
            />
            <span
              style={{ fontSize: "8.5px", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}
              aria-label={`${node.label} ${node.state === "active" ? "processing" : "online"}`}
            >
              {node.label}
            </span>
          </div>
        ))}
      </nav>
    </header>
  );
}
