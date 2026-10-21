// tialicha01 · MINUTO 1 (0-77 s). Un solo hilo: la casa de adobe de la Tía Licha EN CORTE, de noche. Todo entra y sale de ahí:
// avatar → iris a la almohada (mirando las vigas, 3:00) → la cámara cruza la cortina hasta el reloj de péndulo (TIC · TAC)
// → la casa de frente: las pisadas al baño ×2 → la foto: de un lado y del otro → avatar → como trapo / de malas / se te olvida
// → dormida en la silla → la casa desde el patio, el ciclo OTRA VEZ → la mesita: ¿qué cenaste? → avatar con la concha y el
// recalentado en tarjetas → la tarjeta crece al recalentado → la cena ligerita → el VASOTE crece en el buró → "no es que estés
// vieja" → la cámara cruza a la cocina → avatar: el sueño se prepara en la cocina → el fogón → la casa entera al atardecer con el
// caminito de luz cocina→cama → los DIEZ jarritos se encienden → tradición + lo que se sabe hoy → avatar (no soy doctora)
// → la casa vuelve a la noche, se apaga la lamparita, en mi casa se dormía. Todo clavado a la voz con at("frase").
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, JARS, screenOf, camSpeed, setKeys, win } from "./casa3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { Card3D, DrawX, Flash, FONT, HAND, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 80);
export const MIN1_END = at("y te aviso") - 0.05;
export const MIN1_FRAMES = s(MIN1_END);
const AV = WIN.map((w) => [w.ms, w.me] as [number, number]);

// paleta de Licha: lila del rebozo, morado del bordado, noche, maíz, crema
export const LI = { lila: "#c9b3ea", morado: "#6b4a9a", noche: "#0b1328", maiz: "#f2c14e", crema: "#f6e7c8", tinta: "#2b1d3a", papel: "#efe0bf", barro: "#c2552d", rojo: "#e0503a" };

// ---------------- tiempos clavados a la voz ----------------
const T = {
  techo: at("el techo"), cocina: at("en la cocina"), reloj: at("el reloj"), tic: at("tic"), tac: at("tac"), levant: at("te levantaste"), dos: at("dos veces"), bano: at("al bano"),
  volteaste: at("volteaste"), unlado: at("un lado"), otro: at("el otro"), trapo: at("trapo"), malas: at("de malas"), olvidar: at("olvidar"), silla: at("la silla"),
  tele: at("la tele"), noche: at("en la noche"), otravez: at("otra vez"), acuerdate: at("acuerdate"), anoche: at("anoche"), pan: at("pan dulce"), nueve: at("las nueve"),
  recal: at("el recalentado"), chilito: at("chilito"), tarde: at("ya tarde"), tele2: at("la tele", 38), ligerita: at("ligerita"), vasote: at("vasote"), acostarte: at("acostarte"),
  vieja: at("vieja"), abuela: at("mi abuela"), sesenta: at("los 60"), sueno: at("el sueno se prepara"), cama: at("la cama"), cocina2: at("en la cocina", 52.5), desde: at("desde", 50),
  dar: at("te voy a dar"), diez: at("diez cenas"), ligeritas: at("ligeritas"), baratas: at("baratas"), tradicion: at("la tradicion"), hoy: at("se sabe hoy"), cuentos: at("sin cuentos"),
  doctora: at("no soy doctora"), milagros: at("milagros"), curan: at("no curan nada"), micasa: at("en mi casa", 73), dormia: at("se dormia"),
};

// ---------------- cámara: UNA sola, sin cortes (las entradas/salidas son iris, deslizadas y vuelos) ----------------
setKeys([
  { t: 0, p: [2.3, 0.9, -2.25], l: [4.3, 1.05, -1.75], fov: 60 },                 // desde la almohada: buró, despertador y la ventana con luna
  { t: 5.0, p: [2.32, 0.92, -2.2], l: [4.25, 1.2, -1.7], fov: 58 },
  { t: 6.0, p: [2.36, 0.95, -2.12], l: [3.4, 2.75, -2.15], fov: 56 },              // "mirando el techo": sube a las vigas
  { t: 7.3, p: [1.6, 1.45, 0.25], l: [-0.6, 1.45, -0.15], fov: 46, arc: 0.12 },  // gira a la puerta
  { t: 8.5, p: [-0.6, 1.6, -0.3], l: [-4.0, 1.85, -1.0], fov: 44 },               // cruza la cortina
  { t: 9.5, p: [-3.0, 1.8, -0.8], l: [-4.02, 1.72, -1.0], fov: 40 },              // el reloj de péndulo
  { t: 9.95, p: [-2.92, 1.82, -0.76], l: [-4.02, 1.7, -1.0], fov: 40 },
  { t: 10.8, p: [0.6, 2.0, 3.7], l: [0.7, 0.7, -1.0], fov: 48 },                  // sale al frente: la casa en corte
  { t: 12.0, p: [0.7, 1.95, 3.45], l: [1.2, 0.7, -1.0], fov: 46 },
  { t: 26.9, p: [0.3, 3.0, 10.8], l: [0.3, 1.4, -1.0], fov: 40 },                 // desde el patio, de noche
  { t: 29.2, p: [0.3, 2.8, 9.4], l: [0.3, 1.3, -1.0], fov: 40 },
  { t: 30.5, p: [-0.95, 1.35, 0.75], l: [-1.35, 0.8, -0.5], fov: 40, arc: 0.25 }, // a la mesita
  { t: 31.5, p: [-1.0, 1.3, 0.62], l: [-1.35, 0.8, -0.5], fov: 38 },
  { t: 41.1, p: [3.6, 1.2, -1.15], l: [3.75, 0.8, -2.55], fov: 44 },           // el buró: el vaso
  { t: 42.9, p: [3.55, 1.25, -0.95], l: [3.75, 0.82, -2.55], fov: 46 },
  { t: 44.5, p: [2.0, 1.7, 1.9], l: [2.6, 0.8, -1.6], fov: 44 },                  // la cama
  { t: 45.6, p: [1.9, 1.68, 1.75], l: [2.6, 0.8, -1.6], fov: 44 },
  { t: 46.4, p: [1.2, 1.6, -0.1], l: [-1.0, 1.55, -0.3], fov: 44 },               // a la puerta
  { t: 47.4, p: [-1.4, 1.85, -0.7], l: [-2.4, 2.2, -2.45], fov: 42 },             // las hierbas de la abuela
  { t: 52.9, p: [-2.55, 1.45, -1.25], l: [-2.75, 0.95, -2.55], fov: 40 },         // el fogón
  { t: 53.7, p: [-2.48, 1.5, -1.08], l: [-2.75, 0.95, -2.55], fov: 40 },
  { t: 55.7, p: [0.3, 2.55, 9.2], l: [0.25, 1.2, -1.0], fov: 42 },                // la casa entera: el caminito
  { t: 56.5, p: [0.2, 2.5, 8.7], l: [0.2, 1.2, -1.0], fov: 42 },
  { t: 57.6, p: [-1.93, 2.1, 1.25], l: [-1.93, 2.1, -2.86], fov: 46 },            // los diez jarritos
  { t: 61.6, p: [-1.93, 2.05, 0.95], l: [-1.93, 2.08, -2.86], fov: 46 },
  { t: 64.9, p: [-1.7, 1.85, 0.7], l: [-1.9, 1.7, -2.86], fov: 46 },
  { t: 69.4, p: [0.3, 2.75, 9.6], l: [0.3, 1.2, -1.0], fov: 42 },                 // la casa: vuelve la noche
  { t: 73.6, p: [0.35, 2.4, 8.0], l: [0.45, 1.2, -1.0], fov: 42 },
  { t: 76.6, p: [2.5, 1.55, 1.65], l: [2.55, 0.7, -1.6], fov: 42 },               // y en mi casa se dormía
  { t: 78, p: [2.5, 1.5, 1.4], l: [2.55, 0.7, -1.6], fov: 42 },
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => {
  const tarde = win(t, T.desde - 0.3, T.desde + 1.2) * (1 - win(t, 70.4, 72.2));
  return {
    t, hora: 1 - tarde,
    fire: 0.35 + 0.75 * tarde,
    vela: 1 - win(t, 75.9, 76.5),
    lamp: win(t, 41.0, 41.4) * (1 - win(t, 44.0, 44.6)) + tarde * 0.8 + win(t, 72.5, 73) * (1 - win(t, T.dormia - 0.2, T.dormia + 0.3)),
    steam: 0.5 + 0.5 * tarde,
    jarOn: JARS.map((_, i) => win(t, T.diez + i * 0.12, T.diez + i * 0.12 + 0.2) * (1 - win(t, 64.3, 64.8))),
    path: ei(t, T.cocina2 - 0.1, T.cocina2 + 1.9) * (1 - win(t, 56.9, 57.4)) + win(t, 73.4, 75.6) * (1 - win(t, 76.6, 77.1)),
    cena: { pan: spr(t, T.acuerdate + 0.6, 1.1) * (t < 32 ? 1 : 0), recal: 0, vaso: ei(t, T.vasote - 0.1, T.vasote + 0.8) * (1 - win(t, 43.3, 43.8)) },
    ring: t < 6 ? 0.25 : 0,
    relojGlow: win(t, T.reloj - 0.3, T.reloj + 0.3) * (1 - win(t, 10.2, 10.6)),
    hundida: t < 12 ? 1 : win(t, T.dormia - 0.6, T.dormia),
    roof: 1,
    cortina: 0.8,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real (clip LTX si ya llegó, si no la foto con empuje lento) ----------------
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; rot?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0, rot = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc + Math.abs(rot) * 0.004}) translateX(${ox * e(t, a, a + 7)}px) rotate(${rot}deg)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// deslizada horizontal con estela (de una toma a la otra, sin corte seco)
const Slide: React.FC<{ t: number; at: number; a: React.ReactNode; b: React.ReactNode; dir?: number }> = ({ t, at: a0, a, b, dir = 1 }) => {
  const sl = ei(t, a0, a0 + 0.5), mb = Math.sin(sl * Math.PI) * 34;
  return <>
    {sl < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{a}</AbsoluteFill>}
    {sl > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{b}</AbsoluteFill>}
  </>;
};

// =====================================================================================================================
// ---------------- PIEZAS NUEVAS del minuto 1 (noche de rancho: lila, luna, papel) ----------------
// =====================================================================================================================
// TIC / TAC: la palabra sale del péndulo, alternando lados, con onda de sonido
export const TicTac: React.FC<{ t: number; at: number; x: number; y: number; text: string; side: number; out: number }> = ({ t, at: a, x, y, text, side, out }) => {
  const k = Math.min(1.12, spr(t, a, 1.2)), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((r) => { const q = e(t, a + r * 0.12, a + 0.7 + r * 0.12); return <circle key={r} cx={x} cy={y} r={40 + 260 * q} fill="none" stroke={LI.crema} strokeWidth={4} opacity={(1 - q) * 0.7} />; })}
    </svg>
    <div style={{ position: "absolute", left: x + side * 300, top: y - 40, transform: `translate(-50%,-50%) scale(${k}) rotate(${side * 6}deg)`, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: LI.crema, letterSpacing: 8, textShadow: extrude(10, "#3a2a50") }}>{text}</div>
  </div>;
};

// pisadas al baño: huellas que salen de la cama hacia el patio (proyectadas del mundo) y el contador ×1 ×2
const TRIP: [number, number, number][] = [[1.78, 0.01, -1.1], [1.55, 0.01, -0.2], [1.35, 0.01, 0.7], [1.2, 0.01, 1.6], [1.1, 0.01, 2.6]];
export const Pasos: React.FC<{ t: number; a: number; b: number; dos: number; bano: number; out: number }> = ({ t, a, b, dos, bano, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a || o <= 0.01) return null;
  const N = 16, steps: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1), ta = a + k * (b - a) * 0.5; if (t < ta) break;
    const f = k * (TRIP.length - 1), j = Math.min(TRIP.length - 2, Math.floor(f)), r = f - j;
    const q: [number, number, number] = [TRIP[j][0] + (TRIP[j + 1][0] - TRIP[j][0]) * r + (i % 2 ? 0.09 : -0.09), 0.01, TRIP[j][2] + (TRIP[j + 1][2] - TRIP[j][2]) * r];
    const p = screenOf(t, q), al = e(t, ta, ta + 0.1);
    steps.push(<ellipse key={i} cx={p.x} cy={p.y} rx={13} ry={22} fill={LI.maiz} opacity={al * 0.9} transform={`rotate(${-12 + (i % 2) * 8} ${p.x} ${p.y})`} style={{ filter: "drop-shadow(0 0 10px rgba(242,193,78,.9))" }} />);
  }
  const c1 = Math.min(1.1, spr(t, a + 0.2, 1)), c2 = spr(t, dos, 1.3);
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{steps}</svg>
    <div style={{ position: "absolute", left: 1490, top: 250, transform: `translate(-50%,-50%) scale(${c1})`, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 210, lineHeight: 1, color: LI.crema, textShadow: extrude(12, "#3a2a50") }}>×{t >= dos ? 2 : 1}</div>
      <div style={{ transform: `scale(${t >= dos ? 1 + 0.2 * Math.max(0, 1 - c2) : 1})`, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: LI.maiz, opacity: e(t, bano - 0.3, bano), textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>al baño</div>
    </div>
  </AbsoluteFill>;
};

// papelitos que se olvidan: aparecen y se los lleva el aire
export const Olvidos: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const L = [["¿y las llaves?", 380, 260, -6], ["¿ya me tomé la pastilla?", 560, 520, 4], ["¿a qué vine?", 330, 790, -3]] as [string, number, number, number][];
  return <>{L.map(([tx, x, y, r], i) => {
    const a0 = a + i * 0.28, k = Math.min(1.1, spr(t, a0, 1)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out + i * 0.1, out + i * 0.1 + 0.5));
    if (o <= 0.01) return null;
    const fly = e(t, out + i * 0.1, out + i * 0.1 + 0.6);
    return <div key={i} style={{ position: "absolute", left: x + fly * 420, top: y - fly * 260, opacity: o, transform: `translate(-50%,-50%) rotate(${r + fly * 40 + Math.sin(t * 2 + i) * 2}deg) scale(${k})`, padding: "18px 30px", background: i === 1 ? "#f6e88a" : LI.papel, boxShadow: "0 22px 40px rgba(0,0,0,.5)", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: LI.tinta, whiteSpace: "nowrap" }}>{tx}</div>;
  })}</>;
};

// rótulo pegado: cinta y letras grandes (COMO TRAPO / DE MALAS)
export const Cinta: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; col?: string; size?: number }> = ({ t, at: a, out, x, y, text, rot = -5, col = LI.maiz, size = 96 }) => {
  const k = spr(t, a, 1.2), o = e(t, a, a + 0.05) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2 - Math.min(1, k)})` }}>
    <div style={{ position: "relative", padding: "12px 40px", background: "rgba(20,12,30,.86)", border: `5px solid ${col}`, borderRadius: 10, fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, whiteSpace: "nowrap", boxShadow: "0 24px 50px rgba(0,0,0,.6)" }}>
      {text}
      {[-1, 1].map((sg) => <div key={sg} style={{ position: "absolute", top: -18, [sg < 0 ? "left" : "right"]: -26, width: 110, height: 34, background: "rgba(240,230,200,.75)", transform: `rotate(${sg * 28}deg)` }} />)}
    </div>
  </div>;
};

// el ciclo: sol y luna dando la vuelta a un aro, "OTRA VEZ"
export const Ciclo: React.FC<{ t: number; at: number; txt: number; out: number; x: number; y: number }> = ({ t, at: a, txt, out, x, y }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const R = 190, ang = (t - a) * 2.4 + 0.5;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, spr(t, a, 0.9))})` }}>
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ overflow: "visible" }}>
      <circle r={R} fill="rgba(11,19,40,.55)" stroke={LI.lila} strokeWidth={6} strokeDasharray="22 16" transform={`rotate(${(t - a) * 40})`} />
      <path d={`M ${R - 16} -30 L ${R} 0 L ${R + 16} -30`} fill="none" stroke={LI.lila} strokeWidth={6} transform={`rotate(${(t - a) * 40 + 80})`} />
      <g transform={`translate(${Math.cos(ang) * R} ${Math.sin(ang) * R})`}><circle r={44} fill={LI.maiz} style={{ filter: "drop-shadow(0 0 20px #f2c14e)" }} />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={56} x2={0} y2={72} stroke={LI.maiz} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}</g>
      <g transform={`translate(${Math.cos(ang + Math.PI) * R} ${Math.sin(ang + Math.PI) * R})`}><circle r={42} fill="#e8ecff" style={{ filter: "drop-shadow(0 0 20px #b8c8ff)" }} /><circle cx={18} cy={-10} r={38} fill="#1b2442" /></g>
    </svg>
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) scale(${Math.min(1.1, spr(t, txt, 1.2))})`, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: 0.95, color: LI.crema, textShadow: extrude(7, "#3a2a50"), whiteSpace: "nowrap" }}>OTRA<br />VEZ</div>
  </div>;
};

// letra a mano que se escribe sola
export const Escrito: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number; dur?: number }> = ({ t, at: a, out, x, y, text, size = 100, col = LI.crema, rot = -4, dur = 1.1 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, a, a + dur);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * w}% -30% 0)`, textShadow: "0 6px 22px rgba(0,0,0,.85)" }}>{text}</div>;
};

// relojito de "9:00 p.m." que acompaña la tarjeta de la concha
export const Hora: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string; h: number }> = ({ t, at: a, out, x, y, label, h }) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const hA = (h % 12) * 30 * ei(t, a, a + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 18, padding: "14px 30px 14px 18px", borderRadius: 60, background: "rgba(20,12,30,.88)", boxShadow: `0 20px 40px rgba(0,0,0,.55), inset 0 0 0 3px ${LI.lila}88` }}>
    <svg width={86} height={86} viewBox="-50 -50 100 100"><circle r={46} fill={LI.crema} /><line x1={0} y1={0} x2={Math.sin(hA * Math.PI / 180) * 26} y2={-Math.cos(hA * Math.PI / 180) * 26} stroke={LI.tinta} strokeWidth={7} strokeLinecap="round" /><line x1={0} y1={0} x2={0} y2={-38} stroke={LI.rojo} strokeWidth={4} strokeLinecap="round" /><circle r={5} fill={LI.tinta} /></svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LI.crema }}>{label}</div>
  </div>;
};

// medidor del VASOTE: un vaso dibujado que se llena hasta el borde y avisa
export const Vasote: React.FC<{ t: number; at: number; out: number; x: number; y: number; warn: number }> = ({ t, at: a, out, x, y, warn }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const f = ei(t, a, a + 1.0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={260} height={340} viewBox="0 0 260 340" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <defs><clipPath id="vz"><path d="M 30 20 L 230 20 L 205 320 L 55 320 Z" /></clipPath></defs>
      <path d="M 30 20 L 230 20 L 205 320 L 55 320 Z" fill="rgba(255,255,255,.12)" />
      <g clipPath="url(#vz)"><rect x={0} y={320 - 300 * f} width={260} height={320} fill="#7fc3ff" opacity={0.85} />
        <path d={`M 0 ${320 - 300 * f} Q 65 ${312 - 300 * f + 8 * Math.sin(t * 6)} 130 ${320 - 300 * f} T 260 ${320 - 300 * f}`} fill="#b8e0ff" /></g>
      <path d="M 30 20 L 230 20 L 205 320 L 55 320 Z" fill="none" stroke="#fff" strokeWidth={7} />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LI.crema, textShadow: extrude(6, "#0a2a40"), marginTop: -6 }}>VASOTE</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LI.maiz, opacity: e(t, warn, warn + 0.3), transform: `scale(${Math.min(1.1, spr(t, warn, 1))})`, textShadow: "0 4px 14px #000" }}>…y a las 3, al baño</div>
  </div>;
};

// palabra que se tacha con un trazo de tinta (VIEJA / LA CAMA / MILAGROS)
export const Tachada: React.FC<{ t: number; at: number; cut: number; out: number; x: number; y: number; text: string; size?: number; col?: string; pre?: string }> = ({ t, at: a, cut, out, x, y, text, size = 120, col = LI.crema, pre }) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = e(t, cut, cut + 0.25);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center", whiteSpace: "nowrap" }}>
    {pre && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size * 0.45, color: LI.lila, textShadow: "0 4px 14px #000" }}>{pre}</div>}
    <div style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, textShadow: extrude(9, "#3a2a50") }}>
      {text}
      <svg width="110%" height={size} viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-5%", top: size * 0.12, overflow: "visible" }}>
        <path d="M 0 12 C 25 6, 50 15, 100 7" fill="none" stroke={LI.rojo} strokeWidth={4} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - c)} style={{ filter: "drop-shadow(0 0 6px rgba(224,80,58,.8))" }} />
      </svg>
    </div>
  </div>;
};

// números de barro que salen sobre cada jarrito (los diez)
export const JarNums: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => <>{JARS.map((q, i) => {
  const p = screenOf(t, [q[0], q[1] + 0.36, q[2]]), a0 = a + i * 0.12, k = Math.min(1.15, spr(t, a0, 1.2)), o = e(t, a0, a0 + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 30 * k, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LI.maiz, textShadow: extrude(7, "#5a2a10") }}>{i + 1}</div>;
})}</>;

// las dos placas: lo que decía la tradición (barro, a mano) + lo que se sabe hoy (pizarra limpia)
export const DosPlacas: React.FC<{ t: number; a: number; b: number; out: number; y?: number }> = ({ t, a, b, out, y = 830 }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a - 0.1 || o <= 0.01) return null;
  const ka = Math.min(1.08, spr(t, a, 1)), kb = Math.min(1.08, spr(t, b, 1));
  const plate = (k: number, x: number, bg: string, bd: string, top: string, main: string, font: string, col: string, ry: number) => k > 0.01 && <div style={{ position: "absolute", left: x, top: y, perspective: 1200, opacity: Math.min(1, k * 2) }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 80}deg) rotateY(${ry}deg)`, width: 640, padding: "22px 30px", borderRadius: 18, background: bg, border: `5px solid ${bd}`, boxShadow: "0 34px 60px rgba(0,0,0,.6)", textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: bd }}>{top}</div>
      <div style={{ fontFamily: font, fontWeight: 900, fontSize: 64, color: col, lineHeight: 1.1 }}>{main}</div>
    </div>
  </div>;
  return <AbsoluteFill style={{ opacity: o }}>
    {plate(ka, 590, "linear-gradient(180deg,#b5582f,#8a3f20)", "#f2c14e", "LO QUE DECÍA", "la tradición", HAND, LI.crema, 8)}
    {kb > 0.01 && <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${kb})`, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: LI.crema, textShadow: extrude(6, "#000") }}>+</div>}
    {plate(kb, 1330, "linear-gradient(180deg,#24314f,#141c30)", "#c9b3ea", "Y TAMBIÉN", "lo que se sabe hoy", SERIF, "#eef2ff", -8)}
  </AbsoluteFill>;
};

// sello que cae
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -8, size = 110, col = LI.lila }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
    <div style={{ border: `10px solid ${col}`, borderRadius: 16, padding: "4px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(15,8,25,.45)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{text}</div>
  </div>;
};

// iris de luz de luna (transición redonda desde un punto)
const Iris: React.FC<{ t: number; a: number; b: number; x: number; y: number; children: React.ReactNode }> = ({ t, a, b, x, y, children }) => {
  const r = ei(t, a, b);
  return r > 0 ? <Portal x={x} y={y} r={r} ring={0.8}>{children}</Portal> : null;
};

// =====================================================================================================================
// ---------------- EL MINUTO ----------------
// =====================================================================================================================
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;
  const inW = (a: number, b: number) => t >= a && t < b;

  // A · 0-3,66 · avatar "son las tres de la mañana, mija" → iris a la almohada
  if (t < AV[0][1] + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<Iris key="iA" t={t} a={AV[0][1] - 0.6} b={AV[0][1]} x={1350} y={430}>{W("wA", Math.max(3.0, t))}</Iris>);
    L.push(<Hora key="h3" t={t} at={0.55} out={AV[0][1] - 0.45} x={360} y={200} label="3:00 a.m." h={3} />);
  }
  // B · 3,66-12,0 · la almohada (las vigas) → cruza la cortina → el reloj: TIC · TAC → la casa de frente: las pisadas ×2
  if (inW(AV[0][1], 12.45)) {
    L.push(W("wB"));
    L.push(<Escrito key="et" t={t} at={T.techo} out={T.cocina + 0.2} x={960} y={300} text="…mirando el techo" size={92} col={LI.lila} />);
    const c = screenOf(t, [PT.reloj[0] + 0.15, PT.reloj[1] - 0.45, PT.reloj[2]]);
    L.push(<TicTac key="tc" t={t} at={T.tic} x={c.x} y={c.y} text="TIC" side={1} out={T.tac - 0.05} />);
    L.push(<TicTac key="tk" t={t} at={T.tac} x={c.x} y={c.y} text="TAC" side={1} out={T.levant} />);
    L.push(<Pasos key="ps" t={t} a={T.levant - 0.15} b={T.bano + 0.6} dos={T.dos} bano={T.bano} out={12.0} />);
  }
  // C · 12,0-14,2 · la foto: "ya te volteaste para un lado y para el otro"
  if (inW(11.95, AV[1][0] + 0.02)) {
    const p = screenOf(12, PT.almohada);
    const rot = -3.5 * e(t, T.unlado, T.unlado + 0.35) + 7 * e(t, T.otro - 0.1, T.otro + 0.3);
    L.push(<Iris key="iC" t={t} a={11.95} b={12.45} x={p.x} y={p.y}><Slide t={t} at={T.otro - 0.35} a={<Clip k="l_cama" t={t} a={11.95} rot={rot} />} b={<Clip k="l_vuelta" t={t} a={T.otro - 0.35} rot={rot} />} /></Iris>);
  }
  // D · 14,2-18,07 · avatar "y el sueño nomás no regresa, y tú sabes lo que viene"
  if (inW(AV[1][0], AV[1][1])) L.push(<Avatar key="avD" t={t} />);
  // E · 18,07-23,3 · como trapo / de malas / se te olvidan las cosas
  if (inW(AV[1][1], 23.85)) {
    L.push(<Slide key="sE" t={t} at={23.25} a={<Clip k="l_trapo" t={t} a={AV[1][1]} z={[1.1, 1.03]} />} b={<Clip k="l_silla" t={t} a={23.25} />} />);
    L.push(<Cinta key="ct" t={t} at={T.trapo} out={T.olvidar - 0.15} x={1380} y={250} text="COMO TRAPO" />);
    L.push(<Cinta key="cm" t={t} at={T.malas} out={T.olvidar - 0.15} x={1460} y={430} text="DE MALAS" rot={4} col={LI.lila} size={80} />);
    L.push(<Olvidos key="ol" t={t} at={T.olvidar} out={23.0} />);
  }
  // F · 23,3-27,0 · dormida en la silla, viendo la tele
  if (inW(23.75, 27.4)) {
    L.push(<Clip key="cF" k="l_silla" t={t} a={23.25} />);
    L.push(<Tag key="tg" t={t} at={T.silla} x={980} y={640} dx={-260} dy={-260} text="DORMIDA" sub="EN LA SILLA" col={LI.maiz} out={26.9} size={60} />);
    L.push(<Hora key="h5" t={t} at={at("en la tarde")} out={26.9} x={1540} y={170} label="5:30 p.m." h={5.5} />);
  }
  // G · 27,0-31,4 · la casa desde el patio, de noche: OTRA VEZ → vuelo a la mesita: ¿qué cenaste anoche?
  if (inW(26.95, AV[2][0] + 0.02)) {
    L.push(t < 27.45 ? <Iris key="iG" t={t} a={26.95} b={27.45} x={980} y={560}>{W("wG")}</Iris> : W("wG"));
    L.push(<Ciclo key="cy" t={t} at={27.05} txt={T.otravez} out={29.1} x={1440} y={330} />);
    L.push(<Escrito key="qc" t={t} at={T.acuerdate} out={AV[2][0] - 0.2} x={1240} y={210} text="¿qué cenaste anoche?" size={96} col={LI.crema} />);
  }
  // H · 31,4-36,06 · avatar con las cenas de anoche en tarjetas: la concha con café a las 9 / el recalentado
  if (inW(AV[2][0], AV[2][1])) {
    L.push(<Avatar key="avH" t={t} />);
    const kp = Math.min(1, spr(t, T.pan, 1)), op = e(t, T.pan, T.pan + 0.1) * (1 - e(t, T.recal - 0.1, T.recal + 0.2));
    L.push(<Card3D key="cp" id="img_n_pan" x={70} y={150} w={560} h={400} ry={22 * (1 - kp) + 14} rz={-3} o={op} label="PAN DULCE + CAFÉ" labelCol={LI.maiz} />);
    L.push(<Hora key="h9" t={t} at={T.nueve} out={T.recal - 0.1} x={350} y={650} label="9:00 p.m." h={9} />);
    const kr = Math.min(1, spr(t, T.recal, 1)), grow = ei(t, AV[2][1] - 0.5, AV[2][1]);
    L.push(<Card3D key="cr" id="img_n_recalentado" x={1290 - 1290 * grow} y={160 - 160 * grow} w={560 + 1360 * grow} h={400 + 680 * grow} ry={(-22 * (1 - kr) - 14) * (1 - grow)} rz={3 * (1 - grow)} o={e(t, T.recal, T.recal + 0.1)} label={grow < 0.3 ? "EL RECALENTADO" : undefined} labelCol={LI.maiz} />);
  }
  // I · 36,06-39,2 · el recalentado, con su chilito, ya tarde, frente a la tele
  if (inW(AV[2][1], 39.7)) {
    L.push(<Slide key="sI" t={t} at={39.15} a={<Clip k="n_recalentado" t={t} a={AV[2][1]} z={[1.0, 1.08]} />} b={<Clip k="l_cena_tarde" t={t} a={39.15} />} />);
    L.push(<Tag key="ch" t={t} at={T.chilito} x={860} y={560} dx={-240} dy={-220} text="CON SU CHILITO" col={LI.rojo} out={38.9} size={54} />);
    L.push(<Hora key="h10" t={t} at={T.tarde} out={38.9} x={1530} y={190} label="10:30 p.m." h={10.5} />);
  }
  // J · 39,2-41,1 · la cena ligerita… pero
  if (inW(39.65, 41.55)) {
    L.push(<Clip key="cJ" k="l_cena_tarde" t={t} a={39.15} />);
    L.push(<Cinta key="lg" t={t} at={T.ligerita} out={41.0} x={1400} y={260} text="LIGERITA" col="#9ad35a" />);
    L.push(<Escrito key="pe" t={t} at={40.8} out={41.1} x={1420} y={420} text="…pero" size={90} col={LI.maiz} dur={0.3} />);
  }
  // K · 41,1-47,3 · el buró: el VASOTE crece → la cama: "no es que estés vieja" → cruza a la cocina: lo que decía la abuela
  if (inW(41.05, AV[3][0] + 0.02)) {
    L.push(t < 41.55 ? <Iris key="iK" t={t} a={41.05} b={41.55} x={760} y={600}>{W("wK")}</Iris> : W("wK"));
    L.push(<Vasote key="vs" t={t} at={T.vasote} out={43.25} x={560} y={480} warn={T.acostarte} />);
    L.push(<Tachada key="vj" t={t} at={T.vieja - 0.25} cut={T.vieja + 0.25} out={45.3} x={960} y={250} text="VIEJA" pre="no es que estés…" size={150} />);
    L.push(<Escrito key="ab" t={t} at={T.abuela} out={AV[3][0] - 0.15} x={1220} y={860} text="Mi abuela decía…" size={100} col={LI.maiz} />);
  }
  // L · 47,3-52,98 · avatar: "hasta que cumplí los 60. El sueño se prepara en la cocina. No en la cama"
  if (inW(AV[3][0], AV[3][1])) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Sello key="60" t={t} at={T.sesenta} text="60" x={300} y={260} out={T.sueno - 0.1} rot={-6} size={150} col={LI.maiz} />);
    L.push(<Escrito key="s1" t={t} at={T.sueno} out={AV[3][1] - 0.2} x={400} y={180} text="El sueño se prepara" size={84} />);
    L.push(<Escrito key="s2" t={t} at={T.sueno + 0.7} out={AV[3][1] - 0.2} x={400} y={300} text="en la COCINA" size={104} col={LI.maiz} />);
    L.push(<Tachada key="nc" t={t} at={T.cama - 0.35} cut={T.cama + 0.1} out={AV[3][1] - 0.2} x={400} y={470} text="LA CAMA" pre="no en…" size={92} />);
  }
  // M · 52,98-57,5 · el fogón → la casa entera al atardecer: el caminito de luz de la cocina a la cama
  if (inW(AV[3][1], 57.6)) {
    L.push(W("wM"));
    if (t < AV[3][1] + 0.6) L.push(<Flash key="fM" t={t} at={AV[3][1]} col="#ffd8a0" peak={0.55} w={0.4} />);
    const fg = screenOf(t, PT.fogon);
    L.push(<Tag key="ec" t={t} at={T.cocina2} x={fg.x} y={fg.y} dx={260} dy={-200} text="EN LA COCINA" col={LI.maiz} out={T.desde + 0.6} size={58} />);
    L.push(<Escrito key="dt" t={t} at={T.desde} out={T.dar} x={1200} y={180} text="…y desde la tarde" size={96} col={LI.crema} />);
    const cm = screenOf(t, PT.cama);
    L.push(<Tag key="lc" t={t} at={55.0} x={cm.x} y={cm.y} dx={170} dy={-190} text="LA CAMA" sub="NOMÁS RECIBE" col={LI.lila} out={56.9} size={50} />);
  }
  // N · 57,5-64,85 · los DIEZ jarritos se encienden · ligeritas y baratas · tradición + lo que se sabe hoy
  if (inW(57.45, AV[4][0] + 0.02)) {
    L.push(W("wN"));
    L.push(<JarNums key="jn" t={t} a={T.diez} out={61.9} />);
    L.push(<Escrito key="10" t={t} at={T.diez + 0.2} out={61.9} x={960} y={150} text="10 cenas de rancho" size={110} col={LI.crema} />);
    L.push(<Cinta key="lg2" t={t} at={T.ligeritas} out={61.9} x={640} y={900} text="LIGERITAS" col="#9ad35a" size={80} rot={-4} />);
    L.push(<Cinta key="bt" t={t} at={T.baratas} out={61.9} x={1280} y={900} text="BARATAS" col={LI.maiz} size={80} rot={3} />);
  }
  L.push(<DosPlacas key="dp" t={t} a={T.tradicion} b={T.hoy} out={T.cuentos + 0.5} />);
  // O · 64,85-69,56 · avatar: "sin cuentos, porque yo no soy doctora"
  if (inW(AV[4][0], AV[4][1])) {
    L.unshift(<Avatar key="avO" t={t} />);
    L.push(<Sello key="sc" t={t} at={T.cuentos} text="SIN CUENTOS" x={1500} y={260} out={T.doctora - 0.1} rot={-5} size={84} />);
    L.push(<Escrito key="nd" t={t} at={T.doctora} out={AV[4][1] - 0.15} x={1460} y={250} text="no soy doctora" size={96} col={LI.crema} rot={3} />);
  }
  // P · 69,56-77,25 · la casa vuelve a la noche · "no te voy a prometer milagros" · "no curan nada" · "y en mi casa se dormía"
  if (t >= AV[4][1]) {
    L.push(W("wP"));
    L.push(<Tachada key="mg" t={t} at={T.milagros - 0.2} cut={T.milagros + 0.35} out={T.curan - 0.15} x={960} y={220} text="MILAGROS" size={130} />);
    L.push(<Cinta key="cn" t={t} at={T.curan} out={T.micasa - 0.1} x={960} y={200} text="NO CURAN NADA" col={LI.crema} size={84} rot={-2} />);
    L.push(<Escrito key="mc" t={t} at={T.micasa} out={1e9} x={1180} y={190} text="…pero en mi casa se dormía." size={92} col={LI.maiz} dur={2.4} />);
  }

  // destellos de luna en cada entrada/salida del avatar (nunca un corte seco)
  AV.forEach(([a, b], i) => { if (i > 0) L.push(<Flash key={"fa" + i} t={t} at={a} col="#e9e0ff" peak={0.45} w={0.28} />); if (i !== 3) L.push(<Flash key={"fb" + i} t={t} at={b} col="#e9e0ff" peak={0.4} w={0.28} />); });
  return <AbsoluteFill style={{ background: "#05070f" }}>{L}</AbsoluteFill>;
};
void DrawX;
