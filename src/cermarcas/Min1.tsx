// cermarcas · MINUTO 1 + LA GUÍA (0-110,2 s). Un solo hilo, sin cortes secos:
// avatar → portal a la señora con las bolsas → la cámara 3D baja de la vereda al marco: EL PLÁSTICO a la altura de la rodilla
// → avatar (la señora lo tira, tarjeta) → OJO TÉRMICO: el hombre que lo puso pasa por la vereda → sus manos lo meten
// → "ES UNA PRUEBA" → pasa el martes, vuelve el jueves (calendario) → avatar "SIGUE AHÍ = CASA VACÍA"
// → en 3D la puerta se abre y el plástico se cae: "ALGUIEN ENTRA" · la pregunta respondida → Claudio arreglando una puerta
// → la dueña → la fachada en térmica: las marcas se ENCIENDEN una por una → "7 SEÑALES" desde arriba → avatar (3 fichas)
// → la que dejas tú (diarios + buzón) → la cámara entra por EL OJO DE LA CERRADURA al recibidor: LA GUÍA, libro 1 pág. 61 REAL
// (avatar en videollamada al lado), se pintan los renglones, la descripción con el link → sale por la cerradura a la puerta.
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, pagePt, Marker, MarkState, MarkId, MARKS } from "./casa3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Card3D, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 110.2;
export const MIN1_FRAMES = s(MIN1_END + 0.6);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/cermarcas/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // clips LTX ya bajados (public/cermarcas/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

// avatar NÍTIDO: sin desenfoque, sin halo, sin máscara (regla del creador 21-oct)
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

type WP = Omit<React.ComponentProps<typeof WorldRaw>, "t">;
export const World: React.FC<{ t: number } & WP> = ({ t, ...rest }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} {...rest} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
// barrido con desenfoque de movimiento entre dos capas
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 36, ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// EL CALENDARIO del ladrón: dos hojas (MARTES: lo mete · JUEVES: vuelve a mirar), la flecha del "dos días" las une
const Calendario: React.FC<{ t: number; a1: number; a2: number; out: number }> = ({ t, a1, a2, out }) => {
  const o = e(t, a1, a1 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const hoja = (at: number, dia: string, num: string, tx: string, i: number) => {
    const k = Math.min(1.1, spr(t, at, 0.9)), oo = e(t, at, at + 0.12);
    return (
      <div style={{ opacity: oo, width: 330, transformOrigin: "50% 0", transform: `rotateX(${(1 - Math.min(1, k)) * -95}deg) rotateZ(${i ? 3 : -3}deg)`, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.65)", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ background: i ? "#c8312a" : "#2f4f7a", color: "#fff", fontWeight: 900, fontSize: 46, letterSpacing: 8, padding: "12px 0 8px" }}>{dia}</div>
        <div style={{ background: "linear-gradient(180deg,#fbf8ef,#e7e1d3)", padding: "6px 0 18px" }}>
          <div style={{ fontWeight: 900, fontSize: 150, color: "#1d2733", lineHeight: 1.05 }}>{num}</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: i ? "#c8312a" : "#2f4f7a", letterSpacing: 3 }}>{tx}</div>
        </div>
      </div>
    );
  };
  const ar = e(t, a2 - 0.25, a2 + 0.35);
  return (
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", perspective: 1400, opacity: o, display: "flex", gap: 190, alignItems: "flex-start" }}>
      {hoja(a1, "MARTES", "14", "LO METE", 0)}
      <svg width={260} height={120} style={{ position: "absolute", left: 300, top: 150, overflow: "visible" }}>
        <path d="M10 80 Q130 -20 250 80" fill="none" stroke={COL.amber} strokeWidth={9} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - ar)} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.7))" }} />
        {ar > 0.95 && <path d="M232 62 L252 84 L222 92" fill="none" stroke={COL.amber} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
        <text x={130} y={-2} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={COL.amber} opacity={ar} style={{ letterSpacing: 3 }}>2 DÍAS</text>
      </svg>
      {hoja(a2, "JUEVES", "16", "VUELVE A MIRAR", 1)}
    </div>
  );
};

// la PLACA de la regla del ladrón: dos renglones que se escriben, el segundo en rojo
const Regla: React.FC<{ t: number; at: number; at2: number; out: number; l1: string; l2: string; x: number; y: number }> = ({ t, at, at2, out, l1, l2, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n1 = Math.round(l1.length * e(t, at + 0.1, at + 0.7)), n2 = Math.round(l2.length * e(t, at2, at2 + 0.5));
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1400, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 60 - 12}deg) rotateX(4deg)`, padding: "26px 44px", borderRadius: 22, background: "linear-gradient(180deg, rgba(14,18,26,.94), rgba(6,8,12,.94))", boxShadow: `0 50px 100px rgba(0,0,0,.7), inset 0 0 0 2px ${COL.amber}66`, fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: 64, color: COL.ink, letterSpacing: 2, textShadow: extrude(5, "#000") }}>{l1.slice(0, n1)}</div>
        <div style={{ fontWeight: 900, fontSize: 76, color: COL.red, letterSpacing: 2, marginTop: 6, textShadow: extrude(6, "#3a0a06") }}>{n2 > 0 ? "= " : ""}{l2.slice(0, n2)}</div>
      </div>
    </div>
  );
};

// la PREGUNTA del ladrón: "¿HAY ALGUIEN?" con un signo que late → se tilda RESPONDIDA
const Pregunta: React.FC<{ t: number; at: number; done: number; out: number; x: number; y: number }> = ({ t, at, done, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = e(t, done, done + 0.3), pulse = 1 + 0.05 * Math.sin(t * 9) * (1 - d);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * Math.min(1, k)) * pulse})`, opacity: o, fontFamily: FONT, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 900, fontSize: 92, color: d > 0.5 ? COL.red : COL.ink, textShadow: extrude(8, "#000") }}>¿HAY ALGUIEN?</div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "8px 26px", borderRadius: 12, background: COL.red, color: "#fff", fontWeight: 900, fontSize: 48, letterSpacing: 4, opacity: d, transform: `scale(${2 - d})`, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>✓ TÚ LE RESPONDISTE</div>
    </div>
  );
};

// fichas numeradas que nacen cada una con SU frase
const ChipsAt: React.FC<{ t: number; items: { at: number; tx: string }[]; out: number; y?: number }> = ({ t, items, out, y = 800 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, width: 440, padding: "16px 0 14px", borderRadius: 18,
          background: "linear-gradient(180deg, rgba(36,14,40,.95), rgba(14,6,18,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 2px ${COL.amber}66`, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 70, color: COL.amber, lineHeight: 1, textShadow: extrude(6, "#3a1a00") }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 32, color: COL.ink, letterSpacing: 3, marginTop: 6 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// visor de la cámara térmica (HUD del ladrón): esquinas, REC, lectura de temperatura
export const ThermHud: React.FC<{ t: number; amt: number; label?: string }> = ({ t, amt, label = "VISTA DEL LADRÓN" }) => {
  if (amt <= 0.01) return null;
  const c = "rgba(255,240,220,.85)", L = 70, M = 60;
  const corner = (x: number, y: number, sx: number, sy: number) => <path d={`M${x} ${y + sy * L} L${x} ${y} L${x + sx * L} ${y}`} fill="none" stroke={c} strokeWidth={5} />;
  return (
    <AbsoluteFill style={{ opacity: amt, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {corner(M, M, 1, 1)}{corner(1920 - M, M, -1, 1)}{corner(M, 1080 - M, 1, -1)}{corner(1920 - M, 1080 - M, -1, -1)}
        <line x1={940} y1={540} x2={980} y2={540} stroke={c} strokeWidth={3} /><line x1={960} y1={520} x2={960} y2={560} stroke={c} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: 100, top: 92, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: c, display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, background: "#ff3b30", opacity: Math.sin(t * 5) > 0 ? 1 : 0.25 }} />{label}</div>
      <div style={{ position: "absolute", right: 100, top: 92, fontFamily: "monospace", fontWeight: 700, fontSize: 30, color: c }}>{(18.4 + Math.sin(t * 1.3) * 0.4).toFixed(1)}°C</div>
    </AbsoluteFill>
  );
};

// el avatar en "videollamada": marco de celular apaisado flotando junto a la guía (borde nítido)
const VideoCall: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), h = w * 9 / 16;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1600, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${14 + (1 - Math.min(1, k)) * 40}deg) rotateX(3deg)`, borderRadius: 34, padding: 14, background: "linear-gradient(160deg,#2b2e33,#0c0d0f)", boxShadow: "0 60px 110px rgba(0,0,0,.7), inset 0 0 0 3px #4a4d52" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden" }}>
          <Avatar t={t} />
          <div style={{ position: "absolute", left: 18, top: 16, padding: "6px 14px", borderRadius: 20, background: "rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#fff", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff3b30", opacity: Math.sin(t * 5) > 0 ? 1 : 0.3 }} /> CLAUDIO · EN VIVO</div>
        </div>
      </div>
    </div>
  );
};

// tarjeta "descripción del video": el renglón 1 (el link) se ilumina y la flecha lo señala
export const Desc: React.FC<{ t: number; at: number; out: number; line?: string }> = ({ t, at, out, line = "🔐 Las 7 señales y qué hacer con cada una, con dibujos" }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 1080, top: 720, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-10 + 4 * Math.sin(t * 0.8)}deg)`, width: 1180, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 36, lineHeight: 1.3 }}>{line} 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>https://claudioelcerrajero.vercel.app</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(940)}{L(1000)}{L(720)}{L(860, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -560, top: -250, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

// estado de las marcas en cada momento del minuto 1 (k = existe, lit = arde)
const marksAt = (t: number): MarkState => {
  const m: MarkState = {};
  const set = (id: MarkId, k: number, lit: number) => { m[id] = { k, lit }; };
  // el plástico existe desde el principio hasta que la puerta se abre (después vuelve: es "la casa del ejemplo")
  set("plast", 1, 0);
  if (t >= 57) {
    const on: Record<MarkId, number> = { plast: 57.58, cinta: 58.72, tiza: 60.2, volante: 60.96, precinto: 66.6, moneda: 66.9, diarios: 67.2 };
    for (const id of MARKS) { const a = on[id]; set(id, e(t, a - 0.3, a), e(t, a, a + 0.25) * (1 - e(t, 81.3, 81.8))); }
    if (t >= 75) set("diarios", 1, 1 - e(t, 81.3, 81.8));
  }
  return m;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const mk = marksAt(t);
  const W = (tt: number, extra: Partial<WP> = {}) => <World t={tt} marks={marksAt(tt)} {...extra} />;

  // ===== A · 0-4,1 · avatar "son las siete de la tarde, vuelves del mercado" =====
  if (t < 4.5) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, 3.75, 4.45);
    if (r > 0) L.push(<Portal key="pA" x={1380} y={700} r={r}><Shot k="h_bolsas" t={t} a={3.75} z={[1.12, 1.03]} /></Portal>);
  }
  // ===== B · 4,1-8,2 · la señora con las bolsas, deja una en el piso =====
  if (t >= 4.45 && t < 8.6) {
    L.push(<Shot key="bB" k="h_bolsas" t={t} a={3.75} z={[1.12, 1.03]} />);
    L.push(<Tag key="7pm" t={t} at={4.5} x={1500} y={160} dx={-1} dy={0} text="7:00 PM" col={COL.amber} out={6.6} size={64} />);
    const k = ei(t, 8.2, 8.6);
    if (k > 0) L.push(<AbsoluteFill key="wB" style={{ clipPath: `inset(${(1 - k) * 100}% 0 0 0)` }}>{W(8.2 + (t - 8.2))}</AbsoluteFill>);
  }
  // ===== C · 8,2-17,4 · la cámara 3D baja de la vereda al marco: EL PLÁSTICO a la altura de la rodilla =====
  if (t >= 8.6 && t < 17.45) {
    L.push(<React.Fragment key="wC">{W(t)}</React.Fragment>);
    const p = screenOf(t, PT.plast);
    L.push(<Tag key="rod" t={t} at={10.62} x={p.x} y={p.y} dx={-200} dy={-220} text="A LA ALTURA DE LA RODILLA" col={COL.amber} out={12.1} size={42} />);
    L.push(<Tag key="pla" t={t} at={12.32} x={p.x} y={p.y} dx={-220} dy={-240} text="PLÁSTICO TRANSPARENTE" sub="FINITO, COMO DE UN SOBRE" col={COL.ice} out={15.3} size={46} />);
    L.push(<BigNum key="tnp" t={t} at={16.6} text="TÚ NO LO PUSISTE" size={120} y={190} out={17.3} col={COL.ink} edge="#2a1a10" />);
  }
  // ===== D · 17,4-22,3 · avatar; la señora lo tira (tarjeta 3D a la derecha) =====
  if (t >= 17.43 && t < 22.3) {
    L.push(<Avatar key="avD" t={t} />);
    const k = Math.min(1.1, spr(t, 19.6, 0.8)), o = e(t, 19.6, 19.8) * (1 - e(t, 22.0, 22.26));
    L.push(<Card3D key="tira" id={clip("h_tira")} at={LTX.has("h_tira") ? 19.6 : undefined} x={1180} y={190} w={620} h={350} ry={-22 + (1 - Math.min(1, k)) * -50} rz={2} z={(1 - Math.min(1, k)) * -500} o={o} label="LO TIRAS Y ENTRAS" labelCol={COL.amber} />);
  }
  // ===== E · 22,3-25,6 · OJO TÉRMICO: el hombre que lo puso pasa por la vereda =====
  if (t >= 22.26 && t < 26.0) {
    const th = ei(t, 22.26, 22.7);
    L.push(<React.Fragment key="wE">{W(t, { therm: th, walker: [22.0, 26.4] })}</React.Fragment>);
    L.push(<Flash key="flE" t={t} at={22.3} col="#ffcf8a" peak={0.5} w={0.3} />);
    L.push(<ThermHud key="hudE" t={t} amt={e(t, 22.5, 22.8)} />);
    L.push(<BigNum key="qq" t={t} at={24.38} text="LO QUE ÉL QUERÍA" size={96} y={900} out={25.9} col="#fff3d6" edge="#5a1a00" />);
    const r = ei(t, 25.55, 26.0);
    if (r > 0) { const pl = screenOf(t, PT.plast); L.push(<Portal key="pE" x={pl.x} y={pl.y} r={r}><Shot k="h_mete" t={t} a={25.55} z={[1.15, 1.03]} dur={4} /></Portal>); }
  }
  // ===== F · 26-29,8 · sus manos lo meten: ES UNA PRUEBA =====
  if (t >= 26.0 && t < 30.2) {
    L.push(<Shot key="mF" k="h_mete" t={t} a={25.55} z={[1.15, 1.03]} dur={4} />);
    L.push(<Tag key="nob" t={t} at={26.6} x={1250} y={640} dx={-300} dy={-240} text="NO ES BASURA" col={COL.ink} out={28.8} size={54} />);
    L.push(<Stamp key="pru" t={t} at={29.02} text="ES UNA PRUEBA" x={960} y={300} out={30.1} rot={-7} size={110} />);
  }
  // ===== G · 29,8-34,1 · pasa el martes, vuelve el jueves =====
  if (t >= 29.8 && t < 34.4) {
    const k = ei(t, 29.8, 30.2);
    L.push(<Swipe key="swG" t={t} a={29.8} b={30.2} from={<Shot k="h_mete" t={t} a={25.55} z={[1.15, 1.03]} dur={4} />} to={<Shot k="h_pasa" t={t} a={29.8} z={[1.02, 1.12]} ox={-40} dur={5} />} />);
    void k;
    L.push(<AbsoluteFill key="dkG" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,.55))", opacity: e(t, 30.4, 30.8) }} />);
    L.push(<Calendario key="cal" t={t} a1={30.78} a2={32.18} out={34.05} />);
  }
  // ===== H · 34,1-38,8 · avatar: SIGUE AHÍ = CASA VACÍA =====
  if (t >= 34.14 && t < 38.8) {
    L.push(<Avatar key="avH" t={t} />);
    L.push(<Regla key="rg" t={t} at={35.2} at2={37.9} out={38.6} l1="SI EL PLÁSTICO SIGUE AHÍ" l2="CASA VACÍA" x={1400} y={260} />);
  }
  // ===== I · 38,8-44,9 · en 3D la puerta se abre y el plástico se cae: ALGUIEN ENTRA · la pregunta respondida =====
  if (t >= 38.78 && t < 45.3) {
    const th = ei(t, 39.7, 40.1);
    const op = ei(t, 40.1, 41.4);
    const k = ei(t, 38.78, 39.15);
    L.push(<AbsoluteFill key="wI" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}>{W(t, { therm: th, doorOpen: op, plastFall: e(t, 40.25, 40.9) })}</AbsoluteFill>);
    L.push(<ThermHud key="hudI" t={t} amt={e(t, 39.9, 40.2)} />);
    const pl = screenOf(t, PT.plast);
    L.push(<Tag key="sc" t={t} at={40.4} x={pl.x - 20} y={pl.y + 120} dx={-280} dy={60} text="SE CAE" col={COL.amber} out={42.6} size={50} />);
    L.push(<BigNum key="ae" t={t} at={40.1} text="ALGUIEN ENTRA" size={110} y={190} out={42.4} col="#fff3d6" edge="#5a1a00" />);
    L.push(<Pregunta key="pq" t={t} at={42.5} done={43.48} out={44.9} x={960} y={230} />);
  }
  // ===== J · 44,9-51,5 · Claudio, cerrajero, 30 años: arreglando una puerta forzada =====
  if (t >= 44.9 && t < 51.9) {
    const r = ei(t, 44.9, 45.3);
    L.push(<Portal key="pJ" x={960} y={540} r={r}><Shot k="c_forzada" t={t} a={44.9} z={[1.03, 1.13]} ox={-30} dur={7} /></Portal>);
    L.push(<LowerThird key="lt" t={t} at={45.6} out={51.3} name="CLAUDIO" l2="CERRAJERO · 30 AÑOS" l2at={46.6} />);
    L.push(<Tag key="pf" t={t} at={49.44} x={1180} y={470} dx={260} dy={-200} text="PUERTAS FORZADAS" sub="MÁS DE LAS QUE QUISIERA CONTAR" col={COL.red} out={51.4} size={50} />);
  }
  // ===== K · 51,5-53,5 · avatar · 53,5-57,3 · la dueña cuenta la semana anterior =====
  if (t >= 51.53 && t < 57.6) {
    L.push(<Swipe key="swK" t={t} a={53.45} b={53.8} from={<Avatar t={t} />} to={<Shot k="c_duena" t={t} a={53.45} z={[1.03, 1.12]} ox={30} dur={4} />} />);
    L.push(<Tag key="sa" t={t} at={55.3} x={720} y={880} dx={-220} dy={-140} text="LA SEMANA ANTERIOR" sub="SIEMPRE HAY ALGO RARO" col={COL.amber} out={57.3} size={48} />);
  }
  // ===== L · 57,3-61,6 · la fachada en térmica: las marcas se ENCIENDEN una por una =====
  if (t >= 57.28 && t < 62.0) {
    const k = ei(t, 57.28, 57.65);
    L.push(<AbsoluteFill key="wL" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}>{W(t, { therm: 1, vecino: 0 })}</AbsoluteFill>);
    L.push(<ThermHud key="hudL" t={t} amt={e(t, 57.4, 57.7)} />);
    const tg = (id: MarkId, at: number, text: string, dx: number, dy: number) => { const q = screenOf(t, PT[id]); return <Tag key={"t" + id} t={t} at={at} x={q.x} y={q.y} dx={dx} dy={dy} text={text} col="#fff3d6" out={61.7} size={42} />; };
    L.push(tg("plast", 57.58, "UN PAPELITO", 260, 120), tg("cinta", 58.72, "UNA CINTA", 300, -60), tg("tiza", 60.2, "TIZA", 220, -160), tg("volante", 60.96, "UN VOLANTE", -320, 150));
  }
  // ===== M · 61,6-66,4 · Claudio señala: a la vista y nadie las leyó =====
  if (t >= 61.6 && t < 66.75) {
    L.push(<Swipe key="swM" t={t} a={61.6} b={61.95} from={W(61.6, { therm: 1 })} to={
      <Swipe t={t} a={66.4} b={66.75} vert dir={-1} from={<Shot k="c_marcas" t={t} a={61.6} z={[1.03, 1.12]} ox={-30} dur={5} />} to={W(66.75, { therm: 1 })} />} />);
    L.push(<Tag key="av" t={t} at={62.6} x={1330} y={330} dx={260} dy={-120} text="A LA VISTA" col={COL.amber} out={65.0} size={50} />);
    L.push(<Stamp key="nl" t={t} at={65.18} text="NADIE LAS LEYÓ" x={760} y={860} out={66.4} rot={-6} size={90} />);
  }
  // ===== N · 66,4-69,1 · desde arriba: las 7 SEÑALES encendidas =====
  if (t >= 66.75 && t < 69.5) {
    L.push(<React.Fragment key="wN">{W(t, { therm: 1 })}</React.Fragment>);
    L.push(<ThermHud key="hudN" t={t} amt={1} />);
    L.push(<BigNum key="7s" t={t} at={68.08} text="7 SEÑALES" size={170} y={170} out={69.4} col="#fff3d6" edge="#5a1a00" />);
  }
  // ===== O · 69,1-75,3 · avatar: qué es · si es inocente · qué hacer esa tarde =====
  if (t >= 69.12 && t < 75.3) {
    const r = ei(t, 69.12, 69.5);
    if (r < 1) L.push(<React.Fragment key="wO">{W(69.12, { therm: 1 })}</React.Fragment>);
    L.push(<Portal key="pO" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
    L.push(<ChipsAt key="chp" t={t} out={75.0} items={[{ at: 70.54, tx: "QUÉ ES" }, { at: 72.52, tx: "¿O ES INOCENTE?" }, { at: 73.96, tx: "QUÉ HACER HOY" }]} />);
  }
  // ===== P · 75,3-81,3 · la que dejas tú: los diarios y el buzón que rebalsa =====
  if (t >= 75.26 && t < 81.3) {
    const k = ei(t, 75.26, 75.65);
    L.push(<AbsoluteFill key="wP" style={{ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>{W(t)}</AbsoluteFill>);
    if (k < 1) L.push(<AbsoluteFill key="avP" style={{ clipPath: `inset(0 0 0 ${k * 100}%)` }}><Avatar t={t} /></AbsoluteFill>);
    const d = screenOf(t, PT.diarios), b = screenOf(t, PT.buzon);
    L.push(<Tag key="um" t={t} at={76.32} x={b.x} y={b.y} dx={260} dy={-140} text="LA MÁS USADA" sub="POR LOS LADRONES" col={COL.amber} out={80.3} size={50} />);
    L.push(<Tag key="no" t={t} at={78.2} x={d.x} y={d.y} dx={300} dy={90} text="NO LA DEJAN ELLOS" col={COL.ink} out={80.3} size={44} />);
    L.push(<BigNum key="ldt" t={t} at={80.82} text="LA DEJAS TÚ" size={140} y={210} out={81.3} col={COL.red} edge="#3a0a06" />);
  }
  // ===== Q · 81,3-84,3 · la cámara entra por EL OJO DE LA CERRADURA =====
  if (t >= 81.3 && t < 84.3) {
    L.push(<React.Fragment key="wQ">{W(t)}</React.Fragment>);
    const kh = screenOf(t, PT.lock);
    L.push(<Tag key="ab" t={t} at={81.46} x={kh.x} y={kh.y} dx={-300} dy={-160} text="ANTES DE EMPEZAR" col={COL.amber} out={83.3} size={46} />);
    const dk = e(t, 83.75, 84.28);
    if (dk > 0) L.push(<AbsoluteFill key="bk" style={{ background: "#000", opacity: dk }} />);
  }
  // ===== R · 84,3-108 · EL RECIBIDOR: la guía en la mesita =====
  if (t >= 84.3 && t < 108.4) {
    const ir = ei(t, 84.3, 84.95);
    // marcadores fosforito sobre la página 61 REAL (título · el dibujo de la casa · las 5 señales · la vista desde la vereda)
    const mks = <>
      <Marker t={t} at={93.4} box={[0.075, 0.083, 0.625, 0.117]} out={102.4} />
      <Marker t={t} at={94.62} box={[0.075, 0.618, 0.64, 0.633]} out={102.4} col="#8fd6ff" />
      <Marker t={t} at={96.7} box={[0.11, 0.548, 0.89, 0.598]} out={102.4} />
    </>;
    const bo = ei(t, 91.0, 92.9), fan = ei(t, 89.44, 91.0) * (1 - ei(t, 102.4, 103.2));
    L.push(<AbsoluteFill key="wR" style={{ clipPath: `circle(${ir * 1200}px at 960px 540px)` }}><World t={t} bookOpen={bo} fan={fan}>{mks}</World></AbsoluteFill>);
    L.push(<Flash key="flR" t={t} at={84.32} col="#fff1cf" peak={0.35} w={0.4} />);
    const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]);
    L.push(<Tag key="g1" t={t} at={86.74} x={bk.x} y={bk.y - 30} dx={300} dy={-200} text="MI GUÍA" sub="PARA LOS QUE VIVEN SOLOS" col="#ffd08a" out={89.2} size={52} />);
    L.push(<VideoCall key="vc1" t={t} at={85.47} out={88.94} x={80} y={230} w={720} />);
    L.push(<BigNum key="mc" t={t} at={89.44} text="EL MÉTODO DEL CERRAJERO" size={84} y={150} out={91.5} col="#ffd60a" edge="#5a4500" />);
    L.push(<BigNum key="p61" t={t} at={92.64} text="PÁG. 61" sub="LIBRO 1" size={120} x={1600} y={170} out={101.9} col="#ffd60a" edge="#5a4500" />);
    const ca = screenOf(t, pagePt(0.5, 0.38)), le = screenOf(t, pagePt(0.85, 0.573)), ti = screenOf(t, pagePt(0.6, 0.1));
    L.push(<Tag key="ve" t={t} at={94.62} x={ca.x} y={ca.y} dx={-430} dy={-120} text="LA CASA DESDE LA VEREDA" col="#8fd6ff" out={101.9} size={42} />);
    L.push(<Tag key="5s" t={t} at={96.7} x={le.x} y={le.y} dx={330} dy={60} text="5 SEÑALES" sub="ANTES DEL TIMBRE" col="#ffd60a" out={101.9} size={48} />);
    L.push(<Tag key="tr" t={t} at={101.26} x={ti.x} y={ti.y} dx={330} dy={-60} text="CADA UNA CON SU TRUCO" col={COL.ink} out={102.3} size={40} />);
    L.push(<VideoCall key="vc2" t={t} at={102.42} out={108.0} x={80} y={110} w={520} />);
    L.push(<BigNum key="10" t={t} at={104.08} text="< 10 DÓLARES" sub="CADA UNA" size={96} x={1420} y={180} out={105.0} col="#7dff9e" edge="#0a3a1a" />);
    L.push(<Desc key="desc" t={t} at={105.12} out={108.0} />);
    const dk = e(t, 107.9, 108.38);
    if (dk > 0) L.push(<AbsoluteFill key="bk2" style={{ background: "#000", opacity: dk }} />);
  }
  // ===== S · 108,4-110,2 · sale por la cerradura: de vuelta a la puerta, "vamos a la puerta" =====
  if (t >= 108.38) {
    const ir = ei(t, 108.38, 109.0);
    L.push(<AbsoluteFill key="wS" style={{ clipPath: `circle(${ir * 1200}px at 960px 540px)` }}>{W(t)}</AbsoluteFill>);
    L.push(<BigNum key="s1" t={t} at={109.6} text="SEÑAL Nº 1" size={120} y={180} col={COL.amber} edge="#3a1a00" />);
  }
  void mk;
  return <AbsoluteFill style={{ background: "#05070c" }}>{L}</AbsoluteFill>;
};
void Vid;
