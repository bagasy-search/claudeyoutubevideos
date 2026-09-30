import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds(); const H = { apikey: K, Authorization: "Bearer " + K };
const r = await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.244&select=id,channel_key,plan`, { headers: H })).json();
const plan = r[0].plan; const arr = Array.isArray(plan) ? plan : (plan.items || plan.plan || []);
const c = arr.find((x) => x.id === "ole2026092508");
console.log(JSON.stringify({ title: c.title, done: c.done, videoJobId: c.videoJobId, keys: Object.keys(c) }));
const others = arr.filter((x) => x.id !== "ole2026092508").map((x) => [x.id, x.done, x.videoJobId].join(":"));
console.log(others.join(" | "));
