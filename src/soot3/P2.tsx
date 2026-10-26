import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, Pergamino, Pluma, Pan, Mesa, Particulas, Rayos, Frente, Emote, cabeza } from "./kit";
import { Gladius, Escudo, Poste, Pilum, Armadura, Mula, Comida, Soldadito, Craneo, Trampas, Calor } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Ruta, Valle, Campo, Tablero, pose } from "./kit3";

// Parte 2 (163,26-253,76 s): trampa 2, el entrenamiento.
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
const Olas: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    {[0, 1, 2, 3].map((i) => {
      const yy = y + i * 70;
      const d = Array.from({ length: 26 }, (_, k) => `${k ? "L" : "M"} ${k * 80 - 40} ${yy + Math.sin(k * 0.8 + t * (2 + i * 0.4) + i) * 18}`).join(" ") + ` L 1960 1080 L -40 1080 Z`;
      return <path key={i} d={d} fill={["#4fb0d8", "#2f86b0", "#1f6a94", "#155078"][i]} opacity={0.92} />;
    })}
  </svg>
);
// caballo de madera para el salto (los romanos practicaban sobre uno): cuerpo de barril, cuello, cabeza con orejas y crin
const CaballoMadera: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 300 * s, top: y - 460 * s, overflow: "visible" }} width={600 * s} height={460 * s} viewBox="-300 -460 600 460">
    {[-200, -150, 150, 200].map((xx, i) => <rect key={i} x={xx - 16} y={-150} width={32} height={150} rx={6} fill="#7a4a1a" transform={`rotate(${i < 2 ? 8 : -8} ${xx} -150)`} />)}
    <path d="M -240 -200 Q -300 -170 -290 -90 Q -270 -120 -250 -150 Z" fill="#5a3418" />
    <rect x={-250} y={-240} width={500} height={110} rx={55} fill="#a8783a" />
    <rect x={-240} y={-236} width={480} height={30} rx={15} fill="#c9a46a" />
    <path d="M 170 -230 Q 200 -330 250 -380 L 320 -350 Q 270 -300 250 -200 Z" fill="#a8783a" />
    <path d="M 186 -250 Q 206 -330 250 -380" stroke="#5a3418" strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray="14 10" />
    <ellipse cx={310} cy={-370} rx={78} ry={44} fill="#a8783a" transform="rotate(28 310 -370)" />
    <ellipse cx={360} cy={-340} rx={30} ry={24} fill="#8a5a2a" transform="rotate(28 360 -340)" />
    <path d="M 270 -410 L 262 -460 L 296 -420 Z" fill="#8a5a2a" />
    <circle cx={306} cy={-388} r={9} fill="#2a1a10" />
    <path d="M -70 -246 Q 0 -280 70 -246 L 60 -220 L -60 -220 Z" fill={C.rojo} />
    {[-90, 0, 90].map((xx) => <circle key={xx} cx={xx} cy={-186} r={8} fill="#5a3418" />)}
  </svg>
);
const Hito: React.FC<{ x: number; y: number; n: string }> = ({ x, y, n }) => (
  <div style={{ position: "absolute", left: x - 55, top: y - 160, width: 110, height: 160, background: "#e8d8b8", borderRadius: "55px 55px 8px 8px", boxShadow: "inset -16px 0 0 #c9b48a, 8px 10px 0 rgba(20,8,30,.3)", fontFamily, fontWeight: 700, fontSize: 40, color: "#7a3d14", textAlign: "center", paddingTop: 34 }}>{n}</div>
);

export const P2: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 044a · trampa número dos: el entrenamiento */}
    <Escena t={t} t0={163.26} t1={166.0} entra="corte" golpes={[163.48, 164.6]}>
      <Tablero t={t} t0={162.9} en={1} de={0} tAvanza={163.4} marca={164.4} hecho={1} />
      <Chip t={t} t0={163.48} text="TRAP 2 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={164.6} text="THE TRAINING" x={900} y={400} size={130} />
    </Escena>

    {/* 044b · cuatro meses sos un tiro, un recluta, y tu trabajo es sufrir */}
    <Escena t={t} t0={166.0} t1={170.56} zoom={0.05} entra="barrido" golpes={[167.16, 169.68]}>
      <Campamento t={t} dx={(t - 166) * 30} />
      <Calor t={t} y={620} op={0.25} />
      {/* calendario de 4 meses clavado en la torre, se tacha solo */}
      <div style={{ position: "absolute", left: 1180, top: 760, display: "flex", gap: 10 }}>{Array.from({ length: 4 }, (_, i) => <div key={i} style={{ width: 70, height: 84, background: "#fff8ec", borderTop: `16px solid ${C.rojo}`, borderRadius: 8, fontFamily, fontWeight: 700, fontSize: 40, color: C.noche, textAlign: "center", lineHeight: "64px", position: "relative" }}>{i + 1}{t > 167.4 + i * 0.6 && <div style={{ position: "absolute", inset: 0, fontSize: 70, color: C.rojo, lineHeight: "70px" }}>✕</div>}</div>)}</div>
      <Persona x={760} y={1020} h={680} t={t} seed={1} casco="legion" expr={t > 169.68 ? "triste" : t > 167.16 ? "miedo" : "neutro"} inclina={t > 169.68 ? 6 : 0} camina={t > 169.68 ? 0.6 : 0} />
      <Emote t={t} t0={169.8} tipo="sudor" {...L(760, 1020, 680)} s={1.2} />
      <Emote t={t} t0={170.0} tipo="lagrimas" {...L(760, 1020, 680)} s={1.2} />
      <Cuenta t={t} t0={165.9} t1={166.6} de={0} a={4} x={1450} y={420} size={240} color={C.oro} />
      <Chip t={t} t0={166.1} text="MONTHS" color={C.violeta} x={1360} y={590} size={58} />
      <Chip t={t} t0={167.16} text="TYRO = RECRUIT" color={C.teal} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={169.68} text="NEW JOB: SUFFER" color={C.rojo} x={960} y={960} centro size={70} />
      <Particulas t={t} tipo="polvo" n={30} seed={61} />
    </Escena>

    {/* 045 · dos veces por día, espada de madera y escudo de mimbre */}
    <Escena t={t} t0={170.56} t1={174.1} entra="iris" ix={960} iy={540} golpes={[172.3, 173.24]}>
      <Campamento t={t} hora={t < 172.3 ? "dia" : "noche"} tropa={false} />
      <Persona x={960} y={1030} h={600} t={t} seed={1} casco="legion" expr="orgullo" {...pose("golpear", t, 1.4)} />
      <Gladius madera x={640} y={600} s={1.4} t={t} t0={172.06} rot={-20} />
      <Escudo mimbre x={1280} y={600} s={1.4} t={t} t0={173.12} rot={8} />
      <Chip t={t} t0={170.92} text="TWICE A DAY" color={C.ambar} tinta={C.noche} x={960} y={110} centro size={64} />
      <Chip t={t} t0={172.3} text="WOODEN SWORD" color={C.tierra} x={640} y={930} centro size={52} />
      <Chip t={t} t0={173.24} text="WICKER SHIELD" color={C.tierra} x={1280} y={930} centro size={52} />
    </Escena>

    {/* 046 · y pesan el doble que los de verdad */}
    <Escena t={t} t0={174.1} t1={178.3} zoom={0.05} entra="sube" golpes={[176.22]}>
      <Campamento t={t} tropa={false} />
      {(() => {
        const h = 780, y = 1040, x = 960, peso = prog(t, 176.22, 176.7);
        return <>
          <Persona x={x} y={y + peso * 30} h={h} t={t} seed={1} casco="legion" expr={peso > 0.5 ? "miedo" : "orgullo"} bD={interpolate(peso, [0, 1], [80, 25])} cD={50} bI={interpolate(peso, [0, 1], [70, 20])} cI={40} inclina={peso * 4} />
          <Gladius madera x={x + 250} y={y - 400 + peso * 200} s={0.9} rot={-30 + peso * 50} />
          <Escudo mimbre x={x - 250} y={y - 360 + peso * 180} s={0.9} rot={-4} />
          <Emote t={t} t0={176.4} tipo="sudor" {...L(x, y, h)} s={1.6} />
        </>;
      })()}
      <Chip t={t} t0={174.3} text="THE CATCH" color={C.violeta} x={160} y={140} size={60} />
      <Grande t={t} t0={176.22} text="2× HEAVIER" y={170} size={150} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={177.3} text="THAN THE REAL THING" color={C.rojo} x={960} y={300} centro size={52} />
    </Escena>

    {/* 047-048 · pegarle al poste: cabeza, rodillas, costillas, hasta que los brazos no responden */}
    <Escena t={t} t0={178.3} t1={185.14} zoom={0.04} entra="corte" golpes={[178.84, 179.28, 179.92, 181.06, 181.74, 182.56]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Poste x={1180} y={640} s={1.2} />
      <Cuenta t={t} t0={178.4} t1={185.0} de={1} a={1247} x={1600} y={150} size={90} color="#fff" pre="HITS " />
      {(() => {
        const golpes = [178.84, 179.28, 179.92, 181.06, 181.74, 182.56];
        const ult = golpes.filter((g) => t >= g).pop() ?? 0;
        const sw = ult ? Math.exp(-(t - ult) * 9) : 0;
        const cansado = prog(t, 183.3, 184.2);
        const h = 700, x = 760, y = 1030;
        const blanco = t >= 182.56 ? 470 : t >= 181.74 ? 720 : 300;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={cansado > 0.3 ? "triste" : "enojado"} bD={interpolate(cansado, [0, 1], [110 - sw * 80, 10])} cD={interpolate(cansado, [0, 1], [30, 0])} inclina={cansado * 8} />
          <Gladius madera x={x + 330 - cansado * 160} y={interpolate(cansado, [0, 1], [blanco + sw * 60, 880])} s={0.9} rot={interpolate(cansado, [0, 1], [70 - sw * 60, 170])} />
          {ult > 0 && t - ult < 0.3 && <svg style={{ position: "absolute", left: 1060, top: blanco - 100 }} width={240} height={200}>{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, r = 30 + (t - ult) * 300; return <line key={i} x1={120 + Math.cos(a) * r * 0.5} y1={100 + Math.sin(a) * r * 0.5} x2={120 + Math.cos(a) * r} y2={100 + Math.sin(a) * r} stroke="#fff3a0" strokeWidth={8} strokeLinecap="round" />; })}</svg>}
          <Emote t={t} t0={183.6} tipo="sudor" {...L(x, y, h)} s={1.2} />
        </>;
      })()}
      <Chip t={t} t0={179.28} text="AGAIN" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} t1={179.9} />
      <Chip t={t} t0={179.92} text="AND AGAIN" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} t1={180.9} />
      <Chip t={t} t0={181.06} text="HEAD" color={C.rojo} x={1400} y={300} size={54} />
      <Chip t={t} t0={181.74} text="KNEES" color={C.rojo} x={1400} y={700} size={54} />
      <Chip t={t} t0={182.56} text="RIBS" color={C.rojo} x={1400} y={470} size={54} />
      <Chip t={t} t0={183.6} text="ARMS STOP ANSWERING" color={C.violeta} x={960} y={980} centro size={56} />
    </Escena>

    {/* 049 · aprender a nadar, con armadura si hace falta */}
    <Escena t={t} t0={185.14} t1={188.08} entra="sube" banda={C.teal} golpes={[186.52]}>
      <Cielo tipo="dia" />
      <Astro x={1600} y={200} r={80} />
      {(() => {
        const hund = prog(t, 186.52, 187.5);
        const by = 640 + Math.sin(t * 3) * 14 + hund * 160;
        return <>
          <Persona x={900} y={by + 600} h={900} t={t} seed={1} casco="legion" expr={t > 186.52 ? "miedo" : "neutro"} bD={150 + Math.sin(t * 8) * 25} bI={150 + Math.cos(t * 8) * 25} cD={20} cI={20} />
          <Emote t={t} t0={186.6} tipo="susto" {...L(900, by + 600, 900)} s={1.2} />
        </>;
      })()}
      <Olas t={t} y={690} />
      <Armadura x={1500} y={560} s={0.9} t={t} t0={186.52} rot={10} />
      <Chip t={t} t0={185.72} text="SWIM" color={C.teal} tinta={C.noche} x={160} y={140} size={64} />
      <Chip t={t} t0={186.52} text="IN ARMOR" color={C.rojo} x={1380} y={300} size={64} />
    </Escena>

    {/* 050 · saltar al caballo por los dos lados, espada en mano */}
    <Escena t={t} t0={188.08} t1={192.54} zoom={0.04} entra="barrido" golpes={[188.52, 189.92, 191.26]}>
      <Campamento t={t} tropa={false} />
      <CaballoMadera x={960} y={940} s={1.3} />
      {(() => {
        const lado = t < 189.92 ? -1 : 1;
        const t0 = t < 189.92 ? 188.52 : 189.92;
        const k = prog(t, t0, t0 + 0.6);
        const arco = Math.sin(Math.min(1, k) * Math.PI);
        const x = 960 + lado * interpolate(k, [0, 1], [460, 40]);
        const y = 990 - arco * 280 - (k > 0.9 ? 180 : 0);
        return <>
          <Persona x={x} y={y} h={460} t={t} seed={1} casco="legion" expr={arco > 0.2 ? "sorpresa" : "orgullo"} flip={lado > 0} bD={t > 191.26 ? 150 : 90} cD={20} />
          {t > 191.26 && <Gladius x={x + (lado > 0 ? -120 : 120)} y={y - 520} s={0.6} rot={lado > 0 ? 20 : -20} t={t} t0={191.26} />}
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={30} seed={64} />
      <Chip t={t} t0={188.52} text="VAULT" color={C.ambar} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={190.2} text="BOTH SIDES" color={C.violeta} x={960} y={140} centro size={60} />
      <Chip t={t} t0={191.26} text="SWORD IN HAND" color={C.rojo} x={1500} y={260} size={56} />
    </Escena>

    {/* 051 · el pilum, jabalina pesada con cuello largo de hierro */}
    <Escena t={t} t0={192.54} t1={196.5} zoom={0.05} entra="diag" golpes={[193.38, 195.4]}>
      <Campamento t={t} tropa={false} />
      <Persona x={330} y={1030} h={620} t={t} seed={1} casco="legion" expr="orgullo" {...(t < 192.9 ? { bD: 160, cD: 20, bI: 50, cI: 30, inclina: -6 } : pose("lanzar", 0.9))} />
      {t > 192.9 && <Pilum x={interpolate(prog(t, 192.9, 193.5), [0, 1], [420, 960])} y={interpolate(prog(t, 192.9, 193.5), [0, 1], [420, 500])} s={1.6} rot={-6} />}
      {t > 195.4 && <div style={{ position: "absolute", left: 1150, top: 380, width: 520, height: 240, borderRadius: 120, border: `10px solid ${C.ambar}`, transform: `scale(${ent(t, 195.4)})` }} />}
      <Chip t={t} t0={193.38} text="PILUM" color={C.rojo} x={160} y={140} size={72} />
      <Chip t={t} t0={194.08} text="HEAVY JAVELIN" color={C.violeta} x={160} y={260} size={56} />
      <Chip t={t} t0={195.4} text="LONG IRON NECK" color={C.ambar} tinta={C.noche} x={1180} y={700} size={56} />
    </Escena>

    {/* 052 · se dobla al pegar, para que no te la devuelvan */}
    <Escena t={t} t0={196.5} t1={200.56} zoom={0.04} entra="corte" golpes={[197.46, 198.78]}>
      <Valle t={t} />
      <Persona x={230} y={1030} h={560} t={t} seed={1} casco="legion" expr="enojado" {...pose("lanzar", Math.min(0.75, Math.max(0, (t - 196.2) * 1.2)))} />
      {(() => {
        const vuela = prog(t, 196.6, 197.46);
        const dob = t > 197.46 ? Math.min(1, (t - 197.46) * 4) : 0;
        return <>
          <Soldadito x={1400} y={900} s={2.4} t={t} seed={3} enemigo />
          <Escudo x={1240} y={600} s={1} rot={-8} color="#5a3418" />
          {dob === 0
            ? <Pilum x={interpolate(vuela, [0, 1], [300, 1000])} y={interpolate(vuela, [0, 1], [420, 560])} s={1} rot={14} />
            : <Pilum x={1010} y={580} s={1} rot={14} dobla={dob} />}
          <Emote t={t} t0={198.48} tipo="preg" x={1400} y={500} s={1.3} />
          <Emote t={t} t0={197.5} tipo="enojo" x={1400} y={520} s={1.2} />
        </>;
      })()}
      <Chip t={t} t0={196.86} text="BENDS ON IMPACT" color={C.rojo} x={700} y={190} size={60} />
      <Chip t={t} t0={198.78} text="CAN'T THROW IT BACK" color={C.violeta} x={960} y={970} centro size={60} />
    </Escena>

    {/* 053 · y después, aprendés a marchar */}
    <Escena t={t} t0={200.56} t1={202.5} entra="sube" banda={C.ambar} golpes={[201.64]}>
      <Ruta t={t} avance={(t - 200.56) * 420} />
      {Array.from({ length: 8 }, (_, i) => <Soldadito key={i} x={180 + i * 210} y={900 + (i % 2) * 20} s={1.6} t={t} seed={10 + i} avanza={1} />)}
      <Frente t={t} color="#2a3a1a" vel={260} seed={68} />
      <Grande t={t} t0={201.64} text="MARCH!" y={260} size={170} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 054-055 · Vegecio: 20 millas en 5 horas de verano, 24 a paso rápido */}
    <Escena t={t} t0={202.5} t1={210.22} zoom={0.04} entra="iris" ix={960} iy={540} golpes={[204.74, 206.28, 209.24]}>
      <Cielo tipo={t < 207.7 ? "dia" : "polvo"} />
      {(() => {
        const sol = prog(t, 205.8, 209.4);
        return <Astro x={300 + sol * 1300} y={340 - Math.sin(sol * Math.PI) * 180} r={80} />;
      })()}
      {(() => {
        const dx = (t - 202.5) * (t > 207.74 ? 520 : 340);
        return <>
          <Colinas capas={["#b9844a", "#9a6a34"]} base={620} seed={69} alto={70} dx={dx * 0.3} />
          <Suelo y={860} />
          {["I", "V", "X", "XV", "XX", "XXIV"].map((n, i) => <Hito key={n} x={1100 + i * 600 - dx} y={870} n={n} />)}
        </>;
      })()}
      <Persona x={560} y={990} h={470} t={t} seed={1} casco="legion" expr={t > 207.74 ? "miedo" : "orgullo"} camina={t > 207.74 ? 2.6 : 1.7} inclina={t > 207.74 ? 6 : 0} />
      <Emote t={t} t0={208.4} tipo="sudor" {...L(560, 990, 470)} />
      <Chip t={t} t0={203.3} text="OFFICIAL STANDARD" color={C.violeta} x={160} y={140} size={56} />
      <Cuenta t={t} t0={204.74} t1={205.4} de={0} a={20} x={1350} y={300} size={170} color="#fff" suf=" MILES" />
      <Cuenta t={t} t0={206.28} t1={206.8} de={0} a={5} x={1350} y={470} size={110} color={C.oro} suf=" HOURS" />
      <Chip t={t} t0={209.24} text="FASTER: 24" color={C.rojo} x={1200} y={600} size={66} />
    </Escena>

    {/* 056 · unos 35 km antes del almuerzo */}
    <Escena t={t} t0={210.22} t1={213.48} entra="corte" golpes={[210.88, 212.6]}>
      <Campamento t={t} tropa={false} />
      <Cuenta t={t} t0={210.88} t1={211.6} de={0} a={35} x={960} y={360} size={330} color="#fff" suf=" KM" />
      <Mesa x={1350} y={820} w={420} />
      <Pan x={1350} y={760} s={0.7} />
      <Persona x={700} y={1030} h={560} t={t} seed={1} casco="legion" expr="dormido" inclina={interpolate(prog(t, 212.6, 213.2), [0, 1], [0, 30])} />
      <Chip t={t} t0={212.6} text="BEFORE LUNCH" color={C.violeta} x={960} y={620} centro size={70} />
    </Escena>

    {/* 057-058 · tres veces por mes, 10 millas de ida y 10 de vuelta con todo encima */}
    <Escena t={t} t0={213.48} t1={220.8} zoom={0.05} entra="diag" golpes={[213.64, 216.04, 217.18, 218.62]}>
      <Campo t={t} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 260 760 C 600 460 1000 900 1660 520" stroke="#e8c88a" strokeWidth={46} fill="none" strokeLinecap="round" strokeDasharray="2 70" />
        <circle cx={260} cy={760} r={56} fill={C.rojo} stroke="#fff" strokeWidth={8} />
        <circle cx={1660} cy={520} r={56} fill={C.ambar} stroke="#fff" strokeWidth={8} />
      </svg>
      {(() => {
        const ida = prog(t, 215.6, 217.0), vuelta = prog(t, 217.2, 218.9);
        const u = t < 217.1 ? ida : 1 - vuelta;
        const bx = (s: number) => (1 - s) ** 3 * 260 + 3 * (1 - s) ** 2 * s * 600 + 3 * (1 - s) * s * s * 1000 + s ** 3 * 1660;
        const by = (s: number) => (1 - s) ** 3 * 760 + 3 * (1 - s) ** 2 * s * 460 + 3 * (1 - s) * s * s * 900 + s ** 3 * 520;
        return <Persona x={bx(u)} y={by(u) + 20} h={360} t={t} seed={1} casco="legion" expr={t > 218.6 ? "triste" : "orgullo"} camina={1.8} flip={t > 217.1} />;
      })()}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1400 + i * 120, top: 120, width: 90, height: 110, background: "#fff8ec", borderRadius: 12, border: "6px solid #2a1530", transform: `scale(${ent(t, 213.64 + i * 0.12)})`, fontFamily, fontWeight: 700, fontSize: 70, color: C.rojo, textAlign: "center", lineHeight: "100px" }}>✓</div>)}
      <Chip t={t} t0={213.8} text="3× A MONTH" color={C.violeta} x={160} y={140} size={60} />
      <Chip t={t} t0={216.04} text="10 MILES OUT" color={C.rojo} x={1420} y={420} size={52} />
      <Chip t={t} t0={217.18} text="10 MILES BACK" color={C.rojo} x={130} y={870} size={52} />
      <Chip t={t} t0={218.62} text="FULL GEAR" color={C.ambar} tinta={C.noche} x={960} y={980} centro size={60} />
    </Escena>

    {/* 059 · si fallás, te cambian el trigo por cebada */}
    <Escena t={t} t0={220.8} t1={224.68} entra="barrido" golpes={[220.8, 223.78]}>
      <Interior />
      <AbsoluteFill style={{ background: "rgba(140,20,50,.25)" }} />
      <Persona x={960} y={1040} h={520} t={t} seed={1} casco="legion" expr={t > 223.78 ? "triste" : "sorpresa"} {...pose("comer", t, 0.8)} />
      <Comida k="trigo" x={600} y={540} s={1.8} t={t} t0={222.0} />
      {t > 223.34 && <svg style={{ position: "absolute", left: 380, top: 320 }} width={440} height={440}><path d="M 40 40 L 400 400 M 400 40 L 40 400" stroke="#fff" strokeWidth={36} strokeLinecap="round" strokeDasharray={510} strokeDashoffset={510 * (1 - prog(t, 223.34, 223.6))} /></svg>}
      <Comida k="cebada" x={1320} y={540} s={1.8} t={t} t0={223.78} />
      <Grande t={t} t0={220.8} text="FAIL?" y={150} size={140} color="#fff" />
      <Chip t={t} t0={223.34} text="WHEAT" color={C.ambar} tinta={C.noche} x={600} y={880} centro size={60} />
      <Chip t={t} t0={223.78} text="BARLEY" color={C.tierra} x={1320} y={880} centro size={60} />
    </Escena>

    {/* 060-061 · la cebada era comida de caballo: te alimentaban como a una mula */}
    <Escena t={t} t0={224.68} t1={231.2} zoom={0.05} entra="sube" golpes={[225.04, 228.96]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Mula x={1300} y={760} s={1.3} t={t} />
      <Comida k="porridge" x={980} y={880} s={0.8} />
      <Comida k="cebada" x={1640} y={850} s={0.7} />
      <Persona x={620} y={1000} h={540} t={t} seed={1} casco="legion" expr={t > 228.96 ? "triste" : "enojado"} bD={70} cD={110} />
      <Emote t={t} t0={226.2} t1={228.8} tipo="enojo" {...L(620, 1000, 540)} />
      <Emote t={t} t0={229.6} tipo="lagrimas" {...L(620, 1000, 540)} />
      <Chip t={t} t0={225.04} text="HORSE FOOD" color={C.tierra} x={160} y={140} size={62} />
      <Chip t={t} t0={226.08} text="NOT AN INSULT..." color={C.violeta} x={960} y={260} centro size={54} t1={228.8} />
      <Chip t={t} t0={228.96} text="FED LIKE A MULE" color={C.rojo} x={960} y={260} centro size={70} />
    </Escena>

    {/* 062-063 · Josefo miró al ejército romano desde el bando perdedor */}
    <Escena t={t} t0={231.2} t1={238.98} zoom={0.05} entra="iris" ix={700} iy={500} golpes={[235.06, 238.24]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={60} seed={71} alto={600} />
      <Astro x={1640} y={200} r={70} luna />
      <Colinas capas={["#3a2a6a", "#2a1d5a"]} base={700} seed={72} alto={60} />
      {Array.from({ length: 9 }, (_, i) => <Soldadito key={i} x={1060 + i * 100} y={860 + (i % 3) * 30} s={1.1} t={t} seed={30 + i} avanza={1} />)}
      <Persona x={480} y={1000} h={560} t={t} seed={130} ropa={CIVIL(7)} viejo expr={t > 238.24 ? "triste" : "neutro"} mira={0.8} aparece={233.6} />
      <Pergamino x={640} y={720} w={260} abre={prog(t, 236.0, 236.8)} lineas={4} />
      <Chip t={t} t0={232.06} text="A FAMOUS LINE" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} t1={235.0} />
      <Chip t={t} t0={235.06} text="JOSEPHUS" color={C.violeta} x={160} y={140} size={70} />
      <Chip t={t} t0={238.24} text="FROM THE LOSING SIDE" color={C.rojo} x={1060} y={600} size={54} />
    </Escena>

    {/* 064 · ejercicios = batallas sin sangre; batallas = ejercicios sangrientos */}
    <Escena t={t} t0={238.98} t1={243.86} entra="corte" golpes={[240.64, 242.7]}>
      {t < 241.86 ? <Campamento t={t} /> : <Valle t={t} hora="tarde" />}
      <AbsoluteFill style={{ background: t < 241.86 ? "rgba(27,18,64,.45)" : "rgba(120,10,30,.5)" }} />
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={260 + i * 280} y={1010} s={1.4} t={t + i * 0.2} seed={20 + i} enemigo={t > 241.86 && i % 2 === 1} />)}
      <Grande t={t} t0={240.04} text="DRILLS =" y={300} size={120} color="#fff" />
      <Grande t={t} t0={240.64} text="BLOODLESS BATTLES" y={440} size={110} color={C.teal} />
      <Grande t={t} t0={242.12} text="BATTLES =" y={660} size={120} color="#fff" />
      <Grande t={t} t0={242.7} text="BLOODY DRILLS" y={800} size={130} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 065 · no era un elogio */}
    <Escena t={t} t0={243.86} t1={245.88} entra="zoom" golpes={[244.92]}>
      <Interior />
      <Mesa x={1180} y={800} w={520} />
      <Pergamino x={1180} y={700} w={380} abre={1} lineas={5} />
      <Persona x={760} y={1040} h={760} t={t} seed={130} ropa={CIVIL(7)} viejo expr="enojado" {...pose("escribir", t, 1.2)} />
      <Emote t={t} t0={244.3} tipo="enojo" {...L(760, 1040, 760)} s={1.5} />
      <Chip t={t} t0={244.34} text="NOT A COMPLIMENT" color={C.rojo} x={960} y={960} centro size={70} />
    </Escena>

    {/* 066-067 · mil veces hecho, salvo la parte de morir */}
    <Escena t={t} t0={245.88} t1={253.76} zoom={0.06} entra="barrido" golpes={[248.64, 250.8, 252.6]}>
      <Campamento t={t} hora={t < 252.1 ? "dia" : "noche"} tropa={false} />
      {t > 252.1 && <AbsoluteFill style={{ background: "rgba(90,10,30,.45)" }} />}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: t > 250.0 ? 1 : 0 }}>
          <Soldadito x={180 + (i % 8) * 220} y={360 + Math.floor(i / 8) * 260} s={0.9} t={t + i * 0.13} seed={40 + i} avanza={1} />
        </div>
      ))}
      <Persona x={960} y={t < 250 ? 1000 : 1300} h={t < 250 ? 620 : 300} t={t} seed={1} casco="legion" expr="orgullo" opacity={t < 250 ? 1 : 0} />
      {t < 250 && <Soldadito x={1500} y={960} s={2.2} t={t} seed={5} enemigo />}
      <Chip t={t} t0={248.34} text="A REAL ENEMY" color={C.rojo} x={1300} y={300} size={56} t1={249.9} />
      <Cuenta t={t} t0={250.8} t1={251.8} de={1} a={1000} x={960} y={170} size={190} color="#fff" suf="×" />
      <Craneo x={960} y={640} s={2.4} t={t} t0={252.6} />
      <Chip t={t} t0={252.1} text="EXCEPT THE DYING PART" color={C.rojo} x={960} y={960} centro size={66} />
    </Escena>
  </>
);
