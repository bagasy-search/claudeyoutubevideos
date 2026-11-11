// Escenas sobre fotos de ck11a (ideas.md). Escritas de cero: sólo React y Remotion.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// cámara que lleva el punto (cx,cy) de la foto al centro con escala s, sin dejar bordes vacíos
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const camT = (cx: number, cy: number, s: number, t: number) => cam(lerp(cx, 960, t), lerp(cy, 540, t), lerp(s, 1, t));

// ── Escena 1 · la canasta vista desde arriba aterriza sobre la canasta del piso del auto
export const EscCanasta: React.FC<{ a: string; b: string; c: string; fFloor: number; fSeat: number; dur: number }> = ({ a, b, c, fFloor, fSeat, dur }) => {
  const f = useCurrentFrame();
  const L0 = fFloor - 24, L1 = fFloor + 8; // vuelo de la canasta
  const t = interpolate(f, [L0, L1], [0, 1], { ...CL, easing: io });
  // canasta en e_basket: 210,45 → 1725,1020 ; en e_carfloor: 570,480 → 1200,900
  const sx = lerp(1, 630 / 1515, t), sy = lerp(1, (420 / 975) * 0.92, t);
  const tx = lerp(0, 570 - 210 * (630 / 1515), t), ty = lerp(0, 480 - 45 * (420 / 975) * 0.92, t);
  const persp = lerp(0, 24, Math.sin(t * Math.PI) * 0.6 + t * 0.4);
  const showB = f >= L0 + 4;
  const bOp = interpolate(f, [L0 + 4, L1], [0, 1], CL);
  const basketOp = interpolate(f, [L1, L1 + 10], [1, 0], CL);
  const push = interpolate(f, [0, L0], [1, 1.06], CL);
  const carS = interpolate(f, [L1, fSeat], [1, 1.07], CL);
  const seatT = interpolate(f, [fSeat - 8, fSeat + 4], [0, 1], CL);
  const seatS = interpolate(f, [fSeat, dur], [1.03, 1.14], CL);
  return (
    <AbsoluteFill style={{ background: "#120c08", overflow: "hidden" }}>
      {showB && (
        <AbsoluteFill style={{ opacity: bOp, overflow: "hidden" }}>
          <div style={{ ...FULL, transformOrigin: "885px 690px", transform: `scale(${carS})` }}><Img src={staticFile(b)} style={FULL} /></div>
        </AbsoluteFill>
      )}
      {f < L1 + 10 && (
        <AbsoluteFill style={{ opacity: basketOp, overflow: "hidden" }}>
          <div style={{ ...FULL, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy}) perspective(1600px) rotateX(${persp}deg) scale(${f < L0 ? push : 1})`,
            clipPath: f >= L0 ? `inset(${45 * t}px ${195 * t}px ${60 * t}px ${210 * t}px round ${30 * t}px)` : undefined, filter: `drop-shadow(0 ${30 * t}px ${40 * t}px rgba(0,0,0,0.55))` }}>
            <Img src={staticFile(a)} style={FULL} />
          </div>
        </AbsoluteFill>
      )}
      {f >= fSeat - 8 && (
        <AbsoluteFill style={{ opacity: seatT, overflow: "hidden" }}>
          <div style={{ ...FULL, transformOrigin: "1020px 720px", transform: `scale(${seatS})` }}><Img src={staticFile(c)} style={FULL} /></div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ── Escena 2 · la cosa redonda de cada día se despega de la foto, rueda por el cuadro y detrás de ella queda el día siguiente
type Circ = [number, number, number];
export const EscRueda: React.FC<{ imgs: string[]; circ: Circ[]; days: number[]; dur: number }> = ({ imgs, circ, days, dur }) => {
  const f = useCurrentFrame();
  const RR = 170, Y = 560; // radio y altura de rodadura en pantalla
  // transición k→k+1 centrada en days[k+1]: A = se despega y rueda a la izquierda, B = cruza todo el cuadro destapando el día nuevo
  let k = 0; for (let i = 1; i < days.length; i++) if (f >= days[i] - 30) k = i; // k = día que se destapa (o el actual)
  const T = days[k], A0 = T - 30, A1 = T - 18, B1 = T + 12;
  const inTr = k > 0 && f >= A0 && f < B1;
  const base = inTr ? k - 1 : k;
  const drift = (i: number) => { const s0 = days[i] ?? 0, s1 = days[i + 1] ?? dur; return interpolate(f, [s0, s1], [1.0, 1.05], CL); };
  const photo = (i: number, st?: React.CSSProperties) => (
    <AbsoluteFill key={'p' + i} style={{ overflow: 'hidden', ...st }}>
      <div style={{ ...FULL, transformOrigin: `${circ[i][0]}px ${circ[i][1]}px`, transform: `scale(${drift(i)})` }}><Img src={staticFile(imgs[i])} style={FULL} /></div>
    </AbsoluteFill>
  );
  const layers: React.ReactNode[] = [photo(base)];
  if (inTr) {
    const [cx, cy, r] = circ[k - 1];
    let x: number, y: number, rad: number, ang: number, lift: number;
    if (f < A1) {
      const t = interpolate(f, [A0, A1], [0, 1], { ...CL, easing: io });
      x = lerp(cx, -RR, t); y = lerp(cy, Y, t); rad = lerp(r, RR, t); ang = (x - cx) / RR; lift = t;
    } else {
      const t = interpolate(f, [A1, B1], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
      x = lerp(-RR, 1920 + RR, t); y = Y; rad = RR; ang = (-RR - cx) / RR + (x + RR) / RR; lift = 1;
      // el día nuevo queda detrás de la rueda
      layers.push(photo(k, { clipPath: `inset(0 ${Math.max(0, 1920 - x)}px 0 0)` }));
    }
    const kk = rad / r;
    layers.push(
      <div key="disc" style={{ position: 'absolute', left: x - rad, top: y - rad, width: rad * 2, height: rad * 2, borderRadius: '50%', overflow: 'hidden',
        transform: `rotate(${ang}rad) scale(${1 + 0.06 * Math.sin(lift * Math.PI)})`, boxShadow: `0 ${18 * lift}px ${36 * lift}px rgba(0,0,0,${0.5 * lift})` }}>
        <Img src={staticFile(imgs[k - 1])} style={{ position: 'absolute', left: -(cx * kk - rad), top: -(cy * kk - rad), width: 1920 * kk, height: 1080 * kk, maxWidth: 'none' }} />
      </div>
    );
  }
  return <AbsoluteFill style={{ background: '#120c08', overflow: 'hidden' }}>{layers}</AbsoluteFill>;
};

// ── Escena 3 · cada foto se revela como una instantánea; la de los pasteles sigue revelándose de más
type Rev = { src: string; f0: number; cx: number; cy: number; over?: [number, number] };
export const EscRevelado: React.FC<{ fotos: Rev[]; dur: number }> = ({ fotos, dur }) => {
  const f = useCurrentFrame();
  let k = 0; fotos.forEach((p, i) => { if (f >= p.f0) k = i; });
  const p = fotos[k];
  const end = fotos[k + 1]?.f0 ?? dur;
  const lf = f - p.f0;
  const sh = interpolate(lf, [0, 30], [0, 1], { ...CL, easing: Easing.out(Easing.quad) }); // aparecen las sombras
  const co = interpolate(lf, [18, 60], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) }); // después el color
  let bri = lerp(1.6, 1, sh), con = lerp(0.3, 1, sh), sep = lerp(0.85, 0.12, co), sat = lerp(0.15, 1, co);
  if (p.over) {
    const ov = interpolate(f, p.over, [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
    bri *= lerp(1, 0.6, ov); con *= lerp(1, 1.3, ov); sep = lerp(sep, 0.6, ov); sat *= lerp(1, 1.35, ov);
  }
  const s = interpolate(f, [p.f0, end], [1.02, 1.12], CL);
  return (
    <AbsoluteFill style={{ background: "#d9c6a3", overflow: "hidden" }}>
      <div style={{ ...FULL, transformOrigin: `${p.cx}px ${p.cy}px`, transform: `scale(${s})`, filter: `brightness(${bri}) contrast(${con}) sepia(${sep}) saturate(${sat})` }}>
        <Img src={staticFile(p.src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 4 · luz rasante: cada copete de crema echa su sombra mientras los chicos cuentan; la sombra más larga señala la porción ganadora
type Cop = [number, number, number, number]; // cx, base y, ancho, alto (en e_tbl2)
const COPS: Cop[] = [[484, 300, 188, 128], [738, 190, 165, 120], [1087, 180, 158, 125], [1412, 305, 175, 128], [426, 565, 217, 167], [1502, 525, 205, 145], [780, 735, 220, 168]];
const BIG: Cop = [1193, 755, 383, 480];
const BIGPOLY = '1010px 700px,1005px 620px,1040px 520px,1090px 420px,1140px 330px,1180px 278px,1215px 300px,1250px 380px,1300px 470px,1350px 560px,1385px 640px,1375px 720px,1300px 762px,1150px 770px,1050px 752px';
export const EscSombras: React.FC<{ a: string; b: string; fB: number; steps: number[]; fW: number; dur: number }> = ({ a, b, fB, steps, fW, dur }) => {
  const f = useCurrentFrame();
  const bOp = interpolate(f, [fB - 8, fB + 4], [0, 1], CL);
  const sA = interpolate(f, [0, fB], [1.02, 1.1], CL);
  const low = interpolate(f, [fB, fB + 30], [0, 1], { ...CL, easing: io }); // la luz baja y se vuelve rasante
  const camT = interpolate(f, [fW + 20, dur], [0, 1], { ...CL, easing: io });
  const cam = `translate(${lerp(0, 960 - 1193 * 1.25, camT) * 1}px, ${lerp(0, 540 - 560 * 1.25, camT)}px) scale(${lerp(1, 1.25, camT)})`;
  const shadow = (c: Cop, g: number, key: string, big = false) => {
    const L = c[3] * (big ? 1.9 : 1.7) * g, W = c[2] * 0.62;
    return <div key={key} style={{ position: 'absolute', left: c[0], top: c[1] - W / 2 - 6, width: Math.max(1, L), height: W, borderRadius: '50%',
      background: 'radial-gradient(ellipse at 18% 50%, rgba(45,22,6,0.62) 0%, rgba(45,22,6,0.38) 45%, rgba(45,22,6,0) 72%)', filter: 'blur(7px)', transform: 'skewX(-14deg)', transformOrigin: '0 50%' }} />;
  };
  const sh = COPS.map((c, i) => shadow(c, interpolate(f, [steps[i], steps[i] + 10], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }), 's' + i));
  const gBig = interpolate(f, [fW, fW + 26], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const clips = COPS.map((c) => `circle(${c[2] * 0.55}px at ${c[0]}px ${c[1] - c[3] * 0.5}px)`);
  return (
    <AbsoluteFill style={{ background: '#120c08', overflow: 'hidden' }}>
      <div style={{ ...FULL, transformOrigin: '950px 600px', transform: `scale(${sA})` }}><Img src={staticFile(a)} style={FULL} /></div>
      {f >= fB - 8 && (
        <AbsoluteFill style={{ opacity: bOp, overflow: 'hidden' }}>
          <div style={{ ...FULL, transformOrigin: '0 0', transform: cam }}>
            <Img src={staticFile(b)} style={{ ...FULL, filter: `brightness(${lerp(1, 0.86, low)}) sepia(${lerp(0, 0.18, low)})` }} />
            <div style={{ ...FULL, background: `linear-gradient(90deg, rgba(255,214,150,${0.22 * low}) 0%, rgba(255,214,150,0) 45%, rgba(20,10,4,${0.28 * low}) 100%)` }} />
            {sh}
            {shadow(BIG, gBig, 'big', true)}
            {clips.map((cp, i) => <div key={'c' + i} style={{ ...FULL, clipPath: cp }}><Img src={staticFile(b)} style={{ ...FULL, filter: `brightness(${lerp(1, 1.04, low)})` }} /></div>)}
            <div style={{ ...FULL, clipPath: `polygon(${BIGPOLY})` }}><Img src={staticFile(b)} style={{ ...FULL, filter: `brightness(${lerp(1, 1.06, low)})` }} /></div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
