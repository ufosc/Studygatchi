import { useEffect, useRef, useState } from "react";
import "../App.css";

type SessionType = "Work" | "Short Break" | "Long Break";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export default function Timer() {
  // settings (minutes)
  const [workMins, setWorkMins] = useState<number>(25);
  const [shortBreakMins, setShortBreakMins] = useState<number>(5);
  const [longBreakMins, setLongBreakMins] = useState<number>(15);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState<number>(4);

  const [session, setSession] = useState<SessionType>("Work");
  const [secondsLeft, setSecondsLeft] = useState<number>(workMins * 60);
  const [running, setRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);

  // keep secondsLeft in sync when user changes durations while stopped
  useEffect(() => {
    if (!running) {
      if (session === "Work") setSecondsLeft(workMins * 60);
      if (session === "Short Break") setSecondsLeft(shortBreakMins * 60);
      if (session === "Long Break") setSecondsLeft(longBreakMins * 60);
    }
  }, [workMins, shortBreakMins, longBreakMins, session]);

  // This function is ran everytime running is modified
  useEffect(() => {
    if (running) {
      // use window.setInterval so TypeScript knows the return type
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000) as unknown as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // handle session end
  useEffect(() => {
    if (secondsLeft < 0) return; // guard
    if (secondsLeft === 0) {
      // switch sessions
      if (session === "Work") {
        const nextCycle = completedCycles + 1;
        setCompletedCycles(nextCycle);
        if (nextCycle % cyclesBeforeLong === 0) {
          setSession("Long Break");
          setSecondsLeft(longBreakMins * 60);
        } else {
          setSession("Short Break");
          setSecondsLeft(shortBreakMins * 60);
        }
      } else {
        // from any break, go to work
        setSession("Work");
        setSecondsLeft(workMins * 60);
      }
    }
  }, [
    secondsLeft,
    session,
    completedCycles,
    cyclesBeforeLong,
    workMins,
    shortBreakMins,
    longBreakMins,
  ]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setCompletedCycles(0);
    setSession("Work");
    setSecondsLeft(workMins * 60);
  };

  return (
    <div className="card timer-card">
      <h2>Pomodoro Timer</h2>
      <div className="timer-display">
        <div className="session-type">{session}</div>
        <div className="time-large">{formatTime(Math.max(0, secondsLeft))}</div>
        <div className="controls">
          <button onClick={toggle}>{running ? "Pause" : "Start"}</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="settings">
        <label>
          Work (minutes)
          <input
            type="number"
            min={1}
            value={workMins}
            onChange={(e) =>
              setWorkMins(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </label>
        <label>
          Short Break (minutes)
          <input
            type="number"
            min={1}
            value={shortBreakMins}
            onChange={(e) =>
              setShortBreakMins(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </label>
        <label>
          Long Break (minutes)
          <input
            type="number"
            min={1}
            value={longBreakMins}
            onChange={(e) =>
              setLongBreakMins(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </label>
        <label>
          Cycles before long break
          <input
            type="number"
            min={1}
            value={cyclesBeforeLong}
            onChange={(e) =>
              setCyclesBeforeLong(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </label>
      </div>

      <div className="meta">
        <small>Completed cycles: {completedCycles}</small>
      </div>
    </div>
  );
}
