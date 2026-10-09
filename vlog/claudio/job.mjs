// Crea el video_jobs del video (provider claude-code, plantilla = job 740 de clborde) y lo engancha a SU tarjeta del row 305 (por slug).
// SLUG=x node vlog/claudio/job.mjs   (idempotente: si la tarjeta ya tiene job, no hace nada) · backup del plan antes del PATCH
import fs from "node:fs";
import { U, H, get } from "./sb.mjs";
const SLUG = process.env.SLUG, ROW = 312; // rama Old Mechanic (EN)
const ch = (await get(`tracked_channels?select=id,channel_key,plan&id=eq.${ROW}`))[0];
const card = ch.plan.find((c) => c.slug === SLUG); if (!card) throw new Error("no hay tarjeta con slug " + SLUG);
if (card.videoJobId) { console.log("ya tiene job", card.videoJobId, "· tarjeta", card.id); process.exit(0); }
const old = (await get(`video_jobs?id=eq.740`))[0];
const job = { user_id: old.user_id, slug: SLUG, format: old.format, niche: old.niche, channel_name: "Claudio Old Mechanic", voice_ref: "elevenlabs_v4_turbo:RWL6II44QhopvDMTeB1D", provider: "claude-code", status: "running", script: "", progress: "Generando video", title: card.title, card_id: card.id, tracked_channel_id: ROW, mode: old.mode, channel_key: ch.channel_key };
for (const k of Object.keys(job)) if (!(k in old) && k !== "slug") delete job[k];
const r = await fetch(`${U}/rest/v1/video_jobs`, { method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(job) });
const nj = await r.json(); console.log(r.status, JSON.stringify(nj).slice(0, 160));
const id = nj[0].id;
const fresh = (await get(`tracked_channels?select=plan&id=eq.${ROW}`))[0].plan;
fs.mkdirSync(`D:/rtmp/${SLUG}_work`, { recursive: true });
fs.writeFileSync(`D:/rtmp/${SLUG}_work/backup_plan312_antes_job.json`, JSON.stringify(fresh));
fresh.find((c) => c.id === card.id).videoJobId = id;
const p = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ROW}`, { method: "PATCH", headers: H, body: JSON.stringify({ plan: fresh }) });
const back = (await get(`tracked_channels?select=plan&id=eq.${ROW}`))[0].plan;
console.log("patch", p.status, "job", id, "tarjetas", back.length, "· readback", back.find((c) => c.id === card.id).videoJobId);
