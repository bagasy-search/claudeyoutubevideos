import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Particulas, Emote, fontFamily } from "./kit";
import { Persona, CIVIL } from "./persona";
import { SUELO, Llave, G, Calle, Fachwerk, Ventana, Vent, enV, interp, TextoMundo, Espada } from "./mundo";
import { PT } from "./pueblo";
import { Franz, HEINRICH, Gente, CartelTrampa, Sello, Globo, Tacha, Titulo, Cuenta, vig } from "./actores";

// P1 · Trampa 1 "You do not apply" (59,6-162 s). El tablón de oficios del puente → Franz escribe su diario →
// la cámara se mete en el DIBUJO de la página derecha: Hof, 1553, cobra vida (mundo anidado) → de la página
// derecha a la izquierda: el árbol de la familia maldita → zoom-látigo afuera del diario a la espada SIN PUNTA.
const DIARIO = { x: 6440, y: SUELO - 250, s: 0.36 };
export const V_HOF: Vent = { x: DIARIO.x + 160 * DIARIO.s - 48, y: DIARIO.y - 27, w: 96 };
export const V_ARBOL: Vent = { x: DIARIO.x - 160 * DIARIO.s - 48, y: DIARIO.y - 27, w: 96 };
const TABLON = 7430;

export const P1K: Llave[] = [
  [60.6, 6930, 600, 1.3, 0.6],
  [62.5, TABLON, 600, 1.55, 0.85],
  [66.75, TABLON, 700, 2.4, 0.5],
  [69.4, 6560, 640, 1.65, 0.85],
  [71.8, DIARIO.x + 30, DIARIO.y, 6, 1.7],
  enV(V_HOF, 73.1, 960, 540, 1.0, 1.3),
  enV(V_HOF, 75.4, 420, 600, 1.7, 0.7),
  enV(V_HOF, 77.7, 1050, 600, 1.3, 0.7),
  enV(V_HOF, 79.8, 1150, 620, 1.8, 0.6),
  enV(V_HOF, 82.6, 1450, 560, 1.3, 0.8),
  enV(V_HOF, 85.0, 1520, 640, 2.4, 0.6),
  enV(V_HOF, 89.7, 1520, 650, 2.9, 2.2),
  enV(V_HOF, 91.5, 1520, 600, 1.55, 0.5),
  enV(V_HOF, 95.9, 1500, 620, 1.9, 0.9),
  [97.8, DIARIO.x, DIARIO.y, 9, 1.6],
  enV(V_ARBOL, 99.8, 960, 540, 1.0, 1.6),
  enV(V_ARBOL, 105.8, 960, 420, 1.7, 0.6),
  enV(V_ARBOL, 108.3, 960, 540, 1.0, 0.6),
  enV(V_ARBOL, 114.1, 560, 640, 2.3, 0.7),
  enV(V_ARBOL, 116.5, 760, 560, 1.2, 0.6),
  [120.85, PT.espadaPared + 420, 575, 1.6, 1.9],
  [123.9, PT.espadaPared + 420, 575, 1.7, 0.5],
  [126.9, PT.espadaPared, 370, 3.0, 0.8],
  [129.4, PT.espadaPared, 560, 1.85, 0.6],
  [133.1, PT.espadaPared - 90, 640, 1.9, 0.6],
  [137.8, PT.espadaPared, 640, 4.2, 0.6],
  [144.9, PT.espadaPared, 420, 5.2, 6.6],
  [146.2, 6730, 650, 1.6, 0.6],
  [149.4, 6730, 640, 1.8, 2.6],
  [151.0, DIARIO.x, DIARIO.y + 10, 3.6, 0.9],
  [155.3, DIARIO.x, DIARIO.y + 10, 4.3, 3.5],
  [158.0, 6800, 620, 1.4, 0.8],
  [161.4, 7350, 610, 1.3, 2.2],
];
export const P1H: [number, number][] = [[59.6, 0], [61.0, 0.35], [160.5, 0.35], [162, 0]];

const Jaula: React.FC = () => (
  <g><rect x={-46} y={0} width={92} height={96} rx={14} fill="none" stroke="#7a4a20" strokeWidth={6} />{[-30, -10, 10, 30].map((d) => <line key={d} x1={d} y1={0} x2={d} y2={96} stroke="#7a4a20" strokeWidth={4} />)}<path d="M -46 0 Q 0 -50 46 0" fill="none" stroke="#7a4a20" strokeWidth={6} /></g>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;

// ── adentro del dibujo: Hof, 1553 (1920x1080, en tinta sepia)
const Hof: React.FC<{ t: number }> = ({ t }) => {
  const apunta = vig(t, 84.4, 89.8);
  const guardias = t > 91.3 ? clamp((t - 91.3) / 0.5, 0, 1) : 0;
  const niega = vig(t, 89.7, 91.4) ? Math.sin((t - 89.7) * 18) * 10 : 0;
  return (
    <>
      <Calle x0={0} x1={1920} />
      <Fachwerk x={-60} w={420} h={560} muro="#f0dcb4" techo="#a8622c" pisos={3} />
      <Fachwerk x={1180} w={360} h={520} muro="#ecd4a8" techo="#9a4a2a" pisos={3} />
      <Fachwerk x={1600} w={380} h={600} muro="#f0dcb4" techo="#a8622c" pisos={3} />
      <G x={360} y={SUELO}><rect x={-170} y={-170} width={340} height={170} fill="#8a5a2a" /><rect x={-190} y={-190} width={380} height={30} fill="#a8622c" /></G>
      <Persona x={360} y={SUELO - 190} h={300} t={t} seed={201} ropa={{ tunica: "#5b2bb5", tunica2: "#3a1a6a", cinto: "#f7c548", piel: "#f2c09a", piel2: "#d99872", pelo: "#3a2414" }} gorro="noble" barba="#3a2414"
        expr={apunta ? "enojado" : "orgullo"} bD={apunta ? 88 : 10} cD={apunta ? 2 : 10} habla={vig(t, 86.8, 89.6) || vig(t, 91.2, 95.4)} mira={1} />
      {[760, 880, 1000].map((x, i) => (
        <Persona key={x} x={x} y={SUELO - 10} h={[262, 284, 250][i]} t={t} seed={210 + i} gorro={(["campesino", undefined, "toca"] as const)[i]} ladea={[4, -3, 6][i]}
          ropa={[{ tunica: "#8a8070", tunica2: "#5a5248", cinto: "#3b2a1a", piel: "#e9b08a", piel2: "#c98f6a", pelo: "#4a3a2a" }, { tunica: "#6f7f5a", tunica2: "#4a5a3a", cinto: "#3b2a1a", piel: "#c98a62", piel2: "#a86e4a", pelo: "#1e140c" }, { tunica: "#9a6a4a", tunica2: "#6a4a32", cinto: "#2b1c10", piel: "#f0c09a", piel2: "#d39a72", pelo: "#a0602a" }][i]} expr={(["triste", "miedo", "triste"] as const)[i]} bD={14} bI={14} cD={40} cI={40}
          manoD={<rect x={-30} y={-8} width={60} height={14} rx={6} fill="#c9a36a" />} />
      ))}
      {/* el lugar VACÍO del verdugo */}
      <Svg>
        <g transform={`translate(1150 ${SUELO - 10})`} stroke="#4a2a12" strokeWidth={6} strokeLinejoin="round">
          {/* banco vacío: nadie de este oficio en la fila */}
          <rect x={-70} y={-130} width={140} height={22} rx={6} fill="#a8622c" />
          <path d="M -58 -108 L -70 0 M 58 -108 L 70 0 M -40 -108 L -30 0 M 40 -108 L 30 0" fill="none" strokeWidth={12} strokeLinecap="round" />
          <path d="M -60 -56 L 60 -56" strokeWidth={8} />
          <g transform={`translate(0 ${-170 + Math.sin(t * 2.4) * 4})`}><rect x={-34} y={-34} width={68} height={68} rx={14} fill="#fff3d6" /><text x={0} y={20} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#a3202f" stroke="none">?</text></g>
        </g>
      </Svg>
      {t > 80.9 && <G x={1150} y={SUELO - 360} rot={Math.sin(t * 3) * 4}><rect x={-9} y={-20} width={18} height={380} fill="#5a3418" /><path d="M -90 -40 L 90 -40 L 125 -5 L 90 30 L -90 30 Z" fill="#a8622c" stroke="#5a3418" strokeWidth={5} /><text x={0} y={10} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff3d6">AWAY</text></G>}
      <Gente t={t} x0={1290} x1={1900} n={6} seed={22} h={260} y={SUELO - 30} mira={-1} expr={t > 84.4 ? "sorpresa" : "neutro"} aleja={{ desde: 1520, dx: 90, t0: 85.0 }} />
      <Persona x={1520} y={SUELO - 6} h={290} t={t} seed={230} ropa={HEINRICH} gorro="campesino" flip mira={-1} ladea={niega}
        expr={t < 84.6 ? "neutro" : t < 95.4 ? "miedo" : "triste"} salta={85.0} bI={30} cI={60} manoI={<Jaula />} />
      <G x={1580} y={SUELO - 6 - 290 * 0.62} s={0.9}><ellipse cx={0} cy={0} rx={26} ry={20} fill="#ff7a3d" /><circle cx={18} cy={-14} r={14} fill="#ff7a3d" /><path d="M 30 -14 L 44 -10 L 30 -6 Z" fill="#f7c548" /><circle cx={21} cy={-17} r={3} fill="#2b1c14" /></G>
      <Emote t={t} t0={95.5} tipo="sudor" x={1520} y={SUELO - 240} s={0.5} />
      {guardias > 0 && [-1, 1].map((d) => (
        <Persona key={d} x={1520 + d * (420 - 240 * guardias)} y={SUELO - 6} h={300} t={t} seed={240 + d} ropa={{ tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" }} casco="legion" flip={d > 0} expr="enojado"
          bD={150} cD={10} manoD={<g><rect x={-7} y={-260} width={14} height={420} fill="#6b3a1f" /><path d="M 0 -260 L 60 -230 L 60 -170 L 0 -200 Z" fill="#c8ccd4" /><path d="M 0 -300 L 10 -260 L -10 -260 Z" fill="#c8ccd4" /></g>} />
      ))}
      <TextoMundo x={960} y={110} text="HOF · 1553" size={84} color="#7a3d14" borde="#f6e3b4" />
    </>
  );
};
// ── adentro de la página izquierda: el árbol de la familia Schmidt
const Arbol: React.FC<{ t: number }> = ({ t }) => {
  const hijos = [560, 960, 1360], nietos = [300, 540, 780, 1140, 1380, 1620];
  const pajaros = t > 105.8 ? clamp((t - 105.8) / 1.8, 0, 1) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "translateY(-30px) scale(0.9)", transformOrigin: "960px 540px" }}>
      <TextoMundo x={960} y={96} text="THE SCHMIDT FAMILY" size={70} color="#7a3d14" borde="#f6e3b4" />
      <Svg>
        <g stroke="#7a3d14" strokeWidth={8} fill="none" strokeLinecap="round">
          {hijos.map((x) => <path key={x} d={`M 960 440 Q 960 480 ${x} 490 L ${x} 520`} />)}
          {nietos.map((x, i) => { const p = hijos[Math.min(2, Math.floor(i / 2))]; return <path key={x} d={`M ${p} 780 Q ${p} 810 ${x} 815 L ${x} 840`} />; })}
        </g>
      </Svg>
      <Persona x={960} y={420} h={250} t={t} seed={230} ropa={HEINRICH} gorro="campesino" expr={t > 101 ? "triste" : "neutro"} bI={30} cI={60} manoI={<Jaula />} />
      {[0, 1, 2].map((i) => {
        const u = clamp(pajaros * 1.4 - i * 0.2, 0, 1);
        const x = 880 + u * (500 + i * 200), y = 330 - u * (260 + i * 30) - Math.sin(u * 12) * 20;
        const col = [C.naranja, C.teal, C.ambar][i];
        return <G key={i} x={pajaros > 0 ? x : 900 + i * 24} y={pajaros > 0 ? y : 330} s={0.8}><ellipse cx={0} cy={0} rx={26} ry={18} fill={col} /><path d={`M -10 -4 Q -30 ${-30 * Math.sin(t * 20 + i)} -50 -10`} stroke={col} strokeWidth={10} fill="none" /><circle cx={18} cy={-10} r={12} fill={col} /></G>;
      })}
      {hijos.map((x, i) => <Persona key={x} x={x} y={760} h={220} t={t} seed={250 + i} ropa={i === 0 ? { ...HEINRICH, tunica: "#7a1f3d", tunica2: "#4a0f26" } : CIVIL(i + 6)} gorro={i === 0 ? "verdugo" : i === 2 ? "toca" : undefined} expr={t > 102.8 ? "triste" : "neutro"} />)}
      {nietos.map((x, i) => <Persona key={x} x={x} y={1040} h={170} t={t} seed={260 + i} ropa={CIVIL(i + 9)} gorro={i % 3 === 1 ? "toca" : undefined} expr={t > 104.3 ? "miedo" : "feliz"} />)}
      <TextoMundo x={960} y={470} text="HEINRICH" size={40} color="#7a3d14" borde="#f6e3b4" />
      <TextoMundo x={560} y={800} text="FRANZ" size={44} color="#a3202f" borde="#f6e3b4" />
      <Sello t={t} t0={101.6} text="UNCLEAN" x={1240} y={300} size={70} rot={-10} />
      {hijos.map((x, i) => <Sello key={x} t={t} t0={102.85 + i * 0.22} text="UNCLEAN" x={x} y={700} size={34} rot={-12 + i * 5} />)}
      {nietos.map((x, i) => <Sello key={x} t={t} t0={104.35 + i * 0.16} text="UNCLEAN" x={x} y={1012} size={26} rot={-14 + i * 4} />)}
      {t > 114 && t < 118.9 && <Svg><circle cx={560} cy={640} r={170} fill="none" stroke="#e8344a" strokeWidth={10} strokeDasharray={1070} strokeDashoffset={1070 * (1 - clamp((t - 114) / 0.5, 0, 1))} /></Svg>}
    </div>
  );
};

const Tablon: React.FC<{ t: number }> = ({ t }) => (
  <>
    <G x={TABLON} y={SUELO - 10}>
      <rect x={-12} y={-560} width={24} height={560} fill="#5a3418" />
      <rect x={-250} y={-560} width={500} height={330} rx={14} fill="#8a5a2a" />
      <rect x={-235} y={-546} width={470} height={302} rx={10} fill="#a8722e" />
      {([["BAKER'S BOY", -120, -480, -4], ["SMITH WANTED", 110, -490, 5], ["CARPENTER", -110, -320, 3]] as [string, number, number, number][]).map(([txt, x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><rect x={-100} y={-50} width={200} height={110} fill="#fff6e0" /><text x={0} y={4} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="#5a3a1a">{txt}</text><text x={0} y={40} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={22} fill="#2a8a3a">APPLY HERE</text></g>
      ))}
      <g transform="translate(115 -320) rotate(-3)"><rect x={-110} y={-56} width={220} height={120} fill="#f2d0d0" /><text x={0} y={-6} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="#7a1f3d">EXECUTIONER</text><text x={0} y={34} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#e8344a">NO APPLICATIONS</text></g>
    </G>
    {t > 66.3 && (
      <G x={TABLON + 10} y={SUELO - 10}>
        <path d="M -110 0 Q -130 -90 -100 -110 L 100 -110 Q 130 -90 110 0 Z" fill="#c9a36a" />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-100 + i * 40} y1={-110} x2={-90 + i * 40} y2={0} stroke="#a8823e" strokeWidth={6} />)}
      </G>
    )}
    {t > 66.3 && <Persona x={TABLON + 10} y={SUELO - 70} h={130} t={t} seed={270} ropa={{ tunica: "#fff6e8", tunica2: "#e8dcc8", cinto: "#e8dcc8", piel: "#f5c7a0", piel2: "#dc9d78", pelo: "#3a2414" }} gorro="verdugo" expr={t > 67.7 ? "sorpresa" : "feliz"} aparece={66.4} />}
  </>
);

export const P1Mundo: React.FC<{ t: number }> = ({ t }) => {
  const adentro = vig(t, 70.5, 121.5);
  const sale = t > 158;
  const x = sale ? interp(t, [158, 160.6], [6660, 7300]) : t < 69 ? 6700 : 6660;
  const escribe = vig(t, 69, 72) || vig(t, 149.5, 157.9);
  return (
    <>
      {/* el brillo que baja por el acero mientras se lee el grabado */}
      {vig(t, 138.0, 146.2) && <Espada x={PT.espadaPared} y={SUELO - 150} s={0.42} brillo={((t - 138.0) / 1.4) % 1} />}
      <Tablon t={t} />
      {t >= 62.5 && <Franz x={x} y={SUELO - 10} t={t} flip={!sale} camina={sale && t < 160.6 ? 1.5 : 0}
        expr={vig(t, 146.3, 149.3) ? "orgullo" : escribe ? "feliz" : vig(t, 129.3, 137.7) ? "orgullo" : "neutro"} mira={escribe ? -1 : 0} miraY={escribe ? 1 : 0}
        bD={escribe ? 50 + Math.sin(t * 9) * 6 : vig(t, 129.3, 137.7) ? 125 + Math.sin(t * 3) * 6 : 8} cD={escribe ? 70 : vig(t, 129.3, 137.7) ? 20 : 10} habla={vig(t, 133.1, 137.6)} viejoF={vig(t, 148.4, 149.6)}
        manoD={escribe ? <g transform="rotate(-150)"><path d="M 0 0 Q -14 -60 6 -110 Q 20 -60 4 0 Z" fill="#fff6e8" /></g> : undefined} />}
      {adentro && <Ventana v={V_HOF} sepia={0.55}><Hof t={t} /></Ventana>}
      {adentro && <Ventana v={V_ARBOL}><Arbol t={t} /></Ventana>}
      {/* páginas que pasan solas: "lo escribió todo" */}
      {vig(t, 151.2, 153.8) && Array.from({ length: 4 }, (_, i) => {
        const u = clamp((t - 151.3 - i * 0.55) / 0.5, 0, 1);
        if (u <= 0 || u >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: DIARIO.x, top: DIARIO.y - 77, width: 108, height: 155, background: "#fbecc8", transformOrigin: "0 50%", transform: `perspective(400px) rotateY(${-u * 180}deg)`, boxShadow: "0 0 6px rgba(0,0,0,.2)" }} />;
      })}
    </>
  );
};

const Lista: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const items = ["BAKER", "SMITH", "CARPENTER", "BIRDCATCHER", "EXECUTIONER"];
  const e = clamp((t - t0) / 0.3, 0, 1) * interp(t, [t1, t1 + 0.3], [1, 0]);
  return (
    <div style={{ position: "absolute", left: 290, top: 560, transform: `translate(-50%,-50%) scale(${e * 0.9}) rotate(-3deg)`, background: "#fbecc8", borderRadius: 18, padding: "26px 44px", boxShadow: "0 14px 0 rgba(20,10,50,.35)", fontFamily, fontWeight: 700 }}>
      <div style={{ fontSize: 44, color: "#7a3d14", marginBottom: 10 }}>CAREERS FOR FRANZ</div>
      {items.map((it, i) => {
        const ti = t0 + 0.25 + i * 0.32;
        const ok = i === 4;
        return (
          <div key={it} style={{ position: "relative", fontSize: 50, color: ok ? C.rojo : "#5a3a1a", display: "flex", gap: 18, alignItems: "center", opacity: t > ti - 0.1 ? 1 : 0.3 }}>
            <span style={{ width: 50, color: ok ? C.lima : C.rojo }}>{t > ti ? (ok ? "✓" : "✗") : ""}</span>{it}
            {!ok && t > ti && <div style={{ position: "absolute", left: 60, top: "52%", height: 8, borderRadius: 4, background: C.rojo, width: `${clamp((t - ti) / 0.2, 0, 1) * 85}%` }} />}
          </div>
        );
      })}
    </div>
  );
};

export const P1Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={59.65} t1={62.1} n={1} titulo="YOU DON'T APPLY" />
    <Chip t={t} t0={62.6} t1={66.2} text="NOBODY CHOSE THIS JOB" color={C.violeta} x={960} y={150} centro size={62} />
    <Titulo t={t} t0={66.75} t1={69.2} text="BORN INTO IT" y={190} size={130} color={C.ambar} />
    <Chip t={t} t0={69.4} t1={71.6} text="ONE REAL FAMILY" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={75.5} t1={77.5} text="A NOBLEMAN IN CHARGE" color={C.violeta} x={960} y={140} centro size={56} />
    <Chip t={t} t0={77.8} t1={79.7} text="3 PRISONERS" color={C.rojo} x={960} y={140} centro size={64} />
    <Chip t={t} t0={79.9} t1={82.5} text="0 EXECUTIONERS" color={C.noche} x={960} y={140} centro size={64} />
    <Chip t={t} t0={85.1} t1={89.6} text="HEINRICH SCHMIDT · BIRDCATCHER" color={C.lima} tinta={C.noche} x={960} y={950} centro size={52} />
    <Globo t={t} t0={86.9} t1={88.5} text="YOU." x={700} y={330} size={84} />
    <Globo t={t} t0={88.55} t1={89.7} text="YOU DO IT TODAY." x={760} y={330} size={64} />
    <Globo t={t} t0={89.8} t1={91.3} text="N-no...?" x={1250} y={320} size={64} cola="der" />
    <Chip t={t} t0={92.9} t1={95.4} text="NO WAS NOT AN OPTION" color={C.rojo} x={960} y={150} centro size={60} />
    <Globo t={t} t0={95.6} t1={97.3} text="...yes." x={1250} y={320} size={64} cola="der" />
    <Titulo t={t} t0={97.4} t1={99.6} text="RUINED FOREVER" y={180} size={120} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={105.9} t1={108.2} text="NO MORE BIRDS" color={C.naranja} x={960} y={960} centro size={58} />
    <Sello t={t} t0={108.5} t1={111.0} text="NO GUILD" x={470} y={300} size={84} />
    <Sello t={t} t0={111.2} t1={113.9} text="NO WEDDING" x={1420} y={860} size={90} rot={10} />
    <Chip t={t} t0={114.1} t1={116.4} text="FRANZ · AGE 19" color={C.rojo} x={960} y={150} centro size={62} />
    <Lista t={t} t0={116.5} t1={118.9} />
    <Chip t={t} t0={119.0} t1={120.8} text="HERE. TAKE IT." color={C.rojo} x={560} y={800} centro size={72} />
    {vig(t, 120.9, 124.0) && (
      <div style={{ position: "absolute", left: 360, top: 560, transform: `translate(-50%,-50%) rotate(-30deg) scale(${clamp((t - 120.9) / 0.3, 0, 1)})` }}>
        <svg width={120} height={560} viewBox="-60 -500 120 560" style={{ overflow: "visible" }}><path d="M -26 -60 L -26 -400 L 0 -480 L 26 -400 L 26 -60 Z" fill="#e8eef4" stroke="#2b2140" strokeWidth={8} /><rect x={-80} y={-70} width={160} height={24} rx={10} fill="#c98f2a" /><rect x={-14} y={-46} width={28} height={90} rx={8} fill="#4a2810" /></svg>
      </div>
    )}
    <Chip t={t} t0={121.0} t1={124.0} text="WHAT YOU IMAGINE" color={C.violeta} x={360} y={250} centro size={44} />
    {vig(t, 122.6, 124) && <Tacha t={t} t0={122.6} x={360} y={560} w={420} rot={-40} g={28} />}
    <Chip t={t} t0={124.0} t1={126.8} text="NO POINT AT ALL" color={C.rojo} x={520} y={150} centro size={66} />
    <Chip t={t} t0={126.9} t1={128.0} text="FLAT..." color={C.ambar} tinta={C.noche} x={1340} y={420} size={60} />
    <Chip t={t} t0={128.05} t1={129.2} text="...OR ROUNDED" color={C.ambar} tinta={C.noche} x={1340} y={420} size={60} />
    <Chip t={t} t0={129.3} t1={131.0} text="✗ NOT FOR STABBING" color={C.noche} x={1180} y={360} size={50} />
    <Chip t={t} t0={130.8} t1={133.0} text="✗ NOT FOR A FAIR FIGHT" color={C.noche} x={1180} y={470} size={50} />
    <Chip t={t} t0={133.1} t1={135.3} text="ONE JOB" color={C.rojo} x={1250} y={300} size={70} />
    <Chip t={t} t0={135.3} t1={137.6} text="HEAVY · PERFECTLY BALANCED" color={C.violeta} x={960} y={150} centro size={54} />
    {vig(t, 137.7, 145.3) && (
      <div style={{ position: "absolute", left: 1380, top: 520, transform: `translate(-50%,-50%) rotate(-2deg) scale(${clamp((t - 137.7) / 0.35, 0, 1)})`, background: "#fbecc8", border: "10px solid #7a3d14", borderRadius: 20, padding: "26px 40px", maxWidth: 760, fontFamily, fontWeight: 700, color: "#5a2a10", textAlign: "center", boxShadow: "0 14px 0 rgba(20,10,50,.35)" }}>
        <div style={{ fontSize: 34, color: "#a3202f", marginBottom: 10 }}>ENGRAVED ON THE BLADE</div>
        <div style={{ fontSize: 50, lineHeight: 1.15 }}>{["\"When I raise this sword,", "may God grant the sinner", "eternal life.\""].map((r, j) => (
          <div key={j}>{r.split(" ").map((w, k, arr) => { const i0 = [0, 5, 10][j] + k, a = clamp((t - 138.3 - i0 * 0.33) / 0.25, 0, 1); return <span key={k} style={{ opacity: a, color: a > 0 && a < 1 ? "#a3202f" : undefined }}>{w}{k < arr.length - 1 ? " " : ""}</span>; })}</div>
        ))}</div>
      </div>
    )}
    <Sello t={t} t0={145.35} t1={146.2} text="COMFORTING." x={960} y={300} color={C.violeta} size={100} rot={-6} />
    <Cuenta t={t} t0={146.3} t1={149.3} de={0} a={45} dur={2.0} x={960} y={220} size={180} suf=" YEARS" color={C.ambar} />
    <Chip t={t} t0={149.4} t1={151.1} text="UNLIKE ALMOST EVERYONE ELSE..." color={C.violeta} x={960} y={150} centro size={54} />
    <Chip t={t} t0={151.3} t1={153.6} text="HE WROTE IT ALL DOWN" color={C.noche} x={960} y={170} centro size={84} />
    {vig(t, 153.5, 157.8) && <Particulas t={t} tipo="destellos" n={24} seed={9} />}
    <Chip t={t} t0={153.7} t1={157.7} text="★ HIS JOURNAL SURVIVES ★" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={158.0} t1={161.9} text="RULE #1 OF YOUR NEW LIFE..." color={C.rojo} x={960} y={150} centro size={56} />
  </>
);
