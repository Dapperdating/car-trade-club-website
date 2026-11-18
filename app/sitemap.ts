import type { MetadataRoute } from "next";

// Omit lastModified until it can represent an actual content update.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/privacy", "/terms", "/approvvigionamento-auto-usate-concessionari", "/acquistare-auto-da-privati", "/parco-auto"].map(path => ({url: `https://cartradeclub.com${path}`}));
}
