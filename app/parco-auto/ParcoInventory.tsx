"use client";
import type { ParcoCar } from "../lib/parco";
import { DISCLAIMER_INVENTORY } from "../lib/parco";

export default function ParcoInventory({ cars }: { cars: ParcoCar[] }) {
  return <section className="pa-inv" id="auto" data-count={cars.length}><div className="pa-wrap"><p className="pa-note">{DISCLAIMER_INVENTORY[0]}<br />{DISCLAIMER_INVENTORY[1]}</p></div></section>;
}
