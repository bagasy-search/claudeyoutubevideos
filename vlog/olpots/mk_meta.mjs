// public/olpots_meta.json + guiones/olpots.txt listos para deliver_card. Capítulos con los tiempos REALES
// (inicio de párrafo en el máster = inicio en el MP4: el video arranca en el cuadro 0 del máster).
// NO hay links de afiliado (ver AFILIADOS_PENDIENTES.md): la descripción lleva sólo el link del libro.
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olpots/";
const P = JSON.parse(fs.readFileSync(R + "_v3/olpots_paras.json", "utf8"));
const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "The shelf"], [2, "The five pots, named"], [4, "My four questions"], [6, "#1 Cast iron Dutch oven"], [16, "#2 The 12-inch cast iron skillet"], [25, "#3 The enamel stockpot"], [32, "#4 Stainless stockpot (thick bottom)"], [37, "#5 The heavy saucepan"], [41, "The 3 I would never buy"], [46, "The whole shelf"]];
const chapters = CH.map(([p, t]) => `${ts(P[p].s)} ${t}`).join("\n");
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (the Dutch oven bread in this video is page 25, the pot beans page 12): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-olpots

Come sit down, friend. Here is the whole shelf written out, so you can keep it.

THE 5 POTS I'D BUY (types, not brands)
1. Cast iron Dutch oven, 5-6 qt. Thick walls, tight lid. Flat bottom and flat lid for the house; legs and a rimmed lid for a fire.
2. 12-inch cast iron skillet (about 8 lb). Stove to a 450°F oven and back.
3. Enamel stockpot, 12 qt or bigger. Steel with glass fused on: light, doesn't react with tomato or vinegar. Retire it if the chip is on the inside.
4. Stainless steel stockpot with a thick "sandwich" bottom (aluminum or copper core). Stainless alone is a poor heat conductor.
5. Heavy 2-3 qt saucepan with a lid that fits. Thick base so milk and oatmeal don't scorch.

BUYING IRON (secondhand is fine)
- Set it on the counter and spin it. If it rocks, put it back.
- Tap the rim with a knuckle: a clear ring means sound iron; a dull thud can mean a crack.
- Light rust, black crust and old grease come off. Cracks and deep pits don't.

DUTCH OVEN COALS (rule of thumb, a starting point)
Pot width in inches x 2 = briquettes. A 12-inch oven: about 24, two thirds on the lid and one third underneath, near 350°F. Quarter turn the pot every 15 minutes and the lid the other way. Gloves on, lid lifted away from your face, and never burn coals indoors, in a tent or in a garage (carbon monoxide).

CAST IRON CARE
- Mild dish soap is fine on a seasoned pan. Wash it while it's still warm.
- Dry it on a burner over low heat, then rub in a thin film of oil and wipe off the extra.
- Never soak it in the sink and never put it in the dishwasher.
- Seasoning: a very thin coat of oil, wiped off as if you made a mistake, baked upside down at 450-500°F for one hour with foil on the rack below.

THE 3 I WOULD NEVER BUY
1. Cheap nonstick over a hot fire. The coating maker's own guidance puts the limit around 500°F and warns against heating the pan empty; the fumes from overheated coatings can make people sick and are dangerous to pet birds.
2. Thin stamped aluminum stockpots. Hot spots, and they warp.
3. Glazed pottery of unknown origin (handmade-looking, flea market, bright orange/red/yellow). The FDA warns that lead can be in the glaze, and acidic food pulls out more.

Sources: coating maker's safety guidance (Teflon); U.S. FDA, "Questions and Answers on Lead-Glazed Traditional Pottery"; thermal conductivity of aluminum, iron and stainless steel from standard engineering tables; Dutch oven history: Abraham Darby's 1707 patent for casting iron in sand.

Tell me in the comments: which pot in your kitchen is older than you are?

CHAPTERS
${chapters}

Ole's Camp Kitchen
(Ole is the channel's cook-character; the recipes are traditional methods adapted and tested for home kitchens. Archival images: public domain via Wikimedia Commons / DPLA; stock footage: Pexels.)`;
const meta = {
  title: "I Cooked for Loggers for 40 Years — These Are the Only 5 Pots I'd Buy",
  description,
  pinned_comment: "The whole shelf: cast iron Dutch oven, 12-inch cast iron skillet, enamel stockpot, stainless stockpot with a thick bottom, and a heavy little saucepan with a lid that fits. Everything I cook in this kitchen is written down in my cookbook, 50 recipes with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-olpots — and tell me: which pot in your kitchen is older than you are?",
};
fs.writeFileSync(R + "public/olpots_meta.json", JSON.stringify(meta, null, 2));
console.log(chapters);
