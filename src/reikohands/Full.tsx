// reikohands / toallahands · el video ENTERO, vara gary01: una base por frase —Reiko a cámara / su toma haciendo lo que cuenta (LTX) /
// su mundo 3D (el cuarto de tatami con la mano de madera, el corte de la piel, la uña en macro)— y CERO cortes secos.
// Orden de las bases: beats.json (D:/rtmp_reikohands/mk_beats.py). Piezas de papel y 2.5D clavadas a la frase: piezas_<lang>.json
// (validadas antes del farm con D:/rtmp_reikohands/check_piezas.py). Mismo código para EN y ES: cambia cfg.json.
// Audio fuera de Remotion (mezcla). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HandsWorld, sceneOf, screenOf, camSpeed, PT, V3 } from "./hands3d";
import { BigNum, COL, Chips, LowerThird, Tag, Vid, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { Versus, Words } from "../kits/yanqui3d/pieces";
import { Polaroids, Notes, RuleTitle, Oops, SubBell } from "./papel";
import CFG from "./cfg.json";
import CAPS from "./caps.json";
import AVW from "./avw.json";
import AVAIL from "./avail.json";
import BJ from "./beats.json";
import PEN from "./piezas_en.json";
import PES from "./piezas_es.json";

setSlug(CFG.slug);
const SPEC = (CFG.lang === "es" ? PES : PEN) as unknown as { L: Record<string, string>; P: Record<string, any>[] };
export const TEND = BJ.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);
type BB = { a: number; k: string; tr: Tr };
const BEATS = BJ.beats as BB[];
const startOf = (k: string) => BEATS.find((b) => b.k === k)?.a ?? -1;
const C: Record<string, string> = { amber: COL.amber, red: COL.red, ice: COL.ice, ink: COL.ink, green: "#9df0b4" };
// las piezas grandes nunca tapan a Reiko: si entra una ventana del avatar antes de su salida, salen justo antes
const AVS = (AVW as number[][]).map((w) => w[0]);
const cut = (out: number) => { const w = AVS.find((ms) => ms < out && ms > out - 9.5); return w === undefined ? out : Math.min(out, w - 0.1); };

// at() con tildes: "jabón" y "jabon" son la misma palabra (el norm del motor borra la letra acentuada)
const nrm = (w: string) => w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9$°]/g, "");
const WS = (CAPS as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: nrm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
const atS = (phrase: string, after = 0): number => {
  const q = phrase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WS.length; i++) {
    if (WS[i].t < after - 0.01) continue;
    if (q.every((x, j) => WS[i + j] && WS[i + j].w === x)) return WS[i].t;
  }
  return NaN; // la pieza no sale (check_piezas.py frena antes del farm)
};
// cada pieza busca su frase DESPUÉS de la anterior (el guion va en orden): se resuelve una sola vez
type R = Record<string, any> & { t0: number; ts?: number[] };
const RES: R[] = (() => {
  let cur = 0; const out: R[] = [];
  for (const p of SPEC.P) {
    const anchors: string[] = p.items && p.k === "WORDS" ? p.items.map((x: any) => x.a) : p.rows ? p.rows.map((x: any) => x.a) : p.anchors ? [p.a, ...p.anchors] : [p.a];
    const ts: number[] = []; let c = cur;
    for (const a of anchors) { const v = atS(a, c); ts.push(v); if (!isNaN(v)) c = v; }
    if (p.k === "SUB") { const b = atS(p.bell, c); ts.push(b); }
    if (!isNaN(ts[0])) cur = ts[0];
    out.push({ ...p, t0: ts[0], ts });
  }
  return out;
})();
export const piezasFaltantes = () => RES.filter((r) => r.ts!.some((x) => isNaN(x))).map((r) => r.a ?? r.k);

// el mundo con blur de movimiento real (sólo el mundo, nunca el avatar)
const World: React.FC<{ t: number; name: string; a: number }> = ({ t, name, a }) => {
  const u = t - a, v0 = camSpeed(name, u), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><HandsWorld t={t} sc={sceneOf(name, u)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const inB = (t: number, k: string) => { const i = BEATS.findIndex((b) => b.k === k); return i >= 0 && t >= BEATS[i].a && t < (BEATS[i + 1]?.a ?? TEND); };

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV }) => BEATS.map((b): Beat => {
    // cámara a mano (vara 23-oct): avatar y tomas envueltos en CamaraMano; el mundo la lleva en su cámara 3D (nunca dos capas)
    const mano = (x: Beat): Beat => ({ ...x, r: (t) => <CamaraMano seed={4}>{x.r(t)}</CamaraMano> });
    if (b.k === "AV") return mano({ ...AV(b.a, b.tr), a: b.a });
    if (b.k.startsWith("W:")) return { a: b.a, tr: b.tr, p: [960, 470], r: (t) => <World t={t} name={b.k.slice(2)} a={b.a} /> };
    // tramo de toma "o02@4.1": la toma corre desde su segundo 4,1 (cada tramo se usa una sola vez; la toma avanza)
    const [k, off] = b.k.split("@");
    return mano({ a: b.a, tr: b.tr, p: [960, 470], k: b.k, r: (t) => <AbsoluteFill style={{ transform: `scale(${1.0 + 0.06 * Math.min(1, Math.max(0, (t - b.a) / 6))})` }}><Vid id={"ltx_" + k} from={+(off ?? 0)} at={b.a} /></AbsoluteFill> });
  }),
  pieces: (t) => {
    const L: React.ReactNode[] = [], T = SPEC.L;
    RES.forEach((p, i) => {
      const a = p.t0; if (isNaN(a) || t < a - 1 || t > a + 40) return;
      const key = "p" + i, out = (d = p.d) => cut(a + d);
      switch (p.k) {
        case "W": L.push(<Words key={key} t={t} items={[{ at: a, txt: p.txt, col: C[p.col] }]} out={a + p.d} y={900} size={p.size ?? 80} />); break;
        case "WORDS": L.push(<Words key={key} t={t} items={p.items.map((x: any, j: number) => ({ at: p.ts![j], txt: x.txt, col: C[x.col] }))} out={p.ts![p.ts!.length - 1] + p.d} y={900} size={p.size ?? 70} />); break;
        case "BIG": L.push(<BigNum key={key} t={t} at={a} text={p.txt} x={1460} y={300} size={p.size ?? 220} col={C[p.col] ?? COL.ink} sub={p.sub} out={out()} />); break;
        case "ST": L.push(<Stamp key={key} t={t} at={a} text={p.txt} x={960} y={250} size={p.size ?? 96} out={out()} />); break;
        case "LT": L.push(<LowerThird key={key} t={t} at={a} out={a + p.d} name={T.name} l2={T.l2} l2at={a + 0.4} />); break;
        case "CHIPS": L.push(<Chips key={key} t={t} at={a} items={p.items} out={out()} y={860} />); break;
        case "RULE": L.push(<RuleTitle key={key} t={t} at={a} out={out()} word={T.rule} n={p.n} name={p.name} />); break;
        case "OOPS": L.push(<Oops key={key} t={t} at={a} out={out()} label={p.label ?? T.oops} txt={p.txt} />); break;
        case "VS": L.push(<Versus key={key} t={t} at={a} out={out()} title={p.title} L={{ ...p.L, col: C[p.L.col] }} R={{ ...p.R, col: C[p.R.col] }} />); break;
        case "NOTE": L.push(<Notes key={key} t={t} title={p.title} rows={p.rows.map((r: any, j: number) => ({ at: p.ts![j], txt: r.txt }))} out={cut(p.ts![p.ts!.length - 1] + p.d)} />); break;
        case "POL": L.push(<Polaroids key={key} t={t} items={p.items.map((l: string, j: number) => ({ at: a + 0.35 + j * 0.28, img: `${CFG.slug}/pol_${j + 1}.jpg`, label: l }))} out={out(p.d + 2.2)} />); break;
        case "POLR": {
          // el repaso: las 8 polaroids quedan arriba y se destaca la que nombra
          const ts = p.ts!.slice(1), last = ts[ts.length - 1];
          const hi = ts.reduce((h: number, x: number, j: number) => (t >= x - 0.1 ? j : h), -1);
          L.push(<Polaroids key={key} t={t} items={SPEC.P.find((q) => q.k === "POL")!.items.map((l: string, j: number) => ({ at: a + j * 0.12, img: `${CFG.slug}/pol_${j + 1}.jpg`, label: l }))} out={last + p.d} hi={hi} y={420} />);
          break;
        }
        case "PIN": if (inB(t, p.b)) { const s = screenOf(p.b.slice(2), t - startOf(p.b), (PT as Record<string, V3>)[p.q], t); L.push(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={p.dx ?? 300} dy={p.dy ?? -150} text={p.txt} col={C[p.col] ?? COL.ink} size={36} out={a + p.d} />); } break;
        case "SUB": L.push(<SubBell key={key} t={t} at={a} bellAt={p.ts![1]} out={a + p.d} sub={T.sub} done={T.done} />); break;
      }
    });
    return L;
  },
});

export const Full: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const clipPlan = M.clipPlan;
export const beatTable = M.beatTable;
