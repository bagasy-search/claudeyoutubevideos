// SensorPulse.tsx — el SENSOR DE CONTACTO de ventana, explicado (canal Ray Kessler · rkwindow).
//
// Tiempos relativos a la duración:
//   0-25 %  el marco y la hoja se dibujan; las dos piezas del sensor (imán en la hoja, cuerpo en el
//           marco) aparecen con su línea de campo punteada entre ellas: "armed".
//   30-45 % la hoja se desliza y las piezas se SEPARAN: la línea de campo se corta.
//   45-90 % ondas de sonido concéntricas salen del cuerpo (latón → rojo), el marco vibra, el medidor
//           de "noise" se llena. Sin cifras de decibeles inventadas.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Kick, Head, Keyring } from "./RayStage";

const ease = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const SensorPulse: React.FC<{
  title?: string;
  caption?: string;
  armedLabel?: string;
  alarmLabel?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Two pieces. One loud noise.",
  caption = "No system. No monthly bill.",
  armedLabel = "Closed: quiet",
  alarmLabel = "Opened: screams",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? cfg.durationInFrames);
  const draw = ease(frame, 0, D * 0.22, Easing.out(Easing.quad));
  const open = ease(frame, D * 0.3, D * 0.44, Easing.inOut(Easing.cubic));
  const alarm = frame > D * 0.44;
  const titleA = enter(frame, 10);
  const capA = enter(frame - D * 0.72, 12);
  const fr = { x: 520, y: 240, w: 880, h: 560 };
  const sashX = fr.x + 20 + open * 330;
  const sensor = { x: fr.x - 58, y: fr.y + 200 };                 // cuerpo en la JAMBA, al lado del marco
  const magnetX = sashX + 6;                                      // imán en el canto de la hoja que se separa
  const vib = alarm ? Math.sin(frame * 2.4) * 2.5 : 0;
  const meter = alarm ? Math.min(1, (frame - D * 0.44) / (D * 0.18)) : 0;
  const dash = 3000;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.74} />
      <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 50%, ${rgba(V.ink0, 0.2)} 0%, ${rgba(V.ink0, 0.84)} 100%)` }} />
      {alarm ? <AbsoluteFill style={{ background: rgba(V.danger, 0.06 + 0.05 * Math.max(0, Math.sin(frame / 3))) }} /> : null}
      <div style={{ position: "absolute", left: "5.5%", top: "6%", opacity: titleA }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>CONTACT SENSOR</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={60}>{title}</Head>
        </div>
      </div>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${vib.toFixed(2)},0)`}>
          <rect x={fr.x} y={fr.y} width={fr.w} height={fr.h} fill="none" stroke={V.bone} strokeWidth={12} rx={6} strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
          {/* hoja fija a la derecha */}
          <rect x={fr.x + fr.w / 2} y={fr.y + 18} width={fr.w / 2 - 20} height={fr.h - 36} fill={rgba("#BFE3F0", 0.1)} stroke={rgba(V.bone, 0.5)} strokeWidth={3} opacity={draw} />
          {/* hoja móvil */}
          <g opacity={draw}>
            <rect x={sashX} y={fr.y + 18} width={fr.w / 2 - 20} height={fr.h - 36} fill={rgba("#BFE3F0", 0.18)} stroke={V.bone} strokeWidth={5} />
            {/* imán */}
            <rect x={magnetX} y={sensor.y - 22} width={22} height={70} rx={5} fill="#EDEDED" stroke="#8A8A92" strokeWidth={2} />
          </g>
          {/* cuerpo del sensor en el marco */}
          <g opacity={enter(frame - D * 0.12, 8)}>
            <rect x={sensor.x} y={sensor.y - 34} width={40} height={96} rx={7} fill="#F2F2F2" stroke="#8A8A92" strokeWidth={2} />
            <circle cx={sensor.x + 20} cy={sensor.y - 16} r={6} fill={alarm ? (Math.floor(frame / 5) % 2 ? V.danger : "#3A1010") : V.ok} />
          </g>
          {/* campo entre imán y cuerpo */}
          {!alarm ? (
            <line x1={sensor.x + 40} y1={sensor.y + 12} x2={magnetX} y2={sensor.y + 12} stroke={V.ok} strokeWidth={3} strokeDasharray="6 6" opacity={enter(frame - D * 0.16, 8) * (1 - open)} />
          ) : null}
        </g>
        {/* ondas */}
        {alarm ? [0, 1, 2, 3, 4].map((k) => {
          const per = 24;
          const ph = ((frame - D * 0.44 + k * (per / 5)) % per) / per;
          return <circle key={k} cx={sensor.x + 20} cy={sensor.y + 14} r={40 + ph * 520} fill="none" stroke={ph < 0.4 ? rgba(V.brassSoft, 0.8 * (1 - ph)) : rgba(V.danger, 0.8 * (1 - ph))} strokeWidth={6 - ph * 4} />;
        }) : null}
        {/* medidor de ruido */}
        <g opacity={enter(frame - D * 0.44, 8)}>
          <rect x={1520} y={320} width={46} height={420} rx={8} fill={rgba(V.ink0, 0.7)} stroke={rgba(V.bone, 0.6)} strokeWidth={3} />
          <rect x={1526} y={326 + 408 * (1 - meter)} width={34} height={408 * meter} rx={5} fill={V.danger} />
          <text x={1543} y={780} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={30} fill={V.bone} letterSpacing={2}>NOISE</text>
        </g>
        <text x={fr.x + fr.w / 2} y={fr.y + fr.h + 70} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={48} letterSpacing={2}
          fill={alarm ? V.dangerSoft : V.ok} style={{ textTransform: "uppercase" }}>{alarm ? alarmLabel : armedLabel}</text>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "4%", display: "flex", justifyContent: "center", opacity: capA }}>
        <div style={{ padding: "10px 30px", background: rgba(V.ink0, 0.82), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 38, color: V.brassSoft }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
