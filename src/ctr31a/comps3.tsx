// ctr31a · PIEZAS 3 (16:50 → 29:40). Mismo contrato: Stage + f(t) + momentos por m.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Casa, ROOM, W, Pose, camPath } from "./casa";
import { Mesa, Balde, Trapo, Bx, drop, orbit, win } from "./mesa3d";
import { Stage, Rot } from "./base";
import { FONT, P, e, spr, extrude } from "./lib";
import { plugsOn } from "./marks";

const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const k1 = (t: number, a: number, s = 1) => Math.min(1.06, spr(t, a, s));
const Pagina: React.FC<{ t: number; at: number; out: number; page: string; x: number; y: number; w?: number; rot?: number }> = ({ t, at: a, out, page, x, y, w = 440, rot = -5 }) => {
  const k = k1(t, a, 0.8), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.33, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - k) * 380}px) rotateY(${(1 - k) * -55 + 5 * Math.sin(t * 0.4)}deg) rotateZ(${rot * k}deg)`, background: "#f6f1e6", borderRadius: 6, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <Img src={staticFile(P + "libro/" + page + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};
// tarjeta flotante con resorte (para pasos, recibos, notas)
const Card: React.FC<{ t: number; at: number; out?: number; x: number; y: number; w: number; ry?: number; children: React.ReactNode; bg?: string }> = ({ t, at: a, out = 1e9, x, y, w, ry = 0, children, bg = "linear-gradient(160deg,#2e2924,#1a1714)" }) => {
  const k = k1(t, a, 0.9), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - Math.min(1, k)) * 400}px) rotateY(${ry + 3 * Math.sin(t * 0.4 + x)}deg) scale(${0.9 + 0.1 * Math.min(1, k)})`, background: bg, borderRadius: 22, padding: 30, boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px rgba(255,255,255,.06)" }}>{children}</div>;
};
const txt = (size: number, col = "#f6efe2"): React.CSSProperties => ({ fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1.1, textShadow: "0 3px 0 rgba(0,0,0,.35)" });

// ---------- 17:08 LA BAÑERA: la pieza del mecanismo sale llena de pelo; el contador cae de 4 minutos a 40 segundos ----------
export const Banera: React.FC<{ t: number; a: number; b: number; m: { mec: number; prueba: number; menos: number; cuarenta: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.15, 0.8, 1.75], l: [0.05, 0.42, 0], fov: 34 }, 0.6);
  const pull = e(t, m.mec, m.mec + 1.4), clean = e(t, m.mec + 2.5, m.mec + 3.4);
  // segundos que muestra el contador: 240 → 60 (en «menos de un minuto») → 40
  const secs = t < m.prueba ? 240 : 240 - 200 * e(t, m.menos, m.menos + 1.6);
  const show = e(t, m.prueba, m.prueba + 0.5);
  const mm = Math.floor(secs / 60), ss = Math.floor(secs % 60);
  const dig = [String(mm), ":", String(Math.floor(ss / 10)), String(ss % 10)];
  return (
    <Stage t={t} a={a} b={b} tint="#dfe8f0">
      <AbsoluteFill style={{ opacity: 1 - show * 0.85, transform: `translateX(${-show * 380}px) scale(${1 - 0.2 * show})` }}>
        <Mesa cam={cam} floor="mueble">
          {/* el mecanismo: varilla con resorte y la pieza del final, sale en diagonal */}
          <group position={[-0.3 + pull * 0.35, 0.55 - pull * 0.05, 0]} rotation={[0, 0, -0.5]}>
            <Bx p={[0, 0, 0]} s={[0.7, 0.014, 0.014]} c="#c9cdd2" m={0.9} ro={0.25} />
            {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.25 + i * 0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.018, 0.003, 6, 16]} /><meshStandardMaterial color="#b9bec4" metalness={0.9} roughness={0.25} /></mesh>)}
            <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.1, 24]} /><meshStandardMaterial color="#d6dadf" metalness={0.9} roughness={0.2} /></mesh>
            {/* pelo enredado en la pieza */}
            {Array.from({ length: 18 }, (_, i) => <mesh key={"h" + i} position={[0.36 + 0.08 * rnd(i), 0.03 * (rnd(i, 2) - 0.5), 0.03 * (rnd(i, 3) - 0.5)]} scale={(0.03 + 0.024 * rnd(i, 4)) * (1 - clean)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#5f5a53" roughness={0.95} /></mesh>)}
          </group>
          <Bx p={[0, 0.3, -0.12]} s={[1.2, 0.6, 0.06]} c="#e2dfd7" ro={0.3} r={0.03} />
          <mesh position={[-0.3, 0.55, -0.085]}><circleGeometry args={[0.06, 32]} /><meshStandardMaterial color="#c9cdd2" metalness={0.9} roughness={0.2} /></mesh>
        </Mesa>
      </AbsoluteFill>
      {/* el contador mecánico (rodillos) */}
      {show > 0.01 && <div style={{ position: "absolute", left: W / 2 + 120, top: 540, transform: `translate(-50%,-50%) perspective(1600px) rotateY(-12deg) scale(${k1(t, m.prueba)})`, display: "flex", gap: 14 }}>
        {dig.map((d, i) => d === ":" ? <div key={i} style={{ ...txt(170), alignSelf: "center" }}>:</div> :
          <div key={i} style={{ width: 150, height: 220, borderRadius: 18, background: "linear-gradient(180deg,#0d0b09,#2a2622 50%,#0d0b09)", boxShadow: "inset 0 0 0 4px #4a4239, 0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", ...txt(170, secs <= 40.5 ? "#8ff0a8" : "#fff") }}>{d}</div>)}
      </div>}
      <Rot t={t} at={m.mec} out={m.prueba - 0.2} text="LLENA DE PELO" x={W / 2} y={960} size={76} col="#ddd6c8" />
      <Rot t={t} at={m.prueba} out={m.cuarenta - 0.2} text="LA PRUEBA" x={W / 2 + 120} y={210} size={72} />
      <Rot t={t} at={m.cuarenta} out={b - 0.3} text="40 SEGUNDOS" x={W / 2 + 120} y={210} size={84} col="#8ff0a8" />
    </Stage>
  );
};

// ---------- 18:12 EL SELLO DE AGUA: la curva guarda agua contra el olor; se evapora; un minuto por semana; la cucharada de aceite ----------
export const Sello: React.FC<{ t: number; a: number; b: number; m: { tapon: number; evap: number; semana: number; p21: number; aceite: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7);
  const lvl = 1 - e(t, m.evap, m.evap + 3) + e(t, m.semana, m.semana + 1.5) - 0 * 0; // 1 lleno → 0 seco → 1
  const level = Math.max(0, Math.min(1, lvl)), oil = e(t, m.aceite, m.aceite + 1.2);
  const smellUp = 1 - level; // con la curva seca, el olor sube libre
  const weeks = Math.round(4 * e(t, m.evap, m.evap + 3));
  return (
    <Stage t={t} a={a} b={b} tint="#e6f0ff">
      <div style={{ position: "absolute", left: W / 2 - 150 * e(t, m.p21, m.p21 + 0.8), top: 560, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${-8 + 4 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 500}px)` }}>
        <svg width={900} height={620} viewBox="0 0 900 620">
          <defs><clipPath id="u"><path d="M180 0 V330 A170 170 0 0 0 520 330 V200 H900 V140 H460 V330 A110 110 0 0 1 240 330 V0 Z" /></clipPath></defs>
          {/* el agua quieta de la curva */}
          <g clipPath="url(#u)">
            <rect x={0} y={330 + 170 - 200 * level} width={900} height={400} fill="#5fb4ff" opacity={0.75} />
            {oil > 0.01 && <rect x={0} y={330 + 170 - 200 * level - 16 * oil} width={900} height={16 * oil} fill="#f0b040" />}
          </g>
          <path d="M180 0 V330 A170 170 0 0 0 520 330 V200 H900 M240 0 V330 A110 110 0 0 0 460 330 V140 H900" fill="none" stroke="#dfe8ee" strokeWidth={10} strokeLinecap="round" />
          {/* el olor del caño grande: volutas verdes que suben desde la derecha */}
          {Array.from({ length: 9 }, (_, i) => { const ph = ((t - a) * 0.4 + i / 9) % 1; const blocked = level > 0.35; const x = 860 - ph * (blocked ? 280 : 620), y = 170 - (blocked ? 0 : Math.max(0, (x < 520 ? (520 - x) * 0.9 : 0))); const o = (1 - ph) * (blocked && x < 600 ? 0 : 0.8); return <circle key={i} cx={x} cy={Math.max(-40, y)} r={18 + 10 * Math.sin(i + t)} fill="#7fbf6a" opacity={o * (0.4 + 0.6 * (blocked ? 1 : smellUp))} />; })}
        </svg>
      </div>
      {t > m.evap && t < m.semana + 1 && <div style={{ position: "absolute", left: 1560, top: 300, ...txt(84), opacity: e(t, m.evap, m.evap + 0.3) * (1 - e(t, m.semana, m.semana + 0.8)), transform: `scale(${k1(t, m.evap)})` }}>{weeks} SEM.</div>}
      <Rot t={t} at={m.tapon} out={m.evap - 0.2} text="UN TAPÓN DE AGUA" x={W / 2} y={140} size={76} col="#cfe6ff" />
      <Rot t={t} at={m.evap} out={m.semana - 0.2} text="SE EVAPORA" x={W / 2} y={140} size={80} />
      <Rot t={t} at={m.semana} out={m.aceite - 0.2} text="UN MINUTO POR SEMANA" x={W / 2} y={140} size={72} col="#8ff0a8" />
      <Pagina t={t} at={m.p21} out={m.aceite - 0.2} page="p21" x={1540} y={560} w={410} />
      <Rot t={t} at={m.aceite} out={b - 0.3} text="UNA CUCHARADA DE ACEITE" x={W / 2} y={140} size={68} col="#ffcf7a" />
    </Stage>
  );
};

// ---------- 19:44 EL SIFÓN EN DESPIECE: las dos tuercas a mano, la curva al balde, las gomitas en orden; lo que apareció en 30 años ----------
const HALL = [{ n: "UN ANILLO", c: "#e8c14a" }, { n: "UN DIENTE DE TENEDOR", c: "#c9cdd2" }, { n: "UNA TAPITA", c: "#d23a2a" }, { n: "EL CONTROL REMOTO", c: "#2a5ad2" }];
export const Sifon: React.FC<{ t: number; a: number; b: number; m: { mano: number; vacia: number; gomita: number; seis: number; acordeon: number; hallazgo: number[] } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.15, 0.85, 1.9], l: [0, 0.42, 0], fov: 34 }, 0.6);
  const nuts = e(t, m.mano, m.mano + 1.6), down = e(t, m.vacia - 0.6, m.vacia + 0.6), back = e(t, m.seis - 1.4, m.seis);
  const sep = nuts * (1 - back), lowU = down * (1 - back);
  const gom = e(t, m.gomita, m.gomita + 0.5) * (1 - e(t, m.seis, m.seis + 0.5));
  const hall = e(t, m.hallazgo[0] - 0.8, m.hallazgo[0]);
  return (
    <Stage t={t} a={a} b={b} tint="#ffe0bc">
      <AbsoluteFill style={{ opacity: 1 - hall, transform: `scale(${1 - 0.1 * hall})` }}>
        <Mesa cam={cam} floor="mueble">
          <Trapo p={[0.1, 0.004, 0.1]} s={1.3} rot={0.1} />
          <Balde p={[0.05, 0, 0.05]} s={0.75} fill={0.3 * down} fillCol="#5d5a50" />
          {/* caño que baja de la pileta (izq) y el que va a la pared (der) */}
          <Bx p={[-0.22, 0.85, 0]} s={[0.07, 0.5, 0.07]} c="#c9cdd0" ro={0.38} r={0.03} />
          <Bx p={[0.45, 0.5, 0]} s={[0.4, 0.07, 0.07]} c="#c9cdd0" ro={0.38} r={0.03} />
          {/* la curva en U: baja al balde */}
          <group position={[0, 0.5 - 0.32 * lowU, 0]} rotation={[0, 0, 0.15 * lowU]}>
            <mesh rotation={[0, 0, Math.PI]} position={[0, 0.0, 0]}><torusGeometry args={[0.22, 0.036, 16, 40, Math.PI]} /><meshPhysicalMaterial color="#c9cdd0" roughness={0.38} clearcoat={0.5} /></mesh>
            <Bx p={[-0.22, 0.06, 0]} s={[0.072, 0.13, 0.072]} c="#c9cdd0" ro={0.38} r={0.03} />
            <Bx p={[0.22, 0.06, 0]} s={[0.072, 0.13, 0.072]} c="#c9cdd0" ro={0.38} r={0.03} />
            {/* gomitas */}
            {[-0.22, 0.22].map((x, i) => <mesh key={i} position={[x, 0.13 + 0.06 * gom, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.008, 10, 32]} /><meshStandardMaterial color="#1c1c1c" emissive="#ff9a3c" emissiveIntensity={0.9 * gom} /></mesh>)}
          </group>
          {/* las dos tuercas grandes: giran y suben al aflojarse */}
          {[-0.22, 0.22].map((x, i) => <mesh key={"n" + i} position={[x, 0.64 + 0.12 * sep, 0]} rotation={[0, sep * 8 * (i ? -1 : 1), 0]}><cylinderGeometry args={[0.058, 0.058, 0.06, 10]} /><meshPhysicalMaterial color="#d8d6cf" roughness={0.35} clearcoat={0.4} /></mesh>)}
        </Mesa>
      </AbsoluteFill>
      {/* los hallazgos de 30 años: cada uno cae en su palabra */}
      {hall > 0.01 && HALL.map((h, i) => t > m.hallazgo[i] - 0.3 && (
        <Card key={h.n} t={t} at={m.hallazgo[i]} x={330 + i * 420} y={560} w={340} ry={(i - 1.5) * -8}>
          <div style={{ height: 160, borderRadius: 16, background: `radial-gradient(circle at 40% 35%, ${h.c}, #111 85%)`, marginBottom: 18 }} />
          <div style={{ ...txt(38), textAlign: "center" }}>{h.n}</div>
          {i === 3 && <div style={{ ...txt(30, "#ffb257"), textAlign: "center", marginTop: 8 }}>EN EL 95</div>}
        </Card>))}
      <Rot t={t} at={m.mano} out={m.gomita - 0.2} text="CON LA MANO, NUNCA PINZA" x={W / 2} y={150} size={64} />
      <Rot t={t} at={m.gomita} out={m.seis - 0.2} text="LAS GOMITAS EN ORDEN" x={W / 2} y={150} size={70} col="#ffcf9a" />
      <Rot t={t} at={m.seis} out={m.acordeon - 0.2} text="CADA SEIS MESES" x={W / 2} y={150} size={72} />
      <Rot t={t} at={m.acordeon} out={m.hallazgo[0] - 0.4} text="ACORDEÓN: SÓLO AGUA CALIENTE" x={W / 2} y={150} size={62} col="#ffd9a8" />
      <Rot t={t} at={m.hallazgo[0] - 0.6} out={b - 0.3} text="EN 30 AÑOS" x={W / 2} y={190} size={76} />
    </Stage>
  );
};

// ---------- 20:52 LAS CUENTAS: dos tickets que se imprimen; el del plomero larguísimo, el nuestro de tres renglones ----------
export const Recibo: React.FC<{ t: number; a: number; b: number; m: { plomero: number; hoy: number; balde: number } }> = ({ t, a, b, m }) => {
  const r1 = e(t, m.plomero, m.plomero + 2.2), r2 = e(t, m.hoy, m.hoy + 1.6);
  const L1 = ["VISITA", "DESTAPE", "MATERIAL", "URGENCIA", "= UN MES DE SÚPER"], L2 = ["DETERGENTE", "UN FRASCO DE FARMACIA", "½ TAZA BICARBONATO"];
  const ticket = (x: number, rows: string[], p: number, col: string, ry: number) => (
    <div style={{ position: "absolute", left: x, top: 130, width: 520, transformOrigin: "50% 0", transform: `translateX(-50%) scale(1.55) perspective(1600px) rotateY(${ry + 3 * Math.sin(t * 0.4)}deg)` }}>
      <div style={{ height: 40, borderRadius: 12, background: "#2a2622", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <div style={{ margin: "0 24px", height: 70 + rows.length * 76 * p, overflow: "hidden", background: "linear-gradient(180deg,#f3efe6,#e9e3d6)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),95% 100%,90% calc(100% - 12px),85% 100%,80% calc(100% - 12px),75% 100%,70% calc(100% - 12px),65% 100%,60% calc(100% - 12px),55% 100%,50% calc(100% - 12px),45% 100%,40% calc(100% - 12px),35% 100%,30% calc(100% - 12px),25% 100%,20% calc(100% - 12px),15% 100%,10% calc(100% - 12px),5% 100%,0 calc(100% - 12px))" }}>
        <div style={{ padding: "26px 30px", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 29, color: "#2a2622", lineHeight: "76px", whiteSpace: "nowrap" }}>
          {rows.map((r, i) => <div key={i} style={{ color: i === rows.length - 1 && col ? col : "#2a2622", borderTop: i === rows.length - 1 ? "3px dashed #8a8276" : undefined }}>{r}</div>)}
        </div>
      </div>
    </div>
  );
  return (
    <Stage t={t} a={a} b={b} tint="#ffe6c4">
      {t > m.plomero - 0.2 && ticket(540, L1, r1, "#c0392b", 10)}
      {t > m.hoy - 0.2 && ticket(1380, L2, r2, "", -10)}
      <Rot t={t} at={m.plomero} out={m.hoy - 0.2} text="SÓLO POR VENIR" x={540} y={950} size={64} col="#ff8a6a" />
      <Rot t={t} at={m.hoy} out={b - 0.3} text="LO DE HOY" x={1380} y={950} size={64} col="#8ff0a8" />
      <Rot t={t} at={m.balde} out={b - 0.3} text="UN BALDE Y 10 MINUTOS" x={W / 2} y={110} size={68} />
    </Stage>
  );
};

// ---------- 21:40 LA SOPAPA: manómetro — con aire se escapa, con agua empuja; 15 a 20 veces; remolino = ganaste ----------
export const Manometro: React.FC<{ t: number; a: number; b: number; m: { agua: number; bien: number; veces: number; remolino: number; quimico: number } }> = ({ t, a, b, m }) => {
  const water = e(t, m.bien, m.bien + 1.2);
  const pumping = t > m.veces && t < m.remolino;
  const pulse = pumping ? Math.max(0, Math.sin((t - m.veces) * Math.PI * 2 * 1.4)) : 0;
  const press = (t < m.agua ? 0.15 + 0.12 * Math.max(0, Math.sin((t - a) * 7)) : 0.25) * (1 - water) + water * (0.45 + 0.5 * pulse);
  const count = pumping ? Math.min(20, Math.floor((t - m.veces) * 1.4) + 1) : t >= m.remolino ? 20 : 0;
  const ang = -120 + 240 * press, win2 = e(t, m.remolino, m.remolino + 0.6), no = e(t, m.quimico, m.quimico + 0.4);
  return (
    <Stage t={t} a={a} b={b} tint="#ffd9a8">
      {/* el manómetro */}
      <div style={{ position: "absolute", left: 700, top: 560, width: 520, height: 520, transform: `translate(-50%,-50%) perspective(1600px) rotateY(10deg) scale(${k1(t, a + 0.1, 0.8)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f7f2e6,#d9cfb8 70%,#a8987a)", boxShadow: "inset 0 0 0 18px #3a352f, inset 0 0 0 24px #8a8276, 0 50px 90px rgba(0,0,0,.6)" }} />
        {Array.from({ length: 13 }, (_, i) => { const an = -120 + i * 20; return <div key={i} style={{ position: "absolute", left: 258, top: 260, width: 4, height: 0, transform: `rotate(${an}deg)` }}><div style={{ position: "absolute", left: 0, top: -210, width: 4, height: i % 3 ? 18 : 34, background: i > 8 ? "#2e9a52" : "#3a352f" }} /></div>; })}
        <div style={{ position: "absolute", left: 254, top: 70, width: 12, height: 192, borderRadius: 6, background: "linear-gradient(#e0261a,#8a0f08)", transformOrigin: "50% 100%", transform: `rotate(${ang}deg)` }} />
        <div style={{ position: "absolute", left: 225, top: 226, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#555,#111)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", ...txt(44, water > 0.5 ? "#2e7a42" : "#8a4a2a") }}>{water > 0.5 ? "AGUA" : "AIRE"}</div>
      </div>
      {/* el contador de empujes */}
      {count > 0 && <div style={{ position: "absolute", left: 1400, top: 480, transform: `translate(-50%,-50%) scale(${1 + 0.08 * pulse})`, textAlign: "center" }}><div style={txt(200)}>{count}</div><div style={txt(40, "#ffd9a8")}>EMPUJES</div></div>}
      {/* remolino: ganaste */}
      {win2 > 0.01 && <div style={{ position: "absolute", left: 1400, top: 820, transform: `translate(-50%,-50%) rotate(${t * 220}deg) scale(${k1(t, m.remolino)})`, width: 180, height: 180, borderRadius: "50%", border: "10px solid #5fb4ff", borderLeftColor: "transparent", borderBottomColor: "transparent", opacity: win2 * (1 - no) }} />}
      <Rot t={t} at={m.agua} out={m.bien - 0.2} text="EMPUJA AGUA, NO AIRE" x={W / 2} y={130} size={70} />
      <Rot t={t} at={m.veces} out={m.remolino - 0.2} text="RECTA, 15 A 20 VECES" x={W / 2} y={130} size={68} />
      <Rot t={t} at={m.remolino} out={m.quimico - 0.2} text="REMOLINO = GANASTE" x={W / 2} y={130} size={74} col="#8ff0a8" />
      <Rot t={t} at={m.quimico} out={b - 0.3} text="CON QUÍMICO, NO" x={W / 2} y={130} size={80} col="#ff6a50" />
    </Stage>
  );
};

// ---------- 22:40 EL INODORO EN ORDEN: llave de paso; 1 detergente + balde caliente; 2 la sopapa DE POLLERA (duelo con la plana); 3 el balde de golpe ----------
export const Inodoro: React.FC<{ t: number; a: number; b: number; m: { llave: number; uno: number; dos: number; pollera: number; tres: number } }> = ({ t, a, b, m }) => {
  const duel = e(t, m.dos, m.dos + 0.6) * (1 - e(t, m.tres - 0.5, m.tres));
  const leak = (t - m.dos) * 1.2;
  const plunger = (x: number, flange: boolean, good: number) => (
    <div style={{ position: "absolute", left: x, top: 560, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k1(t, m.dos + (flange ? 0.4 : 0.2), 0.8))) * 500}px) translateY(${18 * Math.sin(t * 5 + x)}px)` }}>
      <svg width={380} height={520} viewBox="0 0 380 520">
        <rect x={178} y={0} width={24} height={300} rx={8} fill="#a07040" />
        <path d="M70 300 Q190 220 310 300 L310 330 Q190 300 70 330 Z" fill="#c0392b" />
        {flange && <path d="M140 330 Q190 315 240 330 L230 390 Q190 400 150 390 Z" fill="#a52d22" />}
        <ellipse cx={190} cy={flange ? 470 : 380} rx={flange ? 60 : 150} ry={20} fill="#1a1612" opacity={0.6} />
        {/* burbujas de aire que se escapan por el borde de la plana */}
        {!flange && Array.from({ length: 8 }, (_, i) => { const ph = (leak * 0.8 + i / 8) % 1; return <circle key={i} cx={(i % 2 ? 60 : 320) + (i % 2 ? -1 : 1) * ph * 30} cy={330 - ph * 160} r={8 + 6 * ph} fill="#cfe8f5" opacity={(1 - ph) * 0.8} />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 530, textAlign: "center", ...txt(54, flange ? (good ? "#8ff0a8" : "#f6efe2") : "#ff6a50") }}>{flange ? (good ? "DE POLLERA" : "DE POLLERA") : "✕ LA PLANA"}</div>
    </div>
  );
  // balde de agua caliente: aparece en el paso 1 (humea), vuelve en el 3 y se vuelca de golpe
  const b1 = e(t, m.uno, m.uno + 0.3) * (1 - e(t, m.dos - 0.3, m.dos)), b3 = e(t, m.tres, m.tres + 0.3) * (1 - e(t, b - 0.5, b - 0.2));
  const tip = t > m.tres ? Math.min(1.05, spr(t, m.tres + 0.6, 0.9)) : 0;
  const balde = (o: number, tilt: number, det: boolean) => o > 0.01 && (
    <div style={{ position: "absolute", left: W / 2 + (det ? -90 : 140), top: 520, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - o) * 300}px) scale(0.84) rotate(${-62 * tilt}deg)`, transformOrigin: "30% 80%" }}>
      <svg width={520} height={520} viewBox="0 0 520 520">
        <path d="M120 170 L400 170 L370 470 Q260 495 150 470 Z" fill="#9aa4ad" />
        <path d="M120 170 L400 170 L396 205 L124 205 Z" fill="#c9d0d6" />
        <ellipse cx={260} cy={175} rx={140} ry={26} fill="#5c8fb0" />
        <path d="M118 170 Q260 40 402 170" fill="none" stroke="#6a7178" strokeWidth={10} />
        {Array.from({ length: 6 }, (_, i) => { const ph = ((t - a) * 0.45 + i / 6) % 1; return <circle key={i} cx={200 + (i % 3) * 60 + 18 * Math.sin(t * 2 + i)} cy={150 - ph * 140} r={22 + 30 * ph} fill="#ffffff" opacity={0.22 * (1 - ph) * (1 - tilt)} />; })}
        {tilt > 0.3 && Array.from({ length: 14 }, (_, i) => { const ph = ((t - m.tres) * 1.6 + i / 14) % 1; return <circle key={i} cx={110 - ph * 160} cy={180 + ph * ph * 300} r={16 - 8 * ph} fill="#7ab6d8" opacity={0.9 * (1 - ph)} />; })}
      </svg>
      {det && <div style={{ position: "absolute", left: 470, top: 260, width: 90, height: 210, borderRadius: "26px 26px 12px 12px", background: "linear-gradient(180deg,#4aa86a,#2e7a48)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${18 - 40 * e(t, m.uno + 0.8, m.uno + 1.6)}deg)` }} />}
    </div>);
  const steps: [number, string, string][] = [[m.uno, "1", "DETERGENTE + BALDE CALIENTE"], [m.dos, "2", "SOPAPA DE POLLERA"], [m.tres, "3", "BALDE DE GOLPE"]];
  return (
    <Stage t={t} a={a} b={b} tint="#e6eef4">
      {/* llave de paso que gira */}
      {t < m.uno && <div style={{ position: "absolute", left: W / 2, top: 560, transform: `translate(-50%,-50%) scale(${k1(t, m.llave)})` }}>
        <div style={{ width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#e8ecef,#9aa2a8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(${-90 * e(t, m.llave + 0.4, m.llave + 1.4)}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 240, height: 54, borderRadius: 27, background: "#c0392b" }} /></div>
      </div>}
      {balde(b1, 0, true)}{balde(b3, tip, false)}
      {duel > 0.01 && <AbsoluteFill style={{ opacity: duel }}>{plunger(640, false, 0)}{plunger(1280, true, t > m.pollera ? 1 : 0)}</AbsoluteFill>}
      {/* los tres pasos: chapitas abajo, la vigente encendida */}
      {t > m.uno - 0.2 && <div style={{ position: "absolute", left: W / 2, top: 160, transform: "translate(-50%,-50%)", display: "flex", gap: 30 }}>
        {steps.map(([at0, n, s], i) => { const on = t >= at0 && (i === 2 || t < steps[i + 1][0]); if (t < at0 - 0.2) return null; return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 26px", borderRadius: 18, background: on ? "#2e2924" : "rgba(46,41,36,.55)", boxShadow: on ? "0 0 0 4px #ffb257, 0 20px 40px rgba(0,0,0,.5)" : "none", transform: `scale(${(on ? 1 : 0.8) * Math.min(1, k1(t, at0))})` }}>
            <div style={txt(78, "#ffb257")}>{n}</div><div style={txt(on ? 54 : 40)}>{s}</div>
          </div>); })}
      </div>}
      <Rot t={t} at={m.llave} out={m.uno - 0.2} text="CIERRAS LA LLAVE DE PASO" x={W / 2} y={150} size={68} />
    </Stage>
  );
};

// ---------- 23:50 LA CAJA DEL VIEJO: en cada «Nunca» se abre un cajón ----------
const NUNCA = ["SIN SABER QUÉ ERA", "FORZAR UNA TUERCA", "SIFÓN SIN AGUA", "PROMETER «NUNCA MÁS»", "IRSE SIN EXPLICAR"];
export const CajaViejo: React.FC<{ t: number; a: number; b: number; m: { n: number[]; vuelve: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7);
  return (
    <Stage t={t} a={a} b={b} tint="#ffd2a0">
      <div style={{ position: "absolute", left: 560, top: 560, transform: `translate(-50%,-50%) scale(0.92) perspective(2000px) rotateX(16deg) rotateY(${22 + 4 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 600}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "relative", width: 620, height: 560, borderRadius: 14, background: "linear-gradient(160deg,#7a4a28,#4a2a14)", boxShadow: "0 60px 100px rgba(0,0,0,.65), inset 0 0 0 10px #3a200e", transformStyle: "preserve-3d" }}>
          {NUNCA.map((s, i) => { const o = e(t, m.n[i], m.n[i] + 0.5), cur = t >= m.n[i] && (i === 4 || t < m.n[i + 1]); return (
            <div key={s} style={{ position: "absolute", left: 30, top: 30 + i * 102, width: 560, height: 88, borderRadius: 8, background: cur ? "linear-gradient(180deg,#9a6a40,#6a4020)" : "linear-gradient(180deg,#86583a,#5a3418)", boxShadow: "inset 0 0 0 3px #3a200e", transform: `translateZ(${o * 140}px) translateX(${o * 60}px)` }}>
              <div style={{ position: "absolute", left: 250, top: 34, width: 60, height: 14, borderRadius: 7, background: "#d6b46a" }} />
            </div>); })}
        </div>
      </div>
      {/* lo que dice cada cajón */}
      {NUNCA.map((s, i) => t > m.n[i] - 0.1 && <div key={s} style={{ position: "absolute", left: 1000, top: 300 + i * 112, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 20, opacity: e(t, m.n[i], m.n[i] + 0.2) * (t > m.vuelve ? (i === 4 ? 1 : 0.35) : 1), transform: `translateX(${(1 - Math.min(1, k1(t, m.n[i]))) * 200}px)` }}>
        <div style={txt(44, "#ff6a50")}>NUNCA</div><div style={txt(46)}>{s}</div></div>)}
      <Rot t={t} at={a + 0.3} out={m.n[0] - 0.1} text="LO QUE NUNCA HACÍA" x={W / 2} y={130} size={64} col="#ffd9a8" />
      <Rot t={t} at={m.vuelve} out={b - 0.3} text="EL QUE NO EXPLICA, VUELVE" x={W / 2} y={130} size={68} col="#ffd9a8" />
    </Stage>
  );
};

// ---------- 24:46 EL ESPEJO BAJO EL BORDE: corte del inodoro, el espejito muestra la fila de agujeritos tapados de sarro ----------
export const Espejo: React.FC<{ t: number; a: number; b: number; m: { fila: number; chorro: number; sarro: number; p16: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), mir = e(t, m.fila - 0.3, m.fila + 0.8), sarro = e(t, m.sarro, m.sarro + 1.5), jet = e(t, m.chorro, m.chorro + 0.5);
  return (
    <Stage t={t} a={a} b={b} tint="#e6eef4">
      <div style={{ position: "absolute", left: W / 2 - 170 * e(t, m.p16, m.p16 + 0.8), top: 560, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${-8 + 4 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 500}px)` }}>
        <svg width={900} height={640} viewBox="0 0 900 640">
          {/* corte de la taza: borde hueco arriba, con su fila de agujeritos */}
          <path d="M100 120 Q450 60 800 120 L780 170 Q450 120 120 170 Z" fill="#e4e1da" stroke="#9c988f" strokeWidth={4} />
          <path d="M120 170 Q140 470 380 560 H520 Q760 470 780 170 Q450 120 120 170 Z" fill="#dedbd4" stroke="#9c988f" strokeWidth={4} />
          <path d="M180 200 Q200 440 400 520 H500 Q700 440 720 200" fill="none" stroke="#c6c2ba" strokeWidth={3} />
          {Array.from({ length: 11 }, (_, i) => { const x = 160 + i * 58, y = 160 - 22 * Math.sin((i / 10) * Math.PI); return <g key={i}><circle cx={x} cy={y} r={10} fill="#1a1612" /><circle cx={x} cy={y} r={10 * sarro * (0.5 + 0.5 * rnd(i))} fill="#d8c79a" /></g>; })}
          {/* el agujero grande del chorro, adelante abajo */}
          <ellipse cx={450} cy={520} rx={34} ry={14} fill="#1a1612" stroke={jet > 0.1 ? "#ffb257" : "none"} strokeWidth={6 * jet} />
          <ellipse cx={450} cy={520} rx={34 * sarro * 0.6} ry={14 * sarro * 0.6} fill="#d8c79a" />
          {/* el espejito de mano, que entra por abajo y refleja el borde */}
          <g transform={`translate(${430 + 30 * Math.sin(t * 0.6)},${700 - 420 * mir}) rotate(-20)`} opacity={mir}>
            <rect x={-8} y={60} width={16} height={180} rx={6} fill="#6a4a2a" />
            <ellipse cx={0} cy={30} rx={70} ry={44} fill="#cfe2ee" stroke="#8a8276" strokeWidth={6} />
            <ellipse cx={-14} cy={20} rx={30} ry={14} fill="#ffffff" opacity={0.6} />
          </g>
        </svg>
      </div>
      <Rot t={t} at={m.fila} out={m.sarro - 0.2} text="LOS AGUJERITOS DEL BORDE" x={W / 2} y={130} size={68} />
      <Rot t={t} at={m.sarro} out={m.p16 - 0.2} text="SARRO Y BABA" x={W / 2} y={130} size={80} col="#e8d6a8" />
      <Pagina t={t} at={m.p16} out={b - 0.3} page="p16" x={1540} y={560} w={410} />
    </Stage>
  );
};

// ---------- 25:12 LOS DOS DÍAS: día 1 y día 2 en dos hojas de calendario, NUNCA EL MISMO DÍA; el nivel del tanque ----------
export const DosDias: React.FC<{ t: number; a: number; b: number; m: { d1: number; d2: number; noche: number; palito: number; nivel: number } }> = ({ t, a, b, m }) => {
  const tank = e(t, m.nivel - 0.4, m.nivel + 0.4);
  const day = (x: number, at0: number, title: string, rows: string[], ry: number) => (
    <Card t={t} at={at0} out={m.nivel - 0.4} x={x} y={560} w={600} ry={ry} bg="#f6f1e6">
      <div style={{ margin: -30, marginBottom: 20, height: 90, borderRadius: "22px 22px 0 0", background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", ...txt(56) }}>{title}</div>
      {rows.map((r, i) => <div key={i} style={{ ...txt(38, "#2a2622"), textShadow: "none", padding: "12px 0", borderBottom: "2px dashed #d6cfbd", opacity: e(t, at0 + 0.4 + i * 0.6, at0 + 0.6 + i * 0.6) }}>{r}</div>)}
    </Card>
  );
  return (
    <Stage t={t} a={a} b={b} tint="#ffe0c0">
      {day(560, m.d1, "DÍA 1", ["½ TAZA POR EL REBALSE", "1 TAZA EN LA TAZA", "30 MINUTOS SIN TIRAR"], 10)}
      {day(1360, m.d2, "DÍA 2", ["LLAVE DE PASO", "2 TAZAS DE VINAGRE", "TODA LA NOCHE", "PALITO PLÁSTICO"], -10)}
      {t > m.d2 && t < m.nivel && <div style={{ position: "absolute", left: W / 2, top: 900, transform: `translate(-50%,-50%) rotate(-6deg) scale(${1.4 - 0.4 * Math.min(1, spr(t, m.d2 + 0.6, 1.2))})`, opacity: e(t, m.d2 + 0.6, m.d2 + 0.7), border: "8px solid #c0392b", borderRadius: 14, padding: "4px 26px", ...txt(64, "#ff6a50") }}>NUNCA EL MISMO DÍA</div>}
      {/* el tanque: el agua 2 o 3 cm debajo de la punta del tubo de rebalse */}
      {tank > 0.01 && <div style={{ position: "absolute", left: W / 2, top: 580, transform: `translate(-50%,-50%) scale(${k1(t, m.nivel)})`, opacity: tank }}>
        <svg width={860} height={560} viewBox="0 0 860 560">
          <rect x={60} y={40} width={580} height={480} rx={30} fill="#e4e1da" stroke="#9c988f" strokeWidth={6} />
          <rect x={80} y={210 + 8 * Math.sin(t * 1.4)} width={540} height={300} rx={10} fill="#5fb4ff" opacity={0.7} />
          <rect x={330} y={150} width={40} height={360} fill="#d8d6cf" stroke="#9c988f" strokeWidth={3} />
          <line x1={400} y1={150} x2={660} y2={150} stroke="#c0392b" strokeWidth={5} />
          <line x1={400} y1={210} x2={660} y2={210} stroke="#2e9a52" strokeWidth={5} />
          <line x1={650} y1={150} x2={650} y2={210} stroke="#f6efe2" strokeWidth={4} />
          <text x={670} y={196} fontFamily={FONT} fontWeight={900} fontSize={46} fill="#f6efe2">2–3 cm</text>
        </svg>
      </div>}
      <Rot t={t} at={m.nivel} out={b - 0.3} text="MIRA EL NIVEL" x={W / 2} y={130} size={76} />
    </Stage>
  );
};

// ---------- 26:21 EL BUCLE ALTO: en la casa, la manguera de la lavadora sube, hace la curva y el precinto la sujeta ----------
export const Bucle: React.FC<{ t: number; a: number; b: number; m: { alto: number; vuelve: number; precinto: number; dedos: number } }> = ({ t, a, b, m }) => {
  const L = ROOM.laundry;
  const cam: Pose = camPath([{ t: a - 0.4, ...ROOM.wide }, { t: a + 2, p: [L.p[0] + (L.p[0] - L.l[0]) * 0.3, L.p[1] + (L.p[1] - L.l[1]) * 0.3 + 0.1, L.p[2] + (L.p[2] - L.l[2]) * 0.3], l: [L.l[0], L.l[1] + 0.12, L.l[2]], fov: 40, arc: 0.4 }, { t: b + 1, p: [L.p[0] + (L.p[0] - L.l[0]) * 0.22 + 0.15, L.p[1] + (L.p[1] - L.l[1]) * 0.22 + 0.15, L.p[2] + (L.p[2] - L.l[2]) * 0.22], l: [L.l[0], L.l[1] + 0.18, L.l[2]], fov: 40 }], 1)(t);
  // loop: 0 = manguera tirada → 1 = curva alta; en «vuelve» baja un momento para mostrar el reflujo
  const loop = e(t, m.precinto, m.precinto + 1.4) - 0 * win(t, m.vuelve, m.vuelve + 1);
  return (
    <AbsoluteFill>
      <Casa t={t} cam={cam} ev={{ loop, focus: "laundry", focusAmt: 1, plugs: [0, 1, 2, 3, 4].map((i) => plugsOn(t, i)), flow: t > m.vuelve && t < m.precinto ? 1 : 0.4 }} />
      <Rot t={t} at={m.alto} out={m.vuelve - 0.2} text="EL BUCLE ALTO" x={W / 2} y={150} size={84} />
      <Rot t={t} at={m.vuelve} out={m.precinto - 0.2} text="EL AGUA SUCIA VUELVE" x={W / 2} y={150} size={72} col="#ff8a6a" />
      <Rot t={t} at={m.precinto} out={m.dedos - 0.2} text="UN PRECINTO" x={W / 2} y={150} size={84} col="#8ff0a8" />
      <Rot t={t} at={m.dedos} out={b - 0.3} text="APENAS UNOS DEDOS" x={W / 2} y={150} size={74} />
    </AbsoluteFill>
  );
};

// ---------- 27:35 EL EDIFICIO EN CORTE: la bajante tapada más abajo; el agua de arriba sale por lo de Elena; tu parte / la del edificio ----------
export const Edificio: React.FC<{ t: number; a: number; b: number; m: { bajante: number; tapa: number; tuyo: number; ati: number; edif: number; escrito: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), plug = e(t, m.tapa, m.tapa + 0.6), up = e(t, m.tuyo, m.tuyo + 1.4);
  const split = e(t, m.ati, m.ati + 0.6), edif = e(t, m.edif, m.edif + 0.6), note = e(t, m.escrito, m.escrito + 0.6);
  return (
    <Stage t={t} a={a} b={b} tint="#e6eef4">
      <div style={{ position: "absolute", left: 760 - 140 * note, top: 560, transform: `translate(-50%,-50%) perspective(2000px) rotateY(${12 + 4 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 600}px) scale(${0.86 - 0.08 * note})` }}>
        <svg width={820} height={900} viewBox="0 0 820 900">
          {/* pisos */}
          {Array.from({ length: 6 }, (_, i) => { const y = 40 + i * 140, elena = i === 2; return <g key={i}>
            <rect x={40} y={y} width={740} height={130} fill={elena ? "#3a3a34" : "#2c2b28"} stroke="#4a4842" strokeWidth={3} />
            <text x={60} y={y + 40} fontFamily={FONT} fontWeight={900} fontSize={54} fill={elena ? "#ffd27a" : "#c8bfb2"}>{elena ? "4º ELENA" : `${6 - i}º`}</text>
            {/* lavamanos de cada piso y su caño hasta la bajante */}
            <path d={`M200 ${y + 80} H320 L310 ${y + 104} H210 Z`} fill="#e4e1da" />
            <path d={`M260 ${y + 104} V${y + 118} H560`} fill="none" stroke={edif > 0.5 && false ? "#5fb4ff" : split > 0.5 ? "#8ff0a8" : "#9aa0a6"} strokeWidth={10} />
            {/* agua gris que sube en lo de Elena */}
            {elena && up > 0.01 && <rect x={214} y={y + 104 - 26 * up} width={92} height={26 * up} fill="#8a8a7a" />}
          </g>; })}
          {/* la bajante (vertical, común) */}
          <rect x={560} y={20} width={44} height={880} fill={edif > 0.1 ? `rgba(255,178,87,${0.4 + 0.6 * edif})` : "#9aa0a6"} />
          {/* agua que baja de arriba */}
          {t > m.bajante && Array.from({ length: 10 }, (_, i) => { const ph = ((t - m.bajante) * 0.5 + i / 10) % 1; const yy = 30 + ph * (plug > 0.5 ? 470 : 860); return <circle key={i} cx={582} cy={yy} r={12} fill="#5fb4ff" opacity={plug > 0.5 && yy > 440 ? 0 : 0.9} />; })}
          {/* el tapón, más abajo del piso de Elena */}
          {plug > 0.01 && <rect x={556} y={560} width={52} height={60 * plug} rx={8} fill="#6b5a3a" />}
          {split > 0.01 && <line x1={540} y1={20} x2={540} y2={880} stroke="#ffffff" strokeWidth={4} strokeDasharray="14 10" opacity={split} />}
        </svg>
      </div>
      {/* la nota por escrito */}
      {note > 0.01 && <Card t={t} at={m.escrito} x={1450} y={560} w={420} ry={-12} bg="#f6f1e6">
        <div style={{ ...txt(30, "#2a2622"), textShadow: "none", marginBottom: 14 }}>FECHA: ___/___</div>
        {["QUÉ DESAGÜE SUBE", "CUÁNDO PASA", "COPIA PARA MÍ"].map((s, i) => <div key={s} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32, color: "#2b3a55", padding: "10px 0", borderBottom: "2px solid #c9d6e2", opacity: e(t, m.escrito + 0.5 + i * 0.5, m.escrito + 0.7 + i * 0.5) }}>{s.toLowerCase()}</div>)}
      </Card>}
      <Rot t={t} at={m.bajante} out={m.ati - 0.2} text="LA BAJANTE" x={W / 2 + 360} y={160} size={78} />
      <Rot t={t} at={m.ati} out={m.edif - 0.1} text="HASTA LA PARED: TÚ" x={W / 2 + 360} y={160} size={66} col="#8ff0a8" />
      <Rot t={t} at={m.edif} out={m.escrito - 0.2} text="DEL EDIFICIO" x={W / 2 + 360} y={160} size={84} col="#ffb257" />
      <Rot t={t} at={m.escrito} out={b - 0.3} text="PÍDELO POR ESCRITO" x={1450} y={300} size={70} />
    </Stage>
  );
};

// ---------- 28:37 DOS DESTAPADORES: las dos botellas se acercan, una barrera de vidrio, chispazo; nunca juntos ----------
export const Destapadores: React.FC<{ t: number; a: number; b: number; m: { otro: number; nunca: number } }> = ({ t, a, b, m }) => {
  const close = e(t, m.otro, m.otro + 1.4), bar = Math.min(1.05, spr(t, m.nunca, 1.1)) * (t > m.nunca ? 1 : 0);
  const bottle = (x: number, col: string, dir: number) => (
    <div style={{ position: "absolute", left: x + dir * -180 * close * (1 - 0.3 * bar), top: 600, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k1(t, a + (dir > 0 ? 0.2 : 0.5), 0.8))) * 500}px) rotate(${dir * -8 * close + 2 * Math.sin(t * 2 + x)}deg)` }}>
      <svg width={300} height={627} viewBox="0 0 220 460">
        <rect x={80} y={0} width={60} height={50} rx={8} fill="#2a2622" />
        <path d="M70 50 H150 Q200 90 200 150 V430 Q200 455 175 455 H45 Q20 455 20 430 V150 Q20 90 70 50 Z" fill={col} />
        <rect x={40} y={200} width={140} height={140} rx={10} fill="#f6f1e6" opacity={0.85} />
        <path d="M110 230 L140 300 H80 Z" fill="none" stroke="#c0392b" strokeWidth={8} />
      </svg>
    </div>
  );
  return (
    <Stage t={t} a={a} b={b} tint="#ffd2b0">
      {bottle(620, "#3a6ad2", 1)}{bottle(1300, "#d2a23a", -1)}
      {/* chispazo entre las dos antes de la barrera */}
      {close > 0.6 && bar < 0.5 && Array.from({ length: 14 }, (_, i) => { const an = rnd(i) * 6.28, r = 40 + 120 * ((t * 3 + rnd(i, 2)) % 1); return <div key={i} style={{ position: "absolute", left: W / 2 + r * Math.cos(an), top: 560 + r * Math.sin(an), width: 14, height: 14, borderRadius: "50%", background: "#ffe08a", boxShadow: "0 0 18px #ffb030" }} />; })}
      {/* la barrera de vidrio */}
      {bar > 0.01 && <div style={{ position: "absolute", left: W / 2 - 45, top: 140, width: 90, height: 840, transform: `scaleY(${bar})`, transformOrigin: "50% 100%", background: "linear-gradient(90deg,rgba(220,240,255,.35),rgba(240,250,255,.85) 30%,rgba(220,240,255,.45) 60%,rgba(220,240,255,.3))", border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 0 40px rgba(180,220,255,.5)", borderRadius: 10 }} />}
      <Rot t={t} at={m.otro} out={m.nunca - 0.2} text="OTRO ENCIMA" x={W / 2} y={140} size={80} col="#ff8a6a" />
      <Rot t={t} at={m.nunca} out={b - 0.3} text="NUNCA JUNTOS" x={W / 2} y={140} size={90} col="#ff6a50" />
    </Stage>
  );
};

// ---------- 29:09 CTA2: la puerta del mueble se abre y adentro está pegada la tabla de nunca mezclar (p7); QR ----------
export const Puerta: React.FC<{ t: number; a: number; b: number; m: { p7: number; puerta: number; qr: number } }> = ({ t, a, b, m }) => {
  const open = e(t, m.puerta, m.puerta + 1.2), qr = Math.min(1, spr(t, m.qr, 0.8)) * (t > m.qr ? 1 : 0);
  return (
    <Stage t={t} a={a} b={b} tint="#ffe0bc">
      <div style={{ position: "absolute", left: 1000, top: 560, perspective: 2200, transform: `translate(-50%,-50%) scale(${k1(t, a + 0.1, 0.7)})` }}>
        {/* interior del mueble con los productos */}
        <div style={{ position: "relative", width: 640, height: 760, background: "linear-gradient(180deg,#3a2c1e,#1e160e)", boxShadow: "inset 0 0 60px rgba(0,0,0,.8), 0 50px 90px rgba(0,0,0,.6)", borderRadius: 10, transformStyle: "preserve-3d" }}>
          {["#d2a23a", "#3a6ad2", "#2e9a52", "#6b3510"].map((c, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 140, bottom: 40, width: 90, height: 200 + (i % 2) * 50, borderRadius: "30px 30px 12px 12px", background: c, opacity: 0.85 }} />)}
          {/* la puerta: gira; por dentro tiene la p7 pegada con cinta */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-150 * open}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(160deg,#d8cbb1,#bba98a)", borderRadius: 10, boxShadow: "inset 0 0 0 14px #c9b99c" }}><div style={{ position: "absolute", right: 40, top: 360, width: 20, height: 80, borderRadius: 10, background: "#8a8276" }} /></div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#bba98a", borderRadius: 10 }}>
              <div style={{ position: "absolute", left: 70, top: 70, width: 500, height: 620, background: "#f6f1e6", transform: "rotate(-2deg)", boxShadow: "0 10px 20px rgba(0,0,0,.35)", overflow: "hidden" }}><Img src={staticFile(P + "libro/p7.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              {[[80, 60], [490, 60]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 34, background: "rgba(240,230,190,.75)", transform: `rotate(${i ? 12 : -12}deg)` }} />)}
            </div>
          </div>
        </div>
      </div>
      {qr > 0.01 && <div style={{ position: "absolute", left: 1540, top: 470, transform: `translate(-50%,-50%) translateX(${(1 - qr) * 300}px)`, opacity: Math.min(1, qr * 1.4) }}>
        <div style={{ width: 400, height: 400, padding: 22, borderRadius: 26, background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,.6), 0 0 0 6px #ffb257" }}><Img src={staticFile(P + "libro/qr.png")} style={{ width: "100%", height: "100%" }} /></div>
      </div>}
      <Rot t={t} at={m.p7} out={b - 0.3} text="LA TABLA DE NUNCA MEZCLAR" x={W / 2} y={110} size={64} col="#ffd9a8" />
      <Rot t={t} at={m.qr + 0.4} out={b - 0.2} text="LINK EN LA DESCRIPCIÓN" x={1540} y={730} size={36} />
    </Stage>
  );
};
