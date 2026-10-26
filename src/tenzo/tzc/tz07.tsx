// tz07 · «The Man Who Couldn't Stop Comparing» (Tenzo Films, sesión tz-c). Voz 502,9 s + 8 s de tarjeta final.
// Plan: D:/rtmp/tz07_PLAN_MxM.md. Cada plano = la frase de ESE segundo; los tramos van en segundos ABSOLUTOS de la voz.
// Chicago = mundo de tz-a; la parábola de Corinto está en parabola07.tsx.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Montaje } from "../../anikit/montaje";
import { F_HUD, RelojDia } from "../../anikit/pantalla";
import { CAM, EdificioVidrio, ManoLeo, ManoMara, TextoMano } from "./chicago";
import { Aula, AULA_PISO } from "../../anikit/sets/aula";
import { ACENTO, ESC, LEO, MARA, PAL, PAL_ANT } from "../elenco";
import { HudTenzo, MarcaTenzo } from "../hud";
import { Tel, TelMesa } from "../utileria";
import { Agora, AGORA_PISO, SombraRey } from "../sets/agora";
import {
  Burbuja, CabeceraChat, CajaEscribir, CTO, EnColectivo, EnCuarto, EnLavadero, Hora, LAV, Negro, PantallaTel, Pulgar, Recuerdo,
  RIM_FRIO, RostroLuz, SENTADO, SENTADO_TEL, TarjetaFinal, TENZO_MESA,
} from "./chicago";
import { ALEJANDRO, REY_ESC, BarrilCon, BX, DiogenesViejo, MarchaSinFin, NeneFuente, PARABOLA07, REY } from "./parabola07";
import { DibujoPegado, FarolSeApaga, LlamaCrece, PIN, TYLER } from "./tz05";
import { partir, planosDe, TramoS } from "./tramos";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
const hab = (t0: number, p: [number, number][]): [number, number][] => p.map(([a, b]) => [fr(a - t0), fr(b - t0)]);
const loc = (t0: number, t: number) => fr(t - t0);
const P = LAV.P;
const PC = CTO.P;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------- CUADRO 0 = la miniatura sin texto (Corinto al sol: Diógenes en el barril, Alejandro dorado tapa el sol, Leo con el teléfono y Mara detrás) ----------
const Cuadro0: React.FC = () => {
  const f = useF();
  const PA = AGORA_PISO;
  const LX = BX + 1000;
  return (
    <Escena Set={Agora} pal={PAL_ANT} seed={170} mano={1.4}
      claves={[mira(0, BX + 560, PA - 420, 0.82), mira(20, BX + 560, PA - 420, 0.82), mira(192, BX + 560, PA - 410, 0.9, { curva: "inout" })]}
      medio={<>
        {/* el sol plano detrás de la cabeza de Alejandro, con rayos que giran lento */}
        <g transform={`translate(${BX + 330},${PA - 860}) rotate(${f * 0.15})`}>
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-14} y={-360} width={28} height={130} rx={14} fill="#fff3c0" opacity={0.7} transform={`rotate(${i * 30})`} />)}
          <circle r={190} fill="#fff6d0" /><circle r={150} fill="#ffe58a" />
        </g>
        <BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }] }} />
        <SombraRey x={BX + 330} y={PA - 2} largo={560} fuerza={0.4} />
        <Actor look={ALEJANDRO} escala={REY_ESC * 1.15} seed={130} luz={{ lado: -1, color: "#fff0b0", fuerza: 1.1 }} ruta={[{ f: 0, x: BX + 330, y: PA + 20 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -0.7, y: 0.6 } }]} />
        <Actor look={MARA} escala={ESC * 1.9} seed={5} ruta={[{ f: 0, x: LX + 230, y: PA + 120 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} opacidad={() => 0.95}
          poses={[{ f: 0, v: { hD: 70, cD: 60, hI: 50, cI: 70, cabeza: 14 } }]} />
        <Actor look={LEO} escala={ESC * 1.5} seed={1} luz={{ lado: 1, color: ACENTO, fuerza: 0.7 }} ruta={[{ f: 0, x: LX, y: PA + 170 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { ...SENTADO_TEL, cabeza: 18 + 2 * Math.sin(f / 30) } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.3, y: 0.7 } }]} enManoD={<Tel />} />
      </>} />
  );
};

// ---------- HUD global (SCREEN TIME + DAY) — fuera de la parábola y de los insertos cálidos ----------
const MIN: { f: number; v: number; d?: number }[] = [
  { f: 0, v: 51 }, { f: fr(11.6), v: 190, d: fr(56) }, { f: fr(74.0), v: 235, d: 60 },
  { f: fr(428.6), v: 64, d: 50 }, { f: fr(432.6), v: 51, d: 40 },
];
const diaEn = (f: number) => (f < fr(383.6) ? 14 : f < fr(431.2) ? 15 : 16);
const estadoEn = (f: number) => (f >= fr(72.2) && f < fr(79.1) ? "sube" : "normal") as "sube" | "normal";
const OCULTO: [number, number][] = [[0, 8.5], [133.2, 284.1], [290.3, 300.6], [306.0, 309.7], [348.2, 355.0], [494.3, 999]];
const HudGlobal: React.FC = () => {
  const f = useCurrentFrame();
  if (OCULTO.some(([a, b]) => f >= fr(a) && f < fr(b))) return null;
  const tramo1 = f < fr(133.2);
  return <HudTenzo min={MIN} dia={diaEn(f)} estado={estadoEn} desde={tramo1 ? fr(8.5) : fr(284.1)} hasta={tramo1 ? fr(133.2) : fr(494.3)} sinMarca />;
};

// ---------- utilería de este video ----------
// cajita de metal con arroz (sobre la mesa del lavadero) y los palitos en la mano de Tenzo
const CajaArroz: React.FC<{ x: number; y: number; tapa?: number; arroz?: number }> = ({ x, y, tapa = 0, arroz = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-46} y={-34} width={92} height={34} rx={6} fill="#b9bec6" stroke="#6a7078" strokeWidth={3} />
    {arroz > 0 && tapa < 0.5 && <ellipse cx={0} cy={-34} rx={38 * arroz} ry={8} fill="#f4f1ea" />}
    <rect x={-48} y={-40 - (1 - tapa) * 30} width={96} height={10} rx={4} fill="#c9ced6" stroke="#6a7078" strokeWidth={3} transform={`rotate(${(1 - tapa) * -28},-48,-35)`} />
  </g>
);
const Palitos: React.FC = () => <g><line x1={0} y1={0} x2={70} y2={-26} stroke="#7a4a2a" strokeWidth={5} strokeLinecap="round" /><line x1={0} y1={8} x2={72} y2={-14} stroke="#7a4a2a" strokeWidth={5} strokeLinecap="round" /></g>;
const MESA_X = LAV.mesa + 120;
// 305,1 «he closes the metal box»: la tapa baja con un clic
const CierraCaja: React.FC = () => { const f = useF(); return <CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={interpolate(f, [loc(300.6, 305.0), loc(300.6, 305.3)], [0, 1], cl)} />; };

// el reel de Tyler (auto negro, llaves, departamento de vidrio) con el contador de veces vistas
const ReelTyler: React.FC<{ dur: number; vistas?: [number, number]; caption?: number }> = ({ dur, vistas, caption = 0 }) => {
  const f = useF();
  const n = vistas ? Math.round(interpolate(f, [0, dur - 20], vistas, cl)) : 0;
  return (
    <PantallaTel zoom0={0.98} zoom1={1.12} dur={dur} luz={0.8}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#a9c4e0, #e9eef2 60%, #9aa0a8)" }} />
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <EdificioVidrio />
        <g transform="translate(220,640)">
          <path d="M-200,40 Q-196,-20 -140,-30 L-80,-80 Q0,-100 80,-80 L150,-30 Q200,-20 204,40 Z" fill="#0f1014" />
          <path d="M-70,-72 L-30,-86 L60,-86 L110,-36 L-110,-36 Z" fill="#3a4a5a" opacity={0.9} />
          <path d="M-180,-6 L190,-6" stroke="#e8eef4" strokeWidth={3} opacity={0.5 + 0.4 * Math.sin(f / 8)} />
          <circle cx={-120} cy={42} r={30} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} /><circle cx={130} cy={42} r={30} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} />
        </g>
        <Actor look={TYLER} escala={1.15} seed={31} ruta={[{ f: 0, x: 150, y: 780 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]}
          poses={[{ f: 0, v: { hD: 120, cD: 30 } }, { f: 30, v: { hD: 130, cD: 20 } }, { f: 60, v: { hD: 120, cD: 30 } }, { f: 90, v: { hD: 130, cD: 20 } }]} habla={[[10, 200]]}
          enManoD={<g><circle cx={0} cy={0} r={8} fill="#c9ccd2" /><rect x={6} y={-3} width={22} height={6} rx={3} fill="#c9ccd2" /></g>} />
      </svg>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 40, fontFamily: F_HUD, fontSize: 28, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.7)", opacity: interpolate(f, [caption, caption + 10], [0, 1], cl) }}>
        @tyler · Twenty-five and already made it. Grateful.
      </div>
      <div style={{ position: "absolute", left: 22, top: 22, fontFamily: F_HUD, fontSize: 24, color: "#fff", opacity: 0.9 }}>▶ Reels</div>
      {vistas && <div style={{ position: "absolute", right: 22, top: 18, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, color: ACENTO, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>▶ {n}</div>}
    </PantallaTel>
  );
};

// 99,0-101,9 · el feed de Tyler baja solo: el auto, el departamento en la torre, el barco (cada post con su frase)
const FeedTres: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const y = interpolate(f, [0, 22, 30, 52, 60, dur], [0, 0, -560, -560, -1120, -1150], cl);
  return (
    <PantallaTel zoom0={1} zoom1={1.08} dur={dur} luz={0.8} mano={<Pulgar toca={24} x={300} y={760} />}>
      <div style={{ position: "absolute", inset: 0, background: "#f4f4f6" }} />
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0,${y + 70})`}>
          <rect x={10} y={0} width={420} height={520} rx={14} fill="#a9c4e0" />
          <g transform="translate(220,380)"><path d="M-190,40 Q-186,-20 -130,-30 L-74,-80 Q0,-100 74,-80 L140,-30 Q190,-20 194,40 Z" fill="#0f1014" /><circle cx={-110} cy={42} r={28} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} /><circle cx={120} cy={42} r={28} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} /></g>
          <Actor look={TYLER} escala={1.25} seed={31} ruta={[{ f: 0, x: 90, y: 500 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "saludar" }]} />
          <g transform="translate(0,560)"><rect x={10} y={0} width={420} height={520} rx={14} fill="#dfe8f0" /><g transform="translate(-10,-200)"><EdificioVidrio /></g>
            <Actor look={TYLER} escala={1.25} seed={31} ruta={[{ f: 0, x: 330, y: 500 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "celebrar" }]} /></g>
          <g transform="translate(0,1120)"><rect x={10} y={0} width={420} height={520} rx={14} fill="#5aa8d8" /><rect x={10} y={300} width={420} height={220} fill="#2a78b8" /><path d="M30,310 L410,310 L370,400 L70,400 Z" fill="#f4f4f6" /><rect x={150} y={250} width={150} height={60} fill="#e9eef2" />
            <Actor look={TYLER} escala={1.1} seed={31} ruta={[{ f: 0, x: 220, y: 312 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "celebrar" }]} /></g>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 20, top: 18, fontFamily: F_HUD, fontWeight: 600, fontSize: 30, color: "#222" }}>@tyler</div>
    </PantallaTel>
  );
};

// 26,2-35,3 · flashback gris: el aula de arte, Leo dibuja, Tyler espía y copia
const AulaArte: React.FC = () => {
  const PA = AULA_PISO;
  return (
    <Escena Set={Aula} pal={PAL} setProps={{ variante: "gris", tiza: "ART · 2017" }} seed={150} mano={1.8}
      claves={[mira(0, 1250, 560, 0.9), mira(loc(26.2, 30.3), 1300, PA - 260, 1.35, { curva: "inout" }), mira(273, 1320, PA - 260, 1.5)]}
      medio={<>
        <Actor look={{ ...LEO, alto: 0.85 }} escala={ESC} seed={1} luz={RIM_FRIO} ruta={[{ f: 0, x: 1180, y: PA }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }, { f: 12, v: { ...SENTADO, hD: 58, cD: 80, cabeza: 18 } }, { f: 24, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }, { f: 36, v: { ...SENTADO, hD: 58, cD: 80, cabeza: 18 } }, { f: 48, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }]}
          caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }]} />
        <Actor look={{ ...TYLER, alto: 0.85 }} escala={ESC} seed={31} ruta={[{ f: 0, x: 1430, y: PA }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: SENTADO }, { f: loc(26.2, 33.6), v: { ...SENTADO, tronco: -14, cabeza: 14, hD: 50, cD: 90 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: loc(26.2, 33.6), v: "picaro" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.4 } }]} />
        <rect x={1180 + 60} y={PA - 150} width={110} height={8} fill="#e9e1cf" />
      </>} />
  );
};

// 43,9-56,9 · la grilla del perfil que se llena (1 → 10 → 100) y los insertos: Miami, de traje, el barco
const GrillaPerfil: React.FC = () => {
  const f = useF();
  const n = f < loc(43.9, 46.0) ? 1 : f < loc(43.9, 48.0) ? 10 : Math.min(100, 10 + Math.floor((f - loc(43.9, 48.0)) * 3));
  const col = ["#6aa0c8", "#e9b46a", "#2a2a30", "#8ac0a0", "#d9806a"];
  const scroll = interpolate(f, [loc(43.9, 48), loc(43.9, 49.7)], [0, -900], cl);
  const foto = f >= loc(43.9, 49.7) ? (f < loc(43.9, 51.0) ? 0 : f < loc(43.9, 52.6) ? 1 : 2) : -1;
  return (
    <PantallaTel zoom0={1} zoom1={1.08} dur={390} luz={0.8}>
      <div style={{ position: "absolute", inset: 0, background: "#f4f4f6" }} />
      <div style={{ position: "absolute", left: 20, top: 20, fontFamily: F_HUD, fontWeight: 600, fontSize: 30, color: "#222" }}>@tyler</div>
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0,${80 + scroll})`}>
          {Array.from({ length: n }).map((_, i) => <rect key={i} x={6 + (i % 3) * 144} y={Math.floor(i / 3) * 144} width={140} height={140} fill={col[(i * 7) % 5]} />)}
        </g>
      </svg>
      {foto >= 0 && (
        <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
          <rect width={440} height={900} fill={["#7ec4e8", "#3a3f4a", "#5aa8d8"][foto]} />
          {foto === 0 && <>{[80, 360].map((x) => <g key={x}><path d={`M${x},900 Q${x + 10},600 ${x - 6},420`} stroke="#6a4a2a" strokeWidth={14} fill="none" /><path d={`M${x - 6},420 q-80,10 -110,70 M${x - 6},420 q80,0 110,60 M${x - 6},420 q-20,-60 -90,-80 M${x - 6},420 q30,-60 100,-70`} stroke="#3a8a4a" strokeWidth={16} fill="none" strokeLinecap="round" /></g>)}<rect y={760} width={440} height={140} fill="#f0d9a0" /></>}
          {foto === 2 && <><rect y={620} width={440} height={280} fill="#2a78b8" /><path d="M40,640 L400,640 L360,720 L80,720 Z" fill="#f4f4f6" /><rect x={160} y={580} width={140} height={60} fill="#e9eef2" /></>}
          <Actor look={{ ...TYLER, ...(foto === 1 ? { camisa: "#1a1a20", accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#6a4a2a" }, { t: "corbata" as const, color: "#8a2a2a" }] } : {}) }} escala={1.65} seed={31}
            ruta={[{ f: 0, x: foto === 2 ? 220 : 210, y: foto === 2 ? 660 : 860 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: foto === 2 ? "celebrar" : "saludar" }]} />
          {foto === 2 && [90, 340].map((x, i) => <Actor key={x} look={{ ...TYLER, camisa: i ? "#e86a8a" : "#f2c14a", accesorios: [{ t: "pelo" as const, forma: i ? "bob" as const : "punta" as const, color: "#3a2214" }] }} escala={0.95} seed={40 + i} ruta={[{ f: 0, x, y: 640 }]} dir={[{ f: 0, v: i ? -1 : 1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "celebrar" }]} />)}
        </svg>
      )}
    </PantallaTel>
  );
};

// 79,1-84,1 · primer plano de Leo con el reflejo del auto negro en la cara
const Reflejo: React.FC = () => (
  <EnCuarto cam={[mira(0, CTO.colchon + 20, PC - 270, 2.4), mira(150, CTO.colchon + 20, PC - 275, 2.6)]}
    leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 } }}
    hud={<ManoLeo texto="a guy he used to know." x={960} y={920} centro desde={loc(79.1, 82.7)} />} />
);

// 316,8-324,8 · Tenzo señala el teléfono: el barco grande, Tyler chiquito en un rincón
const ElBarco: React.FC = () => {
  const f = useF();
  return (
    <PantallaTel zoom0={1} zoom1={1.25} dur={240} luz={0.8} mano={<Pulgar toca={loc(316.8, 317.9)} x={330} y={700} piel="#e6c49a" />}>
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <rect width={440} height={900} fill="#5aa8d8" /><rect y={560} width={440} height={340} fill="#2a78b8" />
        <path d="M-20,580 L470,580 L420,720 L20,720 Z" fill="#f4f4f6" /><rect x={60} y={480} width={300} height={100} fill="#e9eef2" /><rect x={120} y={420} width={160} height={60} fill="#dfe6ec" />
        {[80, 140, 200, 260, 320].map((x) => <rect key={x} x={x} y={500} width={40} height={40} fill="#3a4a5a" />)}
        <circle cx={400} cy={570} r={18 + 6 * interpolate(f, [loc(316.8, 321.7), loc(316.8, 322.4)], [0, 1], cl)} fill="none" stroke={ACENTO} strokeWidth={4} opacity={interpolate(f, [loc(316.8, 321.7), loc(316.8, 322.2)], [0, 1], cl)} />
        <Actor look={TYLER} escala={0.6} seed={31} ruta={[{ f: 0, x: 392, y: 584 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "saludar" }]} />
      </svg>
      <div style={{ position: "absolute", left: 22, top: 22, fontFamily: F_HUD, fontSize: 24, color: "#fff", opacity: 0.9 }}>@tyler</div>
    </PantallaTel>
  );
};

// 337,4-348,2 · Mara despliega pantallas cada vez más grandes: auto, barco, mansión
const PilaPantallas: React.FC = () => {
  const f = useF();
  const items = [{ t: loc(337.4, 341.0), x: 1260, y: 380, s: 0.7, d: "auto" }, { t: loc(337.4, 343.4), x: 1480, y: 300, s: 1.0, d: "barco" }, { t: loc(337.4, 345.5), x: 1180, y: 220, s: 1.35, d: "casa" }];
  return (
    <EnCuarto cam={[mira(0, CTO.colchon - 60, PC - 320, 1.0, { rot: -2 }), mira(324, CTO.colchon - 60, PC - 360, 0.92, { rot: -3, curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 2.0, ruta: [{ f: 0, x: CTO.colchon - 240, y: PC - 20 }], caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: { hD: 150, cD: 20, hI: 140, cI: 30, cabeza: 10 } }] }}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {items.map((it) => {
          const u = interpolate(f, [it.t, it.t + 14], [0, 1], cl);
          if (u <= 0) return null;
          return (
            <g key={it.d} transform={`translate(${it.x},${it.y}) scale(${it.s * (0.6 + 0.4 * u)})`} opacity={u}>
              <rect x={-130} y={-200} width={260} height={400} rx={26} fill="#120d0b" stroke={ACENTO} strokeWidth={6} />
              {it.d === "auto" && <path d="M-100,40 Q-98,0 -70,-6 L-40,-36 Q0,-46 40,-36 L76,-6 Q100,0 102,40 Z" fill={ACENTO} />}
              {it.d === "barco" && <path d="M-110,10 L110,10 L86,70 L-86,70 Z M-60,-30 h120 v40 h-120 Z" fill={ACENTO} />}
              {it.d === "casa" && <path d="M-110,90 V-10 L0,-90 L110,-10 V90 Z M-30,90 V30 H30 V90" fill="none" stroke={ACENTO} strokeWidth={10} />}
            </g>
          );
        })}
      </svg>} />
  );
};

// 386,0-397,9 · perfil de Tyler → menú → «Mute»; el post del auto se aparta y entra luz
const Silenciar: React.FC = () => {
  const f = useF();
  const menu = loc(386, 388.6), mute = loc(386, 389.6);
  const aparta = interpolate(f, [mute + 10, mute + 60], [0, 1], cl);
  return (
    <PantallaTel zoom0={1} zoom1={1.08} dur={357} luz={0.8} mano={<Pulgar toca={f < mute ? menu : mute} x={f < mute ? 400 : 230} y={f < mute ? 70 : 690} />}>
      <div style={{ position: "absolute", inset: 0, background: "#f4f4f6" }} />
      <div style={{ position: "absolute", left: 20, top: 20, fontFamily: F_HUD, fontWeight: 600, fontSize: 30, color: "#222" }}>@tyler</div>
      <div style={{ position: "absolute", right: 24, top: 14, fontFamily: F_HUD, fontSize: 40, color: "#222" }}>⋯</div>
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${aparta * 460},0)`} opacity={1 - aparta * 0.6}>
          <rect x={20} y={90} width={400} height={400} fill="#a9c4e0" />
          <path d="M60,420 Q62,380 100,374 L140,340 Q220,326 290,340 L340,374 Q380,380 382,420 Z" fill="#0f1014" />
        </g>
        <rect x={20} y={90} width={400} height={400} fill="#fff6dc" opacity={aparta * 0.9} />
      </svg>
      {f >= menu && f < mute + 30 && (
        <div style={{ position: "absolute", left: 30, right: 30, top: 560, background: "#fff", borderRadius: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.25)", fontFamily: F_HUD, fontSize: 32, color: "#222" }}>
          {["Unfollow", "Mute", "Block"].map((t) => <div key={t} style={{ padding: "20px 26px", borderBottom: "1px solid #eee", background: t === "Mute" && f >= mute ? "#ffe2d2" : "transparent", color: t === "Block" ? "#c0392b" : "#222" }}>{t}</div>)}
        </div>
      )}
      {f >= mute + 30 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", fontFamily: F_HUD, fontSize: 28, color: "#444" }}>Muted @tyler</div>}
    </PantallaTel>
  );
};

// 442,2-453,0 · Leo dibuja el barril y el rey de sombra dorada, y lo clava al lado del elefante
const DibujoBarrilSVG: React.FC<{ u: number }> = ({ u }) => {
  const trazo = (i: number) => ({ strokeDasharray: 1200, strokeDashoffset: 1200 * (1 - Math.max(0, Math.min(1, u * 4 - i))) });
  const s = { fill: "none", stroke: "#f4efe4", strokeWidth: 8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g>
      <rect x={-210} y={-150} width={420} height={300} fill="#2f2c28" stroke="#f4efe4" strokeWidth={3} opacity={0.6} />
      <path {...s} {...trazo(0)} d="M-170,110 Q-180,40 -120,30 Q-60,24 -50,70 Q-50,110 -110,116 Q-160,118 -170,110 Z M-120,30 Q-140,70 -112,116" />
      <path {...s} {...trazo(1)} d="M-80,100 q6,-14 16,-6 M-62,92 l18,-4" />
      <path {...s} {...trazo(2)} d="M60,110 L60,-20 M60,-20 Q60,-70 80,-80 Q100,-70 100,-20 L100,110 M60,10 L30,40 M100,10 L130,40 M80,-80 m-14,-10 q14,-16 28,0" />
      <path {...s} {...trazo(3)} stroke="#ffc46a" d="M50,112 L-40,124 M110,112 L-30,132" />
      <circle {...s} {...trazo(3)} stroke="#ffc46a" cx={150} cy={-110} r={26} />
    </g>
  );
};
const DibujaBarril: React.FC = () => {
  const f = useF();
  const pin = loc(442.2, 450.3);
  if (f < pin) {
    const u = interpolate(f, [20, pin - 20], [0, 1], cl);
    return <AbsoluteFill style={{ background: "#2a2c31" }}><svg width={1920} height={1080}><g transform={`translate(960,540) scale(${1.9 + f * 0.001})`}><DibujoBarrilSVG u={u} /></g></svg></AbsoluteFill>;
  }
  return (
    <EnCuarto lampara cam={[mira(0, CTO.colchon + 330, PC - 400, 1.1), mira(80, CTO.colchon + 330, PC - 410, 1.18)]}
      leo={{ ruta: [{ f: 0, x: CTO.colchon + 260, y: PC }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 150, cD: 20, cabeza: -14 } }, { f: pin + 30, v: "parado" }], caras: [{ f: 0, v: "feliz" }], dir: [{ f: 0, v: 1 }] }}
      medio={<><DibujoPegado x={PIN.x} y={PIN.y} /><DibujoBarrilPegado /></>} />
  );
};
const PIN2 = { x: PIN.x + 170, y: PIN.y };
const DibujoBarrilPegado: React.FC = () => <g transform={`translate(${PIN2.x},${PIN2.y}) scale(0.32)`}><DibujoBarrilSVG u={1} /></g>;
const DosDibujos: React.FC = () => <><DibujoPegado x={PIN.x} y={PIN.y} /><DibujoBarrilPegado /></>;

// 479,0-488,2 · la mano de Leo se mueve sola hacia el teléfono boca abajo; muy lejos, un puntito ámbar
const Picazon: React.FC = () => {
  const f = useF();
  const voz = loc(479, 484.6);
  return (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 60, PC - 120, 2.4), mira(276, CTO.colchon + 80, PC - 120, 2.7, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: 60, v: { ...SENTADO, hD: 38, cD: 62, hI: 30, cI: 70 } }, { f: 150, v: { ...SENTADO, hD: 52, cD: 40, hI: 30, cI: 70, tronco: 8 } }], caras: [{ f: 0, v: "neutral" }, { f: voz, v: "sorpresa" }] }}
      medio={<><TelMesa x={CTO.colchon + 190} y={PC - CTO.COLCHON_ALTO + 4} bocaAbajo /><circle cx={CTO.colchon - 420} cy={PC - 520} r={6 + 2 * Math.sin(f / 6)} fill={ACENTO} opacity={interpolate(f, [voz - 30, voz], [0, 0.9], cl)} /></>}
      hud={<ManoMara texto="bored?" x={560} y={300} desde={voz} tam={64} />} />
  );
};

// ---------- los planos de Chicago ----------
const T = (): TramoS[] => [
  // ACTO 1 · gancho
  { t0: 0, t1: 6.5, el: <Cuadro0 /> },
  { t0: 6.5, t1: 8.3, el: (
    <AbsoluteFill>
      <Escena Set={Agora} pal={PAL_ANT} seed={171} mano={1.2} claves={[mira(0, BX + 80, AGORA_PISO - 240, 1.5), mira(54, BX + 80, AGORA_PISO - 240, 1.6)]}
        medio={<><BarrilCon dio={{ caras: [{ f: 0, v: "cansado" }] }} /><SombraRey x={REY + 40} y={AGORA_PISO - 2} largo={620} fuerza={0.55} /></>} />
      <Negro desde={46} d={6} />
    </AbsoluteFill>
  ) },
  { t0: 8.3, t1: 11.6, trans: { tipo: "fundido", d: 10 }, el: (
    <EnCuarto cam={[mira(0, CTO.colchon + 40, PC - 250, 1.7), mira(99, CTO.colchon + 30, PC - 265, 2.1, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.6 } }}
      hud={<RelojDia min={23 * 60} x={1640} y={150} desde={loc(8.3, 10.1)} />} />
  ) },
  { t0: 11.6, t1: 17.5, el: <ReelTyler dur={177} vistas={[38, 40]} caption={9999} /> },
  { t0: 17.5, t1: 21.5, el: (
    <EnCuarto cam={[mira(0, CTO.colchon + 25, PC - 275, 2.5), mira(120, CTO.colchon + 25, PC - 280, 2.75)]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: 60, v: { ...SENTADO_TEL, cabeza: 22 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 } }} />
  ) },
  { t0: 21.5, t1: 26.0, el: <ReelTyler dur={135} vistas={[40, 41]} caption={loc(21.5, 22.9)} /> },
  { t0: 26.0, t1: 35.3, trans: { tipo: "fundido", d: 12 }, el: <AulaArte /> },
  { t0: 35.3, t1: 43.9, trans: { tipo: "fundido", d: 12 }, el: (
    <EnCuarto cam={[mira(0, PIN.x - 120, PC - 330, 1.6), mira(loc(35.3, 39.5), PIN.x - 60, PC - 360, 1.7, { curva: "inout" }), mira(258, PIN.x, PIN.y + 40, 2.0, { curva: "inout" })]}
      leo={{ ruta: [{ f: 0, x: PIN.x - 260, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: 70, v: { hD: 120, cD: 30, cabeza: -10 } }, { f: 150, v: { hD: 140, cD: 20, cabeza: -12 } }],
        caras: [{ f: 0, v: "triste" }, { f: 120, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.8, y: -0.5 } }] }}
      medio={<DibujoPegado x={PIN.x} y={PIN.y} />} />
  ) },
  { t0: 43.9, t1: 57.0, el: <GrillaPerfil /> },
  { t0: 57.0, t1: 60.8, el: (
    <EnCuarto cam={[mira(0, CTO.colchon - 100, PC - 420, 1.0, { rot: -3 }), mira(114, CTO.colchon - 110, PC - 440, 1.08, { rot: -4 })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 2.1, ruta: [{ f: 0, x: CTO.colchon - 240, y: PC - 20 }], caras: [{ f: 0, v: "risa" }], poses: [{ f: 0, v: { hD: 80, cD: 50, hI: 70, cI: 60, cabeza: 16 } }] }} />
  ) },
  { t0: 60.8, t1: 72.2, el: (
    <EnCuarto cam={[mira(0, CTO.colchon - 80, PC - 380, 1.15), mira(342, CTO.colchon - 80, PC - 380, 1.25)]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 2.1, ruta: [{ f: 0, x: CTO.colchon - 240, y: PC - 20 }], caras: [{ f: 0, v: "feliz" }], habla: hab(60.8, [[67.9, 72.1]]), poses: [{ f: 0, v: { hD: 80, cD: 50, hI: 70, cI: 60, cabeza: 16 } }] }}
      hud={<>
        <ManoMara texto="he's better than you." x={1180} y={300} desde={loc(60.8, 67.9)} />
        <ManoMara texto="look where he is." x={1220} y={420} desde={loc(60.8, 69.4)} />
        <ManoMara texto="look where you are." x={1200} y={540} desde={loc(60.8, 70.7)} />
      </>} />
  ) },
  { t0: 72.2, t1: 79.1, el: (
    <EnCuarto cam={[mira(0, CTO.colchon + 40, PC - 270, 1.9), mira(207, CTO.colchon + 30, PC - 275, 2.3, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 } }} />
  ) },
  { t0: 79.1, t1: 84.6, el: <Reflejo /> },

  // ACTO 2 · Spin City, 3 a. m.
  { t0: 84.6, t1: 92.3, trans: { tipo: "fundido", d: 14 }, el: (
    <EnLavadero tren={20} cam={[mira(0, 1250, 620, 1.05), mira(231, LAV.leo + 260, P - 280, 1.3, { curva: "inout" })]}
      leo={{ ruta: [{ f: 0, x: 300, y: P }, { f: 130, x: LAV.leo, y: P }], asiento: [{ f: 0, v: undefined }, { f: 140, v: 66 }], poses: [{ f: 0, v: "parado" }, { f: 140, v: SENTADO }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 150, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 140, v: { x: -0.9, y: 0 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<RelojDia min={180} x={1640} y={150} />} />
  ) },
  { t0: 92.3, t1: 96.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 260, P - 300, 1.5), mira(123, LAV.leo + 280, P - 300, 1.6)]}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 20, v: { ...SENTADO, hD: 95, cD: 10 } }], caras: [{ f: 0, v: "triste" }], habla: hab(92.3, [[95.2, 95.8]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], enManoD: (f) => (f > 10 ? <Tel /> : null) }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<ManoLeo texto="look at this." x={960} y={920} centro desde={loc(92.3, 95.2)} />} />
  ) },
  { t0: 96.4, t1: 99.0, el: (
    <EnLavadero cam={[mira(0, LAV.tenzo - 40, P - 330, 2.2), mira(78, LAV.tenzo - 40, P - 330, 2.35)]}
      tenzo={{ luz: { lado: -1, color: ACENTO, fuerza: 1 }, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.6, y: 0.4 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ) },
  { t0: 99.0, t1: 101.9, el: (
    <AbsoluteFill>
      <FeedTres dur={87} />
      {[["the car.", 0], ["the apartment.", 30], ["the boat.", 60]].map(([t, d]) => <ManoLeo key={t as string} texto={t as string} x={1380} y={300 + (d as number) * 4} desde={d as number} />)}
    </AbsoluteFill>
  ) },
  { t0: 101.9, t1: 103.9, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 300, P - 300, 1.5)]}
      tenzo={{ poses: [{ f: 0, v: { hD: 90, cD: 10, hI: 32, cI: 92 } }, { f: 40, v: TENZO_MESA }], enManoD: (f) => (f < 30 ? <Tel /> : null) }}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 24, v: { ...SENTADO, hD: 80, cD: 20 } }, { f: 50, v: SENTADO_TEL }], enManoD: (f) => (f > 30 ? <Tel /> : null), caras: [{ f: 0, v: "triste" }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ) },
  ...partir(103.9, 111.7, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(103.9, [[103.9, 105.0]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(103.9, 106), v: "enojo" }, { f: loc(103.9, 109), v: "triste" }], habla: hab(103.9, [[105.4, 111.0]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }],
        poses: [{ f: 0, v: SENTADO_TEL }, { f: loc(103.9, 106.5), v: { ...SENTADO, hD: 70, cD: 60 } }, { f: loc(103.9, 108.5), v: { ...SENTADO, hD: 85, cD: 40 } }], enManoD: <Tel /> }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<ManoLeo texto="he copied my homework." x={960} y={920} centro desde={loc(103.9, 106.0)} />} />
  ), [[103.9, CAM.tenzo(1.5)], [105.3, CAM.leo(3.4)], [108.7, CAM.dos(3.0)]]),
  { t0: 111.7, t1: 117.4, el: (
    <EnLavadero tren={40} cam={[mira(0, LAV.leo + 100, P - 300, 1.3), mira(loc(111.7, 114.5), 2100, P - 330, 1.05, { curva: "inout" }), mira(171, LAV.expendedora, P - 320, 1.2, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 110, cD: 10 } }, { f: 40, v: { ...SENTADO, hD: 130, cD: 5 } }, { f: 100, v: { ...SENTADO, hD: 110, cD: 10 } }], caras: [{ f: 0, v: "triste" }], habla: hab(111.7, [[116.5, 117.3]]) }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<ManoLeo texto="this." x={960} y={900} centro desde={loc(111.7, 116.5)} tam={96} />} />
  ) },
  { t0: 117.4, t1: 122.8, el: (
    <EnLavadero cam={[mira(0, LAV.tenzo - 80, P - 260, 1.4), mira(162, LAV.tenzo - 100, P - 260, 1.5)]}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: 40, v: "feliz" }], enManoD: <Palitos />, poses: [{ f: 0, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: 20, v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }, { f: 50, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: 80, v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }, { f: 110, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ) },
  { t0: 122.8, t1: 127.6, el: (
    <EnLavadero cam={[mira(0, 1500, 600, 1.05), mira(144, LAV.farol - 80, P - 240, 1.5, { curva: "inout" })]}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(122.8, [[122.9, 127.6]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], enManoD: <Palitos /> }}
      leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: -0.1 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ) },
  { t0: 127.6, t1: 133.2, el: <LlamaCrece /> },
  ...PARABOLA07,

  // ACTO 4 · la vuelta
  { t0: 284.1, t1: 290.3, trans: { tipo: "fundido", d: 18 }, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 220, P - 280, 1.3), mira(186, LAV.tenzo - 120, P - 260, 1.6, { curva: "inout" })]}
      leo={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ enManoD: <Palitos />, caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: loc(284.1, 287.3), v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: loc(284.1, 289), v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0.25} />} />
  ) },
  { t0: 290.3, t1: 300.6, el: <MarchaSinFin /> },
  { t0: 300.6, t1: 306.0, el: (
    <EnLavadero cam={[mira(0, MESA_X, P - 200, 2.4), mira(162, MESA_X, P - 200, 2.6)]}
      tenzo={{ habla: hab(300.6, [[300.6, 305.0]]) }}
      medio={<CierraCaja />} />
  ) },
  { t0: 306.0, t1: 309.7, el: <DiogenesViejo /> },
  { t0: 309.7, t1: 316.8, el: (
    <EnLavadero cam={[mira(0, 1500, P - 300, 1.45), mira(loc(309.7, 312.0), 1500, P - 300, 1.5), mira(loc(309.7, 312.1), LAV.tenzo + 90, P - 220, 2.2), mira(213, LAV.tenzo + 90, P - 220, 2.35)]}
      leo={{ caras: [{ f: 0, v: "duda" }], habla: hab(309.7, [[309.7, 311.7]]), poses: [{ f: 0, v: SENTADO }, { f: 10, v: { ...SENTADO, hD: 80, cD: 40 } }, { f: 60, v: SENTADO }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: loc(309.7, 312.2), v: "risa" }, { f: loc(309.7, 313.4), v: "feliz" }], habla: hab(309.7, [[312.2, 313.0], [313.2, 316.8]]), poses: [{ f: 0, v: TENZO_MESA }, { f: loc(309.7, 312.2), v: { ...TENZO_MESA, tronco: -8, cabeza: -10 } }, { f: loc(309.7, 313.2), v: TENZO_MESA }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />}
      hud={<ManoLeo texto="so… a barrel?" x={960} y={920} centro desde={loc(309.7, 310.2)} hasta={loc(309.7, 313)} />} />
  ) },
  { t0: 316.8, t1: 324.8, el: <ElBarco /> },
  { t0: 324.8, t1: 330.7, el: (
    <EnLavadero cam={[mira(0, LAV.tenzo - 60, P - 330, 2.3), mira(177, LAV.tenzo - 60, P - 330, 2.45)]}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(324.8, [[324.8, 326.4]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      hud={<><RelojDia min={180} x={1640} y={150} /><TextoMano texto="nobody posts three in the morning." x={960} y={930} centro desde={loc(324.8, 325.0)} color="#f4efe4" tam={72} rot={0} brillo={false} /></>} />
  ) },
  { t0: 330.7, t1: 337.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 280, 2.2), mira(201, LAV.leo + 40, P - 270, 2.4)]}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: 120, v: "neutral" }], poses: [{ f: 0, v: SENTADO_TEL }, { f: 90, v: { ...SENTADO, hD: 30, cD: 60 } }], enManoD: (f) => <Tel prendido={f < 150} />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }} />
  ) },
  { t0: 337.4, t1: 348.2, el: <PilaPantallas /> },
  { t0: 348.2, t1: 355.0, el: <NeneFuente /> },
  { t0: 355.0, t1: 364.6, el: (
    <EnLavadero cam={[mira(0, LAV.leo - 60, P - 340, 1.2), mira(288, LAV.leo - 60, P - 330, 1.3)]}
      leo={{ caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }}
      mara={(f) => ({ escala: ESC * interpolate(f, [0, 288], [1.7, 1.15], cl), habla: hab(355, [[359.5, 363.8]]), caras: [{ f: 0, v: "enojo" }] })}
      hud={<>
        <ManoMara texto="he's laughing at you." x={1240} y={300} desde={loc(355, 359.5)} />
        <ManoMara texto="everyone is laughing at you." x={1240} y={420} desde={loc(355, 360.9)} />
        <ManoMara texto="delivery boy forever." x={1240} y={540} desde={loc(355, 362.6)} />
      </>} />
  ) },
  { t0: 364.6, t1: 369.1, el: (
    <EnLavadero cam={CAM.dos(4.5)}
      leo={{ caras: [{ f: 0, v: "triste" }], habla: hab(364.6, [[364.8, 366.5]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: loc(364.6, 367.0), v: { ...TENZO_MESA, hD: 60, cD: 60 } }, { f: loc(364.6, 367.3), v: TENZO_MESA }, { f: loc(364.6, 367.6), v: { ...TENZO_MESA, hD: 60, cD: 60 } }, { f: loc(364.6, 367.9), v: TENZO_MESA }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />
  ) },
  { t0: 369.1, t1: 373.6, trans: { tipo: "luz", d: 8 }, el: (
    <EnCuarto cam={CAM.cama(4.5, 2.0)} leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 } }}
      hud={<div style={{ position: "absolute", left: 80, top: 80, fontFamily: F_HUD, fontWeight: 600, fontSize: 76, color: "#f4efe4", background: "rgba(12,10,10,0.78)", padding: "10px 30px 14px", borderRadius: 16 }}>DAY 1 · <span style={{ color: ACENTO }}>9h 42m</span></div>} />
  ) },
  { t0: 373.6, t1: 377.0, el: (
    <EnLavadero cam={CAM.tenzo(3.4)} tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(373.6, [[373.6, 377.0]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />
  ) },
  { t0: 377.0, t1: 378.3, el: (
    <EnLavadero cam={CAM.leo(1.3)} leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }} tenzo={{ habla: hab(377.0, [[377.0, 378.0]]) }}
      hud={<ManoLeo texto="is he winning?" x={960} y={920} centro desde={loc(377.0, 377.2)} />} />
  ) },
  { t0: 378.3, t1: 386.0, el: (
    <EnLavadero cam={CAM.leo(7.7)}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(378.3, 381.0), v: "feliz" }], habla: hab(378.3, [[381.0, 383.4]]), miradas: [{ f: 0, v: { x: 0.3, y: -0.5 } }, { f: loc(378.3, 381), v: { x: 0.9, y: 0 } }] }}
      hud={<ManoLeo texto="yeah. he's winning." x={960} y={920} centro desde={loc(378.3, 381.0)} />} />
  ) },
  { t0: 386.0, t1: 397.9, trans: { tipo: "fundido", d: 10 }, el: <Silenciar /> },
  { t0: 397.9, t1: 405.8, el: (
    <PantallaTel zoom0={1} zoom1={1.08} dur={237} luz={0.8} mano={<Pulgar toca={loc(397.9, 404.4)} x={392} y={830} piel="#e6c49a" />}>
      <CabeceraChat nombre="Tyler" color="#3a5a8a" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: F_HUD, fontSize: 20, color: "#8a8f98" }}>MAR 2019</div>
      <Burbuja texto="art class tomorrow?" y={130} desde={-100} />
      <Burbuja texto="yeah. bring the charcoal" yo y={260} desde={-100} />
      <Burbuja texto="lol ok" y={390} desde={-100} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: F_HUD, fontSize: 20, color: "#8a8f98" }}>TODAY 3:21 AM</div>
      <Burbuja texto="Congrats on the car man, hope you're good. For real." yo y={520} desde={loc(397.9, 404.6)} />
      <CajaEscribir texto="Congrats on the car man, hope you're good. For real." desde={loc(397.9, 400.3)} vel={2.2} />
    </PantallaTel>
  ) },
  ...partir(405.8, 410.4, (cam) => (
    <EnLavadero tel={{ bocaAbajo: true, vibra: 0 }} cam={cam}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 70, v: { ...SENTADO, hD: 60, cD: 70 } }], caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.6 } }] }}
      tenzo={{ poses: [{ f: 0, v: TENZO_MESA }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.7, y: 0.3 } }] }}
      hud={<><Hora texto="3:22 AM" desde={0} /><Hora texto="3:42 AM" desde={loc(405.8, 407.8)} /></>} />
  ), [[405.8, [mira(0, LAV.mesa + 260, P - 170, 2.6), mira(60, LAV.mesa + 260, P - 170, 2.75)]], [407.8, CAM.dos(2.6)]]),
  { t0: 410.4, t1: 423.2, el: (
    <PantallaTel zoom0={1} zoom1={1.1} dur={384} luz={0.8}>
      <CabeceraChat nombre="Tyler" color="#3a5a8a" />
      <Burbuja texto="Congrats on the car man, hope you're good. For real." yo y={100} desde={-100} />
      <Burbuja texto="Leo! wow, thanks bro." y={300} desde={loc(410.4, 410.4)} />
      <Burbuja texto="Honestly, not that good." y={400} desde={loc(410.4, 412.9)} />
      <Burbuja texto="The car is leased. I work 80 hours a week. Haven't seen my dad in a year." y={500} desde={loc(410.4, 414.9)} />
      <Burbuja texto="Miss art class sometimes." y={720} desde={loc(410.4, 420.1)} />
      <Burbuja texto="You still draw?" y={820} desde={loc(410.4, 421.9)} />
    </PantallaTel>
  ) },
  { t0: 423.2, t1: 427.3, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 280, 2.3), mira(123, LAV.leo + 40, P - 280, 2.45)]}
      leo={{ caras: [{ f: 0, v: "sorpresa" }, { f: 70, v: "feliz" }], poses: [{ f: 0, v: SENTADO_TEL }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }} />
  ) },
  { t0: 427.3, t1: 434.2, trans: { tipo: "fundido", d: 12 }, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 20, PC - 265, 1.9), mira(207, CTO.colchon - 40, PC - 290, 1.6, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "feliz" }] }} medio={<><TelMesa x={CTO.cajon} y={PC - 2} bocaAbajo /><DosDibujos /></>} />
  ) },
  { t0: 434.2, t1: 442.2, trans: { tipo: "fundido", d: 12 }, el: (
    <EnColectivo cam={[mira(0, 1440, 660, 1.65), mira(240, 1440, 660, 1.8, { curva: "inout" })]}
      maya={{ habla: [[loc(434.2, 439.2), 240]], caras: [{ f: 0, v: "feliz" }, { f: loc(434.2, 439.2), v: "risa" }], poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 100, hI: 55, cI: 105 } }, { f: loc(434.2, 439.2), v: { ...SENTADO, tronco: -10, cabeza: -14, hD: 40, cD: 130, hI: 40, cI: 130 } }] }}
      leo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(434.2, [[436.7, 439.1]]), poses: [{ f: 0, v: SENTADO }, { f: 40, v: { ...SENTADO, hD: 80, cD: 60 } }, { f: 90, v: SENTADO }] }} />
  ) },
  { t0: 442.2, t1: 453.1, el: <DibujaBarril /> },

  // ACTO 5 · gancho a tz08
  { t0: 453.1, t1: 457.6, trans: { tipo: "fundido", d: 16 }, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 80, PC - 270, 1.35), mira(135, CTO.colchon + 80, PC - 270, 1.45)]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }], caras: [{ f: 0, v: "neutral" }] }}
      medio={<><TelMesa x={CTO.colchon + 190} y={PC - CTO.COLCHON_ALTO + 4} bocaAbajo /><DosDibujos /></>}
      hud={<Hora texto="SUN 3:40 PM" />} />
  ) },
  { t0: 457.6, t1: 461.6, el: (
    <EnCuarto dia cam={[mira(0, PIN.x + 80, PIN.y + 50, 2.8), mira(120, PIN.x + 80, PIN.y + 50, 3.0)]} leo={null} medio={<DosDibujos />} />
  ) },
  { t0: 461.6, t1: 467.0, el: (
    <EnCuarto dia cam={CAM.camaPP(5.4)} leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }], caras: [{ f: 0, v: "neutral" }, { f: 90, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.6, y: -0.3 } }] }}
      medio={<TelMesa x={CTO.colchon + 190} y={PC - CTO.COLCHON_ALTO + 4} bocaAbajo />} />
  ) },
  { t0: 467.0, t1: 471.0, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 130, PC - 190, 2.0), mira(120, CTO.colchon + 150, PC - 170, 2.3, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: 60, v: { ...SENTADO, hD: 45, cD: 55, hI: 30, cI: 70, tronco: 6 } }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.7, y: 0.7 } }] }}
      medio={<TelMesa x={CTO.colchon + 190} y={PC - CTO.COLCHON_ALTO + 4} bocaAbajo />} />
  ) },
  { t0: 471.0, t1: 479.0, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 50, PC - 260, 1.5), mira(240, CTO.colchon + 40, PC - 265, 2.0, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }], caras: [{ f: 0, v: "neutral" }, { f: 120, v: "duda" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.6 } }, { f: 80, v: { x: -0.5, y: 0 } }, { f: 160, v: { x: 0.5, y: 0 } }] }}
      medio={<><TelMesa x={CTO.colchon + 190} y={PC - CTO.COLCHON_ALTO + 4} bocaAbajo /><DosDibujos /></>} />
  ) },
  { t0: 479.0, t1: 488.2, el: <Picazon /> },
  { t0: 488.2, t1: 494.3, el: (
    <EnCuarto dia cam={[mira(0, PIN.x + 80, PIN.y + 60, 1.7), mira(183, PIN.x + 80, PIN.y + 60, 1.85)]} leo={null}
      medio={<DosDibujos />}
      hud={<ManoLeo texto="who is your tyler?" x={960} y={920} centro desde={10} />} />
  ) },
  { t0: 494.3, t1: 502.9, trans: { tipo: "fundido", d: 16 }, el: <FarolSeApaga /> },
];

export const TZ07_DUR = fr(502.9) + 240;
const PLANOS = planosDe(T());

export const Tz07: React.FC<{ audio?: string }> = ({ audio = "tz07.wav" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[...PLANOS, { dur: 240, el: <TarjetaFinal proximo="The Boy Who Had Never Been Bored" frase="Put the phone face down. See you tomorrow night, at the laundromat." />, trans: { tipo: "fundido", d: 12 } }]} />
    <HudGlobal />
    <MarcaFuera />
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
const MarcaFuera: React.FC = () => (useCurrentFrame() < fr(502.9) ? <MarcaTenzo /> : null);
