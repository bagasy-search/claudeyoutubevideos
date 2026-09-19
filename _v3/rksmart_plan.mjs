// rksmart_plan.mjs — BEATSHEET de `rksmart`, anclado al ms REAL del máster.
//   node _v3/rksmart_plan.mjs
//
// ═══ LO QUE ESTE GENERADOR TIENE QUE CUMPLIR (todo medido, todo dolió una vez) ═══
// 1.bis EL VIDEO ABRE CON EL AVATAR HABLANDO (la ventana 0 arranca en 0 y dura ≥3 s).
// ⛔⛔ ACÁ EL AVATAR **NO** ES EL FONDO GARANTIZADO: sólo existe en las ventanas que se generaron
//     en RunPod. Fuera de ellas, si un instante no tiene beat, se ve NEGRO. Por eso la cobertura
//     tiene que dar **100 %**, no 90 — y se mide instante por instante, no por suma de duraciones.
// ⛔ RITMO HUMANO: la duración de cada plano la decide LO QUE SE DICE (el span real de la frase),
//     no una escalera de duraciones. Se mide la DISPERSIÓN (p25/p75), no la mediana.
// ⛔ Un clip de agnes dura 4,03 s: se usa sólo si el hueco entra en 4,03 + 2,5 de cola congelada.
//     Si el plano es más largo, va la FOTO (que ya existe: es el primer cuadro del clip).
// ⛔ Ningún asset se usa dos veces: el id sale del ÍNDICE DEL MOMENTO, no de un cursor corrido.
import fs from "node:fs";
import { ITEMS } from "./rksmart_prompts.mjs";

const FPS = 30, TOTAL = 1588.824;
// ⛔ COLA CERO: el gate del farm (agnes_qc_gate) marca como REPETICION todo plano mas largo que
//    su clip, y tiene razon — pasado el ultimo cuadro, OffthreadVideo congela. Asi que el clip se
//    usa SOLO si el hueco entra entero en su archivo; si no, va la foto (que es el primer cuadro
//    del mismo clip: mismo sujeto, misma escena, cero material nuevo).
const CLIP_S = 4.033, COLA_MAX = 2 / 30;
const MIN_PLANO = 0.6;
const CTA_BED = "rksmart_m264";             // cama del overlay del CTA (lejos, no repite vecino)

const mom = JSON.parse(fs.readFileSync("_v3/rksmart_mom.json", "utf8"));
const W = JSON.parse(fs.readFileSync("_v3/rksmart_windows.json", "utf8"));
// ⛔ NO alcanza con que el mp4 EXISTA: `agnes_qc` deja en disco tambien los RECHAZADOS, y el
//    farm no rendea un clip sin sello. Los 14 que quedaron rechazados (la escena o el objeto del
//    plano cambiado) caen a FOTO QUIETA, que es lo que corresponde: la foto es el primer cuadro
//    del propio clip, asi que muestra exactamente lo que se esta diciendo.
const qc = fs.existsSync("_v3/rksmart_agnes_qc.json") ? JSON.parse(fs.readFileSync("_v3/rksmart_agnes_qc.json", "utf8")).clips : {};
const clipsEnDisco = new Set(fs.existsSync("public/broll/rksmart")
  ? fs.readdirSync("public/broll/rksmart").filter((f) => f.endsWith(".mp4") && !f.startsWith("av_"))
      .map((f) => f.replace(/\.mp4$/, "")).filter((n) => qc[n] && qc[n].ok === true)
  : []);
console.log(`clips de agnes: ${Object.keys(qc).length} generados · ${Object.values(qc).filter((c) => c.ok).length} aprobados · ` +
  `${Object.values(qc).filter((c) => c.ok === false).length} rechazados → su foto quieta sostiene el plano`);
const fotosEnDisco = new Set(fs.existsSync("public/img")
  ? fs.readdirSync("public/img").filter((f) => /^rksmart_.*\.jpg$/.test(f) && !f.endsWith("_blur.jpg")).map((f) => f.replace(/\.jpg$/, ""))
  : []);

// ── tiempo LIBRE = todo menos las ventanas de avatar ─────────────────────────
const libres = [];
{ let c = 0; for (const w of W) { if (w.start - c > 0.01) libres.push([c, w.start]); c = Math.max(c, w.end); } if (TOTAL - c > 0.01) libres.push([c, TOTAL]); }
const interseca = (a, b) => libres.map(([x, y]) => [Math.max(a, x), Math.min(b, y)]).filter(([x, y]) => y - x > 0.01);

// ── tiempo de lectura de un componente: piso 2,8 s + 0,28 s por palabra >3, techo 13 s ──
const palabras = (p) => {
  let n = 0;
  for (const v of Object.values(p)) {
    if (typeof v === "string") n += v.split(/\s+/).filter(Boolean).length;
    else if (Array.isArray(v)) for (const it of v) n += String(it.text || it.title || it.label || "").split(/\s+/).filter(Boolean).length;
  }
  return n;
};
const lectura = (p) => Math.min(13, Math.max(2.8, 2.8 + 0.28 * Math.max(0, palabras(p) - 3)));

const porMomento = new Map();
for (const it of ITEMS) { if (!porMomento.has(it.m)) porMomento.set(it.m, []); porMomento.get(it.m).push(it); }

const beats = [];
for (const w of W) beats.push({ t: +w.start.toFixed(3), dur: +(w.end - w.start).toFixed(3), kind: "avatar", asset: `broll/rksmart/av_w${String(w.k).padStart(3, "0")}.mp4`, sec: "AV" });

const RATIO = { 1: [1], 2: [0.56, 0.44], 3: [0.40, 0.34, 0.26] };
let cursor = 0, robado = 0, sinFoto = [], caidos = 0, cedidos = 0;
let ultimaFoto = null;

for (let k = 0; k < mom.length; k++) {
  const its = (porMomento.get(k) || []).filter((i) => i.k !== "av");
  if (!its.length) continue;
  const m = mom[k];
  let a = Math.max(m.t, cursor), b = m.t + m.dur;
  const comp = its.find((i) => i.k === "comp");
  if (comp) {
    const need = lectura(comp.props);
    // el componente se estira hasta su piso de lectura, pero NUNCA se mete en una ventana de avatar
    const hueco = interseca(a, Math.min(TOTAL, a + Math.max(b - a, need)));
    if (hueco.length) b = Math.max(b, hueco[0][1]);
  }
  const trozos = interseca(a, b);
  const libre = trozos.reduce((s, [x, y]) => s + (y - x), 0);
  if (libre < MIN_PLANO) { caidos += its.length; continue; }

  // repartir los trozos entre las partes del momento
  const partes = its.filter((i) => i.k === "img").sort((x, y) => x.part - y.part);
  if (comp) {
    const [x, y0] = trozos[0];
    // ⛔ UN COMPONENTE NO SE ESTIRA HASTA EL FINAL DEL PARRAFO: el CTA cae en una frase de
    //    27,66 s y una tarjeta quieta 27 s sobre una foto quieta es un plano MUERTO. Se le da su
    //    TIEMPO DE LECTURA (techo 13 s) y el resto del momento lo cubren sus planos de imagen.
    // El tope de lectura sólo se aplica si el momento TIENE planos de imagen que tomen el relevo.
    // Si no los tiene, acortar el componente abre un HUECO (= pantalla negra, acá no hay avatar de
    // fondo): medido, el cap dejó 6,45 s descubiertos a los 10:10. Sin relevo, el componente
    // sostiene su momento entero — que es lo que hace de todos modos un full-screen.
    const hayRelevo = its.some((i) => i.k === "img");
    const y = hayRelevo ? Math.min(y0, x + Math.min(13, Math.max(lectura(comp.props), 2.8))) : y0;
    const bed = ultimaFoto && comp.comp !== "RayCta" ? `img/${ultimaFoto}_blur.jpg` : (comp.comp === "RayCta" ? `img/${CTA_BED}.jpg` : undefined);
    beats.push({ t: +x.toFixed(3), dur: +(y - x).toFixed(3), kind: "componente", comp: comp.comp, props: comp.props, bed, sec: comp.sec, m: k });
    cursor = Math.max(cursor, y);
    const partesC = its.filter((i) => i.k === "img").sort((p, q) => p.part - q.part);
    if (partesC.length && y0 - y > MIN_PLANO) {
      let t0 = y;
      const rr = RATIO[Math.min(3, partesC.length)];
      for (let i = 0; i < partesC.length; i++) {
        const d = i === partesC.length - 1 ? y0 - t0 : (y0 - y) * rr[i];
        if (d >= MIN_PLANO) {
          const foto = `rksmart_${partesC[i].id}`;
          if (!fotosEnDisco.has(foto)) sinFoto.push(foto);
          beats.push({ t: +t0.toFixed(3), dur: +d.toFixed(3), sec: partesC[i].sec, m: k, lug: partesC[i].lug, kind: "imagen", asset: `img/${foto}.jpg` });
          ultimaFoto = foto;
        }
        t0 += d;
      }
      cursor = Math.max(cursor, y0);
    }
    continue;
  }
  const rat = RATIO[Math.min(3, partes.length)];
  const plano = [];
  for (const [x, y] of trozos) {
    const L = y - x;
    let t0 = x;
    for (let i = 0; i < partes.length; i++) {
      const d = i === partes.length - 1 ? y - t0 : L * rat[i];
      plano.push([partes[i], t0, t0 + d]);
      t0 += d;
    }
    break;   // si un momento quedara partido por una ventana, el resto lo absorbe el vecino
  }
  for (const [it, t0, t1] of plano) {
    const d = t1 - t0;
    if (d < MIN_PLANO) { caidos++; continue; }
    const foto = `rksmart_${it.id}`;
    if (!fotosEnDisco.has(foto)) sinFoto.push(foto);
    // ⛔ UN PLANO NUNCA DURA MAS QUE SU CLIP (pasado el ultimo cuadro, OffthreadVideo CONGELA, y
    //    el gate del farm lo cuenta como repeticion). Pero recortar el uso a los planos que midan
    //    exactamente 4,03 s deja 13 clips de 44: casi nada animado.
    //    ✅ El clip se monta al FINAL de su frase, durando EXACTO su archivo, y lo que sobra
    //    adelante se lo lleva el plano ANTERIOR (otro asset, asi que no repite nada) — sigue
    //    dentro de la misma frase, asi que el contexto no se mueve.
    const prev = beats.length ? beats[beats.length - 1] : null;
    // ⛔ el vecino que cede tiene que ser ESTIRABLE: si es otro CLIP (o una ventana de avatar), al
    //    darle el tiempo de adelante se lo estira mas alla de su archivo y CONGELA. Medido: asi quedo
    //    clip_4610 en 5,08 s contra un archivo de 4,03 s, y lo canto agnes_qc.
    const puedeCeder = prev && prev.kind !== "avatar" && prev.kind !== "clip" && Math.abs(prev.t + prev.dur - t0) < 0.02 && d - CLIP_S <= 4.5;
    let usaClip = it.q === 0 && clipsEnDisco.has(foto) && d <= CLIP_S + COLA_MAX;
    let tt = t0, dd = d;
    if (!usaClip && it.q === 0 && clipsEnDisco.has(foto) && d > CLIP_S && puedeCeder) {
      usaClip = true; tt = t1 - CLIP_S; dd = CLIP_S;
      prev.dur = +(tt - prev.t).toFixed(3);
      cedidos++;
    }
    beats.push({
      t: +tt.toFixed(3), dur: +dd.toFixed(3), sec: it.sec, m: k, lug: it.lug,
      kind: usaClip ? "clip" : "imagen",
      asset: usaClip ? `broll/rksmart/${foto}.mp4` : `img/${foto}.jpg`,
    });
    ultimaFoto = foto;
    cursor = Math.max(cursor, t1);
  }
  // el último trozo define el cursor aunque se hayan caído planos
  cursor = Math.max(cursor, trozos.at(-1)[1]);
}

beats.sort((a, b) => a.t - b.t);

// ── cerrar huecos: el plano anterior se estira hasta el siguiente (techo +4,5 s) ──
let cerrados = 0, segCerrados = 0; const sinTapar = [];
const base = beats.filter((b) => !(b.kind === "componente" && b.comp === "RayCta"));
for (let i = 0; i < base.length; i++) {
  const fin = base[i].t + base[i].dur;
  const sig = i + 1 < base.length ? base[i + 1].t : TOTAL;
  const h = sig - fin;
  if (!(h > 0.02 && h <= 4.6)) continue;
  // ⛔ UN CLIP NO SE ESTIRA: pasado su ultimo cuadro congela, y el gate del farm lo cuenta como
  //    repeticion (medido: un clip quedo en 5,08 s contra un archivo de 4,03 s, y lo cazo agnes_qc).
  //    Si el hueco viene despues de un clip, lo tapa el plano SIGUIENTE arrancando antes.
  const estirable = (b) => b && b.kind !== "clip" && b.kind !== "avatar";
  if (estirable(base[i])) { base[i].dur = +(sig - base[i].t).toFixed(3); cerrados++; segCerrados += h; continue; }
  // el de adelante es un clip o una ventana de avatar: que lo tape el SIGUIENTE, y sólo si el
  // siguiente tampoco es un clip (estirar un clip lo congela y el gate lo cuenta como repetición)
  if (estirable(base[i + 1])) { base[i + 1].dur = +(base[i + 1].dur + h).toFixed(3); base[i + 1].t = +fin.toFixed(3); cerrados++; segCerrados += h; continue; }
  sinTapar.push(`${fin.toFixed(2)}s (${h.toFixed(2)}s entre dos clips)`);
}
// cama bajo el overlay del CTA (un overlay NO cubre nada: sin esto se ve negro debajo)
for (const b of beats.filter((x) => x.kind === "componente" && x.comp === "RayCta")) {
  beats.push({ t: b.t, dur: b.dur, kind: "imagen", asset: `img/${CTA_BED}.jpg`, sec: b.sec, m: b.m, cama: true });
}
beats.sort((a, b) => a.t - b.t);

// ── MÉTRICAS ─────────────────────────────────────────────────────────────────
const vis = beats.filter((b) => b.kind !== "componente" || b.comp !== "RayCta");
const durs = beats.filter((b) => !b.cama).map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.min(durs.length - 1, Math.floor(durs.length * p))];
// COBERTURA instante a instante (la suma de duraciones MIENTE con solapes)
let cub = 0, tot = 0, peor = 0, peorT = 0, run = 0;
for (let t = 0; t < TOTAL - 0.05; t += 0.05) {
  tot++;
  const ok = vis.some((b) => b.t <= t && b.t + b.dur > t);
  if (ok) { cub++; run = 0; } else { run += 0.05; if (run > peor) { peor = run; peorT = t; } }
}
const terc = (a, b) => {
  let c = 0, n = 0;
  for (let t = a; t < b; t += 0.05) { n++; if (vis.some((x) => x.t <= t && x.t + x.dur > t)) c++; }
  return 100 * c / n;
};
const nAv = beats.filter((b) => b.kind === "avatar").length;
const nClip = beats.filter((b) => b.kind === "clip").length;
const nImg = beats.filter((b) => b.kind === "imagen" && !b.cama).length;
const nComp = beats.filter((b) => b.kind === "componente").length;
const dobles = beats.filter((b, i) => i && b.asset && b.asset === beats[i - 1].asset).length;
const usados = beats.filter((b) => b.asset && !b.cama).map((b) => b.asset);
const repetidos = usados.length - new Set(usados).size;

console.log("═".repeat(78));
console.log(`BEATS ${beats.length}  ·  avatar ${nAv} · clip ${nClip} · foto ${nImg} · componente ${nComp} · camas ${beats.filter(b=>b.cama).length}`);
console.log(`PACING (sin camas)  min ${q(0).toFixed(2)} · p25 ${q(.25).toFixed(2)} · mediana ${q(.5).toFixed(2)} · p75 ${q(.75).toFixed(2)} · max ${q(.999).toFixed(2)}`);
console.log(`  DISPERSIÓN p75−p25 = ${(q(.75) - q(.25)).toFixed(2)} s (bueno ≥1,8 · <0,5 = METRÓNOMO)  ·  ≥5 s: ${(100 * durs.filter(d => d >= 5).length / durs.length).toFixed(0)} %`);
console.log(`COBERTURA ${(100 * cub / tot).toFixed(2)} %  (piso 100 — acá el avatar NO es fondo)  · peor hueco ${peor.toFixed(2)} s en ${Math.floor(peorT / 60)}:${String(Math.round(peorT % 60)).padStart(2, "0")}`);
console.log(`  tercio 1 ${terc(0, TOTAL / 3).toFixed(1)} % · tercio 2 ${terc(TOTAL / 3, 2 * TOTAL / 3).toFixed(1)} % · tercio 3 ${terc(2 * TOTAL / 3, TOTAL).toFixed(1)} %`);
console.log(`COMPONENTES ${new Set(beats.filter(b => b.kind === "componente").map(b => b.comp)).size} distintos · ${nComp} usos`);
console.log(`APERTURA: primer beat ${beats[0].kind} en ${beats[0].t.toFixed(2)} s, dura ${beats[0].dur.toFixed(2)} s ${beats[0].kind === "avatar" && beats[0].t === 0 && beats[0].dur >= 3 ? "✓" : "⛔"}`);
console.log(`REPETICIONES: mismo asset 2× seguidas ${dobles} · asset usado más de una vez ${repetidos}`);
console.log(`huecos que ningun vecino estirable pudo tapar: ${sinTapar.length}${sinTapar.length ? " -> " + sinTapar.slice(0,4).join(" ") : ""}`);
console.log(`clips montados al final de su frase (el vecino cubre lo de adelante): ${cedidos}`);
console.log(`huecos cerrados estirando el vecino: ${cerrados} (${segCerrados.toFixed(2)} s) · planos caídos por falta de sitio: ${caidos}`);
console.log(`fotos referenciadas que NO están en disco: ${sinFoto.length}${sinFoto.length ? " ⛔ " + sinFoto.slice(0, 8).join(",") : " ✓"}`);
console.log("═".repeat(78));

fs.writeFileSync("_v3/rksmart_plan.json", JSON.stringify({ total: TOTAL, fps: FPS, beats }, null, 1));
console.log("→ _v3/rksmart_plan.json");

let malo = 0;
if (tot < 10000) { console.error("⛔ el medidor de cobertura midió " + tot + " instantes: está roto"); process.exit(2); }
if (cub / tot < 0.9999) { console.error(`⛔ COBERTURA ${(100 * cub / tot).toFixed(2)} % — sin avatar de fondo, todo hueco es NEGRO`); malo = 1; }
if (dobles || repetidos) { console.error("⛔ hay assets repetidos"); malo = 1; }
if (q(.75) - q(.25) < 0.5) { console.error("⛔ METRÓNOMO: p25 y p75 pegados"); malo = 1; }
if (sinFoto.length) malo = 1;
process.exit(malo ? 3 : 0);
