import "./GooberMenu.css";
// TODO These are placeholders. 
// Eventually we're going to want to lazy-load the assets since there will be a lot of them.
import GooberBackground from "../assets/backgrounds/placeholder.jpg"
import GooberImg from "../assets/goobers/goober-panda.png";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/formatTime";
import GooberInfo from "./GooberInfo";
import GooberPlayMenu from "./GooberPlayMenu";
import GooberFoodMenu from "./GooberFoodMenu";
import GooberGiftMenu from "./GooberGiftMenu";

interface Props {
  setXP: (arg0: number) => void;
  setLevel: (arg0: number) => void;
  setMoney: (arg0: number) => void;
  setHealth: (arg0: number) => void;
  currentXP: number;
  level: number;
  money: number;
  currentHealth: number;
  breakSecondsLeft: number | null;
}

export default function GooberMenu({
  setXP,
  setLevel,
  setMoney,
  setHealth,
  currentXP,
  level,
  money,
  currentHealth,
  breakSecondsLeft,
}: Props) {
  const gooberName = "Goober";
  const [currentPage, setPage] = useState("home");

  const isBreak = breakSecondsLeft !== null;

  const stats = useRef({ currentXP, level, money, currentHealth });
  stats.current = { currentXP, level, money, currentHealth };

  useEffect(() => {
    if (isBreak) return; // no XP gain and no health loss during breaks
    const id = window.setInterval(() => {
      const s = stats.current;
      if (s.currentHealth <= 0) {
        setXP(0);
        setLevel(0);
        setHealth(100);
      } else if (s.currentXP == 100) {
        setXP(0);
        setLevel(s.level + 1);
        setMoney(s.money + 10);
      } else {
        setXP(s.currentXP + 1);
        setHealth(s.currentHealth - 0.1);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [isBreak]);

  return (
    <div className="card bCard" style={{
      width: "100%",
      maxWidth: "400px"
    }}>
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <span>{gooberName}</span>
        <span
          style={{
            fontSize: 12,
            marginTop: "auto",
            marginLeft: "auto",
          }}
        >
          <span style={{ paddingRight: 10 }}>Money</span>
          <span>Settings</span>
        </span>
      </div>

      <div
        className="card-body"
        style={{ textAlign: "center", padding: 0 }}
      >
        <div
          style={{
            position: "relative",
            width: "90%",
            margin: "25px auto",
            borderRadius: 32,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "red",
              backgroundImage: `url(${GooberBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }}
          />

          {breakSecondsLeft !== null && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                right: 8,
                zIndex: 2,
                textAlign: "center",
                padding: "6px 10px",
                borderRadius: 12,
                background: "rgba(0,0,0,0.65)",
                color: "white",
                fontSize: 14,
              }}
            >
              Break time: {formatTime(breakSecondsLeft)} left · no penalty
            </div>
          )}

          <img
            src={GooberImg}
            alt={`${gooberName} placeholder`}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      <div
        className="card-footer"
        style={{
          minHeight: 400,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "visible"
        }}
      >
        <div
          style={{
            alignSelf: "center",
            position: "absolute",
            top: 0,
            transformStyle: "preserve-3d",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            color: "black",
          }}
        >
          <span style={{ padding: "10px" }}>{gooberName}</span>
        </div>

        <div
          className="gooberInfo"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            marginTop: "20px",
            padding: "10px",
            gap: "8px"
          }}
        >
          <button
            type="button"
            className={
              "interactionNavBtn " +
              (currentPage === "food" ? "active" : "")
            }
            onClick={() => setPage("food")}
          >
            Food
          </button>
          <button
            type="button"
            className={
              "interactionNavBtn" +
              (currentPage === "play" ? "active" : "")
            }
            onClick={() => setPage("play")}
          >
            Play
          </button>
          <button
            type="button"
            className={
              "interactionNavBtn" +
              (currentPage === "gift" ? "active" : "")
            }
            onClick={() => setPage("gift")}
          >
            Gift
          </button>
        </div>

        <div
          style={{
            paddingTop: "30px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingBottom: "12px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {currentPage == "home" && (
           <GooberInfo
              currentXP={currentXP}
              level={level}
              money={money}
              currentHealth={currentHealth}
            />
          )}
          {currentPage == "play" && <GooberPlayMenu pageSetter={setPage} />}
          {currentPage == "food" && <GooberFoodMenu pageSetter={setPage} money={money} />}
          {currentPage == "gift" && <GooberGiftMenu pageSetter={setPage} />}
        </div>
      </div>
    </div>
  );
}