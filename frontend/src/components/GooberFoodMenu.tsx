import { useState } from "react";
import "./GooberFoodMenu.css";
import { PET_ITEMS, type PetInventory } from "./petItems";

interface Props {
  money: number;
  inventory: PetInventory;
  onFeed: (itemId: string) => void;
}

const ITEMS_PER_PAGE = 6;

export default function GooberFoodMenu({ money, inventory, onFeed }: Props) {
  const [page, setPage] = useState(1);
  const foods = PET_ITEMS.filter(
    (item) => item.type === "food" && inventory[item.id] > 0,
  );
  const totalPages = Math.max(1, Math.ceil(foods.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const currentItems = foods.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="goober-food-menu">
      <div className="goober-food-header">
        <span className="goober-food-title">Panda's food</span>
        <span className="goober-food-money">${money}</span>
      </div>

      <div className="goober-food-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="goober-food-tile"
              aria-label={`Feed Panda ${item.name}, ${inventory[item.id]} available`}
              title={`Feed Panda ${item.name} (x${inventory[item.id]})`}
              onClick={() => onFeed(item.id)}
            >
              <img
                src={item.image}
                alt=""
                className="goober-food-image"
              />
              <span className="goober-food-quantity">x{inventory[item.id]}</span>
            </button>
          ))
        ) : (
          <div className="goober-food-empty">
            No food yet. Get some from the Gacha!
          </div>
        )}
      </div>

      <div className="goober-food-pagination">
        <button
          type="button"
          className="studygatchi-button goober-page-button"
          onClick={() => setPage((previous) => Math.max(1, previous - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="goober-page-indicator">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          className="studygatchi-button goober-page-button"
          onClick={() =>
            setPage((previous) => Math.min(totalPages, previous + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
