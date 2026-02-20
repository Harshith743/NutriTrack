"use client";

import { Macros } from "@/utils/macros";
import { clsx } from "clsx";

export function GoalsProgress({ currentMacros }: { currentMacros: Macros }) {
    const GOALS = {
        kcal: 2000,
        protein: 150,
        fiber: 35
    };

    const calculatePercentage = (current: number, goal: number) => {
        return Math.min(100, Math.max(0, (current / goal) * 100));
    };

    return (
        <div className="glass-card flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Daily Targets
            </h2>

            <div className="flex flex-col gap-5">

                {/* Calories Goal */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-300">Calories</span>
                        <span className="text-xs font-mono text-electric">
                            <span className="text-white text-sm">{currentMacros.kcal}</span> / {GOALS.kcal} kcal
                        </span>
                    </div>
                    <ProgressBar
                        percent={calculatePercentage(currentMacros.kcal, GOALS.kcal)}
                        colorClass="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    />
                </div>

                {/* Protein Goal */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-300">Protein</span>
                        <span className="text-xs font-mono text-electric">
                            <span className="text-white text-sm">{currentMacros.protein.toFixed(1)}</span> / {GOALS.protein} g
                        </span>
                    </div>
                    <ProgressBar
                        percent={calculatePercentage(currentMacros.protein, GOALS.protein)}
                        colorClass="bg-electric shadow-[0_0_10px_rgba(157,80,187,0.6)]"
                    />
                </div>

                {/* Fiber Goal */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-300">Fiber</span>
                        <span className="text-xs font-mono text-electric">
                            <span className="text-white text-sm">{currentMacros.fiber.toFixed(1)}</span> / {GOALS.fiber} g
                        </span>
                    </div>
                    <ProgressBar
                        percent={calculatePercentage(currentMacros.fiber, GOALS.fiber)}
                        colorClass="bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"
                    />
                </div>

            </div>
        </div>
    );
}

function ProgressBar({ percent, colorClass }: { percent: number; colorClass: string }) {
    return (
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
                className={clsx("h-full rounded-full transition-all duration-1000 ease-out", colorClass)}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}
