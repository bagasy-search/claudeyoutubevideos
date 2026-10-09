// Rescate de las imágenes que agnes_img_pro dejó SIN APROBAR (9-oct: la mayoría eran 429 del juez, no fotos malas).
// Re-juzga TODOS los candidatos de todas las rondas (_rechazadas/<n>__rK.png) con el juez parcheado (429 = esperar),
// en los dos modos; elige la 1ª aprobada o, si ninguna, la de MENOS fallas (anotada en _v3/<slug>_rescate.json para mirar a ojo).
//   SLUG=x node vlog/loretta/rescate_img.mjs
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
const S = process.env.SLUG, R = "D:/Proyectos/video2-wt/lnet46/", W = `D:/rtmp/lnet46/agpro_${S}/`, OUT = R + `public/img/${S}/`;
const pend = JSON.parse(fs.readFileSync(W + "_sin_aprobar.json", "utf8")).map((x) => x.name).filter((n) => !fs.existsSync(OUT + n + ".png"));
if (!pend.length) { console.log(S, "rescate: nada pendiente"); process.exit(0); }
const P = new Map(JSON.parse(fs.readFileSync(W + "_json.json", "utf8")).map((x) => [x.name, x.prompt]));
const RJ = W + "_rechazadas/", T = W + "_rescate/"; fs.rmSync(T, { recursive: true, force: true }); fs.mkdirSync(T, { recursive: true });
const lista = [];
for (const n of pend) for (const f of fs.readdirSync(RJ).filter((f) => f.startsWith(n + "__r"))) {
  fs.copyFileSync(RJ + f, T + f); lista.push({ name: f.replace(/\.png$/, ""), prompt: P.get(n) || "" });
}
fs.writeFileSync(T + "_lista.json", JSON.stringify(lista));
const gate = (out, extra) => spawnSync("node", ["scripts/agnes_img_gate.mjs", T + "_lista.json", T, "--out", T + out, "--conc", "4", ...extra], { cwd: R, stdio: "inherit", windowsHide: true });
gate("_g1.json", []); gate("_g2.json", ["--foco"]);
const g1 = JSON.parse(fs.readFileSync(T + "_g1.json", "utf8")), g2 = JSON.parse(fs.readFileSync(T + "_g2.json", "utf8"));
const PP = "scale=1280:720:flags=bicubic,eq=saturation=0.88:contrast=0.95:gamma=1.02,gblur=sigma=0.6,unsharp=3:3:0.4,noise=alls=8:allf=t";
const rep = {};
for (const n of pend) {
  const c = lista.filter((x) => x.name.startsWith(n + "__r")).map((x) => {
    const a = g1[x.name], b = g2[x.name];
    const fallas = [...new Set([...(a && !a.ok ? a.fallas : []), ...(b && !b.ok ? b.fallas : [])])];
    return { f: x.name, fallas, ok: a?.ok && b?.ok };
  }).sort((p, q) => (q.ok - p.ok) || (p.fallas.length - q.fallas.length));
  if (!c.length) { rep[n] = { sin_candidatos: true }; continue; }
  spawnSync("ffmpeg", ["-v", "error", "-y", "-i", T + c[0].f + ".png", "-vf", PP, OUT + n + ".png"], { windowsHide: true });
  rep[n] = { elegida: c[0].f, ok: !!c[0].ok, fallas: c[0].fallas };
}
fs.writeFileSync(R + `_v3/${S}_rescate.json`, JSON.stringify(rep, null, 1));
const v = Object.values(rep);
console.log(`${S} rescate: ${pend.length} pendientes · ${v.filter((x) => x.ok).length} aprobadas al re-juzgar · ${v.filter((x) => x.elegida && !x.ok).length} con fallas (mirar) · ${v.filter((x) => x.sin_candidatos).length} sin candidato`);
