"use client";
import { DashboardProvider } from "@/lib/DashboardContext";
import { IncidentHeader }  from "@/components/IncidentHeader";
import { IncidentSidebar } from "@/components/IncidentSidebar";
import { ServiceGraph }    from "@/components/ServiceGraph";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { RCAPanel }        from "@/components/RCAPanel";
import { MetricsPanel }    from "@/components/MetricsPanel";

/**
 * Dashboard shell — uses DashboardProvider as the state provider
 * so all child panels consume context directly (no prop drilling).
 * Pattern: Vercel Compound Components with lifted state.
 */
export default function DashboardPage() {
  return (
    <DashboardProvider>
      {/*
        Skip-to-main-content link (WCAG 2.4.1)
        Visually hidden until focused.
      */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-100%",
          left: "8px",
          background: "var(--sev-info)",
          color: "#04080f",
          padding: "8px 16px",
          borderRadius: "0 0 4px 4px",
          fontWeight: 700,
          fontSize: "12px",
          zIndex: 9998,
          transition: "top var(--dur-fast)",
          textDecoration: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.top = "0"; }}
        onBlur={(e)  => { e.currentTarget.style.top = "-100%"; }}
      >
        Skip to main content
      </a>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          background: "var(--surface-void)",
        }}
      >
        {/* ── Top header bar ── */}
        <IncidentHeader />

        {/* ── Main content area ── */}
        <main
          id="main-content"
          tabIndex={-1}
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* ── Incident feed sidebar ── */}
          <IncidentSidebar />

          {/* ── Service graph (left panel) ── */}
          <div
            style={{
              width: "274px",
              flexShrink: 0,
              borderRight: "1px solid var(--border-dim)",
              overflow: "hidden",
            }}
          >
            <ServiceGraph />
          </div>

          {/* ── Center + Right column ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            {/* ── Upper: Timeline + RCA ── */}
            <div
              style={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              {/* Timeline */}
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  borderRight: "1px solid var(--border-dim)",
                  minWidth: 0,
                }}
              >
                <IncidentTimeline />
              </div>

              {/* RCA Panel */}
              <div
                style={{
                  width: "314px",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <RCAPanel />
              </div>
            </div>

            {/* ── Bottom: Metrics ── */}
            <MetricsPanel />
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
