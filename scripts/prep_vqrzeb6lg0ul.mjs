import fs from "fs";
const SLUG = "vqrzeb6lg0ul";
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const w = (caps.segments || caps).map((x) => ({ t: x.text.trim(), a: x.startMs, b: x.endMs }));

// Momentos de ~3s, cortando en límite de palabra.
const TARGET = 3000, MAXD = 3600;
const moments = [];
let cur = null;
for (const x of w) {
  if (!cur) { cur = { ms: x.a, end: x.b, words: [x.t] }; continue; }
  const wouldBe = x.b - cur.ms;
  if (wouldBe > MAXD || (wouldBe > TARGET && /[.,;:!?]$/.test(cur.words[cur.words.length - 1] || ""))) {
    moments.push(cur); cur = { ms: x.a, end: x.b, words: [x.t] };
  } else { cur.words.push(x.t); cur.end = x.b; }
}
if (cur) moments.push(cur);

const out = moments.map((m, i) => ({
  name: `${SLUG}_s_${String(i).padStart(3, "0")}`,
  ms: m.ms,
  dur: +((m.end - m.ms) / 1000).toFixed(2),
  sec: +(m.ms / 1000).toFixed(2),
  phrase: m.words.join(" ").replace(/\s+/g, " ").trim(),
}));
fs.writeFileSync(`_v3/${SLUG}_moments.json`, JSON.stringify(out, null, 1));
fs.writeFileSync(`_v3/${SLUG}_capdump.txt`, out.map((m) => `[${Math.floor(m.sec/60)}:${String(Math.floor(m.sec%60)).padStart(2,"0")}] ${m.name} (${m.dur}s) ${m.phrase}`).join("\n"));
const durs = out.map(o=>o.dur);
console.log("momentos:", out.length, "| dur media:", (durs.reduce((a,b)=>a+b,0)/out.length).toFixed(2)+"s", "| max:", Math.max(...durs)+"s");
console.log("total video:", (out[out.length-1].ms/1000 + out[out.length-1].dur).toFixed(1)+"s");
