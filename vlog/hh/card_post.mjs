// Tras deliver_card: pone en la TARJETA la descripción final (public/<slug>_meta.json) y el comentario fijado sugerido (pinned_comment).
// node vlog/hh/card_post.mjs <card_id> <slug>
import fs from "node:fs"; import { supaCreds } from "../../scripts/supa_creds.mjs";
const [card, S] = process.argv.slice(2); const { U, K } = supaCreds(); const H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
const m = JSON.parse(fs.readFileSync(`D:/Proyectos/video2-wt/lhh/public/${S}_meta.json`, "utf8"));
const ch = (await (await fetch(`${U}/rest/v1/tracked_channels?select=id,plan&channel_key=eq.draft:lorettahacks&role=eq.own`, { headers: H })).json())[0];
let n = 0; const plan = ch.plan.map((p) => p.id === card ? (n++, { ...p, description: m.description, yt_description: m.description, pinned_comment: m.pinned_comment, cta_url: `https://lorettaschurch.com/house?src=${S}` }) : p);
if (n !== 1) { console.error("tarjeta no encontrada", card); process.exit(1); }
const r = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ch.id}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ plan }) });
const c = (await (await fetch(`${U}/rest/v1/tracked_channels?select=plan&id=eq.${ch.id}`, { headers: H })).json())[0].plan.find((p) => p.id === card);
console.log(S, "tarjeta →", r.status, "· job", c.videoJobId, "· pin", c.pinned_comment?.includes(`lorettaschurch.com/house?src=${S}`) ? "✓" : "⛔", "· desc", c.yt_description?.startsWith(`https://lorettaschurch.com/house?src=${S}`) ? "✓" : "⛔");
