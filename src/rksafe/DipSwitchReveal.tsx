// DipSwitchReveal.tsx — "ABRÍ LA TAPA DEL CONTROL" (canal Ray Kessler, rkremote).
//
// Un control viejo, dibujado en SVG visto desde atrás. La cámara virtual se acerca, la tapa de la pila
// se DESLIZA y se va, y adentro aparece la placa con la hilera de micro-interruptores (arriba/abajo).
// Un barrido de luz los recorre uno por uno, se encierran en un recuadro rojo y cae la etiqueta:
// "FIXED CODE". Es la prueba casera más simple de si tu abridor es viejo.
// ⛔ Tiempos como FRACCIÓN de la duración. Patrón de interruptores determinista (hash del seed).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, rnd, PhotoBed, Keyring } from "./RayStage";

export const DipSwitchReveal: React.FC<{
  kicker?: string;
  title?: string;
  tag?: string;
  sub?: string;
  switches?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "OPEN THE BATTERY COVER",
  title = "A row of tiny switches?",
  tag = "FIXED CODE",
  sub = "Same code every click",
  switches = 10,
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
  const zoom = ease(0.04, 0.3);
  const tapa = ease(0.26, 0.44, Easing.inOut(Easing.cubic));
  const scan = ease(0.46, 0.72, Easing.linear);
  const marco = ease(0.72, 0.8);
  const tagA = ease(0.78, 0.86, Easing.out(Easing.back(1.6)));

  const W = 520, H = 820;                       // el control
  const cx = 1180, cy = 560;
  const z = interpolate(zoom, [0, 1], [0.72, 1.0]);
  const sw = Math.max(6, Math.min(12, switches));
  const patron = Array.from({ length: sw }, (_, i) => rnd(4242 + i * 17) < 0.5);
  const bayX = -W / 2 + 60, bayY = -H / 2 + 170, bayW = W - 120, bayH = 470;
  const swW = (bayW - 60) / sw;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.82} />
      <div style={{ position: "absolute", left: 96, top: 90, width: 640, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 1.05, color: V.white, marginTop: 8 }}>{title}</div>
      </div>
      <div style={{
        position: "absolute", left: 96, top: 560, opacity: tagA, transform: `scale(${interpolate(tagA, [0, 1], [1.4, 1])}) rotate(-3deg)`, transformOrigin: "left center",
        padding: "14px 28px", border: `5px solid ${V.danger}`, borderRadius: 10, fontFamily: F_DISPLAY, fontSize: 70, letterSpacing: 3, color: V.dangerSoft,
        background: rgba(V.ink0, 0.6),
      }}>{tag}</div>
      <div style={{ position: "absolute", left: 100, top: 700, width: 560, opacity: tagA, fontFamily: F_BODY, fontSize: 32, color: V.bone }}>
        {sub}
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <defs>
          <linearGradient id="dsr_case" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A9A9AE" /><stop offset="1" stopColor="#6C6C72" />
          </linearGradient>
          <linearGradient id="dsr_pcb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1F5A3A" /><stop offset="1" stopColor="#123B26" />
          </linearGradient>
        </defs>
        <g transform={`translate(${cx} ${cy}) scale(${z.toFixed(4)})`} opacity={head}>
          {/* carcasa */}
          <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={60} fill="url(#dsr_case)" stroke="#2A2A2E" strokeWidth={6} />
          <rect x={-W / 2 + 26} y={-H / 2 + 24} width={W - 52} height={60} rx={20} fill="rgba(255,255,255,.12)" />
          {/* clip del visor */}
          <rect x={-60} y={-H / 2 - 30} width={120} height={60} rx={14} fill="#55555B" />
          {/* bahía: placa verde con componentes */}
          <rect x={bayX} y={bayY} width={bayW} height={bayH} rx={18} fill="url(#dsr_pcb)" />
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={bayX + 30} y1={bayY + 40 + i * 20} x2={bayX + bayW - 40 - i * 30} y2={bayY + 40 + i * 20} stroke="rgba(200,160,70,.35)" strokeWidth={3} />
          ))}
          {/* pila */}
          <rect x={bayX + 40} y={bayY + 300} width={bayW - 80} height={120} rx={20} fill="#C9C9CE" stroke="#8C8C94" strokeWidth={4} />
          <text x={bayX + bayW / 2} y={bayY + 372} textAnchor="middle" fill="#6C6C72" fontFamily={F_DISPLAY} fontSize={40}>+</text>
          {/* los micro-interruptores */}
          <rect x={bayX + 20} y={bayY + 170} width={bayW - 40} height={110} rx={10} fill="#1B1B1F" />
          {patron.map((up, i) => {
            const x = bayX + 30 + i * swW;
            const lit = clamp01(1 - Math.abs(scan * sw - (i + 0.5)) * 0.9);
            return (
              <g key={i}>
                <rect x={x + 4} y={bayY + 180} width={swW - 8} height={90} rx={5} fill={rgba("#FFFFFF", 0.1 + lit * 0.35)} />
                <rect x={x + 10} y={up ? bayY + 188 : bayY + 226} width={swW - 20} height={36} rx={4} fill={lit > 0.2 ? V.brassSoft : "#F4F1E9"} />
              </g>
            );
          })}
          {/* recuadro rojo */}
          <rect x={bayX + 12} y={bayY + 162} width={bayW - 24} height={126} rx={14} fill="none" stroke={V.danger} strokeWidth={7}
            strokeDasharray={`${2 * (bayW - 24 + 126)}`} strokeDashoffset={`${2 * (bayW - 24 + 126) * (1 - marco)}`} />
          {/* la tapa que se desliza */}
          <g transform={`translate(0 ${interpolate(tapa, [0, 1], [0, H * 0.95])})`} opacity={1 - clamp01((tapa - 0.7) / 0.3)}>
            <rect x={bayX - 6} y={bayY - 6} width={bayW + 12} height={bayH + 12} rx={20} fill="#7E7E84" stroke="#4A4A50" strokeWidth={4} />
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={bayX + bayW / 2 - 40} y1={bayY + bayH - 70 + i * 12} x2={bayX + bayW / 2 + 40} y2={bayY + bayH - 70 + i * 12} stroke="#5A5A60" strokeWidth={4} />
            ))}
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
