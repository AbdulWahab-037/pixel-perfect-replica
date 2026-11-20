import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const pings = ["Al-Madina: 355?", "Chenab: voice note 0:42", "FSK: kal batata hoon", "Crescent: $1.22", "Indus: 385 final", "Al-Madina: 345 last", "Chenab: 340 ok?"];
const ledger: [string, string, string][] = [["Al-Madina", "₨328", "Eligible"], ["Chenab", "₨333", "Eligible"], ["FSK Mills", "Waiting", "Reminder sent"], ["Crescent", "USD", "Not comparable"], ["Indus", "₨385", "Above ceiling"]];

/** Scroll-linked split: manual chaos on the left becomes one calm ledger on the right. */
export function ParallelRealities() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const hours = useTransform(scrollYProgress, [0.2, 0.7], [0, 4.7]);
  const hoursText = useTransform(hours, (h) => `${h.toFixed(1)} h of your time`);
  const calm = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border bg-muted p-6">
        <p className="eyebrow text-destructive">Without — you, texting 5 people</p>
        <motion.p className="numeral mt-2 text-3xl text-destructive">{hoursText}</motion.p>
        {pings.map((t, i) => (
          <Ping key={t} t={t} i={i} progress={scrollYProgress} />
        ))}
      </div>
      <div className="relative min-h-[26rem] rounded-[2rem] border bg-card p-6">
        <p className="eyebrow text-primary">With SupplierLoop — one ledger</p>
        <div className="mt-4 divide-y">
          {ledger.map(([n, p, s], i) => (
            <LedgerRow key={n} n={n} p={p} s={s} i={i} progress={scrollYProgress} />
          ))}
        </div>
        <motion.div style={{ opacity: calm }} className="mt-6 rounded-2xl bg-primary p-4 text-primary-foreground">
          <p className="eyebrow opacity-80">Your part</p>
          <p className="display-tight text-2xl">Review & approve — about 45 seconds.</p>
        </motion.div>
      </div>
    </div>
  );
}

type MV = ReturnType<typeof useScroll>["scrollYProgress"];
function Ping({ t, i, progress }: { t: string; i: number; progress: MV }) {
  const start = 0.15 + i * 0.06;
  const o = useTransform(progress, [start, start + 0.05], [0, 1]);
  const rot = (i % 2 ? 1 : -1) * (3 + i);
  return (
    <motion.div style={{ opacity: o, rotate: rot, top: `${28 + i * 9}%`, left: `${(i * 37) % 45}%` }} className="absolute rounded-xl border bg-background px-3 py-2 text-sm shadow-sm">
      <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{i + 3}</span>{t}
    </motion.div>
  );
}
function LedgerRow({ n, p, s, i, progress }: { n: string; p: string; s: string; i: number; progress: MV }) {
  const start = 0.2 + i * 0.07;
  const o = useTransform(progress, [start, start + 0.06], [0, 1]);
  const x = useTransform(progress, [start, start + 0.06], [24, 0]);
  return (
    <motion.div style={{ opacity: o, x }} className="flex items-center justify-between py-3 text-sm">
      <span>{n}</span><span className="numeral">{p}</span><span className="text-muted-foreground">{s}</span>
    </motion.div>
  );
}
