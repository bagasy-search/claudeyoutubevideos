// Héroes de len11b (the shower drain). Cada uno: {dur (frames), src?, v?}. Mecanismos registrados en D:/rtmp/len11_COMPONENTES.md.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade, Pad, Blueprint, Under, Pencil, Stamp, FromBook, Svg } from "./kit";

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
export const X: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 60, p }) => (
  <g transform={`translate(${x} ${y})`} opacity={p > 0 ? 1 : 0}>
    <line x1={-s} y1={-s} x2={-s + 2 * s * cl(p * 2)} y2={-s + 2 * s * cl(p * 2)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
    <line x1={s} y1={-s} x2={s - 2 * s * cl(p * 2 - 1)} y2={-s + 2 * s * cl(p * 2 - 1)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
  </g>
);
export const Check: React.FC<{ x: number; y: number; p: number; s?: number; col?: string }> = ({ x, y, p, s = 1, col = K.green }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 0 L-8 24 L36 -30" fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);
export const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontFamily={font} fontWeight={w} fontSize={size} fill={col} textAnchor={anchor} opacity={op}>{s}</text>
);
const HAIR = "#3A2B22", GOO = "#9A9C95";
/** mata de pelo colgante: largo L (px), grosor w, ondulación por tiempo */
export const Rope: React.FC<{ x: number; y: number; L: number; w?: number; t: number; goo?: number; fold?: number }> = ({ x, y, L, w = 46, t, goo = 1, fold = 0 }) => {
  const n = 14, pts = Array.from({ length: n + 1 }, (_, i) => { const k = i / n; const yy = k * L * (1 - fold * 0.55); const xx = Math.sin(k * 6 + t * 2) * 10 * k + fold * Math.sin(k * Math.PI * 5) * 60 * k; return [xx, yy]; });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (<g transform={`translate(${x} ${y})`}>
    <path d={d} fill="none" stroke={GOO} strokeWidth={w + 14} strokeLinecap="round" strokeLinejoin="round" opacity={0.75 * goo} />
    <path d={d} fill="none" stroke={HAIR} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    {Array.from({ length: 16 }, (_, i) => { const p = pts[Math.min(n, 1 + (i % n))]; return <path key={i} d={`M${p[0] - 18} ${p[1]} q ${12 + (i % 3) * 6} ${10 + i % 4 * 5} ${30 + (i % 5) * 4} ${-4 + (i % 2) * 8}`} stroke={HAIR} strokeWidth={3} fill="none" opacity={0.8} />; })}
  </g>);
};
/** modelo de desagüe de vidrio (vista de costado): piso de azulejo, rejilla con cruz, caño, sifón en U, salida. origen = centro de la rejilla */
export const DrainModel: React.FC<{ x: number; y: number; s?: number; trapWater?: number; children?: React.ReactNode; glass?: boolean }> = ({ x, y, s = 1, trapWater = 1, children, glass = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-560} y={-40} width={1120} height={40} fill={K.porcelain} stroke={K.ink} strokeWidth={4} />
    {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-560 + i * 80} x2={-560 + i * 80} y1={-40} y2={0} stroke="#BFC4C6" strokeWidth={3} />)}
    <rect x={-560} y={0} width={1120} height={70} fill="#C9B79A" opacity={0.6} />
    <path d="M-70 0 L-70 380 Q-70 520 80 520 Q230 520 230 380 L230 300 L560 300 L560 220 L150 220 L150 380 Q150 440 80 440 Q10 440 10 380 L10 0 Z" fill={glass ? "rgba(190,225,245,0.18)" : "#6B6F72"} stroke={K.cream} strokeWidth={5} />
    <clipPath id="trapW"><path d="M-70 380 Q-70 520 80 520 Q230 520 230 380 L150 380 Q150 440 80 440 Q10 440 10 380 Z" /></clipPath>
    <rect x={-80} y={lerp(530, 330, trapWater)} width={320} height={260} fill={K.water} opacity={0.85} clipPath="url(#trapW)" />
    <rect x={-110} y={-52} width={260} height={16} rx={6} fill="#C9CED2" stroke={K.ink} strokeWidth={3} />
    <line x1={-70} x2={10} y1={-14} y2={-14} stroke="#C9CED2" strokeWidth={10} /><line x1={-30} x2={-30} y1={-36} y2={14} stroke="#C9CED2" strokeWidth={10} />
    {children}
  </g>
);

// 1 · el desagüe de vidrio (hilo conductor): 7 visitas, cada una con una acción nueva
export const glass_drain: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const lab = (s: string, at = 0.4) => <g opacity={cl((t - at) * 3)}>{txt(960, 150, s, 54, K.cream)}</g>;
  if (v === 0) { // el modelo se arma pieza por pieza
    const a = (i: number) => eout(pr(t, 0.2 + i * 0.35, 0.7 + i * 0.35));
    return (<F dur={dur}><Blueprint><Svg>
      <g opacity={a(0)} transform={`translate(0 ${(1 - a(0)) * -200})`}><DrainModel x={900} y={330} trapWater={a(2)} /></g>
      <g opacity={a(3)}>{txt(1480, 700, "THE GLASS DRAIN", 46, K.copper, 700, SANS)}</g>
      {lab("WHY THE SNAKE DIDN'T WORK", 1.2)}
    </Svg></Blueprint></F>);
  }
  if (v === 1) { // tabla de nudos de marinero: el 1er pelo hace un lazo en la barra; cada uno siguiente le ata un nudo encima
    const n = Math.min(4, Math.floor(pr(t, 0.3, D - 0.4) * 4) + 1);
    return (<F dur={dur}><Blueprint><Svg>
      <rect x={260} y={300} width={1400} height={44} rx={10} fill="#C9CED2" stroke={K.ink} strokeWidth={4} />{txt(960, 270, "THE CROSS", 30, K.copper, 700, SANS)}
      {[0, 1, 2, 3].map((i) => { const x = 440 + i * 340, k = eio(pr(t, 0.3 + i * (D - 0.7) / 4, 0.8 + i * (D - 0.7) / 4)); return (<g key={i} opacity={i < n ? 1 : 0.15}>
        <path d={`M${x - 50} 300 C ${x - 120} 420, ${x + 120} 420, ${x + 50} 300`} stroke={HAIR} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        {Array.from({ length: i }, (_, j) => <path key={j} d={`M${x - 70} ${380 + j * 30} c 30 -30 110 -30 140 0 c -30 30 -110 30 -140 0 l 0 ${60 + j * 20}`} stroke={HAIR} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />)}
        {txt(x, 640, ["LOOP", "1 KNOT", "2 KNOTS", "3 KNOTS"][i], 40, K.cream, 700, SANS)}
      </g>); })}
      {lab("ONE HAIR CATCHES · THE NEXT WRAPS", 0.2)}
    </Svg></Blueprint></F>);
  }
  if (v === 2) { // pieza de museo: la soga en corte con fichas de catálogo que señalan cada ingrediente
    const L: [string, number, number][] = [["HAIR", -40, 60], ["SOAP", 20, 140], ["CONDITIONER", -20, 220], ["SKIN OIL", 10, 290]];
    return (<F dur={dur}><Blueprint><Svg>
      <DrainModel x={700} y={250} s={1.25}><Rope x={-30} y={-10} L={330} w={52} t={0} /></DrainModel>
      {L.map(([s, dx, dy], i) => { const k = pr(t, 0.6 + i * 0.7, 1.1 + i * 0.7); const x0 = 700 + (dx - 30) * 1.25, y0 = 250 + dy * 1.25; return (<g key={s} opacity={k > 0 ? 1 : 0}>
        <path d={`M${x0} ${y0} L1250 ${300 + i * 140}`} stroke={K.cream} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        <circle cx={x0} cy={y0} r={8} fill={K.copper} />
        <rect x={1250} y={262 + i * 140} width={440} height={76} fill="#F3EBD8" stroke={K.ink} strokeWidth={3} />{txt(1270, 312 + i * 140, `No. ${i + 1}  ${s}`, 36, K.ink, 700, SANS, "start")}
      </g>); })}
      {lab("SPECIMEN: ONE SHOWER CLOG", 0.2)}
    </Svg></Blueprint></F>);
  }
  if (v === 3) { // la aspiradora tira: la soga sube entera por donde entró
    const up = eio(pr(t, 0.8, D - 0.8));
    return (<F dur={dur}><Blueprint><Svg>
      <DrainModel x={900} y={420}>
        <Rope x={-30} y={lerp(-10, -520, up)} L={300} w={50} t={t} />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M-30 ${300 - ((t * 400 + i * 80) % 400)} l -18 30 m 18 -30 l 18 30`} stroke={K.cream} strokeWidth={6} fill="none" opacity={0.7} />)}
      </DrainModel>
      <rect x={810} y={-20} width={120} height={lerp(260, 360, up)} fill="#2B2B2B" opacity={0.9} />
      {txt(1500, 300, "PULL", 120, K.red)}{txt(1500, 380, "out in one piece", 40, K.cream, 700, HAND)}
    </Svg></Blueprint></F>);
  }
  if (v === 4) { // la curva guarda agua: un tapón que no deja subir el gas
    const b = (t * 0.8) % 1;
    return (<F dur={dur}><Blueprint><Svg>
      <DrainModel x={760} y={260} s={1.15}>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={360 + i * 24} cy={260 - ((b * 60 + i * 13) % 40)} r={14 + (i % 3) * 5} fill="#7E8A55" opacity={0.6} />)}
        <path d="M-80 430 L240 430" stroke={K.red} strokeWidth={6} strokeDasharray="14 10" opacity={cl((t - 1) * 3)} />
      </DrainModel>
      {txt(1500, 560, "WATER PLUG", 64, K.water)}{txt(1500, 630, "keeps the sewer gas down", 38, K.cream, 700, HAND)}
      {lab("THE BEND ALWAYS HOLDS WATER", 0.2)}
    </Svg></Blueprint></F>);
  }
  if (v === 5) { // compactadora de basura: la placa baja y la mata suelta queda hecha un ladrillo
    const f = eio(pr(t, 0.5, D - 1));
    return (<F dur={dur}><Pad no="0510"><Svg>
      <rect x={700} y={200} width={520} height={680} fill="#D9D4CB" stroke={K.ink} strokeWidth={8} />
      <rect x={720} y={lerp(220, 600, f)} width={480} height={40} fill={K.graphite} /><rect x={940} y={140} width={40} height={lerp(80, 460, f)} fill="#8A8F93" />
      <g transform={`translate(960 ${lerp(560, 740, f)}) scale(1 ${lerp(1, 0.35, f)})`}>{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-200 + (i * 31) % 400} ${-120 + (i * 47) % 240} q 60 ${-40 + (i % 3) * 30} 120 ${10 - (i % 4) * 8}`} stroke={HAIR} strokeWidth={10} fill="none" />)}</g>
      {txt(420, 520, "PLUNGING", 60, K.ink)}{txt(420, 590, "= COMPACTING", 48, K.red)}
      {f > 0.8 && <Stamp t={t} at={D - 1.1} x={1500} y={520} text="PACKED" size={80} rot={-8} />}
    </Svg></Pad></F>);
  }
  // v6 · repaso: tres desagües iguales; sopapo empuja, víbora agujerea, aspiradora saca entera
  const col = (i: number) => pr(t, 0.3 + i * (D - 0.6) / 3, 0.9 + i * (D - 0.6) / 3);
  return (<F dur={dur}><Blueprint><Svg>
    {["PLUNGER: PACKS", "SNAKE: A HOLE", "SHOP VAC: OUT WHOLE"].map((s, i) => { const k = col(i); return (<g key={i} opacity={0.35 + 0.65 * cl(k * 3)}>
      <DrainModel x={330 + i * 630} y={330} s={0.48}>
        {i === 0 && <Rope x={-30} y={lerp(-10, 200, k)} L={300} w={50} t={t} fold={k} />}
        {i === 1 && <><Rope x={-30} y={-10} L={300} w={50} t={t} /><line x1={-30} y1={-80} x2={-30} y2={lerp(-80, 330, k)} stroke="#D7D7D7" strokeWidth={10} /></>}
        {i === 2 && <Rope x={-30} y={lerp(-10, -500, k)} L={300} w={50} t={t} />}
      </DrainModel>
      {txt(330 + i * 630, 760, s, 40, i === 2 ? K.copper : K.cream, 700, SANS)}
      {i < 2 && k > 0.6 && <X x={330 + i * 630} y={880} s={40} p={pr(t, 0.3 + (i + 0.7) * (D - 0.6) / 3, 0.6 + (i + 0.7) * (D - 0.6) / 3)} />}
      {i === 2 && <Check x={960 + 330} y={880} p={pr(t, D - 0.8, D - 0.3)} s={1.4} col={K.copper} />}
    </g>); })}
  </Svg></Blueprint></F>);
};

// 2 · espejo empañado: el dedo escribe los 6 pasos en el vapor
const SEIS = ["1  cover off", "2  pipe + tape", "3  filter out", "4  seal it", "5  15 seconds", "6  hot water"];
export const mirror_fog: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#BFC9C9" }}><Svg>
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 96} y2={i * 96} stroke="#A9B4B4" strokeWidth={3} />)}
    <rect x={460} y={90} width={1000} height={900} rx={40} fill="#D9E2E4" stroke="#8D9799" strokeWidth={14} />
    <rect x={480} y={110} width={960} height={860} rx={30} fill="rgba(255,255,255,0.55)" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={520 + (i * 97) % 900} cy={140 + (i * 53) % 800} r={3 + (i % 4)} fill="#fff" opacity={0.6} />)}
    {SEIS.map((s, i) => { const a = 0.3 + i * (D - 0.6) / 6; const n = Math.round(s.length * pr(t, a, a + 0.5)); return <text key={i} x={560} y={240 + i * 125} fontFamily={HAND} fontWeight={700} fontSize={82} fill="#7F8E92" opacity={0.95}>{s.slice(0, n)}</text>; })}
    {txt(960, 1050, "THE WHOLE TRICK", 30, K.navy, 700, SANS)}
  </Svg></AbsoluteFill></F>);
};

// 3 · bolsas de evidencia: DIRT y GREASE reciben NOT; HAIR queda
export const evidence: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const bag = (x: number, lab: string, i: number, fill: React.ReactNode) => { const d = spr(t, 0.2 + i * 0.3); return (<g transform={`translate(${x} ${560 + (1 - d) * 300}) rotate(${(i - 1) * 3})`} opacity={cl(d * 2)}>
    <rect x={-210} y={-300} width={420} height={560} rx={16} fill="rgba(255,255,255,0.75)" stroke={K.ink} strokeWidth={4} />
    <rect x={-210} y={-300} width={420} height={60} fill={K.red} opacity={0.85} />{txt(0, -258, "EVIDENCE", 30, K.white, 700, SANS)}
    {fill}{txt(0, 220, lab, 54, K.ink)}
  </g>); };
  return (<F dur={dur}><Pad no="0511"><Svg>
    {bag(500, "DIRT", 0, <ellipse cx={0} cy={20} rx={140} ry={70} fill="#7A5A3A" />)}
    {bag(960, "GREASE", 1, <ellipse cx={0} cy={20} rx={130} ry={80} fill="#E8D9A0" stroke="#C5B068" strokeWidth={4} />)}
    {bag(1420, "HAIR", 2, <Rope x={-20} y={-180} L={300} w={34} t={t} />)}
    <Stamp t={t} at={D * 0.45} x={500} y={520} text="NOT" size={90} />
    <Stamp t={t} at={D * 0.6} x={960} y={520} text="NOT" size={90} />
    <Pencil t={t} at={D * 0.75} x={1420} y={930} text="this one" size={56} col={K.red} />
  </Svg></Pad></F>);
};

// 4 · sonar: un ping baja por el caño y rebota en la mata a 3 pulgadas
export const sonar: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#071A14" }}><Svg>
    <g transform="translate(960 160)">
      <rect x={-80} y={0} width={160} height={820} fill="rgba(80,200,140,0.06)" stroke="#2F8C63" strokeWidth={4} />
      {[0, 1, 2].map((i) => { const k = ((t + i * 0.6) % 1.8) / 1.8; return <path key={i} d={`M-70 ${k * 220} Q0 ${k * 220 + 40} 70 ${k * 220}`} stroke="#5CF0A6" strokeWidth={6} fill="none" opacity={1 - k} />; })}
      <rect x={-70} y={210} width={140} height={150} rx={30} fill="#5CF0A6" opacity={0.35 + 0.3 * Math.sin(t * 6)} />
      {Array.from({ length: 9 }, (_, i) => <g key={i}><line x1={100} x2={130} y1={i * 90} y2={i * 90} stroke="#2F8C63" strokeWidth={3} />{txt(150, i * 90 + 12, `${i * 2}"`, 30, "#2F8C63", 600, SANS, "start")}</g>)}
    </g>
    <g opacity={cl((t - 1) * 2)}>{txt(1360, 400, "FOUND IT", 64, "#5CF0A6", 700, SANS)}{txt(1360, 470, "a few inches down", 42, "#B9F5D6", 700, HAND)}</g>
    {txt(520, 900, "THE GOOD NEWS: IT'S CLOSE", 40, "#5CF0A6", 700, SANS)}
  </Svg></AbsoluteFill></F>);
};

// 5 · corcho en el cuello de una botella: cada empujón lo mete más y lo traba
export const plunger_pack: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.4, D - 1)), pushes = Math.min(3, Math.floor(pr(t, 0.4, D - 1) * 3.99));
  return (<F dur={dur}><Pad no="0512"><Svg>
    <path d="M840 900 L840 520 Q840 440 900 400 L900 260 L1020 260 L1020 400 Q1080 440 1080 520 L1080 900 Z" fill="rgba(120,170,140,0.35)" stroke={K.ink} strokeWidth={6} />
    <g transform={`translate(960 ${lerp(230, 430, k)}) rotate(${k * 18})`}><rect x={-56} y={-60} width={112} height={120} rx={14} fill="#C9A26B" stroke={K.ink} strokeWidth={4} />{Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-30 + (i % 3) * 30} cy={-30 + Math.floor(i / 3) * 50} r={6} fill="#9C7A48" />)}</g>
    <g transform={`translate(960 ${lerp(120, 300, k) - Math.abs(Math.sin(t * 5)) * 30})`}><rect x={-14} y={-200} width={28} height={180} fill="#B07A44" /><circle r={30} fill={K.graphite} /></g>
    {[0, 1, 2].map((i) => <g key={i}>{txt(1380, 380 + i * 90, `PUSH ${i + 1}`, 44, i < pushes ? K.red : K.graphite, 700, SANS, "start", i < pushes ? 1 : 0.25)}</g>)}
    {txt(420, 520, "A PLUNGER", 64, K.ink)}{txt(420, 590, "PUSHES", 64, K.red)}
    {pushes >= 3 && txt(1380, 680, "stuck tighter", 46, K.red, 700, HAND, "start")}
  </Svg></Pad></F>);
};

// 6 · aguja por un ovillo: hace un agujero; el jabón lo vuelve a tapar
export const snake_yarn: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = eio(pr(t, 0.3, D * 0.45)), fill = pr(t, D * 0.6, D - 0.3);
  return (<F dur={dur}><Pad no="0513"><Svg>
    <circle cx={960} cy={560} r={260} fill="#5A4030" />
    {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={960} cy={560} rx={260} ry={60 + (i * 9) % 200} transform={`rotate(${i * 17} 960 560)`} fill="none" stroke="#7A5A44" strokeWidth={5} opacity={0.8} />)}
    <rect x={lerp(200, 1300, n)} y={548} width={420} height={24} rx={12} fill="#CFCFCF" stroke={K.ink} strokeWidth={3} />
    <circle cx={960} cy={560} r={lerp(0, 70, n) * (1 - fill)} fill={K.pad} stroke={K.ink} strokeWidth={3} />
    {fill > 0 && <circle cx={960} cy={560} r={70 * fill} fill={GOO} opacity={0.0 + fill * 0.9} />}
    {txt(960, 950, fill > 0.1 ? "a week later: soap fills the hole" : "A SNAKE MAKES A HOLE", 50, fill > 0.1 ? K.red : K.ink, 700, fill > 0.1 ? HAND : SLAB)}
  </Svg></Pad></F>);
};

// 7 · tira y empuja: flechas de dos herramientas abajo, la de la aspiradora da vuelta hacia arriba
export const tug: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.6, D - 0.6));
  return (<F dur={dur}><Blueprint><Svg>
    {[["PLUNGER", 420, 1], ["SNAKE", 960, 1], ["SHOP VAC", 1500, -1]].map(([s, x, dir]: any, i) => { const dd = i === 2 ? lerp(1, -1, k) : 1; return (<g key={i} transform={`translate(${x} 540)`}>
      <path d={`M0 ${-200 * dd} L0 ${200 * dd} M-60 ${120 * dd} L0 ${200 * dd} L60 ${120 * dd}`} stroke={i === 2 ? K.copper : K.cream} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {txt(0, 380, s, 50, i === 2 ? K.copper : K.cream, 700, SANS)}{txt(0, -260, i === 2 && k > 0.5 ? "PULLS" : "PUSHES", 46, i === 2 && k > 0.5 ? K.copper : "#9FB7CF", 700, SANS)}
    </g>); })}
  </Svg></Blueprint></F>);
};

// 8 · enchufe de seguridad: cae una gota, salta el botón RESET y la luz se apaga
export const gfci: H = ({ dur }) => {
  const t = useT(), D = dur / 30, drop = pr(t, 0.6, 1.4), trip = t > 1.45;
  return (<F dur={dur}><AbsoluteFill style={{ background: trip ? "#22272B" : "#EDE6D8" }}><Svg>
    <rect x={710} y={170} width={500} height={760} rx={30} fill={K.white} stroke={K.ink} strokeWidth={8} />
    {[300, 640].map((y, i) => <g key={i}><rect x={810} y={y} width={300} height={200} rx={50} fill="#F4F1EA" stroke={K.ink} strokeWidth={5} /><rect x={880} y={y + 50} width={22} height={70} rx={4} fill={K.ink} /><rect x={1018} y={y + 50} width={22} height={70} rx={4} fill={K.ink} /><path d={`M945 ${y + 150} a 15 15 0 0 1 30 0 v 18 h -30 Z`} fill={K.ink} /></g>)}
    <rect x={840} y={540} width={100} height={60} rx={8} fill={K.ink} />{txt(890, 582, "TEST", 26, K.white, 700, SANS)}
    <rect x={980} y={trip ? 520 : 540} width={100} height={60} rx={8} fill={K.red} />{txt(1030, trip ? 562 : 582, "RESET", 24, K.white, 700, SANS)}
    <ellipse cx={1180} cy={lerp(-40, 330, eout(drop))} rx={16} ry={24} fill={K.water} opacity={drop < 1 ? 1 : 0} />
    {trip && <><path d="M1180 330 l -30 -40 l 50 10 l -20 -50" stroke="#FFD34E" strokeWidth={8} fill="none" />{txt(1500, 560, "POWER CUT", 70, "#FFD34E", 700, SANS)}{txt(1500, 630, "before it reaches you", 40, K.white, 700, HAND)}</>}
    {!trip && txt(400, 560, "SAFETY OUTLET", 54, K.ink)}
  </Svg></AbsoluteFill></F>);
};

// 9 · motor que se ahoga: la aspiradora de alfombra se llena de agua hasta el motor
export const motor_drown: H = ({ dur }) => {
  const t = useT(), D = dur / 30, w = eio(pr(t, 0.3, D - 1));
  return (<F dur={dur}><Pad no="0514"><Svg>
    <rect x={760} y={220} width={400} height={640} rx={60} fill="#D9D4CB" stroke={K.ink} strokeWidth={6} />
    <clipPath id="vacIn"><rect x={770} y={230} width={380} height={620} rx={56} /></clipPath>
    <rect x={760} y={lerp(860, 300, w)} width={400} height={640} fill={K.waterD} opacity={0.8} clipPath="url(#vacIn)" />
    <g transform="translate(960 360)"><circle r={80} fill={K.copper} stroke={K.ink} strokeWidth={5} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-8} y={-74} width={16} height={60} fill={K.ink} transform={`rotate(${i * 60 + t * (w > 0.85 ? 40 : 600)})`} />)}</g>
    {w > 0.85 && <><path d="M1040 300 l 40 -60 l 10 50 l 40 -50" stroke="#FFD34E" strokeWidth={8} fill="none" opacity={Math.sin(t * 30) > 0 ? 1 : 0.2} /><Stamp t={t} at={D - 0.9} x={1450} y={540} text="MOTOR" size={70} /></>}
    {txt(960, 960, "NOT MADE FOR WATER", 46, K.ink, 700, SANS)}
  </Svg></Pad></F>);
};

// 10 · llave y cerradura: la punta del destornillador correcta entra en la cabeza; la equivocada patina
export const screw_fit: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const head = (x: number, cross: boolean, ok: boolean, at: number) => { const k = eio(pr(t, at, at + 0.8)); const slip = ok ? 0 : Math.sin(t * 30) * 12 * (k > 0.95 ? 1 : 0); return (<g transform={`translate(${x} 600)`}>
    <circle r={150} fill="#C9CED2" stroke={K.ink} strokeWidth={6} />
    <rect x={-110} y={-14} width={220} height={28} fill={K.ink} />{cross && <rect x={-14} y={-110} width={28} height={220} fill={K.ink} />}
    <g transform={`translate(${slip} ${lerp(-420, -40, k)})`}><rect x={-30} y={-330} width={60} height={300} fill="#B23A2E" /><path d={ok ? (cross ? "M-30 -30 L30 -30 L0 30 Z" : "M-40 -30 L40 -30 L40 0 L-40 0 Z") : "M-12 -30 L12 -30 L4 20 L-4 20 Z"} fill="#9AA0A4" stroke={K.ink} strokeWidth={3} /></g>
    {k > 0.95 && (ok ? <Check x={210} y={-150} p={pr(t, at + 0.8, at + 1.1)} /> : <X x={210} y={-150} s={40} p={pr(t, at + 0.8, at + 1.2)} />)}
  </g>); };
  return (<F dur={dur}><Pad no="0515"><Svg>{head(620, false, true, 0.2)}{head(1300, true, false, 0.6)}{txt(620, 900, "FLAT", 50, K.ink)}{txt(1300, 900, "CROSS", 50, K.ink)}<Pencil t={t} at={1.4} x={960} y={250} text="use the right one" size={56} col={K.red} /></Svg></Pad></F>);
};

// 11 · la parábola del tornillo: sale y cae en el vaso, no en el agujero
export const screw_cup: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = pr(t, 0.4, 1.6);
  const x = lerp(700, 1300, k), y = 380 - Math.sin(k * Math.PI) * 200 + k * 260;
  return (<F dur={dur}><Pad no="0516"><Svg>
    <ellipse cx={700} cy={700} rx={140} ry={30} fill="#9AA0A4" stroke={K.ink} strokeWidth={4} /><ellipse cx={700} cy={700} rx={60} ry={12} fill={K.ink} />
    <path d="M1200 560 L1400 560 L1370 820 L1230 820 Z" fill={K.white} stroke={K.ink} strokeWidth={5} />
    <path d={`M700 380 Q1000 ${180} 1300 640`} stroke={K.copper} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={0.7} />
    <path d="M700 380 Q760 560 700 690" stroke={K.red} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={0.6} />
    <X x={760} y={560} s={30} p={pr(t, 0.2, 0.6)} />
    {k < 1 && <g transform={`translate(${x} ${y}) rotate(${t * 600})`}><rect x={-10} y={-30} width={20} height={50} fill="#C9CED2" stroke={K.ink} strokeWidth={3} /><rect x={-20} y={-36} width={40} height={10} fill="#C9CED2" stroke={K.ink} strokeWidth={3} /></g>}
    {k >= 1 && <><rect x={1290} y={770} width={20} height={44} fill="#C9CED2" /><Check x={1300} y={480} p={pr(t, 1.6, 1.9)} /></>}
    {txt(1300, 900, "PAPER CUP", 44, K.ink, 700, SANS)}
  </Svg></Pad></F>);
};

// 12 · palanca de un lado: la grieta corre por el aro de la rejilla
export const pry_crack: H = ({ dur }) => {
  const t = useT(), D = dur / 30, p = eio(pr(t, 0.3, 1.3)), c = pr(t, 1.3, D - 0.5);
  return (<F dur={dur}><Pad no="0517"><Svg>
    <ellipse cx={960} cy={620} rx={420} ry={150} fill="#ECEAE4" stroke={K.ink} strokeWidth={6} /><ellipse cx={960} cy={620} rx={300} ry={105} fill="#C9CED2" stroke={K.ink} strokeWidth={5} />
    <g transform={`translate(640 600) rotate(${lerp(10, -22, p)})`}><rect x={-420} y={-14} width={440} height={28} rx={8} fill="#B23A2E" /><rect x={20} y={-8} width={160} height={16} fill="#9AA0A4" /></g>
    <path d="M700 640 L760 660 L790 700 L850 712 L880 760" stroke={K.ink} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} />
    {c > 0.5 && Array.from({ length: 5 }, (_, i) => <circle key={i} cx={880 + i * 14} cy={770 + ((t * 80 + i * 20) % 60)} r={6} fill={K.water} />)}
    {txt(960, 950, c > 0.3 ? "water gets under the floor" : "TOO HARD ON ONE SIDE", 50, c > 0.3 ? K.red : K.ink, 700, c > 0.3 ? HAND : SLAB)}
  </Svg></Pad></F>);
};

// 13 · tamaños: círculo de la manguera sobre el agujero; el aire entra por la luz
export const hose_gap: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.3, 1.3));
  return (<F dur={dur}><Blueprint><Svg>
    <circle cx={960} cy={560} r={150} fill="#0D1A2A" stroke={K.cream} strokeWidth={5} />{txt(960, 570, '1½"', 60, K.cream)}
    <circle cx={960} cy={560} r={250} fill="none" stroke={K.copper} strokeWidth={22} opacity={k} transform={`translate(0 ${(1 - k) * -300})`} />
    {k > 0.9 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; const r = 420 - ((t * 260 + i * 30) % 180); return <path key={i} d={`M${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r} l ${-Math.cos(a) * 40} ${-Math.sin(a) * 40}`} stroke="#9FD3F2" strokeWidth={8} strokeLinecap="round" />; })}
    {txt(1480, 300, '2½" HOSE', 50, K.copper, 700, SANS)}{k > 0.9 && txt(960, 920, "it just sucks air from the room", 50, K.cream, 700, HAND)}
  </Svg></Blueprint></F>);
};

// 14 · calibre: el caño entra justo; v1 = dos medidas
export const pipe_fit: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.3, 1.2));
  const cal = (x: number, lab: string, at: number) => { const q = eio(pr(t, at, at + 0.8)); return (<g transform={`translate(${x} 560)`}>
    <circle r={110} fill="#F4F1EA" stroke={K.ink} strokeWidth={6} /><circle r={84} fill={K.pad} stroke={K.ink} strokeWidth={3} />
    <g transform={`translate(0 ${lerp(-60, 0, q)})`}><rect x={-160} y={-260} width={30} height={260} fill="#9AA0A4" /><rect x={130} y={-260} width={30} height={260} fill="#9AA0A4" /><rect x={-160} y={-290} width={320} height={40} fill="#9AA0A4" stroke={K.ink} strokeWidth={3} /></g>
    {txt(0, 220, lab, 60, K.ink)}
  </g>); };
  return (<F dur={dur}><Pad no="0518"><Svg>
    {v === 0 ? <>{cal(760, '1¼"', 0.2)}<Pencil t={t} at={1} x={1250} y={560} text="slides in snug" size={60} col={K.red} /></> : <>{cal(640, '1¼"  most', 0.2)}{cal(1280, '1½"  newer', 0.8)}</>}
    <g opacity={k}>{txt(960, 230, v === 0 ? "MEASURE THE HOLE" : "WHICH PIPE?", 44, K.copper, 700, SANS)}</g>
  </Svg></Pad></F>);
};

// 15 · la palma: la piel se hunde dentro del caño, flechas de succión
export const palm_test: H = ({ dur }) => {
  const t = useT(), D = dur / 30, on = t > 1, s = on ? eout(pr(t, 1, 1.6)) : 0;
  return (<F dur={dur}><Pad no="0519"><Svg>
    <rect x={860} y={420} width={200} height={560} fill="rgba(255,255,255,0.7)" stroke={K.ink} strokeWidth={6} />
    <path d={`M700 420 Q960 ${420 + 120 * s} 1220 420 L1220 300 Q960 240 700 300 Z`} fill="#E8B48F" stroke={K.ink} strokeWidth={5} />
    {on && Array.from({ length: 4 }, (_, i) => <path key={i} d={`M960 ${900 - ((t * 400 + i * 120) % 420)} l -26 30 m 26 -30 l 26 30`} stroke={K.red} strokeWidth={8} fill="none" />)}
    {txt(1500, 520, on ? "PULLS HARD" : "VAC ON...", 64, on ? K.red : K.graphite)}
    {on && <Check x={1500} y={640} p={pr(t, 1.6, 2)} s={1.3} />}
  </Svg></Pad></F>);
};

// 16 · prueba del humo: el humo de un sahumerio se mete por la rendija de la cinta
export const smoke_test: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2A2420" }}><Svg>
    <rect x={200} y={480} width={760} height={140} rx={60} fill="#1B1B1B" /><rect x={960} y={500} width={600} height={100} fill="#F2F2EE" />
    <rect x={900} y={470} width={140} height={160} fill="#C7C9C6" opacity={0.9} /><path d="M900 470 L1040 470 L1040 630 L900 630" stroke="#888" strokeWidth={3} fill="none" />
    <path d="M1036 470 L1046 500" stroke={K.red} strokeWidth={6} />
    <line x1={1300} y1={900} x2={1300} y2={760} stroke="#6B4A2A" strokeWidth={8} /><circle cx={1300} cy={760} r={8} fill="#FF7A2E" />
    {Array.from({ length: 10 }, (_, i) => { const k = ((t * 0.7 + i * 0.1) % 1); const x = lerp(1300, 1045, eio(k)), y = lerp(750, 495, k) + Math.sin(k * 9 + i) * 20; return <circle key={i} cx={x} cy={y} r={14 + k * 18} fill="#CFCFCF" opacity={0.5 * (1 - k)} />; })}
    {txt(960, 300, "THE LEAK STEALS THE PULL", 56, K.cream)}{txt(1046, 440, "add more tape", 40, K.red, 700, HAND, "start")}
  </Svg></AbsoluteFill></F>);
};
