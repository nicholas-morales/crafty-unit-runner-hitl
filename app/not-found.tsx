import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald">404</p>
      <h1 className="mt-3 font-serif text-4xl text-cream">That lab is not on the bench.</h1>
      <p className="mt-4 text-muted">Back to the index — only the P0 routes are live tonight.</p>
      <Link href="/labs" className="btn btn-emerald mt-6">
        All labs
      </Link>
    </div>
  );
}
