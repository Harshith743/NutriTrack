"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { calculateMacros } from "@/utils/macros";

export function AddMealForm({ onAdd }: { onAdd: (meal: any) => void }) {
    const [ingredient, setIngredient] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!ingredient.trim()) {
            setError("Please enter an ingredient");
            return;
        }

        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty <= 0) {
            setError("Please enter a valid quantity in grams");
            return;
        }

        const macros = calculateMacros(ingredient, qty);

        if (!macros) {
            setError(`Ingredient "${ingredient}" not found in local database (try chicken, rice, egg, avocado)`);
            return;
        }

        const newMeal = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ingredient,
            quantity: qty,
            macros
        };

        onAdd(newMeal);
        setIngredient("");
        setQuantity("");
    };

    return (
        <div className="glass-card flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Plus size={20} className="text-electric" />
                Add Meal log
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            Ingredient Name
                        </label>
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => setIngredient(e.target.value)}
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
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="100"
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-electric/80 hover:bg-electric text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(157,80,187,0.4)] hover:shadow-[0_0_20px_rgba(157,80,187,0.6)]"
                >
                    Add to Daily Log
                </button>
            </form>
        </div>
    );
}
