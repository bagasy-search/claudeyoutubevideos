// manifest_vlhdvm2isyur.mjs — emite src/VideoEdit/Main_vlhdvm2isyur.tsx: el MANIFIESTO que lee
// density_gate. NO se rendea (el build real vive en src/_fed6/VideoEdit/Main_vlhdvm2isyur.tsx);
// es la lista plana de visuales con `startSec:` para que el gate pueda medir densidad y variedad
// con TIEMPO REAL en vez de con la posición en la secuencia.
import fs from "fs";

const SLUG = "vlhdvm2isyur";
const rd = (f) => { const s = fs.readFileSync(f, "utf8"); return JSON.parse(s.slice(s.indexOf("= [") + 2, s.lastIndexOf("]") + 1)); };
const B = rd(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`);
const R = rd(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`);

// kind del beatsheet → nombre del componente JSX (el gate cuenta cada <Tag>)
const TAG = {
  diagram: "DiagramBoard", stat: "Stat", board: "Board", chips: "Chips", checklist: "Checklist",
  process: "Process", quote: "Quote", headline: "Headline", nametag: "NameTag", rule: "Rule",
  cross: "Cross", bars: "Bars", callout: "Callout", annotated: "Annotated", splitlist: "SplitList",
  lowerthird: "LowerThird", frasecinetica: "FraseCinetica", mitoverdad: "MitoVerdad",
  errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", avatarkeyword: "AvatarKeyword",
  looplock: "LoopLockVlh", focuscards: "FocusCardsVlh", freezezoom: "FreezeZoom",
  avatarpizarra: "AvatarPizarra",
  raw: "RawShot",   // foto del presentador a pantalla completa: es TOMA PLANA, no suma a variedad
};

const rows = [];
for (const b of B) {
  if (b.kind === "talk") continue;
  const tag = TAG[b.kind];
  if (!tag) { console.warn("  ⚠ kind sin tag:", b.kind); continue; }
  const img = (b.slides || [])[0]?.image || (b.items || []).find?.((x) => x && x.image)?.image;
  rows.push({ t: b.start, jsx: `<${tag} startSec={${b.start}}${img ? ` image="${img}"` : ""} />` });
  // las focuscards muestran VARIAS imágenes: que el gate las vea todas
  if (b.kind === "focuscards") for (const it of b.items.slice(1)) rows.push({ t: b.start, jsx: `<FocusCardsVlh startSec={${b.start}} image="${it.image}" />` });
}
for (const c of R) rows.push({ t: c.start, jsx: `<RawShot startSec={${c.start}} src="${c.src}" />` });
rows.sort((a, b) => a.t - b.t);

const end = Math.max(...B.map((x) => x.start + x.dur), R.length ? R[R.length - 1].start + R[R.length - 1].dur : 0) + 1.2;
const out =
  `// AUTO-GENERADO por scripts/manifest_${SLUG}.mjs — MANIFIESTO para density_gate.\n` +
  `// ⚠ Este archivo NO se rendea. El build real es src/_fed6/VideoEdit/Main_${SLUG}.tsx\n` +
  `// (entry: src/index_${SLUG}.tsx). Acá sólo vive la lista de visuales con su segundo,\n` +
  `// que es lo que la compuerta necesita para medir densidad y variedad con tiempo real.\n` +
  `export const TOTAL_FRAMES_MANIFEST = ${Math.round(end * 30)};\n` +
  `export const Manifest${SLUG} = () => (\n  <>\n` +
  rows.map((r) => `    ${r.jsx}`).join("\n") +
  `\n  </>\n);\n`;
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, out);

const comps = rows.filter((r) => !r.jsx.startsWith("<RawShot"));
console.log(`manifiesto: ${rows.length} visuales · ${comps.length} componentes · ${R.length} clips`);
console.log(`crudo ${((R.length / rows.length) * 100).toFixed(0)}% (tope 78) · densidad ${(comps.length / (end / 60)).toFixed(1)} usos/min (mediana buena 3.8)`);
