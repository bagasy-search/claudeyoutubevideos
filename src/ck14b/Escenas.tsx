// Escenas sobre fotos reales · ck14b (ideas en D:/rtmp/ck14b/ideas.md). Sin componentes hechos ni dibujos: sólo la foto y su geometría.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const S = (n: string) => staticFile(`ck14b/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;

// ---------- 1 · el bol se hunde y el hilo de engrudo se alarga entre la cuchara y el puré (capas recortadas de e_bowls)
// bol: elipse 145–915 x 230–940 sin la mano (x<262 arriba de y 540)
const BOWL = poly(Array.from({ length: 40 }, (_, i) => {
  const a = (i / 40) * Math.PI * 2; let x = 530 + 392 * Math.cos(a), y = 585 + 362 * Math.sin(a);
  if (x < 262 && y < 540) x = 262;
  return [Math.round(x), Math.round(y)];
}));
const HAND = poly([[0, 170], [120, 168], [250, 205], [330, 145], [440, 104], [560, 84], [695, 90], [700, 240], [648, 335], [468, 335], [335, 236], [262, 262], [262, 530], [0, 530]]);
const STRAND = poly([[468, 300], [646, 300], [614, 450], [596, 600], [580, 826], [516, 826], [502, 600], [490, 450]]);
export const Bowls: React.FC<{ dur: number; fLift: number; fPaste: number }> = ({ dur, fLift, fPaste }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [fLift - 4, fLift + 26], [0, 1], { ...CL, easing: io });
  const k2 = interpolate(f, [fPaste, fPaste + 30], [0, 0.35], { ...CL, easing: io });
  const drop = 72 * k + 22 * k2;                 // el bol baja
  const sy = (526 + drop) / 526;                 // el hilo se alarga desde y=300 hasta el puré que bajó
  const cam = interpolate(f, [0, dur], [1.0, 1.05], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#888" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: "560px 520px" }}>
        <Img src={S("e_bowls")} style={full} />
        {/* acero liso bajo el bol: el rincón de acero de arriba a la derecha de la misma foto, ampliado */}
        <div style={{ ...full, overflow: "hidden", clipPath: BOWL }}>
          <Img src={S("e_bowls")} style={{ ...full, transform: "scale(4)", transformOrigin: "1840px 40px" }} />
        </div>
        <div style={{ ...full, transform: `translateY(${drop}px)`, filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.35))" }}>
          <div style={{ ...full, overflow: "hidden", clipPath: BOWL }}><Img src={S("e_bowls")} style={full} /></div>
        </div>
        <div style={{ ...full, overflow: "hidden", clipPath: STRAND, transform: `scaleY(${sy})`, transformOrigin: "560px 300px" }}>
          <Img src={S("e_bowls")} style={full} />
        </div>
        <div style={{ ...full, overflow: "hidden", clipPath: HAND }}><Img src={S("e_bowls")} style={full} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2 · el vapor real, separado por luminancia, sube en tres franjas a distinta velocidad
export const Steam: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bands = [[0, 160, 110], [160, 320, 70], [320, 480, 40]];
  const cam = interpolate(f, [0, dur], [1.02, 1.08], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: "860px 470px" }}>
        <Img src={S("e_steam")} style={full} />
        {bands.map(([y0, y1, v], i) => {
          const dy = -v * interpolate(f, [0, dur], [0, 1], CL);
          const op = interpolate(f, [0, 6, dur - 8, dur], [0, 0.8, 0.55, 0], CL);
          return (
            <div key={i} style={{ ...full, transform: `translateY(${dy}px)`, opacity: op, mixBlendMode: "screen" }}>
              <div style={{ ...full, overflow: "hidden", clipPath: `inset(${y0}px 720px ${1080 - y1}px 350px)` }}>
                <Img src={S("e_steam")} style={{ ...full, filter: "grayscale(1) brightness(0.85) contrast(3.2)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · un reflejo corre por el líquido real del borde de la fuente (sólo dentro de la máscara del charco)
const RING = poly([[1430, 250], [1560, 250], [1565, 905], [1545, 918], [400, 918], [396, 852], [1430, 852]]);
export const Puddle: React.FC<{ dur: number; fPuddle: number; fEdges: number }> = ({ dur, fPuddle, fEdges }) => {
  const f = useCurrentFrame();
  const t0 = Math.max(0, Math.min(fPuddle, fEdges) - 4), t1 = fEdges + 46;
  const p = interpolate(f, [t0, t1], [0, 1], { ...CL, easing: io });
  // recorrido: borde derecho de arriba abajo (650 px) y después el de abajo de derecha a izquierda (1100 px)
  const L = 650 + 1100, d = p * L;
  const x = d < 650 ? 1495 : 1495 - (d - 650), y = d < 650 ? 250 + d : 885;
  const op = interpolate(f, [t0, t0 + 8, t1 - 10, t1 + 6], [0, 0.9, 0.9, 0], CL);
  const cam = interpolate(f, [0, dur], [1.0, 1.06], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: "1240px 640px" }}>
        <Img src={S("e_puddle")} style={full} />
        <div style={{ ...full, overflow: "hidden", clipPath: RING, mixBlendMode: "screen", opacity: op }}>
          <div style={{ ...full, background: `radial-gradient(ellipse 150px 120px at ${x}px ${y}px, rgba(255,255,255,0.85), rgba(255,255,255,0.25) 45%, rgba(255,255,255,0) 75%)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4 · dolly inverso: la caja de Harold queda igual y el salón se aleja detrás
const BOX = poly([[745, 158], [1022, 158], [1024, 244], [1300, 250], [1560, 288], [1580, 700], [1548, 1022], [1250, 830], [1236, 800], [700, 1002], [478, 892], [458, 262], [745, 246]]);
export const Box: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CAM = 1.25;
  const b = interpolate(f, [0, dur], [1.0, 0.8], { ...CL, easing: io }); // fondo efectivo 1,25 → 1,0
  const O = "1020px 590px";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#ddd" }}>
      <div style={{ ...full, transform: `scale(${CAM})`, transformOrigin: O }}>
        <div style={{ ...full, transform: `scale(${b})`, transformOrigin: O }}><Img src={S("e_box")} style={full} /></div>
        <div style={{ ...full, overflow: "hidden", clipPath: BOX, filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.3))" }}><Img src={S("e_box")} style={full} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK14B = { bowls: Bowls, steam: Steam, puddle: Puddle, box: Box } as Record<string, React.FC<any>>;
