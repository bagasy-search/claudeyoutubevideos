// mececu · MINUTO 1 (0 → fin de "soy Claudio"). Un solo hilo, sin cortes secos:
// avatar "estás parado en un semáforo" → toma real: el tablero, las llaves que hacen tic tic tic, la aguja que sube y baja,
// el tironcito → avatar con el recibo del taller "sigue igual" → la MAQUETA: la batería, se saca el negativo, 10 MIN,
// la computadora se apaga y vuelve a aprender → "a veces sí / a veces lo peor" → avatar "borra cosas" → tarjetas: radio,
// ventanillas, airbag → toma real de la llave de 10 → avatar 4 ADVERTENCIAS → la maqueta: el borne, correcta/incorrecta,
// la computadora que se desordena → avatar con los 4 pasos → la maqueta: la llave, reconectar, los 10 minutos que todos
// se saltean → toma plata: la aguja que se asienta → avatar + rótulo.
// Audio fuera de Remotion (voz + sonido real de las tomas se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, T, screenOf, camSpeed } from "./motor3d";
import { at } from "./at";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Card3D, Chips, FONT, LowerThird, P, Receipt, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 86.95; // fin de la ventana del avatar de "soy Claudio, 35 años de mecánico"
export const MIN1_FRAMES = s(MIN1_END + 0.6);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/mececu/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // tomas LTX ya bajadas (public/mececu/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = (AVAIL as { reelLen?: number }).reelLen ?? 264.8;
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number; shake?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8, shake = 0 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k), sh = shake ? Math.sin(t * 61) * shake : 0;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q + sh}px, ${oy * q - sh * 0.6}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// cuentavueltas: la aguja del ralentí que sube, baja, sube (clavada a cada palabra)
const Taco: React.FC<{ t: number; a: number; out: number; keys: [number, number][]; x: number; y: number }> = ({ t, a, out, keys, x, y }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3)), k = Math.min(1.1, spr(t, a, 0.9));
  if (o <= 0.01) return null;
  let rpm = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i - 1][0]) rpm = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * ei(t, keys[i - 1][0], keys[i][0]);
  rpm += Math.sin(t * 23) * 0.04;
  const ang = -225 + (rpm / 8) * 270, R = 150;
  const pt = (deg: number, r: number) => [200 + r * Math.cos((deg * Math.PI) / 180), 200 + r * Math.sin((deg * Math.PI) / 180)];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <svg width={400} height={400} viewBox="0 0 400 400" style={{ transform: "rotateY(-14deg) rotateX(6deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.7))" }}>
        <circle cx={200} cy={200} r={185} fill="#0d0f12" stroke="#5b6066" strokeWidth={8} />
        {Array.from({ length: 9 }, (_, i) => { const d = -225 + i * 33.75, [x1, y1] = pt(d, R - 22), [x2, y2] = pt(d, R), [tx, ty] = pt(d, R - 48); return (
          <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={i >= 6 ? COL.red : "#e8e6e1"} strokeWidth={6} /><text x={tx} y={ty + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={i >= 6 ? COL.red : "#e8e6e1"}>{i}</text></g>); })}
        <text x={200} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#9aa0a6" letterSpacing={2}>RPM ×1000</text>
        <line x1={200} y1={200} x2={pt(ang, R - 10)[0]} y2={pt(ang, R - 10)[1]} stroke="#ff5a2a" strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #ff5a2a)" }} />
        <circle cx={200} cy={200} r={18} fill="#2a2d31" />
      </svg>
    </div>
  );
};

// reloj de 10 minutos que da la vuelta
const Reloj: React.FC<{ t: number; at: number; out: number; x: number; y: number; text?: string }> = ({ t, at: a, out, x, y, text = "10 MIN" }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ang = ei(t, a + 0.05, a + 1.6) * 360 - 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-16 + 5 * Math.sin(t)}deg) rotateX(8deg)`, display: "flex", alignItems: "center", gap: 26 }}>
        <svg width={220} height={246} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={128} y={0} width={44} height={34} rx={8} fill="#c9ced3" />
          <circle cx={150} cy={190} r={140} fill="#d9dde1" /><circle cx={150} cy={190} r={124} fill="#fbfbf8" />
          <path d={`M150 190 L150 66 A124 124 0 ${ang + 90 > 180 ? 1 : 0} 1 ${150 + 124 * Math.cos((ang * Math.PI) / 180)} ${190 + 124 * Math.sin((ang * Math.PI) / 180)} Z`} fill={COL.ice} opacity={0.55} />
          <line x1={150} y1={190} x2={150 + 100 * Math.cos((ang * Math.PI) / 180)} y2={190 + 100 * Math.sin((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={150} cy={190} r={12} fill="#222" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COL.ink, textShadow: extrude(10, "#1c2a3a"), whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};

// dos fichas que se enfrentan: ✓ / ✗
const Toggle: React.FC<{ t: number; a: number; b: number; out: number; ta: string; tb: string; y?: number }> = ({ t, a, b, out, ta, tb, y = 860 }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < a) return null;
  const pill = (txt: string, at0: number, ok: boolean, x: number) => {
    const k = Math.min(1.1, spr(t, at0)), oi = e(t, at0, at0 + 0.1), dim = ok && t > b + 0.2 ? 0.55 : 1;
    if (oi <= 0.01) return null;
    const c = ok ? "#43d17a" : COL.red;
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: oi * dim, transform: `translate(-50%,-50%) perspective(900px) rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", alignItems: "center", gap: 18,
        padding: "16px 34px 16px 18px", borderRadius: 60, background: "linear-gradient(180deg, rgba(18,22,30,.95), rgba(8,10,14,.95))", boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 0 4px ${c}`, fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: c, color: "#0b0e13", fontWeight: 900, fontSize: 52, lineHeight: "70px", textAlign: "center" }}>{ok ? "✓" : "✗"}</div>
        <div style={{ fontWeight: 900, fontSize: 52, color: COL.ink, letterSpacing: 2 }}>{txt}</div>
      </div>
    );
  };
  return <AbsoluteFill style={{ opacity: o }}>{pill(ta, a, true, 620)}{pill(tb, b, false, 1300)}</AbsoluteFill>;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const [A0, A1, A2, A3, A4, A5] = WIN.slice(0, 6);
  const tL = at("hoy te muestro") - 0.2, tP = at("y que es la que hace") - 0.1;
  const ral = <Shot k="g_ralenti" t={t} a={A0.me} z={[1.02, 1.14]} dur={13} shake={t > at("tironcito") - 0.1 && t < at("tironcito") + 0.5 ? 7 * (1 - e(t, at("tironcito"), at("tironcito") + 0.5)) : 0} />;

  // ===== A · avatar "estás parado en un semáforo" → toma real: tablero, llaves, la aguja, el tironcito =====
  if (t < A1.ms + 0.4) L.push(<Swipe key="swA" t={t} a={A0.me} b={A0.me + 0.38} vert from={<Avatar t={t} />} to={
    <Swipe t={t} a={A1.ms} b={A1.ms + 0.36} dir={-1} from={ral} to={<Avatar t={t} />} />} />);
  if (t >= A0.me && t < A1.ms) {
    L.push(<Tag key="as" t={t} at={at("lo sientes en el asiento")} x={760} y={760} dx={260} dy={110} text="LO SIENTES EN EL ASIENTO" col={COL.ice} out={at("tic") - 0.2} size={46} />);
    L.push(<Tag key="tc" t={t} at={at("tic")} x={900} y={820} dx={260} dy={-300} text="TIC · TIC · TIC" col={COL.amber} out={at("la aguja") + 0.2} size={56} />);
    L.push(<Taco key="ta" t={t} a={at("la aguja") - 0.1} out={A1.ms - 0.2} x={1500} y={420}
      keys={[[at("la aguja"), 0.8], [at("sube"), 1.5], [at("baja"), 0.55], [at("sube", 13.5), 1.6], [at("arrancas"), 0.8], [at("tironcito"), 2.6], [at("tironcito") + 0.4, 1.1]]} />);
    L.push(<Stamp key="ti" t={t} at={at("tironcito") + 0.1} text="¡TIRÓN!" x={620} y={300} rot={-8} size={96} out={A1.ms - 0.1} />);
  }
  // ===== B · avatar con el recibo del taller "te cambiaron una pieza, te cobraron, sigue igual" =====
  if (t >= A1.ms + 0.36 && t < A1.me) L.push(<Avatar key="avB" t={t} />);
  if (t >= A1.ms && t < A1.me + 0.2) {
    L.push(<Receipt key="rc" t={t} title="TALLER" rows={[{ at: at("cambiaron una pieza"), item: "PIEZA NUEVA", $: 180 }, { at: at("te cobraron"), item: "MANO DE OBRA", $: 95 }]} totalAt={at("te cobraron") + 0.6} x={1290} y={150} out={A1.me - 0.25} sc={1.05} />);
    L.push(<Stamp key="si" t={t} at={at("sigue igual")} text="SIGUE IGUAL" x={1330} y={860} rot={-7} size={80} out={A1.me - 0.15} />);
  }
  // ===== C · la maqueta: la batería → se saca el negativo → 10 MIN → la computadora se reinicia → a veces sí / lo peor =====
  if (t >= A1.me && t < A2.ms + 0.4) L.push(<Swipe key="swC" t={t} a={A1.me} b={A1.me + 0.36} from={<Avatar t={t} />} to={
    <Swipe t={t} a={A2.ms} b={A2.ms + 0.36} vert from={<World t={t} />} to={<Avatar t={t} />} />} />);
  if (t >= A1.me && t < A2.ms) {
    const n = screenOf(t, PT.neg), c = screenOf(t, PT.ecu);
    L.push(<Tag key="bt" t={t} at={T.desc + 0.1} x={n.x} y={n.y} dx={-300} dy={-190} text="EL NEGATIVO (–)" sub="SE DESCONECTA" col={COL.ink} out={T.compu - 0.3} size={52} />);
    L.push(<Reloj key="r1" t={t} at={at("10 minutos") - 0.1} out={T.compu + 0.4} x={1420} y={250} />);
    L.push(<Tag key="cp" t={t} at={T.compu + 0.9} x={c.x} y={c.y} dx={-330} dy={-200} text="LA COMPUTADORA" sub="SE REINICIA" col={COL.ice} out={T.verdad - 0.1} size={52} />);
    L.push(<Toggle key="tg" t={t} a={T.aveces} b={at("a veces es lo peor")} out={A2.ms - 0.15} ta="A VECES SÍ" tb="A VECES ES LO PEOR" />);
  }
  // ===== D · avatar "ese cable negro borra cosas que no sabías que estaban guardadas" =====
  if (t >= A2.ms + 0.36 && t < A2.me) L.push(<Avatar key="avD" t={t} />);
  if (t >= A2.ms && t < A2.me + 0.2) L.push(<Stamp key="bo" t={t} at={at("borra cosas")} text="BORRA COSAS GUARDADAS" x={1330} y={870} rot={-6} size={64} out={A2.me - 0.15} />);
  // ===== E · tarjetas sobre la maqueta: el código de la radio, las ventanillas, en algunos autos… → toma real: la llave de 10 =====
  if (t >= A2.me && t < A3.ms + 0.4) {
    const bg = <AbsoluteFill><World t={t} /><AbsoluteFill style={{ background: "rgba(6,9,14,.62)" }} /></AbsoluteFill>;
    L.push(<Swipe key="swE" t={t} a={A2.me} b={A2.me + 0.36} dir={-1} from={<Avatar t={t} />} to={
      <Swipe t={t} a={tL} b={tL + 0.36} vert from={bg} to={
        <Swipe t={t} a={A3.ms} b={A3.ms + 0.36} from={<Shot k="m_llave" t={t} a={tL} z={[1.03, 1.12]} dur={6} />} to={<Avatar t={t} />} />} />} />);
    if (t < tL + 0.36) {
      const cards: [string, number, string, number][] = [["k_radio", at("el codigo de tu radio"), "EL CÓDIGO DE LA RADIO", 120], ["k_ventanilla", at("las ventanillas"), "LAS VENTANILLAS", 700], ["k_airbag", at("en algunos autos"), "EN ALGUNOS AUTOS", 1280]];
      cards.forEach(([id, a0, lab, x], i) => {
        const k = Math.min(1.08, spr(t, a0, 0.9)), o = e(t, a0, a0 + 0.12);
        L.push(<Card3D key={"cd" + i} id={"img_" + id} x={x} y={300 + (1 - Math.min(1, k)) * 300} w={520} h={340} ry={(1 - i) * 14 + (1 - Math.min(1, k)) * 40} rx={4} o={o} label={lab} />);
      });
      L.push(<Stamp key="ns" t={t} at={at("no se arreglan solas")} text="NO SE ARREGLAN SOLAS" x={960} y={860} rot={-4} size={70} out={tL} />);
    }
    if (t >= tL) {
      L.push(<Tag key="cs" t={t} at={at("cuando sirve")} x={980} y={520} dx={-320} dy={-210} text="CUÁNDO SIRVE" col="#7dff9e" out={A3.ms} size={56} />);
      L.push(<Tag key="cb" t={t} at={at("como se hace bien")} x={1000} y={560} dx={300} dy={190} text="CÓMO SE HACE BIEN" col={COL.ink} out={A3.ms} size={52} />);
    }
  }
  // ===== F · avatar "y las 4 advertencias que nadie te dice antes de tocar ese borne" =====
  if (t >= A3.ms + 0.36 && t < A3.me) L.push(<Avatar key="avF" t={t} />);
  if (t >= A3.ms && t < A3.me + 0.2) L.push(<BigNum key="4a" t={t} at={at("cuatro advertencias")} text="4 ADVERTENCIAS" size={130} y={250} out={A3.me - 0.2} col="#ffd23f" edge="#5a4500" sub="ANTES DE TOCAR EL BORNE" />);
  // ===== G · la maqueta: el borne de cerca → correcta / incorrecta → la computadora que se desordena =====
  if (t >= A3.me && t < A4.ms + 0.4) L.push(<Swipe key="swG" t={t} a={A3.me} b={A3.me + 0.36} vert from={<Avatar t={t} />} to={
    <Swipe t={t} a={A4.ms} b={A4.ms + 0.36} dir={-1} from={<World t={t} />} to={<Avatar t={t} />} />} />);
  if (t >= A3.me && t < A4.ms) {
    const n = screenOf(t, PT.neg), c = screenOf(t, PT.ecu);
    L.push(<Tag key="bn" t={t} at={T.borne + 0.1} x={n.x} y={n.y} dx={-320} dy={-200} text="ESTE BORNE" sub="EL NEGATIVO" col="#ffd23f" out={T.correcta - 0.2} size={58} />);
    L.push(<Toggle key="tg2" t={t} a={T.correcta} b={T.incorrecta} out={T.esa - 0.1} ta="FORMA CORRECTA" tb="INCORRECTA" />);
    L.push(<Tag key="qe" t={t} at={T.esa + 0.7} x={c.x} y={c.y} dx={-330} dy={-200} text="¿QUÉ ES?" sub="LA COMPUTADORA DEL MOTOR" col={COL.ice} out={T.desordena - 0.1} size={56} />);
    L.push(<Tag key="de" t={t} at={T.desordena + 0.2} x={c.x} y={c.y} dx={320} dy={-190} text="SE DESORDENA" col={COL.red} out={A4.ms - 0.1} size={58} />);
  }
  // ===== H · avatar con los 4 pasos =====
  if (t >= A4.ms + 0.36 && t < A4.me) L.push(<Avatar key="avH" t={t} />);
  if (t >= A4.ms && t < A4.me + 0.3) L.push(<Chips key="ch" t={t} at={A4.ms + 0.3} items={["QUÉ ES", "CUÁNDO SIRVE", "PASO A PASO", "LOS 10 MIN"]} out={A4.me - 0.25} y={800} />);
  // ===== I · la maqueta: la llave de 10 → reconectar → los 10 minutos que todos se saltean → toma plata: la aguja que se asienta =====
  if (t >= A4.me && t < A5.ms + 0.4) L.push(<Swipe key="swI" t={t} a={A4.me} b={A4.me + 0.36} from={<Avatar t={t} />} to={
    <Swipe t={t} a={tP} b={tP + 0.36} vert from={<World t={t} />} to={
      <Swipe t={t} a={A5.ms} b={A5.ms + 0.36} from={<Shot k="p_aguja" t={t} a={tP} z={[1.02, 1.1]} dur={3} />} to={<Avatar t={t} />} />} />} />);
  if (t >= A4.me && t < tP) {
    const n = screenOf(t, PT.neg), c = screenOf(t, PT.ecu);
    L.push(<Tag key="ll" t={t} at={T.herr + 0.2} x={n.x} y={n.y} dx={-320} dy={-190} text="LLAVE DE 10 MM" col={COL.ink} out={T.primeros - 0.3} size={54} />);
    L.push(<Reloj key="r2" t={t} at={T.primeros} out={T.saltean - 0.2} x={1300} y={240} />);
    L.push(<Tag key="ap" t={t} at={T.reconectar + 0.6} x={c.x} y={c.y} dx={300} dy={180} text="VUELVE A APRENDER" col={COL.ice} out={tP} size={52} />);
    L.push(<Stamp key="sa" t={t} at={T.saltean} text="TODOS SE LO SALTEAN" x={760} y={860} rot={-6} size={70} out={tP} />);
  }
  if (t >= tP && t < A5.ms) L.push(<Tag key="rp" t={t} at={T.truco} x={960} y={560} dx={-300} dy={-200} text="RALENTÍ PAREJO" col="#7dff9e" out={A5.ms} size={56} />);
  // ===== J · avatar "ya me conoces, soy Claudio, 35 años de mecánico" =====
  if (t >= A5.ms + 0.4) L.push(<Avatar key="avJ" t={t} />);
  if (t >= A5.ms) L.push(<LowerThird key="lt" t={t} at={at("soy claudio")} out={MIN1_END + 2} name="CLAUDIO" l2="35 AÑOS DE MECÁNICO" l2at={at("35 anos")} />);

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};
void Vid;
