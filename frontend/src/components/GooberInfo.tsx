import "./GooberInfo.css";

interface Props {
  setXP: (arg0: number) => void;
  setLevel: (arg0: number) => void;
  setMoney: (arg0: number) => void;
  setHealth: (arg0: number) => void;
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
  // Whent he user tabs out this crashes out
  setInterval(() => {
    if (currentHealth <= 0) {
      setXP(0);
      setLevel(0);
      setHealth(100);
    } else if (currentXP == 100) {
      setXP(0);
      //Once this runs once, it gets really weird and runs a lot
      setLevel(level + 1);
    } else {
      setXP(currentXP + 1);
      setHealth(currentHealth - 0.1);
    }
  }, 1000);

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
