import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Particulas, Pergamino, fontFamily } from "./kit";
import { Termometro } from "./kit3";
import { Lapida } from "./kit2";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, Nieve, NINO, NINA, OBRERO, CAPATAZ, GenteFab, FX0 } from "./mundo";
import { Gran, Cuenta, Sello, Flash, sacudon, Velo, Horror, Latigo, Lista, Globo } from "./capas";
import { Pulmones, Oreja, Primer } from "./piezas";
import { Persona } from "./persona";

// PARTE D · HORROR #3, EL AIRE (295,7-392,9 s). La hilandería de la fábrica abierta: el calor a propósito (28 °C,
// ventanas tapiadas) → afuera, la noche de invierno empapado → resfrío, fiebre, funeral → la sala de cardas: el polvo
// que entra en la boca y los pulmones que se apagan → el ruido, la oreja, leer los labios (los viejos todavía en la
// calle) → «perfectamente legal» → la cámara sube a la oficina, al cartel de multas: lo que se inventó a propósito.
export const D0 = 295.7, D1 = 392.9;

const KD: K[] = [
  [295.7, 3300, -1500, 0.32], [297.8, 1900, -430, 1.0], [301.8, 2300, -430, 1.15], [302.9, 2600, -460, 0.8], [308.5, 2600, -460, 0.75], [314.2, 2600, -480, 0.95], [322.6, 2300, -600, 0.5], [324.5, 2350, -400, 1.05], [327.2, 2450, -400, 1.1],
  [327.21, 3600, -420, 1.0], [331.9, 3350, -420, 1.2], [333.1, 2400, -330, 1.0], [336.4, 2050, -380, 0.85],
  [336.41, 1900, -1450, 0.85], [340.7, 1900, -1450, 0.95], [343.1, 1720, -1330, 1.45], [346.3, 1720, -1330, 1.3], [349.8, 1900, -1450, 0.8], [364.3, 1900, -1450, 0.85],
  [364.31, 3300, -500, 0.6], [368.0, 3300, -500, 0.66], [371.4, 3000, -400, 1.2], [374.8, 3000, -400, 1.3],
  [374.81, -1700, -380, 1.35], [380.9, -1700, -380, 1.4],
  [380.91, 3300, -1400, 0.42], [388.0, 3500, -1450, 0.45], [389.7, 4200, -1560, 0.8], [392.9, 4280, -1560, 1.15],
];
const seg = (t: number) => (t < 327.2 ? "i1" : t < 336.4 ? "x1" : t < 364.3 ? "i2" : t < 374.8 ? "i3" : t < 380.9 ? "x2" : "i4");

export const PD: React.FC<{ t: number }> = ({ t }) => {
  const s = seg(t);
  const cam = camara(t, KD);
  const afuera = s === "x1" || s === "x2";
  const sh = sacudon(t, [301.8, 336.5, 364.4, 386.5], s === "i3" ? 10 : 18);
  // ruido: temblor continuo y fino en la hilandería
  const zum = s === "i3" && t < 371 ? Math.sin(t * 70) * 3 : 0;

  const g0: GenteFab[] = [];
  const g1: GenteFab[] = [];
  if (s === "i1") g0.push({ seed: 2, x: interpolate(t, [297.8, 301.4], [1700, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: 0, h: 300, ropa: NINO, gorro: "gorra", camina: t < 301.4 ? 1.5 : 0, expr: t < 301.8 ? "neutro" : t < 324 ? "sorpresa" : "triste", mira: 1 });
  if (s === "i1") g0.push({ seed: 3, x: 2950, y: 0, h: 470, ropa: OBRERO(2), flip: true, expr: "triste", bD: 30 });
  if (s === "i2") {
    g1.push({ seed: 4, x: 1720, y: -1000, h: 290, ropa: NINA, gorro: "cofia", largo: true, expr: t > 349.8 && t < 364 ? "triste" : "neutro", mira: -1, ladea: t > 351.6 && t < 353.4 ? Math.sin(t * 22) * 6 : 0 });
    g1.push({ seed: 5, x: 2150, y: -1000, h: 460, ropa: OBRERO(5), expr: "triste", flip: true, bD: 40 });
  }
  if (s === "i3") {
    g0.push({ seed: 6, x: 2800, y: 0, h: 470, ropa: OBRERO(1), expr: "neutro", habla: t > 371.4 && Math.floor(t * 1.2) % 2 === 0, mira: 1 });
    g0.push({ seed: 7, x: 3200, y: 0, h: 450, ropa: OBRERO(4), gorro: "cofia", largo: true, flip: true, expr: "neutro", habla: t > 371.4 && Math.floor(t * 1.2) % 2 === 1, mira: -1 });
  }
  // afuera: el chico empapado sale al invierno; el funeral chico; los viejos que todavía leen labios
  const gP: GenteFab[] = [];
  if (s === "x1") {
    gP.push({ seed: 2, x: interpolate(t, [327.4, 332.5], [3600, 2900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + Math.sin(t * 40) * 3, y: 0, h: 460, ropa: NINO, gorro: "gorra", camina: t < 332.5 ? 1.2 : 0, flip: true, expr: "triste", bD: 25, bI: 25, cD: 120, cI: 120 });
    if (t > 334.6) for (let i = 0; i < 4; i++) gP.push({ seed: 90 + i, x: interpolate(t, [334.6, 336.4], [1250, 1650]) + i * 205, y: 0, h: 460 + (i % 2) * 20, ropa: { ...OBRERO(i), tunica: "#2a2238", tunica2: "#140f1d" }, gorro: i % 2 ? "cofia" : "copa", largo: i % 2 === 1, camina: 0.9, expr: "triste", bD: i < 2 ? 160 : 0, cD: 10 });
  }
  if (s === "x2") {
    gP.push({ seed: 95, x: -2000, y: 0, h: 470, ropa: OBRERO(3), viejo: true, barba: true, expr: "feliz", habla: Math.floor(t * 1.1) % 2 === 0, mira: 1 });
    gP.push({ seed: 96, x: -1400, y: 0, h: 440, ropa: OBRERO(6), viejo: true, gorro: "cofia", largo: true, flip: true, expr: "feliz", habla: Math.floor(t * 1.1) % 2 === 1, mira: -1 });
  }
  const mojado = s === "x1";
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + zum}px, ${sh.y}px)` }}>
      <CieloHora t={t} luz={s === "x1" ? 0.02 : 1.7} />
      <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
      <Espacio cam={cam}>
        <Pueblo t={t} e={{ abre: afuera ? 0 : 1, hora: s === "x1" ? 20 : 15, luz: s === "x1" ? 0.02 : 1.8, porton: s === "x1" ? 1 : 0, gente: gP, nieve: s === "x1" ? 1 : 0, luzCasa: 1 }}
          adentro={{ gente: g0, gente1: g1, calor: s === "i1" ? prog(t, 301.6, 302.6) : 0, polvo: s === "i2" ? 1.4 + prog(t, 340.7, 343) * 1.6 : 0.7, corta: s === "i1" && t > 303 && t < 306 ? [6, 7, 15] : [] }} />
        {/* ventanas tapiadas: tablones que se clavan una por una */}
        {s === "i1" && t > 322.6 && Array.from({ length: 14 }, (_, i) => {
          const e = ent(t, 322.7 + i * 0.07, 0, { damping: 9, stiffness: 220 });
          return (
            <svg key={i} style={{ position: "absolute", left: FX0 + 200 + i * 430 - 20, top: -870, overflow: "visible", transform: `scale(${e})` }} width={190} height={420}>
              {[60, 190, 320].map((y, k) => <rect key={k} x={0} y={y} width={190} height={56} rx={8} fill={k % 2 ? "#8a5a2c" : "#a8723c"} transform={`rotate(${k % 2 ? 8 : -8} 95 ${y + 28})`} />)}
            </svg>
          );
        })}
        {/* el aire que entra en la boca de la nena (fibras) */}
        {s === "i2" && t > 343.1 && t < 349.8 && Array.from({ length: 26 }, (_, i) => {
          const k = ((t - 343.1) * 0.6 + i / 26) % 1;
          const a = (i * 2.4) % (Math.PI * 2);
          const R = 420 * (1 - k);
          return <circle key={i} cx={1720 + Math.cos(a) * R} cy={-1238 + Math.sin(a) * R * 0.6} r={6 + (i % 3) * 2} fill="#fffaf0" opacity={0.9 * (0.3 + k)} />;
        })}
        {/* el chico empapado: gotas que le caen */}
        {mojado && t < 334 && Array.from({ length: 8 }, (_, i) => {
          const k = ((t * 1.4 + i / 8) % 1);
          const x = interpolate(t, [327.4, 332.5], [3600, 2900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <path key={i} transform={`translate(${x - 90 + (i * 29) % 180} ${-260 + k * 260})`} d="M 0 -16 Q 10 0 0 8 Q -10 0 0 -16 Z" fill="#7fd6ff" opacity={1 - k} />;
        })}
        {/* el ataúd chico de la procesión */}
        {s === "x1" && t > 334.6 && <div style={{ position: "absolute", left: interpolate(t, [334.6, 336.4], [1250, 1650]) - 40, top: -575, width: 340, height: 84, background: "linear-gradient(180deg, #8a5530, #5e3519)", clipPath: "polygon(0 30%, 18% 0, 100% 0, 100% 100%, 18% 100%, 0 70%)", border: "6px solid #2a1530" }}><div style={{ position: "absolute", left: 120, top: 18, width: 12, height: 40, background: "#e8d4a8" }} /><div style={{ position: "absolute", left: 106, top: 32, width: 40, height: 12, background: "#e8d4a8" }} /></div>}
      </Espacio>
      {s === "x1" && <Nieve t={t} n={140} />}
      {s === "i2" && <Particulas t={t} tipo="polvo" n={70} seed={7} />}

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[295.75, 327.2, 336.4, 364.3, 374.8, 380.9]} />
      <Horror t={t} t0={295.75} n={3} nombre="THE AIR" t1={297.8} />
      <Chip t={t} t0={298.0} t1={301.6} text="NOT THE NOISE…" color={C.violeta} x={960} y={150} centro size={74} />
      <Gran t={t} t0={301.85} t1={302.9} text="THE HEAT" y={200} size={200} color={C.naranja} />
      <Chip t={t} t0={303.0} t1={305.4} text="DRY AIR = BROKEN THREADS" color={C.noche} x={960} y={150} centro size={68} />
      {/* el hilo que se seca y se corta */}
      {t > 302.9 && t < 305.6 && (() => { const e = ent(t, 303.0) * (1 - prog(t, 305.3, 305.6)); const k = prog(t, 303.8, 304.1); return (
        <svg style={{ position: "absolute", left: 1180, top: 330, overflow: "visible", transform: `scale(${e})`, transformOrigin: "300px 150px" }} width={1} height={1}>
          <rect x={-40} y={-40} width={680} height={330} rx={30} fill="#fff6dc" stroke="#2a1530" strokeWidth={8} />
          <ellipse cx={60} cy={150} rx={44} ry={80} fill="#f4ecd8" stroke="#2a1530" strokeWidth={6} />
          <ellipse cx={540} cy={150} rx={44} ry={80} fill="#f4ecd8" stroke="#2a1530" strokeWidth={6} />
          <path d={`M 100 150 L ${300 - 30 * k} ${150 + 60 * k}`} stroke="#c9a96a" strokeWidth={8} fill="none" />
          <path d={`M ${300 + 30 * k} ${150 + 60 * k} L 500 150`} stroke="#c9a96a" strokeWidth={8} fill="none" />
          {k > 0 && [0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={300} y1={130} x2={300 + Math.cos(i) * 70 * k} y2={130 + Math.sin(i * 1.7) * 70 * k} stroke={C.ambar} strokeWidth={6} strokeLinecap="round" />)}
          {k > 0 && <text x={300} y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill={C.rojo} opacity={k}>SNAP!</text>}
          <text x={300} y={270} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#2a1530">COTTON THREAD · TOO DRY</text>
        </svg>); })()}
      <Chip t={t} t0={305.5} t1={308.4} text="HOT AND DAMP · ON PURPOSE" color={C.naranja} x={960} y={950} centro size={70} />
      {t > 308.5 && t < 314.0 && <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, 308.5) * (1 - prog(t, 313.7, 314))})`, transformOrigin: "960px 540px" }}><Pergamino x={960} y={540} w={760} abre={prog(t, 308.6, 309.4)} lineas={0} titulo="MILL RULES · 1823" />{t > 309.3 && ["WINDOWS KEPT SHUT", "HEAT KEPT AT 80–84 °F", "AIR KEPT DAMP FOR THE THREAD"].map((l, i) => <div key={l} style={{ position: "absolute", left: 960, top: 470 + i * 90, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily, fontWeight: 700, fontSize: 46, color: "#3a2410", opacity: ent(t, 309.4 + i * 0.5) }}>{l}</div>)}</div>}
      <Chip t={t} t0={310.2} t1={314.0} text="TYLDESLEY, NEAR MANCHESTER" color={C.violeta} x={960} y={950} centro size={64} />
      {t > 314.2 && t < 322.4 && (
        <div style={{ position: "absolute", left: 1650, top: 120, transform: `scale(${ent(t, 314.2) * (1 - prog(t, 322.1, 322.4))})` }}><div style={{ position: "relative" }}><Termometro x={0} y={860} s={0.95} nivel={0.2 + prog(t, 314.4, 317.4) * 0.66} marcas={[60, 70, 80, 90]} unidad="F" /></div></div>
      )}
      <Cuenta t={t} t0={314.6} t1={317.4} de={84} a={84} x={760} y={360} size={200} color={C.naranja} pre="80–" suf="°F" fuera={318.6} />
      <Cuenta t={t} t0={318.7} t1={319.6} de={20} a={28} x={800} y={360} size={140} color={C.rojo} pre="80–84 °F ≈ " suf="°C" fuera={322.4} />
      <Chip t={t} t0={320.2} t1={322.4} text="EVERY DAY · ALL YEAR" color={C.noche} x={760} y={560} centro size={64} />
      <Sello t={t} t0={322.7} t1={324.4} text="WINDOWS SHUT" x={960} y={330} size={130} />
      <Cuenta t={t} t0={324.6} t1={325.6} de={14} a={14} x={960} y={470} size={120} color={C.crema} suf=" HOURS OF SWEAT" fuera={327.1} />
      <Emote t={t} t0={324.6} t1={327.1} tipo="sudor" x={960 + (2300 - cam.x) * cam.z} y={540 + (-170 - cam.y) * cam.z} s={0.55 * cam.z} />
      <Chip t={t} t0={327.4} t1={331.8} text="A LANCASHIRE WINTER NIGHT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={329.6} t1={333.0} text="SOAKING WET · THIN CLOTHES" color={C.violeta} x={1350} y={960} centro size={56} />
      {t > 333.1 && t < 336.4 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Chip t={t} t0={333.1} t1={336.3} text="COLD" color={C.teal} tinta={C.noche} x={330} y={140} centro size={80} />
          <Chip t={t} t0={333.9} t1={336.3} text="→ FEVER" color={C.naranja} x={820} y={140} centro size={80} />
          <Chip t={t} t0={334.8} t1={336.3} text="→ FUNERAL" color={C.noche} x={1390} y={140} centro size={80} />
        </div>
      )}
      <Lapida t={t} t0={335.2} t1={336.3} x={1390} y={620} s={0.5} lineas={["AGED", "10"]} />
      <Gran t={t} t0={336.5} t1={339.9} text="THE DUST" y={190} size={190} color={C.crema} />
      <Chip t={t} t0={338.0} t1={340.6} text="THE CARD ROOM" color={C.violeta} x={960} y={950} centro size={70} />
      <Chip t={t} t0={340.7} t1={343.0} text="THICK WITH TINY FIBRES" color={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={343.1} t1={346.2} text="YOU BREATHE THEM IN" color={C.rojo} x={960} y={150} centro size={74} />
      <Chip t={t} t0={344.5} t1={346.2} text="ALL DAY · FOR YEARS" color={C.noche} x={960} y={950} centro size={66} />
      <Chip t={t} t0={346.4} t1={349.6} text="“MILL FEVER”" color={C.ambar} tinta={C.noche} x={620} y={150} centro size={70} />
      <Chip t={t} t0={347.7} t1={349.6} text="“STRIPPER'S ASTHMA”" color={C.naranja} x={1300} y={150} centro size={70} />
      {t > 349.8 && t < 364.3 && <Velo t={t} t0={349.8} t1={364} op={0.9} />}
      {t > 349.9 && t < 364.1 && <Persona t={t} seed={2} x={330} y={1010} h={620} ropa={NINO} gorro="gorra" expr={Math.sin(t * 3) > 0.4 ? "dormido" : "triste"} inclina={10 + 9 * Math.max(0, Math.sin(t * 3))} bD={150} cD={150} aparece={350.0} />}
      <Pulmones t={t} t0={349.9} t1={364.0} x={1000} y={560} s={1.1} sucio={0.15 + prog(t, 350, 355) * 0.85} apaga={prog(t, 353.3, 355.4)} />
      <Chip t={t} t0={350.5} t1={355.3} text="A TIGHT CHEST" color={C.noche} x={420} y={330} centro size={56} />
      <Chip t={t} t0={351.6} t1={355.3} text="A COUGH THAT NEVER LEFT" color={C.noche} x={1340} y={330} centro size={56} />
      <Chip t={t} t0={353.3} t1={355.3} text="LUNGS STOP WORKING" color={C.rojo} x={960} y={950} centro size={66} />
      <Gran t={t} t0={357.0} t1={359.7} text="BYSSINOSIS" y={180} size={150} color={C.crema} />
      <Chip t={t} t0={358.5} t1={359.7} text="“BROWN LUNG”" color={C.naranja} x={960} y={950} centro size={74} />
      <Chip t={t} t0={359.5} t1={364.0} text="STARTED AT 9 →" color={C.violeta} x={960} y={150} centro size={70} />
      <Chip t={t} t0={361.3} t1={364.0} text="A LIFE FIGHTING FOR BREATH" color={C.rojo} x={960} y={950} centro size={66} />
      <Gran t={t} t0={364.4} t1={366.3} text="THE NOISE" x={1150} y={200} size={190} color={C.ambar} rot={-3} />
      <Primer t={t} t0={364.5} t1={368.4} lado="izq" g={{ expr: "miedo", bD: 165, cD: 150, bI: 165, cI: 150 }} emo="susto" />
      <Chip t={t} t0={366.4} t1={368.5} text="DOZENS OF MACHINES · BELTS · SHAFTS" color={C.noche} x={960} y={950} centro size={58} />
      {t > 368.4 && t < 371.6 && <Velo t={t} t0={368.4} t1={371.3} op={0.45} />}
      <Oreja t={t} t0={368.5} t1={371.3} x={960} y={560} s={1.1} sorda={prog(t, 369.6, 370.6)} />
      <Chip t={t} t0={369.4} t1={371.3} text="HEARING: LOST" color={C.rojo} x={960} y={150} centro size={74} />
      <Chip t={t} t0={371.5} t1={374.7} text="TALKING BY READING LIPS" color={C.violeta} x={960} y={150} centro size={70} />
      <Oreja t={t} t0={374.9} t1={380.8} x={1660} y={360} s={0.42} sorda={1} />
      <Globo t={t} t0={375.6} t1={380.6} x={1180} y={480} text="WHAT? SAY AGAIN?" size={46} w={420} cola="der" />
      <Chip t={t} t0={375.0} t1={380.8} text="DEAF" color={C.rojo} x={1660} y={560} centro size={60} />
      <Chip t={t} t0={375.0} t1={380.8} text="STILL DOING IT IN THE 1900s" color={C.teal} tinta={C.noche} x={960} y={150} centro size={66} />
      <Chip t={t} t0={377.6} t1={380.8} text="ACROSS A CROWDED ROOM · LONG RETIRED" color={C.noche} x={960} y={950} centro size={56} />
      <Primer t={t} t0={381.1} t1={386.4} lado="der" x={1480} g={{ expr: "sorpresa", mira: -1, bI: 120, cI: 110 }} emo="preg" />
      <Lista t={t} t0={381.0} t1={389.6} x={110} y={170} titulo="ALL OF THAT…" size={74} previa items={[{ txt: "THE HEAT", t0: 383.0 }, { txt: "THE DUST", t0: 383.6 }, { txt: "THE NOISE", t0: 384.3 }, { txt: "14 HOURS", t0: 385.0 }]} />
      <Flash t={t} at={[386.5]} />
      <Sello t={t} t0={386.5} t1={389.6} text="PERFECTLY LEGAL" x={880} y={820} size={80} color={C.lima} rot={-8} />
      <Chip t={t} t0={388.1} t1={389.6} text="THAT WAS JUST THE JOB" color={C.noche} x={1250} y={800} centro size={60} />
      {/* vuelta 10 OJO: el capataz clava el tablero de multas y un obrero mira (antes sala vacía) */}
      {t > 389.8 && t < 392.9 && <>
        <Persona t={t} seed={61} ropa={CAPATAZ} gorro="copa" x={1350} y={1010} h={640} flip expr="enojado" habla bD={t < 391 ? 150 : 95} cD={t < 391 ? 40 : 0} aparece={389.9} />
        <Persona t={t} seed={44} ropa={OBRERO(1)} gorro="gorra" x={420} y={1010} h={560} expr="sorpresa" mira={1} aparece={390.2} />
      </>}
      <Gran t={t} t0={389.8} t1={392.8} text="NOW: INVENTED ON PURPOSE" y={120} size={82} color={C.rojo} />
    </AbsoluteFill>
  );
};
