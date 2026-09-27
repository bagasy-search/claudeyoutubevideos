// lee la tarjeta de tfbpiedra (sólo lectura)
import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds();
const r = await fetch(`${U}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: { apikey: K, Authorization: "Bearer " + K } });
const [row] = await r.json();
const c = row.plan.find(x => x.id === "fbv51790543074490-3" || x.card_id === "fbv51790543074490-3");
console.log(JSON.stringify(c, null, 1));
