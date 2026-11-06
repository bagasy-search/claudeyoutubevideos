// fb5nc · el HILO: EL PATIO DEL FONDO a lo largo del relato — el patio en perspectiva contra la pared de la casa y el
// terreno EN CORTE al lado. Arranca de tierra con charcos y va cambiando con la voz: estacas e hilo → se saca la tierra
// negra → pendiente → fondo compactado → tablas del encofrado → primera capa → segunda capa → regla → juntas → telgopor
// contra la pared → nylon y riego siete días → curado, claro y parejo. Sirve de RELLENO cuando no hay plano y de REPASO al
// final. + el CTA con QR.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, spr, hash } from "./lib";
import { Lbl } from "./base";
import { glass } from "./kit";
import { BARRO, Capas, Charcos, CLARA, Juntas, Losa, MAD, quad, SC, SCM, SCS, Brillo } from "./piso";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;

const estado = (t: number) => {
  const p5 = sec("PUNTO_5"), p6 = sec("PUNTO_6"), p9 = sec("PUNTO_9"), p10 = sec("PUNTO_10"), p11 = sec("PUNTO_11"), cu = sec("LA_CUENTA_DEL_METRO_CUADRADO");
  return {
    marca: e(t, p5 + 4, p5 + 12),
    negra: e(t, p5 + 18, p5 + 34),           // se sacó la tierra negra
    pend: e(t, p5 + 34, p5 + 55),
    fondo: e(t, p5 + 58, p5 + 75),
    tablas: e(t, p6 + 2, p6 + 16),
    c1: e(t, p9 + 12, p9 + 30),
    c2: e(t, p9 + 50, p9 + 66),
    regla: e(t, p9 + 72, p9 + 86),
    juntas: e(t, p10 + 40, p10 + 80),
    telg: e(t, p10 + 125, p10 + 140),
    nylon: e(t, p11 + 30, p11 + 42) * (1 - e(t, cu - 6, cu)),
    riego: t > p11 + 44 && t < cu - 6 ? 1 : 0,
    cura: e(t, p11 + 20, cu),               // de mojado oscuro a curado claro
  };
};

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, m, mode }) => {
  const rec = mode === "recap", s = estado(rec ? 1e5 : t), u = t - a;
  const sc = cl(s.c1 * 0.5 + s.c2 * 0.5);                 // cuánto suelo cemento hay
  const moj = sc * (1 - s.cura);
  const barro = 1 - s.negra;
  const top = sc > 0.02 ? SC : s.negra > 0.5 ? CLARA : BARRO;
  const rc: [string, string][] = [["tierra limpia y tamizada", "c1"], ["1 de cemento cada 8", "c2"], ["la bola que se parte", "c3"], ["dos capas, con pendiente", "c4"], ["juntas cada 2,5 m", "c5"], ["7 días bajo nylon", "c6"], ["≈ US$ 4 el m²", "c7"]];
  const LX = rec ? 620 : 760, LW = rec ? 980 : 1180;
  const gota = ((t * 0.8) % 1);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 45% 40%, #3a2c1d 0%, ${C.night} 74%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "45% 60%", transform: `translate(${20 * Math.sin(u * 0.15) + 10 * Math.sin(u * 0.08 + 2)}px,${10 * Math.sin(u * 0.12 + 1)}px) scale(${1.02 + 0.03 * Math.sin(u * 0.1 + 0.5)})` }}>
        <defs><linearGradient id="cielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7fa6c4" /><stop offset="1" stopColor="#d9c9a8" /></linearGradient>
          <radialGradient id="parLuz" cx="40%" cy="30%" r="70%"><stop offset="0" stopColor="#ffe6b0" stopOpacity={0.3} /><stop offset="1" stopColor="#000" stopOpacity={0.3} /></radialGradient></defs>
        {/* la pared de la casa al fondo: revoque, puerta, ventana y la canaleta */}
        <rect x={LX - LW * 0.36} y={70} width={LW * 0.72} height={352} fill="#a89377" />
        <rect x={LX - LW * 0.36} y={70} width={LW * 0.72} height={352} fill="url(#parLuz)" />
        <rect x={LX - LW * 0.36} y={62} width={LW * 0.72} height={16} fill="#5d4a36" />
        <rect x={LX - 210} y={190} width={130} height={232} fill="#6b4a2b" stroke="#4a321c" strokeWidth={8} /><circle cx={LX - 100} cy={310} r={7} fill="#d8b860" />
        <rect x={LX + 40} y={150} width={220} height={150} fill="url(#cielo)" stroke="#e9e1cf" strokeWidth={12} />
        <line x1={LX + 150} y1={150} x2={LX + 150} y2={300} stroke="#e9e1cf" strokeWidth={8} />
        {/* telgopor contra la pared */}
        {s.telg > 0.02 && <rect x={LX - LW * 0.34} y={412} width={LW * 0.68 * s.telg} height={12} fill="#f6f5ef" stroke="#cfcac0" strokeWidth={2} />}
        <Losa cx={LX} y={422} w={LW} d={430} h={58} top={top} side={sc > 0.02 ? SCM : "#4a3420"} grano={sc > 0.02 ? 70 : 30}>
          {(f) => (
            <g>
              {/* barro con charcos y pasto ralo hasta sacar la tierra negra */}
              <Charcos f={f} o={barro} />
              {barro > 0.05 && Array.from({ length: 22 }, (_, i) => { const [x, y] = f(hash(i, 71), hash(i, 72)); return <path key={i} d={`M${x},${y} l-6,-18 M${x},${y} l4,-20 M${x},${y} l12,-14`} stroke="#6f8a3c" strokeWidth={3} opacity={barro} />; })}
              {/* compactado del fondo: huellas del pisón */}
              {s.fondo > 0.05 && sc < 0.3 && Array.from({ length: 20 }, (_, i) => { const uu = (i % 5) / 5 + 0.1, vv = Math.floor(i / 5) / 4 + 0.12; return i / 20 < s.fondo && <polygon key={i} points={quad(f, uu - 0.07, vv - 0.08, uu + 0.07, vv + 0.08)} fill="rgba(70,48,28,.25)" />; })}
              {/* mojado del suelo cemento recién compactado */}
              {sc > 0.02 && <polygon points={quad(f, 0, 0, 1, 1)} fill="#5f5548" opacity={0.45 * moj} />}
              {sc > 0.02 && sc < 0.99 && <polygon points={quad(f, 0, 0, 1, 1 - sc)} fill={CLARA} />}
              {/* la regla dejó la superficie cerrada: brillo que corre */}
              {s.regla > 0.05 && <Brillo id="hreg" pts={quad(f, 0, 0, 1, 1)} k={((t * 0.09) % 1.4)} o={0.32 * s.regla} w={240} />}
              {/* juntas: 3 × 2 paños */}
              <Juntas f={f} nu={3} nv={2} k={s.juntas} col={s.cura > 0.6 ? "#7d7263" : "#4b4238"} />
              {/* tablas del encofrado: el borde de madera */}
              {s.tablas > 0.02 && <polygon points={quad(f, 0, 0, 1, 1)} fill="none" stroke={MAD} strokeWidth={14} opacity={s.tablas * (1 - s.cura * 0.9)} />}
              {/* nylon de obra con ladrillos en los bordes */}
              {s.nylon > 0.02 && <g opacity={s.nylon}><polygon points={quad(f, -0.02, -0.02, 1.02, 1.02)} fill="rgba(28,32,36,.78)" />
                {[0.08, 0.5, 0.92].map((uu) => [0.03, 0.97].map((vv) => { const [x, y] = f(uu, vv); return <rect key={uu + "" + vv} x={x - 40} y={y - 18} width={80} height={32} rx={4} fill="#b4552f" />; }))}
                <Brillo id="hny" pts={quad(f, 0, 0, 1, 1)} k={((t * 0.13) % 1.4)} o={0.3} w={160} /></g>}
              {/* riego: lluvia fina sobre el nylon levantado */}
              {s.riego > 0 && Array.from({ length: 30 }, (_, i) => { const [x, y] = f(hash(i, 81), 0.1 + 0.8 * hash(i, 82)), ph = (gota + hash(i, 83)) % 1; return <line key={i} x1={x} y1={y - 160 + ph * 150} x2={x} y2={y - 140 + ph * 150} stroke="#a9dcff" strokeWidth={4} opacity={0.8 * (1 - ph)} />; })}
            </g>
          )}
        </Losa>
        {/* estacas e hilo con la pendiente */}
        {s.marca > 0.02 && sc < 0.5 && <g opacity={s.marca * (1 - s.tablas)}>
          {[[LX - LW * 0.5, 852], [LX + LW * 0.5, 852]].map(([x, y], i) => <rect key={i} x={x - 10} y={y - 150} width={20} height={150} fill={MAD} />)}
          <line x1={LX - LW * 0.5} y1={712} x2={LX + LW * 0.5} y2={712 + 26 * s.pend} stroke="#ffd27a" strokeWidth={4} />
        </g>}
        {/* el corte */}
        <g opacity={rec ? 0 : 1}>
          <Capas x={1450} y={980} w={400} capas={[
            { h: 150, k: 1, tipo: "clara" },
            { h: 40, k: s.fondo, tipo: "base" },
            { h: 70, k: s.c1, tipo: "sc", moj },
            { h: 70, k: s.c2, tipo: "sc", moj },
            { h: 10, k: s.nylon, tipo: "nylon" },
          ]} />
          {/* la tierra negra que se va */}
          <Capas x={1450} y={830 - 0 * s.negra} w={400} capas={[{ h: 110, k: 1 - s.negra, tipo: "negra" }]} seed={5} />
          <rect x={1450} y={640} width={400} height={340} fill="none" stroke="rgba(255,236,200,.25)" strokeWidth={3} strokeDasharray="10 8" />
          <text x={1650} y={612} textAnchor="middle" fontSize={34} fontWeight={700} fill="rgba(255,236,200,.6)" fontFamily="Barlow">EN CORTE</text>
          <text x={1872} y={790} fontSize={30} fontWeight={700} fill="rgba(255,236,200,.55)" fontFamily="Barlow">{sc > 0.6 ? "10 cm" : ""}</text>
        </g>
      </svg>
      {rec && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1230} y={170 + i * 112} col={i % 2 ? C.honey : C.ink} size={48} align="left" />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha; entra con resorte, el QR late al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["La prueba del frasco y del puño", "Proporción y espesor", "Juntas y días de curado", "La cuenta con tus precios"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 920, ...glass(1.2), background: "rgba(30,20,10,.88)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.honey, textTransform: "uppercase" }}>la guía</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 300, height: 300, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
