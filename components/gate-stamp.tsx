import type { GateDecision } from "@/lib/types";

export function GateStamp({
  decision,
  sent = false,
  extra,
}: {
  decision: GateDecision;
  sent?: boolean;
  extra?: string;
}) {
  return (
    <div className="stamp text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald">HITL gate</p>
      <p className="mt-1 font-serif text-3xl tracking-tight text-cream">{decision}</p>
      <p className="mt-1 font-mono text-xs text-ok">
        sent: {String(sent)}
      </p>
      {extra ? <p className="mt-2 text-xs text-muted">{extra}</p> : null}
    </div>
  );
}
