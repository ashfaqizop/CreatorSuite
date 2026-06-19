import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { TOOL_METAS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/guides", "/changelog", "/about", "/privacy", "/terms"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    }),
  );

  const toolRoutes = TOOL_METAS.filter((t) => t.enabled).map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guideRoutes = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...toolRoutes, ...guideRoutes];
}
