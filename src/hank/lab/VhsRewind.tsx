// VhsRewind — overlay de transición "rebobinado VHS" (~1–1.5 s) que va ENCIMA de la escena (fondo transparente).
// Ruido de tracking, bandas de jitter horizontales, franjas de aberración cromática (rayas desplazadas rojo/cian,
// sin filtros pesados), OSD "◀◀ REW" + fecha + contador de cinta hacia atrás, y remata en un flash blanco breve.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, clamp, ease, rnd, lerp } from "../theme";

export type VhsRewindProps = { label?: string; date?: string; /** sólo para probar en el lab: foto debajo */ _testBg?: string };

const W = 1920, H = 1080;
const OSD: React.CSSProperties = {
  color: "#F4F4F4", fontFamily: SANS, fontWeight: 600, letterSpacing: "0.08em",
  textShadow: "-3px 0 0 rgba(255,40,80,0.75), 3px 0 0 rgba(40,220,255,0.7), 0 0 14px rgba(255,255,255,0.35), 0 2px 0 rgba(0,0,0,0.5)",
};

export const VhsRewind: React.FC<VhsRewindProps> = ({ label = "◀◀ REW", date, _testBg }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  // envolvente: entra en 4 cuadros, pico sostenido, flash blanco en los últimos ~6
  const inA = ease(f / 4);
  const flashStart = D - 7;
  const fl = f < flashStart ? 0 : f < D - 2 ? ease((f - flashStart) / 5) : 0.55;
  const I = inA; // intensidad del ruido
  const q = Math.floor(f); // semilla por cuadro
  const R = (k: number) => rnd(q * 17.31 + k * 3.77);

  // banda de tracking: sube rodando de abajo hacia arriba (2 pasadas)
  const trackY = H - ((f / Math.max(1, D) * 2 * (H + 260)) % (H + 260)) ;
  const trackH = 150 + Math.sin(f / 2) * 30;

  // bandas de jitter / aberración (4–6 por cuadro)
  const nb = 4 + Math.floor(R(1) * 3);
  const bands = Array.from({ length: nb }).map((_, i) => {
    const y = R(10 + i) * H;
    const h = 8 + R(20 + i) * 70;
    const off = (R(30 + i) - 0.5) * 60;
    return { y, h, off };
  });
  // líneas de ruido finas
  const lines = Array.from({ length: 40 }).map((_, i) => {
    const inTrack = i < 22;
    const y = inTrack ? trackY - trackH / 2 + R(50 + i) * trackH : R(50 + i) * H;
    const x = R(80 + i) * W * 0.8 - 100;
    const w = 60 + R(110 + i) * (inTrack ? 900 : 380);
    const a = (inTrack ? 0.45 : 0.25) + R(140 + i) * 0.5;
    return { y, x, w, a, h: 1 + Math.floor(R(170 + i) * 3) };
  });

  // contador de cinta hacia atrás (decorativo, no es un dato)
  const secs = Math.max(0, 5000 - f * 97);
  const counter = `${Math.floor(secs / 3600)}:${String(Math.floor(secs / 60) % 60).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const jx = (R(200) - 0.5) * 6; // micro sacudón horizontal del OSD

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {_testBg ? (
        <AbsoluteFill>
          <Img src={staticFile(_testBg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}

      {/* tinte leve de cinta: levanta negros y enfría (liviano: la escena se tiene que leer) */}
      <AbsoluteFill style={{ opacity: I, background: "rgba(40,20,70,0.10)", mixBlendMode: "screen" }} />
      {/* scanlines */}
      <AbsoluteFill style={{ opacity: 0.55 * I, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)" }} />

      {/* banda de tracking: sombra + resplandor + nieve (grano quemado recortado a la banda) */}
      <div style={{ position: "absolute", left: 0, top: trackY - trackH, width: W, height: trackH * 2, opacity: I,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 30%, rgba(230,230,255,0.18) 50%, rgba(0,0,0,0.35) 66%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: trackY - trackH * 0.45, width: W, height: trackH * 0.9, overflow: "hidden", opacity: 0.75 * I, mixBlendMode: "screen",
        WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0), #000 35%, #000 65%, rgba(0,0,0,0))", maskImage: "linear-gradient(180deg, rgba(0,0,0,0), #000 35%, #000 65%, rgba(0,0,0,0))" }}>
        <Img src={staticFile(`yc/grain/g${(f * 3) % 8}.png`)} style={{ position: "absolute", left: 0, top: -R(400) * 600, width: W, height: H, objectFit: "cover",
          transform: "scaleY(0.25)", transformOrigin: "top", filter: "grayscale(1) contrast(3.2) brightness(1.3)" }} />
      </div>

      {/* bandas de jitter: la franja se "corre": bloque con textura estirada, borde duro, y flecos R/C en los cantos */}
      <AbsoluteFill style={{ opacity: I }}>
        {bands.map((b, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 0, top: b.y, width: W, height: b.h, mixBlendMode: "overlay",
              background: `repeating-linear-gradient(90deg, rgba(255,255,255,${0.10 + R(500 + i) * 0.15}) 0px, rgba(0,0,0,0.12) ${7 + R(510 + i) * 30}px, rgba(255,255,255,0.06) ${40 + R(520 + i) * 90}px)` }} />
            <div style={{ position: "absolute", left: b.off > 0 ? 0 : W + b.off * 2.5, top: b.y, width: Math.abs(b.off) * 2.5, height: b.h, background: "rgba(0,0,0,0.6)" }} />
          </React.Fragment>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: I }}>
        {bands.map((b, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: R(600 + i) * W * 0.5 + b.off, top: b.y - 2, width: W * (0.3 + R(610 + i) * 0.6), height: 2, background: "linear-gradient(90deg, rgba(255,40,90,0), rgba(255,40,90,0.6) 20%, rgba(255,40,90,0.6) 80%, rgba(255,40,90,0))" }} />
            <div style={{ position: "absolute", left: R(620 + i) * W * 0.5 - b.off, top: b.y + b.h - 1, width: W * (0.3 + R(630 + i) * 0.6), height: 2, background: "linear-gradient(90deg, rgba(30,220,255,0), rgba(30,220,255,0.55) 20%, rgba(30,220,255,0.55) 80%, rgba(30,220,255,0))" }} />
            <div style={{ position: "absolute", left: b.off + 14, top: b.y, width: W, height: b.h, background: "linear-gradient(180deg, rgba(255,40,90,0.14), rgba(255,40,90,0) 40%, rgba(30,220,255,0) 60%, rgba(30,220,255,0.14))" }} />
            <div style={{ position: "absolute", left: 0, top: b.y, width: W, height: 1, background: "rgba(255,255,255,0.6)" }} />
          </React.Fragment>
        ))}
      </AbsoluteFill>

      {/* aberración en los bordes del cuadro */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.8 * I,
        background: "linear-gradient(90deg, rgba(20,210,255,0.22) 0px, rgba(20,210,255,0) 90px, rgba(0,0,0,0) calc(100% - 90px), rgba(255,30,70,0.22) 100%)" }} />

      {/* líneas de ruido */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: I }}>
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h, opacity: l.a,
            background: "linear-gradient(90deg, rgba(255,255,255,0), #fff 15%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0))" }} />
        ))}
      </AbsoluteFill>

      {/* ruido de conmutación de cabezas: franja inferior */}
      <div style={{ position: "absolute", left: -20 + (R(300) - 0.5) * 40, top: H - 26, width: W + 40, height: 26, opacity: 0.85 * I, mixBlendMode: "screen",
        background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.05) ${3 + Math.floor(R(301) * 6)}px, rgba(255,255,255,0.35) ${9 + Math.floor(R(302) * 10)}px)` }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.35 * I }}>
        <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* OSD */}
      <div style={{ ...OSD, position: "absolute", left: 110 + jx, top: 86, fontSize: 70, opacity: inA * (Math.floor(f / 8) % 4 === 3 ? 0.75 : 1) }}>{label}</div>
      {date ? (
        <div style={{ ...OSD, position: "absolute", left: 110 + jx * 0.6, bottom: 96, fontSize: 52, fontFamily: MONO, fontWeight: 700, letterSpacing: "0.04em", opacity: inA }}>{date}</div>
      ) : null}
      <div style={{ ...OSD, position: "absolute", right: 110 - jx * 0.6, top: 96, fontSize: 44, fontFamily: MONO, fontWeight: 700, letterSpacing: "0.05em", opacity: inA * 0.95 }}>
        {counter}
      </div>

      {/* flash blanco final (con un toque de sobreexposición azulada) */}
      <AbsoluteFill style={{ background: `rgba(${Math.round(lerp(220, 255, fl))},${Math.round(lerp(235, 255, fl))},255,1)`, opacity: clamp(fl) * 0.95 }} />
    </AbsoluteFill>
  );
};
