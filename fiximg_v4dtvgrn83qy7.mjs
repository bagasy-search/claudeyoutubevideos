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

// 9) TEXTO DEL GOLPE demasiado largo. ImpactReveal lo pone gigante y lo entra con un barrido:
//    arriba de ~20 caracteres se desborda por la derecha y el barrido todavía le tapa el arranque.
//    Se acorta al primer tramo con sentido (quedó a la vista en la cuadrícula).
const CORTES = {
  "Un roce de cola y se va al suelo": "Y se va al suelo",
  "Una chimenea de un centímetro": "Una chimenea",
  "A la media hora una explota": "Una explota",
  "El eléctrico es un adorno": "Un adorno",
};
let acortados = 0;
for (let i = 0; i < out5.length; i++) {
  for (const [largo, corto] of Object.entries(CORTES)) {
    if (out5[i].includes(`impact="${largo}"`)) { out5[i] = out5[i].replace(`impact="${largo}"`, `impact="${corto}"`); acortados++; }
  }
}
console.log(`textos de golpe acortados: ${acortados}`);

// 10) DepthText NO es un componente de texto: `back` y `fore` son RUTAS (foto de fondo + PNG con el
//     sujeto recortado). Los directores le pasaron frases y Remotion intentó cargar
//     "http://localhost:3000/public/Un%20pedacito%20de%20sol" → CancelledError, 9 chunks caídos.
//     Se convierte a KeyPhrase, que sí es de texto, conservando la frase larga.
let convertidos = 0;
for (let i = 0; i < out5.length; i++) {
  if (!/<DepthText\b/.test(out5[i])) continue;
  const fore = (out5[i].match(/\bfore="([^"]*)"/) || [])[1];
  const back = (out5[i].match(/\bback="([^"]*)"/) || [])[1];
  const texto = (fore && fore.length >= (back || "").length ? fore : back) || fore || back;
  if (!texto) continue;
  out5[i] = out5[i]
    .replace(/<DepthText\b[^>]*?\/>/, `<KeyPhrase durationInFrames={d} text=${JSON.stringify(texto)} />`)
    .replace(/kind: "depthtext"/, 'kind: "keyphrase"');
  convertidos++;
}
if (convertidos && !/import \{ KeyPhrase \}/.test(out5.join("\n"))) {
  const k = out5.findIndex((l) => /^import \{ RawShot \}/.test(l));
  out5.splice(k + 1, 0, 'import { KeyPhrase } from "./scenes/KeyPhrase";');
}
console.log(`DepthText (props de ruta con texto) convertidos a KeyPhrase: ${convertidos}`);

// ─────────────────────────────────────────────────────────────────────────────
// 11 a 15: SANEAMIENTO DE TIPOS. Los props los escribieron subagentes que no
// tenían a la vista la firma del componente, así que el cues salía con 194
// errores de TypeScript. Muchos son inocuos en pantalla, pero otros REVIENTAN
// el render en la nube (un `image` faltante = staticFile(undefined) = chunk
// cancelado, ya costó un render de 20 chunks). Como el cues se REGENERA, los
// arreglos viven acá y no en el archivo.
// ─────────────────────────────────────────────────────────────────────────────

const nombreComp = (ln) => (ln.match(/<([A-Z][A-Za-z0-9]*)/) || [])[1];

// lee el valor JSON de un prop `x={...}` respetando llaves/corchetes anidados y
// comillas (un `.match` glotón se comía el cierre de la entrada del array).
const leerPropJson = (ln, prop) => {
  const m = ln.match(new RegExp(`\\b${prop}=\\{`));
  if (!m) return null;
  const ini = m.index + m[0].length - 1;
  let i = ini, prof = 0, enStr = false, esc = false;
  for (; i < ln.length; i++) {
    const c = ln[i];
    if (enStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') enStr = false; continue; }
    if (c === '"') enStr = true;
    else if (c === "{" || c === "[") prof++;
    else if (c === "}" || c === "]") { if (--prof === 0) break; }
  }
  if (prof !== 0) return null;
  try { return { ini, fin: i, valor: JSON.parse(ln.slice(ini + 1, i)) }; } catch { return null; }
};
const escribirPropJson = (ln, sitio, nuevo) =>
  ln.slice(0, sitio.ini + 1) + JSON.stringify(nuevo) + ln.slice(sitio.fin);

// n fotos distintas alrededor del momento t (para los componentes que declaran
// la imagen OBLIGATORIA: sin ella el componente ni siquiera compila y en runtime
// Remotion pide "/undefined" y cancela el chunk).
const cercanasN = (t, n) => {
  if (!imgs.length) return [];
  const orden = [...imgs].sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t)).slice(0, n).sort((a, b) => a.t - b.t);
  return Array.from({ length: n }, (_, i) => orden[i % orden.length].src);
};

// 11) PROPS NUMÉRICOS QUE EL COMPONENTE DECLARA COMO TEXTO. `number`, `num` y
//     `total` son strings ("1", "04", "16") porque se pintan tal cual con ceros
//     a la izquierda; el paso 3 los había enllavado como números y tsc los
//     rechaza (40 errores "Type 'number' is not assignable to type 'string'").
//     airTemp de RadSkyV4dt además lleva el grado: el default es "12°".
const PROPS_TEXTO = {
  ProtectionTool: ["number"], MistakeCard: ["number"], RuleNumberScene: ["number"],
  ChapterTag: ["num"], NumberCard: ["number", "total"], StepTrack: ["number", "total"],
};
let entrecomilladosNum = 0;
for (let i = 0; i < out5.length; i++) {
  const comp = nombreComp(out5[i]);
  if (!comp) continue;
  for (const p of PROPS_TEXTO[comp] || []) {
    out5[i] = out5[i].replace(new RegExp(`\\b${p}=\\{(-?[\\d.]+)\\}`), (_a, v) => { entrecomilladosNum++; return `${p}="${v}"`; });
  }
  // OJO: acá todavía valen los nombres ORIGINALES del kit — el swap a las
  // variantes V4dt lo hace inject_propios, que corre DESPUÉS de este script.
  // Las firmas son idénticas, así que se listan los dos nombres.
  if (comp === "ColdRadiationSky" || comp === "RadSkyV4dt") {
    out5[i] = out5[i].replace(/\bairTemp=\{(-?[\d.]+)\}/, (_a, v) => { entrecomilladosNum++; return `airTemp="${v}°"`; });
  }
}
console.log(`props numéricos que el componente declara como texto: ${entrecomilladosNum}`);

// 12) VOCABULARIO CERRADO. Los directores inventaron valores para props que son
//     uniones de literales: accent="warm" / "#c9702f" / "energía", pos="bl",
//     mode="radiant". Se traduce al valor válido MÁS CERCANO (warm→amber,
//     bl/br→lower, radiant→flow, storage→rocket) y, si no hay traducción
//     sensata (accent="energía" era texto suelto, no un color), se quita el
//     prop para que gane el default del componente.
const TONOS = {
  ok: ["cold", "amber", "accent", "good", "danger"],
  syn: { warm: "amber", calido: "amber", cálido: "amber", terracota: "amber", ocre: "amber", fuego: "danger", hot: "danger", red: "danger", rojo: "danger", blue: "cold", frio: "cold", frío: "cold", verde: "good", green: "good", ink: "accent" },
  hex: "amber", // la marca es terrosa: cualquier hex que hayan puesto cae en ámbar
};
const POS = { ok: ["center", "lower"], syn: { bl: "lower", br: "lower", bottom: "lower", "bottom-left": "lower", "bottom-right": "lower", lower: "lower", tl: "center", tr: "center", top: "center", middle: "center" } };
const MODOS = { ok: ["flow", "rocket"], syn: { radiant: "flow", radiante: "flow", conveccion: "flow", convección: "flow", storage: "rocket", masa: "rocket", mass: "rocket", banco: "rocket" } };
const HUES = { ok: ["blue", "cold", "amber", "red"], syn: { warm: "amber", danger: "red", accent: "amber", good: "cold", terracota: "amber" } };
const ENUMS = {
  KeyPhrase: { accent: TONOS }, PhraseTag: { accent: TONOS, pos: POS },
  ChapterTag: { accent: TONOS }, ProcessSteps: { accent: TONOS, hue: HUES },
  NumberCard: { accent: TONOS }, StatPills: { accent: TONOS },
  AnnotatedImage: { hue: HUES }, RiskClock: { hue: HUES }, VsCard: { hue: HUES },
  CrossSection: { hue: HUES }, SizeScale: { hue: HUES }, CostTally: { hue: HUES },
  MassHeaterDiagram: { mode: MODOS }, MassHeaterV4dt: { mode: MODOS },
};
let traducidos = 0, enumsQuitados = 0;
for (let i = 0; i < out5.length; i++) {
  const tabla = ENUMS[nombreComp(out5[i])];
  if (!tabla) continue;
  for (const [prop, voc] of Object.entries(tabla)) {
    out5[i] = out5[i].replace(new RegExp(`\\s\\b${prop}="([^"]*)"`), (all, v) => {
      if (voc.ok.includes(v)) return all;
      const dest = voc.syn[v.toLowerCase()] || (voc.hex && /^#/.test(v) ? voc.hex : null);
      if (dest) { traducidos++; return ` ${prop}="${dest}"`; }
      enumsQuitados++;
      return "";
    });
  }
}
console.log(`valores de vocabulario cerrado traducidos: ${traducidos} · sin traducción, quitados para usar el default: ${enumsQuitados}`);

// 13) FORMA DE LOS OBJETOS. El grueso de los errores: los subagentes usaron
//     SIEMPRE las mismas claves genéricas ("note", "title", "label", "value")
//     sin mirar cómo se llama cada campo en el componente, y se saltearon los
//     campos OBLIGATORIOS. Dos consecuencias distintas:
//       · las claves de más son sólo ruido para tsc… salvo que la clave que SÍ
//         existe quede vacía: RiskClock sin `risk` divide por undefined y pinta
//         la aguja en NaN, VsCard sin `value` deja la tarjeta con el titulito
//         solo, CrossSection sin `color` dibuja bandas transparentes.
//       · los que piden imagen (`image`/`src` obligatorio) son los peligrosos:
//         staticFile(undefined) → CancelledError → chunk perdido en el farm.
//     Se renombra cada clave a su equivalente real (note→desc/sub/value,
//     title→label, value→d) y se COMPLETAN los obligatorios: `risk` escalona
//     0→1, `kind` de las anotaciones es "circle", las fotos salen de las tomas
//     más cercanas en el tiempo (hablan de lo mismo por construcción).
const BARRO = ["#8C5A34", "#B9793F", "#C98A4B", "#6E4526", "#A9794A", "#7A5230"];
const txt = (o, ...ks) => { for (const k of ks) if (typeof o?.[k] === "string" && o[k]) return o[k]; return undefined; };
const FORMAS = {
  RiskClock: {
    steps: (v, c) => v.map((s, i) => ({
      label: txt(s, "label", "title") || `Paso ${i + 1}`,
      ...(txt(s, "desc", "note", "sub") ? { desc: txt(s, "desc", "note", "sub") } : {}),
      risk: typeof s.risk === "number" ? s.risk : +(((i + 1) / v.length) * 0.95).toFixed(2),
    })),
  },
  VsCard: {
    left: (o) => lado(o), right: (o) => lado(o),
  },
  ProcessSteps: {
    steps: (v) => v.map((s) => ({
      title: txt(s, "title", "label") || "",
      ...(txt(s, "desc", "note", "sub") ? { desc: txt(s, "desc", "note", "sub") } : {}),
      ...(s.image ? { image: s.image } : {}),
    })),
  },
  CrossSection: {
    layers: (v) => v.map((l, i) => ({
      label: txt(l, "label", "title") || "",
      ...(txt(l, "depth", "note", "sub") ? { depth: txt(l, "depth", "note", "sub") } : {}),
      color: typeof l.color === "string" && /^#|^rgb/.test(l.color) ? l.color : BARRO[i % BARRO.length],
      ...(typeof l.weight === "number" ? { weight: l.weight } : {}),
    })),
    // marker es un objeto {label, atDepth, color}; llegó como string suelto
    marker: (m) => (typeof m === "string" ? { label: m } : m),
  },
  AnnotatedImage: {
    annotations: (v) => v.map((a) => ({
      kind: ["circle", "arrow", "underline"].includes(a.kind) ? a.kind : "circle",
      // x/y son 0..1; los mandaron en PORCENTAJE (50, 58) → el círculo caía 50
      // pantallas a la derecha de la foto.
      x: a.x > 1 ? +(a.x / 100).toFixed(3) : a.x,
      y: a.y > 1 ? +(a.y / 100).toFixed(3) : a.y,
      ...(txt(a, "label", "note", "title") ? { label: txt(a, "label", "note", "title") } : {}),
    })),
  },
  StatPills: {
    // pills es string[]; llegaron pares {k, v} → se aplastan a "clave: valor"
    pills: (v) => v.map((p) => (typeof p === "string" ? p : [txt(p, "k", "label", "title"), txt(p, "v", "value", "note")].filter(Boolean).join(": "))),
  },
  StruckCards: {
    items: (v, c) => { const f = cercanasN(c.t, v.length); return v.map((it, i) => ({ image: it.image || f[i], label: txt(it, "label", "title") || "", ...(typeof it.at === "number" ? { at: it.at } : {}) })); },
  },
  FloatCards: {
    cards: (v, c) => { const f = cercanasN(c.t, v.length); return v.map((it, i) => ({ label: txt(it, "label", "title") || "", src: it.src || it.image || f[i], at: typeof it.at === "number" ? it.at : +(i * (c.dur / (v.length + 1))).toFixed(2) })); },
  },
  RevealCards: {
    items: (v, c) => { const f = cercanasN(c.t, v.length); return v.map((it, i) => ({ src: it.src || it.image || f[i], label: txt(it, "label", "title") || "", ...(typeof it.at === "number" ? { at: it.at } : {}) })); },
  },
  GridReveal: {
    tiles: (v) => v.map((t, i) => ({ number: String(t.number ?? i + 1), name: txt(t, "name", "label", "title") || "" })),
  },
  SizeScale: {
    // `d` es el DIÁMETRO en px del círculo, no un porcentaje: 25/60/100 salían
    // como puntitos. Se reescala conservando la proporción entre ítems.
    items: (v) => {
      const max = Math.max(...v.map((it) => (typeof it.d === "number" ? it.d : it.value ?? 1)), 1);
      return v.map((it) => {
        const n = typeof it.d === "number" ? it.d : it.value ?? 1;
        return {
          label: txt(it, "label", "title") || "",
          ...(txt(it, "sub", "note", "desc") ? { sub: txt(it, "sub", "note", "desc") } : {}),
          d: Math.max(40, Math.round((n / max) * 240)),
          ...(it.flag ? { flag: true } : {}),
        };
      });
    },
  },
  JourneyCanvas: {
    // x/y son coordenadas del mundo y NO son opcionales: sin ellas el trazado
    // de la curva hace NaN y no se dibuja nada. Se arma un zigzag de izquierda
    // a derecha, que es como se usa en los otros videos.
    waypoints: (v) => v.map((w, i) => ({
      x: typeof w.x === "number" ? w.x : +(0.14 + (i * 0.72) / Math.max(1, v.length - 1)).toFixed(2),
      y: typeof w.y === "number" ? w.y : (i % 2 ? 0.5 : 0.26),
      ...(typeof w.z === "number" ? { z: w.z } : { z: i % 2 ? 0.1 : 0 }),
      ...(w.image ? { image: w.image } : {}),
      ...(txt(w, "label", "title") ? { label: txt(w, "label", "title") } : {}),
      ...(txt(w, "sub", "note", "desc") ? { sub: txt(w, "sub", "note", "desc") } : {}),
      num: String(w.num ?? i + 1),
    })),
  },
};
// lado de VsCard: {label arriba, value = el dato grande, sub = pie}
function lado(o) {
  if (typeof o === "string") return { label: o, value: o };
  const val = txt(o, "value", "note", "desc") || txt(o, "label") || "";
  return {
    label: txt(o, "label", "title") || "",
    value: val,
    ...(txt(o, "sub") ? { sub: txt(o, "sub") } : {}),
    ...(typeof o.good === "boolean" ? { good: o.good } : {}),
  };
}
let formateados = 0;
for (let i = 0; i < out5.length; i++) {
  const tabla = FORMAS[nombreComp(out5[i])];
  if (!tabla) continue;
  const mt = out5[i].match(/start: ([\d.]+), dur: ([\d.]+)/);
  const ctx = { t: mt ? +mt[1] : 0, dur: mt ? +mt[2] : 5 };
  for (const [prop, fn] of Object.entries(tabla)) {
    const sitio = leerPropJson(out5[i], prop);
    if (!sitio) continue;
    let nuevo;
    try { nuevo = fn(sitio.valor, ctx); } catch { continue; }
    const antes = JSON.stringify(sitio.valor);
    out5[i] = escribirPropJson(out5[i], sitio, nuevo);
    if (JSON.stringify(nuevo) !== antes) formateados++;
  }
}
console.log(`objetos con la forma del componente corregida: ${formateados}`);

// 14) COSTTALLY NO VA. Es un gráfico de BARRAS DE DINERO: `total` es un number y
//     lo pinta como "$1.234". Acá el beat compara "lo que pierdes" (un poco de
//     calor) contra "lo que compras" (aire limpio, dormir tranquilo) — no hay
//     ningún monto. Inventarle números sería peor que el error de tipos, así
//     que se cambia por VsCard, que es exactamente esa comparación pero con
//     texto, y se conservan las dos columnas enteras.
let tallys = 0;
for (let i = 0; i < out5.length; i++) {
  if (!/<CostTally\b/.test(out5[i])) continue;
  for (const p of ["left", "right"]) {
    const sitio = leerPropJson(out5[i], p);
    if (!sitio) continue;
    const o = sitio.valor;
    const items = Array.isArray(o.items) ? o.items : [];
    // el 1er ítem es el dato grande; el resto (o su valor suelto) baja al pie
    const sub = items.length > 1
      ? items.slice(1).map((it) => txt(it, "k", "label", "title")).filter(Boolean).join(" · ")
      : txt(items[0] || {}, "v", "value", "note") || "";
    out5[i] = escribirPropJson(out5[i], sitio, {
      label: txt(o, "label", "title") || "",
      value: items.length ? txt(items[0], "k", "label", "title") || "" : txt(o, "value", "note") || "",
      ...(sub ? { sub } : {}),
      good: p === "right",
    });
  }
  out5[i] = out5[i].replace(/<CostTally\b/, "<VsCard").replace(/kind: "costtally"/, 'kind: "vs"');
  tallys++;
}
if (tallys && !/import \{ VsCard \}/.test(out5.join("\n"))) {
  const k = out5.findIndex((l) => /^import \{ RawShot \}/.test(l));
  out5.splice(k + 1, 0, 'import { VsCard } from "./scenes/VsCard";');
}
console.log(`CostTally (barras de dinero sin montos) convertidos a VsCard: ${tallys}`);

// 15) TAGS DE MASSHEATER. `fire`/`mass`/`out` son {text, sub?} y llegaron como
//     strings sueltos: el componente hace t.text y pinta el hueco vacío.
let tags = 0;
for (let i = 0; i < out5.length; i++) {
  if (!/<MassHeater(Diagram|V4dt)\b/.test(out5[i])) continue;
  for (const p of ["fire", "mass", "out"]) {
    const sitio = leerPropJson(out5[i], p);
    if (!sitio || typeof sitio.valor !== "string") continue;
    out5[i] = escribirPropJson(out5[i], sitio, { text: sitio.valor });
    tags++;
  }
}
console.log(`tags de MassHeater envueltos en {text}: ${tags}`);

// 16) LA FOTO DE FONDO NO SIEMPRE SE LLAMA `image`. NumberCard la declara como
//     `bg` (acepta también un clip .mp4), así que tanto lo que escribieron los
//     directores como lo que rellena el paso 8 quedaban como prop desconocido:
//     tsc lo rechaza y en pantalla el número salía sobre el fondo pelado.
let renombrados = 0;
const FOTO_ALIAS = { NumberCard: ["image", "bg"] };
for (let i = 0; i < out5.length; i++) {
  const alias = FOTO_ALIAS[nombreComp(out5[i])];
  if (!alias) continue;
  const [de, a] = alias;
  if (new RegExp(`\\b${a}=`).test(out5[i])) continue; // ya tiene la buena: la otra sobra
  out5[i] = out5[i].replace(new RegExp(`\\b${de}=`), () => { renombrados++; return `${a}=`; });
}
console.log(`props de foto de fondo renombrados al nombre real del componente: ${renombrados}`);

fs.writeFileSync(CUES, out5.join("\n"));
console.log(`image auto-rellenada con la toma más cercana: ${rellenados} · props borrados por no haber imagen cerca: ${borrados} · props numéricos enllavados: ${enllavados}`);

const final = out5.join("\n");
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
