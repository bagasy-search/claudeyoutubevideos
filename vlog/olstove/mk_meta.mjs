// public/olstove_meta.json + guiones/olstove.txt listos para deliver_card. Capítulos con los tiempos REALES
// (inicio de párrafo en el máster = inicio en el MP4: el video arranca en el cuadro 0 del máster). node vlog/olstove/mk_meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olstove/";
const P = JSON.parse(fs.readFileSync(R + "_v3/olstove_paras.json", "utf8"));
const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "Come in, friend"], [3, "Four safety things before you light anything"], [9, "Is a wood stove free heat?"], [11, "The trick: light the fire from the top"], [20, "Dry wood and the moisture meter"], [26, "How to buy firewood (the cord)"], [30, "What never goes in the stove"], [31, "The damper and the air control"], [36, "Reloading the stove safely"], [39, "Draft, chimney height and the cap"], [43, "A page from the book: the pot that never stops"], [45, "Creosote and the chimney"], [49, "Keeping the heat in the room"], [53, "Cooking on the stove: chicken and dumplings"], [55, "Your power outage plan"], [57, "The four things again and your fall calendar"]];
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (the stove-top bone broth in this video is page 36, the chicken and dumplings page 30): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-olstove

Come in, friend, and shut the door. Here is the whole wood stove routine from this video, written out so you can keep it. No magic and no free heat: the same wood, burned the right way, gives you more warmth and less soot.

FOUR SAFETY THINGS FIRST
1. A carbon monoxide alarm that works, on every floor and outside where folks sleep. Test it once a month, and check its batteries before the storm.
2. Nothing from a can to light the fire: no gasoline, no kerosene, no charcoal lighter. Dry kindling and one twist of paper or a natural fire starter.
3. Read the label and the manual on your stove for the clearances, and keep anything that can burn at least three feet away.
4. Ashes go in a metal pail with a lid, outside, well away from the house. Never a paper sack or a cardboard box.

OLE'S WOOD STOVE ROUTINE
1. Dry wood: it burns best at 20 percent moisture or less. Split a piece, test the middle with a moisture meter. Split wood needs six months at the very least, dense hardwoods about a year. Stack it off the ground, cover only the top, leave the sides open.
2. Buy by the cord: 4 ft high x 4 ft deep x 8 ft long, 128 cubic feet. A "face cord" is only a fraction. If the meter reads over 30 percent, the wood is not seasoned.
3. Never burn trash, cardboard, plastic, painted or treated lumber, plywood or anything with glue in it.
4. Light it from the TOP: big splits on the bottom, a second layer crosswise, thin dry kindling and a twist of paper on top. Light the paper. The fire burns downward and the flames burn the smoke.
5. Burn hot with the air open for the first 15-20 minutes, doors closed. A smoldering fire is not safe and not efficient.
6. Then close the damper or air control a quarter turn at a time. If the glass blackens, open the air.
7. Reload on a bed of coals: open the air first, open the door slowly, two or three dry splits, leave room above them.
8. Chimney: have it inspected and cleaned every year by a professional, and sweep when creosote reaches about 1/8 inch. Look with a flashlight every month or two. A roar in the pipe, or flames and dense smoke out the top, means everybody out and call the fire department.
9. Keep the heat in the room: heavy things hold heat, close the doors to rooms you are not using, plug the leaks, but never seal the stove itself.
Always follow your own stove's manual and your local fire code.

Tell me in the comments: what do you burn in your stove, and how do you know it's dry?

CHAPTERS
${chapters}

Ole's Camp Kitchen
(Ole is the channel's cook-character; the recipes are traditional methods adapted and tested for home kitchens. Facts: EPA Burn Wise, U.S. Fire Administration, Chimney Safety Institute of America, University of Maryland Extension, Penn State Extension. Archival photos: public domain, National Archives, Library of Congress, New York Public Library and Internet Archive via Wikimedia Commons.)`;
const meta = {
  title: "The Old Wood Stove Trick That Kept Our Camp Kitchen Warm All Winter",
  description,
  pinned_comment: "The trick, written down: dry wood (under 20 percent, check it with a meter), light the fire from the TOP, and close the air down a quarter turn at a time. Everything I cook on this stove is in my cookbook, 50 recipes with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-olstove\n\nWhat do you burn in your stove, and how do you know it's dry?"
};
fs.writeFileSync(R + "public/olstove_meta.json", JSON.stringify(meta, null, 2));
fs.writeFileSync(R + "guiones/olstove.txt", fs.readFileSync(R + "guiones/olstove.txt", "utf8"));
console.log(chapters);
