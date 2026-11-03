import "./GooberMenu.css";
import GooberBackground from "../assets/backgrounds/placeholder.jpg"
import GooberPanda from "../assets/goobers/goober-panda.png";

import { useState, type Dispatch, type SetStateAction } from "react";
import GooberInfo from "./GooberInfo";
import GooberPlayMenu from "./GooberPlayMenu";
import GooberFoodMenu from "./GooberFoodMenu";
import GooberGiftMenu from "./GooberGiftMenu";
import { PET_ITEMS, type PetInventory } from "./petItems";

interface Props {
  setXP: (arg0: number) => void;
  setLevel: (arg0: number) => void;
  setMoney: Dispatch<SetStateAction<number>>;
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
  const gooberName = "Panda";
  const [currentPage, setPage] = useState("home");
  const [inventory, setInventory] = useState<PetInventory>({});
  const [equippedCustomizationId, setEquippedCustomizationId] = useState<
    string | null
  >(null);
  const equippedCustomization = PET_ITEMS.find(
    (item) => item.id === equippedCustomizationId,
  );

  if (equippedCustomizationId && !equippedCustomization) {
    throw new Error(`Unknown equipped item: ${equippedCustomizationId}`);
  }

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
          <span style={{ paddingRight: 10 }}>Money ${money}</span>
          <span>Settings</span>
        </span>
      </div>

      <div
        className="card-body"
        style={{ padding: 0 }}
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
            src={GooberPanda}
            alt="Panda"
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {equippedCustomization?.icon && (
            <span
              className="panda-customization"
              aria-label={equippedCustomization.name}
              title={equippedCustomization.name}
            >
              {equippedCustomization.icon}
            </span>
          )}
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
            Gacha
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
          {currentPage == "food" && (
            <GooberFoodMenu
              money={money}
              inventory={inventory}
              onFeed={(itemId) => {
                setInventory((previous) => ({
                  ...previous,
                  [itemId]: previous[itemId] - 1,
                }));
                setHealth(Math.min(100, currentHealth + 20));
              }}
            />
          )}
          {currentPage == "gift" && (
            <GooberGiftMenu
              pageSetter={setPage}
              money={money}
              setMoney={setMoney}
              inventory={inventory}
              setInventory={setInventory}
              equippedCustomizationId={equippedCustomizationId}
              onEquip={setEquippedCustomizationId}
            />
          )}
        </div>
      </div>
    </div>
  );
}