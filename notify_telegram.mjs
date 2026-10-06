// notify_telegram.mjs — entrega el video final por Telegram al terminar el render.
//
// <50 MB  → sendVideo(supports_streaming=true) → se reproduce INLINE/streaming en la app.
// >50 MB  → (límite duro de la Bot API para archivos que envía un bot) NO entra: se manda
//           la MINIATURA + título + descripción + LINK (YouTube unlisted / R2), y el video
//           streamea desde ese link. Pasá el link con --link; sin link avisa y no rompe.
//
// Creds (fuera del repo): env TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID, o el archivo
// ~/.telegram_bot (KEY=VALUE por línea). Ver .gitignore (nunca commitear).
//
// Uso:
//   node notify_telegram.mjs --video public/out/pruebafauna.mp4 \
//        --title "Yaguareté vuelve al Iberá" --desc "Documental de prueba · Planeta Reconstruido" \
//        [--link https://youtu.be/xxxx] [--thumb path.jpg]
import fs from "fs";
import { execFileSync, spawnSync } from "child_process";
import { homedir } from "os";
import { join } from "path";

const LIMIT = 50 * 1024 * 1024; // 50 MB — tope de la Bot API para uploads del bot

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith("--")) { const k = t.slice(2); const n = argv[i + 1]; if (n === undefined || n.startsWith("--")) a[k] = true; else { a[k] = n; i++; } }
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));

// ── credenciales ──
function loadCreds() {
  let token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  const f = process.env.TELEGRAM_BOT_FILE || join(homedir(), ".telegram_bot");
  if ((!token || !chat) && fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
      if (!m) continue;
      if (m[1] === "TELEGRAM_BOT_TOKEN" && !token) token = m[2];
      if (m[1] === "TELEGRAM_CHAT_ID" && !chat) chat = m[2];
    }
  }
  if (!token || !chat) { console.error("faltan TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID (env o ~/.telegram_bot)"); process.exit(1); }
  return { token, chat };
}
const { token, chat } = loadCreds();
const api = (method) => `https://api.telegram.org/bot${token}/${method}`;

async function tg(method, form) {
  const r = await fetch(api(method), { method: "POST", body: form });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error(`${method} falló: ${JSON.stringify(j).slice(0, 300)}`);
  return j.result;
}
const blob = (path, type) => new Blob([fs.readFileSync(path)], { type });

// genera una miniatura del video (frame ~1s) con ffmpeg
function makeThumb(video) {
  const out = join("/tmp", `tg_thumb_${Date.now()}.jpg`);
  try {
    execFileSync(process.env.FFMPEG || "ffmpeg", ["-y", "-ss", "1", "-i", video, "-frames:v", "1", "-vf", "scale=640:-1", out], { stdio: "ignore" });
    return fs.existsSync(out) ? out : null;
  } catch { return null; }
}
// dimensiones/duración para que Telegram muestre el player correcto
function probe(video) {
  try {
    const s = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", video], { encoding: "utf8" });
    const j = JSON.parse(s); const st = (j.streams || [])[0] || {};
    return { w: st.width, h: st.height, dur: Math.round(+(j.format?.duration || 0)) };
  } catch { return {}; }
}

async function main() {
  const video = args.video;
  const title = args.title || "Video";
  const desc = args.desc || "";
  const caption = `🎬 ${title}${desc ? `\n${desc}` : ""}`;
  if (!video || !fs.existsSync(video)) { console.error("no existe --video", video); process.exit(1); }
  const size = fs.statSync(video).size;
  const mb = (size / 1024 / 1024).toFixed(1);

  if (size <= LIMIT) {
    // ── camino directo: sendVideo streaming inline ──
    const { w, h, dur } = probe(video);
    const thumb = makeThumb(video);
    const form = new FormData();
    form.append("chat_id", chat);
    form.append("caption", caption);
    form.append("supports_streaming", "true");
    if (w) form.append("width", String(w));
    if (h) form.append("height", String(h));
    if (dur) form.append("duration", String(dur));
    form.append("video", blob(video, "video/mp4"), video.split("/").pop());
    if (thumb) form.append("thumbnail", blob(thumb, "image/jpeg"), "thumb.jpg");
    console.log(`sendVideo streaming (${mb} MB, ${w||"?"}x${h||"?"}, ${dur||"?"}s)…`);
    const res = await tg("sendVideo", form);
    if (thumb) fs.rmSync(thumb, { force: true });
    console.log(`✔ enviado inline a Telegram (message_id ${res.message_id})`);
  } else {
    // ── >50 MB: entrega por el BOT a tu chat (userbot sube al canal privado → el bot
    //    hace copyMessage). El video llega al chat del bot, NO a Mensajes guardados, y sin
    //    el tope de 50 MB. Si falta sesión/canal (sale 3) o falla → fallback miniatura+link.
    //    (Para mandar a Mensajes guardados en su lugar, existe tg_send.py.) ──
    console.log(`video ${mb} MB > 50 MB → entrega por BOT (userbot→canal→copyMessage)…`);
    const ub = spawnSync(process.env.PYTHON || "python3",
      [join(process.cwd(), "tg_deliver_bot.py"), "--video", video, "--title", title, ...(desc ? ["--desc", desc] : []), ...(args.buttons ? ["--buttons"] : [])],
      { stdio: "inherit" });
    if (ub.status === 0) { console.log("✔ entregado por el bot a tu chat (sin límite de 50 MB)"); return; }
    console.warn(ub.status === 3
      ? "falta sesión/canal → corré  python3 tg_login.py  y  python3 tg_channel_setup.py . Caigo a miniatura + link."
      : `entrega por bot no disponible (status ${ub.status}) → caigo a miniatura + link.`);
    // ── fallback >50 MB: miniatura + título + desc + LINK (streamea del link) ──
    const link = args.link;
    const capLink = `🎬 ${title}${desc ? `\n${desc}` : ""}` +
      (link ? `\n\n▶ Ver (streaming): ${link}` : `\n\n⚠ (${mb} MB — supera el límite de 50 MB de Telegram; falta --link para el video)`);
    const thumb = args.thumb && fs.existsSync(args.thumb) ? args.thumb : makeThumb(video);
    if (thumb) {
      const form = new FormData();
      form.append("chat_id", chat);
      form.append("caption", capLink);
      form.append("photo", blob(thumb, "image/jpeg"), "thumb.jpg");
      await tg("sendPhoto", form);
      if (!args.thumb) fs.rmSync(thumb, { force: true });
      console.log(`✔ miniatura + ${link ? "link" : "aviso"} enviados`);
    } else {
      const form = new FormData();
      form.append("chat_id", chat);
      form.append("text", capLink);
      await tg("sendMessage", form);
      console.log(`✔ mensaje (sin miniatura) enviado`);
    }
    if (!link) process.exitCode = 2; // señalá que faltó el link para el video grande
  }
}
main().catch((e) => { console.error("✗", e.message); process.exit(1); });
