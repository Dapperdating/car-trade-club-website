import type { ParcoCar } from "../lib/parco";

const ORIGIN = "https://cartradeclub.com";

// Structured data for /parco-auto. Illustrative set: deliberately no offers, price or priceCurrency.
export function buildParcoJsonLd(cars: readonly ParcoCar[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${ORIGIN}/parco-auto#page`,
    url: `${ORIGIN}/parco-auto`,
    name: "Parco auto Car Trade Club",
    inLanguage: "it-IT",
    isPartOf: { "@id": `${ORIGIN}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cars.length,
      itemListElement: cars.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: c.status === "venduta" ? undefined : `${ORIGIN}/parco-auto?auto=${encodeURIComponent(c.code)}`,
        item: {
          "@type": "Car",
          name: `${c.make} ${c.model}`,
          brand: { "@type": "Brand", name: c.make },
          model: c.model,
          vehicleModelDate: String(c.year),
          fuelType: c.fuel,
          mileageFromOdometer: { "@type": "QuantitativeValue", value: c.km, unitCode: "KMT" },
          image: c.noFrontCover ? undefined : `${ORIGIN}${c.gallery[0].src}`,
        },
      })),
    },
  };
}
