import { useEffect, useRef, useState } from "react";
import "./Timer.css";

type SessionType = "Work" | "Short Break" | "Long Break";
interface Props {
  setIsBreak: (isBreak: boolean) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export default function Timer({ setIsBreak }: Props) {
  // settings (minutes)
  const [workMins, setWorkMins] = useState<number>(25);
  const [shortBreakMins, setShortBreakMins] = useState<number>(5);
  const [longBreakMins, setLongBreakMins] = useState<number>(15);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState<number>(4);

  const [session, setSession] = useState<SessionType>("Work");
  const [secondsLeft, setSecondsLeft] = useState<number>(workMins * 60);
  const [running, setRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false); // popup toggle


  const endTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
  setIsBreak(session !== "Work");

  return () => {
    setIsBreak(false);
  };
  }, [session, setIsBreak]);

  const totalSeconds =
    session === "Work"
      ? workMins * 60
      : session === "Short Break"
      ? shortBreakMins * 60
      : longBreakMins * 60;

  const progress = secondsLeft / totalSeconds;

useEffect(() => {
  if (!running) return;

  const updateTimer = () => {
    if (endTimeRef.current === null) return;

    const remainingSeconds = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000)
    );

    setSecondsLeft(remainingSeconds);
    animationFrameRef.current =
      window.requestAnimationFrame(updateTimer);
  };

  animationFrameRef.current =
    window.requestAnimationFrame(updateTimer);

  return () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
}, [running]);

  useEffect(() => {
    if (secondsLeft < 0) return;
    if (secondsLeft === 0) {
      if (session === "Work") {
        const nextCycle = completedCycles + 1;
        setCompletedCycles(nextCycle);
        if (nextCycle % cyclesBeforeLong === 0) {
          setSession("Long Break");
          setSecondsLeft(longBreakMins * 60);
          endTimeRef.current = Date.now() + longBreakMins * 60 * 1000;
        } else {
          setSession("Short Break");
          setSecondsLeft(shortBreakMins * 60);
          endTimeRef.current = Date.now() + shortBreakMins * 60 * 1000;
        }
      } else {
        setSession("Work");
        setSecondsLeft(workMins * 60);
        endTimeRef.current = Date.now() + workMins * 60 * 1000;
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

  const toggle = () => {
  if (running) {
    setRunning(false);
  } else {
    endTimeRef.current = Date.now() + secondsLeft * 1000;
    setRunning(true);
  }
  };
  const reset = () => {
    setRunning(false);
    endTimeRef.current = null;
    setCompletedCycles(0);
    setSession("Work");
    setSecondsLeft(workMins * 60);
  };

  return (
    <div className="card timer-card">
      <h2>Pomodoro Timer</h2>
      <div className="timer-display">
        <svg className="progress-ring" width="200" height="200">
          <circle
            className="progress-ring__background"
            cx="100"
            cy="100"
            r="90"
            strokeWidth="12"
          />
          <circle
            className="progress-ring__progress"
            cx="100"
            cy="100"
            r="90"
            strokeWidth="12"
            style={{
              strokeDasharray: 2 * Math.PI * 90,
              strokeDashoffset: (1 - progress) * (2 * Math.PI * 90),
            }}
          />
        </svg>

        <div className="timer-content">
          {(session === "Short Break" || session === "Long Break") && (
            <div className="session-type">{session}</div>
          )}
          <div className="time-large">
            {formatTime(Math.max(0, secondsLeft))}
          </div>
        </div>
      </div>

      {/* --- Controls --- */}
      <div className="controls controls-outside">
        <button onClick={toggle}>{running ? "Pause" : "Start"}</button>
        <button onClick={reset}>Reset</button>
        <button
          className="settings-btn"
          onClick={() => setShowSettings((s) => !s)}
        >
          ⚙️
        </button>
      </div>

      {/* --- Popup Settings --- */}
      {showSettings && (
        <div className="settings-popup">
          <div className="settings-content">
            <h3>Timer Settings</h3>

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

            <div className="settings-actions">
              <button onClick={() => setShowSettings(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="meta">
        <small>Completed cycles: {completedCycles}</small>
      </div>
    </div>
  );
}
