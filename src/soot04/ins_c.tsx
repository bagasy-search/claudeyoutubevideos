import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import { Svg, Cachalote, Bote, Splash, Ballenero, Isla, CasaNan, Farol, Galleta, Pajitas, Pistola, Tiburon, Humo, Barril0, Moneda0 } from "./kit3";
import { Persona, MARINO, CAPITAN, CUAQUERO, GREEN } from "./persona";
import { Chico } from "./reparto";
import { Icono } from "./hud";
import { Ins, Rayos2, Grad, Mar, Monto, Sello, Dice, Rot, Vuela } from "./insertos";

// 10:00 – 15:02 · desertores, Melville, el Essex, el sorteo, el giro final y el cierre
const Marino: React.FC<{ i: number; x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; habla?: boolean; mira?: number; manoD?: React.ReactNode; camina?: number; salta?: number; inclina?: number; viejo?: boolean; opacity?: number }> = ({ i, ...p }) => (
  <Persona {...p} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} />
);
const Pollard: React.FC<{ x: number; y: number; h: number; t: number; expr?: any; salta?: number; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; habla?: boolean; viejo?: boolean; camina?: number; manoD?: React.ReactNode; mira?: number; inclina?: number }> = (p) => (
  <Persona {...p} seed={11} ropa={CAPITAN} casco="capitan" barba={p.viejo ? "#c8c8c8" : "#3a2616"} pantalon="#141a30" />
);
const Melville: React.FC<{ x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; camina?: number; manoD?: React.ReactNode; mira?: number; salta?: number }> = (p) => (
  <Persona {...p} seed={33} ropa={MARINO(5)} casco="no" barba="#5a3a1a" pantalon="#2a2a3a" />
);
const Selva: React.FC<{ t: number; y?: number }> = ({ t, y = 760 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    {Array.from({ length: 9 }, (_, k) => {
      const x = 80 + k * 230, h = 380 + (k % 3) * 90, sw = Math.sin(t * 1.4 + k) * 10;
      return (
        <g key={k}>
          <path d={`M ${x} ${y} Q ${x + 30} ${y - h / 2} ${x + 10 + sw} ${y - h}`} stroke="#6a4a26" strokeWidth={26} fill="none" />
          {[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M ${x + 10 + sw} ${y - h} q ${(j - 2) * 90} -60 ${(j - 2) * 170} ${30 + Math.abs(j - 2) * 40}`} stroke="#2f8a4a" strokeWidth={34} fill="none" strokeLinecap="round" />)}
        </g>
      );
    })}
    <rect x={0} y={y} width={1920} height={1080 - y} fill="#3a7a3a" />
  </svg>
);
// fila de 20 muñequitos: los que mueren se apagan
const Veinte: React.FC<{ t: number; t0: number; vivos: number; tMuere: number; y: number; dos?: boolean }> = ({ t, t0, vivos, tMuere, y, dos }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    {Array.from({ length: 20 }, (_, k) => {
      const x = dos ? 960 + ((k % 10) - 4.5) * 172 : 960 + (k - 9.5) * 86, yy = dos ? y + Math.floor(k / 10) * 300 : y, sc = dos ? 1.85 : 1, vive = [1, 3, 6, 8, 11, 14, 16, 18].slice(0, vivos).includes(k);
      const apaga = vive ? 0 : prog(t, tMuere + (k % 7) * 0.08, tMuere + 0.4 + (k % 7) * 0.08);
      const e = ent(t, t0 + k * 0.03);
      return (
        <g key={k} transform={`translate(${x} ${yy + (vive && t > tMuere + 0.6 ? -Math.abs(Math.sin((t + k) * 5)) * 18 : 0)}) scale(${e * sc})`} opacity={1 - apaga * 0.75}>
          <circle cx={0} cy={-120} r={26} fill={apaga > 0.5 ? "#6a6470" : "#f2b48a"} /><circle cx={-9} cy={-124} r={4} fill={C.noche} /><circle cx={9} cy={-124} r={4} fill={C.noche} />{apaga > 0.5 ? <line x1={-10} y1={-106} x2={10} y2={-106} stroke={C.noche} strokeWidth={4} /> : <path d={vive && t > tMuere + 0.6 ? "M -10 -110 Q 0 -100 10 -110" : "M -9 -106 Q 0 -112 9 -106"} stroke={C.noche} strokeWidth={4} fill="none" />}
          <rect x={-26} y={-92} width={52} height={70} rx={14} fill={apaga > 0.5 ? "#4a4450" : vive ? C.lima : "#3d6ea8"} />
          <rect x={-22} y={-24} width={18} height={40} fill="#2a3a5a" /><rect x={4} y={-24} width={18} height={40} fill="#2a3a5a" />
        </g>
      );
    })}
  </svg>
);

export const INS_C: Ins[] = [
  // ── «Men were put in irons, starved, beaten, and kept at sea long after their bodies told them to stop.»
  {
    a: 603.3, b: 609.3,
    fondo: () => <Grad c1="#2a2440" c2="#120e22" />,
    d: (t) => (
      <>
        <Chico x={760} y={1290} h={1100} t={t} expr={t < 605.7 ? "triste" : "miedo"} bD={20} bI={20} cD={70} cI={70} inclina={t >= 605.7 && t < 606.1 ? -8 : 0} />
        {t >= 604.0 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <g opacity={prog(t, 604.0, 604.2)}><circle cx={700} cy={760} r={34} fill="none" stroke="#8a8a9a" strokeWidth={16} /><circle cx={820} cy={760} r={34} fill="none" stroke="#8a8a9a" strokeWidth={16} />{Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx={734 + k * 18} cy={770 + Math.sin(t * 4 + k) * 4} rx={12} ry={8} fill="none" stroke="#8a8a9a" strokeWidth={8} />)}</g>
          </svg>
        )}
        {t >= 605.7 && <Rot t={t} t0={605.7} t1={606.3} text="WHACK!" x={1040} y={330} size={80} color={C.naranja} tiembla />}
        <Chip t={t} t0={604.0} text="IN IRONS" color="#4a4e58" x={1460} y={300} centro size={66} />
        <Chip t={t} t0={604.8} text="STARVED" color={C.tierra} x={1460} y={420} centro size={66} />
        <Chip t={t} t0={605.7} text="BEATEN" color={C.rojo} x={1460} y={540} centro size={66} />
        <Rot t={t} t0={606.4} text="…AND KEPT AT SEA" x={1350} y={760} size={80} color={C.crema} />
      </>
    ),
  },
  // ── «They ran away… slip off into the jungle and never come back.»
  {
    a: 611.8, b: 619.6, z: 0.03,
    fondo: () => <Grad c1="#8ad0e8" c2="#e8f4d8" />,
    d: (t) => {
      const corre = interpolate(t, [612.0, 619.6], [300, 1500]);
      const entra = prog(t, 617.0, 618.6);
      return (
        <>
          <Selva t={t} />
          <Chico x={corre} y={980} h={700} t={t} expr={entra > 0.5 ? "feliz" : "miedo"} camina={2.4} bD={70} bI={110} cD={40} cI={40} mira={1} />
          {entra > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(0 0 0 ${2000 - entra * 900}px)` }}><svg width={1920} height={1080}>{Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={1100 + k * 160} cy={860 + (k % 2) * 60} rx={170} ry={130} fill={k % 2 ? "#2f8a4a" : "#3aa05a"} />)}</svg></div>}
          {t >= 615.2 && <Svg x={280} y={300} s={ent(t, 615.2)}><circle r={70} fill="#ff9a2a" /><path d="M 0 -70 q 10 -40 40 -40" stroke="#3a6a2a" strokeWidth={10} fill="none" /></Svg>}
          {t >= 615.2 && <Svg x={440} y={300} s={ent(t, 615.5)}><path d="M -40 -70 L 40 -70 L 50 70 L -50 70 Z" fill="#8ad0ff" stroke={C.noche} strokeWidth={6} /></Svg>}
          <Rot t={t} t0={612.0} text="THEY RAN AWAY" x={1100} y={170} size={120} color={C.crema} />
          <Chip t={t} t0={618.4} text="…AND NEVER CAME BACK" color={C.violeta} x={1100} y={320} centro size={58} />
        </>
      );
    },
  },
  // ── «Desertion was so common that captains often had to hire whole new crews halfway through the voyage»
  {
    a: 619.7, b: 626.7,
    fondo: (t) => <Rayos2 t={t} c1="#3d6e8a" c2="#2f5a74" cy={700} />,
    d: (t) => (
      <>
        {Array.from({ length: 5 }, (_, k) => {
          const tk = 622.5 + k * 0.3, nuevo = t > tk;
          const x = 520 + k * 260;
          return nuevo
            ? <Persona key={k} x={x} y={1200} h={620} t={t} seed={200 + k * 7} ropa={MARINO(k + 3)} casco={k % 2 ? "paja" : "no"} pantalon="#5a4a3a" expr="feliz" salta={tk} />
            : <Marino key={k} i={k} x={x - interpolate(t, [621.0, 622.4], [0, 1400 - k * 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1200} h={620} t={t} expr="feliz" camina={t > 621 ? 2.4 : 0} flip />;
        })}
        <Pollard x={260} y={1290} h={1000} t={t} expr={t < 622.5 ? "enojado" : "neutro"} bD={t < 622.5 ? 140 : 90} cD={t < 622.5 ? 150 : 10} />
        <Rot t={t} t0={619.9} text="DESERTION" x={1100} y={150} size={140} color={C.rojo} />
        <Chip t={t} t0={620.6} text="SO COMMON" color={C.noche} x={1100} y={300} centro size={56} />
        <Sello t={t} t0={622.5} text="NEW CREW · HALFWAY" x={1150} y={420} size={70} rot={-5} />
      </>
    ),
  },
  // ── «In 1842, a young sailor… ran off his whaling ship in the Marquesas Islands and hid… among people who were rumored to be cannibals»
  {
    a: 627.1, b: 637.1, z: 0.03,
    fondo: () => <Grad c1="#ffb88a" c2="#ffe8c8" />,
    d: (t) => {
      const x = interpolate(t, [630.8, 634.0], [300, 1150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const escondido = t > 634.0;
      return (
        <>
          <Selva t={t} y={820} />
          <Melville x={x} y={1240} h={escondido ? 880 : 940} t={t} expr={t > 636.4 ? "miedo" : escondido ? "neutro" : "feliz"} camina={t >= 630.8 && t < 634 ? 2.6 : 0} mira={t > 636.4 ? -1 : 1} bD={escondido ? 150 : 80} cD={escondido ? 30 : 50} />
          {escondido && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx={980 + k * 110} cy={1000 + (k % 2) * 30} rx={140} ry={110} fill={k % 2 ? "#2f8a4a" : "#3aa05a"} />)}</svg>}
          {t >= 635.8 && [[300, 820], [520, 880], [1600, 840]].map(([ex, ey], k) => <svg key={k} style={{ position: "absolute", left: ex, top: ey, overflow: "visible" }} width={1} height={1}><g transform={`scale(${ent(t, 635.8 + k * 0.2)})`}><ellipse cx={0} cy={0} rx={150} ry={100} fill="#246a38" /><circle cx={-30} cy={0} r={16} fill="#fff" /><circle cx={30} cy={0} r={16} fill="#fff" /><circle cx={-26 + Math.sin(t * 2) * 6} cy={2} r={8} fill={C.noche} /><circle cx={34 + Math.sin(t * 2) * 6} cy={2} r={8} fill={C.noche} /></g></svg>)}
          <Rot t={t} t0={627.3} text="1842" x={420} y={180} size={150} color={C.crema} />
          <Chip t={t} t0={629.0} text="A YOUNG SAILOR" color={C.violeta} x={420} y={310} centro size={54} />
          <Chip t={t} t0={632.6} text="MARQUESAS ISLANDS" color={C.teal} tinta={C.noche} x={1350} y={170} centro size={58} />
          <Rot t={t} t0={636.3} text="CANNIBALS?" x={1350} y={330} size={110} color={C.rojo} tiembla />
        </>
      );
    },
  },
  // ── «He later wrote a book about it, and then another book about a whale. His name was Herman Melville.»
  {
    a: 637.2, b: 643.1,
    fondo: (t) => <Rayos2 t={t} c1="#5b2bb5" c2="#4a22a0" cx={1300} />,
    d: (t) => {
      const libro = (t0: number, tit: string, col: string, x: number) => (
        <Vuela t={t} t0={t0} t1={t0 + 0.6} x0={700} y0={640} x1={x} y1={430} arco={260} giro={360} s={1.4}>
          <g><rect x={-110} y={-150} width={220} height={300} rx={12} fill={col} stroke={C.noche} strokeWidth={8} /><rect x={-110} y={-150} width={26} height={300} fill="rgba(0,0,0,.25)" /><text y={0} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={tit.length > 6 ? 38 : 48} fill="#fff">{tit}</text></g>
        </Vuela>
      );
      return (
        <>
          <Melville x={520} y={1300} h={1050} t={t} expr="feliz" bD={95 + Math.sin(t * 14) * 10} cD={70} manoD={<path d="M 0 0 L 40 -140" stroke="#f4f0e8" strokeWidth={10} strokeLinecap="round" />} mira={0.6} />
          <div style={{ position: "absolute", left: 300, top: 860, width: 700, height: 60, background: "#7a4a26", borderTop: "10px solid #9a6a3a" }} />
          {libro(637.8, "TYPEE", "#c9773a", 1180)}
          {libro(639.5, "MOBY-DICK", "#1d3a6a", 1560)}
          <Rot t={t} t0={641.6} text="HERMAN MELVILLE" x={1230} y={820} size={92} color={C.oro} />
        </>
      );
    },
  },
  // ── «Melville visited Nantucket and saw the man who had lived through it… to the islanders, this man was nobody. To him… the most impressive man he had ever met.»
  {
    a: 643.2, b: 654.2,
    fondo: () => <Grad c1="#cfd8e8" c2="#9aa8c0" />,
    d: (t) => (
      <>
        <CasaNan x={300} y={820} s={1.1} />
        <CasaNan x={1660} y={820} s={1.1} tono="#b0a090" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#8a8070" }} />
        <Melville x={interpolate(t, [643.3, 645.6], [-200, 520], { extrapolateRight: "clamp" })} y={1200} h={820} t={t} expr={t > 651.4 ? "sorpresa" : "feliz"} camina={t < 645.6 ? 2.2 : 0} bD={t > 651.4 ? 100 : 20} cD={t > 651.4 ? 10 : 20} mira={1} />
        <Pollard x={1180} y={1200} h={820} t={t} viejo expr={t < 650.6 ? "triste" : "neutro"} flip mira={-1} />
        {t >= 649.2 && [1500, 1640, 1780].map((x, k) => <Persona key={k} x={x} y={1200} h={560} t={t} seed={300 + k} ropa={CUAQUERO} casco="cuaquero" pantalon="#3a3a3a" expr="neutro" flip={t < 650.4} camina={t > 650.4 ? 2 : 0} />)}
        <Chip t={t} t0={645.4} text="NANTUCKET" color={C.violeta} x={960} y={130} centro size={60} />
        <Chip t={t} t0={646.7} text="THE MAN WHO LIVED THROUGH IT" color={C.noche} x={1180} y={230} centro size={46} />
        <Sello t={t} t0={650.6} text="ISLANDERS: NOBODY" x={1560} y={340} size={62} rot={6} />
        <Rot t={t} t0={652.4} text="MOST IMPRESSIVE" x={560} y={330} size={80} color={C.oro} />
      </>
    ),
  },
  // ── «August 1819. The whale ship Essex leaves Nantucket with 21 men. Pollard 28, Chase 23, some of the crew are teenagers.»
  {
    a: 662.8, b: 676.2,
    fondo: (t) => <Rayos2 t={t} c1="#2d5a8a" c2="#244a74" />,
    d: (t) => (
      <>
        {t < 668.3 && <Ballenero x={960} y={760} t={t} escala={0.55} nombre="ESSEX" />}
        <Rot t={t} t0={662.9} t1={668.0} text="AUGUST 1819" x={960} y={170} size={130} color={C.crema} />
        {t < 668.3 && <Marino i={2} x={1660} y={1290} h={860} t={t} expr="feliz" mira={-1} bD={140} cD={30} salta={665.0} />}
        {t < 668.3 && <Monto t={t} ks={[[667.2, 0], [667.5, 21]]} x={960} y={960} size={110} pre="" suf=" MEN" color={C.oro} />}
        {t >= 668.3 && (
          <>
            <Pollard x={420} y={1290} h={920} t={t} expr={t < 671.6 ? "orgullo" : "neutro"} habla={t < 671.6} salta={668.4} bD={t < 671.6 ? 100 + Math.sin(t * 4) * 25 : 40} cD={t < 671.6 ? 10 : 20} bI={60} cI={110} />
            <Persona x={960} y={1290} h={900} t={t} seed={44} ropa={MARINO(2)} casco="no" barba="#7a5a2a" pantalon="#2a3a5a" expr="neutro" salta={671.8} opacity={t > 671.6 ? 1 : 0} />
            {t >= 674.8 && [1380, 1600].map((x, k) => <Persona key={k} x={x} y={1290} h={640} t={t} seed={70 + k} ropa={MARINO(k + 1)} casco={k ? "gorro" : "no"} pantalon="#3a3a4a" expr="sorpresa" salta={674.9 + k * 0.15} />)}
            <Chip t={t} t0={668.6} text="CAPT. GEORGE POLLARD" color={C.noche} x={560} y={140} centro size={52} />
            <Monto t={t} ks={[[670.2, 28]]} x={560} y={270} size={110} pre="" color={C.oro} suf=" YRS" />
            <Chip t={t} t0={672.0} text="1ST MATE OWEN CHASE" color={C.noche} x={1400} y={140} centro size={52} />
            <Monto t={t} ks={[[673.4, 23]]} x={1400} y={270} size={110} pre="" color={C.oro} suf=" YRS" />
            <Chip t={t} t0={675.2} text="TEENAGERS" color={C.rojo} x={1490} y={420} centro size={60} />
          </>
        )}
      </>
    ),
  },
  // ── «15 months later, on November the 20th, 1820, the middle of the Pacific, more than 3,000 kilometers from the nearest coast»
  {
    a: 676.3, b: 684.7,
    fondo: (t) => <Mar t={t} y={430} cielo={["#7fc8f0", "#d8f0ff"]} />,
    d: (t) => {
      const lejos = prog(t, 680.0, 683.0);
      return (
        <>
          <Persona x={300} y={1290} h={900} t={t} seed={44} ropa={MARINO(2)} casco="no" barba="#7a5a2a" pantalon="#2a3a5a" expr={t < 680 ? "triste" : "miedo"} bD={t > 680 ? 150 : 30} cD={t > 680 ? 150 : 20} mira={1} />
          {t < 680.0 && (
            <div style={{ position: "absolute", left: 1060, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 676.4)})`, width: 640, height: 560, background: "#fff", border: `12px solid ${C.noche}`, borderRadius: 30, fontFamily, fontWeight: 700, textAlign: "center", color: C.noche }}>
              <div style={{ background: C.rojo, color: "#fff", fontSize: 70, padding: 16 }}>{t < 678.0 ? "AUG 1819" : "NOV 1820"}</div>
              <div style={{ fontSize: 230, lineHeight: "300px" }}>{t < 677.8 ? Math.min(15, Math.floor((t - 676.4) * 11)) : 20}</div>
              <div style={{ fontSize: 50 }}>{t < 677.8 ? "MONTHS" : "NOVEMBER"}</div>
            </div>
          )}
          {/* vuelta 7 OJO: cada mes que pasa se arranca una hoja del calendario y sale volando */}
          {t >= 676.5 && t < 678.4 && [0, 1, 2].map((k) => {
            const u = ((t - 676.5) * 4 + k / 3) % 1;
            return <div key={k} style={{ position: "absolute", left: 1500 + u * 380, top: 560 - u * 140 + u * u * 520, width: 220, height: 150, marginLeft: -110, background: "#fff", border: `8px solid ${C.noche}`, borderRadius: 14, transform: `rotate(${u * 540}deg)`, opacity: 1 - u }} />;
          })}
          {t >= 680.0 && (
            <>
              <Ballenero x={interpolate(lejos, [0, 1], [960, 1500])} y={520} t={t} escala={0.4 - lejos * 0.25} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={1500} y1={900} x2={1500 - 1300 * lejos} y2={900} stroke={C.oro} strokeWidth={12} />{lejos > 0.03 && <line x1={1500} y1={870} x2={1500} y2={930} stroke={C.oro} strokeWidth={12} />}</svg>
              <Monto t={t} ks={[[681.9, 0], [682.6, 3000]]} x={850} y={800} size={110} pre="" suf=" KM" color={C.crema} />
              <Chip t={t} t0={680.6} text="MIDDLE OF THE PACIFIC" color={C.violeta} x={960} y={150} centro size={62} />
              <Chip t={t} t0={683.6} text="TO THE NEAREST COAST" color={C.noche} x={850} y={960} centro size={48} />
            </>
          )}
        </>
      );
    },
  },
  // ── «Chase sees… a huge sperm whale, 26 meters, lying still in the water, looking at the ship»
  {
    a: 684.8, b: 695.5,
    fondo: (t) => <Mar t={t} y={480} cielo={["#c8d0d8", "#eef2f4"]} mar={["#3a6a8a", "#1a3a5a"]} />,
    d: (t) => (
      <>
        <Cachalote x={1300} y={620} t={t} s={1.15} nada={0} />
        {t >= 694.4 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={1580} cy={590} r={60 * ent(t, 694.5)} fill="none" stroke={C.rojo} strokeWidth={10} /></svg>}
        <Persona x={360} y={1290} h={1050} t={t} seed={44} ropa={MARINO(2)} casco="no" barba="#7a5a2a" pantalon="#2a3a5a" expr={t < 687.7 ? "neutro" : "sorpresa"} mira={1} bD={t > 687.7 ? 100 : 20} cD={t > 687.7 ? 10 : 20} />
        <Chip t={t} t0={685.4} text="OWEN CHASE" color={C.noche} x={360} y={160} centro size={52} />
        <Chip t={t} t0={686.6} text="NEVER SEEN BEFORE" color={C.violeta} x={1300} y={160} centro size={54} />
        <Monto t={t} ks={[[691.1, 0], [691.6, 26]]} x={1300} y={300} size={130} pre="" suf=" M?!" color={C.oro} />
        <Chip t={t} t0={692.9} text="LYING STILL…" color={C.teal} tinta={C.noche} x={1300} y={900} centro size={56} />
        <Rot t={t} t0={694.6} text="LOOKING AT THE SHIP" x={1150} y={1000} size={70} color={C.crema} />
      </>
    ),
  },
  // ── «it starts swimming, straight at the Essex, faster and faster, and it rams the ship head first»
  {
    a: 695.6, b: 702.5, z: 0.02,
    fondo: (t) => <Mar t={t * 3} y={420} cielo={["#a8b0b8", "#dce2e8"]} mar={["#3a6a8a", "#1a3a5a"]} />,
    d: (t) => {
      // vuelta 6 OJO: la ballena venía vertical y quieta; ahora carga DE COSTADO desde la derecha, acelera con estela,
      // golpe con flash blanco, la proa se astilla y la cámara tiembla y se acerca
      const v = interpolate(t, [696.2, 700.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const golpe = t >= 700.7;
      const wx = 2600 - (2600 - 1660) * (0.45 * v + 0.55 * v * v); // entra ya en cuadro y acelera
      const sac = golpe && t < 702.0 ? Math.sin(t * 70) * 26 * (702.0 - t) : 0;
      const zoom = 1 + 0.18 * v * v + (golpe ? 0.06 : 0);
      const flash = golpe ? Math.max(0, 1 - (t - 700.7) / 0.1) * 0.85 : 0; // ≤3 cuadros
      return (
        <>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${sac}px, ${sac * 0.6}px) scale(${zoom})`, transformOrigin: "1250px 600px" }}>
            <Ballenero x={760} y={560} t={t} escala={0.55} nombre="ESSEX" roto={golpe ? 0.12 * Math.min(1, (t - 700.7) / 0.4) : 0} />
            {/* estela de espuma detrás de la ballena (crece con la velocidad) */}
            {Array.from({ length: 14 }, (_, k) => {
              const ex = wx + 420 + k * (60 + 120 * v);
              return <div key={k} style={{ position: "absolute", left: ex, top: 600 - 10 + Math.sin(t * 8 + k) * 6, width: 90 + v * 70, height: 34 - k * 1.6, marginLeft: -45, borderRadius: "50%", background: "rgba(240,250,255,.8)", opacity: Math.max(0, 0.9 - k * 0.06) }} />;
            })}
            {!golpe && <Cachalote x={wx} y={600} t={t} s={0.85} flip nada={1 + v} enojo />}
            {golpe && <Cachalote x={1660 + Math.sin(Math.min(1, (t - 700.7) / 0.6) * Math.PI) * 70} y={600} t={t} s={0.85} flip nada={0.5} enojo />}
            {/* líneas de velocidad */}
            {v > 0.3 && !golpe && Array.from({ length: 8 }, (_, k) => <div key={`l${k}`} style={{ position: "absolute", left: wx + 300 + ((k * 137 + t * 900) % 500), top: 470 + k * 34, width: 160 + v * 200, height: 6, borderRadius: 3, background: "rgba(255,255,255,.75)" }} />)}
            {golpe && <Splash x={1240} y={590} t={t} t0={700.7} s={3.2} />}
            {/* astillas de la proa */}
            {golpe && Array.from({ length: 16 }, (_, k) => {
              const u = Math.min(1, (t - 700.7) / 1.2), ang = -Math.PI * (0.15 + 0.7 * ((k * 7) % 16) / 16);
              const vv = 500 + (k % 4) * 160;
              return <div key={`a${k}`} style={{ position: "absolute", left: 1240 + Math.cos(ang) * vv * u, top: 560 + Math.sin(ang) * vv * u + 900 * u * u, width: 46 - (k % 3) * 10, height: 12, background: k % 2 ? "#7a4a26" : "#9a6a3a", border: "3px solid #2a1810", transform: `rotate(${k * 47 + u * 720}deg)`, opacity: 1 - u * 0.6 }} />;
            })}
          </div>
          {!golpe && <Chip t={t} t0={697.5} text="STRAIGHT AT THE ESSEX" color={C.rojo} x={960} y={130} centro size={60} />}
          {!golpe && <Chip t={t} t0={699.0} text="FASTER… AND FASTER" color={C.noche} x={960} y={230} centro size={56} />}
          <Rot t={t} t0={700.7} text="RAM!" x={960} y={200} size={200} color={C.oro} tiembla />
          {flash > 0 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />}
        </>
      );
    },
  },
  // ── «The Essex shudders. Men fall down.»
  {
    a: 702.6, b: 705.2,
    fondo: () => <Grad c1="#9aa8b8" c2="#5a6a7a" />,
    d: (t) => {
      const esc = Math.sin((t - 702.6) * 9) * 8 * Math.max(0, 1 - (t - 702.6) / 2.6);
      return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${esc}deg)`, transformOrigin: "50% 80%" }}>
          <div style={{ position: "absolute", left: -200, right: -200, top: 860, bottom: -200, background: "repeating-linear-gradient(90deg,#9a6a3a 0 160px,#7a4a26 160px 168px)" }} />
          {[0, 1, 2, 3].map((k) => {
            const cae = prog(t, 703.9 + k * 0.12, 704.4 + k * 0.12);
            return <Marino key={k} i={k} x={360 + k * 400} y={880 + cae * 60} h={640} t={t} expr="miedo" bD={150} bI={140} cD={20} cI={20} inclina={cae * (k % 2 ? 70 : -70)} />;
          })}
          <Rot t={t} t0={702.8} text="THE ESSEX SHUDDERS" x={960} y={170} size={100} color={C.crema} tiembla />
        </div>
      );
    },
  },
  // ── «turns around and comes back… hits the ship a second time, head first, right in the bow. The Essex begins to sink. On purpose.»
  {
    a: 707.9, b: 718.7,
    fondo: (t) => <Mar t={t} y={560} cielo={["#8a9aaa", "#cfd8e0"]} />,
    d: (t) => {
      const wx = interpolate(t, [708.0, 709.8, 710.0], [-500, 300, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const hunde = prog(t, 713.7, 717.5);
      return (
        <>
          <Ballenero x={1150} y={600} t={t} escala={0.6} nombre="ESSEX" roto={t > 710.0 ? 0.15 + hunde * 0.6 : 0} />
          <Cachalote x={wx} y={660} t={t} s={0.8} nada={1} enojo />
          <Persona x={1760} y={1300} h={1000} t={t} seed={44} ropa={MARINO(2)} casco="no" barba="#7a5a2a" pantalon="#2a3a5a" flip mira={-1} expr={t < 709.8 ? "sorpresa" : "miedo"} salta={710.05} bD={t > 709.8 ? 162 : 100} cD={t > 709.8 ? 12 : 10} bI={t > 709.8 ? 162 : 20} cI={t > 709.8 ? 12 : 20} inclina={t > 713.7 ? Math.sin(t * 3) * 6 : 0} />
          {t >= 710.0 && <Splash x={640} y={600} t={t} t0={710.0} s={2.6} />}
          <Chip t={t} t0={708.0} t1={711.4} text="IT COMES BACK" color={C.violeta} x={960} y={150} centro size={60} />
          <Rot t={t} t0={710.7} t1={713.5} text="2ND HIT · THE BOW" x={960} y={170} size={100} color={C.oro} tiembla />
          <Rot t={t} t0={714.1} t1={715.3} text="SINKING" x={960} y={170} size={120} color={C.crema} />
          <Chip t={t} t0={715.5} text="A WHALE ATTACKED A WHALING SHIP" color={C.noche} x={960} y={200} centro size={50} />
          <Sello t={t} t0={717.8} text="ON PURPOSE" x={960} y={370} size={100} rot={-6} />
        </>
      );
    },
  },
  // ── «Twenty men… three small whale boats… hardtack, some water, and a few turtles»
  {
    a: 718.8, b: 728.2,
    fondo: (t) => <Mar t={t} y={420} cielo={["#a8c0d8", "#e0ecf4"]} mar={["#2a6a9a", "#0e2a48"]} />,
    d: (t) => (
      <>
        <Pollard x={260} y={1320} h={1000} t={t} expr={t < 722.5 ? "triste" : "neutro"} habla={t > 724 && t < 727} bD={t > 724.2 ? 110 + Math.sin(t * 3) * 20 : 30} cD={t > 724.2 ? 20 : 30} bI={30} cI={30} />
        {[0, 1, 2].map((k) => <Bote key={k} x={780 + k * 470} y={640 + (k % 2) * 40} t={t} s={0.72} rema={0.3} gente={<>{[-150, -80, -10, 60, 130].map((ox, j) => <circle key={j} cx={ox} cy={-70} r={22} fill={["#f2b48a", "#c98b62", "#8d5a3b"][(j + k) % 3]} />)}</>} />)}
        <Monto t={t} ks={[[718.9, 0], [719.4, 20]]} x={1160} y={170} size={130} pre="" suf=" MEN" color={C.crema} />
        <Chip t={t} t0={720.3} text="3 SMALL BOATS" color={C.violeta} x={1160} y={300} centro size={56} />
        <Chip t={t} t0={722.5} text="LARGEST OCEAN ON EARTH" color={C.noche} x={1160} y={400} centro size={50} />
        <Galleta x={800} y={850} s={1.1 * ent(t, 724.3)} rot={8} />
        {t >= 725.3 && <Svg x={1160} y={850} s={1.2 * ent(t, 725.3)}><Barril0 /></Svg>}
        {t >= 726.3 && [0, 1].map((k) => <Svg key={k} x={1480 + k * 170} y={860} s={ent(t, 726.4 + k * 0.15)}><ellipse rx={70} ry={46} fill="#5a7a3a" stroke="#2a3a1a" strokeWidth={6} /><path d="M -50 -10 L 50 -10 M -30 -36 L -30 36 M 30 -36 L 30 36" stroke="#2a3a1a" strokeWidth={5} /><circle cx={84} cy={-6} r={20} fill="#7a9a5a" /></Svg>)}
        <Chip t={t} t0={724.3} text="HARDTACK" color={C.tierra} x={800} y={960} centro size={44} />
        <Chip t={t} t0={725.4} text="WATER" color={C.teal} tinta={C.noche} x={1160} y={960} centro size={44} />
        <Chip t={t} t0={726.4} text="TURTLES" color="#4a6a2a" x={1560} y={960} centro size={44} />
      </>
    ),
  },
  // ── el mapa: Marquesas a 2.000 km (¿caníbales?) → eligen ir al sur y al este, 4.000+ km en botes abiertos
  {
    a: 728.3, b: 749.2, z: 0.03,
    fondo: () => <Grad c1="#2a7fb8" c2="#174d80" />,
    d: (t) => {
      const ruta = prog(t, 738.8, 745.8);
      const p = (u: number) => { const x0 = 760, y0 = 380; if (u < 0.45) { const k = u / 0.45; return [x0 + 40 * k, y0 + 420 * k]; } const k = (u - 0.45) / 0.55; return [800 + 820 * k, 800 - 140 * k]; };
      const [bx, by] = p(ruta);
      const dias = Math.round(interpolate(t, [738.8, 748.5], [1, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {Array.from({ length: 12 }, (_, k) => <line key={k} x1={0} y1={90 * k} x2={1920} y2={90 * k} stroke="rgba(255,255,255,.07)" strokeWidth={2} />)}
            <path d="M 1700 0 L 1920 0 L 1920 1080 L 1760 1080 Q 1680 820 1740 640 Q 1640 420 1700 0 Z" fill="#c9a06a" stroke="#7a5a2a" strokeWidth={8} />
            <text x={1800} y={540} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#5a3418" transform="rotate(-90 1800 540)">SOUTH AMERICA</text>
            {t >= 729.8 && <g opacity={prog(t, 729.8, 730.2)}><circle cx={240} cy={300} r={26} fill="#3aa05a" stroke="#fff" strokeWidth={6} /><circle cx={280} cy={330} r={16} fill="#3aa05a" /><line x1={760} y1={380} x2={760 - 520 * prog(t, 730.8, 731.6)} y2={380 - 80 * prog(t, 730.8, 731.6)} stroke="#fff" strokeWidth={8} strokeDasharray="20 16" /></g>}
            <path d="M 760 380 L 800 800 L 1620 660" stroke={C.oro} strokeWidth={12} fill="none" strokeDasharray={1260} strokeDashoffset={1260 * (1 - ruta)} strokeLinecap="round" />
            <g transform={`translate(760 380) scale(${ent(t, 728.4)})`}><path d="M -26 -26 L 26 26 M 26 -26 L -26 26" stroke={C.rojo} strokeWidth={12} strokeLinecap="round" /></g>
          </svg>
          {t >= 738.8 && <Bote x={bx} y={by} t={t} s={0.22} rema={1} gente={<>{[-150, -80, -10, 60, 130].map((ox, j) => <circle key={j} cx={ox} cy={-70} r={22} fill="#f2b48a" />)}</>} />}
          <Chip t={t} t0={728.4} text="ESSEX SANK HERE" color={C.rojo} x={760} y={300} centro size={40} />
          <Chip t={t} t0={729.9} text="MARQUESAS" color="#2f8a4a" x={260} y={210} centro size={46} />
          <Chip t={t} t0={731.0} text="2,000 KM" color={C.noche} x={500} y={440} centro size={46} />
          {t >= 733.6 && t < 738.6 && <Svg x={260} y={520} s={0.9 * ent(t, 733.7)}><circle r={110} fill="#fff" stroke={C.noche} strokeWidth={10} /><Icono k={7} /></Svg>}
          <Chip t={t} t0={735.6} t1={738.6} text="'THEY EAT VISITORS'" color={C.rojo} x={260} y={680} centro size={44} />
          <Chip t={t} t0={737.9} text="THE OTHER WAY →" color={C.oro} tinta={C.noche} x={1250} y={200} centro size={58} />
          <Pollard x={1480} y={1290} h={820} t={t} expr={t > 747 ? "triste" : "enojado"} flip bD={100} cD={10} />
          <Monto t={t} ks={[[744.0, 0], [744.6, 4000]]} x={1000} y={960} size={90} pre="" suf="+ KM" color={C.crema} />
          {t >= 738.8 && <div style={{ position: "absolute", left: 150, top: 850, fontFamily, fontWeight: 700, fontSize: 70, color: C.crema, WebkitTextStroke: `6px ${C.noche}`, paintOrder: "stroke fill" }}>DAY {dias}</div>}
          <Rot t={t} t0={747.1} text="THE WHOLE TRAGEDY" x={960} y={160} size={110} color={C.rojo} />
        </>
      );
    },
  },
  // ── «They found a tiny island, stayed a week, and ate everything on it. Three men chose to stay behind.»
  {
    a: 749.3, b: 756.6,
    fondo: (t) => <Mar t={t} y={700} cielo={["#ffd08a", "#fff0d0"]} />,
    d: (t) => (
      <>
        <Isla x={960} y={760} t={t} s={1.2} seed={4} />
        {[0, 1, 2, 3, 4].map((k) => <Marino key={k} i={k} x={560 + k * 200} y={900} h={420} t={t} expr={t > 752 ? "feliz" : "triste"} bD={110 + Math.sin(t * 9 + k) * 30} cD={130} />)}
        {t >= 751.7 && t < 753 && Array.from({ length: 6 }, (_, k) => <Vuela key={k} t={t} t0={751.8 + k * 0.1} t1={752.4 + k * 0.1} x0={700 + k * 110} y0={420} x1={600 + k * 160} y1={760} arco={60} giro={200}><circle r={22} fill="#7a4a1a" /></Vuela>)}
        <Chip t={t} t0={749.6} text="A TINY ISLAND" color="#2f8a4a" x={960} y={160} centro size={60} />
        <Rot t={t} t0={751.9} t1={753.1} text="ATE EVERYTHING" x={960} y={300} size={100} color={C.crema} />
        <Sello t={t} t0={753.3} text="3 STAY BEHIND" x={960} y={300} size={80} rot={-4} />
        <Chip t={t} t0={755.3} text="THE REST → BACK TO SEA" color={C.noche} x={960} y={1010} centro size={50} />
      </>
    ),
  },
  // ── «Then the food ran out. Then the water. Then the men began to die… buried at sea… then they stopped burying them»
  {
    a: 756.7, b: 766.1,
    fondo: () => <Grad c1="#5a5070" c2="#2a2240" />,
    d: (t) => {
      const comida = 1 - prog(t, 756.8, 758.3), agua = 1 - prog(t, 758.1, 759.6);
      return (
        <>
          {[["FOOD", comida, C.tierra, 230], ["WATER", agua, C.teal, 380]].map(([n, v, col, y]) => (
            <div key={n as string} style={{ position: "absolute", left: 260, top: y as number, width: 1400, height: 90, background: "rgba(0,0,0,.35)", borderRadius: 45, border: "6px solid #fff" }}>
              <div style={{ width: `${(v as number) * 100}%`, height: "100%", background: (v as number) < 0.25 ? C.rojo : col as string, borderRadius: 45 }} />{(v as number) < 0.02 && <div style={{ position: "absolute", right: 40, top: 6, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", background: C.rojo, padding: "0 22px", borderRadius: 30, border: `5px solid ${C.noche}`, transform: `scale(${Math.floor(t * 3) % 2 ? 1.08 : 1})` }}>EMPTY</div>}
              <div style={{ position: "absolute", left: 30, top: 6, fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", WebkitTextStroke: `5px ${C.noche}`, paintOrder: "stroke fill" }}>{n as string}</div>
            </div>
          ))}
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const muere = t > 759.6 + k * 0.5 && k % 2 === 1;
            return <Marino key={k} i={k} x={360 + k * 240} y={1200} h={560} t={t} expr={muere ? "dormido" : "triste"} inclina={muere ? 80 * prog(t, 759.6 + k * 0.5, 760.2 + k * 0.5) : 0} opacity={muere ? 1 - 0.5 * prog(t, 760.4, 761) : 1} />;
          })}
          <Chip t={t} t0={761.2} t1={764.0} text="BURIED AT SEA" color={C.violeta} x={960} y={110} centro size={58} />
          <Rot t={t} t0={764.3} text="THEN THEY STOPPED" x={960} y={120} size={100} color={C.rojo} />
        </>
      );
    },
  },
  // ── «In February, in Captain Pollard's boat, four starving men left and nothing to eat… something sailors had whispered about for centuries»
  {
    a: 766.2, b: 775.3,
    fondo: (t) => <Mar t={t} y={500} cielo={["#3a3050", "#7a6a8a"]} mar={["#1a2a4a", "#0a1428"]} />,
    d: (t) => (
      <>
        <Bote x={960} y={820} t={t} s={2.2} rema={0} gente={<></>} />
        {[0, 1, 2, 3].map((k) => <Persona key={k} x={560 + k * 270} y={900} h={560} t={t} seed={k === 0 ? 11 : 80 + k} ropa={k === 0 ? CAPITAN : MARINO(k)} casco={k === 0 ? "capitan" : "no"} barba={k === 0 ? "#3a2616" : undefined} pantalon="#2a2a3a" expr="triste" inclina={Math.sin(t * 0.9 + k) * 4} />)}
        <Chip t={t} t0={766.3} text="FEBRUARY · POLLARD'S BOAT" color={C.violeta} x={960} y={130} centro size={54} />
        <Monto t={t} ks={[[768.9, 0], [769.2, 4]]} x={960} y={270} size={110} pre="" suf=" LEFT" color={C.crema} />
        <Sello t={t} t0={770.8} text="NOTHING TO EAT" x={960} y={975} size={60} rot={-4} />
        <Rot t={t} t0={773.6} text="whispered for centuries…" x={960} y={1010} size={64} color={C.lila} />
      </>
    ),
  },
  // ── «They drew lots. The short straw would be killed to feed the others. The short straw went to Owen Coffin. He was 18.»
  {
    a: 775.4, b: 782.7,
    fondo: (t) => <Rayos2 t={t} c1="#2a2244" c2="#1e1834" />,
    d: (t) => {
      const foco = prog(t, 780.4, 780.9);
      return (
        <>
          {t < 780.4 && <Pajitas x={960} y={700} s={2.0 * ent(t, 775.4)} saca={prog(t, 777.0, 777.6)} />}
          {t < 780.4 && <Marino i={1} x={260} y={1250} h={760} t={t} expr="miedo" bD={30} cD={60} mira={1} />}
          {t < 780.4 && <Marino i={3} x={1660} y={1250} h={760} t={t} expr={t > 777.6 ? "sorpresa" : "miedo"} flip bD={t > 777.6 ? 140 : 30} cD={t > 777.6 ? 20 : 60} />}
          {t < 780.4 && <Rot t={t} t0={775.4} text="THEY DREW LOTS" x={960} y={170} size={110} color={C.crema} />}
          {t < 780.4 && <Chip t={t} t0={776.8} text="SHORT STRAW = DIES" color={C.rojo} x={960} y={300} centro size={58} />}
          {t >= 780.4 && (
            <>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 960px 560px, rgba(255,240,200,${0.5 * foco}) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.6 * foco}) 60%)` }} />
              <Persona x={960} y={1260} h={960} t={t} seed={90} ropa={MARINO(4)} casco="no" pantalon="#2a3a5a" expr="miedo" bD={20} bI={20} cD={60} cI={60} />
              <Chip t={t} t0={780.8} text="OWEN COFFIN" color={C.noche} x={960} y={150} centro size={70} />
              <Monto t={t} ks={[[782.0, 0], [782.2, 18]]} x={1450} y={460} size={140} pre="" suf=" YRS" color={C.oro} />
            </>
          )}
        </>
      );
    },
  },
  // ── «the captain's own cousin… promised his mother… Pollard offered to take his place. Coffin refused.»
  {
    a: 782.8, b: 790.4,
    fondo: (t) => <Grad c1="#3a3050" c2="#1a1430" />,
    d: (t) => (
      <>
        <Pollard x={500} y={1270} h={950} t={t} expr={t > 787.4 ? "triste" : "neutro"} bD={t > 787.4 ? 120 : 30} cD={t > 787.4 ? 40 : 20} habla={t >= 787.4 && t < 788.6} />
        <Persona x={1420} y={1270} h={900} t={t} seed={90} ropa={MARINO(4)} casco="no" pantalon="#2a3a5a" expr={t > 789.3 ? "enojado" : "miedo"} flip habla={t >= 789.3 && t < 789.8} bD={t > 789.3 ? 90 : 20} cD={t > 789.3 ? 10 : 30} />
        <Chip t={t} t0={783.1} text="THE CAPTAIN'S COUSIN" color={C.violeta} x={960} y={130} centro size={56} />
        {t >= 785.0 && t < 787.3 && <Svg x={960} y={420} s={ent(t, 785.0)}><path d="M 0 60 C -120 -20 -80 -110 0 -60 C 80 -110 120 -20 0 60 Z" fill={C.rojo} stroke={C.noche} strokeWidth={6} /></Svg>}
        <Chip t={t} t0={785.0} t1={787.3} text="PROMISED HIS MOTHER" color={C.rojo} x={960} y={560} centro size={50} />
        <Dice t={t} t0={787.6} text="TAKE ME INSTEAD." x={700} y={400} size={56} cola="izq" />
        <Dice t={t} t0={789.4} text="NO." x={1300} y={520} size={90} cola="der" />
      </>
    ),
  },
  // ── «Another young man, chosen by lot, fired the pistol.» (sin mostrar el disparo: la sombra y el silencio)
  {
    a: 790.5, b: 794.0,
    fondo: () => <Grad c1="#140e22" c2="#06040c" />,
    d: (t) => (
      <>
        <Marino i={2} x={330} y={1290} h={900} t={t} expr="miedo" bD={160} bI={160} cD={10} cI={10} mira={1} />
        <Marino i={4} x={1640} y={1290} h={860} t={t} expr="triste" flip bD={20} cD={40} inclina={-6} />
        <Pistola x={960} y={560} s={2.4 * ent(t, 791.0)} rot={-6} humo={t > 792.55 ? 1 - prog(t, 792.8, 794) * 0.6 : 0} />
        <Chip t={t} t0={790.7} text="CHOSEN BY LOT" color={C.violeta} x={960} y={180} centro size={60} />
        {t >= 792.6 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.5 * prog(t, 792.65, 793.1)})` }} />}
      </>
    ),
  },
  // ── «About 90 days after the sinking, the last two boats were finally picked up… Of the 20 men… eight survived.»
  {
    a: 794.1, b: 803.4,
    fondo: (t) => <Mar t={t} y={600} cielo={["#8ac0e8", "#e0f0ff"]} />,
    d: (t) => (
      <>
        {t < 799.8 && (
          <>
            <Ballenero x={1450} y={640} t={t} escala={0.42} />
            <Marino i={4} x={1760} y={1300} h={860} t={t} expr={t > 797.5 ? "feliz" : "triste"} bD={t > 797.5 ? 150 : 30} cD={t > 797.5 ? 20 : 60} mira={-1} flip salta={797.6} />
            {[0, 1].map((k) => <Bote key={k} x={interpolate(t, [796.2, 799.0], [300, 950], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + k * 260} y={700} t={t} s={0.55} rema={0.6} gente={<>{[-80, 10, 100].map((ox, j) => <circle key={j} cx={ox} cy={-70} r={22} fill="#f2b48a" />)}</>} />)}
            <Monto t={t} ks={[[794.2, 0], [794.8, 90]]} x={500} y={170} size={140} pre="" suf=" DAYS" color={C.crema} />
            <Chip t={t} t0={797.5} text="PICKED UP · SOUTH AMERICA" color={C.violeta} x={1150} y={330} centro size={52} />
          </>
        )}
        {t >= 799.8 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2a2440,#141024)" }} />}
        {t >= 799.8 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((k) => {
          // vuelta 5: la tripulación REAL (no muñequitos), los que mueren caen y se apagan
          const vive = [1, 3, 6, 8, 11, 14, 16, 18].includes(k), ap = vive ? 0 : prog(t, 801.6 + (k % 7) * 0.08, 802.0 + (k % 7) * 0.08);
          return <Marino key={k} i={k % 6} x={960 + ((k % 10) - 4.5) * 178} y={(k < 10 ? 560 : 880) + ap * 40} h={330} t={t} expr={ap > 0.3 ? "dormido" : vive && t > 802.3 ? "triste" : "miedo"} inclina={ap * 70 * (k % 2 ? 1 : -1)} opacity={1 - ap * 0.7} />;
        })}
        {t >= 799.8 && <Monto t={t} t0={799.8} ks={[[799.8, 20], [801.7, 8]]} x={960} y={120} size={110} pre="" suf=" ALIVE" color={C.crema} />}
        <Rot t={t} t0={802.3} text="8 SURVIVED" x={960} y={t > 799.8 ? 1000 : 380} size={120} color={C.lima} />
      </>
    ),
  },
  // ── «So, was signing onto a whaling ship a death trap? Here is the twist. It was not the whale…»
  {
    a: 803.5, b: 812.0,
    fondo: (t) => <Rayos2 t={t} c1="#e8344a" c2="#d22a40" />,
    d: (t) => (
      <>
        <Chico x={420} y={1290} h={1050} t={t} expr={t < 807 ? "triste" : "sorpresa"} bD={t > 807 ? 150 : 40} cD={t > 807 ? 20 : 120} bI={40} cI={120} salta={807.0} />
        {t < 806.9 && <Rot t={t} t0={803.6} text="A DEATH TRAP?" x={1250} y={300} size={130} color={C.crema} />}
        {t >= 806.9 && <Rot t={t} t0={807.0} text="THE TWIST" x={1250} y={170} size={120} color={C.oro} tiembla />}
        {t >= 808.2 && (
          <>
            <Svg x={1250} y={620} s={0.5 * ent(t, 808.2)}><Cachalote x={0} y={0} t={t} s={1} /></Svg>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={950} y1={440} x2={950 + 600 * prog(t, 808.6, 808.9)} y2={440 + 360 * prog(t, 808.6, 808.9)} stroke={C.noche} strokeWidth={26} strokeLinecap="round" /></svg>
            <Chip t={t} t0={808.6} text="IT WAS NOT THE WHALE" color={C.noche} x={1250} y={815} centro size={60} />
            <Chip t={t} t0={809.9} text="ONLY 1 SHIP THAT DAY" color={C.violeta} x={1250} y={935} centro size={58} />
          </>
        )}
      </>
    ),
  },
  // ── «The real trap was the paper you signed on the dock»
  {
    a: 812.1, b: 815.0,
    fondo: (t) => <Rayos2 t={t} c1="#f7c548" c2="#ecb83a" />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 1200, top: 610, width: 620, height: 780, transform: `translate(-50%,-50%) rotate(${-4 + (1 - ent(t, 812.3)) * 40}deg) scale(${0.82 * ent(t, 812.3)})`, background: "#f6ecd2", border: "10px solid #5a3418", padding: 40, fontFamily, fontWeight: 700, color: "#2a1530" }}>
          <div style={{ fontSize: 50, textAlign: "center" }}>SHIPPING PAPER</div>
          {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ height: 14, background: "#cbb68e", margin: "26px 0", width: `${92 - (k % 3) * 14}%` }} />)}
          <div style={{ fontSize: 40 }}>LAY: 1/175</div>
          <div style={{ fontSize: 190, color: C.rojo, textAlign: "center", lineHeight: "170px", transform: `scale(${ent(t, 813.8)})` }}>X</div>
        </div>
        <Chico x={480} y={1290} h={900} t={t} expr="miedo" bD={100} cD={20} mira={1} />
        <Rot t={t} t0={812.4} text="THE REAL TRAP" x={1200} y={110} size={90} color={C.noche} />
      </>
    ),
  },
  // ── «the Essex survivors, most of them went back to sea. They had to. They still had to eat. Owen Chase became a captain»
  {
    a: 815.1, b: 822.7,
    fondo: (t) => <Mar t={t} y={820} cielo={["#ffc89a", "#ffe8d0"]} />,
    d: (t) => (
      <>
        <Ballenero x={1450} y={830} t={t} escala={0.5} />
        <div style={{ position: "absolute", left: -40, top: 820, width: 1000, height: 300, background: "#7a4a26", borderTop: "14px solid #9a6a3a" }} />
        {[0, 1, 2].map((k) => <Marino key={k} i={k + 1} x={interpolate(t, [816.8, 820.5], [100 + k * 180, 700 + k * 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1000} h={560} t={t} expr="triste" camina={t >= 816.8 && t < 820.5 ? 2 : 0} />)}
        {t >= 821.4 && <Persona x={960} y={1290} h={980} t={t} seed={44} ropa={CAPITAN} casco="capitan" barba="#7a5a2a" pantalon="#141a30" expr="orgullo" salta={821.5} bD={40} />}
        <Chip t={t} t0={816.8} t1={821.3} text="MOST WENT BACK TO SEA" color={C.violeta} x={960} y={140} centro size={58} />
        <Rot t={t} t0={819.4} t1={821.3} text="THEY HAD TO EAT" x={960} y={300} size={100} color={C.crema} />
        <Chip t={t} t0={821.5} text="CHASE → CAPTAIN" color={C.noche} x={960} y={150} centro size={60} />
      </>
    ),
  },
  // ── «George Pollard got a new ship, sailed back to the Pacific, and wrecked it on a reef. Nobody would give him a boat ever again.»
  {
    a: 822.8, b: 831.1,
    fondo: (t) => <Mar t={t} y={560} cielo={["#8ab0d0", "#d0e4f0"]} />,
    d: (t) => {
      const choca = t > 826.5;
      return (
        <>
          <Ballenero x={interpolate(t, [823.5, 826.5], [300, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={620} t={t} escala={0.5} roto={choca ? prog(t, 826.5, 828.5) * 0.7 : 0} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{Array.from({ length: 6 }, (_, k) => <path key={k} d={`M ${1050 + k * 90} 640 l 40 -${60 + (k % 3) * 30} l 40 ${60 + (k % 3) * 30} Z`} fill="#c9a06a" stroke="#7a5a2a" strokeWidth={6} />)}</svg>
          {choca && <Splash x={1100} y={600} t={t} t0={826.5} s={2} />}
          <Pollard x={260} y={1290} h={900} t={t} expr={choca ? "triste" : "orgullo"} bD={choca ? 150 : 40} cD={choca ? 150 : 20} />
          <Chip t={t} t0={823.0} text="POLLARD: A NEW SHIP" color={C.violeta} x={960} y={150} centro size={58} />
          <Rot t={t} t0={826.5} t1={828.6} text="WRECKED ON A REEF" x={960} y={300} size={100} color={C.rojo} tiembla />
          <Sello t={t} t0={828.8} text="NO MORE SHIPS. EVER." x={1150} y={300} size={70} rot={-5} />
        </>
      );
    },
  },
  // ── «night watchman, walking the dark streets of the town that whale oil built… once a year, on November the 20th, he locked himself in his room and did not eat.»
  {
    a: 831.2, b: 843.1, z: 0.03,
    fondo: () => <Grad c1="#0e1430" c2="#1d2450" />,
    d: (t) => (
      <>
        {t < 837.6 && (
          <>
            {[0, 1, 2, 3].map((k) => <CasaNan key={k} x={interpolate(t, [831.2, 837.6], [200 + k * 520, -100 + k * 520])} y={820} s={1} tono="#3a4060" luz rica={k % 2 === 0} />)}
            <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#2a2a3a" }} />
            <Farol x={1500} y={820} t={t} s={1.2} />
            <Pollard x={900} y={1180} h={760} t={t} viejo expr="triste" camina={1.4} bD={80} cD={90} manoD={<g><line x1={0} y1={0} x2={0} y2={40} stroke="#3a2a1a" strokeWidth={6} /><rect x={-24} y={40} width={48} height={60} rx={8} fill="#ffd27a" stroke="#3a2a1a" strokeWidth={6} /></g>} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 940px 820px, rgba(255,210,120,.25), transparent 30%)" }} />
            <Chip t={t} t0={833.5} text="NIGHT WATCHMAN" color={C.violeta} x={960} y={150} centro size={62} />
            <Chip t={t} t0={835.4} text="THE TOWN WHALE OIL BUILT" color={C.noche} x={960} y={250} centro size={48} />
          </>
        )}
        {t >= 837.6 && (
          <>
            <div style={{ position: "absolute", inset: 0, background: "#3a2a2a" }} />
            <div style={{ position: "absolute", left: 1300, top: 220, width: 360, height: 420, background: "#fff", border: `10px solid ${C.noche}`, borderRadius: 20, fontFamily, fontWeight: 700, textAlign: "center", transform: `scale(${ent(t, 837.8)})` }}>
              <div style={{ background: C.rojo, color: "#fff", fontSize: 60, padding: 10 }}>NOV</div><div style={{ fontSize: 220, color: C.noche, lineHeight: "300px" }}>20</div>
            </div>
            <Pollard x={640} y={1260} h={900} t={t} viejo expr="triste" bD={10} cD={20} inclina={6} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={1000} y={900} width={600} height={30} fill="#7a4a26" /><ellipse cx={1300} cy={890} rx={140} ry={26} fill="#f4f0e8" stroke={C.noche} strokeWidth={6} /><circle cx={1270} cy={876} r={20} fill="#c9773a" /><circle cx={1330} cy={880} r={16} fill="#5a8a3a" /></svg>
            <Sello t={t} t0={840.4} text="LOCKED IN" x={1480} y={760} size={60} rot={6} />
            <Chip t={t} t0={842.0} text="DID NOT EAT" color={C.noche} x={1300} y={1010} centro size={52} />
          </>
        )}
      </>
    ),
  },
  // ── «The industry… did not die because of a whale. It died because of a rock.»
  {
    a: 843.2, b: 851.3,
    fondo: (t) => <Rayos2 t={t} c1="#2d1b69" c2="#24155a" />,
    d: (t) => {
      const incl = interpolate(t, [848.6, 849.2, 850.4, 851.0], [0, -6, -6, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 960 520 L 900 960 L 1020 960 Z" fill="#c9a06a" stroke={C.noche} strokeWidth={8} />
            <g transform={`rotate(${incl} 960 520)`}>
              <rect x={460} y={505} width={1000} height={30} rx={10} fill="#c9a06a" stroke={C.noche} strokeWidth={8} />
              <line x1={560} y1={520} x2={560} y2={640} stroke={C.noche} strokeWidth={6} /><line x1={1360} y1={520} x2={1360} y2={640} stroke={C.noche} strokeWidth={6} />
              <path d="M 440 640 L 680 640 L 640 690 L 480 690 Z" fill="#8a8a9a" stroke={C.noche} strokeWidth={6} />
              <path d="M 1240 640 L 1480 640 L 1440 690 L 1280 690 Z" fill="#8a8a9a" stroke={C.noche} strokeWidth={6} />
              {t >= 849.0 && <g transform={`translate(560 560) scale(${0.22 * ent(t, 849.0)})`}><Cachalote x={0} y={0} t={t} s={1} /></g>}
              {t >= 850.5 && <g transform={`translate(1360 600) scale(${ent(t, 850.5)})`}><path d="M -70 40 Q -80 -30 -20 -50 Q 50 -60 70 0 Q 70 40 -70 40 Z" fill="#6a6470" stroke={C.noche} strokeWidth={6} /></g>}
            </g>
          </svg>
          <Chico x={1680} y={1290} h={880} t={t} expr={t > 850.5 ? "sorpresa" : "neutro"} mira={-1} bD={t > 848 ? 150 : 40} cD={t > 848 ? 20 : 110} salta={850.6} />
          <Chip t={t} t0={843.4} text="THE FINAL IRONY" color={C.oro} tinta={C.noche} x={960} y={130} centro size={64} />
          <Chip t={t} t0={848.1} text="NOT A WHALE…" color={C.noche} x={560} y={300} centro size={54} />
          <Rot t={t} t0={850.6} text="A ROCK." x={1360} y={300} size={130} color={C.crema} />
        </>
      );
    },
  },
  // ── «In 1859, in Pennsylvania, a man drilled into the ground and found oil… Kerosene was cheaper, cleaner, and nobody had to row toward it.»
  {
    a: 851.4, b: 861.2,
    fondo: () => <Grad c1="#8ac0e8" c2="#e8f0d0" />,
    d: (t) => {
      const brota = t > 855.5;
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#6a8a3a" }} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 560 820 L 640 300 L 720 820" stroke="#5a3418" strokeWidth={16} fill="none" />
            {[420, 560, 700].map((y) => <line key={y} x1={640 - (820 - y) * 0.15} y1={y} x2={640 + (820 - y) * 0.15} y2={y} stroke="#5a3418" strokeWidth={10} />)}
            <line x1={640} y1={interpolate(Math.sin(t * 8), [-1, 1], [500, 560])} x2={640} y2={820} stroke="#8a8a9a" strokeWidth={14} />
            {brota && Array.from({ length: 12 }, (_, k) => { const u = ((t - 855.5) * 1.4 + k / 12) % 1; return <circle key={k} cx={640 + Math.sin(k * 2.3) * 120 * u} cy={300 - u * 280 + u * u * 300} r={30 - u * 10} fill="#141010" />; })}
          </svg>
          <Persona x={940} y={1200} h={700} t={t} seed={120} ropa={MARINO(5)} casco="paja" pantalon="#3a3a2a" expr={brota ? "sorpresa" : "neutro"} bD={brota ? 160 : 80} bI={brota ? 160 : 40} cD={brota ? 10 : 90} salta={855.6} />
          <Chip t={t} t0={851.5} text="1859 · PENNSYLVANIA" color={C.violeta} x={1420} y={140} centro size={58} />
          <Rot t={t} t0={856.4} text="PETROLEUM" x={1420} y={300} size={110} color="#141010" />
          <Chip t={t} t0={858.1} text="CHEAPER" color={C.lima} tinta={C.noche} x={1420} y={460} centro size={54} />
          <Chip t={t} t0={859.0} text="CLEANER" color={C.teal} tinta={C.noche} x={1420} y={560} centro size={54} />
          <Chip t={t} t0={859.6} text="NOBODY ROWS TOWARD IT" color={C.rojo} x={1420} y={680} centro size={50} />
        </>
      );
    },
  },
  // ── «the great whaling fleets were rotting in their harbors… beaten, not by Moby Dick, but by a hole in the ground»
  {
    a: 861.3, b: 871.8,
    fondo: () => <Grad c1="#8a8a9a" c2="#c8c8d0" />,
    d: (t) => (
      <>
        {t < 868.4 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 720, bottom: 0, background: "#4a5a6a" }} />
            {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "grayscale(.8)" }}><Ballenero x={560 + k * 860} y={760} t={t} escala={0.45} velas={0} roto={0.2 + k * 0.15} /></div>)}
            <Chico x={1640} y={1300} h={900} t={t} expr="triste" bD={20} cD={40} inclina={-4} />
            <Rot t={t} t0={863.8} text="ROTTING IN THE HARBORS" x={960} y={170} size={96} color={C.crema} />
          </>
        )}
        {t >= 868.4 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "#6a8a3a" }} />
            <Svg x={560} y={480} s={0.5 * ent(t, 868.2)}><Cachalote x={0} y={0} t={t} s={1} /></Svg>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <line x1={300} y1={300} x2={300 + 520 * prog(t, 869.4, 869.7)} y2={300 + 360 * prog(t, 869.4, 869.7)} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" />
              <ellipse cx={1400} cy={790} rx={260 * ent(t, 870.6)} ry={60 * ent(t, 870.6)} fill="#141010" />
            </svg>
            <Chip t={t} t0={868.5} text="NOT BY MOBY DICK" color={C.noche} x={560} y={210} centro size={56} />
            <Chico x={1640} y={1300} h={880} t={t} expr={t > 870.6 ? "sorpresa" : "neutro"} mira={-1} bD={t > 870.6 ? 150 : 40} cD={t > 870.6 ? 20 : 100} salta={870.7} />
            <Rot t={t} t0={870.6} text="A HOLE IN THE GROUND" x={1150} y={300} size={80} color={C.crema} />
          </>
        )}
      </>
    ),
  },
  // ── el regreso: «four years older, sunburned, missing a tooth, smelling of smoke, owing the ship nine dollars… who was really doing the hunting»
  {
    a: 871.9, b: 888.8, z: 0.03,
    fondo: () => <Grad c1="#ffb88a" c2="#ffe8c8" />,
    d: (t) => (
      <>
        <CasaNan x={1150} y={520} s={0.9} rica luz />
        <CasaNan x={1500} y={520} s={1} rica />
        <CasaNan x={1820} y={520} s={0.9} rica luz />
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, bottom: 0, background: "#8a7a6a" }} />
        <div style={{ position: "absolute", left: -40, top: 640, width: 900, height: 40, background: "#9a6a3a", border: "6px solid #5a3418", transform: "rotate(10deg)", transformOrigin: "0 50%" }} />
        <Chico x={interpolate(t, [873.9, 876.2], [140, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={interpolate(t, [873.9, 876.2], [1040, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} h={interpolate(t, [876.6, 877.4], [860, 940], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t} expr={t > 886.4 ? "enojado" : t > 883 ? "sorpresa" : "triste"} camina={t >= 873.9 && t < 876.2 ? 2 : 0} mira={t > 883 ? 1 : 0} bD={t > 886.4 ? 150 : 20} cD={t > 886.4 ? 20 : 30} />
        {t >= 878.1 && <div style={{ position: "absolute", left: 560, top: 420, width: 140, height: 50, borderRadius: "50%", background: "rgba(232,52,74,.35)", transform: `scale(${ent(t, 878.1)})` }} />}
        {t >= 880.0 && <Humo x={620} y={460} t={t} s={0.8} n={8} col="#5a5050" op={0.5} />}
        <Chip t={t} t0={872.8} text="THE GREENHAND RETURNS" color={C.violeta} x={480} y={200} centro size={52} />
        {[["4 YEARS OLDER", 877.0], ["SUNBURNED", 878.1], ["MISSING A TOOTH", 879.0], ["SMELLS OF SMOKE", 880.0]].map(([w, t0], k) => <Chip key={k} t={t} t0={t0 as number} t1={883.0} text={w as string} color={[C.noche, C.rojo, "#4a4e58", "#3a3034"][k]} x={1300} y={300 + k * 100} centro size={50} />)}
        <Monto t={t} ks={[[881.2, 0], [881.8, -9]]} x={1300} y={760} size={150} color={C.rojo} t0={881.2} />
        {t >= 884.0 && <Persona x={1560} y={1290} h={900} t={t} seed={210} ropa={CUAQUERO} casco="cuaquero" pantalon="#3a3a3a" expr="feliz" bD={110} cD={60} manoD={<g>{[0, 1, 2].map((k) => <circle key={k} cx={k * 14} cy={-k * 10} r={22} fill={C.oro} stroke="#8a5a10" strokeWidth={4} />)}</g>} flip />}
        <Rot t={t} t0={886.5} text="WHO WAS REALLY HUNTING?" x={960} y={960} size={86} color={C.crema} />
      </>
    ),
  },
  // ── cierre: suscribirse + campana, próxima: prisión medieval, ¿cuál de las 7 trampas te agarraba primero?
  {
    a: 888.9, b: 902.0,
    fondo: (t) => <Rayos2 t={t} c1="#5b2bb5" c2="#4a22a0" cx={1250} />,
    d: (t) => {
      const sub = t > 892.4;
      return (
        <>
          <Chico x={420} y={1290} h={1060} t={t} expr={t > 896.5 ? "sorpresa" : "feliz"} habla bD={130} cD={10} mira={1} salta={891.7} />
          {t < 891.35 && (
            <>
              <Ballenero x={1250} y={760} t={t} escala={0.5} />
              <Monto t={t} ks={[[889.3, 4]]} x={1250} y={180} size={110} pre="" suf=" YEARS ON A WHALER" color={C.crema} />
            </>
          )}
          {t >= 891.35 && t < 896.3 && (
            <>
              <div style={{ position: "absolute", left: 1150, top: 430, transform: `translate(-50%,-50%) scale(${ent(t, 891.35) * (t >= 892.3 && t < 892.6 ? 0.92 : 1)})`, background: sub ? "#6a6470" : "#e8202a", color: "#fff", fontFamily, fontWeight: 700, fontSize: 84, padding: "26px 60px", borderRadius: 20, border: `8px solid ${C.noche}`, whiteSpace: "nowrap" }}>{sub ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
              <Svg x={1600} y={430} s={ent(t, 892.6)} rot={t > 892.6 ? Math.sin(t * 18) * 18 * Math.max(0, 1 - (t - 892.6) / 1.5) : 0}><path d="M -60 40 Q -60 -70 0 -76 Q 60 -70 60 40 L 76 60 L -76 60 Z" fill={C.oro} stroke={C.noche} strokeWidth={8} /><circle cy={74} r={16} fill={C.oro} stroke={C.noche} strokeWidth={6} /></Svg>
              <Chip t={t} t0={893.5} text="NEXT TIME: A MEDIEVAL PRISON" color={C.noche} x={1250} y={720} centro size={56} />
            </>
          )}
          {t >= 896.3 && (
            <>
              <Rot t={t} t0={896.4} text="WHICH TRAP GOT YOU?" x={1220} y={200} size={100} color={C.crema} />
              {Array.from({ length: 7 }, (_, k) => <Svg key={k} x={860 + (k % 4) * 230 + (k > 3 ? 115 : 0)} y={480 + Math.floor(k / 4) * 260} s={0.95 * ent(t, 898.6 + k * 0.08) * (Math.floor(t * 2) % 7 === k ? 1.12 : 1)}><circle r={110} fill="#fff" stroke={C.noche} strokeWidth={10} /><Icono k={k + 1} /><text y={-80} x={80} fontFamily={fontFamily} fontWeight={700} fontSize={56} fill={C.rojo} stroke={C.noche} strokeWidth={4} paintOrder="stroke">{k + 1}</text></Svg>)}
              <Chip t={t} t0={897.0} text="TELL ME IN THE COMMENTS" color={C.rojo} x={1220} y={930} centro size={52} />
            </>
          )}
        </>
      );
    },
  },
];
