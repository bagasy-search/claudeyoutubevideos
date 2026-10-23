// wade02 · MINUTO 1 (0-70,5 s), a mano. Un solo hilo, sin cortes secos:
// avatar → (portal) la pared recién pintada 3D, OCTUBRE, la ampolla asoma → (latigazo) la escalera real → (zoom) la ampolla que revienta (LTX)
// → avatar con la tarjeta del agua que corre, WHITE CRUST IS BACK → (portal) macro 3D de los cristales que trepan como escarcha → (latigazo) la pintura
// pelada (raspé ✓ pinté ✓ volvió ✗) → macro real NOT DIRT → avatar NOT MOLD / SALT → (portal) la franja 3D es un MAPA → Wade con la linterna
// → (zoom) el papel aluminio (LTX) THE TEST → (latigazo) flechas 3D ARRIBA / DE COSTADO → avatar $3 · 1979 → (portal) el ayudante de 19 años
// → el pincel que NUNCA llega a la costra → la franja con la lata: un fin de semana y un galón.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { WallWorld, PT, screenOf, camSpeed } from "./wall3d";
import { BigNum, COL, Flash, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug } from "../kits/yanqui3d/lib";
import { Stamp, Price } from "../kits/yanqui3d/engine";
import AVW from "./avwin_k.json";
import AVAIL from "./avail.json";

setSlug("wade02");
export const MIN1_FRAMES = 2115; // 70,5 s
const FL = -2.4;

const HAS = AVAIL as { clips: string[]; imgs: string[] };
// mientras no llega la toma LTX, va la foto del primer cuadro
const FALL: Record<string, string> = { s64: "s01", s65: "s26", s66: "s36", s67: "s54" };
const REEL = true; // public/wade02/reel0.mp4 (reel arreglado sin mosaico)
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; dur?: number }> = ({ k, t, a, from = 0, z = [1.04, 1.12], dur = 8 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  const kk = HAS.clips.includes(k) || HAS.imgs.includes(k) ? k : FALL[k] ?? k;
  const inner = HAS.clips.includes(kk) ? <Vid id={"ltx_" + kk} from={from} at={a} /> : HAS.imgs.includes(kk) ? <Vid id={"img_" + kk} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (preroll 10 cuadros) ----------
const WIN = (AVW as number[][]).filter(([ms]) => ms < 70.4).map(([ms, me, off]) => ({ ms, me, off }));
const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = REEL ? WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (w.ms > 0 ? 10 : 0))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// mundo 3D con blur de movimiento real
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WallWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// texto grande con extrusión
export const Big: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 150, size = 92, col = COL.ink }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.6)"), transform: `scale(${0.92 + 0.08 * Math.min(1, spr(t, at))})` }}>{text}</div>;
};
type P3 = [number, number, number];
// rótulo anclado a un punto 3D (sigue a la cámara)
export const T3: React.FC<{ t: number; at: number; out: number; pt: P3; text: string; sub?: string; dx?: number; dy?: number; col?: string; size?: number }> = ({ t, pt, ...r }) => {
  if (t < r.at - 0.1 || t > r.out + 0.4) return null;
  const q = screenOf(t, pt);
  return <Tag t={t} x={q.x} y={q.y} {...r} />;
};
// latigazo: A sale y B entra, con blur de movimiento
export const whip = (t: number, at: number, A: React.ReactNode, B: React.ReactNode, key: string, dir: "x" | "-x" | "y" = "x") => {
  const wp = ei(t, at, at + 0.45), mb = Math.sin(wp * Math.PI) * 40;
  const tr = (k: number) => dir === "y" ? `translateY(${k * 1080}px)` : `translateX(${(dir === "x" ? 1 : -1) * k * 1920}px)`;
  return [
    <AbsoluteFill key={key + "a"} style={{ transform: tr(-wp), filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{A}</AbsoluteFill>,
    wp > 0 ? <AbsoluteFill key={key + "b"} style={{ transform: tr(1 - wp), filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{B}</AbsoluteFill> : null,
  ];
};
// zoom a través: A crece y se desenfoca, B aparece debajo
export const zoomThru = (t: number, at: number, A: React.ReactNode, B: React.ReactNode, key: string, ox = 960, oy = 540) => {
  const z = ei(t, at, at + 0.5);
  return [
    z > 0.25 ? <AbsoluteFill key={key + "b"} style={{ opacity: e(t, at + 0.15, at + 0.5) }}>{B}</AbsoluteFill> : null,
    <AbsoluteFill key={key + "a"} style={{ transformOrigin: `${ox}px ${oy}px`, transform: `scale(${1 + z * z * 5})`, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined, opacity: 1 - e(t, at + 0.3, at + 0.5) }}>{A}</AbsoluteFill>,
  ];
};
// lista con tilde / cruz que entra renglón a renglón
export const Ticks: React.FC<{ t: number; rows: { at: number; txt: string; ok: boolean }[]; out: number; x: number; y: number }> = ({ t, rows, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.25);
  if (o <= 0.01 || t < rows[0].at - 0.05) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT, fontWeight: 900, letterSpacing: 4 }}>
      {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.15); return k > 0.01 ? (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 18, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>
          <div style={{ width: 78, height: 78, borderRadius: 16, background: r.ok ? "#2f7d4a" : COL.red, color: "#fff", fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(0,0,0,.5)" }}>{r.ok ? "✓" : "✗"}</div>
          <div style={{ fontSize: 76, color: r.ok ? COL.ink : "#ffb3a8", textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{r.txt}</div>
        </div>) : null; })}
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-4,4 · avatar: “You painted that basement wall in the spring. Fresh white paint” → portal a la pared 3D =====
  if (t < 4.45) {
    L.push(<Avatar key="avA" t={t} blur={10 * e(t, 3.7, 4.2)} dark={0.35 * e(t, 3.7, 4.2)} />);
    L.push(<Big key="fw" t={t} at={3.14} out={3.85} text="FRESH WHITE PAINT" y={820} size={84} />);
    const r = ei(t, 3.95, 4.42);
    if (r > 0) L.push(<Portal key="pA" x={1380} y={430} r={r}><World t={4.4} /></Portal>);
  }
  // ===== B · 4,4-8,0 · la pared recién pintada (3D): “two coats, looked brand new. Now it's October” — la ampolla asoma =====
  if (t >= 4.4 && t < 8.5) {
    const B = <AbsoluteFill><World t={Math.min(t, 8.0)} />
      <BigNum t={t} at={4.52} text="2 COATS" x={560} y={260} size={130} out={6.5} />
      <Big t={t} at={5.26} out={6.6} text="BRAND NEW" y={760} size={80} col="#fffbe9" />
      <BigNum t={t} at={6.84} text="OCTOBER" x={1300} y={230} size={140} col={COL.amber} edge="#5a3510" out={7.95} />
    </AbsoluteFill>;
    L.push(...whip(t, 8.0, B, <Shot k="s07" t={t} a={8.0} />, "wB"));
  }
  // ===== C · 8,0-10,3 · la escalera real: “you come down the stairs” → zoom a la ampolla =====
  if (t >= 8.45 && t < 10.85) L.push(...zoomThru(t, 10.3, <Shot k="s07" t={t} a={8.0} />, <Shot k="s64" t={t} a={10.3} z={[1.02, 1.06]} />, "zC", 1100, 700));
  // ===== D · 10,3-17,1 · LTX: la ampolla del tamaño de la mano revienta; el agua corre =====
  if (t >= 10.8 && t < 17.6) {
    const D = <AbsoluteFill><Shot k="s64" t={t} a={10.3} z={[1.02, 1.06]} />
      <Tag t={t} at={10.36} x={1000} y={640} dx={-300} dy={-200} text="A BUBBLE" sub="IN THE PAINT" col={COL.ice} out={12.7} size={56} />
      <Tag t={t} at={12.88} x={1000} y={640} dx={300} dy={-180} text="SIZE OF" sub="YOUR HAND" col={COL.amber} out={14.6} size={56} />
      <Flash t={t} at={16.45} peak={0.45} />
      <Big t={t} at={16.5} out={17.0} text="POP" y={140} size={120} col={COL.ice2} />
    </AbsoluteFill>;
    L.push(...whip(t, 17.1, D, <Avatar t={Math.max(t, 17.1)} />, "wD"));
  }
  // ===== E · 17,1-22,4 · avatar: tarjeta del agua que corre; “that white crust is back” → portal a la macro 3D =====
  if (t >= 17.55 && t < 22.45) {
    const bl = e(t, 17.6, 18.0) * (1 - e(t, 20.1, 20.5));
    L.push(<Avatar key="avE" t={t} blur={12 * bl} dark={0.35 * bl} />);
    const k = Math.min(1, spr(t, 17.6, 0.9)), o = e(t, 17.6, 17.75) * (1 - e(t, 20.1, 20.4));
    if (o > 0.01) L.push(<div key="cardE" style={{ position: "absolute", left: 960, top: 500, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) rotateY(${(1 - k) * 70 - 6}deg) translateZ(${(1 - k) * -900}px)` }}>
      <div style={{ width: 860, height: 484, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.7), 0 0 0 4px rgba(255,255,255,.8)" }}><Shot k="s02" t={t} a={17.6} z={[1.08, 1.14]} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, letterSpacing: 6, color: COL.ice2, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>WATER RUNS DOWN</div>
    </div>);
    L.push(<Big key="wc" t={t} at={20.56} out={21.95} text="THE WHITE CRUST IS BACK" y={130} size={82} />);
    const r = ei(t, 21.95, 22.42);
    if (r > 0) L.push(<Portal key="pE" x={960} y={560} r={r}><World t={22.4} /></Portal>);
  }
  // ===== F · 22,4-26,2 · macro 3D: “Fuzzy, chalky, climbing up the block like frost” =====
  if (t >= 22.4 && t < 26.7) {
    const F = <AbsoluteFill><World t={Math.min(t, 26.2)} />
      <BigNum t={t} at={22.64} text="FUZZY" x={520} y={250} size={130} out={23.9} />
      <BigNum t={t} at={23.26} text="CHALKY" x={1380} y={330} size={130} out={24.8} />
      <Big t={t} at={24.9} out={25.95} text="LIKE FROST" y={780} size={96} col={COL.ice} />
    </AbsoluteFill>;
    L.push(...whip(t, 26.2, F, <Shot k="s03" t={t} a={26.2} />, "wF", "-x"));
  }
  // ===== G · 26,2-30,9 · la pintura pelada: raspé ✓ pinté ✓ volvió ✗ =====
  if (t >= 26.65 && t < 31.4) {
    const G = <AbsoluteFill><Shot k="s03" t={t} a={26.2} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.55), transparent 55%)" }} />
      <Ticks t={t} x={110} y={330} out={30.6} rows={[{ at: 26.46, txt: "SCRAPED IT", ok: true }, { at: 28.5, txt: "PAINTED OVER", ok: true }, { at: 29.92, txt: "CAME BACK", ok: false }]} />
    </AbsoluteFill>;
    L.push(...zoomThru(t, 30.9, G, <Shot k="s18" t={t} a={30.9} z={[1.0, 1.1]} dur={3} />, "zG", 1300, 520));
  }
  // ===== H · 30,9-33,9 · macro real de los cristales: “not dirt” =====
  if (t >= 31.35 && t < 34.4) {
    const H = <AbsoluteFill><Shot k="s18" t={t} a={30.9} z={[1.0, 1.1]} dur={3} />
      <Stamp t={t} at={33.14} text="NOT DIRT" x={640} y={300} out={33.85} rot={-7} size={96} />
    </AbsoluteFill>;
    L.push(...whip(t, 33.9, H, <Avatar t={Math.max(t, 33.9)} />, "wH"));
  }
  // ===== I · 33,9-37,8 · avatar: “it is not mold. It's salt.” → portal a la franja 3D =====
  if (t >= 34.35 && t < 37.85) {
    L.push(<Avatar key="avI" t={t} />);
    L.push(<Stamp key="nm" t={t} at={34.58} text="NOT MOLD" x={1450} y={300} out={35.7} rot={6} size={96} />);
    L.push(<BigNum key="sa" t={t} at={35.96} text="SALT" x={1420} y={320} size={190} col="#f6f5ee" edge="#6c6a60" out={37.3} />);
    const r = ei(t, 37.35, 37.82);
    if (r > 0) L.push(<Portal key="pI" x={1420} y={330} r={r}><World t={37.8} /></Portal>);
  }
  // ===== J · 37,8-41,9 · la franja es un MAPA: “telling you exactly where the water is coming from” =====
  if (t >= 37.8 && t < 42.4) {
    const J = <AbsoluteFill><World t={Math.min(t, 41.9)} />
      <T3 t={t} at={38.16} out={39.9} pt={PT.tide} text="A MAP" dx={-260} dy={-200} col={COL.amber} size={64} />
      <T3 t={t} at={39.22} out={41.3} pt={PT.cut} text="WHERE THE WATER" sub="IS COMING FROM" dx={-420} dy={-260} col={COL.ice} size={52} />
      <Big t={t} at={41.46} out={41.85} text="READ IT" y={130} size={96} />
    </AbsoluteFill>;
    L.push(...whip(t, 41.9, J, <Shot k="s05" t={t} a={41.9} />, "wJ"));
  }
  // ===== K · 41,9-45,5 · Wade con la linterna: “I'm going to show you how to read it… the test” =====
  if (t >= 42.35 && t < 46.0) {
    const K = <AbsoluteFill><Shot k="s05" t={t} a={41.9} />
      <Big t={t} at={43.56} out={45.1} text="HOW TO READ IT" y={130} size={84} />
    </AbsoluteFill>;
    L.push(...zoomThru(t, 45.5, K, <Shot k="s65" t={t} a={45.5} z={[1.02, 1.06]} />, "zK", 960, 600));
  }
  // ===== L · 45,5-48,5 · LTX: el papel aluminio con gotas — THE TEST =====
  if (t >= 45.95 && t < 49.0) {
    const Lr = <AbsoluteFill><Shot k="s65" t={t} a={45.5} z={[1.02, 1.06]} />
      <BigNum t={t} at={45.6} text="THE TEST" x={960} y={200} size={140} col={COL.ice2} edge="#1d4a6e" out={48.0} />
    </AbsoluteFill>;
    L.push(...whip(t, 48.5, Lr, <World t={48.5} />, "wL", "y"));
  }
  // ===== M · 48,5-51,6 · flechas 3D: “rising up from the floor, or pushing in from the dirt outside” =====
  if (t >= 48.95 && t < 52.1) {
    const M = <AbsoluteFill><World t={Math.min(t, 51.6)} />
      <T3 t={t} at={48.6} out={51.3} pt={[3.86, FL + 1.15, -0.4]} text="UP" sub="FROM THE FLOOR" dx={-300} dy={-140} col={COL.ice} size={60} />
      <T3 t={t} at={49.6} out={51.3} pt={[5.7, -0.9, 3.06]} text="SIDEWAYS" sub="FROM THE DIRT" dx={-40} dy={-230} col={COL.amber} size={60} />
    </AbsoluteFill>;
    L.push(...whip(t, 51.6, M, <Avatar t={Math.max(t, 51.6)} />, "wM"));
  }
  // ===== N · 51,6-57,8 · avatar: “the $3 fix an old roofer showed me back in 1979” → portal al ayudante de 19 =====
  if (t >= 52.05 && t < 57.85) {
    L.push(<Avatar key="avN" t={t} />);
    L.push(<Price key="p3" t={t} at={53.16} x={1430} y={320} item="THE FIX" $={3} out={55.9} />);
    L.push(<BigNum key="y79" t={t} at={56.22} text="1979" x={1420} y={300} size={170} col={COL.amber} edge="#5a3510" out={57.4} />);
    const r = ei(t, 57.35, 57.82);
    if (r > 0) L.push(<Portal key="pN" x={1420} y={310} r={r}><Shot k="s11" t={t} a={57.35} /></Portal>);
  }
  // ===== O · 57,8-61,9 · el ayudante de 19 años: “didn't know a thing” =====
  if (t >= 57.8 && t < 62.4) {
    const O = <AbsoluteFill><Shot k="s11" t={t} a={57.35} />
      <BigNum t={t} at={58.46} text="19" sub="YEARS OLD" x={420} y={300} size={180} out={60.0} />
      <Big t={t} at={60.1} out={61.6} text="DIDN'T KNOW A THING" y={800} size={76} />
    </AbsoluteFill>;
    L.push(...whip(t, 61.9, O, <Shot k="s85" t={t} a={61.9} />, "wO"));
  }
  // ===== P · 61,9-66,0 · el pincel que nunca llega: “never, ever paint over” =====
  if (t >= 62.35 && t < 66.5) {
    const Pn = <AbsoluteFill><Shot k="s85" t={t} a={61.9} />
      <Stamp t={t} at={63.72} text="NEVER PAINT OVER IT" x={960} y={260} out={65.7} rot={-5} size={92} />
    </AbsoluteFill>;
    L.push(...whip(t, 66.0, Pn, <Shot k="s04" t={t} a={66.0} />, "wP", "-x"));
  }
  // ===== Q · 66,0-70,5 · la franja con la lata: “cost you a weekend and a gallon of paint” =====
  if (t >= 66.45) {
    L.push(<AbsoluteFill key="s04"><Shot k="s04" t={t} a={66.0} /></AbsoluteFill>);
    L.push(<Big key="mi" t={t} at={66.46} out={67.9} text="THE MISTAKE" y={130} size={88} col={COL.red} />);
    L.push(<BigNum key="wk" t={t} at={68.2} text="−1 WEEKEND" x={560} y={760} size={100} out={70.4} />);
    L.push(<BigNum key="gal" t={t} at={69.32} text="−1 GALLON" x={1380} y={760} size={100} col={COL.amber} edge="#5a3510" out={70.4} />);
  }
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
