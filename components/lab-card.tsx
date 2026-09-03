import Link from "next/link";
import type { LabCard as LabCardType } from "@/lib/catalog";

export function LabCard({ lab, compact = false }: { lab: LabCardType; compact?: boolean }) {
  const isStub = lab.status === "stub";

  return (
    <article className="flex h-full flex-col border border-line bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
          {lab.lab === "studio-ops" ? "Studio Ops" : "Compliance"}
        </p>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
            isStub ? "text-faint" : "text-amber"
          }`}
        >
          {isStub ? "Later stub" : "P0 live"}
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl tracking-tight text-cream">{lab.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{lab.blurb}</p>
      <p className="mt-4 text-xs leading-5 text-faint">{lab.empowerment}</p>
      {isStub ? (
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          Card only — no route yet
        </p>
      ) : (
        <Link
          href={lab.href}
          className={`mt-5 inline-flex font-mono text-[11px] uppercase tracking-[0.12em] text-emerald hover:text-cream ${
            compact ? "" : ""
          }`}
        >
          Open demo →
        </Link>
      )}
    </article>
  );
}
