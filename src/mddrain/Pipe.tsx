// Pipe.tsx — LA MATERIA PROPIA del video `mddrain` (canal Mike Dalton, EN).
//
// El video entero pasa dentro de un caño de desagüe. Todo lo que se muestra —la película, el
// sello de agua, la espuma, el cable de la máquina— vive en ESTA materia. Se escribe una vez y
// los seis movimientos la consumen, así seis escenas distintas se leen como el mismo objeto.
//
// ⛔ Nada de Math.random() (el farm rinde en chunks paralelos): todo sale de `rnd()` del Stage.
// ⛔ Nada de backdrop-filter (×5 el render).
//
// Reusa el escenario compartido del canal: `src/mdmold/Stage.tsx` (paleta, cámara, atmósfera,
// vidrio, costuras). Este archivo sólo agrega la materia del desagüe.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, lerp, clamp01, rnd } from "../mdmold/Stage";

// La paleta del desagüe: el gris verdoso graso de la película sobre PVC blanco sucio.
export const DR = {
  pvc: "#C9C6BE",       // el plástico del caño, blanco sucio
  pvcDark: "#8E8B83",
  film: "#2B2A26",      // la película: gris negro grasoso
  filmLit: "#4A473F",
  filmWet: "#5C5648",
  water: "#3E5A63",     // el agua del sifón
  waterLit: "#6E97A2",
  foam: "#F2F4F1",
  steel: "#B9C0C6",     // el cable de la máquina
};

// ── PARED DE CAÑO EN CORTE ──────────────────────────────────────────────────────────────────
// Un tramo vertical de caño visto en corte longitudinal: dos paredes, el hueco en el medio.
// `filmT` 0→1 es cuánta película hay pegada a la pared (0 = limpio, 1 = la capa entera).
// `lit` mueve la luz que entra por arriba (el colador).
export const PipeWall: React.FC<{
  w?: number;            // ancho del hueco interior, en px
  h?: number;
  filmT?: number;
  lit?: number;
  redZone?: number;      // 0→1: cuánto se enciende en rojo el tramo de las 4 pulgadas
  zoneTop?: number;      // % de altura donde arranca la zona roja
  zoneH?: number;        // % de altura de la zona roja
}> = ({ w = 340, h = 760, filmT = 1, lit = 1, redZone = 0, zoneTop = 6, zoneH = 46 }) => {
  const frame = useCurrentFrame();
  const wallW = Math.round(w * 0.26);
  const breathe = 0.94 + Math.sin(frame / 71) * 0.06;

  const wallStyle = (side: "l" | "r"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    [side === "l" ? "left" : "right"]: 0,
    width: wallW,
    height: "100%",
    background:
      side === "l"
        ? `linear-gradient(90deg, ${DR.pvcDark} 0%, ${DR.pvc} 62%, #EFEDE7 100%)`
        : `linear-gradient(270deg, ${DR.pvcDark} 0%, ${DR.pvc} 62%, #EFEDE7 100%)`,
    boxShadow: `inset 0 0 60px rgba(0,0,0,0.45)`,
  });

  // la capa de película, pegada a la cara interna de cada pared
  const filmStyle = (side: "l" | "r"): React.CSSProperties => {
    const t = clamp01(filmT);
    return {
      position: "absolute",
      top: 0,
      [side === "l" ? "left" : "right"]: wallW - 2,
      width: Math.max(0, Math.round(w * 0.09 * t)),
      height: "100%",
      background:
        side === "l"
          ? `linear-gradient(90deg, ${DR.filmWet} 0%, ${DR.film} 40%, ${rgba(DR.film, 0.86)} 100%)`
          : `linear-gradient(270deg, ${DR.filmWet} 0%, ${DR.film} 40%, ${rgba(DR.film, 0.86)} 100%)`,
      filter: `saturate(${0.7 + t * 0.4})`,
      opacity: 0.2 + t * 0.8,
    };
  };

  return (
    <div style={{ position: "relative", width: w, height: h, transformStyle: "preserve-3d" }}>
      {/* el hueco: aire oscuro dentro del caño */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.10 * lit)} 0%, rgba(0,0,0,0.86) 34%, rgba(0,0,0,0.94) 100%)`,
          borderRadius: 3,
        }}
      />
      <div style={wallStyle("l")} />
      <div style={wallStyle("r")} />
      <div style={filmStyle("l")} />
      <div style={filmStyle("r")} />

      {/* textura de la película: grumos determinísticos que respiran */}
      {filmT > 0.05 &&
        Array.from({ length: 26 }, (_, i) => {
          const s = rnd(i * 4.1);
          const s2 = rnd(i * 9.7);
          const side = i % 2 === 0;
          const size = 6 + s * 22;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${2 + s2 * 94}%`,
                [side ? "left" : "right"]: wallW - 4 + s * w * 0.06,
                width: size,
                height: size * (0.5 + s2 * 0.9),
                borderRadius: "42%",
                background: `radial-gradient(circle at 40% 34%, ${DR.filmLit} 0%, ${DR.film} 70%)`,
                opacity: (0.24 + s * 0.4) * clamp01(filmT) * breathe,
                filter: "blur(0.4px)",
              }}
            />
          );
        })}

      {/* la zona roja: las cuatro pulgadas */}
      {redZone > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: `${zoneTop}%`,
            left: 0,
            right: 0,
            height: `${zoneH}%`,
            background: `linear-gradient(90deg, ${rgba(MD.red, 0.34 * redZone)} 0%, ${rgba(MD.red, 0.10 * redZone)} 30%, ${rgba(MD.red, 0.10 * redZone)} 70%, ${rgba(MD.red, 0.34 * redZone)} 100%)`,
            boxShadow: `inset 0 0 90px ${rgba(MD.redHot, 0.4 * redZone)}`,
            borderTop: `2px solid ${rgba(MD.redHot, 0.8 * redZone)}`,
            borderBottom: `2px solid ${rgba(MD.redHot, 0.8 * redZone)}`,
          }}
        />
      )}

      {/* luz de arriba: lo que entra por el colador */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 26% at 50% -6%, ${rgba(MD.cold, 0.4 * lit)} 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// ── EL SELLO DE AGUA ────────────────────────────────────────────────────────────────────────
// El U-bend visto en corte, con el nivel de agua como número (0 = seco, 1 = sellado).
export const TrapSeal: React.FC<{ w?: number; h?: number; level?: number; gas?: number }> = ({
  w = 520,
  h = 320,
  level = 1,
  gas = 0,
}) => {
  const frame = useCurrentFrame();
  const wall = Math.round(w * 0.055);
  const wobble = Math.sin(frame / 23) * 1.6 * level;
  const waterH = Math.round(h * 0.42 * clamp01(level));
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* el tubo en U, dibujado como borde grueso */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `${wall}px solid ${DR.pvc}`,
          borderTop: "none",
          borderBottomLeftRadius: h * 0.9,
          borderBottomRightRadius: h * 0.9,
          boxShadow: `inset 0 0 50px rgba(0,0,0,0.5), 0 26px 60px rgba(0,0,0,0.6)`,
          background: "rgba(0,0,0,0.9)",
          overflow: "hidden",
        }}
      >
        {/* el agua */}
        {waterH > 2 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: waterH,
              background: `linear-gradient(180deg, ${DR.waterLit} 0%, ${DR.water} 40%, #23383E 100%)`,
              opacity: 0.9,
              transform: `translateY(${wobble.toFixed(2)}px)`,
              boxShadow: `inset 0 4px 0 ${rgba(MD.white, 0.22)}`,
            }}
          />
        )}
      </div>
      {/* el gas que sube cuando el sello se fue */}
      {gas > 0.02 &&
        Array.from({ length: 9 }, (_, i) => {
          const s = rnd(i * 6.3);
          const p = ((frame / (70 + s * 50) + s) % 1);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${20 + s * 60}%`,
                bottom: `${18 + p * 90}%`,
                width: 3 + s * 5,
                height: 40 + s * 60,
                borderRadius: 8,
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.red, 0.34 * gas)} 50%, rgba(0,0,0,0) 100%)`,
                opacity: (1 - p) * gas,
                filter: "blur(2px)",
              }}
            />
          );
        })}
    </div>
  );
};

// ── ESPUMA ──────────────────────────────────────────────────────────────────────────────────
// La espuma del peróxido: burbujas que NACEN contra la pared y levantan la película.
export const Foam: React.FC<{
  p?: number;            // 0→1 avance de la espuma
  count?: number;
  x?: number;            // % horizontal del origen
  spread?: number;
}> = ({ p = 1, count = 54, x = 50, spread = 30 }) => {
  const frame = useCurrentFrame();
  const t = clamp01(p);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const s = rnd(i * 2.9);
        const s2 = rnd(i * 7.1);
        const born = s * 0.5;
        const a = clamp01((t - born) / 0.5);
        if (a <= 0) return null;
        const r = 4 + s2 * 22 * a;
        const rise = a * (30 + s * 50);
        const wob = Math.sin(frame / (11 + s * 9) + i) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + (s - 0.5) * spread}%`,
              bottom: `${10 + s2 * 34 + rise * 0.4}%`,
              width: r,
              height: r,
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.96) 0%, ${rgba(DR.foam, 0.72)} 46%, rgba(255,255,255,0.18) 100%)`,
              boxShadow: `inset 0 0 6px rgba(255,255,255,0.6)`,
              opacity: 0.28 + a * 0.6,
              transform: `translateX(${wob.toFixed(2)}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── EL CABLE DE LA MÁQUINA ──────────────────────────────────────────────────────────────────
// Baja por el CENTRO del caño. Nunca toca la pared: ése es el argumento del video.
export const Cable: React.FC<{ p?: number; w?: number; twist?: number }> = ({ p = 0, w = 26, twist = 1 }) => {
  const frame = useCurrentFrame();
  const t = clamp01(p);
  const spin = frame * 9 * twist;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: `${-40 + t * 120}%`,
        transform: "translateX(-50%)",
        width: w,
        height: "72%",
        borderRadius: w,
        background: `repeating-linear-gradient(${(spin % 360).toFixed(1)}deg, ${DR.steel} 0px, #6E7378 4px, ${DR.steel} 9px)`,
        boxShadow: `0 0 22px rgba(0,0,0,0.7), inset -3px 0 6px rgba(0,0,0,0.5), inset 3px 0 6px rgba(255,255,255,0.28)`,
        opacity: t > 0 ? 1 : 0,
      }}
    />
  );
};

// ── RELOJ DE CONTACTO ───────────────────────────────────────────────────────────────────────
// Un contador crudo, tipográfico, que corre mientras algo toca la pared. Es el protagonista
// del movimiento de la gravedad: el número ES el argumento.
export const ContactClock: React.FC<{
  seconds: number;
  label: string;
  color?: string;
  x?: number | string;
  y?: number | string;
  size?: number;
}> = ({ seconds, label, color = MD.white, x = "50%", y = "70%", size = 96 }) => {
  const txt = seconds >= 60 ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : `${seconds.toFixed(1)}s`;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: -2,
          color,
          textShadow: "0 6px 30px rgba(0,0,0,0.9)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {txt}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 700,
          fontSize: Math.round(size * 0.22),
          letterSpacing: 3,
          textTransform: "uppercase",
          color: rgba(color, 0.72),
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Barra horizontal de comparación (tiempo de contacto). Crece con easing propio.
export const CompareBar: React.FC<{
  p: number;
  w: number;              // ancho final en px
  color: string;
  label: string;
  value: string;
  y: number;
}> = ({ p, w, color, label, value, y }) => {
  const t = interpolate(clamp01(p), [0, 1], [0, 1], { easing: Easing.bezier(0.16, 0.8, 0.24, 1) });
  return (
    <div style={{ position: "absolute", left: 120, top: y, display: "flex", alignItems: "center", gap: 22 }}>
      <div
        style={{
          width: 300,
          textAlign: "right",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: rgba(MD.white, 0.8),
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative", height: 26 }}>
        <div
          style={{
            width: Math.max(4, w * t),
            height: 26,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${rgba(color, 0.7)} 0%, ${color} 100%)`,
            boxShadow: `0 0 26px ${rgba(color, 0.45)}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: Math.max(4, w * t) + 16,
            top: -4,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 30,
            color,
            whiteSpace: "nowrap",
            opacity: t > 0.12 ? 1 : 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export { lerp, clamp01, rnd, rgba };
