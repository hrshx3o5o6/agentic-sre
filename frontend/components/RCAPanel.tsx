"use client";
import { useDashboard } from "@/lib/DashboardContext";
import { MOCK_RCA } from "@/lib/mockData";
import { AlertTriangle, CheckCircle, HelpCircle, TrendingUp } from "lucide-react";

/* ── Confidence radial gauge ─────────────────────────────────────────── */
function ConfidenceGauge({ value }: { value: number }) {
  const R    = 40;
  const circ = 2 * Math.PI * R;
  const fill = circ * value;
  const color = value >= 0.85 ? "var(--sev-healthy)" : value >= 0.65 ? "var(--sev-warning)" : "var(--sev-critical)";
  const pct  = Math.round(value * 100);

  return (
    <figure
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: 0 }}
      aria-label={`Confidence score: ${pct}%`}
    >
      <svg
        width="96" height="96"
        className="confidence-ring"
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle cx="48" cy="48" r={R} fill="none" stroke="var(--border-dim)" strokeWidth="6" />
        {/* Filled arc */}
        <circle
          cx="48" cy="48" r={R}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          className="fill-arc"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <figcaption
        style={{
          position: "absolute",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div className="metric-val" style={{ fontSize: "18px", color, filter: `drop-shadow(0 0 6px ${color})` }}>
          {pct}%
        </div>
        <div style={{ fontSize: "7.5px", color: "var(--text-muted)", letterSpacing: "0.12em", marginTop: "1px" }}>
          CONFIDENCE
        </div>
      </figcaption>
    </figure>
  );
}

/* ── Section wrapper ─────────────────────────────────────────────────── */
function Section({ id, title, color, icon, children }: {
  id: string; title: string; color: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} style={{ marginBottom: "12px" }}>
      <h3
        id={id}
        style={{
          fontSize: "9px", fontWeight: 700, color, letterSpacing: "0.14em",
          marginBottom: "7px", paddingBottom: "4px",
          borderBottom: `1px solid ${color}22`,
          display: "flex", alignItems: "center", gap: "5px",
          textTransform: "uppercase", fontFamily: "var(--font-display)",
        }}
      >
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ── Main panel ──────────────────────────────────────────────────────── */
export function RCAPanel() {
  const { meta } = useDashboard();
  const rca = MOCK_RCA;

  return (
    <section
      className="panel"
      aria-label="AI Root Cause Analysis panel"
    >
      {/* Header */}
      <div className="panel__header" style={{ color: "var(--sev-ai)" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <polygon points="5,1 9,9 1,9" fill="none" stroke="var(--sev-ai)" strokeWidth="1.5" />
        </svg>
        <h2 style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit", flex: 1 }}>
          AI RCA Intelligence
        </h2>
        {meta.rcaVisible && (
          <span className="badge badge--ai" aria-label="Analysis generated">
            GENERATED
          </span>
        )}
      </div>

      <div className="panel__body" style={{ padding: "10px" }}>
        {/* ── Not-yet-ready state ── */}
        {!meta.rcaVisible ? (
          <div
            role="status"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "200px",
              color: "var(--text-muted)", gap: "12px", textAlign: "center",
              opacity: 0.5,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="16" stroke="var(--border-mid)" strokeWidth="2" />
              <path d="M18 10v8l5 3" stroke="var(--border-mid)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: "11px", lineHeight: 1.6, margin: 0 }}>
              AI analysis begins<br />after incident replay completes
            </p>
          </div>
        ) : (
          <>
            {/* ── Confidence gauge + incident ID ── */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "10px", marginBottom: "12px",
                background: "var(--surface-card)", border: "1px solid var(--border-dim)",
                borderRadius: "4px",
              }}
            >
              <ConfidenceGauge value={rca.confidenceScore} />
              <div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "4px" }}>INCIDENT</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", marginBottom: "3px", letterSpacing: "0.04em" }}>
                  {rca.incidentId}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  LangGraph · Groq LLM · {rca.hypotheses.length} hypotheses
                </div>
              </div>
            </div>

            {/* ── Executive summary ── */}
            <Section id="rca-summary" title="Executive Summary" color="var(--sev-info)" icon={<TrendingUp size={9} />}>
              <p style={{ fontSize: "10.5px", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, textWrap: "pretty" }}>
                {rca.summary}
              </p>
            </Section>

            {/* ── Root Cause Card ── */}
            <div
              role="region"
              aria-label="Probable root cause"
              style={{
                background: "rgba(255,61,74,0.06)",
                border: "1px solid rgba(255,61,74,0.25)",
                borderRadius: "4px",
                padding: "10px 12px",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontSize: "9px", color: "var(--sev-critical)", letterSpacing: "0.14em", fontWeight: 700, marginBottom: "7px", display: "flex", alignItems: "center", gap: "5px" }}>
                <AlertTriangle size={9} aria-hidden="true" />
                PROBABLE ROOT CAUSE
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-primary)", lineHeight: 1.55, fontWeight: 500, margin: 0, textWrap: "pretty" }}>
                {rca.probableRootCause}
              </p>
            </div>

            {/* ── Hypotheses ── */}
            <Section id="rca-hypotheses" title="Alternative Hypotheses" color="var(--sev-warning)" icon={<HelpCircle size={9} />}>
              {rca.hypotheses.map((h, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "8px", padding: "8px 10px",
                    background: "var(--surface-card)", border: "1px solid var(--border-dim)",
                    borderRadius: "3px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-primary)", flex: 1, paddingRight: "8px", textWrap: "balance" }}>
                      {h.title}
                    </span>
                    <span
                      className="metric-val"
                      style={{ fontSize: "12px", color: i === 0 ? "var(--sev-critical)" : "var(--text-muted)", flexShrink: 0 }}
                      aria-label={`Probability: ${Math.round(h.probability * 100)}%`}
                    >
                      {Math.round(h.probability * 100)}%
                    </span>
                  </div>

                  {/* Probability bar — not color-only: also shows number above */}
                  <div className="prob-bar" role="progressbar" aria-valuenow={Math.round(h.probability * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Probability ${Math.round(h.probability * 100)}%`}>
                    <div
                      className="prob-bar__fill"
                      style={{
                        width: `${h.probability * 100}%`,
                        background: i === 0 ? "var(--sev-critical)" : "var(--border-bright)",
                      }}
                    />
                  </div>

                  <p style={{ fontSize: "9.5px", color: "var(--text-secondary)", lineHeight: 1.55, margin: "5px 0 0", textWrap: "pretty" }}>
                    {h.causalExplanation}
                  </p>
                </div>
              ))}
            </Section>

            {/* ── Remediation plan ── */}
            <Section id="rca-remediation" title="Remediation Plan" color="var(--sev-healthy)" icon={<CheckCircle size={9} />}>
              <ol style={{ listStyle: "none", padding: 0 }}>
                {rca.remediationPlan.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      marginBottom: "6px", padding: "7px 9px",
                      background: "var(--surface-card)", border: "1px solid var(--border-dim)",
                      borderRadius: "3px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        border: "1px solid var(--sev-healthy)", color: "var(--sev-healthy)",
                        fontSize: "8.5px", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p style={{ fontSize: "9.5px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0, textWrap: "pretty" }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Section>

            {/* ── Unknowns ── */}
            <Section id="rca-unknowns" title="Unknowns" color="var(--text-muted)" icon={<HelpCircle size={9} />}>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {rca.unknowns.map((u, i) => (
                  <li key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                    <span aria-hidden="true" style={{ color: "var(--border-bright)", fontSize: "11px", flexShrink: 0, lineHeight: 1.4 }}>?</span>
                    <p style={{ fontSize: "9.5px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0, textWrap: "pretty" }}>{u}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ── Similar incidents ── */}
            <Section id="rca-similar" title="Similar Past Incidents" color="var(--sev-ai)" icon={<TrendingUp size={9} />}>
              {rca.similarIncidents.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(167,139,250,0.05)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    borderRadius: "3px",
                    marginBottom: "7px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--sev-ai)", fontFamily: "var(--font-display)" }}>
                      {s.id}
                    </span>
                    <span
                      style={{ fontSize: "10px", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}
                      aria-label={`${Math.round(s.similarity * 100)}% similarity`}
                    >
                      {Math.round(s.similarity * 100)}% match
                    </span>
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "3px" }}>
                    <time>{s.daysAgo} days ago</time>
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--sev-healthy)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle size={8} aria-hidden="true" />
                    {s.fix}
                  </div>
                </div>
              ))}
            </Section>
          </>
        )}
      </div>
    </section>
  );
}
