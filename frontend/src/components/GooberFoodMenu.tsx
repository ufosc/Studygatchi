import { useMemo, useState } from "react";
import "./GooberFoodMenu.css";

/*
TODO:
- Cut down on margins
- replace money with exit button to close the food menu
- Allow clicking the food button again to close the menu
- Think about scrolling vs pagination for the food menu?

*/
interface Props {
  pageSetter: (page: string) => void;
  money?: number;
}

interface FoodItem {
  id: number;
  name: string;
  image: string;
}

const ITEMS_PER_PAGE = 6;

function shuffleArray<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatFoodName(filename: string) {
  return filename
    .replace(/^\d+_/, "")
    .replace(/\.png$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const foodModules = import.meta.glob("../assets/food/plated-food/*.png", {
  eager: true,
}) as Record<string, { default: string }>;

const foodPool: FoodItem[] = Object.entries(foodModules)
  .map(([path, module]) => {
    const filename = path.split("/").pop() ?? "";
    const idMatch = filename.match(/^(\d+)_/);
    const id = idMatch ? Number(idMatch[1]) : 0;

    return {
      id,
      name: formatFoodName(filename),
      image: module.default,
    };
  })
  .filter((item) => item.image)
  .sort((a, b) => a.id - b.id);

console.log("foodModules", foodModules);
console.log("foodPool", foodPool);

export default function GooberFoodMenu({ money = 0 }: Props) {
  const [page, setPage] = useState(1);
  const [foods] = useState(() => shuffleArray(foodPool));

  const totalPages = Math.ceil(foods.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return foods.slice(start, start + ITEMS_PER_PAGE);
  }, [foods, page]);

  const handleNextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="goober-food-menu">
      <div className="goober-food-header">
        <span className="goober-food-title">food</span>
        <span className="goober-food-money">${money}</span>
      </div>

      <div className="goober-food-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={item.id}
              className="goober-food-tile"
              role="button"
              tabIndex={0}
              aria-label={item.name}
              title={item.name}
            >
              <img
                src={item.image}
                alt={item.name}
                className="goober-food-image"
              />
            </div>
          ))
        ) : (
          <div className="goober-food-empty">No food found</div>
        )}
      </div>

      <div className="goober-food-pagination">
        <button
          type="button"
          className="studygatchi-button goober-page-button"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>

        <span className="goober-page-indicator">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          className="studygatchi-button goober-page-button"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}