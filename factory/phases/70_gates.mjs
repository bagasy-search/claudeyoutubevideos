// 70_gates — TODAS las compuertas pre-render, fail-closed, en un GATES.md con números.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured, assertNoProblems, GateReport } from "../lib/gate.mjs";
import { durSec } from "../lib/exec.mjs";
import { importTree } from "../lib/imports.mjs";
import { ROOT } from "../lib/env.mjs";

export default {
  id: "70_gates",
  deps: ["60_build"],
  inputs: ({ P }) => [P.entry, P.srcDir, P.assetsList, P.m4a, P.wav],
  async run({ slug, style, P, state, log }) {
    const rep = new GateReport();
    const b = state.get("60_build")?.medido || {};
    const V = style.vlog || {};
    const q = { log };
    if (b.dry) throw new Error("60_build corrió en DRY: no hay build real para rendear");
    rep.check("avatarTapadoInteriorSec", () => assertMeasured("avatarTapadoInteriorSec", b.avatarTapadoInteriorSec, { max: V.maxAvatarTapadoS ?? 1, allowZero: true, ...q }));
    rep.check("coberturaPct", () => assertMeasured("coberturaPct", b.coberturaPct, { min: V.minCoberturaPct ?? 99, ...q }));
    rep.check("placaVistaSec", () => assertMeasured("placaVistaSec", b.placaVistaSec, { max: V.maxPlacaVistaS ?? 1.5, allowZero: true, ...q }));
    rep.check("destellos", () => assertMeasured("destellos", b.destellos, { max: 0, allowZero: true, ...q }));

    const lista = fs.existsSync(P.assetsList) ? fs.readFileSync(P.assetsList, "utf8").split(/\r?\n/).filter(Boolean) : [];
    rep.check("assetsLista", () => assertNoProblems("assetsLista", lista.filter((a) => !fs.existsSync(path.join(ROOT, "public", a))).map((a) => `falta public/${a}`), lista.length, q));
    const vacios = lista.filter((a) => { try { return fs.statSync(path.join(ROOT, "public", a)).size < 1024; } catch { return false; } });
    rep.check("assetsNoVacios", () => assertNoProblems("assetsNoVacios", vacios.map((a) => `archivo <1 KB: ${a}`), lista.length, q));
    rep.check("blurRuntime", () => assertNoProblems("blurRuntime", lista.filter((a) => /_blur\.jpg$/.test(a) && !fs.existsSync(path.join(ROOT, "public", a))), lista.length, q));

    const m4a = await durSec(P.m4a), wav = await durSec(P.wav);
    rep.check("audioM4aVsWavMs", () => assertMeasured("audioM4aVsWavMs", Math.round(Math.abs(m4a - wav) * 1000), { max: 150, allowZero: true, ...q }));

    const tree = importTree(P.entry, { root: ROOT });
    rep.check("importsArbol", () => assertNoProblems("importsArbol", tree.faltan, tree.archivos.length, q));
    const fueraDelSlug = tree.archivos.filter((f) => !(f === `src/index_${slug}.tsx` || f.startsWith(`src/${slug}/`)));
    rep.check("importsAutocontenidos", () => assertNoProblems("importsAutocontenidos", fueraDelSlug.map((f) => `importa fuera del slug (el commit de render no lo llevaría): ${f}`), tree.archivos.length, q));

    // sello agnes: el farm lo exige igual; acá se ve antes. Primero se re-mide la repetición con los cues del build.
    try {
      await (await import("../lib/exec.mjs")).run("node", ["scripts/agnes_qc.mjs", slug], { cwd: ROOT, timeoutMs: 60 * 60_000, allowFail: true, env: { QC_IMGDIR: P.imgDir, QC_CLIPDIR: P.brollDir } });
      const { agnesGate } = await import(path.join(ROOT, "scripts", "agnes_qc_gate.mjs").replace(/\\/g, "/").replace(/^([A-Z]):/, "file:///$1:"));
      const g = agnesGate(slug, lista);
      rep.check("agnesQC", () => { if (!g.ok) throw new Error(g.msg.slice(0, 300)); log(`GATE agnesQC: ${g.msg.split("\n")[0]}`); return { medido: g.msg.match(/\d+/)?.[0] }; });
    } catch (e) { rep.check("agnesQC", () => { throw new Error(`no pude correr agnes_qc_gate: ${e.message}`); }); }

    fs.mkdirSync(path.dirname(P.gatesMd), { recursive: true });
    fs.writeFileSync(P.gatesMd, rep.markdown(`GATES pre-render · ${slug}`));
    log(`GATES.md → ${P.gatesMd}`);
    if (!rep.ok) throw new Error(`compuertas pre-render NO pasan: ${rep.rows.filter((r) => !r.ok).map((r) => r.nombre).join(", ")}`);
    return { compuertas: rep.rows.length, archivosRender: tree.archivos.length, assets: lista.length };
  },
};
