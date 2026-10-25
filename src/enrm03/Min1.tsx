// mececu · MINUTO 1 (0 → fin de "soy Claudio"). Un solo hilo, sin cortes secos:
// avatar "estás parado en un semáforo" → toma real: el tablero, las llaves que hacen tic tic tic, la aguja que sube y baja,
// el tironcito → avatar con el recibo del taller "sigue igual" → la MAQUETA: la batería, se saca el negativo, 10 MIN,
// la computadora se apaga y vuelve a aprender → "a veces sí / a veces lo peor" → avatar "borra cosas" → tarjetas: radio,
// ventanillas, airbag → toma real de la llave de 10 → avatar 4 ADVERTENCIAS → la maqueta: el borne, correcta/incorrecta,
// la computadora que se desordena → avatar con los 4 pasos → la maqueta: la llave, reconectar, los 10 minutos que todos
// se saltean → toma plata: la aguja que se asienta → avatar + rótulo.
// Audio fuera de Remotion (voz + sonido real de las tomas se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { World as WorldRaw, camSpeed } from "./motor3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { COL, FONT, P, Vid, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/enrm03/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // tomas LTX ya bajadas (public/enrm03/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = (AVAIL as { reelLen?: number }).reelLen ?? 264.8;
export const WIN: { ms: number; me: number; off: number; reel?: number }[] = (AVW as { win: { ms: number; me: number; off: number; reel?: number }[] }).win;
// reel 1 = la COLA (2º /run sólo con lo que el 1º no cubrió, tope ~600 s de RunPod): public/<slug>/reel1.mp4
const RLEN = (r: number) => ((AVAIL as { reelLens?: number[] }).reelLens ?? [REEL_LEN])[r] ?? REEL_LEN;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RLEN(w.reel ?? 0)) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(RLEN(w.reel ?? 0)) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + `reel${w.reel ?? 0}.mp4`)} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
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
  // clip de 3 s: corre y después se funde a su foto (nunca a negro); sin clip, la foto sola
  const isClip = id.startsWith("ltx_"), cl = isClip ? 1 - e(t, a + 2.75, a + 3.05) : 0;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q + sh}px, ${oy * q - sh * 0.6}px)` }}>
    <Vid id={"img_" + k} />
    {isClip && cl > 0.01 && <AbsoluteFill style={{ opacity: cl }}><Sequence from={s(a)} durationInFrames={s(3.05)} layout="none"><Vid id={id} /></Sequence></AbsoluteFill>}
  </AbsoluteFill>;
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
export const Taco: React.FC<{ t: number; a: number; out: number; keys: [number, number][]; x: number; y: number }> = ({ t, a, out, keys, x, y }) => {
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
export const Reloj: React.FC<{ t: number; at: number; out: number; x: number; y: number; text?: string }> = ({ t, at: a, out, x, y, text = "10 MIN" }) => {
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
export const Toggle: React.FC<{ t: number; a: number; b: number; out: number; ta: string; tb: string; y?: number }> = ({ t, a, b, out, ta, tb, y = 860 }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < a) return null;
  // 25-oct: las dos píldoras en una fila centrada (con posiciones fijas la 2ª pisaba a la 1ª si el texto era largo)
  const fs = ta.length + tb.length > 40 ? 38 : ta.length + tb.length > 30 ? 44 : 52;
  const pill = (txt: string, at0: number, ok: boolean) => {
    const k = Math.min(1.1, spr(t, at0)), oi = e(t, at0, at0 + 0.1), dim = ok && t > b + 0.2 ? 0.55 : 1;
    const c = ok ? "#43d17a" : COL.red;
    return (
      <div style={{ opacity: oi * dim, transform: `perspective(900px) rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", alignItems: "center", gap: 18,
        padding: "16px 34px 16px 18px", borderRadius: 60, background: "linear-gradient(180deg, rgba(18,22,30,.95), rgba(8,10,14,.95))", boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 0 4px ${c}`, fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ width: fs + 18, height: fs + 18, borderRadius: (fs + 18) / 2, background: c, color: "#0b0e13", fontWeight: 900, fontSize: fs, lineHeight: `${fs + 18}px`, textAlign: "center" }}>{ok ? "✓" : "✗"}</div>
        <div style={{ fontWeight: 900, fontSize: fs, color: COL.ink, letterSpacing: 2 }}>{txt}</div>
      </div>
    );
  };
  return <AbsoluteFill style={{ opacity: o }}><div style={{ position: "absolute", left: 40, right: 40, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", gap: 48 }}>{pill(ta, a, true)}{pill(tb, b, false)}</div></AbsoluteFill>;
};

