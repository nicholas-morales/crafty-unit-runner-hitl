import Link from "next/link";
import { LabCard } from "@/components/lab-card";
import { LABS, MISSION, PROOF_LINKS } from "@/lib/catalog";

const HITL_STEPS = [
  {
    n: "01",
    title: "Ingest the messy original",
    body: "Yesterday’s call sheet, a Metrc export, a vendor quote. Synthetic fixtures so nobody’s PII walks in.",
  },
  {
    n: "02",
    title: "Draft in the open",
    body: "Heuristic / template copilots — no paid model required. You can see every field the machine touched.",
  },
  {
    n: "03",
    title: "Human stamps the gate",
    body: "Approve or reject. Send, Metrc write, and vendor email stay off until a worker says so — and these mocks never flip the live switch.",
  },
];

export default function HomePage() {
  const live = LABS.filter((lab) => lab.status === "p0");

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">
              {MISSION.kicker}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-cream sm:text-6xl">
              {MISSION.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              {MISSION.deck}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/labs" className="btn btn-emerald">
                Open the labs
              </Link>
              <Link href="/labs/studio-ops/call-sheet-gate" className="btn">
                Start Call Sheet Gate
              </Link>
            </div>
          </div>
          <aside className="stamp">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              On-demand off
            </p>
            <p className="mt-2 font-serif text-2xl text-cream">sent: false</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              No live Twilio. No Metrc write. No vendor email. Draft PR only — do not merge
              onto Verde Comply production.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b border-line bg-raised/50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            HITL, not autopilot
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl tracking-tight text-cream sm:text-4xl">
            The worker keeps the radio, the PO, and the recon signature.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HITL_STEPS.map((step) => (
              <article key={step.n}>
                <p className="font-mono text-xs text-emerald">{step.n}</p>
                <h3 className="mt-2 font-serif text-2xl text-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                P0 tonight
              </p>
              <h2 className="mt-2 font-serif text-3xl text-cream">Working demos</h2>
            </div>
            <Link href="/labs" className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald">
              Full index →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {live.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-raised/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Proof strip
          </p>
          <h2 className="mt-2 font-serif text-3xl text-cream">Same family. Separate cash.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            FO is the cash lane. Lead Ops is the sister HITL airlock. Verde Labs is the
            portfolio build — do not mix deploys or invoices.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PROOF_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="border border-line bg-card p-5 hover:border-emerald"
              >
                <p className="font-serif text-2xl text-cream">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.note}</p>
                <p className="mt-4 font-mono text-[11px] text-emerald">{item.href}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <article className="border border-dashed border-line p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              CTA placeholder
            </p>
            <h2 className="mt-2 font-serif text-2xl text-cream">Book a 15-minute walkthrough</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Not wired. Nick replies by hand. No checkout, no calendar OAuth, no auto-DM.
            </p>
            <button className="btn mt-5" type="button" disabled>
              Hold — not connected
            </button>
          </article>
          <article className="border border-dashed border-line p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              CTA placeholder
            </p>
            <h2 className="mt-2 font-serif text-2xl text-cream">Request a scoped build</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Studio Ops or Compliance HITL, same approve-before-send contract. Placeholder
              only — portfolio lane, not an FO invoice.
            </p>
            <button className="btn mt-5" type="button" disabled>
              Hold — not connected
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}
