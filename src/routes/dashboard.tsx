import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Pause, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge, threadLabel } from "@/components/site/StatusBadge";
import { sessionById, threadsForSession, offersForSession, auditForSession, supplierById, type Offer } from "@/lib/demo-data";
import { pkr, total, dateTime, relativeTime } from "@/lib/format";
import { rankOffers } from "@/lib/ranking";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Owner cockpit — SupplierLoop" },
      { name: "description", content: "Watch five supplier negotiations side by side, compare eligible offers and approve one." },
      { property: "og:title", content: "Owner cockpit — SupplierLoop" },
      { property: "og:description", content: "Live negotiation threads, offer comparison and owner approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cockpit,
});

function Cockpit() {
  const session = sessionById.get("SL-1042")!;
  const threads = threadsForSession(session.id);
  const offers = rankOffers(offersForSession(session.id));
  const [activeId, setActiveId] = useState(threads[0]!.id);
  const [approved, setApproved] = useState<Offer | null>(null);
  const [confirming, setConfirming] = useState<Offer | null>(null);
  const [ack, setAck] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = threads.find((t) => t.id === activeId)!;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-xs">
          <AlertTriangle className="size-3.5" /> Demo session — sample data, no real messages are sent from this page.
        </div>
        <div className="flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted-foreground">{session.id} · started by owner</p>
            <h1 className="display-tight mt-2 text-4xl md:text-6xl">{session.title}</h1>
            <p className="mt-3 text-muted-foreground">
              {session.desiredQty} {session.unit} · target <span className="numeral text-foreground">{pkr(session.targetUnitPrice)}</span> / ceiling <span className="numeral text-foreground">{pkr(session.maxUnitPrice)}</span> per {session.unit} · session ends {relativeTime(session.sessionDeadline, Date.parse("2026-10-25T14:20:00+05:00"))}
            </p>
          </div>
          <button onClick={() => { setPaused(!paused); toast(paused ? "Outreach resumed" : "All outreach paused — nothing will be sent"); }}
            className="inline-flex items-center gap-2 self-start rounded-full border bg-card px-5 py-3 text-sm hover:bg-secondary">
            <Pause className="size-4" /> {paused ? "Resume outreach" : "Pause all outreach"}
          </button>
        </div>

        {/* Thread cards */}
        <section aria-label="Supplier threads" className="mt-8 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5">
          {threads.map((t, i) => {
            const s = supplierById.get(t.supplierId)!;
            const on = t.id === activeId;
            return (
              <motion.button key={t.id} onClick={() => setActiveId(t.id)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`relative min-w-[220px] rounded-2xl border p-4 text-left transition-colors ${on ? "border-primary bg-card shadow-lg" : "bg-card/60 hover:bg-card"}`}>
                {on && <motion.span layoutId="activeRing" className="absolute inset-0 rounded-2xl ring-2 ring-primary" />}
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge label={t.channel === "WHATSAPP_TEST" ? "WHATSAPP TEST" : "SIMULATED"} />
                </div>
                <p className="mt-3 font-medium leading-tight">{s.name}</p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge label={paused && !["DECLINED","OWNER_REVIEW"].includes(t.state) ? "BLOCKED" : threadLabel(t.state)} />
                  <span className="numeral text-xs text-muted-foreground">{t.countersSent}/{t.maxRounds}</span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-secondary">
                  <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(t.countersSent / t.maxRounds) * 100}%` }} />
                </div>
              </motion.button>
            );
          })}
        </section>

        {/* Transcript */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border bg-card p-5 md:p-7">
            <h2 className="display-tight text-3xl">Conversation</h2>
            <p className="text-sm text-muted-foreground">Supplier's exact words on the left; what we understood underneath.</p>
            <AnimatePresence mode="wait">
              <motion.ol key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 space-y-4" aria-live="polite">
                {active.messages.map((m, i) => (
                  <motion.li key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={m.direction === "OUT" ? "ml-auto max-w-[88%]" : "max-w-[88%]"}>
                    <div className={m.direction === "OUT" ? "rounded-2xl rounded-br-sm bg-ink p-4 text-sm text-ink-foreground" : "rounded-2xl rounded-bl-sm bg-secondary p-4 text-sm"}>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                    <p className="mt-1 px-1 text-[11px] text-muted-foreground">{dateTime(m.at)}{m.delivery ? ` · ${m.delivery.toLowerCase()}` : ""}</p>
                    {m.policyReason && <p className="mt-1 rounded-lg border-l-2 border-gold bg-gold/10 px-3 py-2 text-xs"><b>Why:</b> {m.policyReason}</p>}
                    {m.extraction && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {m.extraction.unitPrice && <span className="rounded-md border bg-background px-2 py-1 numeral">{m.extraction.currency} {m.extraction.unitPrice}/kg</span>}
                        {m.extraction.deliveryDays != null && <span className="rounded-md border bg-background px-2 py-1">{m.extraction.deliveryDays} days</span>}
                        {m.extraction.paymentTerms && <span className="rounded-md border bg-background px-2 py-1">{m.extraction.paymentTerms}</span>}
                        <span className={`rounded-md px-2 py-1 ${m.extraction.confidence < 0.7 ? "bg-warning/25" : "bg-success/15 text-success"}`}>
                          {m.extraction.confidence < 0.7 ? "Unclear — asking again" : `Confidence ${Math.round(m.extraction.confidence * 100)}%`}
                        </span>
                      </div>
                    )}
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
          <div className="rounded-3xl border bg-card p-5 md:p-7">
            <h2 className="display-tight text-3xl">Activity log</h2>
            <ol className="relative mt-6 space-y-5 border-l pl-5">
              {auditForSession(session.id).map((a) => (
                <li key={a.id} className="relative">
                  <span className={`absolute -left-[25px] top-1 size-2.5 rounded-full ${a.kind === "POLICY_BLOCK" ? "bg-destructive" : a.actor === "OWNER" ? "bg-gold" : "bg-primary"}`} />
                  <p className="eyebrow text-muted-foreground">{a.actor} · {a.kind.replace("_", " ")}</p>
                  <p className="mt-1 text-sm">{a.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-8 rounded-3xl border bg-card p-5 md:p-7">
          <h2 className="display-tight text-3xl">Compare offers</h2>
          <p className="text-sm text-muted-foreground">Ranked: eligible first, then lowest price per kg, then fastest delivery.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b"><th className="sticky left-0 bg-card py-3 pr-4">Supplier</th><th>Price / kg</th><th>Total (800 kg)</th><th>Delivery</th><th>Payment</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {offers.map((o, i) => {
                  const s = supplierById.get(o.supplierId)!;
                  const ok = o.eligibility === "ELIGIBLE";
                  return (
                    <motion.tr key={o.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border-b last:border-0">
                      <td className="sticky left-0 bg-card py-4 pr-4 font-medium">{ok && i === 0 && <span className="mr-2 text-gold">★</span>}{s.name}</td>
                      <td className="numeral">{o.currency} {o.unitPrice}</td>
                      <td className="numeral">{o.currency === "PKR" && o.unitPrice ? total(o.unitPrice, o.quantity ?? 0) : "Not comparable"}</td>
                      <td>{o.deliveryDays} days</td>
                      <td>{o.paymentTerms}</td>
                      <td className="max-w-[220px] text-xs">{ok ? <StatusBadge label="OWNER REVIEW" /> : <span className="text-muted-foreground">{o.eligibilityNote}</span>}</td>
                      <td className="text-right">
                        {ok && <button disabled={!!approved} onClick={() => { setConfirming(o); setAck(false); }} className="rounded-full bg-ink px-4 py-2 text-xs text-ink-foreground disabled:opacity-40">Review & approve</button>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {approved && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 flex items-center gap-3 rounded-2xl border border-success/40 bg-success/10 p-4">
              <ShieldCheck className="size-5 text-success" />
              <p className="text-sm"><b>Approved for follow-up — no order placed.</b> {supplierById.get(approved.supplierId)!.name}, {pkr(approved.unitPrice!)}/kg (offer v{approved.offerVersion}). Other threads stopped.</p>
            </motion.div>
          )}
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">New here? <Link to="/how-it-works" className="underline">See how a session works</Link>.</p>
      </main>

      <AnimatePresence>
        {confirming && (
          <motion.div className="fixed inset-0 z-50 grid place-items-end bg-ink/40 backdrop-blur-sm sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirming(null)}>
            <motion.div role="dialog" aria-modal aria-labelledby="appr" onClick={(e) => e.stopPropagation()}
              initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} className="w-full max-w-lg rounded-t-3xl bg-card p-7 sm:rounded-3xl">
              <h3 id="appr" className="display-tight text-3xl">Approve this exact offer?</h3>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <dt className="text-muted-foreground">Supplier</dt><dd>{supplierById.get(confirming.supplierId)!.name}</dd>
                <dt className="text-muted-foreground">Price</dt><dd className="numeral">{pkr(confirming.unitPrice!)} / kg</dd>
                <dt className="text-muted-foreground">Total</dt><dd className="numeral">{total(confirming.unitPrice!, confirming.quantity!)}</dd>
                <dt className="text-muted-foreground">Delivery</dt><dd>{confirming.deliveryDays} days</dd>
                <dt className="text-muted-foreground">Their words</dt><dd className="italic">“{confirming.sourceSnippet}”</dd>
              </dl>
              <label className="mt-6 flex gap-3 rounded-xl bg-secondary p-3 text-sm">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 accent-[var(--color-primary)]" />
                I understand this records my choice only. No order or payment is made.
              </label>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setConfirming(null)} className="rounded-full border px-5 py-2.5 text-sm">Cancel</button>
                <button disabled={!ack} onClick={() => { setApproved(confirming); setConfirming(null); toast.success("Approved for follow-up — no order placed"); }} className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-40">Confirm approval</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
