import type { ToolMeta } from "@/types";
import { meta as sponsorshipRate } from "./sponsorship-rate/calc";
import { meta as youtubeRpm } from "./youtube-rpm/calc";
import { meta as ugcRate } from "./ugc-rate/calc";
import { meta as membershipPlanner } from "./membership-planner/calc";
import { meta as productLaunch } from "./product-launch/calc";
import { meta as quitJob } from "./quit-job/calc";
import { meta as aiCost } from "./ai-cost/calc";
import { meta as affiliateRoi } from "./affiliate-roi/calc";
import { meta as usageRights } from "./usage-rights/calc";
import { meta as platformBundler } from "./platform-bundler/calc";
import { meta as blogRpm } from "./blog-rpm/calc";
import { meta as tiktokRewards } from "./tiktok-rewards/calc";
import { meta as shortformEstimator } from "./shortform-estimator/calc";
import { meta as podcastAds } from "./podcast-ads/calc";
import { meta as newsletterSim } from "./newsletter-sim/calc";

/** Tool registry (§3). Order = display order within categories. */
export const TOOL_METAS: ToolMeta[] = [
  // v1.0
  sponsorshipRate,
  youtubeRpm,
  ugcRate,
  membershipPlanner,
  productLaunch,
  quitJob,
  aiCost,
  // v1.1
  affiliateRoi,
  usageRights,
  platformBundler,
  blogRpm,
  // v1.2
  tiktokRewards,
  shortformEstimator,
  podcastAds,
  newsletterSim,
];

export function getToolMeta(slug: string): ToolMeta | undefined {
  return TOOL_METAS.find((t) => t.slug === slug);
}
