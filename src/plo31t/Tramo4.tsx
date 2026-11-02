import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar } from "./base";
import { FONT, COL, e, ei, spr, extrude, Tag, Card3D, DrawX, BigNum } from "./lib";

const W = 1920, H = 1080;

const Photo: React.FC<{ slug: string; a: number; b: number; t: number; zoom?: number; dx?: number; dy?: number }> = ({ slug, a, b, t, zoom = 0.06, dx = 0, dy = 0 }) => {
  const p = e(t, a, b);
  const sc = 1.03 + zoom * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0f14" }}>
      <Img src={staticFile(`plo31t/img/${slug}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${dx * p}px, ${dy * p}px)` }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.42) 100%)", mixBlendMode: "multiply" }} />
);

const Note: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number; col?: string; size?: number }> = ({ t, at, out, text, x, y, rot = -3, col = "#f4ecd8", size = 44 }) => {
  const k = spr(t, at);
  const o = 1 - e(t, out, out + 0.35);
  if (t < at - 0.05 || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.7 + 0.3 * k})`, opacity: o, background: col, padding: "18px 30px", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45)", fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: size, color: "#2a1a10", maxWidth: 520, textAlign: "center", lineHeight: 1.05 }}>{text}</div>
  );
};

const Arrow: React.FC<{ t: number; at: number; x1: number; y1: number; x2: number; y2: number; col?: string }> = ({ t, at, x1, y1, x2, y2, col = "#d7261e" }) => {
  const p = e(t, at, at + 0.45);
  if (p <= 0.01) return null;
  const cx = x1 + (x2 - x1) * p, cy = y1 + (y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <line x1={x1} y1={y1} x2={cx} y2={cy} stroke={col} strokeWidth={9} strokeLinecap="round" opacity={0.92} />
      {p > 0.9 && <polygon points={`0,-16 26,0 0,16`} fill={col} transform={`translate(${x2},${y2}) rotate(${ang})`} opacity={0.92} />}
    </svg>
  );
};

const Ring: React.FC<{ t: number; at: number; x: number; y: number; r: number; dur?: number; col?: string }> = ({ t, at, x, y, r, dur = 0.5, col = "#d7261e" }) => {
  const p = e(t, at, at + dur);
  if (p <= 0.01) return null;
  const c = 2 * Math.PI * r;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={col} strokeWidth={9} strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="round" transform={`rotate(-90 ${x} ${y})`} opacity={0.92} />
    </svg>
  );
};

const Lupa: React.FC<{ t: number; a: number; b: number; slug: string; x0: number; y0: number; x1: number; y1: number; r?: number }> = ({ t, a, b, slug, x0, y0, x1, y1, r = 260 }) => {
  const p = ei(t, a, b);
  const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p;
  const sc = 1.9;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 10px rgba(244,236,216,.9), 0 24px 60px rgba(0,0,0,.55)", border: "3px solid rgba(0,0,0,.25)" }}>
      <Img src={staticFile(`plo31t/img/${slug}.jpg`)} style={{ position: "absolute", width: W * sc, height: H * sc, left: -(x * sc) + r, top: -(y * sc) + r, objectFit: "cover" }} />
    </div>
  );
};

const ContadorLitros: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = e(t, a + 0.2, b - 0.3);
  const n = Math.round(10000 * k);
  const o = 1 - e(t, b - 0.4, b);
  if (t < a || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", right: 130, top: 230, opacity: o, transform: `translateY(${(1 - spr(t, a)) * 40}px)`, textAlign: "right" }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: ".28em", color: COL.ice2, textShadow: "0 2px 10px rgba(0,0,0,.7)" }}>UNA GOTA POR SEGUNDO</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 0.95, color: "#fff", textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{n.toLocaleString("es-AR")}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: "#ffd84a", textShadow: "0 3px 12px rgba(0,0,0,.7)" }}>LITROS AL MES</div>
    </div>
  );
};

const Recibo: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = spr(t, a);
  const out = 1 - e(t, b - 0.4, b);
  if (t < a - 0.05 || out <= 0.01) return null;
  const l1 = e(t, a + 0.5, a + 0.9), l2 = e(t, a + 1.0, a + 1.4), l3 = e(t, a + 1.6, a + 2.0);
  return (
    <div style={{ position: "absolute", left: 1180, top: 200, width: 560, transform: `translateY(${(1 - k) * 60}px) rotate(${2 - 2 * k}deg)`, opacity: out, background: "#f4ecd8", borderRadius: 4, padding: "34px 40px 44px", boxShadow: "0 30px 70px rgba(0,0,0,.55)", fontFamily: FONT, color: "#2a1a10" }}>
      <div style={{ fontSize: 26, letterSpacing: ".22em", fontWeight: 700, opacity: 0.6 }}>FERRETERÍA</div>
      <div style={{ height: 2, background: "rgba(0,0,0,.2)", margin: "14px 0 20px" }} />
      <div style={{ fontSize: 40, fontWeight: 800, opacity: l1 }}>Destapador de pelos</div>
      <div style={{ fontSize: 96, fontWeight: 900, color: "#1f6b3a", opacity: l2 }}>$20–30</div>
      <div style={{ fontSize: 26, fontWeight: 700, opacity: l2 * 0.7 }}>MXN · una vez</div>
      <div style={{ height: 2, background: "rgba(0,0,0,.2)", margin: "22px 0 16px" }} />
      <div style={{ position: "relative", fontSize: 34, fontWeight: 700, opacity: l3 * 0.7 }}>Químicos: $80–150
        <div style={{ position: "absolute", left: 0, top: "52%", height: 5, width: `${e(t, a + 2.0, a + 2.4) * 100}%`, background: "#d7261e", borderRadius: 3 }} />
      </div>
    </div>
  );
};

// Tarjeta de papel crema 3D (para no repetir la foto del fondo)
const TarjetaPapel: React.FC<{ t: number; at: number; out: number; titulo: string; sub?: string; x: number; y: number; ry?: number }> = ({ t, at, out, titulo, sub, x, y, ry = -12 }) => {
  const k = spr(t, at);
  const o = 1 - e(t, out, out + 0.35);
  if (t < at - 0.05 || o <= 0.01) return null;
  const tilt = ry * (1 - Math.min(1, k));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${tilt}deg) rotateX(5deg) scale(${0.86 + 0.14 * k})`, opacity: o }}>
      <div style={{ width: 620, background: "#f4ecd8", borderRadius: 8, padding: "46px 54px 50px", boxShadow: "0 34px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(0,0,0,.06)", fontFamily: FONT, color: "#2a1a10", textAlign: "center" }}>
        <div style={{ fontSize: 24, letterSpacing: ".3em", fontWeight: 700, opacity: 0.55 }}>REEMPLAZO</div>
        <div style={{ height: 3, background: "rgba(0,0,0,.18)", margin: "18px 0 22px" }} />
        <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1.02 }}>{titulo}</div>
        {sub && <div style={{ fontSize: 30, fontWeight: 700, marginTop: 16, opacity: 0.7 }}>{sub}</div>}
        <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
          <svg width={92} height={92} viewBox="0 0 92 92">
            <circle cx={46} cy={46} r={40} fill="none" stroke="#1f6b3a" strokeWidth={7} opacity={0.9} />
            <polyline points="26,48 41,63 68,32" fill="none" stroke="#1f6b3a" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - e(t, at + 0.35, at + 0.75))} />
          </svg>
        </div>
      </div>
    </div>
  );
};

type Plan = { a: number; b: number; el: (t: number) => React.ReactNode };

export const Tramo4: React.FC<{ t: number }> = ({ t }) => {
  const avatar = (a: number, b: number) => (tt: number) => <Avatar t={tt} />;

  const planes: Plan[] = [
    { a: 722.13, b: 725.89, el: avatar(722.13, 725.89) },
    { a: 725.89, b: 730.60, el: (tt) => (<>
      <Photo slug="plo31t_t4_01" a={725.89} b={730.60} t={tt} zoom={0.09} dy={-14} />
      <Tag t={tt} at={726.5} x={980} y={560} text="LA TIRA" sub="larga y finita" out={730.2} />
    </>) },
    { a: 730.60, b: 735.11, el: (tt) => (<>
      <Photo slug="plo31t_t4_02" a={730.60} b={735.11} t={tt} zoom={0.07} dx={-22} />
      <Tag t={tt} at={731.2} x={620} y={330} text="EN LA FERRETERÍA" sub="destapador de pelos" out={734.8} />
    </>) },
    { a: 735.11, b: 736.83, el: (tt) => (<>
      <Photo slug="plo31t_t4_03" a={735.11} b={736.83} t={tt} zoom={0.05} />
      <Recibo t={tt} a={735.4} b={736.83} />
    </>) },
    { a: 736.83, b: 742.52, el: avatar(736.83, 742.52) },
    { a: 742.52, b: 747.30, el: (tt) => (<>
      <Photo slug="plo31t_t4_04" a={742.52} b={747.30} t={tt} zoom={0.08} dy={16} />
      <Arrow t={tt} at={743.4} x1={1160} y1={300} x2={980} y2={600} />
      <Note t={tt} at={744.2} out={747.1} text="despacito" x={1480} y={330} rot={4} />
    </>) },
    { a: 747.30, b: 752.60, el: (tt) => (<>
      <Photo slug="plo31t_t4_05" a={747.30} b={752.60} t={tt} zoom={0.1} dy={-10} />
      <Ring t={tt} at={752.0} x={960} y={520} r={300} dur={0.55} />
      <Note t={tt} at={752.2} out={752.6} text="eso sale" x={1420} y={780} rot={-4} col="#ffd84a" />
    </>) },
    { a: 752.60, b: 755.09, el: (tt) => (<>
      <Photo slug="plo31t_t4_06" a={752.60} b={755.09} t={tt} zoom={0.06} dx={18} />
      <DrawX t={tt} at={755.0} x={1240} y={420} w={260} h={260} />
      <Note t={tt} at={754.0} out={755.0} text="nunca al inodoro" x={560} y={260} rot={-3} />
    </>) },
    { a: 755.09, b: 760.23, el: avatar(755.09, 760.23) },
    { a: 760.23, b: 763.45, el: (tt) => (<>
      <Photo slug="plo31t_t4_07" a={760.23} b={763.45} t={tt} zoom={0.08} dy={-12} />
      <Tag t={tt} at={761.7} x={1360} y={360} text="UN MINUTO" sub="agua caliente" out={763.2} />
    </>) },
    { a: 763.45, b: 767.51, el: (tt) => (<>
      <Photo slug="plo31t_t4_08" a={763.45} b={767.51} t={tt} zoom={0.04} />
      <Card3D id="t4_08" x={960} y={540} w={880} h={560} ry={-14} rx={6} z={0} o={1} label="MALLITA FINA" from={763.8} at={764.0} />
    </>) },
    { a: 767.51, b: 771.72, el: (tt) => (<>
      <Photo slug="plo31t_t4_09" a={767.51} b={771.72} t={tt} zoom={0.05} />
      <Lupa t={tt} a={768.2} b={771.4} slug="plo31t_t4_09" x0={700} y0={420} x1={1180} y1={620} />
      <Note t={tt} at={770.2} out={771.6} text="atrapa el pelo" x={520} y={820} rot={-2} />
    </>) },
    { a: 771.72, b: 777.11, el: avatar(771.72, 777.11) },
    { a: 777.11, b: 780.60, el: (tt) => (<>
      <Photo slug="plo31t_t4_10" a={777.11} b={780.60} t={tt} zoom={0.07} dy={-10} />
      <BigNum t={tt} at={778.0} text="8" x={520} y={520} size={420} col="#ffd84a" edge="#7a4a00" out={780.4} />
      <Tag t={tt} at={778.4} x={1180} y={520} text="EL NIVEL DEL TANQUE" out={780.4} size={54} />
    </>) },
    { a: 780.60, b: 786.95, el: (tt) => (<>
      <Photo slug="plo31t_t4_11" a={780.60} b={786.95} t={tt} zoom={0.08} dy={12} />
      <Tag t={tt} at={784.8} x={980} y={380} text="SIGUE CORRIENDO" sub="después de llenar" out={786.7} />
    </>) },
    { a: 786.95, b: 790.86, el: avatar(786.95, 790.86) },
    { a: 790.86, b: 795.95, el: (tt) => (<>
      <Photo slug="plo31t_t4_12" a={790.86} b={795.95} t={tt} zoom={0.09} dy={-14} />
      <Note t={tt} at={794.4} out={795.8} text="nivel muy alto" x={1380} y={760} rot={3} col="#ffd84a" />
      <Arrow t={tt} at={794.6} x1={1420} y1={640} x2={1120} y2={480} />
    </>) },
    { a: 795.95, b: 803.88, el: (tt) => (<>
      <Photo slug="plo31t_t4_13" a={795.95} b={803.88} t={tt} zoom={0.08} dx={-16} />
      <Tag t={tt} at={797.6} x={1180} y={400} text="EL REBOSADERO" sub="tubo vertical" out={803.6} />
      <Arrow t={tt} at={798.0} x1={1440} y1={300} x2={1180} y2={520} />
    </>) },
    { a: 803.88, b: 809.50, el: avatar(803.88, 809.50) },
    { a: 809.50, b: 815.75, el: (tt) => (<>
      <Photo slug="plo31t_t4_14" a={809.50} b={815.75} t={tt} zoom={0.07} dy={-8} />
      <div style={{ position: "absolute", left: 1290, top: 300, height: 380, width: 4, background: "repeating-linear-gradient(#ffd84a 0 14px, transparent 14px 26px)", opacity: e(tt, 811.6, 812.0) }} />
      <Note t={tt} at={811.9} out={815.6} text="2 cm · un dedo" x={1520} y={470} rot={2} col="#ffd84a" />
      <Tag t={tt} at={813.4} x={1000} y={760} text="NIVEL CORRECTO" out={815.6} />
    </>) },
    { a: 815.75, b: 821.25, el: (tt) => (<>
      <Photo slug="plo31t_t4_15" a={815.75} b={821.25} t={tt} zoom={0.06} dx={20} />
      <Lupa t={tt} a={816.8} b={820.9} slug="plo31t_t4_15" x0={800} y0={400} x1={1120} y1={620} r={240} />
      <Tag t={tt} at={819.6} x={560} y={800} text="NIVEL DE AGUA" out={821.1} />
    </>) },
    { a: 821.25, b: 825.88, el: avatar(821.25, 825.88) },
    { a: 825.88, b: 831.50, el: (tt) => (<>
      <Photo slug="plo31t_t4_16" a={825.88} b={831.50} t={tt} zoom={0.08} dy={10} />
      <Arrow t={tt} at={828.2} x1={1420} y1={300} x2={1120} y2={560} />
      <Note t={tt} at={828.6} out={831.3} text="doblas la varilla" x={520} y={280} rot={-3} />
    </>) },
    { a: 831.50, b: 835.87, el: (tt) => (<>
      <Photo slug="plo31t_t4_17" a={831.50} b={835.87} t={tt} zoom={0.04} />
      <Card3D id="t4_17" x={960} y={540} w={860} h={540} ry={12} rx={5} z={0} o={1} label="FLOTADOR NUEVO" from={832.0} at={832.2} />
    </>) },
    { a: 835.87, b: 840.70, el: avatar(835.87, 840.70) },
    { a: 840.70, b: 846.53, el: (tt) => (<>
      <Photo slug="plo31t_t4_18" a={840.70} b={846.53} t={tt} zoom={0.09} dx={-18} />
      <Ring t={tt} at={842.6} x={1080} y={480} r={200} dur={0.5} />
      <Note t={tt} at={843.0} out={846.3} text="un poquito" x={1480} y={780} rot={3} />
    </>) },
    { a: 846.53, b: 853.46, el: (tt) => (<>
      <Photo slug="plo31t_t4_19" a={846.53} b={853.46} t={tt} zoom={0.08} dy={-10} />
      <Tag t={tt} at={848.0} x={1240} y={420} text="UN DEDO" sub="por debajo" out={853.2} />
    </>) },
    { a: 853.46, b: 857.66, el: avatar(853.46, 857.66) },
    { a: 857.66, b: 865.59, el: (tt) => (<>
      <Photo slug="plo31t_t4_20" a={857.66} b={865.59} t={tt} zoom={0.07} dx={14} />
      <Note t={tt} at={858.4} out={865.3} text="válvula gastada" x={560} y={300} rot={-3} />
      <DrawX t={tt} at={864.4} x={1240} y={620} w={240} h={240} />
    </>) },
    { a: 865.59, b: 870.30, el: (tt) => (<>
      <Photo slug="plo31t_t4_21" a={865.59} b={870.30} t={tt} zoom={0.07} dy={-10} />
      <BigNum t={tt} at={866.5} text="9" x={430} y={520} size={360} col="#ffd84a" edge="#7a4a00" out={870.1} />
      <Tag t={tt} at={866.9} x={1330} y={520} text="LA LLAVE QUE GOTEA" out={870.1} size={48} />
    </>) },
    { a: 870.30, b: 874.78, el: avatar(870.30, 874.78) },
    { a: 874.78, b: 879.59, el: (tt) => (<>
      <Photo slug="plo31t_t4_22" a={874.78} b={879.59} t={tt} zoom={0.1} dy={-12} />
      {[0, 1, 2].map(i => {
        const at = 875.2 + i * 0.9;
        const k = e(tt, at, at + 0.5);
        if (tt < at) return null;
        return <div key={i} style={{ position: "absolute", left: 1000, top: 480 + k * 220, opacity: 1 - k, fontFamily: "Caveat, cursive", fontSize: 64, fontWeight: 700, color: "#8fd6ff", textShadow: "0 3px 12px rgba(0,0,0,.8)" }}>gota</div>;
      })}
    </>) },
    { a: 879.59, b: 883.07, el: (tt) => (<>
      <Photo slug="plo31t_t4_23" a={879.59} b={883.07} t={tt} zoom={0.06} dx={-14} />
      <ContadorLitros t={tt} a={880.2} b={883.07} />
    </>) },
    { a: 883.07, b: 887.17, el: (tt) => (<>
      <Photo slug="plo31t_t4_24" a={883.07} b={887.17} t={tt} zoom={0.04} />
      <TarjetaPapel t={tt} at={883.8} out={887.0} titulo="LLAVE NUEVA" sub="sin goteo" x={960} y={540} ry={-12} />
      <Note t={tt} at={885.0} out={887.0} text="cara" x={1480} y={300} rot={4} col="#ffd84a" />
    </>) },
    { a: 887.17, b: 891.72, el: avatar(887.17, 891.72) },
    { a: 891.72, b: 895.23, el: (tt) => (<>
      <Photo slug="plo31t_t4_25" a={891.72} b={895.23} t={tt} zoom={0.09} dy={-10} />
      <Ring t={tt} at={893.4} x={1060} y={560} r={180} dur={0.5} />
      <Tag t={tt} at={893.8} x={1440} y={360} text="LA GOMITA" out={895.0} />
    </>) },
    { a: 895.23, b: 901.61, el: (tt) => (<>
      <Photo slug="plo31t_t4_26" a={895.23} b={901.61} t={tt} zoom={0.08} dx={16} />
      <Lupa t={tt} a={896.6} b={901.2} slug="plo31t_t4_26" x0={760} y0={420} x1={1080} y1={600} r={250} />
      <Ring t={tt} at={896.6} x={1330} y={390} r={150} dur={0.5} />
      <Note t={tt} at={898.0} out={901.4} text="se gasta" x={520} y={820} rot={-3} />
    </>) },
    { a: 901.61, b: 904.03, el: (tt) => (<>
      <Photo slug="plo31t_t4_27" a={901.61} b={904.03} t={tt} zoom={0.08} dy={-8} />
      <Ring t={tt} at={902.6} x={1120} y={520} r={200} dur={0.45} />
      <Note t={tt} at={902.9} out={904.0} text="cerrás acá" x={520} y={300} rot={-2} />
    </>) },
  ];

  const idx = planes.findIndex(p => t >= p.a && t < p.b);
  const cur = planes[idx < 0 ? planes.length - 1 : idx];
  const prev = idx > 0 ? planes[idx - 1] : null;
  const trans = 0.4;
  const inTr = t - cur.a < trans && prev;

  return (
    <AbsoluteFill style={{ background: "#0b0f14" }}>
      {inTr && prev && (
        <AbsoluteFill style={{ opacity: 1 - e(t, cur.a, cur.a + trans) }}>{prev.el(t)}</AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: inTr ? e(t, cur.a, cur.a + trans) : 1 }}>{cur.el(t)}</AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

export const SFX4: [number, string, number?][] = [
  [725.89, "whoosh"],
  [726.50, "pop", -2],
  [730.60, "swish"],
  [731.20, "pop", -3],
  [735.11, "whoosh"],
  [735.40, "paper"],
  [736.83, "whoosh", -3],
  [742.52, "whoosh"],
  [743.40, "write", -3],
  [744.20, "pop", -4],
  [747.30, "whoosh"],
  [752.00, "write", -3],
  [752.20, "pop", -3],
  [752.60, "swish"],
  [754.00, "pop", -4],
  [755.00, "fail", -3],
  [755.09, "whoosh", -3],
  [760.23, "whoosh"],
  [761.70, "pop", -2],
  [763.45, "whoosh"],
  [764.00, "pop", -2],
  [767.51, "swish"],
  [768.20, "whoosh", -4],
  [770.20, "pop", -3],
  [771.72, "whoosh", -3],
  [777.11, "whoosh"],
  [778.00, "slam", -1],
  [778.40, "pop", -2],
  [780.60, "swish"],
  [784.80, "pop", -3],
  [786.95, "whoosh", -3],
  [790.86, "whoosh"],
  [794.40, "pop", -2],
  [794.60, "write", -4],
  [795.95, "swish"],
  [797.60, "pop", -2],
  [798.00, "write", -3],
  [803.88, "whoosh", -3],
  [809.50, "whoosh"],
  [811.90, "pop", -2],
  [813.40, "pop", -3],
  [815.75, "swish"],
  [816.80, "whoosh", -4],
  [819.60, "pop", -3],
  [821.25, "whoosh", -3],
  [825.88, "whoosh"],
  [828.20, "write", -3],
  [828.60, "pop", -4],
  [831.50, "whoosh"],
  [832.20, "pop", -2],
  [835.87, "whoosh", -3],
  [840.70, "whoosh"],
  [842.60, "write", -3],
  [843.00, "pop", -4],
  [846.53, "swish"],
  [848.00, "pop", -2],
  [853.46, "whoosh", -3],
  [857.66, "whoosh"],
  [858.40, "pop", -3],
  [864.40, "fail", -2],
  [865.59, "whoosh"],
  [866.50, "slam", -1],
  [866.90, "pop", -2],
  [870.30, "whoosh", -3],
  [874.78, "whoosh"],
  [875.20, "k_gota", -6],
  [876.10, "k_gota", -6],
  [877.00, "k_gota", -6],
  [879.59, "swish"],
  [880.20, "roll", -2],
  [883.07, "whoosh"],
  [883.80, "pop", -2],
  [885.00, "pop", -4],
  [887.17, "whoosh", -3],
  [891.72, "whoosh"],
  [893.40, "write", -3],
  [893.80, "pop", -2],
  [895.23, "swish"],
  [896.60, "whoosh", -4],
  [898.00, "pop", -3],
  [901.61, "whoosh"],
  [902.60, "write", -3],
  [902.90, "pop", -4],
];
