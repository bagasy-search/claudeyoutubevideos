// mecdesemp · MINUTO 1 (0 → fin de "soy Claudio"). Un solo hilo, sin cortes secos:
// avatar "son las 7, hace frío" → toma real: el parabrisas blanco por dentro → la cámara 3D ADENTRO del auto: no ves el capó,
// los limpias que no sirven → avatar → la mano deja una mancha de grasa → gira a la luneta: el de atrás toca bocina
// → vuelve al tablero: calefacción al máximo + recirculación + 5 MIN… 10 → avatar → agachado por el agujerito del tamaño
// de un plato → se zambulle al botón A/C → toma real del dedo → avatar "el del frío, en pleno invierno"
// → toma real: el vidrio se abre desde abajo → el tablero con EL ORDEN 1-5 (otro orden ✗) → se vuelve a empañar: 4 ERRORES
// → avatar → el trapo ✗ → la señal en el vidrio (película grasosa) "AL TALLER" → $$$ → Claudio en el auto → avatar + rótulo.
// Audio fuera de Remotion (voz + sonido real de las tomas se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, T, screenOf, camSpeed } from "./cabina3d";
import { at, atEnd } from "./at";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/mecdesemp30/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // tomas LTX ya bajadas (public/mecdesemp30/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = (AVAIL as { reelLen?: number }).reelLen ?? 249.0; // el reel termina → se congela el último cuadro (nunca negro)
// RunPod cortó el reel en ~600 s: la ventana que entra a medias se recorta, las que quedan afuera no se muestran (nunca cara congelada)
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win
  .map((w) => ({ ...w, me: Math.min(w.me, w.ms + REEL_LEN - 0.1 - w.off) })).filter((w) => w.me - w.ms >= 3);
export const MIN1_END = WIN[6].me; // fin de la ventana del avatar de "soy Claudio, 35 años de mecánico"
export const MIN1_FRAMES = s(MIN1_END + 0.6);

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

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

// toma real (LTX o cuadro clave) con empuje lento propio
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
// barrido entre dos capas (el avatar siempre nítido)
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// reloj de espera: la aguja da vueltas, "5 MIN" y después "10" (la gente esperando que la calefacción lo arregle)
const Espera: React.FC<{ t: number; at: number; at10: number; out: number; x: number; y: number }> = ({ t, at: a, at10, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sweep = ei(t, a + 0.05, a + 0.9) * 0.5 + ei(t, at10, at10 + 0.6) * 0.5, ang = sweep * 720 - 90;
  const n = t < at10 ? 5 : 10;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-18 + 6 * Math.sin(t)}deg) rotateX(8deg)`, display: "flex", alignItems: "center", gap: 30 }}>
        <svg width={260} height={290} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={128} y={0} width={44} height={34} rx={8} fill="#c9ced3" />
          <circle cx={150} cy={190} r={140} fill="#d9dde1" /><circle cx={150} cy={190} r={124} fill="#fbfbf8" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150 + 108 * Math.sin(i * 0.5236)} y1={190 - 108 * Math.cos(i * 0.5236)} x2={150 + 120 * Math.sin(i * 0.5236)} y2={190 - 120 * Math.cos(i * 0.5236)} stroke="#33404d" strokeWidth={i % 3 ? 3 : 7} />)}
          <line x1={150} y1={190} x2={150 + 100 * Math.cos((ang * Math.PI) / 180)} y2={190 + 100 * Math.sin((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={150} cy={190} r={12} fill="#222" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: COL.ink, textShadow: extrude(10, "#1c2a3a"), transform: `scale(${t > at10 && t < at10 + 0.3 ? 1.12 : 1})` }}>{n} MIN</div>
      </div>
    </div>
  );
};

// posiciones de los controles en la toma img_p_panel (1920×1080, sin zoom)
const PANEL_XY: Record<"ac" | "rec" | "temp" | "fan" | "mode", { x: number; y: number }> = { ac: { x: 814, y: 511 }, rec: { x: 1094, y: 511 }, fan: { x: 564, y: 799 }, mode: { x: 956, y: 799 }, temp: { x: 1363, y: 799 } };
// EL ORDEN: cada control del tablero recibe su número en el orden exacto (anclado al control en pantalla)
const Orden: React.FC<{ t: number; a: number; out: number; xAt: number }> = ({ t, a, out, xAt }) => {
  const items: { k: keyof typeof PANEL_XY; tx: string }[] = [{ k: "ac", tx: "A/C" }, { k: "rec", tx: "RECIRC. OFF" }, { k: "temp", tx: "CALOR" }, { k: "fan", tx: "VENTILADOR" }, { k: "mode", tx: "PARABRISAS" }];
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < a) return null;
  const sh = t > xAt ? Math.sin(t * 60) * 5 * (1 - e(t, xAt, xAt + 0.5)) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {items.map((it, i) => {
        const q = PANEL_XY[it.k], ai = a + i * 0.32, k = Math.min(1.12, spr(t, ai)), oi = e(t, ai, ai + 0.1);
        if (oi <= 0.01) return null;
        const up = i === 0 || i === 1;
        return (
          <div key={i} style={{ position: "absolute", left: q.x + sh, top: q.y + (up ? -120 : 120), transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * Math.min(1, k)})`, opacity: oi, textAlign: "center", fontFamily: FONT }}>
            <div style={{ width: 92, height: 92, margin: "0 auto", borderRadius: 46, background: "linear-gradient(180deg,#ffe28a,#f2b632)", color: "#3a2400", fontWeight: 900, fontSize: 64, lineHeight: "92px", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }}>{i + 1}</div>
            <div style={{ marginTop: 8, fontWeight: 900, fontSize: 30, color: COL.ink, letterSpacing: 2, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{it.tx}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  // el avatar real va en la capa de arriba (Full, por ventanas del reel); acá los "huecos" del avatar son el mundo 3D, anclados a la voz
  const A1 = WIN[1].ms, E1 = at("pasas la mano") - 0.1, A2 = at("se aclara un poquito") - 0.2, E2 = at("y sales igual") - 0.1;
  const A3 = at("si el del frio") - 0.2, E3 = at("hoy te explico") - 0.1, A4 = T.errores + 2.2, E4 = T.trapo - 0.6, A5 = WIN[6].ms;
  const t3 = at("cierras la puerta") - 0.15;
  const gv = <Shot k="g_vidrio" t={t} a={t3} z={[1.02, 1.16]} dur={10} />;

  // ===== A-C · avatar "son las 7, hace frío" → toma real: el parabrisas blanco por dentro, los limpias que no sirven =====
  if (t < A1 + 0.4) L.push(<Swipe key="swA" t={t} a={t3} b={t3 + 0.38} vert from={<World t={t} />} to={
    <Swipe t={t} a={A1} b={A1 + 0.36} dir={-1} from={gv} to={<World t={t} />} />} />);
  if (t >= t3 && t < A1) {
    L.push(<BigNum key="10s" t={t} at={at("en 10 segundos")} text="10 SEG" size={150} x={1480} y={230} out={at("se pone blanco") + 0.9} />);
    L.push(<Tag key="pd" t={t} at={at("por dentro")} x={960} y={420} dx={-260} dy={-170} text="POR DENTRO" col={COL.ice} out={T.capo + 1.2} size={58} />);
    L.push(<Tag key="lp" t={t} at={T.nosirve} x={980} y={300} dx={300} dy={-120} text="NO SIRVE DE NADA" col={COL.red} out={A1 - 0.1} size={52} />);
  }
  // ===== D · avatar "el problema está de este lado… pasas la mano y queda peor" =====
  if (t >= A1 + 0.36 && t < E1) L.push(<World key="avD" t={t} />);
  if (t >= A1 && t < E1) L.push(<Stamp key="ld" t={t} at={at("de tu lado")} text="DE TU LADO" x={1400} y={880} rot={-6} size={62} col={COL.amber} out={at("pasas la mano")} />);
  // ===== E · la maqueta: la mancha de grasa en el vidrio → el de atrás toca bocina → toma real: calefacción + recirculación + esperar =====
  if (t >= E1 && t < A2 + 0.4) {
    L.push(<Swipe key="swE" t={t} a={E1} b={E1 + 0.36} from={<World t={t} />} to={
      <Swipe t={t} a={T.casi} b={T.casi + 0.36} vert from={<Swipe t={t} a={T.atras} b={T.atras + 0.36} vert from={<Shot k="k_mancha" t={t} a={E1} z={[1.02, 1.1]} dur={5} />} to={<Shot k="k_bocina" t={t} a={T.atras} z={[1.04, 1.16]} dur={4} />} />} to={
        <Swipe t={t} a={A2} b={A2 + 0.36} dir={-1} from={<Shot k="m_calef" t={t} a={T.casi} z={[1.03, 1.14]} dur={8} />} to={<World t={t} />} />} />} />);
  }
  if (t >= E1 && t < T.casi) {
    L.push(<Tag key="mg" t={t} at={T.mancha + 0.4} x={760} y={330} dx={320} dy={-130} text="MANCHA DE GRASA" col="#ffd66b" out={T.atras} size={50} />);
    L.push(<Tag key="bc" t={t} at={T.bocina} x={1080} y={560} dx={-300} dy={-260} text="¡PIIII!" col={COL.ink} out={T.casi} size={76} />);
  }
  if (t >= T.casi && t < A2) {
    L.push(<Tag key="cm" t={t} at={T.calef + 0.3} x={1080} y={600} dx={260} dy={150} text="AL MÁXIMO" col={COL.red} out={A2 - 0.1} size={52} />);
    L.push(<Tag key="rc" t={t} at={T.recirc + 0.4} x={1040} y={370} dx={300} dy={-150} text="RECIRCULACIÓN" col={COL.amber} out={A2 - 0.1} size={48} />);
    L.push(<Espera key="es" t={t} at={T.esperar + 0.35} at10={at("10", T.esperar)} out={A2 - 0.15} x={520} y={250} />);
  }
  // ===== F · avatar "se aclara un poquito arriba y vuelve a cerrarse" =====
  if (t >= A2 + 0.36 && t < E2) L.push(<World key="avF" t={t} />);
  // ===== G · la maqueta desde adelante: el agujerito del tamaño de un plato → sube por el techo cortado y baja al botón =====
  const tb = at("es el boton del aire");
  if (t >= E2 && t < tb + 0.4) {
    L.push(<Swipe key="swG" t={t} a={E2} b={E2 + 0.36} vert from={<World t={t} />} to={
      <Swipe t={t} a={tb} b={tb + 0.36} from={<Swipe t={t} a={T.hay - 0.1} b={T.hay + 0.26} from={<Shot k="m_agujerito" t={t} a={E2} z={[1.02, 1.12]} dur={6} />} to={<Shot k="p_panel" t={t} a={T.hay} z={[1, 1]} dur={1} />} />} to={<Shot k="m_boton" t={t} a={tb} z={[1.12, 1.02]} dur={3} />} />} />);
    const h = { x: 1150, y: 210 }, b = PANEL_XY.ac;
    L.push(<Tag key="pl" t={t} at={T.plato} x={h.x} y={h.y} dx={-420} dy={120} text="DEL TAMAÑO DE UN PLATO" col={COL.ice} out={T.hay - 0.1} size={46} />);
    L.push(<Tag key="bt" t={t} at={at("en 30 segundos")} x={b.x} y={b.y} dx={-320} dy={-200} text="30 SEGUNDOS" col="#7dff9e" out={tb} size={58} />);
    L.push(<Tag key="ac" t={t} at={T.tablero + 0.3} x={b.x} y={b.y} dx={300} dy={170} text="ESTE BOTÓN" col={COL.ink} out={tb} size={50} />);
  }
  // ===== H · toma real: el dedo aprieta el A/C → avatar "sí, el del frío, en pleno invierno" =====
  if (t >= tb + 0.36 && t < A3 + 0.4) L.push(<Swipe key="swH" t={t} a={A3} b={A3 + 0.36} vert from={<Shot k="m_boton" t={t} a={tb} z={[1.12, 1.02]} dur={3} />} to={<World t={t} />} />);
  if (t >= tb && t < A3) L.push(<Tag key="aa" t={t} at={at("aire acondicionado") + 0.2} x={880} y={420} dx={-260} dy={-140} text="AIRE ACONDICIONADO" col={COL.ice} out={A3} size={52} />);
  if (t >= A3 + 0.36 && t < E3) L.push(<World key="avI" t={t} />);
  if (t >= A3 && t < E3 + 0.2) L.push(<Stamp key="inv" t={t} at={at("en pleno invierno")} text="EN PLENO INVIERNO" x={1380} y={860} rot={-6} size={64} col={COL.ice} out={E3 - 0.15} />);
  // ===== J · la toma plata: el vidrio se abre desde abajo → la maqueta: EL ORDEN 1-5 → se vuelve a empañar: 4 ERRORES =====
  const tW = T.orden - 0.9;
  if (t >= E3 && t < tW + 0.4) {
    L.push(<Swipe key="swJ" t={t} a={E3} b={E3 + 0.36} dir={-1} from={<World t={t} />} to={<Shot k="p_desemp" t={t} a={E3} z={[1.02, 1.1]} dur={4} />} />);
    L.push(<Tag key="pq" t={t} at={at("por que funciona") + 0.2} x={960} y={720} dx={-280} dy={120} text="SE ABRE DESDE ABAJO" col="#7dff9e" out={tW} size={46} />);
  }
  if (t >= tW && t < A4 + 0.4) {
    const k = ei(t, tW, tW + 0.4);
    if (k < 1) L.push(<Shot key="sJ" k="p_desemp" t={t} a={E3} z={[1.02, 1.1]} dur={4} />);
    L.push(<Portal key="pJ" x={960} y={620} r={k} ring={0.5}>
      <Swipe t={t} a={A4} b={A4 + 0.36} vert from={<Shot k="p_panel" t={t} a={tW} z={[1, 1]} dur={1} />} to={<World t={t} />} />
    </Portal>);
    L.push(<Orden key="or" t={t} a={T.orden + 0.1} out={T.errores - 0.3} xAt={atEnd("no sirve", T.otro) - 0.1} />);
    if (t < T.errores) L.push(<DrawX key="xo" t={t} at={atEnd("no sirve", T.otro) - 0.05} x={640} y={260} w={640} h={460} />);
    L.push(<BigNum key="4e" t={t} at={T.errores + 0.25} text="5 ERRORES" size={160} y={300} out={A4 - 0.3} col={COL.ink} edge="#1c2a3a" sub="TODAS LAS MAÑANAS" />);
  }
  // ===== K · avatar =====
  if (t >= A4 + 0.36 && t < E4) L.push(<World key="avK" t={t} />);
  // ===== L · el trapo ✗ → la señal en el vidrio (película grasosa) → AL TALLER → $$$ → Claudio en el auto =====
  const tC = atEnd("te puede costar") - 0.1;
  if (t >= E4 && t < tC + 0.4) {
    L.push(<Swipe key="swL" t={t} a={E4} b={E4 + 0.36} from={<World t={t} />} to={
      <Swipe t={t} a={T.senal - 0.1} b={T.senal + 0.26} vert from={<Shot k="n_calcetin_tablero" t={t} a={E4} z={[1.02, 1.12]} dur={8} />} to={
        <Swipe t={t} a={tC} b={tC + 0.36} from={<Shot k="k_pelicula" t={t} a={T.senal} z={[1.04, 1.16]} dur={9} />} to={<Shot k="c_tablero" t={t} a={tC} z={[1.04, 1.12]} dur={5} />} />} />} />);
    if (t < T.senal) {
      L.push(<div key="tr" style={{ position: "absolute", left: 820, top: 220, transform: "translate(-50%,-50%)", opacity: e(t, T.trapo + 0.1, T.trapo + 0.3), fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COL.ink, textShadow: extrude(8, "#000") }}>EL TRUCO DE LA NOCHE</div>);
    }
    L.push(<Tag key="sn" t={t} at={T.senal + 0.6} x={1180} y={330} dx={-330} dy={-150} text="UNA SEÑAL" sub="NO ES EL FRÍO" col="#ffd66b" out={T.taller - 0.1} size={56} />);
    L.push(<Stamp key="tl" t={t} at={T.taller + 0.2} text="AL TALLER · ESTA SEMANA" x={960} y={820} rot={-5} size={74} out={T.dinero - 0.2} />);
    L.push(<BigNum key="$$" t={t} at={T.dinero} text="$$$" size={230} y={420} col="#ffd60a" edge="#5a4500" sub="LA DEJO PARA EL FINAL" out={tC - 0.2} />);
  }
  // ===== M · Claudio en el auto ("ya me conoces") → avatar "soy Claudio, 35 años de mecánico" =====
  if (t >= tC + 0.4 && t < A5 + 0.4) L.push(<Swipe key="swM" t={t} a={A5} b={A5 + 0.36} from={<Shot k="c_tablero" t={t} a={tC} z={[1.04, 1.12]} dur={5} />} to={<World t={t} />} />);
  if (t >= A5 + 0.4) L.push(<World key="avM" t={t} />);
  if (t >= A5) L.push(<LowerThird key="lt" t={t} at={at("soy claudio")} out={MIN1_END + 2} name="CLAUDIO" l2="35 AÑOS DE MECÁNICO" l2at={at("35 anos")} />);

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};
void Vid; void Flash; void camSpeed; void PT; void screenOf; void World;
