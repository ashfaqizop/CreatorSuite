import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-cs-border mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/about"
            className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-fg"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-fg"
          >
            Privacy
          </Link>
          <Link
            href="/settings"
            className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-fg"
          >
            Settings
          </Link>
        </div>
        <p className="font-mono text-cs-12 text-cs-fg-dim max-w-prose leading-relaxed">
          CreatorSuite shows advertising via Google AdSense. Ads are placed
          alongside content, never inside calculators. All figures are estimates
          only — not financial advice.
        </p>
        <p className="font-mono text-cs-12 text-cs-fg-dim">
          © {new Date().getFullYear()} CreatorSuite · creatorsuite.vercel.app
        </p>
      </div>
    </footer>
  );
}
