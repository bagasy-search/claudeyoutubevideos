import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds(); const H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
let j = await (await fetch(`${U}/rest/v1/video_jobs?id=eq.572&select=id,status,provider,mp4_url`, { headers: H })).json(); console.log("antes", j);
await fetch(`${U}/rest/v1/video_jobs?id=eq.572`, { method: "PATCH", headers: H, body: JSON.stringify({ provider: "claude-code" }) });
j = await (await fetch(`${U}/rest/v1/video_jobs?id=eq.572&select=id,status,provider,mp4_url`, { headers: H })).json(); console.log("después", j);
const [row] = await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: H })).json();
for (const c of row.plan) if (c.videoJobId || c.done) console.log(c.id, c.videoJobId, c.done);
const r = await fetch(j[0].mp4_url.replace("?v=2", ""), { method: "HEAD", redirect: "follow" }); console.log("mp4 HTTP", r.status);
