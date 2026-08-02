import "./GooberMenu.css";
// TODO These are placeholders. 
// Eventually we're going to want to lazy-load the assets since there will be a lot of them.
import GooberBackground from "../assets/backgrounds/placeholder.jpg"
import GooberImg from "../assets/goobers/goober-panda.png";

import { useState } from "react";
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
}: Props) {
  const gooberName = "Goober";
  const [currentPage, setPage] = useState("home");

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
        style={{ spanAlign: "center", padding: 0 }}
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
              "interactionNavBtn studygatchi-button " +
              (currentPage === "food" ? "active" : "")
            }
            onClick={() => setPage("food")}
          >
            Food
          </button>
          <button
            type="button"
            className={
              "interactionNavBtn studygatchi-button " +
              (currentPage === "play" ? "active" : "")
            }
            onClick={() => setPage("play")}
          >
            Play
          </button>
          <button
            type="button"
            className={
              "interactionNavBtn studygatchi-button " +
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
              setXP={setXP}
              setLevel={setLevel}
              setMoney={setMoney}
              setHealth={setHealth}
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