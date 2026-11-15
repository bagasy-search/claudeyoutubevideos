// Escenas mar15a · SNL's Upfront Heating & Air — cuatro escenas hechas con las fotos reales (ver D:/rtmp/mar15a/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`mar15a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;

// 1 · El gabinete zumba (tiembla fino) y el disco del ventilador, recortado, queda clavado; en "spinning" intenta arrancar y vuelve.
export const Fan: React.FC<{ dur: number; fSpin: number }> = ({ dur, fSpin }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.02, 1.08], CL);
  const hum = interpolate(f, [4, 14], [0, 1], CL);
  const jx = Math.sin(f * 2.1) * 1.6 * hum, jy = Math.cos(f * 2.7) * 1.2 * hum;
  const rot = interpolate(f, [fSpin, fSpin + 6, fSpin + 18, fSpin + 30, fSpin + 37, fSpin + 54], [0, 26, 0, 0, 38, 0], { ...CL, easing: EASE });
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d1c18", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "945px 520px" }}>
        <div style={{ ...BOX, overflow: "visible", transform: `translate(${jx}px, ${jy}px) scale(1.004)` }}>
          <Img src={S("e_fan")} style={FULL} />
        </div>
        <div style={{ ...BOX, clipPath: "circle(512px at 945px 520px)" }}>
          <div style={{ ...BOX, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: "945px 520px" }}>
            <Img src={S("e_fan")} style={FULL} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · A oscuras; el charco de luz de la sonda recorre la costura real; en "rust" se abre sobre el óxido; en "crack" se enciende la chapa entera.
const SEAM: [number, number][] = [[380, 620], [700, 660], [960, 690], [1300, 640], [1700, 560]];
const along = (t: number): [number, number] => {
  const n = SEAM.length - 1, u = Math.min(Math.max(t, 0), 1) * n, i = Math.min(Math.floor(u), n - 1), k = u - i;
  return [SEAM[i][0] + (SEAM[i + 1][0] - SEAM[i][0]) * k, SEAM[i][1] + (SEAM[i + 1][1] - SEAM[i][1]) * k];
};
export const Scope: React.FC<{ dur: number; fRust: number; fNo: number }> = ({ dur, fRust, fNo }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, fRust], [0, 0.5], { ...CL, easing: EASE });
  let [x, y] = along(t);
  const toRust = interpolate(f, [fRust, fRust + 20], [0, 1], { ...CL, easing: EASE });
  x = x + (1010 - x) * toRust; y = y + (560 - y) * toRust;
  const r = interpolate(f, [0, 10, fRust, fRust + 20], [120, 240, 240, 520], CL);
  const all = interpolate(f, [fNo, fNo + 16], [0, 1], { ...CL, easing: EASE });
  const cam = interpolate(f, [0, dur], [1.06, 1.0], CL);
  const mask = `radial-gradient(circle ${r}px at ${x}px ${y}px, #000 35%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "960px 600px" }}>
        <Img src={S("e_scope")} style={{ ...FULL, filter: "brightness(0.16)" }} />
        <div style={{ ...BOX, WebkitMaskImage: mask, maskImage: mask, opacity: 1 - all }}>
          <Img src={S("e_scope")} style={{ ...FULL, filter: "brightness(1.08)" }} />
        </div>
        <div style={{ ...BOX, opacity: all }}>
          <Img src={S("e_scope")} style={{ ...FULL, filter: `brightness(${1.12 + 0.35 * interpolate(f, [fNo + 6, fNo + 14, fNo + 34], [0, 1, 0], CL)})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · La pared real de la casa crece al doble anclada en el pie de su esquina (1100,860) en "twice"; el equipo no cambia; al final vuelve.
const HOUSE = poly([[0, 0], [1300, 0], [1300, 40], [1112, 250], [1104, 862], [0, 872]]);
export const Big: React.FC<{ dur: number; fTwice: number }> = ({ dur, fTwice }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [fTwice - 44, fTwice + 4], [0, 1], { ...CL, easing: EASE });
  const down = 0;
  const k = 1 + 0.9 * up * (1 - down);
  const cam = interpolate(f, [0, dur], [1.0, 1.04], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#202a1c", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "1300px 640px" }}>
        <Img src={S("e_big")} style={FULL} />
        <div style={{ ...BOX, overflow: "visible", transform: `scale(${k})`, transformOrigin: "1104px 862px", filter: `drop-shadow(6px 0 10px rgba(0,0,0,${0.35 * up * (1 - down)}))` }}>
          <div style={{ ...BOX, clipPath: HOUSE }}>
            <Img src={S("e_big")} style={FULL} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · La sombra real del técnico es la aguja de un reloj de sol: en cada ida y vuelta gira alrededor de sus pies sobre el cemento.
const SHADOW = poly([[655, 684], [760, 686], [880, 688], [972, 690], [975, 712], [880, 712], [760, 708], [662, 703]]);
const SHPATCH = poly([[640, 672], [985, 672], [985, 724], [640, 724]]);
export const Drive: React.FC<{ dur: number; fOut: number; fBack: number; fAgain: number }> = ({ dur, fOut, fBack, fAgain }) => {
  const f = useCurrentFrame();
  const step = (at: number) => interpolate(f, [at, at + 12], [0, 1], { ...CL, easing: Easing.out(Easing.back(1.6)) });
  const ang = -26 * (step(fOut) + step(fBack) + step(fAgain));
  const cam = interpolate(f, [0, dur], [1.0, 1.1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2b2a24", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "990px 700px" }}>
        <Img src={S("e_drive")} style={FULL} />
        <div style={{ ...BOX, clipPath: SHPATCH }}>
          <Img src={S("e_drive")} style={{ ...FULL, transform: "translateY(-72px)" }} />
        </div>
        {[fOut, fBack, fAgain].map((at, i) => f < at + 12 ? null : (
          <div key={i} style={{ ...BOX, overflow: "visible", opacity: 0.38, transform: `rotate(${-26 * i}deg)`, transformOrigin: "985px 700px" }}>
            <div style={{ ...BOX, clipPath: SHADOW }}><Img src={S("e_drive")} style={FULL} /></div>
          </div>
        ))}
        <div style={{ ...BOX, overflow: "visible", transform: `rotate(${ang}deg)`, transformOrigin: "985px 700px" }}>
          <div style={{ ...BOX, clipPath: SHADOW }}>
            <Img src={S("e_drive")} style={FULL} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_MAR15A = { fan: Fan, scope: Scope, big: Big, drive: Drive } as Record<string, React.FC<any>>;
