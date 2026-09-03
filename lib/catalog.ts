export type LabStatus = "p0" | "stub";

export type LabCard = {
  slug: string;
  href: string;
  lab: "studio-ops" | "compliance";
  title: string;
  blurb: string;
  status: LabStatus;
  empowerment: string;
};

export const PROOF_LINKS = [
  {
    label: "Feedback Ops Copilot",
    href: "https://feedback-ops-copilot.vercel.app",
    note: "FO cash lane — separate. Inbox → classify → HITL reply. sent stays false.",
  },
  {
    label: "Lead Ops Gate",
    href: "https://lead-ops-gate-mock.vercel.app",
    note: "Lead → score → CRM + held draft → Approve/Reject. sent stays false.",
  },
] as const;

export const LABS: LabCard[] = [
  {
    slug: "call-sheet-gate",
    href: "/labs/studio-ops/call-sheet-gate",
    lab: "studio-ops",
    title: "Call Sheet Gate",
    blurb: "Harbor Night Day 12 → Day 13. Planted diffs CS-D1…D8. Approve before any fake SMS/email preview can be “sent.”",
    status: "p0",
    empowerment: "ADs keep the radio. AI drafts the move; crew is not blasted until a human stamps it.",
  },
  {
    slug: "vendor-po-gate",
    href: "/labs/studio-ops/vendor-po-gate",
    lab: "studio-ops",
    title: "Vendor PO Gate",
    blurb: "PO-DEMO-1001–1004 + DG-4092-REV2. Policy bands $2k/$5k. Approve unlocks export. sent stays false. Never emails the vendor.",
    status: "p0",
    empowerment: "Production coordinators own spend. The draft is a helper, not a purchase.",
  },
  {
    slug: "crafty-runner",
    href: "/labs/studio-ops/crafty-runner",
    lab: "studio-ops",
    title: "Crafty & Unit Logistics Runner",
    blurb: "Harbor Night Day 13 form + fixtures → shopping / unit list (CR-01…CR-08). Approve locks. Dispatch stays held. No live SMS or email.",
    status: "p0",
    empowerment: "Coordinators own the run. AI drafts the pull; the runner is not dispatched until a human locks it.",
  },
  {
    slug: "metrc-recon",
    href: "/labs/compliance/metrc-recon",
    lab: "compliance",
    title: "Metrc 30-Day Recon Copilot",
    blurb: "DEMO1A4… export + physical count → variance, hold drift, orphans, MR-05 notify draft (SEND DISABLED) → attestation. Never writes Metrc.",
    status: "p0",
    empowerment: "Compliance leads stay the signer. The copilot lines up the recon; it does not file, adjust, or certify.",
  },
  {
    slug: "continuity",
    href: "/labs/studio-ops#later",
    lab: "studio-ops",
    title: "Continuity",
    blurb: "Wardrobe / prop continuity flags across setups. Stub card only.",
    status: "stub",
    empowerment: "Script supervisors decide what is actually off.",
  },
  {
    slug: "meal-flag",
    href: "/labs/studio-ops#later",
    lab: "studio-ops",
    title: "Meal Flag",
    blurb: "Grace and meal-penalty watch for the AD desk. Stub card only.",
    status: "stub",
    empowerment: "ADs call the break. Software only raises a hand.",
  },
  {
    slug: "script-cascade",
    href: "/labs/studio-ops#later",
    lab: "studio-ops",
    title: "Script Cascade",
    blurb: "Locked-page ripple into sides and call times. Stub card only.",
    status: "stub",
    empowerment: "Writers and ADs approve the cascade before sides move.",
  },
  {
    slug: "permit-desk",
    href: "/labs/studio-ops#later",
    lab: "studio-ops",
    title: "Permit Desk",
    blurb: "Location permit packet + expiry watch. Stub card only.",
    status: "stub",
    empowerment: "Locations owns the filing. The desk only stages the packet.",
  },
  {
    slug: "consent-ledger",
    href: "/labs/compliance#later",
    lab: "compliance",
    title: "Consent Ledger",
    blurb: "Likeness / usage consent tracker for talent. Stub card only.",
    status: "stub",
    empowerment: "Legal / producer signs. The ledger does not invent consent.",
  },
];

export function labsByLane(lab: LabCard["lab"]): LabCard[] {
  return LABS.filter((item) => item.lab === lab);
}

export const MISSION = {
  kicker: "Verde Labs · Applied AI Ops · HITL",
  title: "Empower the worker. Approve before send.",
  deck: "Portfolio / build lane for Studio Ops and Compliance copilots. AI drafts the paperwork. Humans keep the radio, the PO, and the recon attestation. Not Sora. Not gen-video. Not full Movie Magic. FO cash stays on Feedback Ops.",
};
