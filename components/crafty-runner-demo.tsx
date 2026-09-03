"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLog } from "@/components/audit-log";
import { EmpowermentBanner } from "@/components/empowerment-banner";
import { GateStamp } from "@/components/gate-stamp";
import { HeldMessagePreview } from "@/components/held-message-preview";
import { loadAudit, recordGateEvent } from "@/lib/actions";
import {
  CRAFTY_FLAGS,
  defaultCraftyForm,
  draftCraftyList,
  previewRunnerPacket,
} from "@/lib/crafty";
import { sortTrail } from "@/lib/trail";
import type { AuditEvent, CraftyFormInput, GateDecision } from "@/lib/types";

export function CraftyRunnerDemo({
  pullsCsv,
  unitMarkdown,
}: {
  pullsCsv: string;
  unitMarkdown: string;
}) {
  const [form, setForm] = useState<CraftyFormInput>(defaultCraftyForm);
  const [applied, setApplied] = useState<CraftyFormInput>(defaultCraftyForm);
  const drafted = useMemo(
    () => draftCraftyList(pullsCsv, unitMarkdown, applied),
    [applied, pullsCsv, unitMarkdown],
  );
  const previews = useMemo(() => previewRunnerPacket(drafted), [drafted]);
  const [decision, setDecision] = useState<GateDecision>("pending");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [flash, setFlash] = useState("List stays a draft until Approve locks it. No live SMS or email.");
  const [busy, setBusy] = useState(false);
  const [dispatchHeld, setDispatchHeld] = useState(false);

  const locked = decision === "approved";

  useEffect(() => {
    void loadAudit("crafty-runner").then((rows) => setEvents(sortTrail(rows)));
  }, []);

  function applyForm(event: React.FormEvent) {
    event.preventDefault();
    if (locked) {
      setFlash("List is locked. Reject to reopen the form, or leave the locked packet as-is.");
      return;
    }
    setApplied({ ...form });
    setFlash("Draft rebuilt from fixtures + form. Still unlocked. Approve to lock.");
  }

  function resetForm() {
    if (locked) {
      setFlash("Locked list cannot reset. Reject first.");
      return;
    }
    const next = defaultCraftyForm();
    setForm(next);
    setApplied(next);
    setFlash("Reset to Night Shift fixtures. Draft only — not locked.");
  }

  async function decide(next: Exclude<GateDecision, "pending">) {
    setBusy(true);
    try {
      const event = await recordGateEvent({
        demo: "crafty-runner",
        decision: next,
        summary:
          next === "approved"
            ? "Crafty / unit list approved and locked. Runner packet preview unlocked. No live SMS or email."
            : "Crafty / unit list rejected. Lock stays off. Runner is not dispatched.",
        detail: {
          flags: drafted.flags,
          location: drafted.location,
          headcount: drafted.headcount,
          locked: next === "approved",
          dispatched: false,
          sent: false,
          before: decision,
          after: next === "approved" ? "locked" : next,
          gateState: next === "approved" ? "locked" : next,
        },
      });
      setDecision(next);
      setDispatchHeld(false);
      setEvents((current) =>
        sortTrail([...current.filter((row) => row.id !== event.id), event]),
      );
      setFlash(
        next === "approved"
          ? "Approved. Shopping / unit list is locked. Held runner preview is below. Dispatch stays a no-op."
          : "Rejected. List stays a draft. Lock and dispatch remain off. Nothing left the box.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function attemptDispatch() {
    if (decision !== "approved") {
      setFlash("Dispatch is disabled until Approve locks the list.");
      return;
    }
    const event = await recordGateEvent({
      demo: "crafty-runner",
      decision: "approved",
      summary: "Dispatch preview clicked. Held — no SMS or email. Runner was not texted. sent remains false.",
      detail: {
        channel: "runner-dispatch-preview",
        delivered: false,
        dispatched: false,
        sent: false,
        before: "locked",
        after: "locked",
        gateState: "locked",
      },
    });
    setDispatchHeld(true);
    setEvents((current) =>
      sortTrail([...current.filter((row) => row.id !== event.id), event]),
    );
    setFlash("Preview only. No live SMS or email. The mock logged dispatch as held — sent remains false.");
  }

  return (
    <div className="space-y-8">
      <div className="border border-amber/50 bg-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
        DEMO pack · Harbor Night Day 13 · CR-01…CR-08 · no live SMS / email
      </div>
      <EmpowermentBanner>
        Coordinators own the run. Fixtures plus the form only draft a shopping / unit
        logistics list. Approve locks it. Reject keeps it a draft. Dispatch never leaves
        the box — no Twilio, no SMTP.
      </EmpowermentBanner>

      <form
        className="grid gap-4 border border-line bg-card p-5 lg:grid-cols-[1.1fr_0.9fr]"
        onSubmit={applyForm}
      >
        <fieldset className="space-y-3" disabled={locked}>
          <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
            Form / fixture input
          </legend>
          <label className="block text-sm text-muted">
            Headcount
            <input
              className="mt-1 w-full border border-line bg-[#0d110c] px-3 py-2 text-cream"
              type="number"
              min={1}
              value={form.headcount}
              onChange={(event) =>
                setForm((current) => ({ ...current, headcount: Number(event.target.value) }))
              }
            />
          </label>
          <label className="block text-sm text-muted">
            Extra crafty item
            <input
              className="mt-1 w-full border border-line bg-[#0d110c] px-3 py-2 text-cream"
              type="text"
              value={form.extraItem}
              placeholder="e.g. extra electrolyte packets"
              onChange={(event) =>
                setForm((current) => ({ ...current, extraItem: event.target.value }))
              }
            />
          </label>
          <label className="block text-sm text-muted">
            Extra qty
            <input
              className="mt-1 w-full border border-line bg-[#0d110c] px-3 py-2 text-cream"
              type="number"
              min={0}
              value={form.extraQty}
              onChange={(event) =>
                setForm((current) => ({ ...current, extraQty: Number(event.target.value) }))
              }
            />
          </label>
          <label className="block text-sm text-muted">
            Runner note
            <textarea
              className="mt-1 min-h-[5.5rem]"
              value={form.runnerNote}
              placeholder="Synthetic note only — stays on the draft until lock."
              onChange={(event) =>
                setForm((current) => ({ ...current, runnerNote: event.target.value }))
              }
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-emerald" type="submit" disabled={locked}>
              Rebuild draft
            </button>
            <button className="btn" type="button" disabled={locked} onClick={resetForm}>
              Reset fixtures
            </button>
          </div>
        </fieldset>
        <aside className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            fixtures/crafty-runner/
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-muted">
            {unitMarkdown.trim()}
          </pre>
        </aside>
      </form>

      <section className="border border-line bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
              Heuristic draft
            </p>
            <h2 className="mt-1 font-serif text-2xl text-cream">
              {drafted.production} {drafted.dayLabel} · CR-01…CR-08
            </h2>
            <p className="mt-1 text-sm text-muted">
              {drafted.location} · crafty {drafted.craftyCall} · general {drafted.generalCall} ·
              HC {drafted.headcount}
            </p>
          </div>
          <GateStamp
            decision={decision}
            extra={
              locked
                ? "List locked. Dispatch stays held — no live SMS/email."
                : "Approve-before-lock. Draft is not the run sheet yet."
            }
          />
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {drafted.flags.map((flag) => (
            <li key={flag} className="border border-line px-2 py-1 font-mono text-[11px] text-muted">
              {flag} {CRAFTY_FLAGS[flag as keyof typeof CRAFTY_FLAGS]}
            </li>
          ))}
        </ul>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="pb-2 pr-3">ID</th>
                <th className="pb-2 pr-3">Dept</th>
                <th className="pb-2 pr-3">Item</th>
                <th className="pb-2 pr-3">Qty</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {drafted.lines.map((row) => (
                <tr
                  key={`${row.sku}-${row.plant}`}
                  className={`border-t border-line ${row.severity === "HIGH" ? "bg-rose/10" : "bg-emerald/5"}`}
                >
                  <td className="py-2 pr-3 font-mono text-[11px] text-amber">
                    {row.plant}
                    <span className="ml-2 text-faint">{row.severity}</span>
                  </td>
                  <td className="py-2 pr-3 text-cream">{row.dept}</td>
                  <td className="py-2 pr-3 text-cream">{row.item}</td>
                  <td className="py-2 pr-3 text-muted">
                    {row.qty} {row.unit}
                  </td>
                  <td className="py-2 text-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {drafted.stops.map((stop) => (
            <article key={stop.plant} className="border border-line bg-raised p-3">
              <p className="font-mono text-[11px] uppercase text-amber">
                {stop.plant} · {stop.severity}
              </p>
              <p className="mt-1 text-sm text-cream">{stop.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn btn-emerald" disabled={busy} onClick={() => void decide("approved")}>
            Approve + lock
          </button>
          <button className="btn btn-rose" disabled={busy} onClick={() => void decide("rejected")}>
            Reject
          </button>
          <button
            className="btn"
            disabled={decision !== "approved"}
            onClick={() => void attemptDispatch()}
          >
            Dispatch preview (SMS/email off)
          </button>
        </div>
        <p className="mt-3 text-sm text-muted" role="status">
          {flash}
          {dispatchHeld ? " sent: false." : ""}
        </p>
      </section>

      <HeldMessagePreview
        unlocked={locked}
        preview={previews}
        sendHeld={dispatchHeld}
      />

      <section>
        <h2 className="font-serif text-2xl text-cream">Audit / event trail</h2>
        <p className="mt-1 mb-4 text-sm text-faint">
          Append-only · synthetic · <code>data/crafty-runner.jsonl</code> · sent stays false
        </p>
        <AuditLog events={events} />
      </section>
    </div>
  );
}
