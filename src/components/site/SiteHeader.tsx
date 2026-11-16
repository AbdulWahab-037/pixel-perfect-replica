import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/dashboard", label: "Owner cockpit" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="SupplierLoop home">
      <span className="relative grid size-8 place-items-center rounded-full bg-ink text-ink-foreground">
        <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-700 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" strokeLinecap="round" />
          <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="display-tight text-2xl">SupplierLoop</span>
    </Link>
  );
}

export function SiteHeader() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], [0, 1]);
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ opacity: bg }} className="absolute inset-0 border-b bg-background/80 backdrop-blur-xl" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-secondary" activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/dashboard" className="hidden md:inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-transform hover:scale-[1.03]">
          Open cockpit <span aria-hidden>→</span>
        </Link>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="relative border-b bg-background px-5 pb-5 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block border-b py-4 display-tight text-3xl">
              {n.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground grain">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8">
        <p className="display-tight text-5xl md:text-8xl">Negotiate less.<br /><em className="text-gold">Decide better.</em></p>
        <div className="mt-14 flex flex-col gap-4 border-t border-ink-foreground/15 pt-6 text-sm opacity-70 md:flex-row md:justify-between">
          <span>SupplierLoop · FYP-03 · Lahore Garrison University</span>
          <span>Demo data. No orders or payments are ever placed by software.</span>
        </div>
      </div>
    </footer>
  );
}
