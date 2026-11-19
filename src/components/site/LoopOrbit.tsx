import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Signature visual: the owner sits at the centre; five supplier threads orbit.
 * Each round, quotes travel inward along their spoke and the price ring
 * tightens towards the target band. Ineligible suppliers drift out and fade.
 */
const sups = [
  { name: "Al-Madina", path: [355, 345, 328], end: "ok", tag: "WhatsApp test" },
  { name: "Chenab", path: [362, 340, 333], end: "ok", tag: "Simulated" },
  { name: "FSK Mills", path: [350, 350, 350], end: "wait", tag: "Slow" },
  { name: "Crescent", path: [0, 0, 0], end: "usd", tag: "USD — not comparable" },
  { name: "Indus", path: [385, 385, 385], end: "out", tag: "Above ceiling" },
] as const;

const MIN = 310, MAX = 390;
const radiusFor = (p: number) => 70 + ((p - MIN) / (MAX - MIN)) * 140;

export function LoopOrbit() {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (reduce) { setRound(2); return; }
    const id = setInterval(() => setRound((r) => (r + 1) % 4), 2400);
    return () => clearInterval(id);
  }, [reduce]);
  const r = Math.min(round, 2);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" role="img" aria-label="Five supplier negotiations converging toward the owner's target price">
      <svg viewBox="-260 -260 520 520" className="absolute inset-0 size-full overflow-visible">
        {/* price rings */}
        {[320, 345, 370].map((p) => (
          <g key={p}>
            <circle r={radiusFor(p)} fill="none" className={p === 345 ? "stroke-destructive/50" : "stroke-border"} strokeDasharray={p === 345 ? "4 6" : "2 6"} />
            <text y={-radiusFor(p) - 6} textAnchor="middle" className="fill-muted-foreground numeral text-[10px]">
              {p === 345 ? "₨345 hard ceiling" : `₨${p}`}
            </text>
          </g>
        ))}
        {/* target band */}
        <circle r={radiusFor(318)} className="fill-primary/10 stroke-primary/40" />
        <motion.circle r={radiusFor(318)} fill="none" className="stroke-primary" strokeWidth={1.5}
          animate={reduce ? {} : { scale: [1, 1.08, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2.4, repeat: Infinity }} />
        {/* rotating group */}
        <motion.g animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
          {sups.map((s, i) => {
            const a = (i / sups.length) * Math.PI * 2 - Math.PI / 2;
            const price = s.end === "usd" ? 0 : (s.path[r] ?? 0);
            const rad = s.end === "usd" ? 232 : s.end === "out" ? radiusFor(price) + (r === 2 ? 22 : 0) : radiusFor(price);
            const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
            const tone = s.end === "ok" ? "fill-primary" : s.end === "wait" ? "fill-gold" : "fill-muted-foreground";
            return (
              <g key={s.name}>
                <line x1={0} y1={0} x2={Math.cos(a) * 240} y2={Math.sin(a) * 240} className="stroke-border" />
                {/* travelling quote pulse */}
                {s.end !== "usd" && s.end !== "out" && (
                  <motion.circle r={3} className="fill-gold" key={round}
                    initial={{ cx: Math.cos(a) * 240, cy: Math.sin(a) * 240, opacity: 1 }}
                    animate={reduce ? { cx: Math.cos(a) * 240, cy: Math.sin(a) * 240, opacity: 0 } : { cx: 0, cy: 0, opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeIn" }} />
                )}
                <motion.g animate={{ x, y, opacity: s.end === "out" && r === 2 ? 0.45 : 1 }} transition={{ type: "spring", stiffness: 60, damping: 14 }}>
                  <circle r={s.end === "ok" && r === 2 ? 11 : 8} className={tone} />
                  {s.end === "ok" && r === 2 && <circle r={17} fill="none" className="stroke-primary/40" />}
                </motion.g>
              </g>
            );
          })}
        </motion.g>
        {/* owner */}
        <circle r={36} className="fill-ink" />
        <text y={-2} textAnchor="middle" className="fill-ink-foreground text-[11px] font-semibold">YOU</text>
        <text y={13} textAnchor="middle" className="fill-gold text-[9px]">decide</text>
      </svg>
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-sm">
        <span className="eyebrow text-muted-foreground">Round</span>
        <motion.span key={r} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="numeral text-sm">{r + 1} / 5</motion.span>
      </div>
    </div>
  );
}

export const orbitLegend = sups;
