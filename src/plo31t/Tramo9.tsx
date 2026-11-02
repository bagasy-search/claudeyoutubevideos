import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, COL, e, ei, spr, extrude } from "./lib";

const W = 1920, H = 1080;

const FOTO = (slug: string) => staticFile(`plo31t/img/plo31t_${slug}.jpg`);

// ── Componentes propios (definidos antes de usarse) ──────────────────────────

const Tag: React.FC<{
  t: number; at: number; x: number; y: number; dx?: number; dy?: number;
  text: string; sub?: string; out?: number; col?: string; size?: number;
}> = ({ t, at, x, y, dx = -40, dy = -30, text, sub, out, col = "#fff", size = 56 }) => {
  const p = spr(t, at, 1);
  const op = e(t, at, at + 0.3) * (out !== undefined ? 1 - e(t, out, out + 0.3) : 1);
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: x, top: y, opacity: op,
      transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)`,
      padding: "18px 28px", borderRadius: 16,
      background: "rgba(8,14,26,.82)", border: `3px solid ${col}`,
      boxShadow: `0 12px 40px rgba(0,0,0,.6), 0 0 26px ${col}55`,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, color: col, fontSize: size, letterSpacing: "0.02em", textShadow: extrude(3, "rgba(0,0,0,.6)") }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 700, color: "#cfe0f5", fontSize: Math.round(size * 0.5), marginTop: 6, letterSpacing: "0.05em" }}>{sub}</div>}
    </div>
  );
};

const DrawX: React.FC<{ t: number; at: number; x: number; y: number; w: number; h: number; col?: string }> = ({ t, at, x, y, w, h, col = "#ff5a5a" }) => {
  const p = e(t, at, at + 0.5);
  if (p <= 0) return null;
  const len = Math.sqrt(w * w + h * h);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "visible", pointerEvents: "none" }}>
      <line x1={0} y1={0} x2={w} y2={h} stroke={col} strokeWidth={14} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{ filter: `drop-shadow(0 0 14px ${col})` }} />
      <line x1={w} y1={0} x2={0} y2={h} stroke={col} strokeWidth={14} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{ filter: `drop-shadow(0 0 14px ${col})` }} />
    </svg>
  );
};

const Rot: React.FC<{ t: number; at: number; out?: number; text: string; x: number; y: number; size?: number; col?: string }> = ({ t, at, out, text, x, y, size = 82, col = "#fff" }) => {
  const p = spr(t, at, 1);
  const op = e(t, at, at + 0.3) * (out !== undefined ? 1 - e(t, out, out + 0.3) : 1);
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`, opacity: op,
      fontFamily: FONT, fontWeight: 900, color: col, fontSize: size, letterSpacing: "0.04em",
      textShadow: `0 6px 0 rgba(0,0,0,.55), 0 0 40px ${col}88`, whiteSpace: "nowrap",
    }}>{text}</div>
  );
};

const Chips: React.FC<{ t: number; at: number; items: string[]; out?: number; y?: number }> = ({ t, at, items, out, y = 880 }) => {
  return (
    <>
      {items.map((it, i) => {
        const a2 = at + i * 0.35;
        const p = spr(t, a2, 1);
        const op = e(t, a2, a2 + 0.3) * (out !== undefined ? 1 - e(t, out, out + 0.3) : 1);
        if (op <= 0) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: 140 + i * 340, top: y, opacity: op,
            transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`,
            padding: "14px 26px", borderRadius: 40, background: "rgba(255,255,255,.12)",
            border: "2px solid rgba(255,255,255,.55)", fontFamily: FONT, fontWeight: 800,
            color: "#fff", fontSize: 42, textShadow: extrude(3, "rgba(0,0,0,.6)"),
          }}>{it}</div>
        );
      })}
    </>
  );
};

const BigNum: React.FC<{ t: number; at: number; text: string; x: number; y: number; size?: number; col?: string; sub?: string; out?: number }> = ({ t, at, text, x, y, size = 180, col = "#fff", sub, out }) => {
  const p = spr(t, at, 1);
  const op = e(t, at, at + 0.3) * (out !== undefined ? 1 - e(t, out, out + 0.3) : 1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: op, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, color: col, fontSize: size, lineHeight: 1, letterSpacing: "0.02em", textShadow: extrude(8, "rgba(0,0,0,.7)") }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, color: "#cfe0f5", fontSize: Math.round(size * 0.32), marginTop: 14, letterSpacing: "0.08em" }}>{sub}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

type Plano = {
  a: number; b: number;
  tipo: "avatar" | "foto";
  img?: string;
  mov?: "push" | "pan" | "macro" | "pull";
  extra?: (t: number, a: number, b: number) => React.ReactNode;
};

const PLANOS: Plano[] = [
  { a: 1625.59, b: 1628.86, tipo: "avatar" },
  { a: 1628.86, b: 1633.17, tipo: "foto", img: "t9_01", mov: "push", extra: (t, a, b) => (
      <Tag t={t} at={a + 0.9} x={1180} y={330} dx={-60} dy={-40} text="TECHOS Y PAREDES" sub="LO PRIMERO QUE MIRÁS" out={b - 0.3} />
    ) },
  { a: 1633.17, b: 1636.33, tipo: "foto", img: "t9_02", mov: "macro", extra: (t, a, b) => (
      <>
        <DrawX t={t} at={a + 0.7} x={860} y={470} w={420} h={300} />
        <Tag t={t} at={a + 1.3} x={1300} y={760} dx={-40} dy={-30} text="PINTURA QUE SE INFLA" sub="MANCHA NUEVA" out={b - 0.3} />
      </>
    ) },
  { a: 1636.33, b: 1641.08, tipo: "foto", img: "t9_03", mov: "push", extra: (t, a, b) => (
      <Tag t={t} at={a + 1.0} x={1240} y={360} dx={-50} dy={-40} text="TODO CERRADO" sub="NI UNA CANILLA ABIERTA" out={b - 0.3} />
    ) },
  { a: 1641.08, b: 1645.35, tipo: "avatar" },
  { a: 1645.35, b: 1649.35, tipo: "foto", img: "t9_05", mov: "macro", extra: (t, a, b) => (
      <Tag t={t} at={a + 0.9} x={1290} y={520} dx={-40} dy={-30} text="UNA GOTA" sub="NO UNA INUNDACIÓN" out={b - 0.3} />
    ) },
  { a: 1649.35, b: 1655.55, tipo: "foto", img: "t9_06", mov: "pan", extra: (t, a, b) => (
      <Rot t={t} at={a + 1.4} out={b - 0.4} text="EL QUE LLEGA TARDE" x={W / 2} y={170} size={82} col={COL.amber} />
    ) },
  { a: 1655.55, b: 1657.89, tipo: "foto", img: "t9_07", mov: "push", extra: (t, a, b) => (
      <Chips t={t} at={a + 0.5} items={["MITO 1", "MITO 2"]} out={b - 0.2} y={880} />
    ) },
  { a: 1657.89, b: 1662.35, tipo: "avatar" },
  { a: 1662.35, b: 1667.89, tipo: "foto", img: "t9_08", mov: "push", extra: (t, a, b) => <Comparativa t={t} a={a} b={b} /> },
  { a: 1667.89, b: 1674.32, tipo: "foto", img: "t9_09", mov: "macro", extra: (t, a, b) => (
      <>
        <DrawX t={t} at={a + 1.2} x={900} y={430} w={380} h={280} />
        <Tag t={t} at={a + 1.8} x={1320} y={760} dx={-40} dy={-30} text="TARDA MÁS QUE ANTES" out={b - 0.4} />
      </>
    ) },
  { a: 1674.32, b: 1679.64, tipo: "avatar" },
  { a: 1679.64, b: 1685.83, tipo: "foto", img: "t9_10", mov: "push", extra: (t, a, b) => (
      <>
        <DrawX t={t} at={a + 1.6} x={960} y={420} w={440} h={320} />
        <Tag t={t} at={a + 2.2} x={1360} y={780} dx={-40} dy={-30} text="HIRVIENDO = DAÑO" out={b - 0.4} />
      </>
    ) },
  { a: 1685.83, b: 1691.34, tipo: "foto", img: "t9_11", mov: "pan", extra: (t, a, b) => (
      <Tag t={t} at={a + 1.0} x={1260} y={380} dx={-50} dy={-40} text="CALIENTE, SÍ" sub="DE LA LLAVE" col={COL.ice} out={b - 0.3} />
    ) },
  { a: 1691.34, b: 1696.62, tipo: "avatar" },
  { a: 1696.62, b: 1703.05, tipo: "foto", img: "t9_12", mov: "push", extra: (t, a, b) => (
      <>
        <BigNum t={t} at={a + 1.6} text="3 A 5 AÑOS" x={W / 2} y={580} size={180} col="#fff" sub="LA GOMA YA ESTÁ DURA" out={b - 0.4} />
        <Tag t={t} at={a + 0.6} x={980} y={140} dx={-40} dy={-30} text="CUANDO FALLE LA PRUEBA" out={b - 0.4} size={44} />
      </>
    ) },
  { a: 1703.05, b: 1705.59, tipo: "foto", img: "t9_13", mov: "macro", extra: (t, a, b) => (
      <Tag t={t} at={a + 0.6} x={1280} y={420} dx={-40} dy={-30} text="AIREADOR" sub="EN VINAGRE" out={b - 0.2} />
    ) },
  { a: 1705.59, b: 1709.66, tipo: "avatar" },
  { a: 1709.66, b: 1713.23, tipo: "foto", img: "t9_14", mov: "macro", extra: (t, a, b) => (
      <>
        <DrawX t={t} at={a + 0.8} x={920} y={420} w={420} h={300} />
        <Tag t={t} at={a + 1.4} x={1340} y={760} dx={-40} dy={-30} text="ADENTRO NO ALCANZA" out={b - 0.3} />
      </>
    ) },
  { a: 1713.23, b: 1716.05, tipo: "foto", img: "t9_15", mov: "pan", extra: (t, a, b) => (
      <>
        <DrawX t={t} at={a + 0.7} x={880} y={440} w={400} h={300} />
        <Tag t={t} at={a + 1.2} x={1300} y={760} dx={-40} dy={-30} text="SIN LLAVE DE PASO" out={b - 0.2} />
      </>
    ) },
  { a: 1716.05, b: 1723.25, tipo: "foto", img: "t9_16", mov: "push", extra: (t, a, b) => (
      <Rot t={t} at={a + 1.4} out={b - 0.4} text="QUE TE PONGA UNA" x={W / 2} y={170} size={82} col={COL.ice} />
    ) },
  { a: 1723.25, b: 1726.89, tipo: "avatar" },
  { a: 1726.89, b: 1739.27, tipo: "foto", img: "t9_17", mov: "push", extra: (t, a, b) => <ListaHerramientas t={t} a={a} b={b} /> },
  { a: 1739.27, b: 1743.49, tipo: "avatar" },
  { a: 1743.49, b: 1753.90, tipo: "foto", img: "t9_18", mov: "push", extra: (t, a, b) => (
      <Recap t={t} a={a} b={b} items={[
        { n: 1, txt: "PRUEBA DEL COLORANTE", at: 0.4 },
        { n: 2, txt: "PRUEBA DEL MEDIDOR", at: 2.9 },
        { n: 3, txt: "LLAVE DE PASO", at: 5.9 },
        { n: 4, txt: "TEFLÓN EN LA ROSCA", at: 8.4 },
        { n: 5, txt: "AIREADOR CON VINAGRE", at: 10.2 },
      ]} />
    ) },
  { a: 1753.90, b: 1759.06, tipo: "avatar" },
  { a: 1759.06, b: 1771.82, tipo: "foto", img: "t9_19", mov: "pan", extra: (t, a, b) => (
      <Recap t={t} a={a} b={b} items={[
        { n: 6, txt: "MANGUERA DE MALLA", at: 0.4 },
        { n: 7, txt: "DESTAPADOR DE PELOS", at: 2.9 },
        { n: 8, txt: "NIVEL DEL TANQUE", at: 5.9 },
        { n: 9, txt: "GOMITA O CARTUCHO", at: 8.4 },
        { n: 10, txt: "PURGAR EL CALENTADOR", at: 10.2 },
      ]} />
    ) },
  { a: 1771.82, b: 1776.60, tipo: "avatar" },
  { a: 1776.60, b: 1786.44, tipo: "foto", img: "t9_20", mov: "push", extra: (t, a, b) => (
      <Recap t={t} a={a} b={b} highlight={15} items={[
        { n: 11, txt: "SILICONA CON BAÑERA LLENA", at: 0.4 },
        { n: 12, txt: "REJILLA EN EL FREGADERO", at: 2.9 },
        { n: 13, txt: "VENTOSA CORRECTA", at: 5.9 },
        { n: 14, txt: "AISLAR LOS CAÑOS", at: 8.4 },
        { n: 15, txt: "LA REVISTA DE DON ERNESTO", at: 10.2 },
      ]} />
    ) },
  { a: 1786.44, b: 1790.39, tipo: "avatar" },
  { a: 1790.39, b: 1796.03, tipo: "foto", img: "t9_21", mov: "macro", extra: (t, a, b) => (
      <Tag t={t} at={a + 1.0} x={1260} y={420} dx={-40} dy={-30} text="LINTERNA Y TRAPO" sub="15 MINUTOS" out={b - 0.3} />
    ) },
  { a: 1796.03, b: 1801.54, tipo: "foto", img: "t9_22", mov: "pan", extra: (t, a, b) => (
      <Rot t={t} at={a + 0.9} out={b - 0.3} text="LA REVISTA DE DON ERNESTO" x={W / 2} y={960} size={64} col={COL.amber} />
    ) },
  { a: 1801.54, b: 1805.89, tipo: "avatar" },
  { a: 1805.89, b: 1816.32, tipo: "foto", img: "t9_23", mov: "push", extra: (t, a, b) => <ContadorAhorro t={t} a={a} b={b} /> },
  { a: 1816.32, b: 1820.40, tipo: "avatar" },
  { a: 1820.40, b: 1828.15, tipo: "foto", img: "t9_24", mov: "push", extra: (t, a, b) => <Guia t={t} a={a} b={b} /> },
  { a: 1828.15, b: 1833.01, tipo: "foto", img: "t9_25", mov: "macro" },
];

const FotoPlano: React.FC<{ t: number; p: Plano }> = ({ t, p }) => {
  const dur = p.b - p.a;
  const k = Math.min(1, Math.max(0, (t - p.a) / dur));
  let sc = 1.05, tx = 0, ty = 0;
  if (p.mov === "push") { sc = 1.02 + 0.10 * k; }
  else if (p.mov === "macro") { sc = 1.10 + 0.16 * k; }
  else if (p.mov === "pull") { sc = 1.16 - 0.10 * k; }
  else if (p.mov === "pan") { sc = 1.10; tx = -60 + 120 * k; ty = -20 + 40 * k; }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={FOTO(p.img!)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${sc}) translate(${tx}px, ${ty}px)`,
        filter: "saturate(1.02) contrast(1.02)",
      }} />
    </AbsoluteFill>
  );
};

const Comparativa: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const split = e(t, a + 0.5, a + 1.3);
  const arrow1 = e(t, a + 1.4, a + 2.2);
  const arrow2 = e(t, a + 3.2, a + 4.0);
  // Dos columnas limpias: izquierda (verde) y derecha (ámbar), sin solaparse ni línea central.
  const colW = 760;
  const colY = 200;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.55))" }} />
      {/* Columna izquierda */}
      <div style={{ position: "absolute", left: 120, top: colY, width: colW, opacity: split, padding: "26px 30px", borderRadius: 20, background: "rgba(8,20,14,.72)", border: "3px solid #8fe39a", boxShadow: "0 18px 50px rgba(0,0,0,.6), 0 0 30px #8fe39a44" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, color: "#8fe39a", fontSize: 68, lineHeight: 1.05, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>AGUA QUE BAJA</div>
        <div style={{ marginTop: 22, width: `${100 * arrow1}%`, height: 14, background: "#8fe39a", borderRadius: 8, boxShadow: "0 0 24px #8fe39a" }} />
      </div>
      {/* Columna derecha */}
      <div style={{ position: "absolute", right: 120, top: colY, width: colW, opacity: split, padding: "26px 30px", borderRadius: 20, background: "rgba(24,14,4,.72)", border: `3px solid ${COL.amber}`, boxShadow: `0 18px 50px rgba(0,0,0,.6), 0 0 30px ${COL.amber}44`, textAlign: "right" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, color: COL.amber, fontSize: 68, lineHeight: 1.05, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>TAPADO A LA MITAD</div>
        <div style={{ marginTop: 22, width: `${100 * arrow2}%`, height: 14, background: COL.amber, borderRadius: 8, boxShadow: `0 0 24px ${COL.amber}`, marginLeft: "auto" }} />
      </div>
    </>
  );
};

const ListaHerramientas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const items = ["LLAVE PERICA", "PINZAS", "DESTORNILLADORES", "TEFLÓN", "VENTOSAS", "DESTAPADOR DE PELOS", "LINTERNA", "CUBETA"];
  const ats = [0.4, 1.6, 2.8, 4.6, 6.2, 7.6, 9.4, 10.6];
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.15) 100%)" }} />
      <div style={{ position: "absolute", left: 140, top: 140, fontFamily: FONT, fontWeight: 900, color: "#fff", fontSize: 56, letterSpacing: "0.05em", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>LO MÍNIMO</div>
      {items.map((it, i) => {
        const at = a + ats[i];
        const p = spr(t, at, 1);
        const op = e(t, at, at + 0.3) * (1 - e(t, b - 0.3, b));
        return (
          <div key={i} style={{ position: "absolute", left: 140, top: 260 + i * 92, opacity: op, transform: `translateX(${(1 - p) * -40}px)`, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, border: "3px solid #8fe39a", background: t > at + 0.15 ? "#8fe39a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(143,227,154,.6)" }}>
              {t > at + 0.15 && <div style={{ fontFamily: FONT, fontWeight: 900, color: "#0b1424", fontSize: 34 }}>✓</div>}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, color: "#fff", fontSize: 52, textShadow: extrude(4, "rgba(0,0,0,.7)") }}>{it}</div>
          </div>
        );
      })}
    </>
  );
};

const Recap: React.FC<{ t: number; a: number; b: number; items: { n: number; txt: string; at: number }[]; highlight?: number }> = ({ t, a, b, items, highlight }) => {
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.15) 100%)" }} />
      {items.map((it, i) => {
        const at = a + it.at;
        const p = spr(t, at, 1);
        const op = e(t, at, at + 0.3) * (1 - e(t, b - 0.3, b));
        const hi = highlight === it.n;
        return (
          <div key={i} style={{ position: "absolute", left: 140, top: 180 + i * 150, opacity: op, transform: `translateX(${(1 - p) * -60}px)`, display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, color: hi ? COL.amber : "#8fd6ff", fontSize: 110, lineHeight: 1, textShadow: extrude(6, "rgba(0,0,0,.7)"), minWidth: 150 }}>{it.n}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, color: hi ? COL.amber : "#fff", fontSize: 58, textShadow: extrude(4, "rgba(0,0,0,.7)"), letterSpacing: "0.02em" }}>{it.txt}</div>
          </div>
        );
      })}
    </>
  );
};

const ContadorAhorro: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = e(t, a + 1.0, a + 6.0);
  const val = Math.round(interpolate(k, [0, 1], [0, 8000]));
  const op = e(t, a + 0.8, a + 1.4) * (1 - e(t, b - 0.4, b));
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(0,0,0,.2), rgba(0,0,0,.65))" }} />
      <div style={{ position: "absolute", left: 160, top: 320, opacity: op, fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.7)") }}>
        <div style={{ fontSize: 56, letterSpacing: "0.15em", color: COL.amber }}>TE AHORRAN</div>
        <div style={{ fontSize: 200, lineHeight: 1, color: "#8fe39a" }}>${val.toLocaleString("es-AR")}</div>
        <div style={{ fontSize: 56, color: "#fff" }}>AL AÑO</div>
      </div>
    </>
  );
};

const Guia: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const p1 = spr(t, a + 0.6, 1);
  const p2 = spr(t, a + 1.6, 1);
  const op = 1 - e(t, b - 0.4, b);
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.25), rgba(0,0,0,.7))" }} />
      <div style={{ position: "absolute", left: 560, top: 180, width: 480, height: 720, transform: `perspective(1400px) rotateY(${(1 - p1) * 22}deg) scale(${0.9 + 0.1 * p1})`, opacity: op, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
        <Img src={staticFile("plo31t/libro/cover50.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 1060, top: 240, width: 440, height: 620, transform: `perspective(1400px) rotateY(${(1 - p2) * -18}deg) scale(${0.9 + 0.1 * p2})`, opacity: p2 * op, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
        <Img src={staticFile("plo31t/libro/pag_e1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 920, opacity: p1 * op, fontFamily: FONT, fontWeight: 900, color: "#fff", fontSize: 52, textShadow: extrude(4, "rgba(0,0,0,.7)") }}>PLOMERÍA CASERA · 50 ARREGLOS</div>
    </>
  );
};

export const Tramo9: React.FC<{ t: number }> = ({ t }) => {
  const idx = PLANOS.findIndex((p) => t >= p.a && t < p.b);
  const i = idx < 0 ? PLANOS.length - 1 : idx;
  const cur = PLANOS[i];
  const prev = i > 0 ? PLANOS[i - 1] : null;
  const trans = 0.35;
  const tr = t - cur.a;
  const showPrev = prev && tr < trans;
  const prevOp = showPrev ? 1 - tr / trans : 0;
  const curOp = showPrev ? tr / trans : 1;

  const renderPlano = (p: Plano, op: number, isCur: boolean) => {
    if (p.tipo === "avatar") {
      return (
        <AbsoluteFill style={{ opacity: op }}>
          <Avatar t={t} />
        </AbsoluteFill>
      );
    }
    return (
      <AbsoluteFill style={{ opacity: op }}>
        <FotoPlano t={t} p={p} />
        {p.extra && isCur && p.extra(t, p.a, p.b)}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {showPrev && prev && renderPlano(prev, prevOp, false)}
      {renderPlano(cur, curOp, true)}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.35) 100%)" }} />
    </AbsoluteFill>
  );
};

export const SFX9: [number, string, number?][] = [
  [1628.86, "whoosh", -4],
  [1629.60, "pop", -3],
  [1633.17, "swish", -3],
  [1633.90, "write", -4],
  [1634.50, "pop", -3],
  [1636.33, "whoosh", -4],
  [1637.30, "pop", -3],
  [1641.08, "whoosh", -4],
  [1645.35, "whoosh", -4],
  [1646.30, "pop", -3],
  [1649.35, "whoosh", -4],
  [1650.80, "slam", -3],
  [1655.55, "swish", -3],
  [1656.10, "click", -4],
  [1656.90, "click", -4],
  [1657.89, "whoosh", -4],
  [1662.35, "whoosh", -4],
  [1663.00, "pop", -3],
  [1664.50, "write", -4],
  [1667.89, "whoosh", -4],
  [1669.10, "write", -4],
  [1670.00, "pop", -3],
  [1674.32, "whoosh", -4],
  [1679.64, "whoosh", -4],
  [1681.20, "write", -4],
  [1682.00, "pop", -3],
  [1685.83, "swish", -3],
  [1686.80, "pop", -3],
  [1691.34, "whoosh", -4],
  [1696.62, "whoosh", -4],
  [1697.20, "pop", -3],
  [1698.20, "roll", -4],
  [1703.05, "swish", -3],
  [1703.70, "pop", -3],
  [1705.59, "whoosh", -4],
  [1709.66, "whoosh", -4],
  [1710.50, "write", -4],
  [1711.10, "pop", -3],
  [1713.23, "swish", -3],
  [1714.00, "write", -4],
  [1714.60, "pop", -3],
  [1716.05, "whoosh", -4],
  [1717.40, "slam", -3],
  [1723.25, "whoosh", -4],
  [1726.89, "whoosh", -4],
  [1727.30, "click", -4],
  [1728.50, "click", -4],
  [1729.70, "click", -4],
  [1731.50, "click", -4],
  [1733.10, "click", -4],
  [1734.50, "click", -4],
  [1736.30, "click", -4],
  [1737.50, "click", -4],
  [1739.27, "whoosh", -4],
  [1743.49, "whoosh", -4],
  [1743.90, "click", -4],
  [1746.40, "click", -4],
  [1749.40, "click", -4],
  [1751.90, "click", -4],
  [1753.70, "click", -4],
  [1753.90, "whoosh", -4],
  [1759.06, "whoosh", -4],
  [1759.50, "click", -4],
  [1762.00, "click", -4],
  [1765.00, "click", -4],
  [1767.50, "click", -4],
  [1769.30, "click", -4],
  [1771.82, "whoosh", -4],
  [1776.60, "whoosh", -4],
  [1777.00, "click", -4],
  [1779.50, "click", -4],
  [1782.50, "click", -4],
  [1785.00, "click", -4],
  [1786.80, "ding", -3],
  [1786.44, "whoosh", -4],
  [1790.39, "whoosh", -4],
  [1791.40, "pop", -3],
  [1796.03, "whoosh", -4],
  [1796.90, "slam", -3],
  [1801.54, "whoosh", -4],
  [1805.89, "whoosh", -4],
  [1806.90, "roll", -4],
  [1809.00, "coin", -3],
  [1816.32, "whoosh", -4],
  [1820.40, "whoosh", -4],
  [1821.00, "paper", -4],
  [1822.20, "pop", -3],
  [1828.15, "whoosh", -4],
];
