import type { Metadata } from "next";
import "./globals.css";
import "./forms.css";
import "./mobile.css";
import "./form-state.css";
import "./case-study.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://cartradeclub.com"),
  title: {default:"Auto usate da privati per concessionari | Car Trade Club",template:"%s | Car Trade Club"},
  description:"Car Trade Club trova, qualifica e negozia auto usate da privati per concessionari. Nessun abbonamento: paghi solo quando acquisti.",
  keywords:["auto usate da privati per concessionari","approvvigionamento auto usate","sourcing auto concessionari","acquisto stock auto usate"],
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large"}},
  openGraph:{type:"website",locale:"it_IT",url:"/",siteName:"Car Trade Club",title:"Auto da privati. Già negoziate.",description:"Opportunità di acquisto qualificate nella tua zona. Paghi soltanto quando compri.",images:[{url:"/og.png",width:1200,height:630,alt:"Car Trade Club - Auto da privati già negoziate"}]},
  twitter:{card:"summary_large_image",title:"Car Trade Club",description:"Il nuovo canale di approvvigionamento dell'usato.",images:["/og.png"]},
};
export const viewport = {width:"device-width",initialScale:1,themeColor:"#11151b"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="it"><body>{children}</body></html>}
