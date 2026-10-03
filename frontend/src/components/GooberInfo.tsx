import "./GooberInfo.css";
import { useEffect, type Dispatch, type SetStateAction } from "react";

interface Props {
  setXP: Dispatch<SetStateAction<number>>;
  setLevel: Dispatch<SetStateAction<number>>;
  setMoney: Dispatch<SetStateAction<number>>;
  setHealth: Dispatch<SetStateAction<number>>;
  currentXP: number;
  level: number;
  money: number;
  currentHealth: number;
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
}: Props) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentHealth <= 0) {
        setXP(0);
        setLevel(0);
        setHealth(100);
      } else if (currentXP >= 100) {
        setXP(0);
        setLevel((previousLevel) => previousLevel + 1);

        setMoney((previousMoney) => previousMoney + 10);
      } else {
        setXP((previousXP) => previousXP + 1);
        setHealth((previousHealth) => Math.max(0, previousHealth - 0.1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentHealth, currentXP, setXP, setLevel, setMoney, setHealth]);

  return (
    <>
      <div
        style={{
          backgroundColor: "grey",
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
            aria-valuenow={currentXP}
            aria-valuemin={0}
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
            aria-valuenow={currentHealth}
            aria-valuemin={0}
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
      <div
        style={{
          backgroundColor: "grey",
          margin: "-16px",
          marginTop: "30px",
          padding: "10px",
          textAlign: "center",
        }}
      >
        Shop
      </div>
      <div
        style={{
          backgroundColor: "grey",
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
