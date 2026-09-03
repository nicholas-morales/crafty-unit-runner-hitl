export function EmpowermentBanner({ children }: { children: React.ReactNode }) {
  return (
    <aside className="border-l-4 border-emerald bg-card px-4 py-3 text-sm leading-6 text-muted">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
        Worker stays in charge
      </p>
      <div className="mt-1 text-cream/90">{children}</div>
    </aside>
  );
}
