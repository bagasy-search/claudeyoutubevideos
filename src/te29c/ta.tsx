// te29c · CONGO · 27 componentes únicos (uno por minuto). Cada uno es un OBJETO con volumen y material, grande y al centro; la foto real del momento queda detrás, desenfocada.
// Ninguno se repite en la tanda (registro D:/rtmp/te29_COMPONENTES.md). Sin rótulos arriba a la izquierda.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const PAPER = "#f1ead9", PAPERD = "#cdbb92", INK = "#2b2620", COB = "#3f63b8", COBL = "#8fb0ff", RED_EARTH = "#a8442a", COPPER = "#c8743c";
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR");
const Floor: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.65 }) => <div style={{ ...at(x - w / 2, y - 26), width: w, height: 52, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o}), transparent 70%)`, filter: "blur(7px)" }} />;
const Num: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 130 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(0,0,0,.25), 0 20px 44px rgba(0,0,0,.75)" }}>{txt}</div>;
};
// losa extruida (forma repetida hacia abajo = espesor)
const Slab: React.FC<{ w: number; h: number; depth: number; top: string; side: string; br?: string; clip?: string; children?: React.ReactNode }> = ({ w, h, depth, top, side, br, clip, children }) => <div style={{ position: "relative", width: w, height: h + depth }}>
  {Array.from({ length: Math.ceil(depth / 3) }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: depth - i * 3, width: w, height: h, borderRadius: br, clipPath: clip, background: side, filter: `brightness(${0.55 + 0.35 * (i / (depth / 3))})` }} />)}
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: br, clipPath: clip, background: top, overflow: "hidden" }}>{children}<div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.2), transparent 45%, rgba(0,0,0,.25))" }} /></div>
</div>;
// lingote/bloque metálico con brillo
const Ingot: React.FC<{ w: number; c1: string; c2: string; c3: string; txt?: string }> = ({ w, c1, c2, c3, txt }) => <div style={{ width: w, height: w * 0.42, clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${c1}, ${c2} 45%, ${c3})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: w * 0.18, color: "rgba(255,255,255,.75)", textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>{txt}</div>;
// silueta del Congo (aprox.) para losa
const CONGO = "polygon(18% 52%, 26% 40%, 32% 22%, 46% 10%, 62% 8%, 78% 14%, 90% 24%, 92% 44%, 84% 56%, 88% 70%, 80% 86%, 66% 92%, 58% 84%, 46% 86%, 40% 76%, 30% 70%, 22% 72%, 10% 66%, 6% 58%)";
const stepsOf = (h: H, t: number, fb: [number, string][]) => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st = said.length >= fb.length - 1 ? said : fb;
  return { st, cur: st.reduce((a, s, i) => (t >= s[0] ? i : a), -1) };
};

// ---- 0:06 · LA BATERÍA ABIERTA: una batería de celular gigante se abre como un sándwich y en el medio brilla la capa azul de cobalto ----
export const TBattery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const op = eio(tt, 1.0, 2.6), glow = eio(tt, 2.2, 3.4);
  return <>
    <Floor x={960} y={900} w={1100} />
    {[0, 1, 2].map((i) => { const dy = (i - 1) * 150 * op, isCo = i === 1;
      return <div key={i} style={{ ...at(560, 470 + dy), width: 800, height: isCo ? 70 : 110, transform: "perspective(1600px) rotateX(48deg)", borderRadius: 18,
        background: isCo ? `linear-gradient(90deg, #23366b, ${COB} 40%, ${COBL} 55%, #23366b)` : "linear-gradient(180deg,#e9ecef,#a3a9b0 60%,#6d737a)",
        boxShadow: isCo ? `0 0 ${80 * glow}px rgba(120,160,255,${0.8 * glow}), 0 20px 30px rgba(0,0,0,.5)` : "0 20px 30px rgba(0,0,0,.55), inset 0 6px 0 rgba(255,255,255,.4)" }}>
        {i === 0 && <div style={{ ...at(40, 20), fontWeight: 900, fontSize: 44, color: "#2a2e33", letterSpacing: 4 }}>Li-ion 3.85V</div>}
      </div>; })}
    <Num tt={tt} d={2.4} x={1500} y={360} txt="Co" size={180} col={COBL} />
    <Tag tt={tt} at={2.8} x={1500} y={490} txt="COBALTO" col={ICE} size={40} />
  </>;
}}</Stage>;

// ---- 0:20 · SIETE DE DIEZ: diez lingotes de cobalto en fila; siete se deslizan a un cajón con la palabra CONGO estampada ----
export const TTenKilos: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const mv = (i: number) => (i < 7 ? eio(tt, 1.4 + i * 0.22, 2.2 + i * 0.22) : 0);
  return <>
    <Floor x={960} y={930} w={1500} />
    <div style={{ ...at(260, 640), width: 900, height: 260, background: "linear-gradient(180deg,#7a5634,#4a321d)", borderRadius: 10, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.25), 0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(0, 150), width: 900, textAlign: "center", fontWeight: 900, fontSize: 70, color: "rgba(255,230,190,.55)", letterSpacing: 18, fontFamily: "Courier New, monospace" }}>CONGO</div>
    </div>
    {Array.from({ length: 10 }, (_, i) => { const k = mv(i), s = phys(tt, 0.2 + i * 0.08, 7, 0.5);
      const x = lerp(360 + i * 130, 300 + (i % 4) * 210, k), y = lerp(330, 560 - Math.floor(i / 4) * 70, k) - Math.sin(Math.PI * k) * 160;
      return s > 0.01 ? <div key={i} style={{ ...at(x, y - (1 - s) * 200), opacity: cl(s * 2), filter: "drop-shadow(0 12px 12px rgba(0,0,0,.55))" }}><Ingot w={190} c1="#c9d6ff" c2="#5f7fd0" c3="#22356e" txt="Co" /></div> : null; })}
    <Num tt={tt} d={3.6} x={1500} y={300} txt="7 DE CADA 10" size={110} col={AMB} />
  </>;
}}</Stage>;

// ---- 0:37 · LO QUE HAY ABAJO: un corte de tierra roja en losa; bajo la superficie se encienden vetas de cobre, cobalto, oro y diamante; el número sube ----
export const TVault24: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v = (i: number) => eio(tt, 0.8 + i * 0.5, 1.6 + i * 0.5);
  const VEINS: [string, string, number][] = [["M60 160 C300 120 500 260 900 200 L1300 230", COPPER, 26], ["M80 300 C400 340 700 260 1000 330 L1300 300", COBL, 22], ["M120 420 C380 380 640 470 900 420 L1280 450", "#f0c64a", 18], ["M200 520 C500 560 800 500 1240 540", "#e8f4ff", 12]];
  return <>
    <Floor x={960} y={950} w={1500} />
    <div style={{ ...at(300, 300), transform: "perspective(1800px) rotateX(18deg)" }}>
      <Slab w={1320} h={600} depth={60} br="14px" side="#5a2414" top={`linear-gradient(180deg, #3f6d3e 0 46px, ${RED_EARTH} 46px, #7a2e1a 70%, #4a1a0e)`}>
        <svg width={1320} height={600} style={{ position: "absolute", inset: 0 }}>{VEINS.map(([d, c, w], i) => <path key={i} d={d} transform="translate(0 30)" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - v(i))} style={{ filter: `drop-shadow(0 0 ${14 * v(i)}px ${c})` }} />)}</svg>
      </Slab>
    </div>
    <Num tt={tt} d={0.4} x={960} y={170} txt={`US$ ${Math.round(24 * eio(tt, 0.6, 3.4))} BILLONES`} size={110} col={AMB} />
    <Tag tt={tt} at={3.4} x={960} y={280} txt="ESTIMACIÓN · NADIE MOSTRÓ EL ESTUDIO" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 2:37 · LA LISTA: seis bloques de la tabla periódica caen sobre la mesa uno por uno, cada uno con su mineral real encima ----
const ELS: [string, string, string, string][] = [["Co", "27", "COBALTO", COB], ["Cu", "29", "COBRE", COPPER], ["Au", "79", "ORO", "#d4a017"], ["C", "6", "DIAMANTES", "#7fb7c9"], ["Ta", "73", "COLTÁN", "#6a6f78"], ["Li", "3", "LITIO · MANONO", "#9a6fb0"]];
export const TPeriodic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Floor x={960} y={880} w={1600} />
  {ELS.map(([sym, n, name, c], i) => { const s = phys(tt, 0.3 + i * 0.75, 7, 0.4); if (s <= 0.01) return null; const x = 260 + i * 240;
    return <div key={i} style={{ ...at(x, 420 - (1 - s) * 400), opacity: cl(s * 2), width: 210, height: 250 }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(10px,14px)", borderRadius: 14, background: "rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: `linear-gradient(160deg, ${c}, rgba(0,0,0,.55))`, boxShadow: "inset 0 4px 0 rgba(255,255,255,.35), inset 0 0 0 3px rgba(255,255,255,.15)" }}>
        <div style={{ ...at(16, 10), fontWeight: 800, fontSize: 28, color: "rgba(255,255,255,.8)" }}>{n}</div>
        <div style={{ ...at(0, 50), width: 210, textAlign: "center", fontWeight: 900, fontSize: 110, color: "#fff" }}>{sym}</div>
      </div>
      <div style={{ ...at(105, 280), transform: "translateX(-50%)", fontWeight: 900, fontSize: 28, color: TX, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>{name}</div>
    </div>; })}
  <Num tt={tt} d={5.0} x={960} y={200} txt="LA BATERÍA DEL FUTURO" size={84} col={AMB} />
</>}</Stage>;

// ---- 3:24 · LA MESA DE BERLÍN: una mesa de roble con el mapa de África; una regla de bronce baja y traza líneas rectas que cortan el continente ----
export const TMesaBerlin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = (i: number) => eio(tt, 1.0 + i * 0.8, 1.7 + i * 0.8), rx = lerp(500, 1400, (tt * 0.25) % 1);
  const LINES = [[540, 300, 1360, 420], [760, 220, 860, 820], [600, 620, 1320, 560], [1100, 240, 1020, 800]];
  return <>
    <div style={{ ...at(260, 300), width: 1400, height: 640, transform: "perspective(1700px) rotateX(46deg)", transformOrigin: "50% 80%", borderRadius: 24, background: "repeating-linear-gradient(92deg,#6b4526 0 40px,#7a5030 40px 70px,#5e3c20 70px 110px)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" }}>
      <div style={{ ...at(300, 40), width: 800, height: 560, background: PAPER, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>
        <svg width={800} height={560}><path d="M300 30 C420 10 560 40 600 120 C680 170 720 260 660 330 C640 420 560 520 470 540 C420 470 380 400 330 380 C260 360 190 300 170 220 C160 150 220 60 300 30 Z" fill="#c9b27a" stroke="#7a6a44" strokeWidth={4} />
          {LINES.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1 - 300} y1={y1 - 200} x2={lerp(x1, x2, L(i)) - 300} y2={lerp(y1, y2, L(i)) - 200} stroke="#a8261e" strokeWidth={6} />)}</svg>
      </div>
      <div style={{ ...at(rx - 260, 330), width: 520, height: 40, borderRadius: 6, background: "linear-gradient(180deg,#e9c46a,#9a7420)", transform: `rotate(${-14 + 20 * Math.sin(tt * 0.6)}deg)`, boxShadow: "0 12px 16px rgba(0,0,0,.5)", opacity: tt > 0.6 ? 1 : 0 }}>{Array.from({ length: 20 }, (_, i) => <div key={i} style={{ ...at(10 + i * 25, 0), width: 2, height: i % 5 ? 12 : 22, background: "#4a3610" }} />)}</div>
    </div>
    <Num tt={tt} d={0.3} x={960} y={170} txt="BERLÍN · 1885" size={110} col={AMB} />
    <Tag tt={tt} at={1.2} x={960} y={280} txt="SE REPARTEN ÁFRICA CON UNA REGLA" size={32} />
  </>;
}}</Stage>;

// ---- 3:39 · LA ESCRITURA: un título de propiedad lacrado con el nombre de un hombre; al lado, Bélgica es un cuadradito y el Congo se despliega 80 veces más grande ----
export const TDeed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = phys(tt, 0.3, 6, 0.45), grow = eio(tt, 2.4, 4.6), seal = phys(tt, 1.6, 7, 0.4);
  return <>
    <Floor x={760} y={900} w={800} />
    <div style={{ ...at(360, 230 + (1 - d) * -300), width: 720, height: 640, opacity: cl(d * 2), transform: "rotate(-3deg)", background: `linear-gradient(90deg, ${PAPERD}, ${PAPER} 10%, ${PAPER} 90%, ${PAPERD})`, boxShadow: "0 30px 50px rgba(0,0,0,.6)", borderRadius: 6 }}>
      <div style={{ ...at(0, 50), width: 720, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 40, color: INK, letterSpacing: 6 }}>TÍTULO DE PROPIEDAD</div>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...at(80, 140 + i * 36), width: 560 - (i % 3) * 60, height: 5, background: "rgba(43,34,24,.28)" }} />)}
      <div style={{ ...at(0, 380), width: 720, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 58, color: "#1d1a16" }}>Leopoldo II</div>
      <div style={{ ...at(0, 460), width: 720, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 30, color: "#7a1a12" }}>A TÍTULO PERSONAL</div>
      {seal > 0.01 && <div style={{ ...at(560, 520), transform: `scale(${1.6 - 0.6 * seal})`, width: 120, height: 120, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)", boxShadow: "0 8px 18px rgba(0,0,0,.5)" }} />}
    </div>
    <div style={{ ...at(1260, 620), width: 30, height: 30, background: "#ffd400", boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={1.0} x={1275} y={690} txt="BÉLGICA" size={26} />
    <div style={{ ...at(1275 - 130 * grow, 380 - 120 * grow), opacity: cl(grow * 3), transform: `scale(${grow})`, transformOrigin: "50% 100%" }}>
      <Slab w={300} h={260} depth={22} clip={CONGO} side="#3a5a2a" top="radial-gradient(circle at 40% 40%, #5c8a3e, #2f5a22)" />
    </div>
    <Num tt={tt} d={4.0} x={1420} y={220} txt="× 80" size={120} col={AMB} />
  </>;
}}</Stage>;

// ---- 4:00 · EL CAUCHO: una liana cortada gotea látex blanco que cae y se va enrollando hasta formar la cubierta de una rueda de bicicleta ----
export const TRubber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.6, 4.6), spin = eio(tt, 4.4, 6.0) * 360;
  return <>
    <Floor x={1120} y={920} w={700} />
    <svg width={260} height={760} style={at(420, 120)}><path d="M120 0 C80 160 170 300 110 460 C70 580 140 680 120 760" stroke="#5a3d1e" strokeWidth={46} fill="none" strokeLinecap="round" /><path d="M120 0 C80 160 170 300 110 460" stroke="#7a5630" strokeWidth={16} fill="none" opacity={0.6} />
      <path d="M96 470 L150 450" stroke="#e9e3d2" strokeWidth={10} /></svg>
    {Array.from({ length: 5 }, (_, i) => { const y = ((tt * 1.3 + i / 5) % 1) * 360; return <div key={i} style={{ ...at(560, 600 + y), width: 22, height: 32, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#fff,#e2dccb)", opacity: k < 1 ? 1 - y / 400 : 0 }} />; })}
    <svg width={560} height={560} style={{ ...at(840, 340), transform: `rotate(${spin}deg)`, filter: "drop-shadow(0 20px 20px rgba(0,0,0,.6))" }}>
      <circle cx={280} cy={280} r={230} fill="none" stroke="#1d1d1d" strokeWidth={46} strokeDasharray={`${1445 * k} 2000`} transform="rotate(-90 280 280)" />
      <circle cx={280} cy={280} r={230} fill="none" stroke="#3a3a3a" strokeWidth={8} strokeDasharray="10 14" opacity={k} />
      <circle cx={280} cy={280} r={196} fill="none" stroke="#c9ccd0" strokeWidth={10} opacity={eio(tt, 3.6, 4.4)} />
      {Array.from({ length: 18 }, (_, i) => <line key={i} x1={280} y1={280} x2={280 + Math.cos(i * 0.349) * 190} y2={280 + Math.sin(i * 0.349) * 190} stroke="#b5b9be" strokeWidth={3} opacity={eio(tt, 3.6, 4.4)} />)}
      <circle cx={280} cy={280} r={22} fill="#888" opacity={eio(tt, 3.6, 4.4)} />
    </svg>
    <Num tt={tt} d={0.4} x={1120} y={200} txt="CAUCHO PARA LAS RUEDAS" size={78} col={AMB} />
  </>;
}}</Stage>;

// ---- 5:06 · LOS ARCHIVOS: una pila de biblioratos atados con cinta; prende la llama abajo y el humo se lleva las hojas ----
export const TArchivesFire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fire = eio(tt, 0.8, 2.4), burn = eio(tt, 2.0, 5.6), fl = 0.85 + 0.15 * Math.sin(tt * 2 * Math.PI * 1.6);
  return <>
    <Floor x={960} y={920} w={900} />
    {Array.from({ length: 6 }, (_, i) => { const hh = 110 * (1 - burn * (0.3 + (5 - i) * 0.1)); return <div key={i} style={{ ...at(700 + (i % 2) * 20, 800 - (i + 1) * 100), width: 520, height: Math.max(20, hh), background: `linear-gradient(90deg, ${i % 2 ? "#6b4a2b" : "#7a2e1a"}, ${PAPER} 6%, ${PAPERD} 94%, #6b4a2b)`, boxShadow: "0 6px 0 rgba(0,0,0,.25)", filter: `brightness(${1 - burn * 0.6})` }} />; })}
    <div style={{ ...at(940, 200), width: 40, height: 620, background: "rgba(200,40,30,.7)" }} />
    <div style={{ ...at(620, 820 - 360 * fire * fl), width: 680, height: 360 * fire * fl, borderRadius: "50% 50% 20% 20% / 80% 80% 20% 20%", background: "radial-gradient(ellipse at 50% 100%, #fff3c4, #ffb347 30%, #e2531e 60%, rgba(160,30,10,0) 75%)", filter: "blur(4px)", mixBlendMode: "screen" }} />
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.35 + i / 8) % 1); return burn > 0.1 ? <div key={i} style={{ ...at(760 + (i * 61) % 420 + Math.sin(tt + i) * 60, 600 - k * 520), width: 70, height: 50, background: k > 0.5 ? "#2a2420" : PAPER, opacity: 1 - k, transform: `rotate(${i * 40 + k * 300}deg)` }} /> : null; })}
    <Num tt={tt} d={2.6} x={960} y={150} txt="1908 · NO QUEDA RASTRO" size={86} col={RED} />
  </>;
}}</Stage>;

// ---- 5:42 · SHINKOLOBWE: una roca de uranio amarilla en una caja de plomo; el contador Geiger se enloquece; arriba, una fecha: 1945 ----
export const TUranium: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lid = eio(tt, 0.5, 1.6), needle = lerp(-60, 50, eio(tt, 1.4, 2.6)) + 6 * Math.sin(tt * 9) * eio(tt, 1.4, 2.6);
  return <>
    <Floor x={760} y={900} w={760} />
    <div style={{ ...at(420, 560), width: 680, height: 320, background: "linear-gradient(180deg,#6e7277,#3a3d41)", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.15)" }} />
    <svg width={460} height={300} style={{ ...at(530, 380), filter: `drop-shadow(0 0 ${40 * lid}px rgba(220,255,90,.75))` }}><path d="M40 260 C10 180 60 80 160 60 C240 20 360 50 400 140 C440 220 400 270 330 280 Z" fill="#c9cf3a" stroke="#7a7a1a" strokeWidth={6} />{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={90 + (i * 53) % 280} cy={110 + (i * 37) % 140} r={8 + (i % 3) * 4} fill="#eef56a" opacity={0.7} />)}</svg>
    <div style={{ ...at(420, 560 - 260 * lid), width: 680, height: 60, background: "linear-gradient(180deg,#8a8e93,#4a4d51)", borderRadius: 12, transform: `rotate(${-14 * lid}deg)`, transformOrigin: "0 100%", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(1240, 380), width: 380, height: 460, borderRadius: 22, background: "linear-gradient(160deg,#e3c34a,#9a7e1a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(40, 40), width: 300, height: 200, borderRadius: "160px 160px 12px 12px", background: "#f6f1df", overflow: "hidden" }}>
        <svg width={300} height={200}><path d="M30 190 A130 130 0 0 1 270 190" fill="none" stroke="#bbb" strokeWidth={10} /><path d="M200 70 A130 130 0 0 1 270 190" fill="none" stroke={RED} strokeWidth={10} /><g transform={`rotate(${needle} 150 190)`}><rect x={146} y={60} width={8} height={130} fill="#222" /></g></svg>
      </div>
      <div style={{ ...at(0, 280), width: 380, textAlign: "center", fontWeight: 900, fontSize: 40, color: "#2a2410" }}>GEIGER</div>
    </div>
    <Num tt={tt} d={2.6} x={960} y={180} txt="URANIO · 1945" size={110} col="#e7f05a" />
    <Tag tt={tt} at={3.2} x={960} y={290} txt="DE ESTA MINA SALIÓ EL DE LAS BOMBAS" size={30} />
  </>;
}}</Stage>;

// ---- 6:18 · EL DISCURSO: un micrófono de radio de 1960 en su pie; las ondas de la voz salen como anillos y hacen temblar una copa de cristal ----
export const TSpeech: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 6, 0.5), vib = eio(tt, 1.4, 2.2) * Math.sin(tt * 30) * 3;
  return <>
    <Floor x={760} y={940} w={500} />
    <div style={{ ...at(740, 520), width: 30, height: 420, background: "linear-gradient(90deg,#666,#ddd,#666)" }} />
    <div style={{ ...at(560, 900), width: 400, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,#999,#333)" }} />
    <div style={{ ...at(620, 230 + (1 - s) * -300), width: 280, height: 320, borderRadius: 60, background: "repeating-linear-gradient(0deg,#cfd3d8 0 8px,#7a7e84 8px 14px)", border: "16px solid #b9bdc2", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 4 }, (_, i) => { const k = ((tt * 0.8 + i / 4) % 1); return tt > 0.8 ? <div key={i} style={{ ...at(760 - k * 600, 390 - k * 380), width: k * 1200, height: k * 760, borderRadius: "50%", border: `5px solid rgba(255,214,140,${0.6 * (1 - k)})` }} /> : null; })}
    <svg width={180} height={300} style={{ ...at(1340, 580), transform: `translateX(${vib}px)` }}><path d="M30 10 L150 10 Q150 110 90 130 L90 260 L140 290 L40 290 L90 260 L90 130 Q30 110 30 10 Z" fill="rgba(220,240,255,.25)" stroke="rgba(230,245,255,.85)" strokeWidth={5} /></svg>
    <Num tt={tt} d={0.4} x={960} y={160} txt="30 DE JUNIO DE 1960" size={92} col={AMB} />
    <Tag tt={tt} at={1.0} x={960} y={270} txt="LUMUMBA, FRENTE AL REY" size={34} />
  </>;
}}</Stage>;

// ---- 6:43 · EL PAÍS SE PARTE: el Congo en losa sobre la mesa; una grieta recorre el sur y Katanga, la parte con las minas brillando, se separa ----
export const TSplitMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cr = eio(tt, 0.8, 2.0), sep = eio(tt, 2.0, 3.8);
  return <>
    <Floor x={960} y={900} w={1300} />
    <div style={{ ...at(480, 260), transform: "perspective(1600px) rotateX(46deg)", transformOrigin: "50% 80%" }}>
      <div style={{ position: "relative", width: 960, height: 700 }}>
        <div style={{ position: "absolute", left: 0, top: 0, clipPath: "polygon(0 0, 100% 0, 100% 62%, 70% 70%, 40% 66%, 0 72%)" }}><Slab w={960} h={700} depth={50} clip={CONGO} side="#3a5a2a" top="radial-gradient(circle at 40% 30%, #5c8a3e, #2f5a22)" /></div>
        <div style={{ position: "absolute", left: 0, top: 0, clipPath: "polygon(0 72%, 40% 66%, 70% 70%, 100% 62%, 100% 100%, 0 100%)", transform: `translate(${160 * sep}px, ${140 * sep}px) rotate(${6 * sep}deg)` }}>
          <Slab w={960} h={700} depth={50} clip={CONGO} side="#5a2414" top={`radial-gradient(circle at 70% 85%, #e0a050, ${RED_EARTH} 40%, #7a2e1a)`}>
            {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...at(520 + (i * 47) % 260, 520 + (i * 29) % 120), width: 16, height: 16, borderRadius: 4, background: i % 2 ? COPPER : COBL, boxShadow: `0 0 18px ${i % 2 ? COPPER : COBL}`, opacity: sep }} />)}
          </Slab>
        </div>
        <svg width={960} height={700} style={{ position: "absolute", inset: 0 }}><path d="M0 504 L120 470 L250 480 L384 462 L520 488 L672 490 L800 450 L960 434" fill="none" stroke="#1a0d06" strokeWidth={10} strokeDasharray="1100" strokeDashoffset={1100 * (1 - cr)} opacity={1 - sep} /></svg>
      </div>
    </div>
    <Num tt={tt} d={2.4} x={1460} y={820} txt="KATANGA" size={100} col={AMB} />
    <Tag tt={tt} at={2.8} x={1460} y={920} txt="LA PROVINCIA DE LAS MINAS" size={30} />
  </>;
}}</Stage>;

// ---- 7:09 · EL DIENTE: un estuche de madera forrado en terciopelo se abre despacio; adentro, sobre la seda, un solo diente; la tapa tiene una placa: 2022 ----
export const TTooth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.6, 2.4), l = eio(tt, 2.0, 3.2);
  return <>
    <Floor x={960} y={880} w={900} />
    <div style={{ ...at(560, 560), width: 800, height: 300, borderRadius: 16, background: "linear-gradient(180deg,#5a341c,#2e180b)", boxShadow: "0 30px 50px rgba(0,0,0,.65)" }}>
      <div style={{ ...at(30, 30), width: 740, height: 200, borderRadius: 10, background: "radial-gradient(ellipse at 50% 40%, #7a1422, #3a0610)" }} />
      <svg width={120} height={140} style={{ ...at(340, 60), filter: `drop-shadow(0 0 ${30 * l}px rgba(255,240,210,.8))` }}><path d="M20 30 C20 0 100 0 100 30 C104 70 90 80 86 130 C84 140 72 138 70 120 L62 80 L54 120 C52 138 40 140 38 130 C34 80 16 70 20 30 Z" fill="#f4eee0" stroke="#c8bfa8" strokeWidth={4} /></svg>
    </div>
    <div style={{ ...at(560, 300), width: 800, height: 260, borderRadius: "16px 16px 6px 6px", background: "linear-gradient(180deg,#6b3e22,#3a200f)", transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(${lerp(0, -105, op)}deg)`, boxShadow: "0 -10px 30px rgba(0,0,0,.4)" }}>
      <div style={{ ...at(280, 90), width: 240, height: 80, borderRadius: 8, background: "linear-gradient(180deg,#f3d77a,#a87a1c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: "#4a3410" }}>2022</div>
    </div>
    <Num tt={tt} d={2.8} x={960} y={180} txt="LO ÚNICO QUE QUEDÓ" size={92} col={AMB} />
  </>;
}}</Stage>;

// ---- 7:40 · EL GORRO Y EL BASTÓN: un gorro de piel de leopardo sobre un pedestal de mármol y el bastón tallado apoyado; un contador de años sube a 32 ----
export const TLeopardHat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.3, 6, 0.45), yrs = Math.round(32 * eio(tt, 1.2, 4.6));
  return <>
    <Floor x={760} y={920} w={700} />
    <div style={{ ...at(520, 640), width: 480, height: 280, background: "linear-gradient(90deg,#cfcac0,#f6f3ec 40%,#bdb8ae)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(490, 610), width: 540, height: 40, background: "linear-gradient(180deg,#fff,#cfcac0)" }} />
    <div style={{ ...at(580, 330 + (1 - s) * -300), width: 360, height: 290, borderRadius: "46% 46% 12% 12% / 60% 60% 12% 12%", opacity: cl(s * 2),
      background: "radial-gradient(circle at 20% 30%, #2a1a0a 0 9px, transparent 10px) 0 0/58px 52px, radial-gradient(circle at 70% 70%, #2a1a0a 0 7px, #7a4a14 8px 11px, transparent 12px) 0 0/48px 44px, linear-gradient(180deg, #e6b35a, #b77a2c)",
      boxShadow: "inset -20px -10px 40px rgba(0,0,0,.35), 0 20px 30px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(1060, 240), width: 40, height: 690, borderRadius: 20, background: "repeating-linear-gradient(170deg,#4a2a14 0 30px,#6b3e22 30px 46px)", transform: "rotate(10deg)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }}><div style={{ ...at(-30, -60), width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#8a5a2c,#3a200f)" }} /></div>
    <Num tt={tt} d={1.0} x={1480} y={480} txt={`${yrs} AÑOS`} size={130} col={AMB} />
    <Tag tt={tt} at={1.4} x={1480} y={610} txt="MOBUTU SESE SEKO · ZAIRE" size={32} />
  </>;
}}</Stage>;

// ---- 8:14 · DE COMPRAS EN CONCORDE: el avión supersónico cruza en arco de la selva a París; a la vuelta lleva colgando bolsas de tiendas ----
export const TConcorde: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.4, 3.0), back = eio(tt, 3.4, 5.8), u = back > 0 ? back : k, x = back > 0 ? lerp(1500, 420, u) : lerp(420, 1500, u), y = 560 - Math.sin(Math.PI * u) * 280;
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M420 560 Q960 0 1500 560" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={5} strokeDasharray="14 12" /></svg>
    <div style={{ ...at(300, 600), width: 240, height: 200, borderRadius: "50% 50% 10% 10%", background: "radial-gradient(circle at 50% 30%, #3f7a3a, #1d3f1a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={0.3} x={420} y={840} txt="GBADOLITE" col={GRN} size={34} />
    <div style={{ ...at(1440, 520), width: 18, height: 280, background: "linear-gradient(90deg,#666,#bbb,#666)", clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)", transform: "scaleX(5)" }} />
    <Tag tt={tt} at={1.2} x={1500} y={840} txt="PARÍS" col={ICE} size={34} />
    <div style={{ ...at(x - 220, y - 60), transform: `scaleX(${back > 0 ? -1 : 1}) rotate(${back > 0 ? 0 : -6}deg)`, filter: "drop-shadow(0 20px 18px rgba(0,0,0,.55))" }}>
      <svg width={440} height={150}><path d="M10 70 L360 60 L430 74 L360 86 L10 80 Z" fill="#f2f2f2" /><path d="M140 76 L300 76 L240 140 L190 140 Z" fill="#d9d9d9" /><path d="M30 72 L20 20 L60 20 L90 72 Z" fill="#d9d9d9" /><path d="M360 60 L430 74" stroke="#999" strokeWidth={3} /></svg>
      {back > 0 && [0, 1, 2].map((i) => <div key={i} style={{ ...at(150 + i * 50, 120 + 10 * Math.sin(tt * 4 + i)), width: 40, height: 50, borderRadius: 4, background: ["#d8b26a", "#111", "#c21f2b"][i], boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />)}
    </div>
    <Num tt={tt} d={0.4} x={960} y={150} txt="DE COMPRAS EN SUPERSÓNICO" size={80} col={AMB} />
  </>;
}}</Stage>;

// ---- 8:57 · NUEVE EJÉRCITOS: alrededor de una mina a cielo abierto clavan nueve banderines de colores, uno por país, cada vez más cerca ----
export const TNineArmies: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const COLS = ["#d42a2a", "#1f7a3a", "#f2c21b", "#1f3f9a", "#ffffff", "#e06a1b", "#5aa0e0", "#7a2a8a", "#111111"];
  return <>
    <div style={{ ...at(460, 380), width: 1000, height: 560, transform: "perspective(1600px) rotateX(55deg)", transformOrigin: "50% 70%" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 50, top: i * 34, right: i * 50, bottom: i * 34, borderRadius: "50%", background: i % 2 ? "#8a3a22" : "#a8442a", boxShadow: "inset 0 10px 18px rgba(0,0,0,.35)" }} />)}
      <div style={{ position: "absolute", left: 360, top: 240, width: 280, height: 80, borderRadius: "50%", background: "#3a6a8a", opacity: 0.7 }} />
    </div>
    {COLS.map((c, i) => { const a = (i / 9) * Math.PI * 2 - Math.PI / 2, s = phys(tt, 0.4 + i * 0.4, 7, 0.4), r = 1 - 0.25 * eio(tt, 4.2, 6.0), x = 960 + Math.cos(a) * 560 * r, y = 660 + Math.sin(a) * 250 * r;
      return s > 0.01 ? <div key={i} style={{ ...at(x, y - 220 * s), transformOrigin: "0 100%" }}>
        <div style={{ width: 8, height: 220, background: "linear-gradient(90deg,#999,#eee,#888)" }} />
        <div style={{ ...at(8, 0), width: 110 * s, height: 70, background: `linear-gradient(135deg, ${c}, rgba(0,0,0,.35))`, clipPath: "polygon(0 0, 100% 50%, 0 100%)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
      </div> : null; })}
    <Num tt={tt} d={0.6} x={960} y={180} txt={`${Math.min(9, Math.floor(eio(tt, 0.3, 4.0) * 9.99))} PAÍSES`} size={120} col={AMB} />
    <Tag tt={tt} at={4.2} x={960} y={300} txt="LA GRAN GUERRA DE ÁFRICA · 1998-2003" size={32} />
  </>;
}}</Stage>;

// ---- 9:23 · LAS VELAS: un campo de velitas que se encienden fila por fila hacia el fondo; el contador llega a 5 millones (con la marca de estimación) ----
export const TCandles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 5.0);
  return <>
    <div style={{ ...at(160, 380), width: 1600, height: 600, transform: "perspective(1400px) rotateX(58deg)", transformOrigin: "50% 100%" }}>
      {Array.from({ length: 10 * 24 }, (_, i) => { const r = Math.floor(i / 24), c = i % 24, lit = (r * 24 + c) / 240 < k, fl = 0.85 + 0.15 * Math.sin(tt * 2 * Math.PI * 1.4 + i);
        return <div key={i} style={{ ...at(20 + c * 66, 540 - r * 58), width: 22, height: 40 }}>
          <div style={{ position: "absolute", bottom: 0, width: 22, height: 30, borderRadius: 4, background: "linear-gradient(90deg,#d9d1bd,#fffaf0,#cfc6b0)" }} />
          {lit && <div style={{ position: "absolute", bottom: 28, left: 3, width: 16, height: 26 * fl, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 80%, #fff6c9, #ffb347 60%, transparent 70%)", boxShadow: "0 0 30px rgba(255,190,90,.7)" }} />}
        </div>; })}
    </div>
    <Num tt={tt} d={0.4} x={960} y={200} txt={`${(5.4 * k).toFixed(1).replace(".", ",")} MILLONES`} size={120} />
    <Tag tt={tt} at={1.2} x={960} y={320} txt="ESTIMACIÓN · COMITÉ INTERNACIONAL DE RESCATE" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 10:14 · LA CIUDAD QUESO: una manzana de Kolwezi en losa, con techos de chapa; aparecen pozos negros en patios y dentro de las casas hasta que la manzana es un queso ----
export const TSwissCheese: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.6, 5.0), n = Math.floor(k * 30);
  return <>
    <Floor x={960} y={900} w={1400} />
    <div style={{ ...at(360, 280), transform: "perspective(1600px) rotateX(52deg)", transformOrigin: "50% 80%" }}>
      <Slab w={1200} h={700} depth={60} br="12px" side="#5a2414" top={`linear-gradient(180deg, ${RED_EARTH}, #8a3a22)`}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...at(60 + (i % 4) * 280, 60 + Math.floor(i / 4) * 220), width: 180, height: 130, background: "repeating-linear-gradient(90deg,#9aa0a6 0 14px,#6d737a 14px 22px)", boxShadow: "0 12px 0 #3a3a3a" }} />)}
        {Array.from({ length: n }, (_, i) => { const r = 24 + (i * 13) % 36; return <div key={"p" + i} style={{ ...at((i * 197) % 1120 + 20, (i * 113) % 620 + 20), width: r * 2, height: r * 1.4, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #050302 55%, #3a1a0e 70%, #8a3a22)", boxShadow: "inset 0 10px 14px rgba(0,0,0,.9)" }} />; })}
      </Slab>
    </div>
    <Num tt={tt} d={0.4} x={960} y={160} txt={`${n} POZOS EN UNA MANZANA`} size={84} col={AMB} />
    <Tag tt={tt} at={1.0} x={960} y={270} txt="KOLWEZI · CAVAN DEBAJO DE SU CASA" size={30} />
  </>;
}}</Stage>;

// ---- 10:36 · EL POZO: corte vertical de la tierra; un hombre con linterna en la frente baja por una soga; la regla del costado marca 10, 20, 30 metros ----
export const TShaft: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const d = eio(tt, 0.6, 6.0), y = 200 + 640 * d;
  return <>
    <div style={{ ...at(560, 140), width: 800, height: 860, background: `linear-gradient(180deg, ${RED_EARTH}, #7a2e1a 40%, #4a1a0e)`, boxShadow: "inset 0 0 80px rgba(0,0,0,.6), 0 30px 60px rgba(0,0,0,.6)", borderRadius: 10 }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ ...at((i * 137) % 700, 80 + i * 80), width: 60 + (i % 3) * 30, height: 18, borderRadius: 9, background: i % 3 === 0 ? COBL : "rgba(0,0,0,.25)", opacity: 0.5 }} />)}
      <div style={{ ...at(320, 0), width: 160, height: 860, background: "linear-gradient(90deg,#120804,#2a120a 30%,#2a120a 70%,#120804)" }} />
      <div style={{ ...at(398, 0), width: 4, height: y - 120, background: "#d9c79c" }} />
      <div style={{ ...at(370, y - 140), width: 60, height: 150 }}>
        <div style={{ ...at(14, 0), width: 32, height: 32, borderRadius: "50%", background: "#c9b89a" }} />
        <div style={{ ...at(22, -6), width: 16, height: 10, borderRadius: 3, background: "#fff6c9", boxShadow: "0 0 30px 10px rgba(255,240,180,.7)" }} />
        <div style={{ ...at(10, 34), width: 40, height: 70, borderRadius: 10, background: "#6b5a44" }} />
        <div style={{ ...at(12, 100), width: 14, height: 50, background: "#4a3d2e" }} /><div style={{ ...at(34, 100), width: 14, height: 50, background: "#4a3d2e" }} />
      </div>
      <div style={{ ...at(320, y - 40), width: 160, height: 300, background: "radial-gradient(ellipse at 50% 0%, rgba(255,240,180,.35), transparent 70%)" }} />
    </div>
    {[10, 20, 30].map((m, i) => <div key={m} style={{ ...at(1400, 200 + (i + 1) * 213), opacity: d * 3 > i ? 1 : 0.25, fontWeight: 900, fontSize: 56, color: d * 3 > i ? AMB : "#888", textShadow: "0 4px 16px #000" }}>— {m} m</div>)}
    <Num tt={tt} d={0.4} x={960} y={90} txt="A MANO · SIN OXÍGENO · SIN NADA" size={58} col={TX} />
  </>;
}}</Stage>;

// ---- 11:52 · LA PIEDRA DE LA HELADERA: una heladera blanca vieja; arriba, la piedra verde-azul de cobre y cobalto brilla como si tuviera pintura adentro ----
export const TStone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = phys(tt, 0.4, 6, 0.5), glow = 0.6 + 0.4 * Math.sin(tt * 1.4);
  return <>
    <Floor x={960} y={960} w={700} />
    <div style={{ ...at(720, 400), width: 480, height: 560, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(90deg,#cfd0c8,#f4f4ee 35%,#e3e3dc 70%,#b5b6ae)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(0, 190), width: 480, height: 6, background: "rgba(0,0,0,.2)" }} /><div style={{ ...at(400, 80), width: 18, height: 80, borderRadius: 9, background: "#999" }} /><div style={{ ...at(400, 260), width: 18, height: 120, borderRadius: 9, background: "#999" }} />
    </div>
    <svg width={340} height={220} style={{ ...at(790, 200 + (1 - s) * -200), opacity: cl(s * 2), filter: `drop-shadow(0 0 ${30 * glow}px rgba(80,220,200,.6)) drop-shadow(0 16px 14px rgba(0,0,0,.6))` }}>
      <defs><radialGradient id="mal" cx=".4" cy=".35"><stop offset="0" stopColor="#7af0c8" /><stop offset=".45" stopColor="#1f9a74" /><stop offset=".75" stopColor="#2a5fb8" /><stop offset="1" stopColor="#13285a" /></radialGradient></defs>
      <path d="M30 190 C10 120 60 40 150 30 C240 20 320 80 310 160 C305 200 260 210 200 210 Z" fill="url(#mal)" stroke="#0d3a2a" strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${70 + i * 35} ${170 - (i % 2) * 40} q20 -30 40 0`} stroke="rgba(220,255,240,.6)" strokeWidth={5} fill="none" />)}
    </svg>
    <Num tt={tt} d={2.4} x={1460} y={420} txt="31 AÑOS" size={120} col={RED} />
    <Tag tt={tt} at={2.8} x={1460} y={540} txt="LOS PULMONES, ARRUINADOS" size={32} />
  </>;
}}</Stage>;

// ---- 12:40 · EL APARATO: una pistola analizadora apunta a la bolsa de roca; en su pantalla aparece el % de cobalto… que sólo ve el comprador ----
export const TMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const aim = phys(tt, 0.4, 6, 0.5), beam = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.0, 3.4)), pc = (11.8 * eio(tt, 2.0, 3.4)).toFixed(1).replace(".", ",");
  return <>
    <Floor x={760} y={920} w={600} />
    <div style={{ ...at(520, 520), width: 440, height: 400, borderRadius: "40% 40% 20% 20%", background: "radial-gradient(ellipse at 40% 30%, #e7ddc4, #b9aa86 60%, #8a7a58)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(170, -30), width: 100, height: 60, borderRadius: 20, background: "#9a8a66" }} />
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...at(60 + (i * 47) % 320, 120 + (i * 61) % 220), width: 30, height: 22, borderRadius: 8, background: i % 2 ? "#3f63b8" : "#5a4a3a", opacity: 0.4 }} />)}
    </div>
    <div style={{ ...at(1100 + (1 - aim) * 300, 380), transform: "rotate(-14deg)", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.6))" }}>
      <div style={{ width: 460, height: 170, borderRadius: "30px 80px 80px 30px", background: "linear-gradient(180deg,#f2c21b,#b8900c)" }}>
        <div style={{ ...at(170, 30), width: 230, height: 110, borderRadius: 12, background: "#0b1a14", boxShadow: "inset 0 0 0 5px #333", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 52, color: "#5aff9a" }}>Co {pc}%</div>
      </div>
      <div style={{ ...at(300, 160), width: 90, height: 200, borderRadius: 16, background: "linear-gradient(90deg,#333,#666,#333)" }} />
      <div style={{ ...at(-70, 60), width: 90, height: 50, borderRadius: 10, background: "#555" }} />
    </div>
    {beam > 0 && <div style={{ ...at(940, 470), width: 200, height: 14, background: `rgba(120,255,170,${0.7 * beam})`, transform: "rotate(-12deg)", boxShadow: "0 0 30px rgba(120,255,170,.8)" }} />}
    <Num tt={tt} d={3.4} x={1360} y={820} txt="EL QUE MIDE, PONE EL PRECIO" size={62} col={AMB} />
  </>;
}}</Stage>;

// ---- 14:16 · EL VIAJE DE UNA BOLSA (pasos): la bolsa de mineral avanza por una maqueta: pozo → trituradora → camión → frontera → barco a China → refinería ----
export const TCobaltPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const { st, cur } = stepsOf(h, t, [[h.at + 0.3, "LA ROCA"], [h.at + 1.3, "TRITURAR Y CONCENTRAR"], [h.at + 2.3, "CAMIONES A LA FRONTERA"], [h.at + 3.3, "BARCO A CHINA"], [h.at + 4.3, "REFINADO"]]);
  const span = st.length > 1 ? st[1][0] - st[0][0] : 1, prog = cur < 0 ? 0 : (cur + cl((t - st[cur][0]) / Math.max(0.8, Math.min(2.5, span)))) / st.length;
  const PTS = [[300, 700], [620, 600], [960, 660], [1300, 560], [1620, 620]];
  const seg = prog * (PTS.length - 1), i0 = Math.min(PTS.length - 2, Math.floor(seg)), f = seg - i0, bx = lerp(PTS[i0][0], PTS[i0 + 1][0], f), by = lerp(PTS[i0][1], PTS[i0 + 1][1], f);
  const ICONS = ["⛏", "⚙", "🚚", "🚢", "🏭"];
  return <>
    <div style={{ ...at(160, 520), width: 1600, height: 380, transform: "perspective(1600px) rotateX(50deg)", transformOrigin: "50% 100%", background: `linear-gradient(90deg, ${RED_EARTH} 0 55%, #1d5a74 70%, #6d6f73 85%)`, borderRadius: 20, boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d={`M${PTS.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke="rgba(255,240,210,.5)" strokeWidth={8} strokeDasharray="16 14" /></svg>
    {PTS.map(([x, y], i) => <div key={i} style={{ ...at(x - 60, y - 150), width: 120, height: 120, borderRadius: 24, background: i <= cur ? "linear-gradient(160deg,#f3d77a,#a87a1c)" : "linear-gradient(160deg,#5a5d63,#2a2c30)", boxShadow: "0 20px 26px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>{ICONS[i]}</div>)}
    <div style={{ ...at(bx - 50, by - 60), width: 100, height: 110, borderRadius: "34px 34px 24px 24px", background: "radial-gradient(ellipse at 40% 30%, #e7ddc4, #9a8a66)", boxShadow: "0 16px 20px rgba(0,0,0,.6)" }} />
    {cur >= 0 && <div key={cur} style={{ ...at(960, 960), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 58, color: AMB, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{cur + 1} · {st[cur][1]}</div>}
  </>;
}}</Stage>;

// ---- 15:36 · MINERALES POR RUTAS: un trueque en una mesa: de un lado un carro lleno de cobre y cobalto; del otro, la maqueta de rutas y hospitales… que se achica ----
export const TRoadsDeal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = phys(tt, 0.3, 6, 0.45), shrink = 1 - 0.65 * eio(tt, 3.0, 5.4);
  return <>
    <Floor x={960} y={900} w={1500} />
    <div style={{ ...at(300, 560), width: 520, height: 260, background: "linear-gradient(180deg,#6d737a,#3a3d41)", clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ ...at(330 + (i % 7) * 66, 520 - Math.floor(i / 7) * 50 - (1 - s) * 200), width: 70, height: 56, borderRadius: "40%", background: i % 2 ? `radial-gradient(circle at 35% 30%, #f2a36a, ${COPPER})` : `radial-gradient(circle at 35% 30%, ${COBL}, ${COB})` }} />)}
    {[0, 1].map((w) => <div key={w} style={{ ...at(360 + w * 320, 790), width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,#555 30%,#222 32%,#333)" }} />)}
    <div style={{ ...at(1100, 360), width: 560, height: 480, transform: `scale(${shrink})`, transformOrigin: "50% 100%" }}>
      <div style={{ ...at(0, 360), width: 560, height: 70, background: "#3a3a3a", borderRadius: 8 }}><div style={{ ...at(0, 30), width: 560, height: 8, background: "repeating-linear-gradient(90deg,#ffd400 0 40px,transparent 40px 80px)" }} /></div>
      <div style={{ ...at(60, 120), width: 200, height: 240, background: "linear-gradient(180deg,#f4f4f0,#c9c9c2)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }}><div style={{ ...at(70, 30), width: 60, height: 60, background: RED, clipPath: "polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)" }} /></div>
      <div style={{ ...at(300, 40), width: 220, height: 320, background: "linear-gradient(180deg,#9aa6b0,#5a6670)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...at(24 + (i % 3) * 62, 20 + Math.floor(i / 3) * 70), width: 40, height: 46, background: "#cde4f2" }} />)}</div>
    </div>
    <Tag tt={tt} at={0.8} x={560} y={950} txt="COBRE Y COBALTO" col={AMB} size={34} />
    <Tag tt={tt} at={1.4} x={1380} y={950} txt="RUTAS Y HOSPITALES" col={ICE} size={34} />
    <Num tt={tt} d={3.6} x={960} y={180} txt="2008 · LO PROMETIDO SE ACHICÓ" size={74} col={RED} />
  </>;
}}</Stage>;

// ---- 16:08 · EL SOBRE BAJO LA MESA: un sobre gordo de billetes se desliza por debajo de una mesa de reunión; un sello de juzgado cae encima: CULPABLE ----
export const TBribe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const slide = eio(tt, 0.5, 2.4), st = phys(tt, 3.0, 7, 0.32);
  return <>
    <div style={{ ...at(300, 360), width: 1320, height: 70, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    {[0, 1].map((i) => <div key={i} style={{ ...at(380 + i * 1080, 430), width: 60, height: 480, background: "linear-gradient(90deg,#4a2d16,#7a4f2b,#4a2d16)" }} />)}
    <Floor x={960} y={920} w={1300} o={0.5} />
    <div style={{ ...at(lerp(420, 1120, slide), 760), width: 360, height: 150, background: "linear-gradient(180deg,#d9c49a,#b89c68)", borderRadius: 8, boxShadow: "0 16px 20px rgba(0,0,0,.55)", transform: "rotate(-4deg)" }}>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ ...at(30 + i * 8, -20 - i * 6), width: 260, height: 70, background: "linear-gradient(135deg,#b9d2a8,#6f9a62)", border: "3px solid #3f6a35", borderRadius: 4, transform: `rotate(${-6 + i * 3}deg)` }} />)}
    </div>
    {st > 0.01 && <div style={{ ...at(960, 560), transform: `translate(-50%,-50%) translateY(${(1 - st) * -300}px) scale(${1.5 - 0.5 * st}) rotate(-8deg)`, opacity: cl(st * 2), border: "14px solid #d42a22", color: "#d42a22", padding: "0 50px", fontWeight: 900, fontSize: 150, borderRadius: 18, mixBlendMode: "screen" }}>CULPABLE</div>}
    <Num tt={tt} d={0.3} x={960} y={170} txt="GLENCORE · MÁS DE US$ 1.000 M EN MULTAS" size={62} col={AMB} />
  </>;
}}</Stage>;

// ---- 16:50 · RUBAYA: bolsas de coltán cruzan una barrera de frontera de noche y caen en una pila donde ya no se distinguen de las otras ----
export const TRubaya: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  return <>
    <Floor x={960} y={900} w={1500} />
    <div style={{ ...at(940, 380), width: 40, height: 520, background: "linear-gradient(90deg,#666,#ddd,#666)" }} />
    <div style={{ ...at(960, 400), width: 600, height: 40, background: "repeating-linear-gradient(90deg,#eee 0 60px,#d42a22 60px 120px)", transformOrigin: "0 50%", transform: `rotate(${-70 * eio(tt, 0.6, 1.2)}deg)`, borderRadius: 20 }} />
    <div style={{ ...at(1260, 640), width: 460, height: 240, borderRadius: "50% 50% 10% 10% / 80% 80% 10% 10%", background: "radial-gradient(ellipse at 50% 30%, #7a7e86, #3a3d43)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 6 }, (_, i) => { const k = eio(tt, 1.0 + i * 0.6, 2.2 + i * 0.6), x = lerp(300, 1400 + (i % 3) * 60, k), y = 760 - Math.sin(Math.PI * k) * 120 - (k > 0.98 ? 40 + (i % 3) * 20 : 0);
      return <div key={i} style={{ ...at(x, y), width: 110, height: 120, borderRadius: "36px 36px 24px 24px", background: k > 0.98 ? "radial-gradient(ellipse at 40% 30%, #8a8e96, #4a4d53)" : "radial-gradient(ellipse at 40% 30%, #d8cbb0, #8a7a58)", boxShadow: "0 12px 16px rgba(0,0,0,.5)" }} />; })}
    <Tag tt={tt} at={0.4} x={560} y={960} txt="RUBAYA · CONGO" col={AMB} size={36} />
    <Tag tt={tt} at={0.8} x={1460} y={960} txt="RUANDA (LO NIEGA)" col={ICE} size={36} />
    <Num tt={tt} d={0.3} x={960} y={190} txt="2024 · EL M23 Y EL COLTÁN" size={84} col={RED} />
  </>;
}}</Stage>;

// ---- 17:12 · LA RUMBA: un tocadiscos de madera; el disco de pasta gira, el brazo baja y una guitarra eléctrica se mece al ritmo; sello UNESCO 2021 ----
export const TRumba: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const arm = eio(tt, 0.6, 1.6), rot = tt * 200, seal = phys(tt, 3.6, 7, 0.4);
  return <>
    <Floor x={860} y={920} w={1000} />
    <div style={{ ...at(420, 480), width: 860, height: 420, transform: "perspective(1600px) rotateX(48deg)", transformOrigin: "50% 100%", borderRadius: 20, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", boxShadow: "0 30px 50px rgba(0,0,0,.65)" }}>
      <div style={{ ...at(70, 30), width: 360, height: 360, borderRadius: "50%", background: "repeating-radial-gradient(circle, #111 0 3px, #1e1e1e 3px 6px)", transform: `rotate(${rot}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.6)" }}>
        <div style={{ ...at(130, 130), width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,#f2c21b 0 8px,#c21f2b 9px)" }} />
        <div style={{ ...at(60, 60), width: 240, height: 60, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)", transform: "rotate(30deg)" }} />
      </div>
      <div style={{ ...at(520, 40), width: 26, height: 300, background: "linear-gradient(90deg,#999,#eee,#999)", transformOrigin: "50% 0", transform: `rotate(${lerp(10, 34, arm)}deg)`, borderRadius: 13 }} />
    </div>
    <svg width={300} height={620} style={{ ...at(1340, 280), transform: `rotate(${-14 + 5 * Math.sin(tt * 3.2)}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.6))" }}>
      <rect x={136} y={0} width={28} height={330} rx={6} fill="#5a3d22" /><rect x={126} y={0} width={48} height={60} rx={8} fill="#2a1a0c" />
      <path d="M150 300 C40 300 30 420 70 470 C20 530 60 620 150 610 C240 620 280 530 230 470 C270 420 260 300 150 300 Z" fill="#c21f2b" stroke="#6a0c12" strokeWidth={6} /><circle cx={150} cy={470} r={34} fill="#111" />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={140 + i * 4} y1={20} x2={140 + i * 4} y2={560} stroke="#ddd" strokeWidth={1.5} />)}
    </svg>
    {seal > 0.01 && <div style={{ ...at(1500, 240), transform: `translate(-50%,-50%) scale(${seal}) rotate(-10deg)`, width: 200, height: 200, borderRadius: "50%", border: "8px solid #1f5fb0", color: "#1f5fb0", background: "rgba(255,255,255,.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900 }}><div style={{ fontSize: 34 }}>UNESCO</div><div style={{ fontSize: 46 }}>2021</div></div>}
    <Num tt={tt} d={0.3} x={860} y={180} txt="RUMBA CONGOLEÑA" size={100} col={AMB} />
  </>;
}}</Stage>;

// ---- 18:04 · LA CIUDAD FLOTANTE: una barcaza larga baja el río con casitas, toldos, ollas humeando y gallinas en la cubierta ----
export const TBarge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = lerp(-200, 140, eio(tt, 0, 6)), bob = 4 * Math.sin(tt * 1.2);
  return <>
    <div style={{ ...at(0, 640), width: 1920, height: 440, background: "linear-gradient(180deg,#5a6a3a,#3a4a2a 30%,#2a3a2a)" }} />
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ ...at(-200 + ((tt * 40 + i * 600) % 2400), 700 + i * 70), width: 300, height: 6, borderRadius: 3, background: "rgba(255,255,255,.18)" }} />)}
    <div style={{ ...at(x, 520 + bob), width: 1700, height: 260 }}>
      <div style={{ ...at(0, 140), width: 1700, height: 100, clipPath: "polygon(0 0, 100% 0, 97% 100%, 2% 100%)", background: "linear-gradient(180deg,#5a5d63,#2a2c30)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ ...at(60 + i * 230, 20 + (i % 2) * 20), width: 200, height: 120 - (i % 2) * 20, background: ["#c21f2b", "#1f5fb0", "#f2c21b", "#3a8a4a"][i % 4], clipPath: "polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.2)" }} />)}
      {Array.from({ length: 12 }, (_, i) => <div key={"p" + i} style={{ ...at(100 + i * 130, 100 - (i % 3) * 6), width: 18, height: 42, borderRadius: "9px 9px 2px 2px", background: i % 2 ? "#e8dcc6" : "#a0784a" }} />)}
      {Array.from({ length: 4 }, (_, i) => <div key={"c" + i} style={{ ...at(300 + i * 360, 118 + 4 * Math.sin(tt * 6 + i)), width: 26, height: 22, borderRadius: "50% 50% 40% 40%", background: "#f4f1ea", boxShadow: "6px -6px 0 -2px #c21f2b" }} />)}
      {Array.from({ length: 3 }, (_, i) => { const k = (tt * 0.4 + i / 3) % 1; return <div key={"s" + i} style={{ ...at(560 + i * 420, 0 - k * 160), width: 60 + 60 * k, height: 60 + 60 * k, borderRadius: "50%", background: "rgba(240,240,240,.25)", filter: "blur(10px)", opacity: 1 - k }} />; })}
    </div>
    <Num tt={tt} d={0.4} x={960} y={190} txt="SEMANAS RÍO ABAJO" size={92} col={AMB} />
    <Tag tt={tt} at={1.2} x={960} y={300} txt="EL RÍO CONGO · EL MÁS PROFUNDO QUE SE CONOCE" size={30} />
  </>;
}}</Stage>;

// ---- 19:40 · LA ESCALERA: una escalera de piedra de cinco escalones; en cada uno aparece quién está y su pila de monedas, que crece a medida que se sube ----
export const TLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{() => {
  const { st, cur } = stepsOf(h, t, [[h.at + 0.3, "EL QUE CAVA"], [h.at + 1.6, "EL COMPRADOR"], [h.at + 2.9, "EXPORTADORA Y ESTADO"], [h.at + 4.2, "EL REFINADO"], [h.at + 5.5, "BATERÍAS Y APARATOS"]]);
  const PILE = [1, 3, 8, 16, 30];
  return <>
    <Floor x={960} y={960} w={1600} />
    {Array.from({ length: 5 }, (_, i) => { const x = 200 + i * 310, y = 860 - i * 130, on = i <= cur, k = on ? eio(t, st[i][0], st[i][0] + 1.0) : 0;
      return <div key={i}>
        <div style={{ ...at(x, y), width: 330, height: 960 - y, background: `linear-gradient(180deg, ${on ? "#b8ae9a" : "#6d675c"}, #3a362f)`, boxShadow: "inset 0 10px 0 rgba(255,255,255,.18), 0 20px 30px rgba(0,0,0,.5)" }} />
        {Array.from({ length: Math.round(PILE[i] * k) }, (_, j) => <div key={j} style={{ ...at(x + 120 + (j % 2) * 8, y - 18 - j * 11), width: 90, height: 16, borderRadius: "50%", background: "linear-gradient(180deg,#fff1b8,#c9952d)", border: "2px solid #8a6a1c" }} />)}
        {on && <div style={{ ...at(x + 165, y + 30), transform: "translateX(-50%)", opacity: k, fontWeight: 900, fontSize: 26, color: i === cur ? AMB : TX, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>{st[i][1]}</div>}
      </div>; })}
    <Num tt={t - h.at} d={0.3} x={960} y={150} txt="DEL POZO A TU BOLSILLO" size={90} col={AMB} />
  </>;
}}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { battery: TBattery, tenkilos: TTenKilos, vault24: TVault24, periodic: TPeriodic, mesaberlin: TMesaBerlin, deed: TDeed, rubber: TRubber,
  archivesfire: TArchivesFire, uranium: TUranium, speech: TSpeech, splitmap: TSplitMap, tooth: TTooth, leopardhat: TLeopardHat, concorde: TConcorde, ninearmies: TNineArmies, candles: TCandles,
  swisscheese: TSwissCheese, shaft: TShaft, stone: TStone, meter: TMeter, cobaltpath: TCobaltPath, roadsdeal: TRoadsDeal, bribe: TBribe, rubaya: TRubaya, rumba: TRumba, barge: TBarge, ladder: TLadder };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
const _u = [GRN, fmt];
void _u;
