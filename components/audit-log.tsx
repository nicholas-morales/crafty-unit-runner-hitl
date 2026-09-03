import { sortTrail, trailFields } from "@/lib/trail";
import type { AuditEvent } from "@/lib/types";

export function AuditLog({ events }: { events: AuditEvent[] }) {
  const trail = sortTrail(events);

  if (trail.length === 0) {
    return (
      <p
        className="border border-dashed border-line px-4 py-6 text-sm text-faint"
        data-testid="audit-trail-empty"
      >
        No audit rows yet. Approve to append a trail row (timestamp, actor stub, action,
        before/after or gate state). Synthetic only. sent stays false.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-line bg-raised" data-testid="audit-trail">
      <table className="w-full text-left text-sm">
        <thead className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Before</th>
            <th className="px-4 py-3">After / gate</th>
            <th className="px-4 py-3">sent</th>
          </tr>
        </thead>
        <tbody>
          {trail.map((event) => {
            const row = trailFields(event);
            return (
              <tr key={event.id} className="border-t border-line align-top">
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{row.at}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-cream">{row.actor}</td>
                <td className="px-4 py-3 font-mono text-[11px] uppercase text-emerald">
                  {row.action}
                </td>
                <td className="px-4 py-3 text-faint">{row.before}</td>
                <td className="px-4 py-3 text-cream">
                  <p>{row.after}</p>
                  <p className="mt-1 font-mono text-[11px] text-faint">gate: {row.gateState}</p>
                  {event.summary ? (
                    <p className="mt-1 text-xs text-muted">{event.summary}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-ok">false</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
