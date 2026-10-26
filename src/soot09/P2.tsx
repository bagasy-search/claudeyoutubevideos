import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Chip, Grande, fontFamily, Emote, cabeza } from "./kit";
import { Trampas } from "./kit2";
import { Mundo, K, En, SUELO, AGUA } from "./mundo";
import { Base, flotaX } from "./base";
import { TOM, GENT, COLONO, SMITH, Poste, Caja, Barril, Choclo } from "./kitj";
import { Globo, Lupa, Olor, Tacha } from "./kitj2";

// TRAMPA 2 · EL VIAJE (138,1-213,7 s). Trabados frente a Kent comiéndose la comida, la bodega vista por una lupa
// que viaja con el barco por el Atlántico, Smith preso, la llegada al "paraíso", la caja sellada en cubierta y el calendario.
export const CAM2: K[] = [
  [138.2, 7700, 600, 0.6], [139.4, 7800, 640, 0.85], [141.0, 7850, 620, 0.8], [143.6, 8300, 600, 0.6], [145.2, 8330, 690, 1.12],
  [155.2, 8470, 690, 1.18], [156.4, 8800, 700, 1.4], [158.6, 9700, 640, 0.7], [163.0, 10300, 620, 0.55], [171.0, 15650, 690, 0.9],
  [173.6, 17450, 690, 0.92], [176.6, 19000, 640, 0.7], [179.3, 23560, 560, 0.75], [180.3, 23560, 560, 0.78], [180.9, 23060, 830, 2.0],
  [181.6, 23080, 830, 2.05], [182.7, 21000, 680, 0.5], [183.9, 20900, 680, 0.52], [185.0, 18870, 700, 1.9], [191.6, 18915, 700, 2.0],
  [193.8, 18930, 700, 1.85], [197.6, 18956, 700, 1.7], [202.2, 18987, 700, 1.75], [204.2, 19400, 600, 0.5], [211.6, 19900, 600, 0.52],
  [213.8, 22650, 620, 0.75],
];
const CIELO2: [number, string][] = [[138.0, "mar"], [144.5, "tormenta"], [155.4, "noche"], [163.0, "mar"], [173.5, "primavera"]];

// x del barco grande en cubierta (se mueve despacio río arriba)
const deck = (t: number) => ({ x: flotaX(0, t), y: AGUA - 130 * 1.05 + 42 });

const Bola: React.FC<{ x: number; y: number; hx: number; hy: number }> = ({ x, y, hx, hy }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <path d={`M ${hx} ${hy} Q ${(hx + x) / 2} ${Math.max(hy, y) + 14} ${x} ${y}`} stroke="#3a3a44" strokeWidth={5} strokeDasharray="9 4" fill="none" />
    <circle cx={x} cy={y - 14} r={18} fill="#2a2a34" /><circle cx={x - 6} cy={y - 20} r={5} fill="#6a6a7a" />
  </svg>
);

// la bodega: lo que se ve dentro de la lupa (800 x 800)
const Bodega: React.FC<{ t: number }> = ({ t }) => {
  const sw = Math.sin(t * 1.6) * 14;
  const pelea = t > 161.4 && t < 162.9;
  const smith = t > 162.8;
  const fx = (k: number) => (pelea ? Math.sin(t * 22 + k) * 10 : 0);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${Math.sin(t * 1.3) * 3}deg)` }}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={800} height={800}>
        <rect width={800} height={800} fill="#3a2414" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={i * 70} x2={800} y2={i * 70 + 10} stroke="#2a180c" strokeWidth={6} />)}
        <path d="M 0 720 L 800 720 L 800 800 L 0 800 Z" fill="#2a180c" />
        <g transform={`rotate(${sw} 400 40)`}><line x1={400} y1={40} x2={400} y2={170} stroke="#1a0e06" strokeWidth={5} /><rect x={380} y={170} width={40} height={54} rx={8} fill="#e8b84a" /></g>
        <circle cx={400 + Math.sin((sw * Math.PI) / 180) * -150} cy={200} r={300} fill="rgba(255,200,110,.18)" />
        {!smith && <path d="M 90 430 Q 250 520 410 430" stroke="#c8b08a" strokeWidth={10} fill="none" />}
      </svg>
      {[[70, 690], [190, 700], [640, 690], [740, 700], [700, 590]].map(([x, y], i) => <Barril key={i} x={x} y={y} s={0.42} />)}
      {/* vos, durmiendo en la hamaca */}
      {!smith && (
        <div style={{ position: "absolute", left: 250, top: 470, transform: `rotate(${-82 + Math.sin(t * 1.6) * 4}deg)`, transformOrigin: "0 0" }}>
          <Persona x={0} y={0} h={330} t={t} seed={8} ropa={TOM} expr={t < 158.8 ? "dormido" : pelea ? "miedo" : "triste"} />
        </div>
      )}
      {!smith && t > 158.8 && <><Olor t={t} x={330} y={360} /><Olor t={t + 0.5} x={560} y={430} /><Olor t={t + 1} x={150} y={330} color="#a8a8b8" /></>}
      {/* la pelea */}
      {!smith && [0, 1].map((k) => (
        <Persona key={k} x={460 + k * 190 + fx(k)} y={720} h={330} t={t} seed={60 + k} ropa={COLONO(k + 1)} flip={k === 1} expr={pelea ? "enojado" : "triste"} bD={pelea ? 70 + Math.sin(t * 18 + k * 2) * 50 : 0} cD={pelea ? 40 : 0} barba={k ? "#3a2416" : undefined} />
      ))}
      {pelea && <Emote t={t} t0={161.5} tipo="enojo" x={500} y={420} />}
      {pelea && <div style={{ position: "absolute", left: 560, top: 470, fontFamily, fontWeight: 700, fontSize: 60, color: C.ambar, WebkitTextStroke: "8px #2a1408", paintOrder: "stroke fill", transform: `scale(${ent(t, 161.7)}) rotate(-12deg)` }}>POW!</div>}
      {/* John Smith, encadenado */}
      {smith && (
        <div style={{ position: "absolute", inset: 0, opacity: ent(t, 162.8) }}>
          <Persona x={400} y={720} h={460} t={t} seed={31} ropa={SMITH} expr={t > 167.2 && t < 168.6 ? "enojado" : t > 170 ? "triste" : "enojado"} barba="#8a4a1a" gorro="morion" habla={t > 166 && t < 168} />
          <Bola x={560} y={730} hx={430} hy={712} />
          {t > 166.6 && <Emote t={t} t0={166.66} t1={168.4} tipo="excl" x={cabeza(400, 720, 460).x} y={cabeza(400, 720, 460).y} s={1} />}
          {/* barrotes de la celda */}
          {t > 169.9 && Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 95, top: -800 + 800 * ent(t, 170.0 + i * 0.03), width: 18, height: 800, background: "#2a2a34", borderRadius: 6 }} />)}
        </div>
      )}
    </div>
  );
};

// la línea de la temporada de siembra
const Siembra: React.FC<{ t: number }> = ({ t }) => {
  const e = ent(t, 202.6);
  const W = 1300, X0 = 310;
  const mes = ["MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
  const xm = (m: number) => X0 + (m / 6) * W; // m = meses desde el 1 de marzo
  const marca = interpolate(t, [203.9, 204.8], [0, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gris = prog(t, 205.6, 207.5);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: e * (1 - prog(t, 213.0, 213.6)), transform: `translateY(${(1 - e) * 200}px)` }}>
      <div style={{ position: "absolute", left: X0 - 60, top: 640, width: W + 120, height: 330, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 26, boxShadow: "0 12px 0 rgba(20,10,40,.4)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <text x={960} y={705} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={C.noche}>PLANTING SEASON · 1607</text>
        <rect x={xm(0.5)} y={760} width={xm(3.5) - xm(0.5)} height={70} rx={20} fill={C.lima} stroke="#2a5a1a" strokeWidth={6} />
        <rect x={xm(0.5)} y={760} width={(xm(2.5) - xm(0.5)) * gris} height={70} rx={20} fill="#8a8a8a" opacity={0.92} />
        {gris > 0.95 && <text x={(xm(0.5) + xm(2.5)) / 2} y={808} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={48} fill="#fff">HALF GONE</text>}
        {mes.map((m, i) => <g key={m}><line x1={xm(i)} y1={850} x2={xm(i)} y2={870} stroke={C.noche} strokeWidth={5} /><text x={xm(i) + W / 12} y={925} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill={C.noche}>{m}</text></g>)}
        <g transform={`translate(${xm(marca)} 740)`}><path d="M -26 -40 L 26 -40 L 0 0 Z" fill={C.rojo} /><rect x={-4} y={0} width={8} height={110} fill={C.rojo} /></g>
      </svg>
      {t > 204.8 && <div style={{ position: "absolute", left: xm(2.5) - 120, top: 560, transform: `scale(${ent(t, 204.8)})`, fontFamily, fontWeight: 700, fontSize: 46, color: "#fff", background: C.rojo, borderRadius: 14, padding: "4px 18px", whiteSpace: "nowrap" }}>MID-MAY · YOU ARRIVE</div>}
    </div>
  );
};

export const P2: React.FC<{ t: number }> = ({ t }) => {
  if (t < 138.1 || t > 213.9) return null;
  const d = deck(t);
  const enCubierta = t > 183.6 && t < 203.6;
  // Smith en cubierta: preso hasta 191,6, consejero después; intenta acercarse a la mesa y lo frenan
  const sx = d.x + interpolate(t, [194.0, 195.4], [270, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + interpolate(t, [195.9, 196.4], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lupaS = 1 - prog(t, 171.0, 171.6);
  return (
    <AbsoluteFill>
      <Mundo t={t} cam={CAM2} cielo={CIELO2}>
        <Base t={t} />
        {t < 145.0 && <En x={7750} w={900}><Poste t={t} t0={138.3} x={7750} y={AGUA + 20} n={2} titulo="THE VOYAGE" s={1.25} /></En>}
        {/* trabados frente a Kent: se comen la comida de Virginia en cubierta */}
        {t > 144.6 && t < 155.6 && [-300, -200, -95, 10, 120].map((o, i) => {
          const come = Math.sin(t * 5 + i * 1.7) > 0.2;
          return <Persona key={`k${i}`} x={d.x + o} y={d.y} h={175} t={t} seed={230 + i} ropa={i === 2 ? TOM : COLONO(i)} gorro={i === 2 ? "sombrero" : i % 2 ? "gorra" : undefined} flip={i % 2 === 1} expr={t > 152.5 ? "triste" : i % 2 ? "neutro" : "sorpresa"} bD={come ? 130 : 40} cD={come ? 120 : 30} habla={come}
            manoD={<g transform="translate(-10 -10) scale(0.5)"><path d="M -40 -20 Q 0 -50 40 -20 Q 44 20 0 26 Q -44 20 -40 -20 Z" fill="#d8a050" stroke="#7a4a1a" strokeWidth={8} /></g>} />;
        })}
        {t > 144.6 && t < 155.6 && [-250, 70].map((o, i) => <div key={`b${i}`} style={{ position: "absolute", left: 0, top: 0 }}><Barril x={d.x + o} y={d.y - 40} s={0.35} /></div>)}
        {/* frutillas en la orilla */}
        <En x={23060} w={500}>
          <svg style={{ position: "absolute", left: 22880, top: SUELO - 40, overflow: "visible" }} width={360} height={80}>
            {Array.from({ length: 14 }, (_, i) => { const x = 10 + i * 25 + ((i * 13) % 9), y = 30 + ((i * 7) % 3) * 9; const e = ent(t, 180.4 + i * 0.04); return (
              <g key={i} transform={`translate(${x} ${y}) scale(${e})`}><path d="M -8 -10 L 0 -16 L 8 -10" stroke="#3a8a2a" strokeWidth={4} fill="#3a8a2a" /><path d="M -9 -8 Q 0 -12 9 -8 Q 8 8 0 14 Q -8 8 -9 -8 Z" fill="#e8283a" /><circle cx={-3} cy={-2} r={1.4} fill="#ffe08a" /><circle cx={3} cy={4} r={1.4} fill="#ffe08a" /></g>
            ); })}
          </svg>
        </En>
        {/* juntando frutillas en la playa */}
        {t > 178.6 && t < 182.0 && [[22920, 1], [23200, 0], [23420, 1]].map(([x, f], i) => <En key={i} x={x} w={260}><Persona x={x} y={SUELO} h={290} t={t} seed={190 + i} ropa={COLONO(i + 1)} inclina={f ? 24 : -24} flip={!!f} expr="feliz" mira={f ? 0.5 : -0.5} miraY={0.6} bD={170 + Math.sin(t * 9 + i) * 20} cD={50} aparece={178.7 + i * 0.1} manoD={<g><path d="M -14 -12 Q 0 -18 14 -12 Q 12 12 0 20 Q -12 12 -14 -12 Z" fill="#e8283a" /><path d="M -10 -14 L 0 -22 L 10 -14" stroke="#3a8a2a" strokeWidth={6} fill="none" /></g>} /></En>)}
        {/* cubierta: la caja sellada, el consejo y Smith */}
        {enCubierta && (
          <>
            {[-330, -250, -170, -90].map((o, i) => (
              <Persona key={o} x={d.x + o} y={d.y} h={165} t={t} seed={200 + i} ropa={GENT(i)} gorro={i % 2 ? "copa" : "pluma"} gola expr={t > 197.6 && t < 202.3 ? "enojado" : t > 193.8 && t < 197.6 ? "orgullo" : t > 190.6 && t < 193.8 ? "sorpresa" : "neutro"}
                flip={t > 197.6 && t < 202.3 ? i % 2 === 0 : false} mira={t > 189 && t < 197.6 ? 0.8 : 0} bD={i === 3 && t > 195.3 && t < 197.4 ? 95 : 0} cD={i === 3 && t > 195.3 && t < 197.4 ? 10 : 0} barba={i === 1 ? "#5a3a2a" : undefined} />
            ))}
            <Caja x={d.x + 10} y={d.y - 50} s={0.3} t={t} abre={prog(t, 185.3, 186.2)} />
            <Persona x={sx} y={d.y} h={175} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" flip gola={t > 192.9} camina={(t > 194 && t < 195.4) ? 1.6 : 0}
              expr={t < 190.6 ? "enojado" : t < 193.8 ? "sorpresa" : t < 196.3 ? "feliz" : "enojado"} />
            {t < 192.2 && <Bola x={sx + 60 + 40 * prog(t, 191.7, 192.2)} y={d.y + 40 * prog(t, 191.7, 192.2)} hx={sx + 8} hy={d.y - 6} />}
            {t > 197.6 && t < 202.3 && [-330, -250, -170, -90].map((o, i) => { const c = cabeza(d.x + o, d.y, 165); return <Emote key={i} t={t} t0={197.8 + i * 0.25} t1={202.3} tipo="enojo" x={c.x} y={c.y} s={0.35} />; })}
          </>
        )}
        {enCubierta && t > 195.0 && <Globo t={t} t0={195.0} t1={197.4} x={d.x - 120} y={d.y - 210} text="NOT YOU." size={46} cola="izq" />}
        {/* el río: tan ancho que se traga un barco */}
        {t > 181.8 && t < 184.2 && (
          <div style={{ position: "absolute", left: 19000, top: AGUA - 380, width: 2200, height: 2, opacity: ent(t, 182.2) }}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={2200} height={10}>
              <line x1={0} y1={0} x2={2200 * ent(t, 182.2)} y2={0} stroke="#fff" strokeWidth={14} strokeDasharray="40 22" />
              <path d="M 0 -40 L 0 40 M 2200 -40 L 2200 40" stroke="#fff" strokeWidth={14} />
            </svg>
          </div>
        )}
      </Mundo>

      {/* pantalla */}
      {t < 143 && <Trampas t={t} t0={138.4} n={2} y={960} />}
      {t > 140.9 && t < 144.9 && (
        <>
          <Chip t={t} t0={142.36} t1={144.9} text="2 MONTHS" color={C.teal} tinta={C.noche} x={960} y={250} centro size={78} />
          <Tacha t={t} t0={143.5} x={960} y={250} r={150} />
          {t > 144.0 && <Grande t={t} t0={144.06} text="4+ MONTHS" y={430} size={130} color={C.ambar} />}
        </>
      )}
      {/* vientos que los clavan contra Kent */}
      {t > 148.3 && t < 155.4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, opacity: ent(t, 148.4) * (1 - prog(t, 154.8, 155.4)) }} width={1920} height={1080}>
          {Array.from({ length: 14 }, (_, i) => { const k = ((t * 0.9 + i * 0.137) % 1); const y = 120 + ((i * 97) % 520); const x = 2100 - k * 2600; return <path key={i} d={`M ${x} ${y} q 120 -30 240 0 t 240 0`} stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.55 * Math.sin(k * Math.PI)} />; })}
        </svg>
      )}
      <Chip t={t} t0={145.44} t1={148.3} text="STUCK · 6 WEEKS" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={148.42} t1={155.3} text="WINTER WINDS" color="#6a7a9a" x={1500} y={140} centro size={52} />
      <Chip t={t} t0={150.0} t1={155.3} text="KENT, ENGLAND" color={C.violeta} x={330} y={140} centro size={48} />
      {t > 152.5 && t < 155.4 && (() => {
        const f = 1 - prog(t, 152.7, 155.0);
        return (
          <div style={{ position: "absolute", left: 560, top: 800, width: 800, opacity: ent(t, 152.6) }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 58, color: "#fff", textAlign: "center", WebkitTextStroke: "9px #1b1240", paintOrder: "stroke fill" }}>FOOD FOR VIRGINIA</div>
            <div style={{ marginTop: 10, height: 56, borderRadius: 28, background: "#2a1a2a", border: "6px solid #fff", overflow: "hidden" }}><div style={{ width: `${f * 100}%`, height: "100%", background: f > 0.4 ? C.lima : C.rojo }} /></div>
          </div>
        );
      })()}
      {/* la lupa sobre el barco: la bodega */}
      {t > 155.5 && lupaS > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${lupaS})`, transformOrigin: "960px 520px" }}>
          <Lupa t={t} t0={155.6} x={960} y={520} r={400}><Bodega t={t} /></Lupa>
        </div>
      )}
      <Chip t={t} t0={156.2} t1={158.8} text="BELOW DECK" color="#5a3418" x={250} y={130} size={52} />
      <Chip t={t} t0={159.8} t1={161.4} text="WET WOOL" color="#6a6a7a" x={1420} y={300} size={50} />
      <Chip t={t} t0={160.6} t1={161.4} text="VOMIT" color={C.lima} tinta={C.noche} x={1420} y={380} size={50} />
      <Chip t={t} t0={165.6} t1={171.0} text="JOHN SMITH" color={C.rojo} x={250} y={160} size={62} />
      <Chip t={t} t0={164.16} t1={171.0} text="LOUD · STUBBORN · SOLDIER" color={C.ambar} tinta={C.noche} x={250} y={260} size={54} />
      <Chip t={t} t0={167.7} t1={171.0} text="MUTINY?" color={C.violeta} x={1440} y={260} size={60} />
      {t > 170.2 && t < 171.4 && <Grande t={t} t0={170.36} text="PRISONER" y={960} size={110} color="#ff5a6a" />}
      {/* la ficha de Smith que queda guardada */}
      {t > 171.0 && t < 184.2 && (
        <div style={{ position: "absolute", left: 120, top: 150, transformOrigin: "50% 0", transform: `scale(${1.35 * ent(t, 171.1) * (1 - prog(t, 183.6, 184.2))}) rotate(4deg)`, width: 260, height: 300, background: "#fff3d6", border: "8px solid #2a1408", borderRadius: 18, overflow: "hidden" }}>
          <Persona x={130} y={300} h={330} t={t} seed={31} ropa={SMITH} barba="#8a4a1a" gorro="morion" expr="orgullo" />
          <div style={{ position: "absolute", left: 0, top: 246, width: 260, height: 54, lineHeight: "50px", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 31, color: "#fff", background: C.rojo, whiteSpace: "nowrap" }}>REMEMBER HIM</div>
          {t > 172.3 && <svg style={{ position: "absolute", left: 180, top: 70, transform: `scale(${ent(t, 172.64)}) rotate(${(t - 172.6) * 40}deg)` }} width={70} height={70} viewBox="-35 -35 70 70"><path d="M 0 -32 L 9 -10 L 32 -10 L 13 4 L 20 28 L 0 13 L -20 28 L -13 4 L -32 -10 L -9 -10 Z" fill={C.ambar} stroke="#2a1408" strokeWidth={4} /></svg>}
        </div>
      )}
      <Chip t={t} t0={175.26} t1={178.6} text="APRIL 1607" color={C.lima} tinta={C.noche} x={960} y={140} centro size={64} />
      {t > 177.6 && t < 178.9 && <Grande t={t} t0={177.96} text="PARADISE" y={300} size={140} color={C.ambar} />}
      <Chip t={t} t0={178.82} t1={180.4} text="TALL FORESTS" color="#1f6a3a" x={960} y={930} centro size={58} />
      <Chip t={t} t0={180.5} t1={181.7} text="STRAWBERRIES" color={C.rojo} x={960} y={930} centro size={58} />
      <Chip t={t} t0={181.9} t1={184.0} text="RIVERS THAT SWALLOW SHIPS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={56} />
      <Chip t={t} t0={184.98} t1={186.5} text="SEALED ORDERS" color={C.rojo} x={960} y={140} centro size={60} />
      {/* la lista de nombres que sale de la caja */}
      {t > 186.5 && t < 193.8 && (
        <div style={{ position: "absolute", left: 640, top: 150, width: 640, transform: `scale(${ent(t, 186.6) * (1 - prog(t, 193.2, 193.8))}) rotate(-3deg)`, background: "#f4e6c4", border: "8px solid #8a6a3a", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 54, color: "#7a1a24", textAlign: "center" }}>THE COUNCIL</div>
          {["EDWARD WINGFIELD", "JOHN RATCLIFFE", "GEORGE KENDALL", "+ 3 MORE", "JOHN SMITH"].map((n, i) => {
            const smith = i === 4;
            const on = t > 187.4 + i * 0.3;
            return <div key={n} style={{ fontFamily, fontWeight: 700, fontSize: smith && t > 190.6 ? 62 : 52, color: smith && t > 190.6 ? "#fff" : C.noche, background: smith && t > 190.6 ? C.rojo : "transparent", borderRadius: 8, padding: "0 8px", marginTop: 4, opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -30}px) scale(${smith && t > 190.6 ? 1 + 0.08 * Math.sin((t - 190.6) * 10) * (1 - prog(t, 190.6, 191.6)) : 1})` }}>{n}</div>;
          })}
        </div>
      )}
      {t > 191.6 && t < 193.8 && (
        <>
          <Chip t={t} t0={191.88} t1={193.8} text="PRISONER" color="#6a6a7a" x={300} y={160} size={58} />
          <Tacha t={t} t0={192.5} x={430} y={190} r={110} />
          {t > 192.9 && <Grande t={t} t0={192.94} text="COUNSELOR" y={330} size={120} color={C.ambar} />}
        </>
      )}
      <Chip t={t} t0={194.98} t1={197.4} text="REFUSED" color={C.rojo} x={960} y={930} centro size={60} />
      <Chip t={t} t0={199.36} t1={202.3} text="4 MONTHS AT SEA" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      {t > 201.2 && t < 202.5 && <Grande t={t} t0={201.38} text="THEY HATE EACH OTHER" y={930} size={86} color="#ff5a6a" />}
      {t > 202.4 && <Siembra t={t} />}
      {t > 208.2 && t < 211.7 && (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Choclo x={760} y={330} s={1.6} t={t} t0={208.3} />
          <div style={{ position: "absolute", left: 1100, top: 380, transform: `scale(${ent(t, 210.06)})`, transformOrigin: "50% 100%" }}><Choclo x={0} y={0} s={0.55} /></div>
          <Chip t={t} t0={210.06} t1={211.6} text="SMALL" color={C.rosa} x={1250} y={250} size={56} />
          <Chip t={t} t0={210.52} t1={211.6} text="LATE" color={C.rojo} x={1250} y={340} size={56} />
          {t > 209.0 && <svg style={{ position: "absolute", left: 960, top: 300, overflow: "visible" }} width={10} height={10}><path d="M -60 40 L 40 40" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={ent(t, 209.4)} /><path d="M 20 18 L 48 40 L 20 62" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={ent(t, 209.4)} /></svg>}
        </div>
      )}
      {t > 211.6 && t < 213.6 && <Grande t={t} t0={211.74} text="STARTING BEHIND" y={420} size={120} color={C.ambar} />}
    </AbsoluteFill>
  );
};
