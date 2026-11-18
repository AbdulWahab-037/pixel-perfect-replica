import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  SIMULATED: "bg-secondary text-secondary-foreground border-border",
  "WHATSAPP TEST": "bg-primary/10 text-primary border-primary/30",
  BLOCKED: "bg-destructive/10 text-destructive border-destructive/30",
  WAITING: "bg-gold/20 text-gold-foreground border-gold/40",
  "OWNER REVIEW": "bg-primary text-primary-foreground border-primary",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  "SEND UNCERTAIN": "bg-warning/20 text-foreground border-warning/50",
  APPROVED: "bg-success/15 text-success border-success/40",
  PROCESSING: "bg-accent text-accent-foreground border-border",
  DECLINED: "bg-muted text-muted-foreground border-border line-through",
};

export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 eyebrow !text-[10px]",
        styles[label] ?? styles["SIMULATED"],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current animate-pulse-dot" aria-hidden />
      {label}
    </span>
  );
}

export function threadLabel(state: string) {
  switch (state) {
    case "OWNER_REVIEW": return "OWNER REVIEW";
    case "AWAITING_SUPPLIER": return "WAITING";
    case "DECLINED": return "DECLINED";
    case "TIMED_OUT": return "EXPIRED";
    default: return state.replace("_", " ");
  }
}
