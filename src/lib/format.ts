/** Formatting helpers. Money is Decimal-safe here (demo data uses strings). */

export function pkr(amount: string | number, opts?: { decimals?: number }) {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "—";
  const decimals = opts?.decimals ?? 0;
  return `PKR ${n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function total(amount: string | number, qty: number) {
  const unit = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (!Number.isFinite(unit)) return "—";
  return pkr(unit * qty);
}

export function dateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} PKT`;
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function relativeTime(iso: string, now = Date.now()) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = now - then;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const label =
    mins < 60
      ? `${mins} min`
      : mins < 1440
        ? `${Math.round(mins / 60)} hr`
        : `${Math.round(mins / 1440)} day${Math.round(mins / 1440) > 1 ? "s" : ""}`;
  return diff >= 0 ? `${label} ago` : `in ${label}`;
}
