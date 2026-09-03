import { LabCard } from "@/components/lab-card";
import { PageShell } from "@/components/page-shell";
import { LABS } from "@/lib/catalog";

export const metadata = {
  title: "Labs",
};

export default function LabsPage() {
  const studio = LABS.filter((lab) => lab.lab === "studio-ops");
  const compliance = LABS.filter((lab) => lab.lab === "compliance");

  return (
    <PageShell
      kicker="Index"
      title="All labs"
      deck="P0 demos work end-to-end on synthetic data — Call Sheet, Vendor PO, Crafty Runner, Metrc Recon. Later cards (Continuity, Meal Flag, Script Cascade, Permit Desk, Consent Ledger) are stubs only."
    >
      <section>
        <h2 className="font-serif text-2xl text-cream">Studio Ops</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {studio.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-2xl text-cream">Compliance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {compliance.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
