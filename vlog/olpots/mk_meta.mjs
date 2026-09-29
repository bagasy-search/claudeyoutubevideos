// public/olpots_meta.json + guiones/olpots.txt listos para deliver_card. Capítulos con los tiempos REALES
// (inicio de párrafo en el máster = inicio en el MP4: el video arranca en el cuadro 0 del máster).
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olpots/";
const P = JSON.parse(fs.readFileSync(R + "_v3/olpots_paras.json", "utf8"));
const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "The bowl on the counter"], [3, "Who I am"], [5, "The cookbook (page 7)"], [6, "The overnight soak myth"], [8, "What about the gas?"], [9, "Rule 1: No soak, just sort"], [11, "Rule 2: Hard boil 10 minutes (safety)"], [14, "Rule 3: Then a whisper"], [15, "How to tell they're done"], [16, "Rule 4: Salt from the start"], [17, "Rule 5: Fat in the pot"], [18, "Rule 6: Acid and sweet go in last"], [21, "Rule 7: Mind the age of your beans"], [22, "Rule 8: Save the pot liquor"], [23, "Bean-hole beans"], [29, "Sunday morning: digging up the pot"], [30, "The kitchen version"], [32, "The mistakes, quick"], [33, "The whole method on one card"]];
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (the bean method in this video is page 7): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-beans

Come sit down, friend. Here is the whole bean method written out, so you can keep it.

OLE'S CAMP BEAN METHOD (1 lb dried pinto or navy beans, serves 6-8)
1. No overnight soak. Sort out stones and broken beans, rinse.
2. Put beans, 8 cups cold water, 4 oz salt pork or thick bacon, 1 halved onion, 1 Tbsp kosher salt, 1/2 tsp pepper and a bay leaf in a heavy pot. Salt goes in now, not later.
3. Bring to a hard rolling boil and hold it a full 10 minutes. This step is for safety, on every dried bean. Skim the foam.
4. Drop the heat to a whisper: barely a bubble, lid cracked. Never a hard boil after this.
5. Simmer 1 1/2 to 2 hours, adding hot water if the level drops. Tender means a bean mashes easily on your tongue.
6. NOW add the acid: 1-2 Tbsp cider vinegar (tomato and molasses go in only when the beans are already tender). Acid early keeps beans hard.
7. Rest 15 minutes. Never pour the broth down the drain.
Old beans (over a year or two) may never soften: buy from a store that sells lots of beans, and add 1/8 tsp baking soda per pound. Never cook raw kidney beans in a slow cooker. Leftovers: cool within 2 hours, fridge up to 4 days, reheat to 165°F.

Tell me in the comments what your family said about salt and beans, and where you're cooking from.

CHAPTERS
${chapters}

Ole's Camp Kitchen
(Ole is the channel's cook-character; the recipes are traditional methods adapted and tested for home kitchens. Archival photos: public domain, Library of Congress / DPLA / NARA via Wikimedia Commons.)`;
const meta = {
  title: "NEVER Cook Beans Again Without This Old Logging Camp Trick",
  description,
  pinned_comment: "The trick: no overnight soak, salt at the START, a hard boil for 10 full minutes, then down to a whisper with the lid cracked — and the vinegar, tomato and molasses only once the beans are tender. Everything I cook in this kitchen is written down in my cookbook, 50 recipes with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-beans",
};
fs.writeFileSync(R + "public/olpots_meta.json", JSON.stringify(meta, null, 2));
console.log(chapters);
