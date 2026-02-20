// src/utils/macros.ts

export interface Macros {
    protein: number;
    carbs: number;
    fiber: number;
    fats: number;
    kcal: number;
}

export interface MealEntry {
    id: string;
    timestamp: string;
    ingredient: string;
    quantity: number;
    macros: Macros;
}

// A simple mock database for ingredient macros per 100g
const MACRO_DATABASE: Record<string, Macros> = {
    chicken: { kcal: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
    rice: { kcal: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 },
    broccoli: { kcal: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
    egg: { kcal: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0 },
    avocado: { kcal: 160, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7 },
    oats: { kcal: 389, protein: 16.9, carbs: 66.3, fats: 6.9, fiber: 10.6 },
    salmon: { kcal: 208, protein: 20, carbs: 0, fats: 13, fiber: 0 },
    almonds: { kcal: 579, protein: 21, carbs: 22, fats: 50, fiber: 12.5 },
    apple: { kcal: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 },
    beef: { kcal: 250, protein: 26, carbs: 0, fats: 15, fiber: 0 },
};

export function calculateMacros(ingredient: string, quantityGrams: number): Macros | null {
    const normalizedIngredient = ingredient.toLowerCase().trim();

    // Find ingredient (simple loose matching for the mock)
    const key = Object.keys(MACRO_DATABASE).find((k) =>
        normalizedIngredient.includes(k) || k.includes(normalizedIngredient)
    );

    if (!key) return null;

    const baseMacros = MACRO_DATABASE[key];
    const multiplier = quantityGrams / 100;

    return {
        protein: Number((baseMacros.protein * multiplier).toFixed(1)),
        carbs: Number((baseMacros.carbs * multiplier).toFixed(1)),
        fiber: Number((baseMacros.fiber * multiplier).toFixed(1)),
        fats: Number((baseMacros.fats * multiplier).toFixed(1)),
        kcal: Number((baseMacros.kcal * multiplier).toFixed(0)),
    };
}
