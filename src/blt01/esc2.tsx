// Escenas 2, 3 y 4 sobre fotos reales. Plano: manual/escenas/e2_e4_plano.md (carpeta local).
import React from "react";
import { AbsoluteFill, Easing, Img, Series, useCurrentFrame } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSans } from "@remotion/google-fonts/Montserrat";
import { agujero, cam, Cam, ENTRA, FILL, foto, IO, lerp, mundo, poli, tramo } from "./esc1";

const { fontFamily: HAND } = loadHand("normal", { weights: ["600"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["800"], subsets: ["latin"] });
type P = [number, number];
const SALE = Easing.out(Easing.cubic);
const mask = (m: string): React.CSSProperties => ({ WebkitMaskImage: m, maskImage: m });
const Caja: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ ...FILL, overflow: "hidden" }}>{children}</div>;

// El rectángulo w x h cae sobre los cuatro puntos reales: arriba-izq, arriba-der, abajo-der, abajo-izq.
const sobre = (w: number, h: number, q: [P, P, P, P]) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, sx = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, k = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
};

// ===== E2: la linterna recorre la mesa y el farol enciende los bidones =====
const BID_A: P[] = [[398, 124], [492, 124], [500, 186], [540, 222], [590, 290], [630, 365], [642, 440], [640, 620], [642, 800], [625, 880], [580, 898], [300, 898], [262, 880], [246, 800], [246, 440], [262, 365], [300, 290], [345, 225], [390, 186]];
const BID_B: P[] = [[815, 114], [915, 114], [922, 180], [962, 215], [1010, 280], [1055, 360], [1070, 440], [1068, 620], [1070, 800], [1052, 895], [1000, 915], [735, 915], [680, 895], [663, 800], [664, 440], [678, 360], [722, 280], [770, 215], [808, 180]];
const BID_D: P[] = [[1340, 146], [1430, 146], [1437, 205], [1475, 245], [1525, 320], [1555, 400], [1560, 480], [1558, 596], [1310, 596], [1300, 545], [1255, 520], [1220, 505], [1212, 470], [1214, 400], [1250, 320], [1295, 245], [1333, 205]];
const ANOTADOR: P[] = [[150, 440], [270, 416], [400, 390], [534, 365], [590, 470], [650, 590], [716, 729], [590, 780], [440, 838], [285, 895], [240, 740], [195, 590]];
const LENTE: P = [1004, 691];
const FAROL: P = [1185, 705];
// [cuadro de salida, cuadro de llegada, x, y, radio x, radio y]
const PARADAS: [number, number, number, number, number, number][] = [[4, 14, 770, 552, 210, 180], [118, 140, 1300, 590, 340, 260], [171, 187, 935, 440, 240, 190], [210, 226, LENTE[0], LENTE[1], 170, 150]];
const foco = (f: number) => {
  let p = [900, 740, 330, 210];
  for (const [a, b, x, y, rx, ry] of PARADAS) { const k = tramo(f, a, b, IO); p = [lerp(p[0], x, k), lerp(p[1], y, k), lerp(p[2], rx, k), lerp(p[3], ry, k)]; }
  return p;
};
const Bidon: React.FC<{ p: P[]; v: number }> = ({ p, v }) => v > 0 ? <div style={{ ...FILL, opacity: v, filter: "drop-shadow(0 0 34px rgba(255,214,150,.42))" }}><Img src={foto("p140")} style={{ ...FILL, clipPath: poli(p), filter: "brightness(1.28) sepia(.12)" }} /></div> : null;

export const Esc2: React.FC = () => {
  const f = useCurrentFrame();
  const [x, y, rx, ry] = foco(f);
  const u = tramo(f, 212, 232, ENTRA);
  const S0 = lerp(1, 1.2, tramo(f, 0, 212));
  const camMesa: Cam = f < 212 ? cam(lerp(960, x, 0.25), lerp(540, y, 0.25), S0) : cam(lerp(lerp(960, LENTE[0], 0.25), LENTE[0], Math.min(1, u / 0.35)), lerp(lerp(540, LENTE[1], 0.25), LENTE[1], Math.min(1, u / 0.35)), 1.2 * Math.pow(14 / 1.2, u));
  const pulso = 1.14 + 0.32 * tramo(f, 205, 210) * (1 - tramo(f, 212, 222));
  const brilloLente = tramo(f, 212, 226, ENTRA);
  const k = tramo(f, 230, 258, SALE);
  const camEstante = f < 258 ? cam(lerp(FAROL[0], 960, k), lerp(FAROL[1], 540, k), lerp(6, 1.02, k)) : cam(960, 540, lerp(1.02, 1.08, tramo(f, 258, 344)));
  const baja = tramo(f, 243, 256);
  const blanco = tramo(f, 222, 230) * (1 - tramo(f, 232, 246));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {f < 234 && <Caja><div style={mundo(camMesa)}>
      <Img src={foto("p139")} style={{ ...FILL, filter: "brightness(.34) saturate(.8)" }} />
      <Img src={foto("p139")} style={{ ...FILL, filter: `brightness(${pulso})`, ...mask(`radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px,#000 38%,transparent 100%)`) }} />
      <Img src={foto("p139")} style={{ ...FILL, clipPath: poli(ANOTADOR), filter: "brightness(.34) saturate(.8)" }} />
      {brilloLente > 0 && <div style={{ ...FILL, opacity: brilloLente, background: `radial-gradient(circle 130px at ${LENTE[0]}px ${LENTE[1]}px,#fff8ea 0%,#fff3dd 45%,rgba(255,240,215,0) 100%)` }} />}
    </div></Caja>}
    {f >= 228 && <Caja><div style={mundo(camEstante)}>
      <Img src={foto("p140")} style={{ ...FILL, filter: `brightness(${lerp(1, 0.42, baja)}) saturate(${lerp(1, 0.8, baja)})` }} />
      <Img src={foto("p140")} style={{ ...FILL, opacity: baja, ...mask(`radial-gradient(ellipse 250px 320px at ${FAROL[0]}px ${FAROL[1]}px,#000 45%,transparent 100%)`) }} />
      <Bidon p={BID_D} v={tramo(f, 326, 334, SALE)} />
      <Bidon p={BID_A} v={tramo(f, 243, 254, SALE)} />
      <Bidon p={BID_B} v={tramo(f, 318, 326, SALE)} />
    </div></Caja>}
    {blanco > 0 && <AbsoluteFill style={{ background: "#fff5e4", opacity: blanco }} />}
  </AbsoluteFill>;
};

// ===== E3: la etiqueta en blanco se imprime; el vaso lleva al bidón que reposa =====
const VASO: P[] = [[703, 568], [760, 566], [820, 566], [880, 566], [919, 568], [913, 660], [905, 760], [897, 860], [888, 895], [810, 898], [736, 895], [727, 860], [716, 760], [708, 660]];
const RELOJ: P = [1412, 858];
const Impreso: React.FC<{ f: number; at: number; y: number; size: number; children: string }> = ({ f, at, y, size, children }) => {
  const v = tramo(f, at, at + 5, SALE);
  return v > 0 ? <div style={{ position: "absolute", left: 999, top: y, width: 352, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: 1, color: "#23201a", opacity: v * 0.9, mixBlendMode: "multiply", transform: `scale(${lerp(1.06, 1, v)})` }}>{children}</div> : null;
};
export const Esc3: React.FC = () => {
  const f = useCurrentFrame();
  const entra = tramo(f, 207, 228, ENTRA);
  const desliza = tramo(f, 185, 207, IO);
  let camA: Cam;
  if (f < 185) camA = cam(lerp(960, 1175, tramo(f, 0, 175, IO)), lerp(540, 690, tramo(f, 0, 175, IO)), f < 40 ? lerp(1, 1.06, tramo(f, 0, 40)) : lerp(1.06, 1.75, tramo(f, 40, 175, IO)));
  else if (f < 207) camA = cam(lerp(1175, 810, desliza), lerp(690, 720, desliza), lerp(1.75, 2.4, desliza));
  else camA = cam(810, lerp(720, 700, Math.min(1, entra / 0.35)), 2.4 * Math.pow(13 / 2.4, entra));
  const camB = cam(lerp(1080, 1200, tramo(f, 240, 332)), lerp(680, 720, tramo(f, 240, 332)), f < 240 ? lerp(1.25, 1.06, tramo(f, 205, 240, IO)) : lerp(1.06, 1.16, tramo(f, 240, 332)));
  const baja = tramo(f, 239, 252);
  const reloj = tramo(f, 245, 256, SALE);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {f >= 205 && <Caja><div style={mundo(camB)}>
      <Img src={foto("p082")} style={{ ...FILL, filter: `brightness(${lerp(1, 0.58, baja)}) saturate(${lerp(1, 0.8, baja)})` }} />
      {reloj > 0 && <Img src={foto("p082")} style={{ ...FILL, opacity: reloj, filter: "brightness(1.5)", ...mask(`radial-gradient(circle 240px at ${RELOJ[0]}px ${RELOJ[1]}px,#000 42%,transparent 100%)`) }} />}
    </div></Caja>}
    {f <= 228 && <Caja><div style={{ ...mundo(camA), clipPath: f >= 205 ? agujero(VASO) : undefined }}>
      <Img src={foto("p080")} style={FILL} />
      <Impreso f={f} at={48} y={574} size={28}>PLAIN</Impreso>
      <Impreso f={f} at={63} y={606} size={28}>UNSCENTED</Impreso>
      <Impreso f={f} at={85} y={642} size={54}>BLEACH</Impreso>
      <Impreso f={f} at={113} y={700} size={72}>6%</Impreso>
      <Impreso f={f} at={144} y={782} size={25}>8 DROPS</Impreso>
      <Impreso f={f} at={168} y={810} size={25}>PER GALLON</Impreso>
    </div></Caja>}
  </AbsoluteFill>;
};

// ===== E4: lo escrito en la hoja real; el papel sigue cuando el teléfono se apaga =====
const HOJA: [P, P, P, P] = [[361, 518], [906, 313], [1633, 681], [1000, 1095]];
const PANTALLA: P[] = [[505, 688], [580, 672], [655, 656], [720, 715], [790, 775], [890, 838], [800, 855], [720, 870], [662, 875], [610, 820], [550, 755]];
const PAPEL: P[] = [[760, 620], [900, 594], [1040, 570], [1190, 546], [1290, 605], [1385, 658], [1318, 656], [1260, 675], [1181, 706], [1147, 727], [1144, 770], [1175, 796], [1186, 828], [1244, 854], [1339, 870], [1160, 920]];
const Renglon: React.FC<{ f: number; a: number; b: number; y: number; children: string }> = ({ f, a, b, y, children }) => {
  const v = tramo(f, a, b);
  return v > 0 ? <div style={{ position: "absolute", left: 250, top: y, fontFamily: HAND, fontWeight: 600, fontSize: 86, lineHeight: 1, color: "#2c2a28", opacity: 0.88, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * v}% -20% -5%)` }}>{children}</div> : null;
};
export const Esc4: React.FC = () => {
  const f = useCurrentFrame();
  const u = tramo(f, 134, 150, ENTRA);
  const k0 = tramo(f, 0, 134, IO);
  const camA = f < 134 ? cam(lerp(960, 1130, k0), lerp(540, 740, k0), lerp(1.02, 1.32, k0)) : cam(lerp(1130, 1470, Math.min(1, u / 0.4)), lerp(740, 735, Math.min(1, u / 0.4)), 1.32 * Math.pow(18 / 1.32, u));
  const s = tramo(f, 152, 168, SALE);
  const camB = f < 168 ? cam(1040, 740, Math.pow(18, 1 - s) * Math.pow(1.08, s)) : cam(1040, 740, lerp(1.08, 1.18, tramo(f, 168, 228)));
  const empalme = tramo(f, 150, 153);
  const tel = f < 170 ? 1 : 1 - tramo(f, 170, 174);
  const baja = tramo(f, 172, 188);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {f >= 150 && <Caja><div style={mundo(camB)}>
      <Img src={foto("p116")} style={{ ...FILL, filter: `brightness(${lerp(1, 0.4, baja)}) saturate(${lerp(1, 0.75, baja)})` }} />
      {tel > 0 && <>
        <div style={{ ...FILL, opacity: tel * 0.5, mixBlendMode: "screen", background: "radial-gradient(ellipse 380px 280px at 690px 770px,rgba(150,185,255,.5) 0%,rgba(120,160,240,.14) 60%,rgba(0,0,0,0) 100%)" }} />
        <div style={{ ...FILL, opacity: tel, clipPath: poli(PANTALLA), background: "linear-gradient(135deg,#4a6cb0 0%,#2a437f 55%,#16244d 100%)" }} />
      </>}
      {baja > 0 && <div style={{ ...FILL, opacity: baja, filter: "drop-shadow(0 0 26px rgba(255,240,215,.3))" }}><Img src={foto("p116")} style={{ ...FILL, clipPath: poli(PAPEL), filter: "brightness(1.1)" }} /></div>}
    </div></Caja>}
    {f <= 153 && <div style={{ ...FILL, overflow: "hidden", opacity: 1 - empalme }}><div style={mundo(camA)}>
      <Img src={foto("p115")} style={FILL} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 850, height: 1100, transformOrigin: "0 0", transform: sobre(850, 1100, HOJA), mixBlendMode: "multiply" }}>
        <Renglon f={f} a={39} b={52} y={560} >Name</Renglon>
        <Renglon f={f} a={58} b={70} y={650}>Dose</Renglon>
        <Renglon f={f} a={75} b={86} y={740}>Time</Renglon>
        <Renglon f={f} a={101} b={130} y={830}>Doctor's phone</Renglon>
      </div>
    </div></div>}
  </AbsoluteFill>;
};

export const ES234: React.FC = () => <AbsoluteFill><Series>
  <Series.Sequence durationInFrames={344}><Esc2 /></Series.Sequence>
  <Series.Sequence durationInFrames={332}><Esc3 /></Series.Sequence>
  <Series.Sequence durationInFrames={228}><Esc4 /></Series.Sequence>
</Series></AbsoluteFill>;
