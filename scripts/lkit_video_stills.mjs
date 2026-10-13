// lkit · stills de un video armado con el Player: node scripts/lkit_video_stills.mjs <slug> <seg> [seg ...]
//   → out/<slug>_stills/<seg>.png y out/<slug>_stills.jpg (hoja con el segundo escrito). Empaqueta UNA vez.
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const [slug, ...secs] = process.argv.slice(2);
const out = path.join(root, "out", `${slug}_stills`);
fs.mkdirSync(out, { recursive: true });
// sin outDir: el bundle va a TEMP (poné TEMP en la carpeta de trabajo). Nunca borrar a mano un bundle: public/ trae junctions.
const serveUrl = await bundle({ entryPoint: path.join(root, "src", `index_${slug}.tsx`), publicDir: path.join(root, "public") });
const comp = (await getCompositions(serveUrl)).find((c) => c.id === "Full");
const ok = [];
for (const s of secs) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(+s * 30));
  try { await renderStill({ composition: comp, serveUrl, output: path.join(out, `${s}.png`), frame, overwrite: true }); ok.push(s); console.log("ok", s); }
  catch (e) { console.log("FALLA", s, String(e.message || e).slice(0, 200)); }
}
// hoja con PIL (el drawtext de ffmpeg falla con la ruta de la fuente en Windows)
const py = `import sys,os
from PIL import Image,ImageDraw,ImageFont
d,o=sys.argv[1],sys.argv[2];S=sys.argv[3:]
f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',22)
c=4;r=(len(S)+c-1)//c
H=Image.new('RGB',(c*646+6,r*400+6))
for i,s in enumerate(S):
  t=Image.new('RGB',(640,394));t.paste(Image.open(os.path.join(d,s+'.png')).convert('RGB').resize((640,360)),(0,34));ImageDraw.Draw(t).text((10,6),s+' s',fill='white',font=f);H.paste(t,(6+(i%c)*646,6+(i//c)*400))
H.save(o,quality=85)`;
execFileSync("python", ["-c", py, out, path.join(root, "out", `${slug}_stills.jpg`), ...ok]);
console.log("hoja:", path.join(root, "out", `${slug}_stills.jpg`));
