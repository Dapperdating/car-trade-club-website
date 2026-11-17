#!/usr/bin/env python3
import json,re,smtplib,time
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
DATA=Path("/var/lib/cartradeclub/leads.jsonl")
ALLOWED={"https://car-trade-club-italia.dapperdating-md.chatgpt.site","https://cartradeclub.com","https://www.cartradeclub.com"}
EMAIL=re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
class Handler(BaseHTTPRequestHandler):
 def end(self,status,body):
  self.send_response(status);self.send_header("Content-Type","application/json");self.send_header("Access-Control-Allow-Origin",self.headers.get("Origin","") if self.headers.get("Origin") in ALLOWED else "null");self.send_header("Vary","Origin");self.end_headers();self.wfile.write(json.dumps(body).encode())
 def do_OPTIONS(self):
  self.send_response(204);self.send_header("Access-Control-Allow-Origin",self.headers.get("Origin","") if self.headers.get("Origin") in ALLOWED else "null");self.send_header("Access-Control-Allow-Headers","Content-Type");self.send_header("Access-Control-Allow-Methods","POST, OPTIONS");self.end_headers()
 def do_GET(self): self.end(200,{"ok":True}) if self.path=="/health" else self.end(404,{"ok":False})
 def do_POST(self):
  if self.path!="/interest" or self.headers.get("Origin") not in ALLOWED:return self.end(403,{"ok":False})
  try:size=int(self.headers.get("Content-Length","0"));data=json.loads(self.rfile.read(min(size,12000)))
  except Exception:return self.end(400,{"ok":False})
  if data.get("website"):return self.end(200,{"ok":True})
  fields={k:str(data.get(k,"")).strip()[:1200] for k in ("name","company","email","phone","area","stock")}
  if not all(fields.values()) or not EMAIL.match(fields["email"]) or data.get("consent")!="yes":return self.end(422,{"ok":False})
  record={"received_at":int(time.time()),"ip":self.headers.get("X-Forwarded-For",self.client_address[0]).split(",")[0],**fields};DATA.parent.mkdir(parents=True,exist_ok=True);DATA.open("a",encoding="utf-8").write(json.dumps(record,ensure_ascii=False)+"\n")
  message=EmailMessage();message["Subject"]=f"Nuovo interesse CTC — {fields['company']}";message["From"]="leads@cartradeclub.com";message["To"]="mattia@cartradeclub.com";message["Reply-To"]=fields["email"];message.set_content("\n".join(f"{k.title()}: {v}" for k,v in fields.items()))
  try:
   with smtplib.SMTP("smtp-relay.gmail.com",587,timeout=15) as smtp:smtp.starttls();smtp.send_message(message)
  except Exception as exc:Path("/var/lib/cartradeclub/mail-errors.log").open("a").write(f"{int(time.time())} {type(exc).__name__} {exc}\n");return self.end(202,{"ok":True,"queued":True})
  self.end(200,{"ok":True})
 def log_message(self,fmt,*args):pass
ThreadingHTTPServer(("127.0.0.1",5003),Handler).serve_forever()
