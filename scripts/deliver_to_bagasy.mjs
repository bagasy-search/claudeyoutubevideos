// Entrega un video montado por una sesión de Claude Code a Bagasy: verifica el release del
// farm y setea video_jobs.mp4_url + status='done'. Es "la misma manera" que usa el botón manual.
//   node scripts/deliver_to_bagasy.mjs <jobId> <slug> [repo=bagasy-search/claudeyoutubevideos]
//                                      [--card=<idTarjeta> | --thumb=<url>]
import fs from "node:fs";
import { execSync } from "node:child_process";
import { conCta } from "./cta_links.mjs";
import { supaCreds } from "./supa_creds.mjs";

const argv = process.argv.slice(2);
const flag = (n) => (argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=");
const cardArg = flag("card"), thumbArg = flag("thumb"), dry = argv.includes("--dry");
const [jobId, slug, repoArg] = argv.filter((a) => !a.startsWith("--"));
if (!jobId || !slug) { console.error("Uso: node scripts/deliver_to_bagasy.mjs <jobId> <slug> [repo] [--card=<id>|--thumb=<url>]"); process.exit(1); }
const REPO = repoArg || "bagasy-search/claudeyoutubevideos";
const sh = (c) => execSync(c, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });

// 1) verificar que el release del farm tenga el mp4 (descargable) — nunca dar una URL que no existe
let asset;
try {
  const view = JSON.parse(sh(`gh release view ${slug} -R ${REPO} --json assets`));
  asset = (view.assets || []).find((a) => a.name === `${slug}.mp4`);
} catch (e) { console.error(`no pude ver el release ${slug} en ${REPO}:`, String(e.stderr || e.message).slice(0, 160)); process.exit(2); }
if (!asset || asset.size < 1e6) { console.error("el release no tiene el mp4 (o es muy chico) — el render no está publicado"); process.exit(2); }
const url = `https://github.com/${REPO}/releases/download/${slug}/${slug}.mp4`;
console.log("release verificado:", url, (asset.size / 1048576).toFixed(0) + "MB");

// 2) meta opcional (título/descripción) que la sesión pudo dejar
let meta = {};
for (const mp of [`public/${slug}_meta.json`, `_v3/${slug}_meta.json`]) {
  if (fs.existsSync(mp)) { try { meta = JSON.parse(fs.readFileSync(mp, "utf8")); } catch {} }
}

// 3) writeback a Supabase (creds resueltas en cascada — ver scripts/supa_creds.mjs)
const { U, K, fuente: fuenteCreds } = supaCreds();
console.log("creds de Supabase:", fuenteCreds);
if (!meta.description) console.warn(`⚠️ OJO: no hay descripción de YouTube (falta public/${slug}_meta.json con {title,description}) → el video subirá SIN descripción. Generala antes de entregar.`);
const body = { status: "done", mp4_url: url, progress: null, error: null };
if (meta.title) body.yt_title = String(meta.title).slice(0, 120);
if (meta.description) body.yt_description = meta.description;

// 4) MINIATURA. El worker solo la sube a YouTube `if (job.thumb_url)`, y este script nunca lo
// llenaba → todo video entregado a mano subía PELADO (pasó con federer11..19). La miniatura ya
// existe: es el `thumb` de la tarjeta del planner en `tracked_channels.plan`. La buscamos por
// título; con --card/--thumb se fuerza a mano si el título del video no coincide con el de la tarjeta.
const H = { apikey: K, Authorization: "Bearer " + K };
try {
  const job = (await (await fetch(`${U}/rest/v1/video_jobs?id=eq.${encodeURIComponent(jobId)}&select=title,channel_key,thumb_url`, { headers: H })).json())[0];
  if (!job) throw new Error(`no existe el job ${jobId}`);

  // CTA: si la descripción no trae link propio, se le pega el de la página que
  // corresponde al TEMA del video. Sin esto los videos suben sin link (pasó con
  // 119 videos públicos en 12 canales) o con el dominio pelado, que YouTube no
  // convierte en enlace. Ver scripts/cta_links.mjs.
  if (body.yt_description) {
    const r = conCta(body.yt_description, job.channel_key || "", meta.title || job.title || "");
    body.yt_description = r.texto;
    console.log(r.cta ? `CTA (${r.motivo}): ${r.cta.url}` : `CTA: ${r.motivo} — el video sube sin link`);
  }
  if (thumbArg) {
    body.thumb_url = thumbArg;
    console.log("miniatura: forzada por --thumb");
  } else if (job.thumb_url && !cardArg) {
    // el explícito (--card/--thumb) SÍ pisa lo que haya; el automático no
    console.log("miniatura: el job ya tenía thumb_url, no la toco");
  } else {
    const ch = (await (await fetch(`${U}/rest/v1/tracked_channels?channel_key=eq.${encodeURIComponent(job.channel_key)}&select=name,plan`, { headers: H })).json())[0];
    const plan = Array.isArray(ch?.plan) ? ch.plan : [];
    if (!plan.length) throw new Error(`el canal ${ch?.name || job.channel_key} no tiene tarjetas con miniatura`);
    let card;
    if (cardArg) {
      card = plan.find((c) => c.id === cardArg);
      if (!card) throw new Error(`no hay tarjeta "${cardArg}" en ${ch.name} (hay: ${plan.map((c) => c.id).join(", ")})`);
    } else {
      // match por título: % de palabras largas de la tarjeta que aparecen en el título del video
      const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
      const nt = norm(meta.title || job.title);
      let best = 0;
      for (const c of plan) {
        const w = norm(c.title).split(" ").filter((x) => x.length > 3);
        const hit = w.length ? w.filter((x) => nt.includes(x)).length / w.length : 0;
        if (hit > best) { best = hit; card = c; }
      }
      if (best < 0.6) throw new Error(`ninguna tarjeta matchea el título (la mejor fue "${card?.id}" con ${(best * 100).toFixed(0)}%) → volvé a correr con --card=<id> o --thumb=<url>`);
      console.log(`miniatura: tarjeta "${card.id}" (match ${(best * 100).toFixed(0)}%)`);
    }
    if (!card.thumb) throw new Error(`la tarjeta "${card.id}" no tiene miniatura generada`);
    body.thumb_url = card.thumb;
  }
} catch (e) {
  // No abortamos: el video entregado vale igual, pero que quede GRITADO — si no, sube pelado.
  console.warn(`⚠️ SIN MINIATURA (${e.message}) → si lo subís a YouTube va a quedar PELADO. Arreglalo con --card/--thumb, o después seteando video_jobs.thumb_url.`);
}
if (dry) { console.log("--dry → NO escribo. El PATCH habría sido:"); console.log(JSON.stringify(body, null, 1)); process.exit(0); }
const r = await fetch(`${U}/rest/v1/video_jobs?id=eq.${encodeURIComponent(jobId)}`, {
  method: "PATCH", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify(body),
});
if (!r.ok) { console.error("PATCH falló:", r.status, (await r.text()).slice(0, 200)); process.exit(4); }
console.log(`✅ entregado a Bagasy — job ${jobId} · status=done · mp4_url seteado`);
