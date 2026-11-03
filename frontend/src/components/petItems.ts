export type ItemRarity = "Common" | "Uncommon" | "Rare" | "Epic";
export type PetItemType = "food" | "customization";

export interface PetItem {
  id: string;
  name: string;
  type: PetItemType;
  rarity: ItemRarity;
  image?: string;
  icon?: string;
}

const foodModules = import.meta.glob("../assets/food/plated-food/*.png", {
  eager: true,
}) as Record<string, { default: string }>;

function formatFoodName(filename: string): string {
  return filename
    .replace(/^\d+_/, "")
    .replace(/\.png$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const foodItems: PetItem[] = Object.entries(foodModules)
  .map(([path, module]) => {
    const filename = path.split("/").pop() ?? "";
    const id = filename.match(/^(\d+)_/)?.[1];

    return {
      id: `food-${id ?? filename}`,
      name: formatFoodName(filename),
      type: "food" as const,
      rarity: "Common" as const,
      image: module.default,
    };
  })
  .filter((item) => item.image)
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export const PET_ITEMS: PetItem[] = [
  ...foodItems,
  {
    id: "customization-bow",
    name: "Bow",
    type: "customization",
    rarity: "Uncommon",
    icon: "🎀",
  },
  {
    id: "customization-sunglasses",
    name: "Sunglasses",
    type: "customization",
    rarity: "Rare",
    icon: "🕶️",
  },
  {
    id: "customization-crown",
    name: "Crown",
    type: "customization",
    rarity: "Epic",
    icon: "👑",
  },
];

export type PetInventory = Record<string, number>;
