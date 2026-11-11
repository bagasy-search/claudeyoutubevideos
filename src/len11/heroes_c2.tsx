// Héroes de len11c, parte 2: libro, preparación, chorro, errores, tipos de inodoro, rutina, historia y cierre.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, Pad, Blueprint, Under, Pencil, Stamp, FromBook, Svg } from "./kit";
import { H, F, X, txt, Loo } from "./heroes_c";

const PG = (n: string) => staticFile(`len11c/c/${n}.png`);
const PW = 1700, PH = 2200;
const Page: React.FC<{ n: string; x: number; y: number; h: number; rot?: number; op?: number }> = ({ n, x, y, h, rot = 0, op = 1 }) => {
  const w = (h * PW) / PH;
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} fill="rgba(0,0,0,0.35)" />
    <image href={PG(n)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="none" />
  </g>);
};
/** recorte de una página (fracciones 0..1 de la página) ampliado en un marco */
const Crop: React.FC<{ n: string; fx: number; fy: number; fw: number; fh: number; x: number; y: number; w: number; id: string }> = ({ n, fx, fy, fw, fh, x, y, w, id }) => {
  const h = (w * fh * PH) / (fw * PW), sc = w / (fw * PW);
  return (<g><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
    <image href={PG(n)} x={x - fx * PW * sc} y={y - fy * PH * sc} width={PW * sc} height={PH * sc} clipPath={`url(#${id})`} preserveAspectRatio="none" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.ink} strokeWidth={4} /></g>);
};

// ── LIBRO ───────────────────────────────────────────────
// el libro cae sobre la tapa del tanque y el señalador de cinta se desenrolla hasta "53"
export const bkc_lid: H = ({ dur, src }) => {
  const t = useT(), k = eout(pr(t, 0.15, 0.8)), rib = eout(pr(t, 1.0, 2.0));
  return (<F dur={dur}><Under src={src} dark={0.35}><Svg>
    <rect x={260} y={780} width={1400} height={70} rx={20} fill="#F6F3EA" /><rect x={260} y={840} width={1400} height={20} fill="#CFCAC0" />
    <g transform={`translate(960 ${lerp(-400, 470, k)}) rotate(${lerp(-12, -2, k)})`}>
      <rect x={-232} y={-290} width={480} height={600} fill="#1a1a1a" opacity={0.3} />
      <image href={PG("p001")} x={-240} y={-310} width={464} height={600} preserveAspectRatio="none" />
      <path d={`M120 290 L120 ${290 + 260 * rib} L150 ${270 + 260 * rib} L180 ${290 + 260 * rib} L180 290 Z`} fill={K.red} />
      {rib > 0.8 && txt(150, 250 + 260 * rib, "53", 34, "#fff", 900, SANS)}
    </g>
  </Svg><FromBook /></Under></F>);
};
// la página 53 entera; la cámara baja lenta hasta el método y el lápiz anota
export const bkc_page: H = ({ dur }) => {
  const t = useT(), D = dur / 30, z = lerp(1, 1.5, eio(pr(t, 0.6, D - 1))), ty = lerp(0, -220, eio(pr(t, 0.6, D - 1)));
  return (<F dur={dur}><AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${K.blue}, ${K.navy})` }}><Svg>
    <g transform={`translate(960 ${560 + ty}) scale(${z}) translate(-960 -560)`}><Page n="p053" x={960} y={560} h={1000} /></g>
    <Pencil t={t} at={1.4} x={1380} y={300} text="page 53" size={70} col={K.cream} to={[1150, 380]} />
  </Svg><FromBook /></AbsoluteFill></F>);
};
// tira de película: 52 · 53 · 54 pasan y el cuadro 53 se congela iluminado
export const bkc_three: H = ({ dur }) => {
  const t = useT(), slide = lerp(700, 0, eio(pr(t, 0.2, 1.6))), lit = pr(t, 1.6, 2.2);
  const P = ["p052", "p053", "p054"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0c0c0d" }}><Svg>
    <rect x={-40} y={150} width={2000} height={780} fill="#1b1b1c" />
    {Array.from({ length: 30 }, (_, i) => <React.Fragment key={i}><rect x={((i * 70 - slide) % 2100) - 50} y={170} width={36} height={26} rx={4} fill="#0c0c0d" /><rect x={((i * 70 - slide) % 2100) - 50} y={884} width={36} height={26} rx={4} fill="#0c0c0d" /></React.Fragment>)}
    {P.map((n, i) => <g key={n} opacity={i === 1 ? 1 : lerp(1, 0.35, lit)}><Page n={n} x={360 + i * 600 - slide} y={540} h={640} /></g>)}
    <rect x={960 - 250 - slide} y={215} width={500} height={650} fill="none" stroke="#FFE08A" strokeWidth={10 * lit} />
    <g opacity={lit}>{txt(360, 1010, "MIRROR TEST", 34, "#ccc", 700, SANS)}{txt(960, 1010, "TONIGHT'S TRICK", 34, "#FFE08A", 900, SANS)}{txt(1560, 1010, "THE JET", 34, "#ccc", 700, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// talonario de presupuesto en dos partes: la hoja de arriba (plomero) se levanta y abajo, en el carbónico rosa, lo tuyo
export const bkc_carbon: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, peel = eio(pr(t, 1.4, 2.4));
  const [pg, pl, you, crop] = v === 1 ? ["p054", "$200", "$0", [0.62, 0.66, 0.3, 0.16]] as const : ["p053", "$300", "$4", [0.62, 0.66, 0.3, 0.16]] as const;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <g transform="translate(560 540) rotate(-3)">
      <rect x={-330} y={-400} width={660} height={800} fill="#F4C9CF" /><text x={0} y={-310} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill="#7a3a44">CUSTOMER COPY</text>
      {txt(0, -150, "YOU PAY", 60, "#7a3a44", 900, SANS)}{txt(0, 30, you, 220, "#3a6a3a", 900, SLAB)}
      <g transform={`translate(0 -400) rotate(${-peel * 70}) translate(0 400)`} opacity={1 - peel * 0.25}>
        <rect x={-330} y={-400} width={660} height={800} fill={K.white} stroke="#bbb" strokeWidth={2} />
        {txt(0, -310, "LENNY'S PLUMBING · ESTIMATE", 30, K.ink, 700, SANS)}{txt(0, -150, "PLUMBER", 60, K.ink, 900, SANS)}{txt(0, 30, pl, 200, K.red, 900, SLAB)}
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-280} x2={280} y1={140 + i * 50} y2={140 + i * 50} stroke="#ddd" strokeWidth={3} />)}
      </g>
    </g>
    <g opacity={cl((t - 0.6) * 2)}><Crop n={pg} fx={crop[0]} fy={crop[1]} fw={crop[2]} fh={crop[3]} x={1080} y={230} w={680} id={"cb" + v} /></g>
    {txt(1420, 930, v === 1 ? "PAGE 54 · THE JET" : "PAGE 53 · THE BILL", 40, K.copper, 900, SANS)}
    {v === 1 && <Stamp t={t} at={Math.min(4, D - 2)} x={560} y={860} text="YOU KEEP $200" size={56} col={K.green} rot={-6} />}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// rotuladora Dymo: estampa la cinta en relieve; después la etiqueta del QR se pega al lado de la página
export const bkc_qr: H = ({ dur }) => {
  const t = useT(), typed = Math.floor(pr(t, 0.3, 2.0) * 26), sl = eout(pr(t, 0.4, 1.0));
  const S = "FIRST LINE OF DESCRIPTION";
  return (<F dur={dur}><AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 40%, ${K.blue}, ${K.navy})` }}><Svg>
    <Page n="p053" x={520} y={560} h={860} rot={-4} op={0.95} />
    <g transform={`translate(${lerp(2300, 1340, sl)} 600) rotate(3)`}>
      <rect x={-300} y={-360} width={600} height={720} rx={18} fill={K.white} stroke={K.ink} strokeWidth={5} />
      <image href={PG("qr_flush")} x={-250} y={-320} width={500} height={500} />
      <rect x={-280} y={230} width={560} height={90} rx={6} fill="#1A1A1A" />
      <text x={-262} y={292} fontFamily="monospace" fontWeight={700} fontSize={34} fill="#F2F2F2" letterSpacing={2}>{S.slice(0, typed)}</text>
    </g>
    <g opacity={cl((t - 2.2) * 2)}>{txt(1340, 1035, "SCAN · OR READ THE FIRST LINE", 34, K.cream, 700, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// página 54: el resaltador amarillo barre el título y la cuenta
export const bkc_highlight: H = ({ dur }) => {
  const t = useT(), a = eio(pr(t, 0.8, 1.6)), b = eio(pr(t, 2.2, 3.0));
  const h = 980, w = (h * PW) / PH, x0 = 960 - w / 2, y0 = 540 - h / 2;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <Page n="p054" x={960} y={540} h={h} />
    <rect x={x0 + w * 0.06} y={y0 + h * 0.035} width={w * 0.88 * a} height={h * 0.035} fill="#FFF14A" opacity={0.45} />
    <rect x={x0 + w * 0.62} y={y0 + h * 0.665} width={w * 0.32 * b} height={h * 0.15} fill="#FFF14A" opacity={0.4} />
    <Pencil t={t} at={1.8} x={1420} y={220} text="the jet" size={70} col={K.cream} to={[1260, 120]} />
  </Svg><FromBook /></AbsoluteFill></F>);
};
// máquina de escribir: tipea el nombre de la parte del libro
export const bkc_type: H = ({ dur }) => {
  const t = useT(), L1 = "EVERY TOILET, FIXED", L2 = "40 fixes · the plumber's price · and yours";
  const n1 = Math.floor(pr(t, 0.4, 2.4) * L1.length), n2 = Math.floor(pr(t, 2.8, 5.6) * L2.length);
  const car = 960 - (n2 > 0 ? n2 : n1) * 14;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1e1c1a" }}><Svg>
    <rect x={460} y={80} width={1000} height={560} fill="#F7F1E3" />
    <text x={540} y={300} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={62} fill="#1b1b1b">{L1.slice(0, n1)}</text>
    <text x={540} y={400} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={34} fill="#3b3b3b">{L2.slice(0, n2)}</text>
    <rect x={car - 600} y={600} width={1560} height={70} rx={20} fill="#2f3438" /><rect x={300} y={680} width={1320} height={340} rx={40} fill="#3e464c" />
    {Array.from({ length: 30 }, (_, i) => { const hit = Math.floor(t * 12) % 30 === i && t < 5.6; return <circle key={i} cx={420 + (i % 10) * 120 + (Math.floor(i / 10) % 2) * 40} cy={760 + Math.floor(i / 10) * 80 + (hit ? 6 : 0)} r={34} fill={hit ? "#ddd" : "#f2efe6"} stroke="#222" strokeWidth={5} />; })}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// naturaleza muerta de cierre: el libro sobre la tapa del tanque con el bidón, el espejo y la cinta; las tres páginas se abren en abanico
export const bkc_still: H = ({ dur }) => {
  const t = useT(), fan = eio(pr(t, 1.2, 3.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#B9D8C6 0 62%, #8FB5A0 62%)" }}><Svg>
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 128} x2={i * 128} y1={0} y2={660} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />)}
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 128} y2={i * 128} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />)}
    <rect x={200} y={640} width={1520} height={80} rx={24} fill="#FBF9F3" stroke="#B9B3A6" strokeWidth={4} />
    {["p052", "p053", "p054"].map((n, i) => <g key={n} transform={`rotate(${(i - 1) * 16 * fan} 1000 700)`} opacity={i === 1 ? 1 : fan}><Page n={n} x={1000} y={400} h={480} /></g>)}
    <g transform="translate(480 640)"><path d="M-90 0 L-90 -300 Q-90 -340 -50 -350 L-20 -400 L20 -400 L30 -350 Q90 -340 90 -300 L90 0 Z" fill="rgba(255,255,255,0.75)" stroke="#9aa" strokeWidth={4} /><rect x={-70} y={-220} width={140} height={110} fill={K.cream} />{txt(0, -150, "WHITE", 30, K.ink, 900, SANS)}{txt(0, -116, "VINEGAR", 26, K.ink, 900, SANS)}</g>
    <g transform="translate(1500 600)"><circle r={70} fill="#9aa1a6" stroke="#555" strokeWidth={8} /><circle r={34} fill="#B9D8C6" /></g>
    <g transform="translate(1660 560)"><ellipse rx={60} ry={70} fill="#ccd" stroke="#555" strokeWidth={6} /><rect x={-8} y={60} width={16} height={120} fill="#555" /></g>
    {txt(960, 960, "EVERY TOILET, FIXED", 64, K.ink, 900, SLAB)}
  </Svg><FromBook /></AbsoluteFill></F>);
};

// ── PREPARACIÓN Y MÉTODO ───────────────────────────────
// rollo de lona de herramientas que se desenrolla: bidón, cinta, espejo, linterna, guantes
export const tool_roll: H = ({ dur }) => {
  const t = useT(), u = eio(pr(t, 0.2, 1.6)), W = 1500 * u;
  const items = ["VINEGAR", "DUCT TAPE", "MIRROR", "FLASHLIGHT", "GLOVES"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2f26" }}><Svg>
    <rect x={210} y={300} width={W} height={480} fill="#9C8560" stroke="#5E4A30" strokeWidth={6} />
    {items.map((s, i) => { const x = 280 + i * 300; return x + 240 < 210 + W ? (<g key={s} opacity={cl((210 + W - x - 240) / 120)}>
      <rect x={x} y={360} width={240} height={300} rx={14} fill="#86704D" stroke="#5E4A30" strokeWidth={4} />{txt(x + 120, 720, s, 30, K.cream, 900, SANS)}
      <rect x={x + 60} y={400} width={120} height={200} rx={20} fill={["#F7F7F2", "#9aa1a6", "#c8d4dc", "#E6B23A", "#F2C230"][i]} stroke={K.ink} strokeWidth={4} /></g>) : null; })}
    <circle cx={210 + W} cy={540} r={lerp(240, 60, u)} fill="#8a7553" stroke="#5E4A30" strokeWidth={6} />
    {txt(960, 960, "ABOUT $4 · ALL OF IT", 60, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// barra del día: 15 minutos de noche, el sueño, 15 a la mañana
export const sleep_bar: H = ({ dur }) => {
  const t = useT(), k = eio(pr(t, 0.3, 2.4));
  const seg = (a: number, b: number, col: string, lab: string, at: number) => { const x0 = 260 + a * 1400, w = (b - a) * 1400 * cl((t - at) * 2); return <g><rect x={x0} y={460} width={w} height={130} fill={col} />{w > 40 && txt(x0 + (b - a) * 700, 680, lab, 36, K.ink, 900, SANS)}</g>; };
  return (<F dur={dur}><Pad no="0779"><Svg>
    <rect x={260} y={460} width={1400 * k} height={130} fill="#DCD3BC" />
    {seg(0, 0.06, K.red, "15 MIN", 0.6)}{seg(0.06, 0.94, "#2B3A55", "", 1.0)}{seg(0.94, 1, K.red, "15 MIN", 1.8)}
    {txt(960, 545, "Z z z", 70, K.cream, 700, HAND, "middle", cl((t - 1.4) * 2))}
    {txt(300, 400, "9 PM", 40, K.ink, 900, SANS, "start")}{txt(1620, 400, "7 AM", 40, K.ink, 900, SANS, "end")}
    {txt(960, 870, "your hands: half an hour", 58, K.graphite, 700, HAND)}
  </Svg></Pad></F>);
};
// tarjeta del jurado: tres categorías aparecen (es corto: 1 s)
export const scorecard: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: "#151515" }}><Svg>
    <rect x={560} y={160} width={800} height={760} rx={20} fill="#FFF" />{txt(960, 260, "JUDGE'S CARD", 56, K.ink, 900, SLAB)}
    {["1", "2", "3"].map((s, i) => <g key={s} opacity={cl((t - i * 0.15) * 6)}><rect x={640} y={330 + i * 180} width={640} height={140} rx={12} fill="#F0EBDD" stroke={K.ink} strokeWidth={4} />{txt(720, 430 + i * 180, s, 90, K.red, 900, SLAB)}</g>)}
  </Svg></AbsoluteFill></F>);
};
// caja registradora: las teclas suben $4.00 y el ticket sale
export const register: H = ({ dur }) => {
  const t = useT(), up = eout(pr(t, 0.2, 0.6)), tk = eout(pr(t, 0.7, 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #463a2e, #141010)" }}><Svg>
    <rect x={560} y={180} width={800} height={230} rx={20} fill="#B88C3A" stroke="#5a3f12" strokeWidth={8} />
    {["$", "4", ".", "0", "0"].map((c, i) => <g key={i} transform={`translate(${700 + i * 120} ${lerp(420, 240, up)})`}><rect x={-50} y={0} width={100} height={130} fill="#fff" stroke="#333" strokeWidth={4} />{txt(0, 100, c, 90, K.ink, 900, SANS)}</g>)}
    <rect x={480} y={400} width={960} height={420} rx={30} fill="#C9A24E" stroke="#5a3f12" strokeWidth={8} />
    <rect x={820} y={820} width={280} height={260 * tk} fill="#F8F5EC" />{tk > 0.5 && txt(960, 900, "VINEGAR 1 GAL", 26, K.ink, 700, "monospace")}{tk > 0.8 && txt(960, 950, "TOTAL  $4.00", 30, K.ink, 900, "monospace")}
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={580 + (i % 6) * 150} cy={520 + Math.floor(i / 6) * 120} r={44} fill="#3a2a10" stroke="#e8d8a8" strokeWidth={4} />)}
  </Svg></AbsoluteFill></F>);
};

// ── EL CHORRO (siphon jet) ─────────────────────────────
// la esponja vacía la taza al balde: la taza baja, el balde sube
export const sponge_bucket: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = pr(t, 0.4, D - 1.0), squeeze = Math.abs(Math.sin(t * 3));
  return (<F dur={dur}><Pad no="0801"><Svg>
    <ellipse cx={620} cy={560} rx={300} ry={220} fill={K.porcelain} stroke={K.ink} strokeWidth={6} />
    <clipPath id="bowlS"><ellipse cx={620} cy={560} rx={270} ry={190} /></clipPath>
    <rect x={320} y={lerp(470, 740, k)} width={600} height={400} fill={K.water} clipPath="url(#bowlS)" opacity={0.85} />
    <path d="M1120 420 L1440 420 L1410 820 L1150 820 Z" fill="#4E7FA6" stroke={K.ink} strokeWidth={6} />
    <clipPath id="bk"><path d="M1124 424 L1436 424 L1408 816 L1152 816 Z" /></clipPath><rect x={1120} y={lerp(816, 520, k)} width={320} height={400} fill={K.water} clipPath="url(#bk)" />
    <g transform={`translate(${880 + 120 * Math.sin(t * 1.5)} ${360}) scale(1 ${1 - squeeze * 0.25})`}><rect x={-80} y={-50} width={160} height={100} rx={18} fill="#F2C230" stroke="#A77D06" strokeWidth={4} /><rect x={-80} y={-50} width={160} height={30} rx={10} fill="#3F7D4E" /></g>
    {txt(960, 960, "BOWL NEARLY EMPTY", 56, K.ink, 900, SANS)}
  </Svg></Pad></F>);
};
// vista desde arriba del fondo de la taza: el desagüe grande atrás, el chorro chico adelante; una moneda de 25 centavos para el tamaño
export const quarter: H = ({ dur }) => {
  const t = useT(), c = eout(pr(t, 1.6, 2.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9dcdc" }}><Svg>
    <ellipse cx={960} cy={540} rx={620} ry={430} fill={K.porcelain} stroke="#9aa" strokeWidth={8} />
    <circle cx={960} cy={370} r={150} fill="#16222b" />{txt(960, 180, "DRAIN (BACK)", 34, K.graphite, 900, SANS)}
    <circle cx={960} cy={760} r={46} fill="#16222b" stroke="#EDE6D3" strokeWidth={10} />{txt(1240, 770, "SIPHON JET", 44, K.red, 900, SANS)}
    <g transform={`translate(${lerp(1700, 1080, c)} 760)`}><circle r={52} fill="#BFC3C7" stroke="#7c8186" strokeWidth={6} /><circle r={40} fill="none" stroke="#9aa0a5" strokeWidth={3} />{txt(0, 12, "25¢", 30, "#5b6066", 900, SANS)}</g>
    <g opacity={c}>{txt(960, 1030, "ABOUT A QUARTER, OR A BIT BIGGER", 44, K.ink, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// paño frío: el trapo empapado se apoya sobre el agujero del chorro como un paño en la frente, y gotea
export const compress: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9dcdc" }}><Svg>
    <ellipse cx={960} cy={620} rx={700} ry={330} fill={K.porcelain} stroke="#9aa" strokeWidth={8} />
    <circle cx={960} cy={640} r={60} fill="#16222b" stroke="#EDE6D3" strokeWidth={14} />
    <g transform={`translate(960 ${lerp(200, 640, d)}) rotate(${lerp(-20, 4, d)})`}><path d="M-200 -70 Q-100 -100 0 -70 Q100 -40 200 -70 L210 60 Q100 90 0 60 Q-100 30 -210 60 Z" fill="#E9D9B6" stroke="#A88E5A" strokeWidth={5} />
      {[0, 1, 2].map((i) => <circle key={i} cx={-120 + i * 120} cy={70 + ((t * 120 + i * 30) % 100)} r={9} fill="#E9FF7A" opacity={0.8} />)}</g>
    {txt(960, 180, "IT STAYS ON THE HOLE", 60, K.ink, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

// ── ERRORES ─────────────────────────────────────────────
// rueda de reconocimiento policial: cinco sospechosos con su cartel
export const lineup: H = ({ dur }) => {
  const t = useT();
  const S = ["NEW TOILET", "THE NAIL", "MIXED CLEANERS", "TREATED AS A CLOG", "FORCED VALVE"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2d31" }}><Svg>
    {Array.from({ length: 8 }, (_, i) => <g key={i}><line x1={0} x2={1920} y1={180 + i * 100} y2={180 + i * 100} stroke="#888" strokeWidth={2} />{txt(60, 190 + i * 100, `${7 - i}'`, 30, "#aaa", 700, SANS, "start")}</g>)}
    {S.map((s, i) => { const x = 320 + i * 320, k = spr(t, 0.2 + i * 0.25); return (<g key={s} opacity={cl(k)} transform={`translate(${x} ${lerp(900, 0, cl(k))})`}>
      <circle cx={0} cy={400} r={70} fill="#111" /><path d="M-110 880 L-110 560 Q-110 480 0 480 Q110 480 110 560 L110 880 Z" fill="#111" />
      <rect x={-140} y={640} width={280} height={110} fill="#F0EBDD" />{txt(0, 690, `No. ${i + 1}`, 34, K.ink, 900, SANS)}{txt(0, 735, s, s.length > 12 ? 22 : 28, K.red, 900, SANS)}</g>); })}
    {txt(960, 120, "THE FIVE MISTAKES", 60, K.cream, 900, SLAB)}
  </Svg></AbsoluteFill></F>);
};
// horno de cerámica: corte del inodoro = vidrio fundido sobre arcilla a 2300 °F
export const kiln: H = ({ dur }) => {
  const t = useT(), temp = Math.round(lerp(70, 2300, eout(pr(t, 0.2, 1.8))));
  return (<F dur={dur}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #ff7a2a, #3a0d02 70%)" }}><Svg>
    <path d="M560 900 L560 380 Q960 140 1360 380 L1360 900 Z" fill="#4a1d0e" stroke="#2a0d04" strokeWidth={12} />
    <rect x={700} y={540} width={520} height={160} fill="#B9845A" /><rect x={700} y={500} width={520} height={44} fill="rgba(255,255,255,0.85)" />
    {txt(960, 640, "CLAY", 44, "#4a2a12", 900, SANS)}{txt(1260, 530, "GLASS", 40, "#fff", 900, SANS, "start")}
    {txt(960, 300, `${temp}°F`, 90, "#FFE0B0", 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// rombo de peligro (genérico): lejía + vinagre = gas; la puerta del baño se cierra
export const hazard_diamond: H = ({ dur }) => {
  const t = useT(), k = spr(t, 0.2), door = eio(pr(t, 2.0, 3.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1a1a1a" }}><Svg>
    <g transform={`translate(700 520) rotate(45) scale(${cl(k)})`}>
      <rect x={-260} y={-260} width={260} height={260} fill="#2a64c8" /><rect x={0} y={-260} width={260} height={260} fill="#d83a2e" />
      <rect x={-260} y={0} width={260} height={260} fill="#f2f2f2" /><rect x={0} y={0} width={260} height={260} fill="#f2c230" />
      <rect x={-260} y={-260} width={520} height={520} fill="none" stroke="#111" strokeWidth={12} />
    </g>
    {txt(700, 530, "GAS", 110, "#111", 900, SANS)}
    <g transform="translate(1380 520)"><rect x={-180} y={-300} width={360} height={600} fill="#5a4a3a" /><g transform={`scale(${1 - door * 0.9} 1)`}><rect x={-180} y={-300} width={360} height={600} fill="#C9A26B" stroke="#6E5230" strokeWidth={6} /></g></g>
    {txt(960, 980, "BLEACH + VINEGAR · NEVER", 60, "#fff", 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// mordidas: la pastilla del tanque le da tarascones a la goma del flapper hasta que gotea
export const bite_marks: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.floor(pr(t, 0.4, D - 1.6) * 6), drip = pr(t, D - 1.6, D);
  const B = [[-120, -40], [80, -120], [140, 60], [-60, 130], [10, 10], [-180, 90]];
  return (<F dur={dur}><Pad no="0846"><Svg>
    <circle cx={960} cy={520} r={260} fill="#C2302A" stroke="#6E1410" strokeWidth={8} />
    {B.slice(0, n).map(([x, y], i) => <path key={i} d={`M${960 + x - 50} ${520 + y} a 50 40 0 0 0 100 0 l -12 10 l -12 -10 l -12 10 l -12 -10 l -12 10 l -12 -10 l -12 10 Z`} fill={K.pad} />)}
    <g transform={`translate(${1400 - 60 * Math.sin(t * 6)} 400)`}><rect x={-70} y={-40} width={140} height={80} rx={20} fill="#3D7FD8" />{txt(0, 12, "TABLET", 26, "#fff", 900, SANS)}</g>
    {drip > 0 && [0, 1].map((i) => <circle key={i} cx={960} cy={800 + ((drip * 300 + i * 120) % 240)} r={14} fill={K.water} />)}
    {txt(960, 980, "THEY EAT THE FLAPPER", 60, K.ink, 900, SANS)}
  </Svg></Pad></F>);
};
// raspadita: el sinfín metálico raya la porcelana y la marca gris no se va
export const scratch_card: H = ({ dur }) => {
  const t = useT(), k = pr(t, 0.4, 2.6);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a6a4a" }}><Svg>
    <rect x={420} y={140} width={1080} height={760} rx={30} fill="#F2E9C9" stroke="#B88C3A" strokeWidth={12} />
    {txt(960, 240, "SCRATCH & LOSE", 60, "#B3261E", 900, SLAB)}
    <rect x={520} y={300} width={880} height={480} rx={20} fill={K.porcelain} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${560 + i * 30} ${330 + i * 60} q 300 ${40 - i * 10} 760 ${20 + i * 8}`} stroke="#6b6f74" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(k * 1.4 - i * 0.08)} />)}
    <g opacity={cl((t - 2.6) * 3)}>{txt(960, 860, "GRAY FOR GOOD", 56, "#B3261E", 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// brújula de cuatro rumbos: agujeros, chorro, nivel, cadena
export const compass_four: H = ({ dur }) => {
  const t = useT(), a = 720 * (1 - eout(pr(t, 0.2, 2.2))) + 20 * Math.sin(t * 3) * (1 - pr(t, 0.2, 2.6));
  const L: [string, number, number][] = [["HOLES", 960, 170], ["JET", 1420, 560], ["LEVEL", 960, 960], ["CHAIN", 500, 560]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <circle cx={960} cy={540} r={340} fill="#EFE3C6" stroke="#8a6a3a" strokeWidth={14} />
    {Array.from({ length: 36 }, (_, i) => <line key={i} x1={960} x2={960} y1={210} y2={i % 9 ? 230 : 250} stroke="#5a4a3a" strokeWidth={3} transform={`rotate(${i * 10} 960 540)`} />)}
    <g transform={`rotate(${a} 960 540)`}><path d="M960 250 L1000 540 L960 830 L920 540 Z" fill="#B3261E" /><path d="M960 540 L1000 540 L960 830 L920 540 Z" fill="#14263D" /></g>
    <circle cx={960} cy={540} r={20} fill="#B88C3A" />
    {L.map(([s, x, y], i) => <g key={s} opacity={cl((t - 0.4 - i * 0.3) * 3)}>{txt(x, y, s, 54, K.cream, 900, SANS)}</g>)}
  </Svg></AbsoluteFill></F>);
};
// guía de campo: lámina de especie para cada tipo de inodoro
export const field_guide: H = ({ dur, v = 0 }) => {
  const t = useT();
  const SP: [string, string, string][] = [["LOW-FLOW, 1994+", "1.6 gallons a flush", "same trick, holes are smaller"], ["NO OVERFLOW TUBE", "nothing to pour into", "vinegar on a rag in the rim"], ["DUAL FLUSH", "two buttons on top", "same idea"], ["PRESSURE-ASSIST", "a sealed tank inside", "hands off"], ["ON WELL WATER", "the hardest water", "do it twice a year"]];
  const [a, b, c] = SP[v] || SP[0], k = spr(t, 0.05, 1.6);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#C9BFA6" }}><Svg>
    <g transform={`translate(960 540) scale(${0.9 + 0.1 * cl(k)}) translate(-960 -540)`}>
      <rect x={300} y={90} width={1320} height={900} fill="#F4EEDC" stroke="#8a7a5a" strokeWidth={4} />
      {txt(400, 170, `PLATE ${["I", "II", "III", "IV", "V"][v]}`, 34, "#8a7a5a", 700, SLAB, "start")}
      <g transform="translate(-60 0)"><Loo x={720} y={760} s={2.0} col="#5a4a3a" fill="#FBF6E8" /></g>
      {v === 2 && <><circle cx={740} cy={240} r={18} fill="#5a4a3a" /><circle cx={790} cy={240} r={24} fill="#5a4a3a" /></>}
      {v === 3 && <rect x={680} y={300} width={140} height={160} rx={30} fill="none" stroke="#B3261E" strokeWidth={6} strokeDasharray="12 8" />}
      {v === 1 && <X x={760} y={380} p={1} s={40} />}
      {txt(1080, 380, a, 54, K.ink, 900, SLAB, "start")}{txt(1080, 460, b, 40, "#5a4a3a", 700, SANS, "start")}{txt(1080, 560, c, 48, "#B3261E", 700, HAND, "start")}
    </g>
  </Svg></AbsoluteFill></F>);
};
// el respiradero = la pajita: con el dedo arriba el líquido no baja; al soltar, corre
export const straw_finger: H = ({ dur }) => {
  const t = useT(), D = dur / 30, lift = eio(pr(t, D * 0.55, D * 0.55 + 0.6)), drain = pr(t, D * 0.55 + 0.4, D - 0.4);
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={900} y={180} width={60} height={640} fill="rgba(255,255,255,0.25)" stroke={K.cream} strokeWidth={4} />
    <rect x={904} y={lerp(420, 820, drain)} width={52} height={lerp(400, 0, drain)} fill={K.water} />
    <g transform={`translate(930 ${lerp(150, -60, lift)})`}><path d="M-60 0 Q-60 -40 0 -40 Q60 -40 60 0 L60 120 L-60 120 Z" fill="#E8B98F" stroke="#8a5a3a" strokeWidth={5} /></g>
    {drain > 0 && [0, 1, 2].map((i) => <circle key={i} cx={930} cy={850 + ((t * 300 + i * 50) % 150)} r={12} fill={K.water} />)}
    {txt(1420, 420, "THE ROOF VENT", 56, K.cream, 900, SANS)}{txt(1420, 500, lift < 0.5 ? "blocked = finger on the straw" : "open = it runs", 44, "#FFE08A", 700, HAND)}
  </Svg></Blueprint></F>);
};

// ── RUTINA ───────────────────────────────────────────────
// la calcomanía de service del parabrisas: próxima revisión
export const service_sticker: H = ({ dur, v = 0 }) => {
  const t = useT(), k = spr(t, 0.15);
  const S: [string, string, string][] = [["EVERY MONTH", "WATER LEVEL", "5 seconds"], ["EVERY FEW MONTHS", "PUSH & LISTEN", "the whoosh"], ["EVERY 6 MONTHS", "MIRROR TEST", "10 seconds"], ["ONCE A YEAR", "OVERNIGHT VINEGAR", "hard-water cities"]];
  const [a, b, c] = S[v] || S[0];
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(160deg, #5b7488, #1f2b36)" }}><Svg>
    <path d="M0 0 L1920 0 L1920 1080 L0 1080 Z" fill="rgba(255,255,255,0.05)" /><line x1={0} y1={980} x2={1920} y2={760} stroke="rgba(255,255,255,0.12)" strokeWidth={60} />
    <g transform={`translate(1320 380) rotate(${-4 + (1 - cl(k)) * 20}) scale(${cl(k)})`}>
      <rect x={-300} y={-230} width={600} height={460} rx={30} fill="#FFFFFF" stroke="#C0302A" strokeWidth={10} />
      {txt(0, -150, "NEXT SERVICE", 40, "#C0302A", 900, SANS)}<line x1={-260} x2={260} y1={-120} y2={-120} stroke="#C0302A" strokeWidth={4} />
      {txt(0, -40, a, 50, K.ink, 900, SANS)}{txt(0, 50, b, 54, K.ink, 900, SLAB)}{txt(0, 140, c, 46, K.graphite, 700, HAND)}
    </g>
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={160 + i * 110} y={760} width={80} height={80} rx={12} fill={i <= v ? "#C0302A" : "rgba(255,255,255,0.2)"} />)}
  </Svg></AbsoluteFill></F>);
};

// ── HISTORIA (diner de Monroe Street) ─────────────────
// cartel de neón del diner que parpadea y se enciende
export const neon: H = ({ dur }) => {
  const t = useT(), on = t > 0.9 || (t > 0.3 && Math.sin(t * 40) > 0.3);
  const glow = (c: string) => on ? `drop-shadow(0 0 18px ${c}) drop-shadow(0 0 40px ${c})` : "none";
  return (<F dur={dur}><AbsoluteFill style={{ background: "#07080c" }}><Svg>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#brick)" opacity={0.25} />
    <text x={960} y={420} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={200} fill="none" stroke={on ? "#FF5FA8" : "#3a2030"} strokeWidth={8} style={{ filter: glow("#FF5FA8") }}>Diner</text>
    <text x={960} y={620} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={90} fill="none" stroke={on ? "#5FE3FF" : "#203a40"} strokeWidth={5} letterSpacing={14} style={{ filter: glow("#5FE3FF") }}>MONROE ST</text>
    <text x={960} y={800} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={70} fill="none" stroke={on ? "#FFD25F" : "#40381f"} strokeWidth={4} style={{ filter: glow("#FFD25F") }}>OPEN</text>
  </Svg></AbsoluteFill></F>);
};
// pedido al corralón en papel carbónico: dos inodoros… y al final el sello de CANCELADO
export const cancel_order: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.floor(pr(t, 0.3, 2.4) * 3);
  const L = ["2 × TOILET, WHITE", "2 × WAX RING", "DELIVERY MONDAY"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <rect x={540} y={100} width={840} height={880} fill="#FCE9A8" />{txt(960, 190, "SUPPLY HOUSE · ORDER", 48, K.ink, 900, SLAB)}
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={580} x2={1340} y1={300 + i * 60} y2={300 + i * 60} stroke="rgba(0,0,0,0.15)" strokeWidth={2} />)}
    {L.slice(0, n).map((s, i) => <text key={s} x={600} y={350 + i * 90} fontFamily={HAND} fontWeight={700} fontSize={56} fill="#2a3a8a">{s}</text>)}
    <Stamp t={t} at={Math.max(2.8, D - 2.4)} x={960} y={720} text="CANCELLED" size={100} />
  </Svg></AbsoluteFill></F>);
};
// boquilla de manguera de bomberos que larga el chorro
export const fire_hose: H = ({ dur }) => {
  const t = useT(), k = eout(pr(t, 0.3, 0.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#14181c" }}><Svg>
    <path d="M0 760 Q300 700 460 620" stroke="#B3261E" strokeWidth={70} fill="none" />
    <path d="M440 580 L620 520 L640 600 L470 680 Z" fill="#C9A24E" stroke="#6a4a12" strokeWidth={6} />
    {Array.from({ length: 30 }, (_, i) => { const u = ((t * 2.4 + i / 30) % 1) * k; return <circle key={i} cx={640 + u * 1300} cy={560 - u * 260 + u * u * 300 + ((i * 37) % 60) - 30} r={10 + u * 26} fill={K.water} opacity={0.75 * (1 - u * 0.5)} />; })}
    {txt(1300, 940, "LIKE A FIRE HOSE", 70, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// pizarrón de menú escrito con tiza: 1 hora + 2 bidones
export const menu_board: H = ({ dur }) => {
  const t = useT();
  const L = ["TODAY'S SPECIAL", "1 HOUR LABOR", "+ 2 JUGS VINEGAR"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2b1d12" }}><Svg>
    <rect x={420} y={120} width={1080} height={820} fill="#1f2a24" stroke="#7a5230" strokeWidth={30} />
    {L.map((s, i) => { const n = Math.floor(pr(t, 0.2 + i * 0.8, 0.9 + i * 0.8) * s.length); return <text key={s} x={960} y={330 + i * 200} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={i ? 96 : 70} fill={i === 0 ? "#FFD25F" : "#F2F2EA"}>{s.slice(0, n)}</text>; })}
    <text x={960} y={870} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={60} fill="#F2F2EA" opacity={cl((t - 2.6) * 3)}>— Gus</text>
  </Svg></AbsoluteFill></F>);
};
// el espejito de dentista entra al bolsillo de la camisa
export const pocket: H = ({ dur }) => {
  const t = useT(), k = eio(pr(t, 0.1, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#7d8fa0" }}><Svg>
    <rect x={0} y={0} width={1920} height={1080} fill="#8e9fae" />
    <g transform={`translate(960 ${lerp(120, 520, k)}) rotate(${lerp(-30, 0, k)})`}><rect x={-10} y={-320} width={20} height={380} fill="#B9BEC2" /><circle cx={0} cy={-330} r={40} fill="#d5e3ea" stroke="#7c8186" strokeWidth={6} /></g>
    <path d="M760 520 L1160 520 L1160 860 Q960 900 760 860 Z" fill="#7d8fa0" stroke="#4e5d6a" strokeWidth={6} />
    <line x1={760} y1={560} x2={1160} y2={560} stroke="#4e5d6a" strokeWidth={4} strokeDasharray="10 8" />
  </Svg></AbsoluteFill></F>);
};
// bomba de fuente: el vinagre gira en circuito, y el que se mueve trabaja más rápido
export const pump_loop: H = ({ dur }) => {
  const t = useT();
  const loop = "M560 300 L1360 300 Q1460 300 1460 400 L1460 680 Q1460 780 1360 780 L560 780 Q460 780 460 680 L460 400 Q460 300 560 300 Z";
  return (<F dur={dur}><Pad no="0872"><Svg>
    <path d={loop} stroke="#9aa1a6" strokeWidth={60} fill="none" />
    <path d={loop} stroke="#E9FF7A" strokeWidth={20} fill="none" strokeDasharray="40 50" strokeDashoffset={-t * 300} />
    <rect x={860} y={720} width={200} height={120} rx={20} fill="#3B4A5A" />{txt(960, 795, "PUMP", 34, "#fff", 900, SANS)}
    {txt(960, 520, "MOVING", 80, K.ink, 900, SLAB)}{txt(960, 610, "beats still", 56, K.graphite, 700, HAND)}
  </Svg></Pad></F>);
};
// bisagra del flapper con costra: queda abierta una rendija y el agua se escapa; la costra se va y cierra
export const hinge_crust: H = ({ dur }) => {
  const t = useT(), D = dur / 30, clean = eio(pr(t, D * 0.5, D * 0.5 + 1.2)), gap = lerp(14, 0, clean);
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={600} y={620} width={720} height={60} fill="#C9CED2" /><rect x={880} y={680} width={160} height={300} fill="#C9CED2" />
    <g transform={`rotate(${-gap} 700 600)`}><rect x={700} y={560} width={520} height={60} rx={20} fill="#C2302A" stroke="#6E1410" strokeWidth={5} /></g>
    <circle cx={700} cy={590} r={40} fill="#9aa1a6" stroke="#333" strokeWidth={5} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={680 + (i * 13) % 50} cy={560 + (i * 17) % 60} r={10} fill="#EDE6D3" opacity={1 - clean} />)}
    {gap > 3 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={1180 - 40 * i} cy={640 + ((t * 300 + i * 40) % 300)} r={8} fill={K.water} />)}
    {txt(960, 300, clean < 0.5 ? "CRUSTED HINGE: OPEN A CRACK" : "CLEAN HINGE: SEALS", 56, K.cream, 900, SANS)}
  </Svg></Blueprint></F>);
};
// pila de 20 bidones: 19 se deslizan fuera y queda uno
export const jug_stack: H = ({ dur }) => {
  const t = useT(), k = eio(pr(t, 1.6, 3.2));
  return (<F dur={dur}><Pad no="0889"><Svg>
    {Array.from({ length: 20 }, (_, i) => { const r = Math.floor(i / 5), c = i % 5, keep = i === 17; const x = 560 + c * 200 + (keep ? 0 : (c < 2 ? -1 : 1) * k * 1400), y = 860 - r * 190;
      return <g key={i} transform={`translate(${x} ${y})`} opacity={keep ? 1 : 1 - k * 0.6}><path d="M-70 0 L-70 -140 Q-70 -160 -40 -165 L-25 -190 L25 -190 L30 -165 Q70 -160 70 -140 L70 0 Z" fill="rgba(255,255,255,0.85)" stroke="#9aa" strokeWidth={4} /><rect x={-50} y={-110} width={100} height={60} fill={K.cream} /></g>; })}
    {txt(960, 160, k < 0.5 ? "20 GALLONS?" : "YOU NEED ONE", 80, K.ink, 900, SLAB)}
  </Svg></Pad></F>);
};
// el balde visto de arriba: la cuchara gira y los cristales se disuelven
export const stir_dissolve: H = ({ dur }) => {
  const t = useT(), D = dur / 30, d = pr(t, 0.4, D - 1.6);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2a2a" }}><Svg>
    <circle cx={960} cy={540} r={380} fill="#4E7FA6" stroke="#222" strokeWidth={12} /><circle cx={960} cy={540} r={350} fill="#CFE6F2" />
    {Array.from({ length: 40 }, (_, i) => { const a = i * 0.8 + t * 3, r = 40 + (i * 23) % 290; return <rect key={i} x={960 + Math.cos(a) * r} y={540 + Math.sin(a) * r} width={14 * (1 - d)} height={14 * (1 - d)} fill="#fff" />; })}
    <g transform={`rotate(${t * 200} 960 540)`}><rect x={950} y={260} width={20} height={300} rx={10} fill="#8a6a3a" /></g>
    {txt(960, 1010, d < 1 ? "STIR UNTIL IT'S GONE" : "NEVER POUR IT DRY", 56, "#fff", 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// cadena de papel del repaso: cada eslabón es una idea
export const paper_chain: H = ({ dur, v = 0 }) => {
  const t = useT();
  const L = v === 0 ? ["ROCK IN THE HOLES", "AND IN THE JET", "NOT A TIRED TOILET"] : ["ROCK IN THE HOLES", "AND IN THE JET", "NOT A TIRED TOILET", "ALL NIGHT + A NOTE"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#14263D" }}><Svg>
    {L.map((s, i) => { const k = spr(t, (v === 1 && i < 3 ? 0 : 0.2 + (v === 1 ? 0 : i * 0.6))), x = 330 + i * (L.length === 4 ? 420 : 600);
      return <g key={s} transform={`translate(${x} 540) scale(${cl(k)})`}><rect x={-190} y={-90} width={380} height={180} rx={90} fill="none" stroke={["#E9FF7A", "#F2C230", "#FF7A5A", "#7CFF9A"][i]} strokeWidth={28} />{txt(0, 160, s, 34, K.cream, 900, SANS)}</g>; })}
  </Svg></AbsoluteFill></F>);
};
