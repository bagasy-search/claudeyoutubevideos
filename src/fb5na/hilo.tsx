// fb5na · el HILO: LA PARED DEL DORMITORIO en sus estados a lo largo del relato — de frente (mancha, ampollas, salitre,
// después revoque pelado, después cristalizante y pintura a la cal) y EN CORTE al lado (el agua que entra de costado desde la
// jardinera del vecino, los cristales que crecen desde adentro, el vapor que sale). Sirve de RELLENO cuando no hay plano y
// de REPASO al final. + el CTA: tarjeta grande con QR encima de lo que haya.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, hash, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { glass } from "./kit";
import { Ampollas, Corte, H2O, LAD2, Mancha, Muro, Salitre } from "./pared";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;

// cómo está la pared a esta altura del relato
const estado = (t: number) => {
  const cris = e(t, sec("PUNTO_9") + 30, sec("PUNTO_10") + 40);
  return {
    mancha: 1 - 0.85 * e(t, sec("QUÉ_ESPERAR_LAS_PRIMERAS_SEMANAS"), sec("PUNTO_11") + 60),
    amp: 1 - e(t, sec("PUNTO_7"), sec("PUNTO_7") + 30),          // la pintura inflada se raspa
    sal: 1 - e(t, sec("PUNTO_8"), sec("PUNTO_8") + 40),           // el salitre se lava
    gris: e(t, sec("PUNTO_9") + 60, sec("PUNTO_9") + 120),         // la capa de cristalizante
    cal: e(t, sec("PUNTO_11") + 30, sec("PUNTO_11") + 60),          // pintura a la cal encima
    cris, vapor: e(t, sec("PUNTO_9") + 40, sec("PUNTO_9") + 60),
    jard: e(t, sec("PUNTO_5") - 20, sec("PUNTO_5")),               // aparece la jardinera del vecino
    corre: e(t, sec("PUNTO_6") + 30, sec("PUNTO_6") + 50),          // la corrió y le puso nylon
  };
};

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const s = estado(mode === "recap" ? 1e5 : t), u = t - a, rec = mode === "recap";
  const agua = 1 - 0.55 * s.corre;
  const rc: [string, string][] = [["diagnóstico: aluminio y línea", "diag"], ["la causa, del otro lado", "causa"], ["raspar sin romper", "raspa"], ["salitre en seco y vinagre", "lava"], ["cristalizante en pared húmeda", "cris"], ["pintura que respira", "pint"]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #33281b 0%, ${C.night} 72%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "50% 55%", transform: `translate(${22 * Math.sin(u * 0.17) + 12 * Math.sin(u * 0.09 + 2)}px,${12 * Math.sin(u * 0.13 + 1)}px) scale(${1.03 + 0.03 * Math.sin(u * 0.11 + 0.5)})` }}>
        {/* la pared de frente */}
        <g transform={rec ? "translate(20,130) scale(.55)" : "translate(0,0)"}>
          <Muro x={220} y={200} w={760} h={680} pint={s.cal > 0.5 ? "#f7f4ec" : "#ece6d8"}>
            <rect x={220} y={200} width={760} height={634} fill="#cfc8b8" opacity={(1 - s.amp) * (1 - s.cal)} />
            <rect x={220} y={200} width={760} height={634} fill="#8f8a80" opacity={s.gris * (1 - s.cal) * 0.85} />
            <rect x={220} y={200} width={760} height={634} fill="#f7f4ec" opacity={s.cal} />
            <Mancha cx={640} cy={520} rx={170} ry={300} k={s.mancha} seed={301} />
            <Ampollas x={500} y={300} w={300} h={420} k={s.amp} />
            <Salitre x={480} y={830} w={320} k={s.sal} />
          </Muro>
        </g>
        {/* la pared en corte con lo que hay del otro lado */}
        <g transform={rec ? "translate(-280,140) scale(.7)" : "translate(0,0)"}>
          <Corte t={t} x={1180} y={220} w={300} h={640} agua={agua} cris={s.cris} vapor={s.vapor} poros />
          <rect x={1060} y={220} width={120} height={640} fill="rgba(255,236,200,.05)" />
          <g opacity={s.jard} transform={`translate(${1500 + 110 * s.corre},0)`}>
            <rect x={0} y={700} width={300} height={170} fill="#9b4b2c" stroke="#5e3a1c" strokeWidth={5} />
            <rect x={6} y={690} width={288} height={24} fill="#4a3220" />
            {[30, 90, 150, 210, 270].map((x, i) => <g key={x}><line x1={x} y1={690} x2={x} y2={610 - 20 * hash(i, 3)} stroke="#4c8a3c" strokeWidth={7} /><circle cx={x} cy={600 - 20 * hash(i, 3)} r={20} fill={i % 2 ? "#e05a7a" : "#d8354a"} /></g>)}
          </g>
          {s.corre > 0 && <rect x={1490} y={600} width={10} height={270} fill="rgba(235,240,255,.85)" opacity={s.corre} />}
          {s.jard < 0.5 && <text x={1640} y={560} textAnchor="middle" fontSize={140} fontWeight={800} fill="rgba(255,236,200,.18)" fontFamily="Barlow Condensed">?</text>}
          <rect x={1060} y={870} width={760} height={14} fill="#4a3624" />
        </g>
      </svg>
      {rec && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1180} y={200 + i * 120} col={i % 2 ? C.honey : C.ink} size={48} align="left" />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha (encima del avatar o del plano); entra con resorte, el QR late una vez al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["Las 3 pruebas de la humedad", "La canaleta paso a paso", "Proporciones y tiempos de secado", "Hoja de compras"];
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
