import { CRAFTY_DAY_BRIEF, CRAFTY_DIETARY } from "@/lib/packs-data";
import type {
  CraftyDraft,
  CraftyFormInput,
  CraftyLine,
  CraftyRunnerPreview,
  CraftyStop,
  DiffSeverity,
} from "@/lib/types";

export const CRAFTY_PLANTS = [
  "CR-01",
  "CR-02",
  "CR-03",
  "CR-04",
  "CR-05",
  "CR-06",
  "CR-07",
  "CR-08",
] as const;

export const CRAFTY_FLAGS: Record<(typeof CRAFTY_PLANTS)[number], string> = {
  "CR-01": "Location Dock San Pedro → Warehouse Glendale",
  "CR-02": "Peanut block remains",
  "CR-03": "Strawberry allergy · Quinn Alvarez / Ada Cho",
  "CR-04": "No dock ice cart — bagged ice + extra water",
  "CR-05": "Crafty 05:45 before 06:30 general",
  "CR-06": "Van B restock at Warehouse Glendale",
  "CR-07": "Headcount 42 (was 48)",
  "CR-08": "Runner packet held — no live SMS/email",
};

const HIGH: DiffSeverity = "HIGH";
const MED: DiffSeverity = "MED";

type Brief = {
  production: string;
  day_label: string;
  date: string;
  location: string;
  prior_location: string;
  general_call: string;
  crafty_call: string;
  wrap: string;
  headcount: number;
  prior_headcount: number;
  unit_van_b: string;
  runner: string;
  coordinator: string;
  notes: string;
};

type DietaryPack = {
  peanut_block: boolean;
  notes: Array<{ id: string; allergen: string; cast: string; action: string }>;
};

export function defaultCraftyForm(): CraftyFormInput {
  const brief = CRAFTY_DAY_BRIEF as Brief;
  return {
    headcount: brief.headcount,
    extraItem: "",
    extraQty: 0,
    runnerNote: "",
  };
}

export function parseDepartmentPulls(csv: string): CraftyLine[] {
  return csv
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [dept, sku, item, qty, unit, note, plant] = splitCsv(line);
      return {
        plant,
        dept: dept === "Unit" ? "Unit" : "Crafty",
        sku,
        item,
        qty: Number(qty),
        unit,
        note,
        severity: plant === "CR-01" || plant === "CR-02" || plant === "CR-03" ? HIGH : MED,
      };
    });
}

export function parseUnitStops(markdown: string): CraftyStop[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- CR-"))
    .map((line) => {
      const match = line.match(/^- (CR-\d+)\s+(HIGH|MED)\s+[—-]\s+(.+)$/);
      if (!match) {
        return {
          plant: "CR-08",
          title: "Held packet",
          detail: line.replace(/^- /, ""),
          severity: MED,
        };
      }
      return {
        plant: match[1],
        title: match[1],
        detail: match[3],
        severity: match[2] === "HIGH" ? HIGH : MED,
      };
    });
}

export function draftCraftyList(
  pullsCsv: string,
  unitMarkdown: string,
  form: CraftyFormInput = defaultCraftyForm(),
): CraftyDraft {
  const brief = CRAFTY_DAY_BRIEF as Brief;
  const dietary = CRAFTY_DIETARY as DietaryPack;
  const headcount = Number.isFinite(form.headcount) && form.headcount > 0 ? form.headcount : brief.headcount;

  const lines = parseDepartmentPulls(pullsCsv).map((line) =>
    line.sku === "PAX-42"
      ? {
          ...line,
          qty: headcount,
          item: `Passenger water / extras for ${headcount}`,
          note: `Headcount ${headcount} (was ${brief.prior_headcount} on Day 12)`,
        }
      : line,
  );

  if (form.extraItem.trim() && form.extraQty > 0) {
    lines.push({
      plant: "CR-FORM",
      dept: "Crafty",
      sku: "FORM-XTRA",
      item: form.extraItem.trim(),
      qty: form.extraQty,
      unit: "ea",
      note: "Form override. Still a draft until Approve locks the list.",
      severity: MED,
    });
  }

  const notes = [
    brief.notes,
    dietary.peanut_block ? "Peanut block remains." : "",
    ...dietary.notes.map((row) => row.action),
    form.runnerNote.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    production: brief.production,
    dayLabel: brief.day_label,
    date: brief.date,
    location: brief.location,
    priorLocation: brief.prior_location,
    generalCall: brief.general_call,
    craftyCall: brief.crafty_call,
    wrap: brief.wrap,
    headcount,
    priorHeadcount: brief.prior_headcount,
    unitVanB: brief.unit_van_b,
    runner: brief.runner,
    coordinator: brief.coordinator,
    notes,
    lines,
    stops: parseUnitStops(unitMarkdown),
    flags: [...CRAFTY_PLANTS],
    locked: false,
    sent: false,
    dispatched: false,
  };
}

export function plantedCraftyIds(): string[] {
  return [...CRAFTY_PLANTS];
}

export function previewRunnerPacket(draft: CraftyDraft): CraftyRunnerPreview {
  const shop = draft.lines
    .filter((line) => line.dept === "Crafty")
    .map((line) => `• ${line.qty} ${line.unit} ${line.item}`)
    .join("\n");
  const unit = draft.stops.map((stop) => `• ${stop.plant} ${stop.detail}`).join("\n");

  const sms = [
    `HARBOR NIGHT ${draft.dayLabel} CRAFTY / UNIT`,
    `Loc: ${draft.location}`,
    `Crafty ${draft.craftyCall} · General ${draft.generalCall}`,
    `HC ${draft.headcount} · Van B ${draft.unitVanB}`,
    "Peanut block ON. No strawberry garnish.",
    "[HELD — approve locks the list. No live SMS.]",
  ].join("\n");

  const emailBody = [
    "Runner,",
    "",
    `${draft.production} ${draft.dayLabel} shopping / unit logistics is locked as a draft packet only.`,
    `Location: ${draft.location} (was ${draft.priorLocation})`,
    `Crafty call: ${draft.craftyCall} · General: ${draft.generalCall} · Wrap: ${draft.wrap}`,
    `Headcount: ${draft.headcount} (prior ${draft.priorHeadcount})`,
    "",
    "Crafty pull:",
    shop,
    "",
    "Unit stops:",
    unit,
    "",
    draft.notes,
    "",
    "This preview is held. No live SMS or email. sent stays false.",
    "",
    `— ${draft.coordinator}`,
  ].join("\n");

  return {
    sms,
    email: emailBody,
    smsFrom: "Harbor Night Unit · held",
    emailFrom: draft.coordinator,
    emailTo: draft.runner,
    emailSubject: `${draft.production} ${draft.dayLabel} — crafty / unit runner packet (HELD)`,
    emailBody,
    held: true,
    sent: false,
  };
}

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  out.push(current.trim());
  return out;
}
