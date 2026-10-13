// HomeLinkClear.tsx — EL AUTO QUE VENDISTE: botones del techo + "HOME" en el navegador (canal Ray Kessler).
//
// Izquierda: la consola del techo de un auto, con sus tres botones de portón y el LED. Derecha: la
// pantalla del navegador con un mapa esquemático que se dibuja y un pin de CASA.
//   · mode="risk"  — de los botones sale una línea al portón; del pin, una línea a la casa; en el medio
//                    se arma la suma: "your garage + your address". Rojo.
//   · mode="clear" — dos dedos sostienen los botones de los EXTREMOS, un anillo marca el tiempo, el LED
//                    parpadea cada vez más rápido y la memoria queda "CLEARED"; el pin de casa se borra.
// ⛔ "En muchos autos": el procedimiento exacto depende del auto; el componente no da tiempos exactos.
// ⛔ Tiempos como FRACCIÓN de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

export const HomeLinkClear: React.FC<{
  mode?: "risk" | "clear";
  kicker?: string;
  title?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  mode = "risk",
  kicker = "THE CAR YOU SOLD",
  title = "It still knows your garage",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const ease = (a: number, b: number, e = Easing.bezier(0.33, 0, 0.2, 1)) =>
    clamp01(interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e }));

  const head = ease(0, 0.08);
  const consola = ease(0.04, 0.18);
  const mapa = ease(0.12, 0.36);
  const pin = ease(0.3, 0.38, Easing.out(Easing.back(2)));
  const suma = ease(0.5, 0.64);
  const hold = mode === "clear" ? ease(0.28, 0.72, Easing.linear) : 0;
  const dedos = mode === "clear" ? ease(0.22, 0.28) * (1 - ease(0.76, 0.8)) : 0;
  const borrado = mode === "clear" ? ease(0.74, 0.82) : 0;
  const pinFuera = mode === "clear" ? ease(0.8, 0.9) : 0;
  // el LED parpadea cada vez más rápido mientras se sostiene
  const per = interpolate(hold, [0, 1], [26, 5]);
  const led = mode === "clear" ? (hold > 0 && borrado < 0.5 ? (frame % Math.max(3, Math.round(per)) < per / 2 ? 1 : 0.15) : borrado > 0.5 ? 0.15 : 0.6) : 0.5 + 0.5 * Math.sin(frame / 8);
  const acento = mode === "risk" ? V.danger : V.brass;

  // geometría
  const cX = 150, cY = 300, cW = 700, cH = 300;   // consola del techo
  const btn = (i: number) => ({ x: cX + 120 + i * 170, y: cY + 150 });
  const sX = 1030, sY = 250, sW = 760, sH = 470;  // pantalla del navegador
  const homeX = sX + sW * 0.62, homeY = sY + sH * 0.46;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.84} />
      <div style={{ position: "absolute", left: 96, top: 70, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, color: V.white, marginTop: 4 }}>{title}</div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {/* consola del techo */}
        <g opacity={consola} transform={`translate(0 ${(1 - consola) * 40})`}>
          <rect x={cX} y={cY} width={cW} height={cH} rx={60} fill="#2B2B30" stroke="#55555C" strokeWidth={4} />
          <rect x={cX + 40} y={cY + 30} width={cW - 80} height={60} rx={20} fill="#3A3A40" />
          {[0, 1, 2].map((i) => {
            const b = btn(i);
            const apretado = mode === "clear" && (i === 0 || i === 2) ? dedos : 0;
            return (
              <g key={i} transform={`translate(${b.x} ${b.y}) scale(${1 - apretado * 0.06})`}>
                <rect x={-62} y={-40} width={124} height={80} rx={16} fill="#45454C" stroke="#6E6E76" strokeWidth={3} />
                <rect x={-40} y={-10} width={80} height={10} rx={4} fill="#6E6E76" />
                <rect x={-24} y={-26} width={48} height={8} rx={4} fill="#6E6E76" />
              </g>
            );
          })}
          <circle cx={cX + cW / 2} cy={cY + 240} r={12} fill={rgba("#FF5A3C", led)} />
          <circle cx={cX + cW / 2} cy={cY + 240} r={34} fill={rgba("#FF5A3C", led * 0.25)} />
          {/* dedos (dos, uno por botón de los extremos) */}
          {mode === "clear" ? [0, 2].map((i) => {
            const b = btn(i);
            return (
              <g key={i} opacity={dedos} transform={`translate(${b.x} ${b.y + interpolate(dedos, [0, 1], [200, 30])})`}>
                <rect x={-24} y={0} width={48} height={220} rx={24} fill="#C99A7C" />
                <rect x={-16} y={4} width={32} height={16} rx={8} fill="#E8C2A9" />
              </g>
            );
          }) : null}
          {/* anillo del tiempo */}
          {mode === "clear" && hold > 0 && borrado < 1 ? (
            <circle cx={cX + cW / 2} cy={cY + 240} r={50} fill="none" stroke={V.brass} strokeWidth={6}
              strokeDasharray={`${(2 * Math.PI * 50 * hold).toFixed(1)} 999`} transform={`rotate(-90 ${cX + cW / 2} ${cY + 240})`} strokeLinecap="round" />
          ) : null}
        </g>

        {/* pantalla del navegador: mapa esquemático trazo a trazo */}
        <g opacity={consola}>
          <rect x={sX} y={sY} width={sW} height={sH} rx={24} fill="#101418" stroke="#3A3A40" strokeWidth={6} />
          {[
            `M ${sX + 40} ${sY + 120} L ${sX + sW - 40} ${sY + 160}`,
            `M ${sX + 60} ${sY + 380} L ${sX + sW - 60} ${sY + 300}`,
            `M ${sX + 220} ${sY + 30} L ${sX + 280} ${sY + sH - 30}`,
            `M ${sX + 520} ${sY + 30} L ${sX + 470} ${sY + sH - 30}`,
            `M ${sX + 280} ${sY + 250} L ${homeX} ${homeY}`,
          ].map((d, k) => (
            <path key={k} d={d} stroke={k === 4 ? rgba(V.brassSoft, 0.9) : "#2E3A44"} strokeWidth={k === 4 ? 8 : 14} fill="none"
              strokeDasharray="900" strokeDashoffset={900 * (1 - clamp01(mapa * 1.4 - k * 0.1))} strokeLinecap="round" />
          ))}
          {/* pin de casa */}
          <g transform={`translate(${homeX} ${homeY}) scale(${pin * (1 - pinFuera)})`}>
            <path d="M 0 0 C -34 -40, -34 -86, 0 -90 C 34 -86, 34 -40, 0 0 Z" fill={mode === "risk" ? V.danger : V.brass} />
            <path d="M -16 -48 L 0 -64 L 16 -48 L 16 -32 L -16 -32 Z" fill={V.white} />
          </g>
          <text x={homeX} y={homeY + 44} textAnchor="middle" fill={V.white} fontFamily={F_DISPLAY} fontSize={34}
            opacity={pin}>{pinFuera > 0.5 ? "HOME: —" : "HOME"}</text>
        </g>

        {/* la suma (modo riesgo) */}
        {mode === "risk" ? (
          <g opacity={suma}>
            <path d={`M ${btn(1).x} ${cY + cH + 10} C ${btn(1).x} ${cY + cH + 160}, ${sX + 100} ${cY + cH + 200}, ${960} ${900}`} stroke={acento} strokeWidth={5} fill="none" />
            <path d={`M ${homeX} ${sY + sH + 10} C ${homeX} ${sY + sH + 140}, ${1100} ${860}, ${960} ${900}`} stroke={acento} strokeWidth={5} fill="none" />
          </g>
        ) : null}
      </svg>
      {mode === "risk" ? (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", opacity: suma,
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.9)",
        }}>Your garage <span style={{ color: V.danger }}>+</span> your address</div>
      ) : (
        <div style={{
          position: "absolute", left: cX, top: cY + cH + 60, opacity: borrado, transform: `scale(${interpolate(borrado, [0, 1], [1.4, 1])}) rotate(-3deg)`,
          transformOrigin: "left center", padding: "12px 24px", border: `5px solid ${V.ok}`, borderRadius: 10,
          fontFamily: F_DISPLAY, fontSize: 56, letterSpacing: 2, color: V.ok, background: rgba(V.ink0, 0.6),
        }}>BUTTONS CLEARED</div>
      )}
      {mode === "clear" ? (
        <div style={{ position: "absolute", left: cX, top: 250 + 380 + 180, opacity: hold > 0 && borrado < 0.5 ? 1 : 0, fontFamily: F_BODY, fontSize: 32, color: V.bone }}>
          Hold both outside buttons
        </div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
