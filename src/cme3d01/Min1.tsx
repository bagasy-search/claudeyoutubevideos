// cme3d01 · MINUTO 1 + LA GUÍA (0-99,3 s). Un solo hilo visual, sin cortes secos:
// avatar (se corta la luz) → portal desde la lámpara a la cuadra de noche → el transformador EXPLOTA y la cuadra se apaga en dominó
// → SMS de la compañía "72 h" → "TRES DÍAS" → portal por la ventana de la vecina → heladera a oscuras (carne/leche/remedios)
// → deslizamiento al cuarto de los chicos (ventilador parado, celular 15 %) → latigazo al avatar "MARZO"
// → la cuadra negra y UNA casa encendida (4 °C, luces, internet) → generador y panel tachados → la batería 3D
// → avatar con bordes borrosos "una batería NO mueve toda tu casa" → casa en corte: cables que se encienden en ORDEN + la pinza
// → avatar + rótulo → garaje real con lista → avatar "DÍA 2" → zoom al farol: LA MESA CON LA GUÍA, se abre en la página 23,
// el Plan Apagón se desliza, la descripción con el link flota (sin cortar el video) → la cámara sale a la calle: amanece, DÍA 2.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, C1 } from "./barrio3d";
import AVW from "./avwin.json";
import AVAIL from "./rest_avail.json";
import { BigNum, COL, Card3D, DrawX, Flash, FONT, HeatHaze, LowerThird, P, Portal, Tag, Thermo, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_FRAMES = s(C1 + 29.7);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/cme3d01/reel0.mp4, 1 /run de RunPod)
const WIN: { ms: number; me: number; off: number }[] = (AVW as { ms: number; me: number; off: number }[]).filter((w) => w.ms < 99);

const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.62)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 44% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 8)}px)` }}><Vid id={k} /></AbsoluteFill>;
};

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// celular 3D con el SMS de la compañía
const Phone: React.FC<{ t: number; at: number; out: number; x: number; y: number; batt?: number; children: React.ReactNode }> = ({ t, at, out, x, y, batt, children }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1400, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${-18 + (1 - Math.min(1, k)) * 50 + 3 * Math.sin(t)}deg) rotateX(6deg) rotateZ(-3deg)`, width: 420, height: 820, borderRadius: 58, background: "linear-gradient(160deg,#2b2e33,#0c0d0f)", padding: 16, boxShadow: "0 60px 110px rgba(0,0,0,.75), inset 0 0 0 3px #4a4d52, 18px 0 0 -6px #16171a" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 44, background: "linear-gradient(180deg,#141a24,#0a0d12)", overflow: "hidden", position: "relative", fontFamily: FONT }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 30px 0", color: "#cfd6e0", fontWeight: 800, fontSize: 22 }}><span>20:14</span>
            {batt !== undefined && <span style={{ color: batt < 20 ? COL.red : "#cfd6e0" }}>{batt}% ▮</span>}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

// tarjeta "descripción del video" que flota sobre la mesa: el renglón 1 se ilumina y la flecha lo señala
export const Desc: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 1.0, at + 1.5), sweep = e(t, at + 1.0, at + 2.0);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 960, top: 470, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-10 + 4 * Math.sin(t * 0.8)}deg)`, width: 1240, padding: "34px 44px 40px", scale: "1.12", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>🔋 Mi plan exacto de 3 días sin luz, paso por paso 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>claudioluzcero.vercel.app</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -900, top: -110, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

// marcador que resalta un renglón de la página (anclado a un punto 3D de la página)
const Hi: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; h: number; col?: string }> = ({ t, at, out, x, y, w, h, col = "#ffd60a" }) => {
  const a = e(t, at, at + 0.35), o = 1 - e(t, out, out + 0.25);
  if (a <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y - h / 2, width: w * a, height: h, background: col, opacity: 0.38 * o, mixBlendMode: "multiply", borderRadius: 6 }} />;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,3 · avatar; "se corta la luz" (2,04): la lámpara titila y se apaga; portal desde la lámpara a la cuadra =====
  if (t < 3.45) {
    const dk = t < 2.04 ? 0 : t < 2.5 ? (Math.sin(t * 53) > 0.2 ? 0.15 : 0.62) : 0.6;
    L.push(<Avatar key="avA" t={t} dark={dk} blur={5 * e(t, 2.7, 3.3)} />);
    const r = ei(t, 2.85, 3.42);
    if (r > 0) L.push(<Portal key="pA" x={790} y={95} r={r}><World t={Math.max(2.9, t)} /></Portal>);
  }
  // ===== B · 3,3-11,9 · la cuadra; el transformador explota; dominó; SMS 72 h; "TRES DÍAS"; portal a la ventana de la vecina =====
  if (t >= 3.4 && t < 11.95) {
    L.push(<World key="wB" t={t} />);
    const tr = screenOf(t, PT.trafo);
    L.push(<Tag key="tTr" t={t} at={5.2} x={tr.x} y={tr.y} dx={-260} dy={-120} text="EL TRANSFORMADOR" col={COL.amber} out={6.3} size={44} />);
    L.push(<Flash key="boom" t={t} at={6.42} col="#ffd9a0" peak={0.95} w={0.5} />);
    L.push(<Phone key="sms" t={t} at={7.6} out={10.4} x={1450} y={560}>
      <div style={{ margin: "120px 22px 0", padding: "22px 24px", borderRadius: 26, background: "#24303f", color: "#e8eef6", fontSize: 30, fontWeight: 700, lineHeight: 1.3, opacity: e(t, 7.9, 8.1), transform: `translateY(${(1 - e(t, 7.9, 8.2)) * 30}px)` }}>
        <div style={{ fontSize: 20, color: "#9fb0c4", fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>COMPAÑÍA ELÉCTRICA</div>
        Falla en transformador de su zona. Restablecimiento estimado:
        <div style={{ fontSize: 64, fontWeight: 900, color: COL.amber, marginTop: 8, transform: `scale(${Math.min(1.1, spr(t, 9.5))})`, transformOrigin: "0 50%", opacity: e(t, 9.45, 9.6) }}>72 HORAS</div>
      </div>
    </Phone>);
    L.push(<BigNum key="3d" t={t} at={10.64} text="3 DÍAS" size={210} out={11.5} sub="SIN LUZ" />);
    const wn = screenOf(t, PT.winN), pr = ei(t, 11.45, 11.93);
    if (pr > 0) L.push(<Portal key="pW" x={wn.x} y={wn.y} r={pr}><Shot k="img_fridge_dark2" t={t} a={11.45} /></Portal>);
  }
  // ===== D · 11,9-17,9 · la heladera a oscuras; carne / leche / remedios; termómetro que sube =====
  if (t >= 11.9 && t < 18.3) {
    const sl = ei(t, 17.75, 18.25);
    L.push(<AbsoluteFill key="fr" style={{ transform: `translateX(${-sl * 1920}px)`, filter: sl > 0.05 ? `blur(${Math.sin(sl * Math.PI) * 30}px)` : undefined }}>
      <HeatHaze t={t} amt={e(t, 15, 17.5) * 0.6}>
        <Shot k="img_fridge_dark2" t={t} a={11.45} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, transparent 40%, rgba(0,0,0,.55) 100%)" }} />
        <Tag t={t} at={14.56} x={520} y={600} dx={-140} dy={150} text="LA CARNE" col={COL.red} out={17.6} size={44} />
        <Tag t={t} at={15.34} x={690} y={500} dx={160} dy={-190} text="LA LECHE" out={17.6} size={44} />
        <Tag t={t} at={16.06} x={850} y={520} dx={260} dy={60} text="LOS REMEDIOS" sub="DE TU MAMÁ" col={COL.amber} out={17.6} size={44} />
        <Thermo t={t} at={12.4} x={1640} y={520} from={4} to={12} dur={4.8} out={17.5} />
      </HeatHaze>
    </AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="fanIn" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: `blur(${Math.sin(sl * Math.PI) * 30}px)` }}><Shot k="img_fan_kids" t={t} a={17.8} /></AbsoluteFill>);
  }
  // ===== E · 18,2-23,1 · el cuarto de los chicos: ventilador parado, celular al 15 %; latigazo al avatar =====
  if (t >= 18.2 && t < 23.2) {
    const wp = ei(t, 22.75, 23.15), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="fan" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Shot k="img_fan_kids" t={t} a={17.8} />
      <Tag t={t} at={18.3} x={480} y={170} dx={200} dy={40} text="EL VENTILADOR" sub="PARADO" col={COL.ice} out={22.5} size={42} />
      <Tag t={t} at={19.4} x={700} y={380} dx={-120} dy={-150} text="NO PUEDEN DORMIR" out={22.5} size={42} />
      <Phone t={t} at={21.3} out={22.6} x={1500} y={560} batt={15}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 200, height: 96, border: "8px solid #e9edf2", borderRadius: 18, position: "relative", padding: 8 }}>
            <div style={{ width: `${15 * (0.6 + 0.4 * e(t, 21.6, 22.4))}%`, height: "100%", background: COL.red, borderRadius: 6, opacity: Math.sin(t * 8) > -0.3 ? 1 : 0.35 }} />
            <div style={{ position: "absolute", right: -22, top: 26, width: 12, height: 32, background: "#e9edf2", borderRadius: 3 }} />
          </div>
          <div style={{ marginTop: 26, fontSize: 96, fontWeight: 900, color: COL.red }}>15%</div>
        </div>
      </Phone>
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== F · 23,1-27,5 · avatar "eso me pasó a mí en MARZO"; zoom a través de la ventana del avatar al mundo =====
  if (t >= 23.1 && t < 27.55) {
    const z = ei(t, 26.95, 27.5);
    L.push(<AbsoluteFill key="avF" style={{ transformOrigin: "930px 120px", transform: `scale(${1 + z * z * 7})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Stamp key="mz" t={t} at={24.86} text="MARZO" x={1450} y={300} out={26.8} rot={7} size={96} col={COL.amber} />);
    if (z > 0.4) L.push(<AbsoluteFill key="wF" style={{ opacity: (z - 0.4) / 0.6 }}><World t={27.3} /></AbsoluteFill>);
  }
  // ===== G · 27,5-35,1 · la cuadra negra y UNA casa encendida; 4 °C, luces, internet =====
  if (t >= 27.5 && t < 35.2) {
    L.push(<World key="wG" t={t} />);
    L.push(<BigNum key="3dd" t={t} at={27.6} text="3 DÍAS DESPUÉS" size={110} y={170} out={29.4} />);
    const h = screenOf(t, PT.house);
    L.push(<Tag key="cas" t={t} at={28.6} x={h.x} y={h.y - 120} dx={220} dy={-140} text="MI CASA" col={COL.amber} out={30.0} size={52} />);
    const fr = screenOf(t, PT.fridge), bu = screenOf(t, PT.bulb), rt = screenOf(t, PT.router);
    L.push(<Thermo key="th4" t={t} at={30.0} x={1500} y={330} from={4} to={4} dur={0.5} out={34.8} />);
    L.push(<Tag key="rf" t={t} at={29.56} x={fr.x} y={fr.y} dx={170} dy={-60} text="REFRI" sub="SEGUÍA FRÍO" col={COL.ice} out={34.8} size={44} />);
    L.push(<Tag key="lu" t={t} at={31.26} x={bu.x} y={bu.y} dx={-200} dy={-60} text="LUCES ✓" col="#7dff9e" out={34.8} size={46} />);
    L.push(<Tag key="in" t={t} at={33.38} x={rt.x} y={rt.y} dx={-120} dy={-130} text="INTERNET ✓" col="#7dff9e" out={34.8} size={46} />);
  }
  // ===== H · 35,1-38,7 · sin generador / sin panel solar (tarjetas tachadas sobre el mundo borroso) → la batería 3D =====
  if (t >= 35.1 && t < 38.75) {
    L.push(<AbsoluteFill key="hbg" style={{ filter: "blur(12px) brightness(.45)", transform: "scale(1.05)" }}><World t={35.0} /></AbsoluteFill>);
    L.push(<Flash key="fl35" t={t} at={35.15} peak={0.5} />);
    const cards = [{ id: "img_generator", at: 35.3, x: 230, lab: "GENERADOR" }, { id: "img_panel", at: 36.85, x: 1010, lab: "PANEL SOLAR" }];
    cards.forEach((cd, i) => {
      const k = spr(t, cd.at, 1), fall = ei(t, 38.05 + i * 0.08, 38.6 + i * 0.08);
      L.push(<AbsoluteFill key={"cd" + i} style={{ transform: `translateY(${fall * 1300}px) rotate(${fall * (i ? 20 : -20)}deg)` }}>
        <Card3D id={cd.id} x={cd.x} y={280} w={680} h={420} ry={(1 - Math.min(1, k)) * -80 + (i ? 8 : -8)} rx={6} z={(1 - Math.min(1, k)) * -900} o={e(t, cd.at, cd.at + 0.08)} label={cd.lab} />
        <DrawX t={t} at={cd.at + 0.5} x={cd.x + 60} y={320} w={560} h={340} />
      </AbsoluteFill>);
    });
    L.push(<div key="sin" style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: 12, color: COL.ink, opacity: e(t, 35.2, 35.4) * (1 - e(t, 38.0, 38.2)), textShadow: extrude(6, "#000") }}>SIN</div>);
    const r = ei(t, 38.3, 38.72);
    if (r > 0) L.push(<Portal key="pB" x={960} y={560} r={r}><World t={Math.max(38.45, t)} /></Portal>);
  }
  // ===== H2 · 38,6-40,5 · UNA SOLA BATERÍA =====
  if (t >= 38.7 && t < 40.55) {
    L.push(<World key="wH" t={t} />);
    const b = screenOf(t, [-1.75, 0.6, -1.55]);
    L.push(<Tag key="bat" t={t} at={38.98} x={b.x} y={b.y} dx={260} dy={-180} text="UNA SOLA BATERÍA" col="#7dff9e" out={40.3} size={58} />);
    L.push(<Flash key="fl40" t={t} at={40.42} col="#eaf6ff" peak={0.9} w={0.3} />);
  }
  // ===== I · 40,4-47,4 · avatar con bordes borrosos: "una batería NO mueve toda tu casa al mismo tiempo" =====
  if (t >= 40.4 && t < 47.45) {
    const z = ei(t, 46.9, 47.4);
    L.push(<AbsoluteFill key="avI" style={{ transform: `scale(${1 - z * 0.35})`, opacity: 1 - z, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}><Avatar t={t} edge={e(t, 41.4, 41.9)} /></AbsoluteFill>);
    L.push(<Stamp key="nm" t={t} at={42.32} text="NO MUEVE TODA TU CASA" x={960} y={830} out={45.6} rot={-4} size={74} />);
    L.push(<div key="at" style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: 6, color: COL.amber, opacity: e(t, 44.5, 44.7) * (1 - e(t, 46.7, 46.9)), textShadow: extrude(6, "#3a2400") }}>…AL MISMO TIEMPO</div>);
    if (z > 0) L.push(<AbsoluteFill key="wI" style={{ opacity: z }}><World t={47.2} /></AbsoluteFill>);
  }
  // ===== J · 47,4-54,2 · casa en corte: QUÉ conectas, CUÁNDO, en qué ORDEN; la pinza =====
  if (t >= 47.4 && t < 54.25) {
    L.push(<World key="wJ" t={t} />);
    const pts = [PT.fridge, PT.bulb, PT.router, PT.fan], at = [48.24, 49.26, 50.2, 51.0], lab = ["REFRI", "LUCES", "INTERNET", "VENTILADOR"];
    pts.forEach((q, i) => { const p = screenOf(t, q); L.push(<Tag key={"o" + i} t={t} at={at[i]} x={p.x} y={p.y} dx={i % 2 ? -150 : 150} dy={-110} text={`${i + 1} · ${lab[i]}`} col={i ? COL.ink : COL.ice} out={52.0} size={40} />); });
    L.push(<Chip key="hh" t={t} at={52.44} out={54.0} text="HORA POR HORA" />);
    const k = spr(t, 52.6, 0.9);
    L.push(<Card3D key="pz" id="img_pinza" x={1120} y={420} w={680} h={400} ry={(1 - Math.min(1, k)) * -70 - 10} rx={4} z={(1 - Math.min(1, k)) * -900} o={e(t, 52.6, 52.7) * (1 - e(t, 54.0, 54.2))} label="CON LA PINZA" />);
  }
  // ===== K · 54,2-56,4 · avatar + rótulo =====
  if (t >= 54.2 && t < 56.45) {
    const sl = ei(t, 56.0, 56.42), mb = Math.sin(sl * Math.PI) * 40;
    L.push(<AbsoluteFill key="avK" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="gbIn" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k="img_garage_bat" t={t} a={56.0} /></AbsoluteFill>);
  }
  if (t >= 54.18 && t < 59) L.push(<LowerThird key="lt" t={t} at={54.18} out={58.6} name="CLAUDIO MENDOZA" l2="CONSTRUCTOR · LO MEDÍ YO" l2at={55.34} />);
  // ===== L · 56,4-65,4 · el garaje real: lo que te voy a mostrar (lista que se tilda) =====
  if (t >= 56.4 && t < 65.5) {
    const z = ei(t, 64.95, 65.45);
    L.push(<AbsoluteFill key="gb" style={{ transformOrigin: "1240px 700px", transform: `scale(${1 + z * z * 6})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <HeatHaze t={t} amt={e(t, 63.3, 64.0) * (1 - e(t, 64.8, 65.0))}>
        <Shot k="img_garage_bat" t={t} a={56.0} z={[1.06, 1.16]} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 45%, rgba(0,0,0,.6))" }} />
        <List t={t} items={[{ at: 57.18, tx: "LA BATERÍA EXACTA" }, { at: 58.58, tx: "CUÁNTO COSTÓ CADA PIEZA" }, { at: 60.52, tx: "LOS NÚMEROS DE 3 DÍAS" }, { at: 63.08, tx: "2 ERRORES QUE CASI LA QUEMAN", warn: true }]} out={64.8} />
      </HeatHaze>
    </AbsoluteFill>);
    if (z > 0.4) L.push(<AbsoluteFill key="avL" style={{ opacity: (z - 0.4) / 0.6 }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== M · 65,4-69,8 · avatar "el segundo día pasó algo que no esperaba"; zoom al farol de la mesa → la guía =====
  if (t >= 65.4 && t < C1 + 0.1) {
    const z = ei(t, C1 - 0.75, C1);
    L.push(<AbsoluteFill key="avM" style={{ transformOrigin: "720px 260px", transform: `scale(${1 + z * z * 8})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<BigNum key="d2" t={t} at={66.94} text="DÍA 2" size={180} x={1450} y={300} out={C1 - 0.9} sub="ALGO QUE NO ESPERABA" />);
    if (z > 0.35) L.push(<AbsoluteFill key="wM" style={{ opacity: (z - 0.35) / 0.65 }}><World t={C1 - 0.3} /></AbsoluteFill>);
    L.push(<Flash key="flC" t={t} at={C1 - 0.08} col="#fff1cf" peak={0.7} w={0.35} />);
  }
  // ===== CTA1 · la mesa con LA GUÍA; se abre en la página 23; el Plan Apagón; la descripción con el link; sale a la calle =====
  if (t >= C1) {
    const c = t - C1;
    L.push(<World key="wC" t={t} />);
    const bk = screenOf(t, [0.3, 1.05, -1.2]);
    L.push(<Tag key="g1" t={t} at={C1 + 5.6} x={bk.x} y={bk.y - 60} dx={240} dy={-150} text="EL SISTEMA LUZ CERO" sub="MI GUÍA" col="#ffd60a" out={C1 + 6.9} size={50} />);
    // página 23: el número salta de la página
    L.push(<BigNum key="p23" t={t} at={C1 + 7.6} text="PÁG. 23" size={120} x={1560} y={210} out={C1 + 10.4} col="#ffd60a" edge="#5a4500" />);
    // renglones de la tabla de la página: pinza / medidor / reloj (posiciones de la página proyectadas)
    const row = (u: number, v: number) => screenOf(t, [0.3 - 0.145 + u * 0.29, 1.0, -1.2 - 0.22 + v * 0.44]);
    const r1 = row(0.06, 0.66), r2 = row(0.06, 0.75), r3 = row(0.06, 0.82), rEnd = row(0.92, 0.66);
    const w = Math.max(10, rEnd.x - r1.x);
    if (c > 11) {
      L.push(<Hi key="h1" t={t} at={C1 + 11.7} out={C1 + 16.5} x={r1.x} y={r1.y} w={w} h={56} />);
      L.push(<Hi key="h2" t={t} at={C1 + 12.6} out={C1 + 16.5} x={r2.x} y={r2.y} w={w} h={56} />);
      L.push(<Hi key="h3" t={t} at={C1 + 14.12} out={C1 + 16.5} x={r3.x} y={r3.y} w={w} h={56} />);
      L.push(<Tag key="sa" t={t} at={C1 + 15.38} x={rEnd.x} y={r2.y} dx={140} dy={-260} text="SIN ADIVINAR" col="#7dff9e" out={C1 + 16.6} size={52} />);
    }
    const b2 = screenOf(t, [0.78, 1.05, -1.18]);
    L.push(<Tag key="pa" t={t} at={C1 + 18.4} x={b2.x} y={b2.y} dx={140} dy={-300} text="PLAN APAGÓN" sub="72 HORAS · QUÉ ENCHUFAR Y CUÁNDO" col="#ff8fc8" out={C1 + 22.6} size={52} />);
    L.push(<Desc key="desc" t={t} at={C1 + 22.96} out={C1 + 26.6} />);
    L.push(<BigNum key="dia2" t={t} at={C1 + 28.3} text="DÍA 2" size={200} y={420} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};

const Chip: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at, out, text }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 120, top: 120, opacity: o, transform: `scale(${Math.min(1.08, spr(t, at))})`, transformOrigin: "0 0", padding: "14px 30px", borderRadius: 40, background: "rgba(10,20,30,.92)", border: `3px solid ${COL.amber}`, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: COL.amber, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>⏱ {text}</div>;
};

const List: React.FC<{ t: number; items: { at: number; tx: string; warn?: boolean }[]; out: number }> = ({ t, items, out }) => (
  <div style={{ position: "absolute", right: 90, top: 210, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      const tick = e(t, it.at + 0.35, it.at + 0.6);
      return (
        <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 22, margin: "0 0 26px", transform: `translateX(${(1 - Math.min(1, k)) * 200}px) rotateY(${(1 - Math.min(1, k)) * -50 - 8}deg)`, padding: "16px 28px", borderRadius: 18, background: "rgba(10,14,20,.9)", boxShadow: `0 24px 50px rgba(0,0,0,.6), inset 0 0 0 2px ${it.warn ? COL.red : COL.amber}66`, fontFamily: FONT }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, border: `4px solid ${it.warn ? COL.red : COL.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: it.warn ? COL.red : "#7dff9e" }}>{tick > 0.5 ? (it.warn ? "!" : "✓") : ""}</div>
          <div style={{ fontWeight: 900, fontSize: 44, color: it.warn ? COL.red : COL.ink, letterSpacing: 1, textShadow: extrude(4, "#000") }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);
