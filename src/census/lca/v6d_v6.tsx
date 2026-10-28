// v6d · vuelta 6 de lc01 (P50, P53, P54, P56): piezas nuevas (sólo las usa lc01_planos2).
// - Num32V6: el «32°F» del arranque: se tacha y SALE ENTERO (cae + fundido de 6 cuadros) antes de que entre el gráfico. Nunca queda fantasma.
// - GraficoFrioV6: COLDEST NIGHTS grande (≈1100 × 600, en el cielo): 6 barras que bajan de a una hasta −30; la última ROJA con «−30°F» grande.
//   Todas dibujadas en ~1 s desde `desde`; `marca` = JAN-FEB se encierra y la roja late; `bajo` = el área bajo cero se tiñe.
// - General54V6: el apagón en UN general desde el puente: Theo de ESPALDAS en primer término (≈45 % del alto), la ciudad de enfrente
//   prendida; las farolas del puente se apagan, el faro, y la OLA barrio por barrio de izquierda a derecha (16 barrios, 8 cuadros
//   entre uno y otro, fundido de 5), centrada para que en la mitad del plano esté a medio camino.
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { F_HUD } from "../../anikit/pantalla";
import { PAL } from "../elenco";
import { FRIO } from "../hud";
import { tw } from "./lc01_planos2_comp";
import { PuenteV3 } from "./v3d_v3";
import { fundidoLuz, OlaApagon } from "./v4d_v4";
import { EspaldaPj } from "./v5b_v5";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ROJO = "#ff5a4a";

const sh = (t: string, x: number, y: number, tam: number, c: string, anchor: "start" | "middle" | "end" = "middle", peso = 600) => (
  <g>
    <text x={x + 3} y={y + 4} textAnchor={anchor} fontFamily={F_HUD} fontWeight={peso} fontSize={tam} letterSpacing={2} fill="#05060c" opacity={0.75}>{t}</text>
    <text x={x} y={y} textAnchor={anchor} fontFamily={F_HUD} fontWeight={peso} fontSize={tam} letterSpacing={2} fill={c}>{t}</text>
  </g>
);

// ---------------------------------------------------------------- 32°F (pantalla): entra con resorte, se tacha en `cambia`, cae y se va
export const Num32V6: React.FC<{ x: number; y: number; desde: number; cambia: number; rotulo?: string }> = ({ x, y, desde, cambia, rotulo }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const fin = cambia + 14;
  if (f < desde || f >= fin) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 150 } });
  const tacha = tw(f, cambia, cambia + 7, 0, 1);
  const sale = interpolate(f, [cambia + 7, fin - 1], [0, 1], { ...CL, easing: (t) => t * t });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, ${sale * 120}px) scale(${0.6 + 0.4 * s})`, transformOrigin: "50% 40%", opacity: Math.min(1, (f - desde) / 6) * (1 - sale), textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: F_HUD, fontWeight: 600, fontSize: 170, lineHeight: 1, color: "#e8dcc0", textShadow: "0 5px 0 rgba(0,0,0,0.45), 0 0 34px rgba(0,0,0,0.35)" }}>
        32°F
        {tacha > 0 && <div style={{ position: "absolute", left: -12, top: 76, width: `${(tacha * 108).toFixed(1)}%`, height: 16, borderRadius: 8, background: "#e2483a" }} />}
      </div>
      {rotulo && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 38, letterSpacing: 4, color: "#f6ecd2", marginTop: 8, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{rotulo}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- COLDEST NIGHTS grande (pantalla)
// (x, y) = esquina sup-izq; ancho = 6 × paso. Las barras entran de a una cada `cada` cuadros (resorte); la última es la roja.
const MESES6: [string, number][] = [["SEP", 34], ["OCT", 18], ["NOV", -2], ["DEC", -18], ["JAN", -28], ["FEB", -30]];
export const GraficoFrioV6: React.FC<{ x: number; y: number; desde: number; marca: number; bajo: number; paso?: number; k?: number; cada?: number }> = ({ x, y, desde, marca, bajo, paso = 180, k = 7.6, cada = 4 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const W = paso * 6;
  const top = 46; // título
  const cero = top + 40 + 34 * k; // eje del cero
  const H = cero + 30 * k + 120;
  const tIn = spring({ frame: f - desde, fps, config: { damping: 16, stiffness: 160 } });
  const bw = paso * 0.6;
  const cx = (i: number) => i * paso + paso / 2;
  const ult = MESES6.length - 1;
  const aUlt = desde + 4 + ult * cada;
  const sUlt = f < aUlt ? 0 : spring({ frame: f - aUlt, fps, config: { damping: 11, stiffness: 150 } });
  const cerco = tw(f, marca, marca + 12, 0, 1);
  const late = f > marca ? 1 + 0.06 * Math.max(0, Math.sin(((f - marca) / 30) * Math.PI * 2.2)) * Math.max(0, 1 - (f - marca) / 70) : 1;
  const tinte = tw(f, bajo, bajo + 12, 0, 1);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: W, height: H, overflow: "visible", opacity: Math.min(1, (f - desde) / 5) }} viewBox={`0 0 ${W} ${H}`}>
      <g transform={`translate(0,${(1 - tIn) * 18})`}>{sh("COLDEST NIGHTS · DULUTH (°F)", W / 2, top, 44, "#f6ecd2")}</g>
      {/* el área bajo cero se tiñe de frío en «below zero» */}
      {tinte > 0 && <rect x={-20} y={cero} width={W + 40} height={30 * k + 20} rx={14} fill={FRIO} opacity={0.14 * tinte} />}
      <line x1={-20} y1={cero} x2={W * Math.min(1, tIn * 1.2) + 20} y2={cero} stroke="#f6ecd2" strokeWidth={5} strokeLinecap="round" />
      {sh("0°", -34, cero + 12, 34, "#f6ecd2", "end")}
      {tinte > 0 && <g opacity={tinte}>{sh("BELOW ZERO", paso, cero + 30 * k - 30, 34, FRIO)}</g>}
      {MESES6.map(([m, v], i) => {
        const a = desde + 4 + i * cada;
        const s = f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 13, stiffness: 160 } });
        if (s <= 0) return null;
        const esUlt = i === ult;
        const h = v * k * s * (esUlt ? late : 1);
        const c = esUlt ? ROJO : v < 0 ? FRIO : "#e8dcc0";
        const xx = cx(i) - bw / 2;
        const neg = v < 0;
        return <g key={m}>
          <rect x={xx} y={neg ? cero : cero - h} width={bw} height={Math.max(4, Math.abs(h))} rx={10} fill={c} opacity={esUlt ? 1 : 0.86} />
          {/* rótulo del mes: del lado opuesto a la barra, pegado al eje */}
          {sh(m, cx(i), neg ? cero - 16 : cero + 42, 32, esUlt ? ROJO : "#e8dcc0")}
          {/* valor: en la punta de la barra (la roja lleva el número grande aparte) */}
          {!esUlt && s > 0.5 && sh(`${v}°`, cx(i), neg ? cero + Math.abs(h) + 38 : cero - h - 14, 32, "#f6ecd2")}
        </g>;
      })}
      {/* −30°F grande bajo la barra roja */}
      {sUlt > 0.05 && <g transform={`translate(${cx(ult)},${cero + 30 * k + 84}) scale(${0.5 + 0.5 * sUlt})`}>{sh("−30°F", 0, 0, 84, ROJO, "middle", 700)}</g>}
      {/* JAN-FEB encerrados en «January» */}
      {cerco > 0 && <g opacity={cerco}>
        <rect x={cx(ult - 1) - bw / 2 - 20} y={cero - 58} width={paso + bw + 100} height={30 * k + 160} rx={16} fill="none" stroke="#ffffff" strokeWidth={5} strokeDasharray={`${(paso + bw + 100 + 30 * k + 160) * 2 * cerco} 4000`} />
      </g>}
    </svg>
  );
};

// ---------------------------------------------------------------- 54 · el apagón en UN general (Theo de espaldas en primer término)
// f0Ola = cuadro en que se apaga el 1er barrio; n barrios cada `paso` cuadros (izq → der) con fundido de `fade`.
export const General54V6: React.FC<{ k: (t: number) => number; hasta: number; f0Ola: number; n?: number; paso?: number; fade?: number }> = ({ k, hasta, f0Ola, n = 16, paso = 8, fade = 5 }) => {
  const f = useF();
  // farolas del puente: se apagan en «goes out» (fundido de 5) · faro del muelle en «the streetlights» (titila y se apaga)
  const kF = k(394.1), kFaro = k(395.84);
  const farolas = fundidoLuz(f, [[kF, 1], [kF + 3, 0.35], [kF + 5, 0.8], [kF + 10, 0]]);
  const faro = f < kFaro ? 1 : f < kFaro + 3 ? 0 : f < kFaro + 5 ? 1 : 0;
  const cl = [mira(0, 1180, 600, 1.25), mira(hasta, 1200, 604, 1.33, { curva: "inout" })];
  const esc = (vivo: boolean) => (
    <Escena Set={PuenteV3} pal={PAL} seed={254} setProps={{ hora: "noche", luces: faro, farolas, nieve: 1, vapor: 0.8, cae: true, ciudad: true, apagaDesde: vivo ? 1e9 : -1e9, hospital: vivo ? 1 : 0 }} claves={cl} />
  );
  // Theo de espaldas: se sobresalta con las farolas; la cabeza sigue la ola de izq a der; se hunde en «the whole city»
  const ola = tw(f, f0Ola, f0Ola + n * paso, 0, 1, (t) => t);
  const salto = Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - kF) / 10)) * Math.PI));
  const hunde = tw(f, k(398.78), k(398.78) + 14, 0, 1);
  const lad = tw(f, k(395.0), k(395.6), 0, -6) + ola * 16 - 8 * tw(f, f0Ola - 14, f0Ola, 0, 1) * (1 - ola);
  const X = 640 + 10 * hunde, Y = 830 + 26 * hunde - 14 * salto;
  const vaho = ((f + 9) % 46) / 46;
  return (
    <AbsoluteFill>
      <OlaApagon on={esc(true)} off={esc(false)} f0={f0Ola} n={n} paso={paso} fade={fade} x0={0} x1={1920} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* vaho de la respiración, del lado de la cara (a la derecha de la cabeza) */}
        <ellipse cx={X + 90 + vaho * 70} cy={Y - 150 - vaho * 40} rx={18 + vaho * 40} ry={12 + vaho * 24} fill="#e8ecff" opacity={0.32 * (1 - vaho) * (vaho > 0.05 ? 1 : vaho / 0.05)} />
        <EspaldaPj x={X} y={Y} s={1.05} tipo="theo" abrigo="#6e351c" bufanda="#efe3c8" ladeo={lad} dx={lad * 0.8} respira={2.4 * Math.sin(f * 0.08) + 6 * salto} />
      </svg>
    </AbsoluteFill>
  );
};
