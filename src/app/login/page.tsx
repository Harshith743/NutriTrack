"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Success! The cookie is now set. Next.js router handles the rest.
                router.push("/");
                router.refresh(); // Force refresh to ensure middleware sees the new cookie
            } else {
                const data = await res.json();
                setError(data.error || "Incorrect password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-obsidian bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-electric/10 via-obsidian to-obsidian">
            <div className="w-full max-w-md glass-card flex flex-col items-center justify-center p-8 sm:p-12 neon-border">
                <div className="w-16 h-16 rounded-full bg-electric/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(157,80,187,0.4)]">
                    <Lock className="w-8 h-8 text-electric" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Private Access</h1>
                <h2 className="text-slate-400 text-center mb-8 text-sm">
                    Enter the master password to access your NutriTrack dashboard.
                </h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            Master Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-[16px] sm:text-sm text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600 shadow-inner"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-electric/80 hover:bg-electric text-white font-semibold py-4 mt-4 rounded-xl transition-all shadow-[0_0_15px_rgba(157,80,187,0.4)] hover:shadow-[0_0_25px_rgba(157,80,187,0.6)] disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                        ) : (
                            <>Unlock Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
