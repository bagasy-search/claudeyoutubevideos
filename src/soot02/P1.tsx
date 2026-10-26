import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, APION, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Particulas, Rayos, Emote, cabeza, Pergamino, Astro } from "./kit";
import { Denario } from "./kit2";
import { Apion, Sala } from "./actor";
import { Galera, Carta, DiplomaBronce, Coliseo, MapaMar, Pancarta, CuentaN, Flecha, Puerto, Volcan, Corte, Nubes } from "./mar";

// soot02 · trampa 1, EL CONTRATO (49,24-211,74 s). Un viaje continuo: la aldea en Egipto → la carta → el mar con Serapis
// → el puerto de Miseno → el Coliseo con su velario → el mapa → la oferta → el diploma → «¿esclavos?» → «lo firmaste vos».
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const TINTA = "#2a1530";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── sets y props propios de esta parte
export const Egipto: React.FC<{ t: number }> = ({ t }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {/* pirámides lejanas */}
    <path d="M 1180 640 L 1340 430 L 1500 640 Z" fill="#e8b46a" /><path d="M 1340 430 L 1500 640 L 1400 640 Z" fill="#c9913e" />
    <path d="M 1440 640 L 1560 480 L 1680 640 Z" fill="#e8b46a" /><path d="M 1560 480 L 1680 640 L 1600 640 Z" fill="#c9913e" />
    {/* el Nilo */}
    <path d="M 0 700 Q 600 660 1100 690 Q 1500 710 1920 680 L 1920 790 Q 1300 820 900 800 Q 400 780 0 800 Z" fill="#3a9ad0" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${((i * 260 + t * 40) % 2100) - 100} ${730 + (i % 3) * 18} q 20 -8 40 0`} stroke="#bfe8ff" strokeWidth={4} fill="none" />)}
    {/* orilla y arena */}
    <path d="M 0 790 Q 900 770 1920 800 L 1920 1080 L 0 1080 Z" fill="#f2c98a" />
    <path d="M 0 860 Q 900 840 1920 870 L 1920 1080 L 0 1080 Z" fill="#e8b46a" />
    {/* casas de adobe */}
    {[[180, 790, 1], [400, 800, 0.8], [1700, 800, 1.1]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-110} y={-150} width={220} height={150} fill="#d8a46a" /><rect x={-110} y={-162} width={220} height={18} fill="#c08850" />
        <rect x={-30} y={-90} width={60} height={90} rx={28} fill="#7a4a22" /><rect x={50} y={-120} width={36} height={30} fill="#7a4a22" />
      </g>
    ))}
    {/* palmeras */}
    {[[620, 800], [980, 790], [1250, 800]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 1.2 + i) * 2})`}>
        <path d="M -12 0 Q -4 -150 20 -300 L 34 -300 Q 12 -150 12 0 Z" fill="#8a5a2a" />
        {[-70, -30, 10, 50, 90, 140].map((a, k) => <path key={k} transform={`translate(27 -300) rotate(${a + Math.sin(t * 2 + k) * 4})`} d="M 0 0 Q 70 -40 140 10 Q 70 -10 0 0 Z" fill={k % 2 ? "#3f8f3e" : "#5aae4a"} />)}
      </g>
    ))}
  </svg>
);
const Serapis: React.FC<{ x: number; y: number; s?: number; t: number; t0: number }> = ({ x, y, s = 1, t, t0 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 14, stiffness: 90 });
  return (
    <svg style={{ position: "absolute", left: x - 260 * s, top: y - 300 * s, overflow: "visible", opacity: Math.min(1, (t - t0) * 2) }} width={520 * s} height={600 * s} viewBox="-260 -300 520 600">
      <g transform={`scale(${e})`}>
        <circle r={250} fill="#fff3c4" opacity={0.25} />
        <path d="M -70 -200 L 70 -200 L 90 -120 L -90 -120 Z" fill="#e9a92a" />{[-50, 0, 50].map((xx) => <path key={xx} d={`M ${xx - 10} -196 q 10 -30 20 0`} stroke="#5aae4a" strokeWidth={8} fill="none" />)}
        <ellipse cx={0} cy={-20} rx={110} ry={120} fill="#f2d4b0" />
        <path d="M -120 -40 Q -150 -150 0 -140 Q 150 -150 120 -40 Q 110 -110 0 -100 Q -110 -110 -120 -40 Z" fill="#e8e0d0" />
        <path d="M -110 10 Q -130 200 0 230 Q 130 200 110 10 Q 60 90 0 80 Q -60 90 -110 10 Z" fill="#e8e0d0" />
        {[-40, 40].map((xx) => <g key={xx}><ellipse cx={xx} cy={-30} rx={16} ry={10} fill="#fff" /><circle cx={xx} cy={-28} r={7} fill="#2a1a10" /></g>)}
        <path d="M -36 40 Q 0 64 36 40" stroke="#8a5a3a" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};
export const Laurel: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 130 * s, top: y - 60 * s, overflow: "visible" }} width={260 * s} height={120 * s} viewBox="-130 -60 260 120">
    {[-1, 1].map((d) => Array.from({ length: 6 }, (_, i) => <ellipse key={d + "" + i} cx={d * (30 + i * 16)} cy={10 - i * 4 + i * i * 1.6} rx={16} ry={8} fill={i % 2 ? "#5aae4a" : "#3f8f3e"} transform={`rotate(${d * (20 + i * 14)} ${d * (30 + i * 16)} ${10 - i * 4 + i * i * 1.6})`} />))}
  </svg>
);
export const Cadena: React.FC<{ x1: number; y1: number; x2: number; y2: number; rompe?: number; color?: string }> = ({ x1, y1, x2, y2, rompe = 0, color = "#9aa3b3" }) => {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 44));
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, i) => {
        const u = i / (n - 1);
        const mid = Math.abs(u - 0.5) < 0.08;
        const dy = rompe > 0 ? (u < 0.5 ? -1 : 1) * 0 + rompe * rompe * 500 * (1 - Math.abs(u - 0.5) * 2) : 0;
        if (mid && rompe > 0) return null;
        return <ellipse key={i} cx={x1 + (x2 - x1) * u} cy={y1 + (y2 - y1) * u + dy} rx={i % 2 ? 26 : 12} ry={i % 2 ? 12 : 22} fill="none" stroke={color} strokeWidth={9} />;
      })}
    </svg>
  );
};
const Vitrina: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  if (t < t0) return null;
  const e = prog(t, t0, t0 + 0.4);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <polygon points="760,0 1160,0 1400,1080 520,1080" fill="#fff3c4" opacity={0.12 * e} />
      <rect x={560} y={130} width={800} height={860} rx={16} fill="rgba(190,230,255,.12)" stroke="#dff4ff" strokeWidth={10} opacity={e} />
      <line x1={600} y1={180} x2={760} y2={340} stroke="#fff" strokeWidth={14} opacity={0.5 * e} strokeLinecap="round" />
      <rect x={520} y={990} width={880} height={50} fill="#5a3a7a" opacity={e} />
    </svg>
  );
};
// tabla FLEET vs LEGION
const Tabla: React.FC<{ t: number; filas: { a: string; b: string; t0: number; malo?: boolean }[]; x?: number; y?: number }> = ({ t, filas, x = 960, y = 520 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, filas[0].t0 - 0.3)})`, background: "linear-gradient(180deg, #3a2590, #241660)", border: "6px solid #7fd6ff", borderRadius: 30, padding: "26px 40px", boxShadow: "0 14px 0 rgba(10,5,30,.45)", fontFamily, fontWeight: 700, color: "#fff", width: 1180 }}>
    <div style={{ display: "flex", fontSize: 54, marginBottom: 14 }}>
      <div style={{ flex: 1 }} /><div style={{ width: 300, textAlign: "center", color: "#7fd6ff" }}>FLEET</div><div style={{ width: 300, textAlign: "center", color: "#ff8a9a" }}>LEGION</div>
    </div>
    {filas.map((f, i) => {
      const e = ent(t, f.t0);
      if (t < f.t0) return <div key={i} style={{ height: 96 }} />;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", height: 96, fontSize: 52, transform: `translateX(${(1 - e) * -60}px)`, opacity: e, borderTop: "4px solid rgba(255,255,255,.12)" }}>
          <div style={{ flex: 1, color: "#fff" }}>{["TERM", "PAY", "RESPECT"][i]}</div>
          <div style={{ width: 300, textAlign: "center", color: f.malo ? C.rojo : C.lima }}>{f.a}</div>
          <div style={{ width: 300, textAlign: "center", color: "#fff" }}>{f.b}</div>
        </div>
      );
    })}
  </div>
);
export const CintaCine: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#1a1410" }} />
    <AbsoluteFill style={{ left: 120, right: 120, top: 120, bottom: 120, overflow: "hidden", filter: "sepia(0.85) contrast(1.1)" }}>{children}</AbsoluteFill>
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 22 }, (_, i) => <g key={i}><rect x={((i * 96 - t * 300) % 2112 + 2112) % 2112 - 96} y={34} width={56} height={52} rx={8} fill="#e8dcc4" /><rect x={((i * 96 - t * 300) % 2112 + 2112) % 2112 - 96} y={994} width={56} height={52} rx={8} fill="#e8dcc4" /></g>)}
    </svg>
  </AbsoluteFill>
);
export const Sello: React.FC<{ t: number; t0: number; text: string; x: number; y: number; color?: string; size?: number; rot?: number }> = ({ t, t0, text, x, y, color = C.rojo, size = 110, rot = -12 }) => {
  if (t < t0) return null;
  const u = prog(t, t0, t0 + 0.14);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * u})`, opacity: u, fontFamily, fontWeight: 700, fontSize: size, color, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.2, padding: `0 ${size * 0.25}px`, whiteSpace: "nowrap", background: "rgba(255,255,255,.08)" }}>{text}</div>;
};

export const P1: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 49,24 · TRAP #1 · THE CONTRACT — sobre el mar de día, la galera pasa al fondo */}
    <Escena t={t} t0={49.24} t1={51.6} entra="atraviesa" ix={960} iy={600} sale="paneo" fondo="none" golpes={[49.68, 50.5]}>
      <Galera x={interpolate(t, [49.2, 51.9], [700, 1200])} y={700} s={0.42} t={t} boga={0.6} vela />
      <Pancarta t={t} t0={49.3} n={1} titulo="THE CONTRACT" y={300} />
      <Apion t={t} t0={49.4} x={1620} y={1050} h={420} borda={1020} acts={[[49.4, "asombro"], [50.5, "miedo"]]} />
    </Escena>

    {/* 51,6 · "Let me introduce you to a real person. His name is Apion... a village in Egypt, 2nd century... just joined the fleet" */}
    <Escena t={t} t0={51.6} t1={61.1} entra="paneo" sale="atraviesa" sx={1250} sy={420} fondo="none" quieta>
      <Cam t={t} k={[[51.6, 960, 540, 1.0], [56.2, 960, 560, 1.0], [57.4, 1100, 600, 1.15], [59.3, 1100, 600, 1.15], [61.4, 1250, 450, 1.6]]}>
        <Egipto t={t} />
        <Galera x={interpolate(t, [58.8, 61.4], [2400, 1500], cl)} y={720} s={0.3} t={t} boga={0.7} vela agua="#3a9ad0" />
        <Persona x={960} y={980} h={520} t={t} seed={2} ropa={APION} aparece={53.85} expr={t < 59.4 ? "feliz" : "orgullo"} habla={t > 54.3 && t < 56} bD={t > 59.4 ? 150 : 10} cD={40} />
        {Array.from({ length: 2 }, (_, i) => <Persona key={i} x={600 + i * 760} y={1000 + (i % 2) * 20} h={380} t={t} seed={60 + i} ropa={CIVIL(i + 1)} expr="neutro" flip={i === 2} bD={i === 1 ? 120 : 10} />)}
      </Cam>
      <Chip t={t} t0={52.7} text="A REAL PERSON" color={C.violeta} x={120} y={150} size={56} />
      <Grande t={t} t0={54.3} text="APION" y={260} size={170} color={C.crema} />
      <Chip t={t} t0={56.8} text="EGYPT" color={C.ambar} tinta={C.noche} x={1600} y={170} centro size={66} />
      <Chip t={t} t0={57.7} text="2ND CENTURY AD" color={C.teal} tinta={C.noche} x={1600} y={280} centro size={52} />
      <Chip t={t} t0={59.4} text="JOINED THE FLEET" color="#1d6f8a" x={960} y={950} centro size={66} />
    </Escena>

    {/* 61,1 · "his letter home survived, written on papyrus, and you can still read it today" — la carta, y una vitrina de museo */}
    <Escena t={t} t0={61.1} t1={68.6} entra="atraviesa" ix={960} iy={540} sale="fundido" fondo="#3a2a6a" golpes={[62.7, 65.6]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #6b4fb0, #1b1240 80%)" }} />
      <Carta x={960} y={560} s={1.0} t={t} t0={61.2} escribe={prog(t, 61.4, 63.6)} lineas={7} titulo="TO MY FATHER" firma="Apion" />
      <Vitrina t={t} t0={65.0} />
      <Chip t={t} t0={62.2} text="LETTER HOME" color={C.violeta} x={110} y={170} size={60} />
      <Chip t={t} t0={62.7} text="SURVIVED" color={C.teal} tinta={C.noche} x={110} y={280} size={60} />
      <Chip t={t} t0={64.0} text="PAPYRUS" color={C.ambar} tinta={C.noche} x={1600} y={170} centro size={60} />
      <Chip t={t} t0={65.6} text="READ IT TODAY" color={C.rojo} x={1600} y={280} centro size={56} />
      {[0, 1, 2].map((i) => { const t0 = 67.4 + i * 0.12; if (t < t0) return null; return <div key={i} style={{ position: "absolute", left: 470, top: 380 + i * 150, width: 86, height: 86, borderRadius: 43, background: [C.rojo, C.ambar, C.teal][i], border: "6px solid #fff", fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ent(t, t0)})` }}>{i + 1}</div>; })}
    </Escena>

    {/* 68,6 · "First, he thanks the god Serapis... in danger at sea... the god saved him" — el mundo se vuelve tormenta un momento */}
    <Escena t={t} t0={68.6} t1={76.9} entra="fundido" sale="paneo" fondo="none" golpes={[69.8, 73.9]}>
      <Nubes t={t} n={6} seed={21} color="#3a3d5e" op={0.85 * (1 - prog(t, 73.9, 75))} vel={60} alto={280} />
      {t > 73.7 && <Rayos t={t} x={1350} y={300} op={0.12 * prog(t, 73.7, 74.4)} />}
      <Serapis x={1350} y={330} s={0.9} t={t} t0={69.7} />
      <Galera x={560} y={700} s={0.36} t={t} boga={0.6} vela balanceo={interpolate(t, [70, 72, 74, 75], [1, 5, 5, 1], cl)} agua={null} />
      <Persona x={1600} y={pp(520, 560)} h={520} t={t} seed={2} ropa={APION} expr={t < 73.9 ? "miedo" : "feliz"} bI={t < 73.9 ? 120 + Math.sin(t * 7) * 10 : 160} bD={t < 73.9 ? 120 + Math.sin(t * 7 + 1) * 10 : 160} cI={t < 73.9 ? 90 : 20} cD={t < 73.9 ? 90 : 20} mira={-0.5} salta={73.95} />
      <Chip t={t} t0={68.7} text="1" color={C.rojo} x={110} y={160} size={70} />
      <Chip t={t} t0={69.8} text="THE GOD SERAPIS" color={C.oro} tinta={C.noche} x={250} y={160} size={60} />
      <Chip t={t} t0={72.3} text="DANGER AT SEA" color={C.rojo} x={250} y={270} size={56} />
      <Chip t={t} t0={73.9} text="SAVED!" color={C.teal} tinta={C.noche} x={1350} y={640} centro size={70} />
      <Chip t={t} t0={75.0} text="LOVELY START FOR A SAILOR" color={C.violeta} x={960} y={950} centro size={58} />
    </Escena>

    {/* 76,9 · "Second, when he arrived at the naval base of Misenum, near Naples, three gold coins from the emperor" — el puerto, el Vesubio dormido al fondo */}
    <Escena t={t} t0={76.9} t1={85.2} entra="paneo" sale="atraviesa" sx={960} sy={600} fondo="none" golpes={[79.3, 81.4]}>
      <Volcan x={520} y={430} s={0.38} t={t} erupcion={0} />
      <Puerto t={t} />
      {[0, 1, 2].map((i) => <Galera key={i} x={1000 + i * 380} y={630 + i * 6} s={0.22} t={t + i} boga={0} vela={i !== 1} agua="#2a74b8" marines={false} />)}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <rect x={-20} y={1004} width={1120} height={40} fill="#a8723e" stroke="#6b4320" strokeWidth={5} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 80} y1={1004} x2={i * 80} y2={1044} stroke="#6b4320" strokeWidth={4} />)}
        {[60, 380, 700, 1020].map((x) => <rect key={x} x={x} y={1040} width={30} height={60} fill="#6b4320" />)}
      </svg>
      <Persona x={interpolate(t, [76.9, 78.8], [-120, 760], cl)} y={1006} h={460} t={t} seed={2} ropa={APION} camina={t < 78.8 ? 1.6 : 0} expr={t < 81 ? "sorpresa" : "feliz"} bD={t > 81 ? 60 : 10} cD={t > 81 ? 90 : 10} salta={81.4} />
      {[0, 1, 2].map((i) => <Denario key={i} x={820 + i * 70} y={interpolate(t, [81.4 + i * 0.25, 81.7 + i * 0.25], [-80, 640 - i * 20], cl)} r={40} t={t} t0={81.4 + i * 0.25} gira={1.5} />)}
      <Chip t={t} t0={77.6} text="2" color={C.ambar} tinta={C.noche} x={110} y={160} size={70} />
      <Chip t={t} t0={79.3} text="MISENUM" color="#1d6f8a" x={250} y={160} size={70} />
      <Chip t={t} t0={80.1} text="NEAR NAPLES" color={C.violeta} x={250} y={270} size={52} />
      <Chip t={t} t0={81.8} text="3 GOLD COINS" color={C.oro} tinta={C.noche} x={1600} y={170} centro size={64} />
      <Chip t={t} t0={83.7} text="TRAVEL EXPENSES" color={C.teal} tinta={C.noche} x={1600} y={280} centro size={52} />
    </Escena>

    {/* 85,2 · "And third, he has a new name. The navy renamed him... no longer Apion... now Antonius Maximus" */}
    <Escena t={t} t0={85.2} t1={93.2} entra="atraviesa" ix={960} iy={600} sale="fundido" fondo="#2d1b69" golpes={[87.8, 91.3]}>
      <Sala t={t} />
      <Carta x={680} y={560} t={t} t0={85.25} lineas={4} escribe={1} tachado="APION" nuevo="ANTONIUS MAXIMUS" tn={89.5} />
      <Persona x={1450} y={pp(820, 470)} h={820} t={t} seed={2} ropa={APION} expr={t < 87.8 ? "neutro" : t < 91.3 ? "sorpresa" : "orgullo"} salta={87.8} mira={-0.6} bI={t < 87.6 ? 70 + Math.sin(t * 3) * 8 : 115} cI={t < 87.6 ? 30 : 0} bD={t > 91.3 ? 150 : 15} cD={t > 91.3 ? 40 : 10} />
      <Emote t={t} t0={88.0} t1={91} tipo="preg" {...L(1450, pp(820, 470), 820)} s={1.4} />
      <Chip t={t} t0={85.3} text="3" color={C.teal} tinta={C.noche} x={110} y={160} size={70} />
      <Chip t={t} t0={86.3} text="A NEW NAME" color={C.violeta} x={250} y={160} size={64} />
      <Chip t={t} t0={87.8} text="RENAMED!" color={C.rojo} x={1450} y={130} centro size={64} />
      <Grande t={t} t0={91.3} text="ANTONIUS MAXIMUS" y={960} size={120} color={C.oro} />
    </Escena>

    {/* 93,2 · "Misenum was the home of the biggest fleet... volcanic bay full of warships with names painted on their bows. Thousands of men" */}
    <Escena t={t} t0={93.2} t1={103.5} entra="fundido" sale="paneo" fondo="none" quieta golpes={[94.2, 101.9]}>
      <Cam t={t} k={[[93.2, 960, 560, 1.0], [96.0, 960, 560, 1.0], [98.4, 960, 600, 1.0], [99.2, 760, 640, 1.9], [101.0, 1260, 640, 1.9], [102.0, 960, 560, 1.0]]}>
        <Volcan x={1500} y={460} s={0.5} t={t} erupcion={0} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M 0 560 Q 200 420 520 500 Q 700 560 760 640 L 0 640 Z" fill="#6a5a8a" />
          <path d="M 1920 560 Q 1700 430 1400 520 Q 1240 580 1180 640 L 1920 640 Z" fill="#6a5a8a" />
        </svg>
        {["MARS", "TRITON", "VICTORIA", "SPES", "FIDES", "CONCORDIA"].map((n, i) => (
          <Galera key={n} x={320 + (i % 3) * 640 + (i > 2 ? 320 : 0)} y={i > 2 ? 760 : 660} s={i > 2 ? 0.34 : 0.26} t={t + i * 0.7} boga={0} vela marines={false} nombre={n} agua={i > 2 ? "#1f5c9c" : "#2a74b8"} />
        ))}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={900} width={1920} height={180} fill="#c9b8a0" />
          {Array.from({ length: 60 }, (_, i) => { const r = rnd(i + 80); const x = (r() * 1960 + (r() < 0.5 ? 1 : -1) * (t - 93) * 40) % 1960; return <g key={i} transform={`translate(${x} ${940 + r() * 90})`}><circle cx={0} cy={-26} r={9} fill={["#f2b48a", "#c98b62", "#8d5a3b"][i % 3]} /><rect x={-9} y={-18} width={18} height={22} rx={7} fill={["#9a6a4a", "#2fb5d8", "#8a5a7a", "#6a7a4a"][i % 4]} /></g>; })}
        </svg>
      </Cam>
      <Apion t={t} t0={93.4} x={250} y={1010} h={400} acts={[[93.9, "habla"], [97.7, "senala"], [99.9, "asombro"], [101.9, "festeja"]]} flip={false} />
      <Chip t={t} t0={94.2} text="BIGGEST FLEET IN THE EMPIRE" color="#1d6f8a" x={960} y={140} centro size={62} />
      <Chip t={t} t0={97.7} text="VOLCANIC BAY" color={C.rojo} x={960} y={250} centro size={54} />
      <Chip t={t} t0={99.9} t1={101.6} text="NAMES ON THEIR BOWS" color={C.oro} tinta={C.noche} x={960} y={820} centro size={58} />
      <Chip t={t} t0={101.9} text="THOUSANDS OF MEN" color={C.violeta} x={960} y={820} centro size={66} />
    </Escena>

    {/* 103,5 · "not all of their work was at sea. In Rome itself... barracks next to the Colosseum, for a very strange job" */}
    <Escena t={t} t0={103.5} t1={112.0} entra="paneo" sale="fundido" fondo="none" golpes={[105.7, 109.7, 111.1]}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#c9a46a" /><rect x={0} y={760} width={1920} height={24} fill="#a8834e" /></svg>
      <Coliseo x={1150} y={520} s={1.0} t={t} t0={105.6} />
      <Persona x={interpolate(t, [103.5, 106.2], [-100, 640], cl)} y={pp(430, 590)} h={430} t={t} seed={2} ropa={APION} camina={t < 106.2 ? 1.7 : 0} expr={t < 109.7 ? "sorpresa" : "feliz"} mira={0.8} bD={t > 109.7 ? 140 : 10} cD={30} />
      {t > 108.2 && <svg style={{ position: "absolute", left: 120, top: 560, transform: `scale(${ent(t, 108.2)})`, transformOrigin: "200px 300px" }} width={420} height={300}><rect x={20} y={80} width={380} height={200} fill="#e8b98a" /><path d="M 0 90 L 210 10 L 420 90 Z" fill="#b5452c" />{[60, 160, 260].map((x) => <rect key={x} x={x} y={150} width={60} height={60} fill="#5a3418" />)}</svg>}
      <Chip t={t} t0={104.0} text="NOT ALL AT SEA" color={C.violeta} x={110} y={150} size={56} />
      <Chip t={t} t0={105.7} text="ROME" color={C.rojo} x={110} y={260} size={72} />
      <Chip t={t} t0={108.3} text="SAILORS' BARRACKS" color="#1d6f8a" x={330} y={520} centro size={46} />
      <Chip t={t} t0={109.7} text="THE COLOSSEUM" color={C.oro} tinta={C.noche} x={1150} y={150} centro size={66} />
      <Chip t={t} t0={111.1} text="A VERY STRANGE JOB" color={C.rojo} x={960} y={960} centro size={62} />
    </Escena>

    {/* 112,0 · "When the sun was too hot, they climbed up and opened the velarium... 50,000 spectators... who knows ropes better than a sailor" */}
    <Escena t={t} t0={112.0} t1={124.0} entra="fundido" sale="fundido" fondo="none" quieta golpes={[113.4, 115.3, 119.3]}>
      <Cam t={t} k={[[112, 960, 540, 1.0], [113.8, 1500, 300, 1.3], [114.6, 960, 500, 1.0], [121.2, 960, 520, 1.0], [122.2, 960, 400, 1.6], [124.4, 960, 400, 1.6]]}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#c9a46a" /></svg>
        <Astro x={1500} y={220} r={90 + Math.sin(t * 6) * 6} />
        <Rayos t={t} x={1500} y={220} op={0.18} />
        <Coliseo x={960} y={600} s={1.1} velario={prog(t, 114.9, 116.6)} />
        {Array.from({ length: 8 }, (_, i) => { const u = prog(t, 114.0 + i * 0.05, 115.0 + i * 0.05); return <g key={i}><svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><g transform={`translate(${330 + i * 180} ${440 - u * 90})`}><circle cx={0} cy={-30} r={14} fill="#c98b62" /><rect x={-12} y={-18} width={24} height={30} rx={8} fill="#2fb5d8" /><line x1={0} y1={-10} x2={0} y2={-90} stroke="#c9a46a" strokeWidth={4} /></g></svg></g>; })}
      </Cam>
      {t < 121.6 && [0, 1, 2].map((i) => { const tira = Math.sin(t * 4 + i * 0.9); return (
        <React.Fragment key={i}>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={300 + i * 260} y1={-20} x2={330 + i * 260 + tira * 14} y2={860} stroke="#c9a46a" strokeWidth={10} /></svg>
          <Persona x={300 + i * 260} y={pp(380, 760) + tira * 6} h={380} t={t} seed={2 + i * 7} ropa={i === 1 ? APION : CIVIL(i + 2)} expr="enojado" bI={165 - tira * 12} bD={165 + tira * 12} cI={15} cD={15} inclina={tira * 4} />
        </React.Fragment>
      ); })}
      <Chip t={t} t0={112.6} text="TOO HOT" color={C.rojo} x={110} y={150} size={70} />
      <Chip t={t} t0={115.3} text="THE VELARIUM" color={C.oro} tinta={C.noche} x={960} y={140} centro size={70} />
      <Chip t={t} t0={117.1} text="SAILS + ROPES" color="#1d6f8a" x={960} y={250} centro size={52} />
      <CuentaN t={t} t0={119.3} t1={120.6} a={50000} x={1450} y={560} size={130} color={C.crema} />
      <Chip t={t} t0={119.3} text="SPECTATORS" color={C.violeta} x={1450} y={680} centro size={50} />
      <Chip t={t} t0={122.0} text="WHO KNOWS ROPES BETTER?" color={C.teal} tinta={C.noche} x={960} y={160} centro size={60} />
    </Escena>

    {/* 124,0 · "So yes. Some of the toughest men in the navy spent their afternoons giving shade to people watching gladiators" */}
    <Escena t={t} t0={124.0} t1={130.6} entra="fundido" sale="paneo" fondo="#f2c98a" golpes={[125.7, 128.3]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2d49a, #e8b46a 60%, #c9913e)" }} />
      {/* la arena: dos gladiadores chiquitos peleando abajo */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <ellipse cx={1300} cy={900} rx={520} ry={110} fill="#e8c48a" />
        {[0, 1].map((i) => <g key={i} transform={`translate(${1200 + i * 200 + Math.sin(t * 6 + i * 3) * 30} 880)`}><circle cx={0} cy={-80} r={20} fill="#c98b62" /><rect x={-16} y={-60} width={32} height={60} rx={10} fill={i ? "#7a5bd1" : "#a3202f"} /><line x1={i ? -16 : 16} y1={-40} x2={i ? -60 : 60} y2={-70 + Math.sin(t * 9 + i) * 20} stroke="#c8ccd4" strokeWidth={8} strokeLinecap="round" /></g>)}
      </svg>
      {/* el remero rudo tirando de la soga, sudando, a la sombra de nadie */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M 700 -20 Q 690 300 640 520 L 600 1100" stroke="#a8834e" strokeWidth={16} fill="none" /><path d="M 700 -20 Q 690 300 640 520 L 600 1100" stroke="#e0c08a" strokeWidth={6} fill="none" strokeDasharray="14 18" /></svg>
      <Persona x={480} y={pp(980, 440)} h={980} t={t} seed={2} ropa={APION} expr={t < 128 ? "enojado" : "triste"} bI={160} bD={150} cI={20} cD={30} inclina={-6} />
      <Emote t={t} t0={125.0} tipo="sudor" {...L(480, pp(980, 440), 980)} s={1.6} />
      <Chip t={t} t0={125.7} text="TOUGHEST MEN IN THE NAVY" color={C.rojo} x={1150} y={180} centro size={58} />
      <Chip t={t} t0={128.3} text="= SHADE CREW" color={C.teal} tinta={C.noche} x={1150} y={300} centro size={66} />
      <Chip t={t} t0={129.5} text="GLADIATORS" color={C.violeta} x={1300} y={720} centro size={48} />
    </Escena>

    {/* 130,6 · "That is how the deal worked. Most Roman rowers were not Roman at all... Egypt, Thrace, Dalmatia, Syria... not citizens" */}
    <Escena t={t} t0={130.6} t1={143.7} entra="paneo" sale="fundido" fondo="#1f5c9c" golpes={[133.4, 140.9]}>
      <MapaMar t={t} puntos={[{ n: "MISENUM", t0: 131.4, color: C.teal }, { n: "EGYPT", t0: 137.2 }, { n: "THRACE", t0: 138.1 }, { n: "DALMATIA", t0: 138.8 }, { n: "SYRIA", t0: 139.5 }]}
        rutas={[{ de: "EGYPT", a: "MISENUM", t0: 137.3 }, { de: "THRACE", a: "MISENUM", t0: 138.2 }, { de: "DALMATIA", a: "MISENUM", t0: 138.9 }, { de: "SYRIA", a: "MISENUM", t0: 139.6 }]} />
      <Apion t={t} t0={131.0} x={1680} y={1060} h={420} acts={[[131.5, "habla"], [133.4, "asombro"], [137.2, "senala"], [140.9, "triste"]]} flip />
      <Chip t={t} t0={131.2} text="THE DEAL" color={C.violeta} x={110} y={140} size={60} />
      <Chip t={t} t0={133.4} text="NOT ROMAN AT ALL" color={C.rojo} x={110} y={250} size={60} />
      <Chip t={t} t0={134.8} text="FREE MEN" color={C.teal} tinta={C.noche} x={1600} y={140} centro size={60} />
      <Chip t={t} t0={135.9} text="FROM THE EDGES" color={C.oro} tinta={C.noche} x={1600} y={250} centro size={50} />
      <Chip t={t} t0={140.9} text="NOT CITIZENS" color={C.rojo} x={960} y={960} centro size={66} />
      <Chip t={t} t0={142.1} text="...BADLY WANTED TO BE" color={C.violeta} x={960} y={850} centro size={50} />
    </Escena>

    {/* 143,7 · "Rome had a very simple offer. Serve 26 years, one year longer than the legion, lower pay, less respect..." */}
    <Escena t={t} t0={143.7} t1={153.0} entra="fundido" sale="atraviesa" sx={960} sy={540} fondo="#2d1b69" golpes={[146.7, 152.3]}>
      <Sala t={t} />
      <Chip t={t} t0={144.3} text="A VERY SIMPLE OFFER" color={C.oro} tinta={C.noche} x={960} y={130} centro size={64} />
      <Tabla t={t} y={560} filas={[{ a: "26 YRS", b: "25 YRS", t0: 146.7, malo: true }, { a: "LOWER", b: "MORE", t0: 149.9, malo: true }, { a: "LESS", b: "MORE", t0: 151.4, malo: true }]} />
      <Apion t={t} t0={143.8} x={1640} y={1060} h={430} acts={[[144.3, "habla"], [146.7, "asombro"], [149.9, "enojado"], [151.4, "triste"]]} flip />
    </Escena>

    {/* 153,0 · "and at the end, you get the one thing your family never had. Roman citizenship. For you, your wife, your children" */}
    <Escena t={t} t0={153.0} t1={160.7} entra="atraviesa" ix={960} iy={540} sale="fundido" fondo="#ff9a4d" golpes={[156.6, 158.2, 159.1, 160.1]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffe08a, #ff9a4d 60%, #c2452a)" }} />
      <Rayos t={t} x={960} y={360} op={0.16} />
      <Particulas t={t} tipo="destellos" n={18} seed={9} />
      <Chip t={t} t0={153.3} text="AT THE END..." color={C.violeta} x={960} y={130} centro size={56} />
      <Grande t={t} t0={156.6} text="ROMAN CITIZENSHIP" y={290} size={140} color={C.crema} />
      <Persona x={720} y={1000} h={560} t={t} seed={2} ropa={APION} expr="feliz" aparece={158.1} />
      <Persona x={1000} y={1000} h={520} t={t} seed={70} ropa={CIVIL(2)} expr="feliz" aparece={158.9} flip />
      <Persona x={1240} y={1000} h={330} t={t} seed={71} ropa={CIVIL(3)} expr="feliz" aparece={159.8} flip salta={160.2} />
      <Chip t={t} t0={158.2} text="YOU" color={C.teal} tinta={C.noche} x={720} y={460} centro size={50} />
      <Chip t={t} t0={159.1} text="WIFE" color={C.rosa} x={1000} y={500} centro size={50} />
      <Chip t={t} t0={160.1} text="KIDS" color={C.ambar} tinta={C.noche} x={1240} y={640} centro size={50} />
    </Escena>

    {/* 160,7 · "a little bronze document, two small plates tied together with wire, a military diploma. Archaeologists found hundreds" */}
    <Escena t={t} t0={160.7} t1={173.4} entra="fundido" sale="fundido" fondo="#1b1240" golpes={[161.8, 166.2, 168.3]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3a2a7a, #120c30 80%)" }} />
      {t < 167.5 && <DiplomaBronce x={960} y={520} s={1.25} t={t} t0={160.8} abre={interpolate(t, [163.1, 164.0, 164.6, 165.3], [1, 0.05, 0.05, 1], cl)} />}
      {t >= 166.95 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={640} width={1920} height={440} fill="#8a5a3a" />
          {Array.from({ length: 30 }, (_, i) => { const e = 0.5 + 0.5 * ent(t, 166.95 + i * 0.03); const x = 120 + (i % 10) * 185, y = 700 + Math.floor(i / 10) * 120; return <g key={i} transform={`translate(${x} ${y}) scale(${e * 0.75}) rotate(${(i * 37) % 30 - 15})`}><rect x={-60} y={-40} width={56} height={80} rx={5} fill="#d08a3a" stroke="#6a3a10" strokeWidth={4} /><rect x={4} y={-40} width={56} height={80} rx={5} fill="#e9a94a" stroke="#6a3a10" strokeWidth={4} /></g>; })}
        </svg>
      )}
      {t >= 167.2 && <Persona x={1560} y={1000} h={560} t={t} seed={80} ropa={CIVIL(4)} expr="sorpresa" bD={interpolate(t, [167.4, 168.4], [10, 160], cl)} cD={20} manoD={<g transform="translate(0 40)"><rect x={-36} y={-30} width={32} height={50} rx={4} fill="#d08a3a" stroke="#6a3a10" strokeWidth={3} /><rect x={2} y={-30} width={32} height={50} rx={4} fill="#e9a94a" stroke="#6a3a10" strokeWidth={3} /></g>} />}
      <Chip t={t} t0={161.8} t1={167} text="BRONZE" color="#d08a3a" x={110} y={150} size={66} />
      <Chip t={t} t0={163.6} t1={167} text="2 PLATES + WIRE" color={C.violeta} x={110} y={260} size={52} />
      <Chip t={t} t0={165.7} t1={167} text="MILITARY DIPLOMA" color={C.oro} tinta={C.noche} x={960} y={950} centro size={68} />
      <Chip t={t} t0={167.1} text="ARCHAEOLOGISTS" color={C.teal} tinta={C.noche} x={110} y={150} size={56} />
      <Chip t={t} t0={168.3} text="HUNDREDS FOUND" color={C.ambar} tinta={C.noche} x={110} y={260} size={60} />
      {t >= 168.3 && <CuentaN t={t} t0={168.3} t1={170.0} a={400} x={1250} y={230} size={110} color={C.crema} suf="+" />}
      <Chip t={t} t0={170.2} text="PROOF A FEW MADE IT" color={C.violeta} x={960} y={420} centro size={58} />
    </Escena>

    {/* 173,4 · "The fine print is the same as always. You only get the diploma if you are still alive to receive it" */}
    <Escena t={t} t0={173.4} t1={178.8} entra="fundido" sale="fundido" fondo="#2d1b69" golpes={[177.3]}>
      <Sala t={t} />
      <Apion t={t} t0={173.5} x={1090} y={1060} h={380} acts={[[173.9, "piensa"], [176.6, "miedo"]]} />
      <DiplomaBronce x={700} y={540} s={1.1} abre={1} />
      {t > 173.9 && <svg style={{ position: "absolute", left: interpolate(t, [173.9, 176.5], [380, 700], cl), top: 330, transform: `scale(${ent(t, 173.9)})` }} width={320} height={420}><circle cx={140} cy={140} r={110} fill="rgba(200,240,255,.2)" stroke="#e9a92a" strokeWidth={20} /><line x1={220} y1={220} x2={300} y2={360} stroke="#6b3a1f" strokeWidth={34} strokeLinecap="round" /></svg>}
      <Chip t={t} t0={173.9} text="THE FINE PRINT" color={C.violeta} x={1500} y={200} centro size={60} />
      <Grande t={t} t0={176.6} text="IF" x={1600} y={460} size={260} color={C.rojo} />
      <Chip t={t} t0={177.3} text="STILL ALIVE" color={C.rojo} x={1500} y={700} centro size={72} />
    </Escena>

    {/* 178,8 · "Wait, one question. Weren't the rowers slaves, chained to their oars, like in the movies? No. Mostly Hollywood." */}
    <Escena t={t} t0={178.8} t1={185.9} entra="corte" sale="fundido" fondo="#1a1410" golpes={[181.1, 183.9, 185.2]}>
      <CintaCine t={t}>
        <Corte t={t} boga={0.3} agua={0.05} heroeExpr="miedo" hortator luz={0.5} />
        <Cadena x1={150} y1={980} x2={1700} y2={980} />
        <Cadena x1={150} y1={700} x2={1700} y2={700} />
      </CintaCine>
      <Chip t={t} t0={178.9} text="WAIT." color={C.ambar} tinta={C.noche} x={960} y={160} centro size={72} />
      <Chip t={t} t0={181.1} text="SLAVES? CHAINED?" color={C.violeta} x={960} y={280} centro size={62} />
      <Chip t={t} t0={183.2} text="THE MOVIES" color={C.oro} tinta={C.noche} x={960} y={400} centro size={56} />
      <Sello t={t} t0={183.9} text="NO" x={960} y={620} size={190} />
      <Chip t={t} t0={185.2} text="MOSTLY HOLLYWOOD" color={C.rojo} x={960} y={880} centro size={66} />
    </Escena>

    {/* 185,9 · "free, paid, trained men. A ship is only as fast as its worst rower. Chained men do not row hard" */}
    <Escena t={t} t0={185.9} t1={194.5} entra="fundido" sale="fundido" fondo="none" golpes={[187.1, 187.9, 188.7, 191.4]}>
      <Galera x={interpolate(t, [189.4, 194.6], [700, 700 + interpolate(t, [191.4, 193.8], [500, 120], cl)], cl)} y={660} s={0.6} t={t} boga={t < 191.4 ? 0.8 : 0.35} vela />
      {[["FREE", C.teal, 187.1], ["PAID", C.oro, 187.9], ["TRAINED", C.rojo, 188.7]].map(([txt, col, t0], i) => <Chip key={i} t={t} t0={t0 as number} t1={189.4} text={txt as string} color={col as string} tinta={i < 2 ? C.noche : "#fff"} x={500 + i * 460} y={200} centro size={84} />)}
      {t > 189.5 && (() => {
        const v = interpolate(t, [189.6, 191.4, 192.6], [0.3, 0.9, 0.3], cl);
        return <svg style={{ position: "absolute", left: 1460, top: 90, transform: `scale(${ent(t, 189.5)})` }} width={400} height={260}><path d="M 40 220 A 160 160 0 0 1 360 220" stroke="#fff" strokeWidth={26} fill="none" opacity={0.3} /><path d="M 40 220 A 160 160 0 0 1 360 220" stroke={v > 0.6 ? C.lima : C.rojo} strokeWidth={26} fill="none" pathLength={1} strokeDasharray={`${v} 1`} /><line x1={200} y1={220} x2={200 - Math.cos(v * Math.PI) * 130} y2={220 - Math.sin(v * Math.PI) * 130} stroke="#fff" strokeWidth={12} strokeLinecap="round" /><circle cx={200} cy={220} r={18} fill="#fff" /></svg>;
      })()}
      <Chip t={t} t0={189.6} text="SHIP SPEED" color="#1d6f8a" x={1660} y={390} centro size={44} />
      <Chip t={t} t0={190.2} text="ONLY AS FAST AS ITS WORST ROWER" color={C.violeta} x={700} y={200} centro size={52} />
      <Chip t={t} t0={192.6} text="CHAINED = SLOW" color={C.rojo} x={700} y={320} centro size={60} />
      <Apion t={t} t0={186.0} x={1700} y={1050} h={420} borda={1020} acts={[[186.5, "habla"], [189.6, "rema"], [192.6, "cansado"]]} />
    </Escena>

    {/* 194,5 · "In real emergencies, Rome did use slaves, but it freed them first. Octavian... 20,000 slaves free... trained as oarsmen" */}
    <Escena t={t} t0={194.5} t1={204.9} entra="fundido" sale="fundido" fondo="#2d1b69" golpes={[197.7, 199.3, 201.7]}>
      <Sala t={t} tipo="bodega" />
      {Array.from({ length: 6 }, (_, i) => <Persona key={i} x={760 + i * 200} y={1000} h={380} t={t} seed={90 + i} ropa={CIVIL(i)} expr={t < 197.7 ? "triste" : "feliz"} salta={197.8 + i * 0.06 + Math.floor(Math.max(0, t - 197.8) / 1.3) * 1.3} bI={t > 197.8 ? 150 + Math.sin(t * 6 + i) * 20 : 10 + Math.sin(t * 2 + i) * 4} bD={t > 197.8 ? 150 + Math.sin(t * 6 + i + 1) * 20 : 10} inclina={t < 197.7 ? 8 : 0} />)}
      <Cadena x1={640} y1={880} x2={1880} y2={880} rompe={prog(t, 197.7, 198.4)} />
      <Persona x={360} y={pp(820, 430)} h={820} t={t} seed={95} ropa={{ tunica: "#f2ead8", tunica2: "#c9b8a0", cinto: "#a3202f", piel: "#f2c7a0", piel2: "#d8a07a", pelo: "#7a4a22" }} expr="orgullo" aparece={199.2} bD={t > 200.5 ? 130 : 10} cD={30} />
      {t > 199.2 && <Laurel x={360} y={pp(820, 430) - 450 * (820 / 560) - 70} s={2.0} />}
      <Chip t={t} t0={194.9} text="REAL EMERGENCIES" color={C.rojo} x={760} y={150} size={58} />
      <Chip t={t} t0={197.7} text="FREED FIRST" color={C.teal} tinta={C.noche} x={760} y={260} size={66} />
      <Chip t={t} t0={199.4} text="OCTAVIAN" color={C.oro} tinta={C.noche} x={360} y={90} centro size={60} />
      <CuentaN t={t} t0={201.7} t1={202.6} a={20000} x={1300} y={460} size={180} color={C.crema} />
      <Chip t={t} t0={202.8} text="FREED → OARSMEN" color={C.violeta} x={1300} y={620} centro size={56} />
    </Escena>

    {/* 204,9 · "So, no chains. Just a contract. Which, as you will see, is worse. Because you signed it yourself." — vuelve la firma del gancho */}
    <Escena t={t} t0={204.9} t1={211.74} entra="fundido" sale="atraviesa" sx={960} sy={520} fondo="#2d1b69" golpes={[205.7, 206.8, 209.5, 210.6]}>
      <Sala t={t} />
      {t < 206.6 && <Cadena x1={300} y1={540} x2={1620} y2={540} rompe={prog(t, 205.6, 206.4)} />}
      {t >= 206.6 && <Pergamino x={760} y={600} w={720} abre={prog(t, 206.6, 207.1)} lineas={8} firma={1} titulo="CLASSIS · NAVY" />}
      {t > 210.5 && <svg style={{ position: "absolute", left: 470, top: 780 }} width={560} height={160}><ellipse cx={280} cy={70} rx={260} ry={70} fill="none" stroke={C.ambar} strokeWidth={12} pathLength={1} strokeDasharray={`${prog(t, 210.5, 211.0)} 1`} /></svg>}
      <Persona x={1300} y={pp(820, 470)} h={820} t={t} seed={2} ropa={APION} expr={t < 209.4 ? "neutro" : "miedo"} mira={-0.8} salta={209.5} bI={t > 206.8 && t < 209.4 ? 105 + Math.sin(t * 14) * 6 : 15} cI={t > 206.8 && t < 209.4 ? 40 : 10} manoI={t > 206.8 && t < 209.4 ? <g transform="rotate(-30)"><path d="M 0 0 L -8 -110 Q 20 -150 30 -110 Z" fill="#f2ead8" stroke="#8a7a5a" strokeWidth={4} /></g> : undefined} />
      <Emote t={t} t0={210.6} tipo="sudor" {...L(1300, pp(820, 470), 820)} s={1.4} />
      <Chip t={t} t0={205.7} text="NO CHAINS" color={C.teal} tinta={C.noche} x={440} y={110} centro size={62} />
      <Chip t={t} t0={206.8} text="JUST A CONTRACT" color={C.violeta} x={980} y={110} centro size={56} />
      <Chip t={t} t0={209.5} text="WORSE" color={C.rojo} x={1650} y={240} centro size={80} />
      <Chip t={t} t0={210.6} text="YOU SIGNED IT" color={C.ambar} tinta={C.noche} x={760} y={980} centro size={64} />
    </Escena>
  </>
);
