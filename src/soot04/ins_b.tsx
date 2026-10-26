import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Zzz, fontFamily } from "./kit";
import { Svg, Cachalote, Bote, Splash, Galleta, Rata, Cucaracha, Lampara, Hacha, Lanza, Pala, Tiburon, Humo, Barril0 } from "./kit3";
import { Persona, MARINO, CAPITAN, GREEN } from "./persona";
import { Chico } from "./reparto";
import { Ins, Rayos2, Grad, Mar, Monto, Sello, Dice, Rot, Vuela } from "./insertos";

// 4:30 – 10:00 · el castillo de proa, la comida, la espera, el bote, el fuego y el capitán
const Marino: React.FC<{ i: number; x: number; y: number; h: number; t: number; expr?: any; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; habla?: boolean; mira?: number; miraY?: number; manoD?: React.ReactNode; camina?: number; salta?: number; inclina?: number }> = ({ i, ...p }) => (
  <Persona {...p} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} />
);
// el chico tiznado / gastado: misma ropa, gorro rojo
const Gotas: React.FC<{ t: number; xs: number[]; y0: number; y1: number; seed?: number }> = ({ t, xs, y0, y1, seed = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    {xs.map((x, k) => { const u = ((t * 0.9 + k * 0.37 + seed * 0.11) % 1); return <path key={k} d={`M ${x} ${y0 + u * (y1 - y0)} q 10 18 0 26 q -10 -8 0 -26 Z`} fill="#8ac8f0" opacity={1 - u * 0.6} />; })}
  </svg>
);
// remeros de espaldas: cuerpos que salen de la borda de un bote grande
const Remeros: React.FC<{ t: number; x: number; y: number; n?: number; esp?: number; h?: number; chico?: number; expr?: any; flip?: boolean; fuerza?: number }> = ({ t, x, y, n = 5, esp = 230, h = 460, chico = 2, expr = "miedo", flip, fuerza = 1 }) => (
  <>
    {Array.from({ length: n }, (_, k) => {
      const ph = Math.sin(t * 5.5 + k * 0.3) * fuerza;
      const px = x + (k - (n - 1) / 2) * esp;
      const p = { x: px, y, h, t, bD: 70 + ph * 30, cD: 40 - ph * 20, bI: 70 + ph * 30, cI: 40 - ph * 20, flip, inclina: ph * 6 };
      return k === chico ? <Persona key={k} {...p} seed={7} ropa={GREEN} rayas="#eaf2ff" pantalon="#2a3a5a" casco="gorro" expr={expr} /> : <Marino key={k} i={k + 1} {...p} expr={k % 2 ? "enojado" : expr} />;
    })}
  </>
);
const BordaBote: React.FC<{ x: number; y: number; w: number; t: number }> = ({ x, y, w, t }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y, overflow: "visible" }} width={w} height={300}>
    <path d={`M 0 0 L ${w} 0 L ${w - 120} 230 L 120 230 Z`} fill="#c9a06a" stroke="#5a3418" strokeWidth={10} />
    {[50, 110, 170].map((yy) => <line key={yy} x1={yy * 0.5} y1={yy} x2={w - yy * 0.5} y2={yy} stroke="#a87a46" strokeWidth={6} />)}
    {Array.from({ length: 5 }, (_, k) => { const ph = Math.sin(t * 5.5 + k * 0.3); return <line key={k} x1={w / 2 + (k - 2) * 230 + 40} y1={10} x2={w / 2 + (k - 2) * 230 + 40 - 160 - ph * 70} y2={200 + ph * 30} stroke="#7a4a26" strokeWidth={14} strokeLinecap="round" />; })}
  </svg>
);

export const INS_B: Ins[] = [
  // ── el castillo de proa: 20 hombres, cuchetas, el tamaño de una cocina, sin ventanas, lámpara de grasa, todo mojado
  {
    a: 277.8, b: 294.6, z: 0.04,
    fondo: () => <Grad c1="#3a2414" c2="#1e120a" />,
    d: (t) => (
      <>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 960 -40 L 1940 1080 L -20 1080 Z" fill="#5a3a20" />
          {[0, 1, 2, 3].map((r) => [0, 1].map((lado) => {
            const y = 260 + r * 190, w = 260 + r * 150, x = lado ? 960 + 40 : 960 - 40 - w;
            const k = r * 2 + lado;
            return (
              <g key={`${r}${lado}`} opacity={t > 278.3 + k * 0.12 ? 1 : 0}>
                <rect x={x} y={y} width={w} height={130} fill="#2a180c" stroke="#7a4a26" strokeWidth={10} />
                {[0, 1].map((j) => { const cx = x + (lado ? 70 + j * (w - 140) : w - 70 - j * (w - 140)); return <g key={j}><rect x={cx - 60} y={y + 60} width={120} height={60} rx={20} fill={["#7a3a2a", "#3d6e5a", "#5b4a8a", "#c9a23f"][(k + j) % 4]} /><circle cx={cx + (lado ? -50 : 50)} cy={y + 60} r={34} fill={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0"][(k + j) % 4]} /><path d={`M ${cx + (lado ? -64 : 36)} ${y + 58} l 10 0 M ${cx + (lado ? -44 : 56)} ${y + 58} l 10 0`} stroke="#2a1530" strokeWidth={4} /></g>; })}
              </g>
            );
          }))}
        </svg>
        <Lampara x={960} y={200} t={t} s={1.5} />
        {t >= 278.6 && [0, 1, 2].map((k) => <Zzz key={k} x={[480, 1500, 600][k]} y={[300, 480, 680][k]} t={t + k} />)}
        <Monto t={t} ks={[[278.3, 0], [278.6, 20]]} x={330} y={150} size={100} color={C.crema} pre="" suf=" MEN" />
        <Chip t={t} t0={282.5} t1={290.1} text="SIZE OF A SMALL KITCHEN" color={C.violeta} x={1500} y={190} centro size={52} />
        <Chip t={t} t0={284.6} t1={290.1} text="NO WINDOWS" color={C.rojo} x={1500} y={290} centro size={52} />
        <Chip t={t} t0={287.9} t1={290.1} text="WHALE-OIL LAMP" color={C.ambar} tinta={C.noche} x={1500} y={390} centro size={52} />
        {t >= 289.4 && <Gotas t={t} xs={[300, 520, 760, 1150, 1380, 1620, 860, 1040]} y0={0} y1={1080} />}
        <Marino i={3} x={590} y={1300} h={980} t={t} expr="dormido" flip />
        <Marino i={4} x={1330} y={1300} h={980} t={t} expr="dormido" />
        <Chico x={960} y={1260} h={1000} t={t} expr={t < 290 ? "triste" : "miedo"} bD={15} bI={15} cD={20} cI={20} />
        <Rot t={t} t0={290.3} text="WET. FOR 4 YEARS." x={960} y={230} size={110} color="#8ac8f0" />
      </>
    ),
  },
  // ── «the cockroaches come out, and then the rats come out to eat the cockroaches… the food»
  {
    a: 295.7, b: 300.7,
    fondo: () => <Grad c1="#2a1a10" c2="#4a2e18" />,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "repeating-linear-gradient(90deg,#6a4020 0 180px,#5a3418 180px 186px)" }} />
        {Array.from({ length: 8 }, (_, k) => <Cucaracha key={k} x={interpolate(t, [295.9 + k * 0.15, 300.7], [-100 - k * 60, 2000 - k * 90])} y={880 + (k % 3) * 60} t={t} s={1.4} rot={90} />)}
        {t >= 297.5 && [0, 1, 2].map((k) => <Rata key={k} x={interpolate(t, [297.6 + k * 0.3, 300.7], [-300, 1700 - k * 260])} y={960 + (k % 2) * 40} t={t} s={1.6} />)}
        <Chico x={1500} y={1280} h={980} t={t} expr="miedo" bD={130} bI={130} cD={40} cI={40} salta={297.7} mira={-0.6} />
        <Chip t={t} t0={295.9} text="COCKROACHES" color="#7a3a14" x={420} y={160} centro size={62} />
        <Chip t={t} t0={297.6} text="+ RATS" color="#6a6470" x={420} y={270} centro size={62} />
        <Rot t={t} t0={299.9} text="…AND THE FOOD" x={760} y={420} size={100} color={C.ambar} />
        <Vuela t={t} t0={299.9} t1={300.4} x0={760} y0={-120} x1={760} y1={600} arco={0} giro={200} s={1.6}><g><rect x={-80} y={-80} width={160} height={160} rx={20} fill="#e2b874" stroke="#b5874a" strokeWidth={8} />{[[-40, -40], [0, -40], [40, -40], [-40, 0], [0, 0], [40, 0], [-40, 40], [0, 40], [40, 40]].map(([a, b], k) => <circle key={k} cx={a} cy={b} r={6} fill="#a8783a" />)}</g></Vuela>
      </>
    ),
  },
  // ── «Breakfast is ship's biscuit, called hardtack… so hard sailors soaked it in coffee just to bite it»
  {
    a: 300.8, b: 308.3,
    fondo: (t) => <Rayos2 t={t} c1="#d8a85a" c2="#c8944a" cx={1300} cy={520} />,
    d: (t) => {
      const muerde = t >= 305.2 && t < 305.6;
      return (
        <>
          <Chico x={620} y={1300} h={1150} t={t} expr={t < 305.2 ? "feliz" : t < 306.2 ? "miedo" : "triste"} bD={t < 306.1 ? 110 : 80} cD={t < 306.1 ? 110 : 60}
            manoD={t < 306.1 ? <g transform="translate(0 -20) scale(.9)"><rect x={-90} y={-90} width={180} height={180} rx={22} fill="#e2b874" stroke="#b5874a" strokeWidth={8} />{t >= 305.3 && <path d="M -90 -20 L -20 10 L 10 -40 L 90 20" stroke="#5a3418" strokeWidth={7} fill="none" />}</g> : undefined} inclina={muerde ? -6 : 0} />
          {t >= 305.3 && <Emote t={t} t0={305.3} tipo="susto" x={760} y={240} s={1.3} />}
          <Galleta x={1350} y={520} s={2.4 * ent(t, 301.6)} rot={8} />
          <Rot t={t} t0={302.7} text="HARDTACK" x={1350} y={180} size={130} />
          {muerde && <Rot t={t} t0={305.25} text="CLONK!" x={960} y={360} size={110} color={C.naranja} tiembla />}
          {t >= 306.2 && (
            <svg style={{ position: "absolute", left: 1350, top: 860, overflow: "visible" }} width={1} height={1}>
              <g transform={`scale(${ent(t, 306.2)})`}><path d="M -110 -120 L 110 -120 L 90 60 Q 0 90 -90 60 Z" fill="#f4f0e8" stroke={C.noche} strokeWidth={8} /><ellipse cx={0} cy={-120} rx={110} ry={26} fill="#5a3418" /><path d="M 110 -80 Q 180 -60 100 10" stroke={C.noche} strokeWidth={14} fill="none" />{[0, 1, 2].map((k) => { const u = (t * 0.8 + k / 3) % 1; return <path key={k} d={`M ${-40 + k * 40} ${-150 - u * 120} q 20 -30 0 -60`} stroke="#fff" strokeWidth={8} fill="none" opacity={1 - u} />; })}</g>
            </svg>
          )}
          <Chip t={t} t0={306.3} text="SOAK IT IN COFFEE" color={C.noche} x={1350} y={1010} centro size={54} />
        </>
      );
    },
  },
  // ── «Fresh fruit runs out… their gums bleed, old wounds open up again. That's scurvy.»
  {
    a: 321.5, b: 331.1,
    fondo: () => <Grad c1="#8aa86a" c2="#4a6a3a" />,
    d: (t) => (
      <>
        <svg style={{ position: "absolute", left: 1380, top: 300, overflow: "visible" }} width={1} height={1}>
          <g transform={`scale(${ent(t, 321.7)})`}><circle r={120} fill="#e8a020" /><path d="M 0 -120 Q 20 -170 60 -170" stroke="#3a6a2a" strokeWidth={14} fill="none" />{t >= 322.6 && <line x1={-170} y1={-170} x2={170} y2={170} stroke={C.rojo} strokeWidth={28} strokeLinecap="round" transform={`scale(${prog(t, 322.6, 322.9)})`} />}</g>
        </svg>
        <Chip t={t} t0={321.7} text="NO FRESH FRUIT" color={C.rojo} x={1380} y={500} centro size={54} />
        <Chico x={640} y={1300} h={1150} t={t} expr={t < 326.2 ? "neutro" : "triste"} bD={t > 328.3 ? 60 : 10} cD={t > 328.3 ? 70 : 20} mira={t > 328.3 ? 0.5 : 0} inclina={t > 326 ? 4 : 0} />
        {t >= 327.2 && [0, 1, 2].map((k) => { const u = ((t - 327.2) * 0.8 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 640 - 10 + (k - 1) * 18, top: 470 + u * 120, width: 14, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#c81830", opacity: 1 - u }} />; })}
        {t >= 328.3 && <div style={{ position: "absolute", left: 800, top: 720, width: 90, height: 30, background: "#c81830", borderRadius: 10, transform: `scaleX(${prog(t, 328.4, 329)}) rotate(-20deg)` }} />}
        <Chip t={t} t0={326.1} text="TIRED" color="#4a5a3a" x={1380} y={620} centro size={52} />
        <Chip t={t} t0={327.2} text="GUMS BLEED" color="#a01828" x={1380} y={720} centro size={52} />
        <Chip t={t} t0={328.4} text="OLD WOUNDS OPEN" color="#a01828" x={1380} y={820} centro size={52} />
        <Rot t={t} t0={330.2} text="SCURVY" x={700} y={215} size={170} color={C.lima} />
      </>
    ),
  },
  // ── «Most of the time, nothing happens… top of the mast, two hours at a time… There she blows.»
  {
    a: 333.7, b: 347.7, z: 0.03,
    fondo: (t) => <Mar t={t} y={720} cielo={["#6ab4e8", "#cfeaff"]} />,
    d: (t) => {
      const dia = Math.round(interpolate(t, [335.8, 343.8], [1, 97], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const grita = t > 346.5;
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <rect x={590} y={600} width={36} height={600} fill="#5a3418" />
            {grita && <g transform={`translate(1600 712) scale(${ent(t, 346.6)})`}><path d="M 0 0 Q -30 -90 -10 -140 M 0 0 Q 0 -110 10 -150 M 0 0 Q 30 -90 20 -140" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" /><ellipse cx={0} cy={6} rx={60} ry={14} fill="#2a3a5a" /></g>}
          </svg>
          <Chico x={600} y={940} h={700} t={t} expr={grita ? "sorpresa" : t < 340 ? "neutro" : "triste"} mira={grita ? 1 : Math.sin(t * 0.7) * 0.9} bD={grita ? 150 : 100} cD={grita ? 10 : 120} salta={346.6} />
          <svg style={{ position: "absolute", left: 600, top: 660, overflow: "visible" }} width={1} height={1}><path d="M -170 0 L 170 0 L 140 230 L -140 230 Z" fill="#7a4a26" stroke="#3a2010" strokeWidth={10} />{[60, 130, 200].map((y) => <line key={y} x1={-160 + y * 0.12} y1={y} x2={160 - y * 0.12} y2={y} stroke="#5a3418" strokeWidth={8} />)}</svg>
          {t < 346.4 && <Monto t={t} ks={[[335.8, 1], [337.8, 23], [339.8, 48], [341.8, 71], [343.8, 97]]} x={1360} y={300} size={170} pre="DAY " color={C.crema} />}
          {t < 346.4 && t >= 341.7 && <Chip t={t} t0={341.8} text="2 HOURS ON WATCH" color={C.violeta} x={1360} y={460} centro size={52} />}
          {t < 346.4 && t >= 343.6 && <Chip t={t} t0={343.7} text="EMPTY OCEAN" color={C.teal} tinta={C.noche} x={1360} y={560} centro size={52} />}
          {grita && <Rot t={t} t0={346.6} text="THERE SHE BLOWS!" x={1320} y={260} size={110} color={C.oro} tiembla />}
          {dia > 1 && dia < 97 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 720, background: `rgba(10,10,40,${0.25 * Math.abs(Math.sin(t * 3))})` }} />}
        </>
      );
    },
  },
  // ── el «gam»: los dos barcos se paran, cambian noticias, cartas y tabaco
  {
    a: 352.2, b: 361.6,
    fondo: (t) => <Mar t={t} y={760} cielo={["#ffb88a", "#ffe0c0"]} />,
    d: (t) => {
      const pasa = (t0: number) => prog(t, t0, t0 + 0.6);
      return (
        <>
          <div style={{ position: "absolute", left: -80, top: 700, width: 760, height: 400, background: "#5a3a2a", borderTop: "24px solid #7a4a26", borderRadius: "0 60px 0 0" }} />
          <div style={{ position: "absolute", left: 1240, top: 700, width: 760, height: 400, background: "#2a3a4a", borderTop: "24px solid #4a5a6a", borderRadius: "60px 0 0 0" }} />
          <Marino i={1} x={440} y={1180} h={900} t={t} expr="feliz" bD={95} cD={10} habla={t > 355 && t < 357} />
          <Marino i={4} x={1480} y={1180} h={900} t={t} expr="feliz" bD={95} cD={10} flip habla={t >= 357.4 && t < 358.6} />
          {[[355.6, "NEWS"], [356.6, "LETTERS"], [357.1, "TOBACCO"]].map(([t0, txt], k) => (
            <Vuela key={k} t={t} t0={t0 as number} t1={(t0 as number) + 0.6} x0={k % 2 ? 1300 : 620} y0={520} x1={k % 2 ? 620 : 1300} y1={520} arco={180} giro={0} queda={false}>
              <g><rect x={-90} y={-60} width={180} height={120} rx={12} fill={k === 2 ? "#7a4a1a" : "#f6ecd2"} stroke={C.noche} strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill={k === 2 ? "#fff" : C.noche}>{txt}</text></g>
            </Vuela>
          ))}
          {pasa(355.6) > 0 && <Chip t={t} t0={355.8} text="NEWS · LETTERS · TOBACCO" color={C.violeta} x={960} y={300} centro size={50} />}
          <Rot t={t} t0={358.6} text="A GAM" x={960} y={140} size={170} color={C.crema} />
          <Chip t={t} t0={360.0} text="YOUR ONLY SOCIAL LIFE" color={C.rojo} x={960} y={420} centro size={50} />
        </>
      );
    },
  },
  // ── «how many whales they got… Everybody lies.»
  {
    a: 362.2, b: 367.85,
    fondo: (t) => <Rayos2 t={t} c1="#ff7a3d" c2="#ec6a30" />,
    d: (t) => (
      <>
        <Persona x={480} y={1250} h={820} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr="orgullo" habla={t >= 362.4 && t < 364} bD={40} bI={70} cI={110} />
        <Persona x={1440} y={1250} h={820} t={t} seed={19} ropa={{ ...CAPITAN, tunica: "#3a2a1a", tunica2: "#24180e" }} casco="capitan" barba="#8a8a8a" pantalon="#141a30" expr="orgullo" habla={t >= 364.8 && t < 365.8} flip bD={40} bI={70} cI={110} />
        <Dice t={t} t0={362.8} t1={363.9} text="HOW MANY?" x={820} y={420} size={56} cola="izq" />
        <Dice t={t} t0={364.0} text="40 WHALES!" x={1120} y={420} size={60} cola="der" />
        <Dice t={t} t0={365.4} text="…55!" x={820} y={600} size={60} cola="izq" />
        {t >= 365.4 && [[480, 760], [1440, 760]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x - 60 + (k ? -230 : 230), top: y, fontSize: 90, transform: `scale(${ent(t, 365.6 + k * 0.2)})` }}>🤞</div>)}
        <Rot t={t} t0={366.4} text="EVERYBODY LIES" x={960} y={170} size={110} color={C.crema} />
      </>
    ),
  },
  // ── la ballenera: 30 pies, cedro finito, liviana para volar, finita para romperse
  {
    a: 380.4, b: 389.2,
    fondo: () => (
      <>
        <Grad c1="#1d4a8a" c2="#123a6a" />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.08) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      </>
    ),
    d: (t) => {
      const dib = prog(t, 380.6, 381.8);
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 260 520 Q 960 470 1660 520 Q 1600 700 1360 740 L 560 740 Q 320 700 260 520 Z" fill={`rgba(255,255,255,${0.1 * dib})`} stroke="#fff" strokeWidth={8} strokeDasharray={3400} strokeDashoffset={3400 * (1 - dib)} />
            {Array.from({ length: 6 }, (_, k) => <line key={k} x1={500 + k * 180} y1={540} x2={500 + k * 180} y2={720} stroke="#bfe0ff" strokeWidth={6} opacity={prog(t, 381.6 + k * 0.1, 381.9 + k * 0.1)} />)}
            {Array.from({ length: 6 }, (_, k) => <text key={k} x={500 + k * 180} y={650} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff" opacity={prog(t, 381.8 + k * 0.1, 382.1 + k * 0.1)}>{k + 1}</text>)}
            {t >= 383.1 && <g opacity={prog(t, 383.1, 383.4)}><line x1={260} y1={850} x2={260 + 1400 * prog(t, 383.1, 383.7)} y2={850} stroke={C.oro} strokeWidth={10} /><line x1={260} y1={820} x2={260} y2={880} stroke={C.oro} strokeWidth={10} /><line x1={1660} y1={820} x2={1660} y2={880} stroke={C.oro} strokeWidth={10} opacity={prog(t, 383.6, 383.7)} /></g>}
            {t >= 388.2 && <path d={`M 900 500 L 940 560 L 910 610 L 960 680 L 930 740`} stroke={C.rojo} strokeWidth={10} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - prog(t, 388.3, 388.6))} />}
          </svg>
          <Chico x={1780} y={1300} h={820} t={t} expr={t > 388.2 ? "miedo" : "sorpresa"} mira={-1} bD={t > 386.7 ? 150 : 95} cD={t > 386.7 ? 20 : 0} salta={388.3} />
          <Rot t={t} t0={383.4} text="30 FEET" x={960} y={930} size={110} color={C.oro} />
          <Chip t={t} t0={381.5} text="WHALEBOAT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={66} />
          <Chip t={t} t0={384.6} text="THIN CEDAR" color="#a8783e" x={400} y={330} centro size={52} />
          <Chip t={t} t0={386.7} text="LIGHT → IT FLIES" color={C.lima} tinta={C.noche} x={960} y={330} centro size={52} />
          <Chip t={t} t0={388.2} text="THIN → IT BREAKS" color={C.rojo} x={1520} y={330} centro size={52} />
        </>
      );
    },
  },
  // ── «The rowers sit with their backs to the whale. You cannot see it… only hear breathing.»
  {
    a: 394.8, b: 406.2, z: 0.04,
    fondo: (t) => <Mar t={t} y={560} cielo={["#8ab0d0", "#d0e4f0"]} mar={["#2a6a9a", "#123a5a"]} />,
    d: (t) => {
      const crece = interpolate(t, [395, 405.5], [0.35, 0.9]);
      return (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.9 }}><Cachalote x={1650} y={600} t={t} s={crece} flip chorro={t > 405.2 ? 1 : 0} /></div>
          <Remeros t={t} x={820} y={1080} h={560} esp={250} chico={2} flip expr="miedo" fuerza={1.2} />
          <BordaBote x={820} y={820} w={1500} t={t} />
          <Rot t={t} t0={397.4} t1={400.3} text="BACKS TO THE WHALE" x={760} y={140} size={100} />
          <Sello t={t} t0={400.4} text="DON'T LOOK" x={760} y={210} size={90} rot={-5} />
          <Chip t={t} t0={401.5} text="JUST PULL" color={C.violeta} x={420} y={300} centro size={56} />
          {t >= 405.2 && <Rot t={t} t0={405.3} text="*BREATHING*" x={1500} y={330} size={70} color={C.crema} tiembla />}
        </>
      );
    },
  },
  // ── «15 to 18 meters, more than 40 tons, its head alone is a third of its body… in a wooden canoe»
  {
    a: 406.2, b: 416.6,
    fondo: () => <Grad c1="#1b3a6a" c2="#0e2448" />,
    d: (t) => (
      <>
        <Cachalote x={1060} y={560} t={t} s={1.05} nada={0.4} />
        {t >= 408.1 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={250} y1={800} x2={250 + 1620 * prog(t, 408.1, 408.9)} y2={800} stroke={C.oro} strokeWidth={10} /><line x1={250} y1={770} x2={250} y2={830} stroke={C.oro} strokeWidth={10} /></svg>}
        <Rot t={t} t0={408.6} text="15 – 18 M" x={1060} y={880} size={100} color={C.oro} />
        <Monto t={t} ks={[[410.4, 0], [411.0, 40]]} x={460} y={230} size={120} pre="" suf="+ TONS" color={C.crema} />
        {t >= 412.3 && <div style={{ position: "absolute", left: 1290, top: 300, width: 590, height: 520, border: `10px dashed ${C.rojo}`, borderRadius: 40, transform: `scale(${ent(t, 412.3)})` }} />}
        <Chip t={t} t0={412.4} text="HEAD = 1/3 OF THE BODY" color={C.rojo} x={1500} y={250} centro size={48} />
        <Bote x={420} y={560} t={t} s={0.45 * ent(t, 414.6)} rema={1.4} gente={<>{[-150, -80, -10, 60, 130].map((ox, k) => <circle key={k} cx={ox} cy={-70} r={22} fill="#f2b48a" />)}</>} />
        <Chip t={t} t0={414.8} text="← YOU" color={C.lima} tinta={C.noche} x={520} y={460} size={48} />
        <Chico x={150} y={1060} h={560} t={t} expr={t < 410.4 ? "sorpresa" : "miedo"} mira={1} miraY={-0.3} bD={t > 410.4 ? 160 : 40} bI={t > 410.4 ? 160 : 20} cD={t > 410.4 ? 10 : 40} cI={t > 410.4 ? 10 : 30} salta={410.5} />
      </>
    ),
  },
  // ── la línea: cientos de metros de soga que salen de la tina, la madera humea, un hombre echa agua
  {
    a: 427.3, b: 437.25,
    fondo: () => <Grad c1="#1d4a5a" c2="#0e2a38" />,
    d: (t) => {
      const metros = Math.round(interpolate(t, [428.6, 434.5], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <ellipse cx={560} cy={760} rx={300} ry={90} fill="#5a3418" /><rect x={260} y={520} width={600} height={240} fill="#7a4a26" /><ellipse cx={560} cy={520} rx={300} ry={90} fill="#9a6a3a" />
            {Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx={560} cy={520} rx={250 - k * 40} ry={70 - k * 11} fill="none" stroke="#e8d28a" strokeWidth={14} strokeDasharray="40 30" strokeDashoffset={-t * 900 * (1 + k * 0.1)} />)}
            <path d={`M 560 470 Q 900 ${300 + Math.sin(t * 30) * 20} 1980 ${250 + Math.sin(t * 25) * 15}`} stroke="#e8d28a" strokeWidth={18} fill="none" strokeDasharray="60 20" strokeDashoffset={-t * 2400} />
          </svg>
          {t >= 433.0 && <Humo x={760} y={420} t={t} s={1.6} n={14} col="#e8e4e0" op={0.8} />}
          <Monto t={t} ks={[[428.6, 0], [429.8, 80], [431.0, 160], [432.2, 240], [433.4, 320], [434.5, 400]]} x={1400} y={170} size={150} pre="" suf=" M" color={C.crema} t0={428.6} />
          {metros > 0 && <Chip t={t} t0={429.6} text="HUNDREDS OF METERS OF ROPE" color={C.violeta} x={1400} y={330} centro size={48} />}
          <Rot t={t} t0={433.1} text="THE WOOD SMOKES" x={1450} y={470} size={80} color={C.naranja} tiembla />
          <Marino i={3} x={1150} y={1260} h={700} t={t} expr="miedo" flip bD={t > 434.8 ? 120 : 60} cD={t > 434.8 ? 40 : 90} manoD={<g transform={`rotate(${t > 434.8 ? 120 : 0})`}><path d="M -50 0 L 50 0 L 40 90 L -40 90 Z" fill="#8a8a9a" stroke={C.noche} strokeWidth={6} /></g>} />
          {t >= 434.9 && Array.from({ length: 10 }, (_, k) => { const u = ((t * 2 + k / 10) % 1); return <div key={k} style={{ position: "absolute", left: 980 - u * 260, top: 420 + u * 120 + (k % 3) * 10, width: 22, height: 22, borderRadius: 11, background: "#8ad0ff" }} />; })}
        </>
      );
    },
  },
  // ── «If that line catches your arm or your ankle, it takes you with it, straight down, into the dark»
  {
    a: 437.3, b: 445.1,
    fondo: (t) => <Grad c1={t < 440.4 ? "#2a6a9a" : "#0a1a30"} c2={t < 440.4 ? "#123a5a" : "#02060e"} />,
    d: (t) => {
      const baja = interpolate(t, [440.4, 441.2], [0, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${baja}px)` }}>
            <Chico x={960} y={1010} h={760} t={t} expr="miedo" bD={160} bI={160} cD={10} cI={10} inclina={t > 440.4 ? Math.sin(t * 14) * 10 : 0} />
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
              <ellipse cx={1000} cy={995} rx={50 - prog(t, 439.6, 440.1) * 18} ry={20} fill="none" stroke="#e8d28a" strokeWidth={14} />
              <path d={t > 440.4 ? `M 1000 1010 L ${1000 + Math.sin(t * 9) * 20} 1700` : `M 1040 1000 Q 1400 ${980 + Math.sin(t * 8) * 30} 2000 990`} stroke="#e8d28a" strokeWidth={14} fill="none" />
            </svg>
          </div>
          {t >= 440.4 && Array.from({ length: 16 }, (_, k) => { const u = (t * 2.2 + k / 16) % 1; return <div key={k} style={{ position: "absolute", left: (k * 137) % 1920, top: 1080 - u * 1300, width: 6, height: 140, background: "rgba(200,230,255,.35)" }} />; })}
          <Chip t={t} t0={438.9} t1={440.2} text="YOUR ARM…" color={C.violeta} x={600} y={160} centro size={60} />
          <Chip t={t} t0={439.7} t1={440.2} text="…OR YOUR ANKLE" color={C.rojo} x={1360} y={160} centro size={60} />
          <Rot t={t} t0={441.7} text="STRAIGHT DOWN" x={960} y={300} size={130} color={C.crema} />
          <Chip t={t} t0={443.7} text="AT THE SPEED OF A WHALE" color={C.rojo} x={960} y={460} centro size={58} />
        </>
      );
    },
  },
  // ── «Every boat kept a hatchet ready to cut the line. Sometimes there was not time to use it.»
  {
    a: 445.2, b: 450.1,
    fondo: (t) => <Rayos2 t={t} c1="#5a2a2a" c2="#4a1e1e" />,
    d: (t) => (
      <>
        <Hacha x={960} y={560} s={3.2 * ent(t, 445.6)} rot={interpolate(t, [446.6, 447.1], [-30, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <Chico x={360} y={1290} h={1000} t={t} expr={t < 448 ? "miedo" : "sorpresa"} bD={150} cD={20} bI={150} cI={20} salta={448.9} />
        <Chip t={t} t0={446.1} text="HATCHET: CUT THE LINE" color={C.violeta} x={960} y={150} centro size={62} />
        <Monto t={t} ks={[[448.0, 3], [448.4, 2], [448.8, 1], [449.2, 0]]} x={1560} y={560} size={200} pre="" color={t > 449.2 ? C.rojo : C.crema} />
        <Sello t={t} t0={449.0} text="NO TIME" x={960} y={900} size={110} rot={-6} />
      </>
    ),
  },
  // ── «it drags your little boat behind it at terrifying speed… the Nantucket Sleigh Ride»
  {
    a: 452.5, b: 459.8,
    fondo: (t) => <Mar t={t * 6} y={560} />,
    d: (t) => (
      <>
        {Array.from({ length: 20 }, (_, k) => { const u = (t * 3 + k / 20) % 1; return <div key={k} style={{ position: "absolute", left: 1920 - u * 2400, top: 600 + (k * 53) % 460, width: 240, height: 6, background: "rgba(255,255,255,.55)" }} />; })}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${Math.sin(t * 31) * 8}px, ${Math.cos(t * 27) * 6}px) rotate(-4deg)` }}>
          <Remeros t={t} x={760} y={1060} h={480} esp={210} chico={1} expr="miedo" fuerza={0.2} />
          <BordaBote x={760} y={800} w={1300} t={0} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 1400 780 L 2000 600" stroke="#e8d28a" strokeWidth={14} /></svg>
        </div>
        {[0, 1, 2].map((k) => <Splash key={k} x={1400 + k * 60} y={840} t={t} t0={452.6 + k * 1.2 + Math.floor((t - 452.6) / 3.6) * 3.6} s={1.4} />)}
        <Chip t={t} t0={454.3} text="TERRIFYING SPEED" color={C.rojo} x={960} y={150} centro size={62} />
        <Rot t={t} t0={458.1} text="NANTUCKET SLEIGH RIDE" x={960} y={300} size={110} color={C.crema} />
      </>
    ),
  },
  // ── «the officer kills it with a long lance. The whale spouts blood… Its chimney is on fire.»
  {
    a: 462.5, b: 470.4,
    fondo: (t) => <Mar t={t} y={540} cielo={["#e88a6a", "#ffd0b0"]} mar={["#3a5a7a", "#1a2a4a"]} />,
    d: (t) => {
      const clava = prog(t, 463.4, 463.8);
      return (
        <>
          <Cachalote x={1500} y={620} t={t} s={1.2} flip nada={0.3} chorro={t > 465.2 ? 1 : 0} sangre={t > 465.2 ? 1 : 0} arpones={2} />
          {t >= 465.3 && Array.from({ length: 14 }, (_, k) => { const u = ((t - 465.3) * 1.3 + k / 14) % 1; return <div key={k} style={{ position: "absolute", left: 1180 + Math.sin(k * 2.1) * 80 * u, top: 420 - u * 380, width: 40 - u * 20, height: 40 - u * 20, borderRadius: 20, background: "#c81830", opacity: 1 - u }} />; })}
          <Marino i={0} x={520} y={1250} h={820} t={t} expr="enojado" bD={80 + clava * 20} cD={40 - clava * 30} manoD={<g transform="rotate(-90) scale(1.4)"><Lanza x={0} y={0} /></g>} inclina={clava * 8} />
          <Chip t={t} t0={462.7} t1={468.6} text="EXHAUSTED → THE LANCE" color={C.violeta} x={960} y={130} centro size={60} />
          <Rot t={t} t0={468.9} text="CHIMNEY'S ON FIRE" x={1150} y={200} size={100} color={C.rojo} tiembla />
        </>
      );
    },
  },
  // ── «brings its tail down on top of it like a hammer. The planks explode. The men are thrown into the sea.»
  {
    a: 476.2, b: 483.0,
    fondo: (t) => <Mar t={t} y={760} cielo={["#5a6a8a", "#a8b8d0"]} />,
    d: (t) => {
      const cae = prog(t, 477.0, 478.3);
      return (
        <>
          <svg style={{ position: "absolute", left: 960, top: -500 + cae * 900, overflow: "visible" }} width={1} height={1}>
            <g transform={`rotate(${180 - cae * 10})`}><path d="M -420 0 Q -200 -60 0 -40 Q 200 -60 420 0 Q 200 -10 40 40 L 30 400 L -30 400 L -40 40 Q -200 -10 -420 0 Z" fill="#3a4a6a" stroke={C.noche} strokeWidth={10} /></g>
          </svg>
          {t < 479.0 && <Bote x={960} y={800} t={t} s={1.8} rema={0.3} gente={<>{[-150, -80, -10, 60, 130].map((ox, k) => <circle key={k} cx={ox} cy={-70} r={22} fill="#f2b48a" />)}</>} />}
          {t >= 479.0 && <Splash x={960} y={760} t={t} t0={479.0} s={3} />}
          {t >= 479.0 && Array.from({ length: 6 }, (_, k) => {
            const u = prog(t, 479.0, 481.0), dx = (k - 2.5) * 300, x = 960 + dx * u, y = 700 - Math.sin(u * Math.PI) * (420 + k * 40) + u * 200;
            return <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${(k - 2.5) * 40 * u}deg)`, transformOrigin: `${x}px ${y}px` }}>
              {k === 2 ? <Persona x={x} y={y} h={300} t={t} seed={7} ropa={GREEN} rayas="#eaf2ff" pantalon="#2a3a5a" casco="gorro" expr="miedo" bD={170} bI={170} /> : <Marino i={k} x={x} y={y} h={300} t={t} expr="miedo" bD={160} bI={150} />}
            </div>;
          })}
          {t >= 479.0 && Array.from({ length: 10 }, (_, k) => <Vuela key={k} t={t} t0={479.05} t1={480.6} x0={960} y0={760} x1={960 + (k - 4.5) * 190} y1={860} arco={500 + (k % 3) * 120} giro={400 + k * 50}><rect x={-80} y={-12} width={160} height={24} rx={6} fill="#c9a06a" stroke="#5a3418" strokeWidth={5} /></Vuela>)}
          <Rot t={t} t0={478.2} t1={479.1} text="LIKE A HAMMER" x={960} y={150} size={110} color={C.crema} />
          <Rot t={t} t0={479.3} text="THE PLANKS EXPLODE" x={960} y={960} size={90} color={C.naranja} tiembla />
        </>
      );
    },
  },
  // ── «slice the blubber off in one long spiral strip, like peeling an orange»
  {
    a: 498.2, b: 504.4,
    fondo: (t) => <Rayos2 t={t} c1="#ffb020" c2="#f09a10" />,
    d: (t) => {
      const pela = prog(t, 499.0, 502.0);
      return (
        <>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <g transform={`translate(560 560) scale(${ent(t, 498.4)})`}>
            <circle r={230} fill="#ff8a1a" stroke={C.noche} strokeWidth={10} /><circle r={160} fill="#ffd08a" opacity={pela} />
            <path d="M 0 -230 A 230 230 0 1 1 -1 -230" fill="none" stroke="#e8701a" strokeWidth={60} strokeDasharray={1445} strokeDashoffset={1445 * pela} />
            <path d={`M 0 -230 Q ${120 + pela * 200} ${-300 - pela * 100} ${260 + pela * 260} ${-140 + pela * 300}`} stroke="#e8701a" strokeWidth={46} fill="none" strokeLinecap="round" opacity={pela > 0.05 ? 1 : 0} />
          </g>
          <g transform={`translate(1380 600) scale(${ent(t, 498.8)})`}>
            <path d="M -420 -40 Q -200 -230 120 -220 Q 380 -200 420 -40 Q 420 120 240 160 Q -100 190 -420 40 Z" fill="#3a4a6a" stroke={C.noche} strokeWidth={10} />
            <path d="M -380 -60 Q 0 -260 380 -80" stroke="#f0d0b0" strokeWidth={50} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - pela)} strokeLinecap="round" />
            <path d={`M 380 -80 Q 420 -300 ${260 + pela * 60} -480`} stroke="#f0d0b0" strokeWidth={50} fill="none" strokeLinecap="round" opacity={pela} />
            <line x1={260 + pela * 60} y1={-480} x2={260 + pela * 60} y2={-640} stroke="#5a3418" strokeWidth={10} />
          </g>
          <text x={560} y={940} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill={C.noche} opacity={prog(t, 501.3, 501.6)}>LIKE AN ORANGE…</text>
          <text x={1380} y={940} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill={C.noche} opacity={prog(t, 502.7, 503.0)}>…1 TON A STRIP</text>
        </svg>
        <Marino i={2} x={1000} y={1260} h={620} t={t} expr="enojado" bD={110 + Math.sin(t * 5) * 25} cD={60} manoD={<g transform="rotate(-150) scale(1.1)"><Pala x={0} y={0} /></g>} inclina={Math.sin(t * 5) * 5} />
        </>
      );
    },
  },
  // ── «You are standing on a slippery plank, holding a razor-sharp spade, above a cloud of sharks. Slip, and you join the buffet.»
  {
    a: 513.8, b: 521.0,
    fondo: () => <><Grad c1="#8ab0d0" c2="#c8dcec" /><div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(180deg,#2a7a9a,#0e3a5a)" }} /></>,
    d: (t) => (
      <>
        <div style={{ position: "absolute", left: 1000, top: 700, width: 900, height: 320, borderRadius: "50%", background: "#3a4a6a" }} />
        {Array.from({ length: 6 }, (_, k) => { const a = t * (0.8 + k * 0.1) + k; return <Tiburon key={k} x={1000 + Math.cos(a) * (500 + k * 40)} y={840 + Math.sin(a) * 120} t={t} s={0.55} flip={Math.sin(a) > 0} boca={Math.abs(Math.sin(t * 3 + k))} />; })}
        <div style={{ position: "absolute", left: 120, top: 700, width: 1100, height: 34, background: "#9a6a3a", border: "6px solid #5a3418", transform: `rotate(${Math.sin(t * 2) * 2}deg)`, transformOrigin: "0 50%" }} />
        <Chico x={760} y={704} h={560} t={t} expr="miedo" bD={110} cD={60} inclina={Math.sin(t * 3) * 8} mira={0.8} miraY={1} manoD={<g transform="rotate(-150) scale(1.2)"><Pala x={0} y={0} /></g>} />
        <Chip t={t} t0={514.1} text="SLIPPERY PLANK" color="#7a4a26" x={420} y={200} centro size={56} />
        <Chip t={t} t0={516.2} text="RAZOR-SHARP SPADE" color={C.violeta} x={420} y={300} centro size={56} />
        <Chip t={t} t0={517.8} text="A CLOUD OF SHARKS" color={C.rojo} x={1440} y={560} centro size={56} />
        <Rot t={t} t0={519.1} text="SLIP = BUFFET" x={1400} y={200} size={110} color={C.crema} tiembla />
      </>
    ),
  },
  // ── «the crew builds a brick furnace and lights a fire. Yes, on purpose.»
  {
    a: 523.4, b: 530.2,
    fondo: () => <Grad c1="#1a0e1a" c2="#3a1a14" />,
    d: (t) => {
      const fuego = prog(t, 527.6, 528.4);
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "repeating-linear-gradient(90deg,#7a4a26 0 160px,#5a3418 160px 166px)" }} />
          <svg style={{ position: "absolute", left: 960, top: 860, overflow: "visible" }} width={1} height={1}>
            {Array.from({ length: 24 }, (_, k) => { const r = Math.floor(k / 6), c = k % 6; return <rect key={k} x={-300 + c * 100 + (r % 2) * 50} y={-90 - r * 80} width={96} height={76} fill="#a8443a" stroke="#5a2018" strokeWidth={5} opacity={t > 526.6 + k * 0.03 ? 1 : 0} />; })}
            <rect x={-150} y={-260} width={300} height={170} fill="#1a0a0a" />
            {fuego > 0 && Array.from({ length: 9 }, (_, k) => { const f = Math.sin(t * 12 + k) * 30; return <path key={k} d={`M ${-140 + k * 35} -90 Q ${-150 + k * 35 + f} ${-200 - fuego * 120} ${-120 + k * 35} ${-260 - fuego * (180 + (k % 3) * 60)} Q ${-100 + k * 35} -200 ${-110 + k * 35} -90 Z`} fill={k % 2 ? "#ffb020" : "#ff5a1a"} />; })}
            <ellipse cx={-180} cy={-430} rx={120} ry={60} fill="#3a3a3a" /><ellipse cx={180} cy={-430} rx={120} ry={60} fill="#3a3a3a" />
          </svg>
          {fuego > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 960px 640px, rgba(255,150,40,${0.35 * fuego}), transparent 55%)` }} />}
          <Marino i={1} x={380} y={1240} h={760} t={t} expr="neutro" bD={60} />
          <Marino i={5} x={1560} y={1240} h={760} t={t} expr="feliz" flip bD={110} />
          <Chip t={t} t0={523.6} text="WOODEN SHIP · FULL OF OIL" color={C.violeta} x={960} y={130} centro size={54} />
          <Chip t={t} t0={526.7} text="BRICK FURNACE" color="#a8443a" x={960} y={230} centro size={54} />
          <Rot t={t} t0={529.4} text="ON PURPOSE." x={960} y={380} size={140} color={C.oro} />
        </>
      );
    },
  },
  // ── «The smoke is black, greasy… It gets into your hair, your skin, your bunk, your hardtack. You could smell a whaling ship before you could see it.»
  {
    a: 544.2, b: 557.0,
    fondo: () => <Grad c1="#4a4044" c2="#26201e" />,
    d: (t) => (
      <>
        <Humo x={1500} y={1000} t={t} s={3} n={18} col="#141010" op={0.85} viento={-1} />
        <Chico x={640} y={1300} h={1150} t={t} expr={t < 549 ? "triste" : "enojado"} bD={t > 553.4 ? 140 : 20} cD={t > 553.4 ? 150 : 30} />
        {t >= 545.5 && [[560, 420], [720, 470], [600, 560], [680, 380]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: 70, height: 40, borderRadius: "50%", background: "rgba(20,16,16,.55)", transform: `scale(${ent(t, 545.6 + k * 0.4)})` }} />)}
        <Chip t={t} t0={544.4} text="BLACK, GREASY SMOKE" color="#2a2224" x={1400} y={150} centro size={56} />
        <Chip t={t} t0={546.7} text="BURNING MEAT + WET DOG" color={C.tierra} x={1400} y={250} centro size={52} />
        {["HAIR", "SKIN", "BUNK", "HARDTACK"].map((w, k) => <Chip key={w} t={t} t0={[550.0, 550.7, 551.6, 552.3][k]} text={w} color="#3a3034" x={1180 + (k % 2) * 380} y={440 + Math.floor(k / 2) * 110} centro size={54} />)}
        <Rot t={t} t0={553.6} text="SMELL IT BEFORE YOU SEE IT" x={1280} y={800} size={74} color={C.crema} />
      </>
    ),
  },
  // ── «A sperm whale's head holds… spermaceti, the finest candle wax… a man climbed right inside the head and scooped, with a bucket»
  {
    a: 557.2, b: 569.6,
    fondo: () => <Grad c1="#1b2a5a" c2="#0e1636" />,
    d: (t) => {
      const brilla = prog(t, 560.6, 561.4);
      return (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 160 300 Q 160 180 420 170 L 1400 170 Q 1820 200 1820 520 Q 1800 900 1300 920 L 420 920 Q 160 900 160 700 Z" fill="#3a4a6a" stroke={C.noche} strokeWidth={12} />
            <path d="M 300 300 Q 300 240 460 240 L 1300 240 Q 1600 260 1600 470 L 1600 560 Q 1500 620 1300 620 L 460 620 Q 300 620 300 540 Z" fill={`rgb(${200 + brilla * 55},${180 + brilla * 60},${100 + brilla * 60})`} stroke="#8a7030" strokeWidth={8} />
            {brilla > 0 && <path d="M 300 300 Q 300 240 460 240 L 1300 240 Q 1600 260 1600 470 L 1600 560 Q 1500 620 1300 620 L 460 620 Q 300 620 300 540 Z" fill="#fff6c8" opacity={0.25 + 0.15 * Math.sin(t * 6)} />}
            <path d="M 300 700 Q 900 760 1500 700" stroke="#2a3450" strokeWidth={10} fill="none" />
          </svg>
          {t < 565.2 && <Marino i={5} x={250} y={1300} h={980} t={t} expr={t < 560.6 ? "neutro" : "sorpresa"} mira={1} miraY={-0.4} salta={560.7} bD={t > 560.6 ? 120 : 60} cD={t > 560.6 ? 10 : 100} manoD={<path d="M -50 0 L 50 0 L 40 90 L -40 90 Z" fill="#8a8a9a" stroke={C.noche} strokeWidth={6} />} />}
          <Chip t={t} t0={557.6} t1={560.8} text="THE HEAD" color={C.violeta} x={960} y={90} centro size={56} />
          <Rot t={t} t0={561.0} text="SPERMACETI" x={960} y={130} size={110} color={C.crema} />
          <Chip t={t} t0={562.1} t1={565.7} text="THE FINEST CANDLE WAX" color={C.ambar} tinta={C.noche} x={960} y={1000} centro size={50} />
          {t >= 565.2 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "polygon(300px 240px, 1600px 240px, 1600px 620px, 300px 620px)" }}>
              <Marino i={2} x={interpolate(t, [565.3, 566.6], [1700, 1300], { extrapolateRight: "clamp" })} y={interpolate(t, [565.3, 566.6], [500, 760], { extrapolateRight: "clamp" })} h={600} t={t} expr="feliz" flip bD={t > 567.6 ? interpolate(Math.sin(t * 6), [-1, 1], [40, 140]) : 70} manoD={<path d="M -50 0 L 50 0 L 40 90 L -40 90 Z" fill="#8a8a9a" stroke={C.noche} strokeWidth={6} />} />
            </div>
          )}
          <Chip t={t} t0={565.9} text="A MAN CLIMBS INSIDE" color={C.rojo} x={1300} y={1000} centro size={54} />
          <Chip t={t} t0={567.7} text="+ A BUCKET" color={C.teal} tinta={C.noche} x={500} y={1000} centro size={54} />
        </>
      );
    },
  },
  // ── «there is the captain, and the captain is the law. Strict but fair… a tyrant on an island that floats»
  {
    a: 584.9, b: 594.4,
    fondo: (t) => <Rayos2 t={t} c1="#1d2a52" c2="#141e3e" cx={620} cy={540} />,
    d: (t) => {
      const aguja = interpolate(t, [588.5, 590.4, 592.4, 593.4], [-60, -30, 60, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          <Persona x={620} y={1300} h={1150} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr={t < 591.2 ? "orgullo" : "enojado"} bD={t > 591.2 ? 140 : 40} cD={t > 591.2 ? 60 : 20}
            manoD={t > 591.2 ? <path d={`M 0 0 Q ${60 + Math.sin(t * 9) * 60} -120 ${40 + Math.sin(t * 9) * 140} -300`} stroke="#3a2010" strokeWidth={12} fill="none" strokeLinecap="round" /> : undefined} />
          <Rot t={t} t0={586.8} text="THE LAW" x={1380} y={150} size={150} color={C.crema} />
          <svg style={{ position: "absolute", left: 1380, top: 720, overflow: "visible" }} width={1} height={1}>
            <g transform={`scale(${ent(t, 588.3)})`}>
              <path d="M -320 0 A 320 320 0 0 1 320 0" fill="none" stroke="#2ec4d6" strokeWidth={60} strokeDasharray="502 600" />
              <path d="M -320 0 A 320 320 0 0 1 320 0" fill="none" stroke={C.rojo} strokeWidth={60} strokeDasharray="0 502 502" />
              <g transform={`rotate(${aguja})`}><path d="M -16 0 L 0 -290 L 16 0 Z" fill={C.crema} /><circle r={30} fill={C.crema} /></g>
              <text x={-300} y={70} fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#2ec4d6">STRICT</text>
              <text x={140} y={70} fontFamily={fontFamily} fontWeight={700} fontSize={46} fill={C.rojo}>TYRANT</text>
            </g>
          </svg>
        </>
      );
    },
  },
  // ── «Flogging… was outlawed on American ships in 1850. Some whaling captains did not get the message.»
  {
    a: 594.5, b: 602.6,
    fondo: () => <Grad c1="#2a2440" c2="#14102a" />,
    d: (t) => {
      const rompe = prog(t, 600.8, 601.4);
      return (
        <>
          <div style={{ position: "absolute", left: 1000, top: 170, width: 720, height: 760, transform: `rotate(${3 + rompe * 30}deg) translate(${rompe * 400}px, ${rompe * 500}px)`, background: "#f6ecd2", border: "10px solid #5a3418", fontFamily, fontWeight: 700, color: "#2a1530", padding: 40, opacity: 1 - rompe * 0.6 }}>
            <div style={{ fontSize: 56, textAlign: "center" }}>ACT OF CONGRESS</div>
            <div style={{ fontSize: 40, textAlign: "center", color: "#8a5a3a", margin: "20px 0" }}>SEPT. 28, 1850</div>
            {Array.from({ length: 4 }, (_, k) => <div key={k} style={{ height: 16, background: "#cbb68e", margin: "24px 0", width: `${90 - (k % 2) * 20}%` }} />)}
            <div style={{ fontSize: 56, textAlign: "center", marginTop: 40 }}>FLOGGING: <span style={{ color: C.rojo }}>ABOLISHED</span></div>
          </div>
          <Sello t={t} t0={597.8} text="OUTLAWED 1850" x={1360} y={820} size={80} rot={-8} />
          <Persona x={520} y={1300} h={950} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr={t < 600.6 ? "neutro" : "orgullo"} bD={t >= 600.6 && t < 601.6 ? 120 : 40} bI={t > 601.6 ? 110 : 30} cI={t > 601.6 ? 100 : 20} cD={30} />
          <Chip t={t} t0={594.8} text="FLOGGING = WHIPPING A MAN TIED UP" color={C.violeta} x={960} y={110} centro size={44} />
          <Rot t={t} t0={601.0} text="DIDN'T GET THE MESSAGE" x={1250} y={990} size={80} color={C.rojo} />
        </>
      );
    },
  },
];
