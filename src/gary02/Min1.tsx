// gary02 · MINUTO 1 (0-99 s): "Don't buy a generator". Un solo hilo visual, sin cortes secos:
// avatar (generador tachado) → (latigazo) Gary entre el generador y la estación de batería → (zoom) la casa en corte de noche,
// la niebla ya en el dormitorio → (portal desde el que duerme) GANCHO LTX: el generador rugiendo en el garaje → avatar con el
// precio colgante → (zoom) garaje 3D: el portón "un pie", el cable naranja cruza la casa hasta la heladera → toma "loud but working"
// → el despertador 3:00 → avatar con la alarma de CO titilando → (zoom por la tarjeta) el CO avanza por la casa y sube al dormitorio
// → (portal) la mañana después → avatar con ~100 muertes/año → el cable de la heladera → Gary electricista (tablero, carburador)
// → avatar → (se abre como puerta) LA ARENA: tres pedestales que se encienden uno por uno → avatar con las fichas → arena con la duda.
// Cada pieza entra en su palabra con at("frase"). Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HouseWorld, PT, screenOf, camSpeed } from "./house3d";
import { ArenaWorld, AKey, PED, TOP, aproject } from "./arena3d";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import AVW from "./avwin.json";
import WORDS from "./words.json";

export const MIN1_END = 99.05;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);

// ---------- palabra exacta: at("frase", después_de) = segundo en que arranca esa frase en la voz ----------
const WD = WORDS as [string, number][];
export const at = (phrase: string, after = 0) => {
  const q = phrase.toLowerCase().replace(/[^a-z0-9$' ]/g, "").split(" ").filter(Boolean);
  for (let i = 0; i < WD.length; i++) {
    if (WD[i][1] < after) continue;
    if (q.every((w, j) => WD[i + j] && WD[i + j][0] === w)) return WD[i][1];
  }
  throw new Error("at(): no encuentro '" + phrase + "' después de " + after);
};

// ---------- qué tomas LTX ya llegaron (si falta, va la foto del primer cuadro con zoom lento) ----------
const HAS: Record<string, boolean> = { intro: false, gen1: false, alarm: false, morning: false, cord: false, panel: false, carb: false };
const REEL = true;  // true cuando llega el reel del avatar (public/gary02/reel0.mp4)
const IMG: Record<string, string> = { intro: "g_intro", gen1: "n_gen_night", alarm: "n_alarm", morning: "g_morning", cord: "n_cord", panel: "g_panel", carb: "g_carb" };
const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.04, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + IMG[k]} />}</AbsoluteFill>;
};

// ---------- AVATAR: tramos visibles pagados (avwin.pieces); el reel corre desde off + (a - ms) ----------
type AW = { ms: number; me: number; off: number; pieces: [number, number][] };
const VIS = (AVW as { win: AW[] }).win.flatMap((w) => w.pieces.map(([a, b]) => ({ a, b, r: w.off + (a - w.ms) })));
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = REEL ? (
    <>{VIS.filter((v) => v.b > 0 && v.a < MIN1_END + 1).map((v, i) => (
      <Sequence key={i} from={s(v.a) - 10} durationInFrames={s(v.b - v.a) + 14} layout="none">
        <AbsoluteFill style={{ opacity: t >= v.a - 0.3 && t < v.b + 0.4 ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(v.r) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    ))}</>
  ) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
      {false && edge > 0.01 && (
        <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada)
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><HouseWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// latigazo lateral entre dos capas (sale A hacia la izquierda, entra B desde la derecha, con blur horizontal)
const Whip: React.FC<{ k: number; A: React.ReactNode; B: React.ReactNode; dir?: 1 | -1 }> = ({ k, A, B, dir = 1 }) => {
  const mb = Math.sin(k * Math.PI) * 46;
  const f = mb > 1 ? `blur(${mb}px)` : undefined;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: f }}>{A}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: f }}>{B}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
// zoom a través de un punto (A crece y se desenfoca; B aparece detrás con un flash)
const ZoomThru: React.FC<{ k: number; x: number; y: number; A: React.ReactNode; B: React.ReactNode }> = ({ k, x, y, A, B }) => (
  <AbsoluteFill>
    {k > 0.35 && <AbsoluteFill style={{ transform: `scale(${1.25 - 0.25 * e(k, 0.35, 1)})` }}>{B}</AbsoluteFill>}
    {k < 1 && <AbsoluteFill style={{ transformOrigin: `${x}px ${y}px`, transform: `scale(${1 + k * k * 7})`, filter: k > 0.05 ? `blur(${k * 18}px)` : undefined, opacity: 1 - e(k, 0.55, 1) }}>{A}</AbsoluteFill>}
  </AbsoluteFill>
);

// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
// precio colgante que se balancea
export const Price: React.FC<{ t: number; at: number; x: number; y: number; item: string; $: string; out: number; big?: number }> = ({ t, at, x, y, item, $, out, big = 1 }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 5) * 14 * Math.exp(-(t - at) * 2.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% -60px", transform: `translate(-50%,0) rotate(${sw}deg) scale(${Math.min(1.05, k) * big})` }}>
      <svg width={4} height={60} style={{ position: "absolute", left: "50%", top: -60 }}><line x1={2} y1={0} x2={2} y2={60} stroke="#ddd" strokeWidth={2} /></svg>
      <div style={{ background: "linear-gradient(180deg,#ffe7a3,#f2c860)", borderRadius: 12, padding: "10px 26px 12px", boxShadow: "0 18px 30px rgba(0,0,0,.55)", fontFamily: FONT, textAlign: "center", color: "#2a1d08" }}>
        <div style={{ fontWeight: 900, fontSize: 72, lineHeight: 1 }}>{$}</div>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>{item}</div>
      </div>
    </div>
  );
};
// alarma de CO 2.5D (disco con LED que titila + ondas de sonido) que vive encima del avatar
const CoBadge: React.FC<{ t: number; at: number; scream: number; out: number; x: number; y: number }> = ({ t, at, scream, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at));
  const blink = t < scream ? (((t - at) % 1.3) < 0.14 ? 1 : 0.12) : (Math.sin(t * 22) > 0 ? 1 : 0.12);
  const shake = t > scream ? Math.sin(t * 61) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: x + shake, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) perspective(900px) rotateY(-14deg)` }}>
      {[0, 1, 2].map((r) => {
        const ph = ((t * (t > scream ? 2.2 : 0.9) + r / 3) % 1);
        return <div key={r} style={{ position: "absolute", left: "50%", top: "50%", width: 260 + ph * 420, height: 260 + ph * 420, borderRadius: "50%", transform: "translate(-50%,-50%)", border: `4px solid rgba(255,60,40,${(1 - ph) * blink * 0.8})` }} />;
      })}
      <div style={{ width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #e4e1da 60%, #c9c5bb)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 -8px 16px rgba(0,0,0,.18)", position: "relative" }}>
        {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 70 + i * 22, height: 6, borderRadius: 3, background: "rgba(0,0,0,.12)" }} />)}
        <div style={{ position: "absolute", right: 46, top: 48, width: 26, height: 26, borderRadius: "50%", background: blink > 0.5 ? "#ff2a1a" : "#5a1410", boxShadow: blink > 0.5 ? "0 0 26px 8px rgba(255,40,20,.9)" : "none" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#3a3a3a", letterSpacing: 4 }}>CO</div>
      </div>
    </div>
  );
};
// contador "~100 por año" que sube
const Count: React.FC<{ t: number; at: number; to: number; out: number }> = ({ t, at, to, out }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const n = Math.round(to * ei(t, at, at + 1.6));
  const k = Math.min(1.06, spr(t, at, 0.9));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: o, transform: `scale(${k})`, fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 300, lineHeight: 1, color: COL.ink, textShadow: extrude(14, "#5a1d16") }}>~{n}</div>
      <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: 10, color: COL.red, marginTop: 18, textShadow: "0 4px 12px rgba(0,0,0,.8)", opacity: e(t, at + 0.6, at + 0.9) }}>PEOPLE EVERY YEAR</div>
      <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 6, color: COL.dim, marginTop: 10, opacity: e(t, at + 1.0, at + 1.3) }}>PORTABLE GENERATORS · CARBON MONOXIDE</div>
    </div>
  );
};

// ---------- LA ARENA: cámara y focos clavados a la voz ----------
const T_ARENA = 72.85;
const a1 = at("a regular gas generator"), a2 = at("battery power stations"), a3 = at("a plain car battery"), aInv = at("cheap inverter");
const aWhich = at("which one i'd buy"), aNot = at("probably not the one"), aMeet = at("let's meet the contenders");
const AKEYS: AKey[] = [
  { t: T_ARENA, p: [0, 1.5, 9.5], l: [0, 1.0, 0], fov: 40 },
  { t: a1 - 0.3, p: [0, 1.7, 7.0], l: [0, 1.0, 0], fov: 40 },
  { t: a1 + 1.1, p: [-1.4, 1.75, 2.6], l: [-2.2, 1.25, 0], fov: 36 },
  { t: a2 - 0.1, p: [-1.2, 1.7, 2.7], l: [-2.1, 1.2, 0], fov: 36 },
  { t: a2 + 1.2, p: [0.5, 1.6, 2.4], l: [0, 1.15, 0], fov: 35 },
  { t: a3 - 0.2, p: [0.6, 1.6, 2.5], l: [0.1, 1.15, 0], fov: 35 },
  { t: a3 + 1.3, p: [3.0, 1.55, 2.2], l: [2.2, 1.1, 0], fov: 34 },
  { t: 86.7, p: [3.2, 1.5, 1.9], l: [2.2, 1.1, 0], fov: 33 },
  // Q · después del avatar: plano general con los tres encendidos, órbita lenta, y empuje al pedestal 1
  { t: 90.4, p: [-3.5, 2.3, 7.6], l: [0, 1.1, 0], fov: 40 },
  { t: aMeet - 0.2, p: [2.8, 2.1, 7.4], l: [0, 1.1, 0], fov: 40 },
  { t: MIN1_END, p: [-1.6, 1.6, 3.2], l: [-2.2, 1.2, 0], fov: 36 },
];
const Arena: React.FC<{ t: number }> = ({ t }) => {
  const on: [number, number, number] = t > 90 ? [1, 1, 1] : [ei(t, a1, a1 + 0.35), ei(t, a2, a2 + 0.35), ei(t, a3, a3 + 0.35)];
  return <ArenaWorld t={t} keys={AKEYS} on={on} run={t > a1 ? 1 : 0} pct="100%" />;
};
const lab = (t: number, i: number, q = TOP + 0.55) => aproject(AKEYS, t, [PED[i][0], q, 0]);

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,4 · avatar; tarjeta 3D del generador que se tacha en "Don't buy a generator / Not yet" =====
  const tA = 3.4;
  if (t < tA + 0.35) {
    const k = ei(t, tA - 0.05, tA + 0.3);
    const A = (
      <AbsoluteFill>
        <Avatar t={t} />
        <Card3D id="img_n_gen_night" x={1200} y={170} w={600} h={340} ry={(1 - Math.min(1, spr(t, at("generator")))) * -70 - 10} rx={4} z={(1 - Math.min(1, spr(t, at("generator")))) * -900} o={e(t, at("generator"), at("generator") + 0.1)} label="A GENERATOR?" labelCol={COL.amber} />
        <DrawX t={t} at={at("not yet") - 0.1} x={1240} y={200} w={520} h={280} />
      </AbsoluteFill>
    );
    L.push(<Whip key="wA" k={k} A={A} B={<Shot k="intro" t={t} a={tA} />} />);
  }
  // ===== B · 3,4-8,55 · Gary entre el generador y la estación; "a better thing to buy" =====
  const tB = 8.55;
  if (t >= tA + 0.3 && t < tB + 0.6) {
    const shot = (
      <AbsoluteFill>
        <Shot k="intro" t={t} a={tA} />
        <Tag t={t} at={at("40 years")} x={560} y={330} dx={-140} dy={-150} text="40 YEARS" sub="AN ELECTRICIAN" col={COL.amber} out={6.5} />
        <Tag t={t} at={at("better thing to buy")} x={560} y={800} dx={220} dy={-90} text="THE BETTER BUY?" col={COL.ice} out={tB - 0.1} />
        <Tag t={t} at={at("better thing to buy") + 0.4} x={260} y={600} dx={120} dy={-200} text="THE USUAL BUY" col={COL.red} out={tB - 0.1} size={38} />
      </AbsoluteFill>
    );
    const z = ei(t, tB - 0.1, tB + 0.5);
    L.push(<ZoomThru key="zB" k={z} x={560} y={800} A={shot} B={<World t={Math.max(tB, t)} />} />);
  }
  // ===== C · 8,55-12,5 · la casa a oscuras → el dormitorio; la niebla ya está ("kill you in your sleep") =====
  const tC = at("picture this");
  if (t >= tB + 0.5 && t < tC + 0.5) {
    L.push(<World key="wC" t={t} />);
    const sl = screenOf(t, PT.sleeper);
    L.push(<Tag key="tSl" t={t} at={at("in your sleep")} x={sl.x} y={sl.y} dx={240} dy={-160} text="IN YOUR SLEEP" col={COL.red} out={tC - 0.1} />);
    L.push(<div key="cheap" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: e(t, at("it's cheaper"), at("it's cheaper") + 0.2) * (1 - e(t, at("and it won't"), at("and it won't") + 0.3)), fontFamily: FONT, fontWeight: 900, fontSize: 90, letterSpacing: 10, color: "#9df0b4", textShadow: extrude(10, "#1f5a36") }}>CHEAPER</div>);
    const r = ei(t, tC - 0.25, tC + 0.25);
    if (r > 0) L.push(<Portal key="pC" x={sl.x} y={sl.y} r={r}><Shot k="gen1" t={t} a={tC - 0.25} /></Portal>);
  }
  // ===== D · gancho LTX: el generador rugiendo en el garaje, la segunda noche =====
  const tD = 15.6;
  if (t >= tC + 0.25 && t < tD + 0.4) {
    const shot = (
      <AbsoluteFill>
        <Shot k="gen1" t={t} a={tC - 0.25} />
        <BigNum t={t} at={at("the second night")} text="NIGHT 2" x={1450} y={180} size={130} col={COL.ink} edge="#3a3f4a" out={at("you did what")} sub="OF THE BLACKOUT" />
      </AbsoluteFill>
    );
    L.push(<Whip key="wD" k={ei(t, tD - 0.1, tD + 0.3)} A={shot} B={<Avatar t={Math.max(tD + 0.05, t)} />} />);
  }
  // ===== E · 15,6-20,8 · avatar; "You bought a generator" → precio; zoom al garaje 3D =====
  const tE = 20.82;
  if (t >= tD + 0.25 && t < tE + 0.6) {
    const bl = e(t, at("you bought a generator"), at("you bought a generator") + 0.4);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} blur={8 * bl} dark={0.3 * bl} />
        <Price t={t} at={at("you bought a generator") + 0.3} x={1430} y={240} item="ON SALE" $="$550" out={tE - 0.2} big={1.3} />
        <Tag t={t} at={at("you rolled it")} x={1100} y={760} dx={-280} dy={-80} text="INTO THE GARAGE" col={COL.amber} out={tE - 0.2} />
      </AbsoluteFill>
    );
    L.push(<ZoomThru key="zE" k={ei(t, tE - 0.15, tE + 0.45)} x={1100} y={760} A={av} B={<World t={Math.max(tE, t)} />} />);
  }
  // ===== F · 20,8-27,6 · garaje 3D: portón "un pie", el cable cruza la casa hasta la heladera =====
  const tF = at("it's loud");
  if (t >= tE + 0.4 && t < tF + 0.45) {
    L.push(<World key="wF" t={t} />);
    const g = screenOf(t, PT.generator), d = screenOf(t, PT.doorGap), fr = screenOf(t, PT.fridge);
    L.push(<Tag key="tG" t={t} at={tE + 0.3} x={g.x} y={g.y} dx={-200} dy={-150} text="3,500 WATTS" sub="GAS" col={COL.red} out={at("cracked") - 0.1} />);
    L.push(<Tag key="tD" t={t} at={at("open a foot")} x={d.x} y={d.y} dx={-160} dy={-200} text="1 FOOT" sub="SO IT CAN BREATHE" col={COL.ice} out={at("ran a cord") + 0.6} />);
    L.push(<Tag key="tFr" t={t} at={at("for the fridge")} x={fr.x} y={fr.y} dx={260} dy={-130} text="THE FRIDGE" col={COL.amber} out={tF} />);
    const r = ei(t, tF - 0.3, tF + 0.3);
    if (r > 0) L.push(<Portal key="pF" x={fr.x} y={fr.y} r={r}><Shot k="gen1" t={t} a={tF - 0.3} from={4} /></Portal>);
  }
  // ===== F' · "It's loud, but it's working" → toma; flash → el dormitorio 3:00 =====
  const tG = at("you go to bed");
  if (t >= tF + 0.25 && t < tG + 0.3) {
    L.push(<AbsoluteFill key="sF"><Shot k="gen1" t={t} a={tF - 0.3} from={4} />
      <Stamp t={t} at={at("loud")} text="LOUD" x={560} y={300} rot={-8} size={100} out={tG} col={COL.amber} />
      <Stamp t={t} at={at("it's working")} text="WORKING ✓" x={1350} y={820} rot={5} size={80} out={tG} col="#5ee38f" />
    </AbsoluteFill>);
    L.push(<Flash key="flG" t={t} at={tG} peak={0.85} w={0.35} />);
  }
  const tH = 31.62;
  if (t >= tG && t < tH + 0.45) {
    const cl = screenOf(t, PT.nightClock);
    const W0 = <AbsoluteFill><World t={t} /><Tag t={t} at={at("pretty smart")} x={cl.x} y={cl.y} dx={220} dy={-140} text="3:00 AM" col={COL.red} out={tH} /></AbsoluteFill>;
    const rG = ei(t, tH - 0.15, tH + 0.4); // salir del 3D con portal (el zoom con blur sobre WebGL cuelga Chrome en el farm)
    L.push(<AbsoluteFill key="zG">{W0}{rG > 0 && <Portal x={cl.x} y={cl.y} r={rG}><Avatar t={Math.max(tH, t)} /></Portal>}</AbsoluteFill>);
  }
  // ===== H · 31,6-37,6 · avatar; la alarma de CO titila y grita; la toma del pasillo en tarjeta 3D; zoom a través =====
  const tI = 37.63;
  if (t >= tH + 0.3 && t < tI + 0.55) {
    const aAl = at("the little alarm"), aSc = at("starts screaming");
    const bl = e(t, aAl, aAl + 0.4);
    const red = t > aAl + 0.3 ? (t < aSc ? (((t - aAl) % 1.3) < 0.14 ? 0.35 : 0) : (Math.sin(t * 22) > 0 ? 0.32 : 0.05)) : 0;
    const kc = spr(t, aAl + 0.5, 0.8);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} blur={10 * bl} dark={0.35 * bl} />
        <AbsoluteFill style={{ background: "#ff1a0a", opacity: red, mixBlendMode: "screen" }} />
        <Card3D id={HAS.alarm ? "ltx_alarm" : "img_n_alarm"} from={0} at={aAl + 0.5} x={250} y={230} w={820} h={460} ry={(1 - Math.min(1, kc)) * 60 + 8} rx={3} z={(1 - Math.min(1, kc)) * -1300} o={e(t, aAl + 0.5, aAl + 0.65)} label="THE HALLWAY · 3 AM" labelCol={COL.red} />
        <CoBadge t={t} at={aAl + 0.2} scream={aSc} out={tI - 0.1} x={1480} y={520} />
      </AbsoluteFill>
    );
    L.push(<ZoomThru key="zH" k={ei(t, tI - 0.15, tI + 0.45)} x={660} y={460} A={av} B={<World t={Math.max(tI, t)} />} />);
  }
  // ===== I · 37,6-45,8 · el monóxido avanza por la casa: bajo la puerta, la cocina, sube al dormitorio =====
  const tJ = at("that's not a story");
  if (t >= tI + 0.35 && t < tJ + 0.45) {
    L.push(<World key="wI" t={t} />);
    const g = screenOf(t, PT.generator), dr = screenOf(t, PT.innerDoor), sl = screenOf(t, PT.sleeper);
    L.push(<Tag key="iCO" t={t} at={at("gray exhaust")} x={g.x} y={g.y - 60} dx={-220} dy={-140} text="CARBON MONOXIDE" col="#c9ced6" out={at("rolls under")} />);
    L.push(<Tag key="iDoor" t={t} at={at("rolls under the door")} x={dr.x} y={dr.y} dx={-240} dy={-170} text="UNDER THE DOOR" col={COL.amber} out={at("can't see it") - 0.1} />);
    L.push(<Stamp key="iSee" t={t} at={at("can't see it")} text="CAN'T SEE IT" x={560} y={190} rot={-6} size={78} out={tJ - 0.1} col="#c9ced6" />);
    L.push(<Stamp key="iSm" t={t} at={at("can't smell it")} text="CAN'T SMELL IT" x={1340} y={880} rot={4} size={78} out={tJ - 0.1} col="#c9ced6" />);
    const r = ei(t, tJ - 0.25, tJ + 0.3);
    if (r > 0) L.push(<Portal key="pI" x={sl.x} y={sl.y} r={r}><Shot k="morning" t={t} a={tJ - 0.25} /></Portal>);
  }
  // ===== J · 45,8-51,4 · la mañana después (Gary en el garaje de un vecino) =====
  const tK = 51.38;
  if (t >= tJ + 0.2 && t < tK + 0.4) {
    const shot = <AbsoluteFill><Shot k="morning" t={t} a={tJ - 0.25} />
      <Tag t={t} at={at("the morning after")} x={1140} y={620} dx={240} dy={-170} text="THE MORNING AFTER" col={COL.ink} out={tK - 0.1} />
    </AbsoluteFill>;
    L.push(<Whip key="wJ" k={ei(t, tK - 0.1, tK + 0.3)} A={shot} B={<Avatar t={Math.max(tK, t)} blur={10} dark={0.4} />} />);
  }
  // ===== K · 51,4-57,3 · avatar desenfocado; ~100 por año =====
  const tL = 57.34;
  if (t >= tK + 0.25 && t < tL + 0.3) {
    L.push(<AbsoluteFill key="avK"><Avatar t={t} blur={10 * (1 - e(t, tK - 0.2, tK)) + 10 * e(t, tK, tK + 0.01)} dark={0.4} /></AbsoluteFill>);
    L.push(<Count key="cnt" t={t} at={at("close to a hundred")} to={100} out={tL - 0.15} />);
    L.push(<Flash key="flL" t={t} at={tL} peak={0.7} />);
  }
  // ===== L · 57,3-61,3 · "just trying to keep the food cold": el cable en la heladera =====
  const tM = at("my name is gary");
  if (t >= tL && t < tM + 0.4) {
    const shot = <AbsoluteFill><Shot k="cord" t={t} a={tL} />
      <Tag t={t} at={at("keep the food cold")} x={1300} y={460} dx={-300} dy={-160} text="JUST THE FOOD" sub="IN THE FRIDGE" col={COL.ice} out={tM - 0.1} />
    </AbsoluteFill>;
    L.push(<Whip key="wL" k={ei(t, tM - 0.1, tM + 0.3)} A={shot} B={<Shot k="panel" t={t} a={tM - 0.1} />} />);
  }
  // ===== M · 61,3-68,2 · Gary: tablero, y el carburador del generador =====
  const tCarb = at("i've repaired generators"), tN = 68.21;
  if (t >= tM + 0.25 && t < tN + 0.45) {
    const pk = ei(t, tCarb - 0.15, tCarb + 0.25);
    const shot = (
      <AbsoluteFill>
        {pk < 1 && <AbsoluteFill style={{ transform: `translateY(${-pk * 1080}px)` }}><Shot k="panel" t={t} a={tM - 0.1} /></AbsoluteFill>}
        {pk > 0 && <AbsoluteFill style={{ transform: `translateY(${(1 - pk) * 1080}px)` }}><Shot k="carb" t={t} a={tCarb - 0.15} /></AbsoluteFill>}
        <Tag t={t} at={at("i've hooked up generators")} x={1000} y={300} dx={-260} dy={-90} text="HOOKED UP" col={COL.amber} out={tCarb} size={40} />
        <Tag t={t} at={tCarb + 0.3} x={900} y={560} dx={260} dy={-200} text="REPAIRED" col={COL.amber} out={tN - 0.1} size={40} />
      </AbsoluteFill>
    );
    L.push(<Whip key="wM" k={ei(t, tN - 0.1, tN + 0.3)} A={shot} B={<Avatar t={Math.max(tN, t)} />} dir={-1} />);
  }
  if (t >= tM && t < tN) L.push(<LowerThird key="lt" t={t} at={tM + 0.1} out={tN - 0.4} name="GARY" l2="ELECTRICIAN · OHIO · 40 YEARS" l2at={at("residential electrician")} />);
  // ===== N · 68,2-72,9 · avatar; "what they do when people use them wrong"; el avatar se abre como puerta a la arena =====
  if (t >= tN + 0.25 && t < T_ARENA + 0.65) {
    const door = ei(t, T_ARENA - 0.15, T_ARENA + 0.55);
    if (door > 0) L.push(<AbsoluteFill key="arN"><Arena t={Math.max(T_ARENA, t)} /></AbsoluteFill>);
    L.push(<AbsoluteFill key="avN" style={{ perspective: 1600 }}>
      <AbsoluteFill style={{ transformOrigin: "0% 50%", transform: `rotateY(${-door * 105}deg)`, boxShadow: door > 0 ? "30px 0 80px rgba(0,0,0,.8)" : undefined }}>
        <Avatar t={t} edge={e(t, at("use them wrong"), at("use them wrong") + 0.4)} />
        <Stamp t={t} at={at("use them wrong")} text="USED WRONG" x={1400} y={260} rot={6} size={72} out={T_ARENA - 0.1} />
        {door > 0 && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg,#8a8d92,#c9ccd0)", boxShadow: "inset 6px 0 0 #2a2c30" }} />}
      </AbsoluteFill>
    </AbsoluteFill>);
  }
  // ===== O · 72,9-86,8 · la arena: los tres contendientes se encienden uno por uno =====
  const tP = 86.79;
  if (t >= T_ARENA + 0.5 && t < tP + 0.4) {
    const ar = (
      <AbsoluteFill>
        <Arena t={t} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", opacity: e(t, at("three machines"), at("three machines") + 0.2) * (1 - e(t, a1 - 0.4, a1 - 0.1)), fontFamily: FONT, fontWeight: 900, fontSize: 100, letterSpacing: 12, color: COL.ink, textShadow: extrude(10, "rgba(0,0,0,.7)") }}>3 MACHINES</div>
        {[[a1, "GAS GENERATOR", COL.red], [a2, "POWER STATION", COL.ice], [a3, "CAR BATTERY", COL.amber]].map(([a, txt, c], i) => {
          const p = lab(t, i);
          return <Tag key={i} t={t} at={(a as number) + 0.2} x={p.x} y={p.y} dx={i === 0 ? 330 : -330} dy={-60} text={txt as string} sub={i === 2 ? "+ A CHEAP INVERTER" : undefined} col={c as string} out={i === 0 ? a2 : i === 1 ? a3 : tP - 0.15} />;
        })}
        <Stamp t={t} at={at("nobody talks about")} text="NOBODY TALKS ABOUT IT" x={960} y={930} rot={-3} size={56} out={aInv + 0.8} col={COL.amber} />
      </AbsoluteFill>
    );
    L.push(<Whip key="wO" k={ei(t, tP - 0.1, tP + 0.3)} A={ar} B={<Avatar t={Math.max(tP, t)} edge={1} />} />);
  }
  // ===== P · 86,8-90,4 · avatar con las fichas: precios, ruido, números =====
  const tQ = 90.43;
  if (t >= tP + 0.25 && t < tQ + 0.45) {
    const av = <AbsoluteFill><Avatar t={t} edge={1} /><Chips t={t} at={at("real prices")} items={["PRICES", "NOISE", "NUMBERS"]} out={tQ - 0.2} /></AbsoluteFill>;
    L.push(<ZoomThru key="zP" k={ei(t, tQ - 0.15, tQ + 0.45)} x={960} y={500} A={av} B={<Arena t={Math.max(tQ, t)} />} />);
  }
  // ===== Q · 90,4-99 · arena con los tres; "which one I'd buy with my own money" → "?"; empuje al contendiente 1 =====
  if (t >= tQ + 0.3) {
    L.push(<AbsoluteFill key="arQ"><Arena t={t} /></AbsoluteFill>);
    const q = Math.min(1.08, spr(t, aWhich + 0.3, 0.8)), qo = e(t, aWhich + 0.3, aWhich + 0.45) * (1 - e(t, aMeet - 0.3, aMeet));
    if (qo > 0.01) L.push(<div key="qm" style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${q}) rotate(${Math.sin(t * 2) * 6}deg)`, opacity: qo, fontFamily: FONT, fontWeight: 900, fontSize: 300, color: COL.amber, textShadow: extrude(16, "#5a3a10") }}>?</div>);
    L.push(<div key="own" style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: e(t, at("my own money"), at("my own money") + 0.2) * (1 - e(t, aMeet - 0.3, aMeet)), fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 8, color: COL.ink, textShadow: extrude(8, "rgba(0,0,0,.7)") }}>WITH MY OWN MONEY</div>);
    L.push(<Stamp key="nt" t={t} at={aNot + 0.2} text="NOT THE ONE YOU THINK" x={960} y={840} rot={-4} size={60} out={aMeet - 0.1} />);
    L.push(<Tag key="c1" t={t} at={aMeet + 0.6} x={lab(t, 0).x} y={lab(t, 0).y} dx={200} dy={-120} text="CONTENDER #1" col={COL.red} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
