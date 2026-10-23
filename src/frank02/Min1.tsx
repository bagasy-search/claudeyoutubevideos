// frank02 · MINUTO 1 (0 → "so let's start with"), a mano, vara gary01: un solo hilo visual, cero cortes secos.
// avatar "you've seen this one" → (zoom a través) la carretilla 3D → (portal) el video viral: el aceite cae, la pala revuelve
// → avatar con el rótulo del video → (latigazo) las gotas que hacen perla: STRONGER · WATERPROOF · NEVER CRACKS
// → VOS: el pozo del poste → avatar con el bidón del garaje en un portal: FREE → la carretilla 3D: WHAT'S THE HARM?
// → (portal) Frank lo hizo igual → los encofrados, 1 MONTH → el martillo: la esquina salta → avatar FRANK, 40 años
// → escalón, carretilla → avatar "I'll show you" → la balanza con los 3 bloques: PLAIN · MOTOR OIL · THE RIGHT STUFF
// → avatar → (zoom a través) la cara del bloque gigante: burbujas = A PIECE OF TRUTH, venas negras = NOT THIS PIECE.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BlockWorld, PT, screenOf, camAt } from "./block3d";
import { ST } from "./states";
import { BigNum, COL, Chips, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug, setDurs } from "../kits/yanqui3d/lib";
import { Words } from "../kits/yanqui3d/pieces";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("frank02");
setDurs((AVAIL as { dur?: Record<string, number> }).dur);
export const T0 = Math.round((ST.start - 0.05) * 30) / 30;
export const MIN1_FRAMES = Math.round(T0 * 30);

// ---------- tomas: mp4 si llegó; si no la foto (fb = foto de reemplazo); si no un fondo ----------
const HAS = AVAIL as { clips: string[]; imgs: string[]; reel?: boolean };
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; fb?: string }> = ({ k, t, a, from = 0, z = [1.04, 1.12], fb }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const im = fb ?? k;
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} from={from} at={a} /> : HAS.imgs.includes(im) ? <Vid id={"img_" + im} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#2a2f36,#101317)", color: "#667", fontFamily: FONT, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (avwin), preroll 10 cuadros ----------
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = !HAS.reel ? <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : WIN.filter((w) => t > w.ms - 1 && t < w.me + 1.5).map((w) => (
    <Sequence key={w.ms} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 32} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.7 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- mundo 3D con blur de movimiento real ----------
const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / 30);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, dp * 0.18), by: Math.min(10, dp * 0.08) };
};
export const World: React.FC<{ t: number; blur?: number }> = ({ t, blur = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><BlockWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// latigazo lateral entre dos capas (k: 0→1)
const HB: React.FC<{ id: string; x: number }> = ({ id, x }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" width="140%"><feGaussianBlur stdDeviation={`${x} 0`} /></filter></svg>;
export const whip = (k: number, prev: React.ReactNode, cur: React.ReactNode, key: string, dir = -1) => {
  const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2);
  return [
    <AbsoluteFill key={key} style={{ transform: `translateX(${(out ? dir : -dir) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${key}h${b})` : undefined }}>{b ? <HB id={`${key}h${b}`} x={b} /> : null}{out ? prev : cur}</AbsoluteFill>,
    k2 > 0.4 ? <AbsoluteFill key={key + "l"} style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} /> : null,
  ];
};
// zoom a través (la capa de adelante crece y se desvanece revelando la de atrás, que viene de chica)
export const zoomThru = (k: number, prev: React.ReactNode, cur: React.ReactNode, key: string, o: [number, number] = [960, 540]) => {
  const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k));
  return [
    <AbsoluteFill key={key + "c"} style={{ transformOrigin: `${o[0]}px ${o[1]}px`, transform: `scale(${0.6 + 0.4 * z})`, opacity: e(k, 0.25, 0.6), filter: b ? `blur(${b * 0.5}px)` : undefined }}>{cur}</AbsoluteFill>,
    <AbsoluteFill key={key + "p"} style={{ transformOrigin: `${o[0]}px ${o[1]}px`, transform: `scale(${1 + z * z * 5})`, opacity: 1 - e(k, 0.35, 0.75), filter: b ? `blur(${b}px)` : undefined }}>{prev}</AbsoluteFill>,
  ];
};
// empuje vertical (la toma de arriba sale, la de abajo entra)
const push = (k: number, prev: React.ReactNode, cur: React.ReactNode, key: string) => [
  <AbsoluteFill key={key + "p"} style={{ transform: `translateY(${-k * 1080}px)`, filter: `blur(${Math.sin(k * Math.PI) * 18}px)` }}>{prev}</AbsoluteFill>,
  <AbsoluteFill key={key + "c"} style={{ transform: `translateY(${(1 - k) * 1080}px)`, filter: `blur(${Math.sin(k * Math.PI) * 18}px)` }}>{cur}</AbsoluteFill>,
];

// el rótulo del video viral (genérico, sin marca): barra oscura abajo con el texto que se escribe solo
const Caption: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at, out, text }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at + 0.1, at + 1.3)), k = Math.min(1.05, spr(t, at));
  return (
    <div style={{ position: "absolute", left: 960, top: 820, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(-1.5deg)`, background: "rgba(10,10,12,.82)", borderRadius: 22, padding: "22px 40px", border: "3px solid rgba(255,255,255,.18)", boxShadow: "0 18px 40px rgba(0,0,0,.55)", maxWidth: 1400 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, color: "#fff", letterSpacing: 1 }}>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>|</span></div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#ffb257", marginTop: 8, letterSpacing: 3 }}>2.9M VIEWS</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const S = ST;
  const W1 = WIN.find((w) => w.ms > 15 && w.ms < 20)!.ms, W2 = WIN.find((w) => w.ms > 30 && w.ms < 34)!, W4 = WIN.find((w) => w.ms > 62 && w.ms < 66)!, W5 = WIN.find((w) => w.ms > 76 && w.ms < 80)!;

  // ===== A · 0 → wheelbarrow · avatar "you've seen this one" =====
  const tA = S.wheel + 0.15;
  if (t < tA + 0.6) {
    const k = ei(t, tA, tA + 0.6);
    if (k > 0) L.push(...zoomThru(k, <Avatar t={t} />, <World t={Math.max(t, tA)} />, "zA", [960, 640]));
    else L.push(<Avatar key="avA" t={t} />);
    L.push(<Tag key="tVir" t={t} at={0.25} x={1420} y={330} dx={-90} dy={-90} text="THE VIRAL VIDEO" col={COL.amber} out={tA - 0.2} />);
  }
  // ===== B · la carretilla 3D: concreto fresco → (portal) el video viral: el aceite cae, glug, la pala =====
  const tB = S.picks - 0.1;
  if (t >= tA + 0.6 && t < tB + 0.6) {
    L.push(<World key="wB" t={t} />);
    const wp = screenOf(t, PT.wheel);
    L.push(<Tag key="tFr" t={t} at={tA + 0.7} x={wp.x} y={wp.y} dx={200} dy={-160} text="FRESH CONCRETE" out={tB} size={42} />);
    const r = ei(t, tB, tB + 0.6), cp = screenOf(tB, PT.wheel);
    if (r > 0) L.push(<Portal key="pB" x={cp.x} y={cp.y} r={r}><Shot k="g01" fb="m01" t={t} a={tB} /></Portal>);
  }
  if (t >= tB + 0.6 && t < W1 + 0.3) {
    // el gancho LTX (15 s): aceite que cae, se vacía, la pala revuelve; si no llegó, las fotos m01 → m02
    const ltx = HAS.clips.includes("g01");
    const shot = ltx ? <Shot k="g01" t={t} a={tB} z={[1.02, 1.06]} /> : t < S.glug + 1.2 ? <Shot k="m01" t={t} a={tB} /> : <Shot k="m02" t={t} a={S.glug + 1.2} />;
    const k = ei(t, W1 - 0.3, W1 + 0.3);
    if (k > 0) L.push(...whip(k, shot, <Avatar t={t} />, "wB2"));
    else L.push(<AbsoluteFill key="sB">{shot}</AbsoluteFill>);
    L.push(<Tag key="tJug" t={t} at={S.picks + 0.3} x={1260} y={360} dx={-160} dy={-120} text="BLACK MOTOR OIL" col={COL.amber} out={S.pours + 1.4} />);
    L.push(<Words key="wGl" t={t} items={[{ at: S.glug, txt: "GLUG" }, { at: S.glug + 0.45, txt: "GLUG" }, { at: S.glug + 0.9, txt: "GLUG", col: COL.amber }]} out={S.mixes - 0.1} y={250} size={130} />);
    L.push(<Tag key="tDk" t={t} at={S.dark} x={960} y={620} dx={240} dy={-170} text="DARK & SHINY" out={W1 - 0.3} />);
  }
  // ===== C · avatar con el rótulo del video → (latigazo) las gotas en perla =====
  const tC = S.stronger - 0.35;
  if (t >= W1 + 0.3 && t < tC + 0.6) {
    const k = ei(t, tC, tC + 0.6);
    if (k > 0) L.push(...whip(k, <Avatar t={t} />, <Shot k="m03" t={t} a={tC} />, "wC", 1));
    else L.push(<Avatar key="avC" t={t} />);
  }
  if (t >= S.caption - 0.2 && t < tC + 0.4) L.push(<Caption key="cap" t={t} at={S.caption + 0.3} out={tC + 0.1} text="Billions of people don't know this trick" />);
  // ===== D · gotas en perla: STRONGER · WATERPROOF · NEVER CRACKS → (empuje) VOS: el pozo del poste =====
  const tD = S.fence - 0.2;
  if (t >= tC + 0.6 && t < tD + 0.6) {
    const k = ei(t, tD, tD + 0.6);
    const shot = <Shot k="m03" t={t} a={tC} />;
    if (k > 0) L.push(...push(k, shot, <Shot k="m05" t={t} a={tD} />, "pD"));
    else L.push(<AbsoluteFill key="sD">{shot}</AbsoluteFill>);
  }
  if (t >= S.stronger - 0.2 && t < S.youCome + 0.5) L.push(<Words key="wSt" t={t} items={[{ at: S.stronger, txt: "STRONGER" }, { at: S.waterproof, txt: "WATERPROOF" }, { at: S.never, txt: "NEVER CRACKS", col: COL.amber }]} out={S.youCome} y={540} size={120} />);
  if (t >= S.youCome - 0.1 && t < tD + 0.3) L.push(<Words key="wYou" t={t} items={[{ at: S.youCome + 0.2, txt: "NOW YOU", col: COL.amber }]} out={tD} y={860} size={110} />);
  // ===== E · el pozo del poste, el contrapiso de los tachos → avatar =====
  if (t >= tD + 0.6 && t < W2.ms + 0.5) {
    const k = ei(t, W2.ms - 0.1, W2.ms + 0.5);
    const shot = <Shot k="m05" t={t} a={tD} />;
    if (k > 0) L.push(...whip(k, shot, <Avatar t={t} />, "wE"));
    else L.push(<AbsoluteFill key="sE">{shot}</AbsoluteFill>);
    L.push(<Tag key="tPost" t={t} at={S.fence + 0.3} x={1060} y={640} dx={-220} dy={-160} text="A FENCE POST" sub="THIS WEEKEND" col={COL.amber} out={S.pad - 0.1} />);
    L.push(<Tag key="tPad" t={t} at={S.pad + 0.2} x={1300} y={700} dx={160} dy={-170} text="A PAD FOR THE TRASH CANS" out={W2.ms - 0.1} size={40} />);
  }
  // ===== F · avatar; el bidón del garaje en un portal: FREE → la carretilla 3D: WHAT'S THE HARM? =====
  const tF = S.free + 1.0;
  if (t >= W2.ms + 0.5 && t < tF + 0.6) {
    const k = ei(t, tF, tF + 0.6);
    if (k > 0) L.push(...zoomThru(k, <Avatar t={t} />, <World t={Math.max(t, tF)} />, "zF", [1380, 520]));
    else L.push(<Avatar key="avF" t={t} />);
    const r = ei(t, S.garage + 0.4, S.garage + 0.9) * (1 - ei(t, tF - 0.4, tF));
    if (r > 0) L.push(<div key="pF" style={{ position: "absolute", left: 1080, top: 120, width: 720, height: 420, borderRadius: 26, overflow: "hidden", transform: `scale(${0.6 + 0.4 * r})`, opacity: r, boxShadow: "0 24px 60px rgba(0,0,0,.6)", border: "6px solid #f4efe6" }}><Shot k="m04" t={t} a={S.garage + 0.4} /></div>);
    L.push(<BigNum key="free" t={t} at={S.free + 0.5} text="FREE" x={1440} y={700} size={170} col="#9df0b4" edge="#1f5a36" out={tF - 0.2} />);
  }
  // ===== G · el chorro y el remolino en 3D: WHY NOT? WHAT'S THE HARM? → (portal) Frank lo hizo igual =====
  const tG = S.didIt - 0.1;
  if (t >= tF + 0.6 && t < tG + 0.6) {
    L.push(<World key="wG" t={t} />);
    L.push(<Words key="wHarm" t={t} items={[{ at: S.whyNot, txt: "WHY NOT?" }, { at: S.harm, txt: "WHAT'S THE HARM?", col: COL.amber }]} out={tG - 0.2} y={200} size={110} />);
    const r = ei(t, tG, tG + 0.6), cp = screenOf(tG, PT.wheel);
    if (r > 0) L.push(<Portal key="pG" x={cp.x} y={cp.y} r={r}><Shot k="s21" t={t} a={tG} /></Portal>);
  }
  // ===== H · Frank vierte el aceite: I DID IT → los encofrados: 1 MONTH → el martillo =====
  const tH = S.cure - 0.15, tH2 = S.hammer - 0.2;
  if (t >= tG + 0.6 && t < tH + 0.6) {
    const k = ei(t, tH, tH + 0.6);
    const shot = <Shot k="s21" t={t} a={tG} />;
    if (k > 0) L.push(...zoomThru(k, shot, <Shot k="m07" t={t} a={tH} />, "zH"));
    else L.push(<AbsoluteFill key="sH">{shot}</AbsoluteFill>);
    L.push(<Tag key="tDid" t={t} at={S.didIt + 0.1} x={900} y={520} dx={-220} dy={-170} text="I DID IT" col={COL.amber} out={S.exactly - 0.1} size={56} />);
    L.push(<Tag key="tEx" t={t} at={S.exactly} x={900} y={520} dx={230} dy={-150} text="EXACTLY LIKE THE VIDEO" out={tH} size={40} />);
  }
  if (t >= tH + 0.6 && t < tH2 + 0.5) {
    const k = ei(t, tH2, tH2 + 0.5);
    const shot = <Shot k="m07" t={t} a={tH} />;
    if (k > 0) L.push(...whip(k, shot, <Shot k="m06" t={t} a={tH2} />, "wH", 1));
    else L.push(<AbsoluteFill key="sH2">{shot}</AbsoluteFill>);
    L.push(<BigNum key="mo" t={t} at={S.cure + 0.4} text="1 MONTH" x={1380} y={330} size={170} out={tH2 - 0.2} sub="TO CURE" />);
  }
  // ===== I · el martillo: la esquina salta → avatar FRANK =====
  const tI = S.name - 0.25;
  if (t >= tH2 + 0.5 && t < tI + 0.6) {
    const k = ei(t, tI, tI + 0.6);
    const shot = <Shot k="m06" t={t} a={tH2} z={[1.06, 1.16]} />;
    if (k > 0) L.push(...whip(k, shot, <Avatar t={t} />, "wI"));
    else L.push(<AbsoluteFill key="sI">{shot}</AbsoluteFill>);
    L.push(<Flash key="fl" t={t} at={S.hammer + 0.75} peak={0.6} />);
  }
  // ===== J · avatar: FRANK, albañil, New Jersey, +40 años → escalón → carretilla =====
  const tJ = S.sidewalks - 0.3, tJ2 = S.wheelbarrows - 0.1;
  if (t >= tI + 0.6 && t < tJ + 0.6) {
    const k = ei(t, tJ, tJ + 0.6);
    if (k > 0) L.push(<AbsoluteFill key="jA"><Avatar t={t} /></AbsoluteFill>, <Portal key="pJ" x={560} y={540} r={k}><Shot k="m09" t={t} a={tJ} /></Portal>);
    else L.push(<Avatar key="avJ" t={t} />);
  }
  if (t >= S.name - 0.4 && t < tJ + 0.5) L.push(<LowerThird key="lt" t={t} at={S.name - 0.1} out={tJ} name="FRANK" l2="MASON · NEW JERSEY · 40+ YEARS" l2at={S.forty - 0.6} />);
  if (t >= tJ + 0.6 && t < W4.ms + 0.5) {
    const k1 = ei(t, tJ2, tJ2 + 0.6), k2 = ei(t, W4.ms - 0.1, W4.ms + 0.5);
    if (k2 > 0) L.push(...whip(k2, <Shot k="m08" t={t} a={tJ2} />, <Avatar t={t} />, "wJ2"));
    else if (k1 > 0) L.push(...zoomThru(k1, <Shot k="m09" t={t} a={tJ} />, <Shot k="m08" t={t} a={tJ2} />, "zJ"));
    else if (t < tJ2) L.push(<AbsoluteFill key="sJ"><Shot k="m09" t={t} a={tJ} /></AbsoluteFill>);
    else L.push(<AbsoluteFill key="sJ2"><Shot k="m08" t={t} a={tJ2} /></AbsoluteFill>);
  }
  if (t >= tJ - 0.2 && t < W4.ms) L.push(<Words key="wJob" t={t} items={[{ at: S.sidewalks, txt: "SIDEWALKS" }, { at: S.sidewalks + 1.0, txt: "STEPS" }, { at: S.sidewalks + 1.8, txt: "FOUNDATIONS" }, { at: S.sidewalks + 2.9, txt: "FENCE POSTS", col: COL.amber }]} out={S.wheelbarrows} y={860} size={96} />);
  // ===== K · avatar: I'LL SHOW YOU → (zoom a través) la balanza con los 3 bloques =====
  const tK = S.show + 1.2;
  if (t >= W4.ms + 0.5 && t < tK + 0.6) {
    const k = ei(t, tK, tK + 0.6);
    if (k > 0) L.push(...zoomThru(k, <Avatar t={t} />, <World t={Math.max(t, tK)} />, "zK", [960, 560]));
    else L.push(<Avatar key="avK" t={t} />);
    L.push(<Words key="wShow" t={t} items={[{ at: S.show, txt: "I'LL SHOW YOU", col: COL.amber }]} out={tK - 0.1} y={860} size={100} />);
  }
  // ===== L · 3 bloques, misma bolsa, mismo día: PLAIN · MOTOR OIL · THE RIGHT STUFF → avatar =====
  if (t >= tK + 0.6 && t < W5.ms + 0.7) {
    const tw = Math.min(t, W5.ms + 0.1);
    const k = ei(t, W5.ms + 0.1, W5.ms + 0.7);
    if (k > 0) L.push(...whip(k, <World t={tw} />, <Avatar t={t} />, "wL"));
    else L.push(<World key="wL0" t={t} />);
    const b1 = screenOf(tw, PT.b1), b2 = screenOf(tw, PT.b2), b3 = screenOf(tw, PT.b3);
    L.push(<Tag key="t1" t={t} at={S.plain} x={b1.x} y={b1.y} dx={60} dy={-230} text="PLAIN" out={W5.ms} />);
    L.push(<Tag key="t2" t={t} at={S.withOil} x={b2.x} y={b2.y} dx={0} dy={-260} text="MOTOR OIL" col={COL.red} out={W5.ms} />);
    L.push(<Tag key="t3" t={t} at={S.stuff + 0.3} x={b3.x} y={b3.y} dx={-60} dy={-230} text="THE RIGHT STUFF" col="#9df0b4" out={W5.ms} size={40} />);
  }
  if (t >= S.three - 0.3 && t < S.plain) L.push(<Chips key="same" t={t} at={S.sameBag} items={["SAME CEMENT", "SAME SAND", "SAME WATER", "SAME DAY"]} out={S.plain - 0.3} y={790} />);
  if (t >= S.three - 0.2 && t < S.sameBag) L.push(<BigNum key="3b" t={t} at={S.three} text="3 BLOCKS" x={960} y={250} size={150} out={S.sameBag - 0.1} />);
  // ===== M · avatar "surprised even me" → (zoom a través) la cara del bloque gigante =====
  const tM = Math.min(S.surprised - 0.6, W5.me - 0.45); // el mundo entra antes de que se acabe la ventana del avatar (si no, negro)
  if (t >= W5.ms + 0.7 && t < tM + 0.6) {
    const k = ei(t, tM, tM + 0.6);
    if (k > 0) L.push(...zoomThru(k, <Avatar t={t} />, <World t={Math.max(t, tM)} />, "zM"));
    else L.push(<Avatar key="avM" t={t} />);
    L.push(<Tag key="tProm" t={t} at={W5.ms + 1.0} x={1400} y={420} dx={-100} dy={-130} text="WHAT THE VIDEO PROMISES" col={COL.amber} out={tM} size={40} />);
  }
  // ===== N · burbujas = A PIECE OF TRUTH; venas negras = NOT THE PIECE THEY SHOW YOU =====
  if (t >= tM + 0.6) {
    L.push(<World key="wN" t={t} />);
    L.push(<Words key="wLie" t={t} items={[{ at: S.notLie, txt: "NOT A COMPLETE LIE" }]} out={S.truth - 0.1} y={180} size={96} />);
    const fc = screenOf(t, PT.faceTop);
    L.push(<Tag key="tTr" t={t} at={S.truth + 0.6} x={fc.x - 180} y={fc.y + 160} dx={-220} dy={-120} text="A PIECE OF TRUTH" col="#9df0b4" out={S.notPiece - 0.1} />);
    L.push(<Tag key="tNp" t={t} at={S.notPiece + 0.6} x={fc.x + 160} y={fc.y + 220} dx={240} dy={-140} text="NOT THE PIECE" sub="THEY SHOW YOU" col={COL.red} out={T0 + 1} />);
  }

  void extrude;
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
