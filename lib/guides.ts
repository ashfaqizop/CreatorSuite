// Original long-form content for CreatorSuite guides. Each guide links to a
// related tool, which helps readers and strengthens the site's content depth.

export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  readMinutes: number;
  relatedTool?: { slug: string; name: string };
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-price-a-brand-sponsorship",
    title: "How to Price a Brand Sponsorship",
    description:
      "A practical framework for turning your audience size, engagement, and niche into a defensible flat fee.",
    readMinutes: 5,
    relatedTool: { slug: "sponsorship-rate", name: "Sponsorship Rate Estimator" },
    sections: [
      {
        heading: "Start with a CPM mindset",
        paragraphs: [
          "Most sponsorship pricing ultimately ties back to a cost-per-thousand-views (CPM) logic, even when the deal is a flat fee. A brand is paying to reach your audience, so the first number that matters is how many people will realistically see the placement. For a YouTube integration that is the expected views in the first 30 days; for a story it is the average view count of recent stories.",
          "Different niches command very different CPMs. Finance, B2B, and tech audiences are worth far more per view than general lifestyle or gaming audiences because the products being advertised have higher margins and customer lifetime value. A creator with 50,000 views in personal finance can often charge more than a creator with 200,000 views in gaming.",
        ],
      },
      {
        heading: "Layer in engagement and deliverable type",
        paragraphs: [
          "Raw reach is only half the story. An audience that comments, clicks, and buys is worth a premium, so creators with above-average engagement for their niche can and should charge more. A useful rule of thumb is to add a modest multiplier when your engagement rate beats the niche benchmark.",
          "The format of the deliverable changes the price dramatically. A dedicated video built entirely around the brand is worth far more than a 60-second integration inside other content, which is in turn worth more than a quick story mention. Pricing each format off the same base rate keeps your rate card consistent and easy to defend in negotiations.",
        ],
      },
      {
        heading: "Give a range, not a single number",
        paragraphs: [
          "Brands expect negotiation, so quote a low, mid, and high figure rather than a single price. Anchor your conversation at the mid figure, hold the high figure for added usage rights or exclusivity, and treat the low figure as your walk-away floor. Knowing all three before the call keeps you from underselling in the moment.",
        ],
      },
    ],
  },
  {
    slug: "youtube-rpm-explained",
    title: "YouTube RPM vs CPM: What Actually Pays You",
    description:
      "Why two channels with the same views earn wildly different AdSense revenue — and how to estimate yours.",
    readMinutes: 6,
    relatedTool: { slug: "youtube-rpm", name: "YouTube AdSense & RPM Predictor" },
    sections: [
      {
        heading: "CPM is what advertisers pay; RPM is what you keep",
        paragraphs: [
          "CPM (cost per mille) is what an advertiser pays per thousand ad impressions. RPM (revenue per mille) is what actually lands in your pocket per thousand video views, after YouTube's revenue share and after accounting for views that were never monetized at all. RPM is always the more honest number for a creator to plan around.",
          "Because not every view shows an ad, and because YouTube keeps a 45% share of AdSense revenue, your RPM is typically a fraction of the headline CPM. Planning your income off CPM will leave you disappointed; planning off RPM keeps your expectations grounded.",
        ],
      },
      {
        heading: "Geography and niche move RPM the most",
        paragraphs: [
          "Where your viewers live matters enormously. Views from the United States, Canada, Australia, and Western Europe are worth several times more than views from many other regions, simply because advertisers bid more for them. A channel with 80% US traffic can out-earn a channel with triple the views but mostly low-CPM geographies.",
          "Niche is the other big lever. Finance, software, and business channels routinely see double-digit RPMs, while entertainment and gaming often sit in the low single digits. This is the same dynamic that drives sponsorship pricing.",
        ],
      },
      {
        heading: "Mid-roll ads and video length",
        paragraphs: [
          "Videos longer than eight minutes can run mid-roll ads, which meaningfully increases the number of monetizable impressions per view and therefore your effective RPM. Many creators deliberately structure content to clear the eight-minute threshold for exactly this reason — though it only helps if the content stays watchable.",
        ],
      },
    ],
  },
  {
    slug: "ugc-pricing-guide",
    title: "UGC Pricing: Charging for Usage Rights",
    description:
      "User-generated content is priced on licensing, not reach. Here's how the tiers work.",
    readMinutes: 5,
    relatedTool: { slug: "ugc-rate", name: "UGC Rate Calculator" },
    sections: [
      {
        heading: "UGC is a production service, not an ad placement",
        paragraphs: [
          "With user-generated content (UGC), a brand pays you to produce video assets they then use on their own channels and in paid ads. You are not selling access to your audience — you are selling a finished creative asset and the rights to use it. That changes the entire pricing logic.",
          "Because the brand is buying a license, the single biggest price driver is how broadly and for how long they can use the footage. A clip used organically on the brand's own page is cheap; the same clip licensed for a year of paid advertising across every platform is worth several times more.",
        ],
      },
      {
        heading: "The usage tiers",
        paragraphs: [
          "A typical ladder runs from organic-only use, to short whitelisting windows of 30 or 90 days, to a full 12-month license, up to a complete buyout where the brand owns the asset outright. Each rung up the ladder should carry a clear premium.",
          "On top of the base license, add premiums for multi-platform use, for each additional round of revisions, and for exclusivity that prevents you from working with competitors. Spelling these out as separate line items makes your quote transparent and easier to negotiate.",
        ],
      },
    ],
  },
  {
    slug: "diversifying-creator-income",
    title: "Diversifying Your Creator Income",
    description:
      "Why relying on a single revenue stream is risky, and how to map the mix you need to go full-time.",
    readMinutes: 6,
    relatedTool: { slug: "quit-job", name: '"Quit Your Job" Milestone Tracker' },
    sections: [
      {
        heading: "One platform is a single point of failure",
        paragraphs: [
          "A creator earning entirely from AdSense is one algorithm change or demonetization away from a crisis. The creators who sustain full-time careers almost always combine several streams — ad revenue, sponsorships, a membership community, and their own products — so that a dip in one is cushioned by the others.",
          "Diversification also smooths out seasonality. Ad rates swing through the year, sponsorship budgets ebb and flow, but a recurring membership base provides a predictable monthly floor you can actually plan around.",
        ],
      },
      {
        heading: "Work backward from a survival number",
        paragraphs: [
          "Rather than chasing vanity metrics, start from the monthly income you need to live, then reverse-engineer how much each stream must contribute. If memberships should cover a third of that number, you can calculate exactly how many paying members at a given tier price you need to recruit.",
          "This reverse-engineering turns a vague goal into a concrete checklist: a target number of monthly views for ad revenue, a number of sponsored videos, a number of members, and a number of product sales. Each becomes a milestone you can track.",
        ],
      },
      {
        heading: "Sequence the streams",
        paragraphs: [
          "Most creators add streams in a natural order: ad revenue and affiliate links first because they require no audience trust to monetize, then sponsorships once reach is proven, then memberships and products once a loyal core audience exists. Trying to launch a paid product before you have an engaged audience usually disappoints.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
