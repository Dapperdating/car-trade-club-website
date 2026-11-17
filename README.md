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
