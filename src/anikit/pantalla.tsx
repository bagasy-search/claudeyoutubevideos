// Recursos fijos en pantalla que llevan el concepto (van FUERA del Plano: no se mueven con la cámara).
// Contador «SEEN 1,388 / KNOWN 0», «DAY 15», temporizador, fracción 47/47, número gigante, texto a mano,
// globos de diálogo, píldora de dato y nota de fuente. Tipografías redondas como las referencias.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont as fredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { loadFont as patrick } from "@remotion/google-fonts/PatrickHand";
import { useF } from "./camara";

export const F_HUD = fredoka("normal", { weights: ["500", "600"], subsets: ["latin"] }).fontFamily;
export const F_MANO = caveat("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
export const F_GLOBO = patrick("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const sombraTxt = "0 2px 0 rgba(0,0,0,0.35), 0 0 18px rgba(0,0,0,0.45)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// valor numérico en el tiempo: cada cambio rueda en `d` cuadros (ease-out); devuelve también el "pop" del cambio
export const valorEn = (cl: { f: number; v: number; d?: number }[], f: number) => {
  let v = cl[0].v, pop = 0;
  for (let i = 1; i < cl.length; i++) {
    const k = cl[i];
    if (f < k.f) break;
    const d = k.d ?? 14;
    const u = interpolate(f, [k.f, k.f + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    pop = Math.max(pop, interpolate(f - k.f, [0, 4, 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    v = v + (k.v - v) * u;
  }
  return { v, pop };
};

// entrada suave de un recurso (aparece con resorte y se va con fundido)
const useEntrada = (desde = 0, hasta = 1e9) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return { f, s, o };
};

export type Linea = { etiqueta: string; claves: { f: number; v: number; d?: number }[] | number | string; color: string };
// Contador de esquina: renglones etiqueta + valor de color (estilo Monk Mode / Awaken)
export const Contador: React.FC<{ lineas: Linea[]; x?: number; y?: number; tam?: number; desde?: number; hasta?: number; alinear?: "izq" | "der" }> = ({ lineas, x = 92, y = 70, tam = 46, desde = 0, hasta, alinear = "izq" }) => {
  const { f, s, o } = useEntrada(desde, hasta);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: alinear === "izq" ? x : undefined, right: alinear === "der" ? x : undefined, top: y, opacity: o, transform: `translateY(${(1 - s) * 14}px)`, fontFamily: F_HUD, fontWeight: 500, fontSize: tam, lineHeight: 1.18, color: "#e9e3d6", textShadow: sombraTxt, letterSpacing: 0.5 }}>
        {lineas.map((l, i) => {
          const val = typeof l.claves === "object" ? valorEn(l.claves, f) : { v: l.claves, pop: 0 };
          return (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {l.etiqueta}{" "}
              <span style={{ color: l.color, display: "inline-block", transform: `scale(${1 + 0.12 * val.pop})`, transformOrigin: "0% 70%" }}>
                {typeof val.v === "number" ? fmt(val.v) : val.v}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Etiqueta tipo hoja de calendario: «+75 YEARS», «DAY 15»
export const Calendario: React.FC<{ texto: string; x?: number; y?: number; desde?: number; hasta?: number; acento?: string; tam?: number }> = ({ texto, x = 1500, y = 70, desde = 0, hasta, acento = "#e2483a", tam = 44 }) => {
  const { s, o } = useEntrada(desde, hasta);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${(1 - s) * -6}deg) scale(${0.8 + 0.2 * s})`, transformOrigin: "50% 0%" }}>
      <div style={{ background: "#f6f1e6", borderRadius: 10, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
        <div style={{ height: 12, background: acento, display: "flex", justifyContent: "space-between", padding: "0 18px" }}>
          <div style={{ width: 8, height: 8, background: "#5a1c16", borderRadius: 4, marginTop: 2 }} />
          <div style={{ width: 8, height: 8, background: "#5a1c16", borderRadius: 4, marginTop: 2 }} />
        </div>
        <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#2a2420", padding: "6px 22px 8px" }}>{texto}</div>
      </div>
    </div>
  );
};

// Temporizador en píldora oscura: «⏱ 00:40». seg = segundos mostrados (puede venir de valorEn)
export const Temporizador: React.FC<{ seg: number; x?: number; y?: number; desde?: number; hasta?: number; color?: string; tam?: number; centesimas?: boolean }> = ({ seg, x = 1640, y = 56, desde = 0, hasta, color = "#f4efe4", tam = 34, centesimas }) => {
  const { s, o } = useEntrada(desde, hasta);
  const m = Math.floor(seg / 60), ss = Math.floor(seg % 60), cc = Math.floor((seg * 100) % 100);
  const txt = `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}${centesimas ? "." + String(cc).padStart(2, "0") : ""}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.85 + 0.15 * s})`, display: "flex", alignItems: "center", gap: 10, background: "rgba(16,14,20,0.82)", borderRadius: 40, padding: "8px 20px 8px 14px", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color, fontVariantNumeric: "tabular-nums", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}>
      <svg width={tam * 0.9} height={tam * 0.9} viewBox="0 0 24 24"><circle cx="12" cy="13" r="9" fill="none" stroke={color} strokeWidth="2.4" /><path d="M12 13 L12 8.5 M10 2.5 L14 2.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" /></svg>
      {txt}
    </div>
  );
};

// Número gigante con rótulo (IFShift: «STRANGERS WATCHING 2,710,000»)
export const GranNumero: React.FC<{ rotulo: string; claves: { f: number; v: number; d?: number }[]; x?: number; y?: number; color?: string; sufijo?: string; desde?: number; hasta?: number; tam?: number; dec?: number }> = ({ rotulo, claves, x = 960, y = 80, color = "#ffc93c", sufijo = "", desde = 0, hasta, tam = 92, dec = 0 }) => {
  const { f, s, o } = useEntrada(desde, hasta);
  const { v, pop } = valorEn(claves, f);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.9 + 0.1 * s + 0.05 * pop})`, opacity: o, textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 600, fontSize: tam * 0.3, letterSpacing: 3, color: "#f3ead2", textShadow: sombraTxt }}>{rotulo}</div>
      <div style={{ fontWeight: 600, fontSize: tam, color, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 26px ${color}88, 0 3px 0 rgba(0,0,0,0.4)` }}>{dec ? v.toFixed(dec) : fmt(v)}{sufijo}</div>
    </div>
  );
};

// Texto escrito a mano (voz interior): las letras aparecen una a una con trazo, cada una apenas torcida
export const TextoMano: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; vel?: number; rot?: number; brillo?: boolean; centro?: boolean }> = ({ texto, x, y, desde, hasta, color = "#ff5fae", tam = 64, vel = 1.6, rot = -4, brillo = true, centro }) => {
  const f = useF();
  const n = Math.max(0, (f - desde) * (vel / 2));
  const o = hasta ? interpolate(f, [hasta - 12, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `${centro ? "translateX(-50%) " : ""}rotate(${rot}deg)`, textAlign: centro ? "center" : undefined, fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.05, color, opacity: o, whiteSpace: "pre", textShadow: brillo ? `0 0 14px ${color}99` : "0 3px 0 rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.7)" }}>
      {texto.split("\n").map((lin, r, arr) => {
        const base = arr.slice(0, r).reduce((a, l) => a + l.length + 3, 0); // cada renglón arranca después del anterior (+pausa)
        return (
          <div key={r}>
            {lin.split("").map((c, j) => {
              const i = base + j;
              const a = Math.min(1, Math.max(0, n - i));
              return <span key={j} style={{ display: "inline-block", opacity: a, transform: `translateY(${(1 - a) * 6}px) rotate(${((i * 37) % 7) - 3}deg)`, clipPath: `inset(0 ${(1 - a) * 100}% 0 0)` }}>{c === " " ? " " : c}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Globo de diálogo con cola hacia el que habla (coordenadas de pantalla)
export const Globo: React.FC<{ texto: string; x: number; y: number; desde: number; hasta: number; cola?: "izq" | "der" | "abajo"; tam?: number; fondo?: string; color?: string; pensamiento?: boolean }> = ({ texto, x, y, desde, hasta, cola = "abajo", tam = 40, fondo = "#fbf8f1", color = "#221c18", pensamiento }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 190 } });
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], { extrapolateLeft: "clamp" });
  const colaD = cola === "abajo" ? "M30,0 L44,26 L58,0 Z" : cola === "izq" ? "M0,18 L-26,40 L0,34 Z" : "M0,18 L26,40 L0,34 Z";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: cola === "abajo" ? "30% 110%" : "50% 100%", opacity: o }}>
      <div style={{ position: "relative", background: fondo, color, fontFamily: F_GLOBO, fontSize: tam, padding: "10px 22px 12px", borderRadius: pensamiento ? 40 : 22, border: "3px solid #221c18", whiteSpace: "nowrap", boxShadow: "0 5px 14px rgba(0,0,0,0.28)" }}>
        {texto}
        {!pensamiento && (
          <svg width={90} height={44} style={{ position: "absolute", left: cola === "der" ? "100%" : cola === "izq" ? -2 : 10, top: cola === "abajo" ? "100%" : 6, marginTop: cola === "abajo" ? -3 : 0, overflow: "visible" }}>
            <path d={colaD} fill={fondo} stroke="#221c18" strokeWidth={3} strokeLinejoin="round" />
            {cola === "abajo" && <rect x={28} y={-4} width={32} height={6} fill={fondo} />}
          </svg>
        )}
        {pensamiento && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 40 - i * 18, top: `calc(100% + ${6 + i * 16}px)`, width: 18 - i * 6, height: 18 - i * 6, borderRadius: 20, background: fondo, border: "3px solid #221c18" }} />)}
      </div>
    </div>
  );
};

// Píldora de dato con borde (Awaken: «≈ 1-2 hidden 'lethal' mutations per person»)
export const Pildora: React.FC<{ texto: string; x?: number; y?: number; desde: number; hasta?: number; color?: string; tam?: number }> = ({ texto, x = 960, y = 60, desde, hasta, color = "#f1d36b", tam = 34 }) => {
  const { s, o } = useEntrada(desde, hasta);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) translateY(${(1 - s) * -12}px)`, opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: tam, color: "#f6f0e2", border: `3px solid ${color}`, borderRadius: 40, padding: "6px 22px", background: "rgba(10,14,30,0.55)", whiteSpace: "nowrap" }}>
      {texto}
    </div>
  );
};

export const Fuente: React.FC<{ texto: string; desde: number; hasta?: number }> = ({ texto, desde, hasta }) => {
  const { o } = useEntrada(desde, hasta);
  return <div style={{ position: "absolute", left: 48, bottom: 30, opacity: o * 0.75, fontFamily: F_HUD, fontSize: 20, color: "#d8d2c4" }}>{texto}</div>;
};

// Panel de HUD neón (IFShift «RANDOM PARTNER»): marco translúcido con título; el contenido va de children
export const PanelHUD: React.FC<{ titulo: string; x: number; y: number; w: number; h: number; desde: number; hasta?: number; color?: string; children?: React.ReactNode }> = ({ titulo, x, y, w, h, desde, hasta, color = "#4fe0b8", children }) => {
  const { s, o } = useEntrada(desde, hasta);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${0.94 + 0.06 * s})`, border: `2px solid ${color}66`, borderRadius: 26, background: "rgba(14,28,64,0.55)", boxShadow: `0 0 40px ${color}22 inset` }}>
      <div style={{ textAlign: "center", marginTop: 18, fontFamily: F_HUD, fontWeight: 600, fontSize: 30, letterSpacing: 4, color }}>{titulo}</div>
      {children}
    </div>
  );
};

// marca de la serie, chiquita (las 4 lo llevan quemado: «Animated Short Film»)
export const MarcaCorto: React.FC<{ texto?: string; color?: string }> = ({ texto = "Animated Short Film", color = "#efe8da" }) => (
  <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: F_HUD, fontWeight: 500, fontSize: 22, letterSpacing: 2, color, opacity: 0.55 }}>{texto}</div>
);

// Etiqueta que flota sobre un personaje y lo sigue: número grande + rótulo («38 / REAL AGE»). x, y = punto de pantalla
// (sacarlo con enPantalla(claves, f, fps, actor.x, PISO - altura)); claves = el valor que rueda.
export const EtiquetaFlotante: React.FC<{ x: number; y: number; rotulo: string; claves: { f: number; v: number; d?: number }[] | number; sufijo?: string; color?: string; desde?: number; hasta?: number; tam?: number; dec?: number }> = ({ x, y, rotulo, claves, sufijo = "", color = "#7dff6a", desde = 0, hasta, tam = 64, dec = 0 }) => {
  const { f, s, o } = useEntrada(desde, hasta);
  const v = typeof claves === "number" ? claves : valorEn(claves, f).v;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-100%) scale(${0.7 + 0.3 * s})`, transformOrigin: "50% 100%", textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>
      <div style={{ fontWeight: 600, fontSize: tam, lineHeight: 1, color, fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{sufijo}</div>
      <div style={{ fontWeight: 500, fontSize: tam * 0.36, letterSpacing: 3, color: "#f4efe4", marginTop: 2 }}>{rotulo}</div>
      <div style={{ width: 3, height: tam * 0.4, background: color, margin: "6px auto 0", borderRadius: 2, opacity: 0.8 }} />
    </div>
  );
};

// Reloj del día en píldora: «5:12 AM». min = minutos desde la medianoche (puede rodar con valorEn)
export const RelojDia: React.FC<{ min: number; x?: number; y?: number; desde?: number; hasta?: number; color?: string; tam?: number }> = ({ min, x = 1640, y = 56, desde = 0, hasta, color = "#f4efe4", tam = 38 }) => {
  const { s, o } = useEntrada(desde, hasta);
  const m = ((Math.floor(min) % 1440) + 1440) % 1440, h = Math.floor(m / 60), h12 = h % 12 === 0 ? 12 : h % 12;
  const txt = `${h12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  const a = ((m % 720) / 720) * 360, b = ((m % 60) / 60) * 360;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.85 + 0.15 * s})`, display: "flex", alignItems: "center", gap: 12, background: "rgba(16,14,20,0.82)", borderRadius: 40, padding: "8px 22px 8px 14px", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}>
      <svg width={tam} height={tam} viewBox="-12 -12 24 24"><circle r="10" fill="none" stroke={color} strokeWidth="2.2" /><path d="M0,0 L0,-5.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${a})`} /><path d="M0,0 L0,-8" stroke={color} strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${b})`} /></svg>
      {txt}
    </div>
  );
};
