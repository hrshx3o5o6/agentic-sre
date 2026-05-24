"use client";
import { MOCK_INCIDENTS } from "@/lib/mockData";

const SEV_COLOR: Record<string, string> = {
  critical: "var(--sev-critical)",
  warning:  "var(--sev-warning)",
  info:     "var(--sev-info)",
};

export function IncidentSidebar() {
  const active   = MOCK_INCIDENTS.filter((i) => i.status === "active");
  const resolved = MOCK_INCIDENTS.filter((i) => i.status === "resolved");

  return (
    <aside
      aria-label="Incident feed"
      style={{
        width: "188px",
        background: "var(--surface-panel)",
        borderRight: "1px solid var(--border-dim)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
      }}
    >
      {/* Active section */}
      <section aria-labelledby="active-heading">
        <div
          className="panel__header"
          style={{ color: "var(--sev-critical)" }}
        >
          <div className="live-dot live-dot--red" aria-hidden="true" />
          <h2 id="active-heading" style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
            Active
          </h2>
          <span
            aria-label={`${active.length} active incidents`}
            style={{
              marginLeft: "auto",
              background: "rgba(255,61,74,0.12)",
              color: "var(--sev-critical)",
              borderRadius: "10px",
              padding: "1px 7px",
              fontSize: "10px",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {active.length}
          </span>
        </div>

        <ul role="list" aria-label="Active incidents" style={{ listStyle: "none" }}>
          {active.map((inc) => (
            <li key={inc.id}>
              <button
                type="button"
                className="incident-item incident-item--active"
                style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
                aria-label={`Incident ${inc.id}: ${inc.scenario} on ${inc.service}, ${inc.severity} severity, ${inc.age} ago`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}>
                    {inc.id}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{ width: "6px", height: "6px", borderRadius: "50%", background: SEV_COLOR[inc.severity] ?? "var(--sev-info)", flexShrink: 0 }}
                  />
                </div>
                <div style={{ fontSize: "10px", color: SEV_COLOR[inc.severity] ?? "var(--sev-info)", marginBottom: "2px", textTransform: "lowercase" }}>
                  {inc.scenario.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  {inc.service} · <time dateTime={`PT${inc.age}`}>{inc.age} ago</time>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Resolved section */}
      <section aria-labelledby="resolved-heading">
        <div className="panel__header">
          <h2 id="resolved-heading" style={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
            Resolved
          </h2>
          <span
            aria-label={`${resolved.length} resolved incidents`}
            style={{
              marginLeft: "auto",
              background: "rgba(0,230,118,0.08)",
              color: "var(--sev-healthy)",
              borderRadius: "10px",
              padding: "1px 7px",
              fontSize: "10px",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {resolved.length}
          </span>
        </div>

        <ul role="list" aria-label="Resolved incidents" style={{ listStyle: "none" }}>
          {resolved.map((inc) => (
            <li key={inc.id}>
              <button
                type="button"
                className="incident-item"
                style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer", opacity: 0.55 }}
                aria-label={`Resolved incident ${inc.id}: ${inc.scenario}, ${inc.age} ago`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
                    {inc.id}
                  </span>
                  <span style={{ fontSize: "9px", color: "var(--sev-healthy)" }} aria-hidden="true">✓</span>
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>
                  {inc.scenario.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  {inc.service} · <time>{inc.age} ago</time>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
