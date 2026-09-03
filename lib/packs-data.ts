import allergyNotes from "@/fixtures/call-sheet-gate/allergy-notes.json";
import craftyDayBrief from "@/fixtures/crafty-runner/day-brief.json";
import craftyDietary from "@/fixtures/crafty-runner/dietary-notes.json";
import rev2Quote from "@/fixtures/vendor-po-gate/dg-4092-rev2.json";
import draftsPack from "@/fixtures/vendor-po-gate/drafts.json";

export const ALLERGY_NOTES = allergyNotes;
export const CRAFTY_DAY_BRIEF = craftyDayBrief;
export const CRAFTY_DIETARY = craftyDietary;
export const DG_4092_REV2 = rev2Quote;
export const VENDOR_DRAFTS_PACK = draftsPack;

export const MATCH_TAG_SUFFIXES = ["0002", "0004", "0008", "0009"] as const;

export const SEED_AUTH_USERS = [
  {
    id: "u-alex",
    name: "Alex Rivera",
    role: "Compliance lead",
    status: "active" as const,
    note: "Authorized to enter track-and-trace. Demo only.",
  },
  {
    id: "u-sam",
    name: "Sam Okoye",
    role: "Inventory",
    status: "active" as const,
    note: "Counts physical packages. Demo only.",
  },
  {
    id: "u-jordan",
    name: "Jordan Lee",
    role: "Former warehouse",
    status: "review-removal" as const,
    note: "§ 15051(a)(2) review: no longer on the floor — human lead decides removal. This demo does not write Metrc.",
  },
];
