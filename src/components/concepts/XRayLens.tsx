import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

const msgs = [
  { t: "Bhai 345 se kam nahi banega, diesel mehnga ho gaya hai", tags: [["Price", "₨345/kg"], ["Stance", "Firm"], ["Reason", "Fuel cost"]] },
  { t: "800 kg ready hai, parson tak deliver kar denge", tags: [["Qty", "800 kg"], ["Delivery", "2 days"]] },
  { t: "Advance 30% chahiye, baqi delivery pe", tags: [["Payment", "30% advance"], ["Confidence", "96%"]] },
];

/** Move over the messy chat: a lens reveals what SupplierLoop understood. */
export function XRayLens() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [p, setP] = useState({ x: 160, y: 90, on: false });
  const R = 110;
  const move = (cx: number, cy: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (b) setP({ x: cx - b.left, y: cy - b.top, on: true });
  };
  const clip = `circle(${p.on || reduce ? R : 0}px at ${p.x}px ${p.y}px)`;

  const Chat = ({ xray }: { xray: boolean }) => (
    <div className="space-y-4 p-6">
      {msgs.map((m, i) => (
        <div key={i} className={`max-w-md rounded-2xl rounded-tl-sm border px-4 py-3 ${xray ? "bg-ink text-ink-foreground" : "bg-background"}`}>
          {xray ? (
            <div className="flex flex-wrap gap-2">
              {m.tags.map(([k, v]) => (
                <span key={k} className="rounded-md border border-primary/60 bg-primary/20 px-2 py-0.5 font-mono text-xs"><span className="opacity-60">{k}:</span> {v}</span>
              ))}
            </div>
          ) : <p className="text-sm">{m.t}</p>}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="relative cursor-none touch-none overflow-hidden rounded-[2rem] border bg-secondary"
      onPointerMove={(e) => move(e.clientX, e.clientY)} onPointerDown={(e) => move(e.clientX, e.clientY)} onPointerLeave={() => setP((s) => ({ ...s, on: false }))}>
      <Chat xray={false} />
      <motion.div aria-hidden className="absolute inset-0 bg-ink/95" style={{ clipPath: clip, WebkitClipPath: clip }} transition={{ duration: 0.2 }}>
        <Chat xray />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute rounded-full border-2 border-gold transition-opacity" style={{ width: R * 2, height: R * 2, left: p.x - R, top: p.y - R, opacity: p.on ? 1 : 0 }} />
      <p className="eyebrow absolute right-4 bottom-3 text-muted-foreground">{p.on ? "Reading…" : "Move or touch to inspect"}</p>
    </div>
  );
}
