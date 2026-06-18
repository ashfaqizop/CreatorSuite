import { describe, it, expect } from "vitest";
import { SEED_BUNDLE } from "@/lib/benchmarks/seed";

import * as sponsorship from "@/lib/tools/sponsorship-rate/calc";
import * as youtube from "@/lib/tools/youtube-rpm/calc";
import * as ugc from "@/lib/tools/ugc-rate/calc";
import * as membership from "@/lib/tools/membership-planner/calc";
import * as product from "@/lib/tools/product-launch/calc";
import * as quit from "@/lib/tools/quit-job/calc";
import * as ai from "@/lib/tools/ai-cost/calc";

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
