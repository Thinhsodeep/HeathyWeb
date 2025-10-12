// src/types/models.ts
export type Goal = "lose" | "maintain" | "gain";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very";

export interface UserProfile {
  id: string;
  name: string;
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  allergies?: string[];
  conditions?: string[]; // ví dụ: "tiểu đường", "cao huyết áp"
}

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number; // per 100g
  micros?: Record<string, number>;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { foodId: string; grams: number }[];
  tags: string[];
  steps: string[];
  imageUrl?: string;
}

export interface DayMeal {
  date: string; // YYYY-MM-DD
  items: {
    time: "breakfast" | "lunch" | "dinner" | "snack";
    recipeId?: string;
    foodId?: string;
    grams?: number;
  }[];
}

export interface WeightLog {
  date: string;
  kg: number;
}
