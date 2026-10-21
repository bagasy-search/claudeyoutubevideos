// lety01 · MINUTO 1 (0-81,9 s). Un solo hilo: la cocina de adobe de Lety y su OLLA DE PELTRE son el mundo; todo entra y sale de ahí
// sin cortes secos: avatar "mira esta cuchara" → portal a la cuchara 3D (chorro cremoso que cae despacio) → vapor → Lety con la cuchara
// → avatar "7 secretos / las pastelerías" → portal por la PUERTA del fondo del avatar → la noche: el patio es la POSADA → la lista
// de la posada (el postre = tú) → la olla en la estufa de depa → TODO JUNTO cae a la olla → avatar → humo negro → la OLLA EN CORTE
// (costra / duro / aguado) → el grano mordido → avatar + perilla al ALTO + engrudo → la vecina → el vasito a la mitad
// → Lety tranquila: "no fuiste tú" → el ORDEN (línea de tiempo) y el FUEGO bajito → avatar + toldo de pastelería → lata y fécula
// → $40 el vasito → Lety huele la canela: "no sabe a casa" → la repisa: 7 VASITOS = 7 SECRETOS. Todo con at("frase"). Audio fuera.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, VASOS, screenOf, camSpeed, setKeys, win } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, Card3D, DrawX, Flash, FONT, HAND, LT, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 84);
export const MIN1_END = 81.95;
export const MIN1_FRAMES = s(MIN1_END);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  resbala: at("resbala"), espesito: at("espesito"), brillante: at("brillante"), cremoso: at("cremoso"), pega: at("te pega tantito"), despacio: at("cae despacio"),
  mama: at("asi lo hacia mi mama"), siete: at("siete secretos"), pastel: at("pastelerias"), decir: at("decir"),
  posada: at("la posada"), ofreciste: at("ofreciste"), postre: at("postre"), quetanto: at("que tanto es"),
  olla: at("pones la olla"), arroz: at("el arroz", 26), leche: at("la leche", 27), azucar: at("el azucar", 28), canela: at("la canela", 29), junto: at("todo junto"),
  ponche: at("ponche"), regresas: at("regresas"), quemado: at("quemado"), fondo: at("el fondo"), pegado: at("pegado"), negro: at("negro"),
  aguado: at("aguado"), granitos: at("granitos"), muerdes: at("muerdes"), duro: at("duro"), nunca: at("nunca", 46),
  subes: at("subes al fuego"), engrudo: at("engrudo"), vecina: at("tu vecina"), sonrie: at("sonrie"), vasito: at("el vasito", 55), mitad: at("la mitad"),
  nofuiste: at("no fuiste tu"), receta: at("la receta"), orden: at("el orden"), quefuego: at("que fuego"),
  pastel2: at("pastelerias", 60), rapido: at("rapido"), condensada: at("condensada"), lata: at("de lata"), fecula: at("fecula"), cuarenta: at("40"),
  dulce: at("sabe dulce"), casa: at("a casa"), s7: at("7 secretos"), mami: at("de mi mama", 80),
};
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- cámara del minuto 1 ----------------
const O = PT.olla, SY = PT.sup[1];
setKeys([
  { t: 3.5, p: [O[0] + 0.62, SY + 0.5, O[2] + 0.95], l: [O[0], SY + 0.12, O[2]], fov: 34 },
  { t: 4.24, p: [O[0] + 0.6, SY + 0.48, O[2] + 0.92], l: [O[0], SY + 0.12, O[2]], fov: 34 },
  { t: 7.4, p: [O[0] - 0.25, SY + 0.4, O[2] + 0.9], l: [O[0] + 0.02, SY + 0.13, O[2]], fov: 32, arc: 0.05 },
  { t: 10.6, p: [O[0] - 0.05, SY + 0.22, O[2] + 0.7], l: [O[0], SY + 0.1, O[2]], fov: 30 },
  // la noche: de la cocina, por la puerta, a la posada
  { t: 16.2, p: [-2.2, 1.55, 0.35], l: [-6.2, 1.7, -0.6], fov: 42 },
  { t: 16.9, p: [-2.45, 1.55, 0.25], l: [-6.2, 1.75, -0.6], fov: 42 },
  { t: 19.2, p: [-4.9, 1.6, 0.55], l: [-8.2, 2.35, -0.7], fov: 40, arc: 0.15 },
  { t: 20.9, p: [-5.5, 1.5, 1.15], l: [-8.2, 1.7, 0.4], fov: 38 },
  // todo junto a la olla (fuego alto)
  { t: 26.9, p: [2.5, 1.98, -1.25], l: [O[0], 1.28, O[2]], fov: 36 },
  { t: 30.2, p: [2.28, 1.86, -1.42], l: [O[0], 1.28, O[2]], fov: 34 },
  // la olla en corte en la mesa
  { t: 37.4, p: [-0.42, 1.28, 0.75], l: [PT.corte[0], 0.97, PT.corte[2]], fov: 32 },
  { t: 41.0, p: [-0.95, 1.12, 0.52], l: [PT.corte[0], 0.95, PT.corte[2]], fov: 30, arc: 0.04 },
  { t: 44.7, p: [-0.75, 1.04, 0.38], l: [PT.corte[0], 0.93, PT.corte[2]], fov: 29 },
  // el orden y el fuego (fogón entero)
  { t: 60.1, p: [3.0, 1.85, 0.35], l: [1.25, 1.05, -2.4], fov: 40 },
  { t: 63.6, p: [2.75, 1.68, -0.05], l: [1.3, 1.0, -2.4], fov: 38 },
  // la repisa de los 7 vasitos
  { t: 77.5, p: [0.2, 2.1, -0.75], l: [-1.0, 1.5, -2.84], fov: 42 },
  { t: 79.1, p: [-1.24, 2.05, -1.3], l: [-1.24, 1.5, -2.84], fov: 40 },
  { t: 82, p: [-1.24, 2.0, -1.42], l: [-1.24, 1.5, -2.84], fov: 40 },
]);

// ---------------- estado del mundo por segundo ----------------
const dropK = (t: number, a: number, d: number) => (t < a ? undefined : (t - a) / d);
const worldAt = (t: number): WorldProps => {
  const night = t > 15.5 && t < 22 ? 1 : 0;
  const B = t < 11, H = t > 26 && t < 31, Q = t > 59 && t < 64;
  return {
    t, night,
    posada: win(t, 17.3, 18.5),
    fire: B ? 0.45 : H ? 1.6 : Q ? 1.75 - 1.3 * win(t, T.quefuego, T.quefuego + 0.5) : 1,
    cream: H ? 0.12 : Q ? 0.55 : 1,
    grains: H ? 0.75 : 0,
    steam: H ? 1.2 : 1,
    spoon: B ? { lift: ei(t, 3.9, 5.5), drip: win(t, 4.9, 5.6), slow: win(t, 8.2, 9.5) } : undefined,
    dip: B ? 0.7 * win(t, 4.2, 5.2) * (1 - win(t, 5.6, 9.8)) : 0,
    drop: H ? { arroz: dropK(t, T.arroz, 0.8), leche: dropK(t, T.leche - 0.1, 0.9), azucar: dropK(t, T.azucar, 0.8), canela: dropK(t, T.canela, 0.55) } : {},
    corte: t > 37 && t < 45 ? Math.min(1.06, spr(t, 37.35, 0.9)) : 0,
    corteGlow: [win(t, T.pegado - 0.2, T.negro) * (1 - win(t, T.aguado - 0.4, T.aguado)), win(t, T.muerdes, T.muerdes + 0.4), win(t, T.aguado, T.aguado + 0.4)],
    vasos: VASOS.map((_, i) => win(t, T.s7 + i * 0.13, T.s7 + i * 0.13 + 0.3)),
  };
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
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

// ---------------- toma real (clip LTX si ya llegó; si no, la foto con empuje lento) ----------------
export const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0, oy = 0 }) => {
  const q = e(t, a, a + 7), sc = z[0] + (z[1] - z[0]) * q;
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// barrido lateral con desenfoque de movimiento entre dos tomas (whip)
export const Whip: React.FC<{ t: number; at: number; a: React.ReactNode; b: React.ReactNode; dir?: 1 | -1; d?: number }> = ({ t, at: a0, a, b, dir = 1, d = 0.45 }) => {
  const sl = ei(t, a0, a0 + d), mb = Math.sin(sl * Math.PI) * 40;
  return <AbsoluteFill>
    {sl < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{a}</AbsoluteFill>}
    {sl > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{b}</AbsoluteFill>}
  </AbsoluteFill>;
};

// ================= PIEZAS NUEVAS de este minuto =================
// vapor de la olla que tapa la pantalla (ida y vuelta)
export const Vaho: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.5 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 13 }, (_, i) => {
    const x = (i * 151) % 1920, y = 1150 - ((t - mid + w) / (2 * w)) * (950 + (i % 5) * 110) + (i % 3) * 130, r = 400 + (i % 4) * 130;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,250,240,${0.78 * k}) 0%, rgba(255,250,240,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.6), filter: "blur(16px)" }}><AbsoluteFill style={{ background: `rgba(255,248,236,${0.88 * Math.pow(k, 1.6)})` }} /></AbsoluteFill>;
};

// humo NEGRO que sube desde abajo y tapa (quemado) — después se disipa
export const HumoNegro: React.FC<{ t: number; a: number; full: number; out: number }> = ({ t, a, full, out }) => {
  const k = e(t, a, full) * (1 - e(t, out, out + 0.9));
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 16 }, (_, i) => {
    const x = ((i * 233) % 2100) - 90 + Math.sin(t * 0.8 + i) * 40, y = 1250 - k * (700 + (i % 4) * 160) - (t - a) * 30 + (i % 3) * 90, r = 330 + (i % 5) * 90;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(28,22,18,${0.9 * k}) 0%, rgba(28,22,18,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), filter: "blur(22px)", opacity: Math.min(1, k * 1.3) }} />;
};

// palabras de crema: cada una cae con resorte y le escurre una gota de nata por debajo
const CremaWords: React.FC<{ t: number; items: [string, number][]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < items[0][1] - 0.05) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1100 }}>
    {items.map(([w, a], i) => {
      const k = Math.min(1.12, spr(t, a, 1.1)); if (t < a) return null;
      const g = e(t, a + 0.15, a + 1.6);
      return <div key={i} style={{ position: "relative", height: 170, transform: `translateY(${(1 - Math.min(1, k)) * -120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotate(${-3 + i * 2}deg)`, transformOrigin: "0 100%" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 112, color: LT.crema, letterSpacing: 2, textShadow: extrude(9, "#b9905a") }}>{w}</div>
        <svg width={520} height={120} style={{ position: "absolute", left: 30 + i * 60, top: 108, overflow: "visible" }}>
          <path d={`M 0 0 Q 10 ${12 + 40 * g} 22 ${10 + 52 * g} Q 32 ${12 + 40 * g} 40 0 Z`} fill={LT.crema} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.4))" }} />
          <circle cx={22} cy={14 + 56 * g} r={9 * g} fill={LT.crema} />
        </svg>
      </div>;
    })}
  </div>;
};

// recado de receta: ficha de cartulina con orilla turquesa (como la blusa de Lety) y tachuela
export const Recado: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number; sign?: string }> = ({ t, at: a, out, x, y, lines, rot = -3, w = 520, sign }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * -70}deg) rotate(${rot + Math.sin(t * 1.1) * 0.8}deg)`, width: w, padding: "30px 38px 28px", background: `linear-gradient(180deg, #fffaf0, ${LT.papel})`, borderRadius: 10,
      boxShadow: `0 30px 60px rgba(0,0,0,.55), inset 0 0 0 10px ${LT.turq}, inset 0 0 0 14px #fffaf0, inset 0 0 0 17px ${LT.rosa}` }}>
      <div style={{ position: "absolute", left: "50%", top: -12, width: 34, height: 34, borderRadius: "50%", transform: "translateX(-50%)", background: `radial-gradient(circle at 35% 35%, #ff9ab6, ${LT.rosa} 60%, #8a1a3a)`, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: i === 0 ? 70 : 52, lineHeight: i === 0 ? "78px" : "60px", color: LT.tinta, clipPath: `inset(-10% ${100 - 100 * e(t, a + 0.15 + i * 0.35, a + 0.7 + i * 0.35)}% -10% 0)` }}>{ln}</div>)}
      {sign && <div style={{ textAlign: "right", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LT.rosa, opacity: e(t, a + 0.9, a + 1.2) }}>{sign}</div>}
    </div>
  </div>;
};

// fila de 7 vasitos de barro (2.5D) que brincan uno por uno
export const VasitosRow: React.FC<{ t: number; at: number; out: number; y: number }> = ({ t, at: a, out, y }) => {
  if (t < a - 0.05 || t > out + 0.4) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26 }}>
    {Array.from({ length: 7 }, (_, i) => {
      const a0 = a + i * 0.09, k = Math.min(1.15, spr(t, a0, 1.3)), o = e(t, a0, a0 + 0.06) * (1 - e(t, out + i * 0.03, out + i * 0.03 + 0.25));
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) scale(${0.5 + 0.5 * k})` }}>
        <svg width={110} height={130} viewBox="0 0 110 130" style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,.55))" }}>
          <ellipse cx={55} cy={24} rx={44} ry={12} fill="#fff1d6" />
          <path d="M 11 24 L 20 116 Q 55 130 90 116 L 99 24 Q 55 40 11 24 Z" fill="#b65a2c" />
          <path d="M 16 54 Q 55 66 94 54" stroke="#f2e2c0" strokeWidth={4} fill="none" />
          <path d="M 11 24 Q 55 40 99 24" stroke="#7a3412" strokeWidth={3} fill="none" />
          <circle cx={42} cy={20} r={4} fill="#8a4a22" /><circle cx={62} cy={26} r={3} fill="#8a4a22" /><circle cx={70} cy={18} r={2.5} fill="#8a4a22" />
          <text x={55} y={100} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill="#fff1d6">{i + 1}</text>
        </svg>
      </div>;
    })}
  </div>;
};

// letrero de pastelería colgante; a la palabra clave le cae encima una cinta "NO TE LO DICEN"
export const Letrero: React.FC<{ t: number; at: number; tape: number; out: number; x: number; y: number; text: string; tapeText: string }> = ({ t, at: a, tape, out, x, y, text, tapeText }) => {
  const k = spr(t, a, 0.8), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = (1 - Math.min(1, k)) * 24 + 4 * Math.sin((t - a) * 3) * Math.exp(-(t - a) * 0.9);
  const tk = Math.min(1.1, spr(t, tape, 1.4));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% -60px", transform: `translate(-50%,0) rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -260}px)` }}>
    <svg width={460} height={60} style={{ position: "absolute", left: 0, top: -60 }}><line x1={70} y1={0} x2={110} y2={60} stroke="#c9b58a" strokeWidth={4} /><line x1={390} y1={0} x2={350} y2={60} stroke="#c9b58a" strokeWidth={4} /></svg>
    <div style={{ width: 460, padding: "22px 0 20px", textAlign: "center", borderRadius: 18, background: "linear-gradient(180deg,#fdf6f8,#f3dfe6)", boxShadow: `0 30px 50px rgba(0,0,0,.5), inset 0 0 0 6px ${LT.rosa}`, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: "#8a1a3a", letterSpacing: 3 }}>
      🧁 {text}
    </div>
    {t >= tape && <div style={{ position: "absolute", left: -30, top: 40, width: 520, padding: "10px 0", textAlign: "center", background: LT.turq, transform: `rotate(-6deg) scale(${tk})`, boxShadow: "0 12px 24px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 4 }}>{tapeText}</div>}
  </div>;
};

// lista de la posada pegada en el refri: lo que lleva cada quien; el renglón del postre se encierra con plumón
const ListaPosada: React.FC<{ t: number; at: number; circle: number; out: number; x: number; y: number }> = ({ t, at: a, circle, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const rows: [string, string][] = [["Ponche", "Doña Mary"], ["Tamales", "los Pérez"], ["Piñata", "Don Beto"], ["Postre", "¡TÚ!"]];
  const c = e(t, circle, circle + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 55 - 8}deg) rotate(2.5deg)`, width: 520, padding: "26px 36px 30px", background: "linear-gradient(180deg,#fffef8,#f1ead6)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", borderRadius: 4 }}>
      <div style={{ position: "absolute", right: 26, top: -18, width: 46, height: 46, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ffe08a, #f2a31b 60%, #9a5a00)`, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: LT.rosa }}>Posada · 16 dic.</div>
      {rows.map(([q, who], i) => <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: i === 3 ? 700 : 500, fontSize: 50, lineHeight: "62px", color: LT.tinta, opacity: e(t, a + 0.15 + i * 0.12, a + 0.3 + i * 0.12) }}>
        <span>{q}</span><span style={{ color: i === 3 ? LT.rosa : LT.tinta }}>{who}</span>
        {i === 3 && c > 0 && <svg width={500} height={90} style={{ position: "absolute", left: -20, top: -14, overflow: "visible" }}>
          <ellipse cx={240} cy={44} rx={250} ry={40} fill="none" stroke={LT.rosa} strokeWidth={6} strokeDasharray={1600} strokeDashoffset={1600 * (1 - c)} transform="rotate(-2 240 44)" strokeLinecap="round" />
        </svg>}
      </div>)}
    </div>
  </div>;
};

// globito de pensamiento (lo que piensa la que cocina)
export const Burbuja: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; tail?: "l" | "r" }> = ({ t, at: a, out, x, y, text, tail = "l" }) => {
  const k = Math.min(1.12, spr(t, a, 1.2)), o = e(t, a, a + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <div style={{ position: "relative", padding: "22px 40px", borderRadius: 60, background: "#fffaf0", boxShadow: "0 24px 50px rgba(0,0,0,.5)", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: LT.tinta, whiteSpace: "nowrap" }}>
      {text}
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", [tail === "l" ? "left" : "right"]: 40 - i * 26, bottom: -26 - i * 30, width: 30 - i * 12, height: 30 - i * 12, borderRadius: "50%", background: "#fffaf0", boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />)}
    </div>
  </div>;
};

// fichas de ingredientes: en "junto" caen todas a la vez a una olla dibujada; en "orden" se reparten en una línea de tiempo con minutos
type Ing = { lab: string; col: string; at: number; min: number };
const OLLA_SVG = <svg width={300} height={210} viewBox="0 0 300 210"><ellipse cx={150} cy={40} rx={128} ry={26} fill="#e6e2d6" /><path d="M 22 40 L 34 178 Q 150 214 266 178 L 278 40 Q 150 72 22 40 Z" fill="#1f5fa8" />
  {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={40 + ((i * 53) % 220)} cy={70 + ((i * 37) % 110)} r={3} fill="#fff" opacity={0.85} />)}<rect x={0} y={60} width={30} height={14} rx={7} fill="#174d92" /><rect x={270} y={60} width={30} height={14} rx={7} fill="#174d92" /></svg>;
export const Ingredientes: React.FC<{ t: number; items: Ing[]; mode: "junto" | "orden"; out: number; x?: number; y?: number; lineAt?: number }> = ({ t, items, mode, out, x = 1500, y = 760, lineAt = 0 }) => {
  const o = 1 - e(t, out, out + 0.35);
  if (o <= 0.01 || t < items[0].at - 0.1) return null;
  const maxM = Math.max(...items.map((i) => i.min)), X0 = 300, X1 = 1620, YL = 880;
  const L = e(t, lineAt, lineAt + 0.7);
  return <AbsoluteFill style={{ opacity: o }}>
    {mode === "junto" && <div style={{ position: "absolute", left: x - 150, top: y - 20, opacity: e(t, items[0].at - 0.1, items[0].at + 0.15), filter: "drop-shadow(0 26px 30px rgba(0,0,0,.55))" }}>{OLLA_SVG}</div>}
    {mode === "orden" && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={X0} y1={YL} x2={X0 + (X1 - X0) * L} y2={YL} stroke={LT.crema} strokeWidth={8} strokeLinecap="round" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.7))" }} />
      {Array.from(new Set(items.map((i) => i.min))).map((m) => { const xx = X0 + (X1 - X0) * (m / maxM); return L * (X1 - X0) + X0 >= xx && <g key={m}><line x1={xx} y1={YL - 18} x2={xx} y2={YL + 18} stroke={LT.crema} strokeWidth={6} /><text x={xx} y={YL + 70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={LT.crema} style={{ filter: "drop-shadow(0 3px 6px #000)" }}>{m === 0 ? "min 0" : `min ${m}`}</text></g>; })}
    </svg>}
    {items.map((it, i) => {
      if (t < it.at) return null;
      const k = Math.min(1.12, spr(t, it.at, 1.2));
      let px: number, py: number, rot: number;
      if (mode === "junto") { const f = ei(t, it.at + 0.2, it.at + 0.7); px = x + (i - 1.5) * 40 * (1 - f); py = y - 260 + 230 * f + (1 - Math.min(1, k)) * -200; rot = (i - 1.5) * 9 + f * 20 * (i % 2 ? 1 : -1); }
      else { const sameBefore = items.slice(0, i).filter((q) => q.min === it.min).length; px = X0 + (X1 - X0) * (it.min / maxM); py = YL - 110 - sameBefore * 96 + (1 - Math.min(1, k)) * 120; rot = -2 + sameBefore * 3; }
      const sink = mode === "junto" ? e(t, it.at + 0.55, it.at + 0.8) : 0;
      return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${(0.6 + 0.4 * Math.min(1, k)) * (1 - 0.6 * sink)})`, opacity: 1 - sink * 0.9,
        padding: "12px 30px", borderRadius: 40, background: it.col, boxShadow: "0 18px 34px rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.4)", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 3, whiteSpace: "nowrap", textShadow: "0 3px 0 rgba(0,0,0,.25)" }}>{it.lab}</div>;
    })}
  </AbsoluteFill>;
};

// sello de "error" con borde de plumón
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -7, size = 110, col = "#e23a2a" }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.3 - 1.3 * Math.min(1, k)})` }}>
    <div style={{ border: `9px solid ${col}`, borderRadius: 18, padding: "2px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(255,250,240,.12)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)", boxShadow: "0 0 30px rgba(0,0,0,.35)" }}>{text}</div>
  </div>;
};

// el grano en corte (lupa): por fuera suave y translúcido, por dentro un CENTRO gredoso
const GranoCorte: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 1)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = e(t, a + 0.35, a + 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <svg width={560} height={420} viewBox="-280 -210 560 420" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <circle r={200} fill="rgba(255,255,255,.08)" stroke="#e9e2cf" strokeWidth={14} />
      <line x1={140} y1={140} x2={250} y2={250} stroke="#5a3a22" strokeWidth={26} strokeLinecap="round" />
      <ellipse rx={150} ry={64} fill="rgba(250,246,236,.9)" stroke="#d8ccb0" strokeWidth={4} />
      <ellipse rx={150 * 0.72} ry={64 * 0.66} fill="rgba(255,255,255,.45)" />
      <ellipse rx={66 * c} ry={30 * c} fill="#fdfdfb" stroke="#bdb4a0" strokeWidth={3} strokeDasharray="8 6" />
      {c > 0.5 && Array.from({ length: 14 }, (_, i) => <circle key={i} cx={Math.cos(i * 2.4) * 40 * c} cy={Math.sin(i * 1.7) * 16 * c} r={3} fill="#cfc6b2" />)}
    </svg>
    <div style={{ position: "absolute", left: "50%", top: 330, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: LT.crema, textShadow: extrude(6, "#3a2414"), opacity: c }}>CRUDO POR DENTRO</div>
  </div>;
};

// perilla de la estufa con BAJO / MEDIO / ALTO: gira y la flamita crece o se achica
export const Perilla: React.FC<{ t: number; at: number; from: number; to: number; dur?: number; out: number; x: number; y: number }> = ({ t, at: a, from, to, dur = 0.7, out, x, y }) => {
  const o = e(t, a - 0.25, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = from + (to - from) * ei(t, a, a + dur), ang = -120 + 240 * v;
  const fl = 0.4 + 0.8 * v, wob = 1 + 0.06 * Math.sin(t * 17) * Math.sin(t * 7);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * Math.min(1, spr(t, a - 0.25))})` }}>
    <svg width={380} height={460} viewBox="-190 -270 380 460" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <g transform={`translate(0 -150) scale(${fl * wob})`}>
        <path d="M 0 -90 C 40 -40 50 0 0 40 C -50 0 -40 -40 0 -90 Z" fill={v > 0.66 ? "#ff6a1a" : "#2f7dff"} opacity={0.9} />
        <path d="M 0 -40 C 18 -10 22 10 0 30 C -22 10 -18 -10 0 -40 Z" fill={v > 0.66 ? "#ffd27a" : "#a9d4ff"} />
      </g>
      <circle r={120} fill="#e9e4da" stroke="#b9b2a4" strokeWidth={6} />
      {["BAJO", "MEDIO", "ALTO"].map((l, i) => { const aa = (-120 + 120 * i) * Math.PI / 180; return <text key={l} x={Math.sin(aa) * 160} y={-Math.cos(aa) * 160 + 12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={Math.abs(v - i / 2) < 0.2 ? (i === 2 ? "#ff6a1a" : LT.turq) : LT.crema} style={{ filter: "drop-shadow(0 3px 5px #000)" }}>{l}</text>; })}
      <g transform={`rotate(${ang})`}><rect x={-22} y={-110} width={44} height={150} rx={20} fill="#2a2622" /><rect x={-6} y={-100} width={12} height={40} rx={6} fill={LT.crema} /></g>
    </svg>
  </div>;
};

// medidor de vasito a la mitad (se vacía hasta 1/2)
export const MedioVaso: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const lv = 1 - 0.5 * ei(t, a + 0.15, a + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 26 }}>
    <svg width={190} height={230} viewBox="0 0 190 230" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <clipPath id="mv"><path d="M 20 20 L 36 206 Q 95 222 154 206 L 170 20 Z" /></clipPath>
      <path d="M 20 20 L 36 206 Q 95 222 154 206 L 170 20 Z" fill="#b65a2c" />
      <rect x={0} y={20 + 190 * (1 - lv)} width={190} height={230} fill="#fff1d6" clipPath="url(#mv)" opacity={0.95} />
      <path d="M 20 20 L 36 206 Q 95 222 154 206 L 170 20" stroke="#7a3412" strokeWidth={6} fill="none" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: LT.crema, textShadow: extrude(9, "#3a2414") }}>½</div>
  </div>;
};

// toldo de rayas de pastelería que baja desde arriba; con "RÁPIDO" le salen líneas de velocidad
export const Toldo: React.FC<{ t: number; at: number; fast: number; out: number }> = ({ t, at: a, fast, out }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const f = e(t, fast, fast + 0.25);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * -260}px)` }}>
    <div style={{ height: 120, background: `repeating-linear-gradient(90deg, ${LT.rosa} 0 80px, #fff4f6 80px 160px)`, boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
    <svg width={1920} height={50} style={{ display: "block" }}>{Array.from({ length: 24 }, (_, i) => <path key={i} d={`M ${i * 80} 0 Q ${i * 80 + 40} 60 ${i * 80 + 80} 0 Z`} fill={i % 2 ? "#fff4f6" : LT.rosa} />)}</svg>
    <div style={{ position: "absolute", left: "50%", top: 22, transform: "translateX(-50%)", padding: "8px 40px", borderRadius: 14, background: "#fffaf0", fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: "#8a1a3a", letterSpacing: 4, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>PASTELERÍA</div>
    {f > 0 && <div style={{ position: "absolute", right: 120, top: 210, transform: `translateX(${(1 - f) * 600}px) skewX(-14deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#fff", textShadow: extrude(8, "#8a1a3a"), opacity: f }}>
      RÁPIDO
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: -260 + i * 30, top: 34 + i * 30, width: 220 - i * 40, height: 10, borderRadius: 5, background: "rgba(255,255,255,.8)" }} />)}
    </div>}
  </div>;
};

// lata de condensada y costal de fécula (2.5D) que se tachan
export const Lata: React.FC<{ t: number; at: number; xAt: number; out: number; x: number; y: number }> = ({ t, at: a, xAt, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) perspective(900px) rotateY(${(1 - Math.min(1, k)) * -70 - 14 + 5 * Math.sin(t)}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, width: 260, height: 300, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 40, borderRadius: "50%", background: "linear-gradient(90deg,#9aa0a4,#e9eef0 45%,#8a9094)" }} />
      <div style={{ position: "absolute", left: 0, top: 20, width: 260, height: 260, background: "linear-gradient(90deg,#8a9094,#eef2f4 40%,#b9bfc2 70%,#7a8084)" }} />
      <div style={{ position: "absolute", left: 0, top: 70, width: 260, height: 150, background: "linear-gradient(90deg,#1b3f8a,#3a6fd0 40%,#1b3f8a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", fontSize: 30, letterSpacing: 2, lineHeight: "36px", textAlign: "center" }}>LECHE<br />CONDENSADA</div>
      <div style={{ position: "absolute", left: 0, top: 262, width: 260, height: 38, borderRadius: "50%", background: "#7a8084" }} />
    </div>
    <div style={{ position: "absolute", left: -170, top: -180 }}><DrawX t={t} at={xAt} x={0} y={0} w={340} h={360} /></div>
  </div>;
};
export const Costal: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) rotate(${6 + 3 * Math.sin(t * 1.3)}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, width: 250, height: 300, borderRadius: "30px 30px 50px 50px", background: "linear-gradient(90deg,#d9d2c2,#fbf8f0 45%,#cfc7b6)", boxShadow: "0 30px 50px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: -14, left: 80, width: 90, height: 40, background: "#cfc7b6", clipPath: "polygon(0 100%, 20% 0, 40% 60%, 60% 0, 80% 60%, 100% 0, 100% 100%)" }} />
      <div style={{ padding: "16px 22px", border: "5px solid #c2552d", borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#c2552d", letterSpacing: 3 }}>FÉCULA</div>
    </div>
    <div style={{ position: "absolute", left: -160, top: -170 }}><DrawX t={t} at={a + 0.9} x={0} y={0} w={320} h={340} /></div>
  </div>;
};

// etiqueta de vitrina que gira en 3D y muestra el precio
export const Ticket: React.FC<{ t: number; at: number; out: number; x: number; y: number; top: string; sub: string }> = ({ t, at: a, out, x, y, top, sub }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = (1 - Math.min(1, k)) * 180 + 8 * Math.sin((t - a) * 1.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${ry}deg) rotateX(6deg)`, padding: "22px 50px 18px", borderRadius: 16, background: "linear-gradient(180deg,#ffffff,#eef2f6)", boxShadow: `0 40px 70px rgba(0,0,0,.6), inset 0 0 0 5px ${LT.rosa}`, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#8a1a3a", lineHeight: 1 }}>{top}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#333", letterSpacing: 5 }}>{sub}</div>
    </div>
  </div>;
};

// letra a mano que se escribe sola
export const Escrito: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; dur?: number }> = ({ t, at: a, out, x, y, text, size = 120, col = LT.crema, dur = 1.0 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, a, a + dur);
  if (w <= 0.01 || o <= 0.01) return null;
  const hw = text.length * size * 0.23 + 20, cx = Math.min(1900 - hw, Math.max(20 + hw, x));
  return <div style={{ position: "absolute", left: cx, top: y, opacity: o, transform: "translate(-50%,-50%) rotate(-4deg)", fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 22px rgba(0,0,0,.8)" }}>{text}</div>;
};

// número de barro que sale de cada vasito de la repisa
const VasoNums: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => <>{VASOS.map((q, i) => {
  const p = screenOf(t, [q[0], q[1] + 0.2, q[2]]), a0 = a + i * 0.13, k = Math.min(1.15, spr(t, a0, 1.2)), o = e(t, a0, a0 + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 50 * k, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LT.crema, textShadow: extrude(8, "#7a3412") }}>{i + 1}</div>;
})}</>;

// ---------------- EL MINUTO ----------------
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t) => <World key={k} t={tt} />;
  const sp = (tt: number) => screenOf(tt, [O[0] + 0.02, SY + 0.22, O[2]]); // el cuenco de la cuchara

  // A · 0-4,24 · avatar "mira nomás esta cuchara" → portal a la cuchara 3D
  if (t < AVS[0][1]) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, Math.max(3.55, T.resbala + 0.9), AVS[0][1]);
    if (r > 0) { const c = sp(4.24); L.push(<Portal key="pA" x={c.x} y={c.y} r={r}>{W("wA", Math.max(3.6, t))}</Portal>); }
  }
  // B · 4,24-10,6 · la cuchara sube y el chorro cremoso cae… despacio
  if (t >= AVS[0][1] && t < 10.75) {
    L.push(W("wB"));
    const c = sp(t), st = screenOf(t, [O[0], SY + 0.09, O[2]]);
    L.push(<Tag key="pg" t={t} at={T.pega} x={c.x - 10} y={c.y + 10} dx={260} dy={-130} text="SE PEGA TANTITO" col={LT.crema} out={9.2} size={46} />);
    L.push(<Tag key="cd" t={t} at={T.despacio} x={st.x} y={st.y} dx={280} dy={60} text="CAE DESPACIO" col={LT.crema} out={10.5} size={74} />);
  }
  L.push(<CremaWords key="cw" t={t} items={[["ESPESITO", T.espesito], ["BRILLANTE", T.brillante], ["CREMOSO", T.cremoso]]} out={8.9} x={120} y={170} />);
  // C · 10,6-13,3 · Lety con su cuchara: "así lo hacía mi mamá"
  if (t >= 10.55 && t < AVS[1][0] + 0.02) {
    L.push(<Clip key="c1" k="m1_cuchara" t={t} a={10.55} z={[1.1, 1.03]} />);
    L.push(<Recado key="rm" t={t} at={T.mama} out={AVS[1][0] - 0.15} x={1460} y={300} lines={["Así lo hacía", "mi mamá ♥"]} sign="— Doña Chayo" w={470} />);
  }
  L.push(<Vaho key="v1" t={t} mid={10.6} />);
  // D · 13,3-16,9 · avatar: 7 secretos que las pastelerías no te van a decir → portal por la PUERTA
  if (t >= AVS[1][0] && t < AVS[1][1]) {
    L.push(<Avatar key="avD" t={t} />);
    L.push(<VasitosRow key="vr" t={t} at={T.siete} out={T.pastel - 0.1} y={860} />);
    L.push(<Letrero key="lt" t={t} at={T.pastel} tape={T.decir - 0.1} out={AVS[1][1] - 0.2} x={1450} y={170} text="PASTELERÍAS" tapeText="NO TE LO DICEN" />);
    const r = ei(t, AVS[1][1] - 0.6, AVS[1][1]);
    if (r > 0) L.push(<Portal key="pD" x={330} y={470} r={r}>{W("wD", Math.max(16.2, t))}</Portal>);
  }
  // E · 16,9-20,9 · de noche: por la puerta al patio, que es la POSADA
  if (t >= AVS[1][1] && t < 21.0) {
    L.push(W("wE"));
    const pn = screenOf(t, PT.pinata);
    L.push(<Tag key="po" t={t} at={T.posada} x={pn.x} y={pn.y + 40} dx={-300} dy={160} text="LA POSADA" sub="DE TU CUADRA" col="#ffd27a" out={20.6} size={60} />);
  }
  // F · 20,6-25,3 · la posada de verdad (foto) + la lista: el postre te tocó a TI
  if (t >= 20.55 && t < 25.6) {
    L.push(<Whip key="wF" t={t} at={20.55} a={W("wE2", Math.min(t, 20.9))} b={<Clip k="m1_posada" t={t} a={20.55} z={[1.04, 1.1]} />} />);
    L.push(<ListaPosada key="lp" t={t} at={Math.max(20.9, T.ofreciste)} circle={T.postre} out={T.quetanto - 0.15} x={1440} y={520} />);
    L.push(<Burbuja key="bq" t={t} at={T.quetanto} out={25.2} x={1300} y={300} text="¿qué tanto es?" />);
  }
  // G · 25,3-27,0 · "pones la olla" (la estufa del depa, fuego alto)
  if (t >= 25.3 && t < 27.4) L.push(<Whip key="wG" t={t} at={25.3} d={0.4} a={<Clip k="m1_posada" t={t} a={20.55} z={[1.04, 1.1]} />} b={<Clip k="m1_ollasola" t={t} a={25.3} z={[1.02, 1.09]} />} />);
  // H · 27,0-30,1 · el arroz, la leche, el azúcar, la canela… TODO JUNTO a la olla
  if (t >= 26.95 && t < AVS[2][0] + 0.02) L.push(W("wH"));
  L.push(<Vaho key="v2" t={t} mid={27.0} w={0.4} />);
  L.push(<Ingredientes key="ij" t={t} mode="junto" out={31.0} items={[{ lab: "ARROZ", col: "#c9a26a", at: T.arroz, min: 0 }, { lab: "LECHE", col: "#7aa6d6", at: T.leche, min: 0 }, { lab: "AZÚCAR", col: LT.rosa, at: T.azucar, min: 0 }, { lab: "CANELA", col: LT.canela, at: T.canela, min: 0 }]} x={1500} y={700} />);
  // I · 30,1-36,0 · avatar: todo junto, al ponche, regresas… huele a quemado (humo negro)
  if (t >= AVS[2][0] && t < AVS[2][1]) {
    L.push(<Avatar key="avI" t={t} />);
    L.push(<Burbuja key="bp" t={t} at={T.ponche - 0.6} out={T.regresas - 0.15} x={1420} y={260} text="ahorita regreso…" tail="l" />);
    L.push(<Escrito key="eo" t={t} at={T.regresas + 0.2} out={AVS[2][1] - 0.2} x={1400} y={300} text="¿y ese olor?" size={110} />);
  }
  L.push(<Sello key="tj" t={t} at={T.junto} text="TODO JUNTO" x={1440} y={420} out={31.6} rot={-8} col="#e23a2a" />);
  L.push(<HumoNegro key="hn" t={t} a={T.quemado - 0.3} full={AVS[2][1] + 0.05} out={36.9} />);
  // J · 36,0-37,5 · la olla humeando de verdad
  if (t >= AVS[2][1] && t < 37.6) L.push(<Clip key="cj" k="m1_humo" t={t} a={AVS[2][1]} z={[1.1, 1.04]} />);
  // K · 37,5-44,6 · LA OLLA EN CORTE: fondo pegado y negro, arriba aguado con granitos
  if (t >= 37.5 && t < 44.65) {
    L.push(W("wK"));
    const C = PT.corte, sc = 1.15;
    const cs = screenOf(t, [C[0], C[1] + 0.02 * sc, C[2] + 0.02]), ag = screenOf(t, [C[0], C[1] + 0.2 * sc, C[2] + 0.05]), gr = screenOf(t, [C[0], C[1] + 0.16 * sc, C[2] - 0.08]);
    L.push(<Tag key="kf" t={t} at={Math.max(37.7, T.pegado)} x={cs.x - 60} y={cs.y} dx={-200} dy={120} text="PEGADO Y NEGRO" col="#ff8a5a" out={T.aguado - 0.2} size={54} />);
    L.push(<Tag key="ka" t={t} at={T.aguado} x={ag.x + 60} y={ag.y} dx={300} dy={-140} text="AGUADO" col="#bfe3ff" out={44.3} size={60} />);
    L.push(<Tag key="kg" t={t} at={T.granitos} x={gr.x - 40} y={gr.y} dx={-320} dy={-160} text="GRANITOS SUELTOS" col={LT.crema} out={44.3} size={48} />);
  }
  L.push(<Vaho key="v3" t={t} mid={37.5} w={0.35} />);
  // L · 44,6-47,7 · el grano mordido: duro por dentro, como si no se hubiera cocido nunca
  if (t >= 44.6 && t < AVS[3][0] + 0.02) {
    L.push(<Whip key="wL" t={t} at={44.6} d={0.4} a={W("wK2", Math.min(t, 44.65))} b={<Clip k="m1_grano" t={t} a={44.6} z={[1.12, 1.04]} />} />);
    L.push(<GranoCorte key="gc" t={t} at={Math.max(44.95, T.duro)} out={AVS[3][0] - 0.2} x={1440} y={430} />);
  }
  // M · 47,7-52,8 · avatar: le subes al fuego → perilla al ALTO → ENGRUDO (polaroid)
  if (t >= AVS[3][0] && t < AVS[3][1]) {
    L.push(<Avatar key="avM" t={t} />);
    L.push(<Perilla key="pa" t={t} at={T.subes + 0.2} from={0.5} to={1} out={T.engrudo - 0.2} x={1500} y={560} />);
    const pk = Math.min(1.1, spr(t, T.engrudo - 0.15, 1));
    L.push(<Card3D key="eg" id="img_m1_engrudo" x={1040} y={200} w={560} h={315} ry={-16 + (1 - Math.min(1, pk)) * -60} rz={3} o={e(t, T.engrudo - 0.15, T.engrudo) * (1 - e(t, AVS[3][1] - 0.25, AVS[3][1]))} label="ENGRUDO" labelCol="#ff8a5a" />);
  }
  // N · 52,8-55,8 · la vecina prueba y sonríe por educación
  if (t >= AVS[3][1] && t < 56.0) {
    L.push(<Clip key="cn" k="m1_vecina" t={t} a={AVS[3][1]} z={[1.03, 1.1]} />);
    L.push(<Burbuja key="be" t={t} at={T.sonrie + 0.2} out={55.6} x={1450} y={250} text="…mmm, rico 🙂" tail="r" />);
  }
  L.push(<Vaho key="v4" t={t} mid={AVS[3][1]} w={0.3} />);
  // O · 55,8-57,3 · el vasito queda a la mitad
  if (t >= 55.75 && t < 57.6) {
    L.push(<Whip key="wO" t={t} at={55.75} d={0.4} a={<Clip k="m1_vecina" t={t} a={AVS[3][1]} z={[1.03, 1.1]} />} b={<Clip k="m1_vasito" t={t} a={55.75} z={[1.03, 1.1]} />} />);
    L.push(<MedioVaso key="mv" t={t} at={T.mitad - 0.2} out={57.25} x={1420} y={460} />);
  }
  // P · 57,3-60,2 · Lety tranquila en su fogón: "pues no fuiste tú"
  if (t >= 57.3 && t < 60.3) {
    L.push(<Clip key="cp" k="m1_lety_olla" t={t} a={57.3} z={[1.04, 1.1]} ox={-30} />);
    L.push(<Recado key="nf" t={t} at={T.nofuiste} out={60.0} x={1450} y={330} lines={["No fuiste tú."]} rot={3} w={500} />);
    L.push(<Sello key="nr" t={t} at={T.receta} text="NO ES LA RECETA" x={1450} y={640} out={60.0} rot={-4} size={64} col={LT.rosa} />);
  }
  L.push(<Vaho key="v5" t={t} mid={57.3} w={0.35} />);
  // Q · 60,2-63,5 · EL ORDEN (línea de tiempo) y A QUÉ FUEGO (perilla al BAJO, el fuego del fogón se apacigua)
  if (t >= 60.15 && t < AVS[4][0] + 0.02) L.push(W("wQ"));
  L.push(<Vaho key="v6" t={t} mid={60.15} w={0.3} />);
  L.push(<Ingredientes key="io" t={t} mode="orden" lineAt={T.orden - 0.1} out={AVS[4][0] + 0.6} items={[{ lab: "ARROZ + AGUA", col: "#c9a26a", at: T.orden, min: 0 }, { lab: "CANELA", col: LT.canela, at: T.orden + 0.25, min: 0 }, { lab: "LECHE", col: "#7aa6d6", at: T.orden + 0.55, min: 15 }, { lab: "AZÚCAR", col: LT.rosa, at: T.orden + 0.85, min: 45 }]} />);
  L.push(<Perilla key="pb" t={t} at={T.quefuego} from={1} to={0.05} dur={0.6} out={AVS[4][0] + 0.7} x={1600} y={520} />);
  // R · 63,5-68,1 · avatar: las pastelerías de ahora → RÁPIDO
  if (t >= AVS[4][0] && t < AVS[4][1]) {
    L.push(<Avatar key="avR" t={t} />);
    L.push(<Toldo key="td" t={t} at={T.pastel2} fast={T.rapido} out={AVS[4][1] - 0.2} />);
  }
  // S · 68,1-71,8 · la lata de condensada y la fécula
  if (t >= AVS[4][1] && t < 72.1) {
    L.push(<Clip key="cs" k="m1_lata" t={t} a={AVS[4][1]} z={[1.04, 1.1]} />);
    L.push(<Lata key="la" t={t} at={T.condensada - 0.1} xAt={T.lata + 0.1} out={71.7} x={1480} y={560} />);
    L.push(<Costal key="co" t={t} at={T.fecula} out={71.7} x={440} y={560} />);
  }
  L.push(<Flash key="fs" t={t} at={AVS[4][1]} col="#fff1f4" peak={0.45} w={0.3} />);
  // T · 71,8-75,8 · la vitrina: $40 el vasito… ¿sabe dulce? sí
  if (t >= 71.8 && t < 76.1) {
    L.push(<Whip key="wT" t={t} at={71.8} d={0.4} a={<Clip k="m1_lata" t={t} a={AVS[4][1]} z={[1.04, 1.1]} />} b={<Clip k="m1_pasteleria" t={t} a={71.8} z={[1.03, 1.1]} />} />);
    L.push(<Ticket key="tk" t={t} at={T.cuarenta} out={75.6} x={1430} y={330} top="$40" sub="EL VASITO" />);
    L.push(<Escrito key="ed" t={t} at={T.dulce} out={75.6} x={560} y={830} text="¿dulce? sí…" size={100} dur={0.7} />);
  }
  // U · 75,8-77,6 · Lety huele la raja de canela: "…pero no sabe a casa"
  if (t >= 75.8 && t < 77.75) {
    L.push(<Whip key="wU" t={t} at={75.8} d={0.4} dir={-1} a={<Clip k="m1_pasteleria" t={t} a={71.8} z={[1.03, 1.1]} />} b={<Clip k="m1_lety_canela" t={t} a={75.8} z={[1.05, 1.12]} />} />);
    L.push(<Escrito key="ec" t={t} at={T.casa - 0.3} out={77.5} x={1380} y={300} text="no sabe a casa" size={118} col={LT.crema} dur={0.8} />);
  }
  L.push(<Vaho key="v7" t={t} mid={77.65} w={0.35} />);
  // V · 77,6-81,9 · la repisa: 7 vasitos = 7 SECRETOS de mi mamá
  if (t >= 77.6 && t < AVS[5][0] + 0.02) {
    L.push(W("wV"));
    L.push(<VasoNums key="vn" t={t} a={T.s7} out={81.7} />);
    L.push(<BigNum key="7s" t={t} at={T.s7 + 0.55} text="7 SECRETOS" size={170} y={860} col={LT.crema} edge="#7a3412" out={81.7} sub={t > T.mami - 0.1 ? "DEL ARROZ CON LECHE DE MI MAMÁ" : undefined} />);
  }
  // W · 81,9 → avatar (sigue el minuto 2)
  if (t >= AVS[5][0]) L.push(<Avatar key="avW" t={t} />);
  L.push(<Flash key="fw" t={t} at={AVS[5][0]} col="#fff1cf" peak={0.4} w={0.3} />);

  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
