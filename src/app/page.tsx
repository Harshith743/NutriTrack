import NutritionTracker from "@/components/NutritionTracker";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-obsidian to-obsidian overflow-hidden">
      {/* Decorative background flare */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full h-full text-foreground max-w-7xl mx-auto">
        <NutritionTracker />
      </div>
    </div>
  );
}
