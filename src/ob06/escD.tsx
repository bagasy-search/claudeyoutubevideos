// ob06 · escenas 15-21 (lactosa, el galón, Dee y los 20 minutos, la clínica, la barra 47, grelina y vago)
import React from "react";
import { interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Escena } from "../anikit/escena";
import { Celular } from "../anikit/props";
import { PAL, OWEN, DEE, ABRIGO, SENORA, OBRERO, ESTUDIANTE, RIM, VERDE } from "../owen/elenco";
import { ENFERMERA } from "../owen/extras_b";
import { ROJO } from "../owen/cartel";
import { Persona } from "../owen/b/gente";
import { PlanB, Pizarra, GloboM, FuenteB } from "../owen/b/lib";
import { Auto } from "../owen/mundo/bus";
import { Ashland, ASH_CARRIL } from "../owen/mundo/ashland";
import { TwoFlatCorte, TF_PISO, TF_PUNTOS } from "../owen/mundo/twoflat";
import { Halden, HAL_PISO, HAL_PUNTOS } from "../owen/mundo/halden";
import { AMARILLO, cl, panza, Txt, CeluGrande, F_HUD, F_MANO } from "./comun6";
import { Torso, TextoW, Flecha, Charco, pop, tw, Escenario, Galon, Barra } from "./kit6";

const LOTITO = { estilo: "palo", camisa: "#f2ede0", manga: "larga", pantalon: "#2a2a30", zapatos: "#1d1d22", accesorios: [{ t: "pelo", forma: "corto", color: "#2a1a12" }, { t: "barba", color: "#2a1a12" }] } as unknown as typeof OWEN;
const LECHE = "#f4f8fb";
const FUENTE_LAC = "NIH MedlinePlus Genetics: lactose intolerance";
const HP = HAL_PISO;
const SENT = { pI: 85, rI: -80, pD: 88, rD: -85 };
const pisoOsc = (y = 900, color = "#0e160c", luz = "#c8ff5a") => <><rect x={-2000} y={y} width={6000} height={900} fill={color} /><Charco x={960} y={y + 6} rx={700} color={luz} fuerza={0.25} /></>;
const Hedor: React.FC<{ x: number; y: number; f: number; o?: number; color?: string }> = ({ x, y, f, o = 1, color = "#9ad84a" }) => (
  <g opacity={o}>{[-30, 0, 30].map((dx, i) => <path key={i} d={`M${x + dx},${y} q${14 * Math.sin(f / 6 + i)},-30 0,-60 q${-14 * Math.sin(f / 6 + i)},-30 0,-60`} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />)}</g>
);
// molécula de lactosa: dos anillos unidos (glucosa + galactosa)
const Lactosa: React.FC<{ x: number; y: number; s?: number; corte?: number }> = ({ x, y, s = 1, corte = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * (95 + corte * 70)},${corte * sd * 20}) rotate(${corte * sd * 18})`}>
      <path d="M-60,0 L-30,-52 L30,-52 L60,0 L30,52 L-30,52 Z" fill={sd < 0 ? "#bfe0ff" : "#ffd8e8"} stroke="#2a3a4a" strokeWidth={8} />
      <text y={14} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#2a3a4a" textAnchor="middle">{sd < 0 ? "GLU" : "GAL"}</text>
    </g>)}
    {corte < 0.15 && <path d="M-35,0 H35" stroke="#2a3a4a" strokeWidth={10} />}
  </g>
);
const Tijera: React.FC<{ x: number; y: number; s?: number; cierra?: number }> = ({ x, y, s = 1, cierra = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={-34} cy={46} r={22} fill="none" stroke="#ff8a5a" strokeWidth={10} /><circle cx={34} cy={46} r={22} fill="none" stroke="#ff8a5a" strokeWidth={10} />
    <g transform={`rotate(${-14 + cierra * 14})`}><path d="M-22,30 L40,-70" stroke="#ff8a5a" strokeWidth={12} strokeLinecap="round" /></g>
    <g transform={`rotate(${14 - cierra * 14})`}><path d="M22,30 L-40,-70" stroke="#ff8a5a" strokeWidth={12} strokeLinecap="round" /></g>
  </g>
);
const Vaso: React.FC<{ s?: number; nivel?: number }> = ({ s = 1, nivel = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d={`M-50,${-130 + (1 - nivel) * 220} L50,${-130 + (1 - nivel) * 220} L42,90 L-42,90 Z`} fill={LECHE} />
    <path d="M-60,-140 L60,-140 L48,96 L-48,96 Z" fill="none" stroke="#bcd0dc" strokeWidth={6} />
  </g>
);
const Pensamiento: React.FC<{ x: number; y: number; p: number; w?: number; h?: number; lado?: 1 | -1; children: React.ReactNode }> = ({ x, y, p, w = 260, h = 180, lado = -1, children }) => (
  <g transform={`translate(${x},${y}) scale(${p})`}>
    {[[lado * (w + 40), h + 20, 18], [lado * (w - 10), h - 20, 28]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fbf8f1" stroke="#221c18" strokeWidth={4} />)}
    <ellipse rx={w} ry={h} fill="#fbf8f1" stroke="#221c18" strokeWidth={5} />
    {children}
  </g>
);

// ====================== r15 · a Lotito le caían mal ======================
export const r15: PlanB = {
  a: 206.3, b: 207.6, trans: { tipo: "corte" },
  sfx: [[206.4, "fail", -6], [206.9, "gasp", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Escenario} pal={PAL} seed={6150} mano={1.5}
          claves={[mira(0, 960, 560, 1.6), mira(k(207.6), 960, 560, 1.75)]}
          medio={<>
            <Persona look={LOTITO} seed={78} escala={1.4} luz={{ lado: -1, color: "#c8ff5a", fuerza: 0.8 }} ruta={[{ f: 0, x: 900, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 110, hI: 30, cI: 110, tronco: 14, cabeza: 10 } }]} caras={[{ f: 0, v: "asco" }]} />
            <Hedor x={900} y={340} f={f} o={tw(f, k(206.4), k(206.8))} />
            <TextoW x={1220} y={500} t="THEY MADE HIM SICK" tam={44} color="#c8ff5a" f={f} desde={k(206.4)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// la lactosa; los bebés la digieren (lactasa = tijera)
export const r15b: PlanB = {
  a: 207.6, b: 211.9, trans: { tipo: "barrido", d: 8 },
  sfx: [[207.7, "whoosh"], [208.0, "pour", -6, { dur: 1 }], [208.8, "pop", -2], [209.9, "pop", -2], [210.6, "metal", -6], [211.0, "sparkle", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const bebe = f > k(209.9);
      const corte = tw(f, k(210.6), k(211.1));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16222e", luz: "#e9f4f6" }} seed={6151} mano={1}
          claves={[mira(0, 960, 540, 1.0), mira(k(211.9), 960, 540, 1.05)]}
          medio={<>
            {!bebe ? <g transform={`translate(520,620) scale(${pop(f, k(207.8))})`}><Vaso s={1.6} nivel={1} /></g>
              : <g transform={`translate(500,640) scale(${pop(f, k(209.9))})`}>
                {/* bebé con mamadera */}
                <ellipse cx={0} cy={120} rx={130} ry={110} fill="#f3d9c4" stroke="#2a2420" strokeWidth={5} />
                <circle cx={0} cy={-60} r={140} fill="#f3d9c4" stroke="#2a2420" strokeWidth={6} />
                <circle cx={-48} cy={-80} r={14} fill="#2a2420" /><circle cx={48} cy={-80} r={14} fill="#2a2420" />
                <ellipse cx={-80} cy={-30} rx={24} ry={14} fill="#ff9ab0" opacity={0.7} /><ellipse cx={80} cy={-30} rx={24} ry={14} fill="#ff9ab0" opacity={0.7} />
                <g transform={`rotate(${-30 + Math.sin(f / 5) * 4}) translate(60,-10)`}><rect x={0} y={-30} width={170} height={60} rx={20} fill={LECHE} stroke="#bcd0dc" strokeWidth={5} /><path d="M0,-14 L-36,0 L0,14 Z" fill="#e8b46a" /></g>
                <path d="M-90,-170 q30,-40 60,0" stroke="#2a2420" strokeWidth={6} fill="none" />
              </g>}
            <Lactosa x={1300} y={500} s={1.5} corte={corte} />
            {bebe && <Tijera x={1300} y={300 + (1 - tw(f, k(210.0), k(210.6))) * -200} s={1.2} cierra={corte} />}
            <TextoW x={1300} y={760} t={bebe ? (corte > 0.5 ? "LACTASE CUTS IT ✓" : "BABIES: LACTASE") : "LACTOSE = MILK SUGAR"} tam={56} color={bebe ? "#ff8a5a" : "#bfe0ff"} f={f} desde={k(208.8)} />
          </>}
          hud={<FuenteB texto={FUENTE_LAC} desde={k(208.8)} hasta={k(211.8)} />} />
      );
    };
    return <Pl />;
  },
};
// 2 de cada 3 adultos la pierden
export const r15c: PlanB = {
  a: 211.9, b: 217.6, trans: { tipo: "corte" },
  sfx: [[212.0, "pop", -2], [212.3, "pop", -2], [212.6, "pop", -2], [213.0, "pour", -8, { dur: 1 }], [214.2, "fail", -6], [214.6, "gasp", -6], [215.4, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const mal = tw(f, k(214.0), k(214.6));
      const gente = [SENORA, OBRERO, ESTUDIANTE];
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16222e", luz: "#e9f4f6" }} seed={6152} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(217.6), 960, 560, 1.05)]}
          detras={pisoOsc(900, "#101820", "#e9f4f6")}
          medio={<>
            {gente.map((g, i) => {
              const enfermo = i < 2;
              const x = 520 + i * 440;
              return <g key={i} opacity={tw(f, k(212.0 + i * 0.3), k(212.3 + i * 0.3))}>
                <Persona look={g} seed={300 + i} escala={1.5} luz={{ lado: 1, color: enfermo && mal > 0 ? "#c8ff5a" : "#e9f4f6", fuerza: 0.6 }} ruta={[{ f: 0, x, y: 900 }]} dir={[{ f: 0, v: i === 2 ? -1 : 1 }]}
                  poses={enfermo ? [{ f: 0, v: { hD: 60, cD: 100 } }, { f: k(213.0), v: { hD: 108, cD: 125, cabeza: -14 } }, { f: k(214.0), v: { hD: 30, cD: 110, hI: 30, cI: 110, tronco: 14, cabeza: 10 } }] : [{ f: 0, v: { hD: 60, cD: 100 } }, { f: k(213.0), v: { hD: 108, cD: 125, cabeza: -14 } }, { f: k(214.4), v: { hD: 140, cD: 20, hI: 10, cI: 30 } }]}
                  caras={enfermo ? [{ f: 0, v: "feliz" }, { f: k(214.0), v: "asco" }] : [{ f: 0, v: "feliz" }, { f: k(214.4), v: "risa" }]}
                  enManoD={(ff: number) => (enfermo && ff > k(214.0)) ? null : <Vaso s={0.4} nivel={interpolate(ff, [k(213.0), k(214.0)], [1, 0.3], cl)} />} />
                {enfermo && <Hedor x={x} y={430} f={f} o={mal} />}
                {enfermo && mal > 0.5 && <g transform={`translate(${x},310) scale(${pop(f, k(214.6) + i * 6)})`}><circle r={46} fill={ROJO} /><path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke="#fff" strokeWidth={10} /></g>}
                {!enfermo && mal > 0.5 && <g transform={`translate(${x},310) scale(${pop(f, k(215.2))})`}><circle r={46} fill="#3aa86a" /><path d="M-22,0 L-6,18 L24,-18" stroke="#fff" strokeWidth={10} fill="none" /></g>}
              </g>;
            })}
            <TextoW x={960} y={200} t={f < k(214.0) ? "ADULTS" : "2 OUT OF 3 LOSE IT"} tam={64} color={f < k(214.0) ? "#f4efe4" : "#ff8a5a"} f={f} desde={k(212.0)} />
          </>}
          hud={<FuenteB texto={FUENTE_LAC} desde={0} hasta={k(217.5)} />} />
      );
    };
    return <Pl />;
  },
};
// la lactasa cae con la edad (gráfico)
export const r15d: PlanB = {
  a: 217.6, b: 220.8, trans: { tipo: "corte" },
  sfx: [[217.7, "whoosh"], [218.0, "roll", -4, { dur: 1.6 }], [219.8, "fail", -8]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const p = tw(f, k(217.9), k(219.8));
      const X0 = 300, Y0 = 860, W = 1340, H = 560;
      const yv = (t: number) => (t < 0.12 ? 1 : t < 0.35 ? 1 - ((t - 0.12) / 0.23) * 0.85 : 0.15);
      const pts = Array.from({ length: 41 }).map((_, i) => i / 40).filter((t) => t <= p);
      const d = pts.map((t, i) => `${i ? "L" : "M"}${X0 + t * W},${Y0 - yv(t) * H}`).join(" ");
      const last = pts[pts.length - 1] ?? 0;
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16222e", luz: "#e9f4f6" }} seed={6153} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(220.8), 960, 560, 1.04)]}
          medio={<>
            <path d={`M${X0},${Y0 - H - 40} V${Y0} H${X0 + W + 40}`} stroke="#c9d4dc" strokeWidth={6} fill="none" />
            {["BABY", "CHILD", "TEEN", "ADULT"].map((t, i) => <text key={t} x={X0 + [0.04, 0.2, 0.38, 0.75][i] * W} y={Y0 + 60} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#c9d4dc" textAnchor="middle">{t}</text>)}
            <text x={X0 - 20} y={Y0 - H - 60} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#ff8a5a">LACTASE</text>
            <path d={d} stroke="#ff8a5a" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.length > 0 && <circle cx={X0 + last * W} cy={Y0 - yv(last) * H} r={20} fill="#ff8a5a" stroke="#fff" strokeWidth={5} />}
            <TextoW x={1280} y={420} t="YOUR BODY MAKES LESS" tam={56} color="#f4efe4" f={f} desde={k(218.6)} />
          </>}
          hud={<FuenteB texto={FUENTE_LAC} desde={0} hasta={k(220.7)} />} />
      );
    };
    return <Pl />;
  },
};
// tomar leche toda la vida es la excepción
export const r15e: PlanB = {
  a: 220.8, b: 223.1, trans: { tipo: "corte" },
  sfx: [[220.9, "slam", -2], [221.2, "sparkle", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const st = pop(f, k(220.9));
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#221c0c", luz: AMARILLO }} seed={6154} mano={1}
          claves={[mira(0, 960, 600, 1.3), mira(k(223.1), 960, 600, 1.4)]}
          detras={pisoOsc(900, "#1a1408", AMARILLO)}
          medio={<>
            <g transform={`translate(1360,430) scale(${st}) rotate(${(1 - st) * 40})`}><path d="M0,-170 L48,-58 L168,-52 L74,24 L106,140 L0,74 L-106,140 L-74,24 L-168,-52 L-48,-58 Z" fill={AMARILLO} stroke="#8a6a1a" strokeWidth={8} /></g>
            <Persona look={ESTUDIANTE} seed={302} escala={1.35} luz={{ lado: 1, color: AMARILLO, fuerza: 0.6 }} ruta={[{ f: 0, x: 960, y: 900 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 30, hI: 145, cI: 15 } }]} caras={[{ f: 0, v: "risa" }]} enManoD={() => <Vaso s={0.4} nivel={0.6} />} />
            <TextoW x={960} y={200} t="THE EXCEPTION, NOT THE RULE" tam={56} color={AMARILLO} f={f} desde={k(221.0)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r16 · un galón de leche: no pasa nada ======================
export const r16: PlanB = {
  a: 223.1, b: 226.8, trans: { tipo: "cortina", lado: 1 },
  sfx: [[223.2, "door", -8], [223.6, "pour", -2, { dur: 2 }], [225.7, "ding", -6], [226.0, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = TF_PUNTOS.heladera - 230, P = TF_PISO;
      const nivel = interpolate(f, [k(223.6), k(225.6)], [1, 0], cl);
      const bebe = f < k(225.6);
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={6160} mano={1.5}
          claves={[mira(0, X + 80, 590, 2.4), mira(k(226.8), X + 80, 580, 2.6)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]}
              poses={bebe ? [{ f: 0, v: { hD: 165, cD: 35, cabeza: -26, tronco: -8 } }] : [{ f: 0, v: { hD: 40, cD: 20, hI: 140, cI: 20 } }]}
              caras={[{ f: 0, v: "determinado" }, { f: k(225.7), v: "duda" }]}
              enManoD={() => bebe ? <g transform="rotate(150) translate(0,-30)"><Galon s={0.42} nivel={nivel} /></g> : <Galon s={0.42} nivel={0} />} />
            {!bebe && <path d={`M${X + 6},${P - 362} q14,8 28,0`} stroke={LECHE} strokeWidth={8} fill="none" strokeLinecap="round" />}
            <TextoW x={X + 170} y={P - 400} t={bebe ? "1 GALLON" : "NOTHING\nHAPPENS."} tam={bebe ? 40 : 34} color={bebe ? "#f4efe4" : AMARILLO} f={f} desde={k(223.3)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r17 · miércoles: la clínica llama; Dee maneja; «20 minutos» ======================
export const r17: PlanB = {
  a: 226.8, b: 231.4, trans: { tipo: "barrido", d: 10 },
  sfx: [[226.9, "phone_buzz", 0], [227.6, "phone_buzz", -2], [228.4, "type", -10, { dur: 1.6 }], [230.4, "gasp", -10]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const X = TF_PUNTOS.mesa + 120, P = TF_PISO;
      return (
        <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "tarde" }} seed={6170} mano={1.5}
          claves={[mira(0, X + 300, 600, 2.1), mira(k(231.4), X + 300, 600, 2.2)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.tubo} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 20, cD: 30 } }, { f: k(227.0), v: { hD: 70, cD: 120, cabeza: 14 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(228.0), v: "duda" }, { f: k(230.2), v: "miedo" }]}
              enManoD={(ff: number) => ff > k(227.0) ? <Celular s={0.9} brillo="#7ab8ff" /> : null} />
          </>}
          hud={<>
            <Txt t="WEDNESDAY" a={k(226.9)} b={k(228.6)} f={f} top={150} tam={64} color={VERDE} chip />
            <CeluGrande x={1180} y={130} desde={k(227.0)} f={f} de="HALDEN CLINIC" icono="H" color="#2a6fd6" hora="11:40" vibra={k(227.0)}
              lineas={["Routine check-in.", "Fulton Market · 4 PM", "Fourth floor."]} escribe={k(227.6)} vel={1.6} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// Dee insiste en llevarlo, para frente al edificio blanco sin cartel
const EDIF = 1500;
const EdificioBlanco: React.FC = () => (
  <g transform={`translate(${EDIF},${ASH_CARRIL - 80})`}>
    <rect x={-330} y={-1100} width={660} height={1100} fill="#f4f6f8" stroke="#c9d0d8" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-280 + (i % 4) * 150} y={-1040 + Math.floor(i / 4) * 230} width={110} height={150} fill="#cfdce6" />)}
    <rect x={-70} y={-260} width={140} height={260} fill="#9fb0bc" /><rect x={-4} y={-260} width={8} height={260} fill="#f4f6f8" />
    <rect x={-160} y={-330} width={320} height={50} rx={6} fill="#e9eef2" stroke="#c9d0d8" strokeWidth={4} />
  </g>
);
export const r17b: PlanB = {
  a: 231.4, b: 237.42, trans: { tipo: "corte" },
  sfx: [[231.5, "keys", -4], [232.0, "car_door", -4], [232.4, "street", -14, { dur: 3 }], [233.6, "car_door", -6], [234.4, "bus_brake", -14], [235.6, "pop", -2], [236.2, "tick", -6], [236.8, "tick", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const cx = interpolate(f, [k(232.4), k(233.8)], [-400, EDIF - 420], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
      const llega = f > k(233.8);
      const t = Math.max(0, Math.floor(interpolate(f, [k(235.6), k(237.4)], [1200, 1197], cl)));
      return (
        <Escena Set={Ashland} pal={PAL} setProps={{ hora: "tarde", centro: () => 1300, autos: 1 }} seed={6171} mano={1.5}
          claves={f < k(233.8) ? [mira(0, 900, 760, 1.3), mira(k(233.8), EDIF - 300, 760, 1.3, { curva: "inout" })] : [mira(k(233.8), EDIF - 300, 760, 1.3), mira(k(235.4), EDIF - 380, 800, 1.75, { curva: "inout" }), mira(k(237.42), EDIF - 380, 800, 1.85)]}
          medio={<>
            <EdificioBlanco />
            {f < k(232.4) && <>
              <Persona look={DEE} seed={30} luz={RIM.sol} ruta={[{ f: 0, x: 700, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 150, cD: 10 } }]} caras={[{ f: 0, v: "determinado" }]} habla={[[k(231.5), k(232.3)]]}
                enManoD={() => <g><circle r={10} fill="none" stroke="#c9ced2" strokeWidth={4} /><rect x={6} y={-4} width={30} height={8} fill="#c9ced2" /></g>} />
              <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: 980, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "duda" }]} />
              <GloboM x={700} y={ASH_CARRIL - 360} texto={"I'm driving."} desde={k(231.5)} hasta={k(232.4)} tam={34} lado={1} />
            </>}
            <Auto x={f < k(232.4) ? 840 : cx} y={ASH_CARRIL - 20} color="#3a6a9a" dir={1} rueda={cx * 0.6} />
            {llega && <>
              <Persona look={DEE} seed={30} luz={RIM.sol} ruta={[{ f: 0, x: EDIF - 700, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 30, cD: 60 } }, { f: k(235.4), v: { hD: 150, cD: 10 } }]} caras={[{ f: 0, v: "determinado" }]} habla={[[k(235.4), k(237.3)]]} />
              <Persona look={OWEN} seed={47} luz={RIM.sol} ruta={[{ f: 0, x: EDIF - 520, y: ASH_CARRIL - 80 }, { f: k(235.0), x: EDIF - 520, y: ASH_CARRIL - 80 }, { f: k(237.42), x: EDIF - 120, y: ASH_CARRIL - 80 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: {} }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(236.0), v: { x: 1, y: 0 } }]} />
              <GloboM x={EDIF - 720} y={ASH_CARRIL - 230} texto={"20 minutes."} desde={k(235.4)} hasta={k(237.42)} tam={34} lado={-1} />
              <g transform={`translate(${EDIF - 160},${ASH_CARRIL - 580}) scale(${pop(f, k(235.6))})`}>
                <rect x={-150} y={-62} width={300} height={124} rx={24} fill="#0b1014" stroke={ROJO} strokeWidth={6} />
                <text y={30} fontFamily={F_HUD} fontWeight={600} fontSize={84} fill="#ff6a5a" textAnchor="middle">{`${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`}</text>
              </g>
            </>}
          </>} />
      );
    };
    return <Pl />;
  },
};
// «si no volvés en 20 minutos llamo a la policía»
export const r17c: PlanB = {
  a: 237.42, b: 240.12, trans: { tipo: "corte" },
  sfx: [[237.5, "phone_buzz", -8], [238.2, "beep", -6], [238.6, "beep", -6], [239.0, "beep", -6], [239.6, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#16202a", luz: "#7ab8ff" }} seed={6172} mano={1}
          claves={[mira(0, 900, 560, 1.6), mira(k(240.12), 900, 560, 1.75)]}
          detras={pisoOsc(900, "#0e141a", "#7ab8ff")}
          medio={<>
            <Persona look={DEE} seed={30} escala={1.5} luz={{ lado: 1, color: "#7ab8ff", fuerza: 0.6 }} ruta={[{ f: 0, x: 760, y: 900 }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: { hD: 95, cD: 90 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(239.0), v: "enojo" }]} habla={[[k(237.5), k(240.0)]]}
              enManoD={() => <Celular s={1.1} brillo="#ff6a5a" />} />
            <g transform={`translate(1150,430) scale(${pop(f, k(238.1))})`}>
              <rect x={-160} y={-80} width={320} height={160} rx={30} fill="#0b1014" stroke="#ff6a5a" strokeWidth={6} />
              <text y={38} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill="#ff6a5a" textAnchor="middle">{"911".slice(0, Math.max(0, Math.min(3, Math.floor((f - k(238.1)) / 12) + 1)))}</text>
            </g>
            <TextoW x={1150} y={640} t="NOT BACK? POLICE." tam={44} color="#f4efe4" f={f} desde={k(238.4)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r18 · cuarto piso ======================
const BANDEJA = HAL_PUNTOS.mesa;
const Ascensor: React.FC<{ x: number; abre: number }> = ({ x, abre }) => (
  <g transform={`translate(${x},${HP})`}>
    <rect x={-170} y={-520} width={340} height={520} fill="#2a3038" />
    <rect x={-170} y={-520} width={170 - abre * 150} height={520} fill="#c9d0d8" stroke="#9aa2ae" strokeWidth={4} />
    <rect x={abre * 150} y={-520} width={170 - abre * 150} height={520} fill="#c9d0d8" stroke="#9aa2ae" strokeWidth={4} />
    <rect x={-60} y={-610} width={120} height={70} rx={10} fill="#0b1014" /><text y={-555} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#7dff6a" textAnchor="middle">4</text>
  </g>
);
export const r18: PlanB = {
  a: 240.12, b: 243.28, trans: { tipo: "fundido", d: 12 },
  sfx: [[240.2, "ding", -4], [240.5, "door", -8], [241.0, "drone", -16, { dur: 2 }], [241.6, "step", -6], [242.2, "step", -6], [242.8, "step", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const AX = 300;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6180} mano={1}
          claves={[mira(0, AX + 100, 560, 1.45), mira(k(243.28), AX + 260, 580, 1.4, { curva: "inout" })]}
          medio={<>
            <Ascensor x={AX} abre={tw(f, k(240.3), k(241.0))} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: AX, y: HP }, { f: k(241.4), x: AX, y: HP }, { f: k(243.2), x: AX + 380, y: HP }]} dir={[{ f: 0, v: 1 }]}
              poses={[{ f: 0, v: {} }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(241.8), v: { x: 1, y: 0 } }]} cartel={panza({ tam: 30, dy: -10 })} />
          </>}
          hud={<Txt t="4TH FLOOR · VERY QUIET" a={k(240.4)} b={k(243.2)} f={f} top={940} tam={46} color="#f4efe4" chip />} />
      );
    };
    return <Pl />;
  },
};
// la enfermera le toma la presión
export const r18b: PlanB = {
  a: 243.28, b: 247.56, trans: { tipo: "corte" },
  sfx: [[243.4, "step", -6], [244.0, "cloth", -6], [244.4, "pump", -4, { dur: 1.6 }], [246.0, "beep", -4], [246.6, "step", -6], [247.1, "step", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      const pres = tw(f, k(244.4), k(246.0));
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6181} mano={1}
          claves={[mira(0, S + 160, 600, 2.0), mira(k(247.56), S + 160, 600, 2.1)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 70, cD: 10 } }]} caras={[{ f: 0, v: "duda" }, { f: k(246.0), v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />
            {/* el manguito en el brazo y el monitor */}
            
            
            <Persona look={ENFERMERA} seed={98} luz={RIM.clinica} ruta={[{ f: 0, x: S + 320, y: HP }, { f: k(246.6), x: S + 320, y: HP }, { f: k(247.56), x: S + 700, y: HP }]} dir={[{ f: 0, v: -1 }, { f: k(246.6), v: 1 }]}
              poses={[{ f: 0, v: { hD: 45, cD: 60 } }, { f: k(246.6), v: {} }]} caras={[{ f: 0, v: "feliz" }]} habla={[[k(246.0), k(246.6)]]}
              enManoD={() => <g><rect x={-46} y={-60} width={92} height={120} rx={12} fill="#20242c" /><rect x={-38} y={-52} width={76} height={104} rx={6} fill="#eaf2ff" /><text y={-8} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#2a6fd6" textAnchor="middle">{f < k(246.0) ? `${Math.round(60 + pres * 58)}` : "118"}</text><text y={26} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#2a6fd6" textAnchor="middle">{f < k(246.0) ? "" : "/76"}</text></g>} />
            <TextoW x={S + 160} y={HP - 450} t={f < k(246.0) ? "BLOOD PRESSURE" : "118 / 76 ✓"} tam={44} color={f < k(246.0) ? "#2a3a4a" : "#2a8a4a"} borde="#ffffff" f={f} desde={k(244.4)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
// la bandeja de barras grises numeradas
const Bandeja: React.FC<{ quita?: number; f: number }> = ({ quita = 0 }) => (
  <g transform={`translate(${BANDEJA},${HP - 222})`}>
    <rect x={-160} y={-14} width={320} height={16} rx={6} fill="#c9ced2" />
    {Array.from({ length: 9 }).map((_, i) => { const n = 39 + i; if (quita && n === 47) return null; const fila = Math.floor(i / 3); return <g key={i} transform={`translate(${-96 + (i % 3) * 96},${-28 - fila * 34})`}><Barra n={n} s={0.5} resalta={n === 47} /></g>; })}
  </g>
);
export const r18c: PlanB = {
  a: 247.56, b: 252.82, trans: { tipo: "corte" },
  sfx: [[247.7, "whoosh", -6], [248.6, "paper", -6], [249.6, "pop", -6], [250.6, "pop", -6], [251.6, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6182} mano={1}
          claves={[mira(0, BANDEJA - 100, 640, 1.6), mira(k(249.4), BANDEJA, HP - 280, 3.2, { curva: "inout" }), mira(k(252.82), BANDEJA, HP - 280, 3.4)]}
          medio={<>
            <Bandeja f={f} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 60, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 10, cD: 20, tronco: 8 } }]} caras={[{ f: 0, v: "duda" }, { f: k(248.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} />
            <TextoW x={BANDEJA} y={HP - 380} t={f < k(250.6) ? "PLAIN GRAY BARS" : "EACH ONE NUMBERED"} tam={26} color="#2a3a4a" borde="#ffffff" f={f} desde={k(249.6)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r19 · arriba dice 47; el hombre del abrigo gris ======================
const ESQ = HAL_PUNTOS.camilla + 260;
const Hombre: React.FC<{ poses?: any[]; caras?: any[]; giros?: any[]; mano?: React.ReactNode | ((ff: number) => React.ReactNode); miradas?: any[] }> = ({ poses, caras, giros, mano, miradas }) => (
  <>
    <g transform={`translate(${ESQ},${HP})`}><rect x={-60} y={-70} width={120} height={14} rx={5} fill="#8a96a4" /><rect x={-60} y={-200} width={14} height={140} rx={5} fill="#8a96a4" /><rect x={-54} y={-58} width={10} height={58} fill="#6a7684" /><rect x={44} y={-58} width={10} height={58} fill="#6a7684" /></g>
    <Persona look={ABRIGO} seed={9} luz={{ lado: -1, color: "#b8c4cc", fuerza: 0.6 }} ruta={[{ f: 0, x: ESQ, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
      poses={poses ?? [{ f: 0, v: { ...SENT, hD: 60, cD: 130 } }]} caras={caras ?? [{ f: 0, v: "neutral" }]} giros={giros} miradas={miradas ?? [{ f: 0, v: { x: 1, y: 0 } }]} enManoD={mano as any} />
  </>
);
export const r19: PlanB = {
  a: 252.82, b: 255.6, trans: { tipo: "corte" },
  sfx: [[252.9, "pop", -2], [253.4, "heart1", -6], [254.4, "drone", -10, { dur: 1.2 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6190} mano={1}
          claves={[mira(0, BANDEJA, HP - 290, 3.6), mira(k(255.6), BANDEJA, HP - 290, 4.4, { curva: "in" })]}
          medio={<>
            <Bandeja f={f} />
            
            <TextoW x={BANDEJA} y={HP - 345} t="THE ONE ON TOP: 47" tam={20} color="#2a8a4a" borde="#ffffff" f={f} desde={k(253.0)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
const Halo6: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => <circle cx={x} cy={y} r={50 + Math.sin(f / 5) * 4} fill="none" stroke="#7dff6a" strokeWidth={3} opacity={0.8} />;
export const r19b: PlanB = {
  a: 255.6, b: 260.6, trans: { tipo: "corte" },
  sfx: [[255.7, "whoosh"], [256.4, "heart1", -4], [257.4, "drone", -10, { dur: 2.5 }], [259.4, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6191} mano={1}
          claves={[mira(0, (S + ESQ) / 2, 620, 1.15), mira(k(257.6), ESQ - 120, 640, 1.7, { curva: "inout" }), mira(k(260.6), ESQ - 100, 640, 1.8)]}
          medio={<>
            <Bandeja f={f} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 10, cD: 20 } }, { f: k(256.4), v: { ...SENT, hD: 40, cD: 120, hI: 40, cI: 120, tronco: -6 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(256.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
            <Hombre caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
            <TextoW x={ESQ - 330} y={HP - 330} t="THE MAN FROM STOP 30" tam={40} color="#2a3a4a" borde="#ffffff" f={f} desde={k(256.6)} />
            {f > k(259.4) && <TextoW x={ESQ - 330} y={HP - 270} t="he doesn't look at Owen" tam={30} color="#6a7684" borde="#ffffff" mano f={f} desde={k(259.5)} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r19c: PlanB = {
  a: 260.6, b: 266.16, trans: { tipo: "corte" },
  sfx: [[260.8, "paper", -8], [261.4, "eat", -10], [262.6, "eat", -10], [263.9, "glitch", -6], [264.2, "pop", 0]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const muerde = (Math.floor((f - k(260.6)) / 22) % 2) === 1;
      const nueve = f > k(263.86);
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6192} mano={1}
          claves={nueve ? [mira(k(263.86), ESQ + 40, 650, 2.5), mira(k(266.16), ESQ + 40, 650, 2.65)] : [mira(0, ESQ, 640, 2.3), mira(k(263.86), ESQ + 10, 640, 2.45)]}
          medio={<>
            <Hombre poses={[{ f: 0, v: { ...SENT, hD: muerde ? 62 : 30, cD: muerde ? 135 : 60 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
              mano={<g transform={`rotate(${muerde ? 40 : 70})`}><Barra n={9} s={0.5} abierta={1} mordida={0.4} /></g>} />
            {nueve && <TextoW x={ESQ + 180} y={770} t="№ 9" tam={44} color={ROJO} borde="#ffffff" f={f} desde={k(264.0)} />}
            {!nueve && <TextoW x={ESQ + 220} y={530} t="slowly…" tam={36} color="#6a7684" borde="#ffffff" mano f={f} desde={k(261.0)} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
// se acuerda del cuaderno: participante 9, de los primeros
export const r19d: PlanB = {
  a: 266.16, b: 270.8, trans: { tipo: "corte" },
  sfx: [[266.2, "paper", -4], [266.8, "write", -6, { dur: 1.4 }], [268.6, "write", -4], [269.2, "stamp", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      const nombres = ["Part. 3", "Part. 9", "Part. 12", "Part. 21", "Part. 33"];
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6193} mano={1}
          claves={[mira(0, S + 300, 560, 1.55), mira(k(270.8), S + 300, 560, 1.6)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 60, cD: 140, tronco: 4 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(268.8), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} />
            <Pensamiento x={S + 470} y={500} p={pop(f, k(266.3))} w={260} h={230} lado={-1}>
              <g transform="rotate(3)">
                <rect x={-190} y={-200} width={380} height={400} rx={8} fill="#efe8d6" stroke="#8a7a5a" strokeWidth={4} />
                {nombres.map((t, i) => { const tach = tw(f, k(266.8 + i * 0.3), k(267.0 + i * 0.3)); return <g key={t}>
                  {i === 1 && f > k(268.6) && <ellipse cx={-20} cy={-130 + i * 72} rx={130} ry={38} fill="none" stroke={ROJO} strokeWidth={6} />}
                  <text x={-120} y={-118 + i * 72} fontFamily={F_MANO} fontWeight={700} fontSize={48} fill="#2a2a2a">{t}</text>
                  <path d={`M-130,${-132 + i * 72} h${tach * 250}`} stroke={ROJO} strokeWidth={6} />
                </g>; })}
              </g>
            </Pensamiento>
            <TextoW x={S + 470} y={760} t="ONE OF THE FIRST" tam={40} color={ROJO} borde="#ffffff" f={f} desde={k(269.2)} />
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r20 · la panza ruge; come la barra; papel; 10 segundos ======================
export const r20: PlanB = {
  a: 270.8, b: 275.28, trans: { tipo: "corte" },
  sfx: [[270.9, "punch", -8], [271.3, "spring", -14], [272.4, "punch", -6], [273.2, "whoosh", -8], [274.2, "heart1", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      const onda = (f - k(270.9)) % 18 / 18;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6200} mano={1}
          claves={[mira(0, S + 40, 640, 2.4), mira(k(273.0), S + 40, 640, 2.4), mira(k(273.4), (S + ESQ) / 2, 620, 1.2, { curva: "inout" }), mira(k(275.28), (S + ESQ) / 2, 620, 1.25)]}
          medio={<>
            <Bandeja f={f} />
            <g transform={`translate(${[k(270.9), k(272.4)].reduce((a, t) => a + (f >= t && f < t + 12 ? Math.sin((f - t) * 2.3) * 8 * Math.exp(-(f - t) / 3) : 0), 0)},0)`}>
              <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
                poses={[{ f: 0, v: { ...SENT, hD: 20, cD: 110, hI: 20, cI: 110, tronco: 14 } }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0, y: 1 } }, { f: k(273.6), v: { x: 1, y: 0 } }]} />
            </g>
            {f < k(273.2) && [0, 1].map((i) => { const u = (onda + i / 2) % 1; return <ellipse key={i} cx={S + 10} cy={HP - 230} rx={40 + u * 120} ry={20 + u * 60} fill="none" stroke={AMARILLO} strokeWidth={6} opacity={1 - u} />; })}
            {f < k(273.2) && <TextoW x={S + 150} y={520} t="GRRRR" tam={50} color={AMARILLO} rot={-8} f={f} desde={k(270.9)} />}
            <Hombre caras={[{ f: 0, v: "neutral" }, { f: k(273.6), v: "duda" }]} giros={[{ f: 0, v: 0 }, { f: k(273.4), v: -0.8 }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(273.6), v: { x: -1, y: 0 } }]} />
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r20b: PlanB = {
  a: 275.28, b: 281.64, trans: { tipo: "corte" },
  sfx: [[275.4, "heart", -8, { dur: 3 }], [277.6, "paper", -6], [278.4, "paper", -4], [280.0, "pop", -6], [280.7, "eat", -2], [281.2, "eat", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      const tiembla = f < k(280.6) ? Math.sin(f * 2.4) * 4 : 0;
      const tiene = f > k(277.4);
      const abre = tw(f, k(278.0), k(279.4));
      const come = f > k(280.66);
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6201} mano={1}
          claves={[mira(0, S + 120, 620, 2.4), mira(k(281.64), S + 100, 600, 2.7)]}
          medio={<>
            <Bandeja f={f} quita={tiene ? 1 : 0} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 60, cD: 30, hI: 50, cI: 40 } }, { f: k(277.4), v: { ...SENT, hD: 35, cD: 60, hI: 30, cI: 60 } }, { f: k(280.6), v: { ...SENT, hD: 60, cD: 125 } }]}
              ajuste={(p: any) => ({ ...p, cD: (p.cD ?? 0) + tiembla, cI: (p.cI ?? 0) - tiembla })}
              caras={[{ f: 0, v: "miedo" }, { f: k(277.4), v: "determinado" }]} habla={come ? [[k(280.7), k(281.6)]] : undefined} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]}
              enManoD={() => tiene ? <g transform={`rotate(${come ? 100 : 10})`}><Barra n={47} s={0.6} abierta={abre} mordida={come ? 0.35 : 0} resalta /></g> : null}
              />
            {f < k(279.0) && <TextoW x={S + 300} y={520} t={"it's just food."} tam={38} color="#2a3a4a" borde="#ffffff" mano f={f} desde={k(276.6)} />}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r20c: PlanB = {
  a: 281.64, b: 286.34, trans: { tipo: "corte" },
  sfx: [[281.8, "eat", -4], [282.4, "paper", -4], [283.4, "suspense", -10, { dur: 2 }], [283.6, "clock", -4, { dur: 2.6 }]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      const seg = Math.min(10, Math.floor(interpolate(f, [k(283.4), k(286.3)], [0, 10], cl)));
      const reloj = f > k(283.4);
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6202} mano={1}
          claves={reloj ? [mira(k(283.4), S + 200, 560, 1.8), mira(k(286.34), S + 180, 580, 2.1, { curva: "in" })] : [mira(0, S + 100, 600, 2.7), mira(k(283.4), S + 100, 600, 2.9)]}
          medio={<>
            <Bandeja f={f} quita={1} />
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 35, cD: 60 } }, { f: k(283.4), v: { ...SENT, hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "asco" }, { f: k(283.0), v: "duda" }]} habla={[[0, k(282.8)]]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(283.4), v: { x: 0, y: 1 } }]} enManoD={(ff: number) => ff < k(283.0) ? <g transform="rotate(10)"><Barra n={47} s={0.6} abierta={1} mordida={0.7} resalta /></g> : null} />
            {!reloj && <g transform={`translate(${S + 200},${560}) scale(${pop(f, k(282.0))}) rotate(4)`}>
              <rect x={-130} y={-60} width={260} height={120} fill="#f4f1e6" stroke="#bdb6a8" strokeWidth={4} />{[0, 1, 2].map((i) => <path key={i} d={`M-100,${-26 + i * 26} h200`} stroke="#c9c0ac" strokeWidth={4} />)}
              <text y={86} fontFamily={F_MANO} fontWeight={700} fontSize={36} fill="#2a3a4a" textAnchor="middle">like paper.</text>
            </g>}
            {reloj && <g transform={`translate(${S + 330},${490}) scale(${pop(f, k(283.4)) * 0.85})`}>
              <circle r={120} fill="#fbf8f1" stroke="#2a3a4a" strokeWidth={10} />
              {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${Math.sin((i / 10) * Math.PI * 2) * 96},${-Math.cos((i / 10) * Math.PI * 2) * 96} L${Math.sin((i / 10) * Math.PI * 2) * 110},${-Math.cos((i / 10) * Math.PI * 2) * 110}`} stroke="#2a3a4a" strokeWidth={6} />)}
              <path d={`M0,0 L${Math.sin((seg / 10) * Math.PI * 2) * 90},${-Math.cos((seg / 10) * Math.PI * 2) * 90}`} stroke={ROJO} strokeWidth={10} strokeLinecap="round" />
              <text y={60} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill="#2a3a4a" textAnchor="middle">{`${seg}s`}</text>
            </g>}
          </>} />
      );
    };
    return <Pl />;
  },
};

// ====================== r21 · panza y cerebro conversan: grelina y nervio vago ======================
const TX = 760, TY = 640, TS = 0.92;
const CAB_Y = TY - 520 * TS, PANZA_Y = TY - 40 * TS;
export const r21: PlanB = {
  a: 286.34, b: 291.42, trans: { tipo: "luz", d: 12 },
  sfx: [[286.4, "whoosh_big", -6], [287.0, "beep", -10], [288.8, "pop", -4], [289.6, "pop", -4], [290.4, "pop", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const turno = Math.floor((f - k(288.7)) / 18);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: "#7ab8ff" }} seed={6210} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(291.42), 960, 560, 1.05)]}
          medio={<>
            <Torso x={TX} y={TY} s={TS} f={f} cara="duda" gorra est={{ acido: 0.3 }} cerebro={1} />
            {f > k(288.7) && <>
              <g transform={`translate(${TX + 360},${CAB_Y + 40}) scale(${turno % 2 === 0 ? 1 : 0.85})`} opacity={turno % 2 === 0 ? 1 : 0.5}><rect x={-150} y={-50} width={300} height={100} rx={40} fill="#ffb0cf" /><text y={16} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#2a1a22" textAnchor="middle">brain</text></g>
              <g transform={`translate(${TX + 360},${PANZA_Y}) scale(${turno % 2 === 1 ? 1 : 0.85})`} opacity={turno % 2 === 1 ? 1 : 0.5}><rect x={-150} y={-50} width={300} height={100} rx={40} fill="#e9a28a" /><text y={16} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#2a1a12" textAnchor="middle">stomach</text></g>
              <path d={`M${TX + 360},${CAB_Y + 100} V${PANZA_Y - 60}`} stroke="#f4efe4" strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-f * 3} />
            </>}
            <TextoW x={1420} y={300} t={f < k(288.7) ? "WHAT YOUR BODY DOES" : "CONSTANT\nCONVERSATION"} tam={58} color="#9fdcff" f={f} desde={k(286.5)} />
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r21b: PlanB = {
  a: 291.42, b: 297.66, trans: { tipo: "corte" },
  sfx: [[291.5, "punch", -10], [292.2, "popcluster", -8, { dur: 2 }], [294.6, "whoosh"], [295.8, "beep", -4], [296.6, "beep", -4]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const sube = tw(f, k(293.0), k(295.6));
      const grita = f > k(295.6);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#1e1408", luz: "#ff9a4a" }} seed={6211} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(297.66), 960, 560, 1.06)]}
          medio={<>
            <Torso x={TX} y={TY} s={TS} f={f} cara={grita ? "miedo" : "duda"} gorra est={{ acido: 0.2 }} cerebro={1} cerebroColor={grita ? "#ff8a5a" : "#ffb0cf"} />
            {Array.from({ length: 14 }).map((_, i) => {
              const u = Math.min(1, Math.max(0, sube * 1.4 - (i / 14) * 0.4));
              if (f < k(292.2) + i * 2) return null;
              const x = TX + Math.sin(i * 1.7) * 40 + Math.sin(f / 8 + i) * 10;
              const y = PANZA_Y - u * (PANZA_Y - CAB_Y - 60);
              return <circle key={i} cx={x} cy={y} r={14} fill="#ff9a4a" stroke="#fff" strokeWidth={3} />;
            })}
            <TextoW x={1420} y={560} t="GHRELIN" tam={80} color="#ff9a4a" f={f} desde={k(292.4)} />
            <TextoW x={1420} y={640} t="THE HUNGER HORMONE" tam={40} color="#f4efe4" f={f} desde={k(293.4)} />
            {grita && <g transform={`translate(${TX + 300},${CAB_Y - 30}) scale(${pop(f, k(295.6))})`}><rect x={-160} y={-56} width={320} height={112} rx={20} fill="#ff9a4a" stroke="#2a1a12" strokeWidth={5} /><text y={18} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#2a1a12" textAnchor="middle">FIND FOOD!</text></g>}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r21c: PlanB = {
  a: 297.66, b: 307.4, trans: { tipo: "corte" },
  sfx: [[297.8, "eat", -4], [298.4, "eat", -4], [299.4, "spring", -10], [301.2, "beep", -6], [302.2, "beep", -6], [303.2, "beep", -6], [304.2, "whoosh"], [306.0, "ding", -2]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const comida = tw(f, k(297.8), k(299.0));
      const estira = tw(f, k(299.0), k(300.2));
      const vago = tw(f, k(300.6), k(301.4));
      const enough = f > k(305.8);
      return (
        <Escena Set={Pizarra} pal={PAL} setProps={{ tono: "#0f1e26", luz: "#7affd4" }} seed={6212} mano={1}
          claves={[mira(0, 960, 560, 1.0), mira(k(301.0), 900, 520, 1.12, { curva: "inout" }), mira(k(307.4), 920, 520, 1.15)]}
          medio={<>
            <Torso x={TX} y={TY} s={TS} f={f} cara={enough ? "feliz" : "duda"} gorra est={{ acido: 0.3, comida, estira }} cerebro={1} cerebroColor={enough ? "#7affd4" : "#ffb0cf"} vago={vago} vagoPulsos={f > k(301.2) ? 1 : 0} />
            <TextoW x={1300} y={300} t={estira < 1 ? "FOOD COMES IN" : f < k(304.2) ? "STRETCH + NUTRIENTS" : "THE VAGUS NERVE"} tam={56} color="#7affd4" f={f} desde={k(297.8)} />
            {vago > 0.5 && <Flecha x1={1240} y1={420} x2={TX + 90} y2={TY - 260 * TS} p={tw(f, k(304.2), k(304.8))} color="#7affd4" ancho={8} curva={0.15} />}
            {enough && <g transform={`translate(${TX + 300},${CAB_Y - 30}) scale(${pop(f, k(305.8))})`}><rect x={-170} y={-56} width={340} height={112} rx={20} fill="#7affd4" stroke="#0f2a26" strokeWidth={5} /><text y={18} fontFamily={F_HUD} fontWeight={600} fontSize={56} fill="#0f2a26" textAnchor="middle">ENOUGH.</text></g>}
          </>} />
      );
    };
    return <Pl />;
  },
};
export const r21d: PlanB = {
  a: 307.4, b: 309.98, trans: { tipo: "corte" },
  sfx: [[307.5, "sparkle", -6], [308.4, "pop", -6]],
  el: (k) => {
    const Pl: React.FC = () => {
      const f = useF();
      const S = HAL_PUNTOS.silla - 60;
      return (
        <Escena Set={Halden} pal={PAL} setProps={{ hora: "tarde", tablet: "42 / 47" }} seed={6213} mano={1}
          claves={[mira(0, S + 150, 590, 2.3), mira(k(309.98), S + 150, 590, 2.42)]}
          medio={<>
            <Persona look={OWEN} seed={47} luz={RIM.clinica} ruta={[{ f: 0, x: S, y: HP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
              poses={[{ f: 0, v: { ...SENT, hD: 10, cD: 20 } }, { f: k(307.8), v: { ...SENT, hD: 20, cD: 110, hI: 20, cI: 110, tronco: -6, cabeza: -10 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(308.0), v: "feliz" }]}
              cartel={{ claves: 0, icono: "panza" as const, texto: "ENOUGH", color: "#7affd4", tam: 24, dy: -10 }} />
          </>} />
      );
    };
    return <Pl />;
  },
};
