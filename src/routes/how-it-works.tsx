import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — SupplierLoop" },
      { name: "description", content: "Seven steps from a purchase request to an approved supplier offer, with hard limits and owner control." },
      { property: "og:title", content: "How it works — SupplierLoop" },
      { property: "og:description", content: "From request to approved offer in seven bounded steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  ["Describe what you need", "One item, quantity, target price and a strict ceiling per unit, delivery date and allowed payment terms."],
  ["Pick 3–5 suppliers", "Only suppliers who agreed to be contacted. Simulated ones are always labelled."],
  ["Confirm before anything is sent", "You see every recipient and the first message. Nothing goes out until you agree."],
  ["Quotes arrive, in their own words", "English or Roman Urdu. We show the original text next to what we understood. Unclear replies get a polite question."],
  ["Counter-offers within your limits", "A fixed rule decides each counter. Your ceiling is never revealed and never crossed. Max five rounds."],
  ["Side-by-side comparison", "Eligible offers ranked fairly. USD quotes or offers over your ceiling are shown but can't be chosen."],
  ["You approve one exact offer", "A second confirmation, then: “Approved for follow-up — no order placed.”"],
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const h = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
        <Reveal><p className="eyebrow text-primary">How a session works</p></Reveal>
        <Reveal delay={0.1}><h1 className="display-tight mt-4 text-5xl md:text-7xl">From request to <em className="text-primary">your decision</em>, in seven steps.</h1></Reveal>
        <div ref={ref} className="relative mt-20 pl-12 md:pl-20">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-8" />
          <motion.div style={{ scaleY: h }} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-primary md:left-8" />
          {steps.map(([t, b], i) => (
            <Reveal key={t} className="relative mb-16">
              <span className="absolute -left-12 grid size-8 place-items-center rounded-full border bg-card numeral text-sm md:-left-16">{i + 1}</span>
              <h2 className="display-tight text-3xl md:text-4xl">{t}</h2>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">{b}</p>
            </Reveal>
          ))}
        </div>
        <Link to="/dashboard" className="inline-flex rounded-full bg-ink px-7 py-4 text-ink-foreground">See it in the cockpit →</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
