import type { Offer } from "./demo-data";

/** Eligible first, then cheaper unit price, then earlier delivery, then supplier id. */
export function rankOffers(offers: Offer[]): Offer[] {
  return [...offers].sort((a, b) => {
    const ea = a.eligibility === "ELIGIBLE" ? 0 : 1;
    const eb = b.eligibility === "ELIGIBLE" ? 0 : 1;
    if (ea !== eb) return ea - eb;
    if (ea === 0) {
      const pa = Number(a.unitPrice), pb = Number(b.unitPrice);
      if (pa !== pb) return pa - pb;
      if ((a.deliveryDays ?? 99) !== (b.deliveryDays ?? 99)) return (a.deliveryDays ?? 99) - (b.deliveryDays ?? 99);
    }
    return a.supplierId.localeCompare(b.supplierId);
  });
}
