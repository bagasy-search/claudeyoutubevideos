import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Colinas, Chip, Grande, MapaPuntos, Particulas, Rayos, Emote, cabeza, Aguila, Casa, Astro } from "./kit";
import { Denario, Lapida, Ciudad, Bolsa, Diploma, Campana, Barco, Craneo, Soldadito, Lluvia, Gladius } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Valle, Campo, Pueblo, Ruta, Tablero, pose } from "./kit3";

// Parte 7 (792,73-940,55 s): trampa 7, el retiro, el giro final, las ciudades y el cierre.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Tachado: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; h?: number }> = ({ t, t0, x, y, w = 600, h = 400 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible" }} width={w} height={h}>
    <path d={`M 20 20 L ${w - 20} ${h - 20} M ${w - 20} 20 L 20 ${h - 20}`} stroke={C.rojo} strokeWidth={Math.min(w, h) / 10} strokeLinecap="round" strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - prog(t, t0, t0 + 0.25))} />
  </svg>
);
const Tilde: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => t < t0 ? null : (
  <svg style={{ position: "absolute", left: x - 60 * s, top: y - 60 * s, overflow: "visible" }} width={120 * s} height={120 * s} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56 * ent(t, t0)} fill={C.lima} />
    <path d="M 30 62 L 52 84 L 92 40" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - prog(t, t0 + 0.1, t0 + 0.35))} />
  </svg>
);
// balanza: la Legión contra "todo lo demás"
const Balanza: React.FC<{ t: number; t0: number; inclina: number }> = ({ t, t0, inclina }) => {
  const a = interpolate(prog(t, t0, t0 + 0.8), [0, 1], [0, inclina]);
  const dy = Math.sin((a * Math.PI) / 180) * 360;
  return (
    <svg style={{ position: "absolute", left: 960 - 560, top: 260 }} width={1120} height={700} overflow="visible">
      <path d="M 520 660 L 600 660 L 580 120 L 540 120 Z" fill="#c9a46a" />
      <rect x={400} y={650} width={320} height={40} rx={14} fill="#8a6a3a" />
      <g transform={`rotate(${a} 560 120)`}><rect x={180} y={108} width={760} height={24} rx={12} fill="#e9a92a" /></g>
      <circle cx={560} cy={120} r={26} fill="#fff0a0" />
      <line x1={200} y1={120 - dy} x2={200} y2={300 - dy} stroke="#fff" strokeWidth={6} />
      <line x1={920} y1={120 + dy} x2={920} y2={300 + dy} stroke="#fff" strokeWidth={6} />
      <path d={`M 80 ${300 - dy} L 320 ${300 - dy} Q 200 ${380 - dy} 80 ${300 - dy} Z`} fill="#e9a92a" />
      <path d={`M 800 ${300 + dy} L 1040 ${300 + dy} Q 920 ${380 + dy} 800 ${300 + dy} Z`} fill="#e9a92a" />
    </svg>
  );
};
// botón de suscribirse con cursor que lo aprieta
const Suscribir: React.FC<{ t: number; t0: number; tClick: number; x: number; y: number }> = ({ t, t0, tClick, x, y }) => {
  if (t < t0) return null;
  const hecho = t > tClick;
  const cx = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [x + 520, x + 120]), cy = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [y + 320, y + 40]);
  const pres = t > tClick && t < tClick + 0.15 ? 0.92 : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x - 330, top: y - 80, width: 660, height: 160, borderRadius: 80, background: hecho ? "#5a5a6a" : "#e62117", color: "#fff", fontFamily, fontWeight: 700, fontSize: 72, textAlign: "center", lineHeight: "160px", transform: `scale(${ent(t, t0) * pres})`, boxShadow: "0 14px 0 rgba(0,0,0,.25)" }}>{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      <svg style={{ position: "absolute", left: cx, top: cy }} width={90} height={120} viewBox="0 0 90 120"><path d="M 6 4 L 6 92 L 28 72 L 44 112 L 60 104 L 44 66 L 76 66 Z" fill="#fff" stroke="#111" strokeWidth={6} strokeLinejoin="round" /></svg>
    </>
  );
};

export const P7: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 190 · trampa siete: el retiro */}
    <Escena t={t} t0={792.73} t1={795.15} entra="corte" golpes={[792.95, 794.09]}>
      <Tablero t={t} t0={792.4} en={6} de={5} tAvanza={792.9} marca={793.8} hecho={6} />
      <Chip t={t} t0={792.95} text="TRAP 7 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={793.99} text="THE RETIREMENT" x={860} y={400} size={110} />
    </Escena>

    {/* 191 · pero digamos que lo lograste: marcha, centurión, fiebre y bosque, tachados */}
    <Escena t={t} t0={795.15} t1={800.45} zoom={0.04} entra="iris" ix={960} iy={540} golpes={[796.29, 797.57, 798.29, 799.21, 799.81]}>
      <Tablero t={t} t0={795.0} en={6} de={6} hecho={t > 799.81 ? 7 : t > 797.57 ? 6 : 5} />
      <Grande t={t} t0={795.39} text="SAY YOU MADE IT." x={820} y={180} size={100} color="#fff" borde="#2a1530" />
      {([[797.57, "THE MARCH"], [798.29, "THE CENTURION"], [799.21, "THE FEVER"], [799.81, "THE FOREST"]] as const).map(([t0, txt], i) => <Chip key={txt} t={t} t0={t0} text={"✓ " + txt} color={C.teal} tinta={C.noche} x={880} y={330 + i * 0} size={46} t1={i < 3 ? [798.29, 799.21, 799.81][i] - 0.3 : undefined} />)}
      <Chip t={t} t0={796.83} text="YOU SURVIVED" color={C.lima} tinta={C.noche} x={200} y={330} size={50} />
    </Escena>

    {/* 192 · pasaron 25 años, tenés 43: rodillas, espalda, dientes */}
    <Escena t={t} t0={800.45} t1={807.6} zoom={0.05} entra="corte" golpes={[800.67, 802.43, 804.03, 805.13, 806.57]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <div style={{ position: "absolute", left: 1170, top: 740, width: 18, height: 300, borderRadius: 9, background: "#6b3a1f", transform: "rotate(6deg)" }} />
      <Persona x={960} y={1040} h={700} t={t} seed={1} viejo expr={t > 803.5 ? "triste" : "neutro"} casco="legion" inclina={prog(t, 803.3, 805.4) * 14} ladea={4} />
      <Cuenta t={t} t0={800.67} t1={801.5} de={0} a={25} x={540} y={240} size={130} color="#fff" suf=" YEARS" />
      <Cuenta t={t} t0={802.31} t1={802.8} de={18} a={43} x={1500} y={240} size={150} color={C.oro} pre="AGE " />
      {([[803.67, "BAD KNEES", 1180, 980], [804.91, "BAD BACK", 1340, 640], [806.39, "TEETH MISSING", 300, 600]] as const).map(([t0, txt, x, y]) => (
        <React.Fragment key={txt}>
          <Chip t={t} t0={t0} text={txt} color={C.rojo} x={x} y={y} size={50} />
        </React.Fragment>
      ))}
      <Emote t={t} t0={804.1} tipo="sudor" {...L(960, 1040, 700)} s={1.2} />
    </Escena>

    {/* 193 · ¿qué te da Roma? En papel, mucho */}
    <Escena t={t} t0={807.6} t1={810.7} entra="zoom" golpes={[808.47, 810.17]}>
      <Pueblo t={t} hora="tarde" />
      <div style={{ position: "absolute", left: 640, top: 740, width: 18, height: 300, borderRadius: 9, background: "#6b3a1f", transform: "rotate(6deg)" }} />
      <Persona x={460} y={1040} h={640} t={t} seed={1} viejo expr="feliz" casco="no" mira={0.6} />
      <div style={{ position: "absolute", left: 1060, top: 300, width: 400, height: 300, transform: `scale(${ent(t, 807.8) * 1.1})` }}><Aguila x={200} y={150} s={1} /></div>
      {t > 808.4 && <div style={{ position: "absolute", left: interpolate(prog(t, 808.4, 809.4), [0, 1], [1220, 760]), top: interpolate(prog(t, 808.4, 809.4), [0, 1], [560, 640]), width: 160, height: 110, background: "#f2e6c8", border: "6px solid #8a6a3a", borderRadius: 8 }}><div style={{ position: "absolute", left: 60, top: 36, width: 36, height: 36, borderRadius: 18, background: C.rojo }} /></div>}
      <Grande t={t} t0={807.87} text="WHAT DOES ROME GIVE YOU?" y={160} size={90} color="#fff" borde="#7a3d14" />
      <Grande t={t} t0={809.33} text="ON PAPER... A LOT" x={1260} y={900} size={90} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 194 · bajo Augusto: 3.000 denarios en efectivo, más de 10 años de paga de golpe */}
    <Escena t={t} t0={810.7} t1={818.6} zoom={0.04} entra="corte" golpes={[811.01, 813.63, 814.99, 816.51, 818.09]}>
      <Interior t={t} tono="#e0c79a" />
      <Persona x={1680} y={1040} h={600} t={t} seed={1} viejo expr={t > 813.7 ? "sorpresa" : "neutro"} mira={-0.6} flip />
      <Particulas t={t} tipo="lluviaoro" n={50} seed={132} />
      {Array.from({ length: 26 }, (_, i) => { const t0 = 813.6 + i * 0.05; if (t < t0) return null; const k = Math.min(1, (t - t0) / 0.5); return <Denario key={i} x={380 + (i % 13) * 90} y={interpolate(k, [0, 1], [-100, 880 - Math.floor(i / 13) * 70 - (i % 3) * 18])} r={46} gira={(t - t0) * 2} />; })}
      <Chip t={t} t0={811.01} text="UNDER AUGUSTUS" color={C.violeta} x={160} y={140} size={56} />
      <Cuenta t={t} t0={813.63} t1={814.4} de={0} a={3000} x={960} y={330} size={180} color={C.oro} />
      <Chip t={t} t0={814.41} text="DENARII · IN CASH" color={C.ambar} tinta={C.noche} x={960} y={490} centro size={60} />
      <Chip t={t} t0={816.13} text="MORE THAN 10 YEARS OF PAY" color={C.rojo} x={960} y={600} centro size={54} />
      <Chip t={t} t0={817.81} text="ALL AT ONCE" color={C.lima} tinta={C.noche} x={960} y={700} centro size={54} />
    </Escena>

    {/* 195 · o una parcela en una colonia nueva con otros veteranos; un monto que te cambiaba la vida */}
    <Escena t={t} t0={818.6} t1={825.5} zoom={0.05} entra="barrido" golpes={[819.47, 820.21, 821.73, 823.93]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#8ac46a", "#5a9a4a"]} base={720} seed={133} alto={60} />
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 420, top: 760, width: 380, height: 200, background: i % 2 ? "#c9a04a" : "#9ac45a", border: "6px dashed #fff", transform: `scaleY(${ent(t, 819.2 + i * 0.1)})` }} />)}
      <Casa x={350} y={780} s={0.8} />
      <Casa x={1610} y={780} s={0.8} />
      {[0, 1, 2].map((i) => <Persona key={i} x={600 + i * 420} y={1040} h={460} t={t} seed={i === 1 ? 1 : 300 + i} viejo expr="feliz" ropa={i === 1 ? undefined : CIVIL(i + 3)} aparece={821.3 + i * 0.15} {...(i === 1 ? pose("martillar", t) : {})} />)}
      {t > 821.6 && <div style={{ position: "absolute", left: 1140, top: 700 + 40 * (1 - prog(t, 821.6, 822.6)), width: 200, height: 260 }}><div style={{ position: "absolute", left: 92, top: 90, width: 16, height: 170, background: "#6b3a1f" }} /><div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 100, borderRadius: 10, background: "#f2e6c8", border: "6px solid #6b3a1f", fontFamily, fontWeight: 700, fontSize: 44, color: "#5a3a1a", textAlign: "center", lineHeight: "88px" }}>MINE</div></div>}
      <Chip t={t} t0={818.87} text="OR: A PLOT OF LAND" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={820.07} text="IN A NEW COLONY" color={C.teal} tinta={C.noche} x={160} y={260} size={56} />
      <Grande t={t} t0={823.93} text="LIFE-CHANGING" y={480} size={150} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 196 · el problema es la palabra SI */}
    <Escena t={t} t0={825.5} t1={827.5} entra="zoom" golpes={[826.49, 827.01]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      <Chip t={t} t0={825.69} text="THE PROBLEM IS ONE WORD" color={C.violeta} x={960} y={220} centro size={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 420, color: C.rojo, transform: `scale(${t > 827.01 ? ent(t, 827.01) : 0})`, textShadow: "0 20px 0 #5e0f1d" }}>IF</div>
    </Escena>

    {/* 197 · motín del año 14: los soldados lo gritaron; 30, incluso 40 años */}
    <Escena t={t} t0={827.5} t1={837.4} zoom={0.04} entra="corte" golpes={[828.65, 830.07, 834.13, 835.01, 836.91]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <div style={{ position: "absolute", left: 1440, top: 760, width: 480, height: 320, background: "#8a5a2a", border: "10px solid #5a3a1a" }} />
      {[0, 1].map((k) => <Persona key={k} x={1560 + k * 200} y={770} h={400} t={t} seed={390 + k} ropa={{ tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" }} casco="centurion" expr="miedo" flip />)}
      {Array.from({ length: 5 }, (_, i) => <Persona key={i} x={180 + i * 260} y={1040} h={480} t={t} seed={310 + i} casco="legion" viejo={i % 2 === 0} expr="enojado" habla={t > 829.7 && t < 831.5} bD={i % 2 ? 150 : 0} bI={i % 2 ? 0 : 150} cD={20} cI={20} salta={t > 830 && t < 831.6 ? Math.abs(Math.sin((t + i) * 8)) * 20 : 0} />)}
      {t > 830.0 && t < 831.7 && <Emote t={t} t0={830.1} tipo="enojo" x={700} y={420} s={1.4} />}
      <Chip t={t} t0={827.63} text="THE MUTINY OF AD 14" color="#2a1530" x={160} y={140} size={56} />
      {t > 833.6 && <div style={{ position: "absolute", left: 960 - 520, top: 230, width: 1040, height: 300, borderRadius: 30, background: "#fff", transform: `scale(${ent(t, 833.6)})` }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily, fontWeight: 700, fontSize: 48, color: "#2a1530" }}>CONTRACT: 25 YEARS</div>
        {t > 834.77 && <div style={{ position: "absolute", left: 300, top: 56, width: 70 * prog(t, 834.77, 835.0), height: 8, background: C.rojo, transform: "rotate(-8deg)" }} />}
        <div style={{ position: "absolute", left: 40, top: 120, fontFamily, fontWeight: 700, fontSize: 110, color: C.rojo }}>{t < 834.77 ? "" : t < 835.01 ? "30" : "30… 40"}</div>
        <div style={{ position: "absolute", right: 40, top: 150, fontFamily, fontWeight: 700, fontSize: 60, color: "#2a1530" }}>{t > 835.0 ? "YEARS" : ""}</div>
      </div>}
      <Chip t={t} t0={836.23} text="LONG PAST THEIR CONTRACT" color={C.ambar} tinta={C.noche} x={960} y={600} centro size={52} />
    </Escena>

    {/* 198 · la tierra prometida: "pantanos y laderas peladas" */}
    <Escena t={t} t0={837.4} t1={845.1} zoom={0.05} entra="barrido" golpes={[838.61, 840.13, 842.13, 843.83]}>
      <Campo t={t} seco />
      <AbsoluteFill style={{ background: "rgba(60,70,80,.45)" }} />
      <Lluvia t={t} n={90} angulo={15} op={0.35} />
      {t < 842.0
        ? <div style={{ position: "absolute", left: 960 - 520, top: 280, width: 1040, height: 520, borderRadius: 30, background: "#f2e6c8", border: "10px solid #8a6a3a", transform: `scale(${ent(t, 837.6)}) rotate(-2deg)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 64, color: "#5a3a1a" }}>YOUR PROMISED LAND</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: C.rojo }}>{t > 840.1 ? "— PERCENNIUS, MUTINEER" : ""}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 150, color: "#8a6a3a" }}>{t > 840.7 ? "“ ... ”" : "?"}</div>
        </div>
        : <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d={`M 1000 1080 L 1400 ${interpolate(prog(t, 843.5, 844.4), [0, 1], [1080, 300])} L 1920 ${interpolate(prog(t, 843.5, 844.4), [0, 1], [1080, 520])} L 1920 1080 Z`} fill="#8a7a6a" />
            <ellipse cx={460} cy={900} rx={440 * ent(t, 842.1)} ry={110 * ent(t, 842.1)} fill="#4a6a4a" />
            <ellipse cx={360} cy={880} rx={180 * ent(t, 842.3)} ry={40 * ent(t, 842.3)} fill="#6a8a5a" />
          </svg>
          <Persona x={460} y={1000 + 140 * prog(t, 842.2, 844.6)} h={520} t={t} seed={1} viejo expr="miedo" bD={150} bI={150} cD={20} cI={20} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><ellipse cx={460} cy={1000} rx={420} ry={120} fill="#4a6a4a" /></svg>
          <Persona x={1000} y={1040} h={560} t={t} seed={395} casco="legion" expr="enojado" habla bD={90} cD={0} flip />
          <Chip t={t} t0={842.13} text="PERCENNIUS" color={C.rojo} x={1000} y={380} centro size={40} />
          <Grande t={t} t0={842.13} text="“SWAMPY BOGS...”" x={500} y={560} size={80} color="#fff" borde="#2a3a2a" />
          <Grande t={t} t0={843.55} text="“...BARE MOUNTAINSIDES”" x={1300} y={220} size={80} color="#fff" borde="#2a3a2a" />
        </>}
    </Escena>

    {/* 199 · algunos tuvieron suerte: baja honrosa, se casaron, hijos legales por fin */}
    <Escena t={t} t0={845.1} t1={857.1} zoom={0.05} entra="iris" ix={960} iy={540} golpes={[846.43, 848.31, 850.87, 852.29, 856.53]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#c9774a", "#9a4a3a"]} base={860} seed={134} alto={40} />
      <Particulas t={t} tipo="luciernagas" n={20} seed={135} />
      {t < 850.4 ? <>
        <Persona x={420} y={1040} h={620} t={t} seed={1} viejo expr={t > 847.5 ? "feliz" : "neutro"} mira={0.6} bD={t > 847.5 ? 70 : 10} cD={40} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><Diploma x={1150} y={540} s={1.4} t={t} t0={847.3} /></div>
        <Chip t={t} t0={845.35} text="SOME GOT LUCKY" color={C.lima} tinta={C.noche} x={160} y={140} size={56} />
        <Chip t={t} t0={847.73} text="HONORABLE DISCHARGE" color={C.violeta} x={160} y={260} size={56} />
        <Chip t={t} t0={849.39} text="HONESTA MISSIO" color={C.oro} tinta={C.noche} x={1150} y={920} centro size={60} />
      </> : <>
        <Casa x={1500} y={760} s={1.1} luz />
        <Persona x={760} y={1040} h={620} t={t} seed={1} viejo expr="feliz" mira={0.3} />
        <Persona x={1020} y={1040} h={580} t={t} seed={320} ropa={CIVIL(2)} expr="feliz" mira={-0.3} aparece={851.6} />
        {t > 855.2 && [0, 1].map((i) => <Persona key={i} x={1240 + i * 160} y={1040} h={320} t={t} seed={330 + i} ropa={CIVIL(5 + i)} expr="feliz" aparece={855.3 + i * 0.15} salta={Math.abs(Math.sin((t + i) * 6)) * 14} />)}
        {t > 852.2 && <Emote t={t} t0={852.3} tipo="brillos" x={890} y={560} s={1.4} />}
        <Chip t={t} t0={850.51} text="SETTLED DOWN" color={C.violeta} x={160} y={140} size={56} />
        <Chip t={t} t0={851.61} text="FINALLY MARRIED" color={C.rojo} x={160} y={260} size={56} />
        <Chip t={t} t0={855.29} text="KIDS MADE LEGAL. AT LAST." color={C.lima} tinta={C.noche} x={160} y={380} size={52} />
      </>}
    </Escena>

    {/* 200 · sus lápidas sobreviven: orgullosos no de las batallas, sino de los años */}
    <Escena t={t} t0={857.1} t1={866.3} zoom={0.04} entra="corte" golpes={[858.45, 859.93, 863.97, 865.71]}>
      <Ruta t={t} hora="tarde" dx={(t - 857) * 40} />
      <Particulas t={t} tipo="polvo" n={30} seed={136} />
      <Lapida x={960} y={560} s={1.5} t={t} t0={857.4} lineas={["D · M", "LVCIVS", "MIL · LEG · XX"]} grande={t > 865.6 ? "XXV" : ""} />
      {t > 859.4 && [0, 1, 2, 3].map((i) => <Lapida key={i} x={i < 2 ? 220 + i * 220 : 1480 + (i - 2) * 220} y={760} s={0.55} t={t} t0={859.5 + i * 0.12} lineas={["D · M", "VET"]} />)}
      <Chip t={t} t0={857.43} text="TOMBSTONES STILL SURVIVE" color={C.violeta} x={160} y={140} size={52} />
      <Chip t={t} t0={859.39} text="ALL OVER THE EMPIRE" color={C.teal} tinta={C.noche} x={160} y={260} size={52} />
      <Chip t={t} t0={863.67} text="NOT THE BATTLES" color={C.rojo} x={1160} y={140} size={52} />
      <Chip t={t} t0={864.85} text="THE YEARS THEY SERVED" color={C.lima} tinta={C.noche} x={1060} y={260} size={52} />
    </Escena>

    {/* 201 · 25. 26. A veces más. Lo tallaban en piedra como un marcador */}
    <Escena t={t} t0={866.3} t1={871.95} zoom={0.05} entra="zoom" golpes={[866.57, 867.55, 868.83, 871.53]}>
      <Interior t={t} tono="#d8c8a8" ventana={false} />
      <div style={{ position: "absolute", left: 300, top: 260, width: 860, height: 640, borderRadius: "40px 40px 0 0", background: "#b8a888", border: "12px solid #7a6a4a" }} />
      <Persona x={1500} y={1040} h={640} t={t} seed={396} ropa={CIVIL(3)} expr="neutro" flip {...pose("martillar", t, 1.4)} />
      <Particulas t={t} tipo="destellos" n={14} seed={141} />
      <div style={{ position: "absolute", left: 300, width: 860, top: 330, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 300, color: "#5a4a3a", textShadow: "6px 6px 0 #f2ead8, -4px -4px 0 #3a2a1a", transform: `scale(${ent(t, t < 867.55 ? 866.57 : t < 868.47 ? 867.55 : 868.47)})` }}>{t < 867.55 ? "25" : t < 868.47 ? "26" : "26+"}</div>
      <Chip t={t} t0={868.47} text="SOMETIMES MORE" color={C.rojo} x={730} y={800} centro size={56} />
      <Chip t={t} t0={869.79} text="CARVED INTO STONE" color={C.violeta} x={160} y={140} size={56} />
      <Grande t={t} t0={871.21} text="LIKE A SCORE" x={1300} y={200} size={100} color={C.oro} borde="#3a2a1a" />
    </Escena>

    {/* 202 · el pago sólo llega a los que siguen en pie */}
    <Escena t={t} t0={871.95} t1={875.8} zoom={0.04} entra="corte" golpes={[873.29, 875.05]}>
      <Cielo tipo="polvo" />
      <Colinas capas={["#a8784a", "#7a4a2a"]} base={820} seed={137} alto={40} />
      <Bolsa x={1480} y={520} s={1.4} t={t} t0={873.2} txt="PAYOUT" />
      {Array.from({ length: 10 }, (_, i) => <Soldadito key={i} x={180 + i * 120} y={940} s={1.3} t={t} seed={340 + i} cae={i % 2 ? 874.2 + i * 0.06 : undefined} />)}
      <Chip t={t} t0={872.11} text="AND REMEMBER" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={874.27} text="ONLY THE ONES STILL STANDING" color={C.rojo} x={160} y={260} size={52} />
    </Escena>

    {/* 203 · entre enfermedad, accidentes y guerra, cerca de la mitad nunca llegó al final */}
    <Escena t={t} t0={875.8} t1={884.3} zoom={0.05} entra="sube" banda={C.rojo} golpes={[876.17, 877.23, 877.83, 879.89, 883.69]}>
      <Valle t={t} hora="tarde" />
      {([[876.17, "DISEASE", C.lima], [877.23, "ACCIDENTS", C.ambar], [877.83, "WAR", C.rojo]] as const).map(([t0, txt, col], i) => <Chip key={txt} t={t} t0={t0} text={txt} color={col} tinta={col === C.rojo ? undefined : C.noche} x={160 + i * 520} y={140} size={60} />)}
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 10, r = Math.floor(i / 10), muere = i % 2 === 1;
        const tm = 879.9 + (i * 0.37) % 2.6;
        const cae = muere ? prog(t, tm, tm + 0.4) : 0;
        return <div key={i} style={{ position: "absolute", left: 150 + c * 165, top: 440 + r * 300, width: 120, height: 260, transform: `rotate(${cae * (i % 4 === 1 ? 85 : -85)}deg)`, transformOrigin: "60px 250px", filter: cae > 0.5 ? "grayscale(1)" : undefined }}>
          <Persona x={60} y={250} h={250} t={t} seed={350 + i} casco="legion" expr={muere && t > tm ? "triste" : "neutro"} />
        </div>;
      })}
      <Grande t={t} t0={879.65} text="ROUGHLY HALF  ½" y={330} size={100} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={881.77} text="NEVER REACHED YEAR 25" color={C.rojo} x={960} y={1000} centro size={56} />
    </Escena>

    {/* 204 · entonces, ¿era una trampa mortal? El giro */}
    <Escena t={t} t0={884.3} t1={888.3} entra="zoom" golpes={[886.55, 887.55]}>
      <Campamento t={t} hora="noche" tropa={false} />
      <AbsoluteFill style={{ background: "rgba(18,6,26,.55)" }} />
      <Craneo x={960} y={480} s={1.7} t={t} t0={885.4} />
      <Grande t={t} t0={884.49} text="SO... A DEATH TRAP?" y={150} size={110} color="#fff" />
      <Grande t={t} t0={887.09} text="HERE IS THE TWIST" y={880} size={130} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 205 · cientos de miles se anotaron igual, por voluntad: afuera era peor y más pobre */}
    <Escena t={t} t0={888.3} t1={896.8} zoom={0.04} entra="corte" golpes={[888.99, 890.67, 891.69, 894.87, 896.31]}>
      {t < 891.6 ? <>
        <Campo t={t} seco />
        {[0, 1].map((i) => <Casa key={i} x={200 + i * 1500} y={620} s={0.6} tono="#a89a8a" techo="#6a5a4a" />)}
        {Array.from({ length: 60 }, (_, i) => { const k = prog(t, 888.3 + (i % 15) * 0.08, 889.6 + (i % 15) * 0.08); const fx = 60 + (i % 15) * 128; return <Soldadito key={i} x={interpolate(k, [0, 1], [i % 2 ? -150 - (i % 15) * 40 : 2070 + (i % 15) * 40, fx])} y={420 + Math.floor(i / 15) * 150 + (i % 2) * 20} s={0.9 + Math.floor(i / 15) * 0.12} t={t} seed={400 + i} avanza={k < 1 ? 1 : 0} />; })}
        <Chip t={t} t0={888.53} text="HUNDREDS OF THOUSANDS" color={C.violeta} x={160} y={140} size={56} />
        <div style={{ position: "absolute", left: 1180, top: 160, transform: `rotate(-8deg) scale(${t > 890.39 ? 1 + 1.5 * (1 - prog(t, 890.39, 890.6)) : 0})`, padding: "10px 30px", border: `10px solid ${C.rojo}`, borderRadius: 16, fontFamily, fontWeight: 700, fontSize: 60, color: C.rojo, background: "rgba(255,255,255,.85)" }}>SIGNED UP. WILLINGLY.</div>
      </> : <>
        <Cielo tipo="polvo" />
        <Colinas capas={["#8a6a4a", "#5a4a3a"]} base={760} seed={138} alto={60} />
        {[0, 1, 2].map((i) => <Casa key={i} x={360 + i * 600} y={720} s={0.8} tono="#a89a8a" techo="#6a5a4a" />)}
        <Persona x={960} y={1040} h={560} t={t} seed={360} ropa={CIVIL(1)} expr="triste" ladea={6} />
        <Emote t={t} t0={893.9} tipo="lagrimas" {...L(960, 1040, 560)} s={1.1} />
        <Chip t={t} t0={891.97} text="OUTSIDE THE LEGION:" color="#2a1530" x={160} y={140} size={56} />
        <Chip t={t} t0={894.45} text="MORE DANGEROUS" color={C.rojo} x={160} y={260} size={56} />
        <Chip t={t} t0={895.81} text="MUCH POORER" color={C.ambar} tinta={C.noche} x={160} y={380} size={56} />
      </>}
    </Escena>

    {/* 206 · el ejército te daba de comer, médico, baños, sueldo y una chance real */}
    <Escena t={t} t0={896.8} t1={907.1} zoom={0.04} entra="barrido" golpes={[897.27, 899.97, 900.91, 901.65, 903.83, 905.81]}>
      <Campamento t={t} />
      <Persona x={200} y={1040} h={500} t={t} seed={360} ropa={CIVIL(1)} expr="triste" />
      <div style={{ position: "absolute", left: 250, top: 780, width: 140, height: 30, borderRadius: "0 0 70px 70px", background: "#c9c0b0", border: "5px solid #6a5a4a" }} />
      <Persona x={1720} y={1040} h={540} t={t} seed={1} casco="legion" expr="feliz" flip {...pose("comer", t)} />
      {([[897.27, "DAILY FOOD", "🍞"], [899.97, "A DOCTOR", "⚕"], [900.91, "A BATH", "♨"], [901.65, "A SALARY", "◉"]] as const).map(([t0, txt], i) => (
        <div key={txt} style={{ position: "absolute", left: 120 + i * 440, top: 260, width: 380, height: 220, borderRadius: 28, background: "#fff", border: `10px solid ${C.violeta}`, transform: `scale(${ent(t, t0)}) rotate(${(i % 2 ? 2 : -2)}deg)`, fontFamily, fontWeight: 700, fontSize: 48, color: "#2a1530", textAlign: "center", lineHeight: "200px" }}>{txt}</div>
      ))}
      {[0, 1, 2, 3].map((i) => <Tilde key={i} t={t} t0={[897.6, 900.2, 901.1, 901.9][i]} x={310 + i * 440} y={520} />)}
      <Grande t={t} t0={902.65} text="AND A REAL CHANCE" y={640} size={90} color="#fff" borde="#7a3d14" />
      <Chip t={t} t0={904.69} text="AT LAND & MONEY" color={C.violeta} x={960} y={850} centro size={56} />
      <Chip t={t} t0={905.39} text="YOUR FATHER NEVER HAD" color={C.rojo} x={960} y={960} centro size={52} />
    </Escena>

    {/* 207 · la Legión era un pésimo trato; sólo que mejor que todo lo demás */}
    <Escena t={t} t0={907.1} t1={911.7} zoom={0.04} entra="corte" golpes={[908.63, 909.97, 910.71]}>
      <Interior t={t} />
      <Balanza t={t} t0={909.4} inclina={-14} />
      {(() => { const a = interpolate(prog(t, 909.4, 910.2), [0, 1], [0, -14]), dy = Math.sin((a * Math.PI) / 180) * 360; return <>
        {t > 909.97 && <><Gladius x={560} y={500 - dy} s={0.5} rot={-30} /><Craneo x={680} y={510 - dy} s={0.3} t={t} t0={909.97} /></>}
        {t > 910.71 && <><Craneo x={1220} y={520 + dy} s={0.3} t={t} t0={910.71} /><div style={{ position: "absolute", left: 1320, top: 470 + dy, fontFamily, fontWeight: 700, fontSize: 44, color: "#5a5a6a" }}>HUNGER · PLAGUE</div></>}
      </>; })()}
      <Chip t={t} t0={909.97} text="THE LEGION" color={C.rojo} x={280} y={660} size={48} />
      <Chip t={t} t0={910.71} text="EVERYTHING ELSE" color="#5a5a6a" x={1180} y={570} size={48} />
      <Grande t={t} t0={907.51} text="A TERRIBLE DEAL." y={190} size={110} color="#fff" borde={C.rojo} />
      <Grande t={t} t0={909.59} text="JUST A BETTER ONE" y={900} size={90} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 208 · al retirarse, muchos se quedaron en los pueblos que crecieron junto a los fuertes */}
    <Escena t={t} t0={911.7} t1={919.6} zoom={0.04} entra="iris" ix={960} iy={600} golpes={[913.43, 914.59, 916.87, 918.97]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#c9774a", "#9a4a3a"]} base={860} seed={139} alto={40} />
      {(() => { const k = prog(t, 914.4, 918.8); return <>
        <div style={{ position: "absolute", left: 760, top: 520, width: 400, height: 260, background: "#a89070", border: "10px solid #6a5a3a", opacity: 1 - k * 0.6 }} />
        {Array.from({ length: 16 }, (_, i) => { const t0 = 914.8 + i * 0.22; return t > t0 && <Casa key={i} x={960 + (i % 2 ? 1 : -1) * (300 + Math.floor(i / 2) * 110)} y={820 - (i % 3) * 30} s={0.5 + k * 0.2} luz={k > 0.6} />; })}
      </>; })()}
      <Persona x={960} y={1040} h={460} t={t} seed={1} viejo expr="feliz" camina={t < 913.5 ? 1.2 : 0} />
      <Chip t={t} t0={913.01} text="FINALLY RETIRED" color={C.lima} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={914.59} text="TOWNS GREW AROUND THE OLD FORTS" color={C.violeta} x={160} y={260} size={50} />
      <Grande t={t} t0={918.51} text="SOME ARE STILL THERE" y={480} size={110} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 209 · Colonia, York, Viena: ciudades que existen porque unos hombres cansados dijeron basta */}
    <Escena t={t} t0={919.6} t1={928.6} zoom={0.04} entra="corte" golpes={[919.85, 920.67, 921.31, 924.37, 927.85]}>
      {t < 923.2
        ? <MapaPuntos t={t} pulsa={["COLOGNE", "YORK", "VIENNA"]} t0Pulsa={919.85} />
        : <>
          <Cielo tipo="noche" />
          <Ciudad x={960} y={700} s={1.4} nombre="" seed={7} luz />
          <Persona x={960} y={1040} h={480} t={t} seed={1} viejo expr="feliz" ladea={-3} />
          {t > 925.6 && <Emote t={t} t0={925.7} tipo="sudor" {...L(960, 1040, 480)} />}
        </>}
      <Chip t={t} t0={919.85} text="COLOGNE" color={C.rojo} x={160} y={140} size={60} t1={923.2} />
      <Chip t={t} t0={920.67} text="YORK" color={C.violeta} x={160} y={260} size={60} t1={923.2} />
      <Chip t={t} t0={921.31} text="VIENNA" color={C.teal} tinta={C.noche} x={160} y={380} size={60} t1={923.2} />
      <Chip t={t} t0={923.51} text="A FEW THOUSAND EXHAUSTED MEN" color={C.violeta} x={160} y={140} size={50} />
      <Chip t={t} t0={925.43} text="WITH BAD KNEES" color={C.rojo} x={160} y={260} size={52} />
      <Grande t={t} t0={926.85} text="“FAR ENOUGH.”" y={420} size={140} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 210 · CTA: suscribite y activá la campana */}
    <Escena t={t} t0={928.6} t1={933.4} entra="sube" banda={C.rojo} golpes={[932.27, 932.95]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Particulas t={t} tipo="destellos" n={30} seed={140} />
      <Persona x={360} y={1040} h={640} t={t} seed={1} viejo expr="feliz" habla bD={120} cD={30} />
      <Chip t={t} t0={928.97} text="25 YEARS IN ROMAN SANDALS" color={C.violeta} x={760} y={200} size={56} />
      <Suscribir t={t} t0={931.4} tClick={932.27} x={1160} y={520} />
      <Campana x={1160} y={820} s={1.0} t={t} t0={932.6} t0b={932.95} />
    </Escena>

    {/* 211 · la próxima: nos subimos a un barco; contame cuál trampa te agarraba primero */}
    <Escena t={t} t0={933.4} t1={940.55} zoom={0.04} entra="corte" golpes={[935.41, 936.55, 938.33]}>
      {t < 936.0 ? <>
        <Cielo tipo="dia" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: "linear-gradient(180deg, #2f8fd6, #1a4a8a)" }} />
        <Barco x={interpolate(t, [933.4, 936], [400, 1100])} y={700} s={1.4} t={t} />
        <Chip t={t} t0={933.67} text="NEXT TIME" color={C.violeta} x={160} y={140} size={60} />
        <Grande t={t} t0={934.85} text="WE JOIN A SHIP" y={320} size={130} color="#fff" borde="#1a4a8a" />
      </> : <>
        <Tablero t={t} t0={935.9} en={Math.floor(((t - 937.4) * 2.5) % 7 + 7) % 7} de={0} hecho={0} />
        <Grande t={t} t0={936.05} text="WHICH TRAP" x={760} y={170} size={100} color="#fff" borde="#5e0f1d" />
        <Grande t={t} t0={936.3} text="GETS YOU FIRST?" x={760} y={300} size={100} color="#fff" borde="#5e0f1d" />
        <Chip t={t} t0={936.47} text="TELL ME IN THE COMMENTS" color={C.oro} tinta={C.noche} x={1450} y={170} centro size={50} />
      </>}
    </Escena>
  </>
);
