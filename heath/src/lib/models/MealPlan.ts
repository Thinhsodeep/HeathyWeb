// src/lib/models/MealPlan.ts
import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  foodId?: Types.ObjectId; // optional nếu item nhập tay
  name: string;
  grams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealBlock {
  time: MealSlot;
  items: MealItem[];
}

export interface MealPlanDoc extends Document {
  userId: Types.ObjectId;
  date: Date;
  meals: MealBlock[];
  totals: MacroTotals;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa Model type để truyền vào Schema generics
export type MealPlanModel = Model<MealPlanDoc>;

const MealItemSchema = new Schema<MealItem>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food" },
    name: { type: String, required: true },
    grams: Number,
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false }
);

const MealBlockSchema = new Schema<MealBlock>(
  {
    time: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    items: { type: [MealItemSchema], default: [] },
  },
  { _id: false }
);

const MealPlanSchema = new Schema<MealPlanDoc, MealPlanModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    meals: { type: [MealBlockSchema], default: [] },
    totals: {
      calories: { type: Number, required: true, default: 0 },
      protein: { type: Number, required: true, default: 0 },
      carbs: { type: Number, required: true, default: 0 },
      fat: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true }
);

// Xuất Model (tránh compile lại nhiều lần khi hot-reload)
export const MealPlan: MealPlanModel =
  (models.MealPlan as MealPlanModel) ||
  model<MealPlanDoc, MealPlanModel>("MealPlan", MealPlanSchema);

export default MealPlan;
