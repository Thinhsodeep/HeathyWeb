import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

async function readJSON<T>(file: string): Promise<T> {
  const p = path.join(dataDir, file);
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJSON<T>(file: string, data: T) {
  const p = path.join(dataDir, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
export interface Recipe {
  id: string;
  name: string;
  tags: string[];
  ingredients: { foodId: string; grams: number }[];
}

export const FoodRepo = {
  async all(): Promise<Food[]> {
    return readJSON<Food[]>("foods.json");
  },
  async get(id: string) {
    return (await this.all()).find((f) => f.id === id) || null;
  },
  async create(food: Food) {
    const list = await this.all();
    if (list.some((f) => f.id === food.id)) throw new Error("Food id exists");
    list.push(food);
    await writeJSON("foods.json", list);
    return food;
  },
  async update(id: string, patch: Partial<Food>) {
    const list = await this.all();
    const i = list.findIndex((f) => f.id === id);
    if (i === -1) throw new Error("Not found");
    list[i] = { ...list[i], ...patch, id };
    await writeJSON("foods.json", list);
    return list[i];
  },
  async remove(id: string) {
    const list = await this.all();
    const n = list.filter((f) => f.id !== id);
    await writeJSON("foods.json", n);
    return { ok: true };
  },
};

export const RecipeRepo = {
  async all(): Promise<Recipe[]> {
    return readJSON<Recipe[]>("recipes.json");
  },
  async get(id: string) {
    return (await this.all()).find((r) => r.id === id) || null;
  },
};
