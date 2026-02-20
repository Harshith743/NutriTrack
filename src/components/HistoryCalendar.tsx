"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { MealEntry } from "@/utils/macros";

export function HistoryCalendar({ history, onDelete }: { history: MealEntry[], onDelete?: (id: string) => void }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Get entries for selected date
    const selectedEntries = selectedDate
        ? history.filter(entry => isSameDay(new Date(entry.timestamp), selectedDate))
        : [];

    const selectedMacros = selectedEntries.reduce(
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
    selectedMacros.protein = Math.round(selectedMacros.protein * 10) / 10;
    selectedMacros.carbs = Math.round(selectedMacros.carbs * 10) / 10;
    selectedMacros.fiber = Math.round(selectedMacros.fiber * 10) / 10;
    selectedMacros.fats = Math.round(selectedMacros.fats * 10) / 10;
    selectedMacros.kcal = Math.round(selectedMacros.kcal * 10) / 10;

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full h-full">
            {/* Calendar Section */}
            <div className="glass-card flex-1 flex flex-col h-full bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-1">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Pad the beginning of the month */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-12 rounded-lg bg-white/[0.02]" />
                    ))}

                    {/* Days of the month */}
                    {daysInMonth.map(date => {
                        const hasData = history.some(entry => isSameDay(new Date(entry.timestamp), date));
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`
                  h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative
                  ${isSelected ? 'bg-electric/20 neon-border text-white shadow-md z-10 scale-110' : 'bg-black/40 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}
                  ${isToday && !isSelected ? 'border-electric/50 text-electric' : ''}
                `}
                            >
                                <span className="text-sm font-medium">{format(date, "d")}</span>
                                {hasData && (
                                    <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-electric shadow-[0_0_8px_rgba(157,80,187,0.8)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Details Section */}
            <div className={`glass-card md:w-[350px] transition-all duration-500 flex flex-col items-center justify-center ${selectedDate ? 'opacity-100' : 'opacity-50'}`}>
                {!selectedDate ? (
                    <div className="text-slate-500 text-center text-sm flex flex-col items-center gap-3">
                        <Calendar size={32} className="opacity-50" />
                        <p>Select a date to view meal logs</p>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col relative w-full items-start justify-start">
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="absolute top-0 right-0 p-1 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="text-lg font-bold text-white mb-1">
                            {format(selectedDate, "MMMM d, yyyy")}
                        </h3>

                        {selectedEntries.length === 0 ? (
                            <p className="text-slate-400 text-sm mt-4">No meals logged for this day.</p>
                        ) : (
                            <div className="w-full flex flex-col gap-6 mt-4">
                                {/* Total Macros for the day */}
                                <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner w-full justify-between items-center text-sm">
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-bold">{selectedMacros.kcal}</span>
                                        <span className="text-slate-500 text-[10px] uppercase">Kcal</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex flex-col items-center text-electric">
                                        <span className="font-bold">{selectedMacros.protein.toFixed(0)}g</span>
                                        <span className="text-[10px] uppercase">Pro</span>
                                    </div>
                                    <div className="flex flex-col items-center text-green-400">
                                        <span className="font-bold">{selectedMacros.carbs.toFixed(0)}g</span>
                                        <span className="text-[10px] uppercase">Carb</span>
                                    </div>
                                    <div className="flex flex-col items-center text-yellow-400">
                                        <span className="font-bold">{selectedMacros.fats.toFixed(0)}g</span>
                                        <span className="text-[10px] uppercase">Fat</span>
                                    </div>
                                </div>

                                {/* List of meals */}
                                <div className="flex flex-col gap-3 w-full pr-2">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entries</h4>
                                    {selectedEntries.map(entry => (
                                        <div key={entry.id} className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                            <div className="flex justify-between items-start w-full">
                                                <div className="flex flex-col">
                                                    {(entry.items || [{ ingredient: entry.ingredient || 'Unknown', quantity: entry.quantity || 0 }]).map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <span className="text-white font-medium text-sm capitalize">{item.ingredient}</span>
                                                            <span className="text-slate-400 text-xs">({item.quantity}g)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <span className="text-electric text-sm font-bold">{entry.macros.kcal} <span className="text-xs font-normal">kcal</span></span>
                                                    <span className="text-slate-500 text-[10px]">{format(new Date(entry.timestamp), "h:mm a")}</span>

                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(entry.id)}
                                                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] mt-1"
                                                        >
                                                            <X size={12} /> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
