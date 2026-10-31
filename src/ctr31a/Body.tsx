// ctr31a · EL VIDEO ENTERO en un solo hilo. La línea de tiempo se arma UNA vez (función pura de los datos):
//   1) ventanas del avatar (avwin.json) · 2) componentes (planos.tsx, cada uno con su tramo; lo que cae dentro de una ventana
//   del avatar se recorta y la pieza sigue al salir) · 3) el resto: clips Veo anclados a su frase (veo.json), y donde no hay
//   clip (no llegó o el hueco es más largo que el clip) la casa de cristal en vuelo lento hacia el cuarto de esa sección.
// Entre segmentos nunca hay corte seco: latigazo con desenfoque, portal al avatar y del avatar, o subida.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Avatar, BgCtx, HAS, Shot, WIN } from "./base";
import { Casa, ROOM, Pose, camPath, CKey } from "./casa";
import { ei, Portal } from "./lib";
import { FXS } from "./planos";
import { END, SECROOM, plugsOn } from "./marks";
import VEO from "./veo.json";

export { END };
const TR = 0.34;
type Seg = { a: number; b: number; k: "av" | "fx" | "clip" | "casa"; id: string; i?: number; room?: string; from?: string };

const FUERA = new Set(["v091_errors"]);   // marca impresa en el frasco
const VC = (VEO as { id: string; t: number; sec: string }[]).filter((v) => HAS[v.id] && !FUERA.has(v.id)).sort((x, y) => x.t - y.t);
const secRoom = (t: number) => { let r = "wide"; for (const [a, room] of SECROOM) if (t >= a) r = room; return r; };

export const SEGS: Seg[] = (() => {
  // una pieza "top" (cuadro 0) le gana al avatar: la ventana arranca cuando la pieza termina
  const W2 = WIN.map((w) => { const f = FXS.find((x) => x.top && x.a <= w.ms + 0.01 && x.b > w.ms); return { ms: f ? f.b : w.ms, me: w.me }; }).filter((w) => w.me - w.ms > 0.6);
  const S: Seg[] = W2.map((w) => ({ a: w.ms, b: w.me, k: "av" as const, id: "av" }));
  // componentes menos ventanas
  FXS.forEach((f, i) => {
    let parts: [number, number][] = [[f.a, f.b]];
    if (!f.top) W2.forEach((w) => { parts = parts.flatMap(([a, b]): [number, number][] => ((w.me <= a || w.ms >= b ? [[a, b]] : [[a, w.ms], [w.me, b]]) as [number, number][]).filter(([x, y]) => y - x > 1.5)); });   // nunca un retazo de pieza de <1,5 s entre dos ventanas del avatar
    parts.forEach(([a, b]) => S.push({ a, b, k: "fx", id: f.id, i }));
  });
  S.sort((x, y) => x.a - y.a);
  // huecos → clips Veo / casa
  const gaps: [number, number][] = []; let c = 0;
  S.forEach((s) => { if (s.a - c > 0.05) gaps.push([c, s.a]); c = Math.max(c, s.b); });
  if (END - c > 0.05) gaps.push([c, END]);
  const out: Seg[] = [...S];
  // clips cuyo ancla cae bajo un componente/avatar: quedan de reserva para los vuelos largos de la casa (el más cercano en tiempo)
  const anclados = new Set(VC.filter((v) => gaps.some(([g0, g1]) => v.t >= g0 - 3 && v.t < g1 - 1.2)).map((v) => v.id));
  const pool = VC.filter((v) => !anclados.has(v.id));
  const casaOClips = (G: Seg[], x: number, b: number) => {
    if (b - x < 1.8 || !pool.length) { G.push({ a: x, b, k: "casa", id: "casa", room: secRoom(x) }); return; }
    if (b - x >= 7) { G.push({ a: x, b: x + 2.4, k: "casa", id: "casa", room: secRoom(x) }); x += 2.4; }   // vuelo corto que ubica el cuarto
    while (b - x > 0.8 && pool.length) {
      const j = pool.reduce((m, v, k) => (Math.abs(v.t - x) < Math.abs(pool[m].t - x) ? k : m), 0);
      const v = pool.splice(j, 1)[0], e = b - x - 4.5 < 2 ? b : x + 4.5;
      G.push({ a: x, b: e, k: "clip", id: v.id }); x = e;
    }
    if (b - x > 0.05) G.push({ a: x, b, k: "casa", id: "casa", room: secRoom(x) });
  };
  gaps.forEach(([g0, g1]) => {
    const prev = S.find((s) => Math.abs(s.b - g0) < 0.06 && s.k === "fx"), next = S.find((s) => Math.abs(s.a - g1) < 0.06 && s.k === "fx");
    // hueco chico (<0,8 s): lo absorbe la pieza vecina (nunca un destello de otra cosa)
    const prevAny = S.find((s) => Math.abs(s.b - g0) < 0.06), nextAny = S.find((s) => Math.abs(s.a - g1) < 0.06);
    if (g1 - g0 <= 1.6 && (next || prev || prevAny || nextAny)) { if (next) next.a = g0; else if (prev) prev.b = g1; else if (prevAny) prevAny.b = g1; else nextAny!.a = g0; return; }
    const G: Seg[] = [];
    let x = g0;
    const cs = VC.filter((v) => v.t >= g0 - 3 && v.t < g1 - 1.2);
    cs.forEach((v, j) => {
      let a = Math.max(x, Math.min(v.t, g1));
      if (a - x <= 0.8) a = x; // el clip arranca un poco antes de su frase antes que dejar un destello
      else casaOClips(G, x, a);
      const nx = j + 1 < cs.length ? Math.max(a, cs[j + 1].t) : g1, b = Math.min(nx, a + 5.5, g1);
      if (b - a > 0.8) { G.push({ a, b, k: "clip", id: v.id }); x = b; }
    });
    if (g1 - x > 0.8 || !G.length) casaOClips(G, x, g1);
    else G[G.length - 1].b = g1;
    out.push(...G);
  });
  out.sort((x, y) => x.a - y.a);
  // un vuelo de la casa de <1,6 s pegado a un clip es un destello: lo absorbe el clip (los Veo duran 8 s)
  for (let i = out.length - 1; i > 0; i--) { const s = out[i], p = out[i - 1]; if (s.k === "casa" && s.b - s.a < 1.6 && p.k === "clip" && Math.abs(p.b - s.a) < 0.02 && s.b - p.a <= 8) { p.b = s.b; out.splice(i, 1); } }
  for (let i = out.length - 2; i >= 0; i--) { const s = out[i], n = out[i + 1]; if (s.k === "casa" && s.b - s.a < 1.6 && n.k === "clip" && Math.abs(n.a - s.b) < 0.02 && n.b - s.a <= 8) { n.a = s.a; out.splice(i, 1); } }
  // de dónde viene cada vuelo de la casa (para aterrizar sin tirón)
  let prevRoom = "wide";
  out.forEach((s) => { if (s.k === "casa") { s.from = prevRoom; prevRoom = s.room!; } });
  return out;
})();
// cada pieza recibe de fondo un clip que NO salió a pantalla completa (el más cercano en tiempo, sin repetir)
const BGFX: Record<string, string> = (() => {
  const usados = new Set(SEGS.filter((s) => s.k === "clip").map((s) => s.id)), libres = VC.filter((v) => !usados.has(v.id)), r: Record<string, string> = {};
  FXS.forEach((f) => { if (!libres.length || f.top) return; const j = libres.reduce((m, v, k) => (Math.abs(v.t - f.a) < Math.abs(libres[m].t - f.a) ? k : m), 0); r[f.id] = libres.splice(j, 1)[0].id; });
  return r;
})();

// vuelo de la casa: desde el cuarto anterior (alejado) hasta el cuarto de la sección, 2,4 s; después deriva lenta (nunca quieta)
const pull = (p: Pose, k: number): Pose => ({ p: [p.p[0] + (p.p[0] - p.l[0]) * k, p.p[1] + (p.p[1] - p.l[1]) * k + 0.6 * k, p.p[2] + (p.p[2] - p.l[2]) * k], l: p.l, fov: p.fov });
const casaCam = (s: Seg) => {
  const A = pull(ROOM[s.from ?? "wide"], 0.9), B = ROOM[s.room ?? "wide"], d = s.b - s.a;
  const drift: Pose = { p: [B.p[0] + 0.35, B.p[1] - 0.12, B.p[2] - 0.45], l: [B.l[0] + 0.12, B.l[1], B.l[2]], fov: (B.fov ?? 40) - 2 };
  const K: CKey[] = [{ t: s.a - TR, ...A }, { t: s.a + Math.min(2.4, d * 0.45), ...B, arc: 0.5 }, { t: s.b + 1, ...drift }];
  return camPath(K, 1);
};
const CAMS = new Map<Seg, ReturnType<typeof casaCam>>();
const camOf = (s: Seg) => { let c = CAMS.get(s); if (!c) { c = casaCam(s); CAMS.set(s, c); } return c; };

const node = (s: Seg, t: number): React.ReactNode => {
  if (s.k === "av") return <Avatar t={Math.min(Math.max(t, s.a), s.b - 0.04)} />;
  if (s.k === "fx") {
    const A = FXS[s.i!].a, tt = t < A + 1.4 ? A + 0.3 + Math.max(0, t - A) * (1.1 / 1.4) : t;
    return <BgCtx.Provider value={BGFX[s.id]}>{FXS[s.i!].n(tt)}</BgCtx.Provider>;
  }
  if (s.k === "clip") return <Shot id={s.id} t={t} a={s.a} />;
  return <Casa t={t} cam={camOf(s)(t)} ev={{ plugs: [1, 1, 1, 1, 1].map((_, i) => plugsOn(t, i)), focus: s.room, focusAmt: ei(t, s.a, s.a + 2.5) }} />;
};

const trans = (p: number, prev: React.ReactNode, cur: React.ReactNode, kind: "whip" | "portalIn" | "portalOut" | "rise", key: string) => {
  const q = Math.sin(p * Math.PI);
  if (kind === "portalIn" || kind === "portalOut") return [<AbsoluteFill key={key + "p"}>{prev}</AbsoluteFill>, <Portal key={key + "c"} x={960} y={kind === "portalIn" ? 470 : 600} r={p}>{cur}</Portal>];
  if (kind === "rise") return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateY(${-p * 420}px)`, filter: q > 0.05 ? `blur(${q * 18}px)` : undefined }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateY(${(1 - p) * 1080}px)`, filter: q > 0.05 ? `blur(${q * 22}px)` : undefined }}>{cur}</AbsoluteFill>];
  return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateX(${-p * 640}px)`, filter: q > 0.05 ? `blur(${q * 28}px)` : undefined }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateX(${(1 - p) * 1920}px)`, filter: q > 0.05 ? `blur(${q * 34}px)` : undefined }}>{cur}</AbsoluteFill>];
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SEGS.length - 1 && SEGS[i + 1].a - TR <= t) i++;
  const s = SEGS[i], p = i > 0 ? ei(t, s.a - TR, s.a) : 1;
  const L: React.ReactNode[] = [];
  if (p >= 1) L.push(<AbsoluteFill key={"s" + i}>{node(s, t)}</AbsoluteFill>);
  else {
    const pr = SEGS[i - 1];
    // el avatar nunca se desenfoca: entra y sale por portal; dos piezas del mismo componente seguidas → subida
    const kind = s.k === "av" ? "portalIn" : pr.k === "av" ? "portalOut" : pr.k === "fx" && s.k === "fx" ? "rise" : "whip";
    trans(p, node(pr, t), node(s, t), kind, "s" + i).forEach((x) => L.push(x));
  }
  // el audio sale de UN solo master: voz Fish + cama Veo + foley (mezcla31.py, -14 LUFS)
  return <AbsoluteFill style={{ background: "#07090c" }}>{L}<Audio src={staticFile("ctr31amix.wav")} /></AbsoluteFill>;
};
