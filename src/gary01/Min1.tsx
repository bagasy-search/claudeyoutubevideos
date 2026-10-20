// gary01 · MINUTO 1 (0-70,2 s). Un solo hilo visual, sin cortes secos:
// avatar → (el reloj LED se apaga y es el reloj del dormitorio) → casa 3D en corte → (iris desde el farol del garaje) → avatar
// → (el avatar se ABRE como la puerta de la heladera) → toma de la heladera con calor que entra → (portal se cierra en la heladera 3D)
// → time-lapse de 3 días → (portal desde el tacho) → vecino tirando todo → (latigazo) → avatar con tarjeta 3D del café
// → (zoom a través de la tarjeta) → generador/solar/batería tachados → $60 → casa de día → (portal desde el estante) → garaje
// → rótulo que cruza al avatar → (zoom a través del tablero eléctrico) → heladera 3D en corte → (la puerta se abre) → avatar con fichas.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HouseWorld, PT, screenOf, camSpeed } from "./house3d";
import { FridgeCut, FPT, fproject } from "./fridge3d";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, HeatHaze, LowerThird, P, Portal, Tag, Thermo, Vid, Bulb, e, ei, extrude, s, spr } from "./lib";

export const MIN1_FRAMES = 2106;

// ---------- qué tomas LTX ya llegaron (si falta, va la foto del primer cuadro con zoom lento) ----------
const HAS: Record<string, boolean> = { fridge: true, furnace: true, neighbor: true, garage: true, coffee: true };
const REEL = true;  // true cuando llega el reel del avatar (public/gary01/reel0.mp4)

const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.04, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};

// heladera SIN corriente: el clip trae la luz interior prendida → se apaga (oscuro y frío) y sólo queda la pileta de la linterna
const Dark: React.FC<{ t: number }> = ({ t }) => {
  const px = 44 + 5 * Math.sin((t - 19) * 0.9), py = 52 + 4 * Math.sin((t - 19) * 0.6 + 1);
  const m = `radial-gradient(ellipse 26% 34% at ${px}% ${py}%, #000 0%, rgba(0,0,0,.75) 45%, transparent 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "brightness(.26) saturate(.55) contrast(1.15) hue-rotate(-8deg)" }}><Shot k="fridge" t={t} a={19.0} /></AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m, filter: "brightness(1.08) sepia(.12)" }}><Shot k="fridge" t={t} a={19.0} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,8,16,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- AVATAR: ventanas pagadas de RunPod (avwin), preroll de 10 cuadros, desenfoque/oscurecido y capas encima ----------
const WIN = [
  { ms: 0, me: 3.885, off: 0 },
  { ms: 15.422, me: 19.403, off: 3.885 },
  { ms: 33.887, me: 39.633, off: 7.866 },
  { ms: 50.725, me: 56.005, off: 13.612 },
  { ms: 66.381, me: 70.03, off: 18.892 },
];
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number; style?: React.CSSProperties }> = ({ t, blur = 0, dark = 0, edge = 0, style }) => {
  const face = (
    <>
      {REEL ? WIN.map((w, i) => (
        <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
          <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />}
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && (
        <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: `radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)` } as React.CSSProperties}>{face}</AbsoluteFill>
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

// onda del "zumbido" de la heladera que se aplana y muere
const Hum: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const o = e(t, 9.5, 9.9) * (1 - e(t, 13.6, 14.0));
  if (o <= 0.01) return null;
  const amp = 34 * (1 - e(t, 11.6, 13.2));
  const pts = Array.from({ length: 120 }, (_, i) => { const u = i / 119; return `${x - 260 + u * 520},${y + Math.sin(u * 30 - t * 18) * amp * Math.sin(u * Math.PI)}`; }).join(" ");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 10px ${COL.ice})` }}>
        <polyline points={pts} fill="none" stroke={amp > 3 ? COL.ice : COL.red} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: x, top: y - 120, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: amp > 3 ? COL.ice : COL.red, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>{amp > 3 ? "THAT LITTLE HUM" : "SILENCE"}</div>
    </div>
  );
};

// reloj LED rojo 3D (sobre el avatar): titila con el corte y se muere → es el reloj del dormitorio
const LedClock: React.FC<{ t: number }> = ({ t }) => {
  const o = e(t, 0.45, 0.7);
  if (o <= 0.01 || t > 3.9) return null;
  const go = ei(t, 2.5, 3.55); // vuela al centro y crece (match con el reloj 3D)
  const x = 1450 + (960 - 1450) * go, y = 330 + (540 - 330) * go, sc = (0.7 + 0.3 * Math.min(1, spr(t, 0.45))) * (1 + go * 0.9);
  const flick = t < 2.4 ? 1 : t < 3.3 ? (Math.sin(t * 61) > -0.2 ? 1 : 0.15) : Math.max(0, 1 - (t - 3.3) / 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - go) * -18}deg) rotateX(6deg) scale(${sc})`, opacity: o }}>
      <div style={{ padding: "26px 44px", borderRadius: 26, background: "linear-gradient(180deg,#25272c,#0d0e10)", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.12), 0 0 0 3px #3a3c42" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 170, lineHeight: 1, letterSpacing: 6, color: `rgba(255,59,47,${0.12 + 0.88 * flick})`, textShadow: flick > 0.5 ? "0 0 26px rgba(255,59,47,.9), 0 0 60px rgba(255,59,47,.5)" : "none" }}>
          2:00<span style={{ fontSize: 60, marginLeft: 14 }}>AM</span>
        </div>
      </div>
    </div>
  );
};

// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110 }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${COL.red}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.red, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: "0 0 30px rgba(255,60,40,.45)", textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// letrero de precio colgante (estante del garaje)
export const Price: React.FC<{ t: number; at: number; x: number; y: number; item: string; $: number; out: number }> = ({ t, at, x, y, item, $, out }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 5) * 14 * Math.exp(-(t - at) * 2.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% -40px", transform: `translate(-50%,0) rotate(${sw}deg) scale(${Math.min(1.05, k)})` }}>
      <svg width={4} height={40} style={{ position: "absolute", left: "50%", top: -40 }}><line x1={2} y1={0} x2={2} y2={40} stroke="#ddd" strokeWidth={2} /></svg>
      <div style={{ background: "linear-gradient(180deg,#ffe7a3,#f2c860)", borderRadius: 10, padding: "8px 20px 10px", boxShadow: "0 18px 30px rgba(0,0,0,.55)", fontFamily: FONT, textAlign: "center", color: "#2a1d08" }}>
        <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1 }}>${$}</div>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>{item}</div>
      </div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,9 · avatar + reloj LED; el avatar se apaga (titila) y el reloj abre un portal al reloj 3D =====
  if (t < 3.95) {
    const out = t < 2.4 ? 0 : t < 3.3 ? (Math.sin(t * 47) > 0.3 ? 0.15 : 0.7) : 0.82;
    L.push(<Avatar key="avA" t={t} blur={6 * e(t, 2.5, 3.4)} dark={out} />);
    L.push(<LedClock key="led" t={t} />);
    const r = ei(t, 3.45, 3.92);
    if (r > 0) L.push(<Portal key="pA" x={960} y={540} r={r}><World t={Math.max(3.77, t)} /></Portal>);
  }
  // ===== B · 3,9-15,6 · casa en corte; portal a la caldera real; zumbido; la calle entera se apaga =====
  if (t >= 3.9 && t < 15.85) {
    L.push(<World key="wB" t={t} />);
    const fan = screenOf(t, PT.furnaceFan);
    const pr = ei(t, 6.35, 6.75) * (1 - ei(t, 7.35, 7.75));
    if (pr > 0) L.push(<Portal key="pF" x={fan.x} y={fan.y} r={pr * 0.42}><Shot k="furnace" t={t} a={6.35} /></Portal>);
    L.push(<Tag key="tFan" t={t} at={5.66} x={fan.x} y={fan.y} dx={260} dy={-150} text="FURNACE FAN" sub="STOPPED" col={COL.amber} out={7.6} />);
    const st = screenOf(t, PT.stoveClock);
    L.push(<Tag key="tSt" t={t} at={8.0} x={st.x} y={st.y} dx={-160} dy={-120} text="STOVE CLOCK" sub="DARK" col={COL.ink} out={9.6} />);
    const fr = screenOf(t, PT.fridge);
    L.push(<Hum key="hum" t={t} x={fr.x} y={fr.y - 40} />);
    if (t > 13.9) L.push(<div key="street" style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: e(t, 14.0, 14.3) * (1 - e(t, 15.3, 15.6)), fontFamily: FONT, fontWeight: 900, fontSize: 92, letterSpacing: 10, color: COL.ink, textShadow: extrude(10, "rgba(0,0,0,.6)"), transform: `scale(${0.9 + 0.1 * e(t, 14, 15.5)})` }}>THE WHOLE STREET</div>);
  }
  // ===== C · 15,3-19,6 · iris al avatar desde el único farol encendido; bombita tachada; el avatar se abre como puerta =====
  if (t >= 15.3 && t < 19.65) {
    const g = screenOf(Math.min(t, 15.55), PT.garage);
    const r = ei(t, 15.3, 15.75);
    const door = ei(t, 19.0, 19.6);
    const body = (
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformOrigin: "0% 50%", transform: `rotateY(${-door * 105}deg)`, boxShadow: door > 0 ? "30px 0 80px rgba(0,0,0,.8)" : undefined }}>
          <Avatar t={t} blur={9 * e(t, 16.7, 17.1)} dark={0.35 * e(t, 16.7, 17.1)} />
          <Bulb t={t} at={16.9} off={17.95} out={18.9} x={1420} y={60} />
          <Tag t={t} at={19.3} x={1600} y={540} dx={-140} dy={-80} text="THE FRIDGE" col={COL.ice} out={19.6} />
          {/* borde de puerta: canto + burlete */}
          {door > 0 && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg,#d9dde2,#f4f6f8)", boxShadow: "inset 6px 0 0 #3a3d42" }} />}
        </AbsoluteFill>
      </AbsoluteFill>
    );
    if (door > 0) L.push(<AbsoluteFill key="frBehind"><Dark t={t} /><AbsoluteFill style={{ background: "#dff3ff", opacity: 0.35 * (1 - e(t, 19.3, 19.9)), mixBlendMode: "screen" }} /></AbsoluteFill>);
    L.push(r < 1 ? <Portal key="pC" x={g.x} y={g.y} r={r}>{body}</Portal> : <AbsoluteFill key="avC">{body}</AbsoluteFill>);
  }
  // ===== D1 · 19,6-27,5 · heladera real con linterna; $400; rótulos por palabra; termómetro; el calor entra =====
  if (t >= 19.6 && t < 27.55) {
    const heat = e(t, 25.0, 27.0);
    const shrink = ei(t, 27.0, 27.5);
    const fr = screenOf(27.5, PT.fridge);
    const shot = (
      <HeatHaze t={t} amt={heat}>
        <Dark t={t} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.55), transparent 45%)" }} />
        <BigNum t={t} at={20.86} text="$400" x={1650} y={800} size={190} col={COL.ink} edge="#4a3a26" out={26.6} sub="OF FOOD" />
        <Tag t={t} at={22.66} x={900} y={400} dx={-160} dy={-120} text="MILK" out={26.4} size={40} />
        <Tag t={t} at={21.0} x={1290} y={610} dx={-80} dy={150} text="MEAT" col={COL.red} out={26.4} size={40} />
        <Tag t={t} at={23.22} x={1330} y={110} dx={170} dy={60} text="LEFTOVERS" out={26.4} size={40} />
        <Tag t={t} at={23.92} x={470} y={640} dx={90} dy={170} text="MEDICINE" col={COL.amber} out={26.4} size={40} />
        <Thermo t={t} at={24.4} x={150} y={520} from={37} to={46} dur={2.4} out={27.0} />
      </HeatHaze>
    );
    if (shrink > 0) L.push(<World key="wD" t={27.25} />);
    L.push(shrink > 0 ? <Portal key="pD" x={fr.x} y={fr.y} r={1 - shrink}>{shot}</Portal> : <AbsoluteFill key="d1">{shot}</AbsoluteFill>);
  }
  // ===== D2 · 27,5-31,9 · time-lapse de tres días; deslizamiento al tacho del vecino =====
  if (t >= 27.5 && t < 31.95) {
    L.push(<World key="wD2" t={t} />);
    const day = t < 28.3 ? 0 : Math.min(3, 1 + Math.floor((t - 28.3) / (2.6 / 3)));
    if (day > 0) L.push(<BigNum key={"day" + day} t={t} at={28.3 + (day - 1) * (2.6 / 3)} text={`DAY ${day}`} x={960} y={200} size={150} out={day === 3 ? 30.9 : 28.3 + day * (2.6 / 3) - 0.12} />);
    L.push(<div key="noP" style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: 8, color: COL.dim, opacity: e(t, 28.4, 28.7) * (1 - e(t, 30.6, 30.9)) }}>NO POWER</div>);
    const tr = screenOf(t, PT.trash);
    const pr = ei(t, 31.4, 31.92);
    if (pr > 0) L.push(<Portal key="pT" x={tr.x} y={tr.y} r={pr}><Shot k="neighbor" t={t} a={31.4} from={0.9} /></Portal>);
  }
  // ===== D3 · 31,9-34,1 · el vecino tira todo; sello; latigazo lateral al avatar =====
  if (t >= 31.9 && t < 34.15) {
    const wp = ei(t, 33.8, 34.12);
    const mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="d3" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Shot k="neighbor" t={t} a={31.4} from={0.9} />
      <Tag t={t} at={30.94} x={760} y={300} dx={-160} dy={-60} text="MY NEIGHBOR" out={33.5} size={40} />
      <Stamp t={t} at={32.3} text="EVERYTHING → TRASH" x={1180} y={760} out={33.75} size={84} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 33.9)} /></AbsoluteFill>);
  }
  // ===== E · 34,1-39,7 · avatar; "I didn't throw out a thing"; tarjeta 3D del café del día 3; zoom a través =====
  if (t >= 34.1 && t < 39.75) {
    const bl = e(t, 36.2, 36.7);
    L.push(<Avatar key="avE" t={t} blur={12 * bl} dark={0.4 * bl} />);
    L.push(<Stamp key="nt" t={t} at={34.6} text="NOT A THING" x={1460} y={260} out={36.1} rot={6} size={70} />);
    const k = spr(t, 36.3, 0.8), zt = ei(t, 39.2, 39.7);
    L.push(<Card3D key="cof" id={HAS.coffee ? "ltx_coffee" : "img_coffee"} at={36.3} x={560} y={210} w={800} h={450}
      ry={(1 - Math.min(1, k)) * 60 - 8 + 8 * e(t, 37, 39)} rx={4} z={(1 - Math.min(1, k)) * -1400 + zt * 1600} o={e(t, 36.3, 36.45) * (1 - e(t, 39.55, 39.72))} label="DAY 3 · COLD MILK" labelCol={COL.ice2} />);
    L.push(<div key="chip" style={{ position: "absolute", left: 1290, top: 640, opacity: e(t, 37.7, 37.9) * (1 - zt), transform: `scale(${Math.min(1.08, spr(t, 37.7))})`, padding: "12px 26px", borderRadius: 40, background: "rgba(10,30,20,.9)", border: "3px solid #5ee38f", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#5ee38f", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>40°F ✓</div>);
  }
  // ===== F1 · 39,5-45,8 · sin generador / sin solar / sin batería → $60 =====
  if (t >= 39.5 && t < 45.9) {
    L.push(<AbsoluteFill key="f1bg" style={{ filter: "blur(10px) brightness(.45)", transform: "scale(1.05)" }}><HouseWorld t={Math.min(t, 44.9)} /></AbsoluteFill>);
    L.push(<Flash key="fl39" t={t} at={39.6} peak={0.6} />);
    const cards = [{ id: "img_generator", at: 39.76, x: 120, lab: "GENERATOR" }, { id: "img_solar", at: 40.92, x: 700, lab: "SOLAR" }, { id: "img_battery", at: 42.16, x: 1280, lab: "BATTERY BANK" }];
    cards.forEach((c, i) => {
      const k = spr(t, c.at, 1), fall = ei(t, 43.2 + i * 0.08, 43.75 + i * 0.08);
      L.push(<AbsoluteFill key={"cd" + i} style={{ transform: `translateY(${fall * 1300}px) rotate(${fall * (i - 1) * 25}deg)` }}>
        <Card3D id={c.id} x={c.x} y={300} w={520} h={340} ry={(1 - Math.min(1, k)) * -80 + (i - 1) * 8} rx={6} z={(1 - Math.min(1, k)) * -900} o={e(t, c.at, c.at + 0.08)} label={c.lab} />
        <DrawX t={t} at={c.at + 0.55} x={c.x + 40} y={330} w={440} h={280} />
      </AbsoluteFill>);
    });
    L.push(<div key="no" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 12, color: COL.ink, opacity: e(t, 39.76, 40) * (1 - e(t, 43.2, 43.4)), textShadow: extrude(6, "#000") }}>NO</div>);
    L.push(<BigNum key="60" t={t} at={43.64} text="$60" size={330} col="#9df0b4" edge="#1f5a36" out={45.45} sub="OF STUFF" />);
    L.push(<Flash key="fl45" t={t} at={45.55} peak={0.7} />);
  }
  // ===== F2 · 45,7-46,95 · la casa de día; vuelo al estante del garaje; portal desde el estante =====
  if (t >= 45.7 && t < 46.95) {
    L.push(<World key="wF" t={t} />);
    L.push(<div key="garTx" style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: 8, color: COL.ink, opacity: e(t, 45.75, 46.0), textShadow: extrude(8, "rgba(0,0,0,.6)") }}>ALREADY IN YOUR GARAGE</div>);
    const sh = screenOf(t, PT.shelf), pr = ei(t, 46.45, 46.93);
    if (pr > 0) L.push(<Portal key="pG" x={sh.x} y={sh.y} r={pr}><Shot k="garage" t={t} a={46.45} /></Portal>);
  }
  // ===== F3 · 46,9-51,2 · garaje real con precios colgantes; rótulo de Gary que cruza al avatar =====
  if (t >= 46.9 && t < 51.25) {
    const x = ei(t, 50.7, 51.2), out = x < 0.5, k2 = out ? x * 2 : (1 - x) * 2;
    const hb = Math.round(90 * k2);
    const HB = hb > 0 ? <svg width={0} height={0} style={{ position: "absolute" }}><filter id={"hb" + hb} x="-20%" width="140%"><feGaussianBlur stdDeviation={`${hb} 0`} /></filter></svg> : null;
    if (out) L.push(<AbsoluteFill key="f3" style={{ transform: `translateX(${-k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: hb ? `url(#hb${hb})` : undefined }}>
      {HB}
      <Shot k="garage" t={t} a={46.45} />
      <Price t={t} at={47.0} x={1000} y={600} item="ROCK SALT" $={5} out={50.5} />
      <Price t={t} at={47.35} x={1250} y={190} item="SILVER WRAP" $={25} out={50.5} />
      <Price t={t} at={47.7} x={1620} y={330} item="BLANKET" $={12} out={50.5} />
      <Price t={t} at={48.05} x={1730} y={60} item="FOAM COOLER" $={10} out={50.5} />
      <Price t={t} at={48.4} x={1400} y={580} item="THERMOMETER" $={8} out={50.5} />
    </AbsoluteFill>);
    else L.push(<AbsoluteFill key="avG0" style={{ transform: `translateX(${k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: hb ? `url(#hb${hb})` : undefined }}>{HB}<Avatar t={Math.max(50.8, t)} /></AbsoluteFill>);
    if (k2 > 0.4) L.push(<div key="beam" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.55) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  }
  // ===== G · 51,2-55,95 · avatar con rótulo; zoom a través del tablero eléctrico de atrás =====
  if (t >= 51.2 && t < 55.95) {
    const z = ei(t, 55.3, 55.92);
    L.push(<AbsoluteFill key="avG" style={{ transformOrigin: "1077px 230px", transform: `scale(${1 + z * z * 7})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Tag key="pan" t={t} at={54.5} x={1077} y={230} dx={-180} dy={-70} text="40 YEARS OF THIS" sub="…AND IT'S NOT ELECTRICAL" col={COL.amber} out={55.2} size={40} />);
  }
  if (t >= 49.6 && t < 55.6) L.push(<LowerThird key="lt" t={t} at={49.6} out={55.1} name="GARY" l2="ELECTRICIAN · OHIO · 40 YEARS" l2at={51.04} />);
  // ===== H · 55,9-66,6 · heladera 3D en corte: desenchufe, frío, fuga por la junta, calor, jarras; la puerta se abre =====
  if (t >= 55.88 && t < 66.6) {
    L.push(<AbsoluteFill key="fc"><FridgeCut t={t} /></AbsoluteFill>);
    L.push(<Flash key="fl56" t={t} at={55.92} peak={0.9} w={0.35} />);
    const o = fproject(t, FPT.outlet), sl = fproject(t, FPT.seal), tp = fproject(t, FPT.top), jg = fproject(t, FPT.jugs), md = fproject(t, [0, 0.45, 0]);
    L.push(<Tag key="h1" t={t} at={57.6} x={o.x} y={o.y} dx={150} dy={-90} text="NOT ELECTRICITY" col={COL.amber} out={59.1} />);
    L.push(<Tag key="h2" t={t} at={59.42} x={md.x} y={md.y} dx={-220} dy={-60} text="COLD" col={COL.ice} out={64.9} size={64} />);
    L.push(<Tag key="h3" t={t} at={60.95} x={sl.x} y={sl.y} dx={-200} dy={90} text="WHERE IT GOES" sub="OUT THE BOTTOM" col={COL.ice2} out={64.9} />);
    L.push(<Tag key="h4" t={t} at={61.7} x={tp.x} y={tp.y} dx={180} dy={-70} text="HEAT PUSHES IN" col={COL.amber} out={64.9} />);
    L.push(<Tag key="h5" t={t} at={63.45} x={jg.x} y={jg.y} dx={200} dy={-120} text="HOW I SET IT UP" col={COL.ice} out={65.4} />);
    L.push(<Flash key="fl66" t={t} at={66.38} col="#eaf6ff" peak={1} w={0.3} />);
  }
  // ===== I · 66,4-70,2 · avatar con bordes borrosos y las fichas de los pasos; "5 MISTAKES" =====
  if (t >= 66.38) {
    L.push(<Avatar key="avI" t={t} edge={e(t, 66.8, 67.2)} />);
    L.push(<Chips key="ch" t={t} at={67.0} items={["COLD", "COAT", "DOOR", "SWAP"]} out={68.3} />);
    L.push(<Stamp key="mis" t={t} at={68.5} text="+ 5 MISTAKES" x={960} y={830} rot={-5} size={90} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
