import { supaCreds } from "../../scripts/supa_creds.mjs";
const c = supaCreds();
const url = c.U, key = c.K;
const r = await fetch(`${url}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: { apikey: key, Authorization: "Bearer " + key } });
const j = await r.json();
const card = j[0].plan.find(x => (x.id || x.card_id) === "fbv51790543074490-6");
console.log(JSON.stringify(card, null, 1));
