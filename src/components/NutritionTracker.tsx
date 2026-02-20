"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Activity, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { AddMealForm } from "./AddMealForm";
import { MacroVisualizer } from "./MacroVisualizer";
import { GoalsProgress } from "./GoalsProgress";
import { HistoryCalendar } from "./HistoryCalendar";
import { Macros, MealEntry } from "@/utils/macros";

export default function NutritionTracker() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "history">("dashboard");
    const [history, setHistory] = useState<MealEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch history on initial load
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/history");
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // Calculate today's macros
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEntries = history.filter(
        entry => new Date(entry.timestamp) >= todayStart
    );

    const currentMacros: Macros = todayEntries.reduce(
        (acc, entry) => ({
            protein: acc.protein + entry.macros.protein,
            carbs: acc.carbs + entry.macros.carbs,
            fiber: acc.fiber + entry.macros.fiber,
            fats: acc.fats + entry.macros.fats,
            kcal: acc.kcal + entry.macros.kcal,
        }),
        { protein: 0, carbs: 0, fiber: 0, fats: 0, kcal: 0 }
    );

    // Round accumulated macros to 1 decimal place
    currentMacros.protein = Math.round(currentMacros.protein * 10) / 10;
    currentMacros.carbs = Math.round(currentMacros.carbs * 10) / 10;
    currentMacros.fiber = Math.round(currentMacros.fiber * 10) / 10;
    currentMacros.fats = Math.round(currentMacros.fats * 10) / 10;
    currentMacros.kcal = Math.round(currentMacros.kcal * 10) / 10;

    const handleAddMeal = async (newMeal: MealEntry) => {
        // Optimistic UI Update
        setHistory(prev => [...prev, newMeal]);

        // Persist to local JSON via API route
        try {
            const res = await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMeal),
            });
            if (!res.ok) {
                console.error("Failed to save meal");
                // Optionally revert optimistic update here on fail
            }
        } catch (error) {
            console.error("Error saving to local storage file", error);
        }
    };

    const handleDeleteMeal = async (id: string) => {
        // Optimistic UI Update
        const previousHistory = [...history];
        setHistory(prev => prev.filter(entry => entry.id !== id));

        // Delete from local JSON via API route
        try {
            const res = await fetch("/api/history", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                console.error("Failed to delete meal");
                setHistory(previousHistory); // Revert optimistic update
            }
        } catch (error) {
            console.error("Error deleting from local storage file", error);
            setHistory(previousHistory); // Revert optimistic update
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col min-h-screen">
            {/* Header & Navigation */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 pt-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric flex items-center justify-center shadow-[0_0_20px_rgba(157,80,187,0.6)]">
                        <span className="text-white font-bold text-xl tracking-tighter">N</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        Nutri<span className="text-electric">Track</span>
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={cn(
                            "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                            activeTab === "dashboard"
                                ? "bg-electric/20 text-electric neon-border shadow-md"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Activity size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                            activeTab === "history"
                                ? "bg-electric/20 text-electric neon-border shadow-md"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <CalendarIcon size={18} />
                        History
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <Loader2 className="w-8 h-8 text-electric animate-spin shadow-[0_0_15px_rgba(157,80,187,0.5)] rounded-full" />
                    </div>
                ) : (
                    <>
                        {/* Dashboard View */}
                        <div
                            className={cn(
                                "transition-all duration-500 ease-in-out absolute w-full",
                                activeTab === "dashboard" ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-4 pointer-events-none -z-10"
                            )}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                {/* Visualizer takes up more space */}
                                <div className="md:col-span-2">
                                    <MacroVisualizer currentMacros={currentMacros} />
                                </div>
                                {/* Goals Progress */}
                                <div className="md:col-span-1 border border-white/10 rounded-2xl p-0.5 shadow-lg bg-gradient-to-br from-white/10 to-transparent">
                                    <GoalsProgress currentMacros={currentMacros} />
                                </div>
                                {/* Form Input and Recent Logs spanning full width beneath */}
                                <div className="md:col-span-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <AddMealForm onAdd={handleAddMeal} />

                                        {/* Recent Meals for Today */}
                                        <div className="glass-card flex flex-col gap-4">
                                            <h2 className="text-xl font-semibold text-white mb-2">Today's Logs</h2>
                                            {todayEntries.length === 0 ? (
                                                <p className="text-slate-400 text-sm italic">No meals logged yet today.</p>
                                            ) : (
                                                <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-2">
                                                    {todayEntries.slice().reverse().map(entry => (
                                                        <div key={entry.id} className="flex flex-col p-3 rounded-lg bg-white/5 border border-white/5 group">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex flex-col flex-1">
                                                                    {(entry.items || [{ ingredient: entry.ingredient || 'Unknown', quantity: entry.quantity || 0 }]).map((item, i) => (
                                                                        <span key={i} className="text-white font-medium text-sm capitalize">
                                                                            {item.ingredient} <span className="text-slate-400 font-normal text-xs">({item.quantity}g)</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <div className="flex flex-col items-end shrink-0">
                                                                    <span className="text-electric text-sm font-bold">{entry.macros.kcal} kcal</span>
                                                                    <button
                                                                        onClick={() => handleDeleteMeal(entry.id)}
                                                                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1 underline"
                                                                    >
                                                                        Undo / Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History View */}
                        <div
                            className={cn(
                                "transition-all duration-500 ease-in-out absolute w-full",
                                activeTab === "history" ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-4 pointer-events-none -z-10"
                            )}
                        >
                            <HistoryCalendar history={history} onDelete={handleDeleteMeal} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
