// prompts.mjs — DIRECTOR del canal Before Us: shots.txt (escena por momento) → prompts gpt-image-2 completos.
//   node vlog/beforeus/prompts.mjs <slug>
// Entradas: vlog/<slug>/shots.txt · vlog/beforeus/cast.json · D:/rtmp/<slug>/moments.json
// Salidas:  D:/rtmp/<slug>/prompts_all.json ({i, part, kind, cast, subject, prompt}) · D:/rtmp/<slug>/gpt_items.json
// Receta (feedback 27-sep "fotograma accidental de video común"): situación física + cámara común, en positivo,
// todo en foco, sólo la luz que el lugar tiene; nada de vocabulario de cine.
import fs from "node:fs";

const SLUG = process.argv[2];
const REPO = `D:/Proyectos/video2-wt/${SLUG}/`, R = `D:/rtmp/${SLUG}/`;
const CAST = JSON.parse(fs.readFileSync(REPO + "vlog/beforeus/cast.json", "utf8"));
const WJ = REPO + `vlog/${SLUG}/world.json`;
if (fs.existsSync(WJ)) { const w = JSON.parse(fs.readFileSync(WJ, "utf8")); Object.assign(CAST, { ...w, light: { ...CAST.light, ...(w.light || {}) } }); }
const moments = JSON.parse(fs.readFileSync(R + "moments.json", "utf8"));
const lines = fs.readFileSync(REPO + `vlog/${SLUG}/shots.txt`, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
const LIGHT = CAST.light;
const CAM_PAST = "one ordinary frame pulled from a normal handheld video shot at eye level by someone walking along with the scene, framing casual and a little off with something cut by the edge of the frame, almost everything in focus with the whole place readable and nothing blurred out, automatic white balance, mild sensor noise and compression";
const CAM_NOW = "one ordinary frame pulled from a normal phone video shot by a friend in the room, framing casual and a little off, almost everything in focus with the whole room readable and nothing blurred out, ordinary everyday clutter around, automatic white balance, mild sensor noise";
const NOBODY_X = "a wildlife frame with no people anywhere in the frame, no tourists, no vehicles, no buildings";
const TAIL = "people caught mid-action and unposed, realistic skin and worn materials, no text, no letters, no logos, no watermark";
const BAN = /\b(cinematic|photorealistic|8k|bokeh|35mm|shallow depth|blurred background|golden hour|moody|dramatic lighting|hyperreal|ultra realistic|out of focus[^,;]*|naked|nude|blood|gore)\b/gi;
const out = [], items = [], prob = [];
const seen = new Set();
for (const l of lines) {
  const [i, kind0, cast, light, ...rest] = l.split("|");
  const scenes = rest.join("|").split("||").map((s) => s.trim());
  const mi = +i;
  if (!moments[mi]) { prob.push(`momento ${i} no existe`); continue; }
  seen.add(mi);
  const who0 = cast ? cast.split(",").filter(Boolean) : [];
  scenes.forEach((sc00, part) => {
    // override por parte: "@cast=hunter,boy texto" · "@obj texto" · "@scene texto"
    let kind = kind0, who = who0, sc0 = sc00;
    const ov = sc00.match(/^@(cast|obj|scene|now)(?:=([a-z,]+))?\s+/);
    if (ov) { kind = ov[1]; who = ov[2] ? ov[2].split(",") : []; sc0 = sc00.slice(ov[0].length); }
    let sc = sc0.replace(BAN, "").replace(/\s{2,}/g, " ").replace(/\s+,/g, ",");
    const lt = LIGHT[light] ?? "";
    let p;
    if (kind === "now") {
      p = `${CAM_NOW}. ${sc}. ${CAST.now.desc}. ${lt}. ${TAIL}`;
    } else {
      const castTxt = who.map((w) => CAST.people[w].desc).join("; ");
      const prehist = /^[DENM]$/.test(light);
      const world = prehist ? (kind === "obj" ? CAST.empty : CAST.world) : (kind === "obj" && light === "X" && /\b(monkey|vervet|baboon|bird|hawk|eagle|leopard|lion|hyena|wolf|chimpanzee|macaw|parrot|antelope)s?\b/i.test(sc0) ? NOBODY_X : "");
      const ward = prehist && kind !== "obj" ? " " + CAST.wardrobe + "." : "";
      p = `${CAM_PAST}. ${world ? world + ". " : ""}${sc}.${castTxt ? " " + castTxt + "." : ""}${ward} ${lt}. ${kind === "obj" ? TAIL.replace("people caught mid-action and unposed, ", "") : TAIL}`;
    }
    p = p.replace(/\.\s*\./g, ".").replace(/\s{2,}/g, " ");
    if (p.length < 260) prob.push(`${i}_${part} prompt corto`);
    if (/\bcinematic|bokeh|8k\b/i.test(p)) prob.push(`${i}_${part} vocabulario de cine`);
    const name = `ah_${String(mi).padStart(3, "0")}_${part}`;
    const refs = (kind === "now" ? ["hunter"] : kind === "cast" ? who : []).map((w) => CAST.people[w].face);
    out.push({ i: mi, part, kind: kind === "cast" ? "cast" : kind, cast: kind === "cast" ? who : [], subject: sc0.slice(0, 120), prompt: p });
    items.push({ name, prompt: p, ...(refs.length ? { ref: refs.length === 1 ? refs[0] : refs } : {}) });
  });
}
for (const m of moments) if (!seen.has(m.i)) prob.push(`momento ${m.i} sin plano`);
// cero sujetos repetidos seguidos (mismo comienzo de escena)
for (let k = 1; k < out.length; k++) if (out[k].subject.slice(0, 40) === out[k - 1].subject.slice(0, 40)) prob.push(`${out[k].i} repite sujeto`);
fs.writeFileSync(R + "prompts_all.json", JSON.stringify(out, null, 1));
fs.writeFileSync(R + "gpt_items.json", JSON.stringify(items, null, 1));
const kinds = out.reduce((a, o) => ((a[o.kind] = (a[o.kind] || 0) + 1), a), {});
console.log(`MEDIDO: ${out.length} prompts de ${moments.length} momentos · ${JSON.stringify(kinds)} · problemas ${prob.length}`);
if (prob.length) { console.log(prob.slice(0, 30).join("\n")); process.exit(1); }
