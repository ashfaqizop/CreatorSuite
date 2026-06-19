import type { ToolReport } from "@/types";
import * as sponsorshipRate from "./sponsorship-rate/calc";
import * as youtubeRpm from "./youtube-rpm/calc";
import * as ugcRate from "./ugc-rate/calc";
import * as membershipPlanner from "./membership-planner/calc";
import * as productLaunch from "./product-launch/calc";
import * as quitJob from "./quit-job/calc";
import * as aiCost from "./ai-cost/calc";
import * as affiliateRoi from "./affiliate-roi/calc";
import * as usageRights from "./usage-rights/calc";
import * as platformBundler from "./platform-bundler/calc";
import * as blogRpm from "./blog-rpm/calc";
import * as tiktokRewards from "./tiktok-rewards/calc";
import * as shortformEstimator from "./shortform-estimator/calc";
import * as podcastAds from "./podcast-ads/calc";
import * as newsletterSim from "./newsletter-sim/calc";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ReportBuilder = (inputs: any, result: any) => ToolReport;

/** Rebuilds a tool's report from stored inputs/results (for history + rate card). */
export const REPORT_BUILDERS: Record<string, ReportBuilder> = {
  "sponsorship-rate": sponsorshipRate.buildReport,
  "youtube-rpm": youtubeRpm.buildReport,
  "ugc-rate": ugcRate.buildReport,
  "membership-planner": membershipPlanner.buildReport,
  "product-launch": productLaunch.buildReport,
  "quit-job": quitJob.buildReport,
  "ai-cost": aiCost.buildReport,
  "affiliate-roi": affiliateRoi.buildReport,
  "usage-rights": usageRights.buildReport,
  "platform-bundler": platformBundler.buildReport,
  "blog-rpm": blogRpm.buildReport,
  "tiktok-rewards": tiktokRewards.buildReport,
  "shortform-estimator": shortformEstimator.buildReport,
  "podcast-ads": podcastAds.buildReport,
  "newsletter-sim": newsletterSim.buildReport,
};

export function buildReportFor(
  slug: string,
  inputs: unknown,
  result: unknown,
): ToolReport | null {
  const builder = REPORT_BUILDERS[slug];
  if (!builder) return null;
  try {
    return builder(inputs, result);
  } catch {
    return null;
  }
}
