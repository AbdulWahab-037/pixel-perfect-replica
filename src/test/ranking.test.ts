import { describe, expect, it } from "vitest";
import { rankOffers } from "@/lib/ranking";
import { offers } from "@/lib/demo-data";

describe("offer ranking", () => {
  it("puts eligible offers first, cheapest first", () => {
    const r = rankOffers(offers);
    expect(r[0]?.supplierId).toBe("sup-al-madina");
    expect(r[1]?.supplierId).toBe("sup-chenab");
  });
  it("never ranks an ineligible offer above an eligible one", () => {
    const r = rankOffers(offers);
    const firstBad = r.findIndex((o) => o.eligibility !== "ELIGIBLE");
    expect(r.slice(firstBad).every((o) => o.eligibility !== "ELIGIBLE")).toBe(true);
  });
});
