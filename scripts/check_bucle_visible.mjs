// ⛔⛔ COMPUERTA NUEVA — EL BUCLE DEL AVATAR A LA VISTA (el punto ciego del anti-hueco).
//
// El anti-hueco pregunta "¿hay avatar OCULTO y nada debajo?" (pantalla negra). Nunca pregunta lo
// contrario: "¿hay avatar VISIBLE donde no puede estarlo?". En un video con avatar PARCIAL, después
// de la costura el avatar va en bucle y MUTEADO: si asoma, la boca no coincide con la voz.
//
// Medido en `fcscolageno` sobre el render: 169 s (8% de la zona Fish) en 51 tramos, con todas las
// demás compuertas en verde. Causa: `buildWindows` es una secuencia de puntos "el último gana", no
// un modelo de intervalos — cuando dos coberturas se SOLAPAN, el punto de FIN de la primera pone
// `full` aunque la segunda siga en pantalla.
//
//   node scripts/check_bucle_visible.mjs <slug> [--self]
import fs from "node:fs";

const SLUG = process.argv[2];
const SELF = process.argv.includes("--self");
if (!SLUG) { console.error("uso: node scripts/check_bucle_visible.mjs <slug> [--self]"); process.exit(1); }

const U = SLUG.toUpperCase();
const src = fs.readFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, "utf8");
const grab = (name) => JSON.parse(src.match(new RegExp(`${U}_${name}[^=]*= (\\[.*?\\]);`, "s"))[1]);
const COVER = grab("COVER");
const BEATS = grab("BEATS");
const AVATAR_END = parseFloat(src.match(/AVATAR_END = ([0-9.]+)/)[1]);
const VIDEO_END = parseFloat(src.match(/VIDEO_END = ([0-9.]+)/)[1]);

const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const CAP = { errorstinger: 2.4, guardaesto: 10, mitoverdad: 8.5, freezezoom: 4.5, lowerthird: 6,
  frasecinetica: 5.5, pricewar: 8, ingredientduo: 6.5, hourdial: 6, pizarraexplica: 8.5, stat: 7,
  raisin: 9, malla: 11, carrusel: 13, recetaescena: 14, colador: 10, lineatiempo: 11, pliegue: 9,
  checklist: 10, callout: 7, bars: 8, process: 9, splitlist: 9 };
const comp = BEATS.filter((b) => b.kind && b.kind !== "raw");
const compDur = (b) => {
  const n = comp.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
  const room = n ? n.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, CAP[b.kind] ?? 6, room));
};

// reproducción EXACTA del buildWindows del Main, incluido el forzado de la zona Fish
function windows(conFix = true) {
  const pts = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of COVER) {
    const ps = c.kind === "video" && c.start + c.cov < AVATAR_END;
    const m = ps && flip ? "halfR" : "hidden";
    if (ps) flip = !flip;
    pts.push({ start: c.start, mode: m, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of comp) {
    if (OVERLAY.has(b.kind)) continue;
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + compDur(b)).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  let out = [], last = "";
  for (const p of pts) if (p.mode !== last) { out.push({ start: p.start, mode: p.mode }); last = p.mode; }
  if (conFix) {
    out = out.map((w) => (w.start >= AVATAR_END && w.mode === "full" ? { ...w, mode: "hidden" } : w));
    // ⛔ y el BORDE: la ventana que arranca ANTES de la costura y se extiende mas alla no la
    //    agarra el filtro de arriba. Se planta un punto explicito en AVATAR_END.
    out.push({ start: AVATAR_END, mode: "hidden" });
    out.sort((a, b) => a.start - b.start);
    const d = []; for (const x of out) if (!d.length || d[d.length - 1].mode !== x.mode) d.push(x);
    out = d;
  }
  return out;
}

function medir(W) {
  const modo = (t) => { let m = "full"; for (const w of W) { if (w.start <= t) m = w.mode; else break; } return m; };
  const cubre = (t) => COVER.some((c) => t >= c.start - 0.02 && t < c.start + c.cov)
    || comp.some((b) => !OVERLAY.has(b.kind) && t >= b.start && t < b.start + compDur(b));
  let visible = 0, fondo = 0, n = 0;
  const tramos = [];
  for (let t = AVATAR_END + 0.2; t < VIDEO_END; t += 0.2) {
    n++;
    const m = modo(t);
    if (m !== "hidden") {
      visible++;
      const u = tramos[tramos.length - 1];
      if (u && t - u[1] < 0.35) u[1] = t; else tramos.push([t, t]);
    } else if (!cubre(t)) fondo++;
  }
  return { n, visible, fondo, tramos: tramos.filter((x) => x[1] - x[0] >= 0.4) };
}

if (SELF) {   // control POSITIVO: sin el fix la compuerta TIENE que reprobar
  const malo = medir(windows(false));
  console.log(`[--self] sin el fix: bucle visible ${(malo.visible * 0.2).toFixed(0)}s en ${malo.tramos.length} tramos`);
  if (malo.visible === 0) { console.error("X el control positivo NO detecto nada: la compuerta no sirve"); process.exit(1); }
  console.log("[--self] OK: la compuerta SI caza el defecto cuando existe");
}

const r = medir(windows(true));
console.log(`── BUCLE VISIBLE · ${SLUG} · zona Fish ${(VIDEO_END - AVATAR_END).toFixed(0)}s`);
console.log(`   instantes medidos ${r.n} · avatar a la vista ${(r.visible * 0.2).toFixed(1)}s · fondo plano ${(r.fondo * 0.2).toFixed(1)}s`);
if (r.n < 500) { console.error("X midio menos de 500 instantes: no es un OK"); process.exit(1); }
for (const t of r.tramos.slice(0, 10)) console.log(`   X ${t[0].toFixed(1)}s .. ${t[1].toFixed(1)}s`);
if (r.visible > 0 || r.fondo * 0.2 > 3) {
  console.error(`⛔ NO RENDEES: el bucle mudo queda a la vista ${(r.visible * 0.2).toFixed(1)}s (los labios no sincronizan)`);
  process.exit(1);
}
console.log("✅ el avatar en bucle nunca queda a la vista y no se ve fondo plano");
