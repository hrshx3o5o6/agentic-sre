/**
 * Dashboard Context — Vercel Compound Component Pattern
 * Lifts all replay/incident state into a provider so siblings
 * (Header, Graph, Timeline, RCA) can access it without prop drilling.
 */
"use client";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MOCK_TIMELINE_EVENTS } from "@/lib/mockData";

/* ── State shape ──────────────────────────────────────────────────────── */
interface DashboardState {
  scenario: string;
  isPlaying: boolean;
  replaySpeed: number;
  visibleEvents: number;
  currentTimeIdx: number;
}

interface DashboardActions {
  setScenario:   (s: string) => void;
  playPause:     () => void;
  reset:         () => void;
  setReplaySpeed:(n: number) => void;
}

interface DashboardMeta {
  rcaVisible:  boolean;
  currentTime: string;
}

interface DashboardContextValue {
  state:   DashboardState;
  actions: DashboardActions;
  meta:    DashboardMeta;
}

/* ── Context ─────────────────────────────────────────────────────────── */
const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = use(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}

/* ── Replay timing ───────────────────────────────────────────────────── */
const REPLAY_TIMES = [
  "21:00:00","21:00:48","21:01:12","21:01:31",
  "21:01:50","21:02:00","21:02:10","21:02:30",
  "21:03:00","21:04:00",
];
const EVENT_DELAYS_MS = [3500,2800,2200,1800,1800,1600,1500,1800,2200,3000];

/* ── Provider ────────────────────────────────────────────────────────── */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [scenario,      setScenarioState] = useState("bad_deployment");
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [replaySpeed,   setReplaySpeed]   = useState(1);
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [currentTimeIdx,setCurrentTimeIdx]= useState(0);

  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef  = useRef(false);
  const speedRef    = useRef(replaySpeed);
  speedRef.current  = replaySpeed;

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const scheduleNext = useCallback((idx: number) => {
    if (!playingRef.current) return;
    if (idx >= MOCK_TIMELINE_EVENTS.length) {
      setIsPlaying(false);
      playingRef.current = false;
      return;
    }
    const delay = (EVENT_DELAYS_MS[idx] ?? 2000) / speedRef.current;
    timerRef.current = setTimeout(() => {
      setVisibleEvents(idx + 1);
      setCurrentTimeIdx(idx);
      scheduleNext(idx + 1);
    }, delay);
  }, []);

  const playPause = useCallback(() => {
    if (playingRef.current) {
      clearTimer();
      setIsPlaying(false);
      playingRef.current = false;
    } else {
      setIsPlaying(true);
      playingRef.current = true;
      setVisibleEvents(prev => {
        scheduleNext(prev);
        return prev;
      });
    }
  }, [clearTimer, scheduleNext]);

  const reset = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    playingRef.current = false;
    setVisibleEvents(0);
    setCurrentTimeIdx(0);
  }, [clearTimer]);

  const setScenario = useCallback((s: string) => {
    setScenarioState(s);
    clearTimer();
    setIsPlaying(false);
    playingRef.current = false;
    setVisibleEvents(0);
    setCurrentTimeIdx(0);
  }, [clearTimer]);

  // Auto-start after mount
  useEffect(() => {
    const t = setTimeout(() => {
      setIsPlaying(true);
      playingRef.current = true;
      scheduleNext(0);
    }, 800);
    return () => { clearTimeout(t); clearTimer(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-schedule if speed changes mid-play
  useEffect(() => {
    if (isPlaying) {
      clearTimer();
      scheduleNext(visibleEvents);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaySpeed]);

  const rcaVisible  = visibleEvents >= MOCK_TIMELINE_EVENTS.length;
  const currentTime = REPLAY_TIMES[Math.min(currentTimeIdx, REPLAY_TIMES.length - 1)] ?? "21:00:00";

  return (
    <DashboardContext
      value={{
        state:   { scenario, isPlaying, replaySpeed, visibleEvents, currentTimeIdx },
        actions: { setScenario, playPause, reset, setReplaySpeed },
        meta:    { rcaVisible, currentTime },
      }}
    >
      {children}
    </DashboardContext>
  );
}
