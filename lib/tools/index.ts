import type { ToolMeta } from "@/types";
import { meta as sponsorshipRate } from "./sponsorship-rate/calc";
import { meta as youtubeRpm } from "./youtube-rpm/calc";
import { meta as ugcRate } from "./ugc-rate/calc";
import { meta as membershipPlanner } from "./membership-planner/calc";
import { meta as productLaunch } from "./product-launch/calc";
import { meta as quitJob } from "./quit-job/calc";
import { meta as aiCost } from "./ai-cost/calc";

/** v1.0 MVP tool registry (§3). Order = display order within categories. */
export const TOOL_METAS: ToolMeta[] = [
  sponsorshipRate,
  youtubeRpm,
  ugcRate,
  membershipPlanner,
  productLaunch,
  quitJob,
  aiCost,
];

export function getToolMeta(slug: string): ToolMeta | undefined {
  return TOOL_METAS.find((t) => t.slug === slug);
}
