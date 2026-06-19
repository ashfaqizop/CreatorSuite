"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";

type ToolComponent = ComponentType<{ bench: BenchmarkBundle }>;

// Each tool view is code-split via next/dynamic so a tool page ships only its
// own bundle. ssr disabled — tools are interactive client calculators.
const REGISTRY: Record<string, ToolComponent> = {
  "sponsorship-rate": dynamic(() => import("@/lib/tools/sponsorship-rate/Tool"), { ssr: false }),
  "youtube-rpm": dynamic(() => import("@/lib/tools/youtube-rpm/Tool"), { ssr: false }),
  "ugc-rate": dynamic(() => import("@/lib/tools/ugc-rate/Tool"), { ssr: false }),
  "membership-planner": dynamic(() => import("@/lib/tools/membership-planner/Tool"), { ssr: false }),
  "product-launch": dynamic(() => import("@/lib/tools/product-launch/Tool"), { ssr: false }),
  "quit-job": dynamic(() => import("@/lib/tools/quit-job/Tool"), { ssr: false }),
  "ai-cost": dynamic(() => import("@/lib/tools/ai-cost/Tool"), { ssr: false }),
  "affiliate-roi": dynamic(() => import("@/lib/tools/affiliate-roi/Tool"), { ssr: false }),
  "usage-rights": dynamic(() => import("@/lib/tools/usage-rights/Tool"), { ssr: false }),
  "platform-bundler": dynamic(() => import("@/lib/tools/platform-bundler/Tool"), { ssr: false }),
  "blog-rpm": dynamic(() => import("@/lib/tools/blog-rpm/Tool"), { ssr: false }),
  "tiktok-rewards": dynamic(() => import("@/lib/tools/tiktok-rewards/Tool"), { ssr: false }),
  "shortform-estimator": dynamic(() => import("@/lib/tools/shortform-estimator/Tool"), { ssr: false }),
  "podcast-ads": dynamic(() => import("@/lib/tools/podcast-ads/Tool"), { ssr: false }),
  "newsletter-sim": dynamic(() => import("@/lib/tools/newsletter-sim/Tool"), { ssr: false }),
};

export function ToolHost({
  slug,
  bench,
}: {
  slug: string;
  bench: BenchmarkBundle;
}) {
  const Comp = REGISTRY[slug];
  if (!Comp) {
    return (
      <p className="font-mono text-cs-fg-muted">Tool not found: {slug}</p>
    );
  }
  return <Comp bench={bench} />;
}
