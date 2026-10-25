import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo, Cadalso, Jarra } from "./mundo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, BurbujaM, Cuenta, vig } from "./actores";

// P6 · Trampa 6 "The stage" (537,8-645,1 s). Salto por el cielo a la plaza: el cadalso (vacío, nunca se ve una
// ejecución). La versión Hollywood con capucha → la capucha vuela → el público: cientos, chicos en hombros, curas,
// guardias, el concejo en el balcón → telón y reflector → si algo sale mal: piedras y a correr hasta el puente →
// la estrategia de Franz: ni una gota → el diario: rápido, no cruel → 45 años en un timelapse de días y noches.
const PLAZA = 4800, ESC = SUELO - 200;
const NOBLE: Ropa = { tunica: "#2b2140", tunica2: "#1b1530", cinto: C.oro, piel: "#e9b08a", piel2: "#c98f6a", pelo: "#d8d2cc" };
const GUARDIA: Ropa = { tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" };
const TIRAN = [4260, 4380, 4500, 5100, 5220, 5340];

export const P6K: Llave[] = [
  [538.6, 31450, -950, 0.95, 1.0],
  [539.9, PLAZA, -950, 0.95, 1.2],
  [541.15, PLAZA, 600, 0.95, 1.1],
  [542.9, PLAZA, ESC - 240, 2.4, 0.6],
  [544.3, PLAZA, ESC - 280, 1.5, 0.5],
  [547.45, PLAZA, 560, 1.25, 0.8],
  [551.1, PLAZA, 600, 0.9, 0.8],
  [553.0, 4450, 640, 1.35, 0.7],
  [556.6, 6560, 580, 1.15, 0.7],
  [558.05, PLAZA, 560, 1.0, 0.7],
  [560.15, PLAZA, 420, 0.46, 1.2],
  [564.8, 4420, 600, 1.25, 0.8],
  [567.75, 5250, 520, 1.15, 0.8],
  [571.2, PLAZA, 470, 0.95, 0.7],
  [575.55, PLAZA, ESC - 200, 1.7, 0.6],
  [578.1, PLAZA, ESC - 220, 2.3, 0.6],
  [583.6, PLAZA, ESC - 200, 2.8, 0.5],
  [587.25, PLAZA, 560, 1.0, 0.6],
  [590.4, 4450, 640, 1.4, 0.6],
  [593.1, 4750, 560, 0.85, 0.6],
  [594.6, 5300, 600, 1.0, 0.8],
  [598.6, 5950, 600, 1.0, 3.6],
  [602.2, 5700, 680, 1.9, 0.8],
  [604.7, 6150, 540, 1.0, 0.9],
  [609.35, 6560, 600, 1.4, 1.0],
  [613.5, 6560, 600, 1.75, 0.6],
  [615.4, 6720, 560, 2.6, 0.6],
  [618.3, 6560, 600, 1.4, 0.8],
  [622.65, 6440, 625, 3.6, 1.0],
  [628.2, 6440, 625, 3.0, 2.0],
  [630.4, 7120, 600, 1.2, 0.9],
  [634.25, 7180, 600, 1.45, 0.7],
  [637.3, 6620, 520, 0.9, 1.0],
  [642.9, 6960, 640, 1.6, 0.8],
];
export const P6H: [number, number][] = [[537.8, 0], [637.3, 0], [638.2, 2], [639.1, 0], [640.0, 2], [640.9, 0], [641.8, 2], [642.9, 0], [645.1, 0]];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Piedra: React.FC = () => <ellipse cx={0} cy={-10} rx={22} ry={18} fill="#8a8a96" stroke="#5a5a66" strokeWidth={4} />;

export const P6Mundo: React.FC<{ t: number }> = ({ t }) => {
  const plaza = t < 605;
  const corre = t > 594.6;
  const fx = !corre ? PLAZA : interp(t, [594.6, 601.6], [PLAZA, 6300]);
  const fy = !corre ? ESC : t < 595.2 ? interp(t, [594.6, 595.2], [ESC, SUELO - 10]) : SUELO - 10;
  const capucha = t < 544.3;
  const tiembla = vig(t, 583.6, 587.2) ? Math.sin(t * 60) * 3 : 0;
  const enojo = t > 587.2;
  const telon = vig(t, 571.2, 576) ? clamp((t - 571.3) / 0.8, 0, 1) * clamp((576 - t) / 0.5, 0, 1) : 0;
  return (
    <>
      {plaza && (
        <>
          {/* fila de atrás */}
          <Gente t={t} x0={4120} x1={5480} n={12} y={SUELO - 40} h={240} seed={101} mira={0} expr={enojo ? "enojado" : vig(t, 551, 558) ? "feliz" : "neutro"} habla={vig(t, 551, 558)} />
          {/* chicos en los hombros */}
          {t > 564.7 && [4300, 5300].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 40 - 190} h={150} t={t} seed={110 + i} ropa={CIVIL(60 + i)} expr={enojo ? "miedo" : "feliz"} bD={150} bI={150} aparece={564.8 + i * 0.3} />)}
          {/* balcón del concejo */}
          {t > 567.6 && (
            <>
              <Svg><rect x={5300} y={SUELO - 330} width={280} height={24} fill="#7d4a24" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={5310 + i * 48} y={SUELO - 306} width={10} height={60} fill="#7d4a24" />)}</Svg>
              {[5360, 5440, 5520].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 330} h={230} t={t} seed={120 + i} ropa={NOBLE} gorro="noble" barba="#d8d2cc" expr={enojo ? "enojado" : "orgullo"} bD={enojo ? 80 : 10} aparece={567.8 + i * 0.15} />)}
            </>
          )}
          {/* el cadalso (siempre vacío) con telón y reflector */}
          <Cadalso x={PLAZA} y={SUELO} w={520} />
          {telon > 0 && (
            <>
              <Svg>
                <path d={`M ${PLAZA - 60} ${ESC - 760} L ${PLAZA - 260} ${ESC} L ${PLAZA + 260} ${ESC} L ${PLAZA + 60} ${ESC - 760} Z`} fill="#fff6c8" opacity={0.35 * telon} />
                {[-1, 1].map((d) => <rect key={d} x={PLAZA + d * 290 - 14} y={ESC - 620} width={28} height={620} fill="#5a3418" />)}
                <rect x={PLAZA - 320} y={ESC - 650} width={640} height={60} fill="#a3202f" />
                {[-1, 1].map((d) => <path key={d} d={`M ${PLAZA + d * 300} ${ESC - 590} L ${PLAZA + d * (300 - 260 * (1 - telon))} ${ESC - 590} Q ${PLAZA + d * (300 - 200 * (1 - telon))} ${ESC - 300} ${PLAZA + d * (300 - 260 * (1 - telon))} ${ESC} L ${PLAZA + d * 300} ${ESC} Z`} fill="#c8283c" />)}
                <rect x={PLAZA - 220} y={ESC - 760} width={440} height={90} rx={16} fill="#2b1c14" />
                {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={PLAZA - 200 + i * 36.4} cy={ESC - 770} r={8} fill={Math.floor(t * 8 + i) % 2 ? C.ambar : "#fff6c8"} />)}
                <text x={PLAZA} y={ESC - 700} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill={C.ambar}>MAIN ACT</text>
              </Svg>
            </>
          )}
          {/* guardias y cura al pie del cadalso */}
          {t > 567.6 && [-1, 1].map((d) => <Persona key={d} x={PLAZA + d * 340} y={SUELO - 10} h={300} t={t} seed={130 + d} ropa={GUARDIA} casco="legion" flip={d > 0} expr="neutro" bD={150} cD={10} manoD={<rect x={-6} y={-300} width={12} height={420} fill="#6b3a1f" />} />)}
          {t > 567.6 && <Persona x={PLAZA - 470} y={SUELO - 10} h={290} t={t} seed={140} ropa={{ ...CIVIL(0), tunica: "#f2ead8", tunica2: "#c9bca4" }} gorro="cura" expr="neutro" bD={60} cD={80} />}
          {/* la sentencia ya decidida */}
          {vig(t, 575.5, 578.1) && <G x={PLAZA + 140} y={ESC - 160} rot={-8} s={clamp((t - 575.5) / 0.3, 0, 1)}><rect x={-60} y={-90} width={120} height={180} rx={10} fill="#fbecc8" stroke="#7a3d14" strokeWidth={6} />{[0, 1, 2, 3].map((i) => <rect key={i} x={-40} y={-60 + i * 30} width={80} height={8} rx={4} fill="#a8805a" />)}<circle cx={30} cy={60} r={18} fill={C.rojo} /></G>}
          {/* Franz en el cadalso (o corriendo) */}
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${tiembla}px)` }}>
            <Franz x={fx} y={fy} t={t} gorro={capucha ? "capucha" : "verdugo"} capa={capucha ? "#0a0a10" : undefined}
              expr={capucha ? "enojado" : corre ? "miedo" : vig(t, 583.6, 590) ? "miedo" : vig(t, 578, 583.6) ? "orgullo" : "neutro"} camina={corre && t < 601.6 ? 2.4 : 0} flip={false}
              bD={vig(t, 583.6, 587.2) ? 60 : corre ? 40 + Math.sin(t * 15) * 40 : 8} cD={vig(t, 583.6, 587.2) ? 90 : 10} bI={corre ? 40 - Math.sin(t * 15) * 40 : 8} />
          </div>
          {/* la capucha sale volando */}
          {vig(t, 544.3, 546.5) && <G x={PLAZA + (t - 544.3) * 500} y={ESC - 330 - (t - 544.3) * 520 + (t - 544.3) ** 2 * 120} rot={(t - 544.3) * 400}><path d="M -50 40 Q -60 -60 0 -70 Q 60 -60 50 40 Z" fill="#0a0a10" /><rect x={-26} y={-20} width={18} height={10} rx={4} fill="#fff" /><rect x={8} y={-20} width={18} height={10} rx={4} fill="#fff" /></G>}
          {vig(t, 583.6, 587.2) && <Emote t={t} t0={583.7} tipo="sudor" x={PLAZA + 60} y={ESC - 320} s={0.7} />}
          {/* la gente lo conoce */}
          <BurbujaM t={t} t0={552.3} t1={555.0} x={4350} y={SUELO - 360} text="THAT'S FRANZ." size={40} />
          <BurbujaM t={t} t0={553.2} t1={556.5} x={4600} y={SUELO - 400} text="THE BRIDGE GUY!" size={40} />
          {/* fila de adelante (los que tiran piedras) */}
          {TIRAN.map((cx, i) => {
            const levanta = vig(t, 590.4, 593.2);
            const persigue = t > 595.0;
            const xx = persigue ? interp(t, [595.0 + i * 0.1, 602], [cx, cx + 1300 - i * 60]) : cx;
            return <Persona key={cx} x={xx} y={SUELO + 120} h={330} t={t} seed={150 + i} ropa={CIVIL(70 + i)} gorro={i % 3 === 0 ? "campesino" : i % 3 === 1 ? "toca" : undefined}
              expr={enojo ? "enojado" : t > 560 ? "feliz" : "neutro"} flip={cx > PLAZA && !persigue} camina={persigue ? 2.2 : 0}
              bD={levanta ? 160 : vig(t, 593.2, 594) ? 60 : enojo ? 90 : 10} cD={levanta ? 10 : 20} manoD={vig(t, 590.4, 593.2) ? <Piedra /> : undefined} />;
          })}
          {/* piedras en vuelo */}
          {vig(t, 593.1, 596.5) && TIRAN.map((cx, i) => {
            const u = clamp((t - 593.1 - i * 0.12) / 0.9, 0, 1);
            if (u <= 0 || u >= 1) return null;
            const tx = fx + (i - 2.5) * 40;
            return <G key={i} x={cx + (tx - cx) * u} y={SUELO - 200 - Math.sin(u * Math.PI) * 360 + (fy - SUELO + 100) * u}><Piedra /></G>;
          })}
          {vig(t, 593.3, 596) && <Emote t={t} t0={593.5} tipo="susto" x={PLAZA} y={ESC - 360} s={0.7} />}
        </>
      )}
      {/* el sombrero que quedó tirado: "algunos no llegaron al puente" */}
      {vig(t, 601.5, 605.5) && <G x={5720} y={SUELO - 4} rot={-14}><path d="M -50 0 Q -52 -50 0 -54 Q 52 -50 50 0 Z" fill="#7a1f3d" /><rect x={-64} y={-6} width={128} height={12} rx={6} fill="#4a0f26" /><path d="M 26 -44 Q 60 -90 82 -60" stroke={C.rojo} strokeWidth={8} fill="none" /></G>}
      {/* ── la casa: los colegas toman, Franz no */}
      {vig(t, 605, 646) && (
        <>
          {t < 622.7 && ["#2a5a9a", "#2a7a4a", "#6a3a9a"].map((col, i) => (
            <Persona key={i} x={6290 + i * 110} y={SUELO - 10} h={280} t={t} seed={160 + i} ropa={{ tunica: col, tunica2: "#1b1530", cinto: "#1d1410", piel: "#e9b08a", piel2: "#c98f6a", pelo: "#3a2414" }} gorro="verdugo" capa="#2b0a14"
              expr="feliz" habla bD={110 + Math.sin(t * 3 + i) * 30} cD={60} manoD={<Jarra x={0} y={40} s={0.6} />} inclina={Math.sin(t * 2 + i) * 6} />
          ))}
          {t < 630.4 && <Franz x={6720} y={SUELO - 10} t={t} flip expr={vig(t, 615.4, 618.3) ? "orgullo" : "neutro"} mira={vig(t, 622.6, 630.4) ? -1 : -1}
            bD={vig(t, 615.4, 618.3) ? 90 : 60} cD={vig(t, 615.4, 618.3) ? 0 : 60}
            manoD={vig(t, 615.4, 618.3) ? <g><rect x={-30} y={-30} width={60} height={60} rx={10} fill="#fff6e0" /><path d="M -14 0 L 14 0" stroke={C.rojo} strokeWidth={8} /></g> : <g><path d="M -22 -50 L 22 -50 L 16 10 L -16 10 Z" fill="#bfe6ff" stroke="#5a8aa8" strokeWidth={4} /></g>} />}
          {vig(t, 615.4, 618.3) && <G x={6600} y={SUELO - 300} rot={interp(t, [615.4, 616], [0, -50])}><Jarra x={0} y={0} s={0.6} /></G>}
          {/* el concejo, en el puente */}
          {vig(t, 630.3, 637.4) && (
            <>
              {[7300, 7400, 7500].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 20} h={290} t={t} seed={170 + i} ropa={NOBLE} gorro="noble" barba="#d8d2cc" flip expr={t > 634.2 ? "orgullo" : "neutro"} />)}
              <Franz x={interp(t, [630.4, 631.6], [6720, 7130])} y={SUELO - 10} t={t} camina={vig(t, 630.4, 631.6) ? 1.5 : 0} expr="neutro" habla={t > 631.7} bD={t > 631.7 ? 90 : 10} />
            </>
          )}
          {/* 45 años: Franz envejece en un timelapse de días y noches */}
          {t > 637.3 && <Franz x={6720} y={SUELO - 10} t={t} flip={t < 642.8} viejoF={t > 640} expr={t > 642.9 ? "sorpresa" : "neutro"} />}
          {/* las cartas con "todo lo demás" que llegan a la puerta de atrás */}
          {t > 642.7 && Array.from({ length: 9 }, (_, i) => {
            const u = clamp((t - 642.7 - i * 0.16) / 0.5, 0, 1);
            if (u <= 0) return null;
            return <G key={i} x={7300 - u * (240 - (i % 3) * 30)} y={SUELO - 400 + u * (380 - (i % 4) * 22)} rot={(i * 37) % 60 - 30}><rect x={-34} y={-24} width={68} height={48} rx={4} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /><path d="M -34 -24 L 0 4 L 34 -24" stroke="#7a3d14" strokeWidth={4} fill="none" /></G>;
          })}
        </>
      )}
    </>
  );
};

// gráfico del diario: el espectáculo baja, la rapidez sube
const Grafico: React.FC<{ t: number }> = ({ t }) => {
  if (t < 624.6 || t > 630.6) return null;
  const u = clamp((t - 624.8) / 3.2, 0, 1);
  const e = clamp((t - 624.6) / 0.3, 0, 1) * clamp((630.6 - t) / 0.3, 0, 1);
  const n = 30;
  const pts = (f: (k: number) => number) => Array.from({ length: Math.max(2, Math.floor(n * u)) }, (_, i) => `${80 + (i / n) * 640},${f(i / n)}`).join(" ");
  return (
    <div style={{ position: "absolute", left: 1150, top: 600, transform: `translate(-50%,-50%) scale(${e})`, background: "#fbecc8", border: "8px solid #7a3d14", borderRadius: 22, padding: 18, boxShadow: "0 12px 0 rgba(20,10,50,.35)" }}>
      <svg width={780} height={420}>
        <line x1={80} y1={360} x2={740} y2={360} stroke="#7a3d14" strokeWidth={6} />
        <line x1={80} y1={40} x2={80} y2={360} stroke="#7a3d14" strokeWidth={6} />
        <polyline points={pts((k) => 90 + k * 230 + Math.sin(k * 20) * 10)} fill="none" stroke={C.rojo} strokeWidth={12} strokeLinecap="round" />
        <polyline points={pts((k) => 330 - k * 250 + Math.sin(k * 17) * 8)} fill="none" stroke="#2a8a3a" strokeWidth={12} strokeLinecap="round" />
        <text x={560} y={300} fontFamily={fontFamily} fontWeight={700} fontSize={40} fill={C.rojo}>SHOW</text>
        <text x={560} y={120} fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#2a8a3a">FAST</text>
        <text x={90} y={400} fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#7a3d14">1573</text>
        <text x={650} y={400} fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#7a3d14">1617</text>
      </svg>
    </div>
  );
};

// película "versión Hollywood": franjas de film con agujeritos
const Film: React.FC<{ t: number }> = ({ t }) => {
  if (t < 540.3 || t > 544.3) return null;
  const off = (t * 300) % 80;
  const Banda = ({ top }: { top: number }) => (
    <div style={{ position: "absolute", left: 0, top, width: 1920, height: 90, background: "#111", overflow: "hidden" }}>
      {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 80 - off, top: 26, width: 44, height: 38, borderRadius: 8, background: "#e8e0c8" }} />)}
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(60,40,20,.25)" }} />
      <Banda top={0} /><Banda top={990} />
      <div style={{ position: "absolute", left: 960, top: 160, transform: "translate(-50%,0)", fontFamily, fontWeight: 700, fontSize: 60, color: "#fff3d6", background: "#111", padding: "8px 30px", borderRadius: 14 }}>THE MOVIE VERSION</div>
    </>
  );
};

export const P6Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={537.9} t1={540.1} n={6} titulo="THE STAGE" />
    <Film t={t} />
    <Sello t={t} t0={542.9} t1={544.2} text="WRONG" x={1350} y={560} size={130} />
    <Chip t={t} t0={544.35} t1={547.3} text="FORGET THE BLACK HOOD" color={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={547.45} t1={550.9} text="MASKS = A LATER INVENTION (AND HOLLYWOOD)" color={C.violeta} x={960} y={150} centro size={50} />
    <Chip t={t} t0={551.1} t1={555.0} text="EVERYBODY KNEW WHO YOU WERE" color={C.teal} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={556.6} t1={558.0} text="THE MAN ON THE BRIDGE" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={558.1} t1={560.0} text="NOTHING TO HIDE" y={190} size={110} color={C.crema} />
    <Chip t={t} t0={560.2} t1={562.2} text="WHAT YOU HAD: AN AUDIENCE" color={C.violeta} x={960} y={150} centro size={58} />
    <Cuenta t={t} t0={562.25} t1={564.7} de={0} a={1000} dur={2.0} x={960} y={250} size={150} pre="" suf="s OF PEOPLE" color={C.ambar} />
    <Chip t={t} t0={564.85} t1={567.6} text="MARKET STALLS · KIDS ON SHOULDERS" color={C.teal} tinta={C.noche} x={960} y={150} centro size={54} />
    <Chip t={t} t0={567.75} t1={571.1} text="PRIESTS · GUARDS · THE COUNCIL, DRESSED UP" color={C.violeta} x={960} y={150} centro size={50} />
    <Chip t={t} t0={571.25} t1={573.4} text="A PERFORMANCE" color={C.rojo} x={960} y={150} centro size={64} />
    <Chip t={t} t0={573.5} t1={575.4} text="...AND THE CROWD HAD EXPECTATIONS" color={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={575.6} t1={578.0} text="THE JUDGES ALREADY DECIDED" color={C.violeta} x={960} y={150} centro size={58} />
    {vig(t, 578.1, 583.5) && (
      <div style={{ position: "absolute", left: 1500, top: 560, transform: `translate(-50%,-50%) scale(${clamp((t - 578.1) / 0.3, 0, 1)})`, background: "#fbecc8", border: "8px solid #7a3d14", borderRadius: 22, padding: "22px 44px", fontFamily, fontWeight: 700, boxShadow: "0 12px 0 rgba(20,10,50,.35)" }}>
        <div style={{ fontSize: 40, color: "#7a3d14" }}>YOUR JOB:</div>
        {[["QUICK", 578.6], ["CLEAN", 579.8], ["CALM", 580.6], ["LAW LOOKS STRONG", 581.5]].map(([x, t0]) => <div key={x as string} style={{ fontSize: 56, color: "#5a2a10", opacity: t > (t0 as number) ? 1 : 0 }}><span style={{ color: "#2a8a3a" }}>✓</span> {x}</div>)}
      </div>
    )}
    <Chip t={t} t0={583.65} t1={587.1} text="IF YOUR HANDS SHOOK..." color={C.rojo} x={960} y={150} centro size={62} />
    <Chip t={t} t0={587.25} t1={589.1} text="NOT THE JUDGES' FAULT" color={C.noche} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={589.2} t1={590.35} text="YOURS." y={200} size={160} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={590.45} t1={593.0} text="ARMED WITH WHATEVER WAS IN THEIR HANDS" color={C.noche} x={960} y={150} centro size={52} />
    <Titulo t={t} t0={593.1} t1={594.5} text="STONES." y={200} size={150} color={C.crema} />
    <Chip t={t} t0={594.6} t1={598.5} text="MORE THAN ONE EXECUTIONER..." color={C.violeta} x={960} y={150} centro size={58} />
    <Titulo t={t} t0={598.6} t1={602.1} text="RUN FOR YOUR LIFE" y={200} size={120} color={C.ambar} />
    <Chip t={t} t0={602.25} t1={604.6} text="SOME NEVER MADE IT TO THE BRIDGE" color={C.noche} x={960} y={150} centro size={56} />
    <Titulo t={t} t0={604.75} t1={609.2} text="HOW DO YOU SURVIVE THIS?" y={200} size={96} color={C.crema} />
    <Chip t={t} t0={609.4} t1={611.1} text="FRANZ HAD A STRATEGY" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={611.2} t1={613.4} text="A JOB FAMOUS FOR HEAVY DRINKING" color={C.violeta} x={960} y={150} centro size={56} />
    <Cuenta t={t} t0={613.45} t1={618.2} de={0} a={0} dur={0.5} x={960} y={250} size={150} pre="WINE: " suf=" DROPS" color={C.lima} />
    <Titulo t={t} t0={618.3} t1={622.5} text="STONE COLD SOBER" y={200} size={120} color={C.lima} borde="#1b2a10" />
    <Chip t={t} t0={622.7} t1={624.5} text="AND HIS JOURNAL SHOWS..." color={C.violeta} x={960} y={150} centro size={58} />
    <Grafico t={t} />
    <Chip t={t} t0={630.45} t1={634.1} text="QUICKER · MORE MERCIFUL" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={634.3} t1={637.2} text="SERIOUS ✓   CRUEL ✗" color={C.noche} x={960} y={150} centro size={64} />
    <Cuenta t={t} t0={637.3} t1={639.2} de={0} a={45} dur={1.6} x={960} y={250} size={160} suf=" YEARS" color={C.ambar} />
    <Chip t={t} t0={639.3} t1={642.8} text="THE HARDEST PART? NOT THE SCAFFOLD" color={C.violeta} x={960} y={150} centro size={54} />
    <Titulo t={t} t0={642.9} t1={645.0} text="EVERYTHING ELSE" y={200} size={120} color={C.rojo} borde="#2b0a14" />
  </>
);
