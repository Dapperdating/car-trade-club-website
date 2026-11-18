// Parco auto: data and pure helpers shared by server and client components.
// Data: data/parco-auto.json, the illustrative set from the claude.ai artifact (Costa, 2026-11-18).
import data from "../../data/parco-auto.json";

export type ParcoStatus = "disponibile" | "trattativa" | "venduta";
export type StatusFilter = "all" | ParcoStatus;
export type ParcoPhoto = { src: string; thumb: string };
export type ParcoCar = {
  noFrontCover?: boolean; code: string; ref: string | null; make: string; model: string; version: string;
  year: number; km: number; fuel: string; price: number; salePriceConfirmed?: boolean; priceKind?: "asking"; market: number | null;
  status: ParcoStatus; city: string; days: number | null; added: number; gallery: ParcoPhoto[];
};

export const CARS: readonly ParcoCar[] = (data as unknown as { cars: ParcoCar[] }).cars;

// Real figures from the CRM import (data/cars.json): 234 cars, valuations summing to €2,690,307.
export const TOTAL_CARS_LABEL = "234";
export const TOTAL_VALUE_LABEL = "2,7 mln €";
export const FEATURED_CODE = "CTC-0PRT";
export const PAGE_SIZE = 24;
export const TICKER_SIZE = 18;
export const CONTACT_EMAIL = "mattia@cartradeclub.com";

// Illustrative-data disclosures. Tests assert these; never remove or reword them.
export const DISCLAIMER_INVENTORY = [
  "Selezione illustrativa di auto trattate dal network.",
  "Prezzi, margini e disponibilità sono indicativi.",
] as const;
export const DISCLAIMER_FOOTER = "Selezione illustrativa: prezzi, margini e disponibilità indicativi.";
export const LEGAL_LINE = "© 2026 CAR TRADE CLUB LIMITED · Company No. 17413707 · London, United Kingdom";

// URL query params. Lane B owns status/make/fuel/sort, Lane C owns auto.
export const Q = { auto: "auto", status: "stato", make: "marca", fuel: "alimentazione", sort: "ordina" } as const;
export const OPEN_ATTR = "data-pa-open";
export const carHref = (code: string) => `?${Q.auto}=${encodeURIComponent(code)}`;

export const STATUS_LABEL: Record<ParcoStatus, string> = { venduta: "Venduta", disponibile: "Disponibile", trattativa: "In trattativa" };
export const STATUS_FILTERS: readonly StatusFilter[] = ["all", "disponibile", "trattativa", "venduta"];
export const RANK: Record<ParcoStatus, number> = { disponibile: 0, trattativa: 1, venduta: 2 };

export const eur = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
export const kmf = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " km";
export function priceLabel(c: ParcoCar) {
  if (c.priceKind === "asking") return "Prezzo richiesto dal privato";
  return c.salePriceConfirmed ? "Prezzo di vendita" : "Prezzo concordato";
}
export const gain = (c: ParcoCar) => (c.market ?? c.price) - c.price;
export const signed = (n: number) => n > 0 ? "+" : "";
export const gainPct = (c: ParcoCar) => (c.price ? Math.round((gain(c) / c.price) * 100) : 0);
export const carTitle = (c: ParcoCar) => `${c.make} ${c.model}`;


export type SortKey = "recent" | "margin" | "priceAsc" | "priceDesc" | "year";
export const SORT_KEYS: readonly SortKey[] = ["recent", "margin", "priceAsc", "priceDesc", "year"];
export const SORT_LABEL: Record<SortKey, string> = {
  recent: "Più recenti", margin: "Margine più alto", priceAsc: "Prezzo crescente",
  priceDesc: "Prezzo decrescente", year: "Anno più recente",
};
const SORTS: Record<SortKey, (a: ParcoCar, b: ParcoCar) => number> = {
  recent: (a, b) => a.added - b.added,
  margin: (a, b) => Number(a.market === null) - Number(b.market === null) || gain(b) / b.price - gain(a) / a.price,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  year: (a, b) => b.year - a.year,
};
/** Status rank first (available, negotiating, sold), then the chosen key. Same as the artifact. */
export function sortCars(list: readonly ParcoCar[], key: SortKey): ParcoCar[] {
  return [...list].sort((a, b) => RANK[a.status] - RANK[b.status] || SORTS[key](a, b));
}
/** Empty make/fuel means "any". */
export function filterCars(list: readonly ParcoCar[], f: { status: StatusFilter; make: string; fuel: string }): ParcoCar[] {
  return list.filter((c) => (f.status === "all" || c.status === f.status) && (!f.make || c.make === f.make) && (!f.fuel || c.fuel === f.fuel));
}
export const makesOf = (list: readonly ParcoCar[]) => [...new Set(list.map((c) => c.make))].sort((a, b) => a.localeCompare(b, "it"));
export const fuelsOf = (list: readonly ParcoCar[]) => [...new Set(list.map((c) => c.fuel))].sort();
export function countByStatus(list: readonly ParcoCar[]): Record<StatusFilter, number> {
  const out: Record<StatusFilter, number> = { all: list.length, disponibile: 0, trattativa: 0, venduta: 0 };
  for (const c of list) out[c.status] += 1;
  return out;
}
export const findCar = (code: string | null | undefined) => (code ? CARS.find((c) => c.code === code) ?? null : null);

export function getFeatured(): ParcoCar | null {
  const f = findCar(FEATURED_CODE);
  return (f && f.status === "disponibile" ? f : CARS.find((c) => c.status === "disponibile")) ?? null;
}
export function getTicker(): ParcoCar[] {
  return CARS.filter((c) => c.status === "venduta").sort((a, b) => a.added - b.added).slice(0, TICKER_SIZE);
}
/** marginLabel e.g. "+24,1%" (mean of gain/price over all cars); daysLabel e.g. "8 giorni" (mean days over sold cars). */
export function getStats(): { marginLabel: string; daysLabel: string } {
  const sold = CARS.filter((c) => c.status === "venduta" && c.days !== null);
  const valued = CARS.filter(c => c.market !== null && c.priceKind !== "asking");
  const avgMargin = valued.reduce((s, c) => s + gain(c) / c.price, 0) / Math.max(valued.length, 1) * 100;
  const avgDays = sold.reduce((s, c) => s + (c.days ?? 0), 0) / Math.max(sold.length, 1);
  return { marginLabel: "+" + avgMargin.toFixed(1).replace(".", ",") + "%", daysLabel: Math.round(avgDays) + " giorni" };
}
