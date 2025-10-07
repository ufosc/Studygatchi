import React, { useState, useEffect } from "react";
import "./PomodoroTimer.css";

export default function PomodoroTimer() {
  
    const [workMin, setWorkMin] = useState(25);
    const [breakMin, setBreakMin] = useState(5);
    const [counter, setCounter] = useState(workMin * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false); 

 
    useEffect(() => {
    if (!isRunning) return;

     const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
         
            const next = !isBreak;
            setIsBreak(next);
            if (next) {
                return breakMin * 60 
            }
            else {
                return workMin * 60;
            }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  
    useEffect(() => {
    if (counter !== 0) return;

    setIsBreak((prev) => {
        const next = !prev; 
        setCounter(next ? breakMin * 60 : workMin * 60); 
        setIsRunning(true); 
        return next;
    });
  }, [counter, workMin, breakMin]);

  
  const time = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  
  const modeChange = (newMode: "work" | "break") => {
    setIsRunning(false);
    if (newMode === "work") {
      setIsBreak(false);
      setCounter(workMin * 60);
    } else {
      setIsBreak(true);
      setCounter(breakMin * 60);
    }
  };

  return (
   <div  className="timer">
  <h3>Pomodoro Timer</h3>

  <div className="inputs">
    <label>
      Work Minutes:
      <input
        type="number"
        value={workMin}
        onChange={(e) => setWorkMin(Number(e.target.value))}
        min={1}
      />
    </label>
    <label>
      Break Minutes:
      <input
        type="number"
        value={breakMin}
        onChange={(e) => setBreakMin(Number(e.target.value))}
        min={1}
      />
    </label>
  </div>

  
  <div className="mode">
    <label>
      Mode:
      <select
        value={isBreak ? "break" : "work"}
        onChange={(e) =>
          modeChange(e.target.value as "work" | "break")
        }
      >
        <option value="work">Work</option>
        <option value="break">Break</option>
      </select>
    </label>
  </div>

 
  <h4>{isBreak ? "Break Time" : "Work Time"}</h4>
  <h1>{time(counter)}</h1>

  
  <button onClick={() => setIsRunning(true)}>Start</button>
  <button onClick={() => setIsRunning(false)}>Pause</button>
  <button
    onClick={() => { setIsRunning(false); setIsBreak(false); setCounter(workMin * 60);}}>Reset</button>
</div>

  );
}
