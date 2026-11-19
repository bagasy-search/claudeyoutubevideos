// dom16 — serie «Le Devolví la Vida a…» de El Domador de Óxido. Restauración ASMR SIN voz, SIN música, sin avatar.
// Todo el metraje son clips Veo 3.1 (public/<slug>/v/cNNN.mp4, 1280x720) según edl.json, que escribe
// D:/rtmp/dom16/tools/edl.py: regla del creador 17-nov, cada clip Veo va ENTERO (7,5 de sus 8 s), en orden de paso y plano.
// Encima: rótulo de paso (ActChip del kit backfire), barra de progreso, cortina antes/después y cartel final.
// Sin audio: la mezcla (audio real de los mismos cortes) la arma un job nube y entra por encfin.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, Video, getInputProps, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ActChip } from "../backfire/ActChip";
import { F_BODY, F_NUM } from "../backfire/Stage";

export type Corte = { c: string; a: number; b: number; paso: number; f0: number; nf: number };
export type EdlSerie = {
  slug: string;
  fps: number;
  cortes: Corte[];
  framesCortes: number;
  pasos: Record<string, [string, string]>;
  pregunta: string;
  antes: string; // ruta en public/ (foto Nano Banana)
  despues: string;
  fondoFin: string;
  cierre: { c: string; a: number; b: number } | null; // plano en silencio entre la cortina y el cartel
};

export const CORTINA_S = 7;
export const CARTEL_S = 8;
const CHIP_S = 5;

export const totalFrames = (e: EdlSerie) => {
  const cierre = e.cierre ? Math.round((e.cierre.b - e.cierre.a) * e.fps) : 0;
  return e.framesCortes + CORTINA_S * e.fps + cierre + CARTEL_S * e.fps;
};

// Recorte anti-destello de Veo = crop=1186:667:0:26 sobre 1280x720 llevado a 1920x1080:
// escala 1920/1186 → el cuadro de 1280x720 mide 2072,2 x 1165,6 y se corre 26*1,619 = 42 px hacia arriba.
const K = 1920 / 1186;
const VEO: React.CSSProperties = { position: "absolute", left: 0, top: -26 * K, width: 1280 * K, height: 720 * K, objectFit: "fill" };
// Estrellita de marca de agua de Nano Banana (abajo a la derecha): scale(1.11) anclado a la izquierda.
const FOTO: React.CSSProperties = { width: 1920, height: 1080, objectFit: "cover", transform: "scale(1.11)", transformOrigin: "0% 50%" };

const REVISION = Boolean((getInputProps() as { revision?: boolean }).revision);

const Clip: React.FC<{ slug: string; c: string; a: number; fps: number }> = ({ slug, c, a, fps }) => {
  const V = REVISION ? Video : OffthreadVideo;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <V src={staticFile(`${slug}/v/${c}.mp4`)} startFrom={Math.round(a * fps)} muted style={VEO} />
    </AbsoluteFill>
  );
};

// Plano que Veo rechazó: foto fija Nano Banana con zoom lento (Ken Burns), sentido alternado por plano.
const FotoKB: React.FC<{ src: string; nf: number; k: number }> = ({ src, nf, k }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, nf], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = k % 2 ? 1.11 + 0.07 * (1 - t) : 1.11 + 0.07 * t;
  const x = (k % 3 === 0 ? -1 : 1) * 14 * t;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `translateX(${x}px) scale(${s})`, transformOrigin: "0% 50%" }} />
    </AbsoluteFill>
  );
};

const Foto: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...style }}>
    <Img src={staticFile(src)} style={FOTO} />
  </AbsoluteFill>
);

const Etiqueta: React.FC<{ txt: string; lado: "izq" | "der"; op: number }> = ({ txt, lado, op }) => (
  <div style={{ position: "absolute", top: 56, [lado === "izq" ? "left" : "right"]: 56, opacity: op, fontFamily: F_NUM,
    fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#fff", background: "rgba(10,10,10,.62)", padding: "8px 22px",
    borderBottom: `4px solid ${lado === "izq" ? "#b5531f" : "#d9dde2"}` }}>{txt}</div>
);

// Cortina: la foto del objeto podrido contra la del objeto terminado, mismo encuadre.
const Cortina: React.FC<{ e: EdlSerie }> = ({ e }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [24, 110, 140, 185], [100, 0, 0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t) });
  const op = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, CORTINA_S * e.fps], [1, 1.04]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Foto src={e.despues} />
        <Foto src={e.antes} style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: 4, marginLeft: -2, background: "#fff",
        boxShadow: "0 0 18px rgba(0,0,0,.6)", opacity: x > 0.5 && x < 99.5 ? 1 : 0 }} />
      <Etiqueta txt="ANTES" lado="izq" op={op * interpolate(x, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Etiqueta txt="DESPUÉS" lado="der" op={op * interpolate(x, [80, 92], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

const Campana: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

const Cartel: React.FC<{ e: EdlSerie }> = ({ e }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(f, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g = interpolate(f % 60, [0, 8, 16, 24], [0, -12, 10, 0], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, CARTEL_S * e.fps], [1, 1.05]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}><Foto src={e.fondoFin} /></AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(8,8,8,${0.62 * a})` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ opacity: a, transform: `translateY(${(1 - a) * 20}px)`, display: "flex", alignItems: "center", gap: 26,
          background: "#b3261e", padding: "22px 44px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
          <div style={{ transform: `rotate(${g}deg)`, transformOrigin: "50% 10%" }}><Campana s={64} /></div>
          <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 60, color: "#fff", letterSpacing: 1 }}>Suscríbete y activa la campanita</div>
        </div>
        <div style={{ opacity: b, transform: `translateY(${(1 - b) * 16}px)`, maxWidth: 1300, textAlign: "center", fontFamily: F_BODY,
          fontWeight: 700, fontSize: 50, lineHeight: 1.25, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.8)" }}>
          {e.pregunta}
        </div>
        <div style={{ opacity: b, fontFamily: F_BODY, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,.85)" }}>Cuéntalo en los comentarios</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Barra de progreso: 0 % al entrar el paso 1, 100 % al entrar el último paso (FINAL).
const Progreso: React.FC<{ p0: number; p1: number }> = ({ p0, p1 }) => {
  const f = useCurrentFrame() + p0;
  const p = interpolate(f, [p0, p1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = interpolate(f, [p0, p0 + 12, p1 + 90, p1 + 110], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 22, opacity: a }}>
      <div style={{ position: "absolute", right: 0, bottom: 12, fontFamily: F_NUM, fontWeight: 500, fontSize: 24, letterSpacing: 2,
        color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>RESTAURACIÓN {Math.floor(p)} %</div>
      <div style={{ height: 5, background: "rgba(255,255,255,.25)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: "linear-gradient(90deg,#b5531f,#e8e2d6)" }} />
      </div>
    </div>
  );
};

export const SerieMain: React.FC<{ e: EdlSerie }> = ({ e }) => {
  const fps = e.fps;
  const C = e.cortes;
  const chips = C.filter((c, i) => c.paso > 0 && (i === 0 || C[i - 1].paso !== c.paso) && e.pasos[String(c.paso)]);
  const ultimo = Math.max(...C.map((c) => c.paso));
  const p0 = C.find((c) => c.paso === 1)!.f0;
  const p1 = C.find((c) => c.paso === ultimo)!.f0;
  const cierreF = e.cierre ? Math.round((e.cierre.b - e.cierre.a) * fps) : 0;
  const fCortina = e.framesCortes, fCierre = fCortina + CORTINA_S * fps, fCartel = fCierre + cierreF;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {C.map((c, i) => (
        <Sequence key={i} from={c.f0} durationInFrames={c.nf} name={`${c.c}_${c.a}`}>
          {c.c.startsWith("f") ? <FotoKB src={`${e.slug}/v/${c.c}.png`} nf={c.nf} k={i} /> : <Clip slug={e.slug} c={c.c} a={c.a} fps={fps} />}
        </Sequence>
      ))}
      <Sequence from={fCortina} durationInFrames={CORTINA_S * fps} name="cortina"><Cortina e={e} /></Sequence>
      {e.cierre && (
        <Sequence from={fCierre} durationInFrames={cierreF} name="cierre"><Clip slug={e.slug} c={e.cierre.c} a={e.cierre.a} fps={fps} /></Sequence>
      )}
      <Sequence from={fCartel} durationInFrames={CARTEL_S * fps} name="cartel"><Cartel e={e} /></Sequence>
      {chips.map((c) => (
        <Sequence key={`chip${c.paso}`} from={c.f0} durationInFrames={CHIP_S * fps} name={`chip${c.paso}`}>
          <ActChip fileNo={e.pasos[String(c.paso)][0]} part={e.pasos[String(c.paso)][1]} durationInFrames={CHIP_S * fps} />
        </Sequence>
      ))}
      <Sequence from={p0} durationInFrames={p1 + 110 - p0} name="progreso"><Progreso p0={p0} p1={p1} /></Sequence>
    </AbsoluteFill>
  );
};
