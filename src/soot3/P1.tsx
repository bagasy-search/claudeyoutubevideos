import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CENTURION, CIVIL } from "./persona";
import {
  C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos,
  Pergamino, Aguila, Casa, Mesa, Tienda, Particulas, Rayos, Frente, Emote, cabeza,
} from "./kit";
import { Denario, Tarjeta, Mano, Placa, Regla, Fuerte, Lapida, Papiro, Trampas, Bolsa } from "./kit2";
import { Palo } from "./kit";
import { Campamento, Interior, FilaLejana, Empalizada, pose } from "./kit3";

// Parte 1 (63,48-163,26 s): el reclutamiento. Una idea por plano, sobre la palabra exacta.
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#8a4a2a", b = "#4a2418" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
export const Cuenta: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string }> = ({ t, t0, t1, de, a, x, y, size = 150, color = "#fff", pre = "", suf = "" }) => {
  if (t < t0) return null;
  const v = Math.round(de + (a - de) * prog(t, t0, t1));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0)})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px #2a1530`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 #2a1530` }}>{pre}{v}{suf}</div>;
};
// velo/pelo largo detrás de la cabeza (va ANTES de la Persona para quedar atrás)
const Velo: React.FC<{ x: number; y: number; h: number; color?: string }> = ({ x, y, h, color = "#7a3a8a" }) => {
  const c = cabeza(x, y, h);
  const s = c.s;
  return <svg style={{ position: "absolute", left: c.x - 150 * s, top: c.y - 130 * s, overflow: "visible" }} width={300 * s} height={330 * s} viewBox="0 0 300 330"><path d="M 150 0 Q 280 10 270 150 Q 266 260 230 330 L 70 330 Q 34 260 30 150 Q 20 10 150 0 Z" fill={color} /></svg>;
};
// línea que se dibuja entre dos puntos (para las flechas de los rasgos)
const Linea: React.FC<{ t: number; t0: number; x1: number; y1: number; x2: number; y2: number; color?: string }> = ({ t, t0, x1, y1, x2, y2, color = "#fff" }) => {
  if (t < t0) return null;
  const k = prog(t, t0, t0 + 0.3);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
      <circle cx={x2} cy={y2} r={16 * ent(t, t0 + 0.25)} fill={color} />
    </svg>
  );
};
const Lupa: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 120 }) => (
  <svg style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2, overflow: "visible" }} width={r * 2.4} height={r * 3.6}>
    <line x1={r * 1.9} y1={r * 1.9} x2={r * 2.7} y2={r * 3.2} stroke="#6b3a1f" strokeWidth={r * 0.28} strokeLinecap="round" />
    <circle cx={r * 1.2} cy={r * 1.2} r={r} fill="rgba(200,240,255,.18)" stroke="#e9a92a" strokeWidth={r * 0.16} />
    <path d={`M ${r * 0.6} ${r * 0.8} Q ${r * 0.8} ${r * 0.5} ${r * 1.2} ${r * 0.45}`} stroke="#fff" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" opacity={0.7} />
  </svg>
);
const Anillos: React.FC<{ t: number; t0: number; x: number; y: number; tacha?: number }> = ({ t, t0, x, y, tacha = 1e9 }) => {
  if (t < t0) return null;
  const e = ent(t, t0), k = prog(t, tacha, tacha + 0.3);
  const sep = 70 + (t > tacha ? Math.min(1, (t - tacha) * 3) * 120 : 0);
  return (
    <svg style={{ position: "absolute", left: x - 400, top: y - 250, overflow: "visible", transform: `scale(${e})` }} width={800} height={500}>
      <circle cx={400 - sep} cy={250} r={130} fill="none" stroke="#f7c548" strokeWidth={38} />
      <circle cx={400 + sep} cy={250} r={130} fill="none" stroke="#ffe27a" strokeWidth={38} />
      <circle cx={400 - sep - 60} cy={160} r={14} fill="#fff" opacity={0.7} />
      {k > 0 && <line x1={140} y1={60} x2={140 + 520 * k} y2={60 + 380 * k} stroke={C.rojo} strokeWidth={48} strokeLinecap="round" />}
      {k > 0 && <circle cx={400} cy={250} r={250} fill="none" stroke={C.rojo} strokeWidth={40} strokeDasharray={1571} strokeDashoffset={1571 * (1 - k)} />}
    </svg>
  );
};
const Corazon: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; parte?: number }> = ({ t, t0, x, y, s = 1, parte = 1e9 }) => {
  if (t < t0) return null;
  const e = ent(t, t0) * (1 + 0.06 * Math.sin(t * 9));
  const p = t > parte ? Math.min(1, (t - parte) * 2.5) : 0;
  const half = (lado: number) => (
    <g transform={`translate(${lado * p * 70} ${p * p * 160}) rotate(${lado * p * 22})`} opacity={1 - p * 0.3}>
      <path d={lado < 0 ? "M 0 40 C -20 0 -110 -10 -110 -80 C -110 -140 -30 -150 0 -100 L -16 -60 L 12 -30 L -10 0 Z" : "M 0 40 C 20 0 110 -10 110 -80 C 110 -140 30 -150 0 -100 L -16 -60 L 12 -30 L -10 0 Z"} fill={C.rojo} stroke="#fff" strokeWidth={8} />
    </g>
  );
  return <svg style={{ position: "absolute", left: x - 140 * s, top: y - 170 * s, overflow: "visible", transform: `scale(${e})` }} width={280 * s} height={260 * s} viewBox="-140 -170 280 260">{half(-1)}{half(1)}</svg>;
};
const Sello: React.FC<{ t: number; t0: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number }> = ({ t, t0, text, x, y, size = 120, color = C.rojo, rot = -12 }) => {
  if (t < t0) return null;
  const k = Math.min(1, (t - t0) / 0.16);
  const sc = 2.4 - 1.4 * k;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: k, fontFamily, fontWeight: 700, fontSize: size, color, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.18, padding: `0 ${size * 0.25}px`, letterSpacing: 6, whiteSpace: "nowrap", background: "rgba(255,255,255,.08)" }}>{text}</div>;
};

export const P1: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 017 · vas a ver al oficial de reclutamiento */}
    <Escena t={t} t0={63.48} t1={65.66} entra="barrido" golpes={[64.7]}>
      <Cielo tipo="dia" />
      <Astro x={1640} y={200} r={80} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={640} seed={21} alto={60} dx={(t - 63.48) * 30} />
      <Suelo y={820} a="#c9773a" b="#8a4a20" />
      <Tienda x={1360} y={640} s={1.5} />
      <Mesa x={1360} y={720} w={460} />
      <Persona x={1500} y={930} h={460} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="neutro" flip habla bD={40} cD={60} />
      <Persona x={interpolate(t, [63.48, 65.4], [300, 900], { extrapolateRight: "clamp" })} y={960} h={480} t={t} seed={1} casco="legion" expr="orgullo" camina={t < 65.4 ? 1.6 : 0} />
      <Particulas t={t} tipo="polvo" n={24} seed={31} />
      <Frente t={t} color="#2a3a1a" vel={140} seed={32} />
      <Chip t={t} t0={64.7} text="RECRUITING OFFICER" color={C.violeta} x={1360} y={300} centro size={58} />
    </Escena>

    {/* 018 · primero te miden */}
    <Escena t={t} t0={65.66} t1={67.4} entra="corte" golpes={[66.68]}>
      <Interior />
      <Regla x={1180} y={560} h={900} t={t} marca={interpolate(prog(t, 65.9, 66.7), [0, 1], [880, 300])} />
      <Persona x={900} y={1010} h={700} t={t} seed={1} casco="legion" expr={t < 66.68 ? "neutro" : "orgullo"} miraY={-0.6} mira={0.5} />
      <Persona x={1520} y={1010} h={640} t={t} seed={60} ropa={CENTURION} casco="centurion" flip expr="neutro" habla bD={110} cD={30} />
      <Emote t={t} t0={66.9} tipo="brillos" {...L(900, 1010, 700)} s={1.1} />
      <Chip t={t} t0={65.7} text="STEP 1" color={C.ambar} tinta={C.noche} x={160} y={150} size={56} />
      <Grande t={t} t0={66.68} text="MEASURED" x={1520} y={900} size={120} color="#fff" />
    </Escena>

    {/* 019 · el recluta ideal según Vegecio: Vegecio escribe su tratado mientras al protagonista lo miden contra la vara */}
    <Escena t={t} t0={67.4} t1={72.04} zoom={0.04} entra="corte" golpes={[69.84, 70.8]}>
      <Interior ventana={false} />
      {/* tratado de Vegecio con renglones reales que se escriben */}
      <div style={{ position: "absolute", left: 110, top: 190, width: 640, height: 330, background: "linear-gradient(180deg,#f6e3b4,#ead09a)", border: "8px solid #c98f4a", borderRadius: 14, boxShadow: "12px 14px 0 rgba(20,8,40,.3)", fontFamily, fontWeight: 700, color: "#5a3418", transform: `scale(${ent(t, 67.4)})`, transformOrigin: "50% 0%" }}>
        <div style={{ textAlign: "center", fontSize: 46, color: "#7a3d14", marginTop: 12, letterSpacing: 2 }}>VEGETIUS · ON WAR</div>
        {(["THE IDEAL RECRUIT:", "· ALERT EYES", "· HEAD HELD HIGH", "· BROAD CHEST"] as const).map((l, i) => {
          const t0 = 67.6 + i * 0.8;
          const k = prog(t, t0, t0 + 0.7);
          return <div key={i} style={{ marginLeft: 34, marginTop: 4, fontSize: 42, whiteSpace: "nowrap", overflow: "hidden", width: `${k * 92}%`, color: i === 0 ? C.rojo : "#5a3418" }}>{l}</div>;
        })}
      </div>
      <Mesa x={520} y={800} w={300} />
      <Persona x={330} y={1030} h={470} t={t} seed={88} ropa={CIVIL(5)} viejo expr="orgullo" habla={t > 69.8} mira={0.6} {...pose("escribir", t, 1.4)} />
      <Regla x={1420} y={640} h={760} t={t} marca={interpolate(prog(t, 67.6, 69.6), [0, 1], [740, 120])} />
      <Persona x={1160} y={1030} h={700} t={t} seed={1} casco="legion" expr={t > 70.8 ? "sorpresa" : "orgullo"} mira={-0.4} miraY={-0.3} inclina={-2} />
      <Persona x={1650} y={1030} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" flip expr="neutro" habla={t < 69.8} bD={interpolate(prog(t, 67.6, 69.6), [0, 1], [60, 130])} cD={10} />
      {(() => { const c = L(1160, 1030, 700); return <>
        <Linea t={t} t0={70.8} x1={990} y1={590} x2={c.x - 50} y2={c.y} color={C.ambar} />
        <Chip t={t} t0={70.8} text="ALERT EYES" color={C.ambar} tinta={C.noche} x={590} y={590} size={52} />
      </>; })()}
      <Chip t={t} t0={67.45} text="THE IDEAL RECRUIT" color={C.rojo} x={1100} y={110} centro size={60} />
    </Escena>
    {/* 020 · pecho ancho, hombros, dedos largos y panza chica */}
    <Escena t={t} t0={72.04} t1={76.76} zoom={0.04} entra="corte" golpes={[72.2, 73.3, 74.58, 75.66]}>
      <Interior />
      <Persona x={300} y={1020} h={560} t={t} seed={88} ropa={CIVIL(5)} viejo expr="neutro" bD={70} cD={40} manoD={<rect x={-6} y={-200} width={12} height={240} fill="#6b3a1f" />} />
      {(() => {
        const h = 860, y = 1040, x = 760, c = L(x, y, h), s = c.s;
        const pts: [number, number, number, string, string][] = [
          [72.2, x, c.y + 260 * s, "BROAD CHEST", C.teal],
          [73.3, x + 130 * s, c.y + 170 * s, "MUSCULAR SHOULDERS", C.rojo],
          [74.58, x + 210 * s, c.y + 470 * s, "LONG FINGERS", C.ambar],
          [75.66, x, c.y + 420 * s, "SMALL BELLY", C.rosa],
        ];
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={t > 75.66 ? "sorpresa" : "orgullo"} bD={t > 74.58 ? 20 : 0} inclina={t > 75.66 ? -3 : 0} />
          {pts.map(([t0, px, py, txt, col], i) => <React.Fragment key={i}>
            <Linea t={t} t0={t0} x1={1180} y1={260 + i * 170} x2={px} y2={py} color={col} />
            <Chip t={t} t0={t0} text={txt} color={col} tinta={col === C.rojo ? "#fff" : C.noche} x={1180} y={260 + i * 170} size={50} />
          </React.Fragment>)}
          <Emote t={t} t0={75.9} tipo="sudor" {...c} s={1.6} />
        </>;
      })()}
    </Escena>

    {/* 021 · ojos, dientes, ¿de qué trabajabas?: el examinador lo revisa con la lupa y la planilla se tilda */}
    <Escena t={t} t0={76.76} t1={80.92} entra="corte" golpes={[77.26, 78.46, 80.3]}>
      <Interior />
      {(() => {
        const h = 800, y = 1035, x = 640, c = L(x, y, h);
        const boca = t >= 78.46 && t < 80.3;
        const lx = c.x + (boca ? 30 : 50), ly = c.y + (boca ? 80 * c.s : -10 * c.s);
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={boca ? "sorpresa" : t < 78.46 ? "neutro" : "miedo"} mira={t > 80.3 ? 0.4 : 0.8} miraY={boca ? -0.5 : 0} inclina={boca ? -4 : 0} />
          <Persona x={1080} y={1035} h={680} t={t} seed={60} ropa={CENTURION} casco="centurion" flip expr="neutro" habla bD={95} cD={20} inclina={8} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
              <g transform={`translate(${lx} ${ly})`}>
                <line x1={90} y1={90} x2={210} y2={210} stroke="#6b3a1f" strokeWidth={30} strokeLinecap="round" />
                <circle r={110} fill="rgba(200,240,255,.22)" stroke="#e9a92a" strokeWidth={18} />
                <path d="M -60 -40 Q -40 -75 0 -80" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
              </g>
          </svg>
          <Emote t={t} t0={80.3} tipo="preg" {...c} s={1.4} />
        </>;
      })()}
      {/* planilla del examen */}
      <div style={{ position: "absolute", left: 1330, top: 220, width: 460, height: 560, background: "#fff8ec", border: "9px solid #2a1530", borderRadius: 24, boxShadow: "14px 16px 0 rgba(20,8,40,.3)", fontFamily, fontWeight: 700, transform: `scale(${ent(t, 76.76)}) rotate(2deg)` }}>
        <div style={{ textAlign: "center", fontSize: 46, color: C.rojo, marginTop: 18 }}>THE EXAM</div>
        {([["HEIGHT", 0], ["EYES", 77.26], ["TEETH", 78.46], ["YOUR JOB", 80.3]] as const).map(([k, tv], i) => {
          const on = t >= tv;
          const preg = i === 3;
          return (
            <div key={k} style={{ position: "absolute", left: 36, right: 36, top: 110 + i * 108, height: 90, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 44, color: on ? "#2a1530" : "#b9a888", background: on && t < tv + 1.2 && tv > 0 ? "rgba(255,176,32,.35)" : "transparent", borderRadius: 14, padding: "0 12px" }}>
              <span>{k}{preg ? "?" : ""}</span>
              {on && <span style={{ width: 66, height: 66, borderRadius: 33, background: preg ? C.rojo : "#2fae5a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, transform: `scale(${tv > 0 ? ent(t, tv) : 1})` }}>{preg ? "?" : "✓"}</span>}
            </div>
          );
        })}
      </div>
    </Escena>
    {/* 022 · herreros, carpinteros, carniceros y cazadores de jabalí: bienvenidos (cada uno entra con su tarjeta y festeja) */}
    <Escena t={t} t0={80.92} t1={85.02} zoom={0.03} entra="sube" banda={C.lima} golpes={[80.92, 83.36]}>
      <Interior />
      <AbsoluteFill style={{ background: "rgba(40,140,80,.3)" }} />
      {([["herrero", "BLACKSMITH", 80.92], ["carpintero", "CARPENTER", 81.64], ["carnicero", "BUTCHER", 82.44], ["jabali", "BOAR HUNTER", 83.36]] as const).map(([of, lab, t0], i) => (
        <React.Fragment key={of}>
          <Tarjeta of={of} label={lab} veredicto="si" tv={t0 + 0.35} x={330 + i * 420} y={420} s={0.85} t={t} t0={t0} rot={(i % 2 ? 1 : -1) * 3} />
          <Persona x={330 + i * 420} y={1040} h={400} t={t} seed={160 + i} ropa={CIVIL(i)} expr={t > t0 + 0.35 ? "feliz" : "neutro"} aparece={t0} {...(t > t0 + 0.35 ? pose("festejar", t + i * 0.3, 1.3) : {})} salta={t0 + 0.4} />
        </React.Fragment>
      ))}
      <Grande t={t} t0={83.9} text="WELCOME!" y={120} size={110} color={C.lima} />
    </Escena>

    {/* 023 · pescadores, pasteleros, tejedores de lino: fuera (el oficial sella el NO y se van tristes) */}
    <Escena t={t} t0={85.02} t1={89.82} zoom={0.03} entra="barrido" banda={C.rojo} golpes={[85.02, 85.7, 86.76]}>
      <Interior />
      <AbsoluteFill style={{ background: "rgba(140,20,50,.3)" }} />
      {([["pescador", "FISHERMAN", 85.02], ["pastelero", "PASTRY COOK", 85.7], ["tejedor", "LINEN WEAVER", 86.76]] as const).map(([of, lab, t0], i) => (
        <React.Fragment key={of}>
          <Tarjeta of={of} label={lab} veredicto="no" tv={t0 + 0.3} x={380 + i * 440} y={440} s={0.9} t={t} t0={t0} rot={(i % 2 ? -1 : 1) * 4} />
          <Persona x={380 + i * 440} y={1040} h={400} t={t} seed={101 + i} ropa={CIVIL(i + 2)} expr={t > t0 + 0.3 ? "triste" : "feliz"} aparece={t0} {...(t > t0 + 0.3 ? pose("temblar", t) : {})} />
        </React.Fragment>
      ))}
      <Persona x={1620} y={1040} h={540} t={t} seed={89} ropa={CENTURION} casco="centurion" expr="enojado" flip {...pose("golpear", t, 1.1)} />
      <Chip t={t} t0={88.0} text="I'M NOT MAKING THIS UP" color={C.ambar} tinta={C.noche} x={960} y={110} centro size={58} />
    </Escena>

    {/* 024 · todo lo que tenga que ver con el cuarto de las mujeres: a casa. La fila de rechazados frente a la mesa del oficial */}
    <Escena t={t} t0={89.82} t1={94.6} entra="corte" golpes={[91.7, 93.74]}>
      <Interior />
      {(() => {
        const vete = prog(t, 93.9, 94.6);
        const filas: [number, string, number, string, number][] = [[101, "pescador", 2, "FISHERMAN", 0], [102, "pastelero", 3, "PASTRY COOK", 0], [103, "tejedor", 4, "WEAVER", 0], [91, "mujeres", 3, "WOMEN'S QUARTERS", 91.7]];
        const rech = 3 + (t > 92.3 ? 1 : 0);
        return <>
          <Persona x={1530} y={1000} h={540} t={t} seed={89} ropa={CENTURION} casco="centurion" expr="enojado" flip habla {...(t > 91.9 && t < 92.7 || t > 93.7 ? pose("golpear", t, 1.6) : { bD: 40, cD: 60 })} />
          <Mesa x={1450} y={790} w={460} />
          <div style={{ position: "absolute", left: 1450, top: 870, transform: "translate(-50%,-50%)", background: C.rojo, color: "#fff", fontFamily, fontWeight: 700, fontSize: 40, padding: "4px 18px", borderRadius: 10, border: "5px solid #fff", whiteSpace: "nowrap" }}>REJECTED: {rech}</div>
          {filas.map(([seed, of, ci, lab, t0], i) => {
            const x = 210 + i * 230 - vete * 900;
            const tv = t0 ? t0 + 0.6 : 0;
            const no = t >= tv;
            return <React.Fragment key={seed}>
              {(t0 === 0 || t >= t0) && <Tarjeta of={of as "pescador"} label={lab} veredicto="no" tv={tv || 89} x={x} y={470} s={0.6} t={t} t0={t0 || undefined} />}
              <Persona x={x} y={1030} h={420} t={t} seed={seed} ropa={CIVIL(ci)} expr={no ? "triste" : "feliz"} flip={vete > 0} camina={vete > 0 ? 1.8 : 0} />
            </React.Fragment>;
          })}
          <Persona x={1120} y={1030} h={560} t={t} seed={1} casco="legion" expr="miedo" mira={0.8} {...pose("temblar", t)} />
          <Emote t={t} t0={90.0} tipo="sudor" {...L(1120, 1030, 560)} />
        </>;
      })()}
      <Chip t={t} t0={90.4} text="ANY JOB WITH..." color={C.violeta} x={960} y={120} centro size={58} t1={93.5} />
      <Chip t={t} t0={93.74} text="POLITELY: GO HOME" color={C.rojo} x={960} y={120} centro size={62} />
      <Sello t={t} t0={93.9} text="GO HOME" x={560} y={260} size={96} />
    </Escena>
    {/* 025a · pasaste */}
    <Escena t={t} t0={94.6} t1={96.2} entra="corte" golpes={[94.6]}>
      <Interior />
      <AbsoluteFill style={{ background: "rgba(120,220,90,.3)" }} />
      <Particulas t={t} tipo="lluviaoro" n={50} seed={46} />
      <Persona x={960} y={1040} h={760} t={t} seed={1} casco="legion" expr="feliz" {...pose("festejar", t, 1.6)} salta={94.7} />
      <Persona x={1560} y={1030} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" flip expr="feliz" bD={150} cD={10} />
      <Emote t={t} t0={94.7} tipo="brillos" {...L(960, 1040, 760)} s={1.6} />
      <Grande t={t} t0={94.62} text="YOU PASS!" y={190} size={170} color="#fff" borde="#1d5a2a" />
    </Escena>

    {/* 025b · el oficial le cuelga la placa de plomo al cuello; después, la marca en la mano (globo de detalle) */}
    <Escena t={t} t0={96.2} t1={100.18} zoom={0.04} entra="corte" golpes={[97.58, 99.64]}>
      <Interior />
      {(() => {
        const h = 740, y = 1030, x = 600, c = L(x, y, h);
        const caida = interpolate(t, [96.3, 97.58], [-260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const balanceo = t > 97.58 ? Math.sin((t - 97.58) * 7) * 12 * Math.exp(-(t - 97.58) * 1.6) : 0;
        const cuelga = t < 97.7;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={t < 97.58 ? "neutro" : t < 99.64 ? "sorpresa" : "miedo"} miraY={0.4} mira={0.5}
            bD={t > 98.7 ? 70 : 10} cD={t > 98.7 ? 40 : 10} />
          <Placa x={c.x} y={c.y + 230 * c.s + caida} s={0.62} t={t} rot={balanceo} />
          <Persona x={1000} y={1030} h={640} t={t} seed={60} ropa={CENTURION} casco="centurion" flip expr="orgullo" habla bD={cuelga ? 150 : 40} cD={cuelga ? 30 : 40} inclina={cuelga ? 6 : 0} />
          {/* globo de detalle de la mano */}
          {t > 98.7 && (
            <div style={{ position: "absolute", left: 1460, top: 560, width: 520, height: 520, transform: `translate(-50%,-50%) scale(${ent(t, 98.7)})`, borderRadius: 260, background: "radial-gradient(circle, #fff8ec, #f0dcb4)", border: "12px solid #2a1530", overflow: "hidden", boxShadow: "14px 16px 0 rgba(20,8,40,.3)" }}>
              <Mano x={260} y={290} s={0.95} marca={prog(t, 99.64, 100.0)} rot={-6} />
              {t > 99.64 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(0, 0.8 - (t - 99.64) * 3) }} />}
            </div>
          )}
          {t > 98.7 && <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}><path d={`M ${c.x + 150 * c.s} ${y - 300 * c.s} L 1210 640`} stroke="#2a1530" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" opacity={ent(t, 98.7)} /></svg>}
        </>;
      })()}
      <Chip t={t} t0={96.3} t1={98.5} text="LEAD TAG" color={C.teal} tinta={C.noche} x={150} y={140} size={60} />
      <Chip t={t} t0={98.7} t1={99.5} text="+ A MARK" color={C.rojo} x={1460} y={170} centro size={60} />
      <Chip t={t} t0={99.64} text="TATTOOED?" color={C.ambar} tinta={C.noche} x={1460} y={170} centro size={58} />
    </Escena>
    {/* 026 · si te escapás, todos sabrán qué sos */}
    <Escena t={t} t0={100.18} t1={104.78} zoom={0.05} entra="barrido" golpes={[101.84, 103.4]}>
      <Cielo tipo="atardecer" />
      <Astro x={1500} y={360} r={90} />
      <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={620} seed={48} alto={80} dx={(t - 100) * 140} />
      <Casa x={200 - (t - 100.18) * 160} y={820} s={1.2} techo="#9a3a2a" />
      <Suelo y={840} />
      {(() => {
        const x = interpolate(t, [101.84, 104.78], [1200, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <>
          <Persona x={x} y={980} h={500} t={t} seed={1} expr={t < 101.84 ? "neutro" : "miedo"} camina={t > 101.84 ? 2.4 : 0} flip casco="legion" />
          <Emote t={t} t0={102.0} tipo="susto" {...L(x, 980, 500)} />
          <Emote t={t} t0={102.5} tipo="sudor" {...L(x, 980, 500)} />
          {[0, 1, 2].map((i) => (
            <Persona key={i} x={1300 + i * 200} y={990 + (i % 2) * 10} h={430} t={t} seed={70 + i} ropa={CIVIL(i + 1)} expr="enojado" bD={130} cD={0} habla aparece={102.6 + i * 0.25} />
          ))}
          <Mano x={x + 40} y={300} s={0.4} t={t} t0={103.4} marca={1} />
        </>;
      })()}
      <Frente t={t} color="#2a1020" vel={300} seed={49} />
      <Chip t={t} t0={101.84} text="RUN AWAY?" color={C.violeta} x={160} y={140} size={60} />
      <Chip t={t} t0={103.4} text="EVERYONE KNOWS" color={C.rojo} x={960} y={250} centro size={70} />
    </Escena>

    {/* 027 · el juramento: sacramentum */}
    <Escena t={t} t0={104.78} t1={107.36} entra="zoom" golpes={[106.3]}>
      <Campamento t={t} hora="tarde" dx={(t - 104.8) * 30} />
      <div style={{ position: "absolute", left: 953, top: 470, width: 14, height: 520, background: "#6b3a1f" }} />
      <Aguila x={960} y={420} s={1.3} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Persona key={i} x={260 + i * 280 + (i > 2 ? 160 : 0)} y={1040} h={420 + (i % 2) * 30} t={t} seed={i === 2 ? 1 : 130 + i} casco="legion" expr="orgullo" flip={i > 2} bD={interpolate(ent(t, 104.9, i * 0.06), [0, 1], [8, 150])} cD={14} />)}
      <Particulas t={t} tipo="destellos" n={26} seed={50} />
      <Chip t={t} t0={105.2} text="THE OATH" color={C.violeta} x={960} y={110} centro size={60} />
      <Grande t={t} t0={106.3} text="SACRAMENTUM" y={250} size={140} color={C.oro} />
    </Escena>

    {/* 028 · obedecer, seguirlo a donde sea, no desertar nunca: la tropa jura en fila y el centurión señala el horizonte */}
    <Escena t={t} t0={107.36} t1={112.04} zoom={0.03} entra="corte" golpes={[108.04, 109.28, 110.66]}>
      <Campamento t={t} hora="tarde" dx={(t - 107.3) * 30} />
      {[760, 900, 1040].map((x, i) => <Persona key={x} x={x} y={950} h={380} t={t} seed={170 + i} casco="legion" expr="orgullo" mira={0.6} bD={interpolate(ent(t, 107.5, i * 0.08), [0, 1], [8, 160])} cD={8} />)}
      <Persona x={1400} y={1000} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="orgullo" habla
        bD={t < 109.28 ? 40 : interpolate(ent(t, 109.28), [0, 1], [40, 95])} cD={8} manoD={<Palo largo={200} />} bI={14} />
      <Persona x={500} y={1030} h={560} t={t} seed={1} casco="legion" expr={t > 110.66 ? "miedo" : "orgullo"} mira={0.6} bD={interpolate(ent(t, 107.4), [0, 1], [8, 165])} cD={5} />
      {t > 110.66 && <Emote t={t} t0={110.8} tipo="sudor" {...L(500, 1030, 560)} />}
      {([[108.04, "OBEY", C.teal], [109.28, "FOLLOW HIM ANYWHERE", C.ambar], [110.66, "NEVER DESERT", C.rojo]] as const).map(([t0, txt, col], i) => (
        <Chip key={i} t={t} t0={t0} text={`${i + 1}. ${txt}`} color={col} tinta={col === C.rojo ? "#fff" : C.noche} x={110} y={150 + i * 100} size={50} />
      ))}
    </Escena>
    {/* 029 · tu cuerpo es de Roma por un cuarto de siglo */}
    <Escena t={t} t0={112.04} t1={116.68} zoom={0.05} entra="corte" golpes={[113.28, 115.5]}>
      <Campamento t={t} hora="noche" />
      <AbsoluteFill style={{ background: "rgba(140,20,50,.35)" }} />
      <Persona x={960} y={1040} h={780} t={t} seed={1} expr={t < 113.28 ? "neutro" : "sorpresa"} casco="legion" />
      <Sello t={t} t0={113.28} text="PROPERTY OF ROME" x={960} y={720} size={96} color={C.oro} />
      <Cuenta t={t} t0={115.5} t1={116.5} de={0} a={25} x={1640} y={320} size={200} color={C.oro} />
      <Chip t={t} t0={115.6} text="YEARS" color={C.rojo} x={1560} y={470} size={60} />
    </Escena>

    {/* 030 · la cláusula que nadie lee */}
    <Escena t={t} t0={116.68} t1={118.9} entra="iris" ix={960} iy={560} golpes={[117.68]}>
      <Interior />
      <Pergamino x={960} y={560} w={900} abre={1} lineas={9} titulo="CONTRACT" />
      <Persona x={290} y={1030} h={580} t={t} seed={1} casco="legion" expr={t > 117.68 ? "sorpresa" : "neutro"} mira={0.9} miraY={-0.2} inclina={6} bD={60} cD={60} />
      <Lupa x={interpolate(prog(t, 116.8, 117.6), [0, 1], [500, 1180])} y={720} r={150} />
      <Chip t={t} t0={117.68} text="THE CLAUSE NOBODY READS" color={C.rojo} x={960} y={110} centro size={60} />
    </Escena>

    {/* 031 · un soldado romano no se puede casar: se tienden la mano, los anillos se tachan y caen, y la empalizada baja entre los dos */}
    <Escena t={t} t0={118.9} t1={122.04} entra="corte" golpes={[120.4]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Velo x={1380} y={1000} h={540} color="#5a2a7a" />
      <Persona x={1380} y={1000} h={540} t={t} seed={95} ropa={CIVIL(6)} expr={t > 120.4 ? "triste" : "feliz"} flip mira={-0.6} bD={t > 120.4 ? 120 : 70} cD={t > 120.4 ? 120 : 10} />
      <Persona x={480} y={1020} h={580} t={t} seed={1} casco="legion" expr={t > 120.4 ? "triste" : "feliz"} mira={0.6} bD={t > 120.4 ? 20 : 70} cD={10} inclina={t > 120.4 ? 0 : 6} />
      {t > 120.4 && <Emote t={t} t0={120.6} tipo="lagrimas" {...L(1380, 1000, 540)} />}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${Math.pow(prog(t, 120.9, 121.4), 2) * 420 - (t > 121.4 ? Math.abs(Math.sin((t - 121.4) * 9)) * 40 * Math.exp(-(t - 121.4) * 5) : 0)}px)` }}>
        <Anillos t={t} t0={118.9} x={930} y={430} tacha={120.4} />
      </div>
      {/* tramo de empalizada que cae entre los dos */}
      {t > 121.2 && (
        <svg style={{ position: "absolute", left: 860, top: interpolate(t, [121.2, 121.45], [-560, 520], { extrapolateRight: "clamp" }), overflow: "visible" }} width={200} height={500}>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${i * 40} 500 L ${i * 40} 30 L ${i * 40 + 18} 0 L ${i * 40 + 36} 30 L ${i * 40 + 36} 500 Z`} fill={i % 2 ? "#b07a3e" : "#8a5a2a"} />)}
          <rect x={0} y={180} width={196} height={14} fill="#5a3418" />
        </svg>
      )}
      <Grande t={t} t0={120.4} text="NO MARRIAGE" y={130} size={120} color="#fff" borde={C.rojo} />
    </Escena>
    {/* 032 · durante 25 años */}
    <Escena t={t} t0={122.04} t1={123.7} entra="zoom" golpes={[122.04]}>
      <Campamento t={t} hora="tarde" dx={(t - 122) * 60} />
      <AbsoluteFill style={{ background: "rgba(200,30,50,.55)" }} />
      <Persona x={1330} y={1020} h={620} t={t} seed={1} casco="legion" expr="triste" {...pose("temblar", t)} />
      <Cuenta t={t} t0={122.04} t1={122.74} de={1} a={25} x={760} y={440} size={420} color="#fff" />
      <Grande t={t} t0={122.5} text="YEARS" x={760} y={800} size={130} color={C.oro} />
    </Escena>

    {/* 033 · si ya tenías esposa, para la ley el matrimonio deja de contar */}
    <Escena t={t} t0={123.7} t1={128.56} zoom={0.05} entra="barrido" golpes={[125.04, 127.58]}>
      <Cielo tipo="atardecer" />
      <Casa x={1600} y={820} s={1.4} tono="#f0c79a" techo="#9a3a2a" luz />
      <Suelo y={840} />
      <Velo x={1180} y={980} h={560} color="#5a2a7a" />
      <Persona x={1180} y={980} h={560} t={t} seed={95} ropa={CIVIL(6)} expr={t > 127.58 ? "triste" : "feliz"} flip mira={-0.5} />
      <Persona x={720} y={990} h={600} t={t} seed={1} expr={t > 127.58 ? "triste" : "feliz"} casco="legion" mira={0.5} />
      <Corazon t={t} t0={125.04} x={950} y={330} s={1.3} parte={127.58} />
      {t > 127.58 && <Emote t={t} t0={127.8} tipo="lagrimas" {...L(1180, 980, 560)} />}
      <Chip t={t} t0={125.04} text="YOUR WIFE" color={C.rosa} tinta={C.noche} x={960} y={140} centro size={62} t1={127.5} />
      <Chip t={t} t0={127.58} text="STOPS COUNTING" color={C.rojo} x={960} y={140} centro size={72} />
    </Escena>

    {/* 034-035 · familias afuera del fuerte: los chicos juegan; para la ley esos hijos no existían y se borran */}
    <Escena t={t} t0={128.56} t1={135.16} zoom={0.05} entra="corte" golpes={[130.32, 133.84]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={60} seed={53} alto={500} />
      <Astro x={260} y={200} r={70} luna />
      <Colinas capas={["#3a2a6a", "#2a1d5a"]} base={620} seed={54} alto={60} />
      <Fuerte x={1320} y={600} s={0.75} w={1300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 840, bottom: 0, background: "linear-gradient(180deg, #4a3a2a, #2a1a10)" }} />
      <Casa x={260} y={840} s={1.0} tono="#d9b48a" techo="#7a3a2a" luz />
      {(() => {
        const borra = prog(t, 133.84, 134.6);
        const kx = 900 + Math.sin(t * 1.7) * 110;
        return <>
          <Persona x={470} y={1000} h={480} t={t} seed={1} casco="legion" expr={t > 133.84 ? "triste" : "feliz"} mira={0.7} bD={t > 133.84 ? 10 : 60} cD={40} />
          <Velo x={700} y={1000} h={450} color="#5a2a7a" />
          <Persona x={700} y={1000} h={450} t={t} seed={95} ropa={CIVIL(6)} expr={t > 133.84 ? "triste" : "feliz"} mira={0.7} />
          <Persona x={kx} y={1010} h={250} t={t} seed={97} ropa={CIVIL(2)} expr="feliz" camina={2} flip={Math.cos(t * 1.7) < 0} sombra={borra > 0.3 ? "#8a7ab8" : undefined} opacity={1 - 0.7 * borra} />
          <Persona x={1110} y={1010} h={220} t={t} seed={98} ropa={CIVIL(4)} expr="feliz" flip salta={t < 133.84 ? Math.floor(t / 0.7) * 0.7 : undefined} {...pose("festejar", t, 1.2)} sombra={borra > 0.3 ? "#8a7ab8" : undefined} opacity={1 - 0.7 * borra} />
          {t > 133.84 && <Emote t={t} t0={134.0} tipo="lagrimas" {...L(700, 1000, 450)} />}
        </>;
      })()}
      <Particulas t={t} tipo="luciernagas" n={20} seed={55} />
      <Chip t={t} t0={128.6} text="OUTSIDE THE FORT" color={C.teal} tinta={C.noche} x={150} y={130} size={54} />
      {/* ficha de la ley romana */}
      <div style={{ position: "absolute", left: 1180, top: 140, width: 560, height: 290, background: "#fff8ec", border: "9px solid #2a1530", borderRadius: 22, boxShadow: "14px 16px 0 rgba(10,5,30,.45)", fontFamily, fontWeight: 700, color: "#2a1530", transform: `scale(${ent(t, 128.6)}) rotate(-2deg)` }}>
        <div style={{ textAlign: "center", fontSize: 42, color: C.violeta, marginTop: 14 }}>IN ROMAN LAW</div>
        <div style={{ position: "absolute", left: 36, top: 100, fontSize: 48 }}>WIFE: <span style={{ color: C.rojo }}>NONE</span></div>
        <div style={{ position: "absolute", left: 36, top: 180, fontSize: 48 }}>CHILDREN: <span style={{ color: t > 133.84 ? C.rojo : "#2fae5a", display: "inline-block", transform: `scale(${t > 133.84 ? ent(t, 133.84) : 1})` }}>{t > 133.84 ? "0" : "2"}</span></div>
      </div>
      <Sello t={t} t0={133.84} text="DID NOT EXIST" x={1450} y={540} size={84} />
    </Escena>
    {/* 036 · ¿y la paga? desde Domiciano...: el protagonista pregunta y el emperador aparece en su trono */}
    <Escena t={t} t0={135.16} t1={137.74} entra="corte" banda={C.oro} golpes={[137.26]}>
      <Interior tono="#cdb0e0" piso="#7a5a9a" />
      <div style={{ position: "absolute", left: 1000, top: 620, width: 400, height: 400, background: "#e9a92a", borderRadius: "40px 40px 0 0", border: "10px solid #8a5a1a" }} />
      <Persona x={1200} y={1010} h={680} t={t} seed={120} ropa={{ tunica: "#6a2a9a", tunica2: "#4a1a7a", cinto: "#e9a92a", piel: "#f2c09a", piel2: "#d89a72", pelo: "#3a2a1a" }} expr="orgullo" aparece={136.6} bD={t > 136.9 ? 110 : 10} cD={20} flip habla={t > 136.9} />
      <Persona x={480} y={1030} h={620} t={t} seed={1} casco="legion" expr={t > 136.6 ? "sorpresa" : "neutro"} mira={0.6} {...pose("contar", t, 1)} />
      <Emote t={t} t0={135.2} t1={136.5} tipo="preg" {...L(480, 1030, 620)} s={1.3} />
      <Chip t={t} t0={135.16} text="THE PAY?" color={C.ambar} tinta={C.noche} x={150} y={140} size={64} />
      <Chip t={t} t0={137.26} text="EMPEROR DOMITIAN" color={C.violeta} x={1200} y={140} centro size={60} />
    </Escena>

    {/* 037 · 300 denarios de plata por año: las monedas caen en su bolsa y el contador sube */}
    <Escena t={t} t0={137.74} t1={140.08} entra="corte" golpes={[137.74, 138.72]}>
      <Interior />
      <Persona x={1300} y={1020} h={640} t={t} seed={1} casco="legion" flip expr="feliz" mira={0.5} miraY={0.4} bD={30} cD={20} bI={150} cI={20} />
      {Array.from({ length: 14 }, (_, i) => {
        const t0 = 137.8 + i * 0.16, u = prog(t, t0, t0 + 0.45);
        if (u <= 0 || u >= 1) return null;
        return <Denario key={i} plata r={42} x={1125 + ((i * 37) % 70) - 35} y={-60 + u * 880} t={t} gira={2} />;
      })}
      <Bolsa x={1125} y={875} s={0.8} t={t} txt={`${Math.round(300 * prog(t, 137.8, 140.0))}`} />
      <Cuenta t={t} t0={137.74} t1={140.0} de={0} a={300} x={560} y={340} size={260} color="#fff" />
      <Chip t={t} t0={138.0} text="SILVER DENARII / YEAR" color={C.teal} tinta={C.noche} x={560} y={560} centro size={54} />
      {Array.from({ length: 5 }, (_, i) => <Denario key={i} plata r={46} x={300 + i * 130} y={760 + (i % 2) * 20} t={t} t0={138.72 + i * 0.08} gira={1.2} />)}
    </Escena>
    {/* 038 · suena bien. Después llegan los descuentos */}
    <Escena t={t} t0={140.08} t1={143.78} entra="barrido" golpes={[142.36]}>
      <Campamento t={t} hora={t < 142.36 ? "dia" : "tarde"} />
      {t > 142.36 && <AbsoluteFill style={{ background: "rgba(60,10,40,.45)" }} />}
      {t < 142.36 && <Particulas t={t} tipo="lluviaoro" n={40} seed={56} />}
      <Persona x={960} y={1040} h={760} t={t} seed={1} casco="legion" expr={t < 142.36 ? "feliz" : "miedo"} {...(t < 142.36 ? pose("festejar", t, 1.2) : pose("temblar", t))} />
      <Emote t={t} t0={140.3} t1={142.3} tipo="brillos" {...L(960, 1040, 760)} s={1.4} />
      <Emote t={t} t0={142.5} tipo="susto" {...L(960, 1040, 760)} s={1.4} />
      {t > 142.36 && Array.from({ length: 6 }, (_, i) => {
        const k = prog(t, 142.4 + i * 0.08, 143.3 + i * 0.08);
        return <Denario key={i} plata r={50} x={760 + i * 80 + k * (i % 2 ? 900 : -900)} y={760 - k * 500} t={t} rot={k * 400} />;
      })}
      <Chip t={t} t0={140.2} text="SOUNDS DECENT" color={C.lima} tinta={C.noche} x={160} y={140} size={62} t1={142.3} />
      <Chip t={t} t0={142.36} text="THE DEDUCTIONS ARRIVE" color={C.rojo} x={960} y={140} centro size={70} />
    </Escena>

    {/* 039 · un recibo de sueldo de un fuerte en Egipto */}
    <Escena t={t} t0={143.78} t1={148.9} zoom={0.04} entra="iris" banda={C.ambar} golpes={[143.92, 145.52]}>
      <MapaPuntos t={t} pulsa={["EGYPT"]} t0Pulsa={145.52} vuela={{ n: "EGYPT", z: 1.8, t: [143.9, 145.4] }} />
      <Chip t={t} t0={145.52} text="EGYPT" color={C.ambar} tinta={C.noche} x={1100} y={420} size={70} />
      <Chip t={t} t0={143.92} text="A REAL PAY RECORD" color={C.violeta} x={960} y={110} centro size={62} />
      {t > 146.6 && <Pergamino x={600} y={680} w={420} abre={prog(t, 146.6, 147.4)} lineas={5} titulo="PAY" />}
      <Persona x={1400} y={930} h={420} t={t} seed={1} casco="legion" expr={t > 146.6 ? "sorpresa" : "neutro"} mira={-0.8} bD={70} cD={60} manoD={<rect x={-40} y={-10} width={80} height={100} rx={6} fill="#f6e3b4" stroke="#c98f4a" strokeWidth={6} />} />
    </Escena>

    {/* 040-041 · heno, comida, botas, correas, la cena de Saturnales, el club funerario: cada renglón le saca monedas de la pila */}
    <Escena t={t} t0={148.9} t1={156.28} zoom={0.04} entra="corte" golpes={[149.74, 150.58, 151.5, 152.02, 153.46, 155.14]}>
      <Interior ventana={false} />
      {(() => {
        const ded: [number, number][] = [[149.74, 10], [150.58, 80], [151.5, 12], [153.46, 20], [155.14, 4]];
        const v = 300 - ded.reduce((a, [tt, m]) => a + (t > tt ? m * prog(t, tt, tt + 0.4) : 0), 0);
        const pulso = ded.reduce((a, [g]) => a + (t > g ? Math.exp(-(t - g) * 6) : 0), 0);
        const n = Math.max(1, Math.round(v / 20));
        return <>
          <div style={{ position: "absolute", left: 220, top: 260, width: 760, height: 600, background: "linear-gradient(180deg, #f2dfae, #e2c588)", borderRadius: 16, boxShadow: "14px 16px 0 rgba(20,8,40,.35)", border: "6px solid #b98a4a", fontFamily, fontWeight: 700, transform: `scale(${ent(t, 148.9)}) rotate(-1.5deg)`, transformOrigin: "50% 0%" }}>
            <div style={{ textAlign: "center", fontSize: 48, color: "#7a3d14", marginTop: 20, letterSpacing: 3 }}>PAY SLIP · DEDUCTIONS</div>
            {([["HAY", 149.74, "-10"], ["FOOD", 150.58, "-80"], ["BOOTS & STRAPS", 151.5, "-12"], ["SATURNALIA DINNER", 153.46, "-20"], ["BURIAL CLUB", 155.14, "-4"]] as const).map(([txt, t0, m], i) => {
              const on = t >= t0, a = on ? ent(t, t0) : 0;
              return (
                <div key={txt} style={{ position: "absolute", left: 46, right: 46, top: 110 + i * 92, height: 76, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 44, borderBottom: "4px dashed rgba(122,61,20,.35)", background: on && t < t0 + 0.9 ? "rgba(232,52,74,.18)" : "transparent", borderRadius: 10, padding: "0 10px" }}>
                  {on ? <span style={{ color: "#4a2a10", transform: `translateX(${(1 - a) * -40}px)`, opacity: Math.min(1, a) }}>{txt}</span> : <span style={{ color: "rgba(122,61,20,.35)" }}>· · ·</span>}
                  {on && <span style={{ color: C.rojo, transform: `scale(${a})`, display: "inline-block" }}>{m}</span>}
                </div>
              );
            })}
          </div>
          {Array.from({ length: n }, (_, i) => <Denario key={i} plata r={46} x={1190} y={960 - i * 26} />)}
          {ded.map(([tt], i) => {
            const u = prog(t, tt, tt + 0.45);
            if (u <= 0 || u >= 1) return null;
            const y0 = 960 - n * 26, y1 = 408 + i * 92;
            return <Denario key={"v" + i} plata r={42} x={1190 + (900 - 1190) * u} y={y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 180} t={t} gira={3} />;
          })}
          <div style={{ position: "absolute", left: 1190, top: 230, transform: `translate(-50%,-50%) scale(${1 + 0.15 * pulso})`, fontFamily, fontWeight: 700, fontSize: 170, color: v < 200 ? C.rojo : "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill" }}>{Math.round(v)}</div>
          <Persona x={1500} y={990} h={600} t={t} seed={1} casco="legion" flip mira={0.8} expr={t > 152 ? "triste" : "miedo"} bD={t > 152 ? 120 : 60} cD={t > 152 ? 120 : 70} bI={t > 152 ? 120 : 30} cI={t > 152 ? 120 : 30} />
          <Emote t={t} t0={150.7} tipo="sudor" {...L(1500, 990, 600)} />
          {t > 153.46 && <Emote t={t} t0={153.6} tipo="lagrimas" {...L(1500, 990, 600)} />}
        </>;
      })()}
    </Escena>

    {/* 042 · sí: pagás por adelantado tu propio funeral. Le da la moneda al enterrador; la lápida ya espera */}
    <Escena t={t} t0={156.28} t1={160.12} zoom={0.04} entra="corte" golpes={[156.4, 159.06]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#3a0f2a", "#2a0a1e"]} base={720} seed={57} alto={50} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "#3a5a2a" }} />
      <Lapida x={1440} y={640} s={1.0} t={t} t0={156.3} lineas={["HERE LIES", "YOU"]} grande="PAID" />
      <Persona x={1000} y={1000} h={560} t={t} seed={150} ropa={{ tunica: "#4a4a5a", tunica2: "#2a2a38", cinto: "#1a1a22", piel: "#e8c0a0", piel2: "#c89a7a", pelo: "#1a1410" }} expr="feliz" flip habla
        bD={70} cD={10} bI={150} cI={10} manoI={<g><line x1={0} y1={30} x2={0} y2={-260} stroke="#6b3a1f" strokeWidth={14} strokeLinecap="round" /><path d="M -40 30 L 40 30 L 30 110 Q 0 130 -30 110 Z" fill="#8a93a3" /></g>} />
      {(() => {
        const u = prog(t, 158.4, 158.95);
        return <>
          <Persona x={480} y={1010} h={580} t={t} seed={1} casco="legion" expr={t < 159.06 ? "triste" : "miedo"} mira={0.8} bD={t > 158.2 ? 75 : 30} cD={t > 158.2 ? 10 : 70} inclina={t > 158.2 ? 6 : -2} />
          {u > 0 && u < 1 && <Denario plata r={34} x={640 + u * 220} y={700 - Math.sin(u * Math.PI) * 140} t={t} gira={3} />}
          <Emote t={t} t0={157.0} tipo="sudor" {...L(480, 1010, 580)} />
          <Emote t={t} t0={159.06} tipo="excl" {...L(480, 1010, 580)} />
        </>;
      })()}
      <Chip t={t} t0={156.4} text="IN ADVANCE" color={C.ambar} tinta={C.noche} x={150} y={140} size={62} />
      <Chip t={t} t0={159.06} text="YOUR OWN FUNERAL" color={C.rojo} x={1420} y={170} centro size={60} />
    </Escena>
    {/* 043 · Roma, tan considerada, te ahorra el papeleo */}
    <Escena t={t} t0={160.12} t1={163.26} zoom={0.04} entra="iris" ix={960} iy={420} golpes={[162.22]}>
      <Interior />
      <Aguila x={960} y={330} s={1.0} />
      <Persona x={360} y={1030} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="feliz" habla {...pose("escribir", t, 1.5)} />
      <Persona x={1400} y={1000} h={600} t={t} seed={1} casco="legion" flip expr={t > 162.22 ? "sorpresa" : "neutro"} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 720 + (i % 2) * 14, top: 860 - i * 34, width: 480, height: 40, background: i % 2 ? "#f2dfae" : "#e2c588", border: "4px solid #b98a4a", borderRadius: 6, transform: `scale(${ent(t, 160.3 + i * 0.1)}) rotate(${(i % 3 - 1) * 2}deg)` }} />
      ))}
      <Sello t={t} t0={162.22} text="DONE FOR YOU" x={960} y={760} size={90} />
      <Chip t={t} t0={160.3} text="HOW CONSIDERATE" color={C.violeta} x={960} y={110} centro size={62} />
      <Trampas t={t} t0={162.5} n={1} y={980} />
    </Escena>
  </>
);
