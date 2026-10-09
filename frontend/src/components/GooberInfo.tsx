import "./GooberInfo.css";
import { useState, useEffect, useRef } from "react";

interface Props {
  setXP: (arg0: number) => void;
  setLevel: (arg0: number) => void;
  setMoney: (arg0: number) => void;
  setHealth: (arg0: number) => void;
  currentXP: number;
  level: number;
  money: number;
  currentHealth: number;
  isBreak?: boolean
}

export default function GooberInfo({
  setXP,
  setLevel,
  setMoney,
  setHealth,
  currentXP,
  level,
  money,
  currentHealth,
  isBreak = false,
}: Props) {
  
  const statsRef = useRef({ currentHealth, currentXP, level, money, isBreak });
  useEffect(() => { // Update the stats
    statsRef.current = { currentHealth, currentXP, level, money, isBreak };
  });

  useEffect(() => { // Since dependency list is empty, this component is not re-rendered even when they are any updates to XP, food, etc., avoiding creating multiple intervals
    const interval = setInterval(() => {
      const { currentHealth, currentXP, level, money, isBreak } = statsRef.current;

      if (currentHealth <= 0) {
        setXP(0);
        setLevel(0);
        setHealth(100);
      } else if (currentXP >= 100) {
        setXP(0);
        setLevel(level + 1);
        setMoney(money + 10);
      } else {
        // Avoid draining health and no XP gain if on break
        if (!isBreak) { 
          setXP(currentXP + 1);
          setHealth(currentHealth - 0.1);
        }
      }
    }, 1000); // Runs every 1000 milliseconds

    return () => { // Remove the interval when you click away from the main page
      clearInterval(interval); // Prevents multiple intervals from stacking up and messing up the rate at which XP and health change
    }; // 
  }, []);
 
  return (
    <>
      <div className = "gooberInfo"
        style={{
          margin: "-16px",
          padding: "10px",
          marginTop: "0px",
        }}
      >
        <div>
          <text>progress to level: {level + 1}</text>
          <div
            className="progress"
            role="progressbar"
            aria-label="XP bar"
            aria-valuenow={0}
            aria-valuemin={currentXP}
            aria-valuemax={100}
          >
            <div
              className="progress-bar"
              style={{ width: currentXP + "%" }}
            ></div>
          </div>
        </div>
        <div>
          <text>current health:</text>
          <div
            className="progress"
            role="progressbar"
            aria-label="Health Bar"
            aria-valuenow={0}
            aria-valuemin={currentHealth}
            aria-valuemax={100}
          >
            <div
              className="progress-bar"
              style={{ width: currentHealth + "%" }}
            ></div>
          </div>
        </div>
        <div>
          <text>Cash money: ${money}</text>
        </div>
      </div>
      <div className = "gooberInfo"
        style={{
          margin: "-16px",
          marginTop: "30px",
          padding: "10px",
          textAlign: "center",
        }}
      >
        Shop
      </div>
      <div className = "gooberInfo"
        style={{
          margin: "-16px",
          marginTop: "30px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <text>study!</text>
      </div>
    </>
  );
}
