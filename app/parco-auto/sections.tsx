// Parco auto: static sections (Lane A). Ported from docs/reference/parco-auto-artifact.html.
import Link from "next/link";
import type { ParcoCar } from "../lib/parco";
import {
  CONTACT_EMAIL, DISCLAIMER_FOOTER, LEGAL_LINE, TOTAL_CARS_LABEL, TOTAL_VALUE_LABEL,
  carHref, carTitle, eur, gain, kmf,
} from "../lib/parco";
import CopyEmail from "./CopyEmail";

export function ParcoHeader() {
  return (
    <header className="pa-top">
      <div className="pa-wrap">
        <Link href="/" className="ctc-brand" aria-label="Car Trade Club, home"><span className="ctc-mark" aria-hidden="true" />Car Trade Club</Link>
        <nav aria-label="Sezioni">
          <a href="#auto">Le auto</a>
          <a href="#come">Come funziona</a>
          <a className="pa-btn pa-btn--ink" href="#contatti">Entra nel network</a>
        </nav>
      </div>
    </header>
  );
}

export function Hero({ featured }: { featured: ParcoCar | null }) {
  const title = featured ? carTitle(featured) : "";
  return (
    <section className="pa-hero">
      <div className="pa-wrap">
        <div>
          <p className="pa-eyebrow">Il network · Auto da privati per concessionari</p>
          <h1>{`${TOTAL_CARS_LABEL} auto trattate.`}<span>Tutte già negoziate.</span></h1>
          <p className="pa-lede">Questo è il parco auto passato dal network Car Trade Club: foto vere, prezzo concordato con il privato e margine visibile prima di comprare. Entra nel network e ricevi le prossime nella tua zona.</p>
          <div className="pa-cta-row">
            <a className="pa-btn pa-btn--lime" href="#contatti">Entra nel network →</a>
            <a className="pa-link-u" href="#auto">Guarda le auto</a>
          </div>
          <ul className="pa-checks">
            <li>Prezzo già concordato</li>
            <li>Foto e dati completi</li>
            <li>Paghi solo se compri</li>
          </ul>
        </div>
        {featured && <a className="pa-deal" href={carHref(featured.code)} data-pa-open={featured.code} aria-label="Apri la scheda dell'auto in evidenza">
          <div className="pa-deal__head"><span className="pa-live"><span className="pa-dot" aria-hidden="true" />Disponibile</span><span className="pa-where">{featured.city}</span></div>
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-built webp, served as-is */}
          <img className="pa-deal__img" src={featured.gallery[0]?.src} alt={title} width={1024} height={768} fetchPriority="high" />
          <div className="pa-deal__body">
            <p className="pa-deal__title">{title}</p>
            <div className="pa-deal__meta"><span className="pa-pill-ink">{featured.year}</span><span className="pa-pill-ink pa-num">{kmf(featured.km)}</span><span className="pa-pill-ink">{featured.fuel}</span></div>
            <div className="pa-deal__price">
              <div><small>Prezzo concordato</small><strong className="pa-num">{eur(featured.price)}</strong></div>
              <div className="pa-gain"><small>Margine stimato</small><strong className="pa-num">+{eur(gain(featured))}</strong></div>
            </div>
          </div>
        </a>}
      </div>
    </section>
  );
}

export function Stats({ stats }: { stats: { marginLabel: string; daysLabel: string } }) {
  return (
    <section className="pa-stats" aria-label="Il network in numeri">
      <div className="pa-wrap">
        <div className="pa-stat"><b className="pa-num">{TOTAL_CARS_LABEL}</b><span>auto negoziate con privati</span></div>
        <div className="pa-stat"><b className="pa-num">{TOTAL_VALUE_LABEL}</b><span>valore di mercato trattato</span></div>
        <div className="pa-stat"><b className="pa-num">{stats.marginLabel}</b><span>margine lordo medio sul prezzo d&apos;acquisto</span></div>
        <div className="pa-stat"><b className="pa-num">{stats.daysLabel}</b><span>tempo medio dall&apos;offerta alla vendita</span></div>
      </div>
    </section>
  );
}

function TickItems({ cars, hidden }: { cars: ParcoCar[]; hidden?: boolean }) {
  return (
    <div className="pa-ticker__copy" aria-hidden={hidden ? "true" : undefined}>
      {cars.map((c) => (
        <div key={c.code} className="pa-tick">
          {!c.noFrontCover && <span className="pa-tick-photo">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-built webp thumb */}
          <img src={c.gallery[0]?.thumb} alt="" loading="lazy" width={76} height={56} />
            <strong className="pa-sold-mark" aria-hidden="true">Venduta</strong>
          </span>}
          <span><b>{carTitle(c)}</b><span>{c.year} · {c.city} · <em>Venduta</em></span></span>
        </div>
      ))}
    </div>
  );
}

export function Ticker({ cars }: { cars: ParcoCar[] }) {
  return (
    <section className="pa-ticker" aria-label="Ultime chiusure">
      <div className="pa-wrap pa-ticker__label"><span className="pa-dot" aria-hidden="true" /><p className="pa-eyebrow">Ultime chiusure nel network</p></div>
      <div className="pa-ticker__track">
        <TickItems cars={cars} />
        <TickItems cars={cars} hidden />
      </div>
    </section>
  );
}

export function Band() {
  return (
    <section className="pa-band">
      <div className="pa-wrap">
        <p className="pa-eyebrow">Non semplici lead.</p>
        <h2>Auto vere, con foto vere e un prezzo già concordato con il privato.</h2>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="pa-how" id="come">
      <div className="pa-wrap">
        <p className="pa-eyebrow">Come funziona</p>
        <h2>Il lavoro pesante lo facciamo noi. <span>La decisione resta tua.</span></h2>
        <ol className="pa-steps">
          <li><h3>Definiamo il tuo stock ideale</h3><p>Zona, marchi, modelli, anzianità, chilometraggio e fascia di acquisto.</p></li>
          <li><h3>Troviamo e qualifichiamo i privati</h3><p>Venditori realmente intenzionati, con foto e dati dell&apos;auto già raccolti.</p></li>
          <li><h3>Concordiamo il prezzo</h3><p>Il nostro team gestisce la prima trattativa e prepara un&apos;opportunità concreta.</p></li>
          <li><h3>Tu valuti e acquisti</h3><p>Ricevi il deal su WhatsApp, scegli se procedere e organizzi verifica e ritiro.</p></li>
        </ol>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="pa-close" id="contatti">
      <div className="pa-wrap">
        <div>
          <span className="ctc-brand ctc-brand--on-ink"><span className="ctc-mark" aria-hidden="true" />Car Trade Club</span>
          <h2>Il prossimo acquisto <span>potrebbe essere già negoziato.</span></h2>
          <p>Dicci che auto cerchi e in quale zona operi. Ti ricontattiamo entro un giorno lavorativo per parlare di stock e volumi.</p>
        </div>
        <div className="pa-contact">
          <Link className="pa-btn pa-btn--lime" href="/#interesse">Attiva la tua zona →</Link>
          <CopyEmail email={CONTACT_EMAIL} />
        </div>
      </div>
    </section>
  );
}

export function ParcoFooter() {
  return (
    <footer className="pa-footer">
      <div className="pa-wrap">
        <span>{LEGAL_LINE}</span>
        <span>{DISCLAIMER_FOOTER}</span>
      </div>
    </footer>
  );
}
