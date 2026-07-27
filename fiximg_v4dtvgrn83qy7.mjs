// fiximg_v4dtvgrn83qy7.mjs — arregla los `image=undefined` que emite beatsheet.mjs.
//
// DOS problemas de una:
// 1) SINTAXIS: beatsheet interpola `image=undefined` sin llaves cuando el beat no trae imagen.
//    tsc no lo caza (el .gen.tsx no está en el include), pero esbuild sí y tira abajo el bundle
//    entero en el farm — que fue lo que pasó.
// 2) PLACEHOLDER VACÍO: los componentes con prop `image` opcional (ImpactReveal, CalloutMark,
//    KineticQuote…) dibujan un degradado gris con un círculo si no se la pasás, y en la cuadrícula
//    se ve como una caja sin terminar. Los autores casi nunca la ponen.
//
// Fix: en vez de borrar el prop, se AUTO-RELLENA con la imagen del momento MÁS CERCANO en el tiempo
// (habla de lo mismo por construcción). Si no hay ninguna imagen cerca, ahí sí se borra el prop.
// beatsheet.mjs es COMPARTIDO con los otros agentes, así que el arreglo va acá, sobre mi cues.
import fs from "fs";

const CUES = "src/VideoEdit/cues_v4dtvgrn83qy7.gen.tsx";
let s = fs.readFileSync(CUES, "utf8");
const lineas = s.split("\n");

// mapa tiempo → imagen, leyendo los cues de fondo (RawShot con src img/…)
const imgs = [];
for (const ln of lineas) {
  const m = ln.match(/start: ([\d.]+),.*?src="(img\/[^"]+)"/);
  if (m) imgs.push({ t: +m[1], src: m[2] });
}
imgs.sort((a, b) => a.t - b.t);
const cercana = (t) => {
  if (!imgs.length) return null;
  let best = imgs[0];
  for (const c of imgs) if (Math.abs(c.t - t) < Math.abs(best.t - t)) best = c;
  return Math.abs(best.t - t) <= 25 ? best.src : null; // 25s de tolerancia: más lejos ya no habla de lo mismo
};

let rellenados = 0, borrados = 0;
const out = lineas.map((ln) => {
  if (!ln.includes("=undefined")) return ln;
  const mt = ln.match(/start: ([\d.]+)/);
  const t = mt ? +mt[1] : 0;
  return ln.replace(/\b([a-zA-Z]+)=undefined/g, (_all, prop) => {
    if (prop === "image") {
      const src = cercana(t);
      if (src) { rellenados++; return `image="${src}"`; }
    }
    borrados++;
    return "";
  }).replace(/\s{2,}/g, " ");
});

// 3) props NUMÉRICOS/booleanos emitidos SIN llaves (`airTemp=5`, `hitAt=1.2`): mismo origen, misma
//    consecuencia — esbuild no los acepta y se cae el bundle entero. Sólo tocamos props cuyo valor
//    NO arranca con comilla ni con `{`, que son exactamente los mal emitidos.
let enllavados = 0;
const out2 = out.map((ln) => {
  if (!/^\s*\{ key: "/.test(ln)) return ln;
  // valor alfanumérico simple SOLAMENTE. Con `[^\s/>]+` el regex se comía el `},` de cierre
  // de la entrada y partía el array — un fix que rompe más de lo que arregla.
  return ln.replace(/\b([a-zA-Z][a-zA-Z0-9]*)=(?!["'{])(-?[A-Za-z0-9_.]+)(?=[\s/])/g, (_a, prop, val) => {
    enllavados++;
    return `${prop}={${val}}`;
  });
});

fs.writeFileSync(CUES, out2.join("\n"));
console.log(`image auto-rellenada con la toma más cercana: ${rellenados} · props borrados por no haber imagen cerca: ${borrados} · props numéricos enllavados: ${enllavados}`);

const final = out2.join("\n");
const quedan = final.match(/=undefined/g);
if (quedan) { console.error(`✖ quedaron ${quedan.length} =undefined`); process.exit(1); }
// verificación real: que esbuild lo parsee (tsc NO ve este archivo y por eso el bug llegó al farm)
const esbuild = await import("esbuild");
try { esbuild.transformSync(final, { loader: "tsx" }); }
catch (e) {
  for (const er of e.errors || []) console.error(`✖ ${er.location.line}:${er.location.column} ${er.text}\n   ${er.location.lineText.slice(Math.max(0, er.location.column - 60), er.location.column + 80)}`);
  process.exit(1);
}
console.log("✓ esbuild parsea el cues — el bundle no se cae");
