import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — CreatorSuite",
  description:
    "The terms governing your use of CreatorSuite's creator-monetization calculators.",
};

const EFFECTIVE = "June 19, 2026";
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

export default function TermsPage() {
  return (
    <article className="flex flex-col gap-4 max-w-[720px]">
      <h1 className="font-display text-cs-32">Terms of Service</h1>
      <p className="font-mono text-cs-12 text-cs-fg-dim">Effective {EFFECTIVE}</p>

      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
        CreatorSuite (the &ldquo;Service&rdquo;). By accessing or using the
        Service, you agree to these Terms. If you do not agree, do not use the
        Service.
      </P>

      <H>The service</H>
      <P>
        CreatorSuite provides free online calculators that estimate creator
        income and pricing using your inputs and curated industry benchmark
        ranges. The Service is provided for informational purposes only.
      </P>

      <H>Estimates are not financial advice</H>
      <P>
        All outputs are estimates based on assumptions and reference ranges that
        may not reflect your actual results. They do not constitute financial,
        tax, legal, or professional advice. You are solely responsible for
        decisions you make based on them, and you should consult a qualified
        professional where appropriate.
      </P>

      <H>Accounts</H>
      <P>
        You may sign in with a Google account to save your estimates. You are
        responsible for activity under your account and for maintaining the
        security of your Google credentials. You may stop using the Service and
        request deletion of your data at any time.
      </P>

      <H>Acceptable use</H>
      <P>
        You agree not to misuse the Service, including by attempting to disrupt
        it, access it through automated means at a scale that burdens our
        infrastructure, reverse-engineer it, or use it for any unlawful purpose.
      </P>

      <H>Intellectual property</H>
      <P>
        The Service, including its design, code, and content, is owned by
        CreatorSuite and protected by applicable laws. Estimates and PDF exports
        you generate from your own inputs are yours to use freely.
      </P>

      <H>Advertising and third parties</H>
      <P>
        The Service displays advertising via Google AdSense and relies on
        third-party providers. We are not responsible for the content of ads or
        of any third-party sites linked from the Service.
      </P>

      <H>Disclaimer of warranties</H>
      <P>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, express or implied,
        including accuracy, fitness for a particular purpose, or uninterrupted
        availability.
      </P>

      <H>Limitation of liability</H>
      <P>
        To the maximum extent permitted by law, CreatorSuite shall not be liable
        for any indirect, incidental, or consequential damages, or for any loss
        arising from your reliance on estimates produced by the Service.
      </P>

      <H>Changes</H>
      <P>
        We may update these Terms from time to time. Continued use of the Service
        after changes take effect constitutes acceptance of the revised Terms.
      </P>

      <H>Contact</H>
      <P>Questions about these Terms? Email {CONTACT}.</P>
    </article>
  );
}
