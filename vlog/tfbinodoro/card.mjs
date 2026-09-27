// lee la tarjeta del plan (row 59) — sólo lectura
import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds();
const r = await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: { apikey: K, Authorization: "Bearer " + K } })).json();
const card = r[0].plan.find(c => c.id === process.argv[2] || c.card_id === process.argv[2]);
console.log(JSON.stringify(card, null, 1));
