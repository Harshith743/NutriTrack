"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { MealItem, Macros } from "@/utils/macros";

export function AddMealForm({ onAdd }: { onAdd: (meal: any) => void }) {
    const [items, setItems] = useState<MealItem[]>([{ ingredient: "", quantity: 0 }]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate items
        const validItems = items.filter(i => i.ingredient.trim() !== "" && i.quantity > 0);

        if (validItems.length === 0) {
            setError("Please enter at least one valid ingredient and quantity");
            return;
        }

        setIsSubmitting(true);

        try {
            // Combine all items into a single natural language query for CalorieNinjas
            // e.g. "100g chicken and 50g rice"
            const queryParts = validItems.map(item => `${item.quantity}g ${item.ingredient}`);
            const queryString = queryParts.join(" and ");

            const response = await fetch(`/api/nutrition?query=${encodeURIComponent(queryString)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch accurate nutrition data");
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                throw new Error("No nutritional information found for those ingredients.");
            }

            // Sum up the macros from all returned items
            const macros: Macros = { protein: 0, carbs: 0, fiber: 0, fats: 0, kcal: 0 };
            data.items.forEach((item: any) => {
                macros.protein += item.protein_g || 0;
                macros.carbs += item.carbohydrates_total_g || 0;
                macros.fiber += item.fiber_g || 0;
                macros.fats += item.fat_total_g || 0;
                macros.kcal += item.calories || 0;
            });

            // Round the macros to 1 decimal place max to avoid floating point issues
            macros.protein = Math.round(macros.protein * 10) / 10;
            macros.carbs = Math.round(macros.carbs * 10) / 10;
            macros.fiber = Math.round(macros.fiber * 10) / 10;
            macros.fats = Math.round(macros.fats * 10) / 10;
            macros.kcal = Math.round(macros.kcal * 10) / 10;

            const newMeal = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                items: validItems,
                macros
            };

            onAdd(newMeal);
            setItems([{ ingredient: "", quantity: 0 }]);
        } catch (err: any) {
            setError(err.message || "An error occurred fetching nutrition data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Plus size={20} className="text-electric" />
                Add Meal log
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    {/* Headers for desktop */}
                    <div className="hidden sm:flex flex-row gap-4 px-1">
                        <div className="flex-1 text-xs text-slate-400 font-medium uppercase tracking-wider">Ingredient Name</div>
                        <div className="flex-[0.5] text-xs text-slate-400 font-medium uppercase tracking-wider">Quantity (g)</div>
                        {items.length > 1 && <div className="w-8"></div>}
                    </div>

                    {/* Rows */}
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center group">
                            <div className="flex-1 w-full relative">
                                <label className="sm:hidden text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 block">
                                    Ingredient Name
                                </label>
                                <input
                                    type="text"
                                    value={item.ingredient}
                                    onChange={(e) => handleItemChange(index, 'ingredient', e.target.value)}
                                    placeholder="e.g. Chicken breast"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-[16px] sm:text-sm text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="flex-[0.5] w-full flex gap-2 items-end sm:items-center">
                                <div className="flex-1 flex flex-col">
                                    <label className="sm:hidden text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 block">
                                        Quantity (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={item.quantity || ""}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        placeholder="100"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-[16px] sm:text-sm text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItemRow(index)}
                                        className="text-red-400 hover:text-red-300 opacity-50 hover:opacity-100 transition-opacity p-2 sm:p-0 mb-1 sm:mb-0 shrink-0"
                                        title="Remove ingredient"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

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
                    disabled={isSubmitting}
                    className="w-full bg-electric/80 hover:bg-electric text-white font-semibold py-3 mt-2 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(157,80,187,0.4)] hover:shadow-[0_0_20px_rgba(157,80,187,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Fetching Macros...</> : "Add to Daily Log"}
                </button>
            </form>
        </div>
    );
}
