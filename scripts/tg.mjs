// Telegram: Claude te escribe como un contacto más (bot de @BotFather).
//   node scripts/tg.mjs --setup              → detecta tu chat_id (mandale /start al bot antes) y lo guarda en .env
//   node scripts/tg.mjs "render listo ✅"     → texto
//   node scripts/tg.mjs --file out.mp4 "cap"  → foto/video/documento según extensión (≤50 MB)
//   node scripts/tg.mjs --read               → muestra lo que le escribiste al bot desde la última lectura
// .env: TELEGRAM_BOT_TOKEN=...  TELEGRAM_CHAT_ID=... (el 2º lo escribe --setup)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ENV_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");
const env = {};
try { for (const l of fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID;
if (!TOKEN) { console.error("Falta TELEGRAM_BOT_TOKEN en .env"); process.exit(1); }
const API = `https://api.telegram.org/bot${TOKEN}`;

async function call(method, body) {
  const r = await fetch(`${API}/${method}`, body instanceof FormData
    ? { method: "POST", body }
    : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) });
  const j = await r.json();
  if (!j.ok) throw new Error(`${method}: ${j.description}`);
  return j.result;
}

const OFFSET_FILE = path.join(path.dirname(ENV_PATH), ".tg_offset");
const [, , a1, ...rest] = process.argv;

if (a1 === "--setup") {
  const ups = await call("getUpdates", {});
  const chat = ups.map(u => u.message?.chat).filter(Boolean).pop();
  if (!chat) { console.error("No hay mensajes: abrí el bot en Telegram, mandale /start y reintentá."); process.exit(2); }
  let txt = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
  txt = /^TELEGRAM_CHAT_ID=.*$/m.test(txt) ? txt.replace(/^TELEGRAM_CHAT_ID=.*$/m, `TELEGRAM_CHAT_ID=${chat.id}`)
    : txt.replace(/\s*$/, "\n") + `TELEGRAM_CHAT_ID=${chat.id}\n`;
  fs.writeFileSync(ENV_PATH, txt);
  await call("sendMessage", { chat_id: chat.id, text: "✅ Conectado. Desde ahora te aviso por acá." });
  console.log(`chat_id ${chat.id} (${chat.first_name || chat.title}) guardado en .env`);
} else if (a1 === "--read") {
  const offset = fs.existsSync(OFFSET_FILE) ? Number(fs.readFileSync(OFFSET_FILE, "utf8")) : 0;
  const ups = await call("getUpdates", { offset });
  for (const u of ups) if (u.message && String(u.message.chat.id) === String(CHAT))
    console.log(`[${new Date(u.message.date * 1000).toLocaleString()}] ${u.message.text ?? "(adjunto)"}`);
  if (ups.length) fs.writeFileSync(OFFSET_FILE, String(ups.at(-1).update_id + 1));
  if (!ups.length) console.log("(sin mensajes nuevos)");
} else {
  if (!CHAT) { console.error("Falta TELEGRAM_CHAT_ID: corré `node scripts/tg.mjs --setup`"); process.exit(1); }
  if (a1 === "--file") {
    const [file, ...cap] = rest;
    const ext = path.extname(file).toLowerCase();
    const [method, field] = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ["sendPhoto", "photo"]
      : [".mp4", ".mov"].includes(ext) ? ["sendVideo", "video"] : ["sendDocument", "document"];
    const fd = new FormData();
    fd.append("chat_id", CHAT);
    if (cap.length) fd.append("caption", cap.join(" "));
    fd.append(field, new Blob([fs.readFileSync(file)]), path.basename(file));
    await call(method, fd);
  } else {
    const text = [a1, ...rest].filter(Boolean).join(" ");
    if (!text) { console.error('Uso: node scripts/tg.mjs "mensaje"'); process.exit(1); }
    await call("sendMessage", { chat_id: CHAT, text });
  }
  console.log("enviado");
}
