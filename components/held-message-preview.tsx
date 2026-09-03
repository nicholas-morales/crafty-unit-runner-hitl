import type { HeldPreview } from "@/lib/call-sheet";

export function HeldMessagePreview({
  unlocked,
  preview,
  sendHeld = false,
}: {
  unlocked: boolean;
  preview: HeldPreview;
  sendHeld?: boolean;
}) {
  if (!unlocked) {
    return (
      <section
        className="border border-dashed border-line bg-raised px-4 py-6"
        data-testid="held-preview-locked"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Fake SMS / email preview body
        </p>
        <p className="mt-2 text-sm text-muted">
          Approve to render the fake SMS and email preview body. Send stays locked until then.
          No Twilio.
        </p>
      </section>
    );
  }

  const smsLines = preview.sms
    .split("\n")
    .filter((line) => !line.startsWith("[HELD"));

  return (
    <section className="space-y-4" data-testid="held-preview-unlocked">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald">
            After Approve · rendered preview body
          </p>
          <h3 className="mt-1 font-serif text-2xl text-cream">Fake SMS / email</h3>
        </div>
        <p className="font-mono text-[11px] text-ok">
          sent: false · {sendHeld ? "Send preview held — no Twilio" : "Twilio off"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article
          className="border border-line bg-raised p-4"
          data-testid="sms-preview-body"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            SMS preview · {preview.smsFrom}
          </p>
          <div className="mx-auto mt-4 max-w-[280px] rounded-[1.75rem] border border-line bg-[#0c100b] p-3">
            <div className="rounded-full bg-line/70 px-3 py-1 text-center font-mono text-[10px] text-faint">
              held · not sent
            </div>
            <div className="mt-4 rounded-2xl rounded-bl-sm bg-emerald/20 px-3 py-3 text-sm leading-6 text-cream">
              {smsLines.map((line, index) => (
                <p key={`${index}-${line.slice(0, 24)}`} className="whitespace-pre-wrap">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-3 text-center font-mono text-[10px] text-ok">sent: false</p>
          </div>
        </article>

        <article
          className="border border-line bg-raised p-4"
          data-testid="email-preview-body"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            Email preview · held
          </p>
          <div className="mt-4 border border-line bg-card">
            <dl className="divide-y divide-line text-sm">
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">From</dt>
                <dd className="text-cream">{preview.emailFrom}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">To</dt>
                <dd className="text-cream">{preview.emailTo}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-mono text-[11px] text-faint">Subject</dt>
                <dd className="text-cream">{preview.emailSubject}</dd>
              </div>
            </dl>
            <pre
              className="whitespace-pre-wrap border-t border-line bg-[#0d110c] px-3 py-3 text-xs leading-5 text-cream"
              data-testid="email-preview-copy"
            >
              {preview.emailBody}
            </pre>
            <p className="border-t border-line px-3 py-2 font-mono text-[11px] text-ok">
              sent: false · no live SMTP
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
