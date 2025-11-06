import "bootstrap/dist/css/bootstrap.min.css";
import "./GooberMenu.css";
import GooberImg from "../assets/GooberPlaceholder.png";
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
    <div className="card bCard" style={{ width: "400px" }}>
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <text>{gooberName}</text>
        <text
          style={{
            fontSize: 12,
            marginTop: "auto",
            marginLeft: "auto",
          }}
        >
          <text style={{ paddingRight: 10 }}>Money</text>
          <text>Settings</text>
        </text>
      </div>
      <div className="card-body">
        <img
          src={GooberImg}
          style={{
            display: "block",
            margin: "auto",
            borderRadius: "32px",
            width: 350,
            height: 350,
            paddingBottom: 10,
          }}
        />
      </div>
      <div
        className="card-footer"
        style={{
          height: 400,
          position: "relative",
          display: "flex",
          flexDirection: "column",
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
          <text style={{ padding: "10px" }}>{gooberName}</text>
        </div>
        <div
          style={{
            backgroundColor: "grey",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            margin: "-16px",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <button
            type="button"
            className={
              "btn btn-primary interactionNavBtn " +
              (currentPage === "food" ? "active" : "")
            }
            onClick={() => setPage("food")}
          >
            Food
          </button>
          <button
            type="button"
            className={
              "btn btn-primary interactionNavBtn " +
              (currentPage === "play" ? "active" : "")
            }
            onClick={() => setPage("play")}
          >
            Play
          </button>
          <button
            type="button"
            className={
              "btn btn-primary interactionNavBtn " +
              (currentPage === "gift" ? "active" : "")
            }
            onClick={() => setPage("gift")}
          >
            Gift
          </button>
        </div>
        <div style={{ paddingTop: "30px" }}>
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
          {currentPage == "food" && <GooberFoodMenu pageSetter={setPage} />}
          {currentPage == "gift" && <GooberGiftMenu pageSetter={setPage} />}
        </div>
      </div>
    </div>
  );
}
