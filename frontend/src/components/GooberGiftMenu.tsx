import { useState, type Dispatch, type SetStateAction } from "react";
import "./GooberGiftMenu.css";
import { PET_ITEMS, type ItemRarity, type PetInventory, type PetItem } from "./petItems";

const PULL_COST = 10;

const RARITY_WEIGHTS: Record<ItemRarity, number> = {
  Common: 60,
  Uncommon: 25,
  Rare: 12,
  Epic: 3,
};

interface Props {
  pageSetter: (page: string) => void;
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  inventory: PetInventory;
  setInventory: Dispatch<SetStateAction<PetInventory>>;
  equippedCustomizationId: string | null;
  onEquip: (itemId: string | null) => void;
}

function getAvailableItems(inventory: PetInventory): PetItem[] {
  return PET_ITEMS.filter(
    (item) => item.type === "food" || !inventory[item.id],
  );
}

function getAvailableRarities(items: PetItem[]): ItemRarity[] {
  return (Object.keys(RARITY_WEIGHTS) as ItemRarity[]).filter((rarity) =>
    items.some((item) => item.rarity === rarity),
  );
}

function drawItem(availableItems: PetItem[]): PetItem {
  const availableRarities = getAvailableRarities(availableItems);
  const totalWeight = availableRarities.reduce(
    (total, rarity) => total + RARITY_WEIGHTS[rarity],
    0,
  );
  let roll = Math.random() * totalWeight;

  for (const rarity of availableRarities) {
    roll -= RARITY_WEIGHTS[rarity];
    if (roll < 0) {
      const itemsInRarity = availableItems.filter(
        (item) => item.rarity === rarity,
      );
      return itemsInRarity[Math.floor(Math.random() * itemsInRarity.length)];
    }
  }

  throw new Error("Unable to draw an item from the available item pool.");
}

export default function GooberGiftMenu({
  pageSetter,
  money,
  setMoney,
  inventory,
  setInventory,
  equippedCustomizationId,
  onEquip,
}: Props) {
  const [lastPull, setLastPull] = useState<PetItem | null>(null);
  const availableItems = getAvailableItems(inventory);
  const availableRarities = getAvailableRarities(availableItems);
  const totalRarityWeight = availableRarities.reduce(
    (total, rarity) => total + RARITY_WEIGHTS[rarity],
    0,
  );
  const ownedItems = PET_ITEMS.filter((item) => inventory[item.id]);
  const canPull = money >= PULL_COST && availableItems.length > 0;

  const handlePull = () => {
    if (money < PULL_COST || availableItems.length === 0) {
      return;
    }

    const prize = drawItem(availableItems);
    setMoney(money - PULL_COST);
    setInventory((previous) => ({
      ...previous,
      [prize.id]: (previous[prize.id] ?? 0) + 1,
    }));
    setLastPull(prize);

    if (prize.type === "customization") {
      onEquip(prize.id);
    }
  };

  return (
    <div className="goober-gacha">
      <div className="goober-gacha-header">
        <h2>Panda Gacha</h2>
        <span>${money}</span>
      </div>
      <div className="goober-gacha-content">
        <p className="goober-gacha-description">
          Pull for ${PULL_COST} to get food for your Panda or a customization
          item. Food can be pulled more than once; each customization is unique.
        </p>
        {availableRarities.length > 0 && (
          <p className="goober-gacha-odds">
            Current odds:{" "}
            {availableRarities
              .map(
                (rarity) =>
                  `${rarity} ${((RARITY_WEIGHTS[rarity] / totalRarityWeight) * 100).toFixed(1)}%`,
              )
              .join(" · ")}
          </p>
        )}
        <button
          type="button"
          className="studygatchi-button goober-gacha-pull"
          onClick={handlePull}
          disabled={!canPull}
        >
          {availableItems.length === 0
            ? "Collection complete"
            : `Pull for $${PULL_COST}`}
        </button>
        {!canPull && availableItems.length > 0 && (
          <p className="goober-gacha-message" role="status">
            You need ${PULL_COST - money} more to pull.
          </p>
        )}
        {lastPull && (
          <div className="goober-gacha-result" role="status" aria-live="polite">
            {lastPull.image ? (
              <img src={lastPull.image} alt="" />
            ) : (
              <span className="goober-gacha-result-icon" aria-hidden="true">
                {lastPull.icon}
              </span>
            )}
            <span>
              You got a <strong>{lastPull.rarity}</strong> {lastPull.name}
              {lastPull.type === "customization" ? " — now equipped!" : "!"}
            </span>
          </div>
        )}
        <h3>Your items</h3>
        {ownedItems.length === 0 ? (
          <p className="goober-gacha-empty">Pull to get your first item.</p>
        ) : (
          <div className="goober-gacha-collection">
            {ownedItems.map((item) => {
              const isEquipped = equippedCustomizationId === item.id;

              return (
                <div
                  key={item.id}
                  className={`goober-gacha-item rarity-${item.rarity.toLowerCase()}${isEquipped ? " equipped" : ""}`}
                >
                  {item.image ? (
                    <img src={item.image} alt="" />
                  ) : (
                    <span className="goober-gacha-item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="goober-gacha-item-name">{item.name}</span>
                  <span className="goober-gacha-item-rarity">
                    {item.rarity}
                  </span>
                  {item.type === "food" ? (
                    <span className="goober-gacha-item-quantity">
                      x{inventory[item.id]}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="goober-gacha-equip"
                      onClick={() => onEquip(isEquipped ? null : item.id)}
                    >
                      {isEquipped ? "Equipped" : "Equip"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        type="button"
        className="studygatchi-button goober-gacha-home"
        onClick={() => pageSetter("home")}
      >
        Home
      </button>
    </div>
  );
}
