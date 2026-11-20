import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site/SiteHeader";
import { CeilingSteering } from "@/components/concepts/CeilingSteering";
import { XRayLens } from "@/components/concepts/XRayLens";
import { ParallelRealities } from "@/components/concepts/ParallelRealities";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Interactive concepts — SupplierLoop" },
      { name: "description", content: "Try three live previews: steer your price ceiling, x-ray a supplier chat, and see manual chaos become one ledger." },
      { property: "og:title", content: "Interactive concepts — SupplierLoop" },
      { property: "og:description", content: "Three hands-on previews of how SupplierLoop negotiates for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Concepts,
});

function Section({ n, title, body, children }: { n: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <p className="eyebrow text-gold">Concept {n}</p>
      <h2 className="display-tight mt-2 text-4xl md:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">{body}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Concepts() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="eyebrow text-muted-foreground">Previews · demo data</p>
          <h1 className="display-tight mt-3 text-5xl md:text-7xl">Feel it before you read it.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Three hands-on ideas that explain SupplierLoop in seconds. Pick the ones you like for the homepage.</p>
        </div>
        <Section n="01" title="You hold the leash" body="Drag your price ceiling. Suppliers above it drop out instantly — the assistant can never pay more than you allow.">
          <CeilingSteering />
        </Section>
        <Section n="02" title="X-ray a messy chat" body="Move your mouse (or finger) over real-style supplier messages to see exactly what SupplierLoop understood.">
          <XRayLens />
        </Section>
        <Section n="03" title="Two ways to buy" body="Scroll: on the left, five chats pile up. On the right, the same replies land as one calm list.">
          <ParallelRealities />
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
