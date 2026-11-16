import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const script = [
  { who: "in", name: "Al-Madina", text: "Rate 355 per kg hai 800 kg pe.", price: 355 },
  { who: "out", name: "Agent", text: "355 is above budget. We can offer 320/kg.", price: 320 },
  { who: "in", name: "Al-Madina", text: "Bhai 320 kam hai. 345 final.", price: 345 },
  { who: "out", name: "Agent", text: "Final position: 328/kg, 3-day delivery.", price: 328 },
  { who: "in", name: "Al-Madina", text: "Theek hai, 328 agree. ✓", price: 328 },
] as const;

export function HeroNegotiation() {
  const [step, setStep] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s >= script.length + 1 ? 1 : s + 1)), 1900);
    return () => clearInterval(id);
  }, []);
  const shown = script.slice(0, Math.min(step, script.length));
  const current = shown[shown.length - 1]?.price ?? 355;
  const pct = ((365 - current) / (365 - 310)) * 100;

  return (
    <div className="relative w-full max-w-md">
      <motion.div aria-hidden className="absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-gold/30 via-primary/10 to-transparent blur-3xl animate-float-slow" />
      <div className="relative rounded-[2rem] border bg-card/90 p-5 shadow-[0_40px_80px_-30px_color-mix(in_oklab,var(--color-ink)_35%,transparent)] backdrop-blur">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="eyebrow text-muted-foreground">Thread · WhatsApp test</p>
            <p className="font-medium">Al-Madina Paper & Board</p>
          </div>
          <div className="text-right">
            <p className="eyebrow text-muted-foreground">Live quote</p>
            <motion.p key={current} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="numeral text-2xl text-primary">
              ₨{current}
            </motion.p>
          </div>
        </div>
        <div className="flex h-72 flex-col justify-end gap-2.5 overflow-hidden py-4" aria-live="polite">
          <AnimatePresence initial={false}>
            {shown.map((m, i) => (
              <motion.div
                key={i + m.text}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className={m.who === "out" ? "ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-ink-foreground" : "max-w-[82%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm"}
              >
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="border-t pt-4">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Target ₨318</span><span>Ceiling ₨345</span>
          </div>
          <div className="relative h-2 rounded-full bg-secondary">
            <div className="absolute inset-y-0 left-[12%] right-[36%] rounded-full bg-primary/15" />
            <motion.div className="absolute -top-1 size-4 rounded-full border-2 border-card bg-primary shadow" animate={{ left: `calc(${pct}% - 8px)` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute -right-4 -top-6 hidden rounded-2xl border bg-card px-4 py-3 shadow-lg sm:block animate-float">
        <p className="eyebrow text-muted-foreground">Saved vs first quote</p>
        <p className="numeral text-lg text-success">−7.6%</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="absolute -bottom-6 -left-6 hidden rounded-2xl border bg-card px-4 py-3 shadow-lg sm:block animate-float-slow">
        <p className="eyebrow text-muted-foreground">Hard limit checks</p>
        <p className="text-sm font-medium">0 breaches · policy-v0.4</p>
      </motion.div>
    </div>
  );
}
