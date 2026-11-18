"use client";
import type { ParcoCar } from "../lib/parco";
import { carTitle } from "../lib/parco";

export default function CarDialog({ cars, initialCode }: { cars: ParcoCar[]; initialCode: string | null }) {
  const car = cars.find((c) => c.code === initialCode) ?? null;
  return <dialog className="pa-dlg" id="pa-dlg" aria-labelledby="pa-dlg-title">{car && <h2 id="pa-dlg-title">{carTitle(car)}</h2>}</dialog>;
}
