// deliver_card.mjs — entrega un video montado por un chat de Claude DIRECTO a Bagasy, a la tarjeta del
// planificador (tracked_channels.plan) del canal. Crea el video_jobs (done + mp4_url + meta + miniatura),
// engancha la tarjeta (videoJobId + done → "video listo") y sube el mp4 a YouTube como BORRADOR PRIVADO.
//
//   node scripts/deliver_card.mjs <channel_key> <card_id> <slug> [--no-youtube]
//
// - <channel_key>: p.ej. "https://www.youtube.com/@FedererBuilding" (o "draft:xxxx")
// - <card_id>: el id del item del plan (lo trae el prompt de Bagasy)
// - <slug>: el slug del render; el release <slug> debe tener el asset <slug>.mp4, y debe existir public/<slug>_meta.json
// Creds de Supabase: D:/Proyectos/yt-scout-web/.env.local (mismo patrón que deliver_to_bagasy.mjs / el worker).
import fs from "node:fs";
import { execSync } from "node:child_process";

const [channelKey, cardId, slug, ...rest] = process.argv.slice(2);
if (!channelKey || !cardId || !slug) {
  console.error("Uso: node scripts/deliver_card.mjs <channel_key> <card_id> <slug> [--no-youtube]");
  process.exit(1);
}
const noYoutube = rest.includes("--no-youtube");
const REPO = process.env.BAGASY_REPO || "bagasy-search/claudeyoutubevideos";
const MINT = process.env.BAGASY_MINT || "https://bagasy-search.vercel.app/api/youtube/mint";
const sh = (c) => execSync(c, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });

// ⛔⛔ ANTES ACÁ HABÍA UNA SOLA RUTA QUEMADA (`D:/Proyectos/yt-scout-web/.env.local`) y un
//    `readFileSync` pelado. Medido el 12-sep-2026: ese repo NO está en esta máquina, así que la
//    entrega moría con un ENOENT crudo **con el video ya renderizado, verificado y publicado en el
//    release** — el trabajo entero hecho, frenado en el último comando. Y el mensaje de error no
//    decía qué hacer.
//    ✅ Ahora: env vars → `--env <ruta>` → lista de rutas conocidas. Y si no encuentra nada,
//       explica exactamente qué falta y dónde ponerlo.
const envFlag = (process.argv.find((a) => a.startsWith("--env=")) || "").slice(6);
const CANDIDATOS = [
  envFlag,
  process.env.BAGASY_ENV,
  "D:/Proyectos/yt-scout-web/.env.local",
  "D:/Proyectos/bagasy-search/.env.local",
  "C:/Users/bauti/Downloads/yt-scout-web/.env.local",
  "C:/Users/bauti/Downloads/bagasy-search/.env.local",
].filter(Boolean);

let U = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let K = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
let origen = U && K ? "variables de entorno" : "";
if (!U || !K) {
  for (const ruta of CANDIDATOS) {
    if (!fs.existsSync(ruta)) continue;
    const env = fs.readFileSync(ruta, "utf8");
    const g = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim();
    const u = g("NEXT_PUBLIC_SUPABASE_URL") || g("SUPABASE_URL");
    const k = g("SUPABASE_SERVICE_ROLE_KEY");
    if (u && k) { U = u; K = k; origen = ruta; break; }
  }
}
if (!U || !K) {
  console.error("⛔ no encontré las credenciales de Supabase de Bagasy.");
  console.error("   Busqué en las variables de entorno (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) y en:");
  for (const r of CANDIDATOS) console.error("     " + (fs.existsSync(r) ? "· (existe, sin las dos vars) " : "· (no existe) ") + r);
  console.error("");
  console.error("   Arreglalo de UNA de estas formas:");
  console.error("     1) dejá el .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en alguna de esas rutas");
  console.error("     2) pasalo explícito:  --env=<ruta al .env.local>");
  console.error("     3) exportá las dos variables antes de correr el comando");
  console.error("   ⚠️ El video NO se pierde: el mp4 ya está en el release y el meta en public/<slug>_meta.json.");
  console.error("      Con las creds puestas, este mismo comando termina la entrega.");
  process.exit(3);
}
console.log("creds de Supabase ← " + origen);
const H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };

// 1) verificar release descargable
let asset;
try { asset = (JSON.parse(sh(`gh release view ${slug} -R ${REPO} --json assets`)).assets || []).find((a) => a.name === `${slug}.mp4`); }
catch (e) { console.error(`no pude ver el release ${slug} en ${REPO}:`, String(e.stderr || e.message).slice(0, 160)); process.exit(2); }
if (!asset || asset.size < 1e6) { console.error("el release no tiene el mp4 (o es muy chico) — el render no está publicado"); process.exit(2); }
const url = `https://github.com/${REPO}/releases/download/${slug}/${slug}.mp4`;
console.log("release ✓", url, (asset.size / 1048576).toFixed(0) + "MB");

// 2) meta (título/descripción)
let meta = {};
for (const mp of [`public/${slug}_meta.json`, `_v3/${slug}_meta.json`]) if (fs.existsSync(mp)) { try { meta = JSON.parse(fs.readFileSync(mp, "utf8")); } catch {} }
if (!meta.description) console.warn(`⚠️ sin descripción (falta public/${slug}_meta.json con {title,description})`);

const main = async () => {
  // 3) canal + item del plan (para user_id, channel_name y la miniatura de la tarjeta)
  const ch = (await (await fetch(`${U}/rest/v1/tracked_channels?select=id,user_id,name,plan&channel_key=eq.${encodeURIComponent(channelKey)}&role=eq.own`, { headers: H })).json())[0];
  if (!ch) { console.error("canal no encontrado:", channelKey); process.exit(4); }
  const plan = Array.isArray(ch.plan) ? ch.plan : [];
  const item = plan.find((p) => p.id === cardId);
  if (!item) console.warn(`⚠️ card_id ${cardId} no está en el plan del canal — igual creo el job, pero no puedo enganchar la tarjeta`);
  const thumb = item?.thumb || null;

  // 4) crear el video_jobs (mismo patrón que "Ya tengo el video hecho")
  const jobBody = {
    user_id: ch.user_id, channel_key: channelKey, channel_name: ch.name || null, slug,
    title: (meta.title || item?.title || slug).slice(0, 200), provider: "claude-chat",
    status: "done", mp4_url: url, thumb_url: thumb,
    yt_title: meta.title ? String(meta.title).slice(0, 120) : null, yt_description: meta.description || null,
  };
  const jr = await fetch(`${U}/rest/v1/video_jobs`, { method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(jobBody) });
  if (!jr.ok) { console.error("insert video_jobs falló:", jr.status, (await jr.text()).slice(0, 200)); process.exit(5); }
  const job = (await jr.json())[0];
  console.log("video_jobs ✓ id", job.id, "· status=done · mp4_url seteado");

  // 5) enganchar la tarjeta del planificador
  if (item) {
    const next = plan.map((p) => (p.id === cardId ? { ...p, videoJobId: job.id, done: true } : p));
    const pu = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ch.id}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ plan: next }) });
    console.log("tarjeta enganchada:", pu.status === 204 ? `OK (videoJobId=${job.id}, done=true → "video listo")` : `fallo ${pu.status}`);
  }

  // 6) YouTube (borrador PRIVADO) vía mint
  if (noYoutube) { console.log("(--no-youtube) salteo la subida"); return job; }
  if (channelKey.startsWith("draft:")) { console.log("canal draft: sin YouTube conectado, salteo la subida"); return job; }
  try {
    const m = await (await fetch(MINT, { method: "POST", headers: { "x-worker-key": K, "Content-Type": "application/json" }, body: JSON.stringify({ user_id: ch.user_id, channel_key: channelKey }) })).json();
    if (!m.access_token) { console.warn("YouTube: no conectado o token vencido — subí a mano. (", JSON.stringify(m).slice(0, 120), ")"); return job; }
    const at = m.access_token;
    const local = `D:/videosdeclaude/${slug}.mp4`;
    const bytes = fs.existsSync(local) ? fs.readFileSync(local) : Buffer.from(await (await fetch(url)).arrayBuffer());
    const snippet = { snippet: { title: (meta.title || slug).slice(0, 100), description: (meta.description || "").slice(0, 4900), categoryId: "27" }, status: { privacyStatus: "private", selfDeclaredMadeForKids: false } };
    const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", { method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": "video/*", "X-Upload-Content-Length": String(bytes.length) }, body: JSON.stringify(snippet) });
    if (!init.ok) { console.warn("YouTube init falló", init.status, (await init.text()).slice(0, 160)); return job; }
    const put = await fetch(init.headers.get("location"), { method: "PUT", headers: { "Content-Type": "video/*", "Content-Length": String(bytes.length) }, body: bytes });
    const jj = await put.json().catch(() => ({}));
    if (!put.ok || !jj.id) { console.warn("YouTube PUT falló", put.status, JSON.stringify(jj).slice(0, 160)); return job; }
    const vid = jj.id;
    if (thumb) { try { const t = await fetch(thumb); const tb = Buffer.from(await t.arrayBuffer()); await fetch("https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=" + vid, { method: "POST", headers: { Authorization: "Bearer " + at, "Content-Type": t.headers.get("content-type") || "image/png", "Content-Length": String(tb.length) }, body: tb }); } catch {} }
    await fetch(`${U}/rest/v1/video_jobs?id=eq.${job.id}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ yt_video_id: vid, yt_upload_status: "done", yt_uploaded_at: new Date().toISOString() }) });
    console.log("YouTube ✓ borrador PRIVADO:", "https://studio.youtube.com/video/" + vid + "/edit");
  } catch (e) { console.warn("YouTube: error subiendo (entregá a mano):", String(e.message).slice(0, 160)); }
  return job;
};
await main();
console.log("\n✅ ENTREGADO a Bagasy — tarjeta", cardId, "del canal", channelKey);
