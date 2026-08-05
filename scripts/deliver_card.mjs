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

const env = fs.readFileSync("D:/Proyectos/yt-scout-web/.env.local", "utf8");
const g = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim();
const U = g("NEXT_PUBLIC_SUPABASE_URL"), K = g("SUPABASE_SERVICE_ROLE_KEY");
if (!U || !K) { console.error("faltan creds de Supabase en yt-scout-web/.env.local"); process.exit(3); }
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
