import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL, LUCIUS, Ropa } from "./persona";
import { C, fontFamily, ent, prog, Escena, Colinas, Chip, Grande, MapaPuntos, Particulas, Rayos, Emote, cabeza, Pan, Tienda, lugar } from "./kit";
import { Gladius, Esponja, Instrumento, Comida, Soldadito, Craneo, Fuerte, Calor, Mula } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Ruta, Campo, Tablero, pose } from "./kit3";

// Parte 5 (547,17-659,62 s): trampa 5, el campamento: fiebre, letrinas, la peste antonina, los medici y la comida.
// v3 (ojo del director): el protagonista (casco dorado, seed 1, LUCIUS) HACE lo que se narra en cada escena, en un lugar
// real y presente desde el t0; pies a y≈1000 (sobre el HUD y dentro del cuadro con el empuje de cámara).
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const PISO = 1000;
const ENFERMO: Ropa = { ...LUCIUS, piel: "#cfe0a0", piel2: "#a8c070" };
const MEDICO: Ropa = { tunica: "#f2efe6", tunica2: "#cfc8b8", cinto: "#3a9a4a", piel: "#e0a07a", piel2: "#c07a5a", pelo: "#6a6a6a" };
const GLADIADOR: Ropa = { tunica: "#8a5a2a", tunica2: "#5a3418", cinto: "#2a1a10", piel: "#c98a5a", piel2: "#a86a40", pelo: "#1a1010" };
// mezcla dos colores hex (para que la piel se ponga verde de a poco)
const mezcla = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const enfermando = (k: number): Ropa => (k <= 0 ? LUCIUS : { ...LUCIUS, piel: mezcla(LUCIUS.piel, ENFERMO.piel, k), piel2: mezcla(LUCIUS.piel2, ENFERMO.piel2, k) });
// el protagonista es seed 1; si lleva otra piel (enfermo) usa seed 101 para que su degradé #pNpiel no choque con el de la escena vecina
const yo = (r: Ropa = LUCIUS) => (r === LUCIUS ? 1 : 101);

// objetos en la mano (coordenadas de la mano: +y sigue al antebrazo, +x apunta "arriba" con el brazo al frente)
const EspadaMano: React.FC<{ madera?: boolean }> = ({ madera }) => (
  <g transform="rotate(-90)">
    <rect x={-10} y={-14} width={20} height={44} rx={6} fill="#6b3a1f" />
    <rect x={-30} y={-26} width={60} height={14} rx={6} fill={madera ? "#8a5a2a" : "#d9962e"} />
    <path d="M -12 -26 L 12 -26 L 10 -190 L 0 -214 L -10 -190 Z" fill={madera ? "#b07a3e" : "#dfe4ec"} stroke={madera ? "#7a4a22" : "#8a93a3"} strokeWidth={4} />
  </g>
);
const Tridente: React.FC = () => (
  <g transform="rotate(0)">
    <rect x={-7} y={-300} width={14} height={420} rx={6} fill="#7a4a22" />
    <path d="M -46 -300 L -46 -380 M 0 -300 L 0 -400 M 46 -300 L 46 -380 M -50 -300 L 50 -300" stroke="#c8ccd4" strokeWidth={12} strokeLinecap="round" fill="none" />
  </g>
);
const Red: React.FC = () => (
  <g transform="translate(0 20)">
    <path d="M -60 0 Q 0 30 60 0 L 70 150 Q 0 180 -70 150 Z" fill="rgba(230,220,190,.35)" stroke="#e8dcb8" strokeWidth={4} />
    {[-40, -10, 20, 50].map((x) => <line key={x} x1={x} y1={6} x2={x * 1.1} y2={160} stroke="#e8dcb8" strokeWidth={3} />)}
    {[40, 80, 120].map((y) => <line key={y} x1={-66} y1={y} x2={66} y2={y} stroke="#e8dcb8" strokeWidth={3} />)}
  </g>
);
const Cuenco: React.FC = () => (
  <g transform="rotate(-90) translate(0 -10)">
    <path d="M -60 -10 L 60 -10 Q 56 50 0 54 Q -56 50 -60 -10 Z" fill="#a8622c" stroke="#6b3a1f" strokeWidth={5} />
    <ellipse cx={0} cy={-10} rx={60} ry={14} fill="#f2e4c0" />
  </g>
);
const Jarra: React.FC = () => (
  <g transform="rotate(-90) translate(0 -20)">
    <path d="M -34 -70 L 34 -70 L 42 40 Q 0 66 -42 40 Z" fill="#c9773a" stroke="#7a3d14" strokeWidth={5} />
    <ellipse cx={0} cy={-70} rx={34} ry={10} fill="#8a3a4a" />
  </g>
);
const EsponjaMano: React.FC = () => (
  <g transform="rotate(90)">
    <rect x={-8} y={-280} width={16} height={330} rx={6} fill="#8a5a2a" />
    <ellipse cx={0} cy={-310} rx={52} ry={42} fill="#e8c86a" />
    {[[-18, -322], [14, -300], [24, -330], [-14, -296]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={8} fill="#a8a43a" />)}
  </g>
);

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
const Hospital: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 300 * s, top: y - 300 * s, overflow: "visible", transform: `scale(${ent(t, t0)})`, transformOrigin: "50% 100%" }} width={600 * s} height={600 * s} viewBox="-300 -300 600 600">
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
      <div style={{ position: "absolute", left: 20, right: 20, top: 430, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: "#2a1530" }}>{txt}</div>
    </div>
  );
};
// calendario que tacha días
const Calendario: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x - 330, top: y - 300, width: 660, height: 600, borderRadius: 30, background: "#fff", border: "10px solid #2a1530", transform: `scale(${ent(t, t0) * s})`, overflow: "hidden" }}>
    <div style={{ height: 100, background: C.rojo, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", textAlign: "center", lineHeight: "100px" }}>EVERY DAY</div>
    {Array.from({ length: 28 }, (_, i) => {
      const on = t > t0 + 0.3 + i * 0.12;
      return <div key={i} style={{ position: "absolute", left: 24 + (i % 7) * 88, top: 124 + Math.floor(i / 7) * 115, width: 76, height: 96, borderRadius: 14, background: on ? "#effbe8" : "#f2ecf8", fontFamily, fontWeight: 700, fontSize: 52, color: "#3fa34d", textAlign: "center", lineHeight: "96px" }}>{on ? "✓" : ""}</div>;
    })}
  </div>
);
// letrina en corte: banco largo con agujeros (va DETRÁS de los sentados: sus piernas caen por delante), canaleta con agua al pie
const BancoLetrina: React.FC<{ t: number; y: number; x0?: number; x1?: number; agujeros: number[] }> = ({ t, y, x0 = 110, x1 = 1810, agujeros }) => (
  <>
    <div style={{ position: "absolute", left: x0, width: x1 - x0, top: y, height: 32, borderRadius: 10, background: "#e8dcc4", boxShadow: "0 6px 0 #b5a48a" }} />
    <div style={{ position: "absolute", left: x0 + 10, width: x1 - x0 - 20, top: y + 32, height: PIE - y - 32, background: "#c9b8a0", overflow: "hidden" }}>
      {agujeros.map((x) => <div key={x} style={{ position: "absolute", left: x - x0 - 10 - 34, top: 10, width: 68, bottom: 0, borderRadius: "34px 34px 0 0", background: "#2a1a10", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "#2f86b0" }} />
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 40 + t * 90) % 100) - 30, bottom: 14 + i * 10, width: 30, height: 6, borderRadius: 3, background: "rgba(255,255,255,.6)" }} />)}
      </div>)}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: PIE, bottom: 0, background: "#a88a62" }} />
  </>
);
const Canaleta: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: PIE + 16, height: 46, background: "linear-gradient(180deg,#4fb3e8,#2f86b0)", overflow: "hidden", borderTop: "6px solid #8a7a64" }}>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 190 + t * 320) % 2200) - 140, top: 8 + (i % 3) * 10, width: 110, height: 8, borderRadius: 4, background: "rgba(255,255,255,.6)" }} />)}
  </div>
);
const PIE = 955;
// alto de Persona para que la cadera quede sobre el asiento (y) con los pies en PIE
const hSentado = (y: number) => ((PIE - y) / 190) * 560;
// molino de mano: dos piedras; la de arriba gira (marcas que dan la vuelta) y la manija sube hasta la MANO (hx, hy absolutos)
const Molino: React.FC<{ t: number; x: number; y: number; s?: number; g: number; hx: number; hy: number }> = ({ t, x, y, s = 1, g, hx, hy }) => {
  const top = y - 66 * s;
  return (
    <>
      <svg style={{ position: "absolute", left: x - 200 * s, top: y - 200 * s, overflow: "visible" }} width={400 * s} height={300 * s} viewBox="-200 -200 400 300">
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
    <path d="M -90 0 Q -110 -120 -60 -170 L 60 -170 Q 110 -120 90 0 Z" fill="#d9b27a" stroke="#8a5a2a" strokeWidth={6} />
    <ellipse cx={0} cy={-170} rx={62} ry={18} fill="#f2c84a" />
    {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-45 + (i % 5) * 22} cy={-178 - Math.floor(i / 5) * 10} rx={8} ry={12} fill="#e0a82a" />)}
    <text x={0} y={-60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#8a5a2a">SPQR</text>
  </svg>
);
// protagonista que señala el mapa (abajo a la izquierda, parado sobre una lomita)
const Guia: React.FC<{ t: number; expr?: "miedo" | "sorpresa" | "triste"; x?: number }> = ({ t, expr = "miedo", x = 300 }) => (
  <>
    <div style={{ position: "absolute", left: x - 200, top: PISO - 30, width: 400, height: 90, borderRadius: "50%", background: "#3a2a78", boxShadow: "0 -6px 0 #5b48a8 inset" }} />
    <Persona x={x} y={PISO} h={460} t={t} seed={1} casco="legion" expr={expr} bD={130 + Math.sin(t * 3) * 6} cD={10} bI={20} cI={60} mira={0.8} />
  </>
);

export const P5: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 136 · trampa cinco: el campamento */}
    <Escena t={t} t0={547.17} t1={549.5} entra="corte" golpes={[547.41, 548.6]}>
      <Tablero t={t} t0={546.8} en={4} de={3} tAvanza={547.3} marca={548.2} hecho={4} />
      <Chip t={t} t0={547.41} text="TRAP 5 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={548.6} text="THE CAMP" x={900} y={400} size={130} />
    </Escena>

    {/* 137 · algo que las películas nunca te muestran: pantalla dividida, el héroe del cine vs. el soldado real con fiebre */}
    <Escena t={t} t0={549.5} t1={551.6} zoom={0.02} entra="corte" golpes={[550.51]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      {/* izquierda: la sala de cine */}
      <div style={{ position: "absolute", left: 130, top: 230, width: 720, height: 520, borderRadius: 16, border: "18px solid #2a2a2a", overflow: "hidden", background: "linear-gradient(180deg, #ffd27a, #e2557a)" }}>
        <div style={{ position: "absolute", left: -600, top: -200 }}><Rayos t={t} x={960} y={500} color="#fff6c8" op={0.3} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "#a8417a" }} />
        <Persona x={360} y={470} h={400} t={t} seed={1} casco="legion" expr="orgullo" {...pose("festejar", t, 0.6)} manoD={<EspadaMano />} />
        <Emote t={t} t0={549.5} tipo="brillos" {...L(360, 470, 400)} s={0.9} />
      </div>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 90, top: 200, width: 46, height: 22, borderRadius: 6, background: "#555" }} />)}
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 90, top: 768, width: 46, height: 22, borderRadius: 6, background: "#555" }} />)}
      {/* butacas con siluetas */}
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 120, top: 830, width: 90, height: 120, borderRadius: "45px 45px 10px 10px", background: "#2a1a3a" }} />)}
      {/* derecha: la realidad, en el campamento de noche */}
      <div style={{ position: "absolute", left: 980, top: 0, width: 940, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -980, top: 0, width: 1920, height: 1080 }}><Campamento t={t} hora="noche" tropa={false} /></div>
        <Persona x={440} y={PISO} h={600} t={t} seed={101} casco="legion" ropa={ENFERMO} expr="triste" ladea={8} {...pose("temblar", t)} />
        <Emote t={t} t0={549.6} tipo="sudor" {...L(440, PISO, 600)} s={1.2} />
        <Termometro t={t} t0={549.8} x={760} y={560} s={0.6} />
      </div>
      <div style={{ position: "absolute", left: 952, top: 0, width: 28, height: 1080, background: "#fff" }} />
      <Chip t={t} t0={549.5} text="THE MOVIES" color={C.ambar} tinta={C.noche} x={490} y={130} centro size={54} />
      <Chip t={t} t0={549.75} text="REALITY" color={C.rojo} x={1420} y={130} centro size={54} />
      <Chip t={t} t0={550.51} text="NEVER SHOW YOU THIS" color={C.violeta} x={490} y={940} centro size={50} />
    </Escena>

    {/* 138 · lo más mortal no era una espada: era la fiebre */}
    <Escena t={t} t0={551.6} t1={557.96} zoom={0.03} entra="corte" golpes={[553.29, 556.25, 557.38]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      {(() => {
        const fiebre = prog(t, 557.0, 557.6);
        const enf = t > 557.2;
        return <>
          <Persona x={560} y={PISO} h={640} t={t} seed={yo(enfermando(fiebre))} casco="legion" ropa={enfermando(fiebre)} expr={enf ? "triste" : t > 556.25 ? "sorpresa" : "enojado"}
            {...(enf ? pose("temblar", t) : pose("golpear", t, 1.1))} manoD={enf ? undefined : <EspadaMano madera />} ladea={enf ? 8 : 0} />
          {/* poste de práctica */}
          {!enf && <div style={{ position: "absolute", left: 830, top: 560, width: 50, height: 440, borderRadius: 10, background: "#8a5a2a", boxShadow: "inset -12px 0 0 #6b3a1f" }} />}
          {enf && <Emote t={t} t0={557.4} tipo="sudor" {...L(560, PISO, 640)} s={1.3} />}
        </>;
      })()}
      <Chip t={t} t0={553.29} text="THE DEADLIEST THING" color={C.violeta} x={160} y={140} size={58} t1={556.9} />
      {t < 557.2 && <>
        <Gladius x={1300} y={540} s={1.3} rot={-30} t={t} t0={554.4} />
        {t > 555.75 && <svg style={{ position: "absolute", left: 1030, top: 270 }} width={540} height={540}><path d="M 50 50 L 490 490 M 490 50 L 50 490" stroke={C.rojo} strokeWidth={56} strokeLinecap="round" strokeDasharray={630} strokeDashoffset={630 * (1 - prog(t, 556.0, 556.3))} /></svg>}
        <Chip t={t} t0={556.25} text="NOT A SWORD" color={C.rojo} x={1300} y={860} centro size={60} />
      </>}
      {t >= 557.2 && <>
        <Termometro t={t} t0={557.38} x={1250} y={600} s={1.0} />
        <Grande t={t} t0={557.38} text="A FEVER" y={170} size={150} color="#fff" borde={C.rojo} />
      </>}
    </Escena>

    {/* 139 · miles de hombres en un fuerte, compartiendo agua, letrinas, carpas con una mula */}
    <Escena t={t} t0={557.96} t1={564.6} zoom={0.03} entra="corte" golpes={[557.96, 560.93, 562.01, 563.89]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b9be0,#7cc4f0 45%,#c8ecf8 80%,#fff3d6)" }} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={700} seed={111} alto={50} />
      <Fuerte x={960} y={620} s={0.95} w={1800} />
      {Array.from({ length: 70 }, (_, i) => <Soldadito key={i} x={180 + (i % 14) * 112 + (Math.floor(i / 14) % 2) * 50} y={740 + Math.floor(i / 14) * 56} s={0.72} t={t} seed={i + 20} />)}
      {t > 560.9 && (() => {
        // el contagio salta de soldado en soldado
        const n = Math.min(69, Math.floor((t - 560.9) * 18));
        return <>
          {Array.from({ length: n }, (_, k) => { const i = (k * 37) % 70; return <div key={k} style={{ position: "absolute", left: 180 + (i % 14) * 112 + (Math.floor(i / 14) % 2) * 50 - 34, top: 740 + Math.floor(i / 14) * 56 - 80, width: 68, height: 68, borderRadius: 34, background: "rgba(122,212,90,.6)" }} />; })}
          <div style={{ position: "absolute", left: 1330, top: 400, padding: "10px 26px", borderRadius: 18, background: "#1d4a24", fontFamily, fontWeight: 700, fontSize: 52, color: "#c6f04a", border: "5px solid #c6f04a" }}>SICK: {n * 70}</div>
        </>;
      })()}
      {/* el protagonista en primer plano, apretado entre la multitud, con su carpa y la mula */}
      <Mula x={1180} y={900} s={0.55} t={t} t0={563.2} />
      <Persona x={360} y={PISO} h={540} t={t} seed={yo(enfermando(prog(t, 562.6, 563.6)))} casco="legion" ropa={enfermando(prog(t, 562.6, 563.6))} expr={t > 563.3 ? "sorpresa" : t > 560.9 ? "miedo" : "neutro"} mira={t > 563.3 ? 1 : 0.4} bI={30} cI={90} bD={30} cD={90} inclina={-4} />
      <Grande t={t} t0={557.96} text="THOUSANDS OF MEN" y={150} size={110} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={560.93} text="SHARING WATER" color={C.teal} tinta={C.noche} x={160} y={280} size={48} />
      <Chip t={t} t0={562.01} text="SHARING LATRINES" color={C.ambar} tinta={C.noche} x={160} y={368} size={48} />
      <Chip t={t} t0={563.2} text="SHARING TENTS... + A MULE" color={C.rojo} x={900} y={290} size={46} />
    </Escena>

    {/* 140 · la enfermedad corría más rápido que una carga de caballería */}
    <Escena t={t} t0={564.6} t1={568.3} zoom={0.03} entra="corte" golpes={[564.6, 566.08, 567.48]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      {(() => {
        const fx = interpolate(t, [564.6, 568.2], [-300, 2200]);
        const tocado = fx > 1250;
        return <>
          {Array.from({ length: 10 }, (_, i) => { const x = 160 + i * 175; return <Soldadito key={i} x={x} y={PISO - 40} s={1.4} t={t} seed={30 + i} cae={564.6 + (x + 300) / 2500 * 3.6} />; })}
          <Persona x={1250} y={PISO} h={560} t={t} seed={yo(enfermando(tocado ? prog(t, 566.9, 567.5) : 0))} casco="legion" ropa={enfermando(tocado ? prog(t, 566.9, 567.5) : 0)} expr="miedo" camina={tocado ? 0 : 2.6} mira={-1} bI={tocado ? 120 : 30} bD={tocado ? 120 : 30} cI={tocado ? 120 : 30} cD={tocado ? 120 : 30} inclina={tocado ? 6 : 12} />
          {tocado && <Emote t={t} t0={567.0} tipo="susto" {...L(1250, PISO, 560)} />}
          <div style={{ position: "absolute", left: fx - 420, top: 380, width: 600, height: 640, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(122,212,90,.55), rgba(122,212,90,0) 70%)" }} />
          {Array.from({ length: 6 }, (_, i) => <Virus key={i} t={t} x={fx - (i % 3) * 170} y={520 + Math.floor(i / 3) * 220 + Math.sin(t * 4 + i) * 30} r={64 - (i % 3) * 10} op={0.95} />)}
        </>;
      })()}
      <Grande t={t} t0={564.6} text="DISEASE" y={150} size={140} color="#c6f04a" borde="#1d4a24" />
      <Chip t={t} t0={566.08} text="FASTER THAN ANY CAVALRY CHARGE" color={C.rojo} x={960} y={290} centro size={54} />
    </Escena>

    {/* 141 · letrinas: bancos largos de piedra con agujeros, uno al lado del otro, sin paredes */}
    <Escena t={t} t0={568.3} t1={574.3} zoom={0.03} entra="corte" golpes={[569.65, 570.6, 572.74]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <BancoLetrina t={t} y={790} agujeros={[300, 520, 740, 960, 1180, 1400, 1620]} />
      {[300, 520, 740, 960, 1180, 1400, 1620].map((x, i) => {
        const soy = i === 3;
        const lee = i === 5;
        return <Persona key={x} x={x} y={PIE} h={hSentado(790)} t={t} seed={soy ? 1 : 190 + i} casco={soy ? "legion" : "no"} ropa={soy ? LUCIUS : CIVIL(i)}
          expr={soy ? (t > 571.65 ? "miedo" : "neutro") : lee ? "neutro" : i % 2 ? "feliz" : "orgullo"}
          habla={!soy && !lee && (i === 1 || i === 2 || i === 4 || i === 6) && Math.sin(t * 1.3 + i) > -0.2}
          mira={soy ? Math.sin(t * 2.2) : lee ? 0 : i < 3 ? 0.7 : -0.7} miraY={lee ? 0.8 : 0}
          bI={lee ? 55 : 12} cI={lee ? 95 : 25} bD={lee ? 55 : 12} cD={lee ? 95 : 25}
          manoD={lee ? <g transform="rotate(-90) translate(0 -30)"><rect x={-60} y={-46} width={120} height={92} rx={8} fill="#f6e3b4" stroke="#c98f4a" strokeWidth={6} />{[0, 1, 2].map((k) => <rect key={k} x={-44} y={-28 + k * 22} width={88} height={8} rx={4} fill="#c79a5a" />)}</g> : undefined} />;
      })}
      <Canaleta t={t} />
      <Emote t={t} t0={571.7} tipo="susto" {...L(960, PIE, hSentado(790))} s={0.9} />
      <Chip t={t} t0={568.4} text="THE LATRINES" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={569.65} text="LONG STONE BENCHES" color={C.ambar} tinta={C.noche} x={160} y={250} size={52} />
      <Chip t={t} t0={571.65} text="SIDE BY SIDE" color={C.teal} tinta={C.noche} x={1240} y={140} size={52} />
      <Chip t={t} t0={572.74} text="NO WALLS" color={C.rojo} x={1240} y={250} size={60} />
    </Escena>

    {/* 142 · el agua corría abajo y para limpiarte: una esponja en un palo, compartida */}
    <Escena t={t} t0={574.3} t1={581.5} zoom={0.03} entra="corte" golpes={[574.62, 577.98, 580.91]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <BancoLetrina t={t} y={765} agujeros={[640, 1180]} />
      {(() => {
        // la esponja pasa de la mano del vecino a la del protagonista
        const pasa = prog(t, 578.6, 579.4);
        const vecinoLa = t > 577.7 && pasa <= 0;
        const yoLa = pasa >= 1;
        const h = hSentado(765);
        return <>
          <Persona x={640} y={PIE} h={h} t={t} seed={193} ropa={CIVIL(2)} expr="feliz" habla={t < 578.6} mira={0.8} bI={12} cI={25}
            bD={vecinoLa ? 70 + Math.sin(t * 5) * 6 : 12} cD={vecinoLa ? 20 : 25} manoD={vecinoLa ? <EsponjaMano /> : undefined} />
          <Persona x={1180} y={PIE} h={h} t={t} seed={1} casco="legion" expr={yoLa ? "miedo" : t > 577.98 ? "sorpresa" : "neutro"} mira={-0.8} bI={12} cI={25}
            bD={yoLa ? 45 : 12} cD={yoLa ? 10 : 25} manoD={yoLa ? <EsponjaMano /> : undefined} inclina={yoLa ? -8 : 0} />
          {pasa > 0 && pasa < 1 && <Esponja x={interpolate(pasa, [0, 1], [860, 1300])} y={520 - Math.sin(pasa * Math.PI) * 140} s={0.9} rot={20 - pasa * 20} />}
          {yoLa && <Emote t={t} t0={579.4} tipo="susto" {...L(1180, PIE, h)} />}
        </>;
      })()}
      <Canaleta t={t} />
      {t > 577.98 && <div style={{ position: "absolute", left: 1440, top: 300, padding: "10px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", border: "5px solid #e8c86a" }}>USED BY: {Math.floor((t - 577.98) * 14)}</div>}
      <Chip t={t} t0={574.62} text="WATER RAN UNDERNEATH" color={C.teal} tinta={C.noche} x={160} y={120} size={52} t1={580.6} />
      <Chip t={t} t0={577.98} text="A SPONGE ON A STICK" color={C.ambar} tinta={C.noche} x={160} y={225} size={54} t1={580.6} />
      <Grande t={t} t0={580.91} text="SHARED." y={170} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 143 · no querés saber cuántos la usaron antes que vos */}
    <Escena t={t} t0={581.5} t1={585.1} zoom={0.02} entra="corte" golpes={[583.01, 584.17]}>
      <Interior tono="#d8c8a8" ventana={false} />
      <BancoLetrina t={t} y={765} agujeros={[600]} x1={1100} />
      <Persona x={600} y={PIE} h={hSentado(765)} t={t} seed={1} casco="legion" expr="miedo" inclina={-14} bD={55} cD={0} bI={150} cI={130} mira={0.9} miraY={-0.4} manoD={<EsponjaMano />} />
      <Emote t={t} t0={582.2} tipo="susto" {...L(600, PIE, hSentado(765))} s={1.2} />
      <Canaleta t={t} />
      {/* olor verde que sube de la esponja */}
      {[0, 1, 2].map((i) => { const k = ((t * 0.8 + i / 3) % 1); return <svg key={i} style={{ position: "absolute", left: 930 + i * 50, top: 260 - k * 160, opacity: Math.sin(k * Math.PI) }} width={60} height={120}><path d="M 30 110 Q 0 80 30 55 T 30 0" stroke="#7ad45a" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>; })}
      <Cuenta t={t} t0={583.01} t1={584.1} de={0} a={999} x={1420} y={470} size={220} color="#fff" suf="+" />
      <Chip t={t} t0={583.3} text="MEN BEFORE YOU" color="#1d4a24" x={1420} y={680} centro size={60} />
    </Escena>

    {/* 144 · en el año 165 las legiones trajeron algo del este: una plaga — arcos verdes gruesos y fuertes que se contagian */}
    <Escena t={t} t0={585.1} t1={591.2} zoom={0.02} entra="corte" golpes={[585.96, 588.7, 590.51]}>
      <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" pulsa={["SYRIA"]} t0Pulsa={588.7} />
      <Arcos t={t} desde="SYRIA" rutas={[{ a: "ROME", t0: 589.0 }, { a: "DANUBE", t0: 589.4 }, { a: "GAUL", t0: 589.8 }]} />
      <Guia t={t} expr={t > 590.5 ? "sorpresa" : "miedo"} />
      <Cuenta t={t} t0={585.96} t1={586.6} de={100} a={165} x={1460} y={200} size={150} color="#fff" pre="AD " />
      <Chip t={t} t0={588.7} text="FROM THE EAST" color={C.violeta} x={160} y={140} size={56} />
      <Virus t={t} t0={590.4} x={1720} y={400} r={100} />
      <Grande t={t} t0={590.51} text="A PLAGUE" x={1100} y={960} size={130} color="#c6f04a" borde="#1d4a24" />
    </Escena>

    {/* 145 · la peste antonina, probablemente viruela */}
    <Escena t={t} t0={591.2} t1={595.9} zoom={0.03} entra="corte" golpes={[592.5, 594.55]}>
      <Campamento t={t} hora="noche" tropa={false} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, rgba(122,212,90,.3), rgba(20,60,20,.45) 80%)" }} />
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={820 + i * 160} y={PISO - 20} s={1.2} t={t} seed={80 + i} cae={i % 3 !== 1 ? 592.2 + i * 0.3 : undefined} />)}
      <Particulas t={t} tipo="luciernagas" n={30} seed={113} />
      <Virus t={t} t0={591.2} x={1340} y={650} r={165} />
      {(() => {
        const c = L(460, PISO, 620);
        return <>
          <Persona x={460} y={PISO} h={620} t={t} seed={101} casco="legion" ropa={ENFERMO} expr="miedo" {...pose("temblar", t)} ladea={-6} />
          {[[-34, -10], [30, 14], [-10, 40], [40, -30], [-50, 30], [12, -40]].map(([dx, dy], i) => t > 592.6 + i * 0.15 && <div key={i} style={{ position: "absolute", left: c.x + dx * c.s * 1.1 - 9, top: c.y + dy * c.s * 1.1 + 20, width: 18, height: 18, borderRadius: 9, background: "#d8443a", opacity: 0.85 }} />)}
          <Emote t={t} t0={591.6} tipo="sudor" {...c} />
        </>;
      })()}
      <Grande t={t} t0={592.5} text="THE ANTONINE PLAGUE" y={150} size={104} color="#fff" borde="#1d4a24" />
      <Chip t={t} t0={594.38} text="LIKELY: SMALLPOX" color={C.rojo} x={1340} y={270} centro size={58} />
    </Escena>

    {/* 146 · por las mismas rutas del ejército, de campamento en campamento */}
    <Escena t={t} t0={595.9} t1={604.2} zoom={0.03} entra="corte" golpes={[597.08, 599.25, 601.38, 603.55]}>
      {t < 599.25
        ? <>
          <MapaPuntos t={t} desde="SYRIA" brillo="#7ad45a" />
          <Arcos t={t} desde="SYRIA" previas={["ROME", "DANUBE", "GAUL"]} rutas={[{ a: "EGYPT", t0: 596.2 }, { a: "BRITAIN", t0: 597.4 }, { a: "SPAIN", t0: 598.0 }, { a: "AFRICA", t0: 598.5 }]} />
          <Guia t={t} expr="miedo" />
        </>
        : <>
          {(() => {
            // la columna marcha por la ruta; la nube verde la alcanza por atrás y los hombres caen en dominó
            const nube = interpolate(t, [599.25, 604.2], [-80, 1500]);
            return <>
              <Ruta t={t} hora="tarde" />
              {Array.from({ length: 4 }, (_, i) => <Tienda key={i} x={300 + i * 440} y={700} s={1.0} />)}
              {Array.from({ length: 9 }, (_, i) => { const x = 200 + i * 112; const cae = 599.25 + (x + 180) / (1580 / 4.95); return <Soldadito key={i} x={x} y={960} s={1.3} t={t} seed={40 + i} avanza={1} cae={cae < 604.4 ? cae : undefined} />; })}
              <Persona x={1300} y={PISO} h={540} t={t} seed={1} casco="legion" expr={t > 602.4 ? "miedo" : t > 601.0 ? "sorpresa" : "neutro"} mira={t > 601.0 ? -1 : 0.4} bI={t > 602.4 ? 120 : 10} cI={t > 602.4 ? 120 : 10} bD={t > 602.4 ? 120 : 10} cD={t > 602.4 ? 120 : 10} inclina={t > 602.4 ? 6 : 0} />
              <div style={{ position: "absolute", left: nube - 450, top: 560, width: 700, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(122,212,90,.75), rgba(122,212,90,0) 70%)" }} />
              {[0, 1, 2].map((i) => <Virus key={i} t={t} x={nube - 120 - i * 150} y={700 + (i % 2) * 140 + Math.sin(t * 4 + i) * 20} r={52} op={0.9} />)}
            </>;
          })()}
        </>}
      <Chip t={t} t0={597.08} text="ALONG THE ARMY'S OWN ROADS" color={C.violeta} x={160} y={140} size={50} />
      <Chip t={t} t0={599.25} text="CAMP TO CAMP" color="#3a9a4a" x={160} y={250} size={54} />
      <Chip t={t} t0={601.38} text="SHOULDER TO SHOULDER" color={C.ambar} tinta={C.noche} x={1060} y={140} size={50} />
      <Chip t={t} t0={603.36} text="FIRST TO FALL" color={C.rojo} x={1060} y={250} size={58} />
    </Escena>

    {/* 147 · Roma tuvo que reclutar gladiadores y hasta esclavos */}
    <Escena t={t} t0={604.2} t1={610.8} zoom={0.03} entra="corte" golpes={[605.6, 607.27, 608.67, 610.13]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <div style={{ position: "absolute", left: 1300, top: 110, width: 460, padding: "8px 16px", borderRadius: 16, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 32, color: "#fff", border: "4px solid #fff" }}>LEGION STRENGTH<div style={{ marginTop: 6, height: 28, borderRadius: 14, background: "#4a3a5a" }}><div style={{ height: 28, borderRadius: 14, width: `${100 - 55 * prog(t, 604.4, 605.6) + 45 * prog(t, 607.3, 610.4)}%`, background: prog(t, 604.4, 605.6) > 0.5 && t < 607.3 ? C.rojo : C.lima }} /></div></div>
      {Array.from({ length: 5 }, (_, i) => <Soldadito key={i} x={700 + i * 230} y={890} s={1.0} t={t} seed={60 + i} cae={i % 2 ? undefined : 604.6 + i * 0.15} />)}
      <Persona x={380} y={PISO} h={600} t={t} seed={1} casco="legion" expr={t > 607.27 ? "sorpresa" : "triste"} mira={t > 607.27 ? 1 : 0.4} bD={t > 607.27 ? 40 : 10} cD={t > 607.27 ? 100 : 10} />
      <Persona x={interpolate(t, [607.1, 608.0], [1250, 880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={PISO} h={620} t={t} seed={66} ropa={GLADIADOR} casco="no" expr="enojado" aparece={607.1}
        camina={t < 608 ? 2 : 0} flip bD={22} cD={8} bI={30} cI={40} manoD={<Tridente />} manoI={<Red />} />
      <Persona x={1360} y={PISO} h={580} t={t} seed={67} ropa={CIVIL(6)} expr="triste" aparece={608.5} flip bD={30} bI={30} cD={60} cI={60}
        manoD={<circle cx={0} cy={0} r={22} fill="none" stroke="#7d8796" strokeWidth={10} />} manoI={<circle cx={0} cy={0} r={22} fill="none" stroke="#7d8796" strokeWidth={10} />} />
      <Chip t={t} t0={605.13} text="HIT SO HARD..." color={C.violeta} x={160} y={140} size={56} t1={607.0} />
      <Chip t={t} t0={607.27} text="GLADIATORS" color={C.rojo} x={880} y={290} centro size={60} />
      <Chip t={t} t0={608.67} text="EVEN SLAVES" color={C.ambar} tinta={C.noche} x={1400} y={290} centro size={60} />
      <Chip t={t} t0={609.58} text="TO REFILL THE RANKS" color={C.violeta} x={160} y={140} size={54} />
    </Escena>

    {/* 148 · ¿y si te herían? */}
    <Escena t={t} t0={610.8} t1={612.1} entra="corte" golpes={[611.36]}>
      <Campamento t={t} tropa={false} />
      <Persona x={960} y={PISO} h={640} t={t} seed={1} casco="legion" expr="miedo" bD={60} bI={60} cD={90} />
      <Emote t={t} t0={611.0} tipo="preg" {...L(960, PISO, 640)} s={1.4} />
      <Grande t={t} t0={611.17} text="GET HURT?" y={170} size={140} color="#fff" />
    </Escena>

    {/* 149 · tenían médicos de verdad, los medici, y hospitales dentro del fuerte */}
    <Escena t={t} t0={612.1} t1={618.1} zoom={0.03} entra="corte" golpes={[613.13, 614.22, 614.98, 617.01]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b9be0,#7cc4f0 45%,#c8ecf8 80%,#fff3d6)" }} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={720} seed={115} alto={50} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "linear-gradient(180deg, #c8b88a, #a89868)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + (t > 614.98 ? 0.07 * Math.sin((t - 614.98) * 12) * Math.exp(-(t - 614.98) * 4) : 0)})`, transformOrigin: "1320px 950px" }}><Hospital t={t} t0={611.6} x={1320} y={640} s={1.05} /></div>
      <Persona x={320} y={PISO} h={620} t={t} seed={68} ropa={MEDICO} viejo expr="orgullo" habla={t < 616.5} bD={t > 614.9 ? 95 : 60} cD={t > 614.9 ? 0 : 70} />
      <Persona x={interpolate(t, [612.1, 616.8], [640, 860], { extrapolateRight: "clamp" })} y={PISO} h={580} t={t} seed={1} casco="legion" expr="triste" camina={t < 616.8 ? 1.1 : 0} mira={-0.6}
        bI={45} cI={115} manoI={<g><rect x={-19} y={-70} width={38} height={56} rx={10} fill="#fff" stroke="#d8d0c4" strokeWidth={4} /><circle cx={0} cy={-42} r={8} fill={C.rojo} /></g>} />
      <Chip t={t} t0={613.13} text="REAL DOCTORS" color={C.teal} tinta={C.noche} x={160} y={140} size={56} />
      <Grande t={t} t0={614.22} text="MEDICI" x={1260} y={150} size={120} color="#fff" borde={C.teal} />
      <Chip t={t} t0={615.48} text="HOSPITALS INSIDE THE FORTS" color={C.rojo} x={160} y={250} size={48} />
      <Chip t={t} t0={617.01} text="GENUINELY GOOD" color="#3fa34d" x={1320} y={310} centro size={52} />
    </Escena>

    {/* 150 · fórceps, bisturíes y herramientas para sacar puntas de flecha: el médico opera, el paciente muerde un palo */}
    <Escena t={t} t0={618.1} t1={623.6} zoom={0.03} entra="corte" golpes={[618.82, 620.08, 622.34]}>
      <Interior tono="#e8e0d0" />
      {/* estante con los instrumentos: el que se nombra se ilumina */}
      <div style={{ position: "absolute", left: 160, top: 400, width: 620, height: 24, borderRadius: 8, background: "#8a5a2a" }} />
      {(["pinza", "bisturi", "flecha"] as const).map((k, i) => {
        const on = i === (t < 620.08 ? 0 : t < 622.34 ? 1 : 2);
        return <div key={k}>
          {on && <div style={{ position: "absolute", left: 270 + i * 200 - 70, top: 160, width: 140, height: 240, borderRadius: 30, background: "rgba(255,240,160,.6)" }} />}
          <Instrumento k={k} x={270 + i * 200} y={290} s={0.52} t={t} t0={618.1} rot={i === 1 ? 6 : -8} />
        </div>;
      })}
      {(() => {
        const herr = t < 620.08 ? "pinza" : t < 622.34 ? "bisturi" : "flecha";
        const mano = herr === "pinza"
          ? <g transform="rotate(-90)">{[-1, 1].map((s) => <path key={s} d={`M 0 0 Q ${s * 18} -60 ${s * 6} -130`} stroke="#c8ccd4" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>
          : herr === "bisturi"
            ? <g transform="rotate(-90)"><rect x={-7} y={-40} width={14} height={60} rx={5} fill="#e9a92a" /><path d="M -8 -40 L 8 -40 L 8 -90 Q 0 -130 -9 -94 Z" fill="#d8dde6" stroke="#8a93a3" strokeWidth={3} /></g>
            : <g transform="rotate(-90)"><path d="M 0 0 L -14 -120 M 0 0 L 14 -120" stroke="#8a93a3" strokeWidth={10} strokeLinecap="round" /></g>;
        const ida = Math.sin(t * 5);
        // el médico va DETRÁS de la camilla: sólo se le ve de la cintura para arriba, las manos bajan al pecho del paciente
        return <Persona x={1340} y={PISO} h={660} t={t} seed={68} ropa={MEDICO} viejo expr="neutro" mira={-0.4} miraY={0.9} inclina={-6} bI={30} cI={40} bD={30 + ida * 10} cD={40 + ida * 25} manoD={mano} />;
      })()}
      {/* camilla */}
      <div style={{ position: "absolute", left: 860, top: 820, width: 780, height: 40, borderRadius: 10, background: "#8a5a2a" }} />
      {[900, 1580].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 860, width: 30, height: 140, background: "#6b3a1f" }} />)}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "rotate(-90deg)", transformOrigin: "1540px 790px" }}>
        <Persona x={1540} y={790} h={520} t={t} seed={1} casco="legion" expr="miedo" bI={8} bD={8} />
      </div>
      {/* palo entre los dientes */}
      <div style={{ position: "absolute", left: 1540 - 388 * 520 / 560 - 10, top: 730, width: 20, height: 120, borderRadius: 10, background: "#a8703a", border: "3px solid #6b3a1f" }} />
      <Emote t={t} t0={618.3} tipo="sudor" x={1540 - 450 * 520 / 560} y={700} s={0.9} />
      {/* punta de flecha clavada en el pecho, que sale en 622,34 */}
      {(() => {
        const sale = prog(t, 622.4, 622.9);
        return <svg style={{ position: "absolute", left: 1290, top: 690 - sale * 200, overflow: "visible", opacity: 1 - prog(t, 623.1, 623.4) }} width={20} height={20}><g transform="rotate(200)"><rect x={-6} y={-10} width={12} height={130} fill="#8a5a2a" /><path d="M -6 120 L -26 150 L -6 142 Z M 6 120 L 26 150 L 6 142 Z" fill="#e8e0d0" /></g><path d="M -20 0 L 0 -40 L 20 0 Z" fill="#7d8796" transform="translate(4 18)" /></svg>;
      })()}
      <Chip t={t} t0={618.82} t1={619.8} text="FORCEPS" color={C.teal} tinta={C.noche} x={1300} y={200} centro size={60} />
      <Chip t={t} t0={620.08} t1={622.05} text="SCALPELS" color={C.violeta} x={1300} y={200} centro size={60} />
      <Chip t={t} t0={622.34} text="ARROWHEAD PULLERS" color={C.rojo} x={1300} y={200} centro size={58} />
    </Escena>

    {/* 151 · lo que no tenían: calmantes, ni idea de qué era una infección */}
    <Escena t={t} t0={623.6} t1={629.86} zoom={0.02} entra="corte" golpes={[625.88, 628.53]}>
      <Interior tono="#e8e0d0" />
      <Persona x={360} y={PISO} h={600} t={t} seed={1} casco="legion" expr={t > 625.5 ? "enojado" : "triste"} ladea={-8} bI={60} cI={20} bD={20} cD={110} mira={0.6} inclina={-4} />
      {/* el médico le venda el brazo (vuelta de venda que gira) */}
      <Persona x={650} y={PISO} h={620} t={t} seed={68} ropa={MEDICO} viejo flip expr="neutro" mira={0.6} miraY={0.5} bD={70 + Math.sin(t * 7) * 14} cD={50 + Math.cos(t * 7) * 20} bI={60} cI={60}
        manoD={<circle cx={0} cy={0} r={20} fill="#fff" stroke="#d8d0c4" strokeWidth={4} />} />
      <Emote t={t} t0={623.8} tipo="sudor" {...L(360, PISO, 600)} />
      {t > 625.5 && <Emote t={t} t0={625.6} tipo="enojo" {...L(360, PISO, 600)} />}
      <Falta t={t} t0={625.5} x={1170} y={600} s={0.66} tx={626.3} txt="PAINKILLERS" icono={<svg width={300} height={300} viewBox="-150 -150 300 300"><g transform="rotate(-35)"><rect x={-120} y={-50} width={240} height={100} rx={50} fill="#fff" stroke="#2a1530" strokeWidth={10} /><path d="M 0 -50 L 0 50" stroke="#2a1530" strokeWidth={10} /><path d="M -120 -50 L 0 -50 L 0 50 L -70 50 Q -120 50 -120 0 Z" fill={C.rojo} /></g></svg>} />
      <Falta t={t} t0={628.2} x={1560} y={600} s={0.66} tx={628.86} txt="INFECTION?" icono={<Virus t={t} x={150} y={150} r={90} />} />
      <Chip t={t} t0={623.63} text="WHAT THEY DID NOT HAVE" color={C.violeta} x={1360} y={140} centro size={54} />
    </Escena>

    {/* 152 · un corte chico de una espada de práctica en un día caluroso en África podía matarte */}
    <Escena t={t} t0={629.86} t1={636.1} zoom={0.03} entra="corte" golpes={[630.46, 633.01, 633.88, 635.36]}>
      <Campamento t={t} tropa={false} />
      <Calor t={t} y={560} op={0.3} />
      <div style={{ position: "absolute", left: 230, top: 60, width: 150, height: 150, borderRadius: 75, background: "#ffe066", boxShadow: "0 0 60px 30px rgba(255,200,60,.55)" }} />
      {(() => {
        const dia = t < 632.4 ? 1 : t < 633.6 ? 3 : 7;
        const k = t < 631 ? 0 : dia === 1 ? 0.15 : dia === 3 ? 0.5 : 1;
        const sick = t > 633.6;
        const pelea = t < 630.7;
        return <>
          {/* compañero de práctica con espada de madera */}
          <Persona x={940} y={PISO} h={580} t={t} seed={2} casco="legion" ropa={{ ...LUCIUS, tunica: "#3f6fb0", tunica2: "#274a80" }} flip expr={pelea ? "enojado" : "sorpresa"} {...(pelea ? pose("golpear", t, 1.4) : { bD: 30, cD: 20 })} manoD={<EspadaMano madera />} />
          <Persona x={520} y={PISO} h={620} t={t} seed={yo(enfermando(sick ? prog(t, 633.6, 634.3) : 0))} casco="legion" ropa={enfermando(sick ? prog(t, 633.6, 634.3) : 0)} expr={sick ? "triste" : t > 630.5 ? "sorpresa" : "enojado"}
            {...(pelea ? pose("golpear", t + 0.5, 1.4) : sick ? pose("temblar", t) : { bI: 60, cI: 100, bD: 20, cD: 20 })} ladea={sick ? 8 : 0} manoD={sick ? undefined : <EspadaMano madera />} />
          {t > 630.46 && t < 630.75 && <div style={{ position: "absolute", left: 640, top: 600, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle, #fff, rgba(255,255,255,0) 70%)" }} />}
          {sick && <Emote t={t} t0={633.9} tipo="sudor" {...L(520, PISO, 620)} />}
          {/* lupa sobre el corte que se infecta: DAY 1 / 3 / 7 + medidor */}
          {t > 630.9 && t < 635.2 && <div style={{ position: "absolute", left: 1150, top: 330, width: 420, height: 420, borderRadius: 210, background: "#fff3d6", border: "14px solid #2a1530", overflow: "hidden", transform: `scale(${ent(t, 630.9)})` }}>
            <div style={{ position: "absolute", left: -40, top: 130, width: 500, height: 170, borderRadius: 85, background: mezcla("#f2b48a", "#b8d070", k) }} />
            <div style={{ position: "absolute", left: 120, top: 205, width: 180, height: 16, borderRadius: 8, background: C.rojo, transform: "rotate(-14deg)" }} />
            <div style={{ position: "absolute", left: 210 - 60 - k * 70, top: 213 - 40 - k * 50, width: 120 + k * 140, height: 80 + k * 100, borderRadius: "50%", background: `rgba(${k > 0.4 ? "122,190,60" : "232,52,74"},${0.25 + k * 0.4})` }} />
          </div>}
          {t > 630.9 && t < 635.2 && <div style={{ position: "absolute", left: 1210, top: 250, padding: "6px 24px", borderRadius: 16, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 52, color: k > 0.4 ? "#c6f04a" : "#fff", transform: `scale(${ent(t, 630.9)})` }}>DAY {dia}</div>}
          {t > 630.9 && t < 635.2 && <div style={{ position: "absolute", left: 1150, top: 790, width: 420, height: 34, borderRadius: 17, background: "#4a3a5a", border: "4px solid #2a1530", overflow: "hidden" }}><div style={{ width: `${8 + k * 92}%`, height: "100%", background: k > 0.4 ? "#7ad45a" : C.ambar }} /></div>}
          {t >= 635.2 && <Craneo x={1360} y={560} s={0.9} t={t} t0={635.2} />}
        </>;
      })()}
      <Chip t={t} t0={630.46} text="A SMALL CUT" color={C.rojo} x={160} y={140} size={58} t1={633.7} />
      <Chip t={t} t0={632.46} text="HOT DAY · AFRICA" color={C.ambar} tinta={C.noche} x={160} y={250} size={54} t1={633.7} />
      <Chip t={t} t0={633.88} text="COULD KILL YOU" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={635.36} text="= A BATTLE" color={C.violeta} x={1360} y={860} centro size={60} />
    </Escena>

    {/* 153 · al menos la comida era regular */}
    <Escena t={t} t0={636.1} t1={637.9} entra="corte" golpes={[637.15]}>
      <Campamento t={t} />
      <Persona x={960} y={PISO} h={640} t={t} seed={1} casco="legion" expr="feliz" salta={637.1} bD={150} bI={150} cD={20} cI={20} manoD={<Cuenco />} />
      <Grande t={t} t0={636.67} text="AT LEAST... FOOD" y={180} size={120} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 154 · trigo molido a mano con un molino de piedra compartido por la carpa */}
    <Escena t={t} t0={637.9} t1={644.25} zoom={0.03} entra="corte" golpes={[639.24, 641.39, 642.65, 643.53]}>
      <Campamento t={t} tropa={false} />
      {/* los de la carpa esperan su turno con el cuenco (fila de atrás) */}
      {[1100, 1230, 1360, 1490, 1620].map((x, i) => <Persona key={x} x={x} y={880} h={360} t={t} seed={140 + i} casco="no" ropa={CIVIL(i + 1)} expr={i === 2 ? "dormido" : "neutro"} mira={-0.8} bD={40} cD={90} manoD={<Cuenco />} habla={i === 0 && t > 643} />)}
      <Saco x={250} y={PISO} s={1.0} />
      {(() => {
        // la mano del protagonista da vueltas a la manija: el brazo (sin codo) apunta a la manija y la piedra gira en sincronía
        const g = (t - 637.9) * Math.PI * 2 * 0.62;
        const a = 50 + 22 * Math.cos(g);
        const S = 1, px = 640, sx = px + 66 * S, sy = PISO - 322 * S;
        const hx = sx + 178 * S * Math.sin((a * Math.PI) / 180), hy = sy + 178 * S * Math.cos((a * Math.PI) / 180);
        return <>
          <Molino t={t} x={840} y={935} s={1.1} g={g} hx={hx} hy={hy} />
          <Persona x={px} y={PISO} h={560} t={t} seed={1} casco="legion" expr={t > 642 ? "triste" : "neutro"} mira={0.7} miraY={0.7} bD={a - 2 * Math.sin((t + 0) * 1.5 + 1)} cD={0} bI={30} cI={50} />
        </>;
      })()}
      {t > 642 && <Emote t={t} t0={642.1} tipo="sudor" {...L(640, PISO, 560)} />}
      <Chip t={t} t0={639.24} text="WHEAT" color={C.ambar} tinta={C.noche} x={250} y={700} centro size={56} />
      <Chip t={t} t0={640.15} t1={642.0} text="GROUND BY HAND" color={C.rojo} x={160} y={140} size={56} />
      <Chip t={t} t0={642.32} text="STONE MILL" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={643.15} text="SHARED BY THE TENT" color={C.teal} tinta={C.noche} x={1300} y={330} size={48} />
    </Escena>

    {/* 155 · pan o papilla */}
    <Escena t={t} t0={644.25} t1={647.2} zoom={0.02} entra="corte" golpes={[644.96, 646.36]}>
      <Interior tono="#e0c79a" />
      <div style={{ position: "absolute", left: 300, top: 760, width: 1320, height: 40, borderRadius: 10, background: "#a8622c", boxShadow: "0 14px 0 #7a4520" }} />
      {[340, 1540].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 800, width: 30, height: 200, background: "#6b3a1f" }} />)}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${t < 644.4 ? 0.85 : ent(t, 644.4) * 0.15 + 0.85})`, transformOrigin: "520px 560px" }}><Pan x={520} y={560} s={2.0} /></div>
      <Comida k="porridge" x={1400} y={600} s={1.4} t={t} t0={645.9} />
      <Persona x={960} y={PISO} h={600} t={t} seed={1} casco="legion" expr="feliz" mira={t < 645.7 ? -1 : 1} bD={60} cD={60} bI={60} cI={60} />
      <Chip t={t} t0={644.96} text="BREAD" color={C.ambar} tinta={C.noche} x={520} y={880} centro size={60} />
      <Grande t={t} t0={645.53} text="OR" y={200} size={120} color={C.rojo} />
      <Chip t={t} t0={646.36} text="PORRIDGE" color={C.violeta} x={1400} y={880} centro size={60} />
    </Escena>

    {/* 156 · tocino, queso, lentejas y posca: la mesa de la carpa, el protagonista prueba la posca */}
    <Escena t={t} t0={647.2} t1={654.1} zoom={0.03} entra="corte" golpes={[647.55, 648.48, 649.27, 650.6, 652.05]}>
      <Interior tono="#e0c79a" ventana={false} />
      {/* menú en la pared */}
      {t < 650.6 && <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 300, borderRadius: 20, background: "#5a3418", border: "10px solid #8a5a2a", opacity: t > 650.3 ? 1 - (t - 650.3) / 0.3 : 1, fontFamily, fontWeight: 700, fontSize: 40, color: "#f6e3b4", textAlign: "center", paddingTop: 8, boxSizing: "border-box" }}>TODAY'S RATIONS</div>}
      <Comida k="tocino" x={560} y={215} s={0.7} t={t} t0={647.55} t1={650.3} />
      <Comida k="queso" x={960} y={215} s={0.7} t={t} t0={648.48} t1={650.3} />
      <Comida k="lentejas" x={1360} y={225} s={0.7} t={t} t0={649.27} t1={650.3} />
      {([[647.55, "BACON", 560], [648.48, "CHEESE", 960], [649.27, "LENTILS", 1360]] as const).map(([t0, txt, x]) => <Chip key={txt} t={t} t0={t0} t1={650.0} text={txt} color={C.violeta} x={x} y={325} centro size={40} />)}
      {[330, 540, 750, 960, 1170, 1380, 1590].map((x, i) => {
        const yo = i === 3;
        const bebe = yo && t > 650.6;
        const agrio = yo && t > 652.05;
        return <Persona key={x} x={x} y={980} h={500} t={t} seed={yo ? 1 : 150 + i} casco={yo ? "legion" : "no"} ropa={yo ? LUCIUS : CIVIL(i + 2)}
          expr={agrio ? "enojado" : yo ? "feliz" : i % 3 === 0 ? "feliz" : "neutro"} mira={yo ? 0 : i < 3 ? 0.7 : -0.7} habla={!yo && i % 2 === 1}
          {...(bebe ? { bI: 30, cI: 90, bD: agrio ? 70 : 125, cD: agrio ? 60 : 125 } : pose("comer", t + i * 0.37, 0.8))}
          manoD={bebe ? <Jarra /> : undefined} inclina={agrio ? -6 : 0} />;
      })}
      {/* mesa con la comida delante de cada uno */}
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
      <Persona x={1120} y={PISO} h={600} t={t} seed={1} casco="legion" expr={t > 658.3 ? "sorpresa" : "feliz"} {...pose("comer", t, 0.8)} manoI={<Cuenco />} />
      <Persona x={1440} y={PISO} h={560} t={t} seed={69} ropa={CIVIL(4)} expr="triste" aparece={657.9} flip mira={0.8} bD={50} cD={80} manoD={<Cuenco />} />
      <Emote t={t} t0={658.3} tipo="lagrimas" {...L(1440, PISO, 560)} />
      <Chip t={t} t0={654.32} text="NOT GLAMOROUS" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={658.25} text="MOST FARMERS: NOT SO LUCKY" color={C.rojo} x={1000} y={270} size={44} />
    </Escena>
  </>
);

// arcos de contagio gruesos verde enfermo + fuertes que se ponen verdes al llegar
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
        return (
          <g key={a}>
            <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${l.x} ${l.y}`} stroke="#1d4a24" strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
            <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${l.x} ${l.y}`} stroke="#9be15d" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
            <g transform={`translate(${l.x} ${l.y}) scale(${verde ? 1 : 0.85})`}>
              <path d="M -34 10 L -34 -30 L -22 -30 L -22 -20 L -10 -20 L -10 -30 L 10 -30 L 10 -20 L 22 -20 L 22 -30 L 34 -30 L 34 10 Z" fill={verde ? "#7ad45a" : "#c9a36a"} stroke="#1d1240" strokeWidth={5} />
              {verde && <circle r={44 + ((t * 40) % 20)} fill="none" stroke="#9be15d" strokeWidth={4} opacity={0.6} />}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
