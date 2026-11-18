import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ShieldCheck, MessagesSquare, Scale, Hand, Radar, ScrollText } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteHeader";
import { HeroNegotiation } from "@/components/site/HeroNegotiation";
import { LoopOrbit, orbitLegend } from "@/components/site/LoopOrbit";
import { Reveal, SplitWords } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SupplierLoop — AI negotiation for small business buying" },
      { name: "description", content: "SupplierLoop bargains with 3–5 of your suppliers on WhatsApp at once, within your hard price limits, and leaves the final decision to you." },
      { property: "og:title", content: "SupplierLoop — AI negotiation for small business buying" },
      { property: "og:description", content: "Parallel, bounded supplier negotiations with owner-controlled approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const suppliersMarquee = ["Al-Madina Paper & Board", "Chenab Packaging", "Faisalabad Kraft Mills", "Crescent Packaging Co.", "Indus Traders", "Galaxy Paper Mart", "Riphah Stationers"];

const features = [
  { icon: MessagesSquare, title: "Parallel threads", body: "Three to five suppliers negotiated at once, each with its own memory and timer. One slow reply never blocks the rest." },
  { icon: ShieldCheck, title: "Hard limits outside the AI", body: "Price, quantity, dates and terms are checked by deterministic code before every message. The model never sees your ceiling." },
  { icon: Scale, title: "Honest comparison", body: "Offers ranked by eligibility first, then effective unit price, then delivery. Different currencies are flagged, never guessed." },
  { icon: Hand, title: "You decide. Always.", body: "No purchase, no payment, no binding promise. You approve an exact offer version — and the system records it." },
  { icon: Radar, title: "Proactive triggers", body: "Low stock or a favourable price signal can start a session — only when armed, and only with your authorisation." },
  { icon: ScrollText, title: "Every move audited", body: "Original supplier text, extracted fields, confidence, policy reason and timestamps — all in one readable timeline." },
];

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteHeader />

      <section ref={ref} className="relative grain min-h-[100svh] pt-28 md:pt-32">
        <div className="absolute inset-0 dotgrid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <motion.div style={{ y, opacity: fade }} className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 md:px-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success animate-pulse-dot" /> Buyer-side negotiation agent · Lahore
            </motion.p>
            <h1 className="display-tight text-[3.4rem] sm:text-7xl lg:text-[6.4rem]">
              <SplitWords text="Your suppliers," />
              <br />
              <SplitWords text="bargained" delay={0.25} className="italic text-primary" />{" "}
              <SplitWords text="for you." delay={0.4} />
            </h1>
            <Reveal delay={0.6}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                SupplierLoop messages 3–5 of your existing suppliers on WhatsApp, counters every quote within the limits you set, and hands you a clean comparison. Nothing is bought until you say so.
              </p>
            </Reveal>
            <Reveal delay={0.75}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/dashboard" className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-ink-foreground transition-all hover:gap-5">
                  Open the owner cockpit <span aria-hidden>→</span>
                </Link>
                <Link to="/how-it-works" className="inline-flex items-center rounded-full border bg-card px-7 py-4 transition-colors hover:bg-secondary">
                  See how it works
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="flex justify-center lg:justify-end">
            <LoopOrbit />
          </div>
        </motion.div>
      </section>

      <div className="border-y bg-card py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...suppliersMarquee, ...suppliersMarquee].map((s, i) => (
            <span key={i} className="display-tight text-2xl text-muted-foreground">{s} <span className="text-gold">✦</span></span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-28 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <Reveal><p className="eyebrow text-primary">The problem</p></Reveal>
          <Reveal delay={0.1}>
            <p className="display-tight text-4xl md:text-6xl">
              Owners chase five suppliers by hand, lose replies in chat, and accept the first price that <em className="text-muted-foreground">sounds</em> fair.
            </p>
          </Reveal>
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-3">
          {[["3–5", "suppliers negotiated in parallel"], ["5 / 24 / 72", "counters · reply hrs · session hrs"], ["0", "messages sent beyond your limits"]].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.1} className="bg-card p-8 md:p-10">
              <p className="numeral text-5xl md:text-6xl">{n}</p>
              <p className="mt-3 text-muted-foreground">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-28 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal><p className="eyebrow text-primary">Read the loop</p></Reveal>
          <Reveal delay={0.1}><h2 className="display-tight mt-4 text-5xl md:text-6xl">Every dot is a supplier. Closer to you means a better price.</h2></Reveal>
          <ul className="mt-10 space-y-4">
            {orbitLegend.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.06}>
                <li className="flex items-center justify-between border-b pb-4">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-muted-foreground">{s.tag}{s.end === "ok" ? ` · ₨${s.path[2]}/kg` : ""}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.2} className="flex justify-center"><HeroNegotiation /></Reveal>
      </section>

      <section className="bg-secondary/50 py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><h2 className="display-tight max-w-3xl text-5xl md:text-7xl">Built to be <em className="text-primary">trusted</em>, not just clever.</h2></Reveal>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="group h-full rounded-3xl border bg-card p-8">
                  <div className="mb-8 grid size-12 place-items-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="display-tight text-3xl">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.body}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-primary-foreground md:p-20 grain">
            <div className="absolute -right-20 -top-20 size-96 rounded-full bg-gold/30 blur-3xl animate-float-slow" />
            <p className="relative z-10 display-tight max-w-3xl text-4xl md:text-6xl">“Why was a quote under my maximum countered instead of accepted?”</p>
            <p className="relative z-10 mt-6 max-w-2xl text-lg opacity-80">Every counter shows its reason: under the ceiling isn't the same as a good deal. The cockpit explains each move in plain words.</p>
            <Link to="/dashboard" className="relative z-10 mt-10 inline-flex rounded-full bg-card px-7 py-4 text-foreground transition-transform hover:scale-105">Explore a live session →</Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
