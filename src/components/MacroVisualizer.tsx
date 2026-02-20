"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Macros } from "@/utils/macros";

export function MacroVisualizer({ currentMacros }: { currentMacros: Macros }) {
    const data = [
        { name: "Protein", value: currentMacros.protein, color: "#9D50BB" }, // Electric Purple
        { name: "Carbs", value: currentMacros.carbs, color: "#4ade80" }, // Green
        { name: "Fats", value: currentMacros.fats, color: "#facc15" }, // Yellow
        { name: "Fiber", value: currentMacros.fiber, color: "#38bdf8" }, // Blue
    ].filter(d => d.value > 0);

    const totalMacros = data.reduce((sum, item) => sum + item.value, 0);

    if (totalMacros === 0) {
        return (
            <div className="glass-card flex flex-col items-center justify-center p-8 h-64">
                <div className="text-slate-400 mb-2">No meals logged today yet.</div>
                <div className="text-sm font-medium text-electric/80">Add your first meal to see macros!</div>
            </div>
        );
    }

    return (
        <div className="glass-card flex flex-col md:flex-row items-center justify-between gap-8 h-full bg-gradient-to-br from-white/5 to-transparent">
            {/* Chart */}
            <div className="w-full md:w-1/2 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}80)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(11, 11, 12, 0.9)',
                                borderColor: 'rgba(157, 80, 187, 0.3)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [`${value}g`, "Amount"]}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {currentMacros.kcal}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                        Kcal
                    </span>
                </div>
            </div>

            {/* Legend & Stats */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-2">
                    Daily Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                    backgroundColor: item.color,
                                    boxShadow: `0 0 10px ${item.color}80`
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-xs font-medium uppercase">{item.name}</span>
                                <span className="text-white font-semibold">{item.value.toFixed(1)}g</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
