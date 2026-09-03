import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs leading-5 text-faint sm:flex-row sm:justify-between sm:px-8">
        <p>
          Verde Labs is the portfolio / build lane. Feedback Ops cash stays on{" "}
          <a
            className="text-muted hover:text-cream"
            href="https://feedback-ops-copilot.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            FO
          </a>
          . Not Verde Comply production. Not Sora. Not Movie Magic.
        </p>
        <p>
          Synthetic fixtures only. No live Twilio, Metrc write, or vendor email.{" "}
          <Link href="/labs" className="text-muted hover:text-cream">
            All labs
          </Link>
        </p>
      </div>
    </footer>
  );
}
