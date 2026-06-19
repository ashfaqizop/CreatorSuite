import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CreatorSuite",
  description:
    "How CreatorSuite collects, uses, and protects your data, including cookies and Google AdSense advertising.",
};

const EFFECTIVE = "June 19, 2026";
// CREATORSUITE-TODO[ops]: update CONTACT to a dedicated support address if desired.
const CONTACT = "ashfaqizop@gmail.com";

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cs-dot font-display text-cs-16 uppercase tracking-wide flex items-center mt-4">
      {children}
    </h2>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
      {children}
    </p>
  );
}

export default function PrivacyPage() {
  return (
    <article className="flex flex-col gap-4 max-w-[720px]">
      <h1 className="font-display text-cs-32">Privacy Policy</h1>
      <p className="font-mono text-cs-12 text-cs-fg-dim">Effective {EFFECTIVE}</p>

      <P>
        This Privacy Policy explains how CreatorSuite (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) handles information when you use creatorsuite, our
        creator-monetization calculators. By using the site you agree to this
        policy.
      </P>

      <H>Information we collect</H>
      <P>
        <strong>Anonymous use.</strong> When you use a tool without signing in,
        your most recent inputs are saved only in your browser&apos;s
        localStorage so the form can pre-fill on your next visit. This data never
        leaves your device and is not sent to our servers.
      </P>
      <P>
        <strong>Account data.</strong> If you sign in with Google, we receive
        your name, email address, and profile image from Google to identify your
        account. We do not receive your Google password.
      </P>
      <P>
        <strong>Saved estimates.</strong> For signed-in users, the inputs and
        results of estimates you run, and the Rate Card you assemble, are stored
        in our database so you can revisit them.
      </P>

      <H>How we use information</H>
      <P>
        We use this information solely to operate the service: to authenticate
        you, to save and display your history and Rate Card, to generate PDF
        exports, and to enrich estimates with benchmark ranges. We do not sell
        your personal information.
      </P>

      <H>Cookies and advertising</H>
      <P>
        We display advertising through Google AdSense. Third-party vendors,
        including Google, use cookies to serve ads based on your prior visits to
        this and other websites. Google&apos;s use of advertising cookies enables
        it and its partners to serve ads to you based on your visit to our site
        and/or other sites on the internet.
      </P>
      <P>
        You may opt out of personalized advertising by visiting Google&apos;s Ads
        Settings (adssettings.google.com). For visitors in the European Economic
        Area, the United Kingdom, and Switzerland, we present a consent message
        before personalized ads are served, as required by applicable law.
      </P>

      <H>Third-party services</H>
      <P>
        We rely on Supabase (database), Google (sign-in and advertising), and
        Vercel (hosting). Each processes data under its own privacy terms. We
        share only what is necessary for these services to function.
      </P>

      <H>Data retention and your choices</H>
      <P>
        You can delete any saved estimate from your History at any time, and you
        can clear anonymous inputs by clearing your browser data. To request
        deletion of your account and associated data, contact us at the address
        below.
      </P>

      <H>Children</H>
      <P>
        CreatorSuite is not directed to children under 13, and we do not
        knowingly collect personal information from them.
      </P>

      <H>Changes to this policy</H>
      <P>
        We may update this policy from time to time. Material changes will be
        reflected by updating the effective date above.
      </P>

      <H>Contact</H>
      <P>Questions about this policy? Email {CONTACT}.</P>

      <p className="font-mono text-cs-12 text-cs-fg-dim leading-relaxed border-t border-cs-border pt-4 mt-2">
        All calculator outputs are estimates only and do not constitute financial
        advice.
      </p>
    </article>
  );
}
