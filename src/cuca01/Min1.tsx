// cuca01 · MINUTO 1 (0-112 s). UN SOLO HILO, sin cortes secos: todo entra por portal, iris, zoom o latigazo.
// avatar "¿se lava con jabón?" → portal desde SU comal al comal 3D (jabón tachado, 0 gotas) → avatar "acérquese al fogón"
// → la cámara se mete en la lumbre: la boca del fogón es un portal a SU cocina (tortilla pegada / 3 pedazos / suela / paquete)
// → latigazo al avatar "NO FUE USTED · FUE EL COMAL" → zoom a la cocina entera: el recetario sin la hoja del comal
// → del humo sale la abuela con la niña → avatar "25 TRUCOS" → órbita del comal: se encala, se calienta, se tatema, ceniza, se cuelga
// → avatar (la familia discute) + rótulo CUCA → la cámara sale volando al patio: limonero, la barda, la casa de Chayo → portal a la barda
// → avatar → leña / barro / paciencia → el comal de la mamá colgado del clavo → avatar "rapidito" (entra la guía).
// Todo clavado a la VOZ con at("frase"). Audio fuera de Remotion (mezcla aparte + encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, CU, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, at, atE, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = at("rapidito antes de seguir") + 2.0;
export const MIN1_FRAMES = s(MIN1_END);
const REEL = (AVAIL as { reel: boolean }).reel;                  // public/cuca01/reel0.mp4 (1 /run de RunPod)
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);       // tomas LTX que ya llegaron (si no, va la foto)
const CDUR = ((AVAIL as { dur?: Record<string, number> }).dur ?? {}) as Record<string, number>; // segundos de cada toma: después se funde a su foto (nunca negro)
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.filter((w) => w.ms < MIN1_END + 5);

// ---------- avatar: nítido, sin halo ni borde borroso; preroll de 10 cuadros por ventana ----------
const Avatar: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {REEL ? WIN.map((w, i) => (
      <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.3 ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>))
      : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />}
  </AbsoluteFill>
);
// puntos del cuadro del avatar (foto 1088x608 → 1920x1080)
export const AVP = { comal: { x: 1677, y: 748 }, fuego: { x: 1630, y: 880 }, patio: { x: 300, y: 260 }, cara: { x: 905, y: 215 } };

// mundo 3D con desenfoque de movimiento (sale de la velocidad real de la cámara)
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// toma (LTX si ya está, si no la foto) con su empuje lento propio
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px,${oy * q}px)` }}><Vid id={"img_" + k} />{CLIPS.has(k) && <AbsoluteFill style={{ opacity: 1 - e(t, a + (CDUR[k] ?? 5) - 0.45, a + (CDUR[k] ?? 5) - 0.1) }}><Sequence from={s(a)} durationInFrames={s((CDUR[k] ?? 5) - 0.1)} layout="none"><Vid id={k} /></Sequence></AbsoluteFill>}</AbsoluteFill>;
};
// latigazo horizontal entre dos capas (motion blur del barrido)
export const Whip: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: 1 | -1 }> = ({ t, a, b, from, to, dir = 1 }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 42;
  const f = mb > 1 ? `blur(${mb}px)` : undefined;
  return <>
    {k < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: f }}>{from}</AbsoluteFill>}
    {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: f }}>{to}</AbsoluteFill>}
  </>;
};
// zoom a través de un punto: la capa de arriba crece hacia (x,y) y se funde en la de abajo
export const ZoomThru: React.FC<{ t: number; a: number; b: number; x: number; y: number; top: React.ReactNode; under: React.ReactNode; k?: number }> = ({ t, a, b, x, y, top, under, k: mag = 7 }) => {
  const z = ei(t, a, b);
  return <>
    {z > 0.35 && <AbsoluteFill style={{ opacity: (z - 0.35) / 0.65, transform: `scale(${1.25 - 0.25 * z})`, transformOrigin: `${x}px ${y}px` }}>{under}</AbsoluteFill>}
    <AbsoluteFill style={{ transformOrigin: `${x}px ${y}px`, transform: `scale(${1 + z * z * mag})`, opacity: z > 0.35 ? 1 - (z - 0.35) / 0.65 : 1, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}>{top}</AbsoluteFill>
  </>;
};

// ---------- piezas NUEVAS del minuto 1 ----------
// sello de barro: cae girando y se asienta, letras de cal
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string; bg?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -8, size = 104, col = CU.cal, bg = "rgba(196,103,58,.92)" }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.3 - 1.3 * Math.min(1, k)})` }}>
    <div style={{ border: `8px solid ${col}`, borderRadius: 18, padding: "8px 34px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 3, background: bg, boxShadow: "0 30px 60px rgba(0,0,0,.55)", textShadow: extrude(5, "rgba(60,20,5,.85)"), whiteSpace: "nowrap" }}>{text}</div>
  </div>;
};
// la barra de jabón: cae girando sobre el comal y la tacha una X roja
const Jabon: React.FC<{ t: number; at: number; x: number; y: number; out: number }> = ({ t, at: a, x, y, out }) => {
  const k = spr(t, a, 1.1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const fall = (1 - Math.min(1, k)) * -420;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900 }}>
    <div style={{ transform: `translate(-50%,-50%) scale(1.7) translateY(${fall}px) rotateX(${52 - 12 * Math.min(1, k)}deg) rotateZ(${-18 + (1 - Math.min(1, k)) * 90}deg)`, width: 300, height: 170, borderRadius: 40, background: "linear-gradient(150deg,#ffd9f0,#f3a6cf 55%,#d77fb0)", boxShadow: "inset 0 -14px 0 rgba(140,40,90,.35), 0 50px 60px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "rgba(140,40,90,.55)", letterSpacing: 4 }}>JABÓN</div>
    {Array.from({ length: 7 }, (_, i) => { const b = e(t, a + 0.2 + i * 0.07, a + 1.4 + i * 0.07); return <div key={i} style={{ position: "absolute", left: -120 + i * 45, top: -60 - b * 260 - (i % 3) * 30, width: 26 + (i % 3) * 14, height: 26 + (i % 3) * 14, borderRadius: "50%", border: "3px solid rgba(255,255,255,.8)", background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(180,220,255,.15) 60%)", opacity: b > 0 && b < 1 ? 1 - b : 0 }} />; })}
    <div style={{ position: "absolute", left: -300, top: -220 }}><DrawX t={t} at={a + 1.0} x={20} y={20} w={560} h={400} /></div>
  </div>;
};
// la tortilla que se rompe: entera → se raja → 3 pedazos que se separan; contador 1·2·3
const Rota: React.FC<{ t: number; at: number; x: number; y: number; out: number; draw?: boolean }> = ({ t, at: a, x, y, out, draw = false }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sp = ei(t, a + 0.35, a + 1.3) * 70, R = 190;
  const piece = (a0: number, a1: number, i: number) => {
    const mid = (a0 + a1) / 2, dx = Math.cos(mid) * sp, dy = Math.sin(mid) * sp;
    const jag = Array.from({ length: 7 }, (_, j) => { const r = R * (0.15 + 0.12 * Math.sin(j * 3 + i)) * (j / 6); return `${r * Math.cos(a1)},${r * Math.sin(a1)}`; }).reverse().join(" ");
    const arc = Array.from({ length: 13 }, (_, j) => { const an = a0 + (a1 - a0) * (j / 12); return `${R * Math.cos(an)},${R * Math.sin(an)}`; }).join(" ");
    return <polygon key={i} points={`0,0 ${arc} ${jag}`} transform={`translate(${dx},${dy}) rotate(${sp * 0.12 * (i - 1)})`} fill="#ecd9a4" stroke="#b58b4c" strokeWidth={3} />;
  };
  const n = t < a + 0.35 ? 0 : t < a + 0.6 ? 1 : t < a + 0.85 ? 2 : 3;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    {draw && <svg width={560} height={560} viewBox="-280 -280 560 560" style={{ filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }}>
      {piece(-1.9, 0.3, 0)}{piece(0.3, 2.3, 1)}{piece(2.3, 4.38, 2)}
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={Math.cos(i * 2.4) * (40 + i * 9)} cy={Math.sin(i * 2.4) * (40 + i * 9)} r={5 + (i % 3) * 3} fill="#9b6b34" opacity={0.55} />)}
    </svg>}
    <div style={{ position: "absolute", left: 470, top: 170, fontFamily: FONT, fontWeight: 900, fontSize: 170, color: COL.red, textShadow: extrude(7, "#5a0f08"), transform: `scale(${n ? Math.min(1.12, spr(t, a + 0.1 + n * 0.25)) : 0})` }}>{n || ""}</div>
    <div style={{ position: "absolute", left: 470, top: 370, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: CU.cal, letterSpacing: 4, opacity: e(t, a + 0.9, a + 1.1), textShadow: extrude(4, "#000") }}>PEDAZOS</div>
  </div>;
};
// corte de la tortilla: capa negra arriba / capa cruda adentro, con flechas
const Corte: React.FC<{ t: number; at: number; at2: number; x: number; y: number; out: number }> = ({ t, at: a, at2, x, y, out }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3)), k = spr(t, a, 1);
  if (o <= 0.01) return null;
  const sl = e(t, a + 0.15, a + 0.7);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: "translate(-50%,-50%)" }}>
    <div style={{ transform: `rotateX(${28 - 10 * Math.min(1, k)}deg) rotateY(-16deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, width: 560, position: "relative" }}>
      <div style={{ height: 58, borderRadius: "40px 40px 6px 6px", background: "repeating-linear-gradient(90deg,#1e130b 0 30px,#3b2414 30px 44px)", boxShadow: "0 0 30px rgba(255,90,20,.35)" }} />
      <div style={{ height: 76, width: `${sl * 100}%`, background: "linear-gradient(180deg,#f2e3b8,#efe6cc)", boxShadow: "inset 0 0 22px rgba(170,140,90,.6)" }} />
      <div style={{ height: 46, borderRadius: "6px 6px 40px 40px", background: "repeating-linear-gradient(90deg,#2a190d 0 26px,#48301c 26px 40px)" }} />
      <div style={{ position: "absolute", left: 590, top: -14, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#ff7a3a", textShadow: extrude(5, "#3a1000"), whiteSpace: "nowrap", opacity: e(t, a + 0.2, a + 0.4) }}>← QUEMADA POR FUERA</div>
      <div style={{ position: "absolute", left: 590, top: 70, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: CU.masa, textShadow: extrude(5, "#3a2a00"), whiteSpace: "nowrap", opacity: e(t, at2, at2 + 0.2) }}>← CRUDA POR DENTRO</div>
    </div>
  </div>;
};
// pensamiento escrito a mano (se escribe letra por letra, globo de nube)
export const Pensamiento: React.FC<{ t: number; at: number; text: string; x: number; y: number; out: number }> = ({ t, at: a, text, x, y, out }) => {
  const o = e(t, a - 0.15, a) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a, a + 1.0));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, a - 0.15))}) rotate(-3deg)` }}>
    <div style={{ padding: "34px 54px", borderRadius: 120, background: "rgba(250,246,236,.96)", boxShadow: "0 30px 60px rgba(0,0,0,.45)", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 64, color: "#3a2a20", whiteSpace: "nowrap" }}>“{text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>”</div>
    {[[-120, 110, 44], [-190, 165, 26]].map(([dx, dy, r], i) => <div key={i} style={{ position: "absolute", left: `calc(50% + ${dx}px)`, top: `calc(50% + ${dy}px)`, width: r, height: r, borderRadius: "50%", background: "rgba(250,246,236,.96)" }} />)}
  </div>;
};
// el recetario de la familia: se abre, las recetas pasan… y la hoja del COMAL está en blanco
const Recetario: React.FC<{ t: number; at: number; x: number; y: number; out: number }> = ({ t, at: a, x, y, out }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const open = ei(t, a + 0.2, a + 0.9), flip = ei(t, a + 0.9, a + 1.8);
  const lines = (n: number, w: number[]) => Array.from({ length: n }, (_, i) => <div key={i} style={{ height: 10, width: w[i % w.length], background: "rgba(80,50,30,.45)", borderRadius: 5, margin: "14px 0" }} />);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1600 }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -600}px) rotateX(${38 - 6 * Math.sin(t * 0.6)}deg) rotateZ(-6deg)`, transformStyle: "preserve-3d", width: 900, height: 600, position: "relative", fontFamily: FONT }}>
      {/* hoja izquierda: recetas */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 450, height: 600, background: "linear-gradient(90deg,#efe2c4,#e6d6b2)", borderRadius: "14px 0 0 14px", padding: 40, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,.55)" }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: "#7a3b1c" }}>MOLE DE OLLA</div>{lines(5, [340, 300, 360, 250])}
        <div style={{ fontWeight: 900, fontSize: 34, color: "#7a3b1c", marginTop: 24 }}>ARROZ ROJO</div>{lines(4, [320, 360, 280])}
      </div>
      {/* hoja derecha: EL COMAL ………… (vacía) */}
      <div style={{ position: "absolute", left: 450, top: 0, width: 450, height: 600, transformOrigin: "0 50%", transform: `rotateY(${-(1 - open) * 170}deg)`, background: "linear-gradient(270deg,#efe2c4,#e6d6b2)", borderRadius: "0 14px 14px 0", padding: 40, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: "#7a3b1c", opacity: flip }}>EL COMAL</div>
        <div style={{ marginTop: 30, height: 380, border: "4px dashed rgba(122,59,28,.35)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: "rgba(122,59,28,.45)", opacity: flip }}>( vacío )</div>
      </div>
      <div style={{ position: "absolute", left: 442, top: 0, width: 16, height: 600, background: "linear-gradient(90deg,rgba(0,0,0,.25),rgba(0,0,0,0),rgba(0,0,0,.25))" }} />
    </div>
  </div>;
};
// letrero del rancho: tabla de madera colgada que se mece; anclada a un punto que sigue a la cámara
export const Tabla: React.FC<{ t: number; at: number; x: number; y: number; text: string; out?: number; col?: string; size?: number }> = ({ t, at: a, x, y, text, out = 1e9, col = CU.cal, size = 54 }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sw = 6 * Math.exp(-(t - a) * 1.6) * Math.sin((t - a) * 9) + 1.2 * Math.sin(t * 1.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg style={{ position: "absolute", left: -2, top: 0, overflow: "visible" }} width={4} height={4}><line x1={0} y1={0} x2={0} y2={-130 * Math.min(1, k)} stroke="#f6f1e4" strokeWidth={3} /><circle r={9} fill={CU.chile} stroke="#fff" strokeWidth={3} /></svg>
    <div style={{ position: "absolute", left: 0, top: -130 * Math.min(1, k), transformOrigin: "50% 0", transform: `translate(-50%,-100%) rotate(${sw}deg) scale(${Math.min(1.06, k)})`, padding: "14px 30px", borderRadius: 10, background: "repeating-linear-gradient(0deg,#6b4a30 0 18px,#5c3f28 18px 22px)", border: "4px solid #3b2a1d", boxShadow: "0 24px 40px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, whiteSpace: "nowrap", textShadow: extrude(4, "#2a1a10") }}>{text}</div>
  </div>;
};
// fichas que van cayendo en fila (cada una con su ícono dibujado) mientras ella enumera
export const Fichas: React.FC<{ t: number; items: { at: number; tx: string; ic: string }[]; out: number; y?: number }> = ({ t, items, out, y = 900 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 22 }}>
    {items.map((it, i) => {
      const k = spr(t, it.at, 1.2), o = e(t, it.at, it.at + 0.08) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      const live = t >= it.at && (i === items.length - 1 || t < items[i + 1].at);
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${(1 - Math.min(1, k)) * 25 * (i % 2 ? 1 : -1)}deg) scale(${live ? 1.08 : 0.94})`, display: "flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 20, background: live ? "rgba(196,103,58,.95)" : "rgba(30,20,14,.88)", border: `3px solid ${live ? CU.cal : "rgba(246,241,228,.35)"}`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: CU.cal, letterSpacing: 1 }}>
        <span style={{ fontSize: 44 }}>{it.ic}</span>{it.tx}
      </div>;
    })}
  </div>
);
// moneda de un peso que gira y se tacha: "$0 DE MÁS"
export const Peso: React.FC<{ t: number; at: number; x: number; y: number; out: number }> = ({ t, at: a, x, y, out }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900, transform: "translate(-50%,-50%)" }}>
    <div style={{ width: 230, height: 230, borderRadius: "50%", transform: `rotateY(${(1 - Math.min(1, k)) * 540 + 14 * Math.sin(t * 2)}deg) scale(${Math.min(1.05, k)})`, background: "radial-gradient(circle at 35% 30%,#fff3c4,#e2b64a 45%,#9a6f1c)", border: "10px solid #b88a2a", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 0 0 8px rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#6b4a10" }}>$1</div>
    <div style={{ position: "absolute", left: -30, top: -30 }}><DrawX t={t} at={a + 0.45} x={20} y={20} w={250} h={250} /></div>
    <div style={{ position: "absolute", left: 270, top: 50, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: CU.verde, whiteSpace: "nowrap", textShadow: extrude(6, "#1e3a0c"), opacity: e(t, a + 0.6, a + 0.8), transform: `scale(${Math.min(1.08, spr(t, a + 0.6))})`, transformOrigin: "0 50%" }}>$0 DE MÁS</div>
  </div>;
};
// globos de la familia discutiendo (aparecen alternados a los costados del avatar)
export const Pleito: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const B = [{ tx: "¡Así no se hace!", x: 330, y: 330, d: 0 }, { tx: "¡Mi abuela lo hacía distinto!", x: 1430, y: 250, d: 0.45 }, { tx: "¿Con ceniza? ¡Ni loca!", x: 360, y: 640, d: 0.9 }];
  return <>{B.map((b, i) => {
    const k = spr(t, a + b.d, 1.2), o = e(t, a + b.d, a + b.d + 0.08) * (1 - e(t, out, out + 0.25));
    if (o <= 0.01) return null;
    const sh = 4 * Math.sin(t * 22 + i) * Math.exp(-(t - a - b.d) * 2);
    return <div key={i} style={{ position: "absolute", left: b.x, top: b.y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.06, k)}) rotate(${(i % 2 ? 4 : -4) + sh}deg)` }}>
      <div style={{ padding: "20px 34px", borderRadius: 28, background: "#fffaf0", border: "5px solid #2a1a10", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#2a1a10", whiteSpace: "nowrap", boxShadow: "8px 10px 0 #2a1a10" }}>{b.tx}</div>
    </div>;
  })}</>;
};
// sello circular de años (se dibuja el aro y el número sube contando)
export const Anos: React.FC<{ t: number; at: number; n: number; x: number; y: number; out: number; label: string }> = ({ t, at: a, n, x, y, out, label }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3)), d = e(t, a, a + 0.9);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, a, 1))})` }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340"><circle r={150} fill="rgba(30,18,10,.82)" /><circle r={150} fill="none" stroke={CU.maiz} strokeWidth={12} strokeDasharray={`${942 * d} 942`} transform="rotate(-90)" strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: CU.cal }}>
      <div style={{ fontSize: 120, lineHeight: 1, textShadow: extrude(5, "#3a2400") }}>{Math.round(n * d)}</div><div style={{ fontSize: 34, letterSpacing: 6, color: CU.maiz }}>{label}</div>
    </div>
  </div>;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const A = (q: string, from = 0) => at(q, from);

  // ===== A · avatar "¿se lava con jabón? ¡Ay, no!" → "Mire nomás este comal": portal desde SU comal al comal 3D =====
  const tMire = A("mire nomas este comal");
  if (t < tMire + 0.1) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<Sello key="no" t={t} at={A("ay no no no")} text="¡NO, NO, NO!" x={560} y={240} out={tMire - 0.15} rot={-7} size={86} />);
    const r = ei(t, tMire - 0.55, tMire + 0.05);
    if (r > 0) L.push(<Portal key="pA" x={AVP.comal.x} y={AVP.comal.y} r={r}><World t={Math.max(tMire - 0.2, t)} /></Portal>);
  }
  // ===== B · el comal 3D: más viejo que el nieto; jabón tachado; 0 gotas =====
  const avB = WIN[1];
  if (t >= tMire + 0.05 && t < avB.ms + 0.5) {
    L.push(<World key="wB" t={t} />);
    const c = screenOf(t, PT.comal);
    L.push(<Tabla key="nie" t={t} at={A("tiene mas anos que mi nieto")} x={c.x - 60} y={c.y - 120} text="MÁS VIEJO QUE MI NIETO" out={A("una gota de jabon") - 0.4} />);
    L.push(<Jabon key="jab" t={t} at={A("nunca pero nunca")} x={c.x + 40} y={c.y - 170} out={avB.ms - 0.3} />);
    L.push(<Sello key="0g" t={t} at={A("una gota de jabon")} text="0 GOTAS DE JABÓN" x={960} y={190} out={avB.ms - 0.2} rot={-5} size={84} />);
    // iris al avatar
    const r = ei(t, avB.ms - 0.25, avB.ms + 0.35);
    if (r > 0) L.push(<Portal key="pB" x={c.x} y={c.y} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== C · avatar "Venga, acérquese al fogón" → la cámara entra a la lumbre =====
  const tUsted = A("usted puso la tortilla");
  if (t >= avB.ms + 0.3 && t < avB.me + 0.3) {
    L.push(<ZoomThru key="zC" t={t} a={avB.me - 0.75} b={avB.me} x={AVP.fuego.x} y={AVP.fuego.y} k={6} top={<Avatar t={t} />} under={<World t={Math.max(avB.me - 0.4, t)} />} />);
    L.push(<Tag key="fog" t={t} at={A("al fogon")} x={AVP.fuego.x - 40} y={AVP.fuego.y - 40} dx={-300} dy={-200} text="AL FOGÓN" col={CU.maiz} out={avB.me - 0.8} size={50} />);
  }
  // ===== D · la boca del fogón es un portal a SU cocina: pegada → 3 pedazos → suela → "yo no sirvo" → paquete =====
  const tRompio = A("se le rompio en tres pedazos"), tSuela = A("dura como suela"), tYo = A("yo no sirvo para esto"), tPaq = A("y mejor fue a comprarlas"), tOig = A("pues oigame bien");
  if (t >= avB.me && t < tOig + 0.45) {
    if (t < tUsted + 0.6) L.push(<World key="wD" t={t} />);
    const fu = screenOf(Math.min(t, tUsted + 0.3), PT.fuego);
    const kitchen = <AbsoluteFill>
      {t < tRompio + 0.2 && <Shot k="c_pegada" t={t} a={tUsted - 0.2} z={[1.02, 1.12]} />}
      {t >= tRompio && t < tSuela + 0.1 && <Shot k="c_rota" t={t} a={tRompio} z={[1.04, 1.14]} />}
      {t >= tSuela && t < tPaq + 0.15 && <Shot k="c_suela" t={t} a={tSuela} z={[1.05, 1.18]} ox={-40} />}
      {t >= tPaq && <Shot k="c_paquete" t={t} a={tPaq} z={[1.04, 1.12]} />}
      <Flash t={t} at={tRompio + 0.05} peak={0.35} col="#ffe2b8" />
      <Flash t={t} at={tSuela} peak={0.3} col="#ffe2b8" />
      <Flash t={t} at={tPaq} peak={0.3} col="#ffe2b8" />
      <Tag t={t} at={A("se le quedo pegada")} x={980} y={640} dx={260} dy={-220} text="¡SE PEGÓ!" col={COL.red} out={tRompio - 0.1} size={56} />
      <Rota t={t} at={tRompio} x={1180} y={420} out={tSuela - 0.1} />
      <Corte t={t} at={A("como suela")} at2={A("cruda por dentro")} x={520} y={820} out={tYo - 0.2} />
      <Pensamiento t={t} at={tYo} text="yo no sirvo para esto…" x={960} y={330} out={tPaq - 0.05} />
      <Tag t={t} at={A("del paquete")} x={1100} y={560} dx={250} dy={-230} text="DEL PAQUETE" col={COL.amber} out={tOig - 0.1} size={56} />
    </AbsoluteFill>;
    const r = ei(t, tUsted - 0.15, tUsted + 0.45);
    // latigazo al avatar "Pues óigame bien"
    L.push(<Whip key="wpD" t={t} a={tOig - 0.3} b={tOig + 0.1} from={<Portal x={fu.x} y={fu.y} r={Math.max(r, 0.002)} ring={0.6}>{kitchen}</Portal>} to={<Avatar t={t} />} />);
  }
  // ===== E · avatar "NUNCA FUE USTED · FUE EL COMAL" → zoom a la cocina entera =====
  const avE = WIN[2], tMejor = A("o mejor dicho");
  if (t >= tOig + 0.1 && t < avE.me + 0.25) {
    L.push(<ZoomThru key="zE" t={t} a={avE.me - 0.55} b={avE.me + 0.2} x={AVP.patio.x + 700} y={500} k={3} top={<Avatar t={t} />} under={<World t={Math.max(avE.me - 0.3, t)} />} />);
    L.push(<Sello key="nfu" t={t} at={A("nunca fue usted")} text="NO FUE USTED" x={480} y={300} out={avE.me - 0.6} rot={-7} size={80} bg="rgba(42,26,16,.9)" />);
    L.push(<Sello key="fec" t={t} at={A("fue el comal")} text="FUE EL COMAL" x={1430} y={820} out={avE.me - 0.6} rot={5} size={80} />);
  }
  // ===== F · la cocina: "nadie le enseñó"; el recetario sin la hoja del comal; del humo sale la abuela =====
  const tAbu = A("mirando a la abuela"), avG = WIN[3];
  if (t >= avE.me && t < avG.ms + 0.4) {
    L.push(<World key="wF" t={t} />);
    const m = screenOf(t, PT.mesa);
    L.push(<Tabla key="ens" t={t} at={A("nadie le enseno")} x={m.x} y={m.y - 40} text="NADIE LE ENSEÑÓ" out={A("ningun recetario") - 0.3} />);
    L.push(<Recetario key="rec" t={t} at={A("ningun recetario") - 0.1} x={960} y={560} out={tAbu - 0.35} />);
    // portal de humo: la abuela con la niña
    const co = screenOf(t, PT.comal), r = ei(t, tAbu - 0.35, tAbu + 0.4);
    if (r > 0) L.push(<Portal key="pAb" x={co.x} y={co.y - 120} r={r} ring={0.3}><AbsoluteFill style={{ filter: "sepia(.18)" }}><Shot k="c_abuela" t={t} a={tAbu - 0.3} z={[1.12, 1.02]} /></AbsoluteFill>
      <Pensamiento t={t} at={A("nadie lo escribio nunca")} text="nadie lo escribió nunca" x={960} y={180} out={avG.ms - 0.2} /></Portal>);
    const ri = ei(t, avG.ms - 0.25, avG.ms + 0.35);
    if (ri > 0) L.push(<Portal key="pG" x={960} y={480} r={ri}><Avatar t={t} /></Portal>);
  }
  // ===== G · avatar "Yo sí se lo voy a decir: 25 TRUCOS DEL COMAL" → portal por su comal =====
  const tCura = A("como se cura");
  if (t >= avG.ms + 0.3 && t < avG.me + 0.15) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<BigNum key="25" t={t} at={A("son veinticinco trucos")} text="25" size={300} x={430} y={430} col={CU.maiz} edge="#6b3a00" sub="TRUCOS DEL COMAL" out={avG.me - 0.3} />);
    const r = ei(t, avG.me - 0.45, avG.me + 0.1);
    if (r > 0) L.push(<Portal key="pG2" x={AVP.comal.x} y={AVP.comal.y} r={r}><World t={Math.max(avG.me - 0.3, t)} /></Portal>);
  }
  // ===== H · órbita del comal: se encala / se calienta / se tatema / ceniza / se cuelga; $0 de más =====
  const avI = WIN[4];
  if (t >= avG.me && t < avI.ms + 0.4) {
    L.push(<World key="wH" t={t} />);
    L.push(<Fichas key="fi" t={t} out={A("ni uno le va a costar") - 0.1} y={880} items={[
      { at: tCura, tx: "CURARLO", ic: "⚪" }, { at: A("como se calienta"), tx: "CALENTARLO", ic: "🔥" }, { at: A("que se tatema"), tx: "TATEMAR", ic: "🍅" },
      { at: A("como se limpia con ceniza"), tx: "CENIZA", ic: "🪵" }, { at: A("como se guarda"), tx: "GUARDARLO", ic: "📌" }]} />);
    L.push(<Tag key="vid" t={t} at={A("toda la vida")} x={screenOf(t, PT.clavo).x} y={screenOf(t, PT.clavo).y} dx={260} dy={-160} text="TODA LA VIDA" col={CU.maiz} out={A("ni uno le va a costar") + 0.3} size={52} />);
    L.push(<Peso key="ps" t={t} at={A("un peso de mas")} x={720} y={460} out={avI.ms - 0.2} />);
    const r = ei(t, avI.ms - 0.25, avI.ms + 0.35), c = screenOf(t, PT.clavo);
    if (r > 0) L.push(<Portal key="pI" x={c.x} y={c.y} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== I · avatar: "alguien de su familia le va a discutir" + CUCA MENDOZA =====
  const tYoSoy = A("yo soy cuca"), tCom = A("soy comadre y vecina");
  if (t >= avI.ms + 0.3 && t < avI.me + 0.2) {
    L.push(<ZoomThru key="zI" t={t} a={avI.me - 0.5} b={avI.me + 0.15} x={AVP.patio.x} y={AVP.patio.y} k={5} top={<Avatar t={t} />} under={<World t={Math.max(avI.me - 0.3, t)} />} />);
    L.push(<Pleito key="pl" t={t} at={A("le discuta")} out={A("dejen los que discutan") + 0.6} />);
  }
  if (t >= tYoSoy - 0.1 && t < tCom + 0.5) L.push(<LowerThird key="lt" t={t} at={tYoSoy} out={tCom + 0.2} name="CUCA MENDOZA" l2="73 AÑOS · DEL RANCHO" l2at={A("tengo 73 anos")} />);
  // ===== J · la cámara sale volando al patio: la casa de Chayo, la barda, 40 años de tortillas =====
  const avK = WIN[5], tPas = A("nos hemos pasado tortillas");
  if (t >= avI.me && t < avK.ms + 0.4) {
    L.push(<World key="wJ" t={t} />);
    const ch = screenOf(t, PT.chayo), ba = screenOf(t, PT.barda);
    L.push(<Tabla key="lch" t={t} at={A("de chayo la de la cocina")} x={ch.x} y={ch.y - 60} text="LA CASA DE CHAYO" col={CU.maiz} out={A("a una barda") + 0.2} />);
    L.push(<Tabla key="lba" t={t} at={A("una barda de distancia")} x={ba.x} y={ba.y - 30} text="1 BARDA" out={tPas - 0.2} size={60} />);
    const r = ei(t, tPas - 0.4, tPas + 0.3);
    if (r > 0) L.push(<Portal key="pBa" x={ba.x} y={ba.y} r={r} ring={0.5}><Shot k="c_barda" t={t} a={tPas - 0.4} z={[1.03, 1.12]} />
      <Anos t={t} at={A("por mas de 40 anos")} n={40} x={1580} y={300} out={avK.ms - 0.2} label="AÑOS" /></Portal>);
    const ri = ei(t, avK.ms - 0.25, avK.ms + 0.35);
    if (ri > 0) L.push(<Portal key="pK" x={960} y={500} r={ri}><Avatar t={t} /></Portal>);
  }
  // ===== K · avatar "en esta cocina de adobe…" → la lumbre, leña / barro / paciencia → el comal de la mamá =====
  const tAcu = A("todavia me acuerdo de su comal"), avM = WIN[6];
  if (t >= avK.ms + 0.3 && t < tAcu + 0.6) {
    const fog = <AbsoluteFill><Shot k="c_fogon" t={t} a={avK.me - 0.2} z={[1.02, 1.1]} /></AbsoluteFill>;
    L.push(<Whip key="wpK" t={t} a={avK.me - 0.2} b={avK.me + 0.2} from={<Avatar t={t} />} to={fog} dir={-1} />);
    L.push(<Fichas key="lbp" t={t} out={tAcu - 0.3} y={150} items={[{ at: A("con lena"), tx: "LEÑA", ic: "🪵" }, { at: A("con barro"), tx: "BARRO", ic: "🏺" }, { at: A("y con paciencia"), tx: "PACIENCIA", ic: "⏳" }]} />);
    L.push(<Tabla key="mam" t={t} at={A("como las hacia mi mama")} x={1400} y={420} text="COMO MI MAMÁ" out={A("con lena") + 0.2} />);
  }
  if (t >= tAcu - 0.4 && t < avM.ms + 0.4) {
    const cl = screenOf(t, PT.clavo), r = ei(t, tAcu - 0.4, tAcu + 0.3);
    const comal = <AbsoluteFill><World t={Math.max(t, tAcu - 0.3)} />
      <Tabla t={t} at={A("de su comal") + 0.2} x={cl.x} y={cl.y - 170} text="EL COMAL DE MI MAMÁ" col={CU.maiz} out={avM.ms - 0.2} />
      <Tag t={t} at={A("negro de tanto uso")} x={cl.x + 60} y={cl.y + 40} dx={-420} dy={170} text="NEGRO DE TANTO USO" out={avM.ms - 0.2} size={46} />
      <Tag t={t} at={A("colgado de un clavo")} x={cl.x} y={cl.y - 110} dx={-330} dy={-60} text="DE UN CLAVO" col={CU.chile} out={avM.ms - 0.2} size={46} />
    </AbsoluteFill>;
    L.push(<Portal key="pCl" x={960} y={540} r={r} ring={0.4}>{comal}</Portal>);
    const ri = ei(t, avM.ms - 0.25, avM.ms + 0.35);
    if (ri > 0) L.push(<Portal key="pM" x={cl.x} y={cl.y} r={ri}><Avatar t={t} /></Portal>);
  }
  // ===== L · avatar "Rapidito, antes de seguir…" (entra la guía) =====
  if (t >= avM.ms + 0.3) L.push(<Avatar key="avM" t={t} />);

  return <AbsoluteFill style={{ background: "#0d0906" }}>{L}</AbsoluteFill>;
};

export const _unused = atE;
