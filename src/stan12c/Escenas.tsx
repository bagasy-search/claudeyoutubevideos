// Escenas sobre fotos de stan12c (D:/rtmp/stan12c/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
// v2 (12-nov, tras el evaluador): cada escena muestra su idea con algo que se mueve sobre la palabra.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const PAPER = "linear-gradient(98deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 22%, rgba(120,60,40,0.07) 61%, rgba(255,255,255,0.1) 100%), linear-gradient(180deg, #EDC2AE 0%, #E2AE97 100%)";

// cámara que lleva el punto (cx,cy) de la foto al centro con escala s, sin dejar bordes vacíos
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};

const damp = (t: number, tau: number, per: number) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos((t / per) * Math.PI * 2));
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });
const pop = (f: number, f0: number) => (f < f0 ? 0 : Math.min(1.0, damp(f - f0, 5, 22)));

// etiqueta de papel de carnicero escrita a mano, en coordenadas de la foto
const Rotulo: React.FC<{ x: number; y: number; t: string; f0: number; size?: number; rot?: number }> = ({ x, y, t, f0, size = 70, rot = -2 }) => {
  const f = useCurrentFrame(); const p = pop(f, f0);
  return <div style={{ position: "absolute", left: x, top: y, padding: "6px 26px 10px", backgroundImage: PAPER, fontFamily: FONTS.HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: "#2A1A12", whiteSpace: "nowrap",
    boxShadow: "0 10px 20px rgba(0,0,0,0.4)", opacity: Math.min(1, p * 2), transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: "0 50%" }}>{t}</div>;
};

// ── Escena 1 · la balanza: una aguja roja sobre el cuadrante real (centro 975,320) da casi la vuelta con la res entera,
//    cae a casi nada cuando se nombran los tres bifes del plato, y la foto bascula hacia la media res con eje en el gancho (975,60)
export const EscBalanza: React.FC<{ src: string; fRib: number; fSlice: number; fFight: number; dur: number }> = ({ src, fRib, fSlice, fFight, dur }) => {
  const f = useCurrentFrame();
  const HX = 975, HY = 60;
  const b = seg(f, 0, 40);
  const down = seg(f, fRib - 10, fRib + 30);
  const cx = lerp(960, 975, b), cy = lerp(lerp(540, 470, b), 600, down), k = lerp(1.0, 1.14, b) + 0.05 * (f / dur);
  const th = -3 * damp(f - fSlice, 16, 34);
  // aguja: 0 = arriba. 285 grados = la res entera; 16 grados = los tres bifes
  const heavy = 285 * damp(f - 12, 9, 40) * (f >= 12 ? 1 : 0);
  const small = seg(f, fRib + 4, fRib + 26);
  const wob = f > fRib + 26 ? 5 * Math.exp(-(f - fRib - 26) / 18) * Math.sin((f - fRib) / 2.6) : 0;
  const fight = f > fFight ? 2.2 * Math.sin(f / 1.7) * Math.exp(-(f - fFight) / 40) : 0;
  const ang = lerp(Math.min(300, heavy), 16, small) + wob + fight + 1.1 * Math.sin(f / 6.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1b1a18" }}>
      <AbsoluteFill style={cam(cx, cy, k)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${HX}px ${HY}px`, transform: `rotate(${th}deg)` }}>
          <Img src={staticFile(src)} style={FULL} />
          <div style={{ position: "absolute", left: 975 - 6, top: 320 - 190, width: 12, height: 250, transformOrigin: "6px 190px", transform: `rotate(${ang}deg)`, borderRadius: "6px 6px 3px 3px",
            background: "linear-gradient(90deg, #7A1410, #D9372C 45%, #8E1D17)", boxShadow: "4px 6px 8px rgba(0,0,0,0.45)" }} />
          <div style={{ position: "absolute", left: 975 - 20, top: 320 - 20, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F4F6F7, #6F757A 70%)", boxShadow: "2px 3px 5px rgba(0,0,0,0.5)" }} />
          <div style={{ opacity: 1 - seg(f, fRib - 4, fRib + 8) }}><Rotulo x={250} y={560} t="about 1,200 lb" f0={16} size={96} rot={-3} /></div>
          <Rotulo x={1250} y={800} t="a small slice" f0={fSlice - 6} size={92} rot={2} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 4 · las dos mitades del tri-tip giran como patas de compás en la costura real (1010,300) hasta acostar sus fibras.
//    Tres trazos claros siguen la fibra de cada mitad cuando se la nombra y giran con ella: al final quedan paralelos.
const Fibra: React.FC<{ x: number; y: number; len: number; a: number; f0: number }> = ({ x, y, len, a, f0 }) => {
  const f = useCurrentFrame();
  const g = seg(f, f0, f0 + 16);
  return <div style={{ position: "absolute", left: x, top: y - 4, width: len, height: 8, borderRadius: 4, background: "rgba(255,247,232,0.92)", boxShadow: "0 2px 4px rgba(0,0,0,0.45)", transformOrigin: "0 50%", transform: `rotate(${a}deg) scaleX(${g})`, opacity: g }} />;
};
export const EscCompas: React.FC<{ src: string; fOne: number; fOther: number; fCut: number; fSlice: number; dur: number }> = ({ src, fOne, fOther, fCut, fSlice, dur }) => {
  const f = useCurrentFrame();
  const PX = 1010, PY = 300, ANG = 40;
  const open = damp(f - fCut, 12, 60) * (f >= fCut ? 1 : 0);
  const o = Math.min(1.06, open);
  const cx = lerp(lerp(lerp(960, 640, seg(f, fOne - 6, fOne + 30)), 1330, seg(f, fOther - 6, fOther + 30)), 1010, seg(f, fCut - 14, fCut + 10));
  const cy = lerp(lerp(520, 420, seg(f, fOne - 6, fOne + 30)), 560, seg(f, fCut - 14, fCut + 16));
  const s = lerp(lerp(1.12, 1.32, seg(f, fOne - 6, fOne + 30)), 0.9, seg(f, fCut - 8, fCut + 18)) + 0.06 * seg(f, fSlice, dur);
  // mientras la escala es 1 o más, la cámara nunca deja ver el borde de la foto
  let tx = 960 - cx * s, ty = 540 - cy * s;
  if (s >= 1) { tx = Math.min(0, Math.max(1920 - 1920 * s, tx)); ty = Math.min(0, Math.max(1080 - 1080 * s, ty)); }
  const stage: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` };
  const half = (left: boolean): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${PX}px ${PY}px`, transform: `rotate(${(left ? -1 : 1) * ANG * o}deg)` });
  const clip = (left: boolean): React.CSSProperties => ({ ...FULL, clipPath: left
    ? "polygon(52px 142px, 300px 92px, 700px 66px, 1010px 56px, 1010px 566px, 900px 508px, 700px 428px, 480px 348px, 300px 278px, 150px 226px, 56px 166px)"
    : "polygon(1010px 56px, 1150px 40px, 1400px 64px, 1650px 104px, 1746px 146px, 1796px 400px, 1816px 700px, 1806px 866px, 1740px 892px, 1560px 838px, 1300px 748px, 1100px 628px, 1010px 566px)" });
  const base = 1 - seg(f, fCut - 18, fCut - 9);
  const cutLine = seg(f, fCut - 12, fCut);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#d79a8c" }}>
      {/* fondo: el mismo papel rosa de la foto, ampliado */}
      <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "330px 700px", transform: "scale(4.2)" }} />
      <div style={stage}>
        {base > 0 && <Img src={staticFile(src)} style={{ ...FULL, opacity: base }} />}
        <div style={half(true)}>
          <Img src={staticFile(src)} style={clip(true)} />
          <Fibra x={300} y={205} len={430} a={22} f0={fOne} />
          <Fibra x={430} y={300} len={430} a={24} f0={fOne + 5} />
          <Fibra x={600} y={385} len={330} a={26} f0={fOne + 10} />
        </div>
        <div style={half(false)}>
          <Img src={staticFile(src)} style={clip(false)} />
          <Fibra x={1090} y={540} len={400} a={-58} f0={fOther} />
          <Fibra x={1250} y={640} len={430} a={-58} f0={fOther + 5} />
          <Fibra x={1420} y={740} len={430} a={-58} f0={fOther + 10} />
        </div>
        {/* el corte: una línea de luz baja por la costura justo antes de abrirse */}
        {f < fCut + 10 && <div style={{ position: "absolute", left: PX - 3, top: 60, width: 6, height: 800 * cutLine, background: "rgba(255,255,255,0.95)", boxShadow: "0 0 0 2px rgba(0,0,0,0.25)", opacity: 1 - seg(f, fCut, fCut + 10) }} />}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 7 · comparador de parpadeo: en cada "Same" la foto cambia de golpe por el otro bife puesto en el mismo lugar.
//    Al final la cámara se aleja y recién ahí se escriben las dos etiquetas reales de papel (515,185 y 1180,210).
export const EscParpadeo: React.FC<{ src: string; fSame: number[]; fTags: number; dur: number }> = ({ src, fSame, fTags, dur }) => {
  const f = useCurrentFrame();
  const DX = -695, DY = -20;
  let n = 0; for (const x of fSame) if (f >= x) n++;
  const b = n % 2 === 1 && f < fTags - 6;           // capa B = el ribeye corrido sobre el chuck eye
  const out = seg(f, fTags - 6, fTags + 34);
  const last = Math.max(0, ...fSame.filter((x) => f >= x));
  const punch = n > 0 && f < fTags - 6 ? 0.035 * Math.exp(-(f - last) / 5) : 0;
  const cx = lerp(640, 985, out), cy = lerp(610, 560, out), s0 = lerp(2.05 + 0.12 * Math.min(1, f / Math.max(1, fTags)) + punch, 1.1, out) + 0.05 * seg(f, fTags + 34, dur);
  const w = (f0: number) => `inset(-20% ${100 - seg(f, f0, f0 + 14) * 100}% -20% 0)`;
  const tag: React.CSSProperties = { position: "absolute", fontFamily: FONTS.HAND, fontWeight: 700, color: "#2A1A12", whiteSpace: "nowrap", lineHeight: 1 };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s0)}>
        <Img src={staticFile(src)} style={{ ...FULL, transform: b ? `translate(${DX}px, ${DY}px)` : undefined }} />
        <div style={{ ...tag, left: 438, top: 164, fontSize: 40, clipPath: w(fTags + 40), transform: "rotate(-1deg)" }}>chuck eye</div>
        <div style={{ ...tag, left: 1112, top: 186, fontSize: 46, clipPath: w(fTags + 62), transform: "rotate(1.5deg)" }}>ribeye</div>
        <Rotulo x={470} y={868} t="chuck eye" f0={fTags + 44} size={104} rot={-2} />
        <Rotulo x={1190} y={892} t="ribeye" f0={fTags + 66} size={104} rot={2} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 8 · falla de terreno: el costillar se parte por la línea real entre la 5ª y la 6ª costilla (520,455 → 560,800).
//    El lado del lomo (costillas 6 a 12) crece un escalón hacia arriba con la base apoyada en la mesa; cada lado recibe su nombre.
export const EscFalla: React.FC<{ src: string; fStop: number; fCut: number; dur: number }> = ({ src, fStop, fCut, dur }) => {
  const f = useCurrentFrame();
  const t = seg(f, fStop - 10, Math.max(fStop + 40, fCut - 12));
  const cx = lerp(lerp(1540, 1500, f / Math.max(1, fStop)), 790, t), cy = lerp(640, 590, t), s = lerp(1.5, 1.4, t) + 0.05 * seg(f, fCut, dur);
  const up = f >= fCut ? damp(f - fCut, 9, 40) : 0;
  const blade = seg(f, fCut - 10, fCut);
  const POLY = "polygon(516px 440px, 700px 418px, 900px 392px, 1100px 372px, 1300px 352px, 1480px 322px, 1610px 302px, 1660px 314px, 1750px 372px, 1812px 470px, 1862px 620px, 1872px 760px, 1832px 890px, 1745px 946px, 1640px 936px, 1560px 916px, 1410px 916px, 1255px 880px, 1110px 856px, 975px 836px, 840px 820px, 705px 810px, 590px 800px, 560px 810px)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {/* lado del lomo: se estira hacia arriba desde la mesa (y = 946), la pared no se mueve */}
        <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "50% 946px", transform: `scaleY(${1 + 0.13 * up})`, clipPath: POLY }} />
        {/* sombra del escalón sobre la línea del corte */}
        <div style={{ position: "absolute", left: 500, top: 462 - 56 * up, width: 26, height: 338 + 56 * up, transformOrigin: "50% 0", transform: "rotate(-6.6deg)", background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)", opacity: Math.min(1, up) }} />
        {/* la hoja: una línea de luz baja por el hueco entre la 5ª y la 6ª costilla */}
        {f < fCut + 12 && <div style={{ position: "absolute", left: 517, top: 330, width: 6, height: 500 * blade, transformOrigin: "50% 0", transform: "rotate(-6.2deg)", background: "rgba(255,255,255,0.96)", boxShadow: "0 0 0 2px rgba(0,0,0,0.3)", opacity: 1 - seg(f, fCut + 2, fCut + 12) }} />}
        <div style={{ position: "absolute", left: 516, top: 440 - 60 * up, width: 9, height: (372 + 60 * up) * blade, transformOrigin: "50% 0", transform: "rotate(-6.4deg)", background: "#D9372C", borderRadius: 4, boxShadow: "0 0 0 2px rgba(255,255,255,0.55)", opacity: seg(f, fCut + 2, fCut + 12) }} />
        <Rotulo x={150} y={610} t="chuck" f0={fCut + 12} size={112} rot={-3} />
        <Rotulo x={720} y={520} t="ribeye" f0={fCut + 24} size={112} rot={2} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
