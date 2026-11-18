import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import LeadForm from "./LeadForm";
import Link from "next/link";
const steps = [
  ["01", "Definiamo il tuo stock ideale", "Zona, marchi, modelli, anzianità, chilometraggio e fascia di acquisto."],
  ["02", "Troviamo e qualifichiamo i privati", "Selezioniamo venditori realmente intenzionati e raccogliamo i dati utili sull'auto."],
  ["03", "Concordiamo il prezzo", "Il nostro team gestisce la prima trattativa e prepara un'opportunità concreta."],
  ["04", "Tu valuti e acquisti", "Ricevi il deal su WhatsApp, scegli se procedere e organizzi verifica e ritiro."],
];

const faq = [
  ["Car Trade Club vende lead?", "No. Inviamo opportunità di acquisto da privati già qualificate e negoziate, con dati dell'auto, immagini, località, prezzo concordato e contatto."],
  ["Quanto costa?", "Non ci sono abbonamenti o costi per ricevere le proposte. Il primo acquisto è senza commissione; in seguito paghi solo quando acquisti. Le condizioni definitive vengono concordate in fase di attivazione."],
  ["Sono obbligato ad acquistare?", "No. Ogni opportunità è una proposta libera: il tuo team mantiene pieno controllo su valutazione, verifica e decisione finale."],
  ["Posso scegliere quali auto ricevere?", "Sì. Configuriamo area geografica e criteri di stock per ridurre il rumore e inviare opportunità coerenti con il tuo business."],
];

export default function Home() {
  const schema = {"@context":"https://schema.org","@type":"Service","@id":"https://cartradeclub.com/#service","url":"https://cartradeclub.com/","name":"Car Trade Club","serviceType":"Sourcing di auto usate da privati per concessionari","provider":{"@type":"Organization","@id":"https://cartradeclub.com/#organization","name":"Car Trade Club","legalName":"CAR TRADE CLUB LIMITED","url":"https://cartradeclub.com/"},"areaServed":"Europe","audience":{"@type":"BusinessAudience","audienceType":"Concessionari e commercianti di auto usate"},"description":"Opportunità di acquisto di auto usate da privati, qualificate e già negoziate per concessionari in Europa."};
  return <main>
    <a className="skiplink" href="#contenuto">Vai al contenuto</a>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
    <nav><a className="brand" href="#top"><span>CTC</span> CAR TRADE CLUB</a><div className="navlinks"><Link href="/parco-auto">Le auto</Link><a href="#come-funziona">Come funziona</a><a href="#case-study">Case study</a><a href="#vantaggi">Vantaggi</a><a className="button small" href="mailto:mattia@cartradeclub.com?subject=Attivazione%20Car%20Trade%20Club">Attiva la tua zona</a></div></nav>
    <section className="hero" id="contenuto"><div className="hero-copy"><div className="eyebrow">SOURCING AUTO USATE · PER CONCESSIONARI</div><h1>Auto da privati.<br/><em>Già negoziate.</em></h1><p className="lead">Ricevi opportunità di acquisto qualificate nella tua zona. Tu scegli le auto che interessano al tuo concessionario e paghi soltanto quando compri.</p><div className="actions"><a className="button" href="#interesse">Parliamo del tuo stock →</a><a className="textlink" href="#come-funziona">Scopri come funziona</a></div><div className="trust"><span>✓ Opportunità qualificate</span><span>✓ Stock personalizzato</span><span>✓ Nessun obbligo d'acquisto</span></div></div><div className="deal"><div className="dealhead"><span>OPPORTUNITÀ DISPONIBILE</span><b>Torino · 18 km</b></div><h3>Audi A3 Sportback</h3><div className="specs"><span>2020</span><span>68.400 km</span><span>Diesel</span></div><div className="price"><small>PREZZO CONCORDATO</small><strong>€ 18.700</strong></div><div className="line"/><p>Foto, dati auto e contatto del privato pronti per la tua valutazione.</p></div></section>
    <section className="statement"><p>Non semplici lead.</p><h2>Un nuovo canale di approvvigionamento dell'usato.</h2></section>
    <section id="come-funziona"><div className="sectiontag">COME FUNZIONA</div><h2>Il lavoro pesante lo facciamo noi.<br/>La decisione resta tua.</h2><div className="steps">{steps.map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="contrast" id="vantaggi"><div><div className="sectiontag light">PERCHÉ CTC</div><h2>Più tempo per valutare il margine. Meno tempo perso a cercare.</h2></div><div className="benefits"><p><b>Opportunità locali</b><span>Coerenti con zona e criteri di stock.</span></p><p><b>Trattativa iniziale gestita</b><span>Il prezzo è già stato discusso con il privato.</span></p><p><b>Canale diretto su WhatsApp</b><span>Dati essenziali, immagini e contatto in un flusso rapido.</span></p><p><b>Modello pay-per-success</b><span>Il costo nasce soltanto quando nasce valore.</span></p></div></section>
    <section className="case-study" id="case-study">
      <div className="case-copy">
        <div className="sectiontag">CASE STUDY · OPERAZIONE REALE</div>
        <h2>€2.900 di margine lordo.<br/><em>In 16 giorni.</em></h2>
        <p className="sectionlead">Un SUV compatto acquistato direttamente da un privato e rivenduto in poco più di due settimane.</p>
        <div className="case-metrics">
          <div><span>ACQUISTO DA PRIVATO</span><strong>€12.000</strong></div>
          <div><span>RIVENDITA</span><strong>€14.900</strong></div>
          <div><span>MARGINE LORDO</span><strong>€2.900</strong></div>
          <div><span>RENDIMENTO SUL COSTO</span><strong>24,2%</strong></div>
        </div>
        <p className="case-note">Margine lordo calcolato come prezzo di rivendita meno prezzo di acquisto. Non include eventuali costi di trasporto, passaggio, ricondizionamento o fiscalità.</p>
      </div>
      <figure className="case-visual">
        <img src="/case-study-suv-clean-1200.webp" srcSet="/case-study-suv-clean-640.webp 640w, /case-study-suv-clean-1200.webp 1200w" sizes="(max-width: 900px) 90vw, 45vw" loading="lazy" decoding="async" alt="SUV compatto nero protagonista del case study Car Trade Club" width="720" height="540"/>
        <figcaption><b>16 giorni</b><span>dall’acquisto alla rivendita</span></figcaption>
      </figure>
    </section>
    <section className="case-study case-study-alt" id="case-study-agila">
      <div className="case-copy">
        <div className="sectiontag">CASE STUDY · OPEL AGILA 2011</div>
        <h2>€2.900 di margine lordo.<br/><em>In 25 giorni.</em></h2>
        <p className="sectionlead">Una Opel Agila del 2011 acquistata direttamente da un privato e rivenduta in meno di un mese.</p>
        <div className="case-metrics">
          <div><span>ACQUISTO DA PRIVATO</span><strong>€2.900</strong></div>
          <div><span>RIVENDITA</span><strong>€5.800</strong></div>
          <div><span>MARGINE LORDO</span><strong>€2.900</strong></div>
          <div><span>RENDIMENTO SUL COSTO</span><strong>100%</strong></div>
        </div>
        <p className="case-note">Margine lordo calcolato come prezzo di rivendita meno prezzo di acquisto. Non include eventuali costi di trasporto, passaggio, ricondizionamento o fiscalità.</p>
        <p className="case-note"><Link href="/parco-auto">Guarda tutte le auto trattate dal network →</Link></p>
      </div>
      <figure className="case-visual">
        <img src="/case-study-opel-agila-clean-1200.webp" srcSet="/case-study-opel-agila-clean-640.webp 640w, /case-study-opel-agila-clean-1200.webp 1200w" sizes="(max-width: 900px) 90vw, 45vw" loading="lazy" decoding="async" alt="Opel Agila del 2011 protagonista del case study Car Trade Club" width="1536" height="1024"/>
        <figcaption><b>25 giorni</b><span>dall’acquisto alla rivendita</span></figcaption>
      </figure>
    </section>
    <section className="pricing"><div className="sectiontag">UN MODELLO ALLINEATO AI RISULTATI</div><h2>Condizioni costruite<br/><em>sul tuo volume.</em></h2><p className="sectionlead">Parliamo del tuo stock ideale e definiamo insieme un modello commerciale adatto alla tua operatività.</p></section>
    <section className="faq"><div><div className="sectiontag">DOMANDE FREQUENTI</div><h2>Tutto ciò che serve sapere, prima del primo deal.</h2></div><div>{faq.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="interest" id="interesse"><div><div className="sectiontag">PARLIAMONE</div><h2>Dicci che auto stai cercando.</h2><p className="sectionlead">Lascia i tuoi riferimenti. Ti ricontattiamo entro un giorno lavorativo per parlare di zona, stock e volumi.</p><a className="mobilemail" href="mailto:mattia@cartradeclub.com">Preferisci l’email? Scrivici direttamente →</a></div><LeadForm/></section>
    <section className="cta"><div className="sectiontag light">CAR TRADE CLUB</div><h2>Il prossimo acquisto<br/>potrebbe essere già negoziato.</h2><p>Raccontaci che auto cerchi e in quale zona operi.</p><a className="button inverted" href="#interesse">Attiva la tua zona →</a></section>
    <section className="guide-links"><div className="sectiontag">GUIDE PER CONCESSIONARI</div><h2>Acquistare con criterio.</h2><p><a className="textlink" href="/approvvigionamento-auto-usate-concessionari">Approvvigionamento auto usate per concessionari →</a></p><p><a className="textlink" href="/acquistare-auto-da-privati">Acquistare auto da privati: guida per concessionari →</a></p></section>
    <footer><div><a className="brand" href="#contenuto"><span>CTC</span> CAR TRADE CLUB</a><p>Opportunità di acquisto auto usate da privati per concessionari in tutta Europa.</p></div><div><b>Contatti</b><a href="mailto:mattia@cartradeclub.com">mattia@cartradeclub.com</a><span>London, United Kingdom</span></div><div><b>Legale</b><a href="/privacy">Privacy Policy</a><a href="/terms">Termini e condizioni</a></div><small>© 2026 CAR TRADE CLUB LIMITED · Company No. 17413707 · Tutti i diritti riservati.</small></footer>
  </main>;
}
