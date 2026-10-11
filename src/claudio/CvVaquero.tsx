// Kit COCINA del canal Claudio Vaquero (EN), dentro del mundo (cama real + sombra + luz):
//   CvMeatThermo  termómetro de carne de aguja (°F): la aguja sube de `from` a `to`; marca la línea USDA (`mark`, 145 °F)
//                 con su rótulo; pasado el blanco (`over`) se pone rojo ("DRY")
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, Stamp, Tape, lin, pop, useOut } from "./ClParts";

const OK = "#3E8A3A", HOT = "#C8372D";
const Tag: React.FC<{ text: string; color: string; o?: number }> = ({ text, color, o = 1 }) => (
  <div style={{ opacity: o, display: "inline-block", background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);

// ───────────────── CvMeatThermo
export const CvMeatThermo: React.FC<{ from?: number; to?: number; mark?: number; over?: number; label?: string; sub?: string; bed?: string }> = ({ from = 70, to = 145, mark = 145, over = 160, label, sub, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  const v = from + (to - from) * ease(clamp01((f - 14) / (T * 0.5)));
  const LO = 40, HI = 200, ang = (t: number) => -120 + 240 * clamp01((t - LO) / (HI - LO)); // esfera de -120° a +120°
  const R = 300, cx = 360, cy = 360;
  const pt = (t: number, r: number) => { const a = (ang(t) - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const hot = v > over, done = v >= mark - 0.5;
  const col = hot ? HOT : done ? OK : CL.navy;
  const [mx1, my1] = pt(mark, R - 10), [mx2, my2] = pt(mark, R - 70);
  const [nx, ny] = pt(v, R - 40);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={161} dim={0.3} />
      <Contact x={760} y={930} w={620} o={0.35} />
      <div style={{ position: "absolute", left: 760, top: 520, translate: "-50% -50%", scale: String(0.85 + 0.15 * p) }}>
        <Card style={{ width: 720, height: 720, borderRadius: "50%", padding: 0, position: "relative", background: "radial-gradient(circle at 40% 35%,#FFFFFF,#E9E4DA)" }}>
          <svg width={720} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
            <circle cx={cx} cy={cy} r={R + 16} fill="none" stroke="#9AA0A6" strokeWidth={14} />
            {Array.from({ length: 17 }, (_, i) => LO + i * 10).map((t) => { const [a1, b1] = pt(t, R - 6), [a2, b2] = pt(t, t % 20 === 0 ? R - 46 : R - 28); const [tx, ty] = pt(t, R - 82);
              return <g key={t}><line x1={a1} y1={b1} x2={a2} y2={b2} stroke={CL.ink} strokeWidth={t % 20 === 0 ? 6 : 3} />{t % 40 === 0 ? <text x={tx} y={ty + 12} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.ink}>{t}</text> : null}</g>; })}
            {[[mark, over, OK], [over, HI, HOT]].map(([a, b, c], i) => { const r = R - 18, [x1, y1] = pt(a as number, r), [x2, y2] = pt(b as number, r);
              return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={c as string} strokeWidth={22} opacity={0.35 * lin(f, 6, 14)} />; })}
            <line x1={mx1} y1={my1} x2={mx2} y2={my2} stroke={OK} strokeWidth={14} strokeLinecap="round" opacity={lin(f, 6, 14)} />
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={col} strokeWidth={12} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={26} fill={CL.ink} />
            <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill="#7A7F86">°F</text>
          </svg>
        </Card>
        <div style={{ position: "absolute", left: 800, top: 140, fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: col, whiteSpace: "nowrap", lineHeight: 1 }}>{Math.round(v)}°F</div>
        {label ? <div style={{ position: "absolute", left: 800, top: 370, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.ink, whiteSpace: "nowrap", opacity: lin(f, 8, 16) }}>{label}</div> : null}
        {sub ? <div style={{ position: "absolute", left: 800, top: 470 }}><Tag text={sub} color={hot ? HOT : OK} o={lin(f, T * 0.55, T * 0.65)} /></div> : null}
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── CvOldPhoto  foto vieja de Claudio joven en el rancho (copia de papel de los 80, borde blanco, fecha naranja
//                   de cámara, epígrafe a mano que se escribe) que cae sobre la cama y se acerca despacio; sello de los años
export const CvOldPhoto: React.FC<{ img: string; caption: string; date?: string; stamp?: string; bed?: string }> = ({ img, caption, date = "'85", stamp, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const y = (1 - p) * -900, r = -6 + 3.5 * p;
  const kb = lin(f, 0, T, 1.0, 1.09), w = lin(f, 18, 46);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={171} dim={0.34} />
      <Contact x={960} y={985} w={1100} o={0.3 * p} />
      <div style={{ position: "absolute", left: "50%", top: 70, translate: `-50% ${y}px`, rotate: `${r}deg`, scale: String(lin(f, 10, T, 1, 1.04)), transformOrigin: "50% 40%" }}>
        <div style={{ background: "#F4EFE4", padding: "26px 26px 110px", boxShadow: `0 50px 90px ${CL.shadow}, 0 8px 16px rgba(0,0,0,0.18)`, position: "relative" }}>
          <div style={{ width: 1180, height: 660, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(kb), filter: "sepia(0.22) saturate(0.88) contrast(0.96) brightness(1.02)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,20,0,0.35) 100%)" }} />
            <div style={{ position: "absolute", right: 34, bottom: 22, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 40, color: "#FF8A2A", textShadow: "0 0 6px rgba(255,120,30,0.7)", letterSpacing: 3, opacity: lin(f, 12, 20) }}>{date}</div>
          </div>
          <div style={{ position: "absolute", left: 50, bottom: 22, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2B3A67", whiteSpace: "nowrap", clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{caption}</div>
        </div>
        <Tape x={540} y={-22} rot={3} w={190} />
      </div>
      {stamp ? <Stamp text={stamp} at={Math.round(T * 0.45)} color={CL.red} x="80%" y="80%" rot={-8} size={56} /> : null}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── CvPromise  la PROMESA del video en una ficha de recetas del rancho (cartón crema rayado, renglón rojo):
//                   sube con el título, los 3 renglones entran uno por uno con su tilde y al final el sello
export const CvPromise: React.FC<{ kicker?: string; title: string; lines: string[]; stamp?: string; bed?: string }> = ({ kicker = "TODAY ON THE RANCH", title, lines, stamp = "The old vaquero way", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 15);
  const step = (T * 0.5) / Math.max(1, lines.length);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={181} dim={0.32} />
      <Contact x={960} y={700} w={1200} o={0.3 * p} />
      <div style={{ position: "absolute", left: "50%", top: 190, translate: `-50% ${(1 - p) * 900}px`, rotate: `${2 - 3 * p}deg`, scale: String(lin(f, 10, T, 1, 1.03)) }}>
        <div style={{ width: 1320, background: "#FBF6E9", borderRadius: 10, boxShadow: `0 46px 86px ${CL.shadow}, 0 6px 14px rgba(0,0,0,0.16)`, padding: "40px 0 30px", position: "relative" }}>
          <div style={{ padding: "0 70px 22px" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: CL.brass }}>{kicker}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CL.ink, lineHeight: 1.05, marginTop: 6, whiteSpace: "nowrap" }}>{title}</div>
          </div>
          <div style={{ height: 4, background: "#D9534F" }} />
          <div style={{ padding: "14px 70px 0", backgroundImage: "repeating-linear-gradient(transparent 0 74px, #B9CBE0 74px 76px)", backgroundPosition: "0 14px" }}>
            {lines.map((l, i) => { const a = 14 + i * step, o = lin(f, a, a + 8), ck = lin(f, a + 6, a + 14);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 76, opacity: o, translate: `${(1 - o) * 40}px 0` }}>
                  <svg width={58} height={58}><rect x={4} y={4} width={50} height={50} rx={8} fill="none" stroke={CL.ink} strokeWidth={4} />
                    <path d="M14 30 L26 42 L48 14" fill="none" stroke={OK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - ck)} /></svg>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#2B3A67", whiteSpace: "nowrap", background: `linear-gradient(transparent 62%, ${hexA(CL.yellow, 0.55 * ck)} 62%)` }}>{l}</div>
                </div>
              ); })}
          </div>
        </div>
      </div>
      <Stamp text={stamp} at={Math.round(T * 0.62)} color={CL.red} x="74%" y="76%" rot={-7} size={54} />
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
