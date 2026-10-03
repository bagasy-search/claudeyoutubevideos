// job.mjs <slug> <rowId> <cardId> — crea el job de Bagasy (provider claude-code, running) y lo engancha a la tarjeta. Idempotente.
import { supaCreds } from "file:///C:/Users/bauti/Downloads/video2/scripts/supa_creds.mjs";
const { U, K } = supaCreds(); const H = { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": "application/json", Prefer: "return=representation" };
const [slug, rowId, cardId] = process.argv.slice(2);
let ch = (await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.${rowId}&select=plan,user_id,channel_key,name,niche`, { headers: H })).json())[0];
const card = ch.plan.find(c => c.id === cardId || c.id.endsWith(cardId));
if (!card) { console.log("NO CARD", cardId); process.exit(1); }
if (card.videoJobId) { console.log("ya", card.videoJobId); process.exit(0); }
const body = { user_id: ch.user_id, channel_key: ch.channel_key, channel_name: ch.name, slug, title: card.title, script: "", niche: ch.niche || "Claudio", format: "avatar", status: "running", progress: "Generando video (Claude Code)", provider: "claude-code", asset_mode: "mixto", thumb_url: card.thumb };
const r = await fetch(`${U}/rest/v1/video_jobs`, { method: "POST", headers: H, body: JSON.stringify(body) }); const j = await r.json();
if (!r.ok) { console.log("ERR", JSON.stringify(j)); process.exit(1); }
ch = (await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.${rowId}&select=plan`, { headers: H })).json())[0];
ch.plan.find(x => x.id === card.id).videoJobId = j[0].id;
const p = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${rowId}`, { method: "PATCH", headers: H, body: JSON.stringify({ plan: ch.plan }) });
console.log("job", j[0].id, "patch", p.status, "|", ch.channel_key, "|", card.id);
