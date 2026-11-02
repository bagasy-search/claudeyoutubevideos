import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar } from "./base";

const W = 1920;
const H = 1080;
const FONT = "Montserrat, 'Segoe UI', system-ui, sans-serif";

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const e = (t: number, a: number, b: number) => clamp((t - a) / Math.max(0.0001, b - a));
const ei = (t: number, a: number, b: number) => { const k = e(t, a, b); return k * k * (3 - 2 * k); };
const spr = (t: number, a: number, k = 1) => {
  const x = (t - a) * k;
  if (x <= 0) return 0;
  return 1 - Math.exp(-6 * x) * Math.cos(9 * x);
};
const extrude = (n: number, col: string) => {
  const parts: string[] = [];
  for (let i = 1; i <= n; i++) parts.push(`${i * 0.6}px ${i * 0.6}px 0 ${col}`);
  return parts.join(", ");
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.42) 100%)", mixBlendMode: "multiply" }} />
);

const Foto: React.FC<{ src: string; t: number; a: number; b: number; push?: number; dx?: number; dy?: number; rot?: number }> = ({ src, t, a, b, push = 1.09, dx = 0, dy = 0, rot = 0 }) => {
  const k = ei(t, a, b);
  const sc = 1.02 + (push - 1.02) * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${dx * k}px, ${dy * k}px) rotate(${rot * k}deg)` }} />
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ t: number; a: number; out: number; x: number; y: number; text: string; col?: string; size?: number }> = ({ t, a, out, x, y, text, col = "#ffd84a", size = 44 }) => {
  const p = spr(t, a);
  const o = 1 - e(t, out, out + 0.35);
  if (t < a - 0.1 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.05, p)})`, opacity: o, background: "rgba(11,20,36,.82)", border: `2px solid ${col}`, borderRadius: 14, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, color: "#fff", fontSize: size, letterSpacing: 1, boxShadow: `0 12px 40px rgba(0,0,0,.5), 0 0 24px ${col}55`, whiteSpace: "nowrap" }}>{text}</div>
  );
};

const Tag: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub?: string; col?: string; size?: number }> = ({ t, at, out, x, y, text, sub, col = "#ffd84a", size = 72 }) => {
  const p = spr(t, at);
  const o = 1 - e(t, out, out + 0.35);
  if (t < at - 0.1 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.06, p)})`, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 1, textShadow: extrude(6, "rgba(0,0,0,.65)") + `, 0 0 30px ${col}66`, whiteSpace: "nowrap" }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: Math.round(size * 0.5), color: col, marginTop: 6, textShadow: "0 4px 16px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

const BigNum: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; size?: number; col?: string; sub?: string }> = ({ t, at, out, text, x, y, size = 280, col = "#8fd6ff", sub }) => {
  const p = spr(t, at);
  const o = 1 - e(t, out, out + 0.35);
  if (t < at - 0.1 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.08, p)}) rotate(${(1 - p) * -8}deg)`, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.85, color: "#fff", textShadow: extrude(10, "rgba(0,0,0,.65)") + `, 0 0 40px ${col}88` }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: Math.round(size * 0.22), color: col, letterSpacing: 6, marginTop: 4, textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>{sub}</div>}
    </div>
  );
};

const DrawX: React.FC<{ t: number; at: number; x: number; y: number; w: number; h: number }> = ({ t, at, x, y, w, h }) => {
  const k = e(t, at, at + 0.5);
  const o = 1 - e(t, at + 3.5, at + 3.9);
  if (k <= 0 || o <= 0) return null;
  const col = "#d7261e";
  const L = w / 2, A = h / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x - L, top: y - A, opacity: o, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.6))" }}>
      <line x1={20} y1={20} x2={20 + (w - 40) * Math.min(1, k * 2)} y2={20 + (h - 40) * Math.min(1, k * 2)} stroke={col} strokeWidth={14} strokeLinecap="round" />
      <line x1={w - 20} y1={20} x2={w - 20 - (w - 40) * Math.max(0, k * 2 - 1)} y2={20 + (h - 40) * Math.max(0, k * 2 - 1)} stroke={col} strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
};

const Receipt: React.FC<{ t: number; rows: { at: number; item: string; $: string }[]; totalAt: number; x: number; y: number; out: number; sc?: number }> = ({ t, rows, totalAt, x, y, out, sc = 1 }) => {
  const p = spr(t, rows[0]?.at ?? totalAt);
  const o = 1 - e(t, out, out + 0.35);
  if (t < (rows[0]?.at ?? totalAt) - 0.1 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.05, p) * sc}) rotate(${(1 - p) * -4}deg)`, opacity: o, background: "#f4ecd8", color: "#1a1a1a", fontFamily: "'Courier New', monospace", padding: "22px 28px", borderRadius: 6, boxShadow: "0 20px 60px rgba(0,0,0,.6)", minWidth: 320 }}>
      <div style={{ fontSize: 18, letterSpacing: 2, textAlign: "center", borderBottom: "2px dashed #1a1a1a", paddingBottom: 8, marginBottom: 10, fontWeight: 700 }}>RECIBO</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: e(t, r.at, r.at + 0.25), marginBottom: 6 }}>
          <span>{r.item}</span><span style={{ fontWeight: 700 }}>{r.$}</span>
        </div>
      ))}
      <div style={{ borderTop: "2px dashed #1a1a1a", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 800, opacity: e(t, totalAt, totalAt + 0.3) }}>
        <span>TOTAL</span><span>{rows[rows.length - 1]?.$ ?? ""}</span>
      </div>
    </div>
  );
};

const Flash: React.FC<{ t: number; at: number; peak?: number; w?: number }> = ({ t, at, peak = 0.3, w = 0.4 }) => {
  const k = e(t, at, at + w);
  if (t < at || k >= 1) return null;
  const o = (1 - k) * peak;
  return <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(255,255,255,${o})` }} />;
};

const FotoCard: React.FC<{ src: string; t: number; a: number; b: number; x: number; y: number; w: number; h: number; ry?: number; rz?: number; push?: number }> = ({ src, t, a, b, x, y, w, h, ry = 0, rz = 0, push = 1.08 }) => {
  const p = spr(t, a);
  const o = 1 - e(t, b - 0.35, b);
  const k = ei(t, a, b);
  const sc = (0.92 + 0.08 * p) * (1 + (push - 1) * k);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`, opacity: o, boxShadow: "0 30px 80px rgba(0,0,0,.6)", border: "6px solid #f4ecd8", borderRadius: 6, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

const Contador: React.FC<{ t: number; a: number; b: number; to: number; x: number; y: number; size?: number; col?: string; sub?: string }> = ({ t, a, b, to, x, y, size = 220, col = "#ffd84a", sub }) => {
  const k = e(t, a, b);
  const n = Math.round(1 + (to - 1) * k);
  const p = spr(t, a);
  const o = 1 - e(t, b, b + 0.3);
  if (t < a - 0.1 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.08, p)})`, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.9, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.65)") }}>{n}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: col, letterSpacing: 4, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{sub}</div>}
    </div>
  );
};

const FotoTarjeta3D: React.FC<{ src: string; t: number; a: number; b: number; x: number; y: number; w: number; h: number; ry?: number; rz?: number; push?: number }> = ({ src, t, a, b, x, y, w, h, ry = -14, rz = -2, push = 1.06 }) => {
  const p = spr(t, a);
  const o = 1 - e(t, b - 0.35, b);
  const k = ei(t, a, b);
  const sc = (0.9 + 0.1 * p) * (1 + (push - 1) * k);
  const ryT = ry * (1 - Math.min(1, p)) - 3 * Math.sin((t - a) * 0.6);
  const rzT = rz + 1.2 * Math.sin((t - a) * 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) perspective(1500px) rotateY(${ryT}deg) rotateZ(${rzT}deg) scale(${sc})`, opacity: o, boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 0 0 6px #f4ecd8", borderRadius: 8, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 40%)" }} />
    </div>
  );
};

export const Tramo0: React.FC<{ t: number }> = ({ t }) => {
  const AV: [number, number][] = [[0, 4.64], [18.36, 21.95], [33.28, 38.54], [48.8, 53.25], [66.14, 69.48], [81.63, 86.71], [98.98, 103.19], [115.43, 119.78], [130.6, 135.25], [148.22, 153.12], [164.24, 169.8]];
  const enAvatar = AV.some(([a, b]) => t >= a && t < b);

  type Plano = { a: number; b: number; id: string; src: string; push?: number; dx?: number; dy?: number; rot?: number };
  const P: Plano[] = [
    { a: 4.64, b: 8.94, id: "t0_01", src: "plo31t/img/plo31t_t0_01.jpg", push: 1.10, dx: 20 },
    { a: 8.94, b: 13.08, id: "t0_02", src: "plo31t/img/plo31t_t0_02.jpg", push: 1.08, dy: 15 },
    { a: 13.08, b: 18.36, id: "t0_03", src: "plo31t/img/plo31t_t0_03.jpg", push: 1.14, dy: -20 },
    { a: 21.95, b: 27.36, id: "t0_04", src: "plo31t/img/plo31t_t0_04.jpg", push: 1.12, dy: 25 },
    { a: 27.36, b: 33.28, id: "t0_05", src: "plo31t/img/plo31t_t0_05.jpg", push: 1.09, dx: -25 },
    { a: 38.54, b: 43.28, id: "t0_06", src: "plo31t/img/plo31t_t0_06.jpg", push: 1.07, dy: 10 },
    { a: 43.28, b: 48.8, id: "t0_07", src: "plo31t/img/plo31t_t0_07.jpg", push: 1.11, dx: 30 },
    { a: 53.25, b: 57.64, id: "t0_08", src: "plo31t/img/plo31t_t0_08.jpg", push: 1.13, dy: -15 },
    { a: 57.64, b: 62.64, id: "t0_09", src: "plo31t/img/plo31t_t0_09.jpg", push: 1.08, dx: -20 },
    { a: 62.64, b: 66.14, id: "t0_10", src: "plo31t/img/plo31t_t0_10.jpg", push: 1.10, dy: 20 },
    { a: 69.48, b: 75.24, id: "t0_11", src: "plo31t/img/plo31t_t0_11.jpg", push: 1.07, dy: 15 },
    { a: 75.24, b: 81.63, id: "t0_12", src: "plo31t/img/plo31t_t0_12.jpg", push: 1.09, dx: 20 },
    { a: 86.71, b: 93.74, id: "t0_13", src: "plo31t/img/plo31t_t0_13.jpg", push: 1.08, dy: -10 },
    { a: 103.19, b: 110.0, id: "t0_14", src: "plo31t/img/plo31t_t0_14.jpg", push: 1.12, dy: 20 },
    { a: 110.0, b: 115.43, id: "t0_15", src: "plo31t/img/plo31t_t0_15.jpg", push: 1.13, dy: 25 },
    { a: 119.78, b: 123.28, id: "t0_16", src: "plo31t/img/plo31t_t0_16.jpg", push: 1.11, dy: -20 },
    { a: 123.28, b: 130.6, id: "t0_17", src: "plo31t/img/plo31t_t0_17.jpg", push: 1.14, dx: 25 },
    { a: 135.25, b: 140.6, id: "t0_18", src: "plo31t/img/plo31t_t0_18.jpg", push: 1.10, dy: 15 },
    { a: 140.6, b: 148.22, id: "t0_19", src: "plo31t/img/plo31t_t0_19.jpg", push: 1.13, dy: 25 },
    { a: 153.12, b: 157.42, id: "t0_20", src: "plo31t/img/plo31t_t0_20.jpg", push: 1.09, dx: 20 },
    { a: 157.42, b: 164.24, id: "t0_21", src: "plo31t/img/plo31t_t0_21.jpg", push: 1.12, dy: 20 },
    { a: 169.8, b: 174.76, id: "t0_22", src: "plo31t/img/plo31t_t0_22.jpg", push: 1.11, dy: -15 },
    { a: 174.76, b: 178.99, id: "t0_23", src: "plo31t/img/plo31t_t0_23.jpg", push: 1.08, dx: -20 },
  ];

  const activo = P.find(p => t >= p.a && t < p.b);
  const previo = P.filter(p => p.b <= t).slice(-1)[0];
  const enTrans = activo && t < activo.a + 0.4 && previo && Math.abs(previo.b - activo.a) < 0.05;

  const es15 = t >= 38.54 && t < 43.28;
  const esGuia = t >= 69.48 && t < 81.63;
  const esComp = t >= 86.71 && t < 93.74;

  return (
    <AbsoluteFill style={{ background: "#0b1424" }}>
      {enAvatar && <Avatar t={t} />}

      {!enAvatar && activo && (
        <AbsoluteFill>
          {enTrans && previo && (
            <AbsoluteFill style={{ opacity: 1 - e(t, activo.a, activo.a + 0.35), filter: `blur(${e(t, activo.a, activo.a + 0.35) * 8}px)` }}>
              <Foto src={previo.src} t={t} a={previo.a} b={previo.b} push={previo.push} dx={previo.dx} dy={previo.dy} rot={previo.rot} />
            </AbsoluteFill>
          )}
          <AbsoluteFill style={{ opacity: enTrans ? e(t, activo.a, activo.a + 0.35) : 1 }}>
            <Foto src={activo.src} t={t} a={activo.a} b={activo.b} push={activo.push} dx={activo.dx} dy={activo.dy} rot={activo.rot} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {activo?.id === "t0_01" && (
        <>
          <Tag t={t} at={5.2} out={8.6} x={W * 0.62} y={H * 0.55} text="EL TRIPLE" sub="de lo normal" size={72} col="#ff4a3d" />
          <Chip t={t} a={4.9} out={8.6} x={W * 0.28} y={H * 0.18} text="RECIBO DEL AGUA" col="#ffd84a" size={40} />
        </>
      )}
      {activo?.id === "t0_02" && (
        <Tag t={t} at={9.6} out={12.9} x={W * 0.5} y={H * 0.72} text="AL LADO DEL INODORO" size={64} col="#8fd6ff" />
      )}
      {activo?.id === "t0_03" && (
        <>
          <BigNum t={t} at={13.24} out={18.0} text="3" x={W * 0.78} y={H * 0.35} size={300} col="#8fd6ff" sub="GOTAS" />
          <Chip t={t} a={14.2} out={18.0} x={W * 0.25} y={H * 0.18} text="COLORANTE DE COMIDA" col="#ffd84a" size={38} />
        </>
      )}
      {activo?.id === "t0_04" && (
        <>
          <Tag t={t} at={21.2} out={27.0} x={W * 0.55} y={H * 0.62} text="AZUL" sub="meses tirando agua" size={100} col="#8fd6ff" />
          <Chip t={t} a={22.8} out={27.0} x={W * 0.25} y={H * 0.18} text="SIN HACER RUIDO" col="#ffd84a" size={40} />
        </>
      )}
      {activo?.id === "t0_05" && (
        <>
          <Chip t={t} a={29.1} out={33.0} x={W * 0.5} y={H * 0.16} text="MENOS QUE UN CAFÉ" col="#ffd84a" size={48} />
          <Receipt t={t} rows={[{ at: 29.4, item: "Café", $: "$35" }, { at: 30.2, item: "Sapo nuevo", $: "$28" }]} totalAt={31.0} x={W * 0.72} y={H * 0.42} out={33.0} sc={1.1} />
        </>
      )}
      {activo?.id === "t0_07" && (
        <Tag t={t} at={44.3} out={48.6} x={W * 0.55} y={H * 0.6} text="EN MI CASA" size={72} col="#ffb257" />
      )}
      {activo?.id === "t0_08" && (
        <>
          <FotoTarjeta3D src="plo31t/img/plo31t_t0_08.jpg" t={t} a={53.4} b={57.5} x={W * 0.62} y={H * 0.52} w={720} h={480} ry={-16} rz={-2} push={1.05} />
          <Tag t={t} at={53.3} out={57.5} x={W * 0.28} y={H * 0.55} text="LO MÁS CARO" sub="de todo" size={80} col="#ff4a3d" />
          <Chip t={t} a={54.0} out={57.5} x={W * 0.28} y={H * 0.18} text="LA VISITA DEL PLOMERO" col="#ffd84a" size={36} />
        </>
      )}
      {activo?.id === "t0_09" && (
        <Tag t={t} at={58.4} out={62.5} x={W * 0.5} y={150} text="DON ERNESTO" size={80} col="#ffd84a" />
      )}
      {activo?.id === "t0_10" && (
        <Tag t={t} at={63.2} out={66.0} x={W * 0.55} y={H * 0.6} text="AHORRA PLATA" size={72} col="#ffb257" />
      )}
      {activo?.id === "t0_14" && (
        <Tag t={t} at={105.1} out={109.9} x={W * 0.55} y={H * 0.55} text="MÁS AGUA" sub="sin que te enteres" size={80} col="#ff4a3d" />
      )}
      {activo?.id === "t0_15" && (
        <Tag t={t} at={110.9} out={115.3} x={W * 0.55} y={H * 0.6} text="EL SAPO" sub="abajo de todo" size={80} col="#8fd6ff" />
      )}
      {activo?.id === "t0_16" && (
        <>
          <FotoTarjeta3D src="plo31t/img/plo31t_t0_16.jpg" t={t} a={119.9} b={123.2} x={W * 0.6} y={H * 0.52} w={700} h={470} ry={14} rz={2} push={1.05} />
          <Tag t={t} at={120.0} out={123.2} x={W * 0.28} y={H * 0.6} text="LA PALANCA" size={76} col="#ffd84a" />
        </>
      )}
      {activo?.id === "t0_17" && (
        <>
          <DrawX t={t} at={125.1} x={W * 0.55} y={H * 0.45} w={340} h={340} />
          <Chip t={t} a={126.1} out={130.5} x={W * 0.5} y={H * 0.15} text="SE ENDURECE · SE DEFORMA" col="#ff4a3d" size={40} />
        </>
      )}
      {activo?.id === "t0_18" && (
        <Tag t={t} at={135.5} out={140.5} x={W * 0.55} y={H * 0.6} text="LEVANTA LA TAPA" size={72} col="#ffd84a" />
      )}
      {activo?.id === "t0_19" && (
        <>
          <BigNum t={t} at={141.0} out={148.0} text="3" x={W * 0.78} y={H * 0.35} size={280} col="#8fd6ff" sub="GOTAS" />
          <Chip t={t} a={144.6} out={148.0} x={W * 0.25} y={H * 0.18} text="AZUL O VERDE" col="#ffd84a" size={40} />
        </>
      )}
      {activo?.id === "t0_20" && (
        <>
          <Chip t={t} a={153.5} out={157.3} x={W * 0.5} y={H * 0.16} text="NO JALES LA PALANCA" col="#ff4a3d" size={44} />
          <Contador t={t} a={155.5} b={157.3} to={15} x={W * 0.78} y={H * 0.55} size={220} col="#ffd84a" sub="MINUTOS" />
        </>
      )}
      {activo?.id === "t0_21" && (
        <Tag t={t} at={158.4} out={164.1} x={W * 0.55} y={H * 0.6} text="CAMBIA DE COLOR" sub="el sapo está perdiendo" size={72} col="#8fd6ff" />
      )}
      {activo?.id === "t0_22" && (
        <>
          <FotoTarjeta3D src="plo31t/img/plo31t_t0_22.jpg" t={t} a={170.0} b={174.7} x={W * 0.6} y={H * 0.52} w={700} h={470} ry={-14} rz={-2} push={1.05} />
          <Tag t={t} at={173.6} out={174.7} x={W * 0.28} y={H * 0.6} text="DOS OREJITAS" size={72} col="#ffd84a" />
        </>
      )}
      {activo?.id === "t0_23" && (
        <Tag t={t} at={175.0} out={178.9} x={W * 0.5} y={150} text="A LA FERRETERÍA" size={80} col="#ffd84a" />
      )}

      {es15 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Contador t={t} a={38.58} b={40.6} to={15} x={W * 0.5} y={H * 0.42} size={340} col="#ffd84a" sub="TRUCOS" />
          <Chip t={t} a={40.3} out={43.2} x={W * 0.5} y={H * 0.72} text="TE AHORRAN MILES" col="#ff4a3d" size={54} />
        </AbsoluteFill>
      )}

      {esGuia && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {t < 75.24 && (
            <FotoCard src="plo31t/libro/cover50.jpg" t={t} a={70.5} b={75.24} x={W * 0.5} y={H * 0.5} w={440} h={620} ry={-18} rz={-3} push={1.06} />
          )}
          {t >= 75.24 && (
            <>
              <FotoCard src="plo31t/libro/cover50.jpg" t={t} a={75.3} b={81.6} x={W * 0.5} y={H * 0.5} w={400} h={560} ry={0} rz={0} push={1.05} />
              <FotoCard src="plo31t/libro/pag_e1.jpg" t={t} a={76.2} b={81.6} x={W * 0.22} y={H * 0.5} w={340} h={480} ry={22} rz={-4} push={1.04} />
              <FotoCard src="plo31t/libro/pag_e2.jpg" t={t} a={77.4} b={81.6} x={W * 0.78} y={H * 0.5} w={340} h={480} ry={-22} rz={4} push={1.04} />
              <Tag t={t} at={76.7} out={81.5} x={W * 0.5} y={130} text="50 ARREGLOS" size={90} col="#ffd84a" />
            </>
          )}
        </AbsoluteFill>
      )}

      {esComp && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Receipt t={t} rows={[{ at: 89.4, item: "Una visita", $: "$1.200" }]} totalAt={90.6} x={W * 0.28} y={H * 0.42} out={93.6} sc={1.15} />
          <Receipt t={t} rows={[{ at: 90.9, item: "50 arreglos", $: "$199" }]} totalAt={92.0} x={W * 0.72} y={H * 0.42} out={93.6} sc={1.15} />
          <Chip t={t} a={92.3} out={93.6} x={W * 0.72} y={H * 0.78} text="MENOS QUE UNA VISITA" col="#ffd84a" size={42} />
        </AbsoluteFill>
      )}

      {t >= 93.74 && t < 98.98 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <FotoCard src="plo31t/img/plo31t_t0_13.jpg" t={t} a={93.8} b={98.98} x={W * 0.5} y={H * 0.5} w={W} h={H} ry={0} rz={0} push={1.04} />
          <FotoCard src="plo31t/libro/qr_g.png" t={t} a={94.2} b={98.98} x={W * 0.5} y={H * 0.54} w={420} h={420} ry={-10} rz={-2} push={1.05} />
          <Tag t={t} at={94.6} out={98.9} x={W * 0.5} y={130} text="EN LA DESCRIPCIÓN" size={80} col="#ffd84a" />
        </AbsoluteFill>
      )}

      <Grain />
      <Flash t={t} at={38.58} peak={0.35} w={0.4} />
      <Flash t={t} at={75.24} peak={0.25} w={0.3} />
    </AbsoluteFill>
  );
};

export const SFX0: [number, string, number?][] = [
  [4.64, "whoosh", -2], [4.9, "pop", -3], [5.2, "slam", -2],
  [8.94, "whoosh", -2], [9.6, "pop", -3],
  [13.08, "whoosh", -2], [13.24, "tick", -3], [13.5, "tick", -3], [13.76, "tick", -3], [14.2, "pop", -3],
  [18.36, "whoosh", -2],
  [21.95, "whoosh", -2], [21.2, "slam", -2], [22.8, "pop", -3],
  [27.36, "whoosh", -2], [29.1, "pop", -3], [29.4, "paper", -4], [30.2, "paper", -4], [31.0, "ding", -2],
  [33.28, "whoosh", -2],
  [38.54, "whoosh_big", -1], [38.58, "roll", -2], [40.3, "pop", -3],
  [43.28, "whoosh", -2], [44.3, "pop", -3],
  [48.8, "whoosh", -2],
  [53.25, "whoosh", -2], [53.3, "slam", -2], [53.4, "paper", -4], [54.0, "pop", -3],
  [57.64, "whoosh", -2], [58.4, "pop", -3],
  [62.64, "whoosh", -2], [63.2, "pop", -3],
  [66.14, "whoosh", -2],
  [69.48, "whoosh", -2], [70.5, "paper", -3],
  [75.24, "whoosh", -2], [75.3, "paper", -3], [76.2, "paper", -4], [76.7, "slam", -2], [77.4, "paper", -4],
  [81.63, "whoosh", -2],
  [86.71, "whoosh", -2], [89.4, "paper", -4], [90.6, "tick", -3], [90.9, "paper", -4], [92.0, "tick", -3], [92.3, "ding", -2],
  [93.74, "whoosh", -2], [93.8, "paper", -4], [94.2, "paper", -3], [94.6, "pop", -3],
  [98.98, "whoosh", -2],
  [103.19, "whoosh", -2], [105.1, "slam", -2],
  [110.0, "whoosh", -2], [110.9, "pop", -3],
  [115.43, "whoosh", -2],
  [119.78, "whoosh", -2], [119.9, "paper", -4], [120.0, "pop", -3],
  [123.28, "whoosh", -2], [125.1, "write", -3], [126.1, "pop", -3],
  [130.6, "whoosh", -2],
  [135.25, "whoosh", -2], [135.5, "pop", -3],
  [140.6, "whoosh", -2], [141.0, "tick", -3], [141.3, "tick", -3], [141.6, "tick", -3], [144.6, "pop", -3],
  [148.22, "whoosh", -2],
  [153.12, "whoosh", -2], [153.5, "pop", -3], [155.5, "roll", -2],
  [157.42, "whoosh", -2], [158.4, "pop", -3],
  [164.24, "whoosh", -2],
  [169.8, "whoosh", -2], [170.0, "paper", -4], [173.6, "pop", -3],
  [174.76, "whoosh", -2], [175.0, "slam", -2],
];
