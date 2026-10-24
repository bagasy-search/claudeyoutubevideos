// t30domes — El Domador de Óxido: restauración ASMR sin voz sobre metraje CC BY (Restoration and Repair).
// Base = cortes de la fuente (edl.json, lo escribe D:/rtmp_t30domes/tools/edl_gen.py) con zoom fijo 120 % anclado
// abajo-derecha (saca el logo de arriba-izq y las bandas negras). Encima: rótulo de paso (ActChip del kit backfire),
// barra de progreso fina, crédito CC BY, cortina antes/después y cartel final. Sin audio: la mezcla va por encfin.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, Video, getInputProps, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ActChip } from "../backfire/ActChip";
import { F_BODY, F_NUM } from "../backfire/Stage";
import EDL from "./edl.json";

type Corte = { in: number; out: number; v: number; paso: number; sfx: string; f0: number; nf: number };
const FPS = 30;
const CORTES = EDL.cortes as Corte[];
const F_CORTES = EDL.framesCortes as number;
export const CORTINA_F = 7 * FPS;
export const CIERRE = { in: 840.0, out: 848.0 };
export const CIERRE_F = Math.round((CIERRE.out - CIERRE.in) * FPS);
export const CARTEL_F = 8 * FPS;
export const TOTAL_FRAMES_T30DOMES = F_CORTES + CORTINA_F + CIERRE_F + CARTEL_F;

const PASOS: Record<number, [string, string]> = {
  1: ["PASO 01", "Desarmar el mango viejo"],
  2: ["PASO 02", "Baño de vinagre"],
  3: ["PASO 03", "Quitar el óxido"],
  4: ["PASO 04", "Desbaste con amoladora"],
  5: ["PASO 05", "Rehacer el filo con lima"],
  6: ["PASO 06", "Lijar y pulir la hoja"],
  7: ["PASO 07", "Cachas de arpillera y epoxi"],
  8: ["PASO 08", "Forros de cobre y pegado"],
  9: ["PASO 09", "Dar forma al mango"],
  10: ["PASO 10", "Aceite y filo final"],
  11: ["FINAL", "El resultado"],
};
const CHIP_F = 5 * FPS;
const SRC = staticFile("t30domes/srcv.mp4");

// Zoom 120 % anclado a la derecha y al borde inferior de la zona útil (y=688 de 720 → 1032 px en 1080).
// Ventana visible de la fuente: x 213-1280, y 88-688 → sin logo (x<145) y sin bandas (y<32, y>688).
const ZOOM: React.CSSProperties = { transform: "scale(1.2)", transformOrigin: "1920px 792px" };

// Stills locales de control: inputProps {revision:true} usa <Video> (el compositor local se cuelga con la máquina cargada).
const REVISION = Boolean((getInputProps() as { revision?: boolean }).revision);
const Plano: React.FC<{ c: Corte }> = ({ c }) => {
  const V = REVISION ? Video : OffthreadVideo;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={ZOOM}>
        <V src={SRC} startFrom={Math.round(c.in * FPS)} playbackRate={c.v} muted
          style={{ width: 1920, height: 1080, objectFit: "fill" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Foto: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...style }}>
    <AbsoluteFill style={ZOOM}>
      <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Etiqueta: React.FC<{ txt: string; lado: "izq" | "der"; op: number }> = ({ txt, lado, op }) => (
  <div style={{ position: "absolute", top: 56, [lado === "izq" ? "left" : "right"]: 56, opacity: op, fontFamily: F_NUM,
    fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "#fff", background: "rgba(10,10,10,.62)", padding: "8px 22px",
    borderBottom: `4px solid ${lado === "izq" ? "#b5531f" : "#d9dde2"}` }}>{txt}</div>
);

// Cortina: el primer cuadro podrido contra el último brillante (mismo encuadre de la fuente: 13:34,5 / 13:37,6).
const Cortina: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [24, 110, 140, 185], [100, 0, 0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t) });
  const op = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Foto src="t30domes/despues.jpg" />
      <Foto src="t30domes/antes.jpg" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }} />
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

const Cartel: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(f, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g = interpolate(f % 60, [0, 8, 16, 24], [0, -12, 10, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Foto src="t30domes/fondo_fin.jpg" />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${0.62 * a})` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ opacity: a, transform: `translateY(${(1 - a) * 20}px)`, display: "flex", alignItems: "center", gap: 26,
          background: "#b3261e", padding: "22px 44px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
          <div style={{ transform: `rotate(${g}deg)`, transformOrigin: "50% 10%" }}><Campana s={64} /></div>
          <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 60, color: "#fff", letterSpacing: 1 }}>Suscríbete y activa la campanita</div>
        </div>
        <div style={{ opacity: b, transform: `translateY(${(1 - b) * 16}px)`, maxWidth: 1300, textAlign: "center", fontFamily: F_BODY,
          fontWeight: 700, fontSize: 50, lineHeight: 1.25, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.8)" }}>
          ¿Qué herramienta vieja tienes guardada esperando una segunda vida?
        </div>
        <div style={{ opacity: b, fontFamily: F_BODY, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,.85)" }}>Cuéntalo en los comentarios</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Credito: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 40, bottom: 34, opacity: a, fontFamily: F_BODY, fontWeight: 500, fontSize: 26,
      color: "#fff", background: "rgba(0,0,0,.55)", padding: "7px 16px", borderRadius: 4 }}>
      Metraje original: Restoration and Repair · CC BY
    </div>
  );
};

// Barra de progreso de la restauración: 0 % al entrar el paso 1, 100 % al entrar la revelación.
const P0 = CORTES.find((c) => c.paso === 1)!.f0;
const P1 = CORTES.find((c) => c.paso === 11)!.f0;
const Progreso: React.FC = () => {
  const f = useCurrentFrame() + P0;
  const p = interpolate(f, [P0, P1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = interpolate(f, [P0, P0 + 12, P1 + 90, P1 + 110], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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

export const MainT30domes: React.FC = () => {
  const chips = CORTES.filter((c, i) => c.paso > 0 && (i === 0 || CORTES[i - 1].paso !== c.paso));
  const fCortina = F_CORTES, fCierre = F_CORTES + CORTINA_F, fCartel = fCierre + CIERRE_F;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {CORTES.map((c, i) => (
        <Sequence key={i} from={c.f0} durationInFrames={c.nf} name={`p${i}_${c.in}`}><Plano c={c} /></Sequence>
      ))}
      <Sequence from={fCortina} durationInFrames={CORTINA_F} name="cortina"><Cortina /></Sequence>
      <Sequence from={fCierre} durationInFrames={CIERRE_F} name="cierre">
        <Plano c={{ in: CIERRE.in, out: CIERRE.out, v: 1, paso: 12, sfx: "", f0: 0, nf: CIERRE_F }} />
      </Sequence>
      <Sequence from={fCartel} durationInFrames={CARTEL_F} name="cartel"><Cartel /></Sequence>
      {chips.map((c) => (
        <Sequence key={`chip${c.paso}`} from={c.f0} durationInFrames={CHIP_F} name={`chip${c.paso}`}>
          <ActChip fileNo={PASOS[c.paso][0]} part={PASOS[c.paso][1]} durationInFrames={CHIP_F} />
        </Sequence>
      ))}
      <Sequence from={P0} durationInFrames={P1 + 110 - P0} name="progreso"><Progreso /></Sequence>
      <Sequence from={0} durationInFrames={6 * FPS} name="credito_ini"><Credito dur={6 * FPS} /></Sequence>
      <Sequence from={TOTAL_FRAMES_T30DOMES - 10 * FPS} durationInFrames={10 * FPS} name="credito_fin"><Credito dur={10 * FPS} /></Sequence>
    </AbsoluteFill>
  );
};
