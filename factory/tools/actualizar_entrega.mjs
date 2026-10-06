// actualizar_entrega.mjs — RE-ENTREGA de un video YA entregado en Bagasy: apunta el video_jobs EXISTENTE al mp4
// nuevo del release (con ?v=N para romper la caché), sin crear un job ni una tarjeta nueva (deliver_card crearía
// un duplicado: reference_deliver_card_no_duplicar). Nunca toca YouTube.
//
//   node factory/tools/actualizar_entrega.mjs <slug> <video_jobs_id> <version> [--dry]
import { supaCreds } from "../../scripts/supa_creds.mjs";

const [slug, id, v, ...rest] = process.argv.slice(2);
if (!slug || !id || !v) { console.error("uso: node factory/tools/actualizar_entrega.mjs <slug> <video_jobs_id> <version> [--dry]"); process.exit(1); }
const REPO = process.env.BAGASY_REPO || "bagasy-search/claudeyoutubevideos";
const { U, K } = supaCreds();
const H = { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": "application/json" };

const cur = await (await fetch(`${U}/rest/v1/video_jobs?id=eq.${id}&select=id,slug,status,mp4_url`, { headers: H })).json();
if (!Array.isArray(cur) || !cur.length) { console.error(`no existe video_jobs ${id}`); process.exit(2); }
if (cur[0].slug !== slug) { console.error(`video_jobs ${id} es de "${cur[0].slug}", no de "${slug}": no toco nada`); process.exit(2); }
const url = `https://github.com/${REPO}/releases/download/${slug}/${slug}.mp4?v=${v}`;
const h = await fetch(url.replace(/\?.*$/, ""), { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(60_000) });
if (!h.ok) { console.error(`el release no responde (${h.status}): ${url}`); process.exit(2); }
console.log(`video_jobs ${id} (${slug}) · antes: ${cur[0].mp4_url}\n  después: ${url}`);
if (rest.includes("--dry")) process.exit(0);
const r = await fetch(`${U}/rest/v1/video_jobs?id=eq.${id}`, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify({ mp4_url: url }) });
const j = await r.json();
if (!r.ok || j?.[0]?.mp4_url !== url) { console.error("no se actualizó:", JSON.stringify(j).slice(0, 200)); process.exit(3); }
console.log("✓ actualizado (mismo job, misma tarjeta)");
