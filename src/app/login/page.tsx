"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Please enter a password");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                // Refresh the router to trigger middleware check and redirect to home
                router.push("/");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Incorrect password");
                setPassword("");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
                <div className="w-[800px] h-[800px] bg-electric/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="glass-card w-full max-w-md p-8 flex flex-col gap-8 relative z-10 neon-border bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl">

                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-electric/20 flex items-center justify-center shadow-[0_0_30px_rgba(157,80,187,0.4)] border border-electric/40">
                        <Lock size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide mb-1">Secure Access</h1>
                        <p className="text-slate-400 text-sm">Enter your master password to continue</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all placeholder:text-slate-600 font-mono tracking-widest text-center"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center font-medium bg-red-400/10 border border-red-400/20 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-electric/90 hover:bg-electric text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(157,80,187,0.5)] hover:shadow-[0_0_30px_rgba(157,80,187,0.7)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                Unlock Dashboard <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}
