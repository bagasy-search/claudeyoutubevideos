// CONTROL POSITIVO del motor de montaje (D3): líneas de tiempo sintéticas con defectos PLANTADOS.
// Cada trampa tiene que ser atrapada; el caso sano tiene que pasar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { conApertura } from "../lib/apertura.mjs";
import { planVlog } from "../lib/vlogplan.mjs";
import { medirTimeline } from "../lib/timeline.mjs";

// guion sintético: 20 momentos de 4 s; p000, p006, p012 son avatar
const mkMom = (n = 20, d = 4) => Array.from({ length: n }, (_, i) => ({ i, name: `p${String(i).padStart(3, "0")}`, start: i * d, end: (i + 1) * d, dur: d, texto: i === n - 2 ? "Si esto te sirvió, suscribite al canal." : `frase ${i}.` }));
const AV = new Set(["p000", "p006", "p012"]);
const mkPlan = (mom) => mom.map((m) => ({ name: m.name, tipo: AV.has(m.name) ? "avatar" : "imagen" }));
const mkVent = (mom) => mom.filter((m) => AV.has(m.name)).map((m, k) => ({ k, start: Math.max(0, m.start - 0.4), end: m.end + 0.4 }));
const base = (over = {}) => {
  const mom = mkMom();
  return {
    mom, plan: mkPlan(mom), ventanasSec: mkVent(mom), wavSec: 80,
    assetOf: (name) => (name.endsWith("x") ? null : { tipo: "clip", src: `broll/t/${name}.mp4` }),
    framesOf: () => 400,
    finFoto: (name) => ({ tipo: "foto", src: `img/t/${name}_fin.jpg` }),
    cta: { regex: /^Si esto te sirvió, suscribite/, head: "Suscribite", sub: "" },
    ...over,
  };
};

test("sano: pasa sin problemas y mide todo", () => {
  const r = planVlog(base());
  assert.deepEqual(r.problemas, []);
  assert.equal(r.medido.avatarTapadoInteriorSec, 0);
  assert.ok(r.medido.cuesBase > 0 && r.medido.ventanas === 3);
});

test("TRAMPA avatar tapado: un cue plantado encima de una ventana se atrapa", () => {
  const r = planVlog(base());
  const w = r.ventanas[1];
  const base2 = r.cues.filter((c) => c.capa === "base").concat([{ key: "plantado", start: w.from, dur: w.dur, src: "broll/t/intruso.mp4" }]);
  const m = medirTimeline({ base: base2, ventanas: r.ventanas, total: r.total });
  assert.ok(m.avatarTapadoInteriorSec > 3, `debía medir >3 s tapados, midió ${m.avatarTapadoInteriorSec}`);
});

test("TRAMPA el bug de tcfiltro: estirar hasta el próximo plano por encima de una ventana ya empezada", () => {
  // momento 5 termina DENTRO de la ventana de p006 (colchón 0,4 s): el algoritmo viejo lo estiraba hasta el
  // próximo plano (fin de la ventana) y tapaba el lipsync. El motor nuevo NO debe hacerlo.
  const r = planVlog(base({ opts: { jcutProb: 0, lcutProb: 0 } }));
  assert.equal(r.medido.avatarTapadoInteriorSec, 0, JSON.stringify(r.medido.peoresVentanas));
});

test("TRAMPA asset inexistente (el `clip=` que se salteaba en silencio)", () => {
  const r = planVlog(base({ assetOf: (n) => (n === "p003" || n.endsWith("x") ? null : { tipo: "clip", src: `broll/t/${n}.mp4` }) }));
  assert.ok(r.problemas.some((p) => /sin asset: p003/.test(p)), r.problemas.join("|"));
});

test("TRAMPA clip con 0 cuadros (se congelaría)", () => {
  const r = planVlog(base({ framesOf: (s) => (s.includes("p004") ? 0 : 400) }));
  assert.ok(r.problemas.some((p) => /0 cuadros/.test(p)), r.problemas.join("|"));
});

test("TRAMPA clip repetido en dos planos", () => {
  const r = planVlog(base({ assetOf: (n) => (n.endsWith("x") ? null : { tipo: "clip", src: n === "p009" ? "broll/t/p008.mp4" : `broll/t/${n}.mp4` }) }));
  assert.ok(r.problemas.some((p) => /más de un plano|MISMO asset/.test(p)), r.problemas.join("|"));
});

test("TRAMPA clip más corto que su plano sin segundo plano (loop visible)", () => {
  const r = planVlog(base({ framesOf: () => 40 }));
  assert.ok(r.problemas.some((p) => /más largo que su clip/.test(p)), r.problemas.join("|"));
});

test("TRAMPA apertura sin avatar", () => {
  const mom = mkMom();
  const plan = mom.map((m) => ({ name: m.name, tipo: m.name === "p006" ? "avatar" : "imagen" }));
  const r = planVlog(base({ plan, ventanasSec: [{ k: 0, start: 23.6, end: 28.4 }] }));
  assert.ok(r.problemas.some((p) => /apertura/.test(p)), r.problemas.join("|"));
});

test("TRAMPA CTA sin su frase", () => {
  const r = planVlog(base({ cta: { regex: /^Nunca aparece/, head: "x" } }));
  assert.ok(r.problemas.some((p) => /CTA/.test(p)));
});

test("TRAMPA cobertura baja: la placa quieta se ve", () => {
  const r = planVlog(base({ assetOf: (n) => (["p002", "p003", "p004"].includes(n) || n.endsWith("x") ? null : { tipo: "clip", src: `broll/t/${n}.mp4` }) }));
  assert.ok(r.problemas.some((p) => /PLACA|cobertura/.test(p)), r.problemas.join("|"));
});

test("medición: sin total tira (no mide sobre la nada)", () => {
  assert.throws(() => medirTimeline({ base: [], ventanas: [], total: 0 }), /total=0/);
});

// ── APERTURA CON LA MINIATURA (20-sep-2026) ────────────────────────────────────────────────────
test("apertura: corre TODO a la derecha y el cuadro 0 es la miniatura", () => {
  const cues = [{ key: "m000", start: 0, dur: 60, capa: "base", src: "a.mp4" }, { key: "m001", start: 60, dur: 60, capa: "base", src: "b.mp4" }];
  const ventanas = [{ k: 0, from: 0, dur: 90 }];
  const r = conApertura({ cues, ventanas, total: 120, fps: 30, ap: { miniatura: true, holdS: 1, glitchF: 12, src: "broll/x/x_apertura.mp4", foto: "img/x/x_thumb.jpg", frames: 121 } });
  assert.equal(r.cues[0].key, "apertura");
  assert.equal(r.cues[0].start, 0, "la miniatura tiene que empezar en el cuadro 0 o el truco no se lee");
  assert.equal(r.cues[0].dur, 36, "la miniatura dura el hold + medio glitch (si no, se ve un cuadro de nadie)");
  assert.equal(r.audioDesdeF, 30, "el audio se corre: si no, la voz arranca sobre la miniatura");
  assert.equal(r.ventanas[0].from, 30, "la ventana de avatar se corre igual que el audio o el lipsync se desfasa");
  assert.equal(r.total, 150);
  assert.deepEqual(r.cues.filter((c) => c.capa === "over").map((c) => [c.key, c.start, c.dur]), [["glitchcut", 30, 12]]);
  // lo de adentro no se toca, sólo se corre
  assert.deepEqual(r.cues.filter((c) => c.key.startsWith("m")).map((c) => c.start), [30, 90]);
});

test("TRAMPA apertura sin clip de miniatura: tira en vez de emitir un video sin el truco", () => {
  assert.throws(() => conApertura({ cues: [], ventanas: [], total: 30, fps: 30, ap: { miniatura: true, holdS: 1 } }), /miniatura/);
});

test("apertura: si agnes redibujó, la miniatura QUIETA sigue sirviendo (calce exacto sin clip)", () => {
  const r = conApertura({ cues: [{ key: "m000", start: 0, dur: 60, capa: "base", src: "a.mp4" }], ventanas: [{ k: 0, from: 0, dur: 60 }], total: 60, fps: 30, ap: { miniatura: true, holdS: 1, glitchF: 12, src: null, foto: "img/x/x_thumb.jpg" } });
  assert.equal(r.cues[0].src, null);
  assert.equal(r.cues[0].foto, "img/x/x_thumb.jpg");
  assert.equal(r.audioDesdeF, 30, "el corrimiento no depende de que haya clip");
});
