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
