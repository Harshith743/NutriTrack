"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { calculateMacros, MealItem, MACRO_DATABASE } from "@/utils/macros";

export function AddMealForm({ onAdd }: { onAdd: (meal: any) => void }) {
    const [items, setItems] = useState<MealItem[]>([{ ingredient: "", quantity: 0 }]);
    const [error, setError] = useState("");

    // Autocomplete State
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setFocusedIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemChange = (index: number, field: keyof MealItem, value: string) => {
        const newItems = [...items];
        if (field === "quantity") {
            newItems[index].quantity = value ? parseFloat(value) : 0;
        } else {
            newItems[index].ingredient = value;

            // Autocomplete filtering
            if (value.trim() === "") {
                setSuggestions([]);
            } else {
                const search = value.toLowerCase().trim();
                const matches = Object.keys(MACRO_DATABASE).filter(key =>
                    key.includes(search) || key.replace(/_/g, " ").includes(search)
                );
                setSuggestions(matches);
            }
        }
        setItems(newItems);
    };

    const selectSuggestion = (index: number, suggestion: string) => {
        const newItems = [...items];
        newItems[index].ingredient = suggestion.replace(/_/g, " "); // Format nicely for UI
        setItems(newItems);
        setFocusedIndex(null);
        setSuggestions([]);
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
            setError(`None of the ingredients were found in the database. Please select an autocomplete option.`);
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
        setFocusedIndex(null);
    };

    return (
        <div className="glass-card flex flex-col gap-4" ref={containerRef}>
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
                                    onFocus={() => {
                                        setFocusedIndex(index);
                                        // Trigger filter on focus if there's already text
                                        handleItemChange(index, 'ingredient', item.ingredient);
                                    }}
                                    placeholder="e.g. Chicken breast"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
                                    autoComplete="off"
                                />

                                {/* Autocomplete Dropdown */}
                                {focusedIndex === index && suggestions.length > 0 && (
                                    <ul className="absolute z-50 w-full mt-1 bg-[#1a1525] border border-electric/30 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] max-h-48 overflow-y-auto custom-scrollbar">
                                        {suggestions.map(suggestion => (
                                            <li
                                                key={suggestion}
                                                onClick={() => selectSuggestion(index, suggestion)}
                                                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-slate-300 hover:text-white capitalize transition-colors"
                                            >
                                                {suggestion.replace(/_/g, " ")}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600"
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
                    className="w-full bg-electric/80 hover:bg-electric text-white font-semibold py-3 mt-2 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(157,80,187,0.4)] hover:shadow-[0_0_20px_rgba(157,80,187,0.6)]"
                >
                    Add to Daily Log
                </button>
            </form>
        </div>
    );
}
