// STOCK de escenas.mjs → vlog/<slug>/beds.json (2 tomas por tramo: <id>_1 con STOCK[id], <id>_2 con STOCK2[id]) para vlog/claudio/stock.mjs
import fs from "node:fs"; import { pathToFileURL } from "node:url";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`;
const { STOCK, STOCK2, TOPIC = "pork chops" } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = Object.fromEntries(JSON.parse(fs.readFileSync(D + "segs.json", "utf8")).map((s) => [s.id, s]));
const beds = Object.keys(STOCK).flatMap((id) => [[1, STOCK[id]], [2, STOCK2[id]]].map(([n, q]) => ({ name: `${id}_${n}`, q,
  scene: `Real documentary footage for a ranch cook's video about ${TOPIC}, while he says: "${segs[id].text.slice(0, 220)}" — it must show: ${q}.` })));
fs.writeFileSync(D + "beds.json", JSON.stringify(beds, null, 1)); console.log(beds.length, "tomas stock");
