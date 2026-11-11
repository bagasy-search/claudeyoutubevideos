// Héroes de len11a (the ring). Cada uno: {dur (frames), src?, v?}. Mecanismos registrados en D:/rtmp/len11_COMPONENTES.md.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade, Pad, Blueprint, Under, Title, Pencil, Stamp, FromBook, Svg, BowlCut, Cup, Dial, Pumice } from "./kit";

type H = React.FC<{ dur: number; src?: string; v?: number }>;
const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
const X: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 60, p }) => (
  <g transform={`translate(${x} ${y})`} opacity={p > 0 ? 1 : 0}>
    <line x1={-s} y1={-s} x2={-s + 2 * s * cl(p * 2)} y2={-s + 2 * s * cl(p * 2)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
    <line x1={s} y1={-s} x2={s - 2 * s * cl(p * 2 - 1)} y2={-s + 2 * s * cl(p * 2 - 1)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
  </g>
);
const Check: React.FC<{ x: number; y: number; p: number; s?: number; col?: string }> = ({ x, y, p, s = 1, col = K.green }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 0 L-8 24 L36 -30" fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);
const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontFamily={font} fontWeight={w} fontSize={size} fill={col} textAnchor={anchor} opacity={op}>{s}</text>
);

// 1 · rueda de boletas: los 6 pasos giran como un tambor de talonarios
const PASOS = ["WATER DOWN", "WARM CUP", "TOWELS ON", "15 MINUTES", "WET STONE", "FLUSH"];
export const carrusel: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const rot = lerp(0, 300, eio(pr(t, 0.3, D - 0.6)));
  const cur = Math.min(5, Math.floor((t - 0.3) / ((D - 0.9) / 6)));
  return (<F dur={dur}><Blueprint><Svg>
    {txt(960, 150, "THE WHOLE TRICK", 34, K.copper, 700, SANS)}
    {PASOS.map((p, i) => {
      const a = ((i * 60 - rot) * Math.PI) / 180; const z = Math.cos(a);
      const x = 960 + Math.sin(a) * 620, sc = 0.55 + 0.45 * (z + 1) / 2;
      return { z, el: (<g key={i} transform={`translate(${x} 560) scale(${sc})`} opacity={0.35 + 0.65 * (z + 1) / 2}>
        <rect x={-230} y={-280} width={460} height={560} rx={10} fill={K.pad} stroke={K.ink} strokeWidth={5} />
        <rect x={-230} y={-280} width={460} height={90} fill={K.navy} />
        {txt(0, -220, `STEP ${i + 1}`, 40, K.cream, 700, SANS)}
        {txt(0, 40, String(i + 1), 220, K.blue)}
        {txt(0, 200, p, 48, K.ink)}
        {i <= cur && t > 0.5 && <Check x={170} y={-130} p={1} s={1.2} col={K.red} />}
      </g>) };
    }).sort((a, b) => a.z - b.z).map((x) => x.el)}
  </Svg></Blueprint></F>);
};

// 2 · cal fría vs tibia: dos costras, la tibia se come antes
export const lime_eat: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const crust = (x: number, k: number, lab: string, col: string) => {
    const e = cl(pr(t, 0.4, D - 0.3) * k);
    return (<g transform={`translate(${x} 600)`}>
      <rect x={-300} y={60} width={600} height={60} fill={K.porcelain} stroke={K.ink} strokeWidth={4} />
      <path d={`M-260 60 ${Array.from({ length: 14 }, (_, i) => `L${-260 + i * 40} ${60 - (60 + 30 * Math.sin(i * 2.1)) * (1 - e)}`).join(" ")} L260 60 Z`} fill={K.lime} stroke={K.rust} strokeWidth={3} />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-240 + i * 52} cy={40 - ((t * 120 * k + i * 37) % 260)} r={6 + (i % 3) * 3} fill="none" stroke={K.waterD} strokeWidth={3} opacity={0.8} />)}
      {txt(0, 220, lab, 54, col)}
      {txt(0, 290, `${Math.round(e * 100)}% gone`, 36, K.graphite, 600, SANS)}
    </g>);
  };
  return (<F dur={dur}><Pad no="0428"><Svg>{crust(560, 0.45, "COLD VINEGAR", K.waterD)}{crust(1360, 1, "WARM VINEGAR", K.red)}</Svg></Pad></F>);
};

// 3 · la puerta del baño se cierra y un contador de tablillas 15:00 corre en la puerta
export const timer15: H = ({ dur }) => {
  const t = useT(), D = dur / 30, c0 = eio(pr(t, 0.3, 1.3)), left = Math.round(15 * 60 * (1 - pr(t, 1.4, D - 0.3)));
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  return (<F dur={dur}><AbsoluteFill style={{ background: "#CFE3D8" }}><Svg>
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 90} y2={i * 90} stroke="#A9C9B8" strokeWidth={3} />)}
    <rect x={620} y={120} width={680} height={900} fill="#2A2A2A" />
    <g transform={`translate(620 120) scale(${lerp(0.15, 1, c0)} 1)`}><rect width={680} height={900} fill="#E9E2D2" stroke={K.ink} strokeWidth={6} /><rect x={60} y={60} width={560} height={340} fill="none" stroke="#C9C0AC" strokeWidth={6} /><rect x={60} y={480} width={560} height={360} fill="none" stroke="#C9C0AC" strokeWidth={6} /><circle cx={600} cy={470} r={22} fill={K.copper} /></g>
    {c0 > 0.95 && <g transform="translate(960 300)">{(mm + ":" + ss).split("").map((c, i) => <g key={i} transform={`translate(${-190 + i * 95} 0)`}><rect x={-42} y={-70} width={84} height={140} rx={8} fill={c === ":" ? "none" : K.navy} /><line x1={-42} x2={42} y1={0} y2={0} stroke="#000" strokeWidth={3} opacity={c === ":" ? 0 : 1} />{txt(0, 36, c, 100, c === ":" ? K.navy : K.cream, 700, SANS)}</g>)}</g>}
    <Pencil t={t} at={1.6} x={1360} y={700} text="walk away" size={64} />
  </Svg></AbsoluteFill></F>);
};

// 4 · el corte que vuelve (hilo conductor): 5 visitas, cada una con una acción nueva
export const ring_cut: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  if (v === 0) { // lupa: el anillo es piedra en capas
    const z = eio(pr(t, 0.2, 1.2));
    return (<F dur={dur}><Blueprint><Svg>
      <BowlCut x={700} y={330} s={1.1} ring={1} />
      <g opacity={z}><circle cx={1400} cy={520} r={300} fill={K.cream} stroke={K.copper} strokeWidth={14} />
        <clipPath id="lupa0"><circle cx={1400} cy={520} r={290} /></clipPath>
        <g clipPath="url(#lupa0)">{Array.from({ length: 9 }, (_, i) => <rect key={i} x={1100} y={300 + i * 52} width={600} height={50} fill={i % 2 ? "#B79A6A" : "#A0814F"} transform={`skewY(${(i % 3) - 1})`} opacity={cl((t - 0.6 - i * 0.08) * 4)} />)}</g>
        <line x1={1190} y1={720} x2={1050} y2={860} stroke={K.copper} strokeWidth={30} strokeLinecap="round" /></g>
      <line x1={990} y1={455} x2={1110} y2={500} stroke={K.copper} strokeWidth={4} strokeDasharray="10 8" opacity={z} />
      {txt(1400, 920, "LAYERS OF ROCK", 52, K.cream)}
    </Svg></Blueprint></F>);
  }
  if (v === 1) { // la sierra corta el inodoro y las mitades se abren
    const cut = pr(t, 0.3, 1.6), open = eio(pr(t, 1.6, 2.6));
    return (<F dur={dur}><Blueprint><Svg>
      <g transform={`translate(${-open * 260} 0)`} opacity={1 - open * 0.5}><path d="M660 380 Q660 700 900 730 L920 840 L960 840 L960 380 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={6} /></g>
      <g transform={`translate(${open * 120} 0)`} opacity={1 - open}><path d="M960 380 L960 840 L1000 840 L1020 730 Q1260 700 1260 380 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={6} /></g>
      <line x1={960} y1={300} x2={960} y2={300 + 600 * cut} stroke={K.red} strokeWidth={6} strokeDasharray="22 12" />
      <g opacity={open}><BowlCut x={1180} y={360} s={1} ring={1} glow={0.6 + 0.4 * Math.sin(t * 5)} /></g>
      <Pencil t={t} at={2.8} x={1250} y={300} text="the ring" to={[1430, 470]} col={K.cream} size={56} />
    </Svg></Blueprint></F>);
  }
  if (v === 2) { // el vinagre ablanda las capas de arriba y la piedra las levanta
    const soft = pr(t, 0.4, 3), lift = pr(t, 3.4, D - 0.6);
    return (<F dur={dur}><Blueprint><Svg>
      <g transform="translate(960 560)">
        {Array.from({ length: 6 }, (_, i) => {
          const isSoft = i < 3, up = isSoft ? lift : 0;
          return <rect key={i} x={-500 + (isSoft ? up * 700 * (1 - i * 0.2) : 0)} y={-150 + i * 50 - up * (120 + i * 30)} width={1000} height={46} rx={isSoft ? 18 * soft : 2}
            fill={isSoft ? `rgb(${lerp(160, 222, soft)},${lerp(129, 205, soft)},${lerp(79, 170, soft)})` : "#9C7C4A"} opacity={1 - up * 0.8} />;
        })}
        <rect x={-500} y={150} width={1000} height={160} fill={K.porcelain} stroke={K.ink} strokeWidth={4} />
        <Pumice x={-400 + lift * 800} y={-150} s={0.8} rot={-90} />
      </g>
      <Pencil t={t} at={0.8} x={300} y={260} text="soft on top" col={K.cream} size={54} />
      <Pencil t={t} at={1.8} x={1300} y={980} text="hard underneath (wait more)" col={K.cream} size={44} />
    </Svg></Blueprint></F>);
  }
  if (v === 3) { // rayas grises que aparecen en la porcelana
    return (<F dur={dur}><Blueprint><Svg>
      <circle cx={960} cy={540} r={380} fill={K.porcelain} stroke={K.copper} strokeWidth={16} />
      {Array.from({ length: 22 }, (_, i) => { const p = pr(t, 0.2 + i * 0.08, 0.6 + i * 0.08); const y = 300 + i * 22; const x0 = 680 + (i * 53) % 120;
        return <line key={i} x1={x0} y1={y} x2={x0 + 480 * p} y2={y + 30 * p} stroke="#7E8287" strokeWidth={2 + (i % 3)} opacity={0.75} />; })}
      {txt(960, 1020, "FINE GRAY SCRATCHES", 46, K.cream)}
    </Svg></Blueprint></F>);
  }
  // v4 · el canal escondido del borde se llena de vinagre
  const fill = eio(pr(t, 0.2, D - 0.4));
  return (<F dur={dur}><Blueprint><Svg>
    <ellipse cx={960} cy={560} rx={620} ry={250} fill="none" stroke={K.porcelain} strokeWidth={70} />
    <ellipse cx={960} cy={560} rx={620} ry={250} fill="none" stroke={K.lime} strokeWidth={30} pathLength={1} strokeDasharray={`${fill} 1`} strokeDashoffset={0.25} />
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <circle key={i} cx={960 + Math.cos(a) * 620} cy={560 + Math.sin(a) * 250} r={9} fill={K.navy} />; })}
    <path d="M960 120 L960 310" stroke={K.lime} strokeWidth={30} />
    {txt(960, 100, "OVERFLOW TUBE", 36, K.cream, 700, SANS)}
    {txt(960, 900, "THE HIDDEN CHANNEL", 52, K.cream)}
  </Svg></Blueprint></F>);
};

// 5 · iones de calcio y magnesio flotando en el agua
export const lake_ion: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: `linear-gradient(${K.water}, ${K.waterD})` }}><Svg>
    {Array.from({ length: 18 }, (_, i) => { const ca = i % 2 === 0; const x = 120 + ((i * 211) % 1700), y = 260 + ((i * 137) % 640) + Math.sin(t * 2 + i) * 20;
      return <g key={i} transform={`translate(${x} ${y}) scale(${spr(t, 0.1 + i * 0.07)})`}><circle r={ca ? 56 : 44} fill={ca ? K.white : K.cream} stroke={K.navy} strokeWidth={4} />{txt(0, 14, ca ? "Ca" : "Mg", ca ? 40 : 34, K.navy)}</g>; })}
    {txt(960, 150, "DISSOLVED IN YOUR WATER", 48, K.white)}
  </Svg></AbsoluteFill></F>);
};

// 6 · gota que se evapora y deja su aro blanco
export const dime: H = ({ dur }) => {
  const t = useT(), D = dur / 30, e = eio(pr(t, 0.3, D - 0.8));
  return (<F dur={dur}><Pad no="0430"><Svg>
    <ellipse cx={960} cy={600} rx={300} ry={110} fill="none" stroke="#fff" strokeWidth={16 * e} opacity={e} />
    <ellipse cx={960} cy={600 - 10 * (1 - e)} rx={300 * (1 - e * 0.95)} ry={110 * (1 - e * 0.95)} fill={K.water} opacity={0.85 * (1 - e)} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${760 + i * 55} 450 q 14 -30 0 -60`} stroke={K.waterD} strokeWidth={4} fill="none" opacity={(1 - e) * 0.7} transform={`translate(0 ${-((t * 40 + i * 15) % 60)})`} />)}
    <Pencil t={t} at={1.6} x={1320} y={500} text="mineral stays" to={[1240, 590]} size={54} />
  </Svg></Pad></F>);
};

// 7 · corte de piedra con la mancha atrapada adentro
export const stain_stone: H = ({ dur }) => {
  const t = useT(), w = eout(pr(t, 0.2, 1.4));
  return (<F dur={dur}><Pad no="0431"><Svg>
    <path d={`M560 760 L640 400 L960 330 L1300 390 L1380 760 Z`} fill="#BBA67E" stroke={K.ink} strokeWidth={6} />
    <path d={`M560 760 L640 400 L960 330 L1300 390 L1380 760 Z`} fill="none" />
    <g opacity={w}><path d="M760 560 C820 480 960 470 1060 520 C1160 570 1120 680 980 680 C860 690 720 650 760 560 Z" fill={K.rust} opacity={0.8} /></g>
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={600} x2={1360} y1={450 + i * 55} y2={440 + i * 55} stroke="rgba(60,40,20,0.25)" strokeWidth={3} />)}
    <Pencil t={t} at={1.3} x={1420} y={540} text="stain, inside" to={[1120, 600]} size={54} />
  </Svg></Pad></F>);
};

// 8 · cloro sobre piedra: el medidor de disolución no se mueve
export const bleach_year: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Pad no="0432"><Svg>
    <rect x={640} y={560} width={420} height={260} rx={30} fill="#A58C62" stroke={K.ink} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={680 + (i * 37) % 340} cy={520 - ((t * 300 + i * 40) % 200)} r={10} fill="#E8F0D0" opacity={0.8} />)}
    <rect x={1260} y={360} width={90} height={460} rx={12} fill="none" stroke={K.ink} strokeWidth={5} />
    <rect x={1268} y={812} width={74} height={0} fill={K.red} />
    {txt(1305, 330, "DISSOLVED", 30, K.graphite, 700, SANS)}{txt(1305, 880, "0%", 64, K.red)}
    <Stamp t={t} at={1.1} x={850} y={400} text="STILL ROCK" size={64} />
  </Svg></Pad></F>);
};

// 9 · libro sobre la tapa del inodoro (objeto en escena)
const BOOKW = 520, BOOKH = 673;
export const book1: H = ({ dur, src }) => {
  const t = useT(), d = spr(t, 0.2, 0.8);
  return (<F dur={dur}><Under src={src} dark={0.25}>
    <div style={{ position: "absolute", left: 700, top: 200 + (1 - d) * -500, width: BOOKW, height: BOOKH, transform: `rotate(${lerp(-14, -4, d)}deg)`, boxShadow: "30px 40px 60px rgba(0,0,0,0.55)" }}>
      <Img src={staticFile("len11a/c/p001.png")} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", right: -14, top: 6, bottom: 6, width: 14, background: "repeating-linear-gradient(0deg,#eee 0 2px,#cfc8b8 2px 4px)" }} />
    </div>
    <FromBook />
  </Under></F>);
};
// página real con cámara que va al recuadro de la cuenta
const PageCam: React.FC<{ page: string; t: number; D: number; fx: number; fy: number; z1?: number; at?: number }> = ({ page, t, D, fx, fy, z1 = 2.6, at = 0.45 }) => {
  const k = eio(pr(t, D * at, D * at + 2.2));
  const H = 1000, W = (H * 1700) / 2200;
  const z = lerp(1, z1, k), cx = lerp(0.5, fx, k), cy = lerp(0.5, fy, k);
  return (<div style={{ position: "absolute", left: 960 - cx * W * z, top: 540 - cy * H * z, width: W * z, height: H * z, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
    <Img src={staticFile(page)} style={{ width: "100%", height: "100%" }} />
  </div>);
};
export const book1p: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2018" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,220,160,0.18), transparent 70%)" }} />
    <PageCam page="len11a/c/p059.png" t={t} D={D} fx={0.84} fy={0.71} />
    <Svg><Pencil t={t} at={1.0} x={140} y={160} text="page 59" size={70} col={K.cream} out={D * 0.45} /></Svg>
    <FromBook />
  </AbsoluteFill></F>);
};
export const book1qr: H = ({ dur }) => {
  const t = useT(), q = spr(t, 0.3, 0.8);
  const H = 900, W = (H * 1700) / 2200;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2018" }}>
    <div style={{ position: "absolute", left: 260, top: 90, width: W, height: H, transform: "rotate(-3deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}><Img src={staticFile("len11a/c/p059.png")} style={{ width: "100%", height: "100%" }} /></div>
    <div style={{ position: "absolute", left: 1060, top: 230, width: 560, padding: 30, background: K.white, transform: `rotate(3deg) scale(${q})`, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", left: 200, top: -26, width: 160, height: 50, background: "rgba(240,225,170,0.85)", transform: "rotate(-4deg)" }} />
      <Img src={staticFile("len11a/c/qr_ring.png")} style={{ width: 500, height: 500, display: "block" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: K.ink, textAlign: "center", marginTop: 10 }}>the book, written down</div>
    </div>
    <FromBook />
  </AbsoluteFill></F>);
};

// 10 · la rosca: el vástago gira, baja al asiento y las flechas de agua se achican hasta cero
export const righty: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.6, D - 1)), flow = 1 - k;
  return (<F dur={dur}><Blueprint><Svg>
    <defs><marker id="ah3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={K.water} /></marker></defs>
    <rect x={360} y={600} width={1200} height={120} fill="none" stroke={K.cream} strokeWidth={6} />
    <rect x={900} y={640} width={120} height={80} fill={K.copper} opacity={0.7} />
    <g transform={`translate(960 ${lerp(300, 520, k)})`}>{Array.from({ length: 10 }, (_, i) => <line key={i} x1={-40} x2={40} y1={-200 + i * 22 + ((t * 120) % 22)} y2={-188 + i * 22 + ((t * 120) % 22)} stroke={K.cream} strokeWidth={5} />)}<rect x={-50} y={-220} width={100} height={240} fill="none" stroke={K.cream} strokeWidth={5} /><rect x={-70} y={20} width={140} height={40} rx={10} fill={K.cream} /></g>
    {[0, 1, 2].map((i) => <path key={i} d={`M${420 + i * 150} 660 l ${90 * flow + 1} 0`} stroke={K.water} strokeWidth={14 * flow + 1} markerEnd="url(#ah3)" opacity={flow > 0.05 ? 1 : 0} />)}
    <path d="M1120 240 A 160 60 0 1 1 1100 300" fill="none" stroke={K.red} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pr(t, 0.3, 1.1)} />
    <Pencil t={t} at={0.3} x={1180} y={200} text="righty tighty" size={60} col={K.cream} />
    {k > 0.97 && txt(1260, 900, "NO FLOW", 60, K.cream)}
  </Svg></Blueprint></F>);
};

// 11 · balde que vacía la taza: el nivel baja y el tanque no repone
export const bucket_siphon: H = ({ dur }) => {
  const t = useT(), D = dur / 30, tip = eio(pr(t, 0.3, 1.3)), lvl = 1 - eio(pr(t, 1.1, D - 1.2)) * 0.8;
  return (<F dur={dur}><Blueprint><Svg>
    <BowlCut x={1100} y={330} s={1.05} lvl={lvl} ring={1} />
    <g transform={`translate(560 360) rotate(${tip * 70})`}><path d="M-110 -150 L110 -150 L85 120 L-85 120 Z" fill="#B9C4CC" stroke={K.ink} strokeWidth={6} /><path d="M-110 -150 Q0 -260 110 -150" fill="none" stroke={K.ink} strokeWidth={5} /></g>
    {tip > 0.8 && <path d={`M720 300 Q900 300 980 ${380 + 30 * Math.sin(t * 9)}`} stroke={K.water} strokeWidth={36 * (1 - pr(t, D - 1.4, D - 1))} fill="none" strokeLinecap="round" />}
    {txt(1100, 960, lvl < 0.4 ? "BOWL STAYS LOW" : "ONE BUCKET, POURED FAST", 48, K.cream)}
  </Svg></Blueprint></F>);
};

// 12 · la gota en la muñeca: tibia deja una mancha ámbar suave; caliente (roja) se tacha
export const thermo_bottle: H = ({ dur }) => {
  const t = useT(), drop = pr(t, 0.4, 1.4), warm = eout(pr(t, 1.4, 2.4));
  return (<F dur={dur}><Pad no="0434"><Svg>
    <path d="M300 760 Q900 700 1700 780 L1700 920 Q900 860 300 920 Z" fill="#E6B998" stroke={K.ink} strokeWidth={5} />
    <g transform="translate(960 260) rotate(150)"><rect x={-60} y={-160} width={120} height={260} rx={30} fill="rgba(255,255,255,0.6)" stroke={K.ink} strokeWidth={5} /><rect x={-30} y={100} width={60} height={60} rx={20} fill={K.copper} /></g>
    {drop < 1 && <circle cx={960} cy={lerp(400, 760, drop)} r={16} fill={K.lime} />}
    <ellipse cx={960} cy={770} rx={120 * warm} ry={30 * warm} fill={K.copper} opacity={0.5} />
    {txt(960, 1000, "WARM, LIKE A BABY'S BOTTLE", 46, K.ink)}
    <g opacity={pr(t, 2.6, 3)}><ellipse cx={1500} cy={560} rx={120} ry={34} fill={K.red} opacity={0.5} />{txt(1500, 480, "hot", 46, K.red, 700, HAND)}<X x={1500} y={560} s={50} p={pr(t, 3, 3.5)} /></g>
  </Svg></Pad></F>);
};

// 13 · concentración: la misma taza en mucha agua vs en el fondo
export const puddle_drop: H = ({ dur }) => {
  const t = useT(), m = eio(pr(t, 0.6, 3));
  const jar = (x: number, lv: number, lab: string, strong: number) => (<g transform={`translate(${x} 0)`}>
    <rect x={-200} y={260} width={400} height={500} fill="none" stroke={K.ink} strokeWidth={6} />
    <rect x={-194} y={760 - 490 * lv} width={388} height={490 * lv} fill={`rgba(201,176,124,${0.15 + 0.75 * strong * m})`} />
    <rect x={-194} y={760 - 490 * lv} width={388} height={490 * lv} fill={K.water} opacity={0.4 * (1 - strong * m)} />
    {txt(0, 840, lab, 46, K.ink)}{txt(0, 900, strong > 0.5 ? "STRONG" : "WATERED DOWN", 34, strong > 0.5 ? K.red : K.graphite, 700, SANS)}
  </g>);
  return (<F dur={dur}><Pad no="0435"><Svg>{jar(620, 0.95, "FULL BOWL", 0.15)}{jar(1300, 0.25, "BOWL DOWN", 1)}{txt(960, 220, "SAME ONE CUP", 44, K.copper, 700, SANS)}</Svg></Pad></F>);
};

// 14 · toalla que se pliega en tira con regla de 2"
export const strip_fold: H = ({ dur }) => {
  const t = useT(), f1 = eio(pr(t, 0.4, 1.6)), f2 = eio(pr(t, 1.8, 3));
  const h = lerp(420, 140, f1 * 0.5 + f2 * 0.5);
  return (<F dur={dur}><Pad no="0436"><Svg>
    <rect x={460} y={540 - h / 2} width={1000} height={h} fill={K.white} stroke="#BFB8A6" strokeWidth={4} />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={480 + (i * 67) % 960} cy={540 - h / 2 + 14 + ((i * 41) % Math.max(10, h - 28))} r={4} fill="#D6D0C2" />)}
    {f2 > 0.9 && <g><rect x={1520} y={470} width={50} height={140} fill={K.copper} />{[0, 1, 2].map((i) => <line key={i} x1={1520} x2={1550} y1={470 + i * 70} y2={470 + i * 70} stroke={K.ink} strokeWidth={4} />)}{txt(1640, 560, '2"', 70, K.ink)}</g>}
    <Pencil t={t} at={3.2} x={460} y={850} text="folded long" size={60} />
  </Svg></Pad></F>);
};

// 15 · pantalla partida: sin toalla el vinagre se escurre, con toalla se queda
export const towel_hold: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = pr(t, 0.4, D - 1);
  const wall = (x: number, towel: boolean) => (<g transform={`translate(${x} 0)`}>
    <path d="M-260 200 Q-120 640 -40 900" fill="none" stroke={K.porcelain} strokeWidth={60} />
    <rect x={-250} y={390} width={60} height={34} fill={K.rust} transform="rotate(-20 -220 400)" />
    {towel ? <rect x={-262} y={360} width={90} height={100} rx={10} fill="#fff" opacity={0.95} transform="rotate(-20 -220 400)" />
      : <circle cx={lerp(-220, -60, k)} cy={lerp(400, 860, k)} r={18} fill={K.lime} />}
    {towel && <circle cx={-220} cy={400} r={20 + 4 * Math.sin(t * 6)} fill={K.lime} opacity={0.6} />}
    {txt(0, 980, towel ? "HELD ON THE RING" : "RUNS TO THE BOTTOM", 40, towel ? K.green : K.red)}
  </g>);
  return (<F dur={dur}><Blueprint><Svg><line x1={960} x2={960} y1={120} y2={1000} stroke={K.cream} strokeWidth={4} opacity={0.5} />{wall(620, false)}{wall(1400, true)}</Svg></Blueprint></F>);
};

// 16 · tres fichas de tiempo: 5 tachado, 2 h tachado, 15 en círculo
export const timer15b: H = ({ dur }) => {
  const t = useT();
  const card = (x: number, s: string, ok: boolean, at: number) => (<g transform={`translate(${x} 540) scale(${spr(t, at)})`}>
    <rect x={-180} y={-180} width={360} height={360} rx={20} fill={K.white} stroke={K.ink} strokeWidth={6} />
    {txt(0, 40, s, 120, K.ink)}
    {ok ? <ellipse rx={210} ry={200} fill="none" stroke={K.green} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pr(t, at + 0.6, at + 1.1)} /> : <X x={0} y={0} s={120} p={pr(t, at + 0.3, at + 0.7)} />}
  </g>);
  return (<F dur={dur}><Pad no="0437"><Svg>{card(500, "5", false, 0.1)}{card(960, "2h", false, 0.6)}{card(1420, "15", true, 1.1)}</Svg></Pad></F>);
};

// 17 · dos botellas que se acercan y una barrera roja cae entre ellas
export const never_mix: H = ({ dur }) => {
  const t = useT(), c = eio(pr(t, 0.3, 1.6)) * (1 - pr(t, 2, 2.3)), wall = spr(t, 2);
  const bottle = (x: number, lab: string, col: string) => (<g transform={`translate(${x} 560)`}><rect x={-90} y={-180} width={180} height={340} rx={30} fill={col} stroke={K.ink} strokeWidth={5} /><rect x={-36} y={-250} width={72} height={80} fill={col} stroke={K.ink} strokeWidth={5} />{txt(0, 20, lab, 40, K.ink, 700, SANS)}</g>);
  return (<F dur={dur}><Pad no="0438"><Svg>
    {bottle(lerp(500, 820, c), "VINEGAR", "#EDE6CF")}{bottle(lerp(1420, 1100, c), "BLEACH", "#DCE7EE")}
    <rect x={940} y={lerp(-400, 260, wall)} width={40} height={600} fill={K.red} />
    <Stamp t={t} at={2.4} x={960} y={900} text="NEVER MIX" size={72} rot={-4} />
  </Svg></Pad></F>);
};

// 18 · prueba de rayado: la piedra mojada pasa por la cal (la marca) y por el esmalte (ni una marca)
export const hardness: H = ({ dur }) => {
  const t = useT();
  const tile = (x: number, lab: string, fill: string, mark: boolean, at: number) => { const p = pr(t, at, at + 1.4); return (<g transform={`translate(${x} 560)`}>
    <rect x={-260} y={-160} width={520} height={320} rx={16} fill={fill} stroke={K.ink} strokeWidth={5} />
    {mark && <path d={`M-220 0 L${-220 + 440 * p} ${-20 * p}`} stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.85} />}
    <g transform={`translate(${-220 + 440 * p} -40)`} opacity={p > 0 && p < 1 ? 1 : 0}><rect x={-60} y={-40} width={120} height={70} rx={20} fill="#8D8F8C" stroke={K.ink} strokeWidth={4} /></g>
    {txt(0, 230, lab, 50, K.ink)}{p >= 1 && (mark ? <Check x={0} y={-230} p={1} s={1.3} /> : txt(0, -210, "not a mark", 44, K.blue, 700, HAND))}
  </g>); };
  return (<F dur={dur}><Pad no="0439"><Svg>{tile(560, "LIME", K.lime, true, 0.6)}{tile(1360, "WHITE GLAZE", K.porcelain, false, 4.2)}{txt(960, 250, "WET PUMICE, SAME PRESSURE", 40, K.copper, 700, SANS)}</Svg></Pad></F>);
};

// 19 · bajo la lupa: granos secos con filo, después el colchón de agua los cubre
export const wet_dry: H = ({ dur }) => {
  const t = useT(), w = eio(pr(t, 1.2, 2.4));
  return (<F dur={dur}><Blueprint><Svg>
    <circle cx={960} cy={540} r={400} fill="#E9EEF0" stroke={K.copper} strokeWidth={16} />
    <rect x={560} y={700} width={800} height={240} fill={K.porcelain} />
    {Array.from({ length: 9 }, (_, i) => <polygon key={i} points={`${600 + i * 90},700 ${640 + i * 90},${620 - (i % 3) * 20} ${680 + i * 90},700`} fill="#8D8F8C" stroke={K.ink} strokeWidth={3} transform={`translate(0 ${-30 * w})`} />)}
    <rect x={560} y={700 - 34 * w} width={800} height={34 * w} fill={K.water} opacity={0.75} />
    {txt(960, 300, w > 0.5 ? "WET: A CUSHION OF WATER" : "DRY: SHARP GRAINS", 54, K.navy)}
  </Svg></Blueprint></F>);
};

// 20 · huella de presión: plano = huella ancha y suave; canto = punto rojo que raya
export const flat_edge: H = ({ dur }) => {
  const t = useT();
  const side = (x: number, rot: number, ok: boolean, at: number) => (<g transform={`translate(${x} 0)`}>
    <rect x={-300} y={640} width={600} height={60} fill={K.porcelain} />
    <ellipse cx={0} cy={640} rx={ok ? 160 : 18} ry={ok ? 14 : 18} fill={ok ? K.waterD : K.red} opacity={pr(t, at + 0.4, at + 0.8)} />
    <Pumice x={0} y={lerp(420, 600, eout(pr(t, at, at + 0.5)))} s={0.8} rot={rot} />
    {ok ? <Check x={0} y={830} p={pr(t, at + 0.8, at + 1.2)} s={1.4} /> : <X x={0} y={830} s={50} p={pr(t, at + 0.8, at + 1.2)} />}
  </g>);
  return (<F dur={dur}><Pad no="0440"><Svg>{side(520, 0, true, 0.2)}{side(1100, 40, false, 1.2)}{side(1560, 30, false, 1.8)}{txt(520, 300, "FLAT", 52, K.green)}{txt(1330, 300, "EDGE · CORNER", 52, K.red)}</Svg></Pad></F>);
};

// 21 · espiral de círculos chicos dibujándose sobre la franja del anillo
export const circles: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = 160, k = pr(t, 0.2, D - 0.5);
  const pts = Array.from({ length: Math.floor(n * k) }, (_, i) => { const a = i * 0.45; return `${560 + i * 5 + Math.cos(a) * 50},${540 + Math.sin(a) * 50}`; });
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={440} y={480} width={1040} height={120} fill={K.rust} opacity={0.6} />
    <polyline points={pts.join(" ")} fill="none" stroke={K.cream} strokeWidth={5} />
    {pts.length > 0 && <g transform={`translate(${pts[pts.length - 1]})`}><rect x={-50} y={-30} width={100} height={60} rx={16} fill="#8D8F8C" stroke={K.ink} strokeWidth={4} /></g>}
    {txt(960, 300, "SMALL CIRCLES", 64, K.cream)}
  </Svg></Blueprint></F>);
};

// 22 · perfil de rugosidad que se alisa al pasar el dedo
export const finger_rough: H = ({ dur }) => {
  const t = useT(), x = lerp(360, 1560, eio(pr(t, 0.2, 2.8)));
  const path = Array.from({ length: 121 }, (_, i) => { const xx = 360 + i * 10; const rough = xx > x ? 1 : 0; return `${xx},${560 + rough * (Math.sin(i * 1.7) * 26 + Math.sin(i * 0.6) * 14)}`; }).join(" ");
  return (<F dur={dur}><Pad no="0441"><Svg>
    <polyline points={path} fill="none" stroke={K.ink} strokeWidth={6} />
    <ellipse cx={x} cy={500} rx={60} ry={80} fill="#E2B796" stroke={K.ink} strokeWidth={4} />
    <Pencil t={t} at={0.5} x={380} y={420} text="smooth" size={56} col={K.green} />
    <Pencil t={t} at={0.5} x={1560} y={720} text="rough = still there" size={46} anchor="end" />
  </Svg></Pad></F>);
};

// 23 · cuatro vagones que se enganchan en un solo tren (una sola línea)
export const oneline: H = ({ dur }) => {
  const t = useT(); const parts = ["WATER DOWN", "WARM CUP", "TOWELS ON", "15 MIN"];
  return (<F dur={dur}><Blueprint><Svg>
    <line x1={0} x2={1920} y1={740} y2={740} stroke={K.cream} strokeWidth={6} />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50 - ((t * 200) % 50)} y={744} width={30} height={12} fill={K.cream} opacity={0.5} />)}
    {parts.map((p, i) => { const at = 0.2 + i * 1.1; const x = lerp(2200, 160 + i * 410, eout(pr(t, at, at + 0.9))); return (<g key={i} transform={`translate(${x} 0)`}>
      <rect x={0} y={520} width={370} height={180} rx={12} fill={i % 2 ? K.copper : K.red} stroke={K.ink} strokeWidth={5} />
      <circle cx={80} cy={710} r={30} fill={K.ink} /><circle cx={290} cy={710} r={30} fill={K.ink} />
      <rect x={370} y={600} width={40} height={16} fill={K.ink} />{txt(185, 630, p, 40, K.cream, 700, SANS)}</g>); })}
    {txt(960, 300, "ONE LINE", 70, K.cream)}
  </Svg></Blueprint></F>);
};

// 24 · ticket que se imprime con la lista de cosas de la casa
export const receipt: H = ({ dur }) => {
  const t = useT(); const L = [["MEASURING CUP", "kitchen", 0], ["PAPER TOWELS", "1 roll", 3], ["RUBBER GLOVES", "yellow", 5.6], ["BUCKET", "", 8.3], ["PUMICE STONE", "", 9.2]] as const;
  const h = 200 + 110 * L.filter((l) => t > l[2]).length;
  return (<F dur={dur}><Pad no="0443"><Svg>
    <rect x={720} y={140} width={480} height={30} fill={K.ink} />
    <path d={`M740 170 L1180 170 L1180 ${170 + h} ${Array.from({ length: 12 }, (_, i) => `L${1180 - i * 37 - 18} ${170 + h + 14} L${1180 - (i + 1) * 37} ${170 + h}`).join(" ")} L740 ${170 + h} Z`} fill={K.white} stroke="#ccc" strokeWidth={2} />
    {txt(960, 240, "HOUSE CALL — PARTS", 30, K.graphite, 700, SANS)}
    {L.map((l, i) => t > l[2] && <g key={i}>{txt(770, 330 + i * 110, l[0], 38, K.ink, 700, SANS, "start")}{l[1] && txt(770, 370 + i * 110, l[1], 28, K.graphite, 500, SANS, "start")}<Check x={1130} y={320 + i * 110} p={pr(t, l[2] + 0.3, l[2] + 0.7)} s={0.8} /></g>)}
  </Svg></Pad></F>);
};

// 25 · escalón: la uña se engancha en un borde de mineral
export const nail_step: H = ({ dur }) => {
  const t = useT(), x = lerp(400, 940, eio(pr(t, 0.3, 2.2))), bump = t > 2.2 ? Math.sin((t - 2.2) * 30) * 6 * Math.exp(-(t - 2.2) * 4) : 0;
  return (<F dur={dur}><Blueprint><Svg>
    <path d="M300 700 L1000 700 L1000 640 L1600 640 L1600 800 L300 800 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={5} />
    <rect x={1000} y={640} width={600} height={60} fill={K.lime} opacity={0.9} />
    <g transform={`translate(${x + bump} 610)`}><path d="M-60 -20 Q0 -60 60 -20 L60 90 L-60 90 Z" fill="#E2B796" stroke={K.ink} strokeWidth={4} /><rect x={-40} y={50} width={80} height={40} rx={10} fill="#F5E3D3" stroke={K.ink} strokeWidth={3} /></g>
    <Pencil t={t} at={2.4} x={1040} y={520} text="a ledge = mineral" size={56} col={K.cream} to={[1010, 640]} />
  </Svg></Blueprint></F>);
};

// 26 · tanque y taza: el agua del tanque baja con mineral y el anillo vuelve a crecer
export const tank_bowl: H = ({ dur }) => {
  const t = useT(), D = dur / 30, fl = pr(t, 0.6, 2.6), g = eio(pr(t, 2.4, D - 0.6));
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={1150} y={160} width={420} height={300} rx={20} fill={K.porcelain} stroke={K.ink} strokeWidth={6} />
    <rect x={1170} y={200 + 230 * fl} width={380} height={240 - 230 * fl} fill={K.water} opacity={0.8} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1200 + (i * 41) % 340} cy={250 + (i * 29) % 180 + fl * 200} r={7} fill={K.lime} opacity={1 - fl} />)}
    {fl > 0 && fl < 1 && <path d="M1150 420 Q1000 420 900 400" stroke={K.water} strokeWidth={30} fill="none" />}
    <BowlCut x={700} y={360} s={0.9} ring={0.3 + 0.7 * g} />
    {txt(1360, 520, "MINERAL WATER IN THE TANK", 34, K.cream, 700, SANS)}
  </Svg></Blueprint></F>);
};

// 27 · cinco etiquetas rojas que se apilan y la factura de $250 que se suma
export const carrusel_err: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><Pad no="0444"><Svg>
    {[0, 1, 2, 3, 4].map((i) => { const p = spr(t, 0.3 + i * 0.5); return (<g key={i} transform={`translate(${420 + i * 180} ${560 + (1 - p) * 500}) rotate(${-8 + i * 4})`} opacity={cl(p * 2)}>
      <rect x={-90} y={-160} width={180} height={300} rx={14} fill={K.red} /><circle cx={0} cy={-120} r={16} fill={K.pad} />{txt(0, 30, `${i + 1}`, 120, K.cream)}{txt(0, 110, "MISTAKE", 26, K.cream, 700, SANS)}</g>); })}
    <g transform="translate(1520 560)"><rect x={-200} y={-140} width={400} height={280} fill={K.white} stroke={K.ink} strokeWidth={5} />{txt(0, -80, "PLUMBER", 36, K.graphite, 700, SANS)}{txt(0, 50, `$${Math.round(250 * eout(pr(t, 2.5, D - 1)))}`, 110, K.red)}</g>
  </Svg></Pad></F>);
};

// 28 · gráfico de temperatura que se rompe: subida suave bien; el salto vertical rasga el papel
export const crack: H = ({ dur }) => {
  const t = useT(), p = pr(t, 0.3, 1.6), tear = eio(pr(t, 1.8, 2.6));
  return (<F dur={dur}><Pad no="0450"><Svg>
    <line x1={300} x2={1640} y1={860} y2={860} stroke={K.ink} strokeWidth={4} /><line x1={300} x2={300} y1={300} y2={860} stroke={K.ink} strokeWidth={4} />
    {txt(280, 320, "°F", 34, K.graphite, 700, SANS, "end")}
    <polyline points={`300,800 ${300 + 600 * p},${800 - 160 * p}`} fill="none" stroke={K.blue} strokeWidth={8} />
    {p >= 1 && <polyline points={`900,640 960,${640 - 300 * pr(t, 1.6, 1.8)}`} fill="none" stroke={K.red} strokeWidth={8} />}
    <g transform={`translate(${tear * 40} ${tear * 20}) rotate(${tear * 4} 1100 600)`} opacity={tear > 0 ? 1 : 0}><polyline points="960,300 990,420 950,520 1000,640 960,760 990,880" fill="none" stroke={K.ink} strokeWidth={5} /></g>
    {txt(560, 760, "slow: fine", 44, K.blue, 700, HAND)}{txt(1150, 360, "sudden: crack", 44, K.red, 700, HAND, "start", pr(t, 2, 2.4))}
  </Svg></Pad></F>);
};

// 29 · microscopio: esquirlas de metal clavadas en los poros
export const metal_marks: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Blueprint><Svg>
    <circle cx={960} cy={540} r={400} fill={K.porcelain} stroke={K.copper} strokeWidth={16} />
    {Array.from({ length: 26 }, (_, i) => { const x = 700 + (i * 97) % 520, y = 320 + (i * 61) % 440; const p = spr(t, 0.4 + i * 0.12);
      return <g key={i} transform={`translate(${x} ${y})`}><circle r={14} fill="#E6E2D8" /><path d={`M0 ${-40 * (1 - p)} l -9 18 l 18 0 Z`} fill="#62686E" opacity={cl(p)} /></g>; })}
    <Pencil t={t} at={3} x={1400} y={300} text="metal, stuck in" size={52} col={K.cream} to={[1180, 420]} />
  </Svg></Blueprint></F>);
};

// 30 · botella calavera (genérica) y la lista de lo que se come, tachada al decirla
export const skull_list: H = ({ dur }) => {
  const t = useT(); const L = [["CHROME HANDLE", 0.5], ["OLD IRON PIPES", 2.3], ["WAX SEAL", 4.6], ["SKIN · EYES", 7.4]] as const;
  return (<F dur={dur}><Pad no="0445"><Svg>
    <g transform="translate(470 560)"><rect x={-130} y={-200} width={260} height={400} rx={30} fill="#D9D2B8" stroke={K.ink} strokeWidth={6} /><rect x={-50} y={-270} width={100} height={80} fill={K.ink} />
      <circle cx={0} cy={-30} r={60} fill={K.white} stroke={K.ink} strokeWidth={5} /><circle cx={-22} cy={-38} r={12} fill={K.ink} /><circle cx={22} cy={-38} r={12} fill={K.ink} /><path d="M-60 60 L60 120 M60 60 L-60 120" stroke={K.ink} strokeWidth={10} /></g>
    {txt(820, 230, "IT ALSO EATS:", 40, K.copper, 700, SANS, "start")}
    {L.map(([s, at], i) => <g key={i} opacity={cl((t - at) * 3)}>{txt(820, 340 + i * 130, s, 66, K.ink, 700, SLAB, "start")}
      <line x1={810} y1={318 + i * 130} x2={810 + 700 * pr(t, at + 0.4, at + 0.9)} y2={318 + i * 130} stroke={K.red} strokeWidth={8} /></g>)}
    <Stamp t={t} at={10.5} x={1450} y={900} text="45 YRS: NEVER" size={54} rot={-6} />
  </Svg></Pad></F>);
};

// 31 · corte de capas: esmalte de color fino sobre arcilla, la piedra lo atraviesa
export const glaze_colors: H = ({ dur }) => {
  const t = useT(), cols = ["#E2A6B4", "#9DB8D6", "#8C9A5A", "#E3D3B3"], ci = Math.min(3, Math.floor(t / 0.7)), cut = eio(pr(t, 2.8, 4.2));
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={460} y={580} width={1000} height={260} fill="#C9B79A" />
    <rect x={460} y={540} width={1000} height={40} fill={cols[ci]} />
    <rect x={900} y={540} width={260 * cut} height={46} fill="#C9B79A" />
    <Pumice x={900 + 260 * cut} y={500} s={0.7} />
    {txt(1500, 570, "thin color", 40, K.cream, 700, HAND, "start")}{txt(1500, 720, "clay", 40, K.cream, 700, HAND, "start")}
    {cut > 0.6 && <Stamp t={t} at={3.8} x={960} y={300} text="NO STONE" size={64} />}
  </Svg></Blueprint></F>);
};

// 32 · muestrario de anillos tipo carta de colores, el primero se elige
export const ring_chips: H = ({ dur }) => {
  const t = useT(); const C = [["FRESH GRAY", "#9A9C9E", "15 min"], ["OLD BROWN", "#7A5A36", "+ second round"], ["BLACK, 10 YRS+", "#2E2A26", "overnight"]];
  return (<F dur={dur}><Pad no="0446"><Svg>{C.map(([n, c, s], i) => { const sel = i === 0; const p = spr(t, 0.2 + i * 0.25); return (<g key={i} transform={`translate(${520 + i * 440} ${560 - (sel ? 40 * pr(t, 1.2, 1.6) : 0)}) scale(${p})`}>
    <rect x={-170} y={-260} width={340} height={520} rx={12} fill={K.white} stroke={sel ? K.red : "#ccc"} strokeWidth={sel ? 8 : 3} />
    <rect x={-140} y={-230} width={280} height={260} fill={c} />{txt(0, 110, n, 34, K.ink, 700, SANS)}{txt(0, 180, s, 40, K.graphite, 700, HAND)}</g>); })}</Svg></Pad></F>);
};

// 33 · nivel que baja día a día en un inodoro sin uso, dejando aros
export const evaporate: H = ({ dur }) => {
  const t = useT(), D = dur / 30, d = Math.floor(pr(t, 0.2, D - 0.4) * 5);
  return (<F dur={dur}><Blueprint><Svg>
    <BowlCut x={760} y={330} s={1} lvl={1 - d * 0.16} ring={0} />
    {Array.from({ length: d }, (_, i) => <rect key={i} x={540} y={330 + 120 + i * 21} width={440} height={6} fill={K.rust} opacity={0.8} />)}
    <g transform="translate(1400 520)"><rect x={-150} y={-170} width={300} height={320} fill={K.white} stroke={K.ink} strokeWidth={5} /><rect x={-150} y={-170} width={300} height={70} fill={K.red} />{txt(0, 60, `WEEK ${d + 1}`, 60, K.ink)}</g>
  </Svg></Blueprint></F>);
};

// 34 · sifón con el agujero del chorro que late y empuja una flecha
export const jet_hole: H = ({ dur }) => {
  const t = useT(), p = 1 + 0.15 * Math.sin(t * 8);
  return (<F dur={dur}><Blueprint><Svg>
    <BowlCut x={960} y={300} s={1.1} ring={0} />
    <circle cx={960} cy={300 + 455} r={22 * p} fill={K.red} />
    <path d="M960 700 L960 600" stroke={K.red} strokeWidth={10} markerEnd="url(#ah2)" opacity={pr(t, 0.8, 1.2)} />
    <defs><marker id="ah2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={K.red} /></marker></defs>
    <Pencil t={t} at={1} x={1200} y={860} text="the jet" to={[985, 760]} size={56} col={K.cream} />
  </Svg></Blueprint></F>);
};

// 35 · el peine: arrastra pintura; donde falta un diente, falta una raya
export const rim_jets: H = ({ dur }) => {
  const t = useT(), y = lerp(330, 820, eio(pr(t, 0.5, 3.6))), gone = [3, 7, 8, 12];
  return (<F dur={dur}><Pad no="0447"><Svg>
    {Array.from({ length: 16 }, (_, i) => gone.includes(i) ? null : <rect key={i} x={420 + i * 70} y={260} width={26} height={y - 260} fill={K.waterD} opacity={0.75} />)}
    <rect x={380} y={y - 70} width={1160} height={50} rx={10} fill={K.copper} stroke={K.ink} strokeWidth={4} />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={420 + i * 70} y={y - 22} width={26} height={gone.includes(i) ? 10 : 46} fill={K.copper} stroke={K.ink} strokeWidth={3} />)}
    <Pencil t={t} at={3.8} x={300} y={980} text="crusted hole = missing streak = weak flush" size={48} />
  </Svg></Pad></F>);
};

// 36 · páginas que pasan hasta la 53
export const book2: H = ({ dur, src }) => {
  const t = useT(), n = Math.min(53, Math.round(lerp(1, 53, eio(pr(t, 0.4, 3)))));
  const W = 560, H = (W * 2200) / 1700;
  return (<F dur={dur}><Under src={src} dark={0.4}>
    <div style={{ position: "absolute", left: 960 - W, top: 540 - H / 2, width: W * 2, height: H, display: "flex", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", perspective: 2000 }}>
      <div style={{ width: W, height: H, background: K.cream }} />
      <div style={{ width: W, height: H, background: K.cream, overflow: "hidden" }}>{n >= 53 && <Img src={staticFile("len11a/c/p053.png")} style={{ width: "100%", height: "100%" }} />}</div>
      {n < 53 && <div style={{ position: "absolute", left: W, top: 0, width: W, height: H, background: "#EFE6D2", transformOrigin: "0 50%", transform: `rotateY(${-((t * 900) % 180)}deg)` }} />}
    </div>
    <div style={{ position: "absolute", left: 140, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: K.cream }}>page {n}</div>
    <FromBook />
  </Under></F>);
};
export const book2bill: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2018" }}>
    <PageCam page="len11a/c/p053.png" t={t} D={D} fx={0.84} fy={0.725} z1={2.4} at={0.08} />
    <Svg><Stamp t={t} at={D * 0.6} x={560} y={820} text="YOU KEEP $296" size={60} col={K.green} rot={-8} /></Svg>
    <FromBook />
  </AbsoluteFill></F>);
};

// 37 · orden de trabajo mensual: casillas que se tildan, una taza de café humeando al lado
export const workorder: H = ({ dur }) => {
  const t = useT(); const L = [["Bucket trick, water down", 0.8], ["1 cup warm vinegar on the line", 2.6], ["Coffee while it sits", 6.2], ["Brush, flush", 9.4]] as const;
  return (<F dur={dur}><Pad no="0501"><Svg>
    {txt(200, 220, "MONTHLY · FIRST SUNDAY", 44, K.blue, 700, SANS, "start")}
    {L.map(([s, at], i) => <g key={i}><rect x={200} y={290 + i * 130} width={60} height={60} fill="none" stroke={K.ink} strokeWidth={5} /><Check x={230} y={320 + i * 130} p={pr(t, at + 0.6, at + 1)} col={K.red} />
      <Pencil t={t} at={at} x={300} y={340 + i * 130} text={s} size={56} col={K.ink} /></g>)}
    <g transform="translate(1520 600)"><path d="M-120 -120 L120 -120 L100 140 L-100 140 Z" fill={K.white} stroke={K.ink} strokeWidth={6} /><path d="M120 -60 Q200 -50 190 20 Q180 70 110 60" fill="none" stroke={K.ink} strokeWidth={10} /><ellipse cx={0} cy={-120} rx={120} ry={18} fill="#5A3A22" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-50 + i * 50} -150 q 18 -30 0 -60 q -18 -30 0 -60`} fill="none" stroke={K.graphite} strokeWidth={5} opacity={0.35 + 0.25 * Math.sin(t * 3 + i)} />)}</g>
    <Stamp t={t} at={11.4} x={1500} y={900} text="3 MIN" size={70} />
  </Svg></Pad></F>);
};

// 38 · tablero de luces: tres lámparas de aviso se encienden una a una
export const why3: H = ({ dur }) => {
  const t = useT(); const B = [["TOWELS SLID", 0.3], ["WATER CAME BACK", 2.2], ["RING TOO OLD", 5.6]] as const;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2B2F33" }}><Svg>
    <rect x={260} y={260} width={1400} height={560} rx={30} fill="#3C4248" stroke="#14181B" strokeWidth={10} />
    {B.map(([s, at], i) => { const on = t > at; const x = 560 + i * 400; return (<g key={i}>
      {on && <circle cx={x} cy={470} r={140} fill={i === 2 ? K.copper : K.red} opacity={0.18 + 0.08 * Math.sin(t * 8)} />}
      <circle cx={x} cy={470} r={90} fill={on ? (i === 2 ? K.copper : K.red) : "#5A2622"} stroke="#111" strokeWidth={8} />
      <rect x={x - 170} y={620} width={340} height={80} fill={K.cream} />{txt(x, 675, s, 34, K.ink, 700, SANS)}</g>); })}
  </Svg></AbsoluteFill></F>);
};

// 39 · corte de porcelana: vidrio sobre arcilla, con capa de luz que la atraviesa
export const glass_clay: H = ({ dur }) => {
  const t = useT(), g = eio(pr(t, 0.3, 1.5)), sh = pr(t, 1.6, 3.4);
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={460} y={560} width={1000} height={260} fill="#C9A27A" />
    <rect x={460} y={560 - 70 * g} width={1000} height={70 * g} fill="rgba(220,240,255,0.75)" />
    <rect x={460 + 1000 * sh - 60} y={490} width={60} height={70} fill="#fff" opacity={0.7 * (1 - Math.abs(sh - 0.5) * 2)} />
    {txt(1500, 540, "GLASS", 50, K.cream, 700, SLAB, "start")}{txt(1500, 720, "CLAY", 50, K.cream, 700, SLAB, "start")}
    {txt(960, 960, "FIRED TOGETHER", 40, K.copper, 700, SANS)}
  </Svg></Blueprint></F>);
};

// 40 · cartel de tablillas (split-flap) que gira hasta TOLEDO 1979
export const map_toledo: H = ({ dur }) => {
  const t = useT(); const target = "TOLEDO 1979", AL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1B1E22" }}><Svg>
    {target.split("").map((c, i) => { const stop = 0.5 + i * 0.18; const spinning = t < stop && c !== " "; const ch = spinning ? AL[Math.floor(t * 30 + i * 7) % AL.length] : c; const x = 960 + (i - 5) * 150;
      return (<g key={i} transform={`translate(${x} 540)`}><rect x={-66} y={-110} width={132} height={220} rx={10} fill="#0E1012" /><line x1={-66} x2={66} y1={0} y2={0} stroke="#000" strokeWidth={4} />{txt(0, 50, ch, 150, spinning ? "#9AA0A6" : K.cream, 700, SANS)}</g>); })}
    {txt(960, 800, "I WAS NINETEEN", 44, K.copper, 700, SANS, "middle", pr(t, 2.6, 3))}
  </Svg></AbsoluteFill></F>);
};

// 41 · cinta transportadora: seis inodoros pasan por la estación y salen blancos
export const sequence5: H = ({ dur }) => {
  const t = useT(), off = t * 300;
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={0} y={760} width={1920} height={40} fill="#556" />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 70 + off) % 1990 - 35} cy={780} r={14} fill="#889" />)}
    <rect x={860} y={300} width={200} height={300} fill="none" stroke={K.cream} strokeWidth={6} />{txt(960, 280, "WATER · VINEGAR · WAIT · STONE · FLUSH", 30, K.cream, 700, SANS)}
    {Array.from({ length: 6 }, (_, i) => { const x = -100 - i * 330 + off; if (x < -200 || x > 2100) return null; const clean = x > 960; return (<g key={i} transform={`translate(${x} 640)`}>
      <path d="M-80 -80 L80 -80 Q80 60 20 70 L20 120 L-20 120 L-20 70 Q-80 60 -80 -80 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={4} />{!clean && <rect x={-70} y={-60} width={140} height={14} fill={K.rust} />}</g>); })}
    {txt(1700, 960, `${Math.min(6, Math.max(0, Math.floor((off - 1060) / 330) + 1))} / 6`, 70, K.cream)}
  </Svg></Blueprint></F>);
};

// 42 · el pinchador de facturas: la boleta de Gus baja y queda clavada en la púa
export const envelope: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.3, 1.2));
  return (<F dur={dur}><Pad no="1979"><Svg>
    <ellipse cx={960} cy={900} rx={180} ry={40} fill="#3A2A1C" /><line x1={960} y1={900} x2={960} y2={330} stroke="#9AA0A6" strokeWidth={10} />
    <g transform={`translate(960 ${lerp(-200, 560, d)}) rotate(${lerp(-20, 4, d)})`}><rect x={-260} y={-200} width={520} height={340} fill={K.white} stroke={K.ink} strokeWidth={3} />
      {txt(0, -120, "GUS · PLUMBING", 34, K.graphite, 700, SANS)}{txt(0, -30, "4 hrs labor", 54, K.ink, 700, HAND)}{txt(0, 50, "+ vinegar", 54, K.ink, 700, HAND)}<circle cx={0} cy={-230} r={8} fill={K.ink} /></g>
    <Stamp t={t} at={1.8} x={1450} y={300} text="PAID" size={80} col={K.green} />
  </Svg></Pad></F>);
};

// 43 · rodaja de limón que se cristaliza en ácido cítrico
export const lemon_crystal: H = ({ dur }) => {
  const t = useT(), m = eio(pr(t, 0.6, 2));
  return (<F dur={dur}><Pad no="0448"><Svg>
    <g transform="translate(960 560)" opacity={1 - m}><circle r={220} fill="#F3D34A" stroke="#C9A21E" strokeWidth={14} />{Array.from({ length: 8 }, (_, i) => <path key={i} d="M0 0 L-60 -180 Q0 -200 60 -180 Z" fill="#F7E58A" transform={`rotate(${i * 45})`} />)}</g>
    <g transform={`translate(960 560) scale(${m})`}>{Array.from({ length: 7 }, (_, i) => <polygon key={i} points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35" fill="#EEF4F6" stroke={K.waterD} strokeWidth={4} transform={`translate(${i === 0 ? 0 : Math.cos(i) * 130} ${i === 0 ? 0 : Math.sin(i) * 130})`} />)}</g>
    {txt(960, 920, "CITRIC ACID", 56, K.ink)}
  </Svg></Pad></F>);
};

// 44 · tanque séptico en corte: una taza se diluye en todo el tanque
export const septic_dilute: H = ({ dur }) => {
  const t = useT(), d = eio(pr(t, 0.8, 4));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#5B4B36" }}><Svg>
    <rect x={360} y={360} width={1200} height={520} rx={60} fill="#3A4A40" stroke={K.ink} strokeWidth={8} />
    <circle cx={lerp(600, 960, d)} cy={lerp(420, 620, d)} r={lerp(30, 520, d)} fill={K.lime} opacity={lerp(0.9, 0.08, d)} />
    <line x1={600} y1={200} x2={600} y2={lerp(200, 400, pr(t, 0.2, 0.8))} stroke={K.lime} strokeWidth={22} />
    {txt(960, 300, "ONE CUP · THOUSAND GALLONS", 44, K.cream, 700, SANS)}
    <Check x={1500} y={300} p={pr(t, 3.8, 4.3)} s={1.4} col={K.cream} />
  </Svg></AbsoluteFill></F>);
};

// 45 · inodoro en corte con piezas de goma que se señalan una a una y quedan fuera del agua
export const seals_map: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={1060} y={160} width={380} height={300} rx={16} fill="none" stroke={K.cream} strokeWidth={5} />
    <BowlCut x={860} y={380} s={0.9} ring={0} />
    <circle cx={1250} cy={420} r={34} fill={K.red} opacity={pr(t, 0.4, 0.7)} />
    <rect x={800} y={800} width={120} height={30} rx={14} fill={K.copper} opacity={pr(t, 4.6, 5)} />
    <Pencil t={t} at={0.5} x={1500} y={300} text="flapper + seals: in the tank" size={46} col={K.cream} to={[1270, 410]} />
    <Pencil t={t} at={4.7} x={1100} y={960} text="wax ring: under, sealed off" size={46} col={K.cream} to={[870, 815]} />
    <rect x={630} y={480} width={480} height={200} fill="none" stroke={K.green} strokeWidth={6} strokeDasharray="16 10" opacity={pr(t, 6.6, 7)} />
  </Svg></Blueprint></F>);
};

// 46 · repaso: fichas del talonario que se sellan FIXED una por una
export const recap: H = ({ dur }) => {
  const t = useT(); const L = [["Ring = rock", 0], ["Bleach no, vinegar yes", 3.1], ["Valve right, flush", 6.3], ["1 warm cup", 12.6], ["Towels on the ring", 16.6], ["15 minutes", 20.5]] as const;
  const T0 = 0; return (<F dur={dur}><Pad no="RECAP"><Svg>{L.filter(([, at]) => at < dur / 30).map(([s, at], i) => (<g key={i} opacity={cl((t - at - T0) * 3)}>
    <Pencil t={t} at={at} x={220} y={260 + i * 120} text={s} size={60} col={K.ink} /><Check x={1500} y={240 + i * 120} p={pr(t, at + 0.6, at + 1)} col={K.red} /></g>))}
    <Stamp t={t} at={dur / 30 - 1.4} x={1450} y={880} text="FIXED" size={90} /></Svg></Pad></F>);
};
// 47 · las cuatro prohibiciones caen como placas rojas atornilladas
export const recap2: H = ({ dur }) => {
  const t = useT(); const L = [["VINEGAR + BLEACH", 0], ["BOILING WATER", 2.0], ["METAL", 4.0], ["PUMICE ON COLOR", 5.0]] as const;
  return (<F dur={dur}><AbsoluteFill style={{ background: K.navy }}><Svg>{L.map(([s, at], i) => { const p = spr(t, at); return (<g key={i} transform={`translate(${i % 2 ? 1400 : 520} ${lerp(-300, 360 + Math.floor(i / 2) * 330, cl(p))})`}>
    <rect x={-400} y={-120} width={800} height={240} rx={16} fill={K.red} /><circle cx={-360} cy={-80} r={10} fill={K.cream} /><circle cx={360} cy={-80} r={10} fill={K.cream} />
    {txt(0, -30, "NO", 40, K.cream, 700, SANS)}{txt(0, 50, s, 60, K.cream)}</g>); })}</Svg></AbsoluteFill></F>);
};
// 48 · cierre: el libro se cierra, portada al frente
export const bookclose: H = ({ dur, src }) => {
  const t = useT(), c = eio(pr(t, 0.5, 2)), W = 520, H = (W * 2200) / 1700;
  return (<F dur={dur}><Under src={src} dark={0.35}>
    <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, boxShadow: "30px 40px 70px rgba(0,0,0,0.6)", transform: `scale(${lerp(1.05, 1, c)})` }}>
      <Img src={staticFile("len11a/c/p001.png")} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: K.cream, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-180 * c}deg)`, backfaceVisibility: "hidden", overflow: "hidden" }}>
        <Img src={staticFile("len11a/c/p059.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
    <FromBook />
  </Under></F>);
};
