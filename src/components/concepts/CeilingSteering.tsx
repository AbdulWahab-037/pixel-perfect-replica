import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const suppliers = [
  { name: "Al-Madina", quote: 328, city: "Lahore" },
  { name: "Chenab", quote: 333, city: "Gujranwala" },
  { name: "FSK Mills", quote: 350, city: "Faisalabad" },
  { name: "Crescent", quote: 357, city: "Karachi" },
  { name: "Indus", quote: 385, city: "Multan" },
];

/** Drag your price ceiling and watch every supplier react instantly. */
export function CeilingSteering() {
  const [ceiling, setCeiling] = useState(365);
  const target = 320;
  const eligible = suppliers.filter((s) => s.quote <= ceiling).sort((a, b) => a.quote - b.quote);
  const best = eligible[0];
  const pos = (p: number) => ((p - 310) / (395 - 310)) * 100;

  return (
    <div className="rounded-[2rem] border bg-card p-5 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Your hard ceiling</p>
          <motion.p key={ceiling} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="numeral text-4xl text-primary">₨{ceiling}<span className="text-base text-muted-foreground">/kg</span></motion.p>
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">Drag the slider. Suppliers above your limit are set aside — the assistant never offers more.</p>
      </div>

      <label className="sr-only" htmlFor="ceiling">Hard ceiling per kg</label>
      <input id="ceiling" type="range" min={325} max={390} value={ceiling} onChange={(e) => setCeiling(Number(e.target.value))} className="mt-6 w-full accent-primary" />

      <div className="relative mt-10 h-56">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="absolute top-0 bottom-0 w-px bg-gold" style={{ left: `${pos(target)}%` }}>
          <span className="eyebrow absolute -top-5 -translate-x-1/2 whitespace-nowrap text-gold">Target ₨{target}</span>
        </div>
        <motion.div className="absolute top-0 bottom-0 w-0.5 bg-destructive" animate={{ left: `${pos(ceiling)}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <span className="eyebrow absolute bottom-[-1.4rem] -translate-x-1/2 whitespace-nowrap text-destructive">Ceiling</span>
        </motion.div>
        {suppliers.map((s, i) => {
          const ok = s.quote <= ceiling;
          return (
            <motion.div key={s.name} className="absolute -translate-x-1/2" style={{ left: `${pos(s.quote)}%`, top: `${8 + i * 18}%` }}
              animate={{ opacity: ok ? 1 : 0.35, scale: ok ? 1 : 0.92, y: ok ? 0 : 6 }}>
              <div className={`rounded-full border px-3 py-1 text-xs whitespace-nowrap ${ok ? "bg-background" : "bg-muted line-through"} ${best?.name === s.name ? "border-primary ring-2 ring-primary/30" : ""}`}>
                {s.name} <span className="numeral">₨{s.quote}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-3 border-t pt-5 sm:grid-cols-3">
        <Stat label="Still in the running" value={`${eligible.length} of 5`} />
        <Stat label="Best eligible offer" value={best ? `${best.name} · ₨${best.quote}` : "None — raise ceiling"} />
        <AnimatePresence mode="wait">
          <motion.p key={eligible.length} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">
            {eligible.length === 5 ? "Everyone fits. The assistant will still push toward your target." : `${5 - eligible.length} set aside automatically. You still decide.`}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><p className="eyebrow text-muted-foreground">{label}</p><p className="numeral mt-1">{value}</p></div>;
}
