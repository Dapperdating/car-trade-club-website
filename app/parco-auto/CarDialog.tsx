"use client";
// Parco auto car dialog (Lane C). The only code that opens cars: any element with data-pa-open="CODE"
// (hero deal card, ticker, grid cards) is handled by the delegated click listener below.
// History: a click pushes ?auto=CODE (other params kept); Back/Forward read it; closing strips it with replaceState.
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { flushSync } from "react-dom";
import type { ParcoCar, ParcoStatus } from "../lib/parco";
import { priceLabel, signed, OPEN_ATTR, Q, STATUS_LABEL, carTitle, eur, gain, gainPct, kmf } from "../lib/parco";

const STATUS_LINE: Record<ParcoStatus, (c: ParcoCar) => string> = {
  venduta: (c) => `Venduta a un concessionario del network in ${c.days} giorni.`,
  disponibile: (c) => `Disponibile ora per i concessionari della zona di ${c.city}.`,
  trattativa: () => "Trattativa in corso.",
};

/** The current URL with `auto` set to `code` (or removed when null); every other param and the hash kept. */
function urlWithCar(code: string | null): string {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set(Q.auto, code);
  else url.searchParams.delete(Q.auto);
  return url.toString();
}

export default function CarDialog({ cars, initialCode }: { cars: ParcoCar[]; initialCode: string | null }) {
  const [current, setCurrent] = useState<ParcoCar | null>(() => cars.find((c) => c.code === initialCode) ?? null);
  const [idx, setIdx] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const currentRef = useRef<ParcoCar | null>(current);
  const carsRef = useRef(cars);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    carsRef.current = cars;
    currentRef.current = current;
  });

  // Deep link: ?auto=CODE (validated by page.tsx) opens on load without adding a history entry.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (initialCode && dlg && !dlg.open) dlg.showModal();
    // Mount only: later prop changes (RSC re-render on popstate) are handled by the popstate listener.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const find = (code: string | null) => (code ? carsRef.current.find((c) => c.code === code) ?? null : null);

    function show(car: ParcoCar, opener: Element | null) {
      const dlg = dialogRef.current;
      if (!dlg) return;
      // Render the new car before showModal() so the browser's initial focus lands inside real content.
      flushSync(() => {
        setCurrent(car);
        setIdx(0);
      });
      if (!dlg.open) {
        openerRef.current = opener instanceof HTMLElement && opener !== document.body ? opener : null;
        dlg.showModal();
      }
      dlg.scrollTop = 0;
    }

    function onClick(e: globalThis.MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target instanceof Element ? e.target.closest(`[${OPEN_ATTR}]`) : null;
      const car = find(el?.getAttribute(OPEN_ATTR) ?? null);
      if (!el || !car) return;
      e.preventDefault();
      // Safari doesn't focus links on click, so fall back to the clicked element for focus return.
      const active = document.activeElement;
      show(car, active && active !== document.body ? active : el);
      window.history.pushState(null, "", urlWithCar(car.code));
    }

    function onPopState() {
      const dlg = dialogRef.current;
      if (!dlg) return;
      const car = find(new URL(window.location.href).searchParams.get(Q.auto));
      if (car) {
        if (!dlg.open || currentRef.current?.code !== car.code) show(car, document.activeElement);
      } else if (dlg.open) {
        dlg.close();
      }
    }

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  function onClose() {
    if (new URL(window.location.href).searchParams.has(Q.auto)) {
      window.history.replaceState(window.history.state, "", urlWithCar(null));
    }
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  }

  function onBackdrop(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) e.currentTarget.close();
  }

  function onCta() {
    // Strip ?auto= before the anchor navigates, so "#contatti" resolves without it and the
    // fragment navigation's popstate doesn't reopen the car. Focus goes to the anchor target, not the card.
    window.history.replaceState(window.history.state, "", urlWithCar(null));
    openerRef.current = null;
    dialogRef.current?.close();
  }

  const n = current?.gallery.length ?? 0;
  const go = (i: number) => {
    if (n) setIdx(((i % n) + n) % n);
  };

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.target instanceof Element && e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowRight") go(idx + 1);
    if (e.key === "ArrowLeft") go(idx - 1);
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
  }

  const photo = current && n ? current.gallery[Math.min(idx, n - 1)] : null;
  const multi = n > 1;

  return (
    <dialog
      ref={dialogRef}
      className="pa-dlg"
      id="pa-dlg"
      aria-labelledby="pa-dlg-title"
      onClose={onClose}
      onClick={onBackdrop}
      onKeyDown={onKeyDown}
    >
      {current && (
        <div className="pa-dlg__grid">
          <div className="pa-gal">
            <div className="pa-gal__main" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.src} alt={`${carTitle(current)}, foto ${idx + 1} di ${n}`} width={1024} height={768} />
              )}
              {multi && (
                <>
                  <button className="pa-gal__nav pa-gal__nav--prev" type="button" aria-label="Foto precedente" onClick={() => go(idx - 1)}>‹</button>
                  <button className="pa-gal__nav pa-gal__nav--next" type="button" aria-label="Foto successiva" onClick={() => go(idx + 1)}>›</button>
                </>
              )}
              <span className="pa-gal__idx pa-num">{n ? `${idx + 1} / ${n}` : "0 / 0"}</span>
            </div>
            {multi && (
              <div className="pa-gal__thumbs">
                {current.gallery.map((g, j) => (
                  <button key={g.thumb + j} type="button" aria-label={`Foto ${j + 1}`} aria-current={j === idx} onClick={() => setIdx(j)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.thumb} alt="" width={560} height={420} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pa-dlg__info">
            <div className="pa-dlg__top">
              <div>
                <p className="pa-eyebrow">{current.code} · {current.city}</p>
                <h2 className="pa-dlg__title" id="pa-dlg-title">{carTitle(current)}</h2>
                <p className="pa-dlg__ver">{current.version}</p>
              </div>
              <button className="pa-dlg__x" type="button" aria-label="Chiudi" onClick={() => dialogRef.current?.close()}>✕</button>
            </div>
            <dl className="pa-dlg__facts">
              <div><dt>Anno</dt><dd>{current.year}</dd></div>
              <div><dt>Chilometri</dt><dd>{kmf(current.km)}</dd></div>
              <div><dt>Alimentazione</dt><dd>{current.fuel}</dd></div>
              <div><dt>Zona</dt><dd>{current.city}</dd></div>
              <div><dt>Stato</dt><dd>{STATUS_LABEL[current.status]}</dd></div>
              <div><dt>Foto</dt><dd>{n} foto</dd></div>
            </dl>
            <div className="pa-dlg__panel">
              <small>{priceLabel(current)}</small>
              <div className="pa-dlg__big">{eur(current.price)}</div>
              {current.market !== null && <div className="pa-dlg__row"><span>Valore di mercato stimato</span><b>{eur(current.market)}</b></div>}
              {current.market !== null && current.priceKind !== "asking" && <><div className="pa-dlg__row"><span>Margine lordo stimato</span><b className="pa-dlg__lime">{signed(gain(current))}{eur(gain(current))} ({signed(gainPct(current))}{gainPct(current)}%)</b></div>
              <p className="pa-dlg__foot">Margine lordo: valore di mercato meno prezzo d&apos;acquisto. Esclusi trasporto, passaggio e ricondizionamento.</p></>}
            </div>
            <p className="pa-dlg__status">{STATUS_LINE[current.status](current)}</p>
            <a className="pa-btn pa-btn--lime" href="#contatti" onClick={onCta}>Voglio auto come questa →</a>
          </div>
        </div>
      )}
    </dialog>
  );
}
