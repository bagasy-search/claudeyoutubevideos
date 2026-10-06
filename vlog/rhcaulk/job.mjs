// Crea el video_jobs de rhcaulk (provider claude-code) y lo engancha a la tarjeta del row 302. node vlog/rhcaulk/job.mjs
import fs from "node:fs";
import { U, H, get } from "./sb.mjs";
const CARD = "plan-own-1791246085234-3";
const ch = (await get(`tracked_channels?select=id,plan&id=eq.302`))[0];
const card = ch.plan.find((c) => c.id === CARD);
if (card.videoJobId) { console.log("ya tiene job", card.videoJobId); process.exit(0); }
const old = (await get(`video_jobs?id=eq.612`))[0];
const job = { user_id: old.user_id, slug: "rhcaulk", format: old.format, niche: "Cleaning lady peroxide EN", channel_name: "Rhonda the Cleaning Lady", voice_ref: "rhonda", provider: "claude-code", status: "running", script: "", progress: "Generando video", title: card.title, card_id: CARD, tracked_channel_id: 302, mode: old.mode, channel_key: "draft:rhondacleans" };
for (const k of Object.keys(job)) if (!(k in old) && !["slug"].includes(k)) delete job[k];
const r = await fetch(`${U}/rest/v1/video_jobs`, { method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(job) });
const nj = await r.json(); console.log(r.status, JSON.stringify(nj).slice(0, 300));
const id = nj[0].id;
const fresh = (await get(`tracked_channels?select=plan&id=eq.302`))[0].plan;
fs.writeFileSync("D:/rtmp/rhcaulk_work/backup_plan302_antes_job.json", JSON.stringify(fresh));
fresh.find((c) => c.id === CARD).videoJobId = id;
const p = await fetch(`${U}/rest/v1/tracked_channels?id=eq.302`, { method: "PATCH", headers: H, body: JSON.stringify({ plan: fresh }) });
console.log("patch", p.status, "job", id, "tarjetas", fresh.length);
