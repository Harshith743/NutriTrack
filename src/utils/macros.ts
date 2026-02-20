// src/utils/macros.ts

export interface Macros {
    protein: number;
    carbs: number;
    fiber: number;
    fats: number;
    kcal: number;
}

export interface MealItem {
    ingredient: string;
    quantity: number;
}

export interface MealEntry {
    id: string;
    timestamp: string;
    items?: MealItem[];  // Optional for backward compatibility
    ingredient?: string; // Legacy field
    quantity?: number;   // Legacy field
    macros: Macros;
}

// Database & local calculation logic removed in favor of live CalorieNinjas API.
