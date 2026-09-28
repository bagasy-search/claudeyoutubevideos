import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds();
const r = await fetch(`${U}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: { apikey: K, Authorization: "Bearer " + K } });
const [row] = await r.json();
const c = row.plan.find(p => p.id === "fbv51790543074490-4" || p.card_id === "fbv51790543074490-4");
console.log(JSON.stringify(c, null, 1));
