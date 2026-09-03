import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { makeId } from "@/lib/id";
import { DEMO_ACTOR_STUB } from "@/lib/trail";
import type { AuditEvent, DemoId } from "@/lib/types";

const memory: AuditEvent[] = [];

function dataDir(): string {
  const override = process.env.VERDE_AUDIT_DIR;
  if (override) {
    mkdirSync(override, { recursive: true });
    return override;
  }

  const local = path.join(process.cwd(), "data");
  try {
    mkdirSync(local, { recursive: true });
    return local;
  } catch {
    const tmp = path.join("/tmp", "verde-labs");
    mkdirSync(tmp, { recursive: true });
    return tmp;
  }
}

function fileFor(demo: DemoId): string {
  return path.join(dataDir(), `${demo}.jsonl`);
}

export function appendAudit(
  input: Omit<AuditEvent, "id" | "at" | "sent" | "actor"> & {
    actor?: string;
  },
): AuditEvent {
  const event: AuditEvent = {
    id: makeId("evt"),
    at: new Date().toISOString(),
    actor: input.actor ?? DEMO_ACTOR_STUB,
    sent: false,
    demo: input.demo,
    action: input.action,
    summary: input.summary,
    detail: input.detail,
  };

  memory.unshift(event);

  try {
    const file = fileFor(event.demo);
    let existing = "";
    try {
      existing = readFileSync(file, "utf8");
    } catch {
      existing = "";
    }
    writeFileSync(file, `${existing}${JSON.stringify(event)}\n`);
  } catch {
    // Memory still holds the event for this process.
  }

  return event;
}

export function listAudit(demo?: DemoId): AuditEvent[] {
  const fromDisk = demo ? readDisk(demo) : ([] as AuditEvent[]).concat(
    ...(["call-sheet-gate", "metrc-recon", "vendor-po-gate", "crafty-runner"] as DemoId[]).map(
      readDisk,
    ),
  );

  const merged = new Map<string, AuditEvent>();
  for (const event of [...fromDisk, ...memory]) {
    merged.set(event.id, event);
  }

  const rows = [...merged.values()].sort((a, b) => (a.at < b.at ? 1 : -1));
  return demo ? rows.filter((row) => row.demo === demo) : rows;
}

function readDisk(demo: DemoId): AuditEvent[] {
  try {
    const raw = readFileSync(fileFor(demo), "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AuditEvent);
  } catch {
    return [];
  }
}
