"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { calculateMacros, MealItem } from "@/utils/macros";

export function AddMealForm({ onAdd }: { onAdd: (meal: any) => void }) {
    const [items, setItems] = useState<MealItem[]>([{ ingredient: "", quantity: 0 }]);
    const [error, setError] = useState("");

    const handleItemChange = (index: number, field: keyof MealItem, value: string) => {
        const newItems = [...items];
        if (field === "quantity") {
            newItems[index].quantity = value ? parseFloat(value) : 0;
        } else {
            newItems[index].ingredient = value;
        }
        setItems(newItems);
    };

    const addItemRow = () => {
        setItems([...items, { ingredient: "", quantity: 0 }]);
    };

    const removeItemRow = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate items
        const validItems = items.filter(i => i.ingredient.trim() !== "" && i.quantity > 0);

        if (validItems.length === 0) {
            setError("Please enter at least one valid ingredient and quantity");
            return;
        }

        const macros = calculateMacros(validItems);

        // A quick check if macros calculation resulted in 0 (meaning ingredients were not found)
        if (macros.kcal === 0) {
            setError(`None of the ingredients were found in the database (try chicken, rice, egg, avocado)`);
            return;
        }

        const newMeal = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            items: validItems,
            macros
        };

        onAdd(newMeal);
        setItems([{ ingredient: "", quantity: 0 }]);
    };

    return (
        <div className="glass-card flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Plus size={20} className="text-electric" />
                Add Meal log
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 relative group">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                Ingredient Name
                            </label>
                            <input
                                type="text"
                                value={item.ingredient}
                                onChange={(e) => handleItemChange(index, 'ingredient', e.target.value)}
                                placeholder="e.g. Chicken breast"
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <div className="flex-[0.5] flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                Quantity (g)
                            </label>
                            <input
                                type="number"
                                value={item.quantity || ""}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder="100"
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                            />
                        </div>

                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItemRow(index)}
                                className="absolute right-[-10px] sm:static sm:mt-6 text-red-400 hover:text-red-300 opacity-50 hover:opacity-100 transition-opacity"
                                title="Remove ingredient"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItemRow}
                    className="flex justify-center items-center gap-2 text-electric text-sm py-2 hover:bg-white/5 rounded-lg border border-dashed border-electric/30 hover:border-electric transition-all"
                >
                    <Plus size={16} /> Add another ingredient
                </button>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-electric/80 hover:bg-electric text-white font-semibold py-3 mt-2 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(157,80,187,0.4)] hover:shadow-[0_0_20px_rgba(157,80,187,0.6)]"
                >
                    Add to Daily Log
                </button>
            </form>
        </div>
    );
}
