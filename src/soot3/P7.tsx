import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL, CENTURION } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Colinas, Chip, Grande, MapaPuntos, Particulas, Emote, cabeza, Aguila, Casa, Mesa } from "./kit";
import { Denario, Lapida, Ciudad, Bolsa, Campana, Barco, Soldadito, Lluvia, Gladius } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Valle, Campo, Pueblo, Ruta, Tablero, Estandarte, pose } from "./kit3";

// Parte 7 (792,73-940,55 s): trampa 7, el retiro, el giro final, las ciudades y el cierre.
// v3 (ojo del director): el protagonista (casco dorado, seed 1) HACE lo que se narra en cada plano, todo dentro de
// x 200-1720 y pies en y≈985 (la cámara empuja hasta ~1,09), textos sólo por encima de las cabezas (y < ~420).
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const PIE = 985;
const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

// ── utilería en la mano (unidades de la Persona; `der` endereza el objeto contra el giro del brazo)
const der = (a: number, c: number, s: 1 | -1 = 1) => `rotate(${s * (a + c)})`;
const Baston: React.FC<{ a: number; c: number; largo?: number; s?: 1 | -1 }> = ({ a, c, largo = 170, s = 1 }) => (
  <g transform={der(a, c, s)}><line x1={0} y1={-40} x2={0} y2={largo} stroke="#6b3a1f" strokeWidth={16} strokeLinecap="round" /><path d="M -4 -40 Q 0 -70 30 -64" stroke="#6b3a1f" strokeWidth={16} fill="none" strokeLinecap="round" /></g>
);
const PanMano: React.FC<{ a: number; c: number }> = ({ a, c }) => (
  <g transform={der(a, c)}><ellipse cx={0} cy={-6} rx={40} ry={26} fill="#d98a35" stroke="#a8621f" strokeWidth={5} /><path d="M -20 -18 Q -4 -26 14 -22" stroke="#ffd08a" strokeWidth={6} fill="none" strokeLinecap="round" /></g>
);
const Cuenco: React.FC<{ a: number; c: number; s?: 1 | -1 }> = ({ a, c, s = 1 }) => (
  <g transform={der(a, c, s)}><path d="M -54 -16 Q 0 44 54 -16 Z" fill="#c9c0b0" stroke="#6a5a4a" strokeWidth={6} /></g>
);
const Mazo: React.FC = () => (
  <g><rect x={-8} y={-10} width={16} height={96} rx={6} fill="#6b3a1f" /><rect x={-38} y={74} width={76} height={46} rx={10} fill="#8a6a4a" stroke="#5a3418" strokeWidth={5} /></g>
);
const Cincel: React.FC = () => <g><rect x={-7} y={-6} width={14} height={40} rx={4} fill="#6b3a1f" /><path d="M -6 34 L 6 34 L 3 92 L -3 92 Z" fill="#c8ccd4" stroke="#7d8796" strokeWidth={3} /></g>;
const PlacaMano: React.FC<{ a: number; c: number }> = ({ a, c }) => (
  <g transform={der(a, c)}><rect x={-80} y={-150} width={160} height={118} rx={12} fill="#e2a531" stroke="#8a5414" strokeWidth={8} />{[0, 1, 2].map((i) => <rect key={i} x={-56} y={-126 + i * 30} width={i ? 100 : 112} height={10} rx={5} fill="#8a5414" />)}</g>
);
const Escritura: React.FC<{ a: number; c: number }> = ({ a, c }) => (
  <g transform={der(a, c)}><rect x={-62} y={-110} width={124} height={92} rx={8} fill="#f2e6c8" stroke="#8a6a3a" strokeWidth={6} /><text x={0} y={-56} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#5a3a1a">LAND</text></g>
);
const Pluma: React.FC = () => <g><line x1={0} y1={0} x2={0} y2={70} stroke="#2b2b2b" strokeWidth={6} strokeLinecap="round" /><path d="M 0 0 Q -24 -60 6 -110 Q 20 -50 4 0 Z" fill="#fff6e8" /></g>;

// fondo del tablero + tablero al 85 % centrado (antes la casilla 7 se cortaba por la derecha)
const TCX = 980;
const tx = (x: number) => 960 + 0.85 * (x - TCX);
const TableroC: React.FC<React.ComponentProps<typeof Tablero>> = (p) => (
  <>
    <style>{".tabc7>div{background:none !important}"}</style>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #f6e3b4, #d9b878 70%, #b88a4a)" }} />
    <AbsoluteFill className="tabc7" style={{ transformOrigin: `${TCX}px 600px`, transform: `translate(${960 - TCX}px, -30px) scale(0.85)` }}><Tablero {...p} /></AbsoluteFill>
  </>
);

// golpe de dolor (rayitas rojas que laten) en un punto del cuerpo
const Ay: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => {
  if (t < t0) return null;
  const k = ent(t, t0, 0, { damping: 8, stiffness: 220 }) * (1 + 0.15 * Math.sin((t - t0) * 12));
  return (
    <svg style={{ position: "absolute", left: x - 90 * s, top: y - 90 * s, overflow: "visible", pointerEvents: "none" }} width={180 * s} height={180 * s} viewBox="-90 -90 180 180">
      <g transform={`scale(${k})`} stroke={C.rojo} strokeWidth={10} strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 44} y1={Math.sin(a) * 44} x2={Math.cos(a) * 78} y2={Math.sin(a) * 78} />; })}
      </g>
    </svg>
  );
};
// línea punteada que une un rótulo con una parte del cuerpo
const Flecha: React.FC<{ t: number; t0: number; x1: number; y1: number; x2: number; y2: number; color?: string }> = ({ t, t0, x1, y1, x2, y2, color = "#fff" }) => {
  if (t < t0) return null;
  const k = prog(t, t0, t0 + 0.3);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
      <circle cx={x2} cy={y2} r={14 * ent(t, t0 + 0.25)} fill={color} />
    </svg>
  );
};
const Tachado: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; h?: number }> = ({ t, t0, x, y, w = 600, h = 400 }) => t < t0 ? null : (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible" }} width={w} height={h}>
    <path d={`M 20 20 L ${w - 20} ${h - 20} M ${w - 20} 20 L 20 ${h - 20}`} stroke={C.rojo} strokeWidth={Math.min(w, h) / 8} strokeLinecap="round" strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - prog(t, t0, t0 + 0.25))} />
  </svg>
);
const Marca: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; mal?: boolean }> = ({ t, t0, x, y, s = 1, mal }) => t < t0 ? null : (
  <svg style={{ position: "absolute", left: x - 40 * s, top: y - 40 * s, overflow: "visible" }} width={80 * s} height={80 * s} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56 * ent(t, t0)} fill={mal ? C.rojo : C.lima} />
    <path d={mal ? "M 36 36 L 84 84 M 84 36 L 36 84" : "M 30 62 L 52 84 L 92 40"} stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140 * (1 - prog(t, t0 + 0.08, t0 + 0.3))} />
  </svg>
);
// fogata
const Fogata: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => (
  <>
    <div style={{ position: "absolute", left: x - 420 * s, top: y - 420 * s, width: 840 * s, height: 640 * s, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, rgba(255,170,70,.45), rgba(255,120,40,0) 65%)" }} />
    <svg style={{ position: "absolute", left: x - 120 * s, top: y - 220 * s, overflow: "visible" }} width={240 * s} height={240 * s} viewBox="-120 -220 240 240">
      {[-1, 1].map((d) => <rect key={d} x={-90} y={-14} width={180} height={24} rx={12} fill="#6b3a1f" transform={`rotate(${d * 14})`} />)}
      {[[0, 1, "#ff7a3d"], [-26, 0.7, "#ffb020"], [24, 0.65, "#ffb020"], [0, 0.45, "#fff0a0"]].map(([dx, k, col], i) => {
        const f = 1 + 0.12 * Math.sin(t * (11 + i * 3) + i);
        const hh = 190 * (k as number) * f;
        return <path key={i} d={`M ${(dx as number) - 46 * (k as number)} 0 Q ${(dx as number) - 50 * (k as number)} ${-hh * 0.5} ${(dx as number) + Math.sin(t * 7 + i) * 10} ${-hh} Q ${(dx as number) + 50 * (k as number)} ${-hh * 0.5} ${(dx as number) + 46 * (k as number)} 0 Z`} fill={col as string} />;
      })}
    </svg>
  </>
);
// balanza: la Legión contra "todo lo demás" (con lo que pesa en cada plato)
const Balanza: React.FC<{ t: number; t0: number; inclina: number; x: number }> = ({ t, t0, inclina, x }) => {
  const a = interpolate(prog(t, t0, t0 + 0.9), [0, 1], [0, inclina]) + Math.sin(t * 2.2) * 0.8;
  const dy = Math.sin((a * Math.PI) / 180) * 360;
  return (
    <svg style={{ position: "absolute", left: x - 560, top: 300 }} width={1120} height={700} overflow="visible">
      <path d="M 520 640 L 600 640 L 580 120 L 540 120 Z" fill="#c9a46a" />
      <rect x={400} y={630} width={320} height={40} rx={14} fill="#8a6a3a" />
      <g transform={`rotate(${a} 560 120)`}><rect x={180} y={108} width={760} height={24} rx={12} fill="#e9a92a" /></g>
      <circle cx={560} cy={120} r={26} fill="#fff0a0" />
      <line x1={200} y1={120 - dy} x2={200} y2={300 - dy} stroke="#fff" strokeWidth={6} />
      <line x1={920} y1={120 + dy} x2={920} y2={300 + dy} stroke="#fff" strokeWidth={6} />
      {/* plato izquierdo: lo que cuesta la Legión (pala, vara, lápida) */}
      <g transform={`translate(200 ${300 - dy})`} opacity={t > 909.4 ? 1 : 0}>
        <g transform="translate(-70 -10) rotate(-20)"><rect x={-6} y={-90} width={12} height={90} fill="#6b3a1f" /><path d="M -22 -2 L 22 -2 L 16 40 L -16 40 Z" fill="#8a93a3" /></g>
        <rect x={-14} y={-120} width={14} height={120} rx={6} fill="#7a4a22" transform="rotate(14)" />
        <path d="M 40 0 L 40 -60 Q 40 -90 70 -90 Q 100 -90 100 -60 L 100 0 Z" fill="#b8b0a4" />
      </g>
      {/* plato derecho: hambre, peste, bandidos */}
      <g transform={`translate(920 ${300 + dy})`} opacity={t > 909.85 ? 1 : 0}>
        <path d="M -100 -8 Q -60 30 -20 -8 Z" fill="#c9c0b0" stroke="#6a5a4a" strokeWidth={5} />
        <g transform="translate(16 -46)"><path d="M -30 0 Q -32 -40 0 -40 Q 32 -40 30 0 Q 30 14 18 18 L 18 34 L -18 34 L -18 18 Q -30 14 -30 0 Z" fill="#f2ead8" /><circle cx={-12} cy={-4} r={9} fill="#2a1530" /><circle cx={12} cy={-4} r={9} fill="#2a1530" /></g>
        <g transform="translate(76 -26)"><ellipse cx={0} cy={0} rx={30} ry={18} fill="#5a5a6a" /><circle cx={26} cy={-8} r={12} fill="#5a5a6a" /><path d="M -30 4 Q -60 10 -56 -16" stroke="#5a5a6a" strokeWidth={5} fill="none" /></g>
      </g>
      <path d={`M 80 ${300 - dy} L 320 ${300 - dy} Q 200 ${380 - dy} 80 ${300 - dy} Z`} fill="#e9a92a" />
      <path d={`M 800 ${300 + dy} L 1040 ${300 + dy} Q 920 ${380 + dy} 800 ${300 + dy} Z`} fill="#e9a92a" />
    </svg>
  );
};
// botón de suscribirse con cursor que lo aprieta
const Suscribir: React.FC<{ t: number; t0: number; tClick: number; x: number; y: number }> = ({ t, t0, tClick, x, y }) => {
  if (t < t0) return null;
  const hecho = t > tClick;
  const cx = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [x + 420, x + 120]), cy = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [y + 300, y + 40]);
  const pres = t > tClick && t < tClick + 0.15 ? 0.92 : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x - 300, top: y - 75, width: 600, height: 150, borderRadius: 75, background: hecho ? "#5a5a6a" : "#e62117", color: "#fff", fontFamily, fontWeight: 700, fontSize: 66, textAlign: "center", lineHeight: "150px", transform: `scale(${ent(t, t0) * pres})`, boxShadow: "0 14px 0 rgba(0,0,0,.25)" }}>{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      <svg style={{ position: "absolute", left: cx, top: cy }} width={90} height={120} viewBox="0 0 90 120"><path d="M 6 4 L 6 92 L 28 72 L 44 112 L 60 104 L 44 66 L 76 66 Z" fill="#fff" stroke="#111" strokeWidth={6} strokeLinejoin="round" /></svg>
    </>
  );
};
// cofre de la paga
const Cofre: React.FC<{ x: number; y: number; frente?: boolean; lleno: number }> = ({ x, y, frente, lleno }) => (
  <svg style={{ position: "absolute", left: x - 260, top: y - 220, overflow: "visible" }} width={520} height={260} viewBox="-260 -220 520 260">
    {!frente && <>
      <path d="M -230 -120 L -250 -260 L 250 -260 L 230 -120 Z" fill="#8a5a2a" stroke="#5a3418" strokeWidth={8} />
      <ellipse cx={0} cy={-120 - 70 * lleno} rx={200} ry={30 + 40 * lleno} fill={C.oro} />
      <ellipse cx={-40} cy={-130 - 70 * lleno} rx={60} ry={12} fill="#fff6c8" opacity={0.7} />
    </>}
    {frente && <>
      <rect x={-230} y={-120} width={460} height={150} rx={12} fill="#a8622c" stroke="#5a3418" strokeWidth={8} />
      {[-150, 150].map((xx) => <rect key={xx} x={xx - 16} y={-120} width={32} height={150} fill={C.oro} />)}
      <rect x={-34} y={-90} width={68} height={56} rx={8} fill={C.oro} stroke="#8a5414" strokeWidth={5} />
    </>}
  </svg>
);
// cartel en estaca
const Cartel: React.FC<{ x: number; y: number; txt: string; s?: number; sube?: number }> = ({ x, y, txt, s = 1, sube = 1 }) => (
  <div style={{ position: "absolute", left: x - 100 * s, top: y - 260 * s + 60 * (1 - sube) * s, width: 200 * s, height: 260 * s, transform: `scale(${s > 0 ? 1 : 0})` }}>
    <div style={{ position: "absolute", left: 92 * s, top: 90 * s, width: 16 * s, height: 170 * s, background: "#6b3a1f" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 200 * s, height: 96 * s, borderRadius: 10, background: "#f2e6c8", border: `${6 * s}px solid #6b3a1f`, fontFamily, fontWeight: 700, fontSize: 40 * s, color: "#5a3a1a", textAlign: "center", lineHeight: `${84 * s}px` }}>{txt}</div>
  </div>
);
// medidor horizontal
const Barra: React.FC<{ t: number; t0: number; x: number; y: number; w: number; txt: string; color: string }> = ({ t, t0, x, y, w, txt, color }) => {
  const k = prog(t, t0, t0 + 0.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 70, borderRadius: 35, background: "rgba(27,18,64,.85)", border: "5px solid #fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${8 + 92 * k}%`, background: color }} />
      <div style={{ position: "absolute", left: 24, top: 0, lineHeight: "60px", fontFamily, fontWeight: 700, fontSize: 38, color: "#fff" }}>{txt}</div>
    </div>
  );
};

export const P7: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 190 · trampa siete: el retiro. El soldado mira la última casilla. */}
    <Escena t={t} t0={792.73} t1={795.15} zoom={0.02} entra="corte" golpes={[792.95, 794.09]}>
      <TableroC t={t} t0={792.2} en={6} de={5} tAvanza={792.9} marca={793.8} hecho={5} />
      <Persona x={270} y={PIE} h={440} t={t} seed={1} casco="legion" expr="orgullo" mira={0.8} miraY={-0.4} bD={t > 793.9 ? 125 + Math.sin(t * 4) * 5 : 20} cD={t > 793.9 ? 10 : 30} habla={t > 792.8 && t < 793.9} />
      <Chip t={t} t0={792.95} text="TRAP 7 OF 7" color={C.rojo} x={760} y={120} centro size={60} />
      <Grande t={t} t0={793.99} text="THE RETIREMENT" x={760} y={250} size={100} />
    </Escena>

    {/* 191 · pero digamos que lo lograste: marcha, centurión, fiebre, bosque. Festeja en la casilla 7. */}
    <Escena t={t} t0={795.15} t1={800.45} zoom={0.02} entra="corte" golpes={[796.29, 797.57, 798.29, 799.21, 799.81]}>
      <TableroC t={t} t0={790} en={6} de={6} hecho={t > 799.81 ? 7 : t > 798.29 ? 6 : 5} />
      <Persona x={270} y={PIE} h={440} t={t} seed={1} casco="legion" expr={t > 796.8 ? "feliz" : "orgullo"} mira={0.6}
        {...(t > 799.75 ? pose("festejar", t, 1.2) : t > 797.4 ? pose("contar", t, 1.4) : { bD: 20, cD: 30 })} salta={799.81} />
      <Grande t={t} t0={795.39} text="SAY YOU MADE IT." x={760} y={110} size={96} color="#fff" borde="#2a1530" />
      <Chip t={t} t0={796.83} text="YOU SURVIVED:" color={C.lima} tinta={C.noche} x={130} y={240} size={50} />
      {([[797.57, "THE MARCH"], [798.29, "THE CENTURION"], [799.21, "THE FEVER"], [799.81, "THE FOREST"]] as const).map(([t0, txt], i) => <Chip key={txt} t={t} t0={t0} text={"✓ " + txt} color={C.teal} tinta={C.noche} x={620} y={240} size={50} t1={i < 3 ? [798.29, 799.21, 799.81][i] - 0.32 : undefined} />)}
      {t > 799.9 && <Emote t={t} t0={799.9} tipo="brillos" {...L(270, PIE, 440)} />}
    </Escena>

    {/* 192 · pasaron 25 años, tenés 43: rodillas, espalda, dientes (rengo, con bastón) */}
    <Escena t={t} t0={800.45} t1={807.6} zoom={0.02} entra="corte" golpes={[800.67, 802.43, 804.03, 805.13, 806.57]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      {(() => {
        const inc = 3 + prog(t, 804.6, 805.4) * 7 + Math.max(0, Math.sin(t * 2.4)) * 1.5;
        const a = 22, c = 8;
        return <Persona x={960} y={PIE} h={640} t={t} seed={1} viejo casco="legion" expr={t > 806.4 ? "feliz" : t > 803.5 ? "triste" : "neutro"} inclina={inc} ladea={4}
          bD={a} cD={c} manoD={<Baston a={a} c={c} largo={150} />} bI={t > 804.9 ? 140 : 12} cI={t > 804.9 ? 120 : 10} />;
      })()}
      {t > 806.5 && (() => { const k = lin(t, 806.55, 807.1); return <div style={{ position: "absolute", left: 958, top: 540 + k * 420, width: 18, height: 22, borderRadius: "6px 6px 9px 9px", background: "#fff", border: "3px solid #c9bca0", transform: `rotate(${k * 300}deg)` }} />; })()}
      <Cuenta t={t} t0={800.5} t1={801.4} de={0} a={25} x={500} y={210} size={120} color="#fff" suf=" YEARS" />
      <Cuenta t={t} t0={802.21} t1={802.8} de={18} a={43} x={1420} y={210} size={140} color={C.oro} pre="AGE " />
      <Ay t={t} t0={803.67} x={990} y={880} s={0.8} />
      <Chip t={t} t0={803.67} text="BAD KNEES" color={C.rojo} x={280} y={880} size={50} />
      <Flecha t={t} t0={803.75} x1={600} y1={880} x2={930} y2={880} />
      <Ay t={t} t0={804.91} x={1050} y={700} s={0.8} />
      <Chip t={t} t0={804.91} text="BAD BACK" color={C.rojo} x={1340} y={700} size={50} />
      <Flecha t={t} t0={805.0} x1={1330} y1={700} x2={1090} y2={700} />
      <Chip t={t} t0={806.39} text="TEETH MISSING" color={C.rojo} x={240} y={520} size={50} />
      <Flecha t={t} t0={806.45} x1={700} y1={520} x2={920} y2={545} />
    </Escena>

    {/* 193 · ¿qué te da Roma? El águila le alcanza el sobre: en papel, mucho */}
    <Escena t={t} t0={807.6} t1={810.7} zoom={0.02} entra="corte" golpes={[808.47, 810.17]}>
      <Pueblo t={t} hora="tarde" />
      <Persona x={560} y={PIE} h={600} t={t} seed={1} viejo casco="legion" expr={t > 809.3 ? "feliz" : "sorpresa"} mira={0.7}
        bD={t > 808.6 ? 75 : 20} cD={t > 808.6 ? 20 : 10} bI={18} cI={8} manoI={<Baston a={18} c={8} s={-1} largo={150} />} salta={809.4} />
      <div style={{ position: "absolute", left: 1280, top: 230, width: 400, height: 760, transform: `scale(${ent(t, 807.6)})`, transformOrigin: "200px 760px" }}><Aguila x={200} y={150} s={1.1} /></div>
      {(() => { const k = prog(t, 808.3, 809.3); return <div style={{ position: "absolute", left: interpolate(k, [0, 1], [1400, 760]), top: interpolate(k, [0, 1], [330, 560]) - Math.sin(k * Math.PI) * 120, width: 160, height: 110, background: "#f2e6c8", border: "6px solid #8a6a3a", borderRadius: 8, transform: `rotate(${(1 - k) * 20}deg)` }}><div style={{ position: "absolute", left: 56, top: 32, width: 36, height: 36, borderRadius: 18, background: C.rojo }} /></div>; })()}
      <Grande t={t} t0={807.87} text="WHAT DOES ROME GIVE YOU?" y={120} size={86} color="#fff" borde="#7a3d14" />
      <Grande t={t} t0={809.33} text="ON PAPER... A LOT" x={960} y={250} size={86} color={C.oro} borde="#7a3d14" />
    </Escena>

    {/* 194 · bajo Augusto: 3.000 denarios en efectivo, más de 10 años de paga de golpe */}
    <Escena t={t} t0={810.7} t1={818.6} zoom={0.02} entra="corte" golpes={[811.01, 813.63, 814.99, 816.51, 818.09]}>
      <Interior t={t} tono="#e0c79a" />
      <Cofre x={640} y={960} lleno={prog(t, 813.6, 815.2) * 0.6 + prog(t, 817.9, 818.5) * 0.4} />
      {t > 813.3 && t < 815.9 && <Bolsa x={930} y={600} s={0.55} rot={-130 * prog(t, 813.3, 813.7)} t={t} t0={813.3} />}
      {Array.from({ length: 22 }, (_, i) => { const t0 = 813.6 + i * 0.07; if (t < t0 || t > t0 + 0.65) return null; const k = Math.min(1, (t - t0) / 0.6); const xf = 500 + ((i * 53) % 280); return <Denario key={i} x={interpolate(k, [0, 1], [870, xf])} y={600 - Math.sin(k * Math.PI) * 60 + k * k * 230} r={36} gira={2} t={t} />; })}
      <Cofre x={640} y={960} frente lleno={0} />
      <Persona x={1360} y={PIE} h={600} t={t} seed={1} viejo casco="legion" expr={t > 813.7 ? (t > 816 ? "feliz" : "sorpresa") : "neutro"} mira={-0.7}
        {...(t > 813.7 && t < 816 ? { bD: 70, cD: 20, bI: 70, cI: 20 } : t >= 816 ? pose("festejar", t, 1.1) : { bD: 12, bI: 12 })} salta={813.7} />
      {t > 813.7 && <Emote t={t} t0={813.75} tipo="excl" {...L(1360, PIE, 600)} />}
      <Chip t={t} t0={811.01} text="UNDER AUGUSTUS" color={C.violeta} x={130} y={130} size={54} />
      <Cuenta t={t} t0={813.63} t1={814.4} de={0} a={3000} x={640} y={290} size={170} color={C.oro} />
      <Chip t={t} t0={814.41} t1={815.7} text="DENARII · IN CASH" color={C.ambar} tinta={C.noche} x={640} y={450} centro size={56} />
      <Chip t={t} t0={816.13} t1={817.5} text="MORE THAN 10 YEARS OF PAY" color={C.rojo} x={640} y={450} centro size={50} />
      <Chip t={t} t0={817.81} text="ALL AT ONCE" color={C.lima} tinta={C.noche} x={640} y={450} centro size={56} />
      {t > 815.9 && Array.from({ length: 10 }, (_, i) => { const tA = 815.95 + i * 0.12; if (t < tA) return null; const k = prog(t, 817.85 + i * 0.03, 818.35 + i * 0.03); return <Bolsa key={i} x={interpolate(k, [0, 1], [235 + i * 82, 640])} y={interpolate(k, [0, 1], [600, 760])} s={0.27 * (1 - k * 0.6)} t={t} t0={tA} op={1 - k} txt={String(i + 1)} />; })}
    </Escena>

    {/* 195 · o una parcela en una colonia nueva con otros veteranos: clava su cartel */}
    <Escena t={t} t0={818.6} t1={825.5} zoom={0.02} entra="corte" golpes={[819.47, 820.21, 821.73, 823.93]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#8ac46a", "#5a9a4a"]} base={700} seed={133} alto={60} />
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: "absolute", left: 210 + i * 520, top: 800, width: 460, height: 200, background: i % 2 ? "#c9a04a" : "#9ac45a", border: "6px dashed #fff", borderRadius: 8 }} />)}
      <Casa x={690} y={800} s={0.7} />
      <Casa x={1240} y={800} s={0.7} tono="#f2c89a" />
      <Cartel x={1150} y={PIE - 40} txt="MINE" s={1} sube={0.4 + 0.6 * Math.min(1, (t - 818.6) / 3)} />
      <Persona x={960} y={PIE} h={500} t={t} seed={1} viejo casco="legion" expr="feliz" {...pose("martillar", t, 1.3)} manoD={<Mazo />} />
      <Persona x={420} y={PIE} h={460} t={t} seed={301} viejo ropa={CIVIL(3)} expr="feliz" {...pose("cavar", t, 0.9)} />
      <Persona x={1520} y={PIE} h={460} t={t} seed={302} viejo ropa={CIVIL(4)} expr="feliz" {...pose(t > 820.2 ? "saludar" : "barrer", t, 1)} flip />
      <Chip t={t} t0={818.87} text="OR: A PLOT OF LAND" color={C.violeta} x={130} y={130} size={54} />
      <Chip t={t} t0={820.07} text="IN A NEW COLONY · WITH OTHER VETERANS" color={C.teal} tinta={C.noche} x={130} y={235} size={44} />
      <Grande t={t} t0={823.93} text="LIFE-CHANGING" y={360} size={120} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 196 · el problema es la palabra SI: el veterano frente a un IF enorme */}
    <Escena t={t} t0={825.5} t1={827.5} zoom={0.02} entra="corte" golpes={[826.49, 827.01]}>
      <Campamento t={t} hora="noche" tropa={false} />
      <AbsoluteFill style={{ background: "rgba(18,6,26,.55)" }} />
      <Persona x={1400} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 827.0 ? "miedo" : "neutro"} mira={-0.8} {...(t > 827.0 ? pose("temblar", t) : { bD: 14, bI: 14 })} />
      {t > 827.05 && <Emote t={t} t0={827.05} tipo="susto" {...L(1400, PIE, 560)} />}
      <Chip t={t} t0={825.6} text="THE PROBLEM IS ONE WORD" color={C.violeta} x={700} y={170} centro size={56} />
      <div style={{ position: "absolute", left: 200, width: 1000, top: 300, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 420, lineHeight: 1, color: C.rojo, transform: `scale(${t > 826.95 ? ent(t, 826.95) : 0})`, textShadow: "0 20px 0 #5e0f1d" }}>IF</div>
    </Escena>

    {/* 197 · motín del año 14: la tropa le grita al estrado; 30, incluso 40 años */}
    <Escena t={t} t0={827.5} t1={837.4} zoom={0.02} entra="corte" golpes={[828.65, 830.07, 834.13, 835.01, 836.91]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <div style={{ position: "absolute", left: 1180, top: 700, width: 540, height: 300, background: "#8a5a2a", border: "10px solid #5a3a1a", borderRadius: 6 }} />
      {[0, 1].map((k) => <Persona key={k} x={1320 + k * 240} y={705} h={380} t={t} seed={390 + k} ropa={CENTURION} casco="centurion" expr="miedo" mira={-0.6} flip bD={k ? 20 : 60} cD={k ? 10 : 60} />)}
      {[240, 460, 880, 1070].map((x, i) => <Persona key={i} x={x} y={PIE + 5} h={440} t={t} seed={310 + i} casco="legion" viejo={i % 2 === 0} ropa={CIVIL(i)} expr="enojado" habla={t > 829.7 && t < 832} bD={i % 2 ? 150 + Math.sin(t * 11 + i) * 14 : 30} bI={i % 2 ? 20 : 150 + Math.sin(t * 10 + i) * 14} cD={20} cI={20} />)}
      <Persona x={670} y={PIE + 10} h={500} t={t} seed={1} viejo casco="legion" expr="enojado" habla={t > 828.6} bD={150 + Math.sin(t * 12) * 16} cD={25} bI={20} mira={0.6} miraY={-0.4} />
      {t > 830.0 && t < 832.6 && <Emote t={t} t0={830.1} tipo="enojo" {...L(670, PIE + 10, 500)} s={1.2} />}
      <Chip t={t} t0={827.63} t1={833.3} text="THE MUTINY OF AD 14" color="#2a1530" x={130} y={130} size={54} />
      <Chip t={t} t0={829.0} t1={833.3} text="IN FRONT OF THEIR GENERALS" color={C.rojo} x={130} y={235} size={46} />
      {t > 833.6 && <div style={{ position: "absolute", left: 130, top: 140, width: 780, height: 320, borderRadius: 30, background: "#fff", border: "8px solid #2a1530", transform: `scale(${ent(t, 833.6)})`, transformOrigin: "left top" }}>
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily, fontWeight: 700, fontSize: 48, color: "#2a1530" }}>CONTRACT: 25 YEARS</div>
        {t > 834.77 && <div style={{ position: "absolute", left: 360, top: 52, width: 90 * prog(t, 834.77, 835.0), height: 8, background: C.rojo, transform: "rotate(-8deg)" }} />}
        <div style={{ position: "absolute", left: 40, top: 96, fontFamily, fontWeight: 700, fontSize: 110, color: C.rojo }}>{t < 834.77 ? "" : t < 835.01 ? "30" : "30… 40"}<span style={{ fontSize: 56, color: "#2a1530" }}>{t > 835.0 ? "  YEARS" : ""}</span></div>
        {t > 836.23 && <div style={{ position: "absolute", left: 40, top: 236, fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", background: C.ambar, padding: "0 18px", borderRadius: 12, transform: `scale(${ent(t, 836.23)})`, transformOrigin: "left center" }}>LONG PAST THEIR CONTRACT</div>}
      </div>}
    </Escena>

    {/* 198 · la tierra prometida: Percennius lo dice; el veterano se hunde en el pantano */}
    <Escena t={t} t0={837.4} t1={845.1} zoom={0.02} entra="corte" golpes={[838.61, 840.13, 842.13, 843.83]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5a6a7a,#8a9aa8 55%,#b8c0b8)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d={`M 860 900 L 1250 ${330 - prog(t, 843.6, 844.4) * 40} L 1480 520 L 1700 300 L 2100 760 L 2100 1080 L 860 1080 Z`} fill="#8a7a6a" />
        <path d="M 1250 330 L 1330 470 L 1200 560 Z M 1700 300 L 1760 420 L 1650 470 Z" fill="#a89a8a" />
        <rect x={0} y={860} width={1920} height={220} fill="#6a6a4a" />
        <ellipse cx={540} cy={920} rx={470} ry={110} fill="#3e5a3e" />
        {[0, 1, 2, 3].map((i) => { const k = ((t * 0.7 + i * 0.25) % 1); return <circle key={i} cx={320 + i * 140} cy={910 - k * 30} r={8 + k * 6} fill="none" stroke="#7a9a7a" strokeWidth={4} opacity={1 - k} />; })}
      </svg>
      <Lluvia t={t} n={70} angulo={15} op={0.4} />
      {(() => { const sink = lin(t, 838.0, 845.44) * 170; return (
        <Persona x={540} y={PIE + sink} h={540} t={t} seed={1} viejo casco="legion" expr={t > 841.5 ? "miedo" : "triste"} mira={0.5} miraY={-0.3}
          bD={t > 842 ? 150 + Math.sin(t * 9) * 12 : 40} cD={t > 842 ? 20 : 70} manoD={t > 842 ? undefined : <Escritura a={40} c={70} />} bI={t > 842 ? 150 + Math.sin(t * 9 + 1) * 12 : 14} cI={20} />
      ); })()}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}><ellipse cx={540} cy={1000} rx={440} ry={90} fill="#3e5a3e" /><ellipse cx={420} cy={975} rx={160} ry={22} fill="#5a7a5a" /></svg>
      <Persona x={1340} y={PIE} h={540} t={t} seed={395} casco="legion" ropa={CIVIL(2)} expr="enojado" habla={t > 840.0} bD={95} cD={0} flip mira={-0.8} />
      <Chip t={t} t0={837.6} text="THE LAND THEY WERE PROMISED" color="#2a1530" x={120} y={130} size={44} />
      {t > 839.5 && <div style={{ position: "absolute", left: 990, top: 110, width: 720, height: 260, borderRadius: 40, background: "#fff", border: "8px solid #2a1530", transform: `scale(${ent(t, 839.5)})`, transformOrigin: "350px 300px" }}>
        <svg style={{ position: "absolute", left: 300, top: 250, overflow: "visible" }} width={60} height={60}><path d="M 0 0 L 60 0 L 40 70 Z" fill="#fff" stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" /><rect x={4} y={-8} width={52} height={12} fill="#fff" /></svg>
        <div style={{ position: "absolute", left: 30, top: 14, fontFamily, fontWeight: 700, fontSize: 36, color: C.rojo }}>PERCENNIUS, SOLDIER:</div>
        <div style={{ position: "absolute", left: 30, top: 70, fontFamily, fontWeight: 700, fontSize: 64, color: "#2a1530" }}>{t > 842.13 ? "“SWAMPY BOGS...”" : ".".repeat(1 + (Math.floor(t * 4) % 3))}</div>
        <div style={{ position: "absolute", left: 30, top: 154, fontFamily, fontWeight: 700, fontSize: 56, color: "#2a1530", transform: `scale(${t > 843.83 ? ent(t, 843.83) : 0})`, transformOrigin: "left center" }}>“...BARE MOUNTAINSIDES”</div>
      </div>}
    </Escena>

    {/* 199 · algunos tuvieron suerte: baja honrosa, se casaron, hijos legales por fin */}
    <Escena t={t} t0={845.1} t1={857.1} zoom={0.02} entra="corte" golpes={[846.43, 848.31, 850.87, 852.29, 856.53]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#c9774a", "#9a4a3a"]} base={800} seed={134} alto={40} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "linear-gradient(180deg,#9a5a3a,#6a3a2a)" }} />
      <Casa x={1480} y={905} s={1.3} luz />
      <Particulas t={t} tipo="luciernagas" n={16} seed={135} />
      {(() => {
        const x = t < 850.5 ? interpolate(lin(t, 845.1, 846.4), [0, 1], [520, 620]) : interpolate(lin(t, 850.5, 851.6), [0, 1], [620, 900]);
        const anda = (t < 846.4) || (t > 850.5 && t < 851.6);
        const conPlaca = t > 847.17 && t < 850.5;
        return <Persona x={x} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 847.1 ? "feliz" : "neutro"} mira={t > 851.6 ? 0.7 : 0.3} camina={anda ? 1.3 : 0}
          bD={conPlaca ? 150 : t > 852.2 ? 60 : 10} cD={conPlaca ? 15 : 20} manoD={conPlaca ? <PlacaMano a={150} c={15} /> : undefined} />;
      })()}
      {t > 847.25 && t < 850.5 && <Emote t={t} t0={847.3} tipo="brillos" {...L(620, PIE, 560)} s={1.2} />}
      {t > 849.2 && t < 850.8 && <div style={{ position: "absolute", left: 960, top: 190, width: 520, height: 300, borderRadius: 22, background: "#e2a531", border: "12px solid #8a5414", boxShadow: "0 14px 0 rgba(40,20,10,.35)", transform: `scale(${ent(t, 849.2) * (t > 850.4 ? Math.max(0, 1 - (t - 850.4) * 3) : 1)}) rotate(-2deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 62, color: "#5a3008" }}>HONESTA MISSIO</div>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60, top: 130 + i * 44, width: i === 2 ? 260 : 380, height: 14, borderRadius: 7, background: "#8a5414" }} />)}
        {[[16, 16], [470, 16], [16, 250], [470, 250]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: a, top: b, width: 18, height: 18, borderRadius: 9, background: "#8a5414" }} />)}
      </div>}
      {t > 851.5 && <Persona x={interpolate(lin(t, 851.6, 852.6), [0, 1], [1480, 1100])} y={PIE} h={530} t={t} seed={320} ropa={CIVIL(2)} expr="feliz" mira={-0.6} camina={t < 852.6 ? 1.3 : 0} bI={t > 852.6 ? 50 : 10} flip />}
      {t > 852.6 && <Emote t={t} t0={852.7} tipo="brillos" x={1000} y={520} s={1.2} />}
      {t > 853.0 && [0, 1].map((i) => { const k = lin(t, 855.25 + i * 0.15, 856.1 + i * 0.15); const gris = t < 856.3; return <div key={i} style={{ position: "absolute", inset: 0, filter: gris ? "grayscale(1) brightness(.85)" : undefined }}><Persona x={interpolate(k, [0, 1], [1480, 1300 + i * 150])} y={PIE} h={320} t={t} seed={330 + i} ropa={CIVIL(5 + i)} expr={gris ? "triste" : "feliz"} camina={k > 0 && k < 1 ? 1.6 : 0} opacity={t < 855.2 ? 0.6 : 1} salta={856.3 + i * 0.1} /></div>; })}
      {t > 856.3 && <Emote t={t} t0={856.35} tipo="brillos" x={1380} y={700} s={1.1} />}
      <Chip t={t} t0={845.35} t1={850.2} text="SOME GOT LUCKY" color={C.lima} tinta={C.noche} x={130} y={130} size={54} />
      <Chip t={t} t0={847.73} t1={850.2} text="HONORABLE DISCHARGE" color={C.violeta} x={130} y={235} size={50} />
      <Chip t={t} t0={850.51} text="SETTLED DOWN" color={C.violeta} x={130} y={130} size={54} />
      <Chip t={t} t0={851.61} text="FINALLY MARRIED" color={C.rojo} x={130} y={235} size={50} />
      <Chip t={t} t0={855.29} text="KIDS MADE LEGAL. AT LAST." color={C.lima} tinta={C.noche} x={130} y={340} size={46} />
    </Escena>

    {/* 200 · sus lápidas sobreviven: orgulloso no de las batallas, sino de los años */}
    <Escena t={t} t0={857.1} t1={866.3} zoom={0.02} entra="corte" golpes={[858.45, 859.93, 863.97, 865.71]}>
      <Ruta t={t} hora="tarde" avance={(t - 857.1) * 50} />
      <Particulas t={t} tipo="polvo" n={24} seed={136} />
      {[[1590, 790, 0.5], [1420, 760, 0.38]].map(([x, y, s], i) => <Lapida key={i} x={x} y={y} s={s} t={t} lineas={["D · M", "VET"]} />)}
      <Lapida x={1080} y={570} s={1.4} lineas={["D · M", "LVCIVS", "MIL · LEG · XX"]} grande={t > 865.6 ? "XXV" : ""} />
      <Persona x={430} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 864.8 ? "orgullo" : "feliz"} mira={0.8} bD={85 + Math.sin(t * 3) * 4} cD={5} inclina={t > 864.8 ? -4 : 0} />
      {t > 865.6 && <Emote t={t} t0={865.65} tipo="brillos" x={1080} y={600} s={1.5} />}
      <Chip t={t} t0={857.43} t1={863.4} text="TOMBSTONES STILL SURVIVE" color={C.violeta} x={130} y={130} size={50} />
      <Chip t={t} t0={859.39} t1={863.4} text="ALL OVER THE EMPIRE" color={C.teal} tinta={C.noche} x={130} y={235} size={50} />
      <Chip t={t} t0={863.67} text="NOT THE BATTLES" color={C.rojo} x={130} y={130} size={50} />
      {t > 863.7 && <><Gladius x={720} y={130} s={0.32} t={t} t0={863.7} rot={90} /><Tachado t={t} t0={863.95} x={720} y={130} w={170} h={110} /></>}
      <Chip t={t} t0={864.81} text="THE YEARS THEY SERVED" color={C.lima} tinta={C.noche} x={130} y={235} size={50} />
    </Escena>

    {/* 201 · 25. 26. A veces más. Lo talla en piedra como un marcador */}
    <Escena t={t} t0={866.3} t1={871.95} zoom={0.02} entra="corte" golpes={[866.57, 867.55, 868.83, 871.53]}>
      <Interior t={t} tono="#d8c8a8" ventana={false} />
      <div style={{ position: "absolute", left: 250, top: 300, width: 800, height: 600, borderRadius: "40px 40px 0 0", background: "#b8a888", border: "12px solid #7a6a4a" }} />
      <div style={{ position: "absolute", left: 250, width: 800, top: 330, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 270, color: "#5a4a3a", textShadow: "6px 6px 0 #f2ead8, -4px -4px 0 #3a2a1a", transform: `scale(${ent(t, t < 867.55 ? 866.5 : t < 868.47 ? 867.55 : 868.47)})` }}>{t < 867.55 ? "25" : t < 868.47 ? "26" : "26+"}</div>
      <svg style={{ position: "absolute", left: 290, top: 700 }} width={740} height={150}>
        {Array.from({ length: 28 }, (_, i) => {
          const g = Math.floor(i / 5), j = i % 5;
          const tm = i < 25 ? 866.3 + i * 0.045 : i === 25 ? 867.55 : 868.5 + (i - 26) * 0.4;
          if (t < tm) return null;
          const k = prog(t, tm, tm + 0.12);
          const x0 = 20 + g * 125 + j * 22;
          return j === 4 && i < 25 ? <line key={i} x1={x0 - 96} y1={95} x2={x0 + 6 - 96 + 100 * k} y2={95 - 70 * k} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />
            : <line key={i} x1={i >= 25 ? 20 + 5 * 125 + (i - 25) * 22 : x0} y1={30} x2={i >= 25 ? 20 + 5 * 125 + (i - 25) * 22 : x0} y2={30 + 90 * k} stroke={i >= 25 ? C.rojo : "#4a3a2a"} strokeWidth={10} strokeLinecap="round" />;
        })}
      </svg>
      {(() => { const s = Math.sin(t * 1.4 * Math.PI * 2); const golpe = s > 0.92; return <>
        <Persona x={1290} y={PIE} h={600} t={t} seed={1} viejo casco="legion" expr="orgullo" flip mira={0.8} bD={80} cD={8} manoD={<Cincel />} bI={115 + s * 40} cI={50 + s * 20} manoI={<Mazo />} inclina={4} />
        {golpe && <svg style={{ position: "absolute", left: 905, top: 650, overflow: "visible" }} width={60} height={60}>{Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + t; return <line key={i} x1={30} y1={30} x2={30 + Math.cos(a) * 50} y2={30 + Math.sin(a) * 50} stroke="#ffcf5a" strokeWidth={6} strokeLinecap="round" />; })}</svg>}
      </>; })()}
      <Particulas t={t} tipo="destellos" n={10} seed={141} />
      <Chip t={t} t0={868.47} t1={869.5} text="SOMETIMES MORE" color={C.rojo} x={130} y={130} size={54} />
      <Chip t={t} t0={869.79} text="CARVED INTO STONE" color={C.violeta} x={130} y={130} size={54} />
      <Grande t={t} t0={871.21} text="LIKE A SCORE" x={1250} y={225} size={90} color={C.oro} borde="#3a2a1a" />
    </Escena>

    {/* 202 · el pago sólo llega a los que siguen en pie */}
    <Escena t={t} t0={871.95} t1={875.8} zoom={0.02} entra="corte" golpes={[873.29, 875.05]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Mesa x={1450} y={790} w={420} />
      <Bolsa x={1450} y={700} s={0.8} t={t} t0={872.0} txt="PAYOUT" />
      {Array.from({ length: 7 }, (_, i) => <Soldadito key={i} x={230 + i * 105} y={PIE - 5} s={1.25} t={t} seed={340 + i} cae={i % 2 ? 874.2 + i * 0.08 : undefined} />)}
      <Persona x={1130} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 874.3 ? "triste" : "feliz"} mira={t > 874.3 ? -0.8 : 0.6} bD={t > 874.3 ? 20 : 70} cD={10} />
      <Chip t={t} t0={872.11} text="AND REMEMBER" color={C.violeta} x={130} y={130} size={54} />
      <Chip t={t} t0={874.27} text="ONLY THE ONES STILL STANDING" color={C.rojo} x={130} y={235} size={48} />
    </Escena>

    {/* 203 · enfermedad, accidentes y guerra: cerca de la mitad nunca llegó al año 25 */}
    <Escena t={t} t0={875.8} t1={884.3} zoom={0.02} entra="corte" golpes={[876.17, 877.23, 877.83, 879.89, 883.69]}>
      <Valle t={t} hora="tarde" />
      {([[876.17, "DISEASE", C.lima], [877.23, "ACCIDENTS", C.ambar], [877.83, "WAR", C.rojo]] as const).map(([t0, txt, col], i) => <Chip key={txt} t={t} t0={t0} text={txt} color={col} tinta={col === C.rojo ? undefined : C.noche} x={[150, 600, 1110][i]} y={130} size={56} />)}
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 10, r = Math.floor(i / 10), muere = [1, 3, 6, 8, 10, 12, 15, 17, 18, 19].includes(i) && i !== 14;
        const causa = i % 3; // 0 enfermedad · 1 accidente · 2 guerra
        const tm = 878.0 + ((i * 7) % 20) * 0.27;
        const cae = muere ? prog(t, tm, tm + 0.45) : 0;
        const col = [C.lima, C.ambar, C.rojo][causa];
        const prota = i === 14;
        return <div key={i} style={{ position: "absolute", left: 200 + c * 155, top: 410 + r * 290, width: 120, height: 260, transform: `rotate(${cae * (i % 4 === 1 ? 85 : -85)}deg) scale(${1 - cae * 0.45})`, transformOrigin: "60px 250px", filter: cae > 0.5 ? "grayscale(1)" : undefined, opacity: 1 - cae * 0.35 }}>
          <Persona x={60} y={250} h={prota ? 260 : 240} t={t} seed={prota ? 1 : 350 + i} casco="legion" expr={muere && t > tm ? "triste" : prota && t > 880 ? "miedo" : "neutro"} mira={prota ? Math.sin(t * 2) : 0} />
          {muere && t > tm - 0.3 && cae < 0.9 && <div style={{ position: "absolute", left: 40, top: -30, width: 40, height: 40, borderRadius: 20, background: col, border: "4px solid #fff", transform: `scale(${ent(t, tm - 0.3)})` }} />}
        </div>;
      })}
      <Grande t={t} t0={879.65} text="ROUGHLY HALF  ½" y={330} size={96} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={881.77} text="NEVER REACHED YEAR 25" color={C.rojo} x={960} y={230} centro size={46} />
    </Escena>

    {/* 204 · ¿era una trampa mortal? Junto al fuego, piensa… y el giro */}
    <Escena t={t} t0={884.3} t1={888.3} zoom={0.02} entra="corte" golpes={[886.55, 887.55]}>
      <Campamento t={t} hora="noche" tropa={false} />
      <AbsoluteFill style={{ background: "rgba(18,6,26,.45)" }} />
      <Fogata t={t} x={720} y={PIE - 10} s={1.1} />
      <Persona x={1120} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 887.09 ? "sorpresa" : "neutro"} mira={t > 887.09 ? 0 : -0.6} miraY={0.3}
        {...(t > 887.09 ? { bD: 150, cD: 10, bI: 20 } : { bD: 35, cD: 150, bI: 12 })} salta={887.1} />
      <Emote t={t} t0={884.8} t1={887.05} tipo="preg" {...L(1120, PIE, 560)} />
      <Emote t={t} t0={887.1} tipo="excl" {...L(1120, PIE, 560)} />
      <Grande t={t} t0={884.49} text="SO... A DEATH TRAP?" y={130} size={96} color="#fff" />
      <Grande t={t} t0={887.09} text="HERE IS THE TWIST" y={270} size={100} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 205 · cientos de miles se anotaron igual, por voluntad: afuera era peor y más pobre */}
    <Escena t={t} t0={888.3} t1={896.8} zoom={0.02} entra="corte" golpes={[888.99, 890.67, 891.69, 894.87, 896.31]}>
      {t < 891.6 ? <>
        <Campo t={t} seco />
        {[0, 1].map((i) => <Casa key={i} x={330 + i * 1250} y={690} s={0.5} tono="#a89a8a" techo="#6a5a4a" />)}
        <Estandarte x={1560} y={900} s={0.9} t={t} />
        <Mesa x={1290} y={810} w={360} />
        <div style={{ position: "absolute", left: 1200, top: 770, width: 170, height: 40, borderRadius: 8, background: "#f2e6c8", border: "5px solid #8a6a3a" }} />
        {Array.from({ length: 4 }, (_, i) => <Persona key={i} x={200 + i * 175 + (t - 888.3) * 22} y={PIE - (i % 2) * 6} h={430 + (i % 2) * 30} t={t} seed={410 + i} ropa={CIVIL(i + 1)} expr={i % 2 ? "neutro" : "feliz"} camina={0.9} mira={0.6} />)}
        <Persona x={1050} y={PIE} h={520} t={t} seed={1} casco="legion" expr="feliz" {...pose("escribir", t, 1.2)} manoD={<Pluma />} />
        <Chip t={t} t0={888.53} text="HUNDREDS OF THOUSANDS" color={C.violeta} x={130} y={130} size={52} />
        {t > 888.6 && <div style={{ position: "absolute", left: 130, top: 200, fontFamily, fontWeight: 700, fontSize: 100, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, 888.6)})`, transformOrigin: "left top" }}>{Math.round(300000 * prog(t, 888.6, 890.3)).toLocaleString("en-US")}</div>}
        <div style={{ position: "absolute", left: 900, top: 250, transform: `rotate(-6deg) scale(${t > 890.39 ? 1 + 1.5 * (1 - prog(t, 890.39, 890.6)) : 0})`, padding: "8px 28px", border: `10px solid ${C.rojo}`, borderRadius: 16, fontFamily, fontWeight: 700, fontSize: 58, color: C.rojo, background: "rgba(255,255,255,.88)", whiteSpace: "nowrap" }}>SIGNED UP. WILLINGLY.</div>
      </> : <>
        <Campo t={t} seco />
        <AbsoluteFill style={{ background: "rgba(120,80,40,.25)" }} />
        <Casa x={640} y={860} s={0.95} tono="#a89a8a" techo="#6a5a4a" />
        <Persona x={330} y={PIE} h={480} t={t} seed={361} sombra="#2a1530" {...pose("lanzar", t, 0.8)} />
        <Persona x={930} y={PIE} h={500} t={t} seed={360} ropa={CIVIL(1)} expr="triste" bD={60} cD={50} manoD={<Cuenco a={60} c={50} />} ladea={6} />
        <Emote t={t} t0={893.9} tipo="lagrimas" {...L(930, PIE, 500)} />
        <Persona x={1450} y={PIE} h={540} t={t} seed={1} casco="legion" expr="triste" mira={-0.8} bD={12} bI={12} />
        <Chip t={t} t0={891.97} text="OUTSIDE THE LEGION:" color="#2a1530" x={130} y={130} size={52} />
        <Chip t={t} t0={894.45} text="MORE DANGEROUS" color={C.rojo} x={130} y={235} size={50} />
        <Chip t={t} t0={895.81} text="MUCH POORER" color={C.ambar} tinta={C.noche} x={130} y={340} size={50} />
        <Barra t={t} t0={894.45} x={1080} y={150} w={600} txt="DANGER" color={C.rojo} />
        <Barra t={t} t0={895.81} x={1080} y={250} w={600} txt="POVERTY" color={C.ambar} />
      </>}
    </Escena>

    {/* 206 · el ejército te daba de comer, médico, baños, sueldo y una chance real */}
    <Escena t={t} t0={896.8} t1={907.1} zoom={0.02} entra="corte" golpes={[897.27, 899.97, 900.91, 901.65, 903.83, 905.81]}>
      <Campamento t={t} />
      <Persona x={400} y={PIE} h={540} t={t} seed={360} ropa={CIVIL(1)} expr="triste" bD={55} cD={55} manoD={<Cuenco a={55} c={55} />} mira={0.7} />
      <Persona x={1480} y={PIE} h={560} t={t} seed={1} casco="legion" expr="feliz" flip {...pose("comer", t, 0.9)} manoD={<PanMano a={90} c={120} />} />
      {t < 902.7 && <div style={{ position: "absolute", left: 600, top: 90, width: 720, height: 380, borderRadius: 28, background: "#fff8ec", border: `10px solid ${C.violeta}`, boxShadow: "0 12px 0 rgba(20,10,50,.3)", transform: `scale(${ent(t, 896.9) * (t > 902.4 ? Math.max(0, 1 - (t - 902.4) * 3.5) : 1)})` }}>
        <div style={{ position: "absolute", left: 30, top: 14, width: 180, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 34, color: "#5a5a6a" }}>OUTSIDE</div>
        <div style={{ position: "absolute", right: 30, top: 14, width: 180, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 34, color: C.rojo }}>LEGION</div>
        {(["DAILY FOOD", "A DOCTOR", "A BATH", "A SALARY"] as const).map((txt, i) => {
          const t0 = [897.0, 899.6, 900.6, 901.4][i];
          if (t < t0) return null;
          return <React.Fragment key={txt}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70 + i * 72, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, color: "#2a1530", opacity: prog(t, t0, t0 + 0.15) }}>{txt}</div>
          </React.Fragment>;
        })}
      </div>}
      {t < 902.7 && t > 896.9 && ([897.0, 899.6, 900.6, 901.4] as const).map((t0, i) => <React.Fragment key={i}><Marca t={t} t0={t0 + 0.1} x={720} y={190 + i * 72} s={0.75} mal /><Marca t={t} t0={t0 + 0.2} x={1200} y={190 + i * 72} s={0.75} /></React.Fragment>)}
      <Grande t={t} t0={902.65} text="AND A REAL CHANCE" y={190} size={80} color="#fff" borde="#7a3d14" />
      <Chip t={t} t0={904.69} text="AT LAND & MONEY" color={C.violeta} x={960} y={310} centro size={50} />
      <Chip t={t} t0={905.39} text="YOUR FATHER NEVER HAD" color={C.rojo} x={960} y={405} centro size={46} />
    </Escena>

    {/* 207 · la Legión era un pésimo trato; sólo que mejor que todo lo demás */}
    <Escena t={t} t0={907.1} t1={911.7} zoom={0.02} entra="corte" golpes={[908.63, 909.97, 910.71]}>
      <Interior t={t} />
      <Balanza t={t} t0={909.5} inclina={14} x={1080} />
      <Persona x={330} y={PIE} h={560} t={t} seed={1} viejo casco="legion" expr={t > 909.4 ? "orgullo" : "triste"} mira={0.8} bD={t > 909.4 ? 80 : 20} cD={10} />
      <Chip t={t} t0={909.45} text="THE LEGION" color={C.rojo} x={760} y={820} centro size={44} />
      <Chip t={t} t0={909.7} text="EVERYTHING ELSE" color="#5a5a6a" x={1440} y={880} centro size={44} />
      <Grande t={t} t0={907.27} text="A TERRIBLE DEAL." y={100} size={84} color="#fff" borde={C.rojo} />
      <Grande t={t} t0={909.39} text="JUST A BETTER ONE" y={235} size={78} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 208 · al retirarse, muchos se quedaron en los pueblos que crecieron junto a los fuertes */}
    <Escena t={t} t0={911.7} t1={919.6} zoom={0.02} entra="corte" golpes={[913.43, 914.59, 916.87, 918.97]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#c9774a", "#9a4a3a"]} base={820} seed={139} alto={40} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "linear-gradient(180deg,#9a5a3a,#6a3a2a)" }} />
      <div style={{ position: "absolute", left: 760, top: 560, width: 400, height: 260, background: "#a89070", border: "10px solid #6a5a3a" }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 10 + i * 78, top: -40, width: 50, height: 40, background: "#a89070", border: "8px solid #6a5a3a", borderBottom: "none" }} />)}
        <div style={{ position: "absolute", left: 150, top: 120, width: 100, height: 130, borderRadius: "50px 50px 0 0", background: "#4a3a2a" }} />
      </div>
      {([[560, 860], [1360, 860], [420, 830], [1500, 830], [660, 780], [1260, 780], [280, 860], [1640, 860]] as const).map(([x, y], i) => { const t0 = 914.6 + i * 0.35; return t > t0 && <div key={i} style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, t0)})`, transformOrigin: `${x}px ${y}px` }}><Casa x={x} y={y} s={0.55} luz={t > 917.7} tono={["#f0c08a", "#e8b07a", "#f2c89a"][i % 3]} /></div>; })}
      <Persona x={interpolate(lin(t, 911.7, 914.4), [0, 1], [420, 960])} y={PIE} h={480} t={t} seed={1} viejo casco="legion" expr="feliz" camina={t < 914.4 ? 1.3 : 0} mira={t < 914.4 ? 0.6 : 0}
        {...(t > 917.7 ? pose("saludar", t, 0.9) : {})} />
      <Chip t={t} t0={913.01} text="FINALLY RETIRED" color={C.lima} tinta={C.noche} x={130} y={130} size={54} />
      <Chip t={t} t0={914.59} text="TOWNS GREW AROUND THE OLD FORTS" color={C.violeta} x={130} y={235} size={46} />
      <Grande t={t} t0={917.77} text="SOME ARE STILL THERE" y={370} size={100} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 209 · Colonia, York, Viena: fuertes que se volvieron ciudades; el veterano se sienta: «basta» */}
    <Escena t={t} t0={919.6} t1={928.6} zoom={0.02} entra="corte" golpes={[919.85, 920.67, 921.31, 924.37, 927.85]}>
      {t < 923.2 ? <>
        <MapaPuntos t={t} pulsa={["COLOGNE", "YORK", "VIENNA"]} t0Pulsa={919.85} />
        <AbsoluteFill style={{ background: "rgba(27,18,64,.35)" }} />
        {(["COLOGNE", "YORK", "VIENNA"] as const).map((n, i) => {
          const t0 = [919.45, 920.45, 921.1][i];
          if (t < t0) return null;
          const k = prog(t, t0 + 0.2, t0 + 0.75);
          return <div key={n} style={{ position: "absolute", left: 300 + i * 460, top: 200, width: 400, height: 400, borderRadius: 28, background: "#fff8ec", border: `10px solid ${[C.rojo, C.violeta, C.teal][i]}`, boxShadow: "0 12px 0 rgba(10,5,30,.4)", transform: `scale(${ent(t, t0)})`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 230, height: 70, background: "#8ab866" }} />
            <div style={{ position: "absolute", left: 110, top: 150, width: 160, height: 90, background: "#a8783a", border: "6px solid #6a4a2a", transform: `scale(${1 - k})`, transformOrigin: "80px 90px" }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: 4 + j * 40, top: -26, width: 24, height: 22, background: "#a8783a", border: "5px solid #6a4a2a", borderBottom: "none" }} />)}</div>
            <div style={{ position: "absolute", left: -100, top: -40, width: 600, height: 460, transform: `scale(${k * 0.55})`, transformOrigin: "300px 280px" }}><Ciudad x={300} y={50} s={1} seed={7 + i} luz /></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 316, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 48, color: "#2a1530" }}>{n}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: "#5a5a6a" }}>{k < 0.5 ? "FORT" : "TODAY: CITY"}</div>
          </div>;
        })}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={240} y1={PIE} x2={1600} y2={PIE} stroke="#f7c548" strokeWidth={8} strokeDasharray="20 18" strokeDashoffset={-t * 40} /></svg>
        <Persona x={interpolate(lin(t, 919.6, 923.3), [0, 1], [320, 1450])} y={PIE - 6} h={300} t={t} seed={1} viejo casco="legion" expr="feliz" camina={1.5} mira={0.6} />
      </> : <>
        <Cielo tipo="noche" />
        <Ciudad x={960} y={660} s={1.4} nombre="" seed={7} luz />
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "linear-gradient(180deg,#5a4a7a,#3a2a5a)" }} />
        {(() => { const seat = 880 - 6; const h = 480, S = h / 560; return <>
          <div style={{ position: "absolute", left: 740, top: seat - 70, width: 440, height: 24, borderRadius: 8, background: "#8a5a2a" }} />
          <Persona x={960} y={seat + 190 * S - 20} h={h} t={t} seed={1} viejo casco="legion" expr={t > 926.8 ? "orgullo" : "feliz"} ladea={-3} bD={t > 926.8 ? 120 : 20} cD={t > 926.8 ? 40 : 30} bI={20} cI={30} inclina={t > 926.8 ? -3 : 0} />
          <div style={{ position: "absolute", left: 760, top: seat - 30, width: 400, height: 30, borderRadius: 6, background: "#a8783a", border: "5px solid #6a4a2a" }} />
          {[780, 1120].map((x) => <div key={x} style={{ position: "absolute", left: x, top: seat, width: 20, height: 100, background: "#6a4a2a" }} />)}
          {[-1, 1].map((d) => <React.Fragment key={d}><div style={{ position: "absolute", left: 960 + d * 34 - 13, top: seat, width: 26, height: 98, borderRadius: 13, background: "#d98d66" }} /><div style={{ position: "absolute", left: 960 + d * 34 - 24, top: seat + 90, width: 48, height: 18, borderRadius: "14px 14px 4px 4px", background: "#6b3a1f" }} /></React.Fragment>)}
          {t > 925.4 && <Emote t={t} t0={925.45} tipo="sudor" {...L(960, seat + 190 * S - 20, h)} />}
          {t > 925.4 && <Ay t={t} t0={925.45} x={1000} y={seat + 40} s={0.6} />}
        </>; })()}
        <Chip t={t} t0={923.51} text="A FEW THOUSAND EXHAUSTED MEN" color={C.violeta} x={130} y={130} size={48} />
        <Chip t={t} t0={925.43} text="WITH BAD KNEES" color={C.rojo} x={130} y={235} size={48} />
        <Grande t={t} t0={926.85} text="“FAR ENOUGH.”" x={1180} y={240} size={110} color={C.oro} borde="#2a1530" />
      </>}
    </Escena>

    {/* 210 · CTA: 25 años en sandalias romanas (camina por la ruta) → suscribite y la campana */}
    <Escena t={t} t0={928.6} t1={933.4} zoom={0.02} entra="corte" golpes={[932.27, 932.95]}>
      <Ruta t={t} hora="tarde" avance={(t - 928.6) * (t < 931.3 ? 260 : 60) + (t >= 931.3 ? (931.3 - 928.6) * 200 : 0)} />
      <Persona x={520} y={PIE - 30} h={600} t={t} seed={1} viejo casco="legion" expr="feliz" camina={t < 931.3 ? 1.4 : 0} habla={t > 931.3}
        {...(t > 931.3 ? { bD: 95, cD: 5 } : {})} mira={t > 931.3 ? 0.8 : 0.3} />
      <Chip t={t} t0={928.8} text="25 YEARS IN ROMAN SANDALS" color={C.violeta} x={130} y={130} size={52} />
      {t < 931.3 && <>
        <Cuenta t={t} t0={928.9} t1={931.0} de={0} a={25} x={1240} y={360} size={150} color={C.oro} suf=" YEARS" />
        <div style={{ position: "absolute", left: 1040, top: 470, width: 400, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, 929.3)})` }}>{["LEFT,", "LEFT, RIGHT,", "LEFT, RIGHT, LEFT…"][Math.min(2, Math.floor((t - 929.3) * 1.6))]}</div>
      </>}
      <Suscribir t={t} t0={931.3} tClick={932.27} x={1220} y={400} />
      <Campana x={1220} y={640} s={0.9} t={t} t0={932.4} t0b={932.95} />
    </Escena>

    {/* 211 · la próxima: nos subimos a un barco; contame cuál trampa te agarraba primero */}
    <Escena t={t} t0={933.4} t1={940.55} zoom={0.02} entra="corte" golpes={[935.41, 936.55, 938.33]}>
      {t < 936.0 ? <>
        <Cielo tipo="dia" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: "linear-gradient(180deg, #2f8fd6, #1a4a8a)" }} />
        {(() => { const bx = interpolate(t, [933.4, 936.3], [700, 1150]); return <>
          <Barco x={bx} y={700} s={1.3} t={t} />
          <Persona x={bx + 150} y={782} h={280} t={t} seed={1} casco="legion" expr="feliz" {...pose("saludar", t, 1.1)} />
        </>; })()}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[0, 1, 2].map((i) => <path key={i} d={`M ${-100 + ((t * 80 + i * 700) % 2200)} ${860 + i * 70} q 40 -20 80 0 t 80 0`} stroke="#bfe6ff" strokeWidth={8} fill="none" strokeLinecap="round" />)}</svg>
        <Chip t={t} t0={933.5} text="NEXT TIME" color={C.violeta} x={130} y={130} size={56} />
        <Grande t={t} t0={934.85} text="WE JOIN A SHIP" y={270} size={110} color="#fff" borde="#1a4a8a" />
      </> : <>
        <TableroC t={t} t0={935.9} en={Math.floor(((t - 937.4) * 2.5) % 7 + 7) % 7} de={0} hecho={0} />
        <Persona x={280} y={PIE} h={440} t={t} seed={1} casco="legion" expr="feliz" habla bD={32 + Math.sin(t * 3) * 6} cD={95} bI={32 - Math.sin(t * 3) * 6} cI={95} mira={0.6} miraY={-0.3} />
        <Emote t={t} t0={936.6} tipo="preg" {...L(280, PIE, 440)} s={0.9} />
        <Grande t={t} t0={936.05} text="WHICH TRAP" x={700} y={140} size={88} color="#fff" borde="#5e0f1d" />
        <Grande t={t} t0={936.3} text="GETS YOU FIRST?" x={700} y={265} size={88} color="#fff" borde="#5e0f1d" />
        <Chip t={t} t0={936.47} text="TELL ME IN THE COMMENTS" color={C.oro} tinta={C.noche} x={700} y={390} centro size={46} />
      </>}
    </Escena>
  </>
);
