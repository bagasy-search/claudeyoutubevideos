// fb5nb · el HILO: EL PISO DEL LIVING a lo largo del relato — la losa vista de arriba (en perspectiva) y EN CORTE al lado.
// Arranca terminado (el gancho «mirá este piso»), vuelve a contrapiso pelado en la prueba del nylon y va sumando capas
// con la voz: nylon → limpio → imprimación → tiras guía → paños de yeso (mojado, oscuro) → seca y aclara → lija → 3 manos
// de sellador con el brillo que corre. Sirve de RELLENO cuando no hay plano y de REPASO al final. + el CTA con QR.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, spr } from "./lib";
import { Lbl } from "./base";
import { glass } from "./kit";
import { Brillo, Capas, CONT, Losa, quad, YESO } from "./piso";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;

const estado = (t: number) => {
  const crudo = e(t, sec("PUNTO_3") - 6, sec("PUNTO_3"));          // vuelve al contrapiso pelado
  const fin = 1 - crudo;
  return {
    fin, crudo,
    nylon: crudo * e(t, sec("PUNTO_3") + 15, sec("PUNTO_3") + 25) * (1 - e(t, sec("PUNTO_4"), sec("PUNTO_4") + 8)),
    limpio: e(t, sec("PUNTO_4") + 10, sec("PUNTO_4") + 50),
    imp: e(t, sec("PUNTO_5") + 30, sec("PUNTO_5") + 60),
    guias: e(t, sec("PUNTO_7") + 25, sec("PUNTO_7") + 40) * (1 - e(t, sec("PUNTO_7") + 105, sec("PUNTO_7") + 115)),
    yeso: e(t, sec("PUNTO_7") + 45, sec("PUNTO_7") + 110),
    seco: e(t, sec("PUNTO_9") + 20, sec("PUNTO_9") + 75),
    lija: e(t, sec("PUNTO_10") + 10, sec("PUNTO_10") + 70),
    sell: e(t, sec("PUNTO_11") + 40, sec("PUNTO_11") + 120),
  };
};

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const rec = mode === "recap", s = estado(rec ? 1e5 : t), u = t - a;
  const yk = s.fin + s.crudo * s.yeso;                  // cuánto yeso hay
  const moj = s.crudo * (1 - s.seco);                   // mojado = más oscuro
  const sl = s.fin + s.crudo * s.sell;                  // sellador
  const rug = s.crudo * (1 - s.lija) * yk;              // marcas de la llana antes de lijar
  const panos = s.fin > 0.5 ? 6 : Math.floor(s.yeso * 6.99);
  const rc: [string, string][] = [["yeso común + 10 % de cola", "c1"], ["por paños: fragua en 20 min", "c2"], ["7 días de secado o más", "c3"], ["lija 80 · 150 · 220", "c4"], ["3 manos de sellador", "c5"], ["sólo lugares secos", "c6"]];
  const LX = rec ? 640 : 760, LW = rec ? 980 : 1180;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 45% 40%, #3a2c1d 0%, ${C.night} 74%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "45% 60%", transform: `translate(${20 * Math.sin(u * 0.15) + 10 * Math.sin(u * 0.08 + 2)}px,${10 * Math.sin(u * 0.12 + 1)}px) scale(${1.02 + 0.03 * Math.sin(u * 0.1 + 0.5)})` }}>
        {/* la pared del fondo con su ventana (marco y cruz) y el zócalo */}
        <rect x={LX - LW * 0.34} y={60} width={LW * 0.68} height={360} fill="#8a7a63" />
        <rect x={LX - LW * 0.34} y={60} width={LW * 0.68} height={360} fill="url(#parLuz)" />
        <defs><radialGradient id="parLuz" cx="62%" cy="45%" r="60%"><stop offset="0" stopColor="#ffe6b0" stopOpacity={0.35} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></radialGradient></defs>
        <rect x={LX + 60} y={120} width={240} height={230} fill="#ffeac0" stroke="#e9e1cf" strokeWidth={14} />
        <line x1={LX + 180} y1={120} x2={LX + 180} y2={350} stroke="#e9e1cf" strokeWidth={10} /><line x1={LX + 60} y1={235} x2={LX + 300} y2={235} stroke="#e9e1cf" strokeWidth={10} />
        <rect x={LX - LW * 0.34} y={396} width={LW * 0.68} height={24} fill="#4a3826" />
        <Losa cx={LX} y={420} w={LW} d={430} h={50} top={CONT}>
          {(f) => (
            <g>
              {/* polvo y piedritas sueltas hasta limpiar */}
              {s.crudo * (1 - s.limpio) > 0.02 && Array.from({ length: 26 }, (_, i) => { const [x, y] = f((i * 0.37) % 1, (i * 0.61) % 1); return <circle key={i} cx={x} cy={y} r={6} fill="#b4ad9f" opacity={s.crudo * (1 - s.limpio)} />; })}
              {/* nylon de la prueba */}
              {s.nylon > 0.02 && <polygon points={quad(f, 0.62, 0.25, 0.86, 0.6)} fill="rgba(235,245,255,.35)" stroke="#e8c36a" strokeWidth={8} opacity={s.nylon} />}
              {/* imprimación: brillo lechoso */}
              <polygon points={quad(f, 0, 0, 1, 1)} fill="#f3efe4" opacity={0.28 * s.imp * s.crudo} />
              {/* tiras guía */}
              {s.guias > 0.02 && [1, 2].map((i) => <line key={i} x1={f(i / 3, 0)[0]} y1={f(i / 3, 0)[1]} x2={f(i / 3, 1)[0]} y2={f(i / 3, 1)[1]} stroke="#dfe4e8" strokeWidth={8} opacity={s.guias} />)}
              {s.guias > 0.02 && <line x1={f(0, 0.5)[0]} y1={f(0, 0.5)[1]} x2={f(1, 0.5)[0]} y2={f(1, 0.5)[1]} stroke="#dfe4e8" strokeWidth={8} opacity={s.guias} />}
              {/* paños de yeso, de a uno desde el rincón del fondo */}
              {Array.from({ length: panos }, (_, i) => { const c = 2 - (i % 3), r = Math.floor(i / 3); return <polygon key={i} points={quad(f, c / 3, r / 2, (c + 1) / 3, (r + 1) / 2)} fill={YESO} />; })}
              {yk > 0.05 && <polygon points={quad(f, 0, 0, 1, 1)} fill="#6f7c88" opacity={0.42 * moj * (panos / 6)} />}
              {rug > 0.05 && Array.from({ length: 18 }, (_, i) => { const [x, y] = f(0.1 + 0.8 * ((i * 0.53) % 1), 0.08 + 0.85 * ((i * 0.29) % 1)); return <path key={i} d={`M${x - 40},${y} q40,-10 80,0`} stroke="#b7ae9c" strokeWidth={3} fill="none" opacity={rug} />; })}
              {/* sellador: tono cálido y brillo que corre */}
              <polygon points={quad(f, 0, 0, 1, 1)} fill="#ffe2a8" opacity={0.12 * sl} />
              <Brillo id="hilo" pts={quad(f, 0, 0, 1, 1)} k={((t * 0.11) % 1.4)} o={0.6 * sl} w={260} />
            </g>
          )}
        </Losa>
        {/* el corte */}
        <g transform={rec ? "translate(-60,40)" : "translate(0,0)"} opacity={rec ? 0 : 1}>
          <Capas x={1440} y={960} w={400} capas={[
            { h: 90, k: 1, tipo: "tierra" },
            { h: 120, k: 1, tipo: "cont" },
            { h: 14, k: s.fin + s.crudo * s.imp, tipo: "impr" },
            { h: 70, k: yk, tipo: "yeso", moj },
            { h: 16, k: sl, tipo: "sell" },
          ]} />
          <rect x={1440} y={640} width={400} height={320} fill="none" stroke="rgba(255,236,200,.25)" strokeWidth={3} strokeDasharray="10 8" />
          <text x={1640} y={612} textAnchor="middle" fontSize={34} fontWeight={700} fill="rgba(255,236,200,.6)" fontFamily="Barlow">EN CORTE</text>
          <text x={1862} y={800} fontSize={30} fontWeight={700} fill="rgba(255,236,200,.55)" fontFamily="Barlow">{yk > 0.3 ? "6 mm" : ""}</text>
        </g>
      </svg>
      {rec && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1260} y={210 + i * 115} col={i % 2 ? C.honey : C.ink} size={50} align="left" />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha; entra con resorte, el QR late al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["Proporción de cola y yeso", "Tiempos de fragüe y de secado", "Granos de lija y manos de sellador", "La cuenta con tus precios"];
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
