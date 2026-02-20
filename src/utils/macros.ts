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

export const MACRO_DATABASE: Record<string, Macros> = {
    // Meats & Fish
    chicken: { kcal: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
    beef: { kcal: 250, protein: 26, carbs: 0, fats: 15, fiber: 0 },
    pork: { kcal: 242, protein: 27, carbs: 0, fats: 14, fiber: 0 },
    turkey: { kcal: 189, protein: 29, carbs: 0, fats: 7, fiber: 0 },
    salmon: { kcal: 208, protein: 20, carbs: 0, fats: 13, fiber: 0 },
    tuna: { kcal: 132, protein: 28, carbs: 0, fats: 1, fiber: 0 },
    shrimp: { kcal: 99, protein: 24, carbs: 0.2, fats: 0.3, fiber: 0 },

    // Grains & Carbs
    rice: { kcal: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 },
    oats: { kcal: 389, protein: 16.9, carbs: 66.3, fats: 6.9, fiber: 10.6 },
    quinoa: { kcal: 120, protein: 4.4, carbs: 21.3, fats: 1.9, fiber: 2.8 },
    pasta: { kcal: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.2 },
    bread: { kcal: 265, protein: 9, carbs: 49, fats: 3.2, fiber: 2.7 },
    potato: { kcal: 77, protein: 2, carbs: 17, fats: 0.1, fiber: 2.2 },
    sweet_potato: { kcal: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3 },

    // Vegetables
    broccoli: { kcal: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6 },
    spinach: { kcal: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 },
    carrot: { kcal: 41, protein: 0.9, carbs: 9.6, fats: 0.2, fiber: 2.8 },
    onion: { kcal: 40, protein: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7 },
    garlic: { kcal: 149, protein: 6.4, carbs: 33, fats: 0.5, fiber: 2.1 },
    tomato: { kcal: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2 },
    cucumber: { kcal: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5 },
    bell_pepper: { kcal: 20, protein: 0.9, carbs: 4.6, fats: 0.2, fiber: 1.7 },
    mushroom: { kcal: 22, protein: 3.1, carbs: 3.3, fats: 0.3, fiber: 1 },

    // Fruits
    apple: { kcal: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 },
    banana: { kcal: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6 },
    orange: { kcal: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4 },
    strawberry: { kcal: 32, protein: 0.7, carbs: 7.7, fats: 0.3, fiber: 2 },
    blueberry: { kcal: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4 },
    grapes: { kcal: 69, protein: 0.7, carbs: 18, fats: 0.2, fiber: 0.9 },
    watermelon: { kcal: 30, protein: 0.6, carbs: 7.6, fats: 0.2, fiber: 0.4 },
    avocado: { kcal: 160, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7 },

    // Dairy & Eggs
    egg: { kcal: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0 },
    milk: { kcal: 42, protein: 3.4, carbs: 5, fats: 1, fiber: 0 },
    cheese: { kcal: 402, protein: 25, carbs: 1.3, fats: 33, fiber: 0 },
    yogurt: { kcal: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0 },
    butter: { kcal: 717, protein: 0.8, carbs: 0.1, fats: 81, fiber: 0 },

    // Nuts, Seeds & Legumes
    almonds: { kcal: 579, protein: 21, carbs: 22, fats: 50, fiber: 12.5 },
    walnuts: { kcal: 654, protein: 15, carbs: 14, fats: 65, fiber: 6.7 },
    peanuts: { kcal: 567, protein: 26, carbs: 16, fats: 49, fiber: 8.5 },
    chia_seeds: { kcal: 486, protein: 17, carbs: 42, fats: 31, fiber: 34 },
    lentils: { kcal: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 7.9 },
    black_beans: { kcal: 132, protein: 8.9, carbs: 23.7, fats: 0.5, fiber: 8.7 },
    chickpeas: { kcal: 164, protein: 8.9, carbs: 27, fats: 2.6, fiber: 7.6 },

    // Extras / Condiments
    olive_oil: { kcal: 884, protein: 0, carbs: 0, fats: 100, fiber: 0 },
    honey: { kcal: 304, protein: 0.3, carbs: 82, fats: 0, fiber: 0.2 },
    sugar: { kcal: 387, protein: 0, carbs: 100, fats: 0, fiber: 0 }
};

export function calculateMacros(items: MealItem[]): Macros {
    return items.reduce((acc, item) => {
        const normalizedIngredient = item.ingredient.toLowerCase().trim();
        const key = Object.keys(MACRO_DATABASE).find((k) =>
            normalizedIngredient.includes(k) || k.includes(normalizedIngredient)
        );

        if (key) {
            const baseMacros = MACRO_DATABASE[key];
            const multiplier = item.quantity / 100;
            acc.protein += baseMacros.protein * multiplier;
            acc.carbs += baseMacros.carbs * multiplier;
            acc.fiber += baseMacros.fiber * multiplier;
            acc.fats += baseMacros.fats * multiplier;
            acc.kcal += baseMacros.kcal * multiplier;
        }

        return acc;
    }, { protein: 0, carbs: 0, fiber: 0, fats: 0, kcal: 0 });
}
