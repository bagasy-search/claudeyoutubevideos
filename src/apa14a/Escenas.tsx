// Escenas apa14a · The Homemade Bait Station — cuatro escenas hechas con las fotos reales (ver D:/rtmp/apa14a/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`apa14a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// cámara que pone (cx,cy) en el centro sin dejar bordes vacíos
const cam = (s: number, cx: number, cy: number) => {
  const tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - cx * s)), ty = Math.min(0, Math.max(1080 - 1080 * s, 540 - cy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

// 1 · Una huella real se despega del piso, se endereza hacia la cámara y crece; en "five" cambia a la de atrás; en "tail" se acuesta y la cámara sigue la raya de la cola.
const PRINTS: [number, number][] = [[1220, 780], [1480, 860]];
export const Tracks: React.FC<{ dur: number; fFive: number; fTail: number }> = ({ dur, fFive, fTail }) => {
  const f = useCurrentFrame();
  const lift = (a: number, b: number) => interpolate(f, [a, a + 22, b, b + 14], [0, 1, 1, 0], { ...CL, easing: EASE });
  const l1 = lift(14, fFive), l2 = lift(fFive + 6, fTail);
  const pan = interpolate(f, [fTail + 10, dur], [0, 1], { ...CL, easing: EASE });
  const base = cam(1 + 0.25 * pan, 980 + 720 * pan, 665 + 295 * pan);
  const dim = 1 - 0.35 * Math.max(l1, l2);
  const card = (p: [number, number], l: number) => l <= 0 ? null : (
    <div style={{ ...BOX, overflow: "visible", perspective: 1400, perspectiveOrigin: `${p[0]}px ${p[1]}px` }}>
      <div style={{ ...BOX, overflow: "visible", transformOrigin: `${p[0]}px ${p[1]}px`, transform: `translate(${(960 - p[0]) * l}px, ${(520 - p[1]) * l}px) rotateX(${62 * (1 - l)}deg) scale(${1 + 1.5 * l})`, filter: `drop-shadow(0 18px 24px rgba(0,0,0,${0.5 * l}))` }}>
        <div style={{ ...BOX, clipPath: `circle(105px at ${p[0]}px ${p[1]}px)`, filter: `contrast(${1 + 0.45 * l}) brightness(${1 - 0.12 * l})` }}>
          <Img src={S("e_tracks")} style={FULL} />
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#22262a", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: base, transformOrigin: "0 0" }}>
        <Img src={S("e_tracks")} style={{ ...FULL, filter: `brightness(${dim})` }} />
      </div>
      {card(PRINTS[0], l1)}
      {card(PRINTS[1], l2)}
    </AbsoluteFill>
  );
};

// 2 · El codo real de la izquierda gira sobre el eje del caño: en "Not" se da vuelta con la boca hacia arriba y vuelve con rebote a apuntar al piso.
const ELBOW = poly([[250, 425], [300, 418], [345, 425], [380, 440], [382, 500], [370, 540], [360, 590], [330, 606], [280, 606], [250, 590], [246, 520]]);
export const Station: React.FC<{ dur: number; fDown: number; fNot: number }> = ({ dur, fDown, fNot }) => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const back = Math.min(fNot + 18, dur - 16); // la vuelta tiene que terminar ANTES del corte (la escena dura poco después de "Not up")
  const flip = interpolate(f, [fNot, fNot + 10], [0, 180], { ...CL, easing: EASE }) - interpolate(f, [back, back + 13], [0, 180], { ...CL, easing: Easing.out(Easing.back(1.4)) });
  const moving = Math.abs(flip) > 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a2620", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: cam(1 + 0.4 * push, 560, 470), transformOrigin: "0 0" }}>
        <Img src={S("e_station")} style={FULL} />
        {moving && (
          <div style={{ ...BOX, WebkitMaskImage: "radial-gradient(ellipse 95px 125px at 312px 512px, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 95px 125px at 312px 512px, #000 62%, transparent 100%)" }}>
            <Img src={S("e_station")} style={{ ...FULL, transform: "translate(130px, -17px)" }} />
          </div>
        )}
        <div style={{ ...BOX, overflow: "visible", perspective: 1200, perspectiveOrigin: "312px 470px" }}>
          <div style={{ ...BOX, overflow: "visible", transformOrigin: "312px 470px", transform: `rotateX(${flip}deg)` }}>
            <div style={{ ...BOX, clipPath: ELBOW }}>
              <Img src={S("e_station")} style={FULL} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · La tabla real gira sobre su borde de abajo como una tapa: arriba hacia la cámara en "row", al revés en "two", plana en "nothing".
const BOARD = poly([[265, 35], [1450, 35], [1446, 875], [262, 880]]);
export const Board: React.FC<{ dur: number; fRow: number; fTwo: number; fNothing: number }> = ({ dur, fRow, fTwo, fNothing }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [fRow - 6, fRow + 14, fTwo - 4, fTwo + 18, fNothing - 2, fNothing + 16], [0, -36, -30, 30, 26, 0], { ...CL, easing: EASE });
  const lifted = Math.min(1, Math.abs(a) / 20);
  const end = interpolate(f, [fNothing, dur], [0, 1], { ...CL, easing: EASE });
  return (
    <AbsoluteFill style={{ backgroundColor: "#1f1a15", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: cam(1.04 + 0.04 * Math.sin(f / 40) + 0.45 * end, 857 + 30 * Math.sin(f / 55), 700), transformOrigin: "0 0" }}>
        <Img src={S("e_board")} style={{ ...FULL, filter: `brightness(${1 - 0.6 * lifted})` }} />
        <div style={{ ...BOX, overflow: "visible", perspective: 1700, perspectiveOrigin: "857px 600px" }}>
          <div style={{ ...BOX, overflow: "visible", transformOrigin: "857px 878px", transform: `rotateX(${a}deg)`, filter: `drop-shadow(0 ${14 * lifted}px ${22 * lifted}px rgba(0,0,0,0.55))` }}>
            <div style={{ ...BOX, clipPath: BOARD }}>
              <Img src={S("e_board")} style={FULL} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · Una pasada de cortadora destapa la franja real: la franja arranca tapada con pasto alto de la misma foto y el borde de corte avanza de izquierda a derecha hasta "turn".
const top = (x: number) => 520 + (x / 1920) * 88, bot = (x: number) => 612 + (x / 1920) * 82;
export const Strip: React.FC<{ dur: number; fTurn: number }> = ({ dur, fTurn }) => {
  const f = useCurrentFrame();
  const wx = interpolate(f, [6, Math.max(fTurn, 30)], [-40, 1960], { ...CL, easing: Easing.inOut(Easing.quad) });
  const pts: number[][] = [];
  for (let i = 0; i <= 8; i++) { const y = top(wx) + ((bot(wx) - top(wx)) * i) / 8; pts.push([wx + (i % 2 ? 14 : -10), y]); }
  const cover = poly([...pts, [1920, bot(1920) + 6], [1920, top(1920) - 4]].concat([[wx - 10, top(wx) - 4]]));
  const c = interpolate(f, [0, dur], [1.0, 1.32], { ...CL, easing: EASE });
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a3a36", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${c})`, transformOrigin: "960px 575px" }}>
        <Img src={S("e_strip")} style={FULL} />
        {wx < 1940 && (
          <div style={{ ...BOX, clipPath: cover }}>
            <Img src={S("e_strip")} style={{ ...FULL, transform: "translateY(-115px)" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_APA14A = { tracks: Tracks, station: Station, board: Board, strip: Strip } as Record<string, React.FC<any>>;
