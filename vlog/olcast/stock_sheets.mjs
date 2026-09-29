// Hojas de contacto del stock por toma: candidatos del pool (juez ontopic, sin texto) filtrados por las consultas de esa toma.
import fs from "node:fs";
const P = "D:/rtmp/olcast_src/pex/";
const pool = JSON.parse(fs.readFileSync(P + "pool.json", "utf8")), J = JSON.parse(fs.readFileSync(P + "juez.json", "utf8"));
const NAMES = {
  s_cupboard: ["kitchen cupboard pots pans", "old kitchen utensils"], s_ovendoor: ["open oven door", "cast iron pan oven"], s_oilpan: ["pouring cooking oil", "frying pan heat"],
  s_bacon: ["frying bacon pan"], s_sausage: ["sausage frying pan"], s_hashbrowns: ["hash browns frying"], s_highburner: ["frying pan heat", "iron pan flames"],
  s_oilbottle: ["pouring cooking oil"], s_smokepan: ["smoke rising pan"], s_oilpour: ["pouring cooking oil", "frying pan heat"], s_fleamarket: ["flea market antiques", "antique market kitchenware"],
  s_scrub: ["scrubbing rust", "washing pan sink scrubbing"], s_rustclose: ["rust close up", "rusty metal", "rusty cast iron skillet"], s_vinegar: ["vinegar bottle pouring"],
  s_dryburner: ["cast iron pan stove", "frying pan heat"], s_dryburner2: ["cast iron skillet cooking", "cast iron pan stove"], s_washpan: ["washing pan sink scrubbing"],
  s_scrapepan: ["cast iron skillet cooking", "washing pan sink scrubbing"], s_charcoalsmoke: ["charcoal briquettes", "fire smoke alarm"], s_embers: ["wood fire coals", "charcoal briquettes"],
  s_cornbread: ["cornbread skillet"], s_baconcold: ["frying bacon pan"], s_briquettes: ["charcoal briquettes"],
};
const out = {};
for (const [n, qs] of Object.entries(NAMES)) out[n] = Object.values(pool).filter((v) => qs.includes(v.q) && J[v.id]?.ontopic && !J[v.id]?.text).map((v) => v.id);
fs.writeFileSync(P + "cands.json", JSON.stringify(out, null, 1));
for (const [n, a] of Object.entries(out)) console.log(n, a.length);
