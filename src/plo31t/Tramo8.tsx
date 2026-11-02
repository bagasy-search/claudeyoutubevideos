import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, e, spr, extrude, Tag, DrawX, BigNum, Chips } from "./lib";

const W = 1920, H = 1080;

type Plan = { a: number; b: number; kind: "av" | "foto"; id?: string; push?: [number, number]; drift?: number };

const PL: Plan[] = [
  { a: 1440.91, b: 1445.57, kind: "av" },
  { a: 1445.57, b: 1449.05, kind: "foto", id: "t8_01", push: [0.5, 0.35], drift: -18 },
  { a: 1449.05, b: 1453.73, kind: "foto", id: "t8_02", push: [0.42, 0.3], drift: 14 },
  { a: 1453.73, b: 1459.83, kind: "foto", id: "t8_03", push: [0.55, 0.6], drift: -22 },
  { a: 1459.83, b: 1464.48, kind: "av" },
  { a: 1464.48, b: 1468.09, kind: "foto", id: "t8_04", push: [0.5, 0.4], drift: 16 },
  { a: 1468.09, b: 1475.25, kind: "foto", id: "t8_05", push: [0.5, 0.55], drift: -12 },
  { a: 1475.25, b: 1480.55, kind: "av" },
  { a: 1480.55, b: 1486.39, kind: "foto", id: "t8_06", push: [0.5, 0.45], drift: 10 },
  { a: 1486.39, b: 1491.88, kind: "foto", id: "t8_07", push: [0.55, 0.5], drift: -14 },
  { a: 1491.88, b: 1496.34, kind: "av" },
  { a: 1496.34, b: 1501.15, kind: "foto", id: "t8_08", push: [0.45, 0.5], drift: 12 },
  { a: 1501.15, b: 1508.91, kind: "foto", id: "t8_09", push: [0.5, 0.45], drift: -20 },
  { a: 1508.91, b: 1514.45, kind: "av" },
  { a: 1514.45, b: 1520.91, kind: "foto", id: "t8_11", push: [0.55, 0.55], drift: 14 },
  { a: 1520.91, b: 1524.95, kind: "foto", id: "t8_12", push: [0.5, 0.55], drift: -10 },
  { a: 1524.95, b: 1531.29, kind: "av" },
  { a: 1531.29, b: 1541.85, kind: "foto", id: "t8_14", push: [0.5, 0.4], drift: 16 },
  { a: 1541.85, b: 1547.02, kind: "av" },
  { a: 1547.02, b: 1555.31, kind: "foto", id: "t8_16", push: [0.5, 0.5], drift: -18 },
  { a: 1555.31, b: 1560.03, kind: "foto", id: "t8_17", push: [0.55, 0.55], drift: 12 },
  { a: 1560.03, b: 1565.06, kind: "av" },
  { a: 1565.06, b: 1575.73, kind: "foto", id: "t8_19", push: [0.5, 0.5], drift: -14 },
  { a: 1575.73, b: 1579.64, kind: "av" },
  { a: 1579.64, b: 1589.61, kind: "foto", id: "t8_21", push: [0.5, 0.45], drift: 18 },
  { a: 1589.61, b: 1592.75, kind: "foto", id: "t8_22", push: [0.5, 0.5], drift: -12 },
  { a: 1592.75, b: 1598.71, kind: "av" },
  { a: 1598.71, b: 1606.39, kind: "foto", id: "t8_23", push: [0.5, 0.5], drift: 14 },
  { a: 1606.39, b: 1610.26, kind: "foto", id: "t8_24", push: [0.55, 0.55], drift: -10 },
  { a: 1610.26, b: 1615.86, kind: "av" },
  { a: 1615.86, b: 1621.43, kind: "foto", id: "t8_25", push: [0.5, 0.5], drift: 12 },
  { a: 1621.43, b: 1625.59, kind: "foto", id: "t8_26", push: [0.5, 0.55], drift: -12 },
];

const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "overlay" }}>
    <svg width="100%" height="100%"><filter id="g8"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /></filter><rect width="100%" height="100%" filter="url(#g8)" /></svg>
  </AbsoluteFill>
);
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%)" }} />
);

const Foto: React.FC<{ t: number; p: Plan }> = ({ t, p }) => {
  const u = (t - p.a) / (p.b - p.a);
  const sc = 1.06 + 0.09 * u;
  const dx = (p.drift ?? 0) * u;
  const dy = -10 * u;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(`plo31t/img/plo31t_${p.id}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${dx}px,${dy}px)`, filter: "saturate(1.02) contrast(1.03)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,12,6,.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(12,8,4,.42) 100%)" }} />
    </AbsoluteFill>
  );
};

const Nota: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; x: number; y: number; rot?: number }> = ({ t, at, out, text, sub, x, y, rot = -3 }) => {
  if (t < at || t > out) return null;
  const k = spr(t, at, 0.9);
  const o = interpolate(t, [out - 0.35, out], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.7 + 0.3 * k})`, opacity: o, background: "#f4ecd8", padding: "22px 34px 26px", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45)", fontFamily: "Caveat, cursive", color: "#2a2118", textAlign: "center", maxWidth: 560 }}>
      <div style={{ fontSize: 58, lineHeight: 1.02, fontWeight: 700 }}>{text}</div>
      {sub && <div style={{ fontSize: 30, opacity: 0.7, marginTop: 6, fontFamily: FONT, letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};

const ErrCard: React.FC<{ t: number; at: number; out: number; n: number; text: string }> = ({ t, at, out, n, text }) => {
  if (t < at || t > out) return null;
  const k = spr(t, at, 0.85);
  const o = interpolate(t, [out - 0.35, out], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 120, top: 150, opacity: o, transform: `translateX(${(1 - k) * -60}px)`, display: "flex", alignItems: "center", gap: 26, background: "rgba(16,10,6,.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, padding: "20px 34px 20px 20px", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
      <div style={{ width: 108, height: 108, borderRadius: 14, background: "#d7261e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 74, color: "#fff", boxShadow: "0 8px 22px rgba(215,38,30,.5)" }}>{n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#fff", maxWidth: 720, lineHeight: 1.05, textShadow: extrude(4, "rgba(0,0,0,.5)") }}>{text}</div>
    </div>
  );
};

const Errores: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a || t > b) return null;
  const k = spr(t, a + 0.05, 0.9);
  const o = interpolate(t, [b - 0.4, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const items = ["1", "2", "3", "4", "5", "6"];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(10,6,3,.55)" }} />
      <div style={{ position: "absolute", left: 150, top: 220, transform: `scale(${0.9 + 0.1 * k})`, transformOrigin: "left top" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: "#fff", lineHeight: 0.94, letterSpacing: -3, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>LOS 6<br />ERRORES</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#ffd84a", marginTop: 18, letterSpacing: 1 }}>que más plata cuestan</div>
      </div>
      <div style={{ position: "absolute", right: 200, top: 250, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((n, i) => {
          const at = a + 0.5 + i * 0.55;
          if (t < at) return null;
          const kk = spr(t, at, 0.8);
          return (
            <div key={n} style={{ width: 96, height: 96, borderRadius: 12, background: "#d7261e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", transform: `scale(${kk})`, boxShadow: "0 10px 26px rgba(0,0,0,.5)" }}>{n}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Truco15: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a || t > b) return null;
  const k = spr(t, a + 0.1, 0.9);
  const o = interpolate(t, [b - 0.4, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 140, top: 300, transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: "left center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 300, lineHeight: 0.85, color: "#ffcf5a", textShadow: extrude(10, "rgba(120,70,10,.9)") }}>15</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: "#fff", marginTop: 10, letterSpacing: -1, textShadow: extrude(6, "rgba(0,0,0,.6)") }}>EL TRUCO DE<br />DON ERNESTO</div>
        <div style={{ marginTop: 22, width: 520, height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3 }}>
          <div style={{ width: `${e(t, a + 0.4, a + 1.6) * 100}%`, height: "100%", background: "#d7261e", borderRadius: 3 }} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#ffd84a", marginTop: 10, letterSpacing: 3 }}>EL ÚLTIMO</div>
      </div>
    </AbsoluteFill>
  );
};

const Anillo15: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a || t > b) return null;
  const p = e(t, a + 0.3, a + 2.2);
  const o = interpolate(t, [b - 0.4, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const R = 130, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", right: 160, top: 250, opacity: o, transform: `scale(${0.9 + 0.1 * spr(t, a + 0.2)})`, textAlign: "center" }}>
      <svg width={320} height={320}>
        <circle cx={160} cy={160} r={R} stroke="rgba(255,255,255,.18)" strokeWidth={16} fill="none" />
        <circle cx={160} cy={160} r={R} stroke="#ffd84a" strokeWidth={16} fill="none" strokeDasharray={C} strokeDashoffset={C * (1 - p)} strokeLinecap="round" transform="rotate(-90 160 160)" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 118, width: 320, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.6)") }}>15</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#ffd84a", letterSpacing: 3, marginTop: -18 }}>MINUTOS</div>
    </div>
  );
};

const Lupa: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a || t > b) return null;
  const u = e(t, a + 0.3, b - 0.4);
  const cx = 620 + 640 * u, cy = 520 + 90 * Math.sin(u * 3.1);
  const o = interpolate(t, [a, a + 0.4, b - 0.4, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: cx - 170, top: cy - 170, width: 340, height: 340, borderRadius: "50%", border: "6px solid rgba(255,255,255,.85)", boxShadow: "0 0 0 9999px rgba(0,0,0,.35), inset 0 0 60px rgba(255,255,255,.15)" }} />
    </AbsoluteFill>
  );
};

const Marca: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
  if (t < at || t > out) return null;
  const p = e(t, at, at + 0.7);
  const o = interpolate(t, [out - 0.3, out], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x, top: y, width: w * p, height: 16, background: "rgba(255,216,74,.55)", borderRadius: 8, opacity: o, transform: "rotate(-1.2deg)" }} />;
};

export const Tramo8: React.FC<{ t: number }> = ({ t }) => {
  const i = PL.findIndex((p) => t >= p.a && t < p.b);
  const cur = i >= 0 ? PL[i] : PL[PL.length - 1];
  const prev = i > 0 ? PL[i - 1] : null;
  const tr = prev && t < cur.a + 0.4 && cur.kind === "foto" && prev.kind === "foto" ? 1 - (t - cur.a) / 0.4 : 0;

  return (
    <AbsoluteFill style={{ background: "#0a0704" }}>
      {prev && tr > 0 && prev.kind === "foto" && <Foto t={t} p={prev} />}
      <AbsoluteFill style={{ opacity: 1 - tr, filter: tr > 0 ? `blur(${tr * 8}px)` : undefined }}>
        {cur.kind === "av" ? <Avatar t={t} /> : <Foto t={t} p={cur} />}
      </AbsoluteFill>

      {t >= 1449.05 && t < 1453.73 && (
        <Tag t={t} at={1449.9} out={1453.4} x={1180} y={430} dx={-90} dy={-120} text="AGUA CALIENTE ANTES" sub="menos gas esperando" col="#ffd84a" />
      )}
      <Nota t={t} at={1456.9} out={1459.6} text="UN HILITO" sub="LA NOCHE MÁS FRÍA" x={1420} y={760} rot={4} />
      {t >= 1468.09 && t < 1475.25 && <DrawX t={t} at={1473.4} x={780} y={330} w={360} h={300} />}
      <Errores t={t} a={1480.55} b={1486.39} />

      <ErrCard t={t} at={1486.5} out={1491.8} n={1} text="NO SABER DÓNDE ESTÁ LA LLAVE DE PASO" />
      {t >= 1486.39 && t < 1491.88 && <DrawX t={t} at={1489.6} x={980} y={420} w={300} h={260} />}
      <ErrCard t={t} at={1496.4} out={1501.1} n={2} text="TIRAR QUÍMICOS FUERTES AL DESAGÜE" />
      <ErrCard t={t} at={1501.2} out={1508.85} n={3} text="IR A LA FERRETERÍA SIN LA PIEZA VIEJA" />
      <ErrCard t={t} at={1514.5} out={1520.85} n={5} text="DEJAR LA MANGUERA CON PRESIÓN" />
      <ErrCard t={t} at={1520.95} out={1524.9} n={6} text="APRETAR DE MÁS" />

      <Truco15 t={t} a={1531.29} b={1541.85} />
      {t >= 1531.29 && t < 1541.85 && <BigNum t={t} at={1535.3} text="19" x={1480} y={560} size={220} col="#ffd84a" edge="rgba(120,70,10,.9)" out={1541.5} sub="AÑOS" />}
      {t >= 1547.02 && t < 1555.31 && <Chips t={t} at={1549.5} out={1555.1} y={560} items={["LLAVES", "INODOROS", "LAVADORA", "CALENTADOR"]} />}
      <Lupa t={t} a={1565.06} b={1575.73} />
      <Nota t={t} at={1568.4} out={1572.2} text="UNA GOTA CADA TANTO" sub="UN AÑO MÁS = MUEBLE PODRIDO" x={520} y={820} rot={-3} />
      <Anillo15 t={t} a={1579.64} b={1589.61} />
      <Nota t={t} at={1584.2} out={1588.9} text="CADA 3 MESES" sub="15 MIN · LUZ + TRAPO SECO" x={560} y={860} rot={3} />
      <Marca t={t} at={1599.6} out={1606.3} x={700} y={560} w={420} />
      {t >= 1615.86 && t < 1621.43 && (
        <>
          <Tag t={t} at={1617.2} out={1621.3} x={900} y={330} dx={-70} dy={-110} text="BURBUJAS" col="#ffd84a" />
          <Tag t={t} at={1618.5} out={1621.3} x={1120} y={560} dx={40} dy={-90} text="GRIETAS" col="#ffd84a" />
          <Tag t={t} at={1619.8} out={1621.3} x={1320} y={760} dx={80} dy={-60} text="ÓXIDO" col="#ff8a5a" />
        </>
      )}
      {t >= 1621.43 && t < 1625.59 && <Tag t={t} at={1623.6} out={1625.5} x={1180} y={640} dx={-80} dy={-100} text="CHARQUITO U ÓXIDO" col="#ff8a5a" />}

      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

export const SFX8: [number, string, number?][] = [
  [1445.57, "whoosh", -2],
  [1449.05, "whoosh", -3],
  [1449.9, "pop", -3],
  [1453.73, "whoosh", -3],
  [1456.9, "paper", -4],
  [1457.3, "k_gota", -6],
  [1459.83, "whoosh", -2],
  [1464.48, "whoosh", -3],
  [1468.09, "whoosh", -3],
  [1473.4, "write", -3],
  [1475.25, "whoosh", -2],
  [1480.55, "whoosh", -3],
  [1480.7, "slam", -2],
  [1481.2, "tick", -4],
  [1481.75, "tick", -4],
  [1482.3, "tick", -4],
  [1482.85, "tick", -4],
  [1483.4, "tick", -4],
  [1483.95, "tick", -4],
  [1486.39, "whoosh", -3],
  [1486.5, "fail", -3],
  [1489.6, "write", -3],
  [1491.88, "whoosh", -2],
  [1496.34, "whoosh", -3],
  [1496.4, "pop", -3],
  [1501.15, "whoosh", -3],
  [1501.2, "pop", -3],
  [1508.91, "whoosh", -2],
  [1514.45, "whoosh", -3],
  [1514.5, "pop", -3],
  [1520.91, "zoom", -3],
  [1520.95, "pop", -3],
  [1524.95, "whoosh", -2],
  [1531.29, "whoosh_big", -2],
  [1531.4, "slam", -2],
  [1535.3, "tick", -3],
  [1541.85, "whoosh", -2],
  [1547.02, "whoosh", -3],
  [1549.5, "click", -4],
  [1550.1, "click", -4],
  [1550.7, "click", -4],
  [1551.3, "click", -4],
  [1555.31, "whoosh", -3],
  [1560.03, "whoosh", -2],
  [1565.06, "whoosh", -3],
  [1568.4, "paper", -4],
  [1569.2, "k_gota", -6],
  [1571.0, "k_gota", -7],
  [1575.73, "whoosh", -2],
  [1579.64, "whoosh", -3],
  [1580.0, "tick", -4],
  [1584.2, "paper", -4],
  [1589.61, "whoosh", -3],
  [1592.75, "whoosh", -2],
  [1598.71, "whoosh", -3],
  [1599.6, "write", -4],
  [1602.0, "cloth", -6],
  [1606.39, "whoosh", -3],
  [1610.26, "whoosh", -2],
  [1615.86, "whoosh", -3],
  [1617.2, "pop", -3],
  [1618.5, "pop", -3],
  [1619.8, "pop", -3],
  [1621.43, "whoosh", -3],
  [1623.6, "pop", -3],
];
