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

// 4) IDENTIFICADORES sueltos donde va un valor. beatsheet emite `size={${b.size}}` asumiendo que
//    `size` es numérico; los directores mandaron "lg"/"xl" y quedó `size={lg}` → ReferenceError en
//    runtime (bundle OK, el frame explota). Traducimos los tamaños y entrecomillamos el resto.
//    `{d}` es la duración y `{A}` es COLORS.accent: esos SÍ existen en el archivo.
const TALLAS = { xs: 56, sm: 72, md: 92, lg: 110, xl: 130, xxl: 150 };
const DEFINIDOS = new Set(["d", "A"]);
let tallas = 0, comillas = 0, quitados = 0;
const out3 = out2.map((ln) => {
  if (!/^\s*\{ key: "/.test(ln)) return ln;
  return ln
    .replace(/\bsize=\{([a-z]+)\}/g, (all, v) => (TALLAS[v] ? (tallas++, `size={${TALLAS[v]}}`) : all))
    .replace(/\baccent=\{(?:true|false)\}/g, () => (quitados++, ""))
    .replace(/\b([a-zA-Z][a-zA-Z0-9]*)=\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (all, prop, val) => {
      if (DEFINIDOS.has(val) || val === "true" || val === "false") return all;
      comillas++;
      return `${prop}="${val}"`;
    })
    .replace(/\s{2,}/g, " ");
});
console.log(`tallas traducidas: ${tallas} · identificadores entrecomillados: ${comillas} · accent booleanos quitados: ${quitados}`);

// 5) VALORES FUERA DE RANGO y listas demasiado largas — todo esto lo cazó la cuadrícula de auditoría:
//    · hitAt es el instante del golpe DENTRO del beat (0.5-2.5 s). Un director puso 45 → el impacto
//      nunca llega y en pantalla queda una barra naranja a medio dibujar.
//    · una lista de 4 ítems no alcanza a revelarse entera en un beat de 5 s: se ven las casillas
//      vacías. Se recorta a 3 (misma lección que ya dejó el video del sótano).
let clamps = 0, podados = 0;
const out4 = out3.map((ln) => {
  if (!/^\s*\{ key: "/.test(ln)) return ln;
  const durM = ln.match(/dur: ([\d.]+)/);
  const dur = durM ? +durM[1] : 5;
  return ln
    .replace(/\bhitAt=\{([\d.]+)\}/g, (all, v) => {
      const n = +v;
      if (n >= 0.3 && n <= Math.max(1, dur - 1.5)) return all;
      clamps++;
      return `hitAt={${Math.min(1.6, Math.max(0.6, dur * 0.28)).toFixed(1)}}`;
    })
    .replace(/\b(items|chips|pills|tiles|cards|steps|bars)=\{(\[[^\]]*\])\}/g, (all, prop, arr) => {
      let v; try { v = JSON.parse(arr); } catch { return all; }
      if (!Array.isArray(v) || v.length <= 3) return all;
      podados++;
      return `${prop}={${JSON.stringify(v.slice(0, 3))}}`;
    });
});
console.log(`hitAt fuera de rango corregidos: ${clamps} · listas podadas a 3 ítems: ${podados}`);

// 6) DOS COMPONENTES GRANDES ENCIMA — se tapan y el cuadro queda ilegible. Los chicos (etiquetas de
//    esquina, sellos, barridos) sí pueden convivir con uno grande, así que sólo se recorta cuando
//    los DOS ocupan pantalla. Al primero se le acorta la duración hasta el arranque del segundo.
const CHICOS = new Set(["phrasetag", "stattag", "metertag", "chapter", "verified", "steptrack",
  "impstamp", "loctag", "nametag", "alertwipe", "callout", "float", "presenter"]);
const idxOv = out4.findIndex((l) => l.includes("export const OVERLAYS"));
const finOv = out4.findIndex((l, i) => i > idxOv && /^\];/.test(l));
const filas = [];
for (let i = idxOv + 1; i < finOv; i++) {
  const m = out4[i].match(/\{ key: "([^"]+)", start: ([\d.]+), dur: ([\d.]+), kind: "([^"]+)"/);
  if (m) filas.push({ i, t: +m[2], d: +m[3], kind: m[4] });
}
filas.sort((a, b) => a.t - b.t);
let recortes = 0;
for (let a = 0; a < filas.length; a++) {
  if (CHICOS.has(filas[a].kind)) continue;
  for (let b = a + 1; b < filas.length; b++) {
    if (filas[b].t >= filas[a].t + filas[a].d) break;
    if (CHICOS.has(filas[b].kind)) continue;
    const nueva = +(filas[b].t - filas[a].t - 0.15).toFixed(2);
    if (nueva >= 1.8 && nueva < filas[a].d) {
      out4[filas[a].i] = out4[filas[a].i].replace(/dur: [\d.]+/, `dur: ${nueva}`);
      filas[a].d = nueva;
      recortes++;
    }
    break;
  }
}
console.log(`solapes de componentes grandes recortados: ${recortes}`);

// 7) LISTAS DE STRINGS donde el componente espera OBJETOS. Checklist declara
//    `items: CheckItem[]` con `{text}` y SignaturePhrase `lines: {text, gold?}[]`; los directores
//    mandaron strings sueltos, así que dibujaba las casillas VACÍAS. Se vio en la cuadrícula.
const FORMA = { Checklist: ["items", "text"], SignaturePhrase: ["lines", "text"] };
let envueltos = 0;
// 8) IMAGEN DE FONDO en los componentes que la tienen OPCIONAL: sin ella caen a un lavado sepia
//    plano (CalloutMark) o a un degradado gris, y en pantalla se lee como caja sin terminar.
//    Se les pasa la toma más cercana en el tiempo, que por construcción habla de lo mismo.
const CON_FOTO = new Set(["CalloutMark", "KineticQuote", "NumberCard", "AgedDoc", "MistakeCard",
  "ProtectionTool", "RedactedReveal", "ImpossibleStamp", "LieList", "Checklist"]);
let fotos = 0;
const out5 = out4.map((ln) => {
  if (!/^\s*\{ key: "/.test(ln)) return ln;
  let l = ln;
  for (const [comp, [prop, clave]] of Object.entries(FORMA)) {
    if (!l.includes(`<${comp} `)) continue;
    l = l.replace(new RegExp(`\\b${prop}=\\{(\\[[^\\]]*\\])\\}`), (all, arr) => {
      let v; try { v = JSON.parse(arr); } catch { return all; }
      if (!Array.isArray(v) || !v.length || typeof v[0] !== "string") return all;
      envueltos++;
      return `${prop}={${JSON.stringify(v.map((t) => ({ [clave]: t })))}}`;
    });
  }
  const mc = l.match(/<([A-Z][A-Za-z0-9]*) /);
  if (mc && CON_FOTO.has(mc[1]) && !/\bimage=/.test(l)) {
    const mt = l.match(/start: ([\d.]+)/);
    const src = cercana(mt ? +mt[1] : 0);
    if (src) { fotos++; l = l.replace(/\s*\/>/, ` image="${src}" />`); }
  }
  return l;
});
console.log(`listas envueltas en objetos: ${envueltos} · componentes que se quedaban sin foto de fondo: ${fotos}`);

fs.writeFileSync(CUES, out5.join("\n"));
console.log(`image auto-rellenada con la toma más cercana: ${rellenados} · props borrados por no haber imagen cerca: ${borrados} · props numéricos enllavados: ${enllavados}`);

const final = out4.join("\n");
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
