"use client";
// Copyable email row of the closing CTA. Port of the artifact's "copy email" handler (JS 820–826).
import { useEffect, useRef, useState } from "react";

const IDLE = "Copia";

export default function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState(IDLE);
  const addrRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setLabel("Copiata");
    } catch {
      // No clipboard permission: select the address so the user can copy it by hand.
      const node = addrRef.current;
      const sel = typeof window !== "undefined" ? window.getSelection() : null;
      if (node && sel) {
        const r = document.createRange();
        r.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(r);
      }
      setLabel("Selezionata");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel(IDLE), 1800);
  }

  return (
    <div className="pa-mail">
      <div><small>Oppure scrivici</small><span ref={addrRef}>{email}</span></div>
      <button type="button" onClick={copy}>{label}</button>
    </div>
  );
}
