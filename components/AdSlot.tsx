"use client";

import { useEffect, useRef } from "react";

type Placement = "sidebar" | "between-section" | "mobile-banner";

// Manual ad unit slot ids per placement (set in env after creating units in AdSense).
const SLOT_IDS: Record<Placement, string | undefined> = {
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  "between-section": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN,
  "mobile-banner": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE,
};

const SIZES: Record<Placement, { className: string; format: string }> = {
  sidebar: { className: "w-[300px] h-[600px]", format: "" },
  "between-section": { className: "w-full max-w-[728px] h-[90px] mx-auto", format: "" },
  "mobile-banner": { className: "w-[320px] h-[100px] mx-auto", format: "" },
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Manual AdSense unit (§2.7, §6.3). Renders a labelled placeholder when AdSense
 * is not configured so the layout is correct before keys are set. Never placed
 * inside a form, result card, nav, or modal.
 */
export function AdSlot({ placement }: { placement: Placement }) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const slotId = SLOT_IDS[placement];
  const size = SIZES[placement];
  const configured = Boolean(ADSENSE_CLIENT && slotId);

  useEffect(() => {
    if (!configured || pushed.current) return;
    try {
      // @ts-expect-error — adsbygoogle is injected by the global script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense not ready — ignore */
    }
  }, [configured]);

  if (!configured) {
    return (
      <div
        className={`border border-dashed border-cs-border flex items-center justify-center text-cs-fg-dim font-mono text-cs-12 uppercase tracking-widest ${size.className}`}
        aria-hidden
      >
        Ad · {placement}
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${size.className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slotId}
    />
  );
}
