import { describe, it, expect } from "vitest";
import { SEED_BUNDLE } from "@/lib/benchmarks/seed";

import * as sponsorship from "@/lib/tools/sponsorship-rate/calc";
import * as youtube from "@/lib/tools/youtube-rpm/calc";
import * as ugc from "@/lib/tools/ugc-rate/calc";
import * as membership from "@/lib/tools/membership-planner/calc";
import * as product from "@/lib/tools/product-launch/calc";
import * as quit from "@/lib/tools/quit-job/calc";
import * as ai from "@/lib/tools/ai-cost/calc";
import * as affiliate from "@/lib/tools/affiliate-roi/calc";
import * as usage from "@/lib/tools/usage-rights/calc";
import * as bundler from "@/lib/tools/platform-bundler/calc";
import * as blog from "@/lib/tools/blog-rpm/calc";
import * as tiktok from "@/lib/tools/tiktok-rewards/calc";
import * as shortform from "@/lib/tools/shortform-estimator/calc";
import * as podcast from "@/lib/tools/podcast-ads/calc";
import * as newsletter from "@/lib/tools/newsletter-sim/calc";
import * as churn from "@/lib/tools/churn-rate/calc";
import * as gear from "@/lib/tools/gear-depreciation/calc";
import * as setax from "@/lib/tools/se-tax/calc";
import * as commission from "@/lib/tools/commission-calc/calc";
import * as hook from "@/lib/tools/hook-retention/calc";
import * as repurposing from "@/lib/tools/repurposing-velocity/calc";

const B = SEED_BUNDLE;

describe("Sponsorship Rate (§5.1)", () => {
  it("applies CPM, engagement, and deliverable multipliers", () => {
    // tech CPM 25; views 50k → base 1250; engagement 4 vs avg 2 → ×1.5;
    // dedicated → ×1.5 → mid 2812.5
    const r = sponsorship.calculate(
      { monthlyViews: 50000, engagementRate: 4, niche: "tech", platform: "youtube", deliverable: "dedicated" },
      B,
    );
    expect(r.mid).toBeCloseTo(2812.5, 4);
    expect(r.aboveAverage).toBe(true);
    expect(r.low).toBeCloseTo(2109.375, 3);
  });
});

describe("YouTube RPM (§5.2)", () => {
  it("blends geography and applies +40% mid-roll", () => {
    const r = youtube.calculate(
      { monthlyViews: 200000, longForm: true, usTrafficPct: 40, niche: "tech" },
      B,
    );
    expect(r.geoWeight).toBeCloseTo(1.24, 5); // 0.4*1.6 + 0.6
    expect(r.blendedRpm).toBeCloseTo(14.88, 5); // 12 * 1.24
    expect(r.rpmWithMidroll).toBeCloseTo(20.832, 5);
    expect(r.revenue).toBeCloseTo(4166.4, 2);
    expect(r.midrollUplift).toBeCloseTo(1190.4, 2);
  });
  it("no mid-roll bonus for short videos", () => {
    const r = youtube.calculate(
      { monthlyViews: 100000, longForm: false, usTrafficPct: 0, niche: "tech" },
      B,
    );
    expect(r.rpmWithMidroll).toBeCloseTo(r.blendedRpm, 5);
  });
});

describe("UGC Rate (§5.3)", () => {
  it("stacks platform, revision, and exclusivity multipliers", () => {
    // whitelist-30 mid 400; single platform ×1; 1 revision ×1.1; no excl ×1
    const r = ugc.calculate(
      { deliverables: 3, usageTier: "whitelist-30", platforms: ["tiktok"], revisions: "1", exclusivity: false },
      B,
    );
    expect(r.perVideo).toBeCloseTo(440, 5);
    expect(r.packageRate).toBeCloseTo(1320, 5);
  });
  it("adds multi-platform and exclusivity premiums", () => {
    const r = ugc.calculate(
      { deliverables: 1, usageTier: "whitelist-30", platforms: ["all"], revisions: "0", exclusivity: true },
      B,
    );
    // 400 × 1.2 × 1.0 × 1.25 = 600
    expect(r.perVideo).toBeCloseTo(600, 5);
  });
});

describe("Membership Planner (§5.4)", () => {
  it("computes gross, net, fee cost, and annual", () => {
    const r = membership.calculate({
      tiers: [
        { name: "A", price: 5, members: 100 },
        { name: "B", price: 15, members: 30 },
        { name: "C", price: 50, members: 8 },
      ],
      platform: "patreon",
      feePct: 8,
    });
    expect(r.grossMrr).toBe(1350);
    expect(r.netMrr).toBeCloseTo(1242, 5);
    expect(r.feeCost).toBeCloseTo(108, 5);
    expect(r.annualNet).toBeCloseTo(14904, 5);
  });
});

describe("Product Launch (§5.5)", () => {
  it("runs the traffic → conversion → abandon funnel", () => {
    const r = product.calculate(
      { productType: "mini-course", traffic: 10000, conversionRate: 2.5, price: 49, abandonRate: 65, affiliatePct: 0 },
      B,
    );
    expect(r.reachedCheckout).toBeCloseTo(250, 5);
    expect(r.completedSales).toBeCloseTo(87.5, 5);
    expect(r.grossRevenue).toBeCloseTo(4287.5, 5);
    expect(r.netRevenue).toBeCloseTo(4287.5, 5);
  });
  it("applies affiliate commission to net", () => {
    const r = product.calculate(
      { productType: "ebook", traffic: 1000, conversionRate: 10, price: 100, abandonRate: 0, affiliatePct: 20 },
      B,
    );
    expect(r.grossRevenue).toBeCloseTo(10000, 5);
    expect(r.netRevenue).toBeCloseTo(8000, 5);
  });
});

describe('Quit Your Job (§5.6)', () => {
  it("reverse-calculates required views for AdSense allocation", () => {
    const r = quit.calculate(
      {
        monthlyTarget: 4000,
        niche: "tech",
        allocations: { "youtube-adsense": 40, sponsorships: 30, ugc: 0, memberships: 15, "digital-products": 15, affiliate: 0 },
        currentIncome: 1000,
      },
      B,
    );
    expect(r.totalPct).toBe(100);
    const yt = r.plans.find((p) => p.source === "youtube-adsense")!;
    // income 1600 at RPM 12 → 1600/12*1000 ≈ 133333 views
    expect(yt.income).toBeCloseTo(1600, 5);
    expect(yt.metricValue).toBeCloseTo(133333.33, 1);
    expect(r.gap).toBe(3000);
    expect(r.plans).toHaveLength(4);
  });
});

describe("AI Cost (§5.7)", () => {
  it("computes spend, time value, ROI, and break-even", () => {
    const r = ai.calculate({
      tools: [
        { id: "a", name: "A", cost: 20, enabled: true },
        { id: "b", name: "B", cost: 20, enabled: true },
        { id: "c", name: "C", cost: 99, enabled: false },
      ],
      piecesPerMonth: 20,
      timeSavedPerPiece: 1.5,
      hourlyRate: 40,
    });
    expect(r.totalCost).toBe(40);
    expect(r.timeValueSaved).toBe(1200);
    expect(r.netRoi).toBe(1160);
    expect(r.costPerPiece).toBe(2);
    expect(r.breakEvenPieces).toBeCloseTo(0.6667, 3);
  });
});

describe("Affiliate ROI (v1.1)", () => {
  it("computes sales, revenue, EPC, and ROI", () => {
    const r = affiliate.calculate({
      niche: "tech",
      monthlyClicks: 5000,
      conversionRate: 2,
      avgOrderValue: 90,
      commission: 8,
      contentCost: 0,
    });
    expect(r.sales).toBeCloseTo(100, 5);
    expect(r.revenue).toBeCloseTo(720, 5);
    expect(r.epc).toBeCloseTo(0.144, 5);
    expect(r.roi).toBeNull();
  });
  it("computes ROI when a cost is given", () => {
    const r = affiliate.calculate({
      niche: "tech",
      monthlyClicks: 5000,
      conversionRate: 2,
      avgOrderValue: 90,
      commission: 8,
      contentCost: 360,
    });
    expect(r.net).toBeCloseTo(360, 5);
    expect(r.roi).toBeCloseTo(100, 5);
  });
});

describe("Usage Rights Multiplier (v1.1)", () => {
  it("adds term uplift only", () => {
    const r = usage.calculate(
      { baseFee: 1000, term: "6mo", exclusivity: false, paidAmplification: false },
      B,
    );
    expect(r.multiplier).toBeCloseTo(1.45, 5);
    expect(r.totalFee).toBeCloseTo(1450, 5);
    expect(r.uplift).toBeCloseTo(450, 5);
  });
  it("stacks term + exclusivity + paid amplification", () => {
    const r = usage.calculate(
      { baseFee: 1000, term: "perpetual", exclusivity: true, paidAmplification: true },
      B,
    );
    // 1 + 1.5 + 0.3 + 0.4 = 3.2
    expect(r.multiplier).toBeCloseTo(3.2, 5);
    expect(r.totalFee).toBeCloseTo(3200, 5);
  });
});

describe("Multi-Platform Bundler (v1.1)", () => {
  it("sums active lines and applies the bundle discount", () => {
    const r = bundler.calculate(bundler.defaultInputs);
    expect(r.activeCount).toBe(3);
    expect(r.subtotal).toBe(2900); // 1500 + 800 + 600
    expect(r.bundlePrice).toBeCloseTo(2610, 5); // 10% off
    expect(r.savings).toBeCloseTo(290, 5);
  });
});

describe("Blog RPM Forecaster (v1.1)", () => {
  it("weights network RPM by niche and geography", () => {
    const r = blog.calculate(
      { monthlyPageviews: 100000, niche: "tech", network: "adsense", usTrafficPct: 40 },
      B,
    );
    expect(r.geoWeight).toBeCloseTo(1.24, 5);
    expect(r.nicheWeight).toBeCloseTo(156 / 127, 5);
    expect(r.effectiveRpm).toBeCloseTo(12.1852, 3);
    expect(r.revenue).toBeCloseTo(1218.52, 1);
  });
});

describe("TikTok Creator Rewards (v1.2)", () => {
  it("blends RPM by geography", () => {
    const r = tiktok.calculate({ qualifiedViews: 1_000_000, usTrafficPct: 30 }, B);
    expect(r.geoWeight).toBeCloseTo(1.15, 5); // 0.3*1.5 + 0.7
    expect(r.blendedRpm).toBeCloseTo(0.805, 5); // 0.7 * 1.15
    expect(r.revenue).toBeCloseTo(805, 5);
  });
});

describe("Shorts / Reels Estimator (v1.2)", () => {
  it("applies platform RPM and geo weight", () => {
    const r = shortform.calculate(
      { monthlyViews: 2_000_000, platform: "youtube-shorts", usTrafficPct: 40 },
      B,
    );
    expect(r.geoWeight).toBeCloseTo(1.24, 5);
    expect(r.blendedRpm).toBeCloseTo(0.0992, 5); // 0.08 * 1.24
    expect(r.revenue).toBeCloseTo(198.4, 5);
  });
});

describe("Podcast Audio Ad (v1.2)", () => {
  it("multiplies downloads × slots × CPM × episodes", () => {
    const r = podcast.calculate(
      { downloadsPerEpisode: 5000, episodesPerMonth: 4, adType: "hostread", adSlots: 2 },
      B,
    );
    expect(r.revenuePerEpisode).toBeCloseTo(300, 5); // 5k/1k × 2 slots × $30
    expect(r.monthly).toBeCloseTo(1200, 5);
    expect(r.annual).toBeCloseTo(14400, 5);
  });
});

describe("Newsletter Simulator (v1.2)", () => {
  it("computes paid subs, MRR, and net after fees", () => {
    const r = newsletter.calculate({
      freeSubscribers: 10000,
      conversionRate: 6,
      monthlyPrice: 8,
      platformFeePct: 10,
    });
    expect(r.paidSubs).toBeCloseTo(600, 5);
    expect(r.grossMrr).toBeCloseTo(4800, 5);
    expect(r.netMrr).toBeCloseTo(4320, 5);
    expect(r.annualNet).toBeCloseTo(51840, 5);
  });
});

describe("Community Churn (v2.0)", () => {
  it("computes churn, lifetime, and LTV", () => {
    const r = churn.calculate({ startMembers: 500, newMembers: 60, churnedMembers: 25, arpu: 8 });
    expect(r.churnRate).toBeCloseTo(5, 5);
    expect(r.retentionRate).toBeCloseTo(95, 5);
    expect(r.netGrowth).toBe(35);
    expect(r.endMembers).toBe(535);
    expect(r.avgLifetimeMonths).toBeCloseTo(20, 5);
    expect(r.ltv).toBeCloseTo(160, 5);
  });
});

describe("Gear Depreciation (v2.0)", () => {
  it("straight-lines each item and totals", () => {
    const r = gear.calculate({
      items: [
        { name: "Camera", cost: 2000, lifeYears: 5 },
        { name: "Computer", cost: 2500, lifeYears: 4 },
        { name: "Lighting", cost: 800, lifeYears: 5 },
      ],
    });
    expect(r.totalCost).toBe(5300);
    expect(r.totalAnnual).toBeCloseTo(1185, 5); // 400 + 625 + 160
    expect(r.totalMonthly).toBeCloseTo(98.75, 5);
  });
});

describe("Self-Employment Tax (v2.0)", () => {
  it("applies SE base factor, SS, and Medicare", () => {
    const r = setax.calculate({ netIncome: 60000, incomeTaxRate: 12 });
    expect(r.seTax).toBeCloseTo(8477.73, 2); // 55410 × (0.124 + 0.029)
    expect(r.incomeTax).toBeCloseTo(7200, 5);
    expect(r.totalTax).toBeCloseTo(15677.73, 2);
    expect(r.quarterly).toBeCloseTo(3919.4325, 3);
  });
});

describe("Agency Commission (v2.0)", () => {
  it("subtracts commission and expenses", () => {
    const r = commission.calculate({ grossDeal: 5000, commissionRate: 20, expenses: 0 });
    expect(r.commission).toBeCloseTo(1000, 5);
    expect(r.netToCreator).toBeCloseTo(4000, 5);
    expect(r.takeHomePct).toBeCloseTo(80, 5);
  });
});

describe("Hook Retention (v2.0)", () => {
  it("scales reach by relative retention gain", () => {
    const r = hook.calculate({
      currentViews: 100000,
      currentRetention: 60,
      targetRetention: 75,
      rpm: 5,
    });
    expect(r.upliftFactor).toBeCloseTo(0.125, 5); // (15/60) × 0.5
    expect(r.additionalViews).toBeCloseTo(12500, 5);
    expect(r.additionalRevenue).toBeCloseTo(62.5, 5);
  });
});

describe("Repurposing Velocity (v2.0)", () => {
  it("multiplies pillars × derivatives × reach", () => {
    const r = repurposing.calculate({
      pillarsPerMonth: 4,
      derivativesPerPillar: 6,
      avgViewsPerDerivative: 5000,
      rpm: 4,
    });
    expect(r.totalDerivatives).toBe(24);
    expect(r.monthlyReach).toBe(120000);
    expect(r.revenue).toBeCloseTo(480, 5);
    expect(r.annualReach).toBe(1440000);
  });
});
