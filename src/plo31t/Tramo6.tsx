import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, e, ei, spr, extrude, Tag, BigNum, DrawX } from "./lib";

type Plano = { a: number; b: number; tipo: "avatar" | "foto"; id?: string; mov?: number };

const PLANOS: Plano[] = [
  { a: 1083.97, b: 1090.02, tipo: "avatar" },
  { a: 1090.10, b: 1096.60, tipo: "foto", id: "t6_01", mov: 0 },
  { a: 1096.60, b: 1099.99, tipo: "foto", id: "t6_02", mov: 1 },
  { a: 1099.99, b: 1104.83, tipo: "avatar" },
  { a: 1104.83, b: 1110.60, tipo: "foto", id: "t6_03", mov: 2 },
  { a: 1110.60, b: 1116.82, tipo: "foto", id: "t6_04", mov: 3 },
  { a: 1116.82, b: 1120.55, tipo: "avatar" },
  { a: 1120.55, b: 1125.60, tipo: "foto", id: "t6_05", mov: 4 },
  { a: 1125.60, b: 1131.35, tipo: "foto", id: "t6_06", mov: 5 },
  { a: 1131.35, b: 1136.95, tipo: "avatar" },
  { a: 1136.95, b: 1140.90, tipo: "foto", id: "t6_07", mov: 6 },
  { a: 1140.90, b: 1146.90, tipo: "foto", id: "t6_08", mov: 7 },
  { a: 1146.90, b: 1150.65, tipo: "foto", id: "t6_09", mov: 8 },
  { a: 1150.65, b: 1154.11, tipo: "avatar" },
  { a: 1154.11, b: 1160.00, tipo: "foto", id: "t6_10", mov: 9 },
  { a: 1160.00, b: 1165.79, tipo: "foto", id: "t6_11", mov: 0 },
  { a: 1165.79, b: 1170.79, tipo: "avatar" },
  { a: 1170.79, b: 1176.40, tipo: "foto", id: "t6_12", mov: 1 },
  { a: 1176.40, b: 1180.54, tipo: "foto", id: "t6_13", mov: 2 },
  { a: 1180.54, b: 1184.77, tipo: "avatar" },
  { a: 1184.77, b: 1190.44, tipo: "foto", id: "t6_14", mov: 3 },
  { a: 1190.44, b: 1197.46, tipo: "foto", id: "t6_15", mov: 4 },
  { a: 1197.46, b: 1201.37, tipo: "avatar" },
  { a: 1201.37, b: 1204.04, tipo: "foto", id: "t6_16", mov: 5 },
  { a: 1204.04, b: 1212.43, tipo: "foto", id: "t6_17", mov: 6 },
  { a: 1212.43, b: 1216.70, tipo: "avatar" },
  { a: 1216.70, b: 1222.70, tipo: "foto", id: "t6_18", mov: 7 },
  { a: 1222.70, b: 1226.31, tipo: "foto", id: "t6_19", mov: 8 },
  { a: 1226.31, b: 1230.91, tipo: "avatar" },
  { a: 1230.91, b: 1237.54, tipo: "foto", id: "t6_20", mov: 9 },
  { a: 1237.54, b: 1244.10, tipo: "foto", id: "t6_21", mov: 0 },
  { a: 1244.10, b: 1248.37, tipo: "avatar" },
  { a: 1248.37, b: 1256.58, tipo: "foto", id: "t6_22", mov: 1 },
  { a: 1256.58, b: 1260.56, tipo: "foto", id: "t6_23", mov: 2 },
];

const Foto: React.FC<{ id: string; t: number; a: number; b: number; mov: number }> = ({ id, t, a, b, mov }) => {
  const p = ei(t, a, b);
  const sc = 1.05 + 0.08 * p;
  const dx = (mov % 3 === 0 ? -1 : mov % 3 === 1 ? 1 : 0) * (12 + 20 * p);
  const dy = (mov % 2 === 0 ? -1 : 1) * (8 + 12 * p);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(`plo31t/img/plo31t_${id}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${dx}px,${dy}px)` }}
      />
    </AbsoluteFill>
  );
};

const Vineta: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
);

const CartelLleno: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = Math.min(1.06, spr(t, a + 0.5, 0.9));
  const o = e(t, a + 0.4, a + 0.8) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "#f4ecd8", border: "6px solid #d7261e", borderRadius: 14, padding: "26px 46px", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: "#b32017", lineHeight: 1.05 }}>PRIMERO LLENO,</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: "#1a1a1a", lineHeight: 1.05 }}>DESPUÉS FUEGO</div>
      </div>
    </div>
  );
};

const Portada: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = spr(t, a + 0.3, 0.85);
  const o = e(t, a + 0.2, a + 0.6) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const ry = interpolate(t, [a, b], [-14, -4]);
  const rz = interpolate(t, [a, b], [-4, 1]);
  return (
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${0.7 + 0.3 * k})`, opacity: o }}>
      <Img src={staticFile("plo31t/libro/cover50.jpg")} style={{ width: 460, borderRadius: 8, boxShadow: "0 40px 80px rgba(0,0,0,.6)", border: "8px solid #fff" }} />
    </div>
  );
};

const Lista50: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const items = ["LLAVE QUE GOTEA", "INODORO QUE CORRE", "CALENTADOR", "MANGUERA LAVADORA", "LLAVE DE PASO"];
  return (
    <div style={{ position: "absolute", left: 90, top: 200, width: 640 }}>
      {items.map((it, i) => {
        const at = a + 0.5 + i * 0.55;
        const k = Math.min(1.04, spr(t, at, 0.9));
        const o = e(t, at, at + 0.3) * (1 - e(t, b - 0.35, b - 0.05));
        if (o <= 0.01) return null;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18, transform: `translateX(${(1 - k) * -60}px)`, opacity: o }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: "#d7261e", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#fff", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};

const Paginas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = spr(t, a + 0.4, 0.85);
  const o = e(t, a + 0.3, a + 0.7) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const ry = interpolate(t, [a, b], [10, -6]);
  return (
    <>
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) perspective(1500px) rotateY(${ry}deg) scale(${0.8 + 0.2 * k})`, opacity: o }}>
        <Img src={staticFile("plo31t/libro/pag_e1.jpg")} style={{ width: 420, borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.6)", border: "6px solid #fff", marginRight: -120, transform: "rotate(-3deg)" }} />
        <Img src={staticFile("plo31t/libro/pag_e2.jpg")} style={{ width: 420, borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.6)", border: "6px solid #fff", transform: "translateX(-40px) rotate(4deg)" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 900, transform: "translate(-50%,-50%)", opacity: e(t, a + 1.2, a + 1.6), fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd84a", textShadow: extrude(4, "rgba(0,0,0,.7)"), letterSpacing: "0.04em" }}>
        LINK EN LA DESCRIPCIÓN
      </div>
    </>
  );
};

const Truco: React.FC<{ t: number; a: number; b: number; num: string; sub: string }> = ({ t, a, b, num, sub }) => {
  const o = e(t, a + 0.2, a + 0.6) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 300, transform: "translate(-50%,-50%)", textAlign: "center", opacity: o }}>
      <BigNum t={t} at={a + 0.3} text={num} x={960} y={300} size={220} col="#ffd84a" edge="#b32017" out={b - 0.4} />
      <div style={{ position: "absolute", left: "50%", top: 230, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{sub}</div>
    </div>
  );
};

const Circulo: React.FC<{ t: number; a: number; b: number; x: number; y: number; r: number }> = ({ t, a, b, x, y, r }) => {
  const p = e(t, a, a + 0.6);
  const o = e(t, a, a + 0.2) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const circ = 2 * Math.PI * r;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o, pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#d7261e" strokeWidth={7} strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} strokeLinecap="round" transform={`rotate(-90 ${x} ${y})`} />
    </svg>
  );
};

const Nota: React.FC<{ t: number; a: number; b: number; text: string; x: number; y: number; rot?: number }> = ({ t, a, b, text, x, y, rot = -3 }) => {
  const k = Math.min(1.05, spr(t, a, 0.9));
  const o = e(t, a, a + 0.3) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.7 + 0.3 * k})`, opacity: o, background: "#f4ecd8", padding: "18px 30px", borderRadius: 6, boxShadow: "0 20px 45px rgba(0,0,0,.5)", fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 52, color: "#1a1a1a", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

const Contador: React.FC<{ t: number; a: number; b: number; n: number; label: string }> = ({ t, a, b, n, label }) => {
  const k = Math.min(1.06, spr(t, a, 0.9));
  const o = e(t, a, a + 0.3) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const v = Math.round(n * e(t, a, a + 1.2));
  return (
    <div style={{ position: "absolute", left: 1500, top: 460, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#fff", lineHeight: 1, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{v}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#ffd84a", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
};

const Chips: React.FC<{ t: number; a: number; b: number; items: string[] }> = ({ t, a, b, items }) => (
  <div style={{ position: "absolute", left: 960, top: 880, transform: "translate(-50%,-50%)", display: "flex", gap: 22 }}>
    {items.map((it, i) => {
      const at = a + 0.4 + i * 0.5;
      const k = Math.min(1.04, spr(t, at, 0.9));
      const o = e(t, at, at + 0.3) * (1 - e(t, b - 0.4, b - 0.05));
      if (o <= 0.01) return null;
      return (
        <div key={i} style={{ transform: `translateY(${(1 - k) * 40}px) scale(${k})`, opacity: o, background: "rgba(20,20,24,.82)", border: "2px solid rgba(255,216,74,.6)", borderRadius: 40, padding: "14px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
          {it}
        </div>
      );
    })}
  </div>
);

const Compara: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const o = e(t, a + 0.4, a + 0.9) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, a + 0.5, 0.9));
  return (
    <div style={{ position: "absolute", left: 960, top: 880, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, display: "flex", gap: 40 }}>
      <div style={{ background: "rgba(215,38,30,.9)", borderRadius: 12, padding: "14px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff" }}>ESTIRADA ✕</div>
      <div style={{ background: "rgba(40,150,70,.92)", borderRadius: 12, padding: "14px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff" }}>COMPRIMIDA ✓</div>
    </div>
  );
};

// Número "11" del truco de la silicona: se monta como pieza propia, centrada y con
// ancho acotado para que nunca se corte contra el borde derecho de la pantalla.
const NumTruco11: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const o = e(t, a + 0.2, a + 0.6) * (1 - e(t, b - 0.4, b - 0.05));
  if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, a + 0.3, 0.9));
  const rz = interpolate(t, [a, b], [-6, 2]);
  return (
    <div style={{ position: "absolute", left: 960, top: 300, width: 1000, transform: `translate(-50%,-50%) scale(${k}) rotate(${rz}deg)`, opacity: o, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 220, lineHeight: 1, color: "#ffd84a", textShadow: extrude(8, "#b32017"), letterSpacing: "0.02em", whiteSpace: "nowrap" }}>11</div>
    </div>
  );
};

const renderPlano = (p: Plano, tt: number, isCur: boolean) => {
  if (p.tipo === "avatar") return <AbsoluteFill><Avatar t={tt} /></AbsoluteFill>;
  const id = p.id as string;
  const mov = p.mov ?? 0;
  const a = p.a, b = p.b;
  return (
    <AbsoluteFill>
      <Foto id={id} t={tt} a={a} b={b} mov={mov} />
      <Vineta />
      {isCur && id === "t6_01" && <CartelLleno t={tt} a={a} b={b} />}
      {isCur && id === "t6_02" && <Portada t={tt} a={a} b={b} />}
      {isCur && id === "t6_03" && <Lista50 t={tt} a={a} b={b} />}
      {isCur && id === "t6_04" && <Paginas t={tt} a={a} b={b} />}
      {isCur && id === "t6_05" && <><NumTruco11 t={tt} a={a} b={b} /><div style={{ position: "absolute", left: 960, top: 530, transform: "translate(-50%,-50%)", opacity: e(tt, a + 0.2, a + 0.6) * (1 - e(tt, b - 0.4, b - 0.05)), whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.7)") }}>LA SILICONA CON LA BAÑERA LLENA</div></>}
      {isCur && id === "t6_06" && <Tag t={tt} at={a + 1.2} x={960} y={420} text="LÍNEA BLANCA" out={b - 0.4} />}
      {isCur && id === "t6_07" && <Circulo t={tt} a={a + 1.0} b={b} x={960} y={480} r={200} />}
      {isCur && id === "t6_08" && <><Circulo t={tt} a={a + 0.8} b={b} x={1100} y={380} r={170} /><Nota t={tt} a={a + 2.2} b={b} text="LO MÁS CARO QUE HAY" x={960} y={880} /></>}
      {isCur && id === "t6_09" && <Contador t={tt} a={a + 1.4} b={b} n={3} label="MESES" />}
      {isCur && id === "t6_10" && <Tag t={tt} at={a + 1.0} x={960} y={400} text="SE LLENA DE AGUA" out={b - 0.4} />}
      {isCur && id === "t6_11" && <Tag t={tt} at={a + 1.2} x={960} y={360} text="UNOS MILÍMETROS" out={b - 0.4} />}
      {isCur && id === "t6_12" && <Nota t={tt} a={a + 1.0} b={b} text="LLENA PRIMERO" x={960} y={180} />}
      {isCur && id === "t6_13" && <Tag t={tt} at={a + 1.2} x={960} y={400} text="POSICIÓN MÁS BAJA" out={b - 0.4} />}
      {isCur && id === "t6_14" && <Compara t={tt} a={a} b={b} />}
      {isCur && id === "t6_15" && <Tag t={tt} at={a + 1.0} x={960} y={380} text="CÚTER Y PACIENCIA" out={b - 0.4} />}
      {isCur && id === "t6_16" && <DrawX t={tt} at={a + 1.2} x={960} y={480} w={340} h={340} />}
      {isCur && id === "t6_17" && <Nota t={tt} a={a + 1.4} b={b} text="ANTIHONGOS" x={960} y={180} />}
      {isCur && id === "t6_18" && <Tag t={tt} at={a + 1.0} x={960} y={400} text="CINTA DE PINTOR" out={b - 0.4} />}
      {isCur && id === "t6_19" && <Truco t={tt} a={a} b={b} num="12" sub="LA REJILLA DE UN PESO" />}
      {isCur && id === "t6_20" && <Circulo t={tt} a={a + 1.2} b={b} x={960} y={520} r={210} />}
      {isCur && id === "t6_21" && <Chips t={tt} a={a + 0.6} b={b} items={["ARROZ", "CAFÉ", "CÁSCARAS"]} />}
      {isCur && id === "t6_22" && <Tag t={tt} at={a + 1.4} x={960} y={400} text="MALLA FINA" out={b - 0.4} />}
      {isCur && id === "t6_23" && <Nota t={tt} a={a + 1.0} b={b} text="ATRAPA TODO" x={960} y={180} />}
    </AbsoluteFill>
  );
};

export const Tramo6: React.FC<{ t: number }> = ({ t }) => {
  let i = PLANOS.findIndex((p) => t >= p.a && t < p.b);
  if (i < 0) i = t < PLANOS[0].a ? 0 : PLANOS.length - 1;
  const cur = PLANOS[i];
  const prev = i > 0 ? PLANOS[i - 1] : null;
  const trans = cur.a > PLANOS[0].a ? 0.4 : 0;
  const inTrans = !!prev && t < cur.a + trans;

  return (
    <AbsoluteFill style={{ background: "#0b0b0d" }}>
      {inTrans && prev && (
        <AbsoluteFill style={{ opacity: 1 - e(t, cur.a, cur.a + trans) }}>
          {renderPlano(prev, t, false)}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: inTrans ? e(t, cur.a, cur.a + trans) : 1 }}>
        {renderPlano(cur, t, true)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SFX6: [number, string, number?][] = [
  [1090.10, "whoosh"],
  [1090.60, "slam", -2],
  [1096.60, "whoosh"],
  [1096.90, "paper"],
  [1099.99, "whoosh"],
  [1104.83, "whoosh"],
  [1105.30, "pop"],
  [1105.85, "pop"],
  [1106.40, "pop"],
  [1106.95, "pop"],
  [1107.50, "pop"],
  [1110.60, "whoosh"],
  [1111.00, "paper"],
  [1112.40, "paper"],
  [1116.82, "whoosh"],
  [1120.55, "whoosh_big"],
  [1120.85, "slam"],
  [1125.60, "whoosh"],
  [1126.80, "pop"],
  [1131.35, "whoosh"],
  [1136.95, "whoosh"],
  [1137.95, "write"],
  [1140.90, "whoosh"],
  [1141.70, "write"],
  [1143.10, "pop"],
  [1146.90, "whoosh"],
  [1148.30, "roll"],
  [1150.65, "whoosh"],
  [1154.11, "whoosh"],
  [1155.10, "k_chorro", -6],
  [1157.00, "pop"],
  [1160.00, "whoosh"],
  [1161.20, "pop"],
  [1165.79, "whoosh"],
  [1170.79, "whoosh"],
  [1171.80, "pop"],
  [1176.40, "whoosh"],
  [1177.60, "pop"],
  [1180.54, "whoosh"],
  [1184.77, "whoosh"],
  [1186.20, "pop"],
  [1187.20, "pop"],
  [1190.44, "whoosh"],
  [1191.40, "k_metal", -5],
  [1193.00, "pop"],
  [1197.46, "whoosh"],
  [1201.37, "whoosh"],
  [1202.50, "fail"],
  [1204.04, "whoosh"],
  [1205.50, "pop"],
  [1207.00, "ding"],
  [1212.43, "whoosh"],
  [1216.70, "whoosh"],
  [1217.60, "pop"],
  [1222.70, "whoosh_big"],
  [1223.00, "slam"],
  [1226.31, "whoosh"],
  [1230.91, "whoosh"],
  [1232.20, "write"],
  [1237.54, "whoosh"],
  [1238.20, "pop"],
  [1238.80, "pop"],
  [1239.40, "pop"],
  [1244.10, "whoosh"],
  [1248.37, "whoosh"],
  [1249.60, "pop"],
  [1256.58, "whoosh"],
  [1257.40, "pop"],
];
