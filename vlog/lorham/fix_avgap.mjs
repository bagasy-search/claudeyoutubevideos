// El reel de RunPod no trae la ventana 618,86-634,6 (quedó de largo 0): esa parte de la toma av del CTA se cubre con fotos
// pegadas a la frase; el avatar (con LorSubscribe) arranca en "do me a favor" 634,5. Idempotente. Correr DESPUÉS de timeline.mjs.
import fs from "node:fs";
const f = "D:/Proyectos/video2-wt/lorham/_v3/lorham_shots.json", D = JSON.parse(fs.readFileSync(f, "utf8"));
const i = D.shots.findIndex((s) => s.kind === "av" && Math.abs(s.start - 618.86) < 0.01);
if (i < 0) console.log("CTA ya aplicado"); else {
const av = D.shots[i], AV0 = 634.62; // "me a favor" (634,66) − 40 ms = arranque de la ventana del reel
const cut = [[618.86, 625.84, "b_whilewarming", ""], [625.84, AV0, "e_churchplate", "If this kitchen"]];
const ins = cut.map(([s, e, name, at]) => ({ p: av.p, at, kind: name.startsWith("e_") ? "ei" : "bi", name, start: s, end: e, dur: +(e - s).toFixed(2) }));
av.start = AV0; av.dur = +(av.end - AV0).toFixed(2);
D.shots.splice(i, 0, ...ins);
fs.writeFileSync(f, JSON.stringify(D, null, 1)); } if (i >= 0) console.log("ok", ins.map((x) => x.kind + ":" + x.name).join(" "), "av", av.start, av.dur);
// 2) tomas ancladas a la 1ª palabra del párrafo quedaban con 0,04 s (la siguiente, sin ancla, arranca en el inicio del párrafo):
//    1 cuadro = destello, y en comps rompe el interpolate (chunk 74: [18,0.48]). Cada una pasa a 2,5 s; la siguiente arranca después
//    (si queda <2,5 s, empuja también a la tercera). El avatar arranca más tarde DENTRO de su ventana (sigue sincronizado). Idempotente.
{
  const G = JSON.parse(fs.readFileSync(f, "utf8")), S = G.shots, L = 2.5; let n = 0;
  for (let j = 0; j + 1 < S.length; j++) {
    const x = S[j]; if (x.dur >= 0.5) continue;
    const a = S[j + 1], b = S[j + 2], aDur0 = a.dur;
    x.dur = L; x.end = x.start + L; a.start = x.end; a.dur = +(a.end - a.start).toFixed(2);
    if (a.dur < L && b && b.kind !== "av") { a.end = a.start + Math.min(aDur0, L); a.dur = +(a.end - a.start).toFixed(2); b.start = a.end; b.dur = +(b.end - b.start).toFixed(2); }
    n++; console.log("toma corta arreglada", x.kind, x.name, x.start.toFixed(2), "→", a.kind, a.name, a.start.toFixed(2), a.dur, b ? b.name + " " + b.start.toFixed(2) + " " + b.dur : "");
  }
  if (n) fs.writeFileSync(f, JSON.stringify(G, null, 1)); else console.log("tomas cortas: ninguna");
}
