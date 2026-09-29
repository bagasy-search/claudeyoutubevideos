// Plan agnes 2.5-flash de los 4 HABLADOS del minuto 1 con la VOZ NUEVA (v3): mismas anclas K0-K7 de M1 (copiadas),
// tramos del máster nuevo en tramos_v3/. node vlog/lorpies/mkplan_m1v3.mjs
import fs from "node:fs";
import { R, act, plan } from "./lib.mjs";
const src = JSON.parse(fs.readFileSync(R + "vlog/lorpies/M1/plan.json", "utf8"));
const keep = ["m1", "m2", "m4", "m5"];
const clips = src.clips.filter((c) => keep.includes(c.id)).map((c) => ({ ...c, audio: R + `vlog/lorpies/tramos_v3/${c.id}.wav` }));
const anchors = src.anchors.filter((a) => /^K[0-7]$/.test(a.id));
const p = plan("vlog/lorpies/M1v3", anchors, clips);
fs.writeFileSync(R + "vlog/lorpies/M1v3/plan.json", JSON.stringify(p, null, 1));
console.log("plan M1v3:", anchors.length, "anclas,", clips.length, "clips, lang", p.lang);
