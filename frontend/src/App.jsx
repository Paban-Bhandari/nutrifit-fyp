function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
              NF
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">NutriFit</p>
              <p className="text-xs text-slate-400">
                AI-Powered Nepali Diet Planner
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <button className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition">
              Login
            </button>
            <button className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Made for Nepali foods · Diabetes & budget aware
            </p>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Personalized Nepali diet plans in just a few clicks.
              </h1>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                NutriFit analyzes your age, weight, activity level, diabetes status, and budget to
                generate balanced meal plans using common Nepali foods. No generic Western diets,
                just practical, local recommendations you can actually follow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition">
                Create your profile
              </button>
              <button className="text-sm text-slate-300 hover:text-emerald-300 transition">
                Preview dashboard
              </button>
            </div>

            <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="font-semibold text-slate-100">AI Meal Planning</p>
                <p className="mt-1 text-slate-400">
                  K-Means clustering + content-based filtering to match meals to your profile.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="font-semibold text-slate-100">Nepali Food Database</p>
                <p className="mt-1 text-slate-400">
                  50–60 common Nepali foods with calories, macros, and glycemic index.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="font-semibold text-slate-100">Budget & Diabetes Aware</p>
                <p className="mt-1 text-slate-400">
                  Respect your monthly budget and flag diabetes-friendly options.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/60">
            <p className="text-xs font-medium text-slate-300">Sample daily plan</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Based on a 25-year-old, 65kg, lightly active user with diabetes.
            </p>

            <div className="mt-4 grid gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100">Breakfast</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                    420 kcal
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li>• 2x Dhido (buckwheat, small portion)</li>
                  <li>• 1x boiled egg</li>
                  <li>• 1 cup milk tea (no sugar)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100">Lunch</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                    650 kcal
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li>• Brown rice (1 plate)</li>
                  <li>• Dal (1 bowl) + seasonal tarkari</li>
                  <li>• Cucumber & carrot salad</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100">Dinner</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                    580 kcal
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-300">
                  <li>• Roti (2 medium, whole wheat)</li>
                  <li>• Grilled chicken (small piece)</li>
                  <li>• Saag (green leafy vegetables)</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              <p>Total: 1,650 kcal · 25% protein · 50% carbs · 25% fats</p>
              <p className="text-emerald-300">Under budget · Diabetes-safe</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
