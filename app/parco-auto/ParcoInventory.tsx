"use client";
// Parco auto inventory: heading, filters (status, make, fuel), sort, grid and "Mostra altre".
// Server-rendered with the default state; URL params are applied only after mount (no hydration mismatch).
import { useEffect, useMemo, useState } from "react";
import type { ParcoCar, SortKey, StatusFilter } from "../lib/parco";
import {
  DISCLAIMER_INVENTORY, PAGE_SIZE, Q, SORT_KEYS, SORT_LABEL, STATUS_FILTERS, STATUS_LABEL,
  priceLabel, signed, carHref, carTitle, countByStatus, eur, filterCars, fuelsOf, gain, kmf, makesOf, sortCars,
} from "../lib/parco";

type State = { status: StatusFilter; make: string; fuel: string; sort: SortKey; shown: number };
type Filters = Omit<State, "shown">;

const INITIAL: State = { status: "all", make: "", fuel: "", sort: "recent", shown: PAGE_SIZE };

const TAB_LABEL: Record<StatusFilter, string> = {
  all: "Tutte", disponibile: "Disponibili", trattativa: "In trattativa", venduta: "Vendute",
};

/** Write only this lane's four params; everything else (e.g. `auto`, owned by the dialog) is preserved. */
function writeUrl(f: Filters) {
  const url = new URL(window.location.href);
  const set = (key: string, value: string, fallback: string) => {
    if (value && value !== fallback) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  };
  set(Q.status, f.status, INITIAL.status);
  set(Q.make, f.make, "");
  set(Q.fuel, f.fuel, "");
  set(Q.sort, f.sort, INITIAL.sort);
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
}

export default function ParcoInventory({ cars }: { cars: ParcoCar[] }) {
  const [state, setState] = useState<State>(INITIAL);
  const makes = useMemo(() => makesOf(cars), [cars]);
  const fuels = useMemo(() => fuelsOf(cars), [cars]);
  const counts = useMemo(() => countByStatus(cars), [cars]);

  // After hydration: adopt valid params from the URL. Never read the URL during render.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const status = sp.get(Q.status) as StatusFilter | null;
    const make = sp.get(Q.make);
    const fuel = sp.get(Q.fuel);
    const sort = sp.get(Q.sort) as SortKey | null;
    const next: State = {
      status: status && STATUS_FILTERS.includes(status) ? status : INITIAL.status,
      make: make && makes.includes(make) ? make : "",
      fuel: fuel && fuels.includes(fuel) ? fuel : "",
      sort: sort && SORT_KEYS.includes(sort) ? sort : INITIAL.sort,
      shown: PAGE_SIZE,
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sync from the URL after hydration
    setState(next);
    writeUrl(next); // drops invalid values, keeps everything else
  }, [makes, fuels]);

  // A filter or sort change resets the page size and mirrors the filters into the URL.
  const change = (patch: Partial<Filters>) => {
    const next: State = { ...state, ...patch, shown: PAGE_SIZE };
    setState(next);
    writeUrl(next);
  };

  const list = useMemo(
    () => sortCars(filterCars(cars, { status: state.status, make: state.make, fuel: state.fuel }), state.sort),
    [cars, state.status, state.make, state.fuel, state.sort],
  );
  const totalMarket = list.reduce((s, c) => s + (c.market ?? 0), 0);
  const remaining = list.length - state.shown;

  return (
    <section className="pa-inv" id="auto">
      <div className="pa-wrap">
        <div className="pa-inv__head">
          <div>
            <p className="pa-eyebrow">Parco auto del network</p>
            <h2>Le auto passate da noi.</h2>
            <p>Citycar, SUV, cabrio e youngtimer da privati in tutta la Lombardia. Apri una scheda per vedere foto e dettagli sul prezzo.</p>
          </div>
          <p className="pa-note">{DISCLAIMER_INVENTORY[0]}<br />{DISCLAIMER_INVENTORY[1]}</p>
        </div>

        <div className="pa-toolbar" role="group" aria-label="Filtra le auto">
          <div className="pa-seg">
            {STATUS_FILTERS.map((s) => (
              <button key={s} type="button" aria-pressed={state.status === s} onClick={() => change({ status: s })}>
                {TAB_LABEL[s]}<span className="pa-seg__c">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="pa-selects">
            <select className="pa-select" aria-label="Marca" value={state.make} onChange={(e) => change({ make: e.target.value })}>
              <option value="">Tutte le marche</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="pa-select" aria-label="Alimentazione" value={state.fuel} onChange={(e) => change({ fuel: e.target.value })}>
              <option value="">Ogni alimentazione</option>
              {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select className="pa-select" aria-label="Ordina" value={state.sort} onChange={(e) => change({ sort: e.target.value as SortKey })}>
              {SORT_KEYS.map((k) => <option key={k} value={k}>{SORT_LABEL[k]}</option>)}
            </select>
          </div>
          <p className="pa-count" aria-live="polite">
            {list.length ? `${list.length} auto · ${eur(totalMarket)} di valore di mercato` : "0 auto"}
          </p>
        </div>

        <div className="pa-grid">
          {list.length ? (
            list.slice(0, state.shown).map((c) => {
              const title = carTitle(c);
              const sold = c.status === "venduta";
              const Card = sold ? "article" : "a";
              return (
                <Card key={c.code} className="pa-card" {...(sold ? {} : { href: carHref(c.code), "data-pa-open": c.code })}>
                  {c.noFrontCover ? <p className="pa-no-cover-status">{STATUS_LABEL[c.status]}</p> : <div className="pa-card__ph">
                    <img src={c.gallery[0]?.thumb} alt={`${title} ${c.year}`} loading="lazy" width={560} height={420} />
                    {!sold && <span className={`pa-badge pa-badge--${c.status}`}>{STATUS_LABEL[c.status]}</span>}
                    {sold ? <strong className="pa-sold-mark">Venduta</strong> : <span className="pa-ph-count pa-num">{c.gallery.length} foto</span>}
                  </div>}
                  <div className="pa-card__body">
                    <div className="pa-card__where"><span>{c.city}</span><span className="pa-card__code">{c.code}</span></div>
                    <p className="pa-card__title">{title}</p>
                    <div className="pa-card__ver">{c.version}</div>
                    <div className="pa-card__facts">
                      <span className="pa-chip">{c.year}</span>
                      <span className="pa-chip">{kmf(c.km)}</span>
                      <span className="pa-chip">{c.fuel}</span>
                    </div>
                    <div className="pa-card__price">
                      <div><small>{priceLabel(c)}</small><strong>{eur(c.price)}</strong></div>
                      {c.market !== null && (c.priceKind === "asking" ? <span>Stima {eur(c.market)}</span> : <span className="pa-gain-pill">{signed(gain(c))}{eur(gain(c))} margine</span>)}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="pa-empty">{"Nessuna auto con questi filtri. Prova a togliere la marca o l'alimentazione."}</div>
          )}
        </div>
        <div className="pa-more">
          <button
            className="pa-btn pa-btn--outline"
            type="button"
            hidden={remaining <= 0}
            onClick={() => setState((s) => ({ ...s, shown: s.shown + PAGE_SIZE }))}
          >
            {`Mostra altre ${Math.min(PAGE_SIZE, Math.max(remaining, 0))} auto`}
          </button>
        </div>
      </div>
    </section>
  );
}
