// Escena 1: tres aberturas. Plano completo en manual/escenas/e1_plano.md (carpeta local).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const foto = (k: string) => staticFile(`img/blt01/${k}.jpg`);
const FILL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const tramo = (f: number, a: number, b: number, e: (x: number) => number = (x) => x) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const IO = Easing.inOut(Easing.sin);
const ENTRA = Easing.in(Easing.cubic);

type Cam = { S: number; X: number; Y: number };
const cam = (cx: number, cy: number, S: number): Cam => ({
  S,
  X: Math.min(0, Math.max(1920 - 1920 * S, 960 - cx * S)),
  Y: Math.min(0, Math.max(1080 - 1080 * S, 540 - cy * S)),
});
const mundo = (c: Cam): React.CSSProperties => ({ ...FILL, transformOrigin: "0 0", transform: `translate(${c.X}px,${c.Y}px) scale(${c.S})` });

const RENDIJA: [number, number][] = [[0, 606], [280, 606], [560, 606], [840, 606], [1124, 606], [1122, 632], [1112, 664], [1096, 682], [1064, 698], [900, 695], [700, 690], [480, 688], [240, 689], [0, 690]];
const CARBON: [number, number][] = [[1006, 452], [1038, 430], [1070, 407], [1125, 397], [1185, 395], [1245, 404], [1305, 421], [1358, 433], [1398, 446], [1412, 473], [1370, 490], [1318, 500], [1260, 510], [1185, 511], [1120, 505], [1068, 482], [1024, 476]];
const HORNO: [number, number][] = [[556, 526], [640, 516], [760, 503], [860, 494], [866, 600], [868, 728], [760, 762], [660, 794], [565, 822], [558, 700], [554, 600]];

const pts = (p: [number, number][]) => p.map(([x, y]) => `${x}px ${y}px`).join(",");
const poli = (p: [number, number][]) => `polygon(${pts(p)})`;
// Toda la foto menos la forma: el contorno se une al borde por un puente de ancho cero.
const agujero = (p: [number, number][]) => `polygon(evenodd,0px 0px,1920px 0px,1920px 1080px,0px 1080px,0px 0px,${pts(p)},${p[0][0]}px ${p[0][1]}px,0px 0px)`;

const camA = (f: number) => {
  if (f <= 28) return cam(960, 540, lerp(1, 1.05, tramo(f, 0, 28)));
  const u = tramo(f, 28, 50, ENTRA);
  const v = interpolate(u, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  return cam(lerp(960, 560, v), lerp(540, 648, v), 1.05 * Math.pow(14 / 1.05, u));
};
const camB = (f: number) => {
  if (f <= 96) {
    const S = f < 50 ? lerp(1, 1.06, tramo(f, 28, 50)) : lerp(1.06, 1.12, tramo(f, 50, 96));
    const k = tramo(f, 28, 96, IO);
    return cam(lerp(960, 1000, k), lerp(540, 520, k), S);
  }
  const u = tramo(f, 96, 118, ENTRA);
  const v = interpolate(u, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  return cam(lerp(1000, 1210, v), lerp(520, 452, v), 1.12 * Math.pow(16 / 1.12, u));
};
const camC = (f: number, b: Cam) => {
  if (f <= 118) {
    const k = tramo(f, 96, 118, IO);
    const hx = 1208 * b.S + b.X, hy = 452 * b.S + b.Y;
    const S = lerp(1.55, 1.22, k);
    const X = lerp(hx, 960, k) - lerp(713, 790, k) * S, Y = lerp(hy, 540, k) - lerp(640, 500, k) * S;
    return { S, X: Math.min(0, Math.max(1920 - 1920 * S, X)), Y: Math.min(0, Math.max(1080 - 1080 * S, Y)) };
  }
  const k = tramo(f, 150, 205, IO);
  const S = f < 150 ? lerp(1.22, 1.3, tramo(f, 118, 160)) : lerp(lerp(1.22, 1.3, tramo(f, 118, 160)), 1.46, k);
  return cam(lerp(790, 700, k), lerp(500, 470, k), S);
};

const Brasa: React.FC<{ g: number; f: number; c: Cam }> = ({ g, f, c }) => {
  const pulso = 0.9 + 0.07 * Math.sin(f * 0.71) + 0.03 * Math.sin(f * 1.93);
  return <div style={mundo(c)}>
    <Img src={foto("p044")} style={{ ...FILL, opacity: g * pulso, filter: "sepia(1) saturate(7) hue-rotate(-18deg) brightness(1.25) contrast(1.15)", WebkitMaskImage: "radial-gradient(ellipse 250px 100px at 1208px 455px,#000 62%,transparent 100%)", maskImage: "radial-gradient(ellipse 250px 100px at 1208px 455px,#000 62%,transparent 100%)" }} />
    <div style={{ ...FILL, opacity: g * pulso * 0.75, mixBlendMode: "screen", background: "radial-gradient(ellipse 430px 250px at 1208px 390px,rgba(255,120,30,.55) 0%,rgba(255,90,20,.18) 55%,rgba(0,0,0,0) 100%)" }} />
  </div>;
};

export const Esc1: React.FC = () => {
  const f = useCurrentFrame();
  const a = camA(f), b = camB(f), c = camC(f, b);
  const brasa = tramo(f, 51, 66, Easing.out(Easing.cubic));
  const puente = 1 - tramo(f, 96, 108);
  const oscura = tramo(f, 158, 170);
  const horno = tramo(f, 160, 172, Easing.out(Easing.cubic));
  const hornalla = tramo(f, 187, 200, Easing.out(Easing.cubic));
  const resplandor = 0.8 * tramo(f, 22, 34, Easing.out(Easing.cubic)) * (1 - tramo(f, 40, 50));
  const blanco = 1 - tramo(f, 26, 42);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {f >= 96 && <div style={{ ...FILL, overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Img src={foto("p050")} style={{ ...FILL, filter: `brightness(${lerp(1, 0.7, oscura)}) saturate(${lerp(1, 0.75, oscura)})` }} />
        {horno > 0 && <div style={{ ...FILL, opacity: horno, filter: "drop-shadow(0 0 60px rgba(255,170,70,.55))" }}><Img src={foto("p050")} style={{ ...FILL, clipPath: poli(HORNO), filter: "brightness(1.45)" }} /></div>}
        {hornalla > 0 && <Img src={foto("p050")} style={{ ...FILL, opacity: hornalla, filter: "brightness(1.7) sepia(.25)", WebkitMaskImage: "radial-gradient(ellipse 470px 270px at 640px 290px,#000 35%,transparent 100%)", maskImage: "radial-gradient(ellipse 470px 270px at 640px 290px,#000 35%,transparent 100%)" }} />}
      </div>
    </div>}
    {f >= 96 && f < 108 && <div style={{ ...FILL, overflow: "hidden", opacity: puente }}>
      <div style={{ ...mundo(b), clipPath: poli(CARBON) }}><Img src={foto("p044")} style={FILL} /></div>
      <Brasa g={1} f={f} c={b} />
    </div>}
    {f >= 28 && f <= 118 && <div style={{ ...FILL, overflow: "hidden" }}>
      <div style={{ ...mundo(b), clipPath: f >= 96 ? agujero(CARBON) : undefined }}>
        <Img src={foto("p044")} style={FILL} />
        {brasa > 0 && <>
          <Img src={foto("p044")} style={{ ...FILL, opacity: brasa * (0.9 + 0.07 * Math.sin(f * 0.71) + 0.03 * Math.sin(f * 1.93)), filter: "sepia(1) saturate(7) hue-rotate(-18deg) brightness(1.25) contrast(1.15)", WebkitMaskImage: "radial-gradient(ellipse 250px 100px at 1208px 455px,#000 62%,transparent 100%)", maskImage: "radial-gradient(ellipse 250px 100px at 1208px 455px,#000 62%,transparent 100%)" }} />
          <div style={{ ...FILL, opacity: brasa * 0.7, mixBlendMode: "screen", background: "radial-gradient(ellipse 430px 250px at 1208px 390px,rgba(255,120,30,.55) 0%,rgba(255,90,20,.18) 55%,rgba(0,0,0,0) 100%)" }} />
        </>}
      </div>
    </div>}
    {f <= 50 && <div style={{ ...FILL, overflow: "hidden" }}>
      <div style={{ ...mundo(a), clipPath: f >= 26 ? agujero(RENDIJA) : undefined }}><Img src={foto("p049")} style={FILL} /></div>
      {f >= 26 && blanco > 0 && <div style={mundo(a)}><div style={{ ...FILL, background: "#fff", opacity: blanco, clipPath: poli(RENDIJA) }} /></div>}
      {resplandor > 0 && <div style={mundo(a)}><div style={{ position: "absolute", left: -260, top: 470, width: 1660, height: 360, opacity: resplandor, mixBlendMode: "screen", background: "radial-gradient(ellipse 50% 50% at 50% 50%,rgba(255,250,235,.9) 0%,rgba(255,245,225,.3) 55%,rgba(0,0,0,0) 100%)" }} /></div>}
    </div>}
  </AbsoluteFill>;
};
