// B-roll stock for "cultivosep": assign a section-themed Pexels query per moment,
// cache one video search per distinct query (rate-limit friendly), distribute
// distinct clips (dedup), download to public/broll/cultivosep/<name>.mp4|.jpg,
// and write _v3/cultivosep_beats.json for build_cultivosep.mjs.
import fs from "node:fs";
import path from "node:path";
import { PEXELS_KEY } from "./stock_lib.mjs";

const SLUG = "cultivosep";
const OUT = `public/broll/${SLUG}`;
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync("_v3", { recursive: true });
const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, "utf8").replace(/^﻿/, ""));

// section boundaries in seconds → themed query pools (EN, documentary garden)
const SECTIONS = [
  { end: 189, key: "hook", pool: ["frost covered vegetable garden", "snow on kale leaves", "hands harvesting winter vegetables", "autumn vegetable garden bed", "sunrise over vegetable garden", "basket of fresh vegetables", "old farmer working garden", "planting seeds in soil hands", "leafy greens growing garden", "bare garden bed autumn", "winter garden morning frost", "rustic vegetables wooden table"] },
  { end: 341, key: "kale", pool: ["curly kale plant garden", "kale leaves close up", "frost on kale leaf", "harvesting kale by hand", "kale seedlings tray", "green kale growing field", "kale plant in snow", "hand picking kale leaf", "kale in winter garden"] },
  { end: 464, key: "acelga", pool: ["swiss chard rainbow garden", "chard leaves close up", "harvesting swiss chard", "chard plant in soil", "colorful chard stems", "cutting chard leaves", "chard seedlings garden", "bowl of chard leaves"] },
  { end: 605, key: "zanahoria", pool: ["carrots growing in soil", "pulling carrots from ground", "bunch of carrots with dirt", "carrot seedlings garden row", "straw mulch on garden bed", "carrots in harvest basket", "hand pulling a carrot", "frosty garden soil morning", "fresh carrots close up"] },
  { end: 710, key: "puerro", pool: ["leeks growing in garden", "harvesting leeks from soil", "rows of leeks garden", "leek plants close up", "bunch of fresh leeks", "leek and potato soup pot", "gardener holding leeks", "mounding soil around leeks"] },
  { end: 888, key: "ajo", pool: ["planting garlic cloves in soil", "garlic bulbs harvest", "garlic cloves close up", "garlic green shoots growing", "hand planting garlic clove", "garlic heads on rustic table", "garlic growing field", "straw covered garlic bed", "single garlic clove soil"] },
  { end: 960, key: "enemy", pool: ["supermarket vegetables plastic wrap", "grocery store produce aisle", "coins money in hand", "greenhouse with heater", "plastic wrapped spinach bag", "shopping cart with vegetables", "wilted supermarket greens"] },
  { end: 1112, key: "error", pool: ["low winter sun over field", "sunset over winter garden", "bare winter garden bed", "short winter day sunlight", "cloudy cold winter sky", "snow covered vegetable garden", "frost garden dawn light", "dormant garden winter"] },
  { end: 1173, key: "limits", pool: ["ripe tomatoes on vine", "peppers growing garden", "row cover fabric over garden", "low plastic tunnel garden", "frost cloth over vegetables", "covered raised bed winter"] },
  { end: 1e9, key: "recap", pool: ["hands planting a seedling", "harvest basket of vegetables", "watering vegetable garden", "gardener with harvest smiling", "wooden shed garden tools", "seed packets in hand", "kale chard carrots leeks garlic", "tending winter garden bed"] },
];
// keyword → strong query boosts (better sync when the narration names a thing)
const BOOST = [
  [/helad|escarch|frost/i, "frost on garden leaves"],
  [/nieve|snow/i, "snow covered garden"],
  [/cosech|harvest/i, "harvesting vegetables by hand"],
  [/semilla|siembr|plant/i, "planting seeds in soil"],
  [/paja|straw|mantillo|mulch/i, "straw mulch garden bed"],
  [/diente|garlic|ajo/i, "garlic cloves in soil"],
  [/sopa|soup/i, "vegetable soup pot"],
  [/vivero|super|góndola|gondola|plastic/i, "supermarket vegetables plastic"],
  [/sol|luz|light|day/i, "low winter sun field"],
];

const secOf = (sec) => SECTIONS.find((s) => sec < s.end);
const norm = (s) => (s || "").toLowerCase();

// assign query per moment
let poolIdx = {};
for (const m of skel) {
  const S = secOf((m.ms || 0) / 1000);
  let q = null;
  for (const [re, bq] of BOOST) if (re.test(m.phrase)) { q = bq; break; }
  if (!q) { poolIdx[S.key] = (poolIdx[S.key] || 0) + 1; q = S.pool[poolIdx[S.key] % S.pool.length]; }
  m.section = S.key; m.query = q; m.src = "stock"; m.queries = [q]; m.desc = q; m.shot = "wide";
}

// ── cached Pexels video search per distinct query ──
const vcache = {}; // query -> [{id, url, w, h, dur}]
async function searchVideos(q) {
  if (vcache[q]) return vcache[q];
  const u = new URL("https://api.pexels.com/videos/search");
  u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "12"); u.searchParams.set("size", "medium");
  const r = await fetch(u, { headers: { Authorization: PEXELS_KEY }, signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) { vcache[q] = []; return []; }
  const vids = ((await r.json()).videos || []).map((v) => {
    const f = (v.video_files || []).filter((x) => x.width && x.width >= 1280).sort((a, b) => (a.width - b.width))[0] || (v.video_files || [])[0];
    return f ? { id: v.id, url: f.link, w: f.width, h: f.height, dur: v.duration } : null;
  }).filter(Boolean);
  vcache[q] = vids; return vids;
}
async function searchPhoto(q, used) {
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "10");
  const r = await fetch(u, { headers: { Authorization: PEXELS_KEY }, signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!r?.ok) return null;
  const ph = ((await r.json()).photos || []).find((p) => !used.has("p" + p.id));
  return ph ? { id: "p" + ph.id, url: ph.src?.large2x || ph.src?.large } : null;
}
async function dl(url, dest) {
  const r = await fetch(url, { signal: AbortSignal.timeout(90000) });
  if (!r.ok) throw new Error("http " + r.status);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

const used = new Set();
let nClip = 0, nPhoto = 0, nMiss = 0;
for (const m of skel) {
  const mp4 = path.join(OUT, `${m.name}.mp4`), jpg = path.join(OUT, `${m.name}.jpg`);
  if ((fs.existsSync(mp4) && fs.statSync(mp4).size > 80000) || (fs.existsSync(jpg) && fs.statSync(jpg).size > 40000)) { nClip++; continue; }
  // try video (distinct, dedup)
  let got = false;
  const vids = await searchVideos(m.query).catch(() => []);
  const pick = vids.find((v) => !used.has("v" + v.id));
  if (pick) {
    try { await dl(pick.url, mp4); used.add("v" + pick.id); nClip++; got = true; } catch {}
  }
  if (!got) {
    // photo fallback
    const p = await searchPhoto(m.query, used).catch(() => null);
    if (p) { try { await dl(p.url, jpg); used.add(p.id); nPhoto++; got = true; } catch {} }
  }
  if (!got) { nMiss++; }
  if ((nClip + nPhoto + nMiss) % 25 === 0) console.log(`  ${nClip} clips · ${nPhoto} fotos · ${nMiss} sin asset (de ${skel.length})`);
  await new Promise((r) => setTimeout(r, 120));
}
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(skel, null, 1));
console.log(`DONE · ${nClip} clips + ${nPhoto} fotos + ${nMiss} sin asset (avatar full) · ${skel.length} momentos · ${Object.keys(vcache).length} búsquedas`);
