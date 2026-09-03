import Link from "next/link";
import { LabCard } from "@/components/lab-card";
import { PageShell } from "@/components/page-shell";
import { labsByLane } from "@/lib/catalog";

export const metadata = {
  title: "Studio Ops",
};

export default function StudioOpsPage() {
  const labs = labsByLane("studio-ops");

  return (
    <PageShell
      kicker="Studio Ops"
      title="Paperwork that must not auto-send."
      deck="Call sheets, vendor POs, crafty / unit runner lists, later continuity / meals / sides / permits. Empower the AD and coordinator — drafts stay held. Not gen-video. Not full Movie Magic."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <LabCard key={lab.slug} lab={lab} />
        ))}
      </div>
      <p id="later" className="mt-10 text-sm text-faint">
        Stub cards are placeholders for a later pass. Live P0s:{" "}
        <Link className="text-emerald hover:text-cream" href="/labs/studio-ops/call-sheet-gate">
          Call Sheet Gate
        </Link>
        ,{" "}
        <Link className="text-emerald hover:text-cream" href="/labs/studio-ops/vendor-po-gate">
          Vendor PO Gate
        </Link>
        , and{" "}
        <Link className="text-emerald hover:text-cream" href="/labs/studio-ops/crafty-runner">
          Crafty & Unit Logistics Runner
        </Link>
        .
      </p>
    </PageShell>
  );
}
