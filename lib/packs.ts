import { readFileSync } from "node:fs";
import path from "node:path";

const PACK_ROOT = path.join(process.cwd(), "fixtures");

const ALLOWED = [
  "call-sheet-gate/",
  "metrc-recon/",
  "vendor-po-gate/",
  "crafty-runner/",
] as const;

/** Read a Night Shift pack file. Subfolders only — root stubs are aliases. */
export function readPack(rel: string): string {
  if (rel.startsWith("call-sheet-gate/thin-seed/")) {
    throw new Error("Thin seed is an alias fallback, not the DEMO pack.");
  }
  if (!ALLOWED.some((prefix) => rel.startsWith(prefix))) {
    throw new Error(`Load fixtures from pack subfolders only: ${rel}`);
  }
  return readFileSync(path.join(PACK_ROOT, rel), "utf8");
}

export {
  ALLERGY_NOTES,
  CRAFTY_DAY_BRIEF,
  CRAFTY_DIETARY,
  DG_4092_REV2,
  MATCH_TAG_SUFFIXES,
  SEED_AUTH_USERS,
  VENDOR_DRAFTS_PACK,
} from "@/lib/packs-data";
