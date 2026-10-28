// tz07 · «The Man Who Couldn't Stop Comparing» (Tenzo Films, sesión tz-c). Voz 502,9 s + 8 s de tarjeta final.
// Plan: D:/rtmp/tz07_PLAN_MxM.md. Cada plano = la frase de ESE segundo; los tramos van en segundos ABSOLUTOS de la voz.
// Chicago = mundo de tz-a; la parábola de Corinto está en parabola07.tsx.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Montaje } from "../../anikit/montaje";
import { F_HUD, RelojDia } from "../../anikit/pantalla";
import { CAM, EdificioVidrio, ManoLeo, TextoMano } from "./chicago";
import { Aula, AULA_PISO } from "../../anikit/sets/aula";
import { ACENTO, ESC, LEO, MARA, PAL, PAL_ANT } from "../elenco";
import { HudTenzo, MarcaTenzo } from "../hud";
import { Tel, TelMesa } from "../utileria";
import { Agora, AGORA_PISO, SombraRey } from "../sets/agora";
import {
  Burbuja, ConCara, CabeceraChat, CajaEscribir, CTO, EnColectivo, EnCuarto, EnLavadero, Hora, LAV, PantallaTel, Pulgar, Recuerdo,
  RIM_FRIO, RostroLuz, SENTADO, SENTADO_TEL, TarjetaFinal, TENZO_MESA,
} from "./chicago";
import { ALEJANDRO, REY_ESC, BarrilCon, BX, MarchaSinFin, NeneFuente, PARABOLA07 } from "./parabola07";
import { DibujoPegado, LlamaCrece, PIN, TYLER } from "./tz05";
import { partir, planosDe, TramoS } from "./tramos";
import { ALaVentana, Amanece, ApuntaTel, BocaAbajoA, BocaAbajoB, ChatTyler, Cortes, DeptoVidrio, DiaCatorce, DiaUno, Dibujando, Dioses, GanaEl, GolpeMesa, LaRespuesta, LoDibuja, ManosAbiertas, MasRaro, Mute, NoventaAlSol, Posts, YaLoLogro, Escalera, EsteLugar, Fantasmas, LeeCaptions, Manana, NadaPasa, NoEsLuz, Picazon2, SeSienta, SinIdea, SombraChica, SombraFeliz, TuTyler } from "./tz07b";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
const hab = (t0: number, p: [number, number][]): [number, number][] => p.map(([a, b]) => [fr(a - t0), fr(b - t0)]);
const loc = (t0: number, t: number) => fr(t - t0);
const P = LAV.P;
const PC = CTO.P;
const P2 = AGORA_PISO;
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
const ReelTyler: React.FC<{ dur: number; vistas?: [number, number]; caption?: number; z?: [number, number]; toca?: number }> = ({ dur, vistas, caption = 0, z = [0.98, 1.12], toca }) => {
  const f = useF();
  const n = vistas ? Math.round(interpolate(f, [0, dur - 20], vistas, cl)) : 0;
  return (
    <PantallaTel zoom0={z[0]} zoom1={z[1]} dur={dur} luz={0.8} mano={toca !== undefined ? <Pulgar toca={toca} x={220} y={470} piel="#e6c49a" /> : undefined}>
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
    <Escena Set={Aula} pal={PAL} setProps={{ variante: "gris", tiza: "" }} seed={150} mano={1.8}
      claves={[mira(0, 1300, PA - 330, 1.35), mira(loc(26.2, 30.3), 1300, PA - 300, 1.75, { curva: "inout" }), mira(273, 1330, PA - 300, 1.9)]}
      medio={<>
        <Actor look={{ ...LEO, alto: 0.85 }} escala={ESC} seed={1} luz={RIM_FRIO} ruta={[{ f: 0, x: 1180, y: PA }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }, { f: 12, v: { ...SENTADO, hD: 58, cD: 80, cabeza: 18 } }, { f: 24, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }, { f: 36, v: { ...SENTADO, hD: 58, cD: 80, cabeza: 18 } }, { f: 48, v: { ...SENTADO, hD: 50, cD: 90, cabeza: 18 } }]}
          caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }]} />
        <Actor look={{ ...TYLER, alto: 0.85 }} escala={ESC} seed={31} ruta={[{ f: 0, x: 1430, y: PA }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: SENTADO }, { f: loc(26.2, 33.6), v: { ...SENTADO, tronco: -14, cabeza: 14, hD: 50, cD: 90 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: loc(26.2, 33.6), v: "picaro" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.4 } }]} />
        <rect x={1180 + 60} y={PA - 150} width={110} height={8} fill="#e9e1cf" />
      </>}
      hud={<TextoMano texto="art class · 2017" x={960} y={930} centro desde={6} color="#f4efe4" tam={64} rot={0} brillo={false} />} />
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
    <EnCuarto lampara cam={[mira(0, CTO.colchon + 300, PC - 420, 1.75), mira(80, CTO.colchon + 300, PC - 430, 1.85)]}
      leo={{ ruta: [{ f: 0, x: CTO.colchon + 260, y: PC }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 150, cD: 20, cabeza: -14 } }, { f: pin + 30, v: "parado" }], caras: [{ f: 0, v: "feliz" }], dir: [{ f: 0, v: 1 }] }}
      medio={<><DibujoPegado x={PIN.x} y={PIN.y} /><DibujoBarrilPegado /></>} />
  );
};
const PIN2 = { x: PIN.x + 170, y: PIN.y };
const DibujoBarrilPegado: React.FC = () => <g transform={`translate(${PIN2.x},${PIN2.y}) scale(0.32)`}><DibujoBarrilSVG u={1} /></g>;
const DosDibujos: React.FC = () => <><DibujoPegado x={PIN.x} y={PIN.y} /><DibujoBarrilPegado /></>;

// la hora de la madrugada: 3:22 y, al corte, 3:42 (nunca las dos encimadas)
const DosHoras: React.FC = () => {
  const f = useF();
  return f < loc(405.8, 407.8) ? <Hora texto="3:22 AM" desde={0} /> : <Hora texto="3:42 AM" desde={loc(405.8, 407.8)} />;
};

// ---------- los planos de Chicago ----------
// 72,2-79,1 · «Screen time, 3 hours and 55 minutes. The counter is climbing again.»: el contador grande que sube
const Contador: React.FC = () => {
  const f = useF();
  const m = Math.min(59, 52 + Math.floor(f / 34));
  return (
    <div style={{ position: "absolute", left: "50%", transform: `translateX(-50%) scale(${1 + 0.04 * Math.max(0, 1 - (f % 34) / 8)})`, top: 70, fontFamily: F_HUD, fontWeight: 600, fontSize: 72, color: "#f4efe4", background: "rgba(12,10,10,0.78)", padding: "10px 30px 14px", borderRadius: 16 }}>
      SCREEN TIME <span style={{ color: ACENTO }}>3h {m}m</span> <span style={{ color: ACENTO }}>▲</span>
    </div>
  );
};
// 405,8-410,4 · «puts the phone face down. 20 minutes later, it buzzes.»: boca abajo en la mesa y, desde `desde`, zumba
const TelZumba: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const on = f >= desde && Math.floor((f - desde) / 12) % 2 === 0;
  const x = LAV.mesa + 260, y = P - 150;
  return (
    <g>
      <TelMesa x={x} y={y} bocaAbajo vibra={on ? 4 * Math.sin(f * 2.6) : 0} />
      {on && [0, 1].map((k) => <path key={k} d={`M${x - 70 - k * 22},${y - 40} q-14,22 0,44 M${x + 70 + k * 22},${y - 40} q14,22 0,44`} stroke={ACENTO} strokeWidth={4} fill="none" opacity={0.8 - k * 0.3} />)}
    </g>
  );
};
const T = (): TramoS[] => [
  // ACTO 1 · gancho
  { t0: 0, t1: 6.5, el: <Cuadro0 /> },
  // «The answer made history.»: Diógenes le hace seña al rey de que se corra; la sombra se va
  { t0: 6.5, t1: 8.3, el: <LaRespuesta /> },
  // «Day 14. 11 at night.»: Leo pasa con el pulgar, se refriega los ojos
  { t0: 8.3, t1: 11.6, trans: { tipo: "fundido", d: 10 }, el: <DiaCatorce /> },
  { t0: 11.6, t1: 17.5, el: <ConCara caras={[{ f: 0, v: "neutral" }, { f: 60, v: "sorpresa" }, { f: 125, v: "triste" }]}><ReelTyler dur={177} vistas={[38, 40]} caption={9999} toca={100} /></ConCara> },
  // «a glass apartment behind him, with the whole city shining»: la ciudad de vidrio que Leo mira, con su cara en la esquina
  { t0: 17.5, t1: 21.5, el: <DeptoVidrio /> },
  // «25, and already made it. Grateful.»: el post sale del teléfono; Leo lo baja y mira su dibujo
  { t0: 21.5, t1: 26.0, el: <YaLoLogro pared={<DibujoPegado x={PIN.x} y={PIN.y} />} /> },
  { t0: 26.0, t1: 35.3, trans: { tipo: "fundido", d: 12 }, el: <AulaArte /> },
  { t0: 35.3, t1: 43.9, trans: { tipo: "fundido", d: 12 }, el: (
    <EnCuarto cam={[mira(0, PIN.x - 120, PC - 330, 1.6), mira(loc(35.3, 39.5), PIN.x - 60, PC - 360, 1.7, { curva: "inout" }), mira(258, PIN.x + 40, PIN.y + 30, 2.7, { curva: "inout" })]}
      leo={{ ruta: [{ f: 0, x: PIN.x - 260, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: "parado" }, { f: 70, v: { hD: 120, cD: 30, cabeza: -10 } }, { f: 150, v: { hD: 140, cD: 20, cabeza: -12 } }],
        caras: [{ f: 0, v: "triste" }, { f: 120, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.8, y: -0.5 } }] }}
      medio={<DibujoPegado x={PIN.x} y={PIN.y} />} />
  ) },
  // la grilla del perfil y, desde «Tyler in Miami», los posts que saltan del teléfono de Leo
  { t0: 43.9, t1: 57.0, el: <Cortes planos={[[0, <ConCara caras={[{ f: 0, v: "neutral" }, { f: 120, v: "sorpresa" }]}><GrillaPerfil /></ConCara>, 0], [loc(43.9, 49.6), <Posts pared={<DibujoPegado x={PIN.x} y={PIN.y} />} />]]} /> },
  { t0: 57.0, t1: 60.8, el: <SombraFeliz /> },
  { t0: 60.8, t1: 72.2, el: <LeeCaptions reel={(c) => <ReelTyler dur={171} vistas={[40, 41]} caption={c} z={[1.0, 1.08]} />} /> },
  ...partir(72.2, 79.1, (cam) => (
    <EnCuarto cam={cam}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: loc(72.2, 75.6), v: { ...SENTADO_TEL, cabeza: 30, tronco: 12 } }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 } }}
      hud={<Contador />} />
  ), [[72.2, [mira(0, CTO.colchon + 40, PC - 270, 1.9), mira(207, CTO.colchon + 30, PC - 275, 2.3, { curva: "inout" })]], [75.6, [mira(0, CTO.colchon + 190, PC - 300, 2.15, { rot: -3 }), mira(105, CTO.colchon + 170, PC - 300, 2.35, { rot: -2, curva: "inout" })]]]),
  { t0: 79.1, t1: 84.6, el: <NoEsLuz /> },

  // ACTO 2 · Spin City, 3 a. m.
  { t0: 84.6, t1: 92.3, trans: { tipo: "fundido", d: 14 }, el: (
    <EnLavadero tren={20} cam={[mira(0, 1250, 620, 1.05), mira(231, LAV.leo + 260, P - 280, 1.3, { curva: "inout" })]}
      leo={{ ruta: [{ f: 0, x: 300, y: P }, { f: 130, x: LAV.leo, y: P }], asiento: [{ f: 0, v: undefined }, { f: 140, v: 66 }], poses: [{ f: 0, v: "parado" }, { f: 140, v: SENTADO }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 150, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 140, v: { x: -0.9, y: 0 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<RelojDia min={180} x={1640} y={150} />} />
  ) },
  { t0: 92.3, t1: 96.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 180, P - 300, 1.9), mira(123, LAV.leo + 200, P - 300, 2.0)]}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 20, v: { ...SENTADO, hD: 95, cD: 10 } }], caras: [{ f: 0, v: "triste" }], habla: hab(92.3, [[95.2, 95.8]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], enManoD: (f) => (f > 10 ? <Tel /> : null) }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />}
      hud={<ManoLeo texto="look at this." x={960} y={920} centro desde={loc(92.3, 95.2)} />} />
  ) },
  { t0: 96.4, t1: 99.0, el: (
    <EnLavadero cam={[mira(0, LAV.tenzo - 10, P - 300, 2.5, { rot: 2 }), mira(78, LAV.tenzo - 10, P - 300, 2.7, { rot: 1, curva: "inout" })]}
      tenzo={{ luz: { lado: -1, color: ACENTO, fuerza: 1 }, caras: [{ f: 0, v: "neutral" }, { f: 50, v: "duda" }], miradas: [{ f: 0, v: { x: -0.4, y: 0.5 } }, { f: 40, v: { x: -0.2, y: 0.6 } }], enManoD: <Tel />, poses: [{ f: 0, v: { hD: 72, cD: 75, hI: 32, cI: 92, cabeza: 12 } }, { f: 36, v: { hD: 80, cD: 70, hI: 32, cI: 92, cabeza: 20, tronco: 4 } }, { f: 64, v: { hD: 76, cD: 72, hI: 32, cI: 92, cabeza: 8 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ) },
  { t0: 99.0, t1: 101.9, el: (
    <AbsoluteFill>
      <FeedTres dur={87} />
      {[["the car.", 0], ["the apartment.", 30], ["the boat.", 60]].map(([t, d]) => <ManoLeo key={t as string} texto={t as string} x={1380} y={300 + (d as number) * 4} desde={d as number} />)}
    </AbsoluteFill>
  ) },
  { t0: 101.9, t1: 103.9, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 240, P - 250, 2.3), mira(60, LAV.leo + 240, P - 250, 2.45)]}
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
  { t0: 111.7, t1: 117.4, el: <EsteLugar medio={<CajaArroz x={MESA_X} y={P - 150} />} /> },
  ...partir(117.4, 122.8, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: 40, v: "feliz" }], enManoD: <Palitos />, poses: [{ f: 0, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: 20, v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }, { f: 50, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: 80, v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }, { f: 110, v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], poses: [{ f: 0, v: SENTADO }, { f: loc(117.4, 120.5), v: { ...SENTADO, hD: 95, cD: 135, cabeza: 8 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ), [[117.4, CAM.tenzo(2.8, 2.5)], [120.2, CAM.leo(2.6, 2.6)]]),
  ...partir(122.8, 127.6, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(122.8, [[122.9, 127.6]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], enManoD: <Palitos /> }}
      leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: -0.1 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} />} />
  ), [[122.8, CAM.tenzo(2.4, 2.6)], [125.2, CAM.hombroLeo(2.4)]]),
  { t0: 127.6, t1: 133.2, el: <LlamaCrece /> },
  ...PARABOLA07,

  // ACTO 4 · la vuelta
  ...partir(284.1, 290.3, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "neutral" }, { f: loc(284.1, 288.9), v: "triste" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ enManoD: <Palitos />, caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: loc(284.1, 287.3), v: { hD: 60, cD: 120, hI: 32, cI: 92, cabeza: 12 } }, { f: loc(284.1, 289), v: { hD: 30, cD: 150, hI: 32, cI: 92, cabeza: 4 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0.25} />} />
  ), [[284.1, CAM.dos(2.6, 1.75)], [286.7, CAM.tenzo(2.2, 2.6)], [288.9, CAM.leo(1.4, 2.6)]], { tipo: "fundido", d: 18 }),
  ...partir(290.3, 300.6, (cam) => <MarchaSinFin cam={cam} />, [[290.3, [mira(0, 800, P2 - 320, 1.5), mira(129, 1260, P2 - 330, 1.6, { curva: "inout" })]], [294.6, [mira(0, 1480, P2 - 350, 2.0), mira(87, 1480, P2 - 350, 2.1)]], [297.5, [mira(0, 1900, P2 - 330, 1.4), mira(93, 2050, P2 - 330, 1.45)]]]),
  ...partir(300.6, 306.0, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ habla: hab(300.6, [[300.6, 305.0]]) }}
      medio={<CierraCaja />} />
  ), [[300.6, [mira(0, MESA_X, P - 200, 2.4), mira(162, MESA_X, P - 200, 2.6)]], [303.5, CAM.tenzo(2.5, 2.5)]]),
  // «lived to almost 90 in the sun»: Diógenes viejo camina a la fuente y levanta la cara al sol
  { t0: 306.0, t1: 309.7, el: <NoventaAlSol /> },
  ...partir(309.7, 316.8, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "duda" }], habla: hab(309.7, [[309.7, 311.7]]), poses: [{ f: 0, v: SENTADO }, { f: 10, v: { ...SENTADO, hD: 80, cD: 40 } }, { f: 60, v: SENTADO }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: loc(309.7, 312.2), v: "risa" }, { f: loc(309.7, 313.4), v: "feliz" }], habla: hab(309.7, [[312.2, 313.0], [313.2, 316.8]]), poses: [{ f: 0, v: TENZO_MESA }, { f: loc(309.7, 312.2), v: { ...TENZO_MESA, tronco: -8, cabeza: -10 } }, { f: loc(309.7, 313.2), v: TENZO_MESA }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />}
      hud={<ManoLeo texto="so… a barrel?" x={960} y={920} centro desde={loc(309.7, 310.2)} hasta={loc(309.7, 313)} />} />
  ), [[309.7, CAM.leo(2.4, 2.6)], [312.1, CAM.tenzo(2.5, 2.5)], [314.6, CAM.hombroLeo(2.2)]]),
  // «he points at the phone»: Tenzo le apunta con los palillos; después el barco en la pantalla (reloj del tramo)
  { t0: 316.8, t1: 324.8, el: <Cortes planos={[[0, <ApuntaTel palitos={<Palitos />} medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />], [loc(316.8, 319.2), <ConCara caras={[{ f: 0, v: "duda" }, { f: 120, v: "sorpresa" }]}><ElBarco /></ConCara>, loc(316.8, 319.2)]]} /> },
  ...partir(324.8, 330.7, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(324.8, [[324.8, 326.4]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
      leo={{ caras: [{ f: 0, v: "neutral" }, { f: loc(324.8, 327.6), v: "duda" }, { f: loc(324.8, 329.0), v: "triste" }], habla: hab(324.8, [[327.7, 328.4]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      hud={<><RelojDia min={180} x={1640} y={150} /><TextoMano texto="nobody posts three in the morning." x={960} y={930} centro desde={loc(324.8, 325.0)} color="#f4efe4" tam={72} rot={0} brillo={false} /></>} />
  ), [[324.8, CAM.tenzo(2.6, 2.4)], [327.4, CAM.leo(3.3, 2.6)]]),
  { t0: 330.7, t1: 337.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 280, 2.2), mira(201, LAV.leo + 40, P - 270, 2.4)]}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: 120, v: "neutral" }], poses: [{ f: 0, v: SENTADO_TEL }, { f: 90, v: { ...SENTADO, hD: 30, cD: 60 } }], enManoD: (f) => <Tel prendido={f < 150} />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }} />
  ) },
  { t0: 337.4, t1: 348.2, el: <Cortes planos={[[0, <Escalera />], [loc(337.4, 345.5), <Dioses />]]} /> },
  { t0: 348.2, t1: 355.0, el: <NeneFuente /> },
  { t0: 355.0, t1: 364.6, el: <SombraChica /> },
  // «then what do I compare myself to?» Leo con las manos abiertas → Tenzo golpea la mesa
  { t0: 364.6, t1: 369.1, el: <Cortes planos={[[0, <ManosAbiertas caja={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />], [loc(364.6, 366.8), <GolpeMesa caja={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />]]} /> },
  // «the boy on the mattress fourteen days ago»: el recuerdo del día 1
  { t0: 369.1, t1: 373.6, trans: { tipo: "luz", d: 8 }, el: <DiaUno /> },
  // «compare yourself to him, only to him»: Tenzo señala y levanta un dedo
  { t0: 373.6, t1: 377.0, el: (
    <EnLavadero hud={<TextoMano texto="you  vs.  you, 14 days ago" x={960} y={930} centro desde={20} color="#f4efe4" tam={64} rot={0} brillo={false} />} cam={[mira(0, LAV.tenzo + 40, P - 210, 2.5, { rot: 2 }), mira(102, LAV.tenzo + 40, P - 215, 2.65, { rot: 1, curva: "inout" })]} tenzo={{ caras: [{ f: 0, v: "feliz" }, { f: loc(373.6, 376.1), v: "determinado" }], habla: hab(373.6, [[373.6, 377.0]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }],
      poses: [{ f: 0, v: TENZO_MESA }, { f: loc(373.6, 374.4), v: { hD: 95, cD: 0, tronco: 10, cabeza: 6, hI: 32, cI: 92 } }, { f: loc(373.6, 375.6), v: TENZO_MESA }, { f: loc(373.6, 376.1), v: { hD: 115, cD: 50, tronco: 4, cabeza: -4, hI: 32, cI: 92 } }] }} medio={<CajaArroz x={MESA_X} y={P - 150} arroz={0} tapa={1} />} />
  ) },
  // «is he winning?»: Tenzo se inclina, pícaro
  { t0: 377.0, t1: 378.3, el: <GanaEl /> },
  ...partir(378.3, 386.0, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(378.3, 381.0), v: "feliz" }], habla: hab(378.3, [[381.0, 383.4]]), poses: [{ f: 0, v: { ...SENTADO, hD: 95, cD: 135, cabeza: 10 } }, { f: loc(378.3, 381.0), v: SENTADO }], miradas: [{ f: 0, v: { x: 0.3, y: -0.5 } }, { f: loc(378.3, 381), v: { x: 0.9, y: 0 } }] }}
      hud={<ManoLeo texto="yeah. he's winning." x={960} y={920} centro desde={loc(378.3, 381.0)} />} />
  ), [[378.3, CAM.leo(2.7, 2.7)], [381.0, CAM.dos(5.0, 1.85)]]),
  // «he opens Tyler's profile and presses mute»: Leo se decide, el menú, y Corinto: el rey se corre
  { t0: 386.0, t1: 397.9, trans: { tipo: "fundido", d: 10 }, el: <Mute tel={<ConCara esquina="der" caras={[{ f: 0, v: "duda" }, { f: 200, v: "neutral" }, { f: 300, v: "feliz" }]}><Silenciar /></ConCara>} /> },
  // «something even stranger»: Leo mira a Tenzo, que asiente; el chat
  { t0: 397.9, t1: 405.8, el: <Cortes planos={[[0, <MasRaro />], [loc(397.9, 400.2), (
    <ConCara caras={[{ f: 0, v: "duda" }, { f: 120, v: "neutral" }, { f: 200, v: "feliz" }]}><PantallaTel zoom0={1} zoom1={1.08} dur={237} luz={0.8} mano={<Pulgar toca={loc(397.9, 404.4)} x={392} y={830} piel="#e6c49a" />}>
      <CabeceraChat nombre="Tyler" color="#3a5a8a" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: F_HUD, fontSize: 20, color: "#8a8f98" }}>MAR 2019</div>
      <Burbuja texto="art class tomorrow?" y={130} desde={-100} />
      <Burbuja texto="yeah. bring the charcoal" yo y={260} desde={-100} />
      <Burbuja texto="lol ok" y={390} desde={-100} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: F_HUD, fontSize: 20, color: "#8a8f98" }}>TODAY 3:21 AM</div>
      <Burbuja texto="Congrats on the car man, hope you're good. For real." yo y={520} desde={loc(397.9, 404.6)} />
      <CajaEscribir texto="Congrats on the car man, hope you're good. For real." desde={loc(397.9, 400.3)} vel={2.2} />
    </PantallaTel></ConCara>
  ), loc(397.9, 400.2)]]} /> },
  // «He puts the phone face down. 20 minutes later, it buzzes.»
  { t0: 405.8, t1: 410.4, el: <Cortes planos={[[0, <BocaAbajoA tel={<TelZumba desde={9999} />} hora={<DosHoras />} />], [loc(405.8, 407.8), <BocaAbajoB tel={<TelZumba desde={loc(407.8, 409.1)} />} hora={<Hora texto="3:42 AM" desde={0} />} />]]} /> },
  { t0: 410.4, t1: 423.2, el: <ChatTyler /> },
  ...partir(423.2, 427.3, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "sorpresa" }, { f: 70, v: "feliz" }], poses: [{ f: 0, v: SENTADO_TEL }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }}
      tenzo={{ miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], caras: [{ f: 0, v: "feliz" }] }} />
  ), [[423.2, [mira(0, LAV.leo + 40, P - 280, 2.3), mira(123, LAV.leo + 40, P - 280, 2.45)]], [425.3, CAM.dos(2.0, 1.9)]]),
  // «Day 15… one hour and four minutes»: se para y se estira al amanecer → «Day 16»: dibuja en el escritorio
  { t0: 427.3, t1: 434.2, trans: { tipo: "fundido", d: 12 }, el: <Cortes planos={[[0, <Amanece pared={<DosDibujos />} />], [loc(427.3, 430.6), <Dibujando />]]} /> },
  { t0: 434.2, t1: 442.2, trans: { tipo: "fundido", d: 12 }, el: (
    <EnColectivo cam={[mira(0, 1440, 640, 2.1), mira(240, 1440, 640, 2.3, { curva: "inout" })]}
      maya={{ habla: [[loc(434.2, 439.2), 240]], caras: [{ f: 0, v: "feliz" }, { f: loc(434.2, 439.2), v: "risa" }], poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 100, hI: 55, cI: 105 } }, { f: loc(434.2, 439.2), v: { ...SENTADO, tronco: -10, cabeza: -14, hD: 40, cD: 130, hI: 40, cI: 130 } }] }}
      leo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(434.2, [[436.7, 439.1]]), poses: [{ f: 0, v: SENTADO }, { f: 40, v: { ...SENTADO, hD: 80, cD: 60 } }, { f: 90, v: SENTADO }] }} />
  ) },
  // «draw it… a tiny man in a barrel… he pins it next to the elephant»
  { t0: 442.2, t1: 453.1, el: <LoDibuja dibujo={<DibujaBarril />} pegado={<DibujoBarrilPegado />} pared={<DibujoPegado x={PIN.x} y={PIN.y} />} /> },

  // ACTO 5 · gancho a tz08
  { t0: 453.1, t1: 457.6, trans: { tipo: "fundido", d: 16 }, el: <NadaPasa /> },
  { t0: 457.6, t1: 461.6, el: <Fantasmas pared={<DosDibujos />} /> },
  { t0: 461.6, t1: 467.0, el: <ALaVentana pared={<DosDibujos />} /> },
  { t0: 467.0, t1: 471.0, el: <SeSienta pared={<DosDibujos />} /> },
  { t0: 471.0, t1: 479.0, el: <SinIdea pared={<DosDibujos />} /> },
  { t0: 479.0, t1: 488.2, el: <Picazon2 pared={<DosDibujos />} /> },
  { t0: 488.2, t1: 494.3, el: <TuTyler pared={<DosDibujos />} /> },
  { t0: 494.3, t1: 502.9, trans: { tipo: "fundido", d: 16 }, el: <Manana /> },
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
