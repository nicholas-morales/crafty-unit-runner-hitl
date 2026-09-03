import { ALLERGY_NOTES } from "@/lib/packs-data";
import type { CallSheetFields, CastRow, DiffRow } from "@/lib/types";

export type LabeledDiff = DiffRow & { id: string; severity: "HIGH" | "MED" };

export function parseCallSheet(markdown: string): CallSheetFields {
  const title = matchLine(markdown, /^#\s+CALL SHEET\s+[—-]\s+(.+)$/im) ?? "Call sheet";
  const talent = [...markdown.matchAll(/^-\s+(#\d+\s+)?(.+?)\s+[—-]\s+(\d{1,2}:\d{2})\s*$/gm)].map(
    (row) => parseCast(`${row[1] ?? ""}${row[2]}`, row[3]),
  );

  return {
    title,
    production: matchField(markdown, "Production") ?? "Unknown production",
    date: matchField(markdown, "Date") ?? "",
    location: matchField(markdown, "Location") ?? "",
    generalCall: matchField(markdown, "General Call") ?? "",
    wrap: matchField(markdown, "Wrap") ?? "",
    scenes: matchField(markdown, "Scenes") ?? "",
    talent,
    vanA: matchVan(markdown, "Van A"),
    vanB: matchVan(markdown, "Van B"),
    notes: notesBlock(markdown),
    allergies: "",
  };
}

export function parseScheduleCsv(csv: string): CallSheetFields {
  const map = new Map<string, string>();
  for (const line of csv.split(/\r?\n/).slice(1)) {
    const comma = line.indexOf(",");
    if (comma < 0) continue;
    map.set(line.slice(0, comma).trim(), line.slice(comma + 1).trim());
  }

  const keep = parseCastList(map.get("cast_keep") ?? "");
  const added = parseCastList(map.get("cast_add") ?? "");
  const allergies = [
    ALLERGY_NOTES.peanut_block ? "Peanut block remains." : "",
    ...ALLERGY_NOTES.additions.map((row) => `${row.allergen} allergy for ${row.cast}`),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: map.get("day_label") ?? "Day 13",
    production: map.get("production") ?? "Harbor Night",
    date: map.get("date") ?? "",
    location: map.get("location") ?? "",
    generalCall: map.get("general_call") ?? "",
    wrap: map.get("wrap") ?? "",
    scenes: map.get("scenes") ?? "",
    talent: [...keep, ...added],
    vanA: map.get("van_a") ?? "",
    vanB: map.get("van_b") ?? "",
    notes: map.get("notes") ?? "",
    allergies,
  };
}

export function draftUpdatedSheet(
  yesterdayMarkdown: string,
  todayCsv: string,
): {
  yesterday: CallSheetFields;
  draft: CallSheetFields;
  markdown: string;
  diffs: LabeledDiff[];
  dropped: string;
  added: string;
} {
  const yesterday = parseCallSheet(yesterdayMarkdown);
  const draft = parseScheduleCsv(todayCsv);
  const dropped = droppedCast(yesterdayMarkdown, todayCsv);
  const added = addedCast(todayCsv);

  return {
    yesterday,
    draft,
    markdown: renderCallSheet(draft),
    diffs: labeledDiffs(yesterday, draft, dropped, added),
    dropped,
    added,
  };
}

export function renderCallSheet(fields: CallSheetFields): string {
  const talent =
    fields.talent.length > 0
      ? fields.talent
          .map((row) => `- ${row.number ? `${row.number} ` : ""}${row.name}${row.role ? ` / ${row.role}` : ""} — ${row.call}`)
          .join("\n")
      : "- —";

  return `# CALL SHEET — ${stripTitle(fields.title)}

Production: ${fields.production}
Date: ${fields.date}
Location: ${fields.location}
General Call: ${fields.generalCall}
Wrap: ${fields.wrap}
Scenes: ${fields.scenes}

## Cast
${talent}

## Transport
- Van A — ${fields.vanA}
- Van B — ${fields.vanB}

## Notes
${fields.notes.trim()}
`;
}

export function labeledDiffs(
  before: CallSheetFields,
  after: CallSheetFields,
  dropped: string,
  added: string,
): LabeledDiff[] {
  return [
    labeled("CS-D1", "HIGH", "General call (time shift earlier)", before.generalCall, after.generalCall),
    labeled("CS-D2", "HIGH", "Cast added", "—", added || "—"),
    labeled("CS-D3", "HIGH", "Cast dropped", dropped || "—", "—"),
    labeled("CS-D4", "HIGH", "Location", before.location, after.location),
    labeled("CS-D5", "MED", "Scenes", before.scenes, after.scenes),
    labeled("CS-D6", "MED", "Wrap", before.wrap, after.wrap),
    labeled("CS-D7", "MED", "Allergies", "Peanut block. No new talent allergies posted.", after.allergies),
    labeled("CS-D8", "MED", "Van B", before.vanB, after.vanB),
  ];
}

export type HeldPreview = {
  sms: string;
  email: string;
  smsFrom: string;
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  held: true;
  sent: false;
};

export function previewMessages(draft: CallSheetFields): HeldPreview {
  const talent = draft.talent
    .map((row) => `${row.number ?? ""} ${row.name} ${row.call}`.trim())
    .join(", ");
  const smsBody = [
    `${draft.production.toUpperCase()} — ${draft.title}`,
    `General ${draft.generalCall} · ${draft.location} · wrap ${draft.wrap}`,
    `Scenes ${draft.scenes}`,
    talent,
    draft.allergies,
  ].join("\n");
  const sms = `${smsBody}\n[HELD — not sent. No Twilio.]`;

  const emailTo = "crew@harbor-night.example";
  const emailFrom = "ad.desk@harbor-night.example";
  const emailSubject = `Call sheet — ${draft.title} (${draft.date})`;
  const emailBody = [
    `Crew,`,
    ``,
    `Draft sheet for ${draft.production}.`,
    `Location: ${draft.location}`,
    `General call: ${draft.generalCall} · wrap ${draft.wrap}`,
    `Scenes: ${draft.scenes}`,
    `Cast: ${talent}`,
    `Allergies: ${draft.allergies}`,
    `Van B: ${draft.vanB}`,
    ``,
    `This preview stays in the box until a human approves. Verde Labs never auto-texts or emails the crew.`,
  ].join("\n");
  const email = [`From: ${emailFrom}`, `To: ${emailTo}`, `Subject: ${emailSubject}`, ``, emailBody].join(
    "\n",
  );

  return {
    sms,
    email,
    smsFrom: "Harbor Night AD desk",
    emailFrom,
    emailTo,
    emailSubject,
    emailBody,
    held: true,
    sent: false,
  };
}

export function plantedDiffIds(): string[] {
  return ["CS-D1", "CS-D2", "CS-D3", "CS-D4", "CS-D5", "CS-D6", "CS-D7", "CS-D8"];
}

function labeled(
  id: string,
  severity: "HIGH" | "MED",
  field: string,
  before: string,
  after: string,
): LabeledDiff {
  return {
    id,
    field,
    before,
    after,
    changed: before.trim() !== after.trim(),
    severity,
  };
}

function parseCastList(raw: string): CastRow[] {
  if (!raw) return [];
  return raw.split(";").map((part) => {
    const [name, call] = part.split("|").map((cell) => cell.trim());
    return parseCast(name, call || "");
  });
}

function parseCast(label: string, call: string): CastRow {
  const match = label.trim().match(/^(#\d+)\s+(.+?)(?:\s+\/\s+(.+))?$/);
  if (match) {
    return { number: match[1], name: match[2].trim(), role: match[3]?.trim(), call };
  }
  return { name: label.trim(), call };
}

function droppedCast(yesterday: string, csv: string): string {
  const drop = csv.match(/^cast_drop,(.+)$/m)?.[1]?.trim() ?? "";
  if (drop) return drop;
  const before = parseCallSheet(yesterday).talent.map((row) => row.number).filter(Boolean);
  const after = parseScheduleCsv(csv).talent.map((row) => row.number).filter(Boolean);
  return before.filter((num) => !after.includes(num)).join(", ");
}

function addedCast(csv: string): string {
  return csv.match(/^cast_add,(.+)$/m)?.[1]?.replace("|", " — ") ?? "";
}

function matchVan(text: string, label: string): string {
  return text.match(new RegExp(`^-\\s+${label}\\s+[—-]\\s+(.+)$`, "im"))?.[1]?.trim() ?? "";
}

function stripTitle(title: string): string {
  return title.replace(/^CALL SHEET\s+[—-]\s+/i, "");
}

function matchLine(text: string, pattern: RegExp): string | undefined {
  return text.match(pattern)?.[1]?.trim();
}

function matchField(text: string, label: string): string | undefined {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp(`^${escaped}:\\s*(.+)$`, "im"))?.[1]?.trim();
}

function notesBlock(markdown: string): string {
  const idx = markdown.search(/^##\s+Notes\s*$/im);
  if (idx < 0) return "";
  return markdown.slice(idx).replace(/^##\s+Notes\s*/i, "").trim();
}
