import { useEffect, useRef, useState } from "react";
import "./Timer.css";

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

const sessionColors: Record<SessionType, string> = {
  "Work": "rgba(255, 49, 49, 0.867)",
  "Short Break": "rgba(255, 220, 93)",
  "Long Break": "rgba(153, 220, 142)",
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
  const [showSettings, setShowSettings] = useState<boolean>(false); // popup toggle
  const [progressRing, setProgressRing] = useState<boolean>(true);
  const [colorSessionText, setColorSessionText] = useState<boolean>(true);


  const intervalRef = useRef<number | null>(null);

  const totalSeconds =
    session === "Work"
      ? workMins * 60
      : session === "Short Break"
      ? shortBreakMins * 60
      : longBreakMins * 60;

  const progress = secondsLeft / totalSeconds;
  
  const defaultRingColor = "#4bcce0"; 
  let strokeColor = defaultRingColor;
  if (progressRing) {
    strokeColor = sessionColors[session];
  }

  let sessionTextColor = "rgb(66, 122, 168)";
  if(colorSessionText){
    sessionTextColor = sessionColors[session];
  }else{
    sessionTextColor = "rgb(66, 122, 168)";
  }

  useEffect(() => {
    // Only update when settings change AND timer is not running
    if (running) return;

    if (session === "Work") setSecondsLeft(workMins * 60);
    else if (session === "Short Break") setSecondsLeft(shortBreakMins * 60);
    else if (session === "Long Break") setSecondsLeft(longBreakMins * 60);
  }, [workMins, shortBreakMins, longBreakMins, session]);

  useEffect(() => {
    if (running) {
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

  useEffect(() => {
    if (secondsLeft < 0) return;
    if (secondsLeft === 0) {
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

  const skipSession = () => {
    setRunning(false);
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
      setSession("Work");
      setSecondsLeft(workMins * 60);
    }
  }

  return (
    <div className="card timer-card">
      <div className ="timer-header">
         <h2>Pomodoro Timer</h2>
      </div>
     
      <div className="timer-display">
        <svg className="progress-ring" width="200" height="200">
          <circle
            className="progress-ring__background"
            cx="99"
            cy="100"
            r="90"
            strokeWidth="12"
          />
          <circle
            className="progress-ring__progress"
            cx="99"
            cy="100"
            r="90"
            strokeWidth="12"
            style={{
              stroke: strokeColor,
              strokeDasharray: 2 * Math.PI * 90,
              strokeDashoffset: (1 - progress) * (2 * Math.PI * 90),
              transition: "stroke-dashoffset 1s linear, stroke 0.5s",
            }}
          />
        </svg>

        <div className="timer-content">
            <div className="session-type" style = {{color:sessionTextColor}}>{session}</div>
          <div className="time-large">
            {formatTime(Math.max(0, secondsLeft))}
          </div>

          <small className="cycle-info">
             {completedCycles+1}/{cyclesBeforeLong}
          </small>
         

        </div>
      </div>
      
    

      {/* --- Controls --- */}
      <div className="controls controls-outside">
        <button onClick={toggle}>{running ? 
          <svg 
            width="18" height="18">
           <rect x="10" y= "0" width ="4" height="18" fill="white"/>
            <rect x="3" y= "0" width ="4" height="18" fill="white"/>
          </svg> :  <svg 
            width = "18" height="18">
            <polygon x ="0" y = "0" points = "3,0 18,9 3,18" fill = "white"/>
          </svg>
          }</button>

        <button onClick={reset}>
          <svg width= "18" height="18">
            <circle
              cx="9"
              cy="9"
              r="7"
              stroke="white"
              strokeWidth="2"
              fill="none"
              stroke-dasharray="33, 30"
              transform= "translate(0,0) rotate(-100 9 9)"
            />
            <polygon
              points = "16,9,11,6,12,13"
              fill= "white" 
              transform= "translate(2.5,-6) rotate(180 9 9)"
            />
          </svg>

        </button>

        <button onClick={skipSession}>
          <svg width= "18" height="18" fill = "white">
   
              <polygon points="0,0 14,9 0,18" />
              <rect x="15" y="0" width="3" height="18" />
          </svg>
        </button>

        <button
          className="settings-btn"
          onClick={() => setShowSettings((s) => !s)}
        >
           <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a2 2 0 1 1-2.83 2.83l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l0 0a2 2 0 1 1-2.83-2.83l0 0a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l0 0a2 2 0 1 1 2.83-2.83l0 0a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l0 0a2 2 0 1 1 2.83 2.83l0 0a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
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

            <label style={{display:"flex",flexDirection: "row", alignItems:"center", gap:"8px"}}>
              <input
                type="checkbox"
                checked={progressRing}
                onChange={(e) => setProgressRing(e.target.checked)}
              />
               <span>Match ring to session</span>
            </label>

            <label style={{display:"flex",flexDirection: "row", alignItems:"center", gap:"8px"}}>
              <input
                type="checkbox"
                checked={colorSessionText}
                onChange={(e) => setColorSessionText(e.target.checked)}
              />
                <span>Match text to session</span>
              </label>

            <div className="settings-actions">
              <button onClick={() => setShowSettings(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="meta">
        <small>Completed Cycles: {completedCycles}</small>
      </div>
    </div>
  );
}