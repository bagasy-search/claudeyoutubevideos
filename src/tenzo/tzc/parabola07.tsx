// tz07 · LA PARÁBOLA (133,2-284,1 s): Corinto, Diógenes en el barril y Alejandro que le tapa el sol. Mundo cálido, sin HUD.
// Cada plano = la frase de ese segundo (plan D:/rtmp/tz07_PLAN_MxM.md, acto 3). Tramos en SEGUNDOS ABSOLUTOS de la voz.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { F_HUD, TextoMano } from "../../anikit/pantalla";
import { Look } from "../../anikit/personaje";
import { ALDEANA, ALDEANO, PAL_ANT } from "../elenco";
import { FarolMano } from "../utileria";
import { Agora, AGORA_PISO, AGORA_PUNTOS as A, Barril, SombraRey } from "../sets/agora";
import { TramoS } from "./tramos";

const pal = PAL_ANT;
const P = AGORA_PISO;
const ESC = 1.2;
const CALIDA = { lado: 1 as const, color: "#ffd890", fuerza: 0.85 };
const fr = (t: number) => Math.round(t * 30);
const loc = (t0: number, t: number) => fr(t - t0);
const hab = (t0: number, p: [number, number][]): [number, number][] => p.map(([a, b]) => [loc(t0, a), loc(t0, b)]);

// ---------- elenco de Corinto ----------
export const DIOGENES: Look = { estilo: "frijol", piel: "#c99a70", camisa: "#9a8a6a", miembro: "#c99a70", pantalon: "#9a8a6a", zapatos: "#c99a70", ceja: "#6a5e50",
  accesorios: [{ t: "pelo", forma: "corto", color: "#7a7166" }, { t: "barba", color: "#7d7062" }, { t: "tunica", color: "#9a8a6a", largo: 0.85 }] };
export const ALEJANDRO: Look = { estilo: "frijol", piel: "#ecc59a", camisa: "#f2c14a", miembro: "#ecc59a", pantalon: "#b8323a", zapatos: "#d9a22a",
  accesorios: [{ t: "pelo", forma: "punta", color: "#3a2416" }, { t: "corona", color: "#ffd24a" }, { t: "bufanda", color: "#b8323a" }, { t: "chaleco", color: "#ffd86a" }, { t: "tunica", color: "#b8323a", largo: 0.45 }], alto: 1.12 };
export const REY_ESC = 1.2 * 1.32;
const GENERAL: Look = { estilo: "frijol", piel: "#d9a273", camisa: "#a86a2e", miembro: "#d9a273", pantalon: "#8a5a2a", zapatos: "#6a4a2a", accesorios: [{ t: "gorra", color: "#c08a3a" }, { t: "barba", color: "#3a2618" }, { t: "chaleco", color: "#b08a4a" }] };
const SOLDADO: Look = { estilo: "frijol", piel: "#d9a273", camisa: "#a8322c", miembro: "#d9a273", pantalon: "#8a2a24", zapatos: "#6a4a2a", accesorios: [{ t: "gorra", color: "#b08a4a" }, { t: "chaleco", color: "#b08a4a" }] };
const FILOSOFO = (barba: string, piel = "#d9a878"): Look => ({ estilo: "frijol", piel, camisa: "#ece2cc", miembro: piel, pantalon: "#ece2cc", zapatos: "#8a6a4a", accesorios: [{ t: "pelo", forma: "calvo", color: piel }, { t: "barba", color: barba }, { t: "tunica", color: "#ece2cc", largo: 1 }] });
const NENE: Look = { estilo: "frijol", piel: "#d9a273", camisa: "#e9c27a", miembro: "#d9a273", pantalon: "#e9c27a", zapatos: "#d9a273", alto: 0.72, accesorios: [{ t: "pelo", forma: "corto", color: "#2a1a10" }] };
const CHICO_A: Look = { ...NENE, camisa: "#c8603a", pantalon: "#c8603a", accesorios: [{ t: "pelo", forma: "punta", color: "#2a1a10" }] };
const CHICO_B: Look = { ...NENE, camisa: "#6a9a7a", pantalon: "#6a9a7a", accesorios: [{ t: "pelo", forma: "bob", color: "#3a2214" }] };

export const BX = A.barril; // la boca del barril (abre a la derecha)
export const DIO = { x: BX - 40, y: P }; // Diógenes sentado en la boca del barril
export const REY = BX + 330; // donde se para Alejandro (entre el sol y el barril)
export const ACOSTADO = { tronco: -38, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 30, cD: 130, cabeza: -18 };

// rótulo recto y chico de lugar / nombre
const Rotulo: React.FC<{ texto: string; desde: number; hasta: number }> = ({ texto, desde, hasta }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 12, hasta - 12, hasta], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 92, bottom: 86, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "#fff6e2", opacity: o, textShadow: "0 3px 10px rgba(60,30,10,0.6)" }}>{texto}</div>;
};

// el barril en dos capas con Diógenes entre medio
export const BarrilCon: React.FC<{ dio?: Partial<React.ComponentProps<typeof Actor>> | null }> = ({ dio = {} }) => (
  <>
    <Barril x={BX} y={P} capa="atras" />
    {dio !== null && <Actor look={DIOGENES} escala={ESC} seed={71} luz={CALIDA} ruta={[{ f: 0, x: DIO.x, y: DIO.y }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 26 }]}
      poses={[{ f: 0, v: ACOSTADO }]} caras={[{ f: 0, v: "feliz" }]} {...dio} />}
    <Barril x={BX} y={P} capa="boca" />
  </>
);
// gente del mercado (vendedores y compradores que van y vienen)
const Gente: React.FC<{ quietos?: boolean; x0?: number; apartarse?: number }> = ({ quietos, x0 = 900, apartarse = 0 }) => {
  const f = useF();
  const L = [ALDEANO, ALDEANA, { ...ALDEANO, camisa: "#b8604a" }, { ...ALDEANA, camisa: "#6a8aa0", pantalon: "#6a8aa0", accesorios: [{ t: "pelo" as const, forma: "cola" as const, color: "#22160e" }, { t: "tunica" as const, color: "#6a8aa0", largo: 1 }] }, { ...ALDEANO, camisa: "#d9b46a" }];
  return (
    <>
      {L.map((lk, i) => {
        const x = x0 + i * 330 + (i % 2 ? -1 : 1) * apartarse * 90;
        const mov = quietos ? 0 : 140 * Math.sin(f / 70 + i * 1.7);
        return <Actor key={i} look={lk} escala={ESC * (0.95 + 0.05 * (i % 2))} seed={80 + i} luz={CALIDA} ruta={[{ f: 0, x: x + mov, y: P + 10 }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]}
          poses={[{ f: 0, v: quietos ? "firme" : i % 3 === 0 ? "hablar" : "parado" }]} caras={[{ f: 0, v: quietos ? "sorpresa" : i % 2 ? "risa" : "feliz" }]} habla={quietos ? [] : [[0, 600]]} />;
      })}
    </>
  );
};
// la escolta de Alejandro: 2 generales y 3 soldados detrás de él
export const Escolta: React.FC<{ x: number; dir?: 1 | -1; espada?: number; risa?: boolean; ruta?: { f: number; x: number }[] }> = ({ x, dir = 1, espada = 0, risa, ruta }) => (
  <>
    {[GENERAL, SOLDADO, GENERAL, SOLDADO, SOLDADO].map((lk, i) => {
      const off = -(i + 1) * 150 * dir;
      return <Actor key={i} look={lk} escala={ESC} seed={90 + i} luz={CALIDA} dir={[{ f: 0, v: dir }]}
        ruta={(ruta ?? [{ f: 0, x }]).map((r) => ({ f: r.f + i * 4, x: r.x + off, y: P + (i % 2) * 14 }))}
        poses={[{ f: 0, v: espada > 0 && lk === SOLDADO ? { hD: -20 + 40 * espada, cD: 90 * espada, tronco: 4 } : "firme" }]}
        caras={[{ f: 0, v: risa && lk === GENERAL ? "risa" : espada > 0 ? "enojo" : "neutral" }]} habla={risa && lk === GENERAL ? [[0, 300]] : []} />;
    })}
  </>
);

// ---------- planos ----------
// 133,2-142,0 · «Greece… Corinth, white stone, blue sea, a market full of people shouting…»
const Corinto: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={101} mano={2}
    claves={[mira(0, 600, 520, 0.78), mira(264, 1500, 540, 0.82, { curva: "inout" })]}
    medio={<Gente />}
    hud={<Rotulo texto="CORINTH · 336 BC" desde={8} hasta={258} />} />
);
// 142,0-156,2 · «in the corner of the market, lying in the sun, inside a big clay barrel… is a man. Dirty beard, bare feet…»
const LaEsquina: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={102} mano={2}
    claves={[mira(0, 1900, 540, 0.85), mira(220, BX - 60, P - 200, 1.35, { curva: "inout" }), mira(426, BX - 40, P - 190, 1.55)]}
    medio={<><Gente x0={1100} /><BarrilCon dio={{ caras: [{ f: 0, v: "feliz" }] }} /></>} />
);
// 156,2-157,7 · «His name is Diogenes.»
const Nombre: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={103} mano={1.4}
    claves={[mira(0, DIO.x + 20, P - 230, 2.4), mira(45, DIO.x + 20, P - 230, 2.5)]}
    medio={<BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }] }} />}
    hud={<Rotulo texto="DIOGENES" desde={2} hasta={45} />} />
);
// 157,7-162,3 · «People laugh at him, children throw olives at him, he does not care.»
const Aceitunas: React.FC = () => {
  const f = useF();
  const tiros = [10, 40, 75, 105];
  return (
    <Escena Set={Agora} pal={pal} seed={104} mano={2}
      claves={[mira(0, BX + 200, P - 220, 1.15), mira(138, BX + 180, P - 220, 1.22)]}
      medio={<>
        <BarrilCon dio={{ caras: [{ f: 0, v: "feliz" }] }} />
        {[CHICO_A, CHICO_B].map((lk, i) => (
          <Actor key={i} look={lk} escala={ESC} seed={110 + i} luz={CALIDA} ruta={[{ f: 0, x: BX + 520 + i * 150, y: P }]} dir={[{ f: 0, v: -1 }]}
            poses={tiros.flatMap((t, k) => (k % 2 === i ? [{ f: t - 8, v: "tirarCarga" }, { f: t, v: "tirarSuelta" }, { f: t + 14, v: "parado" }] : []))} caras={[{ f: 0, v: "risa" }]} />
        ))}
        {tiros.map((t, k) => {
          const u = (f - t) / 22;
          if (u < 0 || u > 1.6) return null;
          const x0 = BX + 520 + (k % 2) * 150 - 60, x1 = DIO.x + 60;
          const x = u <= 1 ? x0 + (x1 - x0) * u : x1 + (u - 1) * 120;
          const y = u <= 1 ? P - 230 - Math.sin(u * Math.PI) * 120 + u * 60 : P - 170 + (u - 1) * (u - 1) * 300 - Math.sin((u - 1) * Math.PI * 1.7) * 60;
          return <ellipse key={k} cx={x} cy={Math.min(P - 6, y)} rx={9} ry={7} fill="#5a6a2a" stroke="#3a4a1a" strokeWidth={2} />;
        })}
      </>} />
  );
};
// 162,3-173,5 · «Every morning he walks around the market with a lantern, in broad daylight… I am looking for an honest man.»
const ConFarol: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={105} mano={2.2}
    claves={[mira(0, 2300, 560, 1.0), mira(336, 1450, 570, 1.12, { curva: "inout" })]}
    medio={<>
      <Gente x0={1000} quietos />
      <Actor look={DIOGENES} escala={ESC} seed={71} luz={CALIDA} ruta={[{ f: 0, x: 2500, y: P + 20 }, { f: 120, x: 1990, y: P + 20 }, { f: 170, x: 1990, y: P + 20 }, { f: 260, x: 1650, y: P + 20 }]}
        poses={[{ f: 0, v: { hD: 75, cD: 20 } }, { f: 130, v: { hD: 110, cD: 10 } }, { f: 170, v: { hD: 75, cD: 20 } }, { f: 270, v: { hD: 110, cD: 10 } }]}
        caras={[{ f: 0, v: "neutral" }, { f: loc(162.3, 168.4), v: "feliz" }]} habla={hab(162.3, [[168.4, 173.5]])} enManoD={<FarolMano />} dir={[{ f: 0, v: -1 }]} />
    </>} />
);
// 173,5-178,1 · «Diogenes used to have one more thing, a wooden cup, for drinking water.»
const Vaso: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}><path d="M-14,-22 L14,-22 L10,8 Q0,12 -10,8 Z" fill="#9a6a3a" stroke="#6a4424" strokeWidth={3} /><path d="M-12,-16 L12,-16" stroke="#c99060" strokeWidth={3} /></g>
);
const ElVaso: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={106} mano={1.3}
    claves={[mira(0, A.fuente - 260, P - 230, 2.6), mira(138, A.fuente - 260, P - 230, 2.8)]}
    medio={<Actor look={DIOGENES} escala={ESC} seed={71} luz={CALIDA} ruta={[{ f: 0, x: A.fuente - 300, y: P }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: { hD: 50, cD: 80, hI: 20, cI: 30 } }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Vaso x={10} y={0} rot={-90} />} />} />
);
// 178,1-184,3 · «a little boy at the fountain drinking from his own two hands, and Diogenes threw his cup away»
const LaFuente: React.FC = () => {
  const f = useF();
  const tira = loc(178.1, 182.6);
  const u = interpolate(f, [tira, tira + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Agora} pal={pal} seed={107} mano={2}
      claves={[mira(0, A.fuente - 120, P - 220, 1.4), mira(186, A.fuente - 140, P - 220, 1.5)]}
      medio={<>
        <Actor look={NENE} escala={ESC} seed={120} luz={CALIDA} ruta={[{ f: 0, x: A.fuente + 40, y: P }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { tronco: 22, hI: 70, cI: 80, hD: 70, cD: 80, cabeza: 8 } }, { f: 40, v: { tronco: 8, hI: 95, cI: 120, hD: 95, cD: 120, cabeza: -6 } }, { f: 80, v: { tronco: 22, hI: 70, cI: 80, hD: 70, cD: 80, cabeza: 8 } }, { f: 120, v: { tronco: 8, hI: 95, cI: 120, hD: 95, cD: 120, cabeza: -6 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={DIOGENES} escala={ESC} seed={71} luz={CALIDA} ruta={[{ f: 0, x: A.fuente - 300, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 50, cD: 80, hI: 20, cI: 30 } }, { f: tira - 8, v: { hD: -30, cD: 40 } }, { f: tira, v: { hD: 120, cD: 10 } }, { f: tira + 20, v: "parado" }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: tira + 20, v: "risa" }]} enManoD={(fl) => (fl < tira ? <Vaso x={10} y={0} rot={-90} /> : null)} />
        {f >= tira && <Vaso x={A.fuente - 270 - 380 * u} y={P - 260 - Math.sin(u * Math.PI) * 180 + u * 250} rot={u * 540} />}
      </>} />
  );
};
// 184,3-189,4 · «A child has beaten me… I have been carrying something I did not need.»
const MeGano: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={108} mano={1.6}
    claves={[mira(0, A.fuente - 300, P - 260, 2.1), mira(153, A.fuente - 300, P - 260, 2.25)]}
    medio={<Actor look={DIOGENES} escala={ESC} seed={71} luz={CALIDA} ruta={[{ f: 0, x: A.fuente - 300, y: P }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: { hD: 40, cD: 120, cabeza: -6 } }, { f: 60, v: "manosCintura" }]} caras={[{ f: 0, v: "risa" }, { f: 70, v: "feliz" }]} habla={hab(184.3, [[184.3, 186.7], [186.7, 189.4]])} />} />
);
// 189,4-199,2 · «Now. At the gates of Corinth comes the most powerful man in the world, Alexander… twenty years old.»
const LaPuerta: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={109} mano={2.4}
    claves={[mira(0, A.puerta + 300, P - 300, 0.9, { rot: 1.5 }), mira(294, A.puerta + 700, P - 340, 1.05, { rot: 2, curva: "inout" })]}
    medio={<>
      <Escolta x={0} ruta={[{ f: 0, x: A.puerta - 200 }, { f: 260, x: A.puerta + 700 }]} />
      <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: A.puerta - 200, y: P + 20 }, { f: 260, x: A.puerta + 760, y: P + 20 }]}
        poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "feliz" }]} dir={[{ f: 0, v: 1 }]} />
      <Halo x={A.puerta + 600} y={P - 420} r={420} color="#ffe6a0" fuerza={0.4} />
    </>}
    hud={<Rotulo texto="ALEXANDER · 20" desde={loc(189.4, 196.5)} hasta={294} />} />
);
// 199,2-204,5 · «He will conquer Persia, he will conquer Egypt. He will march all the way to India.» (mapa pergamino)
const Mapa: React.FC<{ hasta?: number }> = ({ hasta = 1 }) => {
  const f = useF();
  const pts = [[520, 470], [900, 520], [1180, 460], [980, 700], [1180, 460], [1560, 420]];
  const tramos = [[0, 1, 0], [1, 2, 40], [2, 3, 70], [4, 5, 105]] as const;
  const lbl: [string, number, number, number][] = [["GREECE", 470, 420, 0], ["PERSIA", 1200, 410, 40], ["EGYPT", 940, 770, 70], ["INDIA", 1580, 380, 105]];
  return (
    <AbsoluteFill style={{ background: "#2a1a10" }}>
      <svg width={1920} height={1080} style={{ transform: `scale(${1 + f * 0.0006})`, transformOrigin: "50% 50%" }}>
        <rect x={140} y={110} width={1640} height={860} rx={20} fill="#efd9a8" />
        <rect x={160} y={130} width={1600} height={820} rx={14} fill="none" stroke="#c9a46a" strokeWidth={4} />
        <path d="M300,560 Q420,380 600,420 Q700,470 760,420 Q900,360 1100,380 Q1300,300 1500,330 Q1700,350 1720,480 Q1700,640 1500,620 Q1350,600 1250,560 Q1150,640 1100,760 Q1000,880 880,800 Q820,700 900,620 Q760,600 640,640 Q480,700 360,640 Z" fill="#e2c288" stroke="#b8925a" strokeWidth={4} />
        <path d="M640,640 Q700,600 820,610" fill="none" stroke="#8fb4c8" strokeWidth={30} opacity={0.5} />
        {tramos.map(([a, b, t0], i) => {
          const u = Math.min(hasta, interpolate(f, [t0, t0 + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const [x0, y0] = pts[a], [x1, y1] = pts[b];
          return <g key={i}>
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * u} y2={y0 + (y1 - y0) * u} stroke="#d99a1a" strokeWidth={12} strokeLinecap="round" strokeDasharray="2 22" />
            {u > 0.98 && <circle cx={x1} cy={y1} r={14} fill="#d99a1a" />}
          </g>;
        })}
        <circle cx={pts[0][0]} cy={pts[0][1]} r={14} fill="#d99a1a" />
        {lbl.map(([t, x, y, t0]) => <text key={t} x={x} y={y} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#6a4424" opacity={interpolate(f, [t0, t0 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>{t}</text>)}
      </svg>
    </AbsoluteFill>
  );
};
// 204,5-213,4 · «Armies kneel… every philosopher in Greece has come running to bow to him. Every philosopher, except one.»
const Reverencia: React.FC = () => {
  const barbas = ["#e9e6e0", "#5a4a3a", "#b0a898", "#2a1a10", "#d6d0c4"];
  return (
    <Escena Set={Agora} pal={pal} seed={110} mano={2}
      claves={[mira(0, A.stoa - 100, P - 260, 1.1), mira(267, A.stoa + 1100, P - 260, 1.15, { curva: "inout" })]}
      medio={<>
        {barbas.map((b, i) => (
          <Actor key={i} look={FILOSOFO(b, i % 2 ? "#d9a273" : "#c99a70")} escala={ESC} seed={140 + i} luz={CALIDA} ruta={[{ f: 0, x: A.stoa - 200 + i * 230, y: P }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "firme" }, { f: 20 + i * 26, v: { tronco: 46, cabeza: 16, hD: 30, cD: 60, hI: 30, cI: 60 } }]} caras={[{ f: 0, v: "neutral" }]} />
        ))}
        {/* el hueco: un sitio vacío al final de la fila */}
        <ellipse cx={A.stoa - 200 + 5 * 230 + 60} cy={P + 4} rx={60} ry={10} fill="#000" opacity={0.08} />
      </>} />
  );
};
// 213,4-226,5 · «So Alexander… goes to find him, with his generals… gold on his armor shining like fire… the whole market goes quiet… He stops in front of the barrel.»
const Marcha: React.FC = () => {
  const f = useF();
  const ap = interpolate(f, [loc(213.4, 222.0), loc(213.4, 224.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruta = [{ f: 0, x: 900 }, { f: loc(213.4, 225.8), x: REY + 40 }];
  return (
    <Escena Set={Agora} pal={pal} seed={111} mano={2.2}
      claves={[mira(0, 1300, 560, 0.95), mira(loc(213.4, 224.5), REY - 200, 560, 0.95, { curva: "inout" }), mira(393, REY - 220, 560, 1.05)]}
      medio={<>
        <Gente x0={1500} quietos={ap > 0.3} apartarse={ap} />
        <BarrilCon />
        <Escolta x={0} ruta={ruta.map((r) => ({ f: r.f, x: r.x - 60 }))} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={ruta.map((r) => ({ f: r.f, x: r.x, y: P + 20 }))} poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "neutral" }]} />
        <Halo x={REY - 300 + (f / 393) * 300} y={P - 330} r={300} color="#ffd36a" fuerza={0.35} />
      </>} />
  );
};
// 226,5-233,7 · «Diogenes is lying there, warming himself in the sun. He does not get up. Alexander looks down at him.»
const Picado: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={112} mano={1.6}
    claves={[mira(0, DIO.x + 160, P - 260, 1.6, { rot: -4 }), mira(216, DIO.x + 170, P - 240, 1.78, { rot: -5, curva: "inout" })]}
    medio={<>
      <BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }] }} />
      <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: { tronco: 10, cabeza: 22, hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.8 } }]} />
    </>} />
);
// 233,7-241,0 · «I am Alexander, the great king. Diogenes opens one eye: and I am Diogenes, the dog.»
const Presentan: React.FC = () => {
  const f = useF();
  const corte = loc(233.7, 236.8);
  return f < corte ? (
    <Escena Set={Agora} pal={pal} seed={113} mano={1.4}
      claves={[mira(0, REY + 40, P - 340, 2.1, { rot: 2 })]}
      medio={<Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: { hD: 50, cD: 100, cabeza: -6 } }]} caras={[{ f: 0, v: "neutral" }]} habla={[[0, corte - 4]]} miradas={[{ f: 0, v: { x: -0.8, y: 0.6 } }]} />} />
  ) : (
    <Escena Set={Agora} pal={pal} seed={114} mano={1.4}
      claves={[mira(0, DIO.x + 30, P - 220, 2.3, { rot: -2 })]}
      medio={<BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }, { f: corte + 8, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.8, y: -0.6 } }], habla: [[corte + 30, loc(233.7, 241)]] }} />} />
  );
};
// 241,0-251,9 · «Alexander smiles… ask me for anything… gold, a palace, a city, it is yours.»
const Ofrece: React.FC = () => {
  const f = useF();
  const icon = (t: number) => interpolate(f, [loc(241, t), loc(241, t) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const oro = { fill: "none", stroke: "#ffcf4a", strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <Escena Set={Agora} pal={pal} seed={115} mano={2}
      claves={[mira(0, BX + 160, P - 330, 1.05), mira(327, BX + 160, P - 350, 1.12)]}
      medio={<>
        <BarrilCon />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "firme" }, { f: loc(241, 244.4), v: { hI: 120, cI: 20, hD: 115, cD: 25, cabeza: -6 } }]} caras={[{ f: 0, v: "risa" }, { f: 40, v: "feliz" }]} habla={hab(241, [[244.4, 251.9]])} />
        <g opacity={icon(248.4)} transform={`translate(${BX - 120},${P - 680})`}><rect {...oro} x={-60} y={-30} width={120} height={70} rx={8} /><path {...oro} d="M-60,-30 Q0,-80 60,-30 M-12,0 h24 v18 h-24 Z" /></g>
        <g opacity={icon(249.6)} transform={`translate(${BX + 120},${P - 720})`}><path {...oro} d="M-80,50 V-10 L0,-60 L80,-10 V50 Z M-50,50 V0 M-20,50 V0 M20,50 V0 M50,50 V0" /></g>
        <g opacity={icon(250.6)} transform={`translate(${BX + 370},${P - 680})`}><path {...oro} d="M-90,50 V-20 H-50 V-50 H-10 V-5 H30 V-70 H70 V50 Z M-75,0 h10 M15,-40 h10 M50,-30 h10" /></g>
      </>} />
  );
};
// 251,9-259,3 · «The whole market holds its breath… please step a little to the side, you are blocking my sun.»
const MiSol: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Agora} pal={pal} seed={116} mano={1}
      claves={[mira(0, BX + 120, P - 260, 1.35), mira(222, BX + 80, P - 250, 1.55, { curva: "inout" })]}
      medio={<>
        <BarrilCon dio={{ caras: [{ f: 0, v: "neutral" }], habla: hab(251.9, [[255.0, 259.3]]), poses: [{ f: 0, v: ACOSTADO }, { f: loc(251.9, 256.0), v: { ...ACOSTADO, hD: 70, cD: 40 } }, { f: loc(251.9, 256.6), v: { ...ACOSTADO, hD: 90, cD: 20 } }, { f: loc(251.9, 257.2), v: { ...ACOSTADO, hD: 70, cD: 40 } }, { f: loc(251.9, 257.8), v: { ...ACOSTADO, hD: 90, cD: 20 } }] }} />
        <SombraRey x={REY + 40} y={P - 2} largo={560} fuerza={0.45} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { hI: 40, cI: 40, hD: 40, cD: 40 } }]} caras={[{ f: 0, v: "feliz" }, { f: loc(251.9, 257), v: "sorpresa" }]} />
      </>}
      hud={<TextoMano texto="you are blocking my sun." x={960} y={880} centro desde={loc(251.9, 257.0)} color="#fbf4e6" tam={100} vel={1.6} rot={0} brillo={false} />} />
  );
};
// 259,3-269,0 · «The soldiers reach for their swords, the generals laugh nervously, somebody says, this man is crazy»
const Espadas: React.FC = () => {
  const f = useF();
  const e = interpolate(f, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Agora} pal={pal} seed={117} mano={2.4}
      claves={[mira(0, REY + 200, P - 300, 1.0), mira(291, REY + 260, P - 300, 1.08)]}
      medio={<>
        <BarrilCon />
        <Escolta x={REY + 800} dir={-1} espada={e} risa={f > 90} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "duda" }]} />
      </>} />
  );
};
// 269,0-276,9 · «But Alexander does not laugh… looking at the man in the barrel… completely, perfectly happy in the sun.» (se corre: vuelve el sol)
const SeCorre: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [120, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Agora} pal={pal} seed={118} mano={1.4}
      claves={[mira(0, BX + 160, P - 250, 1.25), mira(237, BX + 120, P - 240, 1.45, { curva: "inout" })]}
      medio={<>
        <BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }, { f: 200, v: "feliz" }] }} />
        <SombraRey x={REY + 40 + u * 260} y={P - 2} largo={560} fuerza={0.45 * (1 - u)} />
        <Halo x={DIO.x + 60} y={P - 180} r={380} color="#fff0b0" fuerza={0.45 * u} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: REY + 40, y: P + 20 }, { f: 120, x: REY + 40, y: P + 20 }, { f: 190, x: REY + 300, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.6 } }]} />
      </>} />
  );
};
// 276,9-284,1 · «If I were not Alexander, I would wish to be Diogenes.»
const Deseo: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={119} mano={1.2}
    claves={[mira(0, REY + 300, P - 340, 2.4), mira(216, REY + 300, P - 345, 2.7, { curva: "inout" })]}
    medio={<Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: -1, color: "#fff4c8", fuerza: 1.2 }} ruta={[{ f: 0, x: REY + 300, y: P + 20 }]} dir={[{ f: 0, v: -1 }]}
      poses={[{ f: 0, v: { hD: 20, cD: 30, hI: 20, cI: 30, cabeza: 6 } }]} caras={[{ f: 0, v: "neutral" }, { f: loc(276.9, 280.4), v: "feliz" }]} habla={hab(276.9, [[280.4, 284.1]])} miradas={[{ f: 0, v: { x: -0.9, y: 0.3 } }]} />} />
);

export const PARABOLA07: TramoS[] = [
  { t0: 133.2, t1: 142.0, el: <Corinto />, trans: { tipo: "luz", d: 20, color: "#ffd890" } },
  { t0: 142.0, t1: 156.2, el: <LaEsquina /> },
  { t0: 156.2, t1: 157.7, el: <Nombre /> },
  { t0: 157.7, t1: 162.3, el: <Aceitunas /> },
  { t0: 162.3, t1: 173.5, el: <ConFarol /> },
  { t0: 173.5, t1: 178.1, el: <ElVaso /> },
  { t0: 178.1, t1: 184.3, el: <LaFuente /> },
  { t0: 184.3, t1: 189.4, el: <MeGano /> },
  { t0: 189.4, t1: 199.2, el: <LaPuerta />, trans: { tipo: "fundido", d: 12 } },
  { t0: 199.2, t1: 204.5, el: <Mapa /> },
  { t0: 204.5, t1: 213.4, el: <Reverencia /> },
  { t0: 213.4, t1: 226.5, el: <Marcha /> },
  { t0: 226.5, t1: 233.7, el: <Picado /> },
  { t0: 233.7, t1: 241.0, el: <Presentan /> },
  { t0: 241.0, t1: 251.9, el: <Ofrece /> },
  { t0: 251.9, t1: 259.3, el: <MiSol /> },
  { t0: 259.3, t1: 269.0, el: <Espadas /> },
  { t0: 269.0, t1: 276.9, el: <SeCorre /> },
  { t0: 276.9, t1: 284.1, el: <Deseo /> },
];
// insertos que vuelven en el acto 4 (Alejandro marchando: el mapa que se llena; Diógenes viejo al sol)
export const MapaLleno: React.FC = () => <Mapa />;
export const DiogenesViejo: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={121} mano={1.4}
    claves={[mira(0, BX - 20, P - 200, 1.6), mira(150, BX - 20, P - 200, 1.7)]}
    medio={<><BarrilCon dio={{ look: { ...DIOGENES, accesorios: [{ t: "pelo", forma: "calvo", color: "#c99a70" }, { t: "barba", color: "#ece6da" }, { t: "tunica", color: "#9a8a6a", largo: 0.85 }] }, caras: [{ f: 0, v: "feliz" }] }} /><Halo x={DIO.x + 60} y={P - 180} r={380} color="#fff0b0" fuerza={0.45} /></>} />
);
export const MarchaSinFin: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={122} mano={2}
    claves={[mira(0, 1200, 560, 0.9), mira(300, 1300, 560, 0.95)]}
    medio={<>
      <Escolta x={0} ruta={[{ f: 0, x: 400 }, { f: 300, x: 1500 }]} />
      <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={CALIDA} ruta={[{ f: 0, x: 460, y: P + 20 }, { f: 120, x: 1100, y: P + 20 }, { f: 300, x: 1900, y: P + 20 }]} poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "enojo" }]} />
    </>} />
);
// el nene de la fuente (vuelve en el acto 4)
export const NeneFuente: React.FC = () => (
  <Escena Set={Agora} pal={pal} seed={123} mano={1.6}
    claves={[mira(0, A.fuente, P - 220, 1.8), mira(150, A.fuente, P - 220, 1.9)]}
    medio={<Actor look={NENE} escala={ESC} seed={120} luz={CALIDA} ruta={[{ f: 0, x: A.fuente + 40, y: P }]} dir={[{ f: 0, v: -1 }]}
      poses={[{ f: 0, v: { tronco: 22, hI: 70, cI: 80, hD: 70, cD: 80, cabeza: 8 } }, { f: 50, v: { tronco: 8, hI: 95, cI: 120, hD: 95, cD: 120, cabeza: -6 } }]} caras={[{ f: 0, v: "feliz" }]} />} />
);
