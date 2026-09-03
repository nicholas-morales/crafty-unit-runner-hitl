import Link from "next/link";

const NAV = [
  { href: "/labs", label: "Labs" },
  { href: "/labs/studio-ops", label: "Studio Ops" },
  { href: "/labs/compliance", label: "Compliance" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-lg tracking-tight text-cream">Verde Labs</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-emerald sm:inline">
            HITL
          </span>
        </Link>
        <nav className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-cream">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
