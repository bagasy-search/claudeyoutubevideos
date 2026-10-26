import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL, Ropa } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, Pergamino, Pan, Mesa, Particulas, Frente, Emote, cabeza } from "./kit";
import { Escudo, Poste, Pilum, Armadura, Mula, Comida, Soldadito, Craneo, Calor, Item } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Ruta, Valle, Campo, Tablero, Torre, pose, PlazaArmas, Multitud, EnMano, FilaLejana } from "./kit3";

// Parte 2 (163,26-253,76 s): trampa 2, el entrenamiento.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
const Olas: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    {[0, 1, 2, 3].map((i) => {
      const yy = y + i * 70;
      const d = Array.from({ length: 26 }, (_, k) => `${k ? "L" : "M"} ${k * 80 - 40} ${yy + Math.sin(k * 0.8 + t * (2 + i * 0.4) + i) * 18}`).join(" ") + ` L 1960 1080 L -40 1080 Z`;
      return <path key={i} d={d} fill={["#4fb0d8", "#2f86b0", "#1f6a94", "#155078"][i]} opacity={0.92} />;
    })}
  </svg>
);
// caballo de madera para el salto (los romanos practicaban sobre uno): cuerpo de barril, cuello, cabeza con orejas y crin
const CaballoMadera: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 300 * s, top: y - 460 * s, overflow: "visible" }} width={600 * s} height={460 * s} viewBox="-300 -460 600 460">
    {[-200, -150, 150, 200].map((xx, i) => <rect key={i} x={xx - 16} y={-150} width={32} height={150} rx={6} fill="#7a4a1a" transform={`rotate(${i < 2 ? 8 : -8} ${xx} -150)`} />)}
    <path d="M -240 -200 Q -300 -170 -290 -90 Q -270 -120 -250 -150 Z" fill="#5a3418" />
    <rect x={-250} y={-240} width={500} height={110} rx={55} fill="#a8783a" />
    <rect x={-240} y={-236} width={480} height={30} rx={15} fill="#c9a46a" />
    <path d="M 170 -230 Q 200 -330 250 -380 L 320 -350 Q 270 -300 250 -200 Z" fill="#a8783a" />
    <path d="M 186 -250 Q 206 -330 250 -380" stroke="#5a3418" strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray="14 10" />
    <ellipse cx={310} cy={-370} rx={78} ry={44} fill="#a8783a" transform="rotate(28 310 -370)" />
    <ellipse cx={360} cy={-340} rx={30} ry={24} fill="#8a5a2a" transform="rotate(28 360 -340)" />
    <path d="M 270 -410 L 262 -460 L 296 -420 Z" fill="#8a5a2a" />
    <circle cx={306} cy={-388} r={9} fill="#2a1a10" />
    <path d="M -70 -246 Q 0 -280 70 -246 L 60 -220 L -60 -220 Z" fill={C.rojo} />
    {[-90, 0, 90].map((xx) => <circle key={xx} cx={xx} cy={-186} r={8} fill="#5a3418" />)}
  </svg>
);
const Hito: React.FC<{ x: number; y: number; n: string }> = ({ x, y, n }) => (
  <div style={{ position: "absolute", left: x - 55, top: y - 160, width: 110, height: 160, background: "#e8d8b8", borderRadius: "55px 55px 8px 8px", boxShadow: "inset -16px 0 0 #c9b48a, 8px 10px 0 rgba(20,8,30,.3)", fontFamily, fontWeight: 700, fontSize: 40, color: "#7a3d14", textAlign: "center", paddingTop: 34 }}>{n}</div>
);

// escudo de mimbre para agarraI (mango en (0,0), mismo encuadre que EnMano.escudo)
export const MimbreMano: React.FC = () => (
  <g transform="rotate(90)">
    <rect x={-62} y={-92} width={124} height={184} rx={22} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={8} />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-54} y1={-66 + i * 28} x2={54} y2={-66 + i * 28} stroke="#8a6a3a" strokeWidth={6} strokeDasharray="16 8" strokeDashoffset={i % 2 ? 12 : 0} />)}
  </g>
);
// ángulo EN PANTALLA de la espada durante pose("golpear", tt, vel): arriba-atrás (-80) → abajo-adelante (+20)
export const angGolpe = (tt: number, vel: number) => { const k = (((tt * vel) % 1) + 1) % 1; const g = k < 0.35 ? k / 0.35 : 1 - (k - 0.35) / 0.65; return -80 + g * 100; };
// banco / piedra para sentarse (postura="sentado" queda con el asiento ~125 u sobre el piso)
export const Banco: React.FC<{ x: number; y: number; w?: number; piedra?: boolean }> = ({ x, y, w = 260, piedra }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - 130, overflow: "visible" }} width={w} height={130}>
    <ellipse cx={w / 2 - 30} cy={128} rx={w / 2 + 20} ry={12} fill="#1d0f33" opacity={0.2} />
    {piedra ? <path d={`M 6 130 Q 0 40 ${w * 0.3} 12 Q ${w / 2} -4 ${w * 0.75} 14 Q ${w} 50 ${w - 6} 130 Z`} fill="#8a8296" stroke="#5e566c" strokeWidth={8} />
      : <><rect x={10} y={0} width={w - 20} height={26} rx={8} fill="#a8622c" /><rect x={30} y={20} width={20} height={110} fill="#6b3a1f" /><rect x={w - 50} y={20} width={20} height={110} fill="#6b3a1f" /></>}
  </svg>
);

// ── objetos EN LA MANO (coordenadas locales del antebrazo de Persona: +y = hacia afuera de la mano)
export const EspadaMano: React.FC<{ madera?: boolean; largo?: number }> = ({ madera, largo = 210 }) => (
  <g>
    <rect x={-11} y={-36} width={22} height={46} rx={9} fill="#6b3a1f" />
    <circle cx={0} cy={-38} r={13} fill={madera ? "#7a4a1a" : "#e9a92a"} />
    <rect x={-36} y={8} width={72} height={17} rx={8} fill={madera ? "#7a4a1a" : "#e9a92a"} />
    <path d={`M -17 25 L -17 ${largo - 32} L 0 ${largo} L 17 ${largo - 32} L 17 25 Z`} fill={madera ? "#c08442" : "#e3e7ee"} stroke={madera ? "#7a4a1a" : "#8a93a3"} strokeWidth={6} strokeLinejoin="round" />
    {!madera && <line x1={0} y1={34} x2={0} y2={largo - 30} stroke="#9aa3b3" strokeWidth={5} />}
  </g>
);
export const PalaMano: React.FC<{ brilla?: number }> = ({ brilla = 0 }) => (
  <g>
    {brilla > 0 && <circle cx={0} cy={300} r={150 + brilla * 20} fill="#fff3a0" opacity={0.35 * brilla} />}
    <rect x={-10} y={-90} width={20} height={350} rx={9} fill="#8a5a2a" />
    <rect x={-34} y={-104} width={68} height={22} rx={10} fill="#6b3a1f" />
    <path d="M -56 250 L 56 250 L 48 350 Q 0 392 -48 350 Z" fill={brilla > 0.5 ? "#e6edf7" : "#8a93a3"} stroke="#5d6577" strokeWidth={9} strokeLinejoin="round" />
    <path d="M -30 272 Q -34 320 -16 350" stroke="#fff" strokeOpacity={0.55} strokeWidth={9} fill="none" strokeLinecap="round" />
  </g>
);
export const MazoMano: React.FC = () => (
  <g>
    <rect x={-9} y={-20} width={18} height={170} rx={8} fill="#8a5a2a" />
    <rect x={-52} y={140} width={104} height={62} rx={14} fill="#a8783a" stroke="#6b3a1f" strokeWidth={7} />
  </g>
);
export const HachaMano: React.FC = () => (
  <g>
    <rect x={-10} y={-30} width={20} height={250} rx={9} fill="#6b3a1f" />
    <path d="M 8 150 Q 90 140 100 230 Q 60 210 8 214 Z" fill="#c8ccd4" stroke="#6b7385" strokeWidth={6} />
  </g>
);
export const EscudoMimbreMano: React.FC = () => (
  <g transform="translate(0 30)">
    <rect x={-80} y={-60} width={160} height={240} rx={26} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={9} />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-72} y1={-36 + i * 32} x2={72} y2={-36 + i * 32} stroke="#8a6a3a" strokeWidth={7} strokeDasharray="20 9" strokeDashoffset={i % 2 ? 14 : 0} />)}
  </g>
);
export const BARBARO: Ropa = { tunica: "#3f6fa8", tunica2: "#24456e", cinto: "#5a3418", piel: "#f2c9a0", piel2: "#d9a07a", pelo: "#c8642a" };
// golpe: estrella de líneas que se abre (k 0→1)
export const Fogonazo: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 140 * s, top: y - 140 * s, overflow: "visible", pointerEvents: "none" }} width={280 * s} height={280 * s} viewBox="-140 -140 280 280">
    <circle r={40 + k * 50} fill="#fff6c8" opacity={0.6 * (1 - k)} />
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2 + 0.3, r0 = 30 + k * 60, r1 = 70 + k * 70; return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke="#fff3a0" strokeWidth={12 * (1 - k * 0.6)} strokeLinecap="round" />; })}
  </svg>
);
// recuadro de contador fijo (no se mueve con la cámara)
export const Marcador: React.FC<{ x: number; y: number; txt: string; color?: string; size?: number }> = ({ x, y, txt, color = "#2a1530", size = 50 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", padding: "8px 26px", borderRadius: 18, background: color, border: "5px solid #fff", fontFamily, fontWeight: 700, fontSize: size, color: "#fff", whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(20,10,50,.35)" }}>{txt}</div>
);
// calendario de 4 meses en un tablón: cada mes se llena de días tachados y se cruza
const Calendario: React.FC<{ t: number; x: number; y: number; t0: number; paso: number }> = ({ t, x, y, t0, paso }) => (
  <div style={{ position: "absolute", left: x - 330, top: y - 160, width: 660, height: 320 }}>
    {[90, 570].map((xx) => <div key={xx} style={{ position: "absolute", left: xx - 14, top: 200, width: 28, height: 880 - (y - 160) - 200, background: "#6b3a1f", borderRadius: 8 }} />)}
    <div style={{ position: "absolute", inset: 0, background: "#a8783a", border: "8px solid #6b3a1f", borderRadius: 18, boxShadow: "10px 12px 0 rgba(20,8,30,.3)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 12, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff8ec", letterSpacing: 2 }}>4 MONTHS AS A TYRO</div>
    {Array.from({ length: 4 }, (_, i) => {
      const u = prog(t, t0 + i * paso, t0 + (i + 0.85) * paso);
      const tc = t0 + (i + 0.85) * paso;
      return (
        <div key={i} style={{ position: "absolute", left: 34 + i * 152, top: 84, width: 136, height: 206, background: "#fff8ec", borderTop: `24px solid ${C.rojo}`, borderRadius: 10 }}>
          <div style={{ position: "absolute", top: -27, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 22, color: "#fff" }}>{["MONTH I", "MONTH II", "MONTH III", "MONTH IV"][i]}</div>
          <div style={{ position: "absolute", left: 11, top: 12, display: "grid", gridTemplateColumns: "repeat(5, 18px)", gap: 6 }}>
            {Array.from({ length: 30 }, (_, d) => <div key={d} style={{ width: 18, height: 18, borderRadius: 4, background: d / 30 < u ? C.rojo : "#e6d6b8" }} />)}
          </div>
          {t > tc && <div style={{ position: "absolute", inset: 0, fontFamily, fontWeight: 700, fontSize: 150, lineHeight: "176px", textAlign: "center", color: "#2a1530", transform: `scale(${ent(t, tc)})`, opacity: 0.8 }}>✕</div>}
        </div>
      );
    })}
  </div>
);

export const P2: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 044a · trampa número dos: el entrenamiento */}
    <Escena t={t} t0={163.26} t1={166.0} entra="corte" golpes={[163.48, 164.6]}>
      <Tablero t={t} t0={162.9} en={1} de={0} tAvanza={163.4} marca={164.4} hecho={1} />
      <Chip t={t} t0={163.48} text="TRAP 2 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={164.6} text="THE TRAINING" x={900} y={400} size={130} />
    </Escena>

    {/* 044b · cuatro meses sos un tiro, un recluta, y tu trabajo es sufrir: arrastra los pies hacia el poste */}
    <Escena t={t} t0={166.0} t1={170.56} zoom={0.04} entra="barrido" golpes={[167.16, 169.68]}>
      <PlazaArmas t={t} dx={(t - 166) * 30} />
      <Calor t={t} y={620} op={0.25} />
      <Multitud t={t} n={3} filas={1} x0={1560} x1={1860} y={720} h={210} seed={44} accion="golpear" vel={1.3} giro="34" />
      <Calendario t={t} x={1180} y={420} t0={166.4} paso={0.95} />
      {(() => {
        const x = 300 + prog(t, 166.0, 170.9) * 300, y = 1000, h = 620;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" giro="perfil" expr={t > 169.68 ? "triste" : t > 167.16 ? "miedo" : "neutro"} inclina={t > 169.68 ? 12 : 7} camina={0.55}
            bD={-18} cD={6} agarra={<EnMano.gladius madera />} agarraAng={155} bI={14} cI={30} agarraI={<MimbreMano />} agarraAngI={60} />
          {/* surco que deja la espada arrastrada */}
          <div style={{ position: "absolute", left: 60, top: y - 4, width: Math.max(0, x - 260), height: 8, borderRadius: 4, background: "rgba(120,70,30,.45)" }} />
          <Emote t={t} t0={167.4} tipo="sudor" {...L(x, y, h)} s={1.15} />
          <Emote t={t} t0={170.0} tipo="lagrimas" {...L(x, y, h)} s={1.15} />
        </>;
      })()}
      <Chip t={t} t0={167.16} text="TYRO = RECRUIT" color={C.teal} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={169.68} text="NEW JOB: SUFFER" color={C.rojo} x={1180} y={150} centro size={66} />
      <Particulas t={t} tipo="polvo" n={24} seed={61} />
    </Escena>

    {/* 045 · dos veces por día, espada de madera y escudo de mimbre: le pega al poste de día y de noche */}
    <Escena t={t} t0={170.56} t1={174.1} entra="corte" golpes={[172.3, 173.24]}>
      <PlazaArmas t={t} hora={t < 172.3 ? "dia" : "noche"} angulo="bajo" />
      <Astro x={1640} y={200} r={70} luna={t >= 172.3} />
      <Poste x={1230} y={770} s={1.05} />
      {(() => {
        const P = pose("golpear", t - 170.56, 1.5), k = ((t - 170.56) * 1.5) % 1;
        return <>
          <Persona x={780} y={1000} h={640} t={t} seed={1} casco="legion" giro="34" expr="enojado" {...P} bI={60} cI={50} agarra={<EnMano.gladius madera />} agarraAng={angGolpe(t - 170.56, 1.5)} agarraI={<MimbreMano />} agarraAngI={0} />
          {k > 0.17 && k < 0.34 && <Fogonazo x={1220} y={640} k={(k - 0.17) / 0.17} />}
        </>;
      })()}
      <Marcador x={1640} y={330} txt={t < 172.3 ? "SESSION 1" : "SESSION 2"} color={t < 172.3 ? C.ambar : C.violeta} size={44} />
      <Chip t={t} t0={170.92} text="TWICE A DAY" color={C.ambar} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={172.3} text="WOODEN SWORD" color={C.tierra} x={1500} y={480} centro size={50} />
      <Chip t={t} t0={173.24} text="WICKER SHIELD" color={C.tierra} x={330} y={330} centro size={50} />
    </Escena>

    {/* 046 · y pesan el doble que los de verdad */}
    <Escena t={t} t0={174.1} t1={178.3} zoom={0.05} entra="sube" golpes={[176.22]}>
      <Campamento t={t} tropa={false} angulo="bajo" />
      {(() => {
        const h = 700, y = 1000, x = 960, peso = prog(t, 176.22, 176.7);
        return <>
          <Persona x={x} y={y + peso * 20} h={h} t={t} seed={1} casco="legion" expr={peso > 0.5 ? "miedo" : "orgullo"} reaccion={peso > 0 ? "ojos" : undefined} reaccionT0={176.3}
            bD={interpolate(peso, [0, 1], [80, 22])} cD={interpolate(peso, [0, 1], [50, 10])} bI={interpolate(peso, [0, 1], [70, 22])} cI={30} inclina={peso * 6}
            agarra={<EnMano.gladius madera />} agarraAng={interpolate(peso, [0, 1], [-60, 75])} agarraI={<MimbreMano />} agarraAngI={interpolate(peso, [0, 1], [0, 60])} />
          <Emote t={t} t0={176.4} tipo="sudor" {...L(x, y, h)} s={1.5} />
          {peso > 0.6 && <div style={{ position: "absolute", left: x - 360, top: 990, width: 720, height: 40, borderRadius: "50%", background: "rgba(120,70,30,.45)", transform: `scaleX(${ent(t, 176.5)})` }} />}
        </>;
      })()}
      <Chip t={t} t0={174.3} text="THE CATCH" color={C.violeta} x={160} y={140} size={60} />
      <Grande t={t} t0={176.22} text="2× HEAVIER" x={960} y={150} size={130} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={177.3} text="THAN THE REAL THING" color={C.rojo} x={1540} y={420} centro size={46} />
    </Escena>

    {/* 047-048 · pegarle al poste: cabeza, rodillas, costillas, hasta que los brazos no responden */}
    <Escena t={t} t0={178.3} t1={185.14} zoom={0.04} entra="corte" golpes={[178.84, 179.28, 179.92, 181.06, 181.74, 182.56]}>
      <PlazaArmas t={t} hora="tarde" />
      <Multitud t={t} n={3} filas={1} x0={90} x1={400} y={700} h={200} seed={47} accion="golpear" vel={1.2} giro="34" />
      <Poste x={1160} y={730} s={1.15} />
      {(() => {
        const vel = 1.5, x = 700, y = 1000, h = 660;
        const cans = prog(t, 183.3, 184.3);
        const P = pose("golpear", t - 178.3, vel);
        const k = ((t - 178.3) * vel) % 1;
        const golpes = Math.floor((t - 178.3) * vel + 0.83);
        const n = Math.min(golpes, Math.floor((183.6 - 178.3) * vel + 0.83));
        const mix = (a: number, b: number) => a * (1 - cans) + b * cans;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" giro="34" expr={cans > 0.3 ? "triste" : "enojado"} bD={mix(P.bD, 14)} cD={mix(P.cD, 4)} bI={mix(P.bI, 8)} cI={mix(P.cI, 6)} inclina={mix(P.inclina, 14)}
            agarra={<EnMano.gladius madera />} agarraAng={mix(angGolpe(t - 178.3, vel), 95)} reaccion={cans > 0.5 ? "derrite" : undefined} reaccionT0={184.2} />
          {cans < 0.4 && k > 0.17 && k < 0.34 && <Fogonazo x={1150} y={650} k={(k - 0.17) / 0.17} />}
          {cans > 0.2 && <Emote t={t} t0={183.6} tipo="sudor" {...L(x, y, h)} s={1.2} />}
          <Marcador x={1640} y={150} txt={`HITS: ${Math.max(1, Math.round(n))}`} />
        </>;
      })()}
      <Chip t={t} t0={179.28} t1={183.3} text="AGAIN... AND AGAIN" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={181.06} text="HEAD" color={C.rojo} x={1300} y={545} size={50} />
      <Chip t={t} t0={182.56} text="RIBS" color={C.rojo} x={1300} y={670} size={50} />
      <Chip t={t} t0={181.74} text="KNEES" color={C.rojo} x={1300} y={795} size={50} />
      <Chip t={t} t0={183.6} text="ARMS STOP ANSWERING" color={C.violeta} x={160} y={140} size={56} />
    </Escena>

    {/* 049 · aprender a nadar, con armadura si hace falta */}
    <Escena t={t} t0={185.14} t1={188.08} entra="sube" banda={C.teal} golpes={[186.52]}>
      <Cielo tipo="dia" />
      <Astro x={1600} y={200} r={80} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={600} seed={49} alto={50} />
      {(() => {
        const hund = prog(t, 186.52, 187.5);
        const by = 640 + Math.sin(t * 3) * 14 + hund * 120;
        return <>
          <Persona x={820} y={by + 600} h={900} t={t} seed={1} casco="legion" expr={t > 186.52 ? "miedo" : "neutro"} bD={150 + Math.sin(t * 8) * 25} bI={150 + Math.cos(t * 8) * 25} cD={20} cI={20} />
          <Emote t={t} t0={186.6} tipo="susto" {...L(820, by + 600, 900)} s={1.2} />
        </>;
      })()}
      <Olas t={t} y={690} />
      {/* la armadura cae al agua al lado y lo arrastra */}
      {t > 186.3 && <Armadura x={1300} y={interpolate(prog(t, 186.3, 186.8), [0, 1], [-200, 640]) + Math.sin(t * 3) * 10} s={0.8} rot={10} />}
      <Chip t={t} t0={185.72} text="SWIM" color={C.teal} tinta={C.noche} x={160} y={140} size={64} />
      <Chip t={t} t0={186.52} text="IN ARMOR" color={C.rojo} x={1320} y={300} size={64} />
    </Escena>

    {/* 050 · saltar el caballo por los dos lados, espada en mano: carrera, salto en arco, caída, y de vuelta */}
    <Escena t={t} t0={188.08} t1={192.54} zoom={0.03} entra="barrido" golpes={[188.52, 189.92, 191.26]}>
      <Campamento t={t} tropa={false} />
      <CaballoMadera x={960} y={950} s={1.3} />
      {(() => {
        const PER = 1.48, u0 = (t - 187.9) / PER, ciclo = Math.floor(u0), u = u0 - ciclo;
        const dir = ciclo % 2 === 0 ? 1 : -1;
        const x = 960 + dir * interpolate(u, [0, 1], [-620, 620]);
        const d = Math.abs(x - 960);
        const arco = d < 400 ? Math.cos((d / 400) * Math.PI / 2) : 0;
        const y = 1010 - arco * 420;
        const espada = t > 191.26;
        return <>
          <Persona x={x} y={y} h={460} t={t} seed={1} casco="legion" flip={dir < 0} camina={arco > 0.04 ? 0 : 2.3} expr={arco > 0.3 ? "sorpresa" : "orgullo"}
            bD={arco > 0.04 ? 150 : espada ? 60 : undefined} bI={arco > 0.04 ? 140 : undefined} cD={20} cI={20} inclina={arco > 0.04 ? 12 : 6}
            manoD={espada ? <EspadaMano /> : undefined} />
          {arco < 0.04 && d > 400 && d < 460 && <div style={{ position: "absolute", left: x - 80, top: 990, width: 160, height: 30, borderRadius: "50%", background: "rgba(255,240,200,.6)" }} />}
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={24} seed={64} />
      <Chip t={t} t0={188.52} text="VAULT" color={C.ambar} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={190.2} text="BOTH SIDES" color={C.violeta} x={1520} y={140} centro size={56} />
      <Chip t={t} t0={191.26} text="SWORD IN HAND" color={C.rojo} x={1520} y={250} centro size={52} />
    </Escena>

    {/* 051 · el pilum, jabalina pesada con cuello largo de hierro */}
    <Escena t={t} t0={192.54} t1={196.5} zoom={0.05} entra="diag" golpes={[193.38, 195.4]}>
      <Campamento t={t} tropa={false} />
      {(() => {
        const ciclo = ((t - 192.54) / 1.6) % 1;
        const tira = ciclo * 1.6;
        const P = pose("lanzar", tira);
        const vuela = prog(t, 192.9, 193.6);
        return <>
          <Persona x={330} y={1020} h={600} t={t} seed={1} casco="legion" expr="orgullo" {...(t < 192.9 ? { bD: 160, cD: 20, bI: 50, cI: 30, inclina: -6 } : P)} />
          {t > 192.9 && <Pilum x={interpolate(vuela, [0, 1], [420, 1000])} y={interpolate(vuela, [0, 1], [430, 520]) - Math.sin(vuela * Math.PI) * 90} s={1.5} rot={-8 + vuela * 10} />}
          {t > 192.9 && vuela < 1 && <div style={{ position: "absolute", left: 420, top: 470, width: 560 * vuela, height: 10, borderRadius: 5, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.8))" }} />}
        </>;
      })()}
      {t > 195.4 && <div style={{ position: "absolute", left: 1170, top: 400, width: 500, height: 230, borderRadius: 115, border: `10px solid ${C.ambar}`, transform: `scale(${ent(t, 195.4)})` }} />}
      <Chip t={t} t0={193.38} text="PILUM" color={C.rojo} x={760} y={150} size={72} />
      <Chip t={t} t0={194.08} text="HEAVY JAVELIN" color={C.violeta} x={760} y={270} size={54} />
      <Chip t={t} t0={195.4} text="LONG IRON NECK" color={C.ambar} tinta={C.noche} x={1180} y={730} size={54} />
    </Escena>

    {/* 052 · se dobla al pegar en el escudo: el bárbaro no se la puede devolver y tira el escudo */}
    <Escena t={t} t0={196.5} t1={200.56} zoom={0.04} entra="corte" golpes={[197.46, 198.78]}>
      <Valle t={t} />
      <Multitud t={t} n={4} filas={1} x0={1580} x1={1880} y={560} h={150} seed={52} ropa={BARBARO} casco="no" flip poses={["quieto", "señala", "brazos"]} />
      {t < 197.9
        ? <Persona x={380} y={1000} h={560} t={t} seed={1} casco="legion" giro="34" expr="enojado" {...pose("lanzar", Math.min(0.75, Math.max(0, (t - 196.2) * 1.2)))} />
        : <Persona x={380} y={1000} h={560} t={t} seed={1} casco="legion" giro="34" expr="orgullo" bD={interpolate(prog(t, 197.9, 198.3), [0, 1], [30, 120])} cD={20} bI={25} cI={70}
            agarra={t > 198.1 ? <EnMano.gladius /> : undefined} agarraAng={-55} />}
      {t >= 197.9 && <Escudo x={470} y={760} s={0.62} rot={-6} />}
      {(() => {
        const vuela = prog(t, 196.6, 197.46);
        const dob = t > 197.46 ? Math.min(1, (t - 197.46) * 4) : 0;
        const tira = prog(t, 199.7, 200.4);
        const forcejea = t > 198.9 && t < 199.7;
        const ex = interpolate(tira, [0, 1], [1210, 1080]) + (forcejea ? Math.sin(t * 22) * 10 : 0), ey = interpolate(tira, [0, 1], [640, 880], { easing: (u) => u * u }), er = interpolate(tira, [0, 1], [-8, -80]);
        return <>
          <Persona x={1420} y={990} h={600} t={t} seed={77} ropa={BARBARO} flip giro="34" expr={t > 197.46 ? "enojado" : "orgullo"} reaccion={tira > 0 ? "ojos" : undefined} reaccionT0={199.75}
            bD={forcejea ? 95 + Math.sin(t * 22) * 12 : tira > 0 ? 40 : 70} cD={forcejea ? 20 : 60} bI={forcejea ? 80 + Math.cos(t * 22) * 12 : 60} cI={20} inclina={forcejea ? -10 + Math.sin(t * 22) * 4 : 0} />
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${er + 8}deg)`, transformOrigin: `${ex}px ${ey}px` }}>
            <Escudo x={ex} y={ey} s={0.9} rot={-8} color="#5a3418" />
            {dob === 0
              ? null
              : <Pilum x={ex - 210} y={ey - 30} s={1} rot={14} dobla={dob} />}
          </div>
          {dob === 0 && <Pilum x={interpolate(vuela, [0, 1], [380, 1000])} y={interpolate(vuela, [0, 1], [420, 610]) - Math.sin(vuela * Math.PI) * 80} s={1} rot={14} />}
          <Emote t={t} t0={198.6} t1={199.7} tipo="preg" {...L(1420, 990, 600)} s={1.2} />
        </>;
      })()}
      <Chip t={t} t0={196.86} text="BENDS ON IMPACT" color={C.rojo} x={640} y={170} size={58} />
      <Chip t={t} t0={198.78} text="CAN'T THROW IT BACK" color={C.violeta} x={640} y={290} size={52} />
    </Escena>

    {/* 053 · y después, aprendés a marchar */}
    <Escena t={t} t0={200.56} t1={202.5} entra="sube" banda={C.ambar} golpes={[201.64]}>
      <Ruta t={t} avance={(t - 200.56) * 420} />
      {Array.from({ length: 7 }, (_, i) => <Soldadito key={i} x={260 + i * 230} y={900 + (i % 2) * 20} s={1.6} t={t} seed={10 + i} avanza={1} />)}
      <Persona x={760} y={1010} h={480} t={t} seed={1} casco="legion" expr="orgullo" camina={1.9} />
      <Frente t={t} color="#2a3a1a" vel={260} seed={68} />
      <Grande t={t} t0={201.64} text="MARCH!" y={230} size={170} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 054-055 · Vegecio: 20 millas en 5 horas de verano, 24 a paso rápido — la columna entera marcha con él adentro, el cartel del estándar al costado */}
    <Escena t={t} t0={202.5} t1={210.22} zoom={0.03} entra="corte" golpes={[204.74, 206.28, 209.24]}>
      {(() => {
        const rapido = t > 207.74;
        const av = (t - 202.5) * 340 + Math.max(0, t - 207.74) * 260;
        const sol = prog(t, 202.5, 210.2);
        return <>
          <Ruta t={t} hora={rapido ? "tarde" : "dia"} verde={false} avance={av} />
          <Astro x={240 + sol * 700} y={330 - Math.sin(sol * Math.PI) * 180} r={70} />
          {/* columna: fila de atrás chica y con bruma, fila de adelante más grande; él marcha dentro de la de adelante */}
          {Array.from({ length: 9 }, (_, i) => <Soldadito key={"a" + i} x={-40 + i * 150} y={872} s={1.15} t={t + i * 0.21} seed={120 + i} avanza={1} />)}
          {Array.from({ length: 6 }, (_, i) => i === 3 ? null : <Soldadito key={"b" + i} x={20 + i * 210} y={985} s={1.75} t={t + i * 0.17} seed={130 + i} avanza={1} />)}
          <Persona x={650} y={990} h={470} t={t} seed={1} casco="legion" giro="34" expr={rapido ? "miedo" : "orgullo"} camina={rapido ? 2.6 : 1.7} inclina={rapido ? 9 : 3}
            agarraI={<EnMano.escudo />} agarraAngI={0} bI={40} cI={50} agarra={<EnMano.lanza />} agarraAng={-75} bD={30} cD={60} />
          {rapido && <Emote t={t} t0={208.0} tipo="sudor" {...L(650, 990, 470)} />}
          {/* cartel del estándar oficial, clavado al costado del camino */}
          <div style={{ position: "absolute", left: 1270, top: 190, width: 560, height: 470 }}>
            {[110, 450].map((xx) => <div key={xx} style={{ position: "absolute", left: xx - 14, top: 380, width: 28, height: 330, background: "#6b3a1f", borderRadius: 8 }} />)}
            <div style={{ position: "absolute", inset: 0, background: "#a8783a", border: "9px solid #6b3a1f", borderRadius: 20, boxShadow: "12px 14px 0 rgba(20,8,30,.3)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff8ec", letterSpacing: 2 }}>VEGETIUS SAYS:</div>
          </div>
          <Marcador x={960} y={150} txt={`HOUR ${Math.min(5, 1 + Math.floor(prog(t, 203, 209.8) * 5))} / 5`} color={C.violeta} size={44} />
        </>;
      })()}
      <Chip t={t} t0={203.3} text="OFFICIAL STANDARD" color={C.violeta} x={160} y={140} size={50} t1={209.0} />
      <Cuenta t={t} t0={204.74} t1={205.4} de={0} a={20} x={1550} y={330} size={120} color="#fff" suf=" MILES" />
      <Cuenta t={t} t0={206.28} t1={206.8} de={0} a={5} x={1550} y={460} size={88} color={C.oro} suf=" HOURS" />
      <Chip t={t} t0={209.24} text="FASTER: 24 MILES" color={C.rojo} x={1550} y={570} centro size={50} />
    </Escena>

    {/* 056 · unos 35 km antes del almuerzo */}
    <Escena t={t} t0={210.22} t1={213.48} entra="corte" golpes={[210.88, 212.6]}>
      <Campamento t={t} tropa={false} />
      <Cuenta t={t} t0={210.88} t1={211.6} de={0} a={35} x={960} y={190} size={210} color="#fff" suf=" KM" />
      <Mesa x={1350} y={820} w={420} />
      <Pan x={1350} y={760} s={0.7} />
      {(() => {
        const llega = prog(t, 210.22, 212.4);
        const x = interpolate(llega, [0, 1], [380, 1080]);
        return <>
          <Persona x={x} y={1020} h={560} t={t} seed={1} casco="legion" expr={llega < 1 ? "triste" : "dormido"} camina={llega < 1 ? 1.3 : 0} inclina={llega < 1 ? 12 : interpolate(prog(t, 212.6, 213.2), [0, 1], [12, 34])} />
          <Emote t={t} t0={210.4} tipo="sudor" {...L(x, 1020, 560)} />
        </>;
      })()}
      <Chip t={t} t0={212.6} text="BEFORE LUNCH" color={C.violeta} x={1350} y={560} centro size={60} />
    </Escena>

    {/* 057-058 · tres veces por mes, 10 millas de ida y 10 de vuelta con todo encima */}
    <Escena t={t} t0={213.48} t1={220.8} zoom={0.04} entra="diag" golpes={[213.64, 216.04, 217.18, 218.62]}>
      {(() => {
        // la cámara arranca abierta (ruta entera) y se acerca al doble para SEGUIRLO corriendo la ruta, ida y vuelta
        const ida = prog(t, 214.6, 217.0), vuelta = (t - 217.2) / (220.8 - 217.2);
        const u = t < 217.1 ? ida : 1 - Math.min(1, Math.max(0, vuelta)) * 0.9;
        const bx = (s: number) => (1 - s) ** 3 * 300 + 3 * (1 - s) ** 2 * s * 640 + 3 * (1 - s) * s * s * 1040 + s ** 3 * 1640;
        const by = (s: number) => (1 - s) ** 3 * 800 + 3 * (1 - s) ** 2 * s * 520 + 3 * (1 - s) * s * s * 940 + s ** 3 * 600;
        const x = bx(u), y = by(u) + 20;
        const vuelve = t > 217.1, corre = (t > 214.5 && t < 217.0) || t > 217.25;
        const dir = vuelve ? -1 : 1;
        const Z = interpolate(prog(t, 213.9, 214.9), [0, 1], [1, 1.85], { easing: (k) => k * k * (3 - 2 * k) });
        const cx = Math.min(1920 - 960 / Z, Math.max(960 / Z, x + (vuelve ? -170 : 170)));
        const cy = Math.min(1080 - 540 / Z, Math.max(540 / Z, y - 230));
        const rebote = corre ? Math.abs(Math.sin(t * Math.PI * 1.8)) * 6 : 0;
        const sol = prog(t, 213.5, 220.8);
        return <>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - Z * cx}px, ${540 - Z * cy + rebote}px) scale(${Z})` }}>
            <Campo t={t} />
            <Astro x={300 + sol * 1300} y={260 - Math.sin(sol * Math.PI) * 120} r={60} />
            <Torre x={190} y={760} s={0.55} />
            <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
              <path d="M 300 800 C 640 520 1040 940 1640 600" stroke="#e8c88a" strokeWidth={46} fill="none" strokeLinecap="round" strokeDasharray="2 70" />
              {[0.2, 0.4, 0.6, 0.8].map((m, i) => <g key={i} transform={`translate(${bx(m)} ${by(m) - 34})`}><rect x={-14} y={-46} width={28} height={58} rx={8} fill="#d8d0c4" stroke="#7d7466" strokeWidth={4} /><text x={0} y={-10} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={18} fill="#5a5246">{["II", "IV", "VI", "VIII"][i]}</text></g>)}
              <circle cx={1640} cy={600} r={30} fill={C.ambar} stroke="#fff" strokeWidth={8} />
              <rect x={1660} y={430} width={10} height={170} fill="#6b3a1f" /><path d={`M 1670 430 Q ${1705} ${440 + Math.sin(t * 6) * 6} 1740 450 Q ${1705} ${462 + Math.sin(t * 6 + 1) * 6} 1670 470 Z`} fill={C.rojo} />
            </svg>
            {corre && [0, 1, 2].map((k) => { const ph = ((t * 3 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: x + (vuelve ? 1 : -1) * (40 + ph * 70) - 18, top: y - 14 - ph * 26, width: 36 * (1 - ph) + 8, height: 36 * (1 - ph) + 8, borderRadius: "50%", background: "#d8c08a", opacity: 0.8 * (1 - ph) }} />; })}
            {/* escudo colgado a la espalda (FULL GEAR) */}
            <Escudo x={x - dir * 70} y={y - 210} s={0.42} rot={dir * -14} />
            <Persona x={x} y={y} h={400} t={t} seed={1} casco="legion" giro="34" expr={t > 218.6 ? "triste" : "orgullo"} corre={corre ? (t > 218.6 ? 1.4 : 1.8) : 0} flip={vuelve} inclina={t > 218.6 ? 6 : 0}
              agarra={<EnMano.lanza />} agarraAng={-60} />
            {t > 218.6 && <Emote t={t} t0={218.7} tipo="sudor" {...L(x, y, 380)} s={0.8} />}
          </div>
        </>;
      })()}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1420 + i * 120, top: 190, width: 90, height: 110, background: "#fff8ec", borderRadius: 12, border: "6px solid #2a1530", transform: `scale(${ent(t, 213.64 + i * 0.12)})`, fontFamily, fontWeight: 700, fontSize: 70, color: C.rojo, textAlign: "center", lineHeight: "100px" }}>✓</div>)}
      <Chip t={t} t0={213.8} text="3× A MONTH" color={C.violeta} x={160} y={140} size={60} />
      <Chip t={t} t0={216.04} text="10 MILES OUT" color={C.rojo} x={960} y={150} centro size={50} t1={217.0} />
      <Chip t={t} t0={217.18} text="10 MILES BACK" color={C.rojo} x={960} y={150} centro size={50} />
      <Chip t={t} t0={218.62} text="FULL GEAR" color={C.ambar} tinta={C.noche} x={960} y={1000} centro size={54} />
    </Escena>

    {/* 059 · si fallás, te cambian el trigo por cebada */}
    <Escena t={t} t0={220.8} t1={224.68} entra="barrido" golpes={[220.8, 223.78]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <AbsoluteFill style={{ background: "rgba(140,20,50,.22)" }} />
      {(() => {
        // falla la marcha: la mochila de 30 kg le cae encima y lo dobla; se la saca de encima y le toca comer cebada
        const cae = prog(t, 220.8, 221.0), sale = prog(t, 221.7, 222.1);
        const doblado = t > 221.0 && t < 221.8;
        const hy = cabeza(960, 1030, 560).y + (doblado ? 92 : 0);
        const mx = interpolate(sale, [0, 1], [960, 1250]), my = t < 221.0 ? interpolate(cae, [0, 1], [-200, hy - 40]) : interpolate(sale, [0, 1], [hy - 40, 880], { easing: (k) => k * k });
        return <>
          <Persona x={960} y={1030} h={560} t={t} seed={1} casco="legion" expr={t > 223.78 ? "triste" : "sorpresa"} postura={doblado ? "agachado" : "parado"}
            reaccion={doblado ? "susto" : undefined} reaccionT0={221.0} {...(doblado ? { bD: 150, cD: 30, bI: 150, cI: 30 } : t > 222.0 ? pose("comer", t, 0.8) : { bD: 30, cD: 20, bI: 30, cI: 20 })} />
          <Item k="saco" x={mx} y={my} s={1.5} rot={sale * 30} />
          {t > 221.0 && t < 221.3 && <Fogonazo x={960} y={hy - 60} k={prog(t, 221.0, 221.3)} s={0.9} />}
          <Chip t={t} t0={220.95} t1={221.8} text="30 KG" color={C.rojo} x={1180} y={330} size={58} />
        </>;
      })()}
      <Comida k="trigo" x={520} y={560} s={1.6} t={t} t0={221.4} />
      {t > 223.34 && <svg style={{ position: "absolute", left: 330, top: 360 }} width={400} height={400}><path d="M 40 40 L 360 360 M 360 40 L 40 360" stroke="#fff" strokeWidth={34} strokeLinecap="round" strokeDasharray={460} strokeDashoffset={460 * (1 - prog(t, 223.34, 223.6))} /></svg>}
      <Comida k="cebada" x={1400} y={560} s={1.6} t={t} t0={223.78} />
      <Grande t={t} t0={220.8} text="FAIL?" y={150} size={130} color="#fff" />
      <Chip t={t} t0={223.34} text="WHEAT" color={C.ambar} tinta={C.noche} x={520} y={820} centro size={56} />
      <Chip t={t} t0={223.78} text="BARLEY" color={C.tierra} x={1400} y={820} centro size={56} />
    </Escena>

    {/* 060-061 · la cebada era comida de caballo: sentado junto a la mula, mastican al mismo compas (CHOMP sincronizado) */}
    <Escena t={t} t0={224.68} t1={231.2} zoom={0.03} entra="sube" golpes={[225.04, 228.96]}>
      <Campamento t={t} hora="tarde" tropa={false} angulo="bajo" />
      {(() => {
        const f = 1.1, fase = (t * f) % 1, mast = Math.max(0, Math.sin(t * Math.PI * 2 * f));
        const chomp = fase < 0.55;
        return <>
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${mast * 2.5}deg) translateY(${mast * 8}px)`, transformOrigin: "1150px 900px" }}>
            <Mula x={1240} y={790} s={1.2} t={t} />
          </div>
          <Comida k="cebada" x={1600} y={915} s={0.65} />
          <div style={{ position: "absolute", left: 1500, top: 945, width: 220, height: 70, background: "#8a5a2a", borderRadius: "0 0 30px 30px", border: "6px solid #5a3418" }} />
          <Banco x={600} y={1000} w={240} />
          <Persona x={600} y={1000} h={600} t={t} seed={1} casco="legion" postura="sentado" giro="34" expr={t > 228.96 ? "triste" : "enojado"} habla
            bI={45} cI={95} bD={60 + mast * 55} cD={110 + mast * 25} agarraI={<EnMano.copa />} agarraAngI={-20} />
          {chomp && <>
            <div style={{ position: "absolute", left: 760, top: 470, fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: "rotate(-8deg)" }}>CHOMP</div>
            <div style={{ position: "absolute", left: 1420, top: 470, fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: "rotate(8deg)" }}>CHOMP</div>
          </>}
          <Emote t={t} t0={226.2} t1={228.8} tipo="enojo" {...L(600, 1066, 600)} />
          <Emote t={t} t0={229.6} tipo="lagrimas" {...L(600, 1066, 600)} />
        </>;
      })()}
      <Chip t={t} t0={225.04} text="HORSE FOOD" color={C.tierra} x={160} y={140} size={60} />
      <Chip t={t} t0={226.08} t1={227.6} text="NOT AN INSULT..." color={C.violeta} x={1240} y={240} centro size={54} />
      <Chip t={t} t0={228.96} text="FED LIKE A MULE" color={C.rojo} x={1240} y={240} centro size={64} />
    </Escena>

    {/* 062-063 · Josefo miró al ejército romano desde el bando perdedor */}
    <Escena t={t} t0={231.2} t1={238.98} zoom={0.05} entra="corte" golpes={[235.06, 238.24]}>
      <Valle t={t} hora="noche" />
      <Estrellas t={t} n={60} seed={71} alto={420} />
      <Astro x={1640} y={170} r={60} luna />
      {/* abajo, en el valle, la legion marcha con antorchas: el la mira desde la colina */}
      <FilaLejana y={770} x0={760 - 231 * 36} n={20} paso={36} s={1.9} t={t} marcha={1.2} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 790 + i * 230 + (t - 231) * 36, top: 596 + Math.sin(t * 9 + i) * 3, width: 18, height: 28, borderRadius: "50% 50% 40% 40%", background: "#ffb040", boxShadow: "0 0 22px 10px rgba(255,170,60,.45)" }} />)}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M -50 1080 L -50 860 Q 300 780 640 880 Q 760 930 820 1080 Z" fill="#2a2050" /></svg>
      <Banco x={430} y={985} w={250} piedra />
      <Persona x={430} y={985} h={560} t={t} seed={130} ropa={CIVIL(7)} viejo postura="sentado" giro="34" expr={t > 238.24 ? "triste" : "neutro"} mira={0.6}
        {...(t > 236.0 ? pose("escribir", t, 1.2) : { bD: 40, cD: 80, inclina: 4 })} bI={60} cI={110} agarra={<EnMano.pluma />} agarraAng={-50} agarraI={<EnMano.tablilla />} agarraAngI={-30} />
      <Chip t={t} t0={232.06} t1={234.7} text="A FAMOUS LINE" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={235.06} text="JOSEPHUS" color={C.violeta} x={160} y={140} size={70} />
      <Chip t={t} t0={238.24} text="FROM THE LOSING SIDE" color={C.rojo} x={1000} y={300} size={52} />
    </Escena>

    {/* 064 · ejercicios = batallas sin sangre; batallas = ejercicios sangrientos (pantalla partida) */}
    <Escena t={t} t0={238.98} t1={243.86} entra="corte" golpes={[240.64, 242.7]}>
      {(() => {
        const w = 1920 - 960 * prog(t, 241.86, 242.3);
        const P = pose("golpear", t - 238.98, 1.5), k = ((t - 238.98) * 1.5) % 1;
        const A = pose("apunalar", t - 241.86, 1.2), ka = ((t - 241.86) * 1.2) % 1;
        return <>
          <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 1080, overflow: "hidden" }}>
            <PlazaArmas t={t} />
            <Multitud t={t} n={5} filas={2} x0={1200} x1={1820} y={760} h={240} seed={64} accion="golpear" vel={1.3} giro="34" />
            <Poste x={1010} y={760} s={0.95} />
            <Persona x={720} y={1000} h={560} t={t} seed={1} casco="legion" giro="34" expr="orgullo" {...P} agarra={<EnMano.gladius madera />} agarraAng={angGolpe(t - 238.98, 1.5)} />
            {k > 0.17 && k < 0.34 && <Fogonazo x={1010} y={650} k={(k - 0.17) / 0.17} s={0.8} />}
            <Banco x={330} y={1010} w={220} />
            <Persona x={330} y={1010} h={460} t={t} seed={130} ropa={CIVIL(7)} viejo postura="sentado" giro="34" expr="neutro" {...pose("escribir", t, 1.2)} agarra={<EnMano.pluma />} agarraAng={-50} agarraI={<EnMano.tablilla />} agarraAngI={-20} />
          </div>
          {w < 1920 && <div style={{ position: "absolute", left: w, top: 0, width: 1920 - w, height: 1080, overflow: "hidden", borderLeft: "10px solid #fff" }}>
            <div style={{ position: "absolute", left: -w, top: 0, width: 1920, height: 1080 }}>
              <Valle t={t} hora="tarde" />
              <AbsoluteFill style={{ background: "rgba(120,10,30,.35)" }} />
              <Persona x={1640} y={990} h={560} t={t} seed={78} ropa={BARBARO} flip giro="34" expr={ka > 0.25 && ka < 0.6 ? "miedo" : "enojado"} bD={120} cD={40} inclina={ka > 0.25 && ka < 0.6 ? -10 : 0} agarra={<EnMano.garrote />} agarraAng={-70} />
              <Persona x={1260} y={1000} h={560} t={t} seed={1} casco="legion" giro="34" expr="enojado" {...A} agarra={<EnMano.gladius />} agarraAng={0} />
              {ka > 0.22 && ka < 0.36 && <Fogonazo x={1560} y={700} k={(ka - 0.22) / 0.14} s={0.8} />}
            </div>
          </div>}
        </>;
      })()}
      <Chip t={t} t0={238.98} text="JOSEPHUS WROTE:" color={C.violeta} x={130} y={200} size={46} />
      {/* la cita se escribe en el globo de Josephus (sale de su cabeza, abajo a la izquierda) */}
      {(() => {
        const q = "THEIR DRILLS ARE BLOODLESS BATTLES...";
        const n = Math.round(q.length * prog(t, 239.15, 240.64));
        const e = ent(t, 239.0);
        return <div style={{ position: "absolute", left: 130, top: 290, width: 500, transform: `scale(${e})`, transformOrigin: "160px 300px" }}>
          <div style={{ position: "relative", padding: "26px 34px", borderRadius: 36, background: "#fff8ec", border: "7px solid #2a1530", boxShadow: "0 10px 0 rgba(42,21,48,.35)", fontFamily, fontWeight: 700, fontSize: 46, lineHeight: 1.12, color: "#2a1530", minHeight: 150 }}>
            <span>{q.slice(0, Math.min(n, q.indexOf("BLOODLESS")))}</span>
            {n > q.indexOf("BLOODLESS") && <span style={{ color: C.teal }}>{q.slice(q.indexOf("BLOODLESS"), n)}</span>}
            {n < q.length && Math.floor(t * 4) % 2 === 0 && <span style={{ color: C.rojo }}>|</span>}
            <svg style={{ position: "absolute", left: 190, bottom: -78, overflow: "visible" }} width={90} height={80}><path d="M 10 -6 L 22 74 L 70 -6 Z" fill="#fff8ec" stroke="#2a1530" strokeWidth={7} strokeLinejoin="round" /><rect x={14} y={-14} width={50} height={14} fill="#fff8ec" /></svg>
          </div>
        </div>;
      })()}
      <Grande t={t} t0={242.12} text="BATTLES =" x={1440} y={150} size={90} color="#fff" />
      <Grande t={t} t0={242.7} text="BLOODY DRILLS" x={1440} y={270} size={66} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 065 · no era un elogio */}
    <Escena t={t} t0={243.86} t1={245.88} entra="zoom" golpes={[244.92]}>
      <Interior />
      <Mesa x={1180} y={800} w={520} />
      <Pergamino x={1180} y={700} w={380} abre={1} lineas={5} />
      <Banco x={760} y={1000} w={260} />
      <Persona x={760} y={1000} h={700} t={t} seed={130} ropa={CIVIL(7)} viejo postura="sentado" giro="34" expr="enojado" {...pose("escribir", t, 1.2)} agarra={<EnMano.pluma />} agarraAng={-40} />
      <Emote t={t} t0={244.3} tipo="enojo" {...L(760, 1080, 700)} s={1.4} />
      <Chip t={t} t0={244.34} text="NOT A COMPLIMENT" color={C.rojo} x={1180} y={240} centro size={64} />
    </Escena>

    {/* 066-067 · mil repeticiones contra el poste; el día que aparece un enemigo real ya lo hizo todo, salvo morir */}
    <Escena t={t} t0={245.88} t1={253.76} zoom={0.05} entra="corte" golpes={[248.64, 250.8, 252.6]}>
      <Campamento t={t} hora={t < 252.1 ? "dia" : "noche"} tropa={false} />
      {t > 252.1 && <AbsoluteFill style={{ background: "rgba(90,10,30,.45)" }} />}
      {(() => {
        const real = t > 248.34;
        const P = real ? pose("apunalar", t - 248.34, 1.2) : pose("golpear", t - 245.88, 1.6);
        const k = real ? ((t - 248.34) * 1.2) % 1 : ((t - 245.88) * 1.6) % 1;
        const miedo = prog(t, 252.1, 252.5);
        return <>
          {!real && <Poste x={1150} y={760} s={1.05} />}
          {real && <Persona x={1300} y={1000} h={620} t={t} seed={78} ropa={BARBARO} flip aparece={248.34} expr={t > 252.1 ? "feliz" : "enojado"} bD={110 + Math.sin(t * 5) * 20} cD={40} manoD={<HachaMano />} />}
          <Persona x={700} y={1010} h={620} t={t} seed={1} casco="legion" expr={t > 252.1 ? "miedo" : real ? "enojado" : "orgullo"}
            bD={P.bD * (1 - miedo) + 120 * miedo} cD={P.cD * (1 - miedo) + 125 * miedo} bI={P.bI * (1 - miedo) + 120 * miedo} cI={P.cI * (1 - miedo) + 125 * miedo} inclina={P.inclina * (1 - miedo) - 6 * miedo}
            manoD={<EspadaMano madera={!real} />} />
          {miedo < 0.5 && k > (real ? 0.2 : 0.17) && k < (real ? 0.34 : 0.34) && <Fogonazo x={real ? 1150 : 1140} y={real ? 720 : 660} k={(k - 0.17) / 0.17} s={0.9} />}
          {t > 252.3 && <Emote t={t} t0={252.3} tipo="susto" {...L(700, 1010, 620)} s={1.1} />}
        </>;
      })()}
      {t < 250.7 && <Marcador x={1640} y={150} txt={`REPS: ${Math.round(interpolate(t, [245.9, 250.6], [1, 990], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} />}
      <Chip t={t} t0={248.34} t1={250.4} text="A REAL ENEMY" color={C.rojo} x={1300} y={240} centro size={54} />
      {t < 252.0 && <Cuenta t={t} t0={250.8} t1={251.6} de={1} a={1000} x={960} y={190} size={170} color="#fff" suf="×" />}
      <Craneo x={1000} y={330} s={1.3} t={t} t0={252.6} />
      <Chip t={t} t0={252.1} text="EXCEPT THE DYING PART" color={C.rojo} x={960} y={140} centro size={60} />
    </Escena>
  </>
);
