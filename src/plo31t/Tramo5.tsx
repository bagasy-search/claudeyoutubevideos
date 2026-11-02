import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, COL, e, ei, spr, extrude, Tag, Card3D, DrawX, BigNum } from "./lib";
import { Mesa, Bx, orbit } from "./mesa3d";

const W = 1920, H = 1080;
const img = (id: string) => staticFile(`plo31t/img/plo31t_${id}.jpg`);

type Plan = { a: number; b: number; kind: "av" | "foto"; id?: string; push?: [number, number]; zoom?: number };
const PLANES: Plan[] = [
  { a: 904.03, b: 909.07, kind: "av" },
  { a: 909.07, b: 912.07, kind: "foto", id: "t5_01", push: [0.42, 0.6], zoom: 1.10 },
  { a: 912.07, b: 917.00, kind: "foto", id: "t5_02", push: [0.5, 0.5], zoom: 1.14 },
  { a: 917.00, b: 919.83, kind: "foto", id: "t5_03", push: [0.55, 0.4], zoom: 1.08 },
  { a: 919.83, b: 923.21, kind: "av" },
  { a: 923.21, b: 927.62, kind: "foto", id: "t5_04", push: [0.5, 0.42], zoom: 1.13 },
  { a: 927.62, b: 932.54, kind: "foto", id: "t5_05", push: [0.5, 0.45], zoom: 1.11 },
  { a: 932.54, b: 936.99, kind: "foto", id: "t5_06", push: [0.5, 0.55], zoom: 1.09 },
  { a: 936.99, b: 942.14, kind: "av" },
  { a: 942.14, b: 945.66, kind: "foto", id: "t5_07", push: [0.5, 0.5], zoom: 1.10 },
  { a: 945.66, b: 950.04, kind: "foto", id: "t5_08", push: [0.55, 0.5], zoom: 1.12 },
  { a: 950.04, b: 954.04, kind: "foto", id: "t5_09", push: [0.5, 0.55], zoom: 1.10 },
  { a: 954.04, b: 958.85, kind: "av" },
  { a: 958.85, b: 961.02, kind: "foto", id: "t5_10", push: [0.5, 0.5], zoom: 1.16 },
  { a: 961.02, b: 969.11, kind: "foto", id: "t5_11", push: [0.5, 0.5], zoom: 1.08 },
  { a: 969.11, b: 973.80, kind: "av" },
  { a: 973.80, b: 979.90, kind: "foto", id: "t5_12", push: [0.5, 0.45], zoom: 1.09 },
  { a: 979.90, b: 986.44, kind: "foto", id: "t5_12", push: [0.55, 0.5], zoom: 1.05 },
  { a: 986.44, b: 990.00, kind: "av" },
  { a: 990.00, b: 992.56, kind: "foto", id: "t5_13", push: [0.5, 0.5], zoom: 1.10 },
  { a: 992.56, b: 1001.21, kind: "foto", id: "t5_14", push: [0.5, 0.55], zoom: 1.13 },
  { a: 1001.21, b: 1005.04, kind: "av" },
  { a: 1005.04, b: 1011.10, kind: "foto", id: "t5_15", push: [0.5, 0.55], zoom: 1.12 },
  { a: 1011.10, b: 1017.23, kind: "foto", id: "t5_16", push: [0.5, 0.5], zoom: 1.10 },
  { a: 1017.23, b: 1021.82, kind: "av" },
  { a: 1021.82, b: 1025.54, kind: "foto", id: "t5_17", push: [0.5, 0.55], zoom: 1.14 },
  { a: 1025.54, b: 1033.70, kind: "foto", id: "t5_18", push: [0.55, 0.45], zoom: 1.07 },
  { a: 1033.70, b: 1038.74, kind: "av" },
  { a: 1038.74, b: 1041.14, kind: "foto", id: "t5_19", push: [0.5, 0.45], zoom: 1.14 },
  { a: 1041.14, b: 1045.02, kind: "foto", id: "t5_20", push: [0.5, 0.5], zoom: 1.09 },
  { a: 1045.02, b: 1050.15, kind: "foto", id: "t5_20", push: [0.5, 0.6], zoom: 1.06 },
  { a: 1050.15, b: 1054.70, kind: "av" },
  { a: 1054.70, b: 1057.22, kind: "foto", id: "t5_21", push: [0.5, 0.45], zoom: 1.12 },
  { a: 1057.22, b: 1061.84, kind: "foto", id: "t5_22", push: [0.5, 0.55], zoom: 1.13 },
  { a: 1061.84, b: 1068.37, kind: "foto", id: "t5_23", push: [0.55, 0.5], zoom: 1.08 },
  { a: 1068.37, b: 1072.21, kind: "av" },
  { a: 1072.21, b: 1077.90, kind: "foto", id: "t5_24", push: [0.5, 0.55], zoom: 1.14 },
  { a: 1077.90, b: 1083.97, kind: "foto", id: "t5_25", push: [0.5, 0.45], zoom: 1.11 },
];

const Foto: React.FC<{ t: number; p: Plan }> = ({ t, p }) => {
  const k = ei(t, p.a, p.b);
  const [cx, cy] = p.push ?? [0.5, 0.5];
  const z = 1.02 + ((p.zoom ?? 1.08) - 1.02) * k;
  const dx = (0.5 - cx) * 90 * k, dy = (0.5 - cy) * 60 * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0f14" }}>
      <Img src={img(p.id!)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z}) translate(${dx}px,${dy}px)`, transformOrigin: `${cx * 100}% ${cy * 100}%` }} />
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.42) 100%)", pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,12,4,.12), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.22))", pointerEvents: "none" }} />
  </>
);

const Nota: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number; size?: number }> =
  ({ t, at, out, text, x, y, rot = -3, size = 44 }) => {
  const inn = spr(t, at, 0.9), o = e(t, out, out + 0.35);
  if (t < at || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${inn})`, opacity: 1 - o,
      background: "#f4ecd8", padding: "18px 30px", boxShadow: "0 18px 40px rgba(0,0,0,.45)", border: "1px solid rgba(0,0,0,.08)" }}>
      <div style={{ fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: size, color: "#2a2118", lineHeight: 1 }}>{text}</div>
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; col?: string; size?: number }> =
  ({ t, at, out, text, x, y, col = COL.amber, size = 34 }) => {
  const inn = spr(t, at, 0.85), o = e(t, out, out + 0.3);
  if (t < at || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${inn})`, opacity: 1 - o,
      background: "rgba(10,14,20,.78)", border: `2px solid ${col}`, borderRadius: 999, padding: "10px 22px",
      fontFamily: FONT, fontWeight: 800, fontSize: size, color: "#fff", letterSpacing: ".04em", boxShadow: `0 0 24px ${col}55` }}>{text}</div>
  );
};

const Grid6: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const inn = e(t, a, a + 0.5), o = e(t, b - 0.5, b - 0.1);
  if (t < a || o >= 1) return null;
  const cells = [0, 1, 2, 3, 4, 5];
  const pick = 4;
  return (
    <div style={{ position: "absolute", right: 120, top: 200, width: 620, opacity: inn * (1 - o), transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.ice2, letterSpacing: ".18em", marginBottom: 14 }}>MEDIDAS CASI IGUALES</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {cells.map(i => {
          const isPick = i === pick;
          const hi = isPick ? e(t, a + 1.4, a + 1.9) : 0;
          return (
            <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden",
              border: isPick ? `3px solid ${hi > 0.5 ? "#3ddc84" : "rgba(255,255,255,.25)"}` : "2px solid rgba(255,255,255,.15)",
              boxShadow: isPick && hi > 0.5 ? "0 0 28px #3ddc8488" : "0 8px 20px rgba(0,0,0,.4)",
              transform: `scale(${isPick ? 1 + hi * 0.06 : 1})`, background: "#111" }}>
              <Img src={img("t5_07")} style={{ width: "100%", height: "100%", objectFit: "cover",
                transform: `scale(${2.4 + i * 0.15}) translate(${(i % 3 - 1) * 12}%,${(Math.floor(i / 3) - 0.5) * 14}%)` }} />
            </div>
          );
        })}
      </div>
      {t > a + 1.9 && <div style={{ marginTop: 14, fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 46, color: "#3ddc84", transform: `scale(${spr(t, a + 1.9, 0.9)})` }}>el igual</div>}
    </div>
  );
};

const Contador9: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const o = e(t, b - 0.5, b - 0.1);
  if (t < a || o >= 1) return null;
  const n = Math.round(interpolate(t, [a + 0.2, a + 1.8], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const faltan = Math.round(interpolate(t, [a + 2.0, a + 3.2], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 140, top: 300, transform: `scale(${Math.min(1.05, spr(t, a))})`, transformOrigin: "left center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 220, color: "#fff", lineHeight: 0.9, textShadow: extrude(8, "rgba(0,0,0,.65)") }}>{n}</div>
        <div style={{ display: "inline-block", marginTop: 10, background: "rgba(10,14,20,.82)", border: `2px solid ${COL.amber}`, borderRadius: 10,
          padding: "6px 18px", boxShadow: "0 10px 26px rgba(0,0,0,.5)" }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", letterSpacing: ".06em", textShadow: "0 2px 0 rgba(0,0,0,.6)" }}>TRUCOS</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 140, top: 720, opacity: e(t, a + 2.0, a + 2.5) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: COL.ice, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>faltan {faltan}</div>
      </div>
    </AbsoluteFill>
  );
};

const Corte3D: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const cam = orbit(t, a, { p: [0.1, 0.55, 1.05], l: [0, 0.16, 0], fov: 30 });
  const piedra = e(t, a + 0.6, a + 1.8);
  const llama = e(t, a + 1.6, a + 2.4);
  const o = e(t, b - 0.4, b);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <Mesa cam={cam} floor="nada" warm={1} bloom={0.5}>
        <Bx p={[0, 0.28, 0]} s={[0.62, 0.56, 0.62]} c="#e8e6e0" ro={0.6} r={0.03} />
        {piedra > 0.01 && <Bx p={[0, 0.06 + 0.03 * piedra, 0]} s={[0.5 * piedra, 0.06 * piedra, 0.5 * piedra]} c="#d8cdb8" ro={0.95} r={0.01} />}
        {llama > 0.01 && (
          <mesh position={[0, -0.06, 0]} scale={[0.3 * llama, 0.09 * llama, 0.3 * llama]}>
            <coneGeometry args={[1, 1, 24]} />
            <meshStandardMaterial color="#3aa0ff" emissive="#2b7fff" emissiveIntensity={1.6} roughness={0.4} />
          </mesh>
        )}
      </Mesa>
    </AbsoluteFill>
  );
};

const ListaPasos: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const pasos = ["apaga el calentador", "espera que enfríe", "cierra agua fría", "conecta manguera", "abre la llavecita", "deja correr clara"];
  const o = e(t, b - 0.4, b);
  if (t < a || o >= 1) return null;
  return (
    <div style={{ position: "absolute", right: 110, top: 230, width: 640, opacity: 1 - o }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", marginBottom: 18, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>LA PURGA · 6 PASOS</div>
      {pasos.map((p, i) => {
        const at = a + 0.3 + i * 0.45;
        const inn = e(t, at, at + 0.35);
        const hi = i === 0 ? e(t, a + 1.6, a + 2.0) : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, opacity: inn, transform: `translateX(${(1 - inn) * 40}px)`,
            background: hi > 0.5 ? "rgba(255,178,87,.22)" : "rgba(10,14,20,.6)", border: `1px solid ${hi > 0.5 ? COL.amber : "rgba(255,255,255,.14)"}`, borderRadius: 12, padding: "10px 16px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: hi > 0.5 ? COL.amber : "rgba(255,255,255,.16)", color: hi > 0.5 ? "#1a1206" : "#fff",
              fontFamily: FONT, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff" }}>{p}</div>
          </div>
        );
      })}
    </div>
  );
};

const Anillo: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const o = e(t, b - 0.3, b);
  if (t < a || o >= 1) return null;
  const f = e(t, a, b - 0.4);
  const R = 90, C = 2 * Math.PI * R;
  return (
    <svg width={260} height={260} style={{ position: "absolute", left: 1420, top: 380, opacity: 1 - o, transform: `scale(${spr(t, a, 0.9)})` }}>
      <circle cx={130} cy={130} r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={16} />
      <circle cx={130} cy={130} r={R} fill="none" stroke={COL.ice} strokeWidth={16} strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={C * (1 - f)} transform="rotate(-90 130 130)" />
      <text x={130} y={145} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">{Math.round(f * 100)}%</text>
    </svg>
  );
};

// Rótulo "LA PIEZA VIEJA" sobre la foto de fondo (sin tarjeta con foto duplicada)
const PiezaRotulo: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const inn = spr(t, a + 0.1, 0.95);
  const o = e(t, b - 0.35, b - 0.05);
  if (t < a + 0.1 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 880, transform: `translate(-50%,-50%) scale(${inn})`, opacity: 1 - o }}>
      <div style={{
        display: "inline-block",
        padding: "14px 34px",
        background: "rgba(10,14,20,.72)",
        border: `2px solid ${COL.amber}`,
        borderRadius: 12,
        boxShadow: "0 20px 50px rgba(0,0,0,.55), 0 0 26px rgba(255,178,87,.35)",
      }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: ".08em", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>LA PIEZA VIEJA</span>
      </div>
    </div>
  );
};

export const Tramo5: React.FC<{ t: number }> = ({ t }) => {
  const idx = PLANES.findIndex(p => t >= p.a && t < p.b);
  const i = idx < 0 ? PLANES.length - 1 : idx;
  const cur = PLANES[i];
  const prev = i > 0 ? PLANES[i - 1] : null;
  const inTrans = prev && t < cur.a + 0.4 && cur.kind !== "av" && prev.kind !== "av";
  const render = (p: Plan) => (p.kind === "av" ? <Avatar t={t} /> : <Foto t={t} p={p} />);

  return (
    <AbsoluteFill style={{ background: "#0b0f14" }}>
      {inTrans && prev && (
        <AbsoluteFill style={{ opacity: 1 - e(t, cur.a, cur.a + 0.4), filter: `blur(${e(t, cur.a, cur.a + 0.4) * 10}px)` }}>
          {render(prev)}
        </AbsoluteFill>
      )}
      <AbsoluteFill>{render(cur)}</AbsoluteFill>

      {cur.id === "t5_02" && t >= cur.a && t < cur.b && (
        <>
          <DrawX t={t} at={913.57} x={960} y={540} w={520} h={360} />
          <Nota t={t} at={913.57} out={cur.b - 0.3} text="CORTADA" x={1480} y={300} />
        </>
      )}
      {cur.id === "t5_03" && t >= cur.a && t < cur.b && (
        <Chip t={t} at={918.4} out={cur.b - 0.2} text="MONOMANDO" x={960} y={180} />
      )}
      {cur.id === "t5_04" && t >= cur.a && t < cur.b && (
        <Nota t={t} at={925.12} out={cur.b - 0.3} text="GOTEA" x={1450} y={320} rot={4} />
      )}
      {cur.id === "t5_05" && t >= cur.a && t < cur.b && (
        <Tag t={t} at={929.78} x={960} y={430} dx={-260} dy={-220} text="LA TUERCA" out={cur.b - 0.3} />
      )}
      {cur.id === "t5_06" && t >= cur.a && t < cur.b && (
        <PiezaRotulo t={t} a={cur.a} b={cur.b} />
      )}
      {cur.id === "t5_07" && t >= cur.a && t < cur.b && <Grid6 t={t} a={cur.a + 0.2} b={cur.b} />}
      {cur.id === "t5_08" && t >= cur.a && t < cur.b && (
        <Chip t={t} at={948.96} out={cur.b - 0.2} text="EN 1 MINUTO" x={960} y={180} col={COL.ice} />
      )}
      {cur.id === "t5_09" && t >= cur.a && t < cur.b && (
        <Tag t={t} at={952.6} x={960} y={560} dx={-280} dy={-200} text="EL TRAPO" out={cur.b - 0.3} />
      )}
      {cur.id === "t5_10" && t >= cur.a && t < cur.b && (
        <DrawX t={t} at={959.36} x={960} y={560} w={300} h={300} />
      )}
      {cur.id === "t5_11" && t >= cur.a && t < cur.b && <Contador9 t={t} a={cur.a + 0.2} b={cur.b} />}
      {cur.id === "t5_12" && t >= cur.a && t < cur.b && (
        <>
          <Chip t={t} at={978.36} out={982.5} text="CALENTADOR" x={480} y={300} />
          <Chip t={t} at={981.24} out={984.5} text="BAÑERA" x={1440} y={300} col={COL.ice} />
          <Chip t={t} at={982.1} out={985.5} text="DESAGÜE" x={480} y={780} col={COL.ice} />
          <Chip t={t} at={983.74} out={986.2} text="VENTOSA" x={1440} y={780} />
          <Nota t={t} at={985.22} out={cur.b - 0.3} text="DON ERNESTO · el último" x={960} y={200} rot={-2} size={52} />
        </>
      )}
      {cur.id === "t5_13" && t >= cur.a && t < cur.b && (
        <BigNum t={t} at={cur.a + 0.3} text="10" x={1500} y={540} size={420} col="#fff" edge="rgba(0,0,0,.6)" out={cur.b - 0.3} sub="TRUCO" />
      )}
      {cur.id === "t5_14" && t >= cur.a && t < cur.b && (
        <>
          <Chip t={t} at={1000.5} out={cur.b - 0.2} text="SEDIMENTO" x={480} y={260} />
          <Chip t={t} at={1001.56} out={cur.b - 0.2} text="SARRO" x={960} y={220} col={COL.ice} />
          <Chip t={t} at={1002.38} out={cur.b - 0.2} text="ARENITA" x={1440} y={260} />
        </>
      )}
      {cur.id === "t5_15" && t >= cur.a && t < cur.b && (
        <Tag t={t} at={1009.4} x={960} y={560} dx={280} dy={-200} text="EL FUEGO" out={cur.b - 0.3} />
      )}
      {cur.id === "t5_16" && t >= cur.a && t < cur.b && (
        <>
          <Corte3D t={t} a={cur.a + 0.2} b={cur.b} />
          <Nota t={t} at={1014.5} out={cur.b - 0.3} text="calienta la piedra primero" x={960} y={940} rot={-1} size={46} />
        </>
      )}
      {cur.id === "t5_17" && t >= cur.a && t < cur.b && (
        <DrawX t={t} at={1024.04} x={960} y={540} w={460} h={340} />
      )}
      {cur.id === "t5_18" && t >= cur.a && t < cur.b && (
        <Nota t={t} at={1027.18} out={cur.b - 0.3} text="MUEREN ANTES" x={960} y={200} rot={-2} />
      )}
      {cur.id === "t5_20" && t >= cur.a && t < cur.b && (
        <ListaPasos t={t} a={cur.a + 0.3} b={cur.b} />
      )}
      {cur.id === "t5_21" && t >= cur.a && t < cur.b && (
        <Tag t={t} at={1055.2} x={960} y={520} dx={-260} dy={-210} text="AGUA FRÍA" out={cur.b - 0.3} />
      )}
      {cur.id === "t5_22" && t >= cur.a && t < cur.b && (
        <Tag t={t} at={1058.48} x={960} y={560} dx={280} dy={-200} text="LLAVECITA" out={cur.b - 0.3} />
      )}
      {cur.id === "t5_24" && t >= cur.a && t < cur.b && (
        <Chip t={t} at={1072.86} out={cur.b - 0.2} text="AGUA TURBIA" x={960} y={180} />
      )}
      {cur.id === "t5_25" && t >= cur.a && t < cur.b && (
        <>
          <Tag t={t} at={1080.1} x={960} y={540} dx={-280} dy={-200} text="SE LLENA" out={cur.b - 0.3} />
          <Anillo t={t} a={1081.76} b={cur.b} />
        </>
      )}

      <Grade />
    </AbsoluteFill>
  );
};

export const SFX5: [number, string, number?][] = [
  [909.07, "whoosh"],
  [910.19, "k_metal", -5],
  [912.07, "whoosh"],
  [913.57, "write", -2],
  [917.00, "swish"],
  [918.26, "pop", -3],
  [919.83, "whoosh"],
  [923.21, "whoosh"],
  [925.12, "k_gota", -4],
  [927.62, "swish"],
  [929.78, "pop", -3],
  [932.54, "whoosh"],
  [933.00, "paper", -4],
  [936.99, "whoosh"],
  [942.14, "whoosh_big"],
  [943.50, "pop", -4],
  [945.66, "swish"],
  [948.96, "pop", -3],
  [950.04, "whoosh"],
  [952.60, "pop", -3],
  [954.04, "whoosh"],
  [958.85, "swish"],
  [959.36, "write", -2],
  [961.02, "whoosh_big"],
  [962.16, "tick", -3],
  [963.80, "tick", -3],
  [965.40, "tick", -3],
  [967.00, "tick", -3],
  [969.11, "whoosh"],
  [973.80, "whoosh"],
  [978.36, "pop", -3],
  [981.24, "pop", -3],
  [982.10, "pop", -3],
  [983.74, "pop", -3],
  [985.22, "paper", -4],
  [986.44, "whoosh"],
  [990.00, "whoosh_big"],
  [990.60, "slam", -2],
  [992.56, "swish"],
  [1000.50, "pop", -4],
  [1001.56, "pop", -4],
  [1002.38, "pop", -4],
  [1005.04, "whoosh"],
  [1009.40, "pop", -3],
  [1011.10, "whoosh_big"],
  [1014.50, "paper", -4],
  [1017.23, "whoosh"],
  [1021.82, "swish"],
  [1024.04, "write", -2],
  [1025.54, "whoosh"],
  [1027.18, "paper", -4],
  [1033.70, "whoosh"],
  [1038.74, "swish"],
  [1041.14, "whoosh_big"],
  [1042.00, "click", -3],
  [1042.50, "click", -3],
  [1043.00, "click", -3],
  [1045.02, "swish"],
  [1046.78, "click", -3],
  [1050.15, "whoosh"],
  [1054.70, "swish"],
  [1055.20, "pop", -3],
  [1057.22, "whoosh"],
  [1058.48, "pop", -3],
  [1061.84, "whoosh"],
  [1068.37, "whoosh"],
  [1072.21, "swish"],
  [1072.86, "pop", -3],
  [1073.00, "k_chorro", -6],
  [1077.90, "whoosh"],
  [1080.10, "pop", -3],
  [1081.76, "roll", -3],
];
