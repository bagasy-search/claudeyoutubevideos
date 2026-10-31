// ctr31a · PIEZAS 4 (29:55 → final). Mismo contrato: Stage + f(t) + momentos por m.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Casa, ROOM, W, Pose, camPath, screenOf, V3 } from "./casa";
import { Mesa, Bx, Balde, CanoVidrio, orbit } from "./mesa3d";
import { Stage, Rot } from "./base";
import { FONT, P, e, spr } from "./lib";
import { plugsOn } from "./marks";

const k1 = (t: number, a: number, s = 1) => Math.min(1.06, spr(t, a, s));
const txt = (size: number, col = "#f6efe2"): React.CSSProperties => ({ fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1.1, textShadow: "0 3px 0 rgba(0,0,0,.35)" });
const Pagina: React.FC<{ t: number; at: number; out: number; page: string; x: number; y: number; w?: number; rot?: number }> = ({ t, at: a, out, page, x, y, w = 420, rot = -5 }) => {
  const k = k1(t, a, 0.8), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.33, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - k) * 380}px) rotateY(${(1 - k) * -55 + 5 * Math.sin(t * 0.4)}deg) rotateZ(${rot * k}deg)`, background: "#f6f1e6", borderRadius: 6, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <Img src={staticFile(P + "libro/" + page + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

// ---------- 30:04 LA SONDA: el resorte entra por el caño de la pared girando siempre para el mismo lado; se frena, sigue, engancha ----------
const Resorte: React.FC<{ len: number; spin: number }> = ({ len, spin }) => {
  const g = useMemo(() => {
    const n = Math.max(8, Math.round(len * 260)), pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) { const u = i / n, x = -u * len, a = u * len * 260; pts.push(new THREE.Vector3(x, 0.012 * Math.cos(a), 0.012 * Math.sin(a))); }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, 0.0045, 6, false);
  }, [Math.round(len * 100)]);
  return <mesh geometry={g} rotation={[spin, 0, 0]} castShadow><meshStandardMaterial color="#b9bec4" metalness={0.95} roughness={0.25} /></mesh>;
};
export const Sonda: React.FC<{ t: number; a: number; b: number; m: { resorte: number; pared: number; gira: number; frena: number; saca: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.05, 0.66, 1.5], l: [-0.22, 0.42, 0], fov: 36 }, 0.6);
  // cuánto resorte entró: avanza, se frena en el tapón (0,62), lo pasa y después sale
  const push = 0.12 + 0.5 * e(t, m.pared, m.gira + 2) + 0.38 * e(t, m.frena + 2.5, m.frena + 4.5) - 0.9 * e(t, m.saca, m.saca + 3);
  const L = Math.max(0.08, Math.min(1.0, push)), turning = t > m.gira - 0.3 && t < m.saca + 3;
  const spin = turning ? (t - m.gira) * 7 : 0, stuck = t > m.frena && t < m.frena + 2.6;
  const clogX = 0.4 - 0.62, hooked = e(t, m.frena + 2.6, m.frena + 3.2), out = e(t, m.saca, m.saca + 3);
  return (
    <Stage t={t} a={a} b={b} tint="#ffe0bc">
      <Mesa cam={cam} floor="mueble">
        {/* la pared con el caño que entra */}
        <Bx p={[-0.75, 0.5, 0]} s={[0.06, 1.2, 0.8]} c="#d8cdb8" ro={0.8} />
        <CanoVidrio p={[-0.2, 0.42, 0]} len={1.1} r={0.07}>
          {/* el tapón: grasa y pelo; vibra cuando la sonda lo toca, y sale enganchado */}
          <mesh position={[clogX + (stuck ? 0.004 * Math.sin(t * 60) : 0) + (0.95 * out) * hooked, 0, 0]} scale={[0.08, 0.06, 0.06]}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial color="#6b5a3a" roughness={0.95} /></mesh>
        </CanoVidrio>
        {/* el resorte (sale desde la boca del caño, x=0,35, hacia adentro) */}
        <group position={[0.35, 0.42, 0]}><Resorte len={L} spin={spin} /></group>
        {/* la manivela, que gira siempre para el mismo lado */}
        <group position={[0.42, 0.42, 0]} rotation={[spin, 0, 0]}>
          <Bx p={[0, 0, 0]} s={[0.08, 0.05, 0.05]} c="#c0392b" ro={0.4} r={0.015} />
          <Bx p={[0.03, 0.07, 0]} s={[0.02, 0.14, 0.02]} c="#2a2622" m={0.6} ro={0.3} />
          <Bx p={[0.07, 0.14, 0]} s={[0.08, 0.025, 0.025]} c="#2a2622" m={0.6} ro={0.3} />
        </group>
        <Balde p={[0.3, 0, 0.18]} s={0.6} fill={0.3 * out} fillCol="#5d5a50" />
      </Mesa>
      {/* flecha de giro: siempre el mismo sentido */}
      {turning && <div style={{ position: "absolute", left: 1500, top: 330, width: 170, height: 170, borderRadius: "50%", border: "12px solid #ffb257", borderRightColor: "transparent", transform: `rotate(${(t - m.gira) * 220}deg)`, opacity: e(t, m.gira, m.gira + 0.3) * (1 - out) }} />}
      <Rot t={t} at={m.resorte} out={m.pared - 0.2} text="LA SONDA" x={W / 2} y={150} size={88} />
      <Rot t={t} at={m.pared} out={m.gira - 0.2} text="POR EL CAÑO DE LA PARED" x={W / 2} y={150} size={66} />
      <Rot t={t} at={m.gira} out={m.frena - 0.2} text="GIRAS SIEMPRE IGUAL" x={W / 2} y={150} size={74} col="#ffcf9a" />
      <Rot t={t} at={m.frena} out={m.saca - 0.2} text="SE FRENA: NO FUERCES" x={W / 2} y={150} size={72} col="#ff8a6a" />
      <Rot t={t} at={m.saca} out={b - 0.3} text="SALE SUCIA: EL BALDE" x={W / 2} y={150} size={70} />
    </Stage>
  );
};

// ---------- 30:45 CUÁNDO LLAMAR: cuatro señales se encienden como luces de tablero; el plomero con máquina; página 55 ----------
const SENAL = ["DOS DESAGÜES A LA VEZ", "SUBE CON LA LAVADORA", "SE FRENA SIEMPRE LEJOS", "INODORO FLOJO U OLOR"];
export const Llamar: React.FC<{ t: number; a: number; b: number; m: { s: number[]; maquina: number; p55: number } }> = ({ t, a, b, m }) => {
  const shift = e(t, m.p55, m.p55 + 0.8);
  return (
    <Stage t={t} a={a} b={b} tint="#ffd2b0">
      <div style={{ position: "absolute", left: W / 2 - 230 * shift, top: 540, transform: `translate(-50%,-50%) perspective(1800px) rotateX(10deg) rotateY(${-6 + 3 * Math.sin(t * 0.3)}deg) scale(${k1(t, a + 0.1, 0.8)})`, width: 1100, padding: 40, borderRadius: 30, background: "linear-gradient(160deg,#2e2924,#15120f)", boxShadow: "0 60px 100px rgba(0,0,0,.6), inset 0 0 0 4px #4a4239" }}>
        {SENAL.map((s, i) => { const on = e(t, m.s[i], m.s[i] + 0.25), blink = on * (0.75 + 0.25 * Math.sin((t - m.s[i]) * 9)); return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 30, padding: "18px 10px", borderBottom: i < 3 ? "2px solid #3a342e" : undefined }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: on > 0.1 ? `radial-gradient(circle at 40% 35%,#ffb0a0,#e0261a ${60 * blink}%,#5a0a05)` : "#2a1a16", boxShadow: on > 0.1 ? `0 0 ${50 * blink}px #ff3a20` : "inset 0 0 12px #000", transform: `scale(${t > m.s[i] ? Math.min(1.06, k1(t, m.s[i], 1.4)) : 0.85})` }} />
            <div style={{ ...txt(50, on > 0.1 ? "#f6efe2" : "#5a524a") }}>{s}</div>
          </div>); })}
        {t > m.maquina && <div style={{ marginTop: 26, padding: "18px 30px", borderRadius: 18, background: "#c26a1a", ...txt(54), textAlign: "center", transform: `scale(${k1(t, m.maquina)})` }}>PLOMERO CON MÁQUINA</div>}
      </div>
      <Pagina t={t} at={m.p55} out={b - 0.3} page="p55" x={1580} y={560} w={400} />
      <Rot t={t} at={m.s[0] - 0.5} out={m.maquina - 0.2} text="¿CUÁNDO LLAMAR?" x={W / 2} y={120} size={80} col="#ffd9a8" />
      <Rot t={t} at={m.maquina} out={b - 0.3} text="NO ES FRACASO" x={W / 2 - 230 * shift} y={120} size={80} col="#ffd9a8" />
    </Stage>
  );
};

// ---------- 31:23 LOS COMENTARIOS: cada pregunta llega como globo y la respuesta la ata a su número ----------
const PREG: [string, string][] = [["«TENGO 68 Y NUNCA TIRO EL ACEITE»", "Nº 4"], ["«SE ME VUELVE A TAPAR»", "Nº 12"], ["«¿VINAGRE DE COCINA O DE LIMPIEZA?»", "LOS DOS"], ["«¿CADA CUÁNTO, DE PREVENCIÓN?»", "Nº 20"]];
export const Comentarios: React.FC<{ t: number; a: number; b: number; m: { q: number[]; r: number[]; pais: number } }> = ({ t, a, b, m }) => {
  let cur = -1; m.q.forEach((x, i) => { if (t >= x - 0.3) cur = i; });
  return (
    <Stage t={t} a={a} b={b} tint="#ffe6c4">
      {PREG.map(([q, r], i) => { if (t < m.q[i] - 0.3) return null; const d = cur - i, k = k1(t, m.q[i] - 0.3, 0.9), ra = t > m.r[i] ? k1(t, m.r[i], 1.1) : 0; return (
        <div key={q} style={{ position: "absolute", left: W / 2 - 120, top: 540 - d * 200, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - Math.min(1, k)) * 400}px) rotateX(${d * 14}deg) scale(${1 - 0.14 * d})`, opacity: d >= 2 ? 0 : 1 - 0.45 * d, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: `hsl(${i * 70 + 20},45%,55%)`, flexShrink: 0, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
          <div style={{ padding: "26px 36px", borderRadius: "30px 30px 30px 6px", background: "#f6f1e6", maxWidth: 980, ...txt(56, "#2a2622"), textShadow: "none", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>{q}</div>
          {ra > 0.01 && <div style={{ padding: "18px 26px", borderRadius: 20, background: "#c0392b", ...txt(58), transform: `scale(${ra}) rotate(${-6 * ra}deg)`, boxShadow: "0 0 0 5px #ffb257" }}>{r}</div>}
        </div>); })}
      {/* al final: el mapa de puntitos de los países que escriben */}
      {t > m.pais && <div style={{ position: "absolute", left: W / 2, top: 900, transform: "translate(-50%,-50%)", display: "flex", gap: 22, opacity: e(t, m.pais, m.pais + 0.4) }}>
        {["MX", "AR", "CO", "PE", "CL", "ES", "EC", "UY"].map((c, i) => <div key={c} style={{ padding: "10px 18px", borderRadius: 14, background: "#2e2924", ...txt(48, "#ffd9a8"), transform: `translateY(${(1 - Math.min(1, k1(t, m.pais + i * 0.12, 1.2))) * 200}px)` }}>{c}</div>)}
      </div>}
      <Rot t={t} at={m.q[0] - 0.8} out={m.pais - 0.2} text="LO QUE ME ESCRIBEN" x={W / 2} y={110} size={74} col="#ffd9a8" />
      <Rot t={t} at={m.pais} out={b - 0.3} text="¿DESDE QUÉ PAÍS?" x={W / 2} y={110} size={80} />
    </Stage>
  );
};

// ---------- 32:51 EL CAÑO A ESCALA: el hilito por abajo deja seca la parte de arriba; la tarja suelta llena el caño y arrastra la capa ----------
export const CanoEscala: React.FC<{ t: number; a: number; b: number; m: { hilito: number; arriba: number; tarja: number; arrastra: number; olla: number; peso: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), grease = 0.55 + 0.45 * e(t, m.arriba, m.arriba + 2.5);
  const full = e(t, m.tarja, m.tarja + 0.8), clean = e(t, m.arrastra, m.arrastra + 2.4);
  const olla = e(t, m.olla, m.olla + 0.6) * (1 - e(t, m.peso, m.peso + 0.5));
  return (
    <Stage t={t} a={a} b={b} tint="#e6f0ff">
      <div style={{ position: "absolute", left: W / 2, top: 560, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${-10 + 4 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 500}px) scale(${1 - 0.25 * olla}) translateX(${-420 * olla}px)` }}>
        <svg width={1500} height={520} viewBox="0 0 1500 520">
          {/* el corte del caño, larguísimo */}
          <rect x={20} y={110} width={1460} height={300} rx={40} fill="#16130f" stroke="#dfe8ee" strokeWidth={10} />
          {/* la capa de grasa arriba (crece con las semanas, se va con el golpe) */}
          <rect x={30} y={120} width={1440} height={46 * grease * (1 - clean)} fill="#e8d8a8" opacity={0.95} />
          {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={60 + i * 66} cy={120 + 40 * grease * (1 - clean)} r={10 * grease * (1 - clean)} fill="#d8c08a" />)}
          {/* el hilito: agua pegada al fondo */}
          {full < 0.98 && <path d={`M30 ${400 - 22} ${Array.from({ length: 30 }, (_, i) => `L${30 + i * 50} ${398 - 18 - 5 * Math.sin(i + t * 6)}`).join(" ")} L1470 400 L30 400 Z`} fill="#5fb4ff" opacity={0.8 * (1 - full)} />}
          {/* la tarja entera: el caño lleno de pared a pared, con frente que avanza */}
          {full > 0.01 && <rect x={30} y={120} width={1440 * Math.min(1, full * 1.2)} height={280} fill="#5fb4ff" opacity={0.75} />}
          {full > 0.01 && full < 1 && <rect x={30 + 1440 * Math.min(1, full * 1.2) - 30} y={120} width={30} height={280} fill="#cfe8ff" />}
          {/* trozos de grasa arrastrados */}
          {clean > 0.01 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={(200 + i * 140 + (t - m.arrastra) * 520) % 1500} cy={200 + 80 * Math.sin(i * 2.3)} rx={30} ry={14} fill="#e8d8a8" opacity={1 - clean * 0.6} />)}
        </svg>
      </div>
      {/* la olla: hilito vs meterla entera */}
      {olla > 0.01 && <div style={{ position: "absolute", left: 1450, top: 560, transform: `translate(-50%,-50%) scale(${k1(t, m.olla)})`, opacity: olla, display: "flex", gap: 40 }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "relative", width: 220, height: 200 }}>
          <div style={{ position: "absolute", left: 0, top: 30, width: 220, height: 150, borderRadius: "0 0 40px 40px", background: "linear-gradient(90deg,#7a7f85,#c9cdd2 40%,#6a6f75)" }} />
          {i === 1 && <div style={{ position: "absolute", left: -20, top: 10, width: 260, height: 190, borderRadius: 30, background: "rgba(95,180,255,.5)" }} />}
          {i === 0 && <div style={{ position: "absolute", left: 104, top: -60, width: 8, height: 120, background: "#5fb4ff" }} />}
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", ...txt(36, i ? "#8ff0a8" : "#ff8a6a") }}>{i ? "● ENTERA" : "✕ HILITO"}</div>
        </div>)}
      </div>}
      <Rot t={t} at={m.hilito} out={m.tarja - 0.2} text="ARRIBA NUNCA SE MOJA" x={W / 2} y={150} size={72} />
      <Rot t={t} at={m.tarja} out={m.olla - 0.2} text="DE PARED A PARED" x={W / 2} y={150} size={80} col="#cfe6ff" />
      <Rot t={t} at={m.peso} out={b - 0.3} text="SE LIMPIA CON PESO" x={W / 2} y={150} size={84} col="#8ff0a8" />
    </Stage>
  );
};

// ---------- 33:27 EL GOLPE DE AGUA EN TODA LA CASA: el pulso de luz recorre cada desagüe en su palabra; página 53 ----------
// índices de desagüe en la casa: 0 fregadero · 1 lavamanos · 2 ducha · 3 inodoro · 4 lavadora · 5 bañera
export const GolpeCasa: React.FC<{ t: number; a: number; b: number; m: [string, number, number][]; p53: number }> = ({ t, a, b, m, p53 }) => {
  const near = (p: Pose, k = 1): Pose => ({ p: [p.l[0] + (p.p[0] - p.l[0]) * (1.25 * k), p.l[1] + (p.p[1] - p.l[1]) * (1.25 * k), p.l[2] + (p.p[2] - p.l[2]) * (1.25 * k)], l: p.l, fov: p.fov });
  const K = [{ t: a - 0.4, ...ROOM.wide }, ...m.flatMap(([r, , x]) => [{ t: x - 0.2, ...near(ROOM[r]), arc: 0.4 }, { t: x + 3, ...near(ROOM[r], 0.92) }]), { t: b + 0.5, ...ROOM.wideHi, arc: 0.6 }];
  const cam = camPath(K.sort((p, q) => p.t - q.t), 1)(t);
  let cur = -1; m.forEach(([, , x], i) => { if (t >= x) cur = i; });
  const blast = cur >= 0 ? m[cur][1] + Math.min(1, e(t, m[cur][2], m[cur][2] + 0.9)) : 0;
  const NAME: Record<string, string> = { basin: "LAVAMANOS", tub: "BAÑERA", shower: "DUCHA: UN BALDE", toilet: "INODORO: POR EL REBALSE" };
  return (
    <AbsoluteFill>
      <Casa t={t} cam={cam} ev={{ blast, focus: cur >= 0 ? m[cur][0] : undefined, focusAmt: cur >= 0 ? 1 : 0, plugs: [0, 1, 2, 3, 4].map((i) => plugsOn(t, i)) }} />
      {cur >= 0 && <Rot key={cur} t={t} at={m[cur][2]} out={cur + 1 < m.length ? m[cur + 1][2] - 0.2 : b - 0.3} text={NAME[m[cur][0]]} x={W / 2} y={150} size={78} />}
      <Pagina t={t} at={p53} out={b - 0.3} page="p53" x={1580} y={560} w={380} />
    </AbsoluteFill>
  );
};

// ---------- 34:05 LA HELADERA: la rutina en una hoja con imán; semana / mes / seis meses; «30 AÑOS» ----------
export const Heladera: React.FC<{ t: number; a: number; b: number; m: { semana: number; mes: number; seis: number; anos: number; costumbre: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), big = e(t, m.anos, m.anos + 0.6);
  const rows: [number, string, string[]][] = [[m.semana, "CADA SEMANA", ["GOLPE DE AGUA EN CADA UNO", "½ TAZA POR EL REBALSE"]], [m.mes, "CADA MES", ["½ TAZA DE BICARBONATO", "½ TAZA EN EL REBOSADERO"]], [m.seis, "CADA 6 MESES", ["ABRIR EL SIFÓN", "LINTERNA DEBAJO"]]];
  return (
    <Stage t={t} a={a} b={b} tint="#e6f0ff">
      {/* la puerta de la heladera */}
      <div style={{ position: "absolute", left: W / 2 - 260 * big, top: 610, transform: `translate(-50%,-50%) perspective(2000px) rotateY(${14 + 3 * Math.sin(t * 0.3)}deg) translateY(${(1 - Math.min(1, k)) * 600}px) scale(${1 - 0.2 * big})`, width: 700, height: 860, borderRadius: 40, background: "linear-gradient(110deg,#e9edf0,#c9d0d6 60%,#aeb6bd)", boxShadow: "0 60px 100px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", right: 40, top: 300, width: 26, height: 300, borderRadius: 13, background: "linear-gradient(90deg,#8a9299,#d6dbe0)" }} />
        {/* la hoja con la rutina, sujeta con un imán */}
        <div style={{ position: "absolute", left: 70, top: 90, width: 560, padding: "40px 34px", background: "#f6f1e6", transform: "rotate(-2deg)", boxShadow: "0 14px 26px rgba(0,0,0,.3)" }}>
          <div style={{ position: "absolute", left: 250, top: -24, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff8a6a,#c0392b)" }} />
          {rows.map(([at0, h, items]) => t > at0 - 0.2 && <div key={h} style={{ marginBottom: 22, opacity: e(t, at0 - 0.2, at0 + 0.2), transform: `translateX(${(1 - Math.min(1, k1(t, at0))) * 120}px)` }}>
            <div style={{ ...txt(40, "#c0392b"), textShadow: "none" }}>{h}</div>
            {items.map((s, i) => <div key={s} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 30, color: "#2b3a55", padding: "6px 0", borderBottom: "2px solid #d6cfbd", opacity: e(t, at0 + 0.5 + i * 0.6, at0 + 0.7 + i * 0.6) }}>· {s.toLowerCase()}</div>)}
          </div>)}
        </div>
      </div>
      {big > 0.01 && <div style={{ position: "absolute", left: 1450, top: 520, transform: `translate(-50%,-50%) scale(${k1(t, m.anos)})`, textAlign: "center" }}>
        <div style={txt(220)}>30</div><div style={txt(60, "#ffd9a8")}>AÑOS</div>
        <div style={{ ...txt(44), marginTop: 20, opacity: e(t, m.anos + 1, m.anos + 1.4) }}>NINGUNO SE VOLVIÓ A TAPAR</div>
      </div>}
      <Rot t={t} at={a + 0.4} out={m.semana - 0.2} text="PARA LA HELADERA" x={W / 2} y={110} size={74} />
      <Rot t={t} at={m.costumbre} out={b - 0.3} text="NO ES MAGIA, ES COSTUMBRE" x={W / 2} y={110} size={68} col="#8ff0a8" />
    </Stage>
  );
};

// ---------- 34:46 EL REPASO: la casa gira despacio; los 20 caen uno por uno en una columna que sube ----------
const R20 = ["ESCUCHA CÓMO BAJA", "EL ACEITE AL FRASCO", "COLADERA DE MALLA", "EL ÚLTIMO ENJUAGUE", "BICARBONATO NO DESTAPA", "EL OLOR: BOTELLA MARRÓN", "TAPÓN DEL LAVAMANOS", "EL AGUJERITO DE ARRIBA", "DEBAJO DE LA REJILLA", "LA CRUZ DE LA BAÑERA", "EL DESAGÜE QUE NO USAS", "EL SIFÓN CADA 6 MESES", "SOPAPA CON AGUA", "SOPAPA DE POLLERA", "AGUJERITOS EN DOS DÍAS", "EL BUCLE ALTO", "LA BAJANTE, POR ESCRITO", "NUNCA DOS DESTAPADORES", "SABER CUÁNDO LLAMAR", "EL GOLPE DE AGUA"];
export const Repaso: React.FC<{ t: number; a: number; b: number; m: number[] }> = ({ t, a, b, m }) => {
  const cam: Pose = { p: [0.4, 3.6, 10.4], l: [0, 2.5, -0.4], fov: 38 };
  let cur = -1; m.forEach((x, i) => { if (t >= x - 0.1) cur = i; });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: "translateX(-420px)" }}><Casa t={t} cam={cam} ev={{ spin: (t - a) / (b - a), plugs: [0, 0, 0, 0, 0], focusAmt: 0 }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg,rgba(7,9,12,0) 40%,rgba(7,9,12,.85) 62%)" }} />
      <div style={{ position: "absolute", left: 960, top: 0, width: 940, height: 1080, overflow: "hidden" }}>
        {R20.map((s, i) => { if (t < m[i] - 0.15) return null; const y = 540 + (i - cur) * 104; const d = cur - i; return (
          <div key={s} style={{ position: "absolute", left: 0, top: y - 40 + (i === cur ? (1 - Math.min(1, k1(t, m[i] - 0.1, 1.2))) * 120 : 0), display: "flex", alignItems: "center", gap: 20, opacity: d > 4 ? 0 : Math.max(0, 1 - d * 0.18), transform: `scale(${i === cur ? 1.12 : 0.92})`, transformOrigin: "0 50%" }}>
            <div style={{ width: 74, height: 74, borderRadius: 18, background: i === cur ? "#ffb257" : "#2e2924", display: "flex", alignItems: "center", justifyContent: "center", ...txt(40, i === cur ? "#1a1612" : "#ffd9a8"), textShadow: "none" }}>{i + 1}</div>
            <div style={{ ...txt(i === cur ? 42 : 32, i === cur ? "#fff" : "#cfc6b8"), whiteSpace: "nowrap" }}>{s}</div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 36:04 EL CIERRE: «se tapa en un año y se cuida en un minuto por semana» — el año entero en un calendario que se llena de tildes ----------
export const Cierre: React.FC<{ t: number; a: number; b: number; m: { ano: number; minuto: number; vemos: number } }> = ({ t, a, b, m }) => {
  const k = k1(t, a + 0.1, 0.7), fill = e(t, m.minuto, m.minuto + 2.4), bye = e(t, m.vemos, m.vemos + 0.8);
  return (
    <Stage t={t} a={a} b={b} tint="#ffe0bc">
      <div style={{ position: "absolute", left: W / 2, top: 560, transform: `translate(-50%,-50%) perspective(1800px) rotateX(${12 - 6 * bye}deg) translateY(${(1 - Math.min(1, k)) * 500}px) scale(${1 - 0.15 * bye})`, opacity: 1 - 0.2 * bye, display: "grid", gridTemplateColumns: "repeat(13, 102px)", gap: 16 }}>
        {Array.from({ length: 52 }, (_, i) => { const on = fill * 52 > i; return <div key={i} style={{ width: 102, height: 102, borderRadius: 18, background: on ? "#1f5f8f" : "#3a342d", boxShadow: on ? "0 0 20px rgba(95,180,255,.55)" : "inset 0 0 0 3px #6a6056", display: "flex", alignItems: "center", justifyContent: "center", ...txt(38), opacity: t > m.ano ? 1 : e(t, a + i * 0.01, a + 0.3 + i * 0.01) }}>{on && <svg width={50} height={64} viewBox="0 0 34 44" style={{ transform: `scale(${Math.min(1, spr(t, m.minuto + i * 2.4 / 52, 0.5))})` }}><path d="M17 2 C17 2 3 20 3 29 A14 14 0 0 0 31 29 C31 20 17 2 17 2 Z" fill="#8fd0ff" /><path d="M10 29 A7 7 0 0 0 17 36" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} /></svg>}</div>; })}
      </div>
      <Rot t={t} at={m.ano} out={m.minuto - 0.2} text="SE TAPA EN UN AÑO" x={W / 2} y={150} size={84} col="#ff8a6a" />
      <Rot t={t} at={m.minuto} out={b - 0.2} text="UN MINUTO POR SEMANA" x={W / 2} y={150} size={84} col="#8fd0ff" />
      <Rot t={t} at={m.minuto + 2.5} out={b - 0.2} text="52 MINUTOS AL AÑO" x={W / 2} y={975} size={84} col="#ffd9a8" />
    </Stage>
  );
};
