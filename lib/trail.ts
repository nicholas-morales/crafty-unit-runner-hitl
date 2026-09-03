import type { AuditEvent } from "@/lib/types";

export const DEMO_ACTOR_STUB = "demo.operator@verde-labs.example";

export function stringField(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function withTrailState(
  detail: Record<string, unknown> | undefined,
  decision: string,
): Record<string, unknown> {
  return {
    ...detail,
    sent: false,
    decision,
    before: stringField(detail?.before, "pending"),
    after: stringField(detail?.after, decision),
    gateState: stringField(detail?.gateState, decision),
  };
}

export function trailFields(event: AuditEvent): {
  at: string;
  actor: string;
  action: string;
  before: string;
  after: string;
  gateState: string;
} {
  const detail = event.detail ?? {};
  return {
    at: event.at,
    actor: event.actor,
    action: event.action,
    before: stringField(detail.before, "pending"),
    after: stringField(detail.after, event.action),
    gateState: stringField(detail.gateState, event.action),
  };
}

export function sortTrail(events: AuditEvent[]): AuditEvent[] {
  return [...events].sort((a, b) => (a.at < b.at ? -1 : 1));
}
