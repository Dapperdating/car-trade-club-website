import type { ParcoCar } from "../lib/parco";
import { DISCLAIMER_FOOTER, LEGAL_LINE, TOTAL_CARS_LABEL } from "../lib/parco";

export function ParcoHeader() { return null; }
export function Hero({ featured }: { featured: ParcoCar }) {
  return <section className="pa-hero" data-featured={featured.code}><div className="pa-wrap"><h1>{TOTAL_CARS_LABEL} auto trattate.<span>Tutte già negoziate.</span></h1></div></section>;
}
export function Stats({ stats }: { stats: { marginLabel: string; daysLabel: string } }) { void stats; return null; }
export function Ticker({ cars }: { cars: ParcoCar[] }) { void cars; return null; }
export function Band() { return null; }
export function HowItWorks() { return null; }
export function Closing() { return null; }
export function ParcoFooter() {
  return <footer className="pa-footer"><div className="pa-wrap"><span>{LEGAL_LINE}</span><span>{DISCLAIMER_FOOTER}</span></div></footer>;
}
