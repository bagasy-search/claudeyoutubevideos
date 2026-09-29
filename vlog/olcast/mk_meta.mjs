// public/olcast_meta.json listo para deliver_card. Capítulos con los tiempos REALES (inicio de párrafo del máster = inicio en el MP4).
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olcast/";
const P = JSON.parse(fs.readFileSync(R + "_v3/olcast_paras.json", "utf8"));
const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "The rusty pan"], [2, "The store way (and why it fails)"], [4, "What seasoning really is"], [7, "The camp cook's trick: wipe it OFF"], [8, "Which oil, and the smoke point"], [9, "Into the oven"], [11, "Let the frying finish the job"], [13, "The second reason food sticks: the fire"], [15, "The flick test"], [17, "The rusty pan at the flea market"], [19, "Bringing rust back to life"], [21, "The 10-second mistake"], [22, "Cleaning it right"], [24, "Dutch oven and coals"], [27, "The first few weeks"], [28, "Fixing common problems"], [29, "Your homework for tonight"], [30, "The whole routine"]];
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (a cast iron add-on is offered right after you get the book): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-olcast

Come sit down, friend. Here is the whole iron routine written out, so you can keep it.

OLE'S IRON ROUTINE
SEASON IT (thin, hot, repeat)
1. Wash the pan, dry it completely, and warm it a little so the pores open.
2. A few drops of plain oil (canola or vegetable) on a paper towel. Rub it over the whole pan, inside, outside and handle. Then wipe it ALL off with a clean paper towel, like you made a mistake. It should look nearly dry.
3. Bake it upside down at 450–500°F for one hour, with foil on the rack below to catch drips. Turn the oven off and let it cool inside.
4. Repeat 3 to 5 times, thin each time. Then cook bacon, sausage and potatoes in it: every time hot fat touches the pan, it adds one more thin layer. (Smoke alarm going off? The coat was too thick.)
COOK IN IT
5. Medium heat, never past it. Let the pan sit 2–3 minutes. Fat in, and food goes in only when the fat shimmers. Flick test: a few drops of water should gather into beads and skate around.
6. First few weeks: bacon, sausage, fried chicken, cornbread, hash browns. Hold off on long simmers of tomato, wine, vinegar or lemon.
CLEAN IT
7. Rinse warm, scrub with a brush or sponge. A little mild soap is fine. Stuck food: simmer half an inch of water for a few minutes, then scrape.
8. Dry it on a burner over low heat, rub in a thin film of oil, wipe off the extra. Never soak it, never the dishwasher, never cold water into a hot pan.
RESCUE A RUSTY ONE
9. Check it first: sits flat, rings clear when you tap the rim, no deep pitting. Scrub with hot water, a stiff brush and a little soap. Stubborn rust: 50/50 white vinegar and water for 30–60 minutes MAX, then scrub, dry right away and season.
DUTCH OVEN (outdoors only!)
10. Charcoal briquettes ≈ twice the pot's width in inches (12 in = about 24): two-thirds on the lid, one-third under, about 350°F to start. Quarter turn every 15 minutes. Cook with charcoal and wood fire ONLY outdoors: it makes carbon monoxide, which you cannot see or smell.

Tell me in the comments: what's the oldest pan in your kitchen, and who did it come from?

CHAPTERS
${chapters}

Ole's Camp Kitchen
(Ole is the channel's cook-character; the methods are traditional ones adapted and checked for home kitchens. Smoke points vary by brand and refining. Archival photos: public domain, Wikimedia Commons: Clark Kinsey, Carol M. Highsmith, Gary Truman, FiveRings.)`;
const meta = {
  title: "NEVER Season Cast Iron the Store Way Again — The Old Camp Cook's Trick",
  description,
  pinned_comment: "The trick in one line: a few drops of oil, then wipe it ALL off (it should look nearly dry), bake it upside down at 450–500°F for an hour, repeat 3 to 5 times, and let bacon finish the job. Everything I cook in this kitchen is written down in my cookbook, 50 recipes with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-olcast",
};
fs.writeFileSync(R + "public/olcast_meta.json", JSON.stringify(meta, null, 2));
console.log(chapters);
