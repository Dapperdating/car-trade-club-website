# Car Trade Club website

Sorgenti del sito B2B pubblicato su https://cartradeclub.com: home con due case study, modulo interesse, privacy, termini e due guide per concessionari. React 19, Vinext/Vite e Cloudflare Worker.

## Avvio locale

Prerequisiti: Node.js >=22.13 e pnpm 10.32.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Aprire l’URL stampato da Vinext. Per verificare la release:

```sh
pnpm build
node --test tests/seo.test.mjs
```

`pnpm test` esegue build e suite SEO. I test verificano le cinque pagine, canonical, JSON-LD, sitemap, robots, 404 e redirect www. Non inviano richieste commerciali.

## Struttura

- `app/`: pagine, componente LeadForm, CSS responsive, metadata, sitemap e robots.
- `public/`: immagini originali, varianti WebP responsive, favicon e immagine social.
- `worker/index.ts`: rendering server, immagini e redirect www verso il dominio canonico.
- `build/sites-vite-plugin.ts`, `vite.config.ts`, `.openai/hosting.json`: integrazione Sites e hosting Cloudflare; conservare l’identità del sito esistente.
- `server/`: servizio Python e frammenti systemd/Nginx del backend contatti separato.
- `db/`, `drizzle/`, `examples/d1/`: supporto database ereditato; il sito attuale non usa binding D1/R2.

## Modulo e servizi esterni

Il modulo chiama `https://admin.dapper.black/api/ctc-interest`: anche un invio dal preview può contattare il backend reale. Per prove locali usare un mock di rete; non inviare dati di prova al servizio pubblico.

Il backend separato in `server/` richiede Python 3, storage scrivibile in `/var/lib/cartradeclub`, configurazione del relay SMTP Google sulla porta 587 e reverse proxy TLS con CORS per le origini autorizzate. Il frammento Nginx presuppone una zona `limit_req` chiamata `ctc_forms` definita dall’operatore. Non installare né avviare questi servizi durante la sola build del frontend. Nessun dato lead, credenziale o configurazione privata del server è incluso.

## Provenienza e pubblicazione

Importazione del 17 novembre 2026 dalla release Sites **12**, commit sorgente `c27ae865fd62e4537b0e4bc09ddad611fbd2689e`, recuperato direttamente dal repository Sites. La copia `seo/ctc-release` e il sito live confermano pagine e asset della release; la vecchia `car-trade-club-site` contiene anche modifiche locali precedenti e non è stata sovrascritta.

Questo repository è una copia dei sorgenti. Non contiene workflow di deploy e un push GitHub non pubblica il sito. La produzione resta gestita da Sites, progetto `appgprj_6a5f2e9ab19881918916f1ed990683ec`; una futura pubblicazione richiede una release esplicitamente autorizzata e gli strumenti Sites.

Modifiche rispetto alla release: README operativo, nome pacchetto, script test coerente con pnpm, versione pnpm dichiarata, esclusioni Git per dati locali e rimozione della vecchia suite che verificava lo skeleton dello starter. Pagine, stili, immagini e comportamento applicativo sono conservati.

## Aggiornamento del Parco Auto


Il catalogo pubblico legge `data/parco-auto.json` e le immagini locali in `public/parco-auto/img/`. Non è collegato automaticamente agli stati del gestionale: aggiunte, prezzi e disponibilità richiedono aggiornamento e release Sites. Lo script `scripts/import-cars.mjs` aggiorna solo l’archivio separato `data/cars.json`, non il catalogo pubblico.

Il 20 novembre 2026 è stata aggiunta CTC-QE2P (Kia Ceed 2009, diesel, 230.000 km, Asso), verificata nel gestionale come Published, con 700 € concordati e offerta inviata a cinque concessionari. Nessuna valutazione di mercato è pubblicata per questa scheda. Foto frontale come copertina, targa oscurata nel file esportato; le foto dei danni restano incluse. Dati e contatti del venditore esclusi.

## Riconciliazione automatica del catalogo


Il controllo Codex orario legge il gestionale in sola lettura e pubblica soltanto modifiche verificate. Lo stato del CRM viene confrontato con accordo, invio e contesto della conversazione; una trattativa rifiutata non viene aggiunta solo perché il badge CRM è rimasto Negotiating.

Le schede ritirate sono conservate in `data/parco-auto-archive.json`, escluso dal catalogo: scadenza e ritiro non equivalgono a vendita. Non cancellare gli asset storici. Il 20 novembre 2026 CTC-VHZE è stata archiviata perché l’accordo risulta scaduto e il venditore ha sospeso la proposta. CTC-Y23D è in trattativa/preparazione, a 7.000 € concordati: l’invio ai concessionari non risulta ancora avvenuto e il venditore ha rinviato le visite al 23 novembre. Zona e chilometraggio sono stati aggiornati dai dati verificati.
