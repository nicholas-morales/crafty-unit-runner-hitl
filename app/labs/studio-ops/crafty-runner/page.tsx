import { CraftyRunnerDemo } from "@/components/crafty-runner-demo";
import { PageShell } from "@/components/page-shell";
import { readPack } from "@/lib/packs";

export const metadata = {
  title: "Crafty & Unit Logistics Runner",
};

export default function CraftyRunnerPage() {
  const pullsCsv = readPack("crafty-runner/department-pulls.csv");
  const unitMarkdown = readPack("crafty-runner/unit-needs.md");

  return (
    <PageShell
      kicker="Studio Ops · P0"
      title="Crafty & Unit Logistics Runner"
      deck="Night Shift DEMO pack: Harbor Night Day 13 form + fixtures draft a shopping / unit logistics list (CR-01…CR-08). Approve locks the packet. Dispatch stays a no-op — no live SMS or email. An audit trail row appends after Approve."
    >
      <CraftyRunnerDemo pullsCsv={pullsCsv} unitMarkdown={unitMarkdown} />
    </PageShell>
  );
}
