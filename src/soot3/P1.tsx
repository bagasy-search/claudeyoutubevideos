import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CENTURION, CIVIL } from "./persona";
import {
  C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos,
  Pergamino, Aguila, Casa, Mesa, Tienda, Particulas, Rayos, Frente, Emote, cabeza,
} from "./kit";
import { Denario, Tarjeta, Mano, Placa, Regla, Fuerte, Lapida, Papiro, Trampas, Bolsa } from "./kit2";
import { Palo } from "./kit";
import { Campamento, Interior, FilaLejana, Empalizada, pose, CarpaInterior, PlazaArmas, PuertaPretoria, Pueblo, Multitud, EnMano } from "./kit3";

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

// ── v4 (ojo director): utilería AGARRABLE (mango en (0,0) hacia +x, va en agarra/agarraI) y muebles para sentarse
export const Banco: React.FC<{ x: number; y: number; w?: number; alto?: number; tono?: string }> = ({ x, y, w = 260, alto = 130, tono = "#a8622c" }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - alto, overflow: "visible" }} width={w} height={alto}>
    <ellipse cx={w / 2 - 30} cy={alto - 2} rx={w / 2 + 20} ry={12} fill="#1d0f33" opacity={0.2} />
    <rect x={10} y={0} width={w - 20} height={26} rx={8} fill={tono} /><rect x={30} y={20} width={20} height={alto - 20} fill="#6b3a1f" /><rect x={w - 50} y={20} width={20} height={alto - 20} fill="#6b3a1f" />
  </svg>
);
export const LupaMano: React.FC = () => (
  <g>
    <rect x={-24} y={-10} width={140} height={20} rx={9} fill="#6b3a1f" />
    <circle cx={196} cy={0} r={80} fill="rgba(200,240,255,.28)" stroke="#e9a92a" strokeWidth={15} />
    <path d="M 150 -40 Q 168 -62 198 -64" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75} />
  </g>
);
export const Vara: React.FC<{ largo?: number }> = ({ largo = 270 }) => (
  <g>
    <path d={`M -40 0 Q ${largo / 2} -10 ${largo} 4`} stroke="#6b3a1f" strokeWidth={15} fill="none" strokeLinecap="round" />
    {[0.3, 0.6, 0.85].map((k) => <circle key={k} cx={largo * k} cy={-4} r={9} fill="#7d4a24" />)}
  </g>
);
export const AnilloMano: React.FC = () => (
  <g><circle cx={46} cy={-6} r={24} fill="none" stroke="#f7c548" strokeWidth={10} /><circle cx={46} cy={-32} r={8} fill="#bfe8ff" stroke="#fff" strokeWidth={3} /></g>
);
export const PanMano: React.FC = () => (
  <g><ellipse cx={54} cy={0} rx={56} ry={32} fill="#a8621f" /><ellipse cx={54} cy={-5} rx={50} ry={26} fill="#d98a35" />{[-1, 0, 1].map((k) => <path key={k} d={`M ${44 + k * 22} -24 Q ${50 + k * 22} -4 ${46 + k * 22} 16`} stroke="#a8621f" strokeWidth={5} fill="none" />)}</g>
);
export const SelloMano: React.FC = () => (
  <g><rect x={-20} y={-12} width={90} height={24} rx={10} fill="#6b3a1f" /><rect x={66} y={-46} width={44} height={92} rx={8} fill={C.rojo} /><rect x={106} y={-52} width={14} height={104} rx={4} fill="#5a0f1d" /></g>
);
// cartel de madera clavado en un poste (texto diegético, no flota)
export const Cartel: React.FC<{ t: number; t0?: number; x: number; y: number; text: string; size?: number; poste?: number; rot?: number }> = ({ t, t0, x, y, text, size = 44, poste = 220, rot = -3 }) => {
  if (t0 !== undefined && t < t0) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  return <>
    <div style={{ position: "absolute", left: x - 9, top: y, width: 18, height: poste, background: "#6b3a1f" }} />
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + Math.sin(t * 2) * 1.2}deg) scale(${e})`, background: "#d9a85a", border: "7px solid #6b3a1f", borderRadius: 10, padding: "4px 22px", fontFamily, fontWeight: 700, fontSize: size, color: "#5a3418", whiteSpace: "nowrap", boxShadow: "8px 10px 0 rgba(20,8,40,.25)" }}>{text}</div>
  </>;
};
// flecha curva que se dibuja (de un chip a su objeto)
export const Flecha: React.FC<{ t: number; t0: number; x1: number; y1: number; x2: number; y2: number; color?: string; curva?: number }> = ({ t, t0, x1, y1, x2, y2, color = "#fff", curva = 60 }) => {
  if (t < t0) return null;
  const k = prog(t, t0, t0 + 0.3);
  const mx = (x1 + x2) / 2 + curva, my = (y1 + y2) / 2;
  const ang = Math.atan2(y2 - my, x2 - mx);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width={1920} height={1080}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - k)} />
      {k > 0.95 && <path d={`M ${x2} ${y2} L ${x2 - 34 * Math.cos(ang - 0.5)} ${y2 - 34 * Math.sin(ang - 0.5)} M ${x2} ${y2} L ${x2 - 34 * Math.cos(ang + 0.5)} ${y2 - 34 * Math.sin(ang + 0.5)}`} stroke={color} strokeWidth={10} strokeLinecap="round" />}
    </svg>
  );
};

export const P1: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 017 · vas a ver al oficial de reclutamiento: entra por la puerta del fuerte hasta su mesa */}
    <Escena t={t} t0={63.48} t1={65.66} entra="barrido" golpes={[64.7]}>
      <PuertaPretoria t={t} guardia={false} dx={(t - 63.48) * 20} />
      <Mesa x={1330} y={820} w={380} />
      <svg style={{ position: "absolute", left: 1220, top: 790, overflow: "visible" }} width={200} height={40}><rect x={0} y={4} width={170} height={30} rx={4} fill="#f6e3b4" stroke="#c98f4a" strokeWidth={4} /></svg>
      <Persona x={1600} y={1050} h={540} t={t} seed={60} ropa={CENTURION} casco="centurion" postura="sentado" giro="34" flip expr="neutro" habla
        bD={interpolate(Math.sin(t * 4), [-1, 1], [55, 75])} cD={30} agarra={<EnMano.pluma />} agarraAng={120} />
      <Persona x={interpolate(t, [63.48, 65.3], [260, 940], { extrapolateRight: "clamp" })} y={1050} h={560} t={t} seed={1} casco="legion" giro={t < 65.3 ? "perfil" : "34"} expr="orgullo" camina={t < 65.3 ? 1.6 : 0}
        agarraI={<EnMano.bolsa />} agarraAngI={90} bI={14} cI={10} />
      <Particulas t={t} tipo="polvo" n={18} seed={31} />
      <Chip t={t} t0={63.2} text="RECRUITING OFFICER" color={C.violeta} x={1420} y={230} centro size={58} />
    </Escena>

    {/* 018 · primero te miden: la tabla baja hasta el casco y hace ¡toc! */}
    <Escena t={t} t0={65.66} t1={67.4} entra="corte" golpes={[66.68]}>
      <Interior />
      {(() => {
        const x = 820, y = 1040, h = 720, tope = y - h + 6;
        const yb = interpolate(prog(t, 65.8, 66.6), [0, 1], [150, tope]);
        const bote = t > 66.6 ? Math.sin((t - 66.6) * 18) * 8 * Math.exp(-(t - 66.6) * 6) : 0;
        return <>
          <div style={{ position: "absolute", left: 1040, top: 130, width: 60, height: 920, background: "repeating-linear-gradient(180deg,#e9c27a 0 34px,#7a4a1f 34px 38px)", border: "6px solid #6b3a1f", borderRadius: 8 }} />
          <Persona x={x} y={y + bote} h={h} t={t} seed={1} casco="legion" expr={t < 66.68 ? "neutro" : "orgullo"} miraY={-0.7} mira={0.2} reaccion="ojos" reaccionT0={66.62} />
          <div style={{ position: "absolute", left: 640, top: yb - 14, width: 470, height: 28, background: "#a8622c", border: "5px solid #5a3418", borderRadius: 6 }} />
          <Emote t={t} t0={66.7} tipo="brillos" {...L(x, y, h)} s={1.1} />
        </>;
      })()}
      <Persona x={1480} y={1040} h={640} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="neutro" habla bD={70} cD={30} agarra={<EnMano.tablilla texto="5'9" />} agarraAng={-40} />
      <Chip t={t} t0={65.3} text="STEP 1" color={C.ambar} tinta={C.noche} x={120} y={200} size={56} />
      <Grande t={t} t0={66.68} text="MEASURED" x={300} y={660} size={72} color="#fff" />
    </Escena>

    {/* 019 · el recluta ideal según Vegecio: Vegecio sentado escribe; al recluta lo miden y el examinador tilda */}
    <Escena t={t} t0={67.4} t1={72.04} zoom={0.04} entra="corte" golpes={[69.84, 70.8]}>
      <Interior ventana={false} />
      <div style={{ position: "absolute", left: 90, top: 240, width: 620, height: 320, background: "linear-gradient(180deg,#f6e3b4,#ead09a)", border: "8px solid #c98f4a", borderRadius: 14, boxShadow: "12px 14px 0 rgba(20,8,40,.3)", fontFamily, fontWeight: 700, color: "#5a3418", transform: `scale(${ent(t, 67.0)})`, transformOrigin: "50% 0%" }}>
        <div style={{ textAlign: "center", fontSize: 44, color: "#7a3d14", marginTop: 12, letterSpacing: 2 }}>VEGETIUS · ON WAR</div>
        {(["THE IDEAL RECRUIT:", "· ALERT EYES", "· HEAD HELD HIGH", "· BROAD CHEST"] as const).map((l, i) => {
          const t0 = 67.6 + i * 0.8;
          const k = prog(t, t0, t0 + 0.7);
          return <div key={i} style={{ marginLeft: 34, marginTop: 2, fontSize: 40, whiteSpace: "nowrap", overflow: "hidden", width: `${k * 92}%`, color: i === 0 ? C.rojo : "#5a3418" }}>{l}</div>;
        })}
      </div>
      <Persona x={250} y={1050} h={600} t={t} seed={88} ropa={CIVIL(5)} viejo postura="sentado" giro="34" expr="orgullo" habla={t > 69.8} mira={0.4}
        bD={interpolate(Math.sin(t * 9), [-1, 1], [48, 58])} cD={70} agarra={<EnMano.pluma />} agarraAng={-60} />
      <Mesa x={530} y={860} w={300} />
      <svg style={{ position: "absolute", left: 420, top: 836, overflow: "visible" }} width={220} height={40}><rect x={0} y={4} width={200} height={28} rx={4} fill="#f6e3b4" stroke="#c98f4a" strokeWidth={4} /></svg>
      <div style={{ position: "absolute", left: 1350, top: 300, width: 50, height: 740, background: "repeating-linear-gradient(180deg,#e9c27a 0 30px,#7a4a1f 30px 34px)", border: "6px solid #6b3a1f", borderRadius: 8 }} />
      <Persona x={1140} y={1040} h={700} t={t} seed={1} casco="legion" expr={t > 70.8 ? "sorpresa" : "orgullo"} mira={-0.4} miraY={-0.2} reaccion="ojos" reaccionT0={70.8} />
      <div style={{ position: "absolute", left: 1000, top: 1040 - 700 - 4, width: 420, height: 22, background: "#a8622c", border: "5px solid #5a3418", borderRadius: 6 }} />
      <Persona x={1640} y={1040} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="neutro" habla={t < 69.8} bD={70} cD={40} agarra={<EnMano.tablilla texto={t > 69.84 ? "✓ ✓" : "✓"} />} agarraAng={-50} />
      {(() => { const c = L(1140, 1040, 700); return <>
        <Linea t={t} t0={70.8} x1={880} y1={660} x2={c.x - 60} y2={c.y} color={C.ambar} />
        <Chip t={t} t0={70.8} text="ALERT EYES" color={C.ambar} tinta={C.noche} x={830} y={660} centro size={52} />
      </>; })()}
      <Chip t={t} t0={67.0} text="THE IDEAL RECRUIT" color={C.rojo} x={1160} y={200} centro size={60} />
    </Escena>
    {/* 020 · pecho ancho, hombros, dedos largos y panza chica: el viejo señala con la vara y él saca músculo */}
    <Escena t={t} t0={72.04} t1={76.76} zoom={0.04} entra="corte" golpes={[72.2, 73.3, 74.58, 75.66]}>
      <Interior />
      <Persona x={250} y={1030} h={580} t={t} seed={88} ropa={CIVIL(5)} viejo giro="34" expr="neutro" habla bD={interpolate(prog(t, 72.1, 72.5), [0, 1], [30, 80])} cD={10} agarra={<Vara largo={230} />} agarraAng={-14} />
      {(() => {
        const h = 860, y = 1040, x = 760, c = L(x, y, h), s = c.s;
        const flex = t > 73.3 && t < 74.5;
        const pts: [number, number, number, string, string][] = [
          [72.2, x, c.y + 260 * s, "BROAD CHEST", C.teal],
          [73.3, x + 130 * s, c.y + 170 * s, "MUSCULAR SHOULDERS", C.rojo],
          [74.58, x + 210 * s, c.y + 470 * s, "LONG FINGERS", C.ambar],
          [75.66, x, c.y + 420 * s, "SMALL BELLY", C.rosa],
        ];
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={t > 75.66 ? "sorpresa" : "orgullo"}
            bI={flex ? 150 : 10} cI={flex ? 130 : 10} bD={flex ? 150 : t > 74.58 ? 30 : 10} cD={flex ? 130 : 10} inclina={t > 75.66 ? -3 : 0} reaccion={t > 75.66 ? "susto" : undefined} reaccionT0={75.7} />
          {pts.map(([t0, px, py, txt, col], i) => <React.Fragment key={i}>
            <Linea t={t} t0={t0} x1={1200} y1={250 + i * 170} x2={px} y2={py} color={col} />
            <Chip t={t} t0={t0} text={txt} color={col} tinta={col === C.rojo ? "#fff" : C.noche} x={1200} y={250 + i * 170} size={50} />
          </React.Fragment>)}
          <Emote t={t} t0={75.9} tipo="sudor" {...c} s={1.6} />
        </>;
      })()}
    </Escena>

    {/* 021 · ojos, dientes, ¿de qué trabajabas?: el examinador le pasa la lupa por los ojos y la boca */}
    <Escena t={t} t0={76.76} t1={80.92} entra="corte" golpes={[77.26, 78.46, 80.3]}>
      <Interior />
      {(() => {
        const h = 780, y = 1035, x = 700, c = L(x, y, h);
        const boca = t >= 78.46 && t < 80.3;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" giro="34" expr={boca ? "sorpresa" : t < 78.46 ? "neutro" : "miedo"} mira={t > 80.3 ? 0.4 : 0.8} miraY={boca ? -0.4 : 0} />
          <Persona x={1150} y={1035} h={680} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="neutro" habla inclina={6}
            bD={120} cD={10} agarra={<LupaMano />} agarraAng={boca ? -14 : -55} />
          <Emote t={t} t0={80.3} tipo="preg" {...c} s={1.4} />
        </>;
      })()}
      <div style={{ position: "absolute", left: 1400, top: 230, width: 420, height: 540, background: "#fff8ec", border: "9px solid #2a1530", borderRadius: 24, boxShadow: "14px 16px 0 rgba(20,8,40,.3)", fontFamily, fontWeight: 700, transform: `scale(${ent(t, 76.4)}) rotate(2deg)` }}>
        <div style={{ textAlign: "center", fontSize: 46, color: C.rojo, marginTop: 18 }}>THE EXAM</div>
        {([["HEIGHT", 0], ["EYES", 77.26], ["TEETH", 78.46], ["YOUR JOB", 80.3]] as const).map(([k, tv], i) => {
          const on = t >= tv;
          const preg = i === 3;
          return (
            <div key={k} style={{ position: "absolute", left: 30, right: 30, top: 110 + i * 104, height: 88, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 42, color: on ? "#2a1530" : "#b9a888", background: on && t < tv + 1.2 && tv > 0 ? "rgba(255,176,32,.35)" : "transparent", borderRadius: 14, padding: "0 12px" }}>
              <span>{k}{preg ? "?" : ""}</span>
              {on && <span style={{ width: 62, height: 62, borderRadius: 31, background: preg ? C.rojo : "#2fae5a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, transform: `scale(${tv > 0 ? ent(t, tv) : 1})` }}>{preg ? "?" : "✓"}</span>}
            </div>
          );
        })}
      </div>
    </Escena>
    {/* 022 · herreros, carpinteros, carniceros y cazadores de jabalí: bienvenidos, cada uno con su herramienta */}
    <Escena t={t} t0={80.92} t1={85.02} zoom={0.03} entra="sube" banda={C.lima} golpes={[80.92, 83.36]}>
      <PuertaPretoria t={t} abre={1} guardia={false} dx={(t - 80.9) * 15} />
      {([["herrero", "BLACKSMITH", 80.92, <EnMano.martillo />, -70, "34"], ["carpintero", "CARPENTER", 81.64, <EnMano.pico />, -60, "frente"], ["carnicero", "BUTCHER", 82.44, <EnMano.gladius />, -50, "34"], ["jabali", "BOAR HUNTER", 83.36, <EnMano.lanza />, -75, "perfil"]] as const).map(([of, lab, t0, obj, ang, giro], i) => (
        <React.Fragment key={of}>
          <Tarjeta of={of} label={lab} veredicto="si" tv={t0 + 0.35} x={290 + i * 400} y={440} s={0.7} t={t} t0={t0 - 0.3} rot={(i % 2 ? 1 : -1) * 3} />
          <Persona x={290 + i * 400} y={1050} h={440} t={t} seed={160 + i} ropa={CIVIL(i)} giro={giro} expr={t > t0 + 0.35 ? "feliz" : "neutro"} aparece={t0 - 0.3}
            bD={t > t0 + 0.35 ? 150 : 60} cD={20} agarra={obj} agarraAng={ang} bI={t > t0 + 0.35 ? 140 : 20} cI={30} salta={t0 + 0.4} />
        </React.Fragment>
      ))}
      <Grande t={t} t0={83.9} text="WELCOME!" y={220} size={110} color={C.lima} />
    </Escena>

    {/* 023 · pescadores, pasteleros, tejedores de lino: fuera; el oficial estampa el NO */}
    <Escena t={t} t0={85.02} t1={89.82} zoom={0.03} entra="barrido" banda={C.rojo} golpes={[85.02, 85.7, 86.76]}>
      <PuertaPretoria t={t} hora="tarde" guardia={false} dx={(t - 85) * 15} />
      {([["pescador", "FISHERMAN", 85.02, "34"], ["pastelero", "PASTRY COOK", 85.7, "frente"], ["tejedor", "LINEN WEAVER", 86.76, "34"]] as const).map(([of, lab, t0, giro], i) => (
        <React.Fragment key={of}>
          <Tarjeta of={of} label={lab} veredicto="no" tv={t0 + 0.3} x={300 + i * 380} y={450} s={0.7} t={t} t0={t0 - 0.3} rot={(i % 2 ? -1 : 1) * 4} />
          <Persona x={300 + i * 380} y={1050} h={430} t={t} seed={101 + i} ropa={CIVIL(i + 2)} giro={giro} expr={t > t0 + 0.3 ? "triste" : "feliz"} aparece={t0 - 0.3}
            {...(t > t0 + 0.3 ? { bI: 120, cI: 120, bD: 120, cD: 120 } : {})} agarra={i === 1 ? <PanMano /> : undefined} agarraAng={i === 1 ? 20 : 0} />
        </React.Fragment>
      ))}
      <Mesa x={1460} y={840} w={320} />
      <Persona x={1680} y={1050} h={580} t={t} seed={89} ropa={CENTURION} casco="centurion" giro="34" flip expr="enojado" {...pose("golpear", t, 1.1)} agarra={<SelloMano />} agarraAng={80} />
      <Chip t={t} t0={88.0} text="I'M NOT MAKING THIS UP" color={C.ambar} tinta={C.noche} x={960} y={210} centro size={58} />
    </Escena>

    {/* 024 · todo lo que tenga que ver con el cuarto de las mujeres: a casa. Cada aspirante recibe su GO HOME en un beat distinto y sale de cuadro */}
    <Escena t={t} t0={89.82} t1={94.6} entra="corte" golpes={[90.1, 90.9, 91.7, 92.6, 93.74]}>
      <PuertaPretoria t={t} hora="tarde" guardia={false} />
      {(() => {
        // [seed, oficio, ropa, etiqueta, aparece, giro, sello, pose de espera, pose de rechazo]
        const filas: [number, string, number, string, number, "34" | "perfil" | "frente", number, object, object][] = [
          [101, "pescador", 2, "FISHERMAN", 0, "34", 90.1, { bI: 30, cI: 120, bD: 30, cD: 120 }, { bI: 120, cI: 120, bD: 110, cD: 110 }],
          [102, "pastelero", 3, "PASTRY COOK", 0, "34", 90.9, { bI: 55, cI: 125, bD: 55, cD: 125 }, { bI: -150, cI: 30, bD: -150, cD: -30 }],
          [103, "tejedor", 4, "WEAVER", 0, "frente", 91.7, { bI: 8, cI: 0, bD: 150, cD: 20 }, { bI: 20, cI: 10, bD: 20, cD: 10 }],
          [91, "mujeres", 3, "WOMEN'S QUARTERS", 91.6, "34", 92.6, { bI: 35, cI: 120, bD: 35, cD: 120 }, { bI: 70, cI: 150, bD: 70, cD: 150 }],
        ];
        const rech = filas.filter((f) => t >= f[6]).length;
        return <>
          <Mesa x={1440} y={830} w={300} />
          <Persona x={1650} y={1040} h={540} t={t} seed={89} ropa={CENTURION} casco="centurion" giro="34" flip expr="enojado" habla
            {...(filas.some((f) => t > f[6] - 0.25 && t < f[6] + 0.3) ? pose("golpear", t, 1.6) : { bD: 40, cD: 60 })} agarra={<SelloMano />} agarraAng={80} />
          <div style={{ position: "absolute", left: 1440, top: 900, transform: `translate(-50%,-50%) scale(${1 + filas.reduce((a2, f) => a2 + (t > f[6] ? 0.25 * Math.exp(-(t - f[6]) * 7) : 0), 0)})`, background: C.rojo, color: "#fff", fontFamily, fontWeight: 700, fontSize: 38, padding: "4px 16px", borderRadius: 10, border: "5px solid #fff", whiteSpace: "nowrap" }}>REJECTED: {rech}</div>
          {filas.map(([seed, of, ci, lab, t0, giro, ts, espera, no], i) => {
            const sale = Math.max(0, t - ts - 0.45);
            const x = 270 + i * 212 - sale * 820;
            if (x < -200) return null;
            const rech1 = t >= ts;
            return <React.Fragment key={seed}>
              {(t0 === 0 || t >= t0) && <Tarjeta of={of as "pescador"} label={lab} veredicto="no" tv={ts} x={x} y={500} s={0.6} t={t} t0={t0 || undefined} />}
              <Persona x={x} y={1040} h={420 + (i % 2) * 22} t={t} seed={seed} ropa={CIVIL(ci)} giro={sale > 0 ? "perfil" : giro} flip={sale > 0} camina={sale > 0 ? 2 : 0}
                expr={rech1 ? (i === 1 ? "enojado" : "triste") : i === 2 ? "orgullo" : "feliz"} mira={rech1 ? 0 : 0.7} {...(sale > 0 ? {} : rech1 ? no : espera)}
                reaccion={rech1 && sale === 0 ? (i === 1 ? "susto" : "ojos") : undefined} reaccionT0={ts + 0.02} />
              {rech1 && <Sello t={t} t0={ts} text="GO HOME" x={x + 10} y={590} size={40} rot={-10 + i * 6} />}
            </React.Fragment>;
          })}
          <Persona x={1190} y={1040} h={540} t={t} seed={1} casco="legion" giro="34" expr="miedo" mira={0.8} {...pose("temblar", t)} />
          <Emote t={t} t0={90.0} tipo="sudor" {...L(1190, 1040, 540)} />
        </>;
      })()}
      <Chip t={t} t0={89.5} text="ANY JOB WITH..." color={C.violeta} x={760} y={170} centro size={58} t1={93.5} />
      <Chip t={t} t0={93.74} text="POLITELY: GO HOME" color={C.rojo} x={760} y={170} centro size={62} />
      <Sello t={t} t0={93.9} text="GO HOME" x={760} y={420} size={110} />
    </Escena>
    {/* 025a · pasaste */}
    <Escena t={t} t0={94.6} t1={96.2} entra="corte" golpes={[94.6]}>
      <PuertaPretoria t={t} abre={1} guardia={false} />
      <Particulas t={t} tipo="lluviaoro" n={50} seed={46} />
      <Persona x={900} y={1050} h={720} t={t} seed={1} casco="legion" expr="feliz" {...pose("festejar", t, 1.6)} salta={94.7} reaccion="ojos" reaccionT0={94.62} />
      <Persona x={1520} y={1050} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="feliz" bD={110} cD={60} agarra={<EnMano.tablilla texto="OK" />} agarraAng={-60} />
      <Emote t={t} t0={94.7} tipo="brillos" {...L(900, 1050, 720)} s={1.6} />
      <Grande t={t} t0={94.3} text="YOU PASS!" y={210} size={160} color="#fff" borde="#1d5a2a" />
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
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" giro="34" expr={t < 97.58 ? "neutro" : t < 99.64 ? "sorpresa" : "miedo"} miraY={0.4} mira={0.5}
            bD={t > 98.7 ? 70 : 10} cD={t > 98.7 ? 40 : 10} reaccion={t > 99.64 ? "susto" : undefined} reaccionT0={99.7} />
          <Placa x={c.x} y={c.y + 230 * c.s + caida} s={0.62} t={t} rot={balanceo} />
          <Persona x={1000} y={1030} h={640} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="orgullo" habla bD={cuelga ? 150 : 40} cD={cuelga ? 30 : 40} inclina={cuelga ? 6 : 0} />
          {t > 98.7 && (
            <div style={{ position: "absolute", left: 1460, top: 580, width: 500, height: 500, transform: `translate(-50%,-50%) scale(${ent(t, 98.7)})`, borderRadius: 250, background: "radial-gradient(circle, #fff8ec, #f0dcb4)", border: "12px solid #2a1530", overflow: "hidden", boxShadow: "14px 16px 0 rgba(20,8,40,.3)" }}>
              <Mano x={250} y={280} s={0.92} marca={prog(t, 99.64, 100.0)} rot={-6} />
              {t > 99.64 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(0, 0.8 - (t - 99.64) * 3) }} />}
            </div>
          )}
          {t > 98.7 && <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}><path d={`M ${c.x + 150 * c.s} ${y - 300 * c.s} L 1220 660`} stroke="#2a1530" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" opacity={ent(t, 98.7)} /></svg>}
        </>;
      })()}
      <Chip t={t} t0={95.9} t1={98.5} text="LEAD TAG" color={C.teal} tinta={C.noche} x={130} y={200} size={60} />
      <Chip t={t} t0={98.7} t1={99.5} text="+ A MARK" color={C.rojo} x={1460} y={240} centro size={60} />
      <Chip t={t} t0={99.64} text="TATTOOED?" color={C.ambar} tinta={C.noche} x={1460} y={240} centro size={58} />
    </Escena>
    {/* 026 · si te escapás, todos sabrán qué sos: corre por el pueblo y la gente lo señala */}
    <Escena t={t} t0={100.18} t1={104.78} zoom={0.05} entra="barrido" golpes={[101.84, 103.4]}>
      <Pueblo t={t} hora="tarde" dx={(t - 100.18) * 160} />
      {(() => {
        const x = interpolate(t, [100.18, 104.78], [1250, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <>
          <Multitud t={t} n={6} x0={1220} x1={1800} y={1010} h={400} seed={26} casco="no" ropa="civil" poses={["señala", "señala", "brazos", "señala"]} flip expr="enojado" habla aparece={102.4} mira={-0.6} />
          <Persona x={x} y={1040} h={520} t={t} seed={1} expr={t < 101.84 ? "neutro" : "miedo"} giro="perfil" flip corre={t > 100.4 ? 2.2 : 0} casco="legion" reaccion={t > 103.4 ? "susto" : undefined} reaccionT0={103.45} />
          <Emote t={t} t0={102.5} tipo="sudor" {...L(x, 1040, 520)} />
          {t > 103.4 && (
            <div style={{ position: "absolute", left: 1000, top: 610, width: 300, height: 300, transform: `translate(-50%,-50%) scale(${ent(t, 103.4)})`, borderRadius: 150, background: "radial-gradient(circle, #fff8ec, #f0dcb4)", border: "10px solid #2a1530", overflow: "hidden", boxShadow: "12px 14px 0 rgba(20,8,40,.3)" }}>
              <Mano x={150} y={170} s={0.55} marca={1} rot={-6} />
            </div>
          )}
        </>;
      })()}
      <Chip t={t} t0={101.84} text="RUN AWAY?" color={C.violeta} x={120} y={200} size={60} />
      <Chip t={t} t0={103.4} text="EVERYONE KNOWS" color={C.rojo} x={960} y={300} centro size={70} />
    </Escena>

    {/* 027 · el juramento: sacramentum, toda la plaza saluda al águila */}
    <Escena t={t} t0={104.78} t1={107.36} entra="zoom" golpes={[106.3]}>
      <PlazaArmas t={t} hora="tarde" dx={(t - 104.8) * 30} />
      <Multitud t={t} n={14} filas={2} x0={160} x1={1760} y={1000} h={360} seed={27} accion="saludar" vel={0.3} rompe={1} expr="orgullo" mira={0.1} />
      <Persona x={960} y={1060} h={560} t={t} seed={1} casco="legion" giro="34" expr="orgullo" bD={interpolate(ent(t, 104.9), [0, 1], [8, 155])} cD={14} reaccion={t > 106.3 ? "ojos" : undefined} reaccionT0={106.35} />
      <Particulas t={t} tipo="destellos" n={22} seed={50} />
      <Chip t={t} t0={104.5} text="THE OATH" color={C.violeta} x={960} y={200} centro size={60} />
      <Grande t={t} t0={106.3} text="SACRAMENTUM" y={340} size={130} color={C.oro} />
    </Escena>

    {/* 028 · obedecer, seguirlo a donde sea, no desertar nunca: contraplano desde atrás del general */}
    <Escena t={t} t0={107.36} t1={112.04} zoom={0.03} entra="corte" golpes={[108.04, 109.28, 110.66]}>
      <PlazaArmas t={t} hora="tarde" angulo="general" dx={(t - 107.3) * 20} />
      <Multitud t={t} n={12} filas={2} x0={420} x1={1500} y={900} h={320} seed={28} accion="saludar" vel={0.3} rompe={1} expr="orgullo" />
      <Persona x={700} y={950} h={380} t={t} seed={1} casco="legion" expr={t > 110.66 ? "miedo" : "orgullo"} bD={interpolate(ent(t, 107.4), [0, 1], [8, 160])} cD={8} reaccion={t > 110.66 ? "mandibula" : undefined} reaccionT0={110.7} />
      <Persona x={1350} y={1260} h={1000} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="espalda" expr="orgullo"
        bD={t < 109.28 ? 40 : interpolate(ent(t, 109.28), [0, 1], [40, 100])} cD={8} agarra={<Vara largo={240} />} agarraAng={t < 109.28 ? 60 : -20} bI={14} />
      {([[108.04, "OBEY", C.teal], [109.28, "FOLLOW HIM ANYWHERE", C.ambar], [110.66, "NEVER DESERT", C.rojo]] as const).map(([t0, txt, col], i) => (
        <Chip key={i} t={t} t0={t0} text={`${i + 1}. ${txt}`} color={col} tinta={col === C.rojo ? "#fff" : C.noche} x={100} y={200 + i * 100} size={50} />
      ))}
    </Escena>
    {/* 029 · tu cuerpo es de Roma por un cuarto de siglo */}
    <Escena t={t} t0={112.04} t1={116.68} zoom={0.05} entra="corte" golpes={[113.28, 115.5]}>
      <Campamento t={t} hora="noche" angulo="bajo" />
      <Persona x={600} y={1050} h={760} t={t} seed={1} expr={t < 113.28 ? "neutro" : "sorpresa"} casco="legion" giro="34" reaccion={t > 113.28 ? "ojos" : undefined} reaccionT0={113.3} bI={t > 113.28 ? 110 : 10} cI={t > 113.28 ? 120 : 10} />
      <Sello t={t} t0={113.28} text="PROPERTY OF ROME" x={1260} y={640} size={76} color={C.oro} />
      <Cuenta t={t} t0={115.5} t1={116.5} de={0} a={25} x={1400} y={330} size={200} color={C.oro} />
      <Chip t={t} t0={115.6} text="YEARS" color={C.rojo} x={1540} y={300} size={60} />
    </Escena>

    {/* 030 · la cláusula que nadie lee: la lupa en la mano encuentra el renglón */}
    <Escena t={t} t0={116.68} t1={118.9} entra="iris" ix={960} iy={560} golpes={[117.68]}>
      <Interior />
      <Pergamino x={1100} y={600} w={800} abre={1} lineas={9} titulo="CONTRACT" />
      {t > 117.68 && <div style={{ position: "absolute", left: 760, top: 720, width: 620, height: 34, background: "rgba(232,52,74,.35)", border: "4px solid " + C.rojo, borderRadius: 8, transform: `scaleX(${ent(t, 117.68)})`, transformOrigin: "0 50%" }} />}
      <Persona x={360} y={1040} h={620} t={t} seed={1} casco="legion" giro="34" expr={t > 117.68 ? "sorpresa" : "neutro"} mira={0.9} miraY={0.2} inclina={6}
        bD={interpolate(prog(t, 116.8, 117.6), [0, 1], [50, 70])} cD={10} agarra={<LupaMano />} agarraAng={interpolate(prog(t, 116.8, 117.6), [0, 1], [-10, 14])} reaccion={t > 117.68 ? "ojos" : undefined} reaccionT0={117.7} />
      <Chip t={t} t0={116.4} text="THE CLAUSE NOBODY READS" color={C.rojo} x={1100} y={200} centro size={58} />
    </Escena>

    {/* 031 · un soldado romano no se puede casar: arrodillado le ofrece el anillo, el contrato tacha WIFE en rojo, el anillo cae y rueda fuera de cuadro, ella se da vuelta y la empalizada baja */}
    <Escena t={t} t0={118.9} t1={122.04} zoom={0.04} entra="corte" golpes={[119.75, 120.4]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      {(() => {
        const tacha = t > 119.75;
        const cae = t > 120.4;
        const vuelta = t > 120.75;
        const u = prog(t, 120.4, 120.75);
        const rueda = Math.max(0, t - 120.75);
        const xa = 760 + u * 90 + rueda * 900, ya = 690 + u * u * 340;
        const xe = 1380 + Math.max(0, t - 121.1) * 260;
        return <>
          <Persona x={xe} y={1050} h={560} t={t} seed={95} ropa={CIVIL(6)} giro={vuelta ? (t > 121.1 ? "perfil" : "espalda") : "34"} flip={!vuelta} camina={t > 121.1 ? 1.4 : 0}
            expr={tacha ? (vuelta ? "enojado" : "sorpresa") : "feliz"} mira={-0.4}
            {...(vuelta ? { bI: 15, cI: 10, bD: 15, cD: 10 } : tacha ? { bI: 120, cI: 150, bD: 120, cD: 150 } : { bI: 60, cI: 140, bD: 60, cD: 140 })}
            reaccion={tacha && !vuelta ? "ojos" : undefined} reaccionT0={119.8} />
          {t < 119.8 && <svg style={{ position: "absolute", left: 1180 - 60, top: 600 - 60, overflow: "visible", transform: `scale(${ent(t, 119.05) * (1 + 0.08 * Math.sin(t * 10))})` }} width={120} height={120} viewBox="-60 -60 120 120"><path d="M 0 44 C -20 22 -58 4 -58 -22 C -58 -50 -18 -56 0 -28 C 18 -56 58 -50 58 -22 C 58 4 20 22 0 44 Z" fill={C.rojo} stroke="#fff" strokeWidth={7} /></svg>}
          {t >= 119.8 && t < 120.6 && <Corazon t={t} t0={119.5} x={1180} y={620} s={0.55} parte={119.8} />}
          <Persona x={560} y={1050} h={600} t={t} seed={1} casco="legion" postura="agachado" giro="34" expr={cae ? "triste" : tacha ? "miedo" : "feliz"} mira={0.6} miraY={-0.2}
            bD={cae ? 20 : 70} cD={cae ? 10 : 10} bI={cae ? 120 : 20} cI={cae ? 130 : 10} agarra={cae ? undefined : <AnilloMano />} agarraAng={-30}
            reaccion={cae ? "derrite" : undefined} reaccionT0={120.9} />
          {cae && xa < 2050 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
              <ellipse cx={xa} cy={1046} rx={26} ry={6} fill="#1d0f33" opacity={0.25 * u} />
              <g transform={`translate(${xa} ${Math.min(ya, 1020) - (rueda > 0 ? Math.abs(Math.sin(rueda * 9)) * 30 * Math.exp(-rueda * 3) : 0)}) rotate(${(t - 120.4) * 520})`}>
                <circle r={24} fill="none" stroke="#f7c548" strokeWidth={10} /><circle cx={0} cy={-28} r={8} fill="#bfe8ff" stroke="#fff" strokeWidth={3} />
              </g>
            </svg>
          )}
        </>;
      })()}
      <div style={{ position: "absolute", left: 960, top: 340, width: 480, height: 250, transform: `translate(-50%,-50%) scale(${ent(t, 118.95) * (1 + (t > 119.75 ? 0.08 * Math.exp(-(t - 119.75) * 8) : 0))}) rotate(-2deg)`, background: "#fff8ec", border: "9px solid #2a1530", borderRadius: 22, boxShadow: "14px 16px 0 rgba(20,8,40,.3)", fontFamily, fontWeight: 700, color: "#2a1530" }}>
        <div style={{ textAlign: "center", fontSize: 42, color: C.violeta, marginTop: 12 }}>CONTRACT</div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 64, color: t > 119.75 ? "#6a5a50" : "#2a1530" }}>WIFE</div>
        {t > 119.75 && <div style={{ position: "absolute", left: 28, top: 134, height: 11, width: 205 * prog(t, 119.75, 119.92), background: C.rojo, borderRadius: 6, transform: "rotate(-4deg)", transformOrigin: "0 50%" }} />}
        <div style={{ position: "absolute", left: 290, top: 92, fontSize: 64, color: t > 119.75 ? C.rojo : "#b9a888", transform: `scale(${t > 119.75 ? ent(t, 119.8) : 1})` }}>{t > 119.75 ? "NO" : "?"}</div>
      </div>
      {t > 121.2 && (
        <svg style={{ position: "absolute", left: 860, top: interpolate(t, [121.2, 121.45], [-560, 560], { extrapolateRight: "clamp" }), overflow: "visible" }} width={200} height={500}>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${i * 40} 500 L ${i * 40} 30 L ${i * 40 + 18} 0 L ${i * 40 + 36} 30 L ${i * 40 + 36} 500 Z`} fill={i % 2 ? "#b07a3e" : "#8a5a2a"} />)}
          <rect x={0} y={180} width={196} height={14} fill="#5a3418" />
        </svg>
      )}
      <Sello t={t} t0={120.4} text="NO MARRIAGE" x={1000} y={700} size={72} rot={-8} />
    </Escena>
    {/* 032 · durante 25 años: sentado en la litera, se derrite */}
    <Escena t={t} t0={122.04} t1={123.7} entra="zoom" golpes={[122.04]}>
      <CarpaInterior t={t} />
      <AbsoluteFill style={{ background: "rgba(120,10,40,.35)" }} />
      <Persona x={1360} y={1040} h={600} t={t} seed={1} casco="legion" postura="sentado" giro="34" flip expr="triste" bD={20} cD={10} bI={20} cI={10} reaccion="derrite" reaccionT0={122.5} />
      <Cuenta t={t} t0={121.8} t1={122.74} de={1} a={25} x={560} y={430} size={360} color="#fff" />
      <Grande t={t} t0={121.9} text="YEARS" x={560} y={760} size={120} color={C.oro} />
    </Escena>

    {/* 033 · si ya tenías esposa, para la ley el matrimonio deja de contar */}
    <Escena t={t} t0={123.7} t1={128.56} zoom={0.05} entra="barrido" golpes={[125.04, 127.58]}>
      <Pueblo t={t} hora="tarde" dx={(t - 123.7) * 10} />
      <Persona x={1260} y={1040} h={580} t={t} seed={95} ropa={CIVIL(6)} giro="34" flip expr={t > 127.58 ? "triste" : "feliz"} mira={-0.5} bD={t > 127.58 ? 120 : 40} cD={t > 127.58 ? 120 : 60} reaccion={t > 127.58 ? "derrite" : undefined} reaccionT0={127.9} />
      <Persona x={660} y={1040} h={610} t={t} seed={1} expr={t > 127.58 ? "triste" : "feliz"} casco="legion" giro="34" mira={0.5} bD={40} cD={60} />
      <Corazon t={t} t0={125.04} x={960} y={420} s={0.8} parte={127.58} />
      {t > 127.58 && <Emote t={t} t0={127.8} tipo="lagrimas" {...L(1260, 1040, 580)} />}
      <Chip t={t} t0={125.04} text="YOUR WIFE" color={C.rosa} tinta={C.noche} x={960} y={210} centro size={62} t1={127.5} />
      <Chip t={t} t0={127.58} text="STOPS COUNTING" color={C.rojo} x={960} y={210} centro size={72} />
    </Escena>

    {/* 034-035 · familias afuera del fuerte: los chicos juegan; para la ley esos hijos no existían y se vuelven fantasmas */}
    <Escena t={t} t0={128.56} t1={135.16} zoom={0.05} entra="corte" golpes={[130.32, 133.84]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={60} seed={53} alto={500} />
      <Astro x={260} y={330} r={70} luna />
      <Colinas capas={["#3a2a6a", "#2a1d5a"]} base={620} seed={54} alto={60} />
      <Fuerte x={1320} y={600} s={0.75} w={1300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 840, bottom: 0, background: "linear-gradient(180deg, #4a3a2a, #2a1a10)" }} />
      <Casa x={200} y={840} s={1.0} tono="#d9b48a" techo="#7a3a2a" luz />
      {(() => {
        const borra = prog(t, 133.84, 134.6);
        const kx = 920 + Math.sin(t * 1.7) * 100;
        return <>
          <Banco x={560} y={1040} w={420} />
          <Persona x={470} y={1040} h={500} t={t} seed={1} casco="legion" postura="sentado" giro="34" expr={t > 133.84 ? "triste" : "feliz"} mira={0.7} bD={t > 133.84 ? 10 : 60} cD={40} reaccion={t > 133.84 ? "derrite" : undefined} reaccionT0={134.0} />
          <Persona x={660} y={1040} h={470} t={t} seed={95} ropa={CIVIL(6)} postura="sentado" giro="34" expr={t > 133.84 ? "triste" : "feliz"} mira={0.7} />
          <Persona x={kx} y={1030} h={250} t={t} seed={97} ropa={CIVIL(2)} expr="feliz" giro="perfil" corre={2} flip={Math.cos(t * 1.7) < 0} sombra={borra > 0.3 ? "#8a7ab8" : undefined} opacity={1 - 0.75 * borra} />
          <Persona x={1140} y={1030} h={230} t={t} seed={98} ropa={CIVIL(4)} expr="feliz" giro="34" flip salta={t < 133.84 ? Math.floor(t / 0.7) * 0.7 : undefined} {...pose("festejar", t, 1.2)} sombra={borra > 0.3 ? "#8a7ab8" : undefined} opacity={1 - 0.75 * borra} />
          {t > 133.84 && <Emote t={t} t0={134.0} tipo="lagrimas" {...L(660, 1040, 470)} />}
        </>;
      })()}
      <Particulas t={t} tipo="luciernagas" n={20} seed={55} />
      <Chip t={t} t0={128.2} text="OUTSIDE THE FORT" color={C.teal} tinta={C.noche} x={110} y={200} size={54} />
      <div style={{ position: "absolute", left: 1200, top: 210, width: 560, height: 290, background: "#fff8ec", border: "9px solid #2a1530", borderRadius: 22, boxShadow: "14px 16px 0 rgba(10,5,30,.45)", fontFamily, fontWeight: 700, color: "#2a1530", transform: `scale(${ent(t, 128.2)}) rotate(-2deg)` }}>
        <div style={{ textAlign: "center", fontSize: 42, color: C.violeta, marginTop: 14 }}>IN ROMAN LAW</div>
        <div style={{ position: "absolute", left: 36, top: 96, fontSize: 48 }}>WIFE: <span style={{ color: C.rojo }}>NONE</span></div>
        <div style={{ position: "absolute", left: 36, top: 176, fontSize: 48 }}>CHILDREN: <span style={{ color: C.rojo, display: "inline-block", transform: `scale(${1 + 0.3 * Math.exp(-Math.max(0, t - 133.84) * 6) * (t > 133.84 ? 1 : 0)})` }}>0</span> <span style={{ fontSize: 30, color: "#8a7a9a" }}>(LEGALLY)</span></div>
      </div>
      <Sello t={t} t0={133.84} text="DID NOT EXIST" x={1460} y={620} size={80} />
    </Escena>
    {/* 036 · ¿y la paga? desde Domiciano...: el emperador sentado en su trono */}
    <Escena t={t} t0={135.16} t1={137.74} entra="corte" banda={C.oro} golpes={[137.26]}>
      <Interior tono="#cdb0e0" piso="#7a5a9a" />
      <div style={{ position: "absolute", left: 1060, top: 480, width: 340, height: 440, background: "linear-gradient(180deg,#f2c548,#c98a1a)", borderRadius: "170px 170px 0 0", border: "10px solid #8a5a1a", opacity: ent(t, 136.4) }} />
      <div style={{ position: "absolute", left: 1010, top: 880, width: 440, height: 46, background: "#b97a1a", border: "8px solid #8a5a1a", borderRadius: 10, opacity: ent(t, 136.4) }} />
      <Persona x={1230} y={1040} h={640} t={t} seed={120} ropa={{ tunica: "#6a2a9a", tunica2: "#4a1a7a", cinto: "#e9a92a", piel: "#f2c09a", piel2: "#d89a72", pelo: "#3a2a1a" }} postura="sentado" giro="34" flip expr="orgullo" aparece={136.6} bD={t > 136.9 ? 110 : 10} cD={20} habla={t > 136.9} />
      <Persona x={520} y={1040} h={620} t={t} seed={1} casco="legion" giro="34" expr={t > 136.6 ? "sorpresa" : "neutro"} mira={0.6} {...pose("contar", t, 1)} reaccion={t > 136.6 ? "ojos" : undefined} reaccionT0={136.65} />
      <Emote t={t} t0={135.2} t1={136.5} tipo="preg" {...L(520, 1040, 620)} s={1.3} />
      <Chip t={t} t0={134.9} text="THE PAY?" color={C.ambar} tinta={C.noche} x={120} y={200} size={64} />
      <Chip t={t} t0={137.26} text="EMPEROR DOMITIAN" color={C.violeta} x={1230} y={240} centro size={58} />
    </Escena>

    {/* 037 · 300 denarios de plata por año: el pagador sentado deja caer las monedas en la bolsa */}
    <Escena t={t} t0={137.74} t1={140.08} entra="corte" golpes={[137.74, 138.72]}>
      <Interior />
      <Mesa x={1190} y={840} w={300} />
      <Persona x={1430} y={1040} h={540} t={t} seed={44} ropa={CIVIL(1)} postura="sentado" giro="34" flip expr="feliz" habla mira={0.2} bD={interpolate(Math.sin(t * 8), [-1, 1], [70, 86])} cD={20} />
      {Array.from({ length: 12 }, (_, i) => {
        const t0 = 137.7 + i * 0.18, u = prog(t, t0, t0 + 0.35);
        if (u <= 0 || u >= 1) return null;
        return <Denario key={i} plata r={30} x={1200 + ((i * 23) % 30) - 15} y={640 + u * 150} t={t} gira={2} />;
      })}
      <Bolsa x={1195} y={790} s={0.7} t={t} txt={`${Math.round(300 * prog(t, 137.7, 140.0))}`} />
      <Persona x={900} y={1040} h={600} t={t} seed={1} casco="legion" giro="34" expr="feliz" mira={0.6} miraY={0.3} bD={60} cD={60} bI={30} cI={30} reaccion="ojos" reaccionT0={138.72} />
      <Cuenta t={t} t0={137.4} t1={140.0} de={0} a={300} x={380} y={340} size={240} color="#fff" />
      <Chip t={t} t0={137.6} text="SILVER DENARII / YEAR" color={C.teal} tinta={C.noche} x={350} y={540} centro size={44} />
    </Escena>
    {/* 038 · suena bien. Después llegan los descuentos: levanta la bolsa y se le vacía */}
    <Escena t={t} t0={140.08} t1={143.78} entra="barrido" golpes={[142.36]}>
      <Campamento t={t} hora={t < 142.36 ? "dia" : "tarde"} />
      {t > 142.36 && <AbsoluteFill style={{ background: "rgba(60,10,40,.4)" }} />}
      {t < 142.36 && <Particulas t={t} tipo="lluviaoro" n={36} seed={56} />}
      <Persona x={900} y={1050} h={690} t={t} seed={1} casco="legion" giro="34" expr={t < 142.36 ? "feliz" : "miedo"}
        bD={t < 142.36 ? 150 + Math.sin(t * 6) * 10 : 60} cD={20} bI={t < 142.36 ? 140 : 40} cI={30} agarra={<EnMano.bolsa txt={t < 142.36 ? "300" : "?"} />} agarraAng={t < 142.36 ? -90 : 80}
        salta={t < 142.36 ? 140.5 : undefined} reaccion={t > 142.36 ? "mandibula" : undefined} reaccionT0={142.36} />
      <Emote t={t} t0={140.3} t1={142.3} tipo="brillos" {...L(900, 1050, 690)} s={1.4} />
      {t > 142.36 && Array.from({ length: 6 }, (_, i) => {
        const k = prog(t, 142.4 + i * 0.08, 143.3 + i * 0.08);
        return <Denario key={i} plata r={46} x={1050 + i * 40 + k * (i % 2 ? 700 : 500)} y={760 - k * 480 + k * k * 300} t={t} rot={k * 400} />;
      })}
      <Chip t={t} t0={139.8} text="SOUNDS DECENT" color={C.lima} tinta={C.noche} x={120} y={200} size={62} t1={142.3} />
      <Chip t={t} t0={142.36} text="THE DEDUCTIONS ARRIVE" color={C.rojo} x={1240} y={220} centro size={66} />
    </Escena>

    {/* 039 · un recibo de sueldo de un fuerte en Egipto: él lo sostiene en la mano */}
    <Escena t={t} t0={143.78} t1={148.9} zoom={0.04} entra="iris" banda={C.ambar} golpes={[143.92, 145.52]}>
      <MapaPuntos t={t} pulsa={["EGYPT"]} t0Pulsa={145.52} vuela={{ n: "EGYPT", z: 1.8, t: [143.9, 145.4] }} />
      <Chip t={t} t0={145.52} text="EGYPT" color={C.ambar} tinta={C.noche} x={1060} y={430} size={70} />
      <Chip t={t} t0={143.6} text="A REAL PAY RECORD" color={C.violeta} x={960} y={200} centro size={62} />
      {t > 146.6 && <Pergamino x={560} y={700} w={420} abre={prog(t, 146.6, 147.4)} lineas={5} titulo="PAY" />}
      <Persona x={1280} y={1040} h={540} t={t} seed={1} casco="legion" giro="34" flip expr={t > 146.6 ? "sorpresa" : "neutro"} mira={-0.8} bD={80} cD={40}
        agarra={<EnMano.tablilla texto="PAY" />} agarraAng={-30} reaccion={t > 146.6 ? "ojos" : undefined} reaccionT0={146.65} />
    </Escena>

    {/* 040-041 · heno, comida, botas, correas, la cena de Saturnales, el club funerario: cada renglón le saca monedas */}
    <Escena t={t} t0={148.9} t1={156.28} zoom={0.04} entra="corte" golpes={[149.74, 150.58, 151.5, 152.02, 153.46, 155.14]}>
      <CarpaInterior t={t} lampara={false} />
      {(() => {
        // los 5 renglones se escriben en los primeros 3 s (uno por beat); la voz después los vuelve a marcar en rojo
        const ded: [number, number][] = [[149.1, 10], [149.45, 80], [149.8, 12], [150.15, 20], [150.5, 4]];
        const voz = [149.74, 150.58, 151.5, 153.46, 155.14];
        const v = 300 - ded.reduce((a, [tt, m]) => a + (t > tt ? m * prog(t, tt, tt + 0.4) : 0), 0);
        const pulso = ded.reduce((a, [g]) => a + (t > g ? Math.exp(-(t - g) * 6) : 0), 0);
        const n = Math.max(1, Math.round(v / 20));
        return <>
          <div style={{ position: "absolute", left: 150, top: 250, width: 760, height: 600, background: "linear-gradient(180deg, #f2dfae, #e2c588)", borderRadius: 16, boxShadow: "14px 16px 0 rgba(20,8,40,.35)", border: "6px solid #b98a4a", fontFamily, fontWeight: 700, transform: `scale(${ent(t, 148.6)}) rotate(-1.5deg)`, transformOrigin: "50% 0%" }}>
            <div style={{ textAlign: "center", fontSize: 48, color: "#7a3d14", marginTop: 20, letterSpacing: 3 }}>PAY SLIP · DEDUCTIONS</div>
            {([["HAY", 149.1, "-10"], ["FOOD", 149.45, "-80"], ["BOOTS & STRAPS", 149.8, "-12"], ["SATURNALIA DINNER", 150.15, "-20"], ["BURIAL CLUB", 150.5, "-4"]] as const).map(([txt, t0, m], i) => {
              const on = t >= t0, a = on ? ent(t, t0) : 0;
              const activo = t >= voz[i] && t < voz[i] + 0.9;
              return (
                <div key={txt} style={{ position: "absolute", left: 46, right: 46, top: 110 + i * 92, height: 76, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 44, borderBottom: "4px dashed rgba(122,61,20,.35)", background: activo ? "rgba(232,52,74,.2)" : "transparent", borderRadius: 10, padding: "0 10px" }}>
                  <span style={{ color: "#4a2a10", display: "inline-block", clipPath: `inset(-20% ${100 - prog(t, t0 - 0.05, t0 + 0.3) * 100}% -20% 0)` }}>{txt}</span>
                  {on && <span style={{ color: C.rojo, transform: `scale(${a})`, display: "inline-block" }}>{m}</span>}
                </div>
              );
            })}
          </div>
          {Array.from({ length: n }, (_, i) => <Denario key={i} plata r={44} x={1020} y={900 - i * 24} />)}
          {ded.map(([tt], i) => {
            const u = prog(t, tt, tt + 0.45);
            if (u <= 0 || u >= 1) return null;
            const y0 = 900 - n * 24, y1 = 398 + i * 92;
            return <Denario key={"v" + i} plata r={40} x={1020 + (860 - 1020) * u} y={y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 160} t={t} gira={3} />;
          })}
          <div style={{ position: "absolute", left: 1090, top: 290, transform: `translate(-50%,-50%) scale(${1 + 0.15 * pulso})`, fontFamily, fontWeight: 700, fontSize: 160, color: v < 200 ? C.rojo : "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill" }}>{Math.round(v)}</div>
          <Persona x={1440} y={1030} h={580} t={t} seed={1} casco="legion" postura="sentado" giro="34" flip mira={0.8} expr={t > 152 ? "triste" : "miedo"} bD={t > 152 ? 120 : 60} cD={t > 152 ? 120 : 70} bI={t > 152 ? 120 : 30} cI={t > 152 ? 120 : 30}
            reaccion={t > 149.5 && t < 152 ? "susto" : t > 153.46 ? "derrite" : undefined} reaccionT0={t > 153.46 ? 153.5 : 149.52} />
          <Emote t={t} t0={150.7} tipo="sudor" {...L(1440, 1030, 580)} />
        </>;
      })()}
    </Escena>

    {/* 042 · sí: pagás por adelantado tu propio funeral. Le da la moneda al enterrador; la lápida ya espera */}
    <Escena t={t} t0={156.28} t1={160.12} zoom={0.04} entra="corte" golpes={[156.4, 159.06]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#3a0f2a", "#2a0a1e"]} base={720} seed={57} alto={50} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "#3a5a2a" }} />
      <Lapida x={1440} y={620} s={1.0} t={t} t0={156.3} lineas={["HERE LIES", "YOU"]} grande="PAID" />
      <Persona x={1000} y={1000} h={560} t={t} seed={150} ropa={{ tunica: "#4a4a5a", tunica2: "#2a2a38", cinto: "#1a1a22", piel: "#e8c0a0", piel2: "#c89a7a", pelo: "#1a1410" }} giro="34" flip expr="feliz" habla
        bD={70} cD={10} bI={40} cI={20} agarraI={<EnMano.pala />} agarraAngI={-80} />
      {(() => {
        const u = prog(t, 158.4, 158.95);
        return <>
          <Persona x={480} y={1010} h={580} t={t} seed={1} casco="legion" giro="34" expr={t < 159.06 ? "triste" : "miedo"} mira={0.8} bD={t > 158.2 ? 75 : 30} cD={t > 158.2 ? 10 : 70} inclina={t > 158.2 ? 6 : -2} reaccion={t > 159.06 ? "susto" : undefined} reaccionT0={159.1} />
          {u > 0 && u < 1 && <Denario plata r={34} x={640 + u * 220} y={700 - Math.sin(u * Math.PI) * 140} t={t} gira={3} />}
          <Emote t={t} t0={157.0} tipo="sudor" {...L(480, 1010, 580)} />
        </>;
      })()}
      <Chip t={t} t0={156.0} text="IN ADVANCE" color={C.ambar} tinta={C.noche} x={120} y={200} size={62} />
      <Chip t={t} t0={159.06} text="YOUR OWN FUNERAL" color={C.rojo} x={1300} y={210} centro size={60} />
    </Escena>
    {/* 043 · Roma, tan considerada, te ahorra el papeleo: el centurión sentado escribe todo por vos */}
    <Escena t={t} t0={160.12} t1={163.26} zoom={0.04} entra="iris" ix={960} iy={420} golpes={[162.22]}>
      <Interior />
      <Aguila x={1160} y={300} s={0.9} />
      <Persona x={360} y={1040} h={600} t={t} seed={60} ropa={CENTURION} casco="centurion" postura="sentado" giro="34" expr="feliz" habla
        bD={interpolate(Math.sin(t * 9), [-1, 1], [48, 58])} cD={70} agarra={<EnMano.pluma />} agarraAng={-60} />
      <Mesa x={720} y={850} w={420} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 540 + (i % 2) * 14, top: 820 - i * 30, width: 340, height: 34, background: i % 2 ? "#f2dfae" : "#e2c588", border: "4px solid #b98a4a", borderRadius: 6, transform: `scale(${ent(t, 160.3 + i * 0.1)}) rotate(${(i % 3 - 1) * 2}deg)` }} />
      ))}
      <Persona x={1320} y={1040} h={600} t={t} seed={1} casco="legion" giro="34" flip expr={t > 162.22 ? "sorpresa" : "neutro"} reaccion={t > 162.22 ? "ojos" : undefined} reaccionT0={162.25} />
      <Sello t={t} t0={162.22} text="DONE FOR YOU" x={800} y={480} size={64} />
      <Chip t={t} t0={159.9} text="HOW CONSIDERATE" color={C.violeta} x={960} y={200} centro size={62} />
      <Trampas t={t} t0={162.5} n={1} y={980} />
    </Escena>
  </>
);
