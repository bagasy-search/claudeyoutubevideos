// Kit COCINA 2 (Claudio Cocina, videos 8-10).
//   ClEggThermo  termómetro del huevo: el mercurio sube y van saliendo las marcas de la CLARA (62° se pone blanca · 80° firme) y de la
//                YEMA (65° espesa · 72° cuajada); el huevo de al lado cambia con cada marca. Al final, la franja de la yema líquida:
//                "cuestión de segundos". `at` = [s] de las 4 marcas + la conclusión.
//   ClRiceRatio  la medida de la fonda: taza y media de arroz (se llena de granos), dos tazas y media de caldo (se llena de caldo),
//                + el jitomate licuado, y la proporción grande "1½ : 2½ · siempre la misma". `at` = [s] arroz, caldo, jitomate, proporción.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, SERIF, LABEL, HAND, hexA, rnd } from "./ClTheme";
import { Bed, Card, lin, pop, useOut } from "./ClParts";

const ease = (x: number) => x * x * (3 - 2 * x);

export const ClEggThermo: React.FC<{ at?: number[]; bed?: string }> = ({ at = [2, 5, 9, 12.5, 16], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const [t1, t2, t3, t4, t5] = at.map((s) => Math.round(s * fps));
  // temperatura mostrada: 40 → 62 (clara blanca) → 80 (clara firme); queda en 80 mientras salen las marcas de la yema
  const temp = interpolate(f, [8, t1 + 6, t2 + 10], [40, 62, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const T0 = 40, T1 = 90, X = 620, Y0 = 820, Y1 = 170; const ty = (t: number) => Y0 - ((t - T0) / (T1 - T0)) * (Y0 - Y1);
  const marks = [
    { t: 62, k: lin(f, t1, t1 + 12), side: -1, col: "#7C8AA0", txt: "la clara se pone blanca" },
    { t: 80, k: lin(f, t2, t2 + 12), side: -1, col: CL.navy, txt: "la clara, firme" },
    { t: 65, k: lin(f, t3, t3 + 12), side: 1, col: "#D98A12", txt: "la yema se espesa" },
    { t: 72, k: lin(f, t4, t4 + 12), side: 1, col: "#B4600A", txt: "la yema, cuajada" },
  ];
  const white = ease(lin(f, t1, t2 + 10));          // clara: transparente → blanca firme
  const yolk = ease(lin(f, t3, t4 + 10));           // yema: brillante → cuajada (mate, más clara)
  const band = lin(f, t5, t5 + 14);
  const EX = 1420, EY = 470, SC = 0.7;
  const yolkCol = `rgb(${Math.round(245 - 10 * yolk)},${Math.round(160 + 40 * yolk)},${Math.round(20 + 60 * yolk)})`;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={47} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.4deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL TERMÓMETRO DEL HUEVO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            {/* franja de la yema líquida: entre que la clara está firme y que la yema cuaja → segundos */}
            <rect x={X - 40} y={ty(72)} width={80} height={ty(65) - ty(72)} fill={hexA("#F2B230", 0.45 * band)} />
            {/* tubo */}
            <rect x={X - 26} y={Y1 - 40} width={52} height={Y0 - Y1 + 60} rx={26} fill="#fff" stroke={CL.ink} strokeWidth={6} />
            <rect x={X - 13} y={ty(temp)} width={26} height={Y0 - ty(temp) + 10} rx={13} fill={CL.red} />
            <circle cx={X} cy={Y0 + 50} r={52} fill={CL.red} stroke={CL.ink} strokeWidth={6} />
            {Array.from({ length: 11 }, (_, i) => { const t = T0 + i * 5; return <g key={i}><line x1={X + 26} x2={X + (i % 2 ? 40 : 52)} y1={ty(t)} y2={ty(t)} stroke={CL.inkSoft} strokeWidth={3} />{i % 2 ? null : <text x={X + 62} y={ty(t) + 10} fontFamily={LABEL} fontSize={28} fill={CL.inkSoft}>{t}°</text>}</g>; })}
            {/* marcas */}
            {marks.map((m, i) => {
              const xl = m.side < 0 ? X - 40 : X + 110, xr = m.side < 0 ? X - 120 : X + 190;
              return m.k > 0 ? <g key={i} opacity={m.k}><line x1={m.side < 0 ? X - 30 : X + 100} x2={xr} y1={ty(m.t)} y2={ty(m.t)} stroke={m.col} strokeWidth={6} strokeLinecap="round" />
                <circle cx={m.side < 0 ? X - 30 : X + 100} cy={ty(m.t)} r={8} fill={m.col} /></g> : null;
            })}
            {/* el huevo (visto desde arriba en el sartén) */}
            <ellipse cx={EX} cy={EY + 230 * SC} rx={330 * SC} ry={30} fill="rgba(0,0,0,0.08)" />
            <path d={Array.from({ length: 73 }, (_, i) => { const a = (i / 72) * Math.PI * 2; const r = (260 + Math.sin(a * 5 + 1) * 18 + Math.sin(a * 3) * 14) * SC; return `${i ? "L" : "M"} ${(EX + Math.cos(a) * r * 1.15).toFixed(1)} ${(EY + Math.sin(a) * r * 0.82).toFixed(1)}`; }).join(" ") + " Z"}
              fill={`rgba(${Math.round(232 + 22 * white)},${Math.round(236 + 18 * white)},${Math.round(225 + 28 * white)},${0.35 + 0.65 * white})`} stroke={hexA("#C9B48A", 0.35 + 0.5 * white)} strokeWidth={6 + 6 * white} />
            {white > 0.6 ? <path d={Array.from({ length: 73 }, (_, i) => { const a = (i / 72) * Math.PI * 2; const r = (262 + Math.sin(a * 5 + 1) * 18 + Math.sin(a * 3) * 14) * SC; return `${i ? "L" : "M"} ${(EX + Math.cos(a) * r * 1.15).toFixed(1)} ${(EY + Math.sin(a) * r * 0.82).toFixed(1)}`; }).join(" ") + " Z"} fill="none" stroke={hexA("#C8862E", (white - 0.6) * 1.6)} strokeWidth={10} /> : null}
            <circle cx={EX - 20 * SC} cy={EY - 10 * SC} r={(112 - 6 * yolk) * SC} fill={yolkCol} />
            <ellipse cx={EX - 55 * SC} cy={EY - 50 * SC} rx={34 * SC} ry={20 * SC} fill={`rgba(255,255,255,${0.55 * (1 - yolk) + 0.1})`} />
            {/* velo blanco sobre la yema cuando el vapor la cubre */}
            <circle cx={EX - 20 * SC} cy={EY - 10 * SC} r={(112 - 6 * yolk) * SC} fill={`rgba(255,250,240,${0.35 * white * (0.4 + 0.6 * band)})`} />
          </svg>
          {marks.map((m, i) => (
            <div key={i} style={{ position: "absolute", top: ty(m.t) - 34, ...(m.side < 0 ? { right: 1680 - (X - 135) } : { left: X + 205 }), opacity: m.k, translate: `${(1 - m.k) * 30 * m.side}px 0`, textAlign: m.side < 0 ? "right" : "left", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: m.col }}>{m.t}° </span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.ink }}>{m.txt}</span>
            </div>
          ))}
          <div style={{ position: "absolute", left: 1210, top: 800, translate: `-50% ${(1 - band) * 20}px`, opacity: band, whiteSpace: "nowrap" }}>
            <span style={{ background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 48, padding: "8px 30px", borderRadius: 12 }}>yema líquida: cuestión de segundos</span>
          </div>
          <div style={{ position: "absolute", left: EX - 20, translate: "-50% 0", whiteSpace: "nowrap", top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.inkSoft, opacity: lin(f, 6, 18) }}>{white < 0.5 ? "clara cruda" : yolk < 0.5 ? "clara firme, yema líquida" : "yema cuajada"}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// taza medidora de vidrio con marcas; `fill` 0..1 del nivel, `kind` arroz (granos) o caldo (líquido ámbar con meniscos)
const Cup: React.FC<{ x: number; y: number; level: number; kind: "arroz" | "caldo"; label: string; k: number; red?: number }> = ({ x, y, level, kind, label, k, red = 0 }) => {
  const W = 330, H = 430, top = y + H - level * (H - 40);
  return (
    <g opacity={k} transform={`translate(0 ${(1 - k) * 40})`}>
      <defs><clipPath id={`cup_${kind}`}><path d={`M ${x} ${y} L ${x + W} ${y} L ${x + W - 30} ${y + H} L ${x + 30} ${y + H} Z`} /></clipPath></defs>
      <g clipPath={`url(#cup_${kind})`}>
        <rect x={x} y={top} width={W} height={H} fill={kind === "arroz" ? "#F6F1E4" : `rgb(${Math.round(214 - 30 * red)},${Math.round(162 - 80 * red)},${Math.round(80 - 30 * red)})`} />
        {kind === "arroz" ? Array.from({ length: 160 }, (_, i) => { const gx = x + rnd(i) * W, gy = top + 6 + rnd(i + 50) * (H - 10); return gy < y + H ? <ellipse key={i} cx={gx} cy={gy} rx={9} ry={3.2} fill="#E4DCC8" transform={`rotate(${rnd(i + 7) * 180} ${gx} ${gy})`} /> : null; }) : <rect x={x} y={top} width={W} height={10} fill="rgba(255,255,255,0.45)" />}
      </g>
      <path d={`M ${x} ${y} L ${x + W} ${y} L ${x + W - 30} ${y + H} L ${x + 30} ${y + H} Z`} fill="rgba(220,235,245,0.18)" stroke={CL.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${x + W} ${y + 60} q 80 20 60 120 q -10 60 -78 70`} fill="none" stroke={CL.ink} strokeWidth={10} strokeLinecap="round" />
      {[0.25, 0.5, 0.75].map((m, i) => <line key={i} x1={x + 40} x2={x + 90} y1={y + H - m * (H - 40)} y2={y + H - m * (H - 40)} stroke={CL.navy} strokeWidth={4} />)}
      <text x={x + W / 2} y={y + H + 70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={CL.ink}>{label}</text>
    </g>
  );
};

export const ClRiceRatio: React.FC<{ at?: number[]; bed?: string }> = ({ at = [1.4, 3.2, 5.6, 8.0], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const [t1, t2, t3, t4] = at.map((s) => Math.round(s * fps));
  const kA = lin(f, t1 - 6, t1 + 8), kB = lin(f, t2 - 6, t2 + 8);
  const lvA = ease(lin(f, t1, t1 + 30)) * 0.62, lvB = ease(lin(f, t2, t2 + 34)) * 0.9 + ease(lin(f, t3, t3 + 26)) * 0.08;
  const red = ease(lin(f, t3, t3 + 30));
  const jit = lin(f, t3, t3 + 10), big = pop(f, fps, t4, 13);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={52} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "0.4deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>LA MEDIDA DE LA FONDA</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <Cup x={170} y={250} level={lvA} kind="arroz" label="1½ taza" k={kA} />
            <Cup x={640} y={250} level={lvB} kind="caldo" label="2½ tazas" k={kB} red={red * 0.35} />
            {/* chorrito de jitomate licuado */}
            {jit > 0 && red < 0.98 ? <path d={`M 820 170 C 820 210, 810 ${250 + 120 * red}, 805 ${250 + 260 * red}`} fill="none" stroke="#C8321E" strokeWidth={16} strokeLinecap="round" opacity={1 - red * 0.8} /> : null}
          </svg>
          <div style={{ position: "absolute", left: 335, top: 165, translate: "-50% 0", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.inkSoft, opacity: kA }}>arroz largo</div>
          <div style={{ position: "absolute", left: 805, top: 165, translate: "-50% 0", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.inkSoft, opacity: kB }}>caldo caliente</div>
          <div style={{ position: "absolute", left: 1030, top: 230, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#C8321E", opacity: jit, rotate: "-4deg" }}>+ el jitomate licuado</div>
          <div style={{ position: "absolute", left: 1100, top: 420, opacity: Math.min(1, big * 1.3), scale: String(0.7 + 0.3 * big), transformOrigin: "50% 50%", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CL.ink, lineHeight: 1 }}>1½ : 2½</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.nitrile, marginTop: 14 }}>siempre la misma</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ClPorkTemp  el número del cerdo: el mercurio sube hasta 63 °C (sale la marca "63° · 145 °F"), al lado el corte de la chuleta pasa de
//             crudo a rosadita y jugosa (con gotas de jugo), luego "+ 3 min de reposo" y el sello "lo seguro". `at` = [s] 63°, 145°F, reposo, sello.
export const ClPorkTemp: React.FC<{ at?: number[]; bed?: string }> = ({ at = [3, 5, 8, 11], bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 16);
  const [t1, t2, t3, t4] = at.map((s) => Math.round(s * fps));
  const temp = interpolate(f, [8, t1 + 8], [40, 63], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const T0 = 40, T1 = 90, X = 380, Y0 = 820, Y1 = 170; const ty = (t: number) => Y0 - ((t - T0) / (T1 - T0)) * (Y0 - Y1);
  const k63 = lin(f, t1, t1 + 12), kF = lin(f, t2, t2 + 12), kR = lin(f, t3, t3 + 12), kS = lin(f, t4, t4 + 14);
  const cook = ease(lin(f, 8, t1 + 8));                        // 0 crudo → 1 en su punto
  const CX = 1330, CY = 470;
  // chuleta en corte: borde dorado, carne que va de rojo crudo a rosa pálido al centro y blanco hacia la orilla
  const edge = `rgb(${Math.round(200 - 60 * cook)},${Math.round(120 - 40 * cook)},${Math.round(90 - 50 * cook)})`;
  const outer = `rgb(${Math.round(214 + 26 * cook)},${Math.round(120 + 105 * cook)},${Math.round(120 + 85 * cook)})`;
  const inner = `rgb(${Math.round(200 + 38 * cook)},${Math.round(90 + 80 * cook)},${Math.round(100 + 60 * cook)})`;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={53} dim={0.42} />
      <div style={{ position: "absolute", left: 120, top: 70, opacity: out, translate: `0 ${(1 - p) * 90}px` }}>
        <Card style={{ width: 1680, height: 940, padding: 0, overflow: "hidden", rotate: "-0.4deg" }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: CL.nitrile }}>EL NÚMERO DEL CERDO</div>
          <svg width={1680} height={940} viewBox="0 0 1680 940" style={{ position: "absolute", left: 0, top: 0 }}>
            <rect x={X - 26} y={Y1 - 40} width={52} height={Y0 - Y1 + 60} rx={26} fill="#fff" stroke={CL.ink} strokeWidth={6} />
            <rect x={X - 13} y={ty(temp)} width={26} height={Y0 - ty(temp) + 10} rx={13} fill={CL.red} />
            <circle cx={X} cy={Y0 + 50} r={52} fill={CL.red} stroke={CL.ink} strokeWidth={6} />
            {Array.from({ length: 11 }, (_, i) => { const t = T0 + i * 5; return <g key={i}><line x1={X - 26} x2={X - (i % 2 ? 40 : 52)} y1={ty(t)} y2={ty(t)} stroke={CL.inkSoft} strokeWidth={3} />{i % 2 ? null : <text x={X - 62} y={ty(t) + 10} textAnchor="end" fontFamily={LABEL} fontSize={28} fill={CL.inkSoft}>{t}°</text>}</g>; })}
            {k63 > 0 ? <g opacity={k63}><line x1={X + 30} x2={X + 120} y1={ty(63)} y2={ty(63)} stroke="#2E7D4F" strokeWidth={7} strokeLinecap="round" /><circle cx={X + 30} cy={ty(63)} r={9} fill="#2E7D4F" /></g> : null}
            {/* la chuleta en corte */}
            <g transform={`translate(${CX} ${CY}) scale(0.8)`}>
              <ellipse cx={0} cy={250} rx={360} ry={30} fill="rgba(0,0,0,0.08)" />
              <path d="M -330 -60 C -320 -170, -120 -210, 60 -190 C 230 -175, 340 -110, 340 0 C 340 120, 220 190, 40 200 C -150 210, -330 150, -340 40 Z" fill={edge} />
              <path d="M -300 -50 C -290 -150, -110 -180, 60 -165 C 210 -150, 310 -95, 310 0 C 310 105, 205 165, 40 175 C -140 185, -300 130, -310 35 Z" fill={outer} />
              <ellipse cx={20} cy={5} rx={170} ry={95} fill={inner} opacity={0.9} />
              <path d="M -330 -60 C -320 -170, -120 -210, 60 -190 C 230 -175, 340 -110, 340 0" fill="none" stroke="#F3E6CC" strokeWidth={22} opacity={0.85} />
              {Array.from({ length: 6 }, (_, i) => { const d = lin(f, t1 + 4 + i * 5, t1 + 30 + i * 5); return <ellipse key={i} cx={-60 + i * 45} cy={120 + d * 80} rx={9} ry={13} fill={hexA("#E9A49A", 0.75 * cook * (1 - d * 0.4))} />; })}
            </g>
          </svg>
          <div style={{ position: "absolute", top: ty(63) - 52, left: X + 140, opacity: k63, translate: `${(1 - k63) * 30}px 0`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: "#2E7D4F" }}>63 °C</span>
            <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.inkSoft, opacity: kF, marginLeft: 26 }}>· 145 °F</span>
          </div>
          <div style={{ position: "absolute", left: CX, top: 700, translate: "-50% 0", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.ink, opacity: lin(f, 6, 18) }}>{cook < 0.6 ? "cruda" : "rosadita al centro, jugosa"}</div>
          <div style={{ position: "absolute", left: X + 150, top: ty(63) + 70, opacity: kR, translate: `${(1 - kR) * 30}px 0`, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.navy }}>+ 3 minutos de reposo</div>
          <div style={{ position: "absolute", right: 70, top: 60, opacity: kS, scale: String(0.8 + 0.2 * kS), rotate: "6deg" }}>
            <span style={{ border: "6px solid #2E7D4F", color: "#2E7D4F", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, padding: "10px 26px", borderRadius: 14 }}>SEGURO</span>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
