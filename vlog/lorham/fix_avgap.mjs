// El reel de RunPod no trae la ventana 618,86-634,6 (quedó de largo 0): esa parte de la toma av del CTA se cubre con fotos
// pegadas a la frase; el avatar (con LorSubscribe) arranca en "do me a favor" 634,5. Idempotente. Correr DESPUÉS de timeline.mjs.
import fs from "node:fs";
const f = "D:/Proyectos/video2-wt/lorham/_v3/lorham_shots.json", D = JSON.parse(fs.readFileSync(f, "utf8"));
const i = D.shots.findIndex((s) => s.kind === "av" && Math.abs(s.start - 618.86) < 0.01);
if (i < 0) { console.log("ya aplicado"); process.exit(0); }
const av = D.shots[i], AV0 = 634.5;
const cut = [[618.86, 621.24, "b_warmthrough", "while that ham is warming"], [621.24, 625.88, "b_settable", "everybody at home"],
  [625.88, 629.1, "e_grandma", "your grandmother's"], [629.1, AV0, "b_servingline", "church supper paper plate"]];
const ins = cut.map(([s, e, name, at]) => ({ p: av.p, at, kind: name.startsWith("e_") ? "ei" : "bi", name, start: s, end: e, dur: +(e - s).toFixed(2) }));
av.start = AV0; av.dur = +(av.end - AV0).toFixed(2);
D.shots.splice(i, 0, ...ins);
fs.writeFileSync(f, JSON.stringify(D, null, 1)); console.log("ok", ins.map((x) => x.kind + ":" + x.name).join(" "), "av", av.start, av.dur);
