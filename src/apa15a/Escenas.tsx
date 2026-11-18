// Escenas apa15a · tres escenas hechas con las fotos reales (ver D:/rtmp/apa15a/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`apa15a/g/${n}.jpg`);
const NOMAX: React.CSSProperties = { maxWidth: "none", maxHeight: "none" };   // index.css trae img{max-width:100%}: achica las copias anchas dentro de cajas chicas
const FULL: React.CSSProperties = { ...NOMAX, position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;

// 1 · La superficie real de la lata gira alrededor del alambre: 40 tiras horizontales, cada una muestra la parte del cilindro que le toca.
//     En "turns" la franja de maní (1075–1195) sube por arriba y se va atrás; por abajo viene la chapa de atrás.
const X0 = 940, W0 = 392, CY = 450, R = 124, N = 40;
const CAN = poly([[950, 343], [962, 328], [1300, 324], [1316, 338], [1326, 450], [1318, 562], [1302, 577], [962, 580], [948, 566], [943, 450]]);
const rad = (d: number) => (d * Math.PI) / 180;
export const Roll: React.FC<{ dur: number; fTurn: number }> = ({ dur, fTurn }) => {
  const f = useCurrentFrame();
  const thAt = (g: number) => interpolate(g, [fTurn - 3, fTurn + 10, fTurn + 22, fTurn + 34], [0, 150, 118, 128], { ...CL, easing: EASE });
  const th = thAt(f), vel = Math.abs(th - thAt(f - 1));
  const cam = interpolate(f, [0, dur], [1.02, 1.1], CL);
  const bands = [] as React.ReactNode[];
  if (th > 0.01) {
    const D = 180 / N;
    for (let k = 0; k < N; k++) {
      const pa = -90 + k * D, pb = pa + D;
      const ya = CY + R * Math.sin(rad(pa)), yb = CY + R * Math.sin(rad(pb)), hs = yb - ya;
      const sa = CY + R * Math.sin(rad(pa - th)), sb = CY + R * Math.sin(rad(pb - th));
      const flip = sb < sa, sh = Math.max(Math.abs(sb - sa), 0.6), kk = hs / sh, top = -Math.min(sa, sb) * kk;
      const back = Math.cos(rad((pa + pb) / 2 - th)) < 0;
      const im = (left: number) => <Img src={S("e_roll")} style={{ ...NOMAX, position: "absolute", left, top, width: 1920, height: 1080 * kk, filter: vel > 2 ? `blur(${Math.min(1.6, vel * 0.12)}px)` : undefined }} />;
      bands.push(
        <div key={k} style={{ position: "absolute", left: X0, top: ya, width: W0, height: hs + 0.6, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, transform: flip ? "scaleY(-1)" : undefined }}>
            {im(-X0)}
            {back && <div style={{ position: "absolute", left: 1075 - X0, top: 0, width: 125, height: "100%", overflow: "hidden" }}>{im(-(1075 - 120))}</div>}
          </div>
        </div>,
      );
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#120e0a", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "1000px 470px" }}>
        <Img src={S("e_roll")} style={FULL} />
        {th > 0.01 && (
          <div style={{ ...BOX, clipPath: CAN }}>
            {bands}
            <div style={{ position: "absolute", left: X0, top: CY - R, width: W0, height: R * 2,
              background: "linear-gradient(180deg, rgba(0,0,0,0.22), transparent 28%, transparent 70%, rgba(0,0,0,0.26))" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// 2 · Tres franjas verticales de 640 px, una por lugar, centradas en su balde; cada una se levanta del piso como hoja de libro
//     desplegable en la palabra de su lugar; al final, los tres baldes en fila.
const PLACES = [
  { n: "e_pop1", s: 1, ox: 320 - 780, oy: 0 },
  { n: "e_pop2", s: 1.35, ox: 320 - 771 * 1.35, oy: 600 - 600 * 1.35 },
  { n: "e_pop3", s: 1.1, ox: 320 - 807 * 1.1, oy: 700 - 730 * 1.1 },
];
export const Pop: React.FC<{ dur: number; fBase: number; fGar: number; fPan: number }> = ({ dur, fBase, fGar, fPan }) => {
  const f = useCurrentFrame();
  const at = [fBase, fGar, fPan];
  const cam = interpolate(f, [fPan, dur], [1.0, 1.035], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#15120e", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "960px 600px" }}>
        {PLACES.map((p, i) => {
          const a = at[i];
          if (f < a - 3) return null;
          const rot = interpolate(f, [a - 3, a + 8, a + 13], [88, -5, 0], { ...CL, easing: EASE });
          const sh = interpolate(rot, [0, 88], [1, 0.35], CL);
          return (
            <div key={i} style={{ position: "absolute", left: 640 * i, top: 0, width: 640, height: 1080, overflow: "hidden",
              transform: `perspective(1700px) rotateX(${rot}deg)`, transformOrigin: "50% 100%" }}>
              <Img src={S(p.n)} style={{ ...NOMAX, position: "absolute", left: p.ox, top: p.oy, width: 1920 * p.s, height: 1080 * p.s, filter: `brightness(${sh})` }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 3 · El agujero roído de la bolsa (352,742) se cierra: un parche de la misma arpillera, 110 px a la izquierda, entra por los
//     bordes del agujero con una máscara en anillo que se achica; la cámara llega al agujero en "rats", cierra entre "feed" y "good".
const HOLE = [352, 742];
export const Lantern: React.FC<{ dur: number; fRats: number; fFeed: number; fGood: number }> = ({ dur, fRats, fFeed, fGood }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, 6, fRats + 4, dur], [1.0, 1.0, 1.95, 2.05], { ...CL, easing: EASE });
  const rin = interpolate(f, [fFeed, fGood + 6], [72, 0], { ...CL, easing: EASE });
  const op = interpolate(f, [fFeed - 4, fFeed + 4], [0, 1], CL);
  const mask = `radial-gradient(circle at ${HOLE[0]}px ${HOLE[1]}px, transparent ${rin}px, #000 ${rin + 18}px, #000 70px, transparent 94px)`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0806", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: `${HOLE[0]}px ${HOLE[1]}px` }}>
        <Img src={S("e_lantern")} style={FULL} />
        {op > 0 && (
          <div style={{ ...BOX, WebkitMaskImage: mask, maskImage: mask, opacity: op }}>
            <Img src={S("e_lantern")} style={{ ...FULL, left: 110 }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_APA15A = { roll: Roll, pop: Pop, lantern: Lantern } as Record<string, React.FC<any>>;
