// GapScanTest.tsx — "EL TEST DE 10 SEGUNDOS" (rkcard): una linterna virtual barre la LUZ entre la
// hoja y el marco, de arriba abajo, y un medidor la lee en vivo.
//   loose — por la rendija se escapa la luz junto al pestillo: el medidor sube a ¼" y marca ROJO;
//           una hoja de papel entra y sube y baja libre.
//   tight — la rendija casi no deja pasar luz: el medidor queda bajo ⅛" y marca VERDE; el émbolo
//           queda apretado contra la placa.
// ⛔ Los valores son ILUSTRATIVOS del guion ("an eighth of an inch, a quarter of an inch"), no una
//    estadística. Tiempos = fracciones de la duración.
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs } from "./LatchKit";

type Mode = "loose" | "tight";
const DEF: Record<Mode, { kicker: string; title: string; caption: string; tone: "danger" | "ok" }> = {
  loose: { kicker: "THE TEN SECOND TEST", title: "Look for daylight", caption: "Daylight by the latch = too much play.", tone: "danger" },
  tight: { kicker: "WHAT YOU WANT TO SEE", title: "Tight, and it stays in", caption: "The plunger lands on the plate.", tone: "ok" },
};

export const GapScanTest: React.FC<{
  mode?: Mode;
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode, kicker, title, caption, bed, durationInFrames }) => {
  const m: Mode = mode ?? "loose";
  const d = DEF[m];
  const { ph, salida, frame } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.16, Easing.out(Easing.cubic));
  const sweep = ph(0.16, 0.66, Easing.inOut(Easing.sin));
  const aCap = ph(0.72, 0.82, Easing.out(Easing.quad));
  const id = "gst";
  const loose = m === "loose";

  // geometría: hoja (izq) · rendija · marco (der)
  const Y0 = 250, Y1 = 900, GX = 900;
  const gapAt = (y: number) => {
    // la rendija se abre junto al pestillo (y≈575) cuando la puerta tiene juego
    const base = loose ? 7 : 3;
    const bulto = loose ? 16 * Math.exp(-Math.pow((y - 575) / 150, 2)) : 1.2 * Math.exp(-Math.pow((y - 575) / 150, 2));
    return base + bulto;
  };
  const beamY = interpolate(sweep, [0, 1], [Y0 + 30, Y1 - 30]);
  const leak = interpolate(gapAt(beamY), [3, 23], [0.15, 1]);
  // medidor: lo que "lee" la linterna, retenido en el máximo
  const maxRead = (() => {
    let mx = 0;
    for (let y = Y0 + 30; y <= beamY; y += 8) mx = Math.max(mx, gapAt(y));
    return mx;
  })();
  const inches = interpolate(maxRead, [0, 23], [0, 0.25]);
  const frac = inches >= 0.2 ? "¼″" : inches >= 0.11 ? "⅛″" : "<1/16″";
  const aVer = ph(0.66, 0.74, Easing.out(Easing.back(1.7)));
  const verdictColor = loose ? V.danger : V.ok;

  // papel (loose): entra y sube/baja libre
  const pIn = loose ? ph(0.5, 0.62) : 0;
  const pY = 575 + Math.sin(frame / 7) * 70 * ph(0.6, 0.7);
  // émbolo (tight): apretado
  const aPl = !loose ? ph(0.6, 0.7) : 0;

  const path = (xOff: number, sign: number) => {
    const pts: string[] = [];
    for (let y = Y0; y <= Y1; y += 10) pts.push(`${GX + xOff + sign * gapAt(y) / 2},${y}`);
    return pts;
  };
  const left = path(0, -1), right = path(0, 1);

  return (
    <DiagramStage bed={bed} kicker={kicker ?? d.kicker} title={title ?? d.title} caption={caption ?? d.caption}
      captionTone={d.tone} aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <defs>
          <radialGradient id={`${id}_beam`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          <g transform="translate(-230 -150) scale(1.26)">
          {/* hoja de la puerta vista desde ADENTRO */}
          <polygon points={`420,${Y0} ${left.join(" ")} 420,${Y1}`} fill={`url(#${id}_door)`} />
          <rect x={480} y={330} width={300} height={200} rx={6} fill="none" stroke={rgba("#000", 0.12)} strokeWidth={4} />
          <rect x={480} y={620} width={300} height={220} rx={6} fill="none" stroke={rgba("#000", 0.12)} strokeWidth={4} />
          {/* pomo */}
          <circle cx={820} cy={575} r={40} fill={`url(#${id}_brass)`} stroke={rgba("#000", 0.4)} strokeWidth={2} />
          <circle cx={820} cy={575} r={18} fill={rgba("#000", 0.15)} />
          {/* marco */}
          <polygon points={`${right.join(" ")} 1080,${Y1} 1080,${Y0}`} fill={`url(#${id}_wood)`} />
          {/* rendija: negra, y con la luz que se ESCAPA donde pasa la linterna */}
          <polygon points={`${left.join(" ")} ${[...right].reverse().join(" ")}`} fill="#040405" />
          <rect x={GX - 14} y={beamY - 40} width={28} height={80} fill={rgba("#FFF4D6", 0.9 * leak)} style={{ mixBlendMode: "screen" }} />
          {/* haz de la linterna */}
          <ellipse cx={GX} cy={beamY} rx={190} ry={120} fill={`url(#${id}_beam)`} opacity={0.55 * (sweep > 0 && sweep < 1 ? 1 : 0.3)} />
          {/* papel */}
          {loose && pIn > 0 ? (
            <g opacity={pIn}>
              <rect x={GX - 2} y={pY - 90} width={4} height={180} fill={V.white} />
              <rect x={GX + 6} y={pY - 90} width={170 * pIn} height={180} fill={rgba(V.white, 0.92)} stroke={rgba("#000", 0.2)} />
              <text x={GX + 20} y={pY + 8} fill={V.ink0} style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 24 }} opacity={pIn}>moves freely</text>
            </g>
          ) : null}
          {/* émbolo apretado (tight) */}
          {!loose ? (
            <g opacity={aPl} transform={`translate(1140 ${470 + (1 - aPl) * 16})`}>
              <rect x={0} y={0} width={320} height={210} rx={12} fill={rgba(V.ink0, 0.7)} stroke={rgba(V.ok, 0.6)} strokeWidth={2} />
              <rect x={40} y={70} width={120} height={60} fill={`url(#${id}_brass)`} />
              <rect x={160} y={86} width={8} height={28} fill={V.ok} />
              <rect x={168} y={40} width={14} height={130} fill={`url(#${id}_steel)`} />
              <text x={30} y={195} fill={V.white} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26 }}>plunger stays pressed</text>
            </g>
          ) : null}
          </g>
          {/* medidor */}
          <g transform="translate(1520 330)">
            <rect x={0} y={0} width={250} height={300} rx={14} fill={rgba(V.ink0, 0.72)} stroke={rgba(V.brass, 0.5)} strokeWidth={2} />
            <text x={125} y={52} textAnchor="middle" fill={V.brass} style={{ fontFamily: F_DISPLAY, fontSize: 26, letterSpacing: 4 }}>GAP</text>
            <text x={125} y={160} textAnchor="middle" fill={maxRead > 14 ? V.dangerSoft : V.white} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: frac.length > 3 ? 66 : 96 }}>{frac}</text>
            <rect x={30} y={200} width={190} height={14} rx={7} fill={rgba(V.white, 0.12)} />
            <rect x={30} y={200} width={190 * Math.min(1, inches / 0.25)} height={14} rx={7} fill={maxRead > 14 ? V.danger : V.ok} />
            <text x={125} y={262} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_BODY, fontSize: 22 }}>example</text>
          </g>
          <g opacity={aVer} transform={`translate(1520 ${700 + (1 - aVer) * 18})`}>
            <rect x={0} y={0} width={250} height={70} rx={8} fill={rgba(verdictColor, 0.25)} stroke={verdictColor} strokeWidth={3} />
            <text x={125} y={48} textAnchor="middle" fill={loose ? V.dangerSoft : V.ok} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, letterSpacing: 2 }}>{loose ? "TOO LOOSE" : "TIGHT"}</text>
          </g>
        </g>
      </svg>
    </DiagramStage>
  );
};
