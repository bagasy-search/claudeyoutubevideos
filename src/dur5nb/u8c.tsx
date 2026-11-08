// dur5nb — componentes únicos 26-37 (tramos 3, 2 y 1, Kolimá, la suma y el cierre).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu, Meter } from "./pkit";

type UP = { d: number; p: any };
const Big: React.FC<{ x: number; y: number; v: string; c?: string; size?: number; o?: number; label?: string; w?: number }> = ({ x, y, v, c = INK, size = 110, o = 1, label, w = 700 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: F, fontWeight: 900, opacity: o, color: c, fontVariantNumeric: "tabular-nums" }}>
    {label && <div style={{ fontSize: 26, letterSpacing: 4, color: "rgba(240,235,229,.8)", marginBottom: 6 }}>{label}</div>}
    <div style={{ fontSize: size, lineHeight: 1, textShadow: "0 6px 26px rgba(0,0,0,.7)" }}>{v}</div>
  </div>
);
const Stamp: React.FC<{ a: number; t: string; x: number; y: number; c?: string; size?: number; rot?: number }> = ({ a, t, x, y, c = RED, size = 60, rot = -9 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.5 + 0.5 * sp(f, a, 0.8, 9)})`, opacity: ez(f, a, a + 5), padding: "10px 28px", border: `7px solid ${c}`, borderRadius: 12, fontFamily: F, fontWeight: 900, fontSize: size, color: c, whiteSpace: "nowrap" }}>{t}</div>;
};

// 26 · EL POZO DE MPONENG: la jaula baja casi 4 km; el termómetro de la roca sube a 60 °C, el hielo baja por tubos; el estallido sacude todo
export const PozoMponeng: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const dn = ez(f, 10, d * 0.35), km = 3.9 * dn, temp = Math.round(20 + 40 * dn), burst = at(p, "estallido", d * 0.7), sh = f > burst && f < burst + 20 ? Math.sin(f * 2.3) * 16 : 0;
  const hrs = Math.min(6, Math.floor(lin(f, d * 0.35, d) * 6));
  return (
    <Scene d={d} bg={p.bg} floor="255,140,80" tint="#0e0806">
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sh}px,${sh * 0.4}px)` }}>
        <SV>
          <rect x={0} y={0} width={1920} height={1080} fill={`rgb(${40 + 50 * dn},${24 + 10 * dn},${16})`} />
          <rect x={860} y={0} width={200} height={1080} fill="#120a06" />
          {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={860} x2={1060} y1={((i * 80 - dn * 3000) % 1280 + 1280) % 1280 - 100} y2={((i * 80 - dn * 3000) % 1280 + 1280) % 1280 - 100} stroke="#3a2a1a" strokeWidth={6} />)}
          <rect x={880} y={480} width={160} height={200} rx={8} fill="none" stroke="#9aa3ad" strokeWidth={8} /><line x1={960} y1={0} x2={960} y2={480} stroke="#9aa3ad" strokeWidth={4} />
          {Array.from({ length: 18 }).map((_, i) => { const ph = ((f / 40) + rnd(i)) % 1; return <rect key={i} x={1120 + (i % 3) * 30} y={ph * 1080} width={18} height={18} fill="#cfe6ff" opacity={0.8} transform={`rotate(45 ${1129 + (i % 3) * 30} ${ph * 1080 + 9})`} />; })}
          <rect x={1110} y={0} width={110} height={1080} fill="rgba(200,230,255,.08)" />
          {f > burst && Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${300 + i * 60},${200 + i * 70} l${80 * rnd(i)},${60} l${-40},${50} l${90},${40}`} stroke="#000" strokeWidth={5} fill="none" opacity={ez(f, burst, burst + 6)} />)}
        </SV>
        <Tu x={960} y={670} s={0.6} />
      </div>
      <Big x={360} y={140} v={`${km.toFixed(1).replace(".", ",")} km`} label="PROFUNDIDAD" size={110} w={560} />
      <Meter x={1400} y={140} w={420} h={22} k={dn} col={RED} label="ROCA" val={`${temp} °C`} size={90} />
      <Tag a={at(p, "hielo", 60)} t="le bombean hielo" x={1500} y={460} size={40} color="#cfe6ff" w={500} />
      <Stamp a={burst} t="ESTALLIDO DE ROCA" x={420} y={600} size={54} />
      <Big x={360} y={820} v={`${hrs} h`} label="HASTA QUE SUBA LA JAULA" size={80} c={ORA} o={ez(f, d * 0.35, d * 0.35 + 10)} w={560} />
    </Scene>
  );
};

// 27 · DENTRO DE TU BATERÍA: una batería de teléfono; el zoom entra por el borne y adentro hay un túnel cavado a mano
export const BateriaCobalto: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const z = ez(f, at(p, "bateria", 20), at(p, "bateria", 20) + 70), s = 1 + z * 7;
  return (
    <Scene d={d} bg={p.bg} floor="140,170,255" tint="#07080e">
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "960px 300px", opacity: 1 - ez(f, at(p, "bateria", 20) + 50, at(p, "bateria", 20) + 70) }}>
        <SV>
          <rect x={660} y={300} width={600} height={560} rx={40} fill="#20242c" stroke="#5a6070" strokeWidth={10} /><rect x={900} y={270} width={120} height={40} rx={8} fill="#5a6070" />
          <rect x={700} y={340} width={520} height={480} rx={26} fill="#2a3040" /><text x={960} y={600} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={80} fill="#6a90ff">Li-ion</text>
          <text x={960} y={690} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#9ab0ff">Co</text>
        </SV>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: ez(f, at(p, "bateria", 20) + 50, at(p, "bateria", 20) + 80) }}>
        <SV>
          <rect x={0} y={0} width={1920} height={1080} fill="#2a1a10" />
          <path d="M760,1080 Q760,560 960,420 Q1160,560 1160,1080 Z" fill="#0a0604" />
          {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={700 + rnd(i) * 520} cy={500 + rnd(i, 2) * 580} r={5 + rnd(i, 3) * 8} fill="#3a6aa8" opacity={0.6} />)}
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${740 + i * 80},${1080 - i * 40} l20,-30`} stroke="#5a3a22" strokeWidth={6} />)}
        </SV>
        <Tu x={960} y={1040} s={1.1} rot={Math.sin(f / 6) * 6} arms="up" />
      </AbsoluteFill>
      <Tag a={at(p, "bateria", 20)} t="está en tu batería" x={960} y={120} size={58} color="#9ab0ff" w={1000} />
      <Tag a={at(p, "mano", d * 0.7)} t="cavado a mano" x={960} y={220} size={50} color={ORA} w={800} />
      <Tag a={at(p, "congo", 5)} t="CONGO · HOY" x={300} y={900} size={40} color={GOLD} w={400} />
    </Scene>
  );
};

// 28 · EL POLVO BLANCO: tu silueta se va cubriendo de polvo de sílice; los ingenieros de visita llevan mascarilla
export const PolvoBlanco: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = ez(f, 10, d * 0.6), eng = ez(f, at(p, "ingenieros", d * 0.35), at(p, "ingenieros", d * 0.35) + 30), mo = Math.min(2, 1 + Math.floor(lin(f, d * 0.6, d) * 2));
  return (
    <Scene d={d} bg={p.bg} floor="235,235,230" tint="#0e0e0e">
      <AbsoluteFill style={{ background: `rgba(220,220,214,${0.12 + 0.2 * k})` }} />
      <SV>
        <path d="M0,0 L1920,0 L1920,200 Q960,120 0,200 Z" fill="#3a3a38" /><path d="M0,1080 L1920,1080 L1920,860 Q960,920 0,860 Z" fill="#4a4a46" />
        {Array.from({ length: 140 }).map((_, i) => { const ph = ((f / (80 + rnd(i) * 80)) + rnd(i, 2)) % 1; return <circle key={i} cx={rnd(i, 3) * 1920 + Math.sin(f / 30 + i) * 30} cy={ph * 1080} r={2 + rnd(i, 4) * 4} fill="#f0f0ea" opacity={0.5 * k} />; })}
      </SV>
      <div style={{ position: "absolute", inset: 0, filter: `brightness(${1 + 1.6 * k}) grayscale(${k})` }}><Tu x={760} y={900} s={1.7} /></div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", inset: 0, opacity: eng }}><Tu x={1400 + i * 220} y={900} s={1.25} dark />
        <SV><rect x={1400 + i * 220 - 22} y={900 - 1.25 * 205} width={44} height={26} rx={10} fill="#f0f0ea" /></SV></div>)}
      <Tag a={at(p, "ingenieros", d * 0.35)} t="ellos sí llevan mascarilla" x={1510} y={300} size={44} color={GOLD} w={700} />
      <Tag a={at(p, "fantasma", 60)} t="como un fantasma" x={760} y={230} size={48} w={700} />
      <Big x={760} y={60} v={`MES ${mo}`} size={60} c={ORA} o={ez(f, d * 0.6, d * 0.6 + 8)} w={400} />
      <Tag a={5} t="SÍLICE" x={300} y={920} size={50} color="#f0f0ea" w={400} />
    </Scene>
  );
};

// 29 · TRES METROS: vista desde arriba del camino de las Yungas; el camión casi llena la pista; al costado, el abismo
export const YungasAncho: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const y = 1200 - lin(f, 0, d) * 1500, wob = Math.sin(f / 9) * 6, dim = ez(f, at(p, "ancho", 20), at(p, "ancho", 20) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="120,200,140" tint="#08100a">
      <SV>
        <rect x={0} y={0} width={760} height={1080} fill="#1e3a22" />
        {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(i) * 740} cy={((rnd(i, 2) * 1080 + f * 2) % 1180) - 50} r={30 + rnd(i, 3) * 40} fill="#2a5030" />)}
        <rect x={760} y={0} width={400} height={1080} fill="#8a7454" />
        <rect x={1160} y={0} width={760} height={1080} fill="#050806" /><rect x={1160} y={0} width={40} height={1080} fill="#3a2e20" />
        {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={1500 + rnd(i) * 300} cy={((i * 140 + f * 1.5) % 1200) - 60} rx={180} ry={40} fill="rgba(220,230,220,.12)" />)}
        <g transform={`translate(${800 + wob},${y})`}><rect x={0} y={0} width={330} height={560} rx={16} fill="#c9a23a" /><rect x={20} y={20} width={290} height={150} rx={10} fill="#3a3a3a" /><rect x={0} y={190} width={330} height={370} fill="#7a5a2a" /></g>
        <g opacity={dim}><line x1={770} y1={140} x2={1150} y2={140} stroke={INK} strokeWidth={5} /><path d="M770,140 l20,-12 v24 Z M1150,140 l-20,-12 v24 Z" fill={INK} /></g>
      </SV>
      <Big x={960} y={40} v="3 m" size={80} o={dim} w={400} />
      <Tag a={at(p, "abismo", 40)} t="cientos de metros" x={1540} y={520} size={46} color={RED} w={700} />
      <Tag a={at(p, "muerte", d * 0.7)} t="LA CARRETERA DE LA MUERTE" x={380} y={900} size={40} color={GOLD} w={700} />
    </Scene>
  );
};

// 30 · LAS MANOS DE DALLY: el tubo de rayos X brilla sobre una mano; los huesos aparecen; un contador de pruebas sube; Edison se aparta
export const ManosRayosX: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const on = (f % 40) < 26 ? 1 : 0.3, tests = Math.floor(f / 6), stop = ez(f, at(p, "edison", d * 0.7), at(p, "edison", d * 0.7) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="140,200,255" tint="#04070c">
      <SV>
        <g transform="translate(960,200)"><ellipse cx={0} cy={0} rx={220} ry={90} fill={`rgba(140,220,255,${0.18 * on})`} /><ellipse cx={0} cy={0} rx={150} ry={56} fill="none" stroke="#bfe8ff" strokeWidth={6} /><line x1={-260} y1={0} x2={260} y2={0} stroke="#9aa3ad" strokeWidth={6} /></g>
        <path d="M960,280 L760,780 L1160,780 Z" fill={`rgba(140,220,255,${0.08 * on})`} />
        <g transform="translate(960,700)">
          <path d="M-150,200 L-160,-10 Q-170,-60 -140,-70 Q-110,-70 -110,-20 L-100,-140 Q-96,-180 -66,-176 Q-40,-170 -42,-130 L-40,-190 Q-36,-230 -6,-228 Q24,-224 22,-184 L24,-170 Q30,-206 58,-202 Q86,-196 82,-156 L86,-120 Q96,-150 120,-144 Q146,-136 138,-96 L120,60 Q110,170 90,200 Z" fill={`rgba(242,196,155,${1 - 0.6 * on})`} stroke="#bfe8ff" strokeWidth={3} />
          {[[-136, -40, -125, 160], [-80, -160, -70, 160], [-6, -210, 0, 160], [60, -180, 60, 160], [116, -120, 80, 160]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8f6ff" strokeWidth={10} strokeLinecap="round" opacity={on} />)}
        </g>
      </SV>
      <Big x={300} y={180} v={String(tests)} label="PRUEBAS EN SUS MANOS" size={110} c="#bfe8ff" w={500} />
      <Tag a={at(p, "dally", 5)} t="CLARENCE DALLY" x={1560} y={160} size={46} color={GOLD} w={600} />
      <Stamp a={at(p, "edison", d * 0.7)} t="EDISON SE DETIENE" x={1560} y={560} size={46} c={ORA} />
      <div style={{ position: "absolute", left: 1460, top: 700, width: 200, opacity: stop }}><Tu x={100} y={320} s={1} flip /></div>
    </Scene>
  );
};

// 31 · EL DESTORNILLADOR: dos medias esferas separadas por la punta de un destornillador; la rendija tiembla; resbala y hay un destello azul
export const Destornillador: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const slip = at(p, "resbalo", d * 0.55), closed = ez(f, slip, slip + 4), flash = f > slip ? Math.max(0, 1 - (f - slip) / 24) : 0;
  const gap = (1 - closed) * (34 + Math.sin(f / 4) * 6), days = Math.min(9, Math.floor(lin(f, at(p, "nueve", d * 0.8), d) * 9) + (f > at(p, "nueve", d * 0.8) ? 1 : 0));
  return (
    <Scene d={d} bg={p.bg} floor="120,170,255" tint="#05070d">
      <AbsoluteFill style={{ background: `rgba(120,170,255,${0.7 * flash})` }} />
      <SV>
        <rect x={500} y={760} width={920} height={40} fill="#3a3a3a" />
        <g transform={`translate(960,${560 - gap / 2})`}><path d="M-200,0 A200,200 0 0 1 200,0 Z" fill="#9aa3ad" stroke="#cfd6de" strokeWidth={6} /></g>
        <g transform={`translate(960,${560 + gap / 2})`}><path d="M-200,0 A200,200 0 0 0 200,0 Z" fill="#7a828c" stroke="#cfd6de" strokeWidth={6} /></g>
        <g transform={`translate(${1160 + closed * 160},${560 + closed * 60}) rotate(${-8 + closed * 30})`} opacity={1 - closed * 0.3}><rect x={0} y={-6} width={260} height={12} fill="#cfd6de" /><rect x={260} y={-22} width={200} height={44} rx={16} fill="#c9a23a" /></g>
      </SV>
      <Tag a={at(p, "slotin", 5)} t="LOUIS SLOTIN · 1946" x={960} y={110} size={50} color={GOLD} w={900} />
      <Tag a={at(p, "plutonio", 40)} t="plutonio" x={960} y={830} size={44} w={500} />
      <Big x={1640} y={300} v={`DÍA ${Math.max(1, days)}`} label="DESPUÉS" size={90} c={RED} o={ez(f, at(p, "nueve", d * 0.8), at(p, "nueve", d * 0.8) + 8)} w={460} />
    </Scene>
  );
};

// 32 · MÁS DE LA MITAD: 400 puntos (uno cada cien hombres de submarino); más de la mitad se apagan bajo una línea de agua
export const MitadUboat: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const g = ez(f, at(p, "mitad", d * 0.5), at(p, "mitad", d * 0.5) + 60);
  return (
    <Scene d={d} bg={p.bg} floor="100,150,190" tint="#050a10">
      <AbsoluteFill style={{ background: "linear-gradient(#0a1a28, #02060a)" }} />
      <SV>
        {Array.from({ length: 400 }).map((_, i) => { const x = 360 + (i % 40) * 30, y = 260 + Math.floor(i / 40) * 52, gone = i < 300 && i / 300 < g * 1.0 && i < 216 + 84 * 0;
          const dead = (i % 10) * 40 + Math.floor(i / 40) < 400 * 0.75 * g && (i * 7) % 400 < 300;
          return <circle key={i} cx={x} cy={y + Math.sin(f / 20 + i) * 2} r={9} fill={dead ? "#1a2a3a" : "#cfe2f2"} opacity={ez(f, 2 + i * 0.05, 8 + i * 0.05)} />; })}
        <path d={`M0,200 Q480,${190 + Math.sin(f / 15) * 8} 960,200 T1920,200`} stroke="#4a7aa0" strokeWidth={4} fill="none" />
      </SV>
      <Big x={960} y={60} v="40 000" label="TRIPULANTES DE SUBMARINO" size={90} w={900} />
      <Tag a={at(p, "mitad", d * 0.5)} t="más de la mitad no volvió" x={960} y={850} size={56} color={RED} w={1200} />
      <div style={{ position: "absolute", left: 1640, top: 980, fontFamily: F, fontWeight: 800, fontSize: 22, color: "rgba(240,235,229,.6)" }}>1 punto = 100 hombres</div>
    </Scene>
  );
};

// 33 · LA CARRETA DE MARSELLA: empujas una carreta tapada con lona; un jinete señala el camino; el trapo con vinagre; la «libertad» se aleja
export const CarretaMarsella: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const x = 300 + lin(f, 0, d) * 900, lib = ez(f, at(p, "puerta", d * 0.7), at(p, "puerta", d * 0.7) + 60), day = f > at(p, "congela", d * 0.85) ? 2 : 1;
  return (
    <Scene d={d} bg={p.bg} floor="230,190,140" tint="#120c08">
      <SV>
        <rect x={0} y={0} width={1920} height={760} fill="#2a2018" />
        {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={i * 230 - 40} y={260 + (i % 3) * 30} width={200} height={500} fill={`hsl(30,${18 + i % 3 * 4}%,${16 + i % 2 * 4}%)`} />{[0, 1].map((j) => <rect key={j} x={i * 230 + j * 80} y={360 + (i % 3) * 30} width={40} height={60} fill="#0a0806" />)}</g>)}
        <path d="M0,760 L1920,760 L1920,1080 L0,1080 Z" fill="#4a3a2a" />
        {Array.from({ length: 20 }).map((_, i) => <ellipse key={i} cx={i * 100 + (i % 2) * 40} cy={800 + (i % 3) * 80} rx={36} ry={12} fill="#3a2c1e" />)}
        <g transform={`translate(${x},880)`}><rect x={0} y={-130} width={340} height={110} rx={10} fill="#5a3a22" /><path d="M0,-130 Q170,-220 340,-130 Z" fill="#8a7a62" /><circle cx={60} cy={-10} r={44} fill="none" stroke="#2a1a10" strokeWidth={10} /><circle cx={280} cy={-10} r={44} fill="none" stroke="#2a1a10" strokeWidth={10} /></g>
        <g transform={`translate(${x + 620},880)`}><ellipse cx={0} cy={-150} rx={110} ry={50} fill="#1a120d" /><rect x={-90} y={-130} width={14} height={130} fill="#1a120d" /><rect x={70} y={-130} width={14} height={130} fill="#1a120d" /><path d="M90,-180 L150,-260 L170,-240 L110,-160 Z" fill="#1a120d" />
          <circle cx={0} cy={-260} r={22} fill="#1a120d" /><rect x={-20} y={-240} width={40} height={70} rx={10} fill="#1a120d" /><line x1={20} y1={-220} x2={140} y2={-280} stroke="#1a120d" strokeWidth={10} /></g>
      </SV>
      <Tu x={x - 90} y={880} s={1.0} rot={14} walk />
      <SV><rect x={x - 120} y={880 - 210} width={60} height={22} rx={8} fill="#d9cdb0" /></SV>
      <div style={{ position: "absolute", left: 1500, top: 120, padding: "14px 30px", background: "#efe6cf", color: "#3a2a1a", fontFamily: F, fontWeight: 900, fontSize: 46, transform: `translate(${-lib * 260}px,${-lib * 40}px) scale(${1 - 0.5 * lib}) rotate(${-4 + lib * 12}deg)`, opacity: 1 - 0.8 * lib }}>LIBERTAD</div>
      <Tag a={at(p, "roze", 40)} t="el caballero Roze" x={Math.min(x + 620, 1600)} y={540} size={36} color={GOLD} w={500} />
      <Tag a={at(p, "vinagre", 90)} t="un trapo con vinagre" x={420} y={140} size={40} w={600} />
      <Big x={420} y={260} v={`DÍA ${day}`} size={70} c={RED} o={ez(f, at(p, "congela", d * 0.85), at(p, "congela", d * 0.85) + 8)} w={400} />
    </Scene>
  );
};

// 34 · LA ESPIRAL DE LA RACIÓN: «cavas menos → comes menos» da vueltas y se cierra hacia el centro; el cuenco se achica en cada vuelta
export const RacionEspiral: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const t = lin(f, 10, d), turns = 3.2, pts = Array.from({ length: 220 }).map((_, i) => { const u = i / 219, a = u * turns * Math.PI * 2, r = 420 * (1 - u * 0.9); return [960 + Math.cos(a) * r, 540 + Math.sin(a) * r * 0.82]; });
  const shown = Math.floor(t * 220), [hx, hy] = pts[Math.min(219, Math.max(0, shown - 1))];
  const bowl = 1 - 0.85 * t;
  return (
    <Scene d={d} bg={p.bg} floor="200,210,230" tint="#090b10">
      <SV>
        <path d={`M${pts.slice(0, Math.max(2, shown)).map(([x, y]) => `${x},${y}`).join(" L")}`} stroke={GOLD} strokeWidth={8} fill="none" strokeLinecap="round" />
        <text x={1440} y={420} textAnchor="start" fontFamily={F} fontWeight={900} fontSize={44} fill={INK} opacity={ez(f, d * 0.15, d * 0.15 + 8)}>CAVAS MENOS</text>
        <text x={480} y={680} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={44} fill={RED} opacity={ez(f, d * 0.3, d * 0.3 + 8)}>COMES MENOS</text>
        <path d="M1500,450 Q1560,560 1420,640" stroke={INK} strokeWidth={5} fill="none" opacity={ez(f, d * 0.3, d * 0.3 + 8)} />
        <path d="M420,650 Q360,520 500,440" stroke={RED} strokeWidth={5} fill="none" opacity={ez(f, d * 0.45, d * 0.45 + 8)} />
        <g transform={`translate(${hx},${hy}) scale(${bowl})`}><path d="M-60,0 Q0,60 60,0 Z" fill="#9aa3ad" /><ellipse cx={0} cy={0} rx={60} ry={14} fill="#c9b48e" /></g>
      </SV>
      <Tag a={at(p, "racion", 5)} t="la ración depende de lo que cavas" x={960} y={110} size={46} color={GOLD} w={1300} />
      <Tag a={at(p, "sola", d * 0.8)} t="la cuenta se hace sola" x={960} y={960} size={52} color={RED} w={1000} />
    </Scene>
  );
};

// 35 · VEINTE DÍAS: un calendario de 20 casillas se llena; la barra «sano» baja a «despojo»; el termómetro marca −50; sello «por diseño»
export const VeinteDias: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const n = Math.min(20, Math.floor(lin(f, 10, d * 0.6) * 20)), h = 1 - n / 20;
  return (
    <Scene d={d} bg={p.bg} floor="200,220,255" tint="#06080c">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 220 + (i % 5) * 170, top: 220 + Math.floor(i / 5) * 160, width: 150, height: 140, borderRadius: 12, border: "4px solid rgba(240,235,229,.3)",
          background: i < n ? `rgba(241,69,54,${0.25 + 0.5 * (i / 19)})` : "rgba(240,235,229,.05)", fontFamily: F, fontWeight: 900, fontSize: 52, color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
      ))}
      <div style={{ position: "absolute", left: 1220, top: 220, width: 80, height: 620, borderRadius: 40, background: "rgba(240,235,229,.12)", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${h * 100}%`, background: h > 0.5 ? "#7ad66a" : h > 0.2 ? ORA : RED }} /></div>
      <div style={{ position: "absolute", left: 1320, top: 200, fontFamily: F, fontWeight: 900, fontSize: 34, color: "#7ad66a" }}>SANO</div>
      <div style={{ position: "absolute", left: 1320, top: 800, fontFamily: F, fontWeight: 900, fontSize: 34, color: RED }}>DESPOJO</div>
      <Big x={1640} y={480} v="−50 °C" size={84} c="#cfe6ff" w={460} />
      <Stamp a={at(p, "diseno", d * 0.7)} t="POR DISEÑO" x={720} y={900} size={70} />
      <Tag a={at(p, "shalamov", 5)} t="VARLAM SHALÁMOV · KOLIMÁ" x={960} y={110} size={44} color={GOLD} w={1200} />
    </Scene>
  );
};

// 36 · LA SUMA: las once paradas como barras ordenadas por tiempo; las más largas se marcan «no sabías»; total ≈ 8 meses
export const SumaTotal: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R: [string, number, string, boolean][] = [["Pintora de radio", 172800, "4 meses", true], ["Hawks Nest", 86400, "2 meses", true], ["Canaria", 30240, "3 semanas", true], ["Kolimá", 28800, "20 días", false],
    ["Franklin", 15840, "11 días", false], ["Radio clandestina", 12960, "9 días", false], ["Marsella", 2880, "2 días", false], ["Mponeng", 360, "6 horas", false], ["Golden Gate", 130, "2 h 10", false], ["Laurión", 18, "18 min", false], ["Catador", 4.3, "4 min 20", false]];
  const mk = at(p, "fijas", d * 0.5), mx = Math.log10(172800);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#0b0908" push={0.02}>
      {R.map(([n, m, v, inv], i) => { const k = ez(f, 6 + i * 5, 30 + i * 5) * (Math.log10(m + 1) / mx), hl = inv ? ez(f, mk, mk + 12) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 140, top: 150 + i * 68, width: 1500, height: 56, fontFamily: F, fontWeight: 900, display: "flex", alignItems: "center" }}>
            <div style={{ width: 340, fontSize: 28, color: INK, textAlign: "right", paddingRight: 18 }}>{n}</div>
            <div style={{ height: 44, width: `${k * 860}px`, background: hl ? `rgba(184,255,154,${0.5 + 0.5 * hl})` : ORA, borderRadius: 8, boxShadow: hl ? `0 0 ${24 * hl}px #9aff7a` : "none" }} />
            <div style={{ paddingLeft: 14, fontSize: 28, whiteSpace: "nowrap", color: hl ? "#b8ff9a" : INK }}>{v}{inv && hl > 0.5 ? "  · no sabías" : ""}</div>
          </div>
        );
      })}
      <Big x={1640} y={880} v="≈ 8 MESES" label="EN TOTAL" size={84} c={GOLD} o={ez(f, at(p, "total", d * 0.3), at(p, "total", d * 0.3) + 8)} w={560} />
    </Scene>
  );
};

// 37 · EL PRÓXIMO VIAJE: un perro (sano, tranquilo) camina hacia una pared de cueva con pinturas; un signo de pregunta lo espera
export const PerroCueva: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const x = 200 + ez(f, 0, d * 0.8) * 700, step = Math.sin(f / 4) * 10, tail = Math.sin(f / 3) * 20;
  return (
    <Scene d={d} bg={p.bg} floor="230,170,110" tint="#120a06">
      <SV>
        <path d="M1000,0 L1920,0 L1920,1080 L1000,1080 Q900,700 1000,400 Q940,200 1000,0 Z" fill="#6a4a2a" />
        {[[1250, 300, 1], [1500, 420, 0.8], [1340, 620, 1.1]].map(([cx, cy, s], i) => <g key={i} transform={`translate(${cx},${cy}) scale(${s})`} opacity={0.75}><ellipse cx={0} cy={0} rx={90} ry={40} fill="#a8401a" /><rect x={-60} y={30} width={10} height={50} fill="#a8401a" /><rect x={50} y={30} width={10} height={50} fill="#a8401a" /><path d="M80,-10 L130,-60 L140,-30 Z" fill="#a8401a" /></g>)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${1700 + i * 26},${800 - i * 14} l14,40`} stroke="#d9cdb0" strokeWidth={6} />)}
        <path d="M0,880 L1920,880 L1920,1080 L0,1080 Z" fill="#3a2a1a" />
        <g transform={`translate(${x},860)`}>
          <ellipse cx={0} cy={-80} rx={110} ry={46} fill="#c98a4a" /><circle cx={112} cy={-126} r={38} fill="#c98a4a" /><path d="M140,-116 L190,-104 L144,-94 Z" fill="#c98a4a" /><path d="M96,-158 L110,-196 L128,-156 Z" fill="#8a5a2a" />
          <circle cx={124} cy={-134} r={5} fill="#1a120d" />
          {[-70, -40, 50, 80].map((lx, i) => <rect key={i} x={lx + (i % 2 ? step : -step) * 0.6} y={-50} width={16} height={56} rx={6} fill="#a8703a" />)}
          <path d={`M-104,-90 Q-150,${-130 + tail} -170,${-150 + tail}`} stroke="#a8703a" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      </SV>
      <Big x={1440} y={140} v="?" size={220} c={GOLD} o={ez(f, d * 0.4, d * 0.4 + 10)} w={300} />
      <Tag a={at(p, "perro", 5)} t="PRÓXIMO: TU PERRO EN LA PREHISTORIA" x={700} y={100} size={46} color={GOLD} w={1300} />
    </Scene>
  );
};

// 38 · LA BRECHA: muro con la brecha, los voluntarios entran primero, el ascenso prometido se tacha; la bandera brilla en el humo; la multitud del verdugo rodea
export const BrechaMuralla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aN = at(p, "nadie", d * 0.3), aB = at(p, "abanderado", d * 0.45), aV = at(p, "verdugo", d * 0.7), aM = at(p, "multitud", d * 0.8);
  const run = ez(f, 8, aN), fl = ez(f, aB, aB + 14), crowd = ez(f, aM, aM + 30), dust = Math.sin(f / 5) * 4;
  const men = 7, alive = (i: number) => f < aN || i < 1;
  return (
    <Scene d={d} bg={p.bg} floor="210,170,120" tint="#0f0a07">
      <SV>
        <path d="M0,300 L760,300 L820,420 L780,520 L900,560 L860,700 L0,700 Z" fill="#5a4a38" stroke="#2a2018" strokeWidth={6} />
        <path d="M1920,300 L1180,300 L1110,430 L1170,520 L1050,580 L1090,700 L1920,700 Z" fill="#5a4a38" stroke="#2a2018" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={0} x2={1920} y1={340 + i * 40} y2={340 + i * 40} stroke="#3a2e22" strokeWidth={3} opacity={0.5} />)}
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={980 + Math.sin(i * 1.7 + f / 30) * 120} cy={520 - ((f * 1.2 + i * 40) % 300)} r={30 + 20 * rnd(i)} fill="#8a7a66" opacity={0.18} />)}
        <path d="M0,700 L1920,700 L1920,1080 L0,1080 Z" fill="#2a2018" />
        {Array.from({ length: men }).map((_, i) => { const t = Math.max(0, run - i * 0.08); const x = 160 + t * 760 + i * 30, y = 900 - t * 260 + dust; const ok = alive(i);
          return <g key={i} opacity={ok ? 1 : Math.max(0.15, 1 - ez(f, aN + i * 3, aN + i * 3 + 10))} transform={`translate(${x},${y})`}><circle cx={0} cy={-70} r={16} fill="#d9cdb0" /><rect x={-12} y={-54} width={24} height={50} rx={6} fill="#9a3020" /><line x1={-8} y1={-4} x2={-16} y2={36} stroke="#d9cdb0" strokeWidth={8} /><line x1={8} y1={-4} x2={16} y2={36} stroke="#d9cdb0" strokeWidth={8} /><line x1={12} y1={-44} x2={44} y2={-84} stroke="#bbb" strokeWidth={5} /></g>; })}
        {fl > 0 && <g transform={`translate(1500,${760 - 40 * fl})`} opacity={fl}><line x1={0} y1={0} x2={0} y2={-300} stroke="#d9cdb0" strokeWidth={10} /><path d={`M0,-300 Q90,${-290 + Math.sin(f / 4) * 20} 180,-300 L180,-200 Q90,${-190 + Math.sin(f / 4 + 1) * 20} 0,-200 Z`} fill={GOLD} />
          {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={-600 + k * 60} y1={-150 + k * 30} x2={-20} y2={-240} stroke={RED} strokeWidth={3} opacity={0.6 * ez(f, aB + 10 + k * 4, aB + 14 + k * 4)} strokeDasharray="14 10" />)}</g>}
        {crowd > 0 && Array.from({ length: 34 }).map((_, i) => { const a = (i / 34) * Math.PI * 2, r = 520 - 240 * crowd; return <circle key={i} cx={960 + Math.cos(a) * r * 1.6} cy={860 + Math.sin(a) * r * 0.35} r={22} fill="#1a120d" opacity={crowd} />; })}
      </SV>
      <Big x={420} y={110} v="ASCENSO" size={96} label="SI SOBREVIVÍAS" w={700} o={ez(f, 10, 24) * (1 - 0.6 * ez(f, aN, aN + 8))} />
      {f > aN && <Stamp a={aN} t="CASI NADIE LO COBRÓ" x={420} y={260} size={50} />}
      <Tag a={aB} t="N.º 62 · ABANDERADO" x={1500} y={110} size={44} color={GOLD} w={700} />
      <Tag a={aV} t="N.º 61 · VERDUGO — EL PELIGRO ERA LA MULTITUD" x={960} y={1000} size={42} color={RED} w={1500} />
    </Scene>
  );
};
