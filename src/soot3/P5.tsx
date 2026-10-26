import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL, LUCIUS, Ropa } from "./persona";
import { C, fontFamily, ent, prog, Escena, Chip, Grande, MapaPuntos, Rayos, Emote, cabeza, Pan, lugar } from "./kit";
import { Gladius, Comida, Soldadito, Craneo, Calor, Mula, Casco } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, CarpaInterior, PlazaArmas, PuertaPretoria, Valle, Interior, Ruta, Campo, Tablero, Multitud, EnMano, pose } from "./kit3";

// Parte 5 (547,17-659,62 s): trampa 5, el campamento: fiebre, letrinas, la peste antonina, los medici y la comida.
// v4 (arte base v5): cada escena cambia de set y de ángulo (plaza de armas en contrapicado, campamento cenital como mapa
// vivo, interior de la carpa, puerta pretoria, valle), personajes de 3/4 / perfil / sentados, objetos AGARRADOS (agarra +
// agarraAng) y una reacción exagerada en cada remate. El protagonista es seed 1 (LUCIUS, casco dorado).
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const PISO = 1000;
const ENFERMO: Ropa = { ...LUCIUS, piel: "#cfe0a0", piel2: "#a8c070" };
const MEDICO: Ropa = { tunica: "#f2efe6", tunica2: "#cfc8b8", cinto: "#3a9a4a", piel: "#e0a07a", piel2: "#c07a5a", pelo: "#6a6a6a" };
const GLADIADOR: Ropa = { tunica: "#8a5a2a", tunica2: "#5a3418", cinto: "#2a1a10", piel: "#c98a5a", piel2: "#a86a40", pelo: "#1a1010" };
const COMPA: Ropa = { ...LUCIUS, tunica: "#3f6fb0", tunica2: "#274a80" };
// mezcla dos colores hex (para que la piel se ponga verde de a poco)
const mezcla = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const enfermando = (k: number, base: Ropa = LUCIUS): Ropa => (k <= 0 ? base : { ...base, piel: mezcla(base.piel, ENFERMO.piel, k), piel2: mezcla(base.piel2, ENFERMO.piel2, k) });
// el protagonista es seed 1; si lleva otra piel (enfermo) usa seed 101 para que su degradé no choque con el de la escena vecina
const yo = (r: Ropa = LUCIUS) => (r === LUCIUS ? 1 : 101);

// ── objetos EN la mano (formato EnMano: mango en (0,0), el objeto apunta a +x; -y = arriba en pantalla con agarraAng 0)
const M = {
  tridente: () => (
    <g>
      <rect x={-130} y={-7} width={480} height={14} rx={6} fill="#7a4a22" />
      <path d="M 350 -46 L 350 46 M 350 -46 L 430 -46 M 350 0 L 450 0 M 350 46 L 430 46" stroke="#c8ccd4" strokeWidth={12} strokeLinecap="round" fill="none" />
    </g>
  ),
  red: () => (
    <g>
      <path d="M 0 -18 Q 90 -60 190 -50 L 190 50 Q 90 60 0 18 Z" fill="rgba(230,220,190,.35)" stroke="#e8dcb8" strokeWidth={4} />
      {[50, 100, 150].map((x) => <line key={x} x1={x} y1={-40} x2={x} y2={40} stroke="#e8dcb8" strokeWidth={3} />)}
      {[-25, 0, 25].map((y) => <line key={y} x1={10} y1={y * 0.5} x2={190} y2={y * 1.6} stroke="#e8dcb8" strokeWidth={3} />)}
    </g>
  ),
  cuenco: () => (
    <g>
      <path d="M -6 -16 L 104 -16 Q 98 40 49 44 Q 0 40 -6 -16 Z" fill="#a8622c" stroke="#6b3a1f" strokeWidth={5} />
      <ellipse cx={49} cy={-16} rx={55} ry={12} fill="#f2e4c0" />
    </g>
  ),
  jarra: () => (
    <g>
      <path d="M 4 -80 L 70 -80 L 80 26 Q 37 48 -6 26 Z" fill="#c9773a" stroke="#7a3d14" strokeWidth={5} />
      <ellipse cx={37} cy={-80} rx={33} ry={9} fill="#8a3a4a" />
    </g>
  ),
  pinza: () => (
    <g>
      <path d="M 0 -6 Q 80 -26 170 -4 M 0 6 Q 80 26 170 4" stroke="#c8ccd4" strokeWidth={9} fill="none" strokeLinecap="round" />
      <rect x={-14} y={-10} width={30} height={20} rx={6} fill="#8a93a3" />
    </g>
  ),
  bisturi: () => (
    <g>
      <rect x={-20} y={-8} width={90} height={16} rx={6} fill="#e9a92a" />
      <path d="M 70 -8 L 130 -8 Q 170 0 130 10 L 70 8 Z" fill="#dfe5ee" stroke="#8a93a3" strokeWidth={3} />
    </g>
  ),
  extractor: () => (
    <g>
      <path d="M 0 -4 L 190 -14 M 0 4 L 190 14" stroke="#8a93a3" strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={196} cy={-14} rx={12} ry={7} fill="#8a93a3" /><ellipse cx={196} cy={14} rx={12} ry={7} fill="#8a93a3" />
    </g>
  ),
  venda: () => (
    <g>
      <circle cx={24} cy={0} r={22} fill="#fff" stroke="#d8d0c4" strokeWidth={4} />
      <path d="M 24 22 Q 60 60 30 110" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  ),
  palo: () => <rect x={-10} y={-8} width={150} height={16} rx={7} fill="#a8703a" stroke="#6b3a1f" strokeWidth={3} />,
  cadena: () => <g>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={10 + i * 26} cy={0} rx={16} ry={9} fill="none" stroke="#7d8796" strokeWidth={7} />)}</g>,
};

const Termometro: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => {
  if (t < t0 - 0.3) return null;
  const k = prog(t, t0, t0 + 1.2);
  return (
    <svg style={{ position: "absolute", left: x - 90 * s, top: y - 330 * s, overflow: "visible", transform: `scale(${ent(t, t0 - 0.3)}) rotate(${Math.sin(t * 9) * 3}deg)` }} width={180 * s} height={660 * s} viewBox="-90 -330 180 660">
      <rect x={-40} y={-320} width={80} height={520} rx={40} fill="#fff" stroke="#2a1530" strokeWidth={10} />
      <rect x={-18} y={170 - 470 * k} width={36} height={470 * k + 40} rx={18} fill={C.rojo} />
      <circle cx={0} cy={240} r={80} fill={C.rojo} stroke="#2a1530" strokeWidth={10} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={40} y1={-260 + i * 90} x2={70} y2={-260 + i * 90} stroke="#2a1530" strokeWidth={8} />)}
    </svg>
  );
};
const Virus: React.FC<{ t: number; x: number; y: number; r?: number; t0?: number; op?: number }> = ({ t, x, y, r = 120, t0 = -9, op = 1 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <svg style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, overflow: "visible", opacity: op }} width={r * 3.2} height={r * 3.2} viewBox="-160 -160 320 320">
      <g transform={`scale(${e}) rotate(${t * 25})`}>
        {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><line x1={0} y1={-90} x2={0} y2={-135} stroke="#3a9a4a" strokeWidth={12} /><circle cx={0} cy={-140} r={14} fill="#c6f04a" stroke="#3a9a4a" strokeWidth={6} /></g>)}
        <circle r={95} fill="#7ad45a" stroke="#3a9a4a" strokeWidth={12} />
        {[[-30, -20, 18], [30, 10, 14], [-10, 40, 12], [40, -40, 10]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="#3a9a4a" opacity={0.6} />)}
      </g>
    </svg>
  );
};
// nube de contagio (sin blur: degradé radial y virus adentro)
const Nube: React.FC<{ t: number; x: number; y: number; w?: number; h?: number }> = ({ t, x, y, w = 700, h = 520 }) => (
  <>
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(122,212,90,.7), rgba(122,212,90,.35) 55%, rgba(122,212,90,0) 72%)" }} />
    {[0, 1, 2, 3].map((i) => <Virus key={i} t={t} x={x - w * 0.2 + (i % 2) * w * 0.3} y={y - h * 0.18 + Math.floor(i / 2) * h * 0.32 + Math.sin(t * 4 + i) * 18} r={48 + (i % 2) * 10} op={0.92} />)}
  </>
);
const Hospital: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 300 * s, top: y - 300 * s, overflow: "visible", transform: `scale(${ent(t, t0)})`, transformOrigin: "50% 100%" }} width={600 * s} height={600 * s} viewBox="-300 -300 600 600">
    <ellipse cx={-40} cy={286} rx={300} ry={22} fill="#1d0f33" opacity={0.2} />
    <path d="M -280 -60 L 0 -240 L 280 -60 Z" fill="#c9b8a0" stroke="#8a7a64" strokeWidth={10} />
    <rect x={-250} y={-60} width={500} height={340} fill="#efe6d6" stroke="#8a7a64" strokeWidth={10} />
    {[-170, -60, 60, 170].map((cx) => <rect key={cx} x={cx - 18} y={-40} width={36} height={300} fill="#ded2bd" />)}
    <rect x={-60} y={140} width={120} height={140} fill="#6b3a1f" />
    <g transform="translate(0 40)"><rect x={-26} y={-70} width={52} height={140} fill={C.rojo} /><rect x={-70} y={-26} width={140} height={52} fill={C.rojo} /></g>
  </svg>
);
// carta con ícono tachado (escalable)
const Falta: React.FC<{ t: number; t0: number; x: number; y?: number; s?: number; txt: string; icono: React.ReactNode; tx: number }> = ({ t, t0, x, y = 540, s = 1, txt, icono, tx }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 300, top: y - 320, width: 600, height: 640, borderRadius: 36, background: "#fff8ec", border: "10px solid #2a1530", transform: `scale(${e * s}) rotate(${(1 - e) * -10}deg)`, boxShadow: "16px 18px 0 rgba(20,8,40,.35)" }}>
      <div style={{ position: "absolute", left: 150, top: 70, width: 300, height: 300 }}>{icono}</div>
      <svg style={{ position: "absolute", left: 100, top: 40 }} width={400} height={380}><path d="M 30 30 L 370 350 M 370 30 L 30 350" stroke={C.rojo} strokeWidth={36} strokeLinecap="round" strokeDasharray={470} strokeDashoffset={470 * (1 - prog(t, tx, tx + 0.25))} /></svg>
      <div style={{ position: "absolute", left: 20, right: 20, top: 430, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 66, lineHeight: 1.1, color: "#2a1530" }}>{txt}</div>
    </div>
  );
};
// calendario que tacha días
const Calendario: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x - 330, top: y - 300, width: 660, height: 600, borderRadius: 30, background: "#fff", border: "10px solid #2a1530", transform: `scale(${ent(t, t0) * s})`, overflow: "hidden", boxShadow: "14px 16px 0 rgba(20,8,40,.3)" }}>
    <div style={{ height: 100, background: C.rojo, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", textAlign: "center", lineHeight: "100px" }}>EVERY DAY</div>
    {Array.from({ length: 28 }, (_, i) => {
      const on = t > t0 + 0.3 + i * 0.12;
      return <div key={i} style={{ position: "absolute", left: 24 + (i % 7) * 88, top: 124 + Math.floor(i / 7) * 115, width: 76, height: 96, borderRadius: 14, background: on ? "#effbe8" : "#f2ecf8", fontFamily, fontWeight: 700, fontSize: 52, color: "#3fa34d", textAlign: "center", lineHeight: "96px" }}>{on ? "✓" : ""}</div>;
    })}
  </div>
);
// letrina en corte: banco de piedra a la altura del asiento (los sentados van DELANTE: sus piernas cuelgan por el frente)
const PIE = 955;
const H_LET = 470;
const ASIENTO = PIE - (125 * H_LET) / 560; // tope del banco = cadera de un sentado de alto H_LET
const BancoLetrina: React.FC<{ t: number; x0?: number; x1?: number; agujeros: number[] }> = ({ t, x0 = 110, x1 = 1810, agujeros }) => {
  const y = ASIENTO - 6;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: PIE, bottom: 0, background: "#a88a62" }} />
      <div style={{ position: "absolute", left: x0 + 10, width: x1 - x0 - 20, top: y + 26, height: PIE - y - 26, background: "#c9b8a0", overflow: "hidden" }}>
        {agujeros.map((x) => <div key={x} style={{ position: "absolute", left: x - x0 - 10 - 70, top: 14, width: 140, bottom: 0, borderRadius: "70px 70px 0 0", background: "#2a1a10", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 24, background: "#2f86b0" }} />
          {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 60 + t * 120) % 180) - 30, bottom: 8 + i * 6, width: 30, height: 5, borderRadius: 3, background: "rgba(255,255,255,.6)" }} />)}
        </div>)}
      </div>
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: y, height: 28, borderRadius: 10, background: "#e8dcc4", boxShadow: "0 6px 0 #b5a48a" }} />
    </>
  );
};
const Canaleta: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: PIE + 16, height: 46, background: "linear-gradient(180deg,#4fb3e8,#2f86b0)", overflow: "hidden", borderTop: "6px solid #8a7a64" }}>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 190 + t * 320) % 2200) - 140, top: 8 + (i % 3) * 10, width: 110, height: 8, borderRadius: 4, background: "rgba(255,255,255,.6)" }} />)}
  </div>
);
// arcadas al fondo de la letrina (pórtico abierto: no hay paredes entre nadie)
const Portico: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${190 + i * 385} 0)`}>
      <path d="M 0 640 L 0 240 A 150 150 0 0 1 300 240 L 300 640 Z" fill="#9ccbe8" />
      <path d="M 0 520 Q 150 470 300 510 L 300 640 L 0 640 Z" fill="#8cbf78" />
    </g>)}
  </svg>
);
// molino de mano: dos piedras; la de arriba gira (marcas que dan la vuelta) y la manija sube hasta la MANO (hx, hy absolutos)
const Molino: React.FC<{ t: number; x: number; y: number; s?: number; g: number; hx: number; hy: number }> = ({ t, x, y, s = 1, g, hx, hy }) => {
  const top = y - 66 * s;
  return (
    <>
      <svg style={{ position: "absolute", left: x - 200 * s, top: y - 200 * s, overflow: "visible" }} width={400 * s} height={300 * s} viewBox="-200 -200 400 300">
        <ellipse cx={-30} cy={80} rx={210} ry={30} fill="#1d0f33" opacity={0.2} />
        <ellipse cx={0} cy={72} rx={190} ry={34} fill="#f6efe0" />
        <ellipse cx={0} cy={60} rx={150} ry={40} fill="#7a7264" />
        <rect x={-150} y={10} width={300} height={50} fill="#8a8274" />
        <ellipse cx={0} cy={10} rx={150} ry={40} fill="#9a9284" />
        <rect x={-130} y={-60} width={260} height={60} fill="#a8a092" />
        <ellipse cx={0} cy={-60} rx={130} ry={36} fill="#c4bcae" />
        {[0, 1, 2, 3, 4, 5].map((k) => { const a = g + (k * Math.PI) / 3; const c = Math.cos(a), sn = Math.sin(a); return sn > -0.2 ? <rect key={k} x={c * 128 - 5} y={-40 + sn * 10} width={10} height={24} rx={4} fill="#7a7264" opacity={0.5 + 0.5 * sn} /> : null; })}
        <ellipse cx={0} cy={-60} rx={34} ry={12} fill="#6a6254" />
        {Array.from({ length: 10 }, (_, i) => { const k = ((t * 1.3 + i / 10) % 1); const lado = i % 2 ? 1 : -1; return <circle key={i} cx={lado * (150 + k * 30)} cy={20 + k * 50} r={6} fill="#fff8ec" opacity={1 - k} />; })}
      </svg>
      <div style={{ position: "absolute", left: hx - 11, top: hy, width: 22, height: Math.max(20, top - hy + 6), borderRadius: 9, background: "#8a5a2a" }} />
    </>
  );
};
// bolsa de trigo
const Saco: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 110 * s, top: y - 220 * s, overflow: "visible" }} width={220 * s} height={220 * s} viewBox="-110 -220 220 220">
    <ellipse cx={-20} cy={0} rx={110} ry={14} fill="#1d0f33" opacity={0.2} />
    <path d="M -90 0 Q -110 -120 -60 -170 L 60 -170 Q 110 -120 90 0 Z" fill="#d9b27a" stroke="#8a5a2a" strokeWidth={6} />
    <ellipse cx={0} cy={-170} rx={62} ry={18} fill="#f2c84a" />
    {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-45 + (i % 5) * 22} cy={-178 - Math.floor(i / 5) * 10} rx={8} ry={12} fill="#e0a82a" />)}
    <text x={0} y={-60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#8a5a2a">SPQR</text>
  </svg>
);
// protagonista al pie del mapa: de 3/4 mirando el mapa, con la mano en la boca; al remate, reacción
// v5: entero (x 330), SEÑALA el mapa y da un salto («ojos») cada vez que un arco llega a un fuerte; el último es «susto».
// modo "tiembla": la 2ª vez que aparece (9:56-9:59) ya no señala: se agarra la cabeza y tiembla (pose distinta).
const Testigo: React.FC<{ t: number; llegadas?: number[]; susto?: number; x?: number; modo?: "senala" | "tiembla" }> = ({ t, llegadas = [], susto, x = 330, modo = "senala" }) => {
  const ult = llegadas.filter((a) => t >= a).pop();
  const enSusto = susto !== undefined && t >= susto;
  const base = modo === "tiembla" ? pose("temblar", t) : { bD: 100 + Math.sin(t * 3) * 6, cD: 12, bI: 22, cI: 40 };
  return (
    <>
      <div style={{ position: "absolute", left: x - 230, top: PISO + 10, width: 460, height: 90, borderRadius: "50%", background: "#3a2a78", boxShadow: "0 -6px 0 #5b48a8 inset" }} />
      <Persona x={x} y={PISO + 40} h={480} t={t} seed={1} casco="legion" giro="34" expr={ult !== undefined ? "sorpresa" : "miedo"} mira={0.8} miraY={-0.4}
        {...base} reaccion={enSusto ? "susto" : ult !== undefined ? "ojos" : undefined} reaccionT0={enSusto ? susto : ult} />
    </>
  );
};
// cuerpo caído: la persona gira sobre los pies hacia atrás (k 0-1)
const Cae: React.FC<{ x: number; y: number; k: number; lado?: number; children: React.ReactNode }> = ({ x, y, k, lado = -1, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `rotate(${lado * 84 * k}deg)`, transformOrigin: `${x}px ${y - 20}px` }}>{children}</div>
);

export const P5: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 136 · trampa cinco: el campamento */}
    <Escena t={t} t0={547.17} t1={549.5} entra="corte" golpes={[547.41, 548.6]}>
      <Tablero t={t} t0={546.8} en={4} de={3} tAvanza={547.3} marca={548.2} hecho={4} />
      <Chip t={t} t0={547.41} text="TRAP 5 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={548.6} text="THE CAMP" x={900} y={400} size={130} />
    </Escena>

    {/* 137 · algo que las películas nunca te muestran: el héroe del cine vs. el soldado real con fiebre en su litera */}
    <Escena t={t} t0={549.5} t1={551.6} zoom={0.02} entra="corte" golpes={[550.51]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      <div style={{ position: "absolute", left: 130, top: 230, width: 720, height: 520, borderRadius: 16, border: "18px solid #2a2a2a", overflow: "hidden", background: "linear-gradient(180deg, #ffd27a, #e2557a)" }}>
        <div style={{ position: "absolute", left: -600, top: -200 }}><Rayos t={t} x={960} y={500} color="#fff6c8" op={0.3} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "#a8417a" }} />
        <Persona x={360} y={470} h={400} t={t} seed={1} casco="legion" expr="orgullo" giro="34" bD={165 + Math.sin(t * 6) * 6} cD={10} bI={40} cI={60} agarra={<EnMano.gladius />} agarraAng={-75} />
        <Emote t={t} t0={549.5} tipo="brillos" {...L(360, 470, 400)} s={0.9} />
      </div>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 90, top: 200, width: 46, height: 22, borderRadius: 6, background: "#555" }} />)}
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 90, top: 768, width: 46, height: 22, borderRadius: 6, background: "#555" }} />)}
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 120, top: 830, width: 90, height: 120, borderRadius: "45px 45px 10px 10px", background: "#2a1a3a" }} />)}
      <div style={{ position: "absolute", left: 980, top: 0, width: 940, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -560, top: 0, width: 1920, height: 1080 }}><CarpaInterior t={t} /></div>
        <Persona x={330} y={1030} h={600} t={t} seed={101} casco="legion" ropa={ENFERMO} expr="triste" postura="sentado" ladea={8} {...pose("temblar", t)} />
        <Emote t={t} t0={549.6} tipo="sudor" {...L(330, 1030, 600)} s={1.2} />
        <Termometro t={t} t0={549.8} x={720} y={600} s={0.6} />
      </div>
      <div style={{ position: "absolute", left: 952, top: 0, width: 28, height: 1080, background: "#fff" }} />
      <Chip t={t} t0={549.5} text="THE MOVIES" color={C.ambar} tinta={C.noche} x={490} y={130} centro size={54} />
      <Chip t={t} t0={549.75} text="REALITY" color={C.rojo} x={1420} y={130} centro size={54} />
      <Chip t={t} t0={550.51} text="NEVER SHOW YOU THIS" color={C.violeta} x={490} y={940} centro size={50} />
    </Escena>

    {/* 138 · lo más mortal no era una espada: era la fiebre — plaza de armas en contrapicado, golpea el poste y se derrite */}
    <Escena t={t} t0={551.6} t1={557.96} zoom={0.03} entra="corte" golpes={[553.29, 556.25, 557.38]}>
      <PlazaArmas t={t} angulo="bajo" hora="tarde" />
      {(() => {
        const fiebre = prog(t, 557.0, 557.6);
        const enf = t > 557.2;
        const ropa = enfermando(fiebre);
        return <>
          {enf && <Gladius x={1330} y={1050} s={0.9} rot={84} t={t} t0={557.2} madera />}
          <Persona x={1160} y={1070} h={700} t={t} seed={yo(ropa)} casco="legion" ropa={ropa} giro={enf ? "frente" : "34"} expr={enf ? "triste" : t > 556.25 ? "sorpresa" : "enojado"}
            {...(enf ? pose("temblar", t) : pose("golpear", t, 1.1))} ladea={enf ? 8 : 0}
            agarra={enf ? undefined : <EnMano.gladius madera />} agarraAng={-30} reaccion={enf ? "derrite" : undefined} reaccionT0={557.45} />
          {enf && <Emote t={t} t0={557.4} tipo="sudor" {...L(1160, 1070, 700)} s={1.2} />}
        </>;
      })()}
      <Chip t={t} t0={553.29} text="THE DEADLIEST THING" color={C.violeta} x={160} y={140} size={58} t1={556.9} />
      {t < 557.2 && <>
        <Gladius x={480} y={560} s={1.3} rot={-30} t={t} t0={554.4} />
        {t > 555.75 && <svg style={{ position: "absolute", left: 210, top: 290 }} width={540} height={540}><path d="M 50 50 L 490 490 M 490 50 L 50 490" stroke={C.rojo} strokeWidth={56} strokeLinecap="round" strokeDasharray={630} strokeDashoffset={630 * (1 - prog(t, 556.0, 556.3))} /></svg>}
        <Chip t={t} t0={556.25} text="NOT A SWORD" color={C.rojo} x={480} y={880} centro size={60} />
      </>}
      {t >= 557.2 && <>
        <Termometro t={t} t0={557.38} x={480} y={620} s={1.0} />
        <Grande t={t} t0={557.38} text="A FEVER" y={170} size={150} color="#fff" borde={C.rojo} />
      </>}
    </Escena>

    {/* 139 · miles de hombres en un fuerte: la multitud de cerca, después el campamento desde arriba y el contagio que salta
        de carpa en carpa (agua, letrinas, carpas... y una mula) */}
    <Escena t={t} t0={557.96} t1={564.6} zoom={0.03} entra="corte" golpes={[557.96, 560.93, 562.01, 563.89]}>
      {t < 560.93
        ? <>
          <Campamento t={t} hora="tarde" tropa={false} />
          <Multitud t={t} n={20} filas={3} x0={150} x1={1770} y={1050} h={380} seed={21} casco="mixto" habla rompe={3} />
          <Persona x={960} y={1075} h={560} t={t} seed={1} casco="legion" expr="miedo" giro="34" flip={Math.sin(t * 1.6) > 0} mira={0.6} bI={40} cI={110} bD={40} cD={110} />
          <Grande t={t} t0={557.96} text="THOUSANDS OF MEN" y={150} size={110} color="#fff" borde={C.rojo} />
        </>
        : (() => {
          // mismo grillado que CampCenital (kit3) para pintar de verde las carpas que se contagian
          const carpas: [number, number][] = [];
          for (let gx = 370; gx < 1560; gx += 82) for (let gy = 180; gy < 920; gy += 66) {
            if (Math.abs(gx - 960) < 80 || Math.abs(gy - 470) < 70) continue;
            if (Math.abs(gx - 960) < 190 && Math.abs(gy - 470) < 140) continue;
            carpas.push([gx, gy]);
          }
          const R = (t - 560.93) * 300;
          const ox = 616, oy = 708;
          const enf = carpas.filter(([x, y]) => Math.hypot(x - ox, (y - oy) * 1.3) < R);
          return <>
            <Campamento t={t} hora="tarde" angulo="cenital" />
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              {enf.map(([x, y], i) => { const d = Math.hypot(x - ox, (y - oy) * 1.3); const k = Math.min(1, (R - d) / 80); return <rect key={i} x={x - 28} y={y - 20} width={56} height={38} rx={6} fill="#7ad45a" opacity={0.35 + 0.5 * k} stroke="#2a7a2a" strokeWidth={3} />; })}
              <ellipse cx={ox} cy={oy} rx={Math.min(R, 1400)} ry={Math.min(R, 1400) / 1.3} fill="none" stroke="#c6f04a" strokeWidth={8} opacity={0.5} />
            </svg>
            <div style={{ position: "absolute", left: 1290, top: 112, padding: "10px 26px", borderRadius: 18, background: "#1d4a24", fontFamily, fontWeight: 700, fontSize: 52, color: "#c6f04a", border: "5px solid #c6f04a" }}>SICK: {(enf.length * 8).toLocaleString("en-US")}</div>
            {t > 563.2 && <div style={{ position: "absolute", left: 1170, top: 640, width: 576, height: 324, borderRadius: 24, border: "10px solid #fff", overflow: "hidden", transform: `scale(${ent(t, 563.2)})`, transformOrigin: "100% 100%", boxShadow: "12px 14px 0 rgba(20,8,40,.4)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.3)", transformOrigin: "0 0" }}>
                <CarpaInterior t={t} />
                <Persona x={560} y={1040} h={560} t={t} seed={102} casco="no" ropa={CIVIL(3)} postura="sentado" expr="dormido" />
                <Persona x={900} y={1040} h={600} t={t} seed={1} casco="legion" postura="sentado" expr="sorpresa" reaccion="ojos" reaccionT0={563.6} />
                <Mula x={1380} y={1060} s={1.2} t={t} t0={563.2} />
              </div>
            </div>}
          </>;
        })()}
      <Chip t={t} t0={560.93} text="SHARING WATER" color={C.teal} tinta={C.noche} x={40} y={160} size={48} />
      <Chip t={t} t0={562.01} text="SHARING LATRINES" color={C.ambar} tinta={C.noche} x={40} y={250} size={48} />
      <Chip t={t} t0={563.2} text="SHARING TENTS... + A MULE" color={C.rojo} x={1170} y={580} size={44} />
    </Escena>

    {/* 140 · la enfermedad corría más rápido que una carga de caballería: corre por el valle y la nube lo alcanza */}
    <Escena t={t} t0={564.6} t1={568.3} zoom={0.03} entra="corte" golpes={[564.6, 566.08, 567.48]}>
      <Valle t={t} hora="tarde" />
      {(() => {
        const fx = interpolate(t, [564.6, 568.2], [-200, 2300]);
        const px = 300 + Math.min(t - 564.6, 1.75) * 340;
        const tocado = fx - 200 > px - 120;
        const k = tocado ? prog(t, 566.3, 566.9) : 0;
        return <>
          {Array.from({ length: 7 }, (_, i) => { const x = 220 + i * 250; return <Soldadito key={i} x={x} y={770} s={0.8} t={t} seed={30 + i} cae={564.6 + (x + 300) / 2500 * 3.6} />; })}
          <Persona x={px} y={1040} h={540} t={t} seed={yo(enfermando(k))} casco="legion" ropa={enfermando(k)} giro={tocado ? "frente" : "perfil"} corre={tocado ? 0 : 2.2}
            expr={tocado ? "triste" : "miedo"} {...(tocado ? pose("temblar", t) : {})} reaccion={tocado ? "derrite" : undefined} reaccionT0={566.5} />
          <Nube t={t} x={fx - 200} y={760} w={760} h={620} />
        </>;
      })()}
      <Grande t={t} t0={564.6} text="DISEASE" y={150} size={140} color="#c6f04a" borde="#1d4a24" />
      <Chip t={t} t0={566.08} text="FASTER THAN ANY CAVALRY CHARGE" color={C.rojo} x={960} y={290} centro size={54} />
    </Escena>

    {/* 141 · letrinas: banco largo de piedra con agujeros, todos SENTADOS uno al lado del otro, sin paredes */}
    <Escena t={t} t0={568.3} t1={574.3} zoom={0.03} entra="corte" golpes={[569.65, 570.6, 572.74]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <Portico />
      <BancoLetrina t={t} agujeros={[300, 520, 740, 960, 1180, 1400, 1620]} />
      {[300, 520, 740, 960, 1180, 1400, 1620].map((x, i) => {
        const soy = i === 3;
        const lee = i === 5;
        const giro = soy || i === 1 || lee ? "frente" : "34";
        const flip = i === 2 || i === 6;
        return <Persona key={x} x={x} y={PIE} h={H_LET} t={t} seed={soy ? 1 : 190 + i} casco={soy ? "legion" : "no"} ropa={soy ? LUCIUS : CIVIL(i)} postura="sentado" giro={giro} flip={flip}
          expr={soy ? (t > 571.65 ? "miedo" : "neutro") : lee ? "neutro" : i % 2 ? "feliz" : "orgullo"}
          habla={!soy && !lee && Math.sin(t * 1.3 + i) > -0.2}
          mira={soy ? Math.sin(t * 2.2) : lee ? 0 : 0.5} miraY={lee ? 0.8 : 0}
          bI={lee ? 55 : i === 1 ? 70 : 14} cI={lee ? 95 : i === 1 ? 100 : 30} bD={lee ? 60 : i === 4 ? 95 + Math.sin(t * 3) * 10 : 14} cD={lee ? 90 : 30}
          agarra={lee ? <EnMano.tablilla texto="NEWS" /> : undefined} agarraAng={-80}
          reaccion={soy ? "ojos" : undefined} reaccionT0={572.8} />;
      })}
      <Canaleta t={t} />
      <Chip t={t} t0={568.4} text="THE LATRINES" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={569.65} text="LONG STONE BENCHES" color={C.ambar} tinta={C.noche} x={160} y={250} size={52} />
      <Chip t={t} t0={571.65} text="SIDE BY SIDE" color={C.teal} tinta={C.noche} x={1240} y={140} size={52} />
      <Chip t={t} t0={572.74} text="NO WALLS" color={C.rojo} x={1240} y={250} size={60} />
    </Escena>

    {/* 142 · el agua corría abajo y para limpiarte: una esponja en un palo que pasa de mano en mano */}
    <Escena t={t} t0={574.3} t1={581.5} zoom={0.03} entra="corte" golpes={[574.62, 577.98, 580.91]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <Portico />
      <BancoLetrina t={t} agujeros={[480, 860, 1240]} />
      {(() => {
        const p1 = prog(t, 578.5, 578.9), p2 = prog(t, 579.5, 579.9);
        const quien = t < 577.7 ? -1 : p1 <= 0 ? 0 : p1 < 1 ? 9 : p2 <= 0 ? 1 : p2 < 1 ? 9 : 2;
        const usados = t < 577.98 ? 0 : 26 + (p1 >= 1 ? 1 : 0) + (p2 >= 1 ? 1 : 0) + (t > 580.2 ? Math.floor((t - 580.2) * 6) : 0);
        const vuela = p1 > 0 && p1 < 1 ? [480 + 380 * p1, p1] : p2 > 0 && p2 < 1 ? [860 + 380 * p2, p2] : null;
        const tiene = (k: number) => quien === k;
        const brazo = (k: number) => (tiene(k) ? { bD: 120 + Math.sin(t * 5) * 8, cD: 20 } : { bD: 14, cD: 30 });
        return <>
          <Persona x={480} y={PIE} h={H_LET} t={t} seed={193} ropa={CIVIL(2)} postura="sentado" giro="34" expr="feliz" habla={t < 578.5} mira={0.8} bI={14} cI={30} {...brazo(0)}
            agarra={tiene(0) ? <EnMano.esponja /> : undefined} agarraAng={-60} />
          <Persona x={860} y={PIE} h={H_LET} t={t} seed={194} ropa={CIVIL(5)} postura="sentado" giro="34" expr={t > 579.0 ? "feliz" : "neutro"} mira={tiene(1) ? 0.8 : -0.6} bI={14} cI={30} {...brazo(1)}
            agarra={tiene(1) ? <EnMano.esponja /> : undefined} agarraAng={-60} />
          <Persona x={1240} y={PIE} h={H_LET + 20} t={t} seed={1} casco="legion" postura="sentado" giro="34" flip expr={tiene(2) ? "miedo" : t > 577.98 ? "sorpresa" : "neutro"} mira={0.8} bI={14} cI={30}
            {...(tiene(2) ? { bD: 70, cD: 10 } : { bD: 14, cD: 30 })} agarra={tiene(2) ? <EnMano.esponja /> : undefined} agarraAng={-40}
            reaccion={tiene(2) ? "ojos" : undefined} reaccionT0={579.95} />
          {vuela && <svg style={{ position: "absolute", left: vuela[0] - 120, top: 470 - Math.sin(vuela[1] * Math.PI) * 120, overflow: "visible" }} width={10} height={10}>
            <g transform={`rotate(${-70 + vuela[1] * 360})`}><EnMano.esponja /></g>
          </svg>}
          {usados > 0 && <div style={{ position: "absolute", left: 1460, top: 300, padding: "10px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", border: "5px solid #e8c86a" }}>USED BY: {usados}</div>}
        </>;
      })()}
      <Canaleta t={t} />
      <Chip t={t} t0={574.62} text="WATER RAN UNDERNEATH" color={C.teal} tinta={C.noche} x={160} y={120} size={52} t1={580.6} />
      <Chip t={t} t0={577.98} text="A SPONGE ON A STICK" color={C.ambar} tinta={C.noche} x={160} y={225} size={54} t1={580.6} />
      <Grande t={t} t0={580.91} text="SHARED." y={170} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 143 · no querés saber cuántos la usaron antes que vos */}
    <Escena t={t} t0={581.5} t1={585.1} zoom={0.02} entra="corte" golpes={[583.01, 584.17]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <Portico />
      <BancoLetrina t={t} agujeros={[600]} x1={1100} />
      <Persona x={600} y={PIE} h={H_LET + 60} t={t} seed={1} casco="legion" postura="sentado" giro="34" expr="miedo" inclina={-10} bD={60} cD={0} bI={150} cI={130} mira={0.9} miraY={-0.4}
        agarra={<EnMano.esponja />} agarraAng={-35} reaccion="ojos" reaccionT0={583.05} />
      <Canaleta t={t} />
      {[0, 1, 2].map((i) => { const k = ((t * 0.8 + i / 3) % 1); return <svg key={i} style={{ position: "absolute", left: 880 + i * 50, top: 300 - k * 160, opacity: Math.sin(k * Math.PI) }} width={60} height={120}><path d="M 30 110 Q 0 80 30 55 T 30 0" stroke="#7ad45a" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>; })}
      <Cuenta t={t} t0={583.01} t1={584.1} de={0} a={999} x={1460} y={470} size={220} color="#fff" suf="+" />
      <Chip t={t} t0={583.3} text="MEN BEFORE YOU" color="#1d4a24" x={1460} y={680} centro size={60} />
    </Escena>

    {/* 144 · en el año 165 las legiones trajeron algo del este: la columna vuelve por el arco y cada fuerte se pone verde */}
    <Escena t={t} t0={585.1} t1={591.2} zoom={0.02} entra="corte" golpes={[585.96, 588.7, 590.51]}>
      <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" pulsa={["SYRIA"]} t0Pulsa={588.7} />
      <Arcos t={t} desde="SYRIA" rutas={[{ a: "ROME", t0: 589.0 }, { a: "DANUBE", t0: 589.4 }, { a: "GAUL", t0: 589.8 }]} />
      <Testigo t={t} llegadas={[589.7, 590.1]} susto={590.5} />
      <Cuenta t={t} t0={585.96} t1={586.6} de={100} a={165} x={1460} y={200} size={150} color="#fff" pre="AD " />
      <Chip t={t} t0={588.7} text="FROM THE EAST" color={C.violeta} x={160} y={140} size={56} />
      <Virus t={t} t0={590.4} x={1720} y={420} r={100} />
      <Grande t={t} t0={590.51} text="A PLAGUE" x={1100} y={960} size={130} color="#c6f04a" borde="#1d4a24" />
    </Escena>

    {/* 145 · la peste antonina, probablemente viruela: dentro de la carpa, todos con fiebre */}
    <Escena t={t} t0={591.2} t1={595.9} zoom={0.03} entra="corte" golpes={[592.5, 594.55]}>
      <CarpaInterior t={t} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, rgba(122,212,90,.18), rgba(20,60,20,.4) 85%)" }} />
      <Persona x={1060} y={1030} h={470} t={t} seed={202} ropa={enfermando(0.8, CIVIL(4))} postura="sentado" giro="34" flip expr="triste" {...pose("temblar", t + 0.3)} ladea={6} />
      <Persona x={1500} y={1030} h={450} t={t} seed={203} ropa={enfermando(0.9, CIVIL(1))} postura="sentado" expr="dormido" ladea={-14} bI={10} cI={20} bD={10} cD={20} />
      {(() => {
        const c = L(520, 1030, 620);
        return <>
          <Persona x={520} y={1030} h={620} t={t} seed={101} casco="legion" ropa={ENFERMO} postura="sentado" expr="miedo" {...pose("temblar", t)} ladea={-6} reaccion="ojos" reaccionT0={594.6} />
          {[[-34, -10], [30, 14], [-10, 40], [40, -30], [-50, 30], [12, -40]].map(([dx, dy], i) => t > 592.6 + i * 0.15 && <div key={i} style={{ position: "absolute", left: c.x + dx * c.s * 1.1 - 9, top: c.y + 60 * c.s + dy * c.s * 1.1, width: 18, height: 18, borderRadius: 9, background: "#d8443a", opacity: 0.85 }} />)}
          <Emote t={t} t0={591.6} tipo="sudor" {...c} />
        </>;
      })()}
      <Virus t={t} t0={591.2} x={1560} y={420} r={110} />
      <Grande t={t} t0={592.5} text="THE ANTONINE PLAGUE" y={150} size={104} color="#fff" borde="#1d4a24" />
      <Chip t={t} t0={594.38} text="LIKELY: SMALLPOX" color={C.rojo} x={960} y={300} centro size={58} />
    </Escena>

    {/* 146 · por las mismas rutas del ejército, de campamento en campamento: la nube alcanza a la columna en dominó */}
    <Escena t={t} t0={595.9} t1={604.2} zoom={0.03} entra="corte" golpes={[597.08, 599.25, 601.38, 603.55]}>
      {t < 599.25
        ? <>
          <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" />
          <Arcos t={t} desde="SYRIA" previas={["ROME", "DANUBE", "GAUL"]} rutas={[{ a: "EGYPT", t0: 596.2 }, { a: "BRITAIN", t0: 597.4 }, { a: "SPAIN", t0: 598.0 }, { a: "AFRICA", t0: 598.5 }]} />
          <Testigo t={t} modo="tiembla" llegadas={[596.9, 598.1, 598.7, 599.2]} />
        </>
        : (() => {
          const nube = 470 + 250 * (t - 599.25);
          const av = (t - 599.25) * 60;
          return <>
            <Ruta t={t} hora="tarde" avance={av * 2} />
            {Array.from({ length: 6 }, (_, i) => {
              const x = 620 + i * 150 + av;
              const tc = 599.25 + (90 + i * 150) / 190;
              const k = prog(t, tc, tc + 0.35);
              const tos = t > tc - 0.45 && t < tc + 0.1; // tose justo antes de caer
              const hc = L(x, 950, 360);
              const r = enfermando(k > 0 ? 0.8 : 0, { ...LUCIUS, tunica: ["#d8443a", "#c83a3a", "#b8362f"][i % 3], piel: CIVIL(i + 3).piel, piel2: CIVIL(i + 3).piel2 });
              return <React.Fragment key={i}>
                <Cae x={x} y={950} k={k}>
                  <Persona x={x} y={950} h={360} t={t + i * 0.13} seed={210 + i} casco="legion" ropa={r} giro="perfil" camina={k > 0 || tos ? 0 : 1.3} expr={k > 0 ? "sorpresa" : tos ? "triste" : "neutro"}
                    inclina={tos ? 14 + Math.sin(t * 30) * 4 : 0} agarraI={k > 0.15 ? undefined : <EnMano.escudo />} agarraAngI={0} bI={40} cI={60} bD={tos ? 120 : 20} cD={tos ? 120 : 20} />
                </Cae>
                {tos && [0, 1, 2].map((j) => { const q = prog(t, tc - 0.45 + j * 0.1, tc - 0.05 + j * 0.1); return q > 0 && q < 1 && <div key={j} style={{ position: "absolute", left: hc.x + 40 + q * 70, top: hc.y + 20 - q * 30 + j * 10, width: 22 + q * 26, height: 22 + q * 26, borderRadius: "50%", background: "#9be15d", opacity: 0.85 * (1 - q) }} />; })}
                {k > 0.15 && <svg style={{ position: "absolute", left: x - 70, top: 905, overflow: "visible" }} width={10} height={10}><g transform="rotate(-8)"><rect x={0} y={0} width={64} height={40} rx={8} fill={C.rojo} stroke="#7a1414" strokeWidth={4} /><circle cx={32} cy={20} r={8} fill="#e2a531" /></g></svg>}
              </React.Fragment>;
            })}
            <Persona x={1680} y={PISO + 20} h={520} t={t} seed={1} casco="legion" giro={t > 601.0 ? "34" : "perfil"} flip={t > 601.0} camina={t > 601.0 ? 0 : 1.3}
              expr={t > 602.4 ? "miedo" : t > 601.0 ? "sorpresa" : "neutro"} bI={t > 602.4 ? 130 : 30} cI={t > 602.4 ? 130 : 40} bD={t > 602.4 ? 130 : 20} cD={t > 602.4 ? 130 : 20}
              reaccion="susto" reaccionT0={603.55} />
            <Nube t={t} x={nube} y={800} w={600} h={540} />
          </>;
        })()}
      <Chip t={t} t0={597.08} text="ALONG THE ARMY'S OWN ROADS" color={C.violeta} x={160} y={140} size={50} />
      <Chip t={t} t0={599.25} text="CAMP TO CAMP" color="#3a9a4a" x={160} y={250} size={54} />
      <Chip t={t} t0={601.38} text="SHOULDER TO SHOULDER" color={C.ambar} tinta={C.noche} x={1060} y={140} size={50} />
      <Chip t={t} t0={603.36} text="FIRST TO FALL" color={C.rojo} x={1060} y={250} size={58} />
    </Escena>

    {/* 147 · Roma tuvo que reclutar gladiadores y hasta esclavos: entran por la puerta pretoria */}
    <Escena t={t} t0={604.2} t1={610.8} zoom={0.03} entra="corte" golpes={[605.6, 607.27, 608.67, 610.13]}>
      <PuertaPretoria t={t} hora="tarde" abre={prog(t, 606.4, 607.3)} />
      {[560, 700, 1220, 1360].map((x, i) => <Persona key={x} x={x} y={905} h={300} t={t} seed={220 + i} casco="legion" ropa={enfermando(prog(t, 604.4 + i * 0.25, 605.2 + i * 0.25))} expr="triste"
        giro="34" flip={i >= 2} opacity={1 - 0.85 * prog(t, 605.0 + i * 0.3, 605.8 + i * 0.3)} bruma={0.2} />)}
      <div style={{ position: "absolute", left: 1290, top: 96, width: 520, padding: "10px 18px", borderRadius: 16, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 36, color: "#fff", border: "4px solid #fff" }}>LEGION STRENGTH<div style={{ marginTop: 8, height: 32, borderRadius: 16, background: "#4a3a5a" }}><div style={{ height: 32, borderRadius: 16, width: `${100 - 55 * prog(t, 604.4, 605.6) + 45 * prog(t, 607.3, 610.4)}%`, background: prog(t, 604.4, 605.6) > 0.5 && t < 607.3 ? C.rojo : C.lima }} /></div></div>
      <Persona x={300} y={1050} h={620} t={t} seed={1} casco="legion" giro="34" expr={t > 607.27 ? "sorpresa" : "triste"} mira={0.6}
        bD={t > 607.27 ? 40 : 10} cD={t > 607.27 ? 100 : 10} reaccion="ojos" reaccionT0={607.4} />
      {/* v5: entran CORRIENDO por la puerta, escalonados en profundidad (no en fila): gladiador, esclavo y otro que asoma */}
      {(() => {
        const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
        const g = prog(t, 607.1, 608.7), e = prog(t, 608.5, 610.5), o = prog(t, 609.7, 611.0);
        return <>
          {t > 609.7 && <Persona x={interpolate(o, [0, 1], [960, 1120])} y={interpolate(o, [0, 1], [915, 960])} h={interpolate(o, [0, 1], [430, 480])} t={t} seed={69} ropa={CIVIL(8)} expr="miedo" aparece={609.7}
            corre={1.6} giro="perfil" bruma={0.15} agarra={<M.cadena />} agarraAng={30} />}
          <Persona x={interpolate(e, [0, 1], [960, 1290])} y={interpolate(e, [0, 1], [920, 1000])} h={interpolate(e, [0, 1], [440, 560])} t={t} seed={67} ropa={CIVIL(6)} expr="triste" aparece={608.5}
            corre={e < 1 ? 1.7 : 0} giro={e < 1 ? "perfil" : "34"} flip={e >= 1} bD={30} bI={30} cD={60} cI={60} agarra={<M.cadena />} agarraAng={20} agarraI={<M.cadena />} agarraAngI={20} />
          <Persona x={interpolate(g, [0, 1], [960, 740], cl)} y={interpolate(g, [0, 1], [920, 1050], cl)} h={interpolate(g, [0, 1], [460, 640], cl)} t={t} seed={66} ropa={GLADIADOR} casco="no" expr="enojado" aparece={607.1}
            corre={g < 1 ? 1.9 : 0} giro={g < 1 ? "perfil" : "34"} flip bD={25} cD={10} bI={30} cI={50} agarra={<M.tridente />} agarraAng={-95} agarraI={<M.red />} agarraAngI={95} />
        </>;
      })()}
      <Chip t={t} t0={605.13} text="HIT SO HARD..." color={C.violeta} x={160} y={140} size={56} t1={607.0} />
      <Chip t={t} t0={607.27} text="GLADIATORS" color={C.rojo} x={700} y={300} centro size={60} />
      <Chip t={t} t0={608.67} text="EVEN SLAVES" color={C.ambar} tinta={C.noche} x={1300} y={300} centro size={60} />
      <Chip t={t} t0={609.58} text="TO REFILL THE RANKS" color={C.violeta} x={160} y={140} size={54} />
    </Escena>

    {/* 148 · ¿y si te herían? (campamento en contrapicado, se mira el brazo) */}
    <Escena t={t} t0={610.8} t1={612.1} entra="corte" golpes={[611.36]}>
      <Campamento t={t} angulo="bajo" />
      <Persona x={900} y={1080} h={760} t={t} seed={1} casco="legion" giro="34" expr="miedo" mira={0.5} miraY={0.6} bD={70} cD={90} bI={60} cI={40} reaccion="ojos" reaccionT0={611.3} />
      <Emote t={t} t0={611.0} tipo="preg" x={1380} y={560} s={1.4} />
      <Grande t={t} t0={611.17} text="GET HURT?" y={170} size={140} color="#fff" />
    </Escena>

    {/* 149 · tenían médicos de verdad, los medici, y hospitales dentro del fuerte */}
    <Escena t={t} t0={612.1} t1={618.1} zoom={0.03} entra="corte" golpes={[613.13, 614.22, 614.98, 617.01]}>
      <Campamento t={t} hora="dia" tropa={false} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + (t > 614.98 ? 0.07 * Math.sin((t - 614.98) * 12) * Math.exp(-(t - 614.98) * 4) : 0)})`, transformOrigin: "1380px 980px" }}><Hospital t={t} t0={611.6} x={1380} y={700} s={1.05} /></div>
      <Persona x={interpolate(t, [612.1, 616.8], [260, 760], { extrapolateRight: "clamp" })} y={PISO + 30} h={580} t={t} seed={1} casco="legion" giro="perfil" camina={t < 616.8 ? 1.1 : 0} expr="triste"
        bI={60} cI={110} bD={20} cD={20} agarraI={<M.venda />} agarraAngI={0} />
      <Persona x={1060} y={PISO + 30} h={620} t={t} seed={68} ropa={MEDICO} viejo giro="34" flip expr="orgullo" habla={t < 616.5} bD={t > 614.9 ? 100 : 60} cD={t > 614.9 ? 0 : 70} bI={20} cI={40} />
      <Chip t={t} t0={613.13} text="REAL DOCTORS" color={C.teal} tinta={C.noche} x={160} y={140} size={56} />
      <Grande t={t} t0={614.22} text="MEDICI" x={1300} y={150} size={120} color="#fff" borde={C.teal} />
      <Chip t={t} t0={615.48} text="HOSPITALS INSIDE THE FORTS" color={C.rojo} x={160} y={250} size={48} />
      <Chip t={t} t0={617.01} text="GENUINELY GOOD" color="#3fa34d" x={1380} y={300} centro size={52} />
    </Escena>

    {/* 150 · fórceps, bisturíes y extractores de flechas: el médico opera, el paciente muerde un palo */}
    <Escena t={t} t0={618.1} t1={623.6} zoom={0.03} entra="corte" golpes={[618.82, 620.08, 622.34]}>
      <Interior tono="#e8e0d0" />
      <div style={{ position: "absolute", left: 120, top: 360, width: 600, height: 24, borderRadius: 8, background: "#8a5a2a" }} />
      {(["pinza", "bisturi", "extractor"] as const).map((k, i) => {
        const on = i === (t < 620.08 ? 0 : t < 622.34 ? 1 : 2);
        const O = M[k];
        return <div key={k}>
          {on && <div style={{ position: "absolute", left: 220 + i * 200 - 70, top: 120, width: 140, height: 240, borderRadius: 30, background: "rgba(255,240,160,.7)" }} />}
          <svg style={{ position: "absolute", left: 220 + i * 200, top: 340, overflow: "visible" }} width={10} height={10}><g transform="rotate(-90) scale(1.05)"><O /></g></svg>
        </div>;
      })}
      <Chip t={t} t0={618.82} text="FORCEPS" color={C.teal} tinta={C.noche} x={120} y={470} size={52} />
      <Chip t={t} t0={620.08} text="SCALPELS" color={C.violeta} x={120} y={570} size={52} />
      <Chip t={t} t0={622.34} text="ARROWHEAD PULLERS" color={C.rojo} x={120} y={670} size={52} />
      {(() => {
        const herr = t < 620.08 ? <M.pinza /> : t < 622.34 ? <M.bisturi /> : <M.extractor />;
        const ida = Math.sin(t * 5);
        return <Persona x={1480} y={PISO} h={660} t={t} seed={68} ropa={MEDICO} viejo giro="34" flip expr="neutro" mira={0.5} miraY={0.9} inclina={20} bI={30} cI={40} bD={70 + ida * 6} cD={40 + ida * 10}
          agarra={<g transform="scale(0.6)">{herr}</g>} agarraAng={80} />;
      })()}
      <div style={{ position: "absolute", left: 860, top: 820, width: 900, height: 40, borderRadius: 10, background: "#8a5a2a" }} />
      {[900, 1700].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 860, width: 30, height: 140, background: "#6b3a1f" }} />)}
      {/* v5: paciente ACOSTADO DE PERFIL boca arriba sobre la mesa (cabeza a la izquierda), mordiendo un palo */}
      {(() => {
        const PX = 1640, PY = 792, PH = 520; // pies en (PX, PY) antes de rotar
        const c = L(PX, PY, PH);
        const mx = c.x + 56 * c.s, my = c.y + 62 * c.s; // boca (perfil mira a la derecha → tras rotar mira arriba)
        return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "rotate(-90deg)", transformOrigin: `${PX}px ${PY}px`, clipPath: `inset(0px 0px ${1080 - PY + 2}px 0px)` }}>
          <Persona x={PX} y={PY} h={PH} t={t} seed={1} casco="no" plano giro="perfil" expr="miedo" bI={6} cI={10} bD={10 + Math.sin(t * 9) * 4} cD={10} reaccion="ojos" reaccionT0={622.45} />
          <div style={{ position: "absolute", left: mx - 30, top: my - 9, width: 74, height: 18, borderRadius: 9, background: "#a8703a", border: "3px solid #6b3a1f" }} />
        </div>;
      })()}
      <Casco x={1010} y={975} s={0.3} rot={8} />
      <Emote t={t} t0={618.3} tipo="sudor" x={1240} y={640} s={0.9} />
      {(() => {
        const sale = prog(t, 622.4, 622.9);
        return <svg style={{ position: "absolute", left: 1330 - sale * 170, top: 770 - sale * 120, overflow: "visible", opacity: 1 - prog(t, 623.1, 623.4) }} width={20} height={20}><g transform="rotate(130)"><rect x={-6} y={-10} width={12} height={130} fill="#8a5a2a" /><path d="M -6 120 L -26 150 L -6 142 Z M 6 120 L 26 150 L 6 142 Z" fill="#e8e0d0" /></g><path d="M -20 0 L 0 -40 L 20 0 Z" fill="#7d8796" transform="translate(4 18)" /></svg>;
      })()}
    </Escena>

    {/* 151 · lo que no tenían: calmantes, ni idea de qué era una infección */}
    <Escena t={t} t0={623.6} t1={629.86} zoom={0.02} entra="corte" golpes={[625.88, 628.53]}>
      <Interior tono="#e8e0d0" />
      <div style={{ position: "absolute", left: 250, top: 900, width: 260, height: 26, borderRadius: 8, background: "#a8622c" }} />
      {[270, 470].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 926, width: 20, height: 74, background: "#6b3a1f" }} />)}
      <Persona x={380} y={PISO} h={600} t={t} seed={1} casco="legion" postura="sentado" giro="34" expr={t > 625.5 ? "enojado" : "triste"} ladea={-6} bI={20} cI={20} bD={70} cD={20} mira={0.6} inclina={-4}
        reaccion="susto" reaccionT0={625.9} />
      <Persona x={720} y={PISO} h={600} t={t} seed={68} ropa={MEDICO} viejo postura="agachado" giro="34" flip expr="neutro" mira={0.6} miraY={0.5} bD={80 + Math.sin(t * 7) * 14} cD={40 + Math.cos(t * 7) * 20} bI={70} cI={60}
        agarra={<M.venda />} agarraAng={0} />
      <Emote t={t} t0={623.8} tipo="sudor" {...L(380, PISO, 560)} />
      <Falta t={t} t0={625.5} x={1170} y={600} s={0.66} tx={626.3} txt="PAINKILLERS" icono={<svg width={300} height={300} viewBox="-150 -150 300 300"><g transform="rotate(-35)"><rect x={-120} y={-50} width={240} height={100} rx={50} fill="#fff" stroke="#2a1530" strokeWidth={10} /><path d="M 0 -50 L 0 50" stroke="#2a1530" strokeWidth={10} /><path d="M -120 -50 L 0 -50 L 0 50 L -70 50 Q -120 50 -120 0 Z" fill={C.rojo} /></g></svg>} />
      <Falta t={t} t0={628.2} x={1590} y={600} s={0.66} tx={628.86} txt="INFECTION?" icono={<Virus t={t} x={150} y={150} r={90} />} />
      <Chip t={t} t0={623.63} text="WHAT THEY DID NOT HAVE" color={C.violeta} x={1380} y={140} centro size={54} />
    </Escena>

    {/* 152 · un corte chico con espada de práctica en un día caluroso en África: DAY 1 → 3 → 7 */}
    <Escena t={t} t0={629.86} t1={636.1} zoom={0.03} entra="corte" golpes={[630.46, 633.01, 633.88, 635.36]}>
      <PlazaArmas t={t} />
      <Calor t={t} y={560} op={0.3} />
      <div style={{ position: "absolute", left: 1720, top: 40, width: 150, height: 150, borderRadius: 75, background: "#ffe066", boxShadow: "0 0 0 26px rgba(255,220,90,.35), 0 0 0 54px rgba(255,220,90,.15)" }} />
      {(() => {
        const pelea = t < 630.7;
        const sick = t > 633.6;
        const k7 = prog(t, 633.6, 634.3);
        return <>
          <Persona x={700} y={1040} h={580} t={t} seed={2} casco="legion" ropa={COMPA} giro="34" flip expr={pelea ? "enojado" : "sorpresa"}
            {...(pelea ? pose("golpear", t, 1.4) : { bD: 40, cD: 20, bI: 30, cI: 60 })} agarra={<EnMano.gladius madera />} agarraAng={pelea ? -20 : 60} />
          <Persona x={330} y={1040} h={620} t={t} seed={yo(enfermando(sick ? k7 : 0))} casco="legion" ropa={enfermando(sick ? k7 : 0)} giro={sick ? "frente" : "34"} expr={sick ? "triste" : t > 630.5 ? "sorpresa" : "enojado"}
            {...(pelea ? pose("golpear", t + 0.5, 1.4) : sick ? pose("temblar", t) : { bI: 70, cI: 100, bD: 20, cD: 20 })} ladea={sick ? 8 : 0}
            agarra={sick ? undefined : <EnMano.gladius madera />} agarraAng={pelea ? -20 : 80} reaccion={sick ? "derrite" : undefined} reaccionT0={634.5} />
          {t > 630.46 && t < 630.75 && <div style={{ position: "absolute", left: 420, top: 600, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle, #fff, rgba(255,255,255,0) 70%)" }} />}
          {sick && <Emote t={t} t0={633.9} tipo="sudor" {...L(330, 1040, 620)} />}
          {/* v5: ZOOM AL DEDO en el cielo (no sobre la torre): DAY 1 corte rojo, DAY 3 verde hinchado, DAY 7 negro */}
          {([[1, 629.5, "#f2b48a", "#d8443a", "#fff3d6", "#2a1530", "#fff"], [3, 632.4, "#c9cf7a", "#5fae2e", "#eef6d0", "#1d4a24", "#c6f04a"], [7, 633.6, "#5a4a52", "#141018", "#3a3040", "#141018", "#ff6a6a"]] as const).map(([dia, t0, piel, herida, fondo, chip, tinta], i) => {
            const cx = 960 + i * 290, cy = 290;
            if (t < t0) return <div key={dia} style={{ position: "absolute", left: cx - 120, top: cy - 120, width: 240, height: 240, borderRadius: 120, border: "10px dashed rgba(42,21,48,.45)", background: "rgba(255,255,255,.3)", boxSizing: "border-box", fontFamily, fontWeight: 700, fontSize: 96, color: "rgba(42,21,48,.5)", textAlign: "center", lineHeight: "220px" }}>?</div>;
            const late = dia === 1 ? 1 : 1 + 0.06 * Math.sin(t * 6); // la herida late
            const hinch = dia === 3 ? 1.12 : dia === 7 ? 1.06 : 1;
            return <div key={dia} style={{ position: "absolute", left: cx - 135, top: cy - 135, width: 270, height: 400, transform: `scale(${ent(t, t0)})` }}>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={270} height={270} viewBox="-135 -135 270 270">
                <defs><clipPath id={`dedo${dia}`}><circle r={123} /></clipPath></defs>
                <circle r={129} fill={fondo} stroke="#2a1530" strokeWidth={12} />
                <g clipPath={`url(#dedo${dia})`}>
                  <g transform={`rotate(-28) scale(${hinch} 1)`}>
                    <rect x={-190} y={-52} width={290} height={104} rx={52} fill={piel} stroke="rgba(42,21,48,.35)" strokeWidth={5} />
                    <path d="M 40 -30 Q 82 -30 84 0 Q 82 30 40 30 Z" fill="rgba(255,255,255,.55)" stroke="rgba(42,21,48,.3)" strokeWidth={4} />
                    {[-60, -120].map((xx) => <path key={xx} d={`M ${xx} -30 Q ${xx + 8} 0 ${xx} 30`} stroke="rgba(42,21,48,.25)" strokeWidth={4} fill="none" />)}
                    {dia > 1 && <ellipse cx={-25} cy={0} rx={70 * late} ry={44 * late} fill={herida} opacity={0.45} />}
                    <path d="M -60 -10 L 10 12" stroke={herida} strokeWidth={dia === 1 ? 10 : 14} strokeLinecap="round" />
                    {dia === 1 && <circle cx={-14} cy={20 + 14 * ((t * 1.2) % 1)} r={7} fill={herida} />}
                    {dia === 3 && [[-40, -18], [-6, 18], [-28, 14]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={7} fill="#e8f07a" />)}
                  </g>
                </g>
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, top: 288, textAlign: "center" }}>
                <span style={{ padding: "6px 22px", borderRadius: 16, background: chip, fontFamily, fontWeight: 700, fontSize: 48, color: tinta }}>DAY {dia}</span>
              </div>
            </div>;
          })}
          {t >= 635.2 && <Craneo x={1730} y={330} s={0.6} t={t} t0={635.2} />}
        </>;
      })()}
      <Chip t={t} t0={629.86} text="A SMALL CUT" color={C.rojo} x={160} y={140} size={58} t1={633.7} />
      <Chip t={t} t0={632.46} text="HOT DAY · AFRICA" color={C.ambar} tinta={C.noche} x={160} y={250} size={54} t1={633.7} />
      <Chip t={t} t0={633.88} text="COULD KILL YOU" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={635.36} text="= A BATTLE" color={C.violeta} x={1250} y={600} centro size={60} />
    </Escena>

    {/* 153 · al menos la comida era regular (dentro de la carpa, salta con el cuenco) */}
    <Escena t={t} t0={636.1} t1={637.9} entra="corte" golpes={[637.15]}>
      <CarpaInterior t={t} />
      <Persona x={960} y={1050} h={640} t={t} seed={1} casco="legion" expr="feliz" salta={637.1} bD={60} cD={60} bI={150} cI={20} agarra={<M.cuenco />} agarraAng={0} reaccion="ojos" reaccionT0={637.15} />
      <Grande t={t} t0={636.67} text="AT LEAST... FOOD" y={180} size={120} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 154 · trigo molido a mano con un molino de piedra compartido por la carpa: uno echa el grano, él gira la manija */}
    <Escena t={t} t0={637.9} t1={644.25} zoom={0.03} entra="corte" golpes={[639.24, 641.39, 642.65, 643.53]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Persona x={1500} y={880} h={340} t={t} seed={142} casco="no" ropa={CIVIL(3)} giro="34" flip expr="dormido" bD={40} cD={90} bI={10} cI={20} ladea={8} agarra={<M.cuenco />} agarraAng={0} />
      <Persona x={1640} y={880} h={350} t={t} seed={143} casco="no" ropa={CIVIL(4)} giro="34" flip expr="feliz" habla bD={45} cD={90} agarra={<M.cuenco />} agarraAng={0} />
      <Persona x={1760} y={880} h={330} t={t} seed={144} casco="no" ropa={CIVIL(5)} giro="espalda" bD={10} bI={10} />
      <Saco x={250} y={PISO} s={1.0} />
      {(() => {
        const g = (t - 637.9) * Math.PI * 2 * 0.62;
        const a = 50 + 22 * Math.cos(g);
        const S = 1, px = 640, sx = px + 66 * S, sy = PISO - 322 * S;
        const hx = sx + 178 * S * Math.sin((a * Math.PI) / 180), hy = sy + 178 * S * Math.cos((a * Math.PI) / 180);
        const vierte = t > 640.0;
        return <>
          <Persona x={1120} y={PISO} h={560} t={t} seed={141} casco="no" ropa={CIVIL(2)} giro="34" flip expr="neutro" mira={0.6} miraY={0.6} inclina={6}
            bD={vierte ? 95 : 40} cD={vierte ? 40 : 80} bI={30} cI={60} agarra={<EnMano.bolsa />} agarraAng={vierte ? 150 : 80} />
          {vierte && Array.from({ length: 8 }, (_, i) => { const k = (t * 2 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 868 + Math.sin(i * 3) * 10, top: 770 + k * 90, width: 10, height: 14, borderRadius: 6, background: "#e0a82a", opacity: 1 - k * 0.6 }} />; })}
          <Molino t={t} x={840} y={935} s={1.1} g={g} hx={hx} hy={hy} />
          <Persona x={px} y={PISO} h={560} t={t} seed={1} casco="legion" expr={t > 642 ? "triste" : "neutro"} mira={0.7} miraY={0.7} bD={a - 2 * Math.sin(t * 1.5 + 1)} cD={0} bI={30} cI={50} />
        </>;
      })()}
      {t > 642 && <Emote t={t} t0={642.1} tipo="sudor" {...L(640, PISO, 560)} />}
      <Chip t={t} t0={639.24} text="WHEAT" color={C.ambar} tinta={C.noche} x={250} y={700} centro size={56} />
      <Chip t={t} t0={640.15} t1={642.0} text="GROUND BY HAND" color={C.rojo} x={160} y={140} size={56} />
      <Chip t={t} t0={642.32} text="STONE MILL" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={643.15} text="SHARED BY THE TENT" color={C.teal} tinta={C.noche} x={1240} y={330} size={48} />
    </Escena>

    {/* 155 · pan o papilla */}
    <Escena t={t} t0={644.25} t1={647.2} zoom={0.02} entra="corte" golpes={[644.96, 646.36]}>
      <Interior tono="#e0c79a" />
      <div style={{ position: "absolute", left: 300, top: 760, width: 1320, height: 40, borderRadius: 10, background: "#a8622c", boxShadow: "0 14px 0 #7a4520" }} />
      {[340, 1540].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 800, width: 30, height: 200, background: "#6b3a1f" }} />)}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${t < 644.4 ? 0.85 : ent(t, 644.4) * 0.15 + 0.85})`, transformOrigin: "520px 560px" }}><Pan x={520} y={560} s={2.0} /></div>
      <Comida k="porridge" x={1400} y={600} s={1.4} t={t} t0={645.9} />
      <Persona x={960} y={PISO + 30} h={620} t={t} seed={1} casco="legion" giro="34" flip={t < 645.7} expr="feliz" mira={0.6} bD={70} cD={60} bI={20} cI={40} reaccion="ojos" reaccionT0={646.4} />
      <Chip t={t} t0={644.96} text="BREAD" color={C.ambar} tinta={C.noche} x={520} y={880} centro size={60} />
      <Grande t={t} t0={645.53} text="OR" y={200} size={120} color={C.rojo} />
      <Chip t={t} t0={646.36} text="PORRIDGE" color={C.violeta} x={1400} y={880} centro size={60} />
    </Escena>

    {/* 156 · tocino, queso, lentejas y posca: la mesa de la carpa, el protagonista prueba la posca */}
    <Escena t={t} t0={647.2} t1={654.1} zoom={0.03} entra="corte" golpes={[647.55, 648.48, 649.27, 650.6, 652.05]}>
      <Interior tono="#e0c79a" ventana={false} />
      {t < 650.6 && <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 300, borderRadius: 20, background: "#5a3418", border: "10px solid #8a5a2a", opacity: t > 650.3 ? 1 - (t - 650.3) / 0.3 : 1, fontFamily, fontWeight: 700, fontSize: 40, color: "#f6e3b4", textAlign: "center", paddingTop: 8, boxSizing: "border-box" }}>TODAY'S RATIONS</div>}
      <Comida k="tocino" x={560} y={215} s={0.7} t={t} t0={647.55} t1={650.3} />
      <Comida k="queso" x={960} y={215} s={0.7} t={t} t0={648.48} t1={650.3} />
      <Comida k="lentejas" x={1360} y={225} s={0.7} t={t} t0={649.27} t1={650.3} />
      {([[647.55, "BACON", 560], [648.48, "CHEESE", 960], [649.27, "LENTILS", 1360]] as const).map(([t0, txt, x]) => <Chip key={txt} t={t} t0={t0} t1={650.0} text={txt} color={C.violeta} x={x} y={325} centro size={40} />)}
      {[0, 1, 2, 4, 5, 6, 3].map((i) => {
        const x = 330 + i * 210;
        const soy = i === 3;
        const bebe = soy && t > 650.6;
        const agrio = soy && t > 652.05;
        return <Persona key={x} x={x} y={980} h={500} t={t} seed={soy ? 1 : 150 + i} casco={soy ? "legion" : "no"} ropa={soy ? LUCIUS : CIVIL(i + 2)}
          giro={soy ? "frente" : i === 1 || i === 5 ? "34" : "frente"} flip={i === 5}
          expr={agrio ? "enojado" : soy ? "feliz" : i % 3 === 0 ? "feliz" : "neutro"} mira={soy ? 0 : i < 3 ? 0.7 : -0.7} habla={!soy && i % 2 === 1}
          {...(bebe ? { bI: 30, cI: 90, bD: agrio ? 95 : 125, cD: agrio ? 10 : 125 } : pose("comer", t + i * 0.37, 0.8))}
          agarra={bebe ? <M.jarra /> : undefined} agarraAng={agrio ? -30 : -50} inclina={agrio ? -6 : 0} reaccion={agrio ? "ojos" : undefined} reaccionT0={652.1} />;
      })}
      <div style={{ position: "absolute", left: 180, top: 760, width: 1560, height: 44, borderRadius: 12, background: "#a8622c" }} />
      <div style={{ position: "absolute", left: 200, top: 804, width: 1520, height: 110, background: "#c9773a", borderRadius: "0 0 16px 16px", boxShadow: "inset 0 14px 0 rgba(0,0,0,.15)" }} />
      {[240, 1650].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 914, width: 34, height: 90, background: "#7a4520" }} />)}
      {[330, 540, 750, 1170, 1380, 1590].map((x, i) => <Comida key={x} k={i % 3 === 0 ? "lentejas" : i % 3 === 1 ? "queso" : "tocino"} x={x} y={745} s={0.36} />)}
      {t > 652.05 && <Emote t={t} t0={652.1} tipo="enojo" {...L(960, 980, 500)} />}
      {t > 652.05 && [0, 1, 2].map((i) => { const k = ((t * 1.2 + i / 3) % 1); return <svg key={i} style={{ position: "absolute", left: 1040 + i * 40, top: 470 - k * 100, opacity: Math.sin(k * Math.PI) }} width={50} height={90}><path d="M 25 85 Q 0 60 25 40 T 25 0" stroke="#9ad45a" strokeWidth={8} fill="none" strokeLinecap="round" /></svg>; })}
      <Grande t={t} t0={650.6} text="POSCA" y={200} size={120} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={652.05} text="SOUR WINE + WATER" color={C.rojo} x={960} y={340} centro size={46} />
    </Escena>

    {/* 157 · nada glamoroso, pero llegaba todos los días: más de lo que podía decir un granjero */}
    <Escena t={t} t0={654.1} t1={659.62} zoom={0.03} entra="corte" golpes={[654.32, 656.58, 658.25]}>
      <Campo t={t} seco />
      <Calendario t={t} t0={654.4} x={560} y={570} s={0.9} />
      <Persona x={1120} y={PISO + 20} h={600} t={t} seed={1} casco="legion" giro="34" expr={t > 658.3 ? "sorpresa" : "feliz"} {...pose("comer", t, 0.8)} agarraI={<M.cuenco />} agarraAngI={0} />
      <Persona x={1460} y={PISO + 20} h={560} t={t} seed={69} ropa={CIVIL(4)} giro="34" flip expr="triste" aparece={657.9} mira={0.8} bD={50} cD={70} agarra={<M.cuenco />} agarraAng={0} />
      <Emote t={t} t0={658.3} tipo="lagrimas" {...L(1460, PISO + 20, 560)} />
      <Chip t={t} t0={654.32} text="NOT GLAMOROUS" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={658.25} text="MOST FARMERS: NOT SO LUCKY" color={C.rojo} x={1000} y={270} size={44} />
    </Escena>
  </>
);

// arcos de contagio gruesos verde enfermo; en la punta viaja la columna que vuelve (3 escuditos rojos con un virus) y el
// fuerte se pone verde con un pop al llegar
function Arcos({ t, desde, rutas, previas = [] }: { t: number; desde: string; rutas: { a: string; t0: number }[]; previas?: string[] }) {
  const o = lugar(desde);
  const todas = [...previas.map((a) => ({ a, t0: -9 })), ...rutas];
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      {todas.map(({ a, t0 }) => {
        if (t < t0) return null;
        const l = lugar(a);
        const mx = (o.x + l.x) / 2, my = Math.min(o.y, l.y) - 140;
        const u = t0 < 0 ? 1 : prog(t, t0, t0 + 0.7);
        const verde = u >= 1;
        const s = u;
        const cx = (1 - s) * (1 - s) * o.x + 2 * (1 - s) * s * mx + s * s * l.x, cy = (1 - s) * (1 - s) * o.y + 2 * (1 - s) * s * my + s * s * l.y;
        const kp = t0 < 0 ? 1 : Math.min(1, Math.max(0, (t - t0 - 0.7) / 0.35));
        const pop = verde ? 1 + 0.9 * Math.sin(kp * Math.PI) : 0.85;
        return (
          <g key={a}>
            <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${l.x} ${l.y}`} stroke="#1d4a24" strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
            <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${l.x} ${l.y}`} stroke="#9be15d" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
            <g transform={`translate(${l.x} ${l.y}) scale(${pop * 1.25})`}>
              <path d="M -34 10 L -34 -30 L -22 -30 L -22 -20 L -10 -20 L -10 -30 L 10 -30 L 10 -20 L 22 -20 L 22 -30 L 34 -30 L 34 10 Z" fill={verde ? "#7ad45a" : "#c9a36a"} stroke="#1d1240" strokeWidth={5} />
              {verde && <circle r={44 + ((t * 40) % 20)} fill="none" stroke="#9be15d" strokeWidth={4} opacity={0.6} />}
              {verde && kp < 1 && <circle r={40 + kp * 70} fill="none" stroke="#c6f04a" strokeWidth={10 * (1 - kp)} />}
            </g>
            {u > 0 && u < 1 && <g transform={`translate(${cx} ${cy})`}>
              {[-26, 0, 26].map((d, i) => <g key={i} transform={`translate(${d} ${Math.sin(t * 14 + i) * 3})`}><rect x={-10} y={-16} width={20} height={28} rx={5} fill={C.rojo} stroke="#fff" strokeWidth={3} /><circle cx={0} cy={-24} r={8} fill="#e2a531" /></g>)}
              <circle cx={44} cy={-20} r={12} fill="#7ad45a" stroke="#1d4a24" strokeWidth={4} />
            </g>}
          </g>
        );
      })}
    </svg>
  );
}
