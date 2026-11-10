// Escenas inventadas sobre las fotos reales de ingrid01 (skill edicion-sobre-fotos). Ideas: D:/rtmp/ingrid01/ideas.md
// Solo React + Remotion. Fotos a 1920x1080 con objectFit 'fill' para que las coordenadas sean exactas.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// ───────── Escena 1 · el ropero entero baja de la barra de bronce como un estor (g002)
// barra: de (0,45) a (1600,165); a la derecha de 1600 sigue la pared
const railY = (x: number) => 45 + (165 - 45) * Math.min(x, 1600) / 1600;
const Riel: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const src = staticFile("ingrid01/g/g002.png");
  const p = Math.min(1, spring({ frame: f - 2, fps: 30, config: { damping: 15, mass: 1.1, stiffness: 70 } }));
  const drop = (1 - p) * 1080;
  // temblor del borde al llegar abajo (se apaga en ~0,6 s)
  const land = f > 20 ? Math.sin((f - 20) / 2.2) * 5 * Math.max(0, 1 - (f - 20) / 18) : 0;
  // cámara: después de bajar, empuje lento hacia las perchas (nunca < 1 → sin bordes vacíos)
  const z = interpolate(f, [28, dur], [1, 1.07], CL);
  const top = `polygon(0px 0px, 1920px 0px, 1920px ${railY(1920) + 26}px, 0px ${railY(0) + 26}px)`;
  const below = `polygon(0px ${railY(0) + 22}px, 1920px ${railY(1920) + 22}px, 1920px 1080px, 0px 1080px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E6E4E0" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "960px 320px" }}>
        {/* pared lisa de fondo (mismo tono que la pared de la foto) */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #EDEBE7 0%, #E3E1DC 100%)" }} />
        {/* la barra y la pared de arriba: siempre en su lugar */}
        <AbsoluteFill style={{ clipPath: top }}><Img src={src} style={FULL} /></AbsoluteFill>
        {/* el estor: la foto baja pegada a su borde inferior */}
        <AbsoluteFill style={{ clipPath: below, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-drop + land}px)` }}>
            <Img src={src} style={FULL} />
            {/* sombra del borde que va bajando */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -26, height: 26, background: "linear-gradient(180deg, rgba(40,32,24,0.35), rgba(40,32,24,0))", opacity: 1 - p * 0.9 }} />
          </div>
        </AbsoluteFill>
        {/* sombra de la barra sobre la tela que sale del rollo */}
        <AbsoluteFill style={{ clipPath: below, background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 9%)", opacity: interpolate(f, [2, 30], [1, 0.25], CL) }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── Escena 2 · cada cosa que nombra del paisaje se hila en la madeja del mismo tono (g028 → g031)
// columnas de g031 alineadas con las madejas; orden de las palabras: nieve, piedra, agua, árboles
const COLS: [number, number][] = [[0, 560], [940, 1350], [1350, 1920], [560, 940]];
const Ventana: React.FC<{ marks: number[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.06], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#20262E" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "960px 520px" }}>
        <Img src={staticFile("ingrid01/g/g028.png")} style={FULL} />
      </AbsoluteFill>
      {COLS.map(([x0, x1], i) => {
        const m = marks[i] ?? 9999;
        if (f < m) return null;
        const k = interpolate(f, [m, m + 26], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
        const edge = k * 112 - 6; // borde de fibra: degradé de 6 % que baja de arriba a abajo
        const mask = `linear-gradient(180deg, #000 0%, #000 ${edge}%, transparent ${edge + 6}%)`;
        const twist = (1 - k) * -36;
        return (
          <div key={i} style={{ position: "absolute", left: x0, top: 0, width: x1 - x0, height: 1080, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>
            <div style={{ position: "absolute", left: -x0, top: 0, width: 1920, height: 1080, transform: `translateY(${twist}px)` }}>
              <Img src={staticFile("ingrid01/g/g031.png")} style={FULL} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── Escena 3 · las casillas de cada prenda ruedan como rodillos y forman conjuntos nuevos (g094)
type Cell = { x: number; y: number; w: number; h: number };
const TOP: Cell[] = [[40, 495], [495, 860], [860, 1225], [1225, 1565], [1565, 1900]].map(([a, b]) => ({ x: a, y: 20, w: b - a, h: 475 }));
const BOT: Cell[] = [[60, 380], [380, 680], [680, 995], [995, 1370], [1370, 1690], [1690, 1910]].map(([a, b]) => ({ x: a, y: 495, w: b - a, h: 570 }));
// paradas: [desde, hasta, f0, f1]; la última vuelve a un múltiplo de N = orden original
const SEG_TOP: [number, number, number, number][] = [[0, 6, 6, 38], [6, 13, 52, 80], [13, 20, 92, 118]];
const SEG_BOT: [number, number, number, number][] = [[0, 8, 8, 40], [8, 15, 54, 82], [15, 24, 94, 120]];
const reel = (f: number, seg: [number, number, number, number][]) => {
  let o = 0;
  for (const [a, b, f0, f1] of seg) if (f >= f0) o = interpolate(f, [f0, f1], [a, b], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return o;
};
const Tile: React.FC<{ from: Cell; into: Cell; y: number; blur: number }> = ({ from, into, y, blur }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: into.w, height: into.h, overflow: "hidden" }}>
    <Img src={staticFile("ingrid01/g/g094.png")} style={{ ...FULL, left: -from.x + (into.w - from.w) / 2, top: -from.y, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }} />
  </div>
);
const Row: React.FC<{ cells: Cell[]; seg: [number, number, number, number][]; dir: 1 | -1 }> = ({ cells, seg, dir }) => {
  const f = useCurrentFrame();
  const N = cells.length;
  return (
    <>
      {cells.map((c, i) => {
        const fi = f - i * 2; // escalonado: cada rodillo arranca 2 cuadros después del anterior
        const o = reel(fi, seg);
        const v = Math.abs(reel(fi + 1, seg) - o) * c.h; // velocidad en px/cuadro
        const k0 = Math.floor(o), fr = o - k0;
        const g = (k: number) => cells[(((i + dir * k) % N) + N) % N];
        return (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h, overflow: "hidden" }}>
            <Tile from={g(k0)} into={c} y={-dir * fr * c.h} blur={Math.min(7, v / 18)} />
            {fr > 0.001 && <Tile from={g(k0 + 1)} into={c} y={dir * (1 - fr) * c.h} blur={Math.min(7, v / 18)} />}
          </div>
        );
      })}
    </>
  );
};
const Combos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.03], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#D9CDB8" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "960px 540px" }}>
        <Img src={staticFile("ingrid01/g/g094.png")} style={FULL} />
        <Row cells={TOP} seg={SEG_TOP} dir={1} />
        <Row cells={BOT} seg={SEG_BOT} dir={-1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Escena: React.FC<{ id: string; marks?: number[]; dur: number }> = ({ id, marks = [], dur }) => {
  if (id === "riel") return <Riel dur={dur} />;
  if (id === "ventana") return <Ventana marks={marks} dur={dur} />;
  if (id === "combos") return <Combos dur={dur} />;
  return null;
};
