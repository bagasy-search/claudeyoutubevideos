// gate_shim_vdjso9de381j.mjs — density_gate busca `src/VideoEdit/Main_<slug>.tsx` y cuenta los
// `<Componente>` del JSX. El Main de _fed6 vive en `src/_fed6/` y es DATA-DRIVEN (recorre FEDZ_BEATS
// y despacha con un switch) → cada componente aparece UNA vez en el texto aunque se instancie 40.
// Este shim emite un Main_ sintético con COMPONENT_MANIFEST + ASSET_MANIFEST generados desde los
// beats REALES. Dos detalles sin los cuales mide mal igual:
//   · las rutas van ENTRECOMILLADAS (el regex del gate exige comilla)
//   · el manifiesto va en ORDEN CRONOLÓGICO (si no, avisa "TRAMOS PELADOS" que no existen)
// Además emite avatar_<slug>.gen.ts con las ventanas del avatar (el gate mide la bata desde ahí).
import fs from "fs";

const SLUG = "vdjso9de381j";
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const broll = JSON.parse(fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));

// kind → nombre de componente real del kit (para la VARIEDAD que mide el gate)
const COMPNAME = {
  headline: "Headline", stat: "StatBig", quote: "QuoteCard", chips: "ChipRow", splitlist: "BulletCascade",
  checklist: "CheckList", process: "FlowSteps", ingredients: "Ingredients", annotated: "AnnotatedShot",
  diagram: "DiagramSlides", rule: "RuleCard", nametag: "NameTag", board: "PizarraExplica", bars: "BarChart",
  callout: "CalloutCard", cross: "CrossCompare", blurexplainer: "BlurExplainer", pizarra: "PizarraExplica",
  lowerthird: "LowerThird", guardaesto: "GuardaEsto", errorstinger: "ErrorStinger", mitoverdad: "MitoVerdad",
  frasecinetica: "FraseCinetica", freezezoom: "FreezeZoom", focuscards: "FocusCardsVdj",
  avatarkeyword: "AvatarKeyword", avatarpizarra: "AvatarPizarra",
};

// evento cronológico único: {t, jsx, assets[]}
const ev = [];
for (const b of beats) {
  const assets = [];
  if (b.src) assets.push(b.src);
  if (b.image) assets.push(b.image);
  if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && assets.push(s.image));
  if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && assets.push(it.image));
  if (b.kind === "raw") { ev.push({ t: b.start, jsx: "RawShot", assets }); continue; }
  if (b.kind === "talk") continue;
  const name = COMPNAME[b.kind];
  if (name) ev.push({ t: b.start, jsx: name, assets });
}
for (const c of broll) ev.push({ t: c.start, jsx: "RawShot", assets: [c.src] });
ev.sort((a, b) => a.t - b.t);

const ext = (p) => (/\.(png|jpg|jpeg|webp|mp4|webm|mov)$/i.test(p) ? p : p + (p.startsWith("broll/") ? ".mp4" : ".png"));
const lines = ev.map((e) => `  <${e.jsx} />${e.assets.length ? "  // " + e.assets.map((a) => `"${ext(a)}"`).join(" ") : ""}`);

const out = `// SINTÉTICO para scripts/density_gate.mjs — NO se compila ni se importa.
// El build real es src/_fed6/VideoEdit/Main_${SLUG}.tsx (data-driven).
// Orden CRONOLÓGICO; rutas entrecomilladas (el regex del gate exige comilla).
export const Main${SLUG} = () => (<>
${lines.join("\n")}
</>);
`;
fs.mkdirSync("src/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, out);

// ventanas del avatar → el gate mide la BATA desde acá
const winsSrc = fs.readFileSync(`_avatar_windows_${SLUG}.json`, "utf8");
fs.writeFileSync(`src/_fed6/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// AUTO — ventanas del avatar (las lee density_gate para medir la bata).\nexport const AVATAR_WINDOWS_GEN = ${winsSrc};\n`);

console.log(`shim: ${ev.length} eventos (${ev.filter((e) => e.jsx !== "RawShot").length} componentes + ${ev.filter((e) => e.jsx === "RawShot").length} tomas)`);
