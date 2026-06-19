export interface Release {
  version: string;
  date: string;
  title: string;
  items: string[];
}

/** Public release history shown on /changelog. Newest first. */
export const RELEASES: Release[] = [
  {
    version: "v2.0",
    date: "June 19, 2026",
    title: "Full suite — all 21 tools live",
    items: [
      "Community Churn Rate Calculator",
      "Expense & Gear Depreciation Calculator",
      "Self-Employment Tax Estimator",
      "Agency / Manager Commission Calculator",
      "Hook Retention Value Estimator",
      "Repurposing Velocity Calculator",
      "All 21 tools across 5 categories now live",
    ],
  },
  {
    version: "v1.2",
    date: "June 19, 2026",
    title: "Ad-revenue & newsletter tools",
    items: [
      "TikTok Creator Rewards Estimator",
      "Shorts / Reels Estimator (YouTube, Instagram, Facebook)",
      "Podcast Audio Ad Calculator",
      "Paid Newsletter / Substack Simulator",
      "15 of 21 tools now live",
    ],
  },
  {
    version: "v1.1",
    date: "June 19, 2026",
    title: "Brand-deal & blog tools",
    items: [
      "Affiliate ROI Predictor",
      "Usage Rights Multiplier",
      "Multi-Platform Bundler",
      "Blog & Website RPM Forecaster",
      "Guides, Privacy Policy, and Terms of Service added",
    ],
  },
  {
    version: "v1.0",
    date: "June 19, 2026",
    title: "MVP launch",
    items: [
      "7 core tools: Sponsorship Rate, YouTube RPM, UGC Rate, Membership Planner, Product Launch, Quit-Your-Job Tracker, AI Cost",
      "Nothing Dot Matrix design system",
      "Google sign-in, saved history, and Rate Card",
      "Branded PDF export on every tool",
      "Admin benchmark editor and AdSense placements",
    ],
  },
];
