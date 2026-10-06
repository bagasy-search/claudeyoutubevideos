// Crea el video_jobs de clborde (provider claude-code) y lo engancha a la tarjeta del row 303. node vlog/clborde/job.mjs
import fs from "node:fs";
import { U, H, get } from "./sb.mjs";
const CARD = "plan-own-1791284273106-0", ROW = 303;
const ch = (await get(`tracked_channels?select=id,plan&id=eq.${ROW}`))[0];
const card = ch.plan.find((c) => c.id === CARD);
if (card.videoJobId) { console.log("ya tiene job", card.videoJobId); process.exit(0); }
const old = (await get(`video_jobs?id=eq.725`))[0];
const job = { user_id: old.user_id, slug: "clborde", format: old.format, niche: "Conserje agua oxigenada ES", channel_name: "Claudio el Conserje", voice_ref: "claudio_mendoza_s4", provider: "claude-code", status: "running", script: "", progress: "Generando video", title: card.title, card_id: CARD, tracked_channel_id: ROW, mode: old.mode, channel_key: "draft:claudioconserje" };
for (const k of Object.keys(job)) if (!(k in old) && !["slug"].includes(k)) delete job[k];
const r = await fetch(`${U}/rest/v1/video_jobs`, { method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(job) });
const nj = await r.json(); console.log(r.status, JSON.stringify(nj).slice(0, 200));
const id = nj[0].id;
const fresh = (await get(`tracked_channels?select=plan&id=eq.${ROW}`))[0].plan;
fs.mkdirSync("D:/rtmp/clborde_work", { recursive: true });
fs.writeFileSync("D:/rtmp/clborde_work/backup_plan303_antes_job.json", JSON.stringify(fresh));
fresh.find((c) => c.id === CARD).videoJobId = id;
const p = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ROW}`, { method: "PATCH", headers: H, body: JSON.stringify({ plan: fresh }) });
console.log("patch", p.status, "job", id, "tarjetas", fresh.length);
