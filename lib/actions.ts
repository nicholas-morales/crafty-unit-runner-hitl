"use server";

import { appendAudit, listAudit } from "@/lib/audit";
import { withTrailState } from "@/lib/trail";
import type { AuditEvent, DemoId, GateDecision } from "@/lib/types";

export async function recordGateEvent(input: {
  demo: DemoId;
  decision: Exclude<GateDecision, "pending">;
  summary: string;
  detail?: Record<string, unknown>;
}): Promise<AuditEvent> {
  const action =
    input.detail && input.detail.channel === "twilio-preview"
      ? "send-held"
      : input.detail && input.detail.channel === "vendor-email-preview"
        ? "email-held"
        : input.detail && input.detail.channel === "runner-dispatch-preview"
          ? "dispatch-held"
          : input.decision;

  return appendAudit({
    demo: input.demo,
    action,
    summary: input.summary,
    detail: withTrailState(input.detail, input.decision),
  });
}

export async function recordAttestation(input: {
  demo: DemoId;
  summary: string;
  detail?: Record<string, unknown>;
}): Promise<AuditEvent> {
  return appendAudit({
    demo: input.demo,
    action: "attest",
    summary: input.summary,
    detail: withTrailState(
      {
        ...input.detail,
        wroteMetrc: false,
        no_metrc_writes_confirmed: true,
        before: "open",
        after: "attested",
        gateState: "attested",
      },
      "attested",
    ),
  });
}

export async function recordExport(input: {
  demo: DemoId;
  summary: string;
  detail?: Record<string, unknown>;
}): Promise<AuditEvent> {
  return appendAudit({
    demo: input.demo,
    action: "export",
    summary: input.summary,
    detail: withTrailState(
      {
        ...input.detail,
        emailedVendor: false,
      },
      "approved",
    ),
  });
}

export async function loadAudit(demo: DemoId): Promise<AuditEvent[]> {
  return listAudit(demo);
}
