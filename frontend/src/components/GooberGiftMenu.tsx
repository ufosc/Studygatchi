import { useState } from "react";

interface Props {
  pageSetter: (arg0: string) => void;
}

type Rarity = "Common" | "Rare" | "Epic";

interface GachaItem {
  id: number;
  name: string;
  rarity: Rarity;
  weight: number;
}

// The weights add up to 100, so they also work as percentages.
const GACHA_ITEMS: GachaItem[] = [
  {
    id: 1,
    name: "Study Hat",
    rarity: "Common",
    weight: 30,
  },
  {
    id: 2,
    name: "Coffee Mug",
    rarity: "Common",
    weight: 30,
  },
  {
    id: 3,
    name: "Blue Hoodie",
    rarity: "Rare",
    weight: 15,
  },
  {
    id: 4,
    name: "Cat Ears",
    rarity: "Rare",
    weight: 15,
  },
  {
    id: 5,
    name: "Golden Crown",
    rarity: "Epic",
    weight: 10,
  },
];

const TOTAL_WEIGHT = GACHA_ITEMS.reduce(
  (total, item) => total + item.weight,
  0
);

function rollGacha(): GachaItem {
  const randomNumber = Math.random() * TOTAL_WEIGHT;

  let currentWeight = 0;

  for (const item of GACHA_ITEMS) {
    currentWeight += item.weight;

    if (randomNumber < currentWeight) {
      return item;
    }
  }

  // Fallback in case of an unexpected rounding issue.
  return GACHA_ITEMS[GACHA_ITEMS.length - 1];
}

export default function GooberGiftMenu({ pageSetter }: Props) {
  const [lastRoll, setLastRoll] = useState<GachaItem | null>(null);
  const [collection, setCollection] = useState<GachaItem[]>([]);

  const handleRoll = () => {
    const rolledItem = rollGacha();

    setLastRoll(rolledItem);
    setCollection((previousCollection) => [
      ...previousCollection,
      rolledItem,
    ]);
  };

  const collectionSummary = GACHA_ITEMS.map((item) => {
    const count = collection.filter(
      (collectedItem) => collectedItem.id === item.id
    ).length;

    return {
      ...item,
      count,
    };
  }).filter((item) => item.count > 0);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-color)",
        padding: "15px",
        borderRadius: "8px",
      }}
    >
      <h3>Gacha</h3>

      <p>
        Roll the gacha to obtain a random cosmetic item.
      </p>

      <div
        style={{
          textAlign: "left",
          marginBottom: "15px",
        }}
      >
        <strong>Possible rewards:</strong>

        <ul>
          {GACHA_ITEMS.map((item) => (
            <li key={item.id}>
              {item.name} - {item.rarity} (
              {((item.weight / TOTAL_WEIGHT) * 100).toFixed(0)}%)
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="studygatchi-button"
        onClick={handleRoll}
      >
        Roll Gacha
      </button>

      <div
        aria-live="polite"
        style={{
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        {lastRoll ? (
          <>
            <strong>You obtained:</strong>
            <p>
              {lastRoll.name} - {lastRoll.rarity}
            </p>
          </>
        ) : (
          <p>No item obtained yet.</p>
        )}
      </div>

      <div
        style={{
          textAlign: "left",
          marginBottom: "15px",
        }}
      >
        <strong>Obtained this session:</strong>

        {collectionSummary.length > 0 ? (
          <ul>
            {collectionSummary.map((item) => (
              <li key={item.id}>
                {item.name} x{item.count}
              </li>
            ))}
          </ul>
        ) : (
          <p>None yet.</p>
        )}
      </div>

      <button
        type="button"
        className="studygatchi-button"
        onClick={() => pageSetter("home")}
      >
        Home
      </button>
    </div>
  );
}