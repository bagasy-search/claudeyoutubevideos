// tdccalor2 · MINUTO 1 + LA GUÍA (0-123,3 s). Un solo hilo visual, sin cortes secos: el avatar (Claudio en su taller de noche)
// y UN mundo 3D (el taller en corte con el termómetro gigante). Se pasa de uno a otro por la BOCA DE LA ESTUFA (portal),
// por deslizamientos con desenfoque o por zoom HACIA el avatar (nunca saliendo del mundo 3D con zoom: cuelga Chrome en el farm).
// 0 avatar "son las tres de la mañana" (vaho) → la estufa apagada → la escarcha crece por dentro (LTX) → Claudio se tapa con otra manta
// → avatar → el calor de las diez de la noche (LTX manos) se escapa por ventana, rendija y caño → el termómetro: 4 °C (LTX) / afuera -3
// → avatar SIN GARRAFA · SIN LEÑA → la meta en 20 → se encienden los 7 puestos → el video anterior (LTX brasa) → avatar "miles"
// → el comentario del vecino mientras el termómetro sube a 18 y vuelve a 4 → ¿dónde se va? → avatar → travelling por los bancos
// → Claudio midiendo → "el termómetro no miente" → portal por la boca de la estufa → avatar PUEDE MATAR → el video de la llamita
// → CTA1: los 5 manuales se abren en fila, el 2º avanza y se abre en la pág. 55 con resaltados y ladrillitos → la descripción → la puerta.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed } from "./taller3d";
import AVW from "./avwin.json";
import REELJ from "./reel.json";
import LTXOK from "./ltx_ok.json";
import { BigNum, COL, Flash, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 123.3;
export const MIN1_FRAMES = s(MIN1_END);
const REEL = (REELJ as { reel: boolean }).reel;
const OK = new Set(LTXOK as string[]);
type W = { ms: number; me: number; off: number };
export const WIN: W[] = (AVW as unknown as { win: W[] }).win;
// la boca de la estufa del avatar (en la foto de referencia) = el portal
const AV_STOVE = { x: 1597, y: 760 };

export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma LTX (ultra real) con zoom lento; si todavía no llegó de la cola, se ve lo de abajo (el mundo)
export const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; children?: React.ReactNode }> = ({ k, t, a, z = [1.03, 1.12], children }) => {
  if (!OK.has(k)) return <>{children}</>;
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}><Sequence from={s(a)} layout="none"><Vid id={"ltx/" + k} /></Sequence></AbsoluteFill>;
};
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 6);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 6)}px)` }}><Vid id={k} /></AbsoluteFill>;
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

// NUEVO · VAHO: bocanadas de aliento que salen de la boca del avatar y se deshacen al subir (el frío dentro de la casa)
const Vaho: React.FC<{ t: number; a: number; b: number; x?: number; y?: number }> = ({ t, a, b, x = 1015, y = 360 }) => {
  if (t < a || t > b + 2) return null;
  const puffs = [0, 1.25, 2.5, 3.6].map((d) => a + d).filter((p) => p < b);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{puffs.map((p, i) => {
    const k = (t - p) / 2.0; if (k < 0 || k > 1) return null;
    return <div key={i} style={{ position: "absolute", left: x + 40 * k + 10 * Math.sin(k * 5 + i), top: y - 120 * k, width: 70 + 220 * k, height: 50 + 140 * k, transform: "translate(-30%,-50%)", borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(235,243,255,.55), rgba(235,243,255,0) 70%)", filter: `blur(${6 + 18 * k}px)`, opacity: Math.sin(Math.PI * Math.min(1, k * 1.4)) * 0.85 }} />;
  })}</AbsoluteFill>;
};

// NUEVO · ESCARCHA DE PANTALLA: el hielo trepa por los bordes del cuadro (la casa helada); se derrite al final
const FrostEdge: React.FC<{ t: number; amt: number }> = ({ t, amt }) => {
  if (amt <= 0.01) return null;
    return <AbsoluteFill style={{ pointerEvents: "none", opacity: amt }}>
    <AbsoluteFill style={{ boxShadow: `inset 0 0 ${120 + 120 * amt}px rgba(170,215,255,${0.45 * amt})` }} />
  </AbsoluteFill>;
};

// NUEVO · DOS LECTURAS: adentro / afuera, como un display de taller (los números ruedan)
const InOut: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const box = (lab: string, v: number, col: string, d: number) => {
    const k = spr(t, at + d, 1), roll = Math.round(v * Math.min(1, e(t, at + d, at + d + 0.6)));
    return <div style={{ transform: `perspective(900px) rotateX(${(1 - Math.min(1, k)) * 80}deg)`, transformOrigin: "50% 0", background: "rgba(8,12,20,.9)", border: `3px solid ${col}`, borderRadius: 18, padding: "16px 34px", minWidth: 300, textAlign: "center", boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 30px ${col}44` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: COL.dim }}>{lab}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: col, lineHeight: 1.05, textShadow: `0 0 24px ${col}88` }}>{roll > 0 ? roll : roll}°C</div>
    </div>;
  };
  return <div style={{ position: "absolute", right: 110, top: 150, display: "flex", gap: 26, opacity: o }}>{box("ADENTRO", 4, COL.amber, 0)}{box("AFUERA", -3, COL.ice, 0.9)}</div>;
};

// NUEVO · EL COMENTARIO del vecino: tarjeta que se escribe palabra por palabra al ritmo de la voz
const Comment: React.FC<{ t: number; at: number; out: number; words: [number, string][] }> = ({ t, at, out, words }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", right: 90, top: 250, width: 900, perspective: 1400, opacity: o }}>
    <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -600}px) rotateY(${-12 + 3 * Math.sin(t * 0.7)}deg)`, background: "rgba(18,20,24,.95)", borderRadius: 26, padding: "30px 36px", boxShadow: "0 60px 110px rgba(0,0,0,.7)", fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#ffb257,#c2410c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 34 }}>R</div>
        <div><div style={{ color: "#fff", fontWeight: 800, fontSize: 28 }}>@vecino_del_frio</div><div style={{ color: "rgba(255,255,255,.5)", fontWeight: 700, fontSize: 22 }}>hace 2 días</div></div>
      </div>
      <div style={{ marginTop: 20, color: "#f1f1f1", fontWeight: 700, fontSize: 40, lineHeight: 1.3 }}>
        {words.map(([w, tx], i) => <span key={i} style={{ opacity: t >= w ? 1 : 0.0, color: /calor\?|helada/.test(tx) ? COL.amber : undefined }}>{tx} </span>)}
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 30, color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 26 }}><span>👍 {Math.round(1200 + 1900 * e(t, at, out))}</span><span>💬 RESPONDER</span></div>
    </div>
  </div>;
};

// NUEVO · el celular con "el video de la llamita" que se termina en negro
const FlamePhone: React.FC<{ t: number; at: number; end: number; out: number }> = ({ t, at, end, out }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const black = e(t, end, end + 0.15), prog = Math.min(1, (t - at) / (end - at));
  return <div style={{ position: "absolute", left: 1380, top: 540, perspective: 1400, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${-16 + (1 - Math.min(1, k)) * 50}deg) rotateZ(-3deg)`, width: 430, height: 800, borderRadius: 58, background: "linear-gradient(160deg,#2b2e33,#0c0d0f)", padding: 16, boxShadow: "0 60px 110px rgba(0,0,0,.75), inset 0 0 0 3px #4a4d52" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", position: "relative", background: "#000" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 30% at 50% ${62 - 4 * Math.sin(t * 9)}%, #ffd27a, #ff6a1f 40%, #3a0d04 75%, #000)`, opacity: 1 - black }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 8, background: "rgba(255,255,255,.25)" }}><div style={{ width: `${prog * 100}%`, height: "100%", background: "#ff2a1a" }} /></div>
        {black > 0.5 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "rgba(255,255,255,.7)", letterSpacing: 6 }}>¿Y AHORA?</div>}
      </div>
    </div>
  </div>;
};

// la descripción del video: el renglón 1 se ilumina (link a la guía)
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number; scale?: number }> = ({ t, at, out, x = 1180, scale = 0.86 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.7, at + 1.2), sweep = e(t, at + 0.7, at + 1.7);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: x, top: 640, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-12 + 4 * Math.sin(t * 0.8)}deg) scale(${scale})`, width: 1240, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>🔥 El Invierno Sin Gas: mis 5 manuales, paso a paso 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>tallerdeclaudio.vercel.app</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -560, top: -170, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string }> = ({ t, at, out, text, col = COL.amber }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 110, top: 110, opacity: o, transform: `scale(${Math.min(1.08, spr(t, at))})`, transformOrigin: "0 0", padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.92)", border: `3px solid ${col}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: col, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>{text}</div>;
};

// deslizamiento lateral con desenfoque (A sale, B entra)
const Slide: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number }> = ({ t, a, b, from, to, dir = 1 }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 40;
  return <>
    <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>
    {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
  </>;
};

const COMMENT: [number, string][] = [[57.14, "Claudio,"], [57.86, "quemo"], [58.06, "los"], [58.26, "ladrillos,"], [59.12, "la"], [59.28, "casa"], [59.54, "se"], [59.7, "calienta,"], [60.58, "pero"], [60.72, "a"], [60.82, "la"], [60.9, "mañana"], [61.3, "está"], [61.6, "helada"], [61.9, "otra"], [62.14, "vez."], [62.68, "¿Dónde"], [63.0, "se"], [63.24, "va"], [63.32, "el"], [63.4, "calor?"]];

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const sm = screenOf(t, PT.stoveMouth);

  // ===== 0-4,5 · avatar "son las tres de la mañana… te duele la nariz de frío" (vaho); portal por la boca de su estufa =====
  if (t < 4.6) {
    L.push(<Avatar key="av0" t={t} dark={0.12} />);
    L.push(<Vaho key="vh" t={t} a={0.6} b={4.4} />);
    L.push(<BigNum key="3am" t={t} at={0.55} text="3:00 AM" size={120} x={1500} y={190} out={4.1} col={COL.ice} edge="#0b2a44" />);
    const r = ei(t, 3.95, 4.45);
    if (r > 0) L.push(<Portal key="p0" x={AV_STOVE.x} y={AV_STOVE.y} r={r}><World t={Math.max(4.0, t)} /></Portal>);
  }
  // ===== 4,5-10,9 · la estufa apagada → la ventana: escarcha POR DENTRO (LTX) =====
  if (t >= 4.45 && t < 11.0) {
    L.push(<World key="w1" t={t} />);
    L.push(<Tag key="apg" t={t} at={5.3} x={sm.x} y={sm.y} dx={-220} dy={-160} text="SE APAGÓ" sub="HACE 2 HORAS" col={COL.ice} out={7.0} size={52} />);
    if (t >= 8.9) L.push(<AbsoluteFill key="esc" style={{ opacity: e(t, 8.9, 9.25) }}><Clip k="m1_escarcha" t={t} a={8.9}><World t={t} /></Clip></AbsoluteFill>);
    L.push(<Tag key="pdt" t={t} at={8.5} x={screenOf(t, PT.window).x} y={screenOf(t, PT.window).y} dx={260} dy={-120} text="ESCARCHA" sub="POR DENTRO" col={COL.ice2} out={10.6} size={56} />);
  }
  // ===== 10,9-15,4 · Claudio se tapa con otra manta (vaho de verdad) =====
  if (t >= 10.85 && t < 15.6) {
    const r = ei(t, 10.85, 11.3);
    L.push(<Portal key="pm" x={screenOf(10.9, PT.window).x} y={screenOf(10.9, PT.window).y} r={r}>
      <Shot k="img_manta" t={t} a={10.85} z={[1.05, 1.13]} />
      <Vaho t={t} a={11.2} b={15.0} x={560} y={300} />
      <Tag t={t} at={11.4} x={600} y={300} dx={260} dy={-80} text="VAPOR" sub="DENTRO DE TU CASA" col={COL.ice2} out={13.8} size={48} />
      <Stamp t={t} at={14.2} text="OTRA MANTA" x={1340} y={820} rot={-6} size={70} col={COL.amber} out={15.2} />
    </Portal>);
  }
  // ===== 15,4-19,4 · avatar "y no hay caso. El frío no viene de afuera" =====
  if (t >= 15.3 && t < 19.45) {
    L.push(<Slide key="sl1" t={t} a={15.37} b={15.72} from={<Shot k="img_manta" t={t} a={10.85} z={[1.05, 1.13]} />} to={<Avatar t={t} />} />);
    L.push(<Stamp key="nva" t={t} at={17.6} text="NO VIENE DE AFUERA" x={960} y={880} rot={-4} size={66} col={COL.ice} out={19.2} />);
  }
  // ===== 19,4-28,3 · el calor de las diez de la noche (LTX manos) se escapa por ventana, rendija y caño → el termómetro =====
  if (t >= 18.98 && t < 28.4) {
    const pr = ei(t, 18.98, 19.4);
    const body = <AbsoluteFill>
      {t < 23.4 ? <Clip k="m1_manos" t={t} a={19.0}><World t={t} /></Clip> : <World t={t} />}
      <Chip t={t} at={19.9} out={23.2} text="🕙 10 DE LA NOCHE" />
      {t >= 23.4 && <>
        <Tag t={t} at={23.9} x={screenOf(t, PT.window).x} y={screenOf(t, PT.window).y} dx={-160} dy={-140} text="LA VENTANA" col={COL.amber} out={26.1} size={44} />
        <Tag t={t} at={24.5} x={screenOf(t, PT.doorGap).x} y={screenOf(t, PT.doorGap).y} dx={-200} dy={-120} text="LA RENDIJA" col={COL.amber} out={26.1} size={44} />
        <Tag t={t} at={25.1} x={screenOf(t, PT.flueTop).x} y={screenOf(t, PT.flueTop).y} dx={160} dy={-40} text="EL CAÑO" col={COL.amber} out={26.1} size={44} />
      </>}
      <Flash t={t} at={23.42} col="#ffb257" peak={0.35} w={0.35} />
    </AbsoluteFill>;
    L.push(pr < 1 ? <Portal key="p2" x={AV_STOVE.x} y={AV_STOVE.y} r={pr}>{body}</Portal> : <React.Fragment key="p2">{body}</React.Fragment>);
    if (pr < 1) L.unshift(<Avatar key="av2u" t={t} />);
  }
  // ===== 28,3-33,0 · CUATRO GRADOS (LTX termómetro) / afuera -3 =====
  if (t >= 28.3 && t < 33.1) {
    L.push(<AbsoluteFill key="w4" style={{ opacity: 1 }}>{t < 30.7 ? <Clip k="m1_termo" t={t} a={28.3}><World t={t} /></Clip> : <World t={t} />}</AbsoluteFill>);
    L.push(<BigNum key="4g" t={t} at={28.36} text="4 °C" size={220} x={1460} y={470} out={30.5} col={COL.ice} edge="#0b2a44" sub="DENTRO DEL TALLER" />);
    L.push(<InOut key="io" t={t} at={30.75} out={32.9} />);
  }
  // ===== 33,0-38,2 · avatar "sin comprar una garrafa y sin cortar un solo leño más" =====
  if (t >= 33.0 && t < 38.2) {
    L.push(<Slide key="sl2" t={t} a={33.0} b={33.35} from={<World t={t} />} to={<Avatar t={t} />} dir={-1} />);
    L.push(<Stamp key="sg" t={t} at={34.6} text="SIN GARRAFA" x={560} y={780} rot={-8} size={74} out={38.0} />);
    L.push(<Stamp key="sl" t={t} at={36.3} text="SIN LEÑA" x={1400} y={820} rot={6} size={74} out={38.0} />);
  }
  // ===== 38,2-47,6 · hasta 20 (la meta en el termómetro gigante) → los 7 calores se encienden → "los tiras a la basura" =====
  if (t >= 37.85 && t < 47.7) {
    const z = ei(t, 37.85, 38.15);
    L.push(<AbsoluteFill key="w5" style={{ opacity: z }}><World t={t} /></AbsoluteFill>);
    if (z < 1) L.unshift(<AbsoluteFill key="av5" style={{ transform: `scale(${1 + z * 0.08})`, filter: `blur(${z * 14}px)` }}><Avatar t={t} /></AbsoluteFill>);
    const g = screenOf(t, PT.thermoAt(20));
    L.push(<Tag key="m20" t={t} at={39.0} x={g.x} y={g.y} dx={240} dy={-30} text="META: 20 °C" col="#ffd60a" out={41.4} size={60} />);
    L.push(<BigNum key="7c" t={t} at={40.06} text="7 CALORES" size={150} y={160} out={44.4} col={COL.amber} sub="QUE YA PAGASTE" />);
    for (let i = 0; i < 7; i++) { const q = screenOf(t, PT.bench(i + 1)); if (t > 40.3 + i * 0.42 && t < 44.5) L.push(<div key={"n" + i} style={{ position: "absolute", left: q.x - 40, top: q.y - 40, width: 80, height: 80, borderRadius: "50%", boxShadow: `0 0 0 4px ${COL.amber}`, opacity: 1 - e(t, 40.3 + i * 0.42, 41.2 + i * 0.42), transform: `scale(${1 + 1.5 * e(t, 40.3 + i * 0.42, 41.2 + i * 0.42)})` }} />); }
    L.push(<Stamp key="bas" t={t} at={45.4} text="A LA BASURA" x={960} y={860} rot={-5} size={70} out={47.4} />);
  }
  // ===== 47,6-50,4 · el video anterior: los ladrillos de papel (LTX brasa) =====
  if (t >= 47.55 && t < 50.5) {
    L.push(<Slide key="sl3" t={t} a={47.5} b={47.9} from={<World t={t} />} to={<Clip k="m1_brasa" t={t} a={47.6}><World t={t} /></Clip>} />);
    L.push(<Chip key="va" t={t} at={47.95} out={50.3} text="▶ EL VIDEO ANTERIOR: LADRILLOS DE PAPEL" />);
  }
  // ===== 50,4-54,25 · avatar "me escribieron miles" =====
  if (t >= 50.4 && t < 54.25) {
    const pr = ei(t, 50.4, 50.8);
    L.push(<Clip key="br2" t={t} a={47.6}><World t={t} /></Clip>);
    L.push(<Portal key="p6" x={960} y={540} r={pr}><Avatar t={t} /></Portal>);
    L.push(<BigNum key="mil" t={t} at={53.0} text="MILES" size={150} x={1480} y={250} out={54.2} col={COL.amber} sub="DE COMENTARIOS" />);
  }
  // ===== 54,25-64,7 · el comentario; el termómetro sube a 18 y vuelve a 4; ¿dónde se va el calor? =====
  if (t >= 53.9 && t < 64.75) {
    L.push(<Slide key="sl4" t={t} a={53.9} b={54.25} from={<Avatar t={t} />} to={<World t={t} />} />);
    L.push(<Comment key="cm" t={t} at={54.6} out={62.55} words={COMMENT} />);
    const q = screenOf(t, PT.thermoAt(ST_T(t)));
    if (t > 59.3 && t < 62.5) L.push(<Tag key="tv" t={t} at={59.4} x={q.x} y={q.y} dx={-230} dy={-40} text={`${Math.round(ST_T(t))} °C`} col={ST_T(t) > 10 ? COL.amber : COL.ice} out={62.3} size={66} />);
    L.push(<BigNum key="dsv" t={t} at={62.8} text="¿DÓNDE SE VA?" size={140} y={190} out={64.5} col={COL.amber} />);
  }
  // ===== 64,7-70,3 · avatar "hoy te muestro dónde se va, uno por uno" (entra por la boca de la estufa) =====
  if (t >= 64.68 && t < 70.3) {
    const pr = ei(t, 64.68, 65.1);
    L.push(<World key="w8" t={t} />);
    L.push(<Portal key="p8" x={sm.x} y={sm.y} r={pr}><Avatar t={t} /></Portal>);
    L.push(<Chip key="ch" t={t} at={68.9} out={70.2} text="🔧 CON CHATARRA DEL TALLER" />);
  }
  // ===== 70,3-76,4 · cada calor tiene su banco (travelling) → Claudio midiendo =====
  if (t >= 69.9 && t < 76.5) {
    L.push(<Slide key="sl5" t={t} a={69.9} b={70.25} from={<Avatar t={t} />} to={<World t={t} />} dir={-1} />);
    if (t >= 73.1) { const r = ei(t, 73.1, 73.55); L.push(<Portal key="pmd" x={1300} y={560} r={r}><Shot k="img_medir" t={t} a={73.1} z={[1.04, 1.12]} /><Tag t={t} at={75.3} x={1040} y={700} dx={-240} dy={-140} text="CON LAS MEDIDAS" col="#ffd60a" out={76.3} size={50} /></Portal>); }
  }
  // ===== 76,4-83,5 · "el termómetro grande no miente" → "si un invento no sube nada, te lo voy a decir" =====
  if (t >= 76.4 && t < 83.6) {
    L.push(<Slide key="sl6" t={t} a={76.35} b={76.75} from={<Shot k="img_medir" t={t} a={73.1} z={[1.04, 1.12]} />} to={<World t={t} />} />);
    L.push(<Stamp key="nm" t={t} at={77.9} text="NO MIENTE" x={1400} y={300} rot={7} size={84} col="#ffd60a" out={79.6} />);
    L.push(<BigNum key="0g" t={t} at={79.9} text="+0 °C" size={170} x={1450} y={560} out={81.7} col={COL.dim} sub="TE LO DIGO" />);
  }
  // ===== 83,5-87,0 · portal por la boca de la estufa → avatar "el único que te puede MATAR" =====
  if (t >= 83.52 && t < 86.65) {
    const pr = ei(t, 83.52, 83.95);
    L.push(<World key="w9" t={t} />);
    L.push(<Portal key="p9" x={sm.x} y={sm.y} r={pr}><Avatar t={t} /></Portal>);
    L.push(<Stamp key="pm" t={t} at={85.35} text="1 DE 7 PUEDE MATAR" x={960} y={860} rot={-4} size={72} out={86.9} />);
  }
  // ===== 87,0-92,6 · "esos videos que te muestran la llamita y se terminan" =====
  if (t >= 86.65 && t < 92.7) {
    L.push(<Slide key="sl7" t={t} a={86.65} b={87.0} from={<Avatar t={t} />} to={<World t={t} />} />);
    L.push(<FlamePhone key="fp" t={t} at={87.6} end={91.5} out={92.5} />);
  }
  // ===== 92,6-98,8 · CTA1: la guía sobre el banco; los 5 manuales; EL INVIERNO SIN GAS =====
  if (t >= 92.6 && t < 98.85) {
    L.push(<World key="wc" t={t} />);
    L.push(<Flash key="fc" t={t} at={92.62} col="#fff1cf" peak={0.45} w={0.4} />);
    L.push(<BigNum key="5m" t={t} at={97.3} text="5 MANUALES" size={120} y={170} out={98.7} col="#ffd60a" edge="#5a4500" />);
  }
  // ===== 98,8-101,7 · avatar "el invierno sin gas" =====
  if (t >= 98.78 && t < 101.75) {
    L.push(<Slide key="sl8" t={t} a={98.78} b={99.12} from={<World t={t} />} to={<Avatar t={t} />} dir={-1} />);
    L.push(<BigNum key="isg" t={t} at={99.3} text="EL INVIERNO SIN GAS" size={96} y={180} out={101.5} col="#ffd60a" edge="#5a4500" sub="MI GUÍA · 5 MANUALES" />);
  }
  // ===== 101,7-117,3 · el Manual 2 avanza, se abre en la pág. 55; resaltados; los ladrillitos se paran =====
  if (t >= 101.65 && t < 117.35) {
    const pr = ei(t, 101.6, 102.05);
    L.push(<AbsoluteFill key="bk"><Avatar t={t} /></AbsoluteFill>);
    L.push(<Portal key="pbk" x={AV_STOVE.x} y={AV_STOVE.y} r={pr}><World t={t} /></Portal>);
    L.push(<BigNum key="p55" t={t} at={104.6} text="PÁG. 55" size={100} x={1660} y={150} out={107.4} col="#ffd60a" edge="#5a4500" />);
    L.push(<Chip key="m2" t={t} at={102.3} out={104.4} text="MANUAL 2 · ESTUFAS DE CHATARRA" col="#2fb37a" />);
    L.push(<Chip key="c10" t={t} at={109.4} out={111.7} text="📏 10 CM DE LA CHAPA" col="#ff9a4a" />);
    L.push(<Chip key="cl" t={t} at={111.9} out={114.6} text="🧱 CUÁNTOS LADRILLOS" />);
    L.push(<Chip key="ca" t={t} at={114.9} out={117.2} text="↑ CÓMO APILARLOS (EL AIRE PASA)" col={COL.ice} />);
  }
  // ===== 117,3-119,1 · avatar + la descripción con el link =====
  if (t >= 117.15 && t < 118.8) {
    L.push(<Slide key="sl9" t={t} a={117.15} b={117.5} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<Desc key="ds" t={t} at={117.45} out={119.0} x={1160} scale={0.74} />);
  }
  // ===== 119,1-123,3 · "vamos al primer banco": la puerta (puesto 1) =====
  if (t >= 118.8) {
    L.push(<Slide key="sl10" t={t} a={118.8} b={119.12} from={<Avatar t={t} />} to={<World t={t} />} dir={-1} />);
    const d = screenOf(t, PT.door);
    L.push(<Tag key="b1" t={t} at={121.6} x={d.x} y={d.y} dx={-300} dy={-90} text="BANCO 1" sub="LAS RENDIJAS" col={COL.amber} size={56} />);
  }

  // el hielo del borde de pantalla: crece en el gancho, se va cuando aparece la guía
  L.push(<FrostEdge key="fe" t={t} amt={0.55 * (e(t, 4.6, 9.5)) * (1 - e(t, 26, 27.5)) + 0.4 * e(t, 28.3, 29) * (1 - e(t, 33, 33.4))} />);
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};

// temperatura del termómetro gigante en t (para los rótulos)
import { ST } from "./tl";
const ST_T = (t: number) => ST(t).temp;
