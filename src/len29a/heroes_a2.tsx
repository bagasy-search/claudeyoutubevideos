// len29a · componentes únicos 16-29 (12:27 → 24:40), 2ª vuelta tras el evaluador: un objeto con volumen por idea
// (degradés de material, sombra de contacto), un mecanismo que se entiende sin leer, elementos de a uno, nada sobre el título.
import React from "react";
import { AMB, DIM, Defs, H, HAND, Head, ICE, RED, Shadow, Stage, Tag, cl, eio, phys } from "./hkit";

const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const FULL = { position: "absolute", inset: 0 } as const;
const Tube: React.FC<{ d: string; w: number; col?: string; inner?: string; op?: number }> = ({ d, w, col = "#f1ede4", inner = "#16181b", op = 1 }) => <g opacity={op}>
  <path d={d} stroke="#8f897c" strokeWidth={w + 8} fill="none" strokeLinejoin="round" />
  <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinejoin="round" />
  <path d={d} stroke="rgba(255,255,255,.55)" strokeWidth={w * 0.12} fill="none" strokeLinejoin="round" transform={`translate(${-w * 0.22} ${-w * 0.22})`} />
  <path d={d} stroke={inner} strokeWidth={w * 0.72} fill="none" strokeLinejoin="round" />
</g>;
const Hair: React.FC<{ x: number; y: number; s: number; n?: number; seed?: number; w?: number }> = ({ x, y, s, n = 14, seed = 1, w = 3 }) => <g>
  {Array.from({ length: n }, (_, i) => <path key={i} d={`M ${x + (rn(i, seed) - 0.5) * s} ${y + (rn(i, seed + 1) - 0.5) * s * 0.4} c ${s * 0.3} ${-s * 0.4} ${s * 0.6} ${s * 0.4} ${s * (0.7 + 0.5 * rn(i, seed + 2))} ${s * (rn(i, seed + 3) - 0.5) * 0.6}`} stroke={i % 3 ? "#2a1e16" : "#5a4330"} strokeWidth={w} fill="none" strokeLinecap="round" />)}
</g>;

// ---- 12:27 · LOS 25 PIES: el cable sale del tambor rojo, baja por el caño de la casa en corte, dobla en la pared y corre por el piso; cada 5 pies se prende una marca y en 25 llega a la calle ----
export const HOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = eio(tt, 0.8, 5.0), crank = tt * 420 * (L < 1 ? 1 : 0.1), house = cl(phys(tt, 0.1, 5, 0.6));
  // camino del caño: pileta → baja → piso → hacia la calle
  const P = "M 520 470 L 520 820 L 1700 820";
  const seg1 = 350, seg2 = 1180, tot = seg1 + seg2;
  const pt = (s: number): [number, number] => { const d = s * tot; return d < seg1 ? [520, 470 + d] : [520 + (d - seg1), 820]; };
  const tip = pt(L);
  return <>
    <Head tt={tt} kick="A $20 HAND AUGER" title="25 FEET OF CABLE" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={house} transform={`translate(0 ${(1 - house) * 120})`}>
        {/* la casa en corte: piso, pared, ventana y la vereda afuera */}
        <rect x={220} y={300} width={1240} height={580} fill="#2a2620" /><path d="M 200 300 L 840 120 L 1480 300 Z" fill="#5a3226" />
        <rect x={220} y={880} width={1700} height={40} fill="url(#woodV)" /><rect x={1460} y={300} width={30} height={580} fill="#ece8de" />
        <rect x={1490} y={760} width={430} height={120} fill="#55524b" /><rect x={1490} y={740} width={430} height={20} fill="#8c877c" />
        <rect x={1020} y={420} width={180} height={160} fill="#1f3550" stroke="#ece8de" strokeWidth={10} />
        {/* la pileta arriba del caño */}
        <path d="M 400 420 L 640 420 L 610 470 L 430 470 Z" fill="url(#chromeV)" /><rect x={380} y={410} width={280} height={14} fill="url(#pvcV)" />
        <Tube d={P} w={64} />
      </g>
      {/* marcas cada 5 pies: se prenden al pasar la punta */}
      {[1, 2, 3, 4, 5].map((k) => { const [x, y] = pt(k / 5), on = L >= k / 5 - 0.002, f = on ? Math.exp(-Math.max(0, (tt - 0.8) - (k / 5) * 4.2) * 2) : 0;
        return <g key={k} opacity={house}><circle cx={x} cy={y} r={20 + 14 * f} fill={on ? AMB : "#3a3833"} stroke="#111" strokeWidth={4} />
          <text x={x} y={y + (y < 800 ? 6 : 80)} dx={y < 800 ? -56 : 0} textAnchor="middle" fontWeight={900} fontSize={34} fill={on ? AMB : DIM}>{k * 5}</text></g>; })}
      {/* el cable dentro del caño */}
      <path d={P} fill="none" stroke="url(#chromeV)" strokeWidth={12} pathLength={1} strokeDasharray={`${L} 1`} />
      <circle cx={tip[0]} cy={tip[1]} r={14} fill="url(#chromeR)" />
      {/* el tambor rojo con su manija, al lado de la pileta */}
      <g transform="translate(300 600)"><Shadow x={0} y={150} w={260} /><circle r={110} fill="url(#rubberR)" /><circle r={30} fill="url(#ironR)" />
        <g transform={`rotate(${crank})`}><rect x={-10} y={-110} width={20} height={100} fill="url(#ironH)" /><circle cy={-110} r={20} fill="url(#woodR)" /></g>
        <path d="M 80 -60 Q 170 -150 220 -140" stroke="url(#chromeV)" strokeWidth={12} fill="none" /></g>
    </svg>
    <Tag tt={tt} at={5.2} x={1700} y={680} txt="25 FT" col={AMB} size={64} />
  </>;
}}</Stage>;

// ---- 13:15 · EL POP-UP EN CORTE: el lavatorio de costado; la palanca de atrás baja, la varilla pivota y el tapón sube con su anillo de mugre; la tuerca se suelta y el tapón sale entero ----
export const HPopup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const bowl = cl(phys(tt, 0.1, 5, 0.6)), lever = Math.sin(Math.PI * eio(tt, 1.0, 2.6)), nut = eio(tt, 3.0, 3.6), rod = eio(tt, 3.6, 4.3), out = phys(tt, 4.4, 5, 0.45);
  const piv = -14 * lever, sy = 470 - 60 * lever - 260 * out;
  return <>
    <Head tt={tt} kick="BATHROOM SINK" title="THAT'S THE POP-UP" col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={bowl}>
        {/* la pileta de loza en corte */}
        <path d="M 520 300 L 1400 300 L 1400 330 Q 1300 520 1000 540 L 920 540 Q 620 520 520 330 Z" fill="url(#pvcH)" />
        <path d="M 560 330 L 1360 330 Q 1270 500 1000 512 L 920 512 Q 650 500 560 330 Z" fill="#cfd6dc" />
        <rect x={924} y={512} width={72} height={420} fill="url(#chromeH)" /><rect x={936} y={512} width={48} height={420} fill="#1b1d20" />
        {/* palanca de atrás (detrás de la canilla) que baja la varilla vertical */}
        <rect x={1200} y={170 + 40 * lever} width={22} height={420} fill="url(#chromeH)" /><circle cx={1211} cy={160 + 40 * lever} r={26} fill="url(#chromeR)" />
        <g transform={`translate(${-320 * rod} 0)`}>
          <g transform={`rotate(${piv} 1000 700)`}><rect x={960} y={692} width={300} height={16} rx={8} fill="url(#chromeV)" /></g>
          <circle cx={1211} cy={700 + 4 * lever} r={10} fill="url(#ironR)" />
        </g>
        {/* tuerca de la varilla: se ilumina y gira suelta */}
        <g transform={`translate(${1010 + 140 * nut} 700) rotate(${-260 * nut})`}><polygon points="-30,-26 30,-26 40,0 30,26 -30,26 -40,0" fill="url(#pvcR)" stroke={nut > 0 ? AMB : "#8f897c"} strokeWidth={6} /></g>
      </g>
      {/* el tapón: sube con la palanca y, suelta la varilla, sale entero con su anillo de mugre y pelo */}
      <g transform={`translate(960 ${sy})`} opacity={bowl}>
        <ellipse cx={0} cy={40} rx={66} ry={14} fill="url(#chromeV)" /><rect x={-14} y={40} width={28} height={220} fill="url(#chromeH)" />
        <circle cx={0} cy={232} r={10} fill="#111" stroke="#bfc4c9" strokeWidth={4} />
        <g opacity={cl(phys(tt, 2.0, 5, 0.6))}><rect x={-26} y={90} width={52} height={70} rx={14} fill="#6e675a" /><Hair x={0} y={130} s={70} seed={4} w={4} /></g>
      </g>
    </svg>
    <Tag tt={tt} at={3.1} x={1300} y={800} txt="UNSCREW THIS NUT" col={AMB} size={46} anchor="l" />
  </>;
}}</Stage>;

// ---- 14:40 · LA CARTA DEL QUE MIRA: el sobre llega girando, la solapa se abre hacia atrás, sale la tarjeta escrita a mano y viene al frente con un mechón de pelo pegado con cinta ----
export const HLetter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2a2520, #0c0b0a 75%)">{(tt) => {
  const env = phys(tt, 0.1, 5, 0.5), flap = eio(tt, 1.2, 2.0), up = eio(tt, 2.0, 3.0), front = eio(tt, 3.0, 4.0), tape = phys(tt, 4.4, 6, 0.4);
  return <>
    <Head tt={tt} kick="A QUESTION FROM YOU" title="HOW MUCH HAIR?" col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 650, width: 760, height: 460, perspective: 1600, transform: `translate(-50%,-50%) translateY(${(1 - env) * 600 + 260 * front}px) rotate(${(1 - env) * -24}deg)`, opacity: cl(env * 3) * (1 - 0.6 * front) }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#efe4cc,#d2c3a2)", borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 270, transformOrigin: "50% 0%", transform: `rotateX(${180 * flap}deg)`, zIndex: flap > 0.5 ? 0 : 3 }}>
        <svg width={760} height={270}><path d="M 0 0 L 760 0 L 380 260 Z" fill={flap > 0.5 ? "#c9b893" : "#e6d9bc"} stroke="#b9a885" strokeWidth={3} /></svg></div>
      <svg width={760} height={460} style={{ position: "absolute", inset: 0, zIndex: 2 }}><path d="M 0 460 L 380 200 L 760 460 Z" fill="#e2d4b5" /><path d="M 0 0 L 360 230 L 0 460 Z" fill="#dacbaa" /><path d="M 760 0 L 400 230 L 760 460 Z" fill="#dacbaa" />
        <rect x={600} y={330} width={110} height={90} fill="#c94a3a" opacity={0.85} /></svg>
    </div>
    {/* la tarjeta */}
    <div style={{ position: "absolute", left: 960, top: 600, width: 680, height: 400, transform: `translate(-50%,-50%) translateY(${(1 - up) * 90 - 120 * up + 60 * front}px) scale(${0.92 + 0.28 * front}) rotate(${-2 + 4 * front}deg)`, opacity: cl(up * 4), zIndex: 1,
      background: "linear-gradient(180deg,#fffdf6,#f2ecdc)", boxShadow: `0 ${30 + 40 * front}px ${60 + 50 * front}px rgba(0,0,0,.55)`, borderRadius: 6 }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 90 + i * 50, height: 2, background: "#c8d6e6" }} />)}
      <div style={{ position: "absolute", left: 60, top: 70, fontFamily: HAND, fontSize: 70, fontWeight: 700, color: "#25324a", transform: "rotate(-2deg)" }}>How much hair</div>
      <div style={{ position: "absolute", left: 90, top: 160, fontFamily: HAND, fontSize: 70, fontWeight: 700, color: "#25324a", transform: "rotate(-1deg)" }}>goes down a sink?</div>
      <svg width={680} height={400} style={{ position: "absolute", inset: 0, opacity: cl(tape * 2), transform: `translateY(${(1 - tape) * -60}px)` }}>
        <Hair x={520} y={320} s={120} n={22} seed={6} w={3} /><rect x={470} y={290} width={150} height={44} fill="rgba(240,232,190,.75)" transform="rotate(-8 545 312)" /></svg>
    </div>
  </>;
}}</Stage>;

// ---- 15:10 · LA RED DE PELO: dentro del caño de vidrio las hebras se tienden de a una y tejen una red; la grasa dorada y los granos que bajan quedan presos y el agua apenas pasa ----
export const HHairNet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pipe = cl(phys(tt, 0.1, 5, 0.6)), NS = 12;
  return <>
    <Head tt={tt} kick="IN THE KITCHEN" title="HAIR IS THE NET" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><clipPath id="hnC"><rect x={220} y={440} width={1480} height={300} rx={30} /></clipPath></defs>
      <g opacity={pipe}>
        <rect x={210} y={430} width={1500} height={320} rx={40} fill="url(#glassH)" stroke="rgba(255,255,255,.6)" strokeWidth={6} />
        <g clipPath="url(#hnC)">
          <rect x={220} y={640} width={1480} height={100} fill="url(#waterV)" opacity={0.55} />
          {/* las hebras: una por vez, se tienden de arriba abajo a través del paso */}
          {Array.from({ length: NS }, (_, i) => { const k = eio(tt, 0.6 + i * 0.22, 1.3 + i * 0.22), x0 = 1040 + (rn(i) - 0.5) * 260, x1 = 1040 + (rn(i, 2) - 0.5) * 300;
            return <path key={i} d={`M ${x0} 440 C ${x0 + 120 * (rn(i, 3) - 0.5)} 540 ${x1 - 140 * (rn(i, 4) - 0.5)} 640 ${x1} 740`} stroke={i % 3 ? "#2a1e16" : "#5d4532"} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${k} 1`} />; })}
          {/* lo que baja: gotas de grasa (doradas) y granos de arroz; quedan presos contra la red */}
          {Array.from({ length: 26 }, (_, i) => { const a = 2.6 + i * 0.16, k = tt - a; if (k < 0) return null;
            const stop = 960 - (i % 5) * 14 - 40 * rn(i), x = Math.min(stop, 260 + k * 520), y = 470 + 250 * rn(i, 5), grease = i % 3 !== 0;
            return grease ? <ellipse key={i} cx={x} cy={y} rx={22} ry={16} fill="url(#greaseR)" /> : <ellipse key={i} cx={x} cy={y} rx={16} ry={7} fill="#f4efe0" transform={`rotate(${rn(i, 6) * 180} ${x} ${y})`} />; })}
          {/* un hilito de agua que pasa por abajo */}
          {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.5 + i / 8) % 1); return <circle key={"w" + i} cx={1100 + k * 560} cy={710 + 6 * Math.sin(i)} r={6} fill="#cfefff" opacity={tt > 3 ? 0.8 : 0} />; })}
        </g>
      </g>
    </svg>
    <Tag tt={tt} at={3.6} x={560} y={360} txt="GREASE GETS CAUGHT" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 16:03 · LA PAVA Y EL TERMÓMETRO: la pava vuelca agua hirviendo en el caño blanco; el mercurio del termómetro de vidrio pasa la raya del PVC y el caño se ablanda, se comba y gotea por la junta ----
export const HThermo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pour = eio(tt, 0.8, 1.6), merc = eio(tt, 1.2, 3.6), over = cl((merc - 0.62) / 0.38), sag = eio(tt, 3.0, 4.6), drip = tt > 4.2;
  const P = `M 700 520 L 1000 ${560 + 70 * sag} Q 1150 ${620 + 110 * sag} 1300 ${560 + 70 * sag} L 1600 560`;
  return <>
    <Head tt={tt} kick="WHITE PLASTIC PIPE" title="NO BOILING WATER" col={RED} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* la pava inclinándose */}
      <g transform={`translate(560 360) rotate(${-38 * pour})`} opacity={cl(phys(tt, 0.1, 5, 0.6))}>
        <path d="M -110 -20 Q -120 -150 0 -160 Q 120 -150 110 -20 Z" fill="url(#chromeV)" /><rect x={-120} y={-30} width={240} height={30} rx={14} fill="url(#ironV)" />
        <path d="M 100 -100 L 210 -170 L 220 -150 L 110 -60 Z" fill="url(#chromeH)" /><path d="M -60 -170 Q 0 -240 60 -170" stroke="url(#ironV)" strokeWidth={16} fill="none" /></g>
      {pour > 0.6 && <path d={`M 760 ${250} Q 760 400 720 520`} stroke="#d9f1ff" strokeWidth={14} fill="none" opacity={0.8} />}
      {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.4 + i / 8) % 1); return <path key={i} d={`M ${720 + 40 * Math.sin(i * 2 + k * 6)} ${500 - k * 220} q 20 -30 0 -60`} stroke="rgba(255,255,255,.5)" strokeWidth={8} fill="none" opacity={pour * (1 - k)} />; })}
      {/* el caño de PVC que se comba */}
      <Tube d={P} w={110} col={over > 0.3 ? `rgb(${241},${237 - 60 * over},${228 - 80 * over})` : "#f1ede4"} />
      {drip && Array.from({ length: 4 }, (_, i) => { const k = ((tt - 4.2) * 0.8 + i / 4) % 1; return <ellipse key={i} cx={1150} cy={700 + 60 * sag + k * 260} rx={10} ry={14} fill="#cfefff" opacity={1 - k} />; })}
      {drip && <ellipse cx={1150} cy={1000} rx={140 * cl((tt - 4.2) / 2)} ry={18 * cl((tt - 4.2) / 2)} fill="#9fd3ef" opacity={0.6} />}
      {/* el termómetro de vidrio */}
      <g transform="translate(1660 260)" opacity={cl(phys(tt, 0.6, 5, 0.6))}>
        <rect x={-30} y={0} width={60} height={560} rx={30} fill="url(#glassH)" stroke="rgba(255,255,255,.7)" strokeWidth={4} />
        <circle cx={0} cy={600} r={54} fill="#d63a2a" /><rect x={-10} y={560 - 520 * merc} width={20} height={520 * merc + 30} fill="#d63a2a" />
        <line x1={-56} x2={56} y1={560 - 520 * 0.62} y2={560 - 520 * 0.62} stroke={AMB} strokeWidth={6} />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={30} x2={i % 5 ? 44 : 54} y1={560 - i * 52} y2={560 - i * 52} stroke="#bcc3c9" strokeWidth={3} />)}
      </g>
    </svg>
    <Tag tt={tt} at={2.4} x={1300} y={560 - 520 * 0.62 + 260} txt="PVC LIMIT" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 17:14 · EL HIERRO COMIDO: el fondo de un caño galvanizado viejo en corte (zinc, acero, óxido); las gotas del químico lo van picando capa por capa hasta que se abre un agujero y gotea afuera ----
export const HRust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const eat = eio(tt, 1.0, 4.4), hole = cl((tt - 4.2) / 0.5), pipe = cl(phys(tt, 0.1, 5, 0.6));
  const pit = (x: number, depth: number) => `M ${x - 70} 600 Q ${x} ${600 + depth * 2} ${x + 70} 600`;
  return <>
    <Head tt={tt} kick="OLD METAL PIPES" title="IT EATS THE PIPE" col={RED} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><clipPath id="ruC"><rect x={300} y={600} width={1320} height={180} /></clipPath></defs>
      <g opacity={pipe} transform={`translate(0 ${(1 - pipe) * 100})`}>
        {/* el caño en corte, abierto arriba: las tres capas del fondo */}
        <path d="M 300 300 L 300 600 L 1620 600 L 1620 300" stroke="url(#ironV)" strokeWidth={40} fill="none" opacity={0.7} />
        <rect x={300} y={600} width={1320} height={36} fill="#c2c8cd" /><rect x={300} y={636} width={1320} height={100} fill="url(#ironV)" /><rect x={300} y={736} width={1320} height={44} fill="#7a3f22" />
        <rect x={320} y={470} width={1280} height={130} fill="#6a8f3a" opacity={0.3 + 0.2 * eat} />
        {/* los picados que bajan */}
        <g clipPath="url(#ruC)">{[520, 820, 960, 1180, 1400].map((x, i) => { const d = (60 + 30 * rn(i)) * cl(eat * (1 + rn(i, 2) * 0.6)); return <g key={i}><path d={pit(x, d)} fill="#3a1f12" /><path d={pit(x, d * 1.25)} fill="none" stroke="#b5562a" strokeWidth={10} /></g>; })}
          <rect x={900} y={600} width={120} height={180 * hole} fill="#0b0b0b" /></g>
      </g>
      {/* gotas del químico que caen sobre el fondo */}
      {Array.from({ length: 14 }, (_, i) => { const a = 0.6 + i * 0.27, k = tt - a; if (k < 0 || k > 0.5) return null; const x = [520, 820, 960, 1180, 1400][i % 5];
        return <ellipse key={i} cx={x} cy={200 + k / 0.5 * 400} rx={12} ry={18} fill="#9fd04a" />; })}
      {/* y sale por abajo */}
      {hole > 0.5 && Array.from({ length: 4 }, (_, i) => { const k = ((tt - 4.5) * 0.9 + i / 4) % 1; return <ellipse key={i} cx={960} cy={790 + k * 220} rx={12} ry={18} fill="#9fd04a" opacity={1 - k} />; })}
      {hole > 0.5 && <ellipse cx={960} cy={1020} rx={180 * cl(tt - 4.5)} ry={18} fill="#6c8c34" opacity={0.6} />}
    </svg>
    <Tag tt={tt} at={4.6} x={1100} y={900} txt="A HOLE" col={RED} size={60} anchor="l" />
  </>;
}}</Stage>;

// ---- 18:01 · EL SOPAPO DE VUELTA: pileta doble en corte unida abajo; el sopapo empuja de un lado y el químico amarillo sube por el OTRO y salta en chorro hacia la cara ----
export const HPlunger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const push = tt > 1.0 ? Math.max(0, Math.sin((tt - 1.0) * 5)) * cl((tt - 1.0) / 0.4) * (tt < 3.6 ? 1 : 0) : 0, jet = eio(tt, 2.4, 3.2) * (1 - eio(tt, 4.6, 5.6)), lv = 0.5 + 0.25 * push + 0.2 * jet;
  return <>
    <Head tt={tt} kick="CHEMICALS, THEN A PLUNGER" title="IT COMES BACK UP" col={RED} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* las dos piletas y el caño que las une */}
      {[620, 1300].map((x, i) => <g key={i}><path d={`M ${x - 220} 420 L ${x + 220} 420 L ${x + 180} 640 L ${x - 180} 640 Z`} fill="url(#chromeV)" opacity={0.6} />
        <rect x={x - 180} y={640 - 200 * (i ? lv : 0.5 - 0.3 * push)} width={360} height={200 * (i ? lv : 0.5 - 0.3 * push)} fill="rgba(222,200,60,.7)" /></g>)}
      <Tube d="M 620 640 L 620 820 L 1300 820 L 1300 640" w={110} inner="rgba(222,200,60,.85)" />
      {/* el sopapo, bajando y subiendo */}
      <g transform={`translate(620 ${420 + 90 * push})`}><path d="M -130 120 Q 0 -20 130 120 Z" fill="url(#rubberR)" /><rect x={-16} y={-300} width={32} height={340} rx={10} fill="url(#woodH)" /></g>
      {/* el chorro por el otro lado */}
      {jet > 0.02 && <><path d={`M 1300 ${640 - 200 * lv} Q 1310 ${300 - 200 * jet} 1440 ${200 + 60 * (1 - jet)}`} stroke="rgba(230,206,60,.9)" strokeWidth={30 * jet} fill="none" strokeLinecap="round" />
        {Array.from({ length: 18 }, (_, i) => { const k = ((tt * 1.3 + rn(i)) % 1); return <circle key={i} cx={1320 + 260 * k + 60 * (rn(i, 2) - 0.5)} cy={300 - 160 * jet + 200 * k * k} r={6 + 8 * rn(i, 3)} fill="#e6ce3c" opacity={jet * (1 - k)} />; })}</>}
    </svg>
    <Tag tt={tt} at={3.0} x={1520} y={260} txt="ON YOU" col={RED} size={60} anchor="l" />
  </>;
}}</Stage>;

// ---- 19:44 · LA LIBRETA DE STAN: una libreta de bolsillo gastada se abre como un libro; un lápiz escribe la regla de 1976, renglón por renglón ----
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2a2219, #0c0a08 75%)">{(tt) => {
  const nb = phys(tt, 0.1, 5, 0.5), open = eio(tt, 0.9, 1.9), w1 = eio(tt, 2.0, 3.4), w2 = eio(tt, 3.4, 4.6);
  const px = w2 > 0 ? 1000 + 420 * w2 : 1000 + 440 * w1, py = w2 > 0 ? 640 : 540;
  const line = (txt: string, k: number, y: number) => <div style={{ position: "absolute", left: 1000, top: y, width: 460, height: 80, overflow: "hidden", clipPath: `inset(0 ${100 - 100 * k}% 0 0)`, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#2e2a26", whiteSpace: "nowrap" }}>{txt}</div>;
  return <>
    <div style={{ position: "absolute", inset: 0, perspective: 1800, opacity: cl(nb * 3), transform: `translateY(${(1 - nb) * 500}px)` }}>
      <div style={{ position: "absolute", left: 980, top: 340, width: 500, height: 600, background: "linear-gradient(90deg,#e9e1cd,#f6f1e4)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", borderRadius: "0 10px 10px 0" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 100 + i * 50, height: 2, background: "#bfcbd6" }} />)}
        <div style={{ position: "absolute", left: 30, top: 30, fontFamily: HAND, fontSize: 46, color: "#6b6156" }}>1976</div></div>
      {/* tapa de cuero: gira sobre el lomo */}
      <div style={{ position: "absolute", left: 980, top: 340, width: 500, height: 600, transformOrigin: "0% 50%", transform: `rotateY(${-178 * open}deg)`, background: open > 0.5 ? "linear-gradient(90deg,#efe7d4,#e3d9c2)" : "linear-gradient(135deg,#6b3f23,#3d2213)", borderRadius: "0 10px 10px 0", boxShadow: "inset 0 0 0 6px rgba(0,0,0,.2)" }}>
        {open < 0.5 && <div style={{ position: "absolute", left: 40, right: 40, top: 260, height: 4, background: "rgba(0,0,0,.25)" }} />}</div>
      {line("Can't pull it back up,", w1, 495)}{line("don't put it down.", w2, 595)}
    </div>
    {/* el lápiz */}
    <div style={{ position: "absolute", left: px, top: py - 10 + 6 * Math.sin(tt * 30) * (w1 > 0 && w2 < 1 ? 1 : 0), width: 360, height: 30, transformOrigin: "0% 50%", transform: "rotate(-38deg)", opacity: cl((tt - 1.8) * 3) * (1 - eio(tt, 5.0, 5.6)) }}>
      <div style={{ position: "absolute", left: 0, top: 6, width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "40px solid #e8c79a" }} />
      <div style={{ position: "absolute", left: 40, top: 0, width: 280, height: 30, background: "linear-gradient(180deg,#f4c43a,#c9971a)" }} /><div style={{ position: "absolute", left: 320, top: 0, width: 40, height: 30, background: "#d88a8a", borderRadius: "0 8px 8px 0" }} /></div>
    <Head tt={tt} kick="STAN'S SHIRT POCKET" title="RULE NUMBER ONE" col={AMB} />
  </>;
}}</Stage>;

// ---- 21:06 · LA CASA ENTERA: casa en corte con pileta, bañera e inodoro bajando a un mismo caño; el agua sube en los tres a la vez y el caño grande, tapado contra la calle, late rojo ----
export const HMainLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const house = cl(phys(tt, 0.1, 5, 0.6)), rise = eio(tt, 1.8, 4.4), pulse = cl((tt - 3.4) / 0.6) * (0.6 + 0.4 * Math.sin(tt * 6)), sw = 1 + 0.25 * pulse;
  const fix = (x: number, y: number, kind: number, a: number) => { const s = cl(phys(tt, a, 6, 0.45)); return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={cl(s * 3)}>
    {kind === 0 && <><path d="M -90 -40 L 90 -40 L 70 30 L -70 30 Z" fill="url(#chromeV)" /><rect x={-70} y={30 - 60 * rise} width={140} height={60 * rise} fill="url(#waterV)" opacity={0.8} transform="translate(0 -4)" /></>}
    {kind === 1 && <><rect x={-150} y={-60} width={300} height={100} rx={40} fill="url(#pvcV)" /><rect x={-130} y={30 - 70 * rise} width={260} height={70 * rise} fill="url(#waterV)" opacity={0.8} /></>}
    {kind === 2 && <><rect x={-30} y={-130} width={90} height={110} rx={10} fill="url(#pvcV)" /><ellipse cx={-10} cy={-10} rx={80} ry={36} fill="url(#pvcR)" /><ellipse cx={-10} cy={-14} rx={56} ry={20 * (0.4 + 0.6 * rise)} fill="url(#waterV)" /><path d="M -60 20 Q -10 90 40 20 Z" fill="url(#pvcV)" /></>}
  </g>; };
  return <>
    <Head tt={tt} kick="MORE THAN ONE IS SLOW?" title="IT'S THE MAIN LINE" col={RED} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={house}>
        <rect x={300} y={330} width={1100} height={560} fill="#24211c" /><path d="M 280 330 L 850 170 L 1420 330 Z" fill="#5a3226" /><rect x={300} y={600} width={1100} height={16} fill="url(#woodV)" />
        <rect x={300} y={880} width={1600} height={180} fill="#3b2f22" /><rect x={1400} y={330} width={20} height={560} fill="#ece8de" />
        {/* bajadas de cada artefacto hacia el caño grande */}
        <Tube d="M 520 560 L 520 940" w={40} /><Tube d="M 1100 560 L 1100 940" w={40} /><Tube d="M 760 840 L 760 940" w={40} />
      </g>
      <g opacity={house}><Tube d="M 400 960 L 1820 960" w={90 * sw} col={pulse > 0.1 ? `rgb(241,${Math.round(237 - 120 * pulse)},${Math.round(228 - 150 * pulse)})` : "#f1ede4"} /></g>
      <g opacity={cl(phys(tt, 2.8, 5, 0.6))}><rect x={1660} y={924} width={70} height={72} rx={20} fill="#6e6658" /><Hair x={1695} y={960} s={60} seed={8} /></g>
      {fix(520, 540, 0, 0.6)}{fix(1100, 540, 1, 0.9)}{fix(760, 840, 2, 1.2)}
    </svg>
  </>;
}}</Stage>;

// ---- 21:37 · EL COLADOR DE $2: canasto de malla en perspectiva sobre el desagüe; llueven agua, arroz, borra y pelos: el agua cruza la malla y cae al caño, todo lo demás queda arriba ----
export const HStrainer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = cl(phys(tt, 0.2, 5, 0.5)), pile = eio(tt, 1.4, 5.0);
  return <>
    <Head tt={tt} kick="A $2 STRAINER" title="WATER GOES THROUGH" col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><clipPath id="stC"><path d="M 660 520 Q 960 900 1260 520 Z" /></clipPath></defs>
      {/* boca del desagüe y el caño abajo */}
      <ellipse cx={960} cy={760} rx={150} ry={34} fill="#111" /><rect x={880} y={760} width={160} height={320} fill="#151618" />
      {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 1.1 + i / 14) % 1); return <ellipse key={i} cx={920 + 80 * rn(i)} cy={780 + k * 300} rx={7} ry={12} fill="#bfe8ff" opacity={tt > 1.4 ? 0.9 * (1 - k) : 0} />; })}
      <g transform={`translate(0 ${(1 - s) * -360})`} opacity={cl(s * 3)}>
        {/* el canasto: malla con trama, aro de acero */}
        <path d="M 660 520 Q 960 900 1260 520 Z" fill="url(#chromeV)" opacity={0.35} />
        <g clipPath="url(#stC)">{Array.from({ length: 40 }, (_, i) => <line key={i} x1={660 + i * 16} y1={520} x2={660 + i * 16} y2={900} stroke="#c9ced3" strokeWidth={2} />)}{Array.from({ length: 24 }, (_, i) => <line key={"h" + i} x1={660} x2={1260} y1={520 + i * 16} y2={520 + i * 16} stroke="#c9ced3" strokeWidth={2} />)}
          {/* lo que queda arriba: crece la montaña */}
          <path d={`M 700 ${700 - 60 * pile} Q 960 ${720 - 220 * pile} 1220 ${700 - 60 * pile} L 1220 900 L 700 900 Z`} fill="#6c5a46" opacity={cl(pile * 4)} />
          {Array.from({ length: 30 }, (_, i) => <ellipse key={"r" + i} cx={760 + 400 * rn(i)} cy={760 - 150 * pile * rn(i, 2)} rx={14} ry={6} fill="#f4efe0" opacity={pile > i / 30 ? 1 : 0} transform={`rotate(${rn(i, 3) * 180} ${760 + 400 * rn(i)} ${760 - 150 * pile * rn(i, 2)})`} />)}
          <g opacity={cl((pile - 0.4) * 3)}><Hair x={920} y={640 - 40 * pile} s={140} n={18} seed={3} /></g>
        </g>
        <ellipse cx={960} cy={520} rx={300} ry={58} fill="none" stroke="url(#chromeV)" strokeWidth={22} />
      </g>
      {/* lo que llueve de arriba */}
      {Array.from({ length: 30 }, (_, i) => { const a = 1.2 + i * 0.12, k = tt - a; if (k < 0 || k > 0.55) return null; const x = 760 + 400 * rn(i, 7), y = 180 + k / 0.55 * 420, ty = i % 3;
        return ty === 0 ? <ellipse key={i} cx={x} cy={y} rx={9} ry={14} fill="#bfe8ff" /> : ty === 1 ? <ellipse key={i} cx={x} cy={y} rx={14} ry={6} fill="#f4efe0" /> : <circle key={i} cx={x} cy={y} r={7} fill="#4b3828" />; })}
    </svg>
    <Tag tt={tt} at={4.0} x={1320} y={520} txt="THE REST STAYS" col={AMB} size={50} anchor="l" />
  </>;
}}</Stage>;

// ---- 22:12 · EL ALMANAQUE DE LA COCINA: colgado de un clavo; el lápiz encierra cada domingo; la hoja se arranca, vuela y el mes siguiente se marca igual ----
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2b2722, #0d0c0b 75%)">{(tt) => {
  const cal = phys(tt, 0.1, 5, 0.5), rip = eio(tt, 3.2, 4.2), m = rip > 0.5 ? 1 : 0;
  const Page: React.FC<{ month: string; k0: number; rip?: number }> = ({ month, k0, rip: r = 0 }) => <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#fbf8f0,#ece6d6)", borderRadius: 6,
    transformOrigin: "50% 0%", transform: `rotateX(${-70 * r}deg) rotate(${30 * r}deg) translate(${600 * r}px, ${700 * r * r}px)`, opacity: 1 - r, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
    <div style={{ height: 120, background: "#b8342a", color: "#fff", fontWeight: 900, fontSize: 64, textAlign: "center", lineHeight: "120px", letterSpacing: 6 }}>{month}</div>
    <svg width={700} height={480} style={{ position: "absolute", left: 0, top: 120 }}>
      {Array.from({ length: 35 }, (_, i) => { const c = i % 7, rr = Math.floor(i / 7), x = 30 + c * 92, y = 20 + rr * 90; return <g key={i}><rect x={x} y={y} width={86} height={84} fill="none" stroke="#d6cfbd" strokeWidth={2} />
        <text x={x + 76} y={y + 30} textAnchor="end" fontSize={26} fontWeight={700} fill={c === 0 ? "#b8342a" : "#55504a"}>{i + 1}</text>
        {c === 0 && <circle cx={x + 43} cy={y + 46} r={38} fill="none" stroke="#3b3f9a" strokeWidth={6} pathLength={1} strokeDasharray={`${eio(tt, k0 + rr * 0.45, k0 + rr * 0.45 + 0.4)} 1`} />}</g>; })}
    </svg></div>;
  return <>
    <Head tt={tt} kick="30 SECONDS · ONCE A WEEK" title="EVERY SUNDAY" col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 650, width: 700, height: 600, transform: `translate(-50%,-50%) translateY(${(1 - cal) * -500}px) rotate(${(1 - cal) * 8 + 1.2 * Math.sin(tt * 1.5) * Math.exp(-tt * 0.4)}deg)`, perspective: 1600, opacity: cl(cal * 3) }}>
      <Page month="APRIL" k0={4.4} />
      {m === 0 || rip < 1 ? <Page month="MARCH" k0={0.9} rip={rip} /> : null}
      <div style={{ position: "absolute", left: 340, top: -40, width: 22, height: 22, borderRadius: 11, background: "radial-gradient(circle at 35% 35%,#e6e6e6,#555)" }} />
    </div>
  </>;
}}</Stage>;

// ---- 22:47 · LA NOCHE DE LA ENZIMA: la cocina a oscuras; un chorrito del frasco en la pileta, la luna cruza la ventana, el reloj gira ocho horas y amanece con el caño limpio ----
export const HNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #0f1626, #04060b 75%)">{(tt) => {
  const pour = Math.sin(Math.PI * eio(tt, 0.6, 1.8)), night = eio(tt, 1.6, 5.0), dawn = eio(tt, 4.6, 5.8), hr = 8 * night;
  const sky = `rgb(${Math.round(20 + 210 * dawn)},${Math.round(30 + 150 * dawn)},${Math.round(70 + 90 * dawn)})`;
  return <>
    <Head tt={tt} kick="ONCE A MONTH · AT NIGHT" title="EIGHT HOURS, ALONE" col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* ventana con la luna que cruza */}
      <rect x={640} y={250} width={640} height={340} fill={sky} /><circle cx={700 + 520 * night} cy={420 - 120 * Math.sin(Math.PI * night)} r={40} fill="#f3eed2" opacity={1 - dawn} />
      {dawn > 0 && <circle cx={960} cy={600 - 160 * dawn} r={70} fill="#ffcf7a" opacity={dawn} />}
      <rect x={640} y={250} width={640} height={340} fill="none" stroke="#d9d3c4" strokeWidth={18} /><line x1={960} x2={960} y1={250} y2={590} stroke="#d9d3c4" strokeWidth={12} />
      {/* mesada y pileta */}
      <rect x={300} y={640} width={1320} height={40} fill="url(#woodV)" /><path d="M 760 680 L 1160 680 L 1120 820 L 800 820 Z" fill="url(#chromeV)" opacity={0.7} /><ellipse cx={960} cy={800} rx={40} ry={10} fill="#0a0a0a" />
      {/* el caño abajo: la grasa de las paredes se achica con la noche */}
      <rect x={930} y={820} width={60} height={260} fill="#141518" /><rect x={930} y={820} width={60 * 0.25 * (1 - night)} height={260} fill="url(#greaseH)" /><rect x={990 - 60 * 0.25 * (1 - night)} y={820} width={60 * 0.25 * (1 - night)} height={260} fill="url(#greaseH)" />
      {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.5 + i / 10) % 1); return <circle key={i} cx={940 + 40 * rn(i)} cy={1070 - k * 250} r={4} fill="#9fe3a0" opacity={night > 0.05 && night < 0.98 ? 0.7 * (1 - k) : 0} />; })}
      {/* el frasco que se inclina */}
      <g transform={`translate(1180 560) rotate(${-60 * pour})`} opacity={cl(phys(tt, 0.2, 5, 0.6)) * (1 - eio(tt, 2.2, 2.8))}><rect x={-40} y={-120} width={80} height={120} rx={12} fill="url(#glassH)" stroke="rgba(255,255,255,.7)" strokeWidth={3} /><rect x={-34} y={-70} width={68} height={60} fill="#7fcf86" opacity={0.7} /><rect x={-24} y={-150} width={48} height={32} rx={6} fill="#e9e3d6" /></g>
      {pour > 0.5 && <path d="M 1090 520 Q 1000 600 970 790" stroke="#9fe3a0" strokeWidth={8} fill="none" opacity={0.8} />}
      {/* el reloj de la cocina */}
      <g transform="translate(1500 380)"><circle r={110} fill="#f3efe4" stroke="url(#chromeV)" strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={Math.sin(i * 0.5236) * 84} y1={-Math.cos(i * 0.5236) * 84} x2={Math.sin(i * 0.5236) * 98} y2={-Math.cos(i * 0.5236) * 98} stroke="#333" strokeWidth={5} />)}
        <line x1={0} y1={0} x2={Math.sin((10 + hr) * 0.5236) * 56} y2={-Math.cos((10 + hr) * 0.5236) * 56} stroke="#222" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(hr * 6.283) * 84} y2={-Math.cos(hr * 6.283) * 84} stroke="#222" strokeWidth={6} strokeLinecap="round" /><circle r={8} fill={RED} /></g>
    </svg>
    <Tag tt={tt} at={5.4} x={1500} y={560} txt="CLEAN PIPE" col="#9fe3a0" size={46} />
  </>;
}}</Stage>;

// ---- 23:36 · LA CAJA DE STAN: caja de herramientas roja de chapa; la tapa gira, las bandejas se abren en escalera y suben de a uno los objetos del video, cada uno con su sombra ----
export const HToolbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const box = cl(phys(tt, 0.1, 5, 0.5)), lid = eio(tt, 0.8, 1.6), tray = eio(tt, 1.4, 2.4);
  const items: [number, number, React.ReactNode][] = [
    [520, 380, <g><ellipse rx={90} ry={22} fill="none" stroke="url(#chromeV)" strokeWidth={14} /><path d="M -84 4 Q 0 110 84 4" fill="url(#chromeV)" opacity={0.6} /></g>],
    [780, 300, <g><path d="M -80 40 Q -90 -70 0 -80 Q 90 -70 80 40 Z" fill="url(#chromeV)" /><path d="M 70 -30 L 140 -80 L 146 -66 L 80 -10 Z" fill="url(#chromeH)" /><path d="M -40 -84 Q 0 -130 40 -84" stroke="url(#ironV)" strokeWidth={12} fill="none" /></g>],
    [1060, 270, <g><circle r={80} fill="url(#rubberR)" /><circle r={24} fill="url(#ironR)" /><path d="M 60 40 Q 140 90 190 60" stroke="url(#chromeV)" strokeWidth={10} fill="none" /></g>],
    [1320, 320, <g><rect x={-40} y={-90} width={80} height={130} rx={12} fill="url(#glassH)" stroke="rgba(255,255,255,.6)" strokeWidth={3} /><rect x={-34} y={-40} width={68} height={70} fill="#7fcf86" opacity={0.7} /><rect x={-26} y={-120} width={52} height={34} rx={6} fill="#e9e3d6" /></g>],
    [1560, 400, <g><rect x={-60} y={-100} width={120} height={140} rx={8} fill="url(#ironH)" /><ellipse cy={-100} rx={60} ry={14} fill="#9aa1a7" /><rect x={-60} y={-60} width={120} height={50} fill="#c0392b" /></g>],
  ];
  return <>
    <Head tt={tt} kick="IN CASE YOU SKIPPED AROUND" title="THE SHORT VERSION" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={box} transform={`translate(0 ${(1 - box) * 300})`}>
        <Shadow x={960} y={980} w={900} />
        {/* bandejas en escalera */}
        {[0, 1].map((i) => <g key={i} transform={`translate(${(i ? 1 : -1) * 260 * tray} ${-110 * tray * (i + 1) * 0.6})`}><path d="M 700 690 L 1220 690 L 1200 760 L 720 760 Z" fill="#a82a1f" /><rect x={700} y={680} width={520} height={14} fill="#d8473a" /></g>)}
        <path d="M 640 760 L 1280 760 L 1250 970 L 670 970 Z" fill="#b8342a" /><rect x={640} y={760} width={640} height={24} fill="#d8473a" /><rect x={900} y={820} width={120} height={40} rx={8} fill="url(#chromeV)" />
        <g transform={`rotate(${-110 * lid} 640 760)`}><path d="M 640 700 L 1280 700 L 1280 760 L 640 760 Z" fill="#c0392b" /><rect x={880} y={680} width={160} height={24} rx={10} fill="url(#ironV)" /></g>
      </g>
      {items.map(([x, y, g], i) => { const a = 2.2 + i * 0.55, s = phys(tt, a, 6, 0.42); if (s <= 0.005) return null;
        return <g key={i} transform={`translate(${960 + (x - 960) * s} ${720 + (y - 720) * s}) scale(${0.4 + 0.6 * s})`} opacity={cl(s * 3)}><Shadow x={0} y={120} w={160} o={0.4 * s} />{g}</g>; })}
      {/* la lata de café con la grasa */}
      <g transform={`translate(400 ${640 + (1 - cl(phys(tt, 4.9, 6, 0.42))) * 500})`} opacity={cl(phys(tt, 4.9, 6, 0.42) * 3)}><rect x={-70} y={-110} width={140} height={150} rx={10} fill="url(#ironH)" /><rect x={-70} y={-70} width={140} height={60} fill="#3a5f8a" /><ellipse cy={-110} rx={70} ry={14} fill="url(#greaseR)" /></g>
    </svg>
  </>;
}}</Stage>;

// ---- 24:40 · EL REMOLINO: la pileta de acero vista desde arriba, con el colador puesto; el agua gira en espiral y se va limpia, los pelos quedan enganchados en la malla y la malla brilla ----
export const HSwirl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 70% at 50% 50%, #1b1e21, #07080a 80%)">{(tt) => {
  const sink = cl(phys(tt, 0.1, 5, 0.6)), sw = eio(tt, 0.8, 4.4), glow = Math.exp(-Math.abs(tt - 4.6) * 2) * (tt > 3.6 ? 1 : 0), hair = eio(tt, 1.4, 4.0);
  return <>
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={sink} transform={`translate(960 600) scale(${0.9 + 0.1 * sink}) rotate(${-4 + 4 * sink})`}>
        {/* la pileta de acero cepillado */}
        <rect x={-560} y={-360} width={1120} height={720} rx={90} fill="url(#chromeV)" />
        <rect x={-520} y={-320} width={1040} height={640} rx={70} fill="url(#chromeR)" />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={-520} x2={520} y1={-300 + i * 21} y2={-300 + i * 21} stroke="rgba(255,255,255,.06)" strokeWidth={2} />)}
        {/* el agua en espiral hacia el centro */}
        {Array.from({ length: 70 }, (_, i) => { const ph = (rn(i) + tt * 0.35) % 1, r = 460 * (1 - ph) * (1 - 0.5 * sw) + 40, a = rn(i, 2) * 6.283 + ph * 9 + tt * 1.6;
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.62} r={6 + 6 * (1 - ph)} fill="#cfefff" opacity={(1 - sw * 0.8) * 0.8 * ph} />; })}
        <path d={Array.from({ length: 60 }, (_, i) => { const k = i / 59, a = k * 12 + tt * 2.2, r = 380 * (1 - k) + 60; return `${i ? "L" : "M"} ${Math.cos(a) * r} ${Math.sin(a) * r * 0.62}`; }).join(" ")} stroke="rgba(200,236,255,.45)" strokeWidth={8} fill="none" opacity={1 - sw * 0.7} />
        {/* el colador en el desagüe */}
        <circle r={120} fill="#0b0c0e" /><circle r={110} fill="url(#chromeR)" />
        {Array.from({ length: 36 }, (_, i) => { const a = i * 0.1745; return <circle key={i} cx={Math.cos(a) * 70} cy={Math.sin(a) * 70} r={7} fill="#0b0c0e" />; })}
        {Array.from({ length: 12 }, (_, i) => { const a = i * 0.5236; return <circle key={"in" + i} cx={Math.cos(a) * 36} cy={Math.sin(a) * 36} r={6} fill="#0b0c0e" />; })}
        <g opacity={hair}><Hair x={-30} y={-10} s={110} n={16} seed={11} w={4} /></g>
        <circle r={128} fill="none" stroke={AMB} strokeWidth={10} opacity={glow} />
      </g>
    </svg>
    <Head tt={tt} kick="IF YOU DO ONE THING" title="THE ONE THAT SAVES YOU" col={AMB} />
  </>;
}}</Stage>;
