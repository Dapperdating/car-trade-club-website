import type { Metadata } from "next";
import "./parco.css";
import "./sections.css";
import "./inventory.css";
import "./dialog.css";
import { CARS, getFeatured, getStats, getTicker } from "../lib/parco";
import { Band, Closing, Hero, HowItWorks, ParcoFooter, ParcoHeader, Stats, Ticker } from "./sections";
import ParcoInventory from "./ParcoInventory";
import CarDialog from "./CarDialog";
import { buildParcoJsonLd } from "./jsonld";

const DESCRIPTION = "Le auto negoziate dal network Car Trade Club: foto, prezzo concordato con il privato e margine.";

export const metadata: Metadata = {
  title: "Parco auto",
  description: DESCRIPTION,
  alternates: { canonical: "/parco-auto" },
  openGraph: { type: "website", locale: "it_IT", url: "/parco-auto", siteName: "Car Trade Club", title: "Parco auto | Car Trade Club", description: DESCRIPTION, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Car Trade Club" }] },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ParcoAutoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const openCars = CARS.filter(c => c.status !== "venduta");
  const initialCode = openCars.find(c => c.code === sp.auto)?.code ?? null;
  const cars = [...CARS];
  const jsonLd = JSON.stringify(buildParcoJsonLd(cars)).replace(/</g, "\\u003c");
  return (
    <div className="pa">
      <a className="pa-skip" href="#auto">Vai alle auto</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ParcoHeader />
      <main id="inizio">
        <Hero featured={getFeatured()} />
        <Stats stats={getStats()} />
        <Ticker cars={getTicker()} />
        <Band />
        <ParcoInventory cars={cars} />
        <HowItWorks />
        <Closing />
      </main>
      <ParcoFooter />
      <CarDialog cars={openCars} initialCode={initialCode} />
    </div>
  );
}
