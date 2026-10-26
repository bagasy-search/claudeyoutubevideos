import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, APION, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, Particulas, Rayos, Astro } from "./kit";
import { Calor } from "./kit2";
import { Galera, Corte, Remero, Galleta, Anfora, Pancarta, CuentaN, Flecha, Salpica } from "./mar";
import { CintaCine, Sello, Cadena } from "./P1";

// soot02 · trampa 3, EL RITMO (341,36-442,08 s). El tambor de Hollywood → el hortator de verdad (mazo y flauta) → 300 al
// mismo tiempo → medio segundo tarde = «cangrejo» → dos por remo → costillas → horas bajo el sol → galleta y posca → ¡EMBESTIDA!
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const HX = 800, HY = 734;

// el pelado gigante del tambor (versión película)
const Tambor: React.FC<{ t: number; vel: number }> = ({ t, vel }) => {
  const f = t * vel * Math.PI * 2;
  const g = Math.max(0, Math.cos(f)) ** 6;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <g transform="translate(960 640)">
        <rect x={-120} y={-330} width={240} height={330} rx={60} fill="#7a3a2a" />
        <circle cx={0} cy={-420} r={110} fill="#d99872" />
        <ellipse cx={-30} cy={-470} rx={40} ry={16} fill="#fff" opacity={0.5} />
        {[-40, 40].map((x) => <path key={x} d={`M ${x - 22} -428 L ${x + 22} ${-428 + (x < 0 ? 10 : -10)}`} stroke="#2a1a10" strokeWidth={10} strokeLinecap="round" />)}
        <circle cx={-40} cy={-405} r={9} fill="#2a1a10" /><circle cx={40} cy={-405} r={9} fill="#2a1a10" />
        <ellipse cx={0} cy={-360} rx={40} ry={10 + g * 18} fill="#5a1a22" />
        {[-1, 1].map((d) => <g key={d} transform={`translate(${d * 120} -280) rotate(${d * (-60 + g * 70)})`}><rect x={-18} y={0} width={36} height={170} rx={18} fill="#d99872" /><rect x={-8} y={150} width={16} height={130} fill="#6b3a1f" /><circle cx={0} cy={290} r={24} fill="#f2ead8" /></g>)}
        {/* el tambor */}
        <ellipse cx={0} cy={60} rx={360} ry={70} fill="#c9673f" />
        <rect x={-360} y={60} width={720} height={260} fill="#a8502a" />
        <ellipse cx={0} cy={320} rx={360} ry={70} fill="#8a3a1a" />
        <ellipse cx={0} cy={60} rx={330} ry={56} fill={`rgb(${240 - g * 30},${220 - g * 30},${190 - g * 30})`} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-340 + i * 97} y1={70} x2={-300 + i * 97} y2={310} stroke="#f2d49a" strokeWidth={8} />)}
        {g > 0.5 && [0, 1, 2].map((i) => <path key={i} d={`M ${-420 - i * 40} ${40 - i * 30} q -40 -10 -60 -40 M ${420 + i * 40} ${40 - i * 30} q 40 -10 60 -40`} stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={g} />)}
      </g>
    </svg>
  );
};
const Notas: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
    {Array.from({ length: 5 }, (_, i) => { const u = (t * 0.7 + i * 0.2) % 1; return <g key={i} transform={`translate(${x + u * 260 + Math.sin(t * 3 + i) * 20} ${y - u * 260})`} opacity={1 - u}><ellipse cx={0} cy={0} rx={16} ry={12} fill={C.oro} transform="rotate(-20)" /><rect x={12} y={-60} width={6} height={60} fill={C.oro} />{i % 2 === 0 && <path d="M 18 -60 q 24 10 24 30" stroke={C.oro} strokeWidth={6} fill="none" />}</g>; })}
  </svg>
);
// el cangrejo que agarra la pala
const Cangrejo: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <svg style={{ position: "absolute", left: x - 200 * s, top: y - 160 * s, overflow: "visible" }} width={400 * s} height={320 * s} viewBox="-200 -160 400 320">
    <g transform={`rotate(${Math.sin(t * 8) * 6})`}>
      {[-1, 1].map((d) => [0, 1, 2].map((k) => <path key={d + "" + k} d={`M ${d * 60} ${10 + k * 22} q ${d * 60} ${10 + k * 10} ${d * 90} ${50 + k * 10}`} stroke="#d8443a" strokeWidth={14} fill="none" strokeLinecap="round" />))}
      <ellipse cx={0} cy={20} rx={110} ry={70} fill="#e8503f" />
      {[-1, 1].map((d) => <g key={d} transform={`translate(${d * 100} -40) rotate(${d * (20 + Math.sin(t * 10) * 14)})`}><path d={`M 0 0 L ${d * 50} -60`} stroke="#d8443a" strokeWidth={18} strokeLinecap="round" /><path d={`M ${d * 50} -60 q ${d * 50} -40 ${d * 20} -70 q ${d * -10} 30 ${d * -40} 30 Z`} fill="#e8503f" /></g>)}
      {[-28, 28].map((xx) => <g key={xx}><line x1={xx} y1={-30} x2={xx} y2={-70} stroke="#d8443a" strokeWidth={8} /><circle cx={xx} cy={-76} r={18} fill="#fff" /><circle cx={xx + 4} cy={-74} r={8} fill="#2a1a10" /></g>)}
      <path d="M -30 40 Q 0 60 30 40" stroke="#7a1a12" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
const Costillas: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  const k = prog(t, t0 + 0.4, t0 + 0.6);
  return (
    <svg style={{ position: "absolute", left: x - 260, top: y - 260, transform: `scale(${e * 1.45})` }} width={520} height={520} viewBox="-260 -260 520 520">
      <rect x={-240} y={-240} width={480} height={480} rx={40} fill="#0f1a3a" />
      <rect x={-12} y={-190} width={24} height={330} rx={10} fill="#dfe8ff" />
      {[-140, -90, -40, 10, 60].map((yy, i) => [-1, 1].map((d) => <path key={i + "" + d} d={`M ${d * 14} ${yy} Q ${d * 170} ${yy - 30} ${d * 150} ${yy + 60}`} stroke="#dfe8ff" strokeWidth={16} fill="none" strokeLinecap="round" />))}
      {k > 0 && <path d={`M 60 -60 L 90 -40 L 75 -20 L 105 0`} stroke={C.rojo} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${k} 1`} strokeLinecap="round" />}
    </svg>
  );
};
// barra de litros de sudor
const Jarra: React.FC<{ t: number; t0: number; x: number; y: number; litros: number }> = ({ t, t0, x, y, litros }) => {
  if (t < t0) return null;
  const u = prog(t, t0, t0 + 2.4);
  return (
    <svg style={{ position: "absolute", left: x - 160, top: y - 260, transform: `scale(${ent(t, t0)})` }} width={320} height={520}>
      <path d="M 40 40 L 280 40 L 260 480 Q 160 510 60 480 Z" fill="rgba(220,240,255,.25)" stroke="#fff" strokeWidth={10} />
      <clipPath id="jarra"><path d="M 40 40 L 280 40 L 260 480 Q 160 510 60 480 Z" /></clipPath>
      <rect x={0} y={480 - 440 * u * (litros / 6)} width={320} height={600} fill="#7fd6ff" clipPath="url(#jarra)" />
      {[1, 2, 3, 4, 5].map((l) => <g key={l}><line x1={230} y1={480 - l * 73} x2={270} y2={480 - l * 73} stroke="#fff" strokeWidth={6} /><text x={220} y={490 - l * 73} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#fff">{l}L</text></g>)}
    </svg>
  );
};

export const P3: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 341,36 · TRAP #3 · THE RHYTHM */}
    <Escena t={t} t0={341.36} t1={343.9} entra="atraviesa" ix={960} iy={600} sale="fundido" fondo="none" golpes={[341.7, 342.7]}>
      <Galera x={960} y={720} s={0.5} t={t} boga={1.0} vela={false} />
      <Pancarta t={t} t0={341.4} n={3} titulo="THE RHYTHM" y={400} />
    </Escena>

    {/* 343,9 · "Now, the famous drum. Every movie has it. A huge bald man beating a drum, faster and faster, while the slaves suffer below." */}
    <Escena t={t} t0={343.9} t1={352.2} entra="fundido" sale="fundido" fondo="#1a1410" golpes={[344.3, 347.0, 349.4]}>
      <CintaCine t={t}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #7a4520, #2a1408 80%)" }} />
        <Tambor t={t} vel={interpolate(t, [344, 349.4, 351.5], [0.8, 1.4, 3.0], cl)} />
        {t > 350.6 && <AbsoluteFill style={{ top: 700 }}><Corte t={t} boga={2.4} agua={0.05} hortator={false} heroeExpr="miedo" luz={0.4} /></AbsoluteFill>}
        {t > 350.6 && <Cadena x1={0} y1={1040} x2={1920} y2={1040} />}
      </CintaCine>
      <Chip t={t} t0={344.3} text="THE FAMOUS DRUM" color={C.oro} tinta={C.noche} x={960} y={160} centro size={62} />
      <Chip t={t} t0={345.7} text="EVERY MOVIE" color={C.violeta} x={300} y={300} centro size={52} />
      <Chip t={t} t0={349.4} text="FASTER! FASTER!" color={C.rojo} x={1560} y={300} centro size={58} />
    </Escena>

    {/* 352,2 · "Hollywood got it almost right. The Romans really did have a man whose job was keeping time... the hortator, the encourager" */}
    <Escena t={t} t0={352.2} t1={362.3} entra="fundido" sale="fundido" fondo="#3a1c0e" quieta golpes={[353.9, 359.5]}>
      <Cam t={t} k={[[352.2, 960, 540, 1.0], [355.4, 960, 540, 1.0], [357.2, 330, 200, 1.9], [362.3, 330, 200, 1.9]]}>
        <Corte t={t} boga={0.55} agua={0.06} heroeExpr="cansado" />
      </Cam>
      <Chip t={t} t0={353.9} t1={356.8} text="HOLLYWOOD: ALMOST RIGHT" color={C.oro} tinta={C.noche} x={960} y={150} centro size={62} />
      <Chip t={t} t0={355.9} t1={358.6} text="A MAN WHO KEEPS TIME" color={C.violeta} x={960} y={950} centro size={56} />
      <Grande t={t} t0={359.5} text="HORTATOR" x={960} y={880} size={150} color={C.crema} />
      <Chip t={t} t0={361.06} text="'THE ENCOURAGER'" color="#1d6f8a" x={960} y={150} centro size={56} />
    </Escena>

    {/* 362,3 · "instead of a big drum, a mallet, the portisculus, banging out the beat, and a flute player, the symphoniacus... 300 men pull at exactly the same moment. And they had to." */}
    <Escena t={t} t0={362.3} t1={376.1} entra="fundido" sale="paneo" fondo="#2d1b69" golpes={[362.4, 363.9, 365.7, 368.3, 369.3, 374.7]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #5b2bb5, #1b1240 80%)" }} />
      {t < 370.5 && (() => {
        const g = Math.max(0, Math.cos(t * 1.1 * Math.PI * 2)) ** 6;
        return (
          <>
            {t > 362.3 && t < 363.8 && <svg style={{ position: "absolute", left: 460, top: 300, transform: `scale(${ent(t, 362.3)})` }} width={400} height={340}><ellipse cx={200} cy={80} rx={180} ry={50} fill="#c9673f" /><rect x={20} y={80} width={360} height={180} fill="#a8502a" /><line x1={20} y1={20} x2={380} y2={320} stroke={C.rojo} strokeWidth={30} strokeLinecap="round" /><line x1={380} y1={20} x2={20} y2={320} stroke={C.rojo} strokeWidth={30} strokeLinecap="round" /></svg>}
            {t >= 363.8 && <svg style={{ position: "absolute", left: 360, top: 260 }} width={600} height={600}><g transform={`translate(300 420) rotate(${-50 + g * 60}) scale(${ent(t, 363.8)})`}><rect x={-14} y={-300} width={28} height={300} rx={10} fill="#6b3a1f" /><rect x={-70} y={-360} width={140} height={90} rx={20} fill="#8a5a2a" /></g><rect x={120} y={430} width={360} height={60} rx={10} fill="#5a3418" />{g > 0.6 && <path d="M 150 420 l -50 -30 M 450 420 l 50 -30 M 300 400 l 0 -50" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={g} />}</svg>}
            {t > 368.2 && <Persona x={1380} y={pp(640, 470)} h={640} t={t} seed={130} ropa={CIVIL(2)} expr="feliz" aparece={368.2} bD={110} cD={70} bI={100} cI={80} />}
            {t > 368.2 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={1310} y1={420} x2={1520} y2={330} stroke="#e8c070" strokeWidth={16} strokeLinecap="round" /></svg>}
            {t > 368.6 && <Notas t={t} x={1520} y={330} />}
          </>
        );
      })()}
      {t >= 370.5 && <AbsoluteFill style={{ opacity: prog(t, 370.5, 370.9) }}><Corte t={t} boga={0.7} agua={0.06} heroeExpr="neutro" hortator /></AbsoluteFill>}
      {t >= 370.6 && Array.from({ length: 3 }, (_, i) => { const u = ((t * 0.7 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 960 - 900 * u, top: 540 - 900 * u, width: 1800 * u, height: 1800 * u, borderRadius: "50%", border: `${14 * (1 - u)}px solid ${C.oro}`, opacity: 1 - u }} />; })}
      <Chip t={t} t0={362.4} t1={370.3} text="NO BIG DRUM" color={C.rojo} x={660} y={190} centro size={56} />
      <Chip t={t} t0={365.7} t1={370.3} text="PORTISCULUS (MALLET)" color={C.oro} tinta={C.noche} x={660} y={920} centro size={50} />
      <Chip t={t} t0={369.34} t1={370.3} text="SYMPHONIACUS (FLUTE)" color="#1d6f8a" x={1380} y={920} centro size={50} />
      <CuentaN t={t} t0={370.6} t1={371.6} a={300} x={960} y={220} size={150} color={C.crema} />
      <Chip t={t} t0={371.6} text="EXACTLY THE SAME MOMENT" color={C.violeta} x={960} y={360} centro size={56} />
      <Chip t={t} t0={374.68} text="THEY HAD TO." color={C.rojo} x={960} y={960} centro size={66} />
    </Escena>

    {/* 376,1 · "Your oar is more than four meters long... a forest of other oars. Late by half a second: your blade crashes... the handle swings back into your chest like a club" */}
    <Escena t={t} t0={376.1} t1={388.4} entra="paneo" sale="fundido" fondo="none" quieta golpes={[376.6, 381.0, 383.0, 385.1]}>
      <Cam t={t} k={[[376.1, 960, 540, 1.0], [380.4, 960, 560, 1.15], [381.2, 960, 540, 1.0], [388.4, 960, 540, 1.0]]}>
        {t < 381 && <Galera x={960} y={560} s={1.25} t={t} boga={0.6} vela={false} marines={false} />}
        {t < 381 && t > 376.1 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={200} y1={980} x2={200 + 1520 * prog(t, 376.5, 377.4)} y2={980} stroke="#fff" strokeWidth={10} /></svg>}
      </Cam>
      {t >= 381 && (
        <AbsoluteFill>
          <Cam t={t} k={[[381, 960, 540, 1.0], [384.6, 960, 540, 1.0], [385.2, HX, HY + 40, 2.1], [388.4, HX, HY + 40, 2.1]]}>
            <Corte t={t} boga={0.6} caos={interpolate(t, [381, 383], [0, 1], cl)} heroeExpr={t < 383 ? "cansado" : "miedo"} />
          </Cam>
          {t > 385.05 && t < 385.4 && <AbsoluteFill style={{ background: "#fff", opacity: 0.3 * (1 - prog(t, 385.05, 385.4)) }} />}
        </AbsoluteFill>
      )}
      <Chip t={t} t0={376.6} t1={380.8} text="OAR: 4+ METERS" color={C.oro} tinta={C.noche} x={960} y={900} centro size={64} />
      <Chip t={t} t0={378.2} t1={380.8} text="A FOREST OF OARS" color={C.violeta} x={960} y={150} centro size={58} />
      <Chip t={t} t0={381.04} t1={384.8} text="0.5 SECONDS LATE" color={C.rojo} x={960} y={150} centro size={62} />
      <Chip t={t} t0={383.0} t1={384.8} text="BLADES CRASH" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={56} />
      <Grande t={t} t0={385.1} text="WHACK!" x={1400} y={300} size={170} color={C.rojo} />
      <Chip t={t} t0={385.6} text="LIKE A CLUB" color={C.violeta} x={1400} y={470} centro size={56} />
    </Escena>

    {/* 388,4 · "Rowers today call it catching a crab. And on a quinquereme... the top two levels had two men pulling the same oar. If one slips, both pay." */}
    <Escena t={t} t0={388.4} t1={401.4} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[388.9, 392.1, 394.5, 398.7, 400.3]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #8fd0f2 0%, #8fd0f2 45%, #1f5c9c 45%, #12407a 100%)" }} />
      {t < 392.1 && (
        <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={-100} y1={200} x2={1100} y2={560} stroke="#c49058" strokeWidth={34} strokeLinecap="round" /><path d="M 1000 520 L 1300 580 L 1290 680 L 980 600 Z" fill="#d8a868" stroke="#8a5a2a" strokeWidth={8} /></svg>
          {t > 388.6 && <Cangrejo x={1180} y={640} s={ent(t, 388.6) * 1.1} t={t} />}
          <Salpica t={t} t0={388.7} x={1150} y={600} s={1.4} />
        </>
      )}
      {t >= 392.1 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={0} width={1920} height={1080} fill="#5a3018" />
          {Array.from({ length: 22 }, (_, i) => <line key={i} x1={0} y1={i * 52} x2={1920} y2={i * 52} stroke="#2a1408" strokeOpacity={0.35} strokeWidth={4} />)}
          {(() => {
            const f = t * 0.6 * Math.PI * 2;
            const slip = t > 398.7 ? prog(t, 398.7, 399.2) : 0;
            return (
              <>
                <line x1={500} y1={560} x2={1900} y2={440} stroke="#d8a868" strokeWidth={26} strokeLinecap="round" />
                <g transform="translate(620 900) scale(1.6)"><Remero fase={f} ropa="#2fb5d8" piel="#c98b62" pelo="#1d1410" expr={t > 400.3 ? "miedo" : "cansado"} seed={2} t={t} sudor /></g>
                <g transform={`translate(1000 ${900 + slip * 60}) scale(1.6) rotate(${slip * 25})`}><Remero fase={f + slip * 3} ropa="#a8673f" piel="#f2b48a" expr={slip > 0 ? "miedo" : "neutro"} seed={7} t={t} /></g>
              </>
            );
          })()}
        </svg>
      )}
      {t < 392.1 && <Grande t={t} t0={388.9} text="'CATCHING A CRAB'" y={170} size={120} color={C.crema} />}
      <Chip t={t} t0={392.2} text="NOT EVEN 1 OAR PER MAN" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={394.5} text="2 MEN · 1 OAR" color={C.oro} tinta={C.noche} x={960} y={250} centro size={70} />
      <Chip t={t} t0={398.7} text="ONE SLIPS..." color={C.rojo} x={1500} y={420} centro size={58} />
      <Chip t={t} t0={400.3} text="BOTH PAY" color={C.rojo} x={1500} y={530} centro size={70} />
    </Escena>

    {/* 401,4 · "On a warship, it could crack your ribs and jam the whole row." */}
    <Escena t={t} t0={401.4} t1={405.2} entra="fundido" sale="fundido" fondo="#120c30" golpes={[402.4, 403.6]}>
      <Costillas t={t} t0={401.6} x={620} y={540} />
      <Chip t={t} t0={402.34} text="CRACKED RIBS" color={C.rojo} x={1350} y={420} centro size={64} />
      <Chip t={t} t0={403.6} text="+ THE WHOLE ROW JAMS" color={C.violeta} x={1350} y={560} centro size={54} />
    </Escena>

    {/* 405,2 · "So you row in perfect time, for hours, under the summer sun... several liters of water a day" */}
    <Escena t={t} t0={405.2} t1={415.5} entra="fundido" sale="paneo" fondo="none" golpes={[407.0, 408.0, 410.3, 413.0]}>
      <Rayos t={t} x={1500} y={220} op={0.2} />
      <Astro x={1500} y={220} r={130 + Math.sin(t * 5) * 8} />
      <Calor t={t} y={480} op={0.45} />
      <Galera x={760} y={720} s={0.6} t={t} boga={0.6} vela={false} />
      <Jarra t={t} t0={410.5} x={1560} y={720} litros={5} />
      <Chip t={t} t0={405.3} text="PERFECT TIME" color={C.violeta} x={120} y={140} size={60} />
      <Chip t={t} t0={407.0} text="FOR HOURS" color={C.rojo} x={120} y={250} size={60} />
      <Chip t={t} t0={408.0} text="SUMMER SUN" color={C.oro} tinta={C.noche} x={120} y={360} size={56} />
      <Chip t={t} t0={412.0} text="LITERS OF SWEAT / DAY" color="#1d6f8a" x={1560} y={1010} centro size={46} />
    </Escena>

    {/* 415,5 · "the ship carries almost no water. What it does carry is hard dry biscuit and posca... sour wine mixed with water. Breakfast, lunch and dinner of champions." */}
    <Escena t={t} t0={415.5} t1={427.4} entra="paneo" sale="fundido" fondo="#7a4520" golpes={[416.5, 418.4, 419.4, 421.6, 424.7, 425.6, 425.9]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #8a5228, #5a3018)" }} />
      {t < 418.3 && <Jarra t={t} t0={415.6} x={960} y={600} litros={0.35} />}
      {t < 424.6 && (
        <>
          {t > 418.3 && <Galleta x={520} y={500} s={1.4 * ent(t, 418.36)} />}
          {t > 419.3 && <Anfora x={1300} y={520} s={1.0 * ent(t, 419.4)} txt="POSCA" />}
          {t > 421.6 && <div style={{ position: "absolute", left: 1300, top: 860, transform: `translate(-50%,-50%) scale(${ent(t, 421.6)})`, display: "flex", gap: 20, alignItems: "center", whiteSpace: "nowrap", fontFamily, fontWeight: 700, fontSize: 56, color: "#fff" }}><span style={{ background: "#7a1f3a", padding: "6px 20px", borderRadius: 14 }}>SOUR WINE</span>+<span style={{ background: "#2a8fd0", padding: "6px 20px", borderRadius: 14 }}>WATER</span></div>}
        </>
      )}
      {t >= 424.6 && [0, 1, 2].map((i) => { const t0 = [424.7, 425.56, 425.9][i]; return t < t0 ? null : <React.Fragment key={i}><svg style={{ position: "absolute", left: 420 + i * 540 - 200, top: 380, transform: `scale(${ent(t, t0)})` }} width={400} height={300}><ellipse cx={200} cy={180} rx={190} ry={70} fill="#e8dcc4" /><ellipse cx={200} cy={170} rx={150} ry={50} fill="#f6efe0" /></svg><Galleta x={420 + i * 540} y={500} s={0.8 * ent(t, t0)} /></React.Fragment>; })}
      <Chip t={t} t0={415.5} t1={424.4} text="ALMOST NO WATER" color="#1d6f8a" x={960} y={140} centro size={60} />
      <Chip t={t} t0={418.4} t1={424.4} text="HARD DRY BISCUIT" color={C.oro} tinta={C.noche} x={520} y={780} centro size={54} />
      {(["BREAKFAST", "LUNCH", "DINNER"] as const).map((n, i) => <Chip key={n} t={t} t0={[424.7, 425.56, 425.9][i]} text={n} color={[C.ambar, C.teal, C.violeta][i]} tinta={i < 2 ? C.noche : "#fff"} x={420 + i * 540} y={760} centro size={54} />)}
      <Persona x={1790} y={1010} h={380} t={t} seed={2} ropa={APION} expr={t > 420.2 && t < 424.6 ? "enojado" : t < 424.6 ? "neutro" : "triste"} bD={t > 419.6 && t < 421.0 ? 150 : t > 421.0 && t < 424.6 ? 80 : 10} cD={t > 419.6 && t < 421.0 ? 110 : 40} manoD={t > 419.6 && t < 424.6 ? <path d="M -16 -10 L 16 -10 L 12 26 L -12 26 Z" fill="#c9773f" stroke="#6a3a10" strokeWidth={4} /> : undefined} mira={-0.6} />
      <Emote t={t} t0={420.4} t1={424.4} tipo="enojo" x={1790} y={1010 - 330} s={1.1} />
      <Chip t={t} t0={426.2} text="...OF CHAMPIONS" color={C.rojo} x={960} y={930} centro size={62} />
    </Escena>

    {/* 427,4 · "And then, in battle, comes the call every rower dreads. Faster. Ramming speed. A sprint at full power until your lungs are on fire." */}
    <Escena t={t} t0={427.4} t1={436.6} entra="fundido" sale="fundido" fondo="#3a1c0e" quieta golpes={[427.8, 431.1, 431.9, 433.0]}>
      <Cam t={t} k={[[427.4, 960, 540, 1.0], [431.0, 960, 540, 1.0], [431.4, HX, HY - 60, 1.6], [436.6, HX, HY - 60, 1.75]]}>
        <Corte t={t} boga={interpolate(t, [427.4, 431, 432, 436.6], [0.5, 0.6, 1.6, 2.0], cl)} agua={0.06} heroeExpr={t < 431 ? "cansado" : "miedo"} />
        <AbsoluteFill style={{ background: "#ff2a2a", opacity: t > 431 ? 0.18 + 0.12 * Math.sin(t * 14) : 0, mixBlendMode: "multiply" }} />
        {t > 433 && <Particulas t={t} tipo="brasas" n={30} seed={12} />}
      </Cam>
      <Chip t={t} t0={428.86} t1={430.9} text="THE CALL EVERY ROWER DREADS" color={C.violeta} x={960} y={150} centro size={56} />
      <Grande t={t} t0={431.08} text="FASTER." y={300} size={170} color={C.crema} />
      <Grande t={t} t0={431.94} text="RAMMING SPEED!" y={520} size={150} color={C.rojo} />
      <Chip t={t} t0={433.0} text="LUNGS ON FIRE" color={C.ambar} tinta={C.noche} x={960} y={960} centro size={62} />
    </Escena>

    {/* 436,6 · "Because in a naval battle, you, personally, are the engine, and the weapon is coming next." — salimos del corte: la galera embiste */}
    <Escena t={t} t0={436.6} t1={442.1} entra="fundido" sale="atraviesa" sx={1500} sy={640} fondo="none" quieta golpes={[438.1, 439.3, 439.9]}>
      <Cam t={t} k={[[436.6, 800, 640, 2.0], [438.6, 900, 600, 1.0], [441.0, 1100, 600, 1.0], [442.1, 1500, 640, 1.8]]}>
        <Galera x={interpolate(t, [436.6, 442.1], [700, 1050])} y={640} s={0.85} t={t} boga={2.0} vela={false} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 12 }, (_, i) => { const x = ((i * 180 - t * 900) % 2100 + 2100) % 2100 - 100; return <line key={i} x1={x} y1={300 + (i * 67) % 500} x2={x + 160} y2={300 + (i * 67) % 500} stroke="#fff" strokeWidth={8} opacity={0.5} strokeLinecap="round" />; })}</svg>
        {t > 439.9 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><circle cx={interpolate(t, [436.6, 442.1], [700, 1050]) + 0.85 * 850} cy={640 + 20} r={40 + 30 * Math.sin(t * 12)} fill="#ffe08a" opacity={0.6} /></svg>}
      </Cam>
      <div style={{ position: "absolute", left: 100, top: 540, width: 380, height: 380, borderRadius: 190, overflow: "hidden", background: "radial-gradient(circle, #6a3a1e, #2a1408)", border: "10px solid #2fb5d8", transform: `scale(${ent(t, 436.8)})` }}>
        <Persona x={190} y={pp(560, 210)} h={560} t={t} seed={2} ropa={APION} expr="miedo" bI={95 + Math.sin(t * 12) * 30} bD={95 + Math.sin(t * 12) * 30} cI={60 - Math.sin(t * 12) * 30} cD={60 - Math.sin(t * 12) * 30} inclina={Math.sin(t * 12) * 8} />
        <Emote t={t} t0={437.2} tipo="sudor" x={190} y={150} s={1.2} />
      </div>
      <Chip t={t} t0={438.08} text="YOU," color="#2fb5d8" tinta={C.noche} x={300} y={160} centro size={66} />
      <Chip t={t} t0={438.46} text="PERSONALLY," color={C.violeta} x={700} y={160} centro size={58} />
      <Chip t={t} t0={439.26} text="ARE THE ENGINE" color={C.rojo} x={1250} y={160} centro size={66} />
      <Chip t={t} t0={439.94} text="THE WEAPON IS NEXT →" color={C.oro} tinta={C.noche} x={960} y={950} centro size={58} />
    </Escena>
  </>
);
