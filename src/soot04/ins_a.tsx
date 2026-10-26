import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Particulas, Emote, fontFamily } from "./kit";
import { Svg, Cachalote, Bote, Splash, Farol, Moneda0, Barril0, Pajitas, Tiburon, Iglesia, Arpon } from "./kit3";
import { Colectivo } from "./hud";
import { Persona, MARINO, TIBURON, CAPITAN, CUAQUERO, GREEN } from "./persona";
import { Chico } from "./reparto";
import { Ins, Rayos2, Grad, Mar, Monto, Sello, Dice, Rot, Vuela } from "./insertos";

// 0:00 – 4:30 · el gancho, el reclutador, el lay, las deducciones y los cuáqueros
const Marino: React.FC<{ i: number; x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; habla?: boolean; mira?: number; manoD?: React.ReactNode; camina?: number; salta?: number; inclina?: number }> = ({ i, ...p }) => (
  <Persona {...p} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} />
);
// boleta de la tripulación (la que lo persigue todo el video)
const Boleta: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; rot?: number; saldo: React.ReactNode }> = ({ t, t0, x, y, s = 1, rot = -5, saldo }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 460, height: 560, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * ent(t, t0)})`, background: "#f6ecd2", border: "8px solid #5a3418", borderRadius: 10, boxShadow: "0 16px 0 rgba(20,10,50,.3)", fontFamily, fontWeight: 700, color: "#2a1530", padding: "26px 30px" }}>
    <div style={{ fontSize: 40, textAlign: "center", letterSpacing: 2 }}>CREW ACCOUNT</div>
    <div style={{ fontSize: 26, textAlign: "center", color: "#8a5a3a", marginBottom: 18 }}>SHIP LYDIA · GREENHAND</div>
    {[["YOUR LAY", "1/175"], ["SEA GEAR", "-$31"], ["ADVANCE", "-$40"], ["SLOP CHEST", "-$104"]].map(([a, b]) => (
      <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, borderBottom: "3px dashed #c8a878", padding: "8px 0" }}><span>{a}</span><span>{b}</span></div>
    ))}
    <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 40 }}><span>BALANCE</span>{saldo}</div>
  </div>
);

export const INS_A: Ins[] = [
  // ── «one share… one-one-hundred-and-seventy-fifth»: la torta se corta en 10, 100, 175 y al chico le toca una astilla
  {
    a: 9.75, b: 14.5,
    fondo: (t) => <Rayos2 t={t} c1="#5b2bb5" c2="#4a2296" cx={1260} cy={560} />,
    d: (t) => {
      const n = t < 10.9 ? 10 : t < 12.3 ? 100 : 175;
      const tc = t < 10.9 ? 10.0 : t < 12.3 ? 10.95 : 12.35;
      return (
        <>
          <svg style={{ position: "absolute", left: 1260, top: 520, overflow: "visible" }} width={1} height={1}>
            <g transform={`scale(${0.88 * ent(t, 9.8)})`}>
              <circle r={330} fill={C.oro} stroke={C.noche} strokeWidth={12} />
              {t < tc && <text y={80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={240} fill={C.noche} transform={`scale(${1 + Math.sin(t * 6) * 0.06})`}>?</text>}
              {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; const u = prog(t, tc + (i / n) * 0.35, tc + (i / n) * 0.35 + 0.1); return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 330 * u} y2={Math.sin(a) * 330 * u} stroke="#a8781a" strokeWidth={n > 50 ? 2 : 6} opacity={n > 50 ? 0.45 : 1} />; })}
              {t >= 12.6 && (() => { const k = prog(t, 12.6, 13.1); const a0 = -Math.PI / 2, a1 = a0 + (Math.PI * 2) / 175; return <path d={`M ${Math.cos(a0 + 0.004) * 60 * k} ${-60 * k} L ${Math.cos(a0) * 330 + 0} ${Math.sin(a0) * 330 - 90 * k} L ${Math.cos(a1) * 330} ${Math.sin(a1) * 330 - 90 * k} Z`} fill={C.rojo} stroke="#fff" strokeWidth={3} transform={`translate(${70 * k} ${-90 * k})`} />; })()}
            </g>
          </svg>
          <Rot key={n} t={t} t0={tc} text={`1/${n}`} x={1260} y={150} size={n === 175 ? 150 : 120} color={n === 175 ? C.rojo : C.crema} />
          {t >= 10.85 && t < 12.3 && <div style={{ position: "absolute", left: 1150, top: 150, width: 220, height: 12, background: C.rojo, transform: `rotate(-8deg) scaleX(${prog(t, 11.0, 11.2)})`, transformOrigin: "left" }} />}
          <Chip t={t} t0={9.85} t1={12.9} text="ONE SHARE = ?" color={C.violeta} x={1260} y={950} centro size={60} />
          <Chip t={t} t0={13.0} text="← YOU" color={C.rojo} x={1440} y={330} size={58} />
          <Chico x={470} y={1250} h={1050} t={t} gorro={false} expr={t < 12.4 ? "sorpresa" : "miedo"} bD={t > 12.8 ? 95 : 20} cD={t > 12.8 ? 10 : 30} mira={0.5} salta={12.45} />
          {t >= 12.5 && <Emote t={t} t0={12.5} tipo="sudor" x={600} y={300} s={1.1} />}
        </>
      );
    },
  },
  // ── «an animal the size of a bus… firewood with one flick of its tail»
  {
    a: 17.0, b: 23.65,
    fondo: (t) => <Mar t={t} y={600} />,
    d: (t) => {
      const roto = prog(t, 22.75, 22.95);
      return (
        <>
          <Cachalote x={1180} y={700} t={t} s={0.82} nada={t >= 22.4 && t < 23.0 ? 3 : 0.8} chorro={t < 18.6 ? 1 : 0} />
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${-(1 - ent(t, 19.3)) * 600}px)` }}><Colectivo x={1180} y={470} s={0.95} /></div>
          {t >= 19.3 && <Rot t={t} t0={19.6} text="=" x={1180} y={540} size={110} color={C.oro} />}
          <Chip t={t} t0={19.3} t1={22.2} text="THE SIZE OF A BUS" color={C.ambar} tinta={C.noche} x={560} y={300} centro size={66} />
          <Bote x={interpolate(t, [17, 22.7], [140, 360], { extrapolateRight: "clamp" })} y={720} t={t} s={1.15} roto={roto} rema={roto ? 0 : 1.4}
            gente={<>{[-150, -80, -10, 60, 130].map((ox, k) => <circle key={k} cx={ox} cy={-70} r={22} fill={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0", "#f2b48a"][k]} />)}</>} />
          {t >= 22.75 && <Splash x={360} y={700} t={t} t0={22.75} s={1.6} />}
          {t >= 22.75 && Array.from({ length: 7 }, (_, k) => <Vuela key={k} t={t} t0={22.78} t1={23.6} x0={360} y0={690} x1={360 + (k - 3) * 140} y1={820} arco={240 + k * 30} giro={300 + k * 60} s={1}><rect x={-60} y={-9} width={120} height={18} rx={5} fill="#9a6a3a" stroke="#5a3418" strokeWidth={4} /></Vuela>)}
          <Chico x={1730} y={1300} h={900} t={t} expr={t < 22.75 ? "sorpresa" : "miedo"} mira={-1} bD={t > 22.75 ? 162 : 80} cD={t > 22.75 ? 12 : 30} bI={t > 22.75 ? 162 : 20} cI={t > 22.75 ? 12 : 20} salta={22.8} />
          <Rot t={t} t0={22.8} text="FIREWOOD" x={520} y={260} size={120} color={C.naranja} tiembla />
        </>
      );
    },
  },
  // ── «a very real chance that you will owe the ship money»
  {
    a: 24.3, b: 29.75,
    fondo: (t) => <Rayos2 t={t} c1="#c23a50" c2="#a52c42" cx={1260} cy={520} />,
    d: (t) => (
      <>
        <Boleta t={t} t0={24.5} x={1270} y={540} rot={-5} saldo={<span style={{ color: t > 27.9 ? C.rojo : "#2a1530", fontSize: 64, display: "inline-block", transform: `scale(${t >= 27.6 && t < 28.1 ? 1.3 : 1})` }}>{t < 27.6 ? "$200" : "-$9"}</span>} />
        <Sello t={t} t0={28.5} text="YOU OWE THE SHIP" x={1270} y={820} size={66} rot={-7} />
        <Chico x={560} y={1240} h={1080} t={t} gorro expr={t < 27.6 ? "neutro" : "miedo"} bD={70} cD={40} mira={0.6} salta={28.5} />
        {t >= 28.6 && <Emote t={t} t0={28.6} tipo="susto" x={660} y={280} s={1.2} />}
        <Rot t={t} t0={25.5} t1={27.4} text="IF YOU COME HOME…" x={600} y={130} size={84} />
      </>
    ),
  },
  // ── «the job that lit the world… street lamps of London, lighthouses of America burned whale oil»
  {
    a: 30.0, b: 37.9,
    fondo: () => <Grad c1="#1b1240" c2="#3a2a6a" />,
    d: (t) => {
      const faro = prog(t, 35.6, 36.2);
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {/* Londres */}
            <path d="M 0 860 L 0 700 L 80 700 L 80 640 L 150 640 L 150 720 L 230 720 L 230 600 L 260 560 L 290 600 L 290 720 L 380 720 L 380 660 L 470 660 L 470 740 L 560 740 L 560 860 Z" fill="#120c2a" />
            <rect x={0} y={860} width={1920} height={220} fill="#0e0a20" />
            {/* faro de América */}
            <g transform={`translate(1560 ${860 + (1 - faro) * 420})`}>
              <path d="M -60 0 L -36 -380 L 36 -380 L 60 0 Z" fill="#f0ece4" />{[0, 1, 2].map((k) => <rect key={k} x={-52 + k * 8} y={-100 - k * 120} width={104 - k * 16} height={40} fill={C.rojo} />)}
              <rect x={-44} y={-450} width={88} height={70} fill="#ffe7a0" stroke="#2a1530" strokeWidth={8} /><path d="M -54 -450 L 0 -500 L 54 -450 Z" fill="#2a1530" />
              {faro > 0.9 && <path d={`M 0 -415 L ${-900} ${-415 - 160 + Math.sin(t * 2) * 60} L -900 ${-415 + 160 + Math.sin(t * 2) * 60} Z`} fill="#fff3c4" opacity={0.28} />}
            </g>
          </svg>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - ent(t, 30.3)) * 500}px)` }}>
            <Svg x={760} y={880} s={1}><rect x={-16} y={-560} width={32} height={560} fill="#2a2a3a" /><path d="M -60 0 L 60 0 L 40 -40 L -40 -40 Z" fill="#2a2a3a" /></Svg>
            <Farol x={760} y={-0 + 300} t={t} s={2.8} />
          </div>
          <div style={{ position: "absolute", left: 760 - 300, top: 300 - 300, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle, rgba(255,210,120,.45), rgba(255,210,120,0) 70%)", opacity: 0.8 + 0.2 * Math.sin(t * 9) }} />
          <Persona x={420} y={1290} h={1020} t={t} seed={44} ropa={MARINO(1)} casco="gorro" gorroCol="#3d6e5a" pantalon="#2a2a3a" expr={t > 35.6 ? "orgullo" : "neutro"} mira={1} miraY={-0.6} bD={150} cD={10} manoD={<line x1={0} y1={0} x2={0} y2={-340} stroke="#5a3418" strokeWidth={14} strokeLinecap="round" />} salta={30.9} />
          <Chip t={t} t0={32.0} t1={33.0} text="NO ELECTRICITY" color={C.violeta} x={300} y={150} size={52} />
          <Chip t={t} t0={33.2} t1={34.2} text="NO KEROSENE" color={C.violeta} x={300} y={150} size={52} />
          <Chip t={t} t0={34.3} text="LONDON" color={C.teal} tinta={C.noche} x={150} y={560} size={50} />
          <Chip t={t} t0={35.8} text="AMERICA" color={C.teal} tinta={C.noche} x={1460} y={330} size={50} />
          <Rot t={t} t0={37.2} text="WHALE OIL" x={960} y={950} size={120} color={C.oro} />
        </>
      );
    },
  },
  // ── «Nantucket got rich selling it. Not you, though.»
  {
    a: 41.0, b: 45.8,
    fondo: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}><Rayos2 t={t} c1="#f7c548" c2="#e8a92a" cx={480} cy={520} /></div>
        <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg,#6a6a86,#3a3a52)", clipPath: `inset(0 0 0 ${(1 - prog(t, 42.6, 42.9)) * 100}%)` }} />
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, height: 1080, background: C.noche }} />
      </>
    ),
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
          <Particulas t={t} tipo="lluviaoro" n={30} seed={4} />
          <Persona x={480} y={1180} h={900} t={t} seed={21} ropa={CUAQUERO} casco="cuaquero" pantalon="#2a282e" expr="feliz" bD={110} cD={30} manoD={<g transform="translate(0 -40) scale(.9)"><Moneda0 r={60} /></g>} />
          <Chip t={t} t0={41.2} text="NANTUCKET" color={C.violeta} x={480} y={120} centro size={60} />
          {[0, 1, 2, 3].map((k) => <Svg key={k} x={200 + k * 190} y={980 - (k % 2) * 40} s={1}><g transform={`scale(${ent(t, 41.4 + k * 0.15)})`}><Barril0 /></g></Svg>)}
        </div>
        {t >= 42.6 && (
          <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <Chico x={480} y={1200} h={950} t={t} gorro="paja" expr="triste" bD={20} bI={20} cD={60} cI={60} mira={-0.3} />
            {[[330, 700], [630, 700]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x - 50, top: y, width: 100, height: 120, background: "#e8dcc0", border: "6px solid #8a7a5a", borderRadius: "0 0 40px 40px", transform: `scaleY(${ent(t, 43.0 + k * 0.1)})`, transformOrigin: "top" }} />)}
            <Rot t={t} t0={42.85} text="NOT YOU." x={480} y={180} size={150} color={C.rojo} />
          </div>
        )}
      </>
    ),
  },
  // ── «count every single way a whaling ship tries to kill you. There are seven of them.»
  {
    a: 51.3, b: 56.15,
    fondo: (t) => <Rayos2 t={t} c1="#2d1b69" c2="#24155a" cy={620} />,
    d: (t) => (
      <>
        {Array.from({ length: 7 }, (_, k) => {
          const t0 = 51.6 + k * 0.42, x = 260 + k * 233, y = 300 - Math.sin((k / 6) * Math.PI) * 110;
          return (
            <div key={k} style={{ position: "absolute", left: x, top: y, width: 190, height: 250, transform: `translate(-50%, -50%) rotate(${(k - 3) * 5}deg) scale(${ent(t, t0)})`, background: k === 6 ? C.rojo : "#fff3d6", border: `8px solid ${C.noche}`, borderRadius: 18, boxShadow: "0 10px 0 rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 130, color: k === 6 ? "#fff" : C.noche }}>{k + 1}</div>
          );
        })}
        <Chico x={960} y={1480} h={900} t={t} gorro="paja" expr={t < 54.7 ? "sorpresa" : "miedo"} mira={Math.sin(t * 2) * 0.5} salta={54.75} />
        <Rot t={t} t0={53.7} text="WAYS TO KILL YOU" x={960} y={545} size={96} color={C.rojo} />
        {t >= 54.8 && <Emote t={t} t0={54.8} tipo="sudor" x={1080} y={700} s={1.2} />}
      </>
    ),
  },
  // ── «the most famous whaling crew in history ended up drawing lots… which one of them would be eaten»
  {
    a: 59.0, b: 63.15,
    fondo: (t) => <Rayos2 t={t} c1="#4a0f22" c2="#3a0a1a" cy={760} vel={3} />,
    d: (t) => (
      <>
        {[220, 600, 1320, 1700].map((x, k) => <Marino key={k} i={[1, 3, 4, 2][k]} x={x} y={1420} h={1050} t={t} expr="miedo" mira={k < 2 ? 0.7 : -0.7} flip={k >= 2} />)}
        {[0, 1, 2, 3].map((k) => <Emote key={k} t={t} t0={59.6 + k * 0.3} tipo="sudor" x={[330, 710, 1210, 1590][k]} y={470} s={0.9} />)}
        <Pajitas x={960} y={1010} s={1.7} saca={prog(t, 61.4, 62.2)} />
        <Rot t={t} t0={60.1} text="DRAWING LOTS" x={960} y={130} size={110} color={C.crema} />
        <Rot t={t} t0={62.2} text="WHO GETS EATEN?" x={960} y={250} size={90} color={C.rojo} />
      </>
    ),
  },
  // ── «You are a farm boy from upstate New York, and the farm is not going well.»
  {
    a: 68.7, b: 73.35,
    fondo: () => (
      <>
        <Grad c1="#ffcf7a" c2="#ffe8b8" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(180deg,#b88a4a,#8a6030)" }} />
      </>
    ),
    d: (t) => (
      <>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <circle cx={1650} cy={190} r={110} fill="#fff3b0" />
          {Array.from({ length: 9 }, (_, k) => {
            const seco = prog(t, 71.6 + k * 0.08, 72.3 + k * 0.08), x = 1000 + k * 100;
            return <g key={k} transform={`translate(${x} 800)`}><path d={`M 0 0 Q ${-10 - seco * 40} -80 ${-seco * 90} ${-150 + seco * 110}`} stroke={seco > 0.5 ? "#9a7a3a" : "#5a9a3a"} strokeWidth={10} fill="none" strokeLinecap="round" /><ellipse cx={-seco * 90} cy={-150 + seco * 110} rx={22} ry={12} fill={seco > 0.5 ? "#b89a4a" : "#7ac04a"} /></g>;
          })}
          {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M ${1000 + k * 150} 860 l 40 30 l -20 40 l 50 30`} stroke="#6a4420" strokeWidth={5} fill="none" opacity={prog(t, 71.9, 72.4)} />)}
        </svg>
        <Chico x={560} y={1200} h={1000} t={t} gorro="paja" expr={t < 71.3 ? "neutro" : "triste"} bD={t < 71.3 ? 60 + Math.sin(t * 6) * 20 : 15} cD={70} manoD={t < 71.3 ? <g transform="rotate(30)"><rect x={-6} y={-10} width={12} height={260} fill="#7a4a26" /><rect x={-40} y={240} width={80} height={24} fill="#8a8a9a" /></g> : undefined} />
        {t < 71.3 && Array.from({ length: 6 }, (_, k) => { const u = (((t - 68.7) * 6) / (Math.PI * 2) + k * 0.13) % 1; return <div key={k} style={{ position: "absolute", left: 720 + k * 34 + u * (k - 2.5) * 60, top: 1010 - Math.sin(u * Math.PI) * (120 + (k % 3) * 60), width: 26, height: 20, borderRadius: 10, background: "#7a5228", opacity: 1 - u }} />; })}
        <Chip t={t} t0={69.2} text="1841 · FARM BOY" color={C.tierra} x={960} y={120} centro size={62} />
        <Chip t={t} t0={71.8} text="NOT GOING WELL" color={C.rojo} x={1400} y={300} centro size={64} />
      </>
    ),
  },
  // ── «They had another name for him: a land shark.»
  {
    a: 87.6, b: 90.35,
    fondo: (t) => <Rayos2 t={t} c1="#3a1a5a" c2="#2a1048" cy={600} vel={4} />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 * prog(t, 87.8, 88.6) }}><Tiburon x={1000} y={560} t={t} s={2.6} flip /></div>
        <Persona x={980} y={1420} h={1150} t={t} seed={13} ropa={TIBURON} casco="galera" pantalon="#1a1420" expr={t < 89.1 ? "feliz" : "orgullo"} bD={85} cD={10} flip />
        <Rot t={t} t0={89.15} text="LAND SHARK" x={960} y={150} size={170} color={C.rojo} />
        {t >= 89.3 && <Emote t={t} t0={89.3} tipo="brillos" x={1100} y={420} s={1.1} />}
      </>
    ),
  },
  // ── «a smart young fellow like you could come home with hundreds of dollars»
  {
    a: 95.5, b: 100.1,
    fondo: (t) => <Rayos2 t={t} c1="#f7c548" c2="#e2a92a" cx={600} cy={560} />,
    d: (t) => (
      <>
        <Particulas t={t} tipo="lluviaoro" n={50} seed={9} />
        {Array.from({ length: 9 }, (_, k) => <Vuela key={k} t={t} t0={96.0 + k * 0.28} t1={96.9 + k * 0.28} x0={300 + k * 140} y0={-100} x1={420 + (k % 3) * 120} y1={760 + (k % 2) * 30} arco={-80} giro={540} s={1.1}><Moneda0 r={46} /></Vuela>)}
        <Chico x={600} y={1260} h={1080} t={t} gorro="paja" expr="feliz" bD={130} bI={130} cD={30} cI={30} salta={96.3} />
        <Monto t={t} ks={[[96.6, 0], [97.0, 100], [97.6, 300], [98.3, 500]]} x={1380} y={430} size={190} color={C.lima} suf="?" />
        <Chip t={t} t0={98.3} text="HUNDREDS OF DOLLARS" color={C.violeta} x={1380} y={620} centro size={56} />
      </>
    ),
  },
  // ── «He buys you a train ticket to New Bedford, or a boat ticket to Nantucket.»
  {
    a: 108.3, b: 112.35,
    fondo: (t) => (t < 110.55 ? <><Grad c1="#8ad0f4" c2="#e0f4ff" /><div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#6aa04a" }} /></> : <Mar t={t} y={700} />),
    d: (t) => {
      if (t < 110.55) {
        const x = interpolate(t, [108.3, 110.55], [-200, 1050]);
        return (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              {Array.from({ length: 6 }, (_, k) => { const hx = ((k * 420 - t * 500) % 2520 + 2520) % 2520 - 300; return <path key={k} d={`M ${hx} 820 Q ${hx + 200} ${620 - (k % 2) * 60} ${hx + 400} 820 Z`} fill="#5a9040" />; })}
              <rect x={0} y={860} width={1920} height={14} fill="#5a3418" />{Array.from({ length: 30 }, (_, k) => <rect key={k} x={((k * 70 - t * 900) % 2100 + 2100) % 2100 - 70} y={856} width={20} height={34} fill="#7a4a26" />)}
              <g transform={`translate(${x} 850)`}>
                <rect x={-520} y={-250} width={380} height={230} rx={16} fill="#c8343a" stroke={C.noche} strokeWidth={8} />
                <rect x={-480} y={-220} width={130} height={100} rx={10} fill="#bfe6ff" stroke={C.noche} strokeWidth={6} /><rect x={-320} y={-220} width={130} height={100} rx={10} fill="#bfe6ff" stroke={C.noche} strokeWidth={6} />
                <rect x={-120} y={-200} width={360} height={180} rx={20} fill="#2a2a3a" /><rect x={160} y={-330} width={60} height={140} fill="#2a2a3a" /><rect x={-120} y={-300} width={140} height={110} fill="#3a3a4a" />
                <path d="M 240 -20 L 320 -20 L 240 -110 Z" fill="#c8343a" />
                {[-460, -230, -60, 150].map((wx) => <g key={wx} transform={`translate(${wx} -10) rotate(${t * 720})`}><circle r={42} fill={C.noche} /><line x1={-42} y1={0} x2={42} y2={0} stroke="#888" strokeWidth={6} /></g>)}
                {[0, 1, 2, 3, 4].map((k) => { const u = (t * 1.6 + k / 5) % 1; return <circle key={k} cx={190 - u * 420} cy={-350 - u * 160} r={30 + u * 60} fill="#f4f0e8" opacity={0.8 * (1 - u)} />; })}
              </g>
            </svg>
            <div style={{ position: "absolute", left: x - 480, top: 630, width: 130, height: 100, overflow: "hidden" }}>
              <Chico x={65} y={375} h={380} t={t} gorro="paja" expr="feliz" />
            </div>
            <Chico x={1660} y={1300} h={960} t={t} gorro="paja" expr="feliz" mira={-1} bD={140} cD={20} salta={108.6} manoD={<g transform="rotate(-20)"><rect x={-70} y={-130} width={140} height={80} rx={8} fill="#f4ead2" stroke={C.noche} strokeWidth={5} /><text x={0} y={-80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill={C.rojo}>TICKET</text></g>} />
            <Chip t={t} t0={108.6} text="TRAIN → NEW BEDFORD" color={C.violeta} x={960} y={130} centro size={64} />
          </>
        );
      }
      const x = interpolate(t, [110.55, 112.35], [300, 1100]);
      return (
        <>
          <svg style={{ position: "absolute", left: x, top: 760, overflow: "visible" }} width={1} height={1}>
            <g transform={`rotate(${Math.sin(t * 2.4) * 3})`}>
              <path d="M -360 -60 L 360 -60 L 300 60 L -300 60 Z" fill="#3a2a2a" stroke={C.noche} strokeWidth={8} />
              <rect x={-200} y={-200} width={300} height={140} rx={12} fill="#f4ead2" stroke={C.noche} strokeWidth={6} />
              <rect x={150} y={-300} width={56} height={240} fill="#c8343a" />
              {[0, 1, 2, 3].map((k) => { const u = (t * 1.4 + k / 4) % 1; return <circle key={k} cx={178 - u * 360} cy={-320 - u * 140} r={26 + u * 50} fill="#f4f0e8" opacity={0.8 * (1 - u)} />; })}
            </g>
          </svg>
          <Chico x={1660} y={1300} h={960} t={t} gorro="paja" expr="sorpresa" mira={-1} bD={150} cD={10} bI={40} cI={40} salta={110.7} />
          <Chip t={t} t0={110.6} text="BOAT → NANTUCKET" color={C.teal} tinta={C.noche} x={960} y={130} centro size={64} />
        </>
      );
    },
  },
  // ── «He sells you your sea gear, on credit… all at a nice healthy markup»
  {
    a: 112.4, b: 122.0,
    fondo: (t) => <Rayos2 t={t} c1="#2ec4d6" c2="#22a6b8" cx={600} cy={600} />,
    d: (t) => {
      const cosas: [number, React.ReactNode, string][] = [
        [115.1, <g><rect x={-170} y={-50} width={340} height={100} rx={30} fill="#e8d28a" stroke="#b8983a" strokeWidth={8} />{[-110, -40, 30, 100].map((sx) => <line key={sx} x1={sx} y1={-40} x2={sx + 10} y2={40} stroke="#c8a858" strokeWidth={5} />)}</g>, "MATTRESS"],
        [117.0, <g><circle r={70} fill="#b8bcc8" stroke="#5a5e6a" strokeWidth={8} /><circle r={44} fill="#d8dce6" /></g>, "TIN PLATE"],
        [117.9, <g transform="rotate(-30)"><rect x={-8} y={-90} width={16} height={130} rx={6} fill="#a8acb8" /><ellipse cx={0} cy={60} rx={30} ry={42} fill="#a8acb8" /></g>, "SPOON"],
        [119.1, <g><path d="M -110 -80 L -40 -100 L 40 -100 L 110 -80 L 140 -10 L 90 10 L 80 100 L -80 100 L -90 10 L -140 -10 Z" fill="#7a3a2a" stroke="#4e2218" strokeWidth={8} /></g>, "SHIRTS"],
      ];
      return (
        <>
          {cosas.map(([t0, g], k) => <Vuela key={k} t={t} t0={t0} t1={t0 + 0.55} x0={1500} y0={-150} x1={560 + (k % 2 ? 40 : -30)} y1={760 - k * 70} arco={-60} giro={(k % 2 ? -1 : 1) * 380} s={1}>{g}</Vuela>)}
          <Persona x={560} y={1250} h={1000} t={t} seed={7} ropa={GREEN} rayas="#eaf2ff" pantalon="#2a3a5a" casco="paja" expr={t < 120.4 ? "feliz" : "sorpresa"} bD={75} bI={75} cD={70} cI={70} />
          <div style={{ position: "absolute", left: 1150, top: 240, width: 640, padding: "24px 34px", background: "#f6ecd2", border: "8px solid #5a3418", borderRadius: 14, fontFamily, fontWeight: 700, color: "#2a1530", transform: `scale(${ent(t, 112.8)})`, transformOrigin: "top left", boxShadow: "0 14px 0 rgba(0,0,0,.25)" }}>
            <div style={{ fontSize: 44, textAlign: "center" }}>ON CREDIT</div>
            {cosas.map(([t0, , n], k) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, padding: "8px 0", borderBottom: "3px dashed #c8a878", opacity: t > t0 ? 1 : 0.15 }}><span>{n}</span><span>{["$5", "$2", "$1", "$9"][k]}</span></div>)}
            {t >= 120.6 && <div style={{ fontSize: 40, color: C.rojo, paddingTop: 10, display: "flex", justifyContent: "space-between" }}><span>MARKUP</span><span>+$14</span></div>}
          </div>
          <Monto t={t} ks={[[113.0, 0], [115.2, 5], [117.2, 7], [118.0, 8], [119.2, 17], [120.7, 31]]} x={1470} y={880} size={130} color={t > 120.7 ? C.rojo : C.crema} suf="" />
          <Chip t={t} t0={113.9} text="SEA GEAR" color={C.violeta} x={300} y={120} centro size={62} />
        </>
      );
    },
  },
  // ── «You sign, or you draw your X.»
  {
    a: 131.2, b: 133.95,
    fondo: () => <Grad c1="#e8d4a8" c2="#c8a878" />,
    d: (t) => {
      const u1 = prog(t, 132.6, 132.95), u2 = prog(t, 133.0, 133.35);
      const px = t < 133.0 ? 820 + u1 * 260 : 1080 - u2 * 260, py = t < 133.0 ? 560 + u1 * 240 : 560 + u2 * 240;
      return (
        <>
          <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 1000, background: "#f6ecd2", border: "10px solid #5a3418", fontFamily, fontWeight: 700, color: "#2a1530", padding: 50, transform: `rotate(-2deg)` }}>
            <div style={{ fontSize: 66, textAlign: "center" }}>SHIPPING ARTICLES</div>
            {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ height: 18, background: "#cbb68e", margin: "26px 0", width: `${90 - (k % 3) * 12}%`, borderRadius: 8 }} />)}
            <div style={{ position: "absolute", left: 300, top: 760, width: 600, borderTop: "6px solid #2a1530", fontSize: 34, textAlign: "center", paddingTop: 8 }}>SIGNATURE</div>
          </div>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line x1={820} y1={560} x2={820 + 260 * u1} y2={560 + 240 * u1} stroke="#1a1a3a" strokeWidth={26} strokeLinecap="round" />
            {u2 > 0 && <line x1={1080} y1={560} x2={1080 - 260 * u2} y2={560 + 240 * u2} stroke="#1a1a3a" strokeWidth={26} strokeLinecap="round" />}
            <g transform={`translate(${px} ${py}) rotate(-35)`}><path d="M 0 0 L 30 -60 L 60 -380 Q 120 -480 90 -260 L 40 -50 Z" fill="#fff8ec" stroke="#5a3418" strokeWidth={6} /><path d="M 0 0 L 20 -40 L 36 -36 Z" fill="#1a1a3a" /></g>
          </svg>
          <Sello t={t} t0={133.4} text="HIS MARK" x={1350} y={900} size={80} rot={-10} color="#2b3a8f" />
        </>
      );
    },
  },
  // ── «And just like that, you are a greenhand… someone who has never been to sea»
  {
    a: 134.1, b: 139.95,
    fondo: (t) => <Rayos2 t={t} c1="#4caf50" c2="#3d9442" cy={560} />,
    d: (t) => (
      <>
        <Chico x={960} y={1300} h={1150} t={t} gorro={t > 134.4} expr={t < 136.5 ? "orgullo" : "sorpresa"} bD={t > 138.3 ? 140 : 30} cD={20} salta={134.5} />
        {t < 134.5 && <Vuela t={t} t0={134.1} t1={134.45} x0={960} y0={-200} x1={960} y1={250} arco={0}><path d="M -104 -40 Q -110 -170 0 -174 Q 110 -170 104 -40 Z" fill="#d8343a" transform="scale(1.9)" /></Vuela>}
        <Sello t={t} t0={135.5} text="GREENHAND" x={960} y={170} size={130} rot={-6} color="#2a7a2e" />
        <Chip t={t} t0={138.3} text="= NEVER BEEN TO SEA" color={C.noche} x={1450} y={560} centro size={60} />
      </>
    ),
  },
  // ── «about half of the crew were greenhands… The experienced sailors knew better»
  {
    a: 141.4, b: 148.3,
    fondo: () => <Grad c1="#2d4a8a" c2="#1b2a5a" />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "#7a4a26" }} />
        {Array.from({ length: 8 }, (_, k) => {
          const verde = k % 2 === 1, x = 170 + k * 225;
          return (
            <React.Fragment key={k}>
              {verde && t >= 142.6 && <div style={{ position: "absolute", left: x - 110, top: 380, width: 220, height: 560, borderRadius: 110, background: "rgba(155,225,93,.35)", transform: `scale(${ent(t, 142.6 + k * 0.05)})` }} />}
              {verde ? <Persona x={x} y={920} h={520} t={t} seed={7 + k} ropa={GREEN} rayas="#eaf2ff" pantalon="#2a3a5a" casco="gorro" expr={t > 146 ? "miedo" : "sorpresa"} />
                : <Marino i={k} x={x} y={920} h={540} t={t} expr={t > 145.6 ? "orgullo" : "neutro"} mira={t > 145.6 ? -1 : 0} flip={t > 146.6} camina={t > 146.9 ? 1.2 : 0} />}
            </React.Fragment>
          );
        })}
        <Rot t={t} t0={141.7} t1={145.4} text="HALF THE CREW" x={960} y={140} size={110} />
        <Chip t={t} t0={142.9} t1={145.4} text="GREENHANDS" color="#2a7a2e" x={960} y={280} centro size={64} />
        <Chip t={t} t0={145.9} text="THE OLD HANDS? NEVER AGAIN" color={C.rojo} x={960} y={160} centro size={64} />
      </>
    ),
  },
  // ── «Whalemen did not get a salary. They got a lay… your share, after expenses»
  {
    a: 152.6, b: 159.95,
    fondo: (t) => <Rayos2 t={t} c1="#f7c548" c2="#e8b030" cx={1300} cy={560} />,
    d: (t) => (
      <>
        <Rot t={t} t0={152.8} t1={154.6} text="SALARY" x={1300} y={300} size={130} />
        {t >= 153.4 && t < 154.8 && <div style={{ position: "absolute", left: 1080, top: 290, width: 440, height: 22, background: C.rojo, transform: `rotate(-10deg) scaleX(${prog(t, 153.4, 153.7)})`, transformOrigin: "left" }} />}
        {t >= 154.8 && (
          <svg style={{ position: "absolute", left: 1300, top: 520, overflow: "visible" }} width={1} height={1}>
            <g transform={`scale(${ent(t, 154.9)})`}><circle r={260} fill="#d8a83a" stroke={C.noche} strokeWidth={10} /><path d={`M 0 0 L 0 -260 A 260 260 0 0 1 ${260 * Math.sin(0.25)} ${-260 * Math.cos(0.25)} Z`} fill={C.rojo} stroke="#fff" strokeWidth={5} transform={`translate(${prog(t, 156.4, 156.9) * 60} ${-prog(t, 156.4, 156.9) * 60})`} /></g>
          </svg>
        )}
        <Rot t={t} t0={155.3} text="A LAY = YOUR SHARE" x={1300} y={130} size={90} color={C.crema} />
        <Chip t={t} t0={158.7} text="…AFTER EXPENSES" color={C.rojo} x={1300} y={880} centro size={70} />
        <Chico x={520} y={1260} h={1060} t={t} gorro expr={t < 158.7 ? "feliz" : "sorpresa"} bD={t > 156.4 ? 100 : 30} cD={20} mira={0.6} salta={158.8} />
      </>
    ),
  },
  // ── la escalera del lay: capitán 1/15, primer oficial 1/20, arponero 1/80, vos 1/175… algunos 1/350
  {
    a: 164.4, b: 181.0, z: 0.03,
    fondo: (t) => <Rayos2 t={t} c1="#2d1b69" c2="#3a2484" cy={300} vel={3} />,
    d: (t) => {
      const lupa = prog(t, 175.0, 175.6);
      const col: [number, number, string, number, React.ReactNode][] = [
        [330, 165.2, "CAPTAIN · 1/15", 170, <Persona x={330} y={1000} h={600} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr="orgullo" bD={t >= 165.4 && t < 167 ? 120 : 10} />],
        [760, 167.9, "FIRST MATE · 1/20", 140, <Marino i={4} x={760} y={1000} h={560} t={t} expr="feliz" />],
        [1180, 170.0, "HARPOONER · 1/80", 72, <Marino i={2} x={1180} y={1000} h={560} t={t} expr="neutro" bD={160} cD={10} manoD={<g transform="rotate(180) scale(.6)"><Arpon x={0} y={0} /></g>} />],
        [1600, 173.1, "YOU · 1/175", 10, <Chico x={1600} y={1000} h={470} t={t} expr={t < 174 ? "sorpresa" : t < 178.3 ? "triste" : "miedo"} mira={-0.4} salta={178.4} />],
      ];
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 990, bottom: 0, background: "#1b1240" }} />
          {col.map(([x, t0, txt, r, who], k) => (
            <React.Fragment key={k}>
              {who}
              <svg style={{ position: "absolute", left: x, top: 140, overflow: "visible" }} width={1} height={1}><g transform={`scale(${0.6 * ent(t, t0)})`}><circle r={r} fill={C.oro} stroke={C.noche} strokeWidth={Math.max(3, r / 14)} /><text y={r * 0.3} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={r * 0.9} fill="#8a5a10">{r > 30 ? "$" : ""}</text></g></svg>
              {/* vuelta 5: rol y fracción en dos renglones (en uno solo se pisaban entre columnas) */}
              <Chip t={t} t0={t0} text={txt.split(" · ")[0]} color={k === 3 ? C.rojo : C.violeta} x={x} y={262} centro size={56} />
              <Rot t={t} t0={t0 + 0.15} text={txt.split(" · ")[1]} x={x} y={362} size={66} color={k === 3 ? C.rojo : C.crema} />
            </React.Fragment>
          ))}
          {lupa > 0 && (
            <svg style={{ position: "absolute", left: 1600, top: 200, overflow: "visible" }} width={1} height={1}>
              <g transform={`scale(${lupa})`}><circle r={110} fill="rgba(255,255,255,.16)" stroke="#e8e0d0" strokeWidth={16} /><line x1={78} y1={78} x2={170} y2={170} stroke="#5a3418" strokeWidth={30} strokeLinecap="round" /><circle r={30} fill={C.oro} stroke={C.noche} strokeWidth={4} /></g>
            </svg>
          )}
          <Rot t={t} t0={175.3} t1={178.2} text="1/150 – 1/200" x={960} y={1010} size={80} color={C.crema} />
          <Sello t={t} t0={179.9} text="SOME: 1/350" x={960} y={960} size={76} rot={-6} />
        </>
      );
    },
  },
  // ── «A very good voyage comes home with $50,000… First, the owners take their cut and the costs»
  {
    a: 182.5, b: 191.5,
    fondo: () => <Grad c1="#3d6e8a" c2="#1d3a5a" />,
    d: (t) => {
      const llev = prog(t, 188.6, 189.6), costo = prog(t, 190.0, 190.6);
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, bottom: 0, background: "#7a4a26" }} />
          {Array.from({ length: 12 }, (_, k) => {
            const fx = 700 + (k % 4) * 150, fy = 900 - Math.floor(k / 4) * 150;
            const se = k < 10 ? llev : k < 11 ? costo : 0;
            return <Svg key={k} x={fx + se * 1400} y={fy} s={2.6}><g transform={`scale(${ent(t, 183.0 + k * 0.12)})`}><Barril0 /></g></Svg>;
          })}
          <Monto t={t} ks={[[183.6, 0], [184.9, 50000]]} x={960} y={170} size={170} color={C.oro} />
          <Persona x={interpolate(t, [187.8, 188.6, 189.6], [2200, 1500, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1030} h={760} t={t} seed={21} ropa={CUAQUERO} casco="cuaquero" pantalon="#2a282e" expr="feliz" camina={1.2} flip={t > 188.6} bD={80} />
          <Chip t={t} t0={188.5} text="OWNERS' CUT" color={C.rojo} x={1500} y={330} centro size={64} />
          <Chip t={t} t0={190.0} text="+ COSTS" color={C.rojo} x={1500} y={430} centro size={64} />
          <Chico x={330} y={1100} h={760} t={t} expr={t < 188.4 ? "feliz" : "sorpresa"} mira={0.7} salta={188.7} />
        </>
      );
    },
  },
  // ── «you get your slice… After four years, maybe $200. $50 a year. A farmhand made more, and slept in a bed.»
  {
    a: 192.0, b: 205.3,
    fondo: (t) => (
      <>
        <Rayos2 t={t} c1="#c23a50" c2="#a82e44" cx={560} cy={540} />
        {t >= 201.2 && <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg,#ffd88a,#f0b860)", clipPath: `inset(0 0 0 ${(1 - prog(t, 201.2, 201.5)) * 100}%)` }} />}
      </>
    ),
    d: (t) => (
      <>
        <Chico x={560} y={1290} h={1150} t={t} expr={t < 197.7 ? "neutro" : t < 199.8 ? "sorpresa" : "triste"} bD={90} cD={60} manoD={<g transform="translate(0 -30)">{[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(${(k - 1.5) * 26} ${-k * 12}) scale(${ent(t, 197.9 + k * 0.1)})`}><Moneda0 r={30} /></g>)}</g>} />
        {t < 201.2 && <Monto t={t} ks={[[197.8, 0], [198.2, 200]]} x={1350} y={400} size={220} color={C.oro} />}
        {t < 201.2 && <Rot t={t} t0={193.4} t1={197.6} text="1/175 OF WHAT'S LEFT" x={1350} y={400} size={80} />}
        {t < 201.2 && <Chip t={t} t0={199.8} text="= $50 A YEAR" color={C.noche} x={1350} y={600} centro size={80} />}
        {t >= 201.2 && (
          <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 140, top: 700, width: 700, height: 200, background: "#9a6a3a", borderRadius: 20 }} /><div style={{ position: "absolute", left: 180, top: 620, width: 600, height: 120, background: "#f4f0e8", borderRadius: 40 }} />
            <div style={{ position: "absolute", left: 140, top: 520, width: 60, height: 380, background: "#7a4a26" }} />
            {t < 203.9 ? <Persona x={480} y={1060} h={720} t={t} seed={33} ropa={MARINO(4)} casco="paja" pantalon="#5a4a3a" expr="orgullo" bD={40} />
              : <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, transform: "rotate(-90deg)", transformOrigin: "760px 650px" }}><Persona x={760} y={650} h={600} t={t} seed={33} ropa={MARINO(4)} casco="no" pantalon="#5a4a3a" expr="dormido" /></div>}
            <Chip t={t} t0={201.4} text="FARMHAND: MORE" color="#2a7a2e" x={480} y={130} centro size={60} />
            <Chip t={t} t0={204.0} text="+ A BED" color={C.violeta} x={480} y={240} centro size={60} />
            {t >= 204.2 && <Emote t={t} t0={204.2} tipo="brillos" x={640} y={420} />}
          </div>
        )}
      </>
    ),
  },
  // ── las deducciones: $200 → -$9 (equipo, adelanto, pantalones, tabaco, aguja, slop chest)
  {
    a: 205.4, b: 230.4, z: 0.03,
    fondo: (t) => <Rayos2 t={t} c1="#3a0f2a" c2="#2a0a1e" cx={560} cy={560} vel={3} />,
    d: (t) => {
      const it: [number, string, string, React.ReactNode][] = [
        [212.2, "SEA GEAR + INTEREST", "-$31", <rect x={-120} y={-40} width={240} height={80} rx={26} fill="#e8d28a" stroke="#b8983a" strokeWidth={6} />],
        [216.7, "CASH ADVANCE + INTEREST", "-$40", <g><rect x={-110} y={-60} width={220} height={120} rx={10} fill="#8ac06a" stroke="#3a6a2a" strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#2a5a1a">$</text></g>],
        [219.2, "PANTS", "-$12", <path d="M -70 -90 L 70 -90 L 80 100 L 20 100 L 0 -10 L -20 100 L -80 100 Z" fill="#2a3a5a" stroke={C.noche} strokeWidth={6} />],
        [220.5, "TOBACCO", "-$18", <g><rect x={-80} y={-50} width={160} height={100} rx={12} fill="#7a4a1a" /><rect x={-80} y={-50} width={160} height={30} fill="#c8343a" /></g>],
        [222.1, "NEEDLE & THREAD", "-$4", <g transform="rotate(30)"><rect x={-4} y={-90} width={8} height={180} fill="#c8ccd4" /><circle cx={0} cy={-80} r={10} fill="none" stroke="#5a5e6a" strokeWidth={4} /><path d="M 0 -80 Q 60 -40 20 20 Q -40 80 30 100" stroke={C.rojo} strokeWidth={5} fill="none" /></g>],
      ];
      return (
        <>
          <Rot t={t} t0={205.6} t1={207.6} text="BUT WAIT…" x={960} y={160} size={120} />
          <Rot t={t} t0={208.2} text="DEDUCTIONS" x={1380} y={110} size={110} color={C.rojo} />
          <Monto t={t} ks={[[207.8, 200], [212.3, 169], [216.8, 129], [219.3, 117], [220.6, 99], [222.2, 95], [229.2, -9]]} x={1380} y={300} size={200} color={t > 229.3 ? C.rojo : C.oro} />
          {it.map(([t0, txt, m, g], k) => (
            <React.Fragment key={k}>
              <Vuela t={t} t0={t0 - 0.5} t1={t0} x0={2100} y0={420 + k * 60} x1={720} y1={560} arco={160} giro={-360} s={1.1} queda={false}>{g}</Vuela>
              {t > t0 && <div style={{ position: "absolute", left: 1060, top: 470 + k * 82, fontFamily, fontWeight: 700, fontSize: 46, color: "#fff", transform: `scale(${ent(t, t0)})`, transformOrigin: "left", whiteSpace: "nowrap" }}><span style={{ color: C.rojo }}>{m}</span>  {txt}</div>}
            </React.Fragment>
          ))}
          {t >= 224.6 && (
            <div style={{ position: "absolute", left: 1060, top: 860, transform: `scale(${ent(t, 224.6)})`, transformOrigin: "left", display: "flex", alignItems: "center", gap: 20 }}>
              <svg width={150} height={120} style={{ overflow: "visible" }}><rect x={10} y={30} width={130} height={86} rx={8} fill="#7a4a26" stroke="#3a2010" strokeWidth={6} /><path d={`M 10 30 L 140 30 L ${140 - prog(t, 225.4, 225.8) * 20} ${30 - prog(t, 225.4, 225.8) * 60} L ${10 + prog(t, 225.4, 225.8) * 10} ${30 - prog(t, 225.4, 225.8) * 64} Z`} fill="#8a5a30" stroke="#3a2010" strokeWidth={6} /><rect x={60} y={50} width={30} height={20} fill={C.oro} /></svg>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 54, color: "#fff" }}><span style={{ color: C.rojo }}>-$104</span>  SLOP CHEST</div>
            </div>
          )}
          {t >= 227.7 && <Dice t={t} t0={227.7} text="PRICES THAT MAKE A PIRATE BLUSH" x={1380} y={455} size={44} cola="izq" />}
          <Chico x={560} y={1300} h={1120} t={t} expr={t < 212 ? "neutro" : t < 219 ? "sorpresa" : t < 225 ? "triste" : "miedo"} bD={95 + Math.sin(t * 3) * 10} cD={45} bI={t > 225 ? 150 : 20} cI={t > 225 ? 20 : 30}
            manoD={<g transform="translate(0 -20)">{Array.from({ length: Math.max(0, [212.2, 216.7, 219.2, 220.5, 222.1, 224.6, 229.2].filter((k) => t < k).length) }, (_, k) => <g key={k} transform={`translate(${(k % 2) * 14 - 7} ${-k * 18})`}><Moneda0 r={28} /></g>)}</g>} mira={0.6} salta={229.3}
            inclina={[212.2, 216.7, 219.2, 220.5, 222.1].reduce((m, k) => (t > k && t < k + 0.35 ? -8 * Math.sin(((t - k) / 0.35) * Math.PI) : m), 0)} />
          <Sello t={t} t0={229.2} text="DEDUCTED" x={560} y={900} size={100} rot={-8} />
        </>
      );
    },
  },
  // ── «Very often, Nantucket Quakers. Quiet, deeply religious… did not believe in violence. Against people, anyway.»
  {
    a: 242.7, b: 255.4,
    fondo: () => <Grad c1="#cfc8dc" c2="#9a92b0" />,
    d: (t) => (
      <>
        <Iglesia x={960} y={900} s={1.6} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "#6a6a7a" }} />
        <Persona x={520} y={1180} h={900} t={t} seed={21} ropa={CUAQUERO} casco="cuaquero" pantalon="#2a282e" expr={t < 248 ? "dormido" : t < 252.4 ? "neutro" : "orgullo"} habla={t > 248 && t < 252.4} inclina={t >= 249.6 && t < 252.3 ? Math.sin(t * 7) * 6 : 0} bD={t < 248 ? 45 : t < 252.4 ? 70 + Math.sin(t * 4) * 25 : 150} cD={t < 248 ? 115 : t < 252.4 ? 60 : 10} bI={45} cI={115} mira={t > 252.4 ? 0.6 : 0}
          manoD={t > 253.8 ? <g transform="rotate(180) scale(.7)"><Arpon x={0} y={0} /></g> : undefined} />
        <Persona x={1400} y={1180} h={860} t={t} seed={22} ropa={{ ...CUAQUERO, tunica: "#7a7480", tunica2: "#55505a", pelo: "#8a6a4a" }} casco="cuaquero" pantalon="#2a282e" expr={t < 248 ? "dormido" : t < 252.6 ? "neutro" : "feliz"} inclina={t >= 251.5 && t < 252.6 ? Math.sin(t * 8) * 7 : 0} bD={t >= 249.6 && t < 252.6 ? 120 : 45} cD={t >= 249.6 && t < 252.6 ? 20 : 115} bI={45} cI={115} salta={252.7} flip />
        <Chip t={t} t0={243.8} t1={247.0} text="NANTUCKET QUAKERS" color={C.violeta} x={960} y={110} centro size={66} />
        <Chip t={t} t0={248.0} text="PLAIN GREY" color="#6a6670" x={960} y={250} centro size={54} />
        <Chip t={t} t0={249.6} text="NO WARS" color="#6a6670" x={960} y={350} centro size={54} />
        <Chip t={t} t0={251.5} text="NO VIOLENCE" color="#6a6670" x={960} y={450} centro size={54} />
        <Rot t={t} t0={252.8} text="…AGAINST PEOPLE" x={960} y={90} size={90} color={C.rojo} />
        {t >= 253.9 && <Emote t={t} t0={253.9} tipo="brillos" x={640} y={300} />}
      </>
    ),
  },
  // ── «They would pray on Sunday, and on Monday they would sign your contract at 1/175th.»
  {
    a: 258.2, b: 263.3,
    fondo: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}><Rayos2 t={t} c1="#8ac8f0" c2="#74b4e0" cx={480} cy={520} /></div>
        <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - prog(t, 259.6, 259.95)) * 100}%)` }}><Rayos2 t={t} c1="#e8344a" c2="#c82a3e" cx={480} cy={520} /></div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, height: 1080, background: C.noche }} />
      </>
    ),
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
          <Persona x={480} y={1200} h={950} t={t} seed={21} ropa={CUAQUERO} casco="cuaquero" pantalon="#2a282e" expr="dormido" bD={45} cD={115} bI={45} cI={115} />
          <Rot t={t} t0={258.6} text="SUNDAY" x={480} y={130} size={130} />
        </div>
        {t >= 259.6 && (
          <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <Persona x={480} y={1200} h={950} t={t} seed={21} ropa={CUAQUERO} casco="cuaquero" pantalon="#2a282e" expr="feliz" bD={95} cD={40} flip manoD={<g transform="rotate(-20)"><rect x={-6} y={-150} width={12} height={150} fill="#fff8ec" /></g>} />
            <div style={{ position: "absolute", left: 120, top: 640, width: 320, height: 380, background: "#f6ecd2", border: "6px solid #5a3418", transform: `rotate(6deg) scale(${ent(t, 260.4)})`, fontFamily, fontWeight: 700, fontSize: 30, color: "#2a1530", padding: 20 }}>CONTRACT<div style={{ marginTop: 160, fontSize: 70, color: C.rojo }}>1/175</div></div>
            <Rot t={t} t0={259.8} text="MONDAY" x={480} y={130} size={130} />
          </div>
        )}
      </>
    ),
  },
];
