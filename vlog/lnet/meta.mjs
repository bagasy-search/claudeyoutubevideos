// public/<slug>_meta.json: título LITERAL de la tarjeta + descripción (link con ?src arriba, medidas exactas del libro, capítulos con
// minuto real, "More from Loretta" con los videos que nombra, hashtags) + comentario fijado sugerido. SLUG=x node vlog/lnet/meta.mjs
import fs from "node:fs";
import { CANAL, VIDEO } from "./canales.mjs";
import { MEDIDAS } from "./medidas.mjs";
const R = "D:/Proyectos/video2-wt/lnet/", SLUG = process.env.SLUG, V = VIDEO[SLUG], C = CANAL[V.ch];
const CARDS = JSON.parse(fs.readFileSync(R + "_v3/lnet_cards.json", "utf8")), P = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ts = (s) => { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, "0"); return h ? `${h}:${String(m).padStart(2, "0")}:${x}` : `${m}:${x}`; };
const ch = []; for (const p of P) { const i = p.sec.indexOf("@"); if (i < 0) continue; const t = ch.length ? p.s : 0; if (ch.length && t - ch[ch.length - 1].t < 15) continue; ch.push({ t, title: p.sec.slice(i + 1).trim() }); }
const url = C.url(SLUG), title = CARDS[SLUG].title;
const intro = { ck: "I'm Loretta. I'm 81, and I've cooked in the basement kitchen of our little country church in Iowa for sixty years. Here's the whole thing, with the exact amounts from my little book.",
  fo: "I'm Loretta. I'm 81, and for sixty years I cooked for a hundred people at a time in our church basement in Iowa. Then my Harold passed and I had to learn to cook for ONE. Here are the exact amounts from my little book.",
  cl: "I'm Loretta, 81. For sixty years the church ladies of Iowa kept a fellowship hall, a parsonage and their own homes spotless with what was under the sink. Here's exactly how, from my little book.",
  fh: "I'm Loretta, 81. I grew up on an Iowa farm next to a barn, a chicken house and a corn crib, and nobody ever called the exterminator. Here's exactly what my mother did, honestly, from my little book.",
  su: "I'm Loretta, 81. I've sat in the fourth pew on the left of a little Methodist church in Iowa for sixty years. Not a sermon, just what I've learned the slow way, with the verses (King James) and the pages of my little book." }[V.ch];
const more = [];
if (V.prev) more.push(`Last time: ${CARDS[V.prev].title}`);
more.push(`Next on this channel: ${CARDS[V.next].title}`);
more.push(`On my ${CANAL[VIDEO[V.net].ch].name} channel: ${CARDS[V.net].title}`);
const description = `📖 My little book "${C.book}", every page with the exact amounts: ${url}

${intro}

${MEDIDAS[SLUG]}

CHAPTERS
${ch.map((c) => `${ts(c.t)} ${c.title}`).join("\n")}

MORE FROM LORETTA
${more.join("\n")}
My channels: Loretta's Church Kitchen · Loretta Cooks for One · Loretta's House Hacks · Loretta's Clean Home · Loretta's Farmhouse · Loretta's Sunday Morning

Questions about the book: bagasystudio@gmail.com
This video is general home advice from an old church lady, not professional advice. Use one product at a time and follow the safety notes.

${C.hashtags}`;
const pinned = `Here's my little book with every page and the exact amounts, honey: ${url}\nNow tell me in the comments, I read every one. God bless you. ~ Loretta`;
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log(`${SLUG}: meta ${description.length} chars · ${ch.length} capítulos · título "${title.slice(0, 60)}"`);
