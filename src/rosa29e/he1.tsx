// rosa29e · componentes únicos 1-11 (cada uno = la frase de ese segundo, hecho objeto). Todo en código, ninguna familia de rosa29a-d.
import React from "react";
import { Stage, H, phys, cl, eio, AMB, TX, RED } from "./hkit";
import { Big, Steam, Table } from "./rkit";

export type P = { t: number; h: H };
export const sp = (tt: number, a: number, w = 6, z = 0.5) => phys(tt, a, w, z);
export const pos = (x: number, y: number, tr = "", ex: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) ${tr}`, ...ex });
export const IRON = "linear-gradient(90deg,#1c1c1e,#4a4a4f 30%,#2a2a2d 55%,#5a5a60 80%,#161618)";
export const STEW = "radial-gradient(ellipse at 40% 35%, #c9743a, #8a3a16 55%, #5a220c)";
export const KITCHEN = "radial-gradient(ellipse 80% 70% at 50% 40%, #3a2a1c, #120c08 75%)";

// olla de hierro de costado (w = ancho); fill = color del guiso a la vista por la boca
export const PotSide: React.FC<{ w?: number; fill?: string; children?: React.ReactNode }> = ({ w = 520, fill = STEW, children }) => (
  <div style={{ position: "relative", width: w, height: w * 0.62 }}>
    <div style={{ position: "absolute", left: -w * 0.07, top: w * 0.1, width: w * 0.1, height: w * 0.06, borderRadius: 12, background: "#2a2a2d" }} />
    <div style={{ position: "absolute", right: -w * 0.07, top: w * 0.1, width: w * 0.1, height: w * 0.06, borderRadius: 12, background: "#2a2a2d" }} />
    <div style={{ position: "absolute", left: 0, top: w * 0.06, width: w, height: w * 0.56, borderRadius: `0 0 ${w * 0.12}px ${w * 0.12}px`, background: IRON, boxShadow: `0 ${w * 0.06}px ${w * 0.1}px rgba(0,0,0,.55)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.14, borderRadius: "50%", background: "#3a3a3e" }} />
    <div style={{ position: "absolute", left: w * 0.04, top: w * 0.015, width: w * 0.92, height: w * 0.11, borderRadius: "50%", background: fill, overflow: "hidden" }}>{children}</div>
  </div>
);
// olla vista desde arriba (círculo con borde de hierro); children = lo que hay adentro, en coordenadas 0..d
export const PotTop: React.FC<{ d?: number; fill?: string; children?: React.ReactNode }> = ({ d = 620, fill = "#2a2420", children }) => (
  <div style={{ position: "relative", width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle, #5a5a60 0 66%, #2a2a2d 70%, #111 73%)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
    <div style={{ position: "absolute", left: d * 0.06, top: d * 0.06, width: d * 0.88, height: d * 0.88, borderRadius: "50%", background: fill, overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,0,0,.7)" }}>{children}</div>
  </div>
);
// cubo de carne (color va de crudo a dorado con c 0..1)
export const Beef: React.FC<{ s?: number; c?: number; wet?: number }> = ({ s = 90, c = 0, wet = 0 }) => {
  const r = Math.round(176 - 96 * c), g = Math.round(58 + 6 * c), b = Math.round(60 - 30 * c);
  return <div style={{ position: "relative", width: s, height: s * 0.8, borderRadius: s * 0.18, background: `linear-gradient(135deg, rgb(${r + 30},${g + 30},${b + 20}), rgb(${r},${g},${b}) 60%, rgb(${r - 40},${g - 20},${b - 10}))`,
    boxShadow: `inset 0 -${s * 0.08}px 0 rgba(0,0,0,.25), 0 ${s * 0.1}px ${s * 0.16}px rgba(0,0,0,.45), inset ${s * 0.1}px ${s * 0.1}px ${s * 0.2}px rgba(255,255,255,${0.45 * wet})` }}>
    <div style={{ position: "absolute", width: s * 0.5, height: s * 0.08, marginLeft: s * 0.2, marginTop: s * 0.3, borderRadius: 4, background: `rgba(240,230,220,${0.5 - 0.3 * c})`, transform: "rotate(-14deg)" }} />
  </div>;
};

// 1 · «Levantas la tapa… está aguado. Gris. Y la carne, cuando la pinchas, parece una suela de zapato»: la tapa sube, el tenedor pincha el cubo gris y éste se dobla como una suela, con sus pespuntes
export const SoleFork: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={KITCHEN}>{(tt) => {
  const lid = eio(tt, 0.3, 1.2), fk = eio(tt, 1.8, 2.6), bend = eio(tt, 2.6, 3.6), sole = eio(tt, 3.6, 4.6);
  return <>
    <Table y={780} />
    <div style={pos(960, 700)}><PotSide w={620} fill="radial-gradient(ellipse, #8f8a7e, #5f5a50)" /></div>
    <div style={pos(960, 590 - 260 * lid, `rotate(${-18 * lid}deg)`, { width: 640, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #5a5a60, #2a2a2d)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" })} />
    <Steam tt={tt} x={960} y={560} w={300} h={220} o={lid * 0.7} />
    <div style={pos(960, 470, `scaleY(${1 - 0.35 * bend}) rotate(${-8 * bend}deg)`, { opacity: cl(fk * 3) })}>
      <div style={{ width: 300, height: 120, borderRadius: sole > 0 ? `${150 * sole}px ${60 + 90 * sole}px ${40}px ${40}px` : 28, background: `linear-gradient(135deg, #8a7f74, #6a625a 60%, #4a443e)`, boxShadow: "0 14px 24px rgba(0,0,0,.5)",
        outline: `4px dashed rgba(240,230,210,${0.7 * sole})`, outlineOffset: -18 }} />
    </div>
    <div style={pos(1020, 300 + 150 * fk, "rotate(16deg)", { width: 26, height: 300, borderRadius: 10, background: "linear-gradient(90deg,#9aa2a8,#e8edf0,#8a9298)", opacity: cl(fk * 3) })} />
    <Big tt={tt} at={3.9} x={960} y={190} txt="UNA SUELA DE ZAPATO" size={84} col={TX} hand />
  </>;
}}</Stage>;

// 2 · «En 1964, el primer guiso que le hice a mi Antonio, recién casados»: dos alianzas ruedan por el mantel bordado y se tocan; el año aparece bordado en hilo
export const Alliances: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#efe6d4,#d8c9aa)">{(tt) => {
  const a = eio(tt, 0.2, 1.8), stitch = eio(tt, 2.0, 3.8);
  const ring = (x: number, rot: number) => <div style={pos(x, 560, `rotate(${rot}deg)`, { width: 170, height: 170, borderRadius: "50%", border: "22px solid transparent", background: "linear-gradient(#0000,#0000) padding-box, linear-gradient(135deg,#fff4c0,#d9a63a 40%,#8a6418 70%,#f2d27a) border-box", boxShadow: "0 18px 26px rgba(0,0,0,.35)" })} />;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, rgba(160,40,40,.10) 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, rgba(160,40,40,.10) 0 2px, transparent 2px 22px)" }} />
    {ring(500 + 380 * a, 720 * a)}
    {ring(1420 - 380 * a + 24 * a, -720 * a)}
    <svg width={900} height={200} style={{ position: "absolute", left: 510, top: 720 }}>
      <text x={450} y={140} textAnchor="middle" fontSize={150} fontWeight={900} fill="none" stroke="#a8282a" strokeWidth={5} strokeDasharray="14 10" pathLength={1}
        style={{ strokeDasharray: `${stitch} 1` } as React.CSSProperties}>1964</text>
    </svg>
    <Big tt={tt} at={1.9} x={960} y={220} txt="RECIÉN CASADOS" size={80} col="#6b2a14" hand />
  </>;
}}</Stage>;

// 3 · «Y al otro día, mi suegra, doña Carmen, vino a la casa con su delantal»: el delantal baja deslizándose por un gancho de la puerta, se mece y se acomoda; en el bolsillo asoma un limón
export const ApronHook: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(90deg,#6b4428,#8a5a36 50%,#5a3820)">{(tt) => {
  const d = sp(tt, 0.3, 4.2, 0.35), sw = Math.sin(tt * 2.4) * Math.exp(-tt * 0.7) * 8;
  return <>
    <div style={{ position: "absolute", left: 920, top: 0, width: 80, height: 1080, background: "linear-gradient(90deg,rgba(0,0,0,.25),transparent 30%,transparent 70%,rgba(0,0,0,.25))" }} />
    <div style={pos(960, 230, "", { width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #e8c27a, #8a6418)", boxShadow: "0 6px 10px rgba(0,0,0,.5)" })} />
    <div style={{ position: "absolute", left: 960, top: 240 - 600 * (1 - d), transformOrigin: "0 0", transform: `rotate(${sw}deg)` }}>
      <svg width={600} height={720} style={{ position: "absolute", left: -300, top: -10, overflow: "visible" }}>
        <path d="M 300 0 L 230 120 L 200 120 Q 140 200 150 330 L 110 680 Q 300 720 490 680 L 450 330 Q 460 200 400 120 L 370 120 Z" fill="#f2ead8" stroke="#c8b898" strokeWidth={4} />
        <path d="M 110 680 Q 300 720 490 680" fill="none" stroke="#a8282a" strokeWidth={10} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={150 + i * 42} y1={340} x2={130 + i * 46} y2={670} stroke="rgba(168,40,42,.35)" strokeWidth={6} />)}
        <rect x={220} y={430} width={160} height={110} rx={12} fill="#e8dcc0" stroke="#c8b898" strokeWidth={4} />
        <ellipse cx={300} cy={430} rx={46} ry={34} fill="#f2d23a" stroke="#c8a81a" strokeWidth={3} />
        <path d="M 230 120 Q 300 60 370 120" fill="none" stroke="#c8b898" strokeWidth={8} />
      </svg>
    </div>
    <Big tt={tt} at={2.2} x={1440} y={430} txt="DOÑA CARMEN" size={86} col="#fff3dc" hand />
  </>;
}}</Stage>;

// 4 · «Hoy te voy a dar los diez secretos que me enseñó doña Carmen»: un llavero de hierro con diez llaves viejas que entran de a una y tintinean; cada una lleva su número grabado
export const KeyRing10: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = sp(tt, 0.1, 5, 0.6);
  return <>
    <div style={pos(960, 330, `scale(${r})`, { width: 220, height: 220, borderRadius: "50%", border: "14px solid #8a8a90", boxShadow: "0 10px 20px rgba(0,0,0,.6), inset 0 0 0 3px #ccc" })} />
    {Array.from({ length: 10 }, (_, i) => {
      const k = sp(tt, 0.5 + i * 0.28, 7, 0.4), ang = -70 + i * 15.5, sw = Math.sin(tt * 3 + i) * 3 * Math.exp(-(tt - 0.5 - i * 0.28) * 0.8);
      return <div key={i} style={{ position: "absolute", left: 960, top: 330, transformOrigin: "0 0", transform: `rotate(${ang + sw}deg) translateY(${100 + 40 * (1 - k)}px)`, opacity: cl(k * 3) }}>
        <div style={{ position: "absolute", left: -26, top: 0, width: 52, height: 52, borderRadius: "50%", border: "10px solid #b8913c", background: "transparent" }} />
        <div style={{ position: "absolute", left: -8, top: 48, width: 16, height: 300, background: "linear-gradient(90deg,#8a6418,#e2c06a,#8a6418)" }} />
        <div style={{ position: "absolute", left: 6, top: 300, width: 40, height: 18, background: "#b8913c" }} />
        <div style={{ position: "absolute", left: 6, top: 270, width: 28, height: 14, background: "#b8913c" }} />
        <div style={{ position: "absolute", left: -18, top: 120, width: 36, transform: `rotate(${-ang}deg)`, fontWeight: 900, fontSize: 30, color: "#fff3c4", textAlign: "center", textShadow: "0 2px 6px #000" }}>{i + 1}</div>
      </div>;
    })}
    <Big tt={tt} at={3.6} x={960} y={150} txt="10 SECRETOS" size={92} col={AMB} />
  </>;
}}</Stage>;

// 5 · «Presta atención al secreto número cuatro… el que no está en ningún libro»: un sobre lacrado con un 4 en cera roja; el lacre se quiebra y por la solapa sale una luz dorada
export const WaxSeal: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#2a1c12,#0e0906)">{(tt) => {
  const e = sp(tt, 0.1, 5, 0.6), crack = eio(tt, 2.0, 2.5), flap = eio(tt, 2.5, 3.6);
  return <>
    <div style={pos(960, 600, `scale(${0.6 + 0.4 * e}) rotate(${-3 + 3 * e}deg)`, { width: 820, height: 520 })}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#efe2c4,#d4c19a)", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 520, background: `radial-gradient(ellipse at 50% 0%, rgba(255,214,120,${0.9 * flap}), transparent 60%)` }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 300, clipPath: "polygon(0 0,100% 0,50% 100%)", background: "linear-gradient(180deg,#e2d2ae,#c9b48a)", transformOrigin: "50% 0", transform: `perspective(1200px) rotateX(${-170 * flap}deg)` }} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], i) => (
        <div key={i} style={{ position: "absolute", left: 410 - 70, top: 300 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #e0503e, #9a1c14 60%, #6a0e0a)",
          clipPath: ["polygon(0 0,50% 0,50% 50%,0 50%)", "polygon(50% 0,100% 0,100% 50%,50% 50%)", "polygon(0 50%,50% 50%,50% 100%,0 100%)", "polygon(50% 50%,100% 50%,100% 100%,50% 100%)"][i],
          transform: `translate(${dx * 40 * crack}px, ${dy * 40 * crack + 200 * flap}px) rotate(${dx * 30 * crack}deg)`, opacity: 1 - flap,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, color: "#5a0a06" }}>4</div>
      ))}
    </div>
    <Big tt={tt} at={3.2} x={960} y={190} txt="EL SECRETO DE CARMEN" size={78} col={AMB} />
  </>;
}}</Stage>;

// 6 · «Tengo ochenta y un años, y llevo sesenta haciendo guisos»: la cuchara de madera nueva se gasta con los años (la punta se aplana y oscurece) mientras corre el contador 1964→2025
export const SpoonWear: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg={KITCHEN}>{(tt) => {
  const w = eio(tt, 0.6, 4.4), yr = Math.round(1964 + 61 * w), s = sp(tt, 0.1, 5, 0.6);
  return <>
    <div style={pos(960, 560, `rotate(-28deg) scale(${s})`, { width: 900, height: 200 })}>
      <div style={{ position: "absolute", left: 0, top: 78, width: 600, height: 44, borderRadius: 22, background: `linear-gradient(180deg, hsl(32,${50 - 15 * w}%,${62 - 22 * w}%), hsl(28,${45 - 15 * w}%,${42 - 18 * w}%))` }} />
      <div style={{ position: "absolute", left: 560, top: 100 - 90 + 10 * w, width: 300 - 40 * w, height: 180 - 20 * w, borderRadius: `${50 - 10 * w}% ${50 - 34 * w}% ${50 - 34 * w}% ${50 - 10 * w}%`,
        background: `radial-gradient(ellipse at 40% 40%, hsl(32,${50 - 15 * w}%,${66 - 22 * w}%), hsl(26,${45 - 10 * w}%,${40 - 20 * w}%))`, boxShadow: `inset -${30 * w}px 0 40px rgba(60,20,0,${0.6 * w})` }} />
    </div>
    <div style={pos(960, 880, "", { fontWeight: 900, fontSize: 120, color: TX, fontVariantNumeric: "tabular-nums", textShadow: "0 8px 30px rgba(0,0,0,.6)" })}>{yr}</div>
    <Big tt={tt} at={1.2} x={960} y={170} txt="60 AÑOS DE GUISOS" size={84} col={AMB} />
  </>;
}}</Stage>;

// 7 · «Secar la carne con un paño limpio, uno por uno los pedazos, hasta que estén secos al tacto»: el paño a cuadros pasa por la fila de cubos y el brillo mojado se apaga en cada uno
export const Blot: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#e9e2d4,#c9bda4)">{(tt) => {
  const x = -200 + 2400 * eio(tt, 0.6, 4.6);
  return <>
    <div style={pos(960, 640, "", { width: 1500, height: 300, borderRadius: 20, background: "linear-gradient(180deg,#f4efe4,#ddd3bf)", boxShadow: "0 30px 50px rgba(0,0,0,.25)" })} />
    {Array.from({ length: 6 }, (_, i) => { const cx = 380 + i * 232, dry = cl((x - cx) / 120);
      return <div key={i} style={pos(cx, 620)}><Beef s={150} c={0} wet={1 - dry} />
        {dry < 1 && <div style={pos(40 + 30 * (i % 2), 130 + 40 * dry, "", { width: 18, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(200,40,40,.45)", opacity: 1 - dry })} />}
      </div>; })}
    <div style={pos(x, 560, `rotate(${-6 + 4 * Math.sin(tt * 3)}deg)`, { width: 380, height: 280, borderRadius: 18, background: "repeating-linear-gradient(0deg, rgba(180,40,40,.6) 0 18px, transparent 18px 40px), repeating-linear-gradient(90deg, rgba(180,40,40,.6) 0 18px, transparent 18px 40px), #f6f1e6", boxShadow: "0 30px 40px rgba(0,0,0,.35)" })} />
    <Big tt={tt} at={2.2} x={960} y={200} txt="SECA, PEDAZO POR PEDAZO" size={76} col="#6b2a14" hand />
  </>;
}}</Stage>;

// 8 · «Cuando la carne suena. Tiene que chisporrotear fuerte»: de la olla sale la onda de sonido; cuando la carne toca, la onda salta alta y apretada; un cubo mojado sólo dibuja una línea plana
export const SoundWave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #060404 75%)">{(tt) => {
  const hit = eio(tt, 0.8, 1.1), dead = eio(tt, 3.4, 3.8);
  const A = (x: number) => (hit * (1 - dead) * 120 + dead * 6) * Math.sin(x * 0.09 + tt * 14) * Math.sin(x * 0.013 + tt * 3) * Math.exp(-Math.abs(x - 600) / 700);
  const d = Array.from({ length: 121 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 10} ${160 + A(i * 10)}`).join(" ");
  return <>
    <div style={pos(960, 820)}><PotSide w={560} fill="radial-gradient(ellipse, #7a3a1c, #3a1a0a)" /></div>
    <div style={pos(960 - 60, 800 - 40 * (1 - hit), "", { opacity: cl(tt * 2) })}><Beef s={110} c={0.2} /></div>
    <svg width={1200} height={320} style={{ position: "absolute", left: 360, top: 330, overflow: "visible" }}>
      <path d={d} fill="none" stroke={dead > 0.5 ? "#9aa0a6" : AMB} strokeWidth={8} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${18 * hit * (1 - dead)}px ${AMB})` }} />
    </svg>
    <Big tt={tt} at={1.2} x={960} y={190} txt="TIENE QUE SONAR" size={88} col={AMB} />
    {dead > 0.3 && <Big tt={tt} at={3.6} x={960} y={300} txt="si no suena: fría o mojada" size={52} col="#c9ced2" hand />}
  </>;
}}</Stage>;

// 9 · «Esos diez minutos son la diferencia entre un guiso triste y uno que te hace cerrar los ojos»: un poste con dos carteles de madera; la flecha de 10 minutos gira y elige el camino bueno
export const Signpost: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#9ec4dc,#e4d8b8 62%,#8a7a50 63%,#5e5232)">{(tt) => {
  const pole = sp(tt, 0.1, 5, 0.5), a = sp(tt, 0.6, 7, 0.45), b = sp(tt, 1.0, 7, 0.45), pick = eio(tt, 2.4, 3.4);
  const board = (y: number, txt: string, dir: number, s: number, lit: number) => <div style={pos(960 + dir * 230, y, `rotate(${dir * (4 - 4 * s)}deg) scaleX(${s})`, { width: 440, height: 110, background: "linear-gradient(180deg,#a87a4a,#7a5230)", clipPath: dir > 0 ? "polygon(0 0,88% 0,100% 50%,88% 100%,0 100%)" : "polygon(12% 0,100% 0,100% 100%,12% 100%,0 50%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", fontWeight: 900, fontSize: 40, color: lit ? "#fff3c4" : "#3a2414", boxShadow: `0 0 ${50 * lit}px rgba(255,200,100,${lit})`, filter: `brightness(${1 + 0.4 * lit})` })}>{txt}</div>;
  return <>
    <div style={pos(960, 760 - 200 * pole, "", { width: 36, height: 700, background: "linear-gradient(90deg,#5a3a1e,#8a6038,#5a3a1e)" })} />
    {board(400, "GUISO TRISTE", -1, a, 0)}
    {board(560, "CERRAR LOS OJOS", 1, b, pick)}
    <div style={pos(960, 260, `rotate(${-120 + 210 * pick}deg)`, { width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#fff8e8,#e4d8bc)", border: "8px solid #5a3a1e", opacity: cl(pole * 2) })}>
      <div style={{ position: "absolute", left: 82, top: 18, width: 16, height: 76, background: RED, borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 0, top: 120, width: 180, textAlign: "center", fontWeight: 900, fontSize: 26, color: "#3a2414", transform: `rotate(${120 - 210 * pick}deg)` }}>10 MIN</div>
    </div>
  </>;
}}</Stage>;

// 10 · «La cebolla picada fina con una pizca de sal… hasta que esté blanda, transparente y dorada»: una rodaja de cebolla a contraluz pasa de blanca opaca a transparente (la luz la atraviesa) y después a dorada
export const Backlight: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 50%, #3a2c1c, #070504 70%)">{(tt) => {
  const tr = eio(tt, 0.8, 2.8), gold = eio(tt, 3.0, 4.6), s = sp(tt, 0.1, 5, 0.6);
  return <>
    <div style={pos(960, 560, "", { width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,236,190,${0.25 + 0.6 * tr}), transparent 65%)` })} />
    <svg width={640} height={640} style={{ position: "absolute", left: 640, top: 240, transform: `scale(${s})` }}>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={320} cy={320} r={300 - i * 42} fill="none"
        stroke={`hsla(${42 - 6 * gold},${30 + 55 * gold}%,${88 - 30 * gold}%,${1 - 0.65 * tr + 0.4 * gold})`} strokeWidth={30 - i * 2} />)}
    </svg>
    <Big tt={tt} at={1.6} x={960} y={160} txt="BLANDA Y TRANSPARENTE" size={80} col={TX} />
    {gold > 0.2 && <Big tt={tt} at={3.2} x={960} y={950} txt="y después, dorada" size={60} col={AMB} hand />}
  </>;
}}</Stage>;

// 11 · «La cebolla tiene azúcar adentro, y con el fuego lento ese azúcar sale y se carameliza»: lente de lupa redonda sobre la cebolla: adentro de las células aparecen cristales de azúcar que se funden en ámbar
export const Microscope: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#141210,#060505)">{(tt) => {
  const lens = sp(tt, 0.2, 5, 0.55), cry = eio(tt, 1.0, 2.4), melt = eio(tt, 2.8, 4.6);
  return <>
    <div style={pos(960, 560, `scale(${lens})`, { width: 680, height: 680, borderRadius: "50%", overflow: "hidden", border: "26px solid #2a2a2d", boxShadow: "0 0 0 6px #6a6a70, 0 40px 80px rgba(0,0,0,.7)", background: "#f2ecd0" })}>
      {Array.from({ length: 20 }, (_, i) => { const x = (i % 5) * 140 - 20 + ((i / 5 | 0) % 2) * 60, y = (i / 5 | 0) * 170 - 10;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 180, borderRadius: "40% 50% 45% 55%", border: "4px solid rgba(160,150,110,.6)", background: `hsla(${44 - 14 * melt},${40 + 50 * melt}%,${88 - 38 * melt}%,1)` }}>
          {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30 + k * 34, top: 50 + (k * 37 + i * 13) % 60, width: 20 * cry * (1 - melt * 0.6), height: 20 * cry * (1 - melt * 0.6), background: `rgba(255,255,255,${0.95 - 0.5 * melt})`, transform: `rotate(45deg)`, boxShadow: "0 0 8px #fff" }} />)}
        </div>; })}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 40%)" }} />
    </div>
    <Big tt={tt} at={1.2} x={960} y={140} txt="AZÚCAR ADENTRO" size={88} col={TX} />
    {melt > 0.2 && <Big tt={tt} at={3.0} x={960} y={970} txt="con fuego lento, caramelo" size={58} col={AMB} hand />}
  </>;
}}</Stage>;
