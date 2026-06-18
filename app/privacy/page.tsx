export const metadata = { title: "Privacy — CreatorSuite" };

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-4 max-w-[680px]">
      <h1 className="font-display text-cs-32">Privacy</h1>
      <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
        Anonymous use stores your last inputs only in your browser&apos;s
        localStorage — never sent to our servers. If you sign in with Google, we
        store your estimates and Rate Card in our database, associated with your
        account, and you can delete them at any time from your History.
      </p>
      <h2 className="font-display text-cs-24 mt-4">Advertising</h2>
      <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
        CreatorSuite displays ads via Google AdSense. Google and its partners may
        use cookies to serve ads based on your prior visits to this and other
        websites. Ads are placed alongside content and never inside calculators.
      </p>
      <h2 className="font-display text-cs-24 mt-4">Disclaimer</h2>
      <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
        All outputs are estimates only and do not constitute financial advice.
      </p>
    </div>
  );
}
