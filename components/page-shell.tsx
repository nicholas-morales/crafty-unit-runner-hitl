export function PageShell({
  kicker,
  title,
  deck,
  children,
}: {
  kicker: string;
  title: string;
  deck: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald">{kicker}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl tracking-tight text-cream sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{deck}</p>
      <div className="mt-10">{children}</div>
    </div>
  );
}
