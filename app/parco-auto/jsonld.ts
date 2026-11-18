import type { ParcoCar } from "../lib/parco";

export function buildParcoJsonLd(cars: readonly ParcoCar[]): Record<string, unknown> {
  return { "@context": "https://schema.org", "@type": "CollectionPage", url: "https://cartradeclub.com/parco-auto", name: "Parco auto Car Trade Club", numberOfItems: cars.length };
}
